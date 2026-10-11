# scripts/visuals/iot_security_spec_m2_part1.py
# Month 2, Days 31-45 (Blocks 7-9) for Course 19: Industrial IoT Security & Device Lifecycle (course-iot-security)
# Total Quests: 60 Quests (Days 31-45)

DAYS_31_TO_45 = [
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Secure FOTA Architecture & IETF SUIT Manifest (RFC 9019): CBOR/COSE Signing",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Firmware Lifecycle Pipelines (IETF SUIT RFC 9019, CBOR Containers & COSE Signing)",
    "spokenGoal": "Welcome to Month 2. Today we expand from device identity and provisioning into long-term fleet survival: Secure Firmware Over-The-Air (FOTA) Updates. If a firmware update pipeline is compromised, an attacker doesn't hack one device—they instantly compromise your entire global fleet of 500,000 devices! Enter the IETF SUIT Manifest standard (RFC 9019 - Software Updates for Internet of Things). Deconstruct why proprietary update formats fail: they lack cryptographic dependency modeling and standardized component targeting. SUIT packages updates using CBOR (Concise Binary Object Representation) signed with COSE (CBOR Object Signing and Encryption). Deconstruct the SUIT Manifest structure: 1) Manifest Envelope: COSE_Sign1 detached Ed25519 signature; 2) Common Sequence: target vendor ID (RFC 4122 UUID), class ID, and device precondition checks (battery level > 20%, sufficient free flash sectors); 3) Install Sequence: image fetch URI, cryptographic SHA-256 digest, and flash write destination!",
    "conceptInvariant": "IETF SUIT Cryptographic Precondition Invariant: A FOTA payload must not be written to operational flash sectors until all SUIT manifest preconditions (vendor UUID, class UUID, security counter, battery threshold) and the COSE cryptographic signature have been validated completely in transient scratchpad memory.",
    "failureMode": "Streaming an unauthenticated FOTA payload directly into active flash memory while the network socket is open; packet transmission drops at 50%, leaving a half-written binary that permanently bricks the industrial edge node.",
    "tryItFriction": "Build an IETF SUIT Manifest Parser and Precondition Validator in TypeScript: encode a SUIT manifest in binary CBOR; implement a COSE_Sign1 signature validator using Ed25519; evaluate 4 hardware preconditions (Vendor UUID match, Class UUID match, Battery Level >= 30%, Monotonic Counter >= Current); simulate an update package with a mismatched Vendor UUID; verify that the parser aborts before allocating flash write buffers.",
    "socraticHints": [
      "Why does RFC 9019 mandate checking Vendor UUID and Class UUID before validating the cryptographic signature?",
      "To save battery and CPU cycles! If a firmware update was meant for a Smart Inverter (Class B) but was mistakenly received by a Smart Pump (Class A), checking the UUID aborts immediately!",
      "Evaluating lightweight UUID metadata takes 100 microseconds, whereas expensive asymmetric signature validation takes tens of milliseconds of CPU power!"
    ],
    "situationalPuzzle": {
      "scenario": "An industrial automation vendor manufactures two products using the same STM32 chip: Model A (a factory robot arm) and Model B (a chemical pump). Both products share the same corporate signing key. During an automated OTA campaign, a cloud operator accidentally pushes the Model A firmware binary to Model B pumps. The pumps verify the signature, flash the code, and boot. Because Model A software configures motor GPIO pins differently, the chemical pump drivers short-circuit and burn out. What SUIT manifest field was missing?",
      "options": [
        "The firmware needed a louder audio beep.",
        "SUIT Class ID Hardware Compatibility Assertion: The update package lacked an immutable Class UUID check. Even though the firmware was genuinely signed by the vendor, it was compiled for a completely different hardware electrical pinout! RFC 9019 SUIT manifests enforce explicit `suit-condition-class-id` matching against hardware eFuse class identifiers, preventing cross-product firmware flashing.",
        "Chemical pumps cannot receive FOTA updates.",
        "The Wi-Fi router was out of bandwidth."
      ],
      "answerIdx": 1,
      "debrief": "Cryptographic signature validity does NOT equal hardware compatibility. In large enterprises with multiple products sharing the same root signing infrastructure, a firmware binary signed for Device X can be mistakenly deployed to Device Y. The IETF SUIT manifest standard (RFC 9019) prevents this by binding updates to strict hardware Class UUIDs that the bootloader validates against on-chip silicon identities before committing writes."
    },
    "quests": [
      {
        "num": 1,
        "title": "IETF SUIT RFC 9019 Specification, CBOR & COSE Architecture",
        "type": "Concept",
        "description": "Analyze SUIT manifest grammar, CBOR binary serialization, COSE_Sign1 signature envelopes, and precondition evaluation sequences."
      },
      {
        "num": 2,
        "title": "Cross-Product Firmware Overwrite & GPIO Short-Circuit Detective",
        "type": "Detective Challenge",
        "description": "Investigate a factory equipment burnout incident; prove how lack of Class UUID gating allowed robot firmware to flash over a chemical pump."
      },
      {
        "num": 3,
        "title": "IETF SUIT Manifest Parser & COSE Verifier Engine",
        "type": "Mastery Assignment",
        "description": "Develop an embedded SUIT manifest parser in C / TypeScript with CBOR decoding, Ed25519 COSE verification, and precondition gating."
      },
      {
        "num": 4,
        "title": "Malformed Manifest & Battery Depletion Defense Lab",
        "type": "Production Incident Lab",
        "description": "Simulate pushing 50 corrupted, invalid-class, and low-battery update packages; verify 100% rejection and zero flash corruption."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Asymmetric Signature Verification on Compressed Images: Streaming Hash Chaining",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Memory-Bounded Firmware Verification (Streaming Merkle Hashes & Chunked Validation)",
    "spokenGoal": "A production firmware update for an IoT gateway is 2 megabytes, but your microcontroller has only 64 kilobytes of SRAM! How can you verify an asymmetric Ed25519 signature over a 2 MB binary if you cannot load the entire binary into memory at once? You cannot! If you write unverified chunks directly to execution flash as they arrive over the radio, an attacker can stream 99% of a malicious payload before sending a bad signature, corrupting your active system! Enter Streaming Hash Chaining and Chunked Cryptographic Verification. Deconstruct Merkle Tree Hash Chaining: the binary is split into 4 KB chunks; each chunk is hashed into a leaf node; the root hash is signed in the SUIT manifest. As chunk N arrives over the radio, the bootloader verifies its hash against the manifest BEFORE writing it to the staging flash partition. Alternatively, use Streaming Incremental SHA-256 (`SHA256_Init -> SHA256_Update(chunk) -> SHA256_Final`): assemble the image into a staging slot, stream the hash across flash sectors, and validate the Ed25519 signature over the cumulative digest before any pointer is flipped!",
    "conceptInvariant": "Streaming Cryptographic Digest Integrity Invariant: Firmware images exceeding internal SRAM capacity must be staged in an isolated scratchpad partition while computing an incremental SHA-256 digest across sequential sectors. Final asymmetric signature validation must occur over the completed staged image before committing to bootloader execution records.",
    "failureMode": "Validating the signature on the incoming network stream, but writing chunks directly over the running application partition; network disconnects halfway through, leaving an invalid, non-bootable half-image.",
    "tryItFriction": "Build a Streaming Hash Chaining and Chunked FOTA Verifier in TypeScript: create a 50 KB firmware payload split into 10 chunks of 5 KB; compute an incremental SHA-256 digest as chunks stream in; sign the final digest with Ed25519; simulate an attacker corrupting 1 byte in chunk #7; verify that the incremental verifier detects the integrity violation and aborts staging without touching active execution sectors.",
    "socraticHints": [
      "Why can't we just sign each 4 KB chunk individually with Ed25519?",
      "Because each Ed25519 signature is 64 bytes! Signing 500 individual chunks would add 32 KB of signature overhead to the transmission!",
      "Hashing each chunk and signing only the single cumulative root hash achieves the exact same security with only 64 bytes of total overhead!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart water meter updates firmware over LoRaWAN. The device has 32 KB RAM and 512 KB Flash. Because flash write speeds are slow, the engineer writes incoming radio packets directly into the boot sector of internal flash while computing a streaming SHA-256 hash. At packet 84 out of 100, the meter's battery dies. When power is restored, the meter is completely bricked and will not turn on. What architectural flaw caused the bricking?",
      "options": [
        "Water meters should not have batteries.",
        "In-Place Overwriting of Active Boot Execution Sectors: Writing incoming, unverified chunks directly over the running application sector violates atomic update principles. If transmission is interrupted by power loss or packet drop, the device is left with a half-written, corrupted image. Firmware updates must ALWAYS be written to a secondary staging slot, leaving the active application untouched until 100% verification is complete.",
        "LoRaWAN cannot transmit firmware.",
        "SHA-256 requires 128 KB of RAM."
      ],
      "answerIdx": 1,
      "debrief": "Writing unverified OTA packets directly over the active boot partition is a fatal anti-pattern. Any interruption—power loss, radio disconnect, or checksum failure—leaves the microcontroller with half old code and half new code, causing an immediate hard fault on boot. Modern firmware architectures require dual-bank (A/B) partitioning where incoming updates are written to an isolated staging slot."
    },
    "quests": [
      {
        "num": 1,
        "title": "Streaming Hash Chaining & Chunked Verification Mathematics",
        "type": "Concept",
        "description": "Analyze incremental SHA-256 streaming pipelines, Merkle tree chunk verification, memory-bounded hashing, and signature amortization math."
      },
      {
        "num": 2,
        "title": "Interrupted Single-Bank Overwrite & Bricked Fleet Detective",
        "type": "Detective Challenge",
        "description": "Analyze a utility smart meter deployment incident; prove how power loss during an in-place flash write left 2,000 nodes permanently bricked."
      },
      {
        "num": 3,
        "title": "Streaming Chunked FOTA Staging & Verification Engine",
        "type": "Mastery Assignment",
        "description": "Implement a streaming FOTA receiver in C / TypeScript with incremental SHA-256 hashing, staging slot buffering, and post-assembly Ed25519 verification."
      },
      {
        "num": 4,
        "title": "Network Drop & Mid-Stream Packet Corruption Lab",
        "type": "Production Incident Lab",
        "description": "Simulate packet drops, bit corruptions, and power cuts across 100 FOTA transfers; verify 0 bricked nodes and 100% preservation of active firmware."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Dual-Slot A/B Flash Partitioning, Scratchpads & Atomic Boot Switching",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Storage Reliability Architecture (A/B Partitioning, Scratchpad Staging & Pointer Flips)",
    "spokenGoal": "How do you guarantee that a remote edge node deployed on an ocean buoy 500 miles offshore can NEVER be bricked by a firmware update? The answer is Dual-Slot A/B Flash Partitioning. Deconstruct the memory layout: internal or external flash is divided into two identical execution partitions: Slot A (Active Image) and Slot B (Staging Image), plus a small non-volatile Boot Metadata Sector. When running on Slot A, incoming FOTA updates are written into Slot B. Slot A is completely untouched during the entire download! Once Slot B is 100% written and cryptographically verified, how does the bootloader switch execution? Through an Atomic Metadata Swap! The bootloader writes an atomic state flag: `IMAGE_STATE = TESTING`. On the next reboot, the bootloader branches into Slot B. If Slot B boots successfully, it marks `IMAGE_STATE = CONFIRMED`. If it crashes or fails sanity checks, the hardware watchdog automatically reboots back into Slot A!",
    "conceptInvariant": "Dual-Bank Atomic Swap & Zero-Brick Guarantee Invariant: The running active firmware image must reside in an immutable read-only partition (Slot A) while updates assemble in Slot B. Pointer swapping occurs atomically via metadata state flags, ensuring that an interrupted write leaves the active partition 100% functional.",
    "failureMode": "Flipping the bootloader pointer to Slot B before writing the atomic confirmation flag; Slot B crashes on boot, the bootloader attempts to run Slot B again in an infinite crash loop, bricking the device.",
    "tryItFriction": "Build an A/B Partition Manager and Atomic State Machine in TypeScript: model flash memory with Slot A (0x08040000), Slot B (0x08080000), and a Metadata Sector (0x080C0000); implement state transitions (UNSET -> TESTING -> CONFIRMED -> REVERTED); simulate an update written to Slot B; execute a test boot; simulate a crash in Slot B; verify that the bootloader automatically reverts execution pointers back to Slot A.",
    "socraticHints": [
      "Why must flash sectors used for boot metadata be erased before writing new state flags?",
      "In NOR flash memory, writing can only change bits from 1 to 0; changing a 0 back to a 1 requires erasing an entire 4 KB sector!",
      "Modern dual-bank bootloaders use append-only monotonic bit fields (e.g. 0xFF -> 0xFE -> 0xFC) to change state flags without needing slow sector erases!"
    ],
    "situationalPuzzle": {
      "scenario": "A telecom company deploys 10,000 5G small-cell routers with dual-slot flash (Bank 1 and Bank 2). During an update rollout, a new firmware image with a subtle memory leak is installed in Bank 2. The router boots Bank 2, but after 4 minutes, the memory leak causes an out-of-memory crash. Because the router booted past the initial reset vector, the firmware marked the image as 'PERMANENTLY CONFIRMED' on second 3. The router reboots into Bank 2 and crashes every 4 minutes forever. How should the confirmation logic have been designed?",
      "options": [
        "Routers should not have memory leaks.",
        "Delayed Health Confirmation with Network Ping Handshake: An image must NEVER be confirmed immediately upon boot! The firmware must remain in 'TESTING' state until it completes a comprehensive self-test suite AND successfully establishes an authenticated cloud telemetry handshake (e.g., operating stably for 15 minutes). Only after passing operational soak testing does it burn the 'CONFIRMED' flag.",
        "Use 3-bank flash instead of 2-bank.",
        "Disable the hardware watchdog timer."
      ],
      "answerIdx": 1,
      "debrief": "Marking a firmware image as 'CONFIRMED' prematurely is a fatal update bug. Just because a microcontroller successfully executes its first few instructions does not mean the firmware is healthy! The image might crash when initializing the radio stack, connecting to the cloud, or servicing its first network request. The 'CONFIRMED' state transition must occur only after the application proves operational health over a soak period (e.g. 10-15 minutes)."
    },
    "quests": [
      {
        "num": 1,
        "title": "A/B Partition Geometry, NOR Flash Physics & State Monotonicity",
        "type": "Concept",
        "description": "Analyze dual-bank memory partitioning, NOR flash bit-flipping physics (1->0 writes), append-only state registers, and atomic pointer swapping."
      },
      {
        "num": 2,
        "title": "Premature Confirmation & 4-Minute Crash Loop Detective",
        "type": "Detective Challenge",
        "description": "Investigate a telecom cellular router outage; prove how confirming an image before network stack initialization created an unrecoverable bootloop."
      },
      {
        "num": 3,
        "title": "Dual-Bank A/B Flash Partition & Atomic Boot Engine",
        "type": "Mastery Assignment",
        "description": "Construct an embedded A/B partition manager in C / TypeScript with TESTING/CONFIRMED/REVERTED states, zero malloc, and flash sector alignment."
      },
      {
        "num": 4,
        "title": "Autonomous Crash Recovery & Rollback Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Inject crashing firmware into Slot B across 50 simulated devices; verify 100% autonomous watchdog reversion back to Slot A with zero downtime."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Hardware Watchdogs, Trial Boot Verification & Autonomous Rollback",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Failsafe Recovery Mechanics (Windowed Watchdogs, Trial Boot Assertions & Self-Tests)",
    "spokenGoal": "What is the ultimate safety net of an embedded system? When software hangs, RTOS tasks deadlock, or a new firmware image enters an infinite loop, no software code can save you. The only thing standing between your device and a permanent brick is a ticking physical clock: the Hardware Watchdog Timer (WDT)! Today you engineer Hardware Watchdogs and Trial Boot Verification. Deconstruct Windowed Watchdogs (WWDT): standard watchdogs only reset if you don't feed them in time; windowed watchdogs reset if you feed them TOO LATE or TOO EARLY! This prevents runaway code that accidentally hits a watchdog-kick instruction inside an infinite loop from keeping the system alive! Master the Trial Boot Verification sequence: 1) Hardware bootloader arms the Independent Watchdog (IWDG) with a 30-second timeout; 2) New firmware in Slot B boots; 3) Execute Hardware Self-Tests (SRAM check, Flash CRC, sensor communication); 4) Execute Network Self-Test (resolve DNS, connect mTLS, ping cloud broker); 5) If all tests pass within 30 seconds, write CONFIRMED and service the watchdog. If any test fails or code hangs, the watchdog bites, resets the hardware, and the bootloader reverts to Slot A!",
    "conceptInvariant": "Hardware Independent Watchdog & Trial Boot Assertion Invariant: The trial boot sequence must be governed by an asynchronous, clock-independent Hardware Watchdog Timer. Failure to complete operational health assertions within the watchdog window must trigger an autonomous hardware reset and automatic bootloader fallback to the last-known-good firmware slot.",
    "failureMode": "Kicking the hardware watchdog from a high-priority timer interrupt service routine (ISR); an application task deadlocks, but the timer interrupt continues happily feeding the watchdog, preventing the watchdog from ever resetting the frozen device.",
    "tryItFriction": "Build a Windowed Watchdog and Trial Boot Verifier in TypeScript: simulate an Independent Watchdog with a 20-second timeout; implement a trial boot sequence running 4 health assertions (SRAM scrub, sensor I2C check, mTLS handshake, MQTT publish); simulate an intentional deadlock during the sensor check; verify that the watchdog timer expires, triggers an autonomous reset, and reverts the bootloader back to Slot A.",
    "socraticHints": [
      "Why is feeding the watchdog inside a timer ISR one of the most dangerous bugs in embedded engineering?",
      "Because hardware timer interrupts run independently of the main application thread!",
      "Even if your main control loop crashes or deadlocks, the hardware timer interrupt keeps firing, feeding the watchdog and masking the total system failure!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart gas valve controller uses an ARM Cortex-M4 with FreeRTOS. To ensure the watchdog is always fed, a junior engineer creates a dedicated high-priority RTOS task that calls `IWDG_ReloadCounter()` every 500 ms. During an industrial plant test, a stack overflow in the gas sensing task causes the sensor thread to crash permanently. The valve stops measuring gas pressure, but because the watchdog task continues running, the watchdog never resets the controller, resulting in a dangerous gas pressure buildup. How must watchdog feeding be architected?",
      "options": [
        "Remove the watchdog completely.",
        "Task-Synchronized Watchdog Gating: The watchdog must be fed ONLY if ALL critical application tasks report health! Each critical task (sensing, valve control, network) must set a bit in a cooperative event group upon completing each execution cycle. The watchdog management task inspects the bitmask: if any task is frozen or crashed, the watchdog is intentionally starved, forcing a hardware reset within 2 seconds.",
        "Buy more expensive gas valves.",
        "Run the watchdog task at lowest priority."
      ],
      "answerIdx": 1,
      "debrief": "Feeding a watchdog from an isolated timer ISR or independent high-priority task is a dangerous anti-pattern that masks software freezes. A properly architected watchdog subsystem uses Task-Synchronized Gating (e.g., an event group bitmask where every critical task must check in). If the sensor task hangs or dies, its bit remains clear, the watchdog task refuses to kick the hardware timer, and the hardware watchdog resets the microcontroller."
    },
    "quests": [
      {
        "num": 1,
        "title": "Windowed Watchdog Physics, Clock Domains & Failsafe Recovery",
        "type": "Concept",
        "description": "Analyze independent RC oscillator clock domains, windowed watchdog timing bounds, task synchronization bitmasks, and trial boot sequences."
      },
      {
        "num": 2,
        "title": "Timer ISR Watchdog Feeding & Frozen Gas Valve Detective",
        "type": "Detective Challenge",
        "description": "Investigate an industrial safety incident; prove how feeding a watchdog from a timer ISR masked an application deadlock and caused gas buildup."
      },
      {
        "num": 3,
        "title": "Task-Synchronized Watchdog & Trial Boot Health Engine",
        "type": "Mastery Assignment",
        "description": "Construct a cooperative watchdog manager in C / TypeScript requiring bitmask check-ins from all tasks before servicing hardware timers."
      },
      {
        "num": 4,
        "title": "Autonomous Watchdog Rollback Under Deadlock Lab",
        "type": "Production Incident Lab",
        "description": "Simulate deadlocking an edge node during trial boot; verify that the hardware watchdog fires within 10 seconds and reverts cleanly to Slot A."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone Project 6: IETF SUIT Manifest-Compliant Resilient Dual-Bank Secure FOTA Engine",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Architectural Milestone (Complete Zero-Brick FOTA Architecture)",
    "spokenGoal": "Congratulations on completing Block 7. Today you engineer Milestone Project 6: a production-grade, zero-brick, IETF SUIT Manifest-Compliant Secure FOTA Engine! Your architecture unifies everything required for fail-safe fleet updates: 1) An IETF SUIT Manifest Parser (RFC 9019) that validates CBOR envelopes, verifies COSE Ed25519 digital signatures, and checks hardware Vendor and Class UUIDs; 2) A Streaming Chunked Verifier that streams update payloads into an isolated Slot B scratchpad while calculating incremental SHA-256 digests under 4 KB RAM; 3) An Atomic Dual-Bank A/B Flash Partition Manager with monotonic state transitions (TESTING, CONFIRMED, REVERTED); and 4) A Task-Synchronized Hardware Watchdog Core that enforces trial boot health assertions and executes autonomous rollback if the new firmware deadlocks. Put your milestone under full chaos testing: simulate broken radio connections, power cuts mid-flash, corrupted signatures, and crashing application binaries!",
    "conceptInvariant": "Zero-Brick Autonomous Resilience Invariant: The complete FOTA pipeline must guarantee zero possibility of device bricking under any combination of network loss, power interruption, corrupted signature, or application deadlock, maintaining 100% operational availability via autonomous bootloader reversion to Slot A.",
    "failureMode": "Failing to verify the staged image CRC before switching the boot pointer; an undetected SPI flash bit-flip corrupts the vector table in Slot B, causing a HardFault before the application watchdog can even be armed.",
    "tryItFriction": "Construct the Milestone 6 Secure FOTA Engine in TypeScript / C: 1) Implement the CBOR/COSE SUIT manifest parser; 2) Implement the dual-slot A/B flash manager; 3) Implement streaming chunk verification; 4) Implement the task-gated watchdog and trial boot state machine; 5) Pass all 25 automated resilience and chaos assertions.",
    "socraticHints": [
      "Why must the bootloader verify the full image hash again from flash BEFORE branching, even if the network stream was verified earlier?",
      "Because NOR flash sectors can have silent bit errors or write failures during programming!",
      "Verifying the complete flash sector hash after writing guarantees that the bytes actually stored in silicon match the signed manifest exactly!"
    ],
    "situationalPuzzle": {
      "scenario": "During validation of Milestone Project 6 across 500 edge nodes, a simulated update is pushed containing a deliberate infinite loop in the radio driver. The nodes flash Slot B, reboot, enter the infinite loop, and stop communicating. Thirty seconds later, all 500 nodes reappear on the network running the original healthy firmware from Slot A with an alert: 'FOTA Trial Boot Failed: Watchdog Timeout Reverted'. What architectural mechanism made this autonomous recovery possible?",
      "options": [
        "A technician manually visited all 500 nodes.",
        "Watchdog-Triggered Autonomous A/B Rollback: The node booted Slot B in 'TESTING' state with an active independent hardware watchdog. Because the radio driver hung in an infinite loop, the trial boot assertions never completed and the watchdog was never kicked. The hardware watchdog fired, reset the CPU, and the bootloader detected an unconfirmed trial boot, automatically clearing the Slot B pointer and reverting to Slot A.",
        "The infinite loop automatically solved itself.",
        "The cloud sent a cancel command to the frozen devices."
      ],
      "answerIdx": 1,
      "debrief": "This is the holy grail of embedded systems engineering: Autonomous Resilience. In an industrial or remote IoT deployment, you cannot dispatch technicians to manually recover bricked devices. Combining dual-bank A/B partitioning with hardware watchdog trial-boot gating guarantees that any bad update (crashing, deadlocking, or failing network connection) automatically rolls back to the previous healthy firmware with zero human intervention."
    },
    "quests": [
      {
        "num": 1,
        "title": "Zero-Brick FOTA Architecture & SUIT Manifest Specification",
        "type": "Concept",
        "description": "Document the complete mathematical and firmware architectural specification uniting SUIT manifests, A/B dual banking, and watchdog rollback."
      },
      {
        "num": 2,
        "title": "Infinite Loop Radio Driver & Fleet Autonomous Recovery Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated chaos test report; demonstrate step-by-step how watchdog timeout counters safely reverted 500 frozen nodes back to Slot A."
      },
      {
        "num": 3,
        "title": "Milestone 6: Resilient Dual-Bank Secure FOTA Engine",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 6 engine: SUIT parser + chunked staging + A/B manager + task-gated watchdog."
      },
      {
        "num": 4,
        "title": "Full Fleet Power-Cut & Corruption Chaos Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Milestone 6 engine to 50 power cuts during active flash erase/write operations; prove 100% recovery and zero bricked devices."
      }
    ]
  },
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "Insecurity of Legacy Fieldbuses: Modbus TCP Plaintext Attacks & RS-485 Eavesdropping",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Industrial Operational Technology Security (Modbus Insecurities & Legacy Protocol Hazards)",
    "spokenGoal": "Welcome to Block 8: Industrial Fieldbus Security. For decades, factories, power plants, and oil refineries have run on legacy protocols designed in the 1970s: Modbus, RS-485, Profibus, and CAN bus. In the 1970s, factories were physically isolated, so security was completely ignored! Today these legacy fieldbuses are connected to Ethernet gateways and the internet, creating catastrophic industrial vulnerabilities! Deconstruct Modbus TCP (Port 502): 1) Zero Authentication: any device on the network can send Modbus commands to any PLC—there are no passwords, no tokens, and no signatures; 2) Zero Encryption: all coil registers, holding registers, and analog sensor values travel in plaintext; 3) Zero Integrity: packets have no cryptographic MAC tags. An attacker can send Modbus Function Code 0x05 (Write Single Coil) to force open an emergency high-pressure steam valve! Trace RS-485 physical bus tapping: connecting two alligator clips to the differential A/B wires allows passive eavesdropping on all serial traffic!",
    "conceptInvariant": "Legacy Operational Protocol Zero-Trust Invariant: Industrial fieldbuses designed without native security (Modbus RTU/TCP, plain CAN, RS-485) must be treated as completely untrusted physical media. Direct internet or corporate IT routing to legacy fieldbus ports is strictly prohibited without intervening cryptographic security gateways.",
    "failureMode": "Exposing a Modbus TCP port 502 directly to the factory enterprise Wi-Fi; a contractor's infected laptop sends Modbus Function Code 0x06 (Write Single Register) commands that alter chemical mixer speeds, ruining $200,000 of pharmaceutical batches.",
    "tryItFriction": "Build a Modbus TCP Packet Parser and Plaintext Injection Simulator in TypeScript: parse Modbus Application Protocol (MBAP) headers (Transaction ID, Protocol ID 0x0000, Length, Unit ID) and Function Codes (0x01 Read Coils, 0x05 Write Coil, 0x06 Write Register); simulate an unauthenticated attacker injecting a malicious coil override; demonstrate that standard Modbus TCP accepts the command without any authentication; design an inspection filter that traps unauthorized write attempts.",
    "socraticHints": [
      "Why did Modbus creators omit authentication and encryption when designing the protocol in 1979?",
      "In 1979, Modbus ran over dedicated RS-232 serial cables between a single PLC and an operator console inside a locked control room!",
      "The concept of connecting factory machines to a global packet-switched internet did not exist!"
    ],
    "situationalPuzzle": {
      "scenario": "A water municipal pumping station connects 12 Modbus RTU pumps over RS-485 to an Ethernet gateway. A disgruntled ex-employee parks outside the facility, connects to the guest Wi-Fi, discovers the gateway's IP address, and sends Modbus TCP packets with Unit ID 3 and Function Code 0x05 to shut down the main pumps. The pumps immediately shut down, cutting off water to 50,000 residents. The plant manager is baffled because the SCADA server had a 16-character complex password. How did the attacker bypass the password?",
      "options": [
        "The attacker cracked the 16-character password with a supercomputer.",
        "Bypassing SCADA Password via Direct Modbus Protocol Injection: The password protected only the web UI of the SCADA software, NOT the underlying Modbus network port! The Modbus protocol itself (port 502) has zero concept of user accounts or passwords. Anyone on the same network subnet can send raw Modbus TCP packets directly to the gateway, which forwards them to the pumps without checking user credentials.",
        "Modbus pumps cannot be controlled remotely.",
        "The RS-485 wires were cut by squirrels."
      ],
      "answerIdx": 1,
      "debrief": "Security on the human UI level (like a password on a SCADA dashboard) does not protect the machine network level. Legacy industrial protocols like Modbus TCP listen on raw network sockets without authentication. If an attacker can send packets to the IP and port of the device, the device will obey the command. Legacy protocols must be isolated behind industrial firewalls or encapsulated in authenticated protocols."
    },
    "quests": [
      {
        "num": 1,
        "title": "Modbus MBAP Framing, Function Codes & Physical RS-485 Physics",
        "type": "Concept",
        "description": "Analyze Modbus TCP MBAP headers, PDU function codes, RS-485 differential signaling (A/B lines), and lack of authentication primitives."
      },
      {
        "num": 2,
        "title": "SCADA Password Bypass & Municipal Pump Blackout Detective",
        "type": "Detective Challenge",
        "description": "Investigate a critical municipal water plant sabotage incident; prove how direct Modbus port 502 packet injection bypassed SCADA login screens."
      },
      {
        "num": 3,
        "title": "Modbus TCP Deep Packet Inspection (DPI) Filter Engine",
        "type": "Mastery Assignment",
        "description": "Construct an industrial Modbus deep packet inspection firewall in C / TypeScript that blocks unauthorized write function codes while allowing read queries."
      },
      {
        "num": 4,
        "title": "Industrial Fieldbus Injection & Tapping Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Simulate network tapping and injection attacks across 50 virtual PLCs; verify that legacy Modbus is 100% exploitable without gateway filtering."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Modbus Security (IEC 62351-08) & Secure CAN Bus / CAN-FD: AUTOSAR SecOC",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Modern Fieldbus Hardening (IEC 62351-08 TLS Modbus, SecOC & Truncated MACs)",
    "spokenGoal": "How do you modernize legacy industrial networks without tearing out millions of dollars of factory machinery? You upgrade them with modern secure industrial standards: Modbus Security (IEC 62351-08) and Secure CAN Bus (AUTOSAR SecOC)! Deconstruct Modbus Security (Port 802): IEC 62351-08 wraps traditional Modbus inside mutually authenticated TLS (mTLS), mandating role-based access control (Operator, Engineer, Administrator) based on X.509 certificate roles. Read-only operators are cryptographically prevented from issuing write commands! Deconstruct Secure CAN Bus and CAN-FD: in automotive and industrial robotics, CAN bus frames have no sender ID—any node on the bus can spoof an ECU! Master AUTOSAR SecOC (Secure Onboard Communication): appends a Truncated Message Authentication Code (MAC - 24 to 32 bits) and a Monotonic Freshness Value (FV) to every CAN payload. Even with physical bus access, an attacker cannot forge CAN frames or replay historical steering commands!",
    "conceptInvariant": "Industrial Bus Authentication & Freshness Invariant: Modern fieldbus frames must incorporate cryptographic origin authentication (IEC 62351-08 mTLS for Modbus; AUTOSAR SecOC truncated MAC + Freshness Value for CAN/CAN-FD), rendering message injection and replay attacks mathematically impossible.",
    "failureMode": "Deploying SecOC without a synchronized Freshness Value counter; an attacker records a valid 'EMERGENCY_STOP' CAN frame with its truncated MAC and replays it on the vehicle bus 2 hours later, locking the steering wheel at highway speeds.",
    "tryItFriction": "Build an AUTOSAR SecOC CAN-FD Frame Generator and Verifier in TypeScript: construct a standard CAN payload (ID 0x120, Speed=85 km/h); implement a Freshness Value Manager maintaining a synchronized 64-bit monotonic counter; compute a CMAC-AES-128 over (Data + FreshnessValue); truncate the MAC to 32 bits; verify successful frame acceptance; simulate an attacker replaying an old frame with an outdated freshness counter and verify immediate rejection.",
    "socraticHints": [
      "Why does AUTOSAR SecOC truncate the 128-bit CMAC down to 24 or 32 bits?",
      "Because standard CAN frames have a maximum payload of only 8 bytes (64 bytes in CAN-FD)!",
      "A full 16-byte MAC would consume more bandwidth than the actual sensor data itself! Truncating to 32 bits provides sufficient cryptographic security while fitting in the CAN frame!"
    ],
    "situationalPuzzle": {
      "scenario": "A tier-1 automotive supplier implements AUTOSAR SecOC on an electric vehicle steering ECU. To save processing time, the engineers configure SecOC to calculate the MAC using a static 16-bit ECU identifier instead of a dynamic monotonic Freshness Value. A car thief connects a CAN dongle to the headlight wiring harness on the outside of the vehicle, records the 'DOOR_UNLOCK' CAN frame with its valid SecOC MAC, and replays it 10 seconds later. The doors unlock immediately. What caused the security failure?",
      "options": [
        "Headlight wiring cannot connect to CAN bus.",
        "Replay Vulnerability from Static Freshness Values: A MAC without a dynamic, non-repeating Freshness Value (such as a monotonic counter or cryptographic timestamp) provides only static authentication, NOT freshness! The frame remains valid forever. SecOC mandates incorporating an incrementing Freshness Value into the MAC calculation so that every transmitted frame has a unique, single-use MAC tag.",
        "CAN bus does not support electric cars.",
        "The car battery was charging."
      ],
      "answerIdx": 1,
      "debrief": "Authentication without freshness is useless against replay attacks. If the input to a MAC algorithm is static (or predictable), the resulting MAC tag is static as well. An attacker on the physical bus does not need to crack the encryption key; they simply record the valid frame and transmit it whenever they choose. AUTOSAR SecOC prevents replay attacks by mixing an incrementing Freshness Value into the MAC input, ensuring every frame's signature is valid exactly once."
    },
    "quests": [
      {
        "num": 1,
        "title": "IEC 62351-08 Modbus Security & AUTOSAR SecOC Architecture",
        "type": "Concept",
        "description": "Analyze IEC 62351-08 mTLS wrappers for port 802, AUTOSAR SecOC specification, CMAC-AES truncation mathematics, and Freshness Value Manager synchronization."
      },
      {
        "num": 2,
        "title": "Headlight CAN Bus Tapping & Door Unlock Replay Detective",
        "type": "Detective Challenge",
        "description": "Investigate a modern automotive vehicle theft; prove how static SecOC freshness counters enabled CAN frame replay from the exterior headlight harness."
      },
      {
        "num": 3,
        "title": "AUTOSAR SecOC CAN-FD Generator & Verifier Engine",
        "type": "Mastery Assignment",
        "description": "Implement a complete SecOC module in C / TypeScript with 64-bit monotonic freshness tracking, CMAC-AES-128 truncation, and bus error handling."
      },
      {
        "num": 4,
        "title": "IEC 62351-08 Modbus Security Role-Based Enforcement Lab",
        "type": "Production Incident Lab",
        "description": "Deploy an IEC 62351-08 gateway; verify that Operator certificates are permitted to read registers but cryptographically blocked from write commands."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "OPC UA Security Architecture: Part 4/12, Security Profiles & Cryptographic User Tokens",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Enterprise OT Security (OPC Unified Architecture, Digital Certs & Secure Channels)",
    "spokenGoal": "While Modbus was born in 1979, OPC Unified Architecture (OPC UA - IEC 62541) is the modern gold standard for Industry 4.0 and Smart Manufacturing. Unlike legacy fieldbuses, OPC UA was built from the ground up with robust enterprise cybersecurity! Today you master the OPC UA Security Architecture (Part 4 and Part 12). Deconstruct OPC UA Security Profiles: 1) `None`: no security (strictly forbidden in production!); 2) `Basic256Sha256`: AES-256 symmetric encryption, SHA-256 digital signatures, RSA-2048/3072 asymmetric exchange; 3) `Aes128_Sha256_RsaOaep`. Deconstruct the 3-Layer Security Model: 1) Transport Security: asymmetric handshake generating a Secure Channel with symmetric session keys; 2) Application Security: mutual validation of X.509 Application Instance Certificates; 3) User Authentication: Cryptographic User Identity Tokens (X.509 certs, JWT bearer tokens, or encrypted username/password). Trace how OPC UA prevents MITM, eavesdropping, and session hijacking across factory floors!",
    "conceptInvariant": "OPC UA Secure Channel & Application Instance Binding Invariant: All industrial automation data exchange must enforce OPC UA Security Profile `Basic256Sha256` or higher. The Secure Channel must be bound to mutually authenticated Application Instance Certificates, completely disallowing the `None` security policy.",
    "failureMode": "Configuring an industrial OPC UA robot controller to allow `SecurityPolicy_None` alongside `Basic256Sha256` for 'backward compatibility'; an attacker initiates a protocol downgrade attack, forcing the server to switch to `None`, and reads factory production secrets in plaintext.",
    "tryItFriction": "Build an OPC UA Secure Channel Handshake and Policy Negotiator in TypeScript: implement asymmetric OpenSecureChannel request/response with RSA-OAEP key exchange; establish symmetric session keys (SigningKey, EncryptionKey, InitializationVector); simulate an attacker sending a downgrade request to `SecurityPolicy_None`; verify that the server's policy enforcement rules reject the downgrade and terminate the socket.",
    "socraticHints": [
      "Why do factory technicians frequently enable `SecurityPolicy_None` on OPC UA servers?",
      "Because configuring X.509 certificates and trust lists takes time, and `None` allows devices to connect instantly with zero certificate errors!",
      "This 'temporary test configuration' is frequently forgotten, leaving multi-million-dollar chemical reactors completely exposed to plaintext cyber attacks!"
    ],
    "situationalPuzzle": {
      "scenario": "A semiconductor fabrication cleanroom uses OPC UA to coordinate silicon wafer polishing machines. The machines support `Basic256Sha256`. During a quarterly audit, a security researcher connects a laptop to the factory floor switch, launches an ARP poisoning tool, intercepts an OPC UA connection request, and modifies the `SecurityPolicyUri` in the `GetEndpoints` response from `Basic256Sha256` to `None`. The client machine complies, drops encryption, and begins streaming plaintext wafer design specs. What configuration prevented this downgrade?",
      "options": [
        "The cleanroom needed more air filters.",
        "Strict Policy Enforcement & Disabling `SecurityPolicy_None`: The OPC UA server and client were configured with permissive multi-policy support. The configuration must explicitly purge `SecurityPolicy_None` from the server endpoint registry! When `None` is completely disabled in firmware, any connection attempt requesting an unencrypted channel is rejected immediately, making protocol downgrade impossible.",
        "Semiconductor wafers do not need cybersecurity.",
        "OPC UA only runs on Windows 95."
      ],
      "answerIdx": 1,
      "debrief": "Protocol downgrade attacks target servers that maintain backward compatibility with obsolete, unsecure modes. If an OPC UA server allows both `Basic256Sha256` and `None`, an attacker in the middle can alter the unencrypted initial negotiation messages to force both endpoints into plaintext mode. In production industrial environments, `SecurityPolicy_None` must be permanently disabled in firmware and server configuration."
    },
    "quests": [
      {
        "num": 1,
        "title": "OPC UA Part 4/12 Specifications, Security Profiles & Channel Handshakes",
        "type": "Concept",
        "description": "Analyze OPC UA Secure Channel state machines, Basic256Sha256 encryption math, Application Instance Certificates, and user token authentication."
      },
      {
        "num": 2,
        "title": "Cleanroom OPC UA Protocol Downgrade & Wafer Leak Detective",
        "type": "Detective Challenge",
        "description": "Investigate an industrial espionage incident; prove how permitting `SecurityPolicy_None` allowed an attacker to downgrade a wafer fabrication network."
      },
      {
        "num": 3,
        "title": "OPC UA Secure Channel & Policy Negotiator Engine",
        "type": "Mastery Assignment",
        "description": "Construct an embedded OPC UA security gateway in C / TypeScript enforcing Basic256Sha256 secure channels and zero-downgrade policies."
      },
      {
        "num": 4,
        "title": "Industrial Protocol Downgrade Attack Defense Lab",
        "type": "Production Incident Lab",
        "description": "Subject the OPC UA gateway to 100 forced downgrade requests, corrupted user tokens, and expired certificates; verify 100% enforcement."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Industrial Network Segmentation: Purdue Enterprise Model (PERA) & Unidirectional Data Diodes",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Architectural Network Segmentation (Purdue Model, ISA-99/IEC 62443 & Data Diodes)",
    "spokenGoal": "How do you protect a nuclear power plant, a water reservoir, or an oil refinery from internet hackers? You do not connect them to the internet! You enforce physical and logical network architecture. Welcome to Industrial Network Segmentation and the Purdue Enterprise Reference Architecture (PERA / ISA-99 / IEC 62443). Deconstruct the Purdue Model hierarchy: Level 0 (Physical Process: sensors, motors, valves); Level 1 (Basic Control: PLCs, RTUs, microcontrollers); Level 2 (Area Supervisory: SCADA human-machine interfaces [HMIs]); Level 3 (Site Operations: manufacturing execution systems [MES], historian servers); Industrial Demilitarized Zone (IDMZ - Level 3.5): the firewalled barrier between IT and OT; Level 4/5 (Enterprise IT: ERP, email, internet). Master the Cardinal Rule of OT: No direct communication across more than one level! Master Hardware Unidirectional Data Diodes: optical fiber circuits with an LED transmitter on the OT side and a photodiode receiver on the IT side. Photons can only fly in ONE direction: data can leave the plant, but not a single bit of malware can physically travel backward!",
    "conceptInvariant": "Purdue Hierarchy & Unidirectional Isolation Invariant: Operational technology (Levels 0-2) must never communicate directly with enterprise IT (Levels 4-5). All cross-boundary data transfer must route through a strictly monitored Industrial DMZ (Level 3.5) or physical optical data diodes that enforce mathematical unidirectionality.",
    "failureMode": "Bridging corporate IT Wi-Fi directly into Level 1 PLC networks to allow engineers to troubleshoot from home; an IT phishing email infects an engineer's laptop, and ransomware spreads directly into turbine controllers, shutting down the city's power grid.",
    "tryItFriction": "Build an Industrial DMZ Firewall and Optical Data Diode Simulator in TypeScript: define a 5-level Purdue network topology; implement packet routing rules enforcing IDMZ separation; simulate an optical data diode where photons physically permit OT->IT telemetry but reject 100% of IT->OT inbound packets; test injecting an IT malware command packet towards a Level 1 PLC; verify that the data diode makes reverse transmission physically impossible.",
    "socraticHints": [
      "Why is a standard dual-homed server (with two network interface cards) dangerous as an IDMZ bridge?",
      "Because if an attacker compromises the operating system of that server, they can turn on IP forwarding and route packets directly between IT and OT!",
      "A physical optical data diode has no physical return fiber—transmitting backward is as impossible as making light fly backward!"
    ],
    "situationalPuzzle": {
      "scenario": "A regional electric utility connects its power substation SCADA network (Purdue Level 2) to corporate headquarters (Purdue Level 4) using a dual-homed Windows server in the DMZ. An accounting clerk in headquarters opens a malicious PDF attachment containing BlackEnergy malware. Within 4 hours, the malware compromises the corporate network, pivots through the dual-homed DMZ server, reaches the Level 1 RTUs, and opens electrical substation circuit breakers, plunging 230,000 homes into darkness. What physical security architectural control was violated?",
      "options": [
        "The accounting clerk should have used a Macintosh.",
        "Improper DMZ Segmentation & Lack of Unidirectional Protection: Using a dual-homed general-purpose OS server without strict firewall policy isolation allowed an IT pivot into OT networks. Substations streaming telemetry to corporate historians must utilize physical Unidirectional Data Diodes or multi-tier firewalled DMZs that prevent any incoming TCP/IP connection from corporate IT into operational control networks.",
        "Electric substations do not use circuit breakers.",
        "Power grids cannot be hacked."
      ],
      "answerIdx": 1,
      "debrief": "The BlackEnergy attack on the Ukrainian power grid in 2015 is a textbook example of poor network segmentation. Attackers breached the corporate business network through phishing and pivoted through poorly isolated DMZ servers directly into the operational SCADA and RTU networks. The Purdue Model dictates that IT networks must be strictly isolated from OT networks, and sensitive telemetry should traverse physical optical data diodes that physically prevent any inbound traffic."
    },
    "quests": [
      {
        "num": 1,
        "title": "Purdue Enterprise Reference Architecture (PERA) & Data Diode Physics",
        "type": "Concept",
        "description": "Analyze ISA-99 / IEC 62443 network levels 0-5, IDMZ architectures, multi-tier firewall policies, and optical data diode physics."
      },
      {
        "num": 2,
        "title": "BlackEnergy Substation Grid Blackout & IT-OT Pivot Detective",
        "type": "Detective Challenge",
        "description": "Reconstruct the Ukrainian power grid cyber attack; demonstrate how dual-homed DMZ servers allowed corporate malware to pivot into electrical RTUs."
      },
      {
        "num": 3,
        "title": "Purdue Level 3.5 IDMZ Firewall & Optical Data Diode Engine",
        "type": "Mastery Assignment",
        "description": "Implement an industrial network segmentation router in C / TypeScript with Purdue hierarchy enforcement and unidirectional optical diode emulation."
      },
      {
        "num": 4,
        "title": "Corporate IT Malware Pivot & Substation Isolation Lab",
        "type": "Production Incident Lab",
        "description": "Simulate massive corporate ransomware propagation towards virtual Level 1 PLCs; prove that proper IDMZ data diodes achieve 100% containment."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone Project 7: Secure Modbus TCP / SecOC CAN-FD Gateway & Fieldbus Firewall Engine",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Architectural Milestone (Complete Operational Technology Security Synthesis)",
    "spokenGoal": "Congratulations on completing Block 8. Today you engineer Milestone Project 7: a production-grade Industrial Fieldbus Security Gateway and Firewall Engine! Your architecture bridges modern enterprise networks with legacy industrial control buses: 1) An IEC 62351-08 Modbus Security Gateway that encapsulates plaintext Modbus RTU/TCP into mutually authenticated TLS channels with X.509 role-based access control; 2) An AUTOSAR SecOC CAN-FD Engine that calculates 32-bit truncated CMACs and manages synchronized 64-bit monotonic Freshness Values to eliminate CAN bus spoofing and replay attacks; 3) An Industrial Deep Packet Inspection (DPI) Firewall that inspects fieldbus payloads and enforces write-blocking rules; and 4) A Purdue Model Network Segmentation Core that validates packets across architectural boundaries. Put your milestone under full industrial cyber-attack: inject unauthorized Modbus coil writes, attempt CAN frame replays, and launch IT-to-OT pivot attempts!",
    "conceptInvariant": "OT Cryptographic Mediation & Boundary Defense Invariant: The industrial gateway must enforce cryptographic encapsulation and freshness verification over all legacy fieldbus protocols. Any unauthenticated command, replayed CAN frame, or out-of-order freshness sequence must be dropped deterministically within 500 microseconds without disrupting physical control loops.",
    "failureMode": "Buffering SecOC frames during a burst of CAN bus traffic without bounded queues; the gateway runs out of memory, drops freshness synchronization, and causes an emergency shutdown of the industrial robotic cell.",
    "tryItFriction": "Construct the Milestone 7 Industrial Security Gateway in TypeScript / C: 1) Implement the IEC 62351-08 Modbus mTLS translator; 2) Implement the AUTOSAR SecOC CAN-FD freshness manager and CMAC engine; 3) Implement the DPI fieldbus firewall; 4) Implement Purdue Level 3.5 routing boundaries; 5) Pass all 25 automated industrial threat assertions.",
    "socraticHints": [
      "Why must an industrial fieldbus firewall process packets in under 500 microseconds?",
      "Because industrial robotics and motor drives operate on hard-real-time control loops (often 1 kHz / 1 ms cycles)!",
      "If a security firewall introduces a 2 ms latency jitter while checking crypto, the motor control loop becomes unstable and faults out!"
    ],
    "situationalPuzzle": {
      "scenario": "During deployment of Milestone Project 7 in an automotive battery assembly plant, the plant experiences an electrical noise spike from an arc welder. The noise corrupts two CAN-FD frames on the bus. The SecOC engine detects the bad CRC and drops the frames. However, the subsequent frame uses Freshness Counter 105, while the receiver expected Counter 103 (because two frames were lost). How does a production SecOC engine recover synchronization without locking up the vehicle bus?",
      "options": [
        "Reboot the car.",
        "Sliding Freshness Synchronization Window: Production SecOC implementations maintain an allowable Lookahead Freshness Window (e.g. up to 16 increments). If counter drift is within the window, the receiver evaluates the MAC against candidate counter values in the window. Once verified, it resynchronizes its state to 105, preventing transient electrical packet drops from causing permanent bus lockouts.",
        "Disable SecOC whenever arc welders are operating.",
        "Send plaintext CAN frames instead."
      ],
      "answerIdx": 1,
      "debrief": "In noisy industrial and automotive environments, packets will be dropped by electromagnetic interference (EMI). If a security protocol requires rigid lockstep synchronization, a single lost packet permanently breaks communication. AUTOSAR SecOC solves this by incorporating a sliding freshness lookahead window, allowing the receiver to re-synchronize after minor packet loss while still rejecting historical replay attacks."
    },
    "quests": [
      {
        "num": 1,
        "title": "Industrial Gateway Architecture & Multi-Protocol Security Blueprint",
        "type": "Concept",
        "description": "Architect the complete firmware specification uniting IEC 62351-08, AUTOSAR SecOC, Purdue Level 3.5 routing, and hard-real-time DPI."
      },
      {
        "num": 2,
        "title": "Arc Welder EMI Noise & SecOC Freshness Desynchronization Detective",
        "type": "Detective Challenge",
        "description": "Investigate a robotic welding line halt; prove how electrical noise packet drops desynchronized SecOC monotonic counters."
      },
      {
        "num": 3,
        "title": "Milestone 7: Industrial Security Gateway & Fieldbus Firewall",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 7 gateway: Modbus mTLS wrapper + SecOC CAN-FD manager + Purdue IDMZ firewall."
      },
      {
        "num": 4,
        "title": "Simulated Industrial Sabotage & Packet Injection Defense Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Milestone 7 gateway to 5,000 rogue Modbus writes, replayed CAN frames, and IT pivot attacks; verify 100% rejection and 0 false trips."
      }
    ]
  },
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Bluetooth Low Energy (BLE) Security: LE Secure Connections, ECDH & Numeric Comparison",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Wireless Physical Security (BLE 4.2/5.x Security Modes, Pairing & MITM Defense)",
    "spokenGoal": "Welcome to Block 9: Low-Power Wireless IoT Protocol Security. Wireless signals travel through thin air; an attacker with an SDR (Software Defined Radio) sitting in a van 100 meters away can sniff every packet! We begin with Bluetooth Low Energy (BLE). Deconstruct the history of BLE Pairing: BLE Legacy Pairing (BLE 4.0/4.1) was hopelessly broken! It used a custom key derivation algorithm where the Temporary Key (TK) was either 0 ('Just Works') or a 6-digit PIN (brute-forced in 0.1 seconds!). Modern IoT mandates BLE LE Secure Connections (LESC - introduced in BLE 4.2 and enhanced in BLE 5.x). Deconstruct LESC: it uses Elliptic Curve Diffie-Hellman (ECDH) on the NIST P-256 curve! The symmetric encryption key (Long Term Key - LTK) is NEVER transmitted over the air! Master Pairing Association Models: 1) Numeric Comparison (both devices display a 6-digit number, authenticated by user to prevent Man-in-the-Middle [MITM]); 2) Passkey Entry; 3) Out-of-Band (OOB via NFC); 4) Just Works (unauthenticated, vulnerable to MITM). Master AES-CCM link-layer packet encryption!",
    "conceptInvariant": "LE Secure Connections ECDH Invariant: All BLE peripheral pairing must mandate LE Secure Connections (Security Mode 1, Level 4) with ECDH P-256 key agreement and Numeric Comparison or OOB authentication. Legacy Pairing and unauthenticated Just Works modes must be rejected by peripheral security managers.",
    "failureMode": "Configuring a smart medical insulin pump with BLE 'Just Works' pairing; an attacker in the hospital waiting room launches a Man-in-the-Middle attack with an SDR, intercepts pairing, and obtains full read/write access to insulin delivery characteristics.",
    "tryItFriction": "Build a BLE LE Secure Connections Pairing Simulator in TypeScript: implement ECDH P-256 key exchange between Peripheral and Central; compute Confirm and Random values; implement the Numeric Comparison 6-digit verification code generator; simulate an active MITM attacker attempting to alter public keys; verify that the Numeric Comparison check detects key alteration and aborts pairing.",
    "socraticHints": [
      "Why is 'Just Works' pairing completely defenseless against an active Man-in-the-Middle (MITM) attacker?",
      "Because Just Works provides zero authentication! An attacker sitting between the two devices can perform an independent Diffie-Hellman exchange with each side!",
      "Numeric Comparison or OOB NFC is required because it uses a secondary channel (human eyes or physical touch) to confirm that both endpoints generated the same secret!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart lock manufacturer claims their BLE lock is 'completely secure' because they use AES-128 encryption. However, during testing with a BLE sniffer, an engineer captures the initial pairing exchange of a user setting up a new lock using their phone. Within 3 seconds, a Python script extracts the Long Term Key (LTK) and unlocks the door. The lock's firmware configured `io_capabilities = NO_INPUT_NO_OUTPUT`. What configuration flaw allowed the key to be extracted from the air?",
      "options": [
        "The lock battery was nearly dead.",
        "Fallback to Unauthenticated Legacy Just Works: Setting IO capabilities to `NO_INPUT_NO_OUTPUT` on a device using Legacy Pairing forces the BLE stack to use Just Works mode, which sets the Temporary Key to 0 (`TK = 0x00000000`). The LTK is encrypted with a key derived from zero! Anyone recording the over-the-air packets can decrypt the LTK immediately. Devices must enforce LE Secure Connections (LESC), where ECDH prevents passive eavesdropping even with no display.",
        "BLE cannot be used for locks.",
        "The phone's Bluetooth antenna was too powerful."
      ],
      "answerIdx": 1,
      "debrief": "In BLE Legacy Pairing, if a device has no display and no keyboard (`NO_INPUT_NO_OUTPUT`), the specification forces the Temporary Key (TK) to all zeros. The subsequent encryption key exchange is protected by an encryption key that is completely known! In LE Secure Connections (LESC), ECDH P-256 is used, which mathematically guarantees that passive eavesdroppers recording the airwaves cannot calculate the Long Term Key (LTK), even if the pairing mode is Just Works."
    },
    "quests": [
      {
        "num": 1,
        "title": "BLE Security Architecture, LESC vs Legacy Pairing & ECDH Math",
        "type": "Concept",
        "description": "Analyze BLE Security Mode 1 Levels 1-4, ECDH P-256 key derivation, Numeric Comparison confirmation mathematics, and AES-CCM link encryption."
      },
      {
        "num": 2,
        "title": "Just Works Zero-TK Passive Sniffing & Smart Lock Break-In Detective",
        "type": "Detective Challenge",
        "description": "Investigate a commercial smart lock vulnerability; prove how Legacy Just Works pairing allowed an over-the-air sniffer to extract the master LTK."
      },
      {
        "num": 3,
        "title": "BLE LE Secure Connections (LESC) Pairing Engine",
        "type": "Mastery Assignment",
        "description": "Implement a BLE Security Manager module in C / TypeScript with ECDH P-256 key agreement, Numeric Comparison verification, and AES-CCM link keys."
      },
      {
        "num": 4,
        "title": "Active Wireless Man-in-the-Middle Attack Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Launch simulated active MITM and passive sniffing attacks against the LESC engine; verify 100% detection of MITM tampering and zero key leakage."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Zigbee 3.0 & Thread Security Architecture: Trust Center Link Keys & DTLS-JPAKE",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Mesh Network Security (Zigbee Trust Center, Thread Mesh & Password Authenticated Key Exchange)",
    "spokenGoal": "Industrial smart buildings and smart grids rely on wireless mesh networks containing thousands of nodes: Zigbee and Thread. But mesh networks have a unique vulnerability: every router node relays packets for its neighbors! How do you prevent an attacker from introducing a rogue router node that eavesdrops on or redirects building control traffic? Today you master Zigbee 3.0 and Thread Security Architectures. Deconstruct Zigbee 3.0: 1) Network Key (128-bit AES shared by all nodes in the mesh); 2) Trust Center Link Key (TCLK - unique 128-bit key between each node and the central Trust Center coordinator). Analyze why legacy Zigbee was vulnerable: it used the well-known default 'ZigBeeAlliance09' key over the air during joining! Deconstruct Thread Network Security: Thread eliminates weak shared keys entirely! Thread uses DTLS-JPAKE (Password Authenticated Key Exchange by Juggling) for secure commissioning: an installer enters a short human-friendly passphrase, and the device negotiates an ephemeral 256-bit session key immune to offline dictionary attacks!",
    "conceptInvariant": "Thread DTLS-JPAKE & Zero Default Key Invariant: Wireless mesh commissioning must utilize Zero-Knowledge Password Authenticated Key Exchange (DTLS-JPAKE in Thread). Shared, publicly known default network keys (like legacy Zigbee link keys) are strictly prohibited across all operational deployments.",
    "failureMode": "Commissioning a Zigbee mesh using the default unencrypted well-known Trust Center Link Key; an attacker in the parking lot with an 802.15.4 sniffer captures the join exchange and steals the network key, decrypting all smart building HVAC and lighting packets.",
    "tryItFriction": "Build a Thread DTLS-JPAKE Commissioning Simulator in TypeScript: implement the 2-round JPAKE zero-knowledge proof exchange using elliptic curves; verify that both Commissioner and Joiner authenticate using a shared passkey; simulate an attacker sniffing all over-the-air JPAKE packets; prove that the attacker cannot derive the shared secret or execute an offline dictionary attack on the passkey.",
    "socraticHints": [
      "What makes Password Authenticated Key Exchange (PAKE / JPAKE) so revolutionary for IoT devices?",
      "Standard Diffie-Hellman requires PKI certificates, while standard passwords are vulnerable to dictionary attacks if sniffed over the air!",
      "PAKE allows two devices to authenticate using a simple 6-digit pin WITHOUT transmitting the pin or allowing an eavesdropper to test guesses offline!"
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise office installs 1,000 smart Zigbee 3.0 light fixtures. During commissioning, the installer uses standard Zigbee coordinator software that sends the Network Key encrypted with the default Global Link Key (`ZigBeeAlliance09`). A security consultant sits in the lobby with an $8 CC2531 USB sniffer, records a new light joining, decrypts the packet using the well-known key, and recovers the Network Key. The consultant now controls all building lighting. What commissioning standard would have prevented this exploit?",
      "options": [
        "Light fixtures should not be connected to networks.",
        "Install Codes / Thread DTLS-JPAKE: In Zigbee 3.0, devices must mandate Install Codes (a unique 16-byte random key printed on a QR code on each physical device box) rather than the default global key. Even better, modern Thread mesh networks utilize DTLS-JPAKE, which uses zero-knowledge cryptography during commissioning so that even an open sniffer recording every byte cannot recover the network credentials.",
        "Use infrared remotes instead of wireless mesh.",
        "Increase the wireless transmission frequency to 60 GHz."
      ],
      "answerIdx": 1,
      "debrief": "The use of well-known default link keys (like the legacy Zigbee 'ZigBeeAlliance09' key) during device joining is one of the most widely exploited flaws in commercial IoT. Anyone with a cheap 802.15.4 radio can record the joining packet and decrypt the network key. Production Zigbee must mandate Install Codes, and modern systems should adopt Thread/Matter, which mandates DTLS-JPAKE for cryptographically secure commissioning."
    },
    "quests": [
      {
        "num": 1,
        "title": "Zigbee Trust Center vs Thread DTLS-JPAKE Architecture",
        "type": "Concept",
        "description": "Analyze Zigbee 3.0 Network Keys, TCLK update protocols, Install Codes, Thread MLE mesh security, and JPAKE zero-knowledge proofs."
      },
      {
        "num": 2,
        "title": "Global Link Key Sniffing & Building Mesh Hijack Detective",
        "type": "Detective Challenge",
        "description": "Investigate a commercial building automation hack; demonstrate how sniffing an unauthenticated Zigbee join exchange exposed the entire building mesh."
      },
      {
        "num": 3,
        "title": "Thread DTLS-JPAKE Secure Commissioning Engine",
        "type": "Mastery Assignment",
        "description": "Implement a Thread-compatible DTLS-JPAKE commissioning module in C / TypeScript with elliptic-curve zero-knowledge proof validation."
      },
      {
        "num": 4,
        "title": "Wireless Mesh Rogue Node Injection & Eavesdropping Lab",
        "type": "Production Incident Lab",
        "description": "Simulate attempting to inject rogue router nodes and brute-force JPAKE passkeys; verify 100% containment and zero offline dictionary leaks."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "LoRaWAN 1.0.4/1.1 Cryptographic Security: Dual Session Keys & Replay Counter Checks",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Long-Range LPWAN Security (LoRaWAN 1.1, NwkSKey/AppSKey Separation & DevNonce)",
    "spokenGoal": "Long-Range Wide Area Networks (LoRaWAN) transmit sensor packets over 15 kilometers across entire cities. Every gateway within 15 km receives your radio transmission! How does LoRaWAN protect data when packets fly across miles of public airspace? Today you master LoRaWAN 1.0.4 and LoRaWAN 1.1 Cryptographic Security. Deconstruct the Dual Session Key Architecture: 1) Network Session Key (NwkSKey): shared between the end node and the Network Server (LNS); used to calculate a 4-byte Message Integrity Code (MIC) via AES-128-CMAC, preventing packet spoofing; 2) Application Session Key (AppSKey): shared strictly between the end node and the customer's private Application Server; used to encrypt the payload via AES-128-CTR. Crucial Invariant: The telecom network operator handling your gateways CANNOT read your data! Deconstruct LoRaWAN 1.1 advancements: separation of Root Keys (NwkKey vs AppKey), dedicated Join Server (JS), and strict 16-bit monotonic DevNonce enforcement (eliminating Join-Request replay attacks)!",
    "conceptInvariant": "End-to-End Payload Cryptographic Confidentiality Invariant: Application payloads must be encrypted under an Application Session Key (AppSKey) that is never disclosed to network routing infrastructure. Message Integrity (MIC) and 32-bit Frame Counters (FCntUp/Down) must be enforced to reject radio packet replays.",
    "failureMode": "Disabling frame counter validation in an open-source LoRaWAN gateway stack; an attacker records an uplink packet from a soil moisture sensor indicating 'VALVE_CLOSED' and replays it during an emergency, tricking the irrigation controller.",
    "tryItFriction": "Build a LoRaWAN 1.1 Packet Crypto and MIC Verifier in TypeScript: derive NwkSKey and AppSKey from root keys using AES-128 encrypt; encrypt a 12-byte telemetry payload using AES-CTR with rolling keystream blocks; compute the 4-byte AES-CMAC Message Integrity Code (MIC); verify packet authenticity; test an attacker replaying an identical packet with an older Frame Counter (`FCnt <= last_FCnt`); verify immediate packet rejection.",
    "socraticHints": [
      "Why does LoRaWAN use separate keys for the network layer (NwkSKey) and application layer (AppSKey)?",
      "So you can use a commercial third-party telecom operator (like Helium or The Things Network) to route your packets!",
      "The operator's network server uses NwkSKey to verify packet integrity and routing, but has no mathematical ability to decrypt your private application data!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart parking company deploys 5,000 LoRaWAN parking space sensors using LoRaWAN 1.0.2 Activation-by-Personalization (ABP). In ABP mode, the encryption keys and frame counters are hardcoded at the factory. When a sensor battery is replaced, its internal frame counter resets back to 0. The Network Server drops all packets from the rebooted sensor because it previously recorded frame counter 84,200 from that device. The technician 'fixes' the problem by disabling frame counter checks on the server. What vulnerability did the technician just introduce?",
      "options": [
        "The parking sensors will run out of radio frequency.",
        "Replay Vulnerability Across the Entire City: Disabling frame counter verification allows anyone with an SDR to record a 'PARKING_SPACE_OCCUPIED' packet and replay it indefinitely, falsifying parking data. The proper fix is using Over-The-Air Activation (OTAA - LoRaWAN 1.0.4/1.1), where every reboot initiates a fresh Join-Request that negotiates brand-new session keys and resets frame counters securely.",
        "ABP mode is faster than OTAA.",
        "Parking sensors do not transmit radio packets."
      ],
      "answerIdx": 1,
      "debrief": "Disabling frame counter verification on a radio network completely destroys replay protection. An attacker with a cheap radio can capture legitimate packets and replay them at will, spoofing sensor values or triggering false alarms. In production, LoRaWAN deployments must avoid static ABP mode and mandate OTAA (Over-The-Air Activation), which negotiates fresh session keys and resets frame counters cryptographically on every boot."
    },
    "quests": [
      {
        "num": 1,
        "title": "LoRaWAN 1.0.4/1.1 Specifications, Key Separation & MIC Mathematics",
        "type": "Concept",
        "description": "Analyze LoRaWAN root keys (NwkKey, AppKey), KDF derivation math, AES-128-CMAC Message Integrity Codes, and 32-bit FCntUp/Down synchronization."
      },
      {
        "num": 2,
        "title": "Disabling Frame Counters & Smart Parking Replay Sabotage Detective",
        "type": "Detective Challenge",
        "description": "Investigate a municipal smart city sensor breach; prove how disabling LoRaWAN frame counter checks allowed an attacker to falsify parking data."
      },
      {
        "num": 3,
        "title": "LoRaWAN 1.1 Cryptographic Packet Engine",
        "type": "Mastery Assignment",
        "description": "Implement an embedded LoRaWAN cryptographic module in C / TypeScript with AES-CTR payload encryption, AES-CMAC MIC calculation, and FCnt checks."
      },
      {
        "num": 4,
        "title": "LoRaWAN Join-Request Replay & Spoofing Defense Lab",
        "type": "Production Incident Lab",
        "description": "Simulate replaying historical LoRaWAN OTAA Join-Requests and telemetry uplinks; verify 100% rejection and zero key desynchronization."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Wireless Sniffing, Replay Attacks & Jamming Detection: SDR & Chirp Defense",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Physical RF Electronic Countermeasures (SDR Sniffing, Jamming Detection & RSSI Telemetry)",
    "spokenGoal": "What happens when an attacker cannot crack your encryption? They use a sledgehammer: RF Jamming! A $20 handheld radio jammer emitting high-power white noise on 2.4 GHz or Sub-GHz frequencies raises the noise floor, drowning out all legitimate sensor packets and preventing alarms from reaching the cloud! Today you engineer Jamming Detection and Electronic Countermeasures for edge nodes. Deconstruct RF Jamming types: 1) Constant Jamming (continuous carrier wave saturating the receiver frontend); 2) Deceptive Jamming (transmitting continuous valid preambles to lock up receiver state machines); 3) Reactive Jamming (listening for a sensor transmission and jamming only when packets begin). Master Detection Algorithms on embedded transceivers: monitor Clear Channel Assessment (CCA), continuous RSSI spikes above -70 dBm, and Packet Error Rate (PER). If RSSI is high but valid packet reception is zero for 3 consecutive intervals, trigger an RF Jamming Alarm and fall back to wired industrial buses or cellular channels!",
    "conceptInvariant": "Autonomous Jamming Detection & Physical Channel Diversity Invariant: An industrial wireless node must continuously evaluate physical RF channel metrics (RSSI vs PER vs CCA failure rates). When persistent intentional jamming is detected, the device must log an alarm locally and fail over to alternative frequency bands or wired media.",
    "failureMode": "Deploying wireless burglary sensors without jamming detection; burglars activate a pocket 2.4 GHz jammer, enter the facility, and steal assets while the security system quietly suffers complete packet blindness without sounding an alarm.",
    "tryItFriction": "Build an RF Jamming Detection and Anti-Replay Engine in TypeScript: simulate an 802.15.4 / Sub-GHz receiver pipeline monitoring RSSI and packet decode rates; inject simulated constant RF jamming (raising noise floor by 40 dB); implement an automated threshold detector (high RSSI + high CRC failure rate = Jamming); verify that the node detects the jamming condition in under 500 ms and triggers a secondary channel failover.",
    "socraticHints": [
      "Why can't an RF jammer be defeated by software encryption?",
      "Because encryption operates on digital bits inside the demodulated packet!",
      "A jammer operates at the physical electromagnetic layer, preventing the radio receiver from ever demodulating bits out of the analog RF noise!"
    ],
    "situationalPuzzle": {
      "scenario": "A high-security warehouse uses wireless 868 MHz door intrusion sensors. Thieves break into the warehouse by turning on an 868 MHz battery-powered noise transmitter outside the building. The door sensors detect the door opening and transmit alarm packets, but the gateway never receives them because the radio packets are drowned out in noise. The burglary succeeds with zero alarm logs. How should the wireless gateway have been programmed to detect the attack before the door was opened?",
      "options": [
        "Install thicker glass on the windows.",
        "Autonomous RF Noise Floor Telemetry & Jamming Alerts: The gateway must continuously sample the ambient RF RSSI noise floor during idle periods. If the background noise floor rises from normal baseline (-105 dBm) to a saturated high level (-65 dBm) for more than 5 consecutive seconds with zero demodulatable packets, the gateway must immediately recognize intentional RF jamming and trigger an audible physical alarm via wired Ethernet.",
        "Wireless sensors should not be used in warehouses.",
        "The sensor batteries should be recharged."
      ],
      "answerIdx": 1,
      "debrief": "Wireless security systems must protect against physical denial-of-service. An attacker does not need to crack AES encryption if they can drown out the radio ether with RF noise. Modern industrial and security wireless gateways continuously monitor baseline ambient RSSI and Clear Channel Assessment (CCA) failure rates. An abnormal, prolonged spike in noise floor indicates jamming, which must be treated as a physical perimeter breach and reported over wired channels."
    },
    "quests": [
      {
        "num": 1,
        "title": "RF Jamming Physics, SDR Demodulation & Noise Floor Telemetry",
        "type": "Concept",
        "description": "Analyze continuous, deceptive, and reactive RF jamming, SDR spectral waterfalls, CCA failure metrics, and ambient RSSI statistical baselines."
      },
      {
        "num": 2,
        "title": "868 MHz RF Jammer Warehouse Burglary Forensics Detective",
        "type": "Detective Challenge",
        "description": "Investigate a high-value warehouse security failure; prove through RF spectrum logs how intentional carrier jamming blinded the alarm gateway."
      },
      {
        "num": 3,
        "title": "Embedded RF Jamming Detection & Failover Controller Engine",
        "type": "Mastery Assignment",
        "description": "Develop an RF jamming detection module in C / TypeScript with rolling RSSI variance tracking, CCA failure monitoring, and wired failover hooks."
      },
      {
        "num": 4,
        "title": "Full Spectrum Jamming & Replay Electronic Warfare Lab",
        "type": "Production Incident Lab",
        "description": "Subject an emulated multi-band wireless gateway to simultaneous frequency jamming and packet replay; verify 100% jamming detection under 1 second."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone Project 8: Multi-Protocol Wireless IoT Security Monitor & Jamming/Replay Defense Engine",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Architectural Milestone (Complete Wireless Security & Electronic Countermeasures)",
    "spokenGoal": "Congratulations on completing Block 9. Today you build Milestone Project 8: a production-grade Multi-Protocol Wireless IoT Security Monitor and Electronic Countermeasure Engine! Your architecture unifies the wireless security defenses of BLE, Thread, LoRaWAN, and physical RF: 1) A BLE LE Secure Connections (LESC) Security Manager enforcing ECDH P-256 pairing and Numeric Comparison MITM defense; 2) A Thread DTLS-JPAKE Zero-Knowledge Commissioning Engine that authenticates mesh joiners without transmitting plaintext passwords; 3) A LoRaWAN 1.1 Dual Session Key Crypto Engine with strict 32-bit monotonic frame counter replay gating; and 4) An Autonomous RF Jamming Detector that tracks ambient RSSI noise floors and Clear Channel Assessment (CCA) failure rates to detect electronic warfare attacks in under 1 second. Put your milestone under full wireless chaos testing: simulate passive SDR sniffing, active MITM pairing hijacking, replay of old LoRaWAN packets, and sudden high-power RF carrier jamming!",
    "conceptInvariant": "Unified Wireless Cryptographic Defense & Electronic Resiliency Invariant: The wireless security gateway must enforce zero-knowledge authentication (DTLS-JPAKE), forward-secure pairing (LESC), end-to-end payload encryption (LoRaWAN AppSKey), and autonomous physical jamming detection, ensuring that neither cryptographic cryptanalysis nor physical RF noise can blind the industrial system.",
    "failureMode": "Failing to log an RF jamming condition to non-volatile storage before radio link collapse; when power is restored, investigators have no record that a jamming attack occurred prior to system blackout.",
    "tryItFriction": "Construct the Milestone 8 Wireless Security Engine in TypeScript / C: 1) Implement the BLE LESC pairing state machine; 2) Implement the Thread DTLS-JPAKE zero-knowledge verifier; 3) Implement the LoRaWAN 1.1 AES-CTR and AES-CMAC MIC engine with FCnt tracking; 4) Implement the RF jamming RSSI threshold detector; 5) Pass all 25 automated wireless security and electronic warfare assertions.",
    "socraticHints": [
      "Why must the jamming detector save incident logs to internal non-volatile flash (FRAM or EEPROM) immediately upon detection?",
      "Because if the jamming is accompanied by an intentional power cut, volatile RAM data will be wiped!",
      "Writing the jamming incident record to non-volatile storage in milliseconds ensures physical forensic evidence survives total power failure!"
    ],
    "situationalPuzzle": {
      "scenario": "During deployment of Milestone Project 8 across a fleet of smart microgrids, an attacker simultaneously launches two attacks: 1) An active Bluetooth MITM attack attempting to impersonate a technician's tablet; and 2) High-power 2.4 GHz RF jamming to drown out Thread mesh notifications. How does the Milestone 8 gateway maintain operational security and alert operators?",
      "options": [
        "The gateway crashes and needs to be replaced.",
        "Coordinated Defense-in-Depth & Failover Signaling: 1) The BLE LESC engine detects public key alteration during Numeric Comparison and aborts pairing with an unauthorized MITM alarm; 2) The RF jamming monitor detects the 2.4 GHz noise floor spike (-55 dBm) and CCA saturation, immediately declaring a Jamming Emergency; 3) The gateway routes the intrusion alarm over its secondary Sub-GHz LoRaWAN uplink and hardwired RS-485 bus, notifying security while maintaining local grid autonomy.",
        "The gateway waits for the jamming to stop before taking action.",
        "Bluetooth and Thread cannot operate in the same building."
      ],
      "answerIdx": 1,
      "debrief": "Multi-protocol hardware gateways are designed for resilience against multi-vector attacks. When one radio band (e.g. 2.4 GHz) is jammed or subjected to MITM pairing attacks, the gateway isolates the compromised interface, flags the physical interference locally, and immediately dispatches alerts across unjammed alternative physical media (such as Sub-GHz LoRaWAN, cellular LPWAN, or wired industrial Ethernet)."
    },
    "quests": [
      {
        "num": 1,
        "title": "Unified Wireless Security Architecture & Multi-Band Resiliency Blueprint",
        "type": "Concept",
        "description": "Architect the complete firmware specification uniting BLE LESC, Thread DTLS-JPAKE, LoRaWAN 1.1 dual keys, and RF jamming telemetry."
      },
      {
        "num": 2,
        "title": "Simultaneous MITM Pairing & 2.4 GHz RF Jamming Forensics Detective",
        "type": "Detective Challenge",
        "description": "Analyze an electronic warfare attack report; prove how the gateway detected BLE MITM tampering and routed alarms over Sub-GHz channels."
      },
      {
        "num": 3,
        "title": "Milestone 8: Multi-Protocol Wireless IoT Security & Jamming Engine",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 8 engine: BLE LESC + Thread JPAKE + LoRaWAN crypto + RF jamming detector."
      },
      {
        "num": 4,
        "title": "Full Multi-Band Electronic Warfare & Sniffing Defense Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Milestone 8 engine to 5,000 wireless spoofing packets, replayed frames, and carrier noise bursts; verify 100% defense score."
      }
    ]
  }
]
