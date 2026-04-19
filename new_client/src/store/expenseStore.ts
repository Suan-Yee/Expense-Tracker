import { create } from "zustand";
import type { ExpenseFormData, ExpenseState } from "../types/expense.types";
import { createExpense as createExpenseService, deleteExpense as deleteExpenseService, getAllExpenses as getAllExpensesService, updateExpense as updateExpenseService } from "../services/expenseService";
import type { AxiosError } from "axios";

interface ExpenseStore extends ExpenseState {
    createExpense: (data: ExpenseFormData) => Promise<void>;
    getAllExpenses: () => Promise<void>;
    updateExpense: (id: string, data: ExpenseFormData) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    setFilters: (newFilters: Partial<ExpenseFilters>) => void;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
    expenses: [],
    isLoading: false,
    error: null,
    currentExpense: null,
    totalCount: 0,
    filters: { category: "all", sort: "-date", search: "", startDate: null, endDate: null },

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
        const { filters } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await getAllExpensesService(filters);
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

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
        get().getAllExpenses();
    },

    updateExpense: async (id, data) => {
        set({ isLoading: true, error: null });

        try {
            const response = await updateExpenseService(id, data);
            const updatedExpense = response.data;
            if (updatedExpense) {
                set((state) => ({
                    isLoading: false,
                    error: null,
                    expenses: state.expenses.map((exp) => (exp._id === id ? updatedExpense : exp)),
                    totalCount: state.totalCount,
                }));
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            set({
                error: err.response?.data?.error ?? "Failed to update expense",
                isLoading: false,
            });
        }
    },

    deleteExpense: async (id) => {
        set({ isLoading:true, error: null });

        try {
            await deleteExpenseService(id);

            set((stage) => ({
                isLoading: false,
                error: null,
                expenses: stage.expenses.filter(expense => expense._id !== id),
                totalCount: stage.totalCount - 1,
            })) 
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            set({
                error: err.response?.data?.error ?? "Failed to delete expenses",
                isLoading: false,
            })
        }
    }
}));
