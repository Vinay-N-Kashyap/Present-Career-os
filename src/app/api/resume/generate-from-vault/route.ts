import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    resume: {
      id: `vault_res_${Date.now()}`,
      targetRole: body.targetRole || 'Full-Stack Software Engineer',
      atsScore: 91,
      summary: 'Results-driven engineer with verified PinIT Career OS Skill Passport credentials, full-stack production projects, and strong algorithmic foundations.',
      sections: {
        skills: ['TypeScript', 'Python', 'React', 'Next.js', 'PostgreSQL', 'System Design'],
        projects: body.projects || [
          {
            title: 'PinIT Enterprise Architecture Capstone',
            highlights: [
              'Engineered end-to-end full-stack workflows with strict RBAC and real-time telemetry.',
              'Verified via automated integration test suites and cryptographic proof-of-work.',
            ],
          },
        ],
      },
      generatedAt: new Date().toISOString(),
    },
  });
}
