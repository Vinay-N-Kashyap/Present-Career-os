import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeEmployabilityProfile,
  rankCandidatesForRecruiter,
  detectCohortSkillGaps,
  CandidateMetrics,
} from '../src/lib/admin/placement';

describe('TASK-861: Placement Intelligence & Employability Probability Engine', () => {
  const mockCandidates: CandidateMetrics[] = [
    {
      studentRoll: 'CS-001',
      fullName: 'Aarav Sharma',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      atsScore: 92,
      codingPercentile: 96,
      systemsQuestCompletion: 90,
      interviewCommunicationScore: 88,
      githubProvenanceScore: 90,
      skills: ['TypeScript', 'Distributed Systems', 'PostgreSQL', 'React'],
    },
    {
      studentRoll: 'CS-002',
      fullName: 'Priya Verma',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      atsScore: 80,
      codingPercentile: 75,
      systemsQuestCompletion: 70,
      interviewCommunicationScore: 78,
      githubProvenanceScore: 72,
      skills: ['Python', 'FastAPI', 'Redis'],
    },
    {
      studentRoll: 'CS-003',
      fullName: 'Vikram Singh',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      atsScore: 45,
      codingPercentile: 40,
      systemsQuestCompletion: 35,
      interviewCommunicationScore: 48,
      githubProvenanceScore: 30,
      skills: ['Java Core'],
    },
  ];

  test('computes TIER_1_PRODUCT profile for top-tier candidate with product target companies', () => {
    const profile = computeEmployabilityProfile(mockCandidates[0], 'inst-apex-001');

    assert.equal(profile.tier, 'TIER_1_PRODUCT');
    assert.ok(profile.hiringProbabilityScore >= 85);
    assert.ok(profile.targetCompanies.includes('Google'));
    assert.ok(profile.targetCompanies.includes('Stripe'));
    assert.ok(profile.strengths.includes('Top-Decile Data Structures & Algorithms'));
    assert.equal(profile.skillGaps.length, 0);
  });

  test('computes TIER_2_UNICORN profile for solid candidate', () => {
    const profile = computeEmployabilityProfile(mockCandidates[1], 'inst-apex-001');

    assert.equal(profile.tier, 'TIER_2_UNICORN');
    assert.ok(profile.hiringProbabilityScore >= 70 && profile.hiringProbabilityScore < 85);
    assert.ok(profile.targetCompanies.includes('Razorpay'));
  });

  test('identifies struggling candidate as DEVELOPMENT_NEEDED with granular skill gaps', () => {
    const profile = computeEmployabilityProfile(mockCandidates[2], 'inst-apex-001');

    assert.equal(profile.tier, 'DEVELOPMENT_NEEDED');
    assert.ok(profile.hiringProbabilityScore < 55);
    assert.ok(profile.skillGaps.length >= 4);
    assert.ok(profile.skillGaps.includes('Resume ATS Keyword Alignment'));
    assert.ok(profile.skillGaps.includes('Advanced DSA Complexity & Edge Case Assertions'));
  });

  test('ranks candidates for campus recruiters based on filter criteria', () => {
    const ranked = rankCandidatesForRecruiter(
      mockCandidates,
      { minProbability: 70, targetTier: 'TIER_1_PRODUCT' },
      'inst-apex-001'
    );

    assert.equal(ranked.length, 1);
    assert.equal(ranked[0].studentRoll, 'CS-001');
  });

  test('strictly blocks candidate evaluation when institutionId does not match', () => {
    assert.throws(() => {
      computeEmployabilityProfile(mockCandidates[0], 'inst-metro-002');
    }, /Tenant mismatch/);
  });

  test('aggregates cohort skill gaps across all candidates correctly', () => {
    const gaps = detectCohortSkillGaps(mockCandidates, 'inst-apex-001');

    assert.ok(gaps.length > 0);
    // CS-002 and CS-003 both lack >80 in several categories
    const topGap = gaps[0];
    assert.ok(topGap.studentCount >= 1);
    assert.ok(topGap.percentage > 0);
  });
});
