import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    analytics: {
      totalCandidates: 128,
      verifiedPassports: 94,
      interviewReady: 62,
      offersExtended: 14,
      avgAtsScore: 81,
    },
  });
}
