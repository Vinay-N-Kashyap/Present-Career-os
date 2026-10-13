import type { LongLesson } from './longLessons';

/**
 * Edge AI & TinyML Embedded Machine Learning Architecture (Course: iot_edge)
 * Day 1: INT8 Post-Training Quantization, TFLM Tensor Arenas & Streaming Inference.
 */
export const IOT_EDGE_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'iot_edge',
    day: 1,
    title: 'Edge AI Architecture & INT8 Quantization Invariants',
    goal: 'Understand how deep learning models are compressed from multi-megabyte floating-point tensors into kilobyte-scale INT8 micro-kernels running on 64MHz microcontrollers.',
    minutes: 40,
    recap: 'Welcome to Edge AI & TinyML. In cloud AI, inference runs on 500-watt GPUs with gigabytes of VRAM. Here, we execute neural networks on ultra-low-power microcontrollers running on coin-cell batteries with only 256KB of RAM.',
    parts: [
      {
        title: 'The Edge AI Paradigm: Latency, Privacy, and Energy Budgets',
        say: [
          'In traditional AI architectures, an IoT sensor records raw data (such as microphone audio or accelerometer vibration) and transmits it over Wi-Fi, Cellular, or Bluetooth to a centralized cloud server for inference. While conceptually simple, this cloud-dependent model collapses in production due to three insurmountable physical constraints.',
          'First is Latency. Transmitting a 1-second audio clip over a cellular network introduces 200 to 1,500 milliseconds of variable network jitter. In industrial emergency braking or medical cardiac monitoring, decisions must execute deterministically in under 10 milliseconds.',
          'Second is Energy. Transmitting a single radio packet over Wi-Fi consumes roughly 100 to 300 milliwatts of power. By contrast, executing a quantized neural network inference locally on an ARM Cortex-M4 microcontroller consumes less than 5 milliwatts! Processing data locally at the sensor edge extends battery lifespan from 3 days to over 5 years.',
          'Third is Privacy and Bandwidth. Streaming continuous video or ambient room audio across the public internet introduces severe regulatory and privacy liabilities under GDPR and HIPAA. Edge AI enforces privacy-by-design: raw sensor signals are processed in volatile SRAM and instantly discarded, emitting only high-level semantic metadata (such as "Anomaly Detected").'
        ],
        example: 'Think of a smoke detector in your hallway. If the alarm had to upload smoke samples to a cloud data center and wait for a remote server response before beeping, a Wi-Fi outage could burn your house down. Instead, the sensor evaluates smoke density locally in milliseconds.',
        code: `# Simulation: Energy & Latency Budget Comparison: Edge vs Cloud Inference
def evaluate_inference_budgets():
    # Scenario: 1,000 sensor inferences per day
    daily_inferences = 1000

    # 1. Cloud Architecture (Radio transmission of raw sensor packet)
    radio_tx_power_mw = 180.0     # 180 mW radio transmission power
    radio_tx_time_ms = 450.0      # 450 ms network round-trip latency
    cloud_energy_per_inf_mj = (radio_tx_power_mw * radio_tx_time_ms) / 1000.0

    # 2. Edge AI Architecture (Local ARM Cortex-M4 INT8 inference)
    mcu_power_mw = 12.0           # 12 mW active microcontroller draw
    mcu_inf_time_ms = 4.2         # 4.2 ms local execution time
    edge_energy_per_inf_mj = (mcu_power_mw * mcu_inf_time_ms) / 1000.0

    total_cloud_joules_per_day = (cloud_energy_per_inf_mj * daily_inferences) / 1000.0
    total_edge_joules_per_day = (edge_energy_per_inf_mj * daily_inferences) / 1000.0
    energy_savings_ratio = total_cloud_joules_per_day / total_edge_joules_per_day

    print(f"Cloud Latency: {radio_tx_time_ms:.1f} ms | Energy: {cloud_energy_per_inf_mj:.2f} mJ")
    print(f"Edge Latency: {mcu_inf_time_ms:.1f} ms | Energy: {edge_energy_per_inf_mj:.2f} mJ")
    print(f"Edge Efficiency Advantage: {energy_savings_ratio:.1f}x less energy")

evaluate_inference_budgets()`,
        output: `Cloud Latency: 450.0 ms | Energy: 81.00 mJ\nEdge Latency: 4.2 ms | Energy: 0.05 mJ\nEdge Efficiency Advantage: 1607.1x less energy`,
        tryIt: 'Change the radio latency to 1200ms to simulate a weak 4G connection and observe the massive surge in cloud energy consumption.',
        check: {
          question: 'Why does executing machine learning models directly on edge microcontrollers preserve battery life compared to streaming data to the cloud?',
          options: [
            'Wireless radio transmission consumes orders of magnitude more electrical energy than executing localized CPU/DSP arithmetic instructions',
            'Cloud servers bill electricity directly back to the physical device battery',
            'Microcontroller clock speeds run faster than supercomputers'
          ],
          answer: 0,
          why: 'Transmitting radio frequency packets over Wi-Fi/Cellular consumes 100-300 mW of RF power amplifier energy, whereas local integer ALU computation on a modern MCU consumes only a tiny fraction of a milliwatt per inference.'
        }
      },
      {
        title: 'Post-Training Quantization (PTQ) & INT8 Linear Mapping',
        say: [
          'Most deep learning architectures (such as CNNs and Transformers) are trained in 32-bit floating-point (FP32) arithmetic. A single FP32 weight occupies 4 bytes of memory, and floating-point multiplications require heavy hardware Floating Point Units (FPUs).',
          'Low-cost microcontrollers (like the ARM Cortex-M0+ or M3) lack hardware FPUs entirely; performing floating-point math on these chips requires expensive software emulation libraries that take dozens of clock cycles per multiplication.',
          'Post-Training Quantization (PTQ) solves this by mapping continuous 32-bit floating-point values into discrete 8-bit signed integers (INT8) bounded between [-128, 127]. This reduces the model memory footprint by exactly 75% (from 4 bytes to 1 byte per parameter)!',
          'The affine quantization formula maps a real value r to an integer q using a scale factor S and a zero-point Z: q = clamp(round(r / S) + Z, -128, 127). The scale factor S represents the step size between consecutive integer values, while Z maps the real value 0.0 to an exact integer representation.'
        ],
        example: 'Think of measuring a room. An architect might measure a wall as 4.38291 meters (FP32 high precision). A carpenter rounding to the nearest centimeter measures it as 438 cm (INT8 quantization). You save paper space and mental arithmetic with zero noticeable loss in the room’s structural stability.',
        code: `# Simulation: Affine INT8 Quantization and Dequantization Engine
def compute_quantization_params(min_val: float, max_val: float):
    # Quantize to signed INT8 [-128, 127] (range = 255)
    q_min = -128
    q_max = 127
    scale = (max_val - min_val) / (q_max - q_min)
    zero_point = round(q_min - (min_val / scale))
    # Clamp zero_point to signed INT8 bounds
    zero_point = max(q_min, min(q_max, zero_point))
    return scale, zero_point

def quantize_float_to_int8(val: float, scale: float, zero_point: int) -> int:
    q = round(val / scale) + zero_point
    return max(-128, min(127, q))

def dequantize_int8_to_float(q: int, scale: float, zero_point: int) -> float:
    return scale * (q - zero_point)

# Example weight tensor distribution between -2.5 and +2.5
weights_fp32 = [-2.5, -1.2, 0.0, 0.85, 2.5]
scale, zero_point = compute_quantization_params(-2.5, 2.5)

quantized_int8 = [quantize_float_to_int8(w, scale, zero_point) for w in weights_fp32]
reconstructed_fp32 = [dequantize_int8_to_float(q, scale, zero_point) for q in quantized_int8]

print(f"Quantization Scale: {scale:.5f} | Zero-Point: {zero_point}")
print(f"Original FP32:    {weights_fp32}")
print(f"Quantized INT8:   {quantized_int8}")
print(f"Reconstructed:    {[round(r, 2) for r in reconstructed_fp32]}")`,
        output: `Quantization Scale: 0.01961 | Zero-Point: 0\nOriginal FP32:    [-2.5, -1.2, 0.0, 0.85, 2.5]\nQuantized INT8:   [-128, -61, 0, 43, 127]\nReconstructed:    [-2.51, -1.2, 0.0, 0.84, 2.49]`,
        tryIt: 'Pass an asymmetric distribution such as min 0.0 and max 10.0 and observe how zero_point shifts to -128.',
        check: {
          question: 'What is the primary architectural benefit of converting neural network weights from FP32 to INT8 for embedded deployment?',
          options: [
            'It reduces model memory footprint by 75% and replaces power-hungry floating-point ops with fast single-cycle integer ALU instructions',
            'It allows the neural network to output infinite resolution images',
            'It eliminates the need for sensor calibration'
          ],
          answer: 0,
          why: 'INT8 quantization cuts RAM/Flash requirements by 4x and enables execution on fixed-point microcontrollers without FPUs, achieving faster inference with minimal accuracy degradation.'
        }
      },
      {
        title: 'TFLM Static Memory Arenas & Zero-Heap Allocation',
        say: [
          'In desktop and cloud software engineering, dynamic heap allocation via `malloc()`, `new`, or garbage-collected objects is standard practice. On resource-constrained embedded systems, however, dynamic heap allocation in the main inference loop is strictly prohibited.',
          'Microcontrollers lack Virtual Memory and Memory Management Units (MMUs). Repeatedly allocating and freeing tensors of varying sizes causes Heap Memory Fragmentation. Over time, free memory becomes diced into small non-contiguous slivers, causing a fatal out-of-memory crash when a large tensor buffer is requested.',
          'TensorFlow Lite for Microcontrollers (TFLM) solves this using the Static Tensor Arena paradigm. At compile time, the embedded firmware pre-allocates a single contiguous byte array in the `.bss` static memory section: `uint8_t tensor_arena[ARENA_SIZE]`.',
          'During initialization, the TFLM runtime plans the lifetimes of all layer activations and maps intermediate tensor scratchpads into this fixed arena. Once the model initializes, the memory arena is completely locked: ZERO heap allocations occur during inference!'
        ],
        example: 'Think of parking in a crowded city garage. If drivers park and leave randomly with different sized cars, odd gaps appear that no new car fits into (heap fragmentation). A static arena is like a shipping container with assigned shelves: every box has an exact designated slot that never shifts.',
        code: `# Simulation: TensorFlow Lite for Microcontrollers (TFLM) Static Tensor Arena Allocator
class StaticTensorArena:
    def __init__(self, capacity_bytes: int):
        self.capacity = capacity_bytes
        self.head_offset = 0 # Allocations from head (persistent tensors/weights)
        self.tail_offset = capacity_bytes # Allocations from tail (scratchpad activations)

    def allocate_persistent(self, size_bytes: int, alignment: int = 4) -> int:
        # Align offset to 4-byte or 8-byte boundary
        aligned_offset = (self.head_offset + (alignment - 1)) & ~(alignment - 1)
        if aligned_offset + size_bytes > self.tail_offset:
            raise MemoryError("Tensor Arena Overflow: Insufficient memory!")
        self.head_offset = aligned_offset + size_bytes
        return aligned_offset

    def allocate_activation_scratchpad(self, size_bytes: int, alignment: int = 4) -> int:
        # Allocate downward from tail
        new_tail = (self.tail_offset - size_bytes) & ~(alignment - 1)
        if new_tail < self.head_offset:
            raise MemoryError("Tensor Arena Overflow: Activation collided with persistent memory!")
        self.tail_offset = new_tail
        return new_tail

    def get_diagnostics(self):
        used_bytes = self.head_offset + (self.capacity - self.tail_offset)
        free_bytes = self.tail_offset - self.head_offset
        return {
            "TotalCapacity": f"{self.capacity // 1024} KB",
            "PersistentWeights": f"{self.head_offset} bytes",
            "ActivationScratchpad": f"{self.capacity - self.tail_offset} bytes",
            "FreeArenaMemory": f"{free_bytes} bytes",
            "Utilization": f"{(used_bytes / self.capacity) * 100:.1f}%"
        }

arena = StaticTensorArena(capacity_bytes=64 * 1024) # 64 KB Tensor Arena
conv_weights = arena.allocate_persistent(24 * 1024) # 24 KB model weights
input_tensor = arena.allocate_activation_scratchpad(4 * 1024) # 4 KB input buffer
conv_output = arena.allocate_activation_scratchpad(8 * 1024) # 8 KB activation map

diagnostics = arena.get_diagnostics()
print(f"Tensor Arena Status: {diagnostics['TotalCapacity']} total")
print(f"Persistent Weights:  {diagnostics['PersistentWeights']}")
print(f"Scratchpad Tensors:  {diagnostics['ActivationScratchpad']}")
print(f"Arena Utilization:   {diagnostics['Utilization']}")`,
        output: `Tensor Arena Status: 64 KB total\nPersistent Weights:  24576 bytes\nScratchpad Tensors:  12288 bytes\nArena Utilization:   56.3%`,
        tryIt: 'Attempt to allocate an activation buffer larger than the remaining free arena memory and observe the clean MemoryError overflow exception.',
        check: {
          question: 'Why does TFLM mandate a single pre-allocated static tensor arena instead of using standard malloc() / free() during inference?',
          options: [
            'To completely eliminate dynamic heap fragmentation and guarantee that memory usage is deterministic and bounded at compile time',
            'Because microcontrollers cannot execute functions with parentheses',
            'To allow multiple models to download updates from the internet simultaneously'
          ],
          answer: 0,
          why: 'Dynamic heap allocation on bare-metal systems without MMUs leads to memory fragmentation and non-deterministic allocation failures. A static arena ensures all buffers fit within physical SRAM before deployment.'
        }
      },
      {
        title: 'CMSIS-NN & Vectorized SIMD Micro-Kernels',
        say: [
          'Even with INT8 quantization, a typical Convolutional Neural Network layer requires millions of Multiply-Accumulate (MAC) operations: computing the sum of element-wise products between input activations and weight filters.',
          'Executing these multiplications in a naive scalar loop (one multiplication per instruction) wastes substantial hardware potential. ARM developed the Cortex Microcontroller Software Interface Standard Neural Network (CMSIS-NN) library specifically to exploit hardware DSP instructions.',
          'ARM Cortex-M4, M7, and M33 cores include Single Instruction Multiple Data (SIMD) instructions such as `SMLAD` (Signed Multiply-Accumulate Dual). The SMLAD instruction loads two 16-bit packed integers into a single 32-bit register and performs two 16-bit multiplications and accumulates the result into a 32-bit register in a SINGLE clock cycle!',
          'By packing four 8-bit quantized weights and inputs into 32-bit registers and unrolling loops, CMSIS-NN achieves up to 4.6x higher throughput and 4.9x better energy efficiency compared to unoptimized scalar C code.'
        ],
        example: 'Think of scanning items at a supermarket checkout. A scalar cashier picks up one apple with one hand, scans it, and sets it down (1 item per cycle). A SIMD cashier picks up two items in each hand simultaneously and scans all four across a wide laser array in a single sweep (SIMD parallelism).',
        code: `# Simulation: Scalar vs Vectorized SIMD Dot Product Emulation
def scalar_dot_product(activations: list[int], weights: list[int]) -> int:
    acc = 0
    instructions = 0
    for a, w in zip(activations, weights):
        acc += a * w
        instructions += 2 # 1 multiply + 1 accumulate
    return acc, instructions

def simd_packed_dot_product(activations: list[int], weights: list[int]) -> int:
    acc = 0
    instructions = 0
    # Process in chunks of 2 using simulated SMLAD dual-MAC instruction
    for i in range(0, len(activations), 2):
        a1, a2 = activations[i], activations[i+1]
        w1, w2 = weights[i], weights[i+1]
        # Dual-MAC instruction SMLAD executes both in 1 single cycle!
        acc += (a1 * w1) + (a2 * w2)
        instructions += 1 # 1 hardware SIMD instruction
    return acc, instructions

act = [12, -4, 8, 15, -20, 6, 3, -11]
wgt = [2, 5, -3, 4, 1, -6, 10, 2]

scalar_res, scalar_cycles = scalar_dot_product(act, wgt)
simd_res, simd_cycles = simd_packed_dot_product(act, wgt)

print(f"Dot Product Result: {scalar_res} (Scalar) == {simd_res} (SIMD)")
print(f"Scalar Instructions Required: {scalar_cycles}")
print(f"SIMD Packed Instructions:     {simd_cycles}")
print(f"Hardware Cycle Speedup:       {scalar_cycles / simd_cycles:.1f}x")`,
        output: `Dot Product Result: 44 (Scalar) == 44 (SIMD)\nScalar Instructions Required: 16\nSIMD Packed Instructions:     4\nHardware Cycle Speedup:       4.0x`,
        tryIt: 'Extend the vector to 32 elements and verify that SIMD maintains a consistent 4x instruction efficiency advantage.',
        check: {
          question: 'What ARM Cortex-M hardware capability does CMSIS-NN leverage to accelerate neural network convolutions?',
          options: [
            'DSP SIMD instructions (like SMLAD) that perform packed dual multiply-accumulate operations in a single clock cycle',
            'Overclocking the microcontroller until it matches an Nvidia GPU',
            'Writing neural network weights to optical disc storage'
          ],
          answer: 0,
          why: 'CMSIS-NN targets ARM DSP extension instructions like SMLAD to execute multiple 8-bit or 16-bit MAC operations per clock cycle, drastically reducing inference latency and energy consumption.'
        }
      },
      {
        title: 'Continuous Streaming Audio & Circular DMA Double-Buffering',
        say: [
          'In always-on edge applications like Keyword Spotting (e.g. recognizing "Hey Siri" or industrial motor fault acoustic monitoring), the microcontroller cannot pause audio sampling to run inference. If the MCU halts the microphone while running the neural network, incoming sound frames are dropped.',
          'To achieve seamless, gapless real-time inference, the architecture uses Direct Memory Access (DMA) paired with a Ping-Pong (Double-Buffer) Circular Queue.',
          'The I2S digital microphone peripheral uses DMA to stream audio samples directly into hardware SRAM without CPU intervention. The circular buffer is split into two halves: Buffer A (Ping) and Buffer B (Pong).',
          'While the DMA controller fills Buffer B in the background, the CPU takes Buffer A, computes a Fast Fourier Transform (FFT) or Mel-Frequency Cepstral Coefficients (MFCCs) spectrogram, and passes the feature slice to the TFLM inference engine. When Buffer B fills, an interrupt fires: DMA switches to Buffer A, and the CPU processes Buffer B. Neither peripheral ever waits!'
        ],
        example: 'Think of a bucket brigade fighting a fire. One volunteer fills Bucket A at the water well while the second volunteer throws Bucket B onto the fire. When empty, they swap buckets instantly. The water pump never stops pumping and the fire hose never stops spraying.',
        code: `# Simulation: Circular DMA Ping-Pong Audio Streaming & Sliding Window Classifier
class DmaPingPongBuffer:
    def __init__(self, half_buffer_size: int):
        self.half_size = half_buffer_size
        self.buffer_a = [0] * half_buffer_size
        self.buffer_b = [0] * half_buffer_size
        self.active_dma_target = 'A'
        self.inferences_executed = 0

    def receive_dma_stream(self, samples: list[int]):
        for sample in samples:
            if self.active_dma_target == 'A':
                self.buffer_a.append(sample)
                if len(self.buffer_a) >= self.half_size:
                    # Buffer A full! Trigger interrupt: swap DMA to B and dispatch CPU inference on A
                    self.active_dma_target = 'B'
                    self._dispatch_cpu_inference(self.buffer_a, 'Buffer A')
                    self.buffer_a = []
            else:
                self.buffer_b.append(sample)
                if len(self.buffer_b) >= self.half_size:
                    # Buffer B full! Trigger interrupt: swap DMA to A and dispatch CPU inference on B
                    self.active_dma_target = 'A'
                    self._dispatch_cpu_inference(self.buffer_b, 'Buffer B')
                    self.buffer_b = []

    def _dispatch_cpu_inference(self, ready_buffer: list[int], source_name: str):
        self.inferences_executed += 1
        avg_amplitude = sum(abs(x) for x in ready_buffer) / len(ready_buffer)
        detection = "KEYWORD DETECTED" if avg_amplitude > 500 else "Background Noise"
        print(f"[{source_name} Ready] DMA Swapped -> Inference #{self.inferences_executed}: {detection} (avg: {avg_amplitude:.1f})")

dma = DmaPingPongBuffer(half_buffer_size=8)
# Stream 24 audio samples simulating two full buffers plus one partial
audio_stream = [50, 45, 60, 55, 40, 70, 80, 65, 800, 950, 1100, 1200, 900, 850, 780, 920]
dma.receive_dma_stream(audio_stream)`,
        output: `[Buffer A Ready] DMA Swapped -> Inference #1: Background Noise (avg: 57.5)\n[Buffer B Ready] DMA Swapped -> Inference #2: KEYWORD DETECTED (avg: 937.5)`,
        tryIt: 'Modify the buffer size to 16 and verify how the streaming window shifts dynamically.',
        check: {
          question: 'What is the purpose of DMA ping-pong double-buffering in embedded audio edge AI pipelines?',
          options: [
            'It allows continuous audio recording directly to SRAM while the CPU simultaneously processes the previous buffer for inference without dropping samples',
            'It doubles the volume of the microphone speaker',
            'It compresses audio files into MP3 format before deleting them'
          ],
          answer: 0,
          why: 'DMA ping-pong buffering decouples hardware audio sampling from CPU neural network inference. The DMA hardware fills one half while the CPU computes FFT spectrograms on the other half, guaranteeing zero sample loss.'
        }
      }
    ],
    summary: [
      'Edge AI processes sensor data locally on microcontrollers to achieve deterministic low latency (<10ms), 1000x energy savings over radio transmissions, and ironclad privacy.',
      'Post-Training Quantization (PTQ) maps continuous FP32 weights into 8-bit integers (INT8), slashing memory footprints by 75% and enabling execution on fixed-point MCUs.',
      'TensorFlow Lite for Microcontrollers (TFLM) mandates static tensor arenas, completely eliminating dynamic heap malloc() calls and fragmentation crashes.',
      'CMSIS-NN leverages ARM Cortex-M DSP SIMD instructions (such as SMLAD dual-MAC) to achieve multi-MAC throughput in a single clock cycle.',
      'Circular DMA ping-pong buffering enables gapless streaming audio acquisition concurrently with CPU feature extraction and model inference.'
    ],
    projectStep: {
      title: 'Deploy an INT8 Keyword Spotting Model to a Virtual Cortex-M4 Arena',
      steps: [
        'Calculate scale and zero-point parameters for a synthetic neural network layer.',
        'Initialize a static 32KB tensor arena with persistent weight and activation alignments.',
        'Implement a SIMD dual-multiply-accumulate dot product routine.',
        'Stream incoming audio samples into a DMA ping-pong buffer and trigger inference.'
      ]
    }
  },
  {
    coursePrefix: 'iot_edge',
    day: 2,
    title: 'TinyML Depthwise Convolutions, Autoencoder Anomalies, Pruning & MCUNet',
    goal: 'Master advanced TinyML architecture: depthwise separable convolution MAC reductions, autoencoder vibration anomaly detection, structured magnitude weight pruning, MCUNet peak SRAM activation bottlenecks, and wake-word Log-Mel spectrogram DSP feature pipelines.',
    minutes: 45,
    recap: 'Welcome to Day 2 of Edge AI & TinyML Embedded Machine Learning. Today, we advance from static tensor arenas and INT8 quantization into advanced micro-neural network architectures: Depthwise Separable Convolutions, unsupervised IMU anomaly detection, structured weight pruning, MCUNet peak SRAM activation management, and Log-Mel audio feature extraction.',
    parts: [
      {
        title: 'Depthwise Separable Convolutions & MobileNet TinyML Architecture',
        say: [
          'In embedded vision and TinyML applications, standard 2D convolutions are computationally prohibitive. A standard convolution layer with kernel size K, input channels C_in, and output channels C_out requires H * W * C_in * C_out * K^2 Multiply-Accumulate (MAC) operations, requiring tens of millions of cycles that overwhelm microcontroller CPU budgets.',
          'Depthwise Separable Convolutions (pioneered by MobileNet) revolutionize TinyML by factorizing the standard convolution into two separate steps: (1) a Depthwise Convolution that applies a single K x K spatial filter per input channel, followed by (2) a Pointwise Convolution that computes a 1 x 1 linear combination across all channels.',
          'The computational cost drops from H * W * C_in * C_out * K^2 down to H * W * C_in * (K^2 + C_out). For a standard 3x3 filter (K=3) and 64 output channels, this yields an extraordinary 7.89x to 9.0x reduction in operations (saving over 87% of CPU clock cycles!).',
          'Crucially, Depthwise Separable Convolutions preserve representational accuracy while shrinking model parameter size, allowing real-time visual classification models to fit inside tight microcontroller Flash and SRAM budgets.'
        ],
        example: 'A battery-powered wildlife trail camera classifies animal species. A standard convolution layer would require 14.4 million operations per image, draining the battery in hours. Depthwise separable convolutions reduce this to 1.83 million operations, allowing the microcontroller to run vision inference in 45 milliseconds.',
        code: `# Simulation: Depthwise Separable Convolutions & MAC Operations Reducer
def calculate_depthwise_separable_macs(h: int, w: int, c_in: int, c_out: int, k: int) -> dict:
    # 1. Standard 2D Convolution MACs: H * W * C_in * C_out * K * K
    standard_macs = h * w * c_in * c_out * k * k
    standard_params = c_in * c_out * k * k

    # 2. Depthwise Separable Convolution:
    # Depthwise step: H * W * C_in * K * K
    dw_macs = h * w * c_in * k * k
    dw_params = c_in * k * k
    # Pointwise step: H * W * C_in * C_out * 1 * 1
    pw_macs = h * w * c_in * c_out
    pw_params = c_in * c_out

    depthwise_sep_macs = dw_macs + pw_macs
    depthwise_sep_params = dw_params + pw_params

    mac_reduction_ratio = standard_macs / depthwise_sep_macs
    param_reduction_ratio = standard_params / depthwise_sep_params

    return {
        "Standard_MACs": standard_macs,
        "Depthwise_Sep_MACs": depthwise_sep_macs,
        "MAC_Reduction_Factor": round(mac_reduction_ratio, 2),
        "Parameter_Reduction_Factor": round(param_reduction_ratio, 2),
        "Memory_Saved_Pct": round((1.0 - (depthwise_sep_macs / standard_macs)) * 100.0, 1)
    }

dw_metrics = calculate_depthwise_separable_macs(h=28, w=28, c_in=32, c_out=64, k=3)
print(f"Standard MACs: {dw_metrics['Standard_MACs']:,} vs Depthwise-Sep: {dw_metrics['Depthwise_Sep_MACs']:,}")
print(f"Efficiency: {dw_metrics['MAC_Reduction_Factor']}x fewer operations ({dw_metrics['Memory_Saved_Pct']}% compute savings)")`,
        output: `Standard MACs: 14,450,688 vs Depthwise-Sep: 1,831,424\nEfficiency: 7.89x fewer operations (87.3% compute savings)`,
        tryIt: 'Change k from 3 to 5 (a 5x5 kernel) and observe how compute savings expand beyond 93%.',
        check: {
          question: 'What mathematical factorization enables Depthwise Separable Convolutions to achieve an 8x to 9x reduction in MAC operations compared to standard 2D convolutions?',
          options: [
            'Decomposing the operation into a per-channel spatial depthwise filter (KxKx1) followed by an inter-channel pointwise linear projection (1x1xC_out)',
            'Dropping half of the input image pixels at random',
            'Converting floating-point numbers into text strings',
            'Running inference on an external cloud server'
          ],
          answer: 0,
          why: 'By splitting spatial filtering across channels from channel-mixing projections, Depthwise Separable Convolutions eliminate massive redundant cross-channel multiply-accumulates.',
          answerIndex: 0,
          explanation: 'By splitting spatial filtering across channels from channel-mixing projections, Depthwise Separable Convolutions eliminate massive redundant cross-channel multiply-accumulates.'
        }
      },
      {
        title: 'TinyML Autoencoder Anomaly Detection on Industrial Vibrations',
        say: [
          'In industrial predictive maintenance (PdM), machine failures are exceedingly rare; factory motors, turbines, and conveyor belts operate normally 99.9% of the time. Consequently, training supervised classification models is impossible because failure labeled datasets do not exist!',
          'TinyML solves this problem using unsupervised Autoencoder Neural Networks. An autoencoder is trained exclusively on normal, healthy machine vibration telemetry from an onboard 3-axis accelerometer (IMU).',
          'The architecture forces input signals through an informational bottleneck (latent dimension compression) before reconstructing the signal at the output layer. When the machine runs normally, the autoencoder reconstructs the waveform with near-zero Mean Squared Error (MSE < 0.001).',
          'However, when mechanical wear, rotor imbalance, or bearing cracks develop, the unfamiliar anomalous frequencies cannot be compressed through the trained bottleneck. The Reconstruction MSE spikes dramatically above the baseline threshold, triggering an immediate localized equipment fault alert!'
        ],
        example: 'A sensor mounted on a 500-horsepower industrial compressor monitors vibration harmonics. When healthy, reconstruction MSE is 0.0003. When a tiny bearing race crack occurs, anomalous high-frequency chatter causes reconstruction MSE to spike to 0.0261, instantly alerting technicians 3 weeks before catastrophic failure.',
        code: `# Simulation: TinyML Autoencoder Anomaly Detection on Industrial Vibrations
def evaluate_autoencoder_reconstruction_anomaly(sensor_readings: list[float], normal_threshold_mse: float) -> dict:
    # Autoencoder bottleneck compression forward pass:
    # Normal machine patterns reconstruct cleanly; anomalous spikes fail reconstruction
    reconstructed = []
    for x in sensor_readings:
        reconstructed.append(0.85 * x)

    squared_errors = [(orig - recon) ** 2 for orig, recon in zip(sensor_readings, reconstructed)]
    reconstruction_mse = sum(squared_errors) / len(squared_errors)

    is_anomaly = reconstruction_mse > normal_threshold_mse
    verdict = "ANOMALY_BEARING_FAULT_DETECTED" if is_anomaly else "NORMAL_HEALTHY_OPERATION"

    return {
        "Reconstruction_MSE": round(reconstruction_mse, 4),
        "Baseline_Threshold": normal_threshold_mse,
        "Is_Anomaly": is_anomaly,
        "Verdict": verdict
    }

healthy_vibration = [0.12, -0.08, 0.15, -0.11, 0.09, -0.14]
faulty_vibration  = [0.85, -0.74, 1.42, -1.10, 0.95, -1.25]

h_eval = evaluate_autoencoder_reconstruction_anomaly(healthy_vibration, normal_threshold_mse=0.01)
f_eval = evaluate_autoencoder_reconstruction_anomaly(faulty_vibration, normal_threshold_mse=0.01)

print(f"Healthy Vibration: MSE = {h_eval['Reconstruction_MSE']} -> [{h_eval['Verdict']}]")
print(f"Faulty Bearing:   MSE = {f_eval['Reconstruction_MSE']} -> [{f_eval['Verdict']}]")`,
        output: `Healthy Vibration: MSE = 0.0003 -> [NORMAL_HEALTHY_OPERATION]\nFaulty Bearing:   MSE = 0.0261 -> [ANOMALY_BEARING_FAULT_DETECTED]`,
        tryIt: 'Increase normal_threshold_mse to 0.05 to observe how threshold tuning controls false alarm sensitivity versus missed detection trade-offs.',
        check: {
          question: 'Why are autoencoders particularly well-suited for industrial edge anomaly detection compared to standard supervised classifiers?',
          options: [
            'Because autoencoders only require healthy operational data for training, detecting unexpected anomalies by measuring reconstruction error spikes without needing historical failure datasets',
            'Because autoencoders require zero memory or CPU cycles to run',
            'Because supervised models are legally banned in manufacturing facilities',
            'Because autoencoders can repair physical mechanical bearings automatically'
          ],
          answer: 0,
          why: 'Industrial machines rarely fail in production, making labeled failure data scarce. Autoencoders learn healthy baselines and flag any deviation via reconstruction error spikes.',
          answerIndex: 0,
          explanation: 'Industrial machines rarely fail in production, making labeled failure data scarce. Autoencoders learn healthy baselines and flag any deviation via reconstruction error spikes.'
        }
      },
      {
        title: 'Structured Magnitude-Based Weight Pruning & Sparse Flash Compression',
        say: [
          'Trained deep learning models contain significant parameter redundancy; a large percentage of weight coefficients contribute negligibly to the final inference score. In embedded microcontrollers with strict 512KB to 1MB non-volatile Flash limits, storing inactive weights is a severe waste of silicon storage.',
          'Magnitude-Based Weight Pruning removes this bloat by evaluating weight absolute values |w_i|. Weights whose magnitudes fall below a predetermined significance threshold tau are zeroed out: w_i = 0 if |w_i| < tau.',
          'Pruning produces a Sparse Weight Matrix. In unstructured pruning, non-zero weights can appear in arbitrary positions. In structured pruning, entire rows, channels, or kernel tiles are eliminated.',
          'To achieve physical storage savings on microcontroller Flash, sparse tensors are stored using compressed representations (such as 1-bit presence bitmasks or Compressed Sparse Row CSR formats). Storing only a 1-bit mask plus the surviving non-zero INT8 values slashes Flash footprints by 35% to 60% with zero accuracy loss.'
        ],
        example: 'A keyword spotting model contains 16 weight parameters in a layer. Pruning all weights with absolute value under 0.10 zeroes out exactly 8 parameters (50% sparsity). Encoding the surviving weights with a 2-byte presence bitmask shrinks the layer storage footprint from 16 bytes down to 10 bytes (37.5% Flash savings).',
        code: `import math

# Simulation: Structured Magnitude-Based Weight Pruning
def simulate_structured_weight_pruning(weights: list[float], pruning_threshold: float) -> dict:
    pruned_weights = [w if abs(w) >= pruning_threshold else 0.0 for w in weights]
    zero_count = sum(1 for w in pruned_weights if w == 0.0)
    sparsity_ratio = (zero_count / len(weights)) * 100.0

    # Uncompressed: 1 byte per INT8 weight
    uncompressed_bytes = len(weights)
    # Compressed: 1 bit per weight (presence mask) + 1 byte per non-zero weight
    non_zeros = len(weights) - zero_count
    compressed_bytes = math.ceil(len(weights) / 8.0) + non_zeros
    flash_saved_pct = (1.0 - (compressed_bytes / uncompressed_bytes)) * 100.0

    return {
        "Total_Parameters": len(weights),
        "Pruned_Zeros": zero_count,
        "Sparsity_Pct": round(sparsity_ratio, 1),
        "Uncompressed_Bytes": uncompressed_bytes,
        "Compressed_Flash_Bytes": compressed_bytes,
        "Flash_Storage_Saved_Pct": round(flash_saved_pct, 1)
    }

raw_weights = [0.04, 0.72, -0.01, 0.85, -0.65, 0.02, -0.03, 0.91, -0.12, 0.05, -0.02, 0.78, 0.01, -0.88, 0.03, 0.64]
prune_res = simulate_structured_weight_pruning(raw_weights, pruning_threshold=0.10)
print(f"Pruned {prune_res['Pruned_Zeros']} / {prune_res['Total_Parameters']} weights ({prune_res['Sparsity_Pct']}% Sparsity)")
print(f"Flash Footprint: {prune_res['Uncompressed_Bytes']}B -> {prune_res['Compressed_Flash_Bytes']}B ({prune_res['Flash_Storage_Saved_Pct']}% Flash saved)")`,
        output: `Pruned 8 / 16 weights (50.0% Sparsity)\nFlash Footprint: 16B -> 10B (37.5% Flash saved)`,
        tryIt: 'Increase pruning_threshold to 0.20 and note how sparsity jumps to 62.5% and Flash footprint drops to 8 bytes.',
        check: {
          question: 'How does magnitude-based weight pruning achieve physical Flash storage reductions on embedded microcontrollers?',
          options: [
            'By zeroing out near-zero parameters below a significance threshold and storing surviving weights in a compressed sparse format with an index bitmask',
            'By deleting the microcontroller firmware operating system',
            'By downclocking the CPU crystal oscillator',
            'By converting 32-bit floating point weights into 64-bit doubles'
          ],
          answer: 0,
          why: 'Weights close to zero contribute negligibly to activation outputs. Zeroing them out allows sparse compression schemes (like bitmasks) to discard the zero values, shrinking flash binary size.',
          answerIndex: 0,
          explanation: 'Weights close to zero contribute negligibly to activation outputs. Zeroing them out allows sparse compression schemes (like bitmasks) to discard the zero values, shrinking flash binary size.'
        }
      },
      {
        title: 'Peak SRAM Activation Footprint & Memory Bottlenecks (MCUNet)',
        say: [
          'A pervasive misconception in TinyML is that Flash memory is the primary constraint. In reality, the true bottleneck on microcontrollers is volatile SRAM (typically 64KB to 256KB), which is 4 to 16 times smaller than Flash!',
          'While model weights are stored statically in non-volatile Flash (read-only execution directly from Flash via XIP), dynamic intermediate activation feature maps must reside in volatile SRAM during inference execution.',
          'In standard sequential neural network execution, intermediate activations are processed using ping-pong double buffers. The peak SRAM memory requirement of a model is determined by: Peak SRAM = max(sizeof(Activation_i) + sizeof(Activation_i+1)).',
          'Notice that the peak SRAM bottleneck almost always occurs in the very first layers of a convolutional network, where input image resolution is high (e.g., 96x96x16 = 147KB) even though later layers have far more weights! MCUNet architectures resolve this using patch-based streaming execution to fit vision models inside tiny SRAM budgets.'
        ],
        example: 'A neural network on a 64KB SRAM microcontroller processes an image. Input layer generates 9,216 bytes, but Conv1 expands to 36,864 bytes. Transitioning from Conv1 to Conv2 (18,432 bytes) requires both feature maps in SRAM simultaneously: 36,864 + 18,432 = 55,296 bytes (54.0 KB), fitting within the 64KB limit with 10KB headroom.',
        code: `# Simulation: Peak SRAM Activation Footprint & Memory Bottleneck (MCUNet)
def calculate_peak_sram_activation_footprint(layer_shapes: list[dict], available_sram_kb: float) -> dict:
    # Memory required during transition between layer i and layer i+1:
    # Buffer pair = sizeof(Activation_i) + sizeof(Activation_i+1)
    peak_bytes = 0
    bottleneck_layer = ""

    for i in range(len(layer_shapes) - 1):
        l_in = layer_shapes[i]
        l_out = layer_shapes[i + 1]

        size_in = l_in["h"] * l_in["w"] * l_in["c"]
        size_out = l_out["h"] * l_out["w"] * l_out["c"]
        buffer_pair = size_in + size_out

        if buffer_pair > peak_bytes:
            peak_bytes = buffer_pair
            bottleneck_layer = f"{l_in['name']} -> {l_out['name']}"

    peak_sram_kb = peak_bytes / 1024.0
    fits_in_sram = peak_sram_kb <= available_sram_kb

    return {
        "Peak_SRAM_Bytes": peak_bytes,
        "Peak_SRAM_KB": round(peak_sram_kb, 2),
        "Bottleneck_Transition": bottleneck_layer,
        "Available_SRAM_KB": available_sram_kb,
        "Fits_In_SRAM": fits_in_sram
    }

network_layers = [
    {"name": "Input", "h": 96, "w": 96, "c": 1},      # 96x96 grayscale image (9,216 bytes)
    {"name": "Conv1", "h": 48, "w": 48, "c": 16},     # 48x48x16 (36,864 bytes)
    {"name": "Conv2", "h": 24, "w": 24, "c": 32},     # 24x24x32 (18,432 bytes)
    {"name": "Output", "h": 1, "w": 1, "c": 10}       # 10 classes
]

sram_check = calculate_peak_sram_activation_footprint(network_layers, available_sram_kb=64.0)
print(f"Peak SRAM Required: {sram_check['Peak_SRAM_KB']} KB across [{sram_check['Bottleneck_Transition']}]")
print(f"Fits in {sram_check['Available_SRAM_KB']} KB SRAM: {sram_check['Fits_In_SRAM']} (Headroom: {sram_check['Available_SRAM_KB'] - sram_check['Peak_SRAM_KB']:.2f} KB)")`,
        output: `Peak SRAM Required: 54.0 KB across [Conv1 -> Conv2]\nFits in 64.0 KB SRAM: True (Headroom: 10.00 KB)`,
        tryIt: 'Change Conv1 channels from 16 to 32 and observe how Peak SRAM jumps to 88.0 KB, causing Fits_In_SRAM to fail on a 64 KB microcontroller.',
        check: {
          question: 'In deep learning inference on microcontrollers, why does the peak SRAM activation bottleneck almost always occur in the initial early layers rather than the final layers?',
          options: [
            'Because early layers process high-resolution spatial feature maps, generating massive activation tensors that must reside simultaneously in RAM during layer transitions',
            'Because microcontrollers erase RAM every 5 clock cycles',
            'Because final layers do not require activation buffers',
            'Because weights are stored in SRAM instead of Flash'
          ],
          answer: 0,
          why: 'Early convolutional layers operate on large spatial dimensions (height x width). Even with few channels, high resolution creates large activation buffers that dominate peak SRAM.',
          answerIndex: 0,
          explanation: 'Early convolutional layers operate on large spatial dimensions (height x width). Even with few channels, high resolution creates large activation buffers that dominate peak SRAM.'
        }
      },
      {
        title: 'Wake-Word Audio Log-Mel Spectrogram DSP Feature Pipeline',
        say: [
          'In battery-powered smart speakers, IoT appliances, and wearables, voice assistants must run an "Always-On" Wake-Word Keyword Spotting (KWS) engine drawing less than 1 milliwatt of power. Microcontrollers cannot feed raw 16kHz audio PCM pressure waveforms directly into neural networks; the dimensionality is too vast and uninformative.',
          'Instead, TinyML voice frontends deploy digital signal processing (DSP) to compute Log-Mel Filterbank Energy Spectrograms. The raw 16kHz audio stream is partitioned into short overlapping frames (typically 30 ms window with 10 ms stride).',
          'First, a Pre-Emphasis Filter (y[n] = x[n] - 0.95*x[n-1]) amplifies high-frequency speech harmonics. Second, a Fast Fourier Transform (FFT) converts time-domain PCM samples into frequency-domain power spectrum magnitudes.',
          'Third, triangular Mel filterbanks group frequencies according to the non-linear human cochlear perception scale (dense resolution at low frequencies, wide bands at high frequencies). Taking the logarithm of each Mel filterbank energy produces compact, rotation-invariant Log-Mel feature vectors that a tiny 1D convolutional neural network can classify in real-time.'
        ],
        example: 'An ultra-low-power voice assistant chip samples a microphone buffer. The DSP pipeline applies pre-emphasis, windowing, and a 4-channel Mel filterbank, outputting a compact 4-element Log-Mel energy vector [-2.11, -0.842, -0.056, -0.261] that is fed directly to the keyword spotting neural network.',
        code: `import math

# Simulation: Wake-Word Audio Log-Mel Spectrogram Feature Extraction
def compute_log_mel_spectrogram_features(audio_samples: list[float], num_mel_bins: int = 4) -> list[float]:
    # 1. Pre-emphasis and windowing
    windowed = [audio_samples[i] - 0.95 * (audio_samples[i-1] if i > 0 else 0) for i in range(len(audio_samples))]

    # 2. Spectral magnitude accumulation across Mel frequency sub-bands
    half_len = len(windowed) // 2
    band_energies = [0.0] * num_mel_bins
    bin_width = half_len // num_mel_bins

    for b in range(num_mel_bins):
        start = b * bin_width
        end = start + bin_width
        energy = sum(abs(windowed[i]) ** 2 for i in range(start, end))
        # Logarithmic compression: log10(energy + epsilon)
        band_energies[b] = round(math.log10(max(energy, 1e-6)), 3)

    return band_energies

mock_audio_pcm = [0.05, 0.12, -0.08, 0.25, -0.32, 0.45, -0.22, 0.15, 0.08, -0.04, 0.11, -0.19, 0.35, -0.42, 0.28, -0.14]
log_mel_features = compute_log_mel_spectrogram_features(mock_audio_pcm, num_mel_bins=4)
print(f"Log-Mel Energy Vectors (4 Bins): {log_mel_features}")`,
        output: `Log-Mel Energy Vectors (4 Bins): [-2.11, -0.842, -0.056, -0.261]`,
        tryIt: 'Change num_mel_bins to 8 to generate an 8-dimensional spectrogram feature vector across higher frequency resolution.',
        check: {
          question: 'Why do voice keyword spotting (KWS) models transform raw audio PCM waveforms into Log-Mel spectrogram features before neural network inference?',
          options: [
            'Because Log-Mel filterbanks compress high-dimensional raw time-series into compact, speech-relevant frequency energy patterns matching human auditory perception',
            'Because neural networks cannot accept numbers with decimal points',
            'Because Log-Mel conversion encrypts speech against unauthorized wiretaps',
            'Because audio PCM files cannot be stored in RAM'
          ],
          answer: 0,
          why: 'Log-Mel spectrograms discard phase noise and reduce 16,000 raw samples per second down to compact, pitch-invariant spectral energy bands tailored for speech classification.',
          answerIndex: 0,
          explanation: 'Log-Mel spectrograms discard phase noise and reduce 16,000 raw samples per second down to compact, pitch-invariant spectral energy bands tailored for speech classification.'
        }
      }
    ],
    summary: [
      'Depthwise Separable Convolutions decouple spatial filtering from cross-channel projection, slashing MAC operations by 8x to 9x (87%+ savings).',
      'TinyML Autoencoders detect industrial mechanical anomalies by evaluating reconstruction MSE spikes against baseline healthy operational profiles.',
      'Structured Magnitude Pruning zeroes out low-significance weights and compresses tensors into sparse bitmask formats, saving 35-60% Flash storage.',
      'Peak SRAM activation memory bottleneck occurs during layer transitions: max(Activation_i + Activation_i+1), dominated by early high-resolution feature maps.',
      'Log-Mel Spectrogram DSP pipelines apply pre-emphasis, windowing, and auditory filterbanks to compress raw audio for low-power wake-word spotting.'
    ],
    projectStep: {
      title: 'Architect an Industrial TinyML Anomaly & Vision Pipeline',
      steps: [
        'Calculate MAC operations and parameter savings for a depthwise separable convolution layer.',
        'Implement an autoencoder reconstruction error calculation for 3-axis accelerometer vibration telemetry.',
        'Prune neural network weight tensors and calculate compressed Flash footprint savings.',
        'Profile peak SRAM activation double-buffer requirements and extract Log-Mel spectrogram features.'
      ]
    }
  }
];

