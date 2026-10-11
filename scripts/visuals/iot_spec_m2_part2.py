# scripts/visuals/iot_spec_m2_part2.py
# Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded)
# Month 2: Days 46-60 (Blocks 10-12) - 60 Quests Total

IOT_M2_PART2 = [
  # =========================================================================
  # BLOCK 10: FIRMWARE-OVER-THE-AIR (FOTA) & ZERO-BRICK FLEET UPDATES (Days 46-50)
  # =========================================================================
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
      "debrief": "Canary monitoring is not just about crashes—it is about battery, memory, and network telemetry. Detecting an anomalous battery drain or memory climb on a 1% canary cohort prevents catastrophic multi-million-dollar fleet battery replacement disasters."
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

  # =========================================================================
  # BLOCK 11: EDGE SENSOR FUSION, DIGITAL SIGNAL PROCESSING (DSP) & 3 AM HARDWARE TRIAGE (Days 51-55)
  # =========================================================================
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

  # =========================================================================
  # BLOCK 12: INDUSTRIAL SAFETY SYSTEMS, STAFF FIRMWARE ARCHITECTURE RFC & FINAL MASTER CAPSTONE (Days 56-60)
  # =========================================================================
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
      "scenario": "An electric vehicle is DC fast-charging at 150kW. The BMS monitors 96 battery cells. Cell 42 temperature suddenly spikes from 35°C to 65°C, while its voltage drops from 4.1V to 3.6V. All other 95 cells remain at 35°C. What catastrophic battery phenomenon has begun, and what must the BMS firmware execute immediately?",
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
]
