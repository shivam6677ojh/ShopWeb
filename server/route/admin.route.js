import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import { getAdminDashboardStats } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/dashboard-stats", auth, admin, getAdminDashboardStats);

export default adminRouter;
