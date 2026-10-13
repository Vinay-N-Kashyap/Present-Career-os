import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';

test('Master Curriculum E2E: Total Course Count and Cumulative Day Volume Verification', () => {
  const allTrackPrefixes = [
    'react-basics',
    'python',
    'sql-mastery',
    'dsa-py',
    'ai-py',
    'dist-py',
    'cloud-py',
    'nlp-py',
    'quant-py',
    'prompt-py',
    'cyber-py',
    'train-py',
    'vec-py',
    'safe-py',
    'node-web',
    'devops',
    'cloud',
    'design',
    'dsa-optim',
    'dist',
    'cyber',
    'ai',
    'sre-web',
    'stream-web',
    'aideploy-web',
    'comp_fund',
    'git_vcs',
    'iot_emb',
    'quant-systems',
    'excel_viz',
    'blockchain',
    'mobile',
    'java-basics',
    'soft-skills',
    'g3d',
    'fullstack-js',
    'iot_edge',
    'iot_sec',
    'iot_net',
    'bcom_ana',
    'bcom_ops',
    'bcom_ait',
    'bcom-finance',
    'bcom-accounting',
    'bcom_scrm',
    'bcom_ent',
    'bcom_ecom',
    'bcom_dmkt',
    'bcom-marketing',
    'bcom_ban',
    'bcom_law',
    'bcom_tax',
    'bcom_aud'
  ];

  let totalResolvedDays = 0;
  for (const prefix of allTrackPrefixes) {
    for (let day = 1; day <= 30; day++) {
      const lesson = getLongLesson(prefix, day);
      if (lesson) {
        totalResolvedDays++;
      }
    }
  }

  assert.ok(allTrackPrefixes.length >= 36, `Must evaluate at least 36 unique tracks (got ${allTrackPrefixes.length})`);
  assert.ok(totalResolvedDays >= 800, `Must have at least 800 total resolved days (got ${totalResolvedDays})`);

  console.log(`Verified Master Curriculum: ${allTrackPrefixes.length} unique course prefixes, ${totalResolvedDays} total resolved long lesson days!`);
});

test('Master Curriculum E2E: All 14 B.Com & Business Specializations 100% Finalized (5/5 Days)', () => {
  const bcomSpecializations = [
    { prefix: 'bcom-accounting', name: 'Digital Accounting & ERP Systems' },
    { prefix: 'bcom-finance', name: 'Financial Markets & Investment Banking' },
    { prefix: 'bcom_aud', name: 'Auditing, Corporate Governance & Internal Controls' },
    { prefix: 'bcom_tax', name: 'Corporate & International Taxation' },
    { prefix: 'bcom_law', name: 'Corporate Law, Securities Regulations & SEBI Compliance' },
    { prefix: 'bcom_ban', name: 'Banking Operations, FinTech & Credit Underwriting' },
    { prefix: 'bcom_ops', name: 'Operations, Supply Chain & Logistics Management' },
    { prefix: 'bcom_ait', name: 'AI, Automation & Digital Transformation for Business' },
    { prefix: 'bcom_ana', name: 'Business Analytics, Power BI & Decision Intelligence' },
    { prefix: 'bcom-marketing', name: 'Marketing & Brand Strategy' },
    { prefix: 'bcom_scrm', name: 'Sales, Customer Success & Enterprise CRM' },
    { prefix: 'bcom_ent', name: 'Entrepreneurship & Venture Creation' },
    { prefix: 'bcom_ecom', name: 'E-Commerce Operations, DTC & Marketplace Strategy' },
    { prefix: 'bcom_dmkt', name: 'Digital Marketing Analytics & Performance Attribution' }
  ];

  assert.equal(bcomSpecializations.length, 14, 'Must evaluate exactly 14 B.Com specializations');

  for (const spec of bcomSpecializations) {
    for (let day = 1; day <= 5; day++) {
      const lesson = getLongLesson(spec.prefix, day);
      assert.ok(lesson, `B.Com specialization ${spec.prefix} (${spec.name}) Day ${day} must resolve`);
      assert.equal(lesson.day, day);
      assert.equal(lesson.parts.length, 5, `Day ${day} of ${spec.prefix} must have exactly 5 parts`);

      // Verify language
      assert.equal(getLongLessonLanguage(spec.prefix), 'python', `${spec.prefix} must use Python runner`);

      // Verify realistic duration
      const spoken = estimateSpokenMinutes(lesson);
      const total = estimateLessonMinutes(lesson);
      assert.ok(spoken >= 8, `Day ${day} of ${spec.prefix} spoken minutes (${spoken}) must be >= 8`);
      assert.ok(total >= 15, `Day ${day} of ${spec.prefix} total lesson minutes (${total}) must be >= 15`);

      // Verify parts invariants
      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        assert.ok(part.title.length > 0, `Part ${pIdx + 1} title in ${spec.prefix} Day ${day} must be non-empty`);
        assert.ok(part.say.length >= 3, `Part ${pIdx + 1} say in ${spec.prefix} Day ${day} must have >= 3 paragraphs`);
        assert.ok(part.example && part.example.length > 0, `Part ${pIdx + 1} example in ${spec.prefix} Day ${day} must be non-empty`);
        assert.ok(part.code && part.code.length > 0, `Part ${pIdx + 1} code in ${spec.prefix} Day ${day} must exist`);
        assert.ok(part.output && part.output.length > 0, `Part ${pIdx + 1} output in ${spec.prefix} Day ${day} must exist`);
        assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${pIdx + 1} tryIt in ${spec.prefix} Day ${day} must exist`);
        
        // Socratic check
        const check = part.check as any;
        assert.ok(check.question.length > 0);
        assert.ok(check.options.length >= 3, `Part ${pIdx + 1} in ${spec.prefix} Day ${day} must have >= 3 options`);
        const ans = check.answerIndex ?? check.answer;
        assert.ok(ans >= 0 && ans < check.options.length);
        const explanation = check.explanation ?? check.why;
        assert.ok(explanation && explanation.length > 0);
      }
    }
  }

  console.log('All 14 B.Com & Business Specializations 100% verified across all 5 days and 350 total lesson parts!');
});

test('Master Curriculum E2E: Standalone Tech & Systems Masterclasses Finalized (5/5 Days)', () => {
  const techMasterclasses = [
    'comp_fund',
    'git_vcs',
    'iot_emb',
    'quant-systems',
    'excel_viz',
    'blockchain',
    'mobile',
    'java-basics',
    'soft-skills',
    'g3d',
    'fullstack-js',
    'iot_edge',
    'iot_sec',
    'iot_net'
  ];

  for (const prefix of techMasterclasses) {
    for (let day = 1; day <= 5; day++) {
      const lesson = getLongLesson(prefix, day);
      assert.ok(lesson, `Tech course ${prefix} Day ${day} must resolve`);
      assert.equal(lesson.day, day);
      assert.equal(lesson.parts.length, 5, `Day ${day} of ${prefix} must have 5 parts`);
    }
  }

  console.log(`All ${techMasterclasses.length} Standalone Tech Masterclasses 100% verified across all 5 days!`);
});

test('Master Curriculum E2E: Full-Length 30-Day Engineering Tracks Finalized (30/30 Days)', () => {
  const fullTracks = [
    'python',
    'react-basics',
    'sql-mastery',
    'node-web',
    'devops',
    'cloud',
    'dist',
    'cyber',
    'ai',
    'sre-web',
    'stream-web',
    'aideploy-web',
    'cloud-py',
    'cyber-py',
    'nlp-py',
    'quant-py',
    'safe-py',
    'train-py',
    'vec-py'
  ];

  for (const prefix of fullTracks) {
    for (let day = 1; day <= 30; day++) {
      const lesson = getLongLesson(prefix, day);
      assert.ok(lesson, `Full track ${prefix} Day ${day} must resolve`);
      assert.equal(lesson.day, day);
      assert.ok(lesson.parts.length >= 4, `Day ${day} of ${prefix} must have at least 4 parts`);
    }
  }

  console.log(`All ${fullTracks.length} Full-Length 30-Day Engineering Tracks verified across all 30 days!`);
});
