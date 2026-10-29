import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('users')
      .select('id, email, username, display_name, role, xp, streak, ats_score, trust_score, target_role, weak_areas')
      .eq('role', 'student')
      .order('xp', { ascending: false })
      .limit(50);

    if (!error && Array.isArray(data)) {
      return NextResponse.json({ ok: true, students: data });
    }
  } catch {}

  return NextResponse.json({
    ok: true,
    students: [],
  });
}
