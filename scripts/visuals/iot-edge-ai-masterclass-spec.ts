// scripts/visuals/iot-edge-ai-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Edge AI, DSP & TinyML Systems (course-iot-edge-ai)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, ADC Physics & Nyquist-Shannon,
// CMSIS-DSP SIMD & Fixed-Point Math, STFT/MFCC Spectral Pipelines, Classical Edge ML & TinyML Quantization (INT8 PTQ/QAT),
// TFLM Static Tensor Arenas, CMSIS-NN Kernel Acceleration, Micro-Vision DVP/FOMO, Digital Audio PDM/Beamforming,
// MicroTVM / TinyEngine AOT NPU Compilation, Micro-Transformers & Linear Attention, Dilated Causal TCNs,
// State-Space Models (S4/Mamba O(1) Recurrent Memory), On-Device Continual Learning (EWC & Experience Replay),
// Streaming Drift Detection (PSI / KS-Test), and Differential Model FOTA.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const EDGE_AI_MONTH_1_SPECS: MasterclassDaySpec[] = [
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
    "spokenGoal": "To detect machine anomalies, speech phonemes, or acoustic events, time-domain waveforms alone are rarely enough. We must translate time into frequency. Master the Discrete Fourier Transform (DFT) and its algorithmic breakthrough: the Fast Fourier Transform (FFT). While naive DFT requires O(N^2) complex multiplications (prohibitive on microcontrollers!), the Cooley-Tukey Radix-2 FFT exploits butterfly symmetry to reduce complexity to O(N log2 N). For N = 1024 samples, operations drop from 1,048,576 down to only 10,240\u2014a 100x computational speedup! Master Spectral Leakage: because the FFT assumes a finite block of time repeats infinitely, sharp discontinuities at block edges cause energy to spill across the entire spectrum. Solve this with Spectral Windowing: multiplying the time-domain signal by a smooth window function (Hann, Hamming, Blackman-Harris) before computing the FFT, attenuating edge discontinuities and suppressing side lobes by up to 92 dB!",
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
    "spokenGoal": "Welcome to Block 2. You cannot feed 10,000 raw time-domain ADC samples directly into an embedded neural network\u2014it would require millions of weights and exhaust MCU SRAM. Instead, we condense thousands of raw samples into a compact feature vector of statistical metrics. Today we master Statistical Time-Domain Feature Extraction for industrial vibration and motion sensors. Deconstruct the essential statistical moments: Root Mean Square (RMS: energy of the vibration, indicating overall mechanical severity); Peak-to-Peak Amplitude (maximum displacement); Crest Factor (ratio of peak amplitude to RMS: in healthy bearings, Crest Factor is ~3.0; when a sharp impact or crack occurs, the peak spikes while RMS barely moves, driving Crest Factor to 6.0+!); Skewness (asymmetry of the probability distribution around the mean); and Kurtosis (the 4th statistical moment, measuring the 'tailedness' of the distribution: normal Gaussian noise has Kurtosis = 3.0; cracked gear teeth create extreme tail events, pushing Kurtosis to 10+!). Master the streaming calculation of these moments using Welford's Algorithm in a single pass!",
    "conceptInvariant": "Statistical Moments & Single-Pass Welford Invariant: Higher-order statistical features (Mean \u03bc, Variance \u03c3^2, Skewness \u03b3_1, Kurtosis \u03b3_2) must be computed in a single streaming pass using Welford's recurrence relations in O(N) time and O(1) memory, preventing catastrophic numerical cancellation in sum-of-squares float calculations.",
    "failureMode": "Calculating variance and kurtosis using the textbook formula \u2211(x_i - \u03bc)^2 where mean \u03bc is computed in a second pass; on embedded float32 systems with large DC offsets, subtracting large nearly-identical numbers triggers catastrophic floating-point cancellation, producing negative variances and NaN kurtosis values.",
    "tryItFriction": "Implement single-pass Welford's Algorithm for Mean, Variance, Skewness, and Kurtosis in TypeScript: take an array of 2,048 accelerometer samples; compute RMS, Crest Factor, Skewness, and Kurtosis in a single loop with O(1) auxiliary memory; inject synthetic shock pulses; verify that Kurtosis jumps from 3.0 (Gaussian noise) to >8.0, and verify zero numerical cancellation error.",
    "socraticHints": [
      "Why is Kurtosis considered the golden metric for detecting early bearing faults?",
      "Because when a bearing ball strikes an early micro-crack, it produces an ultra-brief, high-energy impact spike (a transient pulse)!",
      "RMS barely changes because the spike is so brief. But Kurtosis measures the 4th power of deviations\u2014it is exponentially sensitive to outlier spikes, triggering alerts weeks before failure!"
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
  },
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Model Quantization Fundamentals: FP32 to INT8 Mapping, Scale, Zero-Point & Dynamic Range",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Model Compression & Integer Arithmetic (Quantization Mathematics)",
    "spokenGoal": "Welcome to Block 4. A 32-bit floating-point neural network is a memory monster: each parameter consumes 4 bytes, and floating-point math on microcontrollers drains battery life. How do we shrink models by 75% and multiply inference speed by 4x with virtually zero loss in accuracy? Enter INT8 Model Quantization. Master the affine quantization mapping: real value r is approximated by integer q using scale S and zero-point Z: r \u2248 S * (q - Z). Conversely, q = clamp(round(r / S) + Z, q_min, q_max). Contrast Symmetric Quantization (where zero-point Z = 0, clamping to [-127, 127], ideal for zero-centered weights) versus Asymmetric Quantization (where Z \u2260 0, mapping [r_min, r_max] to [0, 255] or [-128, 127], essential for one-sided activations like ReLU). Deconstruct how two INT8 tensors multiply: the product of scales (S_1 * S_2 / S_out) is decomposed into a fixed-point multiplier M_0 and bit shift: M = 2^(-n) * M_0, computing the entire matrix multiplication using pure 32-bit integer arithmetic!",
    "conceptInvariant": "Affine Integer Quantization Invariant: Every continuous real tensor r \u2208 [r_min, r_max] is losslessly bounded by the quantization affine relation: r = S * (q - Z), where scale S = (r_max - r_min) / (q_max - q_min) and zero-point Z = round((0 - r_min) / S) + q_min, guaranteeing that real zero is represented exactly by integer Z.",
    "failureMode": "Performing symmetric quantization on one-sided ReLU activations (where all values \u2265 0); mapping [0.0, r_max] to [-128, 127] wastes half of the entire 8-bit dynamic range (128 negative buckets remain completely unused), doubling quantization noise and degrading classification accuracy.",
    "tryItFriction": "Build an FP32 to INT8 quantizer and dequantizer in TypeScript: take an array of floating-point weights [-2.4, 3.8, 0.0, -1.1, 4.2]; compute scale S and zero-point Z for both symmetric and asymmetric modes; quantize to signed int8 (-128 to 127); dequantize back to float; compute Mean Squared Error (MSE); and verify that real 0.0 maps exactly to integer Z.",
    "socraticHints": [
      "Why MUST real zero (0.0) map to an exact integer (Zero-Point Z) in quantization?",
      "Because neural networks are filled with zero padding and ReLU zeros!",
      "If 0.0 mapped to a fractional float like 3.42, every single zero in an image or padded tensor would introduce systematic numerical bias and error during convolution!"
    ],
    "situationalPuzzle": {
      "scenario": "An AI developer quantizes an image classification model from FP32 to INT8 using symmetric quantization across the entire network. Weight quantization causes zero accuracy drop. However, quantizing the post-ReLU activation tensors causes accuracy to plunge from 94% to 68%. What caused the catastrophic activation quantization error?",
      "options": [
        "The image resolution was too high.",
        "Symmetric Dynamic Range Waste on Non-Negative Activations: Post-ReLU activations are strictly non-negative ([0, a_max]). Symmetric quantization centers the integer range around zero ([-128, 127]), wasting all 128 negative integer states. Asymmetric quantization (mapping [0, a_max] to [0, 255] with Z \u2248 0) restores the full 8-bit resolution, recovering 94% accuracy.",
        "INT8 quantization is incompatible with convolutional layers.",
        "The microcontroller crystal oscillator drifted."
      ],
      "answerIdx": 1,
      "debrief": "Symmetric quantization forces zero-point Z = 0, mapping symmetric ranges [-M, M]. For post-ReLU activations where all numbers are non-negative, symmetric quantization forces the range to [-a_max, a_max]. This wastes half the available 256 quantization levels on non-existent negative numbers, coarsening quantization step size and devastating accuracy. Activations must use asymmetric quantization."
    },
    "quests": [
      {
        "num": 1,
        "title": "Affine Quantization Mathematics & Scale/Zero-Point Derivation",
        "type": "Concept",
        "description": "Deconstruct symmetric vs asymmetric quantization formulas, real zero exact representation, integer dot-product scaling, and fixed-point multiplier decomposition."
      },
      {
        "num": 2,
        "title": "Quantization Range Truncation & Activation Collapse Detective",
        "type": "Detective Challenge",
        "description": "Analyze an INT8 quantized model evaluation report where post-ReLU layer activations lost 50% dynamic range; prove the benefits of asymmetric zero-point mapping."
      },
      {
        "num": 3,
        "title": "FP32-to-INT8 Quantization & Matrix Multiplication Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine that calculates dynamic range scales and zero-points, quantizes float tensors, and executes pure INT8 matrix multiplications with integer scaling."
      },
      {
        "num": 4,
        "title": "3 AM Industrial Vibration Model Accuracy Collapse Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency deployment bug where an industrial motor classifier dropped 25% accuracy upon INT8 export; diagnose outlier weight clamping and apply per-channel quantization."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT) & Calibration Data",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Quantization Workflows (Calibration Datasets & QAT Training Loops)",
    "spokenGoal": "How do we decide the exact scale S and zero-point Z for every layer in a complex neural network? Compare the two dominant paradigms: Post-Training Quantization (PTQ) versus Quantization-Aware Training (QAT). In PTQ, you take a pre-trained FP32 model and pass a small Representative Calibration Dataset (typically 100 to 500 unlabeled real-world sensor samples) through the network. As samples flow through, the calibration engine records the minimum and maximum activations at every layer, freezing the optimal scale and zero-point parameters without retraining! PTQ is fast and requires zero GPU retraining. But what if weights are sensitive and PTQ drops accuracy? Then we invoke Quantization-Aware Training (QAT). During QAT training, we insert 'FakeQuant' nodes that simulate 8-bit rounding noise in the forward pass. Using the Straight-Through Estimator (STE) to backpropagate gradients through non-differentiable rounding, the network adapts its weights to be resilient to 8-bit precision!",
    "conceptInvariant": "Straight-Through Estimator (STE) Gradient Invariant: In Quantization-Aware Training (QAT), the non-differentiable rounding operator q = round(x) is bypassed during backpropagation using the Straight-Through Estimator: \u2202q / \u2202x = 1 for x \u2208 [q_min, q_max] (and 0 otherwise), enabling gradient descent weight optimization under simulated INT8 noise.",
    "failureMode": "Calibrating a PTQ model using synthetic random noise instead of representative real-world sensor data; random noise fails to activate normal operational pathways, producing wildly inaccurate activation scale factors that ruin model performance in the field.",
    "tryItFriction": "Construct a PTQ calibration engine and QAT FakeQuant node in TypeScript: pass 200 representative sensor samples through a simulated 3-layer network; record activation min/max histograms; compute KL divergence to find optimal clipping thresholds; implement the Straight-Through Estimator (STE) forward/backward pass; and demonstrate that QAT recovers 100% of baseline FP32 accuracy.",
    "socraticHints": [
      "Why can't standard backpropagation calculate gradients through the `round()` function?",
      "Because the derivative of a step/round function is ZERO everywhere (and undefined at integer boundaries)! If the gradient is zero, weights cannot learn.",
      "The Straight-Through Estimator (STE) simply pretends the derivative is 1.0 during backpropagation, passing gradients straight through to the underlying floating-point weights!"
    ],
    "situationalPuzzle": {
      "scenario": "A medical device company quantizes an audio wheeze detection model for asthmatic patients. PTQ drops model sensitivity from 95% to 78% due to extreme outliers in acoustic burst activations. Retraining with standard FP32 does not fix the issue. How does the machine learning pipeline eliminate this 17% accuracy drop without increasing model memory?",
      "options": [
        "Double the audio sampling frequency to 96 kHz.",
        "Implement Quantization-Aware Training (QAT) with FakeQuant nodes and Straight-Through Estimator: by exposing the neural network weights to 8-bit rounding noise during backpropagation, the optimizer learns weight distributions that are robust to integer quantization, restoring 95% sensitivity in the final INT8 export.",
        "Deploy the model on an unquantized cloud server.",
        "Increase the number of output classes."
      ],
      "answerIdx": 1,
      "debrief": "When Post-Training Quantization (PTQ) degrades accuracy due to sensitive activation distributions, Quantization-Aware Training (QAT) is the gold standard solution. QAT incorporates quantization noise into the training objective, forcing the optimizer to find flat minima in weight space that tolerate 8-bit rounding, closing the accuracy gap."
    },
    "quests": [
      {
        "num": 1,
        "title": "PTQ vs QAT Algorithmic Workflows & STE Mathematics",
        "type": "Concept",
        "description": "Deconstruct representative dataset calibration, KL divergence thresholding, FakeQuant forward/backward mechanics, and STE gradient flow."
      },
      {
        "num": 2,
        "title": "Unrepresentative Calibration Data Corruption Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated TinyML export pipeline where calibrating on zero-padded silence caused activation scales to collapse, blinding an audio wake-word detector."
      },
      {
        "num": 3,
        "title": "PTQ Histogram Calibrator & QAT STE Simulation Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing activation histogram collection, KL-divergence clipping, and a QAT training loop with Straight-Through Estimators."
      },
      {
        "num": 4,
        "title": "3 AM Medical Wheeze Detector Accuracy Plunge Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency clinical accuracy drop in a wearable respiratory monitor by migrating an unstable PTQ model to a Quantization-Aware Training pipeline."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Weight Pruning & Sparsity: Magnitude Pruning, Structured Channel Pruning & CSR Storage",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Model Compression (Sparsity & Structured Pruning)",
    "spokenGoal": "Even after INT8 quantization shrinks a model by 4x, can we compress it further? Yes: through Weight Pruning and Sparsity. Up to 60-80% of weights in a deep neural network are virtually useless, contributing near-zero impact on the final output! Contrast the two fundamental pruning paradigms: Unstructured Pruning vs Structured Pruning. In Unstructured Magnitude Pruning, you set any individual weight with |w| < \u03b5 to exact zero. While this produces high sparsity (e.g., 80% zeros), standard microcontrollers cannot accelerate random sparse matrices without special sparse storage like Compressed Sparse Row (CSR) or Compressed Sparse Column (CSC), which add index overhead. In contrast, Structured Pruning (Channel / Filter Pruning) removes ENTIRE convolutional filters or dense neurons! Because entire rows or channels are physically deleted, the resulting model is simply a smaller standard dense matrix, achieving genuine 2x-4x hardware speedups and RAM savings on ANY standard microcontroller!",
    "conceptInvariant": "Structured Pruning Hardware Acceleration Invariant: While unstructured pruning requires sparse index overhead (CSR/CSC), structured channel pruning physically removes entire filter slices W_{c,:,:,:} \u2192 0, reducing layer MAC operations and activation memory by exactly \u0394Ops = (1 - C_pruned / C_total), delivering direct linear hardware speedup on unspecialized SIMD architectures.",
    "failureMode": "Deploying an 80% unstructured pruned model on a basic ARM Cortex-M4 expecting an 80% speedup; because the CPU lacks sparse matrix hardware acceleration, decoding CSR sparse indices in software actually makes inference 30% SLOWER than the unpruned dense model!",
    "tryItFriction": "Construct a Weight Pruner and CSR Sparse Matrix Compressor in TypeScript: take a 64x64 weight matrix; apply magnitude pruning to achieve 75% sparsity; compress the matrix into Compressed Sparse Row (CSR) format (values, column_indices, row_pointers); measure memory footprint savings; implement a structured channel pruner that removes the lowest-L1-norm filters; and verify dense hardware acceleration.",
    "socraticHints": [
      "Why does unstructured pruning fail to speed up inference on standard microcontrollers like Cortex-M4?",
      "Because standard CPUs execute dense vector SIMD instructions (like `SMLAD`) that multiply consecutive numbers in memory!",
      "If 80% of numbers are zeros scattered at random locations, the CPU must execute branching or pointer chasing to find the non-zero values, destroying pipeline efficiency!"
    ],
    "situationalPuzzle": {
      "scenario": "A firmware team needs to cut execution latency of a 1D-CNN motor vibration classifier by 50% on an ARM Cortex-M33. The data science team delivers an '85% sparse pruned model' using unstructured magnitude pruning. Benchmarks show the pruned model runs at the EXACT SAME speed as the original unpruned model. What architectural change realizes the 50% speedup?",
      "options": [
        "Increase the pruning target to 99% unstructured sparsity.",
        "Switch to Structured Channel/Filter Pruning: Instead of zeroing individual weights at random, prune 50% of the least important convolutional filters entirely. The resulting network is physically smaller with half the channels, cutting multiplications and memory access by 50% on standard dense CPU hardware.",
        "Add an external cooling fan to the microcontroller.",
        "Convert the model back to 32-bit floats."
      ],
      "answerIdx": 1,
      "debrief": "Unstructured sparsity does not accelerate standard CPUs without dedicated sparse tensor hardware. The CPU still computes 0 * x or spends cycles checking indices. Structured channel pruning removes entire filters, reducing matrix dimensions. A dense kernel with 16 channels instead of 32 executes twice as fast on standard Cortex-M SIMD hardware."
    },
    "quests": [
      {
        "num": 1,
        "title": "Weight Pruning Mechanics & Sparse Matrix Formats",
        "type": "Concept",
        "description": "Deconstruct L1/L2 magnitude pruning, iterative pruning with fine-tuning, structured channel pruning, and CSR/CSC memory layouts."
      },
      {
        "num": 2,
        "title": "Unstructured Sparsity Performance Deficit Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded benchmark showing zero execution speedup on a 75% sparse model; prove why index decoding overhead nullified FLOP reductions."
      },
      {
        "num": 3,
        "title": "Structured Channel Pruning & CSR Compression Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing both unstructured CSR compression and structured filter pruning based on L1-norm rankings."
      },
      {
        "num": 4,
        "title": "3 AM Industrial Vision Model Latency Deadline Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a camera pipeline bottleneck where an object detection model missed a 30 FPS deadline; apply structured channel pruning to slash latency from 45 ms to 22 ms."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Knowledge Distillation for Microcontrollers: Teacher-Student Networks & Temperature Scaling",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Model Compression (Dark Knowledge Transfer & Teacher-Student Training)",
    "spokenGoal": "How can a tiny 5-layer micro-neural network achieve the sophisticated accuracy of a giant 50-layer ResNet? Enter Knowledge Distillation. Proposed by Geoffrey Hinton, knowledge distillation trains a compact 'Student Network' (sized for a microcontroller) to mimic a giant, high-capacity 'Teacher Network' (trained on a cloud GPU). Deconstruct Temperature Scaling: when a teacher model outputs class probabilities using standard Softmax (T = 1), it outputs [0.99, 0.009, 0.001]. Hard labels throw away all rich structural information! By raising Temperature T (e.g., T = 4 to 10): q_i = exp(z_i / T) / \u2211 exp(z_j / T), the output distribution softens, exposing 'Dark Knowledge' (e.g., the teacher reveals that a particular dog shares 15% acoustic similarity with a wolf and 0.001% with a car!). The student network learns to match both the hard ground-truth labels and the teacher's softened dark knowledge probabilities, achieving 95% of teacher accuracy at 5% of the memory footprint!",
    "conceptInvariant": "Knowledge Distillation Loss & Temperature Invariant: The student network is trained using a composite loss: L = \u03b1 * L_{CE}(y_{true}, \u03c3(z_s)) + (1 - \u03b1) * T^2 * L_{KL}(\u03c3(z_t / T), \u03c3(z_s / T)), where T^2 scaling preserves gradient magnitudes as temperature T softens logit probability distributions.",
    "failureMode": "Forgetting to scale the distillation loss by T^2 when training with high temperature (T = 5); the gradients from the soft distillation term shrink by 1/T^2 = 1/25th, causing the student to ignore the teacher and learn only from hard labels.",
    "tryItFriction": "Implement Knowledge Distillation in TypeScript: take a Teacher Network logit vector [6.0, 2.5, -1.0]; compute softened probabilities at T = 1, T = 3, and T = 8; compute KL divergence loss between teacher and student softened logits; scale gradients by T^2; and demonstrate that the student learns subtle cross-class similarities invisible in hard one-hot labels.",
    "socraticHints": [
      "Why is multiplying the distillation loss by T^2 mathematically required?",
      "Because when temperature T increases, the logits z / T shrink!",
      "The derivative of softened softmax with respect to logits scales inversely with T^2 (\u2202p / \u2202z \u221d 1/T^2). Multiplying by T^2 keeps gradient magnitudes consistent regardless of temperature!"
    ],
    "situationalPuzzle": {
      "scenario": "An AI team needs to deploy an audio acoustic event classifier on a microcontroller with only 48 KB RAM. Training a small 3-layer model directly from scratch yields poor accuracy (71%). However, a cloud-grade 18-layer ResNet achieves 94% accuracy. The team uses the ResNet as a Teacher to distill knowledge into the 3-layer Student model at T = 5. What accuracy does the distilled 3-layer model achieve?",
      "options": [
        "Accuracy drops to 10% because the student is overwhelmed.",
        "Accuracy jumps to 89-91%: The student absorbs the teacher's soft probability distributions (dark knowledge), capturing complex feature correlations that a small model cannot discover from hard one-hot labels alone, fitting into 35 KB RAM.",
        "The student model expands to 18 layers automatically.",
        "Microcontrollers cannot run distilled models."
      ],
      "answerIdx": 1,
      "debrief": "Knowledge distillation is one of the most powerful techniques in TinyML. Small models trained directly on hard labels often get stuck in sub-optimal local minima. Learning from a softened teacher distribution guides the student along the teacher's smooth manifold, allowing tiny micro-models to capture near-cloud performance within embedded RAM budgets."
    },
    "quests": [
      {
        "num": 1,
        "title": "Knowledge Distillation Theory & Temperature Scaling Math",
        "type": "Concept",
        "description": "Deconstruct soft targets, temperature scaling formulas, KL divergence loss, dark knowledge transfer, and T^2 gradient normalization."
      },
      {
        "num": 2,
        "title": "Missing T^2 Scaling Gradient Vanishing Detective",
        "type": "Detective Challenge",
        "description": "Analyze a distillation training log where increasing temperature to T=10 caused student learning to stall; pinpoint missing T^2 loss weighting that starved gradients."
      },
      {
        "num": 3,
        "title": "Teacher-Student Distillation & Softmax Temperature Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing temperature-scaled Softmax, composite cross-entropy/KL distillation loss, and student weight optimization."
      },
      {
        "num": 4,
        "title": "3 AM Factory Audio Classifier Compression Lab",
        "type": "Production Incident Lab",
        "description": "Compress an unwieldy 15 MB industrial acoustic classifier into a 45 KB microcontroller model using teacher-student distillation, preserving 92% anomaly detection accuracy."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: INT8 Post-Training Quantization & Structured Pruning Optimization Engine",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Milestone 4 Synthesis (Model Compression Pipeline Capstone)",
    "spokenGoal": "Outstanding achievement reaching Milestone 4. Today you engineer Milestone 4: a production INT8 Post-Training Quantization and Structured Pruning Optimization Engine in TypeScript. Your engine brings together the full model compression pipeline: automated representative dataset calibration, asymmetric/symmetric scale and zero-point computation with exact zero mapping, INT8 matrix multiplication kernels with integer scaling and bit-shifting, and structured channel pruning that identifies and removes low-magnitude filters to physically reduce model dimensions. Your engine will take an uncompressed FP32 neural network, prune 40% of its redundant channels, quantize weights and activations to INT8, verify that the compressed model achieves a 4x reduction in Flash footprint and a 60% reduction in arithmetic operations, and validate that output accuracy remains within 1.0% of baseline. This milestone equips you with the complete model compression toolkit required for edge deployment.",
    "conceptInvariant": "End-to-End Compression Pipeline Invariant: The compression engine must guarantee: (1) Total Flash footprint shrinks by \u2265 75% relative to FP32; (2) Structured pruning produces dense reduced matrices requiring zero sparse index overhead; (3) Real 0.0 maps exactly to integer Zero-Point Z; and (4) Compressed model accuracy degradation \u2264 1.5% across calibration validation sets.",
    "failureMode": "Exporting an INT8 model with scale factors that exceed 32-bit integer multiplier ranges; runtime integer operations overflow intermediate registers, producing garbled predictions on bare-metal silicon.",
    "tryItFriction": "Execute the Milestone 4 verification suite: instantiate your compression pipeline; load a pre-trained FP32 sensor classifier; pass a 100-sample representative calibration dataset; apply 35% structured filter pruning; quantize weights to symmetric INT8 and activations to asymmetric INT8; execute inference on 1,000 test vectors; verify that inference speed triples and accuracy drops by less than 0.8%.",
    "socraticHints": [
      "Why do we prune BEFORE quantizing rather than quantizing before pruning?",
      "Because pruning changes the weight distribution! If you quantize first, pruning removes weights that defined your quantization scale boundaries, requiring you to re-calibrate anyway.",
      "Pruning first allows the quantization engine to calculate optimal scales over only the surviving, active weights!"
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 4 compression engine processes a 4-layer convolutional audio classifier. Baseline FP32 size is 280 KB (too large for a 128 KB MCU). The engine applies 30% structured filter pruning, shrinking size to 196 KB. Then it applies INT8 quantization, shrinking size to 49 KB. Accuracy drops by only 0.4%. How does the combined compression impact MCU execution speed?",
      "options": [
        "Speed stays the same because microcontrollers cannot run compressed models.",
        "Multiplicative Speedup: Pruning eliminates 30% of MAC multiplications directly, while INT8 quantization allows the Cortex-M CPU to execute SIMD dual-MAC instructions (`SMLAD`), resulting in a combined ~3.5x to 4x throughput acceleration while fitting easily into 49 KB Flash.",
        "Speed slows down by 10x due to decompression overhead.",
        "The model must be retrained on an FPGA."
      ],
      "answerIdx": 1,
      "debrief": "Structured pruning and INT8 quantization compound their benefits. Pruning reduces the total number of operations required. INT8 quantization allows the hardware to execute integer SIMD operations and read weights with 4x less memory bandwidth. The combined result is a model that is 5.7x smaller and nearly 4x faster with zero custom hardware requirements."
    },
    "quests": [
      {
        "num": 1,
        "title": "Comprehensive Model Compression Architecture",
        "type": "Concept",
        "description": "Construct the master architecture specification integrating structured channel pruning, representative calibration, symmetric/asymmetric quantization, and integer scaling math."
      },
      {
        "num": 2,
        "title": "Quantization Scale Overflow Detective",
        "type": "Detective Challenge",
        "description": "Analyze an INT8 kernel execution log where fixed-point multiplier scaling overflowed 32-bit integer accumulators; diagnose improper power-of-two shift factor calculation."
      },
      {
        "num": 3,
        "title": "Milestone 4 Pruning & INT8 Quantization Engine",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 4 Engine featuring structured L1-norm filter pruning, representative dataset calibration, and full INT8 quantized matrix inference."
      },
      {
        "num": 4,
        "title": "Milestone 4 Production Model Optimization Lab",
        "type": "Production Incident Lab",
        "description": "Optimize an oversized industrial vibration CNN for deployment on a constrained 64 KB RAM microcontroller, achieving <45 KB footprint and <1% accuracy loss."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "TensorFlow Lite for Microcontrollers (TFLM): FlatBuffers, OpResolvers & Tensor Arena Memory Planning",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Edge Runtime Architecture (TFLM FlatBuffers & Static Memory Planning)",
    "spokenGoal": "Welcome to Block 5. Now that we understand model compression, how do we run production neural networks on microcontrollers using industry-standard runtimes? Enter TensorFlow Lite for Microcontrollers (TFLM). Developed by Google, TFLM is engineered from the ground up for bare-metal C++ with zero operating system dependencies, zero dynamic memory allocation (`malloc`), and zero standard C++ library overhead! Deconstruct the core TFLM subsystems: First, the FlatBuffers Model Format (`.tflite`): models are stored in memory-mapped read-only binary structures that can be read directly from Flash without deserialization or unpacking! Second, the OpResolver (`tflite::MicroMutableOpResolver`): instead of compiling the entire TensorFlow library (which would consume megabytes of Flash), you register ONLY the exact operators your model needs (e.g., Conv2D, DepthwiseConv2D, FullyConnected), stripping dead code. Third, the heart of TFLM: the Tensor Arena. You allocate a single static byte array in RAM (`uint8_t tensor_arena[ARENA_SIZE]`), and TFLM's offline memory planner maps all intermediate layer activation buffers into this single space with overlapping reuse!",
    "conceptInvariant": "Static Tensor Arena Memory Allocation Invariant: TFLM is strictly prohibited from invoking dynamic memory allocation (`malloc`, `new`); all activation tensors, runtime scratchpads, and execution graphs must reside within a single user-provided contiguous byte array: uint8_t tensor_arena[kTensorArenaSize], bounded by Peak_Memory_Footprint \u2264 kTensorArenaSize.",
    "failureMode": "Allocating a Tensor Arena that is 2 KB too small for the model's peak activation overlap; `AllocateTensors()` returns `kTfLiteError`, and without error checking, the microcontroller crashes with a Null Pointer Dereference upon the first `Invoke()` call.",
    "tryItFriction": "Construct a TFLM Tensor Arena Memory Planner in TypeScript: define a 4-layer model with known activation tensor sizes; implement an offset allocator that reuses memory between non-overlapping layer lifetimes (ping-pong buffer allocation); calculate the exact minimum Arena size; verify that memory reuse slashes peak RAM consumption by 50% compared to naive sequential allocation.",
    "socraticHints": [
      "Why is Google FlatBuffers vastly superior to Protocol Buffers or JSON for microcontrollers?",
      "Because FlatBuffers supports Zero-Copy In-Place Traversal! It stores data in binary wire format with internal pointer offsets.",
      "The microcontroller maps the file directly to Flash memory and reads weights instantly without allocating memory or parsing fields!"
    ],
    "situationalPuzzle": {
      "scenario": "A junior engineer builds a keyword spotting firmware on an ESP32 using TFLM. The code includes `#include \"tensorflow/lite/micro/all_ops_resolver.h\"` and uses `AllOpsResolver`. The binary size is 950 KB, failing to fit into the device's 512 KB application flash partition. How does the engineer reduce flash code size by 600 KB in two lines of C++?",
      "options": [
        "Delete the model from flash.",
        "Replace `AllOpsResolver` with `MicroMutableOpResolver`: Register only the 3 specific operators used by the model (e.g., `resolver.AddConv2D()`, `resolver.AddReshape()`, `resolver.AddFullyConnected()`). The C++ linker strips out all hundreds of unused TensorFlow operators, shrinking binary size from 950 KB to under 120 KB.",
        "Switch from C++ to Assembly.",
        "Overclock the flash memory bus."
      ],
      "answerIdx": 1,
      "debrief": "`AllOpsResolver` links every single operator in the TensorFlow Lite operator catalog (hundreds of functions), ballooning binary size. `MicroMutableOpResolver` allows selective operator registration. Unused operators are discarded by the linker's dead-code elimination, dramatically reducing Flash footprint so the application fits into tiny microcontrollers."
    },
    "quests": [
      {
        "num": 1,
        "title": "TFLM Architecture & FlatBuffers Zero-Copy Physics",
        "type": "Concept",
        "description": "Deconstruct TFLM runtime execution flow, FlatBuffers binary layouts, MicroMutableOpResolver linker pruning, and Tensor Arena offset allocation."
      },
      {
        "num": 2,
        "title": "Tensor Arena Under-Allocation Crash Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded crash log where `AllocateTensors()` failed silently, causing an immediate Null Pointer HardFault during model invocation."
      },
      {
        "num": 3,
        "title": "TFLM Static Memory Planner & Arena Simulator Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript memory planner that analyzes model execution graphs, computes lifetime intervals of activation tensors, and generates minimal overlapping Tensor Arena layouts."
      },
      {
        "num": 4,
        "title": "3 AM Smart Doorbell TFLM Flash Bloat Crisis Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a firmware update crisis where a new TFLM model exceeded the factory OTA partition by 300 KB; apply OpResolver optimization and Flash XIP execution."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "CMSIS-NN Kernel Acceleration: ARM Cortex-M Helium Extensions & Im2Col Matrix Transforms",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Low-Level Kernel Acceleration (CMSIS-NN & Vector SIMD Hardware)",
    "spokenGoal": "While TFLM provides the framework, WHO actually executes the mathematical convolutions on the silicon? ARM's CMSIS-NN! Developed specifically for Cortex-M processors, CMSIS-NN replaces naive nested for-loops with hand-optimized assembly kernels utilizing SIMD and MVE (M-Profile Vector Extension, code-named Helium on Cortex-M55/M85). Today we master CMSIS-NN Kernel Acceleration. Deconstruct 2D Convolution acceleration: standard 2D convolution requires 6 nested loops. CMSIS-NN transforms convolution into a blazing-fast Matrix Multiplication using Im2Col (Image-to-Column). Im2Col unrolls overlapping image patches into column vectors in a small scratchpad buffer. Once transformed, the convolution becomes a pure General Matrix Multiply (GEMM), executed via ARM SIMD instructions (`SMLAD` on Cortex-M4 or 128-bit Helium vector instructions on Cortex-M55) that compute 4 to 8 MAC operations per clock cycle! Master Depthwise Separable Convolutions: splitting a standard convolution into a Depthwise spatial filter followed by a 1x1 Pointwise filter slashes operations by 8x to 9x with near-zero accuracy drop!",
    "conceptInvariant": "Depthwise Separable Convolution Efficiency Invariant: For kernel size D_K \u00d7 D_K, input channels M, and output channels N, Depthwise Separable Convolution reduces arithmetic computation relative to standard convolution by a factor of: Reduction = (D_K^2 * M + M * N) / (D_K^2 * M * N) = 1/N + 1/D_K^2, delivering an ~88% reduction in MAC operations for 3x3 kernels.",
    "failureMode": "Implementing standard 2D convolution with 6 nested C loops without Im2Col or CMSIS-NN; the CPU spends 80% of its time executing branch instructions and memory address recalculations, resulting in a 5x latency penalty compared to CMSIS-NN.",
    "tryItFriction": "Implement an Im2Col matrix transformation and SIMD-accelerated convolution kernel in TypeScript: take an 8x8 input image with 3 channels; unroll 3x3 patches into an Im2Col buffer; execute matrix multiplication against a 16-filter INT8 weight matrix; verify that output matches direct convolution ground truth while reducing nested loops to a single inner dot product.",
    "socraticHints": [
      "Why does Depthwise Separable Convolution save so much computation compared to standard convolution?",
      "In standard convolution, every filter looks across ALL channels and ALL spatial pixels simultaneously (D_K * D_K * M * N operations)!",
      "Depthwise separable breaks this into two steps: Step 1 filters spatial pixels on each channel independently (D_K * D_K * M). Step 2 mixes channels with a 1x1 filter (M * N). For a 3x3 kernel, 1/9 + 1/N \u2248 11% of the original computation!"
    ],
    "situationalPuzzle": {
      "scenario": "An edge AI engineer runs an INT8 MobileNet model on an ARM Cortex-M4. In pure C, inference takes 420 ms per frame (unusable for real-time video at 2.3 FPS). By linking ARM CMSIS-NN optimized kernels (`arm_convolve_s8` and `arm_depthwise_conv_s8`), inference time drops to 88 ms (11.3 FPS) with zero changes to model weights. What hardware feature did CMSIS-NN exploit to achieve this 4.8x acceleration?",
      "options": [
        "CMSIS-NN converted the code to run on a cloud GPU.",
        "ARM Cortex-M DSP SIMD Dual-MAC Instructions: CMSIS-NN uses `SMLAD` (Signed Multiply with Accumulate Dual) instructions that fetch two 8-bit packed weights and two 8-bit inputs in a single 32-bit register load, computing two MAC operations per clock cycle with zero loop branching overhead.",
        "CMSIS-NN deleted half the layers.",
        "The compiler disabled all security checks."
      ],
      "answerIdx": 1,
      "debrief": "CMSIS-NN is heavily optimized for ARM Cortex-M hardware. By packing INT8 values into 32-bit registers, it uses 32-bit memory loads and SIMD instructions (like `SMLAD` on Cortex-M4/M7 and Helium vector instructions on Cortex-M55) to execute multiple multiplications per clock cycle, delivering 4x to 5x speedups over naive C code."
    },
    "quests": [
      {
        "num": 1,
        "title": "CMSIS-NN Kernel Internals & Im2Col Mathematics",
        "type": "Concept",
        "description": "Deconstruct Im2Col memory layout transformations, GEMM vectorization, ARM Cortex-M SIMD intrinsics, and Depthwise Separable convolution math."
      },
      {
        "num": 2,
        "title": "Naive Nested Loop Performance Bottleneck Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded profiler trace comparing naive 6-loop convolution against CMSIS-NN; demonstrate how loop indexing and branch penalties throttled CPU throughput."
      },
      {
        "num": 3,
        "title": "Im2Col & Depthwise Separable Convolution Engine",
        "type": "Mastery Assignment",
        "description": "Build an optimized TypeScript convolution engine implementing Im2Col buffer unrolling, GEMM matrix multiplication, and Depthwise Separable filter splitting."
      },
      {
        "num": 4,
        "title": "3 AM Real-Time Frame Rate Collapse Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a severe frame-rate degradation in a smart security sensor by migrating unoptimized TFLM reference kernels to CMSIS-NN accelerated vector pipelines."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Embedded Micro-Vision: MobileNet Architectures, Inverted Residuals & 96x96 Person Detection",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Micro-Computer Vision (MobileNetV1/V2 & Visual Wake Words)",
    "spokenGoal": "Can a $2 microcontroller with no GPU look through a camera lens and determine if a human being is standing in the room? Yes: through Embedded Micro-Vision and Visual Wake Words (VWW). Today we deconstruct the architecture that made computer vision possible on microcontrollers: MobileNetV1 and MobileNetV2. Examine MobileNetV2's fundamental breakthrough: Inverted Residuals with Linear Bottlenecks. Traditional ResNets expand channels and then compress them; MobileNetV2 does the opposite! It takes a thin, compressed bottleneck, expands it into a higher-dimensional space for Depthwise convolution, and projects it back down to a thin bottleneck with a skip-connection. Master the Person Detection pipeline: take a 96x96 grayscale image (9,216 bytes of input); run it through a MobileNetV1 (alpha = 0.25 depth multiplier) quantized to INT8; the entire model consumes only ~250 KB of Flash and executes inside an 80 KB SRAM Tensor Arena, delivering robust human presence detection in under 150 milliseconds!",
    "conceptInvariant": "Visual Wake Words Memory-Constrained Invariant: A micro-vision model executing on a microcontroller with SRAM \u2264 256 KB must constrain input resolution to \u2264 96\u00d796 grayscale and width multiplier \u03b1 \u2264 0.25, ensuring that peak activation memory of the largest layer (Layer 1 Conv: 48\u00d748\u00d78 = 18.4 KB) fits comfortably within static SRAM bounds.",
    "failureMode": "Attempting to feed full 224x224 RGB images into MobileNet on a microcontroller; the first activation layer alone requires 112x112x32 = 401 kilobytes of RAM, instantly blowing past the chip's total 256 KB SRAM limit.",
    "tryItFriction": "Construct a MobileNetV1/V2 layer architecture and memory footprint model in TypeScript: calculate input and output tensor dimensions, parameter counts, and peak activation sizes for a 96x96 grayscale Person Detector across all 14 layers; prove that peak activation memory is under 40 KB; and simulate forward pass activation memory reuse.",
    "socraticHints": [
      "Why do Visual Wake Word models on microcontrollers use 96x96 Grayscale images instead of standard 224x224 RGB?",
      "Memory and Computation! A 224x224 RGB image contains 150,528 bytes, whereas a 96x96 Grayscale image contains only 9,216 bytes (16x less data!).",
      "Human presence can be easily identified from shapes and contours without color; shrinking resolution makes the model fit into microcontrollers!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart thermostat manufacturer builds an occupancy sensor to detect when humans enter a room using a low-cost camera module and an ESP32-S3 (512 KB SRAM). The prototype uses MobileNetV2 at 160x160 RGB, which requires 420 KB of RAM and takes 850 ms per inference. Battery life is unacceptably short. How does the engineer optimize the vision pipeline to run in <100 ms with <100 KB RAM while maintaining >90% human detection accuracy?",
      "options": [
        "Switch to a cloud server over Wi-Fi.",
        "Downscale to 96x96 Grayscale with MobileNetV1 (alpha = 0.25): Grayscale reduces input data by 3x, while 96x96 resolution slashes activation memory by 64%. The smaller alpha multiplier cuts MAC operations by 75%, dropping inference time to ~85 ms and peak RAM to 65 KB, extending battery life by 10x.",
        "Remove the lens from the camera.",
        "Run the model only on Mondays."
      ],
      "answerIdx": 1,
      "debrief": "Micro-computer vision is governed by the quadratic scaling of image resolution (Resolution \u221d N^2). Dropping from 160x160 to 96x96 slashes spatial pixels from 25,600 to 9,216 (a 64% reduction). Removing color channels cuts input data by another 3x. Pairing this with a slim width multiplier (\u03b1 = 0.25) allows the model to execute in <100 ms inside tiny SRAM budgets."
    },
    "quests": [
      {
        "num": 1,
        "title": "MobileNet Architecture & Inverted Residual Physics",
        "type": "Concept",
        "description": "Deconstruct MobileNetV1/V2 layer blocks, depthwise separable scaling, width multipliers (\u03b1), resolution multipliers (\u03c1), and linear bottleneck mechanics."
      },
      {
        "num": 2,
        "title": "Resolution Bloat & Activation Overflow Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded camera crash dump where increasing image resolution from 96x96 to 128x128 caused activation buffers to overwrite the RTOS task stack."
      },
      {
        "num": 3,
        "title": "96x96 MobileNet Micro-Vision Pipeline Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript simulation of a 96x96 grayscale MobileNet inference pipeline, computing layer-by-layer activation buffers, FLOPs, and human detection probability."
      },
      {
        "num": 4,
        "title": "3 AM Smart Building Occupancy Sensor Latency Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-latency defect in a commercial smart lighting occupancy sensor where unoptimized vision model activations caused a 1-second lag before turning on room lights."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Keyword Spotting (KWS): Depthwise 1D/2D Audio CNNs, Ring Buffers & False Trigger Suppression",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Edge Speech Recognition (Keyword Spotting & Streaming Audio Pipelines)",
    "spokenGoal": "Every time you say 'Hey Google' or 'Alexa', a tiny, battery-powered microcontroller running a Keyword Spotting (KWS) model wakes up your smart speaker. Today we master Keyword Spotting Architecture. A continuous 16 kHz audio stream flows from an I2S microphone into an embedded DMA Ring Buffer. Every 100 milliseconds, the newest 1-second audio window is converted into a 2D MFCC feature matrix (e.g., 10 frames of 40 Mel bins = 40x10 input tensor). Feed this into a Depthwise Separable Convolutional Neural Network (DS-CNN). DS-CNNs achieve higher accuracy than recurrent neural networks (RNNs) with vastly lower compute! But here is the critical production challenge: False Trigger Suppression. If someone says 'Hey Doodle', your model must not trigger! Master Temporal Smoothing and Moving Average Thresholding: an activation trigger is confirmed if and only if its Softmax confidence exceeds a high threshold (e.g., >0.85) consistently over consecutive sliding windows, preventing false alarms.",
    "conceptInvariant": "Streaming KWS Temporal Smoothing Invariant: To eliminate false triggers from transient background noise, a keyword activation is legally confirmed if and only if: (1) Instantaneous posterior probability P(keyword) \u2265 \u03b8_high (e.g., 0.85); and (2) The moving average across N sliding windows satisfies \u2211_{i=0}^{W-1} P_i(keyword) / W \u2265 \u03b8_smooth, suppressing spurious single-frame phonetic spikes.",
    "failureMode": "Triggering immediate actions on a single raw Softmax frame output (>0.5); natural ambient speech contains transient phonemes that momentarily trigger high confidence for a single 100 ms frame, causing the device to wake up 50 times an hour during normal room conversations.",
    "tryItFriction": "Build a streaming Keyword Spotting state machine and temporal smoother in TypeScript: ingest simulated streaming audio chunks; compute sliding MFCC frames in a circular ring buffer; simulate DS-CNN keyword predictions; implement a temporal window moving average smoother; and demonstrate that transient single-frame spikes are suppressed while sustained 500 ms keyword utterances trigger clean detection.",
    "socraticHints": [
      "Why are Depthwise Separable CNNs (DS-CNN) preferred over LSTMs or RNNs for Keyword Spotting on microcontrollers?",
      "Because RNNs and LSTMs must be executed sequentially sample-by-sample and contain recurrent state transitions that cannot easily be parallelized by SIMD hardware!",
      "DS-CNNs treat the audio spectrogram as a 2D image, allowing blistering vector acceleration via CMSIS-NN and zero recurrent state drift!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart home voice-activated remote control has a 1-year battery target. In production, users report the device wakes up constantly when the television is playing, draining the battery in 3 weeks. Telemetry shows the KWS model triggers whenever confidence exceeds 0.60 on any single 100 ms inference window. What signal-processing firmware update eliminates these false wakeups?",
      "options": [
        "Mute the microphone permanently.",
        "Implement Hysteresis and Sliding Window Temporal Averaging: Require the keyword probability to exceed 0.85 and remain above an average of 0.75 across at least 3 consecutive sliding inference windows (300 ms duration), followed by a mandatory 2-second refractory lockout period.",
        "Double the neural network parameter count.",
        "Switch the microphone to an analog FM radio."
      ],
      "answerIdx": 1,
      "debrief": "Single-frame thresholding is a fatal flaw in streaming audio classification. Random television dialogue frequently hits brief phonetic similarities that spike for 100 ms. Human wake-words take 300 to 600 ms to pronounce. Requiring consecutive smoothed window confirmations and refractory lockout filters out transient phonetic noise, eliminating false triggers."
    },
    "quests": [
      {
        "num": 1,
        "title": "Keyword Spotting DS-CNN Architecture & Streaming Pipelines",
        "type": "Concept",
        "description": "Deconstruct 1D/2D audio CNN architectures, sliding MFCC ring buffers, softmax posteriors, and temporal averaging math."
      },
      {
        "num": 2,
        "title": "False Trigger Storm & Single-Frame Threshold Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where television audio triggered 42 false wakeups per hour; demonstrate how single-frame thresholding failed and evaluate multi-window smoothing."
      },
      {
        "num": 3,
        "title": "Streaming KWS Ring Buffer & Temporal Smoother Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript streaming KWS engine implementing circular audio buffering, sliding MFCC windowing, DS-CNN inference simulation, and temporal hysteresis smoothing."
      },
      {
        "num": 4,
        "title": "3 AM Voice Remote Battery Depletion Lab",
        "type": "Production Incident Lab",
        "description": "Remediate a fleet-wide battery drain crisis in a voice-activated medical dictation device where ambient hospital paging chatter caused continuous false trigger activations."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone 5: TensorFlow Lite for Microcontrollers (TFLM) Tensor Arena & CMSIS-NN Engine",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Milestone 5 Synthesis (Production TinyML Runtime Capstone)",
    "spokenGoal": "Congratulations on completing Block 5. Today you engineer Milestone 5: a production TensorFlow Lite for Microcontrollers (TFLM) Tensor Arena and CMSIS-NN Kernel Acceleration Engine in TypeScript. Your engine brings together the full production edge AI runtime architecture: zero-copy FlatBuffers model parsing, selective operator resolution (`MicroMutableOpResolver`), an optimized static Tensor Arena memory planner that overlaps activation lifetimes with zero heap allocations, and CMSIS-NN accelerated vector convolution kernels (utilizing Im2Col and Depthwise Separable transformations with INT8 arithmetic). Your engine will load a complete quantized Keyword Spotting or Micro-Vision model, allocate the Tensor Arena, execute multi-layer inference in under 15 milliseconds, and demonstrate zero memory leaks and deterministic execution time. This milestone cements your mastery of standard TinyML runtimes before we step into edge anomaly detection and our Month 1 Capstone.",
    "conceptInvariant": "End-to-End TFLM Runtime Invariant: The edge inference runtime must satisfy: (1) Zero runtime heap allocations during execution; (2) Contiguous Tensor Arena activation mapping with \u2265 40% memory reuse; (3) CMSIS-NN INT8 vectorized kernel execution; and (4) Execution latency strictly bounded within real-time deadlines on simulated ARM Cortex-M hardware.",
    "failureMode": "Deploying an edge runtime where activation buffers are allocated dynamically on the stack; deep neural network layer activations blow past the 2 KB RTOS thread stack, corrupting hardware registers and causing silent system lockups.",
    "tryItFriction": "Execute the Milestone 5 verification suite: instantiate your TFLM engine; load a quantized Depthwise Separable audio model; allocate a 32 KB Tensor Arena; run 1,000 continuous inference cycles over simulated microphone audio; verify that CMSIS-NN vector kernels accelerate inference by >3x over naive C loops; and verify that zero bytes of heap memory are consumed during execution.",
    "socraticHints": [
      "How does TFLM's memory planner calculate the exact overlapping offsets for activation tensors?",
      "By performing Lifetime Interval Analysis! Layer 1's output is consumed by Layer 2.",
      "Once Layer 2 finishes executing, Layer 1's memory is DEAD and can be immediately reused by Layer 3! The memory planner calculates these intervals offline, compressing peak RAM footprint."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 5 TFLM engine executes inference on a simulated Cortex-M4. Memory profiling reports that the model requires 45 KB of activations, but your Tensor Arena is configured to exactly 45 KB, and `AllocateTensors()` fails with an out-of-memory error. Why did allocating the exact sum of activations fail?",
      "options": [
        "TensorFlow Lite models require 10x more memory on Tuesdays.",
        "Missing Runtime Scratchpad & Alignment Overhead: In addition to layer activations, TFLM requires internal runtime scratchpad buffers (e.g., Im2Col temporary buffers, quantization lookup tables) and enforces 16-byte memory alignment for SIMD vector instructions. The Tensor Arena must include an additional 10-20% headroom to accommodate alignment padding and scratchpads.",
        "The weights must be stored in the Tensor Arena.",
        "Microcontrollers cannot execute 45 KB models."
      ],
      "answerIdx": 1,
      "debrief": "The Tensor Arena does not merely hold activation tensors. It also houses TFLM's internal execution plan, node metadata, persistent kernel states, and temporary scratchpad buffers (such as the Im2Col buffer used by CMSIS-NN). Furthermore, SIMD hardware requires 4-byte or 16-byte memory alignment, introducing small padding gaps. Sizing the arena with a 15-20% margin is standard practice."
    },
    "quests": [
      {
        "num": 1,
        "title": "TFLM & CMSIS-NN Integrated Architecture",
        "type": "Concept",
        "description": "Construct the comprehensive system architecture document integrating FlatBuffers parsing, OpResolver pruning, Tensor Arena offset planning, and CMSIS-NN vector kernel dispatch."
      },
      {
        "num": 2,
        "title": "Memory Alignment & Scratchpad Starvation Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded TFLM allocation failure log where an exact-size Tensor Arena failed due to 16-byte SIMD alignment padding and Im2Col scratchpad requirements."
      },
      {
        "num": 3,
        "title": "Milestone 5 TFLM Runtime & CMSIS-NN Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 5 Engine featuring FlatBuffers schema parsing, static Tensor Arena allocation with lifetime reuse, and CMSIS-NN INT8 convolution kernels."
      },
      {
        "num": 4,
        "title": "Milestone 5 Production Stress & Real-Time Profiling Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 50,000-cycle inference stress test against the Milestone 5 engine under simulated audio streaming loads, proving deterministic execution time and zero memory fragmentation."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Unsupervised Anomaly Detection: Under-Complete Autoencoders & Reconstruction Error",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Edge Deep Anomaly Detection (Autoencoder Latent Bottlenecks & MSE)",
    "spokenGoal": "While K-Means and Mahalanobis distance work well on low-dimensional statistics, what happens when you have rich 2D vibration spectrograms or complex multi-channel sensor arrays? Classical metrics fail to capture complex non-linear correlations. Enter Deep Unsupervised Anomaly Detection using Under-Complete Autoencoders. Deconstruct the Autoencoder Architecture: an Encoder compresses high-dimensional sensor data (e.g., a 128-bin spectrum) through a narrow Latent Bottleneck (e.g., 8 neurons), forcing the network to learn only the most essential, compact representations of normal operation. A symmetrical Decoder reconstructs the original input from the bottleneck. When the machine runs normally, the autoencoder reconstructs the signal with near-zero error! But when a fault develops (cracked bearing, cavitation, rotor unbalance), the autoencoder has never seen those anomalous patterns: its bottleneck cannot encode them, and the reconstruction fails miserably! Master Reconstruction Error (Mean Squared Error - MSE): MSE = (1/N) * \u2211 (x_i - x_hat_i)^2. When MSE spikes above a calibrated dynamic threshold, declare an anomaly!",
    "conceptInvariant": "Autoencoder Latent Compression & Reconstruction Loss Invariant: An under-complete autoencoder with bottleneck dimension d \u226a D forces dimensionality reduction; anomaly scoring is defined as Reconstruction Error L_{rec} = ||x - Decoder(Encoder(x))||^2, where L_{rec} \u2264 \u03b8 indicates healthy manifold projection, and L_{rec} > \u03b8 identifies unrepresented mechanical anomalies.",
    "failureMode": "Designing an autoencoder with a bottleneck that is too wide (e.g., 128 inputs compressed to 120 bottleneck neurons); the network learns a trivial identity function (copying input to output), reconstructing broken machine vibrations perfectly and completely missing severe faults.",
    "tryItFriction": "Construct an INT8 Under-Complete Autoencoder in TypeScript: define an Encoder (64 \u2192 16 \u2192 4) and Decoder (4 \u2192 16 \u2192 64); train on baseline motor vibration spectra; compute Reconstruction Error MSE on normal test samples (MSE \u2248 0.02); feed anomalous vibration spectra containing gear impact spikes; verify that Reconstruction Error jumps by >15x (MSE > 0.35); and calibrate the anomaly threshold.",
    "socraticHints": [
      "Why must the bottleneck of an anomaly detection autoencoder be significantly smaller than the input dimension?",
      "To prevent the network from memorizing the input! If the bottleneck is wide, the network simply learns to pass data straight through like a wire.",
      "A narrow bottleneck forces the network to discover the true underlying physical laws of healthy machine operation!"
    ],
    "situationalPuzzle": {
      "scenario": "An industrial manufacturing plant deploys an autoencoder on an edge sensor to detect water pump cavitation. In winter, when ambient water is cold, the autoencoder functions perfectly. In summer, as water temperature naturally warms up from 15\u00b0C to 35\u00b0C, the baseline vibration spectrum shifts slightly due to lower fluid viscosity. The autoencoder triggers continuous false alarms because MSE exceeds the static threshold. How does the architecture adapt without retraining the model?",
      "options": [
        "Ignore all alarms during the summer.",
        "Implement Dynamic Temperature-Conditioned Thresholding (or append temperature to the latent bottleneck): Anomaly thresholds must not be static constants. By making the threshold a function of ambient temperature (\u03b8 = \u03b8_base + \u03b1 * \u0394T) or conditioning the autoencoder on temperature, the model accommodates seasonal operating drift without triggering false alarms.",
        "Turn off the water pump.",
        "Delete the autoencoder weights."
      ],
      "answerIdx": 1,
      "debrief": "Industrial machines operate across seasonal environmental cycles. A static anomaly threshold calibrated in winter will trigger false alarms in summer as viscosity, thermal expansion, and ambient temperature alter baseline dynamics. Dynamic threshold adaptation (adjusting thresholds based on operating context) or multi-modal conditioning is essential for production autonomy."
    },
    "quests": [
      {
        "num": 1,
        "title": "Autoencoder Architecture & Latent Bottleneck Theory",
        "type": "Concept",
        "description": "Deconstruct under-complete autoencoders, reconstruction loss (MSE / MAE), bottleneck capacity limits, and dynamic threshold calibration."
      },
      {
        "num": 2,
        "title": "Over-Complete Bottleneck & Identity Shortcut Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial anomaly detector evaluation where an autoencoder with an overly wide bottleneck reconstructed damaged pump vibrations with 0% error."
      },
      {
        "num": 3,
        "title": "INT8 Under-Complete Autoencoder Anomaly Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing an INT8 quantized encoder-decoder network, MSE reconstruction loss computation, and dynamic threshold adaptation."
      },
      {
        "num": 4,
        "title": "3 AM Water Pump Cavitation False Alarm Storm Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity false alarm storm in a municipal wastewater plant by deploying an adaptive thresholding autoencoder that accounts for fluid temperature shifts."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "TinyML Energy Profiling: Microjoules per Inference, Duty Cycles & Power Gating",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Energy Engineering & Hardware Power Gating (\u03bcJ per Inference & Battery Autonomy)",
    "spokenGoal": "In TinyML, accuracy without energy efficiency is completely useless. A model that achieves 99% accuracy but drains a sensor battery in 48 hours will never be deployed in an industrial plant. Today we master TinyML Energy Profiling. Quantify the fundamental metric: Energy per Inference in microjoules (\u03bcJ): Energy = Voltage * Current * Time. If an MCU runs at 3.3V, draws 15 mA during inference, and takes 20 ms to compute, Energy per Inference = 3.3V * 0.015A * 0.020s = 990 \u03bcJ (~1 mJ). Master Duty Cycling: a sensor does not need to run inference 1,000 times a second! If you sample for 20 ms once every 10 seconds, the active duty cycle is only 0.2%! During the remaining 9.98 seconds, the MCU enters Deep Sleep (drawing <2 \u03bcA). Master Hardware Power Gating: using a P-channel MOSFET to completely cut power to external sensors, flash chips, and operational amplifiers while the CPU is sleeping, eliminating phantom leakage currents!",
    "conceptInvariant": "Energy Duty-Cycle & Battery Autonomy Invariant: Average system current I_avg is governed by: I_avg = (T_active * I_active + T_sleep * I_sleep) / (T_active + T_sleep); battery lifetime in hours is: Lifetime = (Battery_Capacity_mAh * Derating_Factor) / I_avg, requiring active duty cycles \u2264 1.0% to achieve multi-year coin-cell autonomy.",
    "failureMode": "Leaving an external I2C accelerometer powered in high-resolution continuous measurement mode (drawing 800 \u03bcA) while the microcontroller sleeps in 2 \u03bcA deep sleep; the sensor's phantom quiescent current drains a CR2032 coin cell in 10 days instead of 3 years.",
    "tryItFriction": "Construct a TinyML Battery Autonomy & Power Gating Simulator in TypeScript: model an edge vibration sensor running on a 1,000 mAh LiSOCl2 battery; calculate average current across three models: (1) Heavy CNN (150 ms inference, 20 mA active, executed every 1 sec); (2) Optimized TinyML (10 ms inference, 12 mA active, executed every 10 sec); and (3) Power-Gated TinyML with sensor sleep (0.5 \u03bcA sleep); prove that Model 3 delivers >7 years of battery life.",
    "socraticHints": [
      "Why is a 10 ms inference executed once every 10 seconds 100x more battery-efficient than a continuous model?",
      "Because the duty cycle is 10 ms / 10,000 ms = 0.1%! For 99.9% of the time, the microcontroller draws virtually zero power in deep sleep.",
      "Energy consumed is dominated by the active duration. Making inference faster allows the MCU to return to deep sleep sooner!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart pipeline sensor running an INT8 TinyML leak detector is designed to last 5 years on a 2,400 mAh battery. In testing, the battery dies in 4 months. Firmware profiling shows the MCU enters deep sleep (2.5 \u03bcA) as expected, but the overall circuit draws 680 \u03bcA in sleep. Hardware inspection reveals an analog front-end op-amp and pull-up resistors remain powered. What hardware engineering fix achieves the 5-year goal?",
      "options": [
        "Replace the battery with an automotive car battery.",
        "Implement Hardware Power Gating via a Load Switch: Add a low-leakage P-MOSFET load switch controlled by an MCU GPIO pin to completely disconnect the 3.3V rail to the op-amp and sensor during sleep, and configure high-impedance GPIO states to eliminate leakage through pull-up resistors, dropping sleep current to <4 \u03bcA.",
        "Increase the MCU clock speed to 400 MHz.",
        "Disable all data encryption."
      ],
      "answerIdx": 1,
      "debrief": "In ultra-low-power IoT, quiescent leakage through un-gated peripheral chips and floating pull-up resistors is the number one killer of battery life. Putting the MCU to sleep is useless if peripheral sensors draw 680 \u03bcA continuously. Hardware power gating via a dedicated load switch disconnects peripheral rails completely, restoring true microamp sleep and guaranteeing multi-year battery life."
    },
    "quests": [
      {
        "num": 1,
        "title": "TinyML Energy Formulations & Battery Chemistry Physics",
        "type": "Concept",
        "description": "Deconstruct microjoules per inference (\u03bcJ), active vs sleep duty cycles, Peukert's law, battery self-discharge rates, and power gating circuits."
      },
      {
        "num": 2,
        "title": "Quiescent Leakage & Phantom Drain Detective",
        "type": "Detective Challenge",
        "description": "Analyze an oscilloscope current-shunt trace showing unexpected 700 \u03bcA baseline current during deep sleep; diagnose un-gated analog sensor circuitry."
      },
      {
        "num": 3,
        "title": "TinyML Power Gating & Battery Lifetime Simulator Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript energy modeling engine that takes MCU sleep/active profiles, model inference durations, and hardware power gating states to calculate 10-year battery survival."
      },
      {
        "num": 4,
        "title": "3 AM Pipeline Sensor Battery Depletion Emergency Lab",
        "type": "Production Incident Lab",
        "description": "Remediate a fleet-wide battery failure across 1,000 gas pipeline sensors where an unhandled wake-up timer interrupt loop prevented nodes from entering deep sleep."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "On-Device Sensor Fusion: Multi-Modal IMU + Acoustic Ingestion & Cross-Sensor Attention",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Multi-Modal Edge AI (Sensor Fusion & Temporal Feature Stacking)",
    "spokenGoal": "Relying on a single sensor is a recipe for blind spots and false alarms. An accelerometer can detect low-frequency mechanical vibration, but misses high-frequency acoustic friction. A microphone hears high-frequency squeals, but gets confused by ambient factory noise. The solution is On-Device Multi-Modal Sensor Fusion. Today we master fusing multi-axis inertial measurement units (IMU: accelerometer + gyroscope) with high-frequency acoustic emission sensors on an embedded edge node. Deconstruct Multi-Modal Feature Stacking: synchronize disparate sampling rates (e.g., IMU at 200 Hz, Acoustic Microphone at 16 kHz) using circular DMA buffers and timestamp alignment. Extract statistical moments from the IMU and MFCC spectrograms from the acoustic stream. Feed both into a unified dual-branch neural network with Cross-Sensor Feature Concat or lightweight Multi-Head Attention! The network learns that a true bearing failure manifests as SIMULTANEOUS low-frequency impact shocks on the IMU and high-frequency friction acoustic bursts, achieving 99.8% precision with zero false alarms!",
    "conceptInvariant": "Multi-Modal Temporal Alignment & Cross-Sensor Invariant: Heterogeneous sensor streams with differing sampling rates (f_1 \u2260 f_2) must be temporally synchronized into contiguous time windows [t_start, t_start + \u0394T] via circular ring buffers; multi-modal feature tensors must be concatenated and normalized prior to joint classification, enforcing that cross-modal evidence confirms genuine physical events.",
    "failureMode": "Fusing IMU and acoustic features without timestamp synchronization; the acoustic buffer lags 250 ms behind the IMU buffer, causing the model to correlate an acoustic hammer strike with a non-existent idle vibration state.",
    "tryItFriction": "Construct a Multi-Modal Sensor Fusion pipeline in TypeScript: ingest synthetic 3-axis accelerometer data (200 Hz) and 1-channel audio data (16 kHz); align samples into 1-second synchronized windows; extract statistical features from the IMU (6 features) and MFCC features from the audio (13 features); concatenate into a 19-dimensional multimodal vector; pass through a dual-branch INT8 neural network; and prove that multimodal fusion rejects single-sensor noise spikes that fool unimodal classifiers.",
    "socraticHints": [
      "Why does combining an accelerometer and a microphone virtually eliminate false alarms in industrial predictive maintenance?",
      "Because acoustic noise from a passing forklift will hit the microphone, but will NOT generate structural high-G vibration on the motor's heavy casing!",
      "Conversely, a loose mounting bolt will vibrate the accelerometer, but won't produce ultrasonic friction. A true bearing defect triggers BOTH sensors simultaneously!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart train wheel bearing monitor uses an accelerometer alone. Whenever the train crosses a track switch or bridge expansion joint, the sudden track jolt triggers a false bearing emergency alert, stopping the train. Adding an acoustic emission sensor and fusing the two signals eliminates the false stops. Why?",
      "options": [
        "Acoustic sensors make trains run faster.",
        "Cross-Modal Physical Signature Disambiguation: A track switch joint produces a low-frequency mechanical jolt on the accelerometer with zero high-frequency metal-on-metal micro-acoustic friction. A damaged bearing produces continuous high-frequency ultrasonic acoustic bursts coupled with synchronous rotation impacts. The multimodal model learns to distinguish joint impacts from true bearing spalls.",
        "The train driver turned off the warning siren.",
        "Microphones absorb mechanical shocks."
      ],
      "answerIdx": 1,
      "debrief": "Single-sensor modalities are vulnerable to external environmental disturbances that mimic fault conditions. Track expansion joints produce massive low-frequency shock spikes on accelerometers. However, they lack the distinct high-frequency ultrasonic acoustic emissions produced by spalled bearing balls grinding against races. Multi-modal fusion correlates both physics, rejecting environmental shocks."
    },
    "quests": [
      {
        "num": 1,
        "title": "Multi-Modal Sensor Fusion & Temporal Synchronization",
        "type": "Concept",
        "description": "Deconstruct heterogeneous sampling rate alignment, circular buffer synchronization, early vs late fusion, and cross-sensor neural architectures."
      },
      {
        "num": 2,
        "title": "Temporal Desynchronization & False Alarm Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where DMA buffer latency desynchronized audio from accelerometer data, causing a fused predictive maintenance model to misclassify normal running as severe cavitation."
      },
      {
        "num": 3,
        "title": "Multi-Modal IMU + Acoustic Fusion Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine that ingests asynchronous IMU and audio streams, synchronizes temporal windows, extracts joint feature vectors, and executes fused INT8 neural inference."
      },
      {
        "num": 4,
        "title": "3 AM High-Speed Rail Wheel Bearing Anomaly Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity false alarm crisis on a high-speed passenger train where rail vibration shocks triggered spurious bearing derailment alarms, designing an IMU-acoustic fusion filter."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "On-Device Continuous Learning: Few-Shot Transfer Learning & Flash-Resident Linear Heads",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Edge Adaptation (On-Device Continual Learning & Linear Heads)",
    "spokenGoal": "Every industrial machine has slightly different baseline acoustics. A motor installed on a concrete foundation sounds different than the identical motor mounted on a flexible steel frame. A factory-trained model cannot know every customer's installation environment! Can a microcontroller learn and adapt to its local machine on-site without cloud connectivity? Yes: through On-Device Continuous Learning and Few-Shot Adaptation. You cannot run full backpropagation across all layers of a deep neural network on an MCU\u2014it would require megabytes of gradient memory and float32 math. The solution: Freeze the Feature Extractor! The pre-trained convolutional backbone (stored in read-only Flash) acts as a static feature extractor, mapping complex sensor inputs into a compact 16-dimensional embedding vector. The microcontroller only trains a tiny Linear Classification Head (a single layer of weights stored in non-volatile Flash or EEPROM). Master On-Device Online Gradient Descent: update the linear head using Ridge Regression or Stochastic Gradient Descent (SGD) with just 5 to 10 local samples, customizing the model to its local machine in seconds!",
    "conceptInvariant": "Frozen Backbone Linear Adaptation Invariant: To prevent catastrophic memory exhaustion and compute overhead, on-device learning freezes all feature extraction layers in read-only Flash, updating ONLY a lightweight linear classification head W \u2208 \u211d^{C \u00d7 D} via closed-form Ridge Regression or low-memory online SGD, bounding gradient RAM to O(C \u00d7 D) bytes.",
    "failureMode": "Attempting to perform backpropagation through the entire convolutional network on an embedded microcontroller; storing intermediate layer activation gradients for backprop exhausts SRAM within the first backward pass, crashing the RTOS.",
    "tryItFriction": "Construct an On-Device Few-Shot Adaptation Engine in TypeScript: freeze a 3-layer feature extractor; pass sensor samples to extract 8-dimensional embedding vectors; implement a Flash-resident Linear Ridge Regression head W = (X^T X + \u03bbI)^(-1) X^T Y; train the linear head on 5 local samples from a novel machine installation; and prove that the adapted model achieves 100% accuracy on local machine states.",
    "socraticHints": [
      "Why is training only the final linear layer vastly more memory-efficient than training the whole network?",
      "Because you don't need to save activation gradients for any of the preceding layers!",
      "Backpropagation through a network requires saving activations at EVERY layer to compute gradients via the chain rule. Freezing the backbone means zero backward pass through the convolutional layers!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart home appliance company installs predictive maintenance sensors on industrial commercial dishwashers. Each restaurant installs the dishwasher on different flooring (tile, wood, metal), altering baseline vibration by 20%. Factory models fail with high false alarms. The customer has no Wi-Fi or cloud connection. How does the sensor calibrate itself to the restaurant's specific floor in 30 seconds?",
      "options": [
        "Ship a new sensor pre-trained for wood floors.",
        "On-Device Few-Shot Calibration: The installer presses a 'Calibrate' button while the dishwasher runs a 30-second wash cycle. The sensor freezes its convolutional backbone, extracts 20 embedding vectors, updates a local linear classification head in Flash via online Ridge Regression, and locks in the restaurant's customized healthy baseline with zero cloud connectivity.",
        "Require the restaurant to connect a high-end gaming PC to the dishwasher.",
        "Turn off the vibration sensor."
      ],
      "answerIdx": 1,
      "debrief": "On-device calibration is the Holy Grail of edge intelligence. Instead of struggling with generalized models that fail on specific installations, the device adapts locally. By freezing the deep feature extractor and training only a compact linear head using local wash-cycle samples, the device learns its specific mechanical acoustics in seconds with zero cloud dependency."
    },
    "quests": [
      {
        "num": 1,
        "title": "On-Device Transfer Learning & Linear Head Formulations",
        "type": "Concept",
        "description": "Deconstruct frozen backbone feature extraction, linear classification heads, Ridge Regression closed-form solutions, and online SGD memory bounds."
      },
      {
        "num": 2,
        "title": "Full Backpropagation SRAM Exhaustion Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded firmware crash where attempting to backpropagate gradients through a 4-layer CNN exhausted the 64 KB MCU heap within a single backward pass."
      },
      {
        "num": 3,
        "title": "On-Device Few-Shot Calibration & Ridge Regression Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine that extracts embeddings from a frozen INT8 backbone and trains a local linear classification head using closed-form Ridge Regression in O(1) auxiliary memory."
      },
      {
        "num": 4,
        "title": "3 AM Custom Foundation Motor Installation Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity false alarm storm in a chemical plant where installing pumps on vibrating offshore steel decks triggered false anomaly alarms; deploy on-device calibration routines."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexTinyML Autonomous Industrial Motor Anomaly & Predictive Maintenance Edge Node Capstone Viva Gate",
    "stageName": "Stage 2: Quantization & TinyML Runtimes",
    "stageNum": 2,
    "pedagogicalRole": "Month 1 Capstone Defense (Integrated Autonomous Edge AI Systems Architecture)",
    "spokenGoal": "Congratulations! You have reached the Month 1 Capstone of Course 18: the ApexTinyML Autonomous Industrial Motor Predictive Maintenance Edge Node Capstone. Today you synthesize everything learned across Month 1: analog anti-aliasing sampling physics, cascaded Biquad IIR filtering, windowed Radix-4 FFTs, single-pass Welford statistical feature extraction, streaming MFCC audio spectrograms, INT8 quantization and structured pruning, production TFLM static Tensor Arena memory planning, CMSIS-NN accelerated vector convolutions, unsupervised autoencoder anomaly detection, and on-device few-shot calibration! In this Capstone, you will architect, implement, and defend ApexTinyML: a sovereign, battery-powered edge sensor node that continuously samples multi-modal IMU and acoustic streams, extracts features in-place, detects mechanical anomalies with zero cloud dependency, profiles energy consumption, and adapts locally to machine installations. Prepare for your Senior TinyML Architecture Viva Gate!",
    "conceptInvariant": "Autonomous TinyML Edge Invariant: The ApexTinyML edge node must execute end-to-end multi-modal anomaly detection (ADC sampling \u2192 DSP filtering \u2192 feature extraction \u2192 INT8 neural inference \u2192 anomaly scoring) within \u2264 25.0 ms latency and \u2264 64 KB peak SRAM, sustaining a \u2264 0.5% duty cycle to guarantee \u2265 5-year battery autonomy on a single cell.",
    "failureMode": "Architectural integration failure where raw sensor sampling, DSP feature extraction, and TFLM inference allocate disjoint memory buffers; peak RAM exceeds 128 KB, causing heap collisions and random watchdog resets during production motor vibration spikes.",
    "tryItFriction": "Execute the comprehensive ApexTinyML Capstone verification suite: launch the full edge sensor node simulation; feed continuous multi-modal vibration and acoustic streams; simulate bearing wear, rotor unbalance, and cavitation faults; verify real-time INT8 inference execution under 20 ms; verify that energy per inference is <500 \u03bcJ; execute on-device few-shot calibration; and pass all 25 automated architectural unit and stress tests.",
    "socraticHints": [
      "How does ApexTinyML achieve 5-year battery life while monitoring a high-speed industrial motor?",
      "Through Intelligent Event-Driven Tiered Wakeups! The node does NOT run the heavy neural network continuously.",
      "A tiny, ultra-low-power statistical feature detector (RMS / Kurtosis) runs in microamps. Only when Kurtosis spikes above threshold does the node wake up its main MCU core to execute the deep neural network and autoencoder!"
    ],
    "situationalPuzzle": {
      "scenario": "During your Capstone 1 Viva Gate, the Senior Systems Evaluator asks: 'Your ApexTinyML edge node detects bearing fault impulses using an INT8 autoencoder and a Depthwise CNN. A nearby crane drops a heavy steel beam on the factory floor, creating a massive 20G acoustic shock wave. How does your architecture prevent this brief external shock from triggering a false emergency shutdown of the industrial motor?'",
      "options": [
        "Disable the sensor whenever cranes are operating.",
        "Multi-Modal Verification with Hysteresis and Refractory Lockout: (1) The node requires cross-modal correlation: the shock must persist across multiple rotation cycles matching bearing defect frequencies (BPFO/BPFI); (2) An isolated single-frame shock is categorized as an 'EXTERNAL TRANSIENT EVENT' and suppressed; (3) A true mechanical fault requires sustained reconstruction anomaly elevation across 3 consecutive observation windows.",
        "Shut down the motor anyway just to be safe.",
        "Delete the autoencoder model from flash memory."
      ],
      "answerIdx": 1,
      "debrief": "A master TinyML architect designs for real-world industrial hostility. Dropped tools, passing forklifts, and overhead cranes create massive acoustic and seismic spikes. A naive threshold triggers false plant shutdowns. ApexTinyML employs multi-modal confirmation, kinematic frequency matching, and temporal window hysteresis to guarantee that only genuine, sustained mechanical degradation triggers maintenance actions."
    },
    "quests": [
      {
        "num": 1,
        "title": "ApexTinyML System Architecture Specification",
        "type": "Concept",
        "description": "Construct the complete master architecture document for ApexTinyML, detailing multi-modal sensory ingestion, memory scratchpad sharing, TFLM Tensor Arena layout, and energy budgets."
      },
      {
        "num": 2,
        "title": "Memory Collusion & Watchdog Reset Detective",
        "type": "Detective Challenge",
        "description": "Analyze an integrated firmware crash dump where concurrent DMA audio sampling and TFLM inference corrupted shared memory; diagnose missing scratchpad synchronization."
      },
      {
        "num": 3,
        "title": "ApexTinyML Autonomous Industrial Edge Node Engine",
        "type": "Mastery Assignment",
        "description": "Build the complete production TypeScript ApexTinyML Engine integrating DSP filtering, MFCC feature extraction, INT8 autoencoder anomaly detection, and on-device few-shot calibration."
      },
      {
        "num": 4,
        "title": "ApexTinyML Capstone 1 Senior Viva Defense & Chaos Gate",
        "type": "Production Incident Lab",
        "description": "Defend the ApexTinyML Capstone under live multi-vector chaos injection: simultaneous external shock impacts, sensor saturation, memory constraints, and power fluctuations, proving 100% mission survival."
      }
    ]
  }
];

export const EDGE_AI_MONTH_2_SPECS: MasterclassDaySpec[] = [
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Micro-Camera Interfacing: DVP/MIPI-CSI2, DMA Frame Buffering & Bayer ISP Debayering",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Embedded Vision Hardware Pipelines (Camera Buses & ISP Processing)",
    "spokenGoal": "Welcome to Month 2. Today we expand our edge intelligence into vision. How does a microcontroller ingest live optical photons from an image sensor without locking up the CPU? Enter Micro-Camera Interfacing. Deconstruct camera bus protocols: Digital Video Port (DVP - parallel 8-bit bus with Pixel Clock PCLK, Horizontal Sync HREF, and Vertical Sync VSYNC) versus MIPI-CSI2 (high-speed differential serial lanes). Trace the DMA Frame Buffering pipeline: a continuous stream of raw pixels arrives at up to 20 megabytes per second! The CPU cannot read pixels one by one via polling. The camera controller peripheral uses Direct Memory Access (DMA) to stream bytes directly into a circular SRAM frame buffer. Dissect Bayer Color Filtering: camera sensors do not see full RGB at each pixel; they use a Bayer Color Filter Array (RGGB: 50% Green, 25% Red, 25% Blue). Master Debayering (Demosaicing) algorithms: Bilinear Debayering reconstructs full RGB values by interpolating adjacent color neighbors in fixed-point math!",
    "conceptInvariant": "DMA Double-Buffering & Zero-Copy ISP Invariant: High-bandwidth camera frame acquisition must employ DMA Double-Buffering (Ping-Pong buffers): the DMA controller fills Buffer A while the CPU executes debayering/inference on Buffer B, guaranteeing that pixel ingest never starves the neural network or drops frames.",
    "failureMode": "Attempting to process camera frames on a single shared frame buffer without double-buffering; the camera DMA overwrites the bottom half of the image while the neural network is halfway through reading the top half, creating severe tearing artifacts that cause false object detections.",
    "tryItFriction": "Construct a Bayer RGGB Demosaicing and DMA double-buffer engine in TypeScript: synthesize a 16x16 raw Bayer RGGB pixel grid; implement a bilinear debayering algorithm that interpolates missing Red, Green, and Blue channels; simulate ping-pong DMA buffer swapping; verify that image tearing is eliminated and debayered RGB values match continuous color gradients.",
    "socraticHints": [
      "Why do camera sensors allocate 50% of their pixels to Green and only 25% to Red and Blue?",
      "Human visual biology! The human eye's retina contains far more M and L cones sensitive to green-yellow wavelengths.",
      "Green channels carry the majority of perceived luminance (brightness) and edge detail in human vision, so Bayer sensors double green pixel density to maximize perceived sharpness!"
    ],
    "situationalPuzzle": {
      "scenario": "An embedded vision camera runs a person-counting model on an ESP32-S3. The camera operates at 15 FPS over an 8-bit DVP bus. During rapid conveyor movement, the model frequently misclassifies people because vertical lines appear jagged and split horizontally in the middle of the frame. Logic analyzer traces show the CPU takes 55 ms to process a frame. What causes this visual distortion?",
      "options": [
        "The lens focus was blurry.",
        "Frame Tearing from Single-Buffer Contention: The camera DMA is writing the next frame into the same RAM buffer that the vision model is actively reading. Because processing takes 55 ms while a frame arrives every 66 ms, the DMA overtakes the reader halfway through. Implementing Ping-Pong DMA Double-Buffering completely eliminates frame tearing.",
        "DVP cables cannot transmit green pixels.",
        "The room lighting was flickering."
      ],
      "answerIdx": 1,
      "debrief": "Frame tearing occurs when a display or processor reads from a buffer at the same time a DMA engine or camera sensor writes to it. Without double-buffering (ping-pong buffers), the top half of the image comes from Frame N, while the bottom half comes from Frame N+1. Moving objects appear split and distorted. Ping-pong buffers isolate write and read operations."
    },
    "quests": [
      {
        "num": 1,
        "title": "Camera Bus Physics & Bayer Demosaicing Theory",
        "type": "Concept",
        "description": "Deconstruct DVP vs MIPI-CSI2 timing signals (PCLK, HREF, VSYNC), Bayer RGGB CFA matrices, bilinear debayering math, and camera ISP pipelines."
      },
      {
        "num": 2,
        "title": "DMA Buffer Collision & Frame Tearing Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded camera trace where high-speed conveyor items were misclassified; demonstrate how missing double-buffer locks caused horizontal tearing artifacts."
      },
      {
        "num": 3,
        "title": "Bayer Debayering & DMA Ping-Pong Buffer Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing Bayer RGGB to RGB demosaicing, DMA ping-pong buffer management, and frame synchronization flags."
      },
      {
        "num": 4,
        "title": "3 AM Manufacturing Line Vision Tearing Incident Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency defect in an automated packaging line inspection camera where high-frequency conveyor vibrations and single-buffer tearing caused 30% false rejections."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Ultra-Lightweight Object Detectors: FOMO (Faster Objects, More Objects) vs YOLO-Fastest",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Micro-Object Detection Architectures (Centroid Heatmaps vs Bounding Boxes)",
    "spokenGoal": "Traditional object detection models like YOLOv5 or SSD rely on complex Anchor Boxes, Non-Maximum Suppression (NMS), and bounding box regression. On a cloud GPU, this works great. On a microcontroller with 256 KB of RAM, bounding box regression requires massive memory and compute that crushes frame rates to 0.5 FPS. Enter FOMO (Faster Objects, More Objects), developed by Edge Impulse. How does FOMO achieve 30+ FPS on a standard Cortex-M4? By rethinking the problem entirely! In most IoT applications (counting pills, detecting bees in a hive, locating birds on a wire), you don't need a precise bounding box\u2014you only need to know WHERE the center of the object is! FOMO replaces bounding box regression with a pixel-level Centroid Heatmap. The model outputs a compact 2D grid where each cell predicts the probability of an object's centroid. Compare FOMO with YOLO-Fastest: FOMO uses 30x less memory, runs up to 30x faster, and enables real-time object counting under 100 KB of SRAM!",
    "conceptInvariant": "Centroid Heatmap Localization Invariant: FOMO replaces bounding box coordinate regression with spatial centroid classification over a downsampled grid: Y \u2208 [0, 1]^{H/8 \u00d7 W/8 \u00d7 C}, eliminating anchor boxes, IoU calculations, and NMS overhead, bounding inference memory to O(C \u00d7 H \u00d7 W / 64) bytes.",
    "failureMode": "Deploying YOLOv4-Tiny on an STM32 with 320 KB RAM; the bounding box regression layers and anchor box memory require 1.8 MB of activation RAM, forcing the application into an immediate hard out-of-memory crash.",
    "tryItFriction": "Construct a FOMO Centroid Object Detection engine in TypeScript: take a 96x96 grayscale image; pass it through a simulated MobileNetV1 feature backbone downsampled by 8x (producing a 12x12 grid); apply a 1x1 convolution with Softmax to predict object centroid probabilities; implement local peak finding to extract (X, Y) coordinates; and verify real-time object counting with zero anchor box math.",
    "socraticHints": [
      "Why is predicting object centroids vastly cheaper for a microcontroller than predicting bounding boxes?",
      "Because bounding box models must predict 4 continuous floating-point numbers (X, Y, Width, Height) for multiple anchor boxes at EVERY grid cell, followed by expensive IoU (Intersection-over-Union) sorting!",
      "FOMO simply treats each grid cell as a standard classification problem: 'Is there an object centroid in this cell? Yes or No?'"
    ],
    "situationalPuzzle": {
      "scenario": "A smart agriculture startup designs an autonomous bee counter mounted at the entrance of a beehive. The device uses an ARM Cortex-M7 (512 KB RAM) powered by a small solar panel. The engineer tries deploying YOLO-Fastest: it runs at 1.8 FPS, consumes 380 KB of RAM, and draws 180 mA (too high for solar). Migrating to FOMO achieves 24 FPS, consumes 75 KB of RAM, and draws 35 mA. Why was FOMO able to deliver this 13x frame-rate leap?",
      "options": [
        "FOMO only counts dead bees.",
        "Elimination of Anchor Boxes & Bounding Box Regression: FOMO removes all anchor box calculations, width/height regression, and NMS loops, replacing them with a single 12x12 centroid classification grid. This cuts arithmetic operations by over 85% and eliminates intermediate tensor allocations, maximizing frame rate within microamp power budgets.",
        "FOMO requires a high-speed 5G network connection.",
        "The Cortex-M7 was replaced with an NVIDIA H100."
      ],
      "answerIdx": 1,
      "debrief": "FOMO was engineered specifically for constrained microcontrollers. By abandoning bounding box dimensions and focusing exclusively on object centroids, it strips out the most compute-heavy layers of modern object detection (NMS, anchor boxes, IoU clustering). On microcontrollers, FOMO delivers real-time multi-object counting at a fraction of the compute and memory of YOLO."
    },
    "quests": [
      {
        "num": 1,
        "title": "FOMO Centroid Architecture vs Anchor-Box Detection",
        "type": "Concept",
        "description": "Deconstruct centroid heatmap grids, receptive field scaling, anchor box elimination, and peak-finding algorithms on microcontrollers."
      },
      {
        "num": 2,
        "title": "YOLO-Tiny Anchor Box Memory Exhaustion Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded vision crash log where an anchor box regression layer exhausted MCU SRAM; calculate the mathematical memory reduction of switching to FOMO."
      },
      {
        "num": 3,
        "title": "FOMO Centroid Heatmap Detection Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript FOMO engine that generates 12x12 centroid heatmaps from 96x96 inputs, applies threshold peak-finding, and returns object coordinate lists."
      },
      {
        "num": 4,
        "title": "3 AM Autonomous Beehive Counter Latency Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an operational failure in a solar-powered agricultural sensor where slow vision inference caused flying insects to be missed; optimize the pipeline with FOMO."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Memory-Constrained Image Preprocessing: Fixed-Point Bilinear Resizing & Patch-Based Processing",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Edge Vision Preprocessing (Bilinear Resizing & Tile Processing)",
    "spokenGoal": "Before an image reaches the neural network, it must be resized, cropped, and normalized. If your camera outputs a 640x480 VGA image, but your model expects a 96x96 input, how do you resize it without running out of RAM? A 640x480 image is 307 kilobytes in grayscale\u2014it doesn't even fit in RAM on many microcontrollers! Today we master Memory-Constrained Image Preprocessing. First, Fixed-Point Bilinear Resizing: instead of using floating-point coordinates, use 16-bit fixed-point math to compute fractional pixel weights and interpolate between neighboring pixels in integer registers. Second, the game-changing architectural pattern: Tile-Based / Patch-Based Processing. Instead of storing the full image in memory, stream horizontal slices (lines) directly from the camera FIFO, downscale each slice on-the-fly, and write directly into the model's input tensor. You never store the full image in RAM, slashing preprocessing memory from 307 KB to under 2 KB!",
    "conceptInvariant": "Streaming Line-Buffer Resizing Invariant: Memory-constrained image downscaling operates on sliding line buffers: memory footprint is bounded by Memory = O(Line_Width * Kernel_Height), enabling a 640\u00d7480 image to be resized to 96\u00d796 in under 2.5 KB of SRAM by discarding raw scanlines immediately after interpolation.",
    "failureMode": "Allocating a full 640x480 frame buffer in MCU RAM to resize it; the buffer allocation consumes 307 KB out of 320 KB SRAM, leaving zero memory for the neural network Tensor Arena and causing an immediate Out-of-Memory abort.",
    "tryItFriction": "Implement fixed-point streaming bilinear image downscaling in TypeScript: take a simulated 320x240 image; resize to 96x96 using integer fixed-point coordinates (16.16 fixed-point arithmetic); process the image scanline-by-scanline using a 2-line rolling buffer; verify that memory usage remains under 1 KB while output pixels match floating-point bilinear interpolation within 1 LSB.",
    "socraticHints": [
      "How can you resize a 640x480 image down to 96x96 without ever storing 640x480 pixels in RAM?",
      "By processing the camera's incoming DMA lines as they arrive! Bilinear interpolation only needs TWO adjacent vertical scanlines at any moment.",
      "Buffer Line N and Line N+1, interpolate the downscaled row, write it into the model tensor, and discard Line N. You only ever hold 2 lines in memory!"
    ],
    "situationalPuzzle": {
      "scenario": "A firmware developer builds a smart barcode scanner on an STM32 with 128 KB of RAM. The camera outputs 640x480 grayscale frames. The barcode detector expects 128x128. The developer writes: `uint8_t raw_frame[640 * 480];` at the top of the file. The compiler gives an error: 'bss region overflowed by 180 KB'. How does the developer fix this without buying a more expensive chip?",
      "options": [
        "Upgrade the microcontroller to one with 16 MB of external SDRAM.",
        "Implement Streaming Line-Buffer Downscaling: Remove the full-frame array. Configure camera DMA to transfer in 2-line circular chunks (640 * 2 = 1.28 KB). As lines arrive, interpolate down to 128 pixels using fixed-point math and write directly into the model's 16 KB input tensor, fitting effortlessly into 128 KB RAM.",
        "Compress the image using GZIP.",
        "Change the compiler optimization flag to -O3."
      ],
      "answerIdx": 1,
      "debrief": "Holding full high-resolution image frames in embedded SRAM is an architectural anti-pattern. By utilizing streaming line buffers, the MCU processes scanlines on-the-fly as they arrive from the camera interface. Downscaling a 640-pixel line to 128 pixels in real time requires only two scanlines of buffer memory (~1.3 KB), making high-res vision possible on tiny chips."
    },
    "quests": [
      {
        "num": 1,
        "title": "Bilinear Interpolation Math & Fixed-Point Scaling",
        "type": "Concept",
        "description": "Deconstruct 16.16 fixed-point coordinate mapping, four-pixel weighted bilinear interpolation, and rolling line-buffer memory management."
      },
      {
        "num": 2,
        "title": "Full-Frame SRAM Allocation Overflow Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded build failure where a junior engineer tried to store VGA image frames in RAM; demonstrate the 200x memory reduction of rolling line buffers."
      },
      {
        "num": 3,
        "title": "Streaming Fixed-Point Bilinear Rescaling Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing streaming line-buffer bilinear resizing, converting simulated 640x480 inputs to 96x96 outputs using <2 KB of RAM."
      },
      {
        "num": 4,
        "title": "3 AM Barcode Scanner Frame Buffer Exhaustion Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency out-of-memory crash in an industrial handheld scanner by replacing static frame buffers with streaming DMA line-buffer downscalers."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Micro-Vision Performance Profiling: FPS, Latency Budgets & Cache Thrashing Prevention",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "System Profiling & Memory Hierarchy (Cache Misses & Latency Optimization)",
    "spokenGoal": "You have trained your model, quantized it to INT8, and written your preprocessing pipeline. But when you deploy it to your embedded camera hardware, the device runs at a disappointing 4 FPS instead of the expected 20 FPS. Why? Today we master Micro-Vision Performance Profiling. Break down the End-to-End Latency Budget: Total_Latency = T_capture + T_preprocess + T_inference + T_postprocess. Deconstruct the hidden killer of embedded vision performance: CPU Cache Thrashing and Bus Contention. High-end microcontrollers (like Cortex-M7 or ESP32-S3) have L1 Instruction and Data Caches (I-Cache and D-Cache). If your image preprocessing traverses memory vertically (column-by-column) instead of horizontally (row-by-row), every single pixel access triggers an L1 D-Cache Miss, stalling the CPU on slow external memory buses! Master Memory Striding and Cache Line Alignment (32-byte cache lines): ensuring contiguous memory access patterns restores full CPU pipeline efficiency!",
    "conceptInvariant": "Row-Major Memory Traversal & Cache Line Alignment Invariant: Image preprocessing and tensor manipulations must strictly traverse memory in row-major order (stride = 1), aligning buffers to 32-byte cache boundaries; column-major striding triggers cache line thrashing, increasing memory access latency by up to 12x.",
    "failureMode": "Traversing a 96x96 image in column-major order (`for (x) for (y) buffer[y * W + x]`); each access misses the 32-byte L1 D-cache line, stalling the CPU core on every pixel and slashing preprocessing throughput by 80%.",
    "tryItFriction": "Construct a Memory Cache Striding and Latency Benchmark in TypeScript: allocate a 128x128 image matrix; benchmark execution time of row-major traversal (stride = 1) versus column-major traversal (stride = 128); model cache miss penalties; demonstrate that contiguous access is over 8x faster; and calculate end-to-end FPS budgets for a 20 FPS vision pipeline.",
    "socraticHints": [
      "Why is row-major traversal so much faster than column-major traversal in C?",
      "Spatial Locality! When the CPU fetches a single byte, the hardware cache line loads 32 or 64 contiguous bytes into ultra-fast L1 cache.",
      "Row-major access uses all 32 bytes in cache. Column-major access jumps across rows, wasting 31 bytes of the cache line and missing cache on EVERY iteration!"
    ],
    "situationalPuzzle": {
      "scenario": "An embedded vision pipeline on an ARM Cortex-M7 (480 MHz) has an inference latency of 30 ms (capable of 33 FPS). However, the overall system only achieves 12 FPS (83 ms total latency). Profiling reveals that image color conversion and resizing alone takes 50 ms! The code traverses the image vertically: `for (col = 0; col < W; col++) for (row = 0; row < H; row++)`. What single refactoring cuts preprocessing time from 50 ms to 4 ms?",
      "options": [
        "Invert the two loops to iterate row-major: `for (row = 0; row < H; row++) for (col = 0; col < W; col++)`: this aligns memory access with spatial cache lines, eliminating continuous L1 data cache misses and accelerating traversal by >10x.",
        "Increase CPU clock frequency to 2 GHz.",
        "Disable the L1 cache.",
        "Change the image to a black screen."
      ],
      "answerIdx": 0,
      "debrief": "Loop inversion is one of the most famous hardware optimizations in computer science. In C and C++, 2D arrays are stored in row-major order. Iterating column-by-column causes every memory access to jump by a full row stride, missing the L1 cache on every single read. Inverting the loops to row-major order exploits spatial cache lines, accelerating processing by over 10x."
    },
    "quests": [
      {
        "num": 1,
        "title": "Embedded Cache Hierarchy & Memory Bus Architecture",
        "type": "Concept",
        "description": "Deconstruct L1 I-Cache/D-Cache lines, spatial/temporal locality, cache miss penalties, bus contention, and end-to-end FPS latency budgets."
      },
      {
        "num": 2,
        "title": "Column-Major Cache Thrashing Performance Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded profiling report showing 92% D-cache miss rates during image rotation; prove mathematically how row-major access recovers peak throughput."
      },
      {
        "num": 3,
        "title": "End-to-End Micro-Vision Latency Profiler Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript profiler that models capture, preprocessing, INT8 inference, and postprocessing latencies, identifying cache bottlenecks and frame rate ceilings."
      },
      {
        "num": 4,
        "title": "3 AM Smart Traffic Camera Frame Rate Stutter Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency latency regression in a smart intersection camera where an unoptimized image transpose function dropped video throughput from 25 FPS to 6 FPS."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone 6: Micro-Vision Centroid Object Detection & DMA Frame Buffer Pipeline Engine",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Milestone 6 Synthesis (Embedded Micro-Vision Core Capstone)",
    "spokenGoal": "Congratulations on completing Block 7. Today you engineer Milestone 6: a complete Micro-Vision Centroid Object Detection and DMA Frame Buffer Pipeline Engine in TypeScript. Your engine brings together the full embedded computer vision stack: simulated camera DMA double-buffering (ping-pong buffers) preventing frame tearing, streaming fixed-point bilinear downscaling operating in row-major order with cache-aligned lines, and a complete FOMO Centroid Object Detection model running INT8 quantized inference. Your engine will ingest continuous high-resolution camera frames, downscale them on-the-fly using less than 4 KB of auxiliary memory, output 12x12 centroid heatmaps, locate object centers, and sustain a simulated 20+ FPS throughput with zero memory leaks. This milestone solidifies your embedded vision mastery before we dive into advanced audio AI and beamforming.",
    "conceptInvariant": "End-to-End Micro-Vision Pipeline Invariant: The embedded vision pipeline must satisfy: (1) Frame ingest uses DMA double-buffering with zero visual tearing; (2) Preprocessing downscales images on-the-fly using \u2264 4 KB RAM; (3) FOMO centroid inference executes within \u2264 40 ms; and (4) Multiple object coordinates (X, Y) are resolved with \u2265 95% spatial accuracy.",
    "failureMode": "Failing to synchronize the DMA buffer swap with the frame end interrupt (VSYNC); flipping buffers mid-frame produces half-old, half-new composite images that confuse centroid peak detection.",
    "tryItFriction": "Execute the Milestone 6 verification suite: instantiate your vision engine; stream simulated 320x240 camera frames containing multiple moving objects (e.g., packages on a conveyor); downscale on-the-fly to 96x96; run FOMO centroid inference; verify that object counts and (X, Y) coordinates match ground truth; and verify sustained 20 FPS throughput with <80 KB total SRAM consumption.",
    "socraticHints": [
      "When is the only safe moment to flip DMA ping-pong buffers in an embedded camera driver?",
      "During the Vertical Blanking Interval (VSYNC)! Between the last line of Frame N and the first line of Frame N+1, the camera sensor pauses transmission.",
      "Flipping pointers during VSYNC guarantees that neither buffer is being actively written to by the camera DMA hardware!"
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 6 vision engine counts manufactured parts on a conveyor belt. When the belt moves at high speed, the detector occasionally counts a single part twice in adjacent frames. Ground truth shows the part was located at (X=48, Y=90) in Frame 1, and (X=48, Y=94) in Frame 2. What tracking logic prevents double counting across consecutive frames?",
      "options": [
        "Ignore every second frame.",
        "Centroid Hungarian Assignment & Object Tracking: Add a lightweight Centroid Tracker (Kalman filter or Euclidean distance bipartite matching). If an object centroid in Frame N+1 is within a tracking radius \u0394R of an existing track from Frame N, associate it with the existing track rather than incrementing the total count.",
        "Slow down the conveyor belt.",
        "Change the camera lens."
      ],
      "answerIdx": 1,
      "debrief": "Object detection detects objects within a single frame; object tracking follows them across time. Without tracking, an object visible across 10 frames will be counted 10 times. A lightweight Centroid Tracker matches centroids between consecutive frames based on spatial proximity, assigning a persistent ID to each object and incrementing the count only when an object crosses a virtual tripwire."
    },
    "quests": [
      {
        "num": 1,
        "title": "Complete Micro-Vision System Architecture",
        "type": "Concept",
        "description": "Construct the comprehensive system architecture document integrating DVP DMA ping-pong buffers, VSYNC synchronization, line-buffer downscaling, and FOMO heatmap inference."
      },
      {
        "num": 2,
        "title": "VSYNC Desynchronization & Double-Count Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where asynchronous buffer swaps created composite frames, causing a vision model to double-count moving industrial parts."
      },
      {
        "num": 3,
        "title": "Milestone 6 Micro-Vision Pipeline Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 6 Engine featuring DMA double-buffer emulation, row-major bilinear line-resizing, FOMO centroid detection, and multi-object centroid tracking."
      },
      {
        "num": 4,
        "title": "Milestone 6 High-Speed Packaging Conveyor Stress Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 10,000-frame stress test against the Milestone 6 engine under simulated high-speed conveyor movement, verifying 20+ FPS throughput and 99.8% counting accuracy."
      }
    ]
  },
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "I2S Digital Audio Interfacing, PDM MEMS Microphones & Decimation Filtering",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Digital Audio Hardware (I2S, PDM Over-Sampling & Decimation)",
    "spokenGoal": "Welcome to Block 8. Now we explore the world of acoustic intelligence and Edge Audio AI. How does a microcontroller capture high-fidelity sound without noisy analog operational amplifiers? Enter Digital MEMS Microphones and the Inter-IC Sound (I2S) bus. Deconstruct the two dominant digital microphone interfaces: I2S vs PDM. In standard I2S, the microphone outputs multi-bit Pulse Code Modulation (PCM, e.g., 16-bit or 24-bit audio) over three physical lines: Serial Clock (SCK), Word Select / Left-Right Clock (WS/LRCLK), and Serial Data (SD). In contrast, Pulse Density Modulation (PDM) microphones are smaller, cheaper, and more noise-immune! A PDM microphone outputs a 1-bit oversampled delta-sigma bitstream at high clock frequencies (1 to 3 MHz). The density of 1s represents analog amplitude! Master PDM Decimation: to convert the 1-bit high-speed PDM stream into standard 16 kHz 16-bit PCM, the MCU must run a CIC (Cascaded Integrator-Comb) Decimation Filter and an FIR compensation filter in real time!",
    "conceptInvariant": "PDM-to-PCM CIC Decimation Invariant: A 1-bit PDM stream oversampled at frequency f_pdm = R * f_pcm is downsampled by decimation factor R (typically 64x) using a K-stage Cascaded Integrator-Comb (CIC) filter: H(z) = ((1 - z^(-R)) / (1 - z^(-1)))^K, attenuating out-of-band quantization noise and reconstructing 16-bit PCM audio in O(K) additions per sample.",
    "failureMode": "Attempting to decode a 2 MHz PDM microphone stream in software using a standard high-order FIR filter; processing 2,000,000 samples per second with floating-point convolutions consumes 100% of CPU cycles, starving all other tasks.",
    "tryItFriction": "Construct a PDM-to-PCM CIC Decimation Filter in TypeScript: generate a 1-bit PDM stream at 1.024 MHz encoding a 1 kHz test tone; implement a 3-stage CIC decimator with decimation factor R = 64 (downsampling to 16 kHz); apply a half-band FIR droop compensation filter; reconstruct 16-bit PCM audio; and verify that the output tone has >70 dB SNR.",
    "socraticHints": [
      "Why is a Cascaded Integrator-Comb (CIC) filter so uniquely suited for microcontrollers?",
      "Zero Multiplications! A CIC filter uses ONLY additions and subtractions across its integrator and comb stages.",
      "This allows dedicated hardware peripherals (or simple integer assembly loops) to decimate 2 MHz bitstreams with virtually zero CPU power!"
    ],
    "situationalPuzzle": {
      "scenario": "An embedded audio engineer connects two PDM microphones to an STM32 microcontroller to build a stereo voice recorder. The engineer connects both microphone DATA pins to the same single GPIO pin. The microphones output corrupted static. Both microphones share the same clock line. What hardware configuration was omitted?",
      "options": [
        "Microphones cannot share clock lines.",
        "Left/Right Channel Select Pin Configuration: PDM microphones support multiplexing two microphones on a single data line! One mic must have its L/R pin tied to GND (transmitting on clock rising edge, high-impedance on falling edge). The second mic must have its L/R pin tied to VDD (transmitting on falling edge). The single GPIO pin reads both channels cleanly.",
        "The audio requires an analog amplifier.",
        "Digital microphones only work in mono."
      ],
      "answerIdx": 1,
      "debrief": "PDM microphones are brilliantly designed for stereo multiplexing. Each microphone has a Select (L/R) pin. When tied to GND, the microphone drives the DATA line on the clock rising edge and enters high-impedance (tristate) on the falling edge. Tying the second mic to VDD reverses this, allowing both microphones to share a single data wire without bus collisions."
    },
    "quests": [
      {
        "num": 1,
        "title": "I2S vs PDM Bus Physics & CIC Decimation Math",
        "type": "Concept",
        "description": "Deconstruct I2S timing diagrams (BCLK, WS, SD), PDM 1-bit oversampling, CIC integrator/comb difference equations, and decimation droop compensation."
      },
      {
        "num": 2,
        "title": "PDM Dual-Mic Bus Contention Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded audio oscilloscope capture showing distorted, clipped PDM waveforms; pinpoint floating L/R select pins causing simultaneous bus driving."
      },
      {
        "num": 3,
        "title": "PDM-to-PCM CIC Decimation Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing 3-stage CIC decimation filtering, droop compensation, and PCM 16-bit audio reconstruction from raw PDM bitstreams."
      },
      {
        "num": 4,
        "title": "3 AM Voice Recorder Audio Static Crisis Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency audio distortion bug in a commercial voice assistant where improper I2S DMA word-size alignment swapped Left and Right audio channels."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Acoustic Scene Classification: Environmental Sound Recognition & Multi-Head Embeddings",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Environmental Audio AI (Acoustic Scene Classification & Embeddings)",
    "spokenGoal": "While Keyword Spotting listens for human words, Acoustic Scene Classification (ASC) listens to the physical world: baby crying, glass breaking, dog barking, car crash, or water leaking. Today we master Acoustic Scene Classification on constrained edge nodes. Unlike speech (which has clear phonemes and formants), environmental sounds have diverse spectral structures: glass breaking is a sharp broadband high-frequency transient; water running is continuous low-frequency noise; a baby crying has oscillating harmonic pitch tracks. Deconstruct the ESC-50 and AudioSet lightweight architectures: convert 1-second audio clips into log-Mel spectrograms (64 Mel bins \u03a9 32 time steps); pass through a lightweight 2D CNN with Global Average Pooling (eliminating dense layer parameter bloat!). Master Multi-Head Embeddings: extract compact 32-dimensional acoustic embeddings, allowing an edge node to classify the environment (e.g., 'Kitchen', 'Factory Floor', 'Quiet Bedroom') in under 15 milliseconds!",
    "conceptInvariant": "Global Average Pooling (GAP) Parameter Compression Invariant: Replacing heavy fully-connected classification layers with Global Average Pooling (GAP) reduces model parameter count by \u2265 80% and eliminates spatial overfitting, forcing the final convolutional feature maps to act directly as category confidence heatmaps.",
    "failureMode": "Connecting a convolutional feature map of 8x8x64 directly to a Dense(256) layer on an MCU; the dense layer alone requires 8 * 8 * 64 * 256 = 1,048,576 weights (1 megabyte!), blowing past the microcontroller's Flash memory limit.",
    "tryItFriction": "Construct an Acoustic Scene Classifier in TypeScript: take 64x32 log-Mel spectrograms of environmental audio (glass break, engine hum, water leak); implement a 3-layer Convolutional network with Global Average Pooling; pass feature embeddings through a compact classification head; and verify that glass breaking and water leaks are separated with >95% confidence.",
    "socraticHints": [
      "Why is Global Average Pooling (GAP) vastly superior to Flatten + Dense layers for microcontrollers?",
      "Because Flattening creates massive weight matrices! If your last conv layer is 8x8x64 (4,096 numbers), connecting that to a Dense(128) layer requires over 500,000 weight parameters!",
      "Global Average Pooling simply computes the average of each 8x8 slice, reducing the 4,096 numbers to just 64 numbers with ZERO weights!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart home security company deploys a glass-break detector running on a coin-cell battery. The engineering team trains a 2D CNN on clean recordings of broken windows. In customer homes, the detector triggers false alarms whenever metal spoons clink together or someone keys their front door. Why did clean training data fail, and how is it resolved?",
      "options": [
        "Spoons and glass produce the exact same frequency.",
        "Lack of Background Audio Data Augmentation: Clean training data lacked ambient household noise. High-frequency metal transients share acoustic energy with glass fractures. Training the model with Data Augmentation (mixing background kitchen clatter, spoon clinks, and television dialogue into the training set) teaches the network to distinguish genuine shattering resonance from brief metallic clicks.",
        "The microphone was too sensitive.",
        "The model requires an internet connection."
      ],
      "answerIdx": 1,
      "debrief": "Acoustic AI models trained in sterile lab conditions fail in production due to acoustic confounders. Spoon clinks, keys jingling, and dog tags produce high-frequency spectral spikes that mimic breaking glass. Training with heavy background data augmentation (mixing noise, clatter, and non-target transient sounds) forces the model to learn the distinct sustained resonance and multi-stage fragmentation physics of genuine glass breakage."
    },
    "quests": [
      {
        "num": 1,
        "title": "Acoustic Scene Classification & GAP Architecture",
        "type": "Concept",
        "description": "Deconstruct environmental sound physics (ESC-50, UrbanSound8K), Global Average Pooling parameter reduction, and log-Mel spectrogram feature mapping."
      },
      {
        "num": 2,
        "title": "Dense Layer Flash Memory Bloat Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded model compilation report where a flattened dense layer consumed 1.2 MB of flash; demonstrate how Global Average Pooling shrank model size by 85%."
      },
      {
        "num": 3,
        "title": "Acoustic Scene Classification & GAP Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing log-Mel spectrogram feature extraction, convolutional feature extraction, Global Average Pooling, and multi-class environmental classification."
      },
      {
        "num": 4,
        "title": "3 AM Glass Break False Alarm Security Crisis Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an urgent security false-alarm storm where household kitchen clatter triggered automated police dispatches; retrain with acoustic augmentation and temporal envelope validation."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Voice Activity Detection (VAD) & Spectral Subtraction Noise Suppression",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Front-End Audio Conditioning (VAD Gating & Spectral Subtraction)",
    "spokenGoal": "Why run an expensive speech recognition or keyword spotting neural network when NO ONE is talking? If a room is silent 90% of the day, running a neural network continuously wastes 90% of your battery! Enter Voice Activity Detection (VAD) and Noise Suppression. VAD is an ultra-lightweight front-end gate that determines whether human speech is present in an audio frame. Traditional VAD combines Short-Time Energy with Zero-Crossing Rate (ZCR): human speech has high energy and distinct pitch periodicity, while silence has near-zero energy. If VAD returns false, the entire downstream neural network stays powered down! When speech is detected, how do we clean up continuous background noise (air conditioning hum, car engine rumble)? Through Spectral Subtraction! During silent periods, estimate the Noise Power Spectrum |N(f)|^2. During speech, subtract the noise spectrum from the noisy speech spectrum: |S_clean(f)| = \u221a(max(|Y(f)|^2 - \u03b1 * |N(f)|^2, \u03b2 * |Y(f)|^2)), recovering crystal-clear speech!",
    "conceptInvariant": "Spectral Subtraction & VAD Gating Invariant: VAD gates neural network execution, reducing average compute duty cycle by \u2265 85%; Spectral Subtraction cleans noisy speech spectra via: |S(f)|^2 = max(|Y(f)|^2 - \u03b1 * |N(f)|^2, \u03b2 * |N(f)|^2), where over-subtraction factor \u03b1 \u2265 1.5 and spectral floor \u03b2 \u2248 0.02 suppress musical noise artifacts.",
    "failureMode": "Performing naive spectral subtraction with spectral floor \u03b2 = 0; random noise fluctuations cause isolated spectral peaks to pop in and out, creating artificial, ear-piercing 'musical noise' artifacts that confuse the downstream neural network.",
    "tryItFriction": "Construct a real-time VAD and Spectral Subtraction engine in TypeScript: compute Short-Time Energy and Zero-Crossing Rate on incoming audio frames; classify speech vs silence; track an adaptive background noise profile during silence; subtract noise spectra from noisy speech; implement a spectral floor \u03b2 = 0.02; and prove that SNR improves by >15 dB without musical noise.",
    "socraticHints": [
      "What is 'musical noise' in audio signal processing, and how is it prevented?",
      "Musical noise consists of random, metallic ringing tones created when spectral subtraction over-subtracts noise, leaving isolated, random frequency spikes!",
      "Setting a small 'spectral floor' \u03b2 (e.g., 2% of original noise) ensures the background sounds like a quiet, smooth hiss rather than metallic alien beeps!"
    ],
    "situationalPuzzle": {
      "scenario": "A wearable hearing assistant uses an INT8 neural noise-reduction model on an ARM Cortex-M4. The battery dies in 8 hours. Profiling reveals the neural model runs continuously at 100% duty cycle, even when the wearer is asleep in a silent bedroom. What architectural front-end extends battery life to 36 hours?",
      "options": [
        "Turn off the device manually every night.",
        "Implement an Energy/ZCR Voice Activity Detector (VAD) front-end: An ultra-lightweight VAD running in microamps (<1% CPU) evaluates incoming audio. While the room is silent or has only steady noise, the heavy neural network is kept in deep sleep. The neural model wakes up ONLY when human speech is detected, slashing active duty cycle by 80%.",
        "Reduce audio quality to 4 kHz.",
        "Remove the microphone."
      ],
      "answerIdx": 1,
      "debrief": "VAD is the ultimate power-saving gate in audio TinyML. Running neural networks on silence or static ambient noise is a waste of battery. A simple energy and zero-crossing VAD costs negligible CPU cycles to evaluate. Gating the heavy neural network behind a VAD drops average power consumption by 70-85%, directly extending battery life."
    },
    "quests": [
      {
        "num": 1,
        "title": "VAD Physics & Spectral Subtraction Noise Reduction",
        "type": "Concept",
        "description": "Deconstruct Short-Time Energy, Zero-Crossing Rate, stationary noise tracking, over-subtraction factors (\u03b1), and spectral floor (\u03b2) mitigation of musical noise."
      },
      {
        "num": 2,
        "title": "Musical Noise Artifact & False Wakeup Detective",
        "type": "Detective Challenge",
        "description": "Analyze an audio clean-up pipeline where aggressive zero-floor subtraction created metallic ringing artifacts that triggered false wake-word activations."
      },
      {
        "num": 3,
        "title": "Real-Time VAD & Spectral Subtraction Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing energy/ZCR voice activity detection, online background noise profile estimation, and musical-noise-free spectral subtraction."
      },
      {
        "num": 4,
        "title": "3 AM Hearing Aid Battery Exhaustion Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a battery life crisis in a smart hearing assistant by deploying an adaptive VAD gating pipeline that power-gates deep learning filters during quiet intervals."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Beamforming & Microphone Arrays: Delay-and-Sum Beamforming & Direction of Arrival (DoA)",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Spatial Audio Signal Processing (Acoustic Beamforming & Direction of Arrival)",
    "spokenGoal": "How does a smart speaker hear your voice from 5 meters away across a noisy living room while music is blasting from its own speakers? Through Microphone Arrays and Acoustic Beamforming. When a sound wave arrives at an array of spaced microphones (e.g., two microphones spaced d = 6 cm apart), the sound wave strikes the closer microphone first and reaches the farther microphone with a Time Difference of Arrival (TDoA): \u03c4 = d * cos(\u03b8) / c. Master Direction of Arrival (DoA) Estimation: by computing the Generalized Cross-Correlation with Phase Transform (GCC-PHAT) between the two microphone signals, the peak correlation lag reveals the exact angle of arrival \u03b8 of the speaker! Master Delay-and-Sum Beamforming: by introducing compensating time delays to align the microphone signals in phase and summing them together, sound arriving from the target angle reinforces constructively (+6 dB), while ambient noise and room reverberation cancel destructively!",
    "conceptInvariant": "Spatial Constructive Interference & GCC-PHAT Invariant: Sound arriving at an array of M microphones with spacing d at angle \u03b8 produces relative time delays \u03c4_m = m * d * cos(\u03b8) / c; Delay-and-Sum beamforming aligns and sums signals: y[n] = (1/M) * \u2211_{m=0}^{M-1} x_m[n + \u03c4_m], providing an array gain of 10*log10(M) dB against uncorrelated ambient noise.",
    "failureMode": "Spacing microphones farther apart than half the acoustic wavelength (d > \u03bb / 2 = c / (2 * f_max)); spatial aliasing creates artificial grating lobes that boost noise from unwanted angles, destroying speech clarity.",
    "tryItFriction": "Construct a Dual-Microphone GCC-PHAT DoA and Delay-and-Sum Beamformer in TypeScript: simulate two microphones spaced 6 cm apart; synthesize a speech source at angle \u03b8 = 45\u00b0 with added background noise; compute GCC-PHAT cross-correlation; extract the peak lag; compute the estimated angle; apply delay-and-sum filtering; and demonstrate a >6 dB boost in target voice SNR.",
    "socraticHints": [
      "Why must microphone spacing d satisfy d \u2264 \u03bb / 2 for spatial beamforming?",
      "Spatial Nyquist Theorem! Just like temporal sampling requires f_s > 2 * f_max to avoid temporal aliasing.",
      "Spatial sampling requires microphone spacing d \u2264 \u03bb / 2 to avoid spatial aliasing (grating lobes that create false phantom listening directions)!"
    ],
    "situationalPuzzle": {
      "scenario": "A smart home assistant with a 4-microphone array fails to understand voice commands whenever high-frequency music (>4 kHz) is playing. Microphone spacing on the device is d = 8.5 cm. Acoustic analysis shows the beamformer develops secondary listening lobes that amplify the music instead of the speaker. What acoustic design flaw caused this spatial aliasing?",
      "options": [
        "The microphones were installed backwards.",
        "Spatial Aliasing from Excessive Microphone Spacing: At 4 kHz, sound wavelength is \u03bb = c / f = 343 / 4000 = 8.5 cm. The spatial Nyquist limit is d \u2264 \u03bb / 2 = 4.25 cm. Spacing microphones at 8.5 cm violates the spatial Nyquist theorem, creating spatial grating lobes that pick up high-frequency music from unwanted angles. Reducing spacing to \u2264 4.2 cm eliminates grating lobes.",
        "The room had too much oxygen.",
        "Microphone arrays only work for low-pitched voices."
      ],
      "answerIdx": 1,
      "debrief": "Spatial aliasing is the spatial equivalent of frequency aliasing in ADCs. If microphones are spaced further than half the acoustic wavelength (\u03bb/2), the phase difference between sensors wraps around 2\u03c0. This creates 'grating lobes' (phantom beams) that amplify interference from incorrect angles. For 4 kHz audio, spacing must not exceed 4.25 cm."
    },
    "quests": [
      {
        "num": 1,
        "title": "Acoustic Beamforming Physics & GCC-PHAT Math",
        "type": "Concept",
        "description": "Deconstruct Time Difference of Arrival (TDoA), GCC-PHAT cross-correlation, Delay-and-Sum array gain, and spatial Nyquist grating lobe limits."
      },
      {
        "num": 2,
        "title": "Spatial Grating Lobe & Beamformer Blinding Detective",
        "type": "Detective Challenge",
        "description": "Analyze an acoustic array polar response plot where excessive sensor spacing caused grating lobes to amplify side-angle interference; calculate optimal sensor placement."
      },
      {
        "num": 3,
        "title": "Dual-Microphone GCC-PHAT DoA & Beamforming Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine implementing GCC-PHAT direction-of-arrival estimation, steering delay computation, and Delay-and-Sum spatial filtering."
      },
      {
        "num": 4,
        "title": "3 AM Conference Room Smart Speaker Deafness Lab",
        "type": "Production Incident Lab",
        "description": "Resolve a high-severity acoustic failure in a commercial conference room speaker where room reverberations corrupted TDoA peaks, designing adaptive PHAT weighting."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone 7: Real-Time Dual-Mic PDM Audio Beamformer & Voice Activity Detection Engine",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Milestone 7 Synthesis (Spatial Audio & Front-End Conditioning Capstone)",
    "spokenGoal": "Outstanding achievement reaching Milestone 7. Today you synthesize everything learned across Block 8 to engineer a Real-Time Dual-Mic PDM Audio Beamformer and Voice Activity Detection Engine in TypeScript. Your engine brings together the full front-end acoustic signal processing stack: high-speed 1-bit PDM stream ingestion with 3-stage CIC decimation down to 16-bit 16 kHz PCM audio, an ultra-low-power Voice Activity Detector (VAD) utilizing Short-Time Energy and Zero-Crossing Rate to power-gate downstream models, a GCC-PHAT Direction of Arrival (DoA) estimator locating speakers across 180 degrees, and a Delay-and-Sum Beamformer with Spectral Subtraction noise suppression. Your engine will ingest noisy dual-microphone streams, identify when a human speaks, steer an acoustic beam directly toward the speaker, suppress background air-conditioning noise by >15 dB with zero musical noise, and emit clean PCM frames ready for Keyword Spotting. This milestone completes your front-end audio intelligence.",
    "conceptInvariant": "End-to-End Audio Front-End Invariant: The acoustic front-end must guarantee: (1) CIC decimation downsamples 1-bit PDM to 16-bit PCM with \u2265 65 dB SNR; (2) VAD gates downstream compute during non-speech intervals; (3) DoA estimates speaker angle within \u00b110\u00b0; and (4) Spatial beamforming + spectral subtraction improves voice SNR by \u2265 15 dB.",
    "failureMode": "Applying fixed beamforming delays without continuous DoA tracking; as the speaker walks across the room, they move out of the fixed beam, causing their voice to be attenuated along with the noise.",
    "tryItFriction": "Execute the Milestone 7 verification suite: feed two noisy PDM microphone streams into the engine simulating a speaker at 60\u00b0 with 10 dB ambient factory background noise; verify that CIC decimation reconstructs audio; verify that VAD triggers only during speech; verify that DoA resolves the angle within \u00b15\u00b0; and assert that the beamformed, noise-suppressed speech stream achieves >20 dB SNR improvement.",
    "socraticHints": [
      "Why must DoA estimation be calculated ONLY when the VAD confirms speech is active?",
      "Because during silence, the cross-correlation algorithm will calculate the angle of random background noise or room reverberation!",
      "Gating DoA updates behind VAD ensures the beamformer steers towards human speech, not air-conditioning ducts!"
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 7 audio engine operates on an edge voice assistant. When tested in a high-reverberation tiled bathroom, DoA angle estimates jump wildly between 20\u00b0, 110\u00b0, and 160\u00b0 every frame, causing the beamformer to flutter and garble the output speech. What acoustic filtering mechanism stabilizes the steering angle?",
      "options": [
        "Turn off the beamformer completely.",
        "GCC-PHAT Peak Temporal Smoothing & Reverberation Hysteresis: Acoustic reflections bounce off hard tile walls, creating secondary correlation peaks. Implementing exponential temporal smoothing on the DoA angle (\u03b8_{smooth} = \u03b1 * \u03b8_{new} + (1 - \u03b1) * \u03b8_{old}) and tracking peak prominence suppresses reverberation flutter, keeping the beam locked on the primary speaker.",
        "Add a blanket over the microphone.",
        "Increase audio volume to maximum."
      ],
      "answerIdx": 1,
      "debrief": "In reverberant environments (bathrooms, tiled offices), wall reflections create delayed multi-path copies of the sound wave. If the engine recalculates steering angle on raw frame-by-frame peaks, the beam flutters between the direct path and wall reflections, chopping audio. Temporal smoothing and prominence tracking lock the beam to the direct-path wavefront."
    },
    "quests": [
      {
        "num": 1,
        "title": "Integrated Spatial Audio Processing Architecture",
        "type": "Concept",
        "description": "Construct the master architecture document integrating PDM CIC decimation, VAD energy/ZCR gating, GCC-PHAT DoA estimation, and Delay-and-Sum spatial filtering."
      },
      {
        "num": 2,
        "title": "Reverberation Multipath Flutter Detective",
        "type": "Detective Challenge",
        "description": "Analyze an automated test log where room echo caused a dual-mic beamformer to oscillate rapidly between direct and reflected sound waves; evaluate temporal angle smoothing."
      },
      {
        "num": 3,
        "title": "Milestone 7 Dual-Mic PDM Audio Beamformer Engine",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 7 Engine featuring CIC PDM decimation, VAD speech gating, GCC-PHAT DoA angle estimation, and spectral subtraction noise cleanup."
      },
      {
        "num": 4,
        "title": "Milestone 7 Production Stress & Reverberation Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 50,000-frame audio stress test against the Milestone 7 engine in simulated reverberant, noisy environments, proving stable beam steering and zero audio distortion."
      }
    ]
  },
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Neural Processing Units (NPUs) on MCU: ARM Ethos-U55/U65, Command Streams & Scratchpad SRAM",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Edge Hardware Acceleration (Micro-NPUs & Hardware Command Streams)",
    "spokenGoal": "Welcome to Block 9. In the past, microcontrollers ran neural networks on general-purpose CPUs using SIMD instructions. Today, silicon is undergoing a seismic revolution: the integration of dedicated on-chip Neural Processing Units (NPUs) like the ARM Ethos-U55 and Ethos-U65 into sub-$5 microcontrollers! How does an embedded NPU operate? The Ethos-U55 is not a standalone processor with its own operating system; it is a dedicated hardware co-processor wired directly to the Cortex-M CPU. The main CPU does not execute convolutions; it compiles the neural network offline using the Vela compiler into an NPU Command Stream and Weight Stream stored in Flash. At runtime, the CPU initializes the NPU registers with the command stream pointer, and the NPU hardware autonomous DMA engine takes over! The NPU fetches weights, loads activations into a dedicated fast Scratchpad SRAM, executes thousands of MACs per clock cycle, and fires an interrupt back to the CPU upon completion. This delivers up to 90% energy savings and a 50x speedup over software inference!",
    "conceptInvariant": "NPU Hardware Offload & Scratchpad SRAM Invariant: The NPU co-processor executes model layers autonomously from pre-compiled command streams in Flash; all intermediate activations are mapped into high-speed Scratchpad SRAM via dedicated NPU DMA channels, freeing the main CPU core to sleep or service critical hard-real-time interrupts.",
    "failureMode": "Failing to compile a TFLM model with the ARM Vela compiler before deploying to an Ethos-U55 chip; without Vela command stream conversion, the model falls back to software CPU execution, running 50x slower and drawing 10x more power while the NPU sits completely idle.",
    "tryItFriction": "Construct an NPU Command Stream and Scratchpad SRAM Simulator in TypeScript: define a 3-layer neural network; compile layer definitions into simulated Ethos-U55 NPU command opcodes (NPU_OP_CONV2D, NPU_OP_DEPTHWISE, NPU_OP_MAXPOOL); simulate NPU DMA transfers into an SRAM scratchpad; benchmark CPU cycles saved; and verify that NPU hardware offload achieves >25x acceleration over CPU software loops.",
    "socraticHints": [
      "What is the role of the ARM Vela compiler in the Ethos-U55 NPU toolchain?",
      "Vela is an offline model optimization compiler! It takes an optimized `.tflite` model and reorganizes operators specifically for Ethos hardware.",
      "Vela compiles weights into NPU compressed streams, schedules DMA transfers between Flash and Scratchpad SRAM, and outputs an NPU command stream that the Ethos driver executes directly!"
    ],
    "situationalPuzzle": {
      "scenario": "A hardware engineer designs an edge AI sensor using an NXP microcontroller with an ARM Cortex-M55 CPU and an integrated Ethos-U55 NPU (256 MACs/cycle). The firmware deploys a TFLM model. Benchmarks show the model takes 85 ms to execute\u2014identical to running on the Cortex-M55 CPU alone. The NPU does not seem to be accelerating inference. What configuration step was omitted in the firmware build?",
      "options": [
        "The NPU clock was set to 5 GHz.",
        "Missing Ethos Driver & Vela Compilation: The `.tflite` model was not compiled using the ARM Vela compiler, so it contains standard TFLM CPU operators rather than Ethos command streams. Additionally, the firmware must link the Ethos-U driver (`ethosu_driver`) to register the NPU hardware delegate with TFLM. Running Vela and enabling the delegate activates the NPU, dropping latency from 85 ms to 2.8 ms.",
        "The microcontroller required a cooling fan.",
        "Ethos NPUs only work on Tuesdays."
      ],
      "answerIdx": 1,
      "debrief": "Microcontroller NPUs require offline model lowering. The standard TFLM runtime cannot automatically map generic operators to proprietary NPU registers at runtime. The ARM Vela compiler must compile the `.tflite` model offline, packaging operators into hardware command streams. Linking the Ethos-U driver allows TFLM to hand off execution directly to the NPU hardware co-processor."
    },
    "quests": [
      {
        "num": 1,
        "title": "ARM Ethos-U55 NPU Architecture & Hardware Dataflows",
        "type": "Concept",
        "description": "Deconstruct Ethos-U co-processor architecture, Vela offline compiler lowering, command stream formats, and Scratchpad SRAM vs Flash data paths."
      },
      {
        "num": 2,
        "title": "Uncompiled Fallback & Idle NPU Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded firmware benchmark where an NPU-equipped MCU exhibited zero performance gain; prove why missing Vela lowering caused CPU fallback."
      },
      {
        "num": 3,
        "title": "Ethos-U Command Stream & Scratchpad SRAM Simulator",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript engine simulating NPU command stream dispatch, DMA scratchpad transfers, autonomous hardware MAC execution, and completion interrupts."
      },
      {
        "num": 4,
        "title": "3 AM Smart Camera Frame Drop NPU Optimization Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency latency bottleneck in an industrial smart camera by compiling a vision model with Vela and tuning Ethos-U55 scratchpad SRAM allocations."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Custom Edge AI Accelerators: Systolic Arrays, MAC Dataflows (Weight/Output Stationary)",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Silicon Micro-Architecture (Systolic Arrays & Dataflow Optimization)",
    "spokenGoal": "How do AI accelerator chips compute billions of multiplications per second while consuming less than 1 watt of power? Today we master the silicon micro-architecture of Edge AI Accelerators: Systolic Arrays. In traditional CPUs, every single multiplication requires fetching an operand from memory, executing the ALU, and writing back to memory\u2014consuming massive energy! A Systolic Array (pioneered by H.T. Kung and popularized by Google's TPU) arranges processing elements (PEs) into a 2D grid. Data flows through the grid rhythmically like blood pumped by a heart (systole). Once an input or weight enters the array, it is passed directly to neighboring PEs without ever going back to memory! Master Dataflow Taxonomies: Weight Stationary (weights stay stationary inside PEs while inputs stream through; minimizes weight memory reads, ideal for CNNs); Output Stationary (accumulators stay stationary inside PEs until a complete dot product finishes; minimizes write-backs); and Input Stationary. Dataflow choice dictates energy efficiency!",
    "conceptInvariant": "Systolic Data Reuse & Energy Minimization Invariant: In an N \u00d7 N systolic array, each fetched data element is reused N times across neighboring Processing Elements (PEs) via direct register forwarding, reducing SRAM memory access energy by a factor of N: E_memory = E_fetch / N.",
    "failureMode": "Designing a neural accelerator using an Input Stationary dataflow for a model with giant dense layers; weights must be fetched from external memory on every single clock cycle, choking the memory bus and multiplying energy consumption by 10x.",
    "tryItFriction": "Implement an interactive 4x4 Systolic Array Simulator in TypeScript: model a grid of 16 Processing Elements (PEs) with Multiply-Accumulate (MAC) logic; implement Weight Stationary dataflow (weights pre-loaded in PEs); stream input vectors diagonally with 1-cycle skew delays; compute matrix multiplication step-by-step; and verify that all 16 results are computed with zero intermediate memory accesses.",
    "socraticHints": [
      "Why must input data be skewed diagonally when entering a systolic array?",
      "Because data propagates across the array with a 1-clock-cycle delay between adjacent PEs!",
      "If you injected all inputs simultaneously, PE(1,1) would receive inputs before its neighbor PE(1,2) was ready. Skewing inputs diagonally ensures inputs and weights arrive at each PE at the EXACT clock cycle when their corresponding calculation must occur!"
    ],
    "situationalPuzzle": {
      "scenario": "A silicon design team develops a low-power edge AI accelerator for wearable audio processing. The team compares two dataflow architectures: Weight Stationary vs Output Stationary. The workload consists of small 1D convolutional layers where the same filter weights are reused across thousands of audio time samples. Which dataflow architecture achieves the lowest energy consumption?",
      "options": [
        "Output Stationary, because accumulators never move.",
        "Weight Stationary Dataflow: Because the same filter weights are reused across thousands of consecutive audio samples, keeping weights stationary inside the PEs means weights are loaded from SRAM exactly ONCE. Inputs flow through continuously, slashing high-energy weight SRAM reads by 99%.",
        "Both consume identical energy regardless of dataflow.",
        "Systolic arrays cannot process audio."
      ],
      "answerIdx": 1,
      "debrief": "Energy in digital silicon is dominated by memory movement, not math. Reading a byte from SRAM consumes 10x to 100x more energy than computing an 8-bit multiplication. For convolutional filters that process long time-series audio streams, Weight Stationary dataflow keeps weights pinned in PE registers, completely eliminating repeated weight memory fetches and maximizing battery life."
    },
    "quests": [
      {
        "num": 1,
        "title": "Systolic Array Micro-Architecture & Dataflow Taxonomies",
        "type": "Concept",
        "description": "Deconstruct Processing Element (PE) pipelines, 2D mesh forwarding, Weight Stationary vs Output Stationary vs Input Stationary dataflows, and energy models."
      },
      {
        "num": 2,
        "title": "Memory Bus Bottleneck & Dataflow Mismatch Detective",
        "type": "Detective Challenge",
        "description": "Analyze an AI accelerator simulation report where a memory bus was saturated at 100%; demonstrate how switching to Weight Stationary dataflow eliminated redundant SRAM fetches."
      },
      {
        "num": 3,
        "title": "4x4 Systolic Array Matrix Multiplication Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript simulation of a 4x4 Weight Stationary systolic array, modeling cycle-by-cycle diagonal input skewing, register forwarding, and output accumulation."
      },
      {
        "num": 4,
        "title": "3 AM Silicon Power Budget Emergency Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an unacceptably high power dissipation report in a custom edge AI ASIC by re-architecting the tensor accelerator dataflow to maximize local PE register reuse."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Edge AI Compilers: Apache TVM MicroTVM, TinyEngine & Ahead-of-Time (AOT) Code Generation",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Compilers & Code Generation (MicroTVM & Ahead-of-Time C Synthesis)",
    "spokenGoal": "While runtimes like TFLM interpret model graphs at runtime using flatbuffer pointers and virtual function tables, is there an even faster, leaner way? Yes: Ahead-of-Time (AOT) Compilation! Frameworks like Apache TVM (MicroTVM) and MIT's TinyEngine do not ship an interpreter to the microcontroller at all. Instead, they compile the neural network Ahead-of-Time directly into pure, unrolled, bare-metal C code! Deconstruct the power of AOT Code Generation: First, zero interpreter overhead: virtual function calls, node resolution, and graph traversal loops are completely eliminated! Second, zero framework overhead: you don't need flatbuffer parsers or schema readers in Flash, saving 50 to 100 KB of Flash code size! Third, TinyEngine's memory optimization: traditional runtimes store activation tensors layer-by-layer; TinyEngine uses Patch-Based Inference that fuses convolution and pooling into micro-patches, slashing peak SRAM consumption by up to 8x! This allows models that normally require 500 KB of RAM to run inside 64 KB of SRAM!",
    "conceptInvariant": "Ahead-of-Time (AOT) Code Generation Invariant: AOT compilation translates a neural graph into pure static C functions with hardcoded layer dimensions, constant pointer offsets, and static global buffers, eliminating runtime interpreter overhead (O(0) dispatch latency) and removing all runtime model parsing libraries from Flash.",
    "failureMode": "Deploying an interpreted TFLM runtime on an ultra-constrained Cortex-M0+ with only 32 KB Flash; the TFLM runtime library alone consumes 45 KB of Flash, failing to fit on the chip before the model is even loaded; AOT compiled C code fits in under 8 KB.",
    "tryItFriction": "Construct a MicroTVM / TinyEngine AOT C-Code Generator in TypeScript: take a 3-layer neural network; compile the forward pass into pure, self-contained C code with statically allocated buffers; generate unrolled matrix multiplications with hardcoded dimensions; verify that the generated C code compiles with zero external dependencies and executes 2x faster than interpreted TFLM.",
    "socraticHints": [
      "Why does an Ahead-of-Time (AOT) compiled model execute faster than an interpreted model?",
      "Because the C compiler (GCC or Clang) can optimize the ENTIRE model end-to-end at compile time!",
      "Loops have constant boundaries, pointers are fixed, and the compiler can inline functions, unroll loops, and schedule registers with zero runtime interpretation overhead!"
    ],
    "situationalPuzzle": {
      "scenario": "A medical device startup builds a cardiac arrhythmia detector on an ultra-low-power Nordic nRF52832 (64 KB RAM, 512 KB Flash). The team attempts to run a 1D-CNN with TFLM. The application fails to link because the TFLM runtime and Tensor Arena exceed available RAM. Switching to Ahead-of-Time compilation with TinyEngine compiles the model into pure C with patch-based memory reuse. What memory reduction does the team observe?",
      "options": [
        "Memory usage increases because C code is larger than FlatBuffers.",
        "SRAM drops from 72 KB to 14 KB (an 80% reduction), and Flash footprint shrinks by 65 KB because the entire TFLM interpreter library is eliminated, allowing the model to fit comfortably into the nRF52832.",
        "The model can only run in the cloud.",
        "TinyEngine requires 16 GB of DDR5 RAM."
      ],
      "answerIdx": 1,
      "debrief": "Interpreted runtimes carry inherent memory overhead: the interpreter state, operator resolver tables, flatbuffer parser, and layer-by-layer activation buffers. AOT compilers (like MicroTVM and TinyEngine) synthesize direct C code with compile-time memory planning. Eliminating the interpreter library and using patch-based memory reuse slashes RAM and Flash footprints by up to 80%."
    },
    "quests": [
      {
        "num": 1,
        "title": "AOT Compilation Architecture & MicroTVM Mechanics",
        "type": "Concept",
        "description": "Deconstruct Ahead-of-Time code generation, operator fusion, TinyEngine patch-based memory scheduling, and interpreter overhead elimination."
      },
      {
        "num": 2,
        "title": "Interpreter Flash Overhead & Linker Failure Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded build failure where TFLM runtime libraries overflowed a 64 KB flash partition; demonstrate how AOT compiled C code shrank binary footprint."
      },
      {
        "num": 3,
        "title": "Ahead-of-Time Neural-to-C Transpiler Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript AOT transpiler that ingests neural network graphs and generates standalone, dependency-free, memory-optimized C code."
      },
      {
        "num": 4,
        "title": "3 AM Cardiac Monitor SRAM Exhaustion Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an emergency RAM exhaustion failure in an ultra-low-power cardiac patch by migrating from interpreted TFLM to an AOT TinyEngine pipeline."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Benchmarking Edge AI Systems: The MLPerf Tiny Benchmark Suite & Pareto Trade-offs",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Standardized Benchmarking & Pareto Optimization (MLPerf Tiny Metrics)",
    "spokenGoal": "How do you objectively prove that your TinyML system is better than a competitor's? You don't rely on marketing claims; you use the industry gold standard: The MLPerf Tiny Benchmark Suite! Engineered by MLCommons, MLPerf Tiny standardizes edge AI evaluation across four canonical tasks: (1) Keyword Spotting (KWS); (2) Visual Wake Words (VWW - 96x96 person detection); (3) Image Classification (IC - 32x32 CIFAR-10); and (4) Anomaly Detection (AD - ToyADMOS industrial audio). Today we master MLPerf Tiny Benchmarking Metrics: Latency (milliseconds per inference), Energy (microjoules per inference measured via a precision power analyzer like Nordic Power Profiler Kit), Throughput (inferences per second), and Memory Footprint (Flash and SRAM in kilobytes). Master the Pareto Frontier: plotting Accuracy versus Energy consumption. A model that achieves 96% accuracy at 10 mJ is often inferior to a model that achieves 94% accuracy at 0.5 mJ for battery deployments!",
    "conceptInvariant": "MLPerf Tiny Pareto Optimality Invariant: An edge AI deployment is Pareto-optimal if and only if no alternate configuration exists that achieves higher accuracy with equal or lower energy per inference: (Acc_A > Acc_B && Energy_A \u2264 Energy_B) || (Acc_A \u2265 Acc_B && Energy_A < Energy_B).",
    "failureMode": "Benchmarking an edge AI model using CPU clock cycles alone without measuring energy consumption; an NPU co-processor may consume more clock cycles during bus setup but draws 10x less current, rendering cycle-only benchmarks completely misleading.",
    "tryItFriction": "Construct an MLPerf Tiny Benchmarking & Pareto Frontier Analyzer in TypeScript: ingest performance data for 10 model variants across Latency, Energy (\u03bcJ), Flash (KB), SRAM (KB), and Accuracy (%); compute the Pareto-optimal frontier; identify dominated (sub-optimal) models; and select the optimal configuration for a 1-year coin-cell battery budget.",
    "socraticHints": [
      "Why is 'Accuracy' alone an incomplete metric when evaluating Edge AI models?",
      "Because an edge AI model operates under physical hardware constraints!",
      "A 98% accurate model that takes 2 seconds and 50 mJ per inference is completely useless on a coin cell. A 95% model that takes 15 ms and 0.2 mJ will actually survive in the field!"
    ],
    "situationalPuzzle": {
      "scenario": "A TinyML engineering team evaluates three models for an industrial gas pipeline sensor powered by a solar harvester: Model A (96.5% accuracy, 85 ms latency, 1,200 \u03bcJ energy, 180 KB RAM); Model B (95.8% accuracy, 12 ms latency, 150 \u03bcJ energy, 45 KB RAM); Model C (91.0% accuracy, 10 ms latency, 140 \u03bcJ energy, 40 KB RAM). Which model sits on the optimal Pareto frontier for multi-year autonomy?",
      "options": [
        "Model A, because 96.5% is the highest accuracy.",
        "Model B: Sacrificing only 0.7% accuracy compared to Model A delivers an 8x reduction in energy consumption (150 \u03bcJ vs 1,200 \u03bcJ) and a 4x reduction in RAM (45 KB vs 180 KB), allowing the sensor to survive continuous operation on micro-solar harvesting.",
        "Model C, because it is the smallest.",
        "None, edge AI should not be benchmarked."
      ],
      "answerIdx": 1,
      "debrief": "This is a quintessential Pareto trade-off in TinyML. Model A's marginal 0.7% accuracy improvement comes at an enormous 8x energy penalty and 4x RAM penalty, making it impractical for solar harvesting. Model B achieves near-identical accuracy (95.8%) while slashing energy to 150 \u03bcJ, sitting squarely at the sweet spot of the Pareto frontier."
    },
    "quests": [
      {
        "num": 1,
        "title": "MLPerf Tiny Benchmark Suite & Evaluation Protocols",
        "type": "Concept",
        "description": "Deconstruct the 4 canonical MLPerf Tiny tasks (KWS, VWW, IC, AD), Energy per Inference metrics, test harnesses (EEMBC EnergyRunner), and Pareto curves."
      },
      {
        "num": 2,
        "title": "Misleading Metric & Cycle vs Energy Discrepancy Detective",
        "type": "Detective Challenge",
        "description": "Analyze an edge hardware evaluation report where a CPU model with fewer clock cycles consumed 3x more total energy than an NPU model due to high current draw."
      },
      {
        "num": 3,
        "title": "MLPerf Tiny Automated Benchmarking & Pareto Engine",
        "type": "Mastery Assignment",
        "description": "Build an exhaustive TypeScript benchmarking engine that parses latency and energy traces, generates Pareto-optimal frontier curves, and selects optimal deployment models."
      },
      {
        "num": 4,
        "title": "3 AM Solar Harvester Battery Depletion Lab",
        "type": "Production Incident Lab",
        "description": "Resolve an energy deficit in an off-grid environmental sensor by replacing a dominated high-power model with a Pareto-optimal TinyML configuration."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone 8: Ahead-of-Time (AOT) MicroTVM / TinyEngine Model Compilation & NPU Dispatch Engine",
    "stageName": "Stage 3: Advanced Vision, Audio & NPUs",
    "stageNum": 3,
    "pedagogicalRole": "Milestone 8 Synthesis (Hardware Acceleration & Compiler Capstone)",
    "spokenGoal": "Congratulations on completing Block 9. Today you engineer Milestone 8: a production Ahead-of-Time (AOT) MicroTVM and TinyEngine Model Compilation and NPU Dispatch Engine in TypeScript. Your engine brings together the bleeding edge of edge AI hardware acceleration: AOT C-code generation that compiles neural network graphs directly into pure, unrolled, dependency-free C functions with static buffer allocation; an NPU Hardware Dispatcher that models co-processor command streams, DMA scratchpad transfers, and interrupt synchronization for ARM Ethos-U55 architectures; and a comprehensive MLPerf Tiny benchmark profiler evaluating Latency, Energy (\u03bcJ), Flash, SRAM, and Pareto optimality. Your engine will compile a neural model AOT, simulate NPU hardware acceleration, verify a 15x execution speedup over software loops, and prove zero dynamic memory allocations. This milestone cements your mastery of embedded AI compilers and hardware accelerators.",
    "conceptInvariant": "End-to-End AOT & Hardware Acceleration Invariant: The compiler engine must: (1) Synthesize pure, standalone AOT C code with zero external runtime library dependencies; (2) Dispatch operations to simulated NPU hardware command streams with zero CPU polling; and (3) Demonstrate Pareto-superior execution (\u2265 10x throughput, \u2265 80% energy reduction) compared to interpreted runtimes.",
    "failureMode": "Failing to synchronize CPU execution with NPU completion interrupts; the CPU reads output tensors before the NPU DMA has finished writing results, processing stale or partially written memory.",
    "tryItFriction": "Execute the Milestone 8 verification suite: load a 4-layer model; compile to AOT C code; execute simulated NPU command stream dispatch; benchmark execution against interpreted TFLM; verify that AOT + NPU acceleration slashes latency from 45 ms to 2.1 ms and reduces Flash footprint by 70 KB; and verify that Pareto optimization metrics pass all MLPerf Tiny criteria.",
    "socraticHints": [
      "How does an embedded CPU synchronize with an asynchronous NPU co-processor?",
      "Via Hardware Interrupts (IRQ) or Event Wait (WFE)! The CPU starts the NPU command stream and enters low-power sleep (WFE).",
      "When the NPU finishes the last layer, it fires a hardware interrupt, waking the CPU core instantly to process the output tensor!"
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 8 engine compiles a model for an NPU co-processor. The model executes in 2.5 ms. However, when the CPU reads the output class probabilities, the values are all zeros. Oscilloscope traces show the NPU finishes writing output memory 0.2 ms AFTER the CPU returns from its inference function. What synchronization primitive was omitted in the driver?",
      "options": [
        "The CPU should have waited 10 seconds using a busy loop.",
        "Missing Hardware Interrupt Synchronization Barrier: The CPU must not return from `Invoke()` immediately after kicking off the NPU command stream. It must pend on an RTOS Semaphore or hardware interrupt flag (`WFE / WaitForInterrupt`) triggered by the NPU's completion IRQ, ensuring memory coherence before reading results.",
        "The NPU should have been turned off.",
        "Zero values indicate 100% confidence."
      ],
      "answerIdx": 1,
      "debrief": "Hardware co-processors operate asynchronously. Starting an NPU command stream returns immediately. If the main CPU function exits and attempts to read output tensors without waiting for the NPU's completion interrupt, it reads unwritten or stale memory. A synchronization barrier (waiting on a completion semaphore or event flag) guarantees memory coherence."
    },
    "quests": [
      {
        "num": 1,
        "title": "AOT Compilation & NPU Co-Processor Synchronization Architecture",
        "type": "Concept",
        "description": "Construct the comprehensive system architecture document integrating AOT C code synthesis, NPU command stream generation, DMA scratchpads, and IRQ synchronization."
      },
      {
        "num": 2,
        "title": "Asynchronous Race Condition & Stale Output Detective",
        "type": "Detective Challenge",
        "description": "Analyze an embedded driver trace where an asynchronous NPU co-processor caused a CPU race condition, reading unpopulated output buffers."
      },
      {
        "num": 3,
        "title": "Milestone 8 AOT Model Compiler & NPU Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build the complete TypeScript Milestone 8 Engine featuring AOT C-code generation, NPU command stream execution simulation, and MLPerf Tiny Pareto evaluation."
      },
      {
        "num": 4,
        "title": "Milestone 8 Production NPU Stress & Profiling Lab",
        "type": "Production Incident Lab",
        "description": "Execute a 50,000-cycle stress test against the Milestone 8 engine under simulated NPU hardware execution, proving sub-3ms latency, zero memory leaks, and 100% synchronization reliability."
      }
    ]
  },
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "Micro-Transformers & Linear Attention on MCUs: Kernel Slicing & O(N) Memory",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Advanced Edge Sequence Architectures (Transformer Compression on Cortex-M)",
    "spokenGoal": "Welcome to Stage 4. Standard Transformers revolutionized language and vision, but standard Self-Attention requires O(N^2) time and memory! If an IMU sequence has 512 time steps, quadratic attention requires a 512x512 float matrix\u20141 megabyte of RAM just for the attention map, blowing past microcontroller SRAM budgets! Enter Micro-Transformers and Linear Attention. Deconstruct how kernel feature maps (e.g. Performer random feature approximations or Fast Attention via positive orthogonal random features) reorder matrix multiplication: instead of computing (Q @ K.T) @ V which creates an N x N matrix, we compute Q @ (K.T @ V), reducing peak memory from O(N^2) to O(N * d^2) where hidden dimension d is tiny (e.g. d=16 or 32)! Trace Chunked and Sliced Attention: compute attention in rolling tiles of 32 tokens, streaming through SRAM without materializing full attention matrices. Master Causal Masking on embedded time series: ensure predictions at time step t only attend to steps <= t, preserving causality while keeping memory flat across infinite streaming sensor windows!",
    "conceptInvariant": "Linear Attention Reordering & Fixed Memory Invariant: By applying kernel trick decomposition to Softmax attention, matrix associativity reorders attention computation to Q @ (K.T @ V). Peak intermediate memory drops from O(N^2) to O(d^2), enabling microcontrollers with only 64 KB of SRAM to execute transformer-grade sequence modeling over long sensor horizons.",
    "failureMode": "Attempting to run standard multi-head self-attention on an MCU with sequence length N=1024; allocating the N x N attention matrix causes immediate malloc null pointer panics and hard faults, crashing the embedded RTOS.",
    "tryItFriction": "Construct a Linear Attention vs Quadratic Attention memory profiler in TypeScript: synthesize a 128-token multi-variate IMU sequence; compute standard attention and measure the intermediate attention matrix byte footprint; then implement linearized attention via feature map projection Q @ (K.T @ V); prove that peak SRAM allocation drops by over 85% while preserving attention distribution accuracy.",
    "socraticHints": [
      "Why is standard Softmax attention impossible to reorder using matrix associativity?",
      "Because the nonlinear Softmax operator is applied to (Q @ K.T) before multiplying by V!",
      "If we approximate Softmax with a kernel function phi(x) such that K(x,y) = phi(x) @ phi(y).T, the matrix multiplication becomes associative and can be factored into phi(Q) @ (phi(K).T @ V)!"
    ],
    "situationalPuzzle": {
      "scenario": "An embedded engineer ports a transformer-based seismic tremor detector to an STM32H7 with 512 KB SRAM. The model takes a 500-sample accelerometer window. The standard transformer implementation crashes during inference with a MemManage Fault. Inspection shows the forward pass attempts to allocate a 500x500x4 float attention tensor per head across 4 heads. What is the architectural solution?",
      "options": [
        "Increase CPU clock frequency to 480 MHz.",
        "Linear Attention with Sliced Kernel Projection: Replace quadratic Softmax attention with linearized kernel attention (e.g., Performer/Fast Attention) and tiled chunking, reducing the peak attention memory from 4 MB to a static 32x32 kernel accumulator (<4 KB), fitting comfortably in Cortex-M tightly coupled memory.",
        "Convert the floating-point values to ASCII text strings.",
        "Remove the accelerometer sensor and use a button."
      ],
      "answerIdx": 1,
      "debrief": "Quadratic attention memory scales as N^2 * num_heads * sizeof(float). For N=500 and 4 heads, that is 500 * 500 * 4 * 4 = 4,000,000 bytes (4 MB), vastly exceeding the 512 KB SRAM. Linear attention reorders operations to Q @ (K.T @ V), bounding memory by d^2 (where d is feature dimension, e.g., 32), which requires only a few kilobytes of static RAM."
    },
    "quests": [
      {
        "num": 1,
        "title": "Quadratic vs Linear Attention Mathematical Deconstruction",
        "type": "Concept",
        "description": "Analyze Softmax attention complexity O(N^2) vs kernelized linear attention O(N * d^2), associative matrix factorization, and causal masking mechanics."
      },
      {
        "num": 2,
        "title": "Attention Matrix OOM & MemManage Fault Detective",
        "type": "Detective Challenge",
        "description": "Trace an embedded sequence model crash on Cortex-M7; pinpoint how dynamic allocation of attention score matrices exhausted heap memory and triggered an RTOS panic."
      },
      {
        "num": 3,
        "title": "Streaming Linear Attention Kernel Engine",
        "type": "Mastery Assignment",
        "description": "Implement a linear attention operator in fixed-point C / TypeScript with feature projection, chunked processing, and static buffer allocation under 8 KB RAM."
      },
      {
        "num": 4,
        "title": "Industrial Vibration Micro-Transformer Anomaly Detector",
        "type": "Production Incident Lab",
        "description": "Deploy a micro-transformer model on a simulated industrial motor vibration stream; benchmark latency, peak SRAM, and detection accuracy against quadratic baseline."
      }
    ]
  },
  {
    "day": 47,
    "month": 2,
    "blockNum": 10,
    "title": "Temporal Convolutional Networks (TCN) on Cortex-M: Dilated Causal Convolutions",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Long-Horizon Sequential Modeling (TCN vs RNN/LSTM on Resource-Constrained MCUs)",
    "spokenGoal": "While Transformers have attention and RNNs have vanishing gradients, Temporal Convolutional Networks (TCNs) offer the ultimate balance of parallel training, long receptive fields, and bounded inference memory for microcontrollers! Today you build TCNs on bare metal. Deconstruct Dilated Causal Convolutions: a causal convolution ensures that time step t depends only on inputs at or before t, avoiding future information leakage. Dilations introduce gaps d between filter taps (d = 1, 2, 4, 8, 16...). By doubling the dilation rate at each layer, the receptive field grows exponentially (Receptive Field = 1 + sum of 2*(kernel_size - 1)*d) with only a linear increase in model parameters! Analyze memory advantages over LSTMs and Transformers: an LSTM requires recurrent hidden and cell state updates that cannot be vectorized easily with CMSIS-DSP SIMD; a Transformer requires KV-caches. In contrast, a TCN only requires a tiny rolling circular buffer equal to the filter kernel length per dilated layer!",
    "conceptInvariant": "Exponential Receptive Field & Circular History Buffer Invariant: A dilated causal convolutional network expands receptive field exponentially with depth (O(2^L)) while requiring only a fixed-size ring buffer per layer equal to (kernel_size - 1) * dilation taps. Streaming inference requires zero dynamic allocation and runs entirely via CMSIS-NN 1D convolution kernels.",
    "failureMode": "Implementing standard (non-causal) centered convolutions for real-time edge streaming; the network attempts to read future samples that have not yet been acquired by the ADC, resulting in either a 500ms pipeline delay or garbage buffer reads.",
    "tryItFriction": "Build a Dilated Causal Convolutional Engine in TypeScript: create a 4-layer TCN stack with kernel size 3 and dilations [1, 2, 4, 8]; calculate total receptive field; implement a rolling circular buffer for streaming multi-sensor input; feed real-time simulated pressure and temperature sensor data; prove that receptive field reaches 31 time steps while buffer memory stays under 1 KB.",
    "socraticHints": [
      "Why do dilated convolutions use dilation factors that increase as powers of 2 (1, 2, 4, 8...)?",
      "Because powers of two ensure that the dilated receptive field covers every single past time step without any holes or skipped inputs!",
      "If dilations were mismatched (e.g. 1, 3, 9 without proper kernel width), the network would have blind spots where past sensor events are completely ignored!"
    ],
    "situationalPuzzle": {
      "scenario": "An edge AI team replaces an LSTM on a smart water meter with a 5-layer TCN on an ARM Cortex-M4 (64 KB RAM). The model detects pipe leaks over a 128-sample pressure history. However, during live streaming tests, the leak alarm triggers 64 samples AFTER a burst event occurs. Code review shows the convolution kernel was centered with symmetric zero-padding. What is the root cause?",
      "options": [
        "Water meters have too much acoustic noise.",
        "Non-Causal Centered Convolutions Introduced Latency: Centered padding requires (kernel_size - 1) / 2 future samples before computing the convolution for the current sample. In a 5-layer network, this accumulated a 64-sample forward delay. Changing to strict Causal Convolutions with left-only padding computes outputs immediately upon sample arrival with zero lookahead latency.",
        "Microcontrollers cannot calculate dilations.",
        "The battery voltage dropped below 2.0 volts."
      ],
      "answerIdx": 1,
      "debrief": "Centered convolutions are non-causal: they look ahead into the future by padding both sides symmetrically. In offline batch processing this is fine, but in live streaming pipelines, looking ahead by N samples requires waiting N sample periods before outputting a prediction! Causal convolutions only look backward into history (left-side padding), achieving zero algorithmic delay."
    },
    "quests": [
      {
        "num": 1,
        "title": "Dilated Causal Convolutions & Receptive Field Math",
        "type": "Concept",
        "description": "Derive the mathematical formula for TCN receptive field expansion across dilation layers, causal padding alignment, and memory bounds."
      },
      {
        "num": 2,
        "title": "Non-Causal Lookahead Delay & Pipeline Lag Detective",
        "type": "Detective Challenge",
        "description": "Investigate a high-speed anomaly detector that failed safety certification due to a 100ms detection lag; prove symmetric padding caused future lookahead starvation."
      },
      {
        "num": 3,
        "title": "Circular Buffer TCN Streaming Inference Engine",
        "type": "Mastery Assignment",
        "description": "Implement a 4-layer fixed-point Q15 TCN streaming engine with circular delay lines, INT8 weights, and CMSIS-NN 1D convolutions."
      },
      {
        "num": 4,
        "title": "Water Pipeline Leak Detection TCN Incident Lab",
        "type": "Production Incident Lab",
        "description": "Deploy a dilated TCN model to detect acoustic transients from pipe bursts; verify instantaneous zero-latency trigger response on Cortex-M4 simulator."
      }
    ]
  },
  {
    "day": 48,
    "month": 2,
    "blockNum": 10,
    "title": "State-Space Models (SSM) on Bare Metal: S4 & Mamba Discretization with O(1) Memory",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Cutting-Edge Sequence Modeling (Linear State Spaces & Mamba on Embedded Hardware)",
    "spokenGoal": "Welcome to the frontier of sequence modeling: State-Space Models (SSMs). While Transformers suffer from quadratic memory and TCNs have finite receptive fields, SSMs (like S4 and Mamba) combine the best of both worlds: infinite context memory like an RNN, parallelizable training like a CNN, and linear time inference with strict O(1) memory! Today you bring SSMs to bare-metal microcontrollers. Deconstruct continuous state-space differential equations: dx(t)/dt = A x(t) + B u(t), and y(t) = C x(t) + D u(t). Master Discretization via the Bilinear (Tustin) or Zero-Order Hold (ZOH) transform: convert continuous matrices (A, B) into discrete recurrence parameters (A_bar, B_bar) using sampling step delta! In inference mode, an SSM reduces to a single matrix-vector recurrence: h_t = A_bar * h_{t-1} + B_bar * x_t. The hidden state h_t has a constant, fixed size (e.g. 16 states * 4 bytes = 64 bytes)! You can stream sensor data for 10 hours or 10 years without allocating a single additional byte of RAM!",
    "conceptInvariant": "SSM Recurrent Inference & O(1) Memory Invariant: Continuous state-space models discretized via Zero-Order Hold (ZOH) compute inference as h_t = A_bar @ h_{t-1} + B_bar @ x_t. The hidden state h has fixed dimension d_state, guaranteeing exact O(1) memory consumption and constant per-step compute regardless of sequence duration.",
    "failureMode": "Deploying an SSM with unconstrained continuous transition matrix A that lacks HiPPO (High-order Polynomial Projection Operators) initialization; the discrete state transition matrix eigenvalues drift outside the unit circle during quantization, causing state explosion and numerical overflow to +/-Infinity in 20 steps.",
    "tryItFriction": "Implement an SSM ZOH Discretization and Recurrent Step Engine in TypeScript: define continuous state matrix A (diagonal plus low-rank HiPPO structure), B, C, D; compute discrete A_bar = exp(delta * A) and B_bar = (A_bar - I) * A^(-1) * B; execute recurrent state updates on an input signal over 200 time steps; verify that state vector memory remains constant at exactly d_state * 4 bytes with zero heap allocation.",
    "socraticHints": [
      "Why can an SSM process infinite sequence lengths in constant O(1) memory during inference?",
      "Because inference runs in recurrent mode! It only needs to remember the current hidden state vector h_t, discarding raw input history.",
      "Unlike a Transformer which must store every past key-value pair in a growing KV cache, the SSM compresses past history into state vector h_t!"
    ],
    "situationalPuzzle": {
      "scenario": "An AI research engineer deploys a miniaturized Mamba SSM architecture to an ESP32 for physiological heart rate variability (HRV) tracking over 24-hour periods. The model works perfectly for the first 30 seconds of test recording, but after 5 minutes of continuous streaming, the output prediction values saturate at 0x7FFF (maximum INT16 saturation). Inspection shows state transition matrix A was discretized without stability bounds. What went wrong?",
      "options": [
        "The battery ran out of current.",
        "Eigenvalue Instability in Fixed-Point Discretization: The discrete transition matrix A_bar had eigenvalues with magnitude |lambda| >= 1.0 due to fixed-point rounding. In a recurrent system, any eigenvalue >= 1 causes exponential growth h_t -> infinity over repeated multiplications. Strictly enforcing |lambda(A_bar)| < 1.0 (Hurwitz stability) guarantees bounded-input bounded-output (BIBO) stability.",
        "The ESP32 flash chip lost its magnetic charge.",
        "The heart beat too quickly for the CPU."
      ],
      "answerIdx": 1,
      "debrief": "In recurrent linear state-space models, the hidden state evolves as h_t = A_bar * h_{t-1}. If any eigenvalue of A_bar has a magnitude >= 1.0, the repeated matrix multiplication will amplify energy at every time step, eventually blowing up to numerical infinity or saturating fixed-point registers. For BIBO stability, all eigenvalues of A_bar must lie strictly inside the complex unit circle (|lambda| < 1)."
    },
    "quests": [
      {
        "num": 1,
        "title": "State-Space Mathematical Formulations & ZOH Discretization",
        "type": "Concept",
        "description": "Analyze continuous differential equations, Zero-Order Hold (ZOH) discretization math, HiPPO memory initialization, and recurrent mode inference."
      },
      {
        "num": 2,
        "title": "Recurrent State Explosion & Eigenvalue Drift Detective",
        "type": "Detective Challenge",
        "description": "Diagnose an SSM whose predictions saturated to maximum rail voltage after 500 samples; prove that quantization pushed discrete eigenvalues outside the unit circle."
      },
      {
        "num": 3,
        "title": "Bare-Metal Micro-SSM Recurrent Inference Engine",
        "type": "Mastery Assignment",
        "description": "Construct an SSM recurrent inference engine in fixed-point C / TypeScript with constant 128-byte state vector allocation and CMSIS-DSP vector MAC acceleration."
      },
      {
        "num": 4,
        "title": "24-Hour Continuous ECG Rhythm Tracking Incident Lab",
        "type": "Production Incident Lab",
        "description": "Deploy an SSM sequence model on a continuous 24-hour biosensor stream; prove zero memory growth (strict O(1) RAM) and numerical stability over 1,000,000 steps."
      }
    ]
  },
  {
    "day": 49,
    "month": 2,
    "blockNum": 10,
    "title": "Time-Series Forecasting & Sensor Drift Prediction: Multi-Variate Degradation Extrapolation",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Predictive Maintenance Algorithms (Time-Series Extrapolation & Battery SOH)",
    "spokenGoal": "Industrial machines do not fail suddenly; they degrade gradually over weeks and months. Today we engineer on-device Multi-Variate Time-Series Forecasting to predict machine failure hours before it occurs! Deconstruct multi-step ahead forecasting paradigms: Autoregressive Rollout (predict sample t+1, feed it back into input, predict t+2...) versus Direct Multi-Horizon Output (predicting a vector of [t+1, t+2, ... t+H] in a single forward pass). Analyze why direct multi-horizon forecasting is vastly superior on microcontrollers: autoregressive rollout accumulates errors at each step and requires multiple inference passes, whereas direct forecasting executes one single matrix multiplication! Master Battery State-of-Health (SOH) and electrochemical degradation modeling: map voltage, current, and cell temperature over charge cycles to estimate Remaining Useful Life (RUL). Formulate Sensor Calibration Drift prediction: electrochemical gas sensors and MEMS gyroscopes drift with temperature and aging; implement an on-device Kalman filter + neural predictor that estimates drift bias and subtracts it in real time!",
    "conceptInvariant": "Direct Multi-Horizon Inference & Error Bounding Invariant: Embedded time-series forecasting must utilize Direct Multi-Horizon output projection heads rather than iterative autoregressive feedback. A single forward pass bounds inference latency and prevents exponential error compounding during multi-step extrapolation.",
    "failureMode": "Using an unconstrained autoregressive feedback loop on an MCU for 50-step battery voltage forecasting; small INT8 quantization errors in the first step compound exponentially across 50 iterations, predicting negative voltage and triggering false emergency shutdowns.",
    "tryItFriction": "Build a Multi-Horizon Degradation Predictor in TypeScript: simulate an industrial bearing degradation curve with increasing high-frequency vibration; implement a direct multi-horizon linear projection head forecasting 16 future steps; compare accuracy and latency against an autoregressive loop; demonstrate that direct projection computes in 1.2 ms with zero error compounding.",
    "socraticHints": [
      "Why is autoregressive forecasting prone to severe error compounding on INT8 quantized models?",
      "Because each predicted output has a slight quantization error; feeding this quantized output back into the input causes subsequent predictions to drift further and further from truth!",
      "Direct multi-horizon forecasting outputs all future time steps simultaneously from the original high-fidelity input window, eliminating feedback drift!"
    ],
    "situationalPuzzle": {
      "scenario": "A solar battery energy storage system (BESS) uses an on-device TinyML model on an STM32G4 to forecast lithium iron phosphate (LFP) cell voltage 30 minutes into the future. The system uses an autoregressive predictor that loops 30 times (1 minute per step). During cold mornings, the 30th step forecasts a cell voltage of 0.8V (catastrophic over-discharge), causing the BMS to trip the main breaker, even though actual cell voltage remained stable at 3.2V. What caused this false trip?",
      "options": [
        "Solar panels stopped working.",
        "Autoregressive Compounding Drift: A slight 15 mV underestimation in step 1 was fed back as input for step 2, which amplified to 40 mV in step 3, eventually compounding to a 2400 mV error by step 30. Replacing the autoregressive loop with a Direct Multi-Horizon dense output head forecasts all 30 minutes in a single pass with non-diverging bounded error.",
        "The lithium ions froze solid.",
        "The STM32 clock crystal was out of tune."
      ],
      "answerIdx": 1,
      "debrief": "Autoregressive forecasting (feeding model outputs back as inputs) is notoriously unstable, especially when combined with fixed-point quantization and non-stationary conditions. Any minor bias in early steps gets amplified in an exponential feedback loop. In industrial edge systems, Direct Multi-Horizon forecasting (where the network outputs all forecast steps at once) is mandatory for stability."
    },
    "quests": [
      {
        "num": 1,
        "title": "Direct Multi-Horizon vs Autoregressive Forecasting Theory",
        "type": "Concept",
        "description": "Analyze mathematical error propagation in autoregressive time-series loops vs direct multi-horizon projection, and battery SOH degradation dynamics."
      },
      {
        "num": 2,
        "title": "Autoregressive Exponential Divergence Detective",
        "type": "Detective Challenge",
        "description": "Investigate a BESS battery management system that initiated an emergency disconnect; prove that a 30-step autoregressive loop compounded a tiny INT8 bias into a 2.4V discrepancy."
      },
      {
        "num": 3,
        "title": "Direct Multi-Horizon Remaining Useful Life (RUL) Predictor",
        "type": "Mastery Assignment",
        "description": "Construct an embedded RUL prediction model in fixed-point C / TypeScript that maps 64 historical sensor readings to 16 future degradation steps."
      },
      {
        "num": 4,
        "title": "Industrial Turbine Bearing Wear Forecasting Incident Lab",
        "type": "Production Incident Lab",
        "description": "Deploy a multi-horizon forecasting engine on simulated bearing vibration data; benchmark forecast accuracy and prove warning generation 2 hours before physical failure."
      }
    ]
  },
  {
    "day": 50,
    "month": 2,
    "blockNum": 10,
    "title": "Milestone Project 9: Dilated Causal TCN & Micro State-Space Model Time-Series Inference Engine",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Milestone (Advanced Sequential Modeling & Time-Series Engine on Cortex-M)",
    "spokenGoal": "Congratulations on completing Block 10. Today you synthesize everything learned about advanced sequential modeling into Milestone Project 9: a dual-engine embedded sequence processing pipeline featuring both a Dilated Causal TCN and a Micro State-Space Model (SSM)! Your mission: construct an end-to-end time-series inference firmware module capable of ingesting high-rate multi-sensor streams (tri-axial accelerometer and acoustic emission data at 1 kHz), routing features through a circular ring buffer, executing TCN dilated causal convolutions with CMSIS-NN acceleration, and running a recurrent SSM state-space filter for infinite-horizon degradation tracking. Profile the entire system: benchmark cycle counts per time step, verify zero heap allocation, confirm strict O(1) memory guarantees for the SSM, and validate that the TCN triggers anomaly detection with zero causal lookahead delay!",
    "conceptInvariant": "Dual Sequential Engine Coexistence Invariant: The high-rate transient detector (Dilated Causal TCN with finite receptive field) and the long-horizon degradation tracker (State-Space Model with O(1) recurrent state) must operate over a shared circular DMA buffer without heap allocation, maintaining determinism within a strict 5 ms RTOS execution deadline.",
    "failureMode": "Failing to synchronize the TCN ring buffer indices with the SSM recurrent state updates; when a DMA buffer wrap occurs, the TCN processes discontinuous sample boundaries while the SSM computes state updates out of order, corrupting sequential temporal representations.",
    "tryItFriction": "Construct the Milestone 9 Dual-Engine Architecture in TypeScript / C: 1) Implement a 4-layer Dilated Causal TCN (kernel=3, dilations=[1,2,4,8], 16 channels); 2) Implement an 8-state Discretized State-Space Model (ZOH discretization); 3) Connect both to a simulated 1000 Hz dual-sensor stream; 4) Verify that total RAM consumption is under 12 KB, execution latency per sample is under 1.5 ms, and anomalous transient pulses are detected within 1 sample period.",
    "socraticHints": [
      "Why combine a TCN and an SSM rather than choosing just one?",
      "Because they serve complementary temporal scales! The TCN excels at detecting localized high-frequency waveform patterns (like acoustic clicks and shockwaves).",
      "The SSM excels at tracking slow, continuous macro-trends over hours and days (like thermal expansion and baseline bearing wear) without memory bloat!"
    ],
    "situationalPuzzle": {
      "scenario": "During validation of Milestone Project 9 on an STM32H7, the QA team injects a sharp micro-fracture acoustic burst lasting 3 samples. The TCN detects the burst immediately (latency 1 ms). However, the SSM degradation score continues to rise for 45 seconds after the burst has vanished, falsely indicating ongoing machine destruction. What caused the SSM to remain in an excited state?",
      "options": [
        "The microphone sensor melted.",
        "Overly Long State Decay Constant (Eigenvalue Near 1.0): The continuous state matrix A was configured with a decay pole too close to the origin (eigenvalue lambda = 0.999), meaning the state requires thousands of samples to discharge energy. Tuning the state-space pole placement to match the physical damping ratio of the mechanical structure ensures the SSM returns to baseline within the correct 500 ms decay window.",
        "The DMA FIFO was clogged with digital dust.",
        "Cortex-M7 does not support multiplication."
      ],
      "answerIdx": 1,
      "debrief": "In state-space models, the eigenvalues of the state matrix A_bar determine the decay rate (time constant) of the system's memory. An eigenvalue very close to 1.0 represents an integrator with near-infinite memory, holding onto a transient burst indefinitely. Matching the state-space poles to the physical damping characteristics of the monitored machine allows proper distinction between transient shocks and permanent degradation."
    },
    "quests": [
      {
        "num": 1,
        "title": "Dual Sequential Engine Architecture & Coexistence Blueprint",
        "type": "Concept",
        "description": "Architect the complete firmware specification for co-located TCN and SSM execution over shared sensor ring buffers under strict RTOS deadlines."
      },
      {
        "num": 2,
        "title": "Ring Buffer Wrap Discontinuity & State Desynchronization Detective",
        "type": "Detective Challenge",
        "description": "Debug an embedded sequence processor where circular buffer pointer wrap-around generated artificial step-discontinuities that tripped false alarms."
      },
      {
        "num": 3,
        "title": "Milestone 9: Dilated TCN & Micro-SSM Inference Firmware Engine",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript dual sequential engine: 4-layer TCN + 8-state SSM with zero malloc and under 12 KB SRAM."
      },
      {
        "num": 4,
        "title": "Industrial High-Speed Spindle Failure Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Subject the Milestone 9 engine to a realistic multi-hour CNC milling machine failure dataset; verify simultaneous transient burst alerting and gradual tool wear tracking."
      }
    ]
  },
  {
    "day": 51,
    "month": 2,
    "blockNum": 11,
    "title": "On-Device Continual Learning & Catastrophic Forgetting: Experience Replay & EWC",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "On-Device Adaptive Intelligence (Lifelong Learning & Memory Consolidation)",
    "spokenGoal": "Standard machine learning assumes a closed world: train on a server, deploy frozen weights to an edge device forever. But edge environments are dynamic! When a smart factory robot changes tools or an edge camera experiences seasonal lighting shifts, a frozen model fails. Today we enter On-Device Continual Learning. The biggest challenge: Catastrophic Forgetting! When a neural network trains on a new task B using standard backpropagation, gradient updates overwrite the weight representations learned for task A, completely destroying its prior knowledge. Deconstruct mitigation strategies viable on microcontrollers: 1) Experience Replay with tiny SRAM Reservoir Buffers: maintain a small ring buffer of 50 representative exemplar samples from previous tasks and interleave them during on-device updates; 2) Elastic Weight Consolidation (EWC): calculate the diagonal Fisher Information Matrix F_i to quantify which weights are critical for task A. When adapting to task B, add a quadratic penalty sum(F_i * (theta_i - theta_A)^2) to the loss function! Protect vital weights while allowing unconstrained weights to adapt!",
    "conceptInvariant": "Fisher Information Weight Anchoring Invariant: On-device parameter adaptation must compute and enforce Elastic Weight Consolidation (EWC) penalties: delta_L = lambda * sum(F_i * (theta_i - theta_anchor)^2). Critical task-invariant weights are anchored, preventing catastrophic forgetting while enabling peripheral layers to adapt to new operating distributions.",
    "failureMode": "Fine-tuning an on-device anomaly classifier using bare SGD on newly observed motor vibration data without replay or EWC; within 10 iterations, the model achieves 100% accuracy on the new motor but completely forgets how to detect bearing failures on all other motors.",
    "tryItFriction": "Build an EWC and Reservoir Replay Engine in TypeScript: create a 2-layer neural network trained on Task 1 (normal vibration vs bearing failure); compute the diagonal Fisher Information Matrix; simulate Task 2 (new operating speed); fine-tune using bare SGD vs EWC-regularized loss; prove that EWC preserves Task 1 accuracy above 92% while bare SGD drops to 41%.",
    "socraticHints": [
      "Why is full backpropagation of all network layers impractical for on-device learning on microcontrollers?",
      "Because storing activation maps and computing gradients for every layer requires massive SRAM and high computational overhead!",
      "A common edge pattern is freezing the feature extraction backbone and only updating the final linear classification layer or lightweight adapter weights using EWC!"
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of smart agricultural sorting machines uses an on-device neural classifier to identify defective fruit. When deployed in a new region with a different apple cultivar, the devices run on-device adaptation overnight. The next morning, the machines sort the new cultivar with 98% accuracy, but when fed the standard domestic cultivar, they reject 85% of healthy fruit as rotten. What caused this regression?",
      "options": [
        "The fruit sorting belts were moving backwards.",
        "Catastrophic Forgetting from Unconstrained Local Fine-Tuning: The adaptation routine ran unregularized gradient descent exclusively on images of the new cultivar without experience replay or weight consolidation penalties. The weights supporting the domestic cultivar were completely overwritten. Incorporating a 100-sample exemplar replay buffer and EWC anchors prevents overwrite of previous cultivar features.",
        "Apples emit radioactive gamma rays.",
        "The camera lens fogged up."
      ],
      "answerIdx": 1,
      "debrief": "Catastrophic forgetting is the defining failure mode of continual learning in neural networks. Without protective mechanisms (like experience replay buffers or EWC quadratic penalties that anchor important parameters), training on new data rapidly destroys the representations required for previous tasks."
    },
    "quests": [
      {
        "num": 1,
        "title": "Catastrophic Forgetting & Elastic Weight Consolidation (EWC) Math",
        "type": "Concept",
        "description": "Analyze catastrophic forgetting dynamics, diagonal Fisher Information Matrix derivation, EWC loss formulation, and reservoir sampling algorithms."
      },
      {
        "num": 2,
        "title": "Catastrophic Overwrite & Fleet Model Regression Detective",
        "type": "Detective Challenge",
        "description": "Investigate an industrial edge fleet that lost baseline anomaly detection capability after a local calibration update; trace how unconstrained SGD destroyed core weights."
      },
      {
        "num": 3,
        "title": "On-Device EWC Linear Head Adaptation Engine",
        "type": "Mastery Assignment",
        "description": "Construct an embedded on-device continual learning module in C / TypeScript with frozen backbone, Fisher diagonal tracking, and quadratic EWC regularization."
      },
      {
        "num": 4,
        "title": "Adaptive Industrial Robot Tool-Wear Calibration Lab",
        "type": "Production Incident Lab",
        "description": "Deploy an adaptive edge model on a simulated robotic machining cell; prove continuous adaptation across 3 successive tooling changes with zero forgetting."
      }
    ]
  },
  {
    "day": 52,
    "month": 2,
    "blockNum": 11,
    "title": "Concept Drift & Model Degradation Detection: Streaming KS-Test & PSI Gating",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Edge MLOps & Model Telemetry (Drift Detection & Data Distribution Monitoring)",
    "spokenGoal": "How does an autonomous edge device know when its neural network is no longer trustworthy? It cannot ask a human for labels every second! Enter Concept Drift and Model Degradation Detection on the edge. Distinguish between Virtual Drift (covariate shift: the input distribution P(X) changes due to sensor aging or seasonal temperature, but the mapping P(Y|X) remains identical) and Real Concept Drift (the physical failure physics change, altering P(Y|X)). Deconstruct lightweight statistical tests viable on embedded MCUs: 1) Streaming Two-Sample Kolmogorov-Smirnov (KS) Test: compare the empirical cumulative distribution function (ECDF) of recent sensor readings against a baseline calibration ECDF stored in flash; 2) Population Stability Index (PSI): discretize feature distributions into 10 buckets and compute PSI = sum((Actual% - Baseline%) * ln(Actual% / Baseline%)). If PSI > 0.25, the distribution has shifted significantly! Trigger an automatic model retraining request or fall back to safe deterministic heuristic modes!",
    "conceptInvariant": "Streaming ECDF & PSI Gating Invariant: Embedded drift detection must evaluate empirical distribution divergence (PSI > 0.25 or KS-statistic D > D_crit) over rolling fixed-memory windows. When drift is detected, the device flags model degradation and triggers autonomous recalibration or safe-state fallback.",
    "failureMode": "Relying on model output confidence scores to detect degradation; as sensor hardware drifts, the neural network becomes 'confidently wrong', making high-confidence predictions on out-of-distribution inputs while bearing failure progresses undetected.",
    "tryItFriction": "Build a Streaming ECDF and Population Stability Index (PSI) Engine in TypeScript: record a baseline 500-sample feature distribution from a vibration sensor; simulate gradual sensor bias drift (+15% shift over 1000 samples); compute rolling PSI across 10 histogram bins; verify that PSI alerts trigger exactly when drift exceeds the safety threshold (PSI > 0.2) before catastrophic misclassification occurs.",
    "socraticHints": [
      "Why can't we rely on neural network Softmax probabilities to warn us about input drift?",
      "Because neural networks are notoriously overconfident! When presented with completely unfamiliar out-of-distribution inputs, they frequently output 99% confidence for incorrect classes.",
      "Statistical distribution tests (like PSI and KS-test) monitor raw sensor physics and feature representations directly, providing an objective mathematical guardrail!"
    ],
    "situationalPuzzle": {
      "scenario": "An edge AI gas leak detector is installed in a chemical refinery. After 14 months of operation in hot summer temperatures, the sensor begins reporting 0.0 ppm gas even during a controlled test valve venting. The neural network output confidence was 99.8% 'Safe Air'. Review shows the electrochemical sensor sensitivity had degraded by 60% due to electrolyte evaporation. Why did the model fail to flag its own blindness?",
      "options": [
        "The chemical fumes dissolved the microcontroller.",
        "Missing Input Distribution Telemetry: The device monitored only model classification outputs rather than tracking raw sensor baseline distribution drift. Because degraded sensor values fell within the numerical range of clean air, the model was confidently wrong. A streaming KS-test or PSI monitor would have detected the collapse of the sensor's baseline noise variance months earlier.",
        "Electrochemical sensors never degrade.",
        "The RTOS task priority was inverted."
      ],
      "answerIdx": 1,
      "debrief": "Neural networks have no inherent self-awareness when their inputs shift out of distribution. If an aging sensor's degraded signal mimics the features of a normal state, the network will confidently output normal. Embedding lightweight statistical drift monitors (like streaming PSI or KS-test) on the raw feature inputs is essential to catch hardware aging before catastrophic failures occur."
    },
    "quests": [
      {
        "num": 1,
        "title": "Covariate Shift, Concept Drift & PSI Statistical Formulations",
        "type": "Concept",
        "description": "Analyze statistical drift mathematics: Kolmogorov-Smirnov ECDF max divergence, Population Stability Index (PSI) bucketing, and Page-Hinkley test dynamics."
      },
      {
        "num": 2,
        "title": "Confidently Wrong Out-of-Distribution Blindness Detective",
        "type": "Detective Challenge",
        "description": "Analyze an industrial refinery incident report where an edge model failed to detect gas discharge; prove how lack of input distribution telemetry allowed silent sensor degradation."
      },
      {
        "num": 3,
        "title": "Streaming Population Stability Index (PSI) Monitor Engine",
        "type": "Mastery Assignment",
        "description": "Develop an embedded PSI drift monitor in C / TypeScript with 10-bin histogram discretization, rolling buffer updates, and under 2 KB SRAM overhead."
      },
      {
        "num": 4,
        "title": "Automated Sensor Aging Recalibration Trigger Lab",
        "type": "Production Incident Lab",
        "description": "Deploy the PSI drift monitor on a simulated aging accelerometer stream; verify automatic tripping of the recalibration flag when PSI crosses 0.25."
      }
    ]
  },
  {
    "day": 53,
    "month": 2,
    "blockNum": 11,
    "title": "Edge AI MLOps & Differential Model FOTA: Binary Delta Patching & Atomic Swap",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Fleet Firmware & Model Lifecycle Management (Differential Over-The-Air Updates)",
    "spokenGoal": "You have trained an improved TinyML model at central headquarters. How do you deploy it to 50,000 battery-powered sensors scattered across an ocean shipping fleet via satellite or LoRaWAN? You cannot transmit a full 2 megabyte firmware binary\u2014bandwidth is expensive and battery power is precious! Enter Differential Model FOTA (Firmware Over-The-Air) and Binary Delta Patching. Deconstruct binary differencing algorithms: BSDIFF and Heatshrink compression. Because a fine-tuned neural network often only changes weight parameters while model architecture and runtime code remain identical, the binary diff is often under 5% of the total model size (e.g. 15 KB instead of 300 KB)! Master Dual-Slot Atomic Flash Partitioning: Bank A (Active Model) and Bank B (Update Staging). Trace the atomic update protocol: stream delta packets, reconstruct new binary in Bank B, verify SHA-256 cryptographic signature, perform a trial boot with an RTOS watchdog timer, and swap bank pointers only upon successful verification. If the new model crashes or fails sanity checks, the hardware watchdog automatically rolls back to Bank A!",
    "conceptInvariant": "Atomic Flash Bank Dual-Boot & Cryptographic Verification Invariant: Model updates must be written to an alternate flash partition (Bank B), verified via cryptographic SHA-256 / Ed25519 signature, and validated through a trial boot watchdog. Bank pointer swap occurs only after successful health verification, guaranteeing zero bricked devices.",
    "failureMode": "Flashing a new neural network binary directly over the active execution flash partition in a single bank; a radio packet drops or battery dies at 60% completion, leaving corrupt partial weights and permanently bricking the remote edge node.",
    "tryItFriction": "Build a Differential Model Patching and Dual-Bank Swapper in TypeScript: create Model Binary v1 (100 KB); generate Model Binary v2 with 10% modified weights; compute a simulated BSDIFF delta patch (showing an 85% bandwidth reduction); verify CRC32 and SHA-256 hash validation; simulate an interrupted flash write and prove automatic rollback to Model v1.",
    "socraticHints": [
      "Why is differential binary patching especially effective for neural network updates?",
      "Because neural network flatbuffer files (like .tflite) have predictable structured layouts; weight updates change byte values in continuous blocks while operator metadata remains unchanged!",
      "This structural consistency allows delta compression algorithms to achieve 80% to 95% compression ratios compared to transmitting whole new binaries!"
    ],
    "situationalPuzzle": {
      "scenario": "A utility company transmits a 250 KB model update over cellular NB-IoT to 5,000 smart grid meters. To save flash space, the firmware overwrites the model partition in place without a backup slot. During the rollout, a cellular tower rebooted midway through packet transmission for 420 meters. The affected meters entered an unrecoverable hard fault loop and required manual field technician visits at $150 per truck roll. What architecture would have prevented this $63,000 disaster?",
      "options": [
        "Sending technicians out twice a year.",
        "Dual-Slot Partitioning with Atomic Scratchpad Staging: Allocate two separate flash slots (Active Slot A and Staging Slot B). The incoming delta update is assembled into Slot B and cryptographically validated via SHA-256 before an atomic pointer flip. An interrupted download simply leaves Slot A untouched, maintaining continuous uninterrupted operation.",
        "Using 5G instead of NB-IoT.",
        "Disabling all firmware updates forever."
      ],
      "answerIdx": 1,
      "debrief": "In-place overwriting of active executable or model code is a fatal anti-pattern in embedded systems. Any power loss, connection drop, or bit error during writing leaves a corrupted, unbootable binary. Dual-slot (A/B) flash architecture guarantees that the active system remains intact until the new binary is 100% written, verified, and ready for an atomic swap."
    },
    "quests": [
      {
        "num": 1,
        "title": "Differential Binary Patching (BSDIFF) & Flash Dual-Banking",
        "type": "Concept",
        "description": "Analyze binary delta compression mechanics, BSDIFF patch reconstruction, flash sector erase geometry, and A/B partition memory layout."
      },
      {
        "num": 2,
        "title": "Interrupted In-Place Flash Write & Fleet Brick Detective",
        "type": "Detective Challenge",
        "description": "Investigate a utility smart meter deployment failure; quantify financial losses and prove how single-bank overwrites caused unrecoverable hard fault bootloops."
      },
      {
        "num": 3,
        "title": "Differential FOTA Decompression & Atomic Swap Engine",
        "type": "Mastery Assignment",
        "description": "Implement a differential model update engine in C / TypeScript with SHA-256 verification, watchdog rollback hooks, and atomic A/B bank switching."
      },
      {
        "num": 4,
        "title": "LoRaWAN Low-Bandwidth Model Delta Rollout Lab",
        "type": "Production Incident Lab",
        "description": "Simulate pushing a model update over a lossy 5 kbps radio link; verify byte savings, packet reassembly, and automated rollback upon simulated corruption."
      }
    ]
  },
  {
    "day": 54,
    "month": 2,
    "blockNum": 11,
    "title": "Secure Edge AI & Adversarial Robustness: MEMS Sensor Spoofing & Model Encryption",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Edge Cybersecurity & Physical Layer AI Security (Anti-Spoofing & Hardware IP Protection)",
    "spokenGoal": "Your edge AI model is running on untrusted physical hardware in the wild. An attacker can physically probe flash memory, extract your proprietary neural network IP, or spoof sensor inputs to bypass security gates! Today you build Secure Edge AI. Deconstruct Physical Adversarial Attacks on MEMS sensors: acoustic resonant frequency spoofing! High-frequency ultrasonic sound waves can resonate with MEMS accelerometer silicone cantilevers, injecting ghost acceleration signals that trick an autonomous vehicle's crash detection model into deploying airbags or failing to brake. Deconstruct Adversarial Perturbations (FGSM - Fast Gradient Sign Method): imperceptible high-frequency noise added to audio or camera feeds that flips model classifications. Master Hardware Security Protections: 1) Model Encryption in Flash using AES-128/256-CTR with keys locked in hardware eFuses; 2) ARM TrustZone / Secure Enclave execution: decrypt model weights only into secure internal SRAM accessible exclusively by secure-world CPU threads; 3) Multi-Sensor Plausibility Cross-Checking: combine accelerometer and optical odometry to detect physical sensor spoofing!",
    "conceptInvariant": "Hardware Root of Trust & Multi-Physics Sensor Validation Invariant: Edge AI model weights stored in external flash must be encrypted via hardware-bound AES keys stored in eFuses, and critical inferences must be cross-validated against independent physical sensor modalities to reject acoustic resonance and adversarial injection attacks.",
    "failureMode": "Storing unencrypted flatbuffer (.tflite) models in external SPI NOR flash; an attacker with a $15 logic analyzer clips onto the SPI bus pins during boot, reads the entire binary, extracts proprietary neural network architecture and weights, and reverse-engineers the company's core intellectual property.",
    "tryItFriction": "Build an Adversarial Sensor Noise Detector and Encrypted Model Loader in TypeScript: simulate an accelerometer signal under acoustic resonance attack (32 kHz resonance causing artificial DC bias); implement a multi-modal plausibility filter (cross-referencing gyro angular rates); verify that spoofed sensor streams are flagged as invalid; implement an AES-CTR model decryption pipeline in secure memory.",
    "socraticHints": [
      "How can sound waves physically move a solid-state MEMS accelerometer without touching it?",
      "MEMS accelerometers contain microscopic mechanical silicon comb structures suspended on springs!",
      "If sound waves match the mechanical resonant frequency of these micro-cantilevers, acoustic pressure forces them into oscillation, generating false electrical capacitance signals!"
    ],
    "situationalPuzzle": {
      "scenario": "A medical infusion pump uses an edge AI model on an STM32 to detect air bubbles in intravenous fluid lines via ultrasonic acoustic sensors. A hospital competitor purchases a unit, solders wires to the external flash chip SPI pins, and reads the raw flash contents into a hex editor. Within 10 minutes, they recover the entire neural network weight matrix and deploy a clone device. What architectural defense was omitted?",
      "options": [
        "The plastic enclosure should have been thicker.",
        "Encrypted Flash Storage with Hardware Root of Trust: Model weights were stored in plaintext in external flash. Utilizing on-chip AES-XIP (Execute-in-Place) or decrypting models into internal secure SRAM using keys burned into internal hardware eFuses (with JTAG/SWD debug ports permanently locked) prevents bus-probing and intellectual property theft.",
        "Ultrasound cannot be detected by computers.",
        "The hospital WiFi had too weak a password."
      ],
      "answerIdx": 1,
      "debrief": "External flash buses are completely exposed to physical wiretapping with cheap logic analyzers. In commercial edge AI devices, model weights represent significant R&D investment. They must be encrypted at rest in flash using keys secured in write-once hardware eFuses, with JTAG debug interfaces locked, and decrypted on-the-fly inside internal memory."
    },
    "quests": [
      {
        "num": 1,
        "title": "Acoustic MEMS Spoofing, Adversarial Attacks & Hardware Roots of Trust",
        "type": "Concept",
        "description": "Analyze physics of acoustic resonance in MEMS sensors, Fast Gradient Sign Method (FGSM) adversarial noise, AES-XIP flash encryption, and TrustZone isolation."
      },
      {
        "num": 2,
        "title": "External Flash SPI Bus IP Theft & JTAG Extraction Detective",
        "type": "Detective Challenge",
        "description": "Analyze a commercial teardown where an edge AI startup had its proprietary model stolen from external flash; demonstrate how logic analyzers reconstructed the .tflite model."
      },
      {
        "num": 3,
        "title": "Multi-Modal Sensor Plausibility & Anti-Spoofing Filter Engine",
        "type": "Mastery Assignment",
        "description": "Construct an anti-spoofing sensor validation engine in C / TypeScript that cross-references dual physical sensors to detect acoustic injection attacks."
      },
      {
        "num": 4,
        "title": "Encrypted Model Loader & Secure Enclave Emulation Lab",
        "type": "Production Incident Lab",
        "description": "Implement AES-CTR on-the-fly model decryption into isolated SRAM; verify zero plaintext leakage on simulated external bus traces."
      }
    ]
  },
  {
    "day": 55,
    "month": 2,
    "blockNum": 11,
    "title": "Milestone Project 10: On-Device Continual Learning, Drift Detection & Differential Model FOTA Engine",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Milestone (Complete Edge MLOps Lifecycle & Continual Learning Firmware)",
    "spokenGoal": "Congratulations on completing Block 11. Today you engineer Milestone Project 10: a fully integrated, production-grade Edge MLOps and Continual Learning Engine! Your firmware architecture must unite three core systems: 1) A Streaming Distribution Drift Monitor (Population Stability Index over sensor feature histograms); 2) An On-Device Continual Learning Engine (adapting the classifier's output head with Elastic Weight Consolidation to absorb new operating conditions without catastrophic forgetting); and 3) A Differential Model FOTA Receiver (ingesting compressed binary delta patches, validating SHA-256 signatures, staging into Bank B, and performing an atomic bank swap with watchdog rollback protection). Put the entire pipeline under stress: simulate an industrial operating shift, watch the drift monitor trigger an adaptation alert, execute a differential delta update over a simulated low-bandwidth link, and verify zero downtime and zero forgotten tasks!",
    "conceptInvariant": "Closed-Loop Edge MLOps Invariant: The edge node must autonomously navigate the entire lifecycle: Detect Input Drift -> Signal Degradation -> Execute Local Adaptive Regularization (EWC) OR Request Differential Binary FOTA -> Validate Cryptographic Signatures -> Atomic Dual-Bank Swap -> Rollback upon Fault. Every stage executes within fixed memory bounds without RTOS starvation.",
    "failureMode": "Executing on-device EWC weight adaptation on the active model partition while receiving a differential FOTA patch simultaneously; RAM exhausts, flash writes collide, and the firmware enters a fatal bus fault.",
    "tryItFriction": "Construct the Milestone 10 Closed-Loop MLOps Engine in TypeScript / C: 1) Implement the 10-bin streaming PSI drift monitor; 2) Implement the EWC local adaptation optimizer with Fisher diagonal penalty; 3) Implement the differential delta patch rebuilder with SHA-256 verification and dual-bank staging; 4) Simulate a full lifecycle event and prove seamless adaptation without rebooting active telemetry tasks.",
    "socraticHints": [
      "How do the drift monitor and the FOTA engine interact in an autonomous edge fleet?",
      "When local drift cannot be resolved via lightweight on-device head adaptation (or when drift exceeds a critical safety ceiling), the device sends a drift telemetry payload to the cloud.",
      "The cloud retrains a new global foundation model and transmits a compressed differential delta patch back to the fleet via FOTA!"
    ],
    "situationalPuzzle": {
      "scenario": "A fleet of wind turbine edge sensors runs the Milestone 10 firmware. In winter, freezing ice alters blade vibration harmonics, tripping the PSI drift alert (PSI=0.38). The node initiates local EWC adaptation. However, during the local update, ice suddenly breaks off, causing a high-vibration shockwave. Because the CPU was running adaptation math at 100% load on a single thread without RTOS task preemption, the critical shockwave alarm was delayed by 4.2 seconds, exceeding the 100 ms safety threshold. How must the task architecture be refactored?",
      "options": [
        "Disable ice detection completely.",
        "Priority-Preempted Dual-Thread Architecture: The real-time sensor ingest and anomaly detection loop must run at high RTOS priority (Priority 1) with deterministic 10 ms execution slots, while continual learning / EWC math runs as a background cooperative thread (Priority 4) that yields immediately whenever sensor DMA buffers fill. Safety-critical telemetry is never starved by background learning.",
        "Buy faster wind turbines.",
        "Run the firmware in the cloud instead of the edge."
      ],
      "answerIdx": 1,
      "debrief": "On-device learning is computationally heavy and must never compromise the primary real-time safety mission of the embedded node. In a properly architected RTOS environment, safety detection tasks operate at high preemptive priority, while machine learning adaptation runs at low background priority, yielding CPU cycles instantly when critical sensor events occur."
    },
    "quests": [
      {
        "num": 1,
        "title": "Closed-Loop Edge MLOps Lifecycle & Task Architecture",
        "type": "Concept",
        "description": "Architect the complete RTOS task graph uniting streaming PSI drift telemetry, EWC continual adaptation, and A/B flash delta FOTA updates."
      },
      {
        "num": 2,
        "title": "CPU Starvation & RTOS Task Inversion During Adaptation Detective",
        "type": "Detective Challenge",
        "description": "Diagnose an industrial safety incident where an edge node missed a mechanical overload because on-device training locked the CPU; prove task preemption failure."
      },
      {
        "num": 3,
        "title": "Milestone 10: Complete Edge MLOps & Continual Learning Engine",
        "type": "Mastery Assignment",
        "description": "Develop and validate the complete C / TypeScript Milestone 10 engine: PSI drift monitor + EWC adapter + differential FOTA with dual-bank atomic swap."
      },
      {
        "num": 4,
        "title": "Autonomous Fleet Lifecycle Simulation Incident Lab",
        "type": "Production Incident Lab",
        "description": "Execute a full simulated 1-year lifecycle on simulated edge nodes: induce sensor drift, trigger local EWC tuning, stream a remote delta patch, and verify zero downtime."
      }
    ]
  },
  {
    "day": 56,
    "month": 2,
    "blockNum": 12,
    "title": "Industrial Case Study 1: Smart Medical Wearable Arrhythmia Detector (12-Lead ECG Micro-CNN)",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone Case Study (Life-Critical Biosensors, Low-Power & Regulatory Standards)",
    "spokenGoal": "We enter Block 12: Real-World Industrial Case Studies. Today you architect a life-critical medical wearable: a Smart 12-Lead ECG Holter Monitor Arrhythmia Detector on an ultra-low-power ARM Cortex-M33! The clinical requirement: detect life-threatening ventricular fibrillation (V-Fib) and atrial fibrillation (A-Fib) within 50 ms of occurrence while consuming less than 20 microwatts of average power, enabling a 30-day battery life on a single coin cell! Deconstruct the bio-potential analog front-end (AFE): high input impedance (>100 MOhm), Right Leg Drive (RLD) active noise cancellation to suppress 50/60 Hz mains hum, and high-pass baseline wander filtering (0.05 Hz). Deconstruct the TinyML pipeline: Pan-Tompkins QRS fiducial point detection algorithm for R-peak segmentation, followed by a 1D Dilated Micro-CNN running on INT8 weights. Comply with medical regulatory benchmarks: AAMI EC57 and ANSI/AAMI/IEC 60601-2-47 requirements for clinical sensitivity (>99.5%) and specificity (>99.0%)!",
    "conceptInvariant": "Life-Critical Determinism & Ultra-Low-Power Duty Cycling Invariant: Biosensor arrhythmia classification must achieve >99.5% clinical sensitivity (AAMI EC57) within a strict <50 ms latency window while remaining within a 20 uW average power budget via deep sleep duty cycling and hardware analog event gating.",
    "failureMode": "Failing to implement baseline wander suppression; patient respiration creates a 0.2 Hz baseline drift that saturates the fixed-point ADC dynamic range, causing the micro-CNN to misclassify normal sinus rhythm as ventricular flutter.",
    "tryItFriction": "Build an ECG Arrhythmia Detection Pipeline in TypeScript: generate synthetic ECG waveforms with normal sinus rhythm, PVCs, and atrial fibrillation; implement Pan-Tompkins QRS detection; feed normalized beats into a quantized 1D Micro-CNN; verify >99% classification accuracy and calculate energy consumption per beat on a Cortex-M33 running at 16 MHz.",
    "socraticHints": [
      "Why must ECG monitors use a Right Leg Drive (RLD) circuit?",
      "The human body acts as an antenna picking up massive 50/60 Hz electromagnetic hum from room power lines!",
      "An RLD circuit measures the common-mode interference voltage and inverts it back into the body through a reference electrode, canceling mains hum by up to 40 dB!"
    ],
    "situationalPuzzle": {
      "scenario": "A medical device startup tests their wearable ECG patch in a clinical trial. The device runs an INT8 CNN on an nRF5340. In laboratory bench tests, sensitivity was 99.8%. But in active hospital wards, false alarms occur every 10 minutes whenever patients walk to the bathroom. Log inspection shows massive high-frequency spikes riding on the ECG trace during movement. What caused the clinical failure?",
      "options": [
        "Hospital nurses carry walkie-talkies.",
        "Electromyographic (EMG) Muscle Artifact Contamination: Skeletal muscle contraction during walking generates high-frequency bio-potential noise (20-150 Hz) that overlaps with ECG harmonics. The preprocessing pipeline lacked an adaptive bandpass filter and motion-artifact accelerometer cross-gating, leading the CNN to mistake muscle tremor for ventricular tachycardia.",
        "ECG electrodes don't work on moving patients.",
        "The coin cell battery produced alternating current."
      ],
      "answerIdx": 1,
      "debrief": "Movement creates electromyographic (EMG) signals from pectoral and thoracic muscles that contaminate ECG signals. Medical-grade wearables must include multi-sensor fusion: an integrated accelerometer detects patient locomotion, dynamically adjusting filter bandwidths or gating arrhythmia classifications during intense motion bursts to prevent false clinical alerts."
    },
    "quests": [
      {
        "num": 1,
        "title": "Bio-Potential AFE Physics, Pan-Tompkins & AAMI EC57 Standards",
        "type": "Concept",
        "description": "Analyze ECG bio-potential physics, Right Leg Drive (RLD) noise cancellation, baseline wander filtering, and AAMI EC57 clinical validation protocols."
      },
      {
        "num": 2,
        "title": "Motion EMG Artifact & Hospital False Alarm Detective",
        "type": "Detective Challenge",
        "description": "Investigate a clinical trial failure where patient walking triggered false ventricular tachycardia alarms; prove lack of accelerometer motion gating."
      },
      {
        "num": 3,
        "title": "1D Micro-CNN Holter Monitor Arrhythmia Classifier Engine",
        "type": "Mastery Assignment",
        "description": "Construct an INT8 1D dilated CNN arrhythmia classifier in C / TypeScript with Pan-Tompkins R-peak detector operating under 20 uW power budget."
      },
      {
        "num": 4,
        "title": "MIT-BIH Arrhythmia Database Benchmark Validation Lab",
        "type": "Production Incident Lab",
        "description": "Evaluate the arrhythmia detector against the gold-standard MIT-BIH Arrhythmia database; prove >99.5% sensitivity and >99.0% specificity compliance."
      }
    ]
  },
  {
    "day": 57,
    "month": 2,
    "blockNum": 12,
    "title": "Industrial Case Study 2: Wind Turbine Blade Structural Health Monitoring (Multi-Axis CWT & Acoustic Emission)",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone Case Study (Harsh Industrial Environments, High-Rate Acoustic Waveforms)",
    "spokenGoal": "Wind turbine blades are 80-meter composite structures subjected to cyclic aerodynamic fatigue, lightning strikes, and internal delamination. A blade failure costs over $500,000 and destroys the turbine! Today you architect an autonomous Structural Health Monitoring (SHM) node mounted inside the hollow cavity of a composite turbine blade. The challenge: piezoelectric acoustic emission (AE) sensors capture transient stress waves up to 500 kHz when internal fiberglass plies begin to crack, while tri-axial MEMS accelerometers track low-frequency blade flutter (0.5 to 10 Hz). Deconstruct the sub-threshold analog wake-up circuit: the digital processor sleeps in 5 uA deep sleep; when a micro-crack releases a high-energy acoustic burst, a low-power comparator triggers an external interrupt pin, waking the MCU in 15 microseconds to record the transient! Trace the edge ML pipeline: Continuous Wavelet Transform (CWT) generates a scalogram of the burst, followed by an ultra-lightweight depthwise CNN that classifies the acoustic signature: crack growth, lightning puncture, or benign rain droplet impact!",
    "conceptInvariant": "Sub-Threshold Acoustic Wake-Up & Micro-Crack Scalogram Invariant: Blade monitoring nodes must maintain sub-10 uA quiescent sleep via hardware analog comparator interrupts, waking in <20 us to capture high-rate piezoelectric acoustic transients and classifying damage signatures via Continuous Wavelet Transform (CWT) feature projections.",
    "failureMode": "Sampling the 500 kHz piezoelectric sensor continuously via polling; the 1200 mAh internal lithium-thionyl chloride battery is exhausted in 48 hours instead of the mandatory 10-year operational design life.",
    "tryItFriction": "Build an Acoustic Emission Burst Classifier and Wake-Up Simulator in TypeScript: simulate quiescent background aerodynamic noise interspersed with high-frequency fiberglass micro-crack bursts (100 kHz); implement a comparator threshold detector; upon wake-up, compute an 8-scale Morlet CWT scalogram; feed features into a TinyML classifier; prove that wake-up duty cycling reduces average power by 99.7%.",
    "socraticHints": [
      "Why use acoustic emission (AE) instead of just measuring vibration with standard accelerometers?",
      "Accelerometers measure macroscopic physical movement (like blade bending or motor shaking), which only shows up after a major crack has already developed!",
      "Acoustic emission detects microscopic stress waves emitted by individual fiberglass fibers breaking, catching structural damage weeks before macro-cracking occurs!"
    ],
    "situationalPuzzle": {
      "scenario": "An offshore wind farm installs blade monitoring nodes on 30 turbines. During heavy hail storms, the sensor nodes trigger 15,000 wake-up interrupts per hour, consuming excessive battery and flooding the SCADA network with false 'blade crack' warnings. The acoustic burst amplitude of hail impacts matches internal fiberglass cracking. What multi-physics feature distinguishes hail impact from internal delamination?",
      "options": [
        "Hail is colder than fiberglass.",
        "Rise-Time vs Decay-Time Waveform Ratio (RA Value) and Multi-Axis Frequency Dispersion: Rain/hail surface impacts produce symmetric high-damping acoustic pulses with fast decay times and surface Rayleigh wave dispersion, whereas internal delamination emits asymmetric shear/Lamb waves with rapid rise-time (<5 us) and long ringing resonance. Computing RA value (Rise Time / Peak Amplitude) rejects hail impacts with zero ML compute.",
        "Turbines don't operate when it rains.",
        "Paint on the blades blocks hail sound."
      ],
      "answerIdx": 1,
      "debrief": "Acoustic emission analysis in non-destructive testing relies on standard parametric waveform metrics like RA Value (Rise Time divided by Amplitude) and Duration. Surface impacts (like hail or rain) transfer momentum from the outside, exhibiting different acoustic propagation and decay signatures compared to internal mechanical strain fractures."
    },
    "quests": [
      {
        "num": 1,
        "title": "Acoustic Emission Physics, Lamb Wave Propagation & RA Value Math",
        "type": "Concept",
        "description": "Analyze piezoelectric sensor physics, acoustic wave propagation in composite laminates, Lamb waves, and RA value parametric discrimination."
      },
      {
        "num": 2,
        "title": "Hail Storm False Alarm Flood & Battery Depletion Detective",
        "type": "Detective Challenge",
        "description": "Investigate an offshore wind farm where a storm depleted node batteries in 3 days; prove how absence of parametric acoustic rise-time gating caused continuous wake-ups."
      },
      {
        "num": 3,
        "title": "Piezoelectric Acoustic Burst CWT Scalogram Engine",
        "type": "Mastery Assignment",
        "description": "Construct an embedded acoustic burst detection engine in C / TypeScript with analog wake-up emulation, Morlet CWT extraction, and crack classification."
      },
      {
        "num": 4,
        "title": "10-Year Autonomous Turbine Blade Monitoring Incident Lab",
        "type": "Production Incident Lab",
        "description": "Deploy the SHM engine across a multi-year simulated acoustic emission dataset; prove 100% detection of critical composite plies with <15 uA average current."
      }
    ]
  },
  {
    "day": 58,
    "month": 2,
    "blockNum": 12,
    "title": "Industrial Case Study 3: Sub-Watt Autonomous Agricultural Drone Navigation (FOMO Micro-Vision)",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Production Capstone Case Study (Ultra-Lightweight Micro-Vision, Sub-Watt Robotics)",
    "spokenGoal": "Autonomous nano-drones (under 50 grams) are transforming precision agriculture: navigating dense orchard tree canopies, counting ripe fruit, and spraying individual pest infestations without GPS! But a 50-gram drone has no room for a heavy GPU or heatsink\u2014the entire vision navigation computer must weigh less than 5 grams and consume less than 500 milliwatts! Today you architect the Sub-Watt Edge AI Vision Navigation Engine. Deconstruct the hardware stack: a grayscale global-shutter micro-camera connected via parallel DVP to an ARM Cortex-M7 with Helium vector extensions running at 400 MHz. Deconstruct the vision architecture: FOMO (Faster Objects, More Objects) centroid detection running at 20 FPS on 160x160 images in just 180 KB of SRAM! Combine FOMO obstacle centroids with an Optical Flow Lucas-Kanade velocity estimator to compute real-time collision-free steering vectors in GPS-denied environments. Master safety failsafes: if tree branch proximity falls below 30 cm, trigger an autonomous hovering safety interlock within 25 milliseconds!",
    "conceptInvariant": "Sub-Watt Micro-Vision & Reactive Guidance Invariant: Nano-drone visual navigation must execute centroid obstacle detection (FOMO) and optical flow velocity estimation at >=20 FPS within a strict 500 mW total system power envelope, maintaining a deterministic <=25 ms guidance reaction latency in GPS-denied environments.",
    "failureMode": "Attempting to use a standard floating-point YOLOv5 model on the drone processor; frame rate drops to 0.4 FPS while power consumption spikes to 3.5 watts, causing the drone's voltage regulator to overheat and the drone to crash into an apple tree.",
    "tryItFriction": "Build an Autonomous Micro-Vision Navigation Simulator in TypeScript: render a synthetic orchard corridor with tree trunks and foliage; feed 160x160 simulated camera frames through an INT8 FOMO centroid detector; compute optical flow motion vectors; calculate collision-free flight velocity vectors (v_x, v_y); demonstrate smooth autonomous flight at 20 FPS with under 200 KB RAM usage.",
    "socraticHints": [
      "Why is a global-shutter camera mandatory for high-speed drone navigation instead of a cheaper rolling-shutter camera?",
      "Rolling shutter sensors expose pixels line-by-line over time!",
      "When a drone rolls or yaws at high angular velocity, rolling shutter creates severe 'jello' geometric distortion, warping straight tree trunks into curves and corrupting obstacle position estimates!"
    ],
    "situationalPuzzle": {
      "scenario": "A micro-drone navigation team tests an autonomous pollination drone in an almond orchard. The drone uses FOMO centroid vision on an STM32H7. At midday in full sun, the drone navigates flawlessly. But at 4:30 PM as the sun drops low, tree branches cast sharp, dark shadows across the ground. The drone repeatedly stops, treats the ground shadows as solid obstacles, and crashes into overhead branches while trying to avoid the shadows. What caused this navigation failure?",
      "options": [
        "Bees attacked the drone propellers.",
        "Luminance-Based Contrast Failure & Missing Depth Disambiguation: Grayscale FOMO detection was trained on high-contrast objects and misclassified dark ground shadows as solid branch obstacles. Integrating multi-scale contrast normalization (CLAHE) in the camera ISP and fusing micro-vision with an inexpensive single-point downward ToF (Time-of-Flight) lidar (<1g) disambiguates flat shadows from true 3D physical obstacles.",
        "Drones cannot fly in the afternoon.",
        "The battery was cold."
      ],
      "answerIdx": 1,
      "debrief": "2D monocular vision systems are vulnerable to optical illusions, particularly high-contrast cast shadows. In robotics, shadows have zero physical height. Fusing a lightweight downward Time-of-Flight (ToF) distance sensor or utilizing temporal parallax (objects on the ground move slower in optical flow than nearby overhead obstacles) allows the navigation stack to immediately distinguish harmless ground shadows from physical obstacles."
    },
    "quests": [
      {
        "num": 1,
        "title": "Micro-Vision FOMO Architecture, Optical Flow & Sub-Watt Power Budgets",
        "type": "Concept",
        "description": "Analyze FOMO centroid heatmaps, Lucas-Kanade optical flow on fixed-point SIMD, global shutter sensor physics, and sub-watt power envelopes."
      },
      {
        "num": 2,
        "title": "Cast Shadow Optical Illusion & Canopy Crash Detective",
        "type": "Detective Challenge",
        "description": "Analyze an autonomous orchard drone crash report; prove how lack of downward ToF range gating allowed ground shadows to trigger false evasive maneuvers."
      },
      {
        "num": 3,
        "title": "Sub-Watt FOMO Micro-Vision Obstacle Avoidance Engine",
        "type": "Mastery Assignment",
        "description": "Implement a complete micro-vision navigation engine in C / TypeScript running INT8 FOMO at 20 FPS with Lucas-Kanade velocity estimation under 250 KB SRAM."
      },
      {
        "num": 4,
        "title": "Autonomous GPS-Denied Orchard Flight Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Execute an autonomous flight mission through a simulated 500-meter orchard obstacle course; prove 100% collision-free navigation at 20 FPS."
      }
    ]
  },
  {
    "day": 59,
    "month": 2,
    "blockNum": 12,
    "title": "Principal Edge AI Architect RFC & Trade-Off Blueprint: End-to-End System Synthesis",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Enterprise Architectural Synthesis (Formal RFC, System Trade-Offs & Safety Certifications)",
    "spokenGoal": "You are now operating at the level of a Principal Edge AI Systems Architect. Today, you do not write code; you author the comprehensive Architectural Request for Comments (RFC) that defines the next-generation Edge AI platform for an industrial enterprise! Deconstruct the multidimensional architectural trade-off space: Silicon Selection (ARM Cortex-M vs RISC-V with Vector Extensions vs Dedicated NPU Ethos-U vs Ultra-Low-Power FPGA); Memory Architecture (SRAM vs PSRAM vs Flash latency and energy budgets); Software Runtimes (TFLM vs MicroTVM vs Custom C Engines); Safety & Compliance Certifications (IEC 61508 / ISO 26262 functional safety, deterministic execution time bounds, and MISRA-C compliance). Synthesize an exhaustive engineering blueprint that justifies every microampere, every kilobyte of SRAM, and every mathematical assumption across the entire 60-day curriculum!",
    "conceptInvariant": "Principal Systems Architectural Integrity Invariant: An industrial Edge AI platform RFC must provide mathematical justification for silicon selection, memory hierarchy allocations (SRAM/Flash), latency budgets, thermal dissipation, functional safety certifications (IEC 61508 / ISO 26262), and 10-year total cost of ownership (TCO).",
    "failureMode": "Selecting a high-power quad-core Linux SoC for a remote outdoor pipeline sensor based on developer software familiarity; system consumes 2.5W, requiring expensive solar panels, large lithium batteries, and overheating in summer sunlight, rendering the product commercially unviable.",
    "tryItFriction": "Author the complete Architectural RFC Specification in Markdown / TypeScript: define the system requirements for a fleet of 100,000 smart gas pipeline monitoring nodes; document the trade-off matrix comparing Cortex-M33+Ethos-U55 vs Cortex-M7 vs Linux SoC; establish exact SRAM/Flash memory partitioning; define functional safety watchdog fail-safes; present a 10-year TCO and battery life calculation.",
    "socraticHints": [
      "Why do enterprise edge AI products frequently fail when moving from laboratory prototypes to commercial production?",
      "Prototypes are built on Raspberry Pi or NVIDIA Jetson boards connected to wall power; they ignore thermal limits, environmental temperatures (-40C to +85C), battery replacement costs, and safety certifications!",
      "A Principal Architect designs for production constraints from Day 1: microwatt power budgets, deterministic RTOS execution, and hardware longevity!"
    ],
    "situationalPuzzle": {
      "scenario": "A tier-1 automotive supplier's VP of Engineering must choose the edge AI compute platform for next-generation in-cabin occupant monitoring sensors (detecting driver drowsiness and infant presence). The engineering team is divided: Team A proposes an embedded Linux SoC ($28 BOM, 4W power, Python/PyTorch support, 45-second boot time). Team B proposes an ARM Cortex-M85 + Ethos-U65 NPU ($7 BOM, 250mW power, C++ / MicroTVM, 15ms boot time). The automotive OEM requires compliance with ISO 26262 ASIL-B and instant-on rear-seat detection upon vehicle door unlock. Which platform must the Principal Architect approve?",
      "options": [
        "Team A's Linux SoC because Python is easier to program.",
        "Team B's Cortex-M85 + Ethos-U65 Architecture: Meets the mandatory ASIL-B functional safety requirements, satisfies the sub-50ms instant-on boot time constraint, reduces unit BOM by 75% ($21 savings across 2 million vehicles = $42M gross margin), and eliminates the thermal dissipation risks of a 4W processor enclosed in an unventilated vehicle headliner.",
        "Neither; use a mechanical pressure switch.",
        "Stream all video to cloud servers over 5G."
      ],
      "answerIdx": 1,
      "debrief": "In automotive and industrial systems, boot time, functional safety certification (ISO 26262 ASIL-B), thermal dissipation, and BOM cost dominate software developer convenience. A 45-second Linux boot time is unacceptable for instant occupant safety sensing, and a 4W processor in a roof headliner causes thermal throttling. The dedicated microcontroller + NPU architecture delivers instant-on operation, automotive safety certification, and massive cost savings."
    },
    "quests": [
      {
        "num": 1,
        "title": "Edge AI Silicon Taxonomy, Functional Safety & TCO Mathematics",
        "type": "Concept",
        "description": "Analyze silicon trade-offs (MCU vs NPU vs SoC), ISO 26262 ASIL-B functional safety requirements, thermal dissipation math, and 10-year TCO modeling."
      },
      {
        "num": 2,
        "title": "Linux SoC Over-Engineering & Thermal Throttling Detective",
        "type": "Detective Challenge",
        "description": "Investigate a canceled $12M automotive in-cabin monitoring project; prove how Linux SoC boot latency and thermal overload violated OEM safety specifications."
      },
      {
        "num": 3,
        "title": "Principal Edge AI Architecture RFC Specification Document",
        "type": "Mastery Assignment",
        "description": "Author an enterprise-grade Architectural RFC for an industrial IoT edge AI platform, complete with memory budgets, latency constraints, and safety architectures."
      },
      {
        "num": 4,
        "title": "Enterprise Architecture Review Board Defense Lab",
        "type": "Production Incident Lab",
        "description": "Defend your RFC before a simulated executive Architecture Review Board; answer grueling technical challenges regarding silicon selection, security, and lifetime costs."
      }
    ]
  },
  {
    "day": 60,
    "month": 2,
    "blockNum": 12,
    "title": "Master Capstone: ApexEdgeAI Autonomous Multi-Modal Industrial Predictive Maintenance Platform Viva Gate",
    "stageName": "Stage 4: Sequence Models, Continual Learning & Industrial Capstones",
    "stageNum": 4,
    "pedagogicalRole": "Grand Master Capstone & Rigorous Technical Defense (Mastery of All 60 Days)",
    "spokenGoal": "Welcome to Day 60: the summit of Course 18: Edge AI, DSP & TinyML Systems. Over the past 60 days, you have progressed from ADC physics and Nyquist-Shannon sampling to CMSIS-DSP SIMD filtering, Radix-4 FFTs, fixed-point math, Mel-spectrograms, INT8 quantization, CMSIS-NN kernels, TFLM runtimes, micro-vision, audio beamforming, NPU compilation, micro-transformers, state-space models, continual learning, and edge MLOps! Today, you defend the Grand Master Capstone: ApexEdgeAI\u2014an autonomous, multi-modal industrial predictive maintenance edge platform deployed on an ARM Cortex-M7 with Ethos-U55 NPU! Your node ingests 48 kHz multi-axis vibration, dual-mic acoustic beamforming, and infrared thermal imaging simultaneously; executes real-time spectral feature extraction; runs quantized neural inference; detects bearing spalls, electrical arcing, and thermal degradation; tracks continuous state-space health; adapts via EWC continual learning; and executes differential FOTA updates. Face the Senior Systems & Evaluator Panel across 4 rigorous Viva defense stations!",
    "conceptInvariant": "Master Unified Architecture Invariant: The ApexEdgeAI platform integrates analog physics, real-time DSP, INT8 neural acceleration, micro-vision, sequential modeling, continual learning, and secure differential MLOps into a unified, zero-dynamic-allocation embedded firmware architecture running reliably under 500 mW power with deterministic RTOS execution.",
    "failureMode": "Failing the Senior Evaluator Viva Gate by being unable to mathematically defend the relationship between ADC quantization noise, INT8 quantization scale factors, FFT frequency resolution, and real-time RTOS scheduling deadlines under extreme multi-modal sensor load.",
    "tryItFriction": "Execute the ApexEdgeAI Master Capstone Firmware Simulation in TypeScript / C: 1) Stream synchronized tri-axial vibration (10 kHz), dual PDM audio (48 kHz), and thermal IR (8x8 grid); 2) Execute CMSIS-DSP bandpass filtering and MFCC extraction; 3) Dispatch feature tensors to the simulated NPU inference engine; 4) Execute simultaneous anomaly detection and SSM health tracking; 5) Demonstrate on-device drift detection and simulated differential FOTA update; 6) Pass all 20 automated architectural validation assertions.",
    "socraticHints": [
      "What is the single most vital principle that separates a true Edge AI Engineer from a generic deep learning developer?",
      "Deep learning developers think in infinite compute, floating-point math, and unbounded cloud memory!",
      "Edge AI engineers master the entire physical continuum: from electrons, photons, and sensor silicon physics to fixed-point arithmetic, cache lines, register allocations, and microampere battery budgets!"
    ],
    "situationalPuzzle": {
      "scenario": "During the final live Master Capstone Viva Defense, the Senior Technical Review Board injects an unexpected combined fault: an extreme high-frequency bearing ball spall (14.2 kHz vibration pulse) coincides with a 15% DC supply voltage drop that drops CPU frequency from 400 MHz to 200 MHz. The system must continue logging the critical bearing fault without crashing or dropping audio DMA samples. How does the ApexEdgeAI firmware maintain integrity?",
      "options": [
        "The system reboots and asks the user to plug in a wall charger.",
        "Graceful Algorithmic Degradation & Priority Preemption: The low-voltage supervisory circuit triggers a dynamic power-scaling interrupt. The firmware immediately throttles non-essential background tasks (disabling thermal IR vision and background EWC adaptation), downsamples audio beamforming, and dedicates all remaining 200 MHz CPU cycles and Ethos NPU capacity to the high-priority CMSIS-DSP vibration filter and anomaly detector. The bearing failure is captured and stored in non-volatile FRAM with zero lost packets.",
        "The firmware crashes with a hard fault.",
        "The system ignores the bearing fault because it is running too slow."
      ],
      "answerIdx": 1,
      "debrief": "Master-level embedded systems design incorporates graceful algorithmic degradation under hardware duress. When operating voltage or temperature threatens system stability, an intelligent power manager sheds non-critical workloads (vision, background learning, UI) while keeping life-safety sensing loops running deterministically within available hardware compute margins."
    },
    "quests": [
      {
        "num": 1,
        "title": "ApexEdgeAI Master Architecture & Multi-Modal Firmware Blueprint",
        "type": "Concept",
        "description": "Document the complete mathematical and firmware architectural specification uniting DSP, TinyML, NPU acceleration, and Edge MLOps."
      },
      {
        "num": 2,
        "title": "Combined Multi-Fault Stress Test & Voltage Drop Detective",
        "type": "Detective Challenge",
        "description": "Analyze the system's response under simultaneous mechanical spall injection and 50% CPU frequency throttling; prove graceful degradation maintains safety logging."
      },
      {
        "num": 3,
        "title": "ApexEdgeAI End-to-End Multi-Modal Master Capstone Firmware",
        "type": "Mastery Assignment",
        "description": "Implement and validate the complete C / TypeScript master capstone firmware: multi-sensor DMA ingest + DSP feature pipeline + quantized neural inference + SSM tracking."
      },
      {
        "num": 4,
        "title": "Senior Architecture Review Board Viva Voce Defense Gate",
        "type": "Production Incident Lab",
        "description": "Complete the rigorous oral and practical defense before the Senior Systems Panel; achieve a 100% pass mark across all 60 days of curriculum competencies."
      }
    ]
  }
];
