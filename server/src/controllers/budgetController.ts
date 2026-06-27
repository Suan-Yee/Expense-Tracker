import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middlewares/errorHandler";
import Budget from "../models/Budget";
import Expense from "../models/Expense";
import { BudgetWithProgress, ExpenseCategory } from "../types";

// Helper: calculate spent amount for a given category/month/year
const calculateSpent = async (
    userId: string,
    category: string,
    month: number,
    year: number
): Promise<number> => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const expenses = await Expense.find({
        userId,
        category,
        type: "expense",
        date: { $gte: startDate, $lte: endDate },
    });

    return expenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
};

// GET /api/budgets?month=&year=
export const getBudgets = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const now = new Date();

        const month = req.query.month !== undefined
            ? parseInt(req.query.month as string)
            : now.getMonth();
        const year = req.query.year !== undefined
            ? parseInt(req.query.year as string)
            : now.getFullYear();

        if (isNaN(month) || month < 0 || month > 11) {
            throw new AppError("Month must be between 0 and 11", 400);
        }
        if (isNaN(year) || year < 2000 || year > now.getFullYear() + 5) {
            throw new AppError("Invalid year", 400);
        }

        const budgets = await Budget.find({ userId, month, year });

        // Calculate spent for each budget
        const budgetsWithProgress: BudgetWithProgress[] = await Promise.all(
            budgets.map(async (budget) => {
                const spent = await calculateSpent(
                    userId!,
                    budget.category,
                    month,
                    year
                );
                const spent_rounded = Math.round(spent * 100) / 100;
                const remaining = Math.round((budget.limit - spent) * 100) / 100;
                const percentage =
                    budget.limit > 0
                        ? Math.round((spent / budget.limit) * 1000) / 10
                        : 0;

                return {
                    _id: budget._id.toString(),
                    userId: budget.userId.toString(),
                    category: budget.category,
                    limit: budget.limit,
                    month: budget.month,
                    year: budget.year,
                    createdAt: budget.createdAt,
                    updatedAt: budget.updatedAt,
                    spent: spent_rounded,
                    remaining,
                    percentage,
                };
            })
        );

        sendSuccess(res, budgetsWithProgress, `Found ${budgetsWithProgress.length} budgets.`);
    }
);

// POST /api/budgets
export const createBudget = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const { category, limit, month, year } = req.body;

        // Validation
        if (!category) throw new AppError("Category is required", 400);
        if (limit === undefined || limit === null) throw new AppError("Limit is required", 400);
        if (month === undefined || month === null) throw new AppError("Month is required", 400);
        if (year === undefined || year === null) throw new AppError("Year is required", 400);

        if (typeof limit !== "number" || limit <= 0) {
            throw new AppError("Limit must be a positive number", 400);
        }
        if (limit > 10000000) {
            throw new AppError("Limit cannot exceed 10,000,000", 400);
        }

        const validCategories = Object.values(ExpenseCategory);
        if (!validCategories.includes(category)) {
            throw new AppError(
                `Invalid category. Must be one of: ${validCategories.join(", ")}`,
                400
            );
        }

        const parsedMonth = parseInt(month);
        const parsedYear = parseInt(year);

        if (isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11) {
            throw new AppError("Month must be between 0 and 11", 400);
        }
        if (isNaN(parsedYear) || parsedYear < 2000) {
            throw new AppError("Invalid year", 400);
        }

        // Check for duplicate
        const existing = await Budget.findOne({
            userId,
            category,
            month: parsedMonth,
            year: parsedYear,
        });

        if (existing) {
            throw new AppError(
                `A budget for "${category}" already exists for this month.`,
                409
            );
        }

        const newBudget = new Budget({
            userId,
            category,
            limit,
            month: parsedMonth,
            year: parsedYear,
        });

        const saved = await newBudget.save();

        // Return with progress calculated
        const spent = await calculateSpent(userId!, category, parsedMonth, parsedYear);
        const spent_rounded = Math.round(spent * 100) / 100;
        const remaining = Math.round((limit - spent) * 100) / 100;
        const percentage = limit > 0 ? Math.round((spent / limit) * 1000) / 10 : 0;

        const response: BudgetWithProgress = {
            _id: saved._id.toString(),
            userId: saved.userId.toString(),
            category: saved.category,
            limit: saved.limit,
            month: saved.month,
            year: saved.year,
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
            spent: spent_rounded,
            remaining,
            percentage,
        };

        sendSuccess(res, response, "Budget created successfully.", 201);
    }
);

// PUT /api/budgets/:id
export const updateBudget = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const { id } = req.params;
        const { limit } = req.body;

        const budget = await Budget.findById(id);

        if (!budget) throw new AppError("Budget not found", 404);
        if (budget.userId.toString() !== userId) {
            throw new AppError("Unauthorized access to this budget", 403);
        }

        if (limit !== undefined) {
            if (typeof limit !== "number" || limit <= 0) {
                throw new AppError("Limit must be a positive number", 400);
            }
            if (limit > 10000000) {
                throw new AppError("Limit cannot exceed 10,000,000", 400);
            }
            budget.limit = limit;
        }

        const updated = await budget.save();

        const spent = await calculateSpent(userId!, budget.category, budget.month, budget.year);
        const spent_rounded = Math.round(spent * 100) / 100;
        const remaining = Math.round((updated.limit - spent) * 100) / 100;
        const percentage =
            updated.limit > 0 ? Math.round((spent / updated.limit) * 1000) / 10 : 0;

        const response: BudgetWithProgress = {
            _id: updated._id.toString(),
            userId: updated.userId.toString(),
            category: updated.category,
            limit: updated.limit,
            month: updated.month,
            year: updated.year,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
            spent: spent_rounded,
            remaining,
            percentage,
        };

        sendSuccess(res, response, "Budget updated successfully.");
    }
);

// DELETE /api/budgets/:id
export const deleteBudget = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const { id } = req.params;

        const budget = await Budget.findById(id);

        if (!budget) throw new AppError("Budget not found", 404);
        if (budget.userId.toString() !== userId) {
            throw new AppError("Unauthorized access to this budget", 403);
        }

        await Budget.findByIdAndDelete(id);

        sendSuccess(res, null, "Budget deleted successfully.");
    }
);
