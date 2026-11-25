import { COURSES_REGISTRY, type Course } from '@/lib/data/coursesData';
import type { UserRoadmapEvidence } from '@/lib/roadmap/userEvidenceContext';
import { getRoadmapCourseIds } from '@/lib/roadmap/roadmapCourses';

export interface GapCourseRule {
  id: string;
  label: string;
  pattern: RegExp;
  courseIds: string[];
  pythonPreferredCourseIds?: string[];
}

export const GAP_COURSE_RULES: GapCourseRule[] = [
  {
    id: 'system_design',
    label: 'System Design & Distributed Architecture',
    pattern: /\b(?:system\s*design|distributed|scalability|microservices|architecture|caching|high[\s-]?scale|load\s*balanc)/i,
    courseIds: ['course-distributed-sys', 'course-sre-web', 'course-cloud-native', 'course-stream-web'],
    pythonPreferredCourseIds: ['course-distributed-python', 'course-distributed-sys', 'course-cloud-python'],
  },
  {
    id: 'dsa_algorithms',
    label: 'DSA, Trees, Graphs & Algorithms',
    pattern: /\b(?:dsa|trees?|graphs?|algorithms?|leetcode|dynamic\s+programming|recursion|heaps?|tries?)\b/i,
    courseIds: ['course-dsa-optim', 'course-dsa-python'],
    pythonPreferredCourseIds: ['course-dsa-python', 'course-dsa-optim'],
  },
  {
    id: 'behavioral_star',
    label: 'STAR Behavioral Interviews & Communication',
    pattern: /\b(?:star\b|behavioral|behavioural|communication|soft\s*skills|interview\s*prep|storytelling)\b/i,
    courseIds: ['course-softskills-communication'],
  },
  {
    id: 'database_perf',
    label: 'Database Engineering & Query Performance',
    pattern: /\b(?:sql|database|query\s*performance|postgres|indexing|transactions|acid)\b/i,
    courseIds: ['course-database-eng'],
  },
  {
    id: 'cloud_devops',
    label: 'Cloud & DevOps / CI-CD',
    pattern: /\b(?:cloud|aws|devops|ci\/?cd|docker|kubernetes|terraform|sre)\b/i,
    courseIds: ['course-cloud-native', 'course-devops-cicd', 'course-sre-web'],
    pythonPreferredCourseIds: ['course-cloud-python', 'course-devops-cicd', 'course-cloud-native'],
  },
  {
    id: 'ai_llm',
    label: 'AI Engineering, LLMs & Production ML',
    pattern: /\b(?:ai\b|llm|rag|vector|ml|machine\s*learning|deep\s*learning|agents?|nlp|safety)\b/i,
    courseIds: ['course-ai-eng', 'course-aideploy-web', 'course-ai-python'],
    pythonPreferredCourseIds: ['course-ai-python', 'course-vector-python', 'course-safety-python'],
  },
  {
    id: 'security',
    label: 'Security & Defensive Engineering',
    pattern: /\b(?:security|cyber|auth|oauth|owasp|encryption|appsec)\b/i,
    courseIds: ['course-cybersecurity', 'course-cyber-python'],
  },
  {
    id: 'backend_api',
    label: 'Production Backend APIs & Streaming',
    pattern: /\b(?:backend|node|express|api|grpc|kafka|streaming|concurrency)\b/i,
    courseIds: ['course-node-web', 'course-stream-web', 'course-python-backend'],
  },
  {
    id: 'business_strategy',
    label: 'Business Management, Finance & Analytics',
    pattern: /\b(?:business|entrepreneur|startup|venture|finance|accounting|marketing|e[\s-]?commerce|crm|operations)\b/i,
    courseIds: [
      'course-entrepreneurship-biz-mgmt',
      'course-business-analytics',
      'course-finance-investment',
      'course-marketing-branding',
      'course-ecommerce-digital-biz',
    ],
  },
];

const INTRO_REDUNDANCY_MAP: Record<string, RegExp> = {
  'course-fullstack-js': /\b(?:javascript|js|react|next\.?js|typescript)\b/i,
  'course-react-web': /\b(?:react|next\.?js|frontend)\b/i,
  'course-python-backend': /\b(?:python|flask|fastapi|django)\b/i,
  'course-java-logic': /\b(?:java)\b/i,
  'course-computer-fundamentals': /\b(?:python|javascript|java|c\+\+|react|sql)\b/i,
  'course-git-version-control': /\b(?:git|github)\b/i,
};

export function resolveGoalPrimaryCourse(requestedCourseId: string, goalText: string): Course {
  const explicit = COURSES_REGISTRY.find((c) => c.id === requestedCourseId);
  const lower = String(goalText || '').toLowerCase();
  if (!lower) {
    return explicit || COURSES_REGISTRY.find((c) => c.id === 'course-fullstack-js') || COURSES_REGISTRY[0];
  }

  // Commerce / Business specializations first when explicitly named in goal
  if (/\b(?:entrepreneur|startup|founder|business\s*management)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-entrepreneurship-biz-mgmt') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:e[\s-]?commerce|online\s*store|shopify)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-ecommerce-digital-biz') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:digital\s*marketing|seo|performance\s*marketing)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-digital-marketing') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:marketing|branding)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-marketing-branding') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:accounting|bookkeeping|tax)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-digital-accounting') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:finance|investment|banking|valuation)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-finance-investment') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:iot|embedded|firmware|esp32|arduino)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-iot-embedded') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:python\s*ai|ai\s*engineer|machine\s*learning|ml\b|llm|generative\s*ai)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-ai-python') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:system\s*design|distributed\s*systems|staff\s*engineer|principal\s*engineer)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-distributed-sys') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:dsa|algorithms|competitive\s*programming)\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-dsa-optim') || explicit || COURSES_REGISTRY[0];
  }
  if (/\b(?:full[\s-]?stack|react|node|web\s*dev|frontend|software\s*engineer|sde)\b/i.test(lower)) {
    if (/\bpython\b/i.test(lower) && !/\bfull[\s-]?stack\b/i.test(lower)) {
      return COURSES_REGISTRY.find((c) => c.id === 'course-python-backend') || explicit || COURSES_REGISTRY[0];
    }
    return COURSES_REGISTRY.find((c) => c.id === 'course-fullstack-js') || explicit || COURSES_REGISTRY[0];
  }
  if (/\bpython\b/i.test(lower)) {
    return COURSES_REGISTRY.find((c) => c.id === 'course-python-backend') || explicit || COURSES_REGISTRY[0];
  }

  return explicit || COURSES_REGISTRY.find((c) => c.id === 'course-fullstack-js') || COURSES_REGISTRY[0];
}

export function matchCourseGapLabels(course: Course, rawGaps: string[]): string[] {
  const cAny = course as any;
  const cSkills = Array.isArray(cAny.skills) ? cAny.skills.join(' ') : '';
  const haystack = `${course.title} ${course.desc} ${cSkills}`.toLowerCase();
  const matched: string[] = [];

  for (const gap of rawGaps) {
    const cleanGap = String(gap || '').trim();
    if (!cleanGap) continue;
    const lowerGap = cleanGap.toLowerCase();

    if (haystack.includes(lowerGap)) {
      matched.push(cleanGap);
      continue;
    }

    const rule = GAP_COURSE_RULES.find((r) => r.pattern.test(cleanGap));
    if (rule && (rule.courseIds.includes(course.id) || rule.pythonPreferredCourseIds?.includes(course.id))) {
      matched.push(cleanGap);
    }
  }
  return Array.from(new Set(matched));
}

export function selectRelevantCourseIds(params: {
  primaryCourseId: string;
  durationDays: number;
  goal: string;
  evidence: UserRoadmapEvidence | null;
  useResumeAndVault?: boolean;
}): string[] {
  const { primaryCourseId, durationDays, goal, evidence, useResumeAndVault = true } = params;
  const maxCourses = Math.max(1, Math.min(12, Math.round(Math.max(30, durationDays) / 30)));
  const canonicalIds = getRoadmapCourseIds(primaryCourseId, Math.max(durationDays, 90));

  // Strictly ignore resume, vault, and historical gaps when opted out or no evidence exists
  if (!useResumeAndVault || !evidence) {
    return getRoadmapCourseIds(primaryCourseId, durationDays).slice(0, maxCourses);
  }

  const combinedGaps = Array.from(
    new Set([...(evidence.weakAreas || []), ...(evidence.interviewGaps || [])].map((g) => g.trim()).filter(Boolean))
  );
  const existingSkillsList = Array.from(
    new Set([...(evidence.provenSkills || []), ...(evidence.claimedSkills || [])].map((s) => s.trim()).filter(Boolean))
  );
  const existingSkillsJoined = existingSkillsList.join(' ');
  const isPythonStrong =
    /\bpython\b/i.test(existingSkillsJoined + ' ' + goal) &&
    !/\b(?:javascript|react|node|full[\s-]?stack|frontend|web)\b/i.test(goal);

  const registryMap = new Map(COURSES_REGISTRY.map((c) => [c.id, c]));
  const hasRealGaps = combinedGaps.length > 0;
  const scoreMap = new Map<string, number>();

  for (const course of COURSES_REGISTRY) {
    const cAny = course as any;
    const cSkills: string[] = Array.isArray(cAny.skills) ? cAny.skills : [];
    const haystack = `${course.title} ${course.desc} ${cSkills.join(' ')} ${cAny.category || ''}`.toLowerCase();
    let score = 0;

    if (canonicalIds.includes(course.id)) score += 10;
    if (course.id === primaryCourseId) {
      // Only strongly anchor to primary starter course if not already mastered on resume or no specific gaps exist
      const introPattern = INTRO_REDUNDANCY_MAP[course.id];
      const alreadyMasteredPrimary = Boolean(hasRealGaps && introPattern && introPattern.test(existingSkillsJoined));
      score += alreadyMasteredPrimary ? -16 : 20;
    }

    // Penalize introductory starter courses whose core syntax skills are ALREADY on the student's resume when gaps exist
    if (hasRealGaps) {
      const introPattern = INTRO_REDUNDANCY_MAP[course.id];
      if (introPattern && introPattern.test(existingSkillsJoined)) {
        score -= 22;
      }
    }

    // Score goal keyword alignment cleanly
    for (const token of goal.toLowerCase().split(/[^a-z0-9+#]+/).filter((t) => t.length >= 3)) {
      if (haystack.includes(token)) score += 5;
    }

    scoreMap.set(course.id, score);
  }

  // Apply explicit high-priority semantic boost to exact gap-closing courses IN THE ORDER GAPS APPEAR
  const prioritizedGapCourseIds: string[] = [];
  for (const gap of combinedGaps) {
    let matchedRule: GapCourseRule | undefined;
    for (const rule of GAP_COURSE_RULES) {
      if (rule.pattern.test(gap)) {
        matchedRule = rule;
        break;
      }
    }
    if (matchedRule) {
      const list = isPythonStrong && matchedRule.pythonPreferredCourseIds
        ? matchedRule.pythonPreferredCourseIds
        : matchedRule.courseIds;
      const topCourseId = list.find((id) => registryMap.has(id));
      if (topCourseId) {
        scoreMap.set(topCourseId, (scoreMap.get(topCourseId) || 0) + 60);
        if (!prioritizedGapCourseIds.includes(topCourseId)) {
          prioritizedGapCourseIds.push(topCourseId);
        }
      }
      for (const extraId of list.slice(1)) {
        if (registryMap.has(extraId)) {
          scoreMap.set(extraId, (scoreMap.get(extraId) || 0) + 25);
        }
      }
    } else {
      for (const token of gap.toLowerCase().split(/[^a-z0-9+#]+/).filter((t) => t.length >= 3)) {
        for (const course of COURSES_REGISTRY) {
          const haystack = `${course.title} ${course.desc}`.toLowerCase();
          if (haystack.includes(token)) {
            scoreMap.set(course.id, (scoreMap.get(course.id) || 0) + 18);
          }
        }
      }
    }
  }

  // Build final ordered selection:
  // 1) Start with direct gap-closing courses when resume shows existing foundational skills
  // 2) Fill remaining duration slots from highest-scoring goal-aligned courses
  const chosen: string[] = [];
  for (const cid of prioritizedGapCourseIds) {
    if (chosen.length >= maxCourses) break;
    if (!chosen.includes(cid) && registryMap.has(cid)) chosen.push(cid);
  }

  const rankedByScore = [...COURSES_REGISTRY]
    .sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0))
    .map((c) => c.id);

  for (const cid of rankedByScore) {
    if (chosen.length >= maxCourses) break;
    if ((scoreMap.get(cid) || 0) <= 0 && chosen.length > 0) continue;
    if (!chosen.includes(cid)) chosen.push(cid);
  }

  for (const cid of canonicalIds) {
    if (chosen.length >= maxCourses) break;
    if (!chosen.includes(cid) && registryMap.has(cid)) chosen.push(cid);
  }

  return chosen.slice(0, maxCourses);
}
