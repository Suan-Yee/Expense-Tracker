import { create } from "zustand";
import type { ExpenseFormData, ExpenseState } from "../types/expense.types";
import type { Expense } from "../types";
import { createExpense as createExpenseService, getAllExpenses as getAllExpensesService } from "../services/expenseService";
import type { AxiosError } from "axios";

interface ExpenseStore extends ExpenseState {
    createExpense: (data: ExpenseFormData) => Promise<void>;
    getAllExpenses: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
    expenses: [],
    isLoading: false,
    error: null,
    currentExpense: null,
    totalCount: 0,
    filters: { category: "all", sort: "-date" },

    createExpense: async (data: ExpenseFormData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await createExpenseService(data);
            const newExpense = response.data;
            if (newExpense) {
                set((state) => ({
                    expenses: [...state.expenses, newExpense],
                    isLoading: false,
                    error: null,
                }));
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            set({
                error: err.response?.data?.error ?? "Failed to create expense",
                isLoading: false,
            });
        }
    },

    getAllExpenses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getAllExpensesService();
            if (response.success && response.data) {
                set({
                    expenses: response.data,
                    isLoading: false,
                    totalCount: response.data.length,
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            set({
                error: err.response?.data?.error ?? "Failed to fetch expenses",
                isLoading: false,
            });
        }
    },
}));
