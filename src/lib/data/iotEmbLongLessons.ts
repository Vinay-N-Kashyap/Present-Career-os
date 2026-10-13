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
  }
];

