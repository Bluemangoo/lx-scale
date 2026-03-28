export default {
    title: 'HCL-32 Assessment Result',
    yesCount: 'Count of "Yes" Answers',
    threshold: 'Screening Threshold',
    thresholdReached: 'Threshold reached (>=14)',
    thresholdNotReached: 'Threshold not reached (<14)',
    severity: 'Risk Level',
    unknown: 'Unknown',
    levels: {
        low: 'Low Risk',
        moderate: 'Moderate Risk',
        high: 'High Risk',
    },
    criteriaTitle: 'Scoring Notes',
    criteria0: 'Total score is the number of "Yes" responses across 32 items.',
    criteria1: 'A score >=14 usually suggests possible hypomanic features.',
    criteria2: 'Please combine this with professional evaluation for interpretation.',
    disclaimer: 'This result is for screening reference only and does not replace professional diagnosis.',
} as const;
