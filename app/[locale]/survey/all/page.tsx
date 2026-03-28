'use client';

import { useEffect, useMemo, useState } from 'react';
import { useScopedI18n } from '@/locales/client';

interface RawScore {
  totalScore?: number;
  severity?: string;
}

interface SurveyItem {
  id: number;
  name: string;
  locale: string;
  scores: Record<string, RawScore>;
  created_at: string;
}

const SCALE_ORDER = ['scl90', 'sds', 'sas', 'hcl32', 'asrs'] as const;
const SCALE_LABEL: Record<string, string> = {
  scl90: 'SCL-90',
  sds: 'SDS',
  sas: 'SAS',
  hcl32: 'HCL-32',
  asrs: 'ASRS',
};

const SEVERITY_ZH: Record<string, string> = {
  normal: '正常',
  low: '低',
  mild: '轻度',
  moderate: '中度',
  moderately_severe: '中重度',
  severe: '重度',
  high: '高',
  minimal: '最低',
  extremely_severe: '极重度',
};

const SEVERITY_EN: Record<string, string> = {
  normal: 'Normal',
  low: 'Low',
  mild: 'Mild',
  moderate: 'Moderate',
  moderately_severe: 'Moderately Severe',
  severe: 'Severe',
  high: 'High',
  minimal: 'Minimal',
  extremely_severe: 'Extremely Severe',
};

function getSeverityLabel(severity: string | undefined, locale: string) {
  if (!severity) return '';
  const dict = locale === 'en' ? SEVERITY_EN : SEVERITY_ZH;
  return dict[severity] ?? severity;
}

function formatTime(isoTime: string, locale: string) {
  const date = new Date(isoTime);
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function SurveyAllResultsPage() {
  const t = useScopedI18n('component.survey');
  const [items, setItems] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/survey?limit=500');
        const data = await res.json();
        setItems((data.items || []) as SurveyItem[]);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const rows = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const left = new Date(a.created_at).getTime();
      const right = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? right - left : left - right;
    });

    return sorted.map((item) => {
      const scaleValues = SCALE_ORDER.reduce<Record<string, string>>((acc, scaleId) => {
        const score = item.scores?.[scaleId];
        if (!score || typeof score.totalScore !== 'number') {
          acc[scaleId] = '-';
          return acc;
        }
        const severityText = getSeverityLabel(score.severity, item.locale);
        acc[scaleId] = severityText
          ? `${severityText}(${score.totalScore})`
          : `(${score.totalScore})`;
        return acc;
      }, {});

      return {
        id: item.id,
        name: item.name,
        scaleValues,
        timeText: formatTime(item.created_at, item.locale),
      };
    });
  }, [items, sortOrder]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{t('allResultsTitle')}</h1>
        <p className="text-muted-foreground">{t('allResultsLoading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t('allResultsTitle')}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t('allResultsDesc')}</p>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-muted-foreground" htmlFor="sort-order">
          {t('allResultsSortLabel')}
        </label>
        <select
          id="sort-order"
          className="border rounded-md px-2 py-1 text-sm bg-white"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
        >
          <option value="desc">{t('allResultsSortDesc')}</option>
          <option value="asc">{t('allResultsSortAsc')}</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left font-semibold">{t('allResultsName')}</th>
              {SCALE_ORDER.map((scaleId) => (
                <th key={scaleId} className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                  {SCALE_LABEL[scaleId]}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold">{t('allResultsTime')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={SCALE_ORDER.length + 2}>
                  {t('allResultsEmpty')}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b align-top">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{row.name}</td>
                  {SCALE_ORDER.map((scaleId) => (
                    <td key={scaleId} className="px-4 py-3 whitespace-nowrap">
                      {row.scaleValues[scaleId]}
                    </td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{row.timeText}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
