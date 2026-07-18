import { PiggyBank, Target, Trophy } from "lucide-react";
import type { Goal } from "../../types/goal.types";

interface GoalSummaryProps { goals: Goal[] }

export default function GoalSummary({ goals }: GoalSummaryProps) {
    const target = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const saved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const completed = goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length;
    const percentage = target ? Math.min(Math.round(saved / target * 100), 100) : 0;

    return (
        <section className="rounded-2xl border border-white/80 bg-white/78 px-5 py-4 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/72 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div>
                    <div className="flex flex-wrap items-end justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"><PiggyBank size={19} /></div>
                            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Total savings</p><p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">${saved.toLocaleString()} <span className="text-xs font-bold text-slate-400">of ${target.toLocaleString()}</span></p></div>
                        </div>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{percentage}%</p>
                    </div>
                    <div role="progressbar" aria-label="Overall savings progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} /></div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 lg:border-l lg:border-slate-100 lg:pl-5 dark:lg:border-slate-700/70">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2.5 dark:border-transparent dark:bg-slate-800/70"><Target size={16} className="text-emerald-500" /><div><p className="text-lg font-black leading-none text-slate-800 dark:text-white">{goals.length}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700/60 dark:text-slate-400">Goals</p></div></div>
                    <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2.5 dark:border-transparent dark:bg-slate-800/70"><Trophy size={16} className="text-amber-500" /><div><p className="text-lg font-black leading-none text-slate-800 dark:text-white">{completed}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-amber-700/60 dark:text-slate-400">Completed</p></div></div>
                </div>
            </div>
        </section>
    );
}
