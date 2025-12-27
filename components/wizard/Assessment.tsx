"use client";

import { DesignState } from "@/app/design/types";
import { cn } from "@/lib/utils";
import { Target, User, Users, MapPin, Package, BookOpen } from "lucide-react";

interface AssessmentProps {
    data: DesignState;
    updateData: (updates: Partial<DesignState>) => void;
}

export default function Assessment({ data, updateData }: AssessmentProps) {
    const grasps = data.grasps || {
        goal: "",
        role: "",
        audience: "",
        situation: "",
        product: "",
        standards: "",
    };

    const handleChange = (field: keyof typeof grasps, value: string) => {
        updateData({
            grasps: { ...grasps, [field]: value },
        });
    };

    const fields = [
        { id: "goal", label: "목표 (Goal)", icon: Target, desc: "이 수행평가의 목표는 무엇인가요?", placeholder: "예: 시의회에서 ~를 채택하도록 설득하기" },
        { id: "role", label: "역할 (Role)", icon: User, desc: "학생의 역할은 무엇인가요?", placeholder: "예: 환경 과학자" },
        { id: "audience", label: "청중 (Audience)", icon: Users, desc: "누가 결과물을 보게 되나요?", placeholder: "예: 지역 주민, 심사위원" },
        { id: "situation", label: "상황 (Situation)", icon: MapPin, desc: "어떤 맥락이나 시나리오인가요?", placeholder: "예: 마을 회관 회의에서..." },
        { id: "product", label: "결과물 (Product)", icon: Package, desc: "이해를 증명할 결과물은 무엇인가요?", placeholder: "예: 설득력 있는 연설문 및 인포그래픽" },
        { id: "standards", label: "기준 (Standards)", icon: BookOpen, desc: "성공 기준은 무엇인가요?", placeholder: "예: 설득적 언어 사용, 데이터의 정확성" },
    ] as const;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    4단계: 수행평가 설계 (GRASPS)
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    GRASPS 모델을 사용하여 실제적인 수행평가 과제를 설계합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map(({ id, label, icon: Icon, desc, placeholder }) => (
                    <div key={id} className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 group-focus-within:bg-indigo-100 group-focus-within:text-indigo-600 transition-colors">
                                <Icon className="w-4 h-4" />
                            </div>
                            <label htmlFor={id} className="font-semibold text-slate-900 dark:text-white cursor-pointer">
                                {label}
                            </label>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 min-h-[1.5em]">{desc}</p>

                        <textarea
                            id={id}
                            value={grasps[id as keyof typeof grasps]}
                            onChange={(e) => handleChange(id as keyof typeof grasps, e.target.value)}
                            placeholder={placeholder}
                            className="w-full min-h-[80px] text-sm bg-transparent border-none p-0 focus:ring-0 resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        />
                    </div>
                ))}
            </div>

            {/* Real-time sentence preview could go here if desired */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 italic">
                "당신의 목표는
                <span className="font-semibold text-slate-900 dark:text-slate-200 not-italic"> {grasps.goal || "..."} </span>
                하는 것입니다. 당신은
                <span className="font-semibold text-slate-900 dark:text-slate-200 not-italic"> {grasps.role || "..."} </span>
                로서,
                <span className="font-semibold text-slate-900 dark:text-slate-200 not-italic"> {grasps.audience || "..."}</span>에게 전달합니다.
                상황은
                <span className="font-semibold text-slate-900 dark:text-slate-200 not-italic"> {grasps.situation || "..."}</span>입니다.
                당신은
                <span className="font-semibold text-slate-900 dark:text-slate-200 not-italic"> {grasps.product || "..."} </span>(을/를) 만들어야 하며,
                평가 기준은
                <span className="font-semibold text-slate-900 dark:text-slate-200 not-italic"> {grasps.standards || "..."}</span>입니다."
            </div>
        </div>
    );
}
