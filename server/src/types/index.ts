import mongoose, { Document } from "mongoose";

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
    date: Date;
    tags: string[];
    isRecurring: boolean;
    frequency?: RecurringFrequency;
    nextDueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExpense extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: Date;
    tags: string[];
    isRecurring: boolean;
    frequency?: RecurringFrequency;
    nextDueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
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

export interface IUser extends Document {
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

export interface AuthResponse {
    user: Omit<User, "password">
    token?: string;
}

export interface MonthlyTotals {
    month: string;
    income: number;
    expenses: number;
    savings: number;
    total: number;
    count: number;
}

export interface DashboardStats {
    totalExpenses: number;
    totalIncome: number;
    totalSavings: number;
    expenseCount: number;
    averageExpense: number;
    highestExpense: IExpense | null;
    lowestExpense: IExpense | null;
    currentMonthTotal: number;
    lastMonthTotal: number;
    monthlyChange: number;
}

export interface IBudget extends Document {
    userId: mongoose.Types.ObjectId;
    category: string;
    limit: number;
    month: number;   // 0-11
    year: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Budget {
    _id: string;
    userId: string;
    category: string;
    limit: number;
    month: number;
    year: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BudgetWithProgress extends Budget {
    spent: number;
    remaining: number;
    percentage: number;
}

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date;
    category: string;
    color: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Goal {
    _id: string;
    userId: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date;
    category: string;
    color: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}