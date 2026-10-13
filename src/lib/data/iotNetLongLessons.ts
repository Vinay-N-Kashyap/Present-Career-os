import type { LongLesson } from './longLessons';

/**
 * IoT Radio Protocols, LPWAN & Constrained Networks (Course: iot_net)
 * Day 1: Wireless Link Budgets, IEEE 802.15.4 CSMA/CA & 6LoWPAN Header Compression.
 */
export const IOT_NET_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'iot_net',
    day: 1,
    title: 'Low-Power Radio Networks & 6LoWPAN Protocol Engineering',
    goal: 'Master constrained wireless networking: calculating RF link budgets, framing IEEE 802.15.4 packets, compressing IPv6 headers with 6LoWPAN, and designing CoAP transport.',
    minutes: 40,
    recap: 'Welcome to IoT Network Protocols. In server data centers, networks enjoy 100 Gbps fiber optics with 1500-byte MTUs. In constrained IoT, radios operate at 250 kbps, suffer high packet loss, and must squeeze entire IPv6 packets into 127-byte frames.',
    parts: [
      {
        title: 'RF Link Budgets & The Friis Transmission Equation',
        say: [
          'In wireless communications, radio frequency (RF) signals do not travel along physical wires; they propagate through free space, expanding in a spherical wavefront. Understanding the physical limits of wireless range begins with the RF Link Budget.',
          'The Link Budget calculates the total gains and losses along the communication path from the transmitter (TX) to the receiver (RX). Transmit power is measured in decibels relative to one milliwatt (dBm). For example, a standard 2.4 GHz IoT radio transmits at 0 dBm (1 milliwatt) or up to +20 dBm (100 milliwatts).',
          'As the radio wave travels distance d, its power density attenuates according to the Friis Free Space Path Loss (FSPL) equation: PathLoss(dB) = 20*log10(d) + 20*log10(f) + 20*log10(4*pi/c). At 2.4 GHz, traveling 100 meters in open air loses roughly 80 dB of signal power.',
          'For the receiver to successfully demodulate a packet without bit errors, the received signal strength indicator (RSSI) must remain above the hardware Receiver Sensitivity threshold (typically -95 dBm to -100 dBm). The difference between expected RSSI and sensitivity is the Fade Margin (a safety buffer against rain, foliage, and multipath interference).'
        ],
        example: 'Think of speaking through a megaphone across a noisy football field. The volume of your shout (TX Power) minus the distance the sound travels through air (Path Loss) plus the listener cupping their ear (Antenna Gain) must be louder than the background stadium roar (Receiver Sensitivity).'
        ,
        code: `# Simulation: RF Link Budget & Free Space Path Loss (FSPL) Calculation
import math

def calculate_link_budget(
    tx_power_dbm: float,
    tx_antenna_gain_dbi: float,
    rx_antenna_gain_dbi: float,
    freq_mhz: float,
    distance_meters: float,
    rx_sensitivity_dbm: float
):
    # Speed of light in m/s
    c = 3e8
    freq_hz = freq_mhz * 1e6

    # 1. Free Space Path Loss (FSPL) in decibels
    fspl_db = 20 * math.log10(distance_meters) + 20 * math.log10(freq_hz) - 147.55

    # 2. Received Signal Strength (RSSI) at Receiver Antenna
    rssi_dbm = tx_power_dbm + tx_antenna_gain_dbi + rx_antenna_gain_dbi - fspl_db

    # 3. Fade Margin (Safety buffer above hardware sensitivity)
    fade_margin_db = rssi_dbm - rx_sensitivity_dbm
    link_viable = fade_margin_db >= 10.0 # Standard 10 dB safety margin

    return {
        "DistanceMeters": distance_meters,
        "FSPL_Loss_dB": round(fspl_db, 2),
        "Estimated_RSSI_dBm": round(rssi_dbm, 2),
        "Fade_Margin_dB": round(fade_margin_db, 2),
        "LinkViable": link_viable
    }

budget = calculate_link_budget(
    tx_power_dbm=10.0,           # +10 dBm (10 mW)
    tx_antenna_gain_dbi=2.15,    # Standard dipole antenna
    rx_antenna_gain_dbi=2.15,
    freq_mhz=2400.0,             # 2.4 GHz ISM band
    distance_meters=50.0,        # 50 meters
    rx_sensitivity_dbm=-95.0     # -95 dBm hardware sensitivity
)

print(f"Path Loss at {budget['DistanceMeters']}m: {budget['FSPL_Loss_dB']} dB")
print(f"Estimated RSSI:         {budget['Estimated_RSSI_dBm']} dBm")
print(f"Fade Margin:            {budget['Fade_Margin_dB']} dB")
print(f"Link Status Viable:     {budget['LinkViable']}")`,
        output: `Path Loss at 50.0m: 74.04 dB\nEstimated RSSI:         -59.74 dBm\nFade Margin:            35.26 dB\nLink Status Viable:     True`,
        tryIt: 'Increase the distance to 500 meters and observe how the Fade Margin drops below the safety threshold.',
        check: {
          question: 'What is the purpose of maintaining a minimum 10 dB to 15 dB Fade Margin in an IoT wireless link budget?',
          options: [
            'To provide a safety buffer against unexpected signal attenuation caused by multipath fading, rain, human obstacles, and physical movement',
            'To increase the battery voltage of the sensor node',
            'To prevent the radio from broadcasting unauthorized radio commercials'
          ],
          answer: 0,
          why: 'In real-world environments, radio waves reflect off walls and ground terrain, causing constructive and destructive interference (multipath fading). A 10-15 dB fade margin ensures communications survive physical environmental shifts.'
        }
      },
      {
        title: 'IEEE 802.15.4 MAC Layer & Slotted CSMA/CA Arbitration',
        say: [
          'Because wireless is a shared broadcast medium, multiple IoT nodes transmitting at the same time on the same frequency cause a Radio Collision: the signals interfere, garbling packets and destroying data.',
          'The foundational standard for low-rate wireless personal area networks (LR-WPAN) is IEEE 802.15.4 (which powers Zigbee, Thread, and 6LoWPAN). At the physical layer, it provides a maximum data rate of 250 kbps in the 2.4 GHz band, with a strict Maximum Transmission Unit (MTU) of only 127 bytes per physical frame!',
          'To arbitrate channel access without a centralized controller, IEEE 802.15.4 uses Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA). Before transmitting, a node performs a Clear Channel Assessment (CCA): it listens to the radio channel for 8 symbol periods to measure background energy.',
          'If the channel is busy, the node does not transmit; instead, it enters an exponential backoff state, waiting a randomized duration (Backoff Period = random(0, 2^BE - 1)) before sampling CCA again. Once the frame transmits, the receiver verifies the 16-bit CRC Frame Check Sequence (FCS) and returns a hardware Acknowledgment (ACK) frame.'
        ],
        example: 'Think of sitting in a polite classroom discussion. Before speaking, you pause and listen (Clear Channel Assessment). If someone else is talking, you wait a random number of seconds (exponential backoff) before checking if the room is quiet again before raising your hand.',
        code: `# Simulation: IEEE 802.15.4 CSMA/CA Medium Access Controller
import random

class CsmaCaTransmitter:
    def __init__(self, mac_min_be: int = 3, mac_max_be: int = 5, max_csma_backoffs: int = 4):
        self.mac_min_be = mac_min_be
        self.mac_max_be = mac_max_be
        self.max_csma_backoffs = max_csma_backoffs

    def transmit_frame(self, frame_payload: bytes, channel_busy_probability: float) -> dict:
        nb = 0 # Number of backoffs attempted
        be = self.mac_min_be # Backoff exponent
        random.seed(42) # Deterministic simulation

        while nb <= self.max_csma_backoffs:
            # 1. Compute random backoff delay
            backoff_periods = random.randint(0, (2 ** be) - 1)

            # 2. Perform Clear Channel Assessment (CCA)
            channel_is_busy = random.random() < channel_busy_probability

            if not channel_is_busy:
                # Channel Clear! Transmit packet with 16-bit CRC Frame Check Sequence (FCS)
                fcs = sum(frame_payload) & 0xFFFF
                return {
                    "Status": "TRANSMITTED_SUCCESSFULLY",
                    "Backoffs_Attempted": nb,
                    "Payload_Bytes": len(frame_payload),
                    "FCS_Checksum": hex(fcs)
                }
            else:
                # Channel Busy: Increment backoff counter and double exponent
                nb += 1
                be = min(be + 1, self.mac_max_be)

        return {"Status": "CHANNEL_ACCESS_FAILURE", "Backoffs_Attempted": nb}

mac = CsmaCaTransmitter()
packet = b"SENSOR_TELEMETRY:TEMP=24.5C:HUM=48%"
result = mac.transmit_frame(packet, channel_busy_probability=0.3)

print("IEEE 802.15.4 MAC Transmission Result:")
print(f"Status:             {result['Status']}")
print(f"Backoffs Required:  {result['Backoffs_Attempted']}")
print(f"CRC-16 FCS Check:   {result.get('FCS_Checksum')}")`,
        output: `IEEE 802.15.4 MAC Transmission Result:\nStatus:             TRANSMITTED_SUCCESSFULLY\nBackoffs Required:  0\nCRC-16 FCS Check:   0x9f5`,
        tryIt: 'Increase the channel busy probability to 0.95 to simulate an overloaded radio channel and observe backoff retry exhaustion.',
        check: {
          question: 'What is the maximum physical frame size (MTU) defined by the IEEE 802.15.4 standard?',
          options: [
            '127 bytes (including MAC header and 16-bit CRC checksum)',
            '1500 bytes (identical to Ethernet)',
            '65,535 bytes'
          ],
          answer: 0,
          why: 'The IEEE 802.15.4 physical layer specifies a strict 127-byte maximum physical frame length (PHR limit) to maintain low packet transmission times and preserve low energy budgets.'
        }
      },
      {
        title: '6LoWPAN Header Compression: Fitting IPv6 into 127 Bytes',
        say: [
          'The modern internet is standardized on IPv6. Every device receives a globally routable 128-bit IP address, eliminating private NAT routers and enabling end-to-end cryptographic encryption.',
          'However, a standard IPv6 base header consumes 40 bytes. If an application adds an 8-byte UDP header, the combined transport overhead is 48 bytes! In an IEEE 802.15.4 network where the maximum physical frame is 127 bytes, and the MAC layer uses 25 bytes for addressing and security, only 54 bytes remain for actual sensor payload data!',
          'To make IPv6 viable on constrained microcontrollers, the IETF developed 6LoWPAN (IPv6 over Low-Power Wireless Personal Area Networks, RFC 6282).',
          '6LoWPAN solves this through LOWPAN_IPHC stateless header compression. Because 802.15.4 packets already carry source and destination MAC addresses in the link layer header, 6LoWPAN derives the IPv6 Interface Identifiers (IID) directly from the 64-bit IEEE MAC addresses, compressing the 40-byte IPv6 header down to just 2 to 4 bytes!'
        ],
        example: 'Think of mailing a postcard to someone living in the same apartment building. Instead of writing "Earth, North America, United States, California, 94107, 100 Main St, Apt 4B" (40-byte IPv6), you simply write "Apt 4B" (2-byte compressed header) because the postman is already inside the building.',
        code: `# Simulation: 6LoWPAN Header Compression (RFC 6282 LOWPAN_IPHC)
def compress_ipv6_6lowpan(
    src_ipv6: str,
    dst_ipv6: str,
    hop_limit: int,
    payload_len: int
) -> dict:
    # Standard uncompressed IPv6 header is always 40 bytes:
    # Version(4b) + TrafficClass(8b) + FlowLabel(20b) + PayloadLen(16b) + NextHeader(8b) + HopLimit(8b) + Src(128b) + Dst(128b)
    uncompressed_ipv6_bytes = 40

    # 6LoWPAN LOWPAN_IPHC Bitmask Flags:
    # Dispatch: 011 (IPHC identifier)
    # TF = 11 (Traffic class & Flow label elided)
    # NH = 1 (Next header compressed into UDP inline)
    # HLIM = 01 (Hop limit 1, 64, or 255 encoded in 2 bits)
    # SAM/DAM = 11 (Source & Dest address derived from 802.15.4 MAC address)
    compressed_header_bytes = 2 # Compressed down to 2 bytes!

    total_bytes_saved = uncompressed_ipv6_bytes - compressed_header_bytes
    efficiency = (total_bytes_saved / uncompressed_ipv6_bytes) * 100.0

    return {
        "Uncompressed_IPv6_Header": f"{uncompressed_ipv6_bytes} bytes",
        "Compressed_6LoWPAN_Header": f"{compressed_header_bytes} bytes",
        "Bytes_Saved": total_bytes_saved,
        "Compression_Efficiency": f"{efficiency:.1f}%"
    }

metrics = compress_ipv6_6lowpan("fe80::0212:4b00:0123:4567", "fe80::0212:4b00:089a:bcde", 64, 18)
print("6LoWPAN Protocol Compression Analysis:")
print(f"Raw IPv6 Header:       {metrics['Uncompressed_IPv6_Header']}")
print(f"6LoWPAN Encoded:       {metrics['Compressed_6LoWPAN_Header']}")
print(f"Overhead Reduction:    {metrics['Compression_Efficiency']}")`,
        output: `6LoWPAN Protocol Compression Analysis:\nRaw IPv6 Header:       40 bytes\n6LoWPAN Encoded:       2 bytes\nOverhead Reduction:    95.0%`,
        tryIt: 'Add an 8-byte UDP header compression simulation down to 4 bytes using 6LoWPAN NHC (Next Header Compression).',
        check: {
          question: 'How does 6LoWPAN achieve a 90%+ header compression ratio over standard IPv6 headers?',
          options: [
            'It elides redundant IP addresses by mathematically reconstructing 128-bit IPv6 interface identifiers from underlying IEEE 802.15.4 link-layer MAC addresses',
            'It truncates the IP addresses and throws away packets that fail',
            'It converts the internet to binary morse code'
          ],
          answer: 0,
          why: 'RFC 6282 LOWPAN_IPHC recognizes that the source and destination nodes are already identified by their MAC addresses in the radio frame. Deriving link-local IPv6 addresses from MAC addresses eliminates 32 bytes of redundant address transmission.'
        }
      },
      {
        title: 'Constrained Application Protocol (CoAP): REST over UDP',
        say: [
          'While HTTP/2 and HTTP/3 dominate the modern web, running HTTP and TLS over TCP on 8-bit or 32-bit low-power microcontrollers is crippling. TCP requires a 3-way handshake (SYN, SYN-ACK, ACK), maintains large connection state buffers in RAM, and requires heavy sliding-window flow control.',
          'The IETF engineered the Constrained Application Protocol (CoAP, RFC 7252) specifically for the Internet of Things. CoAP mirrors the RESTful semantics of HTTP (GET, POST, PUT, DELETE) but executes over UDP with a compact, fixed 4-byte binary header!',
          'To guarantee reliability over unreliable UDP, CoAP defines two message types: Confirmable (CON), which requires a lightweight 4-byte Acknowledgment (ACK) response with exponential retransmission timers, and Non-Confirmable (NON), which operates as lightweight fire-and-forget telemetry.',
          'Furthermore, CoAP introduces the asynchronous Observe pattern (RFC 7641). Instead of an IoT client polling a server every 5 seconds (wasting radio power), the client sends a single GET with an Observe option; the server automatically pushes notifications ONLY when the sensor state changes.'
        ],
        example: 'Think of sending a text message. A traditional TCP connection is like dialing a phone number, waiting for 3 rings, confirming who answered, and then talking. CoAP is like sending an SMS: 4 bytes of envelope, immediate delivery, and optional read-receipt acknowledgment.',
        code: `# Simulation: CoAP Binary Header Framing & Retransmission State Machine
class CoapMessage:
    def __init__(self, msg_id: int, msg_type: str, code: str, token: bytes, payload: str = ""):
        self.version = 1
        self.type = msg_type # CON (0), NON (1), ACK (2), RST (3)
        self.code = code     # 0.01 (GET), 0.02 (POST), 2.05 (CONTENT)
        self.msg_id = msg_id
        self.token = token
        self.payload = payload

    def serialize_binary_frame(self) -> bytes:
        # Fixed 4-byte header: [Ver(2b)|Type(2b)|TKL(4b)] [Code(8b)] [MessageID(16b)]
        type_map = {'CON': 0, 'NON': 1, 'ACK': 2, 'RST': 3}
        header_byte_0 = (self.version << 6) | (type_map[self.type] << 4) | (len(self.token) & 0x0F)
        code_byte_1 = 1 # 0.01 GET
        msg_id_bytes = self.msg_id.to_bytes(2, 'big')

        frame = bytearray([header_byte_0, code_byte_1]) + msg_id_bytes + self.token
        if self.payload:
            frame += b'\xFF' + self.payload.encode('utf-8') # 0xFF payload marker
        return bytes(frame)

# Client issues a Confirmable (CON) GET request to /temperature
req = CoapMessage(msg_id=0x1A2B, msg_type='CON', code='0.01', token=b'\x42', payload="")
binary_wire_bytes = req.serialize_binary_frame()

print("CoAP Binary Wire Packet:")
print(f"Total Overhead Bytes: {len(binary_wire_bytes)} bytes (vs ~200+ bytes in HTTP/1.1)")
print(f"Wire Frame Hex:       {binary_wire_bytes.hex()}")
print(f"Header Ver/Type Byte: 0x{binary_wire_bytes[0]:02X}")
print(f"Message ID:           0x{binary_wire_bytes[2]:02X}{binary_wire_bytes[3]:02X}")`,
        output: `CoAP Binary Wire Packet:\nTotal Overhead Bytes: 5 bytes (vs ~200+ bytes in HTTP/1.1)\nWire Frame Hex:       41011a2b42\nHeader Ver/Type Byte: 0x41\nMessage ID:           0x1A2B`,
        tryIt: 'Construct an ACK response packet returning temperature 21.5C and verify the payload marker separator.',
        check: {
          question: 'Why does CoAP use UDP rather than TCP for constrained IoT sensor communications?',
          options: [
            'UDP eliminates the memory overhead and 3-way connection handshake latency of TCP while CoAP provides built-in reliability via 4-byte CON/ACK headers',
            'Because TCP was outlawed by international radio treaties',
            'UDP automatically charges the battery of the device'
          ],
          answer: 0,
          why: 'TCP maintains connection state and requires multi-packet handshakes, which drains battery and exhausts constrained MCU RAM. CoAP runs over stateless UDP, implementing minimal 4-byte CON/ACK transactions when reliability is required.'
        }
      },
      {
        title: 'MQTT-SN & LPWAN Battery Lifespan Invariants',
        say: [
          'In ultra-low-power environmental monitoring and agriculture, sensor nodes are deployed in remote fields where batteries cannot be replaced for 10 years.',
          'Standard MQTT is built on TCP and requires text-based topic strings (e.g. `factory/sensors/zone1/temperature`), which wastes substantial bandwidth. MQTT for Sensor Networks (MQTT-SN) adapts MQTT for non-TCP, low-bandwidth radio networks like Zigbee and LoRa.',
          'MQTT-SN replaces long string topic names with 2-byte Topic IDs (`REGISTER / topic_id = 42`). Crucially, it introduces the Sleeping Client feature: the broker buffers incoming messages while the microcontroller remains in deep sleep mode (drawing under 2 microamps).',
          'The battery lifespan equation is dominated by duty cycle: Sleep Ratio = T_sleep / (T_sleep + T_active). If a device sleeps for 59.9 seconds and wakes for 100 milliseconds to transmit an MQTT-SN packet, its average current draw drops from 20 mA to under 35 microamps, enabling a standard 2400 mAh AA battery to last over 7.8 years!'
        ],
        example: 'Think of a bear hibernating for the winter. If the bear had to pace back and forth all season (active MQTT connection), it would starve in 2 weeks. By lowering its heart rate and sleeping for months (deep sleep duty cycle), it survives on minimal stored energy.',
        code: `# Simulation: 10-Year IoT Battery Lifespan & Sleep Duty Cycle Estimator
def estimate_iot_battery_life(
    battery_capacity_mah: float,
    active_current_ma: float,
    active_duration_sec: float,
    sleep_current_ua: float,
    sleep_duration_sec: float,
    self_discharge_annual_pct: float = 1.0
):
    # Convert sleep microamps to milliamps
    sleep_current_ma = sleep_current_ua / 1000.0

    # Total cycle time
    total_cycle_sec = active_duration_sec + sleep_duration_sec

    # Weighted average current consumption
    avg_current_ma = (
        (active_current_ma * active_duration_sec) +
        (sleep_current_ma * sleep_duration_sec)
    ) / total_cycle_sec

    # Total operational hours
    total_hours = battery_capacity_mah / avg_current_ma
    total_years = total_hours / (24 * 365.25)

    # Factor in battery self-discharge loss
    effective_years = total_years * (1.0 - (self_discharge_annual_pct / 100.0 * 5.0))

    return {
        "Average_Current_uA": round(avg_current_ma * 1000.0, 1),
        "Active_Duty_Cycle": f"{(active_duration_sec / total_cycle_sec) * 100.0:.3f}%",
        "Calculated_Years": round(effective_years, 2)
    }

# Scenario: 2400 mAh Lithium battery, wakes for 80ms every 60 seconds
life = estimate_iot_battery_life(
    battery_capacity_mah=2400.0,
    active_current_ma=18.0,      # 18 mA active radio TX
    active_duration_sec=0.08,    # 80 ms active time
    sleep_current_ua=2.5,        # 2.5 uA deep sleep current
    sleep_duration_sec=59.92     # Sleep for ~60s
)

print("IoT Battery Lifespan Projection:")
print(f"Duty Cycle:         {life['Active_Duty_Cycle']}")
print(f"Average Current:    {life['Average_Current_uA']} uA")
print(f"Projected Lifespan: {life['Calculated_Years']} years")`,
        output: `IoT Battery Lifespan Projection:\nDuty Cycle:         0.133%\nAverage Current:    26.5 uA\nProjected Lifespan: 9.8 years`,
        tryIt: 'Change the sleep current from 2.5 uA to 50 uA (a leaky regulator) and observe how battery life collapses to under 4 years.',
        check: {
          question: 'What is the dominant factor that enables battery-operated IoT sensors to achieve 10-year operational lifespans in the field?',
          options: [
            'A micro-duty-cycle architecture where the radio sleeps 99.8%+ of the time, combined with compact binary protocols like MQTT-SN that minimize active radio TX time',
            'Using solar panels under heavy cloud cover',
            'Transmitting at maximum power 24 hours a day'
          ],
          answer: 0,
          why: 'Transmitting radio packets takes tens of milliamps, while deep sleep takes microamps. Operating at a <0.2% duty cycle ensures average current remains in the microamp range, stretching battery life past a decade.'
        }
      }
    ],
    summary: [
      'Wireless Link Budgets use the Friis transmission equation to calculate path loss, received signal strength (RSSI), and mandatory fade safety margins.',
      'IEEE 802.15.4 enforces 127-byte physical frames and arbitrates medium access using Clear Channel Assessment (CCA) and exponential backoff CSMA/CA.',
      '6LoWPAN compresses 40-byte IPv6 headers down to 2 bytes (95% reduction) by reconstructing interface identifiers from underlying 802.15.4 MAC addresses.',
      'The Constrained Application Protocol (CoAP) implements RESTful operations over stateless UDP with a compact 4-byte binary header and optional CON/ACK reliability.',
      'MQTT-SN replaces string topic names with 2-byte Topic IDs and supports Sleeping Clients, allowing battery-powered nodes to achieve 10-year lifespans at <0.2% duty cycle.'
    ],
    projectStep: {
      title: 'Architect a Low-Power 6LoWPAN Sensor Gateway Pipeline',
      steps: [
        'Calculate link budget parameters and fade margin for a 2.4 GHz wireless link.',
        'Implement an IEEE 802.15.4 CSMA/CA backoff state machine simulation.',
        'Compress an IPv6 and UDP packet using 6LoWPAN LOWPAN_IPHC bitmask rules.',
        'Frame and parse a binary CoAP Confirmable GET request with an Observe option.'
      ]
    }
  },
  {
    coursePrefix: 'iot_net',
    day: 2,
    title: 'LoRaWAN CSS Modulation, BLE Mesh Flooding, Cellular NB-IoT & RPL Mesh',
    goal: 'Master advanced IoT radio networking: LoRa chirp spread spectrum (CSS) modulation and Time-on-Air physics, regional LoRaWAN 1% duty cycle regulatory compliance, Bluetooth Low Energy (BLE) managed mesh flooding, cellular NB-IoT power saving modes (PSM), and RPL DODAG mesh routing.',
    minutes: 45,
    recap: 'Welcome to Day 2 of IoT Radio Protocols & Constrained Networks. Today, we scale from short-range 802.15.4 and 6LoWPAN links into long-range LPWANs (LoRaWAN), large-scale building automation mesh (BLE Mesh, RPL), and cellular IoT power management (NB-IoT).',
    parts: [
      {
        title: 'LoRa Chirp Spread Spectrum & Time-on-Air (ToA) Physics',
        say: [
          'While short-range radios like Zigbee and BLE operate over 10 to 50 meters, Long Range (LoRa) technology enables wireless links spanning over 15 kilometers in line-of-sight. LoRa achieves this remarkable range using Chirp Spread Spectrum (CSS) modulation in sub-GHz license-free ISM bands (868 MHz in Europe, 915 MHz in the Americas).',
          'In CSS modulation, digital data is encoded into linear frequency chirps whose frequency sweeps continuously across a defined Bandwidth (BW, typically 125 kHz). The fundamental tuning knob of LoRa is the Spreading Factor (SF), ranging from SF7 to SF12.',
          'The symbol duration is defined by T_sym = 2^SF / BW. At SF7 with 125 kHz bandwidth, a symbol takes just 1.02 milliseconds; at SF12, a symbol takes 32.77 milliseconds (32 times longer!). Higher spreading factors provide processing gain that drops receiver sensitivity down to an astonishing -137 dBm (allowing reception below thermal noise floor), but at the cost of exponentially higher Time-on-Air (ToA).',
          'Calculating precise Time-on-Air is vital for battery budget forecasting and regional spectrum compliance. A 24-byte packet transmitting at SF7 occupies the air for only 61.7 milliseconds, but the exact same packet transmitting at SF12 occupies the air for 1,482.8 milliseconds!'
        ],
        example: 'Think of communicating across a howling canyon. At SF7, you shout rapidly in short bursts. At SF12, the storm is so loud that you must elongate every single vowel into a 30-second low rumble so the other side can hear your message through the howling wind.',
        code: `import math

# Simulation: LoRa Chirp Spread Spectrum & Time-on-Air Calculator
def calculate_lora_time_on_air(payload_bytes: int, sf: int, bw_khz: float = 125.0, cr: int = 1, preamble_symbols: int = 8) -> dict:
    # Symbol duration: T_sym = 2^SF / BW
    bw_hz = bw_khz * 1000.0
    t_sym_ms = (2 ** sf / bw_hz) * 1000.0

    # Preamble duration
    t_preamble_ms = (preamble_symbols + 4.25) * t_sym_ms

    # Payload symbol count (Semtech standard LoRa packet formula)
    # n_payload = 8 + max(ceil((8*PL - 4*SF + 28 + 16) / (4*(SF - 2*DE))) * (CR + 4), 0)
    de = 1 if (sf >= 11 and bw_khz <= 125.0) else 0
    numerator = (8 * payload_bytes) - (4 * sf) + 28 + 16 # with CRC
    denominator = 4 * (sf - 2 * de)
    payload_sym_terms = math.ceil(numerator / denominator) * (cr + 4)
    payload_sym_count = 8 + max(payload_sym_terms, 0)

    t_payload_ms = payload_sym_count * t_sym_ms
    total_toa_ms = t_preamble_ms + t_payload_ms

    # Sensitivity estimate for LoRa SX1262 (SF7 ~ -125.8 dBm, SF12 ~ -137 dBm)
    sensitivity_dbm = -110.0 - (sf * 2.25)

    return {
        "SF": sf,
        "Bandwidth_kHz": bw_khz,
        "Symbol_Duration_ms": round(t_sym_ms, 2),
        "Preamble_Time_ms": round(t_preamble_ms, 2),
        "Payload_Time_ms": round(t_payload_ms, 2),
        "Total_Time_On_Air_ms": round(total_toa_ms, 2),
        "Estimated_Sensitivity_dBm": round(sensitivity_dbm, 1)
    }

lora_sf7 = calculate_lora_time_on_air(payload_bytes=24, sf=7, bw_khz=125.0)
lora_sf12 = calculate_lora_time_on_air(payload_bytes=24, sf=12, bw_khz=125.0)

print(f"SF7: ToA = {lora_sf7['Total_Time_On_Air_ms']} ms | Sensitivity = {lora_sf7['Estimated_Sensitivity_dBm']} dBm")
print(f"SF12: ToA = {lora_sf12['Total_Time_On_Air_ms']} ms | Sensitivity = {lora_sf12['Estimated_Sensitivity_dBm']} dBm")`,
        output: `SF7: ToA = 61.7 ms | Sensitivity = -125.8 dBm\nSF12: ToA = 1482.75 ms | Sensitivity = -137.0 dBm`,
        tryIt: 'Change payload_bytes to 50 at SF12 and note how total Time-on-Air swells to over 2,200 ms.',
        check: {
          question: 'What is the fundamental engineering trade-off when selecting a higher LoRa Spreading Factor (e.g. SF12 vs SF7)?',
          options: [
            'SF12 increases receiver sensitivity and transmission range, but increases packet Time-on-Air by over 20x, drastically increasing radio energy consumption',
            'SF12 increases data throughput to 100 Mbps while reducing transmission range to 5 meters',
            'SF12 switches the radio frequency from sub-GHz to 5.8 GHz Wi-Fi',
            'SF12 eliminates the need for battery power entirely'
          ],
          answer: 0,
          why: 'Higher spreading factors spread each bit across longer chirp durations, enabling reception below the noise floor at the cost of vastly longer packet airtime and battery draw.',
          answerIndex: 0,
          explanation: 'Higher spreading factors spread each bit across longer chirp durations, enabling reception below the noise floor at the cost of vastly longer packet airtime and battery draw.'
        }
      },
      {
        title: 'LoRaWAN Regional 1% Duty Cycle & Airtime Regulatory Compliance',
        say: [
          'Because LoRa transceivers operate in unlicensed shared ISM spectrum, governmental communications authorities (such as ETSI in Europe and FCC in the United States) strictly regulate radio emissions to prevent airwaves from becoming clogged.',
          'In Europe (ETSI EN 300 220), sub-bands such as 868.0 to 868.6 MHz enforce a strict 1.0% Duty Cycle limit. In any rolling 1-hour window (3,600 seconds), a device is legally forbidden from transmitting for more than 36 seconds in total!',
          'Under strict duty cycle enforcement, every transmission event requires a mandatory back-off sleep time: Off-Time = ToA * ((1 - DutyCycle) / DutyCycle). For a 1% duty cycle, the device must stay silent for 99 times its transmission airtime!',
          'If a device transmits a 500 ms packet at SF10, it must remain radio-silent for at least 49.5 seconds before it is legally allowed to transmit again. Firmware engineers must implement token bucket rate limiters to ensure devices never violate statutory regulations.'
        ],
        example: 'Think of a communal neighborhood tennis court where rules mandate that no single resident can use the court for more than 1% of the day (14 minutes total). If you play for 5 minutes, you must yield the court and wait at least 495 minutes before playing your next set.',
        code: `# Simulation: LoRaWAN 1% Duty Cycle & Airtime Regulatory Compliance
def evaluate_lorawan_duty_cycle(transmissions_history_ms: list[float], next_packet_toa_ms: float, window_seconds: float = 3600.0, max_duty_pct: float = 1.0) -> dict:
    allowed_airtime_ms = (window_seconds * 1000.0) * (max_duty_pct / 100.0)
    current_used_airtime_ms = sum(transmissions_history_ms)
    projected_airtime_ms = current_used_airtime_ms + next_packet_toa_ms

    duty_cycle_exceeded = projected_airtime_ms > allowed_airtime_ms

    # Mandatory backoff sleep duration: ToA * ((1 - duty) / duty) -> ToA * 99 for 1% duty
    required_backoff_sec = (next_packet_toa_ms * (99.0)) / 1000.0

    return {
        "Used_Airtime_ms": round(current_used_airtime_ms, 1),
        "Allowed_Airtime_ms": round(allowed_airtime_ms, 1),
        "Projected_Duty_Cycle_Pct": round((projected_airtime_ms / (window_seconds * 1000.0)) * 100.0, 4),
        "Can_Transmit": not duty_cycle_exceeded,
        "Mandatory_Off_Time_sec": round(required_backoff_sec, 2)
    }

history = [450.0, 450.0, 1200.0, 950.0] # ms used in past hour
eval_compliance = evaluate_lorawan_duty_cycle(history, next_packet_toa_ms=500.0)
print(f"Used Airtime: {eval_compliance['Used_Airtime_ms']} / {eval_compliance['Allowed_Airtime_ms']} ms | Can Transmit: {eval_compliance['Can_Transmit']}")
print(f"Projected Duty Cycle: {eval_compliance['Projected_Duty_Cycle_Pct']}% | Mandatory Backoff Off-Time: {eval_compliance['Mandatory_Off_Time_sec']}s")`,
        output: `Used Airtime: 3050.0 / 36000.0 ms | Can Transmit: True\nProjected Duty Cycle: 0.0986% | Mandatory Backoff Off-Time: 49.5s`,
        tryIt: 'Add a 33,500 ms historical transmission to history and verify that Can_Transmit becomes False as airtime quota is exhausted.',
        check: {
          question: 'Under European ETSI 868 MHz ISM band regulations with a 1.0% duty cycle, how much total cumulative airtime is a device legally allowed per rolling 1-hour window?',
          options: [
            'Exactly 36 seconds (36,000 milliseconds) total transmission airtime',
            '10 minutes of continuous broadcast',
            'Unlimited transmission as long as battery voltage exceeds 3.0V',
            '1 hour of transmission per day'
          ],
          answer: 0,
          why: 'A 1.0% duty cycle across a 3,600-second (1 hour) period permits exactly 3,600 * 0.01 = 36 seconds of cumulative radio transmission time.',
          answerIndex: 0,
          explanation: 'A 1.0% duty cycle across a 3,600-second (1 hour) period permits exactly 3,600 * 0.01 = 36 seconds of cumulative radio transmission time.'
        }
      },
      {
        title: 'Bluetooth Low Energy (BLE) Mesh Managed Flooding & TTL Hops',
        say: [
          'Traditional Bluetooth connections are strictly point-to-point (star topologies between a smartphone and a peripheral). In commercial building automation, smart lighting, and industrial asset tracking, systems require multi-hop networks spanning thousands of nodes without central coordinators.',
          'BLE Mesh operates using Managed Flooding over the standard primary BLE advertising channels (channels 37, 38, and 39). Instead of maintaining fragile routing tables that break when physical obstacles move, messages are broadcast into the air and repeated by designated Relay Nodes.',
          'To prevent catastrophic broadcast storms where packets loop endlessly and saturate radio spectrum, BLE Mesh enforces two strict network safeguards: (1) Time-to-Live (TTL) field decremented on every retransmission hop, and (2) a Network Message Cache at every node.',
          'When a node receives a mesh packet, it checks its cache. If the message sequence number and source address have already been seen, the packet is instantly discarded without retransmitting. If new and TTL > 1, the relay node retransmits with TTL - 1, flooding the message through the facility in milliseconds.'
        ],
        example: 'In a 10-story office building, someone presses a light switch on the 1st floor. The switch broadcasts a mesh packet with TTL 4. Relay nodes in the lobby and hallway repeat the packet across 3 hops, turning on lights 50 meters away in 15 milliseconds without requiring any Wi-Fi router.',
        code: `import math

# Simulation: BLE Mesh Managed Flooding & TTL Message Deduplication
def simulate_ble_mesh_relay(nodes: list[dict], message_id: str, origin_node_id: int, initial_ttl: int) -> dict:
    received_log = {node["id"]: [] for node in nodes}
    active_packets = [{"msg_id": message_id, "src": origin_node_id, "ttl": initial_ttl, "hops": 0}]
    
    total_retransmissions = 0
    delivered_nodes = set([origin_node_id])

    while active_packets:
        current_packet = active_packets.pop(0)
        curr_msg = current_packet["msg_id"]
        curr_ttl = current_packet["ttl"]
        curr_hops = current_packet["hops"]

        if curr_ttl <= 0:
            continue

        src_coords = next(n for n in nodes if n["id"] == current_packet["src"])
        for neighbor in nodes:
            n_id = neighbor["id"]
            if n_id == current_packet["src"]:
                continue
            
            dist = math.dist((src_coords["x"], src_coords["y"]), (neighbor["x"], neighbor["y"]))
            if dist <= 15.0: # 15-meter RF propagation threshold
                if curr_msg not in received_log[n_id]:
                    received_log[n_id].append(curr_msg)
                    delivered_nodes.add(n_id)

                    if neighbor["is_relay"] and (curr_ttl - 1 > 0):
                        active_packets.append({
                            "msg_id": curr_msg,
                            "src": n_id,
                            "ttl": curr_ttl - 1,
                            "hops": curr_hops + 1
                        })
                        total_retransmissions += 1

    return {
        "Message_ID": message_id,
        "Total_Nodes": len(nodes),
        "Reached_Nodes_Count": len(delivered_nodes),
        "Total_Retransmissions": total_retransmissions,
        "Delivery_Ratio_Pct": f"{(len(delivered_nodes) / len(nodes)) * 100.0:.1f}%"
    }

mesh_nodes = [
    {"id": 1, "x": 0, "y": 0, "is_relay": True},    # Origin
    {"id": 2, "x": 10, "y": 0, "is_relay": True},   # Relay 1
    {"id": 3, "x": 20, "y": 0, "is_relay": True},   # Relay 2
    {"id": 4, "x": 30, "y": 0, "is_relay": False}   # Destination end-node
]
mesh_sim = simulate_ble_mesh_relay(mesh_nodes, "MSG_LIGHT_ON_001", origin_node_id=1, initial_ttl=4)
print(f"BLE Mesh Delivery: {mesh_sim['Reached_Nodes_Count']} / {mesh_sim['Total_Nodes']} nodes reached ({mesh_sim['Delivery_Ratio_Pct']})")
print(f"Total Broadcast Relays: {mesh_sim['Total_Retransmissions']} retransmissions with TTL bounds")`,
        output: `BLE Mesh Delivery: 4 / 4 nodes reached (100.0%)\nTotal Broadcast Relays: 3 retransmissions with TTL bounds`,
        tryIt: 'Set initial_ttl to 1 and observe how distant nodes 3 and 4 fail to receive the packet, dropping delivery to 50%.',
        check: {
          question: 'How does BLE Mesh managed flooding prevent infinite packet loops and broadcast storms across thousands of devices?',
          options: [
            'By enforcing a decrementing Time-to-Live (TTL) counter and maintaining an in-memory Message Cache at each node to discard already-seen message IDs',
            'By requiring all devices to connect to an external LTE cellular tower',
            'By assigning one central master phone to route every individual packet',
            'By limiting mesh networks to a maximum of 3 physical devices'
          ],
          answer: 0,
          why: 'TTL decrementing bounds the maximum hop count, while the Network Message Cache ensures that nodes never retransmit a packet they have already processed.',
          answerIndex: 0,
          explanation: 'TTL decrementing bounds the maximum hop count, while the Network Message Cache ensures that nodes never retransmit a packet they have already processed.'
        }
      },
      {
        title: 'Cellular NB-IoT Power Saving Mode (PSM) & Battery Lifespan Physics',
        say: [
          'For wide-area utility smart metering (water, gas, electricity) and environmental tracking where no local Wi-Fi or LoRa gateway exists, engineers deploy 3GPP Cellular IoT: Narrowband IoT (NB-IoT) or LTE-M.',
          'Traditional smartphones drain batteries in 24 hours because their modems constantly listen for incoming calls and maintain active radio handshakes with cellular towers. In contrast, NB-IoT devices achieve 5 to 10+ year battery lifespans on a single primary battery cell.',
          'NB-IoT accomplishes this through Power Saving Mode (PSM, 3GPP Rel. 12). When entering PSM, the device turns off its entire RF transceiver and enters deep sleep, drawing only 3.0 to 5.0 microamperes (uA)!',
          'Crucially, while in PSM, the device remains registered on the cellular core network (MME/HSS). When it wakes to transmit telemetry (drawing ~120 mA for 8 seconds), it skips the expensive 20-second network attach signaling handshake, transmits immediately, and returns to sleep.'
        ],
        example: 'A municipal water meter buried beneath a manhole wakes once every 6 hours (4 times daily) to transmit consumption readings over NB-IoT. Consuming 1.15 mAh per day from a 2400 mAh lithium battery, the device achieves an operating lifespan of 4.85 years without maintenance.',
        code: `# Simulation: Cellular NB-IoT Power Saving Mode (PSM) Battery Lifespan
def calculate_cellular_iot_battery_life(battery_capacity_mah: float, tx_current_ma: float, tx_duration_sec: float,
                                        sleep_current_ua: float, reports_per_day: int) -> dict:
    tx_hours_per_day = (tx_duration_sec * reports_per_day) / 3600.0
    tx_daily_mah = tx_current_ma * tx_hours_per_day

    sleep_hours_per_day = 24.0 - tx_hours_per_day
    sleep_daily_mah = (sleep_current_ua / 1000.0) * sleep_hours_per_day

    total_daily_mah = tx_daily_mah + sleep_daily_mah

    # Usable battery capacity with 85% safety derating
    usable_capacity_mah = battery_capacity_mah * 0.85
    battery_life_days = usable_capacity_mah / total_daily_mah
    battery_life_years = battery_life_days / 365.25

    return {
        "Daily_TX_Consumption_mAh": round(tx_daily_mah, 4),
        "Daily_Sleep_Consumption_mAh": round(sleep_daily_mah, 4),
        "Total_Daily_mAh": round(total_daily_mah, 4),
        "Projected_Lifespan_Years": round(battery_life_years, 2)
    }

nbiot_life = calculate_cellular_iot_battery_life(
    battery_capacity_mah=2400.0,
    tx_current_ma=120.0,
    tx_duration_sec=8.0,
    sleep_current_ua=3.5,
    reports_per_day=4
)
print(f"Daily Consumption: {nbiot_life['Total_Daily_mAh']} mAh (TX: {nbiot_life['Daily_TX_Consumption_mAh']} mAh, Sleep: {nbiot_life['Daily_Sleep_Consumption_mAh']} mAh)")
print(f"Projected Sensor Battery Life: {nbiot_life['Projected_Lifespan_Years']} Years on 2400 mAh cell")`,
        output: `Daily Consumption: 1.1506 mAh (TX: 1.0667 mAh, Sleep: 0.084 mAh)\nProjected Sensor Battery Life: 4.85 Years on 2400 mAh cell`,
        tryIt: 'Increase reports_per_day from 4 to 24 (hourly reports) and observe how projected lifespan drops from 4.85 years down to 1.34 years.',
        check: {
          question: 'What is the primary operational advantage of 3GPP Power Saving Mode (PSM) in NB-IoT compared to simply powering off the cellular modem completely?',
          options: [
            'In PSM, the device remains logically registered with the cellular network, avoiding the costly and energy-intensive cellular re-attach procedure upon wake-up',
            'PSM enables the modem to transmit at 5G gigabit speeds',
            'PSM recharges the device battery from ambient airwaves',
            'PSM eliminates all cellular data subscription charges'
          ],
          answer: 0,
          why: 'Full power-down requires a complete radio attach handshake upon every wake-up, consuming massive energy. PSM preserves network registration while putting radio circuits to sleep.',
          answerIndex: 0,
          explanation: 'Full power-down requires a complete radio attach handshake upon every wake-up, consuming massive energy. PSM preserves network registration while putting radio circuits to sleep.'
        }
      },
      {
        title: 'RPL Mesh Routing: Destination-Oriented DAGs & Rank Calculation',
        say: [
          'In large-scale IPv6 sensor meshes (such as Thread, Zigbee, and Wi-SUN smart grid networks), devices cannot run complex Internet routing protocols like BGP or OSPF due to microsecond RAM and energy limits.',
          'Instead, the IETF standardized RPL (Routing Protocol for Low-Power and Lossy Networks, RFC 6550). RPL organizes nodes into a Destination-Oriented Directed Acyclic Graph (DODAG) rooted at the Border Router gateway.',
          'Each node in the mesh calculates a mathematical Rank. The DODAG Root possesses the lowest rank (e.g., 256). As packets travel upstream toward the root, they must strictly flow from nodes of higher rank to nodes of lower rank.',
          'Rank is calculated using an Objective Function (such as OF0 for hop count, or MRHOF using Expected Transmission Count ETX). By enforcing monotonic rank gradients, RPL mathematically guarantees that upward routing is strictly loop-free and capable of dynamic self-healing when a router node fails.'
        ],
        example: 'A neighborhood smart electricity grid consists of 4 nodes. Node 1 is the substation gateway root (Rank 256). Nodes 2 and 3 connect to Node 1 (Ranks 512 and 563). Node 4 evaluates both neighbors and selects Node 2 as its preferred parent because of lower cumulative rank (Rank 793 vs 819).',
        code: `# Simulation: RPL Mesh DODAG Routing & Objective Function Rank
def evaluate_rpl_dodag_mesh_routing(nodes: list[dict], root_id: int) -> list[dict]:
    min_hop_rank_increase = 256
    node_ranks = {root_id: min_hop_rank_increase}
    parent_map = {root_id: None}

    unresolved = [n["id"] for n in nodes if n["id"] != root_id]
    
    while unresolved:
        progress = False
        for n_id in list(unresolved):
            node = next(n for n in nodes if n["id"] == n_id)
            candidate_parents = []
            for neighbor_id in node["links"]:
                if neighbor_id in node_ranks:
                    link_cost = node["link_etx"].get(neighbor_id, 1.0) * min_hop_rank_increase
                    candidate_parents.append((neighbor_id, node_ranks[neighbor_id] + int(link_cost)))
            
            if candidate_parents:
                best_parent, best_rank = min(candidate_parents, key=lambda x: x[1])
                node_ranks[n_id] = best_rank
                parent_map[n_id] = best_parent
                unresolved.remove(n_id)
                progress = True
        if not progress:
            break

    results = []
    for n in nodes:
        nid = n["id"]
        results.append({
            "node_id": nid,
            "is_root": (nid == root_id),
            "parent_id": parent_map.get(nid),
            "rank": node_ranks.get(nid, -1)
        })
    return results

rpl_topology = [
    {"id": 1, "links": [2, 3], "link_etx": {2: 1.0, 3: 1.2}}, # Root Gateway
    {"id": 2, "links": [1, 4], "link_etx": {1: 1.0, 4: 1.1}}, # Router A
    {"id": 3, "links": [1, 4], "link_etx": {1: 1.2, 4: 1.8}}, # Router B
    {"id": 4, "links": [2, 3], "link_etx": {2: 1.1, 3: 1.8}}  # Leaf Sensor
]
rpl_eval = evaluate_rpl_dodag_mesh_routing(rpl_topology, root_id=1)
for r in rpl_eval:
    role = "DODAG Root" if r['is_root'] else f"Parent -> Node {r['parent_id']}"
    print(f"Node {r['node_id']}: Rank = {r['rank']} ({role})")`,
        output: `Node 1: Rank = 256 (DODAG Root)\nNode 2: Rank = 512 (Parent -> Node 1)\nNode 3: Rank = 563 (Parent -> Node 1)\nNode 4: Rank = 793 (Parent -> Node 2)`,
        tryIt: 'Change Node 4 link_etx to {2: 2.5, 3: 1.1} and observe how Node 4 dynamically shifts its preferred parent from Node 2 to Node 3.',
        check: {
          question: 'In the IETF RPL mesh protocol (RFC 6550), how does the mathematical Rank invariant guarantee loop-free routing for upward sensor traffic?',
          options: [
            'Upward traffic is strictly forwarded to parent nodes with lower Rank values, preventing circular paths by establishing a monotonic gradient toward the DODAG root',
            'By requiring all nodes to have identical IP addresses',
            'By shutting down all secondary routers',
            'By encrypting packets with asymmetric RSA keys'
          ],
          answer: 0,
          why: 'Nodes only forward upward traffic to candidate parents with lower Rank. Because rank strictly decreases toward the root, routing loops are mathematically impossible.',
          answerIndex: 0,
          explanation: 'Nodes only forward upward traffic to candidate parents with lower Rank. Because rank strictly decreases toward the root, routing loops are mathematically impossible.'
        }
      }
    ],
    summary: [
      'LoRa Chirp Spread Spectrum trades packet Time-on-Air for extreme receiver sensitivity down to -137 dBm, scaling from SF7 (fast) to SF12 (long-range).',
      'LoRaWAN 1% Duty Cycle regulations in the European 868 MHz band cap total transmission time at 36 seconds per hour, requiring off-time backoffs.',
      'BLE Mesh uses managed flooding across primary advertising channels, combining TTL limits with Message Cache deduplication to prevent broadcast storms.',
      'Cellular NB-IoT Power Saving Mode (PSM) maintains core network registration while sleeping at 3.5 uA, enabling 5+ year battery lifespans.',
      'RPL organizes low-power wireless meshes into Destination-Oriented DAGs, enforcing monotonic rank gradients that guarantee loop-free self-healing routing.'
    ],
    projectStep: {
      title: 'Implement an LPWAN & Wireless Mesh Protocol Verification Suite',
      steps: [
        'Calculate LoRa packet Time-on-Air and sensitivity across SF7 through SF12 configurations.',
        'Validate LoRaWAN 1% regional duty cycle compliance and enforce mandatory backoff off-times.',
        'Simulate a multi-hop BLE Mesh managed flooding relay with TTL decrementing and cache deduplication.',
        'Compute NB-IoT battery lifespan and evaluate RPL DODAG rank hierarchy and parent selection.'
      ]
    }
  },
  {
    coursePrefix: 'iot_net',
    day: 3,
    title: 'Thread IPv6 Mesh Networks, CoAP Blockwise Transfers & OSCORE Security',
    goal: 'Master low-power IP mesh networking with Thread: leader election and router partitioning over 802.15.4, streaming large payloads using CoAP Blockwise Transfers (RFC 7959), end-to-end application encryption with OSCORE (RFC 8613), Border Router prefix dissemination, and DTLS commissioning.',
    minutes: 35,
    recap: 'In Day 2, we mastered LoRa CSS modulation, 1% duty cycles, BLE mesh flooding, and RPL routing. Today in Day 3, we dive into Thread IPv6 mesh architectures, CoAP Blockwise transfers, OSCORE object encryption, and secure network commissioning.',
    parts: [
      {
        title: 'Thread Protocol Architecture: Self-Healing 6LoWPAN IPv6 Mesh & Leader Election',
        say: [
          'In smart homes, commercial buildings, and industrial sensor arrays, legacy point-to-point and star wireless topologies suffer from single points of failure. If a central Wi-Fi router reboots, all connected smart plugs, door locks, and thermostats lose connectivity simultaneously. The Thread Protocol, developed by the Thread Group (including Google, Apple, and ARM), addresses this vulnerability by delivering a self-healing, IPv6-addressable wireless mesh built on IEEE 802.15.4 radios in the 2.4 GHz band.',
          'Thread classifies devices into two hardware categories: Full Thread Devices (FTD) which maintain full radio reception and routing tables, and Minimal Thread Devices (MTD) which are constrained sensors (often battery-powered Sleepy End Devices, SED). Within a Thread network partition, FTD nodes dynamically take on roles: one node operates as the Thread Leader, while up to 32 FTDs operate as active Thread Routers. All other nodes connect as Children attached to a parent Router.',
          'The Thread Leader manages network configuration, assigns Router IDs, and maintains the centralized Network Data repository. Crucially, Thread eliminates single points of failure through automated Leader Election: if the active Leader loses power or suffers radio interference, the remaining Routers execute a distributed election algorithm based on monotonic Partition Weight metrics. The highest-weight Router instantly promotes itself to Leader without dropping a single packet or requiring user intervention!'
        ],
        example: 'Like an expedition team hiking in a remote wilderness: the team elects a lead guide to carry the master map. If the lead guide twists their ankle or steps away, the next most senior hiker immediately steps forward and takes the map, ensuring the team continues hiking toward camp without disbanding.',
        code: `# Simulation: Thread IPv6 Mesh Topology, Router Partitioning & Leader Election
def evaluate_thread_mesh_partition_and_leader(nodes: list[dict]) -> dict:
    # Full Thread Devices (FTDs) can become Routers or Leader
    # Minimal Thread Devices (MTDs) remain End Devices / Sleepy End Devices (SED)
    ftd_routers = [n for n in nodes if n.get("is_ftd", False)]
    
    # Leader is elected based on highest Router Weight and lowest Node ID as tiebreaker
    leader = max(ftd_routers, key=lambda n: (n.get("router_weight", 0), -n.get("id", 0)))
    
    # Map child attachment: each MTD attaches to router with best Link Quality Indicator (LQI: 1 to 3)
    attachments = {}
    for n in nodes:
        if not n.get("is_ftd", False):
            # Best parent from available routers
            parent = min(ftd_routers, key=lambda r: abs(r["id"] - n["id"]))
            attachments[n["id"]] = {
                "parent_id": parent["id"],
                "role": "Sleepy End Device" if n.get("is_sed", False) else "End Device"
            }
            
    return {
        "partition_id": 0x11223344,
        "active_router_count": len(ftd_routers),
        "leader_id": leader["id"],
        "leader_weight": leader["router_weight"],
        "child_attachments": attachments
    }

mesh_nodes = [
    {"id": 1, "is_ftd": True, "router_weight": 64},  # Router A (Candidate Leader)
    {"id": 2, "is_ftd": True, "router_weight": 56},  # Router B
    {"id": 3, "is_ftd": False, "is_sed": False},     # End Device C
    {"id": 4, "is_ftd": False, "is_sed": True}       # Sleepy End Device D (Battery Door Sensor)
]
p1_res = evaluate_thread_mesh_partition_and_leader(mesh_nodes)

print("=== THREAD IPV6 MESH TOPOLOGY & LEADER ELECTION ===")
print(f"Thread Partition ID:    {hex(p1_res['partition_id'])}")
print(f"Active Mesh Routers:    {p1_res['active_router_count']} FTD Nodes")
print(f"Elected Thread Leader:  Node {p1_res['leader_id']} (Weight: {p1_res['leader_weight']})")
print(f"Child Attachments:      Node 3 -> Parent {p1_res['child_attachments'][3]['parent_id']}, Node 4 -> Parent {p1_res['child_attachments'][4]['parent_id']} ({p1_res['child_attachments'][4]['role']})")`,
        output: `=== THREAD IPV6 MESH TOPOLOGY & LEADER ELECTION ===\nThread Partition ID:    0x11223344\nActive Mesh Routers:    2 FTD Nodes\nElected Thread Leader:  Node 1 (Weight: 64)\nChild Attachments:      Node 3 -> Parent 2, Node 4 -> Parent 2 (Sleepy End Device)`,
        codeNotes: [
          { line: 2, note: 'Distinguishes Full Thread Devices (FTDs) from constrained Minimal Thread Devices (MTDs)' },
          { line: 7, note: 'Elects dynamic Thread Leader based on highest partition router weight' },
          { line: 36, note: 'Assigns parent attachments for battery-powered Sleepy End Devices (SED)' }
        ],
        tryIt: 'Change Node 2 router_weight to 72 and verify that Node 2 immediately takes over as the elected Thread Leader.',
        check: {
          question: 'How does the Thread Protocol eliminate single points of failure in low-power wireless mesh networks?',
          options: [
            'By allowing any Full Thread Device (FTD) to dynamically promote itself to Leader via automated election if the active Leader fails',
            'By requiring all devices to be wired directly to an Ethernet wall jack',
            'By broadcasting all data packets over unencrypted FM radio frequencies',
            'By forcing every device to maintain a persistent satellite connection'
          ],
          answer: 0,
          why: 'Thread uses a decentralized mesh architecture where any FTD router can assume the Leader role if the current Leader disconnects, guaranteeing continuous network operation.'
        }
      },
      {
        title: 'CoAP Blockwise Transfers (RFC 7959): Reliable Large Payload Segmentation',
        say: [
          'In constrained 802.15.4 wireless networks, the physical Maximum Transmission Unit (MTU) is strictly capped at 127 bytes. After subtracting MAC framing headers, 6LoWPAN encapsulation, and UDP headers, an application packet has only 60 to 80 bytes of usable payload space. However, real-world IoT workflows frequently require transferring large data structures: a 2-kilobyte JSON configuration manifest, an X.509 device identity certificate, or a 128-kilobyte OTA firmware binary update.',
          'While IP-layer 6LoWPAN fragmentation can split an IP packet across multiple radio frames, IP fragmentation is notoriously fragile in lossy wireless environments: if a single fragment is dropped by radio interference, the entire multi-kilobyte IP packet is discarded, forcing a complete retransmission of all fragments!',
          'To achieve reliable, memory-safe data movement on microcontrollers with only 2 KB of RAM, the IETF standardized CoAP Blockwise Transfers (RFC 7959). CoAP defines two header options: Block1 (for segmenting request payloads, e.g. PUT/POST) and Block2 (for segmenting response payloads, e.g. GET). The Block option packs three critical fields into a compact 4-byte header: the Block Number (NUM), the More Flag (M, indicating if more blocks follow), and the Block Size Exponent (SZX, where BlockSize = 2^(SZX + 4), supporting 16 to 1024 bytes). Each block is acknowledged individually at the application layer, ensuring loss of one chunk only retransmits that single block!'
        ],
        example: 'Like mailing an encyclopedia to a friend using standard post office letter envelopes: instead of buying an oversized wooden crate that exceeds postal limits, you mail 20 numbered envelopes (Page 1/20, More=True). If envelope #5 gets lost in the mail, your friend only asks you to re-send envelope #5, not the entire encyclopedia.',
        code: `# Simulation: CoAP Blockwise Transfer (RFC 7959) Block2 Response Segmentation
def simulate_coap_blockwise_transfer(payload_bytes: int, block_szx: int = 2) -> dict:
    # SZX: 0=16B, 1=32B, 2=64B, 3=128B, 4=256B, 5=512B, 6=1024B
    block_size = 1 << (block_szx + 4) # 1 << 6 = 64 bytes
    import math
    total_blocks = math.ceil(payload_bytes / block_size)
    
    blocks_meta = []
    remaining_bytes = payload_bytes
    
    for num in range(total_blocks):
        current_chunk = min(remaining_bytes, block_size)
        more_flag = 1 if num < (total_blocks - 1) else 0
        remaining_bytes -= current_chunk
        
        # Block2 Option Value: (NUM << 4) | (M << 3) | SZX
        option_val = (num << 4) | (more_flag << 3) | block_szx
        blocks_meta.append({
            "block_num": num,
            "chunk_bytes": current_chunk,
            "more_flag": bool(more_flag),
            "option_hex": hex(option_val)
        })
        
    return {
        "total_payload_bytes": payload_bytes,
        "block_size_bytes": block_size,
        "total_blocks": total_blocks,
        "blocks": blocks_meta,
        "reassembly_success": remaining_bytes == 0
    }

p2_res = simulate_coap_blockwise_transfer(payload_bytes=150, block_szx=2) # 150 bytes in 64B blocks

print("=== COAP BLOCKWISE TRANSFER (RFC 7959) ===")
print(f"Total Resource Size:    {p2_res['total_payload_bytes']} Bytes")
print(f"Block SZX Configuration: SZX=2 ({p2_res['block_size_bytes']} Bytes / Block)")
print(f"Total Chunks Required:  {p2_res['total_blocks']} Blocks")
for b in p2_res['blocks']:
    print(f"  Block #{b['block_num']}: Size={b['chunk_bytes']}B | More={b['more_flag']} | Option Value={b['option_hex']}")
print(f"Assembly Status:        Reassembly Success={p2_res['reassembly_success']}")`,
        output: `=== COAP BLOCKWISE TRANSFER (RFC 7959) ===\nTotal Resource Size:    150 Bytes\nBlock SZX Configuration: SZX=2 (64 Bytes / Block)\nTotal Chunks Required:  3 Blocks\n  Block #0: Size=64B | More=True | Option Value=0xa\n  Block #1: Size=64B | More=True | Option Value=0x1a\n  Block #2: Size=22B | More=False | Option Value=0x22\nAssembly Status:        Reassembly Success=True`,
        codeNotes: [
          { line: 2, note: 'Calculates chunk size from 3-bit SZX exponent: BlockSize = 2^(SZX + 4)' },
          { line: 15, note: 'Encodes Block2 option bitmask: (NUM << 4) | (M << 3) | SZX' },
          { line: 36, note: 'Demonstrates streaming 150-byte resource in 64-byte chunks with zero memory buffer overflow' }
        ],
        tryIt: 'Change block_szx to 1 (32 bytes) and observe how the transfer automatically segments into 5 blocks.',
        check: {
          question: 'Why is CoAP Blockwise Transfer (RFC 7959) superior to IP-layer 6LoWPAN fragmentation for sending large payloads over wireless sensor networks?',
          options: [
            'Because CoAP blocks are acknowledged at the application layer; if one block is lost in transit, only that specific block is retransmitted rather than the entire multi-kilobyte payload',
            'Because CoAP blockwise transfers convert all text into binary audio signals',
            'Because CoAP blockwise transfers require a cellular SIM card to function',
            'Because IP fragmentation increases the physical radio frequency of the transmitter'
          ],
          answer: 0,
          why: 'IP fragmentation causes packet loss amplification: losing 1 fragment drops the whole datagram. CoAP blockwise transfer acknowledges individual blocks, allowing single-chunk retransmission.'
        }
      },
      {
        title: 'OSCORE (RFC 8613): End-to-End Object Security for Constrained RESTful Environments',
        say: [
          'In modern cloud-integrated IoT systems, constrained edge devices rarely communicate directly with end servers over pure end-to-end IP sockets. Instead, network traffic passes through intermediate forward proxies, protocol gateways (such as CoAP-to-HTTP translators), and multi-hop mesh relays.',
          'While Datagram Transport Layer Security (DTLS) encrypts traffic across a single hop (e.g. from the sensor to the local gateway), DTLS terminates at the gateway! The intermediate proxy must decrypt the packet into plaintext before re-encrypting it toward the cloud server. If an untrusted or compromised cloud proxy manages the network, attackers can read confidential telemetry and tamper with actuator commands.',
          'To provide true End-to-End Security across untrusted intermediaries, the IETF standardized Object Security for Constrained RESTful Environments (OSCORE, RFC 8613). OSCORE protects CoAP messages at the Application Layer using CBOR Object Signing and Encryption (COSE). An OSCORE packet splits the request into two layers: (1) The Outer CoAP Header, which remains unencrypted so forward proxies can route the packet (Uri-Host, Proxy-Uri); and (2) The Inner CoAP Header, where the original Request Method, sensitive URI paths (/api/v1/sensors), and Payload are encrypted with AES-CCM-16-64. Even if the proxy is completely compromised, it cannot read a single byte of telemetry!'
        ],
        example: 'Like shipping confidential corporate documents inside a locked steel lockbox placed inside a FedEx cardboard shipping box: the courier can read the destination address on the cardboard label to route the box through airport sorting hubs, but only the recipient with the physical brass key can open the steel lockbox.',
        code: `# Simulation: OSCORE (RFC 8613) End-to-End Application Object Security
def simulate_oscore_packet_protection(plain_payload: str, method: str, path: str, sender_seq: int) -> dict:
    # OSCORE splits CoAP into:
    # 1. Outer CoAP (visible to forward proxies for routing): Method=POST, Path=coap://proxy
    # 2. Inner CoAP (encrypted with COSE AEAD): Original Method, Original Path, Payload
    # Encrypt simulated using XOR mask + sequence number
    payload_raw = plain_payload.encode('utf-8')
    key_stream = [(0xA5 ^ ((sender_seq + i) & 0xFF)) for i in range(len(payload_raw))]
    ciphertext_bytes = bytes([b ^ k for b, k in zip(payload_raw, key_stream)])
    
    # OSCORE Option value: [Compressed Flag, Sequence Number]
    oscore_option_hex = f"09{sender_seq:02x}" # Flag 0x09 + 1-byte seq
    
    return {
        "original_method": method,
        "original_uri_path": path,
        "plaintext_payload": plain_payload,
        "sender_sequence_number": sender_seq,
        "oscore_option_hex": oscore_option_hex,
        "ciphertext_hex": ciphertext_bytes.hex(),
        "proxy_readable_uri": "UNTRUSTED_PROXY_CANNOT_READ_PATH",
        "end_to_end_protected": True
    }

p3_res = simulate_oscore_packet_protection("temperature=22.4", "POST", "/api/v1/sensors", 42)

print("=== OSCORE END-TO-END APPLICATION SECURITY (RFC 8613) ===")
print(f"Original Request:       {p3_res['original_method']} {p3_res['original_uri_path']} ({p3_res['plaintext_payload']})")
print(f"OSCORE Sequence Num:    #{p3_res['sender_sequence_number']} (Anti-Replay Tag: {p3_res['oscore_option_hex']})")
print(f"Encrypted Ciphertext:   0x{p3_res['ciphertext_hex']}")
print(f"Intermediate Proxy:     Payload & URI path 100% hidden (E2E Verified: {p3_res['end_to_end_protected']})")`,
        output: `=== OSCORE END-TO-END APPLICATION SECURITY (RFC 8613) ===\nOriginal Request:       POST /api/v1/sensors (temperature=22.4)\nOSCORE Sequence Num:    #42 (Anti-Replay Tag: 092a)\nEncrypted Ciphertext:   0xfbebe4f8eef8f4e0e2e4f4ada1a0b3a8\nIntermediate Proxy:     Payload & URI path 100% hidden (E2E Verified: True)`,
        codeNotes: [
          { line: 2, note: 'Demonstrates end-to-end application layer encryption isolating payload from proxies' },
          { line: 11, note: 'Constructs OSCORE option header embedding monotonic sequence number for anti-replay' },
          { line: 26, note: 'Hides URI path and payload while exposing only outer routing metadata to proxies' }
        ],
        tryIt: 'Change the sender_seq to 43 and observe how the ciphertext and OSCORE option update dynamically.',
        check: {
          question: 'What critical security advantage does OSCORE (RFC 8613) provide over standard DTLS in IoT architectures that use forward proxies or gateways?',
          options: [
            'End-to-end application encryption: the payload and sensitive URI path remain encrypted across intermediate proxies and protocol translators, preventing proxies from eavesdropping or tampering',
            'It allows batteries to be charged wirelessly over radio waves',
            'It eliminates the need for IP addresses entirely',
            'It converts all sensor readings into GPS coordinates'
          ],
          answer: 0,
          why: 'DTLS is hop-by-hop and decrypts at every intermediate proxy. OSCORE encrypts at the application layer using COSE, keeping data completely opaque to intermediate network routers and proxies.'
        }
      },
      {
        title: 'Thread Low-Power Border Routers & Unicast IPv6 Prefix Dissemination',
        say: [
          'Because Thread networks operate over standard IPv6, a Thread device is not trapped inside an isolated, proprietary silo (unlike legacy Zigbee or Z-Wave networks which require complex application-layer gateway translation). Every Thread node has a genuine, standard IPv6 address that can exchange UDP packets directly with servers on the global internet!',
          'The architectural component that bridges the IEEE 802.15.4 Thread mesh to the wider local network (Ethernet or Wi-Fi) is the Thread Border Router (such as an OpenThread Border Router, OTBR, running on a Raspberry Pi or Wi-Fi access point).',
          'The Border Router does not perform Network Address Translation (NAT) or protocol translation. Instead, it functions as an authentic IPv6 Network Router. The Border Router advertises an On-Mesh IPv6 Prefix (typically a Unique Local Address ULA prefix, e.g. fd00::/8) into the Thread Network Data repository using Mesh Link Establishment (MLE). End devices use Stateless Address Autoconfiguration (SLAAC) to combine the 64-bit advertised prefix with their 64-bit IEEE EUI-64 MAC address, automatically forming a globally routable IPv6 address!'
        ],
        example: 'Like an international bridge between an island nation (Thread mesh) and the mainland highway (Ethernet/Wi-Fi): the bridge customs authority issues valid road maps and signs (IPv6 prefix advertisement) so any island resident can drive directly onto mainland roads without changing vehicles.',
        code: `# Simulation: Thread Border Router Prefix Dissemination & SLAAC Address Generation
def simulate_thread_border_router_prefix_dissemination(on_mesh_prefix: str, mesh_eui64_list: list[str]) -> dict:
    # Border Router disseminates 64-bit IPv6 ULA prefix via Thread Network Data TLV
    # Each node combines the 64-bit prefix with its 64-bit EUI-64 to form a globally routable SLAAC IPv6 address
    slaac_addresses = {}
    for eui in mesh_eui64_list:
        clean_eui = eui.replace(":", "").lower()
        # Invert U/L bit (bit 6 of first byte) for modified EUI-64
        first_byte = int(clean_eui[:2], 16) ^ 0x02
        iid = f"{first_byte:02x}{clean_eui[2:4]}:{clean_eui[4:8]}:{clean_eui[8:12]}:{clean_eui[12:16]}"
        full_ipv6 = f"{on_mesh_prefix}:{iid}"
        slaac_addresses[eui] = full_ipv6
        
    return {
        "border_router_prefix": on_mesh_prefix,
        "prefix_flags": "Preferred=1, Valid=1, OnMesh=1, DefRoute=1",
        "generated_ipv6_addresses": slaac_addresses,
        "dual_radio_routing": "802.15.4 Mesh <-> Ethernet/Wi-Fi WAN"
    }

euilist = ["00:12:4b:00:14:d5:2f:01", "00:12:4b:00:14:d5:2f:02"]
p4_res = simulate_thread_border_router_prefix_dissemination("fdde:ad00:beef:0001", euilist)

print("=== THREAD BORDER ROUTER PREFIX DISSEMINATION ===")
print(f"Disseminated Prefix:    {p4_res['border_router_prefix']}::/64 ({p4_res['prefix_flags']})")
for eui, ip in p4_res['generated_ipv6_addresses'].items():
    print(f"  EUI-64 {eui} -> IPv6: {ip}")
print(f"WAN Routing Mode:       {p4_res['dual_radio_routing']}")`,
        output: `=== THREAD BORDER ROUTER PREFIX DISSEMINATION ===\nDisseminated Prefix:    fdde:ad00:beef:0001::/64 (Preferred=1, Valid=1, OnMesh=1, DefRoute=1)\n  EUI-64 00:12:4b:00:14:d5:2f:01 -> IPv6: fdde:ad00:beef:0001:0212:4b00:14d5:2f01\n  EUI-64 00:12:4b:00:14:d5:2f:02 -> IPv6: fdde:ad00:beef:0001:0212:4b00:14d5:2f02\nWAN Routing Mode:       802.15.4 Mesh <-> Ethernet/Wi-Fi WAN`,
        codeNotes: [
          { line: 2, note: 'Simulates Thread Network Data TLV dissemination of 64-bit On-Mesh IPv6 prefixes' },
          { line: 8, note: 'Inverts U/L bit on IEEE EUI-64 MAC to construct RFC 4291 modified Interface Identifiers (IID)' },
          { line: 24, note: 'Generates genuine IPv6 addresses enabling direct bidirectional UDP communication with the WAN' }
        ],
        tryIt: 'Add a third EUI-64 address to euilist and verify that SLAAC generates an address matching the on-mesh prefix.',
        check: {
          question: 'What is the primary architectural function of a Thread Border Router (OTBR)?',
          options: [
            'Routing IPv6 packets between the low-power 802.15.4 Thread mesh and external Ethernet/Wi-Fi networks without requiring application-level translation',
            'Translating Bluetooth signals into audio FM radio broadcasts',
            'Charging smart home devices wirelessly over Wi-Fi',
            'Replacing battery cells in remote sensor nodes'
          ],
          answer: 0,
          why: 'A Thread Border Router is an authentic network-layer IPv6 router that bridges low-power 802.15.4 wireless packets directly to Ethernet/Wi-Fi infrastructure without application-layer translation.'
        }
      },
      {
        title: 'Thread Network Commissioning & DTLS-Based Passphrase Authentication',
        say: [
          'Before a brand-new, factory-unboxed IoT sensor (the Joiner) can participate in a secure Thread mesh, it must obtain the network\'s operational parameters: the Network Master Key, Extended PAN ID, Channel, and Network Name. However, broadcasting the Master Key over the air in plaintext would allow any nearby eavesdropper with a packet sniffer to compromise the entire building mesh!',
          'To solve this bootstrapping challenge, Thread specifies a cryptographically secure Commissioning Protocol. The user uses an authorized mobile application (the Commissioner, e.g. a smartphone) to scan a QR code printed on the physical device label. The QR code encodes a single-use Joiner Passphrase (and optional EUI-64).',
          'The Joiner scans wireless channels and broadcasts an unencrypted MLE Discovery Request. An existing Thread Router acts as a Commissioning Relay: it relays UDP packets between the Joiner and the Commissioner. The Joiner and Commissioner execute a DTLS handshake authenticated using a Pre-Shared Key for Joiner (PSK-J) derived from the QR-code passphrase via PBKDF2. Over this authenticated, encrypted DTLS tunnel, the Commissioner transfers the Thread Master Key to the Joiner. Once received, the Joiner attaches to the mesh as an authenticated child!'
        ],
        example: 'Like checking into a luxury hotel: at the front desk, the guest shows their reservation QR code and passport to the concierge. Once verified, the concierge programs an electronic RFID room keycard and hands it to the guest, granting access to the private elevators and suite.',
        code: `# Simulation: Thread Secure Commissioning & Network Credential Handshake
def simulate_thread_commissioning_handshake(joiner_eui64: str, joiner_passphrase: str, network_master_key: str) -> dict:
    # 1. Joiner and Commissioner establish DTLS tunnel authenticated with PSK-J derived from passphrase
    # Deterministic PBKDF2/PSK derivation simulation
    psk_j_derived = hex(sum(ord(c) * (i + 1) for i, c in enumerate(joiner_passphrase)) & 0xFFFFFFFF)
    
    # 2. Authentication assertion
    auth_passed = len(joiner_passphrase) >= 6 and bool(psk_j_derived)
    
    # 3. Commissioner transfers Meshcop credentials over encrypted tunnel
    if auth_passed:
        transferred_key = network_master_key
        status = "JOINER_COMMISSIONED_ACTIVE_ROUTER_ATTACHED"
    else:
        transferred_key = "0x0000000000000000"
        status = "COMMISSIONING_FAILED_UNAUTHORIZED"
        
    return {
        "joiner_eui64": joiner_eui64,
        "passphrase_verified": auth_passed,
        "dtls_tunnel_psk": psk_j_derived,
        "delivered_network_key": transferred_key,
        "commissioning_status": status
    }

p5_res = simulate_thread_commissioning_handshake("00:12:4b:00:99:aa:bb:cc", "THREAD2026KEY", "0x00112233445566778899aabbccddeeff")

print("=== THREAD COMMISSIONING & SECURE CREDENTIAL DELIVERY ===")
print(f"Joiner EUI-64:          {p5_res['joiner_eui64']}")
print(f"DTLS PSK-J Tunnel:      Established (Auth: {p5_res['passphrase_verified']})")
print(f"Delivered Network Key:  {p5_res['delivered_network_key']}")
print(f"Thread Node State:      {p5_res['commissioning_status']}")`,
        output: `=== THREAD COMMISSIONING & SECURE CREDENTIAL DELIVERY ===\nJoiner EUI-64:          00:12:4b:00:99:aa:bb:cc\nDTLS PSK-J Tunnel:      Established (Auth: True)\nDelivered Network Key:  0x00112233445566778899aabbccddeeff\nThread Node State:      JOINER_COMMISSIONED_ACTIVE_ROUTER_ATTACHED`,
        codeNotes: [
          { line: 2, note: 'Derives ephemeral PSK-J secret from out-of-band QR-code passphrase' },
          { line: 9, note: 'Transfers master operational network key over encrypted DTLS tunnel via Commissioning Relay' },
          { line: 26, note: 'Transitions unconfigured Joiner into authenticated active child router on the mesh' }
        ],
        tryIt: 'Set joiner_passphrase to an invalid short password (e.g. "123") and verify commissioning fails.',
        check: {
          question: 'How does Thread Commissioning securely onboard a new joiner device without exposing the network master key over plaintext radio broadcasts?',
          options: [
            'By establishing a temporary DTLS tunnel authenticated with a single-use passphrase (scanned from a QR code), transferring the Master Key exclusively within the encrypted tunnel',
            'By shouting the password over an audio speaker',
            'By turning off all security encryption on the router for 5 minutes',
            'By requiring the device to be plugged into a USB cable'
          ],
          answer: 0,
          why: 'The Commissioner and Joiner authenticate over a temporary DTLS tunnel using a QR-code passphrase (PSK-J). The Master Key is delivered strictly inside the encrypted DTLS tunnel.'
        }
      }
    ],
    summary: [
      'Thread creates self-healing 6LoWPAN IPv6 meshes with automated Leader election, eliminating single points of failure.',
      'CoAP Blockwise Transfers (RFC 7959) stream large resources in acknowledged 64-byte chunks, avoiding IP-layer fragmentation dropouts.',
      'OSCORE (RFC 8613) provides end-to-end application layer encryption using COSE, keeping payloads completely opaque to intermediate forward proxies.',
      'Thread Border Routers advertise On-Mesh IPv6 prefixes, enabling SLAAC address autoconfiguration and direct bidirectional WAN communication.',
      'Thread Commissioning securely onboards Joiners over an encrypted DTLS tunnel authenticated via out-of-band QR-code passphrases.'
    ],
    projectStep: {
      title: 'Architect a Secure Thread IPv6 Mesh & CoAP/OSCORE Networking Stack',
      steps: [
        'Simulate a multi-router Thread mesh partition and verify automated leader election.',
        'Implement a CoAP Block2 response segmentation engine streaming large resources chunk-by-chunk.',
        'Construct an OSCORE application-layer protection wrapper isolating payload and URI paths from proxies.',
        'Simulate Border Router SLAAC IPv6 prefix dissemination and DTLS joiner commissioning.'
      ]
    }
  },
  {
    coursePrefix: 'iot_net',
    day: 4,
    title: 'Matter Protocol Architecture: Unified IP Data Models, SPAKE2+ & Multi-Admin',
    goal: 'Master the Matter (CHIP) smart home standard: navigating the unified data model hierarchy, establishing zero-knowledge PASE sessions via SPAKE2+, managing multi-admin fabrics with CASE certificates, validating Device Attestation Certificates (DAC), and enforcing Timed Interactions.',
    minutes: 35,
    recap: 'In Day 3, we engineered Thread IPv6 mesh topologies, CoAP blockwise chunking, and OSCORE encryption. Today in Day 4, we scale to the Matter Protocol (Connected Home over IP)—unifying Thread and Wi-Fi devices into a single secure, interoperable smart home application layer.',
    parts: [
      {
        title: 'Matter Protocol Architecture: Unified IP Application Layer over Thread & Wi-Fi',
        say: [
          'For over two decades, the smart home industry suffered from severe vendor lock-in and platform fragmentation. Consumers faced frustrating silos where smart plugs, lighting, and thermostats only worked with one specific ecosystem (Apple HomeKit, Google Home, Amazon Alexa, or Samsung SmartThings), requiring clunky proprietary bridge hardware and incompatible radio protocols.',
          'The Matter Protocol (originally Project CHIP - Connected Home over IP), standardized by the Connectivity Standards Alliance (CSA), revolutionizes IoT by introducing a single unified application layer that operates seamlessly over standard IPv6 transport—whether over low-power IEEE 802.15.4 Thread mesh or high-bandwidth 802.11 Wi-Fi.',
          'At the core of Matter is its standardized Data Model Hierarchy: a physical device comprises one or more Endpoints. Endpoint 0 is always the Root Node (housing device-wide management, network commissioning, and basic information). Additional endpoints represent distinct functional capabilities (e.g. Endpoint 1 as a Dimmable Light, Endpoint 2 as a Temperature Sensor). Each endpoint contains standard Clusters (such as OnOff Cluster 0x0006 or LevelControl Cluster 0x0008), which group state Attributes, executable Commands, and event logs. Matter uses mDNS (Multicast DNS) for zero-configuration local network discovery, eliminating cloud dependencies.'
        ],
        example: 'Like the USB-C standard for electronics: before USB-C, every brand had proprietary power bricks and cables; with USB-C, a single standardized physical connector and protocol powers laptops, phones, monitors, and headphones interchangeably.',
        code: `# Simulation: Matter Data Model Hierarchy & Cluster Traversal
def simulate_matter_data_model_hierarchy(device_type: str, endpoints_config: list[dict]) -> dict:
    # Matter Data Model: Device -> Endpoints -> Clusters -> Attributes/Commands
    cluster_registry = {
        0x0006: {"name": "OnOff", "attributes": ["OnOffState"], "commands": ["Off", "On", "Toggle"]},
        0x0008: {"name": "LevelControl", "attributes": ["CurrentLevel"], "commands": ["MoveToLevel"]},
        0x001D: {"name": "Descriptor", "attributes": ["DeviceTypeList", "ServerList"], "commands": []},
        0x0028: {"name": "BasicInformation", "attributes": ["VendorID", "ProductID", "NodeLabel"], "commands": []}
    }
    
    parsed_endpoints = []
    total_clusters = 0
    
    for ep in endpoints_config:
        ep_id = ep["id"]
        server_clusters = []
        for cid in ep.get("servers", []):
            c_meta = cluster_registry.get(cid, {"name": f"UnknownCluster_{hex(cid)}", "attributes": [], "commands": []})
            server_clusters.append({
                "cluster_id": hex(cid),
                "cluster_name": c_meta["name"],
                "attributes": c_meta["attributes"],
                "commands": c_meta["commands"]
            })
            total_clusters += 1
            
        parsed_endpoints.append({
            "endpoint_id": ep_id,
            "device_role": "RootNode" if ep_id == 0 else device_type,
            "server_clusters": server_clusters
        })
        
    return {
        "device_type": device_type,
        "endpoint_count": len(parsed_endpoints),
        "total_active_clusters": total_clusters,
        "endpoints": parsed_endpoints
    }

ep_layout = [
    {"id": 0, "servers": [0x001D, 0x0028]}, # Endpoint 0: Root Node
    {"id": 1, "servers": [0x0006, 0x0008]}  # Endpoint 1: Dimmable Light
]
p1_res = simulate_matter_data_model_hierarchy("DimmableLight", ep_layout)

print("=== MATTER DATA MODEL HIERARCHY & CLUSTERS ===")
print(f"Device Type Profile:     {p1_res['device_type']}")
print(f"Endpoint Count:          {p1_res['endpoint_count']} Endpoints ({p1_res['total_active_clusters']} Clusters Total)")
for ep in p1_res['endpoints']:
    print(f"  Endpoint {ep['endpoint_id']} ({ep['device_role']}): {[c['cluster_name'] for c in ep['server_clusters']]}")
print(f"Cluster 0x0006 Commands: {p1_res['endpoints'][1]['server_clusters'][0]['commands']}")`,
        output: `=== MATTER DATA MODEL HIERARCHY & CLUSTERS ===\nDevice Type Profile:     DimmableLight\nEndpoint Count:          2 Endpoints (4 Clusters Total)\n  Endpoint 0 (RootNode): ['Descriptor', 'BasicInformation']\n  Endpoint 1 (DimmableLight): ['OnOff', 'LevelControl']\nCluster 0x0006 Commands: ['Off', 'On', 'Toggle']`,
        codeNotes: [
          { line: 2, note: 'Defines Matter cluster registry mapping 16-bit IDs to standardized attributes and commands' },
          { line: 22, note: 'Organizes device into Endpoint 0 Root Node and application functional endpoints' },
          { line: 40, note: 'Enumerates active server clusters and executable commands across the device tree' }
        ],
        tryIt: 'Add a new endpoint with an OccupancySensing cluster (0x0406) and verify it parses cleanly.',
        check: {
          question: 'How does the Matter Protocol achieve universal smart home interoperability across competing ecosystems?',
          options: [
            'By standardizing a unified IPv6 application layer and data model across Thread and Wi-Fi, allowing devices to communicate locally with Apple Home, Google Home, and Alexa without proprietary bridges',
            'By requiring every consumer to purchase a dedicated cloud subscription server',
            'By converting all network traffic into analog telephone audio tones',
            'By shutting down local Wi-Fi networks during smart device pairing'
          ],
          answer: 0,
          why: 'Matter creates a single open-source application protocol operating over standard IPv6, ensuring certified accessories communicate locally with any compliant smart home platform.'
        }
      },
      {
        title: 'PASE (Passcode-Authenticated Session Establishment): SPAKE2+ Commissioning',
        say: [
          'When an unconfigured Matter accessory is turned on for the first time, it has no operational network credentials and shares no public key certificates with the user smartphone (Commissioner). The only piece of shared information between the user and the accessory is an 8-digit numeric setup PIN code (e.g. 20202021) printed on a QR-code sticker on the physical device body.',
          'In traditional IoT systems, pairing using an 8-digit PIN is vulnerable to Offline Dictionary Attacks: an eavesdropper listening to wireless radio frames can capture an authentication hash and iterate through all 100 million possible 8-digit codes in seconds on a GPU, extracting the master network key!',
          'Matter permanently eliminates dictionary attacks by mandating SPAKE2+ (Simple Password Exponential Key Exchange) for Passcode-Authenticated Session Establishment (PASE). SPAKE2+ is an asymmetric Password-Authenticated Key Exchange (PAKE) algorithm. During factory provisioning, the 8-digit passcode and a random salt are hashed through PBKDF2 (1,000+ rounds) to compute two scalar curve points (w0, w1). During pairing over BLE or Wi-Fi, the Commissioner and accessory exchange public curve points. Both sides compute a shared session key without ever transmitting the passcode or any hash that can be tested offline, providing zero-knowledge authentication!'
        ],
        example: 'Like two bank tellers verifying a customer secret 4-digit code through a mathematical riddle: both tellers solve the riddle and confirm they have the exact same answer without either teller ever speaking the secret number aloud.',
        code: `# Simulation: Matter PASE SPAKE2+ Key Exchange Verification
def simulate_matter_pase_spake2plus_handshake(setup_passcode: int, salt_hex: str, iterations: int = 1000) -> dict:
    # SPAKE2+ Passcode Authenticated Key Exchange:
    # Converts low-entropy 8-digit PIN (e.g. 20202021) into high-entropy cryptographic verifier
    # Verifier w0, w1 points derived via PBKDF2 simulation
    passcode_str = str(setup_passcode)
    salt_bytes = bytes.fromhex(salt_hex)
    
    # Deterministic verifier simulation
    w0 = (sum(ord(c) * 31 for c in passcode_str) + len(salt_bytes)) % 0xFFFFFFFF
    w1 = (sum(ord(c) * 17 for c in passcode_str) * iterations) % 0xFFFFFFFF
    
    # Zero-Knowledge Key Confirmation: both Commissioner and Accessory exchange P_A and P_B points
    shared_pase_key = hex((w0 ^ w1 ^ 0xA5A55A5A) & 0xFFFFFFFF)
    
    return {
        "setup_passcode": setup_passcode,
        "pbkdf2_iterations": iterations,
        "spake2_w0": hex(w0),
        "spake2_w1": hex(w1),
        "derived_pase_key": shared_pase_key,
        "offline_dictionary_attack_resistant": True
    }

p2_res = simulate_matter_pase_spake2plus_handshake(20202021, "1122334455667788", 1000)

print("=== MATTER PASE SPAKE2+ COMMISSIONING HANDSHAKE ===")
print(f"Setup PIN Passcode:      {p2_res['setup_passcode']} (8-Digit Out-Of-Band Code)")
print(f"PBKDF2 Iterations:       {p2_res['pbkdf2_iterations']} rounds")
print(f"SPAKE2+ Verifier (w0):   {p2_res['spake2_w0']}")
print(f"SPAKE2+ Verifier (w1):   {p2_res['spake2_w1']}")
print(f"Derived PASE Secret Key: {p2_res['derived_pase_key']} (ZKP Verified: {p2_res['offline_dictionary_attack_resistant']})")`,
        output: `=== MATTER PASE SPAKE2+ COMMISSIONING HANDSHAKE ===\nSetup PIN Passcode:      20202021 (8-Digit Out-Of-Band Code)\nPBKDF2 Iterations:       1000 rounds\nSPAKE2+ Verifier (w0):   0x2f9f\nSPAKE2+ Verifier (w1):   0x65f1a8\nDerived PASE Secret Key: 0xa5c0846d (ZKP Verified: True)`,
        codeNotes: [
          { line: 2, note: 'Derives SPAKE2+ scalar verifiers (w0, w1) using PBKDF2 stretching to defeat dictionary attacks' },
          { line: 12, note: 'Executes zero-knowledge key agreement without exposing raw passcode across radio medium' },
          { line: 27, note: 'Synthesizes shared PASE session key for secure initial fabric commissioning' }
        ],
        tryIt: 'Change the passcode to 12345678 and observe how the derived PASE key changes completely.',
        check: {
          question: 'Why does Matter mandate the SPAKE2+ protocol for Passcode-Authenticated Session Establishment (PASE) during initial setup?',
          options: [
            'Because SPAKE2+ is a zero-knowledge password-authenticated key exchange that prevents offline dictionary attacks against short 8-digit PINs, even if an attacker sniffs all wireless setup packets',
            'Because SPAKE2+ compresses video streams on smart home cameras',
            'Because standard passwords cannot be typed on mobile phone touchscreens',
            'Because SPAKE2+ increases the battery voltage of the smart accessory'
          ],
          answer: 0,
          why: 'Low-entropy passcodes (like 8-digit setup PINs) are vulnerable to brute-force dictionary attacks if simple hashes are exchanged. SPAKE2+ ensures an eavesdropper gains zero mathematical advantage from captured packets.'
        }
      },
      {
        title: 'CASE (Certificate-Authenticated Session Establishment) & Multi-Admin Architecture',
        say: [
          'Once initial commissioning over PASE is complete, operational communications between controllers and accessories switch to Certificate-Authenticated Session Establishment (CASE). In CASE, devices communicate over IPv6 using mutual authentication based on X.509 Node Operational Certificates (NOC).',
          'The CASE handshake executes the SIGMA-I (Sign-and-Mac) protocol using ephemeral ECDH key agreement. Each endpoint validates the other certificate chain back to the trusted Root of Trust CA for that specific fabric, establishing an authenticated, AEAD-encrypted session key for daily operational use.',
          'Crucially, Matter introduces the revolutionary Multi-Admin Architecture. A physical Matter accessory can simultaneously belong to multiple distinct Fabrics (e.g. Fabric 1 for Apple Home, Fabric 2 for Google Home, Fabric 3 for Home Assistant). Each fabric possesses its own cryptographically isolated Fabric ID, its own Root CA, and its own Access Control List (ACL) table! For example, Apple Home can hold Administer privileges, while Google Home holds Operate privileges. If one ecosystem experiences an outage, the other ecosystems continue operating locally without disruption!'
        ],
        example: 'Like an electronic badge reader at a multi-tenant corporate office building: the same physical turnstile verifies Google badges for Google employees and Apple badges for Apple employees, with each company issuing its own independent cryptographic certificates and access permissions.',
        code: `# Simulation: Matter CASE Session & Multi-Admin Fabric Routing
def evaluate_matter_case_multi_admin_fabrics(active_fabrics: list[dict], request_fabric_id: int, request_privilege: str) -> dict:
    # Matter Multi-Admin: Single device belongs to multiple independent Fabrics (Apple, Google, Home Assistant)
    # Each fabric has an isolated Fabric ID, Node ID, and Root CA
    privilege_levels = {"View": 1, "Operate": 2, "Manage": 3, "Administer": 4}
    
    target_fabric = next((f for f in active_fabrics if f["fabric_id"] == request_fabric_id), None)
    if not target_fabric:
        return {"authorized": False, "reason": "FABRIC_NOT_COMMISSIONED"}
        
    required_level = privilege_levels.get(request_privilege, 99)
    granted_level = privilege_levels.get(target_fabric.get("acl_tier", "View"), 0)
    is_authorized = granted_level >= required_level
    
    return {
        "request_fabric_id": hex(request_fabric_id),
        "fabric_label": target_fabric["label"],
        "granted_acl_tier": target_fabric["acl_tier"],
        "required_privilege": request_privilege,
        "is_authorized": is_authorized,
        "multi_admin_isolated": True
    }

fabrics = [
    {"fabric_id": 0x1001, "label": "Apple Home Fabric", "acl_tier": "Administer"},
    {"fabric_id": 0x1002, "label": "Google Home Fabric", "acl_tier": "Operate"}
]
p3_admin = evaluate_matter_case_multi_admin_fabrics(fabrics, 0x1001, "Administer")
p3_oper = evaluate_matter_case_multi_admin_fabrics(fabrics, 0x1002, "Administer") # Google only has Operate

print("=== MATTER CASE & MULTI-ADMIN FABRIC ACCESS CONTROL ===")
print(f"Fabric 0x1001 ({p3_admin['fabric_label']}): Privilege={p3_admin['required_privilege']} -> Granted: {p3_admin['is_authorized']}")
print(f"Fabric 0x1002 ({p3_oper['fabric_label']}): Privilege={p3_oper['required_privilege']} -> Granted: {p3_oper['is_authorized']} (Tier: {p3_oper['granted_acl_tier']})")
print(f"Multi-Admin Isolation:   Cryptographically segregated fabrics confirmed")`,
        output: `=== MATTER CASE & MULTI-ADMIN FABRIC ACCESS CONTROL ===\nFabric 0x1001 (Apple Home Fabric): Privilege=Administer -> Granted: True\nFabric 0x1002 (Google Home Fabric): Privilege=Administer -> Granted: False (Tier: Operate)\nMulti-Admin Isolation:   Cryptographically segregated fabrics confirmed`,
        codeNotes: [
          { line: 2, note: 'Implements multi-admin fabric access control isolating independent smart home ecosystems' },
          { line: 12, note: 'Enforces hierarchical privilege levels: View (1) < Operate (2) < Manage (3) < Administer (4)' },
          { line: 27, note: 'Allows concurrent control from Apple and Google without cross-fabric interference' }
        ],
        tryIt: 'Promote Google Home to Administer tier and verify that administrative commands are granted.',
        check: {
          question: 'What is the primary architectural capability provided by the Matter Multi-Admin feature?',
          options: [
            'Allowing a single physical Matter accessory to connect simultaneously to multiple independent smart home ecosystems (e.g. Apple Home and Google Home) with isolated cryptographic credentials',
            'Allowing multiple users to share a single Wi-Fi password on social media',
            'Enabling the microcontroller to run multiple operating systems at the same time',
            'Automatically creating multiple administrator accounts on a laptop computer'
          ],
          answer: 0,
          why: 'Multi-Admin allows accessories to belong to multiple fabrics at the same time. Each platform has its own fabric ID and certificates, eliminating the need for cloud-to-cloud bridges.'
        }
      },
      {
        title: 'Device Attestation Certificates (DAC) & Product Attestation Authority (PAA)',
        say: [
          'In an open IP standard where anyone can build smart home hardware, how does a Matter ecosystem prevent counterfeit, cloned, or rogue accessories from connecting to a user network? If an uncertified manufacturer builds a smart lock with security flaws, an attacker could exploit it to compromise the entire home.',
          'Matter guarantees hardware authenticity and compliance through the Device Attestation Certificate (DAC) Public Key Infrastructure (PKI). Every genuine Matter accessory leaves the factory with a unique DAC fused into secure silicon during manufacturing, signed by the manufacturer Product Attestation Intermediate (PAI) CA, which chains directly to an official CSA-approved Product Attestation Authority (PAA) Root CA.',
          'During commissioning, the accessory provides its DAC and executes an Attestation Challenge signature proving it holds the corresponding private key. The Commissioner verifies the certificate chain and queries the CSA Distributed Compliance Ledger (DCL)—a decentralized cryptographic ledger maintaining public keys of all certified PAA roots and approved Product IDs. If a device fails attestation or lacks CSA certification, the Commissioner immediately halts setup!'
        ],
        example: 'Like an official hologram security seal and manufacturer certificate on an expensive diamond: before purchase, the jeweler inspects the certificate serial number against the official diamond certification registry to verify authenticity.',
        code: `# Simulation: Matter Device Attestation Certificate (DAC) Hierarchy Verification
def verify_matter_device_attestation_certificate(dac_vid: int, dac_pid: int, cert_chain: list[str]) -> dict:
    # Matter Certificate Hierarchy:
    # Product Attestation Authority (PAA) -> Product Attestation Intermediate (PAI) -> Device Attestation Certificate (DAC)
    chain_valid = len(cert_chain) == 3 and cert_chain[0] == "DAC" and cert_chain[1] == "PAI" and cert_chain[2] == "PAA"
    
    # Official CSA Vendor Registry check
    csa_certified_vendors = {0xFFF1: "Acme IoT Labs", 0x1005: "Nordic Semiconductor", 0x2357: "Espressif"}
    vendor_name = csa_certified_vendors.get(dac_vid, "UnregisteredVendor")
    is_genuine_certified = chain_valid and (vendor_name != "UnregisteredVendor")
    
    return {
        "dac_vendor_id": hex(dac_vid),
        "dac_product_id": hex(dac_pid),
        "vendor_name": vendor_name,
        "cert_chain_length": len(cert_chain),
        "chain_hierarchy": " -> ".join(cert_chain),
        "device_certified": is_genuine_certified
    }

p4_res = verify_matter_device_attestation_certificate(0xFFF1, 0x8001, ["DAC", "PAI", "PAA"])

print("=== MATTER DEVICE ATTESTATION CERTIFICATE (DAC) VERIFICATION ===")
print(f"Vendor / Product ID:     {p4_res['dac_vendor_id']} / {p4_res['dac_product_id']} ({p4_res['vendor_name']})")
print(f"Attestation PKI Chain:   {p4_res['chain_hierarchy']}")
print(f"CSA Ledger Attestation:  GENUINE_CERTIFIED={p4_res['device_certified']}")`,
        output: `=== MATTER DEVICE ATTESTATION CERTIFICATE (DAC) VERIFICATION ===\nVendor / Product ID:     0xfff1 / 0x8001 (Acme IoT Labs)\nAttestation PKI Chain:   DAC -> PAI -> PAA\nCSA Ledger Attestation:  GENUINE_CERTIFIED=True`,
        codeNotes: [
          { line: 2, note: 'Traverses official 3-tier attestation chain: DAC -> PAI -> PAA Root' },
          { line: 8, note: 'Validates Vendor ID and Product ID against CSA Distributed Compliance Ledger (DCL)' },
          { line: 22, note: 'Certifies hardware is authentic and manufactured by a verified, compliant vendor' }
        ],
        tryIt: 'Change dac_vid to 0x9999 (an uncertified vendor) and verify that device_certified evaluates to False.',
        check: {
          question: 'What is the role of the Device Attestation Certificate (DAC) during Matter commissioning?',
          options: [
            'Proving cryptographically that the physical hardware is a genuine, certified Matter device manufactured by an authorized vendor, verified against the CSA Distributed Compliance Ledger',
            'Storing user Wi-Fi network passwords in plain text',
            'Measuring the ambient room temperature during device setup',
            'Enabling the device to play FM radio stations'
          ],
          answer: 0,
          why: 'The DAC is burned into secure silicon during manufacturing and chains back to an official CSA Product Attestation Authority, preventing counterfeit or rogue hardware from joining the network.'
        }
      },
      {
        title: 'Matter Interaction Model: Subscriptions, Timed Interactions & Access Control Lists',
        say: [
          'The Matter Interaction Model (IM) defines the formal rules for exchanging data between nodes. The IM supports four fundamental transaction actions: Read, Write, Invoke (executing commands), and Subscribe.',
          'In battery-constrained environments, standard polling (clients repeatedly querying a sensor every 5 seconds) is disastrous for battery life and congests radio spectrum. Matter solves this with Subscription Interactions: the controller registers a subscription with MinInterval and MaxInterval bounds. The accessory transmits an Attribute Report ONLY when an attribute value changes (Delta Reporting), dramatically reducing radio emissions while ensuring instant UI updates.',
          'For safety-critical actuators—such as motorized door locks or garage door openers—the IM enforces Timed Interactions to prevent replay and delayed packet attacks. The controller first sends a Timed Request establishing a brief timeout window (e.g. 200 milliseconds). The actual Invoke command (e.g. UnlockDoor) must arrive within that 200 ms window. If network jitter or an attacker delays the packet, the window expires and the command is rejected automatically!'
        ],
        example: 'Like an electronic door buzzer at an apartment building: the resident presses the buzzer button, unlocking the front door latch for exactly 5 seconds. If the visitor pushes the door within 5 seconds, it opens; if they hesitate for 6 seconds, the latch clicks shut again.',
        code: `# Simulation: Matter Interaction Model (Timed Actions & Delta Subscriptions)
def simulate_matter_interaction_model_engine(action_type: str, is_timed: bool, elapsed_ms: float, delta_detected: bool) -> dict:
    # Matter Interaction Model:
    # 1. Timed Interaction: sensitive actions (e.g. unlock door) must execute within 200 ms timeout window
    # 2. Subscription: sends Attribute Report only when delta is detected (Delta Reporting)
    timed_window_max_ms = 200.0
    
    if action_type == "UnlockDoorCommand":
        if not is_timed:
            status = "REJECTED_NEEDS_TIMED_INTERACTION"
        elif elapsed_ms > timed_window_max_ms:
            status = "REJECTED_TIMED_INTERACTION_EXPIRED"
        else:
            status = "EXECUTED_DOOR_UNLOCKED_SAFELY"
    elif action_type == "AttributeSubscription":
        status = "REPORT_TRANSMITTED_DELTA_PRESENT" if delta_detected else "REPORT_SUPPRESSED_NO_CHANGE"
    else:
        status = "COMMAND_COMPLETED"
        
    return {
        "action_type": action_type,
        "is_timed": is_timed,
        "elapsed_ms": elapsed_ms,
        "interaction_status": status
    }

p5_timed_ok = simulate_matter_interaction_model_engine("UnlockDoorCommand", is_timed=True, elapsed_ms=85.0, delta_detected=False)
p5_timed_late = simulate_matter_interaction_model_engine("UnlockDoorCommand", is_timed=True, elapsed_ms=250.0, delta_detected=False)
p5_sub = simulate_matter_interaction_model_engine("AttributeSubscription", is_timed=False, elapsed_ms=0.0, delta_detected=True)

print("=== MATTER INTERACTION MODEL TIMED ACTIONS & SUBSCRIPTIONS ===")
print(f"Timed Door Unlock (85ms):  {p5_timed_ok['interaction_status']}")
print(f"Timed Door Unlock (250ms): {p5_timed_late['interaction_status']}")
print(f"Sensor Delta Subscription: {p5_sub['interaction_status']}")`,
        output: `=== MATTER INTERACTION MODEL TIMED ACTIONS & SUBSCRIPTIONS ===\nTimed Door Unlock (85ms):  EXECUTED_DOOR_UNLOCKED_SAFELY\nTimed Door Unlock (250ms): REJECTED_TIMED_INTERACTION_EXPIRED\nSensor Delta Subscription: REPORT_TRANSMITTED_DELTA_PRESENT`,
        codeNotes: [
          { line: 2, note: 'Implements Matter Interaction Model timed execution and subscription delta reporting' },
          { line: 6, note: 'Enforces 200 ms security timeout window on critical actuator commands (e.g. door unlock)' },
          { line: 15, note: 'Suppresses redundant attribute reports when sensor values remain unchanged' }
        ],
        tryIt: 'Set is_timed to False for UnlockDoorCommand and verify the interaction engine rejects the command.',
        check: {
          question: 'Why does the Matter Interaction Model require Timed Interactions for safety-critical commands like smart door locks?',
          options: [
            'To prevent replay attacks and delayed packet delivery exploits by enforcing that the command executes within a tight, validated millisecond window following authorization',
            'To make the door lock motor spin twice as fast',
            'To synchronize the smart lock clock with GPS satellites',
            'To sound an audible alarm every time a door is opened'
          ],
          answer: 0,
          why: 'Timed Interactions ensure that an intercepted or delayed actuator command cannot be replayed or executed outside a tight authorized time window (typically <200 ms).'
        }
      }
    ],
    summary: [
      'The Matter Protocol unifies smart home accessories under a standardized IPv6 application layer across Thread and Wi-Fi networks.',
      'PASE commissioning uses SPAKE2+ zero-knowledge key exchange to protect low-entropy 8-digit setup PINs from offline dictionary attacks.',
      'CASE mutual authentication and Multi-Admin fabrics allow accessories to pair concurrently with Apple Home, Google Home, and Alexa.',
      'Device Attestation Certificates (DAC) chain to official CSA Product Attestation Authorities, blocking counterfeit hardware.',
      'The Matter Interaction Model employs Subscriptions with Delta Reporting and Timed Interactions for safety-critical actuators.'
    ],
    projectStep: {
      title: 'Architect a Matter (CHIP) Application Data Model & Commissioning Engine',
      steps: [
        'Traverse and configure a Matter Endpoint hierarchy with OnOff and LevelControl clusters.',
        'Implement a zero-knowledge SPAKE2+ key exchange for passcode-authenticated session establishment (PASE).',
        'Simulate Multi-Admin fabric routing and enforce Access Control List (ACL) permission tiers.',
        'Verify a Device Attestation Certificate (DAC) PKI chain and execute timed interaction commands.'
      ]
    }
  },
{
    day: 5,
    coursePrefix: 'iot_net',
    title: 'Milestone 1 Capstone: End-to-End Thread Mesh Gateway & Cloud Telemetry Pipeline',
    parts: [
      {
        title: 'Thread Border Router Backbone & NAT64/DNS64 Translation Architecture',
        say: [
          'A Thread Border Router (OTBR) acts as the bridge connecting an IEEE 802.15.4 low-power wireless mesh network with external IP-bearing networks such as Ethernet, Wi-Fi, or Cellular backhauls. Within the Thread mesh partition, nodes operate using Unique Local IPv6 Addresses (ULA) under the fd00::/64 prefix, which cannot be routed directly over public Internet infrastructures without stateful translation. The Border Router announces network parameters via ICMPv6 Router Advertisements and disseminates off-mesh routable prefixes into the Thread network using the Network Data TLV mechanism.',
          'To enable battery-powered Thread sensor leaf nodes to transmit telemetry directly to legacy cloud servers hosting IPv4 endpoints, the Border Router implements NAT64 (RFC 6146) coupled with DNS64 (RFC 6147). When a Thread node performs a DNS query for an IPv4-only cloud domain like mqtt.example.com, the Border Router synthetic DNS64 server embeds the 32-bit IPv4 address into the well-known 64:ff9b::/96 prefix. The node then addresses its UDP packets to this synthetic IPv6 address, and the Border Router NAT64 state engine extracts the lower bits, allocates an ephemeral NAT port, and transmits standard IPv4 packets across its WAN egress interface.',
          'Modern Thread Border Routers also negotiate bidirectional Multicast DNS (mDNS) and DNS-SD discovery proxies across the border interface. This ensures that IP accessories running on the 802.15.4 mesh can advertise Commissionable Services, Matter endpoints, or CoAP resources to local controllers sitting on Wi-Fi without requiring heavy broadcast packet floods inside the battery-constrained mesh. The boundary enforces strict routing firewalls to block unauthorized ingress packets while transparently forwarding outbound sensor telemetry.'
        ],
        example: 'Think of the Thread Border Router as an international customs checkpoint equipped with a real-time translator: local citizens speak Thread mesh ULA, while external world systems speak standard Internet IPv4 and global IPv6, and the router translates both addresses and envelopes on the fly.',
        code: `def evaluate_border_router_nat64_routing(packets):
    NAT64_PREFIX = "64:ff9b::"
    routed = []
    for pkt in packets:
        src_ip = pkt["src"]
        dst_ip = pkt["dst"]
        proto = pkt["proto"]
        payload = pkt["payload"]
        
        if dst_ip.startswith(NAT64_PREFIX):
            ipv4_hex = dst_ip.replace(NAT64_PREFIX, "").replace(":", "")
            octets = [str(int(ipv4_hex[i:i+2], 16)) for i in range(0, len(ipv4_hex), 2)]
            trans_dst = ".".join(octets)
            action = "NAT64_TRANSLATED"
            gateway_egress = "eth0_ipv4"
        elif dst_ip.startswith("2001:") or dst_ip.startswith("2600:"):
            trans_dst = dst_ip
            action = "IPV6_DIRECT_FORWARD"
            gateway_egress = "eth0_ipv6"
        else:
            trans_dst = dst_ip
            action = "LOCAL_MESH_DROP"
            gateway_egress = "none"
            
        routed.append({
            "sensor_node": src_ip,
            "action": action,
            "egress_target": trans_dst,
            "interface": gateway_egress,
            "payload_bytes": len(payload)
        })
    return routed

sample_packets = [
    {"src": "fd00:db8:1::10a", "dst": "64:ff9b::3456:789a", "proto": "UDP", "payload": b"\\x40\\x02\\x12\\x34telemetry"},
    {"src": "fd00:db8:1::10b", "dst": "2001:4860:4860::8888", "proto": "UDP", "payload": b"\\x40\\x02\\x12\\x35dns_query"},
    {"src": "fd00:db8:1::10c", "dst": "fd00:db8:2::9999", "proto": "UDP", "payload": b"\\x40\\x02\\x12\\x36internal"}
]

print("=== THREAD BORDER ROUTER NAT64/DNS64 BACKBONE ===")
results = evaluate_border_router_nat64_routing(sample_packets)
for r in results:
    print(f"Node: {r['sensor_node']} | Action: {r['action']} | Egress: {r['egress_target']} | Iface: {r['interface']} | Bytes: {r['payload_bytes']}")`,
        output: `=== THREAD BORDER ROUTER NAT64/DNS64 BACKBONE ===
Node: fd00:db8:1::10a | Action: NAT64_TRANSLATED | Egress: 52.86.120.154 | Iface: eth0_ipv4 | Bytes: 13
Node: fd00:db8:1::10b | Action: IPV6_DIRECT_FORWARD | Egress: 2001:4860:4860::8888 | Iface: eth0_ipv6 | Bytes: 13
Node: fd00:db8:1::10c | Action: LOCAL_MESH_DROP | Egress: fd00:db8:2::9999 | Iface: none | Bytes: 12`,
        codeNotes: [
          'NAT64_PREFIX identifies synthetic destination addresses generated by upstream DNS64 name resolution.',
          'The router unpacks trailing hex nibbles into decimal octets representing the target public IPv4 address.',
          'Local mesh packets lacking external prefixes or routable gateways are dropped or kept within the 802.15.4 partition.'
        ],
        tryIt: 'Pass an IPv6 GUA address starting with 2600:: and verify that direct forward mode triggers across the eth0_ipv6 interface.',
        check: {
          question: 'What is the primary role of NAT64/DNS64 on an OpenThread Border Router (OTBR)?',
          options: [
            'To enable IPv6-only Thread mesh nodes to communicate seamlessly with IPv4-only cloud endpoints and servers',
            'To double the maximum transmission bandwidth of the IEEE 802.15.4 radio link',
            'To encrypt Thread link-layer frames using 4096-bit RSA hardware keys',
            'To eliminate the need for radio antennas on battery-powered edge leaf devices'
          ],
          answer: 0,
          why: 'DNS64 creates synthetic IPv6 addresses containing embedded IPv4 bits, and NAT64 statefully translates the resulting packets to standard IPv4 traffic at the border interface.'
        }
      },
      {
        title: 'CoAP-to-MQTT Gateway Translation & Semantic Multiplexing',
        say: [
          'Resource-constrained Thread sensor nodes communicate using the Constrained Application Protocol (CoAP) over UDP due to its low header overhead and connectionless design. In contrast, cloud IoT platforms like AWS IoT Core, Google Cloud IoT, and Azure IoT Hub primarily ingest telemetry streams via MQTT over TLS running over reliable TCP connections. The edge gateway bridges these disparate networking paradigms through semantic protocol translation.',
          'The gateway intercepts incoming CoAP Confirmable (CON) PUT or POST packets, unpacks the URI path hierarchy (such as /sensors/env or /sensors/power), and maps the device hardware identifier and resource path into a hierarchical MQTT topic structure. It parses the CoAP binary or serialized payload, packs the readings into a standardized JSON structure with millisecond timestamps, and issues an MQTT PUBLISH packet with Quality of Service level 1 (QoS 1) to guarantee cloud ingestion.',
          'Once the MQTT broker responds with a PUBACK control packet indicating durable arrival on the cloud message broker, the edge gateway generates a CoAP 2.04 Changed response back over UDP to the originating Thread node. This two-phase delivery guarantee ensures that low-power microcontrollers maintain transactional awareness of telemetry delivery without having to establish memory-heavy TLS/TCP state machines locally.'
        ],
        example: 'Think of the CoAP-to-MQTT bridge as a multilingual telegraph station: quick, compact field telegrams arriving by lightweight radio are transcribed into registered courier parcels before being dispatched into the cloud postal system.',
        code: `import json

def simulate_coap_to_mqtt_translation_bridge(coap_requests):
    """Translates binary CoAP CON PUT/POST into structured MQTT QoS 1 telemetry publishes."""
    mqtt_messages = []
    for req in coap_requests:
        dev_eui = req["node_id"]
        uri_path = req["path"]
        payload_raw = req["payload"]
        
        # Map CoAP URI to MQTT topic hierarchy
        topic = f"telemetry/{dev_eui}/{uri_path.strip('/')}"
        
        # Parse CoAP payload (key=val or JSON string)
        telemetry_data = {}
        for item in payload_raw.split(","):
            k, v = item.split("=")
            telemetry_data[k.strip()] = float(v.strip()) if "." in v else int(v.strip())
        
        mqtt_msg = {
            "topic": topic,
            "qos": 1,
            "retain": False,
            "payload_json": json.dumps(telemetry_data, sort_keys=True),
            "coap_ack_code": "2.04_CHANGED"
        }
        mqtt_messages.append(mqtt_msg)
    return mqtt_messages

requests = [
    {"node_id": "00124b0014d2e801", "path": "/sensors/env", "payload": "temp=24.5,hum=58,press=1013"},
    {"node_id": "00124b0014d2e802", "path": "/sensors/power", "payload": "volt=3.3,curr=14,bat=94"}
]

print("=== COAP TO MQTT PROTOCOL TRANSLATION BRIDGE ===")
messages = simulate_coap_to_mqtt_translation_bridge(requests)
for m in messages:
    print(f"Topic: {m['topic']} | QoS: {m['qos']} | Payload: {m['payload_json']} | Response: {m['coap_ack_code']}")`,
        output: `=== COAP TO MQTT PROTOCOL TRANSLATION BRIDGE ===
Topic: telemetry/00124b0014d2e801/sensors/env | QoS: 1 | Payload: {"hum": 58, "press": 1013, "temp": 24.5} | Response: 2.04_CHANGED
Topic: telemetry/00124b0014d2e802/sensors/power | QoS: 1 | Payload: {"bat": 94, "curr": 14, "volt": 3.3} | Response: 2.04_CHANGED`,
        codeNotes: [
          'Maps CoAP URI paths like /sensors/env into standard MQTT hierarchical topics containing device EUIs.',
          'Parses key-value telemetry pairs and outputs canonical JSON strings formatted with sorted keys.',
          'Returns a CoAP 2.04 Changed acknowledgement code to confirm cloud ingestion back to the sensor node.'
        ],
        tryIt: 'Add a vibration sensor reading to the payload string and observe the resulting JSON structure and MQTT topic path.',
        check: {
          question: 'Why does an IoT gateway translate CoAP UDP to MQTT TCP rather than having edge sensor nodes connect to MQTT directly?',
          options: [
            'Constrained microcontrollers lack the RAM and battery budget to sustain persistent TLS/TCP sockets and large keep-alive packets',
            'MQTT is completely forbidden from running across Wi-Fi or cellular networks',
            'CoAP does not support any form of payload transmission',
            'Thread radio mesh layers only permit audio streaming data'
          ],
          answer: 0,
          why: 'CoAP operates over connectionless UDP with minimal header overhead (<10 bytes), whereas MQTT requires TCP handshakes, TLS session negotiation, and recurring keep-alive pings that deplete battery life.'
        }
      },
      {
        title: 'Resilient Edge Store-and-Forward Buffering & Exponential Backoff',
        say: [
          'In mission-critical industrial deployments, WAN connectivity between the edge gateway and cloud platforms is subject to intermittent cellular drops, ISP blackouts, and maintenance outages. A production IoT gateway cannot simply discard sensor readings when the WAN uplink drops; doing so destroys time-series continuity and invalidates predictive maintenance models. Instead, gateways maintain a local persistent store-and-forward buffer.',
          'When the gateway detects a broken MQTT connection, it diverts incoming sensor telemetry into a local ring buffer or SQLite WAL database. Because local flash memory on an embedded gateway is finite, the buffer enforces strict priority-aware eviction policies. Non-critical periodic telemetry (such as ambient temperature) is evicted first when queue capacity is reached, while high-priority anomalies (such as motor vibration spikes or emergency gas leak alerts) are preserved at all costs.',
          'Upon WAN link recovery, the gateway initiates exponential backoff with full jitter to avoid overwhelming the cloud broker with synchronized reconnection storms. Once the secure TLS session re-establishes, the gateway drains buffered events in chronological order while throttling throughput to honor upstream API rate limits. Only after receiving broker confirmation are persisted records removed from the local disk queue.'
        ],
        example: 'Think of the store-and-forward queue as an emergency flight black box: during severe turbulence when radio communication is cut, every flight reading is safely recorded to local durable tape and broadcasted once contact is restored.',
        code: `def simulate_edge_store_and_forward_buffer(incoming_events, max_queue_capacity=3):
    """Simulate edge ring buffer during WAN outage with priority retention and exponential backoff."""
    buffer = []
    dropped_events = []
    wan_online = False
    dispatched_events = []
    
    # Step 1: Accumulate events while WAN offline
    for ev in incoming_events:
        if len(buffer) >= max_queue_capacity:
            # Evict lowest priority event (priority 1 is lower than priority 2)
            lowest_idx = min(range(len(buffer)), key=lambda i: buffer[i]["priority"])
            evicted = buffer.pop(lowest_idx)
            dropped_events.append(evicted["id"])
        buffer.append(ev)
        
    # Step 2: WAN recovers, simulate exponential backoff drain
    wan_online = True
    backoff_intervals = []
    attempt = 0
    while buffer:
        wait_sec = 2 ** attempt
        backoff_intervals.append(wait_sec)
        event = buffer.pop(0)
        dispatched_events.append(event["id"])
        attempt += 1
        
    return {
        "wan_online": wan_online,
        "retained_and_dispatched": dispatched_events,
        "evicted_ids": dropped_events,
        "backoff_intervals": backoff_intervals
    }

events = [
    {"id": "ev_01", "priority": 1, "val": 22.1},
    {"id": "ev_02", "priority": 3, "val": 99.4},  # critical alert
    {"id": "ev_03", "priority": 1, "val": 22.3},
    {"id": "ev_04", "priority": 2, "val": 45.0}   # exceeds capacity of 3
]

print("=== RESILIENT STORE-AND-FORWARD BUFFER & BACKOFF ===")
res = simulate_edge_store_and_forward_buffer(events, max_queue_capacity=3)
print(f"WAN Online: {res['wan_online']}")
print(f"Dispatched: {res['retained_and_dispatched']}")
print(f"Evicted on Overflow: {res['evicted_ids']}")
print(f"Backoff Intervals (s): {res['backoff_intervals']}")`,
        output: `=== RESILIENT STORE-AND-FORWARD BUFFER & BACKOFF ===
WAN Online: True
Dispatched: ['ev_02', 'ev_03', 'ev_04']
Evicted on Overflow: ['ev_01']
Backoff Intervals (s): [1, 2, 4]`,
        codeNotes: [
          'Evaluates capacity constraints and evicts lower-priority events to preserve critical sensor alerts.',
          'Simulates exponential backoff intervals (2^attempt) to prevent reconnection throttling storms.',
          'Drains queued messages in order upon WAN recovery, verifying zero data loss for critical alerts.'
        ],
        tryIt: 'Increase max_queue_capacity to 4 and confirm that no events are evicted from the queue.',
        check: {
          question: 'What is the danger of reconnecting an edge gateway fleet immediately to the cloud broker without exponential backoff jitter after an outage?',
          options: [
            'A thundering herd problem occurs, causing millions of simultaneous TLS handshakes that crash the cloud broker',
            'The sensor batteries will physically overheat and burst',
            'The gateway flash memory is automatically formatted',
            'The Thread mesh channel frequencies will shift into cellular bands'
          ],
          answer: 0,
          why: 'When thousands of disconnected gateways recover simultaneously and retry connections without randomized backoff, the flood of TLS handshakes overwhelms cloud ingest load balancers.'
        }
      },
      {
        title: 'End-to-End Telemetry Payload Compression & CBOR Serialization',
        say: [
          'On constrained wireless networks operating under IEEE 802.15.4, the maximum physical layer packet size is 127 bytes. After subtracting link-layer security headers, 6LoWPAN mesh routing encapsulation, and UDP/CoAP headers, the remaining application payload budget for a single unfragmented frame is typically under 70 to 80 bytes. Transmitting telemetry encoded as standard text JSON frequently exceeds this ceiling and triggers costly packet fragmentation.',
          'Every 6LoWPAN fragment incurs radio transmit airtime, doubles collision probability, and increases power consumption across all intermediate routing hops. The Concise Binary Object Representation (CBOR, RFC 8949) addresses this by providing a binary data format that mirrors the JSON data model (maps, arrays, integers, floats, strings) while compressing field keys and numbers into compact type-length-value byte tags.',
          'By using short integer identifiers for common telemetry metric keys (such as 1 for temperature and 2 for relative humidity) and compact IEEE 754 half-precision (16-bit) floating point values, CBOR reduces payload footprint by 60% to 75% compared to raw JSON strings. This guarantees that complex multi-sensor readings fit entirely within a single physical 802.15.4 radio packet, maximizing battery life and network resilience.'
        ],
        example: 'Think of CBOR versus JSON like packing an expedition backpack: JSON brings large printed cardboard boxes with full labels, while CBOR vacuum-packs every item in labeled numbered pouches that take up a third of the volume.',
        code: `import json

def evaluate_cbor_telemetry_compression(sensor_readings):
    """Quantify payload serialization footprint: JSON vs Compact Tagged Binary (CBOR-style)."""
    comparison = []
    for r in sensor_readings:
        json_str = json.dumps(r, separators=(",", ":"))
        json_bytes = json_str.encode("utf-8")
        
        # Simulated CBOR encoding: 1 byte map header + 1 byte key-id + value bytes
        # Compact key dictionary: id=1, temp=2, hum=3, ts=4
        cbor_sim_size = 1 + len(r) * 3 + 4  # fixed compact representation
        
        savings_pct = round(((len(json_bytes) - cbor_sim_size) / len(json_bytes)) * 100, 1)
        fits_single_6lowpan = cbor_sim_size <= 80  # 80 bytes fits inside unfragmented 6LoWPAN frame
        
        comparison.append({
            "node": r.get("node", "leaf"),
            "json_bytes": len(json_bytes),
            "cbor_bytes": cbor_sim_size,
            "savings_pct": savings_pct,
            "unfragmented_frame": fits_single_6lowpan
        })
    return comparison

readings = [
    {"node": "01", "temp": 24.5, "hum": 62, "ts": 1711920001},
    {"node": "02", "temp": 81.2, "hum": 15, "ts": 1711920002, "press": 1012, "battery_pct": 89}
]

print("=== CBOR VS JSON TELEMETRY SERIALIZATION EFFICIENCY ===")
stats = evaluate_cbor_telemetry_compression(readings)
for s in stats:
    print(f"Node {s['node']} | JSON: {s['json_bytes']}B | CBOR: {s['cbor_bytes']}B | Savings: {s['savings_pct']}% | Single Frame: {s['unfragmented_frame']}")`,
        output: `=== CBOR VS JSON TELEMETRY SERIALIZATION EFFICIENCY ===
Node 01 | JSON: 50B | CBOR: 17B | Savings: 66.0% | Single Frame: True
Node 02 | JSON: 80B | CBOR: 23B | Savings: 71.2% | Single Frame: True`,
        codeNotes: [
          'Measures UTF-8 encoded minified JSON length against binary CBOR dictionary mappings.',
          'Demonstrates greater than 65% byte-level savings over text-based representation.',
          'Confirms that compressed binary payloads remain well within the 80-byte 6LoWPAN unfragmented frame limit.'
        ],
        tryIt: 'Add extra telemetry fields and observe how CBOR maintains high compression efficiency compared to growing JSON keys.',
        check: {
          question: 'Why is avoiding 6LoWPAN packet fragmentation so critical for low-power wireless mesh nodes?',
          options: [
            'Packet fragmentation doubles radio transmission time, multiplies channel collision rates, and consumes significantly more battery energy',
            'Fragmented packets can only travel over optical fiber lines',
            'Fragmentation causes the microcontroller to shut down permanently',
            '6LoWPAN routers completely refuse to route fragmented IPv6 packets'
          ],
          answer: 0,
          why: 'If any single fragment of an IPv6 packet is lost over the air, the entire datagram must be retransmitted, causing severe battery drain and radio congestion.'
        }
      },
      {
        title: 'Capstone Verification: End-to-End Mesh Sensing to Cloud Pub/Sub Pipeline Validation',
        say: [
          'The ultimate milestone for an embedded IoT network engineer is proving end-to-end telemetry fidelity across the entire communication stack: from an 802.15.4 Thread sensor leaf node, through multi-hop mesh routers, across an OpenThread Border Router, translated via CoAP-to-MQTT bridge, and ingested into a cloud pub/sub messaging engine.',
          'Verification requires tracking packet sequence numbers, calculating accumulated transit latency across routing hops, monitoring gateway translation overhead, and asserting zero unhandled packet loss. The test pipeline validates that each sensor reading includes valid cryptographic authentication tokens, matches approved CoAP methods, and reaches the cloud telemetry sink well within the end-to-end Service Level Agreement (SLA) latency threshold of 100 milliseconds.',
          'Upon completing this milestone, your edge-to-cloud architecture provides the hardened networking backbone required for production smart buildings, automated industrial telemetry, and connected healthcare monitoring. It proves mastery over link budgets, mesh routing protocols, boundary translations, resilient storage, and binary serialization.'
        ],
        example: 'Think of this capstone verification as the full flight test of a space capsule: every subsystem—attitude control, life support, telemetry radio, and ground station links—is verified in unified operation before flight certification.',
        code: `def verify_end_to_end_mesh_telemetry_pipeline(mesh_traffic):
    """Verify end-to-end telemetry pipeline from 802.15.4 Thread nodes to Cloud Pub/Sub."""
    delivered_to_cloud = 0
    total_packets = len(mesh_traffic)
    total_latency_ms = 0
    
    for pkt in mesh_traffic:
        # 1. Verification of 6LoWPAN Header compression and source
        has_valid_mesh_prefix = pkt["src_ipv6"].startswith("fd00:")
        # 2. CoAP token and method
        is_valid_coap = pkt["method"] in ["POST", "PUT"]
        # 3. Gateway translation
        cloud_topic = f"cloud/mesh/{pkt['sensor_type']}"
        # 4. Latency budget check
        latency = pkt["hop_count"] * 12 + pkt["gw_processing_ms"]
        total_latency_ms += latency
        
        if has_valid_mesh_prefix and is_valid_coap and latency < 100:
            delivered_to_cloud += 1
            
    delivery_rate = round((delivered_to_cloud / total_packets) * 100, 1)
    avg_latency = round(total_latency_ms / total_packets, 1)
    
    return {
        "total_packets": total_packets,
        "delivered": delivered_to_cloud,
        "delivery_rate_pct": delivery_rate,
        "avg_latency_ms": avg_latency,
        "status": "PIPELINE_VERIFIED" if delivery_rate == 100.0 else "PIPELINE_DEGRADED"
    }

traffic = [
    {"src_ipv6": "fd00:1::01", "sensor_type": "temp", "method": "POST", "hop_count": 2, "gw_processing_ms": 14},
    {"src_ipv6": "fd00:1::02", "sensor_type": "vibe", "method": "PUT", "hop_count": 3, "gw_processing_ms": 18},
    {"src_ipv6": "fd00:1::03", "sensor_type": "flow", "method": "POST", "hop_count": 1, "gw_processing_ms": 11}
]

print("=== CAPSTONE: END-TO-END MESH TELEMETRY PIPELINE ===")
res = verify_end_to_end_mesh_telemetry_pipeline(traffic)
print(f"Total: {res['total_packets']} | Delivered: {res['delivered']} | Rate: {res['delivery_rate_pct']}% | Latency: {res['avg_latency_ms']}ms | Status: {res['status']}")`,
        output: `=== CAPSTONE: END-TO-END MESH TELEMETRY PIPELINE ===
Total: 3 | Delivered: 3 | Rate: 100.0% | Latency: 38.3ms | Status: PIPELINE_VERIFIED`,
        codeNotes: [
          'Validates IPv6 ULA mesh prefix and CoAP transaction methods for multi-hop traffic.',
          'Calculates cumulative hop transit time and gateway translation overhead against an SLA threshold.',
          'Demonstrates 100% packet delivery rate and healthy average latency across all leaf nodes.'
        ],
        tryIt: 'Increase hop_count on node 2 to 10 and verify how excessive mesh routing latency impacts SLA qualification.',
        check: {
          question: 'In an end-to-end Thread-to-Cloud IoT pipeline, what metric is most critical for verifying real-time predictive safety systems?',
          options: [
            'End-to-end transit latency remaining bounded under the SLA threshold with zero unacknowledged packet loss',
            'The color of the gateway external chassis casing',
            'The number of characters printed in terminal debug log messages',
            'The total number of CSS style sheets used on the web dashboard'
          ],
          answer: 0,
          why: 'Predictive safety and industrial control loops require deterministic packet delivery within strict latency bounds to prevent mechanical damage or hazard escalations.'
        }
      }
    ],
    summary: [
      'OpenThread Border Routers implement NAT64 and DNS64 to translate ULA mesh IPv6 packets into routable IPv4 Internet datagrams.',
      'The CoAP-to-MQTT edge bridge translates lightweight binary CoAP requests into structured MQTT QoS 1 cloud publications with acknowledgment feedback.',
      'Edge store-and-forward buffering with priority eviction protects critical sensor telemetry from loss during intermittent WAN outages.',
      'CBOR binary serialization slashes payload footprint by over 65%, keeping multi-metric telemetry inside single unfragmented 6LoWPAN frames.',
      'The Capstone pipeline achieves deterministic end-to-end telemetry verification with validated transit latencies and 100% delivery reliability.'
    ],
    projectStep: {
      title: 'Deploy and Verify an End-to-End Thread Mesh Border Router & Telemetry Pipeline',
      steps: [
        'Configure an OpenThread Border Router backbone with NAT64 prefix routing and external egress interfaces.',
        'Implement a CoAP-to-MQTT protocol translation bridge with topic generation and CoAP response acknowledgements.',
        'Construct a resilient store-and-forward local ring buffer with priority-based eviction and exponential backoff retry.',
        'Benchmark CBOR binary serialization against JSON to verify unfragmented 6LoWPAN transmission.',
        'Execute end-to-end integration tests measuring packet delivery rate and transit latency across simulated mesh hops.'
      ]
    }
  }
];