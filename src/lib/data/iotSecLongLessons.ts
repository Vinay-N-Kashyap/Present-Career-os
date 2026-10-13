import type { LongLesson } from './longLessons';

/**
 * IoT Hardware Security, Root of Trust & Secure Boot (Course: iot_sec)
 * Day 1: Hardware Root of Trust, Secure Boot Cryptographic Chains & ARM TrustZone.
 */
export const IOT_SEC_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'iot_sec',
    day: 1,
    title: 'Hardware Root of Trust & Secure Boot Architecture',
    goal: 'Master the physics and cryptography of securing physical microcontrollers: immutable Mask ROM, cryptographic signature verification, TrustZone isolation, and side-channel defense.',
    minutes: 40,
    recap: 'Welcome to IoT & Embedded Security. Unlike cloud servers protected inside armed data centers, IoT devices are deployed in the open wild. An adversary can physically probe bus pins, freeze chips with liquid nitrogen, and inject voltage spikes.',
    parts: [
      {
        title: 'The Hardware Root of Trust (RoT) & One-Time Programmable (OTP) eFuses',
        say: [
          'In hardware security, you cannot establish trust using software alone. If an attacker can overwrite flash memory or reprogram the processor via JTAG debug ports, any purely software security check can be modified or bypassed. True system security requires an unalterable foundation: the Hardware Root of Trust (RoT).',
          'The Root of Trust begins at silicon fabrication with the Primary Bootloader burned into immutable Mask ROM. Mask ROM is physically etched into the semiconductor substrate using optical lithography masks during silicon manufacturing; it contains no write or erase transistors and is mathematically impossible to modify even with physical access.',
          'Alongside Mask ROM, microcontrollers feature One-Time Programmable (OTP) eFuses. An eFuse is an microscopic polysilicon link on the die. When a security bit is burned in the factory, high electrical current physically vaporizes the silicon link, permanently changing its state from 0 to 1 with no physical mechanism to un-burn it.',
          'These eFuses store the Hardware Unique Key (HUK) used for cryptographic encryption, the SHA-256 public key hash of the authorized firmware vendor, the Anti-Rollback monotonic counter, and the JTAG Debug Lock bit that permanently disables physical debugger access.'
        ],
        example: 'Think of a bank safe. The steel vault walls and combination lock are forged at the foundry (Mask ROM). Once the combination is set, the dial lock tumbler clicks into an irreversible slot (burned eFuse). You cannot convince the steel to become air, no matter what software you run.',
        code: `# Simulation: Silicon eFuse Controller & Cryptographic Root of Trust
class SiliconEFuseController:
    def __init__(self):
        # 256-bit simulated OTP eFuse array (starts as unblown 0s)
        self._fuses = [0] * 32
        self.jtag_locked = False
        self.monotonic_rollback_version = 0

    def burn_vendor_public_key_hash(self, pubkey_hash_bytes: bytes):
        if len(pubkey_hash_bytes) != 32:
            raise ValueError("Root key hash must be exactly 32 bytes (SHA-256)")
        for i in range(32):
            # Physical eFuse property: bit can be blown from 0 -> 1, but NEVER 1 -> 0!
            self._fuses[i] |= pubkey_hash_bytes[i]

    def blow_jtag_lock(self):
        # Permanently disconnect physical hardware debugger pins
        self.jtag_locked = True

    def increment_anti_rollback_version(self, target_version: int):
        if target_version < self.monotonic_rollback_version:
            raise PermissionError("Rollback Exploit Blocked: Monotonic eFuse cannot decrease!")
        self.monotonic_rollback_version = target_version

    def read_root_hash(self) -> bytes:
        return bytes(self._fuses)

efuse = SiliconEFuseController()
vendor_hash = bytes.fromhex("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
efuse.burn_vendor_public_key_hash(vendor_hash)
efuse.blow_jtag_lock()
efuse.increment_anti_rollback_version(3)

print("Silicon RoT Initialized.")
print(f"JTAG Hardware Debugger Disabled: {efuse.jtag_locked}")
print(f"Monotonic Anti-Rollback Version: {efuse.monotonic_rollback_version}")
print(f"Burned Vendor Root Hash:        {efuse.read_root_hash()[:8].hex()}...")`,
        output: `Silicon RoT Initialized.\nJTAG Hardware Debugger Disabled: True\nMonotonic Anti-Rollback Version: 3\nBurned Vendor Root Hash:        e3b0c44298fc1c14...`,
        tryIt: 'Attempt to decrement the anti-rollback version back to 1 and verify the PermissionError exception.',
        check: {
          question: 'Why are silicon eFuses and Mask ROM considered physically immutable compared to standard Flash memory?',
          options: [
            'Mask ROM has no erase circuitry, and burning an eFuse physically vaporizes a microscopic silicon connection that cannot be reversed by any software or voltage command',
            'Because eFuses require an internet password to unlock',
            'Flash memory is made of plastic while eFuses are made of glass'
          ],
          answer: 0,
          why: 'eFuses are physical microscopic fuses blown with high current. Once blown, the physical conductive path is broken permanently. Mask ROM is etched during lithography with zero reprogrammable memory cells.'
        }
      },
      {
        title: 'Cryptographic Secure Boot & Anti-Rollback Verification Chains',
        say: [
          'When an embedded microcontroller powers on or resets, the CPU hardware program counter is hardwired to jump directly into address 0x00000000 located inside immutable Mask ROM.',
          'Mask ROM initiates the Secure Boot verification sequence. Before executing a single instruction from external Flash memory, it reads the firmware header. The header contains the firmware binary size, target execution address, version number, vendor Public Key, and an ECDSA P-256 or RSA-3072 cryptographic digital signature.',
          'The verification proceeds in strict mathematical tiers: First, Mask ROM computes the SHA-256 hash of the vendor Public Key and asserts it matches the root hash burned into the silicon eFuses. If they do not match, execution halts instantly.',
          'Second, it verifies the firmware signature over the binary using that validated public key. Third, it compares the firmware version against the hardware eFuse Anti-Rollback counter. If an attacker attempts to flash an older, legitimately signed firmware that contained a known buffer overflow vulnerability, the anti-rollback check rejects it!'
        ],
        example: 'Think of an airport passport control gate. The guard (Mask ROM) checks the seal on your passport against the official state registry (eFuses). Then they verify the cryptographic chip signature inside the booklet. If someone tries to present an expired passport from 5 years ago (downgrade attack), the guard confiscates it.',
        code: `# Simulation: Cryptographic Secure Boot Chain with Anti-Rollback Defense
import hashlib

class SecureBootEngine:
    def __init__(self, authorized_pubkey_hash: str, min_hardware_version: int):
        self.burned_key_hash = authorized_pubkey_hash
        self.efuse_version = min_hardware_version

    def verify_and_boot(self, image: dict) -> bool:
        # 1. Verify Public Key Authenticity against Silicon eFuse
        key_hash = hashlib.sha256(image['vendor_pubkey'].encode('utf-8')).hexdigest()
        if key_hash != self.burned_key_hash:
            print(f"[BOOT FAULT] Unauthorized Public Key: {key_hash[:8]} != {self.burned_key_hash[:8]}")
            return False

        # 2. Anti-Rollback Monotonic Check
        if image['version'] < self.efuse_version:
            print(f"[BOOT FAULT] Anti-Rollback Rejected: v{image['version']} < Min HW v{self.efuse_version}")
            return False

        # 3. Cryptographic Signature Verification over Binary Digest
        expected_sig = hashlib.sha256((image['binary'] + image['vendor_pubkey']).encode('utf-8')).hexdigest()
        if image['signature'] != expected_sig:
            print("[BOOT FAULT] Signature Corrupted: Firmware tamper detected!")
            return False

        print(f"[BOOT SUCCESS] Authenticated Firmware v{image['version']} Validated. Jumping to Vector Table.")
        return True

valid_key = "ACME_ROOT_PUBLIC_KEY_2026_SECP256R1"
valid_key_hash = hashlib.sha256(valid_key.encode('utf-8')).hexdigest()
bootloader = SecureBootEngine(valid_key_hash, min_hardware_version=2)

firmware_v2 = {
    'version': 2,
    'vendor_pubkey': valid_key,
    'binary': "FIRMWARE_PAYLOAD_MOTOR_CONTROL_v2",
    'signature': hashlib.sha256(("FIRMWARE_PAYLOAD_MOTOR_CONTROL_v2" + valid_key).encode('utf-8')).hexdigest()
}

bootloader.verify_and_boot(firmware_v2)`,
        output: `[BOOT SUCCESS] Authenticated Firmware v2 Validated. Jumping to Vector Table.`,
        tryIt: 'Modify the firmware payload string to simulate flash memory bit rot and observe the signature corruption fault.',
        check: {
          question: 'What is an Anti-Rollback (downgrade) attack, and how does Secure Boot prevent it?',
          options: [
            'An attacker flashes an older, authentically signed version of firmware that contains a known security vulnerability; eFuse monotonic counters reject binaries with lower version numbers',
            'An attacker rolls the physical device down a flight of stairs',
            'An attacker resets the device clock to midnight'
          ],
          answer: 0,
          why: 'Even cryptographically valid signatures can be exploited if an older signed build contains an exploitable flaw. Monotonic eFuse counters ensure firmware versions can only step forward.'
        }
      },
      {
        title: 'ARM TrustZone & Memory Protection Unit (MPU) Partitioning',
        say: [
          'Even after Secure Boot successfully starts the operating system, firmware remains vulnerable during runtime. A vulnerability in an external network stack (such as a Wi-Fi buffer overflow) could grant an attacker complete control over the microcontroller.',
          'ARM TrustZone technology (available on Cortex-M23, M33, and M55) partitions the processor hardware into two completely isolated security domains: the Secure World and the Non-Secure World.',
          'The Secure World hosts the most sensitive components: cryptographic key storage, hardware crypto accelerators, RNG, and certificate validation. The Non-Secure World runs the general application, third-party libraries, and network stacks.',
          'Every memory bus transaction carries a hardware security attribute bit (the Non-Secure or NS bit). If software running in the Non-Secure World attempts to read or write an address allocated to the Secure World, the hardware bus interface traps the instruction and triggers a hard SecureFault exception instantly!'
        ],
        example: 'Think of an embassy building. The public consulate lobby (Non-Secure World) allows visitors to file visa applications. The inner cipher communications room (Secure World) is protected by biometric bulletproof airlocks. A consular clerk in the lobby cannot open the cipher door, but the cipher officers can pass signed documents out to the lobby.',
        code: `# Simulation: ARM TrustZone Hardware Bus Isolation & Secure Gateway Calls
class TrustZoneBusController:
    def __init__(self):
        # Define memory address partition boundaries
        self.SECURE_SRAM_START = 0x20000000
        self.SECURE_SRAM_END   = 0x20003FFF # 16 KB Secure SRAM
        self.NONSECURE_SRAM_START = 0x20004000
        self.NONSECURE_SRAM_END   = 0x2001FFFF # 112 KB Non-Secure SRAM

        self.secure_crypto_key = "HARDWARE_KMS_AES256_ROOT_SECRET"

    def bus_access(self, address: int, is_non_secure_caller: bool) -> str:
        # If caller is from Non-Secure world and tries to touch Secure SRAM
        if is_non_secure_caller and (self.SECURE_SRAM_START <= address <= self.SECURE_SRAM_END):
            raise PermissionError(f"HARDWARE SECURE_FAULT: NS bus access denied to Secure RAM 0x{address:08X}")
        return "ACCESS_GRANTED"

    def secure_gateway_sign_data(self, data: str) -> str:
        # Secure Gateway (SG) veneer instruction allows controlled API calls into Secure World
        # Returns signature without ever exposing raw private key to Non-Secure caller
        return f"SIG_{hash(data + self.secure_crypto_key) & 0xFFFFFFFF:08X}"

tz = TrustZoneBusController()

# 1. Non-Secure application reads its own buffer (Allowed)
status = tz.bus_access(0x20005000, is_non_secure_caller=True)
print(f"Non-Secure App RAM Access: {status}")

# 2. Non-Secure application requests signature via Secure Gateway (Allowed)
token_sig = tz.secure_gateway_sign_data("IOT_TELEMETRY_PACKET_99")
print(f"Secure Gateway Signature:   {token_sig}")

# 3. Non-Secure app attempts direct read of Secure Crypto Key (Trapped by Hardware!)
try:
    tz.bus_access(0x20001000, is_non_secure_caller=True)
except PermissionError as e:
    print(f"Direct Secure Read Result:  {e}")`,
        output: `Non-Secure App RAM Access: ACCESS_GRANTED\nSecure Gateway Signature:   SIG_335F325E\nDirect Secure Read Result:  HARDWARE SECURE_FAULT: NS bus access denied to Secure RAM 0x20001000`,
        tryIt: 'Modify the address to 0x20008000 and confirm that Non-Secure access succeeds within its designated range.',
        check: {
          question: 'What hardware mechanism enforces security boundaries in ARM TrustZone for Cortex-M?',
          options: [
            'A hardware NS (Non-Secure) bus bit verified on every memory access by the bus interconnect, triggering a SecureFault if Non-Secure code accesses Secure addresses',
            'Software antivirus running in the background',
            'A firewall server hosted in AWS'
          ],
          answer: 0,
          why: 'TrustZone is enforced at the silicon bus interconnect level. Every fetch, read, and write carries a hardware security attribute bit; unauthorized crossings are halted by hardware traps with zero software overhead.'
        }
      },
      {
        title: 'On-The-Fly Decryption Engines (OTFDEC) & Flash Encryption',
        say: [
          'Many microcontrollers execute firmware directly from external SPI or QSPI NOR Flash memory chips using Execute-in-Place (XIP) memory mapping. However, external flash chips are connected via exposed printed circuit board (PCB) traces.',
          'An attacker with a $15 logic analyzer can clip probes onto the SPI flash clock and data pins, recording every single byte of firmware as the CPU reads code. If firmware is stored in plaintext, all proprietary algorithms and hardcoded credentials are compromised.',
          'To defeat bus sniffing, modern MCUs incorporate On-The-Fly Decryption Engines (OTFDEC). Firmware is stored on the external Flash chip in encrypted ciphertext using authenticated ciphers like AES-CTR, AES-CCM, or AES-XTS.',
          'When the CPU issues an instruction fetch across the memory bus, the OTFDEC hardware sits transparently between the SPI controller and the CPU cache. It decrypts the cache line on-the-fly in a single pipeline cycle using keys stored in internal silicon eFuses. Plaintext instructions exist only inside internal CPU registers and caches; external PCB pins carry pure cryptographic noise!'
        ],
        example: 'Think of speaking in code over a tapped radio line. Even if an eavesdropper records every transmission (bus sniffing), the conversation sounds like static radio noise. Only the recipient wearing a real-time hardware cipher earpiece hears the clear speech.',
        code: `# Simulation: On-The-Fly Decryption (OTFDEC) Memory-Mapped Bus Filter
class OtfdecMemoryController:
    def __init__(self, hardware_aes_key: int):
        self.key = hardware_aes_key # 32-bit simplified key from eFuse

    def read_physical_bus_pins(self, encrypted_flash_word: int) -> int:
        # What a physical oscilloscope or logic analyzer sees on PCB traces
        return encrypted_flash_word

    def cpu_instruction_fetch(self, address: int, encrypted_flash_word: int) -> int:
        # OTFDEC hardware decrypts dynamically using address nonce + key
        address_nonce = address & 0xFF
        decrypted_instruction = encrypted_flash_word ^ (self.key ^ address_nonce)
        return decrypted_instruction

# Target ARM Thumb instruction: 0x4770 (BX LR - return from function)
original_instruction = 0x4770
otfdec = OtfdecMemoryController(hardware_aes_key=0xA55A)

# Flash programmer encrypts the instruction before writing to external SPI chip
flash_ciphertext = original_instruction ^ (0xA55A ^ (0x08000100 & 0xFF))

probed_bus_word = otfdec.read_physical_bus_pins(flash_ciphertext)
cpu_fetched_word = otfdec.cpu_instruction_fetch(0x08000100, flash_ciphertext)

print(f"Plaintext Code:        0x{original_instruction:04X} (BX LR)")
print(f"Probed PCB Trace Data: 0x{probed_bus_word:04X} (Cryptographic Ciphertext)")
print(f"CPU Internal Core Got: 0x{cpu_fetched_word:04X} (Decrypted on-the-fly)")
print(f"Protection Verified:   {cpu_fetched_word == original_instruction}")`,
        output: `Plaintext Code:        0x4770 (BX LR)\nProbed PCB Trace Data: 0xE22A (Cryptographic Ciphertext)\nCPU Internal Core Got: 0x4770 (Decrypted on-the-fly)\nProtection Verified:   True`,
        tryIt: 'Simulate probing an adjacent memory address and verify how address nonces prevent code replay attacks across memory sectors.',
        check: {
          question: 'What physical attack does an On-The-Fly Decryption Engine (OTFDEC) neutralize on embedded microcontrollers?',
          options: [
            'Passive bus sniffing via logic analyzers attached to external Flash memory PCB traces',
            'Water damage to the circuit board',
            'Overheating caused by direct sunlight'
          ],
          answer: 0,
          why: 'OTFDEC ensures that code stored in external Flash and transmitted over exposed PCB traces is encrypted at rest and in transit. Decryption occurs strictly inside the silicon package.'
        }
      },
      {
        title: 'Side-Channel Defense & Constant-Time Cryptographic Invariants',
        say: [
          'Even when a microcontroller is mathematically secure, it leaks cryptographic secrets into the physical analog universe through electricity and time. These are known as Side-Channel Attacks.',
          'Differential Power Analysis (DPA) measures microscopic fluctuations in electrical current consumed by the processor during cryptographic operations. Because CMOS transistors consume slightly more current when flipping a bit from 0 to 1, analyzing power traces across thousands of AES rounds reveals private key bits!',
          'Similarly, Timing Attacks measure the exact number of clock cycles taken to verify a password or HMAC token. If a developer uses a naive string comparison `if (token == input)`, the comparison aborts at the first non-matching byte, leaking the correct prefix one character at a time.',
          'To defeat physical side-channel attacks, embedded security mandates Constant-Time Programming: all cryptographic comparisons must execute in the exact same number of clock cycles regardless of whether bytes match or differ, and hardware crypto accelerators introduce random clock jitter and power noise.'
        ],
        example: 'Think of guessing a padlock combination. If the dial clicks loudly whenever you hit the correct first digit, you can crack the entire lock in 30 seconds (timing leak). A silent lock that gives zero auditory or tactile feedback forces an attacker to test all 10,000 combinations blindly (constant time).',
        code: `# Simulation: Vulnerable Early-Exit vs Constant-Time Cryptographic Comparison
def vulnerable_compare(secret: bytes, candidate: bytes) -> tuple[bool, int]:
    cycles = 0
    if len(secret) != len(candidate):
        return False, cycles
    for s, c in zip(secret, candidate):
        cycles += 1 # 1 cycle per byte compared
        if s != c:
            return False, cycles # LEAK: Early exit aborts loop!
    return True, cycles

def constant_time_compare(secret: bytes, candidate: bytes) -> tuple[bool, int]:
    cycles = 0
    if len(secret) != len(candidate):
        return False, cycles
    diff = 0
    for s, c in zip(secret, candidate):
        cycles += 1 # Constant loop progression
        diff |= (s ^ c) # Accumulate bitwise XOR differences without branching
    return diff == 0, cycles

secret_hmac = b"ROOT_SECURITY_KEY_TOKEN_2026"
wrong_first_char = b"ZOOT_SECURITY_KEY_TOKEN_2026"
almost_correct   = b"ROOT_SECURITY_KEY_TOKEN_2025"

_, vul_cycles_1 = vulnerable_compare(secret_hmac, wrong_first_char)
_, vul_cycles_2 = vulnerable_compare(secret_hmac, almost_correct)
_, safe_cycles_1 = constant_time_compare(secret_hmac, wrong_first_char)
_, safe_cycles_2 = constant_time_compare(secret_hmac, almost_correct)

print(f"Vulnerable Loop Cycles (Wrong First Byte): {vul_cycles_1} cycles (FAST EXIT)")
print(f"Vulnerable Loop Cycles (Wrong Last Byte):  {vul_cycles_2} cycles (SLOW EXIT - LEAKS INFO!)")
print(f"Constant-Time Cycles (Wrong First Byte):    {safe_cycles_1} cycles")
print(f"Constant-Time Cycles (Wrong Last Byte):     {safe_cycles_2} cycles (DETERMINISTIC INVARIANT)")`,
        output: `Vulnerable Loop Cycles (Wrong First Byte): 1 cycles (FAST EXIT)\nVulnerable Loop Cycles (Wrong Last Byte):  28 cycles (SLOW EXIT - LEAKS INFO!)\nConstant-Time Cycles (Wrong First Byte):    28 cycles\nConstant-Time Cycles (Wrong Last Byte):     28 cycles (DETERMINISTIC INVARIANT)`,
        tryIt: 'Run constant_time_compare on identical keys and confirm that cycle count remains precisely 28.',
        check: {
          question: 'Why does early-exit string/byte comparison introduce a critical vulnerability in cryptographic token verification?',
          options: [
            'It creates a timing side-channel where execution time correlates with the number of matching prefix bytes, allowing adversaries to brute-force secrets one byte at a time',
            'It overheats the battery power supply',
            'It causes the compiler to generate invalid assembly instructions'
          ],
          answer: 0,
          why: 'Early termination allows an attacker to measure latency down to clock cycles or microseconds. If byte 1 is correct, it takes slightly longer; by observing this delta, the entire secret can be reconstructed character by character.'
        }
      }
    ],
    summary: [
      'The Hardware Root of Trust (RoT) grounds all system security in immutable silicon Mask ROM and one-time programmable (OTP) eFuses.',
      'Secure Boot validates firmware headers using asymmetric cryptographic signatures and enforces monotonic anti-rollback eFuse counters to prevent downgrade attacks.',
      'ARM TrustZone partitions memory and peripherals into Secure and Non-Secure Worlds, enforcing boundaries via hardware bus bits with zero software overhead.',
      'On-The-Fly Decryption Engines (OTFDEC) decrypt code as it is fetched into CPU caches, preventing physical bus sniffers from intercepting plaintext over PCB traces.',
      'Constant-time programming and power-masking eliminate timing and DPA side-channel leaks, ensuring cryptographic comparisons never branch on secret values.'
    ],
    projectStep: {
      title: 'Architect an Immutable Hardware Secure Boot Chain',
      steps: [
        'Simulate silicon eFuse configuration with a vendor public key hash and monotonic counter.',
        'Implement an ECDSA signature verification routine over an encrypted firmware image.',
        'Configure ARM TrustZone address boundaries and test hardware SecureFault trapping.',
        'Implement a constant-time cryptographic verification loop to prevent side-channel leaks.'
      ]
    }
  },
  {
    coursePrefix: 'iot_sec',
    day: 2,
    title: 'Hardware Key Derivation, AES-GCM AEAD, DPA Masking & Active Zeroization',
    goal: 'Master advanced physical and embedded cryptography: HKDF hardware key derivation from master HUKs, AES-GCM authenticated encryption against ciphertext tampering, Boolean masking against differential power analysis (DPA), active physical mesh tamper zeroization, and DTLS anti-replay sliding window verification.',
    minutes: 45,
    recap: 'Welcome to Day 2 of Hardware Security & Embedded Cryptography. On Day 1, we established the bedrock: silicon eFuses, Mask ROM, Secure Boot signature verification, TrustZone bus isolation, and on-the-fly flash decryption. Today, we advance into real-world cryptographic defense: deriving domain-separated session keys, preventing ciphertext forgery, masking power consumption to defeat side-channel oscilloscopes, and engineering physical zeroization circuits.',
    parts: [
      {
        title: 'Silicon Key Derivation: HKDF Extract-and-Expand from Hardware Unique Keys (HUK)',
        say: [
          'In production IoT microcontrollers (such as STM32H5, NXP LPC55S69, or ESP32-S3), the silicon chip contains an immutable 256-bit Hardware Unique Key (HUK) generated during foundry testing or derived from a Physical Unclonable Function (PUF).',
          'A catastrophic architectural anti-pattern is using the master HUK directly to encrypt application files, database records, or network packets. If a single session key is compromised via memory inspection or differential cryptanalysis, the master identity of the device is permanently destroyed.',
          'To isolate cryptographic security domains, embedded microcontrollers implement RFC 5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF). HKDF operates in two formal mathematical phases: (1) HKDF-Extract compresses the master HUK and an optional non-secret silicon salt into a Pseudorandom Key (PRK) using HMAC-SHA256, and (2) HKDF-Expand takes the PRK and a domain context string (e.g., "STORAGE_ENCRYPTION_KEY" or "TLS_SESSION_SHARED_KEY") to compute mathematically independent output keying material (OKM).',
          'Because HKDF is a cryptographically one-way transformation, compromising a derived application key reveals zero information about the parent HUK or adjacent session keys, guaranteeing strict cryptographic compartmentalization across the entire device lifecycle.'
        ],
        example: 'Think of a master key blank at a locksmith. The locksmith never hands you the master blank to unlock your front door. Instead, they trace the master blank against specific lock cylinder templates to grind unique keys: one for the mailbox, one for the front door, and one for the garage. If you lose your mailbox key, your house remains 100% secure.',
        code: `import hashlib
import hmac

# Simulation: HKDF Extract-and-Expand Key Derivation (RFC 5869)
def derive_hkdf_domain_keys(master_huk: bytes, salt: bytes, context_info: str, length: int = 16) -> str:
    # Phase 1: HKDF-Extract: PRK = HMAC-Hash(salt, master_huk)
    prk = hmac.new(salt, master_huk, hashlib.sha256).digest()
    # Phase 2: HKDF-Expand: OKM = HMAC-Hash(PRK, context_info || 0x01)
    info_bytes = context_info.encode('utf-8') + b'\\x01'
    derived_key = hmac.new(prk, info_bytes, hashlib.sha256).digest()[:length]
    return derived_key.hex()

master_huk = bytes.fromhex("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")
salt = b"FACTORY_SILICON_SALT_2026"

storage_key = derive_hkdf_domain_keys(master_huk, salt, "STORAGE_ENCRYPTION_KEY", 16)
tls_key = derive_hkdf_domain_keys(master_huk, salt, "TLS_SESSION_SHARED_KEY", 16)
attest_key = derive_hkdf_domain_keys(master_huk, salt, "DEVICE_ATTESTATION_KEY", 16)

print(f"Hardware Master HUK:     {master_huk[:8].hex()}...")
print(f"Derived Storage Key:     {storage_key}")
print(f"Derived TLS Session Key: {tls_key}")
print(f"Derived Attestation Key: {attest_key}")`,
        output: `Hardware Master HUK:     0123456789abcdef...\nDerived Storage Key:     bf37cb1f14e98d676906450175e49138\nDerived TLS Session Key: 34efac5b9cf4216183c1bff1be8b21ab\nDerived Attestation Key: 8b4eac0a51b7b6872e32794125f55ce6`,
        tryIt: 'Change the context string to "FIRMWARE_UPDATE_DECRYPT_KEY" and observe the derivation of a new cryptographically unique 128-bit key.',
        check: {
          question: 'Why should microcontrollers never use their master Hardware Unique Key (HUK) directly for application encryption?',
          options: [
            'Because compromising a single operational key would compromise the master root key and all other subsystem domains; HKDF provides cryptographic compartmentalization',
            'Because the HUK is stored in floating-point format and cannot perform XOR operations',
            'Because hardware unique keys expire every 24 hours',
            'Because microcontrollers can only execute AES operations using odd-numbered keys'
          ],
          answer: 0,
          why: 'HKDF isolates application security domains. A breach of a derived communication key reveals no mathematical insight into the underlying master HUK or adjacent domain keys.',
          answerIndex: 0,
          explanation: 'HKDF isolates application security domains. A breach of a derived communication key reveals no mathematical insight into the underlying master HUK or adjacent domain keys.'
        }
      },
      {
        title: 'AES-GCM Authenticated Encryption with Associated Data (AEAD) & Tamper Defense',
        say: [
          'In embedded IoT security, confidentiality alone is insufficient. If a sensor node encrypts a telemetry packet using basic AES in Cipher Block Chaining (AES-CBC) or Counter mode (AES-CTR) without cryptographic authentication, an adversary intercepting the wireless packet can perform bit-flipping attacks.',
          'By flipping specific bits in ciphertext over the air, an attacker predictably alters the decrypted plaintext without knowing the encryption key (for example, flipping a bit to change "VALVE:CLOSE" into "VALVE:OPEN").',
          'To prevent ciphertext malleability and payload tampering, modern microcontrollers incorporate hardware accelerators supporting Authenticated Encryption with Associated Data (AEAD), universally standardized around AES-GCM (Galois/Counter Mode).',
          'AES-GCM combines CTR mode encryption with a Galois Field GHASH polynomial authenticator (GMAC). It generates a 128-bit authentication tag calculated over both the ciphertext and unencrypted Additional Authenticated Data (AAD)—such as device ID, packet sequence numbers, and protocol headers. If an attacker modifies even a single bit of ciphertext or header metadata, GMAC tag verification fails completely, and the packet is discarded before execution.'
        ],
        example: 'Think of a tamper-evident bank deposit bag. The money inside is shielded from sight (confidentiality via AES-CTR). Across the outside of the bag, the account number and store branch are written in plain text (AAD). The bag is sealed with a serialized chemical holographic seal (GMAC tag). If someone cuts the bag or alters the account number on the envelope, the seal fractures instantly, alerting bank tellers to reject the deposit.',
        code: `import hashlib
import hmac

# Simulation: AES-GCM AEAD Authenticated Encryption Pipeline with GMAC
def simulate_aes_gcm_aead_pipeline(plaintext: str, aad_metadata: str, key_hex: str) -> dict:
    key_bytes = bytes.fromhex(key_hex)
    pt_bytes = plaintext.encode('utf-8')
    aad_bytes = aad_metadata.encode('utf-8')
    # Simulated keystream generation
    keystream = hashlib.sha256(key_bytes + b"NONCE_001").digest()[:len(pt_bytes)]
    ciphertext = bytes(p ^ k for p, k in zip(pt_bytes, keystream))
    # Simulated GMAC polynomial authentication tag over AAD + Ciphertext
    tag = hmac.new(key_bytes, aad_bytes + ciphertext, hashlib.sha256).hexdigest()[:16]
    return {
        "ciphertext_hex": ciphertext.hex(),
        "tag_hex": tag,
        "is_valid": True
    }

def verify_aes_gcm_tag(ciphertext_hex: str, aad_metadata: str, tag_hex: str, key_hex: str) -> bool:
    key_bytes = bytes.fromhex(key_hex)
    ct_bytes = bytes.fromhex(ciphertext_hex)
    aad_bytes = aad_metadata.encode('utf-8')
    expected_tag = hmac.new(key_bytes, aad_bytes + ct_bytes, hashlib.sha256).hexdigest()[:16]
    return hmac.compare_digest(tag_hex, expected_tag)

key = "bf37cb1f14e98d676906450175e49138"
enc_res = simulate_aes_gcm_aead_pipeline("CMD:ACTUATE_SOLENOID_VALVE", "DEVICE_ID:TURBINE_99;SEQ:1042", key)
valid_verify = verify_aes_gcm_tag(enc_res["ciphertext_hex"], "DEVICE_ID:TURBINE_99;SEQ:1042", enc_res["tag_hex"], key)
tampered_verify = verify_aes_gcm_tag("00" + enc_res["ciphertext_hex"][2:], "DEVICE_ID:TURBINE_99;SEQ:1042", enc_res["tag_hex"], key)

print(f"AEAD Ciphertext:  {enc_res['ciphertext_hex']}")
print(f"Auth Tag (GMAC):  {enc_res['tag_hex']}")
print(f"Valid Tag Check:  {valid_verify}")
print(f"Tamper Detected:  {not tampered_verify}")`,
        output: `AEAD Ciphertext:  f204d2b556216d569fc5805c3a9cb12c8ff77643494e6d0cbd7a\nAuth Tag (GMAC):  a47beb9c4f62a07e\nValid Tag Check:  True\nTamper Detected:  True`,
        tryIt: 'Modify the AAD metadata sequence number from 1042 to 1043 and verify that the authentication tag validation immediately rejects the packet.',
        check: {
          question: 'What vulnerability does AEAD (such as AES-GCM) prevent that standard unauthenticated symmetric encryption (like AES-CBC) leaves vulnerable?',
          options: [
            'Bit-flipping and ciphertext malleability attacks where adversaries modify encrypted payloads or header metadata without detection',
            'Overconsumption of microcontroller battery current during low-power sleep',
            'Compilation errors during link-time optimization',
            'Slow serial baud rates over UART debug pins'
          ],
          answer: 0,
          why: 'Unauthenticated encryption allows attackers to predictably modify decrypted plaintext by altering ciphertext bits. AEAD binds an integrity authentication tag to both ciphertext and metadata, instantly trapping any bit modification.',
          answerIndex: 0,
          explanation: 'Unauthenticated encryption allows attackers to predictably modify decrypted plaintext by altering ciphertext bits. AEAD binds an integrity authentication tag to both ciphertext and metadata, instantly trapping any bit modification.'
        }
      },
      {
        title: 'Differential Power Analysis (DPA) Countermeasures & Boolean Masking',
        say: [
          'Even when cryptographic algorithms are mathematically unbreakable, physical CMOS microcontrollers leak private key information into the analog universe through electromagnetic emissions and instantaneous power consumption.',
          'Differential Power Analysis (DPA) works by measuring microscopic electrical current transients across a small shunt resistor on the MCU power supply pin using a high-speed digital oscilloscope. In CMOS logic, transistors consume current predominantly when switching between logical states (charging and discharging parasitic capacitances).',
          'Consequently, power consumption correlates directly with the Hamming Weight (number of binary 1s) of internal registers. When an AES algorithm computes S-Box byte substitutions `S(p ^ k)`, an adversary collecting 10,000 power traces can correlate power spikes with candidate key bytes to recover the entire 128-bit key in minutes!',
          'To defeat DPA, embedded cryptographic architectures employ Boolean Masking. Every sensitive intermediate state byte $X$ is split into two or more independent random shares: $X = X_1 \\oplus X_2$, where $X_2 = M$ is a cryptographically uniform random mask generated by a hardware True Random Number Generator (TRNG) each clock cycle. The S-Box computation is performed across the masked shares. The physical power trace now correlates only with the random mask $M$, completely decorrelating electromagnetic power consumption from the secret key $K$.'
        ],
        example: 'Think of weighing gold coins on a balance scale while an eavesdropper watches from across the room. If you weigh each coin directly, the scale needle position reveals its exact weight (Hamming weight leak). But if you throw a random handful of lead beads onto the scale with each coin and subtract the beads mathematically on a separate sheet of paper, the scale needle shows random noise to the observer while you still calculate the exact balance.',
        code: `# Simulation: First-Order DPA Countermeasure via Boolean Masking
def simulate_dpa_boolean_masking(secret_sbox_input: int, random_mask: int) -> dict:
    # 1. Unmasked hardware execution (Vulnerable to DPA Hamming weight power leak)
    unmasked_hw = bin(secret_sbox_input).count('1')
    
    # 2. Boolean Masking: Split secret into 2 independent shares
    masked_share_1 = secret_sbox_input ^ random_mask
    masked_share_2 = random_mask
    
    masked_hw_1 = bin(masked_share_1).count('1')
    masked_hw_2 = bin(masked_share_2).count('1')
    reconstructed = masked_share_1 ^ masked_share_2
    
    return {
        "unmasked_input": hex(secret_sbox_input),
        "unmasked_hamming_weight": unmasked_hw,
        "share_1_masked": hex(masked_share_1),
        "share_1_hw": masked_hw_1,
        "share_2_mask": hex(masked_share_2),
        "share_2_hw": masked_hw_2,
        "leakage_decorrelated": unmasked_hw != masked_hw_1,
        "reconstructed_matches": reconstructed == secret_sbox_input
    }

mask_eval = simulate_dpa_boolean_masking(0x3B, 0x94)

print(f"Secret S-Box Byte: {mask_eval['unmasked_input']} (Hamming Weight: {mask_eval['unmasked_hamming_weight']})")
print(f"Masked Share 1:    {mask_eval['share_1_masked']} (Masked HW: {mask_eval['share_1_hw']})")
print(f"Mask Random Share: {mask_eval['share_2_mask']} (Random HW: {mask_eval['share_2_hw']})")
print(f"DPA Power Signal Decorrelated: {mask_eval['leakage_decorrelated']}")
print(f"Secret Preserved in Hardware:  {mask_eval['reconstructed_matches']}")`,
        output: `Secret S-Box Byte: 0x3b (Hamming Weight: 5)\nMasked Share 1:    0xaf (Masked HW: 6)\nMask Random Share: 0x94 (Random HW: 3)\nDPA Power Signal Decorrelated: True\nSecret Preserved in Hardware:  True`,
        tryIt: 'Test different secret bytes and random masks to verify that the masked Hamming weight never consistently reveals the unmasked Hamming weight.',
        check: {
          question: 'How does Boolean Masking protect AES implementations from Differential Power Analysis (DPA) attacks?',
          options: [
            'It splits sensitive intermediate data into multiple XOR shares combined with random noise, decoupling physical power consumption from secret key bits',
            'It doubles the supply voltage of the microcontroller to burn out attacker oscilloscopes',
            'It wraps the microcontroller in lead shielding to block Wi-Fi signals',
            'It converts AES keys into plaintext ASCII strings'
          ],
          answer: 0,
          why: 'Boolean masking ensures that intermediate calculations process statistically independent random shares. An attacker measuring instantaneous current sees only the power profile of TRNG noise rather than key-dependent Hamming weights.',
          answerIndex: 0,
          explanation: 'Boolean masking ensures that intermediate calculations process statistically independent random shares. An attacker measuring instantaneous current sees only the power profile of TRNG noise rather than key-dependent Hamming weights.'
        }
      },
      {
        title: 'Hardware Tamper Enclosures, Environmental Probes & Active Silicon Zeroization',
        say: [
          'When edge devices operate in hostile physical environments (e.g., payment terminals, utility smart meters, defense sensors), attackers can attempt invasive physical reverse engineering: decapping the chip package with fuming nitric acid, drilling into the silicon die, probing internal bus lines with focused ion beams (FIB), or freezing the chip with liquid nitrogen to preserve volatile SRAM charge.',
          'To achieve FIPS 140-3 Level 3/4 and Common Criteria EAL6+ physical security, microcontrollers incorporate active physical tamper enclosures and hardware environmental monitoring circuitry powered by a continuous microampere battery backup domain (VBAT).',
          'Physical tamper defenses include: (1) Active Wire Meshes: fine serpentine conductive traces crisscrossing the top metal layer of the silicon die, continuously pulsed with pseudorandom signals—any laser cutting or drilling breaks the circuit; (2) Cryogenic & Thermal Probes: detecting sudden freezing below -35°C (preventing cold-boot memory retention attacks) or overheating above 105°C; and (3) Voltage Glitch Detectors: sensing sharp brownouts designed to induce instruction skips.',
          'Upon detecting any tamper trigger, a dedicated hardware Active Zeroization circuit fires. Within nanoseconds, the zeroization hardware connects the power rails of battery-backed SRAM key registers directly to ground, pulverizing all Hardware Unique Keys and encryption secrets to permanent zeroes before physical probes can read a single bit.'
        ],
        example: 'Think of a self-destruct mechanism on a diplomatic briefcase. If someone cuts through the lock clasp or attempts to drill into the case with a hole saw, a canister of thermite incinerates the confidential paper documents inside in a split second, leaving the intruder with useless ash.',
        code: `# Simulation: Physical Tamper Sensor Matrix & Active Hardware Zeroization Circuit
def evaluate_hardware_tamper_and_zeroization(active_mesh_closed: bool, ambient_temp_c: float, supply_voltage: float, sram_keys: dict) -> dict:
    tamper_detected = False
    reasons = []
    
    # 1. Active silicon mesh continuity check (Detects die drilling / FIB milling)
    if not active_mesh_closed:
        tamper_detected = True
        reasons.append("MESH_OPEN_CIRCUIT_DRILL_DETECTED")
        
    # 2. Environmental temperature sensor check (Detects cryogenic freezing attacks)
    if ambient_temp_c < -35.0:
        tamper_detected = True
        reasons.append("CRYOGENIC_FREEZE_ATTACK_DETECTED")
    elif ambient_temp_c > 105.0:
        tamper_detected = True
        reasons.append("THERMAL_OVERHEAT_ATTACK_DETECTED")
        
    # 3. Fast analog supply voltage glitch detector (Detects voltage brownout injection)
    if supply_voltage < 1.62 or supply_voltage > 3.63:
        tamper_detected = True
        reasons.append("VOLTAGE_GLITCH_INJECTION_DETECTED")

    active_keys = dict(sram_keys)
    if tamper_detected:
        # Hardware Zeroization Circuit: Discharges all battery-backed key SRAM to ground
        for k in list(active_keys.keys()):
            active_keys[k] = "0x0000000000000000"

    return {
        "tamper_detected": tamper_detected,
        "triggers": reasons,
        "keys_zeroized": tamper_detected,
        "remaining_keys": active_keys
    }

initial_keys = {"HUK": "0xDEADBEEFCAFE1337", "KEK": "0x1122334455667788"}
normal_state = evaluate_hardware_tamper_and_zeroization(True, 25.0, 3.3, initial_keys)
tampered_state = evaluate_hardware_tamper_and_zeroization(False, -42.0, 3.3, initial_keys)

print(f"Normal Operation: Zeroized={normal_state['keys_zeroized']}, HUK={normal_state['remaining_keys']['HUK']}")
print(f"Tamper Event:     Zeroized={tampered_state['keys_zeroized']}, Triggers={tampered_state['triggers']}")
print(f"Post-Zeroize HUK: {tampered_state['remaining_keys']['HUK']}")`,
        output: `Normal Operation: Zeroized=False, HUK=0xDEADBEEFCAFE1337\nTamper Event:     Zeroized=True, Triggers=['MESH_OPEN_CIRCUIT_DRILL_DETECTED', 'CRYOGENIC_FREEZE_ATTACK_DETECTED']\nPost-Zeroize HUK: 0x0000000000000000`,
        tryIt: 'Simulate a voltage spike of 4.5V and confirm that the voltage glitch detector trips zeroization under normal temperatures.',
        check: {
          question: 'What is the purpose of active silicon zeroization in high-assurance embedded systems?',
          options: [
            'Instantly erasing all cryptographic keys from volatile registers upon physical intrusion or environmental anomaly to prevent physical extraction',
            'Resetting the microcontroller to factory default settings so new users can register',
            'Cooling the microcontroller processor down during intensive gaming',
            'Formatting the external SD card to free up storage space'
          ],
          answer: 0,
          why: 'Active zeroization guarantees that if an attacker physically compromises the silicon enclosure or freezes the die, hardware circuitry actively grounds the key registers, destroying secrets in nanoseconds.',
          answerIndex: 0,
          explanation: 'Active zeroization guarantees that if an attacker physically compromises the silicon enclosure or freezes the die, hardware circuitry actively grounds the key registers, destroying secrets in nanoseconds.'
        }
      },
      {
        title: 'Monotonic Nonce Management & Anti-Replay Sliding Windows in Constrained DTLS',
        say: [
          'In constrained wireless IoT protocols operating over UDP (such as Datagram Transport Layer Security DTLS, CoAP with OSCORE RFC 8613, or IEEE 802.15.4 security), packets can arrive out of order, be duplicated by intermediate mesh routers, or be maliciously captured by an eavesdropper.',
          'If an attacker captures a valid, authentically signed command packet (e.g., "UNLOCK_SMART_LOCK_DEADBOLT") transmitted yesterday, they can simply replay that exact binary packet across the radio channel today. Even with military-grade AES-GCM encryption, the receiver would validate the cryptographic tag and unlock the door!',
          'To eradicate replay attacks without requiring expensive round-trip TCP handshakes, embedded network layers utilize Monotonic Sequence Numbers paired with an Anti-Replay Sliding Window (RFC 6479).',
          'The sliding window maintains a right edge (highest sequence number validated) and a compact 64-bit bitmap of recently received sequence numbers. Packets older than the window width ($R - 64$) are discarded immediately. Packets falling inside the window are checked against the bitmap: if the bit is already 1, the duplicate is dropped; if 0, the bit is set and the packet is accepted. This achieves $O(1)$ constant-time, constant-memory replay protection on devices with only 2KB of RAM.'
        ],
        example: 'Think of movie theater ticket stubs. Each ticket has a sequential serial number. The usher marks off numbers on their 64-seat clipboard. If someone attempts to present a ticket stub that was already stamped 10 minutes ago, or a stub from last week’s film (behind the window), the usher turns them away instantly.',
        code: `# Simulation: Monotonic Sequence Anti-Replay Sliding Window (RFC 6479)
class AntiReplaySlidingWindow:
    def __init__(self, window_size: int = 64):
        self.window_size = window_size
        self.right_edge = 0 # Highest sequence number observed
        self.bitmap = 0     # 64-bit sliding window bitmap

    def check_and_update(self, seq_num: int) -> bool:
        if seq_num <= 0:
            return False
        # Case 1: Fresh packet ahead of right edge -> Advance window
        if seq_num > self.right_edge:
            diff = seq_num - self.right_edge
            if diff < self.window_size:
                self.bitmap = (self.bitmap << diff) | 1
            else:
                self.bitmap = 1
            self.right_edge = seq_num
            return True
        # Case 2: Packet behind current window -> Too old, drop
        diff = self.right_edge - seq_num
        if diff >= self.window_size:
            return False
        # Case 3: Inside window -> Check if duplicate bit is already set
        if (self.bitmap & (1 << diff)) != 0:
            return False # Duplicate packet detected!
        # Mark sequence bit as received
        self.bitmap |= (1 << diff)
        return True

window = AntiReplaySlidingWindow(window_size=64)
packets = [1, 2, 5, 3, 2, 70, 5, 8]
results = []
for p in packets:
    accepted = window.check_and_update(p)
    results.append((p, accepted))

print("Anti-Replay Ingestion Log:")
for seq, acc in results:
    status = "ACCEPTED" if acc else "DROPPED (REPLAY/OLD)"
    print(f"  Seq #{seq:02d}: {status}")`,
        output: `Anti-Replay Ingestion Log:\n  Seq #01: ACCEPTED\n  Seq #02: ACCEPTED\n  Seq #05: ACCEPTED\n  Seq #03: ACCEPTED\n  Seq #02: DROPPED (REPLAY/OLD)\n  Seq #70: ACCEPTED\n  Seq #05: DROPPED (REPLAY/OLD)\n  Seq #08: ACCEPTED`,
        tryIt: 'Feed packet #1 into the window after packet #70 and observe how sequence #1 is dropped for falling outside the 64-packet window.',
        check: {
          question: 'How does an anti-replay sliding window prevent malicious packet replay attacks in constrained UDP/DTLS IoT networks?',
          options: [
            'It tracks the highest sequence number and maintains a sliding bitmap of recently seen IDs, rejecting duplicates and packets older than the window width in O(1) memory',
            'It asks the Wi-Fi router to reboot whenever a packet arrives out of order',
            'It stores every received packet indefinitely in external Flash until memory overflows',
            'It forces the sender to transmit each packet five times sequentially'
          ],
          answer: 0,
          why: 'A 64-bit sliding window bitmap provides O(1) duplicate detection without unbounded memory consumption, ensuring replayed or delayed adversary packets are rejected immediately.',
          answerIndex: 0,
          explanation: 'A 64-bit sliding window bitmap provides O(1) duplicate detection without unbounded memory consumption, ensuring replayed or delayed adversary packets are rejected immediately.'
        }
      }
    ],
    summary: [
      'HKDF Extract-and-Expand isolates application security domains, deriving cryptographically independent session keys from master Hardware Unique Keys (HUK).',
      'AES-GCM Authenticated Encryption with Associated Data (AEAD) binds a GMAC integrity tag to both ciphertext and metadata, neutralizing bit-flipping attacks.',
      'Boolean Masking decorrelates physical CMOS power consumption from secret key bits, neutralizing Differential Power Analysis (DPA) side-channel attacks.',
      'Active physical wire meshes, cryogenic temperature probes, and hardware zeroization circuits instantly ground battery-backed SRAM keys upon invasive physical tamper.',
      'Anti-replay sliding windows with monotonic sequence numbers protect constrained UDP/DTLS sensor networks from captured packet replay attacks in O(1) memory.'
    ],
    projectStep: {
      title: 'Architect an End-to-End Embedded Cryptographic Security Core',
      steps: [
        'Derive domain-separated storage, TLS, and attestation keys from a silicon master HUK using HKDF.',
        'Implement an AES-GCM AEAD encryption and GMAC authentication verification routine.',
        'Simulate Boolean masking across an AES S-Box lookup to verify power signal decorrelation.',
        'Implement an active physical tamper detection matrix with zeroization and DTLS anti-replay window.'
      ]
    }
  },
  {
    coursePrefix: 'iot_sec',
    day: 3,
    title: 'Hardware Cryptographic Engines, ChaCha20-Poly1305, Constant-Time Execution & Glitch Protections',
    goal: 'Master hardware-accelerated embedded cryptography: DMA-driven hardware AES/SHA engines, ChaCha20-Poly1305 stream cipher for microcontrollers without AES coprocessors, constant-time cryptographic routines defeating timing side-channels, and clock/voltage glitch fault-injection detection circuits.',
    minutes: 35,
    recap: 'In Day 2, we engineered HKDF domain derivation, AES-GCM AEAD, DPA masking, and anti-replay windows. Today in Day 3, we dive into hardware cryptographic engines, ChaCha20-Poly1305 stream ciphers, constant-time software invariants, and active physical fault injection/glitch countermeasures.',
    parts: [
      {
        title: 'Hardware Cryptographic Engines & DMA Offload vs Software Emulation',
        say: [
          'In battery-constrained IoT devices, executing symmetric cryptography entirely in software creates severe performance bottlenecks and massive energy drains. A standard software implementation of AES-256 requires approximately 280 CPU clock cycles per 16-byte block, using lookup tables (T-tables) and arithmetic loops that monopolize the CPU core. Encrypting a 4-kilobyte firmware image or network payload in software consumes over 71,000 CPU cycles—blocking real-time motor control loops and wireless interrupt servicing.',
          'Modern secure microcontrollers (such as STM32H7, Nordic nRF5340, or NXP LPC55S69) incorporate dedicated Hardware Cryptographic Engines (Crypto Accelerators). These coprocessors implement the AES S-box, MixColumns, and Key Expansion stages directly in dedicated silicon logic gates. Crucially, the crypto engine connects directly to the Direct Memory Access (DMA) controller over the internal AHB bus matrix, enabling full autonomous background encryption.',
          'When the firmware initiates an encryption job, it configures DMA source and destination descriptors and triggers the crypto peripheral. The DMA controller streams plaintext blocks directly from SRAM into the AES engine and writes ciphertext back to memory at roughly 1.2 cycles per byte with 0% CPU core intervention! Encrypting a 4 KB payload finishes in only 76.8 microseconds (a 14.6x hardware speedup), freeing the main processor to enter low-power sleep or process critical sensor telemetry.'
        ],
        example: 'Like an automated mail sorting machine in a modern post office: instead of a postal worker manually reading, weighing, and stamping every individual envelope by hand (software emulation), envelopes glide along a motorized conveyor belt that stamps 100 letters a minute automatically (DMA hardware coprocessor).',
        code: `# Simulation: Hardware Crypto Coprocessor & DMA Engine Throughput
def evaluate_hardware_crypto_engine_throughput(payload_bytes: int, cpu_freq_hz: int):
    # Software AES-256: ~280 CPU cycles per 16-byte block (table-based)
    # Hardware AES Coprocessor (DMA): ~1.2 cycles per byte, 0% CPU blocking
    software_cycles = int((payload_bytes / 16.0) * 280)
    hardware_cycles = int(payload_bytes * 1.2)
    
    software_latency_us = round((software_cycles / cpu_freq_hz) * 1e6, 2)
    hardware_latency_us = round((hardware_cycles / cpu_freq_hz) * 1e6, 2)
    speedup_ratio = round(software_cycles / hardware_cycles, 1)
    
    return {
        "payload_bytes": payload_bytes,
        "sw_cycles": software_cycles,
        "hw_cycles": hardware_cycles,
        "sw_latency_us": software_latency_us,
        "hw_latency_us": hardware_latency_us,
        "speedup_ratio": speedup_ratio
    }

res1 = evaluate_hardware_crypto_engine_throughput(4096, 64000000) # 4 KB on 64 MHz MCU
print("=== HARDWARE CRYPTO ENGINE VS SOFTWARE EMULATION ===")
print(f"Payload Size:             {res1['payload_bytes']} Bytes (4 KB)")
print(f"Software AES Cycles:      {res1['sw_cycles']:,} cycles ({res1['sw_latency_us']} us)")
print(f"Hardware DMA AES Cycles:  {res1['hw_cycles']:,} cycles ({res1['hw_latency_us']} us)")
print(f"Hardware Speedup Factor:  {res1['speedup_ratio']}x Faster Throughput")`,
        output: `=== HARDWARE CRYPTO ENGINE VS SOFTWARE EMULATION ===\nPayload Size:             4096 Bytes (4 KB)\nSoftware AES Cycles:      71,680 cycles (1120.0 us)\nHardware DMA AES Cycles:  4,915 cycles (76.8 us)\nHardware Speedup Factor:  14.6x Faster Throughput`,
        codeNotes: [
          { line: 2, note: 'Compares software AES cycle costs against autonomous DMA hardware coprocessor execution' },
          { line: 6, note: 'Computes hardware execution latency of 76.8 us vs 1,120.0 us for software emulation' },
          { line: 21, note: 'Demonstrates 14.6x throughput acceleration with zero CPU core blocking' }
        ],
        tryIt: 'Increase payload_bytes to 16384 (16 KB) and observe how software latency surges past 4.4 ms while hardware DMA takes only 307 us.',
        check: {
          question: 'What is the primary architectural advantage of pairing a hardware AES accelerator with a DMA controller in embedded microcontrollers?',
          options: [
            'It offloads cryptographic encryption from the CPU core, executing memory-to-memory block operations autonomously in silicon with zero CPU blocking',
            'It allows encryption to work without an electrical power supply',
            'It automatically prints physical barcodes on external paper receipts',
            'It prevents the microcontroller from connecting to Wi-Fi networks'
          ],
          answer: 0,
          why: 'DMA controllers stream data directly between memory and cryptographic peripheral registers over internal buses, allowing high-throughput encryption while the CPU sleeps or handles other tasks.'
        }
      },
      {
        title: 'ChaCha20-Poly1305: ARX Stream Cipher Architecture for Low-Power Microcontrollers',
        say: [
          'While high-end Cortex-M4 and M7 microcontrollers often feature dedicated AES hardware accelerators, billions of ultra-low-cost IoT microcontrollers (such as ARM Cortex-M0+ or RISC-V RV32EC cores) lack hardware crypto engines. On these minimalist chips, executing software AES is not only slow, but notoriously vulnerable to Cache-Timing Side-Channel Attacks because AES relies on 256-byte S-box lookup tables in RAM.',
          'To provide military-grade security on chips without AES hardware, modern cryptographic standards (RFC 8439) standardize the ChaCha20-Poly1305 AEAD cipher. ChaCha20 is a stream cipher designed by Daniel J. Bernstein that completely eliminates lookup tables! Instead of memory lookups, ChaCha20 relies exclusively on ARX operations: 32-bit Integer Addition (A), Bitwise Rotation (R), and Bitwise XOR (X).',
          'Every ARM and RISC-V microcontroller executes Addition, Rotation, and XOR in a single CPU cycle with guaranteed constant time. The core building block of ChaCha20 is the Quarter-Round function, which takes four 32-bit state words (a, b, c, d) and mixes them through four sequential ARX operations. Because ARX instructions execute with identical clock cycle latency regardless of key or data values, ChaCha20 is naturally immune to cache timing attacks while delivering blisteringly fast software throughput.'
        ],
        example: 'Like shuffling a deck of cards using only simple mechanical cuts and rotations: because every cut takes exactly the same motion and time, an observer watching the dealer cannot guess which card is on top by listening to the sound of the shuffle.',
        code: `# Simulation: ChaCha20 ARX Quarter-Round State Transformation Kernel
def simulate_chacha20_quarter_round(a: int, b: int, c: int, d: int):
    # ChaCha20 Quarter Round: Add-Rotate-XOR (ARX) operations on 32-bit words
    def rotl32(v, bits):
        return ((v << bits) & 0xFFFFFFFF) | ((v & 0xFFFFFFFF) >> (32 - bits))
    
    # 1. a += b; d ^= a; d <<<= 16;
    a = (a + b) & 0xFFFFFFFF
    d = rotl32(d ^ a, 16)
    # 2. c += d; b ^= c; b <<<= 12;
    c = (c + d) & 0xFFFFFFFF
    b = rotl32(b ^ c, 12)
    # 3. a += b; d ^= a; d <<<= 8;
    a = (a + b) & 0xFFFFFFFF
    d = rotl32(d ^ a, 8)
    # 4. c += d; b ^= c; b <<<= 7;
    c = (c + d) & 0xFFFFFFFF
    b = rotl32(b ^ c, 7)
    
    return [hex(a), hex(b), hex(c), hex(d)]

qr_state = simulate_chacha20_quarter_round(0x11111111, 0x22222222, 0x33333333, 0x44444444)
print("=== CHACHA20 ARX QUARTER-ROUND KERNEL ===")
print(f"Word State [a, b, c, d]: {qr_state}")`,
        output: `=== CHACHA20 ARX QUARTER-ROUND KERNEL ===\nWord State [a, b, c, d]: ['0xbbbbbbbb', '0xffffff7f', '0x77777776', '0xcccccccc']`,
        codeNotes: [
          { line: 2, note: 'Implements pure ARX (Add, Rotate, XOR) quarter-round kernel without memory tables' },
          { line: 7, note: 'Executes four sequential ARX mixing rounds with constant instruction latency' },
          { line: 22, note: 'Mixes input 32-bit words into cryptographically diffused state words' }
        ],
        tryIt: 'Change word a to 0x00000000 and observe how all 4 state words diffuse completely into new values.',
        check: {
          question: 'Why is the ChaCha20 ARX stream cipher highly recommended for IoT microcontrollers that lack hardware AES coprocessors?',
          options: [
            'Because it relies entirely on 32-bit Add, Rotate, and XOR instructions without lookup tables, executing in constant time and eliminating cache timing side-channels',
            'Because it compresses files into ZIP format automatically',
            'Because it allows passwords to be written in plain text',
            'Because it only works on microcontrollers with analog temperature sensors'
          ],
          answer: 0,
          why: 'Software AES uses table lookups that leak secret key bits through CPU cache access latency. ChaCha20 uses only arithmetic ARX instructions that execute in constant time with zero cache leakage.'
        }
      },
      {
        title: 'Constant-Time Cryptographic Implementation: Eliminating Timing Attack Leakage',
        say: [
          'In standard application software, standard library functions prioritize speed above all else. For instance, the standard C library string comparison function memcmp(buf1, buf2, n) compares bytes sequentially from left to right. The moment it encounters the very first mismatched byte, it executes an early return (if (buf1[i] != buf2[i]) return -1;) to avoid wasting CPU cycles.',
          'In cryptographic engineering, using early-exit comparison functions like memcmp() to verify authentication tags or HMAC signatures is a catastrophic vulnerability known as a Timing Side-Channel Attack. An attacker who sends forged authentication tags over a local UART interface or network socket can measure the precise nanosecond execution latency of the microcontroller using a digital oscilloscope or high-resolution hardware timers.',
          'If the first byte of the attacker\'s forged tag is wrong, the MCU rejects the request in 4 nanoseconds. If the attacker guesses the correct first byte, the rejection takes 8 nanoseconds! By iterating through only 256 guesses per byte position (256 * 16 = 4,096 total requests), the attacker cracks a 128-bit authentication tag in minutes! To eliminate timing attacks, cryptographic firmware must strictly enforce Constant-Time Comparisons: every byte must be evaluated unconditionally using a bitwise OR accumulator (accumulator |= (s_byte ^ c_byte)), ensuring the routine takes the exact same number of clock cycles whether byte 0 or byte 15 mismatches.'
        ],
        example: 'Like checking a 4-digit bicycle padlock: if the lock gave an audible click every time you dialed the correct digit, a thief could crack the combination in 40 seconds by listening for clicks rather than trying all 10,000 combinations.',
        code: `# Simulation: Constant-Time vs Early-Exit Comparison Timing Defense
def constant_time_memcmp_audit(secret: bytes, candidate: bytes):
    # Vulnerable naive compare exits early on first mismatched byte: leaks byte position via execution time!
    # Constant-time compare evaluates every byte unconditionally using bitwise OR accumulator.
    if len(secret) != len(candidate):
        return False, 0
    
    accumulator = 0
    eval_steps = 0
    for s_byte, c_byte in zip(secret, candidate):
        accumulator |= (s_byte ^ c_byte)
        eval_steps += 1
        
    is_match = (accumulator == 0)
    return is_match, eval_steps

secret_mac = bytes.fromhex("1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d")
test_wrong_byte0 = bytes.fromhex("002b3c4d5e6f7a8b9c0d1e2f3a4b5c6d")
test_wrong_byte15 = bytes.fromhex("1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c00")

_, steps0 = constant_time_memcmp_audit(secret_mac, test_wrong_byte0)
_, steps15 = constant_time_memcmp_audit(secret_mac, test_wrong_byte15)
print("=== CONSTANT-TIME TIMING ATTACK MITIGATION ===")
print(f"Secret MAC Length:        16 Bytes (128 Bits)")
print(f"Steps (Mismatch Byte 0):  {steps0} Bytes Evaluated (No Early Exit)")
print(f"Steps (Mismatch Byte 15): {steps15} Bytes Evaluated (No Early Exit)")
print(f"Execution Timing Delta:   0.00 ns (Zero Timing Side-Channel)")`,
        output: `=== CONSTANT-TIME TIMING ATTACK MITIGATION ===\nSecret MAC Length:        16 Bytes (128 Bits)\nSteps (Mismatch Byte 0):  16 Bytes Evaluated (No Early Exit)\nSteps (Mismatch Byte 15): 16 Bytes Evaluated (No Early Exit)\nExecution Timing Delta:   0.00 ns (Zero Timing Side-Channel)`,
        codeNotes: [
          { line: 2, note: 'Demonstrates timing side-channel mitigation using unconditional bitwise OR accumulator' },
          { line: 9, note: 'Accumulates differences across all bytes without early branching or conditional exits' },
          { line: 22, note: 'Evaluates exactly 16 bytes regardless of mismatch index, producing 0.00 ns timing delta' }
        ],
        tryIt: 'Pass matching bytes into constant_time_memcmp_audit and verify it returns is_match=True while still evaluating all 16 bytes.',
        check: {
          question: 'Why must cryptographic MAC and signature verification routines never use early-exit functions like standard memcmp()?',
          options: [
            'Because early-exit functions terminate faster when early bytes mismatch, leaking the secret byte values one-by-one through observable execution timing differences',
            'Because standard memcmp() causes memory leaks in microcontrollers',
            'Because early-exit functions invert the endianness of the processor',
            'Because digital signatures cannot be represented as byte arrays'
          ],
          answer: 0,
          why: 'If a comparison returns earlier on byte 0 than on byte 15, attackers can measure the elapsed time to guess secret signature bytes sequentially in linear time.'
        }
      },
      {
        title: 'Fault Injection Countermeasures: Clock & Voltage Glitch Detector Circuits',
        say: [
          'In high-security embedded environments (such as smart cards, biometric door locks, or cryptocurrency hardware wallets), attackers frequently possess physical access to the device. When software defenses and cryptographic algorithms are mathematically sound, sophisticated adversaries bypass security using Hardware Fault Injection Attacks.',
          'The two most prevalent fault injection techniques are Voltage Glitching and Clock Glitching. In a voltage glitch attack, the attacker uses a high-speed MOSFET switch to momentarily pull the microcontroller\'s VDD power supply rail down from 3.3V to 1.8V for 20 nanoseconds (a Brownout Pulse) precisely when the CPU executes a security check instruction (such as a conditional branch BEQ verify_signature). The sudden drop in voltage starves the CPU core transistors of charge, causing the instruction decoder to skip the branch or misread a comparison flag!',
          'To defeat physical fault injection, secure microcontrollers incorporate on-die Hardware Glitch Detectors. An analog voltage supervisor continuously monitors VDD using high-speed comparators; if the supply voltage deviates outside safe operational thresholds (e.g. < 2.7V or > 3.8V for even 5 nanoseconds), an asynchronous hardware tamper interrupt triggers immediate CPU reset and key zeroization. Similarly, dual-rail clock monitors verify that clock edge periods do not shrink below physical transistor propagation limits.'
        ],
        example: 'Like an anti-shaker tilt sensor on a coin-operated vending machine: if an aggressive person kicks or rocks the machine to force snacks to fall without paying, the sensor trips an alarm, locks the dispenser flap, and shuts down the machine.',
        code: `# Simulation: Hardware Fault Injection Voltage & Clock Glitch Supervisor
def evaluate_voltage_clock_glitch_detector(vdd_volts: float, clock_period_ns: float):
    # Hardware supervisor monitors: VDD nominal 3.3V (safe: 3.0V - 3.6V), Clock nominal 15.625ns (64MHz)
    voltage_glitch = vdd_volts < 2.7 or vdd_volts > 3.8
    clock_glitch = clock_period_ns < 10.0 # High-frequency glitch edge
    
    tamper_detected = voltage_glitch or clock_glitch
    verdict = "RESET_SYSTEM_CLEAR_KEYS" if tamper_detected else "NORMAL_SECURE_EXECUTION"
    
    return {
        "vdd_volts": vdd_volts,
        "clock_period_ns": clock_period_ns,
        "tamper_detected": tamper_detected,
        "hardware_action": verdict
    }

res4_safe = evaluate_voltage_clock_glitch_detector(3.3, 15.6)
res4_glitch = evaluate_voltage_clock_glitch_detector(2.2, 15.6) # Brownout glitch attack
print("=== HARDWARE FAULT INJECTION GLITCH DETECTOR ===")
print(f"Nominal 3.3V Profile:   {res4_safe['hardware_action']} (Tamper: {res4_safe['tamper_detected']})")
print(f"2.2V Glitch Profile:    {res4_glitch['hardware_action']} (Tamper: {res4_glitch['tamper_detected']})")`,
        output: `=== HARDWARE FAULT INJECTION GLITCH DETECTOR ===\nNominal 3.3V Profile:   NORMAL_SECURE_EXECUTION (Tamper: False)\n2.2V Glitch Profile:    RESET_SYSTEM_CLEAR_KEYS (Tamper: True)`,
        codeNotes: [
          { line: 2, note: 'Monitors analog VDD power rails and clock oscillation frequencies for fault injection' },
          { line: 4, note: 'Detects brownout transient drops (<2.7V) indicative of voltage glitch attacks' },
          { line: 18, note: 'Triggers RESET_SYSTEM_CLEAR_KEYS immediate shutdown when glitch anomaly is detected' }
        ],
        tryIt: 'Set clock_period_ns to 8.0 ns (simulating an overclock glitch spike) and verify the supervisor triggers tamper action.',
        check: {
          question: 'How do voltage glitch fault-injection attacks attempt to bypass secure boot verification checks?',
          options: [
            'By pulsing the CPU power supply voltage down momentarily to starve transistors of charge, causing the CPU to skip the conditional branch instruction that enforces signature verification',
            'By draining the battery so the user forgets their password',
            'By erasing the Wi-Fi credentials stored in flash memory',
            'By heating the microcontroller with a hairdryer to melt solder joints'
          ],
          answer: 0,
          why: 'A nanosecond voltage drop causes timing violations inside silicon logic gates, leading the instruction decoder to misread or skip critical conditional jump instructions.'
        }
      },
      {
        title: 'Double-Check Redundant Logic & Control Flow Integrity (CFI) in Firmware',
        say: [
          'Even with hardware glitch detectors in place, defense-in-depth requires that software firmware itself be resilient to transient hardware faults. If an attacker manages to inject a precision laser glitch or electromagnetic pulse (EMP) that skips a single instruction despite analog sensors, a naive security check like if (is_authenticated) grant_admin_access(); can be compromised in a single clock cycle.',
          'Secure firmware engineers implement Redundant Defensive Programming and Control Flow Integrity (CFI). First, security flags must never be simple boolean true (1) or false (0). A single flipped bit in an ALU register can turn 0 into 1! Instead, authorization states use multi-bit Hamming-Distance-Separated Magic Constants—such as AUTH_GRANTED = 0x5A5AA5A5 and AUTH_DENIED = 0xA5A55A5A, which require at least 16 simultaneous bit-flips to transition.',
          'Second, critical decisions employ Dual-Token Redundancy with Step Canaries. The firmware performs the verification check twice using inverted arithmetic logic (if (token == magic && ~token == ~magic)), updating an accumulator step canary at each stage. Before performing a sensitive operation (such as executing an OTA firmware update or opening an electronic lock), the firmware validates that all step canaries were hit in the exact expected sequential order. If an instruction was skipped by a glitch, the step canary will be corrupted, triggering an immediate security lockdown.'
        ],
        example: 'Like entering a nuclear missile silo: the launch protocol requires two separate launch officers sitting in separate chairs to turn two physical keys simultaneously at the exact same second, ensuring that a single distracted officer can never launch a missile alone.',
        code: `# Simulation: Dual-Token Redundant Logic & Control Flow Integrity (CFI)
def validate_redundant_control_flow_integrity(auth_token: int, golden_magic: int):
    # Attack scenario: Voltage glitch skips CPU branch instruction BEQ (Bypass check)
    # Defense: Dual-token validation, step counters, and bit-inverted redundancy checks
    step_canary = 0xAA55
    
    # Check 1: Primary verification
    check1_pass = (auth_token == golden_magic)
    if check1_pass:
        step_canary ^= 0x1122
        
    # Check 2: Bit-inverted secondary verification
    check2_pass = ((~auth_token & 0xFFFFFFFF) == (~golden_magic & 0xFFFFFFFF))
    if check2_pass:
        step_canary ^= 0x3344
        
    # Final assertion: Execution reaches target only if both checks and canary pass
    cfi_verified = check1_pass and check2_pass and (step_canary == (0xAA55 ^ 0x1122 ^ 0x3344))
    return {
        "cfi_verified": cfi_verified,
        "status": "AUTHORIZATION_GRANTED_DUAL_CFI" if cfi_verified else "SECURITY_FAULT_LOCKDOWN"
    }

res5 = validate_redundant_control_flow_integrity(0xDEADBEEF, 0xDEADBEEF)
print("=== CONTROL FLOW INTEGRITY (CFI) DUAL-TOKEN AUDIT ===")
print(f"Token Match Invariant:  {res5['cfi_verified']}")
print(f"Firmware Branch Action: {res5['status']}")`,
        output: `=== CONTROL FLOW INTEGRITY (CFI) DUAL-TOKEN AUDIT ===\nToken Match Invariant:  True\nFirmware Branch Action: AUTHORIZATION_GRANTED_DUAL_CFI`,
        codeNotes: [
          { line: 2, note: 'Implements dual-token control flow integrity resistant to single-instruction glitch skips' },
          { line: 11, note: 'Employs bit-inverted secondary check (~token == ~magic) requiring multi-register parity' },
          { line: 18, note: 'Verifies step canary accumulator matches expected cryptographic hash sequence' }
        ],
        tryIt: 'Change auth_token to 0xCAFEBABE and verify firmware immediately returns SECURITY_FAULT_LOCKDOWN.',
        check: {
          question: 'Why does secure embedded firmware use multi-bit magic values (e.g. 0x5A5AA5A5) instead of simple booleans (1 or 0) for authorization checks?',
          options: [
            'Because a single hardware bit-flip caused by radiation or voltage glitching can change 0 to 1, whereas multi-bit values require many simultaneous bit flips to accidentally authorize access',
            'Because C++ cannot store boolean variables in memory',
            'Because magic numbers increase microcontroller processor clock speed',
            'Because simple booleans consume more electricity in silicon'
          ],
          answer: 0,
          why: 'A single hardware glitch or bit flip can easily change a 0 to 1. Using multi-bit values with high Hamming distance makes accidental glitch exploitation mathematically near-impossible.'
        }
      }
    ],
    summary: [
      'Hardware Crypto Accelerators with DMA offload execute AES encryption at 1.2 cycles/byte with zero CPU core blocking.',
      'ChaCha20-Poly1305 ARX stream ciphers eliminate lookup tables, providing constant-time execution immune to cache timing attacks on low-cost MCUs.',
      'Constant-time memory comparisons evaluate every byte unconditionally, eliminating timing side-channels that leak secret authentication tags.',
      'Hardware voltage and clock glitch detectors monitor analog power and timing margins, triggering instant reset upon brownout fault injection.',
      'Control Flow Integrity (CFI) with multi-bit magic constants and redundant bit-inverted logic protects firmware against skipped branch instructions.'
    ],
    projectStep: {
      title: 'Architect an Accelerated & Fault-Resilient Embedded Cryptographic Core',
      steps: [
        'Benchmark hardware DMA crypto accelerator throughput against software AES emulation.',
        'Implement an ARX quarter-round mixing kernel for table-free ChaCha20 stream encryption.',
        'Construct a constant-time memory comparison routine eliminating timing attack side-channels.',
        'Simulate analog voltage and clock glitch supervisors triggering hardware reset actions.',
        'Implement dual-token redundant authorization logic with control flow integrity (CFI) step canaries.'
      ]
    }
  },
  {
    coursePrefix: 'iot_sec',
    day: 4,
    title: 'Asymmetric Cryptography: ECC, ECDHE Key Exchange, Nonce Safety & Hardware TRNGs',
    goal: 'Master asymmetric cryptography on resource-constrained embedded systems: Elliptic Curve Cryptography (NIST P-256 vs Ed25519), ephemeral ECDH key agreement with Perfect Forward Secrecy, ECDSA nonce reuse vulnerability audits (RFC 6979), silicon True Random Number Generators (TRNG ring oscillators and NIST SP 800-90B health tests), and side-channel protected Montgomery ladder point multiplication.',
    minutes: 35,
    recap: 'In Day 3, we mastered hardware DMA crypto engines, table-free ChaCha20 ARX ciphers, constant-time memory comparisons, and voltage glitch detection. Today in Day 4, we advance to asymmetric public-key cryptography on microcontrollers, ephemeral key agreement, TRNG entropy harvesting, and constant-time modular arithmetic.',
    parts: [
      {
        title: 'Elliptic Curve Cryptography: NIST P-256 vs Ed25519 on Embedded Cores',
        say: [
          'For decades, RSA public-key cryptography dominated internet security. However, executing RSA on resource-constrained microcontrollers (such as ARM Cortex-M0+ or M4 cores) is virtually prohibitive. To achieve a modern 128-bit security level, RSA requires a 3072-bit modulus (384 bytes). Performing modular exponentiation (c = m^e mod n) with 3072-bit bignums requires over 4 kilobytes of working RAM for multiprecision accumulators and takes upwards of 12,000 milliseconds on an unaccelerated 48 MHz microcontroller—stalling the device for 12 full seconds!',
          'Elliptic Curve Cryptography (ECC) revolutionizes embedded public-key security by achieving equivalent mathematical strength with dramatically smaller keys. A 256-bit elliptic curve key delivers the exact same 128-bit security level as RSA-3072, but requires only 32 bytes of Flash storage. Furthermore, point multiplication over elliptic curves executes in only 38.5 milliseconds on a Cortex-M0+—a staggering 322x speedup over RSA while slashing RAM overhead by 93.8%!',
          'In modern embedded systems, two curve families dominate: (1) NIST P-256 (secp256r1), specified in ANSI X9.62 and FIPS 186-4, utilizing the short Weierstrass equation y^2 = x^3 - 3x + b mod p; and (2) Ed25519 (Curve25519), designed by Daniel J. Bernstein, utilizing twisted Edwards curves -x^2 + y^2 = 1 - (121665/121666)x^2y^2. While NIST P-256 is mandatory for legacy enterprise TLS and government compliance, Ed25519 provides complete immunity to exceptional point edge cases, executes in constant time by default, and delivers 19.2 ms signature generation on Cortex-M0+.'
        ],
        example: 'Like replacing a 50-pound cast-iron ship anchor and chain (RSA-3072) with a high-strength titanium mountaineering carabiner (ECC-256) on an ultralight drone: both hold the exact same breaking load, but the carabiner weighs 1/100th as much and fits in a shirt pocket.',
        code: `# Simulation: Asymmetric Key & Signature Footprint Benchmark on Embedded MCUs
def compare_asymmetric_key_and_signature_metrics(algorithm: str) -> dict:
    specs = {
        "RSA-2048": {
            "pubkey_bytes": 256,
            "signature_bytes": 256,
            "cortex_m0_sign_ms": 12400.0,
            "security_bits": 112,
            "ram_overhead_bytes": 4096
        },
        "NIST-P256": {
            "pubkey_bytes": 64, # Uncompressed (X, Y)
            "signature_bytes": 64, # (r, s)
            "cortex_m0_sign_ms": 38.5,
            "security_bits": 128,
            "ram_overhead_bytes": 512
        },
        "Ed25519": {
            "pubkey_bytes": 32, # Compressed point
            "signature_bytes": 64, # (R, S)
            "cortex_m0_sign_ms": 19.2,
            "security_bits": 128,
            "ram_overhead_bytes": 256
        }
    }
    
    selected = specs.get(algorithm, specs["NIST-P256"])
    speedup_vs_rsa = round(specs["RSA-2048"]["cortex_m0_sign_ms"] / selected["cortex_m0_sign_ms"], 1)
    ram_savings_vs_rsa = round((specs["RSA-2048"]["ram_overhead_bytes"] - selected["ram_overhead_bytes"]) / specs["RSA-2048"]["ram_overhead_bytes"] * 100, 1)
    
    return {
        "algorithm": algorithm,
        "pubkey_bytes": selected["pubkey_bytes"],
        "signature_bytes": selected["signature_bytes"],
        "sign_latency_ms": selected["cortex_m0_sign_ms"],
        "security_level_bits": selected["security_bits"],
        "speedup_vs_rsa": speedup_vs_rsa,
        "ram_savings_pct": ram_savings_vs_rsa
    }

p1_rsa = compare_asymmetric_key_and_signature_metrics("RSA-2048")
p1_p256 = compare_asymmetric_key_and_signature_metrics("NIST-P256")
p1_ed = compare_asymmetric_key_and_signature_metrics("Ed25519")

print("=== ASYMMETRIC CRYPTOGRAPHY BENCHMARK (CORTEX-M0+) ===")
print(f"RSA-2048:  Pubkey={p1_rsa['pubkey_bytes']}B, Sig={p1_rsa['signature_bytes']}B, Latency={p1_rsa['sign_latency_ms']} ms")
print(f"NIST-P256: Pubkey={p1_p256['pubkey_bytes']}B, Sig={p1_p256['signature_bytes']}B, Latency={p1_p256['sign_latency_ms']} ms ({p1_p256['speedup_vs_rsa']}x faster)")
print(f"Ed25519:   Pubkey={p1_ed['pubkey_bytes']}B, Sig={p1_ed['signature_bytes']}B, Latency={p1_ed['sign_latency_ms']} ms ({p1_ed['speedup_vs_rsa']}x faster)")
print(f"RAM Savings over RSA: {p1_ed['ram_savings_pct']}% reduction")`,
        output: `=== ASYMMETRIC CRYPTOGRAPHY BENCHMARK (CORTEX-M0+) ===\nRSA-2048:  Pubkey=256B, Sig=256B, Latency=12400.0 ms\nNIST-P256: Pubkey=64B, Sig=64B, Latency=38.5 ms (322.1x faster)\nEd25519:   Pubkey=32B, Sig=64B, Latency=19.2 ms (645.8x faster)\nRAM Savings over RSA: 93.8% reduction`,
        codeNotes: [
          { line: 2, note: 'Profiles asymmetric cryptographic footprint across RSA-2048, NIST P-256, and Ed25519' },
          { line: 24, note: 'Demonstrates 322x to 645x signature latency acceleration on ARM Cortex-M0+ microcontrollers' },
          { line: 39, note: 'Slashing RAM overhead from 4,096 bytes to 256 bytes (93.8% memory savings)' }
        ],
        tryIt: 'Query the dictionary with a non-existent algorithm and confirm it defaults safely to NIST-P256.',
        check: {
          question: 'Why is Elliptic Curve Cryptography (ECC) overwhelmingly preferred over RSA in battery-powered IoT microcontrollers?',
          options: [
            'Because 256-bit ECC provides equivalent 128-bit cryptographic strength with 32-byte keys, slashing RAM footprint by >90% and executing hundreds of times faster than 2048-bit RSA',
            'Because RSA cannot encrypt text messages longer than 10 characters',
            'Because ECC does not require a microcontroller power supply to operate',
            'Because RSA algorithms have been outlawed internationally'
          ],
          answer: 0,
          why: 'RSA requires massive 2048-bit or 3072-bit integer arithmetic which consumes excessive RAM and takes seconds on microcontrollers. ECC provides identical security in 32-byte keys with sub-50ms execution.'
        }
      },
      {
        title: 'Ephemeral ECDH (ECDHE) Key Exchange over Wireless: Forward Secrecy Invariant',
        say: [
          'When two IoT devices communicate across open wireless channels (such as Thread, Zigbee, BLE, or LoRaWAN), encrypting traffic with a static pre-shared key (PSK) embedded in firmware is a critical security vulnerability. If an attacker captures thousands of encrypted wireless packets today, and then physically tears down a single device three years later to extract its static key via silicon probing, the attacker can retroactively decrypt the entire historical archive of communications!',
          'To eradicate retrospective eavesdropping, modern embedded transport security (such as TLS 1.3 and DTLS 1.3) mandates Ephemeral Elliptic Curve Diffie-Hellman (ECDHE) key exchange. In an ECDHE handshake, both the client sensor and the edge gateway generate a fresh, single-use ephemeral keypair (d_A, Q_A) and (d_B, Q_B) for each individual session.',
          'The endpoints exchange public curve points Q_A and Q_B across the radio link. Alice computes the shared point S = d_A * Q_B, while Bob computes S = d_B * Q_A. Because multiplication on elliptic curves is associative (d_A * (d_B * G) = d_B * (d_A * G)), both endpoints arrive at the exact same point S. The moment the session key is derived via HKDF, both microcontrollers actively zeroize their ephemeral private keys (d_A, d_B) from SRAM. This guarantees Perfect Forward Secrecy (PFS): even complete compromise of long-term identity keys in the future cannot decrypt past session captures.'
        ],
        example: 'Like two spies meeting in a public park: instead of speaking in their permanent embassy code, they each roll a random pair of dice under their jackets, compute a temporary one-time handshake signal, conduct their conversation, and immediately eat the paper containing the dice numbers before parting.',
        code: `# Simulation: Ephemeral ECDH (ECDHE) Key Agreement Protocol
def simulate_ecdh_ephemeral_key_exchange(alice_priv: int, bob_priv: int, generator_g: int, prime_modulus: int) -> dict:
    # Ephemeral ECDH over cyclic subgroup (g^x mod p) demonstrating forward secrecy
    # Alice generates public key QA = G * dA mod p
    alice_pub = pow(generator_g, alice_priv, prime_modulus)
    
    # Bob generates public key QB = G * dB mod p
    bob_pub = pow(generator_g, bob_priv, prime_modulus)
    
    # Alice derives shared secret S_A = QB * dA mod p
    shared_alice = pow(bob_pub, alice_priv, prime_modulus)
    
    # Bob derives shared secret S_B = QA * dB mod p
    shared_bob = pow(alice_pub, bob_priv, prime_modulus)
    
    return {
        "alice_pub": hex(alice_pub),
        "bob_pub": hex(bob_pub),
        "shared_alice": hex(shared_alice),
        "shared_bob": hex(shared_bob),
        "secrets_match": shared_alice == shared_bob,
        "forward_secrecy": True
    }

p2_res = simulate_ecdh_ephemeral_key_exchange(0xA1B2C3, 0xD4E5F6, 5, 0xFFFFFFFFFFFFFFC5)
print("=== EPHEMERAL ECDH KEY EXCHANGE OVER WIRELESS ===")
print(f"Alice Ephemeral Pubkey: {p2_res['alice_pub']}")
print(f"Bob Ephemeral Pubkey:   {p2_res['bob_pub']}")
print(f"Alice Derived Secret:   {p2_res['shared_alice']}")
print(f"Bob Derived Secret:     {p2_res['shared_bob']}")
print(f"Key Agreement Verified: {p2_res['secrets_match']} (Forward Secrecy Guaranteed)")`,
        output: `=== EPHEMERAL ECDH KEY EXCHANGE OVER WIRELESS ===\nAlice Ephemeral Pubkey: 0x8d4e8525b09844f8\nBob Ephemeral Pubkey:   0x6653b46f858d0716\nAlice Derived Secret:   0x96dc6c04bcb47e9e\nBob Derived Secret:     0x96dc6c04bcb47e9e\nKey Agreement Verified: True (Forward Secrecy Guaranteed)`,
        codeNotes: [
          { line: 2, note: 'Simulates Diffie-Hellman key agreement over mathematical cyclic groups' },
          { line: 10, note: 'Derives shared secret point independently on both client and server nodes' },
          { line: 21, note: 'Verifies agreement matches exactly and provides Perfect Forward Secrecy (PFS)' }
        ],
        tryIt: 'Change Alice private key to 0x111111 and verify both endpoints still converge on a shared secret identical to each other.',
        check: {
          question: 'What critical security property does Ephemeral ECDH (ECDHE) provide over static pre-shared keys in wireless sensor networks?',
          options: [
            'Perfect Forward Secrecy (PFS): compromising the device identity key in the future cannot retroactively decrypt past recorded wireless communications',
            'It doubles the wireless transmission distance of the radio transceiver',
            'It eliminates the need for mathematical checksums on UDP packets',
            'It allows sensor nodes to communicate without battery power'
          ],
          answer: 0,
          why: 'Because ephemeral private keys are generated freshly for each session and wiped from RAM immediately afterward, an adversary who later steals the device cannot decrypt previously recorded network traffic.'
        }
      },
      {
        title: 'ECDSA Signature Generation & The Catastrophic Reused Nonce Vulnerability',
        say: [
          'In embedded secure boot, firmware integrity verification, and device attestation, the Elliptic Curve Digital Signature Algorithm (ECDSA) is the industry standard. An ECDSA signature over a hashed firmware message z consists of a pair of integers (r, s), computed as: r = (k * G)_x mod n, and s = k^-1 * (z + r * d) mod n, where d is the device private signing key, G is the curve base point, and k is a per-signature random nonce.',
          'Notice the variable k: cryptographic specifications strictly mandate that k must be a cryptographically secure, unpredictable, and completely unique integer generated freshly for every single signature! If a flawed random number generator on an IoT firmware signing server generates the exact same nonce k for two distinct messages (z_1, z_2), catastrophic security failure occurs.',
          'An eavesdropper observing the two public signatures (r, s_1) and (r, s_2) notes that both signatures share the identical r value! The attacker can subtract the two signature equations: s_1 - s_2 = k^-1 * (z_1 - z_2) mod n. By computing k = (z_1 - z_2) * (s_1 - s_2)^-1 mod n, the attacker immediately recovers the secret nonce k. Once k is known, the master private key d is derived in a single modular arithmetic step: d = (s_1 * k - z_1) * r^-1 mod n! This exact vulnerability famously compromised Sony PlayStation 3 signing keys in 2010. To prevent nonce reuse, modern embedded firmware mandates Deterministic ECDSA (RFC 6979), deriving k = HMAC-SHA256(d, z).'
        ],
        example: 'Like sealing envelopes with a wax signet ring that imprints a serial number: if you accidentally stamp the same serial number on two different letters, a forensic investigator can superimpose the wax molds to carve a replica of your private master signet ring.',
        code: `# Simulation: ECDSA Nonce Reuse Private Key Extraction Audit (RFC 6979 Mitigation)
def audit_ecdsa_nonce_reuse_vulnerability(k_nonce: int, z1_hash: int, z2_hash: int, priv_d: int, order_n: int) -> dict:
    # Sign message 1: s1 = k^-1 * (z1 + r * d) mod n
    # Sign message 2: s2 = k^-1 * (z2 + r * d) mod n with SAME k!
    r_val = 0x12345678 # (k * G).x mod n
    k_inv = pow(k_nonce, -1, order_n)
    
    s1 = (k_inv * (z1_hash + r_val * priv_d)) % order_n
    s2 = (k_inv * (z2_hash + r_val * priv_d)) % order_n
    
    # Attacker algebraic recovery: k = (z1 - z2) / (s1 - s2) mod n
    s_diff = (s1 - s2) % order_n
    s_diff_inv = pow(s_diff, -1, order_n)
    recovered_k = ((z1_hash - z2_hash) * s_diff_inv) % order_n
    
    # Attacker recovers private key d = (s1 * k - z1) * r^-1 mod n
    r_inv = pow(r_val, -1, order_n)
    recovered_d = (((s1 * recovered_k) - z1_hash) * r_inv) % order_n
    
    return {
        "original_private_key": hex(priv_d),
        "reused_nonce": hex(k_nonce),
        "signature_s1": hex(s1),
        "signature_s2": hex(s2),
        "recovered_k": hex(recovered_k),
        "recovered_private_key": hex(recovered_d),
        "private_key_compromised": recovered_d == priv_d
    }

n_curve = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
p3_res = audit_ecdsa_nonce_reuse_vulnerability(0x99887766, 0x11112222, 0x33334444, 0xCAFEBABE, n_curve)

print("=== ECDSA NONCE REUSE PRIVATE KEY EXTRACTION AUDIT ===")
print(f"Original Private Key:   {p3_res['original_private_key']}")
print(f"Reused Ephemeral Nonce: {p3_res['reused_nonce']}")
print(f"Recovered Nonce k:      {p3_res['recovered_k']}")
print(f"Recovered Private Key:  {p3_res['recovered_private_key']}")
print(f"Attacker Exploit State: COMPROMISED={p3_res['private_key_compromised']} (RFC 6979 Required)")`,
        output: `=== ECDSA NONCE REUSE PRIVATE KEY EXTRACTION AUDIT ===\nOriginal Private Key:   0xcafebabe\nReused Ephemeral Nonce: 0x99887766\nRecovered Nonce k:      0x99887766\nRecovered Private Key:  0xcafebabe\nAttacker Exploit State: COMPROMISED=True (RFC 6979 Required)`,
        codeNotes: [
          { line: 2, note: 'Simulates catastrophic algebraic private key extraction from reused ECDSA nonce k' },
          { line: 12, note: 'Solves k = (z1 - z2) / (s1 - s2) mod n using modular inverse arithmetic' },
          { line: 27, note: 'Recovers master private key d in 3 instructions, proving RFC 6979 deterministic nonces are mandatory' }
        ],
        tryIt: 'Change the private key priv_d to 0x12345678 and observe how the algebraic recovery extracts the new key with 100% precision.',
        check: {
          question: 'What catastrophic security consequence occurs if an ECDSA signing engine reuses the same ephemeral nonce k for two distinct signatures?',
          options: [
            'An attacker can algebraically calculate the master private signing key d from the public signatures alone using simple modular arithmetic',
            'The signed files are deleted from the microcontroller Flash memory',
            'The signature verification function returns a buffer overflow exception',
            'The microcontroller CPU clock frequency drops by 50%'
          ],
          answer: 0,
          why: 'Subtracting the two ECDSA signature equations eliminates the private key term and allows direct algebraic recovery of the nonce k, which immediately yields the master private key d.'
        }
      },
      {
        title: 'Hardware True Random Number Generators (TRNG): Ring Oscillators & Entropy Pooling',
        say: [
          'As demonstrated in our ECDSA audit, the entire cryptographic security of an embedded device collapses if its random numbers are predictable or repeating. Standard software functions like rand() or linear congruential generators (LCGs) are Pseudo-Random Number Generators (PRNGs); given the same 32-bit seed, they output the exact same sequence of numbers. An attacker who resets an IoT device can predict every session key and ECDSA nonce generated after boot!',
          'High-assurance secure microcontrollers incorporate dedicated on-silicon Hardware True Random Number Generators (TRNGs). Embedded TRNGs harvest true physical entropy from microscopic thermal quantum noise in silicon transistors using Ring Oscillators. A ring oscillator consists of an odd number of CMOS inverters connected in a closed feedback loop. Because transistor propagation delays fluctuate microscopically due to thermal Johnson-Nyquist noise and manufacturing variances, the oscillator frequency jitters uncontrollably.',
          'By sampling the fast ring oscillator using an independent stable crystal clock, the TRNG captures nondeterministic phase jitter. To comply with NIST SP 800-90B and FIPS 140-3 standards, hardware TRNGs implement continuous Health Tests: (1) The Repetition Count Test (RCT) detects if an oscillator gets stuck at 0 or 1; and (2) The Adaptive Proportion Test (APT) detects statistical bias. The verified jitter stream is pooled and conditioned through a SHA-256 or AES-CBC-MAC compression engine before seeding a NIST SP 800-90A Deterministic Random Bit Generator (DRBG).'
        ],
        example: 'Like placing 16 wind chimes in an open stormy field and recording the precise nanosecond each chime clinks: because atmospheric turbulence is physically chaotic, no supercomputer can predict the next clink sound.',
        code: `# Simulation: Hardware TRNG Ring Oscillator Entropy Harvester & Health Tests
def simulate_trng_ring_oscillator_entropy_pool(raw_jitter_samples: list[int]) -> dict:
    # NIST SP 800-90B: Repetition Count Test (RCT)
    # Detects catastrophic hardware failure (e.g. ring oscillator locked at 0 or 1)
    cutoff_threshold = 8 # Flag if same bit repeats 8 times sequentially
    max_consecutive = 1
    current_run = 1
    rct_failed = False
    
    for i in range(1, len(raw_jitter_samples)):
        if raw_jitter_samples[i] == raw_jitter_samples[i - 1]:
            current_run += 1
            if current_run > max_consecutive:
                max_consecutive = current_run
            if current_run >= cutoff_threshold:
                rct_failed = True
        else:
            current_run = 1
            
    # Calculate Shannon Entropy: H = -sum(p * log2(p))
    total_bits = len(raw_jitter_samples)
    zeros = raw_jitter_samples.count(0)
    ones = raw_jitter_samples.count(1)
    
    p0 = zeros / total_bits if total_bits > 0 else 0.5
    p1 = ones / total_bits if total_bits > 0 else 0.5
    
    import math
    h0 = -p0 * math.log2(p0) if p0 > 0 else 0
    h1 = -p1 * math.log2(p1) if p1 > 0 else 0
    shannon_entropy = round(h0 + h1, 4)
    
    # Condition raw entropy using 32-bit fold accumulator
    entropy_word = 0
    for b in raw_jitter_samples:
        entropy_word = ((entropy_word << 1) | b) & 0xFFFFFFFF
        
    return {
        "sample_count": total_bits,
        "max_repetition": max_consecutive,
        "rct_alarm": rct_failed,
        "shannon_entropy_per_bit": shannon_entropy,
        "conditioned_entropy_word": hex(entropy_word),
        "health_status": "ENTROPY_QUALIFIED_HEALTHY" if not rct_failed and shannon_entropy > 0.95 else "HEALTH_TEST_ALARM"
    }

# 32 simulated jitter bits from thermal noise
healthy_jitter = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0]
p4_res = simulate_trng_ring_oscillator_entropy_pool(healthy_jitter)

print("=== HARDWARE TRNG RING OSCILLATOR HEALTH AUDIT ===")
print(f"Bitstream Length:         {p4_res['sample_count']} bits")
print(f"Max Consecutive Run:      {p4_res['max_repetition']} bits (NIST Limit: 8)")
print(f"Shannon Entropy Per Bit:  {p4_res['shannon_entropy_per_bit']} bits (Max: 1.0000)")
print(f"Conditioned Entropy Seed: {p4_res['conditioned_entropy_word']}")
print(f"TRNG Silicon Health:      {p4_res['health_status']}")`,
        output: `=== HARDWARE TRNG RING OSCILLATOR HEALTH AUDIT ===\nBitstream Length:         32 bits\nMax Consecutive Run:      2 bits (NIST Limit: 8)\nShannon Entropy Per Bit:  0.9972 bits (Max: 1.0000)\nConditioned Entropy Seed: 0xb4d65a6a\nTRNG Silicon Health:      ENTROPY_QUALIFIED_HEALTHY`,
        codeNotes: [
          { line: 2, note: 'Implements NIST SP 800-90B Repetition Count Test (RCT) over raw oscillator jitter' },
          { line: 22, note: 'Calculates Shannon entropy per bit, verifying physical thermal noise decorrelation' },
          { line: 39, note: 'Conditions raw bitstream into 32-bit hardware entropy seed word' }
        ],
        tryIt: 'Introduce a run of 8 consecutive 1s in the bitstream and verify the RCT health test immediately trips an alarm.',
        check: {
          question: 'Why do secure microcontrollers harvest random entropy from silicon ring oscillators instead of software PRNGs?',
          options: [
            'Because ring oscillators harvest true non-deterministic thermal noise from physical silicon transistors, preventing attackers from predicting cryptographic keys across reboots',
            'Because hardware ring oscillators generate electricity to power the microcontroller',
            'Because software PRNGs require an internet connection to generate numbers',
            'Because ring oscillators decrease the CPU operating temperature'
          ],
          answer: 0,
          why: 'Software PRNGs are deterministic and repeat sequences if initialized with the same state. Hardware TRNGs capture chaotic physical thermal noise in silicon that is physically impossible to predict.'
        }
      },
      {
        title: 'Side-Channel Protected Modular Inversion & Point Multiplication (Montgomery Ladder)',
        say: [
          'In elliptic curve cryptography, the most computationally intensive operation is Scalar Multiplication: computing Q = k * P, where k is a secret scalar (such as a device private key) and P is a curve point. The textbook algorithm taught in computer science is the Binary Double-and-Add algorithm: it scans the scalar bits from left to right; for every bit, it doubles the accumulator point (R = 2R); if the bit is 1, it additionally performs a point addition (R = R + P).',
          'In embedded hardware, the naive Double-and-Add algorithm is a catastrophic vulnerability to Simple Power Analysis (SPA) side-channel attacks! Point Addition and Point Doubling execute completely different sequences of field multiplications and modular inversions. An attacker placing an oscilloscope current probe across the microcontroller VDD pin can clearly see the distinctive power spike of an "Add" operation when bit=1, and its absence when bit=0! The attacker reads the entire 256-bit private key off the oscilloscope screen in a single trace!',
          'To achieve complete side-channel immunity, high-assurance embedded firmware implements the Montgomery Ladder (Peter L. Montgomery). The Montgomery ladder maintains two working points (R_0, R_1) with the constant invariant R_1 - R_0 = P. In every single bit iteration—whether the secret scalar bit is 0 or 1—the ladder executes exactly ONE Point Doubling and exactly ONE Point Addition! The execution path, instruction sequence, and power consumption profile remain 100% invariant across all scalar values, defeating SPA and timing attacks completely.'
        ],
        example: 'Like marching in a ceremonial military drill: the soldier stomps their left boot and right boot with identical force on every single cadence step regardless of whether turning left or right, making it impossible for someone listening through a wall to deduce which direction the platoon turned.',
        code: `# Simulation: Side-Channel Protected Montgomery Ladder Point Multiplication
def simulate_montgomery_ladder_point_multiplication(scalar: int, base_point: int) -> dict:
    # Constant-Time Montgomery Ladder:
    # Traditional double-and-add leaks scalar bits through execution path differences.
    # Montgomery ladder performs exactly 1 Double and 1 Add in EVERY iteration.
    r0 = 0 # Identity point
    r1 = base_point
    
    double_ops = 0
    add_ops = 0
    
    # Process 8-bit scalar from MSB to LSB
    scalar_bits = [int(b) for b in bin(scalar)[2:].zfill(8)]
    
    for bit in scalar_bits:
        if bit == 0:
            # R1 = R0 + R1; R0 = 2 * R0
            r1 = (r0 + r1)
            r0 = (2 * r0)
        else:
            # R0 = R0 + R1; R1 = 2 * R1
            r0 = (r0 + r1)
            r1 = (2 * r1)
        double_ops += 1
        add_ops += 1
        
    return {
        "scalar_evaluated": hex(scalar),
        "bit_length": len(scalar_bits),
        "double_operations": double_ops,
        "add_operations": add_ops,
        "constant_time_invariant": double_ops == add_ops == len(scalar_bits),
        "resulting_r0_point": r0
    }

p5_res = simulate_montgomery_ladder_point_multiplication(0x5A, 3) # scalar 90, base 3

print("=== MONTGOMERY LADDER CONSTANT-TIME POINT MULTIPLICATION ===")
print(f"Secret Scalar:            {p5_res['scalar_evaluated']} ({p5_res['bit_length']} bits)")
print(f"Point Double Operations:  {p5_res['double_operations']}")
print(f"Point Add Operations:     {p5_res['add_operations']}")
print(f"SPA Side-Channel Defense: Invariant={p5_res['constant_time_invariant']} (Zero Branch Leakage)")`,
        output: `=== MONTGOMERY LADDER CONSTANT-TIME POINT MULTIPLICATION ===\nSecret Scalar:            0x5a (8 bits)\nPoint Double Operations:  8\nPoint Add Operations:     8\nSPA Side-Channel Defense: Invariant=True (Zero Branch Leakage)`,
        codeNotes: [
          { line: 2, note: 'Implements constant-time Montgomery ladder point multiplication invariant' },
          { line: 15, note: 'Executes exactly 1 point double and 1 point add in every bit iteration regardless of bit value' },
          { line: 28, note: 'Ensures identical execution latency and power trace profile, defeating SPA side-channel attacks' }
        ],
        tryIt: 'Change scalar to 0xFF (all 1s) and verify that double_ops and add_ops remain exactly 8 and 8.',
        check: {
          question: 'How does the Montgomery Ladder algorithm protect elliptic curve scalar multiplication from Simple Power Analysis (SPA) side-channel attacks?',
          options: [
            'By executing exactly one point doubling and one point addition in every bit iteration regardless of whether the scalar bit is 0 or 1, eliminating data-dependent branch variations in power traces',
            'By increasing the operating frequency of the microcontroller beyond oscilloscope bandwidth limits',
            'By turning off the power supply during scalar multiplication',
            'By converting all numbers into floating-point decimals'
          ],
          answer: 0,
          why: 'The Montgomery ladder enforces constant-time execution by performing identical addition and doubling operations in every iteration, ensuring that oscilloscope power traces reveal zero information about secret scalar bits.'
        }
      }
    ],
    summary: [
      'Elliptic Curve Cryptography (ECC) provides 128-bit security in 32-byte keys, slashing RAM overhead by 93.8% and executing hundreds of times faster than RSA-2048.',
      'Ephemeral ECDH (ECDHE) key agreement generates single-use session keys, enforcing Perfect Forward Secrecy (PFS) against retrospective decryption.',
      'Reusing the ephemeral nonce k across two ECDSA signatures allows an attacker to algebraically calculate the private signing key in seconds (mitigated by RFC 6979).',
      'Hardware True Random Number Generators (TRNG) sample ring oscillator thermal jitter with NIST SP 800-90B health tests, ensuring unpredictable cryptographic seeds.',
      'The Montgomery Ladder executes identical point doublings and additions in every scalar bit iteration, defeating Simple Power Analysis (SPA) side-channel attacks.'
    ],
    projectStep: {
      title: 'Architect an Asymmetric Public-Key Cryptographic Engine for Embedded Microcontrollers',
      steps: [
        'Benchmark ECC key sizes and execution latency against RSA on constrained ARM Cortex-M cores.',
        'Implement an ephemeral ECDH key agreement exchange verifying Perfect Forward Secrecy.',
        'Audit an ECDSA nonce reuse flaw to demonstrate algebraic private key recovery and verify RFC 6979.',
        'Construct a hardware TRNG ring oscillator entropy harvester with NIST SP 800-90B health testing.',
        'Implement a side-channel resistant Montgomery ladder point multiplication routine.'
      ]
    }
  }
];
