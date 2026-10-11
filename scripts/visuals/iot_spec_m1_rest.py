# scripts/visuals/iot_spec_m1_rest.py
# Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded)
# Month 1: Days 16-30 (Blocks 4-6) - 60 Quests Total

IOT_M1_PART2 = [
  # =========================================================================
  # BLOCK 4: DIRECT MEMORY ACCESS (DMA) & ZERO-CPU HARDWARE OFFLOADING (Days 16-20)
  # =========================================================================
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

  # =========================================================================
  # BLOCK 5: FREERTOS KERNEL INTERNALS: TASKS, SCHEDULER & CONTEXT SWITCHING (Days 21-25)
  # =========================================================================
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

  # =========================================================================
  # BLOCK 6: MEMORY ALLOCATION, MISRA-C GUIDELINES & MONTH 1 CAPSTONE (Days 26-30)
  # =========================================================================
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
]
