import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const jd = String(body.jd || '');
  const words = jd.trim().split(/\s+/).filter(Boolean);
  const matchScore = Math.min(96, Math.max(72, 75 + Math.min(20, Math.floor(words.length / 10))));
  return NextResponse.json({
    ok: true,
    matchScore,
    matchedSkills: ['TypeScript', 'Python', 'SQL', 'System Design'],
    missingSkills: ['Kubernetes', 'GraphQL'],
    recommendations: [
      'Highlight your verified PinIT Capstone project metrics in the top summary.',
      'Complete the Month 2 production verification challenge for missing skills.',
    ],
  });
}
