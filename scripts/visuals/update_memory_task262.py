# scripts/visuals/update_memory_task262.py
# Appends TASK-262 to PROJECT_MEMORY.md and agent_tasks.csv

import csv
from datetime import datetime

task_desc = """
### Milestone: Architect IoT, Firmware & Embedded Systems 60-Day Masterclass (240 Quests) & Expand PDF to Part XVIII (TASK-262)
- **Course Blueprint (course-iot-embedded / Catalog Track 14, Days 1-60 / 240 Quests):**
  - Authored scripts/visuals/iot_spec_m1.py, iot_spec_m1_rest.py, iot_spec_m2_part1.py, iot_spec_m2_part2.py, assemble_iot_spec.py, and iot-masterclass-spec.ts (287 KB).
  - **Month 1 (Days 1-30 / 120 Quests): Silicon Anatomy, MMIO Registers, Buses, DMA, Timers & NanoRTOS Kernel Capstone:**
    - Silicon Anatomy: Harvard Architecture, 4GB Memory Maps & Linker Scripts (.ld), Memory-Mapped I/O Registers: Volatile Keyword & Compiler Optimization Physics, Atomic Register Operations: BSRR vs ODR & Bit-Banding Physics, Clock Trees & Reset Control (RCC): PLL Multipliers, Prescalers & Flash Wait States, Milestone 1: Bare-Metal Memory-Mapped GPIO Driver & Clock Controller Engine, Universal Asynchronous Receiver-Transmitter (UART): Baud Rates, Oversampling & Line Noise, Serial Peripheral Interface (SPI): Synchronous Shift Registers, CPOL, CPHA & High-Speed Clocks, Inter-Integrated Circuit (I2C): Open-Drain Buses, Pull-Ups, Start/Stop & Clock Stretching, Controller Area Network (CAN Bus): Differential Signaling, Arbitration & CRC Framing, Milestone 2: Multi-Protocol Hardware Bus Engine (Zero-Drop UART/SPI/I2C Transceiver), Nested Vectored Interrupt Controller (NVIC): Vector Tables, Priority Grouping & Preemption, Interrupt Service Routines (ISRs): Latency Budgets, Tail-Chaining & Late-Arrival Physics, SysTick System Timer & Hardware Timers: Prescalers, ARR & PWM Generation, Analog-to-Digital Conversion (ADC) & DAC: Successive Approximation (SAR) & Nyquist Limits, Milestone 3: Real-Time Interrupt-Driven Data Acquisition Engine, Direct Memory Access (DMA) Controller: Streams, Channels & Bus Matrix Arbitration, Circular DMA & Ping-Pong Buffers: Half-Transfer (HT) & Transfer-Complete (TC) Zero-Copy Streaming, Cache Coherency & Memory Barriers: D-Cache Invalidation & Clean Operations, Hardware Watchdog Timers: Independent Watchdog (IWDG), Window Watchdog (WWDG) & Anti-Freeze Fail-Safes, Milestone 4: Zero-CPU DMA Streaming Ring Buffer & Fail-Safe Watchdog Engine, Real-Time Operating System (RTOS) Physics: Hard vs Soft RTOS, Task Control Blocks & Stacks, Preemptive Scheduling & Context Switching: PendSV Exception, SysTick & Assembly Stack Swapping, Task Synchronization: Semaphores, Mutexes & Priority Inversion (The Mars Pathfinder Incident), Inter-Task Communication: FreeRTOS Queues, Direct-to-Task Notifications & Event Groups, Milestone 5: Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine, RTOS Dynamic Memory Allocation: heap_1 through heap_5, Fragmentation & Static Allocation, Software Timers & Idle Task Hook: Watchdog Kicking & Tickless Low-Power Mode (WFI/WFE), MISRA-C & ISO 26262 Coding Standards: Static Analysis & Undefined Behavior Elimination, Production Hardware Debugging: SWD/JTAG Protocols, Fault Handlers & Core Dump Forensics, and NanoRTOS Preemptive Kernel & Multitasking Firmware Engine Capstone Viva Gate.
  - **Month 2 (Days 31-60 / 120 Quests): Wireless IoT Networks, Cloud Telemetry, Secure Boot, FOTA, Edge Sensors & ApexFirmware Master Capstone:**
    - Bluetooth Low Energy (BLE): GAP/GATT Profiles, Services, Characteristics & Advertising Physics, Embedded Wi-Fi & TCP/IP Sockets: Station vs SoftAP, LwIP Stack & Embedded TLS Physics, Sub-GHz Long Range (LoRa & LoRaWAN): Chirp Spread Spectrum, Spreading Factors & Link Budgets, IEEE 802.15.4 Mesh Networks: Zigbee, Thread, Sleepy End Devices & Matter Protocol, Milestone 6: Low-Power Multi-Radio Wireless Mesh Gateway Engine, MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees & Last Will and Testament, Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages & The Observe Pattern, Modbus RTU & Modbus TCP: Master-Slave Polling, Holding Registers & RS-485 Differential Transceivers, Compact Binary Serialization: Protocol Buffers (NanoPB), CBOR & MessagePack, Milestone 7: Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge, Hardware Roots of Trust (RoT): Physical Unclonable Functions (PUF) & Secure Elements (ATECC608), Embedded Cryptography: AES-128/256-GCM, SHA-256 & Curve25519 Math on Cortex-M, Secure Boot Architecture: Multi-Stage Bootloaders, ECDSA Signatures & Anti-Rollback eFuses, Flash Memory Architecture: Wear Leveling, LittleFS & Power-Loss Recovery, Milestone 8: Cryptographic Secure Bootloader & Authenticated Firmware Verifier Engine, Firmware-Over-The-Air (FOTA) Topologies: Dual-Bank Flash, Slot Swapping & Partition Maps, Delta Updates & Binary Differential Compression: BSDiff & Courgette Algorithms, Resilient Recovery & Watchdog Rollbacks: Self-Testing Firmware & Golden Image Safety, Large-Scale Fleet Management: Canary Deployments, Telemetry Reports & Dead Device Recovery, Milestone 9: Zero-Brick Dual-Bank FOTA Firmware Update Engine, Inertial Measurement Units (IMU): 6-DOF Accelerometers, Gyroscopes & Sensor Physics, Digital Signal Processing (DSP): FIR/IIR Filters, CMSIS-DSP Vector Math & FFTs, Sensor Fusion Algorithms: Complementary Filter vs Extended Kalman Filter (EKF), 3 AM Hardware War Room Simulation: Brownouts, Ground Loops, Decoupling & EMI Jitter, Milestone 10: Real-Time 6-DOF Sensor Fusion & DSP Anomaly Detection Engine, Functional Safety & Redundancy: 1oo2 / 2oo3 Voting Architectures, Dual-Core Lockstep & SIL-3, Real-World Architecture Deep Dive: Medical Infusion Pump Firmware, Real-World Architecture Deep Dive: Connected Electric Vehicle Battery Management System (BMS), Principal Embedded Systems Engineer RFC: Firmware Architectural Justification, and ApexFirmware Globally Distributed Sovereign Industrial IoT & Embedded RTOS Platform Master Capstone Viva Gate.
- **Master PDF Integration & Verification:**
  - Integrated as **Part XVIII** into scripts/visuals/compile-500p-srs-pdf.mts.
  - Recompiled docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.pdf with **10.42 MB HTML DOM** (14.35 MB PDF) with exit code 0.
  - Total Courses fully specified and compiled: **14 of 37 Courses (3,342 Quests total across 840 Days)**!
"""

mem_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(mem_path, "a", encoding="utf-8") as f:
    f.write(task_desc)

print("PROJECT_MEMORY.md updated successfully with TASK-262.")

tasks_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_row = [
    "TASK-262",
    "Architect Course 14 (IoT, Firmware & Embedded) 60-Day Masterclass (240 Quests) & Expand PDF to Part XVIII",
    "Completed",
    "Antigravity",
    now_str,
    now_str,
    "course-iot-embedded specs complete (240 quests), compiled Part XVIII into Master PDF (10.42 MB DOM, 3,342 total quests across 14 courses)."
]

with open(tasks_csv_path, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(new_row)

print("agent_tasks.csv updated successfully with TASK-262.")
