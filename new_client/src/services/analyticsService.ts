import api from "./api";
import type { ApiResponse } from "../types";
import type { DashboardStats, DashboardFilters, SpendingTrend, CategoryTotal, MonthlyTotal } from "../types/analytics.types";

export const getDashboardStats = async (filters: DashboardFilters): Promise<ApiResponse<DashboardStats>> => {
    const params: Record<string, string> = { range: filters.range };
    if (filters.range === "custom" && filters.startDate && filters.endDate) {
        params.startDate = filters.startDate;
        params.endDate = filters.endDate;
    }
    if (filters.month) params.month = filters.month;
    if (filters.year) params.year = filters.year;
    const response = await api.get<ApiResponse<DashboardStats>>("/analytics/dashboard", { params });
    return response.data;
};

export const getSpendingTrends = async (filters: DashboardFilters): Promise<ApiResponse<SpendingTrend[]>> => {
    const params: Record<string, string> = { range: filters.range };
    if (filters.range === "custom" && filters.startDate && filters.endDate) {
        params.startDate = filters.startDate;
        params.endDate = filters.endDate;
    }
    if (filters.month) params.month = filters.month;
    if (filters.year) params.year = filters.year;
    const response = await api.get<ApiResponse<SpendingTrend[]>>("/analytics/trends", { params });
    return response.data;
};

export const getCategoryTotals = async (filters?: DashboardFilters): Promise<ApiResponse<CategoryTotal[]>> => {
    const params: Record<string, string> = {};
    if (filters) {
        if (filters.range) params.range = filters.range;
        if (filters.year) params.year = filters.year;
        if (filters.month) params.month = filters.month;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
    }
    const response = await api.get<ApiResponse<CategoryTotal[]>>("/analytics/category", { params });
    return response.data;
};

export const getMonthlyTotals = async (year?: number): Promise<ApiResponse<MonthlyTotal[]>> => {
    const params = year ? { year } : {};
    const response = await api.get<ApiResponse<MonthlyTotal[]>>("/analytics/monthly", { params });
    return response.data;
};

