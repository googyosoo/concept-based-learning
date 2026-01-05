"use client";

import { DesignState } from "@/app/design/types";
import { Button, Badge, Card } from "@/components/ui/minimal";
import { Download, Mail, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

import jsPDF from "jspdf";

interface FinalReviewProps {
    data: DesignState;
}

export default function FinalReview({ data }: FinalReviewProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);

    const generatePdfBlob = async (): Promise<Blob | null> => {
        if (!contentRef.current) return null;

        try {
            console.log("Starting PDF generation...");

            // Using html-to-image which supports modern CSS (Tailwind v4 lab/oklch colors)
            // It uses the browser's own rendering via SVG foreignObject
            const { toJpeg } = await import('html-to-image');

            const dataUrl = await toJpeg(contentRef.current, {
                quality: 0.95,
                backgroundColor: "#ffffff",
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = pdfHeight;
            let position = 0;

            console.log("Adding image to PDF", pdfWidth, pdfHeight);

            pdf.addImage(dataUrl, "JPEG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, "JPEG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            console.log("PDF Blob generated successfully");
            return pdf.output("blob");
        } catch (error) {
            console.error("PDF Generation failed details:", error);
            alert("PDF 생성 중 상세 오류가 발생했습니다: " + (error instanceof Error ? error.message : String(error)));
            return null;
        }
    };

    const handleDownloadPDF = async () => {
        if (!contentRef.current) return;
        setIsExporting(true);

        try {
            const blob = await generatePdfBlob();
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `lesson-plan-${data.subject?.name || "design"}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            }
        } catch {
            alert("PDF 생성 중 오류가 발생했습니다.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleEmailSend = async () => {
        if (!email) return;
        setIsSending(true);

        try {
            const blob = await generatePdfBlob();
            if (!blob) throw new Error("PDF generation failed");

            const formData = new FormData();
            formData.append("email", email);
            formData.append("file", blob, "lesson-plan.pdf");

            const response = await fetch("/api/send-email", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert(`이메일이 성공적으로 발송되었습니다: ${email}`);
                setShowEmailDialog(false);
                setEmail("");
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Email sending failed");
            }
        } catch (error) {
            console.error(error);
            alert(`이메일 발송 실패: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        설계 내용 최종 검토
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        작성한 전체 단원 설계안을 확인하고 내보내세요.
                    </p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" onClick={handleDownloadPDF} disabled={isExporting}>
                        {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        PDF 저장
                    </Button>
                    <Button onClick={() => setShowEmailDialog(true)}>
                        <Mail className="w-4 h-4 mr-2" />
                        이메일로 보내기
                    </Button>
                </div>
            </div>

            {/* Content to Print/Export */}
            <div ref={contentRef} className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 min-h-[800px]">
                <div className="mb-8 text-center border-b pb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Concept-Based Inquiry Design</h1>
                    <p className="text-slate-500">{data.subject?.name} | {data.schoolLevel === 'middle' ? '중학교' : '고등학교'}</p>
                </div>

                <div className="space-y-10">
                    {/* Section 1: Context */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">
                            1. 교육과정 맥락 (Curricular Context)
                        </h3>
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                            <h4 className="font-semibold text-slate-700 mb-3 text-sm">선택된 성취기준</h4>
                            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                {data.selectedStandards.map(s => (
                                    <li key={s.code} className="leading-relaxed">
                                        <span className="font-mono font-medium text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 mr-2">{s.code}</span>
                                        {s.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 2: Conceptual Foundation */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">
                            2. 개념적 기반 (Conceptual Foundation)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                                <div className="text-xs text-indigo-600 uppercase font-bold mb-2">거시 개념 (Macro Concept)</div>
                                <div className="text-xl font-bold text-slate-800">{data.macroConcept || "-"}</div>
                            </div>
                            <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-lg">
                                <div className="text-xs text-blue-600 uppercase font-bold mb-2">미시 개념 (Micro Concept)</div>
                                <div className="text-xl font-bold text-slate-800">{data.microConcept || "-"}</div>
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-r from-slate-50 to-white border-l-4 border-indigo-500 rounded-r-lg shadow-sm">
                            <span className="block text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">일반화 (Generalization Statement)</span>
                            <p className="text-xl font-serif italic text-slate-800 leading-relaxed">
                                &quot;학생들은 <strong className="text-indigo-700 bg-indigo-50 px-1">{data.conceptualLens}</strong>(을/를) 통해 <strong className="text-indigo-700 bg-indigo-50 px-1">{data.macroConcept}</strong>(와/과) <strong className="text-blue-700 bg-blue-50 px-1">{data.microConcept}</strong>(이)가 상호작용함을 이해한다.&quot;
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Inquiry Questions */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">
                            3. 탐구 질문 (Inquiry Questions)
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100">사실적 질문</Badge>
                                    <span className="text-xs text-slate-400">지식과 이해</span>
                                </div>
                                <ul className="list-disc list-inside text-sm space-y-1 text-slate-600 pl-2">
                                    {(data.factualQuestions || []).map((q, i) => <li key={i}>{q}</li>)}
                                </ul>
                            </div>
                            <div className="p-4 border border-indigo-100 bg-indigo-50/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">개념적 질문</Badge>
                                    <span className="text-xs text-indigo-400">연결과 전이</span>
                                </div>
                                <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 pl-2">
                                    {(data.conceptualQuestions || []).map((q, i) => <li key={i}>{q}</li>)}
                                </ul>
                            </div>
                            <div className="p-4 border border-rose-100 bg-rose-50/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-100">토론적 질문</Badge>
                                    <span className="text-xs text-rose-400">논쟁과 가치</span>
                                </div>
                                <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 pl-2">
                                    {(data.debatableQuestions || []).map((q, i) => <li key={i}>{q}</li>)}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: GRASPS */}
                    <section className="space-y-4 break-inside-avoid">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">
                            4. 수행평가 설계 (GRASPS Assessment)
                        </h3>
                        <div className="bg-white border text-sm rounded-xl overflow-hidden shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                                {Object.entries(data.grasps || {}).map(([key, val]) => (
                                    <div key={key} className="p-5">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-2 tracking-wider">{key}</div>
                                        <div className="text-slate-800 font-medium whitespace-pre-wrap">{val || "-"}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Email Dialog Overlay */}
            {showEmailDialog && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md p-6 bg-white shadow-xl space-y-6 relative">
                        <button
                            onClick={() => setShowEmailDialog(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-2 text-center">
                            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-indigo-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold">이메일로 보내기</h3>
                            <p className="text-sm text-slate-500">
                                작성하신 단원 설계안을 PDF로 변환하여<br />입력하신 이메일로 전송해 드립니다.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">받는 분 이메일</label>
                                <input
                                    type="email"
                                    placeholder="example@email.com"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={handleEmailSend}
                                    disabled={isSending || !email}
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            전송 중... (PDF 생성 포함)
                                        </>
                                    ) : (
                                        "전송하기"
                                    )}
                                </Button>
                                <Button variant="ghost" onClick={() => setShowEmailDialog(false)}>
                                    취소
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
