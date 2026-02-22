import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

export const getAdminDashboardStats = async (request, response) => {
    try {
        const orderAgg = await OrderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$totalAmt" },
                    totalItemsSold: { $sum: { $ifNull: ["$quantity", 1] } },
                    totalOrders: { $sum: 1 }
                }
            }
        ])

        const productAgg = await ProductModel.aggregate([
            {
                $project: {
                    stockSafe: { $ifNull: ["$stock", 0] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    stockLeft: { $sum: "$stockSafe" },
                    outOfStock: {
                        $sum: {
                            $cond: [{ $lte: ["$stockSafe", 0] }, 1, 0]
                        }
                    },
                    lowStock: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gt: ["$stockSafe", 0] },
                                        { $lte: ["$stockSafe", 5] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ])

        const orderStats = orderAgg[0] || { totalIncome: 0, totalItemsSold: 0, totalOrders: 0 }
        const productStats = productAgg[0] || { totalProducts: 0, stockLeft: 0, outOfStock: 0, lowStock: 0 }

        return response.json({
            message: "Admin dashboard stats",
            success: true,
            error: false,
            data: {
                ...orderStats,
                ...productStats
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
