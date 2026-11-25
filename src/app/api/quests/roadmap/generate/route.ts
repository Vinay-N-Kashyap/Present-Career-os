import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { generateDynamicStudentRoadmap } from '@/lib/data/roadmapFuser';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { collectUserRoadmapEvidence, type UserRoadmapEvidence } from '@/lib/roadmap/userEvidenceContext';
import { resolveGoalPrimaryCourse, selectRelevantCourseIds } from '@/lib/roadmap/roadmapCourseSelector';

export const maxDuration = 30;

function stripThinkingAndFences(raw: string): string {
  return String(raw || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^[\s\S]*?```(?:json)?/i, '')
    .replace(/```[\s\S]*$/, '')
    .trim();
}

async function callRoadmapAi(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const groqKeys = [
    ...(process.env.GROQ_API_KEYS || '').split(',').map((k) => k.trim()).filter(Boolean),
    ...(process.env.GROQ_API_KEY ? [process.env.GROQ_API_KEY.trim()] : []),
  ];

  // Try at most 2 fast Groq attempts (strict 4.5s timeout each) so Serverless never times out
  const attempts: Array<{ key: string; model: string }> = [];
  if (groqKeys[0]) attempts.push({ key: groqKeys[0], model: 'qwen/qwen3.8-27b' });
  if (groqKeys[1]) attempts.push({ key: groqKeys[1], model: 'openai/gpt-oss-20b' });
  else if (groqKeys[0]) attempts.push({ key: groqKeys[0], model: 'openai/gpt-oss-20b' });

  for (const { key, model } of attempts) {
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
        signal: AbortSignal.timeout(4500),
      });
      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content === 'string' && content.trim()) return content;
      }
    } catch {}
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
          signal: AbortSignal.timeout(4500),
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

    const includeResume = useResumeAndVault !== false;
    let evidence: UserRoadmapEvidence | null = null;
    if (includeResume) {
      // Read pre-indexed Vault metadata first (~50ms); only download+OCR Storage PDF if no skills exist yet, with strict 2.5s budget
      evidence = await collectUserRoadmapEvidence(admin, userId, { parseStorageResume: false });
      if (
        evidence?.hasResumeInVault &&
        evidence.claimedSkills.length === 0 &&
        evidence.provenSkills.length === 0
      ) {
        const ocrResult = await Promise.race([
          collectUserRoadmapEvidence(admin, userId, { parseStorageResume: true }).catch(() => null),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
        ]);
        if (ocrResult) evidence = ocrResult;
      }
    }

    const resolvedGoal =
      String(goal || '').trim() ||
      (includeResume ? (evidence?.careerGoal || evidence?.targetRole) : '') ||
      'Full-Stack Software Engineer';

    const matchedCourse = resolveGoalPrimaryCourse(courseId, resolvedGoal);

    const parsedDurationDays = Math.max(30, Number(durationDays) || 30);
    const maxCourses = Math.max(1, Math.min(12, Math.round(parsedDurationDays / 30)));
    let selectedCourseIds = selectRelevantCourseIds({
      primaryCourseId: matchedCourse.id,
      durationDays: parsedDurationDays,
      goal: resolvedGoal,
      evidence,
      useResumeAndVault: includeResume,
    });

    // Build base modules first (always executable quests from COURSES_REGISTRY)
    let baseModules = generateDynamicStudentRoadmap({
      qt1,
      qt2,
      archetype,
      goal: resolvedGoal,
      courseId: selectedCourseIds[0] || matchedCourse.id,
      durationDays: parsedDurationDays,
      dailyPace,
      selectedCourseIds,
      evidence: includeResume ? evidence : null,
      weakAreas: includeResume && evidence ? [...evidence.weakAreas, ...evidence.interviewGaps] : undefined,
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

    const userContextBlock = includeResume && evidence?.rawSummary
      ? `STUDENT EVIDENCE FROM VAULT, RESUME & PROFILE:\n${evidence.rawSummary}\nCRITICAL RULE: NEVER put beginner syntax courses in Stage 1 for skills already present on the resume. Prioritize their Target Gaps FIRST.`
      : `Student Target Goal (Goal-Only Mode — ignore any resume/vault docs): ${resolvedGoal}\nTrack: ${matchedCourse.title}`;

    const aiRaw = await callRoadmapAi(
      'You are a Principal Curriculum Architect. Output ONLY valid JSON matching the requested schema.',
      `Design a personalized ${parsedDurationDays}-day roadmap for this student.
${userContextBlock}
Target Career Goal: "${resolvedGoal}"
Daily Pace: ${dailyPace} quests/day | QT1: ${qt1}/100 | QT2: ${qt2}/100

AVAILABLE AUTHORITATIVE COURSES (you MUST only pick IDs from this exact list, up to ${maxCourses} course IDs):
${catalogDigest}

CURRENT BASE STAGES (already prioritized for Target Gaps & Goal):
${baseModules.map((m, i) => `${i + 1}. [${m.courseId}] ${m.title}`).join('\n')}

Return ONLY valid JSON object:
{
  "selectedCourseIds": ["exact-course-id-1"],
  "stages": [
    {
      "index": 1,
      "tailoredTitle": "Concise personalized stage title referencing actual skill focus",
      "tailoredDesc": "1-2 crisp sentences connecting this stage to their goal or detected gaps",
      "whyThisStage": "Brief reason referencing their goal, or (if enabled) their resume/detected gap"
    }
  ]
}`
    );

    const hasTargetGaps = Boolean(includeResume && evidence && (evidence.weakAreas.length > 0 || evidence.interviewGaps.length > 0));
    const deterministicFirstCourse = selectedCourseIds[0];

    if (aiRaw) {
      try {
        const parsed = JSON.parse(stripThinkingAndFences(aiRaw));
        const validAiCourses: string[] = Array.isArray(parsed?.selectedCourseIds)
          ? parsed.selectedCourseIds
              .map((id: unknown) => String(id).trim())
              .filter((id: string) => COURSES_REGISTRY.some((c) => c.id === id))
              .slice(0, maxCourses)
          : [];

        // Keep gap-first Stage 1 course pinned when Target Gaps exist so Stage 1 never regresses to redundant intro syntax
        const aiFirstIsRedundant = Boolean(
          hasTargetGaps &&
          validAiCourses.length > 0 &&
          deterministicFirstCourse &&
          validAiCourses[0] !== deterministicFirstCourse &&
          ['course-fullstack-js', 'course-react-web', 'course-java-logic', 'course-python-backend'].includes(validAiCourses[0])
        );

        // If AI chose a different valid set of courses from COURSES_REGISTRY, rebuild modules cleanly so quests match!
        if (!aiFirstIsRedundant && validAiCourses.length > 0 && validAiCourses.join(',') !== selectedCourseIds.join(',')) {
          selectedCourseIds = validAiCourses;
          baseModules = generateDynamicStudentRoadmap({
            qt1,
            qt2,
            archetype,
            goal: resolvedGoal,
            courseId: validAiCourses[0],
            durationDays: parsedDurationDays,
            dailyPace,
            selectedCourseIds: validAiCourses,
            evidence: includeResume ? evidence : null,
            weakAreas: includeResume && evidence ? [...evidence.weakAreas, ...evidence.interviewGaps] : undefined,
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
                knowledgeAdaptationTag: includeResume && evidence?.resumeTitle
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

    const evidenceSummary = includeResume
      ? {
          usedResume: true,
          resumeTitle: evidence?.resumeTitle || null,
          vaultDocsCount: evidence?.vaultDocsCount || 0,
          provenSkills: (evidence?.provenSkills || []).slice(0, 8),
          targetGaps: Array.from(new Set([...(evidence?.weakAreas || []), ...(evidence?.interviewGaps || [])])).slice(0, 8),
          selectedCourseIds,
        }
      : {
          usedResume: false,
          resumeTitle: null,
          vaultDocsCount: 0,
          provenSkills: [],
          targetGaps: [],
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
                ...(includeResume ? { roadmap_evidence_summary: evidenceSummary } : {}),
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
            durationDays: parsedDurationDays,
            dailyPace,
            usedResume: includeResume,
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
