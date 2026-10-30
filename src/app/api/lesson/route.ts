import { NextRequest, NextResponse } from 'next/server';
import { getLongLesson } from '@/lib/data/longLessons';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get('prefix');
    const dayStr = searchParams.get('day');

    if (!prefix || !dayStr) {
      return NextResponse.json({ error: 'Missing prefix or day query parameter' }, { status: 400 });
    }

    const day = parseInt(dayStr, 10);
    if (isNaN(day) || day < 1 || day > 360) {
      return NextResponse.json({ error: 'Day must be an integer between 1 and 360' }, { status: 400 });
    }

    const lesson = getLongLesson(prefix, day);
    if (!lesson) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(lesson, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
