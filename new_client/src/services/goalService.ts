import api from "./api";
import type { ApiResponse } from "../types";
import type { Goal, GoalFormData, GoalUpdateData } from "../types/goal.types";

export const getGoals = async (): Promise<ApiResponse<Goal[]>> => {
    const response = await api.get<ApiResponse<Goal[]>>("/goals");
    return response.data;
};

export const createGoal = async (data: GoalFormData): Promise<ApiResponse<Goal>> => {
    const response = await api.post<ApiResponse<Goal>>("/goals", data);
    return response.data;
};

export const updateGoal = async (id: string, data: GoalUpdateData): Promise<ApiResponse<Goal>> => {
    const response = await api.put<ApiResponse<Goal>>(`/goals/${id}`, data);
    return response.data;
};

export const deleteGoal = async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/goals/${id}`);
    return response.data;
};
