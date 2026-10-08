import React from "react";
import AdminLayout from "../Layout/AdminLayout";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {

    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    // Not logged in
    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    // Logged in but not admin
    if (role?.toLowerCase() !== "admin") {
        return <Navigate to="/signin" replace />;
    }

    // Admin user
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
};

export default AdminProtectedRoute;