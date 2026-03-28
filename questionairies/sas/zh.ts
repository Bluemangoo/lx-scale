import { Questionnaire } from "@/types";

export const sas: Questionnaire = {
    id: "sas",
    title: "焦虑自评量表(SAS)", // [cite: 1]
    description: "评估焦虑症状的严重程度",
    tags: ["焦虑", "自评量表", "筛查"],
    time: "5-10分钟",
    details: {
        introduction: "焦虑自评量表（Self-Rating Anxiety Scale, SAS）是由Zung于1971年编制的，用于评估焦虑症状的严重程度。该量表共20个项目。", // [cite: 31, 32]
        questionCount: "20个项目", // [cite: 32]
        evaluationTime: "通常为5-10分钟", // [cite: 16]
        instructions: "下面有20条文字，请仔细阅读每一条，把意思弄明白，然后根据您最近一周的实际感觉，在分数栏下选择与你的情况相符的选项。每个问题都有四个选择：没有或很少有、有时有、大部分时间(经常有)、绝大多数时间有。", // [cite: 3, 5]
        scoringMethod: [
            "总分：把20题的得分相加得总分，把总分乘以1.25，四舍五入取整数，即得标准分", // [cite: 9]
            "正向计分项目：1、2、3、4、6、7、8、10、11、12、14、15、16、18、20题",
            "反向计分项目：5、9、13、17、19题（倒序计分）", // [cite: 23]
            "严重程度：焦虑评定的分界值为50分，50-59分为轻度焦虑，60-69分为中度焦虑，70分以上为重度焦虑" // [cite: 10]
        ],
        dimensions: [
            { name: "认知症状", description: "如无缘无故感到担心、感到被分成几块等体验" }, // [cite: 33]
            { name: "情感症状", description: "如容易心烦意乱、感到恐慌等体验" }, // [cite: 33]
            { name: "躯体症状", description: "如头痛、颈痛、背痛、无力等身体症状" }, // [cite: 33]
            { name: "自主神经症状", description: "如心跳较快、眩晕、呼吸费力等" } // [cite: 33]
        ],
        notes: [
            "该量表适用于具有焦虑症状的成年人", // [cite: 12]
            "如果标准分超过50分，建议寻求专业心理医生的帮助", // [cite: 10]
            "该量表仅供筛查使用，不能替代专业诊断" // [cite: 41]
        ],
        references: [
            {
                text: "William WK Zung. A Rating Instrument for Anxiety Disorders. 12(6): Psychosomatics 371-379. 1971.", // [cite: 113]
                url: ""
            }
        ]
    },
    questions: [
        { id: 1, content: "我感到比往常更加神经过敏和焦虑" }, // [cite: 5]
        { id: 2, content: "我无缘无故感到担心" }, // [cite: 5]
        { id: 3, content: "我容易心烦意乱或感到恐慌" }, // [cite: 5]
        { id: 4, content: "我感到我的身体好像被分成几块,支离破碎" }, // [cite: 5]
        { id: 5, content: "我感到事事都很顺利,不会有倒霉的事情发生" }, // [cite: 5]
        { id: 6, content: "我的四肢抖动和震颤" }, // [cite: 5]
        { id: 7, content: "我因头痛、颈痛、背痛而烦恼" }, // [cite: 5]
        { id: 8, content: "我感到无力且容易疲劳" }, // [cite: 5]
        { id: 9, content: "我感到很平静,能安静坐下来" }, // [cite: 5]
        { id: 10, content: "我感到我的心跳较快" }, // [cite: 5]
        { id: 11, content: "我因阵阵的眩晕而不舒服" }, // [cite: 5]
        { id: 12, content: "我有阵阵要昏倒的感觉" }, // [cite: 5]
        { id: 13, content: "我呼吸时进气和出气都不费力" }, // [cite: 5]
        { id: 14, content: "我的手指和脚趾感到麻木和刺痛" }, // [cite: 5]
        { id: 15, content: "我因胃痛和消化不良而苦恼" }, // [cite: 5]
        { id: 16, content: "我必须时常排尿" }, // [cite: 5]
        { id: 17, content: "我的手总是很溫暖而干燥" }, // [cite: 5]
        { id: 18, content: "我觉得脸发烧发红" }, // [cite: 5]
        { id: 19, content: "我容易入睡,晚上休息很好" }, // [cite: 5]
        { id: 20, content: "我做恶梦" } // [cite: 5]
    ],
    renderOptions: () => [
        { id: 1, content: "没有或很少有", value: "1" }, // [cite: 5]
        { id: 2, content: "有时有", value: "2" }, // [cite: 5]
        { id: 3, content: "大部分时间(经常有)", value: "3" }, // [cite: 5]
        { id: 4, content: "绝大多数时间有", value: "4" } // [cite: 5]
    ]
};