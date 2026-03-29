'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Clock, FileText } from 'lucide-react';
import { useScopedI18n } from '@/locales/client';
import { Questionnaire } from '@/types';
import {
    deleteQuestionnaireHistory,
    getQuestionnaireHistoryById,
    QuestionnaireHistoryEntry,
} from '@/lib/questionnaire-history';
import { getHistorySummary } from '@/lib/questionnaire-history-summary';

interface Dimension {
    name: string;
    description: string;
}

interface Reference {
    text: string;
    url: string;
}

interface QuestionnaireDetailsPageProps {
    questionnaire: Questionnaire;
    locale?: string;
}

const levelLabelMapZh: Record<string, string> = {
    normal: '正常',
    no_insomnia: '无临床失眠',
    low: '低',
    minimal: '最低',
    mild: '轻度',
    subthreshold: '亚阈值',
    moderate: '中度',
    moderately_severe: '中重度',
    severe: '重度',
    high: '高',
    extreme: '极重度',
    extremely_severe: '极重度',
    average: '平均',
    above_average: '高于平均',
};

const levelLabelMapEn: Record<string, string> = {
    normal: 'Normal',
    no_insomnia: 'No Clinical Insomnia',
    low: 'Low',
    minimal: 'Minimal',
    mild: 'Mild',
    subthreshold: 'Subthreshold',
    moderate: 'Moderate',
    moderately_severe: 'Moderately Severe',
    severe: 'Severe',
    high: 'High',
    extreme: 'Extreme',
    extremely_severe: 'Extremely Severe',
    average: 'Average',
    above_average: 'Above Average',
};

export default function QuestionnaireDetailsPage({ questionnaire, locale = 'zh' }: QuestionnaireDetailsPageProps) {
    const t = useScopedI18n('app.questionnaire.page');

    const { title, details, id, tags } = questionnaire;
    const [historyEntries, setHistoryEntries] = useState<QuestionnaireHistoryEntry[]>([]);

    useEffect(() => {
        setHistoryEntries(getQuestionnaireHistoryById(id));
    }, [id]);

    const historyRows = useMemo(() => {
        return historyEntries.map((entry) => {
            const summary = getHistorySummary(id, entry.ans);
            const level = summary?.level || '';
            const localizedLevel = locale === 'zh'
                ? (levelLabelMapZh[level] || level)
                : (levelLabelMapEn[level] || level);
            const resultText = summary
                ? `${localizedLevel || (locale === 'zh' ? '未知' : 'Unknown')} (${summary.totalScore})`
                : (locale === 'zh' ? '未知 (-)' : 'Unknown (-)');

            return {
                ...entry,
                resultText,
                resultLink: `/questionnaire/${id}/result?ans=${entry.ans}`,
                createdAtText: new Intl.DateTimeFormat(
                    locale === 'zh' ? 'zh-CN' : 'en-US',
                    {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    }
                ).format(new Date(entry.createdAt)),
            };
        });
    }, [historyEntries, id, locale]);

    const handleDeleteHistory = (entryId: string) => {
        deleteQuestionnaireHistory(entryId);
        setHistoryEntries((prev) => prev.filter((item) => item.entryId !== entryId));
    };

    return (
        <div className="container px-4 py-8 max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <Link 
                    href="/questionnaire" 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {locale === 'zh' ? '返回问卷列表' : 'Back to Questionnaire List'}
                </Link>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                
                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Quick Info */}
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{details.questionCount} {locale === 'zh' ? '个问题' : 'Questions'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{details.evaluationTime}</span>
                    </div>
                </div>

                {/* Start Test Button */}
                <Link href={`/questionnaire/${id}`}>
                    <Button size="lg" className="px-8 py-6 text-lg gap-2">
                        {locale === 'zh' ? '开始测评' : 'Start Assessment'} <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
                {/* Introduction */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{t('introduction')}</h2>
                    <p className="text-gray-700 leading-relaxed">{details.introduction}</p>
                </div>

                {/* Instructions */}
                {details.instructions && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{t('instructions')}</h2>
                        <p className="text-gray-700 leading-relaxed">{details.instructions}</p>
                    </div>
                )}

                {/* Scoring Method */}
                {details.scoringMethod && details.scoringMethod.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{t('scoringMethod')}</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            {details.scoringMethod.map((method: string, index: number) => (
                                <li key={index} className="leading-relaxed">{method}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Dimensions */}
                {details.dimensions && details.dimensions.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{t('dimensions')}</h2>
                        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                            {details.dimensions.map((dim: Dimension, index: number) => (
                                <li key={index} className="leading-relaxed">
                                    <strong className="text-gray-900">{dim.name}</strong>：{dim.description}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Notes */}
                {details.notes && details.notes.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{t('notes')}</h2>
                        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                            {details.notes.map((note: string, index: number) => (
                                <li key={index} className="leading-relaxed">{note}</li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* References */}
                {details.references && details.references.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{t('references')}</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {details.references.map((ref: Reference, index: number) => (
                                <li key={index}>
                                    <a 
                                        href={ref.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        {ref.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Local History */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {locale === 'zh' ? '历史测试结果（本地）' : 'Local Test History'}
                </h2>
                <div className="bg-white border rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="px-4 py-3 text-left font-semibold">
                                    {locale === 'zh' ? '结果（分数）' : 'Result (Score)'}
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    {locale === 'zh' ? '时间' : 'Time'}
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    {locale === 'zh' ? '跳转详情' : 'Open Detail'}
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    {locale === 'zh' ? '删除' : 'Delete'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyRows.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                                        {locale === 'zh' ? '暂无本地历史记录' : 'No local history yet'}
                                    </td>
                                </tr>
                            ) : (
                                historyRows.map((row) => (
                                    <tr key={row.entryId} className="border-b">
                                        <td className="px-4 py-3">{row.resultText}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{row.createdAtText}</td>
                                        <td className="px-4 py-3">
                                            <a href={row.resultLink} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" size="sm">
                                                    {locale === 'zh' ? '在新标签查看' : 'Open'}
                                                </Button>
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteHistory(row.entryId)}
                                            >
                                                {locale === 'zh' ? '删除' : 'Delete'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 pt-8 border-t">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        {locale === 'zh' ? '准备好开始测评了吗？' : 'Ready to start the assessment?'}
                    </p>
                    <Link href={`/questionnaire/${id}`}>
                        <Button size="lg" className="px-8 py-6 text-lg gap-2">
                            {locale === 'zh' ? '开始测评' : 'Start Assessment'} <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}