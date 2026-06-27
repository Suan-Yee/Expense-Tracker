import { Router } from "express";
import { createExpense, deleteExpense, getAllExpenses, getExpenseById, updateExpense, generateRecurring } from "../controllers/expenseController";
import { requireAuth } from "../middlewares/authMiddleware";


const expenseRoutes = Router()

expenseRoutes.get("/", requireAuth, getAllExpenses)
expenseRoutes.get("/:id", requireAuth, getExpenseById)
expenseRoutes.post("/", requireAuth, createExpense)
expenseRoutes.post("/generate-recurring", requireAuth, generateRecurring)
expenseRoutes.put("/:id", requireAuth, updateExpense)
expenseRoutes.delete("/:id", requireAuth, deleteExpense)

export default expenseRoutes