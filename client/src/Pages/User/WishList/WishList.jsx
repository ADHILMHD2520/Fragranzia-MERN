import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

import Navbar from "../../../Components/User/Navbar/Navbar";
import Footer from "../../../Components/User/Footer/Footer";

import "./WishList.css";

const Wishlist = () => {
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);

    // FETCH WISHLIST
    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                navigate("/signin");
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/wishlist/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Wishlist:", response.data.wishlist);

            setWishlist(response.data.wishlist || []);
        } catch (error) {
            console.error(
                "Error fetching wishlist:",
                error.response?.data?.message || error.message
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("accessToken");
                navigate("/signin");
            }
        } finally {
            setLoading(false);
        }
    };

    // GET PRODUCT IMAGE
    const getProductImage = (product) => {
        if (
            !product ||
            !product.images ||
            !product.images[0]
        ) {
            return null;
        }

        return `${product.images[0]}`;
    };

    // OPEN PRODUCT
    const openProduct = (id) => {
        navigate(`/product/${id}`);
    };

    // ADD TO CART
    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                toast.info("Please login to add products to cart");
                navigate("/signin");
                return;
            }

            setAddingToCart(productId);

            const response = await axios.post(
                "http://localhost:5000/api/cart/add",
                {
                    productId: productId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                response.data.message || "Product added to cart"
            );
        } catch (error) {
            console.error(
                "Error adding product to cart:",
                error.response?.data?.message || error.message
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("accessToken");
                navigate("/signin");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                "Unable to add product to cart"
            );
        } finally {
            setAddingToCart(null);
        }
    };

    // REMOVE FROM WISHLIST
    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await axios.delete(
                "http://localhost:5000/api/wishlist/remove",
                {
                    data: {
                        productId: productId,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data.message);

            setWishlist((currentWishlist) =>
                currentWishlist.filter(
                    (product) => product._id !== productId
                )
            );

            toast.success("Product removed from wishlist");
        } catch (error) {
            console.error(
                "Error removing wishlist item:",
                error.response?.data?.message || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to remove product from wishlist"
            );
        }
    };

    // LOADING
    if (loading) {
        return (
            <>
                <div className="wishlist-loading">
                    <h2>Loading wishlist...</h2>
                </div>
            </>
        );
    }

    return (
        <div className="wishlist-page">

            {/* HEADER */}
            <div className="wishlist-header">
                <h1>My Wishlist</h1>

                <p>
                    {wishlist.length}{" "}
                    {wishlist.length === 1
                        ? "item"
                        : "items"}
                </p>
            </div>

            {/* EMPTY WISHLIST */}
            {wishlist.length === 0 ? (
                <div className="wishlist-empty">
                    <FaHeart className="empty-heart" />

                    <h2>Your wishlist is empty</h2>

                    <p>
                        Save your favourite fragrances here.
                    </p>

                    <button
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (

                /* WISHLIST PRODUCTS */
                <div className="wishlist-grid">

                    {wishlist.map((product) => (

                        <div
                            className="wishlist-card"
                            key={product._id}
                        >

                            {/* IMAGE */}
                            <div
                                className="wishlist-image-box"
                                onClick={() =>
                                    openProduct(product._id)
                                }
                            >

                                <img
                                    src={getProductImage(product)}
                                    alt={product.name}
                                />

                                {/* REMOVE HEART */}
                                <button
                                    className="wishlist-remove"
                                    onClick={(event) => {
                                        event.stopPropagation();

                                        removeFromWishlist(
                                            product._id
                                        );
                                    }}
                                >
                                    <FaHeart />
                                </button>

                            </div>

                            {/* PRODUCT INFO */}
                            <div className="wishlist-product-info">

                                <h3
                                    onClick={() =>
                                        openProduct(product._id)
                                    }
                                >
                                    {product.name}
                                </h3>

                                <div className="wishlist-price">

                                    <span className="wishlist-current-price">
                                        ₹{product.salePrice}
                                    </span>

                                    {product.price &&
                                        Number(product.price) >
                                        Number(product.salePrice) && (
                                            <span className="wishlist-old-price">
                                                ₹{product.price}
                                            </span>
                                        )}

                                </div>

                                {/* ADD TO CART */}
                                <button
                                    className="wishlist-cart-btn"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        addToCart(product._id);
                                    }}
                                    disabled={
                                        addingToCart === product._id
                                    }
                                >
                                    <FaShoppingCart />

                                    {addingToCart === product._id
                                        ? "Adding..."
                                        : "Add to Cart"}
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

export default Wishlist;
