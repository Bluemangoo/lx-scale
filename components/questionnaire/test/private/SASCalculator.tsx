import { QuestionType } from "@/types";

interface SASCalculatorProps {
    answers: { [key: number]: string };
    questions: QuestionType[];
}

export const calculateSASResults = ({ answers }: SASCalculatorProps): any => {
    const reverseItems = [5, 9, 13, 17, 19];
    let rawScore = 0;

    Object.entries(answers).forEach(([questionId, score]) => {
        const questionNum = parseInt(questionId, 10);
        const scoreValue = parseInt(score, 10);

        if (reverseItems.includes(questionNum)) {
            rawScore += 5 - scoreValue;
        } else {
            rawScore += scoreValue;
        }
    });

    const standardScore = Math.round(rawScore * 1.25);

    let severity = "normal";
    if (standardScore >= 70) {
        severity = "severe";
    } else if (standardScore >= 60) {
        severity = "moderate";
    } else if (standardScore >= 50) {
        severity = "mild";
    }

    return {
        rawScore,
        totalScore: standardScore,
        severity,
        factorScores: {},
        positiveItemCount: 0,
        positiveItemAverage: 0,
        isSevere: severity === "severe",
    };
};
