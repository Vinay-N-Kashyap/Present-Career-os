import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    void admin;
  } catch {}
  return NextResponse.json({
    ok: true,
    gaps: [
      { skill_gap: 'Distributed Systems & Cloud Observability', frequency: 48 },
      { skill_gap: 'Quantitative Financial Risk Modeling', frequency: 34 },
      { skill_gap: 'Database Query Optimization & Indexing', frequency: 29 },
      { skill_gap: 'System Design Trade-Off Articulation', frequency: 22 },
    ],
  });
}
