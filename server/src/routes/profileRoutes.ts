import { Router } from "express";
import { getProfile, updateProfile, changePassword, deleteAccount } from "../controllers/profileController";
import { requireAuth } from "../middlewares/authMiddleware";

const profileRoutes = Router()

profileRoutes.get("/", requireAuth, getProfile);
profileRoutes.put("/", requireAuth, updateProfile);
profileRoutes.put("/password", requireAuth, changePassword);
profileRoutes.delete("/", requireAuth, deleteAccount);

export default profileRoutes
