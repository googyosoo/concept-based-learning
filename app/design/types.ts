import { SchoolLevel, Subject, AchievementStandard } from "@/lib/curriculum";

// Step Definitions
export const STEPS = [
    { id: 1, title: "교육과정", desc: "교과 및 성취기준 선택" },
    { id: 2, title: "개념 설계", desc: "개념 및 렌즈 설정" },
    { id: 3, title: "탐구 질문", desc: "질문 만들기" },
    { id: 4, title: "평가", desc: "GRASPS 설계" },
    { id: 5, title: "검토", desc: "최종 확인" },
];

export type DesignState = {
    schoolLevel: SchoolLevel | "";
    subject: Subject | null;
    selectedStandards: AchievementStandard[];

    // Step 2: Concepts
    topic?: string;
    conceptualLens?: string;
    macroConcept?: string;
    microConcept?: string;

    // Step 3: Inquiry Questions
    factualQuestions?: string[];
    conceptualQuestions?: string[];
    debatableQuestions?: string[];

    // Step 4: GRASPS
    grasps?: {
        goal: string;
        role: string;
        audience: string;
        situation: string;
        product: string;
        standards: string;
    };
    generalization?: string; // Calculated Generalization Statement
};
