import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { resolveAvatarFeatureState } from '@/lib/avatar/avatarFeatureFlags';
import { loadAvatarMemoryTriState, TriStateMemoryResult } from '@/lib/avatar/memoryStore';
import { buildMentorSystemPrompt } from '@/lib/avatar/mentorPromptBuilder';
import { buildHyperActiveFallbackReply } from '@/lib/avatar/hyperActivePersona';
import { isNextTaskIntent, getAuthoritativeNextTask, StudentProgressSnapshot, CurriculumItem } from '@/lib/avatar/deterministicAdvisor';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { mentorResponseCache } from '@/lib/avatar/responseCache';
import { resolveLessonRequest, type LessonSessionRef } from '@/lib/avatar/lessonResolver';

// Light phatic queries that can use a micro model or deterministic warm response
export const LIGHT_QUERY_REGEX = /^(?:h(?:i|ello|ey)|thanks?|thank\s*you|ok(?:ay)?|yes|no|bye|good\s*(?:morning|evening|night)|sure|got\s*it|cool|nice|wow|great)\s*[.!?]*$/i;

interface MentorChatRequest {
  message?: string;
  query?: string;
  studentName?: string;
  targetRole?: string;
  teacherId?: string;
  currentSlide?: { title?: string; points?: string[]; codeSnippet?: string };
  activeQuest?: string | { title?: string; id?: string; progress?: number };
  missingSkills?: string[];
  weakAreas?: string[];
  careerContext?: Record<string, any>;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  stream?: boolean;
  hyperActive?: boolean;
  lessonSession?: LessonSessionRef | null;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // Shared IP burst ceiling raised from 30 to 120/min to accommodate classrooms sharing a single router
    const ipRl = checkRateLimit(`llm_ip_${ip}`, { limit: 120, windowMs: 60_000 });
    if (!ipRl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Network traffic limit reached. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(ipRl.resetSec) } }
      );
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    // Per-user rate limit (25 req/min) prevents a single student from abusing shared IP quota
    if (gated.user?.id) {
      const userRl = checkRateLimit(`llm_user_${gated.user.id}`, { limit: 25, windowMs: 60_000 });
      if (!userRl.allowed) {
        return NextResponse.json(
          { error: 'RATE_LIMIT', message: 'Too many requests. Please pause for a moment before your next question.' },
          { status: 429, headers: { 'Retry-After': String(userRl.resetSec) } }
        );
      }
    }

    const body: MentorChatRequest = await req.json();
    const userMessage = (body.message || body.query || '').trim();

    if (!userMessage) {
      return NextResponse.json(
        { ok: false, error: 'BAD_REQUEST', message: 'Message or query is required.' },
        { status: 400 }
      );
    }

    const studentName = body.studentName || body.careerContext?.displayName || 'Candidate';
    const targetRole = body.targetRole || body.careerContext?.targetRole || 'Software Engineer';
    const questTitle = typeof body.activeQuest === 'object' && body.activeQuest !== null
      ? body.activeQuest.title || 'Core Foundation'
      : (body.activeQuest || body.careerContext?.activeQuest || 'General Pathway');
    
    const missingSkills = Array.isArray(body.missingSkills) && body.missingSkills.length > 0
      ? body.missingSkills
      : (Array.isArray(body.careerContext?.jdMissingSkills) ? body.careerContext.jdMissingSkills : []);
    
    const atsScore = body.careerContext?.ats_score ?? body.careerContext?.atsScore ?? 65;
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

    const slideContextPrompt = body.currentSlide
      ? `\nCURRENT LESSON SLIDE BEING VIEWED BY STUDENT:
- Slide Title: "${body.currentSlide.title || 'Introduction'}"
- Slide Key Points: ${Array.isArray(body.currentSlide.points) ? body.currentSlide.points.join('; ') : 'General overview'}
${body.currentSlide.codeSnippet ? `- Slide Code Snippet:\n\`\`\`\n${body.currentSlide.codeSnippet}\n\`\`\`` : ''}
IMPORTANT: The student's question is about this specific slide! Explain the concepts directly referencing this slide's title and key takeaways.`
      : '';

    const flagState = resolveAvatarFeatureState();
    let memoryState: TriStateMemoryResult | undefined;
    if (flagState.mode === 'v2_advisor' && gated.user?.id) {
      memoryState = await loadAvatarMemoryTriState(gated.user.id);
    }

    const isHyperActive = Boolean(body.hyperActive);
    const completedQuestsCount = Number(body.careerContext?.completedQuestsCount ?? 0);
    const completedMissionsCount = Number(body.careerContext?.completedMissionsCount ?? 0);
    const missionStreak = Number(body.careerContext?.missionStreak ?? body.careerContext?.mission_streak ?? 0);

    let completedQuestsList: string[] | undefined = Array.isArray(body.careerContext?.completedQuests)
      ? body.careerContext.completedQuests
      : undefined;
    let enrolledTrack: string | undefined = typeof body.careerContext?.track === 'string'
      ? body.careerContext.track
      : undefined;
    let resolvedActiveCourseId: string | undefined = typeof body.careerContext?.activeCourseId === 'string'
      ? body.careerContext.activeCourseId
      : (typeof body.careerContext?.courseId === 'string' ? body.careerContext.courseId : undefined);

    if ((!resolvedActiveCourseId || !completedQuestsList || completedQuestsList.length === 0) && gated.user?.id) {
      try {
        const token = getBearerToken(req);
        const supabase = getAuthoritativeSupabaseClient(token);
        const [{ data: uRow }, { data: crashRow }] = await Promise.all([
          supabase.from('users').select('completed_quests, onboarding_answers').eq('id', gated.user.id).maybeSingle(),
          supabase.from('user_crash_enrollments').select('track').eq('user_id', gated.user.id).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        ]);
        if ((!completedQuestsList || completedQuestsList.length === 0) && Array.isArray(uRow?.completed_quests)) {
          completedQuestsList = uRow.completed_quests;
        }
        const ob = (uRow?.onboarding_answers || {}) as Record<string, any>;
        if (!resolvedActiveCourseId) {
          resolvedActiveCourseId = ob.active_course || ob.selected_course || ob.courseId || undefined;
        }
        if (!enrolledTrack) {
          enrolledTrack = (typeof crashRow?.track === 'string' && crashRow.track) || ob.track || undefined;
        }
      } catch {
        // Non-fatal in offline/mock environments
      }
    }

    // Resolve any specific course/day/topic lesson tutoring or launch request BEFORE building prompt
    const resolvedLesson = await resolveLessonRequest(userMessage, {
      activeCourseId: resolvedActiveCourseId,
      teacherId: body.teacherId,
      lessonSession: body.lessonSession || null,
      completedQuests: completedQuestsList,
      enrolledTrack,
    });

    const systemPrompt = buildMentorSystemPrompt(
      {
        studentName,
        targetRole,
        questTitle,
        missingSkills,
        atsScore,
        teacherId: body.teacherId,
        slideContextPrompt,
        lessonContextPrompt: resolvedLesson?.promptDigest,
        hyperActive: isHyperActive,
        completedQuestsCount,
        completedMissionsCount,
        missionStreak,
      },
      memoryState,
      flagState.mode
    );

    // In V2 Advisor mode: Intercept anchored next-task intent with deterministic curriculum resolver (0ms LLM hallucination)
    // In Hyper-Active mode, bypass to let Priya's warm conversational persona handle direction queries naturally
    if (!isHyperActive && flagState.mode === 'v2_advisor' && isNextTaskIntent(userMessage) && gated.user?.id) {
      const token = getBearerToken(req);
      const supabase = getAuthoritativeSupabaseClient(token);
      const { data: userProfile } = await supabase
        .from('users')
        .select('id, completed_quests, onboarding_answers, updated_at')
        .eq('id', gated.user.id)
        .maybeSingle();

      const ob = (userProfile?.onboarding_answers || {}) as Record<string, any>;
      const activeCourseId = 
        body.careerContext?.activeCourseId ||
        body.careerContext?.courseId ||
        (typeof body.activeQuest === 'object' && body.activeQuest !== null ? (body.activeQuest as any).courseId : undefined) ||
        ob.active_course ||
        ob.selected_course ||
        ob.courseId ||
        ob.track ||
        'fullstack-mastery';

      const course = COURSES_REGISTRY.find(c => c.id === activeCourseId) || COURSES_REGISTRY[0];
      const resolvedCourseId = course?.id || activeCourseId;
      const curriculum: CurriculumItem[] = (course?.quests || []).map(q => ({
        questId: q.id,
        courseId: resolvedCourseId,
        title: q.title,
      }));

      const snapshot: StudentProgressSnapshot = {
        userId: gated.user.id,
        courseId: resolvedCourseId,
        completedQuestIds: Array.isArray(userProfile?.completed_quests) ? userProfile.completed_quests : [],
        syncedAt: Date.now(),
      };

      const advisorResult = getAuthoritativeNextTask(snapshot, gated.user.id, curriculum);
      const cleanReply = sanitizeLLMOutput(advisorResult.speechText);

      const wantsStreamEarly = Boolean(body.stream) || Boolean(req.headers.get('accept')?.includes('text/event-stream'));
      if (wantsStreamEarly) {
        const encoder = new TextEncoder();
        const streamResponse = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: cleanReply })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        });
        return new Response(streamResponse, {
          headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
          }
        });
      }

      return NextResponse.json({
        ok: true,
        reply: cleanReply,
        simulated: false,
        deterministic: true,
        advisorResult,
        context: {
          studentName,
          targetRole,
          activeQuest: questTitle,
          missingSkills,
          atsScore,
        }
      });
    }

    const wantsStream = Boolean(body.stream) || Boolean(req.headers.get('accept')?.includes('text/event-stream'));

    // Determine live active Groq model tier & token budget (elevated when tutoring an active curriculum lesson)
    const isLightQuery = !resolvedLesson && LIGHT_QUERY_REGEX.test(userMessage);
    const groqModelCandidates = resolvedLesson
      ? ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b']
      : (isHyperActive || isLightQuery ? ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'] : ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b']);
    const selectedModel = groqModelCandidates[0];
    const selectedMaxTokens = resolvedLesson ? 550 : (isHyperActive ? 240 : (isLightQuery ? 120 : 350));

    // In V2 Advisor mode: Check In-Memory LRU Response Cache (0ms, 0 tokens) — bypass in Hyper-Active or active lesson tutoring
    const cacheKey = mentorResponseCache.generateKey(userMessage, body.teacherId || 'priya', targetRole, questTitle);
    const shouldBypassCache = isHyperActive || Boolean(resolvedLesson) || mentorResponseCache.shouldBypass({
      hasSlideContext: Boolean(body.currentSlide),
      hasCodeSnippet: Boolean(body.currentSlide?.codeSnippet),
      historyLength: history.length,
    });

    if (flagState.mode === 'v2_advisor' && !shouldBypassCache) {
      const cachedReply = mentorResponseCache.get(cacheKey);
      if (cachedReply) {
        if (wantsStream) {
          const encoder = new TextEncoder();
          const streamResponse = new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: cachedReply })}\n\n`));
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            }
          });
          return new Response(streamResponse, {
            headers: {
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache, no-transform',
              'Connection': 'keep-alive',
            }
          });
        }
        return NextResponse.json({
          ok: true,
          reply: cachedReply,
          simulated: false,
          cached: true,
          context: {
            studentName,
            targetRole,
            activeQuest: questTitle,
            missingSkills,
            atsScore,
          }
        });
      }
    }

    // Try calling Groq / OpenRouter
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    if (process.env.GROQ_API_KEY && !groqKeys.includes(process.env.GROQ_API_KEY)) {
      groqKeys.push(process.env.GROQ_API_KEY);
    }
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    // Streaming Groq branch for sub-60ms TTFT
    if (wantsStream && resolvedLesson?.lessonAction.autoLaunch) {
      const encoder = new TextEncoder();
      const launchStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: resolvedLesson.deterministicFallbackReply })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });
      return new Response(launchStream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        }
      });
    }

    if (wantsStream) {
      if (groqKeys.length > 0) {
        for (const key of groqKeys) {
          try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
              },
              body: JSON.stringify({
                model: selectedModel,
                messages: [
                  { role: 'system', content: systemPrompt },
                  ...history,
                  { role: 'user', content: userMessage }
                ],
                max_tokens: selectedMaxTokens,
                temperature: 0.7,
                frequency_penalty: isHyperActive ? 0.6 : 0,
                presence_penalty: isHyperActive ? 0.6 : 0,
                stream: true
              }),
              signal: AbortSignal.timeout(3500)
            });

            if (res.ok && res.body) {
              const encoder = new TextEncoder();
              const decoder = new TextDecoder();
              const reader = res.body.getReader();

              const streamResponse = new ReadableStream({
                async start(controller) {
                  let buffer = '';
                  try {
                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) break;
                      buffer += decoder.decode(value, { stream: true });
                      const lines = buffer.split('\n');
                      buffer = lines.pop() || '';

                      for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed || trimmed.startsWith(':')) continue;
                        if (trimmed === 'data: [DONE]') {
                          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                          controller.close();
                          return;
                        }
                        if (trimmed.startsWith('data: ')) {
                          try {
                            const json = JSON.parse(trimmed.slice(6));
                            const token = json.choices?.[0]?.delta?.content;
                            if (token) {
                              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
                            }
                          } catch {
                            // partial JSON chunk
                          }
                        }
                      }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                  } catch (err) {
                    controller.error(err);
                  }
                }
              });

              return new Response(streamResponse, {
                headers: {
                  'Content-Type': 'text/event-stream; charset=utf-8',
                  'Cache-Control': 'no-cache, no-transform',
                  'Connection': 'keep-alive'
                }
              });
            }
          } catch {
            // cycle to next key or fallback
          }
        }
      }

      // Stream contextual fallback if external Groq is offline
      const gapsNotice = missingSkills.length > 0
        ? `Given your goal of becoming a ${targetRole}, I recommend tackling your gaps in ${missingSkills.slice(0, 2).join(' and ')}.`
        : `Let's keep reinforcing your core competencies for ${targetRole}.`;
      const fallbackReply = isHyperActive
        ? buildHyperActiveFallbackReply(
            userMessage,
            {
              studentName,
              targetRole,
              completedQuestsCount,
              completedMissionsCount,
              missionStreak,
            },
            history
          )
        : `Hello ${studentName}! As your mentor for ${targetRole}, I am tracking your progress on "${questTitle}". ${gapsNotice} What specific challenge can we solve today?`;

      const encoder = new TextEncoder();
      const fallbackStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: fallbackReply })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });
      return new Response(fallbackStream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive'
        }
      });
    }

    let llmResponse: string | null = null;

    // Immediate crisp response when student explicitly asked to open/launch a lesson
    if (resolvedLesson?.lessonAction.autoLaunch) {
      llmResponse = resolvedLesson.deterministicFallbackReply;
    }

    if (!llmResponse && groqKeys.length > 0) {
      for (const key of groqKeys) {
        for (const modelName of groqModelCandidates) {
          try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
              },
              body: JSON.stringify({
                model: modelName,
                messages: [
                  { role: 'system', content: systemPrompt },
                  ...history,
                  { role: 'user', content: userMessage }
                ],
                max_tokens: selectedMaxTokens,
                temperature: resolvedLesson ? 0.5 : 0.7,
                frequency_penalty: isHyperActive && !resolvedLesson ? 0.6 : 0,
                presence_penalty: isHyperActive && !resolvedLesson ? 0.6 : 0,
              }),
              signal: AbortSignal.timeout(6000)
            });
            if (res.ok) {
              const data = await res.json();
              const rawContent = (data.choices?.[0]?.message?.content || '')
                .replace(/<think>[\s\S]*?<\/think>/gi, '')
                .trim();
              if (rawContent) {
                llmResponse = rawContent;
                break;
              }
            }
          } catch {
            // cycle to next model/key
          }
        }
        if (llmResponse) break;
      }
    }

    if (!llmResponse && openRouterKey) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://pinit.career',
            'X-Title': 'PinIT Career OS Mentor'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              ...history,
              { role: 'user', content: userMessage }
            ],
            max_tokens: 350,
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(6000)
        });
        if (res.ok) {
          const data = await res.json();
          llmResponse = (data.choices?.[0]?.message?.content || '').trim();
        }
      } catch {
        // Fall back to contextual engine
      }
    }

    let isSimulated = false;
    // Dynamic contextual fallback if LLM offline / absent API keys
    if (!llmResponse) {
      isSimulated = true;
      if (resolvedLesson) {
        llmResponse = resolvedLesson.deterministicFallbackReply;
      } else if (isHyperActive) {
        llmResponse = buildHyperActiveFallbackReply(
          userMessage,
          {
            studentName,
            targetRole,
            completedQuestsCount,
            completedMissionsCount,
            missionStreak,
          },
          history
        );
      } else {
        const gapsNotice = missingSkills.length > 0
          ? `Given your goal of becoming a ${targetRole}, I recommend tackling your gaps in ${missingSkills.slice(0, 2).join(' and ')}.`
          : `Let's keep reinforcing your core competencies for ${targetRole}.`;
        
        const lower = userMessage.toLowerCase();
        if (body.currentSlide?.title) {
          const slideTitle = body.currentSlide.title;
          const keyPoints = Array.isArray(body.currentSlide.points) && body.currentSlide.points.length > 0
            ? body.currentSlide.points.join('; ')
            : '';
          if (lower.includes('first principle') || lower.includes('analogy') || lower.includes('tricky') || lower.includes('explain') || lower.includes('what is') || lower.includes('how')) {
            llmResponse = `${studentName}, let's unpack "${slideTitle}" from first principles:\n\n1. Concept Core: ${keyPoints || 'Every computing abstraction exists to make complex transformations predictable'}.\n2. Real-World Analogy: Think of this like a verifiable pipeline where each stage guarantees its invariants before proceeding to the next.\n3. Takeaway: Keep inputs constrained and verify outputs at each step.`;
          } else {
            llmResponse = `${studentName}, on this topic of "${slideTitle}": ${keyPoints || 'focus on the core code patterns presented'}. How can I clarify this further for you?`;
          }
        } else if (lower.includes('skill') || lower.includes('gap') || lower.includes('learn') || lower.includes('study')) {
          llmResponse = `Hey ${studentName}! ${gapsNotice} In your active quest "${questTitle}", focus on practical implementation projects and unit tests rather than passive reading.`;
        } else if (lower.includes('interview') || lower.includes('ready') || lower.includes('mock')) {
          llmResponse = `${studentName}, to ace ${targetRole} interviews, simulate real technical trade-offs. Your current ATS score is ${atsScore}/100; sharpening ${missingSkills[0] || 'system design'} will significantly elevate your profile score.`;
        } else if (lower.includes('quest') || lower.includes('mission') || lower.includes('project')) {
          llmResponse = `You are currently working on "${questTitle}". Completing the practical challenge here directly builds verifiable proof for ${targetRole} recruiters.`;
        } else {
          llmResponse = `Hello ${studentName}! As your mentor for ${targetRole}, I am tracking your progress on "${questTitle}". ${gapsNotice} What specific challenge can we solve today?`;
        }
      }
    }

    // In Hyper-Active mode: Anti-Repetition & Anti-Looping Guardian (skipped when actively tutoring a curriculum lesson)
    if (isHyperActive && !resolvedLesson && llmResponse) {
      const lastAssistantMsg = (history || [])
        .slice()
        .reverse()
        .find((m) => m.role === 'assistant')?.content || '';

      const mentionsProgress = /\b(?:knocked out|completed \d+ lessons?|\d+ daily missions?)\b/i.test(llmResponse);
      const prevMentionedProgress = /\b(?:knocked out|completed \d+ lessons?|\d+ daily missions?)\b/i.test(lastAssistantMsg);
      const isIdentical = llmResponse.trim().toLowerCase() === lastAssistantMsg.trim().toLowerCase();

      // If the LLM repeats progress stats or repeats the previous assistant message identically:
      if (isIdentical || (mentionsProgress && prevMentionedProgress)) {
        llmResponse = buildHyperActiveFallbackReply(
          userMessage,
          {
            studentName,
            targetRole,
            completedQuestsCount,
            completedMissionsCount,
            missionStreak,
          },
          history
        );
      }
    }

    const cleanReply = sanitizeLLMOutput(llmResponse);

    // In V2 Advisor mode: populate LRU response cache for un-bypassed requests
    if (flagState.mode === 'v2_advisor' && !shouldBypassCache && cleanReply && !isSimulated) {
      mentorResponseCache.set(cacheKey, cleanReply);
    }

    return NextResponse.json({
      ok: true,
      reply: cleanReply,
      simulated: isSimulated,
      ...(resolvedLesson ? {
        lessonAction: resolvedLesson.lessonAction,
        lessonSession: resolvedLesson.updatedSession,
      } : {}),
      context: {
        studentName,
        targetRole,
        activeQuest: questTitle,
        missingSkills,
        atsScore
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: 'SERVER_ERROR', message: error?.message || 'Failed to process mentor message' },
      { status: 500 }
    );
  }
}
