import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DesignLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container flex h-14 max-w-screen-2xl items-center px-4">
                    <Link
                        href="/"
                        className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        홈으로 돌아가기
                    </Link>
                    <div className="ml-auto flex items-center space-x-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            CBI 수업 설계 스튜디오
                        </span>
                    </div>
                </div>
            </header>
            <main className="container max-w-screen-xl py-6 md:py-10 px-4 mx-auto">
                {children}
            </main>
        </div>
    );
}
