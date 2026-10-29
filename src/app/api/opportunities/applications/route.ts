import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    applications: [],
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    application: {
      id: `opp_app_${Date.now()}`,
      ...body,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
    },
  });
}
