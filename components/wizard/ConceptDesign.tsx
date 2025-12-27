"use client";

import { DesignState } from "@/app/design/types";
import { Badge, Button, Card } from "@/components/ui/minimal";
import { cn } from "@/lib/utils";
import { Lightbulb, Search, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface ConceptDesignProps {
    data: DesignState;
    updateData: (updates: Partial<DesignState>) => void;
}

const COMMON_LENSES = [
    "구조 (Structure)", "기능 (Function)", "변화 (Change)", "인과 (Causality)",
    "시스템 (System)", "패턴 (Pattern)", "관점 (Perspective)", "문화 (Culture)",
    "정체성 (Identity)", "지속가능성 (Sustainability)", "권력 (Power)", "의사소통 (Communication)"
];

const MACRO_CONCEPTS_EXAMPLES = [
    "환경", "정의", "갈등", "혁신", "관계", "발견"
];

export default function ConceptDesign({ data, updateData }: ConceptDesignProps) {
    const [showExamples, setShowExamples] = useState(false);

    useEffect(() => {
        if (data.macroConcept && data.microConcept && data.conceptualLens) {
            const gen = `학생들은 ${data.conceptualLens}(을/를) 통해 ${data.macroConcept}(와/과) ${data.microConcept}(이)가 상호작용함을 이해한다.`;
            // Only update if changed to avoid loop
            if (data.generalization !== gen) {
                updateData({ generalization: gen });
            }
        }
    }, [data.macroConcept, data.microConcept, data.conceptualLens, data.generalization, updateData]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        2단계: 개념 설계 (TMF)
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        토픽, 거시 개념, 미시 개념을 정의하여 개념적 기반을 다집니다.
                    </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowExamples(!showExamples)}>
                    <Info className="w-4 h-4 mr-2" />
                    {showExamples ? "예시 숨기기" : "예시 보기"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: TMF Inputs */}
                <div className="space-y-6">

                    {/* 1. Topic */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded mr-2 text-xs">사실적</span>
                            Topic (토픽)
                        </label>
                        <input
                            type="text"
                            value={data.topic || ""}
                            onChange={(e) => updateData({ topic: e.target.value })}
                            placeholder="예: 인공지능, 기후 변화, K-Pop"
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                        {showExamples && <p className="text-xs text-slate-500">학습의 구체적인 내용이나 주제입니다.</p>}
                    </div>

                    {/* 2. Conceptual Lens */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
                            <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded mr-2 text-xs">렌즈</span>
                            Conceptual Lens (개념적 렌즈)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {COMMON_LENSES.map(lens => (
                                <button
                                    key={lens}
                                    onClick={() => updateData({ conceptualLens: lens })}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                        data.conceptualLens === lens
                                            ? "bg-purple-500 text-white border-purple-500"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
                                    )}
                                >
                                    {lens}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={data.conceptualLens || ""}
                            onChange={(e) => updateData({ conceptualLens: e.target.value })}
                            placeholder="또는 직접 입력하세요..."
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                    </div>

                    {/* 3. Concepts */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
                                <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded mr-2 text-xs">넓이</span>
                                Macro Concepts (거시적 개념)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.macroConcept || ""}
                                    onChange={(e) => updateData({ macroConcept: e.target.value })}
                                    placeholder="예: 변화, 시스템, 권력"
                                    className="w-full p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
                                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded mr-2 text-xs">깊이</span>
                                Micro Concepts (미시적/교과 개념)
                            </label>
                            <input
                                type="text"
                                value={data.microConcept || ""}
                                onChange={(e) => updateData({ microConcept: e.target.value })}
                                placeholder="예: 생태계, 알고리즘, 대사작용"
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Generalization Preview or Helper */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">일반화 문장 만들기</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                            <span className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Generalization (일반화)</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 italic min-h-[3rem]">
                                {data.macroConcept && data.microConcept && data.conceptualLens ? (
                                    <>
                                        학생들은
                                        <span className="text-purple-600 font-medium"> {data.conceptualLens}</span>(을/를) 통해
                                        <span className="text-indigo-600 font-medium"> {data.macroConcept}</span>(와/과)
                                        <span className="text-blue-600 font-medium"> {data.microConcept}</span>(이)가 상호작용함을 이해한다.
                                    </>
                                ) : (
                                    "개념을 입력하면 일반화 문장이 생성됩니다..."
                                )}
                            </p>
                        </div>

                        {showExamples && (
                            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm space-y-2">
                                <p><strong>예시:</strong></p>
                                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>Topic: <span className="text-slate-900">로미오와 줄리엣</span></li>
                                    <li>Lens: <span className="text-purple-600">관점</span></li>
                                    <li>Macro: <span className="text-indigo-600">갈등</span></li>
                                    <li>Micro: <span className="text-blue-600">비극</span></li>
                                    <li className="italic text-xs mt-2 text-slate-500">
                                        "서로 다른 관점의 갈등이 어떻게 비극을 초래하는지 이해한다."
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
