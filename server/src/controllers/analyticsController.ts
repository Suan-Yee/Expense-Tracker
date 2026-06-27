import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middlewares/errorHandler";
import { DashboardStats, ExpenseCategory, MonthlyTotals } from "../types";
import Expense from "../models/Expense";

const getDateRangeFromQuery = (query: any) => {
    const { range, startDate, endDate } = query;
    const now = new Date();
    let start: Date = new Date(0);
    let end: Date = now;

    if (!range) {
        return { start, end };
    }

    switch (range) {
        case "last_month":
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            break;
        case "last_3_months":
            start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            break;
        case "this_year":
            start = new Date(now.getFullYear(), 0, 1);
            break;
        case "custom":
            if (!startDate || !endDate) {
                throw new AppError("startDate and endDate are required for custom range", 400);
            }
            start = new Date(startDate as string);
            end = new Date(endDate as string);
            end.setHours(23, 59, 59, 999);
            break;
        case "month":
            const m = parseInt(query.month as string) || now.getMonth();
            const y = parseInt(query.year as string) || now.getFullYear();
            start = new Date(y, m, 1);
            end = new Date(y, m + 1, 0, 23, 59, 59, 999);
            break;
        case "year":
            const yearVal = parseInt(query.year as string) || now.getFullYear();
            start = new Date(yearVal, 0, 1);
            end = new Date(yearVal, 11, 31, 23, 59, 59, 999);
            break;
        case "this_month":
        default:
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
    }
    return { start, end };
};

export const getExpenseByCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.userId;
    const allUserExpenses = await Expense.find({ userId });

    if (allUserExpenses.length === 0) {
        sendSuccess(res, [], "No expenses found. Create an expense to get started.");
        return;
    }

    const { start, end } = getDateRangeFromQuery(req.query);
    const userExpenses = allUserExpenses.filter(exp => {
        const d = new Date(exp.date);
        return d >= start && d <= end;
    });

    const categoryTotals = userExpenses.reduce((acc, expense) => {
        // Fallback for old data: check if type is expense OR amount is negative
        const isExpense = expense.type === "expense" || (expense.type === undefined && expense.amount < 0);
        if (!isExpense) return acc;
        
        const category = expense.category || "other";
        if (!acc[category]) {
            acc[category] = { total: 0, count: 0 }
        }

        acc[category].total += Math.abs(expense.amount);
        acc[category].count += 1;
        return acc;
    }, {} as Record<string, { total: number, count: number }>);

    const totalSpending = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.total, 0);

    const categoryArray = Object.entries(categoryTotals).map(([category, cat]) => ({
        category,
        count: cat.count,
        total: Math.round(cat.total * 100) / 100,
        percentage: totalSpending > 0 ? Math.round((cat.total / totalSpending) * 1000) / 10 : 0,
    }));

    categoryArray.sort((a, b) => b.total - a.total)
    sendSuccess(res, categoryArray, "Category breakdown retrieved", 200)
})

export const getMonthlyTotal = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.userId;
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear()

    if (isNaN(year)) {
        throw new AppError("Year must be a valid number", 400);
    }

    const currentYear = new Date().getFullYear()
    if (year < 2000 || year > currentYear + 1) {
        throw new AppError(`Year must be between 2000 and ${currentYear}`, 400);
    }

    const userExpenses = await Expense.find({ userId });

    const yearExpenses = userExpenses.filter((exp) => {
        const expenseYear = new Date(exp.date).getFullYear();
        return expenseYear === year;
    })

    if (userExpenses.length === 0) {
        return sendSuccess(res, [], `No expenses found for ${year}`);
    }

    const monthlyTotals = yearExpenses.reduce((acc, expense) => {
        const monthString = getMonthString(new Date(expense.date));

        if (!acc[monthString]) {
            acc[monthString] = {
                month: monthString,
                income: 0,
                expenses: 0,
                savings: 0,
                total: 0,
                count: 0
            };
        }

        const isIncome = expense.type === "income" || (expense.type === undefined && expense.amount > 0);
        const isSaving = expense.type === "saving";
        
        if (isIncome) {
            acc[monthString].income += Math.abs(expense.amount);
        } else if (isSaving) {
            acc[monthString].savings += Math.abs(expense.amount);
        } else {
            acc[monthString].expenses += Math.abs(expense.amount);
        }

        acc[monthString].total = acc[monthString].income - acc[monthString].expenses;
        acc[monthString].count += 1;

        return acc;
    }, {} as Record<string, MonthlyTotals>);

    const monthlyArray = Object.values(monthlyTotals);
    monthlyArray.sort((a, b) => a.month.localeCompare(b.month));

    monthlyArray.forEach(month => {
        month.total = Math.round(month.total * 100) / 100;
    });

    sendSuccess(res, monthlyArray, `Monthly total for ${year} retrieved.`);
})

export const getDashboardStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { start, end } = getDateRangeFromQuery({ ...req.query, range: req.query.range || "this_month" });

    const allUserExpenses = await Expense.find({ userId });

    if (allUserExpenses.length === 0) {
        sendSuccess(res, {
            totalExpenses: 0,
            totalIncome: 0,
            totalSavings: 0,
            expenseCount: 0,
            averageExpense: 0,
            highestExpense: null,
            lowestExpense: null,
            currentMonthTotal: 0,
            lastMonthTotal: 0,
            monthlyChange: 0,
        }, "No expenses found. Create an expense to get started.", 200);
        return;
    }

    // Filter by selected range for general stats
    const expensesInRange = allUserExpenses.filter(exp => {
        const d = new Date(exp.date);
        return d >= start && d <= end;
    });

    const totalIncome = expensesInRange
        .filter(e => e.type === "income" || (e.type === undefined && e.amount > 0))
        .reduce((sum, e) => sum + Math.abs(e.amount), 0);

    const totalExpenses = expensesInRange
        .filter(e => e.type === "expense" || (e.type === undefined && e.amount < 0))
        .reduce((sum, e) => sum + Math.abs(e.amount), 0);

    const totalSavings = expensesInRange
        .filter(e => e.type === "saving")
        .reduce((sum, e) => sum + Math.abs(e.amount), 0);

    const expenseCount = expensesInRange.filter(e => e.type === "expense" || (e.type === undefined && e.amount < 0)).length;
    const averageExpense = expenseCount > 0 ? Math.round((totalExpenses / expenseCount) * 100) / 100 : 0;

    const sortedByAbs = expensesInRange
        .filter(e => e.type === "expense" || (e.type === undefined && e.amount < 0))
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

    const highestExpense = sortedByAbs.length > 0 ? sortedByAbs[0] : null;
    const lowestExpense = sortedByAbs.length > 0 ? sortedByAbs[sortedByAbs.length - 1] : null;

    // Fixed metrics for current and last month (regardless of selection)
    const currentMonthStr = getCurrentMonth();
    const lastMonthStr = getLastMonth();

    const currentMonthExpenses = allUserExpenses.filter(expense => getMonthString(new Date(expense.date)) === currentMonthStr);
    const currentMonthTotal = currentMonthExpenses
        .filter(e => e.type === "expense" || (e.type === undefined && e.amount < 0))
        .reduce((sum, exp) => sum + Math.abs(exp.amount), 0);

    const lastMonthExpenses = allUserExpenses.filter(expense => getMonthString(new Date(expense.date)) === lastMonthStr);
    const lastMonthTotal = lastMonthExpenses
        .filter(e => e.type === "expense" || (e.type === undefined && e.amount < 0))
        .reduce((sum, exp) => sum + Math.abs(exp.amount), 0);

    let monthlyChange = 0;
    if (lastMonthTotal > 0) {
        monthlyChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        monthlyChange = Math.round(monthlyChange * 10) / 10;
    } else if (currentMonthTotal > 0) {
        monthlyChange = 100;
    }

    const stats: DashboardStats = {
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        expenseCount,
        averageExpense,
        highestExpense: highestExpense as any,
        lowestExpense: lowestExpense as any,
        currentMonthTotal: Math.round(currentMonthTotal * 100) / 100,
        lastMonthTotal: Math.round(lastMonthTotal * 100) / 100,
        monthlyChange,
    };

    sendSuccess(res, stats, "Dashboard statistics retrieved.");
});

export const getSpendingTrends = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { range, year, month, startDate, endDate } = req.query;

    const userExpenses = await Expense.find({ userId });
    
    const trends = [];
    const now = new Date();
    let trendMonths: Date[] = [];

    if (range === "year" || range === "this_year") {
        const y = range === "this_year" ? now.getFullYear() : (parseInt(year as string) || now.getFullYear());
        for (let i = 0; i < 12; i++) {
            trendMonths.push(new Date(y, i, 1));
        }
    } else if (range === "month") {
        const m = parseInt(month as string) || now.getMonth();
        const y = parseInt(year as string) || now.getFullYear();
        for (let i = 5; i >= 0; i--) {
            trendMonths.push(new Date(y, m - i, 1));
        }
    } else if (range === "custom" && startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        let curr = new Date(start.getFullYear(), start.getMonth(), 1);
        while (curr <= end) {
            trendMonths.push(new Date(curr));
            curr.setMonth(curr.getMonth() + 1);
        }
    } else {
        // Default (week or this_month): last 6 months
        for (let i = 5; i >= 0; i--) {
            trendMonths.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
        }
    }

    for (const date of trendMonths) {
        const monthString = getMonthString(date);
        const monthExpenses = userExpenses.filter(expense => getMonthString(new Date(expense.date)) === monthString);

        const income = monthExpenses
            .filter(e => e.type === "income" || (e.type === undefined && e.amount > 0))
            .reduce((sum, e) => sum + Math.abs(e.amount), 0);
            
        const expenses = monthExpenses
            .filter(e => e.type === "expense" || (e.type === undefined && e.amount < 0))
            .reduce((sum, e) => sum + Math.abs(e.amount), 0);

        const saving = monthExpenses
            .filter(e => e.type === "saving")
            .reduce((sum, e) => sum + Math.abs(e.amount), 0);

        trends.push({
            month: monthString,
            income: Math.round(income * 100) / 100,
            expenses: Math.round(expenses * 100) / 100,
            savings: Math.round(saving * 100) / 100,
            total: Math.round((income - expenses) * 100) / 100,
            count: monthExpenses.length
        });
    }

    sendSuccess(res, trends, "Spending trends retrieved.", 200);
});

const getMonthString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${month}-${year}`
}

const getCurrentMonth = () => {
    return getMonthString(new Date());
}

const getLastMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return getMonthString(date);
}
