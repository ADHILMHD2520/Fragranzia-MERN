import React, { useEffect, useState } from "react";
import Sidebar from "../../../Components/Admin/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Products.css";
import { toast } from "react-toastify";
const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [showProduct, setShowProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            console.log("fetching products ====",);
            const response = await axios.get(
                "http://localhost:5000/api/products"
            );

            console.log("fetch products ====", response.data);

            setProducts(
                response.data.products.filter((product) => product.isActive === true)
            );
        } catch (error) {
            console.error(
                "Error fetching products:",
                error.response?.data?.message || error.message
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/products/${id}`
            );

            setProducts((prevProducts) =>
                prevProducts.filter((product) => product._id !== id)
            );

            toast.success("Product deleted successfully");
        } catch (error) {
            console.error(
                "Error deleting product:",
                error.response?.data?.message || error.message
            );

            toast.error("Failed to delete product");
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/products/${id}/status`
            );

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === id
                        ? {
                            ...product,
                            isActive: response.data.product.isActive,
                        }
                        : product
                )
            );

            toast.success(response.data.message);

        } catch (error) {

            console.error(
                "Error updating product status:",
                error.response?.data?.message || error.message
            );

            toast.error("Failed to update product status");
        }

        const handleShowProduct = (product) => {
            setShowProduct(product);
        };


    }
    useEffect(() => {
        console.log("useEffect loading")
        fetchProducts();
    }, []);

    return (
        <div className="admin-products-container">
            {/* <Sidebar /> */}

            <div className="products-page">
                <div className="products-actions">
                    <div>
                        <button className="export-btn">
                            Export
                        </button>

                        <button className="import-btn">
                            Import
                        </button>
                    </div>

                    <button
                        className="add-product-btn"
                        onClick={() => navigate("/admin/add-product")}
                    >
                        + Add Product
                    </button>
                </div>

                <div className="products-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Sale Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.category?.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>₹{product.salePrice}</td>
                                    <td>{product.stock}</td>

                                    <td>
                                        <button
                                            className="show-btn"
                                            onClick={() => handleShowProduct(product)}
                                        >
                                            ◉ Show
                                        </button>

                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/admin/add-product/${product._id}`)}
                                        >
                                            ✎ Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            ✖ Delete
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className="status-btn"
                                            onClick={() => handleToggleStatus(product._id)}
                                        >
                                            {product.isActive ? "Block" : "Unblock"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showProduct && (
                <div
                    className="show-product-overlay"
                    onClick={() => setShowProduct(null)}
                >
                    <div
                        className="show-product-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="show-product-header">
                            <h2>Product Details</h2>

                            <button
                                onClick={() => setShowProduct(null)}
                                className="close-show-btn"
                            >
                                ×
                            </button>
                        </div>

                        <div className="show-product-content">

                            {showProduct.images?.[0] && (
                                <img
                                    src={`${showProduct.images[0]}`}
                                    alt={showProduct.name}
                                    className="show-product-image"
                                />
                            )}

                            <p>
                                <strong>Name:</strong>{" "}
                                {showProduct.name}
                            </p>

                            <p>
                                <strong>Category:</strong>{" "}
                                {showProduct.category?.name}
                            </p>

                            <p>
                                <strong>Price:</strong>{" "}
                                ₹{showProduct.price}
                            </p>

                            <p>
                                <strong>Sale Price:</strong>{" "}
                                ₹{showProduct.salePrice}
                            </p>

                            <p>
                                <strong>Stock:</strong>{" "}
                                {showProduct.stock}
                            </p>

                            <p>
                                <strong>Description:</strong>
                            </p>

                            <p className="show-product-description">
                                {showProduct.description || "No description available"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {showProduct.isActive
                                    ? "Active"
                                    : "Blocked"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;