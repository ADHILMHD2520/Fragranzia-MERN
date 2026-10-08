import React from "react";
import UserLayout from "../Layout/UserLayout";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {

    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken=====",accessToken)

    // User is not logged in
    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }

    return (
        <UserLayout>
            <Outlet />
        </UserLayout>
    );
};

export default UserProtectedRoute;