import { Wallet, Target, Trophy } from "lucide-react";
import type { Goal } from "../../types/goal.types";

interface GoalSummaryProps {
    goals: Goal[];
}

export default function GoalSummary({ goals }: GoalSummaryProps) {
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const completedCount = goals.filter((g) => g.currentAmount >= g.targetAmount).length;
    const overallPercentage = totalTarget > 0 ? Math.min(Math.round((totalSaved / totalTarget) * 100), 100) : 0;

    const stats = [
        {
            label: "Total Saved",
            value: `$${totalSaved.toLocaleString()}`,
            sub: `across ${goals.length} ${goals.length === 1 ? "active goal" : "active goals"}`,
            icon: Wallet,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/60",
            ring: "ring-emerald-200 dark:ring-emerald-800/50",
        },
        {
            label: "Target Amount",
            value: `$${totalTarget.toLocaleString()}`,
            sub: `${overallPercentage}% overall progress`,
            icon: Target,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/60",
            ring: "ring-blue-200 dark:ring-blue-800/50",
        },
        {
            label: "Milestones Reached",
            value: completedCount.toString(),
            sub: completedCount > 0 ? "Awesome achievement!" : "Keep pushing forward",
            icon: Trophy,
            color: completedCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400",
            bg: completedCount > 0 ? "bg-amber-50 dark:bg-amber-950/60" : "bg-slate-50 dark:bg-slate-800",
            ring: completedCount > 0 ? "ring-amber-200 dark:ring-amber-800/50" : "ring-slate-200 dark:ring-slate-700",
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
