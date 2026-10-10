import React, { useEffect, useState } from 'react';
import './ProductDetails.css';
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';

import ProductCard from '../../../Components/User/ProductCard/ProductCard';

import { CiHeart } from "react-icons/ci";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { IoPricetag } from "react-icons/io5";

import {
    IoIosArrowBack,
    IoIosArrowForward
} from "react-icons/io";

import Navbar from '../../../Components/User/Navbar/Navbar';
import Footer from '../../../Components/User/Footer/Footer';


const ProductDetails = () => {

    const navigate = useNavigate();

    // GET PRODUCT ID FROM URL
    const { id } = useParams();

    // PRODUCT
    const [product, setProduct] = useState(null);

    // ALL PRODUCTS
    const [products, setProducts] = useState([]);

    // LOADING
    const [loading, setLoading] = useState(true);

    // QUANTITY
    const [quantity, setQuantity] = useState(1);


    // FETCH SELECTED PRODUCT
    useEffect(() => {

        fetchProduct();

    }, [id]);


    const fetchProduct = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/products/${id}`
            );

            console.log(
                "Selected product:",
                response.data.product
            );

            setProduct(response.data.product);

        } catch (error) {

            console.error(
                "Error fetching product:",
                error.response?.data?.message || error.message
            );

            setProduct(null);

        } finally {

            setLoading(false);

        }

    };


    // FETCH PRODUCTS FOR SUGGESTIONS
    useEffect(() => {

        fetchProducts();

    }, []);


    const fetchProducts = async () => {

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/products`
            );

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


    // INCREASE QUANTITY
    const increaseQuantity = () => {

        setQuantity(quantity + 1);

    };


    // DECREASE QUANTITY
    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(quantity - 1);

        }

    };


    // PRODUCT IMAGE URL
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


    // PURCHASE NOW
    const handlePurchaseNow = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                toast.info("Please login to purchase the product.");
                navigate("/signin");
                return;
            }

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
                {
                    productId: product._id,
                    quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/checkout");
        } catch (error) {
            console.error(
                "Purchase Now error:",
                error.response?.data?.message || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to purchase this product."
            );
        }
    };


    // LOADING
    if (loading) {

        return (

            <>

                <Navbar />

                <div
                    style={{
                        padding: "100px",
                        textAlign: "center"
                    }}
                >

                    <h2>
                        Loading product...
                    </h2>

                </div>

                <Footer />

            </>

        );

    }


    // PRODUCT NOT FOUND
    if (!product) {

        return (

            <>

                <Navbar />

                <div
                    style={{
                        padding: "100px",
                        textAlign: "center"
                    }}
                >

                    <h2>
                        Product not found
                    </h2>

                </div>

                <Footer />

            </>

        );

    }


    // IMAGE
    const productImage = getProductImage(product);


    return (

        <>

            <Navbar />


            <main className="product-details-page">


                {/* BREADCRUMB */}

                <div className="product-breadcrumb">

                    Home &gt; Products &gt; {product.name}

                </div>


                <div className="product-details-container">


                    {/* LEFT SIDE */}

                    <div className="product-left">


                        <div className="product-gallery">


                            {/* THUMBNAILS */}

                            <div className="product-thumbnails">

                                {product.images?.map((image, index) => (

                                    <div
                                        className={`thumbnail ${index === 0
                                            ? "active-thumbnail"
                                            : ""
                                            }`}
                                        key={index}
                                    >

                                        <img
                                            src={`${image}`}
                                            alt={product.name}
                                        />

                                    </div>

                                ))}

                            </div>


                            {/* MAIN IMAGE */}

                            <div className="product-main-image">

                                <img
                                    src={productImage}
                                    alt={product.name}
                                />

                            </div>


                            {/* ACTION BUTTONS */}

                            <div className="product-actions">


                                <button>

                                    <CiHeart />

                                </button>


                                <button>

                                    <IoShareSocialOutline />

                                </button>


                            </div>


                        </div>


                        {/* PURCHASE BUTTONS */}

                        <div className="purchase-buttons">


                            <button
                                type="button"
                                className="purchase-now"
                                onClick={handlePurchaseNow}
                            >
                                Purchase Now
                            </button>


                            <button
                                className="add-cart-details"
                                onClick={() => {

                                    toast.info("Cart functionality will be added later.");

                                }}
                            >

                                Add to Cart

                            </button>


                        </div>


                    </div>


                    {/* RIGHT SIDE */}

                    <div className="product-info">


                        {/* NAME */}

                        <h1>

                            {product.name}

                        </h1>


                        {/* CATEGORY */}

                        <p className="product-brand">

                            {product.category?.name || "Perfume"}

                        </p>


                        {/* RATING */}

                        <div className="product-rating">


                            <strong>

                                {product.rating || 0}

                            </strong>


                            <FaStar />


                            <span>

                                {product.ratings || 0}

                            </span>


                        </div>


                        {/* STOCK */}

                        {product.stock > 0 ? (

                            <p className="stock-warning">

                                Hurry! Only {product.stock} stocks left!

                            </p>

                        ) : (

                            <p className="stock-warning">

                                Out of stock

                            </p>

                        )}


                        {/* PRICE */}

                        <div className="product-detail-price">


                            <strong>

                                Rs {product.salePrice}

                            </strong>


                            {product.price &&
                                Number(product.price) >
                                Number(product.salePrice) && (

                                    <span className="detail-old-price">

                                        Rs {product.price}

                                    </span>

                                )}


                            {product.price &&
                                product.salePrice &&
                                Number(product.price) >
                                Number(product.salePrice) && (

                                    <span className="discount">

                                        {Math.round(
                                            (
                                                (
                                                    Number(product.price) -
                                                    Number(product.salePrice)
                                                )
                                                /
                                                Number(product.price)
                                            ) * 100
                                        )}% OFF

                                    </span>

                                )}


                        </div>


                        {/* QUANTITY */}

                        <div className="quantity-box">


                            <button
                                onClick={decreaseQuantity}
                            >

                                -

                            </button>


                            <span>

                                {quantity}

                            </span>


                            <button
                                onClick={increaseQuantity}
                            >

                                +

                            </button>


                        </div>


                        {/* DELIVERY */}

                        <div className="product-section">


                            <h3>

                                Delivery

                            </h3>


                            <p>

                                Delivery by 28 Aug, Wednesday | Free

                                <br />

                                if ordered before 9:24 PM

                            </p>


                        </div>


                        {/* DESCRIPTION */}

                        <div className="product-section">


                            <h3>

                                Description

                            </h3>


                            <p>

                                {product.description}

                            </p>


                        </div>


                        {/* OFFERS */}

                        <div className="product-section available-offers">


                            <h3>

                                Available Offers

                            </h3>


                            <p>

                                <IoPricetag />

                                Buy two of the same product and get a third one free.

                            </p>


                            <p>

                                <IoPricetag />

                                Enjoy free standard shipping on orders exceeding ₹1,399.

                            </p>


                            <p>

                                <IoPricetag />

                                Get 15% off your first order.

                            </p>


                            <p>

                                <IoPricetag />

                                Receive a free tool case with the purchase of any perfume over ₹2,000.

                            </p>


                        </div>


                    </div>


                </div>


                {/* SUGGESTED PRODUCTS */}

                <section className="suggested-products">


                    <div className="suggested-header">


                        <h2>

                            Suggested for you

                        </h2>


                        <div className="suggested-arrows">


                            <button>

                                <IoIosArrowBack />

                            </button>


                            <button>

                                <IoIosArrowForward />

                            </button>


                        </div>


                    </div>


                    <div className="suggested-product-list">


                        {products
                            .filter(
                                (item) =>
                                    item._id !== product._id
                            )
                            .map((item) => (

                                <ProductCard

                                    key={item._id}

                                    id={item._id}

                                    image={getProductImage(item)}

                                    name={item.name}

                                    price={item.salePrice}

                                    oldPrice={item.price}

                                />

                            ))}


                    </div>


                </section>


            </main>


            <Footer />

        </>

    );

};


export default ProductDetails;
