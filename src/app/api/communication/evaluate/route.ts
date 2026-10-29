import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Invalid JSON body' }, { status: 400 });
  }

  const submission = String(body.submission || body.text || '').trim();
  const scenario = String(body.scenario || 'Workplace Alignment').trim();
  const track = String(body.track || 'Corporate Professional').trim();

  if (!submission) {
    return NextResponse.json({ error: 'EMPTY_SUBMISSION', message: 'Submission text is required.' }, { status: 400 });
  }

  const words = submission.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const hasActionPlan = /\b(will|plan|propose|schedule|resolve|prioritize|deliver|mitigate|align|update|next step|by|timeline|owner)\b/i.test(submission);
  const hasOwnership = /\b(i|we|our|my|team|ownership|accountable|ensure|commit)\b/i.test(submission);
  const hasFiller = /\b(um|uh|maybe|sort of|kind of|idk|whatever|guess)\b/i.test(submission);

  const lengthScore = Math.min(95, Math.max(55, 60 + Math.min(35, Math.floor(wordCount * 1.1))));
  const clarity = Math.min(98, lengthScore + (hasActionPlan ? 6 : -4) - (hasFiller ? 8 : 0));
  const tone = Math.min(98, 76 + (hasOwnership ? 10 : 0) - (hasFiller ? 10 : 0));
  const structure = Math.min(98, 72 + (wordCount >= 18 ? 12 : 0) + (hasActionPlan ? 8 : 0));
  const impact = Math.min(98, Math.round((clarity + tone + structure) / 3) + (hasActionPlan && hasOwnership ? 4 : 0));
  const average = Math.round((clarity + tone + structure + impact) / 4);

  const cleanCore = submission.replace(/\s+/g, ' ').replace(/[.!?]+$/, '');

  const rewrites = {
    executive: `Regarding ${scenario}: ${cleanCore}. We have locked the root-cause remediation plan, assigned clear engineering ownership, and will circulate the verified milestone update by EOD.`,
    professional: `To address ${scenario} effectively: ${cleanCore}. I am coordinating with the relevant stakeholders now and will share a confirmed status update once our verification checks complete.`,
    native: `Here is how we are handling ${scenario}: ${cleanCore}. I will keep everyone posted as soon as the next checkpoint is done.`,
  };

  const feedback = {
    positive: hasActionPlan && hasOwnership
      ? `Strong accountability and concrete next steps tailored to ${track} expectations.`
      : `Clear intent communicated for ${scenario}; adding explicit timelines and measurable outcomes will further strengthen executive presence.`,
    recommendation: hasFiller
      ? 'Replace hedging or filler phrases with definitive commitments, an explicit owner, and a target completion time.'
      : 'Anchor every stakeholder update with three elements: current impact, immediate mitigation action, and exact next-checkpoint time.',
  };

  return NextResponse.json({
    ok: true,
    scores: {
      clarity,
      tone,
      structure,
      impact,
      average,
    },
    rewrites,
    feedback,
  });
}
