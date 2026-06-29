import { Router } from "express";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../controllers/goalController";
import { requireAuth } from "../middlewares/authMiddleware";

const goalRoutes = Router();

goalRoutes.get("/", requireAuth, getGoals);
goalRoutes.post("/", requireAuth, createGoal);
goalRoutes.put("/:id", requireAuth, updateGoal);
goalRoutes.delete("/:id", requireAuth, deleteGoal);

export default goalRoutes;
