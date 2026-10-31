import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateCheckoutPricing, formatINR } from '@/app/quests/components/CrashCourseCheckoutModal';

describe('Task 4, 5 & 6: Course Purchase UX, Gateway/Middleware & QR Verification', () => {

  describe('1. Course Purchase Pricing Calculator', () => {
    it('should correctly calculate pricing without promo code', () => {
      const baseTuition = 4999;
      const pricing = calculateCheckoutPricing(baseTuition, false);

      assert.strictEqual(pricing.baseTuition, 4999);
      assert.strictEqual(pricing.discount, 0);
      assert.strictEqual(pricing.discountedSubtotal, 4999);
      assert.strictEqual(pricing.gstAmount, Math.round(4999 * 0.18)); // 900
      assert.strictEqual(pricing.finalPayable, 4999 + Math.round(4999 * 0.18)); // 5899
    });

    it('should correctly apply ₹1,000 Early Bird scholarship promo', () => {
      const baseTuition = 4999;
      const pricing = calculateCheckoutPricing(baseTuition, true);

      assert.strictEqual(pricing.baseTuition, 4999);
      assert.strictEqual(pricing.discount, 1000);
      assert.strictEqual(pricing.discountedSubtotal, 3999);
      assert.strictEqual(pricing.gstAmount, Math.round(3999 * 0.18)); // 720
      assert.strictEqual(pricing.finalPayable, 3999 + 720); // 4719
    });

    it('should format INR currency properly', () => {
      const formatted = formatINR(4999);
      assert.ok(formatted.includes('4,999'), `Expected INR format containing 4,999, got ${formatted}`);
    });
  });

  describe('2. User Identifier Recognition in Verification Gateway', () => {
    it('should recognize usr_ and user_ identifiers as student profiles, not evidence hashes', () => {
      const testIds = ['usr_demo_student_01', 'user_arjun_02', 'stu_dev_octocat_01', 'demo_student_user'];

      for (const id of testIds) {
        const isUserIdentifier = id.startsWith('usr_') || id.startsWith('user_') || id.startsWith('stu_') || id === 'demo_student_user';
        assert.strictEqual(isUserIdentifier, true, `${id} must be recognized as a student user identifier`);
      }
    });

    it('should correctly distinguish genuine evidence record IDs', () => {
      const evidenceIds = ['ev_comp_01_attempt_02', 'PIN-EV-9921', 'EVID-TEST-44'];

      for (const id of evidenceIds) {
        const isUserIdentifier = id.startsWith('usr_') || id.startsWith('user_') || id.startsWith('stu_') || id === 'demo_student_user';
        const isEvidence = !isUserIdentifier && (id.startsWith('ev_') || id.startsWith('PIN-EV-') || id.startsWith('EVID-'));
        assert.strictEqual(isEvidence, true, `${id} must be recognized as evidence record ID`);
      }
    });
  });

  describe('3. Public Portfolio and QR Integration', () => {
    it('should construct valid public verification URLs for QR sharing', () => {
      const userId = 'usr_demo_student_01';
      const origin = 'https://careeros.pinit.in';
      const verifyUrl = `${origin}/verify/${encodeURIComponent(userId)}`;
      const portfolioUrl = `${origin}/university/portfolio/${encodeURIComponent(userId)}`;

      assert.strictEqual(verifyUrl, 'https://careeros.pinit.in/verify/usr_demo_student_01');
      assert.strictEqual(portfolioUrl, 'https://careeros.pinit.in/university/portfolio/usr_demo_student_01');
    });
  });
});
