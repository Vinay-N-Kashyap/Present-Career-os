# scripts/visuals/iot_edge_ai_spec_m1_rest.py
# Month 1, Days 16-30 (Blocks 4-6) for Course 18: Edge AI, DSP & TinyML Systems (course-iot-edge-ai)
# Total Quests: 60 Quests (Days 16-30)

DAYS_16_TO_30 = [
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
    "spokenGoal": "Every industrial machine has slightly different baseline acoustics. A motor installed on a concrete foundation sounds different than the identical motor mounted on a flexible steel frame. A factory-trained model cannot know every customer's installation environment! Can a microcontroller learn and adapt to its local machine on-site without cloud connectivity? Yes: through On-Device Continuous Learning and Few-Shot Adaptation. You cannot run full backpropagation across all layers of a deep neural network on an MCU—it would require megabytes of gradient memory and float32 math. The solution: Freeze the Feature Extractor! The pre-trained convolutional backbone (stored in read-only Flash) acts as a static feature extractor, mapping complex sensor inputs into a compact 16-dimensional embedding vector. The microcontroller only trains a tiny Linear Classification Head (a single layer of weights stored in non-volatile Flash or EEPROM). Master On-Device Online Gradient Descent: update the linear head using Ridge Regression or Stochastic Gradient Descent (SGD) with just 5 to 10 local samples, customizing the model to its local machine in seconds!",
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
]
