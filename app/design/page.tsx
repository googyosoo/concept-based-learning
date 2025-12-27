"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";

import CurriculumSelect from "@/components/wizard/CurriculumSelect";
import ConceptDesign from "@/components/wizard/ConceptDesign";
import InquiryQuestions from "@/components/wizard/InquiryQuestions";
import Assessment from "@/components/wizard/Assessment";
import ProgressSummary from "@/components/wizard/ProgressSummary";
import FinalReview from "@/components/wizard/FinalReview";

import { STEPS, DesignState } from "@/app/design/types";

export default function DesignPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<DesignState>({
        schoolLevel: "",
        subject: null,
        selectedStandards: [],
        factualQuestions: [],
        conceptualQuestions: [],
        debatableQuestions: [],
        grasps: { goal: "", role: "", audience: "", situation: "", product: "", standards: "" }
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return !!data.subject && data.selectedStandards.length > 0;
            case 2:
                // Validation: Need Topic, M, M, Lens
                return !!(data.topic && data.conceptualLens && data.macroConcept && data.microConcept);
            case 3:
                // Validation: At least one question? (Optional but recommended)
                return (data.factualQuestions?.length || 0) > 0 ||
                    (data.conceptualQuestions?.length || 0) > 0 ||
                    (data.debatableQuestions?.length || 0) > 0;
            case 4:
                // Validation: GRASPS check (optional)
                return true;
            case 5:
                return true;
            default:
                return true;
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Progress Stepper */}
            <div className="w-full">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10" />
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 -z-10 transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />

                    {STEPS.map((step) => {
                        const isCompleted = step.id < currentStep;
                        const isCurrent = step.id === currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-950 px-2">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isCompleted ? "bg-indigo-500 border-indigo-500 text-white" :
                                            isCurrent ? "bg-white dark:bg-slate-900 border-indigo-500 text-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]" :
                                                "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : <span>{step.id}</span>}
                                </div>
                                <div className="hidden md:flex flex-col items-center text-center">
                                    <span className={cn(
                                        "text-sm font-bold",
                                        isCurrent ? "text-indigo-600 dark:text-indigo-400" :
                                            isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400"
                                    )}>
                                        {step.title}
                                    </span>
                                    <span className="text-xs text-slate-500">{step.desc}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content Area */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="min-h-[500px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex flex-col"
                            >
                                {currentStep === 1 && (
                                    <CurriculumSelect
                                        data={data}
                                        updateData={(updates) => setData({ ...data, ...updates })}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <ConceptDesign
                                        data={data}
                                        updateData={(updates) => setData({ ...data, ...updates })}
                                    />
                                )}
                                {currentStep === 3 && (
                                    <InquiryQuestions
                                        data={data}
                                        updateData={(updates) => setData({ ...data, ...updates })}
                                    />
                                )}
                                {currentStep === 4 && (
                                    <Assessment
                                        data={data}
                                        updateData={(updates) => setData({ ...data, ...updates })}
                                    />
                                )}
                                {currentStep === 5 && (
                                    <FinalReview
                                        data={data}
                                    />
                                )}

                                {/* Fallback */}
                                {currentStep > 5 && (
                                    <div className="flex-1 flex items-center justify-center">
                                        <p className="text-slate-500">Step {currentStep} Content Coming Soon...</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                            이전
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={!isStepValid(currentStep)}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-medium flex items-center text-white transition-all shadow-md hover:shadow-lg transform active:scale-95",
                                isStepValid(currentStep)
                                    ? "bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                    : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                            )}
                        >
                            {currentStep === STEPS.length ? "완료" : "다음 단계"}
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Sidebar Summary */}
                <div className="hidden lg:block lg:col-span-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <ProgressSummary data={data} currentStep={currentStep} />
                </div>
            </div>
        </div>
    );
}
