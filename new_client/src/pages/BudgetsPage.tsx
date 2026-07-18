import { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, PieChart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBudgetStore } from "../store/budgetStore";
import BudgetCard from "../components/Budgets/BudgetCard";
import BudgetForm from "../components/Budgets/BudgetForm";
import BudgetSummary from "../components/Budgets/BudgetSummary";
import ActionConfirmModal from "../components/Common/ActionConfirmModal";
import type { Budget } from "../types/budget.types";
import PageHeader from "../components/Common/PageHeader";
import EmptyState from "../components/Common/EmptyState";
import { Button } from "../components/ui/button";
import Loader from "../components/Common/Loader";
import { useNotificationStore } from "../store/notificationStore";
import GlobalError from "../components/Common/GlobalError";
import { useNavigate } from "@tanstack/react-router";
import { useExpenseStore } from "../store/expenseStore";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export default function BudgetsPage() {
    const navigate = useNavigate();
    const { budgets, fetchBudgets, deleteBudget, isLoading, error, filters, setFilters } =
        useBudgetStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const notify = useNotificationStore((state) => state.notify);
    const setExpenseFilters = useExpenseStore((state) => state.setFilters);

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
            const budget = budgets.find((item) => item._id === deleteId);
            await deleteBudget(deleteId);
            const deleteError = useBudgetStore.getState().error;
            if (!deleteError) {
                const categoryName = budget?.category.replace(/^./, (letter) => letter.toUpperCase()) ?? "Budget";
                notify({ tone: "success", title: "Budget deleted", message: `${categoryName} was removed from this month’s plan.` });
                setDeleteId(null);
            } else {
                notify({ tone: "error", title: "Budget wasn’t deleted", message: deleteError });
            }
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

    const reviewBudgetTransactions = (budget: Budget) => {
        setExpenseFilters({ category: budget.category, search: "", startDate: null, endDate: null });
        navigate({ to: "/expenses" });
    };

    return (
        <div className="page-shell lg:h-[100svh] lg:overflow-hidden lg:pb-4">
            <PageHeader eyebrow="Monthly plan" title="Budgets" description="Set category guardrails and catch overspending before it disrupts the rest of your month." actions={<>
                    {/* Month navigator */}
                    <div className="flex min-h-11 items-center gap-1 rounded-xl border border-slate-300 bg-white px-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="icon-button"
                            aria-label="Show previous month"
                        >
                            <ChevronLeft size={16} strokeWidth={2.5} />
                        </button>
                        <span className="min-w-[132px] px-1 text-center text-sm font-semibold text-slate-700 dark:text-slate-200" aria-live="polite">
                            {MONTH_NAMES[filters.month]} {filters.year}
                        </span>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="icon-button"
                            aria-label="Show next month"
                        >
                            <ChevronRight size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    <Button onClick={openAdd}>
                        <Plus size={16} strokeWidth={3} />
                        Add Budget
                    </Button>
            </>} />

            {/* Summary strip */}
            {budgets.length > 0 && (
                <div className="z-10 mb-4">
                    <BudgetSummary budgets={budgets} />
                </div>
            )}

            {/* Category control table */}
            <div className="z-10 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden">
                {isLoading ? (
                    <Loader text="Loading this month’s budgets…" />
                ) : error && budgets.length === 0 ? (
                    <GlobalError message={error} onRetry={() => void fetchBudgets()} />
                ) : budgets.length === 0 ? (
                    /* Empty state */
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="app-surface"
                    >
                        <EmptyState icon={PieChart} title={`Plan ${MONTH_NAMES[filters.month]}`} description="Add category limits to see what is safe to spend and where you need to slow down." action={<Button onClick={openAdd}><Plus size={16} />Create first budget</Button>} />
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="app-surface mb-6 overflow-hidden lg:mb-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
                            <div className="hidden shrink-0 grid-cols-[minmax(145px,1fr)_minmax(220px,2fr)_125px_88px] border-b border-slate-100 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:grid dark:border-slate-700/60">
                                <span>Category</span><span>Usage</span><span className="text-right">Status</span><span />
                            </div>
                            <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[scrollbar-gutter:stable]" role="region" aria-label="Budget categories">
                                {budgets.map((budget, i) => (
                                    <BudgetCard
                                        key={budget._id}
                                        budget={budget}
                                        index={i}
                                        onEdit={openEdit}
                                        onDelete={(id) => setDeleteId(id)}
                                        onReview={reviewBudgetTransactions}
                                    />
                                ))}
                            </div>
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
