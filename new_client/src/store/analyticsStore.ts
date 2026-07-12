import { create } from "zustand";
import type { DashboardFilters, DashboardStats, SpendingTrend, CategoryTotal, MonthlyTotal } from "../types/analytics.types";
import { getDashboardStats, getSpendingTrends, getCategoryTotals, getMonthlyTotals } from "../services/analyticsService";
import type { AxiosError } from "axios";

interface AnalyticsStore {
    categoryData: CategoryTotal[];
    monthlyData: MonthlyTotal[];
    dashboardStats: DashboardStats | null;
    trends: SpendingTrend[];
    dashFilters: DashboardFilters;
    selectedYear: number;
    isLoading: boolean;
    error: string | null;
    setFilters: (filters: DashboardFilters) => void;
    setSelectedYear: (year: number) => void;
    fetchDashboard: (filters?: DashboardFilters) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
    categoryData: [],
    monthlyData: [],
    dashboardStats: null,
    trends: [],
    dashFilters: { 
        range: "this_year", 
        month: new Date().getMonth().toString(), 
        year: new Date().getFullYear().toString() 
    },
    selectedYear: new Date().getFullYear(),
    isLoading: false,
    error: null,

    setFilters: (filters: DashboardFilters) => {
        const yr = filters.year ? Number(filters.year) : get().selectedYear;
        set({ dashFilters: filters, selectedYear: yr });
        get().fetchDashboard(filters);
    },

    setSelectedYear: (year: number) => {
        const newFilters = { ...get().dashFilters, range: "year" as const, year: year.toString() };
        set({ selectedYear: year, dashFilters: newFilters });
        get().fetchDashboard(newFilters);
    },

    fetchDashboard: async (customFilters?: DashboardFilters) => {
        const filters = customFilters ?? get().dashFilters;
        const year = Number(filters.year || get().selectedYear || new Date().getFullYear());

        if (filters.range === "custom" && (!filters.startDate || !filters.endDate)) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const [statsRes, trendsRes, catRes, monthlyRes] = await Promise.all([
                getDashboardStats(filters),
                getSpendingTrends(filters),
                getCategoryTotals(filters),
                getMonthlyTotals(year),
            ]);
            set({
                dashboardStats: statsRes.data ?? null,
                trends: Array.isArray(trendsRes.data) ? trendsRes.data : [],
                categoryData: Array.isArray(catRes.data) ? catRes.data : [],
                monthlyData: Array.isArray(monthlyRes.data) ? monthlyRes.data : [],
                isLoading: false,
            });
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            set({
                error: err.response?.data?.message ?? "Failed to load analytics data.",
                isLoading: false,
            });
        }
    },
}));
