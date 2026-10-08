import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";


const Sidebar = () => {
    return (
        <div className="admin-sidebar">

            <h2>Dashtar</h2>

            <nav>

                <Link to="/admin">
                    Dashboard
                </Link>

                <Link to="/admin/products">
                    Products
                </Link>

                <Link to="/admin/categories">
                    Categories
                </Link>

                <Link to="/admin/customers">
                    Customers
                </Link>

                <Link to="/admin/orders">
                    Orders
                </Link>

            </nav>

            <button className="logout-btn" onClick={() => localStorage.removeItem("accessToken")}>
                <Link to="/signin">Log Out</Link>
            </button>

        </div>
    );
};

export default Sidebar;