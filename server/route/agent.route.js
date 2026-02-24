import { Router } from "express";
import { createDeliveryAgentController, getDeliveryAgentDetailsController, getDeliveryAgentsController, loginDeliveryAgentController } from "../controllers/deliveryAgent.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import agentAuth from "../middleware/agentAuth.js";

const agentRouter = Router();

agentRouter.post("/login", loginDeliveryAgentController);
agentRouter.post("/create", auth, admin, createDeliveryAgentController);
agentRouter.get("/me", agentAuth, getDeliveryAgentDetailsController);
agentRouter.get("/list", auth, admin, getDeliveryAgentsController);

export default agentRouter;
