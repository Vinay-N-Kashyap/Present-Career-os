import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    studentId: id,
    task: {
      id: `task_${Date.now()}`,
      title: body.title || 'Complete verification milestone',
      priority: body.priority || 'high',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  });
}
