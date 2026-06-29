import { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGoalStore } from "../store/goalStore";
import GoalCard from "../components/Goals/GoalCard";
import GoalFormModal from "../components/Goals/GoalFormModal";
import DepositModal from "../components/Goals/DepositModal";
import GoalSummary from "../components/Goals/GoalSummary";
import GoalLoader from "../components/Goals/GoalLoader";
import ActionConfirmModal from "../components/Common/ActionConfirmModal";
import type { Goal } from "../types/goal.types";

export default function GoalPage() {
    const { goals, fetchGoals, createGoal, updateGoal, deleteGoal, isLoading } = useGoalStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
    const [isDepositMode, setIsDepositMode] = useState(true);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    return (
        <div className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden px-4 py-6 sm:px-8 lg:h-[100svh] lg:px-10 lg:py-8">
            {/* Header */}
            <div className="z-10 mb-6 flex w-full flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Savings Goals</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Set milestones, track targets, and grow your wealth</p>
                </div>

                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                    <Plus size={16} strokeWidth={3} />
                    New Goal
                </button>
            </div>

            {/* Summary strip */}
            {!isLoading && goals.length > 0 && (
                <div className="z-10 mb-6">
                    <GoalSummary goals={goals} />
                </div>
            )}

            {/* Content Section */}
            <div className="z-10 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]">
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
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-8">
                            {goals.map((goal, i) => (
                                <GoalCard
                                    key={goal._id}
                                    goal={goal}
                                    index={i}
                                    onEdit={openEdit}
                                    onDelete={(id) => setDeleteId(id)}
                                    onDeposit={openDepositModal}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>

            {/* Form Modal */}
            <GoalFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                editingGoal={editingGoal}
                onSubmitCreate={createGoal}
                onSubmitUpdate={updateGoal}
            />

            {/* Deposit / Withdraw Modal */}
            <DepositModal
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