import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "../App";
import Loading from "../components/Loading"; // Assuming you have a Loading component

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const OtpVerification = lazy(() => import("../pages/OtpVerification"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const UserMenuMobile = lazy(() => import("../pages/UserMenuMobile"));
const Dashboard = lazy(() => import("../layouts/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const Address = lazy(() => import("../pages/Address"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const SubCategoryPage = lazy(() => import("../pages/SubCategoryPage"));
const UploadProduct = lazy(() => import("../pages/UploadProduct"));
const ProductAdmin = lazy(() => import("../pages/ProductAdmin"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminDeliveryAgents = lazy(() => import("../pages/AdminDeliveryAgents"));
const AdminPermision = lazy(() => import("../layouts/AdminPermision"));
const ProductListPage = lazy(() => import("../pages/ProductListPage"));
const ProductDisplayPage = lazy(() => import("../pages/ProductDisplayPage"));
const CartMobile = lazy(() => import("../pages/CartMobile"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const Success = lazy(() => import("../pages/Success"));
const Cancel = lazy(() => import("../pages/Cancel"));
const AgentLogin = lazy(() => import("../pages/AgentLogin"));
const AgentDashboard = lazy(() => import("../pages/AgentDashboard"));
const AgentShell = lazy(() => import("../layouts/AgentShell"));

// Helper to wrap components in Suspense with a fallback
const SuspenseLayout = ({ children }) => (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        {children}
    </Suspense>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <SuspenseLayout><Home /></SuspenseLayout>
            },
            {
                path: "search",
                element: <SuspenseLayout><SearchPage /></SuspenseLayout>
            },
            {
                path: 'login',
                element: <SuspenseLayout><Login /></SuspenseLayout>
            },
            {
                path: "register",
                element: <SuspenseLayout><Register /></SuspenseLayout>
            },
            {
                path: "forgot-password",
                element: <SuspenseLayout><ForgotPassword /></SuspenseLayout>
            },
            {
                path: "verification-otp",
                element: <SuspenseLayout><OtpVerification /></SuspenseLayout>
            },
            {
                path: "reset-password",
                element: <SuspenseLayout><ResetPassword /></SuspenseLayout>
            },
            {
                path: "user",
                element: <SuspenseLayout><UserMenuMobile /></SuspenseLayout>
            },
            {
                path: "dashboard",
                element: <SuspenseLayout><Dashboard /></SuspenseLayout>,
                children: [
                    {
                        path: "profile",
                        element: <SuspenseLayout><Profile /></SuspenseLayout>
                    },
                    {
                        path: "myorders",
                        element: <SuspenseLayout><MyOrders /></SuspenseLayout>
                    },
                    {
                        path: "address",
                        element: <SuspenseLayout><Address /></SuspenseLayout>
                    },
                    {
                        path: 'category',
                        element: <AdminPermision><CategoryPage /></AdminPermision>
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermision><SubCategoryPage /></AdminPermision>
                    },
                    {
                        path: 'upload-product',
                        element: <AdminPermision><UploadProduct /></AdminPermision>
                    },
                    {
                        path: 'product',
                        element: <AdminPermision><ProductAdmin /></AdminPermision>
                    },
                    {
                        path: 'admin',
                        element: <AdminPermision><AdminDashboard /></AdminPermision>
                    },
                    {
                        path: 'delivery-agents',
                        element: <AdminPermision><AdminDeliveryAgents /></AdminPermision>
                    }
                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <SuspenseLayout><ProductListPage /></SuspenseLayout>
                    }
                ]
            },
            {
                path: "product/:product",
                element: <SuspenseLayout><ProductDisplayPage /></SuspenseLayout>
            },
            {
                path: 'cart',
                element: <SuspenseLayout><CartMobile /></SuspenseLayout>
            },
            {
                path: "checkout",
                element: <SuspenseLayout><CheckoutPage /></SuspenseLayout>
            },
            {
                path: "success",
                element: <SuspenseLayout><Success /></SuspenseLayout>
            },
            {
                path: 'cancel',
                element: <SuspenseLayout><Cancel /></SuspenseLayout>
            }
        ]
    },
    {
        path: "/agent/login",
        element: <SuspenseLayout><AgentLogin /></SuspenseLayout>
    },
    {
        path: "/agent",
        element: <SuspenseLayout><AgentShell /></SuspenseLayout>,
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />
            },
            {
                path: "dashboard",
                element: <SuspenseLayout><AgentDashboard /></SuspenseLayout>
            }
        ]
    }
])

export default router