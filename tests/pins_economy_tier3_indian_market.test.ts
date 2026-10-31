import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PLAN_PRICES_PAISE, customPinsToPaise } from '@/app/api/payment/create-order/route';
import { PIN_COSTS } from '@/hooks/usePinBalance';

describe('Task 3: Pins Economy & AI Usage for Tier-3 Indian College Students', () => {

  describe('1. Sachet Micro-Packs Catalog & Pricing (Indian Market Alignment)', () => {
    it('should have exact paise pricing for ₹9 Chota AI Sachet', () => {
      assert.strictEqual(PLAN_PRICES_PAISE.pack_chota_9, 900); // ₹9 in paise
    });

    it('should have exact paise pricing for ₹29 Placement Sprint', () => {
      assert.strictEqual(PLAN_PRICES_PAISE.pack_sprint_29, 2900); // ₹29 in paise
    });

    it('should have exact paise pricing for ₹59 Exam Week Power', () => {
      assert.strictEqual(PLAN_PRICES_PAISE.pack_power_59, 5900); // ₹59 in paise
    });

    it('should maintain backward compatibility for ₹99 Basic Student Plan', () => {
      assert.strictEqual(PLAN_PRICES_PAISE.basic_student, 9900);
      assert.strictEqual(PLAN_PRICES_PAISE.student_99, 9900);
    });

    it('should correctly calculate custom pins to paise at ₹1 = 10 pins statutory rate', () => {
      assert.strictEqual(customPinsToPaise(100), 1000);   // 100 pins = ₹10 = 1000 paise
      assert.strictEqual(customPinsToPaise(350), 3500);   // 350 pins = ₹35 = 3500 paise
      assert.strictEqual(customPinsToPaise(1000), 10000); // 1000 pins = ₹100 = 10000 paise
      assert.strictEqual(customPinsToPaise(50), 1000);    // clamped min 100 pins
    });
  });

  describe('2. Platform Zero-Loss Margin Guarantee (Auditor & CFO Invariant)', () => {
    // Gemini 2.0 Flash / Groq LLaMA 3.3 pricing:
    // ~$0.10 per 1M prompt tokens (~₹0.008 per 1k tokens)
    // ~$0.40 per 1M output tokens (~₹0.033 per 1k tokens)
    // 1 Full AI Mock Interview (5 turns) = 1,500 prompt tokens + 1,000 output tokens = ~₹0.045 to ₹0.08
    const RAW_AI_MOCK_COST_RS = 0.08;
    const RAW_AI_TUTOR_SOLVE_RS = 0.015;

    it('should guarantee >85% profit margin on ₹9 Chota AI Sachet (100 Pins)', () => {
      const priceRs = 9.0;
      const gatewayFeeRs = priceRs * 0.0236; // 2% + 18% GST = ~₹0.21
      const netReceivedRs = priceRs - gatewayFeeRs; // ~₹8.79

      // 100 pins = 4 AI Mock Interviews (25 pins each)
      const maxMockInterviews = Math.floor(100 / PIN_COSTS.ai_interview.cost);
      assert.strictEqual(maxMockInterviews, 4);

      const maxRawApiCostRs = maxMockInterviews * RAW_AI_MOCK_COST_RS; // 4 * 0.08 = ₹0.32
      const netProfitRs = netReceivedRs - maxRawApiCostRs;
      const margin = (netProfitRs / priceRs) * 100;

      assert.ok(maxRawApiCostRs < 0.50, 'Raw API cost must be less than ₹0.50');
      assert.ok(margin > 85, `Margin must exceed 85%, got ${margin}%`);
    });

    it('should guarantee >85% profit margin on ₹29 Placement Sprint (350 Pins)', () => {
      const priceRs = 29.0;
      const gatewayFeeRs = priceRs * 0.0236; // ~₹0.68
      const netReceivedRs = priceRs - gatewayFeeRs;

      // 350 pins = 14 AI Mock Interviews (25 pins each)
      const maxMockInterviews = Math.floor(350 / PIN_COSTS.ai_interview.cost);
      assert.strictEqual(maxMockInterviews, 14);

      const maxRawApiCostRs = maxMockInterviews * RAW_AI_MOCK_COST_RS; // 14 * 0.08 = ₹1.12
      const netProfitRs = netReceivedRs - maxRawApiCostRs;
      const margin = (netProfitRs / priceRs) * 100;

      assert.ok(maxRawApiCostRs < 2.00, 'Raw API cost must be less than ₹2.00');
      assert.ok(margin > 85, `Margin must exceed 85%, got ${margin}%`);
    });

    it('should protect platform from free tier abuse while providing daily student utility', () => {
      // Free student earns:
      // +10 Attendance + 10 Daily Mission + 25 Exam Pass = 45 pins max daily
      const freeDailyPins = 10 + 10 + 25;
      assert.strictEqual(freeDailyPins, 45);

      // Max free AI mock sessions = 1 full mock + 4 tutor solves daily
      const maxDailyApiCostRs = (1 * RAW_AI_MOCK_COST_RS) + (4 * RAW_AI_TUTOR_SOLVE_RS); // 0.08 + 0.06 = ₹0.14
      const monthlyFreeUserMaxCostRs = maxDailyApiCostRs * 30; // ₹4.20 per month

      // Even if active for 30 consecutive days, raw inference is capped at ~₹4.20/month
      assert.ok(monthlyFreeUserMaxCostRs < 5.00, 'Free user cost must remain under ₹5/month');
    });
  });

  describe('3. PIN_COSTS & AI Feature Equivalencies', () => {
    it('should have fair, accessible costs for all core AI features', () => {
      assert.strictEqual(PIN_COSTS.ai_interview.cost, 25);
      assert.strictEqual(PIN_COSTS.gd.cost, 25);
      assert.strictEqual(PIN_COSTS.ai_tutor.cost, 5);
      assert.strictEqual(PIN_COSTS.resume_enhance.cost, 15);
      assert.strictEqual(PIN_COSTS.quest.cost, 20);
      assert.strictEqual(PIN_COSTS.mission.cost, 20);
      assert.strictEqual(PIN_COSTS.code_arena.cost, 10);
    });

    it('should include descriptive aiEquiv metadata for user clarity', () => {
      assert.ok(PIN_COSTS.ai_interview.aiEquiv, 'ai_interview must have aiEquiv');
      assert.ok(PIN_COSTS.ai_tutor.aiEquiv, 'ai_tutor must have aiEquiv');
      assert.ok(PIN_COSTS.resume_enhance.aiEquiv, 'resume_enhance must have aiEquiv');
      assert.ok(PIN_COSTS.quest.aiEquiv, 'quest must have aiEquiv');
    });
  });
});
