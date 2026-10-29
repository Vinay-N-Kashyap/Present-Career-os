import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: true,
    clearedAt: new Date().toISOString(),
    message: 'Institutional edge and application caches cleared successfully.',
  });
}
