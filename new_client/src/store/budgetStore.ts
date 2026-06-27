import { create } from "zustand";
import type { BudgetState, BudgetFormData } from "../types/budget.types";
import {
    getBudgets as getBudgetsService,
    createBudget as createBudgetService,
    updateBudget as updateBudgetService,
    deleteBudget as deleteBudgetService,
} from "../services/budgetService";
import type { AxiosError } from "axios";

interface BudgetStore extends BudgetState {
    fetchBudgets: () => Promise<void>;
    createBudget: (data: BudgetFormData) => Promise<boolean>;
    updateBudget: (id: string, limit: number) => Promise<boolean>;
    deleteBudget: (id: string) => Promise<void>;
    setFilters: (month: number, year: number) => void;
}

const now = new Date();

export const useBudgetStore = create<BudgetStore>((set, get) => ({
    budgets: [],
    isLoading: false,
    error: null,
    filters: {
        month: now.getMonth(),
        year: now.getFullYear(),
    },

    fetchBudgets: async () => {
        const { filters } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await getBudgetsService(filters.month, filters.year);
            if (response.success && response.data) {
                set({ budgets: response.data, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage ?? "Failed to fetch budgets",
                isLoading: false,
            });
        }
    },

    createBudget: async (data: BudgetFormData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await createBudgetService(data);
            if (response.success && response.data) {
                set((state) => ({
                    budgets: [...state.budgets, response.data!],
                    isLoading: false,
                }));
                return true;
            }
            set({ isLoading: false });
            return false;
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage ?? "Failed to create budget",
                isLoading: false,
            });
            return false;
        }
    },

    updateBudget: async (id: string, limit: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await updateBudgetService(id, limit);
            if (response.success && response.data) {
                set((state) => ({
                    budgets: state.budgets.map((b) =>
                        b._id === id ? response.data! : b
                    ),
                    isLoading: false,
                }));
                return true;
            }
            set({ isLoading: false });
            return false;
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage ?? "Failed to update budget",
                isLoading: false,
            });
            return false;
        }
    },

    deleteBudget: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await deleteBudgetService(id);
            set((state) => ({
                budgets: state.budgets.filter((b) => b._id !== id),
                isLoading: false,
            }));
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage ?? "Failed to delete budget",
                isLoading: false,
            });
        }
    },

    setFilters: (month: number, year: number) => {
        set({ filters: { month, year } });
        get().fetchBudgets();
    },
}));
