// scripts/visuals/iot-security-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Industrial IoT Security & Device Lifecycle (course-iot-security)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, Embedded Threat Modeling (STRIDE/DREAD),
// Hardware Roots of Trust (SRAM PUFs, ATECC608B, eFuses), Immutable Mask ROM Secure Boot, Asymmetric Ed25519 Manifests,
// Anti-Rollback Monotonic Counters, ARM TrustZone-M Memory Isolation, XIP On-The-Fly Flash Encryption (AES-CTR/XTS),
// JTAG/SWD Silicon Lockdown, Boolean Masked AES (DPA Resistance), Fault Injection Resilience, IEEE 802.1AR Device Identity,
// Zero-Heap ASN.1 DER X.509 Parsers, TLS 1.3 mTLS over Port 443 with ALPN, Air-Gapped Factory HSM Provisioning,
// FIDO Device Onboard (FDO) Late-Binding, IETF SUIT Manifest FOTA (RFC 9019), Dual-Bank A/B Flash with Task-Gated Watchdogs,
// IEC 62351-08 Modbus Security, AUTOSAR SecOC CAN-FD with Freshness Values, OPC UA Part 4/12 Basic256Sha256,
// Purdue Model Industrial DMZ Data Diodes, BLE LESC (ECDH P-256), Thread DTLS-JPAKE Zero-Knowledge Mesh, LoRaWAN 1.1 Dual Keys,
// Autonomous RF Jamming Detection, MPU Task Stack Guards with TRNG Canaries, Embedded HIDS Syscall Whitelisting,
// Static ARP Gating & Traffic Entropy, CycloneDX SBOM Generation, and NIST SP 800-88 Cryptographic Sanitization (Crypto-Shredding).

import { MasterclassDaySpec } from './java-masterclass-spec';

export const IOT_SECURITY_MONTH_1_SPECS: MasterclassDaySpec[] = [
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
    "failureMode": "Failing to implement error-correction helper data on an SRAM PUF; in winter outdoor temperatures (-20\u00b0C), thermal noise flips 8% of the startup bits, the reconstructed private key is corrupt, and the device permanently fails TLS authentication, stranding the sensor.",
    "tryItFriction": "Build an SRAM PUF and Fuzzy Extractor Engine in TypeScript: simulate a 1024-cell SRAM array with random silicon threshold variations; generate noisy power-up states with 8% bit flips; implement an enrollment function generating Helper Data via Reed-Solomon / Repetition coding; implement a reconstruction function that successfully restores the exact 256-bit root key under thermal noise while proving zero mutual information leakage.",
    "socraticHints": [
      "Why can't an attacker who reads the Helper Data from flash use it to calculate the device's private key?",
      "Because Helper Data contains only error-correcting syndromes (parity equations) calculated relative to the secret silicon PUF response!",
      "Without the physical chip's unique nanoscale silicon response, the Helper Data alone is mathematically equivalent to random noise!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart defense sensor uses an SRAM PUF to derive its AES-256 storage key. During bench testing at 25\u00b0C, key reconstruction succeeded 10,000 times with zero failures. When deployed in an Arctic surveillance perimeter (-30\u00b0C), 45% of the sensor units boot into a 'Cryptographic Key Mismatch' panic and halt. Laboratory thermal chamber tests show the SRAM cell startup bit-error rate rose from 3% at room temperature to 11% at -30\u00b0C. How must the security architecture be fixed?",
      "options": [
        "Install heating blankets powered by AA batteries on every sensor.",
        "Multi-Stage Concatenated Fuzzy Extractor with Higher Error-Correction Budget: The original enrollment helper data used a lightweight repetition code capable of correcting only up to 5% bit-error rates. Upgrading the Fuzzy Extractor to a concatenated code (BCH + Repetition) capable of correcting up to 15% bit flips guarantees deterministic key reconstruction across the full -40\u00b0C to +85\u00b0C industrial temperature envelope.",
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
    "spokenGoal": "Welcome to Block 2: Secure Boot Architectures and Chain of Trust. How can you be certain that the code running on your microcontroller is genuine code written by your engineers, and not malware injected by a hacker? Enter the Chain of Trust. Deconstruct the Staged Bootloader Architecture: 1) Stage 0: The Mask ROM Bootloader. This code is etched directly into the silicon metal layer during chip fabrication at the semiconductor foundry. It is 100% physically immutable\u2014even with physical access, no software, voltage, or laser can modify it! Stage 0 reads the Root of Trust public key hash permanently burned into on-chip eFuses; 2) Stage 1: First-Stage Bootloader (FSBL). Stage 0 verifies the cryptographic signature of Stage 1 before executing it; 3) Stage 2: Second-Stage Bootloader (SSBL / MCUboot / U-Boot). Stage 1 verifies Stage 2; 4) Stage 3: The RTOS Application Firmware. Stage 2 verifies the application! If any link in the chain fails cryptographic signature verification, the boot sequence halts immediately!",
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
  },
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Public Key Infrastructure (PKI) for IoT & IEEE 802.1AR Secure Device Identity",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Cryptographic Device Identity (IEEE 802.1AR, IDevID vs LDevID & Certificate Chains)",
    "spokenGoal": "Welcome to Stage 2: Secure Identity, Provisioning, and Cloud Onboarding. In a fleet of 500,000 smart electric meters, how does the utility company prove that a connecting device is an authentic factory-manufactured meter, and not a malicious laptop impersonating one? Enter Public Key Infrastructure (PKI) and IEEE 802.1AR Secure Device Identity. Deconstruct the dual-identity architecture: 1) Initial Device Identifier (IDevID): a permanent, immutable X.509 certificate and private key injected into the device's Secure Element during manufacturing at the factory. The IDevID is signed by the silicon vendor's Root CA and cannot be modified or revoked for the lifetime of the hardware; 2) Locally Significant Device Identifier (LDevID): an operational certificate issued by the customer's enterprise CA during field deployment. The LDevID can be rotated or revoked when the device is transferred between networks. Trace the Certificate Chain: Root CA -> Intermediate Issuing CA -> Device Certificate. Understand how trust delegates hierarchically across cryptographic signatures!",
    "conceptInvariant": "IEEE 802.1AR Dual Identity Invariant: Every industrial device must carry an immutable, non-exportable Initial Device Identifier (IDevID) anchored in silicon at the factory. Operational network access must use a Locally Significant Device Identifier (LDevID) provisioned via authenticated enrollment, ensuring separation between silicon provenance and enterprise tenancy.",
    "failureMode": "Hardcoding a single shared enterprise Root CA certificate in firmware flash with no IDevID; when an attacker extracts the root key from one decommissioned test device, they forge valid identities for unlimited rogue nodes.",
    "tryItFriction": "Build an IEEE 802.1AR Identity Management and Verification Engine in TypeScript: generate Root CA and Factory Sub-CA keypairs; issue an IDevID certificate containing the hardware serial number (EUI-64) in the Subject Alternative Name (SAN); simulate field onboarding by using the IDevID to authenticate an LDevID Certificate Signing Request (CSR); verify the complete cryptographic chain of trust.",
    "socraticHints": [
      "Why must the IDevID private key be generated inside the Secure Element rather than injected by a PC over USB?",
      "If a PC generates the key, a rogue factory worker or compromised computer can save a copy of the private key!",
      "If the Secure Element generates its own keypair on-chip, the private key is born in silicon and NEVER leaves the chip die, guaranteeing 100% provenance!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart metering utility company purchases 100,000 gas meters. During deployment, a disgruntled subcontractor clones 500 meters by copying their flash memory chips and begins transmitting falsified low gas consumption readings to defraud the utility. The utility discovers the fraud because all 500 cloned meters share the same MAC address and credentials. What standard would have made cloning mathematically impossible?",
      "options": [
        "Using 4G instead of Wi-Fi.",
        "IEEE 802.1AR Hardware-Bound IDevID: If meters utilized IEEE 802.1AR with private keys locked inside tamper-resistant Secure Elements, copying the external flash memory chip would clone only encrypted software, not the unique silicon private key. The cloned meters would fail mTLS cryptographic handshakes because they cannot sign handshake challenges without the physical Secure Element.",
        "Meters should not measure gas consumption.",
        "Increasing the price of gas to deter fraud."
      ],
      "answerIdx": 1,
      "debrief": "Software-only device identities stored in standard flash memory can be cloned trivially by dumping and flashing image files. IEEE 802.1AR binds the device's cryptographic identity directly to an on-chip private key in a tamper-resistant Secure Element or eFuse. Because the private key cannot be extracted, copying the external flash memory fails completely\u2014the cloned device lacks the cryptographic soul of the original hardware."
    },
    "quests": [
      {
        "num": 1,
        "title": "IEEE 802.1AR Standards, IDevID/LDevID & PKI Hierarchy",
        "type": "Concept",
        "description": "Analyze IEEE 802.1AR device identity architectures, X.509 certificate extensions, EUI-64 hardware naming, and Root-to-Leaf signature verification."
      },
      {
        "num": 2,
        "title": "Flash Dump Identity Cloning & Gas Meter Fraud Detective",
        "type": "Detective Challenge",
        "description": "Investigate a utility smart grid fraud incident; prove how storing device certificates in unencrypted flash allowed mass cloning of 500 sensor nodes."
      },
      {
        "num": 3,
        "title": "IEEE 802.1AR Device Identity & CSR Generation Engine",
        "type": "Mastery Assignment",
        "description": "Implement an embedded PKI identity manager in C / TypeScript with on-chip key generation, IDevID parsing, and LDevID CSR issuance."
      },
      {
        "num": 4,
        "title": "Rogue Identity Injection & CA Chain Rejection Lab",
        "type": "Production Incident Lab",
        "description": "Subject an IoT cloud gateway to 50 forged device identities and self-signed certificates; verify that only authentic factory IDevID chains are permitted."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "ASN.1 DER Encoding & Tiny X.509 Certificate Parsers: Memory-Constrained Parsing",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Constrained Binary Parsing (ASN.1 DER Tag-Length-Value & Memory Bounds)",
    "spokenGoal": "X.509 certificates are the bedrock of modern internet security, but parsing them on an embedded microcontroller with 32 KB of RAM is an absolute minefield! An X.509 certificate is not JSON; it is encoded in ASN.1 DER (Abstract Syntax Notation One - Distinguished Encoding Rules). Today you build a zero-heap, memory-bounded X.509 certificate parser. Deconstruct ASN.1 DER: every element is structured as Tag-Length-Value (TLV). Tag defines the type (0x30 for Sequence, 0x02 for Integer, 0x06 for Object Identifier [OID], 0x17 for UTCTime); Length defines byte count; Value contains raw bytes. Deconstruct the OID tree: `1.2.840.10045.2.1` represents EC Public Key, `1.2.840.10045.3.1.7` represents the NIST P-256 curve! Master embedded security invariants: 1) Zero dynamic memory allocation\u2014parse directly in a static 2 KB buffer; 2) Strict bounds checking\u2014prevent integer overflow in Length fields; 3) Validity window parsing (NotBefore and NotAfter) without real-time clock (RTC) drift!",
    "conceptInvariant": "Zero-Allocation ASN.1 Bounded Traversal Invariant: The embedded X.509 certificate parser must operate entirely within a pre-allocated stack buffer with strict recursive depth limits (<=8) and explicit Tag-Length-Value boundary checks. Any malformed TLV or length mismatch must abort parsing immediately without heap allocation.",
    "failureMode": "Using a recursive ASN.1 parser without depth limits on Cortex-M; an attacker feeds a certificate containing 500 nested `SEQUENCE` tags, exhausting the 4 KB CPU stack and crashing the RTOS with a MemManage Fault.",
    "tryItFriction": "Build a Zero-Heap ASN.1 DER X.509 Parser in TypeScript: parse a real 600-byte DER certificate; extract Subject Name, Issuer Name, Validity Dates, OID algorithm identifier, and the 64-byte raw ECC public key; inject a malicious nested ASN.1 sequence bomb; verify that parser recursion limits (depth > 6) trigger an immediate parsing abort with zero heap allocation.",
    "socraticHints": [
      "Why is ASN.1 DER encoding preferred over BER (Basic Encoding Rules) for cryptographic certificates?",
      "Because BER permits multiple valid binary representations of the same data (e.g. indefinite length encodings)!",
      "DER enforces strict canonical encoding (exactly ONE valid binary representation), ensuring cryptographic hashes are 100% deterministic!"
    ],
    "situationalPuzzle": {
      "scenario": "An industrial IoT water filtration controller uses an open-source C ASN.1 parser to validate cloud TLS server certificates. A penetration testing team sends a crafted certificate where a TLV Length field is declared as `0xFFFFFFFF` (-1 as signed 32-bit int). The parser allocates `length + 1` bytes, resulting in `0` bytes allocated on the heap, followed by a `memcpy` of 4 gigabytes that completely overwrites internal SRAM. What vulnerability allowed this exploit?",
      "options": [
        "Water filters cannot parse certificates.",
        "Integer Overflow in ASN.1 Length Parsing: The parser failed to validate that the declared TLV length was strictly bounded by the total remaining certificate buffer size (`length <= remaining_bytes`). A negative or massive length caused an integer wrap-around heap allocation bug. Proper parsers enforce `if (length > MAX_CERT_FIELD_LEN || length > remaining_buffer) return PARSE_ERROR;`.",
        "ASN.1 is only supported on Linux servers.",
        "The TLS certificate was too colorful."
      ],
      "answerIdx": 1,
      "debrief": "ASN.1 parsing bugs (particularly integer overflows, buffer over-reads, and uncontrolled recursion) are historically among the most common vulnerabilities in embedded cryptographic libraries. An embedded parser must strictly bound all length fields against remaining buffer size and reject any field that exceeds strict architectural ceilings (e.g., maximum RSA key size 512 bytes, maximum name string 128 bytes)."
    },
    "quests": [
      {
        "num": 1,
        "title": "ASN.1 DER Grammar, Tag-Length-Value & OID Tree Mathematics",
        "type": "Concept",
        "description": "Analyze ASN.1 binary encoding rules, DER canonical invariants, OID variable-length encoding math, and X.509 v3 extension structures."
      },
      {
        "num": 2,
        "title": "Nested Sequence Stack Overflow & Heap Overwrite Detective",
        "type": "Detective Challenge",
        "description": "Analyze a real-world CVE in an embedded TLS library; demonstrate how crafted ASN.1 length fields triggered heap corruption on Cortex-M."
      },
      {
        "num": 3,
        "title": "Zero-Heap Embedded X.509 Certificate Parser Engine",
        "type": "Mastery Assignment",
        "description": "Construct an ultra-lightweight ASN.1 DER certificate parser in C / TypeScript operating under 2 KB RAM with strict recursive depth guards."
      },
      {
        "num": 4,
        "title": "Malformed Certificate Fuzzing & Stress Lab",
        "type": "Production Incident Lab",
        "description": "Fuzz the X.509 parser with 50,000 malformed TLV mutations, integer wraps, and truncated certificates; verify 0 crashes and 100% graceful rejections."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Certificate Revocation on Edge Devices: CRL, OCSP & Offline Memory Budgets",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Trust Lifecycle Management (Revocation Lists, OCSP Stapling & Air-Gapped Limits)",
    "spokenGoal": "What happens when an enterprise cloud server's private key is stolen, or a compromised edge device is decommissioned? The certificate was legitimately issued and its validity dates are still valid for another 3 years! Without revocation checking, every device in the world will continue trusting the compromised key! Enter Certificate Revocation on the edge. Deconstruct the two fundamental revocation mechanisms: 1) Certificate Revocation Lists (CRL): a signed list of revoked serial numbers downloaded from a CA. But a full enterprise CRL can be 20 megabytes\u2014larger than the entire flash memory of your microcontroller! 2) Online Certificate Status Protocol (OCSP): querying an OCSP responder in real time. But OCSP leaks privacy, adds latency, and fails when the device is offline or behind an industrial air gap! Master Embedded Solutions: OCSP Stapling (RFC 6066 - the server fetches its own signed OCSP response from the CA and 'staples' it to the TLS handshake) and Delta CRLs (compact Bloom Filters or binary search delta patches under 4 KB)!",
    "conceptInvariant": "Timely Revocation Verification & Stapling Invariant: In memory-constrained embedded systems, TLS server validation must require OCSP Stapling (RFC 6066) with cryptographic timestamp verification, eliminating the need for local multi-megabyte CRL storage while guaranteeing immediate rejection of compromised server certificates.",
    "failureMode": "Disabling certificate revocation checking on edge gateways due to lack of RAM; a compromised intermediate cloud CA issues a rogue server certificate, redirects telemetry via DNS poisoning, and intercepts all plant operational data for 6 months undetected.",
    "tryItFriction": "Build an Embedded OCSP Stapling and Compact CRL Engine in TypeScript: implement an OCSP response parser verifying the CA's digital signature and `good` status; create a memory-efficient 256-bit Bloom Filter for local edge device blacklist lookup; test presenting a revoked server certificate; verify that the OCSP validator catches the revocation and terminates the TLS handshake before transmitting telemetry.",
    "socraticHints": [
      "Why is OCSP Stapling vastly superior to client-side OCSP queries for IoT microcontrollers?",
      "Because the constrained IoT client doesn't have to make a separate HTTP connection to an external OCSP responder server!",
      "The cloud server includes the CA-signed OCSP proof directly inside the initial TLS Certificate handshake message!"
    ],
    "situationalPuzzle": {
      "scenario": "An offshore oil platform uses 2,000 smart pressure sensors that communicate via private satellite uplink to an onshore SCADA server. To save satellite bandwidth ($5 per megabyte), the firmware team disables CRL downloading. When an onshore SCADA server certificate is compromised by ransomware, the IT team revokes the certificate at the CA. However, the offshore sensors continue sending operational telemetry to the attacker's server for 3 weeks. How should revocation have been architected without wasting satellite bandwidth?",
      "options": [
        "Fly technicians out to the oil rig every day in a helicopter.",
        "OCSP Stapling with Satellite Bandwidth Conservation: By enforcing OCSP Stapling in the TLS client handshake, the server must provide its own freshly cached, CA-signed OCSP response (<500 bytes) during connection setup. The sensors verify this tiny cryptographic proof locally with zero additional satellite requests, blocking the revoked server instantly without downloading multi-megabyte CRLs.",
        "Oil rigs do not require encryption.",
        "Disable TLS and use plaintext HTTP."
      ],
      "answerIdx": 1,
      "debrief": "Full CRL downloads are completely unviable over low-bandwidth or expensive connections (like satellite or cellular IoT), often exceeding total device memory. OCSP Stapling (RFC 6066) shifts the burden to the server: the server periodically fetches a signed OCSP assertion from the CA and delivers it to the client during the TLS handshake. The client verifies the signature in under 1 KB of memory with zero extra network round-trips."
    },
    "quests": [
      {
        "num": 1,
        "title": "Revocation Physics: CRL vs OCSP vs OCSP Stapling Math",
        "type": "Concept",
        "description": "Analyze certificate revocation RFCs (RFC 5280, RFC 6960, RFC 6066), Bloom filter false-positive math, and embedded memory constraints."
      },
      {
        "num": 2,
        "title": "Revoked SCADA Server Masquerade & Satellite Leak Detective",
        "type": "Detective Challenge",
        "description": "Investigate an offshore industrial incident; prove how lack of OCSP stapling allowed a compromised server key to hijack operational telemetry."
      },
      {
        "num": 3,
        "title": "Embedded OCSP Stapling & Bloom Filter Revocation Engine",
        "type": "Mastery Assignment",
        "description": "Implement an OCSP Stapling validator and compact Bloom Filter revocation engine in C / TypeScript with under 4 KB RAM footprint."
      },
      {
        "num": 4,
        "title": "Rogue Server Revocation Verification Lab",
        "type": "Production Incident Lab",
        "description": "Simulate connecting to active vs revoked vs expired cloud endpoints; verify 100% deterministic rejection of revoked certificates under OCSP stapling."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Hardware-Enforced TLS 1.3 Client Handshake on MCU: wolfSSL/mbedTLS Optimization",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Transport Layer Security (TLS 1.3 Handshake, Hardware Crypto Offload & Ephemeral ECDHE)",
    "spokenGoal": "TLS 1.2 is 15 years old, bloated with obsolete ciphers (CBC mode, RSA key exchange), and requires 2 full network round-trips before transmitting a single application byte. Today you engineer TLS 1.3 on bare-metal microcontrollers! TLS 1.3 is faster, simpler, and radically more secure: it mandates Perfect Forward Secrecy (PFS) using Ephemeral Elliptic Curve Diffie-Hellman (ECDHE), eliminates vulnerable static RSA key exchange, and completes the full cryptographic handshake in just ONE single round-trip (1-RTT)! Deconstruct the TLS 1.3 handshake state machine: ClientHello (advertising supported groups X25519, cipher suites TLS_AES_128_GCM_SHA256, and ephemeral KeyShare) -> ServerHello (returning server KeyShare) -> EncryptedExtensions -> Certificate -> CertificateVerify -> Finished. Trace memory optimization: standard OpenSSL requires 250 KB of RAM per connection; embedded stacks like mbedTLS and wolfSSL, combined with hardware cryptographic offload, run full TLS 1.3 in less than 16 KB of SRAM!",
    "conceptInvariant": "Perfect Forward Secrecy & TLS 1.3 1-RTT Invariant: All transport encryption must mandate TLS 1.3 with ephemeral Diffie-Hellman key exchange (ECDHE via X25519/P-256). Session keys must be derived from ephemeral keys and erased immediately upon session termination, guaranteeing that past traffic cannot be decrypted even if long-term device identity keys are compromised.",
    "failureMode": "Enabling TLS 1.3 0-RTT (Zero Round-Trip Time) early data without replay protection; an attacker captures an early-data MQTT packet containing a 'DISPENSE_INSULIN' command and replays it 50 times, overdosing a patient.",
    "tryItFriction": "Build an Embedded TLS 1.3 Handshake Engine in TypeScript: implement the ClientHello and KeyShare generation using X25519; compute the shared secret Z = X25519(client_priv, server_pub); derive Handshake and Application secrets via HKDF-Extract and HKDF-Expand; verify that the master key cannot be decrypted without the ephemeral private key; simulate a 0-RTT replay attack and implement a monotonic anti-replay cache.",
    "socraticHints": [
      "Why did TLS 1.3 completely remove static RSA key exchange?",
      "Because with static RSA, if an attacker records encrypted network traffic today and steals the server's private key 5 years from now, they can decrypt all historical recordings!",
      "Ephemeral ECDHE generates fresh, temporary keys for every session, ensuring past recordings remain undecryptable forever (Perfect Forward Secrecy)!"
    ],
    "situationalPuzzle": {
      "scenario": "A battery-powered environmental sensor uses an ESP32-S3 to upload readings every 10 minutes over cellular. The engineer enables TLS 1.3 0-RTT Early Data to save radio power. During testing, an attacker records the 0-RTT packet sent when opening an irrigation valve. The attacker re-transmits the exact same raw radio packet 40 times over the next 2 hours. The cloud server accepts every packet and floods the crop field. Why did TLS 1.3 fail to reject the replayed packets?",
      "options": [
        "Cellular networks don't support encryption.",
        "Inherent Replay Vulnerability of 0-RTT Early Data: 0-RTT data is encrypted under pre-shared keys or session tickets from the previous connection BEFORE the new handshake completes. It possesses NO forward secrecy and NO inherent freshness verification! Without application-layer single-use nonces or an anti-replay cache on the server, 0-RTT early data is vulnerable to packet replay attacks. Non-idempotent actuator commands must never be sent via 0-RTT.",
        "The valve actuator was mechanical.",
        "ESP32 cannot calculate nonces."
      ],
      "answerIdx": 1,
      "debrief": "While TLS 1.3 0-RTT provides significant latency and battery savings by transmitting application data in the very first packet, RFC 8446 explicitly warns that 0-RTT early data does not provide replay protection! An attacker can record the ciphertext and replay it to the server. Safe industrial IoT architectures either forbid 0-RTT entirely, restrict 0-RTT strictly to idempotent read operations (like telemetry queries), or enforce application-level monotonic tokens."
    },
    "quests": [
      {
        "num": 1,
        "title": "TLS 1.3 State Machine, HKDF Derivation & Ephemeral ECDHE Math",
        "type": "Concept",
        "description": "Analyze RFC 8446 state transitions, X25519 Diffie-Hellman mathematics, HKDF-Extract/Expand key schedules, and 1-RTT handshake packets."
      },
      {
        "num": 2,
        "title": "TLS 1.3 0-RTT Replay Attack & Irrigation Flood Detective",
        "type": "Detective Challenge",
        "description": "Investigate an industrial smart farming actuator failure; prove how capturing early-data 0-RTT packets enabled valve command replay."
      },
      {
        "num": 3,
        "title": "Constrained TLS 1.3 Handshake & HKDF Engine",
        "type": "Mastery Assignment",
        "description": "Implement a bare-metal TLS 1.3 handshake client in C / TypeScript with X25519 key generation, HKDF key derivation, and AES-128-GCM record protection under 16 KB RAM."
      },
      {
        "num": 4,
        "title": "Hardware Cryptographic Accelerator Offload Benchmark Lab",
        "type": "Production Incident Lab",
        "description": "Benchmark software vs hardware accelerated TLS 1.3 handshakes on simulated Cortex-M33; verify 85% CPU cycle reduction and 70% energy savings."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone Project 4: IEEE 802.1AR Device Identity & Bare-Metal TLS 1.3 Handshake Engine",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Architectural Milestone (Complete Identity & Transport Security Synthesis)",
    "spokenGoal": "Congratulations on completing Block 4. Today you engineer Milestone Project 4: a production-grade, end-to-end Device Identity and Transport Security Engine! Your architecture must integrate three core systems: 1) An IEEE 802.1AR Device Identity Manager with non-exportable hardware-bound IDevID certificates and on-device LDevID Certificate Signing Request (CSR) generation; 2) A Zero-Heap ASN.1 DER X.509 Certificate Parser that extracts public keys and validates CA chains with strict bounds checking under 2 KB RAM; and 3) A Hardware-Accelerated TLS 1.3 Client Handshake Engine that executes 1-RTT mutual authentication (mTLS) with ephemeral X25519 ECDHE, HKDF key scheduling, and AES-128-GCM record protection. Subject your milestone to live adversarial chaos: inject corrupted ASN.1 length fields, simulate revoked server certificates, and replay TLS handshake records!",
    "conceptInvariant": "End-to-End Cryptographic Transport Invariant: The embedded node must establish mutually authenticated, forward-secure communications (TLS 1.3 mTLS) anchored in an immutable hardware IDevID. Every byte of incoming server certificates must be verified in bounded memory without dynamic allocation or timing side-channels.",
    "failureMode": "Allocating the TLS handshake record buffer on the thread stack; during certificate exchange, a 4 KB server certificate chain causes a silent stack overflow into adjacent RTOS task control blocks, triggering memory corruption.",
    "tryItFriction": "Construct the Milestone 4 Security Core in TypeScript / C: 1) Implement the IEEE 802.1AR IDevID identity manager; 2) Implement the zero-heap ASN.1 DER parser; 3) Implement the TLS 1.3 client handshake state machine with mTLS client certificate presentation; 4) Verify successful connection establishment to a simulated cloud endpoint in under 16 KB RAM.",
    "socraticHints": [
      "Why is Mutual TLS (mTLS) where BOTH server and client present certificates mandatory for industrial IoT?",
      "Standard web browsing only authenticates the server (you know you're at google.com, but Google doesn't know who you are until you log in)!",
      "Industrial IoT requires bidirectional cryptographic proof: the gateway proves it is talking to the genuine cloud, AND the cloud proves the gateway is an authorized hardware device!"
    ],
    "situationalPuzzle": {
      "scenario": "During deployment testing of Milestone Project 4 on an STM32U5, the device connects to an AWS IoT Core test endpoint. The TLS handshake succeeds. However, when connecting to a production Azure IoT Hub endpoint, the handshake crashes with a HardFault during the Server Certificate processing. Memory analysis shows the Azure production certificate chain was 3,400 bytes, while the test certificate was 1,100 bytes. The static record buffer was sized at 2,048 bytes. What architectural feature was missing?",
      "options": [
        "Azure IoT Hub is incompatible with microcontrollers.",
        "TLS Maximum Fragment Length Negotiation (MFLN / RFC 6066): By default, TLS records can be up to 16,384 bytes (16 KB)! A constrained microcontroller cannot buffer 16 KB records. The client must include the Maximum Fragment Length Negotiation extension in its ClientHello (requesting fragments limited to 1,024 or 2,048 bytes), forcing the server to split large certificate chains across multiple small frames.",
        "The microcontroller should have downloaded more RAM.",
        "The encryption key was too long."
      ],
      "answerIdx": 1,
      "debrief": "Standard TLS allows servers to send records up to 16 KB (16,384 bytes), which can easily overwhelm an embedded microcontroller's SRAM. To prevent buffer overflows and memory exhaustion, embedded TLS clients must include the Maximum Fragment Length (MFLN - RFC 6066) or Record Size Limit (RFC 8449) extension in their ClientHello, explicitly declaring their maximum receive buffer size (e.g. 1 KB or 2 KB) to the server."
    },
    "quests": [
      {
        "num": 1,
        "title": "mTLS Architecture, IEEE 802.1AR & MFLN RFC Standards",
        "type": "Concept",
        "description": "Analyze mutual TLS handshake flows, client certificate authentication, RFC 6066 fragment size negotiation, and memory budgeting."
      },
      {
        "num": 2,
        "title": "Oversized Server Certificate Buffer Overflow Detective",
        "type": "Detective Challenge",
        "description": "Diagnose an embedded gateway crash on a production cloud migration; prove how unconstrained 16 KB TLS records overflowed static buffers."
      },
      {
        "num": 3,
        "title": "Milestone 4: Complete IEEE 802.1AR & TLS 1.3 mTLS Engine",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 4 core: IDevID manager + zero-heap ASN.1 parser + TLS 1.3 mTLS client under 16 KB RAM."
      },
      {
        "num": 4,
        "title": "Industrial Cloud mTLS Chaos & Replay Testing Lab",
        "type": "Production Incident Lab",
        "description": "Connect the Milestone 4 engine to simulated AWS/Azure cloud endpoints; verify 100% successful mTLS connections and zero memory leaks across 1,000 runs."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Factory Floor Provisioning Security & Hardware Security Modules (HSM): Key Injection Jigs",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Manufacturing Security Architecture (Key Injection, Secure Jigs & Air-Gapped HSMs)",
    "spokenGoal": "How do cryptographic keys actually get into millions of devices on an assembly line in a contract manufacturing factory in another country? If you send an Excel spreadsheet with 100,000 private keys to an offshore factory, those keys will be copied, sold, and used to produce counterfeit devices within 48 hours! Welcome to Factory Floor Provisioning Security. Deconstruct the Secure Programming Jig architecture: a physical test fixture on the assembly line equipped with spring-loaded pogo pins that contact PCB test pads for just 3 seconds per board. Deconstruct the HSM Key Injection Protocol: an on-premises Hardware Security Module (HSM - like Thales Luna or YubiHSM) sits in an air-gapped, biometric-secured server rack inside the factory. The HSM generates keys securely or uses asymmetric Key Encryption Keys (KEK): the factory never sees the private keys in plaintext! Master Monotonic Production Counters: the HSM is cryptographically authorized to provision exactly 50,000 units; after 50,000 burns, it self-locks, preventing unauthorized 'ghost shift' overproduction!",
    "conceptInvariant": "Air-Gapped HSM Key Injection & Overproduction Gating Invariant: Private keys must never exist in plaintext outside the Secure Element or factory HSM. Key provisioning fixtures must enforce cryptographic production authorization tokens that physically limit the number of provisioned units to the exact contracted manufacturing volume.",
    "failureMode": "Generating device private keys on a standard Windows PC on the factory floor; a rogue contractor plugs in a USB drive, copies the key generation database, and sells 20,000 cloned smart energy meters.",
    "tryItFriction": "Build an Automated Factory Provisioning and HSM Injection Simulator in TypeScript: create an HSM module managing a production quota (max 100 units); implement an encrypted key injection protocol over an emulated pogo-pin UART interface; inject keys into 100 virtual devices; attempt to provision unit #101; verify that the HSM refuses key injection and logs an overproduction alarm.",
    "socraticHints": [
      "What is a 'ghost shift' in offshore contract electronics manufacturing?",
      "A factory fulfills an order of 50,000 units for a client, then runs an unauthorized extra night shift to produce 10,000 clone units using the client's blueprints!",
      "If cryptographic provisioning requires authorized tokens signed by corporate headquarters, ghost shift units cannot obtain valid credentials!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart home startup manufactures 20,000 smart doorbells at a contract manufacturer. Three months after launch, 8,000 identical counterfeit doorbells appear on online marketplaces with working cloud connectivity. The startup's cloud server accepted them because they had valid vendor certificates. The investigation shows the factory ran an unauthorized weekend shift and provisioned extra devices using the factory test PC script. What cryptographic control was missing?",
      "options": [
        "The doorbells should have been molded in black plastic.",
        "HSM-Enforced Cryptographic Authorization & Factory Quota Licensing: The provisioning script ran on an unconstrained PC without a hardware security module. Corporate headquarters should have loaded the factory HSM with an authorization token granting exactly 20,000 signed key injection certificates. Once the counter reached 20,000, the HSM would refuse further key generation, rendering unauthorized ghost-shift hardware unable to connect to the cloud.",
        "Doorbells should not be manufactured in factories.",
        "Wi-Fi chips can only be programmed once."
      ],
      "answerIdx": 1,
      "debrief": "Supply chain security requires controlling the cryptographic root of production. An unconstrained PC running Python or C scripts can generate infinite keys. In commercial IoT manufacturing, provisioning is delegated to a physical Hardware Security Module (HSM) loaded with a cryptographically signed license ticket from the OEM. The HSM enforces a strict hardware decrement counter, making unauthorized overproduction impossible."
    },
    "quests": [
      {
        "num": 1,
        "title": "Factory Provisioning Architecture, HSM Protocols & Overproduction Gating",
        "type": "Concept",
        "description": "Analyze secure programming jigs, pogo-pin bus protocols, Key Encryption Keys (KEK), HSM authorization tickets, and counter-overproduction mechanics."
      },
      {
        "num": 2,
        "title": "Ghost Shift Counterfeit Doorbell Investigation Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial forensics report where 8,000 unauthorized IoT devices breached a cloud server; trace the vulnerability to unconstrained factory scripts."
      },
      {
        "num": 3,
        "title": "Automated HSM Key Injection & Quota Controller Engine",
        "type": "Mastery Assignment",
        "description": "Develop a factory provisioning engine in C / TypeScript with HSM quota licensing, encrypted key transport, and tamper-evident audit logging."
      },
      {
        "num": 4,
        "title": "Factory Floor Security Audit & Injection Stress Lab",
        "type": "Production Incident Lab",
        "description": "Execute a simulated 500-unit factory provisioning run; attempt rogue key extraction and quota bypass; verify 100% enforcement and zero plaintext leaks."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Automated Cloud Onboarding: AWS IoT Core Just-In-Time Registration (JITR) & Azure DPS",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Cloud Enrollment Automation (JITR, Azure DPS & Automatic Certificate Activation)",
    "spokenGoal": "How does a cloud provider know what to do when a brand-new device fresh out of the factory box powers on for the very first time? You cannot manually type 100,000 serial numbers and certificate hashes into the AWS or Azure web console! Today you engineer Automated Cloud Onboarding. Deconstruct the two major cloud onboarding paradigms: 1) AWS IoT Core Just-In-Time Registration (JITR) and Just-In-Time Provisioning (JITP): you register your corporate Intermediate CA in AWS once. When a device connects for the first time presenting an X.509 certificate signed by that CA, AWS automatically traps the initial connection, triggers an AWS Lambda provisioning hook, creates an IoT Thing shadow, attaches least-privilege security policies, activates the certificate, and allows telemetry\u2014all in 250 milliseconds with zero human intervention! 2) Azure IoT Hub Device Provisioning Service (DPS): uses Enrollment Groups, TPM endorsement keys, or X.509 certificates to dynamically assign devices to geographically optimal IoT Hub clusters!",
    "conceptInvariant": "Zero-Touch Automated Enrollment & Principle of Least Privilege Invariant: First-time cloud device registration must execute automatically via CA trust pinning (JITR/DPS) without manual human entry, dynamically generating and binding device-specific least-privilege access policies (limiting publish topics strictly to `devices/{device_id}/*`).",
    "failureMode": "Assigning a wildcard policy (`iot:*` on resource `*`) to automatically provisioned devices during JITR; a compromised sensor node publishes malicious commands to every other sensor in the enterprise.",
    "tryItFriction": "Build an Automated Cloud Provisioning (JITR/DPS) Simulator in TypeScript: configure an emulated AWS IoT registry with a registered Root CA; implement an automated JITR registration hook; simulate a new device connecting with its factory-signed certificate; verify that the device is automatically enrolled, assigned a unique Thing Name, and bound to a strict scoped policy (`publish: telemetry/${deviceId}`); test publishing to an unauthorized topic and verify policy rejection.",
    "socraticHints": [
      "Why must the device transmit its Intermediate CA certificate along with its device certificate during JITR?",
      "Because AWS only stores the Root CA!",
      "To verify the complete chain of trust, the device must send the complete certificate path: Device Cert + Intermediate Cert, allowing AWS to validate up to the pinned Root CA!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart connected scooter fleet deploys 5,000 vehicles using AWS IoT Core JITR. A software engineer writes the provisioning Lambda function with an IAM policy template granting `Effect: Allow, Action: iot:*, Resource: *` to every new scooter to ensure updates never fail. An attacker hacks one scooter by exploiting a physical CAN bus port, extracts the scooter's MQTT credentials, and issues an MQTT command telling all 4,999 other scooters in the city to lock their brakes simultaneously. What cloud architectural principle was violated?",
      "options": [
        "Scooters should not have electronic brakes.",
        "Violation of Least Privilege in Automated Provisioning: The JITR provisioning policy granted wildcard permissions across all devices. In production, automated provisioning must generate scoped policies parameterized by device ID: `Resource: arn:aws:iot:*:*:topic/telemetry/${iot:Connection.Thing.ThingName}/*`. A compromised device can never publish to or control other devices.",
        "AWS IoT Core does not support policies.",
        "The scooter battery was low."
      ],
      "answerIdx": 1,
      "debrief": "Automated onboarding is dangerous if combined with overly permissive access policies. The Principle of Least Privilege mandates that an IoT device must be permitted to publish and subscribe ONLY to its own dedicated topics (e.g. `devices/${ThingName}/telemetry` and `devices/${ThingName}/commands`). Granting wildcard permissions allows a single compromised hardware node to pivot and compromise the entire fleet."
    },
    "quests": [
      {
        "num": 1,
        "title": "AWS JITR/JITP vs Azure DPS Architecture & Policy Templating",
        "type": "Concept",
        "description": "Analyze cloud CA verification, Just-In-Time Provisioning workflows, Azure DPS enrollment groups, and parameterized least-privilege IAM policies."
      },
      {
        "num": 2,
        "title": "Wildcard IoT Policy Fleet Hijack & Scooter Emergency Detective",
        "type": "Detective Challenge",
        "description": "Investigate a connected vehicle fleet disaster; prove how a single compromised scooter used wildcard MQTT privileges to issue fleet-wide lock commands."
      },
      {
        "num": 3,
        "title": "Automated Cloud Device Provisioning & Scoped Policy Engine",
        "type": "Mastery Assignment",
        "description": "Construct an automated cloud onboarding simulator in C / TypeScript with JITR certificate trapping, Thing creation, and strictly scoped topic policies."
      },
      {
        "num": 4,
        "title": "Mass Device Onboarding & Policy Boundary Lab",
        "type": "Production Incident Lab",
        "description": "Simulate 1,000 concurrent devices powering up for first-time cloud enrollment; verify 100% automated registration and zero policy boundary leaks."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Secure Device Registration Protocols: FIDO Device Onboard (FDO) & EST (RFC 7030)",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Standardized Onboarding Protocols (FIDO Alliance FDO, Ownership Vouchers & EST)",
    "spokenGoal": "Proprietary cloud onboarding scripts create vendor lock-in and security holes. Today the industry is converging on two open international standards: FIDO Device Onboard (FDO) and Enrollment over Secure Transport (EST - RFC 7030)! Deconstruct FIDO Device Onboard (FDO): an open standard created by the FIDO Alliance for zero-touch, late-binding device onboarding. The killer feature of FDO: the device does NOT need to know which cloud it belongs to when manufactured at the factory! The manufacturer ships the device to a warehouse, and digitally transfers an Ownership Voucher (a cryptographic chain of custody signed by private keys) to the buyer. When the device connects to an open Rendezvous Server, it presents its credentials; the owner presents the Ownership Voucher; and the device is dynamically redirected to the owner's private cloud with zero physical reconfiguration! Deconstruct EST (RFC 7030): automated certificate renewal and enrollment over HTTPS using standard CSRs!",
    "conceptInvariant": "Late-Binding Cryptographic Ownership Transfer Invariant: The device's operational cloud destination must not be hardcoded in factory firmware. Ownership must be transferred out-of-band via cryptographically verifiable Ownership Vouchers, allowing secure, zero-touch late-binding to any cloud ecosystem upon first network connection.",
    "failureMode": "Hardcoding cloud endpoint URLs and tenant certificates directly into production firmware during manufacturing; a corporate restructuring changes cloud providers, stranding 50,000 deployed devices that cannot be redirected without physical recall.",
    "tryItFriction": "Build an FIDO Device Onboard (FDO) Ownership Voucher Protocol in TypeScript: create a Manufacturer keypair, Device keypair, and Customer keypair; generate an Ownership Voucher establishing cryptographic chain of custody; implement the Rendezvous Server protocol (TO0, TO1, TO2); execute the automated ownership transfer; verify that the device securely rebinds its network configuration to the customer's cloud endpoint.",
    "socraticHints": [
      "What is the biggest economic advantage of FDO late-binding for hardware manufacturers?",
      "The manufacturer can build ONE single stock-keeping unit (SKU) in millions of units without customizing firmware for individual enterprise customers!",
      "The hardware is customized digitally at deployment time using cryptographic Ownership Vouchers!"
    ],
    "situationalPuzzle": {
      "scenario": "A factory automation company manufactures 10,000 smart PLCs. To streamline shipping, they use FIDO Device Onboard (FDO). A customer purchases 100 PLCs and receives an electronic Ownership Voucher via email. A hacker intercepts the email, obtains the Ownership Voucher, and contacts the FDO Rendezvous Server before the customer powers on the PLCs. Can the hacker steal ownership of the physical PLCs?",
      "options": [
        "Yes, anyone with the voucher owns the PLCs.",
        "No, Because Ownership Requires Device Mutual Authentication: An Ownership Voucher is only half of the puzzle! During FDO protocol step TO2 (Transfer Ownership 2), the device must mutually authenticate with the prospective owner using the device's physical hardware Root of Trust. The hacker cannot complete the exchange without physical network connectivity to the devices and matching device credentials.",
        "FDO only works on consumer smartphones.",
        "The voucher automatically self-destructs after 5 minutes."
      ],
      "answerIdx": 1,
      "debrief": "FIDO Device Onboard (FDO) is designed to resist interception. An Ownership Voucher proves ownership transfer from the manufacturer to the customer, but binding that voucher to an active cloud requires the TO2 protocol, which involves mutual cryptographic authentication between the physical device (using its hardware Root of Trust) and the owner's management server. An intercepted voucher alone cannot compromise devices that are already secure or not reachable."
    },
    "quests": [
      {
        "num": 1,
        "title": "FIDO Device Onboard Architecture, TO0-TO2 Protocols & EST RFC 7030",
        "type": "Concept",
        "description": "Analyze FDO late-binding specifications, Ownership Voucher digital signatures, Rendezvous server mechanics, and EST certificate enrollment."
      },
      {
        "num": 2,
        "title": "Hardcoded Cloud URL Stranding & Mass Recall Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial IoT enterprise disaster where 50,000 sensors were bricked by a cloud migration due to hardcoded endpoint certificates."
      },
      {
        "num": 3,
        "title": "FDO Ownership Voucher & Late-Binding Onboarding Engine",
        "type": "Mastery Assignment",
        "description": "Implement an FDO protocol state machine in C / TypeScript with Ownership Voucher signing, Rendezvous dispatch, and dynamic endpoint configuration."
      },
      {
        "num": 4,
        "title": "Zero-Touch Factory-to-Cloud Late-Binding Lab",
        "type": "Production Incident Lab",
        "description": "Simulate manufacturing 50 generic edge nodes and dynamically assigning them across 3 different simulated enterprise clouds using FDO vouchers."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Mutual Authentication (mTLS) over MQTT & ALPN Protocol Negotiation",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Application Protocol Hardening (mTLS over MQTT, Port 443 & ALPN Gating)",
    "spokenGoal": "You have a secure hardware identity, and your device is provisioned. Now, how does it securely communicate with industrial cloud brokers over hostile enterprise firewalls? Standard MQTT runs on port 1883 in plaintext\u2014unacceptable! Secure MQTT over TLS runs on port 8883, but corporate IT firewalls in refineries and hospitals block port 8883 by default! Today you engineer Mutual Authentication (mTLS) over MQTT using ALPN Protocol Negotiation on port 443! Deconstruct Application-Layer Protocol Negotiation (ALPN - RFC 7301): a TLS extension where the client declares its target application protocol inside the initial ClientHello. By connecting to standard HTTPS port 443 with ALPN token `x-amzn-mqtt-ca` or `mqtt`, the connection bypasses enterprise firewall restrictions while routing directly to the cloud MQTT broker! Master mTLS Private Key Gating: the private key remains locked inside the hardware Secure Element, which signs the TLS `CertificateVerify` message on-chip, guaranteeing that client identity is physically unforgeable!",
    "conceptInvariant": "ALPN Port 443 & Secure Element mTLS Invariant: Constrained IoT nodes must negotiate application protocols over port 443 using ALPN (RFC 7301) to penetrate industrial firewalls without proxy circumvention. The TLS CertificateVerify cryptographic signature must be generated inside the hardware Secure Element, preventing private key exposure.",
    "failureMode": "Transmitting cleartext username/password credentials over unencrypted MQTT (port 1883); an attacker on the factory Wi-Fi uses Wireshark to sniff the credentials in 10 seconds and publishes false sensor data to the plant control dashboard.",
    "tryItFriction": "Build an mTLS MQTT Client with ALPN Negotiation in TypeScript: construct a TLS 1.3 ClientHello containing the ALPN extension (`mqtt` and `x-amzn-mqtt-ca`) targeting port 443; implement on-chip CertificateVerify signing using an emulated Secure Element; establish the connection; verify that client and server exchange encrypted MQTT CONNECT packets with mutual identity guarantees.",
    "socraticHints": [
      "Why do enterprise IT firewalls block port 8883 but allow port 443?",
      "Port 443 is standard HTTPS web browsing, which must be open for corporate internet access!",
      "Port 8883 is non-standard MQTT, which enterprise network administrators routinely block to prevent rogue IoT devices from phoning home!"
    ],
    "situationalPuzzle": {
      "scenario": "A medical device company installs smart dialysis machines in 50 hospitals. In laboratory tests on port 8883 (MQTTS), the machines worked flawlessly. But in hospital deployments, 48 out of 50 hospitals report that the dialysis machines cannot connect to the cloud. Hospital IT departments refuse to open port 8883 due to strict zero-trust firewall policies. What architectural change allows immediate connectivity without requiring firewall modifications?",
      "options": [
        "Ask the hospital to disable their firewall.",
        "Port 443 with ALPN Protocol Negotiation: Reconfigure the firmware TLS stack to connect to standard port 443 (which is universally permitted for outbound HTTPS) and include the ALPN extension `x-amzn-mqtt-ca` or `mqtt`. The cloud load balancer detects the ALPN tag, terminates TLS, and routes traffic internally to the MQTT broker, bypassing firewall port blocks seamlessly.",
        "Use 5G hotspots duct-taped to the machines.",
        "Dialysis machines do not need cloud connectivity."
      ],
      "answerIdx": 1,
      "debrief": "In industrial and healthcare environments, network security policies strictly forbid opening arbitrary outbound ports (like 8883). ALPN (Application-Layer Protocol Negotiation - RFC 7301) allows standard port 443 (normally reserved for HTTPS) to multiplex different application protocols safely. The TLS ClientHello announces the requested protocol, allowing cloud infrastructure to route connections to the appropriate broker without modifying enterprise firewalls."
    },
    "quests": [
      {
        "num": 1,
        "title": "ALPN RFC 7301 Specification, Port 443 Multiplexing & mTLS Flows",
        "type": "Concept",
        "description": "Analyze ALPN protocol extensions, port 443 load balancer routing, CertificateVerify digital signatures, and firewall traversal physics."
      },
      {
        "num": 2,
        "title": "Hospital Firewall Port 8883 Blackout Detective",
        "type": "Detective Challenge",
        "description": "Investigate a healthcare device deployment failure; demonstrate how enterprise zero-trust firewall policies blocked non-standard MQTT ports."
      },
      {
        "num": 3,
        "title": "mTLS MQTT Client with ALPN Negotiation Engine",
        "type": "Mastery Assignment",
        "description": "Construct an embedded mTLS MQTT client in C / TypeScript featuring port 443 ALPN negotiation, Secure Element signing, and keepalive management."
      },
      {
        "num": 4,
        "title": "Enterprise Firewall Penetration & Protocol Multiplexing Lab",
        "type": "Production Incident Lab",
        "description": "Deploy the mTLS client behind a simulated restrictive enterprise firewall blocking all ports except 443; verify 100% reliable telemetry routing."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone Project 5: Zero-Touch Automated Cloud Provisioning & FIDO Device Onboard (FDO) Engine",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Architectural Milestone (Complete Automated Onboarding & Provisioning Pipeline)",
    "spokenGoal": "Congratulations on completing Block 5. Today you build Milestone Project 5: a production-grade Zero-Touch Automated Cloud Provisioning and FIDO Device Onboard (FDO) Engine! Your system synthesizes the entire lifecycle of device manufacturing and cloud onboarding: 1) A Secure Factory Floor Provisioning Simulator that injects immutable IEEE 802.1AR IDevID certificates via an air-gapped HSM with strict monotonic production quotas; 2) An FDO Late-Binding Engine that generates cryptographically verifiable Ownership Vouchers and executes the TO2 rendezvous handshake; and 3) An Automated Cloud Registration Core that negotiates mTLS over port 443 using ALPN, triggers Just-In-Time Registration (JITR), and binds the node to a strictly parameterized least-privilege MQTT policy! Put your engine through a live deployment simulation: manufacture 50 nodes, transfer ownership vouchers, execute zero-touch cloud onboarding, and verify that rogue cloned nodes are locked out!",
    "conceptInvariant": "Closed-Loop Manufacturing to Cloud Lifecycle Invariant: The device provisioning pipeline must enforce strict cryptographic custody from factory HSM key injection through FDO ownership transfer to automated cloud policy binding. No private key exists in plaintext, no unauthorized overproduction is possible, and all cloud telemetry is bound to least-privilege topics.",
    "failureMode": "Failing to validate the complete cryptographic ownership chain in the FDO Ownership Voucher; an attacker inserts a forged intermediate signature into the voucher and redirects deployed devices to a rogue control server.",
    "tryItFriction": "Construct the Milestone 5 Lifecycle Pipeline in TypeScript / C: 1) Implement the HSM factory provisioning jig with 50-unit quota enforcement; 2) Implement FDO Ownership Voucher generation and TO2 verification; 3) Implement automated JITR mTLS connection over port 443 ALPN; 4) Validate that all 25 automated end-to-end lifecycle assertions pass with zero security warnings.",
    "socraticHints": [
      "How does the Milestone 5 engine prevent a rogue factory from producing unauthorized clone devices?",
      "The factory HSM has a cryptographically signed authorization ticket from corporate headquarters limiting key injection to exactly 50 units!",
      "Any extra devices manufactured will have blank Secure Elements and will be rejected instantly by both the FDO Rendezvous server and cloud JITR!"
    ],
    "situationalPuzzle": {
      "scenario": "During deployment of Milestone Project 5 across 10,000 smart building HVAC controllers, a cyber attacker gains access to the company's customer email portal and downloads an FDO Ownership Voucher for 100 controllers. The attacker attempts to redirect the controllers to a rogue command-and-control broker. However, the attack fails completely because the controllers were already connected and bound to the genuine enterprise cloud 2 weeks earlier. Why did the stolen voucher fail?",
      "options": [
        "Vouchers expire after 24 hours.",
        "One-Time Cryptographic Binding & TO2 State Machine Locking: Once an FDO device successfully completes the TO2 rendezvous protocol, its internal state machine permanently locks into 'PROVISIONED' mode and stores the owner's public key in secure non-volatile storage. Subsequent TO2 attempts using old or stolen vouchers are rejected unconditionally unless a physical, cryptographically authenticated factory-reset command is issued.",
        "HVAC controllers cannot be redirected.",
        "The attacker's IP address was blocked by spam filters."
      ],
      "answerIdx": 1,
      "debrief": "FIDO Device Onboard (FDO) enforces a strict one-time provisioning lifecycle state machine. Once a device establishes ownership during TO2, it stores the owner's root public credentials and transitions into an operational state. It will not listen to further rendezvous redirection requests. An attacker who steals an Ownership Voucher after the device has already been onboarded possesses useless historical metadata."
    },
    "quests": [
      {
        "num": 1,
        "title": "Closed-Loop Device Lifecycle & Factory-to-Cloud Blueprint",
        "type": "Concept",
        "description": "Architect the complete enterprise specification uniting HSM factory key injection, FDO Ownership Vouchers, and JITR cloud enrollment."
      },
      {
        "num": 2,
        "title": "Post-Onboarding Voucher Theft & State Lockout Detective",
        "type": "Detective Challenge",
        "description": "Analyze an incident report where stolen FDO vouchers failed to compromise deployed devices; prove how state machine locking defeated redirection."
      },
      {
        "num": 3,
        "title": "Milestone 5: Complete Automated Provisioning & FDO Engine",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 5 engine: HSM jig + FDO TO2 protocol + ALPN mTLS automated cloud registration."
      },
      {
        "num": 4,
        "title": "1,000-Node Automated Fleet Onboarding Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Simulate manufacturing and onboarding 1,000 virtual edge devices; verify zero manual touch, 100% quota enforcement, and zero rogue registrations."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Defense-in-Depth Layering & Microcontroller Network Hardening: Port & Protocol Lockdown",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Edge Hardening Foundations (Attack Surface Minimization & Network Layer Defenses)",
    "spokenGoal": "We enter Block 6: Month 1 Capstone Preparation. Even with hardware roots of trust and TLS encryption, if your microcontroller runs an open Telnet port, an unauthenticated debug web server, or an unpatched DNS resolver, an attacker will bypass your crypto entirely! Welcome to Defense-in-Depth and Microcontroller Network Hardening. Deconstruct Attack Surface Minimization: 1) Port Lockdown: disable every single listening TCP/UDP port that is not strictly required for the device's core mission. If a device only publishes MQTT telemetry, it should have ZERO open listening ports; 2) Microcontroller Firewall / Packet Filtering: drop non-essential ICMP ping packets, block fragmented IP frames (which frequently exploit reassembly buffer overflows in embedded stacks like LwIP), and enforce strict rate-limiting on inbound traffic; 3) Compiler Hardening: enable GCC stack canaries (`-fstack-protector-strong`) and read-only memory section attributes (`.rodata` in flash)!",
    "conceptInvariant": "Zero-Listening-Port & Protocol Minimization Invariant: An edge sensor node that operates exclusively as an outbound telemetry publisher must maintain zero listening TCP/UDP sockets (0 open ports). Inbound packet handlers must enforce strict buffer bounds and reject fragmented packets at the network layer.",
    "failureMode": "Leaving a hidden diagnostic web server listening on port 80 in production firmware; an attacker uses an Shodan search engine query to find the device, exploits a buffer overflow in the embedded HTTP header parser, and gains remote shell access.",
    "tryItFriction": "Build an Embedded Packet Filter and Attack Surface Hardener in TypeScript: simulate an embedded network interface receiving a stream of packets; implement a packet filtering policy (drop non-TLS, drop IP fragments, drop unsolicited ICMP); benchmark CPU cycles saved; verify that port scanning probes (Nmap SYN scan) reveal zero open ports while outbound mTLS telemetry continues uninterrupted.",
    "socraticHints": [
      "Why are IP fragmented packets particularly dangerous to embedded microcontrollers?",
      "Because reassembling fragmented IP packets requires allocating dynamic memory buffers while waiting for subsequent fragments!",
      "Attackers send overlapping or out-of-order fragments (like the historic Teardrop attack) to trigger heap buffer overflows or memory exhaustion in lightweight stacks like LwIP!"
    ],
    "situationalPuzzle": {
      "scenario": "An industrial temperature sensor gateway deployed in a pharmaceutical cold-storage facility runs FreeRTOS with the LwIP network stack. An automated vulnerability scanner sends 50 fragmented UDP packets with deliberately overlapping byte offsets. The gateway immediately reboots with a BusFault, losing 20 minutes of critical temperature logs. The IT team discovers that LwIP's `IP_REASSEMBLY` feature was enabled. How should the network stack be configured for production?",
      "options": [
        "Upgrade the internet bandwidth from 10 Mbps to 1 Gbps.",
        "Disable IP Reassembly & Restrict MTU: IoT sensors send tiny telemetry payloads (under 500 bytes) and have no operational need to accept fragmented IP packets. Setting `IP_REASSEMBLY = 0` in `lwipopts.h` completely disables the vulnerable reassembly code, dropping all fragmented packets at the physical driver level with zero CPU overhead or buffer risk.",
        "Store temperature logs in the cloud instead of memory.",
        "Reboot the gateway every 5 minutes."
      ],
      "answerIdx": 1,
      "debrief": "Embedded microcontrollers lack the memory resources to safely handle complex network protocols designed for multi-gigabit servers. In constrained IoT nodes, IP fragmentation is rarely legitimate\u2014sensor telemetry packets easily fit within standard 1500-byte MTUs. Disabling IP reassembly (`IP_REASSEMBLY = 0`) eliminates an entire class of complex memory corruption vulnerabilities (such as Ripple20 and Amnesia:33) with a single compiler flag."
    },
    "quests": [
      {
        "num": 1,
        "title": "Defense-in-Depth Theory & Embedded LwIP Hardening Mechanics",
        "type": "Concept",
        "description": "Analyze attack surface minimization, IP fragmentation exploits (Ripple20/Amnesia:33), LwIP compiler hardening flags, and stack protection."
      },
      {
        "num": 2,
        "title": "IP Fragment Overlap & Cold Storage Gateway Crash Detective",
        "type": "Detective Challenge",
        "description": "Analyze a pharmaceutical plant cold-storage incident report; prove how overlapping IP fragments exploited LwIP reassembly buffers."
      },
      {
        "num": 3,
        "title": "Zero-Port Packet Filter & Network Hardening Firewall Engine",
        "type": "Mastery Assignment",
        "description": "Implement an embedded packet firewall in C / TypeScript with zero-listening-port enforcement, fragment dropping, and ICMP rate limiting."
      },
      {
        "num": 4,
        "title": "Automated Nmap Attack Surface & Port Scan Audit Lab",
        "type": "Production Incident Lab",
        "description": "Subject the hardened network stack to simulated Nmap SYN, UDP, and fragmentation scans; verify 0 open ports and 100% exploit rejection."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Cryptographic Key Lifecycle Management & Emergency Zeroization",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Key Destruction & Decommissioning (Key Lifecycles, NIST SP 800-57 & Emergency Zeroization)",
    "spokenGoal": "Every cryptographic key has a lifecycle: Generation, Distribution, Activation, Rotation, Deactivation, and Destruction (NIST SP 800-57). While engineers spend months thinking about how to generate keys, almost nobody plans for how to destroy them! In industrial security, key destruction is just as critical as key creation. What happens when an edge gateway is about to be physically dismantled by an adversary in the field? Enter Emergency Zeroization and Key Destruction. Deconstruct the physical mechanisms: 1) Hardware Zeroization: asserting an internal hardware wipe signal that discharges the backup battery domain and writes zeros to all secure key registers in under 50 nanoseconds; 2) Software Overwrite: volatile memory buffers must be scrubbed using compiler-barrier routines (`explicit_bzero()` or `SecureZeroMemory()`)\u2014standard C `memset(key, 0, 32)` is dangerous because optimizing compilers routinely delete 'dead' memset calls as an optimization! Master Zeroization Audit Certificates: generating a signed attestation proving that a key has been permanently destroyed!",
    "conceptInvariant": "Irreversible Zeroization & Non-Optimizable Scrubbing Invariant: Key erasure must employ volatile compiler-barrier memory wiping (explicit_bzero) or hardware-autonomous capacitor discharge circuits. Standard memset calls that can be eliminated by compiler dead-code elimination are strictly prohibited.",
    "failureMode": "Using standard C `memset(key_buffer, 0, 32)` to wipe sensitive keys from RAM before returning from a function; the GCC compiler with `-O3` optimizes the memset call away entirely because `key_buffer` is never read again, leaving the plaintext key sitting in RAM.",
    "tryItFriction": "Build a Cryptographic Key Lifecycle and Zeroization Controller in TypeScript / C: implement key state transitions (Pre-Activation -> Active -> Compromised -> Destroyed); demonstrate how an optimizing compiler removes dead `memset` calls; implement a compiler-barrier `secureWipe(buffer)` function; simulate a physical enclosure breach trigger and verify that active session keys and storage keys are overwritten with verified zeros in under 1 millisecond.",
    "socraticHints": [
      "Why does GCC with `-O3` optimization delete `memset(key, 0, 32)` at the end of a function?",
      "Because compilers analyze data flow: if a memory buffer is about to go out of scope and is never read again, the compiler considers writing zeros to it to be useless dead code!",
      "Using `volatile` memory pointers or `explicit_bzero` forces the compiler to emit the memory write instructions unconditionally!"
    ],
    "situationalPuzzle": {
      "scenario": "A defense drone lands behind enemy lines during an engine failure. The flight computer initiates an emergency zeroization routine using `memset(master_encryption_key, 0, sizeof(master_encryption_key))` followed by a CPU reset. Adversary engineers recover the drone, freeze the RAM chip with cooling spray, and dump the memory. The 256-bit AES master key is found completely intact. The firmware source code clearly contains the `memset` call. Why was the key not erased?",
      "options": [
        "The drone was hacked by a satellite.",
        "Compiler Dead-Store Elimination: The compiler's optimization pass (`-O2` or `-O3`) analyzed the function, determined that `master_encryption_key` was not referenced anywhere after the `memset` call before reset, and completely removed the `memset` instructions as redundant dead stores. The firmware must use `explicit_bzero()` or volatile pointer loops with memory barriers (`asm volatile(\"\" ::: \"memory\")`) to prevent optimization.",
        "AES keys cannot be erased from RAM.",
        "Drones do not support C compilers."
      ],
      "answerIdx": 1,
      "debrief": "Dead-store elimination is a notorious pitfall in secure C programming. Optimizing compilers treat any memory write that is not subsequently read before the variable goes out of scope as wasted compute and optimize it away. When zeroizing sensitive cryptographic assets, developers must use standard secure clearing functions (like `explicit_bzero`, C11 `memset_s`, or volatile pointer barriers) that are guaranteed never to be eliminated by the optimizer."
    },
    "quests": [
      {
        "num": 1,
        "title": "NIST SP 800-57 Key Lifecycle States & Dead-Store Elimination Physics",
        "type": "Concept",
        "description": "Analyze key states (Generation through Destruction), compiler optimization dead-store mechanics, memory barriers, and hardware zeroization circuits."
      },
      {
        "num": 2,
        "title": "Optimized-Away memset & Captured Drone Memory Leak Detective",
        "type": "Detective Challenge",
        "description": "Dissect a military embedded forensics report; prove through disassembly inspection how GCC `-O3` removed key-clearing `memset` instructions."
      },
      {
        "num": 3,
        "title": "Irreversible Key Lifecycle & Compiler-Barrier Zeroization Engine",
        "type": "Mastery Assignment",
        "description": "Construct an embedded key management library in C / TypeScript with NIST state tracking, volatile memory scrubbing, and tamper-triggered zeroization."
      },
      {
        "num": 4,
        "title": "Emergency Tamper Intrusion & Atomic Key Erasure Lab",
        "type": "Production Incident Lab",
        "description": "Trigger an emergency zeroization event under simulated physical compromise; verify that 100% of sensitive memory sectors contain zero residual data."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Secure Storage of Ephemeral Tokens & Session State: Encrypted NVS & AEAD",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Non-Volatile Security (Encrypted NVS, AEAD Authenticated Storage & Replay Defense)",
    "spokenGoal": "Embedded devices need to store configuration data, Wi-Fi credentials, session tokens, and calibration values in non-volatile flash memory (NVS). But writing plaintext configuration files to internal or external flash is an open invitation for credential theft! Today you engineer Encrypted Non-Volatile Storage (Encrypted NVS). Deconstruct Authenticated Encryption with Associated Data (AEAD - like AES-CCM or ChaCha20-Poly1305): why is encryption alone not enough? If you only encrypt data without authentication, an attacker who cannot read the data can still flip ciphertext bits (bit-flipping attacks) to corrupt configuration values or change network ports! AEAD provides both Confidentiality (encryption) and Integrity/Authenticity (a 16-byte cryptographic MAC tag). Master Anti-Replay Rollback Protection in NVS: include a Monotonic Generation Counter in the Associated Data (AD); if an attacker restores an old flash backup containing obsolete credentials, the AEAD tag verification fails!",
    "conceptInvariant": "AEAD Authenticated Storage & Rollback Invariant: All non-volatile persistent storage of sensitive data must utilize Authenticated Encryption with Associated Data (AEAD). The Associated Data (AD) must cryptographically bind the storage key's address and a monotonic revision counter, preventing ciphertext splicing, bit-flipping, and flash rollback attacks.",
    "failureMode": "Storing Wi-Fi credentials in external SPI flash using raw AES-CBC without an integrity MAC; an attacker flips bits in the ciphertext to alter the DNS server IP address to a malicious rogue resolver, hijacking all cloud connections.",
    "tryItFriction": "Build an Encrypted NVS Storage Engine in TypeScript: implement a key-value store in simulated flash memory; encrypt values using AES-GCM; bind the storage key name and monotonic version counter into the Associated Data (AD); simulate an attacker modifying 1 byte of ciphertext (bit-flipping); verify that AEAD decryption rejects the corrupted payload; simulate restoring an old flash backup and verify rollback rejection.",
    "socraticHints": [
      "Why must the storage key name (e.g., 'wifi_password') be included in the Associated Data (AD)?",
      "Because otherwise an attacker could copy the valid ciphertext from 'test_token' and paste it over 'admin_password' (ciphertext splicing)!",
      "Binding the key name into the AEAD authentication tag guarantees that a ciphertext block is valid ONLY for its specific intended storage key!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart home hub uses encrypted flash storage for user settings. The firmware encrypts each setting with AES-CTR using a key derived from the MCU's hardware UID. A security researcher unclips the flash chip, modifies 4 bytes in the `cloud_port` setting ciphertext, and solders the chip back on. When the hub boots, it decrypts the modified bytes without errors and connects to port 8080 (the researcher's proxy) instead of port 443. How did the researcher modify the port number without knowing the AES key?",
      "options": [
        "The researcher guessed the 128-bit key.",
        "Malleability of Unauthenticated Stream Ciphers (Bit-Flipping Attack): AES-CTR is a stream cipher where `Ciphertext = Plaintext XOR Keystream`. The keystream is unchanged by data modification! If the attacker knows the original plaintext was '0443' and wants '8080', they simply compute `New_Ciphertext = Old_Ciphertext XOR '0443' XOR '8080'`. Because there was no AEAD authentication tag (like AES-GCM or ChaCha20-Poly1305), the hub decrypted the modified ciphertext without detecting tampering.",
        "Flash chips automatically repair bit errors.",
        "The hub's power supply was noisy."
      ],
      "answerIdx": 1,
      "debrief": "Stream ciphers (like AES-CTR and ChaCha20) and CBC mode without MACs are mathematically malleable. An attacker who knows or guesses any part of the plaintext can flip specific bits in the ciphertext to produce predictable modifications in the decrypted plaintext, with zero knowledge of the encryption key. Authenticated Encryption (AEAD) is mandatory for storage: any bit modification corrupts the 128-bit MAC tag and triggers an immediate decryption error."
    },
    "quests": [
      {
        "num": 1,
        "title": "AEAD Cryptographic Mathematics & Stream Cipher Malleability",
        "type": "Concept",
        "description": "Analyze AEAD constructions (AES-GCM, ChaCha20-Poly1305, AES-CCM), bit-flipping attack mathematics, Associated Data binding, and NVS layouts."
      },
      {
        "num": 2,
        "title": "AES-CTR Bit-Flipping Port Redirection Detective",
        "type": "Detective Challenge",
        "description": "Reconstruct a bit-flipping exploit on an industrial IoT hub; demonstrate mathematically how ciphertext modification altered configuration ports."
      },
      {
        "num": 3,
        "title": "Encrypted Non-Volatile Storage (NVS) Core Engine",
        "type": "Mastery Assignment",
        "description": "Construct an embedded encrypted key-value storage engine in C / TypeScript with AES-GCM AEAD, Associated Data binding, and rollback protection."
      },
      {
        "num": 4,
        "title": "Flash Corruption & Ciphertext Splicing Penetration Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Encrypted NVS engine to 1,000 ciphertext bit-flips, sector splicing attacks, and historical rollback restores; verify 100% rejection."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Principal Embedded Security Architect Review: Threat Modeling & FIPS 140-3 Compliance",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Enterprise Security Review (Compliance Standards, FIPS 140-3 & Common Criteria EAL)",
    "spokenGoal": "You are preparing to defend the Month 1 Capstone before the Senior Technical Review Board. Today, you operate as a Principal Embedded Security Architect. You do not write code; you perform the comprehensive architectural security review and compliance gap analysis for an institutional industrial edge deployment! Deconstruct international cybersecurity regulatory standards: 1) FIPS 140-3 (Federal Information Processing Standards) Security Levels 1 to 4: from basic software cryptography (Level 1) to full physical tamper response and environmental failure protection (Level 4); 2) Common Criteria (ISO/IEC 15408) Evaluation Assurance Levels (EAL1 to EAL7): proving that security claims are mathematically modeled and formally verified; 3) NIST SP 800-193 (Platform Firmware Resiliency): Protection, Detection, and Recovery. Author a comprehensive Security Target document that proves defense-in-depth across the entire Month 1 curriculum!",
    "conceptInvariant": "Principal Systems Security Synthesis Invariant: An industrial IoT security architecture must demonstrate compliance with FIPS 140-3 Level 3/4 and NIST SP 800-193 guidelines, providing verifiable architectural proofs for hardware root of trust, cryptographic key non-exportability, side-channel resilience, and autonomous recovery.",
    "failureMode": "Designing an IoT product that relies exclusively on software cryptography without hardware security modules, failing FIPS 140-3 certification and disqualifying the product from a $40M federal smart grid infrastructure contract.",
    "tryItFriction": "Author the complete Architectural Security Target Specification in Markdown / TypeScript: define the Security Problem Definition, Threat Agents, and Security Functional Requirements (SFRs); map hardware protections (SRAM PUF, eFuses, TrustZone-M, Secure Boot) to FIPS 140-3 Level 3 requirements; draft the formal verification checklist for tomorrow's Capstone Viva Gate.",
    "socraticHints": [
      "What is the critical difference between FIPS 140-3 Level 2 and Level 3?",
      "Level 2 requires only passive physical tamper-evidence (like tamper-evident holographic seals on enclosures)!",
      "Level 3 mandates ACTIVE physical tamper detection and zeroization (the silicon must detect intrusion and actively erase its own keys in nanoseconds)!"
    ],
    "situationalPuzzle": {
      "scenario": "A medical device manufacturer submits an automated insulin pump to the FDA for 510(k) premarket clearance. The pump uses software AES-256 running in FreeRTOS, with the device private key stored in internal flash memory. The FDA rejects the application under the new 2023 FDA Medical Device Cybersecurity Mandate (Section 524B of the FD&C Act). What architectural deficiency caused the regulatory rejection?",
      "options": [
        "The insulin pump enclosure was not blue.",
        "Failure to Implement a Hardware Root of Trust and Immutable Chain of Trust: The FDA mandates that life-critical medical devices must demonstrate hardware-anchored security per NIST SP 800-193, including secure boot anchored in immutable hardware, non-exportable cryptographic keys in a Secure Element or TrustZone, and tamper-resistant storage. Storing private keys in mutable software flash fails basic regulatory requirements.",
        "Medical devices do not need FDA approval.",
        "The software was written in C instead of Python."
      ],
      "answerIdx": 1,
      "debrief": "Modern cybersecurity regulations (such as the FDA 2023 Cybersecurity Mandate, EU Cyber Resilience Act [CRA], and IEC 62443) have permanently raised the bar. Relying on software-only security (keys in flash, software-only boot checks) is no longer legally compliant for critical infrastructure or medical devices. Hardware-anchored security\u2014including a silicon Root of Trust, Secure Boot, and non-exportable keys\u2014is a mandatory legal requirement."
    },
    "quests": [
      {
        "num": 1,
        "title": "FIPS 140-3 Standards, Common Criteria EAL & NIST SP 800-193 Framework",
        "type": "Concept",
        "description": "Analyze FIPS 140-3 Security Levels 1-4, Common Criteria protection profiles, NIST SP 800-193 resiliency pillars, and regulatory mandates."
      },
      {
        "num": 2,
        "title": "FDA Medical Device Cybersecurity Rejection Audit Detective",
        "type": "Detective Challenge",
        "description": "Investigate a rejected $40M medical device filing; prove how lack of hardware-anchored private key storage violated FDA Section 524B rules."
      },
      {
        "num": 3,
        "title": "Principal Embedded Security Target Specification Document",
        "type": "Mastery Assignment",
        "description": "Author an enterprise-grade Security Target Specification mapping hardware RoT, TrustZone-M, and secure provisioning to FIPS 140-3 Level 3."
      },
      {
        "num": 4,
        "title": "Enterprise Cybersecurity Compliance Defense Lab",
        "type": "Production Incident Lab",
        "description": "Defend your security architecture before a simulated regulatory certification auditor; answer grueling challenges regarding key life, side-channels, and tamper."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexSentry Industrial Secure Edge Sentinel & Cryptographic Hardware Root of Trust Capstone Viva Gate",
    "stageName": "Stage 2: Secure Identity & Provisioning",
    "stageNum": 2,
    "pedagogicalRole": "Month 1 Grand Capstone & Comprehensive Technical Defense (Mastery of Days 1-30)",
    "spokenGoal": "Welcome to Day 30: the Month 1 Capstone Defense of Course 19! Over the past 30 days, you have progressed from embedded threat modeling, physical attack surfaces, and SRAM PUFs to eFuses, constant-time cryptography, immutable Mask ROM secure boot, Ed25519 manifests, anti-rollback monotonic counters, ARM TrustZone-M, XIP flash encryption, JTAG lockdown, Boolean masking against DPA, fault injection resilience, IEEE 802.1AR device identity, zero-heap X.509 parsing, TLS 1.3 mTLS with ALPN, factory HSM provisioning, FDO late-binding, and emergency zeroization! Today, you defend the Month 1 Grand Capstone: ApexSentry\u2014an industrial secure edge sentinel deployed in critical infrastructure! Your firmware integrates the complete hardware security chain: from cold-boot memory scrub and PUF key derivation to TrustZone isolation, secure boot, and authenticated TLS 1.3 cloud telemetry. Face the Senior Embedded Security Review Board across 4 grueling technical defense stations!",
    "conceptInvariant": "Month 1 Master Security Architecture Invariant: The ApexSentry platform synthesizes physical silicon entropy (PUF/eFuse), immutable staged verification (Secure Boot), hardware domain isolation (TrustZone-M), physical side-channel defenses (DPA masking/glitch hardening), and cryptographically proven identity (IEEE 802.1AR/mTLS) into a unified, zero-compromise embedded security firmware core.",
    "failureMode": "Failing the Senior Review Board Viva Gate by being unable to mathematically defend the relationship between SRAM PUF startup bit-error rates, Fuzzy Extractor error correction budgets, constant-time modular arithmetic, and hardware TrustZone-M bus fault isolation.",
    "tryItFriction": "Execute the ApexSentry Month 1 Capstone Firmware Simulation in TypeScript / C: 1) Boot the simulated Cortex-M33 with hardware Mask ROM and verify eFuse hashes; 2) Derive master keys from the simulated SRAM PUF using the Fuzzy Extractor; 3) Initialize TrustZone-M SAU partitions and NSC veneers; 4) Verify the Ed25519 application manifest and anti-rollback eFuse; 5) Establish a hardware-accelerated TLS 1.3 mTLS connection to the cloud broker over port 443 with ALPN; 6) Pass all 30 automated security validation assertions.",
    "socraticHints": [
      "What is the single most important lesson of Month 1 of Industrial IoT Security?",
      "Software cannot secure itself! Software without hardware security anchors is a house built on sand.",
      "True security originates in the physical silicon: immutable Mask ROM, unalterable eFuses, microscopic PUF physics, and hardware bus-level domain isolation!"
    ],
    "situationalPuzzle": {
      "scenario": "During the live Capstone Viva Defense, the Senior Security Examiner injects a triple combined attack on the ApexSentry node: 1) An external programmer attempts to write an older, vulnerable firmware version (downgrade attack); 2) A laboratory glitch generator drops VDD by 15% during the signature verification branch (fault injection); and 3) An oscilloscope records power traces during the fallback AES key generation (DPA attack). How does the ApexSentry firmware maintain total system security?",
      "options": [
        "The system crashes and restarts in debug mode.",
        "Multi-Layer Hardware-Hardened Defense-in-Depth: 1) The hardware monotonic eFuse counter immediately rejects the legacy image regardless of signature; 2) The redundant multi-condition verification checks and multi-bit tokens detect the glitch and trigger a fail-secure halt; 3) The Boolean masked AES core processes randomized shares, ensuring zero statistical correlation in the power traces. The system enters a secure lockout state and preserves all assets.",
        "The node broadcasts an SOS message over plaintext radio.",
        "The microcontroller shuts down permanently and cannot be rebooted."
      ],
      "answerIdx": 1,
      "debrief": "A true Master-level security architecture implements defense-in-depth where no single failure point compromises the system. Even when an adversary combines physical fault injection, version rollback, and side-channel power monitoring simultaneously, the multi-layered defenses (eFuse monotonic counters, redundant step-check tokens, and Boolean masking) reinforce each other, ensuring the node transitions deterministically into a fail-secure state."
    },
    "quests": [
      {
        "num": 1,
        "title": "ApexSentry Architecture & Master Security Specification",
        "type": "Concept",
        "description": "Document the complete mathematical and firmware architectural specification uniting silicon RoT, TrustZone-M, and secure provisioning."
      },
      {
        "num": 2,
        "title": "Triple Combined Attack Forensics & Defense Detective",
        "type": "Detective Challenge",
        "description": "Analyze the system's response under simultaneous rollback injection, voltage glitching, and DPA capture; prove multi-layer containment."
      },
      {
        "num": 3,
        "title": "ApexSentry Month 1 Capstone Security Firmware Core",
        "type": "Mastery Assignment",
        "description": "Implement and validate the complete C / TypeScript ApexSentry capstone engine: staged boot + PUF RoT + TrustZone + mTLS cloud telemetry."
      },
      {
        "num": 4,
        "title": "Senior Embedded Security Review Board Viva Defense Gate",
        "type": "Production Incident Lab",
        "description": "Complete the rigorous oral and practical defense before the Senior Systems Panel; achieve a 100% pass mark across all Month 1 competencies."
      }
    ]
  }
];

export const IOT_SECURITY_MONTH_2_SPECS: MasterclassDaySpec[] = [
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Secure FOTA Architecture & IETF SUIT Manifest (RFC 9019): CBOR/COSE Signing",
    "stageName": "Stage 3: Secure FOTA & Industrial Protocols",
    "stageNum": 3,
    "pedagogicalRole": "Firmware Lifecycle Pipelines (IETF SUIT RFC 9019, CBOR Containers & COSE Signing)",
    "spokenGoal": "Welcome to Month 2. Today we expand from device identity and provisioning into long-term fleet survival: Secure Firmware Over-The-Air (FOTA) Updates. If a firmware update pipeline is compromised, an attacker doesn't hack one device\u2014they instantly compromise your entire global fleet of 500,000 devices! Enter the IETF SUIT Manifest standard (RFC 9019 - Software Updates for Internet of Things). Deconstruct why proprietary update formats fail: they lack cryptographic dependency modeling and standardized component targeting. SUIT packages updates using CBOR (Concise Binary Object Representation) signed with COSE (CBOR Object Signing and Encryption). Deconstruct the SUIT Manifest structure: 1) Manifest Envelope: COSE_Sign1 detached Ed25519 signature; 2) Common Sequence: target vendor ID (RFC 4122 UUID), class ID, and device precondition checks (battery level > 20%, sufficient free flash sectors); 3) Install Sequence: image fetch URI, cryptographic SHA-256 digest, and flash write destination!",
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
      "debrief": "Writing unverified OTA packets directly over the active boot partition is a fatal anti-pattern. Any interruption\u2014power loss, radio disconnect, or checksum failure\u2014leaves the microcontroller with half old code and half new code, causing an immediate hard fault on boot. Modern firmware architectures require dual-bank (A/B) partitioning where incoming updates are written to an isolated staging slot."
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
    "spokenGoal": "Welcome to Block 8: Industrial Fieldbus Security. For decades, factories, power plants, and oil refineries have run on legacy protocols designed in the 1970s: Modbus, RS-485, Profibus, and CAN bus. In the 1970s, factories were physically isolated, so security was completely ignored! Today these legacy fieldbuses are connected to Ethernet gateways and the internet, creating catastrophic industrial vulnerabilities! Deconstruct Modbus TCP (Port 502): 1) Zero Authentication: any device on the network can send Modbus commands to any PLC\u2014there are no passwords, no tokens, and no signatures; 2) Zero Encryption: all coil registers, holding registers, and analog sensor values travel in plaintext; 3) Zero Integrity: packets have no cryptographic MAC tags. An attacker can send Modbus Function Code 0x05 (Write Single Coil) to force open an emergency high-pressure steam valve! Trace RS-485 physical bus tapping: connecting two alligator clips to the differential A/B wires allows passive eavesdropping on all serial traffic!",
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
    "spokenGoal": "How do you modernize legacy industrial networks without tearing out millions of dollars of factory machinery? You upgrade them with modern secure industrial standards: Modbus Security (IEC 62351-08) and Secure CAN Bus (AUTOSAR SecOC)! Deconstruct Modbus Security (Port 802): IEC 62351-08 wraps traditional Modbus inside mutually authenticated TLS (mTLS), mandating role-based access control (Operator, Engineer, Administrator) based on X.509 certificate roles. Read-only operators are cryptographically prevented from issuing write commands! Deconstruct Secure CAN Bus and CAN-FD: in automotive and industrial robotics, CAN bus frames have no sender ID\u2014any node on the bus can spoof an ECU! Master AUTOSAR SecOC (Secure Onboard Communication): appends a Truncated Message Authentication Code (MAC - 24 to 32 bits) and a Monotonic Freshness Value (FV) to every CAN payload. Even with physical bus access, an attacker cannot forge CAN frames or replay historical steering commands!",
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
      "A physical optical data diode has no physical return fiber\u2014transmitting backward is as impossible as making light fly backward!"
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
  },
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "Embedded Memory Corruption Exploits: Buffer Overflows, ROP Chains & Heap Abuse",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Offensive Memory Safety (ARM Cortex-M Stack Overflows, ROP Gadgets & RTOS Heap Exploits)",
    "spokenGoal": "Welcome to Stage 4: Fleet Vulnerability Management, Device Lifecycle, and Master Capstone. To build impenetrable embedded defenses, you must first master how attackers break into embedded systems at the machine level! Most microcontroller firmware is written in C and C++, languages without automatic memory safety. Today you deconstruct Embedded Memory Corruption Exploits on ARM Cortex-M. Trace a classic Stack Buffer Overflow: an unconstrained `strcpy()` in a serial packet parser writes 80 bytes into a 32-byte buffer, corrupting local variables, overwriting the saved Frame Pointer (R7), and replacing the stored Link Register (LR / Return Address) with an attacker-controlled memory address! But modern microcontrollers have Execute-Never (XN) bits that mark SRAM as non-executable\u2014you cannot inject raw shellcode into RAM! How do attackers bypass this? Return-Oriented Programming (ROP)! Attackers search existing firmware flash memory for tiny instruction sequences ending in `BX LR` or `POP {PC}` (known as ROP Gadgets) and chain them together to execute arbitrary code without writing a single new instruction!",
    "conceptInvariant": "Memory Safety Invariant: Any unbounded memory copy (`strcpy`, `sprintf`, `gets`) is an existential defect. All buffer operations must enforce compile-time or runtime bound checks (`snprintf`, `strlcpy`), and memory regions storing variable data (SRAM) must be strictly marked as Execute-Never (XN) by the Memory Protection Unit (MPU).",
    "failureMode": "Using `sprintf(buffer, \"SENSOR_%s\", input_id)` without length bounds in a medical infusion pump firmware; an attacker sends a 64-byte ID over BLE, overwrites the return address on the stack, and redirects program flow to bypass insulin dose safety limits.",
    "tryItFriction": "Build a Stack Memory Layout and ROP Chain Exploit Simulator in TypeScript: model an ARM Cortex-M stack frame (Local Buffers, Saved R7, Saved LR, Function Arguments); demonstrate how an unchecked 48-byte string input overwrites the Link Register; construct a 3-gadget ROP chain that sets R0=1 and calls `disable_safety_interlock()`; then implement compiler stack canaries and prove that the canary check traps the corruption and aborts before the return address is executed.",
    "socraticHints": [
      "Why is shellcode injection into SRAM ineffective on modern microcontrollers with an active MPU?",
      "Because the MPU (Memory Protection Unit) marks SRAM regions as Execute-Never (XN / eXecute Never)!",
      "If the CPU instruction fetcher tries to execute code from an XN memory region, the hardware triggers a MemManage Fault immediately!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart connected pacemaker uses an ARM Cortex-M3. A security research team audits the firmware and discovers that the MPU marks all 64 KB of SRAM as Execute-Never (XN), meaning injected code in RAM cannot run. However, the researchers demonstrate a successful remote exploit over BLE that changes the pacing voltage. How did they achieve arbitrary execution if RAM is non-executable?",
      "options": [
        "They used an infrared laser to melt the silicon.",
        "Return-Oriented Programming (ROP) Reusing Flash Gadgets: ROP does not execute code from RAM! It executes legitimate, existing machine instructions already stored in executable Flash memory. By overflowing the stack buffer to overwrite return addresses, the attacker chains together snippets of existing firmware (gadgets) to manipulate registers and call existing functions, bypassing Execute-Never (XN) protections completely.",
        "Pacemakers do not have RAM.",
        "The Bluetooth antenna generated gamma radiation."
      ],
      "answerIdx": 1,
      "debrief": "Execute-Never (XN) and W^X (Write XOR Execute) memory protections prevent an attacker from executing custom shellcode injected into RAM, but they do NOT prevent Return-Oriented Programming (ROP). In a ROP attack, the attacker reuses existing machine instructions already present in legitimate flash memory, chaining together small sequences (gadgets) by controlling the call stack. Mitigating ROP requires stack canaries, Control Flow Integrity (CFI), and memory-safe coding."
    },
    "quests": [
      {
        "num": 1,
        "title": "ARM Cortex-M Stack Frame Geometry, Calling Conventions & ROP Math",
        "type": "Concept",
        "description": "Analyze AAPCS calling conventions, stack frame layout, Link Register hijacking, ROP gadget chaining mechanics, and MPU XN attributes."
      },
      {
        "num": 2,
        "title": "Pacemaker BLE Stack Overflow & Pacing Voltage Hijack Detective",
        "type": "Detective Challenge",
        "description": "Investigate a medical device vulnerability report; reconstruct the stack trace demonstrating how an unchecked string input enabled ROP execution."
      },
      {
        "num": 3,
        "title": "Stack Overflow & ROP Chain Exploitation Simulator",
        "type": "Mastery Assignment",
        "description": "Build an ARM Cortex-M memory simulator in TypeScript demonstrating stack frame overwrite, gadget alignment, and stack canary verification."
      },
      {
        "num": 4,
        "title": "Vulnerable C Firmware Audit & Automated Static Analysis Lab",
        "type": "Production Incident Lab",
        "description": "Audit a 2,000-line embedded C codebase; identify 8 memory safety vulnerabilities (`strcpy`, format string, heap double-free) and refactor to safe primitives."
      }
    ]
  },
  {
    "day": 47,
    "month": 2,
    "blockNum": 10,
    "title": "Firmware Hardening & Compiler Defenses: Stack Canaries, MPU Guards & CFI",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Defensive Binary Hardening (Stack Canaries, MPU Guard Pages & Control Flow Integrity)",
    "spokenGoal": "Now that you understand how memory exploits work, you will make your firmware impervious to them! Today you implement Firmware Hardening and Compiler Defenses on ARM Cortex-M. Deconstruct Stack Canaries (`-fstack-protector-strong`): the compiler inserts a random 32-bit secret integer (the canary) onto the stack immediately before the saved return address (LR). When a buffer overflow occurs, it must overwrite the canary before reaching the return address! Before returning from the function, the CPU checks the canary: if the value has changed by even 1 bit, the system halts immediately (`__stack_chk_fail`), killing the exploit before the corrupted return address can be executed! Deconstruct MPU Stack Guard Pages: configure the hardware Memory Protection Unit (MPU) to place an inaccessible 32-byte region at the bottom of every FreeRTOS task stack. If a task overflows its stack, the CPU triggers an immediate MemManage Fault! Master Control Flow Integrity (CFI): cryptographically validating function pointer targets before indirect branching!",
    "conceptInvariant": "Compiler-Hardened Binary & MPU Guard Region Invariant: Production firmware binaries must be compiled with stack protection (-fstack-protector-strong) and MPU-enforced inaccessible stack guard regions. Any stack canary corruption or guard page access must trigger immediate, deterministic safe-state halting.",
    "failureMode": "Hardcoding a static stack canary value (`0x00000000` or `0xDEADBEEF`) across all devices; an attacker discovers the static value in a firmware binary, crafts an overflow payload containing the exact canary bytes, and overwrites the return address without tripping the check.",
    "tryItFriction": "Build a Stack Canary and MPU Guard Page Engine in TypeScript: implement an emulated FreeRTOS task allocator; inject a dynamic hardware TRNG canary onto the stack frame; configure an MPU guard page below the stack; simulate an escalating stack buffer write; verify that an overwrite of 36 bytes trips `__stack_chk_fail()`, while an unchecked 500-byte stack growth trips an MPU MemManage Fault.",
    "socraticHints": [
      "Why must the stack canary value contain a null byte (0x00) or be derived from a hardware True Random Number Generator (TRNG)?",
      "Because string copy functions like `strcpy()` and `sprintf()` terminate immediately when they encounter a null byte (0x00)!",
      "A canary containing `0x00` prevents standard string functions from overflowing past it, and a TRNG-derived canary cannot be guessed by the attacker!"
    ],
    "situationalPuzzle": {
      "scenario": "An industrial IoT gateway uses FreeRTOS on an STM32H7. During heavy network traffic, the gateway randomly reboots once every 3 days. Post-mortem analysis reveals that the network task stack grows by 400 bytes during TLS handshakes, silently overflowing into an adjacent task's memory buffer and corrupting motor sensor readings. What MPU hardware configuration would have caught this bug instantly during testing?",
      "options": [
        "Increase the CPU clock to 480 MHz.",
        "MPU Unprivileged Stack Guard Regions: Configure an unprivileged 32-byte MPU region with NO_ACCESS permissions directly at the bottom limit of each RTOS task's allocated stack memory. The instant the task stack pointer (SP) decrements into this guard region during the TLS handshake, the hardware Memory Protection Unit generates an immediate MemManage Fault with precise program counter telemetry, identifying the exact stack overflow line instantly.",
        "FreeRTOS tasks cannot overflow.",
        "Disable TLS to reduce stack usage."
      ],
      "answerIdx": 1,
      "debrief": "Silent stack overflows are among the hardest bugs to diagnose in embedded systems because they silently corrupt whatever variables happen to sit in adjacent RAM memory. An MPU Stack Guard Region places an invisible 'tripwire' at the bottom of each task's stack memory. Any stack access that crosses the boundary triggers an immediate hardware MemManage exception, catching the stack exhaustion bug instantly before data corruption can spread."
    },
    "quests": [
      {
        "num": 1,
        "title": "Stack Canary Physics, MPU Guard Geometries & CFI Mechanics",
        "type": "Concept",
        "description": "Analyze GCC stack protector assembly generation, MPU sub-region disabling math, TRNG canary initialization, and forward-edge CFI branch checks."
      },
      {
        "num": 2,
        "title": "Silent Task Stack Overflow & Industrial Motor Fault Detective",
        "type": "Detective Challenge",
        "description": "Analyze an RTOS memory corruption post-mortem; prove how an unchecked TLS task stack overflow corrupted adjacent motor PID parameters."
      },
      {
        "num": 3,
        "title": "Embedded MPU Stack Guard & Canary Protection Engine",
        "type": "Mastery Assignment",
        "description": "Construct an RTOS task hardening library in C / TypeScript with dynamic TRNG stack canaries and MPU stack boundary tripwire traps."
      },
      {
        "num": 4,
        "title": "Automated Binary Exploitation Resilience Benchmark Lab",
        "type": "Production Incident Lab",
        "description": "Launch 1,000 automated stack overflow and pointer corruption payloads against the hardened binary; verify 100% detection and safe halting."
      }
    ]
  },
  {
    "day": 48,
    "month": 2,
    "blockNum": 10,
    "title": "Host-Based Intrusion Detection Systems (HIDS) for Embedded MCUs: System Call Profiling",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Runtime Anomaly Detection (Embedded HIDS, Syscall Whitelisting & Task Execution Fingerprinting)",
    "spokenGoal": "Firewalls and secure boot protect the front door. But what happens if an attacker exploits a zero-day vulnerability in your application at runtime? How does the device know it has been compromised from within? Enter Host-Based Intrusion Detection Systems (HIDS) for microcontrollers. Unlike servers with gigabytes of RAM running complex antivirus software, an embedded MCU with 128 KB of SRAM needs a deterministic, ultra-lightweight HIDS. Deconstruct Embedded HIDS mechanisms: 1) System Call and API Whitelisting: an embedded RTOS task has predictable behavior. A temperature sensor task should call `ADC_Read()`, `FreeRTOS_Delay()`, and `MQTT_Publish()`. If the temperature task suddenly attempts to call `Flash_Write()` or `Socket_Open(port 4444)`, it has been compromised! 2) Execution Timing and Jitter Profiling: monitoring CPU task cycle budgets; 3) Flash Code Integrity Checksumming: periodically hashing flash memory sectors using background DMA to detect physical or memory injection tampering!",
    "conceptInvariant": "Deterministic Behavioral Specification & Syscall Whitelisting Invariant: Embedded RTOS tasks must be bound to deterministic operational behavioral profiles (allowed API/syscall bitmasks and memory access limits). Any unauthorized system call or unexpected task execution sequence must trigger an immediate security tripwire.",
    "failureMode": "Running an embedded gateway without runtime monitoring; an attacker exploits a buffer overflow, establishes a reverse shell over a raw socket, and exfiltrates sensor telemetry for 9 months because the device never checked what APIs the network task was calling.",
    "tryItFriction": "Build an Embedded Host-Based Intrusion Detection System (HIDS) in TypeScript: model 3 FreeRTOS tasks (SensorTask, DisplayTask, NetworkTask); define an authorized API bitmask for each task; implement a supervisory HIDS hook intercepting all system calls; simulate an exploited SensorTask attempting an unauthorized `Flash_Erase()` call; verify that the HIDS detects the behavioral anomaly, logs a forensic alert, and suspends the compromised task.",
    "socraticHints": [
      "Why is behavioral profiling vastly more effective on microcontrollers than on desktop PCs?",
      "Desktop PCs run hundreds of unpredictable user programs, browsers, and background updates!",
      "Microcontrollers run dedicated, single-purpose firmware with 100% predictable execution paths! Any deviation from the fixed state machine is virtually guaranteed to be a bug or an exploit!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart connected electricity meter uses an ARM Cortex-M4. A hacker exploits a zero-day vulnerability in the meter's DLMS/COSEM communication stack and injects a ROP payload that executes `NVS_Write()` to alter the historical kilowatt-hour billing register. The meter's secure boot passed at startup, and network TLS was valid. How should an embedded HIDS have detected this unauthorized write at runtime?",
      "options": [
        "Electricity meters do not have kilowatt-hour registers.",
        "Context-Aware System Call Whitelisting: The meter's communication task should have permissions restricted strictly to network buffers and read APIs. Writing to the billing register should be authorized ONLY from the internal metrology task verified with an inter-task cryptographic token. When the communication task attempted to invoke `NVS_Write()`, the HIDS supervisor would detect an unauthorized syscall context and immediately block the write.",
        "Wait for the customer's electric bill to bounce.",
        "Reboot the meter every 30 seconds."
      ],
      "answerIdx": 1,
      "debrief": "Microcontroller firmware operates with well-defined separation of concerns: communications tasks handle network packets, while metrology tasks handle sensor registers. An embedded Host-Based Intrusion Detection System (HIDS) enforces context-aware API whitelisting: if a network task attempts to invoke flash erase, billing write, or hardware reconfiguration APIs that belong exclusively to control tasks, the HIDS traps the violation and halts the exploit."
    },
    "quests": [
      {
        "num": 1,
        "title": "Embedded HIDS Architecture, Syscall Whitelisting & Task Profiling",
        "type": "Concept",
        "description": "Analyze embedded behavioral modeling, task capability bitmasks, background DMA flash checksumming, and anomaly detection thresholds."
      },
      {
        "num": 2,
        "title": "DLMS/COSEM Zero-Day Exploit & Billing Tampering Detective",
        "type": "Detective Challenge",
        "description": "Investigate a utility smart grid fraud incident; demonstrate how lack of runtime syscall whitelisting allowed a network task to overwrite flash billing tables."
      },
      {
        "num": 3,
        "title": "Embedded Host Intrusion Detection (HIDS) Supervisor Engine",
        "type": "Mastery Assignment",
        "description": "Implement a lightweight HIDS engine in C / TypeScript with task capability matrices, syscall interception hooks, and isolated task quarantine logic."
      },
      {
        "num": 4,
        "title": "Simulated In-Memory Exploit & Autonomous Quarantine Lab",
        "type": "Production Incident Lab",
        "description": "Inject 50 unauthorized syscall calls and flash modification attempts across simulated RTOS tasks; verify 100% detection and zero false alarms."
      }
    ]
  },
  {
    "day": 49,
    "month": 2,
    "blockNum": 10,
    "title": "Network-Based Edge Anomaly Detection: Packet Arrival Intervals & Entropy Gating",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Edge Network Security (Statistical Traffic Profiling, Entropy Analysis & Rogue MAC Defense)",
    "spokenGoal": "What if an adversary connects a rogue computer to your industrial Ethernet switch or launches a distributed denial-of-service (DDoS) flood against your gateway? Today you engineer Network-Based Edge Anomaly Detection. Deconstruct lightweight statistical network monitoring viable on edge microcontrollers: 1) Packet Inter-Arrival Time (IAT) Analysis: an industrial sensor transmits telemetry at predictable intervals (e.g. exactly 100 ms +/- 5 ms). An attacker flooding packets or scanning the network creates a burst of low-IAT packets. By tracking the mean and variance of packet arrival intervals using Welford's algorithm, the gateway detects traffic anomalies in real time; 2) Shannon Entropy Gating: encrypted or compressed malware payloads exhibit high Shannon entropy (close to 8.0 bits/byte), while repetitive reconnaissance scans (like ARP sweeps or Modbus polling) exhibit low entropy. Significant shifts in traffic entropy flag unauthorized network activity; 3) Rogue MAC and ARP Spoofing Detection: binding IP addresses to authorized physical MAC addresses in an immutable hardware ARP table!",
    "conceptInvariant": "Statistical Traffic Invariant & Static ARP Binding Invariant: Industrial edge interfaces must maintain static IP-to-MAC hardware bindings to prevent ARP poisoning, and evaluate rolling packet inter-arrival statistics and entropy. Deviations exceeding 3 standard deviations (Z-score > 3.0) must trigger automatic ingress rate-limiting.",
    "failureMode": "Relying on dynamic ARP resolution in an industrial manufacturing plant; an attacker on the maintenance Wi-Fi launches ARP poisoning, redirects PLC traffic through a malicious laptop, and modifies assembly line motor speeds undetected.",
    "tryItFriction": "Build an Edge Network Anomaly Detector in TypeScript: simulate an industrial Ethernet interface receiving normal cyclic Modbus polling traffic (100 ms intervals, low entropy); inject an ARP spoofing attack and a high-rate denial-of-service packet flood; compute rolling Packet Inter-Arrival Time (IAT) variance and Shannon entropy; verify that the anomaly detector flags the attack in under 200 ms and applies an autonomous packet throttle.",
    "socraticHints": [
      "Why is dynamic ARP (Address Resolution Protocol) dangerous on industrial OT networks?",
      "Because standard dynamic ARP has zero authentication! Any computer can broadcast an unsolicited ARP reply claiming to be the gateway, and every device on the subnet will believe it!",
      "Industrial networks must use Static ARP Tables where IP-to-MAC mappings are locked and never updated dynamically from the wire!"
    ],
    "situationalPuzzle": {
      "scenario": "A manufacturing assembly plant uses industrial Ethernet to connect 20 robotic welders to a master PLC. A rogue laptop connected to an exposed maintenance Ethernet port broadcasts 10,000 gratuitous ARP packets claiming to be the master PLC (`192.168.1.1 is at 00:11:22:33:44:55`). All 20 robotic welders update their internal ARP caches, redirecting their telemetry to the attacker's laptop and losing connection to the genuine PLC, halting the production line. What fundamental network configuration was missing?",
      "options": [
        "The factory needed wireless Ethernet cables.",
        "Static ARP Binding & Dynamic ARP Inspection (DAI): Industrial field devices must NEVER use unverified dynamic ARP learning. Network switches must enforce Dynamic ARP Inspection (DAI), and edge devices must configure Static ARP Tables in firmware, locking the master PLC's MAC address permanently into the network driver. Unsolicited ARP updates are rejected unconditionally.",
        "Robots should not communicate over Ethernet.",
        "The laptop was too fast for the network."
      ],
      "answerIdx": 1,
      "debrief": "ARP spoofing / ARP cache poisoning is an ancient but devastating attack in flat industrial networks. Standard dynamic ARP updates memory mappings based on any broadcast packet seen on the wire. In critical infrastructure, dynamic ARP learning must be completely disabled in favor of Static ARP tables, combined with switch-level Dynamic ARP Inspection (DAI), ensuring that device identities cannot be hijacked on the local subnet."
    },
    "quests": [
      {
        "num": 1,
        "title": "Network Traffic Statistics, Packet Inter-Arrival Physics & Shannon Entropy",
        "type": "Concept",
        "description": "Analyze Welford's algorithm for rolling IAT variance, Shannon entropy calculation math, ARP cache mechanics, and denial-of-service thresholds."
      },
      {
        "num": 2,
        "title": "Gratuitous ARP Poisoning & Robotic Welding Halt Detective",
        "type": "Detective Challenge",
        "description": "Investigate an industrial factory outage; demonstrate step-by-step how rogue ARP broadcasts hijacked robotic communication and halted production."
      },
      {
        "num": 3,
        "title": "Edge Network Statistical Anomaly & Static ARP Engine",
        "type": "Mastery Assignment",
        "description": "Implement a network monitoring driver in C / TypeScript with rolling IAT Z-score tracking, Shannon entropy estimation, and static ARP enforcement."
      },
      {
        "num": 4,
        "title": "Automated Network Flood & ARP Poisoning Defense Lab",
        "type": "Production Incident Lab",
        "description": "Subject the edge network detector to 10,000 spoofed ARP packets and high-rate packet floods; verify 100% anomaly detection and zero service outage."
      }
    ]
  },
  {
    "day": 50,
    "month": 2,
    "blockNum": 10,
    "title": "Milestone Project 9: Embedded MPU Stack Guard & Host-Based Intrusion Detection (HIDS) Engine",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Milestone (Complete Runtime Defense & Edge Anomaly Detection)",
    "spokenGoal": "Congratulations on completing Block 10. Today you build Milestone Project 9: a production-grade Embedded MPU Stack Guard and Host-Based Intrusion Detection (HIDS) Engine! Your architecture provides complete runtime defense against zero-day exploits and network attacks: 1) An MPU Task Isolation Core with dynamic hardware TRNG stack canaries and unprivileged stack guard tripwire regions; 2) A Host-Based Intrusion Detection (HIDS) Supervisor that enforces context-aware system call whitelisting across RTOS tasks; 3) A Background Flash Integrity Monitor that continuously hashes executable memory sectors using low-priority DMA to detect physical or memory injection tampering; and 4) A Network-Based Anomaly Detector tracking Packet Inter-Arrival Time (IAT) statistics, Shannon entropy, and static ARP bindings! Put your milestone under full adversarial stress: simulate stack buffer overflows, inject unauthorized system calls, launch ARP poisoning, and trigger network packet floods!",
    "conceptInvariant": "Runtime Defense Coexistence & Fail-Secure Invariant: The embedded system must autonomously detect both internal memory corruption (stack canaries/MPU guards) and external network anomalies (IAT/entropy/ARP) in real time. Any violation must be trapped in under 1 millisecond, isolating the offending task without crashing critical life-safety control loops.",
    "failureMode": "Failing to handle an MPU MemManage Fault with graceful task quarantine; when an exploit hits the stack guard page, the default handler resets the entire microcontroller, shutting down an active chemical cooling system.",
    "tryItFriction": "Construct the Milestone 9 Runtime Defense Core in TypeScript / C: 1) Implement the MPU stack guard and dynamic canary allocator; 2) Implement the HIDS context-aware syscall filter; 3) Implement the background flash SHA-256 integrity scanner; 4) Implement the network IAT and static ARP monitor; 5) Pass all 25 automated runtime defense assertions.",
    "socraticHints": [
      "Why must an MPU MemManage handler attempt task quarantine before resorting to a full system reset?",
      "In industrial control systems (like chemical plants or avionics), a full reset kills physical actuators and safety loops!",
      "Quarantining the compromised task (e.g. killing the network thread while keeping the motor control loop running) allows the physical process to remain safe!"
    ],
    "situationalPuzzle": {
      "scenario": "During validation of Milestone Project 9 on an autonomous mining drill, a penetration testing team injects a buffer overflow into the drill's remote telemetry thread. The MPU stack guard page catches the overflow and triggers a MemManage Fault. Instead of crashing the entire drill (which would drop a 5-ton drill bit), the Milestone 9 handler isolates the telemetry task, asserts emergency drill hold, flashes a warning LED, and logs the exploit. What architectural principle made this possible?",
      "options": [
        "The mining drill was too heavy to crash.",
        "Graceful Degradation via Architectural Fault Compartmentalization: The MPU fault handler was programmed to inspect the Fault Status Register (CFSR/MMFSR), identify the specific offending task ID, safely suspend the compromised thread, and notify the RTOS supervisor, maintaining hard-real-time safety on the mechanical actuator threads while neutralizing the exploit.",
        "FreeRTOS automatically fixes all buffer overflows.",
        "The drill ran out of diesel fuel."
      ],
      "answerIdx": 1,
      "debrief": "In critical industrial systems, an unhandled exception or hard reset is often just as catastrophic as a successful cyber attack. Graceful degradation requires that the MPU fault handler be intelligent: it inspects hardware fault registers (like ARM Cortex-M Configurable Fault Status Register CFSR), pinpoints the faulting task, cleanly terminates or quarantines only the compromised thread, and allows mission-critical safety threads to continue running."
    },
    "quests": [
      {
        "num": 1,
        "title": "MPU Fault Architecture, CFSR Registers & Task Quarantine Specification",
        "type": "Concept",
        "description": "Analyze ARM Cortex-M fault status registers (CFSR, MMFSR, BFSR), MemManage exception handlers, task quarantine mechanics, and graceful degradation."
      },
      {
        "num": 2,
        "title": "Mining Drill Telemetry Exploit & Autonomous Safety Hold Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial robotics incident report; demonstrate how MPU task compartmentalization prevented a full drill shutdown during an attack."
      },
      {
        "num": 3,
        "title": "Milestone 9: Complete MPU Guard & Embedded HIDS Engine",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 9 core: MPU stack guards + TRNG canaries + HIDS syscall filter + network IAT monitor."
      },
      {
        "num": 4,
        "title": "Multi-Vector Runtime Exploit & Penetration Defense Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Milestone 9 engine to simultaneous ROP injection, unauthorized syscalls, and ARP flood attacks; verify 100% containment and 0 plant downtime."
      }
    ]
  },
  {
    "day": 51,
    "month": 2,
    "blockNum": 11,
    "title": "Industrial Cybersecurity Standards: IEC 62443-4-1 / 62443-4-2 Security Levels SL1 to SL4",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Global Industrial Compliance (IEC 62443 Security Levels, Zones & Conduits)",
    "spokenGoal": "We enter Block 11: Compliance, Regulatory Standards, and Secure Decommissioning. In enterprise and industrial IoT, you cannot sell a product to GE, Siemens, or Shell by saying 'trust me, my code is secure'. Enterprise buyers demand formal certification against international standards: IEC 62443! Today you master IEC 62443-4-1 (Secure Product Development Lifecycle) and IEC 62443-4-2 (Technical Security Requirements for IACS Components). Deconstruct the four Security Levels (SL1 to SL4): SL1 (Protection against casual or coincidental unauthorized access); SL2 (Protection against intentional violation using simple means with low resources); SL3 (Protection against intentional violation using sophisticated means with moderate resources); SL4 (Protection against state-sponsored advanced persistent threats [APTs] with high resources). Deconstruct Security Zones and Conduits: partitioning industrial assets into logical zones based on risk, and enforcing strict cryptographic conduits between them!",
    "conceptInvariant": "IEC 62443 Component Security Requirement (CR) Traceability Invariant: An industrial embedded device must implement and document verifiable technical controls satisfying IEC 62443-4-2 Component Requirements for target Security Level SL3: Identification & Authentication (CR 1), Use Control (CR 2), Data Integrity (CR 3), Data Confidentiality (CR 4), and Resource Availability (CR 7).",
    "failureMode": "Failing to document an IEC 62443-4-1 secure development lifecycle; an industrial turbine manufacturer is disqualified from bidding on a $120M government power generation contract because their firmware repository lacks automated vulnerability scanning and security gates.",
    "tryItFriction": "Build an IEC 62443-4-2 Compliance Audit and Security Level Evaluator in TypeScript: define 15 Component Requirements (CR 1.1 Human User Identification, CR 1.2 Software Process Identification, CR 2.1 Authorization Enforcement, CR 3.1 Cryptographic Integrity, CR 4.1 Information Confidentiality, CR 7.1 Denial of Service Protection); evaluate an IoT device profile; compute achieved Security Level (SL1-SL4); identify compliance gaps and generate automated engineering remediation roadmaps.",
    "socraticHints": [
      "What is the difference between Security Level Target (SL-T) and Security Level Achieved (SL-A)?",
      "SL-T is the desired security level determined during the initial risk assessment (e.g. SL3 for a chemical valve)!",
      "SL-A is the actual verified security level achieved by the device's technical controls after rigorous third-party laboratory testing!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart industrial robot vendor aims for IEC 62443-4-2 Security Level 3 (SL3) certification for an automotive assembly arm. The robot features AES-256 encrypted communications, secure boot, and role-based access control. However, the certification lab fails the product under Component Requirement CR 1.3 (Account Management) because the robot uses a single shared factory service password that cannot be individually revoked when service technicians leave the company. What technical control was missing?",
      "options": [
        "The robot needed faster servo motors.",
        "Individual Cryptographic Identity & Revocable Credential Management: IEC 62443 SL3 strictly forbids shared global accounts. The component must support unique, individual user identities (via enterprise PKI certificates, individual usernames with MFA, or centralized LDAP/RADIUS authentication) where individual credentials can be rotated, audited, and revoked without affecting other users.",
        "Robots should not have accounts.",
        "IEC 62443 does not apply to robots."
      ],
      "answerIdx": 1,
      "debrief": "Shared service credentials (such as a universal 'admin/admin123' account used by field technicians) are explicitly forbidden under IEC 62443-4-2 Security Levels SL2 and above. Component Requirement CR 1.3 mandates that all accounts must be unique to individual human operators or specific software processes, with verifiable audit trails and centralized revocation capabilities, preventing ex-employees from retaining permanent backdoor access."
    },
    "quests": [
      {
        "num": 1,
        "title": "IEC 62443-4-1 / 62443-4-2 Specifications & Security Levels SL1-SL4",
        "type": "Concept",
        "description": "Analyze IEC 62443 standard architecture, Security Zones and Conduits, Component Requirements (CR 1-7), and SL1 to SL4 capability matrices."
      },
      {
        "num": 2,
        "title": "Shared Service Password & $120M Contract Disqualification Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial compliance audit failure; prove how shared root accounts violated IEC 62443 CR 1.3 and disqualified a commercial product."
      },
      {
        "num": 3,
        "title": "IEC 62443-4-2 Security Level Assessment Engine",
        "type": "Mastery Assignment",
        "description": "Implement an automated IEC 62443-4-2 compliance auditing tool in TypeScript that scores device capabilities against CR requirements and outputs gap matrices."
      },
      {
        "num": 4,
        "title": "Enterprise Security Zone & Conduit Mapping Lab",
        "type": "Production Incident Lab",
        "description": "Map a complex chemical refinery network topology into IEC 62443 Security Zones and Conduits; design cryptographic conduit firewall rules for SL3 compliance."
      }
    ]
  },
  {
    "day": 52,
    "month": 2,
    "blockNum": 11,
    "title": "Medical & Automotive Standards: FDA Premarket Cybersecurity & ISO/SAE 21434",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Domain-Specific Regulations (FDA Premarket Guidance, ISO/SAE 21434 & UNECE WP.29)",
    "spokenGoal": "In safety-critical industries\u2014where a hacked device doesn't just lose data, it kills people\u2014cybersecurity is legally mandated by federal and international law! Today you master the two most rigorous domain-specific security standards on earth: 1) FDA Premarket Cybersecurity Guidelines (Section 524B of the FD&C Act) for medical devices; and 2) ISO/SAE 21434 (Road Vehicles - Cybersecurity Engineering) and UNECE WP.29 R155/R156 for connected automobiles. Deconstruct the FDA Medical Device mandate: mandatory Software Bill of Materials (SBOM), hardware-anchored secure boot, post-market vulnerability management plans, and coordinated vulnerability disclosure (CVD). Deconstruct Automotive ISO/SAE 21434: Threat Analysis and Risk Assessment (TARA), Cybersecurity Assurance Levels (CAL 1 to CAL 4), and Cybersecurity Management Systems (CSMS). Under UNECE R155, an automaker CANNOT legally sell a vehicle in 54 countries without certified cybersecurity engineering!",
    "conceptInvariant": "Life-Critical Regulatory Traceability Invariant: Medical and automotive embedded architectures must maintain end-to-end cryptographic traceability from Threat Analysis and Risk Assessment (TARA) through Hardware Security Assurance to automated post-market vulnerability tracking, satisfying FDA 524B and ISO/SAE 21434 mandates.",
    "failureMode": "Shipping a connected vehicle without ISO/SAE 21434 certification; international automotive regulators deny vehicle type approval, forcing a factory halt that costs the automaker $350M in lost revenue.",
    "tryItFriction": "Build an Automotive TARA and Medical Cybersecurity Evaluator in TypeScript: implement an ISO/SAE 21434 Threat Analysis and Risk Assessment (TARA) calculator evaluating Attack Feasibility (Elapsed Time, Specialist Expertise, Knowledge of Item, Window of Opportunity, Equipment) and Impact (Safety, Financial, Operational, Privacy); compute Cybersecurity Assurance Levels (CAL 1-4); generate an automated FDA/ISO compliance certificate.",
    "socraticHints": [
      "Why did the FDA transition from 'recommendations' to legally binding 'mandates' for medical device cybersecurity in 2023?",
      "Because hospitals were being paralyzed by ransomware exploiting connected medical devices, directly endangering patient lives!",
      "Congress enacted Section 524B, giving the FDA legal authority to reject any medical device filing that lacks an SBOM or hardware security!"
    ],
    "situationalPuzzle": {
      "scenario": "A tier-1 automotive supplier designs a connected telematics gateway for a commercial electric truck. The engineering team conducts a TARA (Threat Analysis and Risk Assessment) under ISO/SAE 21434. The threat scenario: an attacker remotely compromises the cellular modem and injects acceleration commands into the powertrain CAN bus. The team evaluates the Safety Impact as 'Severe' (potential fatalities). What Cybersecurity Assurance Level (CAL) is assigned, and what hardware architecture is mandatory?",
      "options": [
        "CAL 0, requiring no security.",
        "CAL 4 (Highest Level), Requiring Hardware Security Module (HSM) & ASIL-D Separation: Severe safety impact mandates CAL 4 under ISO/SAE 21434. The telematics processor must be physically separated from the vehicle control bus by a hardware gateway with dedicated crypto accelerators, secure boot, and ISO 26262 ASIL-D functional safety interlocks.",
        "CAL 1, requiring only a software password.",
        "Trucks do not require cybersecurity certification."
      ],
      "answerIdx": 1,
      "debrief": "Under ISO/SAE 21434, threat scenarios that carry severe potential safety consequences (injury or loss of life) automatically mandate the highest Cybersecurity Assurance Level (CAL 4). At CAL 4, informal or software-only protections are unacceptable. Systems must utilize certified Hardware Security Modules (HSMs), formal TARA methodologies, independent third-party penetration audits, and strict cryptographic isolation between infotainment/telematics and vehicle control buses."
    },
    "quests": [
      {
        "num": 1,
        "title": "FDA 524B Cybersecurity Mandates & ISO/SAE 21434 TARA Methodology",
        "type": "Concept",
        "description": "Analyze FDA premarket submission guidelines, ISO/SAE 21434 TARA attack feasibility math, UNECE WP.29 R155/R156, and CAL 1-4 definitions."
      },
      {
        "num": 2,
        "title": "Jeep Cherokee Remote Telematics CAN Hack Forensics Detective",
        "type": "Detective Challenge",
        "description": "Reconstruct the historic 2015 Jeep Cherokee remote hack; demonstrate how telematics cellular vulnerabilities bridged into powertrain CAN buses."
      },
      {
        "num": 3,
        "title": "Automotive TARA & Medical Device Regulatory Engine",
        "type": "Mastery Assignment",
        "description": "Implement a full TARA risk assessment and regulatory compliance evaluation engine in TypeScript conforming to ISO/SAE 21434 and FDA 524B."
      },
      {
        "num": 4,
        "title": "Vehicle Gateway Penetration & ASIL Safety Interlock Lab",
        "type": "Production Incident Lab",
        "description": "Simulate attempting remote CAN bus command injection from a compromised telematics radio; verify 100% containment by the hardware gateway."
      }
    ]
  },
  {
    "day": 53,
    "month": 2,
    "blockNum": 11,
    "title": "Software Bill of Materials (SBOM) for Embedded Firmware: CycloneDX & SPDX",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Supply Chain Cybersecurity (SBOM Standards, CycloneDX, SPDX & Automated CVE Auditing)",
    "spokenGoal": "Every modern firmware binary is assembled from dozens of third-party libraries: FreeRTOS, LwIP, mbedTLS, cJSON, LittleFS, and silicon vendor HAL drivers. If a critical zero-day vulnerability (like Log4j, Ripple20, or Heartbleed) is discovered in an open-source C library, how do you know which of your 500,000 deployed devices contain that vulnerable code? If you don't know what is inside your binaries, you are blind! Enter the Software Bill of Materials (SBOM). Deconstruct international SBOM standards: CycloneDX and SPDX (Software Package Data Exchange - ISO/IEC 5230). An SBOM is a machine-readable cryptographic manifest listing every component, version, license, author, and SHA-256 hash in your build! Learn how to integrate automated SBOM generation into embedded CI/CD pipelines: parsing compiler dependency outputs (`-MD`), extracting third-party C library git commits, and scanning against the National Vulnerability Database (NVD) to catch CVEs BEFORE shipping!",
    "conceptInvariant": "Cryptographic SBOM Provenance Invariant: Every production firmware release must generate a signed Software Bill of Materials (CycloneDX / SPDX JSON) cryptographically bound to the binary image SHA-256 digest, providing complete, verifiable component provenance across all third-party libraries and HAL dependencies.",
    "failureMode": "Shipping firmware containing an unversioned copy-pasted open-source DNS resolver; a critical CVE (Ripple20) is announced, but the company cannot determine which products use the library, taking 6 months to locate vulnerable code while devices are exploited in the wild.",
    "tryItFriction": "Build an Automated Embedded SBOM Generator and CVE Auditor in TypeScript: parse a C firmware project directory; detect 5 third-party dependencies (FreeRTOS v10.4.3, mbedTLS v2.28.0, LwIP v2.1.2, cJSON v1.7.14, LittleFS v2.4.0); generate a valid CycloneDX v1.5 JSON manifest; cross-reference components against a simulated CVE database; verify that an outdated library trips an automated CI/CD build failure alert.",
    "socraticHints": [
      "Why is US Executive Order 14028 making SBOMs legally mandatory for all software and firmware sold to governments?",
      "Because supply-chain attacks (like SolarWinds) proved that hackers target third-party open-source dependencies rather than attacking companies directly!",
      "An SBOM provides instant visibility: when a new CVE drops, an enterprise can search their SBOM database in 2 seconds to identify every affected device!"
    ],
    "situationalPuzzle": {
      "scenario": "A cybersecurity researcher publicly discloses 'Amnesia:33', a collection of 33 critical memory corruption vulnerabilities affecting open-source TCP/IP stacks. A hospital network security officer contacts a medical device vendor asking if their patient monitors are vulnerable to Amnesia:33. The vendor's engineering team takes 8 weeks to answer because the original firmware developers left the company and third-party C source files were copy-pasted into the repository without version tags. What engineering practice would have provided an instant answer?",
      "options": [
        "Hiring the original developers back as consultants.",
        "CI/CD Integrated Machine-Readable SBOM Generation (CycloneDX/SPDX): If the vendor maintained an automated CycloneDX SBOM generated on every build and archived with release binaries, the hospital or vendor could query the SBOM in 3 seconds to verify the exact TCP/IP stack name and version, identifying vulnerable devices instantly and deploying targeted patches in hours.",
        "Replacing all hospital monitors with paper charts.",
        "Deleting the TCP/IP stack."
      ],
      "answerIdx": 1,
      "debrief": "Copy-pasting third-party open-source code into embedded repositories without provenance tracking is a severe technical debt and security hazard. When major vulnerabilities (like Amnesia:33 or Ripple20) are discovered in shared libraries, companies without an SBOM waste months manually reading code to find out if they are affected. Automated SBOM generation (via CycloneDX or SPDX) provides instant, machine-readable vulnerability tracking."
    },
    "quests": [
      {
        "num": 1,
        "title": "CycloneDX vs SPDX Standards, Component Metadata & NVD CVE Mapping",
        "type": "Concept",
        "description": "Analyze CycloneDX v1.5 JSON schema, SPDX ISO/IEC 5230, Common Platform Enumeration (CPE), and automated CVE matching algorithms."
      },
      {
        "num": 2,
        "title": "Amnesia:33 TCP/IP Stack Forensics & Supply Chain Blindspot Detective",
        "type": "Detective Challenge",
        "description": "Investigate a medical device supply-chain failure; demonstrate how unversioned third-party C code blinded an engineering team for 8 weeks."
      },
      {
        "num": 3,
        "title": "Automated Embedded Firmware SBOM Generator Engine",
        "type": "Mastery Assignment",
        "description": "Construct an automated firmware SBOM generator in TypeScript that parses C project trees, generates CycloneDX JSON, and flags vulnerable CVEs."
      },
      {
        "num": 4,
        "title": "Supply Chain Vulnerability Scanning & CI/CD Gate Lab",
        "type": "Production Incident Lab",
        "description": "Integrate the SBOM generator into an emulated CI/CD pipeline; inject an outdated, vulnerable mbedTLS library; verify automated build rejection."
      }
    ]
  },
  {
    "day": 54,
    "month": 2,
    "blockNum": 11,
    "title": "Secure Device Decommissioning & Cryptographic Erasure: NIST SP 800-88 Sanitization",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "End-of-Life Security (NIST SP 800-88 Sanitization, Crypto-Shredding & eFuse Retirement)",
    "spokenGoal": "Every hardware device eventually reaches End-of-Life (EOL): smart electric meters are replaced, medical devices are upgraded, and fleet vehicles are sold at auction. But what happens to the sensitive data sitting on those discarded devices? Corporate Wi-Fi passwords, private customer encryption keys, patient telemetry, and cloud API tokens remain sitting on internal flash chips! If a decommissioned device is sold on eBay, an attacker can extract every corporate secret! Welcome to Secure Device Decommissioning and Cryptographic Erasure. Deconstruct NIST SP 800-88 (Guidelines for Media Sanitization): 1) Clear (logical sanitization in user-accessible storage); 2) Purge (physical block erasure rendering recovery impossible with laboratory tools); 3) Destroy (physical destruction). Master Cryptographic Eradication (Crypto-Shredding): securely deleting the 256-bit master storage key renders all gigabytes of encrypted flash instantly and irrevocably undecryptable forever! Master Permanent Hardware Retirement: burning the final eFuse lifecycle state to `TERMINATED`, permanently disabling bootloaders and debug interfaces!",
    "conceptInvariant": "Irreversible Decommissioning & Cryptographic Sanitization Invariant: End-of-Life device retirement must execute NIST SP 800-88 Purge-level cryptographic erasure (crypto-shredding master storage keys) and permanently burn the hardware lifecycle eFuse to TERMINATED state, guaranteeing that zero historical data or credentials can be recovered.",
    "failureMode": "Executing a standard 'Factory Reset' that merely resets a software flag without scrubbing encrypted flash or blowing retirement eFuses; an attacker buys the discarded unit at auction, dumps the flash, and recovers 5 years of industrial plant telemetry.",
    "tryItFriction": "Build an Automated NIST SP 800-88 Device Sanitization and Retirement Engine in TypeScript: implement a factory reset state machine; execute Crypto-Shredding (overwriting master keys with volatile compiler-barrier zeroization); execute multi-pass flash block sanitization (0x00, 0xFF, Random); burn the simulated hardware `LIFECYCLE_TERMINATED` eFuse; generate a cryptographically signed Certificate of Sanitization; verify that post-retirement boot attempts are permanently halted.",
    "socraticHints": [
      "Why is 'Crypto-Shredding' vastly faster and more reliable than erasing every individual block of a 32 GB flash memory chip?",
      "Erasing 32 GB of flash takes tens of minutes, wears out flash cells, and can leave residual data in wear-leveling spare blocks!",
      "Crypto-shredding destroys the single 32-byte encryption key in 50 nanoseconds\u2014without that key, all 32 GB of data becomes mathematically unbreakable white noise!"
    ],
    "situationalPuzzle": {
      "scenario": "A major logistics company decommissions 2,000 barcode scanning edge tablets and sells them to an electronics recycler. A security researcher purchases 10 tablets from the recycler for $20 each. Although the tablets displayed 'Factory Reset Complete' on their screens, the researcher clips onto the eMMC flash chips and recovers plaintext corporate Wi-Fi enterprise WPA2-Enterprise credentials, allowing the researcher to drive to a warehouse and connect directly to the corporate intranet. What failed during the factory reset?",
      "options": [
        "The tablets should have been melted in an oven.",
        "Superficial Software Reset without Media Sanitization: The 'Factory Reset' only formatted the user partition table, leaving raw data blocks intact on the flash silicon. Legitimate decommissioning must follow NIST SP 800-88 Purge guidelines: executing full-disk cryptographic key erasure (crypto-shredding) and overwriting all non-volatile memory sectors, ensuring no residual data survives physical chip reading.",
        "Electronics recyclers are not allowed to sell tablets.",
        "WPA2 passwords cannot be extracted from flash."
      ],
      "answerIdx": 1,
      "debrief": "A standard consumer-grade 'Factory Reset' is notoriously superficial: it simply clears file system pointers or marks sectors as available, leaving the actual raw data bytes sitting in flash memory until overwritten. In enterprise and industrial hardware, decommissioning must enforce NIST SP 800-88 Purge standards: crypto-shredding the master encryption key, executing multi-pass flash scrubbing, and permanently locking the device's hardware lifecycle state."
    },
    "quests": [
      {
        "num": 1,
        "title": "NIST SP 800-88 Guidelines, Crypto-Shredding & eFuse Lifecycle States",
        "type": "Concept",
        "description": "Analyze NIST SP 800-88 Clear vs Purge vs Destroy sanitization, crypto-shredding key destruction mathematics, and silicon lifecycle state transitions."
      },
      {
        "num": 2,
        "title": "Recycled Tablet Wi-Fi Key Extraction & Intranet Breach Detective",
        "type": "Detective Challenge",
        "description": "Analyze a commercial logistics enterprise breach; demonstrate how superficial factory resets on decommissioned hardware leaked corporate intranet credentials."
      },
      {
        "num": 3,
        "title": "NIST SP 800-88 Sanitization & Crypto-Shredding Engine",
        "type": "Mastery Assignment",
        "description": "Implement an embedded device decommissioning controller in C / TypeScript with master key crypto-shredding, flash purging, and signed sanitization certificates."
      },
      {
        "num": 4,
        "title": "Post-Decommissioning Flash Forensics & Zero-Data Lab",
        "type": "Production Incident Lab",
        "description": "Perform forensic raw memory dumps on 20 sanitized devices; prove that 100% of cryptographic keys and configuration sectors contain zero recoverable data."
      }
    ]
  },
  {
    "day": 55,
    "month": 2,
    "blockNum": 11,
    "title": "Milestone Project 10: Automated Firmware SBOM Generator & NIST SP 800-88 Cryptographic Sanitization Engine",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Milestone (Complete Supply Chain & End-of-Life Security Synthesis)",
    "spokenGoal": "Congratulations on completing Block 11. Today you engineer Milestone Project 10: a production-grade Automated Firmware SBOM Generator and NIST SP 800-88 Cryptographic Sanitization Engine! Your architecture spans the two opposite ends of the device lifecycle: 1) An Automated Supply Chain Scanner that audits firmware source trees, generates machine-readable CycloneDX v1.5 JSON manifests, and flags vulnerable open-source CVEs during build time; 2) An IEC 62443 / ISO 21434 Compliance Verification Engine that scores technical security requirements; and 3) An End-of-Life Media Sanitization Controller conforming to NIST SP 800-88 Purge standards, executing instantaneous crypto-shredding, multi-pass flash purging, eFuse hardware lifecycle termination, and generating cryptographically signed Certificates of Sanitization! Put your milestone under full lifecycle validation: audit a complex firmware build, flag simulated CVEs, and trigger an automated end-of-life crypto-shred event!",
    "conceptInvariant": "End-to-End Supply Chain to Decommissioning Invariant: The embedded product lifecycle must maintain cryptographic accountability from build-time component provenance (CycloneDX SBOM) through regulatory compliance certification to irreversible end-of-life media sanitization (NIST SP 800-88 crypto-shredding).",
    "failureMode": "Failing to zeroize the hardware Secure Element during device decommissioning; while the main MCU flash is wiped, the companion ATECC608B secure element retains its private keys, allowing an attacker to re-authenticate as an authorized corporate device.",
    "tryItFriction": "Construct the Milestone 10 Lifecycle Security Core in TypeScript / C: 1) Implement the CycloneDX v1.5 SBOM generator and CVE scanner; 2) Implement the IEC 62443 compliance evaluator; 3) Implement the NIST SP 800-88 crypto-shredding sanitization engine; 4) Generate an Ed25519-signed Certificate of Sanitization; 5) Pass all 25 automated supply-chain and end-of-life security assertions.",
    "socraticHints": [
      "Why must the Certificate of Sanitization be signed using the device's own private key BEFORE that key is shredded?",
      "Because the signed certificate proves mathematically to the enterprise asset database that the specific physical hardware device completed sanitization!",
      "The device generates the signed attestation, transmits it to the server, and immediately executes crypto-shredding to destroy all keys!"
    ],
    "situationalPuzzle": {
      "scenario": "A medical device hospital fleet of 500 patient monitors reaches End-of-Life. The IT department uses Milestone Project 10 to execute automated decommissioning. On unit #412, a technician accidentally trips the power cord while the multi-pass flash sanitize routine is 40% complete. When the technician powers the device back on, the bootloader halts with 'SECURITY HALT: LIFECYCLE STATE TERMINATED'. Flash dump inspection reveals that the master AES key was destroyed in step 1 before flash erasing began. Why is the remaining unsanitized flash data completely harmless?",
      "options": [
        "Patient data automatically expires after 30 days.",
        "Crypto-Shredding Precedence Principle: Milestone 10 executed Crypto-Shredding (erasing the master AES-256 storage key) as the very first atomic operation before starting the slow sector wipe. Without the master key, the remaining 60% of flash memory is mathematically indistinguishable from random noise, ensuring zero data leakage even if power is lost midway through the physical erase.",
        "The power cord severed the flash chip connection.",
        "Medical devices cannot store data."
      ],
      "answerIdx": 1,
      "debrief": "The Crypto-Shredding Precedence Principle dictates that key destruction must ALWAYS occur before physical bulk data erasure. Physical flash sector erasing can take minutes and can be interrupted by power loss. Erasing the 256-bit cryptographic master key takes less than 1 millisecond. By destroying the key first, all persistent data is instantly rendered permanently undecryptable, guaranteeing that even an interrupted sanitization leaves zero recoverable data."
    },
    "quests": [
      {
        "num": 1,
        "title": "Complete Lifecycle Architecture & NIST SP 800-88 Specification",
        "type": "Concept",
        "description": "Architect the complete enterprise specification uniting build-time CycloneDX SBOM generation, compliance scoring, and NIST SP 800-88 crypto-shredding."
      },
      {
        "num": 2,
        "title": "Interrupted Decommissioning Flash Forensics & Key Precedence Detective",
        "type": "Detective Challenge",
        "description": "Analyze an interrupted hospital device retirement report; demonstrate how crypto-shredding precedence prevented patient data leaks."
      },
      {
        "num": 3,
        "title": "Milestone 10: Complete SBOM & Cryptographic Sanitization Engine",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 10 engine: CycloneDX generator + CVE matcher + crypto-shredding + signed sanitization cert."
      },
      {
        "num": 4,
        "title": "Enterprise Fleet Decommissioning & Forensics Lab",
        "type": "Production Incident Lab",
        "description": "Simulate decommissioning 100 enterprise edge gateways; verify 100% generation of valid sanitization certificates and zero plaintext key recovery."
      }
    ]
  },
  {
    "day": 56,
    "month": 2,
    "blockNum": 12,
    "title": "Critical Infrastructure Case Study 1: Smart Electric Grid Substation RTU Cyber Defense",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone Case Study (Power Grid SCADA, IEC 60870-5-104 & Industroyer Defense)",
    "spokenGoal": "We enter Block 12: Real-World Critical Infrastructure Case Studies. Today you architect the cyber defense of a high-voltage electrical power grid: a Smart Grid Substation Remote Terminal Unit (RTU) under attack by state-sponsored malware! Deconstruct Industroyer (CrashOverride): the sophisticated cyber weapon designed to shut down electrical power grids by directly manipulating industrial telecontrol protocols: IEC 60870-5-104, IEC 61850 (GOOSE messaging), and DNP3. Industroyer sends legitimate, protocol-compliant commands to open transmission circuit breakers, causing cascading power outages and physical transformer explosions! Deconstruct the defense architecture: 1) Cryptographic Protocol Hardening via IEC 62351-03/05 (mTLS encapsulation for IEC 104 with 4-byte APDU sequence numbers and digital signatures); 2) Substation Deep Packet Inspection (DPI) with Frequency Analysis: blocking rapid breaker toggling that causes mechanical resonance; 3) Hardware Root of Trust and Synchrophasor (PMU) Plausibility Cross-Gating!",
    "conceptInvariant": "Substation Physical Safety Interlock & Cryptographic Telecontrol Invariant: Electrical grid breaker trip commands received over IEC 60870-5-104 / DNP3 must possess valid IEC 62351 cryptographic authentication and pass independent hardware synchrophasor electrical plausibility verification before activating physical output relays.",
    "failureMode": "Accepting unauthenticated IEC 60870-5-104 commands over plaintext TCP port 2404; malware sends a burst of 'OPEN_BREAKER' APDUs, opening all transmission substation lines and blacking out 500,000 residents.",
    "tryItFriction": "Build an IEC 60870-5-104 Substation Defense and Industroyer Detection Engine in TypeScript: implement an IEC 104 APDU parser (Type 45 Single Command); implement an IEC 62351-03 mTLS authentication validator; implement an anti-breaker-chattering rate limiter (blocking >2 trip commands per 10 seconds); simulate an Industroyer rapid-fire trip attack; verify that the defense engine drops the rogue commands and keeps the substation grid online.",
    "socraticHints": [
      "Why did Industroyer use legitimate protocol commands instead of exploiting traditional software vulnerabilities?",
      "Because industrial protocols like IEC 104 had no authentication built-in!",
      "The malware didn't need to 'hack' the RTU\u2014it simply spoke the native language of the electrical grid, and the unprotected RTUs obeyed!"
    ],
    "situationalPuzzle": {
      "scenario": "A national transmission grid operator deploys RTUs at an electrical substation. The network uses IEC 60870-5-104. Attackers gain access to the substation Ethernet switch and inject IEC 104 command packets instructing the RTU to open the main 500 kV transformer breaker. The grid is operating under peak summer load. If the breaker opens, the sudden loss of load will trigger frequency oscillations across the entire regional grid. How does the hardened RTU prevent this catastrophic trip?",
      "options": [
        "The RTU operator calls the police.",
        "Dual-Channel Synchrophasor Plausibility Verification: The hardened RTU firmware does NOT execute high-voltage breaker trip commands based solely on a network message! It cross-references the network command with real-time local analog physics (measuring electrical voltage, current, and phase angle from independent Rogowski coils). If the local electrical measurements indicate normal, stable operating conditions, the trip command is recognized as an unverified anomalous command, held in quarantine, and escalated to human operators.",
        "Transformers never explode.",
        "Disable Ethernet communication permanently."
      ],
      "answerIdx": 1,
      "debrief": "The ultimate defense for cyber-physical critical infrastructure is Physical Plausibility Validation. A cyber attacker can forge or inject network commands, but they cannot fake local electrical physics. An intelligent RTU does not blindly obey a trip command received over the wire; it verifies whether local electrical parameters (overcurrent, phase mismatch, frequency deviation) actually warrant a breaker trip. If physics and commands disagree, the command is blocked."
    },
    "quests": [
      {
        "num": 1,
        "title": "IEC 60870-5-104 Protocol Framing, Industroyer Physics & IEC 62351 Defense",
        "type": "Concept",
        "description": "Analyze IEC 104 APDU/ASDU structures, Industroyer malware mechanics, IEC 62351-03/05 cryptographic profiles, and synchrophasor PMU validation."
      },
      {
        "num": 2,
        "title": "Industroyer Power Grid Attack Forensics Detective",
        "type": "Detective Challenge",
        "description": "Deconstruct the 2016 Kiev electrical grid cyber attack; demonstrate how unauthenticated IEC 104 commands disconnected 200 MW of power transmission."
      },
      {
        "num": 3,
        "title": "Substation RTU IEC 62351 Defense & Rate-Limiter Engine",
        "type": "Mastery Assignment",
        "description": "Implement a hardened IEC 60870-5-104 firewall in C / TypeScript with IEC 62351 mTLS verification, breaker rate-limiting, and physical plausibility gating."
      },
      {
        "num": 4,
        "title": "State-Sponsored Substation Sabotage Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Subject the hardened RTU to 10,000 simulated Industroyer APDU packet bursts; verify 100% rejection of unauthenticated trips and continuous grid operation."
      }
    ]
  },
  {
    "day": 57,
    "month": 2,
    "blockNum": 12,
    "title": "Critical Infrastructure Case Study 2: Water Treatment Plant Chemical Dosing Protection",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone Case Study (Water SCADA, Chemical Dosing & Triton/Trisis Malware Defense)",
    "spokenGoal": "In 2021, a cyber attacker remotely accessed a municipal water treatment plant in Oldsmar, Florida, and attempted to increase the concentration of sodium hydroxide (lye) in the drinking water by 100-fold\u2014from 100 ppm to 11,100 ppm! Sodium hydroxide is a corrosive chemical used in drain cleaners; in high concentrations, it severely burns human tissue and causes organ failure! Today you architect the cyber defense of a municipal water treatment plant. Deconstruct Triton/Trisis malware: the first malware in history designed specifically to disable Safety Instrumented Systems (SIS) and industrial emergency safety controllers (Schneider Electric Triconex)! Deconstruct the Water SCADA Defense Architecture: 1) Physical Hardwired Safety Interlocks: chemical dosing pump drives must have analog mechanical limiters that physically prevent feeding more than 120 ppm regardless of digital PLC commands; 2) Independent Shadow Safety PLCs: an air-gapped microcontroller measuring chemical pH and flow rates independently; 3) Multi-Person Authorization (Two-Man Rule) for setpoint modifications!",
    "conceptInvariant": "Physical Safety Ceiling & Analog Interlock Invariant: Critical chemical dosing and physical hazard setpoints must be constrained by unbypassable hardware/analog limiters. Digital control commands that exceed safe human health thresholds must be hardware-clamped and trigger immediate failsafe isolation.",
    "failureMode": "Relying purely on software PLC setpoint limits for chemical dosing; an attacker modifies the setpoint variable in PLC memory, pumping toxic concentrations of chemicals into the municipal drinking water supply.",
    "tryItFriction": "Build a Water Treatment Chemical Dosing Safety Supervisor in TypeScript: model a municipal water reservoir with sodium hydroxide dosing pumps; implement a digital setpoint controller; implement an independent Analog Hardware Interlock and pH Sensor Cross-Check; simulate an attacker setting lye dosing to 11,100 ppm; verify that the hardware interlock clamps pump output to 110 ppm, asserts an emergency shutdown, and triggers sirens.",
    "socraticHints": [
      "Why must physical analog or hardwired limiters be used in addition to digital PLC software code?",
      "Because software can always be compromised, rewritten, or glitched by an advanced attacker!",
      "An analog electronic resistor circuit or mechanical physical valve limiter cannot be hacked by an internet packet!"
    ],
    "situationalPuzzle": {
      "scenario": "A cyber attacker breaches the TeamViewer remote access account of a municipal water treatment plant operator. The attacker opens the SCADA interface, clicks on the chlorine gas dosing control, and changes the feed rate from 2.0 mg/L to 200.0 mg/L (a lethal dose). What defense-in-depth architectural control prevents chlorine gas from poisoning the municipal water supply?",
      "options": [
        "The water operator should have typed the password faster.",
        "Hardwired Physical Orifice Flow Limiters & Air-Gapped Safety Interlocks: The chemical dosing pipe must include a physical mechanical flow orifice plate that physically restricts maximum chemical flow to 4.0 mg/L under maximum pump pressure! Even if the software PLC commands 200 mg/L, the laws of fluid dynamics physically prevent lethal delivery. Additionally, an independent shadow safety monitor cuts pump power if pH deviates outside safe limits.",
        "Chlorine is safe to drink in any concentration.",
        "Water plants do not use chemicals."
      ],
      "answerIdx": 1,
      "debrief": "In industrial safety engineering, Safety Instrumented Systems (SIS) and physical containment operate on the principle that software must never be the sole barrier preventing physical catastrophe. High-hazard processes (like chemical dosing or explosive pressures) must incorporate physical analog limits (orifice plates, pressure relief burst disks, mechanical limit switches) that guarantee safety by the immutable laws of physics, completely independent of digital software state."
    },
    "quests": [
      {
        "num": 1,
        "title": "Water Treatment SCADA Architecture, Triton/Trisis Physics & Safety SIS",
        "type": "Concept",
        "description": "Analyze municipal water SCADA networks, Triton malware mechanics targeting Safety Instrumented Systems, and physical hardware interlocks."
      },
      {
        "num": 2,
        "title": "Oldsmar Florida Water Plant Sodium Hydroxide Attack Detective",
        "type": "Detective Challenge",
        "description": "Reconstruct the 2021 Oldsmar municipal water attack; analyze the remote access vectors and prove how physical interlocks prevent poisoning."
      },
      {
        "num": 3,
        "title": "Chemical Dosing Safety Supervisor & Shadow PLC Engine",
        "type": "Mastery Assignment",
        "description": "Implement a water treatment safety controller in C / TypeScript with independent pH sensor cross-checking, setpoint clamping, and hardwired interlock logic."
      },
      {
        "num": 4,
        "title": "Lethal Chemical Dosing Override Attack Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Simulate pushing lethal 100x chemical dosing commands to virtual water pumps; verify 100% mechanical clamping and instantaneous emergency shutdown."
      }
    ]
  },
  {
    "day": 58,
    "month": 2,
    "blockNum": 12,
    "title": "Critical Infrastructure Case Study 3: Connected Medical Infusion Pump Hardening",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone Case Study (Life-Critical Medical Devices, Dose Error Reduction & HIPAA/FDA)",
    "spokenGoal": "Connected smart infusion pumps deliver intravenous life-saving medications (insulin, heparin, morphine) directly into patient bloodstreams in hospital intensive care units (ICUs). If an infusion pump is hacked, an attacker can silently deliver a lethal dose of medication, causing fatal cardiac arrest in minutes! Today you architect the end-to-end cybersecurity of an FDA-regulated Connected Smart Infusion Pump. Deconstruct historical medical pump vulnerabilities: plaintext Wi-Fi communications, unauthenticated telnet maintenance consoles, hardcoded vendor credentials, and lack of Dose Error Reduction Systems (DERS). Deconstruct the Hardened Medical Architecture: 1) Hardware Root of Trust and Dual-MCU Architecture: the Medical Core (pumping actuator and dose checking) runs on an isolated micro-core with zero network connectivity; the Network Core (Wi-Fi/BLE) handles telemetry; 2) Optical Isolation Barrier: communication between cores uses an optically isolated serial UART with a strict, formal, non-executable command syntax; 3) Cryptographic Dose Drug Library (DDL): drug limits signed by hospital pharmacists with Ed25519; 4) Physical Free-Fall & Occlusion Sensors!",
    "conceptInvariant": "Dual-Core Medical Isolation & Signed Dose Library Invariant: The physical medication delivery motor must be controlled exclusively by an isolated, non-networked Medical Core. All medication dose limits must be verified against an onboard Drug Library cryptographically signed by authorized clinical pharmacists, rendering remote overdose commands physically impossible.",
    "failureMode": "Running the wireless network stack and the infusion motor driver on the same microcontroller core; an attacker exploits a heap overflow in the Wi-Fi driver and directly modifies the motor PWM speed register, delivering a lethal overdose of morphine.",
    "tryItFriction": "Build an FDA-Compliant Dual-Core Infusion Pump Simulator in TypeScript: model the Network Core (handling Wi-Fi telemetry) and the isolated Medical Core (controlling motor delivery); implement the optically isolated UART protocol with strict JSON command validation; load a pharmacist-signed Drug Library (Morphine max dose: 5 mg/hr); simulate an attacker hacking the Network Core and sending a command: `SET_DOSE = 50 mg/hr`; verify that the Medical Core rejects the overdose command, activates a local audible alarm, and reverts to safe maintenance rate.",
    "socraticHints": [
      "Why must the motor actuator run on a completely separate processor from the Wi-Fi chip?",
      "Because network stacks (Wi-Fi, Bluetooth, TCP/IP) have millions of lines of complex code and frequent CVEs!",
      "An isolated medical core has less than 5,000 lines of simple, formally verified code, ensuring network exploits CANNOT touch physical motor hardware!"
    ],
    "situationalPuzzle": {
      "scenario": "A hospital ICU installs 200 connected smart infusion pumps. An attacker on the hospital guest Wi-Fi exploits a known vulnerability in the pump's network processor and gains root shell access. The attacker attempts to command all 200 pumps to deliver a 10x overdose of potassium chloride. However, every pump displays 'ERROR: COMMAND EXCEEDS HARD DRUG LIMIT' on its physical LCD, sounds a local 85 dB piezo buzzer, and continues delivering the normal baseline dose. What architectural isolation protected the patients?",
      "options": [
        "Potassium chloride is harmless.",
        "Dual-Core Medical Isolation & Independent Pharmacist-Signed Dose Limits: The pump's physical motor is controlled by an isolated Medical Core that does NOT obey arbitrary network commands! The Medical Core evaluates every incoming rate request against an immutable Dose Error Reduction System (DERS) hard-limit table stored in secure ROM and signed by hospital pharmacy directors. Because 10x exceeds the hard maximum, the motor processor physically refuses execution.",
        "The hospital guest Wi-Fi was too slow.",
        "Infusion pumps do not use electricity."
      ],
      "answerIdx": 1,
      "debrief": "Life-critical medical devices must implement the Dual-Core Architectural Pattern: complete physical separation between the high-attack-surface communication subsystem and the safety-critical actuator subsystem. The actuator core evaluates every command against clinical hard limits (Dose Error Reduction Systems - DERS). Even if an attacker achieves complete arbitrary code execution on the network processor, the actuator core acts as an unyielding medical guardrail, physically refusing dangerous parameters."
    },
    "quests": [
      {
        "num": 1,
        "title": "Medical Infusion Pump Architecture, DERS Safety & Dual-Core Isolation",
        "type": "Concept",
        "description": "Analyze medical device dual-core architectures, optical isolation UARTs, Dose Error Reduction System (DERS) specifications, and FDA 524B compliance."
      },
      {
        "num": 2,
        "title": "Hospital Wi-Fi Infusion Pump Overdose Forensics Detective",
        "type": "Detective Challenge",
        "description": "Investigate a high-profile hospital cybersecurity vulnerability; demonstrate how unified single-chip architectures allowed network bugs to manipulate motors."
      },
      {
        "num": 3,
        "title": "Dual-Core Medical Pump Controller & DERS Safety Engine",
        "type": "Mastery Assignment",
        "description": "Implement a dual-core medical controller in C / TypeScript with isolated motor control, pharmacist-signed DDL verification, and hard dose clamping."
      },
      {
        "num": 4,
        "title": "Remote Medical Overdose Attack & Containment Lab",
        "type": "Production Incident Lab",
        "description": "Simulate compromising the network core and issuing 1,000 lethal dose commands; verify 100% rejection by the medical core and 0 patient harm."
      }
    ]
  },
  {
    "day": 59,
    "month": 2,
    "blockNum": 12,
    "title": "Principal IoT Security Architect RFC & Defense-in-Depth Blueprint: Enterprise Synthesis",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Enterprise Architectural Synthesis (Formal RFC, Multi-Tier Defense & Regulatory Certifications)",
    "spokenGoal": "You have reached the summit of Industrial IoT Security engineering. Today, you do not write isolated code; you author the comprehensive Architectural Request for Comments (RFC) that establishes the global IoT security platform for a Fortune 500 industrial enterprise! Synthesize the entire 60-day physical and digital continuum: Silicon Hardware Root of Trust (SRAM PUFs, eFuses, TrustZone-M); Cryptographic Chains of Trust (Immutable Mask ROM, Ed25519 manifests, anti-rollback monotonic counters); Physical Defenses (XIP flash encryption, JTAG silicon lockdown, Boolean DPA masking, glitch-hardened logic); Identity & Provisioning (IEEE 802.1AR IDevID, factory HSM injection, FDO late-binding, TLS 1.3 mTLS over ALPN); Lifecycle Maintenance (IETF SUIT RFC 9019 FOTA, A/B flash partitioning, task-gated watchdogs); Operational Fieldbuses (IEC 62351 Modbus, AUTOSAR SecOC CAN-FD, Purdue IDMZ diodes); Wireless Security (BLE LESC, Thread JPAKE, LoRaWAN 1.1, RF jamming telemetry); and Runtime Protection (MPU guards, HIDS syscall whitelisting, CycloneDX SBOM, NIST SP 800-88 crypto-shredding). Defend your architecture before the Enterprise Review Board!",
    "conceptInvariant": "Principal Systems Architectural Cohesion Invariant: An enterprise IoT security RFC must provide mathematically sound, verifiable architectural specifications uniting silicon physics, cryptographic protocols, operational fieldbus boundaries, and full lifecycle governance into a cohesive defense-in-depth platform conforming to IEC 62443 SL3/SL4, FIPS 140-3 Level 3, and NIST SP 800-193.",
    "failureMode": "Authoring a security specification that focuses exclusively on software cryptography while ignoring physical hardware attack surfaces (JTAG, bus sniffing, side-channels), resulting in catastrophic hardware cloning upon first commercial release.",
    "tryItFriction": "Author the complete Architectural RFC Specification in Markdown / TypeScript: establish the technical requirements for an enterprise fleet of 1,000,000 industrial gateways; document the multi-layer defense matrix from silicon to cloud; define compliance roadmaps for IEC 62443 SL3 and ISO/SAE 21434; detail 10-year total cost of ownership (TCO) and failsafe disaster recovery protocols.",
    "socraticHints": [
      "What is the single most critical quality of a Principal Security Architect?",
      "Thinking like an attacker while designing like an engineer!",
      "A Principal Architect assumes every layer WILL be attacked, and ensures that the compromise of any single component is contained before it can breach adjacent systems!"
    ],
    "situationalPuzzle": {
      "scenario": "A Fortune 500 energy conglomerate's CTO reviews two competing IoT security platform proposals for a $200M nationwide smart pipeline monitoring system. Proposal A relies on commercial off-the-shelf Linux single-board computers with software OpenSSL and cloud passwords ($18M upfront cost, 18-month build time). Proposal B uses custom ARM Cortex-M33 microcontrollers with hardware Secure Elements, TrustZone-M, IEEE 802.1AR IDevIDs, and IETF SUIT A/B secure FOTA ($24M upfront cost, 24-month build time). Which proposal must the Principal Architect champion, and why?",
      "options": [
        "Proposal A because it is cheaper and faster to market.",
        "Proposal B (Hardware-Anchored Zero-Trust Architecture): Proposal A is an existential liability: Linux SBCs running unauthenticated software lack hardware roots of trust, are vulnerable to physical flash bus sniffing, and cannot survive remote zero-day exploit waves, risking multi-billion-dollar pipeline shutdowns. Proposal B provides immutable silicon security, cryptographic anti-tamper, and 100% autonomous failsafe recovery, ensuring compliance with federal critical infrastructure mandates and protecting corporate longevity.",
        "Neither; use manual pressure gauges read by humans in pickup trucks.",
        "Pipeline monitoring does not require security."
      ],
      "answerIdx": 1,
      "debrief": "In critical infrastructure, initial software development cost is a fraction of total lifecycle risk. A cheap, software-only IoT platform on exposed physical hardware is an invitation for catastrophic compromise, ransomware, and physical environmental disaster. A hardware-anchored, zero-trust embedded architecture (Proposal B) provides provable silicon security, automated zero-brick FOTA updates, and compliance with federal critical infrastructure mandates, delivering a vastly lower total cost of ownership and true long-term security."
    },
    "quests": [
      {
        "num": 1,
        "title": "Enterprise IoT Security RFC Taxonomy & Multi-Tier Architecture",
        "type": "Concept",
        "description": "Analyze enterprise defense-in-depth layering, FIPS 140-3 Level 3 vs Level 4 trade-offs, IEC 62443 SL3 compliance roadmaps, and 10-year TCO modeling."
      },
      {
        "num": 2,
        "title": "Software-Only IoT Platform Disaster & Corporate Liability Detective",
        "type": "Detective Challenge",
        "description": "Investigate a canceled $80M industrial pipeline IoT deployment; prove how reliance on software-only cryptography led to mass device cloning."
      },
      {
        "num": 3,
        "title": "Principal IoT Security Architecture RFC Specification Document",
        "type": "Mastery Assignment",
        "description": "Author an enterprise-grade Architectural RFC for an industrial IoT security platform, complete with hardware RoT selection, protocol maps, and compliance."
      },
      {
        "num": 4,
        "title": "Executive Architecture Review Board Defense Lab",
        "type": "Production Incident Lab",
        "description": "Defend your RFC before a simulated executive Architecture Review Board; answer grueling technical challenges regarding hardware cost, security, and recovery."
      }
    ]
  },
  {
    "day": 60,
    "month": 2,
    "blockNum": 12,
    "title": "Master Capstone: ApexShield Sovereign Industrial IoT Security & Fleet Lifecycle Platform Viva Gate",
    "stageName": "Stage 4: Edge Runtime Security & Lifecycle",
    "stageNum": 4,
    "pedagogicalRole": "Grand Master Capstone & Rigorous Technical Defense (Mastery of All 60 Days)",
    "spokenGoal": "Welcome to Day 60: the summit of Course 19: Industrial IoT Security & Device Lifecycle! Over the past 60 days, you have progressed from physical threat modeling and SRAM PUF key derivation to eFuses, constant-time cryptography, immutable Mask ROM secure boot, Ed25519 manifests, anti-rollback monotonic counters, ARM TrustZone-M, XIP flash encryption, JTAG lockdown, Boolean DPA masking, fault injection resilience, IEEE 802.1AR device identity, zero-heap X.509 parsing, TLS 1.3 mTLS over ALPN, factory HSM provisioning, FDO late-binding, IETF SUIT A/B FOTA, task-gated watchdogs, IEC 62351 Modbus, AUTOSAR SecOC CAN-FD, Purdue IDMZ diodes, BLE LESC, Thread JPAKE, LoRaWAN 1.1, RF jamming telemetry, MPU guards, HIDS syscall whitelisting, CycloneDX SBOM, and NIST SP 800-88 crypto-shredding! Today, you defend the Grand Master Capstone: ApexShield\u2014the sovereign industrial IoT security and fleet lifecycle platform! Your firmware runs on an ARM Cortex-M33 with Secure Element and hardware crypto acceleration, defending an industrial energy grid against simultaneous physical, protocol, and network attacks. Face the Senior Systems & Evaluator Panel across 4 rigorous Viva defense stations!",
    "conceptInvariant": "Master Sovereign Security Architecture Invariant: The ApexShield platform unifies physical silicon entropy (PUF/eFuse), immutable staged verification (Secure Boot), hardware domain isolation (TrustZone-M), physical side-channel defenses (DPA masking/glitch hardening), cryptographic identity (IEEE 802.1AR/TLS 1.3 mTLS), zero-brick lifecycle maintenance (IETF SUIT FOTA), industrial bus protection (SecOC/Purdue), wireless resilience (JPAKE/Jamming), and runtime intrusion detection (HIDS/MPU guards) into a unified, zero-compromise embedded security firmware core.",
    "failureMode": "Failing the Senior Evaluator Viva Gate by being unable to mathematically defend the relationship between SRAM PUF bit-error rates, constant-time modular arithmetic, MPU stack guard tripwires, and autonomous A/B watchdog rollback under simultaneous multi-vector adversarial attack.",
    "tryItFriction": "Execute the ApexShield Master Capstone Firmware Simulation in TypeScript / C: 1) Execute cold-boot memory scrub and PUF master key derivation; 2) Enforce TrustZone-M SAU partitions and NSC veneers; 3) Verify Ed25519 firmware manifest and eFuse monotonic counters; 4) Negotiate TLS 1.3 mTLS cloud telemetry over port 443 ALPN; 5) Ingest and verify an IETF SUIT FOTA update package in Slot B with task-gated watchdog; 6) Filter legacy Modbus and SecOC CAN-FD frames; 7) Detect simulated RF jamming and isolate an MPU stack canary breach; 8) Execute NIST SP 800-88 crypto-shredding on simulated decommissioning; 9) Pass all 35 automated architectural validation assertions.",
    "socraticHints": [
      "What is the ultimate mark of a Master of Industrial IoT Security?",
      "Amateurs believe security is a feature you add at the end of a project (like adding an encryption library)!",
      "Masters know that security is a pervasive architectural discipline spanning the entire lifecycle: from the physical silicon atoms and foundry eFuses to firmware verification, runtime isolation, and final cryptographic erasure!"
    ],
    "situationalPuzzle": {
      "scenario": "During the final live Master Capstone Viva Defense, the Senior Technical Review Board launches the ultimate multi-stage cyber-physical invasion: 1) An attacker taps the external QSPI flash bus to sniff code; 2) Injects a 20ns voltage glitch during the bootloader signature check; 3) Sends a malformed Modbus coil override over the network; 4) Launches high-power 2.4 GHz RF jamming; and 5) Transmits an unauthorized firmware update with a forged manifest. How does the ApexShield platform maintain total physical and digital integrity?",
      "options": [
        "The node crashes, reboots, and catches fire.",
        "Multi-Tier Autonomous Defense-in-Depth Execution: 1) The on-the-fly AES-CTR XIP engine ensures the external bus carries only high-entropy ciphertext; 2) The redundant step-check tokens and inverted state logic catch the voltage glitch and force a safe-state halt; 3) The DPI firewall drops the Modbus write at the ingress port; 4) The RF jamming detector flags the 2.4 GHz noise spike and fails over to Sub-GHz/RS-485; 5) The SUIT manifest engine verifies the bad signature and drops the update without touching flash. The industrial plant operates with zero interruption.",
        "The system shuts down all plant power forever.",
        "The gateway calls customer support."
      ],
      "answerIdx": 1,
      "debrief": "This is the ultimate triumph of defense-in-depth engineering. No single attack vector can succeed because every layer of the architecture independently enforces its own cryptographic and physical invariant. External buses are encrypted; boot transitions are double-checked against hardware tokens; fieldbus commands are filtered by DPI; wireless jamming triggers wired failover; and firmware updates are cryptographically authenticated before write. The plant continues to operate safely, autonomously, and reliably."
    },
    "quests": [
      {
        "num": 1,
        "title": "ApexShield Master Architecture & Sovereign Security Blueprint",
        "type": "Concept",
        "description": "Document the complete mathematical and firmware architectural specification uniting silicon RoT, TrustZone-M, SUIT FOTA, SecOC, and HIDS."
      },
      {
        "num": 2,
        "title": "Multi-Vector Cyber-Physical Invasion Stress Forensics Detective",
        "type": "Detective Challenge",
        "description": "Analyze the system's response under simultaneous bus sniffing, voltage glitching, Modbus injection, RF jamming, and forged FOTA; prove total containment."
      },
      {
        "num": 3,
        "title": "ApexShield End-to-End Sovereign Security Firmware Platform",
        "type": "Mastery Assignment",
        "description": "Implement and validate the complete C / TypeScript master capstone firmware: staged boot + RoT + TrustZone + SUIT FOTA + SecOC + HIDS + crypto-shredding."
      },
      {
        "num": 4,
        "title": "Senior Architecture Review Board Viva Voce Defense Gate",
        "type": "Production Incident Lab",
        "description": "Complete the rigorous oral and practical defense before the Senior Systems Panel; achieve a 100% pass mark across all 60 days of curriculum competencies."
      }
    ]
  }
];
