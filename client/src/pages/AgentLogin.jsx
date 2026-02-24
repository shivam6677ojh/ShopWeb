import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import AxiosAgent from "../utils/AxiosAgent";

const AgentLogin = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await AxiosAgent({
                ...SummaryApi.agentLogin,
                data
            });

            if (response.data?.success) {
                localStorage.setItem("agent_accesstoken", response.data.data.accesstoken);
                toast.success("Welcome back, agent");
                navigate("/agent/dashboard");
            } else {
                toast.error(response.data?.message || "Login failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const isValid = Boolean(data.email && data.password);

    return (
        <section className="agent-ui min-h-screen agent-shell-bg flex items-center justify-center px-4">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
                <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-5xl grid lg:grid-cols-[1.1fr,0.9fr] rounded-[32px] overflow-hidden agent-glass"
            >
                <div className="p-10 lg:p-14 bg-slate-950 text-white">
                    <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Field Ops</p>
                    <h1 className="text-4xl font-semibold mt-4">Delivery Agent Desk</h1>
                    <p className="text-slate-300 mt-4 leading-relaxed">
                        Track every order, optimize every route, and keep the neighborhood moving. Log in to see real-time assignments and delivery hops.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-sm text-emerald-200">Assignments</p>
                            <p className="text-2xl font-semibold">Live Queue</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-sm text-cyan-200">Route</p>
                            <p className="text-2xl font-semibold">Smart ETA</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-sm text-amber-200">Support</p>
                            <p className="text-2xl font-semibold">In-chat</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-sm text-violet-200">Updates</p>
                            <p className="text-2xl font-semibold">1-Tap</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 lg:p-12 bg-white">
                    <div className="mb-8">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Secure Login</p>
                        <h2 className="text-3xl font-semibold text-slate-900 mt-3">Agent Sign In</h2>
                        <p className="text-slate-500 mt-2">Use your dispatch credentials to continue.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                placeholder="agent@dispatch.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                placeholder="••••••••"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!isValid || loading}
                            className={`w-full rounded-2xl py-3 text-white font-semibold shadow-md ${
                                isValid ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-300"
                            }`}
                        >
                            {loading ? "Signing in..." : "Enter Dispatch"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </section>
    );
};

export default AgentLogin;
