import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    entries: 0,
    hitRate: 1.0,
    updatedAt: new Date().toISOString(),
  });
}
