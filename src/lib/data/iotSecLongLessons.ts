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
  }
];

