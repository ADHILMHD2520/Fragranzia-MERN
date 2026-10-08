import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Checkout.css";
import AdminService from "../../../services/AdminService";
import OrderService from "../../../services/OrderService";

import Gpay from "../../../assets/gpay.png";
import Card from "../../../assets/card.png";
import Bank from "../../../assets/clarity_bank-line.png";
import Cod from "../../../assets/cod.png";
import Paytm from "../../../assets/upi.png";


const Checkout = () => {

    const navigate = useNavigate();

    // ================================
    // CART
    // ================================

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================================
    // ADDRESS
    // ================================

    const [selectedAddress, setSelectedAddress] = useState("Home");
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);

    // ================================
    // PAYMENT
    // ================================

    // The UI shows individual payment methods.
    // Backend receives only COD or UPI.
    const [paymentMethod, setPaymentMethod] =
        useState("Google Pay");
    const [placingOrder, setPlacingOrder] = useState(false);

    // ================================
    // STOCK POPUP
    // ================================

    const [showStockPopup, setShowStockPopup] = useState(false);
    const [stockErrorMessage, setStockErrorMessage] = useState("");

    const token = localStorage.getItem("accessToken");


    // ================================
    // GET CART
    // ================================

    useEffect(() => {

        const fetchCart = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    "http://localhost:5000/api/cart",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Checkout cart:", response.data.cart);

                setCart(response.data.cart || []);

            } catch (error) {

                console.error(
                    "Error fetching cart:",
                    error.response?.data?.message || error.message
                );

                setCart([]);

            } finally {

                setLoading(false);

            }

        };


        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }

    }, [token]);


    // ================================
    // ADDRESS
    // ================================

    const { getAddresses } = AdminService();

    useEffect(() => {

        const fetchPrimaryAddress = async () => {

            try {

                setAddressLoading(true);

                const response = await getAddresses();

                const addresses = response.addresses || [];

                const primary = addresses.find(
                    (address) => address.isPrimary === true
                );

                setPrimaryAddress(primary || null);

            } catch (error) {

                console.error(
                    "Error fetching primary address:",
                    error.response?.data?.message || error.message
                );

                setPrimaryAddress(null);

            } finally {

                setAddressLoading(false);

            }

        };


        if (token) {
            fetchPrimaryAddress();
        } else {
            setAddressLoading(false);
        }

    }, [token]);


    // ================================
    // IMAGE URL
    // ================================

    const getProductImage = (product) => {

        if (
            !product ||
            !product.images ||
            !product.images[0]
        ) {
            return null;
        }

        if (product.images[0].startsWith("http")) {
            return product.images[0];
        }

        if (product.images[0].startsWith("/uploads/")) {
            return `http://localhost:5000${product.images[0]}`;
        }

        return `/${product.images[0]}`;

    };


    // ================================
    // CART CALCULATIONS
    // ================================

    const subtotal = cart.reduce(
        (total, item) => {

            const product = item.product;

            if (!product) {
                return total;
            }

            const price = Number(
                product.salePrice || product.price || 0
            );

            return total + price * item.quantity;

        },
        0
    );


    const originalTotal = cart.reduce(
        (total, item) => {

            const product = item.product;

            if (!product) {
                return total;
            }

            const price = Number(product.price || 0);

            return total + price * item.quantity;

        },
        0
    );


    const discountAmount = originalTotal - subtotal;


    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );


    // ================================
    // PLACE ORDER
    // ================================

    const handlePlaceOrder = async () => {

        try {

            // Check address
            if (!primaryAddress) {

                toast.info(
                    "Please add a primary address before placing the order."
                );

                return;
            }


            // Check cart
            if (!cart || cart.length === 0) {

                toast.info("Your cart is empty.");

                return;
            }


            setPlacingOrder(true);


            // Convert cart items to order items
            const orderItems = cart.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            }));


            // Order data
            const orderData = {

                orderItems,

                shippingAddress: primaryAddress._id,

                // COD is handled separately.
                // Every other payment method is processed through Razorpay.
                paymentMethod:
                    paymentMethod === "Cash on Delivery"
                        ? "COD"
                        : "UPI",

                totalPrice: subtotal,

            };


            console.log("Creating order:", orderData);

            const loadRazorpayScript = () => {
                return new Promise((resolve) => {
                    if (window.Razorpay) {
                        resolve(true);
                        return;
                    }

                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => {
                        resolve(true);
                    };
                    script.onerror = () => {
                        resolve(false);
                    };
                    document.body.appendChild(script);
                });
            };


            const handlePayment = async (data, orderId) => {
                try {

                    console.log("==== handlePayment 1");

                    const isScriptLoaded =
                        await loadRazorpayScript();

                    if (!isScriptLoaded) {

                        toast.error(
                            "Failed to load Razorpay SDK. Please check your internet connection."
                        );

                        await axios.post(
                            "http://localhost:5000/api/orders/payment-failed",
                            {
                                orderId,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        navigate("/payment", {
                            state: {
                                paymentSuccess: false,
                            },
                        });

                        return;
                    }

                    console.log("==== handlePayment 2");

                    const options = {

                        key: "rzp_test_TiV7y2gb5shVk8",

                        amount: data.amount,

                        currency: "INR",

                        name: "Fragranzia",

                        description: "Purchase Description",

                        order_id: data.id,

                        handler: async function (response) {

                            try {

                                const verifyRes =
                                    await axios.post(
                                        "http://localhost:5000/api/orders/payment/verify-payment",
                                        {
                                            razorpay_order_id:
                                                response.razorpay_order_id,

                                            razorpay_payment_id:
                                                response.razorpay_payment_id,

                                            razorpay_signature:
                                                response.razorpay_signature,
                                        },
                                        {
                                            headers: {
                                                Authorization:
                                                    `Bearer ${token}`,
                                            },
                                        }
                                    );

                                if (verifyRes.data.success) {

                                    console.log(
                                        "Payment verified successfully"
                                    );

                                    navigate("/payment", {
                                        state: {
                                            paymentSuccess: true,
                                        },
                                    });

                                } else {

                                    toast.error(
                                        "Payment verification failed!"
                                    );

                                    navigate("/payment", {
                                        state: {
                                            paymentSuccess: false,
                                        },
                                    });

                                }

                            } catch (error) {

                                console.error(
                                    "Payment verification error:",
                                    error
                                );

                                navigate("/payment", {
                                    state: {
                                        paymentSuccess: false,
                                    },
                                });

                            }

                        },

                        modal: {

                            ondismiss: async function () {

                                console.log(
                                    "Razorpay payment window closed"
                                );

                                try {

                                    await axios.post(
                                        "http://localhost:5000/api/orders/payment-failed",
                                        {
                                            orderId,
                                        },
                                        {
                                            headers: {
                                                Authorization:
                                                    `Bearer ${token}`,
                                            },
                                        }
                                    );

                                } catch (error) {

                                    console.error(
                                        "Failed to update payment failure:",
                                        error
                                    );

                                }

                                navigate("/payment", {
                                    state: {
                                        paymentSuccess: false,
                                    },
                                });

                            },

                        },

                        theme: {
                            color: "#3399cc",
                        },

                    };

                    const rzp1 =
                        new window.Razorpay(options);


                    // =========================================
                    // PAYMENT FAILED EVENT
                    // =========================================

                    rzp1.on(
                        "payment.failed",
                        async function (response) {

                            console.error(
                                "Razorpay Payment Failed:",
                                response
                            );

                            try {

                                await axios.post(
                                    "http://localhost:5000/api/orders/payment-failed",
                                    {
                                        orderId,
                                    },
                                    {
                                        headers: {
                                            Authorization:
                                                `Bearer ${token}`,
                                        },
                                    }
                                );

                            } catch (error) {

                                console.error(
                                    "Failed to update failed payment:",
                                    error
                                );

                            }

                            navigate("/payment", {
                                state: {
                                    paymentSuccess: false,
                                },
                            });

                        }
                    );


                    rzp1.open();

                } catch (error) {

                    console.error(
                        "Payment Error:",
                        error
                    );

                    navigate("/payment", {
                        state: {
                            paymentSuccess: false,
                        },
                    });

                }
            };

            // Create order
            const response = await OrderService.createOrder(orderData);


            console.log("Order created:===", response);

            if (response?.data?.success) {
                if (response?.data?.paymentMethod === "UPI") {

                    console.log(
                        "Razorpay Order ========= ",
                        response?.data?.razorpayOrder
                    );

                    if (!response?.data?.razorpayOrder) {
                        toast.error("Unable to start online payment.");
                        return;
                    }

                    await handlePayment(
                        response?.data?.razorpayOrder,
                        response?.data?.order?._id
                    );

                } else {

                    // COD order is already created successfully.
                    navigate("/payment", {
                        state: {
                            paymentSuccess: true,
                        },
                    });

                }
            }
            else {
                // toast.error(response?.data?.message);
                console.log(response?.message)
            }


            // Store order ID for later use if needed
            // if (response.data.order?._id) {

            //     sessionStorage.setItem(
            //         "latestOrderId",
            //         response.data.order._id
            //     );

            // }


            // Go to payment success page
            // navigate("/payment");


        } catch (error) {

            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to place order. Please try again.";

            console.error(
                "Error creating order:",
                errorMessage
            );


            // =========================================
            // INSUFFICIENT STOCK ERROR
            // =========================================

            if (
                error.response?.status === 400 &&
                (
                    errorMessage.toLowerCase().includes("available") ||
                    errorMessage.toLowerCase().includes("insufficient stock")
                )
            ) {

                setStockErrorMessage(errorMessage);
                setShowStockPopup(true);

                return;
            }


            // =========================================
            // OTHER ERRORS
            // =========================================

            toast.error(errorMessage);

        } finally {

            setPlacingOrder(false);

        }

    };


    // ================================
    // CLOSE STOCK POPUP
    // ================================

    const closeStockPopup = () => {

        setShowStockPopup(false);
        setStockErrorMessage("");

    };


    // ================================
    // LOADING
    // ================================

    if (loading) {

        return (

            <div
                style={{
                    padding: "100px",
                    textAlign: "center"
                }}
            >

                <h2>
                    Loading checkout...
                </h2>

            </div>

        );

    }


    // ================================
    // NOT LOGGED IN
    // ================================

    if (!token) {

        return (

            <div
                style={{
                    padding: "100px",
                    textAlign: "center"
                }}
            >

                <h2>
                    Please login
                </h2>

                <p>
                    You need to login to continue checkout.
                </p>

                <button
                    onClick={() => navigate("/signin")}
                >
                    Login
                </button>

            </div>

        );

    }


    // ================================
    // EMPTY CART
    // ================================

    if (cart.length === 0) {

        return (

            <div
                style={{
                    padding: "100px",
                    textAlign: "center"
                }}
            >

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add products to your cart before checkout.
                </p>

                <button
                    onClick={() => navigate("/products")}
                >
                    Continue Shopping
                </button>

            </div>

        );

    }


    // ================================
    // CHECKOUT
    // ================================

    return (

        <div className="container">

            {/* =================================
                    LEFT SIDE
                ================================= */}

            <div className="left-payment">


                {/* =================================
                        CART PRODUCTS
                    ================================= */}

                {cart.map((item) => {

                    const product = item.product;

                    if (!product) {
                        return null;
                    }

                    const salePrice = Number(
                        product.salePrice || product.price || 0
                    );

                    const oldPrice = Number(
                        product.price || 0
                    );


                    const discount =
                        oldPrice > salePrice
                            ? Math.round(
                                ((oldPrice - salePrice) / oldPrice) * 100
                            )
                            : 0;


                    const productImage =
                        getProductImage(product);


                    return (

                        <div
                            className="product-card"
                            key={product._id}
                        >

                            <img
                                src={productImage}
                                alt={product.name}
                            />


                            <div className="product-details">

                                <h3>
                                    {product.name}
                                </h3>


                                <p className="rating">

                                    {product.category?.name || "Perfume"}

                                    {" ⭐ "}

                                    {product.rating || 0}

                                </p>


                                <div className="qty">

                                    <button
                                        type="button"
                                        disabled
                                    >
                                        − {item.quantity} +
                                    </button>

                                </div>


                                <h2>

                                    Rs {salePrice}

                                    {oldPrice > salePrice && (

                                        <span className="old">
                                            Rs {oldPrice}
                                        </span>

                                    )}


                                    {discount > 0 && (

                                        <span className="off">
                                            {discount}% off
                                        </span>

                                    )}

                                </h2>


                                <p className="delivery">
                                    Free delivery 🚚
                                </p>


                                <p className="return">
                                    7 day return policy
                                </p>

                            </div>

                        </div>

                    );

                })}


                {/* =================================
                        PERSONAL DETAILS
                    ================================= */}

                <h2 className="section-title">
                    Personal Details
                </h2>


                <div className="tabs">

                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                    >
                        Add address +
                    </button>


                    <button
                        type="button"
                        className={
                            selectedAddress === "Home"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedAddress("Home")
                        }
                    >
                        🏠 Home
                    </button>


                    <button
                        type="button"
                        className={
                            selectedAddress === "Office"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedAddress("Office")
                        }
                    >
                        🏢 Office
                    </button>


                    <button
                        type="button"
                        className={
                            selectedAddress === "Other"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedAddress("Other")
                        }
                    >
                        📍 Other
                    </button>

                </div>


                {/* =================================
                        ADDRESS
                    ================================= */}

                <div className="address-box">

                    {addressLoading ? (

                        <p>
                            Loading address...
                        </p>

                    ) : primaryAddress ? (

                        <>

                            <h4>
                                {primaryAddress.fullName}
                            </h4>


                            <p>
                                {primaryAddress.address}
                            </p>


                            <p>
                                {primaryAddress.city},{" "}
                                {primaryAddress.state} -{" "}
                                {primaryAddress.pincode}
                            </p>


                            {primaryAddress.landmark && (

                                <p>
                                    Landmark:{" "}
                                    {primaryAddress.landmark}
                                </p>

                            )}


                            <p>
                                {primaryAddress.phone}
                            </p>


                            {primaryAddress.alternativePhone && (

                                <p>
                                    Alternative:{" "}
                                    {primaryAddress.alternativePhone}
                                </p>

                            )}

                        </>

                    ) : (

                        <p>
                            No primary address found.
                            Please add an address from your profile.
                        </p>

                    )}

                </div>

            </div>


            {/* =================================
                    RIGHT SIDE
                ================================= */}

            <div className="right-payment">


                {/* =================================
                        PRICE DETAILS
                    ================================= */}

                <div className="card">

                    <h3>
                        Price Details
                    </h3>


                    <div className="row">

                        <span>
                            Price ({totalItems} item
                            {totalItems > 1 ? "s" : ""})
                        </span>


                        <span>
                            Rs {originalTotal.toFixed(2)}
                        </span>

                    </div>


                    <div className="row">

                        <span>
                            Discount
                        </span>


                        <span>
                            Rs {discountAmount.toFixed(2)}
                        </span>

                    </div>


                    <div className="row">

                        <span>
                            Delivery Charge
                        </span>


                        <span className="green">
                            Free Delivery
                        </span>

                    </div>


                    <hr />


                    <div className="row total">

                        <span>
                            Total Amount
                        </span>


                        <span>
                            Rs {subtotal.toFixed(2)}
                        </span>

                    </div>

                </div>


                {/* =================================
                        PAYMENT METHODS
                    ================================= */}

                <div className="card">

                    <h3>
                        Payment Methods
                    </h3>


                    {/* GOOGLE PAY */}

                    <label className="payment-option">

                        <input
                            type="radio"
                            name="pay"
                            value="Google Pay"
                            checked={paymentMethod === "Google Pay"}
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                        />

                        <img
                            src={Gpay}
                            alt="Google Pay"
                        />

                        <span>
                            Google Pay
                        </span>

                    </label>


                    {/* CASH ON DELIVERY */}

                    <label className="payment-option">

                        <input
                            type="radio"
                            name="pay"
                            value="Cash on Delivery"
                            checked={paymentMethod === "Cash on Delivery"}
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                        />

                        <img
                            src={Cod}
                            alt="Cash on Delivery"
                        />

                        <span>
                            Cash on Delivery
                        </span>

                    </label>


                    {/* OTHER UPI APPS */}

                    <label className="payment-option">

                        <input
                            type="radio"
                            name="pay"
                            value="Paytm / PhonePe / Amazon Pay"
                            checked={
                                paymentMethod ===
                                "Paytm / PhonePe / Amazon Pay"
                            }
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                        />

                        <img
                            src={Paytm}
                            alt="UPI"
                        />

                        <span>
                            Paytm / PhonePe / Amazon Pay
                        </span>

                    </label>


                    {/* CREDIT / DEBIT CARD */}

                    <label className="payment-option">

                        <input
                            type="radio"
                            name="pay"
                            value="Credit/Debit Card"
                            checked={
                                paymentMethod ===
                                "Credit/Debit Card"
                            }
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                        />

                        <img
                            src={Card}
                            alt="Credit/Debit Card"
                        />

                        <span>
                            Credit/Debit Card
                        </span>

                    </label>


                    {/* NET BANKING */}

                    <label className="payment-option">

                        <input
                            type="radio"
                            name="pay"
                            value="Net Banking"
                            checked={
                                paymentMethod ===
                                "Net Banking"
                            }
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                        />

                        <img
                            src={Bank}
                            alt="Net Banking"
                        />

                        <span>
                            Net Banking
                        </span>

                    </label>


                    {/* =================================
                            PAY NOW
                        ================================= */}

                    <button
                        type="button"
                        className="pay-btn"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                    >

                        {placingOrder
                            ? "Processing..."
                            : paymentMethod === "Cash on Delivery"
                                ? "Place Order"
                                : "Pay Now"
                        }

                    </button>

                </div>

            </div>


            {/* =================================
                    STOCK ERROR POPUP
                ================================= */}

            {showStockPopup && (

                <div
                    className="stock-popup-overlay"
                    onClick={closeStockPopup}
                >

                    <div
                        className="stock-popup"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            type="button"
                            className="stock-popup-close"
                            onClick={closeStockPopup}
                        >
                            ×
                        </button>


                        <div className="stock-popup-icon">
                            !
                        </div>


                        <h2>
                            Product Not Available
                        </h2>


                        <p>
                            {stockErrorMessage}
                        </p>


                        <button
                            type="button"
                            className="stock-popup-ok"
                            onClick={closeStockPopup}
                        >
                            OK
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};


export default Checkout;