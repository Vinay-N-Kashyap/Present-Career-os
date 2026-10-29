import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    opportunities: [
      {
        id: 'opp_sde_1',
        title: 'Software Engineer — Core Systems',
        company: 'Stripe Partner Lab',
        location: 'Bengaluru / Hybrid',
        type: 'Full-Time',
        salary: '18–24 LPA',
        matchScore: 92,
        skills: ['TypeScript', 'Python', 'PostgreSQL', 'Distributed Systems'],
      },
      {
        id: 'opp_fin_2',
        title: 'Corporate Treasury & Risk Analyst',
        company: 'HDFC Institutional Desk',
        location: 'Mumbai',
        type: 'Full-Time',
        salary: '12–16 LPA',
        matchScore: 88,
        skills: ['Corporate Finance', 'Ind AS', 'Risk Modeling', 'Audit'],
      },
    ],
  });
}
