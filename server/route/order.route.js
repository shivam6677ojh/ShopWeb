import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, cancelOrderController, deleteOrderController, getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.put("/cancel/:id",auth,cancelOrderController)
orderRouter.delete("/delete/:id",auth,deleteOrderController)

export default orderRouter