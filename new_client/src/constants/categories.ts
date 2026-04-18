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
    food: "bg-orange-100 text-orange-700",
    transport: "bg-blue-100 text-blue-700",
    utilities: "bg-amber-100 text-amber-700",
    entertainment: "bg-purple-100 text-purple-700",
    healthcare: "bg-red-100 text-red-700",
    shopping: "bg-pink-100 text-pink-700",
    education: "bg-indigo-100 text-indigo-700",
    other: "bg-slate-100 text-slate-600",
};
