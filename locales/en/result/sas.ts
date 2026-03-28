export default {
    title: 'SAS Assessment Result',
    rawScore: 'Raw Score',
    standardScore: 'Standard Score',
    severity: 'Anxiety Level',
    unknown: 'Unknown',
    levels: {
        normal: 'Normal',
        mild: 'Mild Anxiety',
        moderate: 'Moderate Anxiety',
        severe: 'Severe Anxiety',
    },
    criteriaTitle: 'Scoring Notes',
    criteria0: 'Raw score is the sum of 20 item scores (range 20-80).',
    criteria1: 'Standard score = raw score × 1.25 (rounded).',
    criteria2: '50-59 indicates mild anxiety, 60-69 indicates moderate anxiety.',
    criteria3: '70 or above indicates severe anxiety.',
    disclaimer: 'This result is for screening reference only and does not replace professional diagnosis.',
} as const;
