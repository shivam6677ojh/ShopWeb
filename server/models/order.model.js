import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    orderId : {
        type : String,
        required : [true, "Provide orderId"],
        unique : true
    },
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : "product"
    },
    product_details : {
        name : String,
        image : Array,
    },
    quantity : {
        type : Number,
        default : 1
    },
    paymentId : {
        type : String,
        default : ""
    },
    payment_status : {
        type : String,
        default : ""
    },
    delivery_address : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    subTotalAmt : {
        type : Number,
        default : 0
    },
    totalAmt : {
        type : Number,
        default : 0
    },
    order_status : {
        type : String,
        default : "PLACED"
    },
    cancel_reason : {
        type : String,
        default : ""
    },
    canceled_at : {
        type : Date,
        default : null
    },
    invoice_receipt : {
        type : String,
        default : ""
    },
    delivery_agent : {
        type : mongoose.Schema.ObjectId,
        ref : 'deliveryAgent',
        default : null
    },
    agent_response : {
        type : String,
        enum : ["PENDING", "ACCEPTED", "DECLINED"],
        default : "PENDING"
    },
    declined_reason : {
        type : String,
        default : ""
    },
    declined_at : {
        type : Date,
        default : null
    },
    assigned_at : {
        type : Date,
        default : null
    },
    picked_up_at : {
        type : Date,
        default : null
    },
    out_for_delivery_at : {
        type : Date,
        default : null
    },
    delivered_at : {
        type : Date,
        default : null
    },
    delivery_status_history : [
        {
            status : String,
            at : Date,
            note : String,
            by : {
                type : mongoose.Schema.ObjectId,
                ref : 'deliveryAgent'
            }
        }
    ]
},{
    timestamps : true
})

const OrderModel = mongoose.model('order',orderSchema)

export default OrderModel