# scripts/visuals/iot_network_spec_m1_rest.py
# Month 1, Days 16-30 (Blocks 4-6) for Course 17: IoT Wireless Networks & Protocols (course-iot-network)
# Total Quests: 60 Quests (Days 16-30)

DAYS_16_TO_30 = [
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Attribute Protocol (ATT): Attributes, Handles, UUIDs, Permissions & Default MTU",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Application Protocol Layer (ATT Data Modeling & PDU Structures)",
    "spokenGoal": "Welcome to Block 4. Now that we have established point-to-point BLE link synchronization, how is application data organized and queried? Enter the Attribute Protocol (ATT). ATT models all server data as a flat, indexed database of Attributes. Every Attribute consists of exactly four properties: a 16-bit Attribute Handle (unique index from 0x0001 to 0xFFFF), an Attribute UUID (identifying data type, either standard 16-bit like 0x2A37 for Heart Rate or custom 128-bit), an Attribute Value (variable-length binary payload), and Attribute Permissions (Read, Write, Encryption Required, Authentication Required). Examine ATT PDUs: Read Request, Read Response, Write Request, and Write Response. In legacy BLE, the default ATT MTU (Maximum Transmission Unit) is locked at only 23 bytes! Since the ATT opcode and handle consume 3 bytes, your actual application payload is constrained to a tiny 20 bytes per packet. Master handle allocation and permission enforcement before building GATT profiles.",
    "conceptInvariant": "ATT Database Flat Indexing Invariant: The ATT server exposes a strictly monotonically increasing flat array of attribute handles (Handle_i < Handle_j for i < j \u2264 0xFFFF), where each handle maps to a unique (UUID, Value, Permissions) tuple accessible via standardized 1-byte opcode PDUs.",
    "failureMode": "Assigning overlapping or non-sequential attribute handles in custom firmware, or skipping handle indices when registering services; Central discovery scanners assume ordered handle ranges and prematurely terminate service discovery, rendering subsequent characteristics completely invisible.",
    "tryItFriction": "Construct an ATT database in TypeScript: define an in-memory attribute table with handles 0x0001 through 0x0010; implement an ATT Read Request handler that validates permissions (rejecting unauthenticated requests with ATT_ERROR_INSUFFICIENT_AUTHENTICATION = 0x05); and extract values conforming to the 23-byte default MTU boundary.",
    "socraticHints": [
      "Why is the default ATT MTU set to exactly 23 bytes in the Bluetooth Core Specification?",
      "Because the baseline BLE 4.0 Link Layer packet payload was capped at 27 bytes! Subtracting 4 bytes for the L2CAP header leaves exactly 23 bytes for the ATT PDU (1 byte opcode + 2 bytes handle + 20 bytes payload).",
      "While BLE 4.2+ allows larger MTUs, every connection begins at 23 bytes until explicitly negotiated via an MTU Exchange!"
    ],
    "situationalPuzzle": {
      "scenario": "A mobile developer connects to a smart insulin pump over BLE. The app issues an ATT Read Request to Handle 0x0024 (Basal Rate Setting). The pump's ATT server immediately returns an ATT Error Response with error code 0x0F (Insufficient Encryption). The mobile app crashes with an unhandled exception. What protocol step did the mobile client skip?",
      "options": [
        "The app forgot to send an ATT MTU Exchange request.",
        "Security Manager Pairing & Encryption Handshake: The attribute at Handle 0x0024 requires encrypted access permissions. The mobile app must initiate BLE pairing and establish an AES-CCM encrypted link before requesting access to restricted medical attributes.",
        "The app used the wrong 16-bit UUID.",
        "The pump's battery voltage was too low to power the read operation."
      ],
      "answerIdx": 1,
      "debrief": "Attributes can enforce strict permission gates: read/write permissions are decoupled from security requirements. An error code of 0x0F (Insufficient Encryption) indicates that the attribute requires an authenticated, encrypted link. The Central must invoke the Security Manager Protocol (SMP) to pair and bond with the Peripheral before reading."
    },
    "quests": [
      {
        "num": 1,
        "title": "ATT Protocol Architecture & PDU Mechanics",
        "type": "Concept",
        "description": "Deconstruct the Attribute table model, 16-bit vs 128-bit UUID representation, ATT PDU opcodes, and error response codes (0x01 to 0x11)."
      },
      {
        "num": 2,
        "title": "ATT Handle Range Discovery Truncation Detective",
        "type": "Detective Challenge",
        "description": "Analyze an HCI log where an iOS device failed to discover a custom biometric sensor; identify out-of-order attribute handle allocations that broke Find By Type Value discovery."
      },
      {
        "num": 3,
        "title": "In-Memory ATT Database & Protocol Parser Engine",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript ATT protocol server that parses raw binary ATT PDUs (Read Req, Write Req, Error Rsp), manages handle tables, and enforces security permission checks."
      },
      {
        "num": 4,
        "title": "3 AM Medical Device Unauthenticated ATT Write Breach Lab",
        "type": "Production Incident Lab",
        "description": "Remediate a critical vulnerability in a connected pulse oximeter where permissive ATT permissions allowed unauthenticated external scanners to overwrite calibration parameters."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Generic Attribute Profile (GATT): Services, Characteristics, Descriptors & CCCD",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "GATT Hierarchical Modeling (Services & Descriptors)",
    "spokenGoal": "While ATT defines the raw database rows, the Generic Attribute Profile (GATT) organizes those rows into meaningful object-oriented hierarchies. Today we master GATT Architecture. At the top level sit Services (collections of related data, such as Battery Service 0x180F or Heart Rate Service 0x180D). Inside services sit Characteristics (individual data points, such as Battery Level 0x2A19). Every Characteristic is composed of at least two attributes: a Characteristic Declaration (defining properties like Read, Write, Notify, and pointing to the value handle) and the Characteristic Value itself. Attached to characteristics are Descriptors. The most critical descriptor in all of BLE is the Client Characteristic Configuration Descriptor (CCCD, UUID 0x2902). A peripheral cannot push notifications or indications to a central until the central explicitly writes 0x0001 (enable notifications) or 0x0002 (enable indications) into the CCCD!",
    "conceptInvariant": "CCCD State Authorization Invariant: A GATT Server is strictly prohibited from sending Handle Value Notifications (0x1B) or Indications (0x1D) to a client unless the client has explicitly written a non-zero authorization value (0x0001 for notify, 0x0002 for indicate) to the characteristic's CCCD (UUID 0x2902) attribute handle.",
    "failureMode": "Firmware attempting to call ble_gatts_hvx() (send notification) immediately upon connection establishment without waiting for the Central to write to the CCCD; the Bluetooth stack rejects the call with BLE_ERROR_GATTS_SYS_ATTR_MISSING, dropping all sensor telemetry.",
    "tryItFriction": "Construct a full GATT hierarchy in TypeScript: register a custom Battery Service (UUID 0x180F) with a Battery Level Characteristic (UUID 0x2A19, properties Read | Notify); create the Characteristic Declaration attribute, Value attribute, and CCCD attribute (UUID 0x2902); verify that notifications are blocked until a simulated central writes 0x0001 to the CCCD handle.",
    "socraticHints": [
      "Why does GATT use a 2-byte descriptor (CCCD) to turn on notifications rather than a simple command?",
      "Because notifications represent stateful subscriptions! The CCCD is an attribute stored in the database, allowing the server to persist subscription states across reconnections for bonded devices.",
      "Writing 0x0001 enables notifications; writing 0x0002 enables indications; writing 0x0000 disables both."
    ],
    "situationalPuzzle": {
      "scenario": "A smart watch connects to a BLE heart rate sensor. The app successfully reads the device name and battery level. But when the app navigates to the live heart rate graph, no heart rate data ever arrives. Wireshark shows the sensor is connected and transmitting connection events. What step did the smart watch app forget to perform?",
      "options": [
        "The app forgot to disconnect and reconnect at 2M PHY.",
        "The app failed to discover the CCCD descriptor (0x2902) and write 0x0001 to enable notifications on the Heart Rate Measurement characteristic.",
        "The heart rate characteristic can only be read once every 24 hours.",
        "The sensor's Bluetooth antenna was in sleep mode."
      ],
      "answerIdx": 1,
      "debrief": "By specification, Heart Rate Measurement (0x2A37) is a notify-only characteristic. A GATT Server cannot push notifications spontaneously; it requires the client to find the CCCD (0x2902) attribute handle and execute a Write Request with payload [0x01, 0x00]. Until this write completes, the sensor's firmware drops all notification attempts."
    },
    "quests": [
      {
        "num": 1,
        "title": "GATT Profile Tree & Declaration Semantics",
        "type": "Concept",
        "description": "Deconstruct Primary/Secondary Service declarations, Characteristic declarations (properties bitmask), Value handles, and Descriptor types (0x2901, 0x2902, 0x2904)."
      },
      {
        "num": 2,
        "title": "Silent Notification & Missing CCCD Detective",
        "type": "Detective Challenge",
        "description": "Diagnose an industrial sensor monitoring portal where live telemetry graphs remained blank; analyze an HCI trace proving the web app failed to discover and subscribe to the CCCD handle."
      },
      {
        "num": 3,
        "title": "Hierarchical GATT Server Engine & Service Registry",
        "type": "Mastery Assignment",
        "description": "Implement a modular TypeScript GATT Server that allows dynamic registration of services, characteristics, and descriptors, automatically assigning sequential handles and handling CCCD subscriptions."
      },
      {
        "num": 4,
        "title": "3 AM Multi-Client CCCD Desynchronization Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a production race condition in a dual-connected smart treadmill where concurrent subscription writes to CCCD from a phone and a smartwatch corrupted internal client subscription bitmaps."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "GATT Throughput Optimization: ATT MTU Exchange, Write Without Response & 2M PHY",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "High-Throughput BLE Engineering (MTU & Latency Tuning)",
    "spokenGoal": "Novice engineers often assume BLE is limited to a sluggish 1-2 kilobytes per second. Senior wireless architects know BLE 5.x can push over 1.4 Mbps (175 kB/s) of continuous throughput when properly configured! Today we master GATT Throughput Optimization. Deconstruct the three fundamental throughput levers: First, the ATT MTU Exchange. By negotiating an MTU up from 23 bytes to 247 or 517 bytes via an Exchange MTU Request/Response, packet efficiency skyrockets because Link Layer overhead (preamble, access address, CRC) is paid once for a large payload rather than 20 times for tiny fragments. Second, contrast Write Request (ATT_WRITE_REQ, which requires an ATT_WRITE_RSP round-trip confirmation taking at least one full connection interval) with Write Without Response (ATT_WRITE_CMD, unacknowledged at the ATT layer, allowing back-to-back packets within a single connection event). Third, switch from 1M PHY to 2M PHY, cutting Time-on-Air in half and doubling the number of packets fitting inside each connection event!",
    "conceptInvariant": "GATT Throughput Upper Bound Invariant: Maximum application throughput is achieved when: Throughput = (N_pkts * (MTU - 3) * 8) / Connection_Interval, where N_pkts is the maximum packets per event allowed by the controller, MTU \u2265 247 bytes, and unacknowledged ATT commands (Write Without Response or Notifications) eliminate round-trip wait states.",
    "failureMode": "Attempting to stream high-rate IMU motion data (200 Hz, 30 bytes per sample) using ATT Write Requests on a 50 ms connection interval; each write requires an application-layer response, capping throughput to exactly 1 packet per 50 ms (20 samples/sec = 600 B/s), causing massive buffer overflows and 90% data loss.",
    "tryItFriction": "Construct a BLE throughput model in TypeScript: calculate theoretical and practical throughput for a 50 ms connection interval across three configurations: (1) Default MTU 23 with Write Requests; (2) MTU 247 with Write Requests; (3) MTU 247 with Write Without Response and 6 packets per connection event on 2M PHY; prove that configuration 3 achieves >30x throughput.",
    "socraticHints": [
      "Why does Write Request strangle throughput so severely on high-latency connection intervals?",
      "Because ATT is a strict stop-and-wait protocol! The Bluetooth specification forbids a client from sending a second ATT Request while a previous ATT Request remains unacknowledged.",
      "If your connection interval is 50 ms, you can only execute ONE Write Request every 50 ms (20 writes/sec) regardless of radio speed!"
    ],
    "situationalPuzzle": {
      "scenario": "An engineering team is developing a high-resolution ECG chest patch streaming 4 kHz raw 16-bit biometric data (8,000 bytes/sec). Over BLE 4.2 with default settings (Interval = 30 ms, MTU = 23, Write Requests), the stream lags and drops 85% of packets. Which three architectural adjustments resolve this bottleneck?",
      "options": [
        "Increase transmit power to +20 dBm and add a 10-second buffer.",
        "(1) Execute ATT MTU Exchange to negotiate MTU = 247 bytes; (2) Switch from Write Requests to unacknowledged GATT Notifications (or Write Without Response); (3) Switch to 2M PHY and configure 6-8 packets per connection event, yielding >50 kB/s capacity.",
        "Switch to legacy Bluetooth Classic audio profiles.",
        "Change the advertising interval to 10 ms."
      ],
      "answerIdx": 1,
      "debrief": "With default MTU 23 and acknowledged writes, capacity is capped at 20 bytes / 30 ms \u2248 667 B/s. Negotiating MTU 247 allows 244-byte payloads. Using unacknowledged notifications permits multiple packets per connection event. On 2M PHY, pushing 4-6 packets of 244 bytes per 30 ms event delivers ~32-48 kB/s, effortlessly accommodating the 8 kB/s ECG stream."
    },
    "quests": [
      {
        "num": 1,
        "title": "Throughput Mathematics & Protocol Overhead Analysis",
        "type": "Concept",
        "description": "Analyze L2CAP segmentation, ATT MTU exchange mechanics, packet inter-frame spacing (T_IFS), and maximum packets per connection event constraints."
      },
      {
        "num": 2,
        "title": "Stop-and-Wait ATT Bottleneck Detective",
        "type": "Detective Challenge",
        "description": "Analyze an HCI log of an IoT firmware update taking 45 minutes; identify that the mobile app used blocking ATT_WRITE_REQ instead of pipelined ATT_WRITE_CMD, causing a 40x slowdown."
      },
      {
        "num": 3,
        "title": "High-Throughput BLE Streaming & MTU Negotiation Engine",
        "type": "Mastery Assignment",
        "description": "Develop a TypeScript engine that executes MTU exchange handshakes, packs variable-length data streams into optimal chunk sizes, and pipelines unacknowledged packets at line rate."
      },
      {
        "num": 4,
        "title": "3 AM Wearable Sensor Streaming Buffer Overflow Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an urgent clinical trial telemetry outage where smartwatch biometric streams stalled due to controller TX ring buffer exhaustion during 2M PHY packet bursts."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Notifications vs Indications, Flow Control & L2CAP Credit-Based Channels",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Data Streaming Architecture (Push Telemetry & L2CAP CoC)",
    "spokenGoal": "How does an embedded BLE peripheral push live data to a central application reliably without polling? Compare the two GATT push mechanisms: Notifications vs Indications. A Notification (ATT_HANDLE_VALUE_NTF) is unacknowledged at the application layer: the server sends the packet, and while the Link Layer provides ACK, the GATT layer does not wait for a response. Notifications provide maximum throughput and lowest latency. In contrast, an Indication (ATT_HANDLE_VALUE_IND) requires an explicit application-layer Confirmation (ATT_HANDLE_VALUE_CFM) from the central before another indication can be transmitted. If your application requires raw, bi-directional binary data streaming without GATT attribute overhead, explore L2CAP Credit-Based Connection-Oriented Channels (CoC). L2CAP CoC bypasses ATT completely, creating a direct, credit-based streaming socket with built-in flow control and zero handle overhead!",
    "conceptInvariant": "Indication Confirmation Locking Invariant: Once an ATT Server transmits a Handle Value Indication, it enters a locked state and is strictly prohibited from transmitting any subsequent indication until it receives a matching Handle Value Confirmation (0x1E) or the 30-second ATT transaction timer expires.",
    "failureMode": "Firing back-to-back indications from an ISR (Interrupt Service Routine) whenever an ADC reads a new sample; the second indication call crashes the BLE stack with NRF_ERROR_BUSY because the first indication has not yet received its confirmation packet from the smartphone.",
    "tryItFriction": "Implement an L2CAP Credit-Based Flow Control state machine in TypeScript: track peer credits; decrement credits upon each transmitted SDU (Service Data Unit); block transmission when credits reach zero; and handle LE Credit Based Connection Response and Flow Control Credit packets.",
    "socraticHints": [
      "Why would an engineer choose Indications over Notifications if Notifications are faster?",
      "Because Indications guarantee that the application layer on the smartphone actually processed the data! A Link Layer ACK only proves the radio receiver got the packet, not that the app didn't crash or drop it.",
      "For critical medical dosage confirmations or firmware block validations, Indications provide end-to-end receipt."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware engineer converts a sensor pipeline from Notifications to Indications to ensure zero packet loss. Telemetry reporting immediately drops from 50 packets per second to exactly 2 packets per second, and the peripheral's internal sensor queue fills up and crashes. Connection interval is 500 ms. What caused the massive throughput collapse?",
      "options": [
        "Indications consume 100x more radio power.",
        "Indication Stop-and-Wait Lockout: An Indication requires an ATT_HANDLE_VALUE_CFM from the Central before the next indication can be transmitted. Over a 500 ms connection interval, the indication-confirmation cycle takes at least 500 ms, strictly limiting throughput to 1/0.5s = 2 packets per second!",
        "The smartphone operating system blocked all Indications.",
        "The Bluetooth antenna switched to broadcast mode."
      ],
      "answerIdx": 1,
      "debrief": "Indications enforce strict application-layer stop-and-wait flow control. Only one indication can be in-flight at any time. Over a 500 ms connection interval, the confirmation from the central cannot arrive until the next connection event, capping throughput to exactly 2 packets per second. High-speed streaming must use Notifications or L2CAP CoC."
    },
    "quests": [
      {
        "num": 1,
        "title": "Notification vs Indication Protocols & L2CAP CoC",
        "type": "Concept",
        "description": "Analyze ATT_HANDLE_VALUE_NTF, ATT_HANDLE_VALUE_IND, ATT_HANDLE_VALUE_CFM, transaction timers, and L2CAP credit-based connection-oriented channel framing."
      },
      {
        "num": 2,
        "title": "Indication Deadlock & Lockout Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded crash dump where an unhandled indication confirmation timeout locked a medical infusion monitor, preventing subsequent alert transmissions."
      },
      {
        "num": 3,
        "title": "L2CAP Credit-Based Channel Streaming Engine",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript L2CAP CoC protocol entity that establishes credit-based channels, implements dynamic credit granting, handles MTU/MPS segmentation, and verifies lossless streaming."
      },
      {
        "num": 4,
        "title": "3 AM Telemetry Loss vs Flow Control Stall Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-speed telemetry stall in an industrial vibration sensor array where improper L2CAP credit replenishment caused streaming nodes to permanently pause data delivery."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: Production Asynchronous BLE GATT Server & High-Throughput Notification Streamer Engine",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Milestone 4 Synthesis (BLE Application Layer Capstone)",
    "spokenGoal": "Outstanding achievement reaching Milestone 4. Today you engineer a Production Asynchronous BLE GATT Server and High-Throughput Notification Streaming Engine in TypeScript. Your engine brings together the full application-layer BLE stack: dynamic ATT database management with automatic handle assignment, hierarchical Service and Characteristic registration with CCCD subscription tracking, MTU Exchange negotiation (supporting up to 517 bytes), and an asynchronous high-throughput Notification Streamer with flow control and ring-buffer queuing. Your engine will simulate connected Central clients reading characteristics, negotiating MTUs, enabling notifications via CCCD writes, and ingesting high-frequency sensor streams with zero buffer overrun. This milestone cements your mastery of Bluetooth engineering before we journey into Sub-GHz long-range LoRa networks.",
    "conceptInvariant": "End-to-End GATT Streaming Invariant: High-throughput GATT streaming requires that: (1) CCCD is verified active for the target client; (2) Data is packetized into chunks of size \u2264 (Negotiated_MTU - 3); and (3) Outbound packet transmission respects Link Layer buffer fullness to prevent TX queue starvation or dropped notifications.",
    "failureMode": "Allowing application code to push notifications into the GATT server faster than the Link Layer can transmit them without backpressure; the internal ring buffer overflows, silently dropping critical telemetry without notifying the application.",
    "tryItFriction": "Execute the Milestone 4 verification suite: instantiate your GATT Server with a multi-sensor profile (IMU, Temperature, Battery); connect two simulated Central clients; negotiate MTU = 247 on Client 1 and MTU = 23 on Client 2; stream 1,000 sensor readings simultaneously; verify that Client 1 achieves high-throughput packing while Client 2 correctly segments data into 20-byte chunks without cross-talk.",
    "socraticHints": [
      "How does a multi-client GATT Server manage CCCD subscriptions for different connected centrals?",
      "CCCD values MUST be stored on a per-connection basis! Client 1 subscribing to notifications must not cause the server to send notifications to Client 2 if Client 2 hasn't enabled CCCD.",
      "The GATT server maintains an internal mapping of (Connection_Handle, CCCD_Attribute_Handle) \u2192 Subscription_Bitmask."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 4 GATT Server streams high-speed accelerometer data to a mobile phone. When the phone's OS temporarily stalls to process a heavy UI render, the phone's Link Layer stops ACKing BLE packets. Your server's TX buffer fills up. What must your streaming engine do to prevent data corruption?",
      "options": [
        "Overwrite old unacknowledged packets in the ring buffer without notifying the caller.",
        "Apply backpressure: emit a 'TX_BUFFER_FULL' event to the sensor sampler, pause the ADC stream, and resume streaming only when the Link Layer fires a 'BLE_GATTS_EVT_HVN_TX_COMPLETE' buffer available event.",
        "Crash the firmware and restart the microprocessor.",
        "Silently delete all incoming sensor data."
      ],
      "answerIdx": 1,
      "debrief": "Robust embedded systems never silently drop packets or crash under backpressure. When the controller's TX buffers saturate, the GATT engine must apply backpressure to upstream data producers. Once the radio receives Link Layer ACKs and clears buffer slots, it fires TX_COMPLETE events, allowing the engine to resume pumping notifications."
    },
    "quests": [
      {
        "num": 1,
        "title": "Complete GATT Server Architecture & State Flow",
        "type": "Concept",
        "description": "Construct the comprehensive architecture diagram for a production GATT server, mapping connection handles, ATT databases, CCCD state tables, and TX ring buffers."
      },
      {
        "num": 2,
        "title": "Cross-Client CCCD Pollution & Leakage Detective",
        "type": "Detective Challenge",
        "description": "Analyze a multi-client BLE gateway bug where Client A subscribing to high-frequency telemetry caused unintended battery drain on Client B due to global instead of per-connection CCCD storage."
      },
      {
        "num": 3,
        "title": "Milestone 4 GATT Server & Streaming Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript production GATT Server featuring dynamic service discovery, MTU exchange negotiation, per-client CCCD state management, and backpressure-aware notification streaming."
      },
      {
        "num": 4,
        "title": "Milestone 4 Multi-Client High-Load Verification Lab",
        "type": "Production Incident Lab",
        "description": "Execute a stress test on the Milestone 4 engine with 10 concurrent virtual clients performing parallel MTU exchanges, reads, writes, and 500 Hz notification bursts, proving zero race conditions."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Sub-GHz Long Range (LoRa) Physics: Chirp Spread Spectrum & Processing Gain",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Long-Range LPWAN Foundations (Chirp Spread Spectrum Physics)",
    "spokenGoal": "Welcome to Block 5. Today we break free from short-range 2.4 GHz wireless and step into the world of Long Range (LoRa) Sub-GHz telemetry. While BLE and Wi-Fi reach tens of meters, LoRa communicates across 10 to 15 kilometers from a single battery-powered node! How does LoRa achieve this miraculous link margin? Through Chirp Spread Spectrum (CSS) modulation. In CSS, data is not encoded by jumping between discrete frequencies. Instead, the carrier frequency sweeps linearly across the channel bandwidth over time, creating a 'chirp'. An up-chirp sweeps from minimum to maximum frequency; a down-chirp sweeps downward. By introducing an instantaneous frequency offset into the up-chirp, LoRa encodes digital symbols. Because the chirp sweeps across the entire bandwidth, narrow-band interference and multipath fading only affect a tiny fraction of the symbol, granting phenomenal Processing Gain and enabling LoRa to demodulate signals up to 20 dB BELOW the thermal noise floor!",
    "conceptInvariant": "Chirp Spread Spectrum Processing Gain Invariant: A LoRa symbol of Spreading Factor SF comprises exactly 2^SF chips across bandwidth BW, yielding Symbol Duration T_s = 2^SF / BW and Processing Gain G_p = 10*log10(2^SF), enabling signal demodulation at Signal-to-Noise Ratios (SNR) as low as -20 dB.",
    "failureMode": "Assuming LoRa can transmit high-bandwidth audio or video; at SF12 with 125 kHz bandwidth, the raw data rate is ~250 bits per second (31 bytes/sec), meaning transmitting a single 100 KB image would occupy the radio channel for over an hour and violate spectrum regulations.",
    "tryItFriction": "Build a LoRa Chirp Spread Spectrum mathematical model in TypeScript: generate an up-chirp instantaneous frequency function f(t) = f_0 + (BW / T_s) * t; introduce cyclic frequency shifts for symbol values 0 through 2^SF - 1; plot the time-frequency spectrogram showing cyclically wrapped chirps; and verify symbol duration T_s across SF7 through SF12 at 125 kHz.",
    "socraticHints": [
      "How can a radio receiver decode a signal that is 20 dB BELOW the thermal noise floor?",
      "Through the magic of correlation and processing gain! The receiver multiplies the incoming noisy signal by a conjugate unmodulated down-chirp (de-chirping).",
      "This collapses the spread-out chirp energy into a single sharp Fourier frequency spike (an FFT bin), while uncorrelated random noise remains spread out and flat across the entire spectrum!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart utility company installs water meters in underground concrete pits. Standard FSK radios fail completely because received signal power is -128 dBm and thermal noise floor is -115 dBm (SNR = -13 dB). Why does switching to LoRa SF12 with 125 kHz bandwidth allow these meters to communicate successfully?",
      "options": [
        "LoRa uses nuclear batteries that output +40 dBm power.",
        "Demodulation Below Noise Floor: At SF12, LoRa provides ~36 dB of processing gain, allowing successful packet demodulation at SNR down to -20 dB. Since the actual SNR of -13 dB is well above the -20 dB limit, the LoRa receiver easily extracts the signal from the noise.",
        "LoRa transmits at speed of light while FSK does not.",
        "LoRa bypasses the laws of thermal physics."
      ],
      "answerIdx": 1,
      "debrief": "Traditional FSK requires a positive SNR of +6 to +10 dB to demodulate packets. When received signal is 13 dB below noise (SNR = -13 dB), FSK is completely blinded. LoRa SF12 de-chirping concentrates energy into an FFT bin, functioning down to -20 dB SNR, enabling communication deep underground."
    },
    "quests": [
      {
        "num": 1,
        "title": "Chirp Spread Spectrum & De-Chirping Mathematics",
        "type": "Concept",
        "description": "Deconstruct linear frequency chirps, instantaneous frequency equations, cyclic symbol wrapping, de-chirping multiplication, and FFT peak detection."
      },
      {
        "num": 2,
        "title": "Sub-Noise Floor Demodulation Detective",
        "type": "Detective Challenge",
        "description": "Analyze an RF spectrum capture where an SDR shows zero visible signals above noise; prove mathematically how a LoRa receiver extracted a valid telemetry payload at -17 dB SNR."
      },
      {
        "num": 3,
        "title": "LoRa CSS Waveform & Spectrogram Generator Engine",
        "type": "Mastery Assignment",
        "description": "Develop a TypeScript engine that synthesizes discrete-time I/Q samples of LoRa modulated chirps for arbitrary SF (7-12) and bandwidths, implementing de-chirping and FFT peak decoding."
      },
      {
        "num": 4,
        "title": "3 AM Underground Water Meter Network Blackout Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an outage in an underground utility deployment where seasonal water table rises attenuated signals by 12 dB, requiring dynamic Spreading Factor adaptation to restore connectivity."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "LoRa Modulation Parameters: Spreading Factors (SF7-SF12), Bandwidth & Coding Rate",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "LPWAN Physical Parameter Optimization (SF, BW & CR Trade-offs)",
    "spokenGoal": "Every LoRa transmission is governed by three critical configuration knobs: Spreading Factor (SF), Bandwidth (BW), and Coding Rate (CR). Master the trade-offs between them. Spreading Factor ranges from SF7 to SF12. Each step up in SF doubles the symbol duration (T_s = 2^SF / BW), cuts the data rate in half, but provides ~2.5 dB of additional link budget sensitivity! Crucially, signals transmitted with different Spreading Factors on the exact same frequency channel are quasi-orthogonal: a gateway can demodulate an SF7 and an SF12 packet transmitted simultaneously without collision! Bandwidth is typically 125 kHz, 250 kHz, or 500 kHz. Doubling bandwidth halves symbol duration (doubling speed) but increases thermal noise floor by 3 dB (Noise = -174 dBm/Hz + 10*log10(BW)). Finally, Coding Rate (CR = 4/5, 4/6, 4/7, 4/8) adds Forward Error Correction (FEC) parity bits, allowing the receiver to recover bit errors caused by burst interference.",
    "conceptInvariant": "LoRa Quasi-Orthogonality Invariant: Signals transmitted concurrently on the same center frequency with different Spreading Factors (e.g., SF7 and SF10) can be simultaneously demodulated by a multi-channel concentrator provided their relative power difference does not exceed the co-channel isolation threshold (~16 to 20 dB).",
    "failureMode": "Transmitting all devices in a 10,000-node smart city fleet at SF12 to 'guarantee maximum range'; Time-on-Air expands by 16x compared to SF7, causing massive channel saturation, self-collisions, and total collapse of network capacity.",
    "tryItFriction": "Construct a LoRa parameter trade-off calculator in TypeScript: compute equivalent bitrate R_b = SF * (BW / 2^SF) * (4 / (4 + CR)) for all combinations of SF (7-12), BW (125, 250, 500 kHz), and CR (1-4); verify that bitrate ranges from 21.87 kbps (SF7, 500 kHz, CR 4/5) down to 183 bps (SF12, 125 kHz, CR 4/8).",
    "socraticHints": [
      "Why is Spreading Factor orthogonality called 'quasi-orthogonal' rather than purely orthogonal?",
      "Because they are orthogonal only up to a power limit! If a nearby node transmitting at SF7 is 30 dB louder than a distant node transmitting at SF12, the loud SF7 signal's leakage will drown out the SF12 signal (the Near-Far effect).",
      "Multi-channel gateways handle this by distributing nodes across different channels and using Adaptive Data Rate (ADR) to balance power."
    ],
    "situationalPuzzle": {
      "scenario": "A precision agriculture IoT gateway receives packets from 500 soil sensors. Sensors close to the gateway (<500m) transmit at SF12 with RSSI -65 dBm. Sensors far from the gateway (5km) transmit at SF12 with RSSI -125 dBm. The gateway drops 60% of far packets whenever near sensors transmit. What network optimization solves this?",
      "options": [
        "Increase transmit power of all near sensors.",
        "Implement Adaptive Data Rate (ADR): configure near sensors to use SF7 with reduced transmit power (+2 dBm), and reserve SF12 with maximum power (+14 dBm) exclusively for distant edge nodes, maximizing network capacity and eliminating near-far blinding.",
        "Switch all sensors to 2.4 GHz Wi-Fi.",
        "Disable forward error correction on all nodes."
      ],
      "answerIdx": 1,
      "debrief": "Using SF12 for nearby sensors is a catastrophic anti-pattern. SF12 packets occupy the air 16x longer than SF7, and at -65 dBm they overpower distant -125 dBm packets. Adaptive Data Rate (ADR) forces close nodes to use SF7 and lower power, freeing up airtime and preserving gateway sensitivity for distant edge nodes."
    },
    "quests": [
      {
        "num": 1,
        "title": "LoRa Parameter Matrix & Bitrate Formulations",
        "type": "Concept",
        "description": "Deconstruct the mathematical relationships between SF, BW, CR, symbol rate, chirp duration, thermal noise floor, and receiver sensitivity."
      },
      {
        "num": 2,
        "title": "Near-Far Capture & Spreading Factor Blinding Detective",
        "type": "Detective Challenge",
        "description": "Analyze gateway reception logs showing dropped packets from remote weather stations; demonstrate how high-power local SF12 transmissions caused inter-SF interference."
      },
      {
        "num": 3,
        "title": "LoRa Bitrate & Sensitivity Optimization Matrix Engine",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript optimization engine that evaluates distance, SNR, and battery budgets to select the optimal (SF, BW, CR) configuration for maximum network throughput."
      },
      {
        "num": 4,
        "title": "3 AM Smart Agriculture Spreading Factor Collision Storm Lab",
        "type": "Production Incident Lab",
        "description": "Remediate a fleet-wide telemetry stall across 10,000 smart irrigation nodes where hardcoded SF12 firmware settings paralyzed regional gateway packet queues."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "LoRa Time-on-Air (ToA) Calculations, Low Data Rate Optimization & Header Formats",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Airtime Physics & Packet Sizing (Semtech Time-on-Air Equations)",
    "spokenGoal": "In Sub-GHz wireless, airtime is your most precious currency. Today we master LoRa Time-on-Air (ToA) Calculations. Deconstruct the physical LoRa packet structure: Preamble (typically 8 to 12 symbols), Physical Header (PHDR + PHDR_CRC, present in Explicit Header mode, omitted in Implicit mode), Payload (1 to 255 bytes), and optional 2-byte Payload CRC. Calculate Time-on-Air: ToA = (N_preamble + 4.25 + N_payload_symbols) * T_s. Master the Semtech payload symbol formula: N_payload_symbols = 8 + max(ceil((8*PL - 4*SF + 28 + 16*CRC - 20*IH) / (4*(SF - 2*DE))) * (CR + 4), 0). Examine Low Data Rate Optimization (DE / LDRO): when symbol duration T_s exceeds 16 milliseconds (mandatory for SF11 and SF12 at 125 kHz), clock drift can degrade symbol decoding. Enabling LDRO drops the effective bits per symbol by 2 (SF - 2), stabilizing reception against oscillator drift at the expense of slightly increased airtime.",
    "conceptInvariant": "Low Data Rate Optimization (LDRO) Condition Invariant: Low Data Rate Optimization must be enabled whenever Symbol Duration T_s = 2^SF / BW \u2265 16.38 milliseconds (i.e., SF11 and SF12 with BW = 125 kHz), reducing bits per symbol from SF to (SF - 2) to guarantee frequency drift tolerance.",
    "failureMode": "Mismatched LDRO settings between transmitter and receiver (transmitter sends with LDRO enabled, receiver listens with LDRO disabled); the receiver miscalculates symbol boundaries, resulting in 100% CRC error rates and complete packet rejection.",
    "tryItFriction": "Implement the exact Semtech LoRa Time-on-Air equation in TypeScript: calculate ToA in milliseconds for a 50-byte payload across SF7 through SF12 at 125 kHz with CR 4/5, CRC enabled, and preamble = 8; verify that ToA expands from 118 ms (SF7) to 2,793 ms (SF12)!",
    "socraticHints": [
      "Why does a 50-byte packet take nearly 3 SECONDS to transmit at SF12?",
      "Because at SF12 and 125 kHz, each symbol takes T_s = 2^12 / 125000 = 4096 / 125000 = 32.768 milliseconds! A 50-byte payload requires ~85 symbols. 85 * 32.768 ms \u2248 2.8 seconds!",
      "During those 2.8 seconds, the transmitter draws ~30 mA continuously, and the radio channel is 100% blocked for all other users."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware engineer tests a LoRa sensor transmitting 20 bytes on 868 MHz with SF11 and 125 kHz. The transmitter firmware sets LDRO = true. The gateway software configuration has LDRO = false. The gateway detects the preamble and RSSI is strong (-70 dBm), but every packet is discarded with 'CRC Error'. What is the root cause?",
      "options": [
        "The gateway antenna cable is too long.",
        "LDRO Configuration Desynchronization: When LDRO is active, the transmitter encodes payload symbols using (SF - 2) = 9 bits per symbol instead of 11. Because the gateway expects 11 bits per symbol, its symbol de-interleaver unpacks corrupted bit alignments, failing the payload CRC check.",
        "The battery voltage dropped during transmission.",
        "Semtech radios do not support 20-byte payloads."
      ],
      "answerIdx": 1,
      "debrief": "Low Data Rate Optimization alters the mathematical interleaver and symbol mapping. If the transmitter and receiver do not agree on the LDRO flag (which is signaled in explicit headers but must match configuration), the demodulator interprets the symbol bits with an offset, resulting in total CRC corruption."
    },
    "quests": [
      {
        "num": 1,
        "title": "LoRa Packet Framing & Exact Airtime Mathematics",
        "type": "Concept",
        "description": "Deconstruct the Semtech Time-on-Air formula, preamble duration, explicit vs implicit headers, LDRO activation criteria, and CRC overhead."
      },
      {
        "num": 2,
        "title": "Mismatched LDRO CRC Corruption Detective",
        "type": "Detective Challenge",
        "description": "Analyze an RF packet trace where SF11 packets had 100% CRC failure while SF10 packets succeeded; diagnose missing LDRO configuration flags."
      },
      {
        "num": 3,
        "title": "Semtech Time-on-Air & Battery Energy Calculator Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript calculator implementing the exact Semtech ToA specification, computing airtime, symbol counts, and mAh battery drain per transmission."
      },
      {
        "num": 4,
        "title": "3 AM Heavy Airtime Battery Depletion Crisis Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a battery drain crisis in a 5,000-sensor gas meter fleet where unintended SF12 fallback expanded average node airtime by 20x, depleting 10-year battery reserves in 6 months."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Sub-GHz Spectrum Regulations: ISM Bands, Duty Cycle Limits (1%), LBT & EIRP Caps",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Regulatory Compliance & Spectrum Ethics (ETSI / FCC Standards)",
    "spokenGoal": "Unlike Wi-Fi or Bluetooth where spectrum is relatively unconstrained, Sub-GHz bands are strictly policed by governmental regulatory bodies (ETSI in Europe, FCC in the United States). Today we master Sub-GHz Spectrum Regulations and Duty Cycle Limits. In Europe (868 MHz band), ETSI EN 300 220 mandates strict Duty Cycle Limits on unlicensed ISM bands. The primary LoRa channel band (868.0 to 868.6 MHz) imposes a 1.0% duty cycle limit. That means an individual device is legally permitted to transmit for a maximum of 36 seconds per hour! In other sub-bands, the limit drops to 0.1% (3.6 seconds per hour). In the US (902-928 MHz), the FCC does not impose duty cycles, but mandates pseudo-random Frequency Hopping Spread Spectrum (FHSS) across at least 50 channels with a maximum dwell time of 400 ms per channel. Master Listen-Before-Talk (LBT) and Maximum Equivalent Isotropically Radiated Power (EIRP caps of +14 dBm in EU, +30 dBm in US).",
    "conceptInvariant": "ETSI 1.0% Duty Cycle Invariant: In the European 868.0-868.6 MHz band, total cumulative transmission time T_tx within any rolling 1-hour window (3,600 seconds) must satisfy: \u2211 T_tx \u2264 36.0 seconds (Duty_Cycle \u2264 0.010), requiring mandatory off-time T_off \u2265 T_tx * (1 - 0.01) / 0.01 = 99 * T_tx.",
    "failureMode": "Configuring an EU 868 MHz LoRa sensor to transmit an SF12 packet (2.5 seconds airtime) every 30 seconds; the device transmits 300 seconds per hour (8.3% duty cycle), violating European law by 8x, risking severe regulatory fines and jamming neighboring utility networks.",
    "tryItFriction": "Implement an ETSI Duty Cycle Enforcement Engine in TypeScript: track a sliding 1-hour transmission log; calculate required mandatory off-time T_off = T_tx * 99 for a 1% band; reject any outbound transmission request that would breach the 36-second/hour cap with a DUTY_CYCLE_EXCEEDED error.",
    "socraticHints": [
      "If a sensor transmits an SF12 packet with 2.0 seconds Time-on-Air in a 1% duty cycle band, how long MUST it wait before transmitting again?",
      "T_off = T_tx * (1 - 0.01) / 0.01 = 2.0 * 99 = 198 seconds! That is 3 minutes and 18 seconds of mandatory radio silence!",
      "If the band is 0.1%, T_off = T_tx * 999 = 1,998 seconds (over 33 minutes)!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart parking sensor deployed in France (868 MHz, 1% duty cycle band) transmits parking spot occupancy updates. On a busy Saturday, spots turn over rapidly. A sensor transmits 15 updates in 5 minutes at SF10 (airtime = 370 ms per packet). Total airtime reaches 5.55 seconds. An emergency fire truck arrives and triggers an update. Can the sensor transmit immediately?",
      "options": [
        "Yes, emergency packets ignore radio physics.",
        "Yes, provided cumulative airtime in the rolling 1-hour window has not exceeded 36.0 seconds (5.55s + 0.37s = 5.92s < 36s), BUT the firmware's short-term leaky bucket or required off-time must be satisfied, or the packet must hop to a different sub-band with available duty quota.",
        "No, the radio is permanently bricked.",
        "Europe banned all LoRa transmissions in parking garages."
      ],
      "answerIdx": 1,
      "debrief": "ETSI regulations enforce duty cycle across an observation window of 1 hour (36 seconds max). While 5.55 seconds is well under the 36-second ceiling, individual protocol implementations often enforce inter-packet spacing (T_off = 99 * T_tx). A compliant multi-channel device can immediately hop to an alternate sub-band or channel group with its own independent 1% quota."
    },
    "quests": [
      {
        "num": 1,
        "title": "Global Spectrum Regulations & ETSI/FCC Rules",
        "type": "Concept",
        "description": "Analyze EU 868 MHz sub-bands (g1-g4), US 915 MHz FHSS rules, dwell time limits (400ms), EIRP limits, and Listen-Before-Talk (LBT) thresholds."
      },
      {
        "num": 2,
        "title": "Duty Cycle Violation & Jamming Audit Detective",
        "type": "Detective Challenge",
        "description": "Audit an offshore telemetry fleet where misconfigured firmware breached ETSI 1% limits by transmitting SF11 bursts every 20 seconds; calculate regulatory penalties and spectrum pollution."
      },
      {
        "num": 3,
        "title": "Rolling Leaky-Bucket Duty Cycle Enforcer Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript duty cycle governor that enforces rolling 1-hour airtime quotas across multiple regional sub-bands (0.1%, 1%, 10%), scheduling transmissions with exact T_off delays."
      },
      {
        "num": 4,
        "title": "3 AM Emergency Telemetry vs Regulatory Lockdown Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an architectural deadlock in an industrial leak detection network where emergency alarm bursts were suppressed by an overly rigid duty cycle limiter; implement regulatory band-hopping failovers."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone 5: LoRa CSS Modulation Simulator, Time-on-Air & Duty-Cycle Enforcement Engine",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Milestone 5 Synthesis (Sub-GHz LPWAN Core Capstone)",
    "spokenGoal": "Congratulations on completing Block 5. Today you engineer Milestone 5: a comprehensive LoRa CSS Modulation Simulator, Time-on-Air, and Duty-Cycle Enforcement Engine in TypeScript. This engine brings together the full physical and regulatory reality of Sub-GHz wireless systems. It calculates exact Time-on-Air using official Semtech formulas for any payload, spreading factor (7-12), bandwidth, coding rate, and LDRO configuration. It simulates chirp generation and receiver sensitivity thresholds (down to -137 dBm). Finally, it enforces strict ETSI rolling 1-hour duty cycle quotas (1% and 0.1% bands) and FCC 400 ms dwell-time hopping rules, queuing transmissions and scheduling mandatory off-time delays. This milestone equips you with the complete physical-layer foundation required to build multi-tier LoRaWAN networks.",
    "conceptInvariant": "LPWAN Physical & Regulatory Dual Invariant: An outbound LoRa packet is schedulable if and only if: (1) Its ToA matches the Semtech formula within 0.1 ms; (2) The target channel's rolling 1-hour airtime quota satisfies (\u2211 T_tx + ToA) \u2264 Max_Allowed_Airtime; and (3) The scheduled transmission time satisfies t \u2265 t_last_tx + T_off.",
    "failureMode": "Deploying a firmware transmission scheduler that calculates duty cycle using a simple fixed delay rather than a rolling time window; burst transmissions during sensor calibration exceed the hourly regulatory cap, blinding the device to alarms for the remainder of the hour.",
    "tryItFriction": "Execute the Milestone 5 verification suite: simulate a fleet of 20 virtual LoRa nodes with varying payload sizes (10 to 150 bytes) and spreading factors; transmit continuous telemetry; verify that your engine calculates precise ToA, automatically enables LDRO when T_s > 16 ms, and strictly throttles transmissions when approaching 36 seconds/hour in EU 868 MHz.",
    "socraticHints": [
      "Why is a sliding window duty cycle tracker superior to a fixed 1-hour bucket?",
      "Because in a fixed bucket (e.g., resets at :00 every hour), a device could legally transmit 36 seconds at :59 and another 36 seconds at :01, blasting 72 seconds in a 2-minute interval!",
      "A true rolling 60-minute window prevents this boundary burst loophole."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 5 engine evaluates a transmission request: Payload = 100 bytes, SF = 12, BW = 125 kHz, CR = 4/5, Preamble = 8, Band = EU 868.1 MHz (1% limit). Past rolling airtime is 33.5 seconds. What is the packet's ToA, and can your engine authorize transmission immediately?",
      "options": [
        "ToA is 50 ms; transmit immediately.",
        "ToA \u2248 3.98 seconds. Past airtime (33.5s) + ToA (3.98s) = 37.48s, which EXCEEDS the 36.0 second/hour limit! The engine must reject immediate transmission and schedule the packet for a future timestamp when early transmissions age out of the 1-hour window.",
        "ToA is 10 seconds; transmit anyway.",
        "The engine should increase bandwidth to 5 GHz."
      ],
      "answerIdx": 1,
      "debrief": "A 100-byte payload at SF12/125kHz has an enormous Time-on-Air of ~3.98 seconds. Adding this to the existing 33.5 seconds totals 37.48 seconds, breaching the 36.0-second limit by 1.48 seconds. The duty-cycle engine must withhold transmission until sufficient past airtime expires from the 60-minute sliding window."
    },
    "quests": [
      {
        "num": 1,
        "title": "Comprehensive LoRa Physical-Regulatory Architecture",
        "type": "Concept",
        "description": "Construct the mathematical specification unifying Semtech ToA formulations, LDRO triggers, ETSI sliding-window duty cycle math, and FCC FHSS channel hopping."
      },
      {
        "num": 2,
        "title": "Rolling Window Airtime Violation Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test trace of a LoRaWAN stack that failed European certification; pinpoint a flawed fixed-hour bucket implementation that allowed boundary burst violations."
      },
      {
        "num": 3,
        "title": "Milestone 5 LoRa Modulation & Regulatory Engine",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 5 Engine with exact ToA calculation, LDRO auto-configuration, sliding-window duty cycle enforcement, and transmission scheduling queues."
      },
      {
        "num": 4,
        "title": "Milestone 5 Multi-Band Stress & Certification Lab",
        "type": "Production Incident Lab",
        "description": "Execute a certification stress harness against the Milestone 5 engine simulating 100,000 transmission events across EU 868 and US 915 profiles, proving 100% regulatory compliance."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "LoRaWAN Architecture: End Nodes, Multi-Channel Gateways, LNS & Application Servers",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "LPWAN Network Topology (Star-of-Stars & Gateway Forwarding)",
    "spokenGoal": "While LoRa is the physical RF modulation, LoRaWAN is the open global networking protocol that connects low-power nodes to cloud applications. Today we master LoRaWAN Architecture. Contrast mesh networks with LoRaWAN's Star-of-Stars Topology. End Nodes do not route packets for each other; they broadcast directly to the ether. Any Gateway within radio range (often multiple gateways across kilometers) picks up the raw RF packet and forwards it over standard IP backhaul (Ethernet, Cellular, Wi-Fi) to a central LoRaWAN Network Server (LNS, such as The Things Network or ChirpStack). The LNS performs critical tasks: de-duplicating packets received by multiple gateways, verifying cryptographic integrity, scheduling downlink acknowledgments through the optimal gateway, and forwarding decapsulated application payloads to the Application Server.",
    "conceptInvariant": "Star-of-Stars Gateway Transparency Invariant: LoRaWAN gateways are simple, transparent RF-to-IP packet forwarders with no local network state; all routing, packet de-duplication, cryptographic authentication, and downlink scheduling are centralized entirely within the LoRaWAN Network Server (LNS).",
    "failureMode": "Designing a private LoRaWAN deployment assuming gateways store node session keys and decrypt packets locally; standard Semtech packet forwarders forward encrypted raw PHY payloads, leaving unmanaged gateways completely blind to application data.",
    "tryItFriction": "Construct a LoRaWAN Semtech UDP Packet Forwarder simulator in TypeScript: pack raw uplink payloads into PUSH_DATA JSON datagrams containing gateway EUI, timestamp, frequency, channel, RSSI, and base64-encoded PHYPayload; simulate multi-gateway reception where three gateways forward the same uplink to a simulated LNS; and implement LNS de-duplication logic.",
    "socraticHints": [
      "Why is multi-gateway reception (macro-diversity) a core strength of LoRaWAN rather than a waste of bandwidth?",
      "Because wireless uplinks are subject to sudden fading, shadowing, and interference! If Gateway A drops a packet due to localized noise, Gateway B or C 3 kilometers away might catch it cleanly.",
      "The LNS receives copies from all gateways, keeps the one with the best RSSI/SNR, and discards duplicates."
    ],
    "situationalPuzzle": {
      "scenario": "A smart utility company deploys 5,000 water meters and 10 outdoor gateways connected to ChirpStack LNS. During a storm, Gateway #4 loses its cellular backhaul. However, the meters previously served by Gateway #4 continue delivering 100% of their telemetry to the cloud with zero packet loss or reconfiguration. How is this possible?",
      "options": [
        "The water meters dynamically formed a peer-to-peer mesh network.",
        "Macro-Diversity Star-of-Stars: LoRaWAN nodes broadcast to the ether, not to a specific gateway. Neighboring Gateways #2, #5, and #8 were also receiving the RF broadcasts and forwarding them to the LNS. The loss of Gateway #4 simply reduced gateway redundancy without interrupting service.",
        "The cellular tower forwarded the radio waves over the power grid.",
        "ChirpStack automatically turned the water meters into gateways."
      ],
      "answerIdx": 1,
      "debrief": "In LoRaWAN's star-of-stars topology, end nodes are not connected or paired to any specific gateway. Transmissions are broadcast omnidirectionally. As long as at least one active gateway in the region hears the transmission and has backhaul to the LNS, the packet arrives safely in the cloud."
    },
    "quests": [
      {
        "num": 1,
        "title": "LoRaWAN Network Hierarchy & Packet Forwarder Protocols",
        "type": "Concept",
        "description": "Analyze the roles of End Nodes, SX1302 Concentrator Gateways, Semtech UDP / Basics Station forwarders, Network Servers, and Join Servers."
      },
      {
        "num": 2,
        "title": "LNS Packet De-Duplication & Gateway Selection Detective",
        "type": "Detective Challenge",
        "description": "Inspect an LNS trace where an end node uplink was received by 7 gateways; analyze how the LNS selects the optimal gateway for downlink scheduling based on RSSI and SNR."
      },
      {
        "num": 3,
        "title": "Semtech UDP Packet Forwarder & LNS De-duplicator Engine",
        "type": "Mastery Assignment",
        "description": "Implement a TypeScript LNS ingestion engine that receives JSON PUSH_DATA datagrams from simulated gateways, de-duplicates redundant uplinks within a 200 ms window, and extracts PHYPayloads."
      },
      {
        "num": 4,
        "title": "3 AM Cellular Backhaul Collapse & LNS Failover Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a regional telemetry crisis where a major cellular carrier outage disconnected 15 out of 20 city gateways; evaluate macro-diversity coverage margins and gateway backlog recovery."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "LoRaWAN Device Activation: OTAA (Join Request/Accept) vs ABP & Replay Defense",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Security Activation Handshakes (OTAA vs ABP & DevNonce Dynamics)",
    "spokenGoal": "How does a fresh LoRaWAN node establish secure cryptographic credentials with the network? Contrast the two activation methods: Activation By Personalization (ABP) versus Over-The-Air Activation (OTAA). In ABP, device address (DevAddr) and encryption keys (NwkSKey, AppSKey) are hardcoded at the factory. If an ABP device loses power or resets its frame counter, it becomes permanently desynchronized or vulnerable to replay attacks! In contrast, OTAA is the gold standard for production IoT. The node is provisioned with only a globally unique Device EUI (DevEUI), Join EUI (AppEUI), and a root cryptographic AppKey. Trace the OTAA Join Handshake: the node broadcasts an unencrypted Join-Request containing DevEUI and a strictly incrementing DevNonce, protected by an AES-128-CMAC Message Integrity Code (MIC). The Join Server validates the DevNonce against past values, generates a cryptographically random JoinNonce, and returns an encrypted Join-Accept. Both sides derive fresh dynamic session keys (NwkSKey and AppSKey).",
    "conceptInvariant": "DevNonce Monotonic Increment & Anti-Replay Invariant: In LoRaWAN 1.0.4 and 1.1, the 16-bit DevNonce must strictly increment monotonically with every Join-Request; the Join Server must permanently remember the highest DevNonce and reject any Join-Request where DevNonce \u2264 Last_Recorded_DevNonce to prevent replay attacks.",
    "failureMode": "Reusing random or non-volatile reset DevNonces (e.g., node boots and starts DevNonce at 0x0001 after every power cycle); the Join Server rejects the Join-Request as a replay attack, leaving the rebooted sensor permanently disconnected from the network.",
    "tryItFriction": "Implement the LoRaWAN OTAA Join-Request encoder and MIC calculator in TypeScript: construct the 18-byte MHDR | JoinEUI | DevEUI | DevNonce structure; compute the 4-byte MIC using AES-128-CMAC over the payload with AppKey; and verify that re-using an old DevNonce is detected and rejected.",
    "socraticHints": [
      "Why did LoRaWAN 1.0.4 switch DevNonce from a random number to a strictly incrementing counter?",
      "Because with a 16-bit random number, the Birthday Paradox guarantees a 50% collision probability after only ~300 re-joins! If a random DevNonce collided with a previously recorded nonce, the join would fail.",
      "A strictly incrementing counter guarantees 65,535 unique, non-repeating joins."
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of solar-powered LoRaWAN weather stations reboots every morning at sunrise due to overnight battery depletion. After three days of operation, every station fails to join the network. Radio sniffs show stations broadcasting Join-Requests, but the Network Server completely ignores them. What fatal firmware flaw caused this lockout?",
      "options": [
        "The solar panel polarity was reversed.",
        "DevNonce Reset in Volatile RAM: The firmware stored the DevNonce counter in volatile RAM. Upon each morning reboot, DevNonce reset to 0. The Join Server already recorded DevNonces 0, 1, and 2, and rejected all subsequent morning Join-Requests as replay attacks. Storing DevNonce in non-volatile flash or EEPROM resolves the issue.",
        "The AppKey expired after 48 hours.",
        "The weather stations exceeded the speed of light."
      ],
      "answerIdx": 1,
      "debrief": "The LoRaWAN specification strictly mandates that DevNonce must never repeat. If a device resets its counter upon reboot, the LNS correctly identifies the repeated nonce as a potential replay attack and silently drops the packet. DevNonce must be persisted across reboots in non-volatile storage (Flash or EEPROM)."
    },
    "quests": [
      {
        "num": 1,
        "title": "OTAA vs ABP Mechanics & Key Derivation Mathematics",
        "type": "Concept",
        "description": "Deconstruct Join-Request, Join-Accept, AES-128-CMAC MIC calculation, and the derivation of NwkSKey and AppSKey from AppKey, AppNonce, and NetID."
      },
      {
        "num": 2,
        "title": "DevNonce Replay Lockout Detective",
        "type": "Detective Challenge",
        "description": "Analyze a ChirpStack event log where 500 smart streetlights failed to rejoin after a grid power outage; diagnose volatile DevNonce memory wiping."
      },
      {
        "num": 3,
        "title": "LoRaWAN OTAA Join Engine & Session Key Deriver",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript engine that serializes Join-Requests, validates AES-128-CMAC MICs, simulates the Join Server response, and derives NwkSKey and AppSKey session keys."
      },
      {
        "num": 4,
        "title": "3 AM City-Wide Smart Meter Join Replay Outage Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency rejoin storm across 20,000 smart water meters following an LNS database restoration where restored server nonces desynchronized from field devices."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "LoRaWAN Cryptographic Security: AppKey, NwkSKey, AppSKey & Frame Counters",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Protocol Cryptography & Frame Counter Integrity (AES-CCM* & Security)",
    "spokenGoal": "How does LoRaWAN achieve end-to-end data privacy when packets traverse untrusted intermediate gateways and public cloud networks? Today we master LoRaWAN Cryptographic Security. LoRaWAN employs a dual-key architecture that cleanly separates network routing from application payload security. The Network Session Key (NwkSKey) is used by the MAC layer: it authenticates every packet by generating a 4-byte Message Integrity Code (MIC) using AES-128-CMAC, preventing packet tampering, spoofing, and rogue injections. The Application Session Key (AppSKey) encrypts the actual user payload (FRMPayload) end-to-end using AES-128 in CTR (Counter) mode. Even if an attacker controls the gateway or intercepts traffic at the Network Server, they cannot read the user data! Crucially, examine Uplink and Downlink Frame Counters (FCntUp and FCntDown). Frame counters increment with every packet and are factored into the AES keystream and MIC calculation. If an attacker replays a captured packet, the LNS rejects it because the frame counter has already passed!",
    "conceptInvariant": "End-to-End Cryptographic Dual-Key Separation Invariant: The MAC layer payload integrity is validated by the Network Server using NwkSKey via AES-128-CMAC MIC, while the application payload FRMPayload is encrypted end-to-end using AppSKey via AES-128-CTR, ensuring the network operator can never decrypt application telemetry.",
    "failureMode": "Sharing the same root AppKey across an entire production fleet of 50,000 devices; extracting the firmware from a single lost sensor exposes the global AppKey, allowing an attacker to forge Join-Requests, decrypt past traffic, and compromise the entire city infrastructure.",
    "tryItFriction": "Implement LoRaWAN FRMPayload AES-128-CTR encryption and decryption in TypeScript: construct the standard 16-byte Block A_i (0x01 | 0x00*4 | Dir | DevAddr | FCnt | 0x00 | i); encrypt a plaintext JSON telemetry string using AES-128 with AppSKey; decrypt it and verify payload identity.",
    "socraticHints": [
      "Can a LoRaWAN Network Server read the temperature readings inside an encrypted sensor packet?",
      "NO! The Network Server only possesses NwkSKey, which it uses to verify the MIC and decrypt MAC commands.",
      "The application payload is encrypted with AppSKey, which is only held by the end node and the customer's private Application Server!"
    ],
    "situationalPuzzle": {
      "scenario": "A malicious actor captures a valid LoRaWAN telemetry packet transmitted by a smart factory vibration sensor at 10:00 AM (FCntUp = 142). At 10:15 AM, the attacker re-transmits the identical raw radio packet using an SDR. The LNS logs the packet reception but immediately drops it without forwarding to the application server. Why did the attack fail?",
      "options": [
        "The SDR transmitted on the wrong radio frequency.",
        "Frame Counter Anti-Replay Defense: The LNS maintains the highest received FCntUp for the device (which had advanced to 145 by 10:15 AM). Since the replayed packet contains FCntUp = 142 (\u2264 145), the LNS detects an obsolete counter and discards the packet as a replay attack.",
        "LoRa radio waves have a 5-minute half-life.",
        "The sensor's battery serial number was invalidated."
      ],
      "answerIdx": 1,
      "debrief": "LoRaWAN frame counters provide robust protection against replay attacks. The LNS tracks the monotonic uplink counter FCntUp. Any incoming packet whose frame counter is less than or equal to the current counter is discarded immediately. Because the counter is included in the cryptographic MIC, the attacker cannot tamper with the counter without invalidating the MIC."
    },
    "quests": [
      {
        "num": 1,
        "title": "LoRaWAN Dual-Key Security & AES-CTR/CMAC Math",
        "type": "Concept",
        "description": "Deconstruct NwkSKey vs AppSKey separation, Block A_i / B_0 formatting, AES-128-CTR keystream generation, and AES-CMAC MIC validation."
      },
      {
        "num": 2,
        "title": "Frame Counter Desynchronization Detective",
        "type": "Detective Challenge",
        "description": "Analyze an incident where an ABP sensor stopped delivering data after a power outage; demonstrate how the node's FCntUp reset to 0 while the LNS counter remained at 5,420."
      },
      {
        "num": 3,
        "title": "LoRaWAN AES-128 Cryptographic Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript encryption and decryption module for LoRaWAN payloads, implementing exact Block A construction, CTR streaming, and MIC verification."
      },
      {
        "num": 4,
        "title": "3 AM Global AppKey Compromise & Key Rotation Lab",
        "type": "Production Incident Lab",
        "description": "Execute an emergency key rotation campaign for a connected vehicle fleet where a reverse-engineered module exposed a shared provisioning key, migrating all nodes to unique per-device keys."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "LoRaWAN Device Classes: Class A (RX1/RX2 Windows), Class B (Beacons) & Class C",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Device Operating Modes & Downlink Scheduling (Class A/B/C)",
    "spokenGoal": "Not all IoT devices have the same power and latency requirements. A soil sensor running on a coin cell has vastly different needs than an electrically powered street light. Today we master LoRaWAN Device Classes: Class A, Class B, and Class C. Class A (All devices, battery-optimized): the device sleeps continuously. It can only receive downlinks immediately following an uplink transmission! Exactly 1.0 second after completing an uplink, the node opens Receive Window 1 (RX1) on the uplink channel. If no downlink is received, it opens Receive Window 2 (RX2) at 2.0 seconds on a fixed default frequency and data rate. Class A offers the lowest battery consumption but highest downlink latency. Class B (Beacon-synchronized): gateways broadcast periodic time-synchronized Beacons (every 128 seconds). End nodes open scheduled periodic 'ping slots' to receive downlinks without transmitting uplinks first. Class C (Continuous listening): the receiver remains powered ON 100% of the time except during transmissions. Class C provides zero-latency downlinks for mains-powered actuators like smart valves or streetlights.",
    "conceptInvariant": "Class A Downlink Window Determinism Invariant: In Class A operation, downlink packets can ONLY be received during RX1 (t = RECEIVE_DELAY1 \u00b1 20 \u03bcs) or RX2 (t = RECEIVE_DELAY2 \u00b1 20 \u03bcs) following an uplink; outside these microsecond-precise windows, the node's radio receiver is powered OFF.",
    "failureMode": "Attempting to push immediate downlinks to a Class A battery-powered sensor from a cloud dashboard; the LNS must queue the downlink in an offline buffer until the end node happens to transmit its next scheduled uplink (which might be 24 hours later!).",
    "tryItFriction": "Implement a Class A RX1/RX2 timing scheduler in TypeScript: calculate precise millisecond opening timestamps for RX1 (default 1,000 ms) and RX2 (default 2,000 ms); configure channel and data rate parameters (RX1 uses uplink channel with offset DR; RX2 uses fixed 869.525 MHz at SF12/SF9); and simulate downlink reception matching.",
    "socraticHints": [
      "Why can't you send an instant firmware reboot command to a Class A LoRaWAN sensor?",
      "Because the sensor's radio receiver is turned OFF to save battery! It cannot hear any RF signals while sleeping.",
      "The reboot command stays in the LNS downlink queue until the sensor wakes up to transmit data, opens RX1/RX2, and downloads the command."
    ],
    "situationalPuzzle": {
      "scenario": "A municipal city operator needs to control 10,000 smart streetlights. Lights must turn ON or OFF within 2 seconds of a central command. The lights are connected directly to city mains electricity (no battery constraints). Which LoRaWAN device class is the correct architectural choice?",
      "options": [
        "Class A, because it uses the least bandwidth.",
        "Class C, because the lights have mains power and can keep their receivers continuously powered ON, allowing the LNS to push downlinks instantly without waiting for an uplink.",
        "Class B, because streetlights only need to turn on once a year.",
        "Class D (Direct satellite uplink)."
      ],
      "answerIdx": 1,
      "debrief": "Class C devices maintain continuous receiver operation (drawing 10-15 mA continuously). Because streetlights are connected to mains AC power, battery consumption is irrelevant. Class C allows the LNS to transmit downlink switching commands instantly at any second, easily meeting the 2-second latency requirement."
    },
    "quests": [
      {
        "num": 1,
        "title": "Class A, B, and C Operational Architectures",
        "type": "Concept",
        "description": "Deconstruct Class A RX1/RX2 window timing physics, Class B GPS-synchronized gateway beacons and ping slots, and Class C continuous listening."
      },
      {
        "num": 2,
        "title": "Class A Downlink Latency & Buffer Overflow Detective",
        "type": "Detective Challenge",
        "description": "Analyze an LNS queue dump where 50 configuration downlinks piled up for an agricultural sensor; explain why pushing commands to sleeping Class A devices requires queued state machines."
      },
      {
        "num": 3,
        "title": "LoRaWAN Class A/B/C Multi-Mode State Machine Engine",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript state machine supporting Class A RX1/RX2 window timing, Class B beacon tracking and ping-slot scheduling, and Class C instant downlink processing."
      },
      {
        "num": 4,
        "title": "3 AM Emergency Smart Valve Downlink Failure Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity gas pipeline safety incident where an emergency shutoff command was delayed by 45 minutes because the actuator was erroneously commissioned in Class A mode instead of Class C."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexLink Multi-Radio Sub-GHz LoRaWAN & Low-Power BLE Industrial Telemetry Gateway Capstone Viva Gate",
    "stageName": "Stage 2: Core Protocols",
    "stageNum": 2,
    "pedagogicalRole": "Month 1 Capstone Defense (Integrated Multi-Radio Wireless Gateway Architecture)",
    "spokenGoal": "Congratulations! You have reached the Month 1 Capstone of Course 17: the ApexLink Multi-Radio Industrial Telemetry Gateway Capstone. Today you synthesize everything learned across Months 1: RF link budget equations, impedance matching, IEEE 802.15.4 framing and CSMA/CA, the complete BLE 5.x stack (GAP, ATT, GATT, MTU exchange, high-throughput notification streaming), and the complete LoRa/LoRaWAN subsystem (CSS modulation, ToA calculations, ETSI 1% duty cycle regulation, OTAA activation, AES-128 dual-key security, and Class A/C downlinks). In this Capstone, you will architect, implement, and defend ApexLink: a sovereign multi-radio edge node that ingests high-frequency local BLE sensor streams, enforces strict duty-cycle and link budgets, encodes payloads into secure LoRaWAN frames, and bridges industrial field telemetry across 15 kilometers to the cloud. Prepare for your Senior Wireless Architecture Viva Gate!",
    "conceptInvariant": "Multi-Radio Gateway Invariant: The ApexLink gateway must concurrently maintain BLE Central GATT streaming links while servicing LoRaWAN Class A/C uplinks without RF co-existence desensitization, enforcing strict ETSI 1% regulatory quotas and zero data loss across heterogenous protocol boundaries.",
    "failureMode": "Transmitting a +14 dBm LoRa uplink simultaneously while receiving a -90 dBm BLE GATT packet on an unshielded dual-radio PCB; the LoRa transmission front-end harmonics saturate the 2.4 GHz LNA (Low Noise Amplifier), causing complete BLE packet drop and connection termination.",
    "tryItFriction": "Execute the comprehensive ApexLink Capstone test harness: instantiate the multi-radio gateway engine; connect 4 BLE Peripheral sensors streaming temperature and vibration; aggregate telemetry; serialize into encrypted LoRaWAN 1.0.4 OTAA frames; verify ETSI 1% duty cycle throttling; and pass all 25 automated architectural unit and stress tests.",
    "socraticHints": [
      "How do industrial hardware designs prevent a Sub-GHz transmitter from blinding a co-located 2.4 GHz BLE receiver?",
      "Through RF Coexistence filtering and physical antenna separation! High-Q bandpass filters on both the Sub-GHz and 2.4 GHz front-ends attenuate harmonic spillover by >40 dB.",
      "Additionally, firmware-level Time-Division Multiplexing (TDM) or radio coexistence GPIO signaling (PTA - Packet Traffic Arbitration) temporarily pauses BLE reception during high-power LoRa bursts."
    ],
    "situationalPuzzle": {
      "scenario": "During your Capstone 1 Viva Gate, the Principal Hardware Architect asks: 'Your ApexLink gateway aggregates vibration data from 8 BLE sensors and forwards hourly summaries over LoRaWAN. In an emergency, a sensor detects bearing failure. The gateway must immediately transmit an alarm over LoRaWAN, but its rolling 1-hour duty cycle quota is at 35.8 seconds (only 0.2s remaining). What does your architecture do?'",
      "options": [
        "Transmit anyway and ignore government regulations.",
        "Execute Emergency Band-Hopping Failover: Switch from the saturated 868.1 MHz 1% sub-band to the 869.4-869.65 MHz sub-band (ETSI band g3), which permits up to 10% duty cycle and higher transmit power (+27 dBm / 500 mW), transmitting the alarm packet immediately with 100% legal compliance.",
        "Wait 58 minutes until the 1-hour rolling window resets.",
        "Drop the emergency alarm packet."
      ],
      "answerIdx": 1,
      "debrief": "A master wireless architect knows the full ETSI spectrum map. While the default LoRa channels (868.1-868.5 MHz) have a 1% limit, the 869.4-869.65 MHz band (channel 869.525 MHz) is designated for high-power (+27 dBm) applications with a generous 10% duty cycle limit (360 seconds/hour). The ApexLink gateway hops to this band to transmit critical alarms immediately and legally."
    },
    "quests": [
      {
        "num": 1,
        "title": "ApexLink Multi-Radio System Architecture Specification",
        "type": "Concept",
        "description": "Construct the complete system architecture document for ApexLink, detailing BLE GATT client ingestion, internal aggregation buffers, and LoRaWAN OTAA transmission pipelines."
      },
      {
        "num": 2,
        "title": "RF Coexistence & Front-End Blinding Detective",
        "type": "Detective Challenge",
        "description": "Analyze an oscilloscope and spectrum analyzer capture showing a BLE link drop precisely aligned with LoRa PA ramp-up; evaluate RF filtering and PTA coexistence signals."
      },
      {
        "num": 3,
        "title": "ApexLink Multi-Radio Industrial Gateway Engine",
        "type": "Mastery Assignment",
        "description": "Build the complete production TypeScript ApexLink Gateway Engine integrating BLE GATT central client drivers, ring buffer aggregation, LoRaWAN packetization, and ETSI duty-cycle governance."
      },
      {
        "num": 4,
        "title": "ApexLink Capstone 1 Senior Viva Defense & Chaos Gate",
        "type": "Production Incident Lab",
        "description": "Defend your Month 1 Capstone under live chaos injection: simulate simultaneous BLE packet bursts, Wi-Fi co-channel interference, and LoRa duty-cycle exhaustion, proving 100% link survival."
      }
    ]
  }
]
