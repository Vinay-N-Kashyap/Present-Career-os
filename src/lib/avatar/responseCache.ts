// src/lib/avatar/responseCache.ts
/**
 * In-Memory LRU Response Cache for PinIT Career OS Avatar AI Mentors.
 * 
 * Invariants:
 * 1. Zero-Cost Phatic & Common Query Replay: Identical questions within a TTL window
 *    are served in 0ms without hitting external LLMs.
 * 2. Slide & Custom Code Bypass: Questions bound to specific slide snippets or complex
 *    active code blocks strictly bypass cache to ensure contextual accuracy.
 * 3. Deep Conversation Bypass: Multi-turn conversations (>2 turns) bypass cache
 *    to preserve nuanced dialogue context.
 * 4. Bounded Capacity & Automatic Eviction: LRU eviction prevents unbounded memory growth.
 */

export interface CacheEntry {
  reply: string;
  timestamp: number;
  hitCount: number;
}

export interface CacheOptions {
  maxEntries?: number;
  ttlMs?: number;
}

const DEFAULT_MAX_ENTRIES = 500;
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

class MentorResponseLRUCache {
  private store = new Map<string, CacheEntry>();
  private readonly maxEntries: number;
  private readonly ttlMs: number;

  constructor(opts?: CacheOptions) {
    this.maxEntries = opts?.maxEntries || DEFAULT_MAX_ENTRIES;
    this.ttlMs = opts?.ttlMs || DEFAULT_TTL_MS;
  }

  /**
   * Generates a stable normalized cache key from request context.
   */
  public generateKey(
    userMessage: string,
    mentorId: string,
    targetRole: string,
    questTitle: string
  ): string {
    const normalizedMsg = userMessage.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedMentor = (mentorId || 'default').trim().toLowerCase();
    const normalizedRole = (targetRole || 'general').trim().toLowerCase();
    const normalizedQuest = (questTitle || 'core').trim().toLowerCase();
    return `${normalizedMentor}::${normalizedRole}::${normalizedQuest}::${normalizedMsg}`;
  }

  /**
   * Retrieves a valid unexpired response from the cache.
   * Promotes the entry to most recently used.
   */
  public get(key: string, now = Date.now()): string | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (now - entry.timestamp > this.ttlMs) {
      this.store.delete(key);
      return null;
    }

    // Refresh LRU order (delete & re-insert)
    entry.hitCount += 1;
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.reply;
  }

  /**
   * Stores a response in the cache with LRU eviction when capacity is reached.
   */
  public set(key: string, reply: string, now = Date.now()): void {
    if (!key || !reply) return;

    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxEntries) {
      // Evict oldest (first key in iteration)
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    this.store.set(key, {
      reply,
      timestamp: now,
      hitCount: 0,
    });
  }

  /**
   * Determines if a request should bypass the cache entirely.
   */
  public shouldBypass(params: {
    hasSlideContext?: boolean;
    hasCodeSnippet?: boolean;
    historyLength?: number;
  }): boolean {
    if (params.hasSlideContext) return true;
    if (params.hasCodeSnippet) return true;
    if (typeof params.historyLength === 'number' && params.historyLength > 2) return true;
    return false;
  }

  public size(): number {
    return this.store.size;
  }

  public clear(): void {
    this.store.clear();
  }
}

// Global singleton instance for server-side in-memory caching
export const mentorResponseCache = new MentorResponseLRUCache();
