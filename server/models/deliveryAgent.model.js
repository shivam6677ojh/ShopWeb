import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Provide name"]
        },
        email: {
            type: String,
            required: [true, "Provide email"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Provide password"]
        },
        mobile: {
            type: Number,
            default: null
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Suspended"],
            default: "Active"
        },
        last_login_date: {
            type: Date,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const DeliveryAgentModel = mongoose.model("deliveryAgent", deliveryAgentSchema);

export default DeliveryAgentModel;
