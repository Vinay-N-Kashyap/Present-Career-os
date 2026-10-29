import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    id,
    improvedScore: 94,
    improvedBullets: [
      'Architected high-reliability microservices handling 10k+ concurrent requests with <45ms p95 latency.',
      'Automated CI/CD verification pipelines reducing production regression defects by 64%.',
      'Designed normalized PostgreSQL schemas and Redis caching layers improving query throughput by 3.2x.',
    ],
    appliedTargetRole: body.targetRole || 'Software Engineer',
  });
}
