import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Tag, Calendar, Palette, FileText, CheckCircle, DollarSign } from "lucide-react";
import type { Goal, GoalFormData, GoalUpdateData } from "../../types/goal.types";
import CustomSelect from "../Expenses/CustomSelect";
import CustomDatePicker from "../Expenses/CustomDatePicker";

const CATEGORIES = [
    { label: "Travel",     value: "travel" },
    { label: "Emergency",  value: "emergency" },
    { label: "Gadget",     value: "gadget" },
    { label: "Home",       value: "home" },
    { label: "Car",        value: "car" },
    { label: "Health",     value: "health" },
    { label: "Investment", value: "investment" },
    { label: "Other",      value: "other" },
];

const COLORS = [
    { name: "emerald", bg: "bg-emerald-500", ring: "ring-emerald-500" },
    { name: "blue",    bg: "bg-blue-500",    ring: "ring-blue-500" },
    { name: "purple",  bg: "bg-purple-500",  ring: "ring-purple-500" },
    { name: "amber",   bg: "bg-amber-500",   ring: "ring-amber-500" },
    { name: "rose",    bg: "bg-rose-500",    ring: "ring-rose-500" },
];

interface GoalFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingGoal: Goal | null;
    onSubmitCreate: (data: GoalFormData) => Promise<boolean>;
    onSubmitUpdate: (id: string, data: GoalUpdateData) => Promise<boolean>;
}

export default function GoalFormModal({
    isOpen, onClose, editingGoal, onSubmitCreate, onSubmitUpdate
}: GoalFormModalProps) {
    const [title, setTitle] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [deadline, setDeadline] = useState("");
    const [category, setCategory] = useState("other");
    const [color, setColor] = useState("emerald");
    const [notes, setNotes] = useState("");
    const [recordInExpense, setRecordInExpense] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (editingGoal) {
            setTitle(editingGoal.title);
            setTargetAmount(editingGoal.targetAmount.toString());
            setCurrentAmount(editingGoal.currentAmount.toString());
            setDeadline(editingGoal.deadline ? editingGoal.deadline.substring(0, 10) : "");
            setCategory(editingGoal.category || "other");
            setColor(editingGoal.color || "emerald");
            setNotes(editingGoal.notes || "");
        } else {
            setTitle("");
            setTargetAmount("");
            setCurrentAmount("");
            setDeadline("");
            setCategory("other");
            setColor("emerald");
            setNotes("");
            setRecordInExpense(true);
        }
        setError(null);
    }, [editingGoal, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !targetAmount) {
            setError("Title and target amount are required");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        let success = false;
        if (editingGoal) {
            success = await onSubmitUpdate(editingGoal._id, {
                title: title.trim(),
                targetAmount: Number(targetAmount),
                currentAmount: Number(currentAmount) || 0,
                deadline: deadline || undefined,
                category,
                color,
                notes: notes.trim(),
            });
        } else {
            success = await onSubmitCreate({
                title: title.trim(),
                targetAmount: Number(targetAmount),
                currentAmount: Number(currentAmount) || 0,
                deadline: deadline || undefined,
                category,
                color,
                notes: notes.trim(),
                recordInExpense: Number(currentAmount) > 0 ? recordInExpense : false,
            });
        }

        setIsSubmitting(false);
        if (success) {
            onClose();
        } else {
            setError("Failed to save goal. Please check details.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop matching BudgetForm style */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
                    />

                    {/* Right Drawer Panel matching BudgetForm style */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                        className="fixed right-0 top-0 z-50 h-full w-[380px] sm:w-[420px] flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-l border-white/60 dark:border-slate-800 shadow-2xl shadow-slate-900/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-slate-100/80 dark:border-slate-800">
                            <div>
                                <h2 className="text-[17px] font-extrabold text-slate-800 dark:text-white">
                                    {editingGoal ? "Edit Savings Goal" : "New Savings Goal"}
                                </h2>
                                <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                                    {editingGoal ? "Update milestone parameters" : "Set a new financial milestone"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex size-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto px-6 py-6 gap-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800/60 p-3 text-xs font-bold text-red-600 dark:text-red-300"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <Target size={11} strokeWidth={2.5} />
                                    Goal Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. New Mac Studio or Hawaii Trip"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 px-3.5 py-3 text-[14px] font-bold text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                            </div>

                            {/* Target Amount */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <DollarSign size={11} strokeWidth={2.5} />
                                    Target Amount ($) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[15px]">$</span>
                                    <input
                                        type="number"
                                        required
                                        step="any"
                                        min="1"
                                        placeholder="5000"
                                        value={targetAmount}
                                        onChange={(e) => setTargetAmount(e.target.value)}
                                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 pl-8 pr-4 py-3 text-[15px] font-bold text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Initial Saved */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <DollarSign size={11} strokeWidth={2.5} />
                                    Current / Initial Saved ($)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[15px]">$</span>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        value={currentAmount}
                                        onChange={(e) => setCurrentAmount(e.target.value)}
                                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 pl-8 pr-4 py-3 text-[15px] font-bold text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Custom Category Dropdown */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <Tag size={11} strokeWidth={2.5} />
                                    Category
                                </label>
                                <CustomSelect
                                    options={CATEGORIES}
                                    value={category}
                                    onChange={(val) => setCategory(val)}
                                    placeholder="Select category..."
                                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 h-12 text-[14px] font-bold text-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Custom Target Date Picker */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <Calendar size={11} strokeWidth={2.5} />
                                    Target Date
                                </label>
                                <CustomDatePicker
                                    value={deadline}
                                    onChange={(dateStr) => setDeadline(dateStr)}
                                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 h-12 text-[14px] font-bold text-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Color Theme Picker */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <Palette size={11} strokeWidth={2.5} />
                                    Card Accent Theme
                                </label>
                                <div className="flex items-center gap-3 pt-1">
                                    {COLORS.map((col) => (
                                        <button
                                            key={col.name}
                                            type="button"
                                            onClick={() => setColor(col.name)}
                                            className={`size-8 rounded-full ${col.bg} transition-all flex items-center justify-center ${color === col.name ? `ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${col.ring} scale-110` : "opacity-70 hover:opacity-100"}`}
                                        >
                                            {color === col.name && <CheckCircle size={16} className="text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <FileText size={11} strokeWidth={2.5} />
                                    Notes
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Optional details or specifications..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 px-3.5 py-2.5 text-[14px] font-medium text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                            </div>

                            {!editingGoal && Number(currentAmount) > 0 && (
                                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
                                    <input
                                        type="checkbox"
                                        checked={recordInExpense}
                                        onChange={(e) => setRecordInExpense(e.target.checked)}
                                        className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    Record initial deposit (${currentAmount}) in expense tracker history
                                </label>
                            )}

                            {/* Footer Actions */}
                            <div className="mt-auto pt-4 flex flex-col gap-2.5">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl bg-emerald-500 py-3.5 text-[14px] font-extrabold text-white shadow-sm shadow-emerald-200/60 dark:shadow-none hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : editingGoal ? (
                                        "Update Goal"
                                    ) : (
                                        "Create Goal"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full rounded-xl py-3 text-[14px] font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
