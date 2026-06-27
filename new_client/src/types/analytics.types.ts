import type { Expense } from ".";

export interface CategoryTotal {
    category: string;
    total: number;
    count: number;
    percentage: number;
}

export interface MonthlyTotal {
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
    highestExpense: Expense | null;
    lowestExpense: Expense | null;
    currentMonthTotal: number;
    lastMonthTotal: number;
    monthlyChange: number;
}

export interface SpendingTrend {
    month: string;
    income: number;
    expenses: number;
    savings: number;
    total: number;
    count: number;
}

export type DashboardRange = "this_month" | "last_7_days" | "last_month" | "last_3_months" | "this_year" | "custom" | "month" | "year";

export interface DashboardFilters {
    range: DashboardRange;
    startDate?: string | null;
    endDate?: string | null;
    month?: string | null;
    year?: string | null;
}

export interface AnalyticsState {
    categoryData: CategoryTotal[];
    monthlyData: MonthlyTotal[];
    dashboardStats: DashboardStats | null;
    trends: SpendingTrend[];
    filters: DashboardFilters;
    isLoading: boolean;
    error: string | null;
}