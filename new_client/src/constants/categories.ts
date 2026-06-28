import { ExpenseCategory } from "../types";

export const EXPENSE_CATEGORIES = [
    { label: "Food", value: ExpenseCategory.FOOD },
    { label: "Transport", value: ExpenseCategory.TRANSPORT },
    { label: "Utilities", value: ExpenseCategory.UTILITIES },
    { label: "Entertainment", value: ExpenseCategory.ENTERTAINMENT },
    { label: "Healthcare", value: ExpenseCategory.HEALTHCARE },
    { label: "Shopping", value: ExpenseCategory.SHOPPING },
    { label: "Education", value: ExpenseCategory.EDUCATION },
    { label: "Other", value: ExpenseCategory.OTHER },
];

export const CATEGORY_LABELS: Record<string, string> = {
    food: "Food",
    transport: "Transport",
    utilities: "Utilities",
    entertainment: "Entertainment",
    healthcare: "Healthcare",
    shopping: "Shopping",
    education: "Education",
    other: "Other",
};

export const CATEGORY_COLORS: Record<string, string> = {
    food: "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50",
    transport: "bg-teal-50 text-teal-700 border border-teal-200/50 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/50",
    utilities: "bg-lime-50 text-lime-700 border border-lime-200/50 dark:bg-lime-950/60 dark:text-lime-300 dark:border-lime-800/50",
    entertainment: "bg-cyan-50 text-cyan-700 border border-cyan-200/50 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/50",
    healthcare: "bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800/50",
    shopping: "bg-emerald-100/60 text-emerald-800 border border-emerald-300/50 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700/50",
    education: "bg-teal-100/60 text-teal-800 border border-teal-300/50 dark:bg-teal-900/50 dark:text-teal-200 dark:border-teal-700/50",
    other: "bg-slate-50 text-slate-600 border border-slate-200/50 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/50",
};

export const CATEGORY_HEX_COLORS: Record<string, string> = {
    food: "#10b981",        // emerald green
    transport: "#14b8a6",   // soft teal
    utilities: "#84cc16",   // soft lime
    entertainment: "#06b6d4", // soft cyan
    healthcare: "#059669",  // forest green
    shopping: "#34d399",    // light mint green
    education: "#0d9488",   // deep teal
    other: "#94a3b8",       // soft slate grey
};

