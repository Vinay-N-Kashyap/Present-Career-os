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
  }
];
