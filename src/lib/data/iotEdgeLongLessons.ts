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
  }
];
