import { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGoalStore } from "../store/goalStore";
import GoalFormModal from "../components/Goals/GoalFormModal";
import DepositModal from "../components/Goals/DepositModal";
import GoalSummary from "../components/Goals/GoalSummary";
import GoalLoader from "../components/Goals/GoalLoader";
import GoalRoadmap from "../components/Goals/GoalRoadmap";
import ActionConfirmModal from "../components/Common/ActionConfirmModal";
import type { Goal } from "../types/goal.types";

type GoalFilterTab = "all" | "active" | "completed";

export default function GoalPage() {
    const { goals, fetchGoals, createGoal, updateGoal, deleteGoal, isLoading } = useGoalStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
    const [isDepositMode, setIsDepositMode] = useState(true);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [filterTab, setFilterTab] = useState<GoalFilterTab>("all");

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const openAdd = () => {
        setEditingGoal(null);
        setIsFormOpen(true);
    };

    const openEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setIsFormOpen(true);
    };

    const openDepositModal = (goal: Goal, isDeposit: boolean) => {
        setActiveGoal(goal);
        setIsDepositMode(isDeposit);
        setIsDepositOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        await deleteGoal(deleteId);
        setIsDeleting(false);
        setDeleteId(null);
    };

    const handleDepositSubmit = async (
        id: string,
        amount: number,
        isDeposit: boolean,
        recordInExpense: boolean
    ): Promise<boolean> => {
        return await updateGoal(id, {
            [isDeposit ? "depositAmount" : "withdrawAmount"]: amount,
            recordInExpense,
        });
    };

    const filteredGoals = goals.filter((g) => {
        const isComp = g.currentAmount >= g.targetAmount;
        if (filterTab === "active") return !isComp;
        if (filterTab === "completed") return isComp;
        return true;
    });

    const counts = {
        all: goals.length,
        active: goals.filter((g) => g.currentAmount < g.targetAmount).length,
        completed: goals.filter((g) => g.currentAmount >= g.targetAmount).length,
    };

    return (
        <div className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden px-4 py-5 sm:px-8 lg:h-[100svh] lg:px-10 lg:py-6">
            {/* Header */}
            <div className="z-10 mb-4 flex w-full flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Savings Goals</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Set milestones, track targets, and grow your wealth</p>
                </div>

                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                    <Plus size={16} strokeWidth={3} />
                    New Goal
                </button>
            </div>

            {/* Summary strip */}
            {!isLoading && goals.length > 0 && (
                <div className="z-10 mb-4">
                    <GoalSummary goals={goals} />
                </div>
            )}

            {/* Clean Minimalist Filter Pills */}
            {!isLoading && goals.length > 0 && (
                <div className="z-10 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 p-1">
                        <button
                            onClick={() => setFilterTab("all")}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${filterTab === "all" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                        >
                            All ({counts.all})
                        </button>

                        <button
                            onClick={() => setFilterTab("active")}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${filterTab === "active" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                        >
                            Active ({counts.active})
                        </button>

                        <button
                            onClick={() => setFilterTab("completed")}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${filterTab === "completed" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                        >
                            Completed ({counts.completed})
                        </button>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden lg:overflow-hidden">
                {isLoading && goals.length === 0 ? (
                    <GoalLoader />
                ) : goals.length === 0 ? (
                    /* Empty state */
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-80 gap-4"
                    >
                        <div className="flex size-20 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-200 dark:ring-emerald-800/50 shadow-inner">
                            <Target size={36} className="text-emerald-500 dark:text-emerald-400 animate-bounce" strokeWidth={1.8} />
                        </div>
                        <div className="text-center max-w-sm">
                            <p className="text-[18px] font-extrabold text-slate-800 dark:text-white">No savings goals yet</p>
                            <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">
                                Create your first financial milestone today. Whether it's an emergency fund or a dream vacation, we'll help you get there.
                            </p>
                        </div>
                        <button
                            onClick={openAdd}
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition-all mt-2"
                        >
                            <Plus size={16} strokeWidth={3} />
                            Create Your First Goal
                        </button>
                    </motion.div>
                ) : filteredGoals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <p className="text-base font-bold text-slate-600 dark:text-slate-300">No goals found in this view</p>
                        <button
                            onClick={() => setFilterTab("all")}
                            className="mt-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                        >
                            Show All Goals
                        </button>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="h-full pb-4">
                            <GoalRoadmap goals={filteredGoals} onEdit={openEdit} onDelete={(id) => setDeleteId(id)} onDeposit={openDepositModal} />
                        </div>
                    </AnimatePresence>
                )}
            </div>

            {/* Form Modal */}
            <GoalFormModal
                key={`${editingGoal?._id ?? "new"}-${isFormOpen ? "open" : "closed"}`}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                editingGoal={editingGoal}
                onSubmitCreate={createGoal}
                onSubmitUpdate={updateGoal}
            />

            {/* Deposit / Withdraw Modal */}
            <DepositModal
                key={`${activeGoal?._id ?? "none"}-${isDepositMode ? "deposit" : "withdraw"}-${isDepositOpen ? "open" : "closed"}`}
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
                goal={activeGoal}
                isDeposit={isDepositMode}
                onSubmit={handleDepositSubmit}
            />

            {/* Delete Confirmation Modal */}
            <ActionConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Savings Goal"
                description="Are you sure you want to delete this goal? This action cannot be undone, but any past expense transactions recorded in your history will remain intact."
                confirmText="Delete Goal"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
