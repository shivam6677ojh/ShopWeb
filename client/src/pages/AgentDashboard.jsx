import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { motion } from "framer-motion";
import AxiosAgent from "../utils/AxiosAgent";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";
import NoData from "../components/NoData";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

const STATUS_FLOW = {
    ASSIGNED: "PICKED_UP",
    PICKED_UP: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED"
};

const STATUS_LABELS = {
    ASSIGNED: "Mark as Picked Up",
    PICKED_UP: "Mark Out for Delivery",
    OUT_FOR_DELIVERY: "Mark as Delivered"
};

const STATUS_BADGES = {
    ASSIGNED: "bg-amber-100 text-amber-700",
    PICKED_UP: "bg-blue-100 text-blue-700",
    OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-emerald-100 text-emerald-700"
};

const MapUpdater = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);

    return null;
};

const AgentDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [geoCache, setGeoCache] = useState({});
    const [note, setNote] = useState("");
    const [decisionNote, setDecisionNote] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const selectedOrder = orders.find((order) => order?._id === selectedId) || orders[0];

    const stats = useMemo(() => {
        return {
            assigned: orders.filter((order) => order.order_status === "ASSIGNED").length,
            inTransit: orders.filter((order) => ["PICKED_UP", "OUT_FOR_DELIVERY"].includes(order.order_status)).length,
            delivered: orders.filter((order) => order.order_status === "DELIVERED").length
        };
    }, [orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await AxiosAgent({
                ...SummaryApi.agentOrders
            });

            if (response.data?.success) {
                const data = response.data?.data || [];
                setOrders(data);
                setLastUpdated(new Date());
                if (!selectedId && data.length) {
                    setSelectedId(data[0]._id);
                }
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const intervalId = setInterval(fetchOrders, 15000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!selectedOrder) {
            return;
        }

        if (geoCache[selectedOrder._id]) {
            return;
        }

        const address = selectedOrder?.delivery_address;
        const addressText = [
            address?.address_line,
            address?.city,
            address?.state,
            address?.pincode,
            address?.country
        ].filter(Boolean).join(", ");

        if (!addressText) {
            return;
        }

        const geocode = async () => {
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(addressText)}`;
                const response = await fetch(url);
                const data = await response.json();
                if (data?.length) {
                    const match = data[0];
                    setGeoCache((prev) => ({
                        ...prev,
                        [selectedOrder._id]: {
                            lat: Number(match.lat),
                            lng: Number(match.lon),
                            displayName: match.display_name
                        }
                    }));
                }
            } catch (error) {
                console.error("Geocode failed", error);
            }
        };

        geocode();
    }, [selectedOrder, geoCache]);

    const nextStatus = selectedOrder ? STATUS_FLOW[selectedOrder.order_status] : null;
    const showDecision = selectedOrder?.order_status === "ASSIGNED" && selectedOrder?.agent_response !== "ACCEPTED";

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !nextStatus) {
            return;
        }

        try {
            setActionLoading(true);
            const response = await AxiosAgent({
                ...SummaryApi.agentUpdateOrderStatus,
                url: `${SummaryApi.agentUpdateOrderStatus.url}/${selectedOrder._id}`,
                data: {
                    status: nextStatus,
                    note
                }
            });

            if (response.data?.success) {
                successAlert("Status updated");
                setNote("");
                await fetchOrders();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDecision = async (decision) => {
        if (!selectedOrder) {
            return;
        }

        try {
            setActionLoading(true);
            const response = await AxiosAgent({
                ...SummaryApi.agentRespondOrder,
                url: `${SummaryApi.agentRespondOrder.url}/${selectedOrder._id}`,
                data: {
                    decision,
                    note: decisionNote
                }
            });

            if (response.data?.success) {
                successAlert("Response sent");
                setDecisionNote("");
                await fetchOrders();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setActionLoading(false);
        }
    };

    const addressText = selectedOrder?.delivery_address
        ? [
            selectedOrder.delivery_address?.address_line,
            selectedOrder.delivery_address?.city,
            selectedOrder.delivery_address?.state,
            selectedOrder.delivery_address?.pincode,
            selectedOrder.delivery_address?.country
        ].filter(Boolean).join(", ")
        : "";

    const geo = selectedOrder ? geoCache[selectedOrder._id] : null;
    const mapCenter = geo ? [geo.lat, geo.lng] : [20.5937, 78.9629];
    const mapZoom = geo ? 15 : 4;

    return (
        <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="agent-glass rounded-3xl p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Assigned</p>
                    <h3 className="text-3xl font-semibold text-slate-900 mt-2">{stats.assigned}</h3>
                    <p className="text-sm text-slate-500 mt-1">Ready for pickup</p>
                </div>
                <div className="agent-glass rounded-3xl p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">In Transit</p>
                    <h3 className="text-3xl font-semibold text-slate-900 mt-2">{stats.inTransit}</h3>
                    <p className="text-sm text-slate-500 mt-1">Active deliveries</p>
                </div>
                <div className="agent-glass rounded-3xl p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Delivered</p>
                    <h3 className="text-3xl font-semibold text-slate-900 mt-2">{stats.delivered}</h3>
                    <p className="text-sm text-slate-500 mt-1">Completed today</p>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500">
                <p>Auto-refreshes every 15 seconds</p>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    )}
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 rounded-full bg-slate-900 text-white"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr,1.4fr]">
                <div className="space-y-4">
                    <div className="agent-glass rounded-3xl p-5">
                        <h2 className="text-xl font-semibold text-slate-900">Assigned Orders</h2>
                        <p className="text-sm text-slate-500">Tap an order to focus the map and controls.</p>
                    </div>

                    {loading && (
                        <div className="agent-glass rounded-3xl p-6 text-slate-500">Loading orders...</div>
                    )}

                    {!loading && !orders.length && (
                        <div className="agent-glass rounded-3xl p-6">
                            <NoData />
                        </div>
                    )}

                    <div className="space-y-3">
                        {orders.map((order) => {
                            const isActive = selectedOrder?._id === order._id;
                            return (
                                <button
                                    key={order._id}
                                    onClick={() => setSelectedId(order._id)}
                                    className={`w-full text-left rounded-3xl p-4 border transition-all ${
                                        isActive ? "border-emerald-300 shadow-lg" : "border-transparent"
                                    } agent-glass`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Order</p>
                                            <h3 className="text-lg font-semibold text-slate-900">#{order.orderId}</h3>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                                {order?.delivery_address?.city || "Unknown city"}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs ${STATUS_BADGES[order.order_status] || "bg-slate-100 text-slate-500"}`}>
                                            {order.order_status}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
                                        <span>{DisplayPriceInRupees(order.totalAmt)}</span>
                                        <span>•</span>
                                        <span>Qty {order.quantity || 1}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="agent-glass rounded-3xl p-6 space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Focused Order</p>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    {selectedOrder ? `#${selectedOrder.orderId}` : "No order selected"}
                                </h2>
                            </div>
                            {selectedOrder && (
                                <span className={`px-3 py-1 rounded-full text-xs ${STATUS_BADGES[selectedOrder.order_status] || "bg-slate-100 text-slate-500"}`}>
                                    {selectedOrder.order_status}
                                </span>
                            )}
                        </div>

                        {selectedOrder && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-500">Customer</p>
                                    <p className="text-slate-900 font-medium">{selectedOrder?.userId?.name || "Customer"}</p>
                                    <p className="text-sm text-slate-500">{selectedOrder?.userId?.email || ""}</p>
                                    {selectedOrder?.delivery_address?.mobile && (
                                        <a
                                            className="text-sm text-emerald-600"
                                            href={`tel:${selectedOrder.delivery_address.mobile}`}
                                        >
                                            Call {selectedOrder.delivery_address.mobile}
                                        </a>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-500">Drop Location</p>
                                    <p className="text-slate-900 font-medium">{addressText || "Address not available"}</p>
                                    {addressText && (
                                        <a
                                            className="text-sm text-slate-600 underline"
                                            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(addressText)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Open in OpenStreetMap
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <textarea
                                value={note}
                                onChange={(event) => setNote(event.target.value)}
                                placeholder="Add delivery note (optional)"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                rows={3}
                            />
                            {showDecision && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Assignment</p>
                                    <p className="text-sm text-slate-600 mt-2">Accept this delivery or decline it to return to dispatch.</p>
                                    <textarea
                                        value={decisionNote}
                                        onChange={(event) => setDecisionNote(event.target.value)}
                                        placeholder="Optional note for dispatch"
                                        className="mt-3 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        rows={2}
                                    />
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleDecision("ACCEPT")}
                                            disabled={actionLoading}
                                            className="flex-1 rounded-2xl bg-emerald-500 text-white py-2 text-sm font-semibold disabled:opacity-60"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleDecision("DECLINE")}
                                            disabled={actionLoading}
                                            className="flex-1 rounded-2xl border border-red-400 text-red-600 py-2 text-sm font-semibold disabled:opacity-60"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleStatusUpdate}
                                disabled={!nextStatus || actionLoading}
                                className="w-full rounded-2xl bg-slate-900 text-white py-3 font-semibold disabled:opacity-60"
                            >
                                {nextStatus ? STATUS_LABELS[selectedOrder?.order_status] : "No action available"}
                            </button>
                        </div>
                    </div>

                    <div className="agent-glass rounded-3xl overflow-hidden">
                        <div className="h-[420px]">
                            <MapContainer center={mapCenter} zoom={mapZoom} className="h-full w-full">
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                <MapUpdater center={mapCenter} zoom={mapZoom} />
                                {geo && (
                                    <Marker position={[geo.lat, geo.lng]}>
                                        <Popup>
                                            <div className="text-sm">
                                                <p className="font-semibold">Drop Location</p>
                                                <p>{geo.displayName || addressText}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                        <div className="p-4 text-xs text-slate-500">
                            Map tiles by OpenStreetMap. Location pin is estimated from address.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AgentDashboard;
