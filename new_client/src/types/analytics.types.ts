import type { Expense } from ".";

export interface CategoryTotal {
    category: string;
    total: number;
    count: number;
    percentage: number;
}

export interface MonthlyTotal {
    month: string;
    total: number;
    count: number;
}

export interface DashboardStats {
    totalExpenses: number;
    expenseCount: number;
    averageExpense: number;

    highestExpense: Expense | null;
    lowestExpense: Expense | null;
    lastMonthTotal: number;

    currentMonthTotal: number;
    monthlyChange: number;
}

export interface SpendingTrend {
    month: string;
    total: number;
    count: number;
}

export interface AnalyticsState {
    categoryData: CategoryTotal[];
    monthlyData: MonthlyTotal[];
    dashboardStats: DashboardStats | null;
    trends: SpendingTrend[];
    isLoading: boolean;
    error: string | null;
}