import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import agentAuth from '../middleware/agentAuth.js'
import { CashOnDeliveryOrderController, assignOrderToAgentController, cancelOrderController, confirmStripeSessionController, deleteOrderController, getAdminOrdersController, getAgentOrdersController, getOrderDetailsController, paymentController, respondAgentAssignmentController, updateAgentOrderStatusController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/confirm-session', auth, confirmStripeSessionController)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.put("/cancel/:id",auth,cancelOrderController)
orderRouter.delete("/delete/:id",auth,deleteOrderController)
orderRouter.get("/admin/orders", auth, admin, getAdminOrdersController)
orderRouter.post("/assign", auth, admin, assignOrderToAgentController)
orderRouter.get("/agent-orders", agentAuth, getAgentOrdersController)
orderRouter.put("/agent/respond/:id", agentAuth, respondAgentAssignmentController)
orderRouter.put("/agent/update-status/:id", agentAuth, updateAgentOrderStatusController)

export default orderRouter