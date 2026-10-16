// src/lib/avatar/deterministicAdvisor.ts
/**
 * Deterministic Curriculum & Task Advisor for PinIT Career OS AI Mentors.
 * 
 * Invariants:
 * 1. Zero AI Hallucination: Tasks are derived strictly from verified curriculum arrays.
 * 2. Identity Guard: Snapshots are rejected if they do not match the authenticated user.
 * 3. Freshness Guard: Snapshots with NaN, future clock skew, or stale timestamps (>24h) are rejected.
 * 4. Intent Boundary: Curriculum advice is only triggered on anchored next-task intents, never open technical questions.
 * 5. Bounded Engagement Metric: Clamped strictly in range [0.10, 1.00].
 */

export interface CurriculumItem {
  questId: string;
  courseId: string;
  title?: string;
  orderIndex?: number;
}

export interface StudentProgressSnapshot {
  userId: string;
  courseId: string;
  completedQuestIds: string[];
  syncedAt: number;
}

export type AdvisorStatus =
  | 'VERIFIED_TASK'
  | 'COURSE_COMPLETED'
  | 'STALE_SNAPSHOT'
  | 'USER_MISMATCH'
  | 'INVALID_SNAPSHOT'
  | 'EMPTY_CURRICULUM';

export interface AdvisorResult {
  status: AdvisorStatus;
  speechText: string;
  questId?: string;
  courseId?: string;
  route?: string;
  ageSeconds?: number;
}

// ── 1. Strict Intent Regex (Anchored End-of-String) ──────────────────────────
export const NEXT_TASK_INTENT_REGEX =
  /^(?:what(?:'s|\s+is)\s+next|next\s+(?:task|quest|lesson)|what\s+should\s+i\s+(?:do|study)(?:\s+next)?)\s*[?.!]*$/i;

export function isNextTaskIntent(query: unknown): boolean {
  if (typeof query !== 'string') return false;
  return NEXT_TASK_INTENT_REGEX.test(query.trim());
}

// ── 2. Robust Timestamp & Freshness Validation ──────────────────────────────
export function isValidSnapshotTimestamp(
  syncedAt: unknown,
  maxAgeMs = 24 * 60 * 60 * 1000,
  referenceNow = Date.now()
): boolean {
  if (typeof syncedAt !== 'number' || !Number.isFinite(syncedAt)) {
    return false;
  }
  // Reject future timestamps exceeding 5 minutes clock skew
  if (syncedAt > referenceNow + 5 * 60 * 1000) {
    return false;
  }
  // Reject timestamps older than max allowable age
  if (referenceNow - syncedAt > maxAgeMs) {
    return false;
  }
  return true;
}

// ── 3. Mathematically Bounded Engagement Index ──────────────────────────────
export interface EngagementMetrics {
  streakDays?: unknown;
  completedQuests?: unknown;
  positiveSessions?: unknown;
}

export function calculateEngagementIndex(metrics?: EngagementMetrics): number {
  const m = metrics || {};
  const streak = typeof m.streakDays === 'number' && Number.isFinite(m.streakDays)
    ? Math.max(m.streakDays, 0)
    : 0;
  const quests = typeof m.completedQuests === 'number' && Number.isFinite(m.completedQuests)
    ? Math.max(m.completedQuests, 0)
    : 0;
  const sessions = typeof m.positiveSessions === 'number' && Number.isFinite(m.positiveSessions)
    ? Math.max(m.positiveSessions, 0)
    : 0;

  const base = 0.30;
  // Streak bonus: +0.05 per day up to 7 days (+0.35 max)
  const streakBonus = Math.min(streak * 0.05, 0.35);
  // Quest bonus: +0.01 per quest up to 25 quests (+0.25 max)
  const questBonus = Math.min(quests * 0.01, 0.25);
  // Session bonus: +0.02 per positive session up to 5 sessions (+0.10 max)
  const sessionBonus = Math.min(sessions * 0.02, 0.10);

  const raw = base + streakBonus + questBonus + sessionBonus;
  // Strictly clamped to [0.10, 1.00] and rounded to 2 decimal places
  const clamped = Math.min(Math.max(raw, 0.10), 1.00);
  return Number(clamped.toFixed(2));
}

// ── 4. Authoritative Next-Task Resolution ───────────────────────────────────
export function getAuthoritativeNextTask(
  snapshot: StudentProgressSnapshot,
  authenticatedUserId: string,
  curriculum: ReadonlyArray<CurriculumItem>,
  referenceNow = Date.now()
): AdvisorResult {
  // 1. Validate identity binding
  if (!snapshot || typeof snapshot !== 'object') {
    return {
      status: 'INVALID_SNAPSHOT',
      speechText: "Unable to read progress snapshot. Please refresh your dashboard.",
    };
  }

  if (!snapshot.userId || snapshot.userId !== authenticatedUserId) {
    return {
      status: 'USER_MISMATCH',
      speechText: "Session profile mismatch. Please sign in again to verify your progress.",
    };
  }

  // 2. Validate timestamp freshness
  if (!isValidSnapshotTimestamp(snapshot.syncedAt, 24 * 60 * 60 * 1000, referenceNow)) {
    return {
      status: 'STALE_SNAPSHOT',
      speechText: "I cannot verify your latest progress while offline. Please reconnect to confirm your next task.",
    };
  }

  // 3. Validate curriculum
  if (!Array.isArray(curriculum) || curriculum.length === 0) {
    return {
      status: 'EMPTY_CURRICULUM',
      speechText: "No curriculum roadmap found for this track. Please select a course to begin.",
    };
  }

  // 4. Find first incomplete quest in canonical prerequisite order
  const completedSet = new Set(
    Array.isArray(snapshot.completedQuestIds) ? snapshot.completedQuestIds : []
  );

  const nextItem = curriculum.find(item => item && item.questId && !completedSet.has(item.questId));

  const ageSeconds = Math.max(Math.floor((referenceNow - snapshot.syncedAt) / 1000), 0);

  if (!nextItem) {
    return {
      status: 'COURSE_COMPLETED',
      courseId: snapshot.courseId,
      speechText: "You have completed all curriculum quests in this track! Ready for your project capstone defense?",
      route: '/projects',
      ageSeconds,
    };
  }

  const titleSuffix = nextItem.title ? `: ${nextItem.title}` : '';
  return {
    status: 'VERIFIED_TASK',
    questId: nextItem.questId,
    courseId: nextItem.courseId,
    route: `/quests/${nextItem.courseId}/${nextItem.questId}`,
    speechText: `Your next priority is quest ${nextItem.questId}${titleSuffix}. Let's jump in.`,
    ageSeconds,
  };
}
