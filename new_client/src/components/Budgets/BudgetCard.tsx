import { motion } from "framer-motion";
import { Utensils, Car, Zap, Film, Heart, ShoppingBag, BookOpen, MoreHorizontal, Pencil, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Budget } from "../../types/budget.types";

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    food: { icon: Utensils, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/15" },
    transport: { icon: Car, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/15" },
    utilities: { icon: Zap, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/15" },
    entertainment: { icon: Film, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/15" },
    healthcare: { icon: Heart, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/15" },
    shopping: { icon: ShoppingBag, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-500/15" },
    education: { icon: BookOpen, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/15" },
    other: { icon: MoreHorizontal, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-700" },
};

interface BudgetCardProps { budget: Budget; onEdit: (budget: Budget) => void; onDelete: (id: string) => void; index: number }

export default function BudgetCard({ budget, onEdit, onDelete, index }: BudgetCardProps) {
    const config = CATEGORY_CONFIG[budget.category] ?? CATEGORY_CONFIG.other;
    const Icon = config.icon;
    const isOver = budget.percentage >= 100;
    const isWarning = budget.percentage >= 80 && !isOver;
    const barColor = isOver ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500";

    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: .2, delay: index * .025 }}
            className="group grid gap-4 border-b border-slate-100 px-4 py-4 last:border-0 hover:bg-slate-50/70 sm:grid-cols-[minmax(145px,1fr)_minmax(220px,2fr)_125px_88px] sm:items-center sm:px-5 dark:border-slate-700/60 dark:hover:bg-slate-800/45"
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${config.bg}`}><Icon size={18} className={config.color} /></div>
                <div className="min-w-0"><h3 className="truncate text-sm font-extrabold capitalize text-slate-800 dark:text-white">{budget.category}</h3><p className="text-[11px] font-semibold text-slate-400">Monthly category</p></div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="font-bold text-slate-600 dark:text-slate-300">${budget.spent.toLocaleString()} spent</span><span className="text-slate-400">of ${budget.limit.toLocaleString()}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(budget.percentage, 100)}%` }} transition={{ duration: .55 }} className={`h-full rounded-full ${barColor}`} /></div>
            </div>

            <div className="flex items-center justify-between sm:block sm:text-right">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${isOver ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300" : isWarning ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"}`}>
                    {isWarning || isOver ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}{isOver ? "Over" : isWarning ? "Near limit" : "On track"}
                </span>
                <p className={`mt-1 text-xs font-bold ${budget.remaining < 0 ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}>{budget.remaining >= 0 ? `$${budget.remaining.toLocaleString()} left` : `$${Math.abs(budget.remaining).toLocaleString()} over`}</p>
            </div>

            <div className="flex justify-end gap-1">
                <button onClick={() => onEdit(budget)} aria-label={`Edit ${budget.category} budget`} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"><Pencil size={15} /></button>
                <button onClick={() => onDelete(budget._id)} aria-label={`Delete ${budget.category} budget`} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><Trash2 size={15} /></button>
            </div>
        </motion.article>
    );
}
