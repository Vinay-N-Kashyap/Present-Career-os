# scripts/visuals/iot_security_spec_m1.py
# Month 1, Days 1-15 (Blocks 1-3) for Course 19: Industrial IoT Security & Device Lifecycle (course-iot-security)
# Total Quests: 60 Quests (Days 1-15)

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Embedded Attack Surfaces, Threat Modeling & STRIDE for Physical Hardware",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Physical Layer Security Foundations (Threat Modeling & Hardware Perimeters)",
    "spokenGoal": "Welcome to Course 19: Industrial IoT Security and Device Lifecycle. In cloud security, servers sit in biometric-guarded data centers behind physical fences. In IoT, your edge device sits unattended in a public parking garage, an oil pipeline in the desert, or a hospital hallway! An adversary can steal the hardware, solder logic analyzer probes onto serial buses, freeze flash chips with liquid nitrogen, or inject electromagnetic noise! Deconstruct Embedded Threat Modeling using STRIDE: Spoofing (forging device identity), Tampering (modifying firmware or flash), Repudiation (denying telemetry transactions), Information Disclosure (extracting encryption keys via bus sniffing), Denial of Service (jamming RF or draining batteries), and Elevation of Privilege (breaking out of unprivileged RTOS tasks). Calculate DREAD risk scores. Map the Physical Hardware Attack Surface: exposed JTAG/SWD debug headers, unencrypted SPI NOR flash chips, unauthenticated UART console ports, reset glitch lines, and board-level test points!",
    "conceptInvariant": "Physical Access Threat Model Invariant: An edge IoT security architecture must assume the attacker has complete physical possession of the device, unlimited laboratory equipment (oscilloscopes, logic analyzers, decapping acids), and direct electrical access to all PCB traces and silicon pins.",
    "failureMode": "Leaving production JTAG/SWD test pads exposed on a smart electric meter PCB; an attacker solders four header pins, halts the Cortex-M core with an OpenOCD probe, and dumps the plaintext master symmetric AES grid encryption key in 12 seconds.",
    "tryItFriction": "Construct an Embedded STRIDE Threat Matrix and DREAD Risk Scoring Engine in TypeScript: model an industrial water pump gateway; define 6 attack surfaces (JTAG header, external SPI flash, RS-485 Modbus port, BLE antenna, battery power rail, firmware update port); compute DREAD scores (Damage, Reproducibility, Exploitability, Affected Users, Discoverability); verify that physical bus extraction ranks as High Risk (score >= 8.0) and generates automated mitigation mandates.",
    "socraticHints": [
      "Why is cloud software threat modeling (like OWASP Top 10) insufficient for embedded IoT devices?",
      "Because cloud models assume the underlying physical hardware and memory bus cannot be physically probed with wires!",
      "In embedded systems, physical electrical pins (JTAG, SPI, I2C) are directly accessible with cheap multimeters and logic analyzers!"
    ],
    "situationalPuzzle": {
      "scenario": "A solar energy startup deploys 5,000 smart micro-inverters across commercial rooftops. Each inverter uses an STM32 with external SPI NOR flash storing configuration and MQTT credentials. Six months after deployment, customer Wi-Fi passwords and corporate API keys appear on a dark web forum. Firmware analysis shows software TLS was configured correctly. How did the attackers extract the credentials?",
      "options": [
        "Satellite solar flares disrupted the Wi-Fi packets.",
        "Physical Flash Bus Sniffing: The attackers unclipped an inverter enclosure on an accessible rooftop, clipped a $15 SOIC-8 clip to the external SPI flash chip, and read the raw flash memory contents using an SPI programmer in 30 seconds, extracting plaintext API keys and credentials without needing the CPU password.",
        "The inverter's solar cells generated negative electricity.",
        "MQTT brokers automatically publish passwords to the internet."
      ],
      "answerIdx": 1,
      "debrief": "Software security (like TLS) protects data in transit over the network, but does nothing to protect data at rest on exposed hardware buses. External flash memory chips communicate over standard SPI traces on the PCB. Anyone with physical access can clip onto the chip pins and dump the entire memory contents. Plaintext credentials must never be stored in unencrypted external flash."
    },
    "quests": [
      {
        "num": 1,
        "title": "Embedded STRIDE Threat Modeling & Hardware Attack Surfaces",
        "type": "Concept",
        "description": "Deconstruct STRIDE categories applied to physical PCBs, DREAD scoring mathematics, bus snooping physics, and physical boundary definition."
      },
      {
        "num": 2,
        "title": "Exposed JTAG Header & Flash Dumping Crime Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial incident report where a wind farm sensor network was compromised; prove how unmasked PCB test points enabled JTAG firmware extraction."
      },
      {
        "num": 3,
        "title": "Hardware STRIDE Threat Modeling Engine",
        "type": "Mastery Assignment",
        "description": "Implement a programmatic STRIDE/DREAD embedded threat modeling tool in TypeScript that generates risk matrices and mitigation rules for IoT BOM components."
      },
      {
        "num": 4,
        "title": "PCB Test Point Reverse-Engineering Defense Lab",
        "type": "Production Incident Lab",
        "description": "Audit a simulated industrial PCB layout; identify 5 critical hardware attack vectors (JTAG, SPI, UART, VDD, Reset) and generate hardened board re-spin specifications."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Hardware Root of Trust (RoT), Secure Elements & eFuses",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Silicon Security Anchors (Secure Elements, eFuses & Tamper-Resistant Storage)",
    "spokenGoal": "How can software trust itself if malicious code can rewrite software? It cannot! Trust must originate from immutable physics. Today you master the Hardware Root of Trust (RoT). Deconstruct dedicated Secure Elements (such as Microchip ATECC608B and Infineon OPTIGA Trust M): hardened silicon co-processors with internal cryptographic accelerators, high-entropy hardware random number generators (TRNG), active physical shield meshes, and tamper-resistant EEPROM where private keys are generated inside the chip and NEVER leave plaintext silicon registers! Analyze on-chip One-Time Programmable (OTP) eFuses: microscopic polysilicon fuses integrated into the main MCU silicon die. Blowing an eFuse applies a high programming voltage that physically melts the silicon link, permanently changing a bit from 0 to 1 forever! Master eFuse security functions: burning cryptographic public key hashes, locking JTAG debug ports, setting secure boot enforcement flags, and advancing anti-rollback monotonic counters!",
    "conceptInvariant": "Hardware Root of Trust & Key Non-Exportability Invariant: The root private cryptographic key must be stored in hardware registers that are physically incapable of being read by CPU software or external buses. Cryptographic operations (signing, decryption) are executed internally within the Secure Element, returning only operation results.",
    "failureMode": "Storing a device's TLS client private key in internal flash memory accessed via a CPU pointer; an attacker exploits a stack buffer overflow in the network stack, leaks the memory pointer, and clones the device's cryptographic identity.",
    "tryItFriction": "Construct a Secure Element and eFuse Emulation Engine in TypeScript: model an ATECC608B I2C command interface (Sign, Verify, GenKey, KDF); implement a virtual 256-bit eFuse array with irreversible bit-burning logic; verify that once an eFuse bit is blown to 1, subsequent attempts to clear it to 0 fail; prove that private keys in slot 0 can execute ECDSA Sign operations but return errors on raw Read commands.",
    "socraticHints": [
      "Why is a Secure Element more tamper-resistant than the flash memory inside a standard microcontroller?",
      "Secure elements contain active physical shields (microscopic wire grids across the silicon die that detect physical drilling or acid etching) and internal voltage/clock glitch detectors!",
      "Even if an attacker decaps the chip with nitric acid, cutting a shield wire instantly zeroizes all internal cryptographic keys!"
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of smart medical infusion pumps uses an ATECC608B secure element connected via I2C to an STM32 host processor. During security review, an auditor notices that the host firmware requests the private key over I2C during device boot to perform software TLS handshakes. The hardware team argues that the I2C bus is hidden inside the plastic pump housing. What is the fatal security flaw?",
      "options": [
        "I2C cannot transmit numbers larger than 255.",
        "Violating Key Non-Exportability: Requesting private keys across the I2C bus completely invalidates the Secure Element's protection. Anyone tapping the two I2C wires (SDA/SCL) with a logic analyzer sniffs the plaintext private key. The host should instead send the TLS handshake challenge to the Secure Element, which signs the challenge internally and returns only the signature, never the key.",
        "Secure elements only work over SPI, not I2C.",
        "The plastic housing generates static electricity that erases keys."
      ],
      "answerIdx": 1,
      "debrief": "The fundamental design invariant of a Secure Element or HSM is Key Non-Exportability: private keys must never leave the secure silicon perimeter. Cryptographic operations must be executed inside the Secure Element itself (on-chip ECDSA signing or ECDH key agreement). If a host processor asks the secure element to 'send the private key', the secure boundary is breached and the hardware becomes vulnerable to bus sniffing."
    },
    "quests": [
      {
        "num": 1,
        "title": "Secure Elements, eFuse Physics & Hardware Root of Trust",
        "type": "Concept",
        "description": "Analyze silicon root of trust architectures, polysilicon eFuse melting physics, ATECC608B slot configurations, and tamper-resistant physical shielding."
      },
      {
        "num": 2,
        "title": "I2C Bus Private Key Sniffing & Device Cloning Detective",
        "type": "Detective Challenge",
        "description": "Investigate a medical infusion pump hack; prove how exporting private keys over an unencrypted internal I2C bus enabled rogue device cloning."
      },
      {
        "num": 3,
        "title": "Hardware eFuse & Secure Element Simulator Engine",
        "type": "Mastery Assignment",
        "description": "Build a hardware security simulator in C / TypeScript with immutable eFuse bit burning, on-chip key generation, and non-exportable ECDSA signing."
      },
      {
        "num": 4,
        "title": "ATECC608B Hardware Security Provisioning Lab",
        "type": "Production Incident Lab",
        "description": "Configure an ATECC608B configuration zone in software; permanently lock slot 0 for private key derivation; verify that reading slot 0 returns 0xFF / access denied."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Physically Unclonable Functions (PUF) & Cryptographic Key Derivation",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Silicon Fingerprinting (SRAM Startup States, Fuzzy Extractors & Zero Key Storage)",
    "spokenGoal": "What is the most secure place to store a cryptographic key? In no storage at all! If a key does not exist in memory when the device is powered off, an attacker cannot extract it even with electron microscopes! Welcome to Physically Unclonable Functions (PUF). Deconstruct SRAM Startup PUFs: when uninitialized standard SRAM powers up, microscopic nanoscale manufacturing variations in MOSFET gate oxide thickness and silicon doping create random electrical bi-stabilities. Half of the SRAM memory cells power up as 1s, and half power up as 0s! This 50/50 startup pattern is a unique silicon fingerprint per chip, impossible for even the chip foundry to clone! But there is a catch: temperature, aging, and supply voltage fluctuations cause a 5% to 15% bit error rate (noise) across boots! Master Fuzzy Extractors and Helper Data: a secure cryptographic algorithm that uses BCH or Reed-Solomon error-correcting codes to generate Helper Data during enrollment. At runtime, the Helper Data corrects the noisy SRAM startup bits to reconstruct the exact 256-bit cryptographic root key, without ever leaking a single bit of key information!",
    "conceptInvariant": "Zero-At-Rest Key Reconstruction Invariant: A PUF-derived cryptographic key exists only in volatile registers during active computation. Upon power-down or reset, the key vanishes into silicon entropy. The Helper Data stored in non-volatile flash reveals zero mathematical mutual information about the reconstructed key (I(Key; HelperData) = 0).",
    "failureMode": "Failing to implement error-correction helper data on an SRAM PUF; in winter outdoor temperatures (-20°C), thermal noise flips 8% of the startup bits, the reconstructed private key is corrupt, and the device permanently fails TLS authentication, stranding the sensor.",
    "tryItFriction": "Build an SRAM PUF and Fuzzy Extractor Engine in TypeScript: simulate a 1024-cell SRAM array with random silicon threshold variations; generate noisy power-up states with 8% bit flips; implement an enrollment function generating Helper Data via Reed-Solomon / Repetition coding; implement a reconstruction function that successfully restores the exact 256-bit root key under thermal noise while proving zero mutual information leakage.",
    "socraticHints": [
      "Why can't an attacker who reads the Helper Data from flash use it to calculate the device's private key?",
      "Because Helper Data contains only error-correcting syndromes (parity equations) calculated relative to the secret silicon PUF response!",
      "Without the physical chip's unique nanoscale silicon response, the Helper Data alone is mathematically equivalent to random noise!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart defense sensor uses an SRAM PUF to derive its AES-256 storage key. During bench testing at 25°C, key reconstruction succeeded 10,000 times with zero failures. When deployed in an Arctic surveillance perimeter (-30°C), 45% of the sensor units boot into a 'Cryptographic Key Mismatch' panic and halt. Laboratory thermal chamber tests show the SRAM cell startup bit-error rate rose from 3% at room temperature to 11% at -30°C. How must the security architecture be fixed?",
      "options": [
        "Install heating blankets powered by AA batteries on every sensor.",
        "Multi-Stage Concatenated Fuzzy Extractor with Higher Error-Correction Budget: The original enrollment helper data used a lightweight repetition code capable of correcting only up to 5% bit-error rates. Upgrading the Fuzzy Extractor to a concatenated code (BCH + Repetition) capable of correcting up to 15% bit flips guarantees deterministic key reconstruction across the full -40°C to +85°C industrial temperature envelope.",
        "Store the AES key in a text file on an SD card.",
        "Disable encryption when temperatures drop below zero."
      ],
      "answerIdx": 1,
      "debrief": "SRAM PUF startup behavior is temperature-dependent. At extreme temperatures, thermal drift alters cell threshold voltages, increasing the natural bit-error rate (BER) from ~3-5% up to 10-12%. A production-grade Fuzzy Extractor must be designed with an error-correction budget (using BCH or Reed-Solomon codes) that comfortably exceeds the worst-case silicon noise across the entire operational temperature range."
    },
    "quests": [
      {
        "num": 1,
        "title": "Silicon Physics of SRAM PUF & Fuzzy Extractor Mathematics",
        "type": "Concept",
        "description": "Analyze MOSFET threshold voltage variations, SRAM cross-coupled inverter startup bi-stability, Fuzzy Extractor syndromes, and zero-storage security."
      },
      {
        "num": 2,
        "title": "Thermal Noise & Arctic Key Derivation Failure Detective",
        "type": "Detective Challenge",
        "description": "Investigate an Arctic border sensor network boot failure; prove how thermal drift pushed SRAM startup BER beyond the Fuzzy Extractor's correction limit."
      },
      {
        "num": 3,
        "title": "BCH-Corrected SRAM PUF Fuzzy Extractor Engine",
        "type": "Mastery Assignment",
        "description": "Construct a complete PUF key generation and reconstruction module in C / TypeScript with error-correcting codes and zero-at-rest flash persistence."
      },
      {
        "num": 4,
        "title": "SRAM PUF Silicon Aging & Degradation Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Simulate 10 years of silicon Negative Bias Temperature Instability (NBTI) aging on simulated PUF cells; verify key recovery resilience across 100,000 boot cycles."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Hardware Cryptographic Accelerators & Constant-Time Math: Timing Attack Immunity",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Cryptographic Primitives & Side-Channel Defense (Constant-Time Math & AES/ECC Engines)",
    "spokenGoal": "Writing cryptographic algorithms in software is one of the most dangerous things a programmer can do. Even if your math is 100% correct, if your code takes 12 microseconds to check a correct byte and 11 microseconds to check an incorrect byte, an attacker can extract your 256-bit AES key over a Wi-Fi connection simply by measuring network round-trip packet timing! Today you master Hardware Cryptographic Accelerators and Constant-Time Math. Deconstruct on-chip crypto engines: hardware AES-GCM (Galois/Counter Mode for authenticated encryption), SHA-256 hash engines, and Public Key Accelerators (PKA) for ECDSA/Ed25519 big-integer modular arithmetic. Analyze the physics of Timing Side-Channels: software string comparisons (`memcmp` or `==`) abort on the first mismatched byte, creating variable execution time. Master Constant-Time programming invariants: zero secret-dependent branching (`if (secret_bit)` is forbidden!), zero secret-dependent memory lookups (S-box table lookups leak cache lines!), and bitwise constant-time equality operators!",
    "conceptInvariant": "Constant-Time Cryptographic Execution Invariant: Every cryptographic operation, comparison, and key-handling routine must execute in a deterministic, fixed number of CPU clock cycles regardless of key value, plaintext content, or verification success. Secret data must never be used as a branch condition or as an array index.",
    "failureMode": "Using standard C `memcmp()` to verify an HMAC authentication tag on incoming firmware commands; an attacker sends millions of packets, measures microsecond response time variations, and reconstructs the valid 32-byte HMAC byte-by-byte in under 4 hours.",
    "tryItFriction": "Build a Constant-Time vs Variable-Time Verification Bench in TypeScript: implement a vulnerable `variableTimeCompare(a, b)` using standard early-exit loops; implement a `constantTimeCompare(a, b)` using bitwise XOR accumulators `diff |= (a[i] ^ b[i])`; benchmark cycle/time variations across varying mismatch positions; prove that the constant-time algorithm exhibits zero timing leakage across 100,000 iterations.",
    "socraticHints": [
      "Why does `if (secret_key[i] == guess[i])` leak information even if the CPU clock is running at 400 MHz?",
      "Because CPU branch predictors and instruction pipelines execute early exits in fewer clock cycles than full loop traversals!",
      "An attacker averaging thousands of timing measurements with statistical regression can isolate single-clock-cycle differences and infer correct bytes!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart lock manufacturer uses an ARM Cortex-M4 microcontroller. The door lock verifies an 8-digit unlock PIN using `strcmp(stored_pin, entered_pin)`. A university security researcher places an acoustic microphone near the lock to measure the click timing of the CPU interrupt. Within 25 minutes of entering random PINs, the researcher discovers the correct PIN and unlocks the door. What enabled this attack?",
      "options": [
        "The battery was vibrating too loudly.",
        "Timing Side-Channel via Early-Exit Comparison: `strcmp()` returns immediately upon finding the first non-matching character. Entering a PIN with the correct first digit takes 14 nanoseconds longer than an incorrect first digit. By testing digits 0-9 and selecting the one with the maximum execution delay, the attacker cracks each digit independently in 10 attempts instead of brute-forcing 100,000,000 combinations.",
        "Acoustic microphones can read flash memory.",
        "Door locks cannot run C code."
      ],
      "answerIdx": 1,
      "debrief": "Variable-time string comparisons (like `strcmp` or `memcmp`) compare characters sequentially and return as soon as a mismatch is found. This breaks exponential brute-force complexity: instead of 10^8 attempts, an attacker needs only 10 * 8 = 80 attempts! Cryptographic and authentication checks must always use constant-time comparisons that inspect every single byte regardless of mismatch."
    },
    "quests": [
      {
        "num": 1,
        "title": "Constant-Time Cryptography & Timing Attack Physics",
        "type": "Concept",
        "description": "Analyze CPU execution pipeline timing, cache-timing side-channels, bitwise constant-time primitives, and hardware accelerator offloading."
      },
      {
        "num": 2,
        "title": "Variable-Time memcmp HMAC Extraction Detective",
        "type": "Detective Challenge",
        "description": "Analyze network packet traces targeting an IoT gateway; demonstrate how statistical timing analysis extracted a 256-bit authentication HMAC."
      },
      {
        "num": 3,
        "title": "Constant-Time Cryptographic Primitives Engine",
        "type": "Mastery Assignment",
        "description": "Develop a constant-time cryptographic utility library in C / TypeScript featuring constant-time equality, conditional swap, and AES-GCM verification."
      },
      {
        "num": 4,
        "title": "Microsecond Network Timing Attack Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Deploy a simulated network service with timing jitter; launch an automated statistical timing attack tool; prove that constant-time code reduces exploit success to 0%."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone Project 1: Hardware Root of Trust, PUF Key Derivation & Constant-Time Crypto Engine",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Architectural Milestone (Complete Hardware Cryptographic Core & Zero-Storage RoT)",
    "spokenGoal": "Congratulations on completing Block 1. Today you build Milestone Project 1: a complete, production-grade Hardware Root of Trust and Constant-Time Cryptographic Engine for an embedded security gateway! Your architecture must integrate three core systems: 1) An SRAM PUF key derivation module that samples noisy silicon startup states and reconstructs an exact 256-bit master key using a BCH Fuzzy Extractor with zero flash key storage; 2) An on-chip eFuse controller with simulated OTP polysilicon burning for hardware flags and public key pinning; and 3) A Constant-Time Cryptographic Core that performs AES-256-GCM authenticated encryption and HMAC-SHA256 verification with strict clock-cycle determinism. Put your milestone under full adversarial test: inject 10% thermal bit-flip noise into the PUF, attempt timing side-channel statistical attacks against the MAC verifier, and try to overwrite blown eFuses!",
    "conceptInvariant": "Silicon Cryptographic Defense Coexistence Invariant: The embedded system must guarantee that master root keys are derived on-the-fly from physical silicon entropy (zero keys in flash at rest), hardware security flags are irrevocably burned in eFuses, and all authentication comparisons execute in strict constant time immune to microsecond side-channel probing.",
    "failureMode": "Allowing the PUF reconstruction routine to leak intermediate error-correcting syndromes into an uninitialized stack buffer; an unprivileged RTOS task reads the residual stack memory and reverse-engineers the master key.",
    "tryItFriction": "Construct the Milestone 1 Security Engine in TypeScript / C: 1) Implement the 1024-cell SRAM PUF simulator with BCH error correction; 2) Implement an irreversible 128-bit eFuse controller; 3) Implement constant-time AES-GCM and HMAC-SHA256 verification; 4) Validate that all 15 automated security assertions pass (zero timing drift, 100% key reconstruction across noise, zero key persistence in storage).",
    "socraticHints": [
      "Why must volatile SRAM buffers holding PUF keys be explicitly zeroized immediately after use?",
      "Because when an RTOS task switches or a function returns, the CPU stack pointer simply moves, leaving raw key bytes intact in memory!",
      "Any subsequent memory read or core dump can extract the plaintext key unless explicit volatile memory zeroization (`explicit_bzero`) is executed!"
    ],
    "situationalPuzzle": {
      "scenario": "During penetration testing of Milestone Project 1, a security auditor triggers an intentional hardware watchdog reset while the PUF key is being reconstructed in RAM. Upon reboot, the auditor halts the CPU using a debugger and dumps the SRAM. In the uninitialized RAM area from the previous boot, the 256-bit AES master key is found completely intact. What firmware bootloader mechanism was missing?",
      "options": [
        "The microcontroller should have had a higher clock speed.",
        "RAM Scrubbing on Cold/Warm Boot: The first-stage ROM bootloader must execute an unconditional hardware memory scrub (zeroizing the entire SRAM address space from `0x20000000` to RAM_END) immediately upon reset before any application tasks or debug interfaces are initialized, preventing cold-boot and warm-reset memory retention attacks.",
        "RAM chips automatically self-destruct upon reset.",
        "The watchdog timer was too slow."
      ],
      "answerIdx": 1,
      "debrief": "SRAM does not instantly forget data upon a soft reset or momentary power interruption (known as the Cold Boot / Warm Reset attack). Residual capacitance in memory cells preserves bit states for milliseconds to seconds. A secure embedded bootloader must implement mandatory startup memory scrubbing: unconditionally overwriting all SRAM with zeros at the very first instruction before initializing any peripherals."
    },
    "quests": [
      {
        "num": 1,
        "title": "Hardware RoT Architecture & Memory Scrubbing Specification",
        "type": "Concept",
        "description": "Architect the complete firmware specification for zero-storage PUF key derivation, eFuse hardware protection, and cold-boot SRAM scrubbing."
      },
      {
        "num": 2,
        "title": "Warm-Reset SRAM Key Retention & Remanence Detective",
        "type": "Detective Challenge",
        "description": "Diagnose an embedded system vulnerability where post-watchdog reset memory dumps exposed plaintext cryptographic keys; prove lack of startup zeroization."
      },
      {
        "num": 3,
        "title": "Milestone 1: Complete Hardware RoT & Constant-Time Engine",
        "type": "Mastery Assignment",
        "description": "Implement and validate the complete C / TypeScript Milestone 1 security core: SRAM PUF + Fuzzy Extractor + eFuse controller + constant-time MAC engine."
      },
      {
        "num": 4,
        "title": "Automated Hardware Penetration & Timing Attack Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 10,000-probe adversarial penetration test against the Milestone 1 engine; verify zero key leakage, zero timing variance, and 100% eFuse immutability."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Chain of Trust & Immutable ROM Bootloaders: Staged Firmware Verification",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Secure Boot Mechanics (Immutable First-Stage Bootloaders & Key Pinning)",
    "spokenGoal": "Welcome to Block 2: Secure Boot Architectures and Chain of Trust. How can you be certain that the code running on your microcontroller is genuine code written by your engineers, and not malware injected by a hacker? Enter the Chain of Trust. Deconstruct the Staged Bootloader Architecture: 1) Stage 0: The Mask ROM Bootloader. This code is etched directly into the silicon metal layer during chip fabrication at the semiconductor foundry. It is 100% physically immutable—even with physical access, no software, voltage, or laser can modify it! Stage 0 reads the Root of Trust public key hash permanently burned into on-chip eFuses; 2) Stage 1: First-Stage Bootloader (FSBL). Stage 0 verifies the cryptographic signature of Stage 1 before executing it; 3) Stage 2: Second-Stage Bootloader (SSBL / MCUboot / U-Boot). Stage 1 verifies Stage 2; 4) Stage 3: The RTOS Application Firmware. Stage 2 verifies the application! If any link in the chain fails cryptographic signature verification, the boot sequence halts immediately!",
    "conceptInvariant": "Immutable First-Stage Verification Invariant: Execution begins exclusively in write-protected Mask ROM. Every subsequent execution stage (N) must be cryptographically verified (SHA-256 hash match and asymmetric ECDSA/RSA signature validation against pinned eFuse keys) by stage (N-1) BEFORE jumping to the target memory address.",
    "failureMode": "Booting directly from mutable external SPI flash without Mask ROM signature verification; an attacker rewrites the external flash using an SPI programmer, replacing the bootloader with a custom malicious payload that disables all security protections.",
    "tryItFriction": "Build a Multi-Stage Secure Boot Simulator in TypeScript: create Stage 0 (ROM), Stage 1 (FSBL), and Stage 2 (App); configure an eFuse array with a pinned SHA-256 public key hash; implement signature verification at each transition; inject an unauthorized 1-byte firmware modification into the App image; verify that Stage 1 detects the signature mismatch and halts the system before executing malicious code.",
    "socraticHints": [
      "Why can't the entire application firmware be stored in Mask ROM?",
      "Because Mask ROM is etched in silicon at the foundry and cannot be updated to fix software bugs or add new features!",
      "Only the minimal root verification logic (a few kilobytes) lives in Mask ROM, while application code lives in updatable flash memory!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart camera manufacturer implements Secure Boot on an ARM Cortex-M7. The bootloader verifies the application firmware image using an RSA-2048 public key stored in an unencrypted flash sector at `0x08000000`. A security researcher modifies both the application binary AND the public key in flash, signing the malicious binary with their own private key. The device boots the malicious firmware without reporting any errors. What fundamental architectural rule was broken?",
      "options": [
        "RSA-2048 encryption is too weak for cameras.",
        "Mutable Root of Trust: The verification public key was stored in mutable flash rather than being anchored in immutable hardware. By overwriting both the key and the firmware, the researcher created a self-consistent rogue chain of trust. The root public key (or its cryptographic SHA-256 hash) must be permanently burned into on-chip OTP eFuses or Mask ROM.",
        "Cameras should only use symmetric AES keys.",
        "The Cortex-M7 cache was corrupted."
      ],
      "answerIdx": 1,
      "debrief": "A signature verification check is completely meaningless if the public key used for verification can be modified by the attacker. Storing the public key in standard mutable flash allows an attacker to replace both the firmware and the key with their own. The public key (or its SHA-256 fingerprint) must be permanently burned into immutable One-Time Programmable (OTP) eFuses, anchoring the trust chain in unchangeable silicon."
    },
    "quests": [
      {
        "num": 1,
        "title": "Chain of Trust Mechanics & Mask ROM Architecture",
        "type": "Concept",
        "description": "Analyze multi-stage bootloader transitions (ROM -> FSBL -> SSBL -> App), asymmetric signature verification mathematics, and eFuse key anchoring."
      },
      {
        "num": 2,
        "title": "Mutable Verification Key Overwrite & Rogue Chain Detective",
        "type": "Detective Challenge",
        "description": "Investigate a smart surveillance camera breach; prove how storing public keys in standard flash allowed complete bypass of secure boot verification."
      },
      {
        "num": 3,
        "title": "Multi-Stage Cryptographic Secure Boot Engine",
        "type": "Mastery Assignment",
        "description": "Implement a 3-stage secure boot state machine in C / TypeScript with eFuse hash validation, detached signature parsing, and fail-secure halt logic."
      },
      {
        "num": 4,
        "title": "Rogue Firmware Injection & Boot Halting Lab",
        "type": "Production Incident Lab",
        "description": "Subject the secure boot engine to 20 corrupted and forged firmware payloads; verify 100% rejection rate with zero unauthorized execution transitions."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Asymmetric Firmware Signing: ECDSA P-256, Ed25519 & Detached Manifests",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Firmware Cryptographic Packaging (NIST SP 800-193 & Asymmetric Manifests)",
    "spokenGoal": "How is a production firmware binary packaged before release? It is not just raw machine code; it is an authenticated cryptographic container! Today you master Asymmetric Firmware Signing. Deconstruct the algorithms: ECDSA with NIST P-256 versus Edwards-curve Ed25519. Why has Ed25519 become the industry standard for modern IoT? Ed25519 is immune to side-channel timing attacks by design, requires smaller 64-byte signatures and 32-byte public keys, and eliminates ECDSA's catastrophic vulnerability to random number generator (RNG) reuse (where reusing a single ephemeral nonce k leaks the private signing key!). Master Detached Firmware Manifests (compliant with NIST SP 800-193 and MCUboot standards): a structured binary header containing Image Magic (0x96f3b83d), Load Address, Header Size, Image Size, Semantic Version (Major.Minor.Patch.Build), SHA-256 Payload Digest, and the Asymmetric Signature. The bootloader parses the manifest, hashes the payload, and validates the signature in under 50 milliseconds!",
    "conceptInvariant": "Detached Manifest Cryptographic Binding Invariant: The firmware manifest header must be cryptographically bound to the payload binary: the signature covers both the payload hash AND all manifest metadata (version, load address, security counter), preventing metadata tampering or version spoofing.",
    "failureMode": "Signing only the payload binary while leaving the manifest header unauthenticated; an attacker modifies the target load address in the header, tricking the bootloader into flashing the payload over critical configuration sectors.",
    "tryItFriction": "Build an Ed25519 Firmware Signing and Manifest Verifier in TypeScript: generate an Ed25519 keypair; create a structured binary manifest (Magic, Version 2.1.0, Load Address 0x08040000, Payload Hash); sign the manifest and payload; implement the embedded verifier; test tampering with the semantic version field; verify that manifest signature validation fails immediately.",
    "socraticHints": [
      "Why is symmetric encryption (like AES-CBC with a shared key) completely unsuitable for firmware signature verification?",
      "Because if you put a symmetric key in 100,000 devices for verification, anyone extracting the key from one device can sign malicious firmware for the entire fleet!",
      "Asymmetric cryptography uses a private key (kept secret on a secure build server) to sign, and a public key (safe to distribute) to verify!"
    ],
    "situationalPuzzle": {
      "scenario": "A firmware team uses ECDSA P-256 to sign updates for smart thermostats. On their automated CI/CD server, an engineer writes a script that generates signatures using a fixed pseudo-random number generator seed (`k = 12345`). A security researcher notices two different firmware update releases have identical `r` signature values. Within 10 minutes, the researcher publishes the company's master private signing key online. How was the private key recovered?",
      "options": [
        "The CI/CD server hard drive was stolen.",
        "ECDSA Ephemeral Nonce Reuse Catastrophe: In ECDSA, if the same random nonce k is used to sign two different messages (m1 and m2), the signatures share the same r value. The private key d can be calculated instantly via simple modular arithmetic: d = (s1*m2 - s2*m1) / (r*(s2 - s1)) mod n! Using Ed25519 (which derives k deterministically from the private key and message) completely eliminates this vulnerability.",
        "P-256 curves are solved by quantum computers in 2026.",
        "Thermostats don't have enough RAM for ECDSA."
      ],
      "answerIdx": 1,
      "debrief": "The ECDSA random nonce reuse flaw is one of the most famous catastrophic bugs in cryptography history (most notably used to hack the Sony PlayStation 3 in 2010). Reusing the ephemeral nonce k even once across two signatures allows anyone to compute the private signing key in milliseconds. Ed25519 (RFC 8032) eliminates this vulnerability by deriving k deterministically via SHA-512(private_key + message), making nonce reuse mathematically impossible."
    },
    "quests": [
      {
        "num": 1,
        "title": "ECDSA vs Ed25519 Cryptography & Manifest Packaging Math",
        "type": "Concept",
        "description": "Analyze elliptic curve digital signatures, ECDSA nonce derivation pitfalls, Ed25519 deterministic hashing, and NIST SP 800-193 manifest structures."
      },
      {
        "num": 2,
        "title": "Sony PS3 Nonce Reuse & Master Private Key Recovery Detective",
        "type": "Detective Challenge",
        "description": "Reconstruct the mathematical proof demonstrating how reusing ephemeral nonce k across two firmware releases exposes the master private key."
      },
      {
        "num": 3,
        "title": "Ed25519 Firmware Packaging & Manifest Verification Toolchain",
        "type": "Mastery Assignment",
        "description": "Construct a firmware signing CLI and embedded C / TypeScript verification parser conforming to MCUboot structured TLV manifest format."
      },
      {
        "num": 4,
        "title": "Corrupt Manifest Metadata Tampering Injection Lab",
        "type": "Production Incident Lab",
        "description": "Inject corrupted load addresses, mutated version numbers, and bit-flipped payloads into signed manifests; verify 100% cryptographic detection."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Anti-Rollback Protections & Monotonic Counters: Downgrade Attack Mitigation",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Version Lifecycle Security (Downgrade Exploits & Hardware Monotonic eFuses)",
    "spokenGoal": "What good is fixing a critical security vulnerability in Firmware Version 2.0 if an attacker can simply force your device to reinstall Firmware Version 1.0? They don't even need to crack your signature! Version 1.0 was genuinely signed by your company! This is a Downgrade Attack (Rollback Attack). Once an attacker flashes old signed firmware, they exploit the known, patched vulnerability to take full control of the device. Today you engineer Anti-Rollback Protections. Deconstruct Monotonic Counters: special counters that can only ever count UP (increment) and can NEVER be decremented (reset to zero). Analyze physical implementations: 1) Hardware eFuse Blow Counters: an array of 32 or 64 individual polysilicon fuses; when Version 2.0 is installed, fuse bit 2 is permanently melted; 2) Cryptographic Non-Volatile Counters in Secure Elements (e.g. ATECC608B monotonic counters with hardware-enforced rate limits). The bootloader checks: if `firmware_version < hardware_counter`, abort boot immediately!",
    "conceptInvariant": "Monotonic Hardware Version Bound Invariant: A firmware image is valid for execution if and only if its declared Security Counter is greater than or equal to the hardware monotonic counter burned in silicon eFuses (Firmware_Security_Counter >= Hardware_Monotonic_Counter). Downgrades to lower versions are rejected unconditionally.",
    "failureMode": "Storing the anti-rollback version number in standard flash memory or an EEPROM file; an attacker uses an SPI clip to write zero over the version variable, allowing the installation of vulnerable legacy firmware.",
    "tryItFriction": "Build an Anti-Rollback eFuse Verification Engine in TypeScript: implement a 32-bit one-time programmable blow-counter; configure an update pipeline receiving signed firmware packages (v1.0.0 [sec=1], v2.0.0 [sec=2], v1.5.0 [sec=1]); simulate upgrading to v2.0.0 and blowing fuse bit 2; then simulate an attacker attempting to flash genuine v1.0.0; verify that the anti-rollback hardware check rejects the validly signed old firmware.",
    "socraticHints": [
      "Why can't we just use the semantic version string (e.g. '2.1.4') directly as the anti-rollback counter?",
      "Because developers frequently release bug fixes (e.g. 2.1.1 -> 2.1.2) that don't change security boundaries!",
      "A dedicated Security Counter (an integer: 1, 2, 3...) is incremented ONLY when a critical security patch is released that must permanently deprecate all previous firmware versions!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart lock manufacturer discovers a critical buffer overflow in Firmware Version 1.2 that allows anyone to unlock doors via Bluetooth. They release Version 2.0 with a patch and prompt all users to update. A thief purchases an old hotel door lock running Version 2.0, clips a programmer to the flash chip, and flashes the official Version 1.2 binary downloaded from the vendor's website. The lock boots Version 1.2, and the thief unlocks the door via Bluetooth. What security feature was omitted in the lock's bootloader?",
      "options": [
        "Bluetooth should have used a longer antenna.",
        "Missing Hardware Anti-Rollback Enforcement: The bootloader verified asymmetric signatures but lacked an anti-rollback check backed by hardware monotonic counters. Because Version 1.2 had a valid vendor signature, the bootloader happily executed it. If the bootloader had verified that Version 1.2's security counter (1) was lower than the hardware eFuse counter (2), the downgrade would have been blocked.",
        "Hotels cannot use smart locks.",
        "The lock battery had too much voltage."
      ],
      "answerIdx": 1,
      "debrief": "Signature verification alone does NOT prevent downgrade attacks. Legitimate older firmware versions still carry genuine vendor signatures! Without a hardware-enforced monotonic counter (such as an on-chip eFuse array) that tracks the minimum acceptable security version, attackers can revert patched systems back to vulnerable historical versions and exploit known CVEs."
    },
    "quests": [
      {
        "num": 1,
        "title": "Downgrade Attack Physics & Monotonic Counter Mathematics",
        "type": "Concept",
        "description": "Analyze rollback exploit mechanics, monotonic counter hardware architectures, eFuse bit-packing algorithms, and security counter versioning."
      },
      {
        "num": 2,
        "title": "Smart Lock Downgrade Exploit & Theft Investigation Detective",
        "type": "Detective Challenge",
        "description": "Investigate a high-profile smart lock break-in; prove how flashing legitimate older signed firmware bypassed signature gates and enabled Bluetooth exploit."
      },
      {
        "num": 3,
        "title": "Hardware eFuse Monotonic Anti-Rollback Controller Engine",
        "type": "Mastery Assignment",
        "description": "Construct an anti-rollback verification module in C / TypeScript with eFuse blow simulation, manifest security counter parsing, and irreversible version locking."
      },
      {
        "num": 4,
        "title": "Fleet Downgrade Attack Resistance Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Simulate pushing 50 historical firmware versions to an upgraded edge node; verify 100% rejection of legacy versions and successful execution of current versions."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "ARM TrustZone-M & Memory Protection Units (MPU): Secure vs Non-Secure Isolation",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Microcontroller Hardware Compartmentalization (TrustZone-M, SAU & NSC Gateways)",
    "spokenGoal": "In the past, microcontrollers ran all code in a single flat memory space: if an unprivileged network driver had a buffer overflow, the attacker immediately gained full control of the entire chip, including encryption keys and sensor actuators! Today, modern ARM Cortex-M processors (like Cortex-M23, M33, and M55) feature hardware-enforced virtualization: ARM TrustZone-M! TrustZone splits the microcontroller into two distinct hardware states: the Secure World and the Non-Secure World. Deconstruct the Security Attribution Unit (SAU) and Implementation-Defined Attribution Unit (IDAU): they partition physical SRAM and Flash memory into Secure, Non-Secure, and Non-Secure Callable (NSC). The Non-Secure World runs the RTOS, network stacks, and user applications. The Secure World runs cryptographic engines, key storage, and secure bootloaders. Non-secure code CANNOT read or write Secure RAM! To invoke secure services, non-secure code must call through strict Non-Secure Callable (NSC) gateway functions using the `SG` (Secure Gateway) assembly instruction!",
    "conceptInvariant": "Hardware TrustZone-M Isolation Invariant: Non-Secure CPU execution state is physically blocked by hardware bus filters from reading or writing Secure memory addresses. Transitions from Non-Secure to Secure state can occur ONLY via pre-defined Non-Secure Callable (NSC) trampolines executing the atomic `SG` instruction.",
    "failureMode": "Exposing a Secure World function pointer directly to Non-Secure memory without an NSC gateway and `SG` instruction; the CPU triggers a fatal SecureFault interrupt, halting the processor.",
    "tryItFriction": "Build a TrustZone-M Memory Isolation and Gateway Simulator in TypeScript: configure an SAU mapping SRAM into Secure (0x30000000), Non-Secure (0x20000000), and NSC (0x0FE00000); implement state transitions with `SG` instruction checks; simulate an exploit in a non-secure HTTP parser attempting to read an AES key from Secure SRAM; prove that hardware bus access violations trigger immediate SecureFault exceptions.",
    "socraticHints": [
      "What happens if non-secure code tries to branch directly into the middle of a secure function without executing the `SG` instruction?",
      "The hardware security controller detects an invalid security domain transition!",
      "The CPU immediately halts the pipeline and generates a hard SecureFault exception, preventing arbitrary code execution!"
    ],
    "situationalPuzzle": {
      "scenario": "An IoT gateway uses an STM32L5 with ARM TrustZone-M. The non-secure FreeRTOS application manages Wi-Fi and calls a secure NSC function `SECURE_SignTelemetry(data, len, sig)` to sign sensor readings. A security researcher exploits a buffer overflow in the non-secure MQTT library, overwrites the return address on the non-secure stack, and points it to `0x30001000` (the raw AES key memory location inside the Secure World). What happens when the CPU attempts to execute the `RET` instruction?",
      "options": [
        "The CPU prints the AES key to the serial console.",
        "Immediate Hardware SecureFault: The CPU hardware detects an unauthenticated transition from Non-Secure state into Secure memory without passing through an NSC region with the `SG` instruction. The bus matrix blocks the fetch and triggers a hard SecureFault interrupt, isolating the compromised RTOS from the secure crypto assets.",
        "The Wi-Fi antenna resets itself.",
        "TrustZone only protects Flash, not SRAM."
      ],
      "answerIdx": 1,
      "debrief": "ARM TrustZone-M enforces security at the hardware bus level. Even if an attacker achieves complete arbitrary code execution in the Non-Secure World (by hijacking stack pointers or return addresses), they are still constrained by the hardware Non-Secure state. Any direct branch, read, or write into Secure memory without passing through an authorized Non-Secure Callable (NSC) gateway triggers an immediate hardware SecureFault, preventing access to secure keys."
    },
    "quests": [
      {
        "num": 1,
        "title": "TrustZone-M Silicon Architecture & SAU/IDAU Physics",
        "type": "Concept",
        "description": "Analyze ARMv8-M security extensions, Secure vs Non-Secure states, SAU memory partitioning, NSC gateway trampolines, and the SG instruction."
      },
      {
        "num": 2,
        "title": "Non-Secure Memory Escape & SecureFault Trigger Detective",
        "type": "Detective Challenge",
        "description": "Trace a stack buffer overflow attack on an ARM Cortex-M33; demonstrate how hardware bus filters trapped an illegal branch and fired a SecureFault."
      },
      {
        "num": 3,
        "title": "TrustZone-M Memory Partition & NSC Gateway Engine",
        "type": "Mastery Assignment",
        "description": "Implement a TrustZone-M memory protection engine in C / TypeScript with SAU memory maps, NSC callable veneers, and secure crypto dispatch."
      },
      {
        "num": 4,
        "title": "Simulated Compromised RTOS TrustZone Boundary Lab",
        "type": "Production Incident Lab",
        "description": "Simulate a completely hijacked non-secure FreeRTOS kernel attempting 50 unauthorized secure memory operations; verify 100% containment."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone Project 2: Multi-Stage Cryptographically Verified Secure Boot & TrustZone Isolation Engine",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Architectural Milestone (Complete Chain of Trust, Ed25519 Signing & TrustZone)",
    "spokenGoal": "Congratulations on completing Block 2. Today you engineer Milestone Project 2: a complete, production-grade Multi-Stage Secure Boot and TrustZone Isolation Engine! Your firmware architecture must unite three powerful concepts: 1) An immutable Mask ROM Bootloader that validates on-chip eFuse public key hashes before launching the First-Stage Bootloader; 2) An Asymmetric Firmware Verification Pipeline that parses Ed25519 signed manifests, checks anti-rollback monotonic counters, and validates application integrity before execution; and 3) An ARM TrustZone-M Hardware Isolation Core that boots the application into Non-Secure execution state while locking cryptographic keys and signing engines inside the Secure World behind Non-Secure Callable (NSC) veneers. Test your milestone under aggressive attack: inject invalid signatures, attempt rollback downgrades to older versions, and simulate a rogue non-secure task attempting to probe secure memory!",
    "conceptInvariant": "End-to-End Cryptographic Chain & Domain Isolation Invariant: Every byte of executing code must be authenticated back to immutable eFuses before execution, anti-rollback counters must block legacy images, and operational memory must remain strictly isolated between Secure and Non-Secure domains via TrustZone-M hardware enforcement.",
    "failureMode": "Failing to clear CPU general-purpose registers (R0-R12) when transitioning from Secure to Non-Secure world; non-secure code reads leftover register values that contain sensitive key fragments from the secure boot process.",
    "tryItFriction": "Construct the Milestone 2 Secure Boot & TrustZone Engine in TypeScript / C: 1) Implement the 3-stage boot chain (ROM -> FSBL -> App); 2) Implement Ed25519 manifest verification and monotonic counter checks; 3) Implement TrustZone SAU partitioning and NSC gateway veneers; 4) Implement register zeroization on world transitions; 5) Verify that all 20 automated security assertions pass.",
    "socraticHints": [
      "Why must the Secure World zeroize all CPU registers (R0-R3, R12, LR) before branching to Non-Secure code?",
      "Because CPU registers are shared across security states!",
      "If the Secure Bootloader used register R4 to store an intermediate cryptographic hash, that value remains in R4 when Non-Secure code begins executing unless explicitly scrubbed!"
    ],
    "situationalPuzzle": {
      "scenario": "An embedded security team implements TrustZone on an STM32H5. The bootloader successfully validates the Non-Secure OS and executes a non-secure branch. During a code audit, an engineer notices that the Secure Boot function computed an HMAC using registers R1-R4 and immediately executed `BXNS lr` (branch to non-secure) without clearing the registers. The non-secure OS reads R1-R4 on its very first instruction and extracts the HMAC key. What standard instruction sequence was omitted?",
      "options": [
        "The CPU should have been power-cycled.",
        "Missing Register Scrubbing Sequence: Before executing `BXNS` to transition from Secure to Non-Secure state, firmware must execute an explicit register zeroization sequence (`MOV R0, #0`, `MOV R1, #0` ... `MOV R12, #0`) or use compiler intrinsics (`__builtin_arm_cmse_nonsecure_call`) to wipe all caller-saved and callee-saved registers, preventing information leakage across security domains.",
        "TrustZone automatically deletes all registers.",
        "Non-secure code cannot read registers."
      ],
      "answerIdx": 1,
      "debrief": "When transitioning across security domains in ARM TrustZone-M, CPU registers are not automatically cleared by hardware. Any sensitive data left in general-purpose registers (R0-R12, APSR) remains visible to the destination security state. Secure code must always scrub all registers before branching to the Non-Secure world."
    },
    "quests": [
      {
        "num": 1,
        "title": "Secure Boot Chain & TrustZone Transition Architecture",
        "type": "Concept",
        "description": "Architect the complete firmware specification for multi-stage boot verification, anti-rollback checks, register scrubbing, and NSC dispatch."
      },
      {
        "num": 2,
        "title": "Cross-Domain Register Leakage & Key Extraction Detective",
        "type": "Detective Challenge",
        "description": "Analyze an exploit where unscrubbed CPU registers leaked cryptographic tokens during world transition; demonstrate register sniffing."
      },
      {
        "num": 3,
        "title": "Milestone 2: Secure Boot & TrustZone Isolation Firmware Core",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 2 engine: staged Ed25519 bootloader + eFuse monotonic check + SAU TrustZone partition."
      },
      {
        "num": 4,
        "title": "Automated Firmware Injection & SecureFault Validation Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Milestone 2 engine to forged binaries, downgrade attacks, and illegal memory probes; verify 100% containment and fail-secure behavior."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Execute-in-Place (XIP) On-The-Fly Flash Encryption: AES-CTR/XTS Hardware Decoders",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Memory Bus Protection (On-The-Fly Decryption, XIP & Anti-Sniffing)",
    "spokenGoal": "Welcome to Block 3: Flash Encryption and Memory Protection. Microcontrollers frequently run out of internal flash memory, requiring large external SPI or QSPI NOR flash chips to store megabytes of code and assets. But external flash chips communicate over physical copper traces on the circuit board! Anyone with a $15 logic analyzer can clip onto the pins, sniff instructions as they fly across the bus, or inject malicious code! Enter Execute-in-Place (XIP) On-The-Fly Flash Encryption. How can a CPU execute instructions directly from external flash at 100 MHz without decrypting the entire chip into RAM first? Deconstruct hardware on-the-fly decoders (such as AES-CTR or AES-XTS memory controllers): when the CPU instruction fetcher requests an instruction at memory address 0x90001234, the hardware crypto engine intercepts the read request, generates a cryptographic keystream block using the address as a nonce, decrypts the 32-bit instruction on-the-fly in 2 to 4 clock cycles, and delivers it to the CPU pipeline! All data on the external SPI pins is pure high-entropy ciphertext!",
    "conceptInvariant": "Hardware XIP On-The-Fly Decryption Invariant: All code and data stored in external memory must be encrypted at rest using AES-CTR or AES-XTS. Decryption must occur transparently in hardware during cache line refills, ensuring that physical memory bus lines never carry plaintext machine instructions.",
    "failureMode": "Using standard AES-CTR mode with a fixed static initialization vector (IV) across all flash addresses; identical machine instructions (e.g. `NOP` or function prologues) at different addresses produce identical ciphertext patterns, allowing attackers to reconstruct code structure via frequency analysis.",
    "tryItFriction": "Build an XIP Flash Encryption and Hardware Bus Simulator in TypeScript: create a plaintext ARM Cortex-M machine code binary; implement an AES-CTR address-tweaked on-the-fly encryptor where Nonce = f(Base_IV, Address); simulate an external SPI bus trace and show that plaintext instructions are completely obfuscated into uniform high-entropy noise; simulate CPU read requests and verify transparent on-the-fly instruction decoding.",
    "socraticHints": [
      "Why must the AES-CTR initialization vector (nonce) include the memory address of the data being read?",
      "Because if two different memory sectors use the exact same key and nonce, encrypting identical code blocks produces identical ciphertext!",
      "Incorporating the physical address into the keystream nonce guarantees that identical instructions at different addresses produce completely unique ciphertext!"
    ],
    "situationalPuzzle": {
      "scenario": "An engineer designs an edge AI camera with 16 MB external QSPI flash. The engineer enables hardware AES-CTR encryption. However, to save time during manufacturing, the factory writes the exact same 128-bit AES key and static IV to every single camera produced. A hacker extracts the flash chip from camera #1, reads the plaintext code from JTAG (which was left unlocked on that prototype), and computes the keystream. Can the hacker now decrypt flash dumps from camera #2 through #5,000?",
      "options": [
        "No, because each camera has a different serial number.",
        "Complete Fleet Cryptographic Compromise (Keystream Reuse): In AES-CTR mode, Ciphertext = Plaintext XOR Keystream. Because every camera shared the same key and static IV, the keystream was identical across all 5,000 devices! The attacker simply computes Keystream = Plaintext XOR Ciphertext from device #1, and can now decrypt the external flash of every device in the fleet with simple XOR math.",
        "AES-CTR cannot be decrypted without quantum computers.",
        "QSPI flash chips change their encryption key every 24 hours."
      ],
      "answerIdx": 1,
      "debrief": "The cardinal rule of stream ciphers and CTR mode is: NEVER reuse a Key + Nonce pair! If the same keystream is used to encrypt multiple plaintexts, an attacker who obtains just one plaintext can recover the keystream and decrypt all other devices instantly. In production, every device must possess a unique, hardware-bound encryption key burned into on-chip eFuses."
    },
    "quests": [
      {
        "num": 1,
        "title": "XIP Flash Architecture & Hardware On-The-Fly Decryption",
        "type": "Concept",
        "description": "Analyze Execute-in-Place memory controllers, AES-CTR/XTS address-tweak keystream generation, cache refill latency budgets, and SPI sniffing defense."
      },
      {
        "num": 2,
        "title": "Static Keystream Reuse & Fleet Flash Decryption Detective",
        "type": "Detective Challenge",
        "description": "Investigate a commercial IoT fleet breach; demonstrate how factory reuse of static AES-CTR IVs enabled trivial decryption of 5,000 customer devices."
      },
      {
        "num": 3,
        "title": "Address-Tweaked XIP Flash Encryption Engine",
        "type": "Mastery Assignment",
        "description": "Construct an XIP memory emulator in C / TypeScript with address-tweaked AES-CTR encryption, transparent cache line decoding, and zero plaintext leakage."
      },
      {
        "num": 4,
        "title": "QSPI External Bus Sniffing & Ciphertext Entropy Lab",
        "type": "Production Incident Lab",
        "description": "Simulate physical SPI bus sniffing during high-speed code execution; measure Shannon entropy of bus bytes; verify entropy > 7.99 bits/byte."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "JTAG/SWD Debug Port Locking, Anti-Tamper Circuits & Physical Enclosure Defense",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Physical Port Lockdown (Silicon Debug Disabling, Tamper Meshes & Glitch Gating)",
    "spokenGoal": "During development, JTAG and SWD (Serial Wire Debug) are an engineer's best friends: they let you set breakpoints, halt CPU cores, and inspect variables. But once a product ships, JTAG is the ultimate backdoor! An attacker connecting a $20 debugger can halt the CPU, step over password checks, and dump the entire memory. Today you master JTAG/SWD Lockdown and Physical Anti-Tamper Defenses. Deconstruct Silicon Debug Disabling: modern microcontrollers feature eFuses dedicated to debug configuration (e.g. STM32 RDP levels, NXP Lifecycle states, ESP32 JTAG disable eFuse). Burning the debug disable eFuse permanently disconnects the physical JTAG/SWD hardware pads from the CPU core logic inside the silicon die! Deconstruct Physical Anti-Tamper Perimeters: 1) Active Enclosure Tamper Loops: conductive mesh traces running through the plastic housing; if the enclosure is opened, the loop breaks; 2) Tamper Pins with Battery Backup: low-power RTC tamper pins that instantly trigger hardware zeroization (scrubbing internal cryptographic keys in under 50 nanoseconds) upon lid opening!",
    "conceptInvariant": "Irreversible Debug Disabling & Active Tamper Zeroization Invariant: Production silicon must permanently disconnect JTAG/SWD debug controllers via irreversible hardware eFuse blowing. Physical enclosure intrusion must trigger instantaneous hardware zeroization of all ephemeral keys and non-volatile secure storage registers.",
    "failureMode": "Relying on software firmware code to disable JTAG during boot; an attacker asserts the hardware RESET line, pulls the JTAG clock low, and enters debug halt mode before the firmware executes its first instruction.",
    "tryItFriction": "Build an Anti-Tamper and Debug Port Lock Controller in TypeScript: model an MCU security lifecycle state machine (Open -> Secure -> Sealed); implement an irreversible eFuse debug-lock operation; simulate external tamper pin triggers (enclosure switch opening, mesh trace cutting); verify that tamper events execute atomic zeroization of key registers within simulated clock cycle constraints.",
    "socraticHints": [
      "Why can't software boot code reliably protect JTAG ports?",
      "Because hardware debuggers can halt the CPU at the reset vector before the first line of boot code executes!",
      "Debug disabling must be enforced in silicon hardware via burned eFuses that physically gate the debug TAP controller!"
    ],
    "situationalPuzzle": {
      "scenario": "A financial payment terminal (Point-of-Sale / POS) uses an ARM Cortex-M33. The firmware disables JTAG in the main `setup()` function. A team of card skimmers connects a JTAG probe, holds the hardware NRST pin low while issuing JTAG HALT commands, and releases reset. The CPU halts at address `0x00000000` before `setup()` can run. The skimmers dump the firmware and inject card-skimming malware. What hardware security step was omitted during manufacturing?",
      "options": [
        "The POS terminal needed a bigger LCD screen.",
        "Irreversible Silicon Hardware Debug Lockdown: Software-based debug disabling is trivially bypassed using reset-vector halting. The manufacturing line must burn the permanent silicon eFuse (e.g., STM32 RDP Level 2 or JTAG disable fuse) that physically severs the JTAG TAP controller logic on the die, permanently disabling debug access regardless of reset timing.",
        "Payment terminals do not need JTAG protection.",
        "The battery voltage was too high."
      ],
      "answerIdx": 1,
      "debrief": "Software cannot protect against hardware interfaces that operate at a lower level than software itself. Hardware debuggers (JTAG/SWD) have the capability to halt the processor directly out of reset before any software instructions execute. In production hardware, JTAG must be permanently disabled by blowing dedicated silicon eFuses that physically disconnect the debug logic inside the chip."
    },
    "quests": [
      {
        "num": 1,
        "title": "JTAG/SWD Silicon Architecture & Hardware Debug Locking",
        "type": "Concept",
        "description": "Analyze JTAG TAP state machines, Serial Wire Debug protocols, eFuse debug disconnect circuits, and hardware lifecycle transitions."
      },
      {
        "num": 2,
        "title": "Reset-Vector JTAG Halt & POS Payment Skimmer Detective",
        "type": "Detective Challenge",
        "description": "Investigate a retail POS payment terminal breach; prove how software-based JTAG disabling was bypassed using hardware reset halting."
      },
      {
        "num": 3,
        "title": "Anti-Tamper & Instant Zeroization Controller Engine",
        "type": "Mastery Assignment",
        "description": "Construct an embedded tamper detection driver in C / TypeScript with active mesh monitoring, RTC backup domain isolation, and 50ns key zeroization."
      },
      {
        "num": 4,
        "title": "Silicon Lifecycle State Machine Production Lab",
        "type": "Production Incident Lab",
        "description": "Transition an emulated device through Open, Provisioned, and Sealed states; verify that Sealed state permanently rejects all debugger attach requests."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Side-Channel Analysis (SCA) & Differential Power Analysis (DPA): Hardware Masking Defenses",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Advanced Physical Cryptanalysis (Power Consumption Profiling & Boolean Masking)",
    "spokenGoal": "Every time a transistor in a CMOS microcontroller switches from 0 to 1, it draws a tiny pulse of electrical current from the power supply. When a CPU executes an AES encryption round, computing S-box substitutions on different key bits creates distinct electrical power consumption waves! An attacker placing an oscilloscope current probe on the VDD power pin can record 5,000 power traces and use Differential Power Analysis (DPA) to extract the 256-bit AES key in minutes without touching a single memory bus! Today you master Side-Channel Analysis (SCA) and Hardware Masking Defenses. Deconstruct Simple Power Analysis (SPA) versus Differential Power Analysis (DPA): SPA inspects trace shapes directly; DPA uses statistical Pearson correlation between measured power traces and hypothetical intermediate values (like the output of the first AES S-Box). Master Countermeasures: 1) Boolean Masking: split every secret byte X into two random shares: X = M ^ (X ^ M), where M is a fresh random mask. Every crypto operation processes masked shares independently; 2) Clock Jittering and Dummy Cycles: randomly vary CPU clock edges to misalign oscilloscope traces!",
    "conceptInvariant": "First-Order DPA Resistance & Boolean Masking Invariant: Every intermediate cryptographic value must be split into statistically independent random shares (X = Share_A ^ Share_B). The power consumption of any single share must exhibit zero statistical correlation with the unmasked secret value.",
    "failureMode": "Deploying an unmasked AES implementation on an industrial motor controller; an attacker with an entry-level oscilloscope clips onto the power decoupling capacitor, records 2,000 motor start encryptions, and recovers the master AES key via correlation power analysis.",
    "tryItFriction": "Build a Differential Power Analysis (DPA) Simulator and Masking Engine in TypeScript: simulate power traces of an unmasked AES S-Box lookup using Hamming Weight model; demonstrate that a Pearson Correlation analysis recovers the secret key byte; then implement Boolean Masking with fresh random masks; re-run the DPA attack across 10,000 simulated traces; prove that the correlation peak collapses to zero noise.",
    "socraticHints": [
      "Why does power consumption correlate with the data being processed by a microcontroller?",
      "In CMOS technology, energy is consumed primarily when charging and discharging parasitic gate capacitances!",
      "Processing a byte with eight 1s (0xFF) flips more transistors and draws noticeably more current than processing a byte with zero 1s (0x00)!"
    ],
    "situationalPuzzle": {
      "scenario": "An aerospace company tests an encrypted telemetry node against Differential Power Analysis (DPA). The software team adds random `NOP` delay instructions between AES rounds to create clock jitter and misalign power traces. The team believes this completely solves DPA. A specialized lab tests the node, uses dynamic time warping (DTW) and phase correlation to realign the traces, and recovers the AES key in 3 hours. What fundamental flaw existed in the jitter defense?",
      "options": [
        "Aerospace telemetry cannot be encrypted.",
        "Clock Jitter is Security through Obscurity: Random delays only misalign traces; they do NOT break the fundamental correlation between data values and power consumption. Signal processing algorithms (like trace realignment and peak alignment) trivially undo jitter. The only mathematically provable defense is Boolean Masking, which removes the physical correlation between data and power consumption entirely.",
        "The oscilloscope had too much memory.",
        "Power supplies do not conduct electricity."
      ],
      "answerIdx": 1,
      "debrief": "Clock jittering and dummy instruction insertion are heuristic obfuscation techniques, not cryptographic defenses. They make trace capture noisier, but advanced signal processing (such as Dynamic Time Warping, elastic alignment, and integration) easily realigns the power waveforms. The gold-standard defense against DPA is Boolean Masking, which mathematically separates secrets into independent random shares, ensuring power consumption is statistically independent of key data."
    },
    "quests": [
      {
        "num": 1,
        "title": "CMOS Power Physics, Hamming Weight & DPA Mathematical Formulations",
        "type": "Concept",
        "description": "Analyze transistor dynamic power consumption, Hamming Weight / Hamming Distance leakage models, Pearson correlation math, and DPA attack workflows."
      },
      {
        "num": 2,
        "title": "Dynamic Time Warping vs Clock Jitter Obfuscation Detective",
        "type": "Detective Challenge",
        "description": "Analyze an aerospace DPA vulnerability report; demonstrate how trace realignment algorithms defeated software dummy instruction jitter."
      },
      {
        "num": 3,
        "title": "Boolean Masked AES S-Box & DPA-Resistant Core Engine",
        "type": "Mastery Assignment",
        "description": "Develop a first-order Boolean masked AES engine in C / TypeScript where S-Box lookups and ShiftRows operate entirely on randomized dual shares."
      },
      {
        "num": 4,
        "title": "Correlation Power Analysis (CPA) Attack & Defense Lab",
        "type": "Production Incident Lab",
        "description": "Execute a CPA attack across 5,000 power traces; prove that unmasked AES leaks key bytes at correlation > 0.8 while masked AES suppresses correlation to < 0.05."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Fault Injection Attacks & Electromagnetic Fault Injection (EMFI): Hardware Glitch Resilience",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Physical Perturbation Defense (Voltage Glitching, Laser/EMFI & Fault-Hardening)",
    "spokenGoal": "What happens when a CPU instruction cannot be trusted to execute correctly? An attacker does not rewrite your code; they physically corrupt the CPU during execution! Welcome to Fault Injection Attacks and Electromagnetic Fault Injection (EMFI). Deconstruct the physics: 1) Voltage Glitching: dropping the VDD power supply rail to ground for 15 nanoseconds during a specific clock cycle; transistors fail to switch in time, causing the CPU to fetch a `NOP` (0xBF00) instead of a conditional branch; 2) Clock Glitching: inserting an ultra-short clock pulse that violates setup-and-hold timing; 3) EMFI (Electromagnetic Fault Injection): pulsing a localized electromagnetic field with a micro-coil over the silicon die to induce eddy currents and flip register bits! An attacker uses a 15ns voltage dip to skip `if (verify_signature() == SUCCESS)` and force the bootloader to execute unauthorized code! Master Hardware & Software Defenses: redundant double-checking (`if (auth == OK) { if (auth != OK) halt(); }`), random execution delays, inverted state representations, and hardware brown-out glitch detectors!",
    "conceptInvariant": "Redundant Verification & Inverted State Machine Invariant: Critical security decisions must never depend on a single Boolean comparison or single-instruction branch. Verification must employ redundant multi-condition checks, non-zero authorization tokens (e.g. 0x5A5A5A5A instead of 0x00000001), and dual-rail variable representations.",
    "failureMode": "Using a simple `if (signature_valid)` branch in a secure bootloader; an attacker injects a 20ns voltage drop on VDD, the `CBZ` (Compare and Branch on Zero) instruction turns into a `NOP`, and the CPU bypasses signature verification completely.",
    "tryItFriction": "Build a Fault Injection Simulator and Glitch-Resilient Firmware Engine in TypeScript: implement a vulnerable signature check with a single `if (valid == 1)` branch; simulate instruction skipping faults; demonstrate that a 1-instruction glitch achieves 100% security bypass; then implement glitch-hardened defenses (Redundant Double-Checks, Step-Check Monotonic Counters, and Multi-Bit Hamming Distance Tokens 0xAA55AA55); re-run fault injection and prove 0% bypass rate.",
    "socraticHints": [
      "Why is `boolean isAuthenticated = true (1)` or `false (0)` a dangerous design pattern in embedded security?",
      "Because a single bit flip caused by electrical noise or voltage glitching can change 0 to 1!",
      "Using a 32-bit token with high Hamming distance (like `AUTH_SUCCESS = 0xA5A5A5A5` and `AUTH_FAILURE = 0x5A5A5A5A`) requires 16 simultaneous bit flips to forge, which is virtually impossible!"
    ],
    "situationalPuzzle": {
      "scenario": "A hardware hacker attacks a smart electricity meter with an ARM Cortex-M0+. The meter's bootloader verifies firmware signatures and branches: `CMP r0, #0; BEQ reject_boot; BL execute_app`. The hacker connects an FPGA-controlled MOSFET to the VDD pin, triggering a 25ns ground pulse exactly when the `BEQ` instruction is fetched. The meter skips the branch and boots an unsigned firmware image. How must the software be refactored to resist instruction skipping?",
      "options": [
        "Use a thicker PCB laminate.",
        "Redundant Dual-Check with Asymmetric Token Validation: Replace the single branch with a hardened sequence: 1) Verify that the result matches a multi-bit token `0x3C5A6996`; 2) Execute a secondary confirmation check located at a non-adjacent instruction offset; 3) Check that an execution flow canary counter matches the expected sequence. Glitching a single instruction cannot satisfy multiple distributed checks.",
        "Electricity meters cannot be glitched.",
        "Increase the clock frequency to 1 GHz."
      ],
      "answerIdx": 1,
      "debrief": "Instruction skipping via voltage glitching or EMFI typically targets single branch instructions (`BEQ`, `BNE`, `CBZ`). If the branch instruction fails to execute, the program falls through to the next sequential instruction. Hardened firmware distributes the authorization check across multiple instructions, uses multi-bit validation tokens with high Hamming weight, and validates execution flow canaries, requiring multiple impossible simultaneous glitches to bypass."
    },
    "quests": [
      {
        "num": 1,
        "title": "Voltage Glitching, EMFI Physics & Instruction Skipping Mechanics",
        "type": "Concept",
        "description": "Analyze setup-and-hold timing violations, MOSFET crowbar glitching circuits, EMFI probe physics, and opcode corruption dynamics."
      },
      {
        "num": 2,
        "title": "VDD Crowbar Pulse & Smart Meter Firmware Bypass Detective",
        "type": "Detective Challenge",
        "description": "Investigate a hardware lab report where a smart meter's secure boot was bypassed via voltage glitching; quantify pulse timing margins."
      },
      {
        "num": 3,
        "title": "Glitch-Resilient Firmware Hardening & Flow Canary Engine",
        "type": "Mastery Assignment",
        "description": "Develop a fault-injection-hardened security evaluation library in C / TypeScript with multi-bit tokens, inverted state logic, and execution canaries."
      },
      {
        "num": 4,
        "title": "Automated Laser & Voltage Fault Injection Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Subject firmware verification routines to 10,000 simulated instruction-skipping glitches; prove that hardened logic achieves 0% bypass rate."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone Project 3: Anti-Tamper, DPA-Masked & Fault-Injection-Hardened Firmware Core Engine",
    "stageName": "Stage 1: Hardware Roots of Trust & Cryptography",
    "stageNum": 1,
    "pedagogicalRole": "Architectural Milestone (Complete Physical Layer Security Synthesis)",
    "spokenGoal": "Congratulations on completing Block 3. Today you engineer Milestone Project 3: the ultimate Physical Layer Hardware-Hardened Security Engine! Your architecture synthesizes the defenses of the entire first half of Month 1 against advanced laboratory physical attacks: 1) An XIP Flash Encryption controller with address-tweaked AES-CTR keystream generation; 2) A JTAG/SWD silicon lifecycle lock with active enclosure tamper monitoring and 50-nanosecond hardware key zeroization; 3) A First-Order Boolean-Masked Cryptographic Core that executes AES operations on dual random shares with zero statistical power correlation; and 4) A Fault-Injection-Hardened Decision Engine utilizing multi-bit tokens, redundant flow canaries, and inverted state machines immune to voltage glitching and instruction skipping! Put your engine through a comprehensive simulated physical lab penetration audit: simulate bus sniffing, trigger enclosure tamper switches, launch DPA attacks on power traces, and fire 5,000 voltage glitches!",
    "conceptInvariant": "Physical Hardening Unified Invariant: The embedded system must guarantee that external buses carry only high-entropy ciphertext, JTAG debug taps are permanently gated in silicon, power consumption exhibits zero correlation with cryptographic keys (DPA resistance), and security decisions withstand instruction-skipping physical glitches without compromising safe-state halting.",
    "failureMode": "Failing to mask the AES key during the initial key-expansion phase; although all 10 AES rounds are masked, an attacker performs DPA on the unmasked key expansion routine, recovering the master key in the first 50 traces.",
    "tryItFriction": "Construct the Milestone 3 Physical Hardening Engine in TypeScript / C: 1) Implement address-tweaked XIP flash encryption; 2) Implement active tamper detection with key zeroization; 3) Implement end-to-end Boolean masked AES (including key expansion); 4) Implement fault-hardened verification flow with 32-bit tokens; 5) Pass all 25 automated physical security assertions.",
    "socraticHints": [
      "Why must the AES key expansion (generating round keys) be masked in addition to the encryption rounds?",
      "Because key expansion processes secret key bytes directly using the AES S-Box!",
      "If key expansion is unmasked, power leakage during round key generation completely compromises the master key before round 1 even begins!"
    ],
    "situationalPuzzle": {
      "scenario": "A tier-1 defense contractor submits their secure crypto module for FIPS 140-3 Level 4 physical security certification. The module features active tamper enclosure meshes, JTAG eFuse locks, and masked AES-256. During testing, the evaluation lab injects a 30ns voltage glitch simultaneously with an enclosure breach tamper event. Because the tamper interrupt handler used a standard `if (tamper == true)` check, the glitch caused the CPU to skip the key zeroization call, preserving keys in memory. What architectural refactor is required?",
      "options": [
        "Replace the processor with a vacuum tube.",
        "Hardware-Autonomous Asynchronous Zeroization Circuit: Key zeroization must NOT rely on software CPU interrupt handlers or instruction execution! It must be wired to a dedicated autonomous hardware state machine or analog crowbar circuit in the battery-backed RTC domain that discharges key retention capacitors directly to ground via hardware gates, operating completely independently of CPU clock, instruction pipeline, or glitch states.",
        "Disable tamper detection to prevent glitch collisions.",
        "Use software delays to slow down the glitch."
      ],
      "answerIdx": 1,
      "debrief": "In FIPS 140-3 Level 4 and Common Criteria EAL6+ certified hardware, critical zeroization must never rely on software CPU execution. A software interrupt handler can be interrupted, glitched, or starved by higher-priority faults. Zeroization must be handled by autonomous analog or hardware circuits in the secure silicon domain that physically ground key registers in nanoseconds upon tamper switch activation, completely bypassing the CPU."
    },
    "quests": [
      {
        "num": 1,
        "title": "Physical Security Synthesis & FIPS 140-3 Level 4 Requirements",
        "type": "Concept",
        "description": "Analyze physical tamper boundaries, hardware-autonomous zeroization circuits, masked key expansion mathematics, and glitch fault mitigation."
      },
      {
        "num": 2,
        "title": "Software Tamper Handler Glitch & Zeroization Bypass Detective",
        "type": "Detective Challenge",
        "description": "Investigate a high-security module certification failure; prove how voltage glitching during a tamper interrupt prevented software key erasure."
      },
      {
        "num": 3,
        "title": "Milestone 3: Complete Physical Hardening Security Core Engine",
        "type": "Mastery Assignment",
        "description": "Implement and validate the complete C / TypeScript Milestone 3 security core: XIP flash encryption + masked AES + glitch-hardened verification flow."
      },
      {
        "num": 4,
        "title": "Full Physical Attack Surface Adversarial Penetration Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Milestone 3 engine to simultaneous bus sniffing, DPA correlation, and voltage glitching; achieve 100% defense score across all vectors."
      }
    ]
  }
]
