import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductCard.css";

import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProductCard = ({
    id,
    image,
    name,
    price,
    oldPrice
}) => {

    const navigate = useNavigate();

    const [isWishlisted, setIsWishlisted] = useState(false);


    // CHECK WHETHER PRODUCT IS IN WISHLIST
    useEffect(() => {

        const checkWishlist = async () => {

            try {

                const token = localStorage.getItem("accessToken");

                if (!token) {
                    return;
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/wishlist/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const wishlist = response.data.wishlist || [];

                const exists = wishlist.some(
                    (product) => product._id === id
                );

                setIsWishlisted(exists);

            } catch (error) {

                console.error(
                    "Error checking wishlist:",
                    error.response?.data?.message || error.message
                );

            }

        };

        checkWishlist();

    }, [id]);


    // OPEN PRODUCT DETAILS
    const openProduct = () => {

        navigate(`/product/${id}`);

    };


    // ADD PRODUCT TO CART
    const handleAddToCart = async () => {

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.info("Please login to add products to cart");
                navigate("/signin");
                return;
            }
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
                {
                    productId: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) {
                toast.error(
                    error.response.data.message ||
                    "Unable to add product to cart"
                );
            } else {
                toast.error("Something went wrong");
            }
        }
    };


    // TOGGLE WISHLIST
    const handleWishlist = async (event) => {

        // Prevent opening product details
        event.stopPropagation();

        try {
            const token = localStorage.getItem("accessToken");

            // CHECK LOGIN
            if (!token) {
                toast.info("Please login to manage your wishlist");
                navigate("/signin");
                return;

            }


            // REMOVE FROM WISHLIST
            if (isWishlisted) {

                const response = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/wishlist/remove`,
                    {
                        data: {
                            productId: id
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setIsWishlisted(false);

                console.log(response.data.message)
                toast.success(response.data.message);
            }


            // ADD TO WISHLIST
            else {

                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/wishlist/add`,
                    {
                        productId: id
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setIsWishlisted(true);

                toast.success(response.data.message);

            }

        } catch (error) {

            console.error(error);

            if (error.response) {

                toast.error(
                    error.response.data.message ||
                    "Unable to update wishlist"
                );

            } else {

                toast.error("Something went wrong");

            }

        }

    };


    return (

        <div className="product-card">


            {/* IMAGE */}

            <div
                className="product-image-box"
                onClick={openProduct}
            >

                <div className="new-badge">
                    New
                </div>


                <img
                    src={image}
                    alt={name}
                    className="product-image"
                />


                {/* WISHLIST */}

                <button
                    className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""
                        }`}
                    onClick={handleWishlist}
                >

                    {isWishlisted ? (
                        <FaHeart />
                    ) : (
                        <CiHeart />
                    )}

                </button>

            </div>


            {/* PRODUCT INFORMATION */}

            <div className="product-info">


                <h3
                    onClick={openProduct}
                    style={{ cursor: "pointer" }}
                >
                    {name}
                </h3>


                <div className="product-price">

                    <span className="current-price">
                        ₹{price}
                    </span>


                    {oldPrice &&
                        Number(oldPrice) > Number(price) && (

                            <span className="old-price">
                                ₹{oldPrice}
                            </span>

                        )}

                </div>


                <button
                    className="add-cart-btn"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>


            </div>

        </div>

    );

};


export default ProductCard;