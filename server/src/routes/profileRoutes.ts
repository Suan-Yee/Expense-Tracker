import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { requireAuth } from "../middlewares/authMiddleware";

const profileRoutes = Router()

profileRoutes.get("/", requireAuth, getProfile);
profileRoutes.put("/", requireAuth, updateProfile);

export default profileRoutes
