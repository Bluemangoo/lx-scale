'use client';

import React from 'react';
import { useScopedI18n } from '@/locales/client';
import { calculateSASResults } from '../../test/private/SASCalculator';

interface SASResultProps {
  answers: string[];
}

export function SASResult({ answers }: SASResultProps) {
  const t = useScopedI18n('components.sasResult');

  const answersObj: { [key: number]: string } = {};
  answers.forEach((answer, index) => {
    answersObj[index + 1] = answer;
  });

  const results = calculateSASResults({ answers: answersObj, questions: [] });

  const levelText = {
    normal: t('levels.normal'),
    mild: t('levels.mild'),
    moderate: t('levels.moderate'),
    severe: t('levels.severe'),
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title={t('rawScore')} value={`${results.rawScore}/80`} />
          <MetricCard title={t('standardScore')} value={results.totalScore} />
          <MetricCard
            title={t('severity')}
            value={levelText[results.severity as keyof typeof levelText] || t('unknown')}
          />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">{t('criteriaTitle')}</h3>
        <ul className="space-y-1 text-sm text-gray-700 ml-4 list-disc">
          <li>{t('criteria0')}</li>
          <li>{t('criteria1')}</li>
          <li>{t('criteria2')}</li>
          <li>{t('criteria3')}</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">{t('disclaimer')}</p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
}

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
      <span className="text-sm text-gray-500 mb-1">{title}</span>
      <span className="text-2xl font-semibold text-indigo-600">{value}</span>
    </div>
  );
}
