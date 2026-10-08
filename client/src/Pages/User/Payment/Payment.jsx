import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Checkout from "../Checkout/Checkout";
import "./Payment.css";

const Payment = () => {

    const navigate = useNavigate();

    const [paymentSuccess, setPaymentSuccess] =
        useState(
            location.state?.paymentSuccess ?? true
        );
    // const [paymentSuccess, setPaymentSuccess] = useState(false);

    const token = localStorage.getItem("accessToken");

    // =========================
    // CLEAR CART AFTER SUCCESS
    // =========================

    useEffect(() => {

        const clearCartAfterPayment = async () => {

            // Only clear cart when payment/order is successful
            if (!paymentSuccess || !token) {
                return;
            }

            try {

                const response = await axios.delete(
                    "http://localhost:5000/api/cart/clear",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(
                    "Cart cleared after successful payment:",
                    response.data
                );

            } catch (error) {

                console.error(
                    "Error clearing cart after payment:",
                    error.response?.data || error.message
                );

            }
        };

        clearCartAfterPayment();

    }, [paymentSuccess, token]);


    // =========================
    // BACK TO HOME
    // =========================

    const handleBackToHome = () => {
        navigate("/");
    };


    // =========================
    // TRACK ORDER
    // =========================

    const handleTrackOrder = () => {
        navigate("/profile?tab=orders");
    };


    // =========================
    // RETRY
    // =========================

    const handleRetry = () => {
        setPaymentSuccess(true);
    };


    return (

        <div className="payment-page">

            <div className="checkout-background">
                <Checkout />
            </div>


            <div className="payment-overlay">

                {paymentSuccess ? (

                    // =========================
                    // SUCCESS
                    // =========================

                    <div className="payment-box">

                        <div className="success-icon">
                            ✓
                        </div>


                        <h2>
                            Thank You for Ordering!
                        </h2>


                        <p>
                            Your order has been successfully placed.
                        </p>


                        <p>
                            We're preparing it for shipment
                        </p>


                        <div className="payment-buttons">

                            <button
                                className="home-btn"
                                onClick={handleBackToHome}
                            >
                                Back to Home
                            </button>


                            <button
                                className="track-btn"
                                onClick={handleTrackOrder}
                            >
                                Track Order
                            </button>

                        </div>

                    </div>

                ) : (

                    // =========================
                    // FAILURE
                    // =========================

                    <div className="payment-box">

                        <div className="failure-icon">
                            ✕
                        </div>


                        <h2>
                            Your order has failed!
                        </h2>


                        <p>
                            Your order can't be completed
                        </p>


                        <p>
                            Please check your internet connection!
                        </p>


                        <div className="payment-buttons">

                            <button
                                className="home-btn"
                                onClick={handleBackToHome}
                            >
                                Back to Home
                            </button>


                            <button
                                className="track-btn"
                                onClick={handleRetry}
                            >
                                Retry
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Payment;