import { QuestionType } from "@/types";

interface HCL32CalculatorProps {
    answers: { [key: number]: string };
    questions: QuestionType[];
}

export const calculateHCL32Results = ({ answers }: HCL32CalculatorProps): any => {
    const totalScore = Object.values(answers).reduce(
        (sum, value) => sum + (parseInt(value, 10) || 0),
        0,
    );

    let severity = "low";
    if (totalScore >= 14) {
        severity = "high";
    } else if (totalScore >= 8) {
        severity = "moderate";
    }

    return {
        totalScore,
        severity,
        factorScores: {},
        positiveItemCount: totalScore,
        positiveItemAverage: totalScore / 32,
        isSevere: severity === "high",
        thresholdReached: totalScore >= 14,
    };
};
