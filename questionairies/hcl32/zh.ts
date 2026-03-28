import { Questionnaire } from "@/types";

export const hcl32: Questionnaire = {
    id: "hcl32",
    title: "轻躁症自我评估量表(HCL-32)", // [cite: 116]
    description: "评估「心境高涨」时期的特征", // [cite: 118]
    tags: ["双相情感障碍", "轻躁症", "自评量表", "筛查"],
    time: "5-10分钟",
    details: {
        introduction: "在人生的不同时期，每个人的精力、活动力和心境都会经历变化或波动（即所谓的「高低起伏」）。本问卷的目的在于评估您「心境高涨」时期的特征。", // [cite: 118]
        questionCount: "32个项目",
        evaluationTime: "通常为5-10分钟",
        instructions: "请试着回想一段您处于「心境高涨」的时期(当时并未使用药物或酒精)。在那个状态下，请回答以下问题是否符合您当时的经验。", // [cite: 119]
        scoringMethod: [
            "总分：计算所有回答为“是”的项目总数",
            "筛检标准：筛检临界值为14分", // [cite: 200]
            "效度指标：根据台湾验证研究，敏感度82%，特异度67%" // [cite: 200]
        ],
        dimensions: [
            { name: "精力与活动", description: "评估睡眠需求减少、精力充沛及活动量增加的情况" }, // [cite: 122, 125, 147]
            { name: "情绪与社交", description: "评估自信心提升、社交意愿增强等特征" }, // [cite: 127, 132]
            { name: "风险与冲动", description: "评估驾驶、消费及日常活动中的冒险行为" } // [cite: 140, 143, 145]
        ],
        notes: [
            "本量表仅供筛检参考，不能取代专业诊断。", // [cite: 120]
            "如有疑虑请咨询精神科医师。", // [cite: 120]
            "本平台提供的评估工具仅供参考，不能取代专业医学诊断" // [cite: 202]
        ],
        references: [
            {
                text: "Angst, J., Adolfsson, R., Benazzi, F., Gamma, A., Hantouche, E., Meyer, TD, ... & Scott, J. (2005). The HCL-32: Towards a self-assessment tool for hypomanic symptoms in outpatients. Journal of Affective Disorders, 88 (2), 217-233.", // [cite: 198, 199]
                url: "https://doi.org/10.1016/j.jad.2005.05.011" // [cite: 199]
            }
        ]
    },
    questions: [
        { id: 1, content: "我需要的睡眠比平时少。" }, // [cite: 122]
        { id: 2, content: "我感觉精力更充沛、活动更多。" }, // [cite: 125]
        { id: 3, content: "我变得更有自信。" }, // [cite: 127]
        { id: 4, content: "我更享受我的工作。" }, // [cite: 130]
        { id: 5, content: "我更喜欢社交(打更多电话、更常出门)。" }, // [cite: 132]
        { id: 6, content: "我更想去旅行，而且/或是旅行得更多。" }, // [cite: 136]
        { id: 7, content: "我开车时倾向开得更快，或冒更多风险。" }, // [cite: 140]
        { id: 8, content: "我花更多钱/花钱如流水。" }, // [cite: 143]
        { id: 9, content: "我在日常生活中(工作及/或其他活动中)冒更多风险。" }, // [cite: 145]
        { id: 10, content: "我的身体活动量更大(运动等)。" }, // [cite: 147]
        { id: 11, content: "我会计画更多的活动或专案。" }, // [cite: 149]
        { id: 12, content: "我有更多的点子、更有创造力。" }, // [cite: 151]
        { id: 13, content: "我变得比较不害羞或拘谨。" }, // [cite: 153]
        { id: 14, content: "我会穿着更鲜艳、更奢华的服饰/化妆。" }, // [cite: 155]
        { id: 15, content: "我想认识更多人，或实际上也认识了更多人。" }, // [cite: 158]
        { id: 16, content: "我对性方面更感兴趣，及/或性欲增强。" }, // [cite: 160]
        { id: 17, content: "我变得更爱调情，及/或性生活更活跃。" }, // [cite: 162]
        { id: 18, content: "我话变得更多。" }, // [cite: 164]
        { id: 19, content: "我思考得更快。" }, // [cite: 166]
        { id: 20, content: "我说话时会说更多笑话或双关语。" }, // [cite: 168]
        { id: 21, content: "我更容易分心。" }, // [cite: 170]
        { id: 22, content: "我会投入许多新的事物。" }, // [cite: 172]
        { id: 23, content: "我的思绪会从一个主题跳到另一个主题。" }, // [cite: 174]
        { id: 24, content: "我做事变得更迅速及/或更容易。" }, // [cite: 176]
        { id: 25, content: "我变得更没耐心及/或更容易被激怒。" }, // [cite: 178]
        { id: 26, content: "我可能会让别人感到筋疲力尽或恼怒。" }, // [cite: 180]
        { id: 27, content: "我更容易与人发生争吵。" }, // [cite: 182]
        { id: 28, content: "我的情绪更高昂、更乐观。" }, // [cite: 184]
        { id: 29, content: "我喝更多的咖啡。" }, // [cite: 186]
        { id: 30, content: "我抽更多的香烟。" }, // [cite: 188]
        { id: 31, content: "我喝更多的酒。" }, // [cite: 190]
        { id: 32, content: "我使用更多的药物(镇静剂、抗焦虑药、兴奋剂)。" } // [cite: 192]
    ],
    renderOptions: () => [
        { id: 1, content: "是", value: "1" }, // [cite: 123]
        { id: 2, content: "否", value: "0" } // [cite: 124]
    ]
};