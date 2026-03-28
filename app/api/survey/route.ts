import { NextRequest, NextResponse } from 'next/server';
import { getPool, ensureSurveyTable } from '@/lib/db';

const DEFAULT_LOCALE = 'zh';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, locale, scores, answers } = body as {
      name: string;
      locale: string;
      scores: Record<string, unknown>;
      answers: Record<string, unknown>;
    };

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'name is required.' },
        { status: 400 }
      );
    }

    const db = await getPool();
    if (!db) {
      // Database not configured – return success without persisting.
      return NextResponse.json({ ok: true, persisted: false });
    }

    await ensureSurveyTable();

    const result = await db.query(
      `INSERT INTO survey_results (name, locale, scores, answers)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name.trim(), locale ?? DEFAULT_LOCALE, JSON.stringify(scores), JSON.stringify(answers)]
    );

    const id = (result.rows[0] as { id: number }).id;
    return NextResponse.json({ ok: true, persisted: true, id });
  } catch (error) {
    console.error('[survey API] Error saving survey result:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: '保存数据时出错，请稍后再试。',
      },
      { status: 500 }
    );
  }
}
