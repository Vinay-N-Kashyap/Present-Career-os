import { NextResponse } from 'next/server';

const JOBS_STORE: any[] = [
  {
    id: 'job_sde1',
    title: 'Software Development Engineer I',
    department: 'Core Platform',
    location: 'Bengaluru / Hybrid',
    type: 'Full-Time',
    ctc: '14–18 LPA',
    minAts: 75,
    skills: ['TypeScript', 'React', 'Node.js', 'SQL'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'job_fin_analyst',
    title: 'Corporate Finance & Forensic Analyst',
    department: 'Institutional Treasury',
    location: 'Mumbai',
    type: 'Full-Time',
    ctc: '10–14 LPA',
    minAts: 70,
    skills: ['Financial Modeling', 'Ind AS', 'Audit', 'Risk'],
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ ok: true, jobs: JOBS_STORE });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const newJob = {
    id: body.id || `job_${Date.now()}`,
    title: body.title || 'New Role',
    department: body.department || 'Engineering',
    location: body.location || 'Remote / Hybrid',
    type: body.type || 'Full-Time',
    ctc: body.ctc || '12 LPA',
    minAts: Number(body.minAts) || 70,
    skills: Array.isArray(body.skills) ? body.skills : [],
    createdAt: new Date().toISOString(),
  };
  JOBS_STORE.unshift(newJob);
  return NextResponse.json({ ok: true, job: newJob });
}
