import { motion } from "framer-motion";
import {
    Utensils, Car, Zap, Film, Heart, ShoppingBag, BookOpen, MoreHorizontal,
    Pencil, Trash2, TrendingUp, AlertTriangle,
} from "lucide-react";
import type { Budget } from "../../types/budget.types";

const CATEGORY_CONFIG: Record<
    string,
    { icon: React.ElementType; color: string; bg: string; ring: string }
> = {
    food:          { icon: Utensils,      color: "text-orange-600 dark:text-orange-400",  bg: "bg-orange-50 dark:bg-orange-950/60",   ring: "ring-orange-200 dark:ring-orange-800/50" },
    transport:     { icon: Car,           color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/60",     ring: "ring-blue-200 dark:ring-blue-800/50"   },
    utilities:     { icon: Zap,           color: "text-yellow-600 dark:text-yellow-400",  bg: "bg-yellow-50 dark:bg-yellow-950/60",   ring: "ring-yellow-200 dark:ring-yellow-800/50" },
    entertainment: { icon: Film,          color: "text-purple-600 dark:text-purple-400",  bg: "bg-purple-50 dark:bg-purple-950/60",   ring: "ring-purple-200 dark:ring-purple-800/50" },
    healthcare:    { icon: Heart,         color: "text-rose-600 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-950/60",     ring: "ring-rose-200 dark:ring-rose-800/50"   },
    shopping:      { icon: ShoppingBag,   color: "text-pink-600 dark:text-pink-400",    bg: "bg-pink-50 dark:bg-pink-950/60",     ring: "ring-pink-200 dark:ring-pink-800/50"   },
    education:     { icon: BookOpen,      color: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-50 dark:bg-indigo-950/60",   ring: "ring-indigo-200 dark:ring-indigo-800/50" },
    other:         { icon: MoreHorizontal,color: "text-slate-600 dark:text-slate-400",   bg: "bg-slate-50 dark:bg-slate-800",    ring: "ring-slate-200 dark:ring-slate-700"  },
};

function getBarColor(percentage: number) {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80)  return "bg-amber-500";
    return "bg-emerald-500";
}

interface BudgetCardProps {
    budget: Budget;
    onEdit: (budget: Budget) => void;
    onDelete: (id: string) => void;
    index: number;
}

export default function BudgetCard({ budget, onEdit, onDelete, index }: BudgetCardProps) {
    const cfg = CATEGORY_CONFIG[budget.category] ?? CATEGORY_CONFIG.other;
    const Icon = cfg.icon;
    const pct = Math.min(budget.percentage, 100);
    const isOver = budget.percentage >= 100;
    const isWarning = budget.percentage >= 80 && budget.percentage < 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="group relative flex flex-col gap-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-slate-700/60 backdrop-blur-xl shadow-sm shadow-slate-200/50 dark:shadow-none p-5 hover:shadow-md hover:shadow-slate-200/70 dark:hover:shadow-none transition-shadow"
        >
            {/* Over-budget badge */}
            {isOver && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950/80 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-300 dark:border dark:border-red-800/50">
                    <AlertTriangle size={10} strokeWidth={2.5} />
                    Over budget
                </div>
            )}
            {isWarning && !isOver && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-300 dark:border dark:border-amber-800/50">
                    <TrendingUp size={10} strokeWidth={2.5} />
                    Near limit
                </div>
            )}

            {/* Header row */}
            <div className="flex items-center gap-3">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ring-1 ${cfg.ring}`}>
                    <Icon size={18} className={cfg.color} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold capitalize text-slate-800 dark:text-white leading-tight">
                        {budget.category}
                    </p>
                    <p className="text-[12px] text-slate-400 font-medium">
                        {budget.percentage.toFixed(1)}% used
                    </p>
                </div>
            </div>

            {/* Amounts */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Spent</p>
                    <p className={`text-[22px] font-extrabold leading-none ${isOver ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-white"}`}>
                        ${budget.spent.toFixed(2)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Limit</p>
                    <p className="text-[17px] font-bold text-slate-500 dark:text-slate-300">${budget.limit.toFixed(2)}</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/60">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.04 + 0.1 }}
                        className={`h-full rounded-full ${getBarColor(budget.percentage)}`}
                    />
                </div>
                <p className="text-[11px] font-medium text-slate-400">
                    {budget.remaining >= 0
                        ? `$${budget.remaining.toFixed(2)} remaining`
                        : `$${Math.abs(budget.remaining).toFixed(2)} over budget`}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1 border-t border-slate-100/80 dark:border-slate-700/60">
                <button
                    onClick={() => onEdit(budget)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-700/60 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                    <Pencil size={13} strokeWidth={2.5} />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(budget._id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold text-slate-400 dark:text-slate-400 hover:bg-red-50/80 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                    <Trash2 size={13} strokeWidth={2.5} />
                    Delete
                </button>
            </div>
        </motion.div>
    );
}
