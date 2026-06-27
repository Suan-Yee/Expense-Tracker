import { Router } from "express";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../controllers/budgetController";
import { requireAuth } from "../middlewares/authMiddleware";

const budgetRoutes = Router();

budgetRoutes.get("/", requireAuth, getBudgets);
budgetRoutes.post("/", requireAuth, createBudget);
budgetRoutes.put("/:id", requireAuth, updateBudget);
budgetRoutes.delete("/:id", requireAuth, deleteBudget);

export default budgetRoutes;
