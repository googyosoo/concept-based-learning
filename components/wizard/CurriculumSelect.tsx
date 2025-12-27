"use client";

import { useState } from "react";
import { DesignState } from "@/app/design/types";
import { CURRICULUM_DATA, SchoolLevel, Subject, AchievementStandard } from "@/lib/curriculum";
import { cn } from "@/lib/utils";
import { Badge, Button, Card } from "@/components/ui/minimal";
import { Check, Book, GraduationCap, School } from "lucide-react";
import { motion } from "framer-motion";

interface CurriculumSelectProps {
    data: DesignState;
    updateData: (updates: Partial<DesignState>) => void;
}

export default function CurriculumSelect({ data, updateData }: CurriculumSelectProps) {
    // Local filtered state could go here, but we can derive it
    const subjects = data.schoolLevel ? CURRICULUM_DATA[data.schoolLevel] : [];

    const handleLevelSelect = (level: SchoolLevel) => {
        updateData({
            schoolLevel: level,
            subject: null, // Reset subject when level changes
            selectedStandards: []
        });
    };

    const handleSubjectSelect = (subject: Subject) => {
        updateData({
            subject: subject,
            selectedStandards: [] // Reset standards when subject changes
        });
    };

    const toggleStandard = (standard: AchievementStandard) => {
        const isSelected = data.selectedStandards.some(s => s.code === standard.code);
        let newStandards = [];
        if (isSelected) {
            newStandards = data.selectedStandards.filter(s => s.code !== standard.code);
        } else {
            newStandards = [...data.selectedStandards, standard];
        }
        updateData({ selectedStandards: newStandards });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    1단계: 교육과정 선택
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    학교급과 과목을 선택하여 2022 개정 교육과정 성취기준을 불러옵니다.
                </p>
            </div>

            {/* 1. School Level Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    onClick={() => handleLevelSelect("middle")}
                    className={cn(
                        "cursor-pointer p-0 overflow-hidden relative group transition-all duration-300 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950",
                        data.schoolLevel === "middle"
                            ? "ring-indigo-500 scale-[1.02]"
                            : "ring-transparent hover:scale-[1.01] hover:shadow-lg opacity-80 hover:opacity-100"
                    )}
                >
                    <Card className="h-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-none">
                        <div className="flex items-start justify-between">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                <School className="w-8 h-8 text-blue-500" />
                            </div>
                            {data.schoolLevel === "middle" && (
                                <div className="bg-indigo-500 text-white rounded-full p-1"><Check className="w-4 h-4" /></div>
                            )}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">중학교</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">1~3학년군 공통 영어</p>
                        </div>
                    </Card>
                </div>

                <div
                    onClick={() => handleLevelSelect("high")}
                    className={cn(
                        "cursor-pointer p-0 overflow-hidden relative group transition-all duration-300 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950",
                        data.schoolLevel === "high"
                            ? "ring-purple-500 scale-[1.02]"
                            : "ring-transparent hover:scale-[1.01] hover:shadow-lg opacity-80 hover:opacity-100"
                    )}
                >
                    <Card className="h-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 border-none">
                        <div className="flex items-start justify-between">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                <GraduationCap className="w-8 h-8 text-purple-500" />
                            </div>
                            {data.schoolLevel === "high" && (
                                <div className="bg-purple-500 text-white rounded-full p-1"><Check className="w-4 h-4" /></div>
                            )}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">고등학교</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">고교학점제 선택 과목 (공통/일반/진로/융합)</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 2. Subject Selection */}
            {data.schoolLevel && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                        <Book className="w-5 h-5 mr-2 text-indigo-500" />
                        과목 선택
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {subjects.map((sub) => {
                            const isActive = data.subject?.id === sub.id;
                            return (
                                <button
                                    key={sub.id}
                                    onClick={() => handleSubjectSelect(sub)}
                                    className={cn(
                                        "text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                                        isActive
                                            ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105"
                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50"
                                    )}
                                >
                                    {sub.name}
                                    {sub.category !== 'common' && sub.category !== 'middle_school' && (
                                        <span className="block text-[10px] opacity-60 font-normal mt-0.5 capitalize">
                                            {sub.category}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 3. Standards Selection */}
            {data.subject && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            성취기준 ({data.selectedStandards.length})
                        </h3>
                        {data.subject.standards.length === 0 && (
                            <Badge variant="secondary" className="text-xs">DB에 성취기준 없음</Badge>
                        )}
                    </div>

                    <div className="grid gap-3">
                        {data.subject.standards.length > 0 ? (
                            (() => {
                                // Group standards
                                const grouped = data.subject.standards.reduce((acc, std) => {
                                    const group = std.group || "전체 (General)";
                                    if (!acc[group]) acc[group] = [];
                                    acc[group].push(std);
                                    return acc;
                                }, {} as Record<string, AchievementStandard[]>);

                                return Object.entries(grouped).map(([groupName, standards]) => (
                                    <div key={groupName} className="space-y-2 mb-6 last:mb-0">
                                        {Object.keys(grouped).length > 1 && (
                                            <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest pl-1 mb-2 mt-4 first:mt-0">
                                                {groupName}
                                            </h4>
                                        )}
                                        <div className="grid gap-3">
                                            {standards.map((std) => {
                                                const isSelected = data.selectedStandards.some(s => s.code === std.code);
                                                return (
                                                    <div
                                                        key={std.code}
                                                        onClick={() => toggleStandard(std)}
                                                        className={cn(
                                                            "cursor-pointer group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
                                                            isSelected
                                                                ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                                                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors",
                                                            isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-300 bg-white"
                                                        )}>
                                                            {isSelected && <Check className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Badge variant="outline" className="font-mono text-xs">{std.code}</Badge>
                                                                {std.group && Object.keys(grouped).length === 1 && (
                                                                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{std.group}</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                                {std.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ));
                            })()
                        ) : (
                            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                <p className="text-slate-500 text-sm">
                                    <b>{data.subject.name}</b> 과목의 성취기준 데이터가 아직 완벽하게 탑재되지 않았습니다.
                                    <br /> 직접 입력하거나 구글 드라이브 링크의 성취기준을 참고하세요.
                                </p>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => updateData({ selectedStandards: [{ code: "CUSTOM", description: "사용자 정의 성취기준" }] })}
                                >
                                    직접 입력 (데모용)
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
