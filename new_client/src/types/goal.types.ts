export interface GoalFormData {
    title: string;
    targetAmount: number;
    currentAmount?: number;
    deadline?: string;
    category: string;
    color: string;
    notes?: string;
    recordInExpense?: boolean;
}

export interface GoalUpdateData {
    title?: string;
    targetAmount?: number;
    currentAmount?: number;
    deadline?: string;
    category?: string;
    color?: string;
    notes?: string;
    depositAmount?: number;
    withdrawAmount?: number;
    recordInExpense?: boolean;
}

export interface Goal {
    _id: string;
    userId: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    category: string;
    color: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GoalState {
    goals: Goal[];
    isLoading: boolean;
    error: string | null;
}
