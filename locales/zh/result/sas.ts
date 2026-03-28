export default {
    title: 'SAS 测评结果',
    rawScore: '原始总分',
    standardScore: '标准分',
    severity: '焦虑程度',
    unknown: '未知',
    levels: {
        normal: '正常',
        mild: '轻度焦虑',
        moderate: '中度焦虑',
        severe: '重度焦虑',
    },
    criteriaTitle: '计分说明',
    criteria0: '原始分为 20 题得分之和，范围 20-80。',
    criteria1: '标准分 = 原始分 × 1.25（四舍五入）。',
    criteria2: '50-59 为轻度焦虑，60-69 为中度焦虑。',
    criteria3: '70 及以上为重度焦虑。',
    disclaimer: '本结果仅供筛查参考，不能替代专业诊断。',
} as const;
