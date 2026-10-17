/**
 * PinIT Career OS - Placement Intelligence & Employability Probability Engine
 * Module ID: TASK-861
 * Architecture Reference: INSTITUTIONAL_ONE_PAGER_MEMO.md & PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf
 * 
 * Capabilities:
 * - Multi-signal candidate employability modeling:
 *   - ATS Resume Parsing & Relevance (25%)
 *   - Practical Algorithmic Coding Percentile (25%)
 *   - Systems Engineering & LongLesson Quests (20%)
 *   - AI 3D Avatar Verbal Interview Assessment (15%)
 *   - GitHub Repository Proof-of-Work Provenance (15%)
 * - Tiered Company Alignment:
 *   - TIER_1_PRODUCT (Google, Microsoft, Amazon, Stripe Ready: >= 85)
 *   - TIER_2_UNICORN (Swiggy, Razorpay, Cred, Postman Ready: 70 - 84)
 *   - TIER_3_ENTERPRISE (TCS Digital, Infosys Power, Accenture Ready: 55 - 69)
 *   - DEVELOPMENT_NEEDED (< 55)
 * - Automated Skill Gap Detection and Cohort Placement Readiness Analytics.
 */

export type EmployabilityTier =
  | 'TIER_1_PRODUCT'
  | 'TIER_2_UNICORN'
  | 'TIER_3_ENTERPRISE'
  | 'DEVELOPMENT_NEEDED';

export interface CandidateMetrics {
  studentRoll: string;
  fullName: string;
  department: string;
  institutionId: string;
  atsScore: number; // 0 - 100
  codingPercentile: number; // 0 - 100
  systemsQuestCompletion: number; // 0 - 100
  interviewCommunicationScore: number; // 0 - 100
  githubProvenanceScore: number; // 0 - 100
  skills: string[];
}

export interface EmployabilityProfile {
  studentRoll: string;
  fullName: string;
  department: string;
  institutionId: string;
  hiringProbabilityScore: number; // 0 - 100
  tier: EmployabilityTier;
  targetCompanies: string[];
  strengths: string[];
  skillGaps: string[];
  radarDimensions: {
    ats: number;
    coding: number;
    systems: number;
    communication: number;
    provenance: number;
  };
}

export interface RecruiterFilterCriteria {
  minProbability?: number;
  minAtsScore?: number;
  targetTier?: EmployabilityTier;
  requiredSkills?: string[];
  department?: string;
}

const TIER_TARGET_COMPANIES: Record<EmployabilityTier, string[]> = {
  TIER_1_PRODUCT: ['Google', 'Microsoft', 'Amazon AWS', 'Stripe', 'Atlassian'],
  TIER_2_UNICORN: ['Razorpay', 'Swiggy', 'Cred', 'Postman', 'Zerodha'],
  TIER_3_ENTERPRISE: ['TCS Digital', 'Infosys Power Programmer', 'Wipro Turbo', 'Accenture Tech'],
  DEVELOPMENT_NEEDED: ['PinIT Career Accelerator Remedial Labs'],
};

/**
 * Computes individual candidate hiring probability and employability tier.
 */
export function computeEmployabilityProfile(
  candidate: CandidateMetrics,
  institutionId: string
): EmployabilityProfile {
  if (candidate.institutionId !== institutionId) {
    throw new Error(`Tenant mismatch: Candidate does not belong to institution [${institutionId}].`);
  }

  const ats = Math.max(0, Math.min(100, candidate.atsScore || 0));
  const coding = Math.max(0, Math.min(100, candidate.codingPercentile || 0));
  const systems = Math.max(0, Math.min(100, candidate.systemsQuestCompletion || 0));
  const comm = Math.max(0, Math.min(100, candidate.interviewCommunicationScore || 0));
  const prov = Math.max(0, Math.min(100, candidate.githubProvenanceScore || 0));

  // Weighted Employability Probability Model
  // ATS (25%) + Coding (25%) + Systems (20%) + Comm (15%) + Provenance (15%)
  const probability = Math.round(
    ats * 0.25 + coding * 0.25 + systems * 0.20 + comm * 0.15 + prov * 0.15
  );

  let tier: EmployabilityTier = 'DEVELOPMENT_NEEDED';
  if (probability >= 85) {
    tier = 'TIER_1_PRODUCT';
  } else if (probability >= 70) {
    tier = 'TIER_2_UNICORN';
  } else if (probability >= 55) {
    tier = 'TIER_3_ENTERPRISE';
  }

  const strengths: string[] = [];
  const skillGaps: string[] = [];

  if (ats >= 80) strengths.push('High-Impact ATS Resume Optimization');
  else skillGaps.push('Resume ATS Keyword Alignment');

  if (coding >= 80) strengths.push('Top-Decile Data Structures & Algorithms');
  else skillGaps.push('Advanced DSA Complexity & Edge Case Assertions');

  if (systems >= 80) strengths.push('Production Systems Architecture & Invariants');
  else skillGaps.push('Distributed Systems & Concurrency Foundations');

  if (comm >= 80) strengths.push('Articulate Verbal Technical Communication');
  else skillGaps.push('Mock Interview STAR-Method Articulation');

  if (prov >= 80) strengths.push('Authentic GitHub Production Provenance');
  else skillGaps.push('Open-Source Proof-of-Work Verification');

  return {
    studentRoll: candidate.studentRoll,
    fullName: candidate.fullName,
    department: candidate.department,
    institutionId,
    hiringProbabilityScore: probability,
    tier,
    targetCompanies: TIER_TARGET_COMPANIES[tier],
    strengths,
    skillGaps,
    radarDimensions: {
      ats,
      coding,
      systems,
      communication: comm,
      provenance: prov,
    },
  };
}

/**
 * Filters and ranks candidates for campus recruiter talent search.
 */
export function rankCandidatesForRecruiter(
  candidates: CandidateMetrics[],
  criteria: RecruiterFilterCriteria,
  institutionId: string
): EmployabilityProfile[] {
  const profiles = candidates
    .filter((c) => c.institutionId === institutionId)
    .map((c) => computeEmployabilityProfile(c, institutionId));

  return profiles
    .filter((p) => {
      if (criteria.minProbability && p.hiringProbabilityScore < criteria.minProbability) {
        return false;
      }
      if (criteria.minAtsScore && p.radarDimensions.ats < criteria.minAtsScore) {
        return false;
      }
      if (criteria.targetTier && p.tier !== criteria.targetTier) {
        return false;
      }
      if (criteria.department && p.department.toUpperCase() !== criteria.department.toUpperCase()) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.hiringProbabilityScore - a.hiringProbabilityScore);
}

/**
 * Aggregates cohort skill gaps across all candidates.
 */
export function detectCohortSkillGaps(
  candidates: CandidateMetrics[],
  institutionId: string
): Array<{ skillGap: string; studentCount: number; percentage: number }> {
  const filtered = candidates.filter((c) => c.institutionId === institutionId);
  if (filtered.length === 0) return [];

  const gapCounts: Record<string, number> = {};

  for (const c of filtered) {
    const profile = computeEmployabilityProfile(c, institutionId);
    for (const gap of profile.skillGaps) {
      gapCounts[gap] = (gapCounts[gap] || 0) + 1;
    }
  }

  return Object.entries(gapCounts)
    .map(([skillGap, studentCount]) => ({
      skillGap,
      studentCount,
      percentage: Math.round((studentCount / filtered.length) * 1000) / 10,
    }))
    .sort((a, b) => b.studentCount - a.studentCount);
}
