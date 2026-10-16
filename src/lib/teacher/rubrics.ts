/**
 * PinIT Career OS - Teacher Assignment & Auto-Grading Rubric Engine
 * Module ID: TASK-854
 * Architecture Reference: teach-portal.md & PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf
 * 
 * Capabilities:
 * - Multi-dimensional rubric authoring (Code Correctness, Algorithmic Efficiency, Edge Cases, Clean Code).
 * - Mathematical invariant validation: Criteria weights must sum to exactly 100%.
 * - Automated submission scoring with granular criterion feedback and prescriptive remediation tips.
 * - Batch cohort evaluation and grading statistics.
 */

export interface RubricLevel {
  minScore: number;
  maxScore: number;
  label: string;
  feedback: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // e.g. 40 for 40%
  maxScore: number; // default 100
  levels: RubricLevel[];
}

export interface AssignmentRubric {
  id: string;
  assignmentId: string;
  institutionId: string;
  title: string;
  criteria: RubricCriterion[];
  passThreshold: number; // e.g. 60%
  createdAt: string;
}

export interface StudentSubmission {
  submissionId: string;
  studentRoll: string;
  assignmentId: string;
  institutionId: string;
  rawCriterionScores: Record<string, number>; // criterionId -> raw score (0-100)
  submittedAt: string;
}

export interface EvaluationResult {
  submissionId: string;
  studentRoll: string;
  assignmentId: string;
  overallScore: number; // 0 to 100
  passed: boolean;
  criterionFeedback: Array<{
    criterionId: string;
    criterionName: string;
    rawScore: number;
    weight: number;
    weightedContribution: number;
    levelLabel: string;
    feedback: string;
  }>;
  remediationPlan: string[];
}

export interface BatchGradingSummary {
  assignmentId: string;
  totalSubmissions: number;
  passCount: number;
  failCount: number;
  passRate: number; // percentage
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

/**
 * Validates that a rubric conforms to strict pedagogical invariants.
 */
export function validateRubric(rubric: AssignmentRubric): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!rubric.criteria || rubric.criteria.length === 0) {
    errors.push('Rubric must contain at least one evaluation criterion.');
    return { valid: false, errors };
  }

  let totalWeight = 0;
  const seenIds = new Set<string>();

  for (const c of rubric.criteria) {
    if (!c.id || seenIds.has(c.id)) {
      errors.push(`Criterion ID [${c.id}] is duplicate or missing.`);
    }
    seenIds.add(c.id);

    if (c.weight <= 0) {
      errors.push(`Criterion [${c.name}] must have positive weight.`);
    }
    totalWeight += c.weight;

    if (!c.levels || c.levels.length === 0) {
      errors.push(`Criterion [${c.name}] must define performance levels.`);
    }
  }

  if (Math.abs(totalWeight - 100) > 0.01) {
    errors.push(`Total criteria weight must sum to exactly 100% (currently ${totalWeight}%).`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Evaluates a single student submission against the rubric.
 */
export function evaluateSubmission(
  rubric: AssignmentRubric,
  submission: StudentSubmission
): EvaluationResult {
  const validation = validateRubric(rubric);
  if (!validation.valid) {
    throw new Error(`Invalid rubric: ${validation.errors.join('; ')}`);
  }

  if (submission.institutionId !== rubric.institutionId) {
    throw new Error(`Tenant mismatch: Submission institution does not match rubric institution.`);
  }

  let totalWeightedScore = 0;
  const criterionFeedback: EvaluationResult['criterionFeedback'] = [];
  const remediationPlan: string[] = [];

  for (const criterion of rubric.criteria) {
    const raw = submission.rawCriterionScores[criterion.id] ?? 0;
    const clampedRaw = Math.max(0, Math.min(100, raw));
    const contribution = (clampedRaw * criterion.weight) / 100;
    totalWeightedScore += contribution;

    // Find matching feedback level
    let matchedLevel = criterion.levels.find(
      (lvl) => clampedRaw >= lvl.minScore && clampedRaw <= lvl.maxScore
    );
    if (!matchedLevel && criterion.levels.length > 0) {
      matchedLevel = criterion.levels[0];
    }

    const levelLabel = matchedLevel ? matchedLevel.label : 'Evaluated';
    const feedback = matchedLevel ? matchedLevel.feedback : 'Score assigned.';

    criterionFeedback.push({
      criterionId: criterion.id,
      criterionName: criterion.name,
      rawScore: clampedRaw,
      weight: criterion.weight,
      weightedContribution: Math.round(contribution * 100) / 100,
      levelLabel,
      feedback,
    });

    if (clampedRaw < rubric.passThreshold) {
      remediationPlan.push(
        `Focus area: [${criterion.name}] scored ${clampedRaw}%. Recommendation: Review core concepts and re-verify edge case assertions.`
      );
    }
  }

  const finalScore = Math.round(totalWeightedScore * 100) / 100;
  const passed = finalScore >= rubric.passThreshold;

  return {
    submissionId: submission.submissionId,
    studentRoll: submission.studentRoll,
    assignmentId: rubric.assignmentId,
    overallScore: finalScore,
    passed,
    criterionFeedback,
    remediationPlan,
  };
}

/**
 * Batch grades a cohort of student submissions.
 */
export function batchGradeCohort(
  rubric: AssignmentRubric,
  submissions: StudentSubmission[]
): { evaluations: EvaluationResult[]; summary: BatchGradingSummary } {
  if (submissions.length === 0) {
    return {
      evaluations: [],
      summary: {
        assignmentId: rubric.assignmentId,
        totalSubmissions: 0,
        passCount: 0,
        failCount: 0,
        passRate: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
      },
    };
  }

  const evaluations = submissions.map((sub) => evaluateSubmission(rubric, sub));
  let totalScore = 0;
  let passCount = 0;
  let highestScore = 0;
  let lowestScore = 100;

  for (const ev of evaluations) {
    totalScore += ev.overallScore;
    if (ev.passed) passCount++;
    if (ev.overallScore > highestScore) highestScore = ev.overallScore;
    if (ev.overallScore < lowestScore) lowestScore = ev.overallScore;
  }

  const failCount = submissions.length - passCount;
  const passRate = Math.round((passCount / submissions.length) * 10000) / 100;
  const averageScore = Math.round((totalScore / submissions.length) * 100) / 100;

  return {
    evaluations,
    summary: {
      assignmentId: rubric.assignmentId,
      totalSubmissions: submissions.length,
      passCount,
      failCount,
      passRate,
      averageScore,
      highestScore,
      lowestScore,
    },
  };
}
