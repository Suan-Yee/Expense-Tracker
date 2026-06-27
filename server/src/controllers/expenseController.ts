import { NextFunction, Request, Response } from "express";
import { ExpenseCategory, RecurringFrequency, TransactionType } from "../types";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middlewares/errorHandler";
import Expense from "../models/Expense";

// ---------- helpers ----------

function computeNextDueDate(from: Date, frequency: RecurringFrequency): Date {
    const d = new Date(from);
    switch (frequency) {
        case RecurringFrequency.DAILY:   d.setDate(d.getDate() + 1); break;
        case RecurringFrequency.WEEKLY:  d.setDate(d.getDate() + 7); break;
        case RecurringFrequency.MONTHLY: d.setMonth(d.getMonth() + 1); break;
        case RecurringFrequency.YEARLY:  d.setFullYear(d.getFullYear() + 1); break;
    }
    return d;
}

// ---------- GET all ----------

export const getAllExpenses = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const { category, sort, search, startDate, endDate, tags, isRecurring } = req.query;

        const filter: any = { userId };

        if (category && typeof category === "string" && category !== "all") {
            filter.category = category;
        }
        if (search && typeof search === "string") {
            filter.description = { $regex: search, $options: "i" };
        }
        if ((startDate && typeof startDate === "string") || (endDate && typeof endDate === "string")) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate as string);
            if (endDate)   filter.date.$lte = new Date(endDate as string);
        }
        if (tags && typeof tags === "string") {
            const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
            if (tagList.length) filter.tags = { $in: tagList };
        }
        if (isRecurring === "true") {
            filter.isRecurring = true;
        }

        let query = Expense.find(filter);

        if (sort && typeof sort === "string") {
            const isDesc = sort.startsWith("-");
            const field = isDesc ? sort.slice(1) : sort;
            const validFields = ["amount", "date", "description", "category"];
            if (validFields.includes(field)) {
                query = query.sort({ [field]: isDesc ? -1 : 1 });
            } else {
                query = query.sort({ date: -1 });
            }
        } else {
            query = query.sort({ date: -1 });
        }

        const expenses = await query;
        sendSuccess(res, expenses, `Found ${expenses.length} expenses.`);
    }
);

// ---------- GET by id ----------

export const getExpenseById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const { id } = req.params;

        const expense = await Expense.findById(id);
        if (!expense) throw new AppError("Expense Not Found", 404);
        if (expense.userId.toString() !== userId)
            throw new AppError("Unauthorized access to this expense", 403);

        sendSuccess(res, expense, "Expense retrieved successfully.");
    }
);

// ---------- POST create ----------

export const createExpense = asyncHandler(
    async (req: Request, res: Response) => {
        const { amount, type, category, description, date, tags, isRecurring, frequency } = req.body;
        const userId = req.userId;

        if (!amount)      throw new AppError("Amount is required", 400);
        if (!type)        throw new AppError("Transaction type is required", 400);
        if (!category)    throw new AppError("Category is required", 400);
        if (!description) throw new AppError("Description is required", 400);
        if (typeof amount !== "number") throw new AppError("Amount must be a number", 400);
        if (amount <= 0)  throw new AppError("Amount must be greater than 0", 400);
        if (amount > 1000000) throw new AppError("Amount cannot exceed 1,000,000", 400);

        const validTypes = Object.values(TransactionType);
        if (!validTypes.includes(type))
            throw new AppError(`Invalid transaction type. Must be one of: ${validTypes.join(", ")}`, 400);

        const validCategories = Object.values(ExpenseCategory);
        if (!validCategories.includes(category))
            throw new AppError(`Invalid category. Must be one of: ${validCategories.join(", ")}`, 400);

        if (description.length < 3)   throw new AppError("Description must be at least 3 characters", 400);
        if (description.length > 100) throw new AppError("Description cannot exceed 100 characters", 400);

        // Validate tags
        const cleanedTags: string[] = [];
        if (tags && Array.isArray(tags)) {
            for (const tag of tags) {
                if (typeof tag !== "string") throw new AppError("Each tag must be a string", 400);
                const t = tag.trim().toLowerCase();
                if (t.length > 30) throw new AppError("Each tag must be 30 characters or less", 400);
                if (t) cleanedTags.push(t);
            }
        }

        // Validate recurring
        let resolvedFrequency: RecurringFrequency | undefined;
        let nextDueDate: Date | undefined;
        if (isRecurring) {
            if (!frequency) throw new AppError("frequency is required when isRecurring is true", 400);
            const validFreqs = Object.values(RecurringFrequency);
            if (!validFreqs.includes(frequency))
                throw new AppError(`Invalid frequency. Must be one of: ${validFreqs.join(", ")}`, 400);
            resolvedFrequency = frequency;
            const baseDate = date ? new Date(date) : new Date();
            nextDueDate = computeNextDueDate(baseDate, frequency);
        }

        const newExpense = new Expense({
            userId,
            amount,
            type,
            category,
            description,
            date: date ? new Date(date) : new Date(),
            tags: cleanedTags,
            isRecurring: !!isRecurring,
            frequency: resolvedFrequency,
            nextDueDate,
        });

        const saved = await newExpense.save();
        sendSuccess(res, saved, "Expense created successfully", 201);
    }
);

// ---------- PUT update ----------

export const updateExpense = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const { id } = req.params;
        const { amount, type, category, description, date, tags, isRecurring, frequency } = req.body;

        const expense = await Expense.findById(id);
        if (!expense) throw new AppError("Expense not found", 404);
        if (expense.userId.toString() !== userId)
            throw new AppError("Unauthorized access to this expense", 403);

        if (type !== undefined) {
            const validTypes = Object.values(TransactionType);
            if (!validTypes.includes(type))
                throw new AppError(`Invalid transaction type. Must be one of: ${validTypes.join(", ")}`, 400);
            expense.type = type;
        }

        if (amount !== undefined) {
            if (typeof amount !== "number") throw new AppError("Amount must be a number", 400);
            if (amount <= 0) throw new AppError("Amount must be greater than 0", 400);
            if (amount > 1000000) throw new AppError("Amount cannot exceed 1,000,000", 400);
            expense.amount = amount;
        }

        if (category !== undefined) {
            const validCategories = Object.values(ExpenseCategory);
            if (!validCategories.includes(category))
                throw new AppError(`Invalid category. Must be one of: ${validCategories.join(", ")}`, 400);
            expense.category = category;
        }

        if (description !== undefined) {
            if (description.length < 3)   throw new AppError("Description must be at least 3 characters", 400);
            if (description.length > 100) throw new AppError("Description cannot exceed 100 characters", 400);
            expense.description = description;
        }

        if (date !== undefined) {
            expense.date = new Date(date);
        }

        if (tags !== undefined && Array.isArray(tags)) {
            const cleanedTags: string[] = [];
            for (const tag of tags) {
                const t = (tag as string).trim().toLowerCase();
                if (t.length > 30) throw new AppError("Each tag must be 30 characters or less", 400);
                if (t) cleanedTags.push(t);
            }
            expense.tags = cleanedTags;
        }

        if (isRecurring !== undefined) {
            expense.isRecurring = !!isRecurring;
            if (!isRecurring) {
                expense.frequency = undefined;
                expense.nextDueDate = undefined;
            }
        }

        if (isRecurring && frequency !== undefined) {
            const validFreqs = Object.values(RecurringFrequency);
            if (!validFreqs.includes(frequency))
                throw new AppError(`Invalid frequency. Must be one of: ${validFreqs.join(", ")}`, 400);
            expense.frequency = frequency;
            const baseDate = expense.date || new Date();
            expense.nextDueDate = computeNextDueDate(baseDate, frequency);
        }

        const updated = await expense.save();
        sendSuccess(res, updated, "Expense updated successfully");
    }
);

// ---------- DELETE ----------

export const deleteExpense = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.userId;
        const { id } = req.params;

        const expense = await Expense.findById(id);
        if (!expense) throw new AppError("Expense not found", 404);
        if (expense.userId.toString() !== userId)
            throw new AppError("Unauthorized access to this expense", 403);

        await Expense.findByIdAndDelete(id);
        sendSuccess(res, null, "Expense deleted successfully.");
    }
);

// ---------- POST generate-recurring ----------
// Called on app load — creates missed occurrences for all due recurring transactions

export const generateRecurring = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.userId;
        const now = new Date();

        const dueRecurring = await Expense.find({
            userId,
            isRecurring: true,
            nextDueDate: { $lte: now },
        });

        if (dueRecurring.length === 0) {
            return sendSuccess(res, { generated: 0 }, "No recurring expenses due.");
        }

        let generated = 0;

        for (const source of dueRecurring) {
            // Keep generating until nextDueDate is in the future
            while (source.nextDueDate && source.nextDueDate <= now) {
                const newEntry = new Expense({
                    userId:      source.userId,
                    amount:      source.amount,
                    type:        source.type,
                    category:    source.category,
                    description: source.description,
                    date:        source.nextDueDate,
                    tags:        source.tags,
                    isRecurring: false, // generated copies are not templates
                    frequency:   undefined,
                    nextDueDate: undefined,
                });
                await newEntry.save();
                generated++;

                // Advance the template's nextDueDate
                source.nextDueDate = computeNextDueDate(source.nextDueDate, source.frequency!);
            }
            await source.save();
        }

        sendSuccess(res, { generated }, `Generated ${generated} recurring expense(s).`);
    }
);
