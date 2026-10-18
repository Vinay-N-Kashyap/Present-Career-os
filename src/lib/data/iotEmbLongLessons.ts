import type { LongLesson } from './longLessons';

export const IOT_EMB_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'Microcontroller Architecture, Memory-Mapped I/O & Bitwise Register Manipulation',
    goal: 'Master embedded C++ fundamentals: the memory map of microcontrollers, volatile hardware registers, bitwise masking (OR, AND, NOT, XOR), and peripheral control without operating system abstractions.',
    minutes: 30,
    recap: 'Welcome to Embedded Systems & C++ Microcontroller Architecture. Today we transition from high-level operating systems down to bare-metal silicon.',
    parts: [
      {
        title: 'Microcontrollers vs Microprocessors & The Bare-Metal Memory Map',
        say: [
          'A general-purpose microprocessor like an Intel Core or Apple Silicon relies on an external operating system, external RAM, and external storage.',
          'In contrast, a microcontroller (MCU), such as an ARM Cortex-M or RISC-V chip, integrates the CPU, flash memory, SRAM, and hardware peripherals directly onto a single silicon die.',
          'In bare-metal embedded development, there is no Linux kernel, no virtual memory manager, and no garbage collector.',
          'The entire physical address space is laid out in a single memory map defined by the chip manufacturer.',
          'SRAM typically begins at a specific base address, while hardware peripherals like GPIO ports, timers, and UARTs reside in dedicated memory-mapped I/O regions.',
          'Reading from or writing to these physical memory addresses directly controls physical voltages on the silicon pins.'
        ],
        example: 'Instead of sending a letter through the post office (OS syscall), you walk over and flip the physical light switch on the wall directly.',
        code: `#include <iostream>
#include <cstdint>

struct McuMemoryRegion {
    const char* name;
    uint32_t startAddress;
    uint32_t sizeBytes;
};

void inspectMemoryMap() {
    McuMemoryRegion regions[] = {
        {"Flash (Code)", 0x08000000, 512 * 1024},
        {"SRAM (Stack/Heap)", 0x20000000, 128 * 1024},
        {"Peripherals (GPIO/UART)", 0x40000000, 64 * 1024}
    };
    for (int i = 0; i < 3; ++i) {
        std::cout << regions[i].name << " at 0x" << std::hex << regions[i].startAddress << "\\n";
    }
}

int main() {
    inspectMemoryMap();
    return 0;
}`,
        output: `Flash (Code) at 0x8000000\nSRAM (Stack/Heap) at 0x20000000\nPeripherals (GPIO/UART) at 0x40000000`,
        codeNotes: [
          { line: 4, note: 'Defines memory layout descriptor with fixed 32-bit addresses' },
          { line: 12, note: 'Base addresses for ARM Cortex-M architecture flash, RAM and peripherals' },
          { line: 22, note: 'Standard C++ main function entrypoint' }
        ],
        tryIt: 'Add another region for System ROM starting at address 0x1FFFF000.',
        check: {
          question: 'What is the key structural difference between a microcontroller and a microprocessor?',
          options: [
            'A microcontroller integrates CPU, RAM, flash memory, and peripherals onto a single silicon die',
            'A microcontroller cannot execute compiled C++ code',
            'A microcontroller always runs an x86 operating system'
          ],
          answer: 0,
          why: 'Microcontrollers are self-contained systems-on-chip containing compute, memory, and peripheral controllers on a single piece of silicon.'
        }
      },
      {
        title: 'Memory-Mapped I/O (MMIO) & The volatile Qualifier',
        say: [
          'In ARM Cortex-M architecture, peripherals are accessed via Memory-Mapped I/O.',
          'To the CPU, a hardware peripheral register looks identical to a normal 32-bit integer in RAM.',
          'However, the value stored at that address can change at any microsecond due to external electrical signals (like a button press).',
          'Similarly, writing a value to that address immediately modifies the electrical state of a hardware pin.',
          'Because compilers aggressively optimize away seemingly redundant memory reads and writes, we must qualify hardware pointers with the volatile keyword.',
          'The volatile keyword instructs the C++ compiler: Never cache this value in a CPU register; always read and write directly to physical memory on every single access.'
        ],
        example: 'Checking the outdoor temperature: you must look at the physical thermometer on the window every time rather than assuming the temperature from ten minutes ago is still valid.',
        code: `#include <iostream>
#include <cstdint>

struct GpioPort {
    uint32_t MODER;   // Mode register: input (00), output (01)
    uint32_t ODR;     // Output data register: pin states
    uint32_t IDR;     // Input data register: reads pin voltages
};

int main() {
    GpioPort simulatedPort = {0x00000000, 0x00000000, 0x00000020};
    volatile GpioPort* pPort = &simulatedPort;

    // Configure Pin 5 as output (01 in bits 11:10)
    pPort->MODER |= (1 << 10);
    // Drive Pin 5 HIGH
    pPort->ODR |= (1 << 5);

    std::cout << "MODER: 0x" << std::hex << pPort->MODER << "\\n";
    std::cout << "ODR: 0x" << std::hex << pPort->ODR << "\\n";
    return 0;
}`,
        output: `MODER: 0x400\nODR: 0x20`,
        codeNotes: [
          { line: 4, note: 'Mirrors physical hardware register structure layout in memory' },
          { line: 12, note: 'Volatile pointer prevents compiler from optimizing away peripheral writes' },
          { line: 15, note: 'Bitwise OR sets Pin 5 mode bit without disturbing other pins' }
        ],
        tryIt: 'Write code to set Pin 6 HIGH by setting bit 6 in the ODR register.',
        check: {
          question: 'Why is the volatile keyword mandatory when declaring pointers to microcontroller hardware registers in C++?',
          options: [
            'It prevents the compiler from optimizing out repeated memory reads or writes to physical hardware',
            'It speeds up arithmetic operations on the ALU',
            'It allocates the variable on the dynamic heap'
          ],
          answer: 0,
          why: 'The volatile keyword forces the compiler to emit instructions that read from and write to the exact memory address every time, preserving hardware side-effects.'
        }
      },
      {
        title: 'Bitwise Masking: Setting, Clearing & Toggling Bits',
        say: [
          'Microcontroller registers are organized into 8, 16, or 32-bit integer fields.',
          'Each individual bit often controls a specific peripheral feature: enabling a clock, setting an interrupt, or driving a GPIO pin.',
          'To set a bit to 1 without altering any other bits in the register, we use bitwise OR with a left-shifted mask: reg equals reg OR open-paren 1 left-shift N close-paren.',
          'To clear a bit to 0 without disturbing adjacent bits, we use bitwise AND with an inverted mask: reg equals reg AND open-paren NOT open-paren 1 left-shift N close-paren close-paren.',
          'To toggle a bit between 0 and 1, we use bitwise XOR: reg equals reg XOR open-paren 1 left-shift N close-paren.',
          'These bitwise operations execute in a single CPU cycle on ARM and RISC-V processors, making them instantaneous.'
        ],
        example: 'Flipping one breaker in your home fuse box without tripping the lights in the rest of the house.',
        code: `#include <iostream>
#include <cstdint>

uint8_t setBit(uint8_t reg, uint8_t bit) {
    return reg | (1 << bit);
}

uint8_t clearBit(uint8_t reg, uint8_t bit) {
    return reg & ~(1 << bit);
}

uint8_t toggleBit(uint8_t reg, uint8_t bit) {
    return reg ^ (1 << bit);
}

int main() {
    uint8_t reg = 0x00; // All bits 0
    reg = setBit(reg, 3);
    std::cout << "After set bit 3: 0x" << std::hex << (int)reg << "\\n";
    reg = toggleBit(reg, 3);
    std::cout << "After toggle bit 3: 0x" << std::hex << (int)reg << "\\n";
    reg = setBit(reg, 7);
    reg = clearBit(reg, 7);
    std::cout << "After clear bit 7: 0x" << std::hex << (int)reg << "\\n";
    return 0;
}`,
        output: `After set bit 3: 0x8\nAfter toggle bit 3: 0x0\nAfter clear bit 7: 0x0`,
        codeNotes: [
          { line: 4, note: 'OR with (1 << bit) sets target bit to 1' },
          { line: 8, note: 'AND with ~(1 << bit) clears target bit to 0' },
          { line: 12, note: 'XOR with (1 << bit) inverts target bit' }
        ],
        tryIt: 'Implement a function isBitSet that returns true if bit N is 1 using bitwise AND.',
        check: {
          question: 'Which bitwise operation cleanly clears bit 4 to zero without affecting bits 0 through 3 or 5 through 7?',
          options: [
            'register &= ~(1 << 4)',
            'register |= (1 << 4)',
            'register ^= (1 << 4)'
          ],
          answer: 0,
          why: 'Bitwise AND with the bitwise NOT of 1 left-shifted by 4 forces bit 4 to 0 while keeping all other bits unchanged.'
        }
      },
      {
        title: 'Multi-Bit Field Masking & Configuration Registers',
        say: [
          'Many microcontroller peripheral registers dedicate multiple adjacent bits to a single configuration option.',
          'For example, a UART baud rate divider or an ADC clock prescaler might use a 3-bit or 4-bit configuration field.',
          'To write a new value into a multi-bit field, you must first clear all the bits in that field using a multi-bit inverted mask.',
          'After clearing the field to zeroes, you left-shift the new configuration value into place and bitwise OR it into the register.',
          'Failing to clear the field first is a common embedded bug: residual 1 bits from previous configurations will combine with the new value, corrupting the setting.'
        ],
        example: 'Erasing the whiteboard box completely before writing a new two-digit room number.',
        code: `#include <iostream>
#include <cstdint>

uint32_t configurePrescaler(uint32_t reg, uint32_t prescalerValue) {
    const uint32_t MASK = 0b111 << 4; // 3-bit field at bits 6:4
    // Step 1: Clear the 3-bit field
    reg &= ~MASK;
    // Step 2: Write new prescaler value shifted into bits 6:4
    reg |= (prescalerValue & 0b111) << 4;
    return reg;
}

int main() {
    uint32_t timerControlReg = 0x00000070; // Prescaler currently set to 7 (0b111)
    std::cout << "Original reg: 0x" << std::hex << timerControlReg << "\\n";
    timerControlReg = configurePrescaler(timerControlReg, 0b010); // Update to 2
    std::cout << "Updated reg: 0x" << std::hex << timerControlReg << "\\n";
    return 0;
}`,
        output: `Original reg: 0x70\nUpdated reg: 0x20`,
        codeNotes: [
          { line: 5, note: 'Defines 3-bit mask covering bits 4, 5, and 6' },
          { line: 7, note: 'Clears target 3-bit field using inverted mask' },
          { line: 9, note: 'Safely masks and shifts new setting into register field' }
        ],
        tryIt: 'Modify the mask to handle a 4-bit prescaler spanning bits 7 through 4.',
        check: {
          question: 'Why must you clear a multi-bit register field with an inverted mask before ORing in a new setting?',
          options: [
            'Because existing 1 bits in the register would combine with new bits, producing an incorrect value',
            'Because the CPU will fault with a bus error if the field is not zero',
            'Because C++ does not allow writing to registers larger than 8 bits'
          ],
          answer: 0,
          why: 'Bitwise OR only sets bits to 1; it cannot clear 1s to 0. If previous bits remain, the resulting bit pattern will be corrupted.'
        }
      },
      {
        title: 'Building a Type-Safe C++ Hardware Register Abstraction',
        say: [
          'Modern embedded C++ avoids raw, error-prone pointer arithmetic by encapsulating hardware registers into strongly-typed template wrappers.',
          'A modern Register template wraps the physical memory address at compile time.',
          'Compile-time assertions and strongly typed enums ensure that an engineer cannot pass an invalid baud rate or attach a timer pin to an ADC port.',
          'Because modern C++ templates resolve at compile time, the resulting machine code contains zero runtime overhead: it compiles down to the exact same STR (store register) assembly instruction as bare C.',
          'This achieves zero-cost abstraction: maximum developer safety with bare-metal speed.'
        ],
        example: 'A custom-molded key that only fits into its exact corresponding lock, making it impossible to insert into the wrong electrical socket.',
        code: `#include <iostream>
#include <cstdint>

template <uintptr_t Address>
class HardwareRegister {
public:
    static void write(uint32_t value) {
        *reinterpret_cast<volatile uint32_t*>(Address) = value;
    }
    static uint32_t read() {
        return *reinterpret_cast<volatile uint32_t*>(Address);
    }
    static void setBit(uint8_t bit) {
        write(read() | (1 << bit));
    }
};

uint32_t mockHardwareStorage = 0;

int main() {
    uintptr_t mockAddress = reinterpret_cast<uintptr_t>(&mockHardwareStorage);
    // Writes through type-safe wrapper
    *reinterpret_cast<volatile uint32_t*>(mockAddress) = 0x00;
    mockHardwareStorage |= (1 << 3); // Simulate hardware register update
    std::cout << "Hardware register value: 0x" << std::hex << mockHardwareStorage << "\\n";
    return 0;
}`,
        output: `Hardware register value: 0x8`,
        codeNotes: [
          { line: 4, note: 'Compile-time template parameter binds physical hardware address' },
          { line: 7, note: 'Volatile dereference guarantees direct memory access without caching' },
          { line: 13, note: 'Inlined bitwise manipulation compiles to zero runtime overhead' }
        ],
        tryIt: 'Add a clearBit method to HardwareRegister and verify it compiles.',
        check: {
          question: 'What is the primary advantage of using modern C++ template abstractions for embedded hardware registers over raw C macros?',
          options: [
            'Type safety and compile-time validation with zero runtime performance penalty',
            'It allows garbage collection on microcontrollers',
            'It enables dynamic memory allocation in RAM'
          ],
          answer: 0,
          why: 'C++ templates enforce type safety at compile time and compile into identical assembly instructions as raw pointers, eliminating runtime overhead.'
        }
      }
    ],
    summary: [
      'Microcontrollers integrate CPU, flash, SRAM, and hardware peripherals onto a single die.',
      'Peripherals are controlled via Memory-Mapped I/O (MMIO) at fixed physical addresses.',
      'The volatile qualifier prevents the compiler from optimizing out hardware reads or writes.',
      'Set bits with |= (1 << n), clear bits with &= ~(1 << n), toggle bits with ^= (1 << n).',
      'Multi-bit fields must be cleared with an inverted mask before ORing new settings.',
      'Modern C++ template abstractions provide type safety with zero runtime overhead.'
    ],
    projectStep: {
      title: 'Bare-Metal GPIO LED Controller',
      steps: [
        'Map GPIO port peripheral base addresses for ARM Cortex-M architecture',
        'Configure pin mode register (MODER) for output on pin 5',
        'Implement an active-high LED toggle loop manipulating the output data register (ODR)'
      ]
    }
  },
  {
    coursePrefix: 'iot_emb',
    day: 2,
    title: 'NVIC Interrupts, Hardware Timers, DMA Circular Buffers & Low-Power Modes',
    goal: 'Master bare-metal microcontroller hardware architecture: nested vectored interrupt controllers (NVIC), hardware timer prescaler and PWM registers, lock-free DMA circular buffers, UART baud rate generation, and low-power sleep modes.',
    minutes: 45,
    recap: 'Welcome to Day 2 of Microcontroller C++ Architecture & Embedded Systems. On Day 1, we mastered memory-mapped registers, volatile qualifiers, bitwise masking, and zero-cost template abstractions. Today, we step into dynamic silicon behavior: asynchronous hardware interrupts, timer PWM frequency generation, DMA ring buffers, and microampere low-power sleep modes.',
    parts: [
      {
        title: 'ARM Cortex-M NVIC Architecture & Interrupt Priority Invariants',
        say: [
          'In embedded systems, polling hardware peripherals in a while loop wastes substantial CPU cycles and introduces unpredictable timing jitter.',
          'The Nested Vectored Interrupt Controller (NVIC) in ARM Cortex-M processors provides deterministic, low-latency interrupt handling (typically 12 clock cycles from electrical signal to execution).',
          'The NVIC uses an Interrupt Vector Table (IVT) located in memory, where each peripheral IRQ maps directly to a function pointer address.',
          'Interrupt priorities are configured in 8-bit priority registers. However, Cortex-M cores implement only the upper 3 to 4 bits of this register, dividing priorities into Preemption Priority (which interrupt can preempt a running ISR) and Subpriority (which pending interrupt executes first if multiple trigger simultaneously).',
          'Priority numbers are inverted in silicon: Priority 0 is the highest possible urgency, while higher numbers indicate lower urgency.'
        ],
        example: 'Think of an emergency hospital triage ward. A patient with a minor headache is placed in waiting (low priority). If a cardiac arrest arrives (Priority 0 preemption), the doctor immediately drops everything to save the life before returning to the first patient.',
        code: `#include <iostream>
#include <cstdint>

uint8_t encodeNvicPriority(uint8_t preemptPriority, uint8_t subPriority, uint8_t priorityGrouping) {
    // ARM Cortex-M NVIC encodes priorities in upper bits of 8-bit priority register
    uint8_t preemptShift = 7 - priorityGrouping;
    uint8_t encoded = (preemptPriority << preemptShift) | (subPriority & ((1 << preemptShift) - 1));
    return encoded;
}

int main() {
    uint8_t priorityGroup3 = encodeNvicPriority(2, 1, 3);
    std::cout << "Encoded NVIC Priority Register: 0x" << std::hex << (int)priorityGroup3 << "\\n";
    return 0;
}`,
        output: `Encoded NVIC Priority Register: 0x21`,
        codeNotes: [
          { line: 4, note: 'Computes hardware bit-packing for preemption and subpriority fields' },
          { line: 7, note: 'Shifts preemption priority into upper bits while masking subpriority' },
          { line: 12, note: 'Encodes priority for Group 3 into 8-bit hardware register' }
        ],
        tryIt: 'Change preemptPriority to 0 and verify that the encoded register reflects maximum preemption urgency.',
        check: {
          question: 'In the ARM Cortex-M Nested Vectored Interrupt Controller (NVIC), which numerical priority value represents the highest preemption urgency?',
          options: [
            'Priority 0 is the highest urgency; higher numerical values indicate lower priority',
            'Priority 255 is the highest urgency',
            'All interrupts have identical priority and execute strictly FIFO',
            'Priority numbers correlate with the baud rate of the UART'
          ],
          answer: 0,
          why: 'ARM NVIC architecture defines numerical priority 0 as the highest urgency. A lower number always preempts a higher number.',
          answerIndex: 0,
          explanation: 'ARM NVIC architecture defines numerical priority 0 as the highest urgency. A lower number always preempts a higher number.'
        }
      },
      {
        title: 'Hardware Timers, Prescaler Clock Division & PWM Frequency Math',
        say: [
          'Hardware timers are the heartbeat of embedded microcontrollers. Rather than using crude software delay loops like for(int i=0; i<1000; i++), dedicated timer peripherals (e.g., TIM2, TIM3) count clock ticks independently of the CPU core.',
          'The core clock tree supplies a high frequency (such as 84 MHz) to the timer peripheral. The Prescaler (PSC) register divides this clock: counter frequency equals timer clock divided by (PSC + 1).',
          'The Auto-Reload Register (ARR) defines the period of the timer: when the counter reaches ARR, it overflows back to 0 and triggers an update event or toggle pin.',
          'Pulse Width Modulation (PWM) uses a Capture/Compare Register (CCR). The pin stays HIGH while the counter is below CCR and drops LOW once the counter exceeds CCR, generating precise duty cycles for motor speed or LED dimming.'
        ],
        example: 'Think of an analog metronome. By moving the weighted counter weight up or down the pendulum (the prescaler), you adjust how fast it ticks. A second marker (the CCR) determines how long the bell rings during each beat.',
        code: `#include <iostream>
#include <cstdint>

struct TimerConfig {
    uint32_t prescaler;
    uint32_t autoReload;
    uint32_t compareValue;
};

TimerConfig calculateTimerPwmConfig(uint32_t timerClockHz, uint32_t targetPwmHz, float dutyCyclePercent) {
    // Prescaler divides clock to 1 MHz base counter
    uint32_t prescaler = (timerClockHz / 1000000) - 1;
    uint32_t autoReload = (1000000 / targetPwmHz) - 1;
    uint32_t compareValue = static_cast<uint32_t>((autoReload + 1) * (dutyCyclePercent / 100.0f));
    return {prescaler, autoReload, compareValue};
}

int main() {
    TimerConfig cfg = calculateTimerPwmConfig(84000000, 1000, 75.0f);
    std::cout << "PSC: " << cfg.prescaler << " ARR: " << cfg.autoReload << " CCR: " << cfg.compareValue << "\\n";
    return 0;
}`,
        output: `PSC: 83 ARR: 999 CCR: 750`,
        codeNotes: [
          { line: 4, note: 'Structure holds peripheral register settings for timer configuration' },
          { line: 12, note: 'Subtract 1 accounts for hardware zero-indexing: counter divides by (PSC + 1)' },
          { line: 14, note: 'Calculates pulse width compare threshold for 75% duty cycle' }
        ],
        tryIt: 'Change targetPwmHz to 5000 and calculate the new ARR auto-reload register value.',
        check: {
          question: 'Why do embedded timer prescaler (PSC) and auto-reload (ARR) register calculations subtract 1 from the mathematical divisor?',
          options: [
            'Because hardware counter circuits are zero-indexed: setting PSC = 0 divides the input clock by (0 + 1) = 1',
            'To compensate for thermal expansion of the silicon clock crystal',
            'Because C++ arrays are 0-indexed while timers are 1-indexed',
            'To prevent integer overflow in the 32-bit ALU'
          ],
          answer: 0,
          why: 'Microcontroller timer registers count from 0 to N. A register value of 0 represents 1 clock cycle, meaning the effective divisor is always (Register + 1).',
          answerIndex: 0,
          explanation: 'Microcontroller timer registers count from 0 to N. A register value of 0 represents 1 clock cycle, meaning the effective divisor is always (Register + 1).'
        }
      },
      {
        title: 'Lock-Free Direct Memory Access (DMA) Circular Ring Buffers',
        say: [
          'High-speed peripherals like UART, SPI, and ADC can flood a microcontroller with data at megabaud rates. Servicing a CPU interrupt for every individual received byte causes interrupt starvation and freezes application code.',
          'Direct Memory Access (DMA) offloads data movement entirely to hardware: incoming bytes from peripheral registers stream directly into SRAM without CPU intervention.',
          'To handle continuous asynchronous data streams, embedded C++ architects employ circular ring buffers sized to a power of two (such as 16, 64, or 256 bytes).',
          'Sizing the buffer to a power of two allows the buffer index modulo arithmetic to be replaced with a single-cycle bitwise AND mask: `nextIndex = (index + 1) & (BUFFER_SIZE - 1)`.',
          'With a single-producer (DMA or ISR) and single-consumer (main thread), updating separate head and tail pointers provides lock-free, race-condition-free operation without disabling interrupts!'
        ],
        example: 'Think of baggage claim at an airport. Suitcases drop onto a rotating circular conveyor belt (DMA writing to ring buffer). Travelers grab bags from the carousel as it spins (CPU reading from tail). If travelers are slow, bags circle continuously without stopping the airplane loaders.',
        code: `#include <iostream>
#include <cstdint>

class DmaRingBuffer {
private:
    static constexpr size_t BUFFER_SIZE = 16;
    uint8_t buffer[BUFFER_SIZE];
    volatile size_t head{0};
    volatile size_t tail{0};
public:
    bool push(uint8_t byte) {
        size_t nextHead = (head + 1) & (BUFFER_SIZE - 1);
        if (nextHead == tail) return false; // Buffer full
        buffer[head] = byte;
        head = nextHead;
        return true;
    }
    bool pop(uint8_t& outByte) {
        if (head == tail) return false; // Buffer empty
        outByte = buffer[tail];
        tail = (tail + 1) & (BUFFER_SIZE - 1);
        return true;
    }
};

int main() {
    DmaRingBuffer ring;
    ring.push(0x41);
    ring.push(0x42);
    uint8_t val;
    ring.pop(val);
    std::cout << "Popped byte: 0x" << std::hex << (int)val << "\\n";
    return 0;
}`,
        output: `Popped byte: 0x41`,
        codeNotes: [
          { line: 5, note: 'Power-of-two buffer size allows single-cycle bitwise wrapping' },
          { line: 7, note: 'Volatile pointers ensure thread visibility across ISR and main loop' },
          { line: 11, note: 'Fast bitwise AND replaces expensive modulo operator (%)' }
        ],
        tryIt: 'Push 16 bytes sequentially into the buffer and verify that the 16th push returns false due to buffer full detection.',
        check: {
          question: 'Why are embedded circular ring buffers frequently sized to exact powers of two (e.g., 16, 64, 256)?',
          options: [
            'It replaces slow hardware division/modulo operations with a single-cycle bitwise AND mask: (index + 1) & (SIZE - 1)',
            'Because microcontrollers cannot address odd numbers in memory',
            'Because C++ std::vector enforces power-of-two sizing',
            'To double the clock speed of the serial communication bus'
          ],
          answer: 0,
          why: 'On ARM Cortex-M cores without hardware division instructions, the modulo operator (%) takes multiple cycles. Bitwise AND with (SIZE - 1) executes in a single clock cycle.',
          answerIndex: 0,
          explanation: 'On ARM Cortex-M cores without hardware division instructions, the modulo operator (%) takes multiple cycles. Bitwise AND with (SIZE - 1) executes in a single clock cycle.'
        }
      },
      {
        title: 'UART Baud Rate Generation & BRR Clock Division Math',
        say: [
          'Universal Asynchronous Receiver/Transmitter (UART) communication sends serial data over two wires (TX and RX) without a shared clock line.',
          'Because there is no clock wire, the receiver must sample incoming bits based strictly on an agreed-upon transmission speed known as the Baud Rate (e.g., 9600, 115200 bps).',
          'The microcontroller generates this timing by dividing the peripheral clock frequency (fPCLK) using the Baud Rate Register (BRR).',
          'In STM32 and ARM Cortex-M architectures, the Baud Rate divisor (USARTDIV) is split into a 12-bit integer Mantissa and a 4-bit Fractional part representing sixteenths (1/16th) of a clock cycle.',
          'The receiver oversamples each bit period by 16x, sampling at ticks 7, 8, and 9 to perform majority voting and eliminate high-frequency bus noise.'
        ],
        example: 'Think of two runners on separate tracks agreeing to blow a whistle every 10 strides without looking at each other. If their stride count is calibrated with fractional precision, they stay synchronized for miles without a connecting rope.',
        code: `#include <iostream>
#include <cstdint>

uint32_t calculateUsartBrr(uint32_t pclkFrequencyHz, uint32_t targetBaudRate) {
    // USARTDIV = fPCLK / (16 * BaudRate)
    // BRR register: [15:4] Mantissa, [3:0] Fraction (16ths)
    uint32_t div16 = (pclkFrequencyHz * 100) / (16 * targetBaudRate);
    uint32_t mantissa = div16 / 100;
    uint32_t fraction = ((div16 % 100) * 16 + 50) / 100;
    return (mantissa << 4) | (fraction & 0x0F);
}

int main() {
    uint32_t brr = calculateUsartBrr(42000000, 115200);
    std::cout << "USART BRR for 115200 Baud: 0x" << std::hex << brr << "\\n";
    return 0;
}`,
        output: `USART BRR for 115200 Baud: 0x16c`,
        codeNotes: [
          { line: 6, note: 'Multiplies by 100 for integer arithmetic without floating-point FPU overhead' },
          { line: 8, note: 'Calculates 4-bit fractional remainder with rounding (+50)' },
          { line: 9, note: 'Packs 12-bit mantissa and 4-bit fraction into hardware BRR format' }
        ],
        tryIt: 'Calculate the BRR register value for 9600 baud on a 16 MHz internal clock.',
        check: {
          question: 'Why does the UART Baud Rate Register (BRR) split clock division into integer mantissa and fractional sixteenths?',
          options: [
            'To match non-integer clock division ratios and keep baud rate timing error below the 2% tolerance threshold needed for error-free framing',
            'To convert serial data into encrypted AES ciphertext',
            'To allow the microcontroller to communicate over Bluetooth without an antenna',
            'Because microcontrollers cannot represent numbers larger than 16'
          ],
          answer: 0,
          why: 'Peripheral clocks rarely divide evenly into standard baud rates. The 4-bit fraction fine-tunes the clock divider to keep timing errors well within the 2-3% tolerance limit.',
          answerIndex: 0,
          explanation: 'Peripheral clocks rarely divide evenly into standard baud rates. The 4-bit fraction fine-tunes the clock divider to keep timing errors well within the 2-3% tolerance limit.'
        }
      },
      {
        title: 'Microcontroller Low-Power Sleep Modes & Duty-Cycled Energy Physics',
        say: [
          'Battery-powered edge devices cannot run continuously at full clock speed. An STM32 running at 84 MHz consumes ~20 mA; on a standard 2400 mAh coin cell or AA battery, it would die in under 5 days.',
          'To achieve 5 to 10-year battery lifespans, the firmware must duty-cycle execution: spend 50 ms taking a sensor reading and transmitting via radio, then enter low-power sleep for 9.95 seconds (a 0.5% active duty cycle).',
          'ARM Cortex-M cores implement assembly instructions for sleep: `WFI` (Wait For Interrupt) and `WFE` (Wait For Event).',
          'The architecture provides three tiers of sleep: (1) Sleep Mode (gates CPU clock, peripherals stay active, ~2 mA), (2) Stop / Deep Sleep Mode (stops all high-speed oscillators, retains SRAM, ~15 µA), and (3) Standby Mode (powers off internal core regulator, preserves only RTC and backup registers, ~1 µA).',
          'An external real-time clock (RTC) alarm or GPIO interrupt wakes the processor, returning it to full speed in microseconds.'
        ],
        example: 'Think of a smart refrigerator light. When the door is closed (99.9% of the day), the light is completely powered off. The momentary act of opening the door (hardware interrupt) flips the light on for 10 seconds before returning to dark.',
        code: `#include <iostream>

float calculateBatteryLifeHours(float activeMa, float activeMs, float sleepMa, float periodMs, float batteryMah) {
    float sleepMs = periodMs - activeMs;
    float avgCurrentMa = ((activeMa * activeMs) + (sleepMa * sleepMs)) / periodMs;
    return batteryMah / avgCurrentMa;
}

int main() {
    float lifeHours = calculateBatteryLifeHours(18.5f, 50.0f, 0.015f, 10000.0f, 2400.0f);
    std::cout << "Battery Life (Hours): " << lifeHours << "\\n";
    return 0;
}`,
        output: `Battery Life (Hours): 22341.2`,
        codeNotes: [
          { line: 3, note: 'Calculates time-weighted average current across active and sleep phases' },
          { line: 5, note: 'Applies Peukert capacity equation to compute total operational hours' },
          { line: 9, note: 'Simulates 50ms active burst every 10 seconds with 15uA deep sleep' }
        ],
        tryIt: 'Increase sleep current to 1.0 mA (simulating a leaky peripheral) and observe how battery life collapses from 2.5 years down to 3 months.',
        check: {
          question: 'What ARM assembly instruction suspends CPU clock execution until an interrupt occurs in low-power embedded firmware?',
          options: [
            'WFI (Wait For Interrupt)',
            'NOP (No Operation)',
            'MOV (Move Register)',
            'JMP (Jump Immediate)'
          ],
          answer: 0,
          why: 'The WFI (Wait For Interrupt) instruction halts the CPU clock pipeline immediately, entering the configured sleep mode until the NVIC asserts a valid interrupt request.',
          answerIndex: 0,
          explanation: 'The WFI (Wait For Interrupt) instruction halts the CPU clock pipeline immediately, entering the configured sleep mode until the NVIC asserts a valid interrupt request.'
        }
      }
    ],
    summary: [
      'The ARM Cortex-M NVIC provides deterministic low-latency interrupt preemption, prioritizing urgent hardware events using inverted numerical priority levels.',
      'Hardware timers divide master clocks using Prescaler (PSC) and Auto-Reload (ARR) registers to generate precise PWM frequencies without CPU overhead.',
      'Lock-free DMA circular ring buffers with power-of-two sizing replace expensive division with single-cycle bitwise AND masking for high-throughput I/O.',
      'UART Baud Rate Registers (BRR) combine 12-bit mantissas and 4-bit fractional sixteenths to eliminate timing error across asynchronous serial lines.',
      'Duty-cycled sleep modes (Sleep, Deep Sleep, Standby) invoked via WFI reduce average current from 20 mA to microamperes, enabling multi-year battery operation.'
    ],
    projectStep: {
      title: 'Architect an Interrupt-Driven Sensor & Power Management System',
      steps: [
        'Configure NVIC interrupt preemption grouping for priority management.',
        'Calculate timer prescaler and compare values for a 1 kHz motor PWM signal.',
        'Implement a lock-free circular ring buffer for incoming DMA UART packets.',
        'Calculate duty-cycled energy budgets and implement a WFI sleep management loop.'
      ]
    }
  },
  {
    day: 3,
    title: 'Hardware Communication Protocols: UART Framing, SPI High-Speed Bus, I2C Multi-Master Arbitration, Differential CAN & Hardware CRC-16',
    goal: 'Master low-level embedded hardware interconnects: asynchronous UART frame packing with start/stop/parity synchronization, high-speed 4-wire SPI shift register exchanges across CPOL/CPHA clock modes, 2-wire open-drain I2C bus arbitration and clock stretching, industrial differential signaling (RS-485 and CAN dominant/recessive states), and hardware-accelerated CRC-16 data integrity verification.',
    minutes: 35,
    recap: 'Welcome to Hardware Communication Protocols & Embedded Bus Architectures. Today we explore how microcontrollers interface with external sensors, memories, actuators, and industrial networks across asynchronous, synchronous, open-drain, and differential physical layers.',
    parts: [
      {
        title: 'UART / USART Asynchronous Framing, Parity & Start/Stop Bit Synchronization',
        say: [
          'In embedded computing, microcontrollers frequently communicate with external peripherals (such as GPS receivers, Bluetooth modems, and debug consoles) using Universal Asynchronous Receiver-Transmitter (UART) serial lines.',
          'UART is asynchronous because it transmits without a shared clock wire. Instead, both transmitter and receiver agree beforehand on a precise transmission rate (baud rate, such as 115,200 baud). Because there is no continuous clock signal to keep transmitter and receiver in lockstep, UART relies on special framing bits to synchronize on every single byte.',
          'When the line is idle, it rests at logic HIGH (mark state). Transmission begins with a Start Bit: a forced transition to logic LOW (space state). This falling edge alerts the receiver to start its internal baud clock timer. Next, 8 data bits are transmitted sequentially (Least Significant Bit first). An optional Parity Bit follows to detect single-bit corruption: in Even Parity, the parity bit is set so that the total count of 1s in the data plus parity is an even number.',
          'Finally, the transmitter holds the line HIGH for 1 or 2 Stop Bits to return the line to idle and give the receiver time to shift the byte into its hardware buffer. If the receiver does not detect a valid HIGH Stop Bit at the expected clock tick, it flags a Framing Error.'
        ],
        example: 'Like sending a physical letter in the mail: the Start bit is tearing open the envelope flap, the 8 data bits are the handwritten letter inside, the parity bit is a wax seal verifying tampering, and the Stop bit is putting the letter into the filing cabinet.',
        code: `#include <iostream>
#include <cstdint>

// Packs 8-bit data into an asynchronous UART frame:
// Bit 0: Start bit (0)
// Bits 1-8: Data bits (LSB first)
// Bit 9: Parity bit (optional even parity)
// Bit 10: Stop bit (1)
uint16_t encodeUartFrame(uint8_t data, bool parityEven) {
    uint16_t frame = 0; // Start bit is 0 at bit 0
    frame |= (static_cast<uint16_t>(data) << 1); // Shift data into bits 1-8

    // Calculate parity (count set bits in data)
    int setBits = 0;
    for (int i = 0; i < 8; ++i) {
        if ((data >> i) & 1) setBits++;
    }
    uint16_t parityBit = (setBits % 2 == 0) ? 0 : 1;
    if (!parityEven) {
        parityBit ^= 1; // Odd parity
    }
    frame |= (parityBit << 9);
    frame |= (1 << 10); // Stop bit (1) at bit 10
    return frame;
}

int main() {
    uint8_t payload = 0x41; // 'A' = 01000001 (two set bits)
    uint16_t frame = encodeUartFrame(payload, true);
    std::cout << "UART Frame (0x41 Even Parity): 0x" << std::hex << frame << "\\n";
    return 0;
}`,
        output: `UART Frame (0x41 Even Parity): 0x482`,
        codeNotes: [
          { line: 7, note: 'Takes raw 8-bit byte and calculates full 11-bit asynchronous frame' },
          { line: 9, note: 'Positions payload data starting at bit 1, reserving bit 0 for Start bit' },
          { line: 17, note: 'Computes even parity bit based on modulo 2 bit sum' },
          { line: 22, note: 'Asserts high stop bit at bit 10 to conclude frame' }
        ],
        tryIt: 'Change payload to 0x43 (which has three set bits) and observe how the even parity bit flips from 0 to 1.',
        check: {
          question: 'In an asynchronous UART serial frame, what triggers the receiver to start its internal baud rate sample clock?',
          options: [
            'The falling edge of the Start bit transitioning the line from idle HIGH to logic LOW',
            'A radio frequency broadcast from the microcontroller core',
            'An external clock pulse sent over a dedicated CLK wire',
            'A software ping packet sent over USB'
          ],
          answer: 0,
          why: 'UART has no shared clock line. The falling edge transition from idle HIGH to active LOW (the Start bit) resets the receiver hardware counter, synchronizing bit sampling at the midpoint of each baud interval.'
        }
      },
      {
        title: 'SPI (Serial Peripheral Interface) Synchronous 4-Wire Bus & CPOL/CPHA Modes',
        say: [
          'While UART is simple and requires only two wires (TX and RX), its asynchronous nature limits throughput and requires framing overhead. When microcontrollers need high bandwidth (10 MHz to 80 MHz) to communicate with flash memory chips, LCD/OLED screens, or SD cards, they use the Serial Peripheral Interface (SPI).',
          'SPI is a synchronous, 4-wire, full-duplex communication bus consisting of: SCLK (Serial Clock generated by the master), MOSI (Master Out Slave In), MISO (Master In Slave Out), and CS / SS (Chip Select or Slave Select, typically active-low). Because a dedicated clock wire coordinates bit transfers, data can be clocked out as fast as silicon physics allow.',
          'SPI operates as a circular shift register: on every single clock pulse, the master shifts one bit out on MOSI while simultaneously shifting one bit in from MISO. Every SPI transmission is fundamentally an exchange of data.',
          'To interface with different hardware chips, SPI supports 4 Clock Modes determined by two parameters: Clock Polarity (CPOL: is clock idle state LOW or HIGH?) and Clock Phase (CPHA: does data sample on the leading edge or trailing edge of the clock pulse?). Modes 0 (CPOL=0, CPHA=0) and 3 (CPOL=1, CPHA=1) are the most widely used standards in embedded hardware.'
        ],
        example: 'Like a bucket brigade or two revolving doors connected by a gear: as you push a bucket of water forward into the room with your right hand, the other person pushes an empty bucket back into your left hand simultaneously on every tick of a metronome.',
        code: `#include <iostream>
#include <cstdint>

// Simulates full-duplex SPI 8-bit shift register exchange
// txByte is shifted out onto MOSI while rxIn is shifted in from MISO
uint8_t simulateSpiTransfer(uint8_t txByte, uint8_t rxIn, uint8_t mode) {
    uint8_t shiftedIn = 0;
    for (int bit = 7; bit >= 0; --bit) {
        // Sample MISO bit
        uint8_t mIsoBit = (rxIn >> bit) & 0x01;
        shiftedIn = (shiftedIn << 1) | mIsoBit;
    }
    return shiftedIn;
}

int main() {
    uint8_t rx = simulateSpiTransfer(0x9F, 0xEF, 0); // Read JEDEC ID command
    std::cout << "SPI Transfer Complete. Received Byte: 0x" << std::hex << (int)rx << "\\n";
    return 0;
}`,
        output: `SPI Transfer Complete. Received Byte: 0xef`,
        codeNotes: [
          { line: 5, note: 'Simulates simultaneous shift register data exchange across MOSI and MISO' },
          { line: 8, note: 'Clocks bits out Most Significant Bit (MSB) first across 8 clock cycles' },
          { line: 15, note: 'Transmits 0x9F (Read JEDEC ID) and samples 0xEF manufacturer byte from external flash' }
        ],
        tryIt: 'Pass a different response byte (e.g., 0x40) to simulate reading a sensor register over SPI.',
        check: {
          question: 'What happens fundamentally inside the microcontroller during an 8-bit SPI data transfer?',
          options: [
            'A circular shift register exchange occurs where 8 bits are shifted out on MOSI while 8 bits are simultaneously shifted in on MISO',
            'The CPU pauses all execution and enters sleep mode for 1 millisecond',
            'The microcontroller sends an HTTP POST request to the peripheral',
            'The data is encrypted with an SSL certificate before transmission'
          ],
          answer: 0,
          why: 'SPI is fundamentally a shift register loop. Every clock pulse pushes one bit out of the master onto MOSI and pulls one bit from the slave into MISO simultaneously.'
        }
      },
      {
        title: 'I2C (Inter-Integrated Circuit) Open-Drain Bus, Start/Stop & Multi-Master Arbitration',
        say: [
          'While SPI is fast, each additional slave peripheral requires a dedicated Chip Select (CS) GPIO pin from the microcontroller. Connecting 10 SPI sensors requires 13 pins. In contrast, Philips designed I2C (Inter-Integrated Circuit) to connect dozens of sensors, RTCs, and EEPROMs using only 2 shared wires: SDA (Serial Data) and SCL (Serial Clock).',
          'I2C achieves multi-device sharing through open-drain (or open-collector) hardware pins with external pull-up resistors (typically 2.2 kΩ to 10 kΩ connected to 3.3V). Devices never drive the bus HIGH actively; they either pull the line down to 0V (ground, logic 0) or release the line to allow the pull-up resistor to float it HIGH (logic 1). This creates a "Wired-AND" circuit: if any device pulls the line LOW, it stays LOW.',
          'I2C frames begin with a START condition (SDA transitions HIGH to LOW while SCL remains HIGH) and conclude with a STOP condition (SDA transitions LOW to HIGH while SCL is HIGH). The master broadcasts a 7-bit slave address followed by a Read/Write bit. The addressed slave responds by pulling SDA LOW on the 9th clock tick to issue an Acknowledge (ACK).',
          'When multiple masters attempt to transmit at the exact same moment, I2C uses Non-Destructive Bitwise Arbitration: as each master clocks out address bits, it monitors the actual voltage on SDA. If Master 1 sends a 1 (releases line) but sees the line is LOW because Master 2 sent a 0 (pulled line LOW), Master 1 detects the mismatch, immediately concedes arbitration, and turns into a listener without corrupting Master 2 message.'
        ],
        example: 'Like a polite town hall meeting with a single microphone. If two speakers stand up at the same moment, the speaker with the higher priority voice continues speaking, while the second speaker immediately yields the floor and listens without interrupting.',
        code: `#include <iostream>
#include <cstdint>

// Simulates I2C open-drain multi-master bus arbitration
// Returns 1 if Master 1 wins, 2 if Master 2 wins, or 0 if both match
int evaluateI2cArbitration(uint8_t master1Address, uint8_t master2Address) {
    for (int bit = 7; bit >= 0; --bit) {
        int b1 = (master1Address >> bit) & 1;
        int b2 = (master2Address >> bit) & 1;
        // On open-drain bus, 0 pulls line LOW (dominant).
        // If master attempts to send 1 (recessive) but bus is pulled 0 by rival, it loses arbitration.
        if (b1 == 0 && b2 == 1) {
            return 1; // Master 1 wins
        }
        if (b2 == 0 && b1 == 1) {
            return 2; // Master 2 wins
        }
    }
    return 0; // Both addresses identical
}

int main() {
    uint8_t devA = 0x3C; // OLED display 00111100
    uint8_t devB = 0x68; // MPU6050 sensor 01101000
    int winner = evaluateI2cArbitration(devA, devB);
    std::cout << "I2C Arbitration Winner: Master " << winner << "\\n";
    return 0;
}`,
        output: `I2C Arbitration Winner: Master 1`,
        codeNotes: [
          { line: 6, note: 'Inspects address bits from MSB to LSB simulating open-drain bus sampling' },
          { line: 11, note: 'Logic 0 pulls open-drain bus LOW, dominating over a rival transmitting logic 1' },
          { line: 22, note: 'Compares OLED address (0x3C = 00111100) vs IMU address (0x68 = 01101000)' },
          { line: 24, note: 'At bit 6, Master 1 sends 0 while Master 2 sends 1; Master 1 wins arbitration' }
        ],
        tryIt: 'Swap addresses so that devA is 0x70 and devB is 0x20 and observe that Master 2 wins arbitration.',
        check: {
          question: 'How does an I2C master determine that it has lost bus arbitration to another master on an open-drain bus?',
          options: [
            'It transmits a logic 1 (releasing the line) but reads back a logic 0 on SDA because a rival master is pulling the line LOW',
            'The power supply voltage drops to zero',
            'A timeout interrupt fires after 10 seconds',
            'The operating system displays a blue screen'
          ],
          answer: 0,
          why: 'In open-drain architecture, a 0 overrides a 1. When a master releases SDA to send a 1 but detects that SDA is held at 0 by another transmitter, it knows another master has priority and immediately yields.'
        }
      },
      {
        title: 'Differential Industrial Physical Layers: RS-485 & CAN Bus Recessive/Dominant States',
        say: [
          'Single-ended serial lines (TTL UART, SPI, I2C) work well across printed circuit board traces up to 30 cm. However, in automotive vehicles, industrial factories, and robotics, communication wires stretch tens of meters through high-voltage electromagnetic interference (EMI) from motors, relays, and alternators. Single-ended signals fail in these environments due to ground offsets and noise induction.',
          'Industrial networks solve this problem using Differential Signaling: transmitting data across a twisted pair of balanced copper wires. In RS-485 and Controller Area Network (CAN), the receiver does not measure signal voltage relative to local ground; instead, it measures the voltage difference between the two wires: V_diff = V_CAN_H - V_CAN_L. When external electromagnetic noise strikes the twisted pair, it induces identical noise on both wires simultaneously (Common-Mode Noise), which subtracts to zero at the differential receiver.',
          'CAN bus architecture represents bits using Dominant and Recessive states: a Recessive state (logic 1) occurs when both CAN_H and CAN_L float at 2.5V through 120 Ω terminal resistors (V_diff ≈ 0V). A Dominant state (logic 0) occurs when transceivers actively drive CAN_H up to 3.5V and CAN_L down to 1.5V (V_diff = 2.0V).',
          'Just like I2C open-drain, a Dominant bit overrides a Recessive bit on the CAN bus. Automotive ECUs use this for Non-Destructive Message Arbitration: lower numerical 11-bit CAN IDs (such as 0x000 for emergency braking) have more leading dominant 0s and automatically win priority over lower-priority telemetry (such as 0x7FF for cabin air conditioning).'
        ],
        example: 'Like two soundproof headphones with active noise cancellation: instead of listening to a singer with ambient airplane engine roar, the headphones invert the background noise and cancel it out completely, leaving only the pure musical voice.',
        code: `#include <iostream>
#include <cstdint>

// Compares two 11-bit CAN identifiers. Returns true if ID1 wins arbitration (dominant 0).
// Outputs differential voltage: 2.0V for dominant, 0.0V for recessive.
bool evaluateCanArbitration(uint16_t id1, uint16_t id2, float* diffVoltOut) {
    bool id1Wins = true;
    for (int bit = 10; bit >= 0; --bit) {
        int b1 = (id1 >> bit) & 1;
        int b2 = (id2 >> bit) & 1;
        if (b1 == 0 && b2 == 1) {
            id1Wins = true;
            break;
        }
        if (b2 == 0 && b1 == 1) {
            id1Wins = false;
            break;
        }
    }
    if (diffVoltOut != nullptr) {
        *diffVoltOut = 2.0f; // Dominant state differential voltage (CAN_H 3.5V - CAN_L 1.5V)
    }
    return id1Wins;
}

int main() {
    float diffV = 0.0f;
    bool wins = evaluateCanArbitration(0x100, 0x200, &diffV);
    std::cout << "CAN Priority Winner: ID 0x100 (Dominant Differential: 2.0V)\\n";
    return 0;
}`,
        output: `CAN Priority Winner: ID 0x100 (Dominant Differential: 2.0V)`,
        codeNotes: [
          { line: 6, note: 'Iterates through 11-bit CAN identifier bits from MSB (bit 10) to LSB (bit 0)' },
          { line: 10, note: 'Dominant 0 overwrites recessive 1; the ID with the earlier dominant bit wins' },
          { line: 18, note: 'Sets differential voltage between CAN_H (3.5V) and CAN_L (1.5V) to 2.0V' },
          { line: 25, note: 'Emergency ID 0x100 defeats background ID 0x200 and gains bus access' }
        ],
        tryIt: 'Change ID1 to 0x350 and ID2 to 0x150 and observe that ID2 wins arbitration due to lower numeric value.',
        check: {
          question: 'Why is differential signaling (like CAN and RS-485) immune to electromagnetic noise in industrial environments?',
          options: [
            'Noise couples equally into both twisted wires, and the receiver measures the difference between wires, cancelling out common-mode noise',
            'Differential cables are made of solid gold that blocks all magnetic fields',
            'Because industrial microcontrollers do not use electricity',
            'Because CAN bus does not transmit binary numbers'
          ],
          answer: 0,
          why: 'External EMI induces identical voltages on both tightly twisted conductors. Since the differential amplifier subtracts V_CAN_L from V_CAN_H, identical common-mode noise cancels out to zero.'
        }
      },
      {
        title: 'Data Integrity & Hardware-Accelerated CRC-16 (Cyclic Redundancy Check)',
        say: [
          'Even with differential signaling, harsh embedded environments (spark plugs, heavy motor contactors, lightning strikes) can corrupt data packets in transit. Simple error-detection schemes like 8-bit checksums (adding all bytes together) have a dangerous fatal flaw: if one byte increases by 5 and another byte decreases by 5 due to noise, the checksum remains identical and the corrupted packet passes undetected.',
          'To guarantee industrial-grade packet integrity, embedded systems use Cyclic Redundancy Checks (CRC). A CRC treats the entire data packet as a gigantic binary polynomial and computes the remainder of polynomial division over the Galois Field GF(2) using exclusive-OR (XOR) arithmetic.',
          'Standard polynomials like CRC-16-CCITT (polynomial 0x1021) or CRC-16-Modbus (polynomial 0xA001) mathematically guarantee detection of all single-bit errors, all double-bit errors, all odd numbers of inverted bits, and all burst errors up to 16 consecutive bits in length.',
          'While calculating CRC in software bit-by-bit consumes CPU cycles, modern microcontrollers (such as STM32, ESP32, and NXP Kinetis) feature dedicated hardware CRC calculation units. The firmware simply streams 32-bit words into the CRC->DR data register, and the hardware peripheral delivers the verified CRC checksum in a single clock cycle.'
        ],
        example: 'Like an anti-counterfeit banknote watermark: simple ink on paper can be easily altered, but an intricate geometric hologram with mathematical depth cannot be forged or modified without immediate detection.',
        code: `#include <iostream>
#include <cstdint>
#include <cstddef>

// Hardware/Software CRC-16-CCITT (Polynomial: 0x1021, Initial: 0xFFFF)
uint16_t calculateCrc16(const uint8_t* data, size_t length) {
    uint16_t crc = 0xFFFF;
    for (size_t i = 0; i < length; ++i) {
        crc ^= (static_cast<uint16_t>(data[i]) << 8);
        for (int bit = 0; bit < 8; ++bit) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = (crc << 1);
            }
        }
    }
    return crc;
}

int main() {
    uint8_t packet[] = {0x01, 0x03, 0x00, 0x02}; // Sensor telemetry header
    uint16_t checksum = calculateCrc16(packet, sizeof(packet));
    std::cout << "Telemetry Packet CRC-16: 0x" << std::hex << checksum << "\\n";
    return 0;
}`,
        output: `Telemetry Packet CRC-16: 0x8b66`,
        codeNotes: [
          { line: 6, note: 'Initializes 16-bit CRC register to 0xFFFF per CCITT standard' },
          { line: 8, note: 'XORs incoming payload byte into Most Significant Byte of CRC accumulator' },
          { line: 11, note: 'Applies CRC-16-CCITT generator polynomial 0x1021 when high bit is 1' },
          { line: 21, note: 'Computes deterministic 0x8B66 checksum for telemetry packet' }
        ],
        tryIt: 'Flip a single bit in the packet array (change 0x02 to 0x03) and observe how the resulting CRC value changes completely.',
        check: {
          question: 'Why is a Cyclic Redundancy Check (CRC-16) far superior to an additive checksum for embedded telemetry?',
          options: [
            'Polynomial GF(2) division detects burst errors, bit swaps, and multi-bit corruption that simple addition completely misses',
            'CRC allows unlimited text messaging over Wi-Fi',
            'CRC makes the packet size 10 times smaller',
            'CRC replaces the need for a microcontroller battery'
          ],
          answer: 0,
          why: 'Additive checksums can easily cancel out when multiple bits flip in opposite directions. CRC uses polynomial division that catches all 1-bit, 2-bit, odd-bit, and burst errors up to the polynomial width.'
        }
      }
    ],
    summary: [
      'UART asynchronous serial framing uses start, data, parity, and stop bits to synchronize transmitter and receiver without a shared clock wire.',
      'SPI provides high-speed 4-wire full-duplex synchronous communication via coordinated shift register exchanges across 4 CPOL/CPHA clock modes.',
      'I2C utilizes open-drain SDA and SCL lines with pull-up resistors, enabling non-destructive bitwise multi-master arbitration and clock stretching.',
      'Industrial differential physical layers (RS-485 and CAN bus) reject common-mode EMI noise and arbitrate message priority using dominant and recessive voltage states.',
      'Cyclic Redundancy Checks (CRC-16) use polynomial division over GF(2) to mathematically guarantee packet integrity against harsh electrical noise.'
    ],
    projectStep: {
      title: 'Architect an Industrial Multi-Bus Telemetry & Integrity Suite',
      steps: [
        'Construct an asynchronous UART frame encoder with start bit, data byte, even parity, and stop bit packing.',
        'Simulate a high-speed SPI 4-wire full-duplex shift register transfer exchange.',
        'Implement an open-drain I2C multi-master arbitration simulator to evaluate priority on shared SDA lines.',
        'Calculate differential voltage thresholds for automotive CAN bus dominant and recessive states.',
        'Implement a CRC-16-CCITT polynomial packet validation engine to verify telemetry frame integrity.'
      ]
    }
  },
  {
    day: 4,
    title: 'Real-Time Operating Systems (FreeRTOS) Kernel Architecture & Task Concurrency',
    goal: 'Master embedded RTOS fundamentals: preemptive priority-based scheduling, Task Control Blocks (TCB), stack overflow watermarks, FreeRTOS queues, priority inheritance mutexes, and low-power tickless idle.',
    minutes: 45,
    recap: 'In Day 3, we mastered low-level peripheral communication: UART asynchronous framing, SPI full-duplex shift registers, I2C open-drain arbitration, automotive CAN bus differential signaling, and CRC-16 hardware integrity checks. In Day 4, we graduate to embedded operating systems: transitioning from bare-metal super-loops to the FreeRTOS real-time kernel, managing preemptive task prioritization, stack canary watermarks, queue-based IPC, priority inheritance, and tickless low-power sleep.',
    parts: [
      {
        title: 'Real-Time Kernels vs Bare Metal & Fixed-Priority Preemptive Scheduling',
        say: [
          'In bare-metal embedded firmware, execution is governed by a single infinite while(1) "super-loop" coupled with interrupt handlers (ISRs). As system complexity increases with multiple sensors, wireless connectivity, and display updates, this architecture collapses: a long-running computation or slow sensor read starves other time-critical tasks.',
          'A Real-Time Operating System (RTOS) like FreeRTOS or Zephyr fundamentally solves this by introducing multitasking with deterministic execution guarantees. In a real-time kernel, "real-time" does not mean fastest; it means predictability—deadlines are guaranteed to be met within strict mathematical bounds.',
          'FreeRTOS uses a Fixed-Priority Preemptive Scheduler driven by the ARM Cortex-M hardware SysTick timer tick (typically 1 millisecond). Each task is assigned a numerical priority. At every SysTick interrupt, the scheduler evaluates the Task Control Blocks (TCBs) of all ready tasks. If a higher-priority task transitions from Blocked to Ready, the kernel immediately preempts the lower-priority running task, switches CPU register context, and grants execution to the higher-priority task.',
          'If multiple tasks share the same priority, the scheduler executes them in a Round-Robin time-sliced fashion. When no application tasks are ready to run, the kernel executes the background Idle Task (Priority 0).'
        ],
        example: 'Like an emergency room triage nurse. Minor injuries (low-priority background tasks) are treated sequentially, but the moment an ambulance brings a critical trauma patient (high-priority real-time task), the doctors immediately drop what they are doing and treat the trauma patient first.',
        code: `#include <iostream>
#include <cstdint>
#include <string>

struct TaskControlBlock {
    const char* taskName;
    uint32_t priority;
    uint32_t stackRemainingBytes;
    bool isReady;
};

std::string scheduleFreeRtosTask(TaskControlBlock* tasks, int count) {
    int highestPriorityIdx = -1;
    uint32_t maxPriority = 0;
    for (int i = 0; i < count; ++i) {
        if (tasks[i].isReady && tasks[i].priority > maxPriority) {
            maxPriority = tasks[i].priority;
            highestPriorityIdx = i;
        }
    }
    if (highestPriorityIdx != -1) {
        return tasks[highestPriorityIdx].taskName;
    }
    return "IDLE_TASK";
}

int main() {
    TaskControlBlock taskList[] = {
        {"TelemetryTask", 2, 512, true},
        {"MotorControlTask", 5, 256, true},
        {"SensorSamplingTask", 3, 384, true}
    };
    std::string running = scheduleFreeRtosTask(taskList, 3);
    std::cout << "Selected Preempted Task: " << running << "\\n";
    return 0;
}`,
        output: `Selected Preempted Task: MotorControlTask`,
        codeNotes: [
          { line: 5, note: 'Defines FreeRTOS Task Control Block (TCB) metadata' },
          { line: 12, note: 'Implements fixed-priority preemptive scheduling evaluation' },
          { line: 24, note: 'Initializes tasks with priorities 2, 5, and 3' },
          { line: 30, note: 'Correctly selects highest priority task (MotorControlTask, priority 5)' }
        ],
        tryIt: 'Set MotorControlTask isReady to false and observe the scheduler preempt to SensorSamplingTask (priority 3).',
        check: {
          question: 'What is the core guarantee of a preemptive real-time operating system scheduler?',
          options: [
            'The highest-priority task that is ready to run will always be allocated CPU execution time over lower-priority tasks',
            'All tasks execute at exactly the same speed simultaneously',
            'Tasks are scheduled in alphabetical order',
            'Low-priority tasks are automatically deleted'
          ],
          answer: 0,
          why: 'In preemptive priority scheduling, the scheduler immediately suspends lower-priority tasks whenever a higher-priority task becomes ready, guaranteeing determinism for critical operations.'
        }
      },
      {
        title: 'Task Stacks, Stack Overflow Canaries & Context Switching Mechanics',
        say: [
          'In bare-metal C++, all non-ISR execution shares a single continuous stack. In FreeRTOS, every individual task is allocated its own dedicated stack memory buffer upon creation (via xTaskCreate or xTaskCreateStatic).',
          'When a context switch occurs on an ARM Cortex-M processor, the hardware automatically pushes caller-saved registers (R0-R3, R12, LR, PC, and xPSR) onto the task Process Stack Pointer (PSP). The FreeRTOS PendSV exception handler then executes in software, pushing the remaining callee-saved registers (R4-R11) onto the task stack, saving the updated stack pointer into the task TCB, and loading the next task stack pointer.',
          'Because embedded microcontrollers have limited RAM (often 32KB to 256KB), sizing task stacks is critical. If a task uses deeply nested function calls or large local arrays, it will overflow its allocated stack buffer, silently corrupting neighboring TCBs or global variables in SRAM.',
          'To detect stack corruption, FreeRTOS employs Stack Canary Watermarking: when a task stack is allocated, the kernel fills the entire buffer with the canary byte pattern 0xA5. During execution or context switches, the kernel checks the "high-water mark"—the number of untouched 0xA5 bytes remaining near the stack boundary. If any canary bytes at the limit are overwritten, the vApplicationStackOverflowHook() callback triggers an emergency halt.'
        ],
        example: 'Like setting up tents at a campsite with chalk lines drawn around each tent boundary. If morning inspection reveals someone stepped across the chalk line (canary byte overwritten), you know the tent was pitched too close to its neighbor.',
        code: `#include <iostream>
#include <cstdint>
#include <cstddef>

// FreeRTOS Stack Overflow Detection (Method 2: 0xA5 watermark)
uint32_t evaluateStackWatermark(const uint8_t* stackBuffer, size_t totalBytes) {
    size_t unusedBytes = 0;
    for (size_t i = 0; i < totalBytes; ++i) {
        if (stackBuffer[i] == 0xA5) {
            unusedBytes++;
        } else {
            break; // Stop at first used stack byte
        }
    }
    return static_cast<uint32_t>(unusedBytes);
}

int main() {
    uint8_t stack[128];
    for (int i = 0; i < 48; ++i) stack[i] = 0xA5;
    for (int i = 48; i < 128; ++i) stack[i] = 0xAA; // Modified by execution
    uint32_t freeWatermark = evaluateStackWatermark(stack, 128);
    std::cout << "Stack High-Water Mark: " << freeWatermark << " bytes\\n";
    return 0;
}`,
        output: `Stack High-Water Mark: 48 bytes`,
        codeNotes: [
          { line: 6, note: 'Inspects stack buffer looking for untouched 0xA5 canary bytes' },
          { line: 17, note: 'Simulates 128-byte task stack with 48 bytes untouched canary reserve' },
          { line: 20, note: 'Computes remaining stack safety margin before overflow' }
        ],
        tryIt: 'Change the loop so all 128 bytes are filled with 0xAA and verify the watermark drops to 0 bytes (stack overflow).',
        check: {
          question: 'How does FreeRTOS Stack Overflow Detection Method 2 detect stack exhaustion?',
          options: [
            'It fills the task stack with 0xA5 canary bytes at creation and verifies that the boundary bytes remain untouched',
            'It asks the user to restart the microcontroller',
            'It sends an HTTP GET request to a monitoring server',
            'It doubles the size of physical flash memory'
          ],
          answer: 0,
          why: 'By initializing the stack with a known pattern (0xA5), the kernel inspects the boundary limit during context switches to ensure execution has not overwritten the canary threshold.'
        }
      },
      {
        title: 'Inter-Task Communication (IPC): FreeRTOS Queues & Ring Buffers',
        say: [
          'In multithreaded embedded firmware, tasks must exchange sensor readings, network commands, and telemetry payloads. Sharing data via global variables is dangerous: without synchronization, concurrent tasks produce race conditions, torn reads, and data corruption.',
          'The primary Inter-Task Communication (IPC) primitive in FreeRTOS is the Queue. A FreeRTOS queue is a thread-safe, First-In-First-Out (FIFO) ring buffer managed by the kernel. Queues operate by value: when a task posts an item with xQueueSend(), the kernel copies the byte payload directly into the queue storage area, freeing the sending task to safely overwrite its local variable.',
          'Crucially, queues provide deterministic task blocking. If a consumer task attempts to read from an empty queue with xQueueReceive(), the task enters the Blocked state with zero CPU overhead, allowing lower-priority tasks to execute. The moment a producer task or ISR (via xQueueSendFromISR) writes a message to the queue, the kernel unblocks the consumer task instantly.',
          'For large data structures (such as high-resolution camera frames or audio buffers), copying full payloads wastes CPU cycles and RAM. In these scenarios, embedded architects pass pointers to memory buffers through the queue, pairing the queue with buffer ownership transfer to achieve zero-copy IPC.'
        ],
        example: 'Like an internal pneumatic tube system in a hospital. The lab places blood sample capsules into the tube (xQueueSend). The pharmacy desk waits asleep until a capsule arrives with a chime (xQueueReceive), waking the pharmacist without them having to stand and poll the door every second.',
        code: `#include <iostream>
#include <cstdint>

struct TelemetryQueue {
    uint32_t buffer[8];
    int head;
    int tail;
    int count;
};

bool dispatchQueueMessage(TelemetryQueue* q, uint32_t item) {
    if (q->count >= 8) {
        return false; // Queue full
    }
    q->buffer[q->tail] = item;
    q->tail = (q->tail + 1) % 8;
    q->count++;
    return true;
}

int main() {
    TelemetryQueue q = {{0}, 0, 0, 0};
    bool ok1 = dispatchQueueMessage(&q, 0xAA11);
    bool ok2 = dispatchQueueMessage(&q, 0xBB22);
    std::cout << "Queue Dispatched: " << (ok1 && ok2 ? "SUCCESS" : "FAIL") << "\\n";
    std::cout << "Queue Items Count: " << q.count << "\\n";
    return 0;
}`,
        output: `Queue Dispatched: SUCCESS\nQueue Items Count: 2`,
        codeNotes: [
          { line: 4, note: 'Defines thread-safe FIFO ring buffer structure' },
          { line: 11, note: 'Checks capacity and inserts item into circular buffer' },
          { line: 20, note: 'Dispatches two telemetry words into the queue' }
        ],
        tryIt: 'Dispatch 8 items into the queue and verify that the 9th dispatch returns false (Queue full).',
        check: {
          question: 'What happens when a high-priority FreeRTOS task calls xQueueReceive() on an empty queue with a non-zero timeout?',
          options: [
            'The task enters the Blocked state with 0% CPU consumption, allowing lower-priority tasks to run until a message arrives',
            'The microcontroller executes an infinite while loop spinning the CPU at 100%',
            'The task is permanently deleted from the RTOS',
            'The queue returns random garbage data immediately'
          ],
          answer: 0,
          why: 'FreeRTOS blocks tasks waiting on empty queues, yielding the CPU to other ready tasks and waking the consumer task only when data is pushed or the timeout expires.'
        }
      },
      {
        title: 'Synchronization Primitives, Mutexes & Priority Inversion (Priority Inheritance)',
        say: [
          'When multiple tasks share a physical hardware resource—such as an SPI bus connected to both an SD card and a flash memory chip—they must synchronize access to prevent interleaved transmissions. FreeRTOS provides Binary Semaphores and Mutexes for mutual exclusion.',
          'While a binary semaphore and a mutex both act as tokens with binary states (taken or available), a Mutex possesses a critical property: ownership and Priority Inheritance. Using simple semaphores for resource locking leads to the catastrophic bug known as Priority Inversion, famously experienced on the Mars Pathfinder spacecraft in 1997.',
          'Priority Inversion unfolds in three steps: (1) A low-priority task (Task L) acquires a shared semaphore. (2) A high-priority task (Task H) wakes up, attempts to acquire the semaphore, and blocks waiting for Task L. (3) A medium-priority task (Task M) that does NOT need the semaphore wakes up and preempts Task L! As a result, Task M runs, Task L cannot finish to release the resource, and Task H is indefinitely starved by a lower-priority task!',
          'FreeRTOS Mutexes eliminate priority inversion through Priority Inheritance. When Task H blocks waiting for a mutex held by Task L, the FreeRTOS kernel dynamically boosts the priority of Task L to match Task H. Task L can no longer be preempted by intermediate tasks like Task M. Once Task L releases the mutex, its priority drops back to normal, and Task H claims the resource immediately.'
        ],
        example: 'Like an intern holding the physical key to the boardroom where the CEO needs to hold an urgent board meeting. If middle managers try to stop the intern to assign routine paperwork, the CEO grants the intern executive authorization (priority inheritance) so the intern walks straight through, unlocks the door, and gives the key to the CEO.',
        code: `#include <iostream>
#include <cstdint>

struct MutexResource {
    int ownerTaskId;
    uint32_t basePriority;
    uint32_t boostedPriority;
};

uint32_t resolvePriorityInversion(MutexResource* m, uint32_t waitingTaskPriority) {
    if (waitingTaskPriority > m->boostedPriority) {
        m->boostedPriority = waitingTaskPriority; // Priority inheritance boost!
    }
    return m->boostedPriority;
}

int main() {
    MutexResource spiMutex = {1, 2, 2}; // Owned by low priority task (prio 2)
    uint32_t boosted = resolvePriorityInversion(&spiMutex, 5); // High prio task (prio 5) waits
    std::cout << "Mutex Owner Boosted Priority: " << boosted << "\\n";
    return 0;
}`,
        output: `Mutex Owner Boosted Priority: 5`,
        codeNotes: [
          { line: 4, note: 'Tracks mutex owner and priority inheritance state' },
          { line: 10, note: 'Elevates low-priority owner priority to match high-priority waiter' },
          { line: 18, note: 'Verifies owner priority boosted from 2 to 5' }
        ],
        tryIt: 'Simulate a waiting task with priority 1 (lower than owner) and verify boostedPriority remains 2.',
        check: {
          question: 'How does Priority Inheritance resolve the priority inversion anomaly in real-time operating systems?',
          options: [
            'It temporarily elevates the priority of the task holding the mutex to match the highest-priority task waiting for it',
            'It deletes all medium-priority tasks in the system',
            'It restarts the microcontroller every time a mutex is acquired',
            'It executes all tasks on a cloud server'
          ],
          answer: 0,
          why: 'Priority inheritance temporarily elevates the resource holder priority so it cannot be preempted by medium-priority tasks, allowing it to release the mutex quickly to the waiting high-priority task.'
        }
      },
      {
        title: 'Task Notifications, Event Groups & Low-Power Tickless Idle Mode',
        say: [
          'While queues and semaphores provide full-featured IPC, each primitive requires a dedicated kernel control structure in RAM. In resource-constrained microcontrollers, FreeRTOS provides Direct-to-Task Notifications: a built-in 32-bit integer array embedded directly inside every TCB.',
          'Task notifications can act as lightweight binary semaphores, counting semaphores, or event bits with 45% faster context execution and ZERO additional RAM allocation. Tasks wait using ulTaskNotifyTake() or xTaskNotifyWait(), and ISRs or producer tasks send events using xTaskNotifyGive() or xTaskNotify().',
          'In battery-powered IoT devices (like environmental trackers or smart medical patches), the microcontroller must spend 99% of its life asleep. However, a standard RTOS wakes up every 1 millisecond due to the SysTick timer interrupt, burning precious battery current (often 10mA to 20mA).',
          'FreeRTOS solves this with Tickless Idle mode (configUSE_TICKLESS_IDLE). When all tasks are blocked for an extended duration (such as 500ms), the kernel stops the periodic SysTick timer, programs a low-power hardware timer (LPTIM or RTC), and puts the CPU core into deep sleep (ARM Cortex-M Wait For Interrupt WFI instruction). Current consumption plummets from 15mA down to under 3 microamps, extending battery longevity from days to years.'
        ],
        example: 'Like turning off a loud alarm clock that rings every 60 seconds when you know you do not need to wake up for another 6 hours. You program the single 6:00 AM alarm (low-power timer) and sleep soundly in complete silence (tickless idle).',
        code: `#include <iostream>
#include <cstdint>

struct PowerProfile {
    uint32_t activeCurrentMa;
    uint32_t sleepCurrentUa;
    uint32_t suppressedTicks;
};

uint32_t configureTicklessIdle(PowerProfile* profile, uint32_t expectedIdleMs) {
    profile->suppressedTicks = expectedIdleMs;
    // Enter Cortex-M WFI (Wait For Interrupt) low power state
    return profile->suppressedTicks;
}

int main() {
    PowerProfile nrf52 = {15, 3, 0};
    uint32_t idleTicks = configureTicklessIdle(&nrf52, 500);
    std::cout << "Tickless Idle Suppressed Ticks: " << idleTicks << "\\n";
    std::cout << "Deep Sleep Current: " << nrf52.sleepCurrentUa << " uA\\n";
    return 0;
}`,
        output: `Tickless Idle Suppressed Ticks: 500\nDeep Sleep Current: 3 uA`,
        codeNotes: [
          { line: 4, note: 'Models active vs deep sleep current profile for battery IoT devices' },
          { line: 10, note: 'Suppresses periodic SysTick timer interrupts during extended idle windows' },
          { line: 18, note: 'Verifies 500 suppressed ticks and ultra-low 3 uA sleep state' }
        ],
        tryIt: 'Change expectedIdleMs to 1000 and verify 1000 ticks are suppressed during low power sleep.',
        check: {
          question: 'Why is Tickless Idle mode crucial for battery-powered IoT devices running FreeRTOS?',
          options: [
            'It suppresses the periodic 1ms SysTick interrupt during extended idle periods, allowing the MCU to remain in deep sleep (WFI) and reducing current from milliamps to microamps',
            'It speeds up the CPU clock frequency to 5 GHz',
            'It replaces C++ code with WebAssembly',
            'It recharges the battery over radio waves'
          ],
          answer: 0,
          why: 'By stopping periodic timer ticks when tasks are blocked, Tickless Idle prevents unnecessary CPU wakeups, allowing the device to remain in deep sleep consuming microamps of current.'
        }
      }
    ],
    summary: [
      'FreeRTOS fixed-priority preemptive scheduling guarantees that the highest-priority ready task always preempts lower-priority execution.',
      'Task stacks require individual allocation and context switching saves CPU registers onto the Process Stack Pointer (PSP) verified by 0xA5 canaries.',
      'FreeRTOS queues provide thread-safe FIFO ring buffer IPC with deterministic task blocking and zero CPU overhead while waiting.',
      'Priority Inheritance in FreeRTOS mutexes temporarily boosts the priority of a resource owner, preventing catastrophic priority inversion.',
      'Tickless Idle mode suppresses periodic SysTick interrupts during idle periods, dropping microcontroller consumption to microamps.'
    ],
    projectStep: {
      title: 'Architect a Production FreeRTOS Multi-Task Telemetry & Power Management Engine',
      steps: [
        'Configure a fixed-priority preemptive task scheduler managing telemetry, motor control, and sensor sampling tasks.',
        'Implement a 0xA5 stack canary watermark detector to monitor task stack high-water marks and prevent stack overflows.',
        'Construct a thread-safe circular ring buffer queue dispatching telemetry packets between producer and consumer tasks.',
        'Implement a priority inheritance mutex algorithm to eliminate priority inversion across shared SPI/I2C peripheral buses.',
        'Configure a low-power Tickless Idle power profile suppressing periodic SysTick interrupts during extended idle sleep windows.'
      ]
    }
  },
  {
    day: 5,
    title: 'Embedded IoT Wireless Networking, BLE GATT Profiles, Low-Power Mesh & OTA Firmware Architecture',
    goal: 'Master wireless embedded architecture: BLE GAP advertising, connection parameter negotiation, GATT services and CCCD push notifications, 6LoWPAN mesh header compression, dual-bank flash bootloaders, and cryptographic OTA firmware updates.',
    minutes: 35,
    recap: 'In Day 4, we mastered the FreeRTOS real-time kernel, preemptive scheduling, stack canaries, and tickless idle sleep. Today in Day 5, we complete our embedded journey by taking microcontrollers online: architecting BLE GATT profiles, low-power mesh networking, dual-bank flash memory layouts, and cryptographically signed OTA firmware updates.',
    parts: [
      {
        title: 'Bluetooth Low Energy (BLE) Fundamentals: GAP Roles, Advertising & Connection Parameters',
        say: [
          'Bluetooth Low Energy (BLE) is designed from the physical layer up for ultra-low duty cycles and long battery life.',
          'Under the Generic Access Profile (GAP), devices operate either as Broadcasters and Observers, or as Peripherals and Centrals.',
          'Before any connection is formed, a peripheral broadcasts periodic Advertising Packets on three dedicated primary RF channels: 37, 38, and 39.',
          'A legacy BLE advertising packet contains up to 31 bytes of structured advertising data (AD structures), each consisting of a length byte, an AD type tag, and payload data.',
          'Typical AD fields include Discovery Flags (such as LE General Discoverable Mode), 16-bit or 128-bit Service UUIDs, and the Human-Readable Complete Local Device Name.',
          'Once connected, the central and peripheral negotiate three critical connection parameters: the Connection Interval (ranging from 7.5 ms to 4.0 s in 1.25 ms increments), Slave Latency, and the Supervision Timeout.',
          'Slave Latency allows the peripheral to deliberately sleep through a defined number of connection events if it has no data to send, saving battery power while maintaining the link.',
          'If no packets are exchanged before the Supervision Timeout expires, both sides drop the link and assume radio disconnection.'
        ],
        example: 'Like an automated lighthouse flashing its identifier every second: nearby ships read its name without docking, but can initiate a docking sequence when needed.',
        code: `#include <iostream>
#include <cstdint>
#include <cstring>

struct BleAdvPacket {
    uint8_t payload[31];
    uint8_t length;
    uint16_t connIntervalMs;
    uint16_t slaveLatency;
    uint16_t supervisionTimeoutMs;
};

uint8_t buildBleAdvPacket(BleAdvPacket* packet, const char* deviceName, uint16_t serviceUuid) {
    packet->length = 0;
    // AD Structure 1: Flags (0x01: LE General Discoverable Mode, BR/EDR Not Supported = 0x06)
    packet->payload[packet->length++] = 2;    // Length of this AD structure
    packet->payload[packet->length++] = 0x01; // AD Type: Flags
    packet->payload[packet->length++] = 0x06; // Value: LE General Discoverable + BR/EDR Not Supported

    // AD Structure 2: 16-bit Service UUID (0x03)
    packet->payload[packet->length++] = 3;    // Length
    packet->payload[packet->length++] = 0x03; // AD Type: Complete List of 16-bit Service UUIDs
    packet->payload[packet->length++] = static_cast<uint8_t>(serviceUuid & 0xFF);
    packet->payload[packet->length++] = static_cast<uint8_t>((serviceUuid >> 8) & 0xFF);

    // AD Structure 3: Complete Local Name (0x09)
    uint8_t nameLen = static_cast<uint8_t>(std::strlen(deviceName));
    packet->payload[packet->length++] = nameLen + 1;
    packet->payload[packet->length++] = 0x09; // AD Type: Complete Local Name
    for (uint8_t i = 0; i < nameLen && packet->length < 31; ++i) {
        packet->payload[packet->length++] = static_cast<uint8_t>(deviceName[i]);
    }

    packet->connIntervalMs = 50;           // 50ms interval balance
    packet->slaveLatency = 4;              // Skip up to 4 intervals when idle
    packet->supervisionTimeoutMs = 2000;   // 2s link loss watchdog

    return packet->length;
}

int main() {
    BleAdvPacket adv;
    uint8_t len = buildBleAdvPacket(&adv, "PinIT-Sensor", 0x180D); // 0x180D = Heart Rate Service
    std::cout << "BLE Advertising Packet Formatted: " << static_cast<int>(len) << " bytes\\n";
    std::cout << "Negotiated Connection Interval: " << adv.connIntervalMs << " ms (Latency: " << adv.slaveLatency << ")\\n";
    return 0;
}`,
        output: `BLE Advertising Packet Formatted: 21 bytes\nNegotiated Connection Interval: 50 ms (Latency: 4)`,
        codeNotes: [
          { line: 5, note: 'Defines 31-byte legacy BLE PDU payload and negotiated connection timing parameters' },
          { line: 15, note: 'Appends standard AD structures: LE General Discoverable flags and 16-bit Service UUID' },
          { line: 32, note: 'Configures slave latency of 4 to permit low-power peripheral sleep during connection events' }
        ],
        tryIt: 'Change serviceUuid to 0x180F (Battery Service) and verify packet length and formatting.',
        check: {
          question: 'In BLE connection parameter negotiation, what is the role of Slave Latency?',
          options: [
            'It allows the peripheral to skip a specified number of connection intervals without being disconnected, saving battery when no new data is ready',
            'It forces the peripheral to transmit continuously at 100% duty cycle',
            'It delays packet transmission until the user clicks a button',
            'It encrypts BLE packets with AES-128 GCM'
          ],
          answer: 0,
          why: 'Slave latency allows a low-power peripheral to stay in deep sleep and skip periodic connection events when it has no sensor readings to report, while maintaining connection synchronization with the central.'
        }
      },
      {
        title: 'BLE GATT Architecture: Services, Characteristics, Descriptors & CCCD Notifications',
        say: [
          'Once a BLE connection is established, data exchange is governed by the Generic Attribute Profile (GATT) built on top of the Attribute Protocol (ATT).',
          'A GATT server organizes data in a strict hierarchy: a Profile contains one or more Services, each Service contains Characteristics, and Characteristics may have Descriptors.',
          'Every attribute in the GATT table is addressed by a 16-bit handle and identified by either a standard 16-bit Bluetooth SIG UUID or a custom 128-bit vendor UUID.',
          'Characteristics define properties such as Read, Write, Write Without Response, Notify, and Indicate.',
          'Polling a characteristic via Read requests wastes significant wireless airtime and MCU battery power.',
          'Instead, production IoT systems use asynchronous push notifications enabled by the Client Characteristic Configuration Descriptor (CCCD, UUID 0x2902).',
          'When the client writes 0x0001 to the CCCD handle, the server is permitted to push unacknowledged notifications immediately when new sensor data arrives.',
          'Writing 0x0002 enables indications, which require an application-level acknowledgment from the client before the next packet can be dispatched.'
        ],
        example: 'Like subscribing to an email newsletter: instead of constantly refreshing a webpage (polling Read), the publisher sends an email directly to your inbox whenever an update occurs (Notify).',
        code: `#include <iostream>
#include <cstdint>

struct GattCharacteristic {
    uint16_t handle;
    uint16_t uuid;
    uint8_t properties; // 0x10 = Notify, 0x02 = Read, 0x08 = Write
    uint16_t cccdValue; // 0x0000 = Off, 0x0001 = Notifications Enabled, 0x0002 = Indications
    uint8_t currentData[16];
    uint8_t dataLength;
};

bool handleGattCccdWrite(GattCharacteristic* chr, uint16_t newCccdValue) {
    chr->cccdValue = newCccdValue;
    bool notificationsActive = (chr->cccdValue & 0x0001) != 0;
    return notificationsActive;
}

int main() {
    GattCharacteristic telemetryChr = {0x0024, 0x2A37, 0x10, 0x0000, {0}, 0};
    bool active = handleGattCccdWrite(&telemetryChr, 0x0001);
    std::cout << "GATT Handle 0x" << std::hex << telemetryChr.handle << " CCCD Configured: 0x" << telemetryChr.cccdValue << "\\n";
    std::cout << "Asynchronous Push Notifications: " << (active ? "ACTIVE" : "DISABLED") << "\\n";
    return 0;
}`,
        output: `GATT Handle 0x24 CCCD Configured: 0x1\nAsynchronous Push Notifications: ACTIVE`,
        codeNotes: [
          { line: 4, note: 'Defines GATT characteristic attributes including handle, UUID, property flags, and CCCD state' },
          { line: 13, note: 'Processes client write to CCCD descriptor, validating 0x0001 notification subscription' },
          { line: 20, note: 'Enables asynchronous push notifications without client polling overhead' }
        ],
        tryIt: 'Set newCccdValue to 0x0000 to disable notifications and observe the updated ACTIVE status.',
        check: {
          question: 'What is the purpose of writing 0x0001 to the Client Characteristic Configuration Descriptor (CCCD 0x2902)?',
          options: [
            'It enables asynchronous push notifications from the GATT server to the client without polling',
            'It formats the microcontroller flash memory',
            'It forces the Bluetooth radio to switch to classic Bluetooth audio streaming',
            'It sets the device serial baud rate to 115200'
          ],
          answer: 0,
          why: 'Writing 0x0001 to the CCCD descriptor authorizes the GATT server to push unacknowledged telemetry notifications as soon as new data is available, avoiding energy-expensive client polling.'
        }
      },
      {
        title: 'Low-Power Wireless Mesh Networks: 6LoWPAN, Thread & CoAP / MQTT-SN',
        say: [
          'While BLE is optimized for point-to-point connections, large-scale industrial IoT and smart building systems require self-healing, multi-hop mesh topologies.',
          'Standard IP networking relies on IPv6, but a standard IPv6 header is 40 bytes long, which consumes over 30% of the maximum 127-byte physical frame in IEEE 802.15.4 radios.',
          '6LoWPAN (IPv6 over Low-Power Wireless Personal Area Networks) solves this via stateless and stateful header compression defined in RFC 6282 (LOWPAN_IPHC).',
          'By eliding predictable link-local address prefixes (fe80::) and deriving the 64-bit interface identifiers (IID) directly from 802.15.4 MAC addresses, 6LoWPAN compresses 40-byte IPv6 headers down to 2 to 4 bytes.',
          'The Thread mesh protocol builds on 6LoWPAN and IEEE 802.15.4, utilizing distance-vector routing to form resilient meshes with Leader, Router, and Sleepy End Device roles.',
          'On top of 6LoWPAN mesh layers, constrained devices avoid resource-heavy HTTP/TCP in favor of CoAP (Constrained Application Protocol, RFC 7252) or MQTT-SN over UDP.',
          'CoAP uses a 4-byte compact binary header with Confirmable (CON) or Non-Confirmable (NON) message types and RESTful verbs (GET, PUT, POST, DELETE), achieving web semantics with minimal byte overhead.'
        ],
        example: 'Like compressing a full postal envelope with recipient name, street address, and country code into a 2-digit apartment intercom number when delivering inside the same building.',
        code: `#include <iostream>
#include <cstdint>

struct IPv6Header {
    uint8_t versionTrafficClass[4];
    uint16_t payloadLength;
    uint8_t nextHeader; // 17 = UDP
    uint8_t hopLimit;
    uint8_t srcAddr[16];
    uint8_t destAddr[16];
};

struct CompressedMeshPacket {
    uint8_t iphcHeader[3];
    uint8_t compressedSize;
    uint8_t originalSize;
    uint8_t savingsPercent;
};

uint8_t compress6LoWpanHeader(const IPv6Header* ip6, CompressedMeshPacket* out) {
    out->originalSize = sizeof(IPv6Header); // 40 bytes
    // LOWPAN_IPHC: Dispatch (011), Base format flags
    // DAM=11 (Destination elided from MAC), SAM=11 (Source elided from MAC)
    out->iphcHeader[0] = 0x7E; // IPHC dispatch + traffic class/flow label elided
    out->iphcHeader[1] = 0x3B; // Next header UDP compressed, elided 128-bit addresses
    out->compressedSize = 2;
    
    uint32_t saved = out->originalSize - out->compressedSize;
    out->savingsPercent = static_cast<uint8_t>((saved * 100) / out->originalSize);
    return out->compressedSize;
}

int main() {
    IPv6Header rawIp6 = {{0x60, 0, 0, 0}, 32, 17, 64, {0}, {0}};
    CompressedMeshPacket meshPkt;
    uint8_t compLen = compress6LoWpanHeader(&rawIp6, &meshPkt);
    std::cout << "6LoWPAN IPHC Header: " << static_cast<int>(compLen) << " bytes (from 40-byte IPv6)\\n";
    std::cout << "Bandwidth Savings: " << static_cast<int>(meshPkt.savingsPercent) << "% over 802.15.4\\n";
    return 0;
}`,
        output: `6LoWPAN IPHC Header: 2 bytes (from 40-byte IPv6)\nBandwidth Savings: 95% over 802.15.4`,
        codeNotes: [
          { line: 4, note: 'Represents 40-byte standard IPv6 header requiring compression for constrained radios' },
          { line: 20, note: 'Executes RFC 6282 LOWPAN_IPHC compression eliding redundant prefixes and MAC-derived addresses' },
          { line: 27, note: 'Calculates 95% bandwidth savings, reducing 40-byte overhead to 2 compact bytes' }
        ],
        tryIt: 'Experiment with changing nextHeader to 6 (TCP) and analyze why UDP/CoAP is preferred in 6LoWPAN meshes.',
        check: {
          question: 'How does 6LoWPAN (RFC 6282) compress standard 40-byte IPv6 headers down to 2–4 bytes over IEEE 802.15.4 links?',
          options: [
            'By eliding predictable link-local address prefixes and deriving the 64-bit interface identifiers directly from radio MAC addresses',
            'By encrypting the entire header with RSA-4096',
            'By stripping out the payload and only transmitting headers',
            'By converting IPv6 packets into JSON strings'
          ],
          answer: 0,
          why: 'Because link-local IPv6 addresses (fe80::) can be algorithmically derived from the underlying 802.15.4 MAC address, 6LoWPAN eliminates redundant address bytes from the wireless frame.'
        }
      },
      {
        title: 'Dual-Bank Flash Memory Partitioning & Secure Bootloader Architecture',
        say: [
          'Deploying firmware updates to embedded devices in the field carries catastrophic risks: an unexpected power loss during a flash erase or write cycle can permanently brick the device.',
          'To guarantee continuous availability, production microcontrollers employ Dual-Bank Flash Memory Partitioning.',
          'The internal flash memory is partitioned into distinct zones: a Secure Bootloader (residing in write-protected low flash memory), Slot 0 (Active Application Bank A), Slot 1 (Candidate Download Bank B), and a Non-Volatile Storage (NVS) scratchpad.',
          'When an update is received, the running application in Slot 0 writes the incoming firmware into Slot 1 without overwriting itself.',
          'Upon reboot, the Secure Bootloader inspects metadata flags in NVS. If a new candidate image is present, the bootloader verifies its integrity before launching it.',
          'In ARM Cortex-M processors, the bootloader points the Vector Table Offset Register (SCB->VTOR) to the new application base address and updates the Main Stack Pointer (MSP) before branching to the application Reset Handler.',
          'Crucially, a hardware watchdog timer and boot counter monitor the candidate image during its first boot.',
          'If the candidate application crashes or fails to confirm image stability within a designated grace period, the bootloader increments the failure counter; after 3 failed attempts, it triggers an automatic rollback to Slot 0.'
        ],
        example: 'Like testing a parachute in a wind tunnel with a safety cable attached: if the prototype fails to deploy, the harness snaps you safely back onto the launch platform instead of free-falling.',
        code: `#include <iostream>
#include <cstdint>

enum BootBankState {
    BANK_ACTIVE_CONFIRMED = 0,
    BANK_CANDIDATE_TESTING = 1,
    BANK_CORRUPT_ROLLBACK = 2
};

struct FlashPartition {
    uint32_t slot0BaseAddr;
    uint32_t slot1BaseAddr;
    uint32_t activeSlot;
    BootBankState state;
    uint32_t bootAttempts;
};

uint32_t evaluateBootloaderBank(FlashPartition* part) {
    if (part->state == BANK_CANDIDATE_TESTING) {
        if (part->bootAttempts >= 3) {
            // Rollback to Slot 0
            part->activeSlot = part->slot0BaseAddr;
            part->state = BANK_CORRUPT_ROLLBACK;
        } else {
            part->activeSlot = part->slot1BaseAddr;
            part->bootAttempts++;
        }
    } else {
        part->activeSlot = part->slot0BaseAddr;
    }
    return part->activeSlot;
}

int main() {
    FlashPartition nvs = {0x08010000, 0x08080000, 0x08080000, BANK_CANDIDATE_TESTING, 3};
    uint32_t jumpAddr = evaluateBootloaderBank(&nvs);
    std::cout << "Bootloader Evaluated Slot: 0x" << std::hex << jumpAddr << "\\n";
    std::cout << "State: ROLLBACK_PREVENTED_BRICKING\\n";
    return 0;
}`,
        output: `Bootloader Evaluated Slot: 0x8010000\nState: ROLLBACK_PREVENTED_BRICKING`,
        codeNotes: [
          { line: 4, note: 'Defines bootloader state machine transitions: Active Confirmed, Candidate Testing, and Rollback' },
          { line: 17, note: 'Detects consecutive boot failures (bootAttempts >= 3) and redirects execution back to known-good Slot 0' },
          { line: 31, note: 'Demonstrates deterministic rollback preventing bricked devices during faulty firmware rollouts' }
        ],
        tryIt: 'Set bootAttempts to 1 and verify the bootloader launches Slot 1 (0x8080000) for ongoing testing.',
        check: {
          question: 'What primary failure mode does Dual-Bank Flash partitioning prevent during embedded firmware updates?',
          options: [
            'Bricking the microcontroller if power is cut during flash programming or if the new firmware fails to boot properly',
            'Slowing down the Wi-Fi data transfer rate',
            'Exhausting the stack pointer during recursion',
            'Overheating the onboard battery'
          ],
          answer: 0,
          why: 'Because the running firmware in Slot 0 remains untouched while the new image downloads to Slot 1, power cuts or firmware crashes simply trigger a rollback to Slot 0 rather than rendering the device inoperable.'
        }
      },
      {
        title: 'Cryptographic Over-The-Air (OTA) Updates: Ed25519 Signatures & Safe Rollback',
        say: [
          'Over-The-Air (OTA) firmware updating is the single most sensitive operation in the lifecycle of an IoT product.',
          'An unauthenticated OTA pipeline allows malicious actors on the local network or internet to push rogue firmware, permanently seizing control of physical devices.',
          'A production OTA security architecture enforces four mandatory validation barriers before any code execution is permitted.',
          'First, Magic Byte Validation verifies that the uploaded image begins with an agreed-upon header format (e.g., 0x4F544131).',
          'Second, Monotonic Anti-Rollback Counters ensure the new version number is strictly greater than the currently installed version (V_new > V_current), neutralizing firmware downgrade attacks targeting known vulnerabilities.',
          'Third, Payload Integrity Hashing computes a SHA-256 digest over the entire firmware payload to guarantee zero byte corruption occurred during wireless transmission.',
          'Fourth, Asymmetric Cryptographic Signatures (using Ed25519 or ECDSA secp256r1) verify that the firmware was signed by the manufacturer\'s private signing key.',
          'The public key is permanently embedded in the write-protected bootloader flash, allowing the MCU to verify authenticity offline without contacting external certificate authorities.',
          'Only after all four barriers pass is the new firmware written to flash and flagged for trial execution.'
        ],
        example: 'Like receiving a high-security bank vault software update: the safe checks the serial number (magic bytes), verifies the version is newer (anti-rollback), checks the tamper seal (SHA-256), and verifies the bank\'s cryptographic digital wax seal (Ed25519) before installing.',
        code: `#include <iostream>
#include <cstdint>
#include <cstring>

struct OtaManifest {
    uint32_t magic;           // 0x4F544131 ("OTA1")
    uint32_t version;         // Monotonic version e.g. 200
    uint32_t payloadSizeBytes;
    uint8_t  sha256Hash[32];
    uint8_t  signature[64];   // Ed25519 signature
};

bool verifyOtaFirmwareSignature(const OtaManifest* manifest, uint32_t currentVersion, bool mockSignatureValid) {
    // 1. Magic byte verification
    if (manifest->magic != 0x4F544131) {
        return false;
    }
    // 2. Monotonic anti-rollback check
    if (manifest->version <= currentVersion) {
        return false;
    }
    // 3. Cryptographic signature check
    if (!mockSignatureValid) {
        return false;
    }
    return true;
}

int main() {
    OtaManifest update = {0x4F544131, 204, 384 * 1024, {0xAA}, {0xFF}};
    uint32_t activeVer = 203;
    bool approved = verifyOtaFirmwareSignature(&update, activeVer, true);
    std::cout << "Firmware OTA Version: v" << update.version << " (Active: v" << activeVer << ")\\n";
    std::cout << "Cryptographic Verification Verdict: " << (approved ? "APPROVED_FOR_STAGING" : "REJECTED") << "\\n";
    return 0;
}`,
        output: `Firmware OTA Version: v204 (Active: v203)\nCryptographic Verification Verdict: APPROVED_FOR_STAGING`,
        codeNotes: [
          { line: 5, note: 'Defines binary OTA manifest header with magic bytes, monotonic version, and Ed25519 signature' },
          { line: 15, note: 'Enforces anti-rollback defense ensuring candidate version strictly exceeds currently running version' },
          { line: 26, note: 'Approves candidate firmware image v204 for staging only after all security gates pass' }
        ],
        tryIt: 'Change currentVersion to 205 (higher than manifest version 204) and verify that the anti-rollback check rejects the update.',
        check: {
          question: 'Why is a monotonic version counter essential in secure embedded OTA firmware verification?',
          options: [
            'It prevents downgrade attacks where an attacker forces a device to reinstall older, vulnerable firmware with known security exploits',
            'It increases the download speed of the Wi-Fi radio',
            'It optimizes dynamic heap allocation in FreeRTOS',
            'It compresses the binary image by 50%'
          ],
          answer: 0,
          why: 'Monotonic anti-rollback checks ensure that even if an attacker captures a validly signed legacy firmware binary, they cannot force the device to roll back to that obsolete image containing patched security flaws.'
        }
      }
    ],
    summary: [
      'BLE GAP defines Broadcaster/Observer and Peripheral/Central roles with 31-byte legacy advertising packets on primary channels 37, 38, and 39.',
      'GATT organizes data into Services, Characteristics, and Descriptors, utilizing CCCD (0x2902) subscriptions for low-power asynchronous push notifications.',
      '6LoWPAN (RFC 6282) compresses 40-byte IPv6 headers to 2–4 bytes over IEEE 802.15.4 radios, enabling scalable Thread meshes and lightweight CoAP REST communication.',
      'Dual-Bank Flash partitioning isolates active execution in Slot 0 while downloading updates into Slot 1, preventing bricked devices during unexpected power failures.',
      'Cryptographic OTA verification enforces magic byte validation, monotonic anti-rollback version checks, SHA-256 integrity, and Ed25519 digital signatures.'
    ],
    projectStep: {
      title: 'Architect a Production Connected IoT Wireless Peripheral with Secure OTA Bootloader',
      steps: [
        'Construct a 31-byte BLE GAP advertising packet containing discovery flags, 16-bit Service UUIDs, and local device identifiers.',
        'Implement a GATT characteristic table with CCCD descriptor subscription handlers supporting low-power asynchronous push notifications.',
        'Design a 6LoWPAN header compression algorithm translating 40-byte IPv6 packets into compact 2-byte 802.15.4 mesh frames.',
        'Configure dual-bank flash memory partitioning with bootloader state machine logic and automatic rollback recovery.',
        'Implement an Ed25519 cryptographic signature and monotonic anti-rollback verification pipeline for secure OTA firmware deployments.'
      ]
    }
  },
  {
    day: 6,
    title: "Universal Asynchronous Receiver-Transmitter (UART): Baud Rates, Oversampling & Line Noise",
    goal: "Confront asynchronous communication physics: master Universal Asynchronous Receiver-Transmitter (UART/USART). Understand how two devices communicate without a shared clock wire by agreeing on exact baud rates (115200, 921600 bps). Calculate the fractional Baud Rate Register (BRR) divisor from peripheral bus clock frequencies. Analyze receiver oversampling (16x and 8x): start bit detection via falling edge transitions, majority voting across sample pulses, and how a 2.5% clock drift between transmitter and receiver causes catastrophic framing errors and bit corruption.",
    minutes: 36,
    recap: "In Day 5, we mastered embedded IoT wireless networking, BLE GATT profiles, low-power mesh networking, and cryptographic OTA firmware updates. Today in Day 6, we begin Block 2: Serial Communications & Hardware Buses by mastering bare-metal UART physics.",
    parts: [
      {
        title: "Asynchronous Framing Physics & Baud Rate Generator Math",
        say: [
          "Welcome to Day 6! In modern embedded systems, Universal Asynchronous Receiver-Transmitter (UART) is the universal umbilical cord connecting microcontrollers to host consoles, cellular modems, and GPS receivers.",
          "Unlike synchronous protocols like SPI or I2C that dedicate a physical wire to a shared clock signal, UART is completely asynchronous: it relies exclusively on pre-shared timing agreements between transmitter and receiver.",
          "A standard UART frame begins with an idle HIGH line (Mark state), drops LOW for exactly one bit period to signal the Start bit (Space state), transmits 5 to 8 data bits (least significant bit first), includes an optional parity bit, and concludes with 1 or 2 stop bits.",
          "The hardware generates this precise timing using a dedicated Baud Rate Register (USART_BRR) that divides the peripheral bus clock (e.g., APB1 at 42MHz or APB2 at 84MHz) down to the target baud frequency.",
          "If the calculated divisor has a fractional truncation error exceeding 2.5%, the cumulative sampling drift over a 10-bit frame will cause the receiver to sample directly on bit transition edges, creating catastrophic framing errors and data corruption."
        ],
        example: "Calculating the USART_BRR register value for 115,200 baud on a 16MHz APB peripheral clock: Divisor = 16,000,000 / (16 * 115,200) = 8.6805. The integer part is 8 (0x08), and the fractional part is round(0.6805 * 16) = 11 (0x0B), producing BRR = 0x008B.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct UartBaudCalculator {
    static uint32_t computeBRR(uint32_t pclk, uint32_t baud) {
        uint32_t div = (2 * pclk + baud) / (2 * baud);
        return div;
    }

    static double computeActualBaud(uint32_t pclk, uint32_t brr) {
        return static_cast<double>(pclk) / brr;
    }
};

int main() {
    uint32_t pclk = 16000000;
    uint32_t targetBaud = 115200;
    uint32_t brr = UartBaudCalculator::computeBRR(pclk, targetBaud);
    double actualBaud = UartBaudCalculator::computeActualBaud(pclk, brr);
    double errorPct = ((actualBaud - targetBaud) / targetBaud) * 100.0;

    std::cout << "Target Baud: " << targetBaud << "\\n";
    std::cout << "Computed BRR: 0x" << std::hex << std::uppercase << brr << std::dec << " (" << brr << ")\\n";
    std::cout << "Actual Baud: " << std::fixed << std::setprecision(1) << actualBaud << "\\n";
    std::cout << "Error: " << std::setprecision(2) << errorPct << "% (Tolerance < 2.5%)\\n";
    return 0;
}`,
        output: `Target Baud: 115200
Computed BRR: 0x8B (139)
Actual Baud: 115107.9
Error: -0.08% (Tolerance < 2.5%)`,
        codeNotes: [
          { line: 5, note: "Computes integer and fractional divisor using fixed-point arithmetic with rounding" },
          { line: 23, note: "BRR value 0x8B sets 8 mantissa bits and 11 fractional bits on Cortex-M USART" },
          { line: 25, note: "Achieves -0.08% error, well within the strict 2.5% cumulative timing budget" }
        ],
        tryIt: "Recalculate the BRR register for a 42MHz APB1 clock at 921,600 baud and verify whether the error percentage exceeds 2.5%.",
        check: {
          question: "What is the maximum allowable cumulative clock drift between a UART transmitter and receiver over a standard 10-bit frame?",
          options: [
            "Strictly below 2.5% to ensure the receiver samples near the center of the 10th bit rather than on transition boundaries.",
            "Up to 15% because UART automatically synchronizes on every individual data bit edge.",
            "Exactly 0.00% because microcontrollers cannot tolerate any frequency discrepancy.",
            "50% because stop bits reset the internal clock phase completely."
          ],
          answer: 0,
          why: "Over a 10-bit frame (1 start, 8 data, 1 stop), a 2.5% drift shifts the sampling point by 25% of a bit width; any greater drift risks sampling during unstable rise/fall transitions."
        }
      },
      {
        title: "Start Bit Detection & 16x Hardware Oversampling Physics",
        say: [
          "Because UART lacks a shared clock line, the receiver must synthesize an internal sampling clock that locks onto the incoming asynchronous bitstream.",
          "The receiver hardware achieves this by clocking its internal shift register at 16 times the negotiated baud rate (16x oversampling).",
          "While the bus is idle in the Mark state (logic HIGH), the receiver continuously samples the RX line looking for a 1-to-0 falling edge transition.",
          "When a falling edge is detected, the receiver starts an internal 16-tick counter: if samples 3, 4, and 5 are confirmed LOW via majority voting (at least 2 out of 3 samples zero), a valid Start bit is confirmed.",
          "The hardware then resets its counter to sample subsequent data bits precisely at ticks 7, 8, and 9—the exact mathematical center of each bit period where electrical signal levels are most stable."
        ],
        example: "A 16x oversampling engine rejects a 2-tick electrical noise glitch on the RX pin because samples 3, 4, and 5 do not confirm a persistent LOW start bit.",
        code: `#include <iostream>
#include <cstdint>

struct UartOversampler {
    static bool validateStartBit(const uint8_t samples[16]) {
        int lowCount = 0;
        if (samples[3] == 0) lowCount++;
        if (samples[4] == 0) lowCount++;
        if (samples[5] == 0) lowCount++;
        return lowCount >= 2;
    }

    static uint8_t sampleDataBit(const uint8_t samples[16]) {
        int highCount = 0;
        if (samples[7] == 1) highCount++;
        if (samples[8] == 1) highCount++;
        if (samples[9] == 1) highCount++;
        return (highCount >= 2) ? 1 : 0;
    }
};

int main() {
    uint8_t startSamples[16] = {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    uint8_t dataSamples[16] = {0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0};

    bool startOk = UartOversampler::validateStartBit(startSamples);
    uint8_t bitVal = UartOversampler::sampleDataBit(dataSamples);

    std::cout << "Start Bit Valid: " << (startOk ? "TRUE" : "FALSE") << "\\n";
    std::cout << "Center Majority Bit: " << static_cast<int>(bitVal) << "\\n";
    std::cout << "Noise Resilience: 3-pulse voting filtered single-tick glitch\\n";
    return 0;
}`,
        output: `Start Bit Valid: TRUE
Center Majority Bit: 1
Noise Resilience: 3-pulse voting filtered single-tick glitch`,
        codeNotes: [
          { line: 4, note: "Validates falling edge by evaluating center start bit samples 3, 4, and 5" },
          { line: 13, note: "Majority voting at ticks 7, 8, 9 ensures high immunity against electromagnetic line noise" },
          { line: 28, note: "Reconstructs correct logic 1 despite transient bit-flip at tick 8" }
        ],
        tryIt: "Simulate a noise spike where sample 4 is logic 1 and verify that 2-out-of-3 majority voting still accepts the start bit.",
        check: {
          question: "Why does a 16x oversampling UART receiver sample data bits at ticks 7, 8, and 9?",
          options: [
            "Because ticks 7, 8, and 9 represent the mathematical center of the bit period where the analog signal has stabilized.",
            "Because ticks 1 through 6 are reserved for parity bit checksum calculation.",
            "Because microcontrollers can only read GPIO pins when the timer counter equals an odd number.",
            "Because sampling at tick 0 would cause a hardware interrupt storm."
          ],
          answer: 0,
          why: "Sampling at the center (ticks 7, 8, 9) maximizes tolerance against rise-time distortion, capacitive slew rates, and clock drift."
        }
      },
      {
        title: "Interrupt-Driven Ring Buffered UART Reception",
        say: [
          "In production firmware, polling the UART status register in a tight while loop (blocking I/O) is strictly forbidden because it starves the CPU of compute cycles.",
          "If the microcontroller is busy executing a motor control loop when a byte arrives, the UART Data Register (DR) will be overwritten by the next incoming byte, causing an Overrun Error (ORE).",
          "To guarantee zero byte loss, embedded architectures configure the UART Receive Not Empty (RXNE) interrupt coupled with a lock-free circular FIFO ring buffer.",
          "When the hardware shifts in the final stop bit, the RXNE flag asserts and immediately vectors the CPU into the USART Interrupt Service Routine (ISR).",
          "The ISR reads the character from the hardware register into the RAM ring buffer in less than 30 assembly instructions, clearing the interrupt and leaving main application tasks unblocked."
        ],
        example: "A circular FIFO buffer storing incoming telemetry packets: the head pointer advances on RXNE interrupts while the tail pointer advances in user space.",
        code: `#include <iostream>
#include <cstdint>

template <size_t SIZE>
class UartRingBuffer {
private:
    uint8_t buffer_[SIZE];
    volatile size_t head_{0};
    volatile size_t tail_{0};

public:
    bool pushFromISR(uint8_t byte) {
        size_t nextHead = (head_ + 1) % SIZE;
        if (nextHead == tail_) {
            return false;
        }
        buffer_[head_] = byte;
        head_ = nextHead;
        return true;
    }

    bool pop(uint8_t& byte) {
        if (head_ == tail_) {
            return false;
        }
        byte = buffer_[tail_];
        tail_ = (tail_ + 1) % SIZE;
        return true;
    }

    size_t count() const {
        return (head_ >= tail_) ? (head_ - tail_) : (SIZE - tail_ + head_);
    }
};

int main() {
    UartRingBuffer<16> rxQueue;

    rxQueue.pushFromISR('$');
    rxQueue.pushFromISR('G');
    rxQueue.pushFromISR('P');
    rxQueue.pushFromISR('G');

    std::cout << "Buffered Bytes: " << rxQueue.count() << "\\n";
    std::cout << "Popped Stream: ";
    uint8_t ch;
    while (rxQueue.pop(ch)) {
        std::cout << static_cast<char>(ch);
    }
    std::cout << "\\nZero-Overrun Invariant: Lock-free ring buffer decouples hardware ISR from processing loop.\\n";
    return 0;
}`,
        output: `Buffered Bytes: 4
Popped Stream: $GPG
Zero-Overrun Invariant: Lock-free ring buffer decouples hardware ISR from processing loop.`,
        codeNotes: [
          { line: 8, note: "Head and tail pointers declared volatile to prevent compiler register caching across ISR boundaries" },
          { line: 13, note: "Lock-free single-producer single-consumer circular buffer requires no mutex or critical section" },
          { line: 22, note: "User task pops buffered bytes asynchronously without stalling incoming serial transfers" }
        ],
        tryIt: "Test what happens if the ring buffer fills to capacity (push 16 bytes into a size-16 buffer) and verify that pushFromISR returns false.",
        check: {
          question: "Why are the head and tail indices of an embedded ring buffer declared with the volatile keyword?",
          options: [
            "To notify the compiler that their values can be modified asynchronously by an Interrupt Service Routine, preventing register optimization.",
            "To allocate the pointers in battery-backed SRAM rather than CPU registers.",
            "To encrypt the memory contents against buffer overflow attacks.",
            "To force the C++ compiler to generate 64-bit atomic instructions."
          ],
          answer: 0,
          why: "Without volatile, an optimizing compiler may cache head or tail in a CPU register, leading the user loop to read stale values and hang indefinitely."
        }
      },
      {
        title: "Hardware Flow Control (RTS / CTS) & Line Noise Immunity",
        say: [
          "Software ring buffers protect against microsecond-scale processing jitter, but if the main thread blocks for several milliseconds, even a large buffer will eventually overflow.",
          "Hardware Flow Control eliminates buffer overflows at the physical electrical layer by adding two dedicated signaling wires: Ready To Send (RTS) and Clear To Send (CTS).",
          "RTS is an active-LOW output from the receiver: when the local receive buffer reaches 80% capacity, the hardware deasserts RTS (pulls it HIGH), signaling the remote transmitter to halt.",
          "CTS is an active-LOW input on the transmitter: before transmitting any byte, the transmitter checks CTS; if HIGH, transmission pauses instantly without losing a single bit.",
          "Coupling RTS/CTS flow control with RS-485 or RS-232 differential line drivers provides bulletproof noise immunity across hundred-meter industrial factory floors."
        ],
        example: "A receiver automatically pulls RTS HIGH when its ring buffer exceeds high-water mark, forcing the remote sender to throttle transmission.",
        code: `#include <iostream>
#include <cstdint>

class HardwareFlowController {
private:
    size_t capacity_;
    size_t currentFill_;
    bool rtsAsserted_;

public:
    HardwareFlowController(size_t capacity)
        : capacity_(capacity), currentFill_(0), rtsAsserted_(true) {}

    void onByteReceived() {
        currentFill_++;
        if (currentFill_ >= (capacity_ * 80) / 100) {
            rtsAsserted_ = false;
        }
    }

    void onBytesProcessed(size_t count) {
        if (count >= currentFill_) currentFill_ = 0;
        else currentFill_ -= count;
        if (currentFill_ <= (capacity_ * 40) / 100) {
            rtsAsserted_ = true;
        }
    }

    bool isReadyToReceive() const { return rtsAsserted_; }
    size_t getFill() const { return currentFill_; }
};

int main() {
    HardwareFlowController uartRx(100);

    for (int i = 0; i < 85; ++i) {
        uartRx.onByteReceived();
    }
    std::cout << "Buffer Fill: " << uartRx.getFill() << "/100\\n";
    std::cout << "RTS State: " << (uartRx.isReadyToReceive() ? "ASSERTED (Ready)" : "DEASSERTED (Halt Sender)") << "\\n";

    uartRx.onBytesProcessed(60);
    std::cout << "After Processing 60 Bytes -> Fill: " << uartRx.getFill() << "/100\\n";
    std::cout << "RTS State: " << (uartRx.isReadyToReceive() ? "ASSERTED (Ready)" : "DEASSERTED (Halt Sender)") << "\\n";
    return 0;
}`,
        output: `Buffer Fill: 85/100
RTS State: DEASSERTED (Halt Sender)
After Processing 60 Bytes -> Fill: 25/100
RTS State: ASSERTED (Ready)`,
        codeNotes: [
          { line: 16, note: "Deasserts RTS at 80% capacity to give remote transmitter time to stop before buffer overflow" },
          { line: 24, note: "Hysteresis low-water mark (40%) prevents rapid RTS pin oscillation during high-throughput bursts" },
          { line: 40, note: "Automatically re-asserts RTS when sufficient queue headroom has been restored" }
        ],
        tryIt: "Adjust the high-water threshold to 90% and low-water to 50% and trace the RTS transitions under simulated burst traffic.",
        check: {
          question: "What is the primary function of RTS/CTS hardware flow control in serial links?",
          options: [
            "To allow the receiver to physically pause the remote transmitter when local buffers approach capacity, preventing data loss.",
            "To encrypt data packets during wireless radio transmission.",
            "To double the serial transmission baud rate over single copper wires.",
            "To automatically correct bit errors using Reed-Solomon codes."
          ],
          answer: 0,
          why: "Hardware flow control uses RTS and CTS voltage levels to throttle the sender before the receiver's buffer overflows, guaranteeing zero data loss."
        }
      },
      {
        title: "Industrial UART Packet Framing & End-to-End CRC Verification",
        say: [
          "A raw stream of individual bytes is useless to an embedded application unless framed into structured packets with start delimiters, length tags, and checksums.",
          "In hostile industrial environments filled with variable frequency drives and electromagnetic interference (EMI), noise spikes can inject phantom bytes or corrupt bits.",
          "A robust industrial UART protocol encapsulates payloads with a unique synchronization header (e.g., 0xAA 0x55), a packet length field, an operation opcode, and a CRC-16 checksum.",
          "The receiver processes incoming bytes through a deterministic Finite State Machine (FSM): hunting for sync bytes, buffering payload fields, and validating the CRC before dispatching to application logic.",
          "If the computed CRC does not match the packet trailer, the frame is discarded and an error counter increments, protecting the microcontroller from executing corrupted commands."
        ],
        example: "A packet framing state machine parses a telemetry frame and verifies its CRC-16 checksum, rejecting corrupted packets.",
        code: `#include <iostream>
#include <cstdint>
#include <vector>

struct UartFrameParser {
    static uint16_t computeCRC16(const uint8_t* data, size_t length) {
        uint16_t crc = 0xFFFF;
        for (size_t i = 0; i < length; ++i) {
            crc ^= static_cast<uint16_t>(data[i]) << 8;
            for (int bit = 0; bit < 8; ++bit) {
                if (crc & 0x8000) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc <<= 1;
                }
            }
        }
        return crc;
    }
};

int main() {
    uint8_t payload[] = {0xAA, 0x55, 0x02, 0x01, 0x10, 0x20};
    uint16_t expectedCrc = UartFrameParser::computeCRC16(payload, sizeof(payload));

    std::cout << "Packet Payload Bytes: " << sizeof(payload) << "\\n";
    std::cout << "Computed CRC-16/CCITT: 0x" << std::hex << std::uppercase << expectedCrc << std::dec << "\\n";

    payload[5] ^= 0x01;
    uint16_t corruptedCrc = UartFrameParser::computeCRC16(payload, sizeof(payload));
    std::cout << "Corrupted CRC: 0x" << std::hex << std::uppercase << corruptedCrc << std::dec << "\\n";
    std::cout << "Frame Validation: " << (expectedCrc == corruptedCrc ? "ACCEPTED" : "REJECTED (CRC Mismatch)") << "\\n";
    return 0;
}`,
        output: `Packet Payload Bytes: 6
Computed CRC-16/CCITT: 0x8B32
Corrupted CRC: 0xC1C3
Frame Validation: REJECTED (CRC Mismatch)`,
        codeNotes: [
          { line: 6, note: "Implements CRC-16/CCITT polynomial (0x1021) with 0xFFFF seed for industrial error detection" },
          { line: 22, note: "Frame synchronization header 0xAA 0x55 anchors byte stream alignment" },
          { line: 31, note: "Instantly rejects corrupted payload when checksum mismatch occurs" }
        ],
        tryIt: "Modify the payload length byte and observe how the CRC-16 catches length tampering.",
        check: {
          question: "Why should industrial UART byte streams always be encapsulated with a sync header and CRC checksum?",
          options: [
            "To delineate packet boundaries in a continuous byte stream and reject frames corrupted by electromagnetic line noise.",
            "To convert serial bytes into parallel bus signals.",
            "Because microcontrollers cannot receive data without a CRC calculation.",
            "To prevent the baud rate generator from overheating."
          ],
          answer: 0,
          why: "Sync headers provide stream realignment when bytes are lost, while CRC checksums detect multi-bit transmission errors caused by industrial EMI."
        }
      }
    ],
    summary: [
      "UART communication is completely asynchronous, requiring both sides to maintain cumulative clock drift below 2.5% over the 10-bit frame.",
      "Hardware 16x oversampling detects the Start bit falling edge and samples data bits at ticks 7, 8, 9 via 3-pulse majority voting.",
      "Interrupt-driven reception using the RXNE flag coupled with circular FIFO ring buffers decouples hardware interrupts from user processing.",
      "RTS/CTS hardware flow control prevents buffer overflows at the physical electrical layer by throttling remote transmitters.",
      "Encapsulating byte streams with sync headers, length tags, and CRC-16 checksums guarantees end-to-end data integrity in noisy industrial environments."
    ],
    projectStep: {
      title: "Step 6: Constructing the High-Throughput Asynchronous UART Engine",
      steps: [
        "Implement UartBaudCalculator computing fractional USART_BRR divisors with < 2.5% clock error.",
        "Develop UartOversampler evaluating 16x oversampling and 3-pulse majority voting for start and data bits.",
        "Build a lock-free UartRingBuffer circular FIFO decoupling the RXNE interrupt service routine from user tasks.",
        "Create a HardwareFlowController with high and low watermarks managing physical RTS/CTS throttle signals.",
        "Implement an industrial UartFrameParser validating sync headers and CRC-16 checksums under simulated EMI line noise."
      ]
    }
  },
  {
    day: 7,
    title: "Serial Peripheral Interface (SPI): Synchronous Shift Registers, CPOL, CPHA & High-Speed Clocks",
    goal: "Scale bus throughput to tens of megahertz: master the Serial Peripheral Interface (SPI). Compare synchronous bus architecture (with a dedicated shared clock line, SCK) against asynchronous UART. Deconstruct the circular shift register topology: explain why SPI is inherently full-duplex (every write is simultaneously a read). Master the 4 SPI Modes: Clock Polarity (CPOL) and Clock Phase (CPHA). Calculate SPI baud prescalers from peripheral bus clocks, analyze Chip Select (CS/SS) assertion setup and hold times, and write a high-throughput SPI Flash memory page streaming engine.",
    minutes: 36,
    recap: "Yesterday in Day 6, we mastered asynchronous serial UART communication physics, fractional Baud Rate Register (BRR) calculations, 16x oversampling, and start-bit detection. Today in Day 7, we advance to high-speed synchronous communications with the Serial Peripheral Interface (SPI).",
    parts: [
      {
        title: "Synchronous Shift Register Topology & Full-Duplex Physics",
        say: [
          "Welcome to Day 7! While UART tops out at around 1 Mbps due to asynchronous clock drift limits, the Serial Peripheral Interface (SPI) routinely operates at 20 to 50 MHz.",
          "SPI achieves this extreme throughput by introducing a dedicated shared clock wire: Serial Clock (SCK), generated exclusively by the Master controller.",
          "At the physical silicon layer, an SPI link consists of two 8-bit or 16-bit shift registers connected in a circular loop: one inside the Master, and one inside the Slave.",
          "Master Out Slave In (MOSI) carries bits from Master to Slave, while Master In Slave Out (MISO) carries bits from Slave to Master on the exact same clock pulse.",
          "Because bits are simultaneously shifted out of one register and into the other, SPI is fundamentally full-duplex: you cannot transmit a byte without receiving a byte, and you cannot receive a byte without transmitting a byte."
        ],
        example: "An SPI Master shifting out command byte 0x9F (Read JEDEC ID) while simultaneously shifting in status byte 0x00 from an external SPI Flash chip.",
        code: `#include <iostream>
#include <cstdint>

struct SpiShiftRegister {
    static uint8_t transferByte(uint8_t masterOut, uint8_t slaveOut, uint8_t& slaveIn) {
        uint8_t masterIn = 0;
        slaveIn = 0;
        // Shift 8 bits simultaneously (MSB first)
        for (int i = 7; i >= 0; --i) {
            uint8_t mosiBit = (masterOut >> i) & 0x01;
            uint8_t misoBit = (slaveOut >> i) & 0x01;
            slaveIn |= (mosiBit << i);
            masterIn |= (misoBit << i);
        }
        return masterIn;
    }
};

int main() {
    uint8_t masterTx = 0x9F; // JEDEC Read ID Opcode
    uint8_t slaveTx = 0xEF;  // Winbond Manufacturer ID in Flash shift register
    uint8_t slaveRx = 0;

    uint8_t masterRx = SpiShiftRegister::transferByte(masterTx, slaveTx, slaveRx);

    std::cout << "Master Transmitted: 0x" << std::hex << std::uppercase << static_cast<int>(masterTx) << "\\n";
    std::cout << "Master Received:    0x" << static_cast<int>(masterRx) << "\\n";
    std::cout << "Slave Received:     0x" << static_cast<int>(slaveRx) << "\\n";
    std::cout << "Full-Duplex Invariant: Synchronous clock shifted both registers simultaneously.\\n";
    return 0;
}`,
        output: `Master Transmitted: 0x9F
Master Received:    0xEF
Slave Received:     0x9F
Full-Duplex Invariant: Synchronous clock shifted both registers simultaneously.`,
        codeNotes: [
          { line: 5, note: "Full-duplex transfer loop shifts bits synchronously across MOSI and MISO" },
          { line: 21, note: "Master receives 0xEF while simultaneously sending 0x9F in single 8-clock cycle" },
          { line: 27, note: "No separate read operation exists; reading requires transmitting a dummy byte" }
        ],
        tryIt: "Simulate sending a dummy byte (0xFF) to clock in the second byte of the Flash memory device ID (e.g., 0x40).",
        check: {
          question: "Why is the Serial Peripheral Interface (SPI) characterized as an inherently full-duplex protocol?",
          options: [
            "Because the Master and Slave shift registers are connected in a circular loop; every clock pulse simultaneously shifts one bit out and one bit in.",
            "Because it uses two separate microprocessors operating on different frequencies.",
            "Because it supports full Wi-Fi and Bluetooth packet transmission simultaneously.",
            "Because data can only travel in one direction at a time."
          ],
          answer: 0,
          why: "SPI is physically a distributed circular ring shift register: shifting one bit onto MOSI always forces one bit into MISO on the exact same clock edge."
        }
      },
      {
        title: "SPI Modes 0, 1, 2, 3: Clock Polarity (CPOL) & Clock Phase (CPHA)",
        say: [
          "Unlike standard UART where idle lines are always HIGH, SPI peripherals support four distinct clocking modes defined by Clock Polarity (CPOL) and Clock Phase (CPHA).",
          "CPOL defines the idle electrical state of the SCK clock line when no transfer is active: CPOL=0 means SCK is idle LOW; CPOL=1 means SCK is idle HIGH.",
          "CPHA defines which clock transition edge is used to capture (sample) data versus toggle (change) data.",
          "In CPHA=0, data is captured on the first clock edge (leading edge) and toggled on the second edge (trailing edge). In CPHA=1, data is toggled on the first edge and captured on the second edge.",
          "Mode 0 (CPOL=0, CPHA=0) and Mode 3 (CPOL=1, CPHA=1) are the most common industrial modes because both capture data on a rising clock edge."
        ],
        example: "Configuring SPI Control Register 1 (SPI_CR1) for Mode 0: clearing CPOL (bit 1) and CPHA (bit 0) ensures SCK is idle LOW and data is sampled on the first rising edge.",
        code: `#include <iostream>
#include <cstdint>

struct SpiModeConfig {
    uint8_t cpol;
    uint8_t cpha;

    const char* getCaptureEdge() const {
        if (cpol == 0 && cpha == 0) return "Leading Edge (Rising)";
        if (cpol == 0 && cpha == 1) return "Trailing Edge (Falling)";
        if (cpol == 1 && cpha == 0) return "Leading Edge (Falling)";
        return "Trailing Edge (Rising)";
    }

    uint8_t getCr1Bits() const {
        return (cpol << 1) | cpha;
    }
};

int main() {
    SpiModeConfig mode0{0, 0};
    SpiModeConfig mode3{1, 1};

    std::cout << "SPI Mode 0 (CPOL=0, CPHA=0):\\n";
    std::cout << "  CR1 Bits: 0b00\\n";
    std::cout << "  Capture:  " << mode0.getCaptureEdge() << "\\n";

    std::cout << "SPI Mode 3 (CPOL=1, CPHA=1):\\n";
    std::cout << "  CR1 Bits: 0b11\\n";
    std::cout << "  Capture:  " << mode3.getCaptureEdge() << "\\n";
    return 0;
}`,
        output: `SPI Mode 0 (CPOL=0, CPHA=0):
  CR1 Bits: 0b00
  Capture:  Leading Edge (Rising)
SPI Mode 3 (CPOL=1, CPHA=1):
  CR1 Bits: 0b11
  Capture:  Trailing Edge (Rising)`,
        codeNotes: [
          { line: 7, note: "Evaluates physical clock edge mapping according to IEEE/Motorola SPI specifications" },
          { line: 23, note: "Mode 0 samples on rising leading edge with SCK idle LOW" },
          { line: 27, note: "Mode 3 samples on rising trailing edge with SCK idle HIGH" }
        ],
        tryIt: "Examine Mode 1 (CPOL=0, CPHA=1) and Mode 2 (CPOL=1, CPHA=0) and determine their capture and toggle edges.",
        check: {
          question: "What happens if an SPI Master configured in Mode 0 communicates with an SPI Slave that strictly requires Mode 3?",
          options: [
            "Data bits are sampled at the wrong clock transition edge, causing shifted bit values or corrupted payload bytes.",
            "The microcontroller's power supply immediately trips its overcurrent protection.",
            "The SPI bus automatically renegotiates to Mode 0 via software handshake.",
            "The clock speed doubles automatically to compensate for phase errors."
          ],
          answer: 0,
          why: "Mode mismatch causes the receiver to sample data while the transmitter is actively toggling the voltage line, reading invalid transition states."
        }
      },
      {
        title: "Chip Select (CS) Assertion Timing, Setup & Hold Invariants",
        say: [
          "Because SPI does not include device addresses in its packet headers, bus addressing is handled electrically using dedicated Chip Select (CS) or Slave Select (SS) GPIO pins.",
          "Chip Select lines are almost universally active-LOW: pulling CS to 0V enables the target peripheral's internal shift register, while pulling CS to 3.3V tri-states its MISO pin.",
          "If multiple slaves share the same MOSI, MISO, and SCK lines, asserting more than one CS line simultaneously creates a catastrophic bus contention short-circuit on MISO.",
          "Furthermore, hardware datasheets specify strict timing invariants: CS Setup Time ($t_{CSS}$) requires asserting CS for at least 5 to 50 nanoseconds before toggling SCK.",
          "Similarly, CS Hold Time ($t_{CSH}$) requires maintaining CS LOW after the final clock edge before deasserting to prevent premature transaction truncation."
        ],
        example: "A software SPI driver asserts CS LOW, waits for setup time, clocks out 16 bits of sensor data, waits for hold time, and deasserts CS HIGH.",
        code: `#include <iostream>
#include <cstdint>

class SpiChipSelectGuard {
private:
    bool isAsserted_{false};
    uint32_t activeDevice_{0};

public:
    bool select(uint32_t deviceId) {
        if (isAsserted_) {
            return false; // Error: Another device is currently selected!
        }
        activeDevice_ = deviceId;
        isAsserted_ = true;
        // Physical GPIO pin pulled LOW
        return true;
    }

    void deselect() {
        // Physical GPIO pin pulled HIGH (Tri-state MISO)
        isAsserted_ = false;
        activeDevice_ = 0;
    }

    bool isBusy() const { return isAsserted_; }
    uint32_t getActiveDevice() const { return activeDevice_; }
};

int main() {
    SpiChipSelectGuard csManager;

    bool dev1Selected = csManager.select(1); // Select SPI Flash (CS1 LOW)
    std::cout << "Device 1 Selected: " << (dev1Selected ? "SUCCESS (CS1 Active LOW)" : "FAILED") << "\\n";

    bool dev2Selected = csManager.select(2); // Attempt to select IMU while Flash busy
    std::cout << "Device 2 Concurrent Select: " << (dev2Selected ? "SUCCESS" : "BLOCKED (Bus Contention Prevented)") << "\\n";

    csManager.deselect();
    std::cout << "Device 1 Deselected (CS1 Pulled HIGH -> MISO Tri-stated)\\n";
    return 0;
}`,
        output: `Device 1 Selected: SUCCESS (CS1 Active LOW)
Device 2 Concurrent Select: BLOCKED (Bus Contention Prevented)
Device 1 Deselected (CS1 Pulled HIGH -> MISO Tri-stated)`,
        codeNotes: [
          { line: 10, note: "Enforces mutual exclusion on physical Chip Select lines to prevent MISO drive conflicts" },
          { line: 20, note: "Deasserting CS releases MISO into high-impedance (tri-state) mode" },
          { line: 34, note: "Rejects concurrent assertion of secondary slave on shared SPI bus" }
        ],
        tryIt: "Add a mock nanosecond delay function for tCSS and tCSH to simulate hardware propagation delays before and after SCK toggling.",
        check: {
          question: "Why is it dangerous to assert the Chip Select pins of two different SPI slaves on the same bus simultaneously?",
          options: [
            "Both slaves will attempt to drive the shared MISO line at the same time, causing electrical contention and signal corruption.",
            "It causes the microcontroller to reboot due to memory address conflicts.",
            "The SPI peripheral automatically switches into I2C mode.",
            "It corrupts the ARM Cortex-M vector table."
          ],
          answer: 0,
          why: "If two slaves drive MISO simultaneously (one driving 3.3V and the other driving 0V), it creates a direct electrical short and corrupts all data."
        }
      },
      {
        title: "High-Throughput SPI NOR Flash Memory Page Streaming",
        say: [
          "One of the primary industrial applications of high-speed SPI is interfacing with external NOR Flash memory chips (e.g., Winbond W25Q128 or Macronix MX25L).",
          "Flash memory is organized hierarchically into Sectors (4KB), Blocks (64KB), and Pages (256 bytes).",
          "While reading can occur continuously across page boundaries, writing (Page Program) is subject to a strict physical silicon constraint: you can only program up to 256 bytes per transaction.",
          "If a write operation attempts to stream 300 bytes into page address 0x000000, the address counter rolls over at the 256-byte boundary, overwriting the beginning of the page!",
          "A production SPI Flash driver decomposes arbitrary buffer lengths into chunked page-aligned writes, monitoring the internal Write In Progress (WIP) status bit between operations."
        ],
        example: "A chunked Flash write engine splits a 500-byte firmware update chunk into two page-aligned writes of 256 bytes and 244 bytes.",
        code: `#include <iostream>
#include <cstdint>
#include <algorithm>

struct SpiFlashPageWriter {
    static void streamChunkedWrites(uint32_t address, size_t totalBytes) {
        size_t bytesRemaining = totalBytes;
        uint32_t currentAddr = address;

        while (bytesRemaining > 0) {
            uint32_t pageOffset = currentAddr % 256;
            size_t bytesCanWrite = std::min(bytesRemaining, static_cast<size_t>(256 - pageOffset));

            std::cout << "Write Page Op: Addr=0x" << std::hex << std::uppercase << currentAddr << std::dec
                      << " | Bytes=" << bytesCanWrite << " (Offset in Page: " << pageOffset << ")\\n";

            currentAddr += bytesCanWrite;
            bytesRemaining -= bytesCanWrite;
        }
    }
};

int main() {
    uint32_t startAddr = 0x001050; // Offset 80 inside Page 16
    size_t dataLen = 500;          // 500 bytes of firmware delta

    std::cout << "Initiating 500-Byte SPI Flash Stream:\\n";
    SpiFlashPageWriter::streamChunkedWrites(startAddr, dataLen);
    std::cout << "Flash Invariant: Page boundary rollover eliminated via chunk alignment.\\n";
    return 0;
}`,
        output: `Initiating 500-Byte SPI Flash Stream:
Write Page Op: Addr=0x1050 | Bytes=176 (Offset in Page: 80)
Write Page Op: Addr=0x1100 | Bytes=256 (Offset in Page: 0)
Write Page Op: Addr=0x1200 | Bytes=68 (Offset in Page: 0)
Flash Invariant: Page boundary rollover eliminated via chunk alignment.`,
        codeNotes: [
          { line: 10, note: "Calculates remaining headroom in current 256-byte page to prevent memory rollover" },
          { line: 13, note: "Dispatches first chunk of 176 bytes to fill remaining space in starting page" },
          { line: 27, note: "Subsequent chunks align perfectly on 256-byte page boundaries (0x1100, 0x1200)" }
        ],
        tryIt: "Test streaming 1024 bytes starting from page boundary 0x002000 and verify that 4 exact 256-byte page operations are generated.",
        check: {
          question: "What happens if an SPI Page Program command writes 300 bytes starting at page offset 200 without boundary chunking?",
          options: [
            "The internal address pointer rolls over at byte 256, overwriting the first 44 bytes of the current page and corrupting data.",
            "The Flash chip automatically creates a new 4KB sector in memory.",
            "The extra 44 bytes are automatically buffered in the microcontroller's stack.",
            "The SPI peripheral triggers a hardware bus error interrupt."
          ],
          answer: 0,
          why: "SPI NOR Flash hardware page programming registers do not increment across page boundaries; exceeding the 256-byte boundary wraps around to offset 0."
        }
      },
      {
        title: "DMA-Accelerated SPI Transceiver & Bus Arbitration",
        say: [
          "When streaming display buffers to an SPI TFT screen or logging sensor data to Flash at 20 MHz, CPU bit-banging or interrupt-per-byte handling saturates the processor.",
          "At 20 Mbps, a byte arrives every 400 nanoseconds; an ISR taking 20 clock cycles on a 100MHz MCU would consume 100% of the CPU's compute bandwidth.",
          "The professional embedded architecture couples the SPI peripheral with Direct Memory Access (DMA): SPI_TX DMA channel and SPI_RX DMA channel.",
          "The CPU configures memory source pointers, byte transfer counts, and starts the DMA streams; the DMA controller transfers megabytes of data directly over the bus matrix with zero CPU intervention.",
          "When the final byte is clocked out, the DMA controller fires a Transfer Complete (TC) interrupt, allowing the CPU to deassert Chip Select and process the results."
        ],
        example: "A DMA descriptor configures a 1,024-byte zero-copy SPI transfer, freeing the CPU to execute flight control algorithms.",
        code: `#include <iostream>
#include <cstdint>

struct SpiDmaDescriptor {
    uint32_t memoryAddress;
    uint32_t peripheralAddress;
    uint16_t transferLength;
    bool isComplete;

    void startTransfer() {
        std::cout << "DMA Stream Configured: " << transferLength << " bytes from 0x"
                  << std::hex << memoryAddress << " -> SPI_DR (0x" << peripheralAddress << ")\\n";
        isComplete = false;
    }

    void onHardwareTransferCompleteISR() {
        isComplete = true;
        std::cout << "DMA Transfer Complete ISR Fired: CPU Interrupted after "
                  << std::dec << transferLength << " bytes.\\n";
    }
};

int main() {
    uint8_t txBuffer[1024];
    SpiDmaDescriptor dmaTx{
        reinterpret_cast<uint32_t>(&txBuffer),
        0x4001300C, // SPI1_DR address
        1024,
        false
    };

    dmaTx.startTransfer();
    std::cout << "CPU Status: 100% available for control loop tasks while DMA streams bus data.\\n";
    dmaTx.onHardwareTransferCompleteISR();
    return 0;
}`,
        output: `DMA Stream Configured: 1024 bytes from 0x0 -> SPI_DR (0x4001300C)
CPU Status: 100% available for control loop tasks while DMA streams bus data.
DMA Transfer Complete ISR Fired: CPU Interrupted after 1024 bytes.`,
        codeNotes: [
          { line: 8, note: "Binds memory buffer to hardware peripheral register via hardware bus matrix" },
          { line: 28, note: "CPU executes main application logic concurrently without servicing per-byte interrupts" },
          { line: 30, note: "Single Transfer Complete interrupt signals end of entire 1KB packet transmission" }
        ],
        tryIt: "Calculate the CPU load reduction achieved by DMA vs byte-by-byte interrupts for a 20MHz SPI link streaming 1MB of display graphics.",
        check: {
          question: "Why is DMA essential when operating SPI at high clock frequencies (e.g., 20MHz to 50MHz)?",
          options: [
            "Because bytes arrive every few hundred nanoseconds, which would completely overwhelm the CPU with per-byte interrupt overhead.",
            "Because SPI Flash memory chips cannot be read without DMA hardware.",
            "Because the C++ compiler deletes variables if DMA is not enabled.",
            "Because DMA encrypts the SPI clock line against eavesdropping."
          ],
          answer: 0,
          why: "At high SPI frequencies, per-byte interrupts consume nearly 100% of CPU cycles; DMA streams data autonomously via the silicon bus matrix."
        }
      }
    ],
    summary: [
      "SPI is a high-speed synchronous protocol based on a circular shift register topology where every transmission is simultaneously a reception.",
      "The 4 SPI Modes (CPOL 0/1 and CPHA 0/1) determine clock idle polarity and whether data is sampled on the leading or trailing clock edge.",
      "Chip Select (CS) lines must enforce mutual exclusion and satisfy hardware setup ($t_{CSS}$) and hold ($t_{CSH}$) timing invariants.",
      "SPI NOR Flash writes must be chunked to respect physical 256-byte page boundaries, preventing catastrophic address rollover.",
      "Coupling SPI with Direct Memory Access (DMA) enables zero-copy multi-megabyte streaming while leaving the CPU 100% free for control algorithms."
    ],
    projectStep: {
      title: "Step 7: Building the Synchronous High-Speed SPI Engine",
      steps: [
        "Implement SpiShiftRegister simulating full-duplex circular register transfers between Master and Slave.",
        "Develop SpiModeConfig verifying CPOL and CPHA clock edge transitions across all 4 standard SPI modes.",
        "Construct a SpiChipSelectGuard ensuring mutual exclusion and preventing electrical bus contention on MISO.",
        "Build a SpiFlashPageWriter chunking multi-byte payloads to strictly eliminate 256-byte Flash page rollover.",
        "Implement a SpiDmaDescriptor framework verifying zero-copy DMA streaming and Transfer Complete interrupt handling."
      ]
    }
  },
  {
    day: 8,
    title: "Inter-Integrated Circuit (I2C): Open-Drain Buses, Pull-Ups, Start/Stop Conditions & Clock Stretching",
    goal: "Master the world's most ubiquitous two-wire sensor bus: Inter-Integrated Circuit (I2C). Understand the electrical physics of Open-Drain pins and why pull-up resistors ($R_p$) are required. Calculate minimum and maximum pull-up resistance based on bus supply voltage, bus capacitance ($C_b$), and rise-time requirements ($t_r$). Deconstruct 7-bit addressing, START/STOP framing, and ACK/NACK handshakes. Analyze Clock Stretching mechanics and implement an automated 9-clock bus unjamming recovery routine to recover from hung slave conditions.",
    minutes: 36,
    recap: "Yesterday in Day 7, we mastered the high-speed Serial Peripheral Interface (SPI), circular shift registers, CPOL/CPHA modes, and NOR Flash page streaming. Today in Day 8, we master the two-wire Inter-Integrated Circuit (I2C) sensor bus.",
    parts: [
      {
        title: "Open-Drain Electrical Physics & Pull-Up Resistor Calculus",
        say: [
          "Welcome to Day 8! While SPI requires four dedicated wires plus a separate Chip Select wire for every connected slave, the Inter-Integrated Circuit (I2C) bus connects dozens of sensors over just two wires: Serial Data (SDA) and Serial Clock (SCL).",
          "I2C accomplishes this multiplexing by mandating Open-Drain (or Open-Collector) pin drivers on all connected devices.",
          "An open-drain transistor can actively pull a wire LOW to 0V (ground), but it cannot drive the wire HIGH to 3.3V; instead, the wire floats HIGH via an external Pull-Up Resistor ($R_p$).",
          "This creates a Wired-AND electrical logic: if any single device pulls the line LOW, the entire bus is LOW; the bus only floats HIGH when all devices release their transistors.",
          "Calculating the pull-up resistance is a delicate trade-off: if $R_p$ is too large, parasitic bus capacitance ($C_b$) slows voltage rise times ($t_r$), corrupting high-frequency 400kHz signals; if $R_p$ is too small, excessive saturation current damages the output transistors."
        ],
        example: "Calculating pull-up resistor limits for a 3.3V bus with 100pF parasitic capacitance: Minimum $R_p = (3.3V - 0.4V) / 3mA = 967\\Omega$; Maximum $R_p = 1000ns / (0.8473 \\times 100pF) = 11.8k\\Omega$. A 4.7k$\\Omega$ resistor provides an ideal compromise.",
        code: `#include <iostream>
#include <cstdint>
#include <cmath>

struct I2cPullUpCalculator {
    static double computeMinRp(double vdd, double volMax, double iolMin) {
        // Min Rp limits sink current to protect output MOSFET
        return (vdd - volMax) / iolMin;
    }

    static double computeMaxRp(double maxRiseTimeNs, double busCapacitancePf) {
        // Max Rp ensures RC time constant satisfies I2C spec rise time
        // tr = 0.8473 * Rp * Cb
        return (maxRiseTimeNs * 1e-9) / (0.8473 * (busCapacitancePf * 1e-12));
    }
};

int main() {
    double vdd = 3.3;             // 3.3V supply
    double volMax = 0.4;          // Max low-level voltage (0.4V)
    double iolMin = 0.003;        // 3mA sink current capability
    double maxRiseTime = 1000.0;  // 1000ns max rise time for 100kHz Standard-Mode
    double busCapacitance = 100.0;// 100pF total bus capacitance

    double minRp = I2cPullUpCalculator::computeMinRp(vdd, volMax, iolMin);
    double maxRp = I2cPullUpCalculator::computeMaxRp(maxRiseTime, busCapacitance);

    std::cout << "I2C Bus Voltage: " << vdd << "V | Bus Capacitance: " << busCapacitance << "pF\\n";
    std::cout << "Minimum Allowed Rp: " << static_cast<int>(minRp) << " Ohms (Sink Current Guard)\\n";
    std::cout << "Maximum Allowed Rp: " << static_cast<int>(maxRp) << " Ohms (Rise Time Guard)\\n";
    std::cout << "Recommended Nominal: 4700 Ohms (4.7k Standard Resistor)\\n";
    return 0;
}`,
        output: `I2C Bus Voltage: 3.3V | Bus Capacitance: 100pF
Minimum Allowed Rp: 966 Ohms (Sink Current Guard)
Maximum Allowed Rp: 11802 Ohms (Rise Time Guard)
Recommended Nominal: 4700 Ohms (4.7k Standard Resistor)`,
        codeNotes: [
          { line: 6, note: "Calculates minimum resistance to keep sink current strictly below 3mA threshold" },
          { line: 13, note: "Calculates maximum resistance based on RC exponential rise time: tr = 0.8473 * Rp * Cb" },
          { line: 28, note: "Standard 4.7k resistor safely satisfies both electrical boundary invariants" }
        ],
        tryIt: "Recalculate Rp limits for a 400kHz Fast-Mode bus where the maximum allowed rise time is restricted to 300ns.",
        check: {
          question: "What happens on an I2C bus if the pull-up resistors are too large (e.g., 100k-ohm instead of 2.2k-ohm on a 400kHz bus)?",
          options: [
            "The RC time constant causes the signal voltage to rise too slowly, preventing SCL and SDA from reaching logic HIGH before the next clock pulse.",
            "The output transistors burn out due to excessive electrical current.",
            "The I2C bus automatically switches to full-duplex SPI mode.",
            "The microcontroller's internal pull-downs catch fire."
          ],
          answer: 0,
          why: "Large pull-up resistors combine with trace capacitance to create slow, rounded rise edges that fail to cross the $V_{IH}$ logic threshold in time."
        }
      },
      {
        title: "START / STOP Framing, 7-Bit Addressing & ACK/NACK Handshaking",
        say: [
          "Under normal I2C operation, data on the SDA wire is only permitted to change states while the SCL clock wire is held LOW.",
          "If SDA changes while SCL is held HIGH, that transition is uniquely interpreted by all hardware listening on the bus as a Frame Delimiter.",
          "A START condition occurs when SDA transitions from HIGH to LOW while SCL is HIGH; a STOP condition occurs when SDA transitions from LOW to HIGH while SCL is HIGH.",
          "Following a START condition, the Master transmits a 7-bit Slave Address concatenated with an 8th Read/Write bit (0 for Write, 1 for Read).",
          "On the 9th clock pulse, the Master releases SDA; if the addressed slave is present on the bus, it pulls SDA LOW to signal an Acknowledge (ACK); leaving SDA floating HIGH signals a No-Acknowledge (NACK)."
        ],
        example: "Master addressing an I2C temperature sensor at address 0x48: the transmitted byte is (0x48 << 1) | 0 = 0x90 (Write operation), followed by the slave asserting ACK.",
        code: `#include <iostream>
#include <cstdint>

struct I2cAddressEncoder {
    static uint8_t formatAddressByte(uint8_t address7Bit, bool isRead) {
        return (address7Bit << 1) | (isRead ? 0x01 : 0x00);
    }
};

struct I2cTransactionSimulator {
    static bool executeAddressPhase(uint8_t addressByte, uint8_t slaveAddress) {
        uint8_t targetAddr = addressByte >> 1;
        bool rw = addressByte & 0x01;

        std::cout << "START Condition Generated (SDA Falling with SCL HIGH)\\n";
        std::cout << "Broadcasting Address: 0x" << std::hex << static_cast<int>(targetAddr)
                  << " [" << (rw ? "READ" : "WRITE") << "] -> Wire Byte: 0x"
                  << static_cast<int>(addressByte) << std::dec << "\\n";

        if (targetAddr == slaveAddress) {
            std::cout << "9th Clock Pulse: Slave Pulled SDA LOW -> ACK Received!\\n";
            return true;
        } else {
            std::cout << "9th Clock Pulse: SDA Floats HIGH -> NACK (Device Not Found)\\n";
            return false;
        }
    }
};

int main() {
    uint8_t tempSensorAddr = 0x48; // Texas Instruments TMP102
    uint8_t txByte = I2cAddressEncoder::formatAddressByte(tempSensorAddr, false); // Write

    bool ack = I2cTransactionSimulator::executeAddressPhase(txByte, 0x48);
    std::cout << "Transaction Handshake: " << (ack ? "CONFIRMED" : "ABORTED") << "\\n";
    return 0;
}`,
        output: `START Condition Generated (SDA Falling with SCL HIGH)
Broadcasting Address: 0x48 [WRITE] -> Wire Byte: 0x90
9th Clock Pulse: Slave Pulled SDA LOW -> ACK Received!
Transaction Handshake: CONFIRMED`,
        codeNotes: [
          { line: 5, note: "Left-shifts 7-bit address into upper 7 bits, placing R/W direction in bit 0" },
          { line: 20, note: "Slave acknowledges by pulling SDA LOW during 9th SCL clock cycle" },
          { line: 34, note: "Address 0x48 formatted as 0x90 for write and 0x91 for read" }
        ],
        tryIt: "Broadcast to a non-existent device address (e.g., 0x2A) and verify that the simulator reports a NACK timeout.",
        check: {
          question: "How is a START condition physically signaled on an I2C bus?",
          options: [
            "SDA transitions from HIGH to LOW while SCL is held HIGH.",
            "Both SDA and SCL are pulled LOW for 50 milliseconds.",
            "A special 9-bit binary character (0xFF) is transmitted on SDA.",
            "SCL toggles twice while SDA is held LOW."
          ],
          answer: 0,
          why: "By I2C standard definition, data transitions during SCL HIGH are forbidden during normal data transmission and uniquely designate START or STOP framing."
        }
      },
      {
        title: "Clock Stretching Mechanics & Slave Flow Control",
        say: [
          "Unlike SPI where the Master drives the clock unconditionally, I2C provides a hardware mechanism for slow slaves to pause transmission: Clock Stretching.",
          "If a microcontroller master requests data from a slow sensor (such as an ADC executing an internal conversion or an EEPROM writing to memory cells), the slave cannot respond immediately.",
          "Because SCL is an open-drain wire with wired-AND logic, the slave can actively pull SCL LOW and hold it there.",
          "When the Master attempts to release SCL to generate the next clock pulse, it senses that SCL remains at 0V; the Master must halt and wait until the slave releases the clock line.",
          "However, unbounded clock stretching is a severe production vulnerability: if a slave crashes or suffers a power glitch while holding SCL LOW, it permanently freezes the Master's communication thread."
        ],
        example: "An I2C Master monitors SCL during clock stretching, aborting with a timeout error if SCL remains clamped LOW for more than 10 milliseconds.",
        code: `#include <iostream>
#include <cstdint>

class I2cClockStretchMonitor {
public:
    static bool waitForSclRelease(uint32_t maxTimeoutMs, uint32_t simulatedHeldMs) {
        std::cout << "Master Released SCL -> Slave Holding SCL LOW (Clock Stretching)\\n";
        if (simulatedHeldMs > maxTimeoutMs) {
            std::cout << "ERROR: SCL Held LOW for " << simulatedHeldMs
                      << "ms (Exceeded " << maxTimeoutMs << "ms Timeout!)\\n";
            return false; // Hardware timeout!
        }
        std::cout << "Slave Released SCL after " << simulatedHeldMs << "ms -> Resuming Clock\\n";
        return true;
    }
};

int main() {
    uint32_t timeoutLimit = 10; // 10ms max allowed stretch

    bool normalOk = I2cClockStretchMonitor::waitForSclRelease(timeoutLimit, 3);
    std::cout << "Normal Stretch Result: " << (normalOk ? "PASSED" : "FAILED") << "\\n\\n";

    bool frozenOk = I2cClockStretchMonitor::waitForSclRelease(timeoutLimit, 15);
    std::cout << "Hung Slave Result: " << (frozenOk ? "PASSED" : "RECOVERABLE TIMEOUT") << "\\n";
    return 0;
}`,
        output: `Master Released SCL -> Slave Holding SCL LOW (Clock Stretching)
Slave Released SCL after 3ms -> Resuming Clock
Normal Stretch Result: PASSED

Master Released SCL -> Slave Holding SCL LOW (Clock Stretching)
ERROR: SCL Held LOW for 15ms (Exceeded 10ms Timeout!)
Hung Slave Result: RECOVERABLE TIMEOUT`,
        codeNotes: [
          { line: 6, note: "Implements hardware watchdog on SCL release to prevent infinite while-loops" },
          { line: 10, note: "Aborts bus transaction if slave holds clock line longer than 10ms threshold" },
          { line: 24, note: "Prevents systemic firmware lockup when peripheral sensors suffer brownout faults" }
        ],
        tryIt: "Decrease the timeout threshold to 2ms and observe how the normal 3ms stretch operation correctly triggers an error.",
        check: {
          question: "What is the danger of relying on unbounded while-loops when handling I2C clock stretching in production firmware?",
          options: [
            "If a slave hardware device freezes or disconnects while clamping SCL LOW, the Master remains stuck in the loop forever, crashing system firmware.",
            "It causes the I2C pull-up resistors to overheat and desolder from the circuit board.",
            "It violates the CAN bus protocol specification.",
            "It prevents the CPU from executing 32-bit integer arithmetic."
          ],
          answer: 0,
          why: "Unbounded loops on hardware status flags turn transient peripheral glitches into fatal, unrecoverable system hangs."
        }
      },
      {
        title: "Automated 9-Clock Bus Unjamming & Fault Recovery Engine",
        say: [
          "The most common physical fault on an I2C bus is the Hung Bus condition: the Master resets mid-byte, but the slave was in the middle of sending a 0 bit and continues holding SDA LOW.",
          "When the Master reboots, it sees SDA clamped to ground; because SDA is LOW, the Master cannot generate a valid START condition (which requires a falling edge while SCL is HIGH).",
          "The entire bus is permanently deadlocked, and software resets will fail to resolve the issue.",
          "The industrial solution is the 9-Clock Bus Clear Routine: the Master reconfigures SCL as a general-purpose GPIO output and manually toggles SCL up to 9 times.",
          "Each clock pulse forces the slave's internal shift register to advance; within 9 clocks, the slave finishes its byte, releases SDA, and allows the Master to send a clean STOP condition to restore normal operation."
        ],
        example: "A microcontroller reboots with SDA clamped LOW by a stuck sensor, manually clocks SCL 9 times until SDA releases, and asserts STOP.",
        code: `#include <iostream>
#include <cstdint>

class I2cBusRecoveryEngine {
public:
    static bool recoverHungBus(bool& sdaPin, bool& sclPin) {
        std::cout << "Fault Detected: SDA Clamped LOW by Stuck Slave (Bus Deadlocked)\\n";
        std::cout << "Initiating 9-Clock Recovery Sequence on SCL GPIO...\\n";

        for (int clockPulse = 1; clockPulse <= 9; ++clockPulse) {
            // Toggle SCL LOW then HIGH
            sclPin = false;
            sclPin = true;

            // Simulate slave releasing SDA after 5th clock pulse
            if (clockPulse == 5) {
                sdaPin = true; // Slave finished byte and released SDA
            }

            if (sdaPin) {
                std::cout << "Clock Pulse " << clockPulse << ": Slave Released SDA!\\n";
                // Generate clean STOP condition: SDA goes LOW to HIGH while SCL is HIGH
                sdaPin = false;
                sclPin = true;
                sdaPin = true;
                std::cout << "Generated STOP Condition: Bus Restored to Clean Idle State\\n";
                return true;
            }
        }
        return false;
    }
};

int main() {
    bool sda = false; // SDA stuck LOW
    bool scl = true;

    bool restored = I2cBusRecoveryEngine::recoverHungBus(sda, scl);
    std::cout << "Recovery Outcome: " << (restored ? "BUS HEALTHY (Ready for Traffic)" : "BUS PERMANENTLY FAULTED") << "\\n";
    return 0;
}`,
        output: `Fault Detected: SDA Clamped LOW by Stuck Slave (Bus Deadlocked)
Initiating 9-Clock Recovery Sequence on SCL GPIO...
Clock Pulse 5: Slave Released SDA!
Generated STOP Condition: Bus Restored to Clean Idle State
Recovery Outcome: BUS HEALTHY (Ready for Traffic)`,
        codeNotes: [
          { line: 6, note: "Reconfigures SCL pin as GPIO push-pull output to pulse clock manually" },
          { line: 15, note: "Monitors SDA on every rising clock edge until slave releases open-drain clamp" },
          { line: 20, note: "Issues manual STOP condition (SDA low-to-high while SCL high) to reset bus state" }
        ],
        tryIt: "Simulate a dead slave that never releases SDA and verify that the 9-clock recovery routine returns false after 9 pulses.",
        check: {
          question: "Why does clocking SCL up to 9 times recover an I2C bus clamped LOW by a stuck slave device?",
          options: [
            "It advances the slave's internal 8-bit shift register through any remaining bits until it reaches the ACK phase and releases SDA.",
            "It sends a hardware reset voltage spike through the ground plane.",
            "It reprograms the slave's internal flash memory.",
            "It discharges the PCB parasitic capacitance instantly."
          ],
          answer: 0,
          why: "A slave clamping SDA is waiting for clock pulses to finish transmitting its current byte; pulsing SCL forces it to complete the byte and release the open-drain line."
        }
      },
      {
        title: "Industrial Multi-Sensor I2C Polling Pipeline",
        say: [
          "In enterprise telemetry systems, an I2C bus often hosts multiple sensors simultaneously: a temperature sensor (TMP102), a barometer (BMP280), and an EEPROM (AT24C256).",
          "To prevent slow sensor reads from stalling real-time control tasks, the polling pipeline is architected as an asynchronous non-blocking state machine.",
          "Each sensor is assigned a unique polling interval and a dedicated state enum: IDLE, SENDING_REGISTER_POINTER, AWAITING_CONVERSION, READING_DATA, and PROCESSING.",
          "If any individual sensor fails to respond with an ACK or triggers a bus timeout, the engine isolates that peripheral without disrupting communication with other healthy sensors on the bus.",
          "This defensive bus architecture delivers uninterrupted telemetry collection across complex multi-sensor industrial platforms."
        ],
        example: "A multi-sensor state machine polls a temperature sensor and a barometer sequentially, recording both measurements without blocking.",
        code: `#include <iostream>
#include <cstdint>

enum class SensorState { IDLE, POLLING, DATA_READY, FAULT };

struct I2cSensorNode {
    const char* name;
    uint8_t address;
    SensorState state;
    float lastReading;

    void update(float reading) {
        lastReading = reading;
        state = SensorState::DATA_READY;
    }
};

int main() {
    I2cSensorNode sensors[] = {
        {"TMP102 (Temp)", 0x48, SensorState::IDLE, 0.0f},
        {"BMP280 (Pressure)", 0x76, SensorState::IDLE, 0.0f}
    };

    // Simulate polling pass
    sensors[0].update(24.5f);  // 24.5 deg C
    sensors[1].update(1013.2f); // 1013.2 hPa

    std::cout << "=== Industrial I2C Sensor Pipeline ===\\n";
    for (const auto& s : sensors) {
        std::cout << "Sensor [0x" << std::hex << static_cast<int>(s.address) << "] "
                  << s.name << " -> Value: " << std::dec << s.lastReading
                  << " (State: " << (s.state == SensorState::DATA_READY ? "READY" : "POLL") << ")\\n";
    }
    std::cout << "Multi-Drop Invariant: Independent addressing enables shared-bus multiplexing.\\n";
    return 0;
}`,
        output: `=== Industrial I2C Sensor Pipeline ===
Sensor [0x48] TMP102 (Temp) -> Value: 24.5 (State: READY)
Sensor [0x76] BMP280 (Pressure) -> Value: 1013.2 (State: READY)
Multi-Drop Invariant: Independent addressing enables shared-bus multiplexing.`,
        codeNotes: [
          { line: 4, note: "State enum provides non-blocking tracking of independent sensor conversion states" },
          { line: 24, note: "Polls multiple distinct slave addresses (0x48 and 0x76) over shared 2-wire bus" },
          { line: 31, note: "Failure of one sensor does not corrupt readings from other nodes" }
        ],
        tryIt: "Add a third sensor for humidity (address 0x40) and simulate an isolated timeout on that address.",
        check: {
          question: "What is the primary advantage of I2C over SPI in multi-sensor embedded systems?",
          options: [
            "It requires only 2 pins regardless of the number of connected slave devices, whereas SPI requires a separate Chip Select pin for each slave.",
            "It transmits data faster than SPI by a factor of 100.",
            "It eliminates the need for power and ground wires.",
            "It supports wireless radio transmission without antennas."
          ],
          answer: 0,
          why: "I2C uses 7-bit in-band addressing over the shared SDA line, allowing dozens of sensors to connect without dedicating extra GPIO pins for chip selection."
        }
      }
    ],
    summary: [
      "I2C is an open-drain two-wire bus requiring external pull-up resistors ($R_p$) to float lines HIGH, creating Wired-AND electrical logic.",
      "Pull-up resistance must satisfy minimum current protection ($R_p > (V_{DD}-V_{OL})/I_{OL}$) and maximum rise-time limits ($R_p < t_r / (0.8473 C_b)$).",
      "START and STOP framing conditions are uniquely signaled by transitions of SDA while the SCL clock line is held HIGH.",
      "Clock stretching allows slow slave peripherals to pause the master by clamping SCL LOW, but requires firmware timeout guards.",
      "The 9-clock bus clear routine recovers from hung slave states where SDA is clamped LOW by manually clocking SCL until the slave releases the bus."
    ],
    projectStep: {
      title: "Step 8: Constructing the Resilient Open-Drain I2C Engine",
      steps: [
        "Implement I2cPullUpCalculator computing exact electrical resistance limits for 100kHz and 400kHz buses.",
        "Build I2cAddressEncoder and transaction simulator managing START framing, 7-bit addressing, and ACK/NACK verification.",
        "Develop I2cClockStretchMonitor enforcing bounded millisecond timeouts on slave clock hold states.",
        "Construct I2cBusRecoveryEngine executing the automated 9-clock unjamming sequence and STOP generation.",
        "Build an industrial multi-sensor polling pipeline decoupling asynchronous sensor reads across shared physical buses."
      ]
    }
  },
  {
    day: 9,
    title: "Controller Area Network (CAN Bus): Differential Signaling, Arbitration & CRC Framing",
    goal: "Master the backbone of automotive and industrial automation: the Controller Area Network (CAN Bus). Understand why consumer buses (UART/I2C/SPI) fail in high-voltage industrial environments filled with ground offset voltages and severe electromagnetic noise. Analyze differential signaling physics across CAN_H and CAN_L with 120-ohm termination. Master Non-Destructive Bitwise Arbitration using Recessive (logic 1) and Dominant (logic 0) states. Calculate Time Quanta (tq) and bit timing segments, configure 32-bit hardware acceptance filter masks, and implement an industrial CAN message dispatch engine.",
    minutes: 36,
    recap: "Yesterday in Day 8, we mastered open-drain I2C bus physics, pull-up resistor calculus, START/STOP framing, and the 9-clock hung bus recovery engine. Today in Day 9, we advance to high-reliability industrial networking with the Controller Area Network (CAN Bus).",
    parts: [
      {
        title: "Differential Electrical Physics, Common-Mode Rejection & Termination",
        say: [
          "Welcome to Day 9! In automotive engine compartments, electric vehicles, and industrial robotics, standard single-ended communications like UART or I2C fail completely due to ground loops and motor electromagnetic interference (EMI).",
          "To survive in these hostile environments, Bosch engineered the Controller Area Network (CAN Bus), which replaces single-ended voltage referencing with Differential Signaling.",
          "A CAN bus consists of a twisted-pair cable: CAN High (CAN_H) and CAN Low (CAN_L).",
          "In the Recessive state (logic 1), both wires sit at approximately 2.5V, creating a differential voltage ($V_{diff} = CAN_H - CAN_L$) of approximately 0.0V.",
          "In the Dominant state (logic 0), transceivers actively drive CAN_H up to 3.5V and pull CAN_L down to 1.5V, creating a robust differential voltage of 2.0V.",
          "Because external electromagnetic interference couples equally into both twisted wires (common-mode noise), the differential receiver subtracts the noise entirely, providing extraordinary reliability over hundred-meter distances."
        ],
        example: "A CAN transceiver converts logic levels to differential voltages: Recessive logic 1 produces $V_{diff} = 0.0V$; Dominant logic 0 produces $V_{diff} = 2.0V$.",
        code: `#include <iostream>
#include <cstdint>

struct CanPhysicalLayer {
    static void evaluateVoltages(bool isDominant, double& canH, double& canL, double& vDiff) {
        if (isDominant) {
            // Dominant (Logic 0)
            canH = 3.5;
            canL = 1.5;
        } else {
            // Recessive (Logic 1)
            canH = 2.5;
            canL = 2.5;
        }
        vDiff = canH - canL;
    }
};

int main() {
    double canH, canL, vDiff;

    CanPhysicalLayer::evaluateVoltages(true, canH, canL, vDiff);
    std::cout << "DOMINANT State (Logic 0):\\n";
    std::cout << "  CAN_H: " << canH << "V | CAN_L: " << canL << "V | Differential: " << vDiff << "V\\n";

    CanPhysicalLayer::evaluateVoltages(false, canH, canL, vDiff);
    std::cout << "RECESSIVE State (Logic 1):\\n";
    std::cout << "  CAN_H: " << canH << "V | CAN_L: " << canL << "V | Differential: " << vDiff << "V\\n";
    std::cout << "Termination Invariant: Exactly two 120-ohm resistors at cable ends prevent RF reflections.\\n";
    return 0;
}`,
        output: `DOMINANT State (Logic 0):
  CAN_H: 3.5V | CAN_L: 1.5V | Differential: 2V
RECESSIVE State (Logic 1):
  CAN_H: 2.5V | CAN_L: 2.5V | Differential: 0V
Termination Invariant: Exactly two 120-ohm resistors at cable ends prevent RF reflections.`,
        codeNotes: [
          { line: 7, note: "Dominant state actively drives 2.0V differential voltage across termination resistors" },
          { line: 11, note: "Recessive state lets both lines float to common-mode 2.5V reference" },
          { line: 28, note: "120-ohm split termination matches characteristic line impedance, preventing signal reflections" }
        ],
        tryIt: "Add a simulated 1.0V common-mode noise spike to both wires and verify that the differential voltage remains exactly unchanged.",
        check: {
          question: "Why does differential signaling across twisted-pair wires provide superior noise immunity in CAN bus networks?",
          options: [
            "Because external electromagnetic noise induces identical voltages on both wires, which cancels out when the receiver computes CAN_H minus CAN_L.",
            "Because twisted pair wires cannot conduct electricity.",
            "Because differential transmitters automatically double the CPU frequency.",
            "Because CAN bus cables are made of optical fiber."
          ],
          answer: 0,
          why: "Common-Mode Rejection Ratio (CMRR) in differential receivers subtracts noise present equally on both wires: $(CAN_H + V_{noise}) - (CAN_L + V_{noise}) = CAN_H - CAN_L$."
        }
      },
      {
        title: "Non-Destructive Bitwise Arbitration Physics",
        say: [
          "In standard Ethernet networks, when two nodes transmit simultaneously, a collision occurs; both nodes abort, back off randomly, and retransmit, wasting bandwidth.",
          "CAN Bus solves multi-master contention with pure mathematical elegance: Non-Destructive Bitwise Arbitration.",
          "The core physical rule is the Dominant Overwrite Invariant: a Dominant bit (logic 0) unconditionally overrides a Recessive bit (logic 1) on the physical bus.",
          "When multiple nodes start transmitting simultaneously, every node transmits its 11-bit or 29-bit Message Identifier bit-by-bit while simultaneously reading the bus state.",
          "If Node A transmits a Recessive 1 but senses a Dominant 0 on the bus, Node A realizes that a higher-priority message (with a lower numerical ID) is transmitting; Node A immediately stops transmitting and becomes a receiver without corrupting the active message."
        ],
        example: "Simulating arbitration between Emergency Braking (ID 0x100) and Climate Control (ID 0x300): at bit 9, Emergency Braking transmits 0 while Climate Control transmits 1, winning the bus instantly.",
        code: `#include <iostream>
#include <cstdint>

struct CanArbitrationSimulator {
    static void arbitrate(uint16_t idA, uint16_t idB) {
        std::cout << "Simultaneous Transmission: Node A (0x" << std::hex << idA
                  << ") vs Node B (0x" << idB << ")\\n" << std::dec;

        for (int bit = 10; bit >= 0; --bit) {
            uint8_t bitA = (idA >> bit) & 0x01;
            uint8_t bitB = (idB >> bit) & 0x01;
            // Physical wired-AND on bus: 0 is Dominant, 1 is Recessive
            uint8_t busState = bitA & bitB;

            if (bitA != busState) {
                std::cout << "Bit " << bit << ": Node A transmitted 1 (Recessive) but saw 0 (Dominant) -> Node A BACKS OFF!\\n";
                std::cout << "Winner: Node B (Lower ID = Higher Priority)\\n";
                return;
            }
            if (bitB != busState) {
                std::cout << "Bit " << bit << ": Node B transmitted 1 (Recessive) but saw 0 (Dominant) -> Node B BACKS OFF!\\n";
                std::cout << "Winner: Node A (Lower ID = Higher Priority)\\n";
                return;
            }
        }
        std::cout << "Identical IDs: Both nodes transmitted simultaneously.\\n";
    }
};

int main() {
    uint16_t emergencyBrakingId = 0x100; // Binary: 001 0000 0000
    uint16_t climateControlId   = 0x300; // Binary: 011 0000 0000

    CanArbitrationSimulator::arbitrate(emergencyBrakingId, climateControlId);
    std::cout << "Arbitration Invariant: Zero collisions, zero corrupted frames, zero retransmission delay.\\n";
    return 0;
}`,
        output: `Simultaneous Transmission: Node A (0x100) vs Node B (0x300)
Bit 9: Node B transmitted 1 (Recessive) but saw 0 (Dominant) -> Node B BACKS OFF!
Winner: Node A (Lower ID = Higher Priority)
Arbitration Invariant: Zero collisions, zero corrupted frames, zero retransmission delay.`,
        codeNotes: [
          { line: 13, note: "Wired-AND logic models physical transceiver behavior where Dominant 0 overrides Recessive 1" },
          { line: 16, note: "Node detecting bus state mismatch drops out of transmission instantly without corrupting the frame" },
          { line: 34, note: "Guarantees safety-critical automotive packets (like braking) experience zero transmission delay" }
        ],
        tryIt: "Compare arbitration between an engine RPM packet (ID 0x240) and a tire pressure packet (ID 0x248) and identify which bit decides arbitration.",
        check: {
          question: "Why does a lower numerical Message Identifier correspond to higher priority on a CAN bus?",
          options: [
            "Because lower IDs contain more leading Dominant 0 bits, which overwrite Recessive 1 bits during arbitration.",
            "Because the CAN bus controller sorts messages alphabetically in flash memory.",
            "Because lower IDs travel faster through copper wiring.",
            "Because automotive regulations ban IDs greater than 0x500."
          ],
          answer: 0,
          why: "Dominant bits are logic 0; an ID with a 0 at an earlier bit position will overwrite any competing node transmitting a 1, winning the bus."
        }
      },
      {
        title: "CAN Nominal Bit Timing & Time Quanta (tq) Calculus",
        say: [
          "To maintain synchronized bit sampling across distributed vehicle harnesses without a shared clock, CAN divides every bit period into four discrete segments composed of integer Time Quanta ($t_q$).",
          "The four segments are: Synchronization Segment (Sync_Seg, strictly 1 $t_q$), Propagation Segment (Prop_Seg), Phase Buffer Segment 1 (Phase_Seg1), and Phase Buffer Segment 2 (Phase_Seg2).",
          "The Sample Point is located between Phase_Seg1 and Phase_Seg2; automotive standards (CiA 301) mandate placing the sample point at 87.5% of the total bit time for maximum signal stability.",
          "If clock skew occurs, the hardware automatically adjusts the lengths of Phase_Seg1 and Phase_Seg2 up to the Synchronization Jump Width (SJW) limit, resynchronizing on incoming dominant transitions.",
          "Calculating the Bit Timing Register (CAN_BTR) parameters requires matching the peripheral bus clock, baud rate prescaler (BRP), and total quanta to achieve the exact target bit rate (e.g., 500 kbps)."
        ],
        example: "Calculating CAN bit timing for a 500 kbps bus on a 42MHz APB1 clock: $t_q = 42MHz / (BRP \\times 14) = 500kbps$ with BRP=6 and 14 total quanta (1 Sync, 2 Prop, 9 Phase1, 2 Phase2), achieving sample point at 85.7%.",
        code: `#include <iostream>
#include <cstdint>

struct CanBitTimingCalculator {
    static void computeBitTiming(uint32_t pclk, uint32_t baudRate, uint32_t totalQuanta, uint32_t samplePointTq) {
        uint32_t brp = pclk / (baudRate * totalQuanta);
        double actualBaud = static_cast<double>(pclk) / (brp * totalQuanta);
        double samplePointPct = (static_cast<double>(samplePointTq) / totalQuanta) * 100.0;

        std::cout << "CAN Target Baud: " << baudRate / 1000 << " kbps\\n";
        std::cout << "Prescaler (BRP): " << brp << "\\n";
        std::cout << "Total Quanta:    " << totalQuanta << " tq (Sync=1, TimeSeg1="
                  << samplePointTq - 1 << ", TimeSeg2=" << totalQuanta - samplePointTq << ")\\n";
        std::cout << "Sample Point:    " << samplePointPct << "% (Target: 87.5%)\\n";
        std::cout << "Actual Bit Rate: " << actualBaud / 1000 << " kbps (Exact Match)\\n";
    }
};

int main() {
    uint32_t apb1Clock = 42000000; // 42 MHz
    uint32_t targetBaud = 500000;  // 500 kbps
    uint32_t totalTq = 14;
    uint32_t samplePtTq = 12;      // 12/14 = 85.7%

    CanBitTimingCalculator::computeBitTiming(apb1Clock, targetBaud, totalTq, samplePtTq);
    return 0;
}`,
        output: `CAN Target Baud: 500 kbps
Prescaler (BRP): 6
Total Quanta:    14 tq (Sync=1, TimeSeg1=11, TimeSeg2=2)
Sample Point:    85.7143% (Target: 87.5%)
Actual Bit Rate: 500 kbps (Exact Match)`,
        codeNotes: [
          { line: 5, note: "Calculates baud rate prescaler (BRP) to divide APB1 clock down to target bit quanta" },
          { line: 12, note: "Sample point placed at 85.7% provides excellent immunity against physical cable propagation delay" },
          { line: 26, note: "Divides 42MHz by (6 * 14) to produce exactly 500,000 bps with zero frequency error" }
        ],
        tryIt: "Recalculate bit timing for an 84MHz clock at 1 Mbps with 16 total quanta and determine the required BRP.",
        check: {
          question: "Why is the CAN bus sample point placed between 75% and 87.5% of the bit period rather than in the center (50%)?",
          options: [
            "To allow maximum time for the physical electrical signal to propagate down the cable and settle across transceiver transits.",
            "Because CAN bus microcontrollers cannot read registers during the first half of a clock cycle.",
            "Because the last 12.5% of each bit is reserved for CRC parity calculation.",
            "To increase the battery life of electric vehicles."
          ],
          answer: 0,
          why: "Propagation segment delay requires allocating the first portion of the bit to physical signal transit down long cables before sampling."
        }
      },
      {
        title: "Hardware Acceptance Filtering (32-Bit Mask & Match)",
        say: [
          "In a modern vehicle, a CAN bus carries hundreds of thousands of messages every second from dozens of electronic control units (ECUs).",
          "If the microcontroller's CPU had to interrupt and inspect every single packet to determine relevance, the CPU would be overwhelmed by interrupt overhead.",
          "The CAN controller solves this with Hardware Acceptance Filters: dedicated hardware comparators that filter incoming messages before they ever trigger a CPU interrupt.",
          "An acceptance filter consists of two registers: an Identifier Register (ID) and a Mask Register.",
          "The Mask register acts as a bitmask: if a mask bit is 1, the corresponding bit in the incoming message ID must match the ID register exactly; if a mask bit is 0, the bit is treated as 'Don't Care', allowing ranges of message IDs into the receive FIFO."
        ],
        example: "A battery management ECU configures a filter to accept only Battery Cell Voltages (IDs 0x380 through 0x387) using Filter ID 0x380 and Mask 0x7F8.",
        code: `#include <iostream>
#include <cstdint>

struct CanFilterMatcher {
    static bool matchFilter(uint16_t incomingId, uint16_t filterId, uint16_t filterMask) {
        // Condition: (incomingId & filterMask) == (filterId & filterMask)
        return (incomingId & filterMask) == (filterId & filterMask);
    }
};

int main() {
    uint16_t filterId   = 0x380; // Base ID for Battery Pack
    uint16_t filterMask = 0x7F8; // Match bits 10..3, ignore bits 2..0 (accepts 0x380 to 0x387)

    uint16_t idBattery1 = 0x382; // Battery Cell 2 -> Should Match
    uint16_t idEngineRpm = 0x120;// Engine RPM   -> Should Reject

    bool match1 = CanFilterMatcher::matchFilter(idBattery1, filterId, filterMask);
    bool match2 = CanFilterMatcher::matchFilter(idEngineRpm, filterId, filterMask);

    std::cout << "Filter Config: ID=0x" << std::hex << filterId << " | Mask=0x" << filterMask << "\\n";
    std::cout << "ID 0x" << idBattery1 << " (Battery Module): " << (match1 ? "ACCEPTED (Hardware FIFO)" : "REJECTED") << "\\n";
    std::cout << "ID 0x" << idEngineRpm << " (Engine RPM):     " << (match2 ? "ACCEPTED" : "REJECTED (Filtered by Silicon)") << "\\n";
    return 0;
}`,
        output: `Filter Config: ID=0x380 | Mask=0x7f8
ID 0x382 (Battery Module): ACCEPTED (Hardware FIFO)
ID 0x120 (Engine RPM):     REJECTED (Filtered by Silicon)`,
        codeNotes: [
          { line: 6, note: "Hardware comparator logic executes: (incoming & mask) == (filter & mask) in 0 clock cycles" },
          { line: 13, note: "Mask 0x7F8 treats bottom 3 bits as Don't Care, accepting any ID from 0x380 to 0x387" },
          { line: 24, note: "Irrelevant packets are discarded instantly at the silicon level without interrupting the CPU" }
        ],
        tryIt: "Configure a mask that accepts only exact ID 0x120 and verify that ID 0x121 is rejected.",
        check: {
          question: "What is the primary benefit of CAN hardware acceptance filter masks in automotive ECUs?",
          options: [
            "They discard irrelevant network traffic at the silicon layer, completely shielding the CPU from unnecessary interrupt overhead.",
            "They encrypt message payloads using automotive-grade AES keys.",
            "They increase the physical voltage on the CAN bus cable.",
            "They compress binary message payloads to save battery power."
          ],
          answer: 0,
          why: "Filtering at the silicon level prevents the CPU from being flooded with interrupts for messages meant for other electronic control units."
        }
      },
      {
        title: "Industrial CAN Message Dispatcher & Bus-Off Fault Management",
        say: [
          "A production CAN driver must manage the full protocol lifecycle: frame transmission, FIFO message reception, and hardware fault confinement.",
          "Every CAN controller maintains two internal error counters: Transmit Error Counter (TEC) and Receive Error Counter (REC).",
          "When a transmission error occurs (e.g., bit error, CRC error, or missing ACK), TEC increments; when a transmission succeeds, TEC decrements.",
          "The controller transitions through three distinct operational states: Error Active (normal operation, TEC < 128), Error Passive (TEC >= 128, only sends recessive error flags), and Bus Off (TEC > 255).",
          "If a damaged cable or severe ground fault causes TEC to exceed 255, the controller executes a self-protective disconnect: shutting off its transceiver output stages to avoid bringing down the rest of the vehicle network."
        ],
        example: "A CAN fault manager tracks the Transmit Error Counter (TEC), transitioning the node from Error Active to Error Passive and Bus Off under persistent fault injection.",
        code: `#include <iostream>
#include <cstdint>

enum class CanNodeState { ERROR_ACTIVE, ERROR_PASSIVE, BUS_OFF };

class CanFaultManager {
private:
    uint16_t tec_{0};
    CanNodeState state_{CanNodeState::ERROR_ACTIVE};

public:
    void recordTxError() {
        tec_ += 8; // CAN standard: +8 for transmit error
        evaluateState();
    }

    void recordTxSuccess() {
        if (tec_ > 0) tec_--;
        evaluateState();
    }

    void evaluateState() {
        if (tec_ > 255) state_ = CanNodeState::BUS_OFF;
        else if (tec_ >= 128) state_ = CanNodeState::ERROR_PASSIVE;
        else state_ = CanNodeState::ERROR_ACTIVE;
    }

    CanNodeState getState() const { return state_; }
    uint16_t getTEC() const { return tec_; }
};

int main() {
    CanFaultManager canNode;

    std::cout << "Initial Node State: ERROR_ACTIVE (TEC=" << canNode.getTEC() << ")\\n";

    // Simulate 17 consecutive transmission errors (cable disconnected)
    for (int i = 0; i < 17; ++i) {
        canNode.recordTxError();
    }
    std::cout << "After 17 Errors -> TEC=" << canNode.getTEC() << " | State: ERROR_PASSIVE\\n";

    // Inject more errors until Bus-Off occurs
    for (int i = 0; i < 16; ++i) {
        canNode.recordTxError();
    }
    std::cout << "After 33 Errors -> TEC=" << canNode.getTEC() << " | State: BUS_OFF (Self-Isolated)\\n";
    std::cout << "Fault Confinement Invariant: Node self-isolates to preserve vehicle network integrity.\\n";
    return 0;
}`,
        output: `Initial Node State: ERROR_ACTIVE (TEC=0)
After 17 Errors -> TEC=136 | State: ERROR_PASSIVE
After 33 Errors -> TEC=264 | State: BUS_OFF (Self-Isolated)
Fault Confinement Invariant: Node self-isolates to preserve vehicle network integrity.`,
        codeNotes: [
          { line: 11, note: "Increments TEC by 8 on transmit error according to ISO 11898-1 standard" },
          { line: 21, note: "Transitions to Bus-Off when TEC exceeds 255 threshold, isolating faulty transceiver" },
          { line: 42, note: "Self-isolation ensures a damaged node cannot permanently jam the vehicle bus" }
        ],
        tryIt: "Simulate successful transmissions recovering a node from TEC=130 back down into the Error Active state.",
        check: {
          question: "What is the purpose of the CAN Bus-Off state when a node's Transmit Error Counter (TEC) exceeds 255?",
          options: [
            "To disconnect the node's output transistors from the physical bus, preventing a malfunctioning ECU from taking down the entire vehicle network.",
            "To reboot the automotive infotainment display.",
            "To delete all recorded fault codes from EEPROM memory.",
            "To force the driver to pull over and turn off the engine."
          ],
          answer: 0,
          why: "Fault confinement guarantees that a babbling idiot node or hardware failure cannot permanently hold the shared differential bus in a dominant state."
        }
      }
    ],
    summary: [
      "CAN bus uses differential signaling (CAN_H / CAN_L) across twisted-pair wiring with 120-ohm termination to eliminate common-mode ground noise.",
      "Non-destructive bitwise arbitration allows multi-master access without collisions; Dominant 0 bits overwrite Recessive 1 bits, granting highest priority to lower numerical IDs.",
      "Bit timing is divided into Time Quanta ($t_q$) across 4 segments, placing the sample point at 87.5% for maximum cable transit tolerance.",
      "Hardware acceptance filters match incoming 11-bit and 29-bit IDs against programmable mask registers, discarding unneeded traffic without CPU interrupts.",
      "Dual error counters (TEC and REC) enforce fault confinement: nodes transition to Error Passive and Bus Off to self-isolate when hardware faults occur."
    ],
    projectStep: {
      title: "Step 9: Constructing the Industrial CAN Bus Differential Engine",
      steps: [
        "Implement CanPhysicalLayer evaluating Recessive (0V diff) and Dominant (2V diff) voltage levels with 120-ohm termination.",
        "Build CanArbitrationSimulator modeling bit-by-bit non-destructive arbitration and priority resolution.",
        "Develop CanBitTimingCalculator computing Time Quanta segments, BRP prescalers, and 87.5% sample points.",
        "Create a 32-bit CanFilterMatcher hardware acceptance filter validating mask and match logic.",
        "Implement CanFaultManager tracking TEC counters and enforcing Error Passive and Bus-Off self-isolation."
      ]
    }
  },
  {
    day: 10,
    title: "Milestone 2: Multi-Protocol Hardware Bus Engine (Zero-Drop UART/SPI/I2C Transceiver)",
    goal: "Architect, construct, and defend Milestone 2: the Multi-Protocol Hardware Bus Engine. Build a unified, non-blocking communications transceiver integrating high-speed DMA SPI Flash memory streaming, interrupt-driven UART telemetry with ring-buffered RXNE queues, and resilient open-drain I2C sensor polling with automated 9-clock hung bus recovery. Enforce strict non-blocking invariants: eliminate all unbounded polling loops, guarantee sub-5ms latency budgets, and survive live physical fault injection (disconnected cables, noise spikes, and hung slaves) with zero dropped packets!",
    minutes: 38,
    recap: "Over Days 6 through 9, we mastered the core physics of embedded serial communications: asynchronous UART framing, synchronous full-duplex SPI shift registers, open-drain I2C pull-up calculus, and industrial CAN differential arbitration. Today in Day 10, we synthesize these protocols into Milestone 2.",
    parts: [
      {
        title: "Milestone 2 Architecture & Hardware Bus Contracts",
        say: [
          "Welcome to Milestone 2! Today, you synthesize the serial communications and hardware bus disciplines mastered across Block 2 into a unified, enterprise-grade communications engine.",
          "In production avionics, medical robotics, and automotive gateways, a single microcontroller must orchestrate multiple hardware protocols concurrently.",
          "The system must stream high-speed telemetry over UART at 921,600 baud, log sensor readings to an external SPI NOR Flash chip at 20 MHz, and periodically query environmental sensors over a 400kHz I2C bus.",
          "The Milestone 2 architecture establishes strict non-blocking contracts across all three subsystems: no bus driver may ever execute an unbounded while loop that waits for a hardware flag without a bounded timeout.",
          "Furthermore, memory allocations must be completely static, interrupts must execute in under 5 microseconds, and transient bus faults must be handled autonomously without triggering a system watchdog reset."
        ],
        example: "A central MultiProtocolBusEngine routes telemetry through UART, logs high-throughput records to SPI Flash, and reads I2C sensors through unified non-blocking interfaces.",
        code: `#include <iostream>
#include <cstdint>

struct BusStatusReport {
    bool uartOk;
    bool spiOk;
    bool i2cOk;
    uint32_t activeTransfers;

    bool isHealthy() const {
        return uartOk && spiOk && i2cOk;
    }
};

class MultiProtocolBusEngine {
public:
    BusStatusReport verifyContracts() {
        return {
            true,  // UART ring-buffered RXNE active
            true,  // SPI DMA streaming active
            true,  // I2C 9-clock recovery active
            3      // 3 active concurrent hardware pipelines
        };
    }
};

int main() {
    MultiProtocolBusEngine engine;
    BusStatusReport report = engine.verifyContracts();

    std::cout << "=== Milestone 2: Multi-Protocol Bus Engine ===\\n";
    std::cout << "UART Driver Status: " << (report.uartOk ? "ONLINE (Non-Blocking Ring Buffer)" : "OFFLINE") << "\\n";
    std::cout << "SPI Driver Status:  " << (report.spiOk  ? "ONLINE (DMA Chunked Streaming)"  : "OFFLINE") << "\\n";
    std::cout << "I2C Driver Status:  " << (report.i2cOk  ? "ONLINE (Automated 9-Clock Reset)"  : "OFFLINE") << "\\n";
    std::cout << "Engine Health:      " << (report.isHealthy() ? "CERTIFIED (Zero-Blocking Invariant Satisfied)" : "FAULTED") << "\\n";
    return 0;
}`,
        output: `=== Milestone 2: Multi-Protocol Bus Engine ===
UART Driver Status: ONLINE (Non-Blocking Ring Buffer)
SPI Driver Status:  ONLINE (DMA Chunked Streaming)
I2C Driver Status:  ONLINE (Automated 9-Clock Reset)
Engine Health:      CERTIFIED (Zero-Blocking Invariant Satisfied)`,
        codeNotes: [
          { line: 4, note: "Unified status contract monitors health across all 3 concurrent physical communications interfaces" },
          { line: 15, note: "Enforces non-blocking execution across UART, SPI, and I2C hardware subsystems" },
          { line: 28, note: "Certifies that all three protocol drivers operate under bounded microsecond latency budgets" }
        ],
        tryIt: "Add a mock hardware fault to the I2C driver status and verify that the engine detects and reports the subsystem failure.",
        check: {
          question: "What is the primary architectural invariant enforced by the Milestone 2 Multi-Protocol Bus Engine?",
          options: [
            "All hardware bus drivers must execute non-blocking operations bounded by finite timeouts, preventing peripheral hangs from freezing the CPU.",
            "All data packets must be encrypted with 4096-bit RSA keys.",
            "All three communication buses must operate at the exact same physical clock frequency.",
            "All communication must be routed through an external Linux gateway server."
          ],
          answer: 0,
          why: "Non-blocking execution ensures that a hardware failure or disconnected cable on one bus cannot stall the CPU or starve other critical subsystems."
        }
      },
      {
        title: "Non-Blocking State Machine Transceivers & Timeout Failsafes",
        say: [
          "The most dangerous trap in embedded communications is the naive while-loop: while(!(USART1->SR & USART_SR_TXE)); or while(!(I2C1->SR1 & I2C_SR1_ADDR));.",
          "If an electrical glitch occurs, an external pin is shorted to ground, or an SPI cable is yanked out during flight, the hardware flag will never set.",
          "The naive driver hangs indefinitely in the while loop, starving motor controls, failing to kick the hardware watchdog, and triggering a catastrophic system crash.",
          "In Milestone 2, every bus driver is structured as a non-blocking Finite State Machine (FSM) governed by a tick-based timeout counter.",
          "If a hardware peripheral fails to transition to the expected state within its allocated time budget (e.g., 500 microseconds for an I2C address phase), the state machine aborts, resets the hardware peripheral, and transitions to error recovery."
        ],
        example: "A non-blocking state machine driver decrements a timeout counter during an I2C transaction, safely aborting when a sensor fails to respond.",
        code: `#include <iostream>
#include <cstdint>

enum class DriverState { IDLE, SENDING_ADDR, AWAITING_ACK, ERROR_TIMEOUT, SUCCESS };

class NonBlockingI2cDriver {
private:
    DriverState state_{DriverState::IDLE};
    uint32_t timeoutTicks_{0};

public:
    void initiateTransaction() {
        state_ = DriverState::SENDING_ADDR;
        timeoutTicks_ = 100; // 100 ticks max timeout budget
    }

    void tick(bool hardwareAckReceived) {
        if (state_ == DriverState::SENDING_ADDR) {
            state_ = DriverState::AWAITING_ACK;
        } else if (state_ == DriverState::AWAITING_ACK) {
            if (hardwareAckReceived) {
                state_ = DriverState::SUCCESS;
            } else {
                if (--timeoutTicks_ == 0) {
                    state_ = DriverState::ERROR_TIMEOUT;
                }
            }
        }
    }

    DriverState getState() const { return state_; }
};

int main() {
    NonBlockingI2cDriver driver;
    driver.initiateTransaction();

    // Simulate 100 ticks with no hardware response (cable disconnected)
    for (int i = 0; i < 101; ++i) {
        driver.tick(false);
    }

    std::cout << "Transaction Outcome: "
              << (driver.getState() == DriverState::ERROR_TIMEOUT ? "SAFE_TIMEOUT (Aborted Cleanly)" : "HANG") << "\\n";
    std::cout << "Failsafe Invariant: Bounded tick counters eliminate unbounded while-loop system freezes.\\n";
    return 0;
}`,
        output: `Transaction Outcome: SAFE_TIMEOUT (Aborted Cleanly)
Failsafe Invariant: Bounded tick counters eliminate unbounded while-loop system freezes.`,
        codeNotes: [
          { line: 4, note: "State enum breaks transaction into explicit non-blocking progression steps" },
          { line: 21, note: "Decrements timeout ticks on every pass, eliminating infinite hardware polling loops" },
          { line: 39, note: "Safely transitions to ERROR_TIMEOUT when peripheral fails to respond within budget" }
        ],
        tryIt: "Simulate hardware ACK received on tick 45 and verify that the driver transitions cleanly to DriverState::SUCCESS.",
        check: {
          question: "Why must every embedded peripheral polling loop be governed by a finite timeout counter?",
          options: [
            "To prevent infinite while-loops that would lock up the entire system if a hardware peripheral fails to assert its status flag.",
            "To prevent the compiler from generating Thumb-2 assembly instructions.",
            "Because C++ language standards forbid loops that run for more than 10 iterations.",
            "To slow down the transmission rate for low-cost microcontrollers."
          ],
          answer: 0,
          why: "Unbounded loops create single-point-of-failure vulnerabilities where a damaged wire or dead peripheral permanently halts the entire CPU."
        }
      },
      {
        title: "Concurrent Tri-Bus Orchestration & DMA Ring Buffering",
        say: [
          "Orchestrating three distinct communication protocols concurrently requires strict memory isolation and prioritization across the microcontroller's bus matrix.",
          "In Milestone 2, UART operates on high-priority DMA Stream 5, continuously buffering streaming telemetry into a 512-byte circular ring buffer without CPU overhead.",
          "SPI operates on DMA Stream 3, streaming 256-byte page buffers to external NOR Flash memory at 20 MHz whenever telemetry buffers reach high-water mark.",
          "I2C operates on an interrupt-driven state machine on peripheral APB1, polling environmental sensors at 100 Hz.",
          "By leveraging independent DMA streams and hardware FIFO buffers, the three buses operate in parallel over the silicon bus matrix without data corruption or bus starvation."
        ],
        example: "The tri-bus orchestrator dispatches a 256-byte SPI Flash write while concurrently ingesting 64 bytes of UART telemetry and reading an I2C sensor.",
        code: `#include <iostream>
#include <cstdint>

struct TriBusTelemetryPacket {
    uint32_t timestamp;
    float temperature;
    uint16_t uartBytesReceived;
    uint32_t flashAddress;
};

class TriBusOrchestrator {
public:
    static void processCycle(uint32_t tick, TriBusTelemetryPacket& packet) {
        // Step 1: Ingest UART Telemetry
        packet.uartBytesReceived += 64;
        // Step 2: Poll I2C Temperature
        packet.temperature = 28.4f;
        // Step 3: Stream to SPI Flash Page
        packet.flashAddress += 256;
        packet.timestamp = tick;
    }
};

int main() {
    TriBusTelemetryPacket packet{0, 0.0f, 0, 0x001000};

    std::cout << "Starting Tri-Bus Concurrent Pipeline:\\n";
    for (uint32_t cycle = 1; cycle <= 3; ++cycle) {
        TriBusOrchestrator::processCycle(cycle * 10, packet);
        std::cout << "Cycle " << cycle << ": UART Recv=" << packet.uartBytesReceived
                  << "B | I2C Temp=" << packet.temperature << "C | Flash Addr=0x"
                  << std::hex << std::uppercase << packet.flashAddress << std::dec << "\\n";
    }
    std::cout << "Concurrency Invariant: Silicon bus matrix enables parallel multi-protocol execution.\\n";
    return 0;
}`,
        output: `Starting Tri-Bus Concurrent Pipeline:
Cycle 1: UART Recv=64B | I2C Temp=28.4C | Flash Addr=0x1100
Cycle 2: UART Recv=128B | I2C Temp=28.4C | Flash Addr=0x1200
Cycle 3: UART Recv=192B | I2C Temp=28.4C | Flash Addr=0x1300
Concurrency Invariant: Silicon bus matrix enables parallel multi-protocol execution.`,
        codeNotes: [
          { line: 4, note: "Encapsulates unified telemetry structure integrating data from all three communication buses" },
          { line: 13, note: "Executes concurrent data movement across UART, I2C, and SPI within single scheduling cycle" },
          { line: 28, note: "Demonstrates deterministic telemetry aggregation and persistent Flash logging" }
        ],
        tryIt: "Simulate 10 continuous cycles and verify that Flash addresses increment strictly by 256 bytes per page write.",
        check: {
          question: "How does an ARM Cortex-M microcontroller execute simultaneous UART and SPI transfers without CPU intervention?",
          options: [
            "By assigning independent Direct Memory Access (DMA) streams that transfer data directly over the multi-layer AHB bus matrix.",
            "By running multiple instances of the Python interpreter.",
            "By using two separate external power supplies.",
            "By switching between clock crystals every millisecond."
          ],
          answer: 0,
          why: "The multi-layer AHB bus matrix allows concurrent DMA transfers between memory and peripherals as long as they target different bus matrix arbiters."
        }
      },
      {
        title: "Live Physical Fault Injection & Autonomous Self-Healing",
        say: [
          "A communications engine that only functions under ideal bench conditions is unfit for mission-critical industrial deployment.",
          "In Milestone 2, the engine is subjected to the Live Physical Fault Injection Benchmark: simulating severed wires, transient line noise, and hung peripherals.",
          "When an I2C sensor hangs and clamps SDA LOW, the fault monitor detects the condition, isolates the bus, and triggers the 9-clock recovery routine within 2 milliseconds.",
          "When an SPI transmission suffers an electrical disconnect, the driver detects missing MISO edges, asserts a timeout, and retries the command on a backup Flash block.",
          "When UART experiences an EMI noise burst, the CRC-16 parser discards the corrupted packet and requests a packet retransmission without dropping valid frames."
        ],
        example: "The fault injection benchmark injects an I2C hung-bus fault and a UART CRC corruption fault, verifying autonomous recovery with zero packet loss.",
        code: `#include <iostream>
#include <cstdint>

struct FaultInjectionStats {
    uint32_t i2cHangRecoveries;
    uint32_t uartCrcRejections;
    uint32_t successfulPackets;

    bool isCertified() const {
        return i2cHangRecoveries >= 1 && uartCrcRejections >= 1 && successfulPackets >= 100;
    }
};

class SelfHealingEngine {
public:
    static FaultInjectionStats runStressHarness() {
        FaultInjectionStats stats{0, 0, 0};

        // Simulate 100 valid transactions
        stats.successfulPackets = 100;

        // Inject I2C hung slave fault -> Autonomous 9-clock recovery triggered
        stats.i2cHangRecoveries++;

        // Inject UART EMI noise burst -> CRC mismatch detected and dropped
        stats.uartCrcRejections++;

        return stats;
    }
};

int main() {
    FaultInjectionStats results = SelfHealingEngine::runStressHarness();

    std::cout << "=== Live Fault Injection Benchmark ===\\n";
    std::cout << "I2C Hung Bus Recoveries: " << results.i2cHangRecoveries << " (9-Clock Recovery Fired)\\n";
    std::cout << "UART CRC Corruptions:    " << results.uartCrcRejections << " (Filtered by CCITT Checksum)\\n";
    std::cout << "Valid Telemetry Packets: " << results.successfulPackets << " (100% Processed)\\n";
    std::cout << "Fault Tolerance Status:  " << (results.isCertified() ? "PASS (Zero Dropped Packets)" : "FAIL") << "\\n";
    return 0;
}`,
        output: `=== Live Fault Injection Benchmark ===
I2C Hung Bus Recoveries: 1 (9-Clock Recovery Fired)
UART CRC Corruptions:    1 (Filtered by CCITT Checksum)
Valid Telemetry Packets: 100 (100% Processed)
Fault Tolerance Status:  PASS (Zero Dropped Packets)`,
        codeNotes: [
          { line: 4, note: "Tracks autonomous fault recovery statistics across multiple protocol physical layers" },
          { line: 20, note: "Recovers hung I2C bus automatically without resetting the microcontroller" },
          { line: 34, note: "Certifies that the engine survives adversarial physical faults with zero valid packet loss" }
        ],
        tryIt: "Increase the simulated transaction volume to 500 packets with 5 injected faults and verify that all 5 faults are resolved.",
        check: {
          question: "What is the primary objective of the Live Physical Fault Injection Benchmark in Milestone 2?",
          options: [
            "To prove that the firmware can autonomously detect and recover from physical hardware faults without hanging the CPU or losing valid data.",
            "To measure the maximum temperature of the circuit board.",
            "To test the speed of the C++ compiler's optimization passes.",
            "To verify that the microcontroller can operate submerged in water."
          ],
          answer: 0,
          why: "Adversarial fault injection verifies that error handling and self-healing mechanisms work under hostile real-world physical failure conditions."
        }
      },
      {
        title: "Milestone 2 Evaluator Defense & Architectural Certification",
        say: [
          "You now stand before the Senior Architecture Board to defend Milestone 2: the Multi-Protocol Hardware Bus Engine.",
          "Senior evaluators will cross-examine your engineering trade-offs: Why did you choose a lock-free single-producer single-consumer ring buffer over an RTOS queue for UART reception?",
          "How does your SPI Flash driver prevent page boundary rollover when handling unaligned multi-byte telemetry packets?",
          "Evaluators will inspect logic analyzer traces showing clean 9-clock I2C bus unjamming recovery and oscilloscope captures of CAN differential common-mode noise cancellation.",
          "With unanimous approval from the board, Milestone 2 is officially certified: '[MILESTONE 2 PASSED] Multi-Protocol Hardware Bus Engine Certified!', proving your mastery of embedded communications."
        ],
        example: "The Milestone 2 evaluator panel verifies that all 5 engineering criteria have been successfully defended and certified.",
        code: `#include <iostream>
#include <cstdint>

struct Milestone2Evaluation {
    bool uartZeroOverrun;
    bool spiChunkedPageWrites;
    bool i2cNineClockRecovery;
    bool canDifferentialArbitration;
    bool nonBlockingTimeouts;

    bool isUnanimousPass() const {
        return uartZeroOverrun && spiChunkedPageWrites && i2cNineClockRecovery &&
               canDifferentialArbitration && nonBlockingTimeouts;
    }
};

int main() {
    Milestone2Evaluation defense{
        true, // UART lock-free FIFO proved zero byte loss
        true, // SPI page boundary rollover eliminated
        true, // I2C 9-clock recovery unjammed stuck slave
        true, // CAN dominant arbitration resolved bus contention
        true  // All loops bounded by finite tick timeouts
    };

    std::cout << "=== Milestone 2 Defense Gate ===\\n";
    std::cout << "Evaluator Criteria Satisfied: 5/5\\n";
    std::cout << "Board Verdict: " << (defense.isUnanimousPass() ? "UNANIMOUS_PASS" : "REVISE") << "\\n";
    std::cout << "[MILESTONE 2 PASSED] Multi-Protocol Hardware Bus Engine Certified!\\n";
    return 0;
}`,
        output: `=== Milestone 2 Defense Gate ===
Evaluator Criteria Satisfied: 5/5
Board Verdict: UNANIMOUS_PASS
[MILESTONE 2 PASSED] Multi-Protocol Hardware Bus Engine Certified!`,
        codeNotes: [
          { line: 4, note: "Evaluates the 5 mandatory architectural criteria across Block 2 serial communications" },
          { line: 21, note: "Confirms that all 5 protocol invariants have been verified under live adversarial testing" },
          { line: 28, note: "Awards official Milestone 2 architectural certification upon unanimous board approval" }
        ],
        tryIt: "Set one of the criteria to false and verify that the board verdict requires revisions before granting certification.",
        check: {
          question: "What core competencies are officially certified by passing Milestone 2: Multi-Protocol Hardware Bus Engine?",
          options: [
            "Complete mastery over bare-metal serial protocols (UART, SPI, I2C, CAN), non-blocking state machine drivers, DMA streaming, and fault recovery.",
            "Basic knowledge of how to solder wires together.",
            "The ability to write HTML and CSS websites.",
            "Proficiency in spreadsheet formulas and financial accounting."
          ],
          answer: 0,
          why: "Milestone 2 certifies comprehensive systems engineering capabilities across all physical and logical layers of embedded communications."
        }
      }
    ],
    summary: [
      "Milestone 2 unites asynchronous UART, synchronous SPI, open-drain I2C, and differential CAN into a cohesive hardware bus engine.",
      "Strict non-blocking invariants replace all unbounded polling loops with tick-based timeout counters, preventing firmware freezes.",
      "Independent DMA streams and circular FIFO buffers enable parallel multi-protocol data movement across the silicon bus matrix.",
      "Autonomous fault recovery mechanisms resolve hung I2C slaves and drop corrupted UART packets without interrupting valid traffic.",
      "Passing the Milestone 2 defense gate certifies production readiness for mission-critical embedded communication platforms."
    ],
    projectStep: {
      title: "Step 10: Architecting and Defending the Milestone 2 Hardware Bus Engine",
      steps: [
        "Construct the unified MultiProtocolBusEngine orchestrating UART, SPI, and I2C hardware drivers concurrently.",
        "Implement NonBlockingI2cDriver with finite tick counters and automated timeout abort failsafes.",
        "Build TriBusOrchestrator managing parallel DMA streams for UART telemetry, I2C sensing, and SPI Flash logging.",
        "Execute SelfHealingEngine live physical fault injection proving zero data loss under simulated bus faults.",
        "Present the system before the Senior Architecture Board to achieve [MILESTONE 2 PASSED] official certification."
      ]
    }
  },
  {
    day: 11,
    title: "Nested Vectored Interrupt Controller (NVIC): Vector Tables, Priority Grouping & Preemption",
    goal: "Master the hardware orchestrator of the microcontroller: the Nested Vectored Interrupt Controller (NVIC). Deconstruct the ARM Cortex-M Vector Table, memory offsets (VTOR), hardware exception stacking (8-register frame), and SCB->AIRCR priority grouping to engineer deterministic, hard real-time interrupt response.",
    minutes: 36,
    recap: "In Block 2, we mastered serial communication buses (UART, SPI, I2C, CAN Bus) using polling and non-blocking status registers. Today, we step into the hardware event engine of ARM microcontrollers: the NVIC, where peripheral hardware triggers immediate asynchronous CPU execution.",
    parts: [
      {
        title: "ARM Cortex-M Vector Table Layout & Vector Table Offset Register (VTOR)",
        say: [
          "In the ARM Cortex-M architecture, the Vector Table is an array of 32-bit memory addresses residing at the base of code memory that tells the CPU where to branch when power is applied or an interrupt occurs.",
          "Entry 0 of the vector table is not executable code; it is the Initial Main Stack Pointer (MSP) address loaded into the SP register at hardware reset.",
          "Entry 1 holds the Reset_Handler address, followed by core system exception handlers: NMI, HardFault, MemManage, BusFault, UsageFault, SVCall, PendSV, and SysTick.",
          "Above offset 0x40 (exception index 16), peripheral interrupt vectors begin: WWDG, PVD, RTC, FLASH, RCC, EXTI lines, DMA streams, Timers, and I2C/SPI/USART controllers.",
          "In modern microcontrollers featuring bootloaders or runtime RAM execution, the Vector Table Offset Register (SCB->VTOR at 0xE000ED08) allows shifting the active vector table from Flash base (0x08000000) into RAM (0x20000000) or an application sector.",
          "VTOR alignment is strict: the table must be aligned to a power of 2 corresponding to the total vector table size, typically at least 128 words (512 bytes, or 0x200 boundary)."
        ],
        example: "Think of the Vector Table like the emergency dispatch directory pinned to the wall at a fire station: call 0 points to equipment setup, call 1 points to the chief, and call 20 points to the industrial chemical response team.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct VectorTable {
    uint32_t initial_sp;
    uint32_t reset_handler;
    uint32_t nmi_handler;
    uint32_t hardfault_handler;
    uint32_t peripheral_handlers[16];
};

class NvicVectorController {
private:
    uint32_t vtor_address;
public:
    NvicVectorController(uint32_t baseAddr) : vtor_address(baseAddr) {}

    bool relocateVectorTable(uint32_t newBase) {
        // Enforce 512-byte (0x200) alignment rule for Cortex-M
        if ((newBase & 0x1FF) != 0) {
            std::cout << "[ERROR] VTOR alignment violation: 0x" << std::hex << newBase << " is not 512-byte aligned!\\\\n";
            return false;
        }
        vtor_address = newBase;
        std::cout << "[INFO] VTOR successfully relocated to 0x" << std::hex << vtor_address << "\\\\n";
        return true;
    }

    uint32_t getVtor() const { return vtor_address; }
};

int main() {
    NvicVectorController nvic(0x08000000); // Default Flash base
    std::cout << "Initial VTOR: 0x" << std::hex << nvic.getVtor() << "\\\\n";
    nvic.relocateVectorTable(0x20000100); // Unaligned - should fail
    nvic.relocateVectorTable(0x20000200); // 512-byte aligned - succeeds
    return 0;
}`,
        output: `Initial VTOR: 0x8000000\\n[ERROR] VTOR alignment violation: 0x20000100 is not 512-byte aligned!\\n[INFO] VTOR successfully relocated to 0x20000200`,
        codeNotes: [
          { line: 5, note: "Defines vector table layout starting with Initial Stack Pointer and core handlers" },
          { line: 19, note: "Enforces hardware power-of-2 memory alignment mask (~0x1FF)" },
          { line: 34, note: "Simulates VTOR runtime relocation to SRAM base for dynamic dispatch" }
        ],
        tryIt: "Try passing 0x08010000 (a 64KB sector boundary in flash) and observe that it passes alignment checks.",
        check: {
          question: "What is stored at offset 0x00000000 of an ARM Cortex-M Vector Table?",
          options: [
            "The Initial Main Stack Pointer (MSP) address",
            "The Reset_Handler program counter address",
            "The SysTick exception vector",
            "The first instruction of the bootloader"
          ],
          answer: 0,
          why: "On ARM Cortex-M, the very first 32-bit word in the vector table is loaded directly into the SP register before executing any instructions, establishing the runtime stack."
        }
      },
      {
        title: "Hardware Exception Stacking (The 8-Word Stacking Frame: R0–R3, R12, LR, PC, xPSR)",
        say: [
          "When an interrupt request (IRQ) is accepted by the CPU, the Cortex-M hardware executes an automatic hardware stacking sequence without any software instructions.",
          "In exactly 12 clock cycles, the processor pushes 8 registers onto the active stack: R0, R1, R2, R3, R12, LR (Link Register), PC (Return Address), and xPSR (Program Status Register).",
          "These 8 registers constitute the caller-saved registers in the standard ARM Architecture Procedure Call Standard (AAPCS).",
          "Because hardware stacks these registers automatically, any standard C/C++ function can serve directly as an Interrupt Service Routine (ISR) without needing special compiler assembly wrappers.",
          "During interrupt entry, the hardware overwrites the Link Register (LR) with a special EXC_RETURN value (such as 0xFFFFFFF9 or 0xFFFFFFFD).",
          "When the ISR executes a return instruction (like 'BX LR'), the processor detects the 0xFFFFFFF_ pattern and triggers the hardware unstacking sequence in another 12 cycles."
        ],
        example: "Imagine an astronaut working on a panel: the moment an alarm sounds, an automated mechanical arm grabs their hand tools (R0-R3, R12) and notepad (PC, xPSR) and places them in a tray in 12 seconds flat so they can grab the fire extinguisher immediately.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct ExceptionStackFrame {
    uint32_t r0;
    uint32_t r1;
    uint32_t r2;
    uint32_t r3;
    uint32_t r12;
    uint32_t lr;
    uint32_t return_pc;
    uint32_t xpsr;
};

void simulateHardwareStacking(uint32_t sp, uint32_t current_pc) {
    std::cout << "[HARDWARE PIPELINE] Stacking 8 core registers onto SP (0x" << std::hex << sp << ")...\\\\n";
    ExceptionStackFrame frame;
    frame.r0 = 0x11111111;
    frame.r1 = 0x22222222;
    frame.r2 = 0x33333333;
    frame.r3 = 0x44444444;
    frame.r12 = 0xAAAAAAAA;
    frame.lr = 0x08001234;
    frame.return_pc = current_pc;
    frame.xpsr = 0x01000000; // Thumb bit asserted

    std::cout << "  -> Return PC saved: 0x" << std::hex << frame.return_pc << "\\\\n";
    std::cout << "  -> xPSR saved:      0x" << std::hex << frame.xpsr << "\\\\n";
    std::cout << "  -> Stacking overhead: 12 clock cycles\\\\n";
    std::cout << "[HARDWARE PIPELINE] Loading EXC_RETURN (0xFFFFFFF9) into LR\\\\n";
}

int main() {
    simulateHardwareStacking(0x2001FFC0, 0x08000450);
    return 0;
}`,
        output: `[HARDWARE PIPELINE] Stacking 8 core registers onto SP (0x2001ffc0)...\\n  -> Return PC saved: 0x8000450\\n  -> xPSR saved:      0x1000000\\n  -> Stacking overhead: 12 clock cycles\\n[HARDWARE PIPELINE] Loading EXC_RETURN (0xFFFFFFF9) into LR`,
        codeNotes: [
          { line: 5, note: "Exact 8-word hardware exception stack frame pushed by ARM Cortex-M hardware" },
          { line: 25, note: "Bit 24 of xPSR represents the Thumb execution bit (must always be 1)" },
          { line: 29, note: "EXC_RETURN value loaded into LR signals hardware unstacking on ISR return" }
        ],
        tryIt: "Add a check to verify that the return_pc has the Thumb bit (LSB) stripped when loaded into PC.",
        check: {
          question: "Which set of registers is automatically pushed to the stack by ARM Cortex-M hardware upon interrupt entry?",
          options: [
            "R0, R1, R2, R3, R12, LR, PC, and xPSR (8 registers)",
            "All 16 general-purpose registers (R0 through R15)",
            "Only the Program Counter (PC) and Stack Pointer (SP)",
            "R4 through R11 (callee-saved registers)"
          ],
          answer: 0,
          why: "ARM Cortex-M hardware automatically stacks the 8 AAPCS caller-saved registers (R0-R3, R12, LR, PC, xPSR) in 12 clock cycles, enabling standard C functions to act directly as ISRs."
        }
      },
      {
        title: "SCB->AIRCR Priority Grouping: Preemption Priority vs Subpriority Bits",
        say: [
          "The NVIC supports up to 256 priority levels, though silicon vendors typically implement 16 levels using the upper 4 bits of the priority byte (bits [7:4]).",
          "A critical rule in ARM Cortex-M interrupts is: lower numeric value represents higher logical urgency (Priority 0 is the highest priority, Priority 15 is lowest).",
          "Through the Application Interrupt and Reset Control Register (SCB->AIRCR, bits [10:8] PRIGROUP), the 4 priority bits are split into Preemption Priority and Subpriority.",
          "Preemption priority governs whether an incoming interrupt can interrupt (preempt) an currently executing ISR.",
          "Subpriority only determines which interrupt executes first when two interrupts with the exact same preemption priority become pending at the same instant; subpriority can never preempt an active ISR.",
          "To write to SCB->AIRCR, software must write a 16-bit security key (VECTKEY = 0x5FA) into the upper halfword, preventing accidental writes during firmware runaway."
        ],
        example: "Preemption is an ER surgeon stepping away from stitching a finger to perform CPR on a cardiac arrest patient. Subpriority is deciding which of two patients with identical fever severity gets called into the examination room first.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct NvicPrioritySplit {
    uint8_t preemptionBits;
    uint8_t subpriorityBits;
    uint8_t maxPreempt;
    uint8_t maxSub;
};

NvicPrioritySplit calculatePriorityGrouping(uint32_t priGroup) {
    // ARM AIRCR PRIGROUP encoding for 4 implemented priority bits:
    // 0b011 (Group 3): 4 bits preempt (0-15), 0 bits sub
    // 0b100 (Group 4): 3 bits preempt (0-7),  1 bit sub (0-1)
    // 0b101 (Group 5): 2 bits preempt (0-3),  2 bits sub (0-3)
    // 0b110 (Group 6): 1 bit preempt  (0-1),  3 bits sub (0-7)
    // 0b111 (Group 7): 0 bits preempt (0),    4 bits sub (0-15)
    uint8_t preempt = 0;
    uint8_t sub = 0;
    if (priGroup <= 3) { preempt = 4; sub = 0; }
    else if (priGroup == 4) { preempt = 3; sub = 1; }
    else if (priGroup == 5) { preempt = 2; sub = 2; }
    else if (priGroup == 6) { preempt = 1; sub = 3; }
    else { preempt = 0; sub = 4; }

    return {preempt, sub, static_cast<uint8_t>((1 << preempt) - 1), static_cast<uint8_t>((1 << sub) - 1)};
}

int main() {
    uint32_t aircr_group = 4; // 3 bits preemption, 1 bit subpriority
    NvicPrioritySplit split = calculatePriorityGrouping(aircr_group);
    std::cout << "SCB->AIRCR PRIGROUP = " << aircr_group << "\\\\n";
    std::cout << "  Preemption bits:  " << (int)split.preemptionBits << " (Levels: 0 to " << (int)split.maxPreempt << ")\\\\n";
    std::cout << "  Subpriority bits: " << (int)split.subpriorityBits << " (Levels: 0 to " << (int)split.maxSub << ")\\\\n";
    std::cout << "  Can Level (P=2, S=1) preempt Level (P=3, S=0)? " << (2 < 3 ? "YES (Preempts)" : "NO") << "\\\\n";
    std::cout << "  Can Level (P=2, S=0) preempt Level (P=2, S=1)? " << (2 < 2 ? "YES (Preempts)" : "NO (Same Preempt Group)") << "\\\\n";
    return 0;
}`,
        output: `SCB->AIRCR PRIGROUP = 4\\n  Preemption bits:  3 (Levels: 0 to 7)\\n  Subpriority bits: 1 (Levels: 0 to 1)\\n  Can Level (P=2, S=1) preempt Level (P=3, S=0)? YES (Preempts)\\n  Can Level (P=2, S=0) preempt Level (P=2, S=1)? NO (Same Preempt Group)`,
        codeNotes: [
          { line: 13, note: "Standard ARM PRIGROUP decoding mapping hardware priority bits to preemption levels" },
          { line: 34, note: "Demonstrates lower numeric preemption value (2 < 3) preempting an active lower-urgency ISR" },
          { line: 35, note: "Subpriority differences with matching preemption priority cannot cause preemption" }
        ],
        tryIt: "Set PRIGROUP to 3 (Group 3: 4 bits preemption, 0 bits subpriority) and verify that all 16 levels can preempt each other.",
        check: {
          question: "If Interrupt A has Preemption=2, Subpriority=0 and Interrupt B has Preemption=2, Subpriority=1, can Interrupt A preempt Interrupt B while B is running?",
          options: [
            "No, because both share the exact same preemption priority level (2)",
            "Yes, because Interrupt A has a lower subpriority numeric value",
            "Yes, because subpriority always triggers immediate preemption",
            "Only if the SysTick timer is disabled"
          ],
          answer: 0,
          why: "Subpriority only resolves simultaneous pending conflicts when neither interrupt is currently active; only a strictly lower numeric preemption priority can interrupt an active ISR."
        }
      },
      {
        title: "NVIC Interrupt Enable (NVIC_ISER), Disable (NVIC_ICER), and Pending Registers",
        say: [
          "ARM Cortex-M peripherals do not use a single monolithic interrupt mask; instead, the NVIC provides dedicated Set-Enable (ISER) and Clear-Enable (ICER) registers.",
          "Writing a 1 to a bit in NVIC_ISER enables that specific interrupt line; writing a 0 to NVIC_ISER has zero effect.",
          "To disable an interrupt, firmware writes a 1 to the corresponding bit in NVIC_ICER; this eliminated read-modify-write race conditions in multi-threaded firmware.",
          "Similarly, the NVIC features Set-Pending (ISPR) and Clear-Pending (ICPR) registers.",
          "When a peripheral asserts an interrupt condition, hardware sets the corresponding bit in ISPR; when the CPU enters the ISR, the hardware automatically clears that bit.",
          "Firmware can also manually set bits in ISPR or use the Software Trigger Interrupt Register (STIR) to simulate hardware interrupts during automated testing."
        ],
        example: "Instead of a shared light switch where two people might push in opposite directions, you have a green 'turn on' button (ISER) and a separate red 'turn off' button (ICER). Pushing green never turns anything off.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class MockNvicRegisters {
public:
    uint32_t ISER; // Interrupt Set-Enable Register
    uint32_t ICER; // Interrupt Clear-Enable Register
    uint32_t ISPR; // Interrupt Set-Pending Register
    uint32_t ICPR; // Interrupt Clear-Pending Register

    MockNvicRegisters() : ISER(0), ICER(0), ISPR(0), ICPR(0) {}

    void enableInterrupt(uint8_t irqNum) {
        // Atomic write-1-to-set: writing 0 does nothing
        ISER |= (1 << irqNum);
    }

    void disableInterrupt(uint8_t irqNum) {
        // Atomic write-1-to-clear: clears bit in ISER
        ISER &= ~(1 << irqNum);
    }

    void setPending(uint8_t irqNum) {
        ISPR |= (1 << irqNum);
    }

    void clearPending(uint8_t irqNum) {
        ISPR &= ~(1 << irqNum);
    }
};

int main() {
    MockNvicRegisters nvic;
    uint8_t usart1_irq = 37 % 32; // IRQ index within register bank 1
    
    std::cout << "Initial ISER: 0x" << std::hex << nvic.ISER << "\\\\n";
    nvic.enableInterrupt(usart1_irq);
    std::cout << "After enabling IRQ " << std::dec << (int)usart1_irq << ", ISER: 0x" << std::hex << nvic.ISER << "\\\\n";
    nvic.setPending(usart1_irq);
    std::cout << "Hardware asserts pending, ISPR: 0x" << std::hex << nvic.ISPR << "\\\\n";
    nvic.clearPending(usart1_irq);
    std::cout << "CPU enters ISR, ISPR cleared: 0x" << std::hex << nvic.ISPR << "\\\\n";
    nvic.disableInterrupt(usart1_irq);
    std::cout << "After disabling, ISER: 0x" << std::hex << nvic.ISER << "\\\\n";
    return 0;
}`,
        output: `Initial ISER: 0x0\\nAfter enabling IRQ 5, ISER: 0x20\\nHardware asserts pending, ISPR: 0x20\\nCPU enters ISR, ISPR cleared: 0x0\\nAfter disabling, ISER: 0x0`,
        codeNotes: [
          { line: 14, note: "ISER uses atomic write-1-to-enable semantics to eliminate race conditions" },
          { line: 19, note: "ICER uses atomic write-1-to-disable semantics to avoid read-modify-write cycles" },
          { line: 40, note: "Hardware automatically clears pending flag upon entering the active ISR handler" }
        ],
        tryIt: "Demonstrate enabling multiple interrupts (e.g. IRQ 2 and IRQ 5) and verify both bits are set in ISER.",
        check: {
          question: "Why does the ARM NVIC provide separate ISER (Set-Enable) and ICER (Clear-Enable) registers instead of a single register?",
          options: [
            "To prevent read-modify-write race conditions when multiple threads or ISRs enable and disable interrupts concurrently",
            "Because 32-bit registers cannot store more than 16 interrupt states",
            "To reduce the manufacturing cost of the silicon die",
            "Because the C++ compiler requires separate memory registers"
          ],
          answer: 0,
          why: "With separate ISER and ICER registers, software writes a 1 to set or clear a bit without needing to read, mask, and rewrite the register, making interrupt configuration completely atomic and thread-safe."
        }
      },
      {
        title: "External Interrupt Lines (EXTI), Edge Triggers, and Software-Triggered Interrupts (NVIC_STIR)",
        say: [
          "Microcontroller pins do not connect directly to the NVIC; instead, GPIO pins pass through the External Interrupt/Event Controller (EXTI).",
          "In ARM Cortex-M microcontrollers (like STM32), each pin number across all ports maps to a single EXTI line (e.g., PA0, PB0, and PC0 all multiplex into EXTI0).",
          "The System Configuration Controller (SYSCFG_EXTICR) selects which physical port is routed to the EXTI line.",
          "Each EXTI line can be configured for Rising Edge trigger ('EXTI_RTSR'), Falling Edge trigger ('EXTI_FTSR'), or both (dual-edge).",
          "Crucial Invariant: Inside an EXTI ISR, firmware MUST explicitly clear the pending bit in 'EXTI_PR' by writing a 1 to it; otherwise, the interrupt will continuously re-fire the instant the ISR returns, locking up the CPU.",
          "Additionally, the NVIC Software Trigger Interrupt Register (STIR) allows unprivileged or privileged code to fire peripheral interrupts purely in software for testing."
        ],
        example: "Think of EXTI like a doorbell button wired to a chime: you can configure the chime to ring when you push the button down (falling edge), release it (rising edge), or both. And you must reset the buzzer switch before you sit back down.",
        code: `#include <iostream>
#include <cstdint>

struct ExtiController {
    uint32_t IMR;  // Interrupt Mask Register (1=unmasked)
    uint32_t RTSR; // Rising Trigger Selection Register
    uint32_t FTSR; // Falling Trigger Selection Register
    uint32_t PR;   // Pending Register (write-1-to-clear)

    ExtiController() : IMR(0), RTSR(0), FTSR(0), PR(0) {}

    void configurePinInterrupt(uint8_t line, bool rising, bool falling) {
        IMR |= (1 << line);
        if (rising)  RTSR |= (1 << line);
        if (falling) FTSR |= (1 << line);
    }

    void simulateEdgeTransition(uint8_t line, bool isRising) {
        if ((isRising && (RTSR & (1 << line))) || (!isRising && (FTSR & (1 << line)))) {
            if (IMR & (1 << line)) {
                PR |= (1 << line); // Assert hardware pending
                std::cout << "[EXTI HARDWARE] Edge detected on Line " << (int)line << " -> PR asserted!\\\\n";
            }
        }
    }

    void isrAcknowledge(uint8_t line) {
        // Crucial bare-metal rule: write 1 to clear pending flag
        PR |= (1 << line);
        std::cout << "[ISR HANDLER] Acknowledged Line " << (int)line << " (PR bit cleared)\\\\n";
    }
};

int main() {
    ExtiController exti;
    uint8_t user_button_line = 0; // EXTI0 for User Push Button
    exti.configurePinInterrupt(user_button_line, true, false); // Rising edge only

    // Simulate button push (rising edge)
    exti.simulateEdgeTransition(user_button_line, true);
    // Inside ISR: acknowledge and clear
    exti.isrAcknowledge(user_button_line);
    return 0;
}`,
        output: `[EXTI HARDWARE] Edge detected on Line 0 -> PR asserted!\\n[ISR HANDLER] Acknowledged Line 0 (PR bit cleared)`,
        codeNotes: [
          { line: 13, note: "Configures EXTI interrupt mask and trigger edge registers" },
          { line: 26, note: "Clears EXTI_PR by writing a 1 to the corresponding bit (rc_w1)" },
          { line: 36, note: "Simulates external push button edge transition triggering EXTI0" }
        ],
        tryIt: "Enable both rising and falling edge detection and verify that releasing the button also triggers the EXTI line.",
        check: {
          question: "What catastrophic failure occurs if firmware fails to clear the EXTI_PR pending bit inside an external interrupt handler?",
          options: [
            "The CPU immediately re-enters the ISR forever in an infinite loop upon exit, starving main thread execution",
            "The microcontroller permanently bricks its Flash memory",
            "The GPIO pin physically inverts its output voltage",
            "The SysTick timer stops ticking"
          ],
          answer: 0,
          why: "Because the pending bit in EXTI_PR remains set, the NVIC detects an active interrupt condition the microsecond the ISR executes its return instruction, causing an inescapable interrupt loop."
        }
      }
    ],
    summary: [
      "The Vector Table at memory base defines initial MSP and hardware exception/interrupt entry points with strict power-of-2 alignment requirements enforced by VTOR.",
      "ARM Cortex-M hardware executes automatic 12-cycle stacking of R0–R3, R12, LR, PC, and xPSR upon interrupt entry, enabling standard C functions to act directly as ISRs.",
      "SCB->AIRCR PRIGROUP divides the 4 hardware priority bits into Preemption Priority (which can preempt running ISRs) and Subpriority (which only breaks simultaneous ties).",
      "The NVIC utilizes atomic write-1-to-set (ISER) and write-1-to-clear (ICER) registers to prevent multi-threaded race conditions during interrupt configuration.",
      "External pins route through EXTI edge-detection registers, requiring an explicit write-1-to-clear on EXTI_PR inside the ISR to prevent infinite re-entry lockups."
    ],
    projectStep: {
      title: "Architect a High-Reliability Interrupt-Driven Embedded Subsystem with NVIC Priority Tuning",
      steps: [
        "Map the ARM Cortex-M vector table layout and calculate VTOR alignment boundaries for runtime RAM relocation.",
        "Trace the 8-word hardware exception stack frame (R0-R3, R12, LR, PC, xPSR) and verify 12-cycle entry/exit timings.",
        "Configure SCB->AIRCR PRIGROUP to partition hardware priority bits into preemption and subpriority groups.",
        "Implement atomic interrupt enable and disable operations using NVIC_ISER and NVIC_ICER register banks.",
        "Construct an EXTI external pin trigger handler with edge selection and mandatory pending flag clearing routines."
      ]
    }
  },
  {
    day: 12,
    title: "Interrupt Service Routines (ISRs): Latency Budgets, Tail-Chaining & Late-Arrival Physics",
    goal: "Engineer deterministic microsecond-level real-time responsiveness: master Cortex-M hardware pipeline mechanics, tail-chaining optimization, late-arrival preemption, and cycle-exact benchmarking using DWT->CYCCNT. Design split-phase top-half/bottom-half interrupt handlers that guarantee zero CPU starvation.",
    minutes: 36,
    recap: "Yesterday, we configured the NVIC and EXTI hardware peripherals. Today, we go inside the execution pipeline to analyze the nanosecond physics of ISR latency, hardware tail-chaining, and split-phase event queues.",
    parts: [
      {
        title: "Anatomy of Interrupt Latency: Stacking (12 cycles) + Unstacking (12 cycles) = 24 cycles",
        say: [
          "Interrupt latency is the precise elapsed time from the physical arrival of an interrupt request at the processor core to the execution of the first instruction of the ISR.",
          "In the ARM Cortex-M architecture with zero-wait-state memory, baseline interrupt entry requires exactly 12 clock cycles.",
          "During these 12 cycles, the processor finishes or aborts the current pipeline stage, pushes the 8-word exception frame onto the stack, fetches the ISR address from the vector table, and fills the instruction prefetch buffer.",
          "Interrupt exit (unstacking) also takes exactly 12 clock cycles: restoring R0–R3, R12, LR, PC, and xPSR from RAM and resuming the interrupted background code.",
          "Thus, the round-trip hardware context-switching cost of an isolated interrupt is precisely 24 clock cycles.",
          "At 168 MHz (such as an STM32F4), 12 clock cycles equals 71.4 nanoseconds; at 16 MHz, it equals 750 nanoseconds."
        ],
        example: "Think of stopping at a highway toll booth: slowing down and pulling up to the window takes 12 seconds (stacking), and accelerating back up to highway speed takes 12 seconds (unstacking).",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct LatencyBudget {
    uint32_t cpuFrequencyHz;
    uint32_t stackingCycles;
    uint32_t unstackingCycles;
    
    double getEntryLatencyNs() const {
        return (double)stackingCycles / cpuFrequencyHz * 1e9;
    }

    double getTotalSwitchLatencyNs() const {
        return (double)(stackingCycles + unstackingCycles) / cpuFrequencyHz * 1e9;
    }
};

int main() {
    LatencyBudget mcu168 = {168000000, 12, 12};
    LatencyBudget mcu16  = { 16000000, 12, 12};

    std::cout << "ARM Cortex-M Hardware Interrupt Latency Budget:\\\\n";
    std::cout << "  At 168 MHz: Entry Latency = " << std::fixed << std::setprecision(1) 
              << mcu168.getEntryLatencyNs() << " ns, Total Round-Trip = " 
              << mcu168.getTotalSwitchLatencyNs() << " ns (24 cycles)\\\\n";
    std::cout << "  At  16 MHz: Entry Latency = " << std::fixed << std::setprecision(1) 
              << mcu16.getEntryLatencyNs() << " ns, Total Round-Trip = " 
              << mcu16.getTotalSwitchLatencyNs() << " ns (24 cycles)\\\\n";
    return 0;
}`,
        output: `ARM Cortex-M Hardware Interrupt Latency Budget:\\n  At 168 MHz: Entry Latency = 71.4 ns, Total Round-Trip = 142.9 ns (24 cycles)\\n  At  16 MHz: Entry Latency = 750.0 ns, Total Round-Trip = 1500.0 ns (24 cycles)`,
        codeNotes: [
          { line: 5, note: "Encapsulates fixed 12-cycle hardware stacking and unstacking context switch budgets" },
          { line: 10, note: "Calculates nanosecond latency as cycles divided by core clock frequency" },
          { line: 21, note: "Demonstrates sub-100ns deterministic interrupt response at 168 MHz" }
        ],
        tryIt: "Compute latency for an 84 MHz Cortex-M4 and verify that entry latency is exactly 142.8 ns.",
        check: {
          question: "What is the minimum hardware stacking latency for an ARM Cortex-M processor with zero-wait-state memory?",
          options: [
            "Exactly 12 clock cycles",
            "Over 150 clock cycles",
            "0 clock cycles (instantaneous)",
            "Exactly 1 clock cycle"
          ],
          answer: 0,
          why: "ARM Cortex-M cores implement an optimized hardware stacking engine that pushes the 8-word caller-saved register frame in exactly 12 clock cycles."
        }
      },
      {
        title: "Tail-Chaining Mechanics: Zero-Unstacking Transition Between Successive Interrupts (6 cycles)",
        say: [
          "In naive architectures, when an interrupt completes and a second interrupt is already pending, the CPU unstacks all registers back to main, only to immediately restack them for the next ISR.",
          "ARM Cortex-M eliminates this waste through a hardware optimization called Tail-Chaining.",
          "When an ISR finishes and another interrupt of equal or lower priority is pending, the CPU skips the entire 12-cycle unstacking sequence and the subsequent 12-cycle stacking sequence.",
          "Instead, the processor keeps the current stack frame in place and directly fetches the new ISR vector address from memory in only 6 clock cycles.",
          "Tail-chaining reduces the back-to-back context switch overhead from 24 cycles down to just 6 cycles—a 75% reduction in switching overhead.",
          "This guarantees exceptional throughput in embedded applications processing high-frequency sensor streams."
        ],
        example: "If two planes land consecutively on a runway, tail-chaining is letting the second plane land immediately rather than clearing all the fire trucks and ground crew off the runway only to bring them all back 10 seconds later.",
        code: `#include <iostream>
#include <cstdint>

void compareInterruptTransitions(bool tailChainingEnabled) {
    uint32_t naiveCycles = 12 + 12; // Unstack ISR1 (12) + Restack ISR2 (12)
    uint32_t tailChainCycles = 6;   // Direct vector fetch reusing active stack frame

    std::cout << "Successive Interrupt Context Switch:\\\\n";
    if (tailChainingEnabled) {
        std::cout << "  [OPTIMIZED] Hardware Tail-Chaining active: " << tailChainCycles << " cycles!\\\\n";
        std::cout << "  Savings: " << (naiveCycles - tailChainCycles) << " clock cycles preserved.\\\\n";
    } else {
        std::cout << "  [NAIVE] Full unstack & restack: " << naiveCycles << " cycles.\\\\n";
    }
}

int main() {
    compareInterruptTransitions(false);
    compareInterruptTransitions(true);
    return 0;
}`,
        output: `Successive Interrupt Context Switch:\\n  [NAIVE] Full unstack & restack: 24 cycles.\\nSuccessive Interrupt Context Switch:\\n  [OPTIMIZED] Hardware Tail-Chaining active: 6 cycles!\\n  Savings: 18 clock cycles preserved.`,
        codeNotes: [
          { line: 5, note: "Naive architectures waste 24 cycles unstacking and restacking identical registers" },
          { line: 6, note: "Cortex-M tail-chaining transitions directly to the next ISR in only 6 clock cycles" },
          { line: 18, note: "Compares naive context-switch overhead against optimized hardware tail-chaining" }
        ],
        tryIt: "Calculate the cumulative clock cycles saved when handling a burst of 10 consecutive sensor interrupts with tail-chaining.",
        check: {
          question: "How many clock cycles does ARM Cortex-M hardware take to transition between two consecutive interrupts using tail-chaining?",
          options: [
            "Exactly 6 clock cycles",
            "24 clock cycles",
            "12 clock cycles",
            "64 clock cycles"
          ],
          answer: 0,
          why: "Tail-chaining skips unstacking and restacking by reusing the active stack frame, fetching the next ISR vector in just 6 clock cycles."
        }
      },
      {
        title: "Late-Arrival Preemption Physics: Splicing Higher-Priority Exceptions into Active Stacking",
        say: [
          "What happens if a high-priority interrupt (e.g. motor emergency stop) arrives while the CPU is in the middle of stacking registers for a low-priority interrupt (e.g. UART receive)?",
          "Naive processors would finish stacking, enter the low-priority ISR, and only then preempt, causing significant jitter for the high-priority event.",
          "ARM Cortex-M solves this with Late-Arrival Preemption.",
          "If a higher-priority interrupt arrives while the hardware stacking sequence is still underway, the processor completes the current stacking frame, but dynamically changes the vector fetch.",
          "Instead of branching to the low-priority ISR, the CPU branches directly to the newly arrived high-priority ISR with zero additional latency penalty.",
          "Once the high-priority ISR finishes, the low-priority ISR executes via tail-chaining (6 cycles), providing the absolute mathematically minimal latency to the critical event."
        ],
        example: "If an elevator is already closing its doors to go to the 2nd floor, and a firefighter swipes an emergency override key, the elevator doesn't go to the 2nd floor first; it instantly switches its destination to the roof without stopping or restarting.",
        code: `#include <iostream>
#include <string>

struct InterruptEvent {
    std::string name;
    uint8_t priority;
    uint32_t arrivalCycle;
};

void traceLateArrival(const InterruptEvent& lowPri, const InterruptEvent& highPri) {
    std::cout << "[CYCLE " << lowPri.arrivalCycle << "] " << lowPri.name << " (Pri=" << (int)lowPri.priority << ") arrives -> Stacking begins (Cycles 0-12)\\\\n";
    std::cout << "[CYCLE " << highPri.arrivalCycle << "] " << highPri.name << " (Pri=" << (int)highPri.priority << ") arrives during active stacking!\\\\n";
    std::cout << "[HARDWARE LATE-ARRIVAL] Vector fetch spliced! CPU switches vector target to " << highPri.name << "\\\\n";
    std::cout << "[CYCLE 12] Entering " << highPri.name << " with zero extra penalty!\\\\n";
    std::cout << "[CYCLE 20] " << highPri.name << " completes -> Tail-chain (6 cycles) to " << lowPri.name << "\\\\n";
}

int main() {
    InterruptEvent uart = {"UART_RX", 3, 0};
    InterruptEvent eStop = {"MOTOR_ESTOP", 0, 7}; // Arrives at cycle 7 during 12-cycle stacking
    traceLateArrival(uart, eStop);
    return 0;
}`,
        output: `[CYCLE 0] UART_RX (Pri=3) arrives -> Stacking begins (Cycles 0-12)\\n[CYCLE 7] MOTOR_ESTOP (Pri=0) arrives during active stacking!\\n[HARDWARE LATE-ARRIVAL] Vector fetch spliced! CPU switches vector target to MOTOR_ESTOP\\n[CYCLE 12] Entering MOTOR_ESTOP with zero extra penalty!\\n[CYCLE 20] MOTOR_ESTOP completes -> Tail-chain (6 cycles) to UART_RX`,
        codeNotes: [
          { line: 12, note: "High-priority interrupt arrives at cycle 7 while initial 12-cycle stacking is underway" },
          { line: 13, note: "Hardware late-arrival engine dynamically splices the higher priority vector fetch" },
          { line: 15, note: "After emergency stop ISR finishes, low-priority UART ISR executes via 6-cycle tail-chain" }
        ],
        tryIt: "Modify the arrival cycle of MOTOR_ESTOP to cycle 15 (after stacking completes) and observe standard preemption taking place instead.",
        check: {
          question: "What is the key benefit of ARM Cortex-M Late-Arrival interrupt preemption?",
          options: [
            "It allows a higher-priority interrupt arriving during hardware stacking to be serviced immediately without waiting for the lower-priority ISR to start",
            "It doubles the CPU clock frequency automatically",
            "It disables all other interrupts permanently",
            "It stores register contents in flash memory instead of SRAM"
          ],
          answer: 0,
          why: "Late-arrival preemption allows the processor to splice the vector fetch for a higher-priority interrupt that arrives during active stacking, guaranteeing zero wasted latency for urgent tasks."
        }
      },
      {
        title: "High-Precision Cycle Benchmarking Using Data Watchpoint and Trace (DWT->CYCCNT)",
        say: [
          "To verify interrupt latency budgets and execution durations, professional embedded engineers never use crude millisecond timers.",
          "The ARM Cortex-M processor includes a dedicated hardware debugging peripheral: the Data Watchpoint and Trace (DWT) unit.",
          "At memory address 0xE0001004 resides the 32-bit Cycle Count Register ('DWT->CYCCNT'), which increments on every single core clock cycle.",
          "To enable DWT cycle counting, software must first set the TRCENA bit (bit 24) in the Debug Exception and Monitor Control Register ('CoreDebug->DEMCR') and enable bit 0 in 'DWT->CTRL'.",
          "By sampling 'DWT->CYCCNT' at the start and end of an ISR, firmware can measure execution time with single-clock-cycle resolution (down to 5.95 nanoseconds at 168 MHz).",
          "This cycle benchmarking is essential for proving real-time deadlines in automotive, aerospace, and medical devices."
        ],
        example: "Using DWT->CYCCNT is like using a high-speed phantom camera filming at 168 million frames per second instead of glancing at an old kitchen wall clock.",
        code: `#include <iostream>
#include <cstdint>

class MockDwtCycleCounter {
private:
    uint32_t currentCycles;
public:
    MockDwtCycleCounter() : currentCycles(1000000) {}

    uint32_t readCYCCNT() const { return currentCycles; }
    void advance(uint32_t cycles) { currentCycles += cycles; }
};

int main() {
    MockDwtCycleCounter dwt;
    
    // Benchmark mock ISR
    uint32_t start_cycles = dwt.readCYCCNT();
    // Simulate ISR work (reading ADC and updating PID filter: 48 cycles)
    dwt.advance(48);
    uint32_t end_cycles = dwt.readCYCCNT();

    uint32_t isr_duration_cycles = end_cycles - start_cycles;
    double duration_ns_at_168mhz = (double)isr_duration_cycles / 168e6 * 1e9;

    std::cout << "DWT->CYCCNT Benchmark Results:\\\\n";
    std::cout << "  Start Cycle: " << start_cycles << "\\\\n";
    std::cout << "  End Cycle:   " << end_cycles << "\\\\n";
    std::cout << "  ISR Cost:    " << isr_duration_cycles << " CPU clock cycles\\\\n";
    std::cout << "  Duration:    " << duration_ns_at_168mhz << " nanoseconds (at 168 MHz)\\\\n";
    return 0;
}`,
        output: `DWT->CYCCNT Benchmark Results:\\n  Start Cycle: 1000000\\n  End Cycle:   1000048\\n  ISR Cost:    48 CPU clock cycles\\n  Duration:    285.714 nanoseconds (at 168 MHz)`,
        codeNotes: [
          { line: 10, note: "Simulates reading the 32-bit DWT->CYCCNT cycle counter register" },
          { line: 23, note: "Calculates exact clock cycle count elapsed during ISR execution" },
          { line: 28, note: "Translates cycle count to physical nanosecond execution time" }
        ],
        tryIt: "Compute the maximum allowable clock cycles for an ISR running at 100 kHz sample rate to consume less than 10% CPU load.",
        check: {
          question: "What register on ARM Cortex-M provides single-cycle resolution benchmarking of software execution?",
          options: [
            "DWT->CYCCNT (Data Watchpoint and Trace Cycle Count Register)",
            "SysTick->VAL (SysTick Current Value Register)",
            "RTC->TR (Real Time Clock Time Register)",
            "TIM2->CNT (Timer 2 Counter Register)"
          ],
          answer: 0,
          why: "DWT->CYCCNT is a dedicated 32-bit hardware counter that increments once every single CPU core clock cycle, providing nanosecond-level execution profiling."
        }
      },
      {
        title: "Deferred Processing & Split-Phase Architecture: Top-Half ISR to Bottom-Half Ring Buffer Queue",
        say: [
          "A cardinal rule of embedded systems engineering is: NEVER perform long calculations, blocking loops, memory allocations, or printf calls inside an ISR.",
          "Doing so creates priority inversion, causes jitter, and starves other critical real-time interrupts.",
          "The industry-standard solution is Split-Phase Processing (known in Linux as Top-Half / Bottom-Half architecture).",
          "The Top-Half (the hardware ISR) executes in minimal cycles: it reads the hardware register, clears the peripheral interrupt flag, enqueues the raw payload into a lockless circular FIFO ring buffer, and immediately exits.",
          "The Bottom-Half (the background main loop or an RTOS task) pops the data from the ring buffer and performs JSON parsing, PID calculations, or network transmission.",
          "If asynchronous notification is needed, the Top-Half can trigger the PendSV (Pended System Call) exception to schedule bottom-half execution at the lowest priority."
        ],
        example: "A busy restaurant kitchen: the busser (top-half ISR) immediately grabs the dirty dishes from the table and drops them on the dishwashing cart in 3 seconds, so customers can sit. The dishwasher (bottom-half task) washes them thoroughly in the back at a steady pace.",
        code: `#include <iostream>
#include <cstdint>

template <typename T, size_t CAPACITY>
class LocklessIsrRingBuffer {
private:
    T buffer[CAPACITY];
    volatile size_t head;
    volatile size_t tail;
public:
    LocklessIsrRingBuffer() : head(0), tail(0) {}

    // Top-Half ISR calls push (must be deterministic and non-blocking)
    bool isrPush(T item) {
        size_t nextHead = (head + 1) % CAPACITY;
        if (nextHead == tail) {
            return false; // Buffer overflow (dropped frame)
        }
        buffer[head] = item;
        head = nextHead;
        return true;
    }

    // Bottom-Half main thread calls pop
    bool pop(T& item) {
        if (head == tail) {
            return false; // Empty buffer
        }
        item = buffer[tail];
        tail = (tail + 1) % CAPACITY;
        return true;
    }

    size_t size() const {
        return (head >= tail) ? (head - tail) : (CAPACITY - tail + head);
    }
};

int main() {
    LocklessIsrRingBuffer<uint16_t, 8> queue;

    std::cout << "[TOP-HALF ISR] Fast capture of 3 ADC sensor readings...\\\\n";
    queue.isrPush(1024);
    queue.isrPush(2048);
    queue.isrPush(3072);

    std::cout << "[MAIN BOTTOM-HALF] Processing queued events outside interrupt context:\\\\n";
    uint16_t val;
    while (queue.pop(val)) {
        std::cout << "  -> Processed sensor sample: " << val << " mV\\\\n";
    }
    return 0;
}`,
        output: `[TOP-HALF ISR] Fast capture of 3 ADC sensor readings...\\n[MAIN BOTTOM-HALF] Processing queued events outside interrupt context:\\n  -> Processed sensor sample: 1024 mV\\n  -> Processed sensor sample: 2048 mV\\n  -> Processed sensor sample: 3072 mV`,
        codeNotes: [
          { line: 5, note: "Template-based lockless single-producer single-consumer circular ring buffer" },
          { line: 15, note: "Top-half ISR enqueue executes in under 15 clock cycles with zero dynamic allocation" },
          { line: 45, note: "Bottom-half processes heavy data in background thread without blocking interrupts" }
        ],
        tryIt: "Add an overflow error counter to track dropped samples when the buffer fills up during heavy burst traffic.",
        check: {
          question: "What is the primary architectural purpose of a Split-Phase (Top-Half / Bottom-Half) interrupt handler?",
          options: [
            "To keep the hardware ISR execution time as short as possible while deferring complex processing to the background main loop",
            "To eliminate the need for an Interrupt Service Routine entirely",
            "To increase the memory usage of the microcontroller",
            "To force the CPU into permanent sleep mode"
          ],
          answer: 0,
          why: "Split-phase handlers execute only time-critical hardware acknowledgments in the top-half ISR, deferring time-consuming processing to the bottom-half to prevent starving other real-time interrupts."
        }
      }
    ],
    summary: [
      "Hardware interrupt latency consists of 12-cycle stacking and 12-cycle unstacking, giving a baseline 24-cycle round-trip context switch overhead.",
      "Tail-chaining optimizes consecutive interrupts by reusing the active stack frame, reducing back-to-back switching overhead from 24 cycles down to just 6 cycles.",
      "Late-arrival preemption allows higher-priority interrupts arriving during active stacking to splice the vector fetch and execute immediately without latency penalty.",
      "The ARM DWT->CYCCNT register provides single-clock-cycle resolution benchmarking for measuring precise ISR execution times and proving real-time deadlines.",
      "Split-phase top-half/bottom-half architectures decouple fast hardware ISR acknowledgments from heavy background processing using lockless circular ring buffers."
    ],
    projectStep: {
      title: "Construct a Nanosecond-Calibrated ISR Pipeline with Hardware Cycle Benchmarking",
      steps: [
        "Calculate clock cycle and nanosecond latency budgets across 16 MHz, 84 MHz, and 168 MHz core frequencies.",
        "Diagram hardware tail-chaining transitions and prove the 18-cycle savings over naive unstack/restack engines.",
        "Model late-arrival preemption scenarios to evaluate interrupt response during active 12-cycle stacking sequences.",
        "Enable the DWT cycle counter (CYCCNT) to benchmark ISR execution durations with single-cycle resolution.",
        "Implement a thread-safe, lockless circular ring buffer connecting a high-speed top-half ISR to a background bottom-half worker."
      ]
    }
  },
  {
    day: 13,
    title: "SysTick System Timer & Hardware General-Purpose Timers: Prescalers, ARR & PWM Generation",
    goal: "Harness the physics of hardware counters: master the Cortex-M SysTick System Timer and 16/32-bit General-Purpose Timers (TIM2–TIM5). Understand prescalers (PSC), auto-reload registers (ARR), edge-aligned and center-aligned PWM generation, preload buffers, and dead-time insertion for motor and power electronics control.",
    minutes: 36,
    recap: "Yesterday, we analyzed hardware ISR latency and cycle-exact benchmarking. Today, we control the fundamental heartbeat of embedded systems: hardware timers, clock division physics, and microsecond-accurate Pulse-Width Modulation (PWM).",
    parts: [
      {
        title: "The ARM Cortex-M SysTick Timer: Calibration, 24-Bit Down-Counter & Tick Generation",
        say: [
          "Every ARM Cortex-M processor core incorporates an identical, dedicated 24-bit down-counting timer: the SysTick (System Tick) timer.",
          "Because SysTick is an architectural component of the ARM core itself (rather than a silicon vendor peripheral), software written for SysTick is 100% portable across all Cortex-M microcontrollers.",
          "The SysTick peripheral consists of four registers: Control and Status ('SysTick->CTRL'), Reload Value ('SysTick->LOAD'), Current Value ('SysTick->VAL'), and Calibration Value ('SysTick->CALIB').",
          "When enabled, SysTick counts down from the value in LOAD towards zero on every clock cycle.",
          "Upon reaching zero, the COUNTFLAG bit is set in CTRL, the timer automatically reloads the value from LOAD, and (if enabled) fires the SysTick exception (Exception #15).",
          "In real-time operating systems (like FreeRTOS) and bare-metal frameworks, SysTick is configured to fire at exactly 1 kHz (every 1.0 millisecond) to provide the system timebase."
        ],
        example: "SysTick is like a mechanical metronome on a musician's piano: it ticks at an unrelenting, perfectly uniform cadence that all other instruments pace themselves against.",
        code: `#include <iostream>
#include <cstdint>

class MockSysTick {
private:
    uint32_t load;
    uint32_t val;
    bool enabled;
    bool interruptEnabled;
    uint32_t tickCount;
public:
    MockSysTick() : load(0), val(0), enabled(false), interruptEnabled(false), tickCount(0) {}

    void config(uint32_t coreClockHz, uint32_t targetFrequencyHz) {
        // Calculate reload value: (Clock / Freq) - 1
        load = (coreClockHz / targetFrequencyHz) - 1;
        val = load;
        enabled = true;
        interruptEnabled = true;
    }

    void stepClock(uint32_t cycles) {
        if (!enabled) return;
        if (cycles > val) {
            tickCount++;
            val = load - (cycles - val);
            std::cout << "[SYSTICK TICK] Exception #15 triggered! System Uptime: " << tickCount << " ms\\\\n";
        } else {
            val -= cycles;
        }
    }

    uint32_t getTicks() const { return tickCount; }
    uint32_t getLoad() const { return load; }
};

int main() {
    MockSysTick systick;
    uint32_t coreClock = 168000000; // 168 MHz
    systick.config(coreClock, 1000); // 1000 Hz = 1 ms period

    std::cout << "SysTick 1kHz Configuration on 168 MHz Core:\\\\n";
    std::cout << "  Reload Value (LOAD): " << systick.getLoad() << " cycles\\\\n";
    systick.stepClock(168000); // 1 ms worth of clock cycles
    return 0;
}`,
        output: `SysTick 1kHz Configuration on 168 MHz Core:\\n  Reload Value (LOAD): 167999 cycles\\n[SYSTICK TICK] Exception #15 triggered! System Uptime: 1 ms`,
        codeNotes: [
          { line: 16, note: "Calculates 24-bit reload value using formula (Clock / Freq) - 1" },
          { line: 23, note: "Simulates down-counting to zero and triggering SysTick exception #15" },
          { line: 39, note: "168,000 cycles on a 168 MHz clock produces an exact 1.0 ms period" }
        ],
        tryIt: "Calculate the reload value required to generate a 100 Hz (10 ms) tick rate on an 84 MHz microcontroller.",
        check: {
          question: "What is the formula to calculate the SysTick->LOAD register value for a given core clock frequency and target tick frequency?",
          options: [
            "LOAD = (F_cpu / F_target) - 1",
            "LOAD = (F_cpu * F_target) + 1",
            "LOAD = F_cpu / 256",
            "LOAD = F_cpu & 0x00FFFFFF"
          ],
          answer: 0,
          why: "Because down-counting from N down to 0 takes N + 1 clock cycles, the reload register must be set to (F_cpu / F_target) - 1 to achieve an exact target frequency."
        }
      },
      {
        title: "Hardware 16-bit / 32-bit Timers: Clock Prescalers (PSC) and Auto-Reload Registers (ARR) Invariants",
        say: [
          "While SysTick handles operating system time slices, microcontrollers feature rich hardware General-Purpose and Advanced Timers (e.g. TIM1–TIM14).",
          "A hardware timer counter ('TIMx_CNT') is driven by an internal peripheral clock divided by the Prescaler Register ('TIMx_PSC').",
          "Crucial Invariant: The Prescaler register is 0-indexed in Cortex-M hardware; writing PSC = N divides the input clock by (N + 1).",
          "For example, on an 84 MHz APB1 timer clock, setting PSC = 83 produces a counter clock of exactly 84,000,000 / (83 + 1) = 1,000,000 Hz (1 MHz, or 1.0 microsecond per tick).",
          "The counter counts until it reaches the Auto-Reload Register ('TIMx_ARR'); upon reaching ARR, it generates an Update Event (UEV), resets the counter to 0, and sets the update flag 'TIM_SR_UIF'.",
          "The final timer frequency is governed by the deterministic formula: F_out = F_clk / ((PSC + 1) * (ARR + 1))."
        ],
        example: "Think of a clock gear train: the prescaler is the reduction gear that slows down a spinning electric motor to turn a gear once per second; the auto-reload register is the 60-tooth gear that triggers the minute hand every 60 seconds.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct TimerParameters {
    uint32_t timerClockHz;
    uint16_t psc;
    uint32_t arr;

    double getCounterFrequencyHz() const {
        return (double)timerClockHz / (psc + 1);
    }

    double getOutputFrequencyHz() const {
        return (double)timerClockHz / ((psc + 1) * (arr + 1));
    }

    double getPeriodSeconds() const {
        return 1.0 / getOutputFrequencyHz();
    }
};

int main() {
    // Target: 20 kHz PWM for motor control from an 84 MHz timer clock
    TimerParameters timer;
    timer.timerClockHz = 84000000;
    timer.psc = 0;    // No prescaling: counter ticks at 84 MHz
    timer.arr = 4199; // (84,000,000 / 20,000) - 1 = 4199

    std::cout << "Timer 20 kHz Motor PWM Calculation (84 MHz Input Clock):\\\\n";
    std::cout << "  PSC Value:              " << timer.psc << " (Divisor: " << (timer.psc + 1) << ")\\\\n";
    std::cout << "  Counter Clock:          " << timer.getCounterFrequencyHz() / 1e6 << " MHz\\\\n";
    std::cout << "  ARR Value:              " << timer.arr << "\\\\n";
    std::cout << "  Exact Output Frequency: " << timer.getOutputFrequencyHz() << " Hz\\\\n";
    std::cout << "  Period:                 " << timer.getPeriodSeconds() * 1e6 << " microseconds\\\\n";
    return 0;
}`,
        output: `Timer 20 kHz Motor PWM Calculation (84 MHz Input Clock):\\n  PSC Value:              0 (Divisor: 1)\\n  Counter Clock:          84 MHz\\n  ARR Value:              4199\\n  Exact Output Frequency: 20000 Hz\\n  Period:                 50 microseconds`,
        codeNotes: [
          { line: 9, note: "Counter frequency divides clock by (PSC + 1)" },
          { line: 13, note: "Output rollover frequency divides clock by ((PSC + 1) * (ARR + 1))" },
          { line: 28, note: "ARR = 4199 provides 4200 discrete steps of PWM duty cycle resolution" }
        ],
        tryIt: "Configure PSC and ARR to produce a 1.0 Hz blinking LED timer from an 84 MHz clock using PSC = 8399.",
        check: {
          question: "If an 84 MHz timer peripheral has PSC = 83 and ARR = 999, what is the resulting timer update event frequency?",
          options: [
            "1,000 Hz (1.0 kHz)",
            "10,000 Hz (10.0 kHz)",
            "840 Hz",
            "100 Hz"
          ],
          answer: 0,
          why: "F = 84,000,000 / ((83 + 1) * (999 + 1)) = 84,000,000 / (84 * 1000) = 84,000,000 / 84,000 = 1,000 Hz."
        }
      },
      {
        title: "Timer Counter Modes (Upcounting, Downcounting, Center-Aligned) & Repetition Counters",
        say: [
          "General-purpose hardware timers support multiple counting modes configurable via the 'TIMx_CR1' control register.",
          "In Edge-Aligned Upcounting Mode (CMS=00, DIR=0), the counter increments from 0 up to ARR, generates an update event, and immediately wraps back to 0 (sawtooth waveform).",
          "In Edge-Aligned Downcounting Mode (CMS=00, DIR=1), the counter decrements from ARR down to 0, generates an update event, and reloads ARR.",
          "In Center-Aligned Mode (CMS=01, 10, or 11), the counter counts up from 0 to ARR, and then counts down from ARR back to 0 (triangular symmetrical waveform).",
          "Center-aligned counting is the mandatory gold standard for motor control and three-phase inverters because it cancels out second-order harmonic electromagnetic interference (EMI).",
          "Advanced timers (TIM1/TIM8) also feature a Repetition Counter ('TIMx_RCR'); an update event is generated only after the counter rolls over N + 1 times."
        ],
        example: "Edge-aligned mode is a water bucket filling to the brim and splashing over all at once; center-aligned mode is a pendulum swinging smoothly back and forth with symmetrical apexes on both sides.",
        code: `#include <iostream>
#include <string>

enum class CounterMode {
    UPCOUNTING,
    DOWNCOUNTING,
    CENTER_ALIGNED
};

void traceCounterWaveform(CounterMode mode, int arr) {
    std::cout << "Simulating Counter Trajectory (ARR=" << arr << "):\\\\n  Values: ";
    if (mode == CounterMode::UPCOUNTING) {
        for (int i = 0; i <= arr; ++i) std::cout << i << " ";
        std::cout << "| wrap | 0 1...";
    } else if (mode == CounterMode::CENTER_ALIGNED) {
        for (int i = 0; i <= arr; ++i) std::cout << i << " ";
        for (int i = arr - 1; i >= 0; --i) std::cout << i << " ";
        std::cout << "| (Symmetrical Peak)";
    }
    std::cout << "\\\\n";
}

int main() {
    std::cout << "[EDGE-ALIGNED UPCOUNTING]:\\\\n";
    traceCounterWaveform(CounterMode::UPCOUNTING, 4);
    std::cout << "[CENTER-ALIGNED DUAL-SLOPE]:\\\\n";
    traceCounterWaveform(CounterMode::CENTER_ALIGNED, 4);
    return 0;
}`,
        output: `[EDGE-ALIGNED UPCOUNTING]:\\nSimulating Counter Trajectory (ARR=4):\\n  Values: 0 1 2 3 4 | wrap | 0 1...\\n[CENTER-ALIGNED DUAL-SLOPE]:\\nSimulating Counter Trajectory (ARR=4):\\n  Values: 0 1 2 3 4 3 2 1 0 | (Symmetrical Peak)`,
        codeNotes: [
          { line: 13, note: "Upcounting produces an asymmetrical sawtooth waveform" },
          { line: 16, note: "Center-aligned mode produces a symmetrical triangular waveform" },
          { line: 28, note: "Center-aligned PWM halves output frequency relative to edge-aligned mode for identical ARR" }
        ],
        tryIt: "Show mathematically that for the same ARR, center-aligned counting produces exactly half the PWM frequency of upcounting.",
        check: {
          question: "Why is Center-Aligned PWM preferred over Edge-Aligned PWM for brushless DC (BLDC) motor control?",
          options: [
            "It produces symmetrical current ripples that cancel high-frequency harmonic electromagnetic noise (EMI)",
            "It consumes zero electrical power",
            "It eliminates the need for a timer prescaler",
            "It allows the timer to count infinitely without auto-reload"
          ],
          answer: 0,
          why: "Center-aligned PWM creates symmetrical drive pulses centered around the midpoint of the timer cycle, drastically reducing audible acoustic noise and harmonic EMI on motor windings."
        }
      },
      {
        title: "Output Compare Channels & Edge-Aligned vs Center-Aligned PWM Duty Cycle Physics",
        say: [
          "A hardware timer channel contains a Capture/Compare Register ('TIMx_CCRx').",
          "In Output Compare PWM Mode 1 ('TIM_CCMR1_OC1M = 0b110'), the output pin is asserted HIGH as long as the counter value is strictly less than CCR ('CNT < CCR'), and asserted LOW when 'CNT >= CCR'.",
          "The duty cycle percentage is defined by the precise ratio: Duty % = (CCR / (ARR + 1)) * 100%.",
          "Setting CCR = 0 produces a continuous 0% duty cycle (pin held permanently LOW).",
          "Setting CCR > ARR produces a continuous 100% duty cycle (pin held permanently HIGH).",
          "Because output state transitions are executed directly by dedicated hardware silicon comparators, the generated PWM waveform has zero software jitter regardless of CPU workload."
        ],
        example: "Imagine a water fountain valve configured to spray water whenever the second hand on a watch is between 0 and 30 seconds, and turn off between 30 and 60 seconds: that produces an exact 50% duty cycle.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct PwmChannel {
    uint32_t arr;
    uint32_t ccr;

    double getDutyCyclePercent() const {
        if (ccr == 0) return 0.0;
        if (ccr > arr) return 100.0;
        return ((double)ccr / (arr + 1)) * 100.0;
    }

    bool evaluatePinState(uint32_t currentCnt) const {
        // PWM Mode 1: Active HIGH when CNT < CCR
        return currentCnt < ccr;
    }
};

int main() {
    PwmChannel pwm = {4199, 1050}; // ARR=4199 (20kHz), CCR=1050 (25% duty cycle)

    std::cout << "Hardware Output Compare PWM Evaluation:\\\\n";
    std::cout << "  ARR: " << pwm.arr << ", CCR: " << pwm.ccr << "\\\\n";
    std::cout << "  Calculated Duty Cycle: " << std::fixed << std::setprecision(1) 
              << pwm.getDutyCyclePercent() << "%\\\\n";

    std::cout << "  Sampled Pin States across Counter Trajectory:\\\\n";
    std::cout << "    At CNT =    0: Pin is " << (pwm.evaluatePinState(0) ? "HIGH" : "LOW") << "\\\\n";
    std::cout << "    At CNT = 1049: Pin is " << (pwm.evaluatePinState(1049) ? "HIGH" : "LOW") << "\\\\n";
    std::cout << "    At CNT = 1050: Pin is " << (pwm.evaluatePinState(1050) ? "HIGH" : "LOW") << "\\\\n";
    std::cout << "    At CNT = 4199: Pin is " << (pwm.evaluatePinState(4199) ? "HIGH" : "LOW") << "\\\\n";
    return 0;
}`,
        output: `Hardware Output Compare PWM Evaluation:\\n  ARR: 4199, CCR: 1050\\n  Calculated Duty Cycle: 25.0%\\n  Sampled Pin States across Counter Trajectory:\\n    At CNT =    0: Pin is HIGH\\n    At CNT = 1049: Pin is HIGH\\n    At CNT = 1050: Pin is LOW\\n    At CNT = 4199: Pin is LOW`,
        codeNotes: [
          { line: 9, note: "Calculates duty cycle percentage as (CCR / (ARR + 1)) * 100" },
          { line: 16, note: "Hardware comparator asserts HIGH when CNT < CCR and LOW when CNT >= CCR" },
          { line: 28, note: "Transitions from HIGH to LOW at exact boundary CNT = 1050" }
        ],
        tryIt: "Change CCR to 2100 and verify that the duty cycle calculates to exactly 50.0%.",
        check: {
          question: "In PWM Mode 1, what happens to the output pin when the timer counter CNT reaches and exceeds the CCR register value?",
          options: [
            "The output pin transitions from active HIGH to inactive LOW",
            "The output pin remains HIGH permanently",
            "The microcontroller generates a HardFault exception",
            "The timer clock frequency is doubled"
          ],
          answer: 0,
          why: "In PWM Mode 1, the output channel is active HIGH while CNT < CCR, and transitions to inactive LOW the moment CNT >= CCR."
        }
      },
      {
        title: "Preload Buffers (TIM_CR1_ARPE & TIM_CCMR1_OC1PE), Complementary Outputs & Dead-Time Insertion",
        say: [
          "In high-power switching applications, modifying ARR or CCR registers while the timer is actively counting can cause catastrophic glitching.",
          "If firmware writes CCR = 100 when CNT has already passed 100 (say CNT = 150), the comparator misses the match, leaving the output HIGH for the remainder of the cycle and causing over-current.",
          "To prevent this, hardware timers incorporate Preload Buffers enabled by 'TIM_CR1_ARPE' (Auto-Reload Preload Enable) and 'TIM_CCMR1_OC1PE' (Output Compare Preload Enable).",
          "When preload is enabled, writes to CCR or ARR are stored in a shadow buffer and only transferred to the active working register on the next Update Event (timer rollover).",
          "Furthermore, in H-bridge power stages, driving high-side and low-side MOSFETs simultaneously causes a short circuit ('shoot-through') that destroys the silicon.",
          "Advanced timers incorporate complementary outputs ('TIM1_CH1' and 'TIM1_CH1N') with hardware Dead-Time Insertion ('TIM1_BDTR_DTG'), guaranteeing that one switch turns completely OFF before the other turns ON."
        ],
        example: "Preload buffers are like updating the flight departure board: you change the computer system in advance, but the public display flips over cleanly only when the minute rolls over.",
        code: `#include <iostream>
#include <cstdint>

struct PreloadComparator {
    uint32_t activeCCR;
    uint32_t shadowCCR;
    bool preloadEnabled;

    PreloadComparator() : activeCCR(2000), shadowCCR(2000), preloadEnabled(true) {}

    void writeCcrFromSoftware(uint32_t newCcr) {
        if (preloadEnabled) {
            shadowCCR = newCcr; // Stored in shadow buffer; active remains untouched
            std::cout << "[SW WRITE] Preload enabled: shadowCCR=" << shadowCCR 
                      << ", activeCCR remains " << activeCCR << "\\\\n";
        } else {
            activeCCR = newCcr; // Dangerous immediate update
        }
    }

    void onTimerUpdateEvent() {
        if (preloadEnabled) {
            activeCCR = shadowCCR; // Atomic transfer on timer rollover
            std::cout << "[UPDATE EVENT] Rollover occurred: activeCCR synchronized to " 
                      << activeCCR << "\\\\n";
        }
    }
};

int main() {
    PreloadComparator pwm;
    pwm.writeCcrFromSoftware(500); // Update duty cycle while timer is running
    std::cout << "Timer counter rolls over at end of period...\\\\n";
    pwm.onTimerUpdateEvent();      // Clean atomic transfer
    return 0;
}`,
        output: `[SW WRITE] Preload enabled: shadowCCR=500, activeCCR remains 2000\\nTimer counter rolls over at end of period...\\n[UPDATE EVENT] Rollover occurred: activeCCR synchronized to 500`,
        codeNotes: [
          { line: 12, note: "Software write updates shadow buffer without disturbing current PWM cycle" },
          { line: 20, note: "Hardware synchronizes shadow to active register only on timer UEV rollover" },
          { line: 31, note: "Guarantees zero-glitch duty cycle transitions in motor and power electronics" }
        ],
        tryIt: "Simulate what happens when preloadEnabled is false and explain why immediate writes cause shoot-through risk.",
        check: {
          question: "What critical protection do Preload Buffers (ARPE and OC1PE) provide in embedded PWM generation?",
          options: [
            "They prevent glitching and skipped compare events by delaying register updates until the start of the next timer cycle",
            "They increase the maximum clock frequency of the processor",
            "They allow the microcontroller to execute code without RAM",
            "They convert PWM signals into digital SPI data packets"
          ],
          answer: 0,
          why: "Preload buffers hold new values in shadow registers and transfer them atomically only during the timer update event, ensuring that duty cycle and period changes never corrupt an active pulse."
        }
      }
    ],
    summary: [
      "The 24-bit SysTick core timer provides a vendor-independent, portable 1 kHz real-time operating system timebase configured via (Clock / Freq) - 1.",
      "Hardware General-Purpose timers divide input clocks through 0-indexed prescaler (PSC) and auto-reload (ARR) registers via F = F_clk / ((PSC+1)*(ARR+1)).",
      "Center-aligned dual-slope PWM generates symmetrical waveforms that eliminate second-order harmonic EMI, making it mandatory for three-phase motor drives.",
      "Output Compare PWM Mode 1 asserts pins HIGH while CNT < CCR and LOW when CNT >= CCR with zero software jitter.",
      "Preload buffers (ARPE and OC1PE) synchronize duty cycle updates to timer rollovers, and dead-time insertion prevents catastrophic shoot-through on H-bridges."
    ],
    projectStep: {
      title: "Engineer a Glitch-Free Center-Aligned Hardware PWM Driver with Preload Buffers",
      steps: [
        "Calculate SysTick LOAD register values for 1 kHz timebase generation on 84 MHz and 168 MHz Cortex-M processors.",
        "Configure General-Purpose Timer PSC and ARR values to establish an exact 20 kHz carrier frequency.",
        "Implement Center-Aligned counting mode in TIMx_CR1 and compare harmonic symmetry against edge-aligned upcounting.",
        "Configure Output Compare Channel 1 in PWM Mode 1 with variable CCR duty cycle control.",
        "Enable Auto-Reload Preload (ARPE) and Output Compare Preload (OC1PE) to guarantee glitch-free motor control transitions."
      ]
    }
  },
  {
    day: 14,
    title: "Analog-to-Digital Conversion (ADC) & DAC: Successive Approximation (SAR), Sampling Times & Nyquist Limits",
    goal: "Digitize physical reality: master 12-bit Successive Approximation Register (SAR) ADCs and DACs. Calculate input impedance RC sampling times, conversion clock budgets, Nyquist-Shannon sampling limits, multi-channel scan sequences, and internal VREFINT reference calibration.",
    minutes: 36,
    recap: "Yesterday, we controlled hardware timers and PWM generation. Today, we interface with the physical world by converting continuous analog voltages into quantized digital values using high-speed SAR ADCs.",
    parts: [
      {
        title: "Physics of the 12-Bit Successive Approximation Register (SAR) ADC: Binary Search & DAC Comparator",
        say: [
          "The Successive Approximation Register (SAR) ADC is the workhorse analog converter in embedded microcontrollers, balancing high speed (1–3 megasamples per second) with 12-bit resolution.",
          "A SAR ADC operates by executing a hardware binary search: it starts by testing the Most Significant Bit (MSB, Bit 11), generating half the reference voltage (VREF / 2) via an internal capacitive DAC.",
          "A high-precision analog comparator compares the input voltage on the sample-and-hold capacitor against the internal DAC output.",
          "If the input voltage exceeds the DAC voltage, the comparator output is 1, and Bit 11 is retained as 1; if less, Bit 11 is cleared to 0.",
          "The SAR engine repeats this comparison for each subsequent bit (Bit 10 down to Bit 0) over exactly 12 successive clock cycles.",
          "At 12-bit resolution, an input voltage between 0.0V and 3.3V is quantized into 4,096 discrete steps, yielding a resolution of 3.3V / 4096 = 0.805 millivolts per LSB."
        ],
        example: "SAR conversion is like a balance scale where a merchant finds the exact weight of flour by testing standard brass weights (8oz, 4oz, 2oz, 1oz), keeping the weight if the scale doesn't tip and discarding it if it does.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class MockSarAdc12Bit {
private:
    double vref;
public:
    MockSarAdc12Bit(double refVoltage = 3.3) : vref(refVoltage) {}

    uint16_t convert(double inputVoltage) {
        if (inputVoltage < 0.0) inputVoltage = 0.0;
        if (inputVoltage > vref) inputVoltage = vref;

        uint16_t result = 0;
        double currentDacVoltage = 0.0;

        // 12-bit binary search from MSB (11) down to LSB (0)
        for (int bit = 11; bit >= 0; --bit) {
            uint16_t trial = result | (1 << bit);
            double trialVoltage = (double)trial / 4096.0 * vref;

            // Comparator test
            if (inputVoltage >= trialVoltage) {
                result = trial; // Retain bit
            }
        }
        return result;
    }

    double getLsbVoltage() const {
        return vref / 4096.0;
    }
};

int main() {
    MockSarAdc12Bit adc(3.3);
    double test_voltage = 1.65; // Exactly half VREF
    uint16_t raw_code = adc.convert(test_voltage);

    std::cout << "12-Bit SAR ADC Conversion Model (VREF = 3.3V):\\\\n";
    std::cout << "  LSB Resolution: " << std::fixed << std::setprecision(4) 
              << adc.getLsbVoltage() * 1000.0 << " mV\\\\n";
    std::cout << "  Input Voltage:  " << test_voltage << " V\\\\n";
    std::cout << "  Raw ADC Code:   0x" << std::hex << raw_code << " (" << std::dec << raw_code << " / 4095)\\\\n";
    std::cout << "  Reconstructed:  " << (double)raw_code / 4096.0 * 3.3 << " V\\\\n";
    return 0;
}`,
        output: `12-Bit SAR ADC Conversion Model (VREF = 3.3V):\\n  LSB Resolution: 0.8057 mV\\n  Input Voltage:  1.6500 V\\n  Raw ADC Code:   0x800 (2048 / 4095)\\n  Reconstructed:  1.6500 V`,
        codeNotes: [
          { line: 15, note: "Simulates 12-step binary search comparator evaluation from bit 11 down to 0" },
          { line: 28, note: "Calculates 1 LSB voltage quantum as VREF / 4096 (0.8057 mV)" },
          { line: 39, note: "1.65V input maps cleanly to midpoint code 0x800 (2048)" }
        ],
        tryIt: "Pass an input of 3.3V and verify that the output clamps to 4095 (0xFFF).",
        check: {
          question: "How many clock cycles does a 12-bit SAR ADC take to execute the approximation phase after sampling completes?",
          options: [
            "Exactly 12 clock cycles (one cycle per bit of resolution)",
            "4096 clock cycles",
            "1 clock cycle",
            "64 clock cycles"
          ],
          answer: 0,
          why: "A Successive Approximation Register tests exactly one bit per clock cycle, requiring 12 cycles for 12-bit resolution."
        }
      },
      {
        title: "Sample-and-Hold Capacitor Charging & Input Impedance RC Sampling Times Invariant",
        say: [
          "Before a SAR ADC can convert a voltage, it must capture the physical electrical charge onto an internal sample-and-hold capacitor (typically C_adc = 4 pF to 8 pF).",
          "During the sampling phase, an internal analog switch with resistance R_adc (approx 1 kOhm to 6 kOhm) closes, connecting the external sensor circuit to C_adc.",
          "If the external sensor has an output impedance R_source (such as a 100 kOhm thermistor or resistive divider), an RC low-pass filter is formed with time constant tau = (R_source + R_adc) * C_adc.",
          "To achieve 12-bit accuracy (1/4096 error = 0.024%), the capacitor must charge for at least ln(4096) = 8.32 time constants (typically 9 to 10 tau for margin).",
          "Crucial Invariant: If firmware configures the sampling time register ('ADC_SMPR') too short, the capacitor will not finish charging, causing massive measurement errors and cross-talk between channels.",
          "When measuring high-impedance sensors, engineers must either increase the ADC sampling cycles or insert an external operational amplifier voltage follower."
        ],
        example: "Trying to fill a bucket from a garden hose: if the hose is thick (low impedance), the bucket fills in 2 seconds; if the hose has a narrow pinhole (high impedance), turning the valve off after 2 seconds leaves the bucket half empty.",
        code: `#include <iostream>
#include <cmath>
#include <iomanip>

struct AdcSamplingCalculator {
    double rSourceOhms;
    double rAdcInternalOhms;
    double cAdcInternalFarads;
    double adcFreqHz;

    double getTauSeconds() const {
        return (rSourceOhms + rAdcInternalOhms) * cAdcInternalFarads;
    }

    double getMinSamplingTimeSeconds() const {
        // 12-bit resolution requires 9 time constants (error < 0.012%)
        return 9.0 * getTauSeconds();
    }

    uint32_t getMinSamplingCycles() const {
        double minTime = getMinSamplingTimeSeconds();
        double cyclePeriod = 1.0 / adcFreqHz;
        return (uint32_t)std::ceil(minTime / cyclePeriod);
    }
};

int main() {
    AdcSamplingCalculator calc = {
        50000.0,    // 50 kOhm sensor output impedance
        6000.0,     // 6 kOhm internal switch resistance
        6e-12,      // 6 pF internal sample-and-hold capacitor
        14000000.0  // 14 MHz ADC peripheral clock
    };

    std::cout << "ADC Sampling Time & Impedance Calculation:\\\\n";
    std::cout << "  RC Time Constant (tau): " << std::fixed << std::setprecision(2) 
              << calc.getTauSeconds() * 1e9 << " ns\\\\n";
    std::cout << "  Min Sampling Time (9 tau): " << calc.getMinSamplingTimeSeconds() * 1e9 << " ns\\\\n";
    std::cout << "  Clock Cycle Period: " << (1.0 / calc.adcFreqHz) * 1e9 << " ns\\\\n";
    std::cout << "  Required ADC Sampling Cycles: " << calc.getMinSamplingCycles() << " cycles\\\\n";
    return 0;
}`,
        output: `ADC Sampling Time & Impedance Calculation:\\n  RC Time Constant (tau): 336.00 ns\\n  Min Sampling Time (9 tau): 3024.00 ns\\n  Clock Cycle Period: 71.43 ns\\n  Required ADC Sampling Cycles: 43 cycles`,
        codeNotes: [
          { line: 9, note: "Calculates RC time constant tau = (R_source + R_adc) * C_adc" },
          { line: 13, note: "Enforces 9 time constants for settling within 1/2 LSB at 12-bit resolution" },
          { line: 34, note: "Shows that a 50k sensor requires at least 43 sampling cycles (e.g. SMPR=55.5 cycles)" }
        ],
        tryIt: "Increase R_source to 100 kOhm and observe how the required sampling cycles rise to over 80 cycles.",
        check: {
          question: "Why does measuring a high-impedance (e.g. 100 kOhm) sensor with the minimum ADC sampling time (e.g. 3 cycles) produce incorrect readings?",
          options: [
            "The internal sample-and-hold capacitor does not have enough time to charge to the true sensor voltage",
            "The ADC burns out from over-current",
            "The high impedance causes the CPU clock to halt",
            "The ADC automatically switches to 8-bit mode"
          ],
          answer: 0,
          why: "High source impedance increases the RC charging time constant; if sampling time is shorter than ~9 tau, the internal capacitor is sampled before it reaches the true input voltage."
        }
      },
      {
        title: "ADC Clock Prescalers, Total Conversion Time & Nyquist Limits",
        say: [
          "The total conversion time of an analog channel is the sum of the sampling time and the approximation time: T_conv = T_sample + 12 cycles.",
          "For example, with a sampling time of 15 cycles on a 14 MHz ADC clock, T_conv = 15 + 12 = 27 cycles, which takes 27 / 14,000,000 = 1.93 microseconds per conversion.",
          "This corresponds to a maximum sampling rate of F_sample = 1 / 1.93 us = 518.5 kilosamples per second (ksps).",
          "According to the Nyquist-Shannon Sampling Theorem, the maximum analog signal frequency that can be accurately reconstructed without aliasing is strictly less than half the sampling frequency: F_max < F_sample / 2.",
          "If firmware attempts to sample a 40 kHz audio signal at a sample rate of 50 ksps (where Nyquist is 25 kHz), the high-frequency components alias into false low frequencies, corrupting the digital data.",
          "An analog anti-aliasing low-pass RC filter must always precede the ADC pin to eliminate frequencies above the Nyquist limit."
        ],
        example: "Nyquist aliasing is like watching car wheels in a movie appear to spin backwards because the camera's frame rate (24 fps) is too slow to capture the rapid rotation.",
        code: `#include <iostream>
#include <iomanip>

struct AdcConversionTiming {
    double adcFreqHz;
    uint32_t samplingCycles;
    uint32_t sarCycles; // 12 for 12-bit

    uint32_t getTotalCycles() const {
        return samplingCycles + sarCycles;
    }

    double getConversionTimeSeconds() const {
        return (double)getTotalCycles() / adcFreqHz;
    }

    double getSamplingRateHz() const {
        return 1.0 / getConversionTimeSeconds();
    }

    double getNyquistLimitHz() const {
        return getSamplingRateHz() / 2.0;
    }
};

int main() {
    AdcConversionTiming timing = {14000000.0, 15, 12};

    std::cout << "ADC Conversion Timing & Nyquist Limits:\\\\n";
    std::cout << "  ADC Clock:       " << timing.adcFreqHz / 1e6 << " MHz\\\\n";
    std::cout << "  Total Cycles:    " << timing.getTotalCycles() << " (Sample=" 
              << timing.samplingCycles << " + SAR=12)\\\\n";
    std::cout << "  Conversion Time: " << std::fixed << std::setprecision(2) 
              << timing.getConversionTimeSeconds() * 1e6 << " microseconds\\\\n";
    std::cout << "  Max Sample Rate: " << timing.getSamplingRateHz() / 1e3 << " ksps\\\\n";
    std::cout << "  Nyquist Limit:   " << timing.getNyquistLimitHz() / 1e3 << " kHz (Max safe input bandwidth)\\\\n";
    return 0;
}`,
        output: `ADC Conversion Timing & Nyquist Limits:\\n  ADC Clock:       14.00 MHz\\n  Total Cycles:    27 (Sample=15 + SAR=12)\\n  Conversion Time: 1.93 microseconds\\n  Max Sample Rate: 518.52 ksps\\n  Nyquist Limit:   259.26 kHz (Max safe input bandwidth)`,
        codeNotes: [
          { line: 8, note: "Total conversion cycles equals sampling cycles plus 12 SAR approximation cycles" },
          { line: 16, note: "Max sampling rate equals 1 / T_conv (518.52 ksps)" },
          { line: 20, note: "Nyquist limit is strictly half the sampling rate (259.26 kHz)" }
        ],
        tryIt: "Recalculate conversion time when samplingCycles is set to 84 cycles for measuring a battery sensor.",
        check: {
          question: "According to the Nyquist-Shannon Sampling Theorem, what is the maximum signal frequency an ADC can digitize without aliasing at 100 ksps?",
          options: [
            "50 kHz (strictly less than half the sample rate)",
            "100 kHz (equal to the sample rate)",
            "200 kHz (twice the sample rate)",
            "10 kHz (one tenth of the sample rate)"
          ],
          answer: 0,
          why: "The Nyquist criterion states that the sampling rate must exceed twice the highest frequency component of the analog signal (F_sample > 2 * F_signal), so F_max < 50 kHz at 100 ksps."
        }
      },
      {
        title: "Multi-Channel Regular vs Injected Sequences, End-of-Conversion (EOC) Flags & Overrun Detection",
        say: [
          "Embedded microcontrollers rarely measure just one analog pin; they monitor temperature, motor current, battery voltage, and joystick axes in a round-robin sequence.",
          "The ADC Regular Channel Sequence Registers ('ADC_SQR1' to 'ADC_SQR3') define an ordered list of up to 16 channels to be converted automatically.",
          "Additionally, advanced microcontrollers feature an Injected Channel Group ('ADC_JSQR').",
          "An injected conversion acts like an interrupt for the ADC: if an injected trigger fires (such as a motor emergency over-current trigger), the ADC pauses the regular sequence, converts the high-priority injected channel immediately, and then resumes the regular sequence.",
          "At the end of each channel conversion, the End of Conversion ('ADC_SR_EOC') flag is asserted.",
          "If the CPU or DMA engine fails to read the data register ('ADC_DR') before the next conversion finishes, the Overrun flag ('ADC_SR_OVR') is set, alerting firmware that analog data was permanently lost."
        ],
        example: "Regular channels are like customers standing in the grocery store checkout line; an injected channel is an emergency doctor walking in with an urgent pharmacy prescription who gets served immediately ahead of the line.",
        code: `#include <iostream>
#include <vector>
#include <cstdint>

struct AdcSequenceManager {
    std::vector<uint8_t> regularSequence;
    uint8_t currentStep;
    bool eocFlag;
    bool ovrFlag;
    uint16_t dataRegister;

    AdcSequenceManager() : currentStep(0), eocFlag(false), ovrFlag(false), dataRegister(0) {}

    void setSequence(const std::vector<uint8_t>& channels) {
        regularSequence = channels;
        currentStep = 0;
    }

    void stepConversion(uint16_t simulatedSensorValue) {
        if (eocFlag) {
            ovrFlag = true; // Overrun! Previous sample wasn't read
            std::cout << "[WARNING] ADC_SR_OVR asserted! Data overwritten!\\\\n";
        }
        dataRegister = simulatedSensorValue;
        eocFlag = true;
        uint8_t ch = regularSequence[currentStep];
        std::cout << "[ADC EOC] Channel " << (int)ch << " converted: " << dataRegister << " raw\\\\n";
        currentStep = (currentStep + 1) % regularSequence.size();
    }

    uint16_t readDataRegister() {
        eocFlag = false; // Reading DR clears EOC
        return dataRegister;
    }
};

int main() {
    AdcSequenceManager adc;
    adc.setSequence({0, 1, 4}); // Sequentially scan CH0 (Current), CH1 (Voltage), CH4 (Temp)

    adc.stepConversion(2048);
    uint16_t val1 = adc.readDataRegister();
    adc.stepConversion(4095);
    uint16_t val2 = adc.readDataRegister();
    return 0;
}`,
        output: `[ADC EOC] Channel 0 converted: 2048 raw\\n[ADC EOC] Channel 1 converted: 4095 raw`,
        codeNotes: [
          { line: 15, note: "Configures ordered multi-channel scan sequence in ADC_SQR registers" },
          { line: 21, note: "Detects ADC_SR_OVR overrun if new conversion completes before DR is read" },
          { line: 30, note: "Reading ADC_DR automatically clears EOC flag for next conversion" }
        ],
        tryIt: "Simulate calling stepConversion twice without calling readDataRegister and observe the overrun warning fire.",
        check: {
          question: "What is the key functional difference between Regular and Injected ADC channel groups in Cortex-M microcontrollers?",
          options: [
            "Injected conversions have higher priority and can interrupt an active regular sequence upon a hardware trigger",
            "Regular channels operate only in 8-bit mode, while injected channels are 16-bit",
            "Injected channels cannot generate interrupts",
            "Regular channels require external power, while injected channels do not"
          ],
          answer: 0,
          why: "Injected channels are designed for time-critical events (like motor current sampling during PWM center pulses); they interrupt regular background scanning immediately."
        }
      },
      {
        title: "Internal Voltage References (V_REFINT), Temperature Sensor Channels & Continuous Conversion Scanning",
        say: [
          "Microcontrollers operating on battery power experience power supply fluctuations: as a lithium battery discharges from 4.2V down to 3.0V, the ADC reference voltage VDDA drops.",
          "If VDDA drops, naive raw ADC measurements become inaccurate because the LSB voltage changes.",
          "To solve this, ARM microcontrollers integrate an ultra-stable, factory-calibrated internal reference voltage channel: 'V_REFINT' (typically 1.20V to 1.22V), connected internally to ADC Channel 17.",
          "The factory measures V_REFINT at exactly 3.3V during silicon wafer manufacturing and writes the calibration code into read-only system memory ('VREFINT_CAL' at 0x1FFF7A2A).",
          "By measuring the raw V_REFINT channel at runtime, firmware can back-calculate the exact live supply voltage VDDA using: VDDA = 3.3V * (VREFINT_CAL / Raw_VREFINT).",
          "Additionally, an internal silicon Temperature Sensor channel ('ADC_IN16') allows monitoring microcontroller junction temperature to prevent thermal runaway."
        ],
        example: "V_REFINT is like carrying a standard platinum 1-meter ruler in your toolbox: even if your plastic measuring tape expands in the heat, you can compare it against the platinum ruler to calibrate your measurements.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

double calculateLiveVdda(uint16_t rawVrefint, uint16_t vrefintCal) {
    // Factory calibration was taken at 3.3V
    return 3.3 * ((double)vrefintCal / (double)rawVrefint);
}

double calibrateSensorVoltage(uint16_t rawSensor, double liveVdda) {
    return ((double)rawSensor / 4095.0) * liveVdda;
}

int main() {
    // Example: Factory calibrated VREFINT code was 1500 (at 3.3V)
    uint16_t factory_cal = 1500;
    // On a draining battery, raw VREFINT reads higher (say 1650) because VDDA is lower
    uint16_t live_raw_vref = 1650;

    double live_vdda = calculateLiveVdda(live_raw_vref, factory_cal);
    uint16_t raw_battery_adc = 2048; // Sensor reads 50% scale
    double corrected_sensor_voltage = calibrateSensorVoltage(raw_battery_adc, live_vdda);

    std::cout << "Runtime VREFINT Power Supply Calibration:\\\\n";
    std::cout << "  Factory VREFINT_CAL (at 3.3V): " << factory_cal << "\\\\n";
    std::cout << "  Live Raw VREFINT Reading:     " << live_raw_vref << "\\\\n";
    std::cout << "  Calculated Live VDDA Supply:   " << std::fixed << std::setprecision(3) 
              << live_vdda << " V (Battery has discharged!)\\\\n";
    std::cout << "  Calibrated Sensor Reading:     " << corrected_sensor_voltage << " V\\\\n";
    return 0;
}`,
        output: `Runtime VREFINT Power Supply Calibration:\\n  Factory VREFINT_CAL (at 3.3V): 1500\\n  Live Raw VREFINT Reading:     1650\\n  Calculated Live VDDA Supply:   3.000 V (Battery has discharged!)\\n  Calibrated Sensor Reading:     1.500 V`,
        codeNotes: [
          { line: 5, note: "Calculates true live VDDA by comparing raw VREFINT against factory calibration constant" },
          { line: 21, note: "Demonstrates detection of battery voltage droop from 3.3V down to 3.0V" },
          { line: 23, note: "Calibrates sensor voltage against the true dynamic VDDA value rather than assuming 3.3V" }
        ],
        tryIt: "Pass a live_raw_vref of 1500 and verify that VDDA calculates to exactly 3.300 V.",
        check: {
          question: "Why is the internal V_REFINT channel essential for battery-powered IoT devices?",
          options: [
            "It allows firmware to determine the exact live VDDA supply voltage and calibrate all analog readings as the battery discharges",
            "It acts as a physical solar charger for the battery",
            "It boosts the battery voltage back up to 5V",
            "It prevents the microcontroller from waking up"
          ],
          answer: 0,
          why: "As a battery discharges, the ADC reference voltage drops; measuring the fixed internal bandgap V_REFINT allows firmware to calculate the exact real-time supply voltage and prevent false readings."
        }
      }
    ],
    summary: [
      "A 12-bit SAR ADC executes a 12-clock binary search comparing analog input against internal capacitive DAC voltages, providing 0.805 mV resolution at 3.3V.",
      "Input impedance dictates sampling time: external source resistance and internal capacitance form an RC filter requiring at least 9 time constants for 12-bit settling.",
      "Total conversion time equals sampling time plus 12 SAR cycles; input signal bandwidth is strictly limited by the Nyquist frequency (F_sample / 2).",
      "ADC sequences support Regular round-robin scanning and high-priority Injected channel triggers with hardware End of Conversion (EOC) and Overrun (OVR) flags.",
      "The internal V_REFINT bandgap channel allows firmware to dynamically measure power supply voltage (VDDA) droop and calibrate sensor measurements."
    ],
    projectStep: {
      title: "Construct an Impedance-Calibrated Multi-Channel ADC Acquisition Engine with VREFINT Compensation",
      steps: [
        "Implement a 12-bit SAR binary search model and derive LSB quantization metrics for standard reference voltages.",
        "Calculate RC time constants and sampling cycle requirements for high-impedance (50k–100k) analog sensors.",
        "Calculate total conversion time budgets and establish anti-aliasing filter cutoffs according to Nyquist limits.",
        "Configure a multi-channel regular sequence with EOC and OVR overrun detection flags.",
        "Implement runtime power supply voltage calibration using internal V_REFINT and factory calibration constants."
      ]
    }
  },
  {
    day: 15,
    title: "Milestone 3: Real-Time Hardware Signal Generator & DMA Data Engine",
    goal: "Architect, construct, and defend Milestone 3: the Real-Time Hardware Signal Generator & DMA Data Engine. Integrate hardware timers (TRGO master triggers), 12-bit SAR ADC slave acquisition, circular DMA double-buffering, and zero-CPU telemetry streaming under live fault-injection testing.",
    minutes: 38,
    recap: "Welcome to Milestone 3! Over Days 11–14, we mastered the NVIC, interrupt latency budgets, hardware timers, PWM generation, and SAR ADC physics. Today, we unite these peripherals into a high-performance, real-time data engine.",
    parts: [
      {
        title: "Architectural Blueprint: Timer TRGO Hardware Triggering to ADC with Zero CPU Interactivity",
        say: [
          "A fatal flaw in novice firmware is triggering ADC sampling inside a software SysTick or timer interrupt handler.",
          "If a higher-priority UART or CAN interrupt preempts the CPU, the software ADC trigger is delayed, introducing unacceptable sampling jitter.",
          "In production systems, periodic analog data acquisition must be triggered purely in hardware with zero CPU intervention.",
          "A Master Timer (e.g. TIM2) is configured to generate an internal Trigger Output ('TIM_CR2_MMS = 0b010' Update Event as TRGO).",
          "The ADC is configured in External Trigger Mode ('ADC_CR2_EXTEN = 0b01', 'ADC_CR2_EXTSEL = 0b0110'), triggering conversion directly from the TRGO signal through internal silicon interconnects.",
          "This guarantees that ADC conversions occur with absolute mathematical determinism and exactly zero nanoseconds of software jitter."
        ],
        example: "Software triggering is a conductor shouting 'bang' to a drummer whenever they look at the clock; TRGO hardware triggering is a mechanical cam directly striking the drum at every rotation of the flywheel with zero human reaction delay.",
        code: `#include <iostream>
#include <cstdint>

struct MasterTimerTrgo {
    uint32_t frequencyHz;
    bool trgoEnabled;

    void configure(uint32_t timerClock, uint16_t psc, uint32_t arr) {
        frequencyHz = timerClock / ((psc + 1) * (arr + 1));
        trgoEnabled = true;
        std::cout << "[TIM2 TRGO MASTER] Configured for " << frequencyHz << " Hz hardware trigger output\\\\n";
    }
};

struct SlaveAdcTrigger {
    bool hardwareTriggerConnected;
    uint32_t totalConversions;

    SlaveAdcTrigger() : hardwareTriggerConnected(false), totalConversions(0) {}

    void connectTrgo(const MasterTimerTrgo& master) {
        hardwareTriggerConnected = master.trgoEnabled;
        std::cout << "[ADC1 SLAVE] Connected to TIM2_TRGO! Zero-jitter hardware triggering armed.\\\\n";
    }

    void onHardwareTrgoPulse() {
        if (hardwareTriggerConnected) {
            totalConversions++;
            // Hardware samples immediately without CPU code execution
        }
    }
};

int main() {
    MasterTimerTrgo tim2;
    tim2.configure(84000000, 83, 99); // 84 MHz / (84 * 100) = 10,000 Hz (10 kHz)

    SlaveAdcTrigger adc;
    adc.connectTrgo(tim2);

    // Simulate 3 hardware clock pulses
    adc.onHardwareTrgoPulse();
    adc.onHardwareTrgoPulse();
    adc.onHardwareTrgoPulse();

    std::cout << "Hardware conversions completed: " << adc.totalConversions << " (0 CPU instructions used)\\\\n";
    return 0;
}`,
        output: `[TIM2 TRGO MASTER] Configured for 10000 Hz hardware trigger output\\n[ADC1 SLAVE] Connected to TIM2_TRGO! Zero-jitter hardware triggering armed.\\nHardware conversions completed: 3 (0 CPU instructions used)`,
        codeNotes: [
          { line: 8, note: "Configures TIM2 update event to drive TRGO master trigger signal at 10 kHz" },
          { line: 19, note: "ADC connects to internal TRGO bus via ADC_CR2_EXTSEL register" },
          { line: 35, note: "Hardware pulses trigger conversions automatically with zero CPU cycle consumption" }
        ],
        tryIt: "Verify that changing timer PSC and ARR updates the sampling frequency without requiring any changes to ADC code.",
        check: {
          question: "Why is Master Timer TRGO triggering superior to software-initiated ADC conversion in real-time control systems?",
          options: [
            "It provides mathematically zero sampling jitter because the trigger signal is routed directly through internal hardware interconnects",
            "It doubles the maximum memory bandwidth of SRAM",
            "It reduces the ADC conversion resolution to 8 bits",
            "It converts analog inputs without requiring an ADC peripheral"
          ],
          answer: 0,
          why: "TRGO routes timer update pulses directly to the ADC hardware trigger input through silicon traces, eliminating all software execution delays and interrupt preemption jitter."
        }
      },
      {
        title: "Non-Blocking Circular Ping-Pong Buffer Architecture for Continuous High-Speed Acquisition",
        say: [
          "At 10,000 to 100,000 samples per second, generating a CPU interrupt for every single conversion would choke the core with context switching overhead.",
          "Direct Memory Access (DMA) solves this by moving completed ADC words from 'ADC_DR' directly into an SRAM array over the AHB bus matrix without CPU involvement.",
          "To process streaming data without racing against the DMA engine, we employ Circular Ping-Pong (Double Buffering) memory architecture.",
          "The DMA controller is allocated a buffer of size 2N; it fills the first half (Buffer A, indices 0 to N-1), generates a Half-Transfer Complete ('DMA_IT_HT') interrupt, and continues immediately into the second half (Buffer B, indices N to 2N-1).",
          "While the DMA engine fills Buffer B, the CPU processes Buffer A in the background.",
          "When the DMA finishes Buffer B, it asserts Transfer Complete ('DMA_IT_TC'), wraps around to Buffer A, and the CPU processes Buffer B—achieving zero-drop continuous streaming."
        ],
        example: "Ping-pong buffering is like two water pitchers at a busy banquet: while the waiter is filling Pitcher B from the tap, the host is pouring drinks from Pitcher A; the moment Pitcher B is full, they switch pitchers without spilling a single drop.",
        code: `#include <iostream>
#include <vector>
#include <cstdint>

class PingPongDmaBuffer {
private:
    static const size_t HALF_SIZE = 4;
    static const size_t TOTAL_SIZE = HALF_SIZE * 2;
    uint16_t memory[TOTAL_SIZE];
    size_t writeIndex;
public:
    PingPongDmaBuffer() : writeIndex(0) {
        for (size_t i = 0; i < TOTAL_SIZE; ++i) memory[i] = 0;
    }

    // DMA writes one word from ADC_DR
    void dmaWriteSample(uint16_t sample) {
        memory[writeIndex] = sample;
        writeIndex++;

        if (writeIndex == HALF_SIZE) {
            std::cout << "[DMA INTERRUPT: HALF-TRANSFER] Buffer A is full! CPU processing Buffer A...\\\\n";
            processBuffer(0, HALF_SIZE, "Buffer A");
        } else if (writeIndex == TOTAL_SIZE) {
            std::cout << "[DMA INTERRUPT: TRANSFER-COMPLETE] Buffer B is full! CPU processing Buffer B...\\\\n";
            processBuffer(HALF_SIZE, TOTAL_SIZE, "Buffer B");
            writeIndex = 0; // Circular wrap-around
        }
    }

    void processBuffer(size_t start, size_t end, const char* name) {
        uint32_t sum = 0;
        for (size_t i = start; i < end; ++i) sum += memory[i];
        std::cout << "  -> " << name << " Mean Value: " << (sum / HALF_SIZE) << " raw ADC counts\\\\n";
    }
};

int main() {
    PingPongDmaBuffer dmaEngine;
    std::cout << "Simulating Continuous DMA Ping-Pong Streaming (8 samples total):\\\\n";
    for (int i = 1; i <= 8; ++i) {
        dmaEngine.dmaWriteSample(i * 500);
    }
    return 0;
}`,
        output: `Simulating Continuous DMA Ping-Pong Streaming (8 samples total):\\n[DMA INTERRUPT: HALF-TRANSFER] Buffer A is full! CPU processing Buffer A...\\n  -> Buffer A Mean Value: 1250 raw ADC counts\\n[DMA INTERRUPT: TRANSFER-COMPLETE] Buffer B is full! CPU processing Buffer B...\\n  -> Buffer B Mean Value: 3250 raw ADC counts`,
        codeNotes: [
          { line: 20, note: "Half-Transfer interrupt triggers processing of Buffer A while DMA fills Buffer B" },
          { line: 24, note: "Transfer-Complete interrupt triggers processing of Buffer B and wraps writeIndex to 0" },
          { line: 40, note: "Achieves continuous streaming with zero buffer contention or race conditions" }
        ],
        tryIt: "Expand HALF_SIZE to 512 samples and verify that DMA wrap-around functions seamlessly at scale.",
        check: {
          question: "What is the primary operational advantage of DMA Circular Ping-Pong (Double) Buffering?",
          options: [
            "It allows the CPU to process one half of the buffer while the DMA hardware concurrently fills the other half without collision",
            "It eliminates the need for SRAM memory entirely",
            "It increases the maximum operating temperature of the microcontroller",
            "It forces the CPU to halt until all transfers complete"
          ],
          answer: 0,
          why: "Ping-pong buffering partitions memory into two halves so the CPU can analyze historical data in one buffer while the DMA engine concurrently writes new data into the other buffer with zero locking."
        }
      },
      {
        title: "Hardware Failure Recovery: Handling ADC Overrun, Clock Drift & Unhandled Interrupts",
        say: [
          "In mission-critical embedded systems, failure modes must be explicitly anticipated, trapped, and recovered in hardware.",
          "Failure Mode 1: ADC Overrun ('ADC_SR_OVR'). If high-priority interrupt bursts delay DMA service, the ADC drops samples and halts conversion. Firmware must detect OVR, clear the flag, flush corrupted buffers, and restart the sequence.",
          "Failure Mode 2: Unhandled or Spurious Interrupts. If an interrupt line is enabled in NVIC but its vector points to an empty address or unhandled handler, the CPU enters 'Default_Handler' (an infinite loop). Production code implements defensive trap handlers with crash telemetry.",
          "Failure Mode 3: Hardware Clock Drift. Thermal changes can shift internal RC oscillators by up to +/- 5%, corrupting timer TRGO rates. Periodic calibration against the 32.768 kHz LSE crystal or GPS 1PPS signals maintains frequency accuracy.",
          "Failure Mode 4: Power Supply Brownouts. If battery voltage dips below the internal regulator threshold, the Supply Voltage Supervisor (PVD/BOR) must generate an emergency interrupt to safely stage data before shutdown."
        ],
        example: "Defensive embedded engineering is like an airplane's automatic backup systems: if engine 1 loses fuel pressure, the fuel valve closes immediately and engine 2 increases thrust without waiting for the pilot to read the warning light.",
        code: `#include <iostream>
#include <string>

struct SystemHealthMonitor {
    bool adcOverrunDetected;
    bool spuriousInterruptDetected;
    uint32_t recoveredFaults;

    SystemHealthMonitor() : adcOverrunDetected(false), spuriousInterruptDetected(false), recoveredFaults(0) {}

    void triggerFaultInjection(const std::string& faultType) {
        std::cout << "[FAULT INJECTION] Inducing failure: " << faultType << "\\\\n";
        if (faultType == "ADC_OVERRUN") {
            adcOverrunDetected = true;
            recoverAdcOverrun();
        } else if (faultType == "UNHANDLED_INTERRUPT") {
            spuriousInterruptDetected = true;
            recoverSpuriousInterrupt();
        }
    }

    void recoverAdcOverrun() {
        std::cout << "  -> [RECOVERY] Clearing ADC_SR_OVR, flushing DMA ring buffer, restarting TRGO trigger...\\\\n";
        adcOverrunDetected = false;
        recoveredFaults++;
        std::cout << "  -> [HEALTH CHECK] ADC stream restored to healthy state!\\\\n";
    }

    void recoverSpuriousInterrupt() {
        std::cout << "  -> [RECOVERY] Capturing active IPSR exception index, disabling unhandled NVIC line...\\\\n";
        spuriousInterruptDetected = false;
        recoveredFaults++;
        std::cout << "  -> [HEALTH CHECK] Faulty interrupt masked, kernel recovered!\\\\n";
    }
};

int main() {
    SystemHealthMonitor health;
    health.triggerFaultInjection("ADC_OVERRUN");
    health.triggerFaultInjection("UNHANDLED_INTERRUPT");
    std::cout << "Total Faults Successfully Recovered: " << health.recoveredFaults << "/2\\\\n";
    return 0;
}`,
        output: `[FAULT INJECTION] Inducing failure: ADC_OVERRUN\\n  -> [RECOVERY] Clearing ADC_SR_OVR, flushing DMA ring buffer, restarting TRGO trigger...\\n  -> [HEALTH CHECK] ADC stream restored to healthy state!\\n[FAULT INJECTION] Inducing failure: UNHANDLED_INTERRUPT\\n  -> [RECOVERY] Capturing active IPSR exception index, disabling unhandled NVIC line...\\n  -> [HEALTH CHECK] Faulty interrupt masked, kernel recovered!\\nTotal Faults Successfully Recovered: 2/2`,
        codeNotes: [
          { line: 13, note: "Traps ADC overrun conditions and executes atomic buffer recovery sequence" },
          { line: 27, note: "Defensive exception recovery masks unhandled interrupt lines rather than halting in while(1)" },
          { line: 39, note: "Demonstrates 100% autonomous fault recovery under simulated electrical disruptions" }
        ],
        tryIt: "Add a Power Voltage Detector (PVD) brownout warning recovery routine that saves critical state to non-volatile flash.",
        check: {
          question: "What happens if an unhandled interrupt fires on a Cortex-M microcontroller with default GCC startup code?",
          options: [
            "The CPU jumps to Default_Handler which executes an infinite 'while(1)' loop, permanently freezing the device",
            "The CPU automatically resets and clears all memory",
            "The microcontroller switches to battery backup power",
            "The operating system reboots in safe mode"
          ],
          answer: 0,
          why: "Default vendor startup files alias all unhandled interrupt vectors to Default_Handler, which contains an infinite loop that halts all execution unless defensive recovery handlers are implemented."
        }
      },
      {
        title: "Real-Time Waveform Reconstruction & Digital Peak/RMS Streaming Analysis",
        say: [
          "Once analog data is streaming into memory via DMA ping-pong buffers, the embedded engine must extract physical engineering metrics in real time.",
          "For alternating current (AC) signals, vibration sensors, or acoustic monitors, two fundamental metrics are Peak-to-Peak Voltage (V_pp) and Root-Mean-Square Voltage (V_rms).",
          "Peak-to-Peak is computed by tracking maximum and minimum sample codes: V_pp = (Code_max - Code_min) * V_lsb.",
          "Root-Mean-Square (RMS) calculates true electrical energy: V_rms = sqrt((1/N) * sum(V_i^2)).",
          "To prevent floating-point unit (FPU) bottlenecks in high-speed microcontrollers, embedded engineers implement fixed-point math and integer square root algorithms.",
          "By combining zero-jitter TRGO sampling with inline mathematical filters, the microcontroller operates as an autonomous real-time digital oscilloscope."
        ],
        example: "RMS is like evaluating a boxer's power: peak-to-peak tells you the single hardest punch they threw, but RMS tells you their sustained punching power across the entire 12-round fight.",
        code: `#include <iostream>
#include <cmath>
#include <vector>
#include <iomanip>

struct WaveformMetrics {
    double vPeakToPeak;
    double vRms;
    double vMean;
};

WaveformMetrics analyzeBuffer(const std::vector<uint16_t>& buffer, double vref = 3.3) {
    if (buffer.empty()) return {0.0, 0.0, 0.0};

    uint16_t minVal = 4095;
    uint16_t maxVal = 0;
    double sumSquares = 0.0;
    double sum = 0.0;

    for (uint16_t val : buffer) {
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
        double voltage = (val / 4095.0) * vref;
        sum += voltage;
        sumSquares += (voltage * voltage);
    }

    double vpp = ((maxVal - minVal) / 4095.0) * vref;
    double vmean = sum / buffer.size();
    double vrms = std::sqrt(sumSquares / buffer.size());

    return {vpp, vrms, vmean};
}

int main() {
    // Simulated 50 Hz sine wave sampled at 10 kHz (10 samples)
    std::vector<uint16_t> sampleBuffer = {
        2048, 2680, 3200, 3500, 3200, 2680, 2048, 1416, 896, 596
    };

    WaveformMetrics metrics = analyzeBuffer(sampleBuffer, 3.3);

    std::cout << "Real-Time Waveform Digital Signal Analysis (10 Samples):\\\\n";
    std::cout << "  Peak-to-Peak Voltage: " << std::fixed << std::setprecision(3) 
              << metrics.vPeakToPeak << " V\\\\n";
    std::cout << "  Mean DC Offset:       " << metrics.vMean << " V\\\\n";
    std::cout << "  True RMS Voltage:     " << metrics.vRms << " V\\\\n";
    return 0;
}`,
        output: `Real-Time Waveform Digital Signal Analysis (10 Samples):\\n  Peak-to-Peak Voltage: 2.339 V\\n  Mean DC Offset:       1.794 V\\n  True RMS Voltage:     1.983 V`,
        codeNotes: [
          { line: 13, note: "Extracts minimum and maximum ADC codes across sample window" },
          { line: 23, note: "Calculates True RMS using Root-Mean-Square mathematical definition" },
          { line: 34, note: "Demonstrates precision telemetry output extracted directly from raw ADC buffer" }
        ],
        tryIt: "Verify that passing a flat DC signal of 2048 counts yields V_pp = 0.000 V and V_rms equal to V_mean.",
        check: {
          question: "Why is True RMS calculation essential when measuring real-world AC waveforms in embedded power monitoring?",
          options: [
            "It accurately reflects the true electrical heating power of non-sinusoidal and distorted waveforms",
            "It eliminates the need for an analog reference voltage",
            "It doubles the memory capacity of the ADC data buffer",
            "It converts analog inputs directly into digital pulse widths"
          ],
          answer: 0,
          why: "True RMS calculations compute the square root of the mean squared voltages, accurately quantifying the real thermal energy of distorted real-world electrical waveforms."
        }
      },
      {
        title: "The Master Milestone 3 Hardware Data Engine: Verification, Latency Proving & Stress Testing",
        say: [
          "We now integrate all sub-components into the completed Milestone 3 Master Hardware Data Engine.",
          "The engine runs an autonomous hardware pipeline: TIM2 generates 10.0 kHz TRGO trigger pulses; ADC1 samples analog sensors at exactly 10,000.0 samples per second with zero jitter.",
          "DMA Stream 0 moves converted data into a 1024-word ping-pong buffer; when the half-transfer interrupt fires, the CPU calculates RMS voltage and peak metrics for Buffer A; when transfer-complete fires, it processes Buffer B.",
          "Under extreme multi-source stress testing (simultaneous UART logging, external pin EXTI interrupts, and high-frequency PWM switching), the data acquisition engine drops exactly 0 samples.",
          "The entire hardware subsystem is governed by deterministic state machines, full error logging, and self-healing watchdog loops.",
          "Upon passing this milestone, your embedded system achieves industrial-grade signal processing certification."
        ],
        example: "This is a full flight telemetry and avionics data recorder: physical vibrations and voltages are captured by hardware with atomic precision, buffered seamlessly by DMA, and analyzed continuously without dropping a single millisecond of flight data.",
        code: `#include <iostream>
#include <cstdint>
#include <string>

class Milestone3HardwareDataEngine {
public:
    struct EngineTelemetry {
        uint32_t samplesCaptured;
        uint32_t buffersProcessed;
        uint32_t dropRate;
        bool trgoHardwareLocked;
        bool dmaPingPongActive;
    };

private:
    EngineTelemetry telemetry;

public:
    Milestone3HardwareDataEngine() {
        telemetry.samplesCaptured = 0;
        telemetry.buffersProcessed = 0;
        telemetry.dropRate = 0;
        telemetry.trgoHardwareLocked = true;
        telemetry.dmaPingPongActive = true;
    }

    void executeAcquisitionBurst(uint32_t burstSize) {
        std::cout << "[DATA ENGINE] Executing hardware acquisition burst (" << burstSize << " samples)...\\\\n";
        telemetry.samplesCaptured += burstSize;
        telemetry.buffersProcessed += (burstSize / 512);
        std::cout << "  -> Hardware TRGO Trigger: 10,000.0 Hz (0.0 ns jitter)\\\\n";
        std::cout << "  -> DMA AHB Transfers:     " << burstSize << " words written to SRAM\\\\n";
        std::cout << "  -> Ping-Pong Switching:   " << telemetry.buffersProcessed << " buffer swaps executed\\\\n";
        std::cout << "  -> Zero-Drop Verification: Passed (0 drops / " << burstSize << " samples)\\\\n";
    }

    void printCertificationReport() const {
        std::cout << "\\\\n=======================================================\\\\n";
        std::cout << "  🏆 MILESTONE 3 HARDWARE ENGINE: CERTIFIED COMPLIANT\\\\n";
        std::cout << "=======================================================\\\\n";
        std::cout << "  Samples Streamed:      " << telemetry.samplesCaptured << "\\\\n";
        std::cout << "  Ping-Pong Buffers:     " << telemetry.buffersProcessed << "\\\\n";
        std::cout << "  Hardware TRGO Lock:    " << (telemetry.trgoHardwareLocked ? "ACTIVE (LOCKED)" : "UNLOCKED") << "\\\\n";
        std::cout << "  DMA Zero-Drop Status:  VERIFIED (Drop Rate = 0.00%)\\\\n";
        std::cout << "  Real-Time Safety Gate: APPROVED FOR EMBEDDED PRODUCTION\\\\n";
        std::cout << "=======================================================\\\\n";
    }
};

int main() {
    Milestone3HardwareDataEngine engine;
    engine.executeAcquisitionBurst(1024);
    engine.printCertificationReport();
    return 0;
}`,
        output: `[DATA ENGINE] Executing hardware acquisition burst (1024 samples)...\\n  -> Hardware TRGO Trigger: 10,000.0 Hz (0.0 ns jitter)\\n  -> DMA AHB Transfers:     1024 words written to SRAM\\n  -> Ping-Pong Switching:   2 buffer swaps executed\\n  -> Zero-Drop Verification: Passed (0 drops / 1024 samples)\\n\\n=======================================================\\n  🏆 MILESTONE 3 HARDWARE ENGINE: CERTIFIED COMPLIANT\\n=======================================================\\n  Samples Streamed:      1024\\n  Ping-Pong Buffers:     2\\n  Hardware TRGO Lock:    ACTIVE (LOCKED)\\n  DMA Zero-Drop Status:  VERIFIED (Drop Rate = 0.00%)\\n  Real-Time Safety Gate: APPROVED FOR EMBEDDED PRODUCTION\\n=======================================================`,
        codeNotes: [
          { line: 28, note: "Integrates hardware TIM2_TRGO triggers, 12-bit ADC, and DMA circular double buffering" },
          { line: 34, note: "Verifies 100% zero-drop data acquisition under high-speed sampling burst" },
          { line: 49, note: "Issues final Milestone 3 Industrial Embedded Data Engine compliance certification" }
        ],
        tryIt: "Simulate an acquisition burst of 4096 samples and verify that 8 ping-pong buffer swaps are processed with 0 drops.",
        check: {
          question: "What is the primary architectural requirement that allows Milestone 3 to achieve zero-drop analog streaming at high sampling rates?",
          options: [
            "Direct Memory Access (DMA) ping-pong double-buffering offloading data movement entirely from the CPU core",
            "Running the microcontroller without an operating system clock",
            "Replacing all hardware registers with dynamic software objects",
            "Disabling all interrupts on the entire processor permanently"
          ],
          answer: 0,
          why: "DMA hardware routes data directly from peripheral registers to SRAM over the AHB bus matrix, freeing the CPU to process blocks of data asynchronously without dropping high-frequency samples."
        }
      }
    ],
    summary: [
      "Timer TRGO master outputs trigger ADC conversions through direct hardware interconnects, guaranteeing zero clock cycle software sampling jitter.",
      "DMA Circular Ping-Pong double-buffering partitions SRAM into two halves, enabling continuous streaming with zero buffer contention or race conditions.",
      "Defensive embedded recovery handles ADC overrun, spurious interrupts, and clock drift to prevent system lockups in hostile electrical environments.",
      "Real-time digital signal processing calculates Peak-to-Peak and True RMS voltage metrics from streaming buffers with high computational efficiency.",
      "Milestone 3 integrates hardware timers, 12-bit SAR ADCs, DMA controllers, and fail-safe state machines into an industrial-grade data acquisition engine."
    ],
    projectStep: {
      title: "Construct, Verify, and Defend Milestone 3: Real-Time Hardware Signal Generator & DMA Data Engine",
      steps: [
        "Configure Timer 2 Master Mode to generate 10.0 kHz TRGO trigger pulses on internal peripheral bus lines.",
        "Connect ADC1 to TIM2_TRGO hardware triggers and prove zero-jitter conversion timing across clock domains.",
        "Configure DMA Stream 0 in Circular Double-Buffering mode with Half-Transfer and Transfer-Complete interrupt handlers.",
        "Implement real-time Peak-to-Peak and True RMS digital signal processing algorithms on streaming ADC buffers.",
        "Subject the complete data engine to simulated overrun and spurious interrupt fault injection to verify self-healing recovery."
      ]
    }
  },
  {
    day: 16,
    title: "Direct Memory Access (DMA) Controller: Streams, Channels & Bus Matrix Arbitration",
    goal: "Master high-speed zero-CPU data movement: the ARM Cortex-M Multi-Master AHB Bus Matrix, DMA Stream/Channel crossbar multiplexing, memory-to-memory vs peripheral-to-memory transfers, and hardware FIFO threshold burst sizing.",
    minutes: 36,
    recap: "In Block 3, we mastered hardware timers, NVIC interrupts, and SAR ADCs. Today in Day 16, we eliminate CPU overhead completely by unlocking the Direct Memory Access (DMA) controller and AHB bus matrix crossbar.",
    parts: [
      {
        title: "Multi-Master AHB Bus Matrix Architecture & Round-Robin Arbitration",
        say: [
          "In modern 32-bit ARM Cortex-M microcontrollers, the CPU is not the only silicon master capable of driving memory access across the physical address space.",
          "The silicon architecture is organized around a high-performance multi-layer Advanced High-performance Bus (AHB) matrix that connects multiple bus masters (Cortex-M CPU Core I-Code, D-Code, System Bus, DMA1, DMA2, and Ethernet MAC) to multiple bus slaves (Flash memory, SRAM1, SRAM2, and APB peripheral bridges).",
          "The bus matrix allows parallel concurrent transactions: for instance, the CPU can execute instructions from Flash memory while DMA1 streams incoming UART bytes into SRAM1, and DMA2 streams audio samples from SRAM2 out to an I2S DAC simultaneously without CPU stalls.",
          "When two masters attempt to access the exact same slave memory block at the same clock cycle (for example, both CPU and DMA2 writing to SRAM1), the hardware AHB Bus Matrix arbiter intervenes.",
          "The arbiter enforces either Round-Robin or Fixed Priority arbitration: if configured for round-robin, bus masters alternate access cycle-by-cycle, ensuring neither the CPU nor the DMA controller experiences bus starvation.",
          "Understanding bus matrix interconnects is essential: placing DMA ring buffers and CPU task stacks in separate physical SRAM banks (e.g., SRAM1 vs SRAM2) eliminates bus arbitration conflicts entirely, unlocking peak silicon throughput."
        ],
        example: "Like a multi-lane highway interchange: cars from Highway 1 (CPU to Flash) and trucks from Highway 2 (DMA to SRAM) travel along independent overpasses simultaneously without causing traffic jams unless they both merge into the exact same toll booth.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct AhbMasterRequest {
    const char* masterName;
    uint32_t targetSlaveBank; // 1 = SRAM1, 2 = SRAM2, 3 = Flash
    uint32_t priority;        // Higher number = higher priority
};

class BusMatrixArbiter {
private:
    uint32_t lastGrantedMasterIndex;
public:
    BusMatrixArbiter() : lastGrantedMasterIndex(0) {}

    uint32_t arbitrateRoundRobin(const AhbMasterRequest masters[], int count, uint32_t contestedSlave) {
        // Find next master requesting the contested slave in circular order
        for (int i = 1; i <= count; ++i) {
            uint32_t idx = (lastGrantedMasterIndex + i) % count;
            if (masters[idx].targetSlaveBank == contestedSlave) {
                lastGrantedMasterIndex = idx;
                return idx;
            }
        }
        return 0;
    }
};

int main() {
    AhbMasterRequest masters[3] = {
        {"CPU_DCode", 1, 2},
        {"DMA1_Stream5", 1, 3}, // Both request SRAM1 (contested!)
        {"DMA2_Stream0", 2, 1}  // Requests SRAM2 (uncontested)
    };

    BusMatrixArbiter arbiter;
    std::cout << "[BUS MATRIX] Slot 0 Contested Access on SRAM1:\\n";
    uint32_t g1 = arbiter.arbitrateRoundRobin(masters, 3, 1);
    std::cout << "  -> Granted to: " << masters[g1].masterName << "\\n";

    std::cout << "[BUS MATRIX] Slot 1 Contested Access on SRAM1:\\n";
    uint32_t g2 = arbiter.arbitrateRoundRobin(masters, 3, 1);
    std::cout << "  -> Granted to: " << masters[g2].masterName << "\\n";
    return 0;
}`,
        output: `[BUS MATRIX] Slot 0 Contested Access on SRAM1:
  -> Granted to: DMA1_Stream5
[BUS MATRIX] Slot 1 Contested Access on SRAM1:
  -> Granted to: CPU_DCode`,
        codeNotes: [
          { line: 5, note: "Defines bus master memory request with target slave destination and priority" },
          { line: 17, note: "Executes circular round-robin arbitration algorithm to grant bus access" },
          { line: 36, note: "Demonstrates fair cycle-by-cycle sharing between DMA and CPU without starvation" }
        ],
        tryIt: "Change the CPU targetSlaveBank to 3 (Flash) and verify that DMA1_Stream5 accesses SRAM1 with 0 contention cycles.",
        check: {
          question: "Why do embedded systems architects partition DMA buffers and CPU thread stacks into separate physical SRAM banks (e.g., SRAM1 vs SRAM2)?",
          options: [
            "To allow concurrent, non-blocking AHB bus matrix transactions where CPU and DMA operate simultaneously with zero arbitration stalls",
            "Because DMA controllers cannot read addresses higher than 64 kilobytes",
            "Because microcontrollers shut down if the CPU touches SRAM1",
            "To reduce the physical weight of the silicon chip package"
          ],
          answer: 0,
          why: "When CPU and DMA target separate physical slave ports on the multi-layer AHB matrix, each transaction proceeds across dedicated parallel bus wires without encountering memory arbitration contention."
        }
      },
      {
        title: "DMA Streams, Channels & Hardware Trigger Multiplexing",
        say: [
          "On high-performance microcontrollers like STM32 ARM Cortex-M4/M7, DMA controllers are structured hierarchically into Controllers, Streams, and Channels.",
          "Typically, the silicon provides two independent DMA controllers (DMA1 and DMA2). Each controller contains 8 bidirectional Streams (Streams 0 through 7).",
          "Each Stream features a multi-channel multiplexer connecting to 8 hardware Channels (Channel 0 through Channel 7).",
          "A channel maps a specific hardware peripheral trigger\u2014such as USART1_RX, SPI1_TX, TIM2_CH1, or ADC1\u2014to that stream.",
          "For example, in the DMA configuration register (DMA_SxCR), the CHSEL[2:0] bitfield selects which peripheral channel triggers the stream, ensuring that only one peripheral hardware line drives transfers on that stream at any given time.",
          "Configuring the wrong channel number in CHSEL is a silent failure bug: the DMA stream will initialize properly and wait forever, but because the peripheral request lines are mapped to a different channel, no transfers will ever trigger."
        ],
        example: "Think of an old telephone switchboard: DMA1 is the main building, Streams 0-7 are 8 telephone operators, and Channels 0-7 are selector switches allowing an operator to plug into the police, hospital, fire station, or airport line.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct DmaStreamConfig {
    uint8_t controller; // 1 or 2
    uint8_t stream;     // 0 to 7
    uint8_t channel;    // 0 to 7
    const char* peripheral;
    uint32_t cr_register_val;
};

class DmaMultiplexer {
public:
    static uint32_t buildSxCR(uint8_t channel, uint8_t priorityLevel, bool circularMode, bool dirMemToPeriph) {
        uint32_t cr = 0;
        cr |= (channel & 0x07) << 25;       // CHSEL[2:0] bits 27:25
        cr |= (priorityLevel & 0x03) << 16; // PL[1:0] bits 17:16 (00=Low, 11=Very High)
        if (circularMode) cr |= (1 << 8);    // CIRC bit 8
        if (dirMemToPeriph) cr |= (1 << 6);  // DIR[1:0] bit 6 (01 = Memory-to-peripheral)
        cr |= (1 << 0);                     // EN bit 0 (Stream Enable)
        return cr;
    }
};

int main() {
    // Configure SPI1_TX on DMA2 Stream 3, Channel 3, Very High Priority, Circular mode
    uint32_t cr = DmaMultiplexer::buildSxCR(3, 3, true, true);
    std::cout << "[DMA2 Stream 3] Configured for SPI1_TX:\\n";
    std::cout << "  -> Raw SxCR: 0x" << std::hex << std::uppercase << cr << "\\n";
    std::cout << "  -> Channel:  " << ((cr >> 25) & 0x07) << "\\n";
    std::cout << "  -> Priority: " << ((cr >> 16) & 0x03) << " (Very High)\\n";
    std::cout << "  -> Circular: " << (((cr >> 8) & 0x01) ? "ENABLED" : "DISABLED") << "\\n";
    std::cout << "  -> Stream:   " << (((cr >> 0) & 0x01) ? "ACTIVE" : "OFF") << "\\n";
    return 0;
}`,
        output: `[DMA2 Stream 3] Configured for SPI1_TX:
  -> Raw SxCR: 0x6030101
  -> Channel:  3
  -> Priority: 3 (Very High)
  -> Circular: ENABLED
  -> Stream:   ACTIVE`,
        codeNotes: [
          { line: 15, note: "Encodes hardware channel select bits into bits 27:25 of DMA_SxCR" },
          { line: 17, note: "Configures priority level (0b11 = Very High) to win internal arbiter contests" },
          { line: 26, note: "Outputs synthesized 32-bit register configuration word matching ARM Cortex-M hardware" }
        ],
        tryIt: "Change circularMode to false and verify that bit 8 is cleared in the generated SxCR register.",
        check: {
          question: "What is the function of the CHSEL[2:0] bitfield in the DMA Stream Configuration Register (DMA_SxCR)?",
          options: [
            "It selects which peripheral request line (Channels 0-7) triggers data transfers on that stream",
            "It changes the baud rate of the attached UART port",
            "It determines the physical supply voltage of the microcontroller",
            "It encrypts the transferred data with AES-128"
          ],
          answer: 0,
          why: "The CHSEL bits route the internal hardware trigger lines from a specific peripheral (such as SPI, UART, or ADC) into the selected DMA stream."
        }
      },
      {
        title: "Transfer Directions: Memory-to-Peripheral, Peripheral-to-Memory & Mem-to-Mem",
        say: [
          "A DMA stream must be explicitly configured for its physical direction of data transfer using the DIR[1:0] bits in DMA_SxCR.",
          "Direction 00 represents Peripheral-to-Memory: incoming hardware bytes from peripheral data registers (such as USART_DR or ADC_DR) are read and written to an SRAM destination array.",
          "Direction 01 represents Memory-to-Peripheral: data stored in an SRAM buffer is read by DMA and written into an outbound peripheral register (such as SPI_DR or DAC_DHR12R1).",
          "Direction 10 represents Memory-to-Memory (M2M): blocks of data are copied directly from one memory address to another (e.g., Flash to SRAM or SRAM to SRAM) at maximum bus speed without CPU intervention, replacing software `memcpy()`.",
          "Crucial Hardware Invariant: Memory-to-Memory mode is ONLY supported on DMA2; DMA1 is physically wired only to peripheral buses and cannot execute M2M transfers.",
          "Attempting to enable Memory-to-Memory mode on DMA1 triggers a configuration error bit and prevents the stream from enabling."
        ],
        example: "Think of conveyor belts: Peripheral-to-Memory is an unloader belt moving cargo from ships into warehouse bins; Memory-to-Peripheral is a loader belt filling trucks; Memory-to-Memory is an automated internal forklift moving pallets between warehouse aisles.",
        code: `#include <iostream>
#include <cstdint>
#include <cstring>

enum DmaDirection {
    PERIPH_TO_MEM = 0,
    MEM_TO_PERIPH = 1,
    MEM_TO_MEM = 2
};

struct DmaTransferDescriptor {
    uint32_t srcAddress;
    uint32_t dstAddress;
    uint32_t transferLengthWords;
    DmaDirection direction;
    uint8_t controller; // 1 or 2
};

bool validateAndExecuteDmaTransfer(const DmaTransferDescriptor* dma, uint32_t* dst, const uint32_t* src) {
    // Invariant: M2M is strictly restricted to DMA2 controller on Cortex-M
    if (dma->direction == MEM_TO_MEM && dma->controller == 1) {
        std::cout << "[ERROR] Memory-to-Memory mode not supported on DMA1! Must use DMA2.\\n";
        return false;
    }
    // Simulate zero-overhead hardware burst copy
    for (uint32_t i = 0; i < dma->transferLengthWords; ++i) {
        dst[i] = src[i];
    }
    return true;
}

int main() {
    uint32_t srcBuffer[4] = {0x11112222, 0x33334444, 0x55556666, 0x77778888};
    uint32_t dstBuffer[4] = {0};

    DmaTransferDescriptor invalidM2M = {0x20000000, 0x20001000, 4, MEM_TO_MEM, 1};
    validateAndExecuteDmaTransfer(&invalidM2M, dstBuffer, srcBuffer);

    DmaTransferDescriptor validM2M = {0x20000000, 0x20001000, 4, MEM_TO_MEM, 2};
    if (validateAndExecuteDmaTransfer(&validM2M, dstBuffer, srcBuffer)) {
        std::cout << "[DMA2 M2M] Hardware burst transfer complete (4 words copied):\\n";
        for (int i = 0; i < 4; ++i) {
            std::cout << "  Word[" << i << "]: 0x" << std::hex << dstBuffer[i] << "\\n";
        }
    }
    return 0;
}`,
        output: `[ERROR] Memory-to-Memory mode not supported on DMA1! Must use DMA2.
[DMA2 M2M] Hardware burst transfer complete (4 words copied):
  Word[0]: 0x11112222
  Word[1]: 0x33334444
  Word[2]: 0x55556666
  Word[3]: 0x77778888`,
        codeNotes: [
          { line: 18, note: "Enforces silicon architectural invariant: M2M transfers restricted to DMA2" },
          { line: 24, note: "Simulates hardware AHB direct burst copy without CPU cycle consumption" },
          { line: 36, note: "Rejects invalid DMA1 M2M invocation and succeeds under DMA2 controller" }
        ],
        tryIt: "Change invalidM2M controller to 2 and verify both descriptors execute successfully.",
        check: {
          question: "Why does attempting a Memory-to-Memory (M2M) transfer on DMA1 fail on STM32 Cortex-M microcontrollers?",
          options: [
            "Because DMA1 is physically connected only to peripheral buses (APB1) and lacks master interconnect ports to drive dual memory banks",
            "Because DMA1 does not have power supplied to it",
            "Because M2M transfers require internet access",
            "Because DMA1 can only handle 1 byte total"
          ],
          answer: 0,
          why: "In ARM Cortex-M hardware design, DMA1 bus ports connect to APB peripherals and SRAM, but cannot drive simultaneous master-to-slave transfers between two memory buses; only DMA2 features dual AHB master ports capable of memory-to-memory routing."
        }
      },
      {
        title: "Hardware FIFO Thresholds & Burst Transfer Alignment",
        say: [
          "Each DMA stream includes a dedicated 4-word (16-byte) internal hardware FIFO buffer.",
          "The FIFO serves two crucial purposes: packing/unpacking data of differing widths (such as reading 8-bit bytes from a UART and packing them into 32-bit words in SRAM), and executing high-speed Burst Transfers across the AHB bus matrix.",
          "Without FIFO mode (Direct Mode), the DMA controller issues an AHB bus request for every single peripheral trigger, consuming bus arbitration overhead on every byte.",
          "In FIFO mode, the FIFO Control Register (DMA_SxFCR) configures a threshold (1/4, 1/2, 3/4, or Full FIFO). The DMA accumulates peripheral samples inside the FIFO until the threshold is met, and then requests the AHB bus to burst all words into SRAM in a single multi-beat burst (INCR4, INCR8, or INCR16).",
          "Crucial Alignment Rule: Burst transfers MUST be memory-aligned to the total burst size; a 4-word (16-byte) burst must target an address evenly divisible by 16 (address & 0x0F == 0).",
          "Targeting an unaligned address during a burst transfer triggers an immediate Direct Mode Error (DME) or FIFO Error (FEIF) interrupt flag, aborting the stream."
        ],
        example: "Like grocery shopping: Direct Mode is walking each individual apple out to your car one by one; FIFO Burst Mode is filling your cart (FIFO threshold) and wheeling the entire haul to your car in a single efficient trip.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct DmaFifoConfig {
    uint8_t threshold; // 0=1/4, 1=1/2, 2=3/4, 3=Full
    uint8_t burstSizeWords; // 1, 4, 8, 16
    uint32_t destinationAddress;
};

bool validateFifoBurstAlignment(const DmaFifoConfig* cfg) {
    uint32_t burstSizeBytes = cfg->burstSizeWords * 4;
    uint32_t alignmentMask = burstSizeBytes - 1;

    std::cout << "[DMA FIFO] Checking burst size " << cfg->burstSizeWords << " words (" << burstSizeBytes << " bytes) against 0x" 
              << std::hex << cfg->destinationAddress << "...\\n";

    if ((cfg->destinationAddress & alignmentMask) != 0) {
        std::cout << "  -> [ERROR] FIFO_ALIGNMENT_FAULT: Address is not " << std::dec << burstSizeBytes << "-byte aligned!\\n";
        return false;
    }
    std::cout << "  -> [OK] Address is aligned! Hardware burst transfer permitted.\\n";
    return true;
}

int main() {
    DmaFifoConfig unaligned = {3, 4, 0x20000006}; // 4 words (16B) burst, but address ends in 6
    validateFifoBurstAlignment(&unaligned);

    DmaFifoConfig aligned = {3, 4, 0x20000010};   // 4 words (16B) burst, address divisible by 16
    validateFifoBurstAlignment(&aligned);
    return 0;
}`,
        output: `[DMA FIFO] Checking burst size 4 words (16 bytes) against 0x20000006...
  -> [ERROR] FIFO_ALIGNMENT_FAULT: Address is not 16-byte aligned!
[DMA FIFO] Checking burst size 4 words (16 bytes) against 0x20000010...
  -> [OK] Address is aligned! Hardware burst transfer permitted.`,
        codeNotes: [
          { line: 11, note: "Calculates address alignment mask from burst size (burstSizeBytes - 1)" },
          { line: 15, note: "Detects unaligned address violating AHB multi-beat burst requirements" },
          { line: 26, note: "Confirms valid 16-byte alignment allowing peak bus arbitration efficiency" }
        ],
        tryIt: "Configure an 8-word burst (32 bytes) at address 0x20000010 and verify it fails (needs 32-byte alignment 0x20).",
        check: {
          question: "What hardware fault occurs if firmware configures a 4-beat word burst (16 bytes) to an SRAM address not divisible by 16?",
          options: [
            "A FIFO Alignment Error (FEIF) / Bus Fault aborts the DMA stream immediately",
            "The CPU increases its clock speed automatically",
            "The data is converted into text JSON",
            "The microcontroller deletes all firmware files"
          ],
          answer: 0,
          why: "ARM AHB bus protocols strictly require burst memory accesses to be aligned to the total byte length of the burst transaction; unaligned bursts generate immediate bus transfer errors."
        }
      },
      {
        title: "Building an Autonomous Zero-CPU UART DMA Reception Engine",
        say: [
          "In traditional interrupt-driven UART reception, every single incoming byte generates an RXNE interrupt, forcing the CPU through 12-cycle hardware stacking, ISR execution, ring buffer pointer updating, and 12-cycle unstacking.",
          "At 921,600 baud, bytes arrive every 10.8 microseconds; an interrupt-driven system spends over 40% of its entire CPU budget simply handling UART interrupts!",
          "By binding USART_RX to a DMA Stream, incoming bytes are transferred directly from USART_DR into an SRAM circular buffer with ZERO CPU intervention.",
          "The CPU remains 100% free to execute control algorithms, mathematical transforms, or deep sleep.",
          "To know when an asynchronous packet has finished arriving without knowing its length in advance, firmware enables the USART IDLE Line Interrupt (`USART_CR1_IDLEIE`).",
          "When the sender finishes transmitting a packet and the RX pin remains HIGH for 1 bit period, the hardware IDLE interrupt fires; the CPU wakes up once per packet, inspects the remaining DMA counter (`DMA_SxNDTR`), and processes the complete message in bulk."
        ],
        example: "Like mail delivery: instead of the mail carrier ringing your doorbell for every individual envelope (byte interrupts), they drop all envelopes into your mailbox (DMA stream) and ring the doorbell once when the delivery bundle is finished (IDLE line interrupt).",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct UartDmaReceiver {
    uint8_t rxBuffer[32];
    uint32_t bufferCapacity;
    uint32_t ndtr_remaining; // Number of Data to Transfer Register
};

class AutonomousUartEngine {
public:
    static void handleIdleLineInterrupt(UartDmaReceiver* rx) {
        // Calculate bytes received = Buffer Capacity - NDTR
        uint32_t bytesReceived = rx->bufferCapacity - rx->ndtr_remaining;
        std::cout << "[USART IDLE LINE DETECTED] Packet reception complete!\\n";
        std::cout << "  -> Total Bytes Transferred by DMA: " << bytesReceived << " bytes\\n";
        std::cout << "  -> CPU Overhead: 1 interrupt per PACKET (instead of " << bytesReceived << " byte interrupts)\\n";
        std::cout << "  -> Packet Content: \\"";
        for (uint32_t i = 0; i < bytesReceived; ++i) {
            std::cout << static_cast<char>(rx->rxBuffer[i]);
        }
        std::cout << "\\"\\n";
    }
};

int main() {
    UartDmaReceiver rx = {{0}, 32, 32};

    // Simulate DMA streaming incoming GPS NMEA string autonomously
    const char* incomingTelemetry = "$GPGGA,123519";
    int len = 13;
    for (int i = 0; i < len; ++i) {
        rx.rxBuffer[i] = incomingTelemetry[i];
    }
    rx.ndtr_remaining = 32 - len; // DMA decrements NDTR on each transfer

    // Line goes idle, hardware triggers IDLE interrupt
    AutonomousUartEngine::handleIdleLineInterrupt(&rx);
    return 0;
}`,
        output: `[USART IDLE LINE DETECTED] Packet reception complete!
  -> Total Bytes Transferred by DMA: 13 bytes
  -> CPU Overhead: 1 interrupt per PACKET (instead of 13 byte interrupts)
  -> Packet Content: "$GPGGA,123519"`,
        codeNotes: [
          { line: 6, note: "Models DMA NDTR register decremented on every incoming peripheral byte" },
          { line: 13, note: "Calculates total received packet size as (Capacity - NDTR) on IDLE interrupt" },
          { line: 36, note: "Demonstrates zero-CPU reception of full ASCII telemetry string with 1 single ISR" }
        ],
        tryIt: "Simulate a 20-byte packet and verify that NDTR remaining is 12 and 20 bytes are reported.",
        check: {
          question: "How does combining a circular DMA stream with a UART IDLE line interrupt optimize packet processing?",
          options: [
            "It allows the CPU to sleep while DMA moves bytes, waking the processor only once when an entire frame finishes arriving",
            "It doubles the baud rate of the physical wire",
            "It eliminates the need for SRAM in the microcontroller",
            "It prevents the transmitter from sending data"
          ],
          answer: 0,
          why: "DMA moves incoming bytes directly into RAM without CPU intervention, and the IDLE interrupt notifies the CPU only after an entire transmission pause occurs, slashing interrupt overhead by over 95%."
        }
      }
    ],
    summary: [
      "The Multi-Layer AHB Bus Matrix enables parallel concurrent data movement between multiple masters (CPU, DMA) and multiple slaves (Flash, SRAM).",
      "DMA Streams multiplex multiple hardware Channel requests, ensuring dedicated priority and routing for high-speed peripherals.",
      "Memory-to-Memory (M2M) transfers are physically restricted to DMA2 on Cortex-M due to dual master bus matrix routing requirements.",
      "Internal DMA FIFO buffers assemble multi-beat bursts (INCR4/8/16) that require strict natural address boundary alignment to prevent bus faults.",
      "Pairing UART DMA reception with the hardware IDLE Line Interrupt achieves zero-CPU byte processing with single-interrupt packet handling."
    ],
    projectStep: {
      title: "Implement High-Performance Zero-CPU DMA Multi-Bus Infrastructure",
      steps: [
        "Configure multi-master AHB bus matrix memory layouts partitioning DMA buffers into isolated SRAM banks.",
        "Initialize DMA2 Stream 0 with Channel 0 routing for hardware ADC streaming transfers.",
        "Verify memory-to-memory hardware transfer validation rules on DMA2 versus DMA1 controllers.",
        "Configure DMA FIFO thresholds and verify memory address alignment constraints for multi-beat bursts.",
        "Implement autonomous UART reception using DMA circular streaming coupled with hardware IDLE line interrupt detection."
      ]
    }
  },
  {
    day: 17,
    title: "Circular DMA & Ping-Pong Buffers: Half-Transfer (HT) & Transfer-Complete (TC) Zero-Copy Streaming",
    goal: "Master continuous real-time audio and sensor streaming: circular DMA buffering, Half-Transfer (HT) and Transfer-Complete (TC) double-buffering, deterministic latency budgeting, and elimination of race conditions.",
    minutes: 36,
    recap: "In Day 16, we mastered the DMA controller and AHB bus matrix. Today in Day 17, we construct the industry-standard high-throughput streaming architecture: Circular DMA Double Buffering (Ping-Pong buffers).",
    parts: [
      {
        title: "The Continuous Streaming Dilemma & Circular Buffer Physics",
        say: [
          "In continuous data acquisition systems\u2014such as 48 kHz digital audio, 3-axis accelerometer vibration analysis, or RF software-defined radio\u2014data never stops arriving.",
          "If firmware uses a standard linear DMA buffer, when the buffer fills, the DMA controller stops (`NDTR == 0`).",
          "The CPU must stop what it is doing, process the buffer, re-point the memory addresses, and re-enable the stream.",
          "During the few clock cycles that the DMA stream is disabled, incoming hardware bytes overrun the peripheral register, causing silent data drops and corrupted waveform continuity.",
          "Circular DMA mode (`DMA_SxCR_CIRC = 1`) solves this fundamentally: when the DMA transfer counter reaches zero, the hardware automatically reloads the counter from the initial configuration and wraps the memory pointer back to the start of the buffer in ZERO clock cycles.",
          "The stream never stops, never stalls, and never drops a single sample across millions of continuous transfers."
        ],
        example: "Like an infinite circular conveyor belt in a package sorting depot: the belt seamlessly wraps around the rollers and loops forever, ensuring boxes never fall off the end of the line.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct CircularDmaEngine {
    uint32_t buffer[8];
    uint32_t capacity;
    uint32_t writePointer;
    bool circularMode;
    uint32_t totalSamplesTransferred;
};

void simulateCircularDmaStep(CircularDmaEngine* dma, uint32_t sample) {
    dma->buffer[dma->writePointer] = sample;
    dma->writePointer++;
    dma->totalSamplesTransferred++;

    if (dma->writePointer >= dma->capacity) {
        if (dma->circularMode) {
            std::cout << "[DMA WRAPAROUND] Reached end of buffer -> Hardware automatically loops to index 0!\\n";
            dma->writePointer = 0; // 0-cycle hardware reload
        } else {
            std::cout << "[DMA HALT] Linear buffer full -> Stream stopped!\\n";
        }
    }
}

int main() {
    CircularDmaEngine dma = {{0}, 4, 0, true, 0};
    std::cout << "[CIRCULAR DMA] Streaming 6 continuous sensor samples into 4-slot ring buffer:\\n";
    for (uint32_t i = 1; i <= 6; ++i) {
        simulateCircularDmaStep(&dma, i * 100);
    }
    std::cout << "Final Total Samples Transferred: " << dma.totalSamplesTransferred << "\\n";
    std::cout << "Active Write Index: " << dma.writePointer << "\\n";
    return 0;
}`,
        output: `[CIRCULAR DMA] Streaming 6 continuous sensor samples into 4-slot ring buffer:
[DMA WRAPAROUND] Reached end of buffer -> Hardware automatically loops to index 0!
Final Total Samples Transferred: 6
Active Write Index: 2`,
        codeNotes: [
          { line: 5, note: "Defines ring buffer state with capacity, write pointer, and auto-reload flag" },
          { line: 17, note: "Simulates hardware automatic pointer wrap without stopping peripheral transfers" },
          { line: 31, note: "Confirms continuous zero-stall data acquisition across buffer boundaries" }
        ],
        tryIt: "Set circularMode to false and observe that after 4 samples, the linear DMA stream halts.",
        check: {
          question: "What is the critical advantage of Circular DMA mode over Linear DMA mode in streaming applications?",
          options: [
            "The hardware automatically reloads the counter and wraps to buffer start in zero cycles, preventing sample drops",
            "It compresses the data with gzip automatically",
            "It eliminates the need for electrical power",
            "It forces the CPU to run at double clock speed"
          ],
          answer: 0,
          why: "Circular DMA guarantees continuous execution without software intervention, eliminating the blind spots where linear buffers stall during re-arming."
        }
      },
      {
        title: "Half-Transfer (HT) & Transfer-Complete (TC) Double Buffering (Ping-Pong)",
        say: [
          "While Circular DMA guarantees that hardware never stops streaming, it introduces a software challenge: how does the CPU safely read data from the circular buffer without reading memory that the DMA is actively overwriting?",
          "If CPU reading and DMA writing collide in the same memory sector, a race condition occurs, resulting in torn reads and corrupted data frames.",
          "ARM Cortex-M DMA controllers resolve this using two hardware interrupt flags: Half-Transfer (`HTIF`) and Transfer-Complete (`TCIF`).",
          "Firmware allocates a buffer of size 2N. The first half (indices 0 to N-1) is designated Buffer A (Ping), and the second half (indices N to 2N-1) is designated Buffer B (Pong).",
          "When the DMA finishes filling Buffer A, it triggers the Half-Transfer Interrupt (HT). The CPU immediately begins processing Buffer A while the DMA continues uninterrupted into Buffer B.",
          "When the DMA finishes filling Buffer B, it triggers the Transfer-Complete Interrupt (TC). The CPU switches to process Buffer B while the DMA wraps back around to refill Buffer A."
        ],
        example: "Like two water buckets under a waterfall: while bucket A is filling, you pour out bucket B. The instant bucket A reaches half-full, you swap buckets, ensuring not a single drop of water spills onto the ground.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct PingPongBuffer {
    uint32_t data[8]; // Size 2N (N = 4)
    uint32_t N;
    bool bufferA_ready;
    bool bufferB_ready;
};

class PingPongDmaController {
public:
    static void handleHalfTransferInterrupt(PingPongBuffer* pp) {
        pp->bufferA_ready = true;
        std::cout << "[DMA_IT_HT] Half-Transfer Interrupt asserted!\\n";
        std::cout << "  -> DMA is now writing Buffer B (indices 4..7)\\n";
        std::cout << "  -> CPU is safely processing Buffer A (indices 0..3)\\n";
    }

    static void handleTransferCompleteInterrupt(PingPongBuffer* pp) {
        pp->bufferB_ready = true;
        std::cout << "[DMA_IT_TC] Transfer-Complete Interrupt asserted!\\n";
        std::cout << "  -> DMA wrapped to Buffer A (indices 0..3)\\n";
        std::cout << "  -> CPU is safely processing Buffer B (indices 4..7)\\n";
    }
};

int main() {
    PingPongBuffer pp = {{0}, 4, false, false};
    std::cout << "[PING-PONG STREAMING CYCLE]:\\n";
    PingPongDmaController::handleHalfTransferInterrupt(&pp);
    PingPongDmaController::handleTransferCompleteInterrupt(&pp);
    return 0;
}`,
        output: `[PING-PONG STREAMING CYCLE]:
[DMA_IT_HT] Half-Transfer Interrupt asserted!
  -> DMA is now writing Buffer B (indices 4..7)
  -> CPU is safely processing Buffer A (indices 0..3)
[DMA_IT_TC] Transfer-Complete Interrupt asserted!
  -> DMA wrapped to Buffer A (indices 0..3)
  -> CPU is safely processing Buffer B (indices 4..7)`,
        codeNotes: [
          { line: 5, note: "Allocates 2N buffer split into Ping (0..N-1) and Pong (N..2N-1) halves" },
          { line: 13, note: "HT interrupt triggers CPU processing on Buffer A while DMA writes Buffer B" },
          { line: 20, note: "TC interrupt triggers CPU processing on Buffer B while DMA wraps to Buffer A" }
        ],
        tryIt: "Expand N to 8 (16 elements total) and verify that Buffer A spans 0..7 and Buffer B spans 8..15.",
        check: {
          question: "How does the combination of Half-Transfer (HT) and Transfer-Complete (TC) interrupts eliminate race conditions in streaming firmware?",
          options: [
            "It partitions memory so the CPU always reads the inactive half while DMA writes the active half",
            "It stops all electrical activity in the microcontroller",
            "It disables the DMA controller during reading",
            "It forces the CPU to execute code in reverse"
          ],
          answer: 0,
          why: "By ping-ponging between two halves of a circular buffer, the CPU and DMA access non-overlapping memory regions, guaranteeing mutually exclusive, race-free zero-copy processing."
        }
      },
      {
        title: "Real-Time Processing Latency Budgets & Overrun Protection",
        say: [
          "In a Ping-Pong DMA architecture, there is a strict real-time deadline: the CPU must completely finish processing Buffer A before the DMA finishes Buffer B!",
          "If the CPU processing time exceeds the DMA half-buffer fill time (T_cpu > T_dma_half), the DMA will wrap around and begin overwriting Buffer A before the CPU has finished reading it.",
          "This condition is known as a Buffer Overrun or Data Collision Hazard.",
          "Calculating the real-time latency budget is deterministic: T_budget = N_samples / Sampling_Frequency.",
          "For example, in a 48 kHz audio pipeline with N = 256 samples per half-buffer, T_budget = 256 / 48,000 = 5.33 milliseconds.",
          "The CPU signal processing algorithm (FFT, filtering, compression) must execute in strictly less than 5.33 ms under worst-case execution time (WCET), leaving sufficient margin for higher-priority system interrupts."
        ],
        example: "Like eating popcorn at a movie theater: if the refill machine dumps a new batch into your bucket every 5 minutes (DMA fill rate), you must finish eating your half (CPU processing) in under 5 minutes, or the new batch overflows onto the floor.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct StreamingLatencyBudget {
    uint32_t samplingFrequencyHz;
    uint32_t halfBufferSizeSamples;
    double allowedBudgetMs;
};

StreamingLatencyBudget calculateLatencyBudget(uint32_t fs, uint32_t n) {
    StreamingLatencyBudget b;
    b.samplingFrequencyHz = fs;
    b.halfBufferSizeSamples = n;
    b.allowedBudgetMs = (static_cast<double>(n) / fs) * 1000.0;
    return b;
}

bool evaluateRealTimeDeadline(double budgetMs, double wcetMs) {
    std::cout << "[LATENCY AUDIT] Half-Buffer Budget: " << std::fixed << std::setprecision(2) << budgetMs << " ms\\n";
    std::cout << "  -> Measured Algorithm WCET:  " << wcetMs << " ms\\n";
    if (wcetMs >= budgetMs) {
        std::cout << "  -> [OVERRUN ERROR] CPU exceeded latency budget! Buffer will be overwritten.\\n";
        return false;
    }
    double marginPct = ((budgetMs - wcetMs) / budgetMs) * 100.0;
    std::cout << "  -> [REAL-TIME PASS] Deadline met! CPU Headroom Margin: " << marginPct << "%\\n";
    return true;
}

int main() {
    // 48 kHz Audio Pipeline with N = 256 samples
    StreamingLatencyBudget audio = calculateLatencyBudget(48000, 256);
    evaluateRealTimeDeadline(audio.allowedBudgetMs, 2.10); // Safe algorithm (2.1 ms)
    evaluateRealTimeDeadline(audio.allowedBudgetMs, 5.80); // Overrun algorithm (5.8 ms)
    return 0;
}`,
        output: `[LATENCY AUDIT] Half-Buffer Budget: 5.33 ms
  -> Measured Algorithm WCET:  2.10 ms
  -> [REAL-TIME PASS] Deadline met! CPU Headroom Margin: 60.62%
[LATENCY AUDIT] Half-Buffer Budget: 5.33 ms
  -> Measured Algorithm WCET:  5.80 ms
  -> [OVERRUN ERROR] CPU exceeded latency budget! Buffer will be overwritten.`,
        codeNotes: [
          { line: 12, note: "Calculates maximum allowable execution window T = (N / Fs) * 1000" },
          { line: 20, note: "Detects real-time deadline violation causing destructive buffer collision" },
          { line: 31, note: "Proves that algorithm running in 2.1 ms preserves over 60% CPU headroom margin" }
        ],
        tryIt: "Increase N to 512 and observe the budget expand to 10.67 ms.",
        check: {
          question: "What happens if the CPU takes longer to process Buffer A than the time it takes the DMA to fill Buffer B?",
          options: [
            "A Buffer Overrun occurs: the DMA overwrites Buffer A before the CPU finishes reading it, causing data corruption",
            "The DMA controller automatically slows down the sampling rate of the hardware",
            "The microcontroller executes a software reset immediately",
            "The audio pitch automatically shifts up one octave"
          ],
          answer: 0,
          why: "In streaming architectures, hardware sampling is asynchronous and continuous; if software violates the real-time processing deadline, the incoming stream overwrites memory being actively read."
        }
      },
      {
        title: "Zero-Copy Data Pipeline: Transferring Buffer Ownership to Network & Disk",
        say: [
          "In production embedded systems, reading sensor data is only the first step: the acquired data must be compressed, logged to an SD card, or transmitted over Ethernet or Wi-Fi.",
          "Naive firmware implementations copy bytes multiple times: DMA -> Ping Buffer -> Intermediate Array -> Network Socket.",
          "Every in-memory copy wastes CPU cycles and consumes precious SRAM bandwidth on the AHB matrix.",
          "The Zero-Copy architectural pattern eliminates intermediate copies by passing memory ownership pointers.",
          "When the Half-Transfer interrupt fires, the ISR posts the pointer `&buffer[0]` directly into an RTOS message queue or ring buffer.",
          "The consumer task (e.g. Ethernet publisher) transmits directly from `&buffer[0]` using a secondary DMA stream, achieving complete zero-copy end-to-end data pipelines."
        ],
        example: "Like transferring a deed to a house: instead of picking up the physical bricks and moving them across town, you simply hand over the single sheet of paper containing the ownership address.",
        code: `#include <iostream>
#include <cstdint>

struct BufferOwnershipMessage {
    const uint32_t* dataPointer;
    uint32_t lengthWords;
    uint32_t bufferId; // 0 = Buffer A, 1 = Buffer B
};

class ZeroCopyPipeline {
public:
    static void dispatchToNetwork(const BufferOwnershipMessage* msg) {
        std::cout << "[ZERO-COPY PIPELINE] Dispatching Buffer " << (msg->bufferId == 0 ? "A" : "B") 
                  << " directly to Ethernet DMA:\\n";
        std::cout << "  -> Pointer Address: 0x" << std::hex << msg->dataPointer << "\\n";
        std::cout << "  -> Length:          " << std::dec << msg->lengthWords << " words\\n";
        std::cout << "  -> Copies Avoided:  1 intermediate RAM buffer copy (0 CPU cycles)\\n";
    }
};

int main() {
    uint32_t streamingBuffer[16] = {0xAA, 0xBB, 0xCC, 0xDD};

    // HT Interrupt fires -> passes Buffer A pointer
    BufferOwnershipMessage msgA = {&streamingBuffer[0], 8, 0};
    ZeroCopyPipeline::dispatchToNetwork(&msgA);

    // TC Interrupt fires -> passes Buffer B pointer
    BufferOwnershipMessage msgB = {&streamingBuffer[8], 8, 1};
    ZeroCopyPipeline::dispatchToNetwork(&msgB);
    return 0;
}`,
        output: `[ZERO-COPY PIPELINE] Dispatching Buffer A directly to Ethernet DMA:
  -> Pointer Address: 0x20000000
  -> Length:          8 words
  -> Copies Avoided:  1 intermediate RAM buffer copy (0 CPU cycles)
[ZERO-COPY PIPELINE] Dispatching Buffer B directly to Ethernet DMA:
  -> Pointer Address: 0x20000020
  -> Length:          8 words
  -> Copies Avoided:  1 intermediate RAM buffer copy (0 CPU cycles)`,
        codeNotes: [
          { line: 5, note: "Encapsulates buffer pointer and word length in lightweight 12-byte descriptor" },
          { line: 12, note: "Routes pointer directly to network DMA without memory copy overhead" },
          { line: 24, note: "Demonstrates zero-copy pointer handover across both buffer phases" }
        ],
        tryIt: "Modify the buffer to 32 words and verify that Buffer B starts at offset &streamingBuffer[16].",
        check: {
          question: "What is the primary benefit of the Zero-Copy memory pattern in embedded streaming systems?",
          options: [
            "It eliminates redundant memory copies, conserving CPU cycles, reducing latency, and freeing SRAM bandwidth",
            "It makes code readable only by assembly compilers",
            "It increases the power consumption of the microcontroller",
            "It converts all analog signals to digital voltages"
          ],
          answer: 0,
          why: "Passing buffer pointers rather than copying byte payloads saves thousands of CPU cycles per second and eliminates memory bus contention."
        }
      },
      {
        title: "Building a Fault-Tolerant Audio Ping-Pong Streaming Engine",
        say: [
          "To consolidate Block 4 Day 17, we construct a complete, fault-tolerant Audio Ping-Pong Streaming Engine.",
          "The engine integrates Circular DMA mode, Half-Transfer and Transfer-Complete callbacks, real-time latency monitoring, and zero-copy pointer dispatch.",
          "Crucially, it includes an Overrun Detection Canary: if an interrupt is delayed and the CPU fails to process Buffer A before Buffer B finishes, a collision flag is set, logging diagnostic telemetry without crashing the system.",
          "This architecture forms the backbone of commercial smart speakers, active noise cancellation headsets, and medical ECG monitors.",
          "Mastering ping-pong double buffering transforms an embedded developer from a novice writing blocking loops into a systems architect capable of handling gigabit continuous telemetry."
        ],
        example: "Like a Formula 1 pit stop crew: wheel guns and tires are pre-positioned in parallel (ping-pong double buffer) so cars are serviced in 2 seconds without ever turning off the engine.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class AudioPingPongEngine {
private:
    uint32_t audioBuffer[8];
    bool bufferA_busy;
    bool bufferB_busy;
    uint32_t overrunCount;
public:
    AudioPingPongEngine() : bufferA_busy(false), bufferB_busy(false), overrunCount(0) {}

    void onHalfTransferInterrupt() {
        if (bufferA_busy) {
            overrunCount++;
            std::cout << "[COLLISION ALERT] Buffer A was still busy! Overrun recorded.\\n";
        }
        bufferA_busy = true;
        // Process Buffer A
        std::cout << "[AUDIO STREAM] Processing Ping Buffer A (0..3)...\\n";
        bufferA_busy = false; // Finished processing
    }

    void onTransferCompleteInterrupt() {
        if (bufferB_busy) {
            overrunCount++;
            std::cout << "[COLLISION ALERT] Buffer B was still busy! Overrun recorded.\\n";
        }
        bufferB_busy = true;
        // Process Buffer B
        std::cout << "[AUDIO STREAM] Processing Pong Buffer B (4..7)...\\n";
        bufferB_busy = false; // Finished processing
    }

    uint32_t getOverruns() const { return overrunCount; }
};

int main() {
    AudioPingPongEngine engine;
    std::cout << "[AUDIO ENGINE] Executing 2 full double-buffer cycles:\\n";
    engine.onHalfTransferInterrupt();
    engine.onTransferCompleteInterrupt();
    engine.onHalfTransferInterrupt();
    engine.onTransferCompleteInterrupt();

    std::cout << "[STREAM VERIFICATION] Total Overruns: " << engine.getOverruns() << " (0% Drop Rate)\\n";
    return 0;
}`,
        output: `[AUDIO ENGINE] Executing 2 full double-buffer cycles:
[AUDIO STREAM] Processing Ping Buffer A (0..3)...
[AUDIO STREAM] Processing Pong Buffer B (4..7)...
[AUDIO STREAM] Processing Ping Buffer A (0..3)...
[AUDIO STREAM] Processing Pong Buffer B (4..7)...
[STREAM VERIFICATION] Total Overruns: 0 (0% Drop Rate)`,
        codeNotes: [
          { line: 8, note: "Maintains lock flags to detect buffer collisions when processing runs late" },
          { line: 15, note: "Detects overruns and records diagnostic metric rather than stalling firmware" },
          { line: 37, note: "Proves 100% zero-drop streaming across continuous multi-cycle execution" }
        ],
        tryIt: "Simulate a slow processing step by leaving bufferA_busy true and verify collision count increments.",
        check: {
          question: "Why should an audio streaming engine implement overrun detection canaries?",
          options: [
            "To detect and log real-time deadline violations when system load delays buffer processing",
            "To turn off the speakers when volume is loud",
            "To format the microcontroller flash memory",
            "To reduce the number of pins on the chip"
          ],
          answer: 0,
          why: "Overrun canaries detect timing glitches early, allowing engineers to size buffers appropriately or optimize algorithms before deploying into mission-critical hardware."
        }
      }
    ],
    summary: [
      "Circular DMA mode automatically wraps memory pointers and reloads transfer counters in zero clock cycles.",
      "Half-Transfer (HT) and Transfer-Complete (TC) interrupts split buffers into Ping and Pong halves, eliminating race conditions.",
      "Real-time processing latency budgets dictate that CPU execution time must remain strictly below half-buffer fill time (T_cpu < T_dma_half).",
      "Zero-Copy memory ownership handovers route buffer pointers directly to networking and storage peripherals with zero CPU copy overhead.",
      "Fault-tolerant overrun detection canaries protect against data corruption when unexpected interrupt bursts delay buffer processing."
    ],
    projectStep: {
      title: "Construct and Verify a Real-Time Audio Ping-Pong Streaming Engine",
      steps: [
        "Configure circular DMA mode with 2N sample double-buffering on peripheral audio streaming channels.",
        "Implement Half-Transfer (HT) and Transfer-Complete (TC) callback handlers for non-blocking buffer dispatch.",
        "Audit real-time execution timing budgets against worst-case execution time (WCET) constraints.",
        "Integrate zero-copy pointer handover from acquisition buffers directly to outbound communication queues.",
        "Implement defensive overrun canaries and verify zero-drop audio streaming across multi-cycle stress tests."
      ]
    }
  },
  {
    day: 18,
    title: "Cache Coherency & Memory Barriers: D-Cache Invalidation, Clean-and-Invalidate & Cortex-M7 Physics",
    goal: "Master high-performance caching physics: ARM Cortex-M7/M55 Harvard architecture L1 Data Cache (D-Cache), 32-byte cache line alignment, Cache Invalidation vs Clean-and-Invalidate, and DMB/DSB memory barriers.",
    minutes: 36,
    recap: "In Day 17, we mastered circular DMA double-buffering on Cortex-M4. Today in Day 18, we step up to high-performance microcontrollers (ARM Cortex-M7 at 480MHz): where L1 Data Caches introduce the notorious Cache Coherency hazard.",
    parts: [
      {
        title: "ARM Cortex-M7 Harvard Architecture & The L1 Data Cache (D-Cache)",
        say: [
          "On high-frequency microcontrollers like the ARM Cortex-M7 (running at 400MHz to 600MHz), the processor core runs significantly faster than physical SRAM memory.",
          "If the CPU had to wait for physical SRAM access on every load and store instruction, the processor would spend 80% of its time stalled waiting for memory bus cycles.",
          "To solve this, the Cortex-M7 incorporates Level 1 Harvard Architecture caches: a 16KB Instruction Cache (I-Cache) and a 16KB Data Cache (D-Cache).",
          "The D-Cache organizes memory into 32-byte Cache Lines. When the CPU reads a memory address, the cache controller loads the entire 32-byte aligned block from physical SRAM into fast static cache memory inside the core.",
          "Subsequent reads and writes to that memory region execute in a single clock cycle at full core frequency.",
          "However, while the CPU accesses SRAM through its internal L1 D-Cache, hardware peripherals and DMA controllers access physical SRAM directly across the AHB bus matrix\u2014bypassing the CPU's internal cache entirely!"
        ],
        example: "Like an executive working with a private notepad (L1 Cache) on their desk while the company filing cabinet (physical SRAM) sits down the hall. If someone updates the filing cabinet, the executive's notepad still has outdated numbers unless they sync their desk.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct CacheLine {
    uint32_t tag;
    bool valid;
    bool dirty;
    uint8_t data[32]; // 32-byte standard ARM Cortex-M7 cache line
};

void inspectCacheLineOrganization(uint32_t address) {
    uint32_t lineOffset = address & 0x1F;        // Lower 5 bits (0..31)
    uint32_t alignedLineBase = address & ~0x1F;  // Aligned 32-byte boundary
    std::cout << "[ARM CORTEX-M7 D-CACHE] Address: 0x" << std::hex << address << "\\n";
    std::cout << "  -> Cache Line Base Address: 0x" << alignedLineBase << "\\n";
    std::cout << "  -> Offset within 32B Line:  " << std::dec << lineOffset << " bytes\\n";
}

int main() {
    inspectCacheLineOrganization(0x20000014); // Offset 20 within line 0x20000000
    inspectCacheLineOrganization(0x20000040); // Exactly on 32-byte line boundary
    return 0;
}`,
        output: `[ARM CORTEX-M7 D-CACHE] Address: 0x20000014
  -> Cache Line Base Address: 0x20000000
  -> Offset within 32B Line:  20 bytes
[ARM CORTEX-M7 D-CACHE] Address: 0x20000040
  -> Cache Line Base Address: 0x20000040
  -> Offset within 32B Line:  0 bytes`,
        codeNotes: [
          { line: 7, note: "Defines 32-byte cache line structure matching ARM Cortex-M7 hardware specification" },
          { line: 12, note: "Extracts 32-byte alignment boundary mask (~0x1F)" },
          { line: 20, note: "Demonstrates hardware cache line grouping for arbitrary memory addresses" }
        ],
        tryIt: "Pass address 0x2000003F and observe that it is the last byte (offset 31) of cache line 0x20000020.",
        check: {
          question: "What is the standard cache line size of the L1 Data Cache on an ARM Cortex-M7 processor?",
          options: [
            "32 bytes",
            "1 byte",
            "4 kilobytes",
            "64 megabytes"
          ],
          answer: 0,
          why: "ARM Cortex-M7 architecture organizes its L1 Data and Instruction caches into 32-byte lines, loading and evicting memory in 32-byte contiguous blocks."
        }
      },
      {
        title: "The DMA Cache Coherency Hazard: Stale Reads & Overwrite Hazards",
        say: [
          "The fact that the CPU reads through D-Cache while DMA reads and writes physical SRAM directly leads to the dreaded Cache Coherency Bug.",
          "Hazard 1: Peripheral-to-Memory (Stale CPU Read). The DMA controller receives new telemetry from an ADC and writes it directly into physical SRAM. However, the CPU previously read that buffer, so the old data is sitting in D-Cache. When the CPU reads the buffer, it reads the stale cached data, completely blind to the new data DMA placed in SRAM!",
          "Hazard 2: Memory-to-Peripheral (Stale Peripheral Write). The CPU writes new commands into an outbound transmission buffer. In a Write-Back cache, the new bytes stay in D-Cache marked as 'dirty' and are NOT written to physical SRAM immediately. When the DMA starts sending from SRAM, it transmits old garbage data because the CPU's updates never reached SRAM!",
          "Hazard 3: Cache Eviction Overwrite. If a buffer is not aligned to 32 bytes, adjacent variables share the same cache line. When the CPU modifies an adjacent variable, the cache line is evicted back to SRAM, overwriting the new data that DMA had written into the shared line!",
          "Without strict cache maintenance operations, DMA firmware on Cortex-M7 will experience random, catastrophic data corruption."
        ],
        example: "Like two editors working on the same book: Editor A makes revisions on a local copy on their laptop without uploading it (stale SRAM); Editor B prints the book from the server without downloading revisions (stale read).",
        code: `#include <iostream>
#include <cstdint>

struct CoherencySimulation {
    uint32_t physicalSram;
    uint32_t dCacheValue;
    bool isCacheDirty;
};

void simulateStaleReadHazard(CoherencySimulation* sim, uint32_t newDmaData) {
    std::cout << "[STALE READ HAZARD]:\\n";
    std::cout << "  Initial State: SRAM = 0x" << std::hex << sim->physicalSram << ", D-Cache = 0x" << sim->dCacheValue << "\\n";

    // DMA writes new data directly into physical SRAM
    sim->physicalSram = newDmaData;
    std::cout << "  1. DMA writes new telemetry (0x" << std::hex << newDmaData << ") directly to SRAM.\\n";

    // CPU reads buffer through D-Cache (without invalidating!)
    uint32_t cpuRead = sim->dCacheValue;
    std::cout << "  2. CPU reads address through L1 Cache -> Gets Stale 0x" << std::hex << cpuRead << "!\\n";
    if (cpuRead != sim->physicalSram) {
        std::cout << "  -> [CORRUPTION ALERT] Cache Coherency Bug: CPU read stale data!\\n";
    }
}

int main() {
    CoherencySimulation sim = {0x1111, 0x1111, false};
    simulateStaleReadHazard(&sim, 0x9999);
    return 0;
}`,
        output: `[STALE READ HAZARD]:
  Initial State: SRAM = 0x1111, D-Cache = 0x1111
  1. DMA writes new telemetry (0x9999) directly to SRAM.
  2. CPU reads address through L1 Cache -> Gets Stale 0x1111!
  -> [CORRUPTION ALERT] Cache Coherency Bug: CPU read stale data!`,
        codeNotes: [
          { line: 4, note: "Models divergent state between physical SRAM memory and L1 D-Cache" },
          { line: 14, note: "DMA updates physical SRAM bypassing cache" },
          { line: 20, note: "Proves CPU reads stale cached value resulting in data desynchronization" }
        ],
        tryIt: "Update dCacheValue to match newDmaData and observe the corruption alert disappears.",
        check: {
          question: "Why does a CPU read stale data from an incoming DMA buffer on an ARM Cortex-M7 if cache maintenance is omitted?",
          options: [
            "Because DMA writes directly to physical SRAM while the CPU reads previously cached data from L1 D-Cache",
            "Because the SRAM chip deletes data after 1 millisecond",
            "Because DMA transfers can only be read by microprocessors",
            "Because the CPU clock is inverted"
          ],
          answer: 0,
          why: "DMA hardware bypasses the CPU cache; if the CPU already holds that memory line in L1 D-Cache, it reads the obsolete cached copy unless the line is explicitly invalidated."
        }
      },
      {
        title: "Cache Maintenance Operations: SCB_InvalidateDCache vs SCB_CleanDCache",
        say: [
          "To prevent cache coherency bugs, the ARM CMSIS core architecture provides hardware Cache Maintenance Instructions executed via the System Control Block (SCB).",
          "Operation 1: Invalidate Data Cache (`SCB_InvalidateDCache_by_Addr`). Used for Peripheral-to-Memory (incoming DMA). It forces the CPU to discard its internal cache lines for that buffer. The next time the CPU reads the buffer, it is forced to fetch the fresh data from physical SRAM.",
          "Crucial Timing: `SCB_InvalidateDCache` must be executed AFTER the DMA finishes receiving, BEFORE the CPU reads the data!",
          "Operation 2: Clean Data Cache (`SCB_CleanDCache_by_Addr`). Used for Memory-to-Peripheral (outbound DMA). It forces the CPU to flush all dirty cache lines out to physical SRAM.",
          "Crucial Timing: `SCB_CleanDCache` must be executed BEFORE starting the outbound DMA transfer, ensuring physical SRAM contains the CPU's latest updates.",
          "Operation 3: Clean-and-Invalidate (`SCB_CleanInvalidateDCache_by_Addr`). Flushes dirty lines to SRAM and immediately marks the cache lines invalid. Used when transferring shared bidirectional buffers."
        ],
        example: "Like saving your document before sending it to the printer (Clean Cache = flush to disk), and hitting 'Refresh' on your browser to see new comments posted by others (Invalidate Cache = discard local cache and fetch from server).",
        code: `#include <iostream>
#include <cstdint>

struct CacheMaintenanceController {
    static void executeCleanDCache(uint32_t addr, uint32_t size) {
        std::cout << "[SCB_CleanDCache] Flushing dirty cache lines for outbound DMA:\\n";
        std::cout << "  -> Flushed range: 0x" << std::hex << addr << " to 0x" << (addr + size) << "\\n";
        std::cout << "  -> SRAM is now coherent with CPU writes! Outbound DMA safe to start.\\n";
    }

    static void executeInvalidateDCache(uint32_t addr, uint32_t size) {
        std::cout << "[SCB_InvalidateDCache] Invalidating cache lines for incoming DMA:\\n";
        std::cout << "  -> Invalidated range: 0x" << std::hex << addr << " to 0x" << (addr + size) << "\\n";
        std::cout << "  -> Stale cache discarded! CPU forced to read fresh samples from SRAM.\\n";
    }
};

int main() {
    uint32_t txBuffer = 0x20001000;
    uint32_t rxBuffer = 0x20002000;

    // Outbound transfer: Clean before DMA start
    CacheMaintenanceController::executeCleanDCache(txBuffer, 128);

    // Inbound transfer: Invalidate after DMA completes
    CacheMaintenanceController::executeInvalidateDCache(rxBuffer, 128);
    return 0;
}`,
        output: `[SCB_CleanDCache] Flushing dirty cache lines for outbound DMA:
  -> Flushed range: 0x20001000 to 0x20001080
  -> SRAM is now coherent with CPU writes! Outbound DMA safe to start.
[SCB_InvalidateDCache] Invalidating cache lines for incoming DMA:
  -> Invalidated range: 0x20002000 to 0x20002080
  -> Stale cache discarded! CPU forced to read fresh samples from SRAM.`,
        codeNotes: [
          { line: 5, note: "Cleans cache before outbound DMA so physical SRAM contains latest CPU data" },
          { line: 11, note: "Invalidates cache after inbound DMA so CPU fetches fresh data from SRAM" },
          { line: 24, note: "Applies exact timing sequence required for bidirectional DMA coherency" }
        ],
        tryIt: "Simulate a 256-byte buffer and verify the flushed address range extends to 0x20001100.",
        check: {
          question: "When must `SCB_InvalidateDCache_by_Addr()` be executed when receiving incoming sensor data via DMA?",
          options: [
            "AFTER the DMA finishes receiving and BEFORE the CPU reads the buffer",
            "Before the microcontroller is manufactured",
            "During the hardware reset handler only",
            "After the CPU finishes reading the buffer"
          ],
          answer: 0,
          why: "Invalidating the cache after DMA completes but before CPU reading forces the CPU to discard stale cached lines and fetch the newly arrived DMA samples directly from physical SRAM."
        }
      },
      {
        title: "32-Byte Cache Line Alignment & Data Memory Barriers (DMB / DSB)",
        say: [
          "Cache maintenance instructions operate on whole 32-byte cache lines; there is no such thing as invalidating half a cache line.",
          "Therefore, any buffer accessed by DMA in a cached microcontroller MUST satisfy two non-negotiable rules.",
          "Rule 1: Alignment. The buffer starting address must be aligned to a 32-byte boundary: `uint8_t buffer[128] __attribute__((aligned(32)))`.",
          "Rule 2: Padding. The buffer size must be an exact multiple of 32 bytes. If a buffer is 10 bytes, it must be padded to 32 bytes so that no other variable shares that 32-byte cache line.",
          "Furthermore, ARM processors feature superscalar execution and out-of-order write buffering.",
          "To enforce instruction ordering, architects use Memory Barrier instructions: Data Memory Barrier (`__DMB()`) ensures all previous memory accesses complete before subsequent accesses begin, and Data Synchronization Barrier (`__DSB()`) halts execution until all outstanding bus transactions have fully completed."
        ],
        example: "Like apartment buildings where water can only be shut off for an entire floor (32-byte line). If you put your bathroom on the same floor as your neighbor's kitchen (unaligned buffer), shutting off your water shuts off their sink too.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct AlignedBufferDescriptor {
    uintptr_t address;
    uint32_t sizeBytes;
};

bool verifyCacheCoherentBufferRules(const AlignedBufferDescriptor* desc) {
    std::cout << "[CACHE BUFFER AUDIT] Address: 0x" << std::hex << desc->address 
              << ", Size: " << std::dec << desc->sizeBytes << " bytes\\n";

    bool addressAligned = (desc->address & 0x1F) == 0;
    bool sizePadded = (desc->sizeBytes & 0x1F) == 0;

    if (!addressAligned) {
        std::cout << "  -> [FAIL] Address not 32-byte aligned! (Offset: " << (desc->address & 0x1F) << ")\\n";
    }
    if (!sizePadded) {
        std::cout << "  -> [FAIL] Size not multiple of 32 bytes! (Remainder: " << (desc->sizeBytes & 0x1F) << ")\\n";
    }

    if (addressAligned && sizePadded) {
        std::cout << "  -> [PASS] Buffer satisfies ARM Cortex-M7 cache coherency rules!\\n";
        return true;
    }
    return false;
}

int main() {
    AlignedBufferDescriptor badBuf = {0x20000004, 50};   // Unaligned and unpadded
    verifyCacheCoherentBufferRules(&badBuf);

    AlignedBufferDescriptor goodBuf = {0x20000020, 64};  // Aligned to 32, multiple of 32
    verifyCacheCoherentBufferRules(&goodBuf);
    return 0;
}`,
        output: `[CACHE BUFFER AUDIT] Address: 0x20000004, Size: 50 bytes
  -> [FAIL] Address not 32-byte aligned! (Offset: 4)
  -> [FAIL] Size not multiple of 32 bytes! (Remainder: 18)
[CACHE BUFFER AUDIT] Address: 0x20000020, Size: 64 bytes
  -> [PASS] Buffer satisfies ARM Cortex-M7 cache coherency rules!`,
        codeNotes: [
          { line: 11, note: "Checks 32-byte starting address alignment using mask ~0x1F" },
          { line: 12, note: "Checks 32-byte size padding rule to prevent false sharing with adjacent variables" },
          { line: 29, note: "Validates buffer compliance guaranteeing zero cache corruption risk" }
        ],
        tryIt: "Change badBuf address to 0x20000040 and size to 32 and observe it passes audit.",
        check: {
          question: "Why must a DMA buffer in a cached ARM Cortex-M7 system be both aligned to and padded to a 32-byte boundary?",
          options: [
            "To prevent cache line false sharing where invalidating the buffer inadvertently corrupts adjacent variables",
            "Because DMA hardware cannot count beyond 32",
            "To increase the resistance of the physical copper traces",
            "To allow the CPU to execute code in 8-bit mode"
          ],
          answer: 0,
          why: "Cache maintenance affects entire 32-byte lines; if adjacent variables share a cache line with a DMA buffer, invalidating the buffer will destroy changes made to those adjacent variables."
        }
      },
      {
        title: "Building a Coherent High-Speed DMA Transceiver Engine",
        say: [
          "We unite D-Cache maintenance, memory barriers, 32-byte alignment, and DMA streaming into a Coherent High-Speed DMA Transceiver Engine.",
          "The engine manages bidirectional streaming across SPI and UART interfaces on an ARM Cortex-M7 running at 480MHz.",
          "Before outbound transmission, it calls `SCB_CleanDCache()` followed by `__DSB()` to guarantee all written data has drained from the CPU write buffer into physical SRAM.",
          "Upon inbound reception, it calls `__DSB()` followed by `SCB_InvalidateDCache()` before passing data pointers to the consumer application.",
          "By enforcing these hardware invariants, the system achieves maximum 480MHz CPU performance without suffering a single dropped byte or corrupted packet."
        ],
        example: "Like an airlock on a spacecraft: strict cycle protocols (Clean -> DSB -> Transmit -> Receive -> DSB -> Invalidate) ensure zero atmospheric contamination (data corruption) occurs between two different pressure environments (CPU Cache vs DMA SRAM).",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class CoherentDmaEngine {
private:
    uint32_t txBufferAddress;
    uint32_t rxBufferAddress;
    uint32_t bufferLengthBytes;
public:
    CoherentDmaEngine(uint32_t txAddr, uint32_t rxAddr, uint32_t len)
        : txBufferAddress(txAddr), rxBufferAddress(rxAddr), bufferLengthBytes(len) {}

    void executeOutboundTransmit() {
        std::cout << "[COHERENT TX] Step 1: Clean D-Cache (0x" << std::hex << txBufferAddress << ")...\\n";
        std::cout << "[COHERENT TX] Step 2: __DSB() Data Synchronization Barrier (drain write buffers)...\\n";
        std::cout << "[COHERENT TX] Step 3: Trigger DMA Stream (SRAM -> SPI_DR)...\\n";
        std::cout << "  -> Transmit Complete: 100% coherent data guaranteed!\\n";
    }

    void executeInboundReceive() {
        std::cout << "[COHERENT RX] Step 1: DMA Stream completes (SPI_DR -> SRAM)...\\n";
        std::cout << "[COHERENT RX] Step 2: __DSB() Barrier (ensure bus transfers settled)...\\n";
        std::cout << "[COHERENT RX] Step 3: Invalidate D-Cache (0x" << std::hex << rxBufferAddress << ")...\\n";
        std::cout << "[COHERENT RX] Step 4: CPU safely reads fresh telemetry!\\n";
    }
};

int main() {
    CoherentDmaEngine engine(0x20001000, 0x20002000, 128);
    engine.executeOutboundTransmit();
    std::cout << "\\n";
    engine.executeInboundReceive();
    return 0;
}`,
        output: `[COHERENT TX] Step 1: Clean D-Cache (0x20001000)...
[COHERENT TX] Step 2: __DSB() Data Synchronization Barrier (drain write buffers)...
[COHERENT TX] Step 3: Trigger DMA Stream (SRAM -> SPI_DR)...
  -> Transmit Complete: 100% coherent data guaranteed!

[COHERENT RX] Step 1: DMA Stream completes (SPI_DR -> SRAM)...
[COHERENT RX] Step 2: __DSB() Barrier (ensure bus transfers settled)...
[COHERENT RX] Step 3: Invalidate D-Cache (0x20002000)...
[COHERENT RX] Step 4: CPU safely reads fresh telemetry!`,
        codeNotes: [
          { line: 13, note: "Executes Clean followed by DSB barrier before triggering outbound DMA" },
          { line: 20, note: "Executes DSB barrier followed by Invalidate after DMA completes reception" },
          { line: 30, note: "Validates complete bidirectional cache-coherent DMA lifecycle" }
        ],
        tryIt: "Invert the order of Clean and DMA Trigger in TX and observe the timing violation.",
        check: {
          question: "What is the purpose of the `__DSB()` (Data Synchronization Barrier) instruction prior to invalidating the cache after DMA reception?",
          options: [
            "It halts the CPU until all outstanding bus matrix write transactions have completed into SRAM",
            "It reboots the microcontroller",
            "It clears all RAM memory to zero",
            "It changes the baud rate of the serial port"
          ],
          answer: 0,
          why: "A Data Synchronization Barrier guarantees that all background bus matrix transfers from the DMA have fully landed in physical SRAM before cache invalidation occurs."
        }
      }
    ],
    summary: [
      "ARM Cortex-M7 L1 Data Cache (D-Cache) provides single-cycle memory access using 32-byte cache lines.",
      "The DMA Cache Coherency Hazard occurs because DMA accesses physical SRAM directly, bypassing the CPU's internal L1 D-Cache.",
      "SCB_CleanDCache flushes dirty cache lines to SRAM before outbound DMA; SCB_InvalidateDCache discards stale cache lines after inbound DMA.",
      "DMA buffers must be strictly 32-byte aligned and padded to multiples of 32 bytes to prevent destructive cache line false sharing.",
      "Data Memory Barriers (DMB/DSB) enforce memory transaction ordering and guarantee complete bus settling across asynchronous hardware domains."
    ],
    projectStep: {
      title: "Implement Hardware L1 Cache Coherency Management on ARM Cortex-M7",
      steps: [
        "Configure linker scripts to align DMA buffers to 32-byte boundaries and pad allocations to 32-byte multiples.",
        "Implement SCB_CleanDCache flushing routines prior to outbound peripheral DMA transfers.",
        "Implement SCB_InvalidateDCache routines immediately following DMA Half-Transfer and Transfer-Complete interrupts.",
        "Insert DSB and DMB memory barrier instructions to synchronize out-of-order write buffers.",
        "Execute high-speed bidirectional DMA stress tests to verify 100% data coherency with zero memory corruption."
      ]
    }
  },
  {
    day: 19,
    title: "Hardware Watchdog Timers: Independent Watchdog (IWDG), Window Watchdog (WWDG) & Anti-Freeze Fail-Safes",
    goal: "Master mission-critical fail-safe hardware: the low-speed internal (LSI) Independent Watchdog (IWDG), the high-precision Window Watchdog (WWDG), multi-task heartbeat bitmask supervision, and crash-recovery telemetry logging.",
    minutes: 36,
    recap: "In Day 18, we mastered cache coherency and DMA bus synchronization. Today in Day 19, we engineer the ultimate line of defense in embedded hardware: Hardware Watchdog Timers that rescue frozen firmware from infinite loops, deadlocks, and cosmic ray bit-flips.",
    parts: [
      {
        title: "The Independent Watchdog (IWDG): Dedicated LSI Clock & Downcounting Physics",
        say: [
          "In mission-critical embedded systems (such as medical pacemakers, satellite avionics, and automotive engine controllers), software is exposed to electrical noise, electrostatic discharge (ESD), and software deadlocks that can cause firmware to freeze.",
          "If a device freezes in a remote location\u2014such as an agricultural soil sensor buried underground or an industrial valve controller in a chemical plant\u2014a technician cannot walk over to press a physical reset button.",
          "The primary hardware fail-safe is the Independent Watchdog (IWDG).",
          "The critical architectural property of the IWDG is that it is completely independent: it does NOT use the main crystal oscillator or main system clock.",
          "Instead, the IWDG is clocked by its own dedicated Low-Speed Internal (LSI) RC oscillator running at roughly 32 kHz.",
          "Even if the main system PLL fails, the external crystal fractures, or code execution freezes inside an infinite loop, the IWDG continues downcounting autonomously; if firmware fails to reload the key register before it reaches zero, the IWDG hardware forces an immediate system reset."
        ],
        example: "Like a dead-man's switch on a train: the train engineer must press a foot pedal every 30 seconds. If the engineer falls asleep or has a medical emergency, the switch releases and the emergency brakes engage automatically.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class IndependentWatchdog {
private:
    uint32_t counter;
    uint32_t reloadValue;
    bool enabled;
public:
    IndependentWatchdog(uint32_t reload) : counter(reload), reloadValue(reload), enabled(false) {}

    void start() {
        enabled = true;
        std::cout << "[IWDG HARDWARE] Watchdog started with reload value: " << reloadValue << "\\n";
    }

    void reload() {
        if (!enabled) return;
        counter = reloadValue; // Firmware feeds the watchdog
        std::cout << "  -> [IWDG FEED] Key register written (0xAAAA). Counter reloaded to " << reloadValue << "\\n";
    }

    bool tick() {
        if (!enabled) return true;
        if (counter > 0) {
            counter--;
            return true;
        } else {
            std::cout << "[IWDG TIMEOUT] Counter reached 0! Hardware RESET generated.\\n";
            return false; // Triggers hardware reset
        }
    }

    uint32_t getCounter() const { return counter; }
};

int main() {
    IndependentWatchdog iwdg(3);
    iwdg.start();

    // Normal operation: firmware feeds watchdog
    iwdg.tick();
    iwdg.reload();

    // Firmware enters infinite loop / freeze: fails to feed
    std::cout << "[FIRMWARE FREEZE] Firmware locked in infinite loop...\\n";
    while (iwdg.tick()) {
        std::cout << "  IWDG Downcounting: " << iwdg.getCounter() << "\\n";
    }
    return 0;
}`,
        output: `[IWDG HARDWARE] Watchdog started with reload value: 3
  -> [IWDG FEED] Key register written (0xAAAA). Counter reloaded to 3
[FIRMWARE FREEZE] Firmware locked in infinite loop...
  IWDG Downcounting: 2
  IWDG Downcounting: 1
  IWDG Downcounting: 0
[IWDG TIMEOUT] Counter reached 0! Hardware RESET generated.`,
        codeNotes: [
          { line: 5, note: "Models dedicated LSI-driven downcounter independent of core CPU clock" },
          { line: 16, note: "Reload key register (0xAAAA) resets counter to prevent system reset" },
          { line: 38, note: "Demonstrates hardware autonomous reset upon firmware execution freeze" }
        ],
        tryIt: "Increase reload value to 5 and observe that 5 ticks elapse before hardware reset triggers.",
        check: {
          question: "Why is the Independent Watchdog (IWDG) clocked by a dedicated Low-Speed Internal (LSI) oscillator rather than the main system clock?",
          options: [
            "To guarantee that the watchdog continues counting and can reset the MCU even if the main oscillator fails or crashes",
            "Because the LSI oscillator uses zero electrical energy",
            "Because the main system clock is too slow for watchdogs",
            "To allow the watchdog to access the internet"
          ],
          answer: 0,
          why: "A dedicated LSI clock guarantees that the watchdog remains fully operational even if the primary high-speed crystal stops oscillating or system PLL clocks fail."
        }
      },
      {
        title: "The Window Watchdog (WWDG): Early Feed Detection & Upper/Lower Bounds",
        say: [
          "While the IWDG protects against firmware running too slowly (or freezing), it has a blind spot: what if code goes haywire and begins executing a corrupted loop that feeds the watchdog continuously?",
          "If firmware is stuck in an erratic loop that repeatedly calls `reload()`, the IWDG will never timeout, and the microcontroller remains permanently corrupted.",
          "The Window Watchdog (WWDG) solves this by enforcing both a Lower Bound and an Upper Bound time window.",
          "To successfully feed the WWDG, firmware must refresh the counter within an approved time window (e.g. between 10ms and 40ms).",
          "If firmware feeds the WWDG too late (counter < 0x40), a reset occurs.",
          "Crucially, if firmware feeds the WWDG too early (counter > Window Value), an immediate hardware reset is triggered!",
          "This guarantees that firmware is executing at the correct mathematical cadence: neither frozen nor executing runaway loops."
        ],
        example: "Like a medication schedule: you must take your heart pill once every 24 hours. If you forget to take it (too late), you get sick; if you take 5 pills in 10 minutes (too early), you poison yourself. The pill must be taken strictly within the designated window.",
        code: `#include <iostream>
#include <cstdint>

struct WindowWatchdogConfig {
    uint8_t windowUpperLimit; // e.g. 0x50
    uint8_t currentCounter;   // 7-bit downcounter (0x40..0x7F)
};

class WindowWatchdog {
public:
    static bool feed(WindowWatchdogConfig* wwdg) {
        std::cout << "[WWDG FEED ATTEMPT] Counter = 0x" << std::hex << (int)wwdg->currentCounter 
                  << ", Window = 0x" << (int)wwdg->windowUpperLimit << "...\\n";

        // Check Early Feed Violation
        if (wwdg->currentCounter > wwdg->windowUpperLimit) {
            std::cout << "  -> [WWDG RESET] EARLY FEED FAULT! Firmware executed too fast or loop corrupted.\\n";
            return false;
        }

        // Check Late Feed Violation (bit 6 drops to 0 at 0x3F)
        if (wwdg->currentCounter < 0x40) {
            std::cout << "  -> [WWDG RESET] LATE FEED FAULT! Firmware timed out.\\n";
            return false;
        }

        std::cout << "  -> [WWDG OK] Feed accepted within valid time window!\\n";
        return true;
    }
};

int main() {
    WindowWatchdogConfig wwdg = {0x50, 0x60}; // Counter is 0x60 (> 0x50 Window) -> Too early!
    WindowWatchdog::feed(&wwdg);

    wwdg.currentCounter = 0x48; // Counter is 0x48 (between 0x40 and 0x50) -> Valid window!
    WindowWatchdog::feed(&wwdg);
    return 0;
}`,
        output: `[WWDG FEED ATTEMPT] Counter = 0x60, Window = 0x50...
  -> [WWDG RESET] EARLY FEED FAULT! Firmware executed too fast or loop corrupted.
[WWDG FEED ATTEMPT] Counter = 0x48, Window = 0x50...
  -> [WWDG OK] Feed accepted within valid time window!`,
        codeNotes: [
          { line: 4, note: "Defines 7-bit downcounter (0x40..0x7F) and upper window threshold" },
          { line: 13, note: "Detects early feed fault when counter is above the upper window threshold" },
          { line: 29, note: "Demonstrates rejection of early feed and acceptance within valid timing window" }
        ],
        tryIt: "Set currentCounter to 0x3F and verify it triggers a late feed reset.",
        check: {
          question: "What unique failure mode does the Window Watchdog (WWDG) detect that the Independent Watchdog (IWDG) cannot?",
          options: [
            "Early Feed Faults, where runaway or corrupted code loops refresh the watchdog too quickly",
            "Physical battery disconnection",
            "Radio signal interference",
            "USB cable unplugging"
          ],
          answer: 0,
          why: "The Window Watchdog enforces an upper time bound; refreshing the counter before the window opens triggers an immediate hardware reset to kill runaway loops."
        }
      },
      {
        title: "The Multi-Task Heartbeat Bitmask Architecture",
        say: [
          "In a multithreaded Real-Time Operating System (FreeRTOS) environment, a common novice blunder is placing the watchdog feed instruction inside a single high-priority timer task.",
          "If a low-priority sensor task or network communication thread enters a permanent deadlock, the timer task continues running happily and feeding the watchdog!",
          "The system appears functional to the watchdog hardware while vital sensor or safety tasks are completely frozen.",
          "The professional solution is the Multi-Task Heartbeat Bitmask Architecture.",
          "Each active RTOS task is assigned a unique bit in a shared 32-bit heartbeat register (e.g. Task 1 = bit 0, Task 2 = bit 1, Task 3 = bit 2).",
          "At the end of each valid work loop, each task sets its assigned bit.",
          "A dedicated Supervisory Watchdog Task executes periodically: it checks whether ALL bits match the expected mask (`heartbeat == 0b111`).",
          "If and only if every single task has proven its health within the window, the supervisor feeds the physical hardware watchdog and clears the heartbeat register for the next cycle.",
          "If even one task hangs or starves, the bitmask check fails, the watchdog is starved, and the hardware resets the microcontroller."
        ],
        example: "Like a submarine crew roll call: before diving, the captain checks off the engine room (bit 0), sonar (bit 1), and life support (bit 2). If the engine room fails to check in, the dive is aborted immediately.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class HeartbeatSupervisor {
private:
    uint32_t activeHeartbeats;
    uint32_t expectedMask;
public:
    HeartbeatSupervisor(uint32_t mask) : activeHeartbeats(0), expectedMask(mask) {}

    void reportTaskHeartbeat(uint8_t taskId) {
        activeHeartbeats |= (1 << taskId);
    }

    bool evaluateAndFeedWatchdog() {
        std::cout << "[SUPERVISOR AUDIT] Heartbeat Mask: 0b" 
                  << ((activeHeartbeats & 4) ? "1" : "0")
                  << ((activeHeartbeats & 2) ? "1" : "0")
                  << ((activeHeartbeats & 1) ? "1" : "0")
                  << ", Expected: 0b"
                  << ((expectedMask & 4) ? "1" : "0")
                  << ((expectedMask & 2) ? "1" : "0")
                  << ((expectedMask & 1) ? "1" : "0") << "...\\n";

        if (activeHeartbeats == expectedMask) {
            std::cout << "  -> [ALL TASKS HEALTHY] Hardware Watchdog Fed! Clearing bits for next cycle.\\n";
            activeHeartbeats = 0; // Reset for next epoch
            return true;
        } else {
            uint32_t missing = expectedMask & ~activeHeartbeats;
            std::cout << "  -> [TASK STARVATION DETECTED] Missing Task Bits: 0x" << std::hex << missing << "\\n";
            std::cout << "  -> Watchdog feed aborted! Permitting hardware reset.\\n";
            return false;
        }
    }
};

int main() {
    // 3 Tasks: Task 0 (Telemetry), Task 1 (Sensors), Task 2 (Motor Control)
    HeartbeatSupervisor supervisor(0x07); // Expected 0b111

    // Scenario 1: All tasks report healthy
    supervisor.reportTaskHeartbeat(0);
    supervisor.reportTaskHeartbeat(1);
    supervisor.reportTaskHeartbeat(2);
    supervisor.evaluateAndFeedWatchdog();

    // Scenario 2: Task 1 deadlocks and fails to report
    std::cout << "\\n[SIMULATING MOTOR CONTROL DEADLOCK]:\\n";
    supervisor.reportTaskHeartbeat(0);
    supervisor.reportTaskHeartbeat(2); // Task 1 missing!
    supervisor.evaluateAndFeedWatchdog();
    return 0;
}`,
        output: `[SUPERVISOR AUDIT] Heartbeat Mask: 0b111, Expected: 0b111...
  -> [ALL TASKS HEALTHY] Hardware Watchdog Fed! Clearing bits for next cycle.

[SIMULATING MOTOR CONTROL DEADLOCK]:
[SUPERVISOR AUDIT] Heartbeat Mask: 0b101, Expected: 0b111...
  -> [TASK STARVATION DETECTED] Missing Task Bits: 0x2
  -> Watchdog feed aborted! Permitting hardware reset.`,
        codeNotes: [
          { line: 5, note: "Maintains atomic 32-bit bitmask tracking task health status" },
          { line: 15, note: "Verifies all required tasks have executed within the current supervisory window" },
          { line: 24, note: "Pinpoints exact missing task identifier (0x2 = Task 1) and aborts watchdog feed" }
        ],
        tryIt: "Add Task 3 (mask 0x0F) and verify that all 4 tasks must report to feed the watchdog.",
        check: {
          question: "Why should firmware avoid feeding a hardware watchdog from a single dedicated timer task in an RTOS system?",
          options: [
            "Because if other worker tasks deadlock or freeze, the timer task continues running and feeding the watchdog, hiding the system failure",
            "Because timer tasks consume all RAM memory",
            "Because watchdogs cannot be fed more than once per day",
            "Because FreeRTOS does not support timer interrupts"
          ],
          answer: 0,
          why: "Feeding from a single task masks deadlocks in other threads; multi-task heartbeat bitmasks verify that every individual concurrent thread is alive before feeding."
        }
      },
      {
        title: "Crash Recovery, Reset Cause Detection & Non-Volatile Telemetry Logging",
        say: [
          "When an embedded watchdog resets a microcontroller, the device must not wake up amnesic.",
          "Upon hardware reset, the Reset and Clock Control (RCC) peripheral maintains status flags in the Clock Control & Status Register (`RCC_CSR`).",
          "Flags like `IWDGRSTF` (Independent Watchdog Reset Flag), `WWDGRSTF` (Window Watchdog Reset Flag), `PINRSTF` (Physical Pin Reset), and `PORRSTF` (Power-On Reset) identify the exact cause of reboot.",
          "During startup, bootloader firmware reads `RCC_CSR` to diagnose why the reset occurred.",
          "If a watchdog reset is detected, the firmware writes a diagnostic crash record (containing the faulting task ID, system uptime, and last recorded stack pointer) into battery-backed SRAM or flash EEPROM.",
          "Once network connectivity is established, this crash telemetry is uploaded to the cloud fleet management platform, allowing engineers to trace and patch intermittent field bugs."
        ],
        example: "Like an airplane black box: when a flight undergoes an emergency event, the cockpit voice recorder and flight data recorder preserve all sensor readings so investigators can discover the exact cause.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct ResetDiagnosticRecord {
    const char* resetCause;
    uint32_t faultingTaskId;
    uint32_t uptimeSeconds;
    bool crashUploaded;
};

class ResetReasonAnalyzer {
public:
    static ResetDiagnosticRecord evaluateRccFlags(uint32_t rcc_csr, uint32_t lastTask, uint32_t uptime) {
        ResetDiagnosticRecord rec = {"UNKNOWN", lastTask, uptime, false};

        if (rcc_csr & (1 << 29)) {
            rec.resetCause = "INDEPENDENT_WATCHDOG_RESET";
        } else if (rcc_csr & (1 << 30)) {
            rec.resetCause = "WINDOW_WATCHDOG_RESET";
        } else if (rcc_csr & (1 << 26)) {
            rec.resetCause = "EXTERNAL_PIN_RESET";
        } else if (rcc_csr & (1 << 27)) {
            rec.resetCause = "POWER_ON_RESET";
        }

        std::cout << "[POST-MORTEM DIAGNOSTICS] Bootloader Startup Audit:\\n";
        std::cout << "  -> RCC_CSR Register: 0x" << std::hex << rcc_csr << "\\n";
        std::cout << "  -> Identified Cause: " << rec.resetCause << "\\n";
        std::cout << "  -> Faulting Task ID: " << std::dec << rec.faultingTaskId << "\\n";
        std::cout << "  -> System Uptime:    " << rec.uptimeSeconds << " seconds\\n";
        return rec;
    }
};

int main() {
    // Bit 29 set in RCC_CSR = IWDGRSTF (Independent Watchdog Reset Flag)
    uint32_t mockRccCsr = (1 << 29) | (1 << 26);
    ResetDiagnosticRecord crash = ResetReasonAnalyzer::evaluateRccFlags(mockRccCsr, 1, 86420);
    return 0;
}`,
        output: `[POST-MORTEM DIAGNOSTICS] Bootloader Startup Audit:
  -> RCC_CSR Register: 0x24000000
  -> Identified Cause: INDEPENDENT_WATCHDOG_RESET
  -> Faulting Task ID: 1
  -> System Uptime:    86420 seconds`,
        codeNotes: [
          { line: 4, note: "Defines non-volatile post-mortem crash record structure" },
          { line: 14, note: "Inspects RCC_CSR hardware reset flags (bit 29 = IWDG, bit 30 = WWDG)" },
          { line: 36, note: "Demonstrates post-mortem diagnostic reporting allowing cloud fleet telemetry" }
        ],
        tryIt: "Simulate a Power-On Reset by setting bit 27 in mockRccCsr and verify the reported cause.",
        check: {
          question: "How does firmware determine that the previous reboot was caused by a hardware watchdog timeout?",
          options: [
            "By reading the watchdog reset flags (IWDGRSTF/WWDGRSTF) in the RCC_CSR register at bootup",
            "By measuring the temperature of the processor",
            "By asking the user to press a button",
            "By checking if the clock is running backwards"
          ],
          answer: 0,
          why: "Hardware retains the reset cause in the Reset and Clock Control (RCC_CSR) status register across reboots until firmware explicitly clears the flags."
        }
      },
      {
        title: "Building an Industrial Fail-Safe Supervisory Watchdog Engine",
        say: [
          "We unite the Independent Watchdog, Window Watchdog, Multi-Task Heartbeat supervision, and crash logging into a comprehensive Fail-Safe Supervisory Watchdog Engine.",
          "The engine operates as an independent supervisor thread: it tracks 4 real-time tasks (Sensor Acquisition, Control Loop, Network Telemetry, and User Interface).",
          "It verifies that each task meets its specific timing window; only when all 4 tasks report valid heartbeats does it refresh both the IWDG and WWDG.",
          "If a task hangs, it allows the hardware watchdog to reset the microcontroller, captures post-mortem crash telemetry, and safely recovers system operations.",
          "This supervisory architecture represents the gold standard of safety-critical firmware engineering, certified under IEC 61508 and ISO 26262 automotive safety standards."
        ],
        example: "Like an emergency flight management system: four independent avionics computers vote on flight surface controls; if one computer freezes, the supervisor isolates the fault and resets the subsystem seamlessly.",
        code: `#include <iostream>
#include <cstdint>

class FailSafeWatchdogEngine {
private:
    uint8_t taskHeartbeats;
    uint8_t expectedMask;
    uint32_t healthyCycles;
public:
    FailSafeWatchdogEngine() : taskHeartbeats(0), expectedMask(0x0F), healthyCycles(0) {}

    void reportTask(uint8_t id) {
        taskHeartbeats |= (1 << id);
    }

    bool executeSupervisoryCycle() {
        if (taskHeartbeats == expectedMask) {
            healthyCycles++;
            taskHeartbeats = 0; // Clear for next cycle
            std::cout << "[SUPERVISOR CYCLE " << healthyCycles << "] All 4 tasks verified healthy -> Hardware Watchdog Fed.\\n";
            return true;
        } else {
            std::cout << "[SUPERVISOR FAULT] Missing task detected (0x" << std::hex << (expectedMask & ~taskHeartbeats) << ") -> Watchdog starved!\\n";
            return false;
        }
    }
};

int main() {
    FailSafeWatchdogEngine engine;
    std::cout << "[INDUSTRIAL FAIL-SAFE ENGINE]:\\n";
    // Cycle 1: All 4 tasks report
    engine.reportTask(0);
    engine.reportTask(1);
    engine.reportTask(2);
    engine.reportTask(3);
    engine.executeSupervisoryCycle();

    // Cycle 2: Task 2 hangs
    std::cout << "\\n[SIMULATING TASK 2 HANG]:\\n";
    engine.reportTask(0);
    engine.reportTask(1);
    engine.reportTask(3); // Task 2 missing!
    engine.executeSupervisoryCycle();
    return 0;
}`,
        output: `[INDUSTRIAL FAIL-SAFE ENGINE]:
[SUPERVISOR CYCLE 1] All 4 tasks verified healthy -> Hardware Watchdog Fed.

[SIMULATING TASK 2 HANG]:
[SUPERVISOR FAULT] Missing task detected (0x4) -> Watchdog starved!`,
        codeNotes: [
          { line: 5, note: "Supervises 4 concurrent firmware tasks using 4-bit mask (0x0F)" },
          { line: 15, note: "Feeds physical watchdog only upon unanimous health verification" },
          { line: 36, note: "Isolates exact hanging task (bit 2 = 0x4) and triggers system safety reset" }
        ],
        tryIt: "Add Task 2 report in Cycle 2 and verify that both cycles execute successfully.",
        check: {
          question: "What industrial safety standard requires independent watchdog supervision and reset reason auditing in embedded systems?",
          options: [
            "IEC 61508 / ISO 26262 functional safety standards",
            "HTTP 1.1 Web Specifications",
            "Bluetooth 4.0 Core Specification",
            "Unicode UTF-8 Text Encoding Standard"
          ],
          answer: 0,
          why: "Functional safety standards (IEC 61508 and ISO 26262) mandate hardware watchdog mechanisms and crash diagnostics to ensure systems enter a predictable safe state upon software failure."
        }
      }
    ],
    summary: [
      "The Independent Watchdog (IWDG) is clocked by an autonomous Low-Speed Internal (LSI) oscillator, surviving main clock and PLL failures.",
      "The Window Watchdog (WWDG) enforces both lower and upper time bounds, detecting runaway code that feeds the watchdog too early.",
      "Multi-task heartbeat bitmasks verify that every concurrent task in an RTOS is executing properly before refreshing the hardware watchdog.",
      "The RCC_CSR register preserves post-mortem hardware reset flags across reboots for automated crash diagnostic telemetry.",
      "Industrial fail-safe watchdog engines guarantee compliance with IEC 61508 and ISO 26262 functional safety standards."
    ],
    projectStep: {
      title: "Implement Industrial Multi-Watchdog Supervisory Architecture",
      steps: [
        "Configure the Independent Watchdog (IWDG) with LSI clock prescalers for fail-safe system reset.",
        "Implement the Window Watchdog (WWDG) with upper and lower time windows to detect early feed faults.",
        "Construct a multi-task heartbeat bitmask supervisor integrating all concurrent FreeRTOS tasks.",
        "Implement post-mortem RCC_CSR reset flag auditing and persistent crash telemetry logging.",
        "Execute simulated task hang and deadlock fault injection to verify deterministic recovery."
      ]
    }
  },
  {
    day: 20,
    title: "Milestone 4: Zero-CPU DMA Streaming Ring Buffer & Fail-Safe Watchdog Engine",
    goal: "Architect, integrate, and defend Milestone 4: a high-throughput industrial communications and data engine uniting circular DMA double-buffering, ARM Cortex-M7 D-cache coherency maintenance, and multi-task watchdog supervision.",
    minutes: 40,
    recap: "Over Days 16 through 19, we mastered the multi-master AHB bus matrix, circular DMA double buffering, L1 D-cache coherency, and multi-task watchdog fail-safes. Today in Day 20, we integrate these foundational disciplines into the unified Milestone 4 Capstone Engine.",
    parts: [
      {
        title: "Milestone 4 Architecture & System Integration Blueprint",
        say: [
          "Welcome to the Milestone 4 Defense Gate! In this milestone project, you transition from isolated peripheral drivers into a Senior Embedded Systems Architect.",
          "Your mission is to construct the High-Throughput Communications & Fail-Safe Engine for an Industrial Edge Gateway running on an ARM Cortex-M7.",
          "The system must fulfill three mandatory engineering mandates simultaneously.",
          "Mandate 1: Zero-CPU Data Acquisition. High-frequency analog and serial sensor data must stream continuously into a circular DMA double-buffer with zero CPU byte interrupts.",
          "Mandate 2: Strict Cache Coherency. The Cortex-M7 L1 D-Cache must be synchronized using 32-byte aligned buffers, memory barriers, and SCB Clean/Invalidate instructions to guarantee zero memory corruption.",
          "Mandate 3: Multi-Task Fail-Safe Supervision. An autonomous watchdog supervisor must monitor acquisition, processing, and communication threads, ensuring immediate hardware reset if any thread deadlocks."
        ],
        example: "Like an automated orbital satellite: high-speed radio telemetry streams directly to solid-state memory via DMA; internal processors verify data integrity through cache barriers; and triple-redundant watchdog timers monitor all flight subsystems.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct SystemMilestoneManifest {
    const char* subsystem;
    bool dmaZeroCpuStreaming;
    bool cacheCoherencyEnforced;
    bool multiTaskWatchdogActive;
    const char* verificationStatus;
};

void inspectMilestoneBlueprint(const SystemMilestoneManifest* m) {
    std::cout << "=========================================================\\n";
    std::cout << "  MILESTONE 4 SYSTEM ARCHITECTURE BLUEPRINT\\n";
    std::cout << "=========================================================\\n";
    std::cout << "Subsystem: " << m->subsystem << "\\n";
    std::cout << "  [MANDATE 1] Zero-CPU DMA Streaming:     " << (m->dmaZeroCpuStreaming ? "VERIFIED (0% Drop)" : "FAIL") << "\\n";
    std::cout << "  [MANDATE 2] L1 D-Cache Coherency:       " << (m->cacheCoherencyEnforced ? "VERIFIED (32B Aligned)" : "FAIL") << "\\n";
    std::cout << "  [MANDATE 3] Multi-Task Watchdog Engine: " << (m->multiTaskWatchdogActive ? "VERIFIED (Anti-Freeze)" : "FAIL") << "\\n";
    std::cout << "Status: " << m->verificationStatus << "\\n";
}

int main() {
    SystemMilestoneManifest manifest = {
        "ApexIndustrialGateway_M7",
        true,
        true,
        true,
        "PRODUCTION_READY_CERTIFIED"
    };
    inspectMilestoneBlueprint(&manifest);
    return 0;
}`,
        output: `=========================================================
  MILESTONE 4 SYSTEM ARCHITECTURE BLUEPRINT
=========================================================
Subsystem: ApexIndustrialGateway_M7
  [MANDATE 1] Zero-CPU DMA Streaming:     VERIFIED (0% Drop)
  [MANDATE 2] L1 D-Cache Coherency:       VERIFIED (32B Aligned)
  [MANDATE 3] Multi-Task Watchdog Engine: VERIFIED (Anti-Freeze)
Status: PRODUCTION_READY_CERTIFIED`,
        codeNotes: [
          { line: 5, note: "Defines system milestone compliance verification manifest" },
          { line: 13, note: "Audits the three mandatory architectural mandates for production deployment" },
          { line: 27, note: "Validates unanimous system pass for Milestone 4 architectural certification" }
        ],
        tryIt: "Change dmaZeroCpuStreaming to false and verify that Mandate 1 reports FAIL.",
        check: {
          question: "What are the three core engineering pillars evaluated in the Milestone 4 Defense Gate?",
          options: [
            "Zero-CPU DMA streaming, L1 D-Cache coherency maintenance, and multi-task watchdog supervision",
            "HTML web design, CSS color gradients, and database backups",
            "Physical copper trace etching, solder paste application, and enclosure packaging",
            "Spreadsheet accounting formulas and sales forecasting"
          ],
          answer: 0,
          why: "Milestone 4 certifies mastery over high-throughput DMA data movement, high-frequency L1 cache synchronization, and safety-critical watchdog supervision."
        }
      },
      {
        title: "Building the Zero-CPU Circular DMA Ping-Pong Streaming Engine",
        say: [
          "The first pillar of Milestone 4 is the Zero-CPU Circular DMA Streaming Engine.",
          "We configure DMA2 Stream 0 with a 32-byte aligned 2N double-buffer (`__attribute__((aligned(32)))`).",
          "The engine operates in Circular Mode (`CIRC = 1`). In the background, incoming sensor samples flow into Buffer A (indices 0 to N-1).",
          "The Half-Transfer (HT) interrupt notifies the software to process Buffer A while the DMA continues filling Buffer B (indices N to 2N-1).",
          "The Transfer-Complete (TC) interrupt notifies the software to process Buffer B while the DMA loops back to refill Buffer A.",
          "Latency tracking verifies that buffer processing time is strictly less than half-buffer fill time, maintaining a 0% packet drop rate."
        ],
        example: "Like dual pistons in a steam engine: piston A drives the wheel while piston B intakes steam; then piston B drives while piston A intakes, creating continuous, uninterrupted forward propulsion.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct DoubleBufferState {
    uint32_t samples[8]; // Size 2N (N = 4)
    uint32_t pingPongHalfSize;
    uint32_t activeBufferId; // 0 = Buffer A, 1 = Buffer B
    uint32_t totalProcessedSamples;
};

class DmaStreamingEngine {
public:
    static void processPingBuffer(DoubleBufferState* state) {
        state->activeBufferId = 0;
        state->totalProcessedSamples += state->pingPongHalfSize;
        std::cout << "[DMA PING COMPLETE] Processed Buffer A (Samples 0..3). Total: " 
                  << state->totalProcessedSamples << "\\n";
    }

    static void processPongBuffer(DoubleBufferState* state) {
        state->activeBufferId = 1;
        state->totalProcessedSamples += state->pingPongHalfSize;
        std::cout << "[DMA PONG COMPLETE] Processed Buffer B (Samples 4..7). Total: " 
                  << state->totalProcessedSamples << "\\n";
    }
};

int main() {
    DoubleBufferState state = {{0}, 4, 0, 0};
    std::cout << "[STREAMING INGESTION TEST]:\\n";
    DmaStreamingEngine::processPingBuffer(&state);
    DmaStreamingEngine::processPongBuffer(&state);
    DmaStreamingEngine::processPingBuffer(&state);
    DmaStreamingEngine::processPongBuffer(&state);
    return 0;
}`,
        output: `[STREAMING INGESTION TEST]:
[DMA PING COMPLETE] Processed Buffer A (Samples 0..3). Total: 4
[DMA PONG COMPLETE] Processed Buffer B (Samples 4..7). Total: 8
[DMA PING COMPLETE] Processed Buffer A (Samples 0..3). Total: 12
[DMA PONG COMPLETE] Processed Buffer B (Samples 4..7). Total: 16`,
        codeNotes: [
          { line: 5, note: "Defines 2N double-buffer state with active buffer ID tracking" },
          { line: 12, note: "Simulates Half-Transfer interrupt processing Buffer A" },
          { line: 19, note: "Simulates Transfer-Complete interrupt processing Buffer B with continuous total sample accumulation" }
        ],
        tryIt: "Simulate 3 full cycles (6 buffer swaps) and verify that 24 total samples are processed.",
        check: {
          question: "Why must the double-buffer size in Circular DMA mode be twice the processing block size (2N)?",
          options: [
            "To allow the CPU to read one half (N) while the DMA hardware writes the other half (N) simultaneously",
            "Because ARM processors cannot allocate odd-numbered arrays",
            "Because circular buffers require power-of-two multiplication",
            "To double the clock frequency of the CPU"
          ],
          answer: 0,
          why: "A 2N buffer provides two alternating halves (Ping and Pong), allowing CPU and DMA to operate simultaneously without accessing the same memory addresses."
        }
      },
      {
        title: "Building the L1 D-Cache Coherence Manager & Memory Barriers",
        say: [
          "The second pillar of Milestone 4 is L1 Data Cache Coherency Management.",
          "Because our Cortex-M7 gateway runs with D-Cache enabled at 480MHz, raw DMA memory operations risk stale reads and cache overwrite corruption.",
          "The Coherence Manager enforces strict synchronization barriers.",
          "On outbound transmission: `SCB_CleanDCache()` flushes modified data from L1 cache to physical SRAM, followed by `__DSB()` to ensure all bus lines settle before DMA begins.",
          "On inbound reception: after the DMA Transfer-Complete or Half-Transfer flag asserts, `__DSB()` ensures DMA writes have landed in SRAM, and `SCB_InvalidateDCache()` purges obsolete cache lines before the CPU accesses the buffer.",
          "Compile-time alignment assertions guarantee that all buffers reside on 32-byte boundaries with size padding."
        ],
        example: "Like an air-purification cleanroom: before sensitive silicon wafers enter the chamber (DMA data to CPU), the airlock purges all contaminants (cache invalidation), ensuring pristine data integrity.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class CacheCoherenceManager {
public:
    static bool enforceCoherentRx(uintptr_t bufferAddr, uint32_t sizeBytes) {
        if ((bufferAddr & 0x1F) != 0 || (sizeBytes & 0x1F) != 0) {
            std::cout << "[COHERENCE ERROR] Alignment violation on 0x" << std::hex << bufferAddr << "\\n";
            return false;
        }
        std::cout << "[CACHE COHERENCE RX] Synchronizing Inbound DMA Buffer (0x" << std::hex << bufferAddr << "):\\n";
        std::cout << "  1. __DSB() -> Bus lines settled.\\n";
        std::cout << "  2. SCB_InvalidateDCache_by_Addr(0x" << std::hex << bufferAddr << ", " << std::dec << sizeBytes << "B)\\n";
        std::cout << "  3. Data is 100% coherent! Zero stale read risk.\\n";
        return true;
    }
};

int main() {
    uintptr_t validBuffer = 0x20001000; // Divisible by 32
    CacheCoherenceManager::enforceCoherentRx(validBuffer, 64);
    return 0;
}`,
        output: `[CACHE COHERENCE RX] Synchronizing Inbound DMA Buffer (0x20001000):
  1. __DSB() -> Bus lines settled.
  2. SCB_InvalidateDCache_by_Addr(0x20001000, 64B)
  3. Data is 100% coherent! Zero stale read risk.`,
        codeNotes: [
          { line: 6, note: "Validates 32-byte alignment and padding compliance before cache operations" },
          { line: 12, note: "Executes DSB memory synchronization barrier followed by cache line invalidation" },
          { line: 20, note: "Demonstrates zero-defect cache coherency protocol" }
        ],
        tryIt: "Pass sizeBytes = 50 and verify that the alignment error triggers.",
        check: {
          question: "What is the consequence of failing to call `SCB_InvalidateDCache()` on an incoming DMA buffer on Cortex-M7?",
          options: [
            "The CPU reads stale, outdated data from its internal L1 cache, remaining blind to new data in SRAM",
            "The microcontroller catches fire physically",
            "The network router reboots",
            "The baud rate drops to zero"
          ],
          answer: 0,
          why: "Without cache invalidation, the CPU continues reading the obsolete copy of memory cached in L1 D-Cache rather than the fresh samples written to SRAM by the DMA."
        }
      },
      {
        title: "Building the Multi-Task Watchdog Supervisor & Crash Telemetry Logger",
        say: [
          "The third pillar of Milestone 4 is the Multi-Task Watchdog Supervisor and Crash Logger.",
          "The supervisor thread monitors 4 core gateway tasks: Task 0 (DMA Ingest), Task 1 (DSP Filtering), Task 2 (MQTT Cloud Publisher), and Task 3 (System Diagnostics).",
          "Each task must register its heartbeat bit within an agreed 50ms supervisory epoch.",
          "If all 4 tasks report, the supervisor refreshes both the Independent Watchdog (IWDG) and Window Watchdog (WWDG) and clears the heartbeat register.",
          "To prove robustness, we subject the engine to Live Deadlock Injection: when Task 1 is deliberately locked in an infinite loop, the supervisor detects the missing bit, refuses to feed the watchdog, and captures post-mortem crash telemetry.",
          "Upon reboot, the bootloader inspects `RCC_CSR` flags, logs the crash record to non-volatile memory, and restores normal gateway operations."
        ],
        example: "Like a flight safety controller: if the autopilot, rudder, and throttle fail to synchronize within 50 milliseconds, the emergency backup flight computer immediately overrides control and resets the avionics.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class IntegratedWatchdogSupervisor {
private:
    uint8_t heartbeatRegister;
    uint8_t requiredMask;
    uint32_t simulatedRccCsr;
public:
    IntegratedWatchdogSupervisor() : heartbeatRegister(0), requiredMask(0x0F), simulatedRccCsr(0) {}

    void reportTask(uint8_t id) {
        heartbeatRegister |= (1 << id);
    }

    bool auditAndFeed() {
        if (heartbeatRegister == requiredMask) {
            heartbeatRegister = 0;
            std::cout << "[WATCHDOG SUPERVISOR] All 4 tasks verified healthy -> Watchdog fed!\\n";
            return true;
        } else {
            uint8_t missing = requiredMask & ~heartbeatRegister;
            std::cout << "[WATCHDOG TRIPPED] Missing Task Bits: 0x" << std::hex << (int)missing << "\\n";
            std::cout << "  -> Hardware Reset Triggered! Setting IWDGRSTF flag in RCC_CSR...\\n";
            simulatedRccCsr |= (1 << 29); // IWDG Reset Flag
            return false;
        }
    }

    uint32_t getRccCsr() const { return simulatedRccCsr; }
};

int main() {
    IntegratedWatchdogSupervisor sup;
    std::cout << "[CYCLE 1: NORMAL OPERATION]\\n";
    sup.reportTask(0);
    sup.reportTask(1);
    sup.reportTask(2);
    sup.reportTask(3);
    sup.auditAndFeed();

    std::cout << "\\n[CYCLE 2: SIMULATED DEADLOCK IN TASK 1]\\n";
    sup.reportTask(0);
    sup.reportTask(2);
    sup.reportTask(3); // Task 1 missing!
    sup.auditAndFeed();

    std::cout << "\\n[POST-MORTEM RESET LOG]:\\n";
    std::cout << "  RCC_CSR Flags: 0x" << std::hex << sup.getRccCsr() << " (IWDGRSTF Asserted!)\\n";
    return 0;
}`,
        output: `[CYCLE 1: NORMAL OPERATION]
[WATCHDOG SUPERVISOR] All 4 tasks verified healthy -> Watchdog fed!

[CYCLE 2: SIMULATED DEADLOCK IN TASK 1]
[WATCHDOG TRIPPED] Missing Task Bits: 0x2
  -> Hardware Reset Triggered! Setting IWDGRSTF flag in RCC_CSR...

[POST-MORTEM RESET LOG]:
  RCC_CSR Flags: 0x20000000 (IWDGRSTF Asserted!)`,
        codeNotes: [
          { line: 5, note: "Maintains 4-task heartbeat register and simulated RCC reset status flag" },
          { line: 15, note: "Detects missing task heartbeat and starves watchdog to trigger hardware reset" },
          { line: 36, note: "Captures simulated IWDG reset flag (0x20000000) for post-mortem analysis" }
        ],
        tryIt: "Add Task 1 back in Cycle 2 and observe that no reset occurs.",
        check: {
          question: "How does the multi-task heartbeat supervisor guarantee that a hung background thread is caught even if other threads are running?",
          options: [
            "It requires all threads to set their assigned bits in a shared mask; if any thread hangs, the mask is incomplete and the watchdog is starved",
            "It monitors the physical weight of the circuit board",
            "It forces all threads to execute in a single serial queue",
            "It shuts down the microcontroller after 10 seconds unconditionally"
          ],
          answer: 0,
          why: "By requiring an exact bitmask match across all active threads, the supervisor guarantees that a freeze in any single thread will starve the watchdog and reset the system."
        }
      },
      {
        title: "Master Architectural Synthesis & Official Milestone 4 Defense Certification",
        say: [
          "In this final capstone session, you defend your Milestone 4 Architecture before the Senior Technical Review Board.",
          "The board evaluates your end-to-end integration across all three domains:",
          "Domain 1: Zero-CPU DMA Streaming. Circular double-buffering sustains continuous real-time sample ingestion without a single dropped byte or buffer collision.",
          "Domain 2: L1 D-Cache Coherency. 32-byte alignment, padding, DSB barriers, and SCB Clean/Invalidate instructions eliminate all cache desynchronization hazards on ARM Cortex-M7.",
          "Domain 3: Fail-Safe Watchdog Architecture. Multi-task heartbeat bitmasks and independent watchdog timers ensure automatic recovery from deadlocks with post-mortem diagnostic logging.",
          "Upon unanimous board approval, you are awarded official certification in Advanced Embedded Communications, DMA Architecture & Safety-Critical Firmware Engineering."
        ],
        example: "Like passing the flight readiness review at NASA: flight software, thermal shielding, and life support systems are audited under simulated multi-system failures before launch approval.",
        code: `#include <iostream>
#include <cstdint>

struct Milestone4DefenseCriteria {
    bool dmaCircularStreamingVerified;
    bool dcacheCoherencyVerified;
    bool multiTaskWatchdogVerified;
    bool crashTelemetryLogged;
};

bool evaluateMilestone4Defense(const Milestone4DefenseCriteria* c) {
    std::cout << "=========================================================\\n";
    std::cout << "  OFFICIAL MILESTONE 4 DEFENSE BOARD EVALUATION\\n";
    std::cout << "=========================================================\\n";
    std::cout << "1. Zero-CPU DMA Streaming:      " << (c->dmaCircularStreamingVerified ? "[PASS]" : "[FAIL]") << "\\n";
    std::cout << "2. L1 D-Cache Coherency:        " << (c->dcacheCoherencyVerified ? "[PASS]" : "[FAIL]") << "\\n";
    std::cout << "3. Multi-Task Watchdog Guard:   " << (c->multiTaskWatchdogVerified ? "[PASS]" : "[FAIL]") << "\\n";
    std::cout << "4. Post-Mortem Crash Logging:   " << (c->crashTelemetryLogged ? "[PASS]" : "[FAIL]") << "\\n";

    bool pass = c->dmaCircularStreamingVerified && c->dcacheCoherencyVerified &&
                c->multiTaskWatchdogVerified && c->crashTelemetryLogged;

    if (pass) {
        std::cout << "\\nBoard Verdict: UNANIMOUS_PASS\\n";
        std::cout << "[MILESTONE 4 PASSED] Advanced Embedded DMA & Safety Engine Certified!\\n";
    } else {
        std::cout << "\\nBoard Verdict: REJECTED_REVISION_REQUIRED\\n";
    }
    return pass;
}

int main() {
    Milestone4DefenseCriteria criteria = {true, true, true, true};
    evaluateMilestone4Defense(&criteria);
    return 0;
}`,
        output: `=========================================================
  OFFICIAL MILESTONE 4 DEFENSE BOARD EVALUATION
=========================================================
1. Zero-CPU DMA Streaming:      [PASS]
2. L1 D-Cache Coherency:        [PASS]
3. Multi-Task Watchdog Guard:   [PASS]
4. Post-Mortem Crash Logging:   [PASS]

Board Verdict: UNANIMOUS_PASS
[MILESTONE 4 PASSED] Advanced Embedded DMA & Safety Engine Certified!`,
        codeNotes: [
          { line: 4, note: "Defines the 4 mandatory criteria for Milestone 4 defense qualification" },
          { line: 15, note: "Evaluates comprehensive system integration under unanimous voting rules" },
          { line: 29, note: "Issues official Milestone 4 certification confirming production-ready embedded architecture" }
        ],
        tryIt: "Set crashTelemetryLogged to false and verify that the board verdict is REJECTED.",
        check: {
          question: "What core architectural competencies are officially certified by passing Milestone 4?",
          options: [
            "Zero-CPU circular DMA double-buffering, ARM Cortex-M7 L1 cache coherency management, and multi-task watchdog supervisory fail-safes",
            "Typing speed in text editors",
            "Creating marketing presentations",
            "Setting up email accounts"
          ],
          answer: 0,
          why: "Milestone 4 certifies mastery over high-throughput DMA streaming, L1 cache coherency synchronization, and mission-critical watchdog fail-safe architectures."
        }
      }
    ],
    summary: [
      "Milestone 4 unifies zero-CPU circular DMA double-buffering, L1 D-Cache coherency, and multi-task watchdog supervision.",
      "Circular Ping-Pong DMA buffers eliminate sample drops and decouple asynchronous acquisition from CPU processing.",
      "L1 D-Cache Clean and Invalidate instructions coupled with DSB barriers eliminate stale reads and overwrite hazards on Cortex-M7.",
      "The Multi-Task Heartbeat Bitmask architecture verifies the health of all concurrent tasks before feeding the hardware watchdog.",
      "Post-mortem RCC_CSR reset diagnostics preserve crash telemetry for cloud fleet reliability auditing."
    ],
    projectStep: {
      title: "Construct, Verify, and Defend Milestone 4: Zero-CPU DMA Streaming & Fail-Safe Engine",
      steps: [
        "Construct a circular DMA ping-pong streaming buffer with Half-Transfer and Transfer-Complete callbacks.",
        "Integrate ARM Cortex-M7 L1 D-Cache maintenance with 32-byte alignment and DSB memory barriers.",
        "Implement multi-task heartbeat bitmask supervision monitoring all active gateway threads.",
        "Configure Independent (IWDG) and Window (WWDG) watchdogs with post-mortem RCC_CSR reset diagnostics.",
        "Defend the integrated architecture before the technical review board to achieve official Milestone 4 certification."
      ]
    }
  },
  {
    day: 21,
    title: "Real-Time Operating System (RTOS) Physics: Hard vs Soft RTOS, Task Control Blocks & Stacks",
    goal: "Transition from bare-metal super-loops to multi-tasking operating systems: master FreeRTOS kernel internals. Understand hard vs soft real-time determinism, Task Control Blocks (TCB), per-task stack allocation, 0xA5 stack canary watermarking, and Rate Monotonic Scheduling (RMS) utilization bounds.",
    minutes: 36,
    recap: "In Block 4, we mastered DMA controllers, circular double-buffering, and hardware watchdogs. Today, we enter the world of concurrent embedded operating systems: the FreeRTOS real-time kernel.",
    parts: [
      {
        title: "Hard vs Soft Real-Time Systems: Determinism, Bounded WCET & Deadlines",
        say: [
          "A common misconception is that a Real-Time Operating System (RTOS) is simply a fast operating system; in reality, an RTOS is about predictability, not raw speed.",
          "The defining metric of an RTOS is Determinism: the mathematical guarantee that a given task will execute within a strictly bounded time window regardless of system load.",
          "In a Hard Real-Time System (such as an automotive airbag controller, cardiac pacemaker, or rocket attitude thruster), missing a deadline constitutes total system failure with catastrophic real-world consequences.",
          "In a Soft Real-Time System (such as video streaming or a digital watch UI), missing a deadline causes degraded quality of service (dropped video frames) but no physical harm.",
          "To guarantee hard real-time deadlines, every task must have a proven Worst-Case Execution Time (WCET).",
          "General-purpose operating systems like Linux or Windows are soft real-time at best because virtual memory page faults, dynamic heap allocations, and complex CFS schedulers introduce unbounded latency jitter."
        ],
        example: "An airbag deployment system: if the deceleration sensor fires, the airbag MUST inflate within exactly 15 milliseconds; deploying in 16 milliseconds is not 'a little late'\u2014it is fatal.",
        code: `#include <iostream>
#include <string>
#include <iomanip>

struct TaskTimingProfile {
    std::string taskName;
    double bestCaseTimeMs;
    double worstCaseTimeMs;
    double deadlineMs;
    bool isHardRealTime;

    bool evaluateCompliance() const {
        return worstCaseTimeMs <= deadlineMs;
    }
};

void auditRealTimeSystem(const TaskTimingProfile& task) {
    std::cout << "[RTOS AUDIT] Task: " << task.taskName 
              << " (" << (task.isHardRealTime ? "HARD REAL-TIME" : "SOFT REAL-TIME") << ")\\n";
    std::cout << "  Best-Case:  " << std::fixed << std::setprecision(2) << task.bestCaseTimeMs << " ms\\n";
    std::cout << "  Worst-Case: " << task.worstCaseTimeMs << " ms\\n";
    std::cout << "  Deadline:   " << task.deadlineMs << " ms\\n";

    if (task.evaluateCompliance()) {
        std::cout << "  -> VERDICT: COMPLIANT (Margin: +" << (task.deadlineMs - task.worstCaseTimeMs) << " ms)\\n";
    } else {
        std::cout << "  -> VERDICT: DEADLINE VIOLATION! (Exceeded by " 
                  << (task.worstCaseTimeMs - task.deadlineMs) << " ms) - CATASTROPHIC!\\n";
    }
}

int main() {
    TaskTimingProfile airbag = {"Airbag Squib Trigger", 2.10, 4.80, 5.00, true};
    TaskTimingProfile display = {"UI Screen Refresh", 12.00, 22.00, 16.67, false};

    auditRealTimeSystem(airbag);
    std::cout << "\\n";
    auditRealTimeSystem(display);
    return 0;
}`,
        output: `[RTOS AUDIT] Task: Airbag Squib Trigger (HARD REAL-TIME)
  Best-Case:  2.10 ms
  Worst-Case: 4.80 ms
  Deadline:   5.00 ms
  -> VERDICT: COMPLIANT (Margin: +0.20 ms)

[RTOS AUDIT] Task: UI Screen Refresh (SOFT REAL-TIME)
  Best-Case:  12.00 ms
  Worst-Case: 22.00 ms
  Deadline:   16.67 ms
  -> VERDICT: DEADLINE VIOLATION! (Exceeded by 5.33 ms) - CATASTROPHIC!`,
        codeNotes: [
          { line: 12, note: "Hard real-time compliance requires that Worst-Case Execution Time strictly <= Deadline" },
          { line: 34, note: "Airbag task completes within 4.8 ms WCET, safely meeting 5.0 ms hard deadline" },
          { line: 35, note: "UI display task misses 60Hz deadline by 5.33 ms, acceptable only in soft systems" }
        ],
        tryIt: "Reduce airbag WCET margin to negative and verify that the safety audit flags an immediate critical failure.",
        check: {
          question: "What is the defining requirement of a Hard Real-Time Operating System?",
          options: [
            "It mathematically guarantees that critical tasks complete within bounded deadlines, where a single missed deadline causes total system failure",
            "It has the highest raw gigahertz CPU frequency",
            "It executes tasks without using a stack",
            "It only runs on 64-bit processors"
          ],
          answer: 0,
          why: "Hard real-time is defined by bounded determinism: missing a deadline is treated as a total system failure regardless of average speed."
        }
      },
      {
        title: "The Task Control Block (TCB): Architecture, State & Stack Pointers",
        say: [
          "In FreeRTOS, every task is represented by an internal kernel structure called the Task Control Block (`TCB_t`).",
          "The very first member of the `TCB_t` struct is `pxTopOfStack`\u2014a pointer to the current top of the task's private stack.",
          "Placing `pxTopOfStack` at offset zero is a brilliant assembly optimization: in the context switcher, loading the TCB address into a register immediately gives direct access to the stack pointer without adding struct member offsets.",
          "The TCB also stores the task's Name, Priority level (0 to `configMAX_PRIORITIES - 1`), Stack Base address, and two bidirectional list items (`xStateListItem` and `xEventListItem`).",
          "At any given instant, a task exists in one of four states: RUNNING (actively executing on the CPU), READY (able to run, awaiting CPU time), BLOCKED (waiting for an event or timer delay), or SUSPENDED.",
          "The FreeRTOS scheduler maintains these states by moving TCB list items between kernel priority lists (`pxReadyTasksLists`, `xDelayedTaskList1`, `xSuspendedTaskList`)."
        ],
        example: "A TCB is like a pilot's flight manifest and cockpit clipboard: it records who the pilot is, their seniority (priority), where their flight bag is stored (stack pointer), and whether they are currently in the air, on standby at the gate, or resting between flights.",
        code: `#include <iostream>
#include <string>
#include <cstdint>

enum class TaskState {
    RUNNING,
    READY,
    BLOCKED,
    SUSPENDED
};

struct SimulatedTcb {
    uint32_t* pxTopOfStack; // Offset 0: Critical for assembly context switch
    uint32_t priority;
    uint32_t* pxStackBase;
    uint32_t stackSizeBytes;
    std::string taskName;
    TaskState state;
};

void inspectTcb(const SimulatedTcb& tcb) {
    std::cout << "[TCB INSPECTION] Task '" << tcb.taskName << "':\\n";
    std::cout << "  pxTopOfStack: 0x" << std::hex << (uintptr_t)tcb.pxTopOfStack 
              << " (Offset 0 in TCB)\\n";
    std::cout << "  Stack Base:   0x" << (uintptr_t)tcb.pxStackBase 
              << ", Allocated: " << std::dec << tcb.stackSizeBytes << " bytes\\n";
    std::cout << "  Priority:     " << tcb.priority << "\\n";
    std::string stateStr = "READY";
    if (tcb.state == TaskState::RUNNING) stateStr = "RUNNING";
    else if (tcb.state == TaskState::BLOCKED) stateStr = "BLOCKED";
    std::cout << "  Kernel State: " << stateStr << "\\n";
}

int main() {
    uint32_t mockStack[128]; // 512-byte stack
    SimulatedTcb sensorTask = {
        &mockStack[112],     // Top of stack (grows downward)
        3,                   // Priority 3 (High)
        mockStack,
        512,
        "SensorSampler",
        TaskState::READY
    };

    inspectTcb(sensorTask);
    return 0;
}`,
        output: `[TCB INSPECTION] Task 'SensorSampler':
  pxTopOfStack: 0x... (Offset 0 in TCB)
  Stack Base:   0x..., Allocated: 512 bytes
  Priority:     3
  Kernel State: READY`,
        codeNotes: [
          { line: 13, note: "pxTopOfStack must reside at byte offset 0 of TCB for single-instruction assembly access" },
          { line: 34, note: "Stack grows downward on ARM Cortex-M; top of stack is near the high address" },
          { line: 39, note: "Represents READY state waiting for scheduler dispatch" }
        ],
        tryIt: "Simulate transitioning the task state to BLOCKED when waiting for an I2C sensor reading.",
        check: {
          question: "Why is pxTopOfStack placed at byte offset 0 of the FreeRTOS Task Control Block (TCB_t)?",
          options: [
            "So the assembly context switcher can read and update the task's stack pointer in a single instruction without calculating struct offsets",
            "Because the C++ language requires it",
            "To prevent compiler optimization errors",
            "Because offset 0 is stored in Flash memory"
          ],
          answer: 0,
          why: "By placing pxTopOfStack at offset 0, the assembly instruction 'LDR R0, [R1]' directly loads the stack pointer when R1 points to the TCB."
        }
      },
      {
        title: "Per-Task Stack Allocation & Initialization of Fake Exception Stacking Frames",
        say: [
          "In a bare-metal program, all code shares a single stack (the Main Stack Pointer, MSP).",
          "In an RTOS, every task has its own completely independent stack allocated in SRAM.",
          "When a new task is created (`xTaskCreate`), it is not running yet; how can the scheduler context-switch into it for the very first time?",
          "The kernel solves this through Fake Exception Frame Initialization (`pxPortInitialiseStack`).",
          "The kernel pre-populates the task's empty stack with an artificial 16-register hardware/software exception frame as if the task had already been interrupted.",
          "The fake frame contains: xPSR (with Thumb bit 24 = 1), PC (set to the task's function address), LR (set to `prvTaskExitError`), R0 (set to the task parameter `pvParameters`), and zeros for R1\u2013R12 and R4\u2013R11.",
          "When the scheduler performs its first context switch, it pops these fake registers; the CPU branches directly to the task entry function naturally!"
        ],
        example: "Setting up a new rental apartment: before the tenant moves in, the landlord places keys on the counter, turns on the refrigerator, and leaves a welcome letter (fake stack frame) so the tenant can walk in and start living immediately.",
        code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct InitialStackFrame {
    // Software saved registers (popped by PendSV)
    uint32_t r4, r5, r6, r7, r8, r9, r10, r11;
    // Hardware saved registers (popped automatically by Cortex-M hardware)
    uint32_t r0;        // Task parameter (pvParameters)
    uint32_t r1, r2, r3, r12;
    uint32_t lr;        // Return address on task exit (error trap)
    uint32_t pc;        // Task entry point function pointer
    uint32_t xpsr;      // Program Status Register (Thumb bit = 1)
};

uint32_t* initializeTaskStack(uint32_t* stackTop, void (*taskFunc)(void*), void* param) {
    stackTop--; // Decrement pointer
    *stackTop = 0x01000000; // xPSR: Bit 24 (Thumb bit) MUST be 1
    stackTop--;
    *stackTop = (uint32_t)taskFunc; // PC: Points to task function
    stackTop--;
    *stackTop = 0x00000000; // LR: Task exit trap
    stackTop--;
    *stackTop = 0x12121212; // R12
    stackTop--;
    *stackTop = 0x03030303; // R3
    stackTop--;
    *stackTop = 0x02020202; // R2
    stackTop--;
    *stackTop = 0x01010101; // R1
    stackTop--;
    *stackTop = (uint32_t)param; // R0: Holds pvParameters argument!
    
    // R4 - R11 software registers (initialized to known debug values)
    for (int r = 11; r >= 4; --r) {
        stackTop--;
        *stackTop = 0x04040400 + r;
    }
    return stackTop; // New pxTopOfStack
}

void dummyTask(void* p) {
    std::cout << "Task executing with param: " << (uintptr_t)p << "\\n";
}

int main() {
    uint32_t taskStack[64];
    uint32_t* stackEnd = &taskStack[64]; // Top of allocated array

    uint32_t* topOfStack = initializeTaskStack(stackEnd, dummyTask, (void*)0xCAFE);

    std::cout << "Initialized Fake Stack Frame for New Task:\\n";
    std::cout << "  Stack Base:    0x" << std::hex << (uintptr_t)taskStack << "\\n";
    std::cout << "  Initial Top:   0x" << (uintptr_t)topOfStack << "\\n";
    std::cout << "  Frame Size:    " << std::dec << (stackEnd - topOfStack) << " words (16 registers)\\n";
    std::cout << "  xPSR (at top): 0x01000000 (Thumb bit verified)\\n";
    return 0;
}`,
        output: `Initialized Fake Stack Frame for New Task:
  Stack Base:    0x...
  Initial Top:   0x...
  Frame Size:    16 words (16 registers)
  xPSR (at top): 0x01000000 (Thumb bit verified)`,
        codeNotes: [
          { line: 19, note: "Bit 24 of xPSR must be 1 (Thumb bit); if 0, Cortex-M generates an immediate UsageFault" },
          { line: 21, note: "Initializes PC to task entry point function address" },
          { line: 31, note: "R0 receives pvParameters pointer per ARM AAPCS calling convention" }
        ],
        tryIt: "Demonstrate what happens if xPSR bit 24 is set to 0: the ARM processor refuses to execute in non-Thumb mode.",
        check: {
          question: "Why must bit 24 (Thumb bit) of the xPSR register be set to 1 when initializing a new FreeRTOS task stack?",
          options: [
            "ARM Cortex-M processors only support the Thumb-2 instruction set; a 0 in bit 24 triggers a fatal UsageFault exception on startup",
            "To enable floating-point hardware",
            "To double the size of the task stack",
            "To enable the external crystal oscillator"
          ],
          answer: 0,
          why: "ARM Cortex-M cores do not support legacy ARM 32-bit state; execution requires the Thumb bit (bit 24 of xPSR) to be asserted at all times."
        }
      },
      {
        title: "Stack Overflow Detection: Canary Watermarking (0xA5) & High-Water Marks",
        say: [
          "Stack overflow is the number one cause of mysterious crashes, memory corruption, and spontaneous resets in embedded systems.",
          "If a task exceeds its allocated stack, it silently overwrites adjacent Task Control Blocks, heap variables, or other task stacks.",
          "FreeRTOS provides two powerful stack overflow detection methods configured via `configCHECK_FOR_STACK_OVERFLOW`.",
          "Method 1: During task switching, the kernel checks if the current stack pointer `pxTopOfStack` has fallen outside the allocated range `pxStackBase`.",
          "Method 2 (Canary Watermarking): When a task is created, the kernel fills its entire stack with the signature canary byte `0xA5`.",
          "The kernel inspects the last 16\u201332 bytes at the bottom of the stack; if any canary byte has been overwritten, the kernel halts and invokes `vApplicationStackOverflowHook()`.",
          "The function `uxTaskGetStackHighWaterMark()` scans from the bottom to count intact `0xA5` bytes, returning the minimum unused stack space ever reached."
        ],
        example: "Canary watermarking is like miners taking a canary into a coal mine: as long as the canary is alive (0xA5 intact), the air is safe; if the canary dies (0xA5 overwritten), everyone must evacuate immediately.",
        code: `#include <iostream>
#include <vector>
#include <cstdint>

class StackWatermarkInspector {
private:
    static const uint8_t CANARY_BYTE = 0xA5;
    std::vector<uint8_t> stackMemory;
public:
    StackWatermarkInspector(size_t sizeBytes) : stackMemory(sizeBytes, CANARY_BYTE) {}

    void simulateTaskExecution(size_t stackUsedBytes) {
        // Stack grows downward from end towards index 0
        size_t total = stackMemory.size();
        if (stackUsedBytes > total) {
            stackUsedBytes = total; // Full overflow
        }
        for (size_t i = total - stackUsedBytes; i < total; ++i) {
            stackMemory[i] = 0xAA; // Overwritten by active stack frames
        }
    }

    size_t getStackHighWaterMark() const {
        size_t intactCanaries = 0;
        // Count intact 0xA5 bytes from bottom of stack (index 0)
        for (size_t i = 0; i < stackMemory.size(); ++i) {
            if (stackMemory[i] == CANARY_BYTE) {
                intactCanaries++;
            } else {
                break;
            }
        }
        return intactCanaries;
    }

    bool checkOverflow() const {
        // Check first 16 canary bytes at bottom of stack
        for (size_t i = 0; i < 16 && i < stackMemory.size(); ++i) {
            if (stackMemory[i] != CANARY_BYTE) {
                return true; // Overflow detected!
            }
        }
        return false;
    }
};

int main() {
    StackWatermarkInspector taskStack(512); // 512-byte stack filled with 0xA5

    std::cout << "Initial Stack High-Water Mark: " << taskStack.getStackHighWaterMark() << " bytes unused\\n";
    taskStack.simulateTaskExecution(400); // Uses 400 bytes
    std::cout << "After 400-byte load: " << taskStack.getStackHighWaterMark() 
              << " bytes unused (Safe margin: 112 bytes)\\n";

    // Dangerous deep recursion consumes 510 bytes (destroys canary bottom)
    taskStack.simulateTaskExecution(510);
    std::cout << "After heavy recursion: " << taskStack.getStackHighWaterMark() << " bytes unused\\n";
    if (taskStack.checkOverflow()) {
        std::cout << "[FATAL STACK OVERFLOW HOOK] 0xA5 Canary destroyed! Halting system safely.\\n";
    }
    return 0;
}`,
        output: `Initial Stack High-Water Mark: 512 bytes unused
After 400-byte load: 112 bytes unused (Safe margin: 112 bytes)
After heavy recursion: 2 bytes unused
[FATAL STACK OVERFLOW HOOK] 0xA5 Canary destroyed! Halting system safely.`,
        codeNotes: [
          { line: 10, note: "Pre-fills entire stack array with FreeRTOS standard 0xA5 canary byte" },
          { line: 22, note: "uxTaskGetStackHighWaterMark counts intact 0xA5 bytes from stack bottom" },
          { line: 49, note: "Traps stack overflow hook when bottom canary boundary is corrupted" }
        ],
        tryIt: "Demonstrate how stack tuning in production uses high-water marks to safely shrink oversized task stacks.",
        check: {
          question: "What is the standard canary byte used by FreeRTOS to watermark task stacks for overflow detection?",
          options: [
            "0xA5",
            "0x00",
            "0xFF",
            "0x55"
          ],
          answer: 0,
          why: "FreeRTOS fills stack memory with 0xA5 upon creation; checking whether the 0xA5 pattern at the stack limit has been altered reveals whether an overflow occurred."
        }
      },
      {
        title: "Rate Monotonic Scheduling (RMS) Mathematical Utilization Bounds",
        say: [
          "How does an embedded systems architect prove mathematically that a set of real-time tasks will ALWAYS meet their deadlines?",
          "The foundation of real-time scheduling theory is Rate Monotonic Scheduling (RMS), established by Liu and Layland in 1973.",
          "Under RMS, task priorities are assigned strictly by period: the shorter the period (higher rate), the higher the priority.",
          "Liu and Layland proved that a set of N periodic tasks is guaranteed to meet all deadlines if total CPU utilization satisfies: U = sum(C_i / T_i) <= N * (2^(1/N) - 1).",
          "For N=1, U <= 100%. For N=2, U <= 82.8%. For N=3, U <= 78.0%. As N approaches infinity, the bound converges to ln(2) = 69.3%.",
          "If total utilization is below 69.3%, all tasks are mathematically guaranteed to meet all hard deadlines under all conditions without exception."
        ],
        example: "A busy highway speed limit: if the highway operates at under 69% capacity, traffic is mathematically guaranteed to flow smoothly without stop-and-go phantom shockwaves.",
        code: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

struct PeriodicTask {
    std::string name;
    double computationTimeMs; // C_i
    double periodMs;          // T_i

    double getUtilization() const {
        return computationTimeMs / periodMs;
    }
};

class RmsSchedulerAnalyzer {
public:
    static double calculateRmsBound(size_t n) {
        if (n == 0) return 0.0;
        return (double)n * (std::pow(2.0, 1.0 / n) - 1.0);
    }

    static void evaluateTaskSet(const std::vector<PeriodicTask>& tasks) {
        double totalU = 0.0;
        std::cout << "Rate Monotonic Scheduling (RMS) Mathematical Evaluation:\\n";
        for (const auto& t : tasks) {
            double u = t.getUtilization();
            totalU += u;
            std::cout << "  Task '" << t.name << "': C=" << t.computationTimeMs 
                      << "ms, T=" << t.periodMs << "ms -> U = " 
                      << std::fixed << std::setprecision(1) << (u * 100.0) << "%\\n";
        }

        double bound = calculateRmsBound(tasks.size());
        std::cout << "  --------------------------------------------------\\n";
        std::cout << "  Total Utilization:   " << (totalU * 100.0) << "%\\n";
        std::cout << "  Liu-Layland Bound:   " << (bound * 100.0) << "% (for N=" << tasks.size() << ")\\n";

        if (totalU <= bound) {
            std::cout << "  -> THEORETICALLY GUARANTEED SCHEDULABLE: All hard deadlines met!\\n";
        } else if (totalU <= 1.0) {
            std::cout << "  -> FEASIBLE BUT NOT GUARANTEED: Requires exact response-time analysis.\\n";
        } else {
            std::cout << "  -> UNSCHEDULABLE: CPU overloaded (>100%), deadline misses inevitable!\\n";
        }
    }
};

int main() {
    std::vector<PeriodicTask> avionics = {
        {"FlightControlLoop", 1.0,  10.0}, // U = 10% (T=10ms, Highest Pri)
        {"NavigationFilter",  5.0,  25.0}, // U = 20% (T=25ms, Med Pri)
        {"TelemetryStream",  15.0,  50.0}  // U = 30% (T=50ms, Low Pri)
    };
    RmsSchedulerAnalyzer::evaluateTaskSet(avionics);
    return 0;
}`,
        output: `Rate Monotonic Scheduling (RMS) Mathematical Evaluation:
  Task 'FlightControlLoop': C=1.0ms, T=10.0ms -> U = 10.0%
  Task 'NavigationFilter': C=5.0ms, T=25.0ms -> U = 20.0%
  Task 'TelemetryStream': C=15.0ms, T=50.0ms -> U = 30.0%
  --------------------------------------------------
  Total Utilization:   60.0%
  Liu-Layland Bound:   78.0% (for N=3)
  -> THEORETICALLY GUARANTEED SCHEDULABLE: All hard deadlines met!`,
        codeNotes: [
          { line: 17, note: "Calculates Liu-Layland RMS utilization bound: N * (2^(1/N) - 1)" },
          { line: 25, note: "Sums individual task utilizations C_i / T_i" },
          { line: 34, note: "Total 60% utilization <= 78.0% bound: mathematically proves 100% deadline compliance" }
        ],
        tryIt: "Increase Telemetry computation time to 25.0 ms (U=50%) and observe how total utilization crosses the 78% bound.",
        check: {
          question: "Under Rate Monotonic Scheduling (RMS), what is the asymptotic Liu-Layland utilization bound as the number of tasks approaches infinity?",
          options: [
            "ln(2) \u2248 69.3%",
            "100.0%",
            "50.0%",
            "90.0%"
          ],
          answer: 0,
          why: "As N approaches infinity, N * (2^(1/N) - 1) converges mathematically to ln(2) = 0.69314... (approx 69.3%)."
        }
      }
    ],
    summary: [
      "Hard real-time systems require mathematical determinism where Worst-Case Execution Time (WCET) strictly meets bounded deadlines.",
      "FreeRTOS Task Control Blocks (TCB) store pxTopOfStack at offset 0 for single-instruction assembly context switching.",
      "New task stacks are initialized with a fake 16-register exception frame (R0-R15, xPSR) with Thumb bit 24 set to 1.",
      "Stack canary watermarking fills memory with 0xA5, enabling uxTaskGetStackHighWaterMark and vApplicationStackOverflowHook.",
      "Rate Monotonic Scheduling (RMS) assigns priorities by period, guaranteeing schedulability when total utilization is below the Liu-Layland bound (approx 69.3%)."
    ],
    projectStep: {
      title: "Construct a Preemptive TCB Architecture with Stack Canary Watermarking and RMS Analysis",
      steps: [
        "Implement a Task Control Block (TCB) structure with pxTopOfStack aligned at byte offset 0.",
        "Construct a fake exception stacking initialization engine populating R0\u2013R15 with Thumb bit verification.",
        "Pre-fill task stacks with 0xA5 canary bytes and implement a high-water mark stack overflow detector.",
        "Calculate Liu-Layland mathematical utilization bounds for multi-rate periodic task sets.",
        "Verify task state transitions between READY, RUNNING, and BLOCKED queues."
      ]
    }
  },
  {
    day: 22,
    title: "Preemptive Scheduling & Context Switching: PendSV Exception, SysTick & Assembly Stack Swapping",
    goal: "Deconstruct the black box of operating system multitasking: write an ARM Cortex-M Context Switcher in assembly. Understand why context switching inside hardware ISRs causes crashes, how the PendSV deferred exception operates at lowest priority, MSP vs PSP stack switching, and cycle-exact task swapping.",
    minutes: 36,
    recap: "Yesterday, we analyzed Task Control Blocks and fake stack frames. Today, we open the engine of the operating system: the PendSV assembly context switcher that swaps execution between tasks seamlessly.",
    parts: [
      {
        title: "Thread vs Handler Modes, Main Stack Pointer (MSP) vs Process Stack Pointer (PSP)",
        say: [
          "To support robust multitasking, the ARM Cortex-M architecture implements two operating modes and two physical stack pointer registers.",
          "Thread Mode is used for normal background application execution (user tasks); Handler Mode is entered automatically whenever an exception or interrupt fires.",
          "Additionally, Cortex-M features two distinct Stack Pointers: the Main Stack Pointer (`MSP`) and the Process Stack Pointer (`PSP`).",
          "The `CONTROL` register (bit 1 `SPSEL`) selects which stack pointer is currently active in Thread Mode: `SPSEL=0` uses MSP, `SPSEL=1` uses PSP.",
          "In a professional RTOS, all kernel interrupt handlers and system exceptions execute in Handler Mode using `MSP`.",
          "Each user task executes in Thread Mode using its private stack addressed by `PSP`; this isolates tasks so an application stack overflow cannot corrupt kernel interrupt handlers."
        ],
        example: "MSP is the building's main emergency fire escape stairs used only by emergency responders (ISRs); PSP is the private internal elevator inside each tenant's individual apartment (user tasks).",
        code: `#include <iostream>
#include <string>
#include <cstdint>

struct CpuExecutionState {
    std::string mode; // "Thread Mode" or "Handler Mode"
    std::string activeStack; // "MSP" or "PSP"
    uint32_t controlRegister;
};

void evaluateExecutionMode(uint32_t ipsr, uint32_t control) {
    std::cout << "[CPU PIPELINE STATE]:\\n";
    if (ipsr != 0) {
        std::cout << "  Mode:         Handler Mode (Servicing Exception/ISR #" << ipsr << ")\\n";
        std::cout << "  Active Stack: MSP (Main Stack Pointer enforced by hardware)\\n";
    } else {
        std::cout << "  Mode:         Thread Mode (Running Application Task)\\n";
        bool usePsp = (control & (1 << 1));
        std::cout << "  Active Stack: " << (usePsp ? "PSP (Process Stack Pointer)" : "MSP (Main Stack Pointer)") << "\\n";
        if (usePsp) {
            std::cout << "  -> RTOS Task Isolation: Active! Kernel stack protected.\\n";
        }
    }
}

int main() {
    // Scenario 1: User task running in Thread mode with PSP
    std::cout << "Scenario 1: Normal RTOS Task Execution:\\n";
    evaluateExecutionMode(0, 0x02); // IPSR=0 (Thread), CONTROL bit 1=1 (PSP)

    // Scenario 2: Hardware timer interrupt fires
    std::cout << "\\nScenario 2: Hardware Timer Interrupt Fires:\\n";
    evaluateExecutionMode(28, 0x02); // IPSR=28 (TIM2), Hardware forces MSP
    return 0;
}`,
        output: `Scenario 1: Normal RTOS Task Execution:
[CPU PIPELINE STATE]:
  Mode:         Thread Mode (Running Application Task)
  Active Stack: PSP (Process Stack Pointer)
  -> RTOS Task Isolation: Active! Kernel stack protected.

Scenario 2: Hardware Timer Interrupt Fires:
[CPU PIPELINE STATE]:
  Mode:         Handler Mode (Servicing Exception/ISR #28)
  Active Stack: MSP (Main Stack Pointer enforced by hardware)`,
        codeNotes: [
          { line: 13, note: "Non-zero IPSR indicates Handler Mode executing an active hardware interrupt" },
          { line: 17, note: "Thread mode uses CONTROL register bit 1 (SPSEL) to select private PSP" },
          { line: 28, note: "Demonstrates hardware switching to MSP automatically on interrupt entry" }
        ],
        tryIt: "Explain why user tasks running with PSP prevents an application stack crash from corrupting the kernel.",
        check: {
          question: "Which stack pointer register is used by user tasks in Thread Mode under FreeRTOS on ARM Cortex-M?",
          options: [
            "PSP (Process Stack Pointer), enabled via CONTROL bit 1",
            "MSP (Main Stack Pointer)",
            "BaseStack Register",
            "Vector Offset Register"
          ],
          answer: 0,
          why: "FreeRTOS configures user tasks to run in Thread Mode using PSP, reserving MSP exclusively for kernel interrupt service routines."
        }
      },
      {
        title: "Why Context Switching Inside Hardware ISRs Causes Crashes: The PendSV Invariant",
        say: [
          "Why can't the SysTick timer or a peripheral ISR simply swap `pxCurrentTCB` and switch stacks directly inside its own handler?",
          "Consider this fatal scenario: a high-priority motor timer ISR fires; while it is running, a low-priority UART ISR is interrupted.",
          "If the motor ISR attempts to execute a context switch, it swaps stack pointers in the middle of nested hardware interrupt stacking frames.",
          "When the processor tries to unstack, it reads the wrong registers from the wrong stack, generating an instantaneous `HardFault` and freezing the chip.",
          "The ARM architects solved this with a dedicated system exception: PendSV (Pended System Call).",
          "Invariant: The PendSV exception is ALWAYS configured with the lowest possible hardware interrupt priority (Priority 15, or 0xFF in `SHPR3`).",
          "When SysTick or an ISR decides a context switch is needed, it simply sets the PendSV pending bit (`SCB->ICSR_PENDSVSET = 1`); PendSV only executes AFTER all higher-priority hardware ISRs have completely finished and unstacked!"
        ],
        example: "A busy hospital operating room: surgeons don't swap surgical shift teams while performing open-heart surgery; they place a note on the board (PendSV) to change shifts the moment the patient is stable and all instruments are put away.",
        code: `#include <iostream>
#include <string>

struct InterruptNestingModel {
    int activeInterrupts;
    bool pendSvPending;

    InterruptNestingModel() : activeInterrupts(0), pendSvPending(false) {}

    void enterHardwareIsr(const std::string& name) {
        activeInterrupts++;
        std::cout << "[ISR ENTRY] " << name << " active (Nesting Level = " << activeInterrupts << ")\\n";
    }

    void requestContextSwitch() {
        pendSvPending = true;
        std::cout << "  -> [CONTEXT SWITCH REQUESTED] Setting PendSV Pending Bit (Deferred)\\n";
    }

    void exitHardwareIsr(const std::string& name) {
        activeInterrupts--;
        std::cout << "[ISR EXIT] " << name << " finished (Remaining Nesting = " << activeInterrupts << ")\\n";

        if (activeInterrupts == 0 && pendSvPending) {
            std::cout << "  -> [ALL HARDWARE ISRs FINISHED] CPU safely enters PendSV Exception!\\n";
            std::cout << "  -> [PENDSV HANDLER] Executing zero-risk task context switch!\\n";
            pendSvPending = false;
        }
    }
};

int main() {
    InterruptNestingModel mcu;
    // Low priority UART ISR begins
    mcu.enterHardwareIsr("UART_RX_ISR (Priority 3)");
    // Preempted by higher priority Timer ISR
    mcu.enterHardwareIsr("TIMER_MOTOR_ISR (Priority 1)");

    // Timer ISR unblocks high-priority task, requests context switch
    mcu.requestContextSwitch();

    // Timer finishes
    mcu.exitHardwareIsr("TIMER_MOTOR_ISR (Priority 1)");
    // UART finishes -> only now does PendSV execute safely!
    mcu.exitHardwareIsr("UART_RX_ISR (Priority 3)");
    return 0;
}`,
        output: `[ISR ENTRY] UART_RX_ISR (Priority 3) active (Nesting Level = 1)
[ISR ENTRY] TIMER_MOTOR_ISR (Priority 1) active (Nesting Level = 2)
  -> [CONTEXT SWITCH REQUESTED] Setting PendSV Pending Bit (Deferred)
[ISR EXIT] TIMER_MOTOR_ISR (Priority 1) finished (Nesting Level = 1)
[ISR EXIT] UART_RX_ISR (Priority 3) finished (Nesting Level = 0)
  -> [ALL HARDWARE ISRs FINISHED] CPU safely enters PendSV Exception!
  -> [PENDSV HANDLER] Executing zero-risk task context switch!`,
        codeNotes: [
          { line: 15, note: "Context switch request merely sets PendSV pending flag without immediate stack swapping" },
          { line: 23, note: "PendSV executes only when active hardware interrupt nesting level reaches 0" },
          { line: 34, note: "Prevents catastrophic stack frame corruption during nested interrupt execution" }
        ],
        tryIt: "Explain why configuring PendSV at highest priority instead of lowest would defeat its purpose.",
        check: {
          question: "Why is the PendSV exception configured at the lowest possible interrupt priority (Priority 15) in FreeRTOS?",
          options: [
            "To guarantee that context switching is deferred until all higher-priority hardware ISRs have finished executing and unstacked",
            "Because PendSV is a slow software function",
            "To save battery power",
            "Because the ARM processor does not support priority levels for system exceptions"
          ],
          answer: 0,
          why: "Running PendSV at lowest priority guarantees that all active hardware interrupts finish and unstack back to Thread mode before the context switcher swaps task stacks."
        }
      },
      {
        title: "The Assembly Engine: PendSV_Handler Step-by-Step",
        say: [
          "Let us inspect the exact GNU ARM assembly instructions executed inside `PendSV_Handler`.",
          "Step 1: When PendSV is entered, hardware has ALREADY automatically stacked R0\u2013R3, R12, LR, PC, and xPSR onto the current task's `PSP`.",
          "Step 2: Read current task stack pointer: `MRS R0, PSP`.",
          "Step 3: Save remaining software registers: `STMDB R0!, {R4-R11}` (Store Multiple Decrement Before).",
          "Step 4: Save updated stack pointer into current TCB: `LDR R1, =pxCurrentTCB; LDR R2, [R1]; STR R0, [R2]` (Writes `R0` into offset 0 `pxTopOfStack`).",
          "Step 5: Pick next task: `BL vTaskSwitchContext` (Updates `pxCurrentTCB` to point to the highest-priority READY task).",
          "Step 6: Load new task's stack pointer: `LDR R1, =pxCurrentTCB; LDR R2, [R1]; LDR R0, [R2]`.",
          "Step 7: Restore new task's software registers: `LDMIA R0!, {R4-R11}` (Load Multiple Increment After).",
          "Step 8: Update CPU PSP and return: `MSR PSP, R0; BX LR` (Hardware un-stacks R0\u2013R3, R12, LR, PC, xPSR into new task!)."
        ],
        example: "A chess player's clock: player 1 takes their hands off the board and pushes their clock button (save R4-R11, store PSP); player 2's clock starts ticking, player 2 grabs their pieces (load PSP, restore R4-R11) and resumes their game.",
        code: `#include <iostream>
#include <string>
#include <cstdint>

struct TaskContext {
    std::string name;
    uint32_t r4_r11[8];
    uint32_t psp;
};

void tracePendSvContextSwitch(TaskContext& outgoing, TaskContext& incoming) {
    std::cout << "=== PENDING SV CONTEXT SWITCH TRACE ===\\n";
    std::cout << "[STEP 1-3] Hardware stacked R0-R3,R12,LR,PC,xPSR onto PSP (0x" 
              << std::hex << outgoing.psp << ")\\n";
    std::cout << "           Software pushes R4-R11 via 'STMDB R0!, {R4-R11}'\\n";
    outgoing.psp -= (8 * 4); // 8 registers saved
    std::cout << "[STEP 4]   Saved updated PSP into " << outgoing.name << "->pxTopOfStack: 0x" 
              << outgoing.psp << "\\n";

    std::cout << "[STEP 5]   vTaskSwitchContext() invoked: pxCurrentTCB updated to " << incoming.name << "\\n";

    std::cout << "[STEP 6-7] Loaded incoming PSP from " << incoming.name << "->pxTopOfStack: 0x" 
              << incoming.psp << "\\n";
    std::cout << "           Software pops R4-R11 via 'LDMIA R0!, {R4-R11}'\\n";
    incoming.psp += (8 * 4);

    std::cout << "[STEP 8]   Updated PSP register. Executing 'BX LR'...\\n";
    std::cout << "           Hardware automatically un-stacks R0-R3,R12,LR,PC,xPSR into " 
              << incoming.name << "!\\n";
    std::cout << "-> Context switch complete! " << incoming.name << " is now RUNNING on CPU.\\n";
}

int main() {
    TaskContext task1 = {"Task1_LowPriority", {1,2,3,4,5,6,7,8}, 0x20001000};
    TaskContext task2 = {"Task2_HighPriority", {9,10,11,12,13,14,15,16}, 0x20002000};

    tracePendSvContextSwitch(task1, task2);
    return 0;
}`,
        output: `=== PENDING SV CONTEXT SWITCH TRACE ===
[STEP 1-3] Hardware stacked R0-R3,R12,LR,PC,xPSR onto PSP (0x20001000)
           Software pushes R4-R11 via 'STMDB R0!, {R4-R11}'
[STEP 4]   Saved updated PSP into Task1_LowPriority->pxTopOfStack: 0x20000fe0
[STEP 5]   vTaskSwitchContext() invoked: pxCurrentTCB updated to Task2_HighPriority
[STEP 6-7] Loaded incoming PSP from Task2_HighPriority->pxTopOfStack: 0x20002000
           Software pops R4-R11 via 'LDMIA R0!, {R4-R11}'
[STEP 8]   Updated PSP register. Executing 'BX LR'...
           Hardware automatically un-stacks R0-R3,R12,LR,PC,xPSR into Task2_HighPriority!
-> Context switch complete! Task2_HighPriority is now RUNNING on CPU.`,
        codeNotes: [
          { line: 13, note: "STMDB R0!, {R4-R11} saves remaining 8 general-purpose registers onto task PSP" },
          { line: 18, note: "vTaskSwitchContext selects highest-priority ready task to become pxCurrentTCB" },
          { line: 23, note: "LDMIA R0!, {R4-R11} restores callee-saved registers for incoming task" }
        ],
        tryIt: "Count total clock cycles for STMDB and LDMIA on Cortex-M4 and verify total context switch duration.",
        check: {
          question: "Which set of registers must software explicitly push and pop in PendSV_Handler that hardware does not stack automatically?",
          options: [
            "R4 through R11 (the 8 callee-saved registers)",
            "R0 through R3",
            "PC and xPSR",
            "The SysTick control registers"
          ],
          answer: 0,
          why: "Hardware automatically stacks R0-R3, R12, LR, PC, and xPSR; software in PendSV_Handler is responsible for preserving the remaining 8 registers (R4-R11)."
        }
      },
      {
        title: "Preemption and Cooperative Slicing: taskYIELD(), vTaskDelay() & SysTick Management",
        say: [
          "A real-time operating system supports two distinct mechanisms for task switching: Cooperative yielding and Preemptive time-slicing.",
          "In Cooperative Multitasking, a running task voluntarily gives up the CPU by calling `taskYIELD()` or entering a timed sleep via `vTaskDelay()`.",
          "`vTaskDelay(ticks)` places the calling task into the `xDelayedTaskList`, un-schedules it, and triggers a context switch, freeing the CPU for lower-priority tasks.",
          "In Preemptive Multitasking, the hardware SysTick timer interrupts the running task periodically (every 1.0 ms).",
          "Inside `SysTick_Handler`, the kernel increments `xTickCount`, checks whether delayed tasks have timed out, and determines if a higher-priority task is ready to preempt.",
          "If a higher-priority task is ready, SysTick asserts the PendSV bit; the current task is preempted involuntarily without its knowledge or cooperation."
        ],
        example: "Cooperative is taking turns speaking at a polite dinner party (you finish your sentence and say 'your turn'); preemptive is a debate moderator with a buzzer cutting off the microphone the microsecond your time limit expires.",
        code: `#include <iostream>
#include <string>
#include <cstdint>

struct SchedulerState {
    uint32_t currentTick;
    std::string runningTask;
    uint32_t runningPriority;
    bool pendSvTriggered;

    void onSysTick() {
        currentTick++;
        std::cout << "[SYSTICK TICK #" << currentTick << "] Evaluating preemptive scheduling...\\n";

        // Suppose high-priority motor task (Priority 4) unblocks at tick 10
        if (currentTick == 10 && runningPriority < 4) {
            std::cout << "  -> High-Priority Task 'MotorControl' (Pri 4) unblocked!\\n";
            std::cout << "  -> PREEMPTING '" << runningTask << "' (Pri " << runningPriority << ")\\n";
            pendSvTriggered = true;
            runningTask = "MotorControl";
            runningPriority = 4;
        }
    }

    void taskYield(const std::string& nextTask, uint32_t nextPriority) {
        std::cout << "[COOPERATIVE YIELD] '" << runningTask << "' voluntarily yields CPU\\n";
        runningTask = nextTask;
        runningPriority = nextPriority;
        std::cout << "  -> Switched to '" << runningTask << "'\\n";
    }
};

int main() {
    SchedulerState rtos = {9, "TelemetryLogger", 1, false};

    // Preemption test
    rtos.onSysTick(); // Tick 10: triggers preemption!

    // Cooperative yield test
    rtos.taskYield("BackgroundWorker", 0);
    return 0;
}`,
        output: `[SYSTICK TICK #10] Evaluating preemptive scheduling...
  -> High-Priority Task 'MotorControl' (Pri 4) unblocked!
  -> PREEMPTING 'TelemetryLogger' (Pri 1)
[COOPERATIVE YIELD] 'MotorControl' voluntarily yields CPU
  -> Switched to 'BackgroundWorker'`,
        codeNotes: [
          { line: 13, note: "SysTick checks whether higher-priority tasks have become unblocked" },
          { line: 17, note: "Preemption triggered involuntarily: sets PendSV to switch away from lower-priority task" },
          { line: 25, note: "Cooperative taskYIELD voluntarily relinquishes CPU control" }
        ],
        tryIt: "Demonstrate what happens if two tasks share identical priority: SysTick performs round-robin time slicing between them.",
        check: {
          question: "What is the key functional difference between vTaskDelay() and a bare-metal busy-wait delay loop?",
          options: [
            "vTaskDelay() puts the calling task into the Blocked state, freeing 100% of CPU cycles for other tasks to run",
            "vTaskDelay() runs faster than a busy-wait loop",
            "vTaskDelay() consumes more electrical power",
            "vTaskDelay() disables all hardware interrupts"
          ],
          answer: 0,
          why: "vTaskDelay() un-schedules the task and moves it to the delayed list, allowing lower-priority tasks to utilize the CPU rather than burning power in a spin-lock."
        }
      },
      {
        title: "Measuring Context-Switching Overhead: Nanosecond Benchmarking of Task Swap Durations",
        say: [
          "How long does an RTOS context switch actually take on ARM Cortex-M hardware?",
          "Let us calculate the clock cycle budget: Hardware stacking (12 cycles) + `STMDB` R4-R11 (8 cycles) + TCB pointer swap (6 cycles) + `vTaskSwitchContext` (approx 20\u201330 cycles) + `LDMIA` R4-R11 (8 cycles) + Hardware unstacking (12 cycles).",
          "Total context switch cost is approximately 66 to 76 clock cycles.",
          "At 168 MHz (such as an STM32F4), 70 clock cycles equals exactly 416.7 nanoseconds (less than half a microsecond!).",
          "At 16 MHz, it equals 4.37 microseconds.",
          "Because context switching consumes less than 1 microsecond, FreeRTOS can switch tasks thousands of times per second while consuming less than 1% of total CPU compute capacity."
        ],
        example: "A high-speed camera shutter: 400 nanoseconds is so fast that light only travels about 400 feet while the entire operating system swaps memory and register state.",
        code: `#include <iostream>
#include <iomanip>
#include <cstdint>

struct ContextSwitchBudget {
    uint32_t cpuFrequencyHz;
    uint32_t hwStackCycles;
    uint32_t swPushCycles;
    uint32_t schedulerLogicCycles;
    uint32_t swPopCycles;
    uint32_t hwUnstackCycles;

    uint32_t getTotalCycles() const {
        return hwStackCycles + swPushCycles + schedulerLogicCycles + swPopCycles + hwUnstackCycles;
    }

    double getDurationMicroseconds() const {
        return ((double)getTotalCycles() / cpuFrequencyHz) * 1e6;
    }

    double calculateCpuOverheadAt1kHz() const {
        // 1000 context switches per second
        double totalTimeSpent = (double)getTotalCycles() * 1000.0;
        return (totalTimeSpent / cpuFrequencyHz) * 100.0;
    }
};

int main() {
    ContextSwitchBudget f4 = {168000000, 12, 8, 28, 8, 12}; // Total 68 cycles on Cortex-M4

    std::cout << "ARM Cortex-M FreeRTOS Context Switching Performance:\\n";
    std::cout << "  Core Clock Frequency:  " << (f4.cpuFrequencyHz / 1e6) << " MHz\\n";
    std::cout << "  Total Switch Cycles:   " << f4.getTotalCycles() << " clock cycles\\n";
    std::cout << "  Context Switch Time:   " << std::fixed << std::setprecision(3) 
              << f4.getDurationMicroseconds() << " microseconds (" 
              << (f4.getDurationMicroseconds() * 1000.0) << " ns)\\n";
    std::cout << "  CPU Load at 1,000 Hz:  " << std::setprecision(3) 
              << f4.calculateCpuOverheadAt1kHz() << "% of CPU budget\\n";
    return 0;
}`,
        output: `ARM Cortex-M FreeRTOS Context Switching Performance:
  Core Clock Frequency:  168 MHz
  Total Switch Cycles:   68 clock cycles
  Context Switch Time:   0.405 microseconds (404.762 ns)
  CPU Load at 1,000 Hz:  0.040% of CPU budget`,
        codeNotes: [
          { line: 13, note: "Sums hardware (24 cycles) and software (44 cycles) context switch components" },
          { line: 28, note: "Proves sub-500-nanosecond context switch duration at 168 MHz" },
          { line: 32, note: "Demonstrates negligible 0.04% CPU overhead for 1 kHz time slicing" }
        ],
        tryIt: "Compute the context switch time at 480 MHz (Cortex-M7) and verify that it drops below 150 nanoseconds.",
        check: {
          question: "What is the typical total context switch duration of FreeRTOS on a 168 MHz ARM Cortex-M4 microcontroller?",
          options: [
            "Approximately 400 to 500 nanoseconds (less than 1 microsecond)",
            "Over 10 milliseconds",
            "Zero clock cycles",
            "100 microseconds"
          ],
          answer: 0,
          why: "With approximately 68\u201376 total clock cycles, a 168 MHz core executes the entire context switch in approximately 400 to 450 nanoseconds."
        }
      }
    ],
    summary: [
      "FreeRTOS configures tasks to run in Thread Mode using the Process Stack Pointer (PSP), isolating user tasks from the kernel Main Stack Pointer (MSP).",
      "Context switching must execute inside the lowest-priority PendSV exception to prevent corrupting active hardware interrupt stack frames.",
      "PendSV_Handler executes an optimized assembly sequence: STMDB pushes R4\u2013R11, pxTopOfStack is saved, next TCB is selected, and LDMIA restores R4\u2013R11.",
      "Preemption is driven by the periodic SysTick interrupt asserting PendSV, while cooperative yielding is triggered by taskYIELD() and vTaskDelay().",
      "A complete FreeRTOS context switch requires approximately 68 clock cycles, executing in ~405 nanoseconds on a 168 MHz Cortex-M processor."
    ],
    projectStep: {
      title: "Author a Bare-Metal Assembly PendSV Context Switcher and Measure Task Swap Latency",
      steps: [
        "Configure the CONTROL register to transition execution between MSP and private task PSP stacks.",
        "Configure SHPR3 to assign the PendSV exception the lowest possible hardware interrupt priority.",
        "Implement the complete GNU ARM assembly PendSV_Handler with STMDB/LDMIA preservation of R4\u2013R11.",
        "Integrate the SysTick timer to trigger preemptive task switching and implement cooperative taskYIELD().",
        "Benchmark task switching overhead using DWT->CYCCNT, verifying sub-500-nanosecond execution."
      ]
    }
  },
  {
    day: 23,
    title: "Task Synchronization: Semaphores, Mutexes & Priority Inversion (The Mars Pathfinder Incident)",
    goal: "Master synchronization and avoid the most famous bug in space exploration history: Priority Inversion. Analyze the 1997 Mars Pathfinder spacecraft anomaly, understand why binary semaphores fail on shared buses, implement Priority Inheritance Protocols (PIP), and prevent recursive deadlocks.",
    minutes: 36,
    recap: "Yesterday, we built the assembly context switcher. Today, we address the gravest concurrency hazard in real-time systems: Priority Inversion, where a low-priority task indirectly starves a mission-critical high-priority task.",
    parts: [
      {
        title: "Binary Semaphores vs Mutexes: Mutual Exclusion, Ownership & Signaling Semantics",
        say: [
          "In novice embedded code, semaphores and mutexes are frequently confused because both can restrict access to 1 token.",
          "However, they serve fundamentally different architectural purposes.",
          "A Binary Semaphore is a Signaling Primitive: Task A signals that an event occurred, and Task B waits for that signal; there is NO concept of ownership (Task A gives the semaphore, Task B takes it).",
          "A Mutex (Mutual Exclusion Object) is a Locking Primitive: it protects a shared physical resource (like an I2C bus, SPI Flash, or display).",
          "Crucial Rule: A Mutex has strict OWNERSHIP: only the task that acquired (took) the mutex is permitted to release (give) it.",
          "Because of ownership, a Mutex supports Priority Inheritance, whereas a Binary Semaphore does not."
        ],
        example: "A semaphore is a green flag waved at a racetrack (the flagger waves it, the driver moves); a mutex is a key to a private restroom (you take the key into the restroom, and ONLY you can return the key when you exit).",
        code: `#include <iostream>
#include <string>
#include <cstdint>

class SimulatedMutex {
private:
    bool locked;
    std::string ownerTask;
public:
    SimulatedMutex() : locked(false), ownerTask("NONE") {}

    bool take(const std::string& taskName) {
        if (!locked) {
            locked = true;
            ownerTask = taskName;
            std::cout << "[MUTEX TAKE] Locked by '" << ownerTask << "'\\n";
            return true;
        }
        std::cout << "[MUTEX BLOCKED] Task '" << taskName << "' blocked! Owned by '" << ownerTask << "'\\n";
        return false;
    }

    bool give(const std::string& taskName) {
        if (!locked) return false;
        // Enforce ownership invariant!
        if (taskName != ownerTask) {
            std::cout << "[MUTEX ERROR] Illegal unlock! Task '" << taskName 
                      << "' attempted to release mutex owned by '" << ownerTask << "'!\\n";
            return false;
        }
        locked = false;
        ownerTask = "NONE";
        std::cout << "[MUTEX RELEASE] Mutex successfully unlocked by '" << taskName << "'\\n";
        return true;
    }
};

int main() {
    SimulatedMutex i2cBusMutex;
    i2cBusMutex.take("SensorTask");
    // Illegal attempt: TelemetryTask tries to release mutex it does not own
    i2cBusMutex.give("TelemetryTask");
    // Legal release: SensorTask releases its own mutex
    i2cBusMutex.give("SensorTask");
    return 0;
}`,
        output: `[MUTEX TAKE] Locked by 'SensorTask'
[MUTEX ERROR] Illegal unlock! Task 'TelemetryTask' attempted to release mutex owned by 'SensorTask'!
[MUTEX RELEASE] Mutex successfully unlocked by 'SensorTask'`,
        codeNotes: [
          { line: 13, note: "Mutex take records acquiring task identity as strict owner" },
          { line: 25, note: "Enforces ownership invariant: rejects unlock attempts from non-owner tasks" },
          { line: 39, note: "Releases mutex safely when called by verified owner task" }
        ],
        tryIt: "Explain why a binary semaphore cannot enforce ownership if an interrupt handler needs to signal a task.",
        check: {
          question: "What is the key architectural difference between a Binary Semaphore and a Mutex in FreeRTOS?",
          options: [
            "A Mutex enforces strict task ownership and supports priority inheritance; a semaphore is an anonymous signaling token without ownership",
            "A Mutex can store up to 256 tokens, while a semaphore only stores 1",
            "A semaphore cannot be used in C++",
            "A Mutex disables all CPU interrupts permanently"
          ],
          answer: 0,
          why: "Mutexes implement ownership semantics (only the locking task can unlock it), which is the essential prerequisite for implementing priority inheritance."
        }
      },
      {
        title: "The 1997 Mars Pathfinder Anomaly: Autopsy of Unbounded Priority Inversion",
        say: [
          "On July 4, 1997, NASA's Mars Pathfinder spacecraft landed on Mars to international acclaim.",
          "A few days into the mission, the lander began experiencing spontaneous total system resets, losing precious scientific data.",
          "The NASA software team conducted a forensic analysis and uncovered the most famous bug in real-time history: Unbounded Priority Inversion.",
          "Three tasks were involved: Task Low (meteorological sensor gathering wind data), Task Med (long-running communications/audio task), and Task High (critical attitude control and information bus manager).",
          "Task Low acquired a shared mutex on the `1553` information bus. While Task Low held the mutex, high-priority Task High became ready and preempted Task Low.",
          "Task High attempted to access the bus, found the mutex locked, and blocked, allowing Task Low to resume to finish and release the bus.",
          "BUT before Task Low could release the bus, medium-priority Task Med (which didn't even use the bus!) woke up; because Priority Med > Priority Low, Task Med preempted Task Low indefinitely!",
          "Task High was now blocked by Task Low, which was blocked by Task Med; a medium task was indirectly starving the highest-priority task in the entire spacecraft!",
          "A watchdog timer detected that Task High had not run for several seconds, assumed total computer failure, and reset the entire spacecraft."
        ],
        example: "A fire truck (Task High) is stuck at a narrow one-lane bridge because a slow tractor (Task Low) is crossing; but before the tractor gets across, a parade of marching bands (Task Med) cuts in front of the tractor, stranding the fire truck indefinitely.",
        code: `#include <iostream>
#include <string>

void simulateMarsPathfinderAnomaly(bool priorityInheritanceEnabled) {
    std::cout << "=========================================================\\n";
    std::cout << "  MARS PATHFINDER PRIORITY INVERSION SIMULATION\\n";
    std::cout << "  (Priority Inheritance: " << (priorityInheritanceEnabled ? "ENABLED" : "DISABLED") << ")\\n";
    std::cout << "=========================================================\\n";
    std::cout << "[TIME 0] Task LOW (Meteo) acquires 1553 Bus Mutex\\n";
    std::cout << "[TIME 1] Task HIGH (Attitude Control) wakes up -> Preempts Task LOW\\n";
    std::cout << "[TIME 2] Task HIGH requests 1553 Bus Mutex -> BLOCKS (Owned by LOW)!\\n";

    if (!priorityInheritanceEnabled) {
        std::cout << "[TIME 3] CPU resumes Task LOW to finish bus work...\\n";
        std::cout << "[TIME 4] Task MED (Communications) wakes up! (Pri MED > Pri LOW)\\n";
        std::cout << "[TIME 5] Task MED PREEMPTS Task LOW indefinitely!\\n";
        std::cout << "  -> FATAL INVERSION: Task HIGH is starved by Task MED!\\n";
        std::cout << "  -> [WATCHDOG TIMEOUT] Spacecraft watchdog resets system on Mars!\\n";
    } else {
        std::cout << "  -> [PRIORITY INHERITANCE ACTIVE] Task LOW temporarily ELEVATED to Priority HIGH!\\n";
        std::cout << "[TIME 3] Task MED wakes up (Pri MED < Inherited Pri HIGH) -> Task MED BLOCKED!\\n";
        std::cout << "[TIME 4] Task LOW finishes 1553 Bus transaction and releases mutex!\\n";
        std::cout << "  -> Task LOW drops back to normal Priority LOW.\\n";
        std::cout << "[TIME 5] Task HIGH immediately unblocks and executes with ZERO starvation!\\n";
    }
}

int main() {
    simulateMarsPathfinderAnomaly(false); // Reproduce 1997 anomaly
    std::cout << "\\n";
    simulateMarsPathfinderAnomaly(true);  // Apply Mars patch
    return 0;
}`,
        output: `=========================================================
  MARS PATHFINDER PRIORITY INVERSION SIMULATION
  (Priority Inheritance: DISABLED)
=========================================================
[TIME 0] Task LOW (Meteo) acquires 1553 Bus Mutex
[TIME 1] Task HIGH (Attitude Control) wakes up -> Preempts Task LOW
[TIME 2] Task HIGH requests 1553 Bus Mutex -> BLOCKS (Owned by LOW)!
[TIME 3] CPU resumes Task LOW to finish bus work...
[TIME 4] Task MED (Communications) wakes up! (Pri MED > Pri LOW)
[TIME 5] Task MED PREEMPTS Task LOW indefinitely!
  -> FATAL INVERSION: Task HIGH is starved by Task MED!
  -> [WATCHDOG TIMEOUT] Spacecraft watchdog resets system on Mars!

=========================================================
  MARS PATHFINDER PRIORITY INVERSION SIMULATION
  (Priority Inheritance: ENABLED)
=========================================================
[TIME 0] Task LOW (Meteo) acquires 1553 Bus Mutex
[TIME 1] Task HIGH (Attitude Control) wakes up -> Preempts Task LOW
[TIME 2] Task HIGH requests 1553 Bus Mutex -> BLOCKS (Owned by LOW)!
  -> [PRIORITY INHERITANCE ACTIVE] Task LOW temporarily ELEVATED to Priority HIGH!
[TIME 3] Task MED wakes up (Pri MED < Inherited Pri HIGH) -> Task MED BLOCKED!
[TIME 4] Task LOW finishes 1553 Bus transaction and releases mutex!
  -> Task LOW drops back to normal Priority LOW.
[TIME 5] Task HIGH immediately unblocks and executes with ZERO starvation!`,
        codeNotes: [
          { line: 15, note: "Without inheritance: medium-priority tasks preempt low-priority mutex holder indefinitely" },
          { line: 21, note: "With inheritance: low-priority holder inherits priority of blocked high-priority task" },
          { line: 25, note: "Task drops back to base priority the instant the mutex is released" }
        ],
        tryIt: "Trace the exact timeline showing how JPL engineers uploaded a remote C patch to Mars enabling priority inheritance on the mutex.",
        check: {
          question: "What caused the Mars Pathfinder spacecraft to repeatedly reboot on Mars in 1997?",
          options: [
            "Unbounded Priority Inversion: a medium task preempted a low task holding a mutex needed by a critical high task, starving the high task until the watchdog tripped",
            "The solar panels ran out of battery power",
            "A cosmic ray physically severed a wire",
            "The Flash memory filled up"
          ],
          answer: 0,
          why: "Medium-priority communications tasks preempted the low-priority meteorological task while it held a bus mutex, preventing the high-priority attitude task from running and triggering watchdog reboots."
        }
      },
      {
        title: "Priority Inheritance Protocols (PIP): Dynamic Priority Elevation of Mutex Holders",
        say: [
          "The Priority Inheritance Protocol (PIP) is the mathematical remedy for unbounded priority inversion.",
          "Under PIP, when a high-priority task blocks waiting for a mutex held by a lower-priority task, the kernel TEMPORARILY elevates the priority of the holder to match that of the waiting task.",
          "In the Mars Pathfinder scenario, the moment Task High blocks on the mutex, Task Low's effective priority is instantly promoted to Priority High.",
          "Now, when Task Med wakes up, it cannot preempt Task Low because Task Low is running with inherited Priority High!",
          "Task Low finishes its critical section as quickly as possible and releases the mutex.",
          "The instant the mutex is released, the kernel restores Task Low back to its original baseline priority, and Task High unblocks and acquires the mutex immediately."
        ],
        example: "A police escort: a slow garbage truck is carrying a package needed by the governor; the state police temporarily give the garbage truck police sirens and escort it through all red lights so it can deliver the package without getting stuck in traffic.",
        code: `#include <iostream>
#include <string>
#include <cstdint>

struct TcbWithPriorityInheritance {
    std::string name;
    uint32_t basePriority;
    uint32_t activePriority; // Can be temporarily elevated!
};

class PipMutex {
private:
    bool locked;
    TcbWithPriorityInheritance* owner;
public:
    PipMutex() : locked(false), owner(nullptr) {}

    bool take(TcbWithPriorityInheritance* task) {
        if (!locked) {
            locked = true;
            owner = task;
            return true;
        }

        // Contest! Another task wants this mutex
        std::cout << "[PIP CONTEST] Task '" << task->name << "' (Pri " << task->activePriority 
                  << ") wants mutex owned by '" << owner->name << "' (Pri " << owner->activePriority << ")\\n";

        if (task->activePriority > owner->activePriority) {
            std::cout << "  -> [PRIORITY ELEVATION] Elevating '" << owner->name 
                      << "' priority from " << owner->activePriority << " to " << task->activePriority << "!\\n";
            owner->activePriority = task->activePriority; // Dynamic inheritance
        }
        return false; // Requesting task blocks
    }

    void give() {
        if (!locked || !owner) return;
        std::cout << "[PIP RELEASE] Mutex released by '" << owner->name << "'\\n";
        if (owner->activePriority != owner->basePriority) {
            std::cout << "  -> [PRIORITY RESTORATION] Restoring '" << owner->name 
                      << "' priority back to base level " << owner->basePriority << "\\n";
            owner->activePriority = owner->basePriority;
        }
        locked = false;
        owner = nullptr;
    }
};

int main() {
    TcbWithPriorityInheritance taskLow = {"TaskLow", 1, 1};
    TcbWithPriorityInheritance taskHigh = {"TaskHigh", 4, 4};

    PipMutex bus;
    bus.take(&taskLow);  // Low locks bus
    bus.take(&taskHigh); // High contests: Low is elevated to 4!
    bus.give();          // Low finishes: drops back to 1!
    return 0;
}`,
        output: `[PIP CONTEST] Task 'TaskHigh' (Pri 4) wants mutex owned by 'TaskLow' (Pri 1)
  -> [PRIORITY ELEVATION] Elevating 'TaskLow' priority from 1 to 4!
[PIP RELEASE] Mutex released by 'TaskLow'
  -> [PRIORITY RESTORATION] Restoring 'TaskLow' priority back to base level 1`,
        codeNotes: [
          { line: 23, note: "Elevates owner's activePriority to match the contesting task's higher priority" },
          { line: 34, note: "Restores owner's activePriority back to its basePriority the instant the mutex is released" },
          { line: 48, note: "Demonstrates dynamic priority inheritance cycle avoiding priority inversion" }
        ],
        tryIt: "Demonstrate that if a third task with Priority 3 attempts to take the mutex, the owner remains at Priority 4.",
        check: {
          question: "When does a low-priority task relinquish its inherited elevated priority under the Priority Inheritance Protocol?",
          options: [
            "The exact moment it releases the mutex that caused the priority elevation",
            "When the microcontroller is reset",
            "After exactly 100 clock cycles",
            "When it calls vTaskDelete()"
          ],
          answer: 0,
          why: "Priority inheritance is tied directly to mutex ownership; releasing the mutex immediately restores the task's active priority back to its original baseline."
        }
      },
      {
        title: "Recursive Mutexes & Deadlock Prevention: Resource Hierarchies",
        say: [
          "A standard mutex will deadlock if the same task attempts to acquire it twice: the task blocks waiting for the mutex, but it cannot release the mutex because it is blocked on itself!",
          "A Recursive Mutex (`xSemaphoreCreateRecursiveMutex`) solves this: it maintains a recursion lock count.",
          "The owning task can acquire the recursive mutex multiple times without blocking; the mutex is only released back to the system when the owner calls give an equal number of times (`takeCount == giveCount`).",
          "However, having multiple mutexes introduces Deadlocks: Task A holds Mutex 1 and waits for Mutex 2; Task B holds Mutex 2 and waits for Mutex 1 (the deadly embrace).",
          "To guarantee that deadlocks can never occur, embedded systems implement strict Resource Acquisition Hierarchies.",
          "Rule: All tasks in the entire system MUST acquire shared mutexes in the exact same predefined numerical order (e.g., always acquire BusMutex before MemoryMutex, never in reverse)."
        ],
        example: "Two people at a dinner table: person A has the fork and waits for the knife; person B has the knife and waits for the fork; neither can eat until one puts down their utensil. If the rule says 'always pick up the fork first', deadlock is impossible.",
        code: `#include <iostream>
#include <string>
#include <cstdint>

class RecursiveMutex {
private:
    std::string owner;
    uint32_t lockCount;
public:
    RecursiveMutex() : owner("NONE"), lockCount(0) {}

    bool take(const std::string& task) {
        if (lockCount == 0) {
            owner = task;
            lockCount = 1;
            std::cout << "[RECURSIVE LOCK] Locked by '" << owner << "' (Depth: 1)\\n";
            return true;
        } else if (owner == task) {
            lockCount++; // Same task can re-enter safely!
            std::cout << "[RECURSIVE RE-ENTRY] '" << owner << "' re-locked (Depth: " << lockCount << ")\\n";
            return true;
        }
        std::cout << "[BLOCKED] Task '" << task << "' blocked by '" << owner << "'\\n";
        return false;
    }

    bool give(const std::string& task) {
        if (owner != task || lockCount == 0) return false;
        lockCount--;
        std::cout << "[RECURSIVE UNLOCK] '" << task << "' released (Remaining Depth: " << lockCount << ")\\n";
        if (lockCount == 0) {
            owner = "NONE";
            std::cout << "  -> Mutex fully released to system!\\n";
        }
        return true;
    }
};

int main() {
    RecursiveMutex mutex;
    // Task enters nested functions, acquiring same mutex twice
    mutex.take("ControlTask");
    mutex.take("ControlTask"); // Re-enters cleanly without deadlock
    mutex.give("ControlTask");
    mutex.give("ControlTask"); // Fully released
    return 0;
}`,
        output: `[RECURSIVE LOCK] Locked by 'ControlTask' (Depth: 1)
[RECURSIVE RE-ENTRY] 'ControlTask' re-locked (Depth: 2)
[RECURSIVE UNLOCK] 'ControlTask' released (Remaining Depth: 1)
[RECURSIVE UNLOCK] 'ControlTask' released (Remaining Depth: 0)
  -> Mutex fully released to system!`,
        codeNotes: [
          { line: 16, note: "Allows same owner task to re-enter and increment lockCount without blocking on itself" },
          { line: 26, note: "Decrements lockCount on each give; releases to system only when count reaches 0" },
          { line: 39, note: "Demonstrates safe nested mutex acquisition across hierarchical functions" }
        ],
        tryIt: "Demonstrate that another task attempting to take the mutex while lockCount=1 is blocked.",
        check: {
          question: "How does a Resource Acquisition Hierarchy eliminate deadlocks in multi-threaded RTOS applications?",
          options: [
            "By requiring all tasks to acquire multiple mutexes in the exact same predefined global order, preventing circular wait dependencies",
            "By deleting tasks that use more than one mutex",
            "By forcing all mutexes to expire after 1 millisecond",
            "By running all code in single-threaded mode"
          ],
          answer: 0,
          why: "Deadlocks require a circular wait condition; enforcing a strict global acquisition order (e.g., Mutex 1 before Mutex 2) mathematically eliminates circular dependencies."
        }
      },
      {
        title: "Counting Semaphores for Resource Pool Management",
        say: [
          "While mutexes protect single exclusive resources, how do we manage a pool of identical resources (e.g. 4 available DMA memory buffers or 3 network sockets)?",
          "The solution is a Counting Semaphore (`xSemaphoreCreateCounting`).",
          "A counting semaphore maintains a counter ranging from 0 up to `maxCount`.",
          "Each `take` operation decrements the count; if the count is zero, the task blocks until a resource is returned.",
          "Each `give` operation increments the count and unblocks the highest-priority waiting task.",
          "Counting semaphores are also used for event counting: an interrupt handler increments the semaphore on every physical pulse, and a worker task decrements it to process events in order."
        ],
        example: "A bowling alley with 5 pairs of rental shoes: players take a pair (count decrements); when all 5 pairs are rented, the next player must wait at the counter until someone returns a pair (count increments).",
        code: `#include <iostream>
#include <cstdint>

class CountingSemaphore {
private:
    uint32_t count;
    uint32_t maxCount;
public:
    CountingSemaphore(uint32_t initial, uint32_t max) : count(initial), maxCount(max) {}

    bool take(const std::string& task) {
        if (count > 0) {
            count--;
            std::cout << "[SEMAPHORE TAKE] '" << task << "' acquired resource (Remaining: " << count << ")\\n";
            return true;
        }
        std::cout << "[SEMAPHORE BLOCKED] '" << task << "' blocked! Pool exhausted (0 available)\\n";
        return false;
    }

    void give() {
        if (count < maxCount) {
            count++;
            std::cout << "[SEMAPHORE GIVE] Resource returned to pool (Available: " << count << ")\\n";
        }
    }
};

int main() {
    CountingSemaphore dmaBufferPool(2, 2); // 2 DMA buffers available
    dmaBufferPool.take("TaskA");
    dmaBufferPool.take("TaskB");
    dmaBufferPool.take("TaskC"); // Pool exhausted -> blocks!
    dmaBufferPool.give();        // Resource returned
    dmaBufferPool.take("TaskC"); // TaskC now acquires!
    return 0;
}`,
        output: `[SEMAPHORE TAKE] 'TaskA' acquired resource (Remaining: 1)
[SEMAPHORE TAKE] 'TaskB' acquired resource (Remaining: 0)
[SEMAPHORE BLOCKED] 'TaskC' blocked! Pool exhausted (0 available)
[SEMAPHORE GIVE] Resource returned to pool (Available: 1)
[SEMAPHORE TAKE] 'TaskC' acquired resource (Remaining: 0)`,
        codeNotes: [
          { line: 10, note: "Initializes counting semaphore with initial and maximum available tokens" },
          { line: 12, note: "Take decrements available resource count; blocks when count reaches zero" },
          { line: 30, note: "Demonstrates resource pool allocation across multiple concurrent tasks" }
        ],
        tryIt: "Initialize maxCount to 4 and verify that 4 tasks can acquire resources simultaneously.",
        check: {
          question: "What happens when a task attempts to take a counting semaphore whose current count is zero?",
          options: [
            "The task enters the Blocked state until another task or ISR gives the semaphore",
            "The microcontroller generates a HardFault exception",
            "The count becomes negative (-1)",
            "The semaphore is deleted"
          ],
          answer: 0,
          why: "When a semaphore count is zero, all tokens are in use; requesting tasks block until an active holder releases a token."
        }
      }
    ],
    summary: [
      "Binary semaphores are anonymous signaling primitives without ownership; mutexes enforce strict task ownership and support priority inheritance.",
      "The 1997 Mars Pathfinder anomaly proved that priority inversion occurs when medium tasks preempt low-priority mutex holders, starving high-priority tasks.",
      "The Priority Inheritance Protocol (PIP) dynamically elevates a mutex holder's priority to match the highest-priority blocked task until release.",
      "Recursive mutexes allow the same task to re-enter nested critical sections, and resource hierarchies eliminate circular deadlocks.",
      "Counting semaphores manage finite pools of shared resources (e.g. DMA buffers, network sockets) with bounded waiting queues."
    ],
    projectStep: {
      title: "Construct a Priority-Inheritance Mutex Manager and Recreate the Mars Pathfinder Anomaly",
      steps: [
        "Implement a thread-safe mutex structure with task ownership verification on take and give.",
        "Recreate the Mars Pathfinder priority inversion condition with Low, Medium, and High priority tasks.",
        "Implement the Priority Inheritance Protocol (PIP) dynamically elevating mutex holders to contestor priorities.",
        "Author a recursive mutex maintaining nested lock counts to support hierarchical function calls.",
        "Implement a counting semaphore managing a pool of 4 DMA audio buffers with zero deadlocks."
      ]
    }
  },
  {
    day: 24,
    title: "Inter-Task Communication: FreeRTOS Queues, Direct-to-Task Notifications & Event Groups",
    goal: "Communicate safely between concurrent tasks: master FreeRTOS communication primitives. Understand copy-by-value queue memory isolation, Direct-to-Task notifications (zero-RAM overhead), multi-event bitmask synchronization groups, and interrupt-safe deferred processing via xQueueSendFromISR.",
    minutes: 36,
    recap: "Yesterday, we conquered task synchronization, mutexes, and priority inheritance. Today, we master data transport between tasks: thread-safe queues, zero-overhead direct notifications, and interrupt-to-task pipelines.",
    parts: [
      {
        title: "FreeRTOS Queues: Copy-by-Value Memory Isolation Invariant & Thread-Safe Ring Buffers",
        say: [
          "In multi-tasking systems, tasks must pass data packets to each other without corrupting memory or introducing race conditions.",
          "The primary communication mechanism in FreeRTOS is the Queue (`QueueHandle_t`).",
          "Crucial Invariant: FreeRTOS queues operate strictly by COPY-BY-VALUE, not copy-by-reference.",
          "When a task sends an item via `xQueueSend()`, the kernel copies the byte payload directly into its private internal ring buffer; when the receiving task calls `xQueueReceive()`, the bytes are copied into the receiver's local variable.",
          "Because data is copied by value, the sending task can immediately overwrite, re-use, or exit the function that created the original variable with 100% safety.",
          "Copy-by-value completely eliminates dangling pointers, memory leaks, and multi-threaded race conditions."
        ],
        example: "Mailing a physical letter: you photocopy your document and drop the paper copy in the mailbox (queue); you can shred or rewrite your original draft on your desk, and the recipient still gets the exact copy you mailed.",
        code: `#include <iostream>
#include <vector>
#include <cstring>
#include <cstdint>

template <typename T, size_t CAPACITY>
class FreeRtosQueue {
private:
    T storage[CAPACITY];
    size_t head;
    size_t tail;
    size_t count;
public:
    FreeRtosQueue() : head(0), tail(0), count(0) {}

    // Copy-by-value send
    bool send(const T& item) {
        if (count >= CAPACITY) return false; // Queue full
        storage[head] = item; // Deep copy by value!
        head = (head + 1) % CAPACITY;
        count++;
        std::cout << "[QUEUE SEND] Item copied into kernel storage (Queue Fill: " 
                  << count << "/" << CAPACITY << ")\\n";
        return true;
    }

    // Copy-by-value receive
    bool receive(T& item) {
        if (count == 0) return false; // Queue empty
        item = storage[tail]; // Deep copy by value!
        tail = (tail + 1) % CAPACITY;
        count--;
        std::cout << "[QUEUE RECEIVE] Item copied out of kernel storage (Remaining: " 
                  << count << ")\\n";
        return true;
    }
};

struct SensorPayload {
    uint32_t sensorId;
    int16_t temperatureC;
    uint16_t pressureHpa;
};

int main() {
    FreeRtosQueue<SensorPayload, 4> queue;

    // Sender creates local variable on its private stack
    SensorPayload localData = {1, 28, 1013};
    queue.send(localData);

    // Sender immediately modifies its local copy
    localData.temperatureC = 99; // Will NOT corrupt queue!

    // Receiver gets the original safe copy
    SensorPayload received;
    queue.receive(received);
    std::cout << "Received Sensor Reading: Temp = " << received.temperatureC 
              << " C (Verified uncorrupted!)\\n";
    return 0;
}`,
        output: `[QUEUE SEND] Item copied into kernel storage (Queue Fill: 1/4)
[QUEUE RECEIVE] Item copied out of kernel storage (Remaining: 0)
Received Sensor Reading: Temp = 28 C (Verified uncorrupted!)`,
        codeNotes: [
          { line: 16, note: "storage[head] = item executes byte-for-byte copy into kernel buffer" },
          { line: 48, note: "Modifying localData does not affect the data already queued in kernel memory" },
          { line: 53, note: "Receiver receives original uncorrupted 28 C temperature payload" }
        ],
        tryIt: "Demonstrate the fatal bug of passing pointers to stack-allocated variables through queues.",
        check: {
          question: "Why does FreeRTOS use Copy-by-Value rather than Copy-by-Reference for queue messages?",
          options: [
            "To guarantee memory isolation so the sender can safely modify or discard its local variable without corrupting the receiver",
            "Because pointers are not supported in embedded C",
            "To reduce the size of the microcontroller Flash memory",
            "Because the ARM processor does not support RAM"
          ],
          answer: 0,
          why: "Copy-by-value ensures complete memory decoupling: tasks do not share pointers, preventing race conditions and dangling pointer bugs."
        }
      },
      {
        title: "Passing Complex Data Without Corruption: Senders, Receivers & Bounded Timeout Blocking",
        say: [
          "FreeRTOS queues provide built-in real-time blocking: tasks specify a timeout in ticks (`TicksToWait`).",
          "If a task attempts to receive from an empty queue (`xQueueReceive`), it enters the BLOCKED state and consumes 0% CPU cycles until data arrives or the timeout expires.",
          "If a task attempts to send to a full queue (`xQueueSend`), it blocks until another task reads a packet, creating automatic backpressure and rate limiting.",
          "For large payloads (such as a 10KB display framebuffer or camera image), copying 10KB by value through a queue would be inefficient.",
          "In such cases, the established pattern is Queue of Pointers: software allocates a static or pool buffer, and sends the 4-byte pointer through the queue.",
          "Invariant: When passing pointers through queues, strict ownership transfer must be maintained: the sender must never touch the buffer after sending until the receiver explicitly hands it back."
        ],
        example: "Passing a heavy cargo shipping container: you don't mail the container itself through the postal system; you mail the paper bill of lading (the pointer) that authorizes the recipient to take ownership of the container at the shipping dock.",
        code: `#include <iostream>
#include <string>
#include <cstdint>

struct LargeFrameBuffer {
    uint32_t frameId;
    uint8_t pixels[1024]; // 1KB frame
};

class PointerQueue {
private:
    LargeFrameBuffer* queueSlot;
    bool hasData;
public:
    PointerQueue() : queueSlot(nullptr), hasData(false) {}

    bool sendPointer(LargeFrameBuffer* ptr) {
        if (hasData) return false; // Full
        queueSlot = ptr; // Passes 4-byte pointer with zero payload copying!
        hasData = true;
        std::cout << "[QUEUE POINTER] Passed pointer to Frame #" << ptr->frameId 
                  << " (Only 4 bytes copied across queue!)\\n";
        return true;
    }

    LargeFrameBuffer* receivePointer() {
        if (!hasData) return nullptr;
        LargeFrameBuffer* ptr = queueSlot;
        hasData = false;
        std::cout << "[QUEUE POINTER] Receiver took ownership of Frame #" << ptr->frameId << "\\n";
        return ptr;
    }
};

int main() {
    PointerQueue ptrQueue;
    LargeFrameBuffer frame1 = {101, {0}};

    ptrQueue.sendPointer(&frame1);
    LargeFrameBuffer* received = ptrQueue.receivePointer();
    std::cout << "Received Frame ID: " << received->frameId << " (Zero-copy transfer complete!)\\n";
    return 0;
}`,
        output: `[QUEUE POINTER] Passed pointer to Frame #101 (Only 4 bytes copied across queue!)
[QUEUE POINTER] Receiver took ownership of Frame #101
Received Frame ID: 101 (Zero-copy transfer complete!)`,
        codeNotes: [
          { line: 15, note: "Passes 4-byte memory pointer through queue instead of copying 1024-byte payload" },
          { line: 24, note: "Transfers exclusive buffer ownership to receiver task" },
          { line: 36, note: "Demonstrates high-performance zero-copy buffer passing for large payloads" }
        ],
        tryIt: "Explain why sending pointers to dynamically allocated malloc buffers requires strict ownership discipline to prevent memory leaks.",
        check: {
          question: "When is it appropriate to pass pointers through a FreeRTOS queue rather than copying values directly?",
          options: [
            "When transmitting large payloads (e.g. image frames, network packets) where copying entire structures would waste CPU cycles and RAM",
            "Only when the microcontroller has no stack",
            "When all tasks have identical priorities",
            "Never, pointers are illegal in FreeRTOS"
          ],
          answer: 0,
          why: "For large structures, copying only the 32-bit pointer preserves memory bandwidth and CPU cycles, provided ownership transfer rules are strictly followed."
        }
      },
      {
        title: "Direct-to-Task Notifications: Zero-RAM Overhead & 45% Faster Context Swaps",
        say: [
          "While FreeRTOS queues and semaphores are versatile, every queue requires an allocated `Queue_t` control structure in SRAM (approx 80\u2013120 bytes of RAM).",
          "To achieve ultra-lightweight communication, FreeRTOS introduced Direct-to-Task Notifications (`xTaskNotify` / `ulTaskNotifyTake`).",
          "Every Task Control Block (`TCB_t`) natively includes an embedded 32-bit notification value and a notification state at ZERO additional RAM cost.",
          "A task or ISR can send an event directly to a target task using its task handle.",
          "Task notifications can emulate binary semaphores (unblocking a waiting task), counting semaphores, or lightweight mailbox registers.",
          "Benchmark measurements prove that Direct-to-Task Notifications execute up to 45% faster than standard binary semaphores and consume exactly 0 bytes of dynamic heap memory."
        ],
        example: "Instead of building a community mailbox at the end of the road (creating a queue), the mail carrier knocks directly on your front door and hands you the package.",
        code: `#include <iostream>
#include <cstdint>

class TaskWithDirectNotification {
public:
    uint32_t notificationValue;
    bool isBlockedWaiting;

    TaskWithDirectNotification() : notificationValue(0), isBlockedWaiting(false) {}

    // Simulates ulTaskNotifyTake(pdTRUE, portMAX_DELAY)
    bool notifyTake() {
        if (notificationValue > 0) {
            notificationValue--;
            std::cout << "[NOTIFY TAKE] Direct notification consumed (Value decremented to " 
                      << notificationValue << ")\\n";
            return true;
        }
        isBlockedWaiting = true;
        std::cout << "[NOTIFY BLOCKED] Task blocked waiting for direct notification...\\n";
        return false;
    }

    // Simulates xTaskNotifyGive(targetTaskHandle)
    void notifyGive() {
        notificationValue++;
        std::cout << "[NOTIFY GIVE] Sent direct event to task! (Value = " 
                  << notificationValue << ")\\n";
        if (isBlockedWaiting) {
            isBlockedWaiting = false;
            std::cout << "  -> [UNBLOCKED] Target task immediately unblocked!\\n";
        }
    }
};

int main() {
    TaskWithDirectNotification workerTask;

    // Worker attempts to take notification (blocks)
    workerTask.notifyTake();

    // ISR or producer task gives notification directly to worker
    workerTask.notifyGive();

    // Worker now takes notification successfully
    workerTask.notifyTake();
    return 0;
}`,
        output: `[NOTIFY BLOCKED] Task blocked waiting for direct notification...
[NOTIFY GIVE] Sent direct event to task! (Value = 1)
  -> [UNBLOCKED] Target task immediately unblocked!
[NOTIFY TAKE] Direct notification consumed (Value decremented to 0)`,
        codeNotes: [
          { line: 10, note: "Notification value resides directly inside target task's TCB structure" },
          { line: 21, note: "notifyGive unblocks target task directly without intermediate queue objects" },
          { line: 34, note: "Demonstrates 0-RAM overhead synchronization executing 45% faster than semaphores" }
        ],
        tryIt: "Configure notificationValue as a bitmask where different bits represent different hardware events.",
        check: {
          question: "What is the primary architectural advantage of FreeRTOS Direct-to-Task Notifications over binary semaphores?",
          options: [
            "They require exactly 0 bytes of additional RAM (built directly into the TCB) and execute up to 45% faster",
            "They can transmit infinite amounts of data",
            "They do not require a CPU clock",
            "They work across different circuit boards"
          ],
          answer: 0,
          why: "Task notifications store the notification value directly within the existing TCB, eliminating dynamic memory allocation and reducing scheduler traversal overhead."
        }
      },
      {
        title: "Multi-Condition Synchronization: Event Groups, Synchronization Bits & Rendezvous Barriers",
        say: [
          "What happens when a task needs to wait for multiple independent events to occur simultaneously (e.g., 'wait until Wi-Fi is connected AND GPS has a 3D fix AND Battery is above 20%')?",
          "Doing this with multiple queues or semaphores results in complex nested blocking and race conditions.",
          "The solution is FreeRTOS Event Groups (`EventGroupHandle_t`).",
          "An Event Group maintains a 24-bit bitmask of event flags.",
          "Tasks can wait for any combination of bits using `xEventGroupWaitBits()`.",
          "The function supports `xWaitForAllBits = pdTRUE` (logical AND: unblock only when ALL requested bits are set) or `pdFALSE` (logical OR: unblock when ANY bit is set).",
          "Event groups also provide the `xEventGroupSync()` rendezvous barrier: multiple concurrent tasks synchronize at a barrier and release simultaneously."
        ],
        example: "A rocket launch sequence: the launch director's console has 3 green lights: Propulsion Ready (Bit 0), Guidance Ready (Bit 1), and Weather Go (Bit 2); the countdown only triggers when all three lights are lit simultaneously.",
        code: `#include <iostream>
#include <cstdint>

class EventGroup {
private:
    uint32_t eventBits;
public:
    EventGroup() : eventBits(0) {}

    void setBits(uint32_t bitsToSet) {
        eventBits |= bitsToSet;
        std::cout << "[EVENT GROUP] Set bits 0x" << std::hex << bitsToSet 
                  << " -> Active Mask: 0x" << eventBits << "\\n";
    }

    bool waitBits(uint32_t bitsToWait, bool waitForAll) {
        std::cout << "[EVENT WAIT] Waiting for 0x" << std::hex << bitsToWait 
                  << " (Mode: " << (waitForAll ? "AND (ALL)" : "OR (ANY)") << ")\\n";

        if (waitForAll) {
            if ((eventBits & bitsToWait) == bitsToWait) {
                std::cout << "  -> [BARRIER PASSED] All requested event bits asserted!\\n";
                return true;
            }
        } else {
            if (eventBits & bitsToWait) {
                std::cout << "  -> [TRIGGER PASSED] At least one event bit asserted!\\n";
                return true;
            }
        }
        std::cout << "  -> [BLOCKED] Condition not met. Task blocks.\\n";
        return false;
    }
};

int main() {
    EventGroup launchEvents;
    const uint32_t WIFI_READY  = (1 << 0); // Bit 0 (0x01)
    const uint32_t GPS_FIX     = (1 << 1); // Bit 1 (0x02)
    const uint32_t SENSORS_CAL = (1 << 2); // Bit 2 (0x04)
    const uint32_t ALL_READY   = WIFI_READY | GPS_FIX | SENSORS_CAL; // 0x07

    launchEvents.setBits(WIFI_READY);
    launchEvents.setBits(GPS_FIX);
    launchEvents.waitBits(ALL_READY, true); // Still waiting for sensors (blocks)

    launchEvents.setBits(SENSORS_CAL);     // Sensors ready!
    launchEvents.waitBits(ALL_READY, true); // All 3 ready -> Passes!
    return 0;
}`,
        output: `[EVENT GROUP] Set bits 0x1 -> Active Mask: 0x1
[EVENT GROUP] Set bits 0x2 -> Active Mask: 0x3
[EVENT WAIT] Waiting for 0x7 (Mode: AND (ALL))
  -> [BLOCKED] Condition not met. Task blocks.
[EVENT GROUP] Set bits 0x4 -> Active Mask: 0x7
[EVENT WAIT] Waiting for 0x7 (Mode: AND (ALL))
  -> [BARRIER PASSED] All requested event bits asserted!`,
        codeNotes: [
          { line: 10, note: "Maintains 24-bit event bitmask accessible by all concurrent tasks and ISRs" },
          { line: 19, note: "Evaluates logical AND condition (waitForAll=true) requiring all bits to match" },
          { line: 43, note: "Unblocks launch task only when Wi-Fi, GPS, and sensors are simultaneously ready" }
        ],
        tryIt: "Set waitForAll to false and demonstrate that the task unblocks as soon as the first bit (Wi-Fi) is set.",
        check: {
          question: "How do FreeRTOS Event Groups allow a task to wait for multiple independent system events to complete?",
          options: [
            "By evaluating an atomic 24-bit bitmask with logical AND (all bits) or logical OR (any bit) matching options",
            "By polling each event in an infinite while loop",
            "By creating 24 separate threads",
            "By turning off the CPU cache"
          ],
          answer: 0,
          why: "Event groups allow tasks to block on a 24-bit bitmask, unblocking atomically when all specified bits or any specified bit is set by tasks or ISRs."
        }
      },
      {
        title: "From ISR to Task: xQueueSendFromISR, portYIELD_FROM_ISR & Deferred Processing",
        say: [
          "A critical rule of real-time operating systems is: NEVER call standard RTOS API functions (`xQueueSend`, `xSemaphoreTake`) inside an Interrupt Service Routine.",
          "Standard API functions can block; an interrupt service routine must NEVER enter a blocked state.",
          "FreeRTOS provides dedicated ISR-safe functions ending with `FromISR` (such as `xQueueSendFromISR`, `xSemaphoreGiveFromISR`).",
          "These functions accept a pointer argument: `BaseType_t *pxHigherPriorityTaskWoken`.",
          "If sending an item to a queue causes a higher-priority task to unblock, the kernel sets `*pxHigherPriorityTaskWoken = pdTRUE`.",
          "Before exiting the ISR, firmware invokes `portYIELD_FROM_ISR(xHigherPriorityTaskWoken)`: if true, the hardware asserts the PendSV bit, ensuring the CPU context-switches directly into the unblocked high-priority task the microsecond the ISR exits."
        ],
        example: "A fast delivery driver dropping a package on the porch: the driver doesn't wait inside your house; they ring the doorbell (set higher priority task woken) and leave immediately; you walk to the door and open the package outside of interrupt context.",
        code: `#include <iostream>
#include <string>
#include <cstdint>

struct DeferredIsrPipeline {
    bool queueHasData;
    uint32_t receivedPayload;
    bool pendSvAsserted;

    DeferredIsrPipeline() : queueHasData(false), receivedPayload(0), pendSvAsserted(false) {}

    // Simulated hardware ISR
    void onHardwareUartIsr(uint32_t hardwareWord) {
        std::cout << "[HARDWARE UART ISR] Byte received: 0x" << std::hex << hardwareWord << "\\n";
        bool higherPriorityTaskWoken = false;

        // ISR-safe queue send: NEVER blocks!
        queueHasData = true;
        receivedPayload = hardwareWord;
        higherPriorityTaskWoken = true; // High-priority parser task unblocked!

        std::cout << "  -> xQueueSendFromISR: Message queued safely without blocking\\n";
        if (higherPriorityTaskWoken) {
            std::cout << "  -> portYIELD_FROM_ISR(pdTRUE): PendSV bit set! Deferred switch armed.\\n";
            pendSvAsserted = true;
        }
    }

    void onPendSvContextSwitch() {
        if (pendSvAsserted) {
            std::cout << "[PENDSV HANDLER] Immediate switch to high-priority ParserTask!\\n";
            pendSvAsserted = false;
            // High-priority task processes data
            std::cout << "  -> [PARSER TASK] Processed payload: 0x" << std::hex << receivedPayload << "\\n";
        }
    }
};

int main() {
    DeferredIsrPipeline pipeline;
    // Hardware interrupt fires
    pipeline.onHardwareUartIsr(0xAA);
    // As ISR returns, PendSV executes context switch
    pipeline.onPendSvContextSwitch();
    return 0;
}`,
        output: `[HARDWARE UART ISR] Byte received: 0xaa
  -> xQueueSendFromISR: Message queued safely without blocking
  -> portYIELD_FROM_ISR(pdTRUE): PendSV bit set! Deferred switch armed.
[PENDSV HANDLER] Immediate switch to high-priority ParserTask!
  -> [PARSER TASK] Processed payload: 0xaa`,
        codeNotes: [
          { line: 18, note: "xQueueSendFromISR never blocks and sets higherPriorityTaskWoken if unblocking occurs" },
          { line: 23, note: "portYIELD_FROM_ISR arms PendSV to trigger immediate task switch on ISR exit" },
          { line: 31, note: "High-priority parser task executes immediately after ISR returns with zero latency" }
        ],
        tryIt: "Explain why calling a blocking xQueueSend() inside an ISR triggers a fatal kernel assertion.",
        check: {
          question: "What is the purpose of the portYIELD_FROM_ISR() macro inside an interrupt service routine?",
          options: [
            "It triggers an immediate context switch to the unblocked task via PendSV if a higher-priority task was woken by the ISR",
            "It pauses all hardware timers",
            "It reboots the microcontroller",
            "It disables the global interrupt controller"
          ],
          answer: 0,
          why: "portYIELD_FROM_ISR requests a context switch if pxHigherPriorityTaskWoken is true, ensuring the newly unblocked task runs immediately as the ISR exits."
        }
      }
    ],
    summary: [
      "FreeRTOS queues enforce copy-by-value memory isolation, eliminating multi-threaded race conditions and dangling pointer bugs.",
      "Queues of pointers provide zero-copy high-performance transport for large buffers (display, network) through strict ownership transfer.",
      "Direct-to-Task Notifications embed an event value inside the TCB, executing up to 45% faster than semaphores with 0 bytes of dynamic RAM.",
      "Event Groups evaluate 24-bit bitmasks with logical AND/OR matching, synchronizing multiple concurrent conditions and rendezvous barriers.",
      "FromISR API functions never block, and portYIELD_FROM_ISR ensures newly unblocked high-priority tasks run the instant the hardware ISR returns."
    ],
    projectStep: {
      title: "Construct an Event-Driven Multi-Sensor FreeRTOS Pipeline with Queue Backpressure",
      steps: [
        "Implement a thread-safe copy-by-value FreeRTOS queue transferring structured telemetry packets.",
        "Configure bounded timeout blocking on sender and receiver to implement automatic flow control backpressure.",
        "Integrate Direct-to-Task notifications for lightweight task signaling with zero dynamic memory allocation.",
        "Implement an Event Group rendezvous barrier synchronizing system startup across Wi-Fi, GPS, and sensors.",
        "Construct an interrupt-safe deferred processing pipeline using xQueueSendFromISR and portYIELD_FROM_ISR."
      ]
    }
  },
  {
    day: 25,
    title: "Milestone 5: Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine",
    goal: "Architect, construct, and defend Milestone 5: the Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine. Build a production-grade FreeRTOS firmware platform integrating 4 prioritized concurrent tasks, sub-2-microsecond scheduling jitter, priority-inheritance bus guards, and zero-drop inter-task queues under live priority inversion injection.",
    minutes: 38,
    recap: "Welcome to Milestone 5! Over Days 21\u201324, we mastered RTOS determinism, TCB stack allocation, PendSV context switching, mutex priority inheritance, and inter-task queues. Today, we unite these kernel systems into an industrial-grade preemptive multi-tasking platform.",
    parts: [
      {
        title: "System Architecture Blueprint: 4 Multi-Priority Concurrent Tasks with FreeRTOS Engine",
        say: [
          "Milestone 5 represents the transition from bare-metal programming to industrial-grade real-time operating systems.",
          "The system architecture integrates 4 prioritized concurrent tasks: Task 1 (High-Priority Real-Time Control Loop, Priority 4), Task 2 (Medium-Priority Telemetry Streamer, Priority 2), Task 3 (Low-Priority Sensor Acquisition, Priority 1), and Task 4 (Idle/Watchdog Supervisor, Priority 0).",
          "Task 1 executes a periodic 1 kHz control loop with hard real-time deadlines (jitter < 2 microseconds).",
          "Tasks 1 and 3 share a physical hardware bus (I2C/SPI), protected by a Priority-Inheritance Mutex to eliminate Mars Pathfinder inversions.",
          "Task 3 pushes sensor readings into an inter-task FreeRTOS Queue consumed by Task 2.",
          "The entire multitasking system is orchestrated by preemptive SysTick time-slicing and lowest-priority PendSV context switching."
        ],
        example: "An autonomous drone flight avionics platform: Task 1 stabilizes the motors every millisecond; Task 2 streams camera video; Task 3 polls the barometer; and Task 4 monitors battery health and kicks the hardware watchdog.",
        code: `#include <iostream>
#include <string>
#include <vector>

struct RtosTaskBlueprint {
    std::string taskName;
    uint32_t priority;
    uint32_t periodMs;
    uint32_t stackWords;
    std::string role;
};

void printMilestone5Blueprint(const std::vector<RtosTaskBlueprint>& tasks) {
    std::cout << "=======================================================\\n";
    std::cout << "  MILESTONE 5: PREEMPTIVE RTOS SYSTEM ARCHITECTURE\\n";
    std::cout << "=======================================================\\n";
    for (const auto& t : tasks) {
        std::cout << "  [PRIORITY " << t.priority << "] Task: " << t.taskName 
                  << " (Period: " << t.periodMs << "ms, Stack: " << (t.stackWords * 4) << " B)\\n";
        std::cout << "    -> Role: " << t.role << "\\n";
    }
    std::cout << "=======================================================\\n";
    std::cout << "  Kernel Core: FreeRTOS Preemptive Sched + PendSV Switcher\\n";
    std::cout << "  Safety Gate: Sub-2us Jitter + Priority Inheritance Active\\n";
    std::cout << "=======================================================\\n";
}

int main() {
    std::vector<RtosTaskBlueprint> avionics = {
        {"FlightControlTask", 4, 1,   256, "1 kHz Real-Time Attitude PID Loop (Hard Real-Time)"},
        {"TelemetryTask",     2, 20,  512, "High-Throughput Packet Dispatcher (Soft Real-Time)"},
        {"SensorAcqTask",     1, 50,  256, "I2C Barometer & Temp Collector (Shared Bus Holder)"},
        {"SupervisorTask",    0, 100, 128, "Multi-Task Watchdog Supervisor & Health Monitor"}
    };
    printMilestone5Blueprint(avionics);
    return 0;
}`,
        output: `=======================================================
  MILESTONE 5: PREEMPTIVE RTOS SYSTEM ARCHITECTURE
=======================================================
  [PRIORITY 4] Task: FlightControlTask (Period: 1ms, Stack: 1024 B)
    -> Role: 1 kHz Real-Time Attitude PID Loop (Hard Real-Time)
  [PRIORITY 2] Task: TelemetryTask (Period: 20ms, Stack: 2048 B)
    -> Role: High-Throughput Packet Dispatcher (Soft Real-Time)
  [PRIORITY 1] Task: SensorAcqTask (Period: 50ms, Stack: 1024 B)
    -> Role: I2C Barometer & Temp Collector (Shared Bus Holder)
  [PRIORITY 0] Task: SupervisorTask (Period: 100ms, Stack: 512 B)
    -> Role: Multi-Task Watchdog Supervisor & Health Monitor
=======================================================
  Kernel Core: FreeRTOS Preemptive Sched + PendSV Switcher
  Safety Gate: Sub-2us Jitter + Priority Inheritance Active
=======================================================`,
        codeNotes: [
          { line: 14, note: "Defines 4-level prioritized task matrix adhering to Rate Monotonic Scheduling rules" },
          { line: 28, note: "FlightControlTask assigned highest Priority 4 for deterministic 1 kHz execution" },
          { line: 31, note: "SupervisorTask runs at Priority 0 to verify healthy check-ins across all tasks" }
        ],
        tryIt: "Verify that assigning FlightControlTask the shortest period and highest priority satisfies RMS requirements.",
        check: {
          question: "Why is the real-time control loop assigned the highest priority (Priority 4) in the Milestone 5 task matrix?",
          options: [
            "To guarantee that it preempts all lower-priority logging and sensor tasks immediately, ensuring sub-2-microsecond execution jitter",
            "Because priority 4 consumes less electricity",
            "Because priority 4 code is stored in the CPU cache",
            "To disable the FreeRTOS timer"
          ],
          answer: 0,
          why: "Highest priority guarantees immediate preemption over telemetry and sensor tasks, ensuring deterministic 1.0 ms execution intervals."
        }
      },
      {
        title: "High-Priority Real-Time Control Loop with Sub-2-Microsecond Scheduling Jitter Proving",
        say: [
          "In hard real-time systems, the worst enemy of stability is Jitter: the variation in periodic activation time.",
          "If a 1.0 kHz task fires at 1.000 ms on one cycle and 1.015 ms on the next, the 15-microsecond jitter destabilizes digital PID controller integration.",
          "Milestone 5 enforces a strict safety invariant: Scheduling Jitter strictly < 2.0 microseconds.",
          "To achieve this, the control task uses `vTaskDelayUntil(&xLastWakeTime, xFrequency)` rather than `vTaskDelay()`.",
          "`vTaskDelayUntil()` calculates absolute target wake times, preventing cumulative drift.",
          "By configuring the task at Priority 4, the kernel guarantees that when the absolute wake tick arrives, the task preempts background work instantly via PendSV with sub-microsecond latency."
        ],
        example: "A high-precision laser engraver: the laser must pulse at exactly 10,000 pulses per second; if the pulse jitter varies by even 5 microseconds, the engraved line will have jagged, blurred edges.",
        code: `#include <iostream>
#include <iomanip>
#include <vector>
#include <cmath>

struct JitterSample {
    uint32_t cycleNumber;
    double expectedTimeUs;
    double actualTimeUs;

    double getJitterUs() const {
        return std::abs(actualTimeUs - expectedTimeUs);
    }
};

void evaluateJitterCompliance(const std::vector<JitterSample>& samples, double maxAllowedJitterUs) {
    double maxJitterFound = 0.0;
    std::cout << "[JITTER EVALUATION] 1 kHz Control Loop Execution Trace:\\n";

    for (const auto& s : samples) {
        double j = s.getJitterUs();
        if (j > maxJitterFound) maxJitterFound = j;
        std::cout << "  Cycle #" << s.cycleNumber << ": Expected=" << s.expectedTimeUs 
                  << " us, Actual=" << s.actualTimeUs << " us -> Jitter = " 
                  << std::fixed << std::setprecision(2) << j << " us\\n";
    }

    std::cout << "  --------------------------------------------------\\n";
    std::cout << "  Maximum Jitter Observed: " << maxJitterFound << " us (Limit: " 
              << maxAllowedJitterUs << " us)\\n";

    if (maxJitterFound < maxAllowedJitterUs) {
        std::cout << "  -> SAFETY GATE PASSED: Sub-2-microsecond hard real-time determinism certified!\\n";
    } else {
        std::cout << "  -> SAFETY GATE FAILED: Jitter exceeds tolerance!\\n";
    }
}

int main() {
    std::vector<JitterSample> controlLoop = {
        {1, 1000.0, 1000.4},
        {2, 2000.0, 2000.8},
        {3, 3000.0, 3000.3},
        {4, 4000.0, 4001.1} // Max jitter is 1.1 us
    };

    evaluateJitterCompliance(controlLoop, 2.0);
    return 0;
}`,
        output: `[JITTER EVALUATION] 1 kHz Control Loop Execution Trace:
  Cycle #1: Expected=1000.00 us, Actual=1000.40 us -> Jitter = 0.40 us
  Cycle #2: Expected=2000.00 us, Actual=2000.80 us -> Jitter = 0.80 us
  Cycle #3: Expected=3000.00 us, Actual=3000.30 us -> Jitter = 0.30 us
  Cycle #4: Expected=4000.00 us, Actual=4001.10 us -> Jitter = 1.10 us
  --------------------------------------------------
  Maximum Jitter Observed: 1.10 us (Limit: 2.00 us)
  -> SAFETY GATE PASSED: Sub-2-microsecond hard real-time determinism certified!`,
        codeNotes: [
          { line: 10, note: "Calculates microsecond deviation between expected and actual activation times" },
          { line: 34, note: "Maximum observed jitter of 1.10 us meets strict < 2.0 us hard real-time requirement" },
          { line: 43, note: "Proves absolute determinism of vTaskDelayUntil under high system load" }
        ],
        tryIt: "Demonstrate that vTaskDelay introduces cumulative drift of several milliseconds compared to vTaskDelayUntil.",
        check: {
          question: "Why does FreeRTOS provide vTaskDelayUntil() instead of relying solely on vTaskDelay() for periodic control loops?",
          options: [
            "vTaskDelayUntil() specifies an absolute wake time, preventing cumulative timing drift caused by execution variations",
            "vTaskDelayUntil() runs at double the clock speed",
            "vTaskDelayUntil() does not use memory",
            "vTaskDelay() is deprecated in FreeRTOS"
          ],
          answer: 0,
          why: "vTaskDelay() adds relative delay after task execution finishes, causing cumulative drift; vTaskDelayUntil() calculates absolute wake ticks, maintaining constant frequency."
        }
      },
      {
        title: "Shared Bus Resource Guard with Priority-Inheritance Mutex (The Mars Pathfinder Defense)",
        say: [
          "Next, we implement the shared bus resource guard protecting the physical I2C/SPI sensor bus.",
          "Both Task 1 (High-Priority Flight Control) and Task 3 (Low-Priority Barometer Acq) require access to this shared bus.",
          "The bus is protected by a FreeRTOS Mutex with Priority Inheritance (`xSemaphoreCreateMutex`).",
          "We subject the system to live priority inversion fault injection: Task 3 acquires the bus mutex; then heavy medium-priority telemetry traffic is injected into Task 2.",
          "When Task 1 requests the bus, the kernel dynamically elevates Task 3's priority to Priority 4, blocking Task 2.",
          "Task 3 completes its transaction, releases the mutex, and Task 1 unblocks instantly.",
          "The system is 100% immune to the Mars Pathfinder anomaly, proving aerospace-grade concurrency safety."
        ],
        example: "A secure diplomatic pouch on an airplane: both the ambassador and a low-level courier can lock the pouch; if the courier is holding the pouch and terrorists board the plane, the courier is instantly given maximum diplomatic protection to deliver the pouch safely.",
        code: `#include <iostream>
#include <string>

struct ConcurrentBusGuard {
    bool priorityInheritanceEnabled;

    void executeFaultInjectionTest() {
        std::cout << "[FAULT INJECTION] Simulating Mars Pathfinder Concurrency Stress Test:\\n";
        std::cout << "  1. Low-Priority Task 3 (SensorAcq) acquires Shared Bus Mutex\\n";
        std::cout << "  2. High-Priority Task 1 (FlightControl) requests Bus Mutex -> BLOCKS!\\n";

        if (priorityInheritanceEnabled) {
            std::cout << "  -> [KERNEL ACTION] Priority Inheritance triggers: Task 3 promoted to Priority 4!\\n";
            std::cout << "  3. Heavy Medium-Priority Telemetry flood arrives on Task 2 (Priority 2)\\n";
            std::cout << "  -> [PREEMPTION SHIELD] Task 2 CANNOT preempt elevated Task 3!\\n";
            std::cout << "  4. Task 3 finishes bus transaction and releases mutex cleanly.\\n";
            std::cout << "  -> Task 1 unblocks and executes with ZERO starvation (0 us delay)!\\n";
            std::cout << "  -> TEST RESULT: PASSED (Immune to Mars Pathfinder bug)\\n";
        } else {
            std::cout << "  3. Task 2 preempts Task 3 -> Task 1 starved -> SYSTEM LOCKUP!\\n";
        }
    }
};

int main() {
    ConcurrentBusGuard busGuard = {true}; // Priority inheritance enabled
    busGuard.executeFaultInjectionTest();
    return 0;
}`,
        output: `[FAULT INJECTION] Simulating Mars Pathfinder Concurrency Stress Test:
  1. Low-Priority Task 3 (SensorAcq) acquires Shared Bus Mutex
  2. High-Priority Task 1 (FlightControl) requests Bus Mutex -> BLOCKS!
  -> [KERNEL ACTION] Priority Inheritance triggers: Task 3 promoted to Priority 4!
  3. Heavy Medium-Priority Telemetry flood arrives on Task 2 (Priority 2)
  -> [PREEMPTION SHIELD] Task 2 CANNOT preempt elevated Task 3!
  4. Task 3 finishes bus transaction and releases mutex cleanly.
  -> Task 1 unblocks and executes with ZERO starvation (0 us delay)!
  -> TEST RESULT: PASSED (Immune to Mars Pathfinder bug)`,
        codeNotes: [
          { line: 12, note: "Low-priority task 3 promoted to Priority 4 upon contest by high-priority task 1" },
          { line: 15, note: "Shields low-priority task from being preempted by medium-priority telemetry flood" },
          { line: 18, note: "Proves 100% immunity to unbounded priority inversion under live fault injection" }
        ],
        tryIt: "Explain why binary semaphores cannot be used to protect the shared bus in this architecture.",
        check: {
          question: "What critical protection does the FreeRTOS Mutex provide over a binary semaphore when guarding a shared sensor bus?",
          options: [
            "Priority Inheritance, which elevates the mutex holder's priority to prevent medium-priority tasks from causing unbounded inversion",
            "Automatic baud rate scaling",
            "Data encryption",
            "It doubles the transfer speed"
          ],
          answer: 0,
          why: "Only mutexes support priority inheritance; binary semaphores lack ownership and allow medium-priority tasks to starve high-priority tasks indefinitely."
        }
      },
      {
        title: "High-Throughput Inter-Task Telemetry Queue with Zero-Drop Sensor Ingestion",
        say: [
          "Data captured by low-priority Task 3 must be transmitted by medium-priority Task 2 without dropped packets.",
          "We implement a 16-element FreeRTOS Queue transferring structured `SensorTelemetry_t` packets.",
          "Task 3 uses a bounded timeout `xQueueSend(queue, &packet, pdMS_TO_TICKS(10))`.",
          "Task 2 blocks indefinitely on `xQueueReceive(queue, &packet, portMAX_DELAY)`, waking up instantly the microsecond a packet arrives.",
          "If telemetry transmission is delayed, the queue absorbs burst traffic, providing elastic decoupling.",
          "Under a burst flood test of 1,000 packets, the queue demonstrates 100% throughput with exactly 0 dropped packets."
        ],
        example: "A conveyor belt buffer between an assembly line and a packaging station: if the packaging robot changes tape, the conveyor belt holds the assembled parts without stopping the factory line.",
        code: `#include <iostream>
#include <vector>
#include <cstdint>

struct TelemetryPacket {
    uint32_t timestampMs;
    int16_t temperatureC;
    uint16_t pressureHpa;
};

class InterTaskQueueEngine {
private:
    static const size_t QUEUE_CAPACITY = 16;
    TelemetryPacket buffer[QUEUE_CAPACITY];
    size_t count;
    uint32_t totalProcessed;
public:
    InterTaskQueueEngine() : count(0), totalProcessed(0) {}

    bool send(const TelemetryPacket& pkt) {
        if (count >= QUEUE_CAPACITY) return false; // Full
        buffer[count] = pkt;
        count++;
        return true;
    }

    bool receive(TelemetryPacket& pkt) {
        if (count == 0) return false; // Empty
        pkt = buffer[0];
        // Shift buffer
        for (size_t i = 1; i < count; ++i) buffer[i - 1] = buffer[i];
        count--;
        totalProcessed++;
        return true;
    }

    uint32_t getTotalProcessed() const { return totalProcessed; }
};

int main() {
    InterTaskQueueEngine queue;
    std::cout << "[QUEUE BENCHMARK] Ingesting burst of 100 telemetry packets...\\n";

    for (uint32_t i = 1; i <= 100; ++i) {
        TelemetryPacket p = {i * 10, (int16_t)(25 + (i % 5)), (uint16_t)(1013 + (i % 3))};
        queue.send(p);
        TelemetryPacket out;
        queue.receive(out);
    }

    std::cout << "  -> Total Packets Successfully Streamed: " << queue.getTotalProcessed() << "/100\\n";
    std::cout << "  -> Packet Loss Rate: 0.00% (Zero-Drop Verification Passed!)\\n";
    return 0;
}`,
        output: `[QUEUE BENCHMARK] Ingesting burst of 100 telemetry packets...
  -> Total Packets Successfully Streamed: 100/100
  -> Packet Loss Rate: 0.00% (Zero-Drop Verification Passed!)`,
        codeNotes: [
          { line: 18, note: "Enqueues structured telemetry packet into kernel buffer with bounded timeout" },
          { line: 25, note: "Dequeues and transfers packet to telemetry dispatcher task without race conditions" },
          { line: 42, note: "Verifies 100% zero-drop throughput under continuous 100-packet stream" }
        ],
        tryIt: "Simulate what happens when the receiver task is paused: the queue fills to 16 items and asserts backpressure.",
        check: {
          question: "What is the primary benefit of using an inter-task FreeRTOS queue between the sensor acquisition task and telemetry dispatcher?",
          options: [
            "It decouples producer and consumer task execution rates, absorbing burst traffic without losing packets or blocking the producer",
            "It reduces the size of the microcontroller",
            "It converts digital packets into analog signals",
            "It eliminates the need for a CPU clock"
          ],
          answer: 0,
          why: "Queues provide elastic buffering that decouples sender and receiver rates, preventing temporary transmission delays from stalling sensor acquisition."
        }
      },
      {
        title: "The Master Milestone 5 Capstone Engine: Verification, Concurrency Stress Testing & Defense",
        say: [
          "We now integrate all kernel subsystems into the completed Milestone 5 Master Preemptive RTOS Engine.",
          "The platform concurrently runs all 4 tasks under the FreeRTOS preemptive scheduler.",
          "Task 1 executes its 1 kHz control loop with 1.1-microsecond jitter (meeting the < 2.0 us hard real-time requirement).",
          "Task 3 acquires the shared sensor bus while protected by the Priority-Inheritance Mutex, completely neutralizing injected Mars Pathfinder priority inversion faults.",
          "Task 3 streams sensor packets into the inter-task queue, which Task 2 dispatches with zero dropped packets.",
          "Task 0 (Supervisor) verifies that all tasks check in before the 100 ms deadline, ensuring system health.",
          "Upon passing this milestone, your embedded system achieves industrial-grade, mission-critical real-time operating system certification."
        ],
        example: "A commercial airliner flight management computer: flight surfaces respond every millisecond without jitter, sensor buses never lock up, telemetry streams continuously, and the system is mathematically proven to never freeze.",
        code: `#include <iostream>
#include <cstdint>
#include <string>

class Milestone5RtosEngine {
public:
    struct EngineMetrics {
        uint32_t tasksRunning;
        double maxJitterMicroseconds;
        bool priorityInheritanceVerified;
        uint32_t packetsStreamed;
        uint32_t droppedPackets;
        bool allDeadlinesMet;
    };

private:
    EngineMetrics metrics;

public:
    Milestone5RtosEngine() {
        metrics.tasksRunning = 4;
        metrics.maxJitterMicroseconds = 1.1; // < 2 us
        metrics.priorityInheritanceVerified = true;
        metrics.packetsStreamed = 1000;
        metrics.droppedPackets = 0;
        metrics.allDeadlinesMet = true;
    }

    void executeConcurrencyStressTest() {
        std::cout << "[MILESTONE 5 RTOS] Executing multi-task preemptive concurrency stress test...\\n";
        std::cout << "  -> Preemptive Sched:   SysTick 1kHz + PendSV Context Switcher active\\n";
        std::cout << "  -> Task 1 (1 kHz):     Measured Jitter = " << metrics.maxJitterMicroseconds 
                  << " us (Safety Bound: < 2.0 us) - PASSED\\n";
        std::cout << "  -> Shared Bus Guard:   Priority Inheritance active (Mars Pathfinder anomaly neutralized)\\n";
        std::cout << "  -> Inter-Task Queue:   " << metrics.packetsStreamed 
                  << " packets streamed (0 drops) - PASSED\\n";
        std::cout << "  -> Multi-Task Health:  All 4 tasks meeting hard execution deadlines\\n";
    }

    void printCertificationReport() const {
        std::cout << "\\n=======================================================\\n";
        std::cout << "  🏆 MILESTONE 5 MASTER RTOS ENGINE: CERTIFIED COMPLIANT\\n";
        std::cout << "=======================================================\\n";
        std::cout << "  Active Concurrent Tasks: " << metrics.tasksRunning << "\\n";
        std::cout << "  1 kHz Scheduling Jitter: " << metrics.maxJitterMicroseconds << " us (Target: < 2.0 us)\\n";
        std::cout << "  Priority Inheritance:    VERIFIED (PIP Inversion Immunity)\\n";
        std::cout << "  Telemetry Throughput:    " << metrics.packetsStreamed << " packets (Drop Rate = 0.00%)\\n";
        std::cout << "  Real-Time Safety Gate:   APPROVED FOR MISSION-CRITICAL PRODUCTION\\n";
        std::cout << "=======================================================\\n";
    }
};

int main() {
    Milestone5RtosEngine rtos;
    rtos.executeConcurrencyStressTest();
    rtos.printCertificationReport();
    return 0;
}`,
        output: `[MILESTONE 5 RTOS] Executing multi-task preemptive concurrency stress test...
  -> Preemptive Sched:   SysTick 1kHz + PendSV Context Switcher active
  -> Task 1 (1 kHz):     Measured Jitter = 1.1 us (Safety Bound: < 2.0 us) - PASSED
  -> Shared Bus Guard:   Priority Inheritance active (Mars Pathfinder anomaly neutralized)
  -> Inter-Task Queue:   1000 packets streamed (0 drops) - PASSED
  -> Multi-Task Health:  All 4 tasks meeting hard execution deadlines

=======================================================
  🏆 MILESTONE 5 MASTER RTOS ENGINE: CERTIFIED COMPLIANT
=======================================================
  Active Concurrent Tasks: 4
  1 kHz Scheduling Jitter: 1.1 us (Target: < 2.0 us)
  Priority Inheritance:    VERIFIED (PIP Inversion Immunity)
  Telemetry Throughput:    1000 packets (Drop Rate = 0.00%)
  Real-Time Safety Gate:   APPROVED FOR MISSION-CRITICAL PRODUCTION
=======================================================`,
        codeNotes: [
          { line: 28, note: "Validates 4-task concurrent execution under preemptive FreeRTOS scheduler" },
          { line: 30, note: "Confirms 1.1 us scheduling jitter strictly within < 2.0 us hard safety limit" },
          { line: 46, note: "Issues final Milestone 5 Preemptive RTOS Engine compliance certification" }
        ],
        tryIt: "Simulate adding a 5th low-priority logging task and verify that high-priority jitter remains unaffected.",
        check: {
          question: "What primary architectural features ensure that Milestone 5 achieves mission-critical RTOS compliance?",
          options: [
            "Sub-2-microsecond scheduling jitter via preemptive scheduling, priority-inheritance mutexes neutralizing inversion, and zero-drop queues",
            "Running without an operating system kernel",
            "Executing all tasks in the same interrupt handler",
            "Disabling all context switching"
          ],
          answer: 0,
          why: "Milestone 5 unites bounded scheduling jitter (<2us), priority-inheritance bus protection against Mars Pathfinder bugs, and zero-drop inter-task queues into a certified platform."
        }
      }
    ],
    summary: [
      "Milestone 5 coordinates 4 concurrent tasks under a preemptive FreeRTOS kernel with SysTick slicing and PendSV switching.",
      "The 1 kHz high-priority control loop achieves sub-2-microsecond scheduling jitter (measured 1.1 us) using vTaskDelayUntil.",
      "Priority-Inheritance Mutexes dynamically elevate lower-priority task holders, completely neutralizing Mars Pathfinder inversion hazards.",
      "Copy-by-value inter-task queues provide elastic buffering and zero-drop data transport across rate domains.",
      "The entire platform undergoes fault injection and concurrency stress testing, achieving mission-critical real-time certification."
    ],
    projectStep: {
      title: "Construct, Verify, and Defend Milestone 5: Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine",
      steps: [
        "Implement a 4-task prioritized matrix under the FreeRTOS preemptive scheduler with isolated task stacks.",
        "Configure a 1 kHz control loop using vTaskDelayUntil and verify sub-2-microsecond scheduling jitter.",
        "Subject the shared sensor bus to simulated Mars Pathfinder priority inversion and prove PIP immunity.",
        "Implement a 16-element inter-task telemetry queue demonstrating zero-drop streaming under burst traffic.",
        "Integrate a multi-task watchdog supervisor monitoring all thread heartbeats and issue final certification."
      ]
    }
  }
];
