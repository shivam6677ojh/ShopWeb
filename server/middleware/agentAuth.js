import jwt from "jsonwebtoken";
import DeliveryAgentModel from "../models/deliveryAgent.model.js";

const agentAuth = async (request, response, next) => {
    try {
        const headerToken = request?.headers?.authorization?.split(" ")[1];
        const token = headerToken || request.cookies.accessToken;

        if (!token) {
            return response.status(401).json({
                message: "Provide token",
                error: true,
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decode || decode.type !== "agent") {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        const agent = await DeliveryAgentModel.findById(decode.id);

        if (!agent || agent.status !== "Active") {
            return response.status(403).json({
                message: "Agent not active",
                error: true,
                success: false
            });
        }

        request.agentId = agent._id;
        request.agent = agent;

        next();
    } catch (error) {
        return response.status(500).json({
            message: "You have not login",
            error: true,
            success: false
        });
    }
};

export default agentAuth;
