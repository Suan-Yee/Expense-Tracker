import { create } from "zustand";
import type { GoalState, GoalFormData, GoalUpdateData } from "../types/goal.types";
import {
    getGoals as getGoalsService,
    createGoal as createGoalService,
    updateGoal as updateGoalService,
    deleteGoal as deleteGoalService,
} from "../services/goalService";
import type { AxiosError } from "axios";

interface GoalStore extends GoalState {
    fetchGoals: () => Promise<void>;
    createGoal: (data: GoalFormData) => Promise<boolean>;
    updateGoal: (id: string, data: GoalUpdateData) => Promise<boolean>;
    deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalStore>((set) => ({
    goals: [],
    isLoading: true,
    error: null,

    fetchGoals: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getGoalsService();
            if (response.success && response.data) {
                set({ goals: response.data, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage ?? "Failed to fetch goals",
                isLoading: false,
            });
        }
    },

    createGoal: async (data: GoalFormData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await createGoalService(data);
            if (response.success && response.data) {
                set((state) => ({
                    goals: [response.data!, ...state.goals],
                    isLoading: false,
                }));
                return true;
            }
            set({ isLoading: false });
            return false;
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage ?? "Failed to create goal",
                isLoading: false,
            });
            return false;
        }
    },

    updateGoal: async (id: string, data: GoalUpdateData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await updateGoalService(id, data);
            if (response.success && response.data) {
                set((state) => ({
                    goals: state.goals.map((g) => (g._id === id ? response.data! : g)),
                    isLoading: false,
                }));
                return true;
            }
            set({ isLoading: false });
            return false;
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage ?? "Failed to update goal",
                isLoading: false,
            });
            return false;
        }
    },

    deleteGoal: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await deleteGoalService(id);
            set((state) => ({
                goals: state.goals.filter((g) => g._id !== id),
                isLoading: false,
            }));
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage ?? "Failed to delete goal",
                isLoading: false,
            });
        }
    },
}));
