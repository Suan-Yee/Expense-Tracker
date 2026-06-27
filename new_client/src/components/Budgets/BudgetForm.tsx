import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Tag, Calendar } from "lucide-react";
import { useBudgetStore } from "../../store/budgetStore";
import type { Budget } from "../../types/budget.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const CATEGORIES = [
    "food", "transport", "utilities", "entertainment",
    "healthcare", "shopping", "education", "other",
];

const MONTHS = [
    { label: "January",   value: "0"  },
    { label: "February",  value: "1"  },
    { label: "March",     value: "2"  },
    { label: "April",     value: "3"  },
    { label: "May",       value: "4"  },
    { label: "June",      value: "5"  },
    { label: "July",      value: "6"  },
    { label: "August",    value: "7"  },
    { label: "September", value: "8"  },
    { label: "October",   value: "9"  },
    { label: "November",  value: "10" },
    { label: "December",  value: "11" },
];

const YEARS = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { label: year.toString(), value: year.toString() };
});

interface BudgetFormProps {
    isOpen: boolean;
    onClose: () => void;
    editingBudget: Budget | null;
    defaultMonth: number;
    defaultYear: number;
}

export default function BudgetForm({ isOpen, onClose, editingBudget, defaultMonth, defaultYear }: BudgetFormProps) {
    const { createBudget, updateBudget, isLoading, error } = useBudgetStore();

    const [category, setCategory] = useState("food");
    const [limit, setLimit] = useState("");
    const [month, setMonth] = useState(defaultMonth);
    const [year, setYear] = useState(defaultYear);
    const [fieldError, setFieldError] = useState<string | null>(null);

    // Pre-fill when editing
    useEffect(() => {
        if (editingBudget) {
            setCategory(editingBudget.category);
            setLimit(editingBudget.limit.toString());
            setMonth(editingBudget.month);
            setYear(editingBudget.year);
        } else {
            setCategory("food");
            setLimit("");
            setMonth(defaultMonth);
            setYear(defaultYear);
        }
        setFieldError(null);
    }, [editingBudget, isOpen, defaultMonth, defaultYear]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldError(null);

        const parsedLimit = parseFloat(limit);
        if (!limit || isNaN(parsedLimit) || parsedLimit <= 0) {
            setFieldError("Please enter a valid limit greater than 0");
            return;
        }

        let success: boolean;
        if (editingBudget) {
            success = await updateBudget(editingBudget._id, parsedLimit);
        } else {
            success = await createBudget({ category, limit: parsedLimit, month, year });
        }

        if (success) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                        className="fixed right-0 top-0 z-50 h-full w-[380px] flex flex-col bg-white/80 backdrop-blur-2xl border-l border-white/60 shadow-2xl shadow-slate-900/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-slate-100/80">
                            <div>
                                <h2 className="text-[17px] font-extrabold text-slate-800">
                                    {editingBudget ? "Edit Budget" : "New Budget"}
                                </h2>
                                <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                                    {editingBudget
                                        ? "Update your spending limit"
                                        : "Set a spending limit for a category"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex size-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto px-6 py-6 gap-5">
                            {/* Category */}
                            {!editingBudget && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                                        <Tag size={11} strokeWidth={2.5} />
                                        Category
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setCategory(cat)}
                                                className={`rounded-xl px-3 py-2.5 text-[13px] font-semibold capitalize transition-all ${
                                                    category === cat
                                                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Limit */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                                    <DollarSign size={11} strokeWidth={2.5} />
                                    Monthly Limit
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[15px]">$</span>
                                    <input
                                        type="number"
                                        value={limit}
                                        onChange={(e) => setLimit(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0.01"
                                        className="w-full rounded-xl bg-slate-50 border border-slate-200/80 pl-8 pr-4 py-3 text-[15px] font-bold text-slate-800 placeholder-slate-300 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Month / Year */}
                            {!editingBudget && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                                        <Calendar size={11} strokeWidth={2.5} />
                                        Period
                                    </label>
                                <div className="flex gap-3">
                                        <div className="flex-1">
                                            <Select
                                                value={month.toString()}
                                                onValueChange={(val) => setMonth(parseInt(val))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MONTHS.map((m) => (
                                                        <SelectItem key={m.value} value={m.value}>
                                                            {m.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-[105px]">
                                            <Select
                                                value={year.toString()}
                                                onValueChange={(val) => setYear(parseInt(val))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {YEARS.map((y) => (
                                                        <SelectItem key={y.value} value={y.value}>
                                                            {y.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Errors */}
                            {(fieldError || error) && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600"
                                >
                                    {fieldError || error}
                                </motion.p>
                            )}

                            <div className="mt-auto pt-4 flex flex-col gap-2.5">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-xl bg-emerald-500 py-3.5 text-[14px] font-extrabold text-white shadow-sm shadow-emerald-200/60 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 transition-all"
                                >
                                    {isLoading
                                        ? "Saving…"
                                        : editingBudget
                                        ? "Update Budget"
                                        : "Create Budget"}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full rounded-xl py-3 text-[14px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
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
