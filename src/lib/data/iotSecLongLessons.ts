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
  }
];
