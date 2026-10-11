# scripts/visuals/assemble_iot_security_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.iot_security_spec_m1 import DAYS_1_TO_15
from scripts.visuals.iot_security_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.iot_security_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.iot_security_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

out_path = repo_root / "scripts" / "visuals" / "iot-security-masterclass-spec.ts"

content = f"""// scripts/visuals/iot-security-masterclass-spec.ts
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

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const IOT_SECURITY_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const IOT_SECURITY_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(content)} chars)")
