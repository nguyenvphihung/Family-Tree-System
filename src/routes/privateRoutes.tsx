import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import UserDetail from "../pages/Userdetail";
import Dashboard from "../pages/Dashboard";
import EventsPage from "../pages/Events";
import PhotosPage from "../pages/Photos";
import DocumentsPage from "../pages/Documents";
import StoriesPage from "../pages/Stories";
import MembersPage from "../pages/Members";
import Logout from "@/pages/Logout/Logout";
import SnapshotEditor from "@/pages/SnapshotEditor";
import Calendar from "@/pages/Calendar/Calendar";
import CemeteryMap from "@/pages/CemeterryMap/CemeteryMap";

const VNPayPage = lazy(() => import("@/pages/VNPay"));
const PaymentCallback = lazy(() => import("@/pages/VNPay/PaymentCallback"));

/**
 * Private Routes - Yêu cầu đăng nhập
 * Các route này cần authentication để truy cập
 */
export const privateRoutes: RouteObject[] = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/user-detail", element: <UserDetail /> },
    { path: "/events", element: <EventsPage /> },
    { path: "/photos", element: <PhotosPage /> },
    { path: "/documents", element: <DocumentsPage /> },
    { path: "/stories", element: <StoriesPage /> },
    { path: "/members", element: <MembersPage /> },
    { path: "/calendar", element: <Calendar /> },
    { path: "/snapshot-editor", element: <SnapshotEditor /> },
    { path: "/logout", element: <Logout /> },
    {
        path: "/vnpay",
        element: <VNPayPage />,
    },
    {
        path: "/vnpay/callback",
        element: <PaymentCallback />,
    },
    { path: "/grave-map", element: <CemeteryMap /> },

];

export default privateRoutes;
