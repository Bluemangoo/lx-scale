'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Question } from '@/components/questionnaire/test/public/Question';
import { ProgressBar } from '@/components/questionnaire/test/public/ProgressBar';
import { Questionnaire, QuestionType } from '@/types';
import { calculatePHQ9Results } from '@/components/questionnaire/test/private/PHQ9Calculator';
import { calculateGAD7Results } from '@/components/questionnaire/test/private/GAD7Calculator';
import { calculatePSS10Results } from '@/components/questionnaire/test/private/PSS10Calculator';
import { calculateSCL90Results } from '@/components/questionnaire/test/private/SCL90Calculator';
import { calculateSDSResults } from '@/components/questionnaire/test/private/SDSCalculator';
import { calculateSASResults } from '@/components/questionnaire/test/private/SASCalculator';
import { calculateHCL32Results } from '@/components/questionnaire/test/private/HCL32Calculator';
import { calculateADHDResults } from '@/components/questionnaire/test/private/ADHDCalculator';
import { compressToEncodedURIComponent as compress } from 'lz-string';
import { addManyQuestionnaireHistory } from '@/lib/questionnaire-history';
import { toast } from 'sonner';
import { useScopedI18n } from '@/locales/client';

export interface SurveyQuestionnaire {
  id: string;
  questionnaire: Questionnaire;
}

interface Props {
  questionnaires: SurveyQuestionnaire[];
  surveyId?: string | null;
}

type Step = 'name' | 'questionnaire' | 'saving' | 'results';

interface ScoreEntry {
  totalScore: number;
  severity: string;
  [key: string]: unknown;
}

type AllAnswers = Record<string, Record<number, string>>;
type AllScores = Record<string, ScoreEntry>;

const SCORE_TABLE_ORDER = ['scl90', 'sds', 'sas', 'hcl32', 'asrs'] as const;
const SCORE_TABLE_LABELS: Record<string, string> = {
  scl90: 'SCL-90',
  sds: 'SDS',
  sas: 'SAS',
  hcl32: 'HCL-32',
  asrs: 'ASRS',
};

function computeScore(
  id: string,
  answers: Record<number, string>,
  questions: QuestionType[],
): ScoreEntry {
  const args = { answers, questions };
  if (id === 'phq9') return calculatePHQ9Results(args) as ScoreEntry;
  if (id === 'gad7') return calculateGAD7Results(args) as ScoreEntry;
  if (id === 'pss10') return calculatePSS10Results(args) as ScoreEntry;
  if (id === 'scl90') return calculateSCL90Results(args) as ScoreEntry;
  if (id === 'sds') return calculateSDSResults(args) as ScoreEntry;
  if (id === 'sas') return calculateSASResults(args) as ScoreEntry;
  if (id === 'hcl32') return calculateHCL32Results(args) as ScoreEntry;
  if (id === 'asrs') return calculateADHDResults(args) as ScoreEntry;
  const totalScore = Object.values(answers).reduce(
    (s, v) => s + (parseInt(v) || 0),
    0,
  );
  return { totalScore, severity: '' };
}

const QUESTIONS_PER_PAGE = 5;
const MAX_NAME_LENGTH = 100;

function getDraftStorageKey(surveyId?: string | null) {
  return `comprehensive-survey-draft:${surveyId ?? 'root'}`;
}

export function ComprehensiveSurvey({ questionnaires, surveyId = null }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('component.survey');
  const draftStorageKey = useMemo(() => getDraftStorageKey(surveyId), [surveyId]);
  const localeFromPath = pathname.split('/').filter(Boolean)[0] || 'zh';

  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [qIndex, setQIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [allAnswers, setAllAnswers] = useState<AllAnswers>({});
  const [allScores, setAllScores] = useState<AllScores>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        step?: Step;
        name?: string;
        qIndex?: number;
        page?: number;
        allAnswers?: AllAnswers;
        allScores?: AllScores;
        saved?: boolean;
      };
      if (parsed.step) setStep(parsed.step);
      if (parsed.name) setName(parsed.name);
      if (typeof parsed.qIndex === 'number') setQIndex(parsed.qIndex);
      if (typeof parsed.page === 'number') setPage(parsed.page);
      if (parsed.allAnswers) setAllAnswers(parsed.allAnswers);
      if (parsed.allScores) setAllScores(parsed.allScores);
      if (typeof parsed.saved === 'boolean') setSaved(parsed.saved);
    } catch {
      // Ignore invalid draft payloads
    }
  }, [draftStorageKey]);

  useEffect(() => {
    const hasMeaningfulProgress =
      step !== 'name' ||
      name.trim().length > 0 ||
      qIndex > 0 ||
      page > 1 ||
      Object.keys(allAnswers).length > 0 ||
      Object.keys(allScores).length > 0 ||
      saved;

    if (!hasMeaningfulProgress) {
      localStorage.removeItem(draftStorageKey);
      return;
    }

    const draft = {
      step,
      name,
      qIndex,
      page,
      allAnswers,
      allScores,
      saved,
    };
    localStorage.setItem(draftStorageKey, JSON.stringify(draft));
  }, [step, name, qIndex, page, allAnswers, allScores, saved, draftStorageKey]);

  const currentSurvey = questionnaires[qIndex];
  const currentQ = currentSurvey?.questionnaire;

  const buildQuestions = useCallback((): QuestionType[] => {
    if (!currentQ) return [];
    return currentQ.questions.map((q, idx) => ({
      id: idx + 1,
      content: q.content,
      options: currentQ.renderOptions(q.id),
    }));
  }, [currentQ]);

  const questions = buildQuestions();
  const answers = allAnswers[currentSurvey?.id] ?? {};
  const answeredCount = Object.keys(answers).length;
  const completionPct = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    (page - 1) * QUESTIONS_PER_PAGE,
    page * QUESTIONS_PER_PAGE,
  );

  const totalQuestions = questionnaires.reduce(
    (s, sq) => s + sq.questionnaire.questions.length,
    0,
  );
  const completedBefore = questionnaires
    .slice(0, qIndex)
    .reduce((s, sq) => s + sq.questionnaire.questions.length, 0);
  const overallPct = totalQuestions
    ? ((completedBefore + answeredCount) / totalQuestions) * 100
    : 0;

  function handleSelect(questionId: number, value: string) {
    setAllAnswers(prev => {
      const next = {
        ...prev,
        [currentSurvey.id]: {
          ...(prev[currentSurvey.id] ?? {}),
          [questionId]: value,
        },
      };

      // Persist immediately to avoid losing the latest answer when leaving the page quickly.
      const draft = {
        step,
        name,
        qIndex,
        page,
        allAnswers: next,
        allScores,
        saved,
      };
      localStorage.setItem(draftStorageKey, JSON.stringify(draft));

      return next;
    });
  }

  function handleNameNext() {
    if (!name.trim()) {
      toast(t('nameRequired'));
      return;
    }
    setStep('questionnaire');
  }

  function handleNextPage() {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  }

  function handleFinishQuestionnaire() {
    if (answeredCount < questions.length) {
      toast(t('answerAll', { remaining: questions.length - answeredCount }));
      return;
    }
    const score = computeScore(currentSurvey.id, answers, questions);
    const newScores = { ...allScores, [currentSurvey.id]: score };
    setAllScores(newScores);

    if (qIndex + 1 < questionnaires.length) {
      setQIndex(qIndex + 1);
      setPage(1);
      window.scrollTo(0, 0);
    } else {
      const mergedAnswers: AllAnswers = {
        ...allAnswers,
        [currentSurvey.id]: answers,
      };

      const historyEntries = questionnaires
        .map((sq) => {
          const answerMap = mergedAnswers[sq.id];
          if (!answerMap) return null;

          const answerString = sq.questionnaire.questions
            .map((_, index) => answerMap[index + 1] ?? '0')
            .join('');

          return {
            questionnaireId: sq.id,
            ans: compress(answerString),
            createdAt: new Date().toISOString(),
          };
        })
        .filter(Boolean) as Array<{ questionnaireId: string; ans: string; createdAt: string }>;

      addManyQuestionnaireHistory(historyEntries);
      setStep('saving');
      saveResults(newScores);
    }
  }

  async function saveResults(scores: AllScores) {
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId,
          name: name.trim(),
          locale: document.documentElement.lang || 'zh',
          scores,
          answers: allAnswers,
        }),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error('Failed to save survey result:', err);
    } finally {
      setStep('results');
    }
  }

  function getSeverityLabel(severity: string): string {
    const map: Record<string, string> = {
      minimal: t('severity_minimal'),
      normal: t('severity_normal'),
      low: t('severity_low'),
      mild: t('severity_mild'),
      moderate: t('severity_moderate'),
      moderately_severe: t('severity_moderately_severe'),
      severe: t('severity_severe'),
      high: t('severity_high'),
      extremely_severe: t('severity_extremely_severe'),
    };
    return map[severity] ?? severity;
  }

  function restartAll() {
    setStep('name');
    setName('');
    setQIndex(0);
    setPage(1);
    setAllAnswers({});
    setAllScores({});
    setSaved(false);
    localStorage.removeItem(draftStorageKey);
  }

  function restartCurrentScale() {
    if (!currentSurvey) return;
    setAllAnswers((prev) => {
      const next = { ...prev };
      delete next[currentSurvey.id];
      return next;
    });
    setAllScores((prev) => {
      const next = { ...prev };
      delete next[currentSurvey.id];
      return next;
    });
    setPage(1);
    window.scrollTo(0, 0);
  }

  function buildQuestionnaireResultLink(scaleId: string): string | null {
    const answerMap = allAnswers[scaleId];
    const questionnaire = questionnaires.find((item) => item.id === scaleId)?.questionnaire;
    if (!answerMap || !questionnaire) return null;

    const answerString = questionnaire.questions
      .map((_, index) => answerMap[index + 1] ?? '0')
      .join('');

    const encodedAnswers = compress(answerString);
    return `/${localeFromPath}/questionnaire/${scaleId}/result?ans=${encodedAnswers}`;
  }

  // ── Name input step ──────────────────────────────────────────────────────────
  if (step === 'name') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground mb-8">{t('description')}</p>
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <label
            className="block text-base font-medium mb-2"
            htmlFor="name-input"
          >
            {t('nameLabel')}
          </label>
          <input
            id="name-input"
            type="text"
            className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary mb-6"
            placeholder={t('namePlaceholder')}
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleNameNext()}
          />
          <p className="text-sm text-muted-foreground mb-6">
            {t('includes', { count: questionnaires.length })}
          </p>
          <ul className="mb-6 space-y-1">
            {questionnaires.map(sq => (
              <li key={sq.id} className="text-sm flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
                {sq.questionnaire.title}
              </li>
            ))}
          </ul>
          <Button className="w-full" onClick={handleNameNext}>
            {t('startSurvey')}
          </Button>
        </div>
      </div>
    );
  }

  // ── Saving step ──────────────────────────────────────────────────────────────
  if (step === 'saving') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-muted-foreground">{t('saving')}</p>
      </div>
    );
  }

  // ── Results step ──────────────────────────────────────────────────────────────
  if (step === 'results') {
    const scoringStandards = [
      t('scoringStandard_scl90'),
      t('scoringStandard_sds'),
      t('scoringStandard_sas'),
      t('scoringStandard_hcl32'),
      t('scoringStandard_asrs'),
    ];

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-2">{t('resultsTitle')}</h1>
        <p className="text-muted-foreground mb-1">
          {t('greeting', { name })}
        </p>
        {saved ? (
          <p className="text-sm text-green-600 mb-6">{t('savedSuccess')}</p>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">
            {t('savedSkipped')}
          </p>
        )}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">{t('scoringBriefTitle')}</h2>
          <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
            {scoringStandards.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-3">{t('resultsTableTitle')}</h2>
          <p className="text-sm font-medium mb-3">
            {t('columnCn')}: {name}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-3 py-2 text-left font-semibold">{t('resultTableScale')}</th>
                  <th className="px-3 py-2 text-left font-semibold">{t('resultTableScore')}</th>
                  <th className="px-3 py-2 text-left font-semibold">{t('resultTableResult')}</th>
                  <th className="px-3 py-2 text-left font-semibold">{t('resultTableDetail')}</th>
                </tr>
              </thead>
              <tbody>
                {SCORE_TABLE_ORDER.map((id) => {
                  const score = allScores[id];
                  const severity = score?.severity ? getSeverityLabel(score.severity) : '-';
                  const detailLink = buildQuestionnaireResultLink(id);
                  return (
                    <tr className="border-b" key={id}>
                      <td className="px-3 py-2 font-medium">{SCORE_TABLE_LABELS[id]}</td>
                      <td className="px-3 py-2">{score?.totalScore ?? '-'}</td>
                      <td className="px-3 py-2">{severity}</td>
                      <td className="px-3 py-2">
                        {detailLink ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(detailLink, '_blank', 'noopener,noreferrer')}
                          >
                            {t('openDetailInNewTab')}
                          </Button>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(surveyId ? `/survey/${surveyId}/all` : '/survey/all')}
          >
            {t('viewAllResults')}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/questionnaire')}
          >
            {t('exploreMore')}
          </Button>
          <Button variant="outline" onClick={restartAll}>
            {t('restartAll')}
          </Button>
          <Button onClick={() => router.push('/')}>{t('backHome')}</Button>
        </div>
      </div>
    );
  }

  // ── Questionnaire step ────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <p className="text-sm text-muted-foreground">
            {t('progressInfo', {
              current: qIndex + 1,
              total: questionnaires.length,
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={restartCurrentScale}>
              {t('restartCurrentScale')}
            </Button>
            <Button variant="outline" size="sm" onClick={restartAll}>
              {t('restartAll')}
            </Button>
          </div>
        </div>
        <ProgressBar completionPercentage={overallPct} />
      </div>

      <h1 className="text-2xl font-bold mb-1">{currentQ.title}</h1>
      <p className="text-muted-foreground mb-6">{currentQ.description}</p>

      <div className="bg-white border rounded-lg p-4 mb-6 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-1">
            {t('scaleIntroTitle')}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {currentQ.details.introduction}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-1">
            {t('scaleInstructionsTitle')}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {currentQ.details.instructions}
          </p>
        </div>
      </div>

      <ProgressBar completionPercentage={completionPct} />

      <div className="space-y-6 mt-6">
        {pageQuestions.map(question => (
          <Question
            key={question.id}
            question={question}
            answer={answers[question.id]}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          {t('prevPage')}
        </Button>
        <span className="text-sm text-muted-foreground">
          {t('pageInfo', { currentPage: page, totalPages })}
        </span>
        {page < totalPages ? (
          <Button onClick={handleNextPage}>{t('nextPage')}</Button>
        ) : (
          <Button onClick={handleFinishQuestionnaire}>
            {qIndex + 1 < questionnaires.length
              ? t('nextQuestionnaire')
              : t('submit')}
          </Button>
        )}
      </div>
    </div>
  );
}
