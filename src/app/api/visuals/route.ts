import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { isCourseVisualsEnabled } from '@/lib/visuals/enabledCourses';
import { getLongLesson } from '@/lib/data/longLessons';
import { synthesizeLongLessonVisual } from '@/lib/visuals/loadVisuals';

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

    // Check release switch
    if (!isCourseVisualsEnabled(prefix)) {
      return NextResponse.json({ prefix, day, entries: [] });
    }

    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.join(
      process.cwd(),
      'src',
      'lib',
      'data',
      'lessonVisuals',
      prefix,
      `day-${dayPadded}.json`
    );

    if (!fs.existsSync(filePath)) {
      const longLesson = getLongLesson(prefix, day);
      if (longLesson && Array.isArray(longLesson.parts) && longLesson.parts.length > 0) {
        const entries = longLesson.parts.map((part, idx) => {
          const sayList = Array.isArray(part.say) ? part.say : (part.say ? [part.say] : []);
          const filled = synthesizeLongLessonVisual(prefix, day, idx, { ...part, say: sayList });
          return {
            partTitle: part.title,
            codeHash: `synth-${prefix}-${day}-${idx}`,
            spec: { template: filled?.template || 'flow' },
            filled: filled || { template: 'none', reason: 'Disabled' }
          };
        });
        return NextResponse.json({
          schemaVersion: 1,
          prefix,
          day,
          promptSha: 'deterministic-synth-v1',
          model: 'domain-visual-synthesizer',
          entries
        }, {
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        });
      }
      return NextResponse.json({ prefix, day, entries: [] });
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to load visual day file', details: err?.message },
      { status: 500 }
    );
  }
}
