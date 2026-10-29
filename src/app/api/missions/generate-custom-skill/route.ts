import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Invalid JSON payload' }, { status: 400 });
  }

  const skill = String(body.skill || body.skillName || '').trim();
  const targetRole = String(body.targetRole || 'Software Engineer').trim();

  if (!skill || skill.length < 2) {
    return NextResponse.json({ error: 'SKILL_REQUIRED', message: 'Please provide a valid skill name.' }, { status: 400 });
  }

  const gated = await requireUserFromRequest(req);
  const cookieUid = req.cookies?.get?.('pinit_uid')?.value;
  const userId = (!gated.error && gated.user?.id) ? gated.user.id : cookieUid;

  const generatedModules = [
    {
      id: `custom_${Date.now()}_1`,
      skill,
      targetRole,
      title: `${skill} Foundations & Core Architecture`,
      difficulty: 'Beginner',
      xpReward: 50,
      createdAt: new Date().toISOString(),
    },
    {
      id: `custom_${Date.now()}_2`,
      skill,
      targetRole,
      title: `Applied ${skill} Implementation for ${targetRole}`,
      difficulty: 'Intermediate',
      xpReward: 75,
      createdAt: new Date().toISOString(),
    },
    {
      id: `custom_${Date.now()}_3`,
      skill,
      targetRole,
      title: `${skill} Production Debugging & Performance Verification`,
      difficulty: 'Advanced',
      xpReward: 100,
      createdAt: new Date().toISOString(),
    },
  ];

  const admin = getSupabaseAdmin();
  if (admin && userId) {
    try {
      const { data: existing } = await admin
        .from('users')
        .select('onboarding_answers, skill_tags')
        .eq('id', userId)
        .maybeSingle();

      const prevAnswers =
        existing?.onboarding_answers && typeof existing.onboarding_answers === 'object'
          ? existing.onboarding_answers
          : {};
      const prevCustom = Array.isArray(prevAnswers.custom_skill_modules) ? prevAnswers.custom_skill_modules : [];
      const prevTags = Array.isArray(existing?.skill_tags) ? existing.skill_tags : [];

      await admin
        .from('users')
        .update({
          onboarding_answers: {
            ...prevAnswers,
            custom_skill_modules: [...generatedModules, ...prevCustom].slice(0, 30),
          },
          skill_tags: Array.from(new Set([...prevTags, skill])),
        })
        .eq('id', userId);
    } catch (err: any) {
      console.warn('[/api/missions/generate-custom-skill] Non-fatal persistence warning:', err?.message || err);
    }
  }

  return NextResponse.json({
    ok: true,
    skill,
    targetRole,
    modules: generatedModules,
  });
}
