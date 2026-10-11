# scripts/visuals/iot_spec_m1.py
# Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded)
# Month 1: Days 1-15 (Blocks 1-3) - 60 Quests Total

IOT_M1_PART1 = [
  # =========================================================================
  # BLOCK 1: SILICON ANATOMY, ARM CORTEX-M ARCHITECTURE & MMIO REGISTERS (Days 1-5)
  # =========================================================================
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

  # =========================================================================
  # BLOCK 2: HARDWARE COMMUNICATION BUSES & PROTOCOLS (UART, SPI, I2C, CAN) (Days 6-10)
  # =========================================================================
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
      "scenario": "A firmware team deploys an IoT sensor connected to a GPS module over UART at 9600 baud. In the lab, it works 100%. In field deployment across winter conditions (-20°C), GPS NMEA sentences arrive garbled with framing errors (FE). The MCU uses its internal RC oscillator (HSI) for the clock source. What caused the winter communication breakdown?",
      "options": [
        "GPS satellites do not transmit in cold weather.",
        "Thermal Oscillator Drift: The internal RC oscillator (HSI) has a thermal frequency drift of up to +/- 5% across industrial temperature ranges (-40°C to +85°C). The cold temperature drifted the MCU bus clock by 3.8%, pushing the UART baud rate divisor beyond the 2.5% asynchronous tolerance limit and corrupting sampling alignment.",
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
        "Waiting for TXE instead of RXNE: The TXE (Transmit Empty) flag indicates only that the byte moved from the data register to the internal shift register—it does NOT mean transmission is complete! To read the incoming byte, software MUST wait for the RXNE (Receive Not Empty) flag, ensuring all 8 clock cycles have finished and the incoming byte is fully latched.",
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
      "scenario": "An industrial temperature monitoring node hangs completely after 3 days of continuous operation. The MCU is stuck in an infinite loop: 'while(I2C->SR2 & I2C_SR2_BUSY);'. Probing the physical bus with an oscilloscope shows SCL is 3.3V (HIGH), but SDA is clamped permanently at 0V (LOW). Resetting the MCU does NOT clear the bus—only power-cycling the whole board restores it. What happened?",
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

  # =========================================================================
  # BLOCK 3: INTERRUPTS, NVIC CONTROLLER & SYSTICK TIMERS (Days 11-15)
  # =========================================================================
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
  }
]
