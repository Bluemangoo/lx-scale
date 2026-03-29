export interface QuestionnaireHistoryEntry {
  entryId: string;
  questionnaireId: string;
  ans: string;
  createdAt: string;
}

const HISTORY_KEY = 'questionnaire_history_v1';
const MAX_HISTORY_ITEMS = 1000;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readHistory(): QuestionnaireHistoryEntry[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = JSON.parse(raw || '[]') as QuestionnaireHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) =>
      item &&
      typeof item.entryId === 'string' &&
      typeof item.questionnaireId === 'string' &&
      typeof item.ans === 'string' &&
      typeof item.createdAt === 'string'
    );
  } catch {
    return [];
  }
}

function writeHistory(items: QuestionnaireHistoryEntry[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS)));
}

export function getQuestionnaireHistoryById(questionnaireId: string): QuestionnaireHistoryEntry[] {
  return readHistory()
    .filter((item) => item.questionnaireId === questionnaireId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function addQuestionnaireHistory(entry: Omit<QuestionnaireHistoryEntry, 'entryId'>) {
  if (!canUseStorage()) return;
  const items = readHistory();
  const next: QuestionnaireHistoryEntry = {
    entryId: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...entry,
  };
  writeHistory([next, ...items]);
}

export function addManyQuestionnaireHistory(entries: Array<Omit<QuestionnaireHistoryEntry, 'entryId'>>) {
  if (!canUseStorage() || entries.length === 0) return;
  const items = readHistory();
  const now = Date.now();
  const normalized = entries.map((entry, index) => ({
    entryId: `${now}_${index}_${Math.random().toString(36).slice(2, 8)}`,
    ...entry,
  }));
  writeHistory([...normalized, ...items]);
}

export function deleteQuestionnaireHistory(entryId: string) {
  if (!canUseStorage()) return;
  const items = readHistory();
  writeHistory(items.filter((item) => item.entryId !== entryId));
}
