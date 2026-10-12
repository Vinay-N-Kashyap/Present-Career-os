import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROLE_SCORING_MATRICES,
  normalizeRoleKey,
  calculateRoleWeightedScore,
  generatePersonaCoaching,
  type RoleKey,
} from '../src/lib/interview/scoringMatrix';

test('Scoring Matrix: All role weight matrices sum to exactly 1.0', () => {
  const roles = Object.keys(ROLE_SCORING_MATRICES) as RoleKey[];
  assert.ok(roles.length >= 14, `Expected at least 14 roles, found ${roles.length}`);

  for (const role of roles) {
    const config = ROLE_SCORING_MATRICES[role];
    const { logic, systems, comms, solving, star } = config.weights;
    const sum = logic + systems + comms + solving + star;
    const diff = Math.abs(sum - 1.0);
    assert.ok(diff < 1e-9, `Role ${role} weights must sum to 1.0 (got ${sum})`);
    assert.ok(config.roleName.length > 5, `Role ${role} must have descriptive name`);
    assert.ok(config.rubricFocus.length > 15, `Role ${role} must have substantial rubric focus`);
  }
});

test('Scoring Matrix: normalizeRoleKey accurately maps specialized engineering domains', () => {
  // Embedded & IoT
  assert.equal(normalizeRoleKey('Embedded Systems & IoT Engineering'), 'iot_embedded');
  assert.equal(normalizeRoleKey('Firmware & STM32 Microcontroller Architecture'), 'iot_embedded');
  assert.equal(normalizeRoleKey('ARM Cortex-M Bare-Metal Programming'), 'iot_embedded');

  // Quant & HFT
  assert.equal(normalizeRoleKey('Quantitative Systems & Algorithmic Trading'), 'quant_systems');
  assert.equal(normalizeRoleKey('High-Frequency Order Book Matching Engine'), 'quant_systems');
  assert.equal(normalizeRoleKey('Market Making Arbitrage Strategies'), 'quant_systems');

  // Cybersecurity
  assert.equal(normalizeRoleKey('Cybersecurity & Secure Systems'), 'cybersecurity');
  assert.equal(normalizeRoleKey('Zero Trust Identity & Cryptography'), 'cybersecurity');
  assert.equal(normalizeRoleKey('Penetration Testing & Threat Modeling'), 'cybersecurity');

  // AI/ML & LLM
  assert.equal(normalizeRoleKey('AI, Machine Learning & LLM Systems'), 'ai_ml');
  assert.equal(normalizeRoleKey('Generative AI & RAG Pipeline Engineering'), 'ai_ml');
  assert.equal(normalizeRoleKey('Deep Learning Transformer Architectures'), 'ai_ml');

  // Core baseline preservation
  assert.equal(normalizeRoleKey('Full Stack Web Developer'), 'sde');
  assert.equal(normalizeRoleKey('Power BI & Tableau Reporting'), 'data_analyst');
  assert.equal(normalizeRoleKey('Kubernetes Cluster Architecture'), 'devops');
});

test('Scoring Matrix: calculateRoleWeightedScore enforces deterministic math and verdicts', () => {
  // Test iot_embedded high score
  const iotResult = calculateRoleWeightedScore(
    { systems: 90, logic: 85, solving: 95, comms: 70, star: 60 },
    'iot_embedded'
  );
  // Expected: 90*0.35 + 85*0.25 + 95*0.25 + 70*0.10 + 60*0.05
  // = 31.5 + 21.25 + 23.75 + 7.0 + 3.0 = 86.5 -> 87
  assert.equal(iotResult.overallScore, 87);
  assert.equal(iotResult.verdict, 'Hire');
  assert.equal(iotResult.readiness, 'strong');

  // Test quant_systems balanced score
  const quantResult = calculateRoleWeightedScore(
    { systems: 80, logic: 80, solving: 70, comms: 60, star: 50 },
    'quant_systems'
  );
  // Expected: 80*0.35 + 80*0.35 + 70*0.15 + 60*0.08 + 50*0.07
  // = 28 + 28 + 10.5 + 4.8 + 3.5 = 74.8 -> 75
  assert.equal(quantResult.overallScore, 75);
  assert.equal(quantResult.verdict, 'Hire');
  assert.equal(quantResult.readiness, 'ready');

  // Test persona coaching integration
  const coaching = generatePersonaCoaching(
    'Pattern Hunter',
    iotResult.sanitizedDimensions,
    'iot_embedded'
  );
  assert.ok(coaching.personaSummary.includes('Embedded Systems & IoT Hardware Engineer'));
  assert.ok(coaching.coachingTips.length >= 3);
  assert.ok(coaching.tailoredStrengths.length >= 2);
});
