import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import successAlert from "../utils/SuccessAlert";

const AdminDeliveryAgents = () => {
    const [agents, setAgents] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [selectedAgentByOrder, setSelectedAgentByOrder] = useState({});
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        mobile: ""
    });

    const fetchAgents = async () => {
        const response = await Axios({
            ...SummaryApi.agentList
        });

        if (response.data?.success) {
            setAgents(response.data.data || []);
        }
    };

    const fetchOrders = async () => {
        const response = await Axios({
            ...SummaryApi.adminOrders,
            params: {
                status: "PLACED",
                unassigned: true
            }
        });

        if (response.data?.success) {
            setOrders(response.data.data || []);
        }
    };

    const loadAll = async () => {
        try {
            setLoading(true);
            await Promise.all([fetchAgents(), fetchOrders()]);
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateAgent = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.agentCreate,
                data: form
            });

            if (response.data?.success) {
                successAlert("Agent created");
                setForm({ name: "", email: "", password: "", mobile: "" });
                await fetchAgents();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignOrder = async (orderId) => {
        const agentId = selectedAgentByOrder[orderId];
        if (!agentId) {
            return;
        }

        try {
            setAssigning(true);
            const response = await Axios({
                ...SummaryApi.assignOrder,
                data: {
                    orderId,
                    agentId
                }
            });

            if (response.data?.success) {
                successAlert("Order assigned");
                await fetchOrders();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setAssigning(false);
        }
    };

    const isFormValid = form.name && form.email && form.password;

    return (
        <section className="min-h-[75vh] bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-emerald-600">Dispatch Control</p>
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Delivery Agents</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                        Create new delivery agents and assign unclaimed orders.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
                    <div className="rounded-3xl border border-slate-100 dark:border-white/10 p-6 shadow-sm bg-white dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Delivery Agent</h2>
                        <form onSubmit={handleCreateAgent} className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-300">Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                    placeholder="Rider name"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-300">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                    placeholder="agent@blinkit.com"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-300">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-300">Mobile</label>
                                <input
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                    placeholder="Optional"
                                />
                            </div>
                            <button
                                disabled={!isFormValid || loading}
                                className="w-full rounded-2xl bg-slate-900 text-white py-3 font-semibold disabled:opacity-60"
                            >
                                {loading ? "Creating..." : "Create Agent"}
                            </button>
                        </form>
                    </div>

                    <div className="rounded-3xl border border-slate-100 dark:border-white/10 p-6 shadow-sm bg-white dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Agents</h2>
                        <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto scrollbarCustom pr-2">
                            {agents.map((agent) => (
                                <div
                                    key={agent._id}
                                    className="rounded-2xl border border-slate-100 dark:border-white/10 p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{agent.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{agent.email}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                                            {agent.status}
                                        </span>
                                    </div>
                                    {agent.mobile && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{agent.mobile}</p>
                                    )}
                                </div>
                            ))}
                            {!agents.length && !loading && (
                                <p className="text-sm text-slate-500">No agents yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-100 dark:border-white/10 p-6 shadow-sm bg-white dark:bg-slate-900">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Unassigned Orders</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-300">Assign PLACED orders to an agent.</p>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2 rounded-full bg-slate-900 text-white"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading && (
                        <div className="mt-6">
                            <Loading />
                        </div>
                    )}

                    {!loading && !orders.length && (
                        <p className="mt-6 text-sm text-slate-500">No unassigned orders.</p>
                    )}

                    <div className="mt-6 grid gap-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="rounded-2xl border border-slate-100 dark:border-white/10 p-4"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Order</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">#{order.orderId}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-300">
                                            {order?.userId?.name} • {order?.userId?.email}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {order?.delivery_address?.address_line}, {order?.delivery_address?.city}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <select
                                            value={selectedAgentByOrder[order._id] || ""}
                                            onChange={(event) =>
                                                setSelectedAgentByOrder((prev) => ({
                                                    ...prev,
                                                    [order._id]: event.target.value
                                                }))
                                            }
                                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        >
                                            <option value="">Select agent</option>
                                            {agents.map((agent) => (
                                                <option key={agent._id} value={agent._id}>
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            disabled={!selectedAgentByOrder[order._id] || assigning}
                                            onClick={() => handleAssignOrder(order._id)}
                                            className="rounded-2xl bg-emerald-500 text-white py-2 text-sm font-semibold disabled:opacity-60"
                                        >
                                            {assigning ? "Assigning..." : "Assign"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDeliveryAgents;
