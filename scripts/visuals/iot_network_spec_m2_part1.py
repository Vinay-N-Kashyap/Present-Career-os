# scripts/visuals/iot_network_spec_m2_part1.py
# Month 2, Days 31-45 (Blocks 7-9) for Course 17: IoT Wireless Networks & Protocols (course-iot-network)
# Total Quests: 60 Quests (Days 31-45)

DAYS_31_TO_45 = [
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Embedded Wi-Fi (802.11 b/g/n/ax), Station vs SoftAP & Power Save Modes (TWT / DTIM)",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Embedded Wi-Fi Architecture (Physical Layers, Modes & Power Saving)",
    "spokenGoal": "Welcome to Month 2. Today we expand beyond WPANs and LPWANs into the highest-throughput local wireless technology on Earth: Embedded Wi-Fi. In the microcontroller domain (such as ESP32, STM32, and Nordic nRF7002), Wi-Fi operates in two distinct modes: Station (STA) mode (where the embedded node acts as a Wi-Fi client connecting to an access point) and SoftAP mode (where the embedded node spins up its own software access point to broadcast an SSID). Examine Wi-Fi power dynamics: Wi-Fi transceivers draw 80 to 250 mA when active! How do battery IoT nodes survive? Through Power Save Mode (PSM) and DTIM (Delivery Traffic Indication Message). In legacy PSM, the radio sleeps and wakes up every DTIM interval (e.g., DTIM 3 = every 300 ms) to check the Access Point's beacon TIM bitmap for buffered traffic. In Wi-Fi 6 (802.11ax), Target Wake Time (TWT) allows the node and AP to negotiate explicit multi-hour sleep schedules, slashing standby power by 90%!",
    "conceptInvariant": "Wi-Fi Power Save & Beacon Synchronization Invariant: In Wi-Fi PSM, an embedded station remains in low-power deep sleep during beacon intervals, waking up synchronously for the DTIM beacon window to parse the Traffic Indication Map (TIM) bitmap; if its Association ID (AID) bit is clear, it returns to sleep within 2 milliseconds without powering the transmitter.",
    "failureMode": "Configuring an embedded battery Wi-Fi sensor with an Access Point whose DTIM period is 1 (waking every 100 ms); frequent radio wakeups and clock drift compensation keep the receiver active 15% of the time, draining a 2,000 mAh lithium cell in 14 days instead of 3 years.",
    "tryItFriction": "Construct a Wi-Fi power profiling model in TypeScript: calculate average current consumption for an ESP32 sensor transmitting 1 KB once per hour across three scenarios: (1) Radio always ON (80 mA continuous); (2) Wi-Fi PSM with DTIM = 3 (sleep 15 \u03bcA, wake 100 mA for 5 ms every 300 ms); and (3) Deep Sleep with Wi-Fi disconnected (boot, connect in 1.5s, transmit, deep sleep 5 \u03bcA); calculate battery life on a 2,500 mAh battery.",
    "socraticHints": [
      "Why is disconnecting and deep-sleeping often MORE power-efficient for hourly sensors than staying connected in Wi-Fi PSM?",
      "Because maintaining an active Wi-Fi association requires waking up every 100-300 ms to hear AP beacons and respond to ARP requests!",
      "If a sensor only reports once an hour, the energy to reconnect from scratch (1.5 seconds at 100 mA = 0.04 mAh) is vastly lower than waking up 12,000 times an hour to listen to beacons!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart home startup builds a battery-powered video doorbell using 802.11n Wi-Fi. The device must wake up and stream video within 500 ms when the button is pressed. However, the battery dies in 2 weeks. Analysis shows the device stays connected to Wi-Fi with DTIM = 1, drawing an average of 18 mA in standby. What architectural change extends battery life to 6 months while retaining <500 ms wakeup latency?",
      "options": [
        "Upgrade to a 100Ah car battery.",
        "Negotiate an aggressive DTIM interval (DTIM = 10, waking every 1,000 ms) or leverage Wi-Fi 6 Target Wake Time (TWT) to negotiate negotiated sleep contracts, dropping average standby current to under 500 \u03bcA while keeping the TCP socket alive.",
        "Turn off Wi-Fi encryption.",
        "Change the Wi-Fi SSID to an all-numeric string."
      ],
      "answerIdx": 1,
      "debrief": "Wi-Fi 6 Target Wake Time (TWT) and higher DTIM intervals allow stations to maintain active IP association while sleeping for extended periods without receiving beacon spam. TWT drops standby current from ~18 mA to under 500 \u03bcA. Because the link and IP address remain established, the doorbell can transmit video packets within 100 ms of a button press without reconnecting."
    },
    "quests": [
      {
        "num": 1,
        "title": "Embedded Wi-Fi Architecture & 802.11 Standards",
        "type": "Concept",
        "description": "Analyze 802.11b/g/n vs 802.11ax, Station/SoftAP modes, 4-way WPA2/WPA3 handshakes, DTIM beacon parsing, and Wi-Fi 6 Target Wake Time."
      },
      {
        "num": 2,
        "title": "DTIM Wakeup Beacon Storm Detective",
        "type": "Detective Challenge",
        "description": "Analyze an oscilloscope power trace of an embedded Wi-Fi node; diagnose why AP broadcast multicast traffic kept waking the radio from deep sleep."
      },
      {
        "num": 3,
        "title": "Wi-Fi Power Profile & Battery Life Estimator Engine",
        "type": "Mastery Assignment",
        "description": "Develop a TypeScript engine that models Wi-Fi connection states, DTIM listening current, DHCP/ARP exchanges, and transmit bursts to predict exact battery lifetime."
      },
      {
        "num": 4,
        "title": "3 AM Wi-Fi Deauthentication & Reconnect Thrashing Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an outage in a commercial Wi-Fi sensor deployment where an AP firmware update altered beacon intervals, triggering continuous reconnect loops and flash memory wear."
      }
    ]
  },
  {
    "day": 32,
    "month": 1,
    "blockNum": 7,
    "title": "Wi-Fi Provisioning Architectures: Captive Portals, BLE Provisioning & SmartConfig",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Out-of-Box Experience & Onboarding (Provisioning Protocols)",
    "spokenGoal": "How does a headless IoT product with no screen or keyboard obtain the homeowner's home Wi-Fi SSID and password? Today we master Wi-Fi Provisioning Architectures. Contrast the three primary industry approaches: First, SoftAP with Captive Portal: the device boots as an unencrypted access point (e.g., 'Device-Setup-1234'). A user connects with their phone. The device runs a lightweight DNS server that redirects all DNS queries to 192.168.4.1 (DNS hijacking), launching an in-browser captive portal where the user submits credentials. Second, SmartConfig / ESP-Touch: the phone broadcasts UDP packets with encoded SSID/password characters represented as packet lengths across the local subnet; the unassociated device sniffs raw 802.11 frames in promiscuous mode to extract credentials. Third, the modern enterprise standard: BLE Provisioning (Espressif Protocomm / NimBLE). The phone connects over BLE, executes an authenticated Diffie-Hellman handshake (Curve25519), and securely writes Wi-Fi credentials over a GATT characteristic with zero Wi-Fi network switching!",
    "conceptInvariant": "Encrypted Provisioning Transport Invariant: Wi-Fi credentials (SSID + Pre-Shared Key) transmitted during out-of-box provisioning must be protected by an ephemeral authenticated cryptographic channel (e.g., X25519 key exchange with AES-GCM or ChaCha20-Poly1305), preventing passive over-the-air eavesdropping.",
    "failureMode": "Transmitting plaintext Wi-Fi WPA2 pre-shared keys over an unencrypted SoftAP captive portal; an attacker parked outside the customer's house sniffs the open Wi-Fi frames, captures the homeowner's master Wi-Fi password, and infiltrates the home local network.",
    "tryItFriction": "Construct a BLE Provisioning Protocol state machine in TypeScript: model an unprovisioned peripheral exposing a custom Provisioning GATT Service; implement an ECDH Curve25519 key exchange to derive a shared AES-GCM session key; decrypt the incoming Wi-Fi credential payload; and transition the device to Station connecting mode.",
    "socraticHints": [
      "Why is BLE Provisioning vastly superior to SoftAP Captive Portals from a user experience perspective?",
      "Because on modern iOS and Android devices, connecting to a SoftAP disconnects the user's phone from cellular data and internet, triggering disruptive 'No Internet - Keep Connected?' popups!",
      "BLE connects seamlessly in the background without interrupting the smartphone's active Wi-Fi or cellular connections."
    ],
    "situationalPuzzle": {
      "scenario": "A smart appliance manufacturer releases a smart oven using SmartConfig (UDP packet-length sniffing) for Wi-Fi onboarding. Customer returns skyrocket because 60% of users cannot connect the oven. Analysis shows customers have modern dual-band Wi-Fi 6 mesh routers. Why did SmartConfig fail on modern home networks?",
      "options": [
        "SmartConfig requires a wired Ethernet cable.",
        "Band Incompatibility & Frame Encryption: SmartConfig operates by sniffing raw 802.11 frames on 2.4 GHz. Modern smartphones connect to the router on 5 GHz or 6 GHz. The router does not mirror 5 GHz broadcast frames to 2.4 GHz, leaving the oven completely blind to the configuration packets.",
        "SmartConfig only works on Linux laptops.",
        "The oven's heating element blocked the UDP packets."
      ],
      "answerIdx": 1,
      "debrief": "SmartConfig relies on sniffing 2.4 GHz raw radio frames. When a smartphone is associated on 5 GHz or 6 GHz, its UDP broadcasts never touch the 2.4 GHz physical ether unless bridged by the router. Furthermore, modern WPA3 protected management frames (PMF) and packet encryption prevent promiscuous frame inspection, making BLE Provisioning the only reliable modern standard."
    },
    "quests": [
      {
        "num": 1,
        "title": "Provisioning Methodologies & Security Architecture",
        "type": "Concept",
        "description": "Deconstruct SoftAP Captive Portals, DNS hijacking, SmartConfig packet-length modulation, and BLE Protocomm cryptographic handshakes."
      },
      {
        "num": 2,
        "title": "SmartConfig Multi-Band Failure Detective",
        "type": "Detective Challenge",
        "description": "Analyze an onboarding failure log where an IoT device failed to discover Wi-Fi credentials; demonstrate why 5 GHz phone connections and 802.11w PMF broke broadcast sniffing."
      },
      {
        "num": 3,
        "title": "Secure BLE Wi-Fi Provisioning Protocol Engine",
        "type": "Mastery Assignment",
        "description": "Implement a production-grade TypeScript BLE Provisioning Engine that executes X25519 key exchange, decrypts AES-GCM credential payloads, and verifies Wi-Fi station scan results."
      },
      {
        "num": 4,
        "title": "3 AM Unencrypted SoftAP Credential Theft Lab",
        "type": "Production Incident Lab",
        "description": "Remediate a severe CVE in an IoT camera fleet where open SoftAP provisioning endpoints allowed neighboring attackers to intercept customer home Wi-Fi passwords."
      }
    ]
  },
  {
    "day": 33,
    "month": 1,
    "blockNum": 7,
    "title": "Lightweight IP (LwIP) Stack Architecture: Raw API, Netconn, BSD Sockets & Zero-Copy pbufs",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Embedded TCP/IP Internals (LwIP Architecture & Zero-Copy Memory)",
    "spokenGoal": "How does a microchip with only 64 kilobytes of RAM run a full TCP/IP networking stack? Today we master the LightWeight IP (LwIP) stack, the undisputed engine running inside virtually every embedded Wi-Fi, Ethernet, and cellular microcontroller. Deconstruct LwIP's three programming APIs: First, the Raw API (callback-based, zero-overhead, event-driven, single-threaded, used for maximum performance). Second, the Netconn API (sequential, thread-safe, blocking API requiring FreeRTOS). Third, the BSD Sockets API (standard POSIX socket layer built on top of Netconn, familiar to Unix developers but with thread context-switching overhead). Dive deep into the heart of LwIP memory management: Packet Buffers (`pbuf`). Contrast the four pbuf types: PBUF_RAM (dynamically allocated in RAM with prepended headers), PBUF_ROM (points directly to read-only flash), PBUF_REF (points to external RAM without copying), and PBUF_POOL (pre-allocated fixed-size ring buffer pools). Master Zero-Copy packet processing to prevent memory thrashing!",
    "conceptInvariant": "LwIP pbuf Reference Counting & Zero-Copy Invariant: In zero-copy LwIP pipelines, a pbuf chain traversing network layers must manage reference counts via pbuf_ref() and pbuf_free(); a pbuf is returned to the memory pool if and only if its reference count decrements to zero, preventing use-after-free and memory pool exhaustion.",
    "failureMode": "Forgetting to call pbuf_free() in an LwIP Raw API receive callback (tcp_recv); every incoming packet leaks a pbuf from the static memory pool (MEMP_PBUF_POOL), causing total network buffer exhaustion within 30 seconds and freezing all TCP connections.",
    "tryItFriction": "Implement an LwIP pbuf chained memory allocator in TypeScript: allocate fragmented pbuf chains representing a 1,500-byte TCP segment across 512-byte pool blocks; implement reference counting and payload traversal without copying; simulate packet headers prepending via pbuf_header(); and verify zero memory leaks upon release.",
    "socraticHints": [
      "Why is LwIP's Raw API faster and more memory-efficient than standard BSD sockets?",
      "Because BSD sockets require thread context switches and message queues to pass data between the user thread and the LwIP core thread!",
      "The Raw API executes directly inside the network thread's event loop via function pointers, eliminating queue overhead and memory copies."
    ],
    "situationalPuzzle": {
      "scenario": "An embedded C developer builds an HTTP server on STM32 using LwIP BSD sockets. When streaming 10 MB of sensor logs, throughput peaks at only 250 kB/s, and CPU usage is 100%. When rewritten using the LwIP Raw API with PBUF_REF zero-copy buffers, throughput surges to 1.8 MB/s with CPU usage at 25%. What explains this 7x performance leap?",
      "options": [
        "The Raw API overclocked the microcontroller crystal oscillator.",
        "Elimination of Thread Context Switching & Memory Copies: BSD sockets copy data from LwIP internal pbufs into socket mailbox queues and then into user buffers across FreeRTOS context switches. The Raw API passes pbufs directly via callbacks with zero memory copying and zero task scheduling overhead.",
        "The Ethernet cable was upgraded during the rewrite.",
        "BSD sockets disable hardware CRC offloading."
      ],
      "answerIdx": 1,
      "debrief": "On microcontrollers with modest clock speeds (100-240 MHz) and limited memory bandwidth, copying packets between memory buffers (memcpy) and switching RTOS task contexts for every socket call consumes massive CPU cycles. LwIP Raw API operates zero-copy, processing incoming frames directly in place."
    },
    "quests": [
      {
        "num": 1,
        "title": "LwIP Stack Internals & API Layering",
        "type": "Concept",
        "description": "Analyze LwIP architecture, Raw API vs Netconn vs BSD Sockets, core thread locking (LOCK_TCPIP_CORE), and MEMP memory pool configuration."
      },
      {
        "num": 2,
        "title": "pbuf Memory Pool Leak & Starvation Detective",
        "type": "Detective Challenge",
        "description": "Analyze an LwIP crash dump showing ERR_MEM (Out of Memory); pinpoint a missing pbuf_free() call in a custom UDP packet handler that starved the pool."
      },
      {
        "num": 3,
        "title": "Zero-Copy pbuf Memory Management Simulator",
        "type": "Mastery Assignment",
        "description": "Construct a TypeScript simulation of LwIP's pbuf memory architecture, implementing PBUF_RAM, PBUF_POOL chaining, reference counting, and zero-copy packet header manipulation."
      },
      {
        "num": 4,
        "title": "3 AM High-Throughput Industrial Gateway OOM Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity outage where an industrial Modbus-to-Ethernet gateway crashed under a TCP SYN flood due to unconstrained PCB (Protocol Control Block) allocation."
      }
    ]
  },
  {
    "day": 34,
    "month": 1,
    "blockNum": 7,
    "title": "TCP Socket Optimization: Window Sizes, Nagle's Algorithm (TCP_NODELAY) & Half-Open Sockets",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Transport Layer Tuning (TCP Latency, Buffering & Failure Modes)",
    "spokenGoal": "TCP was designed in the 1970s for wired computers, not for constrained microcontrollers communicating over lossy wireless channels. Today we master TCP Socket Optimization for IoT. Examine TCP Window Sizes: in constrained devices, TCP Receive Window (TCP_WND) is often restricted to 2 to 4 MSS (Maximum Segment Size = 1,460 bytes) due to RAM limits. Master Nagle's Algorithm: by default, TCP buffers small outgoing packets until an entire MSS is filled or an ACK for previous data arrives. When Nagle's algorithm interacts with the receiver's Delayed ACK timer (which waits 200 ms before acknowledging a packet), disaster strikes: small telemetry updates experience a brutal 200 ms latency penalty! Solving this requires setting the `TCP_NODELAY` socket option to disable Nagle. Finally, dissect the deadly Half-Open Socket: when an IoT node drops its wireless link without sending a FIN/RST packet, the cloud server thinks the connection is still alive for hours unless TCP Keep-Alive probes (SO_KEEPALIVE) are properly configured!",
    "conceptInvariant": "Nagle-Delayed-ACK Deadlock Invariant: If a sender buffers small payloads using Nagle's algorithm while the receiver delays acknowledgments via Delayed ACK (up to 200 ms), the socket deadlocks in a 200 ms wait state for every payload smaller than MSS, requiring TCP_NODELAY = 1 for real-time IoT responsiveness.",
    "failureMode": "Failing to enable SO_KEEPALIVE on an embedded TCP telemetry socket; when cellular or Wi-Fi towers silently drop NAT state, the microcontroller's socket remains in ESTABLISHED state forever, never reconnecting while telemetry silently vanishes into the ether.",
    "tryItFriction": "Construct a TCP state machine simulator in TypeScript: simulate the interaction between Nagle's algorithm and receiver Delayed ACK; measure latency for 50-byte telemetry frames with TCP_NODELAY enabled vs disabled; implement TCP Keep-Alive timers (tcp_keepalive_time = 60s, tcp_keepalive_intvl = 10s, tcp_keepalive_probes = 3); and detect dead half-open links.",
    "socraticHints": [
      "Why does a server keep a TCP socket open for hours if the IoT device abruptly loses power?",
      "Because TCP is a stateful connection with NO implicit background heartbeats! If neither side sends data, silence is considered perfectly normal.",
      "The server has no idea the client is dead until it attempts to transmit data and fails, or until TCP Keep-Alive probes timeout!"
    ],
    "situationalPuzzle": {
      "scenario": "An industrial robot controller sends 32-byte position updates to a central SCADA server over TCP every 20 ms. Engineers observe that position updates arrive in irregular batches every 200 ms rather than smoothly every 20 ms. Wireshark shows the client transmits one 32-byte packet, then waits exactly 200 ms for an ACK before sending the next. What single line of code fixes this?",
      "options": [
        "Increase the baud rate on the serial bus.",
        "Set the socket option: setsockopt(sockfd, IPPROTO_TCP, TCP_NODELAY, &enable, sizeof(enable)); to disable Nagle's algorithm, allowing small packets to transmit immediately without waiting for previous ACKs.",
        "Change the TCP port number to 8080.",
        "Disable IP checksum validation."
      ],
      "answerIdx": 1,
      "debrief": "This is the classic Nagle's algorithm vs Delayed ACK clash. Nagle refuses to send a new packet if any previous data is unacknowledged and the payload is smaller than MSS. The server delays its ACK by 200 ms. Setting TCP_NODELAY forces the TCP stack to transmit small packets immediately, restoring smooth 20 ms telemetry."
    },
    "quests": [
      {
        "num": 1,
        "title": "TCP Protocol Mechanics & Embedded Buffer Tuning",
        "type": "Concept",
        "description": "Analyze TCP sliding windows, MSS, TCP_WND, Nagle's algorithm, Delayed ACK, SO_KEEPALIVE, and TCP state transitions (SYN, ESTABLISHED, FIN_WAIT, TIME_WAIT)."
      },
      {
        "num": 2,
        "title": "Half-Open Socket & Zombie Connection Detective",
        "type": "Detective Challenge",
        "description": "Analyze cloud server logs showing 10,000 stale TCP connections consuming all file descriptors; diagnose missing TCP Keep-Alive probes on field gateways."
      },
      {
        "num": 3,
        "title": "TCP Flow Control & Nagle Algorithm Simulator Engine",
        "type": "Mastery Assignment",
        "description": "Develop a TypeScript engine that models TCP send/receive buffers, sliding window flow control, Nagle's buffering logic, and Keep-Alive dead link detection."
      },
      {
        "num": 4,
        "title": "3 AM Latency Spike & Socket Starvation Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-priority incident where an automated factory sorting line experienced 200 ms command latency spikes due to Nagle deadlock, causing robotic arm collisions."
      }
    ]
  },
  {
    "day": 35,
    "month": 1,
    "blockNum": 7,
    "title": "Milestone 6: LwIP Zero-Copy Socket Engine & Wi-Fi BLE Provisioning State Machine Engine",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Milestone 6 Synthesis (Embedded Networking Core Capstone)",
    "spokenGoal": "Congratulations on reaching Milestone 6. Today you synthesize everything learned across Block 7 to architect an integrated LwIP Zero-Copy Socket Engine and Wi-Fi BLE Provisioning State Machine Engine in TypeScript. Your engine combines two core systems: First, a zero-copy LwIP socket subsystem managing pbuf memory allocation chains, reference counting, TCP sliding window flow control, and TCP_NODELAY latency tuning. Second, a complete BLE-to-Wi-Fi Provisioning State Machine. Your engine will simulate an uncommissioned IoT node advertising a secure provisioning service over BLE, executing an X25519 authenticated key exchange, decrypting incoming WPA2/WPA3 Wi-Fi credentials, connecting in Station mode via the simulated LwIP stack, acquiring an IP via DHCP, and establishing an optimized low-latency TCP socket. This milestone bridges hardware-level short-range wireless to high-speed cloud IP networking.",
    "conceptInvariant": "End-to-End Onboarding & Transport Invariant: The embedded system must transition cleanly from BLE Provisioning state (unconfigured) to Wi-Fi Associated state (configured), tearing down BLE advertising to recover RF front-end bandwidth, and establishing a zero-copy TCP connection with TCP_NODELAY enabled within 3.0 seconds of credential receipt.",
    "failureMode": "Leaving the high-duty-cycle BLE provisioning advertiser active after successful Wi-Fi connection; shared 2.4 GHz antenna contention between BLE advertising and Wi-Fi data degrades Wi-Fi throughput by 70% and causes intermittent packet drops.",
    "tryItFriction": "Execute the Milestone 6 test harness: initiate BLE provisioning from a virtual smartphone client; transmit an encrypted Wi-Fi configuration payload; verify cryptographic decryption; simulate Wi-Fi station association; allocate zero-copy pbufs for a 50 KB data transfer; and assert zero memory leaks and sub-10 ms packet latency.",
    "socraticHints": [
      "Why must the BLE advertising stack be disabled as soon as Wi-Fi connects on single-chip SoCs like ESP32?",
      "Because on single-chip SoCs, Wi-Fi and BLE share the EXACT SAME 2.4 GHz antenna and RF frontend via an internal RF switch!",
      "If BLE continues advertising rapidly, the internal packet traffic arbiter (PTA) must constantly interrupt Wi-Fi reception, causing dropped frames and degraded throughput."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 6 engine completes BLE provisioning and transitions to Wi-Fi station mode. However, the simulated LwIP stack exhausts its pbuf pool after transferring 100 KB, while CPU utilization hits 100%. Diagnostic logs show pbuf_free() was called, but reference counts remained at 1. What caused the memory leak?",
      "options": [
        "The Wi-Fi password was too long.",
        "Reference Count Leak in Chained Processing: A custom packet filter retained references via pbuf_ref() on intermediate chained pbuf buffers during header inspection but only released the head pbuf. The trailing pbufs in the chain remained locked with ref count > 0, permanently leaking pool memory.",
        "The simulated router crashed.",
        "TypeScript memory was garbage collected prematurely."
      ],
      "answerIdx": 1,
      "debrief": "In LwIP, chained pbufs (where a large packet spans multiple memory blocks) require careful reference management. If an application inspects individual buffers and increments their reference count without systematically traversing and decrementing the entire chain upon completion, trailing buffers are never returned to the pool, starving the network stack."
    },
    "quests": [
      {
        "num": 1,
        "title": "Integrated Provisioning & LwIP Stack Architecture",
        "type": "Concept",
        "description": "Construct the comprehensive system state diagram unifying BLE GATT provisioning, crypto handshake, Wi-Fi STA transition, and LwIP TCP socket binding."
      },
      {
        "num": 2,
        "title": "Chained pbuf Reference Count Leak Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded LwIP core dump showing memory pool exhaustion; identify a partial chain release that leaked trailing pbufs during high-throughput downloads."
      },
      {
        "num": 3,
        "title": "Milestone 6 LwIP Socket & Provisioning Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 6 Engine featuring BLE provisioning handshakes, cryptographic credential extraction, zero-copy pbuf allocation, and TCP_NODELAY streaming."
      },
      {
        "num": 4,
        "title": "Milestone 6 Production Stress & SRE Lab",
        "type": "Production Incident Lab",
        "description": "Execute an automated 1,000-cycle provisioning and data streaming stress test against the Milestone 6 engine, proving zero memory leaks, graceful failover, and strict timing compliance."
      }
    ]
  },
  {
    "day": 36,
    "month": 1,
    "blockNum": 8,
    "title": "MQTT Protocol Architecture: Fixed Headers, Variable Length Integers & Packet Framing",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "IoT Application Layer Protocols (MQTT Binary Framing & Header Physics)",
    "spokenGoal": "Welcome to Block 8. Now that we have established TCP/IP connectivity, what application protocol connects constrained nodes to enterprise cloud platforms? Enter MQTT (Message Queuing Telemetry Transport). Designed for low bandwidth, high latency, and unreliable networks, MQTT is the undisputed standard for IoT cloud messaging. Today we deconstruct MQTT packet framing. An MQTT packet consists of a Fixed Header (mandatory, 2 to 5 bytes), an optional Variable Header, and an optional Payload. Master the 1-byte Fixed Header: 4 bits for Packet Type (CONNECT, CONNACK, PUBLISH, PUBACK, etc.) and 4 bits for Flags (DUP, QoS level, RETAIN). Deconstruct the genius of Remaining Length: a variable-byte integer encoding where each byte uses 7 bits for data and the 8th bit as a continuation flag! This allows remaining length to scale from 1 byte (for small 10-byte payloads) up to 4 bytes (supporting payloads up to 256 megabytes) with minimal overhead.",
    "conceptInvariant": "Remaining Length Variable Byte Encoding Invariant: The Remaining Length field encodes an unsigned integer using 1 to 4 bytes; for each byte, bit 7 indicates whether another byte follows, and bits 0-6 encode value * 128^multiplier, capping maximum encoded length at 268,435,455 bytes (0xFF 0xFF 0xFF 0x7F).",
    "failureMode": "Corrupting the variable-byte remaining length parser when reading from a TCP stream; reading a multi-byte length without checking for socket fragmentation causes the parser to interpret payload bytes as headers, resulting in fatal packet desynchronization.",
    "tryItFriction": "Implement an MQTT Variable Byte Integer encoder and decoder in TypeScript: encode integer values from 0 up to 268,435,455 into 1-4 byte arrays; decode them back; and verify that value 64 encodes to [0x40], value 321 encodes to [0xC1, 0x02], and value 2097151 encodes to [0xFF, 0xFF, 0x7F].",
    "socraticHints": [
      "Why is MQTT's variable byte integer encoding superior to a fixed 4-byte uint32 field for IoT?",
      "Because on battery-constrained networks, every single byte counts! For 95% of IoT sensor payloads (<128 bytes), Remaining Length consumes only a SINGLE BYTE instead of 4 bytes.",
      "Saving 3 bytes per packet across 10 million daily sensor transmissions saves over 30 GB of cellular data per day!"
    ],
    "situationalPuzzle": {
      "scenario": "A junior engineer writes a custom MQTT parser in C. In lab testing with small packets (<100 bytes), everything works. In production, a device transmits a 300-byte JSON payload. The broker immediately drops the TCP connection with 'Protocol Violation'. Packet captures show the device encoded Remaining Length as [0x2C, 0x01]. What went wrong in the device's encoder?",
      "options": [
        "The device used UTF-8 instead of ASCII.",
        "Incorrect Variable Byte Continuation Bit: The device encoded 300 (0x012C). In MQTT, the first byte must have its continuation bit (bit 7) SET to indicate another byte follows (300 % 128 = 44 = 0x2C \u2192 with bit 7 set: 0xAC). The correct encoding is [0xAC, 0x02]. Because bit 7 was clear, the broker interpreted length as only 44 bytes and failed on the trailing bytes.",
        "MQTT packets cannot exceed 256 bytes.",
        "The broker required TLS."
      ],
      "answerIdx": 1,
      "debrief": "In variable-byte encoding, each byte except the last MUST have bit 7 set (OR 0x80) to signal continuation. 300 / 128 = 2 remainder 44. The first byte must be 44 | 0x80 = 0xAC, followed by 2 (0x02). Sending [0x2C, 0x01] tells the broker the remaining length is only 44 bytes; the broker then reads the next byte (0x01) as the next packet's header, triggering a protocol violation."
    },
    "quests": [
      {
        "num": 1,
        "title": "MQTT Binary Protocol Framing & Header Layout",
        "type": "Concept",
        "description": "Deconstruct the 14 MQTT packet types, fixed header flag rules, variable byte integer math, and topic name UTF-8 encoding."
      },
      {
        "num": 2,
        "title": "Variable Byte Framing Desynchronization Detective",
        "type": "Detective Challenge",
        "description": "Analyze a Wireshark capture where an MQTT broker severed client connections; pinpoint an off-by-one variable length calculation that caused framing desynchronization."
      },
      {
        "num": 3,
        "title": "MQTT Binary Packet Serializer & Deserializer Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine that serializes and deserializes raw binary MQTT packets (CONNECT, CONNACK, PUBLISH, PUBACK, PINGREQ, PINGRESP), validating variable byte fields."
      },
      {
        "num": 4,
        "title": "3 AM Stream Fragmentation & Packet Parser Crash Lab",
        "type": "Production Incident Lab",
        "description": "Fix a critical crash in an industrial edge broker where TCP socket MTU fragmentation split MQTT fixed headers across packet chunks, triggering buffer underflow exceptions."
      }
    ]
  },
  {
    "day": 37,
    "month": 1,
    "blockNum": 8,
    "title": "Quality of Service (QoS): QoS 0, QoS 1 (PUBACK) & QoS 2 (PUBREC / PUBREL / PUBCOMP)",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Application Reliability & Delivery Guarantees (QoS 0/1/2)",
    "spokenGoal": "How does an IoT application guarantee message delivery over an unstable wireless connection? Master MQTT Quality of Service (QoS). MQTT defines three delivery levels: QoS 0 ('At most once' - fire and forget, no packet ID, no acknowledgment; if a packet drops, it is lost forever; best for high-frequency disposable telemetry like temperature readings). QoS 1 ('At least once' - the publisher assigns a 16-bit Packet Identifier; the receiver replies with PUBACK; if PUBACK is not received within a timeout, the publisher retransmits with the DUP flag set; duplicates can occur!). QoS 2 ('Exactly once' - the highest reliability, guaranteed single delivery with zero duplicates). Master the 4-way QoS 2 Handshake: (1) Publisher sends PUBLISH; (2) Receiver saves packet ID and replies with PUBREC; (3) Publisher releases the message and replies with PUBREL; (4) Receiver completes delivery and replies with PUBCOMP. Understand the heavy network overhead of QoS 2 before using it in production!",
    "conceptInvariant": "QoS 2 Exactly-Once 4-Way Handshake Invariant: To prevent duplicate processing and message loss, QoS 2 requires an atomic state transition across both sender and receiver: PUBLISH \u2192 PUBREC (guaranteeing message reception) \u2192 PUBREL (guaranteeing state release) \u2192 PUBCOMP (confirming transaction completion).",
    "failureMode": "Blindly configuring QoS 2 on every sensor telemetry topic; the 4-packet round-trip handshake multiplies network latency and cellular data consumption by 400%, overwhelming low-power radio queues and exhausting broker memory.",
    "tryItFriction": "Implement the complete MQTT QoS 1 and QoS 2 state machines in TypeScript: handle packet identifier generation (1 to 65535); implement retransmission timers with exponential backoff for unacknowledged QoS 1 packets; and implement the 4-way state transition for QoS 2, verifying exactly-once payload delivery without duplicates.",
    "socraticHints": [
      "Why does QoS 1 permit duplicate messages to arrive at the subscriber?",
      "Because if the receiver successfully ingests the PUBLISH and sends PUBACK, but the PUBACK packet is dropped by RF interference on its way back, the sender assumes the message was lost and retransmits it!",
      "The receiver processes the second packet as a new message. If your database cannot tolerate duplicates, you must use QoS 2 or implement idempotency keys!"
    ],
    "situationalPuzzle": {
      "scenario": "A connected financial vending machine dispenses cash upon receiving an MQTT command. The initial prototype used QoS 1 on topic 'vending/dispense'. During a cellular fade, a customer reported the machine dispensed $100 twice instead of once. Cloud logs show two identical PUBLISH packets received with Packet ID 42 and DUP=1 on the second. How does the architecture prevent double dispensing?",
      "options": [
        "Downgrade the topic to QoS 0.",
        "Upgrade the critical command topic to QoS 2 (or enforce application-layer idempotency tracking transaction UUIDs), guaranteeing that even if network ACKs are lost, the dispensing action executes exactly once.",
        "Add a 5-second sleep before dispensing.",
        "Change the MQTT client ID."
      ],
      "answerIdx": 1,
      "debrief": "QoS 1 guarantees delivery, but explicitly permits duplicates when PUBACKs are lost in transit. For critical financial or mechanical actions where duplicate execution causes physical or monetary harm, QoS 2 must be used (or the application must deduplicate based on an idempotency key) to guarantee exactly-once processing."
    },
    "quests": [
      {
        "num": 1,
        "title": "QoS Delivery Guarantees & Handshake Protocols",
        "type": "Concept",
        "description": "Deconstruct QoS 0, 1, and 2 packet exchange flows, Packet Identifier management, DUP bit mechanics, and bandwidth/latency trade-offs."
      },
      {
        "num": 2,
        "title": "QoS 1 Duplicate Delivery & State Corruption Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated warehouse inventory log where inventory counts drifted; prove how dropped PUBACK packets caused duplicate inventory decrements."
      },
      {
        "num": 3,
        "title": "Complete MQTT QoS 0/1/2 State Machine Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript MQTT QoS Engine that manages in-flight packet tables, retransmission timers, PUBACK/PUBREC/PUBREL/PUBCOMP state tracking, and duplicate rejection."
      },
      {
        "num": 4,
        "title": "3 AM QoS 2 Handshake Deadlock & Memory Leak Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity incident where an enterprise MQTT broker ran out of RAM due to millions of uncompleted QoS 2 PUBREC transactions during an edge connectivity collapse."
      }
    ]
  },
  {
    "day": 38,
    "month": 1,
    "blockNum": 8,
    "title": "In-Flight Message Queues, Packet ID Exhaustion & Offline Buffering Under Broker Outages",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Resilient Telemetry Architecture (Queue Management & Backpressure)",
    "spokenGoal": "What happens to your IoT device when the cellular network drops for 4 hours while the machine continues producing sensor telemetry? Today we master In-Flight Message Queues, Packet ID Management, and Offline Buffering. In MQTT, the Packet Identifier is a 16-bit unsigned integer (1 to 65,535). A Packet ID cannot be reused until its corresponding QoS 1 or QoS 2 handshake completes. If you fire packets faster than the network can acknowledge them, you hit Packet ID Exhaustion! To survive broker outages, an embedded client must maintain two distinct queues: an In-Flight Queue (messages awaiting network ACK, bounded by `max_inflight_messages`, typically 10 to 20 to prevent TCP socket starvation) and a Persistent Offline Storage Queue (in flash memory or LittleFS). Master backpressure: when the offline flash queue fills to capacity, what is your eviction policy? FIFO ring-buffer eviction (drop oldest)? Or priority-based shedding (drop routine telemetry, preserve critical safety alarms)?",
    "conceptInvariant": "Packet Identifier Uniqueness & In-Flight Bound Invariant: A Packet Identifier (1 \u2264 PID \u2264 65535) is strictly locked in the In-Flight Queue from initial PUBLISH transmission until receipt of final acknowledgment (PUBACK or PUBCOMP); total concurrent in-flight messages must not exceed Receive Maximum to prevent broker buffer exhaustion.",
    "failureMode": "Allocating Packet IDs sequentially without tracking active in-flight allocations; during a network stall, the counter wraps around 65,535 and reuses an active PID, corrupting in-flight state and causing the broker to acknowledge the wrong packet.",
    "tryItFriction": "Construct an In-Flight and Offline Telemetry Queuing Engine in TypeScript: implement a PID allocator pool with recycle tracking; enforce an in-flight window of 10 messages; implement an offline buffer with configurable eviction policies (Drop Oldest vs Drop Lowest Priority); and simulate a 30-minute broker disconnection followed by a high-speed reconnection burst.",
    "socraticHints": [
      "Why shouldn't an embedded MQTT client allow an unlimited number of in-flight messages?",
      "Because each in-flight message consumes RAM on both the client and broker while awaiting ACK!",
      "If the connection slows down, thousands of in-flight packets will exhaust device heap memory and cause massive retransmission storms upon reconnection."
    ],
    "situationalPuzzle": {
      "scenario": "A connected locomotive travels through a 2-hour mountain tunnel with zero cellular coverage. The onboard IoT gateway records engine diagnostic telemetry (100 messages/min). When exiting the tunnel, cellular reconnects. The gateway immediately floods the broker with 12,000 unacknowledged QoS 1 packets. The gateway crashes with Out of Memory (OOM). What architectural safeguard was missing?",
      "options": [
        "The gateway should have discarded all data while inside the tunnel.",
        "Bounded In-Flight Flow Control & Throttled Reconnection: The gateway should cap in-flight messages (e.g., max_inflight = 20) and pull messages from the offline flash queue only as PUBACKs are received, preventing RAM exhaustion and network congestion storms.",
        "The gateway should have increased cellular transmit power.",
        "The broker should have disabled authentication."
      ],
      "answerIdx": 1,
      "debrief": "An offline buffer must drain into the network under strict flow control. By limiting in-flight messages to a small window (e.g., 20), the client only holds 20 messages in RAM at any moment. As PUBACKs arrive, the client pops the next 20 messages from flash, draining the 12,000-message backlog smoothly without memory exhaustion."
    },
    "quests": [
      {
        "num": 1,
        "title": "In-Flight Windowing & Packet ID Lifecycle",
        "type": "Concept",
        "description": "Deconstruct 16-bit PID allocation pools, in-flight window bounds, MQTT v5.0 Receive Maximum property, and offline queue eviction algorithms."
      },
      {
        "num": 2,
        "title": "Packet ID Collision & Memory Thrashing Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded gateway crash dump where rapid PID rollover corrupted active in-flight message tables; diagnose missing allocation bitmap tracking."
      },
      {
        "num": 3,
        "title": "Production Offline Queuing & In-Flight Throttle Engine",
        "type": "Mastery Assignment",
        "description": "Build a resilient TypeScript queuing engine featuring in-flight windowing, PID pool recycling, prioritized persistent flash storage simulation, and backpressure rate limiting."
      },
      {
        "num": 4,
        "title": "3 AM Reconnection Burst & Broker OOM Crash Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an outage where 50,000 smart meters simultaneously reconnected after a regional cellular blackout, generating a DDOS reconnection storm that crashed the enterprise cloud broker."
      }
    ]
  },
  {
    "day": 39,
    "month": 1,
    "blockNum": 8,
    "title": "MQTT Session State: Clean Session vs Clean Start, Keep-Alive Pings & Last Will and Testament",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Session Lifecycle & Fault Detection (LWT, Keep-Alive & Session Expiry)",
    "spokenGoal": "How does an enterprise cloud know the exact instant an edge IoT device dies, even if the device lost power without sending a goodbye packet? Today we master MQTT Session State and Fault Detection. Contrast MQTT v3.1.1's CleanSession flag with MQTT v5.0's Clean Start and Session Expiry Interval. When CleanSession = false, the broker remembers the client's subscriptions and buffers undelivered QoS 1/2 messages while the client is offline. In MQTT v5.0, Session Expiry Interval allows sessions to persist for hours or days without lingering indefinitely in broker memory. Master Keep-Alive and PINGREQ: the client specifies a Keep-Alive interval (e.g., 60 seconds). If no other packets are sent, the client transmits PINGREQ, and the broker replies with PINGRESP. If the broker receives nothing for 1.5 times the Keep-Alive interval (90 seconds), it declares the client DEAD. Master Last Will and Testament (LWT): when connecting, the client registers an LWT topic and payload (e.g., status/node-1 \u2192 'offline'). If the client disconnects ungracefully, the broker automatically publishes the LWT message to the entire world!",
    "conceptInvariant": "Last Will and Testament (LWT) Execution Invariant: The broker is strictly required to publish the client's pre-registered LWT message if and only if the network connection closes ungracefully (TCP RST, keep-alive timeout, or socket break without a preceding DISCONNECT packet); a graceful DISCONNECT packet disarms and deletes the LWT.",
    "failureMode": "Setting Keep-Alive to 1,200 seconds (20 minutes) on a mission-critical industrial safety controller; when a backhoe cuts the fiber cable, the cloud dashboard continues reporting the machine as 'ONLINE and NORMAL' for 30 minutes before the broker finally realizes the connection is dead.",
    "tryItFriction": "Implement an MQTT Client and Broker Session Manager in TypeScript: handle CONNECT with CleanSession and LWT parameters; simulate periodic PINGREQ/PINGRESP exchanges; trigger an ungraceful TCP drop and verify that the broker immediately dispatches the LWT payload to all active subscribers; verify that a graceful DISCONNECT disarms the LWT.",
    "socraticHints": [
      "Why doesn't the broker send the Last Will message if the client sends a DISCONNECT packet before closing the socket?",
      "Because sending DISCONNECT proves the client shut down intentionally and cleanly!",
      "LWT is an emergency death notification designed exclusively to alert the world when an unexpected catastrophe occurs (power cut, firmware crash, cable severed)."
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of 10,000 smart EV chargers uses MQTT. EV drivers frequently complain that chargers show as 'AVAILABLE' on mobile apps, but when they arrive, the charger is powered off. Analysis shows chargers use CleanSession = true, Keep-Alive = 600s (10 min), and no LWT. How should the system architecture be overhauled for real-time presence?",
      "options": [
        "Poll every charger every second via HTTP.",
        "Implement Last Will and Testament: (1) Charger connects with LWT topic 'chargers/{id}/status' and payload '{\"online\": false}'; (2) Upon connection, charger publishes '{\"online\": true}' with RETAIN=true; (3) Set Keep-Alive to 30s. If power is cut, the broker publishes the LWT within 45s, updating apps immediately.",
        "Require drivers to press a physical button on the charger.",
        "Switch from MQTT to FTP."
      ],
      "answerIdx": 1,
      "debrief": "The combination of Retained Messages and Last Will and Testament is the industry gold standard for IoT device presence. When online, the device publishes 'online' (retained). If the device dies, the broker automatically publishes the LWT 'offline' (retained) after the 1.5x keep-alive timeout, ensuring all dashboards and mobile apps reflect real-time operational status."
    },
    "quests": [
      {
        "num": 1,
        "title": "MQTT Session Lifecycle & Presence Architecture",
        "type": "Concept",
        "description": "Deconstruct CleanSession vs Clean Start, Session Expiry Interval, Keep-Alive multiplier (1.5x), PINGREQ/RESP framing, and LWT execution rules."
      },
      {
        "num": 2,
        "title": "Ghost Device & Stale Presence State Detective",
        "type": "Detective Challenge",
        "description": "Analyze an IoT fleet monitoring dashboard reporting 100% device health while 300 factory nodes were offline; diagnose missing LWT configurations and excessive keep-alive intervals."
      },
      {
        "num": 3,
        "title": "MQTT Session Manager & Heartbeat Watchdog Engine",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript MQTT session coordinator that enforces keep-alive timers, issues PINGREQs, manages persistent session state across reconnections, and triggers LWT dispatches upon ungraceful drops."
      },
      {
        "num": 4,
        "title": "3 AM Mass Ping Storm & Broker Connection Collapse Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an operational crisis where 100,000 smart thermostats synchronized their keep-alive timers, creating a periodic 100,000-packet PINGREQ spike that throttled cloud broker CPU."
      }
    ]
  },
  {
    "day": 40,
    "month": 1,
    "blockNum": 8,
    "title": "Milestone 7: Production Resilient MQTT Client with QoS 2 State Machine & Offline Queuing Engine",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Milestone 7 Synthesis (MQTT Cloud Protocol Capstone)",
    "spokenGoal": "Outstanding achievement reaching Milestone 7. Today you engineer a Production Resilient MQTT Client with QoS 2 State Machine and Offline Queuing Engine in TypeScript. Your engine brings together the full application-layer messaging architecture: binary packet serialization with variable-byte remaining length framing, the complete 4-way QoS 2 exactly-once state machine, in-flight windowing with PID recycle pools, persistent offline buffering with priority-based eviction, and autonomous session management with Keep-Alive heartbeats and Last Will and Testament (LWT) support. Your engine will simulate an industrial telemetry edge node connecting to a cloud broker, surviving severe network blackouts, buffering critical alarms in flash, draining backlogs smoothly upon reconnection without memory exhaustion, and guaranteeing zero message loss or duplicate execution. This milestone solidifies your mastery of cloud-connected IoT systems.",
    "conceptInvariant": "End-to-End Resilient Messaging Invariant: The MQTT client must guarantee: (1) In-flight messages never exceed Max_In_Flight (default 10); (2) QoS 2 transactions complete with exactly-once semantic integrity; (3) Offline buffer preserves critical priority telemetry during outages; and (4) Reconnection drains backpressure without PID collisions or broker drops.",
    "failureMode": "Deploying an MQTT client that discards the offline queue on reconnection or floods the TCP socket with unthrottled burst traffic; the sudden bandwidth surge trips the cloud broker's rate limiter, severing the connection and losing all buffered outage telemetry.",
    "tryItFriction": "Execute the Milestone 7 verification suite: instantiate your resilient MQTT client; connect with LWT configured; stream continuous QoS 1 and QoS 2 telemetry; simulate a 10-second total network disconnection; inject 50 sensor events during the outage; reconnect; verify that all 50 events are delivered in order with valid PIDs and zero duplicates; and verify that LWT dispatches upon an ungraceful drop.",
    "socraticHints": [
      "How does a client know whether its session was preserved by the broker upon reconnection?",
      "Look at the CONNACK packet! The broker returns a 1-byte Connect Acknowledge Flags field.",
      "Bit 0 is the Session Present flag. If Session Present = 1, the broker remembered the client's subscriptions and in-flight state. If 0, the client must re-subscribe to all topics!"
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 7 MQTT client reconnects after an outage. The broker sends CONNACK with Session Present = 0 (clean session created because server restarted). Your client had 15 in-flight QoS 2 messages that were halfway through their 4-way handshakes before the outage. What must your client do with those 15 messages?",
      "options": [
        "Assume the broker processed them and discard them from memory.",
        "Re-evaluate and Re-publish: Because the broker lost session state (Session Present = 0), all past in-flight state is void on the server. The client must reset the 15 messages to unacknowledged state, assign fresh PIDs, and re-transmit them from the beginning of the QoS 2 handshake.",
        "Crash the client application.",
        "Send 15 PINGREQ packets immediately."
      ],
      "answerIdx": 1,
      "debrief": "When Session Present is 0 in CONNACK, the broker has no memory of past transactions. Any previously in-flight messages that were not fully confirmed are completely unknown to the broker. The client must reset their state machine and re-transmit them as new publications to ensure critical telemetry is not permanently lost."
    },
    "quests": [
      {
        "num": 1,
        "title": "Complete Resilient MQTT Client Architecture",
        "type": "Concept",
        "description": "Construct the formal architecture diagram for an enterprise MQTT client, mapping socket readers, packet framers, in-flight tables, offline queues, and state machines."
      },
      {
        "num": 2,
        "title": "Session Present Desynchronization Detective",
        "type": "Detective Challenge",
        "description": "Analyze an edge gateway log showing missing telemetry after broker failover; pinpoint failure to inspect CONNACK Session Present flags and resubscribe to topics."
      },
      {
        "num": 3,
        "title": "Milestone 7 Resilient MQTT Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 7 Engine featuring full binary framing, QoS 0/1/2 state machines, in-flight windowing, offline buffering, and LWT presence tracking."
      },
      {
        "num": 4,
        "title": "Milestone 7 Production Chaos & SRE Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Milestone 7 engine to live chaos injection: simulate random TCP packet drops, broker restarts, high-speed telemetry bursts, and sudden power cuts, proving zero data loss."
      }
    ]
  },
  {
    "day": 41,
    "month": 1,
    "blockNum": 9,
    "title": "Constrained Application Protocol (CoAP): REST over UDP, 4-Byte Binary Header & Method Codes",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "UDP-Based Web Protocols (CoAP Architecture & Header Physics)",
    "spokenGoal": "Welcome to Block 9. While MQTT is a broker-centric publish/subscribe protocol over TCP, what protocol brings the familiar RESTful web architecture (GET, POST, PUT, DELETE) to ultra-constrained microcontrollers? Enter the Constrained Application Protocol (CoAP, RFC 7252). Built to run over UDP instead of TCP, CoAP strips away TCP's heavy 3-way handshake, connection state, and 20-byte headers. Deconstruct the CoAP 4-Byte Fixed Binary Header: 2 bits for Version (1), 2 bits for Message Type (Confirmable CON, Non-Confirmable NON, Acknowledgment ACK, Reset RST), 4 bits for Token Length (TKL, 0 to 8 bytes), 1 byte for Code (Method codes like 0.01 GET, 0.02 POST, 0.03 PUT, 0.04 DELETE, and Response codes like 2.05 Content, 4.04 Not Found), and 2 bytes for Message ID (used for duplicate detection). CoAP brings HTTP-like RESTful URI endpoints (e.g., `coap://sensor.local/temp`) to microcontrollers in just 4 bytes of protocol overhead!",
    "conceptInvariant": "CoAP Binary Header Compactness Invariant: Every CoAP message begins with a fixed 4-byte header: (Ver:2 | T:2 | TKL:4) | Code:8 | Message_ID:16, enabling full RESTful client-server transaction initiation over raw UDP datagrams without prior connection negotiation.",
    "failureMode": "Attempting to use CoAP over lossy cellular networks without handling UDP datagram fragmentation; sending CoAP payloads exceeding the network path MTU (e.g., >1,280 bytes) triggers IP fragmentation, where dropping a single fragment drops the entire datagram.",
    "tryItFriction": "Construct a CoAP 4-Byte Binary Header encoder and decoder in TypeScript: pack Version (1), Message Type (CON=0, NON=1, ACK=2, RST=3), Token Length (4), Method Code (0.01 GET), and a 16-bit Message ID into a raw 4-byte Buffer; decode it and verify bitfield integrity.",
    "socraticHints": [
      "Why does CoAP specify Method and Response codes in a split 'c.dd' format (e.g., 0.01 for GET, 2.05 for Content)?",
      "Because the 8-bit Code field is divided into a 3-bit Class and a 5-bit Detail! 0.01 means Class 0 (Request), Detail 1 (GET).",
      "2.05 means Class 2 (Success), Detail 5 (Content - equivalent to HTTP 200 OK)! This bitwise split mirrors HTTP status codes in a single byte."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware developer wants to read battery level from a remote sensor running on a coin-cell battery. Using HTTP over TCP/TLS, the query requires a TCP 3-way handshake, TLS 1.3 handshake, HTTP GET request, response, and TCP FIN close (over 4,000 bytes exchanged). How does CoAP over UDP achieve this in a single exchange?",
      "options": [
        "CoAP sends the battery level over AM radio.",
        "Zero-Handshake REST over UDP: The client sends a single 12-byte CoAP Confirmable GET datagram (4-byte header + 2-byte token + Uri-Path option). The sensor immediately replies with a Piggybacked ACK containing the 2.05 Content response (16 bytes). The entire transaction completes in 28 bytes total across one round-trip!",
        "CoAP requires 10 round trips to authenticate UDP.",
        "UDP packets cannot transmit data smaller than 1,000 bytes."
      ],
      "answerIdx": 1,
      "debrief": "CoAP was specifically designed to eliminate connection handshake bloat. Running over UDP, a client sends a single CON GET packet with a Uri-Path option. The server replies with a piggybacked ACK containing the data. What takes 4 KB and multiple round trips in HTTP/TLS takes under 30 bytes in CoAP, saving 99% of radio battery energy."
    },
    "quests": [
      {
        "num": 1,
        "title": "CoAP Protocol Architecture & Binary Header Specification",
        "type": "Concept",
        "description": "Deconstruct RFC 7252 CoAP header fields, message types (CON, NON, ACK, RST), method codes (Class.Detail), and CoAP option delta-length encoding."
      },
      {
        "num": 2,
        "title": "CoAP Header Bitfield Corruption Detective",
        "type": "Detective Challenge",
        "description": "Analyze an ethereal UDP capture where a CoAP server dropped incoming requests; pinpoint an endianness bug in Message ID packing that broke token matching."
      },
      {
        "num": 3,
        "title": "Binary CoAP Header & Option Serializer Engine",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript parser and serializer for raw binary CoAP messages, implementing Option Delta encoding (Uri-Path, Content-Format, Max-Age) and payload markers (0xFF)."
      },
      {
        "num": 4,
        "title": "3 AM UDP Packet Fragmentation Blackout Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an outage in a smart city parking sensor mesh where large CoAP payloads caused IP packet fragmentation over 6LoWPAN, collapsing packet delivery rates."
      }
    ]
  },
  {
    "day": 42,
    "month": 1,
    "blockNum": 9,
    "title": "CoAP Reliability, Retransmissions & Congestion Control: Stop-and-Wait ARQ & NSTART",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "UDP Reliability & Flow Control (CoAP ARQ & Congestion Bounds)",
    "spokenGoal": "Because UDP provides zero native reliability, how does CoAP guarantee packet delivery without inheriting TCP's heavyweight overhead? Today we master CoAP Reliability, Retransmissions, and Congestion Control. In CoAP, reliability is built directly into the application layer using Confirmable (CON) messages and Stop-and-Wait Automatic Repeat reQuest (ARQ). When a client sends a CON message, it starts a Retransmission Timer initialized to a random ACK_TIMEOUT between 2.0 and 3.0 seconds (ACK_RANDOM_FACTOR = 1.5). If no ACK matching the Message ID arrives before timeout, the client retransmits with exponential backoff (doubling the timeout) up to MAX_RETRANSMIT (default 4). If no ACK arrives after 4 retries, the transaction fails. Crucially, examine Congestion Control and NSTART: CoAP mandates that a client must not have more than NSTART (default 1) outstanding unacknowledged CON interaction to a single destination at any time, preventing packet congestion collapse on constrained mesh networks!",
    "conceptInvariant": "CoAP NSTART Congestion Control Invariant: A CoAP endpoint must not transmit a new Confirmable (CON) request to a given destination if there is already an unacknowledged CON request in-flight to that destination (NSTART = 1), preventing buffer bloat and queue exhaustion in low-power mesh routers.",
    "failureMode": "Ignoring the NSTART=1 invariant and firing 20 concurrent CoAP CON requests across a low-power 802.15.4 mesh network; intermediate router queues overflow instantly, triggering synchronized retransmission storms that paralyze the entire wireless mesh.",
    "tryItFriction": "Implement the CoAP Stop-and-Wait ARQ retransmission state machine in TypeScript: configure ACK_TIMEOUT = 2.0s, ACK_RANDOM_FACTOR = 1.5, MAX_RETRANSMIT = 4; simulate a lossy UDP channel with 50% packet drop; trace message retransmissions with randomized exponential backoff; and enforce the NSTART = 1 blocking queue.",
    "socraticHints": [
      "Why does CoAP randomize its initial ACK_TIMEOUT between 2.0 and 3.0 seconds instead of using a fixed 2.0 seconds?",
      "To prevent synchronized retransmission collisions! If multiple sensor nodes wake up and send requests simultaneously, fixed timers would cause all nodes to retransmit at the exact same millisecond after a dropped packet.",
      "Randomizing the timeout with ACK_RANDOM_FACTOR introduces jitter that desynchronizes retransmissions."
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of battery-powered agricultural sensors sends soil moisture readings to a central CoAP gateway using Confirmable (CON) messages. During an RF fade, a sensor retransmits a reading 4 times. On attempt 3, the gateway finally receives the packet and sends an ACK. However, the sensor's attempt 2 packet was merely delayed in a mesh queue and arrives at the gateway 500 ms later. How does the gateway recognize attempt 2 as a duplicate?",
      "options": [
        "The gateway compares the soil moisture values.",
        "Message ID Duplicate Detection: CoAP headers include a 16-bit Message ID. The gateway maintains a recent Message ID cache. When it receives a packet with a Message ID it has already processed within EXCHANGE_LIFETIME, it silently discards the duplicate payload and re-sends the ACK.",
        "The gateway reboots itself.",
        "UDP automatically drops all delayed packets."
      ],
      "answerIdx": 1,
      "debrief": "CoAP relies on Message IDs to decouple reliability from message semantics. When an ACK is delayed or lost, the client retransmits using the IDENTICAL Message ID. The server maintains a sliding window of recent Message IDs; upon detecting a duplicate Message ID, it drops the duplicate payload and re-emits the matching ACK."
    },
    "quests": [
      {
        "num": 1,
        "title": "CoAP Retransmission Timing & RFC 7252 ARQ Math",
        "type": "Concept",
        "description": "Deconstruct ACK_TIMEOUT, ACK_RANDOM_FACTOR, MAX_RETRANSMIT, MAX_TRANSMIT_SPAN, EXCHANGE_LIFETIME, and the NSTART congestion control boundary."
      },
      {
        "num": 2,
        "title": "Mesh Buffer Bloat & Retransmission Storm Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log of a 6LoWPAN mesh where bursting 10 CoAP CON requests caused cascading packet drops; diagnose NSTART violation."
      },
      {
        "num": 3,
        "title": "CoAP Stop-and-Wait ARQ & Retransmission Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript CoAP reliability engine implementing randomized exponential backoff, NSTART=1 request queuing, and Message ID duplicate filtering."
      },
      {
        "num": 4,
        "title": "3 AM Lossy Wireless Telemetry Congestion Lab",
        "type": "Production Incident Lab",
        "description": "Remediate a high-severity production failure where lossy satellite uplinks caused CoAP clients to exhaust retransmission limits, triggering premature connection terminations."
      }
    ]
  },
  {
    "day": 43,
    "month": 1,
    "blockNum": 9,
    "title": "CoAP Block-Wise Transfers (RFC 7959): Block1 (Request) & Block2 (Response) Slicing",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Application-Layer Segmentation (Block1 & Block2 Protocol Mechanics)",
    "spokenGoal": "What happens when an IoT device needs to upload a 50 kilobyte diagnostic log or download a 500 kilobyte firmware update over a constrained wireless network where the MTU is only 128 bytes? In TCP, the transport layer handles segmentation automatically. But in CoAP over UDP, sending a large payload triggers IP fragmentation, which is disastrous on lossy wireless meshes. Today we master CoAP Block-Wise Transfers (RFC 7959). Block-wise transfers allow application-layer slicing of large payloads into small, individually acknowledged blocks without relying on IP fragmentation! Master the two block options: Block1 (used when the client sends a large payload to the server, e.g., PUT or POST firmware chunks) and Block2 (used when the server sends a large payload back to the client, e.g., GET large resource). Deconstruct the 3-byte Block Option encoding: Block Number (NUM), More Flag (M: 1 if more blocks follow, 0 for final block), and Size Exponent (SZX: 2^(SZX + 4) bytes, scaling from 16 to 1,024 bytes per block).",
    "conceptInvariant": "Block Option Triplet Encoding Invariant: The Block1 and Block2 options encode a 3-field tuple: Value = (NUM << 4) | (M << 3) | SZX, where NUM specifies block index, M indicates more blocks to follow, and SZX dictates block byte size as SSIZE = 2^(SZX + 4) \u2208 [16, 32, 64, 128, 256, 512, 1024].",
    "failureMode": "Attempting to perform a Firmware-Over-The-Air (FOTA) transfer over CoAP by blasting a 200 KB binary in a single PUT request; 6LoWPAN fragments the datagram into 1,600 radio packets; if a single radio packet drops, the entire 200 KB is lost, making OTA updates statistically impossible.",
    "tryItFriction": "Construct a CoAP Block2 response pagination engine in TypeScript: take a 2,000-byte string; encode the Block2 option with SZX = 2 (64 bytes per block); serve blocks sequentially upon receiving client GET requests with increasing NUM; set M = 1 for blocks 0 through 30, and M = 0 on block 31 (the final 16 bytes); verify complete payload reassembly.",
    "socraticHints": [
      "Why is application-layer Block-wise transfer vastly superior to IP-layer fragmentation on lossy mesh networks?",
      "Because in IP fragmentation, if 1 fragment out of 10 is dropped by RF noise, the ENTIRE packet must be retransmitted from scratch!",
      "With CoAP Block-wise transfer, each individual 64-byte block is acknowledged independently. If Block 4 is dropped, ONLY Block 4 is retransmitted!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart electric meter downloads a 64 KB tariff table from a CoAP server using Block2 transfers with 64-byte blocks (NUM = 0 to 1023). On Block 412, an RF collision drops the packet. The meter retransmits GET with Block2 NUM=412. The server returns Block 412, and the download resumes seamlessly to completion. How much data was retransmitted to recover from the drop?",
      "options": [
        "The entire 64 KB tariff table had to be downloaded again.",
        "Exactly 64 bytes! Because CoAP Block-wise transfer acknowledges and requests blocks at the application layer, only the single dropped 64-byte block was retransmitted, wasting zero bandwidth.",
        "1,280 bytes of IP headers.",
        "Zero bytes because UDP retransmits invisibly."
      ],
      "answerIdx": 1,
      "debrief": "This demonstrates the immense power of RFC 7959 Block-wise transfer. Instead of aborting a multi-kilobyte transfer upon packet loss, each block is an independent CoAP request-response transaction. Only the specific 64-byte block that was lost is re-requested, preserving battery and radio airtime on lossy links."
    },
    "quests": [
      {
        "num": 1,
        "title": "RFC 7959 Block-Wise Transfer Architecture & Option Encoding",
        "type": "Concept",
        "description": "Deconstruct Block1 vs Block2 flows, NUM/M/SZX bitfield packing, block size negotiation, and piggybacked vs separate responses."
      },
      {
        "num": 2,
        "title": "Block Transfer Desynchronization Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated FOTA update log where a device stalled at block 85; diagnose a server-side SZX size renegotiation that confused the client's byte offset calculation."
      },
      {
        "num": 3,
        "title": "CoAP Block1 & Block2 Segmentation and Reassembly Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine that chunks arbitrary binary buffers into RFC 7959 Block1 and Block2 streams, handles dynamic block sizing, and reassembles fragments with integrity checks."
      },
      {
        "num": 4,
        "title": "3 AM Constrained Mesh FOTA Slicing Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a firmware update crisis across 10,000 smart water meters where fluctuating RF link quality required dynamic block size down-negotiation (from 256B to 32B) to penetrate noise."
      }
    ]
  },
  {
    "day": 44,
    "month": 1,
    "blockNum": 9,
    "title": "The CoAP Observe Option (RFC 7641): Asynchronous Pub/Sub over UDP & DTLS Overhead",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Push-Based UDP Telemetry (Observe Subscriptions & Security Overhead)",
    "spokenGoal": "In standard REST, clients poll servers repeatedly: GET /temperature every 5 seconds. Polling wastes massive battery and bandwidth when values don't change. Today we master The CoAP Observe Option (RFC 7641). Observe transforms CoAP from a request-response protocol into a high-efficiency Publish/Subscribe model over UDP! A client sends a standard GET request containing the Observe option (value = 0 to register). The server registers the client in an internal Observer List and returns the current state. Whenever the resource state changes (e.g., temperature changes by 0.5\u00b0C), the server pushes an asynchronous notification packet containing an incrementing 24-bit Observe Sequence Number. Deconstruct how clients cancel subscriptions: either by sending a GET with Observe=1 (deregister), or by replying with a CoAP Reset (RST) packet when a notification arrives. Finally, evaluate DTLS (Datagram TLS) overhead: DTLS adds a 13-byte record header and requires cookie exchange to prevent denial-of-service amplification!",
    "conceptInvariant": "Observe Notification Reordering & Freshness Invariant: The 24-bit Observe sequence number in notification headers guarantees state freshness over reordered UDP links; an incoming notification is processed if and only if: (V_new > V_old && V_new - V_old < 2^23) || (V_new < V_old && V_old - V_new > 2^23) (modulo arithmetic).",
    "failureMode": "Failing to handle out-of-order UDP notifications in an Observe client; a delayed notification from 10 seconds ago arrives after a newer notification, overwriting the fresh sensor state with obsolete data.",
    "tryItFriction": "Implement a CoAP Observe Server in TypeScript: maintain an Observer Table of registered client UDP endpoints; implement state-change event triggers; push notifications with 24-bit sequence numbers; handle client RST cancellation; and implement sequence number freshness validation.",
    "socraticHints": [
      "How does a CoAP server know if an observing client has crashed or died?",
      "By periodically sending a notification as a Confirmable (CON) message instead of Non-Confirmable (NON)!",
      "If the client has crashed, it will not ACK the CON notification (or its firewall will reply with ICMP Port Unreachable / CoAP RST). The server then deletes the dead observer from its table."
    ],
    "situationalPuzzle": {
      "scenario": "A client observes a security alarm sensor (`coap://alarm/status`) over UDP. Network jitter causes UDP packet reordering. The server sends Notification #100 ('DOOR OPEN') followed 100 ms later by Notification #101 ('DOOR CLOSED'). Due to routing delays, Notification #101 arrives first at the client. 50 ms later, Notification #100 arrives. How must the client handle Notification #100?",
      "options": [
        "Update status to 'DOOR OPEN' because it was the last packet received.",
        "Discard Notification #100 as Stale: The client tracks the highest observed sequence number (101). Because 100 < 101 in RFC 7641 sequence number arithmetic, the notification represents stale data delayed in transit and must be ignored to prevent false alarms.",
        "Crash the client application.",
        "Re-request the entire alarm history."
      ],
      "answerIdx": 1,
      "debrief": "RFC 7641 mandates sequence number ordering for Observe notifications. Over unordered UDP networks, older notifications can arrive after newer ones. The client uses 24-bit modular arithmetic to compare incoming sequence numbers against the current state; any packet with an older sequence number is discarded as stale."
    },
    "quests": [
      {
        "num": 1,
        "title": "RFC 7641 Observe Architecture & Sequence Mathematics",
        "type": "Concept",
        "description": "Deconstruct Observe registration (value 0), deregistration (value 1), 24-bit sequence number rollover math, client RST cancellation, and CON checkups."
      },
      {
        "num": 2,
        "title": "Out-of-Order Observe Notification Corruption Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated building HVAC log where a thermostat cycled rapidly; diagnose a missing sequence number validation that allowed stale UDP notifications to overwrite current temperatures."
      },
      {
        "num": 3,
        "title": "CoAP Observe Server & Observer Table Engine",
        "type": "Mastery Assignment",
        "description": "Construct a production TypeScript CoAP Observe Server managing dynamic observer registries, periodic CON liveness probes, sequence number generation, and RST deregistration."
      },
      {
        "num": 4,
        "title": "3 AM DTLS Handshake Overhead & Battery Drain Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency battery depletion incident where frequent DTLS session renegotiations over lossy cellular links drained sensor batteries 10x faster than expected."
      }
    ]
  },
  {
    "day": 45,
    "month": 1,
    "blockNum": 9,
    "title": "Milestone 8: Asynchronous CoAP Engine with Block-Wise Transfer & Observe Notification Engine",
    "stageName": "Stage 3: Advanced Protocols & IP Stacks",
    "stageNum": 3,
    "pedagogicalRole": "Milestone 8 Synthesis (Constrained UDP Web Protocol Capstone)",
    "spokenGoal": "Congratulations on completing Block 9. Today you engineer Milestone 8: a comprehensive Asynchronous CoAP Engine with Block-Wise Transfer and Observe Notification Engine in TypeScript. Your engine synthesizes the complete UDP-based constrained web protocol suite: 4-byte binary header parsing, option delta-length packing, Stop-and-Wait ARQ with randomized exponential backoff and NSTART=1 congestion control, RFC 7959 Block1 and Block2 application-layer segmentation for large payloads, and RFC 7641 Observe asynchronous publish/subscribe with 24-bit sequence number freshness filtering and RST cancellation. Your engine will simulate a complete CoAP server exposing RESTful endpoints, streaming live telemetry to observing clients, and servicing multi-kilobyte firmware uploads without IP fragmentation. This milestone cements your mastery of constrained IP protocols before we step into wireless mesh networking.",
    "conceptInvariant": "End-to-End CoAP Protocol Invariant: The CoAP engine must guarantee: (1) NSTART=1 is strictly enforced per destination; (2) Multi-block transfers dynamically chunk payloads with accurate NUM/M/SZX headers; (3) Observe notifications reject stale sequence numbers; and (4) Piggybacked and separate ACK/CON flows maintain zero transaction state leaks.",
    "failureMode": "Failing to clean up transaction state in the CoAP exchange table upon receiving an ACK or timeout; leaked exchange records accumulate in RAM, eventually exhausting heap memory on long-running gateway deployments.",
    "tryItFriction": "Execute the Milestone 8 verification suite: instantiate your CoAP Server exposing `/telemetry` and `/firmware`; register 5 observing clients; stream 20 sensor updates; simulate a 10 KB firmware upload using Block1 (64 bytes/block) with 20% simulated packet loss; verify that dropped blocks are individually recovered and the firmware binary reassembles perfectly; and verify that sending RST cancels the observe subscription.",
    "socraticHints": [
      "What is the difference between a piggybacked response and a separate response in CoAP?",
      "In a piggybacked response, the server includes the 2.05 Content response directly INSIDE the ACK packet matching the request's Message ID (1 round trip)!",
      "If the server needs time to compute the response (e.g., reading a slow sensor), it sends an empty ACK immediately, and later sends a separate CON message containing the response (requiring the client to ACK it)."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 8 CoAP engine receives a GET request for a 5 KB resource with a Block2 option requesting SZX = 6 (1,024 bytes). However, your server's underlying 802.15.4 radio has an MTU of only 128 bytes. How must your server respond to the client's block request?",
      "options": [
        "Return an error code 5.00 Internal Server Error.",
        "Renegotiate Block Size Downward: The server returns Block NUM=0 with SZX = 2 (64 bytes, which fits comfortably inside the 128-byte MTU) and M = 1. The client receives SZX = 2 and automatically adjusts all subsequent block requests to 64 bytes.",
        "Send 1,024 bytes and let the radio crash.",
        "Drop the packet silently."
      ],
      "answerIdx": 1,
      "debrief": "RFC 7959 explicitly allows servers to negotiate block sizes downward. If a client requests a block larger than the server or network can support, the server responds with the largest block size it can accommodate (e.g., 64 bytes). The client detects the smaller SZX in the response and updates its subsequent block queries accordingly."
    },
    "quests": [
      {
        "num": 1,
        "title": "Comprehensive CoAP Full-Stack Architecture",
        "type": "Concept",
        "description": "Construct the complete architecture specification unifying CoAP binary framing, ARQ state machines, Block1/Block2 slicing, and Observe subscription tables."
      },
      {
        "num": 2,
        "title": "Block Size Renegotiation & State Leak Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where a CoAP server leaked exchange state during a renegotiated Block2 transfer; pinpoint missing completion cleanup handlers."
      },
      {
        "num": 3,
        "title": "Milestone 8 Asynchronous CoAP Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 8 Engine featuring binary serialization, ARQ retransmission queues, Block1/Block2 transfer pagination, and RFC 7641 Observe pub/sub."
      },
      {
        "num": 4,
        "title": "Milestone 8 Production Stress & SRE Chaos Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 50,000-transaction stress test against the Milestone 8 engine simulating high packet loss, out-of-order UDP delivery, and simultaneous block-wise downloads, proving zero memory leaks."
      }
    ]
  }
]
