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
import PageHeader from "../components/Common/PageHeader";
import EmptyState from "../components/Common/EmptyState";
import { Button } from "../components/ui/button";
import { useNotificationStore } from "../store/notificationStore";
import GlobalError from "../components/Common/GlobalError";

type GoalFilterTab = "all" | "active" | "completed";

export default function GoalPage() {
    const { goals, fetchGoals, createGoal, updateGoal, deleteGoal, isLoading, error } = useGoalStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
    const [isDepositMode, setIsDepositMode] = useState(true);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [filterTab, setFilterTab] = useState<GoalFilterTab>("all");
    const notify = useNotificationStore((state) => state.notify);

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
        const goal = goals.find((item) => item._id === deleteId);
        setIsDeleting(true);
        await deleteGoal(deleteId);
        setIsDeleting(false);
        const deleteError = useGoalStore.getState().error;
        if (!deleteError) {
            notify({ tone: "success", title: "Goal deleted", message: `${goal?.title ?? "The savings goal"} was removed. Existing transaction history was kept.` });
            setDeleteId(null);
        } else {
            notify({ tone: "error", title: "Goal wasn’t deleted", message: deleteError });
        }
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
        <div className="page-shell lg:h-[100svh] lg:overflow-hidden lg:pb-4">
            <PageHeader eyebrow="Savings roadmap" title="Goals" description="Turn meaningful plans into visible milestones and keep each contribution intentional." actions={<Button onClick={openAdd}>
                    <Plus size={16} strokeWidth={3} />
                    New goal
                </Button>} />

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
                ) : error && goals.length === 0 ? (
                    <GlobalError message={error} onRetry={() => void fetchGoals()} />
                ) : goals.length === 0 ? (
                    /* Empty state */
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="app-surface"
                    >
                        <EmptyState icon={Target} title="Create a goal worth tracking" description="Set a target, choose a date, and add savings as you make progress." action={<Button onClick={openAdd}><Plus size={16} />Create first goal</Button>} />
                    </motion.div>
                ) : filteredGoals.length === 0 ? (
                    <div className="app-surface"><EmptyState compact icon={Target} title="Nothing in this view" description="There are no goals with this status yet." action={<Button variant="outline" size="sm" onClick={() => setFilterTab("all")}>Show all goals</Button>} /></div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="h-full pb-4 lg:pb-0">
                            <GoalRoadmap goals={filteredGoals} onEdit={openEdit} onDelete={(id) => setDeleteId(id)} onDeposit={openDepositModal} onCreate={openAdd} />
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
