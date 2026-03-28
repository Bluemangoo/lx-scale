import { Questionnaire } from "@/types";

export const hcl32: Questionnaire = {
    id: "hcl32",
    title: "HCL-32 Questionnaire", // [cite: 205]
    description: "Assess the characteristics of the 'high' periods", // [cite: 207]
    tags: ["Bipolar Disorder", "Hypomania", "Self-assessment", "Screening"],
    time: "5-10 minutes",
    details: {
        introduction: "At different times in their life everyone experiences changes or swings in energy, activity and mood ('highs and lows' or 'ups and downs'). The aim of this questionnaire is to assess the characteristics of the 'high' periods.", // [cite: 206, 207]
        questionCount: "32 items",
        evaluationTime: "Usually 5-10 minutes",
        instructions: "Please try to remember a period when you were in a 'high' state (while not using drugs or alcohol). In such a state, please answer whether you agree with the following statements.", // [cite: 223, 224]
        scoringMethod: [
            "Total Score: Count the number of 'Yes' responses",
            "Screening threshold: A score of 14 or higher typically indicates potential hypomanic symptoms" // [cite: 200]
        ],
        dimensions: [
            { name: "Energy & Activity", description: "Assessment of decreased need for sleep, increased energy and activity levels" }, // [cite: 225, 228, 255]
            { name: "Mood & Social Interaction", description: "Assessment of self-confidence, sociability, and overall optimism" }, // [cite: 231, 237, 314]
            { name: "Impulsivity & Risk", description: "Evaluation of risk-taking behaviors, increased spending, and impulsivity" } // [cite: 245, 249, 251]
        ],
        notes: [
            "This tool is for educational purposes only and should not replace professional medical advice." // [cite: 330, 331]
        ],
        references: [
            {
                text: "Angst, J., Adolfsson, R., Benazzi, F., Gamma, A., Hantouche, E., Meyer, TD, ... & Scott, J. (2005). The HCL-32: Towards a self-assessment tool for hypomanic symptoms in outpatients. Journal of Affective Disorders, 88 (2), 217-233.", // [cite: 198, 199]
                url: "https://doi.org/10.1016/j.jad.2005.05.011" // [cite: 199]
            }
        ]
    },
    questions: [
        { id: 1, content: "I need less sleep" }, // [cite: 225]
        { id: 2, content: "I feel more energetic and more active" }, // [cite: 228]
        { id: 3, content: "I am more self-confident" }, // [cite: 231]
        { id: 4, content: "I enjoy my work more" }, // [cite: 234]
        { id: 5, content: "I am more sociable (make more phone calls, go out more)" }, // [cite: 237, 240]
        { id: 6, content: "I want to travel and/or do travel more" }, // [cite: 241]
        { id: 7, content: "I tend to drive faster or take more risks when driving" }, // [cite: 245, 248]
        { id: 8, content: "I spend more money/too much money" }, // [cite: 249]
        { id: 9, content: "I take more risks in my daily life (in my work and/or other activities)" }, // [cite: 251, 254]
        { id: 10, content: "I am physically more active (sport etc.)" }, // [cite: 255]
        { id: 11, content: "I plan more activities or projects" }, // [cite: 257]
        { id: 12, content: "I have more ideas, I am more creative" }, // [cite: 260]
        { id: 13, content: "I am less shy or inhibited" }, // [cite: 262]
        { id: 14, content: "I wear more colourful and more extravagant clothes/make-up" }, // [cite: 266, 270]
        { id: 15, content: "I want to meet or actually do meet more people" }, // [cite: 271]
        { id: 16, content: "I am more interested in sex, and/or have increased sexual desire" }, // [cite: 274]
        { id: 17, content: "I am more flirtatious and/or am more sexually active" }, // [cite: 277]
        { id: 18, content: "I talk more" }, // [cite: 282]
        { id: 19, content: "I think faster" }, // [cite: 284]
        { id: 20, content: "I make more jokes or puns when I am talking" }, // [cite: 287]
        { id: 21, content: "I am more easily distracted" }, // [cite: 290]
        { id: 22, content: "I engage in lots of new things" }, // [cite: 295]
        { id: 23, content: "My thoughts jump from topic to topic" }, // [cite: 298]
        { id: 24, content: "I do things more quickly and/or more easily" }, // [cite: 300]
        { id: 25, content: "I am more impatient and/or get irritable more easily" }, // [cite: 302]
        { id: 26, content: "I can be exhausting or irritating for others" }, // [cite: 306]
        { id: 27, content: "I get into more quarrels" }, // [cite: 310]
        { id: 28, content: "My mood is higher, more optimistic" }, // [cite: 314]
        { id: 29, content: "I drink more coffee" }, // [cite: 318]
        { id: 30, content: "I smoke more cigarettes" }, // [cite: 321]
        { id: 31, content: "I drink more alcohol" }, // [cite: 323]
        { id: 32, content: "I take more drugs (sedatives, anti-anxiety pills, stimulants)" } // [cite: 325]
    ],
    renderOptions: () => [
        { id: 1, content: "Yes", value: "1" }, // [cite: 226]
        { id: 2, content: "No", value: "0" } // [cite: 227]
    ]
};