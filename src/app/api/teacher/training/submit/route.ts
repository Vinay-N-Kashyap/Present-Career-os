import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      ok: true,
      teacherId: body.teacherId || 'faculty',
      moduleId: body.moduleId || 'mod-proctor',
      score: Number(body.score) || 100,
      certifiedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to record training completion' }, { status: 500 });
  }
}
