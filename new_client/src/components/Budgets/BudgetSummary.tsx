import { Wallet, TrendingDown, AlertTriangle } from "lucide-react";
import type { Budget } from "../../types/budget.types";

interface BudgetSummaryProps {
    budgets: Budget[];
}

export default function BudgetSummary({ budgets }: BudgetSummaryProps) {
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const overCount = budgets.filter((b) => b.percentage >= 100).length;
    const overallPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

    const stats = [
        {
            label: "Total Budgeted",
            value: `$${totalLimit.toFixed(2)}`,
            sub: `across ${budgets.length} ${budgets.length === 1 ? "category" : "categories"}`,
            icon: Wallet,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/60",
            ring: "ring-emerald-200 dark:ring-emerald-800/50",
        },
        {
            label: "Total Spent",
            value: `$${totalSpent.toFixed(2)}`,
            sub: `${overallPct.toFixed(1)}% of total budget`,
            icon: TrendingDown,
            color: overallPct >= 100 ? "text-red-600 dark:text-red-400" : overallPct >= 80 ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400",
            bg: overallPct >= 100 ? "bg-red-50 dark:bg-red-950/60" : overallPct >= 80 ? "bg-amber-50 dark:bg-amber-950/60" : "bg-blue-50 dark:bg-blue-950/60",
            ring: overallPct >= 100 ? "ring-red-200 dark:ring-red-800/50" : overallPct >= 80 ? "ring-amber-200 dark:ring-amber-800/50" : "ring-blue-200 dark:ring-blue-800/50",
        },
        {
            label: "Over Budget",
            value: overCount.toString(),
            sub: overCount === 0 ? "All categories on track" : `${overCount} exceeded`,
            icon: AlertTriangle,
            color: overCount > 0 ? "text-red-600 dark:text-red-400" : "text-slate-400 dark:text-slate-400",
            bg: overCount > 0 ? "bg-red-50 dark:bg-red-950/60" : "bg-slate-50 dark:bg-slate-800",
            ring: overCount > 0 ? "ring-red-200 dark:ring-red-800/50" : "ring-slate-200 dark:ring-slate-700",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(({ label, value, sub, icon: Icon, color, bg, ring }) => (
                <div
                    key={label}
                    className="flex items-center gap-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-slate-700/60 backdrop-blur-xl shadow-sm shadow-slate-200/50 dark:shadow-none px-5 py-4"
                >
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${bg} ring-1 ${ring}`}>
                        <Icon size={18} className={color} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                        <p className={`text-[20px] font-extrabold leading-tight ${color}`}>{value}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
