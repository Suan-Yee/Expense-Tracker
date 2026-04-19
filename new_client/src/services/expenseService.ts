import type { ExpenseFormData } from "../types/expense.types";
import { type ApiResponse, type Expense } from "../types";
import api from "./api";

export const createExpense = async (data: ExpenseFormData) => {
    const response = await api.post<ApiResponse<Expense>>("/expenses", data);
    return response.data;
}

export const getAllExpenses = async (params?: any) => {
    const response = await api.get<ApiResponse<Expense[]>>("/expenses", { params });
    return response.data;
}

export const updateExpense = async (id: string, data: ExpenseFormData) => {
    const response = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, data);
    return response.data;
}

export const deleteExpense = async (id: string) => {
    const response = await api.delete<ApiResponse<Expense>>(`/expenses/${id}`);
    return response.data;
}