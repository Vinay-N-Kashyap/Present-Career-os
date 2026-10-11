# scripts/visuals/iot_network_spec_m1.py
# Month 1, Days 1-15 (Blocks 1-3) for Course 17: IoT Wireless Networks & Protocols (course-iot-network)
# Total Quests: 60 Quests (Days 1-15)

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Electromagnetic Wave Propagation, Friis Transmission Equation & Link Margins",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "RF Physics Foundations (Free Space Path Loss & Link Budget Mathematics)",
    "spokenGoal": "Welcome to IoT Wireless Networks and Protocols. Before diving into BLE, LoRa, or Thread packets, you must understand the immutable physics of the wireless ether: Electromagnetic Wave Propagation. When an embedded radio transmits RF energy, that energy disperses spherically across space. Deconstruct the Friis Transmission Equation: received power P_rx equals transmitted power P_tx plus transmitter antenna gain G_tx plus receiver antenna gain G_rx minus Free Space Path Loss (FSPL). In decibels, FSPL(dB) = 20*log10(d) + 20*log10(f) + 20*log10(4*pi/c). Notice the exponential decay: doubling distance cuts signal power by 6 dB (75% power loss)! Master the Link Margin: Link Margin = P_rx - Receiver_Sensitivity. If your link margin drops below 10 dB in real-world deployments, thermal noise and obstacles will drop your packets into oblivion.",
    "conceptInvariant": "Friis Free-Space Path Loss Invariant: Signal power decays quadratically with distance (P_rx \u221d 1/d^2) in free space, meaning received signal power drops by exactly 6.02 dB for every doubling of transmission distance, requiring Link Margin = (P_tx + G_tx + G_rx - FSPL) - Sensitivity \u2265 10 dB for reliable packet demodulation.",
    "failureMode": "Deploying 2.4 GHz sensor nodes in an industrial warehouse based on free-space line-of-sight specs (+14 dBm tx power, -95 dBm sensitivity = theoretical 1 km range); metal racking and concrete walls introduce 40 dB of attenuation, reducing actual reliable range to less than 25 meters and triggering catastrophic packet loss.",
    "tryItFriction": "Build an RF link budget calculator in TypeScript: compute FSPL for 868 MHz (Sub-GHz) vs 2.4 GHz (Wi-Fi/BLE) over 100 meters; calculate received power given +14 dBm P_tx, +2 dBi antennas; verify that 868 MHz enjoys an inherent ~8.8 dB path-loss advantage over 2.4 GHz due to wavelength physics (\u03bb = c/f).",
    "socraticHints": [
      "Why does a lower RF frequency travel farther than a higher frequency with identical transmit power and antenna gain?",
      "Because the effective aperture (capture area) of an isotropic receiver antenna is proportional to \u03bb^2 (the square of wavelength)! A 868 MHz wave has \u03bb \u2248 34.5 cm, while 2.4 GHz has \u03bb \u2248 12.5 cm. The larger antenna aperture captures more radiant RF flux.",
      "Calculate FSPL at both frequencies: 20*log10(2400/868) \u2248 8.8 dB difference."
    ],
    "situationalPuzzle": {
      "scenario": "A smart agriculture team installs soil moisture sensors operating at 915 MHz with P_tx = +14 dBm, G_tx = 0 dBi, G_rx = +3 dBi, and receiver sensitivity = -120 dBm. Over a 500-meter field, free-space path loss is 85.7 dB. Rain and dense corn crops introduce an additional 25 dB of vegetative attenuation. Is the link margin sufficient for production reliability?",
      "options": [
        "No, the link cannot close at all because P_rx is below -120 dBm.",
        "Link Margin = P_tx (+14) + G_tx (0) + G_rx (+3) - FSPL (85.7) - Foliage (25) - Sensitivity (-120) = -93.7 dBm - (-120 dBm) = +26.3 dB. Yes, the link is exceptionally robust because the margin exceeds the 10-15 dB industrial safety threshold.",
        "Yes, but only if the baud rate is increased to 1 Mbps.",
        "No, because Sub-GHz signals cannot penetrate crop foliage under any circumstance."
      ],
      "answerIdx": 1,
      "debrief": "With P_rx = 14 + 0 + 3 - 85.7 - 25 = -93.7 dBm, and a sensitive receiver threshold of -120 dBm, the link margin is +26.3 dB. This comfortably exceeds the 10 dB minimum industrial safety margin, ensuring that even during heavy thunderstorms (+10 dB additional fade), the radio will successfully demodulate telemetry packets."
    },
    "quests": [
      {
        "num": 1,
        "title": "RF Physics & Friis Formula Exploration",
        "type": "Concept",
        "description": "Deconstruct the electromagnetic spectrum, Friis transmission equation, wavelength-to-frequency relationship (\u03bb = c/f), and antenna isotropic effective aperture physics."
      },
      {
        "num": 2,
        "title": "Link Budget & Path Loss Detective",
        "type": "Detective Challenge",
        "description": "Analyze an RF site survey log reporting -98 dBm RSSI on a node with -92 dBm sensitivity; calculate fade margin deficits and diagnose why packet error rate (PER) spiked to 45%."
      },
      {
        "num": 3,
        "title": "Automated RF Link Budget Calculator",
        "type": "Mastery Assignment",
        "description": "Implement a production-grade TypeScript RF Link Budget Engine that evaluates FSPL, antenna gains, cable losses, receiver sensitivity, and Fresnel zone clearances across Sub-GHz and 2.4 GHz bands."
      },
      {
        "num": 4,
        "title": "3 AM Industrial Warehouse RF Blindspot Lab",
        "type": "Production Incident Lab",
        "description": "Troubleshoot a warehouse IoT rollout where a new automated metal conveyor line dropped 60 smart pallet trackers offline due to severe RF shadowing and multi-wall penetration losses."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "RF Digital Modulation: ASK, FSK, GFSK, PSK & Spectral Efficiency",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Physical Layer Modulation (Baseband Waveforms & Filtering)",
    "spokenGoal": "Having understood RF propagation, how do microcontrollers encode digital ones and zeros onto high-frequency carrier waves? Dive into RF Digital Modulation. Contrast Amplitude Shift Keying (ASK/OOK - simple, low power, but vulnerable to amplitude noise) with Frequency Shift Keying (FSK - shifting between mark and space frequencies). Examine Gaussian FSK (GFSK), the modulation powering Bluetooth Classic, BLE, and Zigbee/802.15.4 in Sub-GHz. In standard FSK, sharp square-wave frequency transitions cause broad spectral splatter and adjacent channel leakage. GFSK passes the baseband bitstream through a Gaussian low-pass filter (BT = 0.5) prior to frequency modulation, smoothing phase transitions and dramatically narrowing the RF spectral footprint. Explore Phase Shift Keying (BPSK, QPSK, O-QPSK) and quantify Spectral Efficiency: the ratio of data rate in bits/s to occupied RF bandwidth in Hertz.",
    "conceptInvariant": "Gaussian Filtering & Spectral Confinement Invariant: Passing baseband digital pulses through a Gaussian filter with bandwidth-time product BT before frequency modulation eliminates sharp discontinuities in frequency deviation, suppressing high-frequency sideband splatter by >30 dB and preventing co-channel adjacent interference.",
    "failureMode": "Transmitting raw square-wave FSK at maximum power without Gaussian pre-filtering; sideband spectral emissions spill into adjacent channels, failing FCC/ETSI regulatory mask compliance and jamming neighboring BLE/Wi-Fi channels.",
    "tryItFriction": "Simulate baseband FSK and GFSK waveforms in code: generate an alternating bitstream [1, 0, 1, 1, 0]; compute the Gaussian filter impulse response with BT = 0.5; convolve the bitstream with the filter; and plot the smoothed frequency trajectory showing eliminated overshoot.",
    "socraticHints": [
      "Why does sharp rectangular switching in FSK create broad spectral splatter?",
      "Fourier transform physics! A square pulse in time domain transforms into a sinc function in frequency domain, possessing infinite harmonic sidebands that spill across adjacent RF channels.",
      "A Gaussian pulse in the time domain transforms into a Gaussian pulse in the frequency domain, with rapid exponential rolloff and no side lobes!"
    ],
    "situationalPuzzle": {
      "scenario": "An IoT engineer designs a Sub-GHz 433 MHz sensor node using FSK with \u00b150 kHz frequency deviation at 100 kbps. During lab testing, spectrum analyzer traces show significant energy leaking 200 kHz away, exceeding the allowable channel bandwidth. Which architectural change resolves this spectral leakage without reducing data rate?",
      "options": [
        "Switch from 433 MHz to 2.4 GHz without changing the modulation.",
        "Implement Gaussian Frequency Shift Keying (GFSK) with BT = 0.5 and pulse-shaping FIR filtering, smoothing baseband transitions and strictly confining energy within the \u00b150 kHz channel mask.",
        "Increase transmit amplifier gain to overpower the sidebands.",
        "Invert the bitstream polarity every 4 bytes."
      ],
      "answerIdx": 1,
      "debrief": "GFSK pre-filters the rectangular baseband pulses with a Gaussian filter (BT = 0.5), eliminating instantaneous frequency jumps. This restricts the modulation spectrum to Carson's rule bandwidth, suppressing adjacent channel leakage by over 30 dB and passing regulatory spectral masks."
    },
    "quests": [
      {
        "num": 1,
        "title": "Modulation Scheme Taxonomy & Spectral Physics",
        "type": "Concept",
        "description": "Analyze ASK, OOK, FSK, GFSK, BPSK, and QPSK modulation mechanisms, constellation diagrams, and Bit Error Rate (BER) vs Eb/N0 curves."
      },
      {
        "num": 2,
        "title": "Spectrum Analyzer Sideband Spillover Detective",
        "type": "Detective Challenge",
        "description": "Analyze an SDR (Software Defined Radio) FFT capture exhibiting severe adjacent channel interference; diagnose unfiltered rectangular pulse shaping and calculate bandwidth spill."
      },
      {
        "num": 3,
        "title": "GFSK Baseband Modulator & Gaussian Filter Engine",
        "type": "Mastery Assignment",
        "description": "Write a TypeScript simulation engine implementing Gaussian FIR filtering (BT = 0.5), frequency deviation mapping, and instantaneous phase integration for GFSK symbols."
      },
      {
        "num": 4,
        "title": "3 AM FCC Emission Compliance Lab",
        "type": "Production Incident Lab",
        "description": "Fix an urgent RF certification failure where a custom IoT sensor exceeded ETSI EN 300 220 spectral emission limits due to improper modulation index (\u03b2) and abrupt PA (Power Amplifier) ramp-up."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Antennas, Impedance Matching, VSWR, Return Loss & PCB Trace Antennas",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "RF Hardware Interfacing (Impedance & Antenna Integration)",
    "spokenGoal": "Even the most advanced wireless SoC will fail if its RF output power cannot transfer efficiently into free space. Today we master Antennas and RF Impedance Matching. Radio front-ends are standardized on a 50-ohm characteristic impedance (Z_0 = 50 \u03a9). If the antenna impedance Z_L does not match Z_0, a portion of the forward RF wave reflects back toward the transmitter. Quantify this with the Reflection Coefficient \u0393 = (Z_L - Z_0) / (Z_L + Z_0), Return Loss (S11 in dB = -20*log10(|\u0393|)), and Voltage Standing Wave Ratio (VSWR = (1 + |\u0393|) / (1 - |\u0393|)). In an ideal match (Z_L = 50 \u03a9), \u0393 = 0, VSWR = 1.0:1, and Return Loss is infinite. If VSWR exceeds 2.0:1 (S11 > -10 dB), more than 10% of your power reflects back, heating the Power Amplifier and cutting transmit range in half. Inspect popular IoT antennas: \u03bb/4 Monopoles, Chip Antennas, and PCB Inverted-F Antennas (IFA / MIFA), and understand why the ground plane size dictates performance.",
    "conceptInvariant": "Maximum Power Transfer & Impedance Match Invariant: Maximum RF power is radiated into free space when the load impedance matches the source impedance (Z_L = Z_0 = 50 \u03a9), ensuring Return Loss S11 \u2264 -10 dB (VSWR \u2264 1.92:1) such that \u226590% of RF energy radiates and reflected power is minimized.",
    "failureMode": "Placing a 2.4 GHz PCB trace antenna directly against a lithium battery or metal enclosure without a matching \u03c0-network; parasitic capacitance detunes the antenna resonance to 2.1 GHz, dropping Return Loss to -3 dB (50% power reflected) and slashing communication range from 50m to 3m.",
    "tryItFriction": "Write a TypeScript impedance matching calculator: compute \u0393, Return Loss S11, and VSWR for antenna impedances from 20 \u03a9 to 150 \u03a9; calculate the radiated power efficiency percentage; and synthesize an L-match (series inductor, shunt capacitor) to transform a 25 - j35 \u03a9 load to 50 \u03a9.",
    "socraticHints": [
      "What happens to the reflected RF wave when Return Loss is only -3 dB?",
      "10^(-3/10) = 0.50! Exactly 50% of the transmitter's RF power reflects straight back into the transceiver chip as heat!",
      "A rule of thumb in RF design is S11 \u2264 -10 dB (at least 90% power delivered to the antenna)."
    ],
    "situationalPuzzle": {
      "scenario": "A hardware engineer tests a newly assembled BLE beacon board on a Vector Network Analyzer (VNA). The VNA reports an S11 of -4.2 dB at 2.44 GHz and VSWR = 4.2:1. When the beacon is tested, received signal strength at 5 meters is -88 dBm instead of the expected -65 dBm. What is the root cause?",
      "options": [
        "The Bluetooth firmware is using the wrong channel map.",
        "Severe RF Impedance Mismatch: The antenna is severely detuned, reflecting ~62% of transmitted power back into the transceiver. The lack of a tuned \u03c0-matching network between the SoC and the antenna is strangling radiated power.",
        "The battery voltage is 0.1V too high.",
        "The VNA calibrated to 75 ohms instead of 50 ohms automatically fixes the mismatch."
      ],
      "answerIdx": 1,
      "debrief": "An S11 of -4.2 dB corresponds to a reflection coefficient |\u0393| \u2248 0.617, meaning |\u0393|^2 \u2248 38% power transmitted and ~62% power reflected back! This 4.2 dB loss plus severe antenna detuning degrades radiated power, causing the massive RSSI drop. Tuning the matching network restores S11 < -12 dB."
    },
    "quests": [
      {
        "num": 1,
        "title": "Antenna Physics & Smith Chart Foundations",
        "type": "Concept",
        "description": "Explore dipole, monopole, inverted-F (IFA), and ceramic patch antennas; understand radiation patterns, dBi gain, and Smith Chart impedance plots."
      },
      {
        "num": 2,
        "title": "VSWR & Return Loss Detuning Detective",
        "type": "Detective Challenge",
        "description": "Inspect VNA S11 sweep data from a ruggedized IoT tracker; identify resonant frequency drift caused by human hand proximity and plastic casing permittivity (\u03b5_r)."
      },
      {
        "num": 3,
        "title": "Smith Chart L/\u03c0-Network Impedance Matching Solver",
        "type": "Mastery Assignment",
        "description": "Construct a TypeScript RF matching network engine that takes complex load impedances (R + jX) and calculates discrete inductor (nH) and capacitor (pF) values for 50-ohm matching at 868 MHz and 2.4 GHz."
      },
      {
        "num": 4,
        "title": "3 AM PA Overheating & Antenna Mismatch Lab",
        "type": "Production Incident Lab",
        "description": "Diagnose an emergency hardware failure where a batch of outdoor LoRa gateways suffered burned power amplifier stages due to high VSWR caused by water ingress inside the antenna coax connector."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Multipath Fading, Rayleigh & Rician Distributions & Co-Channel Interference",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Channel Modeling & Fading Physics (Statistical Propagation)",
    "spokenGoal": "In the real world, radio waves do not travel in clean empty vacuums. They bounce off concrete walls, metallic machines, and moving vehicles. Today we master Multipath Fading. When multiple reflected copies of a transmitted signal arrive at the receiver with differing phase delays, they interfere constructively or destructively. If two rays arrive 180 degrees out of phase, they cancel each other out completely, creating a deep 'fade null' of 30 dB or more! Deconstruct statistical channel models: Rayleigh Fading (when no line-of-sight path exists, common in dense urban or indoor factory settings) and Rician Fading (when a dominant line-of-sight component exists alongside scattered paths, parameterized by the K-factor). Examine Co-Channel Interference in the crowded 2.4 GHz ISM band, where Wi-Fi, BLE, Zigbee, and microwave ovens fight for the same 83.5 MHz of spectrum.",
    "conceptInvariant": "Multipath Phase Cancellation Invariant: When multipath RF wavefronts with path difference \u0394d = (n + 1/2)\u03bb arrive at the receiver antenna, destructive phase interference creates deep localized nulls (\u226530 dB attenuation), requiring spatial diversity, frequency hopping, or spread spectrum techniques to maintain link availability.",
    "failureMode": "Deploying fixed-frequency wireless sensors in a machine shop; static multipath nulls cause a sensor stationed in a permanent destructive interference node to fail 99% of transmissions, while moving the antenna just 6 cm (half-wavelength at 2.4 GHz) completely restores full signal strength.",
    "tryItFriction": "Build a multipath simulation script in TypeScript: model a direct ray plus two reflected rays with random phase shifts \u03b8 \u2208 [0, 2\u03c0]; sum the complex phasor amplitudes E = \u2211 A_i * e^(j\u03b8_i); generate 10,000 samples to plot the resulting Rayleigh amplitude distribution; and calculate the probability of entering a 20 dB fade.",
    "socraticHints": [
      "Why does moving an antenna just a few centimeters eliminate a dead spot at 2.4 GHz?",
      "Because the wavelength at 2.4 GHz is \u03bb = c / f = (3e8 m/s) / (2.4e9 Hz) = 12.5 centimeters! Half a wavelength is only 6.25 cm.",
      "Moving the antenna by \u03bb/2 changes the path delay of reflected waves by 180 degrees, transforming destructive cancellation into constructive reinforcement!"
    ],
    "situationalPuzzle": {
      "scenario": "A factory monitoring setup uses fixed 2.4 GHz wireless transceivers. Machine #14 sits in an RF dead zone with -99 dBm signal and 80% packet drop. Moving the receiver antenna just 6.5 centimeters sideways increases signal strength to -68 dBm with 0% packet loss. What phenomenon explains this dramatic improvement?",
      "options": [
        "The battery was discharged and recharged during the movement.",
        "Destructive Multipath Spatial Null: The antenna was originally positioned in a destructive interference null where reflected waves canceled the direct wave. Shifting position by ~\u03bb/2 shifted the phase difference by 180 degrees, converting destructive cancellation into constructive addition.",
        "The factory walls changed their dielectric constant during the move.",
        "Wi-Fi channel 6 stopped transmitting at that exact second."
      ],
      "answerIdx": 1,
      "debrief": "At 2.4 GHz, \u03bb \u2248 12.5 cm. Destructive multipath nulls occur in localized spatial pockets spaced roughly half a wavelength apart (~6.25 cm). Moving the antenna out of the destructive null restores line-of-sight phasor addition, recovering over 30 dB of signal power."
    },
    "quests": [
      {
        "num": 1,
        "title": "Multipath Physics & Rayleigh vs Rician Fading",
        "type": "Concept",
        "description": "Analyze constructive and destructive wave interference, delay spread, coherence bandwidth, and Doppler broadening in mobile IoT nodes."
      },
      {
        "num": 2,
        "title": "Industrial RF Dead Zone & Fading Null Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated factory floor telemetry log showing intermittent packet drops correlated with overhead crane movements; pinpoint dynamic multipath reflection geometry."
      },
      {
        "num": 3,
        "title": "Rayleigh Channel Phasor Simulator Engine",
        "type": "Mastery Assignment",
        "description": "Implement a Monte Carlo wireless channel simulator in TypeScript generating complex Gaussian scatterers, calculating instantaneous envelope power, and validating Rayleigh CDF probability bounds."
      },
      {
        "num": 4,
        "title": "3 AM Factory Floor 2.4 GHz Co-Channel Crisis Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an outage where newly installed industrial Wi-Fi access points saturated 2.4 GHz channels 1, 6, and 11, suffocating existing Zigbee automation sensors due to near-far co-channel interference."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: RF Link Budget & Wireless Propagation Path Loss Simulation Engine",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Milestone 1 Synthesis (RF Systems Engineering Capstone)",
    "spokenGoal": "Congratulations on completing Block 1. Today you engineer Milestone 1: a comprehensive RF Link Budget and Wireless Propagation Simulation Engine in TypeScript. Your engine must synthesize everything learned in Days 1 through 4: Friis free-space path loss, log-distance path loss with environment exponents (n = 2.0 free space, n = 3.5 urban, n = 4.0 indoor factory), Rayleigh multipath fading margins, antenna gains, cable insertion losses, and receiver sensitivity thresholds. Your engine will take multi-node geospatial coordinates and environmental profiles, compute pairwise link margins, evaluate fade probabilities, and output comprehensive link feasibility matrices. This milestone solidifies your physical-layer foundation before we step up to MAC and Link Layer protocols.",
    "conceptInvariant": "End-to-End Link Budget Feasibility Invariant: A wireless link is formally validated if and only if P_rx = P_tx + G_tx + G_rx - L_tx - L_rx - PL(d) \u2265 Sensitivity + Fade_Margin, where Fade_Margin accounts for 99.9% availability under log-normal shadow fading and Rayleigh multipath statistics.",
    "failureMode": "Calculating link viability using only nominal free-space path loss without accounting for shadow fading variance (\u03c3 = 8 dB); the system appears to have a 5 dB margin on paper, but 50% of installed nodes drop below receiver sensitivity in production due to environmental shadowing.",
    "tryItFriction": "Construct the Milestone 1 engine test suite: simulate a 10-node mesh deployed in an indoor industrial plant; configure P_tx = +14 dBm, 868 MHz vs 2.4 GHz; apply log-distance exponent n = 3.8 and shadow fading \u03c3 = 7 dB; verify that your engine correctly identifies which links fail the 15 dB industrial margin gate.",
    "socraticHints": [
      "What is the log-distance path loss formula for real-world non-free-space environments?",
      "PL(d) = PL(d_0) + 10*n*log10(d / d_0) + X_\u03c3, where d_0 is a reference distance (typically 1 meter), n is the path loss exponent, and X_\u03c3 is a zero-mean Gaussian random variable representing shadow fading.",
      "In industrial settings with metal machinery, n is typically 3.5 to 4.2."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 1 simulation engine evaluates an 868 MHz LoRa node at 2,000 meters in a suburban environment (n = 2.8, \u03c3 = 6 dB). P_tx = +14 dBm, G_tx = +2 dBi, G_rx = +5 dBi, sensitivity = -135 dBm. PL(1m) = 31 dB. What is the mean received power and does the link close with a 15 dB safety margin?",
      "options": [
        "Mean P_rx is -150 dBm, link fails completely.",
        "PL(2000m) = 31 + 10*2.8*log10(2000) = 31 + 28*3.301 = 123.4 dB. Mean P_rx = 14 + 2 + 5 - 123.4 = -102.4 dBm. Link margin to -135 dBm sensitivity is 32.6 dB. Yes, it comfortably exceeds the 15 dB safety margin.",
        "Mean P_rx is -90 dBm, but LoRa requires a 50 dB margin.",
        "Link margin is exactly 0 dB because antenna gains cancel path loss."
      ],
      "answerIdx": 1,
      "debrief": "Path loss at 2 km is 31 + 28 * 3.301 \u2248 123.4 dB. Received power P_rx = +14 + 2 + 5 - 123.4 = -102.4 dBm. With a sensitivity of -135 dBm, the margin is 32.6 dB, well above the 15 dB threshold. Even with a -3\u03c3 shadow fade (-18 dB), P_rx remains at -120.4 dBm, safely above the demodulation threshold."
    },
    "quests": [
      {
        "num": 1,
        "title": "Log-Distance & Shadow Fading Mathematical Model",
        "type": "Concept",
        "description": "Deconstruct path loss exponents, log-normal shadow fading distributions, Q-function outage probability calculations, and Fresnel zone radius math."
      },
      {
        "num": 2,
        "title": "Geospatial Link Budget Outage Detective",
        "type": "Detective Challenge",
        "description": "Audit an automated RF propagation tool report predicting 99.9% uptime; identify missing shadow fading standard deviations that hid a 22% field outage rate."
      },
      {
        "num": 3,
        "title": "Milestone 1 Engine Architecture & Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete Milestone 1 RF Link Budget & Propagation Engine in TypeScript with support for Friis, Log-Distance, Rayleigh fading, and multi-band comparative analysis."
      },
      {
        "num": 4,
        "title": "Milestone 1 Production Verification & SRE Stress Suite",
        "type": "Production Incident Lab",
        "description": "Execute automated Monte Carlo validation on the Milestone 1 engine across 50,000 simulated links, verifying statistical confidence intervals and link margin edge cases."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "IEEE 802.15.4 Architecture, 2.4 GHz PHY & O-QPSK DSSS Modulation",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Low-Power Wireless MAC/PHY (Spread Spectrum Foundations)",
    "spokenGoal": "Welcome to Block 2. Now that we understand RF physics, we step into the standard that underpins Zigbee, Thread, and 6LoWPAN: IEEE 802.15.4. While Wi-Fi blasts 54 to 600 Mbps at high power, 802.15.4 was engineered for battery-powered nodes requiring years of autonomy on a coin cell, transmitting modest payloads at 250 kbps. In the 2.4 GHz band, 802.15.4 specifies 16 channels (channels 11 through 26, spaced 5 MHz apart). How does it achieve robust noise immunity at microamp power levels? Through Direct Sequence Spread Spectrum (DSSS) and Offset Quadrature Phase Shift Keying (O-QPSK) with half-sine pulse shaping. Each 4-bit nibble of data is mapped to a 32-chip pseudo-random noise (PN) sequence. This 8x spreading factor grants ~9 dB of processing gain, allowing receivers to extract packets even when submerged under background noise.",
    "conceptInvariant": "DSSS Processing Gain Invariant: Spreading 4 bits of data into a 32-chip PN code yields a chipping rate of 2.0 Mchips/s from a 250 kbps data stream, providing Processing Gain G_p = 10*log10(32/4) \u2248 9.03 dB of jamming and co-channel interference rejection.",
    "failureMode": "Configuring 802.15.4 network coordinators on channels 12, 17, or 22 in an office with heavy Wi-Fi; Wi-Fi channels 1, 6, and 11 have 20-22 MHz wide spectral lobes that completely overwhelm 802.15.4 channels with 100x higher transmit power, causing total network disconnects.",
    "tryItFriction": "Implement the IEEE 802.15.4 32-chip symbol spreading table in TypeScript: map 4-bit symbols 0x0 through 0xF to their standard 32-chip PN sequences; write a correlation receiver function that takes a noisy chipstream and correctly resolves the original nibble via maximum inner product correlation.",
    "socraticHints": [
      "Which 802.15.4 2.4 GHz channels are immune to standard non-overlapping Wi-Fi channels 1, 6, and 11?",
      "Look at the frequency map! Wi-Fi channel 1 covers 2401-2423 MHz; Ch 6 covers 2426-2448 MHz; Ch 11 covers 2451-2473 MHz.",
      "802.15.4 Channel 15 (2425 MHz), Channel 20 (2450 MHz), Channel 25 (2475 MHz), and especially Channel 26 (2480 MHz) lie in the guard bands between or above Wi-Fi channels!"
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise smart lighting system running on 802.15.4 Channel 11 (2405 MHz) suffers severe packet drops whenever office employees stream video. Wi-Fi access points use standard 20 MHz bandwidth on Wi-Fi Channel 1 (center 2412 MHz, spanning 2402 to 2422 MHz). What is the definitive network engineering remedy?",
      "options": [
        "Increase the lighting mesh nodes' transmit power to +30 dBm.",
        "Migrate the 802.15.4 PAN coordinator to Channel 25 (2475 MHz) or Channel 26 (2480 MHz), shifting operations beyond the high-energy spectrum of Wi-Fi Channel 11 (which ends at 2473 MHz).",
        "Switch from O-QPSK to FSK modulation.",
        "Change the 802.15.4 PAN ID to a prime number."
      ],
      "answerIdx": 1,
      "debrief": "Wi-Fi channel 1 transmits with up to +20 to +30 dBm EIRP over 2402-2422 MHz, directly drowning 802.15.4 Channel 11 (2405 MHz). Channels 25 and 26 sit above standard US Wi-Fi channel 11. Channel 26 in particular sits completely outside the Wi-Fi 1-11 spectrum, providing an interference-free haven."
    },
    "quests": [
      {
        "num": 1,
        "title": "IEEE 802.15.4 PHY Architecture & DSSS Spreading",
        "type": "Concept",
        "description": "Deconstruct the 2.4 GHz PHY layer, 5 MHz channel spacing, chip sequences, half-sine pulse shaping, and O-QPSK phase transitions."
      },
      {
        "num": 2,
        "title": "Wi-Fi vs 802.15.4 Spectral Overlap Detective",
        "type": "Detective Challenge",
        "description": "Analyze RF spectrum waterfall captures showing Wi-Fi beacon bursts crushing 802.15.4 packets; calculate Carrier-to-Interference (C/I) degradation."
      },
      {
        "num": 3,
        "title": "802.15.4 DSSS Symbol Spreader & Correlator",
        "type": "Mastery Assignment",
        "description": "Develop a TypeScript engine that encodes binary payloads into 802.15.4 32-chip sequences, injects Gaussian bit flips, and implements soft-decision correlation decoding."
      },
      {
        "num": 4,
        "title": "3 AM Smart Building Channel Migration Crisis Lab",
        "type": "Production Incident Lab",
        "description": "Execute an emergency zero-downtime channel migration for 5,000 smart building actuators whose original 802.15.4 channel was blinded by new corporate Wi-Fi 6 access points."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "IEEE 802.15.4 MAC Frame Formats, Superframes & Guaranteed Time Slots",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "MAC Layer Framing & Scheduling (Deterministic Time Slicing)",
    "spokenGoal": "Now let us examine how 802.15.4 structures its data packets and coordinates shared medium access: MAC Layer Framing. Every 802.15.4 MAC frame begins with a 2-byte Frame Control Field (FCF) that defines frame type (Beacon, Data, Acknowledgment, MAC Command), addressing modes, and security enablement. Contrast the two fundamental operating modes: Non-Beacon Networks (where nodes access the channel purely asynchronously using unslotted CSMA/CA) versus Beacon-Enabled Networks. In beacon-enabled mode, the PAN Coordinator broadcasts periodic beacons defining a Superframe Structure. The superframe is divided into an active period (Contention Access Period - CAP and Contention-Free Period - CFP) and an optional inactive period where all nodes sleep. In the CFP, the coordinator allocates up to 7 Guaranteed Time Slots (GTS) for ultra-low latency, collision-free real-time industrial traffic.",
    "conceptInvariant": "MAC Superframe Structure Invariant: In beacon-enabled 802.15.4 networks, the Superframe Order (SO) and Beacon Order (BO) govern duty cycles: Beacon Interval BI = aBaseSuperframeDuration * 2^BO, and Active Duration SD = aBaseSuperframeDuration * 2^SO (where 0 \u2264 SO \u2264 BO \u2264 14), enforcing Duty Cycle = 2^(SO - BO) for microamp battery life.",
    "failureMode": "Setting Superframe Order equal to Beacon Order (SO = BO) on battery-operated sensor nodes; with an active duty cycle of 100%, radio receivers remain on continuously (drawing 15-20 mA), draining a 1,000 mAh lithium battery in 48 hours instead of 5 years.",
    "tryItFriction": "Construct a 16-bit Frame Control Field (FCF) binary encoder and decoder in TypeScript: parse frame types (bits 0-2), security enabled (bit 3), frame pending (bit 4), ACK request (bit 5), PAN ID compression (bit 6), and destination/source addressing modes (bits 10-15); verify bitmask extraction against real packet captures.",
    "socraticHints": [
      "If BO = 10 and SO = 6, what is the battery duty cycle of the sensor node?",
      "Duty Cycle = 2^(SO - BO) = 2^(6 - 10) = 2^(-4) = 1/16 = 6.25% active duty cycle!",
      "The node sleeps for 93.75% of the time, dramatically reducing average current consumption."
    ],
    "situationalPuzzle": {
      "scenario": "A medical telemetry engineer configures an 802.15.4 beacon-enabled PAN for wearable patient ECG monitors. ECG waveforms require guaranteed latency under 15 milliseconds without collision risk from other room sensors. How should the PAN coordinator schedule this traffic?",
      "options": [
        "Increase the CSMA/CA maximum backoff exponent to 8.",
        "Allocate Guaranteed Time Slots (GTS) inside the Contention-Free Period (CFP) of the superframe, dedicating collision-free TDMA slots exclusively to the ECG monitor.",
        "Disable MAC acknowledgments on all devices.",
        "Switch all sensors to broadcast addressing."
      ],
      "answerIdx": 1,
      "debrief": "The 802.15.4 CFP allows the PAN coordinator to dedicate up to 7 Guaranteed Time Slots (GTS) to specific devices. Inside a GTS, no other device can transmit and CSMA/CA contention is bypassed, providing deterministic, collision-free low latency for critical biomedical telemetry."
    },
    "quests": [
      {
        "num": 1,
        "title": "802.15.4 Frame Control & Superframe Math",
        "type": "Concept",
        "description": "Deconstruct FCF bitwise layouts, addressing modes, Beacon Order (BO), Superframe Order (SO), CAP contention, and CFP GTS allocation rules."
      },
      {
        "num": 2,
        "title": "Superframe Battery Depletion Detective",
        "type": "Detective Challenge",
        "description": "Diagnose an unexpected battery drain incident in a cold-storage sensor fleet where incorrect BO/SO firmware parameters locked nodes into 50% active radio duty cycles."
      },
      {
        "num": 3,
        "title": "802.15.4 Binary MAC Frame Parser & Serializer",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript parser that serializes and deserializes raw 802.15.4 MPDUs, extracting FCF flags, sequence numbers, PAN IDs, short/extended addresses, and FCS CRC-16."
      },
      {
        "num": 4,
        "title": "3 AM Patient ECG Telemetry GTS Collision Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency hospital telemetry incident where a misbehaving room environmental sensor transmitted rogue packets during a patient's reserved GTS window."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "CSMA/CA Channel Access: Slotted vs Unslotted, Backoff Exponents & CCA Physics",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "MAC Medium Access & Collision Avoidance (Contention Algorithms)",
    "spokenGoal": "How do dozens of wireless devices share a single radio channel without corrupting each other's transmissions? Enter Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA). Contrast Unslotted CSMA/CA (used in asynchronous networks like Zigbee and non-beacon 802.15.4) with Slotted CSMA/CA (synchronized to beacon backoff boundaries). Trace the unslotted state machine: when a node has a packet to send, it initializes its Backoff Exponent (BE = macMinBE, default 3) and Number of Backoffs (NB = 0). It picks a random backoff delay between 0 and (2^BE - 1) backoff periods (each period = 20 symbol durations = 320 \u03bcs). Once the timer expires, the radio performs Clear Channel Assessment (CCA) using Energy Detection (ED) or Carrier Sense. If the channel is clear, it transmits immediately. If busy, NB increments, BE increments (capped at macMaxBE = 5), and the node backs off again. If NB exceeds macMaxCSMABackoffs (default 4), the packet is dropped with CHANNEL_ACCESS_FAILURE.",
    "conceptInvariant": "Exponential Backoff & Channel Contention Invariant: The random backoff delay before CCA is uniformly distributed as Delay = Uniform(0, 2^BE - 1) * aUnitBackoffPeriod, dynamically expanding the contention window upon each channel-busy detection to minimize collision probability in high-density networks.",
    "failureMode": "Setting macMinBE = macMaxBE = 0 to achieve minimum transmit latency; when multiple sensor nodes wake up simultaneously following a power event, every node attempts CCA and transmits concurrently, causing a 100% collision rate and catastrophic network collapse.",
    "tryItFriction": "Implement the complete 802.15.4 unslotted CSMA/CA state machine in TypeScript: track NB, BE; simulate random backoff generation; simulate Clear Channel Assessment (CCA) with a mock noisy RF channel; and measure average backoff delay across 1,000 simulated transmissions.",
    "socraticHints": [
      "Why does 802.15.4 perform Collision Avoidance (CSMA/CA) instead of Collision Detection (CSMA/CD like Ethernet)?",
      "Because radios are half-duplex! While transmitting at +0 to +14 dBm, the node's own transmitter completely saturates its receiver. It cannot listen to the ether to detect if another node is transmitting simultaneously.",
      "Therefore, it must carefully listen BEFORE talking (CCA), and back off randomly to avoid collision."
    ],
    "situationalPuzzle": {
      "scenario": "A 100-node smart metering network suffers severe packet drops during hourly reporting bursts. Radio logs show over 40% of packets failing with status code 0xE1 (CHANNEL_ACCESS_FAILURE). All nodes currently use default settings: macMinBE = 3, macMaxBE = 5, macMaxCSMABackoffs = 4. What configuration change reduces channel contention failures?",
      "options": [
        "Set macMinBE to 0 and disable Clear Channel Assessment.",
        "Increase macMinBE to 4, increase macMaxBE to 8, and increase macMaxCSMABackoffs to 7, spreading the contention window across a wider time interval to absorb reporting bursts.",
        "Force all nodes to transmit with maximum power (+20 dBm).",
        "Switch from 2.4 GHz to 5 GHz."
      ],
      "answerIdx": 1,
      "debrief": "CHANNEL_ACCESS_FAILURE occurs when a node repeatedly finds the channel busy during CCA and exhausts its maximum backoff retries. Expanding macMaxBE to 8 expands the random contention window up to 2^8 - 1 = 255 backoff periods, while raising backoff attempts to 7 allows nodes to wait out temporary burst congestion."
    },
    "quests": [
      {
        "num": 1,
        "title": "CSMA/CA State Machine & Backoff Algorithm",
        "type": "Concept",
        "description": "Trace the step-by-step IEEE 802.15.4 CSMA/CA flowchart for both slotted and unslotted variants; analyze CCA modes (ED, CS, and ED+CS)."
      },
      {
        "num": 2,
        "title": "Channel Access Failure Storm Detective",
        "type": "Detective Challenge",
        "description": "Diagnose an industrial smart sensor telemetry burst where synchronized sensor wakeups caused cascading CCA failures and total network buffer overflow."
      },
      {
        "num": 3,
        "title": "Full CSMA/CA Discrete Event Simulator",
        "type": "Mastery Assignment",
        "description": "Write a multi-node discrete event simulation engine in TypeScript simulating 50 nodes contending for a shared 802.15.4 channel with realistic CCA, backoffs, collisions, and ACK timeouts."
      },
      {
        "num": 4,
        "title": "3 AM High-Density Sensor Collision Storm Lab",
        "type": "Production Incident Lab",
        "description": "Remediate a critical production outage in an automated logistics hub where 500 RFID tag readers experienced severe packet drops due to uncoordinated synchronized CSMA/CA retry storms."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "PAN Coordination, Association Handshakes, 16/64-Bit Addressing & Packet Sniffing",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Network Formation & Commissioning (Topology & Addressing)",
    "spokenGoal": "How does an uncommissioned sensor discover and join an existing 802.15.4 wireless network? Today we master PAN Coordination and the Association Handshake. A Personal Area Network (PAN) is formed by a PAN Coordinator, which selects an available channel via an Active Channel Scan and chooses a 16-bit PAN ID. Joining devices possess a globally unique, factory-burned 64-bit IEEE Extended Address (EUI-64). To conserve scarce radio packet bandwidth, the coordinator assigns joining nodes a dynamic 16-bit Short Address (0x0000 to 0xFFFD, where 0xFFFF is broadcast). Trace the Association Handshake: the joining node sends an Association Request command using its 64-bit address; the coordinator responds with an immediate MAC ACK; then, via an indirect data request, the node fetches its Association Response containing its assigned 16-bit Short Address and Association Status.",
    "conceptInvariant": "Short vs Extended Address Translation Invariant: Devices identify themselves with immutable 64-bit EUI-64 addresses during initial association, transitioning to dynamic 16-bit Short Addresses for all subsequent unicast traffic, reducing MAC header overhead from 18 bytes to 8 bytes per packet.",
    "failureMode": "Assigning 16-bit Short Address 0xFFFF or 0xFFFE to an associated device; 0xFFFF is reserved for MAC broadcast and 0xFFFE indicates an unassociated device, causing packets addressed to that node to either flood the entire network or be dropped by all receivers.",
    "tryItFriction": "Write a packet parsing script in TypeScript that decodes an 802.15.4 Association Command sequence: parse the Association Request (capability information byte: receiver-on-when-idle, power source, security); parse the Association Response (allocated 16-bit short address, status code 0x00 = success); and assert address validity.",
    "socraticHints": [
      "Why does 802.15.4 use an indirect data transaction for the Association Response instead of sending it immediately?",
      "Because battery-operated sensor nodes are often 'Sleepy End Devices' (SEDs) whose receivers are turned OFF immediately after transmitting to conserve power!",
      "The coordinator must buffer the response in its indirect queue until the sleepy device wakes up and sends a Data Request MAC command."
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of 200 battery-powered temperature sensors fails to complete association with an 802.15.4 coordinator. Wireshark sniffs show: Node sends Association Request -> Coordinator sends MAC ACK -> Node goes to sleep -> Coordinator sends Association Response 100ms later -> Node never ACKs and resets. What protocol invariant was violated?",
      "options": [
        "The coordinator used the wrong encryption key.",
        "Violation of Indirect Data Polling: The sleepy node turned off its receiver. The coordinator transmitted the Association Response proactively instead of buffering it as an indirect transaction until the node issued a MAC Data Request poll.",
        "The PAN ID was larger than 255.",
        "The sensor antenna fell off."
      ],
      "answerIdx": 1,
      "debrief": "Sleepy end devices turn their radios off right after receiving a MAC ACK to avoid draining their batteries. The 802.15.4 standard mandates that coordinators buffer responses for sleepy devices as 'indirect data'. The node then sends a Data Request packet when ready, keeping its receiver on to receive the buffered Association Response."
    },
    "quests": [
      {
        "num": 1,
        "title": "PAN Formation & Association Handshake Mechanics",
        "type": "Concept",
        "description": "Trace Energy Detection (ED) scan, Active scan, PAN descriptor evaluation, and the complete 4-step Association handshake with Capability Information bytes."
      },
      {
        "num": 2,
        "title": "Wireshark 802.15.4 Packet Capture Detective",
        "type": "Detective Challenge",
        "description": "Analyze a PCAP sniffer file of a failing Zigbee/Thread commissioning process; identify failed indirect data requests and short address collisions."
      },
      {
        "num": 3,
        "title": "PAN Coordinator Association & Routing Table Engine",
        "type": "Mastery Assignment",
        "description": "Implement a TypeScript PAN Coordinator engine that manages an association table, issues unique 16-bit short addresses, maintains indirect message queues, and enforces lease expirations."
      },
      {
        "num": 4,
        "title": "3 AM PAN ID Conflict & Re-Commissioning Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an outage in an industrial facility where two neighboring building coordinators selected identical PAN IDs (0x1A2B), causing cross-network packet pollution and dropped association state."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: IEEE 802.15.4 Frame Parser & Unslotted CSMA/CA MAC State Machine Engine",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Milestone 2 Synthesis (Low-Power MAC Architecture Capstone)",
    "spokenGoal": "Outstanding work reaching Milestone 2. Today you bring together everything from Block 2 to architect a production-ready IEEE 802.15.4 MAC Engine in TypeScript. Your engine must feature two core subsystems: first, an exhaustive binary Frame Serializer and Parser that handles Beacon, Data, Acknowledgment, and MAC Command frames with variable-length 16-bit and 64-bit addresses, Frame Control Fields, and FCS CRC-16 computation; second, a complete asynchronous Unslotted CSMA/CA State Machine. The state machine must handle backoff exponents (BE, NB), simulated Clear Channel Assessment (CCA), random backoff timers, ACK wait timeouts with automatic MAC-layer retries, and accurate error reporting (SUCCESS, CHANNEL_ACCESS_FAILURE, NO_ACK). This milestone forms the execution core of modern low-power wireless networking.",
    "conceptInvariant": "End-to-End MAC State Machine Invariant: Every outbound transmission must pass through the CSMA/CA contention loop before PHY handoff, and all unicast packets with AR (ACK Request) bit set must transition to an ACK-Wait state with timeout t_ack \u2264 54 symbol durations (864 \u03bcs), initiating up to macMaxFrameRetries (3) upon timeout.",
    "failureMode": "Transmitting MAC retries without resetting or recalculating the CSMA/CA backoff parameters (BE and NB); retrying immediately on a congested channel causes continuous back-to-back collisions with the same competing node.",
    "tryItFriction": "Execute the Milestone 2 test harness: instantiate 10 virtual 802.15.4 nodes transmitting to a central coordinator; configure channel contention with variable background RF noise; verify that your engine correctly handles binary serialization, backoff jitter, and graceful retry degradation under heavy traffic.",
    "socraticHints": [
      "When a packet transmission fails to receive an expected MAC ACK, should the next retry attempt immediately or re-enter CSMA/CA?",
      "It MUST re-enter the CSMA/CA algorithm from the beginning!",
      "However, for a retransmission, macMinBE is re-initialized, NB is reset to 0, and the frame retry counter increments up to macMaxFrameRetries (default 3)."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 2 MAC engine undergoes an automated torture test with 20 nodes attempting simultaneous transmission. Node #7 encounters CCA busy 5 consecutive times, while Node #12 clears CCA on attempt 1 but never receives an ACK after 4 retries. What status codes must your engine return for Node #7 and Node #12?",
      "options": [
        "Both return SUCCESS because the packets entered the PHY queue.",
        "Node #7 returns CHANNEL_ACCESS_FAILURE (0xE1) because it exhausted macMaxCSMABackoffs without finding an idle channel. Node #12 returns NO_ACK (0xE9) because it transmitted the frame but exhausted macMaxFrameRetries without receiving an acknowledgment.",
        "Node #7 returns TIMEOUT; Node #12 returns CORRUPTED.",
        "Both return NULL."
      ],
      "answerIdx": 1,
      "debrief": "In IEEE 802.15.4, CHANNEL_ACCESS_FAILURE (0xE1) indicates that the node could not obtain medium access due to continuous channel occupancy. In contrast, NO_ACK (0xE9) indicates that the physical transmission succeeded, but no matching ACK frame was received within the MAC acknowledgment timeout window."
    },
    "quests": [
      {
        "num": 1,
        "title": "802.15.4 Full State Transition Specification",
        "type": "Concept",
        "description": "Construct the formal UML state transition diagram for an IEEE 802.15.4 MAC entity, mapping Idle, Contention, Transmit, Wait-for-ACK, and Backoff states."
      },
      {
        "num": 2,
        "title": "MAC Retransmission & Deadlock Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log exhibiting infinite retry lockups; identify a missing retry counter reset that caused memory leaks and buffer exhaustion."
      },
      {
        "num": 3,
        "title": "Milestone 2 MAC Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Implement the complete IEEE 802.15.4 binary parser and asynchronous unslotted CSMA/CA state machine in TypeScript, featuring CRC-16 generation, ACK verification, and event emission."
      },
      {
        "num": 4,
        "title": "Milestone 2 Concurrency & Stress Verification Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 100,000-packet stress campaign against the Milestone 2 MAC engine simulating 90% channel saturation, proving zero unhandled rejections and strict RFC conformance."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Bluetooth Low Energy (BLE 5.x) Architecture & Physical Layers: 1M, 2M & Coded PHY",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Low-Power WPAN Architecture (BLE Physical Layer Physics)",
    "spokenGoal": "Welcome to Block 3. Today we begin our deep mastery of Bluetooth Low Energy (BLE), the ubiquitous short-range protocol operating on billions of smartphones, wearables, and industrial sensors. Deconstruct the BLE protocol stack: Physical Layer (PHY), Link Layer (LL), Host Controller Interface (HCI), L2CAP, Security Manager (SM), Generic Access Profile (GAP), Attribute Protocol (ATT), and Generic Attribute Profile (GATT). In BLE 4.x, only the 1M PHY (1 Msym/s GFSK) existed. BLE 5.0 revolutionized the standard by introducing two new physical layers: the 2M PHY (doubling symbol rate to 2 Msym/s, cutting transmit time and radio energy in half for high throughput), and the revolutionary LE Coded PHY. Master Coded PHY physics: using Forward Error Correction (FEC) with convolutional coding (S=2 for 500 kbps, S=8 for 125 kbps) and pattern mapping, Coded PHY boosts receiver sensitivity by up to 12 dB (to -105 dBm), quadrupling reliable transmission range to over 1 kilometer without increasing transmit power!",
    "conceptInvariant": "Forward Error Correction Coding Gain Invariant: LE Coded PHY (S=8) encodes each baseband bit into 8 coded symbols using convolutional FEC (rate 1/2) and a 1-to-4 spreading pattern, yielding a coding gain of ~12 dB in receiver sensitivity (from -93 dBm to -105 dBm), quadrupling range (2^(12/6) \u2248 4x) at the cost of reducing raw data rate to 125 kbps.",
    "failureMode": "Attempting to stream high-throughput sensor telemetry (50 kB/s) over LE Coded PHY (S=8); with a maximum physical bitrate of 125 kbps (theoretical max ~15 kB/s), transmit buffers overflow immediately and latency explodes to tens of seconds.",
    "tryItFriction": "Build a BLE PHY comparative model in TypeScript: calculate packet transmission duration (Time on Air) for a 250-byte PDU across 1M PHY (1,000 kbps), 2M PHY (2,000 kbps), and Coded PHY S=8 (125 kbps); calculate radio energy consumption assuming a 15 mA active transmit current at 3.3V.",
    "socraticHints": [
      "Why does 2M PHY consume LESS battery energy than 1M PHY even though transmit power is identical?",
      "Because the radio transmitter is active for only HALF the time! Transmitting a 250-byte payload at 2M PHY takes ~1.0 ms instead of ~2.1 ms.",
      "Energy = Power * Time. Halving Time-on-Air directly cuts per-packet battery energy by 50%!"
    ],
    "situationalPuzzle": {
      "scenario": "An offshore oil rig deploys BLE emergency vibration sensors across a 400-meter metal deck. Standard BLE 4.2 nodes lose connection beyond 60 meters. Upgrading the transceivers to BLE 5.0 with LE Coded PHY (S=8) allows all sensors to maintain stable links at 400 meters with zero increase in battery transmit power (+0 dBm). What mechanism made this possible?",
      "options": [
        "Coded PHY doubled the battery voltage inside the transceiver.",
        "Forward Error Correction Coding Gain: Coded PHY S=8 spreads each bit into 8 symbols with convolutional FEC, improving receiver sensitivity by ~12 dB. By the Friis inverse-square law, an extra 12 dB of link margin quadruples transmission distance (4x 60m \u2248 240m-500m depending on environment).",
        "Coded PHY switched the radio from 2.4 GHz to 433 MHz.",
        "Bluetooth 5 disabled all encryption to save bandwidth."
      ],
      "answerIdx": 1,
      "debrief": "LE Coded PHY S=8 achieves ~12 dB of coding gain via convolutional FEC and pattern spreading, improving sensitivity from -93 dBm to -105 dBm. In RF propagation, each 6 dB of additional link margin doubles line-of-sight distance; a 12 dB improvement quadruples communication range without drawing any additional battery power."
    },
    "quests": [
      {
        "num": 1,
        "title": "BLE 5.x Stack Architecture & PHY Layer Physics",
        "type": "Concept",
        "description": "Analyze the BLE layered stack, 1M, 2M, and Coded PHY (S=2, S=8) bit encodings, preamble structures, and receiver sensitivity equations."
      },
      {
        "num": 2,
        "title": "BLE PHY Throughput & Time-on-Air Detective",
        "type": "Detective Challenge",
        "description": "Analyze an oscillating BLE audio streaming trace where automatic PHY update requests between 1M and 2M created audio buffer under-runs; diagnose throughput bottlenecks."
      },
      {
        "num": 3,
        "title": "BLE PHY Time-on-Air & Energy Simulator Engine",
        "type": "Mastery Assignment",
        "description": "Develop a TypeScript engine that calculates precise microsecond Time-on-Air and microjoule energy consumption for any BLE PDU size across 1M, 2M, Coded S=2, and Coded S=8 PHYs."
      },
      {
        "num": 4,
        "title": "3 AM Long-Range Offshore BLE Disconnect Lab",
        "type": "Production Incident Lab",
        "description": "Troubleshoot a perimeter security perimeter where outdoor BLE beacon sensors dropped offline during fog and rain; evaluate Coded PHY migration to recover link margins."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "BLE Advertising Architecture: Primary Channels (37, 38, 39) & Extended Advertising",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Broadcast Networking (Advertising Channels & Extended PDUs)",
    "spokenGoal": "How do BLE devices broadcast data to the world without establishing an active connection? Today we master BLE Advertising. The 2.4 GHz band is carved into 40 RF channels (0 to 39, spaced 2 MHz apart). Channels 37 (2402 MHz), 38 (2426 MHz), and 39 (2480 MHz) are dedicated Primary Advertising Channels. Why are they spaced so far apart? Because they sit cleanly in the guard bands between Wi-Fi channels 1, 6, and 11, shielding beacons from Wi-Fi interference! In legacy BLE, advertising packets were limited to a tiny 31-byte payload. BLE 5.0 introduced Extended Advertising: the advertiser sends a small ADV_EXT_IND pointer on primary channels (37-39), pointing listening scanners to a Secondary Advertising Channel (channels 0-36) where a massive AUX_ADV_IND payload of up to 254 bytes (or up to 1,650 bytes chained) is transmitted at 2M PHY speed!",
    "conceptInvariant": "Primary Advertising Channel Shielding Invariant: Primary advertising channels 37 (2402 MHz), 38 (2426 MHz), and 39 (2480 MHz) are strategically allocated at the edges and guard bands of the 2.4 GHz ISM spectrum, maximizing discovery probability in the presence of wideband Wi-Fi interference.",
    "failureMode": "Stuffing excessive custom manufacturer data into legacy advertising packets (>31 bytes); the packet violates the BLE specification and is rejected by the Bluetooth controller stack, leaving the device completely invisible to mobile scanners.",
    "tryItFriction": "Construct a binary BLE Advertising Data (AD) structure encoder in TypeScript: pack Length, AD Type (e.g., 0x01 Flags, 0x09 Complete Local Name, 0xFF Manufacturer Specific Data), and Value fields; verify that your encoder validates the 31-byte legacy limit and correctly constructs Extended Advertising pointer structures.",
    "socraticHints": [
      "Why are primary advertising channels numbered 37, 38, and 39 instead of 0, 1, and 2?",
      "To distinguish them from the 37 general data channels (numbered 0 through 36)! Data channels use adaptive frequency hopping during connections.",
      "Advertising channels use fixed sequential hopping across 37 \u2192 38 \u2192 39 to ensure listening scanners find them rapidly."
    ],
    "situationalPuzzle": {
      "scenario": "A retail analytics firm deploys BLE beacons transmitting customer promotional messages. The marketing team requires beacons to transmit 120 bytes of text and URL data every 500 ms. Standard BLE 4.2 beacons cannot broadcast more than 31 bytes per packet. How does BLE 5.0 solve this requirement without establishing connections?",
      "options": [
        "Force smartphones to connect, read GATT characteristics, and disconnect every 500 ms.",
        "Implement BLE 5.0 Extended Advertising (ADV_EXT_IND on primary channels pointing to AUX_ADV_IND on secondary channels), enabling non-connectable broadcast payloads of up to 254 bytes per PDU.",
        "Transmit the data across Wi-Fi channel 14.",
        "Compress the 120 bytes into 4 bits using lossy Huffman coding."
      ],
      "answerIdx": 1,
      "debrief": "BLE 5.0 Extended Advertising decouples channel discovery from data payload delivery. Small pointer packets (ADV_EXT_IND) on primary channels 37, 38, and 39 point scanning devices to secondary channels (0-36) where AUX_ADV_IND packets deliver up to 254 bytes of unfragmented payload (or up to 1,650 bytes chained) at high speeds."
    },
    "quests": [
      {
        "num": 1,
        "title": "Advertising Channel Physics & Extended Advertising",
        "type": "Concept",
        "description": "Deconstruct channels 37/38/39, advertising intervals (advInterval), pseudo-random delay jitter (0-10ms), legacy AD structures, and Aux pointer chaining."
      },
      {
        "num": 2,
        "title": "31-Byte Overflow & Beacon Invisibility Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded firmware crash where adding a 128-bit custom service UUID caused an advertising packet buffer overflow, bricking the beacon's discovery state."
      },
      {
        "num": 3,
        "title": "Binary BLE Advertising Data (AD) Serializer & Parser",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript parser that encodes and decodes raw BLE advertising byte arrays into typed structures: Flags, Complete Local Name, UUID lists, and iBeacon/Eddystone frames."
      },
      {
        "num": 4,
        "title": "3 AM Airport Terminal Beacon Collision Storm Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-density interference crisis where 2,000 retail beacons broadcasting every 20ms saturated advertising channels 37, 38, and 39, causing 85% discovery failure on passenger mobile apps."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Generic Access Profile (GAP): Roles, Discovery, Scan Requests & Whitelisting",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Device Discovery & Role Coordination (GAP State Machine)",
    "spokenGoal": "Before two BLE devices can ever establish a connection, their relationship is governed by the Generic Access Profile (GAP). GAP defines how devices discover each other, broadcast their presence, and initiate links. Master the four fundamental GAP Roles: Broadcaster (transmits advertising packets, no receiver required, e.g., environmental beacons), Observer (scans for advertising packets, does not connect, e.g., asset tracking gateways), Peripheral (advertises and accepts incoming connections, typically low-power sensor nodes), and Central (scans for advertisements and initiates connections, typically smartphones or smart gateways). Trace active vs passive scanning: in passive scanning, the observer only listens; in active scanning, upon receiving an ADV_IND, the observer immediately transmits a SCAN_REQ, prompting the peripheral to return a SCAN_RSP containing an additional 31 bytes of data! Examine Whitelisting: filtering scan requests to reject unknown MAC addresses and conserve battery.",
    "conceptInvariant": "GAP State Mutual Exclusivity & Role Invariant: At any discrete moment, a BLE Link Layer entity operates in one of five states: Standby, Advertising, Scanning, Initiating, or Connection; a Peripheral is discovered via Advertising, while a Central discovers via Scanning and initiates connections via the Initiating state.",
    "failureMode": "Leaving a battery-powered sensor in continuous active scanning mode (100% scan duty cycle: Scan Window = Scan Interval = 100ms); the radio receiver consumes continuous 12 mA, draining a coin-cell battery in under 3 days.",
    "tryItFriction": "Construct a GAP State Machine in TypeScript: implement transition logic between Standby, Advertising, Scanning, Initiating, and Connected; implement active scanning with SCAN_REQ and SCAN_RSP message generation; and enforce MAC address whitelisting rules.",
    "socraticHints": [
      "What is the difference between Scan Interval and Scan Window in GAP scanning?",
      "Scan Interval is the total period between scan cycles (e.g., 100ms). Scan Window is the duration within that interval when the receiver is actually powered ON (e.g., 20ms).",
      "Duty cycle is Scan Window / Scan Interval = 20 / 100 = 20%. Tuning these values is the key to balancing discovery latency against battery life!"
    ],
    "situationalPuzzle": {
      "scenario": "A wearable fitness band operates as a BLE Peripheral. When a user opens their smartphone app, the band needs to be discovered within 1 second. However, battery lifetime must exceed 6 months on a 50 mAh cell. Average advertising current must stay below 20 \u03bcA. How should the firmware engineer configure GAP advertising parameters?",
      "options": [
        "Set advertising interval to 20 milliseconds permanently.",
        "Configure Fast Advertising (advInterval = 100 ms) for the first 30 seconds after button press, then fall back to Slow Advertising (advInterval = 1,285 ms) to preserve battery, ensuring fast discovery when active and <15 \u03bcA standby consumption.",
        "Turn off the radio completely and require an NFC tap for every sync.",
        "Switch to continuous scanning mode."
      ],
      "answerIdx": 1,
      "debrief": "A two-tier GAP advertising strategy is the industry gold standard. Fast advertising (100 ms) ensures near-instant discovery when the user is actively interacting with the device. If no connection occurs, the device drops to slow advertising (1.28 seconds), where average current drops below 15 \u03bcA, preserving coin-cell longevity for months."
    },
    "quests": [
      {
        "num": 1,
        "title": "GAP Protocol Hierarchy & Role Taxonomy",
        "type": "Concept",
        "description": "Analyze Broadcaster, Observer, Peripheral, and Central roles, active vs passive scanning, scan window/interval duty cycles, and filter accept lists."
      },
      {
        "num": 2,
        "title": "Scanning Battery Depletion Detective",
        "type": "Detective Challenge",
        "description": "Analyze a wearable prototype battery trace showing 15 mA continuous current; identify a misconfigured background GAP continuous scan window."
      },
      {
        "num": 3,
        "title": "GAP Link Layer State Machine & Scanner Engine",
        "type": "Mastery Assignment",
        "description": "Implement a TypeScript GAP engine simulating Central and Peripheral discovery, active SCAN_REQ/SCAN_RSP exchanges, and configurable duty-cycle scanners."
      },
      {
        "num": 4,
        "title": "3 AM Smart Lock Connection Discovery Blackout Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an urgent consumer smart lock failure where mobile devices suffered 10-second pairing discovery delays due to improper advertising interval and scan window alignment."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "BLE Connection Establishment, Connection Intervals, Latency & Adaptive Frequency Hopping",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Link Layer Connected State (Timing Parameters & Channel Hopping)",
    "spokenGoal": "Now we transition from broadcast advertising to a fully established, synchronized point-to-point connection. How does a Central connect to a Peripheral? When a Central listening on an advertising channel detects an ADV_IND from a desired device, it transmits a CONNECT_IND packet within 150 \u03bcs. The CONNECT_IND dictates all timing parameters for the lifetime of the connection. Master the three critical parameters: Connection Interval (how often Central and Peripheral wake up to exchange packets, ranging from 7.5 ms to 4.0 s in 1.25 ms steps), Peripheral Latency (the number of consecutive connection events the Peripheral is allowed to skip if it has no data to send), and Supervision Timeout (the maximum time allowed without a successful packet exchange before declaring the link disconnected, 100 ms to 32 s). Deconstruct Adaptive Frequency Hopping (AFH): during each connection event, the radio hops to a new data channel (0-36) based on a Hop Increment and an active channel map, dynamically blacklisting channels polluted by Wi-Fi!",
    "conceptInvariant": "Supervision Timeout & Peripheral Latency Invariant: To prevent false connection dropouts, the Supervision Timeout must strictly satisfy: Supervision_Timeout > (1 + Peripheral_Latency) * Connection_Interval * 2, ensuring the link survives the maximum allowed skipped events with margin for packet loss.",
    "failureMode": "Setting Connection Interval = 1,000 ms, Peripheral Latency = 5, and Supervision Timeout = 2,000 ms; when the peripheral skips 3 connection events (3,000 ms elapsed), the central terminates the connection prematurely with 0x08 (L2CAP Connection Timeout).",
    "tryItFriction": "Implement the BLE Adaptive Frequency Hopping (AFH) channel selection algorithm in TypeScript: maintain an active channel map bitmask of 37 data channels; implement the Channel = (Last_Channel + Hop_Increment) % 37 formula; re-map blacklisted channels to unpolluted frequencies; and simulate 100 hops with Wi-Fi interference.",
    "socraticHints": [
      "What is the mathematical relationship required between Connection Interval, Peripheral Latency, and Supervision Timeout?",
      "Supervision Timeout defines when the link is considered DEAD if no packets arrive.",
      "If a peripheral is legally allowed to sleep for (1 + Latency) intervals, the timeout MUST be greater than (1 + Latency) * Connection_Interval, typically multiplied by 2 or 3 for safety against RF packet loss!"
    ],
    "situationalPuzzle": {
      "scenario": "A medical continuous glucose monitor (CGM) transmits blood sugar readings every 5 minutes. The patient requires the sensor to last 14 days on a miniature battery, but immediate alerts must transmit within 100 ms if blood sugar crashes. Which connection parameter configuration achieves both goals?",
      "options": [
        "Connection Interval = 5 minutes, Peripheral Latency = 0, Supervision Timeout = 10 minutes.",
        "Connection Interval = 50 ms, Peripheral Latency = 59 (allowing the sensor to sleep for 50ms * 60 = 3,000 ms during quiet times), Supervision Timeout = 6,000 ms. When an alert occurs, the peripheral wakes up immediately on the very next 50 ms connection event without waiting!",
        "Connection Interval = 7.5 ms, Peripheral Latency = 0 permanently.",
        "Disconnect between every reading and reconnect from scratch."
      ],
      "answerIdx": 1,
      "debrief": "Peripheral Latency is a brilliant BLE feature. By setting Connection Interval to 50 ms and Latency to 59, the peripheral can sleep through 59 connection events (waking up every 3 seconds to keep the link alive at microamp power). But when emergency telemetry arises, the peripheral does NOT have to skip: it transmits immediately on the next 50 ms event, achieving sub-100 ms response times!"
    },
    "quests": [
      {
        "num": 1,
        "title": "BLE Connection Parameters & AFH Mechanics",
        "type": "Concept",
        "description": "Analyze CONNECT_IND payloads, connection interval math (1.25ms units), supervision timeout math (10ms units), peripheral latency, and channel remapping."
      },
      {
        "num": 2,
        "title": "Premature Supervision Timeout Disconnect Detective",
        "type": "Detective Challenge",
        "description": "Diagnose an erratic BLE link drop issue in a smart ring where incorrect peripheral latency settings triggered central-side link termination during deep sleep."
      },
      {
        "num": 3,
        "title": "BLE Connection Parameter Negotiator & AFH Engine",
        "type": "Mastery Assignment",
        "description": "Implement a TypeScript engine that validates connection parameter constraints, handles Connection Parameter Update Requests, and models AFH hop sequences across noisy channels."
      },
      {
        "num": 4,
        "title": "3 AM Factory Floor BLE Link Instability Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an industrial crisis where automated guided vehicles (AGVs) dropped BLE control links when passing high-power motor drives; tune supervision timeouts and AFH channel blacklists."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: Multi-Role BLE Link Layer State Machine & Connection Parameter Negotiation Engine",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Milestone 3 Synthesis (BLE Protocol Core Capstone)",
    "spokenGoal": "Congratulations on reaching Milestone 3. Today you synthesize everything learned across Block 3 to engineer a Multi-Role BLE Link Layer State Machine and Connection Parameter Negotiation Engine in TypeScript. Your engine must model both Central and Peripheral Link Layer state machines. It will handle advertising state transitions, scanning filters, CONNECT_IND packet serialization, connection event anchor scheduling, and dynamic Connection Parameter Update Request/Response handshakes (handling LL_CONNECTION_UPDATE_IND). It must enforce the strict mathematical invariant between Connection Interval, Peripheral Latency, and Supervision Timeout, and simulate Adaptive Frequency Hopping (AFH) with real-time channel map updates. This milestone completes your link-layer mastery before we advance to GATT, services, and characteristics.",
    "conceptInvariant": "Link Layer State Machine & Parameter Negotiation Invariant: Any connection parameter update initiated via LL_CONNECTION_UPDATE_IND must take effect at an exact future connection event anchor count (Instant = Current_Event_Counter + N, where N \u2265 6), ensuring Central and Peripheral switch timing and channel maps synchronously without dropping the link.",
    "failureMode": "Applying new connection interval parameters immediately upon receiving the update request without waiting for the negotiated Instant counter; the peripheral switches intervals while the central still transmits at the old interval, causing instant loss of synchronization and supervision timeout.",
    "tryItFriction": "Run the Milestone 3 test suite: instantiate a Central and Peripheral state machine; execute discovery, connection establishment, and a dynamic parameter update transition (switching from 100ms interval to 15ms interval for high throughput); verify that both entities switch at the exact scheduled Instant counter.",
    "socraticHints": [
      "Why does BLE specify an 'Instant' counter for applying connection parameter updates?",
      "Because Central and Peripheral are communicating asynchronously over an unreliable wireless medium! If parameters changed immediately, an unacknowledged packet would leave the two radios operating on different frequencies or timing intervals.",
      "The Instant counter gives both sides several guaranteed connection events to confirm the change before switching simultaneously."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 3 Link Layer engine receives an LL_CONNECTION_PARAM_REQ from a peripheral requesting Connection Interval = 10 ms, Latency = 10, Supervision Timeout = 100 ms. How must your Central engine evaluate this request?",
      "options": [
        "Accept the parameters immediately because the peripheral knows its battery needs.",
        "Reject or Modify the parameters with LL_REJECT_IND or counter-proposal: the requested parameters violate the Bluetooth Core Specification invariant. With Latency = 10 and Interval = 10 ms, the peripheral can sleep for (1 + 10) * 10 ms = 110 ms, which exceeds the 100 ms Supervision Timeout! The timeout must be increased to at least 250 ms.",
        "Disconnect the peripheral immediately and blacklist its MAC address.",
        "Forward the request to the application layer without validation."
      ],
      "answerIdx": 1,
      "debrief": "The requested parameters are mathematically invalid and would cause instant connection drops. A peripheral skipping 10 events sleeps for 110 ms, guaranteeing a supervision timeout (100 ms) expiration even without any packet loss. The Central Link Layer must reject or clamp the timeout to > (1 + Latency) * Interval * 2."
    },
    "quests": [
      {
        "num": 1,
        "title": "BLE Link Layer State Transition & Timing Physics",
        "type": "Concept",
        "description": "Analyze state transition constraints between Standby, Advertising, Scanning, Initiating, and Connection states; deconstruct connection event anchor points and inter-frame spacing (T_IFS = 150 \u03bcs)."
      },
      {
        "num": 2,
        "title": "Connection Parameter Instant Desynchronization Detective",
        "type": "Detective Challenge",
        "description": "Analyze a Bluetooth HCI log showing an immediate link disconnect during firmware OTA mode switching; pinpoint an off-by-one error in LL_CONNECTION_UPDATE_IND Instant counter calculation."
      },
      {
        "num": 3,
        "title": "Milestone 3 BLE Link Layer Engine Architecture",
        "type": "Mastery Assignment",
        "description": "Construct the complete TypeScript BLE Link Layer Engine featuring Central and Peripheral state machines, CONNECT_IND generation, AFH channel mapping, and synchronized Instant parameter switching."
      },
      {
        "num": 4,
        "title": "Milestone 3 Production Concurrency & SRE Lab",
        "type": "Production Incident Lab",
        "description": "Stress test the Milestone 3 engine with 50 simultaneous BLE connections undergoing dynamic PHY switches (1M to 2M) and connection interval negotiations under simulated 20% packet drop rates."
      }
    ]
  }
]
