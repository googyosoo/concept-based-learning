"use client";

import { DesignState } from "@/app/design/types";
import { Button, Card, Badge } from "@/components/ui/minimal";
import { cn } from "@/lib/utils";
import { Plus, X, Sparkles, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";

interface InquiryQuestionsProps {
    data: DesignState;
    updateData: (updates: Partial<DesignState>) => void;
}

type QuestionType = "factual" | "conceptual" | "debatable";

export default function InquiryQuestions({ data, updateData }: InquiryQuestionsProps) {
    const [activeTab, setActiveTab] = useState<QuestionType>("factual");
    const [inputVal, setInputVal] = useState("");

    const questions = {
        factual: data.factualQuestions || [],
        conceptual: data.conceptualQuestions || [],
        debatable: data.debatableQuestions || [],
    };

    const explanations = {
        factual: {
            label: "사실적 질문 (Factual)",
            color: "text-slate-600 bg-slate-100",
            desc: "사실과 지식에 기반한 질문입니다. 정해진 답이 있습니다.",
            example: "비극적 영웅의 주요 특징은 무엇인가?"
        },
        conceptual: {
            label: "개념적 질문 (Conceptual)",
            color: "text-indigo-600 bg-indigo-100",
            desc: "개념들을 연결하는 질문입니다. 시간과 문화를 초월하여 적용 가능합니다.",
            example: "갈등은 어떻게 인간의 조건을 드러내는가?"
        },
        debatable: {
            label: "토론적 질문 (Debatable)",
            color: "text-rose-600 bg-rose-100",
            desc: "다양한 관점과 논의를 이끌어내는 질문입니다. 하나의 정답이 없습니다.",
            example: "비극은 인간 존재의 피할 수 없는 부분인가?"
        }
    };

    const addQuestion = () => {
        if (!inputVal.trim()) return;

        const currentList = questions[activeTab];
        const updates: Partial<DesignState> = {};

        if (activeTab === "factual") updates.factualQuestions = [...currentList, inputVal];
        if (activeTab === "conceptual") updates.conceptualQuestions = [...currentList, inputVal];
        if (activeTab === "debatable") updates.debatableQuestions = [...currentList, inputVal];

        updateData(updates);
        setInputVal("");
    };

    const removeQuestion = (type: QuestionType, index: number) => {
        const list = questions[type];
        const newList = list.filter((_, i) => i !== index);
        const updates: Partial<DesignState> = {};

        if (type === "factual") updates.factualQuestions = newList;
        if (type === "conceptual") updates.conceptualQuestions = newList;
        if (type === "debatable") updates.debatableQuestions = newList;

        updateData(updates);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    3단계: 탐구 질문 (Inquiry)
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    학생의 탐구를 이끌 질문을 작성하세요. 사실적, 개념적, 토론적 질문을 균형 있게 구성합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Input Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {(["factual", "conceptual", "debatable"] as QuestionType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={cn(
                                    "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize",
                                    activeTab === type
                                        ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                {type === 'factual' ? '사실적' : type === 'conceptual' ? '개념적' : '토론적'}
                            </button>
                        ))}
                    </div>

                    <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className={cn("absolute top-0 left-0 w-1 h-full", explanations[activeTab].color.replace("text-", "bg-").replace("bg-", "text-transparent "))} /> {/* Hacky color mapping */}

                        <div className="mb-4">
                            <Badge variant="secondary" className={cn("mb-2", explanations[activeTab].color)}>
                                {explanations[activeTab].label}
                            </Badge>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {explanations[activeTab].desc}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                                placeholder={`예: ${explanations[activeTab].example}`}
                                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <Button onClick={addQuestion} disabled={!inputVal.trim()}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button className="text-xs text-indigo-500 flex items-center hover:underline opacity-50 cursor-not-allowed" title="AI Implementation coming next">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI 질문 제안 (Coming Soon)
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right: Summary List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                        <MessageCircleQuestion className="w-5 h-5 mr-2 text-slate-400" />
                        작성된 질문
                    </h3>

                    <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {(["factual", "conceptual", "debatable"] as QuestionType[]).map((type) => (
                            <div key={type} className="space-y-2">
                                {questions[type].length > 0 && (
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4 first:mt-0">
                                        {type === 'factual' ? '사실적' : type === 'conceptual' ? '개념적' : '토론적'}
                                    </div>
                                )}
                                {questions[type].map((q, idx) => (
                                    <div key={idx} className="group flex items-start justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm">
                                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{q}</span>
                                        <button
                                            onClick={() => removeQuestion(type, idx)}
                                            className="ml-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {Object.values(questions).every(q => q.length === 0) && (
                            <div className="text-center py-10 text-slate-400 text-sm">
                                아직 작성된 질문이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
