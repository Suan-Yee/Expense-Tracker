import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, CheckCircle, AlertCircle, DollarSign, Wallet } from "lucide-react";
import type { Goal } from "../../types/goal.types";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: Goal | null;
    isDeposit: boolean;
    onSubmit: (id: string, amount: number, isDeposit: boolean, recordInExpense: boolean) => Promise<boolean>;
}

export default function DepositModal({ isOpen, onClose, goal, isDeposit, onSubmit }: DepositModalProps) {
    const [amount, setAmount] = useState("");
    const [recordInExpense, setRecordInExpense] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setAmount("");
        setRecordInExpense(true);
        setError(null);
        onClose();
    };
    const modalRef = useModalAccessibility<HTMLDivElement>(isOpen, handleClose);

    if (!isOpen || !goal) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const num = Number(amount);
        if (!num || num <= 0) {
            setError("Please enter a valid positive amount");
            return;
        }
        if (!isDeposit && num > goal.currentAmount) {
            setError("Withdrawal amount cannot exceed current goal balance");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        const success = await onSubmit(goal._id, num, isDeposit, recordInExpense);
        setIsSubmitting(false);
        if (success) {
            setAmount("");
            handleClose();
        } else {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="deposit-modal-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className={`flex size-10 items-center justify-center rounded-xl ${isDeposit ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"}`}>
                                {isDeposit ? <Plus size={20} strokeWidth={3} /> : <Minus size={20} strokeWidth={3} />}
                            </div>
                            <div>
                                <h3 id="deposit-modal-title" className="text-lg font-extrabold text-slate-800 dark:text-white">
                                    {isDeposit ? "Deposit Funds" : "Withdraw Funds"}
                                </h3>
                                <p className="text-xs font-semibold text-slate-400 truncate max-w-[220px]">
                                    {goal.title}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800/60 p-3 text-xs font-bold text-red-600 dark:text-red-300">
                                <AlertCircle size={16} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Current Balance info */}
                        <div className="flex justify-between items-center rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-700/50 text-sm">
                            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                <Wallet size={15} /> Current Saved:
                            </span>
                            <span className="font-extrabold text-slate-800 dark:text-white">
                                ${goal.currentAmount.toLocaleString()}
                            </span>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                Amount ($)
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    step="any"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-10 pr-4 text-base font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Sync option checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                            <input
                                type="checkbox"
                                checked={recordInExpense}
                                onChange={(e) => setRecordInExpense(e.target.checked)}
                                className="mt-0.5 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                    <CheckCircle size={13} className="text-emerald-500 inline" />
                                    Record in Expense tracker history
                                </p>
                                <p className="text-slate-400 mt-0.5 leading-relaxed">
                                    {isDeposit
                                        ? "Automatically deducts from available budget as a savings expense."
                                        : "Automatically adds back to your tracked income/funds."}
                                </p>
                            </div>
                        </label>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !amount}
                                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50 ${isDeposit ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"}`}
                            >
                                {isSubmitting ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : isDeposit ? (
                                    "Confirm Deposit"
                                ) : (
                                    "Confirm Withdraw"
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
