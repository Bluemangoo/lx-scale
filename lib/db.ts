/**
 * PostgreSQL database connection helper.
 *
 * Configure with the DATABASE_URL environment variable, e.g.:
 *   DATABASE_URL=postgresql://user:password@host:5432/dbname
 *
 * If DATABASE_URL is not set the helper returns null and all database
 * operations are silently skipped.
 */

type QueryResult = {
  rows: Record<string, unknown>[];
  rowCount: number | null;
};

type PoolLike = {
  query(text: string, params?: unknown[]): Promise<QueryResult>;
};

let pool: PoolLike | null = null;
let poolInitialized = false;

export async function getPool(): Promise<PoolLike | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (poolInitialized) {
    return pool;
  }

  poolInitialized = true;

  try {
    const { Pool } = (await import('pg')) as {
      Pool: new (opts: { connectionString: string }) => PoolLike;
    };
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  } catch {
    console.warn('[db] pg module not available – database features disabled');
    pool = null;
  }

  return pool;
}

/** Ensure the survey_results table exists. Call once on first use. */
export async function ensureSurveyTable(): Promise<void> {
  const db = await getPool();
  if (!db) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS survey_results (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      locale     TEXT NOT NULL DEFAULT 'zh',
      scores     JSONB NOT NULL DEFAULT '{}',
      answers    JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
