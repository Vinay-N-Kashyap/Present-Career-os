import { NextResponse } from 'next/server';

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return NextResponse.json({ ok: true, deletedId: id });
}
