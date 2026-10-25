// ==========================================
// BLOCK 8 CODE SNIPPETS TEST SUITE (DAYS 36-40)
// ==========================================

// --- Day 36: Rotary Position Embeddings (RoPE) ---
function simulateRoPE2DRotation(vec: [number, number], m: number, theta: number = 10000, dimIndex: number = 0, d: number = 64) {
  const freq = 1.0 / Math.pow(theta, (2 * dimIndex) / d);
  const angle = m * freq;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  // [x * cos - y * sin, x * sin + y * cos]
  const rotatedX = vec[0] * cosA - vec[1] * sinA;
  const rotatedY = vec[0] * sinA + vec[1] * cosA;
  return {
    position: m,
    frequency: Number(freq.toFixed(6)),
    rotatedVector: [Number(rotatedX.toFixed(4)), Number(rotatedY.toFixed(4))]
  };
}

console.log('--- DAY 36: ROPE 2D ROTATION ---');
console.log(simulateRoPE2DRotation([1.0, 0.0], 5, 10000, 0, 64));

// --- Day 37: YaRN & Dynamic NTK-Aware Interpolation ---
function calculateYaRNWavelengths(d: number, theta: number, scaleFactor: number) {
  const results: { dimPair: number; wavelength: number; strategy: string }[] = [];
  const betaFast = 32;
  const betaSlow = 1;

  for (let i = 0; i < d; i += 16) {
    const freq = 1.0 / Math.pow(theta, (2 * (i / 2)) / d);
    const wavelength = 2 * Math.PI / freq;
    let strategy = 'Interpolate';
    if (wavelength > betaFast) {
      strategy = 'Extrapolate (High Freq)';
    } else if (wavelength < betaSlow) {
      strategy = 'Interpolate (Low Freq)';
    } else {
      strategy = 'YaRN Smooth Blend';
    }
    results.push({ dimPair: i / 2, wavelength: Number(wavelength.toFixed(1)), strategy });
  }
  return { scaleFactor, targetContext: 4096 * scaleFactor, wavelengthAudit: results };
}

console.log('--- DAY 37: YARN WAVELENGTHS ---');
console.log(calculateYaRNWavelengths(64, 10000, 4));

// --- Day 38: LongLoRA & Shifted Short Attention (S2-Attn) ---
function simulateS2AttnPartition(seqLen: number, groupSize: number) {
  const numGroups = Math.ceil(seqLen / groupSize);
  const shiftAmount = Math.floor(groupSize / 2);
  const standardGroups: number[][] = [];
  const shiftedGroups: number[][] = [];

  for (let g = 0; g < numGroups; g++) {
    const start = g * groupSize;
    standardGroups.push([start, Math.min(start + groupSize - 1, seqLen - 1)]);
    
    const shiftedStart = Math.max(0, start - shiftAmount);
    shiftedGroups.push([shiftedStart, Math.min(shiftedStart + groupSize - 1, seqLen - 1)]);
  }

  const fullAttnFlops = seqLen * seqLen;
  const s2AttnFlops = seqLen * groupSize;
  const reductionRatio = (fullAttnFlops / s2AttnFlops).toFixed(1);

  return {
    seqLen,
    groupSize,
    shiftAmount,
    numGroups,
    fullAttnFlops,
    s2AttnFlops,
    computeSavings: `${reductionRatio}x`
  };
}

console.log('--- DAY 38: LONG-LORA S2-ATTN ---');
console.log(simulateS2AttnPartition(8192, 2048));

// --- Day 39: RingAttention Circular Passing ---
function simulateRingAttentionPassing(numGpus: number, seqLenPerGpu: number) {
  const totalSeqLen = numGpus * seqLenPerGpu;
  const ringSteps = numGpus;
  const schedule: string[] = [];

  for (let step = 0; step < ringSteps; step++) {
    const pairs: string[] = [];
    for (let gpu = 0; gpu < numGpus; gpu++) {
      const kvSource = (gpu - step + numGpus) % numGpus;
      pairs.push(`GPU_${gpu}(Q) x KV_from_GPU_${kvSource}`);
    }
    schedule.push(`Step ${step}: ${pairs.slice(0, 2).join(' | ')} ... (+${numGpus - 2} ranks)`);
  }

  const kvBytesPerRankMB = Number(((seqLenPerGpu * 2 * 32 * 128 * 2) / (1024 ** 2)).toFixed(2));

  return {
    numGpus,
    totalTokens: totalSeqLen,
    kvMemoryPerGpuMB: kvBytesPerRankMB,
    ringSteps,
    scheduleSample: schedule.slice(0, 3)
  };
}

console.log('--- DAY 39: RING ATTENTION ---');
console.log(simulateRingAttentionPassing(8, 131072)); // 8 GPUs * 128k = 1,048,576 tokens

// --- Day 40: 1M-Token Needle-in-a-Haystack Capstone ---
function evaluate1MMilestoneCapstone() {
  const benchmarks = [
    { contextWindow: '4K Standard', ttftMs: 35.0, memoryPerGpuGB: 14.2, accuracy1MNeedle: '0.0%' },
    { contextWindow: '32K YaRN Scaled', ttftMs: 145.0, memoryPerGpuGB: 18.6, accuracy1MNeedle: '12.4%' },
    { contextWindow: '128K LongLoRA S2', ttftMs: 380.0, memoryPerGpuGB: 28.4, accuracy1MNeedle: '68.2%' },
    { contextWindow: '1M RingAttention Distributed', ttftMs: 820.0, memoryPerGpuGB: 34.1, accuracy1MNeedle: '99.8%' }
  ];

  return {
    capstoneArchitecture: 'Planetary 1M-Token Distributed Inference Engine',
    totalAccelerators: 8,
    interconnect: 'NVLink 4.0 + 800Gbps RoCEv2',
    benchmarkResults: benchmarks
  };
}

console.log('--- DAY 40: 1M-TOKEN CAPSTONE EVALUATION ---');
console.log(evaluate1MMilestoneCapstone());
