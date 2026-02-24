import bcryptjs from "bcryptjs";
import DeliveryAgentModel from "../models/deliveryAgent.model.js";
import generatedAgentAccessToken from "../utils/generatedAgentAccessToken.js";

export async function createDeliveryAgentController(request, response) {
    try {
        const { name, email, password, mobile } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide name, email, password",
                error: true,
                success: false
            });
        }

        const existingAgent = await DeliveryAgentModel.findOne({ email });

        if (existingAgent) {
            return response.status(400).json({
                message: "Agent already exists",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const agent = new DeliveryAgentModel({
            name,
            email,
            password: hashPassword,
            mobile: mobile || null
        });

        const saveAgent = await agent.save();

        return response.json({
            message: "Delivery agent created",
            error: false,
            success: true,
            data: {
                _id: saveAgent._id,
                name: saveAgent.name,
                email: saveAgent.email,
                mobile: saveAgent.mobile,
                status: saveAgent.status
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function loginDeliveryAgentController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email, password",
                error: true,
                success: false
            });
        }

        const agent = await DeliveryAgentModel.findOne({ email });

        if (!agent) {
            return response.status(400).json({
                message: "Agent not registered",
                error: true,
                success: false
            });
        }

        if (agent.status !== "Active") {
            return response.status(400).json({
                message: "Agent is not active",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcryptjs.compare(password, agent.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            });
        }

        const accesstoken = await generatedAgentAccessToken(agent._id);

        await DeliveryAgentModel.findByIdAndUpdate(agent._id, {
            last_login_date: new Date()
        });

        return response.json({
            message: "Agent login successfully",
            error: false,
            success: true,
            data: {
                accesstoken
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getDeliveryAgentDetailsController(request, response) {
    try {
        const agentId = request.agentId;

        const agent = await DeliveryAgentModel.findById(agentId).select("name email mobile status last_login_date");

        if (!agent) {
            return response.status(404).json({
                message: "Agent not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Agent details",
            error: false,
            success: true,
            data: agent
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getDeliveryAgentsController(request, response) {
    try {
        const agents = await DeliveryAgentModel.find()
            .sort({ createdAt: -1 })
            .select("name email mobile status last_login_date createdAt");

        return response.json({
            message: "Delivery agents",
            error: false,
            success: true,
            data: agents
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
