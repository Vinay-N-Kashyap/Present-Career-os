import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { generateDynamicStudentRoadmap } from '@/lib/data/roadmapFuser';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { collectUserRoadmapEvidence, type UserRoadmapEvidence } from '@/lib/roadmap/userEvidenceContext';
import { getRoadmapCourseIds } from '@/lib/roadmap/roadmapCourses';

function stripThinkingAndFences(raw: string): string {
  return String(raw || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^[\s\S]*?```(?:json)?/i, '')
    .replace(/```[\s\S]*$/, '')
    .trim();
}

/**
 * Deterministically ranks COURSES_REGISTRY matches against the user's goal, resume/vault
 * skills, projects, and declared weak areas/gaps when LLM selection is absent or offline.
 */
function selectEvidenceDrivenCourseIds(
  primaryCourseId: string,
  durationDays: number,
  goal: string,
  evidence: UserRoadmapEvidence | null
): string[] {
  const maxCourses = Math.max(1, Math.min(6, Math.round(Math.max(30, durationDays) / 30)));
  const canonicalIds = getRoadmapCourseIds(primaryCourseId, durationDays);
  if (!evidence) return canonicalIds.slice(0, maxCourses);

  const gapText = [...evidence.weakAreas, ...evidence.interviewGaps, goal].join(' ').toLowerCase();
  const provenSet = new Set(evidence.provenSkills.map((s) => s.toLowerCase()));

  const scored = COURSES_REGISTRY.map((course) => {
    const cAny = course as any;
    const courseSkills: string[] = Array.isArray(cAny.skills) ? cAny.skills : [];
    const courseCat = String(cAny.category || '');
    const haystack = `${course.title} ${course.desc} ${courseSkills.join(' ')} ${courseCat}`.toLowerCase();
    let score = 0;

    if (course.id === primaryCourseId) score += 25;
    if (canonicalIds.includes(course.id)) score += 12;

    // Strong boost for courses covering declared weak areas, interview gaps, and explicit goal
    for (const token of gapText.split(/[^a-z0-9+#]+/).filter((t) => t.length >= 3)) {
      if (haystack.includes(token)) score += 6;
    }

    // Moderate boost for extending projects/skills already present on resume
    for (const skill of [...evidence.claimedSkills, ...evidence.provenSkills]) {
      const s = skill.toLowerCase();
      if (s.length >= 2 && haystack.includes(s)) {
        score += provenSet.has(s) ? 2 : 4;
      }
    }

    return { id: course.id, score };
  }).sort((a, b) => b.score - a.score);

  const chosen: string[] = [];
  for (const item of scored) {
    if (item.score <= 0 && chosen.length > 0) break;
    if (!chosen.includes(item.id)) chosen.push(item.id);
    if (chosen.length >= maxCourses) break;
  }

  // Top up with canonical path if fewer than maxCourses matched strongly
  for (const cid of canonicalIds) {
    if (chosen.length >= maxCourses) break;
    if (!chosen.includes(cid)) chosen.push(cid);
  }
  return chosen.slice(0, maxCourses);
}

async function callRoadmapAi(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const groqKeys = [
    ...(process.env.GROQ_API_KEYS || '').split(',').map((k) => k.trim()).filter(Boolean),
    ...(process.env.GROQ_API_KEY ? [process.env.GROQ_API_KEY.trim()] : []),
  ];

  const groqModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];
  for (const key of groqKeys) {
    for (const model of groqModels) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.35,
            max_tokens: 1100,
          }),
          signal: AbortSignal.timeout(7000),
        });
        if (res.ok) {
          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content;
          if (typeof content === 'string' && content.trim()) return content;
        }
      } catch {}
    }
  }

  // Gemini Flash failover when Groq keys are unavailable
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: { temperature: 0.35, maxOutputTokens: 1100 },
          }),
          signal: AbortSignal.timeout(7000),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text === 'string' && text.trim()) return text;
      }
    } catch {}
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`roadmap_gen_${ip}`, { limit: 20, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many roadmap generation requests. Please wait a minute.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const authCheck = await requireUserFromRequest(req);
    if (authCheck.error || !authCheck.user?.id) {
      return authCheck.error || NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    const userId = authCheck.user.id;

    const body = await req.json().catch(() => ({}));
    const {
      goal = '',
      courseId = 'course-fullstack-js',
      durationDays = 30,
      dailyPace = 3,
      archetype = 'Pattern Hunter',
      qt1 = 40,
      qt2 = 40,
      useResumeAndVault = true,
      extraId,
      replacePrimary = false,
    } = body;

    let admin: any = null;
    try {
      admin = getSupabaseAdmin();
    } catch {}

    const evidence = useResumeAndVault !== false
      ? await collectUserRoadmapEvidence(admin, userId, { parseStorageResume: true })
      : null;

    const resolvedGoal =
      String(goal || '').trim() ||
      evidence?.careerGoal ||
      evidence?.targetRole ||
      'Full-Stack Software Engineer';

    const matchedCourse =
      COURSES_REGISTRY.find((c) => c.id === courseId) ||
      COURSES_REGISTRY.find((c) => c.id === 'course-fullstack-js') ||
      COURSES_REGISTRY[0];

    const maxCourses = Math.max(1, Math.min(6, Math.round(Math.max(30, Number(durationDays) || 30) / 30)));
    let selectedCourseIds = selectEvidenceDrivenCourseIds(matchedCourse.id, Number(durationDays) || 30, resolvedGoal, evidence);

    // Build base modules first (always executable quests from COURSES_REGISTRY)
    let baseModules = generateDynamicStudentRoadmap({
      qt1,
      qt2,
      archetype,
      goal: resolvedGoal,
      courseId: matchedCourse.id,
      durationDays,
      dailyPace,
      selectedCourseIds,
      evidence,
      weakAreas: evidence ? [...evidence.weakAreas, ...evidence.interviewGaps] : undefined,
    });

    let source: 'llm' | 'curated_template' = 'curated_template';
    let personalizedModules = baseModules;

    // Ask AI Architect to both validate/pick best course sequence AND personalize stage titles/rationales
    const catalogDigest = COURSES_REGISTRY.map(
      (c) => {
        const cSkills = Array.isArray((c as any).skills) ? (c as any).skills.slice(0, 5) : [];
        return `${c.id}: ${c.title} [${cSkills.join(', ')}]`;
      }
    ).join('\n');

    const userContextBlock = evidence?.rawSummary
      ? `STUDENT EVIDENCE FROM VAULT, RESUME & PROFILE:\n${evidence.rawSummary}`
      : `Student Target Goal: ${resolvedGoal}\nTrack: ${matchedCourse.title}\nArchetype: ${archetype}`;

    const aiRaw = await callRoadmapAi(
      'You are a Principal Curriculum Architect. Output ONLY valid JSON matching the requested schema.',
      `Design a personalized ${durationDays}-day roadmap for this student.
${userContextBlock}
Target Career Goal: "${resolvedGoal}"
Daily Pace: ${dailyPace} quests/day | QT1: ${qt1}/100 | QT2: ${qt2}/100

AVAILABLE AUTHORITATIVE COURSES (you MUST only pick IDs from this exact list, up to ${maxCourses} course IDs):
${catalogDigest}

CURRENT BASE STAGES:
${baseModules.map((m, i) => `${i + 1}. [${m.courseId}] ${m.title}`).join('\n')}

Return ONLY valid JSON object:
{
  "selectedCourseIds": ["exact-course-id-1"],
  "stages": [
    {
      "index": 1,
      "tailoredTitle": "Concise personalized stage title referencing actual skill focus",
      "tailoredDesc": "1-2 crisp sentences connecting this stage to their resume/projects/gaps",
      "whyThisStage": "Brief reason referencing their resume, vault proof, or detected skill gap"
    }
  ]
}`
    );

    if (aiRaw) {
      try {
        const parsed = JSON.parse(stripThinkingAndFences(aiRaw));
        const validAiCourses: string[] = Array.isArray(parsed?.selectedCourseIds)
          ? parsed.selectedCourseIds
              .map((id: unknown) => String(id).trim())
              .filter((id: string) => COURSES_REGISTRY.some((c) => c.id === id))
              .slice(0, maxCourses)
          : [];

        // If AI chose a different valid set of courses from COURSES_REGISTRY, rebuild modules cleanly so quests match!
        if (validAiCourses.length > 0 && validAiCourses.join(',') !== selectedCourseIds.join(',')) {
          selectedCourseIds = validAiCourses;
          baseModules = generateDynamicStudentRoadmap({
            qt1,
            qt2,
            archetype,
            goal: resolvedGoal,
            courseId: validAiCourses[0],
            durationDays,
            dailyPace,
            selectedCourseIds: validAiCourses,
            evidence,
            weakAreas: evidence ? [...evidence.weakAreas, ...evidence.interviewGaps] : undefined,
          });
        }

        const aiStages = Array.isArray(parsed?.stages) ? parsed.stages : (Array.isArray(parsed) ? parsed : []);
        if (aiStages.length > 0) {
          personalizedModules = baseModules.map((m, idx) => {
            const match = aiStages.find((p: any) => p.index === idx + 1) || aiStages[idx];
            if (match?.tailoredTitle) {
              return {
                ...m,
                title: String(match.tailoredTitle),
                desc: match.tailoredDesc ? String(match.tailoredDesc) : m.desc,
                whyThisStage: match.whyThisStage ? String(match.whyThisStage) : m.whyThisStage,
                knowledgeAdaptationTag: evidence?.resumeTitle
                  ? `Tailored to Resume ("${evidence.resumeTitle}") & ${resolvedGoal}`
                  : `AI Customized for: ${resolvedGoal}`,
              };
            }
            return m;
          });
          source = 'llm';
        }
      } catch {
        // Keep deterministic evidence-adapted baseModules
      }
    }

    const evidenceSummary = {
      resumeTitle: evidence?.resumeTitle || null,
      vaultDocsCount: evidence?.vaultDocsCount || 0,
      provenSkills: (evidence?.provenSkills || []).slice(0, 8),
      targetGaps: Array.from(new Set([...(evidence?.weakAreas || []), ...(evidence?.interviewGaps || [])])).slice(0, 8),
      selectedCourseIds,
    };

    // Persist personalized roadmap metadata cross-device into users.onboarding_answers when DB is available
    if (admin) {
      try {
        const { data: uRow } = await admin.from('users').select('onboarding_answers').eq('id', userId).maybeSingle();
        const ob = (uRow?.onboarding_answers && typeof uRow.onboarding_answers === 'object')
          ? (uRow.onboarding_answers as Record<string, any>)
          : {};
        if (replacePrimary) {
          await admin
            .from('users')
            .update({
              roadmap_generated: true,
              onboarding_answers: {
                ...ob,
                roadmap_modules: personalizedModules,
                roadmap_evidence_summary: evidenceSummary,
              },
            })
            .eq('id', userId);
        } else if (typeof extraId === 'string' && extraId.trim()) {
          const existingExtras = Array.isArray(ob.extra_roadmaps) ? ob.extra_roadmaps : [];
          const idx = existingExtras.findIndex((x: any) => x?.id === extraId);
          const updatedEntry = {
            id: extraId,
            goal: resolvedGoal,
            courseId: selectedCourseIds[0] || matchedCourse.id,
            durationDays,
            dailyPace,
            evidenceSummary,
          };
          const nextExtras = idx >= 0
            ? existingExtras.map((x: any, i: number) => (i === idx ? { ...x, ...updatedEntry } : x))
            : [...existingExtras, updatedEntry];
          await admin
            .from('users')
            .update({
              roadmap_generated: true,
              onboarding_answers: {
                ...ob,
                extra_roadmaps: nextExtras,
              },
            })
            .eq('id', userId);
        }
      } catch {}
    }

    return NextResponse.json({
      success: true,
      source,
      goal: resolvedGoal,
      durationDays,
      dailyPace,
      courseId: selectedCourseIds[0] || matchedCourse.id,
      selectedCourseIds,
      evidenceSummary,
      modules: personalizedModules,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'ROADMAP_GEN_ERROR', message: err?.message || 'Failed to synthesize roadmap' },
      { status: 500 }
    );
  }
}
