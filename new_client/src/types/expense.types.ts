import { RecurringFrequency, TransactionType } from ".";
import type { Expense } from ".";

export interface ExpenseFormData {
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: string;
    tags?: string[];
    isRecurring?: boolean;
    frequency?: RecurringFrequency;
}

export interface ExpenseFilters {
    category?: string;
    sort?: string;
    search?: string;
    startDate?: string | null;
    endDate?: string | null;
    tags?: string;
    isRecurring?: boolean;
}

export interface ExpenseState {
    expenses: Expense[];
    currentExpense: Expense | null;
    isLoading: boolean;
    error: string | null;
    filters: ExpenseFilters;
    totalCount: number;
    currentPage: number;
    itemsPerPage: number;
}

export interface createExpenseRequest {
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: string;
    tags?: string[];
    isRecurring?: boolean;
    frequency?: RecurringFrequency;
}