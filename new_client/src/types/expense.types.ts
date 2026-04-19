import type { Expense } from ".";

export interface ExpenseFormData {
    amount: number;
    category: string;
    description: string;
    date: string;
}

export interface ExpenseFilters {
    category?: string;
    sort?: string;

    search?: string;
    startDate?: string | null;
    endDate?: string | null;
}

export interface ExpenseState {
    expenses: Expense[];
    currentExpense: Expense | null;
    isLoading: boolean;
    error: string | null;
    filters: ExpenseFilters;
    totalCount: number;
}

export interface createExpenseRequest {
    amount: number;
    category: string;
    description: string;
    date: string;
}