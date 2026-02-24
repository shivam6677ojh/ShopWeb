import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAgentDetails, setAgentDetails } from "../store/agentSlice";
import AxiosAgent from "../utils/AxiosAgent";
import SummaryApi from "../common/SummaryApi";
import { motion } from "framer-motion";

const AgentShell = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const agent = useSelector((state) => state.agent);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("agent_accesstoken");
        dispatch(clearAgentDetails());
        navigate("/agent/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("agent_accesstoken");

        if (!token) {
            dispatch(clearAgentDetails());
            navigate("/agent/login");
            return;
        }

        const fetchAgent = async () => {
            try {
                setLoading(true);
                const response = await AxiosAgent({
                    ...SummaryApi.agentMe
                });

                if (response.data?.success) {
                    dispatch(setAgentDetails(response.data.data));
                } else {
                    handleLogout();
                }
            } catch (error) {
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        fetchAgent();
    }, [location.pathname]);

    return (
        <div className="agent-ui min-h-screen agent-shell-bg">
            <div className="agent-hero-grid">
                <motion.header
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="sticky top-0 z-20 agent-glass"
                >
                    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-md" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Delivery Console</p>
                                <h1 className="text-2xl font-semibold text-slate-900">Route Runner</h1>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {loading ? "Syncing" : "On Shift"}
                            </div>
                            <div className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm">
                                {agent?.name || "Delivery Agent"}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </motion.header>
                <main className="container mx-auto px-4 py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AgentShell;
