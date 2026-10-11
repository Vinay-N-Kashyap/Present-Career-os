# scripts/visuals/patch_compiler_iot.py
# Inserts Course 14 (IoT, Firmware & Embedded Systems) as Part XVIII into compile-500p-srs-pdf.mts

with open("scripts/visuals/compile-500p-srs-pdf.mts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import
old_import = "import { FULLSTACK_MONTH_1_SPECS, FULLSTACK_MONTH_2_SPECS } from './fullstack-masterclass-spec';"
new_import = """import { FULLSTACK_MONTH_1_SPECS, FULLSTACK_MONTH_2_SPECS } from './fullstack-masterclass-spec';
import { IOT_MONTH_1_SPECS, IOT_MONTH_2_SPECS } from './iot-masterclass-spec';"""

if old_import not in content:
    raise Exception("Could not find Fullstack import in compiler")

content = content.replace(old_import, new_import, 1)

# 2. Add renderIoTDayCard function
render_fn = """
function renderIoTDayCard(day: any): string {
  const questsHtml = day.quests.map((q: any) => `
    <div style="margin-bottom: 2px;">
      <span style="font-family: monospace; font-size: 6.8pt; background: #f1f5f9; padding: 1px 3px; border-radius: 2px;">${q.id}</span>
      <strong>${q.name}</strong> <em>(${q.type})</em>: <span style="color: #475569;">${q.desc}</span>
    </div>
  `).join('');

  return `
    <div class="daily-card" style="margin-bottom: 10pt; page-break-inside: avoid; border-left: 3px solid #c2410c;">
      <div class="daily-card-header">
        <div>
          <span style="background: #c2410c; color: #ffffff; font-size: 7.5pt; font-weight: 700; padding: 1px 5px; border-radius: 2px;">Day ${day.day}</span>
          <strong style="margin-left: 6pt; font-size: 8.8pt; color: #0f172a;">${day.title}</strong>
          <span class="stage-pill" style="background: #ffedd5; color: #9a3412;">${day.stageName}</span>
        </div>
        <span style="font-size: 7.2pt; color: #64748b;">Month ${day.month} &bull; Block ${day.blockNum} &bull; <strong>${day.quests.length} Quests</strong></span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5pt; margin-bottom: 4pt; font-size: 7.2pt;">
        <div style="background: #f8fafc; padding: 4pt 6pt; border-radius: 3px; border: 1px solid #e2e8f0;">
          <strong>🎯 Spoken Goal &amp; Invariant:</strong><br>
          <span style="color: #c2410c; font-weight: 600;">Goal:</span> ${day.spokenGoal}<br>
          <span style="color: #9a3412; font-weight: 600;">Invariant:</span> <code>${day.conceptInvariant}</code>
        </div>
        <div style="background: #fef2f2; padding: 4pt 6pt; border-radius: 3px; border: 1px solid #fecaca; color: #991b1b;">
          <strong>⚠️ Failure Mode &amp; tryIt Bug:</strong><br>
          <strong>Failure:</strong> ${day.failureMode}<br>
          <strong>tryIt Friction:</strong> ${day.tryItFriction}
        </div>
      </div>

      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 3px; padding: 3pt 6pt; margin-bottom: 4pt; font-size: 7.0pt;">
        <strong style="color: #9a3412;">🪜 3-Tier Socratic Hint Ladder:</strong>
        <span style="color: #c2410c;">[1. Nudge: "${day.socraticHints[0]}"]</span> &rarr;
        <span style="color: #b45309;">[2. Memory: "${day.socraticHints[1]}"]</span> &rarr;
        <span style="color: #15803d;">[3. Fix: "${day.socraticHints[2]}"]</span>
      </div>

      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 3px; padding: 3pt 6pt; margin-bottom: 4pt; font-size: 7.0pt;">
        <strong style="color: #b45309;">🧩 Situational Diagnostic Puzzle:</strong>
        <em>"${day.situationalPuzzle.scenario}"</em><br>
        <strong>Correct:</strong> Option ${String.fromCharCode(65 + day.situationalPuzzle.answerIdx)}) ${day.situationalPuzzle.options[day.situationalPuzzle.answerIdx]} &bull;
        <span style="color: #92400e;"><strong>Debrief:</strong> ${day.situationalPuzzle.debrief}</span>
      </div>

      <div style="border-top: 1px dashed #cbd5e1; padding-top: 3pt; font-size: 7.1pt;">
        <strong style="color: #334155;">Quests Scheduled for Day ${day.day} (${day.quests.length} Quests):</strong>
        <div style="margin-top: 2pt;">
          ${questsHtml}
        </div>
      </div>
    </div>
  `;
}
"""

anchor_renderer = "function renderFullStackDayCard(day: any): string {"
if anchor_renderer not in content:
    raise Exception("Could not find renderFullStackDayCard in compiler")

content = content.replace(anchor_renderer, render_fn + "\n" + anchor_renderer, 1)

# 3. Add Part XVIII HTML block before return h; at end of buildDeepMasterclassesHtml()
part_xviii = """
  <!-- PART XVIII: DEEP MASTERCLASS BLUEPRINT - IOT, FIRMWARE & EMBEDDED SYSTEMS (DAYS 1-60 / 240 QUESTS) -->
  <div class="page-break">
    <div style="background: #431407; color: #ffffff; padding: 8pt 12pt; border-radius: 4pt; margin-bottom: 8pt; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="color: #ffffff; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XVIII: Deep Masterclass Blueprint — IoT, Firmware &amp; Embedded Systems</h1>
        <span style="font-size: 8.2pt; color: #fed7aa;">Course ID: <code>course-iot-embedded</code> &bull; 60-Day Full Curriculum (Days 1-60) &bull; <strong>240 Total Quests</strong></span>
      </div>
      <div style="text-align: right;">
        <span style="background: #c2410c; color: #ffffff; font-size: 7.5pt; font-weight: 700; padding: 2px 6px; border-radius: 2px;">True 9.8 Standard</span><br>
        <span style="font-size: 7.5pt; color: #fdba74;">Month 1 (120 Quests) &bull; Month 2 (120 Quests)</span>
      </div>
    </div>

    <h2>18.1 Course Architectural Overview &amp; 4-Stage Pedagogical Progression</h2>
    <p>
      Embedded systems engineering represents the purest union of software algorithms and physical silicon physics. Unlike abstract web development, firmware operates in direct contact with electrons, memory-mapped registers, clock trees, interrupt controllers, and real-time physical constraints. In PinIT Career OS, <strong>Course 14: IoT, Firmware &amp; Embedded Systems</strong> elevates students into Principal Embedded Systems and Firmware Architects across 60 intensive days:
    </p>
    <div class="quote-box" style="border-left-color: #c2410c;">
      &bull; <strong>Month 1 (Days 1–30 &bull; 120 Quests): Silicon Anatomy, MMIO Registers, Buses, DMA, Timers &amp; NanoRTOS Kernel Capstone:</strong><br>
      Silicon Anatomy: Harvard Architecture, 4GB Memory Maps &amp; Linker Scripts (.ld), Memory-Mapped I/O Registers: Volatile Keyword &amp; Compiler Optimization Physics, Atomic Register Operations: BSRR vs ODR &amp; Bit-Banding Physics, Clock Trees &amp; Reset Control (RCC): PLL Multipliers, Prescalers &amp; Flash Wait States, <strong>Milestone 1: Bare-Metal Memory-Mapped GPIO Driver &amp; Clock Controller Engine</strong>, Universal Asynchronous Receiver-Transmitter (UART): Baud Rates, Oversampling &amp; Line Noise, Serial Peripheral Interface (SPI): Synchronous Shift Registers, CPOL, CPHA &amp; High-Speed Clocks, Inter-Integrated Circuit (I2C): Open-Drain Buses, Pull-Ups, Start/Stop &amp; Clock Stretching, Controller Area Network (CAN Bus): Differential Signaling, Arbitration &amp; CRC Framing, <strong>Milestone 2: Multi-Protocol Hardware Bus Engine (Zero-Drop UART/SPI/I2C Transceiver)</strong>, Nested Vectored Interrupt Controller (NVIC): Vector Tables, Priority Grouping &amp; Preemption, Interrupt Service Routines (ISRs): Latency Budgets, Tail-Chaining &amp; Late-Arrival Physics, SysTick System Timer &amp; Hardware Timers: Prescalers, ARR &amp; PWM Generation, Analog-to-Digital Conversion (ADC) &amp; DAC: Successive Approximation (SAR) &amp; Nyquist Limits, <strong>Milestone 3: Real-Time Interrupt-Driven Data Acquisition Engine</strong>, Direct Memory Access (DMA) Controller: Streams, Channels &amp; Bus Matrix Arbitration, Circular DMA &amp; Ping-Pong Buffers: Half-Transfer (HT) &amp; Transfer-Complete (TC) Zero-Copy Streaming, Cache Coherency &amp; Memory Barriers: D-Cache Invalidation &amp; Clean Operations, Hardware Watchdog Timers: Independent Watchdog (IWDG), Window Watchdog (WWDG) &amp; Anti-Freeze Fail-Safes, <strong>Milestone 4: Zero-CPU DMA Streaming Ring Buffer &amp; Fail-Safe Watchdog Engine</strong>, Real-Time Operating System (RTOS) Physics: Hard vs Soft RTOS, Task Control Blocks &amp; Stacks, Preemptive Scheduling &amp; Context Switching: PendSV Exception, SysTick &amp; Assembly Stack Swapping, Task Synchronization: Semaphores, Mutexes &amp; Priority Inversion (The Mars Pathfinder Incident), Inter-Task Communication: FreeRTOS Queues, Direct-to-Task Notifications &amp; Event Groups, <strong>Milestone 5: Preemptive RTOS Kernel &amp; Priority-Inheritance Task Manager Engine</strong>, RTOS Dynamic Memory Allocation: heap_1 through heap_5, Fragmentation &amp; Static Allocation, Software Timers &amp; Idle Task Hook: Watchdog Kicking &amp; Tickless Low-Power Mode (WFI/WFE), MISRA-C &amp; ISO 26262 Coding Standards: Static Analysis &amp; Undefined Behavior Elimination, Production Hardware Debugging: SWD/JTAG Protocols, Fault Handlers &amp; Core Dump Forensics, and the <strong>NanoRTOS Preemptive Kernel &amp; Multitasking Firmware Engine Capstone Viva Gate</strong>.<br><br>
      &bull; <strong>Month 2 (Days 31–60 &bull; 120 Quests): Wireless IoT Networks, Cloud Telemetry, Secure Boot, FOTA, Edge Sensors &amp; ApexFirmware Master Capstone:</strong><br>
      Bluetooth Low Energy (BLE): GAP/GATT Profiles, Services, Characteristics &amp; Advertising Physics, Embedded Wi-Fi &amp; TCP/IP Sockets: Station vs SoftAP, LwIP Stack &amp; Embedded TLS Physics, Sub-GHz Long Range (LoRa &amp; LoRaWAN): Chirp Spread Spectrum, Spreading Factors &amp; Link Budgets, IEEE 802.15.4 Mesh Networks: Zigbee, Thread, Sleepy End Devices &amp; Matter Protocol, <strong>Milestone 6: Low-Power Multi-Radio Wireless Mesh Gateway Engine</strong>, MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees &amp; Last Will and Testament, Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages &amp; The Observe Pattern, Modbus RTU &amp; Modbus TCP: Master-Slave Polling, Holding Registers &amp; RS-485 Differential Transceivers, Compact Binary Serialization: Protocol Buffers (NanoPB), CBOR &amp; MessagePack, <strong>Milestone 7: Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge</strong>, Hardware Roots of Trust (RoT): Physical Unclonable Functions (PUF) &amp; Secure Elements (ATECC608), Embedded Cryptography: AES-128/256-GCM, SHA-256 &amp; Curve25519 Math on Cortex-M, Secure Boot Architecture: Multi-Stage Bootloaders, ECDSA Signatures &amp; Anti-Rollback eFuses, Flash Memory Architecture: Wear Leveling, LittleFS &amp; Power-Loss Recovery, <strong>Milestone 8: Cryptographic Secure Bootloader &amp; Authenticated Firmware Verifier Engine</strong>, Firmware-Over-The-Air (FOTA) Topologies: Dual-Bank Flash, Slot Swapping &amp; Partition Maps, Delta Updates &amp; Binary Differential Compression: BSDiff &amp; Courgette Algorithms, Resilient Recovery &amp; Watchdog Rollbacks: Self-Testing Firmware &amp; Golden Image Safety, Large-Scale Fleet Management: Canary Deployments, Telemetry Reports &amp; Dead Device Recovery, <strong>Milestone 9: Zero-Brick Dual-Bank FOTA Firmware Update Engine</strong>, Inertial Measurement Units (IMU): 6-DOF Accelerometers, Gyroscopes &amp; Sensor Physics, Digital Signal Processing (DSP): FIR/IIR Filters, CMSIS-DSP Vector Math &amp; FFTs, Sensor Fusion Algorithms: Complementary Filter vs Extended Kalman Filter (EKF), 3 AM Hardware War Room Simulation: Brownouts, Ground Loops, Decoupling &amp; EMI Jitter, <strong>Milestone 10: Real-Time 6-DOF Sensor Fusion &amp; DSP Anomaly Detection Engine</strong>, Functional Safety &amp; Redundancy: 1oo2 / 2oo3 Voting Architectures, Dual-Core Lockstep &amp; SIL-3, Real-World Architecture Deep Dive: Medical Infusion Pump Firmware, Real-World Architecture Deep Dive: Connected Electric Vehicle Battery Management System (BMS), Principal Embedded Systems Engineer RFC: Firmware Architectural Justification, and the <strong>ApexFirmware Globally Distributed Sovereign Industrial IoT &amp; Embedded RTOS Platform Master Capstone Viva Gate</strong>.
    </div>

    <h2>18.2 IoT, Firmware &amp; Embedded Systems Month 1 Day-by-Day Masterclass Specifications (Days 1–30 / 120 Quests)</h2>
  </div>
  `;

  IOT_MONTH_1_SPECS.forEach((day: any) => {
    h += renderIoTDayCard(day);
  });

  h += `
  <div class="page-break">
    <div style="background: #431407; color: #ffffff; padding: 8pt 12pt; border-radius: 4pt; margin-bottom: 8pt; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="color: #ffffff; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XVIII: IoT &amp; Embedded Month 2 — Wireless Networks, Cloud Telemetry, Secure Boot, FOTA &amp; ApexFirmware Master Capstone</h1>
        <span style="font-size: 8.2pt; color: #fed7aa;">Course ID: <code>course-iot-embedded</code> &bull; Days 31-60 &bull; <strong>120 Advanced Quests</strong></span>
      </div>
      <div style="text-align: right;">
        <span style="background: #c2410c; color: #ffffff; font-size: 7.5pt; font-weight: 700; padding: 2px 6px; border-radius: 2px;">Advanced Firmware Systems</span><br>
        <span style="font-size: 7.5pt; color: #fdba74;">Staff Firmware Architect Target</span>
      </div>
    </div>

    <h2>18.3 IoT, Firmware &amp; Embedded Systems Month 2 Day-by-Day Masterclass Specifications (Days 31–60 / 120 Quests)</h2>
  </div>
  `;

  IOT_MONTH_2_SPECS.forEach((day: any) => {
    h += renderIoTDayCard(day);
  });

  h += `
  <div class="page-break"></div>
  <h2>18.4 IoT, Firmware &amp; Embedded Systems Milestone &amp; Capstone Viva Gates (Milestones 1–10 + Capstone Viva)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 12%;">Milestone</th>
        <th style="width: 10%;">Day</th>
        <th style="width: 28%;">Milestone Gate Title</th>
        <th style="width: 50%;">Architectural Deliverable &amp; Invariant Defense</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>Milestone 1</strong></td><td>Day 05</td><td>Bare-Metal Memory-Mapped GPIO Driver &amp; Clock Controller</td><td>Zero-HAL C driver with PLL clock configuration, Flash wait-state sequencing, and atomic BSRR pin manipulation.</td></tr>
      <tr><td><strong>Milestone 2</strong></td><td>Day 10</td><td>Multi-Protocol Hardware Bus Engine (UART/SPI/I2C)</td><td>Non-blocking serial communications transceiver with ring-buffered UART, high-speed SPI Flash, and self-healing I2C.</td></tr>
      <tr><td><strong>Milestone 3</strong></td><td>Day 15</td><td>Real-Time Interrupt-Driven Data Acquisition Engine</td><td>Precision measurement system with hardware TRGO timer triggering, double-buffered EOC ADC queues, and PWM feedback.</td></tr>
      <tr><td><strong>Milestone 4</strong></td><td>Day 20</td><td>Zero-CPU DMA Streaming Ring Buffer &amp; Fail-Safe Watchdog</td><td>High-throughput circular DMA ping-pong streaming pipeline with cache maintenance and multi-task watchdog supervision.</td></tr>
      <tr><td><strong>Milestone 5</strong></td><td>Day 25</td><td>Preemptive RTOS Kernel &amp; Priority-Inheritance Task Manager</td><td>Multitasking FreeRTOS firmware platform with priority inheritance mutexes, queue pipelines, and < 2us task jitter.</td></tr>
      <tr><td><strong>Capstone 1</strong></td><td>Day 30</td><td><strong>Month 1 Capstone Viva Gate</strong></td><td><strong>NanoRTOS Preemptive Kernel &amp; Multitasking Firmware Engine:</strong> Complete embedded platform uniting bare-metal drivers, DMA, FreeRTOS, static memory, and oral defense before Senior Embedded Architects.</td></tr>
      <tr><td><strong>Milestone 6</strong></td><td>Day 35</td><td>Low-Power Multi-Radio Wireless Mesh Gateway Engine</td><td>Dual-radio gateway bridging BLE 5.0 and Thread to Wi-Fi/LoRaWAN with hardware packet traffic arbitration (PTA).</td></tr>
      <tr><td><strong>Milestone 7</strong></td><td>Day 40</td><td>Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge</td><td>Industrial gateway polling RS-485 Modbus RTU slaves, serializing NanoPB envelopes, and streaming TLS MQTT with QoS 1.</td></tr>
      <tr><td><strong>Milestone 8</strong></td><td>Day 45</td><td>Cryptographic Secure Bootloader &amp; Authenticated Verifier</td><td>Two-stage bootloader with SHA-256 hashing, ECDSA P-256 digital signatures, anti-rollback eFuses, and safe VTOR jumping.</td></tr>
      <tr><td><strong>Milestone 9</strong></td><td>Day 50</td><td>Zero-Brick Dual-Bank FOTA Firmware Update Engine</td><td>Remote firmware lifecycle engine with chunked streaming, dual-bank hardware swap, trial boot states, and automated rollback.</td></tr>
      <tr><td><strong>Milestone 10</strong></td><td>Day 55</td><td>Real-Time 6-DOF Sensor Fusion &amp; DSP Anomaly Engine</td><td>Edge DSP pipeline integrating 1kHz IMU sampling, Madgwick quaternion attitude tracking, and CMSIS-DSP 1024-point FFTs.</td></tr>
      <tr><td><strong>Master Capstone</strong></td><td>Day 60</td><td><strong>Month 2 Master Capstone Viva</strong></td><td><strong>ApexFirmware Globally Distributed Sovereign Industrial IoT &amp; Embedded RTOS Platform:</strong> Complete embedded IoT ecosystem uniting real-time control, FreeRTOS, wireless mesh, secure boot, FOTA, and live chaos defense before Faculty Review Board.</td></tr>
    </tbody>
  </table>
  `;
"""

# Place part_xviii right before `return h;` in buildDeepMasterclassesHtml()
# Let's locate the return h; right after 17.4 table
anchor_fullstack_table = "ApexCommerce Globally Distributed Omnichannel Full-Stack Enterprise Platform"
pos_fs = content.find(anchor_fullstack_table)
if pos_fs == -1:
    raise Exception("Could not find ApexCommerce table anchor in compiler")

pos_return = content.find("return h;", pos_fs)
if pos_return == -1:
    raise Exception("Could not find return h; after Fullstack section")

content = content[:pos_return] + part_xviii + "\n  " + content[pos_return:]

with open("scripts/visuals/compile-500p-srs-pdf.mts", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully patched compile-500p-srs-pdf.mts with Part XVIII!")
