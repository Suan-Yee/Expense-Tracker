export enum ExpenseCategory {
    FOOD = "food",
    TRANSPORT = "transport",
    UTILITIES = "utilities",
    ENTERTAINMENT = "entertainment",
    HEALTHCARE = "healthcare",
    SHOPPING = "shopping",
    EDUCATION = "education",
    OTHER = "other",
}

export enum TransactionType {
    INCOME = "income",
    EXPENSE = "expense",
    SAVING = "saving",
}

export enum RecurringFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
}

export interface Expense {
    _id: string;
    userId: string;
    amount: number;
    type: TransactionType;
    category: ExpenseCategory | string;
    description: string;
    date: Date | string;
    tags: string[];
    isRecurring: boolean;
    frequency?: RecurringFrequency;
    nextDueDate?: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T,
    message?: string;
    errorMessage?: string;
}