"use client";

import { DesignState } from "@/app/design/types";
import { cn } from "@/lib/utils";
import { BookOpen, BrainCircuit, MessageCircleQuestion, Target, CheckCircle2 } from "lucide-react";

interface ProgressSummaryProps {
    data: DesignState;
    currentStep: number;
}

export default function ProgressSummary({ data, currentStep }: ProgressSummaryProps) {
    const hasSubject = !!data.subject;
    const hasConcept = !!(data.topic || data.macroConcept || data.microConcept);
    const hasQuestions = (data.factualQuestions?.length || 0) > 0 ||
        (data.conceptualQuestions?.length || 0) > 0 ||
        (data.debatableQuestions?.length || 0) > 0;
    const hasAssessment = !!(data.grasps?.goal || data.grasps?.role);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-24 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">설계 현황</h3>
            </div>

            {/* Step 1: Subject */}
            <SummaryItem
                icon={BookOpen}
                label="교육과정"
                isActive={currentStep === 1}
                isCompleted={hasSubject}
            >
                {data.subject ? (
                    <div className="text-sm">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{data.subject.name}</p>
                        <p className="text-xs text-slate-500 mt-1">성취기준 {data.selectedStandards.length}개 선택됨</p>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">과목을 선택해주세요</span>
                )}
            </SummaryItem>

            {/* Step 2: Concept */}
            <SummaryItem
                icon={BrainCircuit}
                label="개념적 설계"
                isActive={currentStep === 2}
                isCompleted={hasConcept}
            >
                {hasConcept ? (
                    <div className="space-y-2 text-sm">
                        {data.topic && (
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-xs">토픽</span>
                                <span className="text-slate-800 dark:text-slate-200 font-medium">{data.topic}</span>
                            </div>
                        )}
                        {data.conceptualLens && (
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-xs">렌즈</span>
                                <span className="text-slate-800 dark:text-slate-200 font-medium">{data.conceptualLens}</span>
                            </div>
                        )}
                        {data.generalization && (
                            <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400 italic">
                                "{data.generalization}"
                            </div>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">개념을 설계해주세요</span>
                )}
            </SummaryItem>

            {/* Step 3: Inquiry */}
            <SummaryItem
                icon={MessageCircleQuestion}
                label="탐구 질문"
                isActive={currentStep === 3}
                isCompleted={hasQuestions}
            >
                {hasQuestions ? (
                    <div className="flex gap-2 text-xs">
                        <Badge count={data.factualQuestions?.length} color="bg-slate-100 text-slate-600" label="사실" />
                        <Badge count={data.conceptualQuestions?.length} color="bg-indigo-100 text-indigo-600" label="개념" />
                        <Badge count={data.debatableQuestions?.length} color="bg-rose-100 text-rose-600" label="토론" />
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">질문을 작성해주세요</span>
                )}
            </SummaryItem>

            {/* Step 4: Assessment */}
            <SummaryItem
                icon={Target}
                label="수행평가 (GRASPS)"
                isActive={currentStep === 4}
                isCompleted={hasAssessment}
            >
                {hasAssessment ? (
                    <div className="text-sm space-y-1">
                        <p className="line-clamp-1"><span className="text-slate-500 text-xs mr-2">목표</span> {data.grasps?.goal}</p>
                        <p className="line-clamp-1"><span className="text-slate-500 text-xs mr-2">결과물</span> {data.grasps?.product}</p>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">평가를 설계해주세요</span>
                )}
            </SummaryItem>
        </div>
    );
}

function SummaryItem({ icon: Icon, label, children, isActive, isCompleted }: any) {
    return (
        <div className={cn(
            "relative pl-4 transition-all duration-300",
            isActive ? "opacity-100" : isCompleted ? "opacity-70 hover:opacity-100" : "opacity-40"
        )}>
            {/* Connector Line */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-colors",
                isActive ? "bg-indigo-500" : isCompleted ? "bg-slate-300 dark:bg-slate-600" : "bg-slate-100 dark:bg-slate-800"
            )} />

            <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("w-4 h-4", isActive || isCompleted ? "text-indigo-500" : "text-slate-400")} />
                <span className={cn("text-xs font-bold uppercase tracking-wider", isActive || isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400")}>
                    {label}
                </span>
            </div>

            <div className="pl-6">
                {children}
            </div>
        </div>
    );
}

function Badge({ count = 0, color, label }: any) {
    if (count === 0) return null;
    return (
        <span className={cn("px-2 py-1 rounded-md font-medium", color)}>
            {label} {count}
        </span>
    );
}
