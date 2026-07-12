import { AlertTriangle, CheckCircle2, CircleDollarSign, TrendingDown, Wallet } from "lucide-react";
import type { Budget } from "../../types/budget.types";

interface BudgetSummaryProps { budgets: Budget[] }

export default function BudgetSummary({ budgets }: BudgetSummaryProps) {
    const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const remaining = totalLimit - totalSpent;
    const percentage = totalLimit ? (totalSpent / totalLimit) * 100 : 0;
    const displayPercentage = Math.min(Math.round(percentage), 100);
    const overCount = budgets.filter((budget) => budget.percentage >= 100).length;
    const warningCount = budgets.filter((budget) => budget.percentage >= 80 && budget.percentage < 100).length;
    const ringColor = percentage >= 100 ? "#ef4444" : percentage >= 80 ? "#f59e0b" : "#10b981";

    return (
        <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-sm shadow-slate-200/60 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-none">
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[220px_1fr] lg:items-center">
                <div className="flex items-center justify-center gap-5 border-b border-slate-100 pb-6 lg:border-b-0 lg:border-r lg:pb-0 dark:border-slate-700/70">
                    <div
                        className="relative grid size-32 shrink-0 place-items-center rounded-full"
                        style={{ background: `conic-gradient(${ringColor} ${displayPercentage * 3.6}deg, rgba(148,163,184,.18) 0deg)` }}
                        aria-label={`${Math.round(percentage)} percent of monthly budget used`}
                    >
                        <div className="grid size-[102px] place-items-center rounded-full bg-white dark:bg-slate-900">
                            <div className="text-center">
                                <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{Math.round(percentage)}%</p>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">used</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Monthly spending health</p>
                            <h2 className="mt-1 text-xl font-black text-slate-800 dark:text-white">
                                {percentage >= 100 ? "Your plan needs attention" : percentage >= 80 ? "You’re approaching your limit" : "Your spending is on track"}
                            </h2>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${percentage >= 100 ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300" : percentage >= 80 ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"}`}>
                            {percentage >= 80 ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                            {percentage >= 100 ? `${overCount} over budget` : percentage >= 80 ? `${warningCount + overCount} need attention` : "Healthy plan"}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        {[
                            { label: "Budgeted", value: totalLimit, icon: Wallet, color: "text-slate-700 dark:text-slate-200" },
                            { label: "Spent", value: totalSpent, icon: TrendingDown, color: "text-blue-600 dark:text-blue-400" },
                            { label: remaining >= 0 ? "Remaining" : "Overspent", value: Math.abs(remaining), icon: CircleDollarSign, color: remaining >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400" },
                            { label: "Categories", value: budgets.length, icon: CheckCircle2, color: "text-violet-600 dark:text-violet-400", count: true },
                        ].map(({ label, value, icon: Icon, color, count }) => (
                            <div key={label} className="rounded-2xl bg-slate-50/80 p-3.5 dark:bg-slate-800/65">
                                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400"><Icon size={14} />{label}</div>
                                <p className={`text-lg font-black ${color}`}>{count ? value : `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
