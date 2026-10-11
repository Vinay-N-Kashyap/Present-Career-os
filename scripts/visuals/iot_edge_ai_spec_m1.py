# scripts/visuals/iot_edge_ai_spec_m1.py
# Month 1, Days 1-15 (Blocks 1-3) for Course 18: Edge AI, DSP & TinyML Systems (course-iot-edge-ai)
# Total Quests: 60 Quests (Days 1-15)

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Analog-to-Digital Conversion (ADC) Physics, Nyquist-Shannon Sampling & Quantization Noise",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Signal Processing Foundations (ADC Sampling Physics & Information Theory)",
    "spokenGoal": "Welcome to Edge AI, Digital Signal Processing, and TinyML Systems. Before a neural network can detect bearing failure or recognize speech on an ultra-low-power microcontroller, real-world physical vibrations and audio waves must be transformed into discrete numbers. Deconstruct the physics of Analog-to-Digital Conversion (ADC). Master the Nyquist-Shannon Sampling Theorem: to reconstruct an analog signal of maximum frequency f_max without aliasing, the sampling frequency f_s must strictly satisfy f_s > 2*f_max. If high-frequency noise exceeds f_s/2 (the Nyquist folding frequency), it reflects back into the baseband spectrum as ghost frequencies (aliasing), destroying sensor fidelity! Master Anti-Aliasing analog low-pass filters. Quantify Quantization Noise: mapping continuous voltages into discrete N-bit ADC buckets introduces round-off error, dictating the theoretical maximum Signal-to-Noise Ratio: SNR(dB) \u2248 6.02*N + 1.76 dB. A 12-bit microcontroller ADC yields ~74 dB of dynamic range.",
    "conceptInvariant": "Nyquist-Shannon & Quantization Dynamic Range Invariant: An analog signal is losslessly digitized if and only if: (1) Sampling frequency satisfies f_s > 2*f_max; (2) Analog anti-aliasing filtering attenuates frequencies f \u2265 f_s/2 by \u2265 60 dB; and (3) Theoretical quantization SNR bounds dynamic range to SNR = 6.02*N + 1.76 dB across N ADC bits.",
    "failureMode": "Sampling an industrial motor vibration sensor at 1,000 Hz when gear-mesh teeth produce vibrations at 1,200 Hz without an analog low-pass filter; the 1,200 Hz tone aliases down to |1000 - 1200| = 200 Hz, causing the edge ML model to generate false alarms for non-existent low-frequency unbalance.",
    "tryItFriction": "Construct an ADC digitization and aliasing simulator in TypeScript: synthesize a 1,200 Hz pure sine wave; sample it at f_s = 1,000 Hz over 100 milliseconds; compute the discrete Fourier transform of the sampled array; prove that the reconstructed frequency spectrum peaks at 200 Hz (aliasing); add a simulated 4th-order Butterworth anti-aliasing filter and verify ghost tone suppression.",
    "socraticHints": [
      "Why does a 1,200 Hz vibration tone appear at 200 Hz when sampled at 1,000 Hz?",
      "Because of the Nyquist folding frequency at f_s / 2 = 500 Hz! Frequencies above 500 Hz fold back into the primary Nyquist zone.",
      "The aliased frequency is f_alias = |f_signal - k * f_s| = |1200 - 1000| = 200 Hz! Once digitized, math cannot distinguish the alias from a real 200 Hz tone."
    ],
    "situationalPuzzle": {
      "scenario": "An edge vibration monitor uses a 12-bit ADC with a 3.3V full-scale reference. The sensor measures baseline machine vibration at 50 mV RMS with high-frequency acoustic emission noise at 8 kHz. The firmware samples at 2 kHz without an analog front-end low-pass filter. The downstream TinyML classifier reports false bearing anomalies. What hardware-firmware correction fixes this?",
      "options": [
        "Increase the neural network layer count from 3 to 10.",
        "Deploy a hardware analog Anti-Aliasing Low-Pass Filter with cutoff f_c = 800 Hz before the ADC input, attenuating the 8 kHz acoustic noise by >50 dB before sampling at 2 kHz.",
        "Double the battery supply voltage to 6.6V.",
        "Change the floating-point numbers to signed 8-bit integers."
      ],
      "answerIdx": 1,
      "debrief": "Once aliasing occurs in the ADC, digital processing cannot remove the ghost frequencies because they are indistinguishable from genuine baseband signals. An analog anti-aliasing low-pass filter must precede the ADC, filtering out all frequencies above the Nyquist cutoff (f_s / 2 = 1,000 Hz) before sampling."
    },
    "quests": [
      {
        "num": 1,
        "title": "ADC Sampling Physics & Quantization Theory",
        "type": "Concept",
        "description": "Deconstruct Nyquist-Shannon sampling theorem, folding frequencies, quantization noise formulas (SNR = 6.02N + 1.76 dB), and Effective Number of Bits (ENOB)."
      },
      {
        "num": 2,
        "title": "Spectral Aliasing & False Anomaly Detective",
        "type": "Detective Challenge",
        "description": "Analyze an FFT spectrum of digitized industrial pump data showing an unexplained 150 Hz peak; prove mathematically that it originated from an un-filtered 850 Hz harmonic."
      },
      {
        "num": 3,
        "title": "ADC Sampling & Aliasing Simulation Engine",
        "type": "Mastery Assignment",
        "description": "Develop a TypeScript engine that models continuous analog signals, analog Butterworth anti-aliasing filtering, N-bit ADC quantization, and calculates signal-to-noise ratio."
      },
      {
        "num": 4,
        "title": "3 AM Factory Motor Ghost Vibration Incident Lab",
        "type": "Production Incident Lab",
        "description": "Troubleshoot a false-alarm storm across 500 industrial IoT vibration pods where variable frequency drive (VFD) switching noise aliased into the predictive maintenance bandwidth."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Discrete Convolution, FIR vs IIR Digital Filtering & Biquad Direct Forms",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Digital Filter Architecture (FIR vs IIR & Difference Equations)",
    "spokenGoal": "Once a signal is digitized, how do we clean up electrical hum, isolate resonant frequencies, or remove high-frequency sensor jitter? Enter Discrete Time Filtering. Deconstruct Discrete Convolution: y[n] = \u2211 h[k] * x[n - k]. Compare the two fundamental filter architectures: Finite Impulse Response (FIR) vs Infinite Impulse Response (IIR). FIR filters rely solely on past inputs (feedforward). They are unconditionally stable, guarantee strictly linear phase response (preserving waveform shapes), but require dozens or hundreds of filter taps (consuming heavy CPU cycles). In contrast, IIR filters use feedback from past outputs (y[n] = \u2211 b_k * x[n - k] - \u2211 a_k * y[n - k]). They achieve razor-sharp cutoff slopes with only 4 to 8 coefficients (ideal for microcontrollers!), but can become unstable if poles drift outside the unit circle. Master Biquad Cascades (Second-Order Sections - SOS) in Direct Form I and II: the gold standard for robust, numerically stable embedded IIR filtering.",
    "conceptInvariant": "Filter Stability & Phase Linearity Invariant: An FIR filter is inherently BIBO stable with perfectly linear phase (constant group delay \u03c4 = (N-1)/2), whereas an IIR filter achieves identical magnitude selectivity with \u2264 10% of FIR arithmetic operations, provided all Z-domain poles reside strictly within the unit circle (|p_i| < 1.0).",
    "failureMode": "Implementing a 6th-order IIR filter as a single direct-form polynomial on an embedded MCU with single-precision floats; coefficient quantization error pushes high-order poles outside the unit circle, causing the filter to oscillate uncontrollably to positive infinity.",
    "tryItFriction": "Implement an FIR filter and a Biquad IIR filter in TypeScript: write a 31-tap low-pass FIR filter using a Hann window; write a 2nd-order Biquad IIR filter (Direct Form II Transposed); pass a noisy test signal containing 50 Hz baseband and 300 Hz noise; verify that both attenuate the 300 Hz tone by >30 dB, and measure the 5x execution speed advantage of the Biquad IIR.",
    "socraticHints": [
      "Why are high-order IIR filters always broken down into cascaded 2nd-order Biquad sections rather than implemented as one 8th-order equation?",
      "Numerical sensitivity! In high-order polynomials, a tiny round-off error in low-precision floating point or fixed-point coefficients shifts the roots (poles) dramatically.",
      "Cascading 2nd-order Biquads isolates poles into independent pairs, guaranteeing numerical stability even on 16-bit or 32-bit fixed-point DSPs!"
    ],
    "situationalPuzzle": {
      "scenario": "An ECG biometric monitor running on an ARM Cortex-M4 processes heart rate signals. The raw signal has 50 Hz power-line hum. The firmware engineer implements an 8th-order IIR Notch filter in a single Direct Form I equation. After 10 minutes of operation, the output suddenly explodes to NaN (+Infinity). What caused the numerical explosion?",
      "options": [
        "The patient's heart stopped.",
        "Direct Form Pole Migration Instability: High-order IIR direct form polynomials suffer extreme numerical coefficient sensitivity. Quantization rounding pushed poles outside the Z-plane unit circle (|z| \u2265 1.0), transforming negative feedback into unstable positive feedback. Decomposing the filter into four cascaded 2nd-order Biquad Direct Form II sections eliminates this instability.",
        "The battery voltage dropped by 0.01V.",
        "Convolution cannot be computed on microcontrollers."
      ],
      "answerIdx": 1,
      "debrief": "Implementing high-order IIR filters in direct form is a notorious DSP hazard. The dynamic range of polynomial coefficients spans multiple orders of magnitude, causing truncation error that pushes poles outside the unit circle. Cascading second-order Biquad sections (SOS) isolates pole-zero pairs and guarantees stability."
    },
    "quests": [
      {
        "num": 1,
        "title": "FIR vs IIR Mathematical Theory & Z-Transform Analysis",
        "type": "Concept",
        "description": "Deconstruct difference equations, transfer functions H(z), unit circle pole-zero plots, group delay, and Biquad Direct Form I/II topologies."
      },
      {
        "num": 2,
        "title": "Unstable IIR Pole Migration & Oscillation Detective",
        "type": "Detective Challenge",
        "description": "Audit an embedded audio filter codebase where single-precision coefficient truncation caused an IIR bandpass filter to oscillate into rail-to-rail clipping."
      },
      {
        "num": 3,
        "title": "Cascaded Biquad IIR & FIR Filter Engine",
        "type": "Mastery Assignment",
        "description": "Build a modular TypeScript DSP filtering engine supporting arbitrary FIR windowed sinc design and cascaded Second-Order Section (SOS) Biquad IIR filtering."
      },
      {
        "num": 4,
        "title": "3 AM Industrial Sensor 50/60 Hz Hum Filter Meltdown Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency ECG patch glitch where unconstrained phase distortion from a non-linear phase IIR filter distorted QRS wave morphology, triggering false cardiac arrest alerts."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Fast Fourier Transform (FFT), Cooley-Tukey Radix-2/4 & Spectral Windowing",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Frequency Domain Analysis (FFT Algorithms & Windowing Physics)",
    "spokenGoal": "To detect machine anomalies, speech phonemes, or acoustic events, time-domain waveforms alone are rarely enough. We must translate time into frequency. Master the Discrete Fourier Transform (DFT) and its algorithmic breakthrough: the Fast Fourier Transform (FFT). While naive DFT requires O(N^2) complex multiplications (prohibitive on microcontrollers!), the Cooley-Tukey Radix-2 FFT exploits butterfly symmetry to reduce complexity to O(N log2 N). For N = 1024 samples, operations drop from 1,048,576 down to only 10,240—a 100x computational speedup! Master Spectral Leakage: because the FFT assumes a finite block of time repeats infinitely, sharp discontinuities at block edges cause energy to spill across the entire spectrum. Solve this with Spectral Windowing: multiplying the time-domain signal by a smooth window function (Hann, Hamming, Blackman-Harris) before computing the FFT, attenuating edge discontinuities and suppressing side lobes by up to 92 dB!",
    "conceptInvariant": "Cooley-Tukey Symmetry & Windowing Leakage Invariant: The Radix-2 FFT decomposes an N-point DFT into N/2 2-point butterfly operations in O(N log2 N) operations; applying a window function w[n] prior to FFT trades main-lobe width for side-lobe attenuation (Hann: -31.5 dB, Blackman: -58 dB, Blackman-Harris: -92 dB), preventing spectral leakage masking of faint harmonic tones.",
    "failureMode": "Computing a raw rectangular-windowed 1024-point FFT on bearing acoustic emissions; spectral leakage from a loud 50 Hz shaft rotation tone spills into neighboring bins, completely burying a faint 125 Hz outer-race bearing fault peak.",
    "tryItFriction": "Implement an in-place Radix-2 Cooley-Tukey FFT in TypeScript: implement bit-reversal permutation; compute complex butterfly operations using precomputed twiddle factors W_N^k = e^(-j*2\u03c0k/N); apply a Hann window; compute the power spectrum of a multi-tone signal; and demonstrate that windowing suppresses side-lobe leakage by >30 dB compared to rectangular windowing.",
    "socraticHints": [
      "Why does a rectangular window cause spectral leakage even if the input is a pure sine wave?",
      "Because unless the sine wave's period fits into the FFT block size with an EXACT integer number of cycles, the beginning and end of the block do not match!",
      "When repeated infinitely, this creates an artificial sharp cliff in the time domain, which manifests in the frequency domain as high-frequency sinc harmonic side-lobes!"
    ],
    "situationalPuzzle": {
      "scenario": "A TinyML predictive maintenance model monitors a wind turbine gearbox. The model inspects FFT frequency bins to detect early micro-cracking at 420 Hz. In production, a strong 400 Hz gear-mesh vibration tone causes adjacent bins to rise, burying the 420 Hz signal in background noise. The FFT currently uses a standard rectangular window. What DSP enhancement isolates the 420 Hz peak?",
      "options": [
        "Multiply the FFT output bins by random weights.",
        "Apply a 7-term Blackman-Harris or Hanning window to the time-domain buffer before computing the FFT: this tapers the buffer edges to zero, suppressing side-lobe leakage by >60 dB and cleanly separating the 400 Hz tone from the faint 420 Hz fault peak.",
        "Reduce the sampling rate to 200 Hz.",
        "Delete the gearbox vibration sensor."
      ],
      "answerIdx": 1,
      "debrief": "Rectangular windowing has terrible side-lobe rejection (first side-lobe is only -13 dB down). Loud tones easily leak energy into adjacent frequency bins, drowning out nearby faint harmonics. A Hanning (-31.5 dB) or Blackman-Harris (-92 dB) window suppresses side-lobes, cleanly separating close spectral components."
    },
    "quests": [
      {
        "num": 1,
        "title": "FFT Butterfly Architecture & Windowing Physics",
        "type": "Concept",
        "description": "Deconstruct the Cooley-Tukey Radix-2/Radix-4 decimation-in-time algorithm, twiddle factor math, bit-reversal indexing, and window function properties."
      },
      {
        "num": 2,
        "title": "Spectral Leakage & Masked Fault Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial vibration FFT report where an unwindowed transform obscured a critical bearing defect frequency under power-grid harmonic splatter."
      },
      {
        "num": 3,
        "title": "In-Place Radix-2 FFT & Windowing Suite Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript FFT engine featuring bit-reversal sorting, twiddle factor LUTs, Hann/Hamming/Blackman windowing, and magnitude/phase spectrum extraction."
      },
      {
        "num": 4,
        "title": "3 AM Wind Turbine Gearbox Vibration Blindspot Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an offshore wind turbine monitoring blackout where insufficient FFT frequency resolution and spectral leakage masked planetary gear tooth chipping."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "CMSIS-DSP Vector Acceleration: ARM Cortex-M SIMD, Q15/Q31 Fixed-Point & Saturating Math",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Embedded Vector Hardware Acceleration (SIMD & Fixed-Point Mathematics)",
    "spokenGoal": "Running floating-point matrix multiplications and FFTs on a 64 MHz microcontroller with no dedicated FPU will drain your battery and miss real-time deadlines. How do world-class embedded engineers achieve blistering DSP speed on Cortex-M? Through ARM CMSIS-DSP Vector Acceleration and Fixed-Point Arithmetic! Master Q-Format Numbers: Q15 and Q31. In Q15, a 16-bit signed integer represents fractional numbers between -1.0 and +0.999969 (Value = Integer / 32,768). Master Saturating Arithmetic: when two large fixed-point numbers multiply, standard C arithmetic wraps around on overflow (positive turns into massive negative!), creating ear-splitting audio clicks or sensor corruption. ARM Cortex-M instructions (`QADD`, `QSUB`, `QDADD`) saturate at max positive (0x7FFF) or min negative (0x8000). Deconstruct SIMD (Single Instruction Multiple Data): instructions like `SMLAD` execute TWO 16-bit multiplications and accumulate into a 32-bit register in a single clock cycle, quadrupling DSP throughput!",
    "conceptInvariant": "Q15 Fixed-Point Saturation & SIMD Invariant: Q15 arithmetic maps real numbers x \u2208 [-1.0, 1.0 - 2^(-15)] to int16_t via x_q15 = clamp(round(x * 32768), -32768, 32767); all vector additions and dot products must use saturating arithmetic (QADD16/SMLAD) to prevent catastrophic numerical wraparound.",
    "failureMode": "Performing fixed-point dot products in standard C without saturating math or intermediate 32/64-bit accumulation; accumulator overflows cause sign-bit flipping (overflow wrap), turning a loud acoustic explosion into silence and blinding the edge AI trigger.",
    "tryItFriction": "Construct a Q15 Fixed-Point vector math engine in TypeScript: convert floats to Q15; implement Q15 multiplication with rounding and saturating clamping; implement a dot product accumulator that models ARM Cortex-M `SMLAD` instruction; benchmark execution speed and verify zero wraparound under extreme overflow.",
    "socraticHints": [
      "What happens when you multiply two Q15 numbers together?",
      "In Q15, multiplying two 16-bit numbers produces a 32-bit result with TWO sign bits (Q30 format)! Value = (A * B) >> 15.",
      "You must shift right by 15 bits and saturate to fit the result back into a 16-bit Q15 container."
    ],
    "situationalPuzzle": {
      "scenario": "An embedded engineer writes a beamforming audio algorithm in C for an ARM Cortex-M4. In quiet rooms, sound localization works flawlessly. But when a door slams, the output audio suddenly crackles with deafening static. Scope captures reveal that positive waveform peaks abruptly inverted into negative maximums. What caused this distortion?",
      "options": [
        "The microphone diaphragm inverted physically.",
        "Fixed-Point Arithmetic Wraparound: The dot-product accumulator used standard int16_t addition without saturation. The loud sound drove the accumulator beyond +32,767, causing integer wraparound to -32,768. Replacing standard additions with CMSIS-DSP saturating SIMD intrinsics (`__QADD16`) eliminates the wraparound.",
        "The Cortex-M4 CPU overheated.",
        "Battery voltage dropped by 1 millivolt."
      ],
      "answerIdx": 1,
      "debrief": "Standard integer arithmetic in C wraps around on overflow: 32767 + 1 = -32768. In audio and sensor DSP, this produces extreme discontinuous square-wave edges (severe clicks and distortion). Saturating math clamps the value at maximum positive (+32767) instead of wrapping, preserving waveform continuity and preventing ML trigger corruption."
    },
    "quests": [
      {
        "num": 1,
        "title": "Q-Format Math & ARM Cortex-M DSP Architecture",
        "type": "Concept",
        "description": "Deconstruct Q7, Q15, Q31 fixed-point fractional representations, saturating instructions (SSAT, QADD), and Cortex-M4/M7 SIMD parallel execution."
      },
      {
        "num": 2,
        "title": "Fixed-Point Overflow & Sign Inversion Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded audio DSP log where high-amplitude gunshots produced inverted waveform peaks; demonstrate how missing saturation caused sign-bit overflow."
      },
      {
        "num": 3,
        "title": "Q15 Vector Math & Saturating Dot-Product Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript Q15 fixed-point math engine featuring float-to-Q15 conversion, saturating addition/multiplication, and SIMD dual-MAC emulation."
      },
      {
        "num": 4,
        "title": "3 AM Bare-Metal Cortex-M DSP Saturation Meltdown Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-priority crash in an industrial acoustic perimeter sensor where loud ambient factory noise triggered unhandled arithmetic overflow exceptions in the DSP pipeline."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: Real-Time CMSIS-DSP Fixed-Point Filter & Radix-4 FFT Acceleration Engine",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Milestone 1 Synthesis (Embedded DSP Acceleration Capstone)",
    "spokenGoal": "Congratulations on completing Block 1. Today you engineer Milestone 1: a production Real-Time CMSIS-DSP Fixed-Point Filter and Radix-4 FFT Acceleration Engine in TypeScript. Your engine brings together the foundational physics of digital signal processing: simulated analog sampling with anti-aliasing low-pass filtering, Q15 fixed-point fractional representation with strict saturating arithmetic, a cascaded Biquad Direct Form II IIR filter, and an in-place Radix-4 FFT with spectral windowing (Hann/Hamming) that extracts frequency spectra in O(N log4 N) operations. Your engine will ingest noisy raw sensor data, filter electrical interference in real time, transform time waveforms into clean frequency bins with zero numerical wraparound, and output validated feature buffers ready for machine learning. This milestone forms the sensory bedrock of your entire TinyML architecture.",
    "conceptInvariant": "End-to-End DSP Pipeline Invariant: Raw digitized sensor data must pass through: (1) Anti-aliasing filtering; (2) Q15 fixed-point conversion with saturating bounds; (3) Cascaded Biquad filtering attenuating out-of-band noise by \u2265 40 dB; and (4) Windowed Radix-4 FFT computation with \u2264 0.1% numerical error relative to double-precision floats.",
    "failureMode": "Allowing intermediate FFT butterfly calculations to accumulate beyond Q15 dynamic range without scaling; butterflies overflow the 16-bit register, corrupting the entire output frequency spectrum into white noise.",
    "tryItFriction": "Execute the Milestone 1 verification suite: feed a synthetic multi-tone vibration signal (50 Hz primary + 120 Hz fault harmonic + 500 Hz noise) through the fixed-point engine; verify that the Biquad filter isolates the 0-150 Hz band; compute the 512-point Radix-4 FFT; assert that the 50 Hz and 120 Hz peaks are cleanly resolved with >35 dB SNR; and verify zero integer wraparound.",
    "socraticHints": [
      "Why is a Radix-4 FFT faster than a Radix-2 FFT on embedded microcontrollers?",
      "Because Radix-4 computes 4 points per butterfly instead of 2, requiring 25% fewer multiplications and half as many memory passes!",
      "CMSIS-DSP uses Radix-4 / Radix-8 for its optimized `arm_rfft_q15` functions to minimize memory bus traffic on ARM Cortex-M."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 1 engine processes vibration data on an embedded ARM microcontroller. During lab testing with low-amplitude vibrations, FFT output matches floating-point ground truth. When tested on a heavy stamping press with large vibration spikes, all FFT bins collapse to 0xFFFF (-1). What fixed-point scaling mechanism was omitted?",
      "options": [
        "The FFT requires 64-bit integer inputs.",
        "Block Floating-Point or Inter-Stage Headroom Scaling: In a 512-point FFT (9 stages of butterflies), additions can grow signal amplitude by up to 9 bits (512x). Without dividing butterfly results by 2 at each stage (headroom scaling) or using block floating-point exponent tracking, large signals overflow fixed-point registers and saturate.",
        "The sampling rate was too high.",
        "The stamping press generates anti-gravity waves."
      ],
      "answerIdx": 1,
      "debrief": "In fixed-point FFTs, each butterfly stage can double signal magnitude. Over log2(N) stages, signal growth easily overflows 16-bit integers. Professional fixed-point FFT implementations divide by 2 at each butterfly stage (conservative scaling) or track dynamic block exponents, guaranteeing numbers remain within [-1.0, 1.0) without saturation."
    },
    "quests": [
      {
        "num": 1,
        "title": "Comprehensive Fixed-Point DSP Pipeline Architecture",
        "type": "Concept",
        "description": "Construct the mathematical architecture document integrating Q15 scaling, Biquad IIR difference equations, Radix-4 FFT butterfly dataflow, and stage-by-stage headroom management."
      },
      {
        "num": 2,
        "title": "Fixed-Point FFT Dynamic Range Collapse Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where high-amplitude sensor bursts caused all Q15 FFT output bins to saturate; pinpoint missing inter-stage scaling factors."
      },
      {
        "num": 3,
        "title": "Milestone 1 CMSIS-DSP Fixed-Point Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 1 Engine featuring Q15 saturating vector math, cascaded Biquad filtering, Hann windowing, and an in-place Radix-4 FFT."
      },
      {
        "num": 4,
        "title": "Milestone 1 Production Stress & Numerical Verification Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 10,000-buffer stress test comparing Milestone 1 fixed-point outputs against IEEE-754 double precision ground truth, proving <0.1% mean error and zero numerical wraparound."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Statistical Time-Domain Feature Extraction: RMS, Crest Factor, Kurtosis & Skewness",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Feature Engineering (Statistical Moments & Vibration Physics)",
    "spokenGoal": "Welcome to Block 2. You cannot feed 10,000 raw time-domain ADC samples directly into an embedded neural network—it would require millions of weights and exhaust MCU SRAM. Instead, we condense thousands of raw samples into a compact feature vector of statistical metrics. Today we master Statistical Time-Domain Feature Extraction for industrial vibration and motion sensors. Deconstruct the essential statistical moments: Root Mean Square (RMS: energy of the vibration, indicating overall mechanical severity); Peak-to-Peak Amplitude (maximum displacement); Crest Factor (ratio of peak amplitude to RMS: in healthy bearings, Crest Factor is ~3.0; when a sharp impact or crack occurs, the peak spikes while RMS barely moves, driving Crest Factor to 6.0+!); Skewness (asymmetry of the probability distribution around the mean); and Kurtosis (the 4th statistical moment, measuring the 'tailedness' of the distribution: normal Gaussian noise has Kurtosis = 3.0; cracked gear teeth create extreme tail events, pushing Kurtosis to 10+!). Master the streaming calculation of these moments using Welford's Algorithm in a single pass!",
    "conceptInvariant": "Statistical Moments & Single-Pass Welford Invariant: Higher-order statistical features (Mean \u03bc, Variance \u03c3^2, Skewness \u03b3_1, Kurtosis \u03b3_2) must be computed in a single streaming pass using Welford's recurrence relations in O(N) time and O(1) memory, preventing catastrophic numerical cancellation in sum-of-squares float calculations.",
    "failureMode": "Calculating variance and kurtosis using the textbook formula \u2211(x_i - \u03bc)^2 where mean \u03bc is computed in a second pass; on embedded float32 systems with large DC offsets, subtracting large nearly-identical numbers triggers catastrophic floating-point cancellation, producing negative variances and NaN kurtosis values.",
    "tryItFriction": "Implement single-pass Welford's Algorithm for Mean, Variance, Skewness, and Kurtosis in TypeScript: take an array of 2,048 accelerometer samples; compute RMS, Crest Factor, Skewness, and Kurtosis in a single loop with O(1) auxiliary memory; inject synthetic shock pulses; verify that Kurtosis jumps from 3.0 (Gaussian noise) to >8.0, and verify zero numerical cancellation error.",
    "socraticHints": [
      "Why is Kurtosis considered the golden metric for detecting early bearing faults?",
      "Because when a bearing ball strikes an early micro-crack, it produces an ultra-brief, high-energy impact spike (a transient pulse)!",
      "RMS barely changes because the spike is so brief. But Kurtosis measures the 4th power of deviations—it is exponentially sensitive to outlier spikes, triggering alerts weeks before failure!"
    ],
    "situationalPuzzle": {
      "scenario": "An offshore oil pump vibration monitor records an average RMS of 2.1 mm/s (well within the ISO 10816 healthy limit of 4.5 mm/s). The pump technician dismisses the alert. However, the TinyML sensor reports a Crest Factor of 8.2 and Kurtosis of 12.4. Two weeks later, the pump bearing catastrophically seizes. Why did RMS miss the impending failure while Kurtosis caught it?",
      "options": [
        "The RMS calculation was mathematically incorrect.",
        "Early Fault Impulsive Dynamics: Early bearing spalls produce narrow, high-amplitude impact spikes. Because their duration is microsecond-brief, their integrated energy (RMS) is negligible. Crest Factor (Peak/RMS) and Kurtosis (4th moment) detect sharp outlier tails, exposing fatigue spalling weeks before overall vibration energy rises.",
        "The pump technician turned off the sensor.",
        "Oil temperature was too cold."
      ],
      "answerIdx": 1,
      "debrief": "This is a fundamental truth of predictive maintenance. RMS measures continuous vibration energy (imbalance, misalignment). Early bearing defects manifest as sharp, brief impact spikes. Because time-averaged RMS dilutes brief spikes, it remains green. Higher-order moments (Kurtosis, Crest Factor) amplify outlier spikes, detecting faults in their infancy."
    },
    "quests": [
      {
        "num": 1,
        "title": "Statistical Time-Domain Moments & Vibration Metrics",
        "type": "Concept",
        "description": "Deconstruct Peak, RMS, Crest Factor, Shape Factor, Impulse Factor, Skewness (3rd moment), and Kurtosis (4th moment) physics."
      },
      {
        "num": 2,
        "title": "Floating-Point Cancellation & NaN Variance Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded firmware crash where a naive two-pass variance calculation on 32-bit floats caused catastrophic numerical cancellation and NaN feature vectors."
      },
      {
        "num": 3,
        "title": "Single-Pass Welford Statistical Feature Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript feature extraction engine implementing single-pass Welford recurrence for Mean, Variance, Skewness, Kurtosis, RMS, and Crest Factor in O(1) space."
      },
      {
        "num": 4,
        "title": "3 AM Refinery Pump Bearing Catastrophe Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an industrial telemetry failure where an early-stage bearing fault went undetected by legacy RMS thresholds, designing a composite Health Index based on Kurtosis and Crest Factor."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Short-Time Fourier Transform (STFT), Hop Size & Time-Frequency Spectrogram Generation",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Time-Frequency Representations (STFT & Spectrogram Generation)",
    "spokenGoal": "A standard FFT tells you WHAT frequencies exist in a signal, but tells you NOTHING about WHEN they occurred. If an audio event says 'FIRE' or an engine knocks, timing is everything! Today we master the Short-Time Fourier Transform (STFT) and Spectrogram Generation. Deconstruct the STFT: take a continuous stream of audio or vibration data; slide a small window of length N_fft (e.g., 256 or 512 samples) across the stream with a fixed Hop Size (overlap, e.g., 50% or 75% overlap); multiply the slice by a Hann window; compute the FFT; and stack the resulting magnitude vectors side-by-side. The result is a 2D Time-Frequency Spectrogram! Master the Heisenberg-Gabor Uncertainty Principle: you cannot have both infinite time resolution and infinite frequency resolution simultaneously (\u0394t * \u0394f \u2265 1 / 4\u03c0). A wide window gives sharp frequency resolution but blurry time timing; a narrow window gives sharp time precision but blurry frequency resolution. Tune window and hop parameters to fit MCU memory!",
    "conceptInvariant": "Heisenberg-Gabor Time-Frequency Trade-off Invariant: In STFT spectrogram generation, time resolution \u0394t = N_fft / f_s and frequency resolution \u0394f = f_s / N_fft satisfy \u0394t * \u0394f = 1, requiring an engineering trade-off: wide windows isolate harmonic lines, narrow windows localize rapid transient impulses.",
    "failureMode": "Configuring an STFT with N_fft = 2,048 samples and hop size = 128 on a Cortex-M4 MCU with 64 KB RAM; allocating a 2D float spectrogram matrix for a 2-second audio clip consumes 256 KB of RAM, triggering an instant HardFault memory overflow.",
    "tryItFriction": "Construct an in-memory streaming STFT spectrogram generator in TypeScript: slide a 256-point Hann window with 128-point hop size over a synthetic audio waveform; compute FFT magnitudes; compress values to 8-bit log-magnitude spectrogram matrices (Log-Mel or decibel scale); verify that transient acoustic clicks appear as sharp vertical lines while steady tones appear as horizontal stripes.",
    "socraticHints": [
      "What is the physical meaning of horizontal stripes vs vertical lines on a spectrogram?",
      "A horizontal stripe represents a continuous frequency tone sustained over time (e.g., a spinning motor shaft at 60 Hz)!",
      "A vertical line represents a sharp, instantaneous broadband impulse across all frequencies at a single point in time (e.g., a hammer strike, gunshot, or spark)!"
    ],
    "situationalPuzzle": {
      "scenario": "An edge AI engineer builds an acoustic gunshot detector for a smart city pole using an STFT-based convolutional neural network. The model misses gunshots because the gunshot's 5 ms transient acoustic crack is smeared across a 100 ms time window. The STFT currently uses N_fft = 2048 at 16 kHz sampling (window duration = 128 ms). What STFT parameter adjustment sharpens temporal resolution?",
      "options": [
        "Increase N_fft to 8,192 samples.",
        "Reduce N_fft to 256 samples (16 ms duration) with a hop size of 64 samples (4 ms): this sacrifices fine frequency resolution but sharpens temporal resolution by 8x, capturing the 5 ms gunshot impulse as a distinct transient feature.",
        "Remove the microphone from the pole.",
        "Invert the FFT phase angles."
      ],
      "answerIdx": 1,
      "debrief": "By the Heisenberg-Gabor principle, time resolution is proportional to window size. A 2,048-sample window at 16 kHz spans 128 ms, smearing a 5 ms transient pulse across the entire block. Reducing N_fft to 256 samples sharpens time resolution to 16 ms, allowing the CNN to clearly detect the sharp temporal rise time of the gunshot."
    },
    "quests": [
      {
        "num": 1,
        "title": "STFT Mathematics & Heisenberg-Gabor Uncertainty",
        "type": "Concept",
        "description": "Deconstruct sliding window formulations, hop size overlap percentages, time-frequency trade-offs, and 2D spectrogram matrix layouts."
      },
      {
        "num": 2,
        "title": "Temporal Smearing & Blurry Transient Detective",
        "type": "Detective Challenge",
        "description": "Analyze an acoustic classification dataset where an excessively wide STFT window blurred brief impact events, causing deep learning models to confuse hammer strikes with continuous hums."
      },
      {
        "num": 3,
        "title": "Streaming STFT & Log-Magnitude Spectrogram Engine",
        "type": "Mastery Assignment",
        "description": "Build an optimized TypeScript streaming STFT engine that processes incoming audio chunks, generates overlapping Hann-windowed FFT slices, and emits quantized 2D spectrogram buffers."
      },
      {
        "num": 4,
        "title": "3 AM Memory HardFault in Edge Vision Spectrogram Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency out-of-memory crash in an industrial acoustic sensor where unconstrained spectrogram buffer allocations exhausted the microcontroller's internal SRAM."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Mel-Scale Filterbanks & Mel-Frequency Cepstral Coefficients (MFCC) for Edge Audio",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Perceptual Feature Engineering (Mel Filterbanks & Cepstral Analysis)",
    "spokenGoal": "While raw spectrograms are great for vision models, human speech and audio recognition rely on a biologically inspired representation: Mel-Frequency Cepstral Coefficients (MFCC). Today we master the MFCC pipeline, the dominant feature extraction standard for Keyword Spotting (KWS) and audio TinyML. Why the Mel scale? The human ear does not perceive pitch linearly; we can easily distinguish 100 Hz from 200 Hz, but struggle to distinguish 10,000 Hz from 10,100 Hz! The Mel scale compresses frequencies logarithmically: Mel(f) = 2595 * log10(1 + f / 700). Trace the 5-step MFCC pipeline: (1) Frame the signal and apply a Hann window; (2) Compute the FFT power spectrum; (3) Apply a bank of triangular overlapping Mel filters (typically 20 to 40 filters), summing energy under each filter; (4) Take the natural logarithm of filterbank energies (compressing dynamic range); (5) Compute the Discrete Cosine Transform (DCT-II) across the log-energies to decorrelate features, keeping the lower 10 to 13 coefficients! The result is a compact 13x50 matrix that captures speech phonemes in under 1 KB of RAM!",
    "conceptInvariant": "MFCC Cepstral Decorrelation Invariant: The Discrete Cosine Transform (DCT-II) decorrelates overlapping Mel filterbank log-energies into an orthogonal cepstral basis: c_n = \u2211_{k=1}^M log(S_k) * cos(\u03c0 * n * (k - 0.5) / M), concentrating >90% of speech phoneme variance into the lowest 10 to 13 cepstral coefficients.",
    "failureMode": "Attempting to feed full 257-bin linear FFT spectra into a keyword spotting neural network on a 32 KB RAM microcontroller; the input layer requires 10x more weights and multiplications, overflowing model memory and doubling inference latency compared to a 13-coefficient MFCC.",
    "tryItFriction": "Build an MFCC feature extractor in TypeScript: construct a triangular Mel filterbank matrix (26 filters from 300 Hz to 8000 Hz); multiply the filterbank by an FFT power spectrum; compute log energies; apply the DCT-II formula to extract 13 cepstral coefficients; verify that distinct audio vowel sounds ('AH' vs 'EE') yield distinct, repeatable MFCC coefficient vectors.",
    "socraticHints": [
      "Why do we take the Discrete Cosine Transform (DCT) at the end of the MFCC pipeline?",
      "Because neighboring triangular Mel filterbanks overlap! This means their energy values are highly correlated.",
      "The DCT acts as a compact, computationally cheap Principal Component Analysis (PCA), decorrelating the filter energies and concentrating phoneme information into the first few coefficients!"
    ],
    "situationalPuzzle": {
      "scenario": "An embedded voice-activated light switch running a TinyML Keyword Spotting model fails to detect female voices and children's voices reliably, while working 98% of the time for adult male voices. The MFCC pipeline currently configures its Mel filterbank from 100 Hz to 3,500 Hz with 20 filters. What audio engineering defect caused this bias?",
      "options": [
        "Female voices use different radio frequencies.",
        "Truncated Mel Filterbank Upper Bandwidth: Female and children's vocal formants (especially F2 and F3) often extend up to 5,000-7,000 Hz. Capping the Mel filterbank at 3,500 Hz clipped critical higher-frequency vowel formants. Expanding the upper frequency limit to 8,000 Hz with 32-40 filters restores high-accuracy detection across all voice registers.",
        "Microphones only pick up low frequencies.",
        "The model requires an internet connection."
      ],
      "answerIdx": 1,
      "debrief": "Human speech formants vary significantly by pitch and physiology. Higher vocal pitch shifts formant frequencies upward. Restricting the upper cutoff of the Mel filterbank to 3.5 kHz discards high-frequency phoneme cues critical for female and child speech. Expanding the upper bound to 8 kHz (Nyquist for 16 kHz audio) restores complete phonetic representation."
    },
    "quests": [
      {
        "num": 1,
        "title": "Mel Scale Physics & MFCC Algorithmic Pipeline",
        "type": "Concept",
        "description": "Deconstruct triangular Mel filterbank construction, log-energy compression, DCT-II decorrelation, and liftering coefficients."
      },
      {
        "num": 2,
        "title": "Filterbank Upper Cutoff Phoneme Clipping Detective",
        "type": "Detective Challenge",
        "description": "Analyze a keyword spotting dataset where high-pitched voices suffered 40% accuracy drops; demonstrate how an improper Mel filterbank frequency range clipped vocal formants."
      },
      {
        "num": 3,
        "title": "Complete Embedded MFCC Feature Extraction Engine",
        "type": "Mastery Assignment",
        "description": "Build a production TypeScript MFCC pipeline that ingests raw 16 kHz PCM audio chunks, executes FFT, applies 32 triangular Mel filters, computes DCT-II, and generates 13-coefficient feature vectors."
      },
      {
        "num": 4,
        "title": "3 AM Smart Assistant Voice Trigger Failure Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-priority edge voice assistant defect where ambient background air-conditioning noise saturated the lowest Mel filterbank bins, triggering continuous false wake-word activations."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Continuous Wavelet Transform (CWT) & Scalograms for Transient Mechanical Faults",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Multi-Resolution Analysis (Wavelet Transforms & Transient Fault Detection)",
    "spokenGoal": "While the STFT uses a fixed window size for all frequencies, what happens when you need ultra-fine time precision for high-frequency transients and ultra-fine frequency resolution for low-frequency rumbles? The Fourier transform hits a fundamental brick wall. The solution is Multi-Resolution Analysis: the Continuous Wavelet Transform (CWT). In CWT, instead of chopping the signal with fixed sine waves, we correlate the signal with a 'mother wavelet' (such as the Morlet or Ricker / Mexican Hat wavelet) that expands and contracts. At low frequencies, the wavelet stretches in time, providing pristine frequency resolution. At high frequencies, the wavelet compresses into a sharp spike, providing microsecond-level time localization! The resulting 2D time-scale representation is called a Scalogram. Today we master Wavelet Scalograms for detecting transient mechanical shocks: cracked gear teeth, electrical arcing, and bearing spall impacts that are completely invisible on standard FFTs.",
    "conceptInvariant": "Wavelet Multi-Resolution Invariant: The CWT decomposes a signal x(t) across scale a and position b using scaled and translated wavelets \u03c8_{a,b}(t) = (1/\u221aa) * \u03c8((t - b)/a), providing variable time-frequency resolution: \u0394t \u221d a (wide time window at low frequencies) and \u0394f \u221d 1/a (narrow time window at high frequencies).",
    "failureMode": "Attempting to compute a continuous 64-scale CWT over 10,000 raw samples on a microcontroller without frequency-domain FFT convolution; computing CWT directly in the time domain requires O(S * N^2) multiplications, freezing the MCU for 45 seconds per buffer.",
    "tryItFriction": "Construct a Morlet Wavelet Scalogram generator in TypeScript: synthesize a Morlet mother wavelet \u03c8(t) = \u03c0^(-1/4) * e^(j\u03c9_0 t) * e^(-t^2 / 2); compute CWT across 16 geometric scales using FFT frequency-domain multiplication; generate a 2D scalogram of an accelerometer signal containing a sharp transient micro-shock; prove that the wavelet scalogram resolves the exact millisecond of the impact.",
    "socraticHints": [
      "Why is a Morlet wavelet so effective for detecting cracked gear teeth?",
      "Because the physical vibration created when a broken gear tooth strikes matches the exact shape of a Morlet wavelet: an oscillating burst modulated by a decaying Gaussian envelope!",
      "Cross-correlating with a matching wavelet acts as a matched filter, maximizing detection SNR!"
    ],
    "situationalPuzzle": {
      "scenario": "An aerospace engineer inspects vibration telemetry from a helicopter gearbox. The gearbox has an early hairline fracture on one gear tooth. An STFT spectrogram shows a blurry horizontal smear across all frequencies. A CWT Morlet Scalogram reveals sharp, periodic vertical spikes repeating exactly at the gear rotation frequency (18.3 Hz). Why did the wavelet transform resolve the crack when the STFT failed?",
      "options": [
        "The STFT was computed using complex numbers while CWT uses real numbers.",
        "Multi-Resolution Time Localization: The tooth impact occurs over 0.8 milliseconds. The STFT's fixed window (50 ms) diluted the transient impact across time. The CWT compressed high-frequency wavelets to sub-millisecond durations, pinpointing the exact impact instant and revealing the periodic tooth-strike signature.",
        "Helicopter rotor blades repel Fourier transforms.",
        "The CWT generated more random noise."
      ],
      "answerIdx": 1,
      "debrief": "The fixed window of an STFT forces a rigid compromise between time and frequency resolution. Sharp impact transients (like gear tooth impacts) last fractions of a millisecond. In an STFT, the long window averages out the spike's energy. The CWT dynamically scales wavelet width, providing sub-millisecond time resolution at high frequencies to capture impulsive fault dynamics."
    },
    "quests": [
      {
        "num": 1,
        "title": "Wavelet Multi-Resolution Theory & Scalogram Mathematics",
        "type": "Concept",
        "description": "Deconstruct mother wavelets (Morlet, Ricker, Daubechies), scale-to-frequency conversions, dilation/translation parameters, and scalogram generation."
      },
      {
        "num": 2,
        "title": "Transient Impact Smearing & STFT Deficit Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial motor test bench dataset where an STFT failed to distinguish an electrical arc from a mechanical knock; demonstrate how CWT scalograms resolved the transient duration."
      },
      {
        "num": 3,
        "title": "Fast Frequency-Domain CWT Scalogram Engine",
        "type": "Mastery Assignment",
        "description": "Build an optimized TypeScript CWT engine that computes multi-scale Morlet wavelet transforms via frequency-domain FFT multiplication, generating 2D scalogram matrices."
      },
      {
        "num": 4,
        "title": "3 AM Helicopter Gearbox Micro-Crack Detection Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency diagnostic challenge where a prototype flight vibration monitor missed periodic gear tooth pitting; deploy CWT scalogram feature extractors to detect impact periodicity."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: Real-Time MFCC Audio & Vibration Spectrogram Feature Extraction Pipeline Engine",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Milestone 2 Synthesis (End-to-End Feature Engineering Capstone)",
    "spokenGoal": "Outstanding achievement reaching Milestone 2. Today you synthesize everything learned across Block 2 to engineer a complete, Real-Time MFCC Audio and Vibration Spectrogram Feature Extraction Pipeline Engine in TypeScript. Your engine combines the full sensory preprocessing suite: single-pass Welford statistical moments (RMS, Crest Factor, Skewness, Kurtosis in O(1) space), streaming STFT log-magnitude spectrogram generation, and a complete 32-filter Mel-Frequency Cepstral Coefficients (MFCC) pipeline with DCT-II decorrelation. Your engine will take raw, high-frequency continuous sensor streams (audio or multi-axis accelerometer data), process chunks in real time, extract normalized feature vectors, and buffer them into compact 2D feature matrices ready for neural network ingestion. This milestone bridges low-level DSP to edge machine learning.",
    "conceptInvariant": "End-to-End Feature Pipeline Invariant: Raw sensor buffers must transform into normalized, bounded feature tensors (Statistical Vector \u2208 \u211d^6, MFCC Tensor \u2208 \u211d^{13 \u00d7 T}) within \u2264 5.0 milliseconds of buffer arrival, consuming \u2264 16 KB of peak heap memory and strictly preserving phonetic and mechanical fault signatures.",
    "failureMode": "Allocating new feature arrays and FFT buffers dynamically on every incoming audio frame; rapid heap churn triggers frequent garbage collection pauses, causing input audio FIFO overruns and dropped sensor frames.",
    "tryItFriction": "Execute the Milestone 2 test harness: instantiate the feature pipeline with pre-allocated static ring buffers; feed a 5-second 16 kHz stream of mixed audio (speech keywords + background factory hum + bearing shock pulses); verify that statistical moments, STFT spectrograms, and MFCC features are extracted concurrently with zero heap allocations during runtime.",
    "socraticHints": [
      "Why must embedded feature extraction pipelines avoid all dynamic heap allocations (`malloc` or `new`) during the streaming loop?",
      "Because on real-time microcontrollers, dynamic memory allocation leads to heap fragmentation and non-deterministic execution times!",
      "If a garbage collection or malloc heap search takes 15 ms, the next audio DMA buffer will overrun, corrupting the audio stream."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 2 feature extraction engine runs on an embedded edge node. Memory profiling shows that the feature extractor consumes 12 KB of RAM while idle, but spikes to 95 KB of RAM during processing because intermediate FFT, Mel filterbank, and DCT matrices are allocated as separate arrays. How must your architecture be refactored for strict 16 KB RAM compliance?",
      "options": [
        "Delete the MFCC pipeline and use only RMS.",
        "Implement Scratchpad In-Place Buffer Reuse: Allocate a single shared static scratchpad buffer (e.g., 4 KB) in memory. The FFT computes in-place inside the scratchpad; the Mel filterbank sums directly into a static 32-float array; and the DCT writes into a static 13-float output, eliminating all intermediate buffer allocations.",
        "Compress the audio using MP3 before processing.",
        "Switch the microcontroller from C to Python."
      ],
      "answerIdx": 1,
      "debrief": "In embedded DSP and TinyML, intermediate buffer sharing is mandatory. Rather than creating separate arrays for raw data, windowed data, complex FFT results, and magnitude spectra, a single scratchpad buffer is reused sequentially across processing stages, slashing peak RAM consumption from 95 KB to under 8 KB."
    },
    "quests": [
      {
        "num": 1,
        "title": "Complete Multi-Modal Feature Extraction Architecture",
        "type": "Concept",
        "description": "Construct the comprehensive system specification unifying Welford statistical moments, streaming STFT spectrograms, and 32-filterbank MFCC pipelines."
      },
      {
        "num": 2,
        "title": "Heap Fragmentation & Audio Buffer Overrun Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded audio firmware crash dump where heap fragmentation during MFCC matrix allocation caused an audio DMA buffer overflow and device reset."
      },
      {
        "num": 3,
        "title": "Milestone 2 Real-Time Feature Extraction Engine",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 2 Engine with zero runtime allocations, pre-allocated scratchpad buffers, statistical moment extractors, and full MFCC pipelines."
      },
      {
        "num": 4,
        "title": "Milestone 2 Production Stress & Latency Verification Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 100,000-frame audio and vibration stress test against the Milestone 2 engine, verifying sub-5ms processing latency, zero heap drift, and strict numerical fidelity."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Constrained Hardware Budgets: Microcontroller Memory (SRAM 32-512KB) & Arithmetic Intensity",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Hardware Physics & Constraints (MCU Memory Hierarchy & Roofline Model)",
    "spokenGoal": "Welcome to Block 3. Today we leave the luxury of cloud servers with gigabytes of RAM and powerful GPUs and enter the brutal reality of Microcontroller Hardware Budgets. A typical TinyML microcontroller (such as an ARM Cortex-M4, Cortex-M33, or ESP32) has only 32 to 512 kilobytes of internal SRAM and 256 kilobytes to 2 megabytes of read-only Flash memory. Deconstruct the Memory Hierarchy: Flash is non-volatile, large, but slow and read-only during execution; SRAM is volatile, blazing fast, but microscopic! Where do model weights live? Model weights must stay in Flash (read-only memory) to preserve precious SRAM for activation tensors! Master the Roofline Model and Arithmetic Intensity: Arithmetic Intensity = Operations (FLOPs) / Memory Accesses (Bytes). On memory-bandwidth-constrained microcontrollers, loading weights from slow flash throttles execution speed. If a neural network is memory-bound rather than compute-bound, adding more CPU clock cycles will NOT make it faster!",
    "conceptInvariant": "MCU Memory Placement & Roofline Invariant: Model static parameters (weights, biases, quant tables) must reside permanently in Flash (ROM), while volatile activation tensors must reside in SRAM, bounded by: Peak_Activation_Memory \u2264 0.70 * Total_SRAM (leaving 30% for RTOS stack and ISRs); execution throughput is bounded by the minimum of compute capacity and memory bus bandwidth.",
    "failureMode": "Copying model weights from Flash into SRAM heap during bootup (`malloc(weights_size)`); a modest 150 KB neural network exhausts the 128 KB MCU SRAM instantly, crashing the device before the first inference runs.",
    "tryItFriction": "Construct an MCU Memory Budget & Roofline Calculator in TypeScript: calculate Flash footprint (weights, code) and SRAM footprint (activations, stack, heap) for a Multi-Layer Perceptron (Dense 64 \u2192 32 \u2192 10); model activation ping-pong buffering; compute arithmetic intensity; and determine whether the layer is memory-bandwidth bound or CPU bound on a 64 MHz Cortex-M4.",
    "socraticHints": [
      "Why should neural network weights NEVER be copied into RAM on microcontrollers?",
      "Because weights are read-only! The microcontroller can read weights directly from Flash (ROM) execute-in-place (XIP) via the internal bus or flash cache.",
      "SRAM is the most scarce resource on the chip and must be reserved strictly for input buffers and changing layer activations!"
    ],
    "situationalPuzzle": {
      "scenario": "A machine learning engineer deploys a 1D Convolutional model for ECG classification on an STM32F4 (128 KB SRAM, 512 KB Flash). The model file is 80 KB. When compiled, the application crashes with a linker error: 'Region RAM overflowed by 32,480 bytes'. The engineer points out that the chip has 128 KB of RAM and the model is only 80 KB. What mistake did the engineer make in the C/C++ code?",
      "options": [
        "The model weights were compiled as random numbers.",
        "Weights Declared Without 'const': The weight arrays were declared as mutable global variables (`float weights[...] = {...};`), causing the linker to place the entire 80 KB into the initialized data (.data) section in RAM! Adding `const` marks them as read-only, moving all 80 KB into Flash (.rodata) and freeing 80 KB of RAM.",
        "STM32 microcontrollers cannot run C code.",
        "The linker required a license key."
      ],
      "answerIdx": 1,
      "debrief": "In embedded C/C++, declaring an array without `const` forces the compiler to allocate it in RAM so it can be modified. For neural network weights, this is fatal. Adding `const` (or `PROGMEM`) instructs the linker to place the data in Flash (.rodata). The MCU executes in-place, reading weights directly from flash without consuming a single byte of precious SRAM."
    },
    "quests": [
      {
        "num": 1,
        "title": "Microcontroller Memory Hierarchy & Roofline Models",
        "type": "Concept",
        "description": "Deconstruct Flash vs SRAM physics, linker memory sections (.text, .rodata, .data, .bss), activation arena sizing, and arithmetic intensity."
      },
      {
        "num": 2,
        "title": "RAM Overflow & Missing Const Weight Detective",
        "type": "Detective Challenge",
        "description": "Audit an embedded TinyML build log where compiling a model overflowed SRAM; identify mutable weight declarations that caused flash-to-RAM bloat."
      },
      {
        "num": 3,
        "title": "TinyML Memory Budget & Roofline Performance Simulator",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript memory profiler that takes model layer definitions, computes exact Flash and SRAM footprints, models ping-pong activation arenas, and evaluates Roofline bounds."
      },
      {
        "num": 4,
        "title": "3 AM Production OOM HardFault on Industrial Gateway Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency bootloader crash in an industrial sensor node where a newly deployed TinyML model expanded activation buffers into the RTOS stack pointer region."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Classical ML on Edge: Decision Trees, Random Forests & Binarized Trees in Fixed-Point C",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Lightweight Machine Learning (Tree Ensembles & Binarized Fixed-Point C)",
    "spokenGoal": "Not every problem requires a complex neural network. For many sensor classification tasks (gesture recognition, simple unbalance, threshold triggers), Classical Machine Learning algorithms like Decision Trees and Random Forests are vastly superior: they execute in microseconds, require almost zero RAM, and can be compiled into pure C `if-else` statements! Today we master Classical ML on Edge. Deconstruct Decision Trees: a trained tree is simply a series of hierarchical threshold tests (`if feature[2] > 4.25 then goto Node_5`). Examine how Random Forests average multiple trees to eliminate overfitting. Master Binarized and Fixed-Point Trees: instead of storing floating-point threshold comparisons, quantize features into 8-bit integers (uint8_t) and compile the entire tree forest into a compact static C lookup table or nested switch-case statements. A 50-tree Random Forest can execute inference in under 20 microseconds and consume less than 2 KB of memory!",
    "conceptInvariant": "Static Tree Compilation & Memory Bounding Invariant: A trained tree ensemble is compiled to native static C `if-else` branching or flat array traversal without recursive function calls, bounding stack depth to O(Tree_Depth) and execution time to deterministic microsecond bounds with zero dynamic memory allocation.",
    "failureMode": "Implementing tree traversal using recursive C functions on a constrained microcontroller; deep trees (depth > 25) combined with nested stack frames cause a silent Stack Overflow, corrupting adjacent RTOS task memory and triggering erratic hardware resets.",
    "tryItFriction": "Build an automated Decision Tree to C code generator in TypeScript: train a small decision tree on a 4-feature synthetic sensor dataset; generate pure C code consisting of flat `if-else` structures with Q15 fixed-point thresholds; compile and run inference; verify that inference execution time is <10 microseconds per sample.",
    "socraticHints": [
      "Why is a compiled Decision Tree faster than a Neural Network for tabular sensor data?",
      "Because a decision tree only evaluates a tiny fraction of its rules! To classify a sample, it evaluates a single path from root to leaf (e.g., 5 `if` comparisons).",
      "A neural network must multiply EVERY weight by EVERY input across all layers regardless of the input data!"
    ],
    "situationalPuzzle": {
      "scenario": "A wearable fitness ring uses a 3-axis accelerometer to classify activities (walking, running, sleeping, typing). The team tests an INT8 Convolutional Neural Network (taking 15 ms and 25 \u03bcJ per inference) versus a 20-tree Random Forest compiled to native C (taking 0.05 ms and 0.1 \u03bcJ per inference). Both achieve 96.5% accuracy. Which model is the correct architectural choice?",
      "options": [
        "The Convolutional Neural Network, because deep learning is newer.",
        "The Compiled Random Forest: Achieving identical accuracy with 250x lower energy consumption (0.1 \u03bcJ vs 25 \u03bcJ) extends the ring's battery life from 2 days to over 2 weeks, while freeing 95% of MCU CPU cycles for other tasks.",
        "Neither, fitness rings must stream all raw data to a phone.",
        "The CNN, because Random Forests cannot run on microcontrollers."
      ],
      "answerIdx": 1,
      "debrief": "A master TinyML architect selects the simplest model that meets accuracy requirements. For low-dimensional statistical feature vectors, compiled tree ensembles often match neural network accuracy while executing orders of magnitude faster and consuming a fraction of the energy. Lower energy translates directly into longer battery life."
    },
    "quests": [
      {
        "num": 1,
        "title": "Decision Tree Compilation & Fixed-Point Branching",
        "type": "Concept",
        "description": "Deconstruct CART tree training, threshold quantization, static C code synthesis, and flat array vs nested branching execution models."
      },
      {
        "num": 2,
        "title": "Recursive Stack Overflow & Heap Corruption Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded firmware crash where a recursive Random Forest traversal blew past a 512-byte FreeRTOS task stack allocation, corrupting adjacent task control blocks."
      },
      {
        "num": 3,
        "title": "Automated Tree-to-C Transpiler & Fixed-Point Engine",
        "type": "Mastery Assignment",
        "description": "Build a TypeScript transpiler that ingests trained decision tree models and generates optimized, non-recursive, fixed-point C inference functions."
      },
      {
        "num": 4,
        "title": "3 AM Wearable Ring Battery Depletion Crisis Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency battery crisis in a commercial smart ring by replacing an oversized neural network with a compiled micro-ensemble, slashing sensor power by 90%."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "K-Means Clustering & Gaussian Mixture Models (GMM) for Edge Anomaly Detection",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Unsupervised Edge ML (Clustering & Anomaly Detection Physics)",
    "spokenGoal": "In industrial IoT, you rarely have labeled training data of catastrophic failures. You don't have 10,000 recordings of a nuclear turbine exploding! You only have data of the machine running normally. How do we detect anomalies without labeled failure data? Enter Unsupervised Edge Anomaly Detection: K-Means Clustering and Gaussian Mixture Models (GMM). Deconstruct K-Means: during baseline operation, the microcontroller clusters normal feature vectors into K healthy centroids in feature space. In production, for every incoming sensor vector, calculate its Euclidean or Mahalanobis Distance to the nearest centroid. If the distance exceeds a calibrated Anomaly Threshold \u03b8, trigger an anomaly alert! Examine Gaussian Mixture Models (GMM): GMM fits multivariate Gaussian distributions with covariance matrices, assigning a continuous likelihood probability to new data points. Master the math of Mahalanobis Distance: D_M(x) = \u221a((x - \u03bc)^T * \u03a3^(-1) * (x - \u03bc)), which accounts for feature correlations!",
    "conceptInvariant": "Mahalanobis Distance & Anomaly Boundary Invariant: An anomaly score is defined as the minimum Mahalanobis distance D_M(x) to any healthy cluster centroid: D_M(x) = \u221a((x - \u03bc_k)^T * \u03a3_k^(-1) * (x - \u03bc_k)); a sample is formally classified as an anomaly if and only if min_k(D_M(x)) > \u03b8_threshold, where \u03b8 is calibrated to a target false-alarm probability (e.g., p < 0.001 under \u03c7^2 distribution).",
    "failureMode": "Using Euclidean distance instead of Mahalanobis distance when features have vastly different scales (e.g., RMS is 2.5 mm/s, Kurtosis is 15.0); Euclidean distance is completely dominated by Kurtosis, leaving the detector completely blind to massive RMS energy shifts.",
    "tryItFriction": "Implement an in-memory K-Means and Mahalanobis Anomaly Detector in TypeScript: generate 500 baseline 2D sensor samples (RMS and Kurtosis); fit K=3 centroids and compute the covariance matrix; invert the covariance matrix; calculate Mahalanobis distance for incoming test points; inject synthetic anomaly points; and verify clean separation with zero false alarms.",
    "socraticHints": [
      "Why is Mahalanobis distance superior to standard Euclidean distance for multi-sensor anomaly detection?",
      "Because sensor features are usually correlated and measured in completely different physical units!",
      "Mahalanobis distance normalizes variance along principal axes and removes cross-sensor correlations, creating an ellipse-shaped decision boundary that matches real physics!"
    ],
    "situationalPuzzle": {
      "scenario": "A factory deploys an anomaly detector on industrial stamping presses using Euclidean distance: D = \u221a((RMS - \u03bc_1)^2 + (Temp - \u03bc_2)^2). Temperature is measured in \u00b0C (nominal 65\u00b0C, variation \u00b115\u00b0C). RMS vibration is in mm/s (nominal 1.2 mm/s, variation \u00b10.1 mm/s). The detector triggers dozens of false alarms every hot afternoon while failing to detect a severe bearing vibration spike. What mathematical error occurred?",
      "options": [
        "The sensor should have used Kelvin instead of Celsius.",
        "Unnormalized Feature Scaling: Temperature numbers (65 \u00b1 15) are 100x larger than RMS numbers (1.2 \u00b1 0.1). In unnormalized Euclidean space, temperature variations completely drown out RMS vibration changes. Normalizing features (Z-score standardization) or using Mahalanobis distance with covariance scaling resolves this instantly.",
        "Euclidean distance cannot be computed in real time.",
        "The factory requires a deep neural network with 50 layers."
      ],
      "answerIdx": 1,
      "debrief": "Unnormalized Euclidean distance is fatally flawed when features have different scales. A 2\u00b0C temperature fluctuation produces an error of (2)^2 = 4, completely overshadowing a catastrophic 0.5 mm/s vibration spike ((0.5)^2 = 0.25). Z-score normalization ((x - \u03bc) / \u03c3) or Mahalanobis distance standardizes variance, giving every sensor dimension equal statistical weight."
    },
    "quests": [
      {
        "num": 1,
        "title": "Unsupervised Anomaly Detection & Mahalanobis Math",
        "type": "Concept",
        "description": "Deconstruct K-Means clustering, Gaussian Mixture Models, covariance matrix inversion, Mahalanobis distance, and Chi-Square anomaly thresholding."
      },
      {
        "num": 2,
        "title": "Unnormalized Feature Dominance Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where ambient summer temperature swings masked mechanical bearing failures in an Euclidean anomaly detection system."
      },
      {
        "num": 3,
        "title": "Mahalanobis Anomaly Detector & Centroid Tracker Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing online centroid updates, covariance calculation, matrix inversion, and real-time Mahalanobis anomaly scoring."
      },
      {
        "num": 4,
        "title": "3 AM False Alarm Storm in Factory Motor Array Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity production incident where 200 factory conveyor motors triggered simultaneous false anomaly alarms due to uncompensated seasonal temperature drift."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Bare-Metal Neural Network Inference: Dense Layers, Fixed-Point Matrix Mult & Activation LUTs",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Bare-Metal Deep Learning (Forward Pass Mechanics without OS)",
    "spokenGoal": "Before we use high-level frameworks like TensorFlow Lite, you must understand how a neural network actually computes on bare-metal silicon with zero operating system. Today we engineer a Bare-Metal Multi-Layer Perceptron (MLP) Forward Pass from scratch. Deconstruct Dense Layer Forward Propagation: y = Activation(W * x + b). Every neuron performs a dot product of weights and inputs plus a bias. In floating-point, this is simple. On bare metal, we implement this in Q15 or INT8 Fixed-Point Arithmetic! Master Activation Functions without floating-point math: ReLU is trivial (clamp negative to 0). But how do you compute Sigmoid (\u03c3(x) = 1 / (1 + e^(-x))) or Tanh without expensive math library calls (`exp()`) that take hundreds of clock cycles? Through Look-Up Tables (LUT)! Precompute a 256-element integer LUT in Flash and interpolate linearly, computing non-linear activations in a blistering 3 clock cycles!",
    "conceptInvariant": "Forward Pass Determinism & Activation LUT Invariant: In bare-metal neural inference, layer execution follows: y_i = LUT_Activation(clamp((\u2211 W_{ij} * x_j + b_i) >> Shift, Min, Max)); all non-linear activation functions (Sigmoid, Tanh, GELU) are evaluated via static pre-computed Flash LUTs in O(1) time without transcendental math calls.",
    "failureMode": "Calling standard C library `expf()` and `powf()` inside an embedded neural network loop; the software emulation of transcendental functions consumes 150 clock cycles per neuron, causing audio frame drops on microcontrollers without hardware FPU.",
    "tryItFriction": "Construct a bare-metal 3-layer neural network inference engine in TypeScript: define a 256-element Q15 Sigmoid Look-Up Table; implement fixed-point matrix multiplication with intermediate 32-bit accumulation; pass a test input through a Dense(16 \u2192 8 \u2192 2) network; verify that output matches floating-point ground truth within 0.5% while using zero transcendental math calls.",
    "socraticHints": [
      "Why is a 256-entry Look-Up Table (LUT) sufficient for non-linear activations like Sigmoid?",
      "Because outside the range [-4.0, +4.0], Sigmoid saturates completely at 0.0 or 1.0!",
      "Mapping the active region [-4.0, +4.0] to a 256-byte array in Flash provides excellent resolution, and linear interpolation between adjacent entries yields >99.9% accuracy!"
    ],
    "situationalPuzzle": {
      "scenario": "A firmware engineer implements a multilayer neural network on an ARM Cortex-M0+ (no FPU). To classify audio every 20 ms, the MCU must evaluate 500 neurons with Sigmoid activations. The inference takes 38 ms, blowing past the 20 ms real-time deadline. Profiling shows that 80% of CPU time is spent inside `expf()`. How does the engineer reduce inference time to <5 ms?",
      "options": [
        "Overclock the Cortex-M0+ until it burns out.",
        "Replace `expf()` with a pre-computed 256-entry integer Look-Up Table (LUT) in Flash with piecewise linear interpolation (or switch to ReLU activations), dropping activation latency from 150 clock cycles to 3 clock cycles per neuron.",
        "Switch the microcontroller to an x86 server processor.",
        "Invert the network weights."
      ],
      "answerIdx": 1,
      "debrief": "On microcontrollers without hardware FPUs, calling transcendental functions (`exp`, `sin`, `sqrt`) invokes slow software emulation libraries that take hundreds of cycles per call. Replacing `expf()` with an integer LUT in flash (or using cheap piecewise linear activations like ReLU) slashes activation latency by 98%, effortlessly meeting real-time deadlines."
    },
    "quests": [
      {
        "num": 1,
        "title": "Bare-Metal Forward Propagation & LUT Approximation",
        "type": "Concept",
        "description": "Deconstruct matrix multiplication dataflow, bias addition, fixed-point scaling, and piecewise linear/LUT activation approximations."
      },
      {
        "num": 2,
        "title": "Transcendental Math Bottleneck & Deadline Miss Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded CPU trace where `expf()` software emulation consumed 80% of inference time, causing sensor buffer overflow."
      },
      {
        "num": 3,
        "title": "Bare-Metal Fixed-Point Neural Network Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript bare-metal inference engine executing multi-layer dense networks using Q15 fixed-point arithmetic and precomputed Sigmoid/Tanh LUTs."
      },
      {
        "num": 4,
        "title": "3 AM Microcontroller Audio Keyword Latency Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a real-time deadline violation in an ultra-low-power voice remote by converting a floating-point neural inference pipeline to integer LUT operations."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: Bare-Metal Fixed-Point Neural Network & Classical ML Inference Engine",
    "stageName": "Stage 1: DSP & Feature Foundations",
    "stageNum": 1,
    "pedagogicalRole": "Milestone 3 Synthesis (Embedded ML Inference Core Capstone)",
    "spokenGoal": "Congratulations on reaching Milestone 3. Today you synthesize everything learned across Block 3 to engineer a production Bare-Metal Fixed-Point Neural Network and Classical ML Inference Engine in TypeScript. Your engine combines two distinct, highly optimized edge inference paradigms: First, a bare-metal Fixed-Point Neural Network runtime executing dense matrix multiplications with Q15 saturating math, intermediate 32-bit accumulators, and Flash-resident activation Look-Up Tables (LUTs) with zero dynamic memory allocation. Second, a compiled Classical Machine Learning engine featuring a non-recursive Decision Tree ensemble and an unsupervised Mahalanobis Distance Anomaly Detector. Your engine will ingest live multi-dimensional feature vectors, evaluate anomaly distance in O(1) space, execute neural and tree inference concurrently, and output classification probabilities in under 1 millisecond. This milestone proves your mastery of low-level embedded inference before we step into INT8 quantization.",
    "conceptInvariant": "End-to-End Bare-Metal Inference Invariant: The inference engine must execute: (1) Zero heap allocation (`malloc` or `new`) during inference; (2) Pure integer / fixed-point operations with saturating overflow protection; (3) Deterministic latency \u2264 1.0 ms on simulated 64 MHz MCU; and (4) Combined classical tree and neural model validation with \u2265 98% concordance with float ground truth.",
    "failureMode": "Failing to clear the accumulator register between layer outputs; residual bias from previous neuron calculations bleeds into the next neuron, causing output probabilities to drift uncontrollably.",
    "tryItFriction": "Execute the Milestone 3 test suite: instantiate the dual inference engine; load a pre-trained 3-layer neural network and a 10-tree Random Forest; feed 1,000 synthetic sensor vectors; benchmark execution latency; verify that output predictions match floating-point ground truth within 0.2%; and assert zero memory allocations during inference loops.",
    "socraticHints": [
      "Why is a dual architecture (combining an unsupervised anomaly detector with a classifier) the gold standard for industrial IoT?",
      "Because the anomaly detector acts as a safety gate! It flags whether the incoming data looks normal or abnormal.",
      "If normal, the classifier identifies the operational state. If abnormal, the anomaly detector catches novel failure modes that the classifier was never trained on!"
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 3 inference engine is deployed on a simulated industrial conveyor. A mechanical bolt snaps, producing an unprecedented vibration pattern never seen during training. The supervised classifier outputs 'State: NORMAL (Confidence: 91%)'. However, your Mahalanobis Anomaly Detector outputs 'Distance: 14.8 (Threshold: 3.5) -> ANOMALY DETECTED'. How must your engine arbitrate this conflicting output?",
      "options": [
        "Trust the classifier and ignore the anomaly detector.",
        "Unsupervised Anomaly Preemption: The anomaly detector takes precedence! Supervised classifiers suffer from 'overconfident extrapolation' on out-of-distribution (OOD) data. Because Mahalanobis distance proves the data is far outside the healthy training manifold, the engine must flag an 'UNKNOWN NOVEL ANOMALY' and trigger a safety alert.",
        "Reboot the microcontroller.",
        "Average the confidence score with the distance."
      ],
      "answerIdx": 1,
      "debrief": "Neural networks and decision trees are notorious for outputting high confidence on inputs that look nothing like their training data (out-of-distribution failure). Combining a supervised classifier with an unsupervised density/anomaly gate (Mahalanobis distance) is essential. If the anomaly score exceeds threshold, the sample is out-of-distribution and the classifier's output must be rejected."
    },
    "quests": [
      {
        "num": 1,
        "title": "Dual-Paradigm Embedded Inference Architecture",
        "type": "Concept",
        "description": "Construct the formal architecture specification unifying bare-metal fixed-point neural networks, compiled tree ensembles, and Mahalanobis anomaly gating."
      },
      {
        "num": 2,
        "title": "Accumulator Bleed & Out-of-Distribution Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded C inference bug where failure to clear a 32-bit accumulator register caused neuron activations to bleed across layers, triggering false positives."
      },
      {
        "num": 3,
        "title": "Milestone 3 Bare-Metal Inference Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 3 Engine featuring zero-allocation Q15 neural inference, LUT activations, compiled decision trees, and Mahalanobis anomaly scoring."
      },
      {
        "num": 4,
        "title": "Milestone 3 Production Stress & Concurrency Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 50,000-sample stress campaign against the Milestone 3 engine simulating real-time sensor bursts, verifying zero heap drift, sub-millisecond execution, and 100% OOD anomaly capture."
      }
    ]
  }
]
