import { Questionnaire } from "@/types";
import { adhd } from "../adhd/zh";

export const asrs: Questionnaire = {
    ...adhd,
    id: "asrs",
    title: "成人 ADHD 自评量表 (ASRS-v1.1)",
    description: "基于 ASRS-v1.1 的成人 ADHD 症状评估",
    tags: ["ASRS", "ADHD", "注意力", "自评量表"],
};
