import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const errors: string[] = [];

    rows.forEach((row: any, idx: number) => {
      const email = String(row?.email || '').trim();
      if (!email || !email.includes('@')) {
        errors.push(`Row ${idx + 1}: Invalid or missing institutional email (${email || 'empty'}).`);
      }
    });

    return NextResponse.json({
      ok: errors.length === 0,
      validCount: Math.max(0, rows.length - errors.length),
      totalCount: rows.length,
      errors,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, errors: [err?.message || 'Validation failed'] }, { status: 500 });
  }
}
