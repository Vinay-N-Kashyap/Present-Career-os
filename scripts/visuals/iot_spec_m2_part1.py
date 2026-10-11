# scripts/visuals/iot_spec_m2_part1.py
# Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded)
# Month 2: Days 31-45 (Blocks 7-9) - 60 Quests Total

IOT_M2_PART1 = [
  # =========================================================================
  # BLOCK 7: WIRELESS IOT NETWORKS & LOW-POWER RF (BLE, WIFI, LORAWAN, THREAD) (Days 31-35)
  # =========================================================================
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Bluetooth Low Energy (BLE): GAP/GATT Profiles, Services, Characteristics & Advertising Physics",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Short-Range Wireless Engineering (BLE Stack & GATT Client/Server Architecture)",
    "spokenGoal": "Master the dominant short-range IoT protocol: Bluetooth Low Energy (BLE 5.0). Understand the two core protocol layers: Generic Access Profile (GAP: Advertising, Scanning, Peripheral vs Central roles) and Generic Attribute Profile (GATT: Services, Characteristics, Descriptors, Client vs Server). Analyze 2.4GHz RF advertising physics: 3 advertising channels (37, 38, 39) that avoid Wi-Fi interference, Advertising Intervals, and Connection Intervals. Implement custom 128-bit UUID services with read, write, notify, and indicate attributes.",
    "conceptInvariant": "Connection Event Sleep Invariant: In a connected BLE peripheral, the radio must sleep between scheduled Connection Events (Connection Interval = 7.5ms to 4.0s), waking only for a microsecond burst to exchange packets; slave latency allows the peripheral to skip up to N connection events if it has no data, preserving micro-amp current draw.",
    "failureMode": "Configuring a BLE advertising interval of 20ms on a coin-cell sensor; continuous 2.4GHz radio transmission draws 12mA continuously, draining a CR2032 battery in 18 hours instead of lasting 2 years.",
    "tryItFriction": "Construct a BLE Custom Peripheral in C (ESP32 / nRF52): define a custom 128-bit UUID Sensor Service with an Environmental Data Characteristic; configure Read and Notify properties; enable Client Characteristic Configuration Descriptor (CCCD 0x2902); and push temperature notifications to a smartphone central.",
    "socraticHints": [
      "What is the difference between a BLE 'Notification' and an 'Indication'?",
      "A Notification is unacknowledged (the peripheral transmits and immediately sleeps, maximum throughput); an Indication requires an application-level ACK from the central before the next packet can be sent (slower, but guaranteed delivery)!",
      "Use Notifications for high-rate sensor streams; use Indications for critical state changes."
    ],
    "situationalPuzzle": {
      "scenario": "A medical pulse oximeter transmits heart-rate data over BLE. The app developer complains: 'When I enable notifications, I receive 20 updates per second for 5 seconds, then the connection abruptly drops with error 0x13 (Remote User Terminated Connection) or 0x08 (Connection Timeout).' Inspecting firmware shows the sensor task pushes notifications in a tight while(1) loop without delay. Why did the BLE connection terminate?",
      "options": [
        "Bluetooth only supports 1 notification per minute.",
        "GATT TX Buffer Saturation & Supervision Timeout: The firmware flooded the controller's internal BLE packet queue faster than the agreed Connection Interval could transmit them over the air. The controller ran out of packet buffers, dropped keep-alive Link Layer ACK packets, and triggered a BLE Supervision Timeout, dropping the connection!",
        "The smartphone ran out of disk space.",
        "2.4GHz radio waves melted the antenna."
      ],
      "answerIdx": 1,
      "debrief": "BLE packets are strictly bound by the agreed Connection Interval. Flooding the GATT notification buffer faster than connection events can clear them exhausts controller memory and starves Link Layer supervision keep-alives, causing connection drops."
    },
    "quests": [
      {
        "id": "iot-m2-d31-q1",
        "name": "BLE Energy Consumption & Connection Interval Math",
        "type": "concept",
        "desc": "Calculate average microamp current draw as a function of Connection Interval, Slave Latency, and radio TX peak current."
      },
      {
        "id": "iot-m2-d31-q2",
        "name": "BLE Advertising Packet & Wi-Fi Channel Coexistence Analyzer",
        "type": "detective",
        "desc": "Inspect RF spectrum analyzer traces to observe how BLE channels 37, 38, 39 fit between Wi-Fi channels 1, 6, and 11."
      },
      {
        "id": "iot-m2-d31-q3",
        "name": "Custom GATT Service & Notification Engine",
        "type": "mastery",
        "desc": "Implement a full BLE peripheral firmware in C with 128-bit UUIDs, secure pairing, CCCD notifications, and bond storage in Flash."
      },
      {
        "id": "iot-m2-d31-q4",
        "name": "3 AM SRE: Continuous BLE Drops in Hospital Patient Monitor",
        "type": "incident",
        "desc": "Diagnose and fix a buffer exhaustion bug where high-frequency ECG notifications triggered BLE link layer supervision timeouts."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Embedded Wi-Fi & TCP/IP Sockets: Station vs SoftAP, LwIP Stack & Embedded TLS Physics",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "IP Networking for Constrained Hardware (Embedded Wi-Fi, LwIP & TLS Handshakes)",
    "spokenGoal": "Connect microcontrollers directly to the Internet: master Embedded Wi-Fi and TCP/IP stacks. Understand Wi-Fi operating modes: Station Mode (connecting to home/office routers) and SoftAP (creating an independent Wi-Fi access point for mobile phone onboarding and provisioning). Explore the LwIP (Lightweight IP) stack: raw TCP/IP vs BSD socket APIs, packet buffers (pbufs), and memory pool footprints. Confront the brutal physics of Embedded TLS (Transport Layer Security via MbedTLS): RSA/ECC public key cryptography, certificate validation, and managing 32KB RAM allocations for TLS record buffers on a 64KB MCU.",
    "conceptInvariant": "Socket Non-Blocking Invariant: Embedded network socket operations (connect, read, write) must be configured non-blocking (O_NONBLOCK) with select()/poll() timeouts, preventing an unresponsive cloud gateway or Wi-Fi drop from permanently freezing the local RTOS task.",
    "failureMode": "Attempting to perform a TLS 1.3 handshake with a 4096-bit RSA certificate on a microcontroller with 32KB of free RAM; the large certificate and asymmetric math exhaust SRAM, causing MbedTLS to fail with out-of-memory error -0x7F00.",
    "tryItFriction": "Build an Embedded HTTPS Client in C using LwIP and MbedTLS: connect to Wi-Fi in Station mode, resolve cloud DNS, execute a TLS 1.3 handshake using an ECC P-256 certificate (ECDSA), send a secure HTTP POST with sensor JSON, and handle connection closure.",
    "socraticHints": [
      "Why is Elliptic Curve Cryptography (ECDSA P-256) vastly superior to RSA for microcontroller TLS handshakes?",
      "Because ECDSA keys and certificates are tiny (256 bits vs 2048/4096 bits for RSA) and require vastly less RAM and CPU calculation time!",
      "ECC certificates fit easily within scarce MCU memory budgets and complete handshakes in 80ms instead of 1,200ms."
    ],
    "situationalPuzzle": {
      "scenario": "An IoT smart thermostat connects to cloud servers over TLS using MbedTLS on an ESP32. In the lab, it connects instantly. When deployed at customer homes, connections randomly fail with 'MBEDTLS_ERR_X509_CERT_VERIFY_FAILED: Certificate validity period check failed'. The server certificate is valid until 2028. Why does the MCU reject the certificate?",
      "options": [
        "The customer router has a virus.",
        "Unsynchronized Real-Time Clock (RTC): Microcontrollers have no battery-backed RTC by default and boot with timestamp January 1, 1970 (Unix epoch 0)! When MbedTLS checks the certificate, it compares the validity start date (e.g., 2024) against 1970 and rejects it as 'Not Yet Valid'! Firmware MUST synchronize time via NTP before verifying TLS certificates.",
        "Wi-Fi does not support encryption.",
        "The ESP32 was hacked."
      ],
      "answerIdx": 1,
      "debrief": "TLS certificate verification requires an accurate local clock to verify validity dates ('Not Before' and 'Not After'). Embedded devices must execute an SNTP (Network Time Protocol) query to set system time before initiating any secure TLS connections."
    },
    "quests": [
      {
        "id": "iot-m2-d32-q1",
        "name": "LwIP PBUF Memory Architecture & TCP Window Math",
        "type": "concept",
        "desc": "Calculate RAM footprint for TCP send/receive buffers, MSS (Maximum Segment Size), and LwIP pbuf allocation pools."
      },
      {
        "id": "iot-m2-d32-q2",
        "name": "TLS 1.3 Handshake Memory Profiler (MbedTLS)",
        "type": "detective",
        "desc": "Profile dynamic heap allocation during RSA-2048 versus ECC-256 TLS handshakes using runtime heap trace hooks."
      },
      {
        "id": "iot-m2-d32-q3",
        "name": "SoftAP Wi-Fi Provisioning & HTTPS Client Engine",
        "type": "mastery",
        "desc": "Implement a complete C provisioning engine: boots in SoftAP for captive-portal credential entry, switches to Station, syncs SNTP, and connects via TLS."
      },
      {
        "id": "iot-m2-d32-q4",
        "name": "3 AM SRE: Fleet-Wide TLS Handshake Outage After New Year",
        "type": "incident",
        "desc": "Resolve a global outage where 50,000 smart plugs disconnected simultaneously due to an unhandled NTP drift rejecting cloud TLS certificates."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Sub-GHz Long Range (LoRa & LoRaWAN): Chirp Spread Spectrum, Spreading Factors & Link Budgets",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Long-Range Low-Power RF (LoRaWAN Modulation & LPWAN Topologies)",
    "spokenGoal": "Transmit sensor telemetry over 15 kilometers on milliwatts of power: master LoRa and LoRaWAN. Understand the physical layer: Chirp Spread Spectrum (CSS) modulation, sweeping frequencies continuously to achieve extraordinary receiver sensitivity (-138 dBm) capable of decoding signals 20 dB BELOW the thermal noise floor. Master Spreading Factors (SF7 to SF12), Signal Bandwidth (125kHz), and Coding Rates (4/5 to 4/8). Deconstruct the LoRaWAN MAC architecture: Class A (uplink followed by 2 receive windows), Class B (beacon-synchronized), Class C (continuous listening), and regional ISM regulatory Duty Cycle limits (1% in Europe).",
    "conceptInvariant": "Regional Duty Cycle Invariant: Sub-GHz ISM radio transmitters (868MHz / 915MHz) must strictly enforce the legal 1% duty cycle limit (maximum 36 seconds of airtime per hour); firmware must track cumulative Time-on-Air (ToA) and enforce backoff delays before transmitting.",
    "failureMode": "Transmitting a 50-byte packet every 10 seconds at SF12 (Time-on-Air = 1.48 seconds per packet); within 4 minutes, the device exhausts its hourly legal duty cycle allowance, violating telecommunications regulations and jamming the gateway.",
    "tryItFriction": "Construct a LoRaWAN Class A Node in C (SX1262 / SX1276 transceiver over SPI): calculate Time-on-Air (ToA) for a 20-byte payload, execute Over-The-Air Activation (OTAA) with JoinEUI and AppKey, establish cryptographic session keys (NwkSKey, AppSKey), and transmit telemetry with uplink counter tracking.",
    "socraticHints": [
      "What happens to range, data rate, and battery consumption as you increase the LoRa Spreading Factor from SF7 to SF12?",
      "Increasing SF doubles the chirp duration per step: receiver sensitivity improves by ~3dB per factor (doubling range), but data rate plummets and Time-on-Air increases by ~10x, consuming 10x more battery power per transmission!",
      "Adaptive Data Rate (ADR) dynamically optimizes SF based on signal strength to minimize airtime."
    ],
    "situationalPuzzle": {
      "scenario": "An agricultural soil sensor fleet uses LoRaWAN OTAA. A farmer installs 50 sensors in a field. In year 2, battery replacements occur. When all 50 sensors reboot simultaneously, none of them successfully connect to the gateway. The gateway logs show thousands of Join-Request collisions. What protocol oversight caused this join storm, and how does LoRaWAN mitigate it?",
      "options": [
        "The soil absorbed all radio waves.",
        "Join-Request Storm & Missing Random Jitter: When 50 nodes reboot simultaneously without randomized startup delays, they all transmit Join-Request frames at the exact same instant on default channels, colliding repeatedly. The LoRaWAN specification requires nodes to implement randomized exponential backoff delays between join attempts to eliminate synchronization collisions.",
        "LoRaWAN gateways only support 1 node.",
        "The AppKey expired."
      ],
      "answerIdx": 1,
      "debrief": "Join storms occur when large fleets reboot together (after power outages or battery changes). Standard LoRaWAN firmware must implement randomized initial backoffs and exponential backoff intervals between join attempts to maintain channel availability."
    },
    "quests": [
      {
        "id": "iot-m2-d33-q1",
        "name": "LoRa Time-on-Air (ToA) & Link Budget Derivation",
        "type": "concept",
        "desc": "Calculate exact airtime, symbol duration, and link budget (dB) across SF7-SF12 for 125kHz bandwidth."
      },
      {
        "id": "iot-m2-d33-q2",
        "name": "1% Regional Duty Cycle Enforcer Disassembler",
        "type": "detective",
        "desc": "Implement a Time-on-Air tracker in C and verify that non-volatile state blocks transmissions once 36 seconds/hour is reached."
      },
      {
        "id": "iot-m2-d33-q3",
        "name": "LoRaWAN Class A OTAA Stack Implementation",
        "type": "mastery",
        "desc": "Build an end-to-end LoRaWAN node in C implementing OTAA join, AES-128 MIC verification, frame counter persistence, and RX1/RX2 windows."
      },
      {
        "id": "iot-m2-d33-q4",
        "name": "3 AM SRE: Smart Agriculture Gateway Collision Storm",
        "type": "incident",
        "desc": "Resolve a regional farm telemetry blackout caused by synchronized join-request collisions after a utility power restoration."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "IEEE 802.15.4 Mesh Networks: Zigbee, Thread, Sleepy End Devices & Matter Protocol",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Mesh Networking & Smart Home Protocols (802.15.4, Thread & Matter Topologies)",
    "spokenGoal": "Architect self-healing wireless networks across hundreds of devices: master IEEE 802.15.4, Thread, and Matter. Understand 802.15.4 PHY/MAC layers: 2.4GHz Direct Sequence Spread Spectrum (DSSS), CSMA/CA channel access, and 16 channels. Compare Zigbee (application-layer silos) against Thread (pure IPv6 6LoWPAN mesh routing). Deconstruct node roles: Thread Leader, Routers (mains-powered mesh nodes forwarding packets), and Sleepy End Devices (SEDs: battery-powered sensors that sleep 99% of the time, polling parent routers for queued packets). Explore Matter: the unified application layer over Thread and Wi-Fi.",
    "conceptInvariant": "Mesh Hop Determinism Invariant: In an 802.15.4 wireless mesh, battery-powered Sleepy End Devices must never route traffic for other nodes; all multi-hop packet forwarding must be performed strictly by mains-powered Router nodes maintaining active neighbor tables.",
    "failureMode": "Configuring a battery-powered door lock as a Thread Router instead of a Sleepy End Device; the lock stays awake 100% of the time routing mesh traffic for neighboring light bulbs, draining four AA batteries in 48 hours.",
    "tryItFriction": "Implement an OpenThread Sensor Node in C: join an existing Thread mesh network, register as a Sleepy End Device with a 3-second poll period, send an IPv6 UDP sensor packet to a border router, and verify that the sleep current drops to < 10 microamps between polls.",
    "socraticHints": [
      "What is 6LoWPAN and why is it essential for running IPv6 over 802.15.4 mesh radios?",
      "Standard IPv6 requires a minimum packet MTU of 1280 bytes, but 802.15.4 physical frames have a maximum size of only 127 bytes! 6LoWPAN compresses IPv6 headers and handles packet fragmentation and reassembly at the link layer!",
      "It allows microcontrollers to communicate via standard IPv6 addresses over tiny RF packets."
    ],
    "situationalPuzzle": {
      "scenario": "A smart home building deploys 200 Thread lights and sensors. An engineer turns off 5 router lights on the 2nd floor during maintenance. Immediately, 30 temperature sensors in adjacent rooms disconnect. After 15 seconds, all 30 sensors automatically reconnect and resume reporting without manual intervention. What self-healing mechanism occurred in the mesh?",
      "options": [
        "The sensors switched to 5G cellular.",
        "Thread Mesh Self-Healing & Dynamic Route Recalculation: When parent routers went offline, the Sleepy End Devices detected lost parent ACKs and initiated parent discovery. Simultaneously, surviving surrounding Routers used Distance Vector Routing (MLE - Mesh Link Establishment) to update routing tables, re-establishing alternative parent links seamlessly.",
        "The lights turned back on by themselves.",
        "IEEE 802.15.4 does not support mesh routing."
      ],
      "answerIdx": 1,
      "debrief": "Thread is a true self-healing IPv6 mesh. Unlike star networks (Wi-Fi/BLE), if a router fails, neighboring routers re-converge routes dynamically, and child end devices attach to alternative healthy parents without service disruption."
    },
    "quests": [
      {
        "id": "iot-m2-d34-q1",
        "name": "6LoWPAN Header Compression & Fragmentation Math",
        "type": "concept",
        "desc": "Calculate byte savings achieved by IPHC header compression when mapping 40-byte IPv6 + 8-byte UDP headers into 802.15.4 frames."
      },
      {
        "id": "iot-m2-d34-q2",
        "name": "Thread Mesh Link Establishment (MLE) Trace Analyzer",
        "type": "detective",
        "desc": "Trace network packets to observe Parent Request, Parent Response, and Child ID Request sequences during node attachment."
      },
      {
        "id": "iot-m2-d34-q3",
        "name": "OpenThread Sleepy End Device (SED) Firmware",
        "type": "mastery",
        "desc": "Build an ultra-low-power Thread node in C with configurable poll periods, CoAP telemetry reporting, and non-volatile network credentials."
      },
      {
        "id": "iot-m2-d34-q4",
        "name": "3 AM SRE: Smart Building Mesh Network Routing Loop Cascade",
        "type": "incident",
        "desc": "Diagnose an office building IoT outage where a corrupted router partition induced continuous route-request flooding, exhausting network bandwidth."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone 6: Low-Power Multi-Radio Wireless Mesh Gateway Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone (Multi-Radio Wireless Systems Integration)",
    "spokenGoal": "Architect, construct, and defend Milestone 6: the Low-Power Multi-Radio Wireless Mesh Gateway Engine. Build a dual-core embedded gateway in C that bridges local short-range mesh networks (BLE 5.0 or 802.15.4 Thread) to long-range cloud uplinks (Wi-Fi or LoRaWAN). Enforce radio coexistence: manage RF antenna contention when Wi-Fi and Bluetooth share the 2.4GHz band via hardware PTA (Packet Traffic Arbitration), implement zero-copy protocol translation, and maintain an ultra-low-power sleep profile with deterministic message routing.",
    "conceptInvariant": "Radio Coexistence Invariant: When 2.4GHz Wi-Fi and Bluetooth share a single physical antenna or PCB substrate, hardware Packet Traffic Arbitration (PTA) must arbitrate transmit requests by priority (e.g., BLE connection keep-alive > Wi-Fi bulk TCP), preventing radio collisions from crashing active links.",
    "failureMode": "Transmitting a 100KB Wi-Fi TCP burst at full power (+20 dBm) without PTA while receiving a delicate BLE packet (-85 dBm); the massive Wi-Fi transmission overpowers the BLE front-end LNA, corrupting the packet and disconnecting the BLE peripheral.",
    "tryItFriction": "Compile and run Milestone 6: connect 5 BLE temperature sensors to the gateway, bridge telemetry packets into an 802.15.4 Thread mesh or Wi-Fi MQTT stream, simulate RF jamming on one channel, and prove that the gateway maintains continuous data throughput with zero lost packets.",
    "socraticHints": [
      "What is Packet Traffic Arbitration (PTA) in multi-radio embedded chips?",
      "It is a dedicated hardware signaling interface (usually 3 wires: REQUEST, PRIORITY, GRANT) that coordinates between the Wi-Fi and Bluetooth basebands before transmitting!",
      "It ensures that only one radio transmits at any given microsecond, preventing high-power transmissions from blinding nearby receivers."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 6 defense, the evaluator activates a high-power 2.4GHz microwave RF noise source. Your gateway's Wi-Fi connection drops, but the 5 BLE sensors are still actively streaming data. How does your gateway prevent sensor data loss until Wi-Fi recovers?",
      "options": [
        "Throw away all incoming sensor packets.",
        "Local Flash Ring-Buffer Spillover: The gateway detects socket disconnect; instead of blocking or discarding packets, it seamlessly routes incoming BLE telemetry into an onboard LittleFS circular flash buffer. When Wi-Fi reconnects and re-establishes TLS, a background spooler task drains the flash buffer in chronological order with zero data loss.",
        "Reboot the gateway every 5 seconds.",
        "Switch all radios to 50GHz."
      ],
      "answerIdx": 1,
      "debrief": "A production IoT gateway must never assume continuous internet connectivity. Local non-volatile store-and-forward spooling (in SPI Flash or EEPROM) ensures that telemetry collected during network outages is safely preserved and drained upon reconnection."
    },
    "quests": [
      {
        "id": "iot-m2-d35-q1",
        "name": "Multi-Radio 2.4GHz PTA Coexistence State Machine",
        "type": "concept",
        "desc": "Diagram the 3-wire hardware PTA protocol (REQUEST, PRIORITY, GRANT) and calculate collision probabilities under concurrent traffic."
      },
      {
        "id": "iot-m2-d35-q2",
        "name": "RF Front-End Intermodulation & Desensitization Profiler",
        "type": "detective",
        "desc": "Measure receiver sensitivity drop (desense in dB) when Wi-Fi transmits at +20 dBm adjacent to a BLE receiver on a shared PCB."
      },
      {
        "id": "iot-m2-d35-q3",
        "name": "Multi-Radio Wireless Mesh Gateway Build",
        "type": "mastery",
        "desc": "Build the complete dual-radio gateway firmware in C integrating BLE peripheral aggregation, local flash spooling, and Wi-Fi MQTT forwarding."
      },
      {
        "id": "iot-m2-d35-q4",
        "name": "Milestone 6 Defense: RF Jamming & Link Disruption Chaos Lab",
        "type": "incident",
        "desc": "Defend the gateway platform under live 2.4GHz RF jamming and simulated cloud network partitions before a senior evaluator panel."
      }
    ]
  },

  # =========================================================================
  # BLOCK 8: INDUSTRIAL IOT PROTOCOLS & CLOUD TELEMETRY (MQTT, COAP, MODBUS) (Days 36-40)
  # =========================================================================
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees & Last Will and Testament",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Telemetry Protocol Engineering (MQTT Specification & Quality of Service Guarantees)",
    "spokenGoal": "Master the lingua franca of IoT cloud telemetry: MQTT 3.1.1 and MQTT 5.0. Deconstruct the publish/subscribe architecture: broker decoupling, topic hierarchical trees (e.g., 'factories/us-east/line1/temp'), wildcards (+ and #), and variable-length integer encoding. Master Quality of Service (QoS): QoS 0 (At most once, best effort), QoS 1 (At least once, PUBACK required, duplicate risk), and QoS 2 (Exactly once, 4-step PUBREC/PUBREL/PUBCOMP handshake). Implement the Last Will and Testament (LWT) mechanism so the cloud immediately detects device disconnects when battery dies or cable cuts.",
    "conceptInvariant": "Idempotent QoS 1 Telemetry Invariant: When transmitting over lossy networks using QoS 1, firmware must treat all telemetry ingestion as idempotent; because network dropouts during PUBACK return trigger retransmissions, every payload must carry a unique sequence number or UUID to allow deduplication.",
    "failureMode": "Using MQTT QoS 2 for high-frequency (100Hz) sensor telemetry; the 4-way packet handshake per measurement saturates low-bandwidth cellular/satellite links, inflating data bills by 800% and introducing massive latency queues.",
    "tryItFriction": "Implement an Embedded MQTT Client in C: construct raw binary MQTT CONNECT packets with clean session flags and Last Will topic/message; publish sensor readings with QoS 1; process incoming PUBACK packets; and handle keep-alive PINGREQ intervals within strict timing tolerances.",
    "socraticHints": [
      "How does MQTT encode the remaining length field in packet headers?",
      "It uses a variable-length integer scheme where the lower 7 bits of each byte encode value (0-127), and bit 7 is a continuation bit indicating more bytes follow!",
      "This allows small packets to consume only 1 byte of length overhead while supporting payloads up to 268MB."
    ],
    "situationalPuzzle": {
      "scenario": "A factory has 1,000 smart vibration sensors connected via MQTT to AWS IoT Core with a 60-second Keep-Alive. A forklift cuts the main Ethernet cable to the factory switch. All 1,000 connections die physically. Yet, the cloud dashboard shows all 1,000 sensors as 'ONLINE' for the next 90 seconds. Why did the cloud take 90 seconds to discover the disconnect, and what protocol parameter governs this?",
      "options": [
        "AWS IoT Core crashed.",
        "Keep-Alive Window & 1.5x Multiplier: In the MQTT specification, a broker only declares a client disconnected if NO packets or PINGREQs are received within 1.5 times the configured Keep-Alive interval (1.5 * 60s = 90 seconds)! Only after this timer expires does the broker publish the client's Last Will and Testament (LWT) to alert the dashboard.",
        "The Ethernet cable magically reconnected.",
        "MQTT does not support disconnect detection."
      ],
      "answerIdx": 1,
      "debrief": "Disconnect detection in TCP-based protocols is governed by Keep-Alive timers. If a physical link dies without sending a TCP FIN, the server cannot know until the Keep-Alive window (typically 1.5x Keep-Alive in MQTT) expires without a PINGREQ."
    },
    "quests": [
      {
        "id": "iot-m2-d36-q1",
        "name": "MQTT Variable-Length Integer & Packet Layout Math",
        "type": "concept",
        "desc": "Calculate byte layouts and bit encodings for CONNECT, PUBLISH, PUBACK, PINGREQ, and DISCONNECT packets."
      },
      {
        "id": "iot-m2-d36-q2",
        "name": "QoS 0 vs 1 vs 2 Network Overhead & Latency Analyzer",
        "type": "detective",
        "desc": "Capture Wireshark packet traces measuring total round-trip bytes and latencies across QoS levels during simulated packet loss."
      },
      {
        "id": "iot-m2-d36-q3",
        "name": "Bare-Metal Embedded MQTT Client in C",
        "type": "mastery",
        "desc": "Build a zero-dependency C MQTT client implementing stateful reconnects, QoS 1 retransmit buffers, and Last Will and Testament."
      },
      {
        "id": "iot-m2-d36-q4",
        "name": "3 AM SRE: Telemetry Message Storm After Cloud Broker Outage",
        "type": "incident",
        "desc": "Triage a cloud broker reconnection storm where 100,000 IoT devices reconnected simultaneously with unthrottled QoS 1 queues."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages & The Observe Pattern",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Constrained IP Telemetry (CoAP RFC 7252 & UDP-Based Micro-Web Architecture)",
    "spokenGoal": "Achieve RESTful web semantics on tiny 8-bit and 32-bit devices: master the Constrained Application Protocol (CoAP, RFC 7252). Understand why TCP and HTTP are too bloated for constrained IoT devices: 3-way handshakes, large header strings, and connection state. Deconstruct CoAP: running over lightweight UDP with a tiny 4-byte fixed binary header, URI path options, and standard REST methods (GET, POST, PUT, DELETE). Master Confirmable (CON) vs Non-Confirmable (NON) messages, exponential backoff retransmission timers, Block-wise transfers for large payloads, and the Observe Pattern (RFC 7641) for reactive publish/subscribe over UDP.",
    "conceptInvariant": "Minimal Header UDP Invariant: CoAP request and response transactions must execute over stateless UDP transport with a fixed 4-byte binary header, enabling complete REST transactions to fit within a single 802.15.4 radio packet (< 127 bytes) with zero connection setup overhead.",
    "failureMode": "Transmitting a 2KB firmware block in a single standard CoAP packet over 6LoWPAN; because 802.15.4 frame limit is 127 bytes, link-layer fragmentation splits it into 18 fragments; if a single fragment is lost in noise, the entire 2KB packet is dropped without recovery.",
    "tryItFriction": "Implement a CoAP Server in C on top of UDP sockets: parse incoming binary headers, match URI-Path option '/sensors/temp', return a CON 2.05 Content response with CBOR payload, and implement the Observe option to automatically stream updates to registered client IPs when temperature changes.",
    "socraticHints": [
      "What is the CoAP Observe Pattern and how does it replace periodic HTTP GET polling?",
      "A client sends a single GET request with the Observe option flag set! The CoAP server registers the client's IP and port, and automatically streams asynchronous UDP response packets whenever the resource state updates!",
      "It provides efficient publish/subscribe semantics using standard REST URIs over UDP."
    ],
    "situationalPuzzle": {
      "scenario": "A smart streetlight network uses CoAP over UDP. A control station sends Confirmable (CON) commands: 'PUT /light?state=on'. When a remote light acknowledges with an ACK containing the matching 16-bit Message ID, the controller crashes with 'Unexpected Token'. Inspecting the packet shows the ACK has Code 0.00 (Empty ACK) followed 200ms later by a separate CON packet with Code 2.04 (Changed). What CoAP response pattern is this?",
      "options": [
        "The streetlight sent corrupted packets.",
        "Separate Response Pattern: In CoAP, if a server cannot compute or complete the requested action immediately (e.g., turning on physical high-power lamps), it immediately returns an Empty ACK (0.00) to stop the client's retransmission timer, and later sends a separate Confirmable (CON) response containing the final outcome!",
        "CoAP does not allow Empty ACKs.",
        "The streetlight lost power."
      ],
      "answerIdx": 1,
      "debrief": "CoAP elegantly supports both 'Piggybacked' responses (response data inside the ACK) and 'Separate' responses (Empty ACK followed by a separate CON message). Embedded clients must handle both models without crashing."
    },
    "quests": [
      {
        "id": "iot-m2-d37-q1",
        "name": "CoAP 4-Byte Binary Header & Option Delta Encoding Math",
        "type": "concept",
        "desc": "Deconstruct binary bit fields: Version, Type (CON/NON/ACK/RST), Code, Message ID, and Delta Option parsing algorithms."
      },
      {
        "id": "iot-m2-d37-q2",
        "name": "CoAP Block-wise Transfer (Block1/Block2) Protocol Analyzer",
        "type": "detective",
        "desc": "Inspect Wireshark traces of large file transfers broken into SZX 64-byte blocks with More-Flag (M) sequencing over lossy UDP."
      },
      {
        "id": "iot-m2-d37-q3",
        "name": "Full CoAP Server with Observe & Block-wise Transfer",
        "type": "mastery",
        "desc": "Build an embedded CoAP server in C with dynamic resource registration, Observe client subscriber lists, and Block2 slice handling."
      },
      {
        "id": "iot-m2-d37-q4",
        "name": "3 AM SRE: Streetlight Network Frozen by UDP Amplification Attack",
        "type": "incident",
        "desc": "Remediate a municipal smart lighting crisis where open CoAP UDP ports were targeted by reflection attacks, saturating gateway bandwidth."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Modbus RTU & Modbus TCP: Master-Slave Polling, Holding Registers & RS-485 Differential Transceivers",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Industrial Legacy Automation (Modbus Specification & RS-485 Hardware Buses)",
    "spokenGoal": "Interface with the industrial equipment powering global factories, power plants, and oil refineries: master Modbus RTU and Modbus TCP. Understand the physical layer: RS-485 balanced differential signaling (A and B lines) supporting up to 32 devices across 1,200 meters. Master the master-slave polling architecture: Function Codes (FC 01 Read Coils, FC 03 Read Holding Registers, FC 06 Write Single Register, FC 16 Write Multiple Registers). Analyze Modbus RTU framing: the strict 3.5-character silent interval (t3.5) demarcating message boundaries, and Modbus CRC-16 polynomial computation (0xA001). Compare it with Modbus TCP (MBAP 7-byte header over port 502).",
    "conceptInvariant": "Frame Timing Separation Invariant: In Modbus RTU, message frame boundaries are strictly defined by physical bus silence: an inter-character delay exceeding 1.5 characters (t1.5) triggers a frame error, and a silence exceeding 3.5 characters (t3.5) marks the end of the frame.",
    "failureMode": "Failing to calculate t3.5 baud-dependent timer intervals; at 9600 baud, t3.5 is 4.01ms; if software checks registers before 4ms of silence elapse, consecutive Modbus frames are merged into a single corrupted packet with invalid CRC.",
    "tryItFriction": "Construct a Modbus RTU Slave Driver in C: configure UART with an RS-485 transceiver direction pin (DE/RE), implement a hardware timer for t1.5 and t3.5 frame silence detection, parse FC 03 Read Holding Registers, compute and verify Modbus CRC-16, and respond within 20 milliseconds.",
    "socraticHints": [
      "Why does RS-485 communication require a dedicated GPIO pin (Driver Enable / Receiver Enable - DE/RE)?",
      "Because RS-485 is a half-duplex bus! To transmit, the microcontroller must assert the DE pin HIGH to turn on the transmitter, and immediately pull it LOW after the last stop bit to release the bus so other nodes can transmit!",
      "If software leaves DE high, it jams the bus and prevents slaves from responding."
    ],
    "situationalPuzzle": {
      "scenario": "An industrial solar inverter communicates with a PLC over RS-485 Modbus RTU. The inverter firmware developer toggles the RS-485 DE pin: 'GPIO_Set(DE); UART_Send(packet); GPIO_Clear(DE);'. The PLC never receives any response. Probing with an oscilloscope shows the last 2 bytes of every response frame are completely cut off! What went wrong with the DE pin clearing?",
      "options": [
        "The PLC was turned off.",
        "Premature DE Deassertion on TXE instead of TC: The software cleared the DE pin when the CPU finished writing the last byte to the UART Data Register (or when TXE asserted), while the hardware UART shift register was still physically transmitting the final bits over the wire! The RS-485 transceiver shut off mid-transmission, truncating the CRC bytes. Firmware MUST wait for the Transmission Complete (TC) flag before clearing DE!",
        "RS-485 does not support solar inverters.",
        "The CRC-16 was too long."
      ],
      "answerIdx": 1,
      "debrief": "Clearing the RS-485 Driver Enable (DE) pin too early is a notorious embedded mistake. Software must wait for the TC (Transmission Complete) hardware flag, confirming that the last stop bit has physically exited the shift register onto the cable, before pulling DE low."
    },
    "quests": [
      {
        "id": "iot-m2-d38-q1",
        "name": "Modbus RTU t1.5 / t3.5 Silent Interval Math",
        "type": "concept",
        "desc": "Calculate exact microsecond timing bounds for character timeouts and frame boundaries across standard baud rates (9600 to 115200)."
      },
      {
        "id": "iot-m2-d38-q2",
        "name": "Modbus CRC-16 Bitwise & Lookup Table Benchmark",
        "type": "detective",
        "desc": "Benchmark execution clock cycles of bit-by-bit polynomial division versus 256-entry lookup table CRC-16 computation."
      },
      {
        "id": "iot-m2-d38-q3",
        "name": "Industrial Modbus RTU Slave Driver with RS-485 Direction Control",
        "type": "mastery",
        "desc": "Implement a full Modbus RTU slave engine in C supporting FC 01, 03, 06, 16 with TC-synchronized DE pin switching."
      },
      {
        "id": "iot-m2-d38-q4",
        "name": "3 AM SRE: Chemical Plant PLC Communication Lockup",
        "type": "incident",
        "desc": "Triage a chemical reactor shutdown caused by a stuck RS-485 DE pin jamming a multi-drop Modbus bus line."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Compact Binary Serialization: Protocol Buffers (NanoPB), CBOR (RFC 8949) & MessagePack",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Data Optimization & Protocol Efficiency (Compact Binary Serialization)",
    "spokenGoal": "Stop wasting precious bandwidth and CPU cycles on bloated JSON text: master compact binary serialization formats for embedded systems. Compare JSON (human-readable, huge string parsing overhead, high memory) against binary formats: Protocol Buffers (NanoPB: strongly-typed, schema-compiled, zero-copy deserialization), Concise Binary Object Representation (CBOR, RFC 8949: binary JSON with self-describing tags), and MessagePack. Analyze byte efficiency: how an 85-byte JSON telemetry payload compresses into 14 bytes in NanoPB or 22 bytes in CBOR, slashing cellular and satellite IoT data bills by 75%.",
    "conceptInvariant": "Zero-Allocation Deserialization Invariant: Embedded serialization decoders must decode binary payloads directly in-place or into statically allocated structs without invoking dynamic memory allocations (malloc) during parsing.",
    "failureMode": "Using standard cJSON on a microcontroller to parse an incoming 2KB cloud message; cJSON allocates hundreds of tiny memory nodes for every object key and value, fragmenting the heap and crashing with an Out of Memory fault.",
    "tryItFriction": "Define a .proto schema for an IoT sensor telemetry packet; compile it using NanoPB (nanopb_generator); write C code to serialize the telemetry struct into a compact byte stream; and benchmark the binary size and CPU serialization cycles against sprintf() JSON.",
    "socraticHints": [
      "Why is Protobuf (NanoPB) significantly more compact than CBOR or MessagePack?",
      "Because Protobuf is schema-based! Field names are NOT included in the message—only tiny numerical field tags (1, 2, 3) and wire types are encoded! CBOR and MessagePack are self-describing and must encode field name strings or map keys.",
      "Protobuf achieves maximum compression when both client and server share the compiled .proto schema."
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of ocean buoy tracking devices transmits GPS and wave telemetry over Iridium Satellite ($0.05 per 50 bytes). The firmware transmits JSON: '{\"lat\":37.7749,\"lon\":-122.4194,\"temp\":18.4,\"battery\":98}'. The monthly satellite bill is $45,000. An engineer refactors the firmware to NanoPB Protocol Buffers. What is the expected monthly cost reduction?",
      "options": [
        "Zero reduction because satellite pricing is fixed.",
        "75% Cost Reduction (~$11,000/month): The JSON string is 62 bytes (requiring two 50-byte billing blocks = $0.10 per transmission). The NanoPB encoded binary message fits in just 14 bytes (a single 50-byte block = $0.05 per transmission), slashing satellite transmission costs by more than half immediately while preserving full floating-point precision!",
        "The bill will increase because binary data is heavier.",
        "NanoPB does not support satellites."
      ],
      "answerIdx": 1,
      "debrief": "In bandwidth-constrained communications (cellular, satellite, LoRa), JSON is an unforgivable architectural choice. Replacing string-based JSON with schema-compiled binary protocols (NanoPB) reduces byte count by 60-80%, yielding massive financial and battery savings."
    },
    "quests": [
      {
        "id": "iot-m2-d39-q1",
        "name": "Varint & ZigZag Encoding Mechanics",
        "type": "concept",
        "desc": "Explain how Google Protocol Buffers encodes signed integers using ZigZag mapping and 7-bit varint byte sequences."
      },
      {
        "id": "iot-m2-d39-q2",
        "name": "NanoPB vs CBOR vs JSON Byte & Cycle Benchmarking",
        "type": "detective",
        "desc": "Benchmark serialized byte lengths, RAM allocation footprints, and CPU clock cycles across NanoPB, CBOR, and JSON formats."
      },
      {
        "id": "iot-m2-d39-q3",
        "name": "Static NanoPB Serialization & Deserialization Pipeline",
        "type": "mastery",
        "desc": "Build an end-to-end telemetry encoder and decoder in C utilizing NanoPB with statically bounded string and repeated fields."
      },
      {
        "id": "iot-m2-d39-q4",
        "name": "3 AM SRE: Satellite Telemetry Quota Exhaustion Panic",
        "type": "incident",
        "desc": "Rescue a maritime fleet from a multi-million-dollar satellite overage bill caused by an accidental debug switch to verbose JSON formatting."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone 7: Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone (Industrial Protocol Bridging & Cloud Integration)",
    "spokenGoal": "Architect, construct, and defend Milestone 7: the Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge. Build an industrial edge firmware in C that polls multiple legacy RS-485 Modbus RTU slave devices (energy meters, motor inverters), validates CRC-16 checksums, serializes the register data into compact NanoPB binary envelopes, and publishes telemetry to an MQTT cloud broker over TLS with QoS 1 guarantees. Implement store-and-forward flash buffering to guarantee zero data loss during cloud network outages.",
    "conceptInvariant": "Zero-Loss Protocol Bridge Invariant: An industrial telemetry bridge must isolate fieldbus polling from cloud network latency; fieldbus data must be enqueued into persistent storage without dropping samples, and cloud publish failures must never stall Modbus polling cycles.",
    "failureMode": "Failing the milestone defense when the evaluator disconnects the Wi-Fi/Ethernet cable for 5 minutes, and the firmware stops polling the RS-485 Modbus bus because the MQTT publish loop is blocked waiting for network ACK.",
    "tryItFriction": "Deploy and test Milestone 7: connect the firmware to a physical Modbus RTU slave simulator; poll 20 holding registers every 500ms; bridge to an MQTT broker; cut the network connection for 3 minutes; restore it; and verify that all queued records are flushed to the cloud in chronological order without a single missing timestamp.",
    "socraticHints": [
      "How do you decouple real-time Modbus polling from unpredictable cloud MQTT latency?",
      "By using two separate FreeRTOS tasks connected via a thread-safe Queue and Flash buffer! Task 1 exclusively polls Modbus and pushes records to the queue; Task 2 exclusively manages cloud MQTT connections and drains the queue!",
      "If the cloud goes down, Task 2 writes to Flash while Task 1 continues polling uninterrupted."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 7 evaluation, the evaluator injects severe electrical noise onto the RS-485 Modbus line, causing 30% of Modbus frames to fail CRC-16 verification. How does your bridge maintain data integrity in the cloud database?",
      "options": [
        "Send the corrupted data anyway.",
        "Defensive Checksum Rejection & Telemetry Error Flagging: The Modbus driver detects CRC-16 mismatch and drops the corrupted packet without polluting the internal data pipeline. It increments an error counter register and retries the poll. The cloud telemetry payload includes the error rate metric, alerting operators to physical wire degradation while guaranteeing zero garbage data enters the database.",
        "Crash the MCU to reset the bus.",
        "Disable CRC verification."
      ],
      "answerIdx": 1,
      "debrief": "Industrial protocol bridges must be resilient to physical fieldbus corruption. Discarding invalid CRC frames, maintaining retry budgets, and reporting physical link error rates to the cloud dashboard ensures system reliability without contaminating analytical databases."
    },
    "quests": [
      {
        "id": "iot-m2-d40-q1",
        "name": "Industrial Protocol Bridge Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive multi-threaded firmware architecture detailing Modbus polling tasks, ring buffers, and MQTT publishing pipelines."
      },
      {
        "id": "iot-m2-d40-q2",
        "name": "RS-485 Noise Fault & CRC Rejection Harness",
        "type": "detective",
        "desc": "Inject corrupted bytes into a simulated Modbus stream and verify 100% rejection by the CRC-16 verification engine."
      },
      {
        "id": "iot-m2-d40-q3",
        "name": "Modbus-to-MQTT Industrial Bridge Engine Build",
        "type": "mastery",
        "desc": "Build the complete production bridge firmware in C integrating RS-485 Modbus polling, NanoPB serialization, and TLS-encrypted MQTT publishing."
      },
      {
        "id": "iot-m2-d40-q4",
        "name": "Milestone 7 Defense: Network Partition & Noise Chaos Lab",
        "type": "incident",
        "desc": "Defend the industrial gateway before a senior panel under combined fieldbus electrical noise and prolonged cloud network partitions."
      }
    ]
  },

  # =========================================================================
  # BLOCK 9: HARDWARE SECURITY, CRYPTOGRAPHY & SECURE BOOT (Days 41-45)
  # =========================================================================
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Hardware Roots of Trust (RoT): Physical Unclonable Functions (PUF) & Secure Elements (ATECC608)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Hardware Security Engineering (Roots of Trust & Cryptographic Coprocessors)",
    "spokenGoal": "Protect connected devices from physical tampering and key extraction: master Hardware Roots of Trust (RoT). Understand why storing private keys in internal MCU Flash is dangerous: malicious actors can extract firmware using SWD/JTAG debuggers, glitching attacks, or decapping silicon dies. Master dedicated Secure Elements (Microchip ATECC608A / NXP SE050): hardware-isolated cryptographic coprocessors with tamper shields and side-channel defense. Explore Physical Unclonable Functions (PUF): exploiting microscopic silicon manufacturing variations in SRAM startup states to generate unique, unclonable cryptographic keys that exist only while powered on.",
    "conceptInvariant": "Hardware Key Non-Exportability Invariant: A private cryptographic key must be generated internally within a hardware Secure Element or PUF and must never be readable, exportable, or present in standard CPU RAM; all cryptographic signatures and encryptions must be performed directly inside the secure hardware boundary.",
    "failureMode": "Storing a private cloud client key as an unencrypted 'const char private_key[]' string in internal MCU Flash; an attacker connects an inexpensive SWD debugger, dumps the Flash memory, and clones the device's identity to forge fleet telemetry.",
    "tryItFriction": "Interface with an ATECC608 Secure Element over I2C in C: send the GenKey command to generate an internal Elliptic Curve P-256 private key inside Slot 0; verify that the private key cannot be read out; read the public key; and command the secure element to sign a SHA-256 message hash using hardware ECDSA.",
    "socraticHints": [
      "What is an SRAM Physical Unclonable Function (PUF)?",
      "When SRAM powers on, each physical memory cell stabilizes to either 0 or 1 based on microscopic quantum differences in transistor threshold voltages created during chip fabrication! This generates a random, unique silicon fingerprint!",
      "Key derivation algorithms turn this repeatable fingerprint into a cryptographic key that vanishes the moment power is turned off, leaving no trace in silicon memory."
    ],
    "situationalPuzzle": {
      "scenario": "A smart lock company sells 100,000 smart door locks. A hacker buys one lock, desolders the flash chip or connects a JTAG programmer, and reads the firmware. The hacker discovers the master AES encryption key hardcoded in the binary. Now, the hacker can unlock all 100,000 doors. What hardware security feature prevents this catastrophic fleet breach?",
      "options": [
        "Using a longer C variable name.",
        "Secure Element & Hardware Root of Trust: Every physical lock must have a unique private key generated inside a dedicated Secure Element (e.g., ATECC608) or burned into One-Time-Programmable (OTP) eFuses with JTAG permanently disabled (Readout Protection RDP Level 2). Compromising one physical device yields zero information about the rest of the fleet.",
        "Painting the circuit board black.",
        "C programming does not support security."
      ],
      "answerIdx": 1,
      "debrief": "Never hardcode shared secret keys in firmware binaries. Each individual physical device must generate or provision its own unique cryptographic identity inside a tamper-resistant hardware root of trust, complemented by locking JTAG/SWD debug ports (RDP Level 2) before factory deployment."
    },
    "quests": [
      {
        "id": "iot-m2-d41-q1",
        "name": "SRAM PUF Entropy & Silicon Manufacturing Variation Math",
        "type": "concept",
        "desc": "Calculate intra-device and inter-device Hamming distance distributions of SRAM power-up state vectors for key generation."
      },
      {
        "id": "iot-m2-d41-q2",
        "name": "Microcontroller Flash Extraction & JTAG RDP Level Bypass Audit",
        "type": "detective",
        "desc": "Demonstrate using OpenOCD how unsecured microcontrollers yield entire Flash images, and verify RDP Level 2 debug lockouts."
      },
      {
        "id": "iot-m2-d41-q3",
        "name": "ATECC608 Hardware ECDSA Signature Engine",
        "type": "mastery",
        "desc": "Implement a full driver in C communicating with a Secure Element over I2C to execute hardware-isolated ECDSA P-256 signing."
      },
      {
        "id": "iot-m2-d41-q4",
        "name": "3 AM SRE: Fleet Identity Cloning Breach in Smart Grid Meters",
        "type": "incident",
        "desc": "Triage a major utility company crisis where extracted firmware keys allowed attackers to spoof electricity consumption data across 10,000 meters."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Embedded Cryptography: AES-128/256-GCM, SHA-256 & Curve25519 Math on Cortex-M",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Cryptographic Engineering (Symmetric & Asymmetric Math for Constrained MCUs)",
    "spokenGoal": "Implement mathematical cryptography efficiently on constrained silicon: master Embedded Cryptography. Compare symmetric encryption (AES-128 and AES-256 in Galois/Counter Mode - GCM for authenticated encryption) with cryptographic hashing (SHA-256) and modern asymmetric key exchange (Curve25519 / X25519). Understand hardware acceleration: how dedicated on-chip crypto engines (STM32 CRYP peripheral) accelerate AES from 1,200 CPU cycles down to 14 clock cycles per block. Master side-channel attack countermeasures: constant-time programming to prevent timing attacks.",
    "conceptInvariant": "Constant-Time Comparison Invariant: All cryptographic comparisons (verifying HMACs, AES-GCM authentication tags, signature hashes) must execute in strictly constant time (e.g., mbedtls_ct_memcmp), completely independent of where the first byte mismatch occurs, to prevent timing side-channel attacks.",
    "failureMode": "Verifying an incoming firmware HMAC signature using standard C 'memcmp()'; because memcmp() returns early on the very first mismatched byte, an attacker measures nanosecond timing differences over 10,000 requests to forge a valid signature byte by byte.",
    "tryItFriction": "Implement AES-128-GCM Authenticated Encryption in C: configure a 12-byte initialization vector (IV/nonce), encrypt a 128-byte sensor payload with associated authenticated data (AAD), generate a 16-byte authentication tag, and verify that corrupting a single bit of either the payload or AAD causes tag verification to fail.",
    "socraticHints": [
      "Why must an Initialization Vector (IV / Nonce) NEVER be reused with the same key in AES-GCM mode?",
      "Because reusing a nonce in Galois/Counter Mode completely destroys authenticity: it allows an attacker to mathematically recover the authentication hash key (H), decrypt all ciphertexts, and forge arbitrary valid messages!",
      "Nonce means 'number used once'—it must be strictly unique for every encryption."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware security researcher tests an IoT gateway's password verification function: 'int check_key(uint8_t *a, uint8_t *b) { return memcmp(a, b, 32) == 0; }'. The researcher sends random 32-byte keys and measures the response time with a 100MHz timer. When the first byte is correct, response time increases by 42 nanoseconds. What vulnerability exists, and how is it patched?",
      "options": [
        "The processor is running out of memory.",
        "Timing Side-Channel Attack & Early-Exit Leakage: Standard memcmp() exits immediately upon the first non-matching byte, leaking information about which byte position failed. The fix is a constant-time comparison function that XORs all 32 bytes unconditionally across a fixed loop and tests if the accumulated OR sum is zero.",
        "AES-GCM is broken.",
        "The researcher used the wrong baud rate."
      ],
      "answerIdx": 1,
      "debrief": "Timing attacks exploit execution time variations. In cryptography, comparing hashes or keys must ALWAYS take the exact same number of clock cycles regardless of whether 0 bytes match or all 32 bytes match."
    },
    "quests": [
      {
        "id": "iot-m2-d42-q1",
        "name": "Galois/Counter Mode (GCM) GHASH Polynomial Formulation",
        "type": "concept",
        "desc": "Explain Galois Field GF(2^128) arithmetic, CTR mode stream encryption, and GHASH authentication tag computation."
      },
      {
        "id": "iot-m2-d42-q2",
        "name": "Timing Side-Channel Leakage Oscilloscope Harness",
        "type": "detective",
        "desc": "Measure execution clock cycle variance between standard memcmp() and constant-time memory comparison functions."
      },
      {
        "id": "iot-m2-d42-q3",
        "name": "Hardware-Accelerated AES-256-GCM Crypto Driver",
        "type": "mastery",
        "desc": "Implement an authenticated encryption driver in C utilizing on-chip crypto hardware engines with non-reuse nonce guards."
      },
      {
        "id": "iot-m2-d42-q4",
        "name": "3 AM SRE: Remote Key Forgery Attack on Connected Medical Infusion Pump",
        "type": "incident",
        "desc": "Patch a life-critical medical device firmware vulnerability where early-exit HMAC verification allowed timing-based signature forgery."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Secure Boot Architecture: Multi-Stage Bootloaders, ECDSA Signatures & Anti-Rollback eFuses",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Silicon Trust Chain Engineering (Secure Boot & Cryptographic Chain of Trust)",
    "spokenGoal": "Ensure that the microcontroller executes only authentic, untampered code signed by your organization: master Secure Boot Architecture. Understand the Chain of Trust: Stage 0 (immutable silicon Boot ROM burned in silicon), Stage 1 (First Stage Bootloader BL1), and Stage 2 (Main Application Firmware). Deconstruct cryptographic signature verification: hashing the entire application Flash binary with SHA-256, verifying the digital signature using an ECDSA P-256 public key anchored in Root-of-Trust eFuses. Master Anti-Rollback protection: using hardware monotonic counters (eFuses) to prevent attackers from flashing older, vulnerable firmware versions.",
    "conceptInvariant": "Unbroken Chain of Trust Invariant: Every execution stage in the boot hierarchy must cryptographically authenticate the digital signature and version number of the subsequent stage before jumping to its entry point; if verification fails, the processor must halt and enter a secure fallback state.",
    "failureMode": "Implementing signature verification in the bootloader but omitting anti-rollback version checks; an attacker flashes an authenticated version 1.0 firmware from two years ago that contains a known buffer overflow exploit, taking full control of the device.",
    "tryItFriction": "Construct a Minimalist Secure Bootloader in C: read the application header at Flash address 0x08010000; verify magic numbers and image length; hash the binary with SHA-256; verify the ECDSA signature against a hardcoded public key; verify that the image version >= the monotonic anti-rollback counter; and execute the jump to the application Reset_Handler.",
    "socraticHints": [
      "Why must the Secure Boot public key be burned into silicon One-Time-Programmable (OTP) eFuses rather than ordinary Flash?",
      "Because if the public key is stored in writable Flash, an attacker can overwrite your public key with their OWN public key, sign malicious firmware with their private key, and pass verification cleanly!",
      "eFuses are physical microscopic silicon fuses that blow permanently, creating immutable, write-protected hardware keys."
    ],
    "situationalPuzzle": {
      "scenario": "A secure bootloader verifies an application binary: 'if (verify_ecdsa(image) == SUCCESS) jump_to_app(image);'. An attacker connects an oscilloscope and a pulse generator to the MCU's power supply pin (VDD). At the exact microsecond the CPU executes the 'CMP r0, #0' instruction after signature verification, the attacker injects a 50-nanosecond voltage drop (brownout glitch). What happens?",
      "options": [
        "The microcontroller is permanently destroyed.",
        "Voltage Glitching Fault Injection: The brief voltage drop prevents the CPU logic gates from switching cleanly. The 'CMP' or conditional branch 'BNE' instruction is misread as a NOP (No Operation). The CPU skips the branch and falls through into 'jump_to_app()', executing completely unsigned, malicious code! Defense requires redundant verification checks and random execution delays.",
        "The signature verifies automatically.",
        "ARM Cortex-M detects voltage drops and reboots."
      ],
      "answerIdx": 1,
      "debrief": "Voltage glitching is a real-world hardware attack. To defend against glitching in secure bootloaders, firmware must implement redundant checks (e.g., verifying the signature twice at different points, using double-variables, and adding randomized delays) to defeat single-instruction fault injection."
    },
    "quests": [
      {
        "id": "iot-m2-d43-q1",
        "name": "Chain of Trust Mathematical Verification Model",
        "type": "concept",
        "desc": "Map cryptographic handoffs from Silicon ROM -> BL1 -> BL2 -> App, detailing signature algorithms and hash anchors."
      },
      {
        "id": "iot-m2-d43-q2",
        "name": "Voltage Glitching Fault Injection Resistance Audit",
        "type": "detective",
        "desc": "Analyze compiled assembly of bootloader verification branches to identify single-point-of-failure branch instructions."
      },
      {
        "id": "iot-m2-d43-q3",
        "name": "Secure Bootloader with ECDSA & Anti-Rollback eFuses",
        "type": "mastery",
        "desc": "Implement a full first-stage bootloader in C with SHA-256 hashing, ECDSA P-256 verification, and hardware eFuse version checks."
      },
      {
        "id": "iot-m2-d43-q4",
        "name": "3 AM SRE: Factory Malware Injection Bypasses Unlocked Bootloader",
        "type": "incident",
        "desc": "Remediate a critical supply-chain breach where counterfeit firmware was flashed onto factory units due to unblown secure boot eFuses."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Flash Memory Architecture: Wear Leveling, LittleFS / SPIFFS & Power-Loss Recovery",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Storage Systems Engineering (NOR Flash Physics & Fault-Tolerant Filesystems)",
    "spokenGoal": "Store data persistently on silicon without destroying Flash chips: master Flash Memory Management and Fault-Tolerant Filesystems. Understand NOR Flash physical physics: bits can be written from 1 to 0 individually, but can ONLY be erased from 0 to 1 in entire sectors (e.g., 4KB blocks). Confront Flash endurance: individual sectors endure only ~100,000 erase cycles before physical oxide breakdown renders them dead! Master Wear Leveling (dynamic vs static) to distribute write cycles uniformly across the entire chip. Deconstruct LittleFS: a power-loss resilient embedded filesystem designed specifically for microcontrollers with bounded RAM budgets.",
    "conceptInvariant": "Power-Cut Resilient Storage Invariant: An embedded filesystem must guarantee that a sudden power loss (pulling the battery or unplugging power) at any microsecond during a write or erase operation will never result in filesystem corruption or loss of existing committed files upon reboot.",
    "failureMode": "Writing sensor data continuously to the same physical Flash sector (address 0x08040000) once per second; after 28 hours (100,000 erases), the Flash sector silicon burns out, permanently corrupting persistent storage and bricking the device.",
    "tryItFriction": "Integrate LittleFS in C on an external SPI Flash chip: configure read, prog, erase, and sync function pointers; format the filesystem; create a file; write telemetry records; simulate sudden power-cuts mid-write; and verify that LittleFS recovers cleanly on reboot without data loss or broken pointers.",
    "socraticHints": [
      "Why is standard FAT32 a catastrophic choice for microcontrollers with raw Flash memory?",
      "FAT32 was designed for magnetic spinning hard drives: it frequently overwrites the same File Allocation Table sector (destroying Flash quickly) and is NOT power-cut resilient (a sudden power loss during a FAT table write corrupts the entire drive)!",
      "LittleFS uses copy-on-write logging, dynamic wear-leveling, and atomic metadata pointers designed specifically for Flash."
    ],
    "situationalPuzzle": {
      "scenario": "A smart electric meter logs hourly energy consumption into internal Flash memory. The firmware engineer writes a custom log function that erases sector 7 and writes a new 64-byte record every hour. After 11 years of continuous operation, the meter fails to save records. An EEPROM inspection shows sector 7 bits are stuck at 0. Why did sector 7 fail?",
      "options": [
        "The microcontroller ran out of RAM.",
        "Flash Oxide Breakdown / Wear Out: The developer wrote repeatedly to a single fixed sector without wear leveling! Although hourly writes (8,760 erases/year) should last ~11 years at 100,000 cycle limits, temperature variations accelerated silicon oxide breakdown. A wear-leveling filesystem (LittleFS) would have distributed writes across 100 sectors, extending life to over 1,000 years!",
        "Flash memory cannot be written more than 10 times.",
        "Solar flares erased the sector."
      ],
      "answerIdx": 1,
      "debrief": "Raw Flash memory has physical endurance limits (~10k to 100k erases per sector). Wear-leveling algorithms dynamically remap logical sectors to different physical sectors, ensuring the entire silicon substrate wears down uniformly and maximizing device longevity."
    },
    "quests": [
      {
        "id": "iot-m2-d44-q1",
        "name": "NOR Flash Sector Erase Physics & Wear-Leveling Lifespan Math",
        "type": "concept",
        "desc": "Calculate theoretical device lifespan in years across write frequencies, sector size, total chip capacity, and wear-leveling efficiency."
      },
      {
        "id": "iot-m2-d44-q2",
        "name": "Power-Cut Simulation & Filesystem Recovery Harness",
        "type": "detective",
        "desc": "Execute an automated chaos test cutting power at random microsecond intervals during LittleFS transactions, verifying zero corruption."
      },
      {
        "id": "iot-m2-d44-q3",
        "name": "LittleFS SPI Flash Driver & Telemetry Store",
        "type": "mastery",
        "desc": "Implement a complete persistent storage subsystem in C integrating SPI Flash hardware drivers, LittleFS wear leveling, and atomic logging."
      },
      {
        "id": "iot-m2-d44-q4",
        "name": "3 AM SRE: Fleet Filesystem Corruption Following Substation Blackout",
        "type": "incident",
        "desc": "Recover corrupted utility data and patch firmware across 5,000 smart meters that bricked during an abrupt grid power outage."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone 8: Cryptographic Secure Bootloader & Authenticated Firmware Verifier Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone (Hardware Security & Cryptographic Bootloaders)",
    "spokenGoal": "Architect, construct, and defend Milestone 8: the Cryptographic Secure Bootloader & Authenticated Firmware Verifier Engine. Build a production-grade, two-stage secure bootloader in C for ARM Cortex-M. Enforce SHA-256 binary hashing, verify digital signatures using ECDSA P-256 against an immutable public key, validate anti-rollback monotonic counters to prevent downgrade attacks, protect memory against voltage glitching using redundant verification checks, and execute safe execution jumps to authenticated application code.",
    "conceptInvariant": "Zero-Compromise Boot Invariant: Under no circumstance shall the bootloader branch to an application image whose cryptographic signature does not verify cleanly against the immutable Root-of-Trust public key and whose version is lower than the hardware anti-rollback counter.",
    "failureMode": "Failing the milestone defense when the evaluator injects a modified binary with 1 single byte changed in the application code, and the bootloader executes the corrupted code instead of halting safely in recovery mode.",
    "tryItFriction": "Build and verify Milestone 8: flash a signed application binary and prove boot succeeds; modify 1 byte of the application image using a hex editor and prove the bootloader detects signature failure, halts execution, and enters an authenticated recovery mode.",
    "socraticHints": [
      "How do you safely jump from a bootloader to a new application in ARM Cortex-M C code?",
      "1) Disable all interrupts (__disable_irq()); 2) Relocate vector table (SCB->VTOR = app_address); 3) Load Main Stack Pointer from app_address[0] (__set_MSP); 4) Branch to function pointer at app_address[1] (Reset_Handler)!",
      "Failing to disable interrupts or reset the MSP causes the application to inherit dirty bootloader stack states and crash on the first interrupt."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 8 defense, the evaluator presents your bootloader with two signed firmware images: Image A (v2.1, fully signed by your company key) and Image B (v1.0, also fully signed by your company key). Your system is currently running v2.0. The evaluator attempts to flash Image B. How does your bootloader respond?",
      "options": [
        "Boot Image B because the signature is valid.",
        "Anti-Rollback Rejection: Although Image B has a valid signature, its version (v1.0) is lower than the monotonic anti-rollback counter (v2.0) burned into hardware eFuses! The bootloader rejects Image B immediately to prevent a downgrade attack where an attacker attempts to reinstall an older, exploitable firmware version.",
        "Crash the CPU.",
        "Ask the user for a password."
      ],
      "answerIdx": 1,
      "debrief": "Cryptographic signatures alone do not prevent downgrade attacks. An attacker can legally acquire an older valid signed image that contains a known vulnerability. Hardware anti-rollback counters (eFuses) guarantee that the security waterline can only move forward, never backward."
    },
    "quests": [
      {
        "id": "iot-m2-d45-q1",
        "name": "Secure Bootloader Memory Partitioning Blueprint",
        "type": "concept",
        "desc": "Produce the formal flash partition map detailing Bootloader (32KB), App Slot 0 (240KB), App Slot 1 (240KB), and Storage (512KB)."
      },
      {
        "id": "iot-m2-d45-q2",
        "name": "Signature Tampering & Glitch Vulnerability Audit",
        "type": "detective",
        "desc": "Subject the bootloader to bit-flip fuzzing and simulated branch skipping to verify that signature validation cannot be bypassed."
      },
      {
        "id": "iot-m2-d45-q3",
        "name": "Cryptographic Secure Bootloader Engine Build",
        "type": "mastery",
        "desc": "Build the complete production secure bootloader in C with SHA-256, ECDSA P-256 verification, anti-rollback checks, and safe VTOR jumping."
      },
      {
        "id": "iot-m2-d45-q4",
        "name": "Milestone 8 Defense: Firmware Tampering & Downgrade Attack Lab",
        "type": "incident",
        "desc": "Defend the secure bootloader before a senior panel under live binary byte modifications and malicious downgrade attacks."
      }
    ]
  }
]
