import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middlewares/errorHandler";
import { DashboardStats, ExpenseCategory, MonthlyTotals } from "../types";
import Expense from "../models/Expense";

export const getExpenseByCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.userId;
    const userExpenses = await Expense.find({ userId });

    if (userExpenses.length === 0) {
        sendSuccess(res, [], "No expenses found. Create an expense to get started.");
        return;
    }

    const categoryTotals = userExpenses.reduce((acc, expense) => {
        if(!acc[expense.category]) {
            acc[expense.category] = {total: 0, count: 0}
        }

        acc[expense.category].total += expense.amount
        acc[expense.category].count += 1
        return acc;
    },{} as Record<string, {total: number, count: number}>);

    const grandTotal = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.total, 0);

    const categoryArray = Object.entries(categoryTotals).map(
        ([category, cat]) => ({
            category,
            count: cat.count,
            percentage: Math.round((cat.total / grandTotal) * 1000) / 10,
            total: Math.round(cat.total * 100) / 100,
        })
    );

    categoryArray.sort((a,b) => b.total - a.total)
    sendSuccess(res, categoryArray, "Category breakdown retrieved", 200)
})

export const getMonthlyTotal = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = req.userId;
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear()

    if(isNaN(year)) {
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

    if(userExpenses.length === 0) {
        return sendSuccess(res, [], `No expenses found for ${year}`);
    }

    const monthlyTotals = userExpenses.reduce((acc, expense) => {
        const monthString = getMonthString(new Date(expense.date));

        if(!acc[monthString]) {
            acc[monthString] = {
                month: monthString,
                total: 0,
                count: 0
            }
        }
        acc[monthString].total += expense.amount;
        acc[monthString].count += 1;
        return acc;
    }, {} as Record<string, MonthlyTotals>)

    const monthlyArray = Object.values(monthlyTotals);
    monthlyArray.sort((a,b) => a.month.localeCompare(b.month));

    monthlyArray.forEach(month => {
        month.total = Math.round(month.total * 100) / 100;
    });

    sendSuccess(res, monthlyArray, `Monthly total for ${year} retrieved.`);
})

export const getDashboardStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = req.userId;
    const userExpenses = await Expense.find({ userId });

    if(userExpenses.length === 0) {
        sendSuccess(res, [], "No expense found. Create an expense to get started.", 200)
        return
    }

    const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const averageExpenes = Math.round(totalExpenses / userExpenses.length * 10) / 10;

    const amounts = userExpenses.map(expense => expense.amount);
    const maxAmount = Math.max(...amounts);
    const minAmount = Math.min(...amounts);

    const highestExpense = userExpenses.find(expense => expense.amount === maxAmount)!;
    const lowestExpense = userExpenses.find(expense => expense.amount === minAmount)!;

    const currentMonth = getCurrentMonth();
    const currentMonthExpenses = userExpenses.filter(expense => getMonthString(new Date(expense.date)) === currentMonth)
    const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const lastMonth = getLastMonth();
    const lastMonthExpenses = userExpenses.filter(expense => getMonthString(new Date(expense.date)) === lastMonth)
    const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    let monthlyChange = 0
    if(lastMonthTotal > 0) {
        monthlyChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        monthlyChange = Math.round(monthlyChange * 10) / 10;
    } else if (currentMonthTotal > 0) {
        monthlyChange = 100;
    }

    const stats: DashboardStats = {
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        expenseCount: userExpenses.length,
        averageExpenes,
        highestExpense,
        lowestExpense,
        currentMonthTotal: Math.round(currentMonthTotal * 100) / 100,
        lastMonthTotal: Math.round(lastMonthTotal * 100) / 100,
        monthlyChange,
    }
    sendSuccess(res, stats, "Dashboard statistics retrieved.")
})

export const getSpendingTrends = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = req.userId;
    const userExpenses = await Expense.find({ userId });

    if(userExpenses.length === 0) {
        sendSuccess(res, [], "No expense found. Create an expense to get started.", 200)
        return;
    }

    const trends = []
    const currentDate = new Date();
    
    for(let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(currentDate.getMonth() - i)
        const monthString = getMonthString(date)

        const monthExpenses = userExpenses.filter(expense => getMonthString(expense.date) === monthString);
        const monthTotal = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        trends.push({
            month: monthString,
            total: Math.round(monthTotal * 100) / 100,
            count: monthExpenses.length
        });
    }
    sendSuccess(res, trends, "Spending trends retrievd.", 200);
})

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
