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

export interface Expense {
    id: string;
    userId: string;
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T,
    message?: string;
    errorMessage?: string;
}