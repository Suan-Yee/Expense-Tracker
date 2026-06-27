export interface BudgetFormData {
    category: string;
    limit: number;
    month: number;   // 0-11
    year: number;
}

export interface Budget {
    _id: string;
    userId: string;
    category: string;
    limit: number;
    month: number;
    year: number;
    spent: number;
    remaining: number;
    percentage: number;
    createdAt: string;
    updatedAt: string;
}

export interface BudgetFilters {
    month: number;
    year: number;
}

export interface BudgetState {
    budgets: Budget[];
    isLoading: boolean;
    error: string | null;
    filters: BudgetFilters;
}
