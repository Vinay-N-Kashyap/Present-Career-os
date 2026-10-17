import { NextResponse } from 'next/server';
import { runSystemHealthAudit } from '@/lib/admin/systemHealth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await runSystemHealthAudit();
    const httpStatus = report.readinessStatus === 'HEALTHY_PRODUCTION' ? 200 : 200;
    return NextResponse.json(report, { status: httpStatus });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'System health check threw an internal exception',
        details: err?.message || String(err)
      },
      { status: 500 }
    );
  }
}
