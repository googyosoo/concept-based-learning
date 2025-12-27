import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm mb-4 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            2022 개정 영어과 교육과정 기반
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
          개념기반 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            탐구학습 설계
          </span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed word-keep-all">
          개념적 이해를 돕는 깊이 있는 영어 수업을 설계하세요.
          사실, 개념, 그리고 토론 질문을 매끄럽게 연결할 수 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-left">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6 text-blue-500" />}
            title="교육과정 성취기준"
            desc="2022 개정 중·고등학교 영어과 성취기준을 손쉽게 선택하세요."
          />
          <FeatureCard
            icon={<BrainCircuit className="w-6 h-6 text-purple-500" />}
            title="개념적 연결"
            desc="개념적 렌즈를 통해 거시 개념과 미시 개념을 연결하세요."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-indigo-500" />}
            title="탐구 질문 생성"
            desc="사실적, 개념적, 토론적 질문을 체계적으로 구성하세요."
          />
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/design"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-slate-900 dark:bg-white px-8 font-medium text-white dark:text-slate-900 transition-all duration-300 hover:bg-slate-800 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            <span className="mr-2">설계 시작하기</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-400/50 group">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm break-keep">{desc}</p>
    </div>
  );
}
