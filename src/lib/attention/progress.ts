// src/lib/attention/progress.ts
/**
 * Attention-span leaderboard and analytics, backed by
 * public.attention_span_progress (see the 20260909 migration)
 * with robust local JSON fallback to prevent cold-start data loss.
 */
import { supabase } from '@/lib/supabaseClient';
import { tableExists, getCampusSupabaseClient } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const TABLE = 'attention_span_progress';

export interface LeaderItem {
  userId: string;
  displayName: string;
  totalAccuracy: number;
}

export interface AttentionSpanRecord {
  user_id: string;
  display_name: string;
  total_accuracy: number;
  daily_logs: Record<string, any>;
  monthly_summaries: Record<string, any>;
  updated_at: string;
}

/**
 * Sanitizes display names to eliminate raw email addresses and PII leaks.
 * E.g., 'john.doe@university.edu' -> 'John.doe'
 */
export function sanitizeDisplayName(name: any): string {
  if (!name || typeof name !== 'string') return 'Student';
  const trimmed = name.trim();
  if (trimmed.includes('@')) {
    const userPart = trimmed.split('@')[0];
    return userPart ? userPart.charAt(0).toUpperCase() + userPart.slice(1) : 'Student';
  }
  return trimmed;
}

const toLeader = (r: Record<string, any>): LeaderItem => ({
  userId: r.user_id,
  displayName: sanitizeDisplayName(r.display_name),
  totalAccuracy: Number(r.total_accuracy) || 0,
});

const rankOf = (leaders: LeaderItem[], userId: string) => {
  const i = leaders.findIndex((l) => l.userId === userId);
  return i < 0 ? 0 : i + 1;
};

// --- Local JSON Fallback Store Operations ---
const LOCAL_DB_PATH = 'src/lib/data/attention_db.json';

async function readLocalAttentionRecords(): Promise<AttentionSpanRecord[]> {
  const data = await readLocalJson<{ progress: AttentionSpanRecord[] }>(
    LOCAL_DB_PATH,
    { progress: [] },
    'shared'
  );
  return Array.isArray(data?.progress) ? data.progress : [];
}

async function writeLocalAttentionRecords(records: AttentionSpanRecord[]): Promise<void> {
  await writeLocalJson(LOCAL_DB_PATH, { progress: records }, 'shared');
}

async function board() {
  const isPostgresReady = await tableExists(TABLE);
  if (isPostgresReady) {
    try {
      const client = await getCampusSupabaseClient();
      const { data, error } = await client
        .from(TABLE)
        .select('user_id, display_name, total_accuracy')
        .order('total_accuracy', { ascending: false })
        .limit(100);
      if (!error && data) {
        return data.map(toLeader);
      }
    } catch {
      // Fall through to local store
    }
  }

  // Local JSON fallback
  const local = await readLocalAttentionRecords();
  return local
    .sort((a, b) => b.total_accuracy - a.total_accuracy)
    .slice(0, 100)
    .map(toLeader);
}

export async function getAttentionLeaderboard(userId: string) {
  const leaders = await board();
  return { ok: true as const, leaders, userRank: rankOf(leaders, userId) };
}

export const DAILY_ATTENTION_ACCURACY_CAP = 600;
const dailyAccuracyEarnedMemory = new Map<string, number>();

export async function addAttentionAccuracy(
  userId: string,
  displayName: string,
  accuracyEarned: number,
) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.', leaders: [], userRank: 0 };

  const rawEarned = Number(accuracyEarned);
  if (!Number.isFinite(rawEarned) || rawEarned < 0) {
    return { ok: false as const, error: 'INVALID_SCORE', message: 'accuracyEarned must be a non-negative number.', leaders: [], userRank: 0 };
  }
  const earned = Math.min(100, Math.round(rawEarned));

  const cleanName = sanitizeDisplayName(displayName);
  const now = new Date().toISOString();
  const todayKey = now.slice(0, 10);
  const memKey = `${userId}:${todayKey}`;
  const memUsedToday = dailyAccuracyEarnedMemory.get(memKey) || 0;
  if (memUsedToday >= DAILY_ATTENTION_ACCURACY_CAP) {
    return {
      ok: false as const,
      error: 'DAILY_ACCURACY_CAP_REACHED',
      message: `Daily focus accuracy cap (${DAILY_ATTENTION_ACCURACY_CAP} pts) reached.`,
      leaders: [],
      userRank: 0,
    };
  }

  let updatedTotal = earned;
  let updatedDailyLogs: Record<string, any> | undefined;

  const isPostgresReady = await tableExists(TABLE);
  if (isPostgresReady) {
    try {
      const client = await getCampusSupabaseClient();
      const { data: existing } = await client
        .from(TABLE)
        .select('total_accuracy, daily_logs')
        .eq('user_id', userId)
        .maybeSingle();

      const existingLogs = (existing?.daily_logs && typeof existing.daily_logs === 'object') ? { ...existing.daily_logs } : {};
      const persistedToday = Math.max(memUsedToday, Number(existingLogs[todayKey]?.accuracyEarned) || 0);
      if (persistedToday >= DAILY_ATTENTION_ACCURACY_CAP) {
        dailyAccuracyEarnedMemory.set(memKey, persistedToday);
        return {
          ok: false as const,
          error: 'DAILY_ACCURACY_CAP_REACHED',
          message: `Daily focus accuracy cap (${DAILY_ATTENTION_ACCURACY_CAP} pts) reached.`,
          leaders: [],
          userRank: 0,
        };
      }
      const allowedEarned = Math.min(earned, DAILY_ATTENTION_ACCURACY_CAP - persistedToday);
      updatedTotal = (Number(existing?.total_accuracy) || 0) + allowedEarned;
      updatedDailyLogs = {
        ...existingLogs,
        [todayKey]: { ...(existingLogs[todayKey] || {}), accuracyEarned: persistedToday + allowedEarned },
      };

      const { error } = await client.from(TABLE).upsert({
        user_id: userId,
        display_name: cleanName,
        total_accuracy: updatedTotal,
        daily_logs: updatedDailyLogs,
        updated_at: now,
      }, { onConflict: 'user_id' });

      if (error) throw error;
      dailyAccuracyEarnedMemory.set(memKey, persistedToday + allowedEarned);
    } catch {
      updatedDailyLogs = undefined;
      // Fallback to local
    }
  }

  // Always sync to local store for offline resilience & cold-start preservation
  const local = await readLocalAttentionRecords();
  const existingIdx = local.findIndex(r => r.user_id === userId);
  if (existingIdx >= 0) {
    const localUsed = Math.max(memUsedToday, Number(local[existingIdx].daily_logs?.[todayKey]?.accuracyEarned) || 0);
    if (!updatedDailyLogs && localUsed >= DAILY_ATTENTION_ACCURACY_CAP) {
      dailyAccuracyEarnedMemory.set(memKey, localUsed);
      return {
        ok: false as const,
        error: 'DAILY_ACCURACY_CAP_REACHED',
        message: `Daily focus accuracy cap (${DAILY_ATTENTION_ACCURACY_CAP} pts) reached.`,
        leaders: [],
        userRank: 0,
      };
    }
    const delta = updatedDailyLogs ? 0 : Math.min(earned, DAILY_ATTENTION_ACCURACY_CAP - localUsed);
    if (!updatedDailyLogs) {
      dailyAccuracyEarnedMemory.set(memKey, localUsed + delta);
    }
    updatedTotal = Math.max(updatedTotal, (local[existingIdx].total_accuracy || 0) + delta);
    local[existingIdx].total_accuracy = updatedTotal;
    local[existingIdx].display_name = cleanName;
    local[existingIdx].daily_logs = updatedDailyLogs || {
      ...(local[existingIdx].daily_logs || {}),
      [todayKey]: { ...(local[existingIdx].daily_logs?.[todayKey] || {}), accuracyEarned: localUsed + delta },
    };
    local[existingIdx].updated_at = now;
  } else {
    const cappedFirst = Math.min(earned, DAILY_ATTENTION_ACCURACY_CAP);
    dailyAccuracyEarnedMemory.set(memKey, cappedFirst);
    local.push({
      user_id: userId,
      display_name: cleanName,
      total_accuracy: updatedTotal,
      daily_logs: updatedDailyLogs || { [todayKey]: { accuracyEarned: cappedFirst } },
      monthly_summaries: {},
      updated_at: now,
    });
  }
  await writeLocalAttentionRecords(local);

  const leaders = await board();
  return { ok: true as const, leaders, userRank: rankOf(leaders, userId), newTotalAccuracy: updatedTotal };
}

export async function getAttentionAnalytics(userId: string) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.', analytics: null };

  const isPostgresReady = await tableExists(TABLE);
  if (isPostgresReady) {
    try {
      const client = await getCampusSupabaseClient();
      const { data, error } = await client
        .from(TABLE)
        .select('daily_logs, monthly_summaries, updated_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        return {
          ok: true as const,
          analytics: {
            userId,
            dailyLogs: data?.daily_logs || {},
            monthlySummaries: data?.monthly_summaries || {},
            lastUpdated: data?.updated_at || new Date().toISOString(),
          },
        };
      }
    } catch {
      // Fallback to local
    }
  }

  // Local JSON fallback
  const local = await readLocalAttentionRecords();
  const found = local.find(r => r.user_id === userId);
  return {
    ok: true as const,
    analytics: {
      userId,
      dailyLogs: found?.daily_logs || {},
      monthlySummaries: found?.monthly_summaries || {},
      lastUpdated: found?.updated_at || new Date().toISOString(),
    },
  };
}

export async function saveAttentionAnalytics(
  userId: string,
  dailyLog?: Record<string, any>,
  monthlySummary?: Record<string, any>,
) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.', analytics: null };

  const current = await getAttentionAnalytics(userId);
  const dailyLogs = { ...(current.analytics?.dailyLogs || {}) };
  const monthlySummaries = { ...(current.analytics?.monthlySummaries || {}) };

  if (dailyLog?.date) dailyLogs[dailyLog.date] = { ...dailyLogs[dailyLog.date], ...dailyLog };
  if (monthlySummary?.month) monthlySummaries[monthlySummary.month] = { ...monthlySummaries[monthlySummary.month], ...monthlySummary };

  const now = new Date().toISOString();

  const isPostgresReady = await tableExists(TABLE);
  if (isPostgresReady) {
    try {
      const client = await getCampusSupabaseClient();
      await client.from(TABLE).upsert({
        user_id: userId,
        daily_logs: dailyLogs,
        monthly_summaries: monthlySummaries,
        updated_at: now,
      }, { onConflict: 'user_id' });
    } catch {
      // Non-blocking fallback to local
    }
  }

  // Sync to local JSON store
  const local = await readLocalAttentionRecords();
  const existingIdx = local.findIndex(r => r.user_id === userId);
  if (existingIdx >= 0) {
    local[existingIdx].daily_logs = dailyLogs;
    local[existingIdx].monthly_summaries = monthlySummaries;
    local[existingIdx].updated_at = now;
  } else {
    local.push({
      user_id: userId,
      display_name: 'Student',
      total_accuracy: 0,
      daily_logs: dailyLogs,
      monthly_summaries: monthlySummaries,
      updated_at: now,
    });
  }
  await writeLocalAttentionRecords(local);

  return { ok: true as const, analytics: { userId, dailyLogs, monthlySummaries, lastUpdated: now } };
}
