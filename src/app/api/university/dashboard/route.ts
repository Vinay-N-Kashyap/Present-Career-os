import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    void admin;
  } catch {}
  return NextResponse.json({
    ok: true,
    placementStats: {
      total_students: 480,
      placement_ready: 392,
      ats_qualified: 418,
      avg_ats: 82,
      avg_trust: 91,
      avg_dna: 86,
      engaged_students: 446,
    },
    topStudents: [
      { id: 'stu_1', display_name: 'Aarav Kulkarni', register_number: 'PIN-2026-CS01', ats_score: 94, trust_score: 98, career_dna_score: 92, recruiter_visibility: 96 },
      { id: 'stu_2', display_name: 'Meera Nair', register_number: 'PIN-2026-CS14', ats_score: 91, trust_score: 96, career_dna_score: 90, recruiter_visibility: 93 },
      { id: 'stu_3', display_name: 'Rohan Deshmukh', register_number: 'PIN-2026-FN08', ats_score: 89, trust_score: 95, career_dna_score: 88, recruiter_visibility: 91 },
    ],
    deptStats: [
      { dept_code: 'CSE & AI', student_count: 180, avg_ats: 85, avg_trust: 93 },
      { dept_code: 'B.Com Corporate Finance', student_count: 120, avg_ats: 81, avg_trust: 92 },
      { dept_code: 'ECE & Embedded IoT', student_count: 100, avg_ats: 79, avg_trust: 90 },
      { dept_code: 'Data Science', student_count: 80, avg_ats: 83, avg_trust: 91 },
    ],
  });
}
