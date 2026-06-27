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
    food:          { icon: Utensils,      color: "text-orange-600",  bg: "bg-orange-50",   ring: "ring-orange-200" },
    transport:     { icon: Car,           color: "text-blue-600",    bg: "bg-blue-50",     ring: "ring-blue-200"   },
    utilities:     { icon: Zap,           color: "text-yellow-600",  bg: "bg-yellow-50",   ring: "ring-yellow-200" },
    entertainment: { icon: Film,          color: "text-purple-600",  bg: "bg-purple-50",   ring: "ring-purple-200" },
    healthcare:    { icon: Heart,         color: "text-rose-600",    bg: "bg-rose-50",     ring: "ring-rose-200"   },
    shopping:      { icon: ShoppingBag,   color: "text-pink-600",    bg: "bg-pink-50",     ring: "ring-pink-200"   },
    education:     { icon: BookOpen,      color: "text-indigo-600",  bg: "bg-indigo-50",   ring: "ring-indigo-200" },
    other:         { icon: MoreHorizontal,color: "text-slate-600",   bg: "bg-slate-50",    ring: "ring-slate-200"  },
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
            className="group relative flex flex-col gap-4 rounded-2xl bg-white/70 border border-white/60 backdrop-blur-xl shadow-sm shadow-slate-200/50 p-5 hover:shadow-md hover:shadow-slate-200/70 transition-shadow"
        >
            {/* Over-budget badge */}
            {isOver && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-600">
                    <AlertTriangle size={10} strokeWidth={2.5} />
                    Over budget
                </div>
            )}
            {isWarning && !isOver && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">
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
                    <p className="text-[15px] font-bold capitalize text-slate-800 leading-tight">
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
                    <p className={`text-[22px] font-extrabold leading-none ${isOver ? "text-red-600" : "text-slate-800"}`}>
                        ${budget.spent.toFixed(2)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Limit</p>
                    <p className="text-[17px] font-bold text-slate-500">${budget.limit.toFixed(2)}</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
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
            <div className="flex gap-2 pt-1 border-t border-slate-100/80">
                <button
                    onClick={() => onEdit(budget)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold text-slate-500 hover:bg-slate-100/70 hover:text-slate-700 transition-colors"
                >
                    <Pencil size={13} strokeWidth={2.5} />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(budget._id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold text-slate-400 hover:bg-red-50/80 hover:text-red-600 transition-colors"
                >
                    <Trash2 size={13} strokeWidth={2.5} />
                    Delete
                </button>
            </div>
        </motion.div>
    );
}
