import api from "./api";
import type { ApiResponse } from "../types";
import type { Budget, BudgetFormData } from "../types/budget.types";

export const getBudgets = async (month: number, year: number): Promise<ApiResponse<Budget[]>> => {
    const response = await api.get<ApiResponse<Budget[]>>("/budgets", {
        params: { month, year },
    });
    return response.data;
};

export const createBudget = async (data: BudgetFormData): Promise<ApiResponse<Budget>> => {
    const response = await api.post<ApiResponse<Budget>>("/budgets", data);
    return response.data;
};

export const updateBudget = async (id: string, limit: number): Promise<ApiResponse<Budget>> => {
    const response = await api.put<ApiResponse<Budget>>(`/budgets/${id}`, { limit });
    return response.data;
};

export const deleteBudget = async (id: string): Promise<ApiResponse<Budget>> => {
    const response = await api.delete<ApiResponse<Budget>>(`/budgets/${id}`);
    return response.data;
};
