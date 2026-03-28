'use client';

import { ComprehensiveSurvey } from '@/components/survey/ComprehensiveSurvey';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { Questionnaire } from '@/types';

/**
 * IDs of the questionnaires that make up the comprehensive survey.
 * They are presented in this order.
 */
const SURVEY_IDS = ['scl90', 'sds', 'sas', 'hcl32', 'asrs'] as const;

export default function SurveyPage() {
  const allQuestionnaires = useQuestionnaire() as Questionnaire[];

  const surveyQuestionnaires = SURVEY_IDS.map(id => {
    const q = allQuestionnaires.find(q => q.id === id);
    if (!q) return null;
    return { id, questionnaire: q };
  }).filter(Boolean) as { id: string; questionnaire: Questionnaire }[];

  return <ComprehensiveSurvey questionnaires={surveyQuestionnaires} />;
}
