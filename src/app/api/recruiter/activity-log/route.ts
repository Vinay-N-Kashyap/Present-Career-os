import { NextResponse } from 'next/server';

const ACTIVITY_LOG: Array<{ id: string; text: string; time: string; icon: string }> = [
  { id: 'act_1', text: 'Reviewed verified Skill Passport for CS-2026 cohort', time: '10m ago', icon: '🔍' },
  { id: 'act_2', text: 'Shortlisted 4 candidates for SDE-1 Systems Pipeline', time: '1h ago', icon: '⭐' },
];

export async function GET() {
  return NextResponse.json({ ok: true, logs: ACTIVITY_LOG });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const entry = {
    id: `act_${Date.now()}`,
    text: String(body.text || 'Updated candidate status'),
    time: 'Just now',
    icon: String(body.icon || '📌'),
  };
  ACTIVITY_LOG.unshift(entry);
  return NextResponse.json({ ok: true, entry });
}
