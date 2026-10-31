import { describe, it } from 'node:test';
import assert from 'node:assert';

// ── Pure Testable Logic: Trust Badge ─────────────────────────────────────────
export function getTrustBadge(trustScore: number) {
  if (trustScore >= 75) {
    return { label: 'High Trust', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' };
  }
  if (trustScore >= 40) {
    return { label: 'Moderate', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' };
  }
  if (trustScore > 0) {
    return { label: 'Initial Trust', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' };
  }
  return { label: 'Unverified', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' };
}

// ── Pure Testable Logic: Placement Tier Readiness ───────────────────────────
export interface PlacementTier {
  tierName: string;
  targetCtc: string;
  companies: string[];
  readinessPct: number;
  status: 'Ready to Apply' | 'Developing' | 'Gap to Bridge';
  recommendedActions: string[];
}

export function computePlacementReadiness(careerScore: number, verifiedCount: number, completedQuestsCount: number): PlacementTier[] {
  // Tier 3: Mass Recruiter (TCS, Infosys, Cognizant, Wipro) — ₹3.5 - ₹4.5 LPA
  // Criteria: Basic aptitude, syntax mastery, foundational quests (e.g. 5+ quests or career score >= 30)
  const massScore = Math.min(100, Math.round(
    (completedQuestsCount >= 5 ? 40 : completedQuestsCount * 8) +
    Math.min(40, careerScore * 0.8) +
    (verifiedCount > 0 ? 20 : 0)
  ));

  // Tier 2: Differential / Product Services (Zoho, Accenture Adv, Hexaware) — ₹6.5 - ₹9.0 LPA
  // Criteria: Intermediate DSA, full-stack project, verified certificate
  const diffScore = Math.min(100, Math.round(
    Math.min(40, completedQuestsCount * 4) +
    Math.min(40, careerScore * 0.5) +
    Math.min(20, verifiedCount * 10)
  ));

  // Tier 1: High-Growth Product Companies (Swiggy, Razorpay, CRED, Flipkart) — ₹12 - ₹20 LPA
  // Criteria: Advanced system design, verified GitHub portfolio, algorithmic speed
  const prodScore = Math.min(100, Math.round(
    Math.min(30, completedQuestsCount * 2) +
    Math.min(50, careerScore * 0.5) +
    Math.min(20, verifiedCount * 5)
  ));

  return [
    {
      tierName: 'Mass Recruiter Campus Drive',
      targetCtc: '₹3.6 - ₹4.5 LPA',
      companies: ['TCS Ninja', 'Infosys DSE', 'Cognizant GenC', 'Wipro Elite'],
      readinessPct: massScore,
      status: massScore >= 75 ? 'Ready to Apply' : massScore >= 40 ? 'Developing' : 'Gap to Bridge',
      recommendedActions: massScore >= 75 ? ['Attempt Company Mock Assessment'] : ['Complete 3 more DSA Quests'],
    },
    {
      tierName: 'Differential & Product Services',
      targetCtc: '₹6.5 - ₹9.0 LPA',
      companies: ['Zoho Corp', 'TCS Digital', 'Accenture Adv', 'Persistent'],
      readinessPct: diffScore,
      status: diffScore >= 75 ? 'Ready to Apply' : diffScore >= 40 ? 'Developing' : 'Gap to Bridge',
      recommendedActions: diffScore >= 75 ? ['Upload Project to Vault'] : ['Master System Architecture Module'],
    },
    {
      tierName: 'Tier-1 Product & Tech Startups',
      targetCtc: '₹12.0 - ₹20.0 LPA',
      companies: ['Swiggy', 'Razorpay', 'CRED', 'Flipkart'],
      readinessPct: prodScore,
      status: prodScore >= 75 ? 'Ready to Apply' : prodScore >= 40 ? 'Developing' : 'Gap to Bridge',
      recommendedActions: ['Build High-Scale Distributed System Project'],
    },
  ];
}

// ── Pure Testable Logic: Engineering Growth Stages ──────────────────────────
export const INDUSTRY_EVOLUTION_STAGES = [
  { stage: 1, icon: '🌱', name: 'Syntax & Logic Novice', desc: 'Variables, loops & conditional logic' },
  { stage: 2, icon: '⚙️', name: 'Algorithmic Problem Solver', desc: 'Data structures, complexity & clean OOP' },
  { stage: 3, icon: '🚀', name: 'Full-Stack Developer', desc: 'React, Node.js & relational schemas' },
  { stage: 4, icon: '⚡', name: 'Systems Architect', desc: 'Microservices, caching & cloud pipelines' },
  { stage: 5, icon: '🏆', name: 'Placement Ready Engineer', desc: 'Interview-cleared & high-scale ready' },
];

describe('STUDENT DASHBOARD — VISUAL & DYNAMIC OVERHAUL VALIDATION', () => {
  describe('Adversarial Test 1: Trust Score Classification & Badge Bug Fix', () => {
    it('correctly classifies 0% trust as Unverified (never "Moderate")', () => {
      const badge = getTrustBadge(0);
      assert.strictEqual(badge.label, 'Unverified');
      assert.strictEqual(badge.color, '#ef4444');
    });

    it('classifies 10% trust as Initial Trust', () => {
      const badge = getTrustBadge(10);
      assert.strictEqual(badge.label, 'Initial Trust');
      assert.strictEqual(badge.color, '#f59e0b');
    });

    it('classifies 50% trust as Moderate', () => {
      const badge = getTrustBadge(50);
      assert.strictEqual(badge.label, 'Moderate');
      assert.strictEqual(badge.color, '#3b82f6');
    });

    it('classifies 80% trust as High Trust', () => {
      const badge = getTrustBadge(80);
      assert.strictEqual(badge.label, 'High Trust');
      assert.strictEqual(badge.color, '#10b981');
    });
  });

  describe('Adversarial Test 2: Tier 3 Placement Readiness & Salary Predictor', () => {
    it('calculates mass recruiter readiness for a beginner student', () => {
      const tiers = computePlacementReadiness(15, 0, 2);
      assert.strictEqual(tiers.length, 3);
      assert.strictEqual(tiers[0].tierName, 'Mass Recruiter Campus Drive');
      assert.ok(tiers[0].readinessPct >= 20 && tiers[0].readinessPct <= 40);
      assert.strictEqual(tiers[0].status, 'Gap to Bridge');
    });

    it('recognizes high readiness for advanced student with verified items', () => {
      const tiers = computePlacementReadiness(80, 3, 12);
      assert.strictEqual(tiers[0].status, 'Ready to Apply');
      assert.ok(tiers[0].readinessPct >= 80);
      assert.ok(tiers[1].readinessPct >= 70);
    });
  });

  describe('Adversarial Test 3: Industry Engineering Growth Stages Structure', () => {
    it('has exactly 5 sequential stages with authentic industry labels', () => {
      assert.strictEqual(INDUSTRY_EVOLUTION_STAGES.length, 5);
      INDUSTRY_EVOLUTION_STAGES.forEach((stage, idx) => {
        assert.strictEqual(stage.stage, idx + 1);
        assert.ok(stage.icon.length > 0);
        assert.ok(stage.name.length > 5);
        assert.ok(stage.desc.length > 10);
      });
    });

    it('ensures stage 5 culminates in Placement Ready Engineer', () => {
      const stage5 = INDUSTRY_EVOLUTION_STAGES[4];
      assert.strictEqual(stage5.name, 'Placement Ready Engineer');
      assert.strictEqual(stage5.icon, '🏆');
    });
  });
});
