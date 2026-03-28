import { Questionnaire } from "@/types";

export const sas: Questionnaire = {
    id: "sas",
    title: "Zung Self-Rating Anxiety Scale (SAS)", // [cite: 27]
    description: "Assessment of the severity of anxiety symptoms", // [cite: 31]
    tags: ["Anxiety", "Self-assessment", "Screening"],
    time: "5-10 minutes",
    details: {
        introduction: "The Zung Self-Rating Anxiety Scale (SAS) is a psychological assessment tool designed to quantify a person's level of anxiety. Developed by Dr. William W. K. Zung in 1971, the scale aims to measure the severity of anxiety symptoms in individuals.", // [cite: 30, 31]
        questionCount: "20 items", // [cite: 32]
        evaluationTime: "Usually 5-10 minutes",
        instructions: "For each item below, please check the column which best describes how often you felt or behaved this way during the past several days. Options range from 'A Little Of The Time' to 'Most Of The Time'.", // [cite: 43, 44]
        scoringMethod: [
            "Total Score: Sum of all 20 items, then multiply by 1.25 to get the standard score", // [cite: 9, 22]
            "Positive items: 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16, 18, 20 (scored normally)",
            "Negative items: 5, 9, 13, 17, 19 (reverse scored)", // [cite: 23]
            "Severity: Standard score 50-59 = mild anxiety, 60-69 = moderate anxiety, 70+ = severe anxiety" // [cite: 10]
        ],
        dimensions: [
            { name: "Cognitive Symptoms", description: "Worry, fear, or feeling of falling apart" }, // [cite: 33]
            { name: "Affective Symptoms", description: "Nervousness, upset, or panicky feelings" }, // [cite: 33]
            { name: "Somatic Symptoms", description: "Headaches, back pain, weakness, and fatigue" }, // [cite: 33]
            { name: "Autonomic Symptoms", description: "Palpitations, breathing difficulties, or sweating" } // [cite: 33]
        ],
        notes: [
            "This scale is suitable for adults with anxiety symptoms", // [cite: 12]
            "If the standard score is 50 or above, professional help is recommended", // [cite: 10]
            "This scale is for screening purposes only and cannot replace professional diagnosis" // [cite: 41]
        ],
        references: [
            {
                text: "William WK Zung. A Rating Instrument for Anxiety Disorders. 12(6): Psychosomatics 371-379. 1971.", // [cite: 113]
                url: ""
            }
        ]
    },
    questions: [
        { id: 1, content: "I feel more nervous and anxious than usual." }, // [cite: 44]
        { id: 2, content: "I feel afraid for no reason at all." }, // [cite: 44]
        { id: 3, content: "I get upset easily or feel panicky." }, // [cite: 44]
        { id: 4, content: "I feel like I'm falling apart and going to pieces." }, // [cite: 44]
        { id: 5, content: "I feel that everything is all right and nothing bad will happen." }, // [cite: 44]
        { id: 6, content: "My arms and legs shake and tremble." }, // [cite: 44]
        { id: 7, content: "I am bothered by headaches neck and back pain." }, // [cite: 44]
        { id: 8, content: "I feel weak and get tired easily." }, // [cite: 45]
        { id: 9, content: "I feel calm and can sit still easily." }, // [cite: 46]
        { id: 10, content: "I can feel my heart beating fast." }, // [cite: 47]
        { id: 11, content: "I am bothered by dizzy spells." }, // [cite: 48]
        { id: 12, content: "I have fainting spells or feel like it." }, // [cite: 49]
        { id: 13, content: "I can breathe in and out easily." }, // [cite: 50]
        { id: 14, content: "I get numbness and tingling in my fingers and toes." }, // [cite: 51, 52]
        { id: 15, content: "I am bothered by stomach aches or indigestion." }, // [cite: 53]
        { id: 16, content: "I have to empty my bladder often." }, // [cite: 54]
        { id: 17, content: "My hands are usually dry and warm." }, // [cite: 55]
        { id: 18, content: "My face gets hot and blushes." }, // [cite: 56]
        { id: 19, content: "I fall asleep easily and get a good night's rest." }, // [cite: 57]
        { id: 20, content: "I have nightmares." } // [cite: 58]
    ],
    renderOptions: () => [
        { id: 1, content: "A Little Of The Time", value: "1" }, // [cite: 44]
        { id: 2, content: "Some Of The Time", value: "2" }, // [cite: 44]
        { id: 3, content: "Good Part Of The Time", value: "3" }, // [cite: 44]
        { id: 4, content: "Most Of The Time", value: "4" } // [cite: 44]
    ]
};