import jwt from "jsonwebtoken";

const generatedAgentAccessToken = async (agentId) => {
    const token = await jwt.sign(
        { id: agentId, type: "agent" },
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn: "5h" }
    );

    return token;
};

export default generatedAgentAccessToken;
