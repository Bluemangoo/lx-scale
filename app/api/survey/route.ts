import { NextRequest, NextResponse } from 'next/server';
import { getPool, ensureSurveyTable } from '@/lib/db';

const DEFAULT_LOCALE = 'zh';

export async function GET(request: NextRequest) {
  try {
    const db = await getPool();
    if (!db) {
      return NextResponse.json({ ok: true, persisted: false, items: [] });
    }

    await ensureSurveyTable();

    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '200', 10);
    const rootOnly = searchParams.get('root') === '1';
    const surveyId = searchParams.get('surveyId');
    const limit = Number.isNaN(limitParam)
      ? 200
      : Math.max(1, Math.min(limitParam, 1000));

    let result;
    if (rootOnly) {
      result = await db.query(
        `SELECT id, survey_id, name, locale, scores, created_at
         FROM survey_results
         WHERE survey_id IS NULL
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );
    } else if (surveyId !== null) {
      result = await db.query(
        `SELECT id, survey_id, name, locale, scores, created_at
         FROM survey_results
         WHERE survey_id = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [surveyId, limit]
      );
    } else {
      result = await db.query(
        `SELECT id, survey_id, name, locale, scores, created_at
         FROM survey_results
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );
    }

    return NextResponse.json({
      ok: true,
      persisted: true,
      items: result.rows,
    });
  } catch (error) {
    console.error('[survey API] Error listing survey results:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: '查询数据时出错，请稍后再试。',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, locale, scores, answers, surveyId } = body as {
      name: string;
      locale: string;
      scores: Record<string, unknown>;
      answers: Record<string, unknown>;
      surveyId?: string | null;
    };

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'name is required.' },
        { status: 400 }
      );
    }

    if (surveyId !== undefined && surveyId !== null && typeof surveyId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'surveyId must be string or null.' },
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
      `INSERT INTO survey_results (survey_id, name, locale, scores, answers)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [surveyId ?? null, name.trim(), locale ?? DEFAULT_LOCALE, JSON.stringify(scores), JSON.stringify(answers)]
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
