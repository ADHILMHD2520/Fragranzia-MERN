import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Cart.css";

import Navbar from "../../../Components/User/Navbar/Navbar";
import Footer from "../../../Components/User/Footer/Footer";


const Cart = () => {

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("accessToken");


    // ================================
    // GET CART
    // ================================

    const fetchCart = async () => {

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCart(response.data.cart);

        } catch (error) {

            console.log(
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }

    }, []);


    // ================================
    // IMAGE URL
    // ================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        // If image is already a complete URL
        if (image.startsWith("http")) {
            return image;
        }

        // If backend already returned /uploads/...
        if (image.startsWith("/uploads/")) {
            return `https://fragranzia-mern.vercel.app${image}`;
        }

        // If backend returned only filename
        return `/${image}`;

    };


    // ================================
    // INCREASE QUANTITY
    // ================================

    const increaseQuantity = async (
        productId,
        currentQuantity
    ) => {

        try {

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/cart/update`,
                {
                    productId: productId,
                    quantity: currentQuantity + 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCart(response.data.cart);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to update cart"
            );

        }

    };


    // ================================
    // DECREASE QUANTITY
    // ================================

    const decreaseQuantity = async (
        productId,
        currentQuantity
    ) => {

        if (currentQuantity <= 1) {
            return;
        }

        try {

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/cart/update`,
                {
                    productId: productId,
                    quantity: currentQuantity - 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCart(response.data.cart);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to update cart"
            );

        }

    };


    // ================================
    // REMOVE PRODUCT
    // ================================

    const removeProduct = async (productId) => {

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/cart/remove`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: {
                        productId: productId,
                    },
                }
            );

            setCart(response.data.cart);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to remove product"
            );

        }

    };


    // ================================
    // CLEAR CART
    // ================================

    const clearCart = async () => {

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/cart/clear`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCart(response.data.cart);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to clear cart"
            );

        }

    };


    // ================================
    // CART TOTAL
    // ================================

    const cartTotal = cart.reduce(
        (total, item) => {

            const price =
                item.product.salePrice ||
                item.product.price;

            return total + price * item.quantity;

        },
        0
    );


    // ================================
    // LOADING
    // ================================

    if (loading) {

        return (

            <div>

                {/* <Navbar /> */}

                <div className="cart-container">

                    <h2>
                        Loading cart...
                    </h2>

                </div>

                {/* <Footer /> */}

            </div>

        );

    }


    // ================================
    // NOT LOGGED IN
    // ================================

    if (!token) {

        return (

            <div>

                {/* <Navbar /> */}

                <div className="cart-container">

                    <div className="empty-cart">

                        <h2>
                            Please login
                        </h2>

                        <p>
                            You need to login to view your cart.
                        </p>

                        <Link
                            to="/signin"
                            className="empty-shop-btn"
                        >
                            Login
                        </Link>

                    </div>

                </div>

                {/* <Footer /> */}

            </div>

        );

    }


    return (

        <div>

            {/* <Navbar /> */}


            <div className="cart-container">


                {/* ================================
                    HEADER
                ================================= */}

                <div className="cart-left-header">

                    <h2>
                        Cart
                    </h2>

                    <h5>

                        <span>

                            <Link to="/">
                                Home
                            </Link>

                            {" > "}

                            <Link to="/cart">
                                Cart
                            </Link>

                        </span>

                    </h5>

                </div>


                {/* ================================
                    EMPTY CART
                ================================= */}

                {cart.length === 0 ? (

                    <div className="empty-cart">

                        <h2>
                            Your cart is empty
                        </h2>

                        <p>
                            You haven't added any products yet.
                        </p>

                        <Link
                            to="/"
                            className="empty-shop-btn"
                        >
                            Continue Shopping
                        </Link>

                    </div>

                ) : (


                    /* ================================
                       CART
                    ================================= */

                    <div className="cart-content">


                        {/* ================================
                            LEFT SIDE
                        ================================= */}

                        <div className="cartContainerLeft">


                            <div className="cart-products-heading">

                                <h3>
                                    Your Cart
                                </h3>

                                <span>
                                    {cart.length} product
                                    {cart.length > 1 ? "s" : ""}
                                </span>

                            </div>


                            {cart.map((item) => {

                                const product = item.product;

                                const price =
                                    product.salePrice ||
                                    product.price;


                                return (

                                    <div
                                        className="cart-item"
                                        key={product._id}
                                    >


                                        {/* PRODUCT IMAGE */}

                                        <div className="cart-image-box">

                                            <img
                                                src={getImageUrl(
                                                    product.images?.[0]
                                                )}
                                                alt={product.name}
                                            />

                                        </div>


                                        {/* PRODUCT DETAILS */}

                                        <div className="item-details">

                                            <h3>
                                                {product.name}
                                            </h3>


                                            <div className="cart-price">

                                                <strong>
                                                    ₹{price}
                                                </strong>


                                                {product.salePrice &&
                                                    product.price >
                                                    product.salePrice && (

                                                        <span>
                                                            ₹{product.price}
                                                        </span>

                                                    )}

                                            </div>


                                            {/* QUANTITY */}

                                            <div className="qty-box">

                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            product._id,
                                                            item.quantity
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>


                                                <span>
                                                    {item.quantity}
                                                </span>


                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            product._id,
                                                            item.quantity
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </div>


                                        {/* RIGHT SIDE */}

                                        <div className="cart-item-right">


                                            <button
                                                className="remove-btn"
                                                onClick={() =>
                                                    removeProduct(
                                                        product._id
                                                    )
                                                }
                                                title="Remove"
                                            >
                                                ×
                                            </button>


                                            <div className="item-total">

                                                ₹
                                                {(
                                                    price *
                                                    item.quantity
                                                ).toFixed(2)}

                                            </div>

                                        </div>


                                    </div>

                                );

                            })}


                            {/* CLEAR CART */}

                            <button
                                onClick={clearCart}
                                className="continue-shopping"
                                style={{
                                    cursor: "pointer",
                                    marginTop: "10px",
                                }}
                            >
                                Clear Cart
                            </button>


                        </div>


                        {/* ================================
                            ORDER SUMMARY
                        ================================= */}

                        <div className="order-summary">

                            <h2>
                                Cart Summary
                            </h2>


                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    ₹{cartTotal.toFixed(2)}
                                </span>

                            </div>


                            <div className="summary-line"></div>


                            <div className="summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{cartTotal.toFixed(2)}
                                </strong>

                            </div>


                            <Link
                                to="/checkout"
                                className="checkout-btn"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textDecoration: "none",
                                }}
                            >
                                Proceed to Checkout
                            </Link>


                            <Link
                                to="/"
                                className="continue-shopping"
                            >
                                Continue Shopping
                            </Link>

                        </div>


                    </div>

                )}

            </div>


            {/* <Footer /> */}

        </div>

    );

};


export default Cart;