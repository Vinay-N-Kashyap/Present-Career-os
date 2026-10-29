import { NextResponse } from 'next/server';

let COMPANY_PROFILE = {
  name: 'PinIT Enterprise Partner Corp',
  industry: 'Enterprise SaaS & FinTech',
  website: 'https://pinit.in',
  size: '500-1000 Employees',
  headquarters: 'Bengaluru, India',
  verifiedPartner: true,
};

export async function GET() {
  return NextResponse.json({ ok: true, company: COMPANY_PROFILE });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  COMPANY_PROFILE = { ...COMPANY_PROFILE, ...body };
  return NextResponse.json({ ok: true, company: COMPANY_PROFILE });
}
