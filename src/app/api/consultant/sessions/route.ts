import { NextResponse } from 'next/server';

const SESSIONS_STORE: any[] = [
  {
    id: 'sess_1',
    studentName: 'Aarav Kulkarni',
    topic: 'SOP & University Shortlist Finalization',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    status: 'Scheduled',
  },
];

export async function GET() {
  return NextResponse.json({ ok: true, sessions: SESSIONS_STORE });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const session = {
    id: `sess_${Date.now()}`,
    ...body,
    status: body.status || 'Scheduled',
    createdAt: new Date().toISOString(),
  };
  SESSIONS_STORE.unshift(session);
  return NextResponse.json({ ok: true, session });
}
