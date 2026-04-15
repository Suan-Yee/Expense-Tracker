import { Router } from "express";
import { getDashboardStatus, getExpenseByCategories, getMonthlyTotal, getSpendingTrends } from "../controllers/analyticsController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router()

router.get("/category", requireAuth, getExpenseByCategories);
router.get("/monthly", requireAuth, getMonthlyTotal);
router.get("/dashboard", requireAuth, getDashboardStatus);
router.get("/trends", requireAuth, getSpendingTrends);

export default router
