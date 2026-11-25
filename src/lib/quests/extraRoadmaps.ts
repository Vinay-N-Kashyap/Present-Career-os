export interface ExtraRoadmapEvidenceSummary {
  usedResume?: boolean;
  resumeTitle?: string | null;
  vaultDocsCount?: number;
  provenSkills?: string[];
  targetGaps?: string[];
  selectedCourseIds?: string[];
}

export interface ExtraRoadmap {
  id: string;
  number: number;
  goal: string;
  courseId: string;
  durationDays: number;
  dailyPace: number;
  track: string;
  createdAt: number;
  usedResume?: boolean;
  evidenceSummary?: ExtraRoadmapEvidenceSummary;
}

export interface CompactExtraModuleBlueprint {
  id: string;
  courseId?: string;
  courseTitle?: string;
  title: string;
  desc: string;
  difficulty: string;
  estimatedWeeks: number;
  startDay?: number;
  endDay?: number;
  personalizedPaceTag?: string;
  knowledgeAdaptationTag?: string;
  whyThisStage?: string;
  skillsAddressed?: string[];
  targetedGaps?: string[];
  questIds: string[];
  fastTrackedFirstQuest?: { title: string; desc: string };
}

export type LearningPathMode = 'fused_roadmap' | 'single_course' | `extra:${string}`;

export function extraRoadmapMode(id: string): `extra:${string}` {
  return `extra:${id}`;
}

export function extraIdFromMode(mode: string): string | null {
  return mode.startsWith('extra:') ? mode.slice(6) : null;
}

export function extrasStorageKey(userId: string) {
  return `pinit_${userId}_extra_roadmaps`;
}

export function extraModulesKey(userId: string, extraId: string) {
  return `pinit_${userId}_extra_roadmap_${extraId}_modules`;
}

export function formatDurationLabel(durationDays: number): string {
  const days = Math.max(1, Math.round(Number(durationDays) || 30));
  if (days >= 360) return `${days} Days (1 Year)`;
  const months = Math.round((days / 30) * 10) / 10;
  return `${days} Days (${months} ${months === 1 ? 'Month' : 'Months'})`;
}

export function formatCompactDuration(durationDays: number): string {
  const days = Math.max(1, Math.round(Number(durationDays) || 30));
  return `${days}d`;
}

export function nextRoadmapNumber(extras: ExtraRoadmap[]): number {
  return extras.reduce((max, rm) => Math.max(max, rm.number || 0), 1) + 1;
}

export function createExtraId(): string {
  return `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isExtraRoadmap(value: unknown): value is ExtraRoadmap {
  if (!value || typeof value !== 'object') return false;
  const rm = value as ExtraRoadmap;
  return (
    typeof rm.id === 'string' &&
    rm.id.length > 0 &&
    typeof rm.number === 'number' &&
    Number.isFinite(rm.number) &&
    rm.number >= 2 &&
    typeof rm.goal === 'string' &&
    typeof rm.courseId === 'string' &&
    typeof rm.durationDays === 'number' &&
    typeof rm.dailyPace === 'number'
  );
}

export function parseExtraRoadmaps(raw: string | null): ExtraRoadmap[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed
      .filter(isExtraRoadmap)
      .filter(rm => {
        if (seen.has(rm.id)) return false;
        seen.add(rm.id);
        return true;
      })
      .map(rm => ({
        ...rm,
        track: typeof rm.track === 'string' ? rm.track : '',
        createdAt: typeof rm.createdAt === 'number' && Number.isFinite(rm.createdAt) ? rm.createdAt : 0
      }))
      .sort((a, b) => a.number - b.number || a.createdAt - b.createdAt);
  } catch {
    return [];
  }
}

export function compactModulesForStorage(modules: unknown): CompactExtraModuleBlueprint[] {
  if (!Array.isArray(modules)) return [];
  return modules
    .filter((m): m is Record<string, any> => Boolean(m && typeof m === 'object' && typeof (m as any).id === 'string'))
    .map((m) => {
      const questIds: string[] = Array.isArray(m.questIds)
        ? m.questIds.filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
        : Array.isArray(m.quests)
          ? m.quests.map((q: any) => q?.id).filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
          : [];
      const firstQuest = Array.isArray(m.quests) ? m.quests[0] : null;
      const fastTrackedFirstQuest = firstQuest?.fastTracked && typeof firstQuest?.title === 'string' && typeof firstQuest?.desc === 'string'
        ? { title: firstQuest.title, desc: firstQuest.desc }
        : m.fastTrackedFirstQuest;

      return {
        id: String(m.id),
        ...(typeof m.courseId === 'string' ? { courseId: m.courseId } : {}),
        ...(typeof m.courseTitle === 'string' ? { courseTitle: m.courseTitle } : {}),
        title: String(m.title || 'Roadmap Stage'),
        desc: String(m.desc || ''),
        difficulty: String(m.difficulty || 'Intermediate'),
        estimatedWeeks: Math.max(1, Number(m.estimatedWeeks) || 1),
        ...(typeof m.startDay === 'number' ? { startDay: m.startDay } : {}),
        ...(typeof m.endDay === 'number' ? { endDay: m.endDay } : {}),
        ...(typeof m.personalizedPaceTag === 'string' ? { personalizedPaceTag: m.personalizedPaceTag } : {}),
        ...(typeof m.knowledgeAdaptationTag === 'string' ? { knowledgeAdaptationTag: m.knowledgeAdaptationTag } : {}),
        ...(typeof m.whyThisStage === 'string' ? { whyThisStage: m.whyThisStage } : {}),
        ...(Array.isArray(m.skillsAddressed) ? { skillsAddressed: m.skillsAddressed.map(String) } : {}),
        ...(Array.isArray(m.targetedGaps) ? { targetedGaps: m.targetedGaps.map(String) } : {}),
        questIds,
        ...(fastTrackedFirstQuest ? { fastTrackedFirstQuest } : {}),
      };
    });
}

export function rehydrateExtraModules(
  stored: unknown,
  coursesRegistry?: ReadonlyArray<{ id: string; quests?: any[] }>
): any[] | null {
  if (!Array.isArray(stored) || stored.length === 0) return null;
  // Already full-object module array
  if (Array.isArray((stored[0] as any)?.quests)) {
    return stored;
  }
  if (!Array.isArray(coursesRegistry) || coursesRegistry.length === 0) {
    return stored as any[];
  }

  const questMap = new Map<string, any>();
  for (const course of coursesRegistry) {
    for (const q of course.quests || []) {
      if (q?.id && !questMap.has(q.id)) {
        questMap.set(q.id, q);
      }
    }
  }

  const hydrated = stored
    .map((bp: any) => {
      const ids: string[] = Array.isArray(bp?.questIds) ? bp.questIds : [];
      const quests = ids
        .map((id, qIdx) => {
          const base = questMap.get(id);
          if (!base) return null;
          if (qIdx === 0 && bp.fastTrackedFirstQuest) {
            return {
              ...base,
              title: bp.fastTrackedFirstQuest.title,
              desc: bp.fastTrackedFirstQuest.desc,
              fastTracked: true,
            };
          }
          return base;
        })
        .filter(Boolean);
      return {
        ...bp,
        quests,
      };
    })
    .filter((m) => Array.isArray(m.quests) && m.quests.length > 0);

  return hydrated.length > 0 ? hydrated : null;
}

function evictOversizedModuleCaches(exceptKey?: string) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (!k || k === exceptKey) continue;
      if (/^pinit_.*(?:_extra_roadmap_.*_modules|_roadmap_modules(?:_.*)?)$/.test(k)) {
        keysToRemove.push(k);
      }
    }
    // Remove largest entries first to free quota without losing active roadmap metadata
    keysToRemove
      .sort((a, b) => (localStorage.getItem(b)?.length || 0) - (localStorage.getItem(a)?.length || 0))
      .slice(0, 6)
      .forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });
  } catch {}
}

function safeStorageSetItem(key: string, value: string): boolean {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    evictOversizedModuleCaches(key);
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
}

function canPersist(userId: string) {
  return typeof window !== 'undefined' && !!userId && userId !== 'guest';
}

export function writeExtraRoadmaps(userId: string, extras: ExtraRoadmap[]) {
  if (!canPersist(userId)) return;
  safeStorageSetItem(extrasStorageKey(userId), JSON.stringify(extras));
}

export function writeExtraModules(userId: string, extraId: string, modules: unknown) {
  if (!canPersist(userId)) return;
  const compact = compactModulesForStorage(modules);
  const payload = compact.length > 0 ? compact : modules;
  safeStorageSetItem(extraModulesKey(userId, extraId), JSON.stringify(payload));
}

export function readExtraModules(
  userId: string,
  extraId: string,
  coursesRegistry?: ReadonlyArray<{ id: string; quests?: any[] }>
): unknown[] | null {
  if (!canPersist(userId)) return null;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(extraModulesKey(userId, extraId));
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return rehydrateExtraModules(parsed, coursesRegistry);
  } catch {
    return null;
  }
}

export function removeExtraModules(userId: string, extraId: string) {
  if (!canPersist(userId)) return;
  try {
    localStorage.removeItem(extraModulesKey(userId, extraId));
  } catch {}
}
