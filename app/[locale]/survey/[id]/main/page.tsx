'use client';

import { use } from 'react';
import { ComprehensiveSurvey } from '@/components/survey/ComprehensiveSurvey';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { Questionnaire } from '@/types';

const SURVEY_IDS = ['scl90', 'sds', 'sas', 'hcl32', 'asrs'] as const;

export default function SurveyByIdMainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const allQuestionnaires = useQuestionnaire() as Questionnaire[];

  const surveyQuestionnaires = SURVEY_IDS.map((qid) => {
    const q = allQuestionnaires.find((item) => item.id === qid);
    if (!q) return null;
    return { id: qid, questionnaire: q };
  }).filter(Boolean) as { id: string; questionnaire: Questionnaire }[];

  return <ComprehensiveSurvey questionnaires={surveyQuestionnaires} surveyId={id} />;
}
