// scripts/visuals/iot-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for IoT, Firmware & Embedded Systems (course-iot-embedded)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, ARM Cortex-M Silicon Physics, FreeRTOS Kernel Internals, Wireless Mesh, Secure Bootloaders, and FOTA.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const IOT_MONTH_1_SPECS: MasterclassDaySpec[] = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Microcontroller Silicon Anatomy: Harvard Architecture, Memory Maps & Linker Scripts (.ld)",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Foundational Hardware Intuition (Silicon Architecture & Memory Layout)",
    "spokenGoal": "Step inside silicon: understand what actually happens when electrons power up an ARM Cortex-M microcontroller. Compare Harvard architecture (separate instruction and data buses enabling simultaneous fetch) against Von Neumann architecture. Analyze the 4GB contiguous 32-bit physical memory map: Flash memory starting at 0x08000000, SRAM starting at 0x20000000, and Peripherals at 0x40000000. Deconstruct the GNU Linker Script (.ld): understand the .text, .data, .rodata, and .bss sections, and write the startup vector table that loads the Initial Main Stack Pointer (MSP) and jumps to Reset_Handler.",
    "conceptInvariant": "Boot Vector Invariant: On power-on reset, the ARM Cortex-M hardware core unconditionally reads the 32-bit word at physical address 0x00000000 into the Main Stack Pointer (MSP), and the 32-bit word at 0x00000004 into the Program Counter (PC); if either address is invalid or unaligned, the processor instantly triggers an unrecoverable HardFault.",
    "failureMode": "Omitting the alignment directive (.align 4) in the custom linker script before the vector table, causing the Reset_Handler vector to have bit 0 cleared (ARM state instead of Thumb state), triggering an immediate UsageFault on silicon boot.",
    "tryItFriction": "Write a minimal GNU Linker Script (.ld) and C startup vector table for an ARM Cortex-M4 MCU: define the FLASH (512KB) and RAM (128KB) memory regions, allocate stack top at the end of SRAM, zero-initialize the .bss section, copy initialized .data from Flash to SRAM, and branch to main().",
    "socraticHints": [
      "Why must the Program Counter (PC) target address in ARM Cortex-M vector tables always have bit 0 set to 1?",
      "Because ARM Cortex-M processors exclusively execute the Thumb-2 instruction set; bit 0 of a branch target indicates Thumb state (1). If bit 0 is 0, the core attempts ARM mode execution and faults!",
      "The C compiler sets this automatically when generating function pointers, but manual assembly vector tables must ensure the +1 Thumb bit is preserved."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware developer compiles a program with a 64KB static lookup table declared as 'static const uint32_t table[16384]'. After flashing, the MCU boots, but available SRAM dropped from 128KB to 64KB, causing an Out of Memory fault when allocating the heap. Why did a constant table consume SRAM?",
      "options": [
        "SRAM is required to execute any C code.",
        "Linker Script Section Misplacement: The linker script placed .rodata inside the RAM memory region instead of the FLASH memory region, or the variable was not qualified with 'const', causing the startup code to copy 64KB of read-only lookup data from Flash into precious volatile SRAM on boot.",
        "ARM Cortex-M cannot read data directly from Flash.",
        "The compiler optimization was set to -O0."
      ],
      "answerIdx": 1,
      "debrief": "Microcontroller Flash is non-volatile, read-only, and directly addressable on the instruction/data bus. Truly constant data qualified with 'const' should reside solely in Flash (.rodata) to preserve scarce SRAM for mutable runtime variables (.data, .bss, stack, and heap)."
    },
    "quests": [
      {
        "id": "iot-m1-d01-q1",
        "name": "ARM Cortex-M 4GB Memory Map Blueprint",
        "type": "concept",
        "desc": "Map physical address ranges for Code/Flash, SRAM, Peripherals, External RAM, and System Control Space (PPB) on Cortex-M."
      },
      {
        "id": "iot-m1-d01-q2",
        "name": "Linker Script Section Symbol Extractor",
        "type": "detective",
        "desc": "Inspect objdump and readelf outputs to trace how _sdata, _edata, _sbss, and _ebss symbols govern C runtime startup copying."
      },
      {
        "id": "iot-m1-d01-q3",
        "name": "Bare-Metal Cortex-M4 Linker & Startup Engine",
        "type": "mastery",
        "desc": "Author a complete linker script (.ld) and C startup file with zero-initialization of .bss and data relocation to RAM."
      },
      {
        "id": "iot-m1-d01-q4",
        "name": "3 AM SRE: HardFault on Boot After Firmware Update",
        "type": "incident",
        "desc": "Triage an unbootable factory device caused by a misaligned vector table offset in a custom bootloader linker script."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Memory-Mapped I/O (MMIO) Registers: The Volatile Keyword, Pointer Casting & Bitwise Physics",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Low-Level Systems Engineering (Hardware Registers & Compiler Optimization Invariants)",
    "spokenGoal": "Master the bridge between C code and physical silicon transistors: Memory-Mapped I/O (MMIO). Learn how every peripheral (GPIO, Timer, UART) is mapped to physical 32-bit addresses in memory. Understand why declaring register pointers without the 'volatile' keyword causes optimizing compilers (gcc -O2/-O3) to optimize away hardware poll loops. Master struct-based peripheral modeling with precise byte alignment and bitwise operations (AND, OR, XOR, NOT, shift).",
    "conceptInvariant": "Volatile Hardware Access Invariant: Every hardware register address accessed by software must be qualified with the 'volatile' type modifier, signaling to the optimizing compiler that the memory location can change spontaneously outside software flow and must never be cached in CPU registers or optimized away.",
    "failureMode": "Polling a hardware status register with 'while (!(UART->STATUS & RXNE));' where STATUS is declared as 'uint32_t' without volatile; gcc -O3 reads STATUS once into CPU register r0, creates an infinite loop around r0, and hangs the system forever when new bytes arrive.",
    "tryItFriction": "Construct a Struct-Based Peripheral Register Header in C for a Microcontroller GPIO port: define MODER, OTYPER, OSPEEDR, PUPDR, IDR, and ODR registers using volatile uint32_t fields, cast the peripheral base address (0x40020000) to the struct pointer, and toggle pin 5 using bitwise masks.",
    "socraticHints": [
      "What exact machine code does gcc generate for 'while (*reg == 0);' when 'reg' is declared without volatile under -O2?",
      "It loads the value at 'reg' once with 'LDR r1, [r0]', tests it once with 'CMP r1, #0', and if true, generates 'B .', looping back onto itself infinitely without ever re-reading memory!",
      "Adding 'volatile' forces the compiler to generate 'LDR r1, [r0]' inside every single iteration of the loop."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer writes a driver to read temperature from an ADC hardware register at 0x4001244C. The code reads: 'uint32_t *adc = (uint32_t*)0x4001244C; for(int i=0; i<10; i++) sum += *adc;'. Under debug build (-O0), the code reads 10 varying samples. Under release build (-O3), the loop sums the exact same sample 10 times. Why?",
      "options": [
        "The ADC hardware breaks at high compiler optimization.",
        "Compiler Register Hoisting: Because 'adc' was not declared as 'volatile uint32_t*', the optimizer deduced that memory address 0x4001244C does not change within the pure C loop, hoisted the load instruction outside the loop into a CPU register, and summed that cached register 10 times.",
        "ARM Cortex-M does not support loops in -O3.",
        "The clock to the ADC was turned off."
      ],
      "answerIdx": 1,
      "debrief": "Without 'volatile', the C compiler assumes all memory modifications are initiated exclusively by software within the program. Since no code writes to 'adc' inside the loop, the compiler is legally permitted under the C standard to read memory once and cache it in a CPU register."
    },
    "quests": [
      {
        "id": "iot-m1-d02-q1",
        "name": "C Memory-Mapped Struct Alignment Proof",
        "type": "concept",
        "desc": "Calculate byte offsets in a C struct and demonstrate that padding bytes alter peripheral register offsets if types mismatch."
      },
      {
        "id": "iot-m1-d02-q2",
        "name": "Volatile Disassembly Decompiler Audit",
        "type": "detective",
        "desc": "Compare ARM assembly output of a register polling loop with and without 'volatile' under arm-none-eabi-gcc -O3."
      },
      {
        "id": "iot-m1-d02-q3",
        "name": "Peripheral Register Header & Bitmask Driver",
        "type": "mastery",
        "desc": "Implement a full GPIO driver in C using type-safe struct pointers, bit shifts, and atomic bitmask clearing/setting macros."
      },
      {
        "id": "iot-m1-d02-q4",
        "name": "3 AM SRE: Infinite Polling Loop in Production Sensor Driver",
        "type": "incident",
        "desc": "Resolve a production deadlock where an MCU froze in a telemetry polling loop after upgrading the compiler toolchain to GCC 13 with -O3."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Atomic Register Operations: BSRR vs ODR, Read-Modify-Write Hazards & Bit-Banding Physics",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Concurrency & Hardware Safety (Race Conditions in Hardware Registers)",
    "spokenGoal": "Confront hardware race conditions: understand why updating Output Data Registers (ODR) with 'GPIOA->ODR |= (1 << 5);' causes devastating intermittent bugs in embedded systems. Analyze the Read-Modify-Write (RMW) cycle in assembly: three separate CPU cycles (LDR, ORR, STR) that can be interrupted midway by an Interrupt Service Routine (ISR) modifying another pin on the same port. Master atomic hardware bit manipulation using Bit Set/Reset Registers (BSRR) and ARM Cortex-M Bit-Banding memory aliases.",
    "conceptInvariant": "Atomic Register Mutation Invariant: Any hardware register shared between the main execution thread and an Interrupt Service Routine (or multiple RTOS tasks) must be mutated using atomic hardware set/reset registers (e.g., BSRR) or protected by critical section interrupt masking.",
    "failureMode": "Using 'GPIO->ODR |= (1 << 5)' in the main loop while an ISR toggles pin 6 with 'GPIO->ODR &= ~(1 << 6)'; if the ISR fires between the main thread's LDR and STR, the ISR's modification is silently wiped out, freezing an external motor controller.",
    "tryItFriction": "Simulate and verify the Read-Modify-Write race condition in C: toggle pins on a shared GPIO port concurrently from main() and a high-frequency SysTick ISR using ODR; demonstrate lost updates, and then refactor to atomic BSRR writes to achieve 100% glitch-free execution.",
    "socraticHints": [
      "Why does writing a 1 to bit 21 of GPIOA->BSRR clear pin 5 instead of setting it?",
      "In ARM Cortex-M GPIO architectures, BSRR is a 32-bit register where the lower 16 bits (0-15) atomic set pins, and the upper 16 bits (16-31) atomic reset pins (bit 16+5 = 21 resets pin 5)!",
      "Writing 0 to any bit in BSRR has zero effect, meaning multiple threads can write without masking or reading previous port state."
    ],
    "situationalPuzzle": {
      "scenario": "A medical device has an alarm buzzer on GPIOA Pin 0 and a heart-rate strobe on GPIOA Pin 1. Under normal testing, both work. During clinical trials, the buzzer occasionally fails to sound when an alarm occurs simultaneously with a heartbeat pulse. The driver uses 'GPIOA->ODR |= (1 << 0)' for buzzer and 'GPIOA->ODR |= (1 << 1)' in the heart-rate ISR. What is the root cause?",
      "options": [
        "The buzzer hardware draws too much current.",
        "Read-Modify-Write Hardware Race Condition: The main loop executes LDR to read ODR; before it can execute STR, the heartbeat ISR preempts it, reads ODR, sets Pin 1, and writes back ODR. The main loop resumes with stale data in CPU registers and writes back ODR with Pin 0 set but Pin 1 cleared, destroying the heartbeat or alarm state!",
        "ARM Cortex-M cannot drive two pins at once.",
        "The buzzer frequency is too high for humans to hear."
      ],
      "answerIdx": 1,
      "debrief": "Software Read-Modify-Write on hardware registers is non-atomic. Hardware engineers specifically designed the BSRR (Bit Set/Reset Register) so software can set or reset individual pins with a single atomic 32-bit STR instruction without ever reading existing port state."
    },
    "quests": [
      {
        "id": "iot-m1-d03-q1",
        "name": "Read-Modify-Write Assembly Instruction Cycle Analysis",
        "type": "concept",
        "desc": "Trace clock cycles for LDR, ORR, STR and show the exact temporal vulnerability window for ISR preemption."
      },
      {
        "id": "iot-m1-d03-q2",
        "name": "GPIO Pin Glitch & Race Condition Detector",
        "type": "detective",
        "desc": "Inject high-frequency interrupts during continuous ODR bitmasking to detect and count dropped hardware pin states."
      },
      {
        "id": "iot-m1-d03-q3",
        "name": "Atomic BSRR & Bit-Band Hardware Driver",
        "type": "mastery",
        "desc": "Author an atomic GPIO library utilizing BSRR registers and Cortex-M bit-band memory alias formulas for single-cycle pin manipulation."
      },
      {
        "id": "iot-m1-d03-q4",
        "name": "3 AM SRE: Medical Infusion Pump Valve Glitch Under Load",
        "type": "incident",
        "desc": "Root-cause a valve position reset caused by non-atomic ODR modifications in a high-frequency sensor interrupt handler."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Clock Trees & Reset Control (RCC): PLL Multipliers, Prescalers, Crystal Oscillators & Power Domains",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Hardware Physics & Timing (Clock Trees & Peripheral Power Distribution)",
    "spokenGoal": "Master the heartbeat of the embedded system: the Clock Tree. Understand why microcontrollers boot at a slow default clock (e.g., 16MHz internal RC oscillator HSI) and how software configures Phase-Locked Loops (PLL) with High-Speed External (HSE) quartz crystals to achieve maximum frequency (e.g., 168MHz or 480MHz). Deconstruct the Reset and Clock Control (RCC) peripheral: master AHB, APB1, and APB2 bus prescalers, flash memory wait states (latency latency WS), and why forgetting to enable a peripheral clock in RCC freezes the MCU with a BusFault on the very first register access.",
    "conceptInvariant": "Peripheral Clock Gating Invariant: In low-power microcontrollers, all peripheral clocks are disabled by default upon reset; software must explicitly enable the peripheral's clock domain in RCC before attempting to read or write any register belonging to that peripheral.",
    "failureMode": "Writing 'GPIOB->MODER |= 1' immediately in main() without first calling 'RCC->AHB1ENR |= RCC_AHB1ENR_GPIOBEN'; accessing an unclocked peripheral bus triggers an immediate imprecise BusFault / HardFault.",
    "tryItFriction": "Configure the Cortex-M4 Clock Tree in C from scratch: enable the 8MHz external quartz crystal (HSE), wait for HSE Ready flag, configure the PLL parameters (M, N, P, Q) to reach 168MHz system clock, set Flash latency to 5 wait states, switch SYSCLK to PLL, and route peripheral clocks to APB1 and APB2 buses.",
    "socraticHints": [
      "Why must you increase Flash Memory Latency (Wait States) BEFORE boosting the system clock to 168MHz?",
      "Because silicon Flash memory can only read data reliably up to ~30MHz; if the CPU runs at 168MHz without Flash wait states, it attempts to fetch instructions faster than the Flash cells can charge, reading garbage and crashing instantly!",
      "Always set Flash wait states first, then switch the CPU clock to the high-speed PLL."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware engineer writes code to boost an STM32 MCU from 16MHz to 84MHz. The code enables HSE, configures PLL, sets SYSCLK to PLL, and then configures Flash latency. When flashed, the board crashes instantly during the clock switch. Under a debugger, the core is halted at address 0xFFFFFFFE with a HardFault. Why did it crash?",
      "options": [
        "The quartz crystal is fake.",
        "Flash Memory Overclocking: The developer switched the CPU to 84MHz before setting the Flash access wait states (FLASH_ACR_LATENCY_2WS). The CPU tried to fetch the next instruction at 84MHz from Flash that requires 2 wait cycles, reading corrupted opcode bytes and executing an invalid instruction.",
        "ARM Cortex-M only supports 16MHz.",
        "The power supply voltage was too high."
      ],
      "answerIdx": 1,
      "debrief": "Flash access timing is physical hardware physics. Increasing CPU clock speed must always be preceded by configuring the Flash access controller with sufficient wait states so instruction fetches remain synchronized."
    },
    "quests": [
      {
        "id": "iot-m1-d04-q1",
        "name": "Phase-Locked Loop (PLL) Math & Frequency Derivation",
        "type": "concept",
        "desc": "Calculate VCO input, output, and peripheral clock frequencies given HSE crystal frequency and integer multipliers M, N, P, Q."
      },
      {
        "id": "iot-m1-d04-q2",
        "name": "Unclocked Peripheral BusFault Trap Analyzer",
        "type": "detective",
        "desc": "Trace Configurable Fault Status Register (CFSR) bits to diagnose bus faults caused by accessing peripherals with gated RCC clocks."
      },
      {
        "id": "iot-m1-d04-q3",
        "name": "Bare-Metal SystemClock_Config Implementation",
        "type": "mastery",
        "desc": "Write a pure register-level clock initialization function transitioning from 16MHz HSI to 168MHz HSE-PLL with validated wait states."
      },
      {
        "id": "iot-m1-d04-q4",
        "name": "3 AM SRE: Intermittent MCU Freezes in High-Temperature Factory",
        "type": "incident",
        "desc": "Triage a production fleet where factory heat caused internal RC oscillator drift, desynchronizing UART baud rates and freezing firmware."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: Bare-Metal Memory-Mapped GPIO Driver & Clock Controller Engine",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Production Capstone (Hardware Drivers & Clock Architecture)",
    "spokenGoal": "Architect, construct, and defend Milestone 1: the Bare-Metal Memory-Mapped GPIO Driver & Clock Controller Engine. Build a production-grade, zero-HAL C driver for an ARM Cortex-M microcontroller entirely from scratch. Configure the external HSE crystal clock tree with PLL frequency multiplication, implement type-safe struct-based register definitions with strict volatile qualification, support push-pull, open-drain, pull-up/pull-down modes, and achieve atomic pin toggling via BSRR registers with zero race conditions.",
    "conceptInvariant": "Zero-HAL Silicon Invariant: Hardware peripheral drivers must communicate directly with physical memory-mapped registers via volatile typed structures, incurring zero dynamic memory overhead, zero runtime abstraction latency, and 100% deterministic execution cycles.",
    "failureMode": "Using non-reentrant vendor HAL abstraction functions with unbounded busy-wait loops in production firmware, causing 140 microseconds of jitter during critical high-speed hardware control sequences.",
    "tryItFriction": "Compile and run Milestone 1 on an ARM Cortex-M target or QEMU emulator: prove via logic analyzer or cycle counter that GPIO pin toggle executes in exactly 2 clock cycles using atomic BSRR, and that the clock tree operates at the exact target PLL frequency without clock drift.",
    "socraticHints": [
      "How do you verify with absolute certainty that your microcontroller is running at 168MHz and not 16MHz default?",
      "By outputting the internal clock signal to the microcontroller's MCO (Microcontroller Clock Output) pin via RCC->CFGR and measuring the physical square wave on a hardware oscilloscope!",
      "Never trust software timing loops alone to verify hardware clock rates."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 1 defense, the senior evaluator commands: 'Configure GPIOA Pin 8 as an Open-Drain output with an internal pull-up resistor to drive an external 3.3V sensor line. Then toggle it at maximum speed.' Your teammate writes: 'GPIOA->OTYPER &= ~(1 << 8); GPIOA->ODR ^= (1 << 8);'. The evaluator immediately fails the code. What two critical mistakes were made?",
      "options": [
        "GPIOA Pin 8 does not exist on Cortex-M.",
        "Incorrect Mode & Non-Atomic Toggle: 1) Clearing bit 8 in OTYPER sets Push-Pull mode instead of Open-Drain (which requires setting bit 8 to 1); 2) XORing ODR is a non-atomic Read-Modify-Write operation vulnerable to race conditions instead of using atomic BSRR writes.",
        "The pin should be configured as analog input.",
        "Cortex-M microcontrollers do not support Open-Drain."
      ],
      "answerIdx": 1,
      "debrief": "Open-Drain mode requires bit 1 in OTYPER (allowing the pin to float or pull to ground). Toggling pins must strictly use atomic BSRR set/reset operations to prevent race conditions in safety-critical systems."
    },
    "quests": [
      {
        "id": "iot-m1-d05-q1",
        "name": "Microcontroller Silicon Startup Specification",
        "type": "concept",
        "desc": "Produce the formal architectural sequence diagram detailing boot vectors, SRAM initialization, RCC clock tree setup, and GPIO configuration."
      },
      {
        "id": "iot-m1-d05-q2",
        "name": "GPIO Square Wave Jitter & Slew Rate Profiler",
        "type": "detective",
        "desc": "Measure nanosecond rise times and jitter on an oscilloscope/logic trace across Low, Medium, High, and Very High output speed register settings."
      },
      {
        "id": "iot-m1-d05-q3",
        "name": "Bare-Metal Clock & GPIO Driver Engine Build",
        "type": "mastery",
        "desc": "Implement the complete zero-HAL C library featuring PLL clock generation, Flash wait-state sequencing, and atomic BSRR GPIO pin control."
      },
      {
        "id": "iot-m1-d05-q4",
        "name": "Milestone 1 Defense: Clock Tree & Glitch Injection Lab",
        "type": "incident",
        "desc": "Defend the driver before a senior panel under live clock glitch injection, verifying zero bus faults and deterministic cycle counts."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Universal Asynchronous Receiver-Transmitter (UART): Baud Rates, Oversampling & Line Noise",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Serial Communications (Asynchronous Hardware Protocols)",
    "spokenGoal": "Confront asynchronous communication physics: master Universal Asynchronous Receiver-Transmitter (UART/USART). Understand how two devices communicate without a shared clock wire by agreeing on exact baud rates (115200, 921600 bps). Calculate the fractional Baud Rate Register (BRR) divisor from peripheral bus clock frequencies. Analyze receiver oversampling (16x and 8x): start bit detection via falling edge transitions, majority voting across sample pulses, and how a 2% clock drift between transmitter and receiver causes catastrophic framing errors and bit corruption.",
    "conceptInvariant": "Baud Rate Tolerance Invariant: In asynchronous serial communication without a shared clock, the cumulative clock drift between transmitter and receiver must remain strictly below 2.5% over the 10-bit transmission frame (1 start, 8 data, 1 stop bit) to prevent the receiver from sampling on bit transition edges.",
    "failureMode": "Miscalculating the USART_BRR integer and fractional mantissa for a 42MHz APB1 clock, producing a 118,500 baud rate instead of 115,200 (+2.86% error), causing 1 out of every 20 characters to arrive as garbage or trigger framing error flags.",
    "tryItFriction": "Write a bare-metal UART driver in C: calculate and set the exact BRR value for 115200 baud on a 16MHz clock, implement blocking transmit (polling TXE flag), and write a ring-buffered receive interrupt handler reading the Data Register (DR/RDR) on RXNE flags.",
    "socraticHints": [
      "Why must you read the UART Data Register (DR) immediately when the RXNE (Receive Not Empty) interrupt fires?",
      "Because if the next character arrives before you read DR, the hardware sets the Overrun Error (ORE) flag and discards incoming data!",
      "Reading DR clears both the RXNE flag and acknowledges the hardware receiver."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware team deploys an IoT sensor connected to a GPS module over UART at 9600 baud. In the lab, it works 100%. In field deployment across winter conditions (-20\u00b0C), GPS NMEA sentences arrive garbled with framing errors (FE). The MCU uses its internal RC oscillator (HSI) for the clock source. What caused the winter communication breakdown?",
      "options": [
        "GPS satellites do not transmit in cold weather.",
        "Thermal Oscillator Drift: The internal RC oscillator (HSI) has a thermal frequency drift of up to +/- 5% across industrial temperature ranges (-40\u00b0C to +85\u00b0C). The cold temperature drifted the MCU bus clock by 3.8%, pushing the UART baud rate divisor beyond the 2.5% asynchronous tolerance limit and corrupting sampling alignment.",
        "The UART cable froze.",
        "9600 baud is too fast for cold silicon."
      ],
      "answerIdx": 1,
      "debrief": "Internal RC oscillators (HSI) are notorious for temperature drift. Asynchronous protocols (UART) require high-accuracy clock sources (external quartz crystals HSE) with < 50 ppm frequency tolerance for reliable operation across wide temperature swings."
    },
    "quests": [
      {
        "id": "iot-m1-d06-q1",
        "name": "UART Baud Rate Divisor & Oversampling Math",
        "type": "concept",
        "desc": "Calculate the exact integer and fractional mantissa for 115200 and 921600 baud across 16MHz, 42MHz, and 84MHz bus clocks."
      },
      {
        "id": "iot-m1-d06-q2",
        "name": "Framing Error & Noise Flag Logic Analyzer",
        "type": "detective",
        "desc": "Induce clock skew on a serial transmitter and identify the exact sample threshold where framing error (FE) flags trigger in USART_SR."
      },
      {
        "id": "iot-m1-d06-q3",
        "name": "Interrupt-Driven Ring-Buffered UART Driver",
        "type": "mastery",
        "desc": "Implement a circular FIFO ring buffer in C for UART reception, handling RXNE interrupts with zero lost bytes and ORE overrun recovery."
      },
      {
        "id": "iot-m1-d06-q4",
        "name": "3 AM SRE: Fleet Telemetry Corrupted Under Extreme Temperature",
        "type": "incident",
        "desc": "Fix an emergency outage where an outdoor sensor fleet lost cloud connectivity due to internal oscillator baud rate drift in sub-zero weather."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Serial Peripheral Interface (SPI): Synchronous Shift Registers, CPOL, CPHA & High-Speed Clocks",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Synchronous Serial Communications (High-Speed Bus Architecture)",
    "spokenGoal": "Scale bus throughput to tens of megahertz: master the Serial Peripheral Interface (SPI). Compare synchronous bus architecture (with a dedicated clock line SCK) to asynchronous UART. Understand the Master-In-Slave-Out (MISO), Master-Out-Slave-In (MOSI), and Chip Select (CS/NSS) physical topology. Master the 4 SPI Modes governed by Clock Polarity (CPOL) and Clock Phase (CPHA): Mode 0 (idle low, sample leading edge) through Mode 3 (idle high, sample trailing edge). Architect high-speed synchronous transfers for Flash memory and graphical displays up to 50MHz.",
    "conceptInvariant": "Circular Shift Register Invariant: SPI is an inherently full-duplex synchronous ring shift register; for every single bit clocked out on MOSI by the master, exactly one bit is simultaneously clocked in on MISO from the slave. Software cannot perform a read without transmitting a byte.",
    "failureMode": "Configuring the SPI peripheral for Mode 0 (CPOL=0, CPHA=0) when communicating with a sensor that requires Mode 3 (CPOL=1, CPHA=1); the sensor samples data on the wrong clock edges, causing all received register values to be bit-shifted by 1 bit or read as 0xFF.",
    "tryItFriction": "Implement a register-level SPI Master Driver in C: configure baud rate prescalers, set CPOL and CPHA for an external SPI Flash chip (e.g., W25Q64), assert software Chip Select (NSS), transmit the 0x9F 'Read JEDEC ID' command, clock in 3 dummy bytes, and verify the manufacturer ID.",
    "socraticHints": [
      "Why must you send a dummy byte (e.g., 0xFF or 0x00) over SPI when you only want to read data from a slave sensor?",
      "Because the slave cannot generate clock pulses! The SPI master generates clock pulses on SCK only while transmitting bits from its internal shift register!",
      "Transmitting a dummy byte pumps the clock line, allowing the slave to shift its response into the master's receive register."
    ],
    "situationalPuzzle": {
      "scenario": "A drone flight controller reads orientation data from an SPI gyroscope at 20MHz. Occasionally, when the MCU executes heavy calculation routines, reading the gyroscope register returns stale data from the PREVIOUS transaction. The driver reads: 'SPI->DR = reg; while(!(SPI->SR & TXE)); return SPI->DR;'. What is wrong with this SPI read sequence?",
      "options": [
        "The gyroscope is damaged.",
        "Waiting for TXE instead of RXNE: The TXE (Transmit Empty) flag indicates only that the byte moved from the data register to the internal shift register\u2014it does NOT mean transmission is complete! To read the incoming byte, software MUST wait for the RXNE (Receive Not Empty) flag, ensuring all 8 clock cycles have finished and the incoming byte is fully latched.",
        "SPI only supports 1MHz.",
        "The Chip Select pin must be held high during reads."
      ],
      "answerIdx": 1,
      "debrief": "Checking TXE only tells you that the transmit buffer is ready for another byte, while the current byte is still being shifted over the physical wires. Reading DR before RXNE is set reads un-latched or stale data from the previous exchange."
    },
    "quests": [
      {
        "id": "iot-m1-d07-q1",
        "name": "SPI 4-Mode Timing Diagram Formulation",
        "type": "concept",
        "desc": "Draw physical timing diagrams for Modes 0, 1, 2, 3 showing SCK clock edges, MOSI setup/hold times, and MISO sample latches."
      },
      {
        "id": "iot-m1-d07-q2",
        "name": "SPI TXE vs RXNE Premature Read Profiler",
        "type": "detective",
        "desc": "Capture logic analyzer traces demonstrating how reading SPI_DR immediately on TXE causes byte corruption under high bus clocks."
      },
      {
        "id": "iot-m1-d07-q3",
        "name": "Full-Duplex SPI Flash Memory Driver",
        "type": "mastery",
        "desc": "Build a robust C driver for an SPI NOR Flash chip implementing page write, sector erase, and high-speed DMA-ready read routines."
      },
      {
        "id": "iot-m1-d07-q4",
        "name": "3 AM SRE: Stale Sensor Packets Crash Drone Altitude Hold",
        "type": "incident",
        "desc": "Fix an embedded flight software bug where premature SPI reads caused barometric pressure data to lag by one frame, inducing altitude oscillation."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Inter-Integrated Circuit (I2C): Open-Drain Buses, Pull-Ups, Start/Stop Conditions & Clock Stretching",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Multi-Drop Serial Communications (Open-Drain Hardware Physics)",
    "spokenGoal": "Master the world's most ubiquitous two-wire sensor bus: Inter-Integrated Circuit (I2C). Understand the electrical physics of Open-Drain pins with passive pull-up resistors on SDA (data) and SCL (clock): why devices can pull the bus LOW to 0V but rely on resistors to float HIGH to 3.3V, preventing electrical short circuits. Master the I2C protocol state machine: START conditions (SDA transitions LOW while SCL is HIGH), 7-bit slave addressing with Read/Write bit, ACK/NACK bits, STOP conditions, and how a slow sensor holds SCL LOW to execute Clock Stretching.",
    "conceptInvariant": "I2C Bus State Invariant: On an I2C bus, data on SDA may only change while SCL is LOW; any transition of SDA while SCL is HIGH is uniquely interpreted by hardware as either a START condition (falling edge) or a STOP condition (rising edge).",
    "failureMode": "Selecting 100k-ohm pull-up resistors instead of 2.2k-ohm on a 400kHz Fast-Mode I2C bus; the parasitic capacitance of the PCB traces prevents the voltage from rising fast enough, rounding square waves into gentle curves and causing slave address NACKs.",
    "tryItFriction": "Construct a bare-metal I2C Master Driver in C: configure the peripheral for 100kHz Standard-Mode, generate a START condition, transmit an EEPROM slave address (0x50), wait for ACK, transmit memory address, generate a Repeated START, and read 8 bytes with sequential ACKs and a final NACK before STOP.",
    "socraticHints": [
      "Why must the I2C master transmit a NACK (Not Acknowledge) on the very last byte it wants to read from an I2C slave?",
      "Because if the master transmits an ACK, the slave assumes another byte is requested and immediately pulls SDA LOW for bit 7 of the next byte, preventing the master from generating a STOP condition (which requires SDA to rise from LOW to HIGH)!",
      "NACK releases the SDA line so the master can cleanly assert STOP."
    ],
    "situationalPuzzle": {
      "scenario": "An industrial temperature monitoring node hangs completely after 3 days of continuous operation. The MCU is stuck in an infinite loop: 'while(I2C->SR2 & I2C_SR2_BUSY);'. Probing the physical bus with an oscilloscope shows SCL is 3.3V (HIGH), but SDA is clamped permanently at 0V (LOW). Resetting the MCU does NOT clear the bus\u2014only power-cycling the whole board restores it. What happened?",
      "options": [
        "The microcontroller silicon burned out.",
        "I2C Bus Lockup / Clamped SDA: An electrical glitch or MCU reset occurred in the middle of a read transaction while the slave was transmitting a '0' bit. The slave is still waiting for the next clock pulse on SCL to release SDA! The standard recovery is 'I2C Bus Clear': configure SCL as a GPIO, manually toggle SCL 9 times to clock out the stuck slave byte, and then generate a STOP condition.",
        "The pull-up resistors disconnected.",
        "I2C does not support temperatures."
      ],
      "answerIdx": 1,
      "debrief": "The classic I2C bus lockup occurs when a master resets mid-byte while a slave holds SDA low. Toggling SCL 9 times as a GPIO (the '9-Clock Bit Bang' recovery sequence) allows the slave to finish sending its byte, see a NACK/STOP, and release SDA."
    },
    "quests": [
      {
        "id": "iot-m1-d08-q1",
        "name": "I2C Pull-Up Resistor & RC Time Constant Math",
        "type": "concept",
        "desc": "Calculate minimum and maximum pull-up resistance (Rp) based on bus supply voltage, bus capacitance (Cb), and rise time specifications."
      },
      {
        "id": "iot-m1-d08-q2",
        "name": "I2C Bus Lockup & ACK/NACK Failure Analyzer",
        "type": "detective",
        "desc": "Capture oscilloscope traces of an I2C bus clamped LOW by an interrupted slave and observe the effect of the 9-clock recovery pulse."
      },
      {
        "id": "iot-m1-d08-q3",
        "name": "Robust I2C Master Driver with Bus Clear Engine",
        "type": "mastery",
        "desc": "Implement a full I2C driver in C with automated bus clear routines, timeout guards on all status flags, and multi-byte read/write support."
      },
      {
        "id": "iot-m1-d08-q4",
        "name": "3 AM SRE: Battery Management System Lockup in Electric Vehicle",
        "type": "incident",
        "desc": "Patch automotive firmware where an I2C temperature sensor clamped the bus, blinding the battery safety controller and triggering a shutdown."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Controller Area Network (CAN Bus): Differential Signaling, Arbitration & CRC Framing",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Mission-Critical Industrial Networks (CAN Bus Architecture & Fault Tolerance)",
    "spokenGoal": "Master the backbone of automotive and industrial automation: the Controller Area Network (CAN Bus). Understand why consumer buses (UART/I2C) fail in noisy environments, and how CAN uses 2.5V differential signaling (CAN_H and CAN_L with 120-ohm termination resistors) to reject massive electromagnetic interference. Deconstruct CAN bit arbitration: dominant '0' bits overwriting recessive '1' bits, enabling non-destructive collision resolution where higher-priority message IDs (lower numerical value) win the bus without losing a single microsecond of bandwidth.",
    "conceptInvariant": "Dominant Bit Overwrite Invariant: On a physical CAN bus, a dominant bit (logic 0, differential voltage ~2.0V) unconditionally overrides a recessive bit (logic 1, differential voltage ~0V); any transmitting node that detects a dominant bit while transmitting a recessive bit immediately loses arbitration and drops back to receive mode without corrupting the winning frame.",
    "failureMode": "Forgetting the two 120-ohm termination resistors at the extreme ends of the physical CAN bus cable, causing electrical signal reflections that destroy high-speed (1 Mbps) CAN frames with continuous Bit Stuffing and CRC errors.",
    "tryItFriction": "Configure the CAN peripheral (bxCAN) in C for 500 kbps: calculate the Bit Timing Register (BTR) parameters (Prescaler, Time Quanta, Sync Jump Width SJW, TS1, TS2) based on APB1 clock, configure hardware filter banks to accept only IDs 0x100 to 0x10F, and transmit a telemetry frame.",
    "socraticHints": [
      "Why is a CAN message ID of 0x001 higher priority than a message ID of 0x7FF?",
      "Because CAN bus arbitration is non-destructive wired-AND logic where 0 is dominant! The node transmitting 0x001 sends dominant '0's earlier in the identifier field, forcing the node transmitting 0x7FF (which sends recessive '1's) to yield the bus!",
      "Lower numerical ID equals higher priority."
    ],
    "situationalPuzzle": {
      "scenario": "An autonomous mobile robot uses CAN bus at 1 Mbps. During motor acceleration, high electrical noise induces voltage spikes. The robot's steering node suddenly stops transmitting entirely. A hardware register check reveals the CAN controller entered the 'Bus-Off' state (CAN_ESR_BOFF = 1). What mechanism triggered Bus-Off, and how does firmware recover?",
      "options": [
        "The CAN transceiver melted.",
        "Fault Confinement & Transmit Error Counter (TEC) Exceeded: The CAN controller maintains hardware error counters (TEC and REC). Frequent bit or acknowledge errors incremented TEC beyond 255, forcing the node into Bus-Off state to prevent a faulty node from jamming the rest of the bus. Recovery requires software to request an automatic or manual bus-off recovery sequence (waiting for 128 occurrences of 11 consecutive recessive bits).",
        "The 120-ohm resistors changed value.",
        "CAN bus does not support robots."
      ],
      "answerIdx": 1,
      "debrief": "CAN bus fault confinement is brilliant: it protects the collective network from rogue or damaged nodes. If a node fails repeatedly, its hardware Transmit Error Counter pushes it from Error Active -> Error Passive -> Bus-Off, electrically disconnecting it until healthy conditions return."
    },
    "quests": [
      {
        "id": "iot-m1-d09-q1",
        "name": "CAN Bit Timing & Sample Point Math",
        "type": "concept",
        "desc": "Calculate Time Quanta (tq), Prop_Seg, Phase_Seg1, and Phase_Seg2 to achieve an 87.5% sample point at 500 kbps and 1 Mbps."
      },
      {
        "id": "iot-m1-d09-q2",
        "name": "CAN Non-Destructive Arbitration Simulator",
        "type": "detective",
        "desc": "Simulate simultaneous transmission of 3 CAN frames with differing IDs and verify bit-by-bit dominant wire overwrites on a virtual bus."
      },
      {
        "id": "iot-m1-d09-q3",
        "name": "bxCAN Driver & Filter Bank Configuration",
        "type": "mastery",
        "desc": "Implement a full CAN bus driver in C featuring 32-bit filter mask matching, multi-mailbox transmit scheduling, and FIFO interrupt reception."
      },
      {
        "id": "iot-m1-d09-q4",
        "name": "3 AM SRE: Bus-Off Cascade Shuts Down Automated Warehouse AGVs",
        "type": "incident",
        "desc": "Resolve a fleet-wide AGV shutdown caused by missing bus termination resistors triggering simultaneous CAN Bus-Off state lockups."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: Multi-Protocol Hardware Bus Engine (Zero-Drop UART/SPI/I2C Transceiver)",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Production Capstone (Hardware Communications Integration)",
    "spokenGoal": "Architect, construct, and defend Milestone 2: the Multi-Protocol Hardware Bus Engine. Build a unified, non-blocking communications transceiver in C integrating UART, SPI, and I2C buses simultaneously. Implement ring-buffered interrupt handling for UART telemetry, high-speed SPI transactions with hardware register validation, and an I2C sensor driver equipped with automatic bus-clear recovery. Guarantee zero dropped bytes, zero unhandled bus lockups, and deterministic non-blocking API contracts.",
    "conceptInvariant": "Non-Blocking Protocol Invariant: No hardware bus transaction function may execute an unbounded 'while(!flag)' busy-wait loop; every hardware operation must be bounded by a hardware timer timeout or driven entirely by asynchronous state-machine interrupts.",
    "failureMode": "A disconnected I2C sensor leaves an unbounded 'while(!(I2C1->SR1 & I2C_SR1_ADDR));' polling loop in the middle of a flight control loop, permanently hanging the flight computer mid-air.",
    "tryItFriction": "Execute the Multi-Protocol Stress Test: transmit continuous 921600 baud UART telemetry while concurrently streaming high-speed SPI Flash reads and polling an I2C sensor at 100Hz; verify zero data corruption and demonstrate automatic I2C bus recovery when a sensor line is momentarily grounded.",
    "socraticHints": [
      "What is the single best defense against microcontroller lockups during hardware bus polling?",
      "Every single polling loop must be guarded by a decrementing timeout counter or hardware SysTick timestamp check!",
      "If the flag does not assert within the allotted microseconds, return a typed error code (e.g., ERR_BUS_TIMEOUT) and trigger bus re-initialization."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 2 evaluation, the evaluator randomly unplugs the I2C sensor cable during active polling. The system must continue logging high-speed UART telemetry without stuttering. Your system freezes after 3 seconds. The debugger shows the CPU trapped waiting for I2C1->SR1 & I2C_SR1_BTF. What architectural flaw did you commit?",
      "options": [
        "UART requires I2C to function.",
        "Unbounded Polling & Lack of Fault Isolation: The I2C driver lacked a timeout mechanism. When the physical wire was pulled, hardware flags never changed state, trapping the CPU in a blocking loop that starved all other tasks and halted UART transmission.",
        "The MCU clock crashed.",
        "I2C cannot be unplugged."
      ],
      "answerIdx": 1,
      "debrief": "A professional embedded driver must NEVER contain naked while loops on hardware flags. All hardware interactions must enforce defensive timeout boundaries to ensure isolated component failures do not cascade into whole-system deadlocks."
    },
    "quests": [
      {
        "id": "iot-m1-d10-q1",
        "name": "Multi-Bus Hardware Interconnect Topology",
        "type": "concept",
        "desc": "Produce the comprehensive hardware schematic blueprint detailing pin multiplexing, alternate functions (AF), and electrical pull-up networks."
      },
      {
        "id": "iot-m1-d10-q2",
        "name": "Bus Timeout Fault Injection Harness",
        "type": "detective",
        "desc": "Subject UART, SPI, and I2C drivers to simulated cable disconnects and verify that all routines return typed error codes within < 5ms."
      },
      {
        "id": "iot-m1-d10-q3",
        "name": "Multi-Protocol Hardware Bus Engine Build",
        "type": "mastery",
        "desc": "Implement the complete C communication library integrating non-blocking UART, high-speed SPI Flash, and self-healing I2C drivers."
      },
      {
        "id": "iot-m1-d10-q4",
        "name": "Milestone 2 Defense: Live Hardware Fault Injection Lab",
        "type": "incident",
        "desc": "Defend the communication engine before a senior evaluator panel under live physical cable cuts and bus noise injection."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Nested Vectored Interrupt Controller (NVIC): Vector Tables, Priority Grouping & Preemption",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Interrupt Architecture (Hardware Priority Physics & Preemption)",
    "spokenGoal": "Master the hardware orchestrator of the microcontroller: the Nested Vectored Interrupt Controller (NVIC). Deconstruct the ARM Cortex-M Vector Table located in Flash or SRAM. Understand hardware priority grouping: how the 8-bit priority register splits into Preemption Priority (governing who can interrupt whom mid-execution) and Subpriority (resolving simultaneous interrupt ties). Learn how the hardware core automatically pushes caller-saved registers (R0-R3, R12, LR, PC, xPSR) onto the stack in 12 clock cycles upon interrupt entry.",
    "conceptInvariant": "Hardware Interrupt Stacking Invariant: Upon taking an interrupt, the ARM Cortex-M hardware pipeline automatically saves the 8-word stack frame (R0, R1, R2, R3, R12, LR, PC, xPSR) onto the active stack in exactly 12 clock cycles before entering the C interrupt service routine; software does not need to manually push these registers.",
    "failureMode": "Configuring a critical safety motor emergency stop interrupt with priority 5 and a routine UART logging interrupt with priority 1 (where lower number is higher priority!), allowing continuous UART logging to block the emergency stop routine.",
    "tryItFriction": "Configure the NVIC in C using register access: set Priority Grouping to 4 bits of preemption priority, configure EXTI0 (external push-button) with Priority 2, configure Timer 2 with Priority 0, and prove through GPIO toggles on an oscilloscope that Timer 2 preempts EXTI0 mid-execution.",
    "socraticHints": [
      "In ARM Cortex-M NVIC, does Priority 0 represent the highest or lowest priority?",
      "Priority 0 is the HIGHEST priority! The higher the numerical value, the lower the interrupt priority!",
      "Negative priority values are reserved for hardwired system exceptions like Reset (-3), NMI (-2), and HardFault (-1)."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware developer writes an Interrupt Service Routine for a button press (EXTI0_IRQHandler). When the button is pressed once, the interrupt handler executes continuously in an infinite loop, never returning to the main program. Under the debugger, the PC leaves the handler and immediately re-enters it. What line of code was omitted?",
      "options": [
        "The button was pressed too hard.",
        "Pending Interrupt Bit Clearance: The developer forgot to clear the interrupt pending bit in the peripheral's register (e.g., 'EXTI->PR = EXTI_PR_PR0;'). In Cortex-M, if the peripheral's pending flag remains set, the NVIC immediately triggers the interrupt again the moment the CPU executes the return from exception!",
        "The main function returned.",
        "Cortex-M only supports one interrupt per lifetime."
      ],
      "answerIdx": 1,
      "debrief": "Hardware interrupts latch pending flags until explicitly cleared by software. Failing to acknowledge and clear the pending bit inside the ISR creates an immediate infinite interrupt storm that completely starves background processing."
    },
    "quests": [
      {
        "id": "iot-m1-d11-q1",
        "name": "ARM Cortex-M 12-Cycle Hardware Stacking Formulation",
        "type": "concept",
        "desc": "Diagram the exact memory layout of the 8-register hardware exception frame on the stack (R0-R3, R12, LR, PC, xPSR)."
      },
      {
        "id": "iot-m1-d11-q2",
        "name": "NVIC Priority Grouping & Preemption Disassembler",
        "type": "detective",
        "desc": "Trace SCB->AIRCR priority splits (4.0 vs 3.1 vs 2.2) and measure preemption behavior between conflicting interrupts."
      },
      {
        "id": "iot-m1-d11-q3",
        "name": "Multi-Level Preemptive NVIC Controller Driver",
        "type": "mastery",
        "desc": "Implement an NVIC driver configuring external pin interrupts (EXTI), software triggers, and strict preemption hierarchies."
      },
      {
        "id": "iot-m1-d11-q4",
        "name": "3 AM SRE: Infinite Interrupt Storm Freezes Factory Controller",
        "type": "incident",
        "desc": "Diagnose an unacknowledged peripheral pending flag that locked a factory PLC into a 100% CPU interrupt storm."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Interrupt Service Routines (ISRs): Latency Budgets, Tail-Chaining & Late-Arrival Physics",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Low-Latency Systems Engineering (Hardware Pipeline Optimization & ISR Budgets)",
    "spokenGoal": "Engineer ultra-low latency interrupt response: master Cortex-M hardware pipeline mechanics. Explore Tail-Chaining: how the hardware skips unstacking and restacking registers when exiting one interrupt into another pending interrupt, executing the transition in only 6 clock cycles instead of 24. Understand Late-Arrival optimization: how a higher-priority interrupt arriving during the 12-cycle stacking of a lower-priority interrupt takes over the fetch without wasted cycles. Establish the cardinal rule of embedded ISR design: execute minimal work in the ISR and defer heavy processing to the main loop.",
    "conceptInvariant": "Minimalist ISR Invariant: An Interrupt Service Routine must never block, delay, execute unbounded I/O, or perform complex mathematical computation; an ISR must strictly capture physical state into a buffer, acknowledge hardware flags, notify background tasks, and return in < 5 microseconds.",
    "failureMode": "Calling 'printf()' or a blocking 100ms delay inside a UART receive ISR, starving all other hardware interrupts and causing motor control loops to miss timing deadlines.",
    "tryItFriction": "Benchmark and measure interrupt latency in C: trigger a software interrupt from a hardware timer, toggle a GPIO pin at the very first instruction of the ISR, and measure the exact nanosecond delay between timer trigger and pin assertion on an oscilloscope; demonstrate 6-cycle tail-chaining transitions.",
    "socraticHints": [
      "What is 'Tail-Chaining' in ARM Cortex-M processors?",
      "It is an architectural hardware optimization where, if an interrupt is pending when the current ISR finishes, the core does NOT pop registers from the stack only to push them back again!",
      "It reuses the existing stack frame, reducing the inter-interrupt latency from 24+ cycles down to just 6 cycles."
    ],
    "situationalPuzzle": {
      "scenario": "A junior engineer places an orientation sensor calculation algorithm (matrix inversion taking 8 milliseconds) directly inside the 1kHz timer interrupt handler. What fatal system defect is immediately created?",
      "options": [
        "The sensor measures inverse gravity.",
        "System Starvation & Deadline Violation: The timer ISR takes 8ms to run, but fires every 1ms! The timer interrupt will re-pend before it ever finishes, keeping the CPU at 100% inside the ISR, permanently starving all lower-priority interrupts and completely halting main() thread execution.",
        "The stack will immediately underflow.",
        "Cortex-M does not allow math in C."
      ],
      "answerIdx": 1,
      "debrief": "ISR execution time must ALWAYS be strictly less than the interrupt period (preferably < 1% of the period). If an ISR takes 8ms in a 1ms periodic timer, the system enters permanent interrupt saturation."
    },
    "quests": [
      {
        "id": "iot-m1-d12-q1",
        "name": "Tail-Chaining & Late-Arrival Hardware Pipeline Cycles",
        "type": "concept",
        "desc": "Calculate clock cycle budgets for standard entry/exit (12+12=24 cycles) versus tail-chained transitions (6 cycles)."
      },
      {
        "id": "iot-m1-d12-q2",
        "name": "ISR Execution Latency & Jitter Benchmarking",
        "type": "detective",
        "desc": "Use the Data Watchpoint and Trace (DWT) cycle counter to benchmark nanosecond ISR execution durations across optimization levels."
      },
      {
        "id": "iot-m1-d12-q3",
        "name": "Deferred Interrupt Processing State Machine",
        "type": "mastery",
        "desc": "Build a split-phase interrupt handler in C: lightweight ISR enqueues event into volatile ring buffer; main loop processes payload."
      },
      {
        "id": "iot-m1-d12-q4",
        "name": "3 AM SRE: Robotic Arm Crash Due to Blocking Printf in Encoder ISR",
        "type": "incident",
        "desc": "Triage a manufacturing floor incident where a debug printf() inside an optical encoder ISR caused a robot to crash past limit switches."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "SysTick System Timer & Hardware General-Purpose Timers: Prescalers, ARR & PWM Generation",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Hardware Timers & PWM Generation (Clock Counting & Actuator Control)",
    "spokenGoal": "Harness the physics of hardware counters: master the Cortex-M SysTick System Timer and General-Purpose Timers (TIM2-TIM5). Understand the core hardware timer engine: Clock Prescaler (PSC) dividing the bus frequency, Auto-Reload Register (ARR) setting the rollover period, and Counter (CNT) accumulating ticks. Configure the SysTick timer for a precise 1 millisecond operating system tick. Master Pulse Width Modulation (PWM) generation: configure Capture/Compare Registers (CCR) to control motor speed and LED brightness with nanosecond edge accuracy.",
    "conceptInvariant": "Deterministic Timer Rollover Invariant: A hardware timer clocked at frequency F_clk with prescaler PSC and auto-reload ARR produces an exact rollover frequency F_overflow = F_clk / ((PSC + 1) * (ARR + 1)); timer period is strictly invariant to software execution speed.",
    "failureMode": "Forgetting that timer registers PSC and ARR are 0-indexed in Cortex-M; configuring PSC=16 on a 16MHz clock divides by (16+1)=17, producing a 941 kHz timer clock instead of 1.000 MHz, resulting in a cumulative 6% timing error.",
    "tryItFriction": "Configure Timer 3 in C to generate a 20kHz center-aligned PWM signal on Pin PB0: calculate PSC and ARR for an 84MHz clock, set Output Compare Mode to PWM Mode 1, and dynamically update CCR1 to modulate motor duty cycle from 0% to 100%.",
    "socraticHints": [
      "Why is a hardware PWM signal vastly superior to toggling a GPIO pin inside a software timer interrupt?",
      "Because hardware PWM generation is executed purely by dedicated on-chip silicon counters without consuming ANY CPU cycles, completely immune to interrupt latency, task scheduling delays, or software jitter!",
      "The CPU can be asleep in low-power mode while the hardware timer generates flawless 100kHz PWM waves."
    ],
    "situationalPuzzle": {
      "scenario": "A quadcopter drone flight controller uses 400Hz PWM signals to drive electronic speed controllers (ESCs). A developer updates the PWM duty cycle by writing directly to TIM2->CCR1. Occasionally, when updating duty cycle during high-frequency maneuvers, the motor experiences a terrifying 1-frame violent throttle spike to 100%. What timer feature was not enabled?",
      "options": [
        "The battery voltage spiked.",
        "Preload Register Disabled (OC1PE = 0): Without the Output Compare Preload Register enabled, writing to CCR1 immediately updates the active comparison register mid-cycle! If CNT had already passed the new CCR1 value, the comparator misses the match and leaves the output HIGH for the entire remaining ARR period, producing a momentary 100% full-throttle blast!",
        "ARM Cortex-M cannot drive drone motors.",
        "The prescaler was too small."
      ],
      "answerIdx": 1,
      "debrief": "Hardware timer preload registers (buffered shadow registers) prevent mid-cycle duty cycle glitches. When enabled (OCxPE=1), software writes to the preload register, which is transferred to the active comparison register only upon an update event (overflow)."
    },
    "quests": [
      {
        "id": "iot-m1-d13-q1",
        "name": "Hardware Timer Prescaler & Period Mathematical Model",
        "type": "concept",
        "desc": "Derive exact formulas for PWM frequency, duty cycle resolution, and dead-time insertion across bus frequencies."
      },
      {
        "id": "iot-m1-d13-q2",
        "name": "PWM Glitch & Shadow Register Analyzer",
        "type": "detective",
        "desc": "Observe PWM output duty cycle anomalies when writing directly to CCR registers without shadow preload enabled under logic capture."
      },
      {
        "id": "iot-m1-d13-q3",
        "name": "Multi-Channel Center-Aligned PWM Motor Driver",
        "type": "mastery",
        "desc": "Implement a 3-phase center-aligned PWM driver in C with complementary outputs, dead-time generation, and emergency break input."
      },
      {
        "id": "iot-m1-d13-q4",
        "name": "3 AM SRE: Drone ESC Throttle Spike During High-G Maneuver",
        "type": "incident",
        "desc": "Resolve a firmware race condition where unbuffered CCR updates caused sudden full-throttle surges during aggressive drone yaw adjustments."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Analog-to-Digital Conversion (ADC) & DAC: Successive Approximation (SAR), Sampling Times & Nyquist Limits",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Analog Mixed-Signal Engineering (ADC Conversion Physics & Nyquist Sampling)",
    "spokenGoal": "Digitize physical reality: master Analog-to-Digital Converters (ADC) and Digital-to-Analog Converters (DAC). Deconstruct the Successive Approximation Register (SAR) ADC: internal sample-and-hold capacitor networks, binary search conversion steps, and reference voltage (VREF+) stability. Calculate minimum sampling times based on external analog signal source impedance (R_AIN) and internal sampling capacitance (C_ADC). Understand the Nyquist-Shannon sampling theorem (f_sample > 2 * f_max) and prevent frequency aliasing using hardware anti-aliasing low-pass RC filters.",
    "conceptInvariant": "Impedance-Constrained Sampling Invariant: The ADC sampling time (T_sample) must be sufficiently long to charge the internal sample-and-hold capacitor (C_ADC) to within 1/2 LSB of the input analog voltage: T_sample >= ln(2^(N+1)) * (R_AIN + R_ADC) * C_ADC.",
    "failureMode": "Selecting the minimum ADC sample time (3 clock cycles = 0.2 microseconds) to measure a high-impedance (100k-ohm) thermistor circuit; the internal capacitor only charges halfway before conversion begins, reading a voltage 40% lower than reality.",
    "tryItFriction": "Configure a 12-bit SAR ADC in C: calculate the required sampling cycles for an analog sensor with 10k-ohm output impedance, configure continuous scan mode across 3 analog channels, calibrate the ADC offset, and convert raw digital readings to physical millivolts using the internal bandgap reference (VREFINT).",
    "socraticHints": [
      "Why does a 12-bit ADC reading change when the battery voltage drops, even if the sensor voltage is perfectly constant?",
      "Because standard ADC conversions are ratiometric to the supply voltage (VDD/VREF+)! If VDD sags from 3.3V to 2.8V, the full-scale range shrinks and the digital code increases!",
      "To obtain absolute millivolts, read the factory-calibrated internal bandgap voltage (VREFINT ~1.2V) and compute true VDD dynamically."
    ],
    "situationalPuzzle": {
      "scenario": "An ECG heart rate monitor samples cardiac signals using an internal ADC. The cardiologist notices high-frequency buzzing artifacts that obscure the heartbeat. The firmware developer claims: 'I am sampling at 100Hz, which is fine because heartbeats are only 1-3Hz.' However, a nearby 50Hz AC power line is inducing noise. Why did the 50Hz noise appear as a 0Hz DC offset and distortion?",
      "options": [
        "The ADC resolution is too low.",
        "Aliasing Violation of Nyquist Criterion: A 50Hz noise signal sampled at exactly 100Hz (2 * 50Hz) violates the strict Nyquist inequality (sampling rate must be STRICTLY GREATER than twice the maximum frequency). Furthermore, without an analog anti-aliasing low-pass filter before the ADC, any noise > 50Hz folds back (aliases) into the baseband, creating phantom low-frequency distortion.",
        "The patient is cold.",
        "Microcontrollers cannot sample ECG signals."
      ],
      "answerIdx": 1,
      "debrief": "The Nyquist theorem requires f_sample > 2 * f_signal, and physical hardware MUST include an analog low-pass anti-aliasing filter before the ADC pin to eliminate any noise above the Nyquist cutoff before digitization occurs."
    },
    "quests": [
      {
        "id": "iot-m1-d14-q1",
        "name": "SAR ADC Sample-and-Hold RC Charging Math",
        "type": "concept",
        "desc": "Calculate exact required sampling cycles across 12-bit, 10-bit, and 8-bit resolution for external source impedances from 1k to 100k ohms."
      },
      {
        "id": "iot-m1-d14-q2",
        "name": "VREFINT Dynamic Supply Voltage Correction Profiler",
        "type": "detective",
        "desc": "Benchmark analog measurement accuracy during artificial battery voltage dips from 3.3V down to 2.2V with and without VREFINT correction."
      },
      {
        "id": "iot-m1-d14-q3",
        "name": "Multi-Channel Regular Scan ADC Driver",
        "type": "mastery",
        "desc": "Build an ADC driver in C supporting multi-channel sequence conversion, internal temperature sensor reading, and millivolt conversion."
      },
      {
        "id": "iot-m1-d14-q4",
        "name": "3 AM SRE: Thermistor Voltage Read Error Triggers False Battery Overheat",
        "type": "incident",
        "desc": "Resolve a high-severity EV battery shutdown caused by insufficient ADC sampling time on high-impedance temperature probe lines."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: Real-Time Interrupt-Driven Data Acquisition Engine",
    "stageName": "Stage 2: Applied Architecture & Core Systems",
    "stageNum": 2,
    "pedagogicalRole": "Production Capstone (Interrupts, Timers & Analog Data Acquisition)",
    "spokenGoal": "Architect, construct, and defend Milestone 3: the Real-Time Interrupt-Driven Data Acquisition Engine. Build a precision hardware measurement system in C that triggers ADC conversions synchronously from a hardware timer (e.g., Timer 2 TRGO) at exactly 10kHz with zero CPU intervention. Collect samples via End-Of-Conversion (EOC) interrupt into a double-buffered queue, compute real-time root-mean-square (RMS) metrics, and modulate a hardware PWM output based on the analog signal with sub-microsecond latency.",
    "conceptInvariant": "Zero-Jitter Trigger Invariant: High-precision periodic analog data sampling must be triggered directly by hardware timer output signals (TRGO) via internal silicon interconnects; software polling or manual software triggers in SysTick loops must never be used.",
    "failureMode": "Triggering ADC conversions inside a software SysTick interrupt; when a higher-priority UART interrupt fires, the ADC trigger is delayed by 18 microseconds, introducing phase jitter that ruins frequency analysis.",
    "tryItFriction": "Build and verify Milestone 3: prove on an oscilloscope that Timer 2 TRGO triggers ADC conversions at exactly 10,000.0 Hz with zero clock cycle jitter, and that the interrupt handler processes multi-channel analog samples without dropping a single conversion.",
    "socraticHints": [
      "Why should you trigger an ADC using a hardware Timer TRGO (Trigger Output) rather than calling ADC_Start() in a timer interrupt?",
      "Because hardware TRGO triggers the ADC directly through silicon hardware routing in 0 clock cycles with ZERO software latency and ZERO jitter, even if the CPU is busy running another interrupt or sleeping!",
      "Hardware routing completely decouples sample timing from CPU workload."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 3 defense, the evaluator injects continuous high-priority external pin interrupts while your ADC sampling engine is running. Your system is supposed to sample an analog audio signal at 44.1kHz. If your ADC is triggered by software inside an ISR, the audio recordings suffer horrific pitch-shifting and harmonic distortion. Why did hardware TRGO triggering survive the test?",
      "options": [
        "Hardware TRGO has audio filters.",
        "Jitter Immunity via Silicon Routing: In hardware TRGO triggering, the timer's overflow pulse fires the ADC sample-and-hold circuit via direct internal silicon wires completely independent of the CPU pipeline. Even though CPU interrupt service routines are delayed by the external pin interrupts, the physical analog sampling moments remain mathematically equidistant in time.",
        "The audio signal was converted to MP3.",
        "ARM Cortex-M stops external interrupts during audio."
      ],
      "answerIdx": 1,
      "debrief": "Silicon-level hardware triggering eliminates software jitter. Equidistant sampling in the time domain is the foundational requirement for signal processing (FFT, filtering); any software jitter introduces catastrophic phase noise into the converted data."
    },
    "quests": [
      {
        "id": "iot-m1-d15-q1",
        "name": "Hardware TRGO Direct Silicon Trigger Specification",
        "type": "concept",
        "desc": "Map internal peripheral trigger routing between Master Timer (TRGO) and Slave ADC (EXTSEL) registers on Cortex-M."
      },
      {
        "id": "iot-m1-d15-q2",
        "name": "Software Jitter vs Hardware Trigger Phase Noise Analyzer",
        "type": "detective",
        "desc": "Measure nanosecond trigger jitter on an oscilloscope comparing software-initiated ADC starts against hardware TRGO triggers."
      },
      {
        "id": "iot-m1-d15-q3",
        "name": "Interrupt-Driven Precision Data Acquisition Engine Build",
        "type": "mastery",
        "desc": "Implement the complete C data acquisition engine featuring TRGO hardware triggering, double-buffered EOC handling, and PWM feedback."
      },
      {
        "id": "iot-m1-d15-q4",
        "name": "Milestone 3 Defense: Noise Injection & Preemption Chaos Lab",
        "type": "incident",
        "desc": "Defend the data acquisition engine under heavy interrupt preemption storms before a senior faculty review board."
      }
    ]
  },
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Direct Memory Access (DMA) Controller: Streams, Channels & Bus Matrix Arbitration",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Hardware Bus Offloading (Direct Memory Access Architecture)",
    "spokenGoal": "Liberate the microcontroller CPU from byte-copying drudgery: master the Direct Memory Access (DMA) controller. Understand how DMA operates as an autonomous hardware master on the multi-layer AHB Bus Matrix, moving data between peripherals (ADC, UART, SPI) and SRAM without burning a single CPU clock cycle. Deconstruct DMA streams, channels, priority arbitration, FIFO thresholds, and burst transfers (single, 4-beat, 8-beat, 16-beat). Configure memory-to-peripheral, peripheral-to-memory, and memory-to-memory transfers.",
    "conceptInvariant": "CPU Liberation Invariant: High-throughput peripheral data transfers (UART buffers, ADC sequences, display framebuffers) must be offloaded to dedicated DMA hardware channels, reducing CPU utilization for data transport to 0% and freeing CPU cycles strictly for algorithmic processing.",
    "failureMode": "Servicing a 2 Megabaud UART stream using single-byte RXNE CPU interrupts; processing 200,000 interrupts per second saturates the CPU at 98% utilization, causing the firmware to drop packets and freeze background control loops.",
    "tryItFriction": "Configure DMA2 Stream 0 in C for high-speed Memory-to-Memory transfer: allocate a 4KB source array in Flash and a 4KB destination array in SRAM, configure 32-bit word transfers with burst increments, trigger the transfer, and verify data completion via the TCIF (Transfer Complete Interrupt Flag).",
    "socraticHints": [
      "Can the CPU and DMA access the exact same SRAM memory bank at the exact same clock cycle?",
      "On single-port SRAM architectures, if both access the same bank simultaneously, the hardware AHB Bus Matrix pauses (stalls) one of the masters using bus arbitration!",
      "Multi-bus Cortex-M microcontrollers split SRAM into multiple banks (SRAM1, SRAM2, CCM) so DMA and CPU operate concurrently without bus contention."
    ],
    "situationalPuzzle": {
      "scenario": "A developer sets up DMA to transmit an array of 1,000 bytes over SPI. The code executes: 'uint8_t buffer[1000]; fill_data(buffer); start_dma(buffer); return;'. When called from inside a function, the SPI bus transmits corrupted random bytes after the first 50 bytes. Why did the DMA transfer corrupt?",
      "options": [
        "SPI cannot handle 1,000 bytes.",
        "Stack Deallocation of DMA Buffer: The buffer was allocated on the local function stack! When the function returned immediately while DMA was asynchronously reading in the background, the stack frame was popped. Subsequent function calls overwrote the stack memory with new local variables, corrupting the data DMA was transmitting!",
        "The DMA FIFO overflowed.",
        "The CPU crashed."
      ],
      "answerIdx": 1,
      "debrief": "DMA buffers MUST NEVER be allocated as automatic local stack variables unless the function explicitly blocks until DMA completion. DMA buffers must be declared static, global, or allocated from a dedicated persistent memory pool that outlives the initiating function call."
    },
    "quests": [
      {
        "id": "iot-m1-d16-q1",
        "name": "AHB Bus Matrix Round-Robin Arbitration Math",
        "type": "concept",
        "desc": "Calculate bus master bandwidth allocation and bus stall penalties when CPU, DMA1, and DMA2 contend for SRAM."
      },
      {
        "id": "iot-m1-d16-q2",
        "name": "DMA Stack Corruption Disassembler",
        "type": "detective",
        "desc": "Trace memory disassembly to prove how local stack frames are overwritten while asynchronous DMA transfers remain active."
      },
      {
        "id": "iot-m1-d16-q3",
        "name": "Bare-Metal DMA Memory-to-Memory Engine",
        "type": "mastery",
        "desc": "Implement a 32-bit word DMA copy engine in C achieving maximum bus matrix saturation and benchmarking throughput against memcpy()."
      },
      {
        "id": "iot-m1-d16-q4",
        "name": "3 AM SRE: Audio Firmware Corruption After Stack Buffer Exit",
        "type": "incident",
        "desc": "Resolve a high-severity audio glitch caused by an asynchronous I2S DMA stream reading an unstacked local audio buffer."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Circular DMA & Ping-Pong Buffers: Half-Transfer (HT) & Transfer-Complete (TC) Zero-Copy Streaming",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "High-Throughput Streaming Architecture (Double Buffering & Circular DMA)",
    "spokenGoal": "Stream continuous sensor and audio data without ever stopping: master Circular DMA and Ping-Pong Buffering. Understand how setting the CIRC (Circular Mode) bit causes the DMA hardware to automatically loop back to the beginning of the buffer when it reaches the end, creating an infinite hardware ring buffer. Master the two critical hardware interrupts: Half-Transfer Complete (HT), signaling that Buffer A is ready for processing while DMA fills Buffer B, and Transfer Complete (TC), signaling Buffer B is ready while DMA loops back to fill Buffer A.",
    "conceptInvariant": "Ping-Pong Double Buffering Invariant: While the autonomous DMA hardware is actively writing into one half of the circular memory buffer, software must process exclusively the other half; software must complete its processing before the DMA wraps around to avoid buffer overwrite race conditions.",
    "failureMode": "Taking longer to process Buffer A than the time it takes DMA to fill Buffer B; DMA wraps around and begins overwriting Buffer A while software is still reading it, causing audio clicks, skipped video frames, or corrupted telemetry.",
    "tryItFriction": "Construct a Continuous Double-Buffered ADC Audio Stream in C: configure DMA in circular mode with a 1024-sample buffer; implement HT and TC interrupt handlers that compute signal metrics on the inactive half with zero dropped samples.",
    "socraticHints": [
      "Why is a single buffer completely inadequate for continuous high-speed DMA streaming?",
      "Because when DMA finishes filling a single buffer, it either stops (dropping incoming data while software reads it) or immediately overwrites it from the start (corrupting data currently being read)!",
      "A Ping-Pong double buffer provides continuous, non-stop hardware streaming with zero dropped bytes."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware engineer sets up ADC continuous sampling using DMA circular mode with a 256-word buffer. In the ADC Half-Transfer interrupt handler (HTIF), the engineer writes: 'process_half_buffer(buffer, 128);'. Processing takes 400 microseconds. However, the ADC sampling rate is set to 1 MSPS (1 million samples per second). What disaster occurs every 128 microseconds?",
      "options": [
        "The ADC shuts off.",
        "Catastrophic DMA Overrun / Buffer Lapping: At 1 MSPS, 128 samples take only 128 microseconds to fill! The software processing takes 400 microseconds. DMA laps the CPU, completely overwriting the second half AND wrapping around to corrupt the first half while the CPU is still analyzing it!",
        "The circular mode turns off automatically.",
        "The MCU clock doubles."
      ],
      "answerIdx": 1,
      "debrief": "In real-time streaming, the processing time for half a buffer MUST be strictly less than the time it takes DMA to fill that half (T_process < N_half / F_sample). If processing time exceeds filling time, the system suffers continuous buffer collision."
    },
    "quests": [
      {
        "id": "iot-m1-d17-q1",
        "name": "Circular DMA Timing & Throughput Boundary Formulations",
        "type": "concept",
        "desc": "Calculate the maximum allowable processing latency budget per half-buffer as a function of sampling frequency and buffer size."
      },
      {
        "id": "iot-m1-d17-q2",
        "name": "DMA Circular Buffer Overrun & Collision Analyzer",
        "type": "detective",
        "desc": "Simulate CPU processing delays and capture memory corruption waveforms when DMA overwrites un-processed circular buffer segments."
      },
      {
        "id": "iot-m1-d17-q3",
        "name": "Ping-Pong Circular DMA Streaming Audio Pipeline",
        "type": "mastery",
        "desc": "Implement an end-to-end continuous ADC-to-DAC audio processing pipeline in C utilizing circular DMA, HT/TC interrupts, and DSP filtering."
      },
      {
        "id": "iot-m1-d17-q4",
        "name": "3 AM SRE: Telemetry Packet Glitches on High-Rate Vibration Sensor",
        "type": "incident",
        "desc": "Diagnose an industrial turbine monitoring failure where vibration FFTs were corrupted due to processing latency exceeding circular DMA half-fill time."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Cache Coherency & Memory Barriers: D-Cache Invalidation, Clean-and-Invalidate & Cortex-M7 Physics",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Advanced Architecture (Cache Coherency & CPU Memory Barriers)",
    "spokenGoal": "Step into the deep physics of high-performance microcontrollers: ARM Cortex-M7 and Cortex-M55 Data Caches (D-Cache). Understand Cache Coherency: when the CPU writes data, it updates high-speed L1 cache lines without immediately writing to physical SRAM (Write-Back mode). When DMA transmits from SRAM, it reads stale, unwritten data! Conversely, when DMA receives into SRAM, the CPU reads old cached data. Master cache maintenance operations (Clean, Invalidate, Clean-and-Invalidate) and ARM Memory Barrier assembly instructions (DMB, DSB, ISB).",
    "conceptInvariant": "Cache Coherency Invariant: Before initiating a DMA transmit from memory, software must CLEAN the cache range (flushing dirty cache lines to physical SRAM); after DMA receives into memory, software must INVALIDATE the cache range (forcing the CPU to discard cached copies and re-read fresh physical SRAM).",
    "failureMode": "Upgrading firmware from Cortex-M4 (no cache) to Cortex-M7 (with D-Cache enabled); ethernet packets transmitted by DMA contain all zeros because the CPU's written packet data remains trapped in L1 cache lines and was never flushed to SRAM.",
    "tryItFriction": "Implement Cache Maintenance Routines in C on Cortex-M7: write a test payload into a cached SRAM buffer, demonstrate that DMA transmits stale memory without cache cleaning, apply SCB_CleanDCache_by_Addr(), and verify byte-for-byte consistency on an Ethernet/SPI analyzer.",
    "socraticHints": [
      "What is the difference between D-Cache 'Clean' and 'Invalidate'?",
      "'Clean' writes modified (dirty) cache lines out to physical SRAM; 'Invalidate' marks cache lines as invalid so the CPU is forced to re-fetch fresh data from physical SRAM on the next read!",
      "For DMA Transmit: Clean the cache. For DMA Receive: Invalidate the cache."
    ],
    "situationalPuzzle": {
      "scenario": "A camera vision system on Cortex-M7 captures image frames into an SRAM buffer via DMA. The developer calls 'SCB_InvalidateDCache_by_Addr(buffer, 320*240)'. However, random variables located immediately adjacent to the image buffer in memory become mysteriously corrupted with zeroed values. Why did cache invalidation destroy unrelated variables?",
      "options": [
        "The camera sensor sent corrupted pixels.",
        "Cache Line Alignment Violation: Cortex-M7 cache lines are 32 bytes wide! If the DMA buffer is not strictly aligned to a 32-byte boundary, or its length is not a multiple of 32 bytes, invalidating the cache discards the entire 32-byte cache line containing both the edge of the buffer AND adjacent global variables that had uncommitted writes in cache!",
        "The compiler optimization was set to -O2.",
        "Cortex-M7 does not support camera vision."
      ],
      "answerIdx": 1,
      "debrief": "Cache operations operate on entire cache lines (32 bytes on Cortex-M7). DMA buffers MUST be aligned to 32-byte boundaries (__attribute__((aligned(32)))) and sized in exact multiples of 32 bytes to prevent cache maintenance operations from corrupting adjacent variables."
    },
    "quests": [
      {
        "id": "iot-m1-d18-q1",
        "name": "ARM D-Cache Line Replacement & Write-Back Physics",
        "type": "concept",
        "desc": "Diagram 4-way set-associative cache architecture, dirty bits, tag comparisons, and SRAM write-back cycles on Cortex-M7."
      },
      {
        "id": "iot-m1-d18-q2",
        "name": "Memory Barrier Assembly Analysis (DMB, DSB, ISB)",
        "type": "detective",
        "desc": "Inspect compiled assembly to trace where Data Memory Barriers (DMB) and Data Synchronization Barriers (DSB) enforce out-of-order execution rules."
      },
      {
        "id": "iot-m1-d18-q3",
        "name": "Cache-Coherent DMA Memory Allocator",
        "type": "mastery",
        "desc": "Build a DMA memory allocator in C enforcing 32-byte alignment and automatic Clean/Invalidate wrappers around all peripheral transfers."
      },
      {
        "id": "iot-m1-d18-q4",
        "name": "3 AM SRE: Stale Ethernet Packets Crash Industrial Gateway",
        "type": "incident",
        "desc": "Resolve a high-throughput network freeze on a Cortex-M7 industrial gateway caused by missing cache clean operations before Ethernet DMA transmission."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Hardware Watchdog Timers: Independent Watchdog (IWDG), Window Watchdog (WWDG) & Anti-Freeze Fail-Safes",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Functional Safety & Resilience (Hardware Watchdog Architectures)",
    "spokenGoal": "Guarantee that firmware can never freeze permanently: master Hardware Watchdog Timers. Analyze the Independent Watchdog (IWDG): powered by its own dedicated Low-Speed Internal (LSI) RC oscillator completely independent of the main system clock, resetting the MCU if software fails to 'kick' or 'refresh' the counter before it reaches zero. Compare it to the Window Watchdog (WWDG): requiring software to kick the watchdog strictly within an allowed time window (preventing runaway loops that kick the watchdog too fast). Architect fail-safe kick loops that verify all subsystem health flags before refreshing.",
    "conceptInvariant": "Subsystem Health Watchdog Invariant: A hardware watchdog must never be refreshed inside a blind periodic timer interrupt (SysTick/Timer ISR); the watchdog refresh register must only be written if all critical system tasks have actively reported healthy state execution within their designated deadlines.",
    "failureMode": "Refreshing the IWDG inside the SysTick timer interrupt; the main control thread hangs in a deadlocked while(1) loop, but the SysTick ISR continues kicking the watchdog happily, preventing the hardware from resetting the deadlocked system.",
    "tryItFriction": "Implement a Multi-Task Watchdog Supervisor in C: configure the IWDG for a 2-second timeout window; establish a bitmask where Task 1 (Sensors), Task 2 (Comms), and Task 3 (Control) must each set their health bit before the supervisor clears the mask and kicks the IWDG; simulate a deadlock in Task 1 and verify automatic MCU reset.",
    "socraticHints": [
      "Why is refreshing a watchdog inside a timer ISR a lethal anti-pattern in safety-critical firmware?",
      "Because hardware timer interrupts operate on hardware timers completely independent of the main program logic; the main loop can be permanently deadlocked or crashed, but the timer ISR continues firing forever!",
      "The watchdog will never timeout, defeating the entire purpose of having a hardware watchdog."
    ],
    "situationalPuzzle": {
      "scenario": "An aerospace satellite tracking terminal uses an Independent Watchdog (IWDG) with a 1-second timeout. During a heavy solar storm, electrical noise induces an instruction glitch that jumps the CPU into an infinite loop: 'while(1) { kick_watchdog(); }'. The device is completely non-responsive, yet the IWDG never resets the core. How does a Window Watchdog (WWDG) prevent this runaway failure?",
      "options": [
        "WWDG uses nuclear radiation shielding.",
        "Window Limit Enforcement: An Independent Watchdog only checks if you kick it BEFORE the lower limit (underflow). A Window Watchdog (WWDG) enforces BOTH an upper and lower limit! If software kicks the watchdog TOO EARLY (above the window threshold, as in a tight runaway while(1) loop), the WWDG instantly resets the MCU, detecting the aberrant execution flow immediately!",
        "WWDG does not reset the MCU.",
        "Satellites cannot use watchdogs."
      ],
      "answerIdx": 1,
      "debrief": "A Window Watchdog detects abnormal program execution where code runs too fast or loops erratically. Refreshing the WWDG before the counter drops below the window value immediately triggers a hardware reset."
    },
    "quests": [
      {
        "id": "iot-m1-d19-q1",
        "name": "IWDG vs WWDG Silicon Counter State Machines",
        "type": "concept",
        "desc": "Model the reload value, prescaler math, and allowed kick window time bounds for IWDG and WWDG across clock tolerances."
      },
      {
        "id": "iot-m1-d19-q2",
        "name": "Watchdog Blind Timer ISR Anti-Pattern Audit",
        "type": "detective",
        "desc": "Demonstrate through static code analysis and live execution that kicking watchdogs inside timer ISRs masks main thread deadlocks."
      },
      {
        "id": "iot-m1-d19-q3",
        "name": "Multi-Task Health-Verified Watchdog Supervisor",
        "type": "mastery",
        "desc": "Implement a modular watchdog supervisor in C with per-task heartbeat check-ins, deadline verification, and fail-safe reset logging."
      },
      {
        "id": "iot-m1-d19-q4",
        "name": "3 AM SRE: Satellite Ground Terminal Locked in Runaway Kick Loop",
        "type": "incident",
        "desc": "Remediate a mission-critical lockup where a corrupted state machine continuously kicked the watchdog while telemetry parsing was stalled."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: Zero-CPU DMA Streaming Ring Buffer & Fail-Safe Watchdog Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Production Capstone (DMA Architecture & System Resilience)",
    "spokenGoal": "Architect, construct, and defend Milestone 4: the Zero-CPU DMA Streaming Ring Buffer & Fail-Safe Watchdog Engine. Build a production-grade high-throughput data pipeline in C integrating UART/ADC circular DMA transfers with an Independent Hardware Watchdog supervisor. Stream telemetry at 1 Mbps with 0% CPU intervention, handle Half-Transfer and Transfer-Complete ping-pong processing, enforce 32-byte cache line alignment, and verify that task deadlocks trigger automatic hardware recovery within 1.5 seconds.",
    "conceptInvariant": "Resilient Autonomous Streaming Invariant: High-bandwidth data streams must achieve 100% throughput via hardware DMA ping-pong buffers with zero byte loss, while system integrity is supervised by a multi-task watchdog engine that enforces hardware resets on any task stall exceeding SLA bounds.",
    "failureMode": "Failing the milestone defense when the evaluator injects a simulated memory hang in the communications parser, and the system fails to reset because a rogue ISR continued kicking the watchdog.",
    "tryItFriction": "Compile and run Milestone 4: stream 100,000 continuous bytes over DMA at 921600 baud while monitoring CPU cycle counters (confirming < 2% total CPU load), inject a deliberate deadlock into the sensor loop, and verify on a logic analyzer that the MCU resets exactly 1,500ms later.",
    "socraticHints": [
      "How do you record the root cause of an MCU reset so you can debug it after the watchdog reboots the chip?",
      "By reading the Reset Status Register in RCC (e.g., RCC_CSR) upon boot! It contains dedicated hardware flags: IWDGRSTF (watchdog reset), PINRSTF (reset button), PORRSTF (power-on reset), and SFTRSTF (software reset)!",
      "Firmware must read RCC_CSR, save the reset reason into non-volatile memory or a retained RAM register, and clear the flags."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 4 viva, the evaluator asks: 'Your system just rebooted. How does your firmware know if it rebooted due to a power cycle, an IWDG watchdog timeout, or a software crash?' Your teammate answers: 'We check a global C variable.' Why does checking a global C variable fail?",
      "options": [
        "Global variables are illegal in embedded systems.",
        "SRAM Initialization on Boot Wipes RAM: On power-on or hardware reset, the C startup code (.bss and .data initialization) clears all uninitialized RAM to zero and re-initializes data from Flash! The global variable will always be overwritten. Only reading the hardware RCC_CSR flags or reading an uninitialized NOINIT RAM section retains reset diagnostic state.",
        "The CPU loses its clock.",
        "Watchdogs do not reboot microcontrollers."
      ],
      "answerIdx": 1,
      "debrief": "Hardware status registers (RCC_CSR) are non-volatile across resets. To preserve diagnostic crash state in RAM across a watchdog reboot, variables must be placed in a special linker section (.noinit) that the startup code explicitly skips during memory zeroing."
    },
    "quests": [
      {
        "id": "iot-m1-d20-q1",
        "name": "Zero-CPU DMA & Watchdog Interconnect Specification",
        "type": "concept",
        "desc": "Produce the formal system architecture blueprint detailing DMA stream mapping, FIFO thresholds, circular ping-pong buffers, and watchdog intervals."
      },
      {
        "id": "iot-m1-d20-q2",
        "name": "Reset Reason Forensic Analyzer (RCC_CSR)",
        "type": "detective",
        "desc": "Implement a bootloader diagnostic module reading and classifying hardware reset flags (IWDG, WWDG, POR, PIN, Software Reset)."
      },
      {
        "id": "iot-m1-d20-q3",
        "name": "Zero-CPU DMA Streaming Engine Build",
        "type": "mastery",
        "desc": "Build the complete C firmware engine integrating circular DMA streaming, cache maintenance, ping-pong buffers, and multi-task watchdog supervision."
      },
      {
        "id": "iot-m1-d20-q4",
        "name": "Milestone 4 Defense: High-Rate Stream & Task Deadlock Lab",
        "type": "incident",
        "desc": "Defend the streaming engine under 1 Mbps continuous traffic and artificial task deadlocks before a senior evaluator panel."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Real-Time Operating System (RTOS) Physics: Hard vs Soft RTOS, Task Control Blocks & Stacks",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Operating System Kernel Foundations (RTOS Physics & Task Control Blocks)",
    "spokenGoal": "Transition from bare-metal super-loops to multi-tasking operating systems: master FreeRTOS kernel internals. Understand the fundamental physics of a Real-Time Operating System: Hard Real-Time (missing a deadline equals catastrophic system failure, e.g., airbag deployment) versus Soft Real-Time (missing a deadline degrades quality of service, e.g., video frame drop). Deconstruct the Task Control Block (TCB): task state (Running, Ready, Blocked, Suspended), priority levels, top-of-stack pointers (pxTopOfStack), and task memory allocation.",
    "conceptInvariant": "Deterministic Deadline Invariant: A real-time operating system must guarantee bounded worst-case execution time (WCET) and bounded scheduling latency; an RTOS is defined not by how fast it runs, but by how deterministically and predictably it responds to events.",
    "failureMode": "Allocating a 128-word stack to a task that calls sprintf() and floating-point math; floating-point register saving and string formatting overflow the stack, silently corrupting the adjacent Task Control Block and crashing the kernel.",
    "tryItFriction": "Construct a Minimalist Task Control Block (TCB) in C: allocate independent 512-byte stack arrays for Task 1 and Task 2, initialize the fake stack frames with ARM Cortex-M hardware registers (R0-R3, R12, LR, PC=task_func, xPSR=0x01000000), and inspect the memory layout with a debugger.",
    "socraticHints": [
      "Why must the initial xPSR value in a manually constructed Cortex-M task stack always have bit 24 set to 1 (0x01000000)?",
      "Because bit 24 is the EPSR Thumb state bit! If bit 24 is 0 when the processor pops this register during task launch, it attempts to execute in ARM state, triggering an instant UsageFault!",
      "Every valid task initial stack frame must set bit 24 of xPSR."
    ],
    "situationalPuzzle": {
      "scenario": "A medical ventilator firmware runs FreeRTOS with 4 tasks. After 6 hours of testing, the system crashes with a HardFault. Inspecting pxCurrentTCB reveals that the top of the stack pointer (pxTopOfStack) has retreated past the allocated stack memory into another task's TCB. What FreeRTOS safety feature detects this, and how should it be configured?",
      "options": [
        "FreeRTOS does not support stacks.",
        "Stack Overflow Detection (vApplicationStackOverflowHook): Setting 'configCHECK_FOR_STACK_OVERFLOW = 2' enables method 2 stack checking: the kernel paints the stack with a known pattern (0xA5) on creation and checks the last 16 bytes on every context switch. If corrupted, it invokes the user hook function immediately to log the offending task name and enter a safe state.",
        "Increase MCU clock speed to 1GHz.",
        "Delete the RTOS."
      ],
      "answerIdx": 1,
      "debrief": "Stack overflow is the #1 killer in embedded RTOS development. Setting configCHECK_FOR_STACK_OVERFLOW to 2 enables pattern checking (0xA5 canary bytes) at the stack boundary, trapping overflows the instant they happen."
    },
    "quests": [
      {
        "id": "iot-m1-d21-q1",
        "name": "Hard vs Soft Real-Time Mathematical Latency Bounds",
        "type": "concept",
        "desc": "Formalize Rate Monotonic Scheduling (RMS) utilization bounds (U = N*(2^(1/N) - 1)) and prove schedulability of 3 periodic tasks."
      },
      {
        "id": "iot-m1-d21-q2",
        "name": "Task Stack Watermark & Memory Canary Audit",
        "type": "detective",
        "desc": "Inspect uxTaskGetStackHighWaterMark() and detect 0xA5 canary byte destruction across nested function call depths."
      },
      {
        "id": "iot-m1-d21-q3",
        "name": "Manual Task Stack Frame Initializer",
        "type": "mastery",
        "desc": "Write an ARM assembly/C function that initializes fake stack frames for new tasks with valid Thumb-2 xPSR registers and return addresses."
      },
      {
        "id": "iot-m1-d21-q4",
        "name": "3 AM SRE: ICU Ventilator Task Stack Overflow Under Heavy Alarm Load",
        "type": "incident",
        "desc": "Diagnose a critical ventilator crash where emergency alarm formatting blew past task stack boundaries during simultaneous sensor alerts."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Preemptive Scheduling & Context Switching: PendSV Exception, SysTick & Assembly Stack Swapping",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Low-Level Kernel Engineering (Context Switching Physics & ARM Assembly)",
    "spokenGoal": "Deconstruct the black box of operating system multitasking: write an ARM Cortex-M Context Switcher in assembly. Understand why context switching is executed inside the lowest-priority exception: PendSV (Pended Servicing). Trace the complete context switch sequence: SysTick fires periodically, determines a higher-priority task is ready, pends PendSV, and exits. When all other interrupts complete, PendSV executes: saving software registers (R4-R11) onto the Process Stack Pointer (PSP), updating pxCurrentTCB->pxTopOfStack, loading the new task's pxTopOfStack, restoring R4-R11, and returning to the new task via EXC_RETURN (0xFFFFFFFD).",
    "conceptInvariant": "PendSV Deferred Switching Invariant: Context switching on ARM Cortex-M must strictly execute within the PendSV exception configured at the lowest possible priority (0xFF), ensuring that no context switch ever interrupts or delays an active hardware interrupt service routine.",
    "failureMode": "Triggering a context switch directly inside a high-priority hardware timer ISR; the context switch attempts to swap task stacks while the processor is in an active interrupt context, corrupting the Main Stack Pointer (MSP) and triggering a HardFault.",
    "tryItFriction": "Write the pure GNU ARM Assembly implementation of PendSV_Handler: push R4-R11 onto the current task stack (using PSP), save PSP to pxCurrentTCB, call vTaskSwitchContext(), load new PSP from pxCurrentTCB, pop R4-R11 from new task stack, and execute 'BX LR' with EXC_RETURN.",
    "socraticHints": [
      "Why does ARM Cortex-M have TWO stack pointers: Main Stack Pointer (MSP) and Process Stack Pointer (PSP)?",
      "To cleanly separate OS/interrupt execution from application task execution! The kernel and all hardware ISRs use MSP, while application tasks use PSP!",
      "If a buggy application task overflows its PSP stack, the hardware interrupts running on MSP remain uncorrupted and can safely trigger diagnostic fault handlers."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware developer builds a custom RTOS kernel. Tasks run fine for 5 minutes, but when an external UART interrupt fires during task execution, the MCU crashes with an invalid instruction fault. Inspecting registers shows LR contains 0xFFFFFFFD. The developer tried to branch to LR with 'MOV PC, LR'. What is the special meaning of EXC_RETURN in ARM Cortex-M?",
      "options": [
        "0xFFFFFFFD is an invalid memory address.",
        "EXC_RETURN Exception Recovery Mechanism: In Cortex-M, upon entering an exception, LR is loaded with a special magic value called EXC_RETURN (e.g., 0xFFFFFFFD = return to Thread mode using PSP). Returning must use 'BX LR' (Branch and Exchange)! Using 'MOV PC, LR' does not trigger the hardware exception unstacking state machine, locking the CPU in an invalid state.",
        "The CPU ran out of stack.",
        "UART interrupts cannot coexist with RTOS."
      ],
      "answerIdx": 1,
      "debrief": "In ARM Cortex-M architecture, exception return is triggered specifically by a branch instruction targeting an EXC_RETURN magic value (0xFFFFFFF1, 0xFFFFFFF9, or 0xFFFFFFFD). 'BX LR' causes the hardware to pop R0-R3, R12, LR, PC, and xPSR from the task stack and restore Thread mode."
    },
    "quests": [
      {
        "id": "iot-m1-d22-q1",
        "name": "ARM Cortex-M Double Stack Architecture (MSP vs PSP)",
        "type": "concept",
        "desc": "Diagram CONTROL register bit 1 (SPSEL), Thread vs Handler mode transitions, and stack pointer isolation."
      },
      {
        "id": "iot-m1-d22-q2",
        "name": "PendSV Assembly Context Switch Disassembly",
        "type": "detective",
        "desc": "Step cycle-by-cycle through PendSV_Handler in GDB: inspect STMDB/LDMIA of R4-R11 and EXC_RETURN hardware unstacking."
      },
      {
        "id": "iot-m1-d22-q3",
        "name": "Pure Assembly PendSV Context Switcher",
        "type": "mastery",
        "desc": "Author a standalone GNU Assembly implementation of PendSV_Handler and SysTick_Handler for preemptive round-robin scheduling."
      },
      {
        "id": "iot-m1-d22-q4",
        "name": "3 AM SRE: HardFault During ISR-Triggered Context Switch",
        "type": "incident",
        "desc": "Resolve a kernel crash where an engineer invoked a task-yielding function from inside a high-priority hardware ISR instead of the FromISR variant."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Task Synchronization: Semaphores, Mutexes & Priority Inversion (The Mars Pathfinder Incident)",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Concurrency Architecture & System Safety (Mutexes & Priority Inversion)",
    "spokenGoal": "Master synchronization and avoid the most famous bug in space exploration history: Priority Inversion. Analyze the 1997 Mars Pathfinder spacecraft incident: a low-priority meteorological task acquired a shared bus mutex; a high-priority information bus task was blocked waiting for the mutex; a medium-priority communications task preempted the low-priority task, preventing it from releasing the mutex and causing watchdog resets that almost doomed the mission. Master FreeRTOS Mutexes with Priority Inheritance: how the kernel temporarily boosts the low-priority task's priority to match the blocked high-priority task until the mutex is released.",
    "conceptInvariant": "Priority Inheritance Invariant: When a high-priority task blocks waiting for a mutex held by a lower-priority task, the kernel must temporarily elevate the priority of the holding task to match that of the blocked high-priority task, preventing unbounded preemption by medium-priority tasks.",
    "failureMode": "Using a binary semaphore instead of a mutex to protect a shared I2C sensor bus; binary semaphores lack priority inheritance, allowing medium-priority background networking tasks to starve the bus-holding task, triggering an emergency watchdog reset.",
    "tryItFriction": "Recreate the Mars Pathfinder Priority Inversion bug in C: launch Task Low (priority 1), Task Med (priority 2), and Task High (priority 3); demonstrate that Task Med starves Task High indefinitely when using a binary semaphore, and then fix it by swapping to a FreeRTOS Mutex with Priority Inheritance.",
    "socraticHints": [
      "What is the crucial difference between a Binary Semaphore and a Mutex in FreeRTOS?",
      "A Mutex includes ownership and Priority Inheritance (only the task that acquired it can release it, and holding it elevates priority if higher tasks block); a Semaphore has no ownership and no priority inheritance (any task or ISR can give/take it)!",
      "Use Mutexes for mutual exclusion (shared resources); use Semaphores for signaling and ISR synchronization."
    ],
    "situationalPuzzle": {
      "scenario": "A developer writes an Interrupt Service Routine to handle a button press. Inside the ISR, the developer writes: 'xSemaphoreTake(xI2cMutex, portMAX_DELAY); read_sensor(); xSemaphoreGive(xI2cMutex);'. The compiler issues a warning, and on the first button press, the MCU triggers an immediate kernel assertion or crashes. Why can't you take a Mutex inside an ISR?",
      "options": [
        "Buttons do not support I2C.",
        "ISRs Cannot Block or Wait: An Interrupt Service Routine cannot block (portMAX_DELAY)! If an ISR were allowed to block, what would the CPU do? ISRs have no Task Control Block, no independent stack to save, and pausing an ISR pauses the entire CPU core. Mutexes can block and have priority inheritance (meaningless for ISRs). ISRs must never take mutexes!",
        "Mutexes require 128MB of RAM.",
        "The button bounce inverted the priority."
      ],
      "answerIdx": 1,
      "debrief": "An Interrupt Service Routine must never call any blocking function or attempt to take a Mutex. For ISR-to-Task synchronization, ISRs must use 'FromISR' API variants (e.g., xSemaphoreGiveFromISR) to unblock background tasks without blocking the hardware interrupt pipeline."
    },
    "quests": [
      {
        "id": "iot-m1-d23-q1",
        "name": "Priority Inversion Formal State Machine & Time Bounds",
        "type": "concept",
        "desc": "Model Task Low, Medium, High state transitions and calculate the unbounded blocking interval under binary semaphores."
      },
      {
        "id": "iot-m1-d23-q2",
        "name": "Mars Pathfinder Simulator & Priority Inheritance Proof",
        "type": "detective",
        "desc": "Profile task execution traces to verify that pxCurrentTCB priority dynamically escalates and de-escalates during mutex contention."
      },
      {
        "id": "iot-m1-d23-q3",
        "name": "Thread-Safe Multi-Peripheral Mutex Manager",
        "type": "mastery",
        "desc": "Build an I2C/SPI bus resource manager in C featuring recursive mutexes, priority inheritance, and bounded acquisition timeouts."
      },
      {
        "id": "iot-m1-d23-q4",
        "name": "3 AM SRE: Autonomous Rover Watchdog Reset from Priority Inversion",
        "type": "incident",
        "desc": "Resolve a high-severity field freeze where a medium-priority logging task starved a telemetry bus lock, triggering continuous rover reboots."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Inter-Task Communication: FreeRTOS Queues, Direct-to-Task Notifications & Event Groups",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Concurrent Communication Architecture (Queues & Lightweight Task Notifications)",
    "spokenGoal": "Communicate safely between concurrent tasks: master FreeRTOS communication primitives. Understand FreeRTOS Queues: FIFO message channels that pass data by-copy (preventing pointer aliasing race conditions) with thread-safe blocking on read and write. Analyze Direct-to-Task Notifications: ultra-lightweight 32-bit notifications embedded directly inside each Task Control Block (45% faster and zero RAM allocation compared to separate queues or semaphores). Master Event Groups: bitmask synchronization enabling tasks to wait for multiple flags simultaneously (AND/OR conjunctions).",
    "conceptInvariant": "Copy-by-Value Queue Invariant: FreeRTOS queues copy data byte-for-byte into kernel storage upon send and copy it out upon receive, ensuring complete memory decoupling between sender and receiver unless explicit pointer queues with strict ownership transfer are designed.",
    "failureMode": "Passing a pointer to a local stack array through a FreeRTOS queue; the sending task returns from its function, corrupting the memory before the receiving task ever dequeues the pointer.",
    "tryItFriction": "Construct an Event-Driven Multi-Sensor Processing Pipeline in C: create a Sensor Task pushing telemetry structs into a FreeRTOS Queue; create a Processing Task blocked on the queue; and use Direct-to-Task Notifications from a button ISR to instantly trigger an urgent display update with zero queue overhead.",
    "socraticHints": [
      "Why are Direct-to-Task Notifications (xTaskNotifyGive / ulTaskNotifyTake) 45% faster than FreeRTOS Binary Semaphores?",
      "Because every FreeRTOS task already has a 32-bit notification value built directly inside its own Task Control Block structure! No separate semaphore object needs to be allocated or searched in memory!",
      "The kernel modifies the TCB value directly without queue locks or list searching."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware engineer creates an Event Group with 3 bits: BIT_GPS_READY (bit 0), BIT_WIFI_READY (bit 1), and BIT_NTP_READY (bit 2). A telemetry task waits for all 3: 'xEventGroupWaitBits(eg, 0x07, pdTRUE, pdTRUE, portMAX_DELAY);'. The GPS and WiFi bits are set, but NTP never connects. Why does the telemetry task stay blocked forever, and how should a timeout fallback be structured?",
      "options": [
        "Event groups do not support 3 bits.",
        "Strict AND Conjunction & Infinite Timeout: Passing 'pdTRUE' for xWaitForAllBits means the task executes an AND condition (waits for bit 0 AND bit 1 AND bit 2). Since NTP never connected, the condition is never satisfied, and portMAX_DELAY keeps the task blocked indefinitely! The fix is specifying a bounded timeout (e.g., pdMS_TO_TICKS(5000)) and checking partial bits on timeout.",
        "The MCU clock froze.",
        "Event groups require an external EEPROM."
      ],
      "answerIdx": 1,
      "debrief": "When waiting on multiple asynchronous subsystem flags, unbounded waits on strict conjunctions (AND) invite total system stalls if any single subsystem degrades. Always establish bounded timeout fallbacks to allow degraded operation."
    },
    "quests": [
      {
        "id": "iot-m1-d24-q1",
        "name": "Queue Copy-by-Value vs Pointer Passing Memory Physics",
        "type": "concept",
        "desc": "Calculate CPU cycle overhead and RAM footprint of by-value queue copying versus zero-copy pointer passing with ownership queues."
      },
      {
        "id": "iot-m1-d24-q2",
        "name": "Direct-to-Task Notification Speed Benchmarker",
        "type": "detective",
        "desc": "Benchmark cycle counts for unblocking a task via Binary Semaphore versus Direct-to-Task Notification using DWT timer."
      },
      {
        "id": "iot-m1-d24-q3",
        "name": "Event-Driven Telemetry Message Bus Pipeline",
        "type": "mastery",
        "desc": "Implement a full sensor aggregation hub in C using thread-safe queues, Event Groups, and high-speed task notifications."
      },
      {
        "id": "iot-m1-d24-q4",
        "name": "3 AM SRE: Stack Pointer Corruption in Queue Consumer Task",
        "type": "incident",
        "desc": "Triage a production crash where a junior developer pushed local stack pointers through a queue, causing unpredictable memory corruption."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone 5: Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Production Capstone (RTOS Kernel Architecture & Concurrency)",
    "spokenGoal": "Architect, construct, and defend Milestone 5: the Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine. Build a rock-solid FreeRTOS firmware platform integrating 4 concurrent real-time tasks: High-Priority Control (1kHz), Medium-Priority Communications (UART/SPI), Low-Priority Telemetry (Flash logging), and Background Watchdog Supervisor. Enforce strict Priority Inheritance across shared hardware buses, demonstrate zero-latency Direct-to-Task notification signaling, and verify that high-priority control deadlines are never missed under heavy bus contention.",
    "conceptInvariant": "Zero-Jitter Control Invariant: The high-priority real-time control task must execute its 1kHz control loop with less than 2 microseconds of scheduling jitter, completely immune to background telemetry logging or concurrent queue serialization workloads.",
    "failureMode": "Failing the milestone defense when the panel injects a heavy telemetry flood, and the high-priority control loop experiences 12 milliseconds of jitter due to missing priority inheritance on the shared I2C bus.",
    "tryItFriction": "Run the Milestone 5 Concurrency Benchmark: measure high-priority task scheduling jitter using a logic analyzer connected to a dedicated debug pin; prove that jitter remains < 1.8 microseconds while low- and medium-priority tasks hammer shared queues and mutexes under maximum load.",
    "socraticHints": [
      "How do you measure FreeRTOS task scheduling jitter with nanosecond precision?",
      "By configuring the task to toggle a physical GPIO pin at the very first instruction of its periodic loop and capturing the waveform on an oscilloscope or digital logic analyzer!",
      "The variation in the period between toggles represents true real-time jitter."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 5 evaluation, the evaluator injects a simulated denial-of-service attack on your UART telemetry port: 100,000 bytes per second flood the input. Your high-priority 1kHz motor control loop must continue running without missing a single tick. What architectural decision protects the motor control loop?",
      "options": [
        "Unplug the UART cable.",
        "Priority Assignment & DMA Ring Buffering: The UART receive is offloaded to circular DMA with a ring buffer, and the UART parsing task is assigned Priority 1 (lower than Motor Control at Priority 3). Even if the UART queue fills up, FreeRTOS preemption ensures the motor control task preempts the communications parser instantly every 1ms.",
        "Make the motor control task run in an interrupt.",
        "Lower the MCU clock speed."
      ],
      "answerIdx": 1,
      "debrief": "In a preemptive RTOS, high-priority hard real-time tasks always preempt lower-priority communication tasks. As long as communications processing does not execute inside high-priority interrupts, input floods cannot starve mission-critical control loops."
    },
    "quests": [
      {
        "id": "iot-m1-d25-q1",
        "name": "Real-Time Task Hierarchy & WCET Budget Formulation",
        "type": "concept",
        "desc": "Calculate Worst-Case Execution Times (WCET) and construct an execution timeline proving zero deadline misses under RMS scheduling."
      },
      {
        "id": "iot-m1-d25-q2",
        "name": "High-Priority Task Jitter & Preemption Profiler",
        "type": "detective",
        "desc": "Measure nanosecond jitter on an oscilloscope pin toggle during maximum background queue and mutex contention."
      },
      {
        "id": "iot-m1-d25-q3",
        "name": "Preemptive Task Manager Engine Build",
        "type": "mastery",
        "desc": "Implement the complete FreeRTOS firmware platform integrating 4 prioritized tasks, mutex bus managers, and queue message pipelines."
      },
      {
        "id": "iot-m1-d25-q4",
        "name": "Milestone 5 Defense: Priority Inversion & Bus Contention Chaos Lab",
        "type": "incident",
        "desc": "Defend the RTOS firmware engine under simulated Mars Pathfinder priority inversion and telemetry flood attacks before a senior faculty panel."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "RTOS Dynamic Memory Allocation: heap_1 through heap_5, Fragmentation & Static Allocation",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Memory Safety & Determinism (RTOS Heap Schemes & Static Allocation Invariants)",
    "spokenGoal": "Eliminate the embedded engineer's nightmare: Memory Fragmentation. Compare FreeRTOS memory allocation schemes: heap_1 (allocate-only, never frees, 100% immune to fragmentation), heap_2 (linked-list with best-fit, vulnerable to fragmentation), heap_3 (wraps standard malloc/free with thread safety), heap_4 (coalesces adjacent free blocks to resist fragmentation), and heap_5 (spans multiple non-contiguous memory regions like internal SRAM and external SDRAM). Master the ultimate gold standard of mission-critical systems: 100% Static Allocation using xTaskCreateStatic() and xQueueCreateStatic().",
    "conceptInvariant": "Deterministic Static Memory Invariant: In safety-critical embedded systems (ISO 26262, DO-178C, IEC 61508), dynamic memory allocation (malloc/free) after system initialization is strictly prohibited; all tasks, queues, stacks, and buffers must be allocated statically at compile time.",
    "failureMode": "Repeatedly allocating and freeing small 32-byte JSON strings using heap_2; after 4 days of continuous runtime, heap memory becomes hopelessly fragmented into tiny unusable slivers, causing the next 128-byte allocation to fail and rebooting the device.",
    "tryItFriction": "Refactor a dynamic FreeRTOS application to 100% Static Allocation: implement vApplicationGetIdleTaskMemory() and vApplicationGetTimerTaskMemory(), replace xTaskCreate() with xTaskCreateStatic() using dedicated static stack arrays, and compile with 'configSUPPORT_DYNAMIC_ALLOCATION = 0' to prove zero runtime heap usage.",
    "socraticHints": [
      "Why is 'heap_4' significantly superior to 'heap_2' for embedded systems that require dynamic allocation?",
      "Because heap_4 automatically coalesces (merges) adjacent free blocks of memory into a single larger block whenever memory is freed!",
      "heap_2 does not merge adjacent blocks, leading to severe fragmentation where total free memory looks large but no single contiguous block is big enough."
    ],
    "situationalPuzzle": {
      "scenario": "A drone autopilot firmware compiles with 'configSUPPORT_DYNAMIC_ALLOCATION = 1'. The drone flies successfully for 20 minutes. On minute 22, the camera vision task attempts to allocate a temporary 512-byte tracking buffer using pvPortMalloc(). The allocation returns NULL, even though 'xPortGetFreeHeapSize()' reports 14,000 bytes free! Why did pvPortMalloc() return NULL?",
      "options": [
        "The battery voltage dropped.",
        "Heap Fragmentation: Although 14KB of total heap is free, that memory is fragmented into hundreds of tiny 16-byte and 32-byte isolated chunks. There is no single CONTIGUOUS block of 512 bytes available! The allocation fails, proving why total free heap is a misleading metric in fragmented systems.",
        "ARM Cortex-M only allows 4KB of heap.",
        "The camera sensor crashed."
      ],
      "answerIdx": 1,
      "debrief": "Memory fragmentation occurs when small allocations and deallocations scatter free memory into non-contiguous slivers. In life-critical firmware, dynamic runtime allocations are banned; static allocation guarantees that every task and buffer has dedicated, guaranteed memory forever."
    },
    "quests": [
      {
        "id": "iot-m1-d26-q1",
        "name": "FreeRTOS Heap Schemes (heap_1 to heap_5) Architectural Matrix",
        "type": "concept",
        "desc": "Compare algorithm complexity, coalescing capability, multi-region support, and fragmentation risk across all 5 FreeRTOS heap schemes."
      },
      {
        "id": "iot-m1-d26-q2",
        "name": "Heap Fragmentation Simulator & Canary Inspector",
        "type": "detective",
        "desc": "Simulate 10,000 random allocate/free cycles under heap_2 versus heap_4 and track the largest available contiguous block size."
      },
      {
        "id": "iot-m1-d26-q3",
        "name": "Zero-Dynamic-Allocation Static FreeRTOS Firmware",
        "type": "mastery",
        "desc": "Build a complete multi-tasking application configured with configSUPPORT_DYNAMIC_ALLOCATION=0 using purely static task and queue memory."
      },
      {
        "id": "iot-m1-d26-q4",
        "name": "3 AM SRE: Autopilot Fatal Crash from Heap Allocation Failure",
        "type": "incident",
        "desc": "Resolve a high-severity telemetry drone crash caused by dynamic memory exhaustion in a GPS waypoint allocation routine."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Software Timers & Idle Task Hook: Watchdog Kicking & Tickless Low-Power Mode (WFI/WFE)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Low-Power Firmware Engineering (Software Timers & Tickless Idle Physics)",
    "spokenGoal": "Squeeze months of battery life from a coin cell: master FreeRTOS Software Timers and Tickless Idle Mode. Understand the FreeRTOS Daemon Task (Timer Service Task): how timers execute without hardware counter resources, driven by an internal timer command queue. Master the Idle Task Hook (vApplicationIdleHook): executing low-priority background housekeeping and watchdog safety checks. Transition to ultra-low power: understand why periodic SysTick interrupts (1,000 times a second) destroy battery life, and implement Tickless Idle (configUSE_TICKLESS_IDLE) using WFI (Wait For Interrupt) to stop the CPU clock for seconds at a time.",
    "conceptInvariant": "Tickless Power Optimization Invariant: When all RTOS tasks are blocked waiting for future deadlines, the kernel must suppress periodic SysTick interrupts, reprogram a low-power hardware timer (LPTIM) for the expected sleep duration, and put the CPU core into deep sleep (WFI), reducing power consumption from 20mA to < 15 microamps.",
    "failureMode": "Calling a blocking function (vTaskDelay) inside a FreeRTOS Software Timer callback; timer callbacks execute in the context of the singleton Timer Daemon Task, so blocking it freezes ALL software timers across the entire operating system.",
    "tryItFriction": "Configure FreeRTOS Tickless Idle Mode on an ARM Cortex-M target: configure configUSE_TICKLESS_IDLE=1, set up an external RTC or low-power timer, put the processor into sleep with WFI when no tasks are ready, and measure current draw drop from 18mA down to 25 microamps on a power profiler.",
    "socraticHints": [
      "Why must you NEVER call vTaskDelay() or take a blocking mutex inside a FreeRTOS Software Timer callback?",
      "Because all software timer callbacks execute sequentially within a single shared kernel task: the Timer Service Daemon Task (prvTimerTask)!",
      "If you block inside a timer callback, you block the entire timer daemon, halting all other software timers and preventing timer command processing."
    ],
    "situationalPuzzle": {
      "scenario": "A smart water meter runs on a single lithium battery designed to last 10 years. In testing, the battery dies in 3 weeks. Probing the MCU shows that even when the meter has no water flow for hours, the CPU wakes up 1,000 times every second. What default RTOS configuration is draining the battery, and how does Tickless Idle fix it?",
      "options": [
        "The water meter has a short circuit.",
        "SysTick Interrupt Frequency & Tickless Idle Absence: The default FreeRTOS configuration fires a SysTick interrupt every 1ms (1,000 Hz) to advance the kernel tick counter, waking the CPU out of low-power sleep 86.4 million times a day! Enabling 'configUSE_TICKLESS_IDLE = 1' configures the kernel to stop the SysTick clock during idle periods and sleep until the next real task deadline.",
        "The battery was inserted backwards.",
        "FreeRTOS cannot run on batteries."
      ],
      "answerIdx": 1,
      "debrief": "Periodic 1ms timer ticks are devastating to battery life. Tickless idle mode suppresses the periodic tick whenever the CPU has no work, reprogramming a low-power hardware timer to wake the core only when an actual task deadline arrives or an external interrupt occurs."
    },
    "quests": [
      {
        "id": "iot-m1-d27-q1",
        "name": "Tickless Idle Power Calculation & Energy Budget Formulation",
        "type": "concept",
        "desc": "Calculate milliamp-hour consumption and battery lifespan across active, idle, and deep-sleep duty cycles on a 2400mAh cell."
      },
      {
        "id": "iot-m1-d27-q2",
        "name": "Timer Daemon Task Queue Starvation Profiler",
        "type": "detective",
        "desc": "Trace system execution to observe how a blocking call inside a software timer callback stalls all downstream timer events."
      },
      {
        "id": "iot-m1-d27-q3",
        "name": "Tickless Low-Power Firmware with LPTIM",
        "type": "mastery",
        "desc": "Implement custom vPortSuppressTicksAndSleep() using Low-Power Timer (LPTIM) to achieve < 30 microamp sleep current."
      },
      {
        "id": "iot-m1-d27-q4",
        "name": "3 AM SRE: Smart Gas Meter Fleet Battery Depletion in Field",
        "type": "incident",
        "desc": "Remediate a mass-deployment crisis where 10,000 smart utility meters drained their 10-year batteries in 30 days due to disabled tickless idle."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "MISRA-C & ISO 26262 Coding Standards: Static Analysis, Undefined Behavior & Safe Embedded Patterns",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Functional Safety & Compliance (MISRA-C Invariants & Undefined Behavior Elimination)",
    "spokenGoal": "Write firmware worthy of automotive and medical certification: master MISRA-C:2012 guidelines and ISO 26262 functional safety. Understand why ordinary C code is terrifying in safety-critical systems due to Undefined Behavior (UB), implicit type promotions, pointer arithmetic aliasing, and unbounded recursion. Master key MISRA rules: Rule 11.4 (no conversion between pointer to object and different pointer), Rule 17.2 (no recursion), Rule 10.4 (matched essential types in operations), and Rule 21.3 (no dynamic memory allocation). Integrate static analysis tools (Cppcheck, PC-lint, Clang-Tidy) into the automated build pipeline.",
    "conceptInvariant": "Zero-Undefined-Behavior Invariant: Safety-critical embedded firmware must contain zero instances of Undefined Behavior (UB) and zero un-deviated MISRA-C mandatory rule violations; all array indexing must be bounded by compile-time assertions or explicit runtime guards.",
    "failureMode": "Using unbounded recursion to traverse a linked list in safety-critical brake-by-wire firmware; unexpected list depth causes stack exhaustion, overwriting memory and disabling anti-lock braking.",
    "tryItFriction": "Audit and remediate a legacy C sensor driver against MISRA-C:2012: eliminate implicit integer conversions, replace raw pointer arithmetic with typed array indexing, remove banned standard library functions (goto, malloc, setjmp), and achieve 100% clean passes on Cppcheck with '--enable=all --inconclusive'.",
    "socraticHints": [
      "Why does MISRA-C strictly ban recursion (functions calling themselves)?",
      "Because on microcontrollers with fixed, scarce stack sizes, recursive functions have unbounded stack depth that cannot be mathematically proven by static analysis tools at compile time!",
      "A recursive function risks stack overflow under unexpected inputs. All loops must be iterative with provable upper bounds."
    ],
    "situationalPuzzle": {
      "scenario": "An automotive firmware engineer writes an airbag deployment check: 'uint16_t sensor_val = read_adc(); if (sensor_val + 500 > 65000) deploy_airbag();'. The compiler is GCC with -O2. The code passes testing. However, when sensor_val is 65200, an integer overflow occurs in an intermediate step, leading to undefined behavior. What subtle C integer promotion rule caused the bug, and how does MISRA-C prevent it?",
      "options": [
        "C does not support numbers above 1000.",
        "Implicit Integer Promotion & Undefined Overflow: In standard C, uint16_t operands are implicitly promoted to signed 32-bit 'int' before arithmetic. If types are mismatched or overflow occurs, compiler optimizations can legally assume signed overflow never happens and optimize away the safety check! MISRA-C Rule 10.4 enforces explicit casting and matching essential types (e.g., '((uint32_t)sensor_val + 500U) > 65000U') to prevent implicit promotion bugs.",
        "The airbag hardware draws too much power.",
        "Airbags only deploy on odd numbers."
      ],
      "answerIdx": 1,
      "debrief": "C integer promotion rules are one of the most dangerous sources of subtle bugs in embedded systems. MISRA-C enforces strict essential type rules, requiring explicit unsigned suffixes (500U) and explicit width casting to prevent silent signed overflow assumptions."
    },
    "quests": [
      {
        "id": "iot-m1-d28-q1",
        "name": "MISRA-C:2012 Mandatory Rules & Undefined Behavior Taxonomy",
        "type": "concept",
        "desc": "Catalog the top 10 safety-critical MISRA-C rules governing pointer casts, recursion, type conversions, and variable scope."
      },
      {
        "id": "iot-m1-d28-q2",
        "name": "Cppcheck / Clang-Tidy Automated MISRA Linter",
        "type": "detective",
        "desc": "Configure static analysis rulesets to flag implicit integer promotions, uninitialized pointers, and unreachable dead code."
      },
      {
        "id": "iot-m1-d28-q3",
        "name": "MISRA-Compliant Fail-Safe Actuator Driver",
        "type": "mastery",
        "desc": "Refactor a motor actuator driver in C to achieve zero MISRA-C:2012 violations, bounded loops, and defensive parameter assertions."
      },
      {
        "id": "iot-m1-d28-q4",
        "name": "3 AM SRE: Automotive Brake Controller Fails ISO 26262 Audit",
        "type": "incident",
        "desc": "Remediate critical safety violations in an electric vehicle brake controller codebase to pass an urgent regulatory ISO 26262 ASIL-D certification audit."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Production Hardware Debugging: SWD/JTAG Protocols, Fault Handlers & Core Dump Forensics",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Crash Forensics & Hardware Diagnostics (SWD/JTAG & Fault Handlers)",
    "spokenGoal": "Diagnose crashes on bare metal when there is no operating system or console: master Hardware Debugging and ARM Cortex-M Fault Handlers. Understand Serial Wire Debug (SWD: SWDIO, SWCLK) and JTAG (TDI, TDO, TCK, TMS) protocols. Deconstruct the Cortex-M Fault Architecture: HardFault, BusFault, UsageFault, and Memory Management Fault (MemManage). Write a naked assembly HardFault_Handler that inspects the stack pointer (MSP vs PSP), extracts the pushed Program Counter (PC), Link Register (LR), and Configurable Fault Status Register (CFSR), and prints a complete post-mortem crash dump over UART.",
    "conceptInvariant": "Post-Mortem Crash Forensic Invariant: When an unhandled hardware fault occurs, the processor must capture the active stack frame, saved Program Counter, faulting instruction address (BFAR/MMFAR), and CFSR register bits into non-volatile storage before halting or resetting.",
    "failureMode": "Leaving the default while(1) infinite loop in HardFault_Handler; when a field unit crashes at a customer site, the device freezes silently without logging any diagnostic information, making root-cause analysis impossible.",
    "tryItFriction": "Implement a Production HardFault Crash Dumper in C and Assembly: write a naked assembly entry point that checks bit 2 of EXC_RETURN to select MSP or PSP, extracts the stacked PC, decodes the CFSR register (identifying DIVBYZERO, UNALIGNED, or PRECISERR), and prints the exact faulting address and register dump.",
    "socraticHints": [
      "How do you find the exact C line number that caused a HardFault from a raw hex Program Counter address (e.g., 0x080014C2)?",
      "By using the GNU toolchain command: 'arm-none-eabi-addr2line -e firmware.elf 0x080014C2'!",
      "It cross-references the address against DWARF debug symbols in the ELF file and outputs the exact file name and line number!"
    ],
    "situationalPuzzle": {
      "scenario": "A firmware crash dumper logs: 'HardFault: CFSR = 0x00010000, Stacked PC = 0x080021A4'. Decoding CFSR bit 16 reveals: 'UNDEFINSTR' (The processor attempted to execute an undefined instruction). The code was compiled with arm-none-eabi-gcc. Why would an ARM processor encounter an undefined instruction at a valid Flash address?",
      "options": [
        "The Flash memory melted.",
        "Corrupted Function Pointer or Branch to Non-Thumb Address: The software executed an indirect function call through an uninitialized or corrupted function pointer (or jumped to a label with bit 0 = 0). The core branched to an unaligned address or data bytes, attempting to decode non-executable binary bytes as machine instructions, triggering an instant UNDEFINSTR UsageFault/HardFault.",
        "The ARM processor does not support instructions.",
        "The compiler optimization was too high."
      ],
      "answerIdx": 1,
      "debrief": "UNDEFINSTR faults almost always indicate that the program counter branched into data memory, uninitialized Flash, or through a corrupted function pointer containing an invalid address. Using addr2line on the stacked Link Register (LR) identifies which caller invoked the bad pointer."
    },
    "quests": [
      {
        "id": "iot-m1-d29-q1",
        "name": "Cortex-M Configurable Fault Status Register (CFSR) Bitmask Anatomy",
        "type": "concept",
        "desc": "Map individual bits for UsageFault (DIVBYZERO, UNALIGNED, UNDEFINSTR), BusFault (PRECISERR, BFARVALID), and MemManage faults."
      },
      {
        "id": "iot-m1-d29-q2",
        "name": "Naked Assembly HardFault Stack Frame Extractor",
        "type": "detective",
        "desc": "Step through a naked assembly fault handler that reads LR to determine whether MSP or PSP holds the exception stack frame."
      },
      {
        "id": "iot-m1-d29-q3",
        "name": "Non-Volatile Crash Dump & Addr2Line Forensic Logger",
        "type": "mastery",
        "desc": "Build a complete C crash forensic logger saving PC, LR, CFSR, and BFAR into battery-backed backup registers across reboots."
      },
      {
        "id": "iot-m1-d29-q4",
        "name": "3 AM SRE: Field Brick Diagnostic Forensics on Industrial Sensors",
        "type": "incident",
        "desc": "Recover and analyze flash core dumps from remote industrial sensor units crashing silently in an oil refinery installation."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: NanoRTOS Preemptive Kernel & Multitasking Firmware Engine Capstone Viva Gate",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Month 1 Master Capstone & Viva Voce (Comprehensive Embedded Systems Defense)",
    "spokenGoal": "The Month 1 Master Capstone and Comprehensive Viva Voce Gate: stand before the Senior Embedded Architecture Board to present, demonstrate, and defend NanoRTOS. Demonstrate the complete synthesis of all 30 days of embedded systems engineering: bare-metal clock configuration (168MHz HSE-PLL), atomic BSRR GPIO drivers, zero-copy circular DMA streaming, hardware TRGO ADC data acquisition, custom PendSV assembly context switcher, FreeRTOS priority-inheritance mutexes, 100% static allocation, tickless low-power sleep, MISRA-C compliance, and automated HardFault crash dumpers under live hardware fault injection.",
    "conceptInvariant": "Master Embedded Synthesis Invariant: An industrial embedded firmware platform must guarantee deterministic real-time scheduling, zero dynamic memory fragmentation, zero-jitter hardware DMA offloading, and autonomous recovery from electrical glitches and hardware faults without human intervention.",
    "failureMode": "Failing the viva defense when the senior panel injects a simulated bus lockup and priority inversion storm, and the candidate cannot explain how PendSV stack frames are restored or why their watchdog kicked during a simulated task deadlock.",
    "tryItFriction": "Deliver the live end-to-end demonstration and oral defense: demonstrate 1kHz control loops with < 2 microsecond jitter under heavy DMA traffic, trigger an intentional unaligned memory access and display the live addr2line crash forensic dump, and defend your architectural choices under intense panel cross-examination.",
    "socraticHints": [
      "What is the single most critical hallmark of a Senior Embedded Systems Architect during a catastrophic hardware failure?",
      "Methodical post-mortem instrumentation: relying on register dumps (CFSR, BFAR, stacked PC) and logic analyzers rather than guessing or inserting printfs that alter timing physics!",
      "A true embedded architect isolates whether the failure is electrical, silicon clocking, compiler optimization, or an RTOS concurrency race condition."
    ],
    "situationalPuzzle": {
      "scenario": "During your Month 1 Capstone defense, the examiner shorts the I2C bus to ground, injects a 50kHz noise wave onto the ADC analog pin, and floods the UART with 2 Megabaud garbage data simultaneously. How does NanoRTOS survive without crashing or missing a control deadline?",
      "options": [
        "The board shuts down permanently.",
        "Comprehensive Hardware & Kernel Resilience: 1) DMA circular ring buffers absorb the UART flood without CPU interrupts; 2) The I2C driver detects bus timeout and triggers the 9-clock bus-clear recovery; 3) The ADC uses hardware TRGO triggering with analog RC filtering; 4) The 1kHz control task preempts all background processing via FreeRTOS priority scheduling, maintaining < 2 microsecond jitter throughout the attack.",
        "The MCU reboots every 10 milliseconds.",
        "The examiner fails the candidate."
      ],
      "answerIdx": 1,
      "debrief": "This is the ultimate test of production-grade embedded systems. When silicon-level DMA, defensive bus drivers with timeouts, priority-based preemptive multitasking, and watchdog supervisors work in harmony, the system is invincible to external electrical and data chaos."
    },
    "quests": [
      {
        "id": "iot-m1-d30-q1",
        "name": "NanoRTOS Master Architectural Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive multi-tier firmware architectural blueprint detailing clock tree, DMA streams, task priorities, and stack memory allocations."
      },
      {
        "id": "iot-m1-d30-q2",
        "name": "Static Analysis & MISRA-C Compliance Audit",
        "type": "detective",
        "desc": "Run automated static analysis proving 100% MISRA-C:2012 compliance, zero dynamic memory usage, and zero recursive functions."
      },
      {
        "id": "iot-m1-d30-q3",
        "name": "NanoRTOS Preemptive Firmware Platform Build",
        "type": "mastery",
        "desc": "Deploy and verify the complete working embedded platform integrating clock trees, DMA streaming, FreeRTOS tasks, and crash forensics."
      },
      {
        "id": "iot-m1-d30-q4",
        "name": "Month 1 Capstone Viva Voce & Live Chaos Defense Gate",
        "type": "incident",
        "desc": "Defend the entire 30-day embedded systems architecture before the Senior Embedded Architecture Board under live physical chaos injection."
      }
    ]
  }
];

export const IOT_MONTH_2_SPECS: MasterclassDaySpec[] = [
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Bluetooth Low Energy (BLE): GAP/GATT Profiles, Services, Characteristics & Advertising Physics",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Short-Range Wireless Engineering (BLE Stack & GATT Client/Server Architecture)",
    "spokenGoal": "Master the dominant short-range IoT protocol: Bluetooth Low Energy (BLE 5.0). Understand the two core protocol layers: Generic Access Profile (GAP: Advertising, Scanning, Peripheral vs Central roles) and Generic Attribute Profile (GATT: Services, Characteristics, Descriptors, Client vs Server). Analyze 2.4GHz RF advertising physics: 3 advertising channels (37, 38, 39) that avoid Wi-Fi interference, Advertising Intervals, and Connection Intervals. Implement custom 128-bit UUID services with read, write, notify, and indicate attributes.",
    "conceptInvariant": "Connection Event Sleep Invariant: In a connected BLE peripheral, the radio must sleep between scheduled Connection Events (Connection Interval = 7.5ms to 4.0s), waking only for a microsecond burst to exchange packets; slave latency allows the peripheral to skip up to N connection events if it has no data, preserving micro-amp current draw.",
    "failureMode": "Configuring a BLE advertising interval of 20ms on a coin-cell sensor; continuous 2.4GHz radio transmission draws 12mA continuously, draining a CR2032 battery in 18 hours instead of lasting 2 years.",
    "tryItFriction": "Construct a BLE Custom Peripheral in C (ESP32 / nRF52): define a custom 128-bit UUID Sensor Service with an Environmental Data Characteristic; configure Read and Notify properties; enable Client Characteristic Configuration Descriptor (CCCD 0x2902); and push temperature notifications to a smartphone central.",
    "socraticHints": [
      "What is the difference between a BLE 'Notification' and an 'Indication'?",
      "A Notification is unacknowledged (the peripheral transmits and immediately sleeps, maximum throughput); an Indication requires an application-level ACK from the central before the next packet can be sent (slower, but guaranteed delivery)!",
      "Use Notifications for high-rate sensor streams; use Indications for critical state changes."
    ],
    "situationalPuzzle": {
      "scenario": "A medical pulse oximeter transmits heart-rate data over BLE. The app developer complains: 'When I enable notifications, I receive 20 updates per second for 5 seconds, then the connection abruptly drops with error 0x13 (Remote User Terminated Connection) or 0x08 (Connection Timeout).' Inspecting firmware shows the sensor task pushes notifications in a tight while(1) loop without delay. Why did the BLE connection terminate?",
      "options": [
        "Bluetooth only supports 1 notification per minute.",
        "GATT TX Buffer Saturation & Supervision Timeout: The firmware flooded the controller's internal BLE packet queue faster than the agreed Connection Interval could transmit them over the air. The controller ran out of packet buffers, dropped keep-alive Link Layer ACK packets, and triggered a BLE Supervision Timeout, dropping the connection!",
        "The smartphone ran out of disk space.",
        "2.4GHz radio waves melted the antenna."
      ],
      "answerIdx": 1,
      "debrief": "BLE packets are strictly bound by the agreed Connection Interval. Flooding the GATT notification buffer faster than connection events can clear them exhausts controller memory and starves Link Layer supervision keep-alives, causing connection drops."
    },
    "quests": [
      {
        "id": "iot-m2-d31-q1",
        "name": "BLE Energy Consumption & Connection Interval Math",
        "type": "concept",
        "desc": "Calculate average microamp current draw as a function of Connection Interval, Slave Latency, and radio TX peak current."
      },
      {
        "id": "iot-m2-d31-q2",
        "name": "BLE Advertising Packet & Wi-Fi Channel Coexistence Analyzer",
        "type": "detective",
        "desc": "Inspect RF spectrum analyzer traces to observe how BLE channels 37, 38, 39 fit between Wi-Fi channels 1, 6, and 11."
      },
      {
        "id": "iot-m2-d31-q3",
        "name": "Custom GATT Service & Notification Engine",
        "type": "mastery",
        "desc": "Implement a full BLE peripheral firmware in C with 128-bit UUIDs, secure pairing, CCCD notifications, and bond storage in Flash."
      },
      {
        "id": "iot-m2-d31-q4",
        "name": "3 AM SRE: Continuous BLE Drops in Hospital Patient Monitor",
        "type": "incident",
        "desc": "Diagnose and fix a buffer exhaustion bug where high-frequency ECG notifications triggered BLE link layer supervision timeouts."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Embedded Wi-Fi & TCP/IP Sockets: Station vs SoftAP, LwIP Stack & Embedded TLS Physics",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "IP Networking for Constrained Hardware (Embedded Wi-Fi, LwIP & TLS Handshakes)",
    "spokenGoal": "Connect microcontrollers directly to the Internet: master Embedded Wi-Fi and TCP/IP stacks. Understand Wi-Fi operating modes: Station Mode (connecting to home/office routers) and SoftAP (creating an independent Wi-Fi access point for mobile phone onboarding and provisioning). Explore the LwIP (Lightweight IP) stack: raw TCP/IP vs BSD socket APIs, packet buffers (pbufs), and memory pool footprints. Confront the brutal physics of Embedded TLS (Transport Layer Security via MbedTLS): RSA/ECC public key cryptography, certificate validation, and managing 32KB RAM allocations for TLS record buffers on a 64KB MCU.",
    "conceptInvariant": "Socket Non-Blocking Invariant: Embedded network socket operations (connect, read, write) must be configured non-blocking (O_NONBLOCK) with select()/poll() timeouts, preventing an unresponsive cloud gateway or Wi-Fi drop from permanently freezing the local RTOS task.",
    "failureMode": "Attempting to perform a TLS 1.3 handshake with a 4096-bit RSA certificate on a microcontroller with 32KB of free RAM; the large certificate and asymmetric math exhaust SRAM, causing MbedTLS to fail with out-of-memory error -0x7F00.",
    "tryItFriction": "Build an Embedded HTTPS Client in C using LwIP and MbedTLS: connect to Wi-Fi in Station mode, resolve cloud DNS, execute a TLS 1.3 handshake using an ECC P-256 certificate (ECDSA), send a secure HTTP POST with sensor JSON, and handle connection closure.",
    "socraticHints": [
      "Why is Elliptic Curve Cryptography (ECDSA P-256) vastly superior to RSA for microcontroller TLS handshakes?",
      "Because ECDSA keys and certificates are tiny (256 bits vs 2048/4096 bits for RSA) and require vastly less RAM and CPU calculation time!",
      "ECC certificates fit easily within scarce MCU memory budgets and complete handshakes in 80ms instead of 1,200ms."
    ],
    "situationalPuzzle": {
      "scenario": "An IoT smart thermostat connects to cloud servers over TLS using MbedTLS on an ESP32. In the lab, it connects instantly. When deployed at customer homes, connections randomly fail with 'MBEDTLS_ERR_X509_CERT_VERIFY_FAILED: Certificate validity period check failed'. The server certificate is valid until 2028. Why does the MCU reject the certificate?",
      "options": [
        "The customer router has a virus.",
        "Unsynchronized Real-Time Clock (RTC): Microcontrollers have no battery-backed RTC by default and boot with timestamp January 1, 1970 (Unix epoch 0)! When MbedTLS checks the certificate, it compares the validity start date (e.g., 2024) against 1970 and rejects it as 'Not Yet Valid'! Firmware MUST synchronize time via NTP before verifying TLS certificates.",
        "Wi-Fi does not support encryption.",
        "The ESP32 was hacked."
      ],
      "answerIdx": 1,
      "debrief": "TLS certificate verification requires an accurate local clock to verify validity dates ('Not Before' and 'Not After'). Embedded devices must execute an SNTP (Network Time Protocol) query to set system time before initiating any secure TLS connections."
    },
    "quests": [
      {
        "id": "iot-m2-d32-q1",
        "name": "LwIP PBUF Memory Architecture & TCP Window Math",
        "type": "concept",
        "desc": "Calculate RAM footprint for TCP send/receive buffers, MSS (Maximum Segment Size), and LwIP pbuf allocation pools."
      },
      {
        "id": "iot-m2-d32-q2",
        "name": "TLS 1.3 Handshake Memory Profiler (MbedTLS)",
        "type": "detective",
        "desc": "Profile dynamic heap allocation during RSA-2048 versus ECC-256 TLS handshakes using runtime heap trace hooks."
      },
      {
        "id": "iot-m2-d32-q3",
        "name": "SoftAP Wi-Fi Provisioning & HTTPS Client Engine",
        "type": "mastery",
        "desc": "Implement a complete C provisioning engine: boots in SoftAP for captive-portal credential entry, switches to Station, syncs SNTP, and connects via TLS."
      },
      {
        "id": "iot-m2-d32-q4",
        "name": "3 AM SRE: Fleet-Wide TLS Handshake Outage After New Year",
        "type": "incident",
        "desc": "Resolve a global outage where 50,000 smart plugs disconnected simultaneously due to an unhandled NTP drift rejecting cloud TLS certificates."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Sub-GHz Long Range (LoRa & LoRaWAN): Chirp Spread Spectrum, Spreading Factors & Link Budgets",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Long-Range Low-Power RF (LoRaWAN Modulation & LPWAN Topologies)",
    "spokenGoal": "Transmit sensor telemetry over 15 kilometers on milliwatts of power: master LoRa and LoRaWAN. Understand the physical layer: Chirp Spread Spectrum (CSS) modulation, sweeping frequencies continuously to achieve extraordinary receiver sensitivity (-138 dBm) capable of decoding signals 20 dB BELOW the thermal noise floor. Master Spreading Factors (SF7 to SF12), Signal Bandwidth (125kHz), and Coding Rates (4/5 to 4/8). Deconstruct the LoRaWAN MAC architecture: Class A (uplink followed by 2 receive windows), Class B (beacon-synchronized), Class C (continuous listening), and regional ISM regulatory Duty Cycle limits (1% in Europe).",
    "conceptInvariant": "Regional Duty Cycle Invariant: Sub-GHz ISM radio transmitters (868MHz / 915MHz) must strictly enforce the legal 1% duty cycle limit (maximum 36 seconds of airtime per hour); firmware must track cumulative Time-on-Air (ToA) and enforce backoff delays before transmitting.",
    "failureMode": "Transmitting a 50-byte packet every 10 seconds at SF12 (Time-on-Air = 1.48 seconds per packet); within 4 minutes, the device exhausts its hourly legal duty cycle allowance, violating telecommunications regulations and jamming the gateway.",
    "tryItFriction": "Construct a LoRaWAN Class A Node in C (SX1262 / SX1276 transceiver over SPI): calculate Time-on-Air (ToA) for a 20-byte payload, execute Over-The-Air Activation (OTAA) with JoinEUI and AppKey, establish cryptographic session keys (NwkSKey, AppSKey), and transmit telemetry with uplink counter tracking.",
    "socraticHints": [
      "What happens to range, data rate, and battery consumption as you increase the LoRa Spreading Factor from SF7 to SF12?",
      "Increasing SF doubles the chirp duration per step: receiver sensitivity improves by ~3dB per factor (doubling range), but data rate plummets and Time-on-Air increases by ~10x, consuming 10x more battery power per transmission!",
      "Adaptive Data Rate (ADR) dynamically optimizes SF based on signal strength to minimize airtime."
    ],
    "situationalPuzzle": {
      "scenario": "An agricultural soil sensor fleet uses LoRaWAN OTAA. A farmer installs 50 sensors in a field. In year 2, battery replacements occur. When all 50 sensors reboot simultaneously, none of them successfully connect to the gateway. The gateway logs show thousands of Join-Request collisions. What protocol oversight caused this join storm, and how does LoRaWAN mitigate it?",
      "options": [
        "The soil absorbed all radio waves.",
        "Join-Request Storm & Missing Random Jitter: When 50 nodes reboot simultaneously without randomized startup delays, they all transmit Join-Request frames at the exact same instant on default channels, colliding repeatedly. The LoRaWAN specification requires nodes to implement randomized exponential backoff delays between join attempts to eliminate synchronization collisions.",
        "LoRaWAN gateways only support 1 node.",
        "The AppKey expired."
      ],
      "answerIdx": 1,
      "debrief": "Join storms occur when large fleets reboot together (after power outages or battery changes). Standard LoRaWAN firmware must implement randomized initial backoffs and exponential backoff intervals between join attempts to maintain channel availability."
    },
    "quests": [
      {
        "id": "iot-m2-d33-q1",
        "name": "LoRa Time-on-Air (ToA) & Link Budget Derivation",
        "type": "concept",
        "desc": "Calculate exact airtime, symbol duration, and link budget (dB) across SF7-SF12 for 125kHz bandwidth."
      },
      {
        "id": "iot-m2-d33-q2",
        "name": "1% Regional Duty Cycle Enforcer Disassembler",
        "type": "detective",
        "desc": "Implement a Time-on-Air tracker in C and verify that non-volatile state blocks transmissions once 36 seconds/hour is reached."
      },
      {
        "id": "iot-m2-d33-q3",
        "name": "LoRaWAN Class A OTAA Stack Implementation",
        "type": "mastery",
        "desc": "Build an end-to-end LoRaWAN node in C implementing OTAA join, AES-128 MIC verification, frame counter persistence, and RX1/RX2 windows."
      },
      {
        "id": "iot-m2-d33-q4",
        "name": "3 AM SRE: Smart Agriculture Gateway Collision Storm",
        "type": "incident",
        "desc": "Resolve a regional farm telemetry blackout caused by synchronized join-request collisions after a utility power restoration."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "IEEE 802.15.4 Mesh Networks: Zigbee, Thread, Sleepy End Devices & Matter Protocol",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Mesh Networking & Smart Home Protocols (802.15.4, Thread & Matter Topologies)",
    "spokenGoal": "Architect self-healing wireless networks across hundreds of devices: master IEEE 802.15.4, Thread, and Matter. Understand 802.15.4 PHY/MAC layers: 2.4GHz Direct Sequence Spread Spectrum (DSSS), CSMA/CA channel access, and 16 channels. Compare Zigbee (application-layer silos) against Thread (pure IPv6 6LoWPAN mesh routing). Deconstruct node roles: Thread Leader, Routers (mains-powered mesh nodes forwarding packets), and Sleepy End Devices (SEDs: battery-powered sensors that sleep 99% of the time, polling parent routers for queued packets). Explore Matter: the unified application layer over Thread and Wi-Fi.",
    "conceptInvariant": "Mesh Hop Determinism Invariant: In an 802.15.4 wireless mesh, battery-powered Sleepy End Devices must never route traffic for other nodes; all multi-hop packet forwarding must be performed strictly by mains-powered Router nodes maintaining active neighbor tables.",
    "failureMode": "Configuring a battery-powered door lock as a Thread Router instead of a Sleepy End Device; the lock stays awake 100% of the time routing mesh traffic for neighboring light bulbs, draining four AA batteries in 48 hours.",
    "tryItFriction": "Implement an OpenThread Sensor Node in C: join an existing Thread mesh network, register as a Sleepy End Device with a 3-second poll period, send an IPv6 UDP sensor packet to a border router, and verify that the sleep current drops to < 10 microamps between polls.",
    "socraticHints": [
      "What is 6LoWPAN and why is it essential for running IPv6 over 802.15.4 mesh radios?",
      "Standard IPv6 requires a minimum packet MTU of 1280 bytes, but 802.15.4 physical frames have a maximum size of only 127 bytes! 6LoWPAN compresses IPv6 headers and handles packet fragmentation and reassembly at the link layer!",
      "It allows microcontrollers to communicate via standard IPv6 addresses over tiny RF packets."
    ],
    "situationalPuzzle": {
      "scenario": "A smart home building deploys 200 Thread lights and sensors. An engineer turns off 5 router lights on the 2nd floor during maintenance. Immediately, 30 temperature sensors in adjacent rooms disconnect. After 15 seconds, all 30 sensors automatically reconnect and resume reporting without manual intervention. What self-healing mechanism occurred in the mesh?",
      "options": [
        "The sensors switched to 5G cellular.",
        "Thread Mesh Self-Healing & Dynamic Route Recalculation: When parent routers went offline, the Sleepy End Devices detected lost parent ACKs and initiated parent discovery. Simultaneously, surviving surrounding Routers used Distance Vector Routing (MLE - Mesh Link Establishment) to update routing tables, re-establishing alternative parent links seamlessly.",
        "The lights turned back on by themselves.",
        "IEEE 802.15.4 does not support mesh routing."
      ],
      "answerIdx": 1,
      "debrief": "Thread is a true self-healing IPv6 mesh. Unlike star networks (Wi-Fi/BLE), if a router fails, neighboring routers re-converge routes dynamically, and child end devices attach to alternative healthy parents without service disruption."
    },
    "quests": [
      {
        "id": "iot-m2-d34-q1",
        "name": "6LoWPAN Header Compression & Fragmentation Math",
        "type": "concept",
        "desc": "Calculate byte savings achieved by IPHC header compression when mapping 40-byte IPv6 + 8-byte UDP headers into 802.15.4 frames."
      },
      {
        "id": "iot-m2-d34-q2",
        "name": "Thread Mesh Link Establishment (MLE) Trace Analyzer",
        "type": "detective",
        "desc": "Trace network packets to observe Parent Request, Parent Response, and Child ID Request sequences during node attachment."
      },
      {
        "id": "iot-m2-d34-q3",
        "name": "OpenThread Sleepy End Device (SED) Firmware",
        "type": "mastery",
        "desc": "Build an ultra-low-power Thread node in C with configurable poll periods, CoAP telemetry reporting, and non-volatile network credentials."
      },
      {
        "id": "iot-m2-d34-q4",
        "name": "3 AM SRE: Smart Building Mesh Network Routing Loop Cascade",
        "type": "incident",
        "desc": "Diagnose an office building IoT outage where a corrupted router partition induced continuous route-request flooding, exhausting network bandwidth."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone 6: Low-Power Multi-Radio Wireless Mesh Gateway Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone (Multi-Radio Wireless Systems Integration)",
    "spokenGoal": "Architect, construct, and defend Milestone 6: the Low-Power Multi-Radio Wireless Mesh Gateway Engine. Build a dual-core embedded gateway in C that bridges local short-range mesh networks (BLE 5.0 or 802.15.4 Thread) to long-range cloud uplinks (Wi-Fi or LoRaWAN). Enforce radio coexistence: manage RF antenna contention when Wi-Fi and Bluetooth share the 2.4GHz band via hardware PTA (Packet Traffic Arbitration), implement zero-copy protocol translation, and maintain an ultra-low-power sleep profile with deterministic message routing.",
    "conceptInvariant": "Radio Coexistence Invariant: When 2.4GHz Wi-Fi and Bluetooth share a single physical antenna or PCB substrate, hardware Packet Traffic Arbitration (PTA) must arbitrate transmit requests by priority (e.g., BLE connection keep-alive > Wi-Fi bulk TCP), preventing radio collisions from crashing active links.",
    "failureMode": "Transmitting a 100KB Wi-Fi TCP burst at full power (+20 dBm) without PTA while receiving a delicate BLE packet (-85 dBm); the massive Wi-Fi transmission overpowers the BLE front-end LNA, corrupting the packet and disconnecting the BLE peripheral.",
    "tryItFriction": "Compile and run Milestone 6: connect 5 BLE temperature sensors to the gateway, bridge telemetry packets into an 802.15.4 Thread mesh or Wi-Fi MQTT stream, simulate RF jamming on one channel, and prove that the gateway maintains continuous data throughput with zero lost packets.",
    "socraticHints": [
      "What is Packet Traffic Arbitration (PTA) in multi-radio embedded chips?",
      "It is a dedicated hardware signaling interface (usually 3 wires: REQUEST, PRIORITY, GRANT) that coordinates between the Wi-Fi and Bluetooth basebands before transmitting!",
      "It ensures that only one radio transmits at any given microsecond, preventing high-power transmissions from blinding nearby receivers."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 6 defense, the evaluator activates a high-power 2.4GHz microwave RF noise source. Your gateway's Wi-Fi connection drops, but the 5 BLE sensors are still actively streaming data. How does your gateway prevent sensor data loss until Wi-Fi recovers?",
      "options": [
        "Throw away all incoming sensor packets.",
        "Local Flash Ring-Buffer Spillover: The gateway detects socket disconnect; instead of blocking or discarding packets, it seamlessly routes incoming BLE telemetry into an onboard LittleFS circular flash buffer. When Wi-Fi reconnects and re-establishes TLS, a background spooler task drains the flash buffer in chronological order with zero data loss.",
        "Reboot the gateway every 5 seconds.",
        "Switch all radios to 50GHz."
      ],
      "answerIdx": 1,
      "debrief": "A production IoT gateway must never assume continuous internet connectivity. Local non-volatile store-and-forward spooling (in SPI Flash or EEPROM) ensures that telemetry collected during network outages is safely preserved and drained upon reconnection."
    },
    "quests": [
      {
        "id": "iot-m2-d35-q1",
        "name": "Multi-Radio 2.4GHz PTA Coexistence State Machine",
        "type": "concept",
        "desc": "Diagram the 3-wire hardware PTA protocol (REQUEST, PRIORITY, GRANT) and calculate collision probabilities under concurrent traffic."
      },
      {
        "id": "iot-m2-d35-q2",
        "name": "RF Front-End Intermodulation & Desensitization Profiler",
        "type": "detective",
        "desc": "Measure receiver sensitivity drop (desense in dB) when Wi-Fi transmits at +20 dBm adjacent to a BLE receiver on a shared PCB."
      },
      {
        "id": "iot-m2-d35-q3",
        "name": "Multi-Radio Wireless Mesh Gateway Build",
        "type": "mastery",
        "desc": "Build the complete dual-radio gateway firmware in C integrating BLE peripheral aggregation, local flash spooling, and Wi-Fi MQTT forwarding."
      },
      {
        "id": "iot-m2-d35-q4",
        "name": "Milestone 6 Defense: RF Jamming & Link Disruption Chaos Lab",
        "type": "incident",
        "desc": "Defend the gateway platform under live 2.4GHz RF jamming and simulated cloud network partitions before a senior evaluator panel."
      }
    ]
  },
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees & Last Will and Testament",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Telemetry Protocol Engineering (MQTT Specification & Quality of Service Guarantees)",
    "spokenGoal": "Master the lingua franca of IoT cloud telemetry: MQTT 3.1.1 and MQTT 5.0. Deconstruct the publish/subscribe architecture: broker decoupling, topic hierarchical trees (e.g., 'factories/us-east/line1/temp'), wildcards (+ and #), and variable-length integer encoding. Master Quality of Service (QoS): QoS 0 (At most once, best effort), QoS 1 (At least once, PUBACK required, duplicate risk), and QoS 2 (Exactly once, 4-step PUBREC/PUBREL/PUBCOMP handshake). Implement the Last Will and Testament (LWT) mechanism so the cloud immediately detects device disconnects when battery dies or cable cuts.",
    "conceptInvariant": "Idempotent QoS 1 Telemetry Invariant: When transmitting over lossy networks using QoS 1, firmware must treat all telemetry ingestion as idempotent; because network dropouts during PUBACK return trigger retransmissions, every payload must carry a unique sequence number or UUID to allow deduplication.",
    "failureMode": "Using MQTT QoS 2 for high-frequency (100Hz) sensor telemetry; the 4-way packet handshake per measurement saturates low-bandwidth cellular/satellite links, inflating data bills by 800% and introducing massive latency queues.",
    "tryItFriction": "Implement an Embedded MQTT Client in C: construct raw binary MQTT CONNECT packets with clean session flags and Last Will topic/message; publish sensor readings with QoS 1; process incoming PUBACK packets; and handle keep-alive PINGREQ intervals within strict timing tolerances.",
    "socraticHints": [
      "How does MQTT encode the remaining length field in packet headers?",
      "It uses a variable-length integer scheme where the lower 7 bits of each byte encode value (0-127), and bit 7 is a continuation bit indicating more bytes follow!",
      "This allows small packets to consume only 1 byte of length overhead while supporting payloads up to 268MB."
    ],
    "situationalPuzzle": {
      "scenario": "A factory has 1,000 smart vibration sensors connected via MQTT to AWS IoT Core with a 60-second Keep-Alive. A forklift cuts the main Ethernet cable to the factory switch. All 1,000 connections die physically. Yet, the cloud dashboard shows all 1,000 sensors as 'ONLINE' for the next 90 seconds. Why did the cloud take 90 seconds to discover the disconnect, and what protocol parameter governs this?",
      "options": [
        "AWS IoT Core crashed.",
        "Keep-Alive Window & 1.5x Multiplier: In the MQTT specification, a broker only declares a client disconnected if NO packets or PINGREQs are received within 1.5 times the configured Keep-Alive interval (1.5 * 60s = 90 seconds)! Only after this timer expires does the broker publish the client's Last Will and Testament (LWT) to alert the dashboard.",
        "The Ethernet cable magically reconnected.",
        "MQTT does not support disconnect detection."
      ],
      "answerIdx": 1,
      "debrief": "Disconnect detection in TCP-based protocols is governed by Keep-Alive timers. If a physical link dies without sending a TCP FIN, the server cannot know until the Keep-Alive window (typically 1.5x Keep-Alive in MQTT) expires without a PINGREQ."
    },
    "quests": [
      {
        "id": "iot-m2-d36-q1",
        "name": "MQTT Variable-Length Integer & Packet Layout Math",
        "type": "concept",
        "desc": "Calculate byte layouts and bit encodings for CONNECT, PUBLISH, PUBACK, PINGREQ, and DISCONNECT packets."
      },
      {
        "id": "iot-m2-d36-q2",
        "name": "QoS 0 vs 1 vs 2 Network Overhead & Latency Analyzer",
        "type": "detective",
        "desc": "Capture Wireshark packet traces measuring total round-trip bytes and latencies across QoS levels during simulated packet loss."
      },
      {
        "id": "iot-m2-d36-q3",
        "name": "Bare-Metal Embedded MQTT Client in C",
        "type": "mastery",
        "desc": "Build a zero-dependency C MQTT client implementing stateful reconnects, QoS 1 retransmit buffers, and Last Will and Testament."
      },
      {
        "id": "iot-m2-d36-q4",
        "name": "3 AM SRE: Telemetry Message Storm After Cloud Broker Outage",
        "type": "incident",
        "desc": "Triage a cloud broker reconnection storm where 100,000 IoT devices reconnected simultaneously with unthrottled QoS 1 queues."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages & The Observe Pattern",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Constrained IP Telemetry (CoAP RFC 7252 & UDP-Based Micro-Web Architecture)",
    "spokenGoal": "Achieve RESTful web semantics on tiny 8-bit and 32-bit devices: master the Constrained Application Protocol (CoAP, RFC 7252). Understand why TCP and HTTP are too bloated for constrained IoT devices: 3-way handshakes, large header strings, and connection state. Deconstruct CoAP: running over lightweight UDP with a tiny 4-byte fixed binary header, URI path options, and standard REST methods (GET, POST, PUT, DELETE). Master Confirmable (CON) vs Non-Confirmable (NON) messages, exponential backoff retransmission timers, Block-wise transfers for large payloads, and the Observe Pattern (RFC 7641) for reactive publish/subscribe over UDP.",
    "conceptInvariant": "Minimal Header UDP Invariant: CoAP request and response transactions must execute over stateless UDP transport with a fixed 4-byte binary header, enabling complete REST transactions to fit within a single 802.15.4 radio packet (< 127 bytes) with zero connection setup overhead.",
    "failureMode": "Transmitting a 2KB firmware block in a single standard CoAP packet over 6LoWPAN; because 802.15.4 frame limit is 127 bytes, link-layer fragmentation splits it into 18 fragments; if a single fragment is lost in noise, the entire 2KB packet is dropped without recovery.",
    "tryItFriction": "Implement a CoAP Server in C on top of UDP sockets: parse incoming binary headers, match URI-Path option '/sensors/temp', return a CON 2.05 Content response with CBOR payload, and implement the Observe option to automatically stream updates to registered client IPs when temperature changes.",
    "socraticHints": [
      "What is the CoAP Observe Pattern and how does it replace periodic HTTP GET polling?",
      "A client sends a single GET request with the Observe option flag set! The CoAP server registers the client's IP and port, and automatically streams asynchronous UDP response packets whenever the resource state updates!",
      "It provides efficient publish/subscribe semantics using standard REST URIs over UDP."
    ],
    "situationalPuzzle": {
      "scenario": "A smart streetlight network uses CoAP over UDP. A control station sends Confirmable (CON) commands: 'PUT /light?state=on'. When a remote light acknowledges with an ACK containing the matching 16-bit Message ID, the controller crashes with 'Unexpected Token'. Inspecting the packet shows the ACK has Code 0.00 (Empty ACK) followed 200ms later by a separate CON packet with Code 2.04 (Changed). What CoAP response pattern is this?",
      "options": [
        "The streetlight sent corrupted packets.",
        "Separate Response Pattern: In CoAP, if a server cannot compute or complete the requested action immediately (e.g., turning on physical high-power lamps), it immediately returns an Empty ACK (0.00) to stop the client's retransmission timer, and later sends a separate Confirmable (CON) response containing the final outcome!",
        "CoAP does not allow Empty ACKs.",
        "The streetlight lost power."
      ],
      "answerIdx": 1,
      "debrief": "CoAP elegantly supports both 'Piggybacked' responses (response data inside the ACK) and 'Separate' responses (Empty ACK followed by a separate CON message). Embedded clients must handle both models without crashing."
    },
    "quests": [
      {
        "id": "iot-m2-d37-q1",
        "name": "CoAP 4-Byte Binary Header & Option Delta Encoding Math",
        "type": "concept",
        "desc": "Deconstruct binary bit fields: Version, Type (CON/NON/ACK/RST), Code, Message ID, and Delta Option parsing algorithms."
      },
      {
        "id": "iot-m2-d37-q2",
        "name": "CoAP Block-wise Transfer (Block1/Block2) Protocol Analyzer",
        "type": "detective",
        "desc": "Inspect Wireshark traces of large file transfers broken into SZX 64-byte blocks with More-Flag (M) sequencing over lossy UDP."
      },
      {
        "id": "iot-m2-d37-q3",
        "name": "Full CoAP Server with Observe & Block-wise Transfer",
        "type": "mastery",
        "desc": "Build an embedded CoAP server in C with dynamic resource registration, Observe client subscriber lists, and Block2 slice handling."
      },
      {
        "id": "iot-m2-d37-q4",
        "name": "3 AM SRE: Streetlight Network Frozen by UDP Amplification Attack",
        "type": "incident",
        "desc": "Remediate a municipal smart lighting crisis where open CoAP UDP ports were targeted by reflection attacks, saturating gateway bandwidth."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Modbus RTU & Modbus TCP: Master-Slave Polling, Holding Registers & RS-485 Differential Transceivers",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Industrial Legacy Automation (Modbus Specification & RS-485 Hardware Buses)",
    "spokenGoal": "Interface with the industrial equipment powering global factories, power plants, and oil refineries: master Modbus RTU and Modbus TCP. Understand the physical layer: RS-485 balanced differential signaling (A and B lines) supporting up to 32 devices across 1,200 meters. Master the master-slave polling architecture: Function Codes (FC 01 Read Coils, FC 03 Read Holding Registers, FC 06 Write Single Register, FC 16 Write Multiple Registers). Analyze Modbus RTU framing: the strict 3.5-character silent interval (t3.5) demarcating message boundaries, and Modbus CRC-16 polynomial computation (0xA001). Compare it with Modbus TCP (MBAP 7-byte header over port 502).",
    "conceptInvariant": "Frame Timing Separation Invariant: In Modbus RTU, message frame boundaries are strictly defined by physical bus silence: an inter-character delay exceeding 1.5 characters (t1.5) triggers a frame error, and a silence exceeding 3.5 characters (t3.5) marks the end of the frame.",
    "failureMode": "Failing to calculate t3.5 baud-dependent timer intervals; at 9600 baud, t3.5 is 4.01ms; if software checks registers before 4ms of silence elapse, consecutive Modbus frames are merged into a single corrupted packet with invalid CRC.",
    "tryItFriction": "Construct a Modbus RTU Slave Driver in C: configure UART with an RS-485 transceiver direction pin (DE/RE), implement a hardware timer for t1.5 and t3.5 frame silence detection, parse FC 03 Read Holding Registers, compute and verify Modbus CRC-16, and respond within 20 milliseconds.",
    "socraticHints": [
      "Why does RS-485 communication require a dedicated GPIO pin (Driver Enable / Receiver Enable - DE/RE)?",
      "Because RS-485 is a half-duplex bus! To transmit, the microcontroller must assert the DE pin HIGH to turn on the transmitter, and immediately pull it LOW after the last stop bit to release the bus so other nodes can transmit!",
      "If software leaves DE high, it jams the bus and prevents slaves from responding."
    ],
    "situationalPuzzle": {
      "scenario": "An industrial solar inverter communicates with a PLC over RS-485 Modbus RTU. The inverter firmware developer toggles the RS-485 DE pin: 'GPIO_Set(DE); UART_Send(packet); GPIO_Clear(DE);'. The PLC never receives any response. Probing with an oscilloscope shows the last 2 bytes of every response frame are completely cut off! What went wrong with the DE pin clearing?",
      "options": [
        "The PLC was turned off.",
        "Premature DE Deassertion on TXE instead of TC: The software cleared the DE pin when the CPU finished writing the last byte to the UART Data Register (or when TXE asserted), while the hardware UART shift register was still physically transmitting the final bits over the wire! The RS-485 transceiver shut off mid-transmission, truncating the CRC bytes. Firmware MUST wait for the Transmission Complete (TC) flag before clearing DE!",
        "RS-485 does not support solar inverters.",
        "The CRC-16 was too long."
      ],
      "answerIdx": 1,
      "debrief": "Clearing the RS-485 Driver Enable (DE) pin too early is a notorious embedded mistake. Software must wait for the TC (Transmission Complete) hardware flag, confirming that the last stop bit has physically exited the shift register onto the cable, before pulling DE low."
    },
    "quests": [
      {
        "id": "iot-m2-d38-q1",
        "name": "Modbus RTU t1.5 / t3.5 Silent Interval Math",
        "type": "concept",
        "desc": "Calculate exact microsecond timing bounds for character timeouts and frame boundaries across standard baud rates (9600 to 115200)."
      },
      {
        "id": "iot-m2-d38-q2",
        "name": "Modbus CRC-16 Bitwise & Lookup Table Benchmark",
        "type": "detective",
        "desc": "Benchmark execution clock cycles of bit-by-bit polynomial division versus 256-entry lookup table CRC-16 computation."
      },
      {
        "id": "iot-m2-d38-q3",
        "name": "Industrial Modbus RTU Slave Driver with RS-485 Direction Control",
        "type": "mastery",
        "desc": "Implement a full Modbus RTU slave engine in C supporting FC 01, 03, 06, 16 with TC-synchronized DE pin switching."
      },
      {
        "id": "iot-m2-d38-q4",
        "name": "3 AM SRE: Chemical Plant PLC Communication Lockup",
        "type": "incident",
        "desc": "Triage a chemical reactor shutdown caused by a stuck RS-485 DE pin jamming a multi-drop Modbus bus line."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Compact Binary Serialization: Protocol Buffers (NanoPB), CBOR (RFC 8949) & MessagePack",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Data Optimization & Protocol Efficiency (Compact Binary Serialization)",
    "spokenGoal": "Stop wasting precious bandwidth and CPU cycles on bloated JSON text: master compact binary serialization formats for embedded systems. Compare JSON (human-readable, huge string parsing overhead, high memory) against binary formats: Protocol Buffers (NanoPB: strongly-typed, schema-compiled, zero-copy deserialization), Concise Binary Object Representation (CBOR, RFC 8949: binary JSON with self-describing tags), and MessagePack. Analyze byte efficiency: how an 85-byte JSON telemetry payload compresses into 14 bytes in NanoPB or 22 bytes in CBOR, slashing cellular and satellite IoT data bills by 75%.",
    "conceptInvariant": "Zero-Allocation Deserialization Invariant: Embedded serialization decoders must decode binary payloads directly in-place or into statically allocated structs without invoking dynamic memory allocations (malloc) during parsing.",
    "failureMode": "Using standard cJSON on a microcontroller to parse an incoming 2KB cloud message; cJSON allocates hundreds of tiny memory nodes for every object key and value, fragmenting the heap and crashing with an Out of Memory fault.",
    "tryItFriction": "Define a .proto schema for an IoT sensor telemetry packet; compile it using NanoPB (nanopb_generator); write C code to serialize the telemetry struct into a compact byte stream; and benchmark the binary size and CPU serialization cycles against sprintf() JSON.",
    "socraticHints": [
      "Why is Protobuf (NanoPB) significantly more compact than CBOR or MessagePack?",
      "Because Protobuf is schema-based! Field names are NOT included in the message\u2014only tiny numerical field tags (1, 2, 3) and wire types are encoded! CBOR and MessagePack are self-describing and must encode field name strings or map keys.",
      "Protobuf achieves maximum compression when both client and server share the compiled .proto schema."
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of ocean buoy tracking devices transmits GPS and wave telemetry over Iridium Satellite ($0.05 per 50 bytes). The firmware transmits JSON: '{\"lat\":37.7749,\"lon\":-122.4194,\"temp\":18.4,\"battery\":98}'. The monthly satellite bill is $45,000. An engineer refactors the firmware to NanoPB Protocol Buffers. What is the expected monthly cost reduction?",
      "options": [
        "Zero reduction because satellite pricing is fixed.",
        "75% Cost Reduction (~$11,000/month): The JSON string is 62 bytes (requiring two 50-byte billing blocks = $0.10 per transmission). The NanoPB encoded binary message fits in just 14 bytes (a single 50-byte block = $0.05 per transmission), slashing satellite transmission costs by more than half immediately while preserving full floating-point precision!",
        "The bill will increase because binary data is heavier.",
        "NanoPB does not support satellites."
      ],
      "answerIdx": 1,
      "debrief": "In bandwidth-constrained communications (cellular, satellite, LoRa), JSON is an unforgivable architectural choice. Replacing string-based JSON with schema-compiled binary protocols (NanoPB) reduces byte count by 60-80%, yielding massive financial and battery savings."
    },
    "quests": [
      {
        "id": "iot-m2-d39-q1",
        "name": "Varint & ZigZag Encoding Mechanics",
        "type": "concept",
        "desc": "Explain how Google Protocol Buffers encodes signed integers using ZigZag mapping and 7-bit varint byte sequences."
      },
      {
        "id": "iot-m2-d39-q2",
        "name": "NanoPB vs CBOR vs JSON Byte & Cycle Benchmarking",
        "type": "detective",
        "desc": "Benchmark serialized byte lengths, RAM allocation footprints, and CPU clock cycles across NanoPB, CBOR, and JSON formats."
      },
      {
        "id": "iot-m2-d39-q3",
        "name": "Static NanoPB Serialization & Deserialization Pipeline",
        "type": "mastery",
        "desc": "Build an end-to-end telemetry encoder and decoder in C utilizing NanoPB with statically bounded string and repeated fields."
      },
      {
        "id": "iot-m2-d39-q4",
        "name": "3 AM SRE: Satellite Telemetry Quota Exhaustion Panic",
        "type": "incident",
        "desc": "Rescue a maritime fleet from a multi-million-dollar satellite overage bill caused by an accidental debug switch to verbose JSON formatting."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone 7: Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone (Industrial Protocol Bridging & Cloud Integration)",
    "spokenGoal": "Architect, construct, and defend Milestone 7: the Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge. Build an industrial edge firmware in C that polls multiple legacy RS-485 Modbus RTU slave devices (energy meters, motor inverters), validates CRC-16 checksums, serializes the register data into compact NanoPB binary envelopes, and publishes telemetry to an MQTT cloud broker over TLS with QoS 1 guarantees. Implement store-and-forward flash buffering to guarantee zero data loss during cloud network outages.",
    "conceptInvariant": "Zero-Loss Protocol Bridge Invariant: An industrial telemetry bridge must isolate fieldbus polling from cloud network latency; fieldbus data must be enqueued into persistent storage without dropping samples, and cloud publish failures must never stall Modbus polling cycles.",
    "failureMode": "Failing the milestone defense when the evaluator disconnects the Wi-Fi/Ethernet cable for 5 minutes, and the firmware stops polling the RS-485 Modbus bus because the MQTT publish loop is blocked waiting for network ACK.",
    "tryItFriction": "Deploy and test Milestone 7: connect the firmware to a physical Modbus RTU slave simulator; poll 20 holding registers every 500ms; bridge to an MQTT broker; cut the network connection for 3 minutes; restore it; and verify that all queued records are flushed to the cloud in chronological order without a single missing timestamp.",
    "socraticHints": [
      "How do you decouple real-time Modbus polling from unpredictable cloud MQTT latency?",
      "By using two separate FreeRTOS tasks connected via a thread-safe Queue and Flash buffer! Task 1 exclusively polls Modbus and pushes records to the queue; Task 2 exclusively manages cloud MQTT connections and drains the queue!",
      "If the cloud goes down, Task 2 writes to Flash while Task 1 continues polling uninterrupted."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 7 evaluation, the evaluator injects severe electrical noise onto the RS-485 Modbus line, causing 30% of Modbus frames to fail CRC-16 verification. How does your bridge maintain data integrity in the cloud database?",
      "options": [
        "Send the corrupted data anyway.",
        "Defensive Checksum Rejection & Telemetry Error Flagging: The Modbus driver detects CRC-16 mismatch and drops the corrupted packet without polluting the internal data pipeline. It increments an error counter register and retries the poll. The cloud telemetry payload includes the error rate metric, alerting operators to physical wire degradation while guaranteeing zero garbage data enters the database.",
        "Crash the MCU to reset the bus.",
        "Disable CRC verification."
      ],
      "answerIdx": 1,
      "debrief": "Industrial protocol bridges must be resilient to physical fieldbus corruption. Discarding invalid CRC frames, maintaining retry budgets, and reporting physical link error rates to the cloud dashboard ensures system reliability without contaminating analytical databases."
    },
    "quests": [
      {
        "id": "iot-m2-d40-q1",
        "name": "Industrial Protocol Bridge Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive multi-threaded firmware architecture detailing Modbus polling tasks, ring buffers, and MQTT publishing pipelines."
      },
      {
        "id": "iot-m2-d40-q2",
        "name": "RS-485 Noise Fault & CRC Rejection Harness",
        "type": "detective",
        "desc": "Inject corrupted bytes into a simulated Modbus stream and verify 100% rejection by the CRC-16 verification engine."
      },
      {
        "id": "iot-m2-d40-q3",
        "name": "Modbus-to-MQTT Industrial Bridge Engine Build",
        "type": "mastery",
        "desc": "Build the complete production bridge firmware in C integrating RS-485 Modbus polling, NanoPB serialization, and TLS-encrypted MQTT publishing."
      },
      {
        "id": "iot-m2-d40-q4",
        "name": "Milestone 7 Defense: Network Partition & Noise Chaos Lab",
        "type": "incident",
        "desc": "Defend the industrial gateway before a senior panel under combined fieldbus electrical noise and prolonged cloud network partitions."
      }
    ]
  },
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Hardware Roots of Trust (RoT): Physical Unclonable Functions (PUF) & Secure Elements (ATECC608)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Hardware Security Engineering (Roots of Trust & Cryptographic Coprocessors)",
    "spokenGoal": "Protect connected devices from physical tampering and key extraction: master Hardware Roots of Trust (RoT). Understand why storing private keys in internal MCU Flash is dangerous: malicious actors can extract firmware using SWD/JTAG debuggers, glitching attacks, or decapping silicon dies. Master dedicated Secure Elements (Microchip ATECC608A / NXP SE050): hardware-isolated cryptographic coprocessors with tamper shields and side-channel defense. Explore Physical Unclonable Functions (PUF): exploiting microscopic silicon manufacturing variations in SRAM startup states to generate unique, unclonable cryptographic keys that exist only while powered on.",
    "conceptInvariant": "Hardware Key Non-Exportability Invariant: A private cryptographic key must be generated internally within a hardware Secure Element or PUF and must never be readable, exportable, or present in standard CPU RAM; all cryptographic signatures and encryptions must be performed directly inside the secure hardware boundary.",
    "failureMode": "Storing a private cloud client key as an unencrypted 'const char private_key[]' string in internal MCU Flash; an attacker connects an inexpensive SWD debugger, dumps the Flash memory, and clones the device's identity to forge fleet telemetry.",
    "tryItFriction": "Interface with an ATECC608 Secure Element over I2C in C: send the GenKey command to generate an internal Elliptic Curve P-256 private key inside Slot 0; verify that the private key cannot be read out; read the public key; and command the secure element to sign a SHA-256 message hash using hardware ECDSA.",
    "socraticHints": [
      "What is an SRAM Physical Unclonable Function (PUF)?",
      "When SRAM powers on, each physical memory cell stabilizes to either 0 or 1 based on microscopic quantum differences in transistor threshold voltages created during chip fabrication! This generates a random, unique silicon fingerprint!",
      "Key derivation algorithms turn this repeatable fingerprint into a cryptographic key that vanishes the moment power is turned off, leaving no trace in silicon memory."
    ],
    "situationalPuzzle": {
      "scenario": "A smart lock company sells 100,000 smart door locks. A hacker buys one lock, desolders the flash chip or connects a JTAG programmer, and reads the firmware. The hacker discovers the master AES encryption key hardcoded in the binary. Now, the hacker can unlock all 100,000 doors. What hardware security feature prevents this catastrophic fleet breach?",
      "options": [
        "Using a longer C variable name.",
        "Secure Element & Hardware Root of Trust: Every physical lock must have a unique private key generated inside a dedicated Secure Element (e.g., ATECC608) or burned into One-Time-Programmable (OTP) eFuses with JTAG permanently disabled (Readout Protection RDP Level 2). Compromising one physical device yields zero information about the rest of the fleet.",
        "Painting the circuit board black.",
        "C programming does not support security."
      ],
      "answerIdx": 1,
      "debrief": "Never hardcode shared secret keys in firmware binaries. Each individual physical device must generate or provision its own unique cryptographic identity inside a tamper-resistant hardware root of trust, complemented by locking JTAG/SWD debug ports (RDP Level 2) before factory deployment."
    },
    "quests": [
      {
        "id": "iot-m2-d41-q1",
        "name": "SRAM PUF Entropy & Silicon Manufacturing Variation Math",
        "type": "concept",
        "desc": "Calculate intra-device and inter-device Hamming distance distributions of SRAM power-up state vectors for key generation."
      },
      {
        "id": "iot-m2-d41-q2",
        "name": "Microcontroller Flash Extraction & JTAG RDP Level Bypass Audit",
        "type": "detective",
        "desc": "Demonstrate using OpenOCD how unsecured microcontrollers yield entire Flash images, and verify RDP Level 2 debug lockouts."
      },
      {
        "id": "iot-m2-d41-q3",
        "name": "ATECC608 Hardware ECDSA Signature Engine",
        "type": "mastery",
        "desc": "Implement a full driver in C communicating with a Secure Element over I2C to execute hardware-isolated ECDSA P-256 signing."
      },
      {
        "id": "iot-m2-d41-q4",
        "name": "3 AM SRE: Fleet Identity Cloning Breach in Smart Grid Meters",
        "type": "incident",
        "desc": "Triage a major utility company crisis where extracted firmware keys allowed attackers to spoof electricity consumption data across 10,000 meters."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Embedded Cryptography: AES-128/256-GCM, SHA-256 & Curve25519 Math on Cortex-M",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Cryptographic Engineering (Symmetric & Asymmetric Math for Constrained MCUs)",
    "spokenGoal": "Implement mathematical cryptography efficiently on constrained silicon: master Embedded Cryptography. Compare symmetric encryption (AES-128 and AES-256 in Galois/Counter Mode - GCM for authenticated encryption) with cryptographic hashing (SHA-256) and modern asymmetric key exchange (Curve25519 / X25519). Understand hardware acceleration: how dedicated on-chip crypto engines (STM32 CRYP peripheral) accelerate AES from 1,200 CPU cycles down to 14 clock cycles per block. Master side-channel attack countermeasures: constant-time programming to prevent timing attacks.",
    "conceptInvariant": "Constant-Time Comparison Invariant: All cryptographic comparisons (verifying HMACs, AES-GCM authentication tags, signature hashes) must execute in strictly constant time (e.g., mbedtls_ct_memcmp), completely independent of where the first byte mismatch occurs, to prevent timing side-channel attacks.",
    "failureMode": "Verifying an incoming firmware HMAC signature using standard C 'memcmp()'; because memcmp() returns early on the very first mismatched byte, an attacker measures nanosecond timing differences over 10,000 requests to forge a valid signature byte by byte.",
    "tryItFriction": "Implement AES-128-GCM Authenticated Encryption in C: configure a 12-byte initialization vector (IV/nonce), encrypt a 128-byte sensor payload with associated authenticated data (AAD), generate a 16-byte authentication tag, and verify that corrupting a single bit of either the payload or AAD causes tag verification to fail.",
    "socraticHints": [
      "Why must an Initialization Vector (IV / Nonce) NEVER be reused with the same key in AES-GCM mode?",
      "Because reusing a nonce in Galois/Counter Mode completely destroys authenticity: it allows an attacker to mathematically recover the authentication hash key (H), decrypt all ciphertexts, and forge arbitrary valid messages!",
      "Nonce means 'number used once'\u2014it must be strictly unique for every encryption."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware security researcher tests an IoT gateway's password verification function: 'int check_key(uint8_t *a, uint8_t *b) { return memcmp(a, b, 32) == 0; }'. The researcher sends random 32-byte keys and measures the response time with a 100MHz timer. When the first byte is correct, response time increases by 42 nanoseconds. What vulnerability exists, and how is it patched?",
      "options": [
        "The processor is running out of memory.",
        "Timing Side-Channel Attack & Early-Exit Leakage: Standard memcmp() exits immediately upon the first non-matching byte, leaking information about which byte position failed. The fix is a constant-time comparison function that XORs all 32 bytes unconditionally across a fixed loop and tests if the accumulated OR sum is zero.",
        "AES-GCM is broken.",
        "The researcher used the wrong baud rate."
      ],
      "answerIdx": 1,
      "debrief": "Timing attacks exploit execution time variations. In cryptography, comparing hashes or keys must ALWAYS take the exact same number of clock cycles regardless of whether 0 bytes match or all 32 bytes match."
    },
    "quests": [
      {
        "id": "iot-m2-d42-q1",
        "name": "Galois/Counter Mode (GCM) GHASH Polynomial Formulation",
        "type": "concept",
        "desc": "Explain Galois Field GF(2^128) arithmetic, CTR mode stream encryption, and GHASH authentication tag computation."
      },
      {
        "id": "iot-m2-d42-q2",
        "name": "Timing Side-Channel Leakage Oscilloscope Harness",
        "type": "detective",
        "desc": "Measure execution clock cycle variance between standard memcmp() and constant-time memory comparison functions."
      },
      {
        "id": "iot-m2-d42-q3",
        "name": "Hardware-Accelerated AES-256-GCM Crypto Driver",
        "type": "mastery",
        "desc": "Implement an authenticated encryption driver in C utilizing on-chip crypto hardware engines with non-reuse nonce guards."
      },
      {
        "id": "iot-m2-d42-q4",
        "name": "3 AM SRE: Remote Key Forgery Attack on Connected Medical Infusion Pump",
        "type": "incident",
        "desc": "Patch a life-critical medical device firmware vulnerability where early-exit HMAC verification allowed timing-based signature forgery."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Secure Boot Architecture: Multi-Stage Bootloaders, ECDSA Signatures & Anti-Rollback eFuses",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Silicon Trust Chain Engineering (Secure Boot & Cryptographic Chain of Trust)",
    "spokenGoal": "Ensure that the microcontroller executes only authentic, untampered code signed by your organization: master Secure Boot Architecture. Understand the Chain of Trust: Stage 0 (immutable silicon Boot ROM burned in silicon), Stage 1 (First Stage Bootloader BL1), and Stage 2 (Main Application Firmware). Deconstruct cryptographic signature verification: hashing the entire application Flash binary with SHA-256, verifying the digital signature using an ECDSA P-256 public key anchored in Root-of-Trust eFuses. Master Anti-Rollback protection: using hardware monotonic counters (eFuses) to prevent attackers from flashing older, vulnerable firmware versions.",
    "conceptInvariant": "Unbroken Chain of Trust Invariant: Every execution stage in the boot hierarchy must cryptographically authenticate the digital signature and version number of the subsequent stage before jumping to its entry point; if verification fails, the processor must halt and enter a secure fallback state.",
    "failureMode": "Implementing signature verification in the bootloader but omitting anti-rollback version checks; an attacker flashes an authenticated version 1.0 firmware from two years ago that contains a known buffer overflow exploit, taking full control of the device.",
    "tryItFriction": "Construct a Minimalist Secure Bootloader in C: read the application header at Flash address 0x08010000; verify magic numbers and image length; hash the binary with SHA-256; verify the ECDSA signature against a hardcoded public key; verify that the image version >= the monotonic anti-rollback counter; and execute the jump to the application Reset_Handler.",
    "socraticHints": [
      "Why must the Secure Boot public key be burned into silicon One-Time-Programmable (OTP) eFuses rather than ordinary Flash?",
      "Because if the public key is stored in writable Flash, an attacker can overwrite your public key with their OWN public key, sign malicious firmware with their private key, and pass verification cleanly!",
      "eFuses are physical microscopic silicon fuses that blow permanently, creating immutable, write-protected hardware keys."
    ],
    "situationalPuzzle": {
      "scenario": "A secure bootloader verifies an application binary: 'if (verify_ecdsa(image) == SUCCESS) jump_to_app(image);'. An attacker connects an oscilloscope and a pulse generator to the MCU's power supply pin (VDD). At the exact microsecond the CPU executes the 'CMP r0, #0' instruction after signature verification, the attacker injects a 50-nanosecond voltage drop (brownout glitch). What happens?",
      "options": [
        "The microcontroller is permanently destroyed.",
        "Voltage Glitching Fault Injection: The brief voltage drop prevents the CPU logic gates from switching cleanly. The 'CMP' or conditional branch 'BNE' instruction is misread as a NOP (No Operation). The CPU skips the branch and falls through into 'jump_to_app()', executing completely unsigned, malicious code! Defense requires redundant verification checks and random execution delays.",
        "The signature verifies automatically.",
        "ARM Cortex-M detects voltage drops and reboots."
      ],
      "answerIdx": 1,
      "debrief": "Voltage glitching is a real-world hardware attack. To defend against glitching in secure bootloaders, firmware must implement redundant checks (e.g., verifying the signature twice at different points, using double-variables, and adding randomized delays) to defeat single-instruction fault injection."
    },
    "quests": [
      {
        "id": "iot-m2-d43-q1",
        "name": "Chain of Trust Mathematical Verification Model",
        "type": "concept",
        "desc": "Map cryptographic handoffs from Silicon ROM -> BL1 -> BL2 -> App, detailing signature algorithms and hash anchors."
      },
      {
        "id": "iot-m2-d43-q2",
        "name": "Voltage Glitching Fault Injection Resistance Audit",
        "type": "detective",
        "desc": "Analyze compiled assembly of bootloader verification branches to identify single-point-of-failure branch instructions."
      },
      {
        "id": "iot-m2-d43-q3",
        "name": "Secure Bootloader with ECDSA & Anti-Rollback eFuses",
        "type": "mastery",
        "desc": "Implement a full first-stage bootloader in C with SHA-256 hashing, ECDSA P-256 verification, and hardware eFuse version checks."
      },
      {
        "id": "iot-m2-d43-q4",
        "name": "3 AM SRE: Factory Malware Injection Bypasses Unlocked Bootloader",
        "type": "incident",
        "desc": "Remediate a critical supply-chain breach where counterfeit firmware was flashed onto factory units due to unblown secure boot eFuses."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Flash Memory Architecture: Wear Leveling, LittleFS / SPIFFS & Power-Loss Recovery",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Storage Systems Engineering (NOR Flash Physics & Fault-Tolerant Filesystems)",
    "spokenGoal": "Store data persistently on silicon without destroying Flash chips: master Flash Memory Management and Fault-Tolerant Filesystems. Understand NOR Flash physical physics: bits can be written from 1 to 0 individually, but can ONLY be erased from 0 to 1 in entire sectors (e.g., 4KB blocks). Confront Flash endurance: individual sectors endure only ~100,000 erase cycles before physical oxide breakdown renders them dead! Master Wear Leveling (dynamic vs static) to distribute write cycles uniformly across the entire chip. Deconstruct LittleFS: a power-loss resilient embedded filesystem designed specifically for microcontrollers with bounded RAM budgets.",
    "conceptInvariant": "Power-Cut Resilient Storage Invariant: An embedded filesystem must guarantee that a sudden power loss (pulling the battery or unplugging power) at any microsecond during a write or erase operation will never result in filesystem corruption or loss of existing committed files upon reboot.",
    "failureMode": "Writing sensor data continuously to the same physical Flash sector (address 0x08040000) once per second; after 28 hours (100,000 erases), the Flash sector silicon burns out, permanently corrupting persistent storage and bricking the device.",
    "tryItFriction": "Integrate LittleFS in C on an external SPI Flash chip: configure read, prog, erase, and sync function pointers; format the filesystem; create a file; write telemetry records; simulate sudden power-cuts mid-write; and verify that LittleFS recovers cleanly on reboot without data loss or broken pointers.",
    "socraticHints": [
      "Why is standard FAT32 a catastrophic choice for microcontrollers with raw Flash memory?",
      "FAT32 was designed for magnetic spinning hard drives: it frequently overwrites the same File Allocation Table sector (destroying Flash quickly) and is NOT power-cut resilient (a sudden power loss during a FAT table write corrupts the entire drive)!",
      "LittleFS uses copy-on-write logging, dynamic wear-leveling, and atomic metadata pointers designed specifically for Flash."
    ],
    "situationalPuzzle": {
      "scenario": "A smart electric meter logs hourly energy consumption into internal Flash memory. The firmware engineer writes a custom log function that erases sector 7 and writes a new 64-byte record every hour. After 11 years of continuous operation, the meter fails to save records. An EEPROM inspection shows sector 7 bits are stuck at 0. Why did sector 7 fail?",
      "options": [
        "The microcontroller ran out of RAM.",
        "Flash Oxide Breakdown / Wear Out: The developer wrote repeatedly to a single fixed sector without wear leveling! Although hourly writes (8,760 erases/year) should last ~11 years at 100,000 cycle limits, temperature variations accelerated silicon oxide breakdown. A wear-leveling filesystem (LittleFS) would have distributed writes across 100 sectors, extending life to over 1,000 years!",
        "Flash memory cannot be written more than 10 times.",
        "Solar flares erased the sector."
      ],
      "answerIdx": 1,
      "debrief": "Raw Flash memory has physical endurance limits (~10k to 100k erases per sector). Wear-leveling algorithms dynamically remap logical sectors to different physical sectors, ensuring the entire silicon substrate wears down uniformly and maximizing device longevity."
    },
    "quests": [
      {
        "id": "iot-m2-d44-q1",
        "name": "NOR Flash Sector Erase Physics & Wear-Leveling Lifespan Math",
        "type": "concept",
        "desc": "Calculate theoretical device lifespan in years across write frequencies, sector size, total chip capacity, and wear-leveling efficiency."
      },
      {
        "id": "iot-m2-d44-q2",
        "name": "Power-Cut Simulation & Filesystem Recovery Harness",
        "type": "detective",
        "desc": "Execute an automated chaos test cutting power at random microsecond intervals during LittleFS transactions, verifying zero corruption."
      },
      {
        "id": "iot-m2-d44-q3",
        "name": "LittleFS SPI Flash Driver & Telemetry Store",
        "type": "mastery",
        "desc": "Implement a complete persistent storage subsystem in C integrating SPI Flash hardware drivers, LittleFS wear leveling, and atomic logging."
      },
      {
        "id": "iot-m2-d44-q4",
        "name": "3 AM SRE: Fleet Filesystem Corruption Following Substation Blackout",
        "type": "incident",
        "desc": "Recover corrupted utility data and patch firmware across 5,000 smart meters that bricked during an abrupt grid power outage."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone 8: Cryptographic Secure Bootloader & Authenticated Firmware Verifier Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone (Hardware Security & Cryptographic Bootloaders)",
    "spokenGoal": "Architect, construct, and defend Milestone 8: the Cryptographic Secure Bootloader & Authenticated Firmware Verifier Engine. Build a production-grade, two-stage secure bootloader in C for ARM Cortex-M. Enforce SHA-256 binary hashing, verify digital signatures using ECDSA P-256 against an immutable public key, validate anti-rollback monotonic counters to prevent downgrade attacks, protect memory against voltage glitching using redundant verification checks, and execute safe execution jumps to authenticated application code.",
    "conceptInvariant": "Zero-Compromise Boot Invariant: Under no circumstance shall the bootloader branch to an application image whose cryptographic signature does not verify cleanly against the immutable Root-of-Trust public key and whose version is lower than the hardware anti-rollback counter.",
    "failureMode": "Failing the milestone defense when the evaluator injects a modified binary with 1 single byte changed in the application code, and the bootloader executes the corrupted code instead of halting safely in recovery mode.",
    "tryItFriction": "Build and verify Milestone 8: flash a signed application binary and prove boot succeeds; modify 1 byte of the application image using a hex editor and prove the bootloader detects signature failure, halts execution, and enters an authenticated recovery mode.",
    "socraticHints": [
      "How do you safely jump from a bootloader to a new application in ARM Cortex-M C code?",
      "1) Disable all interrupts (__disable_irq()); 2) Relocate vector table (SCB->VTOR = app_address); 3) Load Main Stack Pointer from app_address[0] (__set_MSP); 4) Branch to function pointer at app_address[1] (Reset_Handler)!",
      "Failing to disable interrupts or reset the MSP causes the application to inherit dirty bootloader stack states and crash on the first interrupt."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 8 defense, the evaluator presents your bootloader with two signed firmware images: Image A (v2.1, fully signed by your company key) and Image B (v1.0, also fully signed by your company key). Your system is currently running v2.0. The evaluator attempts to flash Image B. How does your bootloader respond?",
      "options": [
        "Boot Image B because the signature is valid.",
        "Anti-Rollback Rejection: Although Image B has a valid signature, its version (v1.0) is lower than the monotonic anti-rollback counter (v2.0) burned into hardware eFuses! The bootloader rejects Image B immediately to prevent a downgrade attack where an attacker attempts to reinstall an older, exploitable firmware version.",
        "Crash the CPU.",
        "Ask the user for a password."
      ],
      "answerIdx": 1,
      "debrief": "Cryptographic signatures alone do not prevent downgrade attacks. An attacker can legally acquire an older valid signed image that contains a known vulnerability. Hardware anti-rollback counters (eFuses) guarantee that the security waterline can only move forward, never backward."
    },
    "quests": [
      {
        "id": "iot-m2-d45-q1",
        "name": "Secure Bootloader Memory Partitioning Blueprint",
        "type": "concept",
        "desc": "Produce the formal flash partition map detailing Bootloader (32KB), App Slot 0 (240KB), App Slot 1 (240KB), and Storage (512KB)."
      },
      {
        "id": "iot-m2-d45-q2",
        "name": "Signature Tampering & Glitch Vulnerability Audit",
        "type": "detective",
        "desc": "Subject the bootloader to bit-flip fuzzing and simulated branch skipping to verify that signature validation cannot be bypassed."
      },
      {
        "id": "iot-m2-d45-q3",
        "name": "Cryptographic Secure Bootloader Engine Build",
        "type": "mastery",
        "desc": "Build the complete production secure bootloader in C with SHA-256, ECDSA P-256 verification, anti-rollback checks, and safe VTOR jumping."
      },
      {
        "id": "iot-m2-d45-q4",
        "name": "Milestone 8 Defense: Firmware Tampering & Downgrade Attack Lab",
        "type": "incident",
        "desc": "Defend the secure bootloader before a senior panel under live binary byte modifications and malicious downgrade attacks."
      }
    ]
  },
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "Firmware-Over-The-Air (FOTA) Topologies: Dual-Bank Flash, Slot Swapping & Partition Maps",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Remote Lifecycle Engineering (FOTA Topologies & Dual-Bank Flash Partitioning)",
    "spokenGoal": "Update connected devices deployed across the globe without bricking a single unit: master Firmware-Over-The-Air (FOTA). Compare single-bank architectures (high risk, if power fails mid-write the device is dead forever) against Dual-Bank Flash partitioning (Slot 0 = currently running active image, Slot 1 = candidate download staging area). Analyze MCU Dual-Bank Flash hardware remapping: how swapping bank address pointers in hardware enables instant zero-downtime firmware switching without physically copying hundreds of kilobytes of memory.",
    "conceptInvariant": "Zero-Brick Dual-Bank Invariant: At no point during an over-the-air firmware download or installation shall the active, verified running firmware image be overwritten; the new candidate image must be written exclusively to a secondary bank or staging slot, and verified cryptographically before execution handoff.",
    "failureMode": "Streaming an over-the-air firmware update directly into the active application Flash sector; when the battery dies at 64% completion, the bootloader attempts to execute half-erased Flash, permanently bricking the device in the field.",
    "tryItFriction": "Construct a Dual-Slot Flash Partition Map in C: divide 1MB internal Flash into Bootloader (64KB), Slot 0 Active (448KB), Slot 1 Staging (448KB), and Scratch/Metadata (64KB); implement an image downloader that writes packets to Slot 1, verifies the SHA-256 trailer, and sets a bootloader flag requesting a trial reboot.",
    "socraticHints": [
      "Why is Dual-Bank Flash hardware mapping vastly superior to software sector copying (scratch swapping)?",
      "Because Dual-Bank hardware remapping swaps physical Flash bank memory addresses (Bank 1 <-> Bank 2) in a single hardware register write (e.g., FLASH_OPTCR_nDBANK) without moving a single byte of data!",
      "It makes the firmware swap instantaneous (< 1 microsecond) and 100% atomic against power cuts."
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of smart solar inverters updates firmware over cellular networks. A new firmware image (v3.2) is downloaded into Flash Slot 1. The bootloader boots v3.2. However, v3.2 contains a fatal software bug: an unhandled null pointer dereference crashes the system 2 seconds after boot. What self-reverting mechanism must the bootloader implement?",
      "options": [
        "Permanently shut down the solar inverter.",
        "Trial Boot State Machine & Self-Testing Confirmation: When booting a new image from Slot 1, the bootloader marks the image as 'TRIAL' and arms a hardware watchdog. The new firmware MUST complete hardware self-tests, connect to the network, and explicitly write 'CONFIRMED' to the metadata slot within 30 seconds. If the firmware crashes or watchdogs before confirming, the bootloader detects failure and automatically rolls back to the known-good Slot 0 firmware!",
        "Wait for a technician to visit all 50,000 inverters.",
        "Solar panels do not support firmware updates."
      ],
      "answerIdx": 1,
      "debrief": "The trial boot state machine (pioneered by MCUboot and Android A/B updates) is the cornerstone of zero-brick engineering. A newly installed image is considered unconfirmed until it successfully passes self-tests and writes a confirmation flag; any crash before confirmation triggers an automatic hardware rollback to the previous golden image."
    },
    "quests": [
      {
        "id": "iot-m2-d46-q1",
        "name": "Dual-Bank Flash Memory Map & Re-Mapping Physics",
        "type": "concept",
        "desc": "Calculate memory boundary addresses, sector sizes, and hardware bank swap register configurations on Cortex-M."
      },
      {
        "id": "iot-m2-d46-q2",
        "name": "Trial Boot State Machine Verification Harness",
        "type": "detective",
        "desc": "Simulate unconfirmed application crashes and trace bootloader metadata transitions from TRIAL -> REVERTED -> SLOT_0."
      },
      {
        "id": "iot-m2-d46-q3",
        "name": "Dual-Bank FOTA Downloader & Flash Writer",
        "type": "mastery",
        "desc": "Implement a chunked HTTP/MQTT firmware downloader in C streaming bytes into Flash Slot 1 with CRC verification."
      },
      {
        "id": "iot-m2-d46-q4",
        "name": "3 AM SRE: Power-Cut During Firmware Write Bricks 500 EV Chargers",
        "type": "incident",
        "desc": "Recover a bricked EV charging network caused by a single-bank bootloader overwriting active code during a utility blackout."
      }
    ]
  },
  {
    "day": 47,
    "month": 2,
    "blockNum": 10,
    "title": "Delta Updates & Binary Differential Compression: BSDiff, Courgette & Satellite Bandwidth Savings",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Bandwidth Optimization & Binary Differencing (Delta FOTA Algorithms)",
    "spokenGoal": "Slash over-the-air data transfer size by up to 95%: master Delta Updates and Binary Differential Compression. Understand why standard file compression (gzip) fails on compiled binaries: a 1-line code change shifts thousands of branch and function addresses, causing massive byte-level divergence. Master binary diffing algorithms: BSDiff (suffix sorting and byte difference arrays) and Google Courgette (disassembling machine code to replace absolute addresses with labels before diffing). Implement embedded delta patching in C to reconstruct a full 512KB firmware image from a tiny 18KB differential patch directly in Flash.",
    "conceptInvariant": "In-Place Reconstruction Invariant: An embedded delta patcher must apply binary diffs streamingly using bounded scratch memory (SRAM < 8KB), reconstructing the complete candidate image without requiring the entire new image to be buffered in volatile RAM.",
    "failureMode": "Transmitting full 1MB firmware binaries over expensive satellite links ($5/MB) to 2,000 container ships for a minor 1-line bug fix, incurring a $10,000 data transfer bill instead of a $200 delta update.",
    "tryItFriction": "Implement an Embedded BSDiff Decompressor in C: take an existing firmware binary in Flash Slot 0, stream an 8KB delta patch over UART, apply the control, diff, and extra blocks sequentially, write the reconstructed new firmware to Flash Slot 1, and verify that the SHA-256 hash matches the target build exactly.",
    "socraticHints": [
      "Why does a minor 1-line code addition in C cause thousands of bytes to change in the compiled binary?",
      "Because inserting 4 bytes of machine code shifts the memory addresses of ALL subsequent functions and data tables! Every branch instruction (BL), pointer, and jump table across the entire binary must be recalculated to point to new addresses!",
      "Binary diffing algorithms like Courgette detect address shifts and normalize them into relative offsets before calculating diffs."
    ],
    "situationalPuzzle": {
      "scenario": "A remote sensor receives a 12KB delta update patch over cellular. During delta reconstruction in C, the MCU crashes with a HardFault at 80% progress. Debugging shows the patcher attempted to read from Flash Slot 0 while simultaneously writing to Flash Slot 0! What fundamental partitioning invariant did the patcher violate?",
      "options": [
        "The cellular tower was offline.",
        "In-Place Self-Destruction / Overwrite Collision: The developer attempted to apply the delta patch directly over the original firmware in Slot 0! As soon as the patcher overwrote an early block of Slot 0, subsequent delta instructions that referenced original bytes in that block read corrupted newly-written bytes, causing reconstruction failure and destroying the original firmware!",
        "Delta updates only work on Linux.",
        "The Flash memory ran out of battery."
      ],
      "answerIdx": 1,
      "debrief": "Delta patching requires reading the baseline original firmware (Slot 0) while writing the reconstructed candidate image to a SEPARATE target location (Slot 1 or external Flash). Overwriting the baseline image in-place destroys reference data needed for subsequent diff blocks."
    },
    "quests": [
      {
        "id": "iot-m2-d47-q1",
        "name": "BSDiff Differential Encoding Block Mathematical Mechanics",
        "type": "concept",
        "desc": "Explain suffix array sorting, diff block byte differences, extra block literals, and control block length tuples."
      },
      {
        "id": "iot-m2-d47-q2",
        "name": "Binary Diff Efficiency & Relocation Shift Profiler",
        "type": "detective",
        "desc": "Compare patch sizes generated by gzip, BSDiff, and Courgette for a 500KB firmware binary with a 1-line bug fix."
      },
      {
        "id": "iot-m2-d47-q3",
        "name": "Embedded Stream-Based Delta Patch Reconstructor",
        "type": "mastery",
        "desc": "Implement a C delta patch decompressor applying BSDiff streams into Flash Slot 1 with bounded 4KB RAM buffer limits."
      },
      {
        "id": "iot-m2-d47-q4",
        "name": "3 AM SRE: Satellite Telemetry Delta Patch Reconstruction Crash",
        "type": "incident",
        "desc": "Triage a fleet of maritime container tracking buoys failing delta reconstruction due to mismatched baseline Flash versions."
      }
    ]
  },
  {
    "day": 48,
    "month": 2,
    "blockNum": 10,
    "title": "Resilient Recovery & Watchdog Rollbacks: Self-Testing Firmware & Golden Image Safety",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Autonomous Resilience & Safety (Self-Testing Firmware & Golden Boot Recovery)",
    "spokenGoal": "Guarantee that an updated device never remains trapped in a crash loop: master Resilient Recovery and Golden Image Safety. Design the complete Self-Testing Verification Harness: upon booting an unconfirmed candidate firmware, the application must autonomously verify hardware peripherals (I2C sensors responding, flash filesystems mounting, radio communication operational) and transmit a 'Canary Heartbeat' to the cloud before writing the permanent confirmation bit. Architect the immutable Golden Image fallback in protected ROM/Flash sectors as the ultimate defense against catastrophic fleet bricking.",
    "conceptInvariant": "Autonomous Golden Recovery Invariant: If both Slot 0 and Slot 1 firmware images fail validation or crash repeatedly, the bootloader must fall back to an immutable, write-protected factory 'Golden Image' burned into read-only Flash, restoring factory communications and preventing field bricking.",
    "failureMode": "A new firmware image passes bootloader signature verification, boots successfully, but immediately crashes due to an unhandled sensor initialization error; because the bootloader considers the boot successful, the device reboots in an infinite crash loop forever.",
    "tryItFriction": "Construct a Self-Testing Canary Harness in C: create a verification suite that tests SPI Flash, reads the internal temperature sensor, and validates the network stack within 10 seconds of boot; if any test fails, write 'BOOT_FAILED' and trigger a software reset back to the known-good slot.",
    "socraticHints": [
      "Why is signature verification ALONE insufficient to guarantee that a new firmware image is safe to run?",
      "Because a firmware binary can be 100% cryptographically authentic and signed, but still contain a catastrophic software bug, memory leak, or hardware incompatibility that crashes the system seconds after boot!",
      "Cryptographic verification ensures authenticity; runtime self-testing ensures operational functionality."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware update is deployed to 10,000 smart building thermostats. The new firmware boots, but an incorrect GPIO configuration pin turns on the heating element permanently. The device does NOT crash, so the watchdog never resets it, and it writes 'CONFIRMED' to the bootloader. Room temperatures spike to dangerous levels. How does a comprehensive Self-Testing harness prevent this safety breach?",
      "options": [
        "Turn off the building power.",
        "Multi-Tier Hardware Boundary Assertions Before Confirmation: The self-test harness must not confirm an image simply because the CPU didn't crash! It must explicitly read thermal sensors, verify that heating contactors open and close within bounded limits, and confirm that bidirectional control communication is established before marking the firmware permanent.",
        "Ban thermostats from having firmware.",
        "The heating element will burn out safely."
      ],
      "answerIdx": 1,
      "debrief": "Self-testing must validate the physical actuation and sensor feedback loops of the actual hardware domain, not just software execution. Verifying that sensors respond and actuators remain in safe states before writing confirmation is the hallmark of professional safety firmware."
    },
    "quests": [
      {
        "id": "iot-m2-d48-q1",
        "name": "Multi-Stage Self-Testing Verification State Machine",
        "type": "concept",
        "desc": "Formally specify hardware self-test stages: Peripherals -> Storage -> Radio Link -> Sensor Sanity -> Confirmation."
      },
      {
        "id": "iot-m2-d48-q2",
        "name": "Crash Loop Counter & Boot Limit Inspector",
        "type": "detective",
        "desc": "Implement a boot attempt counter in non-volatile registers (e.g., RTC backup registers) triggering rollback if count > 3."
      },
      {
        "id": "iot-m2-d48-q3",
        "name": "Self-Testing Canary Firmware Suite",
        "type": "mastery",
        "desc": "Build an automated C hardware diagnostic test runner that validates system health within 10 seconds and rolls back on failure."
      },
      {
        "id": "iot-m2-d48-q4",
        "name": "3 AM SRE: Thermostat Infinite Bootloop Leaves 10,000 Homes in the Cold",
        "type": "incident",
        "desc": "Resolve a nationwide consumer emergency where a buggy Wi-Fi driver caused a bootloop, executing an automated golden rollback."
      }
    ]
  },
  {
    "day": 49,
    "month": 2,
    "blockNum": 10,
    "title": "Large-Scale Fleet Management: Canary Deployments, Telemetry Reports & Dead Device Recovery",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Fleet Lifecycle Operations (Canary Rollouts & Cloud-to-Edge Fleet Management)",
    "spokenGoal": "Deploy firmware updates to 1,000,000 devices safely: master Large-Scale Fleet Management. Never update an entire fleet at once! Implement Staged Canary Deployments: deploy to 1% of devices (Canary fleet), monitor telemetry health metrics (crash rates, battery drain, network retries) for 48 hours; expand to 10% (Early Adopters); and roll out to 100% only when the canary cohort maintains 99.99% reliability. Architect Dead Device Recovery Protocols: using cellular SMS wakeups or out-of-band BLE rescue beacons to recover devices stranded by degraded connectivity.",
    "conceptInvariant": "Canary Cohort Stability Invariant: A global firmware update must never progress from a canary tier to general availability unless the canary fleet achieves a statistically proven crash-free session rate of >= 99.9% over a minimum 48-hour soak period.",
    "failureMode": "Pushing a firmware update to all 500,000 smart meters simultaneously; an unexpected cellular tower timeout triggers a network retry loop, creating a 500,000-device cellular denial-of-service storm that crashes the national mobile network.",
    "tryItFriction": "Construct a Fleet Telemetry Health Reporter in C: calculate rolling metrics (Free Heap, Battery Voltage Slew Rate, Flash Write Cycles, Watchdog Resets, Network Reconnects); package into a compact NanoPB health report; and publish to the cloud every 6 hours.",
    "socraticHints": [
      "What is the single most dangerous consequence of deploying a firmware update to 100% of an IoT fleet simultaneously?",
      "Massive synchronized reconnection storms and the inability to stop a fatal bug before it affects the entire customer base!",
      "If a bug bricks the device, 100% of the fleet is permanently dead simultaneously with zero recovery options."
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of 20,000 cellular water meters receives a firmware update. The cloud team pushes the update to 1% (200 devices). Within 6 hours, the cloud dashboard shows: 1) Crash rate is 0%; 2) Water readings are accurate; BUT 3) Battery voltage drop in the canary devices is 4x higher than the baseline fleet! What insidious defect did the canary deployment uncover?",
      "options": [
        "The batteries were defective.",
        "Radio Sleep Mode Failure / Wake-Lock Bug: The new firmware introduced an unhandled background timer that kept the cellular modem in active RRC_CONNECTED state instead of dropping into eDRX / PSM (Power Saving Mode) deep sleep! The canary rollout successfully caught the battery drain defect before it destroyed the 10-year lifespan of 20,000 meters!",
        "Canary deployments do not track battery.",
        "Water meters do not use electricity."
      ],
      "answerIdx": 1,
      "debrief": "Canary monitoring is not just about crashes\u2014it is about battery, memory, and network telemetry. Detecting an anomalous battery drain or memory climb on a 1% canary cohort prevents catastrophic multi-million-dollar fleet battery replacement disasters."
    },
    "quests": [
      {
        "id": "iot-m2-d49-q1",
        "name": "Canary Deployment Statistical Significance Math",
        "type": "concept",
        "desc": "Calculate minimum cohort sample size and soak duration required to detect a 0.1% fatal crash bug with 99% statistical confidence."
      },
      {
        "id": "iot-m2-d49-q2",
        "name": "Fleet Health Telemetry Anomaly Detector",
        "type": "detective",
        "desc": "Analyze fleet-wide battery drain rates and network retry histograms to flag aberrant firmware builds before full rollout."
      },
      {
        "id": "iot-m2-d49-q3",
        "name": "Edge Fleet Health Telemetry Reporter in C",
        "type": "mastery",
        "desc": "Build an edge diagnostic reporter in C tracking heap high-water marks, task jitter, and hardware reset history."
      },
      {
        "id": "iot-m2-d49-q4",
        "name": "3 AM SRE: 500,000-Device Cellular Storm Shuts Down Mobile Operator",
        "type": "incident",
        "desc": "Mitigate a national carrier crisis where an un-staged fleet update caused hundreds of thousands of meters to flood cellular towers simultaneously."
      }
    ]
  },
  {
    "day": 50,
    "month": 2,
    "blockNum": 10,
    "title": "Milestone 9: Zero-Brick Dual-Bank FOTA Firmware Update Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone (Over-The-Air Update Engine & Fault Resilience)",
    "spokenGoal": "Architect, construct, and defend Milestone 9: the Zero-Brick Dual-Bank FOTA Firmware Update Engine. Build a comprehensive remote firmware lifecycle system in C for ARM Cortex-M. Download signed firmware images over Wi-Fi/cellular in chunked blocks into Flash Slot 1, verify SHA-256 hashes and ECDSA P-256 digital signatures, execute an atomic dual-bank hardware swap, launch a trial boot, run autonomous hardware self-tests, and confirm the update. Demonstrate 100% automatic rollback to the golden image when an intentional crash or power-cut is injected.",
    "conceptInvariant": "Zero-Brick Lifecycle Invariant: The firmware update engine must survive power cuts, corrupted download packets, missing network connectivity, and bad candidate binaries at every phase of the lifecycle without requiring physical technician intervention.",
    "failureMode": "Failing the milestone defense when the evaluator cuts power during the exact microsecond of the flash swap, and the board fails to reboot because the bootloader state flags became corrupted.",
    "tryItFriction": "Execute the live FOTA Defense Lab: download a signed update over Wi-Fi, cut power during download (verify resume/retry), cut power during trial boot (verify automatic rollback to Slot 0), and download a valid image that passes self-tests and achieves permanent confirmation.",
    "socraticHints": [
      "How do you ensure that bootloader metadata (current active slot, trial state, boot counter) survives power cuts without corruption?",
      "By storing metadata in a dual-sector alternating structure with sequence numbers and CRC-32 checksums! Metadata is written to Sector A; on the next update, it writes to Sector B before invalidating Sector A!",
      "If power fails mid-write, the older valid sector remains intact."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 9 defense, the evaluator commands: 'I am injecting a 1-byte corruption into packet 42 of the 100-packet FOTA download.' Your system continues downloading packets 43 to 100. At the end, what happens before your system attempts to reboot into the corrupted image?",
      "options": [
        "The system reboots and crashes.",
        "Cryptographic Digest Rejection: Before modifying any bootloader flags or touching active Flash slots, the FOTA manager computes the SHA-256 hash of the entire downloaded image in Slot 1 and compares it against the cryptographically signed manifest digest. The hash fails; Slot 1 is marked invalid, the update is aborted, and the current firmware continues operating normally.",
        "The board erases all memory.",
        "The MCU clock speed is halved."
      ],
      "answerIdx": 1,
      "debrief": "Cryptographic integrity checks are mandatory before any boot attempt. A single corrupted byte invalidates the SHA-256 digest, preventing the bootloader from ever attempting to execute corrupted binary code."
    },
    "quests": [
      {
        "id": "iot-m2-d50-q1",
        "name": "Zero-Brick FOTA Complete State Machine Specification",
        "type": "concept",
        "desc": "Produce the formal state machine diagram detailing IDLE -> DOWNLOADING -> VERIFYING -> SWAPPING -> TRIAL -> CONFIRMED -> ROLLBACK."
      },
      {
        "id": "iot-m2-d50-q2",
        "name": "Power-Cut Flash Swap Chaos Injection Harness",
        "type": "detective",
        "desc": "Trigger power resets during active flash erase and write cycles to verify that metadata CRC checks prevent bootloader bricking."
      },
      {
        "id": "iot-m2-d50-q3",
        "name": "Zero-Brick Dual-Bank FOTA Engine Build",
        "type": "mastery",
        "desc": "Implement the complete C FOTA subsystem with chunked streaming, ECDSA verification, trial boot states, and automated rollback."
      },
      {
        "id": "iot-m2-d50-q4",
        "name": "Milestone 9 Defense: Live Power-Cut & Corrupted FOTA Chaos Lab",
        "type": "incident",
        "desc": "Defend the FOTA engine under live power cuts and adversarial packet injection before a senior evaluator panel."
      }
    ]
  },
  {
    "day": 51,
    "month": 2,
    "blockNum": 11,
    "title": "Inertial Measurement Units (IMU): 6-DOF Accelerometers, Gyroscopes & Sensor Physics",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Edge Sensor Systems (IMU Kinematics & High-Speed Sensor Sampling)",
    "spokenGoal": "Capture physical motion on the edge: master 6-DOF and 9-DOF Inertial Measurement Units (IMUs, e.g., MPU-6050, LSM6DSOX, BMI270). Understand the physical operating principles: MEMS accelerometers (measuring proper acceleration in g's using capacitive proof masses, susceptible to high-frequency vibration noise) versus MEMS gyroscopes (measuring angular velocity in degrees/second using the Coriolis effect, susceptible to low-frequency integration drift). Configure FIFO watermarks, full-scale ranges (+/- 2g to +/- 16g, +/- 250 dps to +/- 2000 dps), digital low-pass filters (DLPF), and high-speed SPI burst reads up to 10MHz.",
    "conceptInvariant": "Sensor Calibration Invariant: Raw sensor readings must be mathematically corrected for static zero-rate bias offset (bias) and sensitivity scale factors (gain) determined through factory calibration before being ingested by attitude estimation algorithms.",
    "failureMode": "Integrating raw gyroscope angular rates (deg/s) directly over time without subtracting the static bias offset; within 60 seconds, a tiny 0.5 deg/s bias accumulates into a 30-degree phantom tilt angle error, flipping a drone upside down.",
    "tryItFriction": "Build an SPI High-Speed IMU Driver in C: configure an IMU over SPI for 1kHz output data rate (ODR); read raw 16-bit 2's complement accelerometer and gyroscope data using DMA burst reads; convert to physical units (m/s^2 and rad/s); and compute static bias offsets during a 2-second stationary calibration sequence.",
    "socraticHints": [
      "Why can't you calculate a drone's tilt angle using an accelerometer alone when the drone is actively accelerating through the air?",
      "Because an accelerometer measures the vector sum of gravity AND linear acceleration! When the drone accelerates forward, the accelerometer cannot distinguish forward acceleration from tilt angle!",
      "Gyroscopes must be fused with accelerometers to track dynamic motion."
    ],
    "situationalPuzzle": {
      "scenario": "A wearable fitness tracker counts steps using an accelerometer. In testing, the tracker counts 10,000 steps while a user is sitting at a desk typing on a mechanical keyboard. The raw Z-axis acceleration shows massive 50Hz high-frequency spikes. What digital filtering step was omitted in firmware?",
      "options": [
        "The user was actually running.",
        "Digital Low-Pass Filtering (DLPF) & Bandpass Cutoff: Human walking occurs at 1Hz to 3Hz. Typing on a keyboard induces high-frequency acoustic shockwaves (30Hz to 100Hz). Without configuring the on-chip Digital Low-Pass Filter (DLPF cutoff at 5Hz) or implementing a software low-pass filter, the step detection peak-detector misinterprets keyboard vibrations as foot strikes!",
        "Accelerometers cannot detect walking.",
        "The battery was low."
      ],
      "answerIdx": 1,
      "debrief": "Raw sensor data always contains unwanted spectral components. In step counting and motion analysis, high-frequency mechanical noise must be filtered out using digital low-pass filters to isolate genuine human biomechanical frequencies (1-3Hz)."
    },
    "quests": [
      {
        "id": "iot-m2-d51-q1",
        "name": "MEMS Gyroscope Integration Drift & Allan Variance Math",
        "type": "concept",
        "desc": "Model angle random walk (ARW) and bias instability drift as a function of time when integrating noisy angular rate data."
      },
      {
        "id": "iot-m2-d51-q2",
        "name": "IMU FIFO Watermark & SPI Burst DMA Profiler",
        "type": "detective",
        "desc": "Inspect SPI bus traces during 1kHz IMU burst reads and measure CPU cycle savings achieved by reading FIFO packets via DMA."
      },
      {
        "id": "iot-m2-d51-q3",
        "name": "High-Speed SPI 6-DOF IMU Driver in C",
        "type": "mastery",
        "desc": "Implement a complete IMU driver with configurable DLPF, full-scale ranges, static bias calibration, and unit conversion."
      },
      {
        "id": "iot-m2-d51-q4",
        "name": "3 AM SRE: Drone Attitude Inversion During High-Speed Dash",
        "type": "incident",
        "desc": "Resolve a high-speed flight crash caused by uncalibrated gyroscope bias and accelerometer linear acceleration contamination."
      }
    ]
  },
  {
    "day": 52,
    "month": 2,
    "blockNum": 11,
    "title": "Digital Signal Processing (DSP): FIR/IIR Filters, CMSIS-DSP Vector Math & Fast Fourier Transforms (FFT)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Edge DSP Engineering (Digital Filters & Spectral Analysis with CMSIS-DSP)",
    "spokenGoal": "Perform advanced mathematical signal processing in real-time on microcontrollers: master CMSIS-DSP. Explore the ARM Cortex-M4/M7 DSP instruction set: Single Instruction Multiple Data (SIMD) instructions that multiply and accumulate two 16-bit numbers in a single clock cycle (SMLAD). Compare Finite Impulse Response (FIR: always stable, linear phase, higher order) versus Infinite Impulse Response (IIR: lower computation, potential feedback instability). Master the Fast Fourier Transform (FFT: Radix-4 / RFFT): converting time-domain sensor signals into frequency spectra in real-time to detect machine vibration anomalies and bearing failures.",
    "conceptInvariant": "CMSIS-DSP SIMD Acceleration Invariant: Vector mathematical operations (dot products, convolutions, biquad IIR filters, FFTs) must be executed using hardware-optimized CMSIS-DSP assembly primitives, achieving up to 4x throughput improvement over standard C math loops.",
    "failureMode": "Writing a custom nested for-loop in standard C to compute an FFT on 1024 samples; the un-optimized loop takes 85 milliseconds, missing the 10-millisecond real-time vibration sampling window.",
    "tryItFriction": "Implement Real-Time Spectral Analysis in C using CMSIS-DSP: sample a 1024-point vibration stream at 10kHz; execute arm_rfft_fast_f32(); compute magnitude spectra with arm_cmplx_mag_f32(); and identify the dominant vibration harmonic frequency in under 2 milliseconds.",
    "socraticHints": [
      "What is the difference between an FIR filter and an IIR filter?",
      "An FIR filter depends ONLY on past input samples (no feedback loop), making it unconditionally stable and capable of perfect linear phase; an IIR filter uses feedback (past outputs), requiring vastly fewer calculations for sharp cutoffs but risking numerical instability!",
      "CMSIS-DSP provides optimized arm_fir_f32() and arm_biquad_cascade_df1_f32()."
    ],
    "situationalPuzzle": {
      "scenario": "An industrial predictive maintenance sensor computes 1024-point FFTs on an ARM Cortex-M4 MCU. In the lab, it compiles with hardware floating-point enabled (-mfloat-abi=hard -mfpu=fpv4-sp-d16). However, an engineer runs FFT on double-precision floats ('double input[1024]'). The FFT execution time explodes from 1.8 milliseconds to 48 milliseconds. Why did double precision destroy DSP performance?",
      "options": [
        "Cortex-M4 does not support math.",
        "Software Emulated Double-Precision Floating Point: The Cortex-M4 FPU is SINGLE-PRECISION only (32-bit float)! It has zero hardware support for 64-bit 'double'. The compiler was forced to emit thousands of software emulation subroutine calls for every double operation, destroying throughput by 25x! Firmware must use 32-bit 'float' with CMSIS-DSP.",
        "FFT cannot run on doubles.",
        "The CPU clock was throttled."
      ],
      "answerIdx": 1,
      "debrief": "ARM Cortex-M4 has a single-precision hardware FPU. Using 'double' (or float literals without 'f' suffix like '0.5' instead of '0.5f') forces software floating-point emulation, annihilating real-time performance. Always use 'float' and CMSIS-DSP on Cortex-M4."
    },
    "quests": [
      {
        "id": "iot-m2-d52-q1",
        "name": "Radix-2 / Radix-4 FFT Butterfly Computational Complexity",
        "type": "concept",
        "desc": "Calculate mathematical multiply-accumulate operations for N*log2(N) FFT versus O(N^2) Discrete Fourier Transform."
      },
      {
        "id": "iot-m2-d52-q2",
        "name": "CMSIS-DSP SIMD Vector vs Standard C Benchmark",
        "type": "detective",
        "desc": "Benchmark clock cycle consumption of arm_fir_f32() versus pure C nested for-loop convolution using DWT cycle counter."
      },
      {
        "id": "iot-m2-d52-q3",
        "name": "Real-Time 1024-Point CMSIS-DSP Vibration Analyzer",
        "type": "mastery",
        "desc": "Implement an end-to-end vibration anomaly detector in C computing real FFTs and isolating peak harmonic frequencies."
      },
      {
        "id": "iot-m2-d52-q4",
        "name": "3 AM SRE: Industrial Pump Predictive Maintenance False Alarm",
        "type": "incident",
        "desc": "Resolve a high-severity factory alert caused by spectral leakage in an un-windowed FFT triggering false bearing defect alarms."
      }
    ]
  },
  {
    "day": 53,
    "month": 2,
    "blockNum": 11,
    "title": "Sensor Fusion Algorithms: Complementary Filter vs Extended Kalman Filter (EKF) on Edge MCU",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Advanced Kinematics & Attitude Estimation (Sensor Fusion & Matrix Mathematics)",
    "spokenGoal": "Merge accelerometer and gyroscope readings to calculate true orientation: master Sensor Fusion on microcontrollers. Understand the complementary nature of inertial sensors: gyroscopes are fast and accurate in the short term but drift over time; accelerometers are noisy in the short term but stable in the long term (gravity vector). Implement the elegant Complementary Filter: pitch = 0.98 * (pitch + gyro * dt) + 0.02 * (accel_pitch). Advance to the gold standard: the Extended Kalman Filter (EKF) and Madgwick filter using quaternions to eliminate Gimbal Lock.",
    "conceptInvariant": "Quaternion Attitude Representation Invariant: 3D spatial orientation estimation in robotics and aerospace firmware must be represented internally using unit quaternions (q0, q1, q2, q3); Euler angles (pitch, roll, yaw) must strictly be derived for external display to avoid mathematical singularity (Gimbal Lock) at 90 degrees pitch.",
    "failureMode": "Representing a gimbal camera's orientation with Euler angles; when the drone tilts to 90 degrees pitch, pitch and yaw axes align, triggering Gimbal Lock and causing the camera to spin uncontrollably.",
    "tryItFriction": "Construct a Madgwick Quaternion Attitude Estimator in C: process 100Hz 6-DOF IMU data; compute gradient descent orientation updates; normalize quaternions using fast inverse square root (0x5f3759df / InvSqrt); and convert quaternions to Roll, Pitch, and Yaw with zero gimbal lock.",
    "socraticHints": [
      "What is 'Gimbal Lock' and why does it break Euler angle orientation tracking?",
      "When pitch reaches +/- 90 degrees, the roll and yaw rotation axes become parallel in 3D space! You lose one degree of freedom, and mathematical division by zero occurs in trigonometric functions!",
      "Quaternions represent rotations in 4D hyperspace with zero singularities."
    ],
    "situationalPuzzle": {
      "scenario": "An aerospace tracking beacon uses a Complementary Filter: 'angle = 0.98 * (angle + gyro*dt) + 0.02 * accel_angle'. The developer increases the accelerometer weight to 0.50 ('angle = 0.50 * ... + 0.50 * ...') to make the angle track faster. During rocket launch acceleration, the estimated tilt angle instantly deflects by 45 degrees, even though the rocket is flying perfectly vertical. Why did increasing accelerometer weight destroy launch tracking?",
      "options": [
        "The rocket flew too fast.",
        "Linear Acceleration Contamination: Rocket launch produces massive linear acceleration. A high accelerometer weighting (0.50) forces the filter to believe the rocket's forward thrust vector is the direction of gravity! The filter tilts its perceived vertical axis, causing the guidance system to believe the rocket is tipping over.",
        "The gyroscope broke.",
        "The filter formula had a typo."
      ],
      "answerIdx": 1,
      "debrief": "Accelerometers cannot distinguish linear acceleration from gravity. The accelerometer's role in sensor fusion is strictly to correct long-term gyro drift during near-static or low-acceleration periods. High accelerometer weighting during high dynamic acceleration corrupts attitude estimation."
    },
    "quests": [
      {
        "id": "iot-m2-d53-q1",
        "name": "Complementary Filter Frequency-Domain Transfer Function",
        "type": "concept",
        "desc": "Derive the s-domain transfer function demonstrating that the Complementary Filter acts as a high-pass on gyro and low-pass on accel."
      },
      {
        "id": "iot-m2-d53-q2",
        "name": "Euler Angle Gimbal Lock vs Quaternion Rotation Disassembler",
        "type": "detective",
        "desc": "Demonstrate the mathematical singularity at 90 degrees pitch in Euler angles versus continuous quaternion matrix rotation."
      },
      {
        "id": "iot-m2-d53-q3",
        "name": "Madgwick Quaternion Orientation Filter in C",
        "type": "mastery",
        "desc": "Implement a real-time Madgwick IMU fusion filter in C executing at 200Hz with quaternion normalization and Euler conversion."
      },
      {
        "id": "iot-m2-d53-q4",
        "name": "3 AM SRE: Autonomous Forklift Tilt Sensor Failure in Warehouse",
        "type": "incident",
        "desc": "Resolve a high-concurrency AGV turnover caused by abrupt braking acceleration corrupting complementary filter attitude estimates."
      }
    ]
  },
  {
    "day": 54,
    "month": 2,
    "blockNum": 11,
    "title": "3 AM Hardware War Room Simulation: Brownouts, Ground Loops, Decoupling & EMI Clock Jitter",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Hardware Incident Simulation (3 AM Physical War Room & Signal Integrity Triage)",
    "spokenGoal": "Step into the ultimate hardware engineering crucible: simulate a high-stakes 3 AM production hardware war room. Diagnose four of the most insidious electrical and physical hardware failure modes: 1) Brownout Resets (BOR) caused by inrush current when a high-power cellular modem or relay turns on, sagging the 3.3V rail below 2.7V; 2) Ground Loops inducing 50Hz/60Hz hum across analog ADC lines; 3) Missing Decoupling Capacitors (0.1uF ceramic caps) allowing high-frequency digital noise to reset the core; and 4) Electromagnetic Interference (EMI) inducing clock jitter and corrupting crystal oscillators. Execute root-cause remediation under strict SLA countdowns.",
    "conceptInvariant": "Power Rail Stability Invariant: Under maximum instantaneous transient current draw (transceiver transmit bursts, relay switching), the VDD power supply rail at every microcontroller pin must remain strictly above the hardware Brownout Reset threshold (BOR) with less than 50mV peak-to-peak ripple.",
    "failureMode": "Activating an LTE modem's 2-Amp transmit burst while powered from an unbuffered 3.3V LDO regulator; VDD sags to 2.4V for 80 microseconds, tripping the MCU's internal Brownout Detector and causing an endless reboot loop every time the modem transmits.",
    "tryItFriction": "Execute the 3 AM Hardware Triage Lab: connect an oscilloscope to a simulated sagging power rail; capture the nanosecond voltage dip during high-load switching; calculate the required bulk decoupling capacitance (C = I * dt / dV); and verify that adding 100uF tantalum + 0.1uF ceramic capacitors restores flat 3.3V power rail stability.",
    "socraticHints": [
      "Why is a 0.1uF ceramic capacitor placed immediately adjacent to every single VDD pin of a microcontroller?",
      "Because PCB copper traces have parasitic inductance! High-frequency digital switching draws sudden current spikes that inductive traces cannot supply fast enough; the tiny 0.1uF ceramic cap has near-zero inductance and supplies instantaneous charge locally!",
      "Without decoupling capacitors, internal silicon voltage collapses, causing random resets."
    ],
    "situationalPuzzle": {
      "scenario": "At 3:15 AM, alerts trigger: a factory production line of 500 motor controllers experiences random, intermittent microcontroller resets. The software team insists: 'The firmware hasn't changed in 6 months!' Probing the physical boards reveals that resets only occur when the large 480V three-phase motors switch on. An oscilloscope on the MCU reset pin shows a sharp -1.2V negative spike during motor startup. What physical phenomenon is occurring?",
      "options": [
        "The software ran out of memory.",
        "Inductive Flyback & Ground Bounce / EMI Coupling: The high-power motor contactors create massive magnetic fields (EMI) and inductive flyback. High transient current rushing through the shared ground plane creates Ground Bounce (voltage potential difference across the ground plane), which coupled into the high-impedance MCU reset line, pulling it below the reset threshold! Adding a 100nF filter capacitor and a TVS diode on the reset line eliminates the glitch.",
        "The MCU clock speed is too high.",
        "The factory lights flickered."
      ],
      "answerIdx": 1,
      "debrief": "Physical electrical noise does not care about your C code. Inductive loads (motors, relays, solenoids) generate massive electromagnetic transients that couple into high-impedance reset and signal lines. Proper TVS protection, decoupling capacitors, and ground plane separation are fundamental hardware requirements."
    },
    "quests": [
      {
        "id": "iot-m2-d54-q1",
        "name": "Decoupling Capacitor Transient Slew Rate Math",
        "type": "concept",
        "desc": "Calculate required bulk and high-frequency bypass capacitance given peak pulse current, pulse width, and allowable voltage sag."
      },
      {
        "id": "iot-m2-d54-q2",
        "name": "Brownout Reset (BOR) & Power Glitch Oscilloscope Analyzer",
        "type": "detective",
        "desc": "Capture nanosecond power rail sags on an oscilloscope during radio transmit bursts and identify BOR trip thresholds."
      },
      {
        "id": "iot-m2-d54-q3",
        "name": "Hardware Brownout Supervisor & Soft-Start Driver",
        "type": "mastery",
        "desc": "Implement a firmware power management driver with soft-start PWM inrush limiting and BOR reset logging in C."
      },
      {
        "id": "iot-m2-d54-q4",
        "name": "3 AM SRE War Room: Factory Automation Relay EMI Reboot Crisis",
        "type": "incident",
        "desc": "Triage a live manufacturing plant shutdown caused by relay inductive flyback tripping microcontroller resets under SLA countdown."
      }
    ]
  },
  {
    "day": 55,
    "month": 2,
    "blockNum": 11,
    "title": "Milestone 10: Real-Time 6-DOF Sensor Fusion & DSP Anomaly Detection Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone (Sensor Fusion & Edge Machine Health Analytics)",
    "spokenGoal": "Architect, construct, and defend Milestone 10: the Real-Time 6-DOF Sensor Fusion & DSP Anomaly Detection Engine. Build a comprehensive edge intelligence firmware in C for ARM Cortex-M4/M7. Sample 6-DOF IMU motion at 1kHz over high-speed SPI with DMA; execute a 200Hz Madgwick quaternion sensor fusion algorithm to track 3D attitude with sub-degree accuracy; simultaneously stream high-rate vibration data into a CMSIS-DSP 1024-point FFT pipeline; and detect mechanical bearing anomalies in real-time before hardware failure occurs.",
    "conceptInvariant": "Edge Real-Time DSP Invariant: Sensor fusion and spectral FFT analysis must execute deterministically within their allotted real-time execution slots (fusion < 500 microseconds, FFT < 2 milliseconds), maintaining continuous 1kHz data acquisition without dropping a single IMU sample.",
    "failureMode": "Failing the milestone defense when the evaluator injects rapid 3D rotation and simulated mechanical bearing vibration simultaneously, and the system misses attitude tracking deadlines due to un-optimized floating-point FFT execution.",
    "tryItFriction": "Deploy and test Milestone 10: rotate the sensor board through rapid 3D maneuvers (prove zero gimbal lock and accurate quaternion output); apply a 120Hz test vibration signal; demonstrate that the CMSIS-DSP pipeline detects the 120Hz peak harmonic and triggers a mechanical anomaly alert within 50 milliseconds.",
    "socraticHints": [
      "How do you execute both a 200Hz attitude fusion filter and a 1024-point FFT without starving each other?",
      "By placing them in separate prioritized FreeRTOS tasks! Attitude Fusion runs at High Priority (every 5ms) to maintain real-time orientation; Vibration FFT runs at Medium Priority (background worker) processing double-buffered DMA blocks!",
      "The fast attitude filter preempts the FFT calculation whenever a new IMU sample arrives."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 10 defense, the evaluator applies a constant magnetic disturbance (a strong neodymium magnet) near the sensor. If your fusion algorithm blindly incorporates magnetometer data, the orientation yaw spins wildly. How does a defensive sensor fusion algorithm detect and reject magnetic anomalies?",
      "options": [
        "Turn off the microcontroller.",
        "Magnetic Field Norm Anomaly Rejection: The algorithm calculates the absolute magnitude of the measured magnetic field vector (|B| = sqrt(Bx^2 + By^2 + Bz^2)) and compares it against the known local Earth magnetic field (~0.5 Gauss). If the measured norm deviates by more than 15%, the filter temporarily decouples the magnetometer and relies purely on gyro integration until the magnetic anomaly passes!",
        "Magnets do not affect sensors.",
        "Restart the board."
      ],
      "answerIdx": 1,
      "debrief": "Advanced sensor fusion must include defensive anomaly rejection. Rejecting invalid external measurements (magnetic distortions near motors or structural steel) ensures that the estimated orientation remains rock-solid in real-world industrial environments."
    },
    "quests": [
      {
        "id": "iot-m2-d55-q1",
        "name": "6-DOF Attitude Fusion & Spectral Analysis System Architecture",
        "type": "concept",
        "desc": "Produce the formal system architecture detailing IMU SPI DMA pipelines, Madgwick quaternion filters, and CMSIS-DSP FFT buffers."
      },
      {
        "id": "iot-m2-d55-q2",
        "name": "Magnetic Distortion & Anomaly Rejection Harness",
        "type": "detective",
        "desc": "Simulate external magnetic interference and verify that magnetic field norm thresholding suppresses yaw divergence."
      },
      {
        "id": "iot-m2-d55-q3",
        "name": "Edge Sensor Fusion & DSP Anomaly Engine Build",
        "type": "mastery",
        "desc": "Build the complete production C firmware integrating 6-DOF Madgwick attitude tracking, 1024-point FFT analysis, and peak harmonic alarms."
      },
      {
        "id": "iot-m2-d55-q4",
        "name": "Milestone 10 Defense: Multi-Axis Dynamics & Vibration Chaos Lab",
        "type": "incident",
        "desc": "Defend the edge DSP platform before a senior panel under extreme multi-axis tumbling and simulated bearing vibration noise."
      }
    ]
  },
  {
    "day": 56,
    "month": 2,
    "blockNum": 12,
    "title": "Functional Safety & Redundancy: 1oo2 / 2oo3 Voting Architectures, Dual-Core Lockstep & SIL-3",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Functional Safety Engineering (IEC 61508 SIL-3, ISO 26262 ASIL-D & Redundancy)",
    "spokenGoal": "Design systems where failure is not an option: master Functional Safety and Redundancy Architecture (IEC 61508 SIL-3 and ISO 26262 ASIL-D). Understand architectural hardware fault metrics: 1oo1 (Single channel, no redundancy), 1oo2 (One out of Two: high safety, either channel can trip safety shutdown), and 2oo3 (Two out of Three: Triple Modular Redundancy - TMR with majority voting, high safety AND high availability). Deconstruct Dual-Core Lockstep (Cortex-M7/R5): two identical CPU cores executing the exact same instructions in lockstep, with hardware comparators tripping an instant NMI fault if a single transistor state differs.",
    "conceptInvariant": "Fail-Safe State Determinism Invariant: In a safety-critical system, every detectable internal or external hardware fault must transition the system into a predefined, mathematically verified Fail-Safe State within a bounded Fault Reaction Time (FRT, e.g., < 10ms) without relying on software intervention.",
    "failureMode": "Designing a fail-safe brake system that requires the microcontroller to actively output high voltage to engage the brakes; when the microcontroller loses power, the brakes cannot engage, causing a runaway vehicle.",
    "tryItFriction": "Implement a 2oo3 Triple Modular Redundant (TMR) Voter in C: simulate three redundant sensor channels; write a majority voting algorithm that detects single-channel drift or failure, flags the degraded channel for maintenance, and outputs the consensus value with bounded execution latency.",
    "socraticHints": [
      "Why is a 'De-energize to Trip' (normally closed) design the foundational law of industrial safety systems?",
      "Because if a wire breaks, a connector shakes loose, or the power supply fails completely, the circuit naturally loses current, automatically tripping the safety mechanism into the safe state!",
      "An energize-to-trip system cannot activate if power or wiring is severed."
    ],
    "situationalPuzzle": {
      "scenario": "A nuclear power plant safety shutdown system uses a 1oo2 (One out of Two) redundant architecture with two independent microcontrollers monitoring coolant pressure. If Channel A reads pressure > 100 bar, it opens the relief valve. If Channel B reads > 100 bar, it opens the relief valve. A technician asks: 'Why don't we use 2oo2 (both must agree)?' What is the fatal safety flaw of a 2oo2 architecture for an emergency shutdown system?",
      "options": [
        "2oo2 requires twice as much electricity.",
        "Dangerous Failure Mode in 2oo2: In a 2oo2 system, BOTH channels must agree to trigger a shutdown. If Channel A fails dangerous (its sensor breaks and permanently reads 0 bar), Channel B can never trigger a shutdown alone! A single failed component prevents the safety system from activating, completely destroying safety integrity! 1oo2 guarantees safety even if one channel fails.",
        "Microcontrollers cannot communicate in pairs.",
        "Nuclear reactors do not use pressure valves."
      ],
      "answerIdx": 1,
      "debrief": "In safety engineering, 1oo2 optimizes for SAFETY (it will trip if either channel detects danger, though it risks false alarms). 2oo2 optimizes for AVAILABILITY (reducing false alarms), but is dangerous because a single blinded channel prevents safety trips. 2oo3 achieves the best of both worlds."
    },
    "quests": [
      {
        "id": "iot-m2-d56-q1",
        "name": "Reliability Block Diagrams & Safe Failure Fraction (SFF) Math",
        "type": "concept",
        "desc": "Calculate Probability of Failure on Demand (PFD) and Safe Failure Fraction across 1oo1, 1oo2, and 2oo3 architectures under IEC 61508."
      },
      {
        "id": "iot-m2-d56-q2",
        "name": "Dual-Core Lockstep Comparator Fault Disassembler",
        "type": "detective",
        "desc": "Inspect hardware fault injection registers to trace how Cortex-R5/M7 lockstep core comparator mismatches trigger immediate NMI resets."
      },
      {
        "id": "iot-m2-d56-q3",
        "name": "2oo3 Triple Modular Redundancy (TMR) Voting Engine in C",
        "type": "mastery",
        "desc": "Implement a fail-safe 2oo3 voter in C with cross-channel health diagnostics, sensor drift detection, and fail-safe output clamps."
      },
      {
        "id": "iot-m2-d56-q4",
        "name": "3 AM SRE: Chemical Valve Fails Safe During Sensor Disconnect",
        "type": "incident",
        "desc": "Verify that a severed sensor wire correctly triggers de-energize-to-trip safety shutdown in an industrial chemical plant controller."
      }
    ]
  },
  {
    "day": 57,
    "month": 2,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: Medical Infusion Pump Firmware",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Mission-Critical Systems Architecture (Medical Device Firmware Engineering)",
    "spokenGoal": "Dissect the firmware architecture of a life-critical medical device: an Automated Drug Infusion Pump (FDA Class III / IEC 62304 Class C). Explore the strict dual-processor safety architecture: Primary Delivery MCU (driving stepper motors, calculating micro-liter dosages, monitoring optical drop sensors) and Independent Supervisory Safety MCU (cross-checking delivery volume, monitoring bubble-in-line ultrasonic sensors, checking occlusions, capable of physically cutting motor power). Master life-critical invariants: anti-free-flow mechanisms, independent watchdog safety chains, and hard real-time dose verification.",
    "conceptInvariant": "Dual-Processor Independence Invariant: In life-critical drug delivery systems, the motor drive controller and the safety supervision monitor must be physically distinct silicon processors with isolated power monitoring, where the safety supervisor has independent hardware authority to kill motor power upon any discrepancy.",
    "failureMode": "A single processor controls drug delivery and performs safety checks; an internal MCU lockup or runaway PWM timer drives the stepper motor at full speed, delivering a lethal overdose of insulin or anesthesia to a patient.",
    "tryItFriction": "Construct a Dual-Processor Safety Cross-Check Protocol in C: implement a high-speed SPI/UART heartbeat protocol between Primary MCU and Safety MCU; exchange running delivery counts every 10ms; and verify that if Primary delivery deviates by > 2% from Safety sensor measurements, Safety MCU de-energizes the motor power relay in < 5 milliseconds.",
    "socraticHints": [
      "Why must an ultrasonic bubble detector be monitored by the independent safety MCU rather than just the primary delivery MCU?",
      "Because air bubbles in an intravenous drug line can cause fatal air embolisms in patients! If the primary delivery MCU freezes or experiences a task hang, it might ignore the bubble sensor!",
      "The independent safety MCU guarantees that an air bubble cuts motor power instantly regardless of primary MCU health."
    ],
    "situationalPuzzle": {
      "scenario": "A medical infusion pump is delivering morphine at 1.0 mL/hour. A mechanical gear in the stepper motor slips, delivering only 0.2 mL/hour. The primary MCU pulses the motor at the correct frequency, so it believes delivery is normal. How does the secondary safety MCU detect this mechanical under-infusion failure?",
      "options": [
        "Ask the patient if they feel pain.",
        "Independent Optical / Rotary Encoder Cross-Verification: The safety MCU monitors an independent optical encoder attached directly to the output syringe plunger shaft, completely separate from the motor electrical drive signals! It calculates physical displacement; when physical travel lags expected volume by > 5%, it triggers an occlusion/motor slip alarm and halts operation.",
        "The pump cannot detect mechanical slips.",
        "Double the motor voltage."
      ],
      "answerIdx": 1,
      "debrief": "Never trust open-loop actuation in life-critical systems. The safety supervisor must measure physical outcome (syringe displacement via optical encoder, fluid flow via drop sensor), not just the electrical drive command, to detect mechanical slippage or gear jams."
    },
    "quests": [
      {
        "id": "iot-m2-d57-q1",
        "name": "Medical Infusion Pump Dual-MCU Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive safety block diagram detailing Primary MCU, Safety MCU, optical encoders, bubble sensors, and power cutoffs."
      },
      {
        "id": "iot-m2-d57-q2",
        "name": "Cross-Processor Heartbeat Protocol Disassembler",
        "type": "detective",
        "desc": "Trace inter-processor message exchange verifying that missing heartbeat responses trip the safety motor relay within < 10ms."
      },
      {
        "id": "iot-m2-d57-q3",
        "name": "Infusion Pump Dosage & Occlusion Safety Engine in C",
        "type": "mastery",
        "desc": "Build a C safety supervision subsystem with stepper motor step verification, pressure occlusion sensing, and emergency power cutoff."
      },
      {
        "id": "iot-m2-d57-q4",
        "name": "3 AM SRE: Infusion Pump Runaway Stepper Motor Overdose Lab",
        "type": "incident",
        "desc": "Verify that a simulated Primary MCU runaway PWM condition is caught and terminated by the Safety MCU before dosage limits are breached."
      }
    ]
  },
  {
    "day": 58,
    "month": 2,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: Connected Electric Vehicle Battery Management System (BMS)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "High-Voltage Systems Architecture (EV Battery Management & Automotive Safety)",
    "spokenGoal": "Dissect the firmware engineering of an Electric Vehicle Battery Management System (EV BMS, ISO 26262 ASIL-D). Understand high-voltage battery pack architecture: 96 to 108 lithium-ion cells in series (400V / 800V packs). Deconstruct the three fundamental BMS functions: 1) High-precision multi-channel cell voltage monitoring (millivolt accuracy via isolated SPI/isoSPI); 2) Passive and active Cell Balancing to prevent overcharge and capacity degradation; and 3) State of Charge (SoC) and State of Health (SoH) estimation using Coulomb Counting and Extended Kalman Filters. Master contactor relay control (Pre-Charge, Positive, Negative) and high-voltage interlock loops (HVIL).",
    "conceptInvariant": "Contactor Pre-Charge Sequencing Invariant: High-voltage battery contactors must never close directly into an uncharged inverter capacitor bank; the Pre-Charge relay and current-limiting resistor must pre-charge the DC bus to >= 95% of battery voltage before the main positive contactor closes, preventing catastrophic contactor welding.",
    "failureMode": "Closing the main high-voltage contactor immediately upon vehicle start; the instantaneous 1,500-Amp inrush current into uncharged motor inverter capacitors welds the contactor contacts together, permanently energizing the 400V bus.",
    "tryItFriction": "Construct a Pre-Charge Contactor State Machine in C: implement states DISCONNECTED, PRECHARGING, CONNECTED, FAULT; monitor battery voltage and DC link voltage; enforce a 200ms pre-charge window; verify DC link reaches 95%; close main contactor; open pre-charge relay; and trigger emergency shutdown if pre-charge fails within 500ms.",
    "socraticHints": [
      "What is a High Voltage Interlock Loop (HVIL) in electric vehicles?",
      "It is a continuous low-voltage safety circuit routed through every single high-voltage connector, battery cover, and service plug in the vehicle! If any connector is unplugged or opened by a technician, the HVIL circuit breaks instantly!",
      "The BMS detects the broken loop and opens all high-voltage contactors in < 10 milliseconds to prevent electrocution."
    ],
    "situationalPuzzle": {
      "scenario": "An electric vehicle is DC fast-charging at 150kW. The BMS monitors 96 battery cells. Cell 42 temperature suddenly spikes from 35\u00b0C to 65\u00b0C, while its voltage drops from 4.1V to 3.6V. All other 95 cells remain at 35\u00b0C. What catastrophic battery phenomenon has begun, and what must the BMS firmware execute immediately?",
      "options": [
        "Cell 42 is charging faster than the others.",
        "Thermal Runaway & Internal Dendrite Short Circuit: An internal microscopic short circuit has developed in Cell 42, converting electrical energy directly into intense localized heat. Left unchecked, it will trigger thermal runaway and a battery pack fire! The BMS must instantly command the DC fast charger to abort current (0 Amps), open the main contactors, engage the battery coolant pump at maximum power, and sound vehicle cabin alarms.",
        "Turn down the cabin air conditioning.",
        "Wait for the temperature to equalize."
      ],
      "answerIdx": 1,
      "debrief": "Thermal runaway detection is the highest-priority safety function of an EV BMS. Sudden localized temperature rise combined with voltage drop indicates an internal cell short. Aborting charging and isolating contactors within milliseconds is required to prevent battery fires."
    },
    "quests": [
      {
        "id": "iot-m2-d58-q1",
        "name": "EV Battery Pack Contactor Sequencing State Machine Blueprint",
        "type": "concept",
        "desc": "Produce the formal state machine diagram detailing HVIL check, Pre-Charge timing, main contactor closure, and emergency disconnect."
      },
      {
        "id": "iot-m2-d58-q2",
        "name": "Coulomb Counting & OCV-SoC Hysteresis Model",
        "type": "detective",
        "desc": "Implement current integration (Coulomb counting) with Open Circuit Voltage (OCV) lookup table calibration for battery State of Charge."
      },
      {
        "id": "iot-m2-d58-q3",
        "name": "Automotive BMS Cell Balancing & Contactor Driver in C",
        "type": "mastery",
        "desc": "Build an ISO 26262 compliant BMS subsystem in C with passive cell balancing, pre-charge sequencing, and CAN bus telemetry."
      },
      {
        "id": "iot-m2-d58-q4",
        "name": "3 AM SRE: Fast-Charging Contactor Welding Incident Triage",
        "type": "incident",
        "desc": "Triage a high-voltage charging station failure where premature contactor closure welded relays during public DC fast-charging."
      }
    ]
  },
  {
    "day": 59,
    "month": 2,
    "blockNum": 12,
    "title": "Principal Embedded Systems Engineer RFC: Firmware Architectural Justification & Hardware Co-Design",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Staff / Principal Engineering (RFC Authoring, Hardware-Software Co-Design & Governance)",
    "spokenGoal": "Operate at the highest level of technical leadership: author a Principal Embedded Systems Engineer Request for Comments (RFC). Master the art of firmware architectural justification: Bare-Metal Super-Loop vs Preemptive RTOS (FreeRTOS/Zephyr) vs Embedded Linux; 8-bit vs 32-bit Cortex-M0+ vs Cortex-M4/M7 vs RISC-V; Internal Flash vs External QSPI NOR Flash; Dynamic Memory vs 100% Static Allocation. Formulate rigorous hardware-software co-design analyses, bill of materials (BOM) cost sensitivity ($0.05 component savings over 10M units = $500,000 profit), power budgets, and regulatory certification roadmaps.",
    "conceptInvariant": "Architectural Justification Invariant: Every silicon and firmware architectural choice must be justified not by habit or familiarity, but by explicit trade-off matrices contrasting Bill of Materials (BOM) cost, worst-case execution time (WCET), battery lifespan, and functional safety certification complexity.",
    "failureMode": "Choosing an expensive quad-core microprocessor running Embedded Linux for a simple battery-powered smart thermostat; multiplying BOM hardware cost by 4x, requiring 15-second boot times, and draining batteries in 2 days instead of 2 years.",
    "tryItFriction": "Author and defend an 8-page Principal Firmware Architecture RFC for a mass-market connected medical device: justify selecting an ARM Cortex-M4 with FreeRTOS over Embedded Linux, detail flash partitioning, present the BOM cost breakdown, and prove ISO 62304 Class C compliance.",
    "socraticHints": [
      "Why is saving $0.15 on a microcontroller chip choice a massive multi-million dollar triumph in consumer electronics?",
      "Because when you manufacture 10 million smart devices, saving $0.15 per unit drops $1,500,000 of pure margin directly to the bottom line!",
      "A Principal Embedded Engineer designs the leanest possible silicon and firmware architecture that achieves safety and performance goals at minimum unit cost."
    ],
    "situationalPuzzle": {
      "scenario": "A startup CTO proposes: 'Let's use Raspberry Pi running Linux for our new battery-powered outdoor smart padlock.' How does a Principal Embedded Systems Architect evaluate and reject this proposal?",
      "options": [
        "Agree because Linux is easy to program.",
        "Rigorous Architectural Trade-Off Analysis: Linux requires 500MB of RAM, draws ~300mA continuously (draining padlock batteries in 6 hours), takes 20 seconds to boot when waking from sleep, and has non-deterministic interrupt latency. An ultra-low power ARM Cortex-M0+ MCU with a dedicated BLE radio draws < 15 microamps in sleep, boots in 5 milliseconds, costs $1.20 (vs $35 for Raspberry Pi), and operates for 3 years on two AAA batteries!",
        "Suggest Windows instead.",
        "Padlocks do not need microcontrollers."
      ],
      "answerIdx": 1,
      "debrief": "Principal technical leadership requires selecting the right compute tool for the job. Embedded Linux is fantastic for complex graphical displays and high-speed networking, but catastrophic for ultra-low power battery-operated edge devices where microcontrollers reign supreme."
    },
    "quests": [
      {
        "id": "iot-m2-d59-q1",
        "name": "Bare-Metal vs RTOS vs Embedded Linux Quantitative Decision Matrix",
        "type": "concept",
        "desc": "Build an analytical scoring framework evaluating boot time, RAM footprint, battery life, scheduling jitter, and development cost."
      },
      {
        "id": "iot-m2-d59-q2",
        "name": "BOM Cost Sensitivity & Silicon Trade-Off Profiler",
        "type": "detective",
        "desc": "Calculate total cost of ownership (TCO) across 1M units comparing internal flash MCUs with external QSPI flash + DRAM topologies."
      },
      {
        "id": "iot-m2-d59-q3",
        "name": "Principal Firmware Architecture RFC Document",
        "type": "mastery",
        "desc": "Author a production-ready RFC specifying silicon MCU selection, RTOS scheduling model, memory map, and functional safety plans."
      },
      {
        "id": "iot-m2-d59-q4",
        "name": "RFC Architecture Review Board Defense",
        "type": "incident",
        "desc": "Defend your RFC before an adversarial Architecture Review Board, justifying MCU clock speeds, memory limits, and safety invariants."
      }
    ]
  },
  {
    "day": 60,
    "month": 2,
    "blockNum": 12,
    "title": "Master Capstone: ApexFirmware Globally Distributed Sovereign Industrial IoT & Embedded RTOS Platform Master Capstone Viva Gate",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Grand Master Capstone & Viva Voce (Comprehensive Embedded & IoT Defense)",
    "spokenGoal": "The Grand Master Capstone and Final Viva Voce Gate: stand before the Senior Principal Embedded Architecture Panel to present, demonstrate, and defend ApexFirmware. Demonstrate the complete synthesis of all 60 days of embedded systems engineering: bare-metal 168MHz clock generation, atomic BSRR GPIO drivers, zero-copy circular DMA ping-pong streaming, multi-protocol UART/SPI/I2C/CAN buses, FreeRTOS preemptive multitasking with priority-inheritance mutexes, 100% static allocation, tickless low-power sleep, wireless BLE/Thread/Wi-Fi/LoRaWAN integration, Modbus-to-MQTT telemetry, cryptographic secure bootloader with ECDSA and anti-rollback eFuses, zero-brick dual-bank FOTA with delta compression, 6-DOF Madgwick sensor fusion with CMSIS-DSP FFTs, and fail-safe safety redundancy under live chaos and electrical fault injection.",
    "conceptInvariant": "Master Embedded & IoT Synthesis Invariant: An industrial embedded IoT platform must guarantee deterministic real-time control (< 2us jitter), zero memory fragmentation, cryptographic silicon security, autonomous zero-brick remote updates, and self-healing recovery from electrical glitches and network outages without human intervention.",
    "failureMode": "Failing the viva defense when the panel injects simultaneous electrical power sag, 2.4GHz RF jamming, and corrupted FOTA packets, and the candidate cannot explain where hardware fault registers were checked or why their watchdog kicked during a simulated task deadlock.",
    "tryItFriction": "Deliver the live end-to-end demonstration and viva defense: execute real-time 1kHz control under maximum DMA and wireless telemetry load; inject power rail sags to demonstrate brownout tolerance; trigger an over-the-air firmware update with simulated packet corruption; and defend your architectural choices under grueling panel cross-examination.",
    "socraticHints": [
      "What is the ultimate mark of a Master Embedded Systems Architect?",
      "The complete mastery of the boundary between software and physical reality: understanding how every line of C code translates into electrons moving through silicon gates, register bits, bus wires, and radio waves!",
      "A true master designs firmware that bends to the laws of physical hardware without ever breaking."
    ],
    "situationalPuzzle": {
      "scenario": "During your final Master Viva defense, the examiner panel executes three simultaneous attacks: 1) Shorts the I2C sensor bus; 2) Injects a 50-nanosecond voltage brownout dip on VDD; 3) Pushes a corrupted FOTA update over the air. How does ApexFirmware survive without bricking, freezing, or losing control of the motor?",
      "options": [
        "The system crashes and reboots infinitely.",
        "Comprehensive Hardware & Firmware Resilience: 1) The I2C driver times out in 5ms and triggers 9-clock bus recovery; 2) Bulk decoupling capacitors absorb the voltage dip while the Brownout Reset supervisor maintains logic levels; 3) The FOTA engine rejects the corrupted binary via SHA-256 digest mismatch in Slot 1; 4) The 1kHz real-time motor control loop continues running with zero jitter throughout the entire attack.",
        "The board melts.",
        "All flash memory is cleared."
      ],
      "answerIdx": 1,
      "debrief": "This is the pinnacle of embedded engineering. When silicon-level hardware drivers, defensive communication protocols, real-time preemptive RTOS kernels, cryptographic bootloaders, and electrical circuit protections are designed in perfect harmony, the embedded system is unyielding to any physical or digital disturbance."
    },
    "quests": [
      {
        "id": "iot-m2-d60-q1",
        "name": "ApexFirmware Sovereign Embedded Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive multi-tier architectural blueprint detailing silicon boot vectors, DMA streams, RTOS tasks, and cryptographic trust chains."
      },
      {
        "id": "iot-m2-d60-q2",
        "name": "Embedded Security, Safety & MISRA-C Penetration Audit",
        "type": "detective",
        "desc": "Execute an automated penetration and static analysis audit verifying 100% MISRA-C compliance, zero buffer overflows, and locked JTAG RDP Level 2."
      },
      {
        "id": "iot-m2-d60-q3",
        "name": "ApexFirmware Industrial IoT & RTOS Platform Build",
        "type": "mastery",
        "desc": "Deploy and verify the complete working platform integrating bare-metal drivers, FreeRTOS tasks, multi-radio telemetry, and secure bootloaders."
      },
      {
        "id": "iot-m2-d60-q4",
        "name": "Grand Master Capstone Viva Voce & Live Hardware Chaos Defense",
        "type": "incident",
        "desc": "Defend the entire 60-day embedded and IoT architecture before the Senior Principal Panel under live physical chaos injection and oral cross-examination."
      }
    ]
  }
];
