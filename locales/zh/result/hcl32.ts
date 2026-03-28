export default {
    title: 'HCL-32 测评结果',
    yesCount: '“是”回答数量',
    threshold: '筛查阈值',
    thresholdReached: '达到阈值（>=14）',
    thresholdNotReached: '未达到阈值（<14）',
    severity: '风险等级',
    unknown: '未知',
    levels: {
        low: '低风险',
        moderate: '中等风险',
        high: '高风险',
    },
    criteriaTitle: '计分说明',
    criteria0: '总分为 32 题中回答“是”的数量。',
    criteria1: '通常 >=14 分提示可能存在轻躁症特征。',
    criteria2: '建议结合专业评估进一步判断。',
    disclaimer: '本结果仅供筛查参考，不能替代专业诊断。',
} as const;
