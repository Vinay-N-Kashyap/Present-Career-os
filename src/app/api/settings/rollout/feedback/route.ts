import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      ok: true,
      feedbackId: `fb_${Date.now()}`,
      phase: body.phase || 'Phase 1',
      submittedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to record rollout feedback' }, { status: 500 });
  }
}
