import { NextFunction, Request, Response } from "express";
import { ExpenseCategory } from "../types";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middlewares/errorHandler";
import Expense from "../models/Expense";

// export const mockExpenses: Expense[] = [
//     {
//         id: "exp_001",
//         userId: "user_001",
//         amount: 12.5,
//         category: ExpenseCategory.FOOD,
//         description: "Lunch at cafe",
//         date: new Date("2026-03-20"),
//         createdAt: new Date("2026-03-20T12:30:00"),
//         updatedAt: new Date("2026-03-20T12:30:00"),
//     },
//     {
//         id: "exp_002",
//         userId: "user_001",
//         amount: 3.0,
//         category: ExpenseCategory.TRANSPORT,
//         description: "Bus fare",
//         date: new Date("2026-03-21"),
//         createdAt: new Date("2026-03-21T08:00:00"),
//         updatedAt: new Date("2026-03-21T08:00:00"),
//     },
//     {
//         id: "exp_003",
//         userId: "user_002",
//         amount: 45.99,
//         category: ExpenseCategory.SHOPPING,
//         description: "Clothes purchase",
//         date: new Date("2026-03-18"),
//         createdAt: new Date("2026-03-18T16:45:00"),
//         updatedAt: new Date("2026-03-18T16:45:00"),
//     },
//     {
//         id: "exp_004",
//         userId: "user_001",
//         amount: 120.0,
//         category: ExpenseCategory.UTILITIES,
//         description: "Electricity bill",
//         date: new Date("2026-03-01"),
//         createdAt: new Date("2026-03-01T09:15:00"),
//         updatedAt: new Date("2026-03-01T09:15:00"),
//     },
//     {
//         id: "exp_005",
//         userId: "user_003",
//         amount: 25.0,
//         category: ExpenseCategory.ENTERTAINMENT,
//         description: "Movie tickets",
//         date: new Date("2026-03-22"),
//         createdAt: new Date("2026-03-22T19:00:00"),
//         updatedAt: new Date("2026-03-22T19:00:00"),
//     },
//     {
//         id: "exp_006",
//         userId: "user_002",
//         amount: 60.0,
//         category: ExpenseCategory.HEALTHCARE,
//         description: "Doctor consultation",
//         date: new Date("2026-03-15"),
//         createdAt: new Date("2026-03-15T10:20:00"),
//         updatedAt: new Date("2026-03-15T10:20:00"),
//     },
//     {
//         id: "exp_007",
//         userId: "user_001",
//         amount: 15.75,
//         category: ExpenseCategory.FOOD,
//         description: "Dinner takeaway",
//         date: new Date("2026-03-23"),
//         createdAt: new Date("2026-03-23T20:10:00"),
//         updatedAt: new Date("2026-03-23T20:10:00"),
//     },
//     {
//         id: "exp_008",
//         userId: "user_003",
//         amount: 200.0,
//         category: ExpenseCategory.EDUCATION,
//         description: "Online course fee",
//         date: new Date("2026-03-10"),
//         createdAt: new Date("2026-03-10T14:00:00"),
//         updatedAt: new Date("2026-03-10T14:00:00"),
//     },
//     {
//         id: "exp_009",
//         userId: "user_002",
//         amount: 8.5,
//         category: ExpenseCategory.TRANSPORT,
//         description: "Taxi ride",
//         date: new Date("2026-03-24"),
//         createdAt: new Date("2026-03-24T18:25:00"),
//         updatedAt: new Date("2026-03-24T18:25:00"),
//     },
//     {
//         id: "exp_010",
//         userId: "user_001",
//         amount: 5.0,
//         category: ExpenseCategory.OTHER,
//         description: "Stationery",
//         date: new Date("2026-03-19"),
//         createdAt: new Date("2026-03-19T11:05:00"),
//         updatedAt: new Date("2026-03-19T11:05:00"),
//     },
//     {
//         id: "exp_011",
//         userId: "user_001",
//         amount: 18.25,
//         category: ExpenseCategory.FOOD,
//         description: "Breakfast",
//         date: new Date("2026-04-02"),
//         createdAt: new Date("2026-04-02T08:10:00"),
//         updatedAt: new Date("2026-04-02T08:10:00"),
//     },
//     {
//         id: "exp_012",
//         userId: "user_001",
//         amount: 40.0,
//         category: ExpenseCategory.TRANSPORT,
//         description: "Monthly bus pass",
//         date: new Date("2026-04-03"),
//         createdAt: new Date("2026-04-03T07:30:00"),
//         updatedAt: new Date("2026-04-03T07:30:00"),
//     },
// ];

export const getAllExpenses = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;

        // const userExpenses = mockExpenses.filter(expense => expense.userId === userId);
        const { category, sort } = req.query;

        const filter: {userId: string, category?: string} = {
            userId,
        }
        
        if (category && typeof category === "string") {
            filter.category = category
        }
        let query = Expense.find(filter);

        if (sort && typeof sort === "string") {
            if (sort === "amount") {
                // copiedExpenses.sort((a, b) => a.amount - b.amount);
                query = query.sort({ amount: 1 });
            } else if (sort === "-amount") {
                // copiedExpenses.sort((a, b) => b.amount - a.amount);
                query = query.sort({ amount: -1 });
            } else if (sort === "date") {
                // copiedExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                query = query.sort({ date: 1 });
            } else if (sort === "-date"){
                // copiedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                query = query.sort({ date: -1 });
            }
        }
        const expenses = await query;

        sendSuccess(res, expenses, `Found ${expenses.length} expenses.`);
    }
)

export const getExpenseById = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
    
        const userId = req.userId;
        const { id } = req.params;

        const expense = await Expense.findById(id);

        if (!expense) {
            throw new AppError("Expense Not Found", 404);
        }

        if(expense.userId.toString() !== userId){
            throw new AppError("Unauthorized access to this expense", 403);
        }

        sendSuccess(res, expense, "Expense retrieved successfully.")
    }
)

export const createExpense = asyncHandler(
    async (req: Request, res: Response) => {
    
        const { amount, category, description, date } = req.body
        const userId = req.userId

        if (!amount) {
            throw new AppError("Amount is required", 400);
        }
        if (!category) {
            throw new AppError("Category is required", 400);
        }
        if (!description) {
            throw new AppError("Description is required", 400);
        }
        if (typeof amount !== "number") {
            throw new AppError("Amount must be a number", 400);
        }
        if (amount <= 0) {
            throw new AppError("Amount must be greater than 0", 400);
        }
        if (amount > 1000000) {
            throw new AppError("Amount cannot exceed 1,000,000", 400);
        }

        const validCategories = Object.values(ExpenseCategory)
        if (!validCategories.includes(category)) {
            throw new AppError(
                `Invalid category. Must be on of: ${validCategories.join(", ")}`, 400
            );
        }

        if (description.length < 3) {
            throw new AppError("Description must be at least 3 characters", 400);
        }
        if (description.length > 100) {
            throw new AppError("Description cannot exceed 100 characters", 400);
        }

        const newExpense = new Expense({
            userId,
            amount,
            category,
            description,
            date: date ? new Date(date) : new Date(),
        })

        const createdExpenses = await newExpense.save();

        sendSuccess(res, createdExpenses, "Expense created successfully", 201);
    }
)

export const updateExpense = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
    
        const userId = req.userId;
        const { id } = req.params
        const { amount, category, description, date } = req.body

        // const expenseId = mockExpenses.findIndex(expense => expense.id === id && expense.userId === userId)
        const expense = await Expense.findById(id);

        if (!expense) {
            throw new AppError("Expense not found", 404);
        }

        if (expense.userId.toString() !== userId){
            throw new AppError("Unauthorized access to this expense", 403);
        }

        if (amount !== undefined) {
            if (typeof amount !== "number") {
                throw new AppError("Amount must be a number", 400);
            }

            if (amount <= 0 ) {
                throw new AppError("Amount must be greater than 0", 400);
            }

            if (amount > 1000000) {
                throw new AppError("Amount cannot exceed 1,000,000", 400);
            }
            expense.amount = amount;
        }

        if (category !== undefined) {
            const validCategories = Object.values(ExpenseCategory);
            if (!validCategories.includes(category)) {
                throw new AppError(`Invalid category. Must be one of: ${validCategories.join(", ")}`, 400)
            }
            expense.category = category;
        }

        if (description !== undefined) {
            if (description.length < 3 ) {
                throw new AppError("Description must be at least 3 characters", 400);
            }
            if (description.length > 100) {
                throw new AppError("Description cannot exceed 100 characters", 400);
            }
            expense.description = description;
        }

        if (date !== undefined) {
            expense.date = new Date(date);
        }

        const updatedExpense = await expense.save();

        sendSuccess(res, updatedExpense, "Expense updated successfully")
    }
)

export const deleteExpense = asyncHandler(
    async (req: Request, res: Response) => {

        const userId = req.userId;
        const { id } = req.params

        const expense = await Expense.findById(id);

        if (!expense) {
            throw new AppError("Expense not found", 404);
        }

        if (expense.userId.toString() !== userId){
            throw new AppError("Unauthorized access to this expense", 403);
        }

        await Expense.findByIdAndDelete(id);

        sendSuccess(res, null, "Expense deleted successfully.");
    }
)
