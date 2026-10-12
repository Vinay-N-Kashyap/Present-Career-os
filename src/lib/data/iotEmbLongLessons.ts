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
  }
];
