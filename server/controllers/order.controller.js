import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import DeliveryAgentModel from "../models/deliveryAgent.model.js";
import mongoose from "mongoose";

const calculateDiscountedPrice = (price, dis = 1) => {
    const numericPrice = Number(price)
    const numericDiscount = Number(dis)

    if (!Number.isFinite(numericPrice) || !Number.isFinite(numericDiscount)) {
        return 0
    }

    const discountAmount = Math.ceil((numericPrice * numericDiscount) / 100)
    return numericPrice - discountAmount
}

 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const payload = list_items.map(el => {
            const itemQty = Number(el.quantity)
            const safeQty = Number.isFinite(itemQty) ? itemQty : 1
            const lineTotal = calculateDiscountedPrice(el?.productId?.price, el?.productId?.discount) * safeQty

            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                quantity : safeQty,
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : lineTotal,
                totalAmt  :  lineTotal,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

 export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : calculateDiscountedPrice(item.productId.price,item.productId.discount) * 100
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                } ,
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                quantity : item.quantity,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY
    const signature = request.headers["stripe-signature"]
    let event = request.body

    if (endPointSecret && signature) {
        event = Stripe.webhooks.constructEvent(request.body, signature, endPointSecret)
    } else if (Buffer.isBuffer(request.body)) {
        event = JSON.parse(request.body.toString())
    }

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })
    
      const order = await OrderModel.insertMany(orderProduct)

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
        }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}

export async function confirmStripeSessionController(request, response) {
    try {
        const userId = request.userId
        const { sessionId } = request.body || {}

        if (!sessionId) {
            return response.status(400).json({
                message: "Provide sessionId",
                error: true,
                success: false
            })
        }

        const session = await Stripe.checkout.sessions.retrieve(sessionId)

        if (!session || session.payment_status !== "paid") {
            return response.status(400).json({
                message: "Payment not completed",
                error: true,
                success: false
            })
        }

        const paymentId = session.payment_intent
        const existing = await OrderModel.findOne({ paymentId })

        if (existing) {
            return response.json({
                message: "Order already confirmed",
                error: false,
                success: true,
                data: existing
            })
        }

        const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
        const addressId = session.metadata?.addressId
        const sessionUserId = session.metadata?.userId || userId

        const orderProduct = await getOrderProductItems({
            lineItems,
            userId: sessionUserId,
            addressId,
            paymentId,
            payment_status: session.payment_status
        })

        const order = await OrderModel.insertMany(orderProduct)

        if (Boolean(order[0])) {
            await UserModel.findByIdAndUpdate(sessionUserId, { shopping_cart: [] })
            await CartProductModel.deleteMany({ userId: sessionUserId })
        }

        return response.json({
            message: "Order confirmed",
            error: false,
            success: true,
            data: order
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function cancelOrderController(request, response) {
    try {
        const userId = request.userId
        const { id } = request.params
        const { reason } = request.body || {}

        const order = await OrderModel.findOne({ _id: id, userId })

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            })
        }

        if (order.order_status === "CANCELLED") {
            return response.status(400).json({
                message: "Order already cancelled",
                error: true,
                success: false
            })
        }

        if (order.order_status === "DELIVERED") {
            return response.status(400).json({
                message: "Delivered order cannot be cancelled",
                error: true,
                success: false
            })
        }

        order.order_status = "CANCELLED"
        order.cancel_reason = reason || ""
        order.canceled_at = new Date()

        await order.save()

        return response.json({
            message: "Order cancelled",
            error: false,
            success: true,
            data: order
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function deleteOrderController(request, response) {
    try {
        const userId = request.userId
        const { id } = request.params

        const order = await OrderModel.findOne({ _id: id, userId })

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            })
        }

        if (order.order_status !== "CANCELLED") {
            return response.status(400).json({
                message: "Only cancelled orders can be deleted",
                error: true,
                success: false
            })
        }

        await OrderModel.deleteOne({ _id: id, userId })

        return response.json({
            message: "Order deleted",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function assignOrderToAgentController(request, response) {
    try {
        const { orderId, agentId } = request.body;

        if (!orderId || !agentId) {
            return response.status(400).json({
                message: "Provide orderId and agentId",
                error: true,
                success: false
            });
        }

        const agent = await DeliveryAgentModel.findById(agentId);

        if (!agent || agent.status !== "Active") {
            return response.status(400).json({
                message: "Delivery agent not active",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        if (order.order_status !== "PLACED") {
            return response.status(400).json({
                message: "Order cannot be assigned",
                error: true,
                success: false
            });
        }

        order.delivery_agent = agentId;
        order.order_status = "ASSIGNED";
        order.assigned_at = new Date();
        order.agent_response = "PENDING";
        order.declined_reason = "";
        order.declined_at = null;
        order.delivery_status_history.push({
            status: "ASSIGNED",
            at: new Date(),
            note: "Assigned to delivery agent",
            by: agentId
        });

        await order.save();

        return response.json({
            message: "Order assigned",
            error: false,
            success: true,
            data: order
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function respondAgentAssignmentController(request, response) {
    try {
        const agentId = request.agentId;
        const { id } = request.params;
        const { decision, note } = request.body || {};

        if (!decision || !["ACCEPT", "DECLINE"].includes(decision)) {
            return response.status(400).json({
                message: "Decision must be ACCEPT or DECLINE",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findOne({ _id: id, delivery_agent: agentId });

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        if (order.order_status !== "ASSIGNED") {
            return response.status(400).json({
                message: "Only assigned orders can be responded to",
                error: true,
                success: false
            });
        }

        if (decision === "ACCEPT") {
            order.agent_response = "ACCEPTED";
            order.delivery_status_history.push({
                status: "ACCEPTED",
                at: new Date(),
                note: note || "",
                by: agentId
            });
        }

        if (decision === "DECLINE") {
            order.agent_response = "DECLINED";
            order.declined_reason = note || "";
            order.declined_at = new Date();
            order.delivery_status_history.push({
                status: "DECLINED",
                at: new Date(),
                note: note || "",
                by: agentId
            });
            order.delivery_agent = null;
            order.order_status = "PLACED";
            order.assigned_at = null;
            order.picked_up_at = null;
            order.out_for_delivery_at = null;
            order.delivered_at = null;
        }

        await order.save();

        return response.json({
            message: "Agent response recorded",
            error: false,
            success: true,
            data: order
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getAgentOrdersController(request, response) {
    try {
        const agentId = request.agentId;
        const { status } = request.query;

        const query = {
            delivery_agent: agentId
        };

        if (status) {
            query.order_status = status;
        } else {
            query.order_status = {
                $in: ["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"]
            };
        }

        query.agent_response = { $ne: "DECLINED" };

        const orders = await OrderModel.find(query)
            .sort({ createdAt: -1 })
            .populate("delivery_address")
            .populate("userId", "name email mobile");

        return response.json({
            message: "Agent orders",
            error: false,
            success: true,
            data: orders
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function updateAgentOrderStatusController(request, response) {
    try {
        const agentId = request.agentId;
        const { id } = request.params;
        const { status, note } = request.body || {};

        const allowedStatuses = ["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"];
        const statusFlow = {
            ASSIGNED: "PICKED_UP",
            PICKED_UP: "OUT_FOR_DELIVERY",
            OUT_FOR_DELIVERY: "DELIVERED"
        };

        if (!status || !allowedStatuses.includes(status)) {
            return response.status(400).json({
                message: "Invalid status",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findOne({ _id: id, delivery_agent: agentId });

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        if (order.order_status === "CANCELLED") {
            return response.status(400).json({
                message: "Cancelled order cannot be updated",
                error: true,
                success: false
            });
        }

        if (order.order_status === "DELIVERED") {
            return response.status(400).json({
                message: "Delivered order cannot be updated",
                error: true,
                success: false
            });
        }

        const nextStatus = statusFlow[order.order_status];

        if (nextStatus !== status) {
            return response.status(400).json({
                message: `Next valid status is ${nextStatus}`,
                error: true,
                success: false
            });
        }

        order.order_status = status;

        if (status === "PICKED_UP") {
            order.picked_up_at = new Date();
        }
        if (status === "OUT_FOR_DELIVERY") {
            order.out_for_delivery_at = new Date();
        }
        if (status === "DELIVERED") {
            order.delivered_at = new Date();
        }

        order.delivery_status_history.push({
            status,
            at: new Date(),
            note: note || "",
            by: agentId
        });

        await order.save();

        return response.json({
            message: "Order status updated",
            error: false,
            success: true,
            data: order
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getAdminOrdersController(request, response) {
    try {
        const { status, unassigned } = request.query;
        const query = {};

        if (status) {
            query.order_status = status;
        }

        if (unassigned === "true") {
            query.delivery_agent = null;
        }

        const orders = await OrderModel.find(query)
            .sort({ createdAt: -1 })
            .populate("delivery_address")
            .populate("userId", "name email mobile");

        return response.json({
            message: "Admin orders",
            error: false,
            success: true,
            data: orders
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
