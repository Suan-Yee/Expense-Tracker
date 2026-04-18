import type { ExpenseFormData } from "../types/expense.types";
import { type ApiResponse, type Expense } from "../types";
import api from "./api";

export const createExpense = async (data: ExpenseFormData) => {
    const response = await api.post<ApiResponse<Expense>>("/expenses", data);
    return response.data;
}

export const getAllExpenses = async () => {
    const response = await api.get<ApiResponse<Expense[]>>("/expenses");
    return response.data;
}