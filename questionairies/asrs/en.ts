import { Questionnaire } from "@/types";
import { adhd } from "../adhd/en";

export const asrs: Questionnaire = {
    ...adhd,
    id: "asrs",
    title: "Adult ADHD Self-Report Scale (ASRS-v1.1)",
    description: "Assessment of adult ADHD symptoms based on ASRS-v1.1",
    tags: ["ASRS", "ADHD", "Attention", "Self-assessment"],
};
