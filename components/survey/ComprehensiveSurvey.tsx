'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Question } from '@/components/questionnaire/test/public/Question';
import { ProgressBar } from '@/components/questionnaire/test/public/ProgressBar';
import { Questionnaire, QuestionType } from '@/types';
import { calculatePHQ9Results } from '@/components/questionnaire/test/private/PHQ9Calculator';
import { calculateGAD7Results } from '@/components/questionnaire/test/private/GAD7Calculator';
import { calculatePSS10Results } from '@/components/questionnaire/test/private/PSS10Calculator';
import { toast } from 'sonner';
import { useScopedI18n } from '@/locales/client';

export interface SurveyQuestionnaire {
  id: string;
  questionnaire: Questionnaire;
}

interface Props {
  questionnaires: SurveyQuestionnaire[];
}

type Step = 'name' | 'questionnaire' | 'saving' | 'results';

interface ScoreEntry {
  totalScore: number;
  severity: string;
  [key: string]: unknown;
}

type AllAnswers = Record<string, Record<number, string>>;
type AllScores = Record<string, ScoreEntry>;

function computeScore(
  id: string,
  answers: Record<number, string>,
  questions: QuestionType[],
): ScoreEntry {
  const args = { answers, questions };
  if (id === 'phq9') return calculatePHQ9Results(args) as ScoreEntry;
  if (id === 'gad7') return calculateGAD7Results(args) as ScoreEntry;
  if (id === 'pss10') return calculatePSS10Results(args) as ScoreEntry;
  const totalScore = Object.values(answers).reduce(
    (s, v) => s + (parseInt(v) || 0),
    0,
  );
  return { totalScore, severity: '' };
}

const SEVERITY_COLOR: Record<string, string> = {
  minimal: 'text-green-600',
  normal: 'text-green-600',
  low: 'text-green-600',
  mild: 'text-yellow-600',
  moderate: 'text-orange-600',
  moderately_severe: 'text-red-500',
  severe: 'text-red-700',
  high: 'text-red-700',
  extremely_severe: 'text-red-900',
};

const QUESTIONS_PER_PAGE = 5;

export function ComprehensiveSurvey({ questionnaires }: Props) {
  const router = useRouter();
  const t = useScopedI18n('component.survey');

  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [qIndex, setQIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [allAnswers, setAllAnswers] = useState<AllAnswers>({});
  const [allScores, setAllScores] = useState<AllScores>({});
  const [saved, setSaved] = useState(false);

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
    setAllAnswers(prev => ({
      ...prev,
      [currentSurvey.id]: {
        ...(prev[currentSurvey.id] ?? {}),
        [questionId]: value,
      },
    }));
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
            maxLength={100}
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
        <div className="space-y-4">
          {questionnaires.map(sq => {
            const score = allScores[sq.id];
            if (!score) return null;
            const colorClass =
              SEVERITY_COLOR[score.severity] ?? 'text-foreground';
            return (
              <div
                key={sq.id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <h2 className="text-lg font-semibold mb-3">
                  {sq.questionnaire.title}
                </h2>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('totalScore')}
                    </p>
                    <p className="text-3xl font-bold">{score.totalScore}</p>
                  </div>
                  {score.severity && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('severity')}
                      </p>
                      <p className={`text-xl font-semibold ${colorClass}`}>
                        {getSeverityLabel(score.severity)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/questionnaire/${sq.id}`)}
                  >
                    {t('viewDetail')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/questionnaire')}
          >
            {t('exploreMore')}
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
        <p className="text-sm text-muted-foreground mb-1">
          {t('progressInfo', {
            current: qIndex + 1,
            total: questionnaires.length,
          })}
        </p>
        <ProgressBar completionPercentage={overallPct} />
      </div>

      <h1 className="text-2xl font-bold mb-1">{currentQ.title}</h1>
      <p className="text-muted-foreground mb-6">{currentQ.description}</p>

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
