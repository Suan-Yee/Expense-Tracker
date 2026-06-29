import { motion } from "framer-motion";
import {
    Target, Plane, ShieldAlert, Laptop, Home, Car, Heart,
    Pencil, Trash2, Sparkles, Calendar, Plus, Minus, TrendingUp
} from "lucide-react";
import type { Goal } from "../../types/goal.types";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    travel: Plane,
    emergency: ShieldAlert,
    gadget: Laptop,
    home: Home,
    car: Car,
    health: Heart,
    investment: TrendingUp,
    other: Target,
};

const COLOR_CONFIG: Record<string, { bar: string; text: string; bg: string; ring: string; badge: string }> = {
    emerald: { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/60", ring: "ring-emerald-200 dark:ring-emerald-800/50", badge: "bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300" },
    blue:    { bar: "bg-blue-500",    text: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-50 dark:bg-blue-950/60",       ring: "ring-blue-200 dark:ring-blue-800/50",       badge: "bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300" },
    purple:  { bar: "bg-purple-500",  text: "text-purple-600 dark:text-purple-400",   bg: "bg-purple-50 dark:bg-purple-950/60",   ring: "ring-purple-200 dark:ring-purple-800/50",   badge: "bg-purple-100 dark:bg-purple-900/80 text-purple-700 dark:text-purple-300" },
    amber:   { bar: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-950/60",     ring: "ring-amber-200 dark:ring-amber-800/50",     badge: "bg-amber-100 dark:bg-amber-900/80 text-amber-700 dark:text-amber-300" },
    rose:    { bar: "bg-rose-500",    text: "text-rose-600 dark:text-rose-400",       bg: "bg-rose-50 dark:bg-rose-950/60",       ring: "ring-rose-200 dark:ring-rose-800/50",       badge: "bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-300" },
};

interface GoalCardProps {
    goal: Goal;
    index: number;
    onEdit: (goal: Goal) => void;
    onDelete: (id: string) => void;
    onDeposit: (goal: Goal, isDeposit: boolean) => void;
}

export default function GoalCard({ goal, index, onEdit, onDelete, onDeposit }: GoalCardProps) {
    const Icon = CATEGORY_ICONS[goal.category?.toLowerCase()] || Target;
    const cfg = COLOR_CONFIG[goal.color] || COLOR_CONFIG.emerald;

    const percentage = goal.targetAmount > 0
        ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
        : 0;
    const isCompleted = goal.currentAmount >= goal.targetAmount;

    // Calculate days remaining if deadline exists
    let deadlineText = null;
    if (goal.deadline) {
        const d = new Date(goal.deadline);
        const today = new Date();
        const diffTime = d.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
            deadlineText = "Overdue";
        } else if (diffDays === 0) {
            deadlineText = "Due today";
        } else {
            deadlineText = `${diffDays}d left`;
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="group relative flex flex-col justify-between gap-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-slate-700/60 backdrop-blur-xl shadow-sm shadow-slate-200/50 dark:shadow-none p-5 hover:shadow-md hover:shadow-slate-200/70 dark:hover:shadow-none transition-all"
        >
            {/* Status / Deadline Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
                {isCompleted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm animate-pulse">
                        <Sparkles size={11} />
                        Completed
                    </span>
                ) : deadlineText ? (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${deadlineText === "Overdue" ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                        <Calendar size={11} />
                        {deadlineText}
                    </span>
                ) : null}
            </div>

            {/* Top row: Icon & Title */}
            <div>
                <div className="flex items-center gap-3 pr-20">
                    <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ring-1 ${cfg.ring}`}>
                        <Icon size={20} className={cfg.text} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[16px] font-bold text-slate-800 dark:text-white truncate leading-snug">
                            {goal.title}
                        </h3>
                        <p className="text-[12px] font-medium text-slate-400 capitalize">
                            {goal.category || "General"}
                        </p>
                    </div>
                </div>

                {goal.notes && (
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                        {goal.notes}
                    </p>
                )}
            </div>

            {/* Progress Section */}
            <div className="space-y-2 mt-2">
                <div className="flex items-baseline justify-between">
                    <span className="text-[20px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                        ${goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-[13px] font-semibold text-slate-400">
                        of ${goal.targetAmount.toLocaleString()} ({percentage}%)
                    </span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-700/80 overflow-hidden p-0.5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className={`h-full rounded-full ${isCompleted ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : cfg.bar}`}
                    />
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 mt-1">
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onDeposit(goal, true)}
                        disabled={isCompleted}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 px-2.5 py-1.5 text-[12px] font-bold text-emerald-700 dark:text-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={14} strokeWidth={3} />
                        Deposit
                    </button>
                    <button
                        onClick={() => onDeposit(goal, false)}
                        disabled={goal.currentAmount <= 0}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1.5 text-[12px] font-bold text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Minus size={14} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(goal)}
                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                        title="Edit goal"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={() => onDelete(goal._id)}
                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
                        title="Delete goal"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
