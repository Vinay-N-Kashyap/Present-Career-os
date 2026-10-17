// src/lib/avatar/memoryStore.ts
/**
 * Persistence for the avatar mentor's memory of a student.
 *
 * Previously /api/avatar/memory fell through to a catch-all returning
 * { ok: true } without writing anything, so the mentor forgot everything
 * between sessions while appearing to save.
 *
 * Shape matches usePersonalAvatarMemory.exportMemory(), which sends persona,
 * durable memories and relationship state — and deliberately omits
 * conversation transcripts. Nothing here should start storing transcripts.
 *
 * Returns { ok: false } rather than throwing when the table is absent, so a
 * project that has not run the migration degrades to "remembers nothing"
 * instead of erroring on every profile change.
 */
import { supabase } from '@/lib/supabaseClient';
import { tableExists, getCampusSupabaseClient } from '@/lib/services/supabaseTable';

const TABLE = 'avatar_memory';

export interface AvatarMemory {
  userId: string;
  persona: Record<string, any>;
  memories: unknown[];
  conversationHistory: unknown[];
  relationshipState: Record<string, any>;
}

const NOT_MIGRATED = {
  ok: false as const,
  error: 'TABLE_MISSING',
  message: 'avatar_memory does not exist. Apply supabase/migrations/20260909_create_avatar_memory.sql.',
};

const empty = (userId: string): AvatarMemory => ({
  userId, persona: {}, memories: [], conversationHistory: [], relationshipState: {},
});

export type TriStateMemoryResult =
  | { status: 'SUCCESS'; memory: AvatarMemory }
  | { status: 'NOT_FOUND'; memory: AvatarMemory }
  | { status: 'ERROR'; error: string; memory: AvatarMemory };

// In-Memory TTL Cache for Tri-State Memory Results to prevent Supabase query thrashing
const memoryCache = new Map<string, { result: TriStateMemoryResult; at: number }>();
const MEMORY_CACHE_TTL_MS = 120 * 1000; // 2 minutes

export function invalidateAvatarMemoryCache(userId?: string): void {
  if (userId) {
    memoryCache.delete(userId);
  } else {
    memoryCache.clear();
  }
}

export async function loadAvatarMemory(userId: string): Promise<AvatarMemory> {
  const result = await loadAvatarMemoryTriState(userId);
  return result.memory;
}

export async function loadAvatarMemoryTriState(userId: string): Promise<TriStateMemoryResult> {
  if (!userId) {
    return { status: 'ERROR', error: 'NO_USER_ID', memory: empty('') };
  }

  const cached = memoryCache.get(userId);
  if (cached && Date.now() - cached.at < MEMORY_CACHE_TTL_MS) {
    return cached.result;
  }

  const exists = await tableExists(TABLE);
  if (!exists) {
    const res: TriStateMemoryResult = { status: 'ERROR', error: 'TABLE_MISSING', memory: empty(userId) };
    memoryCache.set(userId, { result: res, at: Date.now() });
    return res;
  }
  const client = await getCampusSupabaseClient();
  const { data, error } = await client
    .from(TABLE)
    .select('persona, memories, relationship_state')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    const res: TriStateMemoryResult = { status: 'ERROR', error: error.message || 'DATABASE_QUERY_ERROR', memory: empty(userId) };
    // Cache errors briefly (10s) to avoid repeated hammering during outages
    memoryCache.set(userId, { result: res, at: Date.now() - (MEMORY_CACHE_TTL_MS - 10_000) });
    return res;
  }

  if (!data) {
    const res: TriStateMemoryResult = { status: 'NOT_FOUND', memory: empty(userId) };
    memoryCache.set(userId, { result: res, at: Date.now() });
    return res;
  }

  const res: TriStateMemoryResult = {
    status: 'SUCCESS',
    memory: {
      userId,
      persona: data.persona || {},
      memories: Array.isArray(data.memories) ? data.memories : [],
      // Never restored from storage — transcripts are not persisted by design.
      conversationHistory: [],
      relationshipState: data.relationship_state || {},
    },
  };
  memoryCache.set(userId, { result: res, at: Date.now() });
  return res;
}

export async function saveAvatarMemory(userId: string, incoming: unknown) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.' };
  if (!(await tableExists(TABLE))) return NOT_MIGRATED;

  const m = (incoming || {}) as Record<string, any>;
  const client = await getCampusSupabaseClient();
  const { error } = await client.from(TABLE).upsert({
    user_id: userId,
    persona: m.persona && typeof m.persona === 'object' ? m.persona : {},
    memories: Array.isArray(m.memories) ? m.memories : [],
    relationship_state: m.relationshipState && typeof m.relationshipState === 'object' ? m.relationshipState : {},
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw error;

  // Invalidate memory cache so next read gets updated state
  invalidateAvatarMemoryCache(userId);

  return { ok: true as const };
}
