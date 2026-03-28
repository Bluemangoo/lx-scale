'use client';

import { notFound } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, use } from 'react';
import { Button } from '@/components/ui/button';
import { Questionnaire } from '@/types';
import Link from 'next/link';
import { ResultContainer } from '@/components/questionnaire/result/public/ResultContainer';
import { Recommendations } from '@/components/questionnaire/result/public/Recommendations';
import { AnswerList } from '@/components/questionnaire/result/public/AnswerList';
import { decompressFromEncodedURIComponent as decompress } from 'lz-string';
import { ResultAnalysis } from '@/components/questionnaire/result/analysis/ResultAnalysis';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { useScopedI18n } from '@/locales/client';

export default function QuestionnaireResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  // Store decoded answers
  const [isChatLimitReached, setIsChatLimitReached] = useState(false);
  const t = useScopedI18n('app.questionnaire.result');

  // Get the questionnaire with specified id from questionnaire data
  const questionnaire = useQuestionnaire(id) as Questionnaire;

  const decodedAnswers = useMemo(() => {
    const encodedAnswers = searchParams.get('ans');
    if (!encodedAnswers) return [];
    const raw = decompress(encodedAnswers) || '';
    return raw.split('');
  }, [searchParams]);

  // Construct question-option text kv pairs from decoded answers for AI
  const questionnaireResults: Record<string, string> = useMemo(() => {
    if (!questionnaire) return {};
    const obj: Record<string, string> = {};
    questionnaire.questions.forEach((q, idx) => {
      const val = decodedAnswers[idx];
      if (val === undefined) return;
      const option = questionnaire.renderOptions(q.id).find(
        (o) => String(o.value) === String(val)
      );
      obj[q.content] = option ? option.content : String(val);
    });
    return obj;
  }, [decodedAnswers, questionnaire]);

  // If data not found, show 404 page
  if (!questionnaire || !questionnaire.details) {
    return notFound();
  }

  if (decodedAnswers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen  md:p-4 p-2">
        <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg md:p-8 p-4 border">
          <h1 className="text-2xl font-bold mb-6">
            {questionnaire.title} - {t('resultNotFoundTitle')}
          </h1>
          <p className="text-gray-700 mb-6">{t('resultNotFoundDesc')}</p>
          <Button>
            <Link href={`/questionnaire/${id}/survey`}>{t('retryTest')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ResultContainer 
      title={questionnaire.title} 
      id={id}
      questionnaire={questionnaire}
      answers={decodedAnswers}
      questionnaireResults={questionnaireResults}
      isChatLimitReached={isChatLimitReached}
    >
      <AnswerList
        questions={questionnaire.questions}
        answers={decodedAnswers}
        renderOptions={questionnaire.renderOptions}
      />
      <ResultAnalysis questionnaireId={id} answers={decodedAnswers} />

      <Recommendations
        questionnaireId={id}
        questionnaireResults={questionnaireResults}
        onChatLimitReached={setIsChatLimitReached}
      />
    </ResultContainer>
  );
}
