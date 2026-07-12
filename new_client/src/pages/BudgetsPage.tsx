import { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, PieChart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBudgetStore } from "../store/budgetStore";
import BudgetCard from "../components/Budgets/BudgetCard";
import BudgetForm from "../components/Budgets/BudgetForm";
import BudgetSummary from "../components/Budgets/BudgetSummary";
import ActionConfirmModal from "../components/Common/ActionConfirmModal";
import type { Budget } from "../types/budget.types";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export default function BudgetsPage() {
    const { budgets, fetchBudgets, deleteBudget, isLoading, filters, setFilters } =
        useBudgetStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    const openAdd = () => {
        setEditingBudget(null);
        setIsFormOpen(true);
    };

    const openEdit = (budget: Budget) => {
        setEditingBudget(budget);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setTimeout(() => setEditingBudget(null), 300);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await deleteBudget(deleteId);
            setDeleteId(null);
        }
    };

    // Month navigation
    const prevMonth = () => {
        let m = filters.month - 1;
        let y = filters.year;
        if (m < 0) { m = 11; y--; }
        setFilters(m, y);
    };

    const nextMonth = () => {
        let m = filters.month + 1;
        let y = filters.year;
        if (m > 11) { m = 0; y++; }
        setFilters(m, y);
    };

    return (
        <div className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden px-4 py-6 sm:px-8 lg:h-[100svh] lg:px-10 lg:py-8">
            {/* Header */}
            <div className="z-10 mb-6 flex w-full flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Budgets</h1>

                <div className="flex items-center gap-3">
                    {/* Month navigator */}
                    <div className="flex items-center gap-1 rounded-lg border border-white/60 bg-white/70 px-1 py-1 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/78">
                        <button
                            onClick={prevMonth}
                            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <ChevronLeft size={16} strokeWidth={2.5} />
                        </button>
                        <span className="px-2 text-[14px] font-bold text-slate-700 dark:text-slate-200 min-w-[130px] text-center">
                            {MONTH_NAMES[filters.month]} {filters.year}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <ChevronRight size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Add Budget
                    </button>
                </div>
            </div>

            {/* Summary strip */}
            {budgets.length > 0 && (
                <div className="z-10 mb-6">
                    <BudgetSummary budgets={budgets} />
                </div>
            )}

            {/* Category control table */}
            <div className="z-10 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]">
                {isLoading ? (
                    <div className="flex h-48 items-center justify-center">
                        <div className="size-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                ) : budgets.length === 0 ? (
                    /* Empty state */
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-64 gap-4"
                    >
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-200 dark:ring-emerald-800/50">
                            <PieChart size={28} className="text-emerald-500 dark:text-emerald-400" strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className="text-[16px] font-bold text-slate-700 dark:text-white">No budgets yet</p>
                            <p className="text-[13px] text-slate-400 mt-1">
                                Set spending limits for {MONTH_NAMES[filters.month]} to track your goals.
                            </p>
                        </div>
                        <button
                            onClick={openAdd}
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
                        >
                            <Plus size={16} strokeWidth={3} />
                            Create your first budget
                        </button>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="mb-6 overflow-hidden rounded-2xl border border-white/70 bg-white/75 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/65">
                            <div className="hidden grid-cols-[minmax(145px,1fr)_minmax(220px,2fr)_125px_88px] border-b border-slate-100 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:grid dark:border-slate-700/60">
                                <span>Category</span><span>Usage</span><span className="text-right">Status</span><span />
                            </div>
                            {budgets.map((budget, i) => (
                                <BudgetCard
                                    key={budget._id}
                                    budget={budget}
                                    index={i}
                                    onEdit={openEdit}
                                    onDelete={(id) => setDeleteId(id)}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>

            {/* Add / Edit form panel */}
            <BudgetForm
                key={`${editingBudget?._id ?? "new"}-${filters.month}-${filters.year}-${isFormOpen ? "open" : "closed"}`}
                isOpen={isFormOpen}
                onClose={closeForm}
                editingBudget={editingBudget}
                defaultMonth={filters.month}
                defaultYear={filters.year}
            />

            {/* Delete confirm modal */}
            <ActionConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Budget"
                description="Are you sure you want to delete this budget? This action cannot be undone."
                confirmText="Yes, Delete"
                variant="danger"
                isLoading={isLoading}
            />
        </div>
    );
}
