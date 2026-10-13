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
  }
];

