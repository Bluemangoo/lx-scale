'use client';

import React from 'react';
import { useScopedI18n } from '@/locales/client';
import { calculateHCL32Results } from '../../test/private/HCL32Calculator';

interface HCL32ResultProps {
  answers: string[];
}

export function HCL32Result({ answers }: HCL32ResultProps) {
  const t = useScopedI18n('components.hcl32Result');

  const answersObj: { [key: number]: string } = {};
  answers.forEach((answer, index) => {
    answersObj[index + 1] = answer;
  });

  const results = calculateHCL32Results({ answers: answersObj, questions: [] });

  const levelText = {
    low: t('levels.low'),
    moderate: t('levels.moderate'),
    high: t('levels.high'),
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title={t('yesCount')} value={`${results.totalScore}/32`} />
          <MetricCard
            title={t('threshold')}
            value={results.thresholdReached ? t('thresholdReached') : t('thresholdNotReached')}
          />
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
      <span className="text-2xl font-semibold text-indigo-600 text-center">{value}</span>
    </div>
  );
}
