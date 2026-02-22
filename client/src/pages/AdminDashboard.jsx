import React, { useCallback, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const StatCard = ({ label, value, helper, variant }) => {
    const cardStyles = {
        primary: "bg-gradient-to-br from-green-500 via-lime-400 to-yellow-400 text-white",
        dark: "bg-slate-900 text-white border border-white/10",
        light: "bg-white dark:bg-slate-900 border border-green-100 dark:border-white/10"
    }

    const textStyles = {
        primary: {
            label: "text-white/85",
            value: "text-white",
            helper: "text-white/90"
        },
        dark: {
            label: "text-slate-300",
            value: "text-white",
            helper: "text-slate-300"
        },
        light: {
            label: "text-slate-600 dark:text-slate-300",
            value: "text-slate-900 dark:text-white",
            helper: "text-slate-500 dark:text-slate-400"
        }
    }

    const safeVariant = textStyles[variant] ? variant : "light"
    const safeValue = value ?? "N/A"
    const safeHelper = helper ?? ""

    return (
        <div className={`rounded-2xl p-5 shadow-lg ${cardStyles[variant] || cardStyles.light}`}>
            <p className={`text-xs uppercase tracking-[0.25em] ${textStyles[safeVariant].label}`}>{label}</p>
            <p className={`mt-3 text-2xl sm:text-3xl font-bold ${textStyles[safeVariant].value}`}>{safeValue}</p>
            <p className={`mt-2 text-xs ${textStyles[safeVariant].helper}`}>{safeHelper}</p>
        </div>
    )
}

const AdminDashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.adminDashboardStats
            })

            const { data: responseData } = response

            if (responseData.success) {
                setStats(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return (
        <section className="min-h-[75vh] bg-gradient-to-b from-yellow-50 via-white to-green-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-green-700">Admin Analytics</p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Store Pulse</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 max-w-xl">
                            Track income, sales velocity, and inventory health at a glance. All metrics are live from orders and product stock.
                        </p>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="px-6 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        Refresh Stats
                    </button>
                </div>

                {loading ? (
                    <div className="py-16">
                        <Loading />
                    </div>
                ) : (
                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Total Income"
                            value={DisplayPriceInRupees(stats?.totalIncome || 0)}
                            helper="All-time revenue from completed orders"
                            variant="primary"
                        />
                        <StatCard
                            label="Items Sold"
                            value={stats?.totalItemsSold || 0}
                            helper="Total items sold across all orders"
                            variant="dark"
                        />
                        <StatCard
                            label="Stock Left"
                            value={stats?.stockLeft || 0}
                            helper="Units currently available in inventory"
                            variant="light"
                        />
                        <StatCard
                            label="Orders"
                            value={stats?.totalOrders || 0}
                            helper="Total order records in the system"
                            variant="light"
                        />
                    </div>
                )}

                {!loading && (
                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        <StatCard
                            label="Products"
                            value={stats?.totalProducts || 0}
                            helper="Total catalog items in the store"
                            variant="light"
                        />
                        <StatCard
                            label="Out of Stock"
                            value={stats?.outOfStock || 0}
                            helper="Items that are unavailable right now"
                            variant="light"
                        />
                        <StatCard
                            label="Low Stock"
                            value={stats?.lowStock || 0}
                            helper="Items that need replenishment soon"
                            variant="light"
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default AdminDashboard
