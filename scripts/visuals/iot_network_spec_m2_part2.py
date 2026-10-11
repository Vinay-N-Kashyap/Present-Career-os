# scripts/visuals/iot_network_spec_m2_part2.py
# Month 2, Days 46-60 (Blocks 10-12) for Course 17: IoT Wireless Networks & Protocols (course-iot-network)
# Total Quests: 60 Quests (Days 46-60)

DAYS_46_TO_60 = [
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "6LoWPAN Architecture: IPv6 Header Compression (IPHC), Contexts & Fragmentation (FRAG1/FRAGN)",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Low-Power IPv6 Adaptation (6LoWPAN Framing & Compression Physics)",
    "spokenGoal": "Welcome to Block 10. The dream of the Internet of Things is that every light bulb, sensor, and valve possesses a globally addressable IPv6 address. But there is a massive architectural clash: standard IPv6 headers are 40 bytes long, and UDP headers add 8 bytes. That leaves 48 bytes of overhead! On an IEEE 802.15.4 radio where the total MTU is only 127 bytes, standard IPv6 would consume 40% of the entire packet on headers alone. Enter 6LoWPAN (IPv6 over Low-Power Wireless Personal Area Networks, RFC 4944 and RFC 6282). Today we master 6LoWPAN Header Compression (IPHC). Using clever stateless and stateful context compression, IPHC compresses a 40-byte IPv6 header down to a staggering 2 to 3 bytes by eliding addresses that can be derived from the underlying 802.15.4 MAC addresses! When an IPv6 datagram exceeds the 802.15.4 MTU, 6LoWPAN provides link-layer fragmentation using FRAG1 and FRAGN dispatch headers. Master this foundational bridge between the internet and embedded radios.",
    "conceptInvariant": "6LoWPAN IPHC Elision Invariant: When source and destination IPv6 addresses match the link-local prefix (fe80::/64) or shared stateful context, and their Interface Identifiers (IID) map directly to 802.15.4 MAC extended (64-bit) or short (16-bit) addresses, the addresses are completely elided from the transmitted packet, compressing the 40-byte IPv6 header to as few as 2 bytes.",
    "failureMode": "Transmitting uncompressed 1,280-byte standard IPv6 packets over 6LoWPAN without tuning UDP payload sizes; the packet fragments into 12 separate 802.15.4 radio frames; on an industrial channel with a 5% frame loss rate, the probability of successfully delivering all 12 fragments is (0.95)^12 \u2248 54%, dropping half of all transmissions.",
    "tryItFriction": "Construct a 6LoWPAN IPHC header compressor in TypeScript: take a standard 40-byte IPv6 header with link-local addresses and an 8-byte UDP header; evaluate IPHC bitflags (TF, NH, HLIM, CID, SAC, SAM, DAC, DAM); compress the 48 bytes down to a 7-byte compressed header (2 bytes IPHC dispatch + 1 byte NHC UDP dispatch + 4 bytes compressed UDP ports/checksum); and verify lossless decompression.",
    "socraticHints": [
      "How can 6LoWPAN completely delete the 16-byte IPv6 source address from the packet header?",
      "Because the 802.15.4 MAC frame ALREADY contains the source MAC address (either 64-bit EUI-64 or 16-bit short address)!",
      "By defining that the lower 64 bits of the IPv6 address match the MAC address, the receiving router can reconstruct the complete IPv6 address with zero transmitted address bytes!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart hospital deploys 6LoWPAN pulse oximeters sending telemetry to an on-premise cloud server. Network analysis shows that packets destined for local room displays consume 15 bytes of radio airtime, but packets destined for the external internet server consume 65 bytes of radio airtime. Why does external traffic consume over 4x more radio airtime?",
      "options": [
        "The external internet router slows down the radio speed.",
        "Loss of Stateless Address Compression: For local link-local traffic, both source and destination IPv6 addresses are completely elided from MAC addresses. For external global IPv6 addresses (2001:db8::), the global prefix and host address cannot be derived from local MAC addresses and must be transmitted in-line (consuming 16-32 additional bytes) unless stateful 6LoWPAN Context Compression is configured.",
        "Hospital Wi-Fi interferes with internet packets only.",
        "External packets require a 50-byte billing header."
      ],
      "answerIdx": 1,
      "debrief": "Stateless IPHC compression only works when addresses can be derived from link-local prefixes or MAC addresses. When routing to external internet destinations, the full 128-bit global address must be carried inside the packet unless 6LoWPAN stateful Context Compression (6CIO options in Router Advertisements) is deployed to map prefixes to 4-bit context IDs."
    },
    "quests": [
      {
        "num": 1,
        "title": "6LoWPAN Framing & RFC 6282 IPHC Compression Math",
        "type": "Concept",
        "description": "Deconstruct IPHC dispatch bytes, Next Header Compression (NHC) for UDP, SAM/DAM address modes, and FRAG1/FRAGN datagram offsets."
      },
      {
        "num": 2,
        "title": "Fragment Loss Rate & 6LoWPAN Collapse Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test trace of a smart streetlight mesh where sending 300-byte CoAP packets caused a 60% packet drop rate; demonstrate the exponential decay of multi-fragment delivery."
      },
      {
        "num": 3,
        "title": "6LoWPAN IPHC & NHC Compression Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine that compresses full IPv6/UDP headers into 6LoWPAN format and reassembles fragmented FRAG1/FRAGN datagrams with timeout buffers."
      },
      {
        "num": 4,
        "title": "3 AM Fragment Reassembly Queue Exhaustion Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an outage in an industrial sensor mesh where incomplete fragment arrivals exhausted router reassembly buffers, causing cascading drops across the entire building."
      }
    ]
  },
  {
    "day": 47,
    "month": 1,
    "blockNum": 10,
    "title": "RPL Routing Protocol (RFC 6550): DODAGs, Objective Functions (MRHOF/ETX) & Trickle Timers",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Low-Power Mesh Routing (DODAG Formation & Trickle Physics)",
    "spokenGoal": "How do hundreds of low-power wireless nodes automatically discover routing paths to an internet gateway without running memory-heavy protocols like OSPF or BGP? Enter the Routing Protocol for Low-Power and Lossy Networks (RPL, RFC 6550). RPL organizes the mesh into a Destination-Oriented Directed Acyclic Graph (DODAG) rooted at the Border Router (the DODAG Root). Each node computes its Rank, a metric reflecting its relative distance from the root. Master Rank Monotonicity: a node's rank must strictly increase down the tree, preventing routing loops! Deconstruct Objective Functions: Objective Function Zero (OF0 - hop count) and the Minimum Rank with Hysteresis Objective Function (MRHOF) using Expected Transmission Count (ETX). ETX measures link quality: if a link drops 50% of frames, its ETX is 2.0 (taking 2 attempts to deliver 1 packet). Finally, master Trickle Timers (RFC 6206): when the network topology is stable, Trickle exponentially slows routing beacon broadcasts to hours (saving battery); when a link breaks, Trickle resets its timer instantly to milliseconds to re-heal the mesh in seconds!",
    "conceptInvariant": "RPL Rank Monotonicity & Loop Freedom Invariant: Along any valid path towards the DODAG root, node Rank must decrease strictly monotonically: Rank(Parent) < Rank(Child), guaranteeing that packets forwarded towards preferred parents never enter circular routing loops.",
    "failureMode": "Setting static hop-count metrics instead of ETX link-quality metrics; nodes route traffic through a direct 1-hop link that suffers 90% packet loss rather than routing through a pristine 2-hop neighbor, resulting in massive retransmissions and battery drain.",
    "tryItFriction": "Implement an RPL DODAG formation and Trickle Timer in TypeScript: simulate a 10-node mesh; implement DIO (DODAG Information Object) generation; calculate Rank using MRHOF with simulated link ETX; implement Trickle timer doubling (I_min = 100 ms, I_max = 16 doublings); inject a simulated link break; and verify that Trickle resets to I_min to re-heal the topology.",
    "socraticHints": [
      "What is the core purpose of a Trickle Timer in wireless sensor networks?",
      "To solve the fundamental trade-off between battery life and fast recovery! In a stable network, broadcasting routing beacons every few seconds drains batteries for nothing.",
      "Trickle suppresses beacons when neighbors agree on state (exponentially doubling the interval up to hours), but resets to milliseconds the moment an inconsistency or broken link is detected!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart metering mesh has 500 nodes running RPL. Node A has Parent B with Rank 256. Suddenly, Node B dies. Node A searches for a new parent. Node C (a downstream child of Node A with Rank 512) broadcasts a DIO. If Node A naively selects Node C as its new parent, what catastrophic failure occurs?",
      "options": [
        "The meter's clock resets to 1970.",
        "Routing Loop Formation: Node A (which was Node C's ancestor) selects Node C as its parent, creating a closed circular routing loop (A \u2192 C \u2192 A). Packets circulate endlessly until their IPv6 Hop Limit expires. RPL's Loop Detection and Rank Monotonicity rules prevent this by forbidding a node from choosing a parent whose advertised rank is higher than its own.",
        "Node C promotes itself to the DODAG root.",
        "Wi-Fi frequency hops to 5 GHz."
      ],
      "answerIdx": 1,
      "debrief": "RPL strictly forbids rank inversion. If a node loses its parent, it cannot select a neighbor with a higher rank without initiating a poison-and-rebuild sequence. Choosing a node with higher rank invites circular routing loops where packets bounce back and forth until TTL expiry."
    },
    "quests": [
      {
        "num": 1,
        "title": "RPL Architecture & Objective Function Formulations",
        "type": "Concept",
        "description": "Deconstruct DODAG formation, DIO/DAO/DIS control messages, Rank calculations, OF0 vs MRHOF, and ETX link cost formulations."
      },
      {
        "num": 2,
        "title": "RPL Routing Loop & Rank Inversion Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log of a 50-node sensor network where packet delivery collapsed to zero; pinpoint a rogue node advertising invalid Rank that induced circular routing loops."
      },
      {
        "num": 3,
        "title": "RPL DODAG Formation & Trickle Timer Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript simulation of RPL DODAG formation, implementing MRHOF ETX parent selection, DAO upward routing tables, and RFC 6206 Trickle timers."
      },
      {
        "num": 4,
        "title": "3 AM Mesh Partition & Parent Thrashing Crisis Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity outage in a smart campus lighting mesh where parent switching hysteresis was misconfigured, causing hundreds of nodes to oscillate parents continuously."
      }
    ]
  },
  {
    "day": 48,
    "month": 1,
    "blockNum": 10,
    "title": "Thread Network Architecture: Device Roles (Leader, Router, REED, SED) & MLE Protocol",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Low-Power IP Mesh Networks (Thread Stack & Role Dynamics)",
    "spokenGoal": "While Zigbee struggled for years with proprietary bridges and single points of failure, the smart home and building industry united around a modern standard: Thread. Engineered by Apple, Google, and the Thread Group, Thread is an IPv6-based, self-healing, low-power mesh networking technology built directly on IEEE 802.15.4. Master Thread's device role hierarchy: Thread Leader (the node managing network configuration and router ID assignment; if the leader dies, another router autonomously elects itself leader with zero downtime!), Thread Routers (mains-powered nodes that forward packets across the mesh), Router Eligible End Devices (REEDs - end devices that can automatically promote themselves to Routers if the mesh needs more routing capacity), Full End Devices (FEDs), and Sleepy End Devices (SEDs - battery nodes whose radios sleep 99.9% of the time, communicating only through their parent router). Deconstruct Mesh Link Establishment (MLE): the protocol that secures link-layer pairing, establishes neighbor tables, and exchanges routing costs using AES-128-CCM* cryptography.",
    "conceptInvariant": "Thread Autonomous Leader Election Invariant: The Thread mesh must maintain exactly one active Leader; if the active Leader fails to broadcast Link Synchronization messages within LEADER_TIMEOUT, the remaining Routers execute an autonomous distributed election via MLE to promote a new Leader within 120 seconds with zero mesh partition.",
    "failureMode": "Deploying a 50-node Thread mesh where all devices are battery-powered Sleepy End Devices (SEDs) with zero mains-powered Routers; SEDs cannot forward packets for each other, leaving nodes beyond single-hop radio range of the border router completely disconnected.",
    "tryItFriction": "Construct a Thread Role Transition state machine in TypeScript: model a device starting as an unattached Child; execute MLE Child Attach with a parent Router; simulate mesh partition where router count drops below ROUTER_UPGRADE_THRESHOLD; promote the device from REED to active Router; and verify Router ID allocation and neighbor table synchronization.",
    "socraticHints": [
      "Why is Thread fundamentally more reliable than Zigbee Pro in smart building deployments?",
      "Because Zigbee relied on a single centralized Zigbee Coordinator; if the coordinator died, the whole network froze or required manual re-pairing!",
      "Thread has no single point of failure: any Router can become the Leader, and Border Routers provide multi-homed, standard IPv6 connectivity to the cloud."
    ],
    "situationalPuzzle": {
      "scenario": "A smart office deploys 100 Thread smart radiator valves (battery-powered SEDs) and 10 Thread smart power plugs (mains-powered Routers). A night cleaner unplugs the power plug functioning as the Thread Leader. What happens to the mesh network?",
      "options": [
        "The entire network collapses and all 100 valves disconnect.",
        "Autonomous Leader Re-Election: Within seconds of detecting missing leader heartbeats, the remaining 9 power plug Routers execute an MLE election protocol. One router automatically promotes itself to Leader, maintains all active routing tables, and the 100 valves continue communicating without noticing the outage.",
        "The valves switch to Bluetooth Classic.",
        "The battery valves run out of power immediately."
      ],
      "answerIdx": 1,
      "debrief": "Thread's distributed leader architecture eliminates single points of failure. The Leader is simply a regular Router that took on administrative duties. If it disappears, the remaining Routers immediately detect the loss via MLE timeout, vote to elect a new Leader, and take over partition management seamlessly without dropping end devices."
    },
    "quests": [
      {
        "num": 1,
        "title": "Thread Network Stack & Role State Transitions",
        "type": "Concept",
        "description": "Analyze Thread device roles (Leader, Router, REED, FED, MED, SED), MLE handshake sequences, partition IDs, and autonomous promotion thresholds."
      },
      {
        "num": 2,
        "title": "Thread Parent Selection & Orphaned Child Detective",
        "type": "Detective Challenge",
        "description": "Analyze an OpenThread sniffer capture where a Sleepy End Device lost its parent router; trace the MLE Parent Request and Child Update recovery flow."
      },
      {
        "num": 3,
        "title": "Thread Mesh Link Establishment (MLE) Protocol Engine",
        "type": "Mastery Assignment",
        "description": "Implement a TypeScript MLE state machine handling Link Synchronization, Parent Requests/Responses, Child Attach, and dynamic REED-to-Router role promotion."
      },
      {
        "num": 4,
        "title": "3 AM Split-Brain Thread Mesh Partition Recovery Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an incident where a warehouse metal fire door closed, splitting a 200-node Thread mesh into two isolated partitions; trace partition merging and leader convergence upon reopening."
      }
    ]
  },
  {
    "day": 49,
    "month": 1,
    "blockNum": 10,
    "title": "Thread Commissioning, Border Routers (OTBR), NAT64 Translation & Matter Protocol Integration",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Edge Border Routing & Ecosystem Interoperability (OTBR & Matter)",
    "spokenGoal": "How does an IPv6 packet from an iPhone on Wi-Fi reach a Thread lightbulb on an 802.15.4 mesh, and how does the smart home standard Matter unify this entire experience? Today we master Thread Border Routers (OTBR) and Matter Integration. An OpenThread Border Router (OTBR - running on devices like Apple HomePod, Google Nest Hub, or Raspberry Pi) bridges an IEEE 802.15.4 radio interface to standard Wi-Fi or Ethernet. The border router performs bidirectional IPv6 packet forwarding, advertises IPv6 global prefixes via ICMPv6 Router Advertisements, and runs NAT64/DNS64 to allow IPv6 Thread devices to communicate with legacy IPv4 cloud services. Deconstruct Thread Commissioning: how an uncommissioned node securely joins the mesh using Ephemeral Diffie-Hellman Over COSE (EDHOC) or DTLS with JPAKE (Password Authenticated Key Exchange), exchanging network master keys without exposing credentials in plaintext. Finally, examine the Matter Protocol (Connectivity Standards Alliance): Matter sits at the application layer over IPv6, providing a unified smart device model across Thread, Wi-Fi, and Ethernet!",
    "conceptInvariant": "Thread Border Router Forwarding Invariant: The OpenThread Border Router (OTBR) acts as a standard IPv6 router without application-layer translation; it routes raw IPv6 datagrams between external Wi-Fi/Ethernet subnets and the internal 6LoWPAN 802.15.4 mesh, ensuring end-to-end IP addressability for Matter controllers.",
    "failureMode": "Designing a smart home system where the border router operates as an application-level proxy (like an old Zigbee gateway); mobile apps must connect to proprietary gateway APIs rather than communicating directly with Matter devices over native IPv6, breaking multi-admin ecosystem sharing.",
    "tryItFriction": "Construct a NAT64 / DNS64 address translator and Matter commissioning flow in TypeScript: translate an IPv4 address (e.g., 93.184.216.34) into a synthetic IPv6 address using the Well-Known Prefix (64:ff9b::93.184.216.34); simulate a DTLS-JPAKE commissioning handshake; extract Thread network dataset credentials; and verify that an iPhone can ping the simulated Thread node over IPv6.",
    "socraticHints": [
      "Why did the smart home industry choose Thread and Wi-Fi for the Matter standard rather than Zigbee or Z-Wave?",
      "Because Thread and Wi-Fi are native IP technologies! They both carry standard IPv6 packets.",
      "With Matter running over IPv6, an Apple device, a Google speaker, and an Amazon Alexa can all send packets to the exact same smart bulb simultaneously without any proprietary translation bridges!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart home owner purchases a Matter-over-Thread door lock. The owner uses an Apple TV as their Thread Border Router and an Android phone to control the lock. How can an Android phone on the home Wi-Fi communicate directly with a Thread lock that only has an 802.15.4 radio?",
      "options": [
        "The lock must also contain a Wi-Fi chip.",
        "Seamless Native IPv6 Routing: The Apple TV border router advertises the Thread mesh's IPv6 prefix onto the home Wi-Fi network. When the Android phone sends a Matter IPv6 UDP packet to the lock's IPv6 address, the Wi-Fi router routes the packet to the Apple TV, which forwards it into the 802.15.4 Thread mesh directly to the lock.",
        "Apple and Android require a cloud translation server.",
        "The lock communicates via ultrasonic sound."
      ],
      "answerIdx": 1,
      "debrief": "This is the architectural breakthrough of Thread and Matter. The Thread Border Router is an open, standard IPv6 router, not a proprietary Apple bridge. It routes standard IPv6 packets between Wi-Fi and Thread. Any device on the local network (Apple, Google, Linux) can route IPv6 traffic directly to any Thread device with zero cloud dependency."
    },
    "quests": [
      {
        "num": 1,
        "title": "OpenThread Border Router Architecture & Matter Protocols",
        "type": "Concept",
        "description": "Analyze OTBR routing topology, ICMPv6 prefix advertisement, NAT64/DNS64 address mapping, and the Matter protocol application stack."
      },
      {
        "num": 2,
        "title": "Thread Commissioning & JPAKE Security Detective",
        "type": "Detective Challenge",
        "description": "Analyze a Wireshark capture of a failed Thread commissioning session; identify a DTLS-JPAKE passphrase mismatch that blocked network dataset provisioning."
      },
      {
        "num": 3,
        "title": "OTBR IPv6 Forwarding & NAT64 Translation Engine",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript simulation of an OpenThread Border Router implementing bidirectional IPv6 packet forwarding, 64:ff9b:: NAT64 synthesis, and Thread dataset management."
      },
      {
        "num": 4,
        "title": "3 AM Multi-Admin Matter Ecosystem Desynchronization Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity smart building incident where dual border routers (Google and Apple) advertised conflicting ULA IPv6 prefixes, partitioning Thread mesh routes."
      }
    ]
  },
  {
    "day": 50,
    "month": 1,
    "blockNum": 10,
    "title": "Milestone 9: 6LoWPAN Packet Compressor, RPL DODAG Routing & Thread Mesh Simulator Engine",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Milestone 9 Synthesis (Low-Power Wireless Mesh Capstone)",
    "spokenGoal": "Congratulations on reaching Milestone 9. Today you synthesize everything learned across Block 10 to engineer a 6LoWPAN Packet Compressor, RPL DODAG Routing, and Thread Mesh Simulator Engine in TypeScript. Your engine brings together the full low-power wireless mesh architecture: RFC 6282 IPHC IPv6/UDP header compression down to 2-7 bytes, FRAG1/FRAGN fragmentation and reassembly, dynamic RPL DODAG formation with MRHOF ETX rank calculations and RFC 6206 Trickle timers, and a multi-device Thread mesh state machine featuring autonomous Leader election, Router promotion, and Sleepy End Device parent-child links. Your engine will simulate a 30-node wireless mesh network, routing compressed IPv6 packets from battery nodes across multi-hop router paths to a simulated border router, recovering dynamically from router failures, and demonstrating zero-loss mesh resilience. This milestone completes your mesh networking mastery before we expand into cellular LPWAN systems.",
    "conceptInvariant": "End-to-End Low-Power Mesh Invariant: The mesh engine must guarantee: (1) All IPv6/UDP headers are compressed to \u2264 7 bytes over 802.15.4 links; (2) Multi-hop routing maintains strict rank monotonicity without loops; and (3) Physical router failure triggers autonomous rerouting and Trickle timer reset within 5.0 seconds.",
    "failureMode": "Deploying a mesh routing simulator that recalculates all network routes centrally upon every link failure; real-world distributed mesh networks must re-route locally via neighbor table updates; centralized recalculation collapses under scale.",
    "tryItFriction": "Execute the Milestone 9 verification suite: simulate a 30-node Thread mesh with 1 Leader, 5 Routers, and 24 Sleepy End Devices; inject compressed 6LoWPAN CoAP packets from a remote child node; trace multi-hop forwarding through 3 intermediate routers to the border router; kill Router #2 mid-flight; verify autonomous parent re-attachment and route convergence within 3 seconds.",
    "socraticHints": [
      "How do Sleepy End Devices maintain communication with the mesh without draining their batteries listening for router packets?",
      "By relying on Parent Polling! The sleepy child node turns its radio off 99.9% of the time.",
      "The parent router acts as a proxy, buffering all inbound packets destined for the child in a message queue. When the child wakes up, it transmits an MLE Data Poll request to retrieve buffered packets."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 9 mesh simulator executes a stress test with 30 nodes. Router #3's queue fills to 100% capacity due to high child traffic. Router #3 begins dropping packets. Instead of dropping random packets, what priority queuing discipline must your mesh router enforce to prevent complete network breakdown?",
      "options": [
        "Drop routing control packets (MLE and DIO) first to preserve user sensor data.",
        "Preserve Routing Control Packets, Shed Best-Effort Telemetry: The router must prioritize network control packets (RPL DIO/DAO and Thread MLE) above all regular telemetry. Dropping routing packets causes the mesh to lose neighbor synchronization and partition, amplifying the failure across the entire building.",
        "Drop all packets and restart the microcontroller.",
        "Invert all IPv6 destination addresses."
      ],
      "answerIdx": 1,
      "debrief": "In wireless mesh networks, control plane traffic is vastly more critical than data plane traffic. If a router drops routing control messages (MLE heartbeats, RPL DIOs) during congestion, neighbors assume the link is dead and trigger massive network-wide re-routing storms. Control packets must have dedicated high-priority queue reservations."
    },
    "quests": [
      {
        "num": 1,
        "title": "Comprehensive Low-Power Wireless Mesh Architecture",
        "type": "Concept",
        "description": "Construct the master architectural specification integrating 6LoWPAN compression, RPL DODAG loop freedom, Thread device roles, and MLE neighbor state tables."
      },
      {
        "num": 2,
        "title": "Multi-Hop Routing Congestion & Drop Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where a 4-hop sensor packet vanished; trace the exact hop where buffer saturation and queue priority inversion dropped the frame."
      },
      {
        "num": 3,
        "title": "Milestone 9 Wireless Mesh Simulation Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 9 Engine featuring 6LoWPAN IPHC compression, RPL MRHOF routing, Thread Leader election, and parent-child polling queues."
      },
      {
        "num": 4,
        "title": "Milestone 9 Production Mesh Chaos & Scalability Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 100-node simulated mesh stress test injecting 50% link packet loss and sudden router kills, proving autonomous route recovery within 5 seconds and zero memory leaks."
      }
    ]
  },
  {
    "day": 51,
    "month": 1,
    "blockNum": 11,
    "title": "Cellular LPWAN Standards: 3GPP NB-IoT (Cat-NB1/NB2) vs LTE-M (Cat-M1) & Coverage Extension (+20dB)",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Long-Range Cellular Architecture (NB-IoT vs LTE-M Physics)",
    "spokenGoal": "Welcome to Block 11. When IoT devices are deployed in rural fields, across moving shipping containers, or deep inside underground basements where no Wi-Fi or gateway exists, how do they communicate? Enter Cellular LPWAN: 3GPP NB-IoT (Narrowband IoT, Cat-NB1/NB2) and LTE-M (Long Term Evolution for Machines, Cat-M1). Master the profound architectural differences between them: Bandwidth: NB-IoT occupies a tiny 200 kHz carrier (a single LTE resource block!), while LTE-M uses a 1.4 MHz channel (6 resource blocks). Throughput: NB-IoT delivers ~26 to 127 kbps, while LTE-M pushes up to 1 Mbps and supports Voice over LTE (VoLTE). Mobility: NB-IoT has no connected-mode cell handover (it must drop and reconnect), while LTE-M provides seamless cell towers handovers at highway speeds. Most critically, master Coverage Extension (+20 dB): through massive sub-carrier repetition (up to 128x retransmissions) and power spectral density concentration, NB-IoT achieves a Maximum Coupling Loss (MCL) of 164 dB (vs 144 dB for standard LTE), penetrating through two concrete basement walls and steel covers!",
    "conceptInvariant": "Coverage Extension Repetition Invariant: NB-IoT achieves +20 dB coverage enhancement over standard LTE by concentrating transmit power into narrow 3.75/15 kHz sub-carriers (high PSD) and executing up to 128 physical-layer blind repetitions, extending Maximum Coupling Loss to MCL \u2264 164 dB for deep underground penetration.",
    "failureMode": "Deploying an asset tracker on a high-speed inter-city train using NB-IoT; because NB-IoT lacks connected cell handover, the tracker drops its cellular link every 60 seconds as the train speeds between base stations, draining its battery attempting continuous re-attachments.",
    "tryItFriction": "Construct a Cellular LPWAN trade-off matrix and link margin model in TypeScript: compare NB-IoT Cat-NB1, Cat-NB2, and LTE-M Cat-M1 across bandwidth, peak upload/download bitrate, latency, handover capability, and Maximum Coupling Loss (MCL); calculate link budget penetration through 20 cm reinforced concrete (+18 dB attenuation) and verify why standard LTE fails while NB-IoT succeeds.",
    "socraticHints": [
      "Why does NB-IoT penetrate basements and underground manholes vastly better than standard smartphone LTE?",
      "Power Spectral Density (PSD) and Repetition! A smartphone spreads its +23 dBm transmit power across 10 or 20 MHz of bandwidth.",
      "An NB-IoT modem concentrates that exact same +23 dBm into a single narrow 15 kHz or 3.75 kHz sub-carrier, producing a 100x higher energy density per Hertz, and repeats the symbol up to 128 times!"
    ],
    "situationalPuzzle": {
      "scenario": "A logistics corporation builds a refrigerated container tracker that monitors temperature across cross-country highways and reports cargo tampering in real-time. The engineering team evaluates NB-IoT vs LTE-M. Which cellular technology must be selected?",
      "options": [
        "NB-IoT, because it is cheaper.",
        "LTE-M (Cat-M1): High-speed highway mobility requires connected-mode cell handover. Furthermore, potential future requirements (voice alarms, firmware OTA updates, and international roaming across diverse carrier bands) make LTE-M the only viable choice for mobile assets.",
        "Neither, cellular cannot be used in shipping containers.",
        "2G GPRS, because it is completely future-proof."
      ],
      "answerIdx": 1,
      "debrief": "NB-IoT is optimized for stationary, delay-tolerant utility meters (water, gas, electricity). It does not support connected-mode handover between cell towers. An asset traveling at 100 km/h on a highway will drop connection at every tower boundary. LTE-M supports seamless cellular handover, lower latency, higher throughput for OTA updates, and robust mobility."
    },
    "quests": [
      {
        "num": 1,
        "title": "Cellular LPWAN 3GPP Architecture & PHY Layer Formats",
        "type": "Concept",
        "description": "Deconstruct Cat-NB1/NB2 vs Cat-M1 specifications, resource blocks, sub-carrier spacing (3.75/15 kHz), single-tone vs multi-tone uplinks, and MCL 164 dB physics."
      },
      {
        "num": 2,
        "title": "NB-IoT Mobility Disconnect & Doppler Shift Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated drive-test log of an NB-IoT fleet tracker; demonstrate why traveling at 80 km/h caused continuous radio link failures due to lack of connected handover."
      },
      {
        "num": 3,
        "title": "Cellular LPWAN Technology Selection & Link Budget Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript selection engine that evaluates mobility, throughput, underground penetration depth, and battery life to recommend NB-IoT vs LTE-M profiles."
      },
      {
        "num": 4,
        "title": "3 AM Underground Smart Meter ECL 2 Battery Drain Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a battery drain crisis in an underground gas meter fleet where poor radio conditions forced modems into Enhanced Coverage Level 2 (128x repetitions), multiplying energy per bit by 50x."
      }
    ]
  },
  {
    "day": 52,
    "month": 1,
    "blockNum": 11,
    "title": "Cellular Ultra-Low Power Modes: Power Saving Mode (PSM), T3324/T3412 Timers & eDRX",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Cellular Energy Architecture (PSM & eDRX Timer Mathematics)",
    "spokenGoal": "How can a cellular modem run on a pair of AA batteries for 10 years when your smartphone dies in a single day? Today we master Cellular Ultra-Low Power Modes: Power Saving Mode (PSM) and extended Discontinuous Reception (eDRX). In standard cellular, a phone constantly listens for incoming calls, consuming tens of milliamps. In PSM (3GPP Release 12), the modem negotiates two critical timers with the cellular network: the Active Timer (T3324) and the Periodic TAU Timer (T3412). After transmitting telemetry, the modem stays reachable in Connected/Idle mode for the duration of T3324 (e.g., 10 seconds). Once T3324 expires, the modem enters PSM Deep Sleep: the radio shuts down completely, drawing less than 3 microamps! Crucially, the cellular base station does NOT deregister the device. The device remains registered on the core network for the duration of T3412 (up to 410 days!). When the device wakes up to send data, it transmits immediately with zero network attachment overhead!",
    "conceptInvariant": "PSM Network Registration Invariant: In Power Saving Mode, the cellular modem powers down its radio into a <3 \u03bcA sleep state for up to T3412 (up to 410 days) without detaching from the LTE Evolved Packet Core (EPC), enabling instant radio wakeup without re-executing the energy-heavy 3GPP Attach Procedure.",
    "failureMode": "Configuring firmware to issue AT+CFUN=0 (power off modem) or cutting power to the cellular module with a MOSFET after every transmission; upon reboot, the modem must perform a full cold cell search, PLMN scan, and 3GPP Attach handshake (drawing 150 mA for 15-30 seconds), draining the battery 100x faster than native PSM.",
    "tryItFriction": "Implement a 3GPP T3324 and T3412 binary GPRS Timer 3 encoder and decoder in TypeScript: decode the 8-bit timer format (3 bits unit multiplier + 5 bits value); calculate exact active and sleep durations for T3324 = 00100101 (2 seconds * 5 = 10s) and T3412 = 01001100 (1 hour * 12 = 12 hours); model battery drain comparing PSM vs Cold Reboot over a 5-year deployment.",
    "socraticHints": [
      "Why does power-cycling a cellular modem with a hardware MOSFET destroy battery life compared to entering PSM?",
      "Because cutting power forces a cold boot! The modem forgets cell frequencies, timing offsets, and encryption keys.",
      "Re-attaching to a cell tower requires 15 to 45 seconds of continuous scanning and handshakes, consuming ~1 mAh per report! PSM preserves registration, waking and transmitting in under 2 seconds (0.02 mAh)!"
    ],
    "situationalPuzzle": {
      "scenario": "A remote weather station reports wind speed once every 4 hours over LTE-M. The hardware team added a load switch to cut power to the modem between transmissions. The 5,000 mAh battery died after only 4 months. Firmware analysis shows each transmission takes 28 seconds of high-power radio activity. What architectural redesign delivers the required 5-year battery life?",
      "options": [
        "Leave the modem continuously connected in normal LTE mode.",
        "Remove the hardware power cut and enable 3GPP Power Saving Mode (PSM): configure T3324 = 5 seconds (active time for downlinks) and T3412 = 4 hours (periodic TAU). The modem sleeps in PSM drawing <3 \u03bcA, wakes instantly without re-attaching, completes transmission in 1.8 seconds, and achieves >5 years on the same battery.",
        "Switch from LTE-M to 5G mmWave.",
        "Transmit wind speed every 24 hours instead."
      ],
      "answerIdx": 1,
      "debrief": "Hard power-cycling cellular modems is one of the most widespread engineering blunders in IoT. A cold attach consumes massive radio energy scanning frequencies. In contrast, 3GPP PSM keeps registration alive in the core network while the modem hardware draws under 3 \u03bcA. Transmission takes under 2 seconds, reducing energy consumption by over 90%."
    },
    "quests": [
      {
        "num": 1,
        "title": "PSM & eDRX 3GPP Protocol Architecture",
        "type": "Concept",
        "description": "Deconstruct GPRS Timer 2 and 3 encodings (T3324, T3412, T3314), Paging Time Windows (PTW), eDRX cycle math, and EMM registration states."
      },
      {
        "num": 2,
        "title": "Cold Reboot Battery Depletion Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated power profiling trace of an asset tracker; calculate the massive energy penalty of cold network attachments vs PSM warm wakeups."
      },
      {
        "num": 3,
        "title": "3GPP PSM & eDRX Timer Encoder and Energy Simulator",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript engine that encodes/decodes 3GPP timer bitfields, simulates network TAU handshakes, and calculates precise microamp-hour consumption profiles."
      },
      {
        "num": 4,
        "title": "3 AM Carrier Network TAU Desynchronization Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an outage where a cellular telecom provider altered base station maximum T3412 timers, silently detaching 5,000 field sensors whose sleep timers exceeded network caps."
      }
    ]
  },
  {
    "day": 53,
    "month": 1,
    "blockNum": 11,
    "title": "Cellular Modem Interfacing: Hayes AT Commands, Hardware Flow Control & CMUX Multiplexing",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Embedded Modem Driver Architecture (AT Command Pipelines & CMUX)",
    "spokenGoal": "How does an embedded microcontroller actually command a physical cellular module over a serial UART bus? Today we master Cellular Modem Interfacing. For over 40 years, cellular modems have been controlled via Hayes AT Commands. But building a production-grade AT parser is notoriously difficult. Why? Because modems operate asynchronously! In addition to synchronous command responses ('OK' or 'ERROR'), the modem pushes Unsolicited Result Codes (URC, such as `+CSQ: 14,99` for signal strength, `+CEREG: 1` for network registration, or `+QIURC: \"recv\"` for incoming data) at ANY unpredictable millisecond, right in the middle of your active command sequence! Master Hardware Flow Control: RTS (Ready To Send) and CTS (Clear To Send) line physics are mandatory to prevent UART buffer overruns during high-speed TCP socket streaming. Finally, explore 3GPP TS 27.010 Multiplexing (CMUX): a protocol that slices a single physical serial port into multiple virtual channels, allowing simultaneous AT control and high-speed PPP/IP data transfer!",
    "conceptInvariant": "Asynchronous AT Pipeline & URC Isolation Invariant: An embedded AT command parser must decouple synchronous command-response processing from asynchronous Unsolicited Result Code (URC) dispatch; an incoming URC arriving between command issuance and terminal 'OK'/'ERROR' response must be routed to its respective event handler without corrupting active command buffers.",
    "failureMode": "Writing a blocking AT command driver that assumes the next bytes received over UART after 'AT+QIACT=1' must be 'OK'; an intervening network registration URC (`+CEREG: 5`) arrives first, causing the string comparison to fail and triggering an unnecessary modem hard reset.",
    "tryItFriction": "Implement an asynchronous AT Command Parser and Pipeline Engine in TypeScript: handle command queuing with response timeouts; filter and dispatch asynchronous URCs; implement hardware RTS/CTS flow control throttling; and verify that sending a socket query while receiving an incoming SMS URC executes cleanly without string buffer corruption.",
    "socraticHints": [
      "Why must UART Hardware Flow Control (RTS/CTS) be enabled when interfacing with cellular modems at 115200 or 921600 baud?",
      "Because when the modem downloads a 1,500-byte IP packet over LTE, it flushes data over UART at full serial line rate!",
      "If the microcontroller is briefly busy handling an interrupt or writing to flash, its internal UART FIFO (often only 16 to 64 bytes) will overflow, corrupting packet payloads!"
    ],
    "situationalPuzzle": {
      "scenario": "An embedded C engineer writes a cellular driver that sends 'AT+QHTTPREAD' to download a 20 KB firmware binary. The MCU UART baud rate is 921,600 bps. Hardware flow control (RTS/CTS) is disabled to save two GPIO pins. During download, the binary fails its SHA-256 integrity check every single time. Oscilloscope traces show clean RF signals. What caused the data corruption?",
      "options": [
        "The HTTP server is infected with malware.",
        "UART Receiver Buffer Overrun: At 921,600 baud, bytes arrive every 10.8 \u03bcs. While the MCU was executing flash page erase operations (taking 20-50 ms), its UART hardware FIFO overflowed, dropping bytes silently without flow control. Enabling hardware CTS/RTS allows the MCU to assert RTS high to pause modem transmission during flash writes.",
        "The cellular antenna melted.",
        "AT commands only support text, not binary."
      ],
      "answerIdx": 1,
      "debrief": "High-speed serial communication without hardware flow control is a recipe for data corruption in embedded systems. Whenever the CPU is stalled servicing interrupts, garbage collection, or slow flash memory operations, the incoming byte stream overflows the hardware UART FIFO. RTS/CTS lines are mandatory for reliable high-speed data transfer."
    },
    "quests": [
      {
        "num": 1,
        "title": "Hayes AT Command Protocol Architecture & URC Mechanics",
        "type": "Concept",
        "description": "Deconstruct V.250 AT syntax, 3GPP TS 27.007 standards, synchronous responses vs asynchronous URCs, and TS 27.010 CMUX framing."
      },
      {
        "num": 2,
        "title": "Interleaved URC Parser Crash Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded driver trace where an unexpected incoming ring URC (`RING`) corrupted an in-flight socket connect command buffer, causing infinite retry loops."
      },
      {
        "num": 3,
        "title": "Asynchronous AT Command Pipeline & Driver Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript AT command engine featuring thread-safe command queuing, regex-based URC routing, timeout watchdogs, and RTS/CTS flow control emulation."
      },
      {
        "num": 4,
        "title": "3 AM Modem Lockup & AT Command Pipeline Deadlock Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency vehicle fleet outage where cellular modems entered unresponsive AT state; design an autonomous escalation watchdog (soft AT \u2192 DTR toggle \u2192 RESET pin \u2192 power cycle)."
      }
    ]
  },
  {
    "day": 54,
    "month": 1,
    "blockNum": 11,
    "title": "Direct-to-Cell Satellite IoT (NTN - Non-Terrestrial Networks): LEO Constellations & Doppler Shifts",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Space-Based Telemetry (3GPP NTN & LEO Satellite Dynamics)",
    "spokenGoal": "What happens when your IoT asset is stationed in the middle of the Pacific Ocean, deep in the Sahara Desert, or over polar ice caps where no terrestrial cellular tower exists? Today we master the frontier of wireless engineering: Direct-to-Cell Satellite IoT (Non-Terrestrial Networks - NTN). In 3GPP Release 17 and Release 18, the cellular standard was expanded to communicate directly from standard modified NB-IoT/LTE-M chipsets to Low Earth Orbit (LEO) satellite constellations (such as Starlink, AST SpaceMobile, and Omnispace) orbiting 500 to 600 kilometers above the Earth! Master the extreme physics of space telemetry: Free Space Path Loss exceeds 160 dB! Round-Trip Delay (RTD) reaches 20 to 40 milliseconds (requiring relaxed 3GPP HARQ timers). Most critically, master massive Doppler Shifts: LEO satellites orbit at ~7.5 kilometers per second, causing carrier frequencies at 2 GHz to shift by up to \u00b145 kHz! Modems must use orbital Ephemeris data and GNSS coordinates to pre-compensate their transmit frequency and timing advance before sending a single RF chirp into orbit!",
    "conceptInvariant": "LEO Satellite Doppler & Timing Pre-Compensation Invariant: Due to satellite orbital velocity v \u2248 7.5 km/s, an NTN user terminal must calculate satellite line-of-sight velocity v_los from GNSS position and satellite Ephemeris data, applying Carrier Frequency Pre-Compensation \u0394f = -f_0 * (v_los / c) and Timing Advance \u0394t = 2 * d / c prior to transmission.",
    "failureMode": "Transmitting to an overhead LEO satellite without Doppler pre-compensation; the \u00b135 kHz frequency offset shifts the uplink signal completely outside the satellite's narrow NB-IoT sub-carrier filter (15 kHz), resulting in 100% packet loss.",
    "tryItFriction": "Construct a Satellite NTN Doppler and Path Loss simulator in TypeScript: calculate Free Space Path Loss for an S-band (2.0 GHz) link over distances from 550 km (zenith) to 1,500 km (10\u00b0 elevation angle); compute relative velocity v_los for an overhead satellite pass; calculate required frequency pre-compensation in kHz; and verify link margin closure with a +23 dBm transmitter.",
    "socraticHints": [
      "Why must an IoT satellite modem have an integrated GNSS (GPS) receiver to connect to an NTN satellite?",
      "Because the satellite cannot afford the processing power to search for unknown frequency offsets and timing delays across thousands of square kilometers!",
      "The IoT terminal uses its GPS position and the satellite's orbital Ephemeris data to calculate its exact distance and relative velocity, adjusting its transmit frequency so the signal arrives at the satellite perfectly centered!"
    ],
    "situationalPuzzle": {
      "scenario": "A maritime shipping container equipped with a 3GPP Rel-17 NTN NB-IoT beacon attempts to transmit temperature data while crossing the Atlantic. The satellite passes overhead at 600 km altitude with a relative velocity towards the beacon of 5.5 km/s. Carrier frequency is 2.0 GHz. If the beacon transmits at exactly 2,000,000,000 Hz without compensation, what frequency arrives at the satellite?",
      "options": [
        "Exactly 2,000,000,000 Hz.",
        "2,000,036,690 Hz (+36.69 kHz Doppler Shift): \u0394f = f_0 * (v / c) = 2e9 * (5500 / 3e8) \u2248 +36.69 kHz. Because this massive offset exceeds the entire 15 kHz sub-carrier bandwidth by 2.4x, the satellite receiver fails to detect the transmission. The terminal must pre-shift its transmission to 1,999,963,310 Hz.",
        "1.5 GHz.",
        "Zero Hz because radio waves cannot exit the atmosphere."
      ],
      "answerIdx": 1,
      "debrief": "In LEO satellite communications, orbital velocities produce Doppler shifts that dwarf traditional terrestrial tolerances. A relative speed of 5.5 km/s at 2 GHz shifts the signal by +36.7 kHz. Since standard NB-IoT sub-carriers are only 15 kHz wide, an uncompensated signal lands over two full channels away! Pre-compensation by the user terminal is mandatory."
    },
    "quests": [
      {
        "num": 1,
        "title": "3GPP NTN Satellite Architecture & Orbital Physics",
        "type": "Concept",
        "description": "Analyze Release 17 NTN standards, LEO orbital dynamics, free space path loss at 600 km, HARQ timer adaptations, and Ephemeris orbit modeling."
      },
      {
        "num": 2,
        "title": "Satellite Doppler Shift & Sub-Carrier Drift Detective",
        "type": "Detective Challenge",
        "description": "Analyze an SDR baseband capture of a satellite IoT uplink; prove mathematically why a missing GPS time fix caused frequency pre-compensation errors and packet rejection."
      },
      {
        "num": 3,
        "title": "LEO Satellite Link Budget & Doppler Compensator Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine that calculates satellite orbital positions, slant ranges, Doppler frequency offsets, and generates transmission pre-compensation vectors."
      },
      {
        "num": 4,
        "title": "3 AM Mid-Ocean Shipping Container Telemetry Blackout Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a global tracking failure in a refrigerated cargo fleet where outdated satellite ephemeris tables caused 2,000 maritime beacons to miss overhead satellite transit windows."
      }
    ]
  },
  {
    "day": 55,
    "month": 1,
    "blockNum": 11,
    "title": "Milestone 10: Cellular LPWAN AT Command Pipeline & Autonomous Power Saving Mode (PSM) Engine",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Milestone 10 Synthesis (Cellular Telemetry Core Capstone)",
    "spokenGoal": "Congratulations on completing Block 11. Today you engineer Milestone 10: a production Cellular LPWAN AT Command Pipeline and Autonomous Power Saving Mode (PSM) Engine in TypeScript. Your engine synthesizes the complete cellular IoT embedded interface: robust asynchronous AT command serialization with URC decoupling and hardware flow control emulation, 3GPP Timer 2 and 3 encoding/decoding (T3324 Active Timer and T3412 Periodic TAU), autonomous PSM state machine transitions (Connected \u2192 Idle \u2192 PSM Deep Sleep \u2192 Warm Wakeup), and automated link recovery escalation watchdogs. Your engine will simulate a long-life cellular sensor waking from microamp sleep, transmitting mission-critical telemetry over a simulated cellular IP socket in under 2 seconds, receiving server acknowledgments, and returning safely to deep sleep. This milestone equips you with the complete wide-area cellular telemetry foundation required for global industrial deployments.",
    "conceptInvariant": "End-to-End Cellular PSM Lifecycle Invariant: The cellular driver must execute warm wakeups within 2.0 seconds: (1) Assert DTR pin to wake modem; (2) Transmit data immediately over established socket; (3) Await server ACK during T3324 active window; and (4) Transition to <3 \u03bcA PSM sleep, never falling back to a cold 3GPP Attach unless the network rejects the TAU.",
    "failureMode": "Issuing a hardware reset to the modem when an AT socket write times out during temporary cellular tower congestion; hard-resetting tears down the network registration context, converting a brief 5-second backoff into a 45-second high-power reconnect ordeal.",
    "tryItFriction": "Execute the Milestone 10 test harness: instantiate the cellular driver engine; execute network registration; negotiate T3324 = 6s and T3412 = 12h; simulate a sensor telemetry report; verify immediate transmission without re-attaching; trace the active timer expiration and transition to PSM sleep; inject an asynchronous network URC and verify zero parser corruption.",
    "socraticHints": [
      "How does a microcontroller wake a cellular modem from PSM sleep before the T3412 timer expires?",
      "By toggling the modem's DTR (Data Terminal Ready) pin or asserting a dedicated WAKEUP GPIO line!",
      "The modem's baseband processor wakes in milliseconds, restores its stored radio context, and is ready to transmit immediately."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 10 engine attempts to transmit an hourly sensor update. The cellular modem returns '+CME ERROR: 30' (Device busy) because a tower handover is occurring. Instead of resetting the modem, what recovery strategy must your driver implement?",
      "options": [
        "Cut the power supply to the modem immediately.",
        "Exponential Backoff with Escalation Watchdog: The driver pauses, waits 1.0 second, and retries the command. If three retries fail over 10 seconds, it issues 'AT+CFUN=0' followed by 'AT+CFUN=1' (soft RF reset). Only if the soft reset fails after 60 seconds does it toggle the hardware RESET pin as a last resort.",
        "Delete the sensor data and go to sleep.",
        "Change the baud rate to 300 bps."
      ],
      "answerIdx": 1,
      "debrief": "A professional embedded cellular driver implements graduated recovery escalation. 95% of transient errors resolve with a brief 1-2 second backoff. Jumping straight to a hardware reset is destructive to battery life and network signaling. Escalating gracefully (Retry \u2192 Soft RF Reset \u2192 Hardware Reset) maximizes device autonomy."
    },
    "quests": [
      {
        "num": 1,
        "title": "Cellular Driver State Architecture & Watchdog Design",
        "type": "Concept",
        "description": "Construct the formal state diagram for a resilient cellular driver, mapping AT queues, URC dispatchers, PSM sleep timers, and graduated error recovery."
      },
      {
        "num": 2,
        "title": "Destructive Reset Thrashing Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where an over-eager watchdog power-cycled a cellular modem 50 times an hour; pinpoint an unhandled CME ERROR code that triggered spurious resets."
      },
      {
        "num": 3,
        "title": "Milestone 10 Cellular Driver & PSM Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 10 Engine featuring asynchronous AT parsing, URC event routing, 3GPP timer encoders, and automated PSM lifecycle management."
      },
      {
        "num": 4,
        "title": "Milestone 10 Production Stress & Battery Endurance Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 1,000-cycle PSM wakeup stress test against the Milestone 10 engine under simulated cellular fades and network delays, proving sub-2-second telemetry and zero state deadlocks."
      }
    ]
  },
  {
    "day": 56,
    "month": 1,
    "blockNum": 12,
    "title": "Multi-Protocol Edge Gateway Architecture: Protocol Translation (BLE/LoRa/Thread to MQTT/Kafka)",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Heterogeneous Edge Integration (Protocol Translation & Unified Data Schemas)",
    "spokenGoal": "Welcome to Block 12, the final block of Course 17. In real-world enterprise deployments, you never build a system using only one wireless protocol. An automated hospital uses BLE for wearable patient vital monitors, Thread for room smart lighting and climate actuators, and LoRa for perimeter asset tracking. How does an edge computer integrate these diverse protocols into a unified cloud stream? Enter the Multi-Protocol Edge Gateway Architecture. Today we master heterogeneous Protocol Translation and Normalization. The gateway acts as a multi-radio hub: it ingests raw binary GATT notifications from BLE centrals, decrypts LoRaWAN uplinks from local Sub-GHz concentrators, and routes IPv6 CoAP packets from Thread mesh border routers. The gateway's Normalization Engine maps these proprietary binary payloads into a unified, versioned JSON or Protocol Buffers schema (containing Device UUID, Timestamp, Telemetry Key-Value pairs, and Signal Quality RSSI/SNR), publishing normalized events into cloud MQTT topics or enterprise Kafka streams with zero data loss!",
    "conceptInvariant": "Heterogeneous Normalization Invariant: Regardless of source radio transport (BLE GATT, LoRaWAN Class A, or Thread CoAP), the edge gateway must map inbound telemetry to a canonical, strongly-typed envelope: Envelope(Device_ID, Protocol_Origin, Timestamp_Epoch_Ms, Payload_Typed, Link_Metrics), ensuring downstream cloud consumers are completely decoupled from physical RF layers.",
    "failureMode": "Designing an edge gateway that hardcodes protocol-specific handling in cloud ingestion services; whenever a new sensor manufacturer or wireless protocol is introduced, the entire cloud database pipeline must be rewritten, breaking backward compatibility.",
    "tryItFriction": "Construct a Multi-Protocol Normalization Gateway in TypeScript: ingest three heterogeneous raw inputs: (1) A 20-byte BLE GATT notification buffer; (2) A Base64-encoded LoRaWAN encrypted uplink; and (3) A binary CoAP 2.05 Content response; parse each input; map them to a unified `TelemetryEvent` schema; and route them to designated MQTT topics (`telemetry/{protocol}/{deviceId}`).",
    "socraticHints": [
      "Why should protocol normalization happen at the Edge Gateway rather than in the Cloud?",
      "Bandwidth and Cloud Ingestion Cost! Raw binary protocols (like BLE and LoRa) are heavily compressed to save radio bytes.",
      "Parsing and validating them at the edge filters out corrupted packets, enriches data with local gateway metadata, and prevents millions of invalid datagrams from hitting expensive cloud ingress APIs."
    ],
    "situationalPuzzle": {
      "scenario": "An industrial manufacturing plant deploys 200 BLE vibration sensors and 50 LoRa environmental sensors. A sudden conveyor breakdown causes 50 BLE sensors to stream alarms at 100 Hz each (5,000 pkts/sec). At the same time, LoRa sensors transmit hourly reports. The gateway's single-threaded event loop becomes blocked parsing BLE arrays, causing LoRa packets to be dropped from the socket buffer. What architectural pattern resolves this?",
      "options": [
        "Discard all BLE sensor data.",
        "Decoupled Worker Thread Ingestion with Dedicated Protocol Ingress Queues: Schedulers for high-frequency short-range protocols (BLE) must be decoupled from low-frequency wide-area protocols (LoRa) using dedicated worker threads and isolated ring buffers, ensuring traffic surges on one protocol cannot starve or delay another.",
        "Slow down the factory machinery.",
        "Switch all sensors to RS-232 serial cables."
      ],
      "answerIdx": 1,
      "debrief": "Multi-radio gateways must isolate physical radio ingress pipelines. High-frequency streaming protocols like BLE GATT can easily flood an event loop. By assigning dedicated worker threads and ring buffers to each radio transceiver, high-throughput BLE streams are throttled and buffered independently, preventing starvation of critical LoRa or Thread telemetry."
    },
    "quests": [
      {
        "num": 1,
        "title": "Heterogeneous Multi-Radio Gateway Architecture",
        "type": "Concept",
        "description": "Deconstruct multi-radio hardware coexistence, ingress isolation queues, protocol translation pipelines, and canonical telemetry data schemas."
      },
      {
        "num": 2,
        "title": "Ingress Queue Starvation & Cross-Talk Detective",
        "type": "Detective Challenge",
        "description": "Analyze an edge gateway log where a BLE streaming burst caused LoRa packet forwarder timeouts; diagnose single-threaded event loop blocking."
      },
      {
        "num": 3,
        "title": "Multi-Protocol Translation & Schema Normalization Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript gateway engine that ingests raw BLE GATT, LoRaWAN, and Thread CoAP packets, normalizes payloads into Protobuf/JSON envelopes, and publishes to MQTT."
      },
      {
        "num": 4,
        "title": "3 AM Industrial Multi-Radio Gateway Meltdown Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity production outage in an automotive plant where an unhandled BLE GATT disconnect exception crashed the entire multi-protocol gateway process, blinding plant monitoring."
      }
    ]
  },
  {
    "day": 57,
    "month": 1,
    "blockNum": 12,
    "title": "Downlink Scheduling, Fair Queuing & Co-Channel Collision Prevention",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Edge Network Scheduling (Downlink Queuing & Airtime Fairness)",
    "spokenGoal": "While 90% of IoT traffic is uplink telemetry flowing from sensors to the cloud, the remaining 10%—downlink commands, valve actuations, and firmware updates—is by far the most critical. Today we master Downlink Scheduling, Fair Queuing, and Co-Channel Collision Prevention. In LPWAN and mesh networks, transmitting a downlink requires the gateway to seize the RF ether. In LoRaWAN, when a gateway transmits a downlink, its receiver is completely blinded: it cannot hear ANY uplink packets from any sensor across all 8 channels! Furthermore, gateways are subject to strict regional duty cycle limits (e.g., 10% on channel 869.525 MHz). If an operator pushes massive firmware downloads, downlink queues saturate, starving urgent valve-shutoff commands. Master Fair Queuing and Priority Scheduling: implement Class-Based Weighted Fair Queuing (CBWFQ) that reserves dedicated airtime quotas for safety alarms, throttles routine configuration downlinks, and enforces strict inter-packet guard intervals.",
    "conceptInvariant": "Gateway Downlink Airtime Fairness Invariant: Gateway downlink transmissions must be governed by a strict hierarchical priority scheduler where Critical Alarms preempt routine traffic, and aggregate gateway transmission airtime T_gw_tx is capped at \u2264 10% of total operational time to prevent deafening the gateway's uplink receivers.",
    "failureMode": "Blasting a 200 KB firmware update downlink to multiple edge nodes continuously at high power; the gateway's continuous transmission blinds its receivers for 15 minutes, causing thousands of field sensors to drop offline and assume the gateway has died.",
    "tryItFriction": "Construct a Downlink Priority Scheduler in TypeScript: implement three queues: Priority 1 (Emergency Safety Commands), Priority 2 (Configuration Updates), and Priority 3 (FOTA Bulk Chunks); enforce an ETSI 10% duty cycle ceiling on the downlink channel; implement a token bucket scheduler that guarantees Priority 1 packets transmit within 50 ms while rate-limiting Priority 3.",
    "socraticHints": [
      "Why does transmitting a downlink packet on a LoRa gateway 'deafen' the entire gateway?",
      "Because gateways are half-duplex! The gateway's high-power transmitter (+27 dBm) sits right next to its ultra-sensitive receiver (-140 dBm).",
      "During transmission, the RF switch disconnects the receiver, blinding all 8-16 listening channels to any incoming uplinks!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart gas utility network uses 5 gateways to serve 10,000 gas meters. The cloud platform initiates a bulk firmware update to 1,000 meters, pushing hundreds of downlink packets per minute. Suddenly, a pipeline pressure sensor detects a dangerous gas leak and transmits an emergency alarm uplink. The gateway never receives the alarm. Why?",
      "options": [
        "The gas leak absorbed the radio waves.",
        "Gateway Receiver Blinding from Continuous Downlinks: The gateway was busy transmitting continuous FOTA downlink chunks. Because the gateway's receiver is disconnected during transmissions, it was physically deaf to the emergency uplink burst. Downlink rate-limiting and uplink-priority scheduling were missing.",
        "The sensor's battery was consumed by the gas.",
        "Downlinks and uplinks use the same serial number."
      ],
      "answerIdx": 1,
      "debrief": "Continuous gateway downlinks are catastrophic to LPWAN network health. While transmitting, the gateway is completely deaf. Enterprise network servers must strictly throttle downlinks, leaving at least 85-90% of airtime quiet to ensure gateways can hear incoming emergency uplinks from field sensors."
    },
    "quests": [
      {
        "num": 1,
        "title": "Downlink Airtime Economics & Gateway Blinding Physics",
        "type": "Concept",
        "description": "Deconstruct half-duplex gateway front-ends, receiver desensitization, Class A/B/C downlink scheduling algorithms, and airtime quota management."
      },
      {
        "num": 2,
        "title": "Deaf Gateway & Missing Emergency Alarm Detective",
        "type": "Detective Challenge",
        "description": "Analyze an LNS event log where critical fire alarm uplinks were lost during a scheduled FOTA campaign; prove gateway downlink blinding."
      },
      {
        "num": 3,
        "title": "Class-Based Weighted Fair Queuing Downlink Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript downlink scheduler implementing priority token buckets, airtime quota tracking, emergency preemption, and gateway quiet-time enforcement."
      },
      {
        "num": 4,
        "title": "3 AM City-Wide Downlink Queue Saturation Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an LNS outage where a runaway script queued 50,000 downlink commands, exhausting network server memory and stalling all regional gateway downlinks."
      }
    ]
  },
  {
    "day": 58,
    "month": 1,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: Advanced Metering Infrastructure (AMI) Smart Grids (1,000,000 Nodes)",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Enterprise Scale Case Study (Smart Electricity Grids & Mesh Engineering)",
    "spokenGoal": "How does a national utility company architect an IoT wireless network connecting 1,000,000 smart electricity meters across an entire metropolitan city, delivering 99.99% billing accuracy with sub-second blackout detection? Today we conduct a deep architectural post-mortem of an Advanced Metering Infrastructure (AMI) Smart Grid. Dissect the multi-tier hybrid network topology: At Tier 1 (Neighborhood Area Network - NAN), meters form an IEEE 802.15.4g / Wi-SUN wireless mesh running 6LoWPAN and RPL over Sub-GHz (868/915 MHz), hopping dynamically across 50 channels to bypass urban interference. Each mesh cluster (500 to 2,000 meters) routes traffic to a solar-powered Pole-Top Gateway. At Tier 2 (Wide Area Network - WAN), the gateways backhaul aggregated telemetry to the utility data center over redundant dual-SIM LTE-M and Private 4G LTE. Examine how the system handles the ultimate test: a catastrophic power grid blackout. When 50,000 meters lose power simultaneously, how do they transmit their 'Last Gasp' dying gasp power-loss notification in 500 milliseconds before their onboard supercapacitors deplete?",
    "conceptInvariant": "AMI Dying-Gasp Supercapacitor Airtime Invariant: When grid mains power fails, an electricity meter's supercapacitor provides exactly E = 0.5 * C * (V_initial^2 - V_cutoff^2) Joules (typically 300 to 500 ms of radio operation); the meter must bypass CSMA/CA backoffs and broadcast an unslotted high-priority 'Last Gasp' frame before V_rail drops below the transceiver minimum operating voltage (1.8V).",
    "failureMode": "Relying on standard CSMA/CA exponential backoffs for Last Gasp transmissions during a power blackout; 10,000 meters attempt to back off and listen to the channel concurrently, exhausting their supercapacitor reserves before ever transmitting their outage notification.",
    "tryItFriction": "Build an AMI Grid Blackout Simulator in TypeScript: model a 1,000-meter mesh cluster powered by supercapacitors; simulate an instantaneous grid failure; implement a prioritized Dying Gasp broadcast algorithm that bypasses normal backoffs and uses CSMA energy bursts; calculate what percentage of meters successfully alert the utility within a 400 ms supercapacitor decay window.",
    "socraticHints": [
      "What is a 'Dying Gasp' in smart metering?",
      "It is a tiny, high-priority radio packet transmitted by a smart meter in the fractions of a second after AC mains power dies, powered entirely by a residual supercapacitor!",
      "It tells the utility control room: 'Power failed at Transformer 14, Substation B', pinpointing the exact burnt fuse before customers even call support!"
    ],
    "situationalPuzzle": {
      "scenario": "A municipal utility deploys 100,000 smart electricity meters using an 802.15.4g Sub-GHz mesh. During a sudden storm, a major transmission tower collapses, cutting power to 15,000 homes. The utility dashboard receives only 400 Last Gasp notifications; 14,600 meters go dark silently. Post-mortem analysis reveals all meters tried to send a 200-byte CoAP/UDP packet over standard multi-hop routing. What was the architectural flaw?",
      "options": [
        "The storm wind blew away the radio waves.",
        "Over-Sized Packet & Multi-Hop Overhead during Power Collapse: A multi-hop CoAP routing transaction takes several seconds across intermediate mesh nodes (which were also dying!). In an emergency blackout, meters must broadcast a tiny raw 12-byte MAC beacon frame directly to listening pole-top gateways with zero multi-hop routing, completing in <10 ms before supercapacitors die.",
        "The meters should have used satellite links.",
        "Supercapacitors do not work in the rain."
      ],
      "answerIdx": 1,
      "debrief": "When power collapses, you have hundreds of milliseconds, not seconds. Multi-hop routing and heavy application protocols are impossible because intermediate routers are simultaneously losing power. Successful AMI architectures use a specialized 1-hop physical MAC broadcast (Last Gasp frame) containing only the meter ID and outage code, ensuring direct gateway reception before voltage collapse."
    },
    "quests": [
      {
        "num": 1,
        "title": "AMI Smart Grid Multi-Tier Network Architecture",
        "type": "Concept",
        "description": "Deconstruct Wi-SUN / 802.15.4g field area networks, RPL mesh clustering, NAN-to-WAN backhaul gateways, and supercapacitor power budgets."
      },
      {
        "num": 2,
        "title": "Dying Gasp Collision & Blackout Blindness Detective",
        "type": "Detective Challenge",
        "description": "Analyze an RF capture of a simulated 5,000-node blackout event; pinpoint how CSMA/CA contention backoffs suffocated supercapacitor discharge budgets."
      },
      {
        "num": 3,
        "title": "AMI Smart Grid Mesh & Blackout Simulation Engine",
        "type": "Mastery Assignment",
        "description": "Implement a TypeScript simulation of a 1,000-meter AMI mesh network, modeling normal hourly billing telemetry, multi-hop routing, and rapid supercapacitor Last Gasp bursts."
      },
      {
        "num": 4,
        "title": "3 AM Regional Grid Blackout Chaos Lab",
        "type": "Production Incident Lab",
        "description": "Execute a live chaos simulation of a 50,000-meter cascading substation failure, validating Dying Gasp receipt, automated fault localization, and mesh reconnection upon grid restoration."
      }
    ]
  },
  {
    "day": 59,
    "month": 1,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: Off-Grid Precision Agriculture (LoRaWAN + LEO Satellite Uplink) & Principal RFC",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Extreme Environment Architecture & Principal RFC (Off-Grid Satellite IoT)",
    "spokenGoal": "How do you provide continuous wireless sensing and automated irrigation across a 50,000-hectare agricultural plantation in the remote Australian Outback, where there is zero cellular coverage, zero electrical grid, and summer temperatures reach 50\u00b0C? Today we analyze the extreme engineering of Off-Grid Precision Agriculture: LoRaWAN + LEO Satellite Uplink. Dissect the architecture: Hundreds of low-cost soil moisture, sap flow, and weather nodes transmit over Sub-GHz LoRaWAN (868/915 MHz) to autonomous solar-powered gateways mounted on high windmill towers. The gateways run Linux on ultra-low-power industrial SoCs (drawing <1.5W), buffered by lithium iron phosphate (LiFePO4) battery packs with MPPT solar chargers. The gateway backhaul uses an integrated 3GPP Rel-17 NTN LEO satellite transceiver, transmitting compressed sensor telemetry to overhead satellites every 20 minutes! Today you also author your Principal IoT Network Architect RFC: a rigorous, quantitative justification of protocol selection, spectrum budgets, power autonomy, and total cost of ownership (TCO) across a 10-year deployment.",
    "conceptInvariant": "Autonomous Solar Energy Neutrality Invariant: In off-grid deployments, an autonomous wireless gateway must satisfy the Energy Neutrality Principle: \u222b P_solar(t) dt \u2265 \u222b P_consumed(t) dt over any rolling 7-day winter minimum solar window, with LiFePO4 battery autonomy reserve \u2265 120 hours of continuous zero-sun operation.",
    "failureMode": "Using standard commercial consumer lithium-ion (NMC) batteries in desert agricultural gateways; ambient temperatures inside enclosure reach 65\u03b0C in summer, causing thermal runaway or permanently killing battery capacity in 3 months; industrial LiFePO4 cells rated for -20\u00b0C to +70\u00b0C are mandatory.",
    "tryItFriction": "Construct a Solar Energy & Battery Autonomy Calculator in TypeScript: calculate energy consumption for an off-grid gateway (SX1302 LoRa concentrator + MCU + Satellite modem) drawing 1.2W continuous; size a 12V LiFePO4 battery pack for 5 days of zero sun (120 hours autonomy); calculate required solar panel wattage (Wp) given a winter solar insolation of 2.5 peak sun hours/day; and verify positive power balance.",
    "socraticHints": [
      "Why is LiFePO4 (Lithium Iron Phosphate) vastly superior to standard Li-ion (NMC) for outdoor IoT gateways?",
      "Thermal safety and cycle life! LiFePO4 handles extreme temperatures up to 70\u00b0C without thermal runaway risks.",
      "Furthermore, LiFePO4 delivers 3,000 to 5,000 full charge cycles (over 10 years of daily solar cycling) compared to only 500 cycles for standard lithium polymer!"
    ],
    "situationalPuzzle": {
      "scenario": "A precision agriculture firm deploys 50 off-grid solar LoRaWAN gateways in remote wheat fields. In winter, an extended 4-day heavy overcast storm occurs. On day 3, 40 of the 50 gateways completely shut down, dropping all sensor telemetry. Analysis shows the gateways kept their satellite modems powered on and transmitting continuous keep-alives during the storm. What power management architecture was missing?",
      "options": [
        "The gateways should have used diesel generators.",
        "Dynamic Power State Governance & Deep Sleep Throttling: When battery State-of-Charge (SoC) drops below 40%, the gateway must enter Energy Conservation Mode: disable high-power satellite keep-alives, throttle LoRa downlinks, and aggregate telemetry into local flash, waking the satellite transmitter only once every 4 hours until solar charging recovers above 60%.",
        "The sensors should have stopped reading soil moisture.",
        "Solar panels should have been replaced with mirrors."
      ],
      "answerIdx": 1,
      "debrief": "Industrial off-grid edge computing requires proactive battery state-of-charge governance. When solar harvest drops, the gateway must shed power-hungry subsystems. Throttling satellite transmission intervals from 20 minutes to 4 hours reduces modem energy consumption by 90%, allowing the gateway's core LoRa receiver to stay alive through extended winter storms."
    },
    "quests": [
      {
        "num": 1,
        "title": "Off-Grid Hybrid LoRaWAN-Satellite Architecture",
        "type": "Concept",
        "description": "Deconstruct extreme environment RF propagation, solar MPPT calculations, LiFePO4 thermal derating, and satellite uplink scheduling."
      },
      {
        "num": 2,
        "title": "Winter Solar Deficit & Battery Starvation Detective",
        "type": "Detective Challenge",
        "description": "Audit an off-grid gateway telemetry log exhibiting sudden shutdown; calculate the energy deficit between winter solar insolation and satellite modem idle drain."
      },
      {
        "num": 3,
        "title": "Principal IoT Network Architect RFC Specification",
        "type": "Mastery Assignment",
        "description": "Author an exhaustive Principal Wireless Systems RFC detailing network topology, spectrum regulation compliance, link budget calculations, and 10-year TCO analysis for 100,000 nodes."
      },
      {
        "num": 4,
        "title": "3 AM Desert Plantation Gateway Freezing Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency agricultural freeze warning outage where sub-zero desert night temperatures triggered battery low-voltage cutoffs, designing autonomous thermal heaters and brownout recovery."
      }
    ]
  },
  {
    "day": 60,
    "month": 1,
    "blockNum": 12,
    "title": "Master Capstone: ApexMesh Sovereign Autonomous Multi-Radio Industrial IoT Wireless Mesh & Cloud Gateway Platform Master Capstone Viva Gate",
    "stageName": "Stage 4: Mesh, Cellular & Master Capstone",
    "stageNum": 4,
    "pedagogicalRole": "Master Capstone Defense (Sovereign Heterogeneous Wireless Network Ecosystem)",
    "spokenGoal": "Welcome to the Master Capstone Viva Gate of Course 17. Over the past 60 days, you have journeyed through the entire universe of IoT wireless networking: from electromagnetic wave physics, Friis link budgets, antenna impedance matching, and IEEE 802.15.4 CSMA/CA framing; to the complete BLE 5.x stack (GAP, ATT, GATT, 2M PHY, high-throughput notifications, and L2CAP credit-based channels); through Sub-GHz LoRa Chirp Spread Spectrum, Semtech airtime formulas, ETSI 1% duty-cycle regulation, OTAA activation, and LoRaWAN Class A/C downlinks; up through embedded Wi-Fi provisioning, zero-copy LwIP socket pipelines, and production MQTT QoS 2 resilient queuing; into 6LoWPAN header compression, RPL DODAG mesh routing, and Thread border routing with Matter; and across cellular LPWAN (NB-IoT/LTE-M) with 3GPP PSM timers, asynchronous AT command pipelines, and Direct-to-Cell LEO satellite Doppler compensation. Today you defend ApexMesh: a sovereign, multi-radio industrial IoT wireless mesh and cloud gateway platform. Prepare for your Principal Wireless Systems Architect Viva Gate!",
    "conceptInvariant": "Master Systems Invariant: The ApexMesh platform must unify heterogeneous wireless access networks (BLE, LoRaWAN, Thread 6LoWPAN, Cellular LPWAN) into a fault-tolerant, resilient telemetry fabric capable of sustained zero-data-loss operation during backhaul blackouts, autonomous self-healing within 3.0 seconds, and strict compliance with global RF regulations.",
    "failureMode": "Architectural fragmentation where individual wireless subsystems operate in isolation without unified backpressure, time synchronization, or priority scheduling; an RF storm or network outage in one protocol cascades across shared gateway memory, causing total system collapse.",
    "tryItFriction": "Execute the comprehensive ApexMesh Master Capstone verification suite: launch the full multi-radio simulation network comprising 50 nodes (10 BLE sensors, 20 LoRaWAN field nodes, 15 Thread mesh routers/SEDs, and 5 Cellular NB-IoT stations); stream live multi-protocol telemetry through the ApexMesh Gateway; inject multi-band RF interference and backhaul severance; verify zero telemetry loss, perfect schema normalization, and successful cloud MQTT delivery.",
    "socraticHints": [
      "What is the single most important architectural principle when designing a multi-radio industrial IoT platform?",
      "Loose Coupling and Strict Layered Isolation! Radios will experience interference, fading, and carrier blackouts at unpredictable times.",
      "If your application layer or routing architecture assumes instantaneous, error-free connectivity, your system will fail. Asynchronous queues, idempotent state, and robust local autonomy are non-negotiable."
    ],
    "situationalPuzzle": {
      "scenario": "During your Master Capstone Viva Gate, the Senior Evaluation Panel poses the ultimate architectural challenge: 'A major petrochemical refinery deploys your ApexMesh platform. A massive chemical explosion triggers power loss across Substation 4, severing primary fiber backhaul, while generating extreme RF electromagnetic noise. 200 safety sensors detect toxic gas leaks simultaneously. How does ApexMesh guarantee that emergency gas alarms reach the emergency command bunker within 5 seconds without duplicate confusion or packet loss?'",
      "options": [
        "The system waits for fiber technicians to repair the cable.",
        "ApexMesh Autonomous Multi-Tier Emergency Failover: (1) Mesh nodes detect link loss and re-heal locally via RPL/Thread in <2 seconds; (2) Critical gas alarms bypass routine queues via Weighted Fair Queuing; (3) The ApexMesh Gateway detects fiber loss and activates dual-redundant LTE-M / LEO Satellite backhaul in <1 second; (4) Alarms are published with QoS 2 idempotency keys over cellular/satellite to the bunker, delivering 100% of alarms within 3.2 seconds.",
        "Sensors blast audio sirens hoping humans hear them.",
        "The system reboots into safe mode."
      ],
      "answerIdx": 1,
      "debrief": "This is the hallmark of a Master Wireless Architect. The ApexMesh platform features multi-layered resilience: localized mesh self-healing at the field layer, prioritized emergency queue preemption at the MAC layer, multi-carrier cellular/satellite backhaul failover at the gateway layer, and end-to-end idempotency at the cloud layer, guaranteeing life-safety telemetry delivery under catastrophic conditions."
    },
    "quests": [
      {
        "num": 1,
        "title": "ApexMesh Master Architecture & System Specification",
        "type": "Concept",
        "description": "Construct the comprehensive master architecture document for ApexMesh, detailing multi-radio hardware layers, isolation queues, schema normalization, and cloud backhaul failover."
      },
      {
        "num": 2,
        "title": "Multi-Radio Cascade Failure & Deadlock Detective",
        "type": "Detective Challenge",
        "description": "Analyze an enterprise multi-radio gateway crash dump where simultaneous BLE reconnect storms and LoRaWAN duty-cycle exhaustion caused thread pool deadlocks."
      },
      {
        "num": 3,
        "title": "ApexMesh Sovereign Industrial Multi-Radio Gateway Engine",
        "type": "Mastery Assignment",
        "description": "Implement the complete production TypeScript ApexMesh Master Gateway Engine integrating BLE, LoRaWAN, Thread 6LoWPAN, Cellular PSM, and resilient cloud MQTT streaming."
      },
      {
        "num": 4,
        "title": "ApexMesh Master Capstone Senior Viva Defense & Chaos Gate",
        "type": "Production Incident Lab",
        "description": "Defend the ApexMesh Master Capstone under live multi-vector chaos injection: simultaneous RF jamming, power outages, fiber severance, and 50,000-message bursts, proving 100% mission survival."
      }
    ]
  }
]
