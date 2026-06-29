import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middlewares/errorHandler";
import Goal from "../models/Goal";
import Expense from "../models/Expense";
import { TransactionType } from "../types";

// GET /api/goals
export const getGoals = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
        sendSuccess(res, goals, "Goals retrieved successfully");
    }
);

// POST /api/goals
export const createGoal = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const { title, targetAmount, currentAmount, deadline, category, color, notes, recordInExpense } = req.body;

        if (!title || !targetAmount) {
            throw new AppError("Title and target amount are required", 400);
        }

        if (targetAmount <= 0) {
            throw new AppError("Target amount must be greater than 0", 400);
        }

        const initialAmount = Number(currentAmount) || 0;

        const goal = await Goal.create({
            userId,
            title,
            targetAmount: Number(targetAmount),
            currentAmount: initialAmount,
            deadline: deadline ? new Date(deadline) : undefined,
            category: category || "other",
            color: color || "emerald",
            notes: notes || "",
        });

        // If there is an initial deposit and recordInExpense is true (default true when initial amount > 0)
        if (initialAmount > 0 && recordInExpense !== false) {
            await Expense.create({
                userId,
                amount: initialAmount,
                type: TransactionType.SAVING,
                category: category || "saving",
                description: `Initial deposit for goal: ${title}`,
                tags: ["goal", title],
                date: new Date(),
            });
        }

        sendSuccess(res, goal, "Goal created successfully", 201);
    }
);

// PUT /api/goals/:id
export const updateGoal = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const goalId = req.params.id;
        const {
            title,
            targetAmount,
            currentAmount,
            deadline,
            category,
            color,
            notes,
            depositAmount,
            withdrawAmount,
            recordInExpense,
        } = req.body;

        const goal = await Goal.findOne({ _id: goalId, userId });
        if (!goal) {
            throw new AppError("Goal not found", 404);
        }

        // Handle deposit
        if (depositAmount && Number(depositAmount) > 0) {
            const dep = Number(depositAmount);
            goal.currentAmount += dep;

            if (recordInExpense !== false) {
                await Expense.create({
                    userId,
                    amount: dep,
                    type: TransactionType.SAVING,
                    category: goal.category || "saving",
                    description: `Deposit to goal: ${goal.title}`,
                    tags: ["goal", goal.title],
                    date: new Date(),
                });
            }
        }

        // Handle withdrawal
        if (withdrawAmount && Number(withdrawAmount) > 0) {
            const wdr = Number(withdrawAmount);
            if (goal.currentAmount < wdr) {
                throw new AppError("Withdrawal amount cannot exceed current goal balance", 400);
            }
            goal.currentAmount -= wdr;

            if (recordInExpense !== false) {
                await Expense.create({
                    userId,
                    amount: wdr,
                    type: TransactionType.INCOME,
                    category: goal.category || "saving",
                    description: `Withdrawal from goal: ${goal.title}`,
                    tags: ["goal", goal.title],
                    date: new Date(),
                });
            }
        }

        // Handle regular updates
        if (title !== undefined) goal.title = title;
        if (targetAmount !== undefined) {
            if (Number(targetAmount) <= 0) throw new AppError("Target amount must be greater than 0", 400);
            goal.targetAmount = Number(targetAmount);
        }
        if (currentAmount !== undefined && !depositAmount && !withdrawAmount) {
            goal.currentAmount = Number(currentAmount);
        }
        if (deadline !== undefined) goal.deadline = deadline ? new Date(deadline) : undefined;
        if (category !== undefined) goal.category = category;
        if (color !== undefined) goal.color = color;
        if (notes !== undefined) goal.notes = notes;

        await goal.save();

        sendSuccess(res, goal, "Goal updated successfully");
    }
);

// DELETE /api/goals/:id
export const deleteGoal = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const goalId = req.params.id;

        const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
        if (!goal) {
            throw new AppError("Goal not found", 404);
        }

        sendSuccess(res, null, "Goal deleted successfully");
    }
);
