import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { TEACHERS } from '@/lib/teachers';
import { generateLocalSocraticHint } from '@/lib/tutor/socraticHint';

export { generateLocalSocraticHint };

interface DebugTutorRequest {
  code?: string;
  language?: string;
  output?: { success?: boolean; message?: string } | null;
  terminalLogs?: string[];
  questTitle?: string;
  teacherId?: string;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`debug_tutor_${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many tutor requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const authCheck = await requireUserFromRequest(req);
    if (authCheck.error) return authCheck.error;

    const body: DebugTutorRequest = await req.json().catch(() => ({}));
    const {
      code = '',
      language = 'python',
      output = null,
      terminalLogs = [],
      questTitle = 'Coding Challenge',
      teacherId = 'kashyap',
    } = body;

    const teacher: any = TEACHERS.find((t: any) => t.id === teacherId) || TEACHERS[0];
    const errorMsg = output?.message || (terminalLogs.length > 0 ? terminalLogs[terminalLogs.length - 1] : '');

    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    if (process.env.GROQ_API_KEY && !groqKeys.includes(process.env.GROQ_API_KEY)) {
      groqKeys.push(process.env.GROQ_API_KEY);
    }

    if (groqKeys.length > 0 && code.trim()) {
      for (const key of groqKeys) {
        try {
          const prompt = `You are ${teacher.name} (${teacher.type || teacher.desc || 'Lead Instructor'}), an expert computer science teacher at PinIT Career OS.
The student is solving the coding quest: "${questTitle}" in ${language}.
STUDENT'S SUBMITTED CODE:
\`\`\`${language}
${code.slice(0, 2000)}
\`\`\`

EXECUTION / COMPILER OUTPUT:
${errorMsg || 'Tests failed or assertions did not match expected output.'}

RECENT TERMINAL LOGS:
${terminalLogs.slice(-5).join('\n')}

INSTRUCTIONS:
1. Provide a Socratic, targeted debug hint in 2-3 sentences.
2. DO NOT write the complete solution code.
3. Identify the conceptual, syntax, or boundary flaw (e.g. off-by-one, type coercion, missing return, mutable default) and guide the student to solve it themselves.
4. Maintain ${teacher.name}'s warm, encouraging tone.`;

          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant',
              messages: [
                { role: 'system', content: `You are ${teacher.name}, a master CS tutor. Give concise Socratic hints.` },
                { role: 'user', content: prompt }
              ],
              temperature: 0.5,
              max_tokens: 250,
            }),
            signal: AbortSignal.timeout(4000),
          });

          if (res.ok) {
            const data = await res.json();
            const reply = (data.choices?.[0]?.message?.content || '').trim();
            if (reply) {
              return NextResponse.json({
                success: true,
                source: 'llm',
                hint: `🤖 ${teacher.name} (${teacher.emoji}) Socratic Debug Hint:\n\n${reply}`,
              });
            }
          }
        } catch {
          // Fall through to intelligent local analyzer
        }
      }
    }

    // Intelligent local fallback analyzer
    const localHint = generateLocalSocraticHint(
      code,
      language,
      errorMsg,
      teacher.name,
      teacher.emoji,
      questTitle
    );

    return NextResponse.json({
      success: true,
      source: 'heuristic_analyzer',
      hint: localHint,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'DEBUG_TUTOR_ERROR', message: err?.message || 'Failed to generate tutor hint' },
      { status: 500 }
    );
  }
}
