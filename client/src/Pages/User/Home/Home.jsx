import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// components import
import Navbar from '../../../Components/User/Navbar/Navbar';
import ProductCard from "../../../Components/User/ProductCard/ProductCard";
import CategoryCard from "../../../Components/User/CategoryCard/CategoryCard";
import Footer from "../../../Components/User/Footer/Footer";

import './Home.css';


// images import
import perfumeDiscount from '../../../assets/Perfume-discount.png';
import underneathImage from '../../../assets/underneath-image.png';
import blackPerfume from '../../../assets/black-perfume.png';
import orangePerfume from '../../../assets/orange-perfume.jpg';
import luxuryPerfume from '../../../assets/luxury-perfume.png';

import Arrivals from '../../../assets/Arrivals.jpg';
import Edition from '../../../assets/Edition.jpg';
import Seller from '../../../assets/Seller.jpg';

import cat1 from '../../../assets/cat1.jpg';
import cat2 from '../../../assets/cat2.png';
import cat3 from '../../../assets/cat3.png';
import cat4 from '../../../assets/cat4.png';
import cat5 from '../../../assets/cat5.png';
import cat6 from '../../../assets/cat6.jpg';
import cat7 from '../../../assets/cat7.jpg';
import cat8 from '../../../assets/cat8.avif';
import cat9 from '../../../assets/cat9.jpg';

import elegance from '../../../assets/elegance.jpg';


// icons import
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import { MdOutlineSupportAgent } from "react-icons/md";
import {
    IoIosArrowBack,
    IoIosArrowForward
} from "react-icons/io";


const Home = () => {

    const [products, setProducts] = useState([]);


    // GET PRODUCTS FROM SERVER
    useEffect(() => {

        fetchProducts();

    }, []);


    const fetchProducts = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/products"
            );

            console.log("Products:", response.data);

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


    const productRef = useRef(null);
    const categoryRef = useRef(null);
    const offerRef = useRef(null);


    // OFFER SCROLL

    const scrollOfferLeft = () => {

        offerRef.current.scrollBy({
            left: -290,
            behavior: "smooth"
        });

    };


    const scrollOfferRight = () => {

        offerRef.current.scrollBy({
            left: 290,
            behavior: "smooth"
        });

    };


    // CATEGORY SCROLL

    const scrollCategoryLeft = () => {

        categoryRef.current.scrollBy({
            left: -240,
            behavior: "smooth"
        });

    };


    const scrollCategoryRight = () => {

        categoryRef.current.scrollBy({
            left: 240,
            behavior: "smooth"
        });

    };


    // FEATURED PRODUCTS SCROLL

    const scrollLeft = () => {

        productRef.current.scrollBy({
            left: -290,
            behavior: "smooth"
        });

    };


    const scrollRight = () => {

        productRef.current.scrollBy({
            left: 290,
            behavior: "smooth"
        });

    };


    // GET PRODUCT IMAGE URL

    const getProductImage = (product) => {

        if (!product.images || !product.images[0]) {

            return null;

        }

        return `${product.images[0]}`;

    };


    return (

        <div>

            <Navbar />


            {/* DISCOUNT BAR */}

            <div className="discount-bar">

                ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999!

            </div>


            {/* HERO */}

            <section className="hero">


                {/* TEXT */}

                <div className="hero-content">

                    <h1>

                        Discover perfumes that

                        <br />

                        celebrate individuality

                    </h1>


                    <p>

                        Every moment with an unforgettable

                        <br />

                        essence.

                    </p>


                    <button>

                        Shop Now

                    </button>

                </div>


                {/* PERFUME */}

                <div className="hero-perfumes">

                    <img
                        src={perfumeDiscount}
                        alt="Perfume"
                        className="perfume perfume-one"
                    />

                    <img
                        src={perfumeDiscount}
                        alt="Perfume"
                        className="perfume perfume-two"
                    />

                </div>


                {/* BOTTOM MOSQUE IMAGE */}

                <img
                    src={underneathImage}
                    alt=""
                    className="hero-background"
                />


                {/* SLIDER DOTS */}

                <div className="hero-dots">

                    <span></span>

                    <span></span>

                </div>

            </section>


            {/* PROMO CARDS */}

            <section className="promo-cards">


                {/* FIRST CARD */}

                <div className="promo-card">

                    <div className="promo-card-text">

                        <h3>
                            Unlock Exclusive Offers
                        </h3>

                        <p>

                            Discover special deals

                            <br />

                            tailored just for you!

                        </p>

                    </div>


                    <div className="promo-orange">

                        <img
                            src={orangePerfume}
                            alt="Orange perfume"
                        />

                    </div>

                </div>


                {/* SECOND CARD */}

                <div className="promo-card promo-gift">

                    <div className="promo-gift-content">

                        <h3>
                            Gift a Scents to your loved one.
                        </h3>

                        <p>
                            Make your love more beautiful
                        </p>

                        <img
                            src={blackPerfume}
                            alt="Gift perfume"
                        />

                    </div>

                </div>


                {/* THIRD CARD */}

                <div className="promo-card">

                    <div className="promo-luxury-left">

                        <h3>

                            Luxury Scents

                            <br />

                            Starting at ₹4,000

                        </h3>


                        <button className="promo-shop">

                            Shop

                            <br />

                            Now!

                        </button>

                    </div>


                    <div className="promo-luxury-right">

                        <img
                            src={luxuryPerfume}
                            alt="Luxury perfume"
                        />

                    </div>

                </div>

            </section>


            {/* SERVICES SECTION */}

            <section className="services">


                <div className="service-item">

                    <TbTruckDelivery className="service-icon" />

                    <div className="service-text">

                        <h3>
                            Fast & Reliable Delivery
                        </h3>

                        <p>

                            Get your orders delivered on

                            <br />

                            time, every time.

                        </p>

                    </div>

                </div>


                <div className="service-item">

                    <LuShieldCheck className="service-icon" />

                    <div className="service-text">

                        <h3>
                            Secure Payments
                        </h3>

                        <p>

                            Shop with confidence using our

                            <br />

                            encrypted payment gateways.

                        </p>

                    </div>

                </div>


                <div className="service-item">

                    <MdOutlineSupportAgent className="service-icon" />

                    <div className="service-text">

                        <h3>
                            24/7 Customer Support
                        </h3>

                        <p>

                            We're here to assist you anytime,

                            <br />

                            anywhere.

                        </p>

                    </div>

                </div>

            </section>


            {/* FEATURED COLLECTIONS */}

            <section className="featured">


                <div className="featured-header">

                    <h2>

                        Featured <span>Collections</span>

                    </h2>


                    <div className="featured-arrows">

                        <button onClick={scrollLeft}>

                            <IoIosArrowBack />

                        </button>


                        <button onClick={scrollRight}>

                            <IoIosArrowForward />

                        </button>

                    </div>

                </div>


                <div
                    className="product-list"
                    ref={productRef}
                >

                    {products.map((product) => (

                        <ProductCard

                            key={product._id}

                            id={product._id}

                            image={getProductImage(product)}

                            name={product.name}

                            price={product.salePrice}

                            oldPrice={product.price}

                        />

                    ))}

                </div>

            </section>


            {/* BRAND INTRO */}

            <section className="brand-intro">

                <p>

                    "It's an art. A craft. A science. At Fragranzia, we're in

                    <br />

                    the business of creating memories that last forever

                    <br />

                    through our fragrances."

                </p>

            </section>


            {/* COLLECTION BANNERS */}

            <section className="collection-banners">


                <div className="collection-banner">

                    <img
                        src={Arrivals}
                        alt="New Arrivals"
                    />

                    <h2>
                        New Arrivals
                    </h2>

                </div>


                <div className="collection-banner">

                    <img
                        src={Edition}
                        alt="Limited Edition"
                    />

                    <h2>
                        Limited Edition
                    </h2>

                </div>


                <div className="collection-banner">

                    <img
                        src={Seller}
                        alt="Best Sellers"
                    />

                    <h2>
                        Best Sellers
                    </h2>

                </div>

            </section>


            {/* EXPLORE CATEGORIES */}

            <section className="categories">


                <div className="categories-header">

                    <h2>

                        Explore <span>Categories</span>

                    </h2>


                    <div className="category-arrows">

                        <button onClick={scrollCategoryLeft}>

                            <IoIosArrowBack />

                        </button>


                        <button onClick={scrollCategoryRight}>

                            <IoIosArrowForward />

                        </button>

                    </div>

                </div>


                <div
                    className="category-list"
                    ref={categoryRef}
                >

                    <CategoryCard
                        image={cat1}
                        name="Eau De Parfum"
                    />

                    <CategoryCard
                        image={cat2}
                        name="Concentrated"
                    />

                    <CategoryCard
                        image={cat3}
                        name="Deodorants"
                    />

                    <CategoryCard
                        image={cat4}
                        name="Body Mist"
                    />

                    <CategoryCard
                        image={cat5}
                        name="Combo"
                    />

                    <CategoryCard
                        image={cat6}
                        name="Combo"
                    />

                    <CategoryCard
                        image={cat7}
                        name="Combo"
                    />

                    <CategoryCard
                        image={cat8}
                        name="Combo"
                    />

                    <CategoryCard
                        image={cat9}
                        name="Combo"
                    />

                </div>

            </section>


            {/* OFFERS ZONE */}

            <section className="offers-zone">


                <div className="offers-header">

                    <h2>
                        Offers Zone
                    </h2>


                    <div className="offer-arrows">

                        <button onClick={scrollOfferLeft}>

                            <IoIosArrowBack />

                        </button>


                        <button onClick={scrollOfferRight}>

                            <IoIosArrowForward />

                        </button>

                    </div>

                </div>


                <div
                    className="offer-product-list"
                    ref={offerRef}
                >

                    {products.map((product) => (

                        <ProductCard

                            key={`offer-${product._id}`}

                            id={product._id}

                            image={getProductImage(product)}

                            name={product.name}

                            price={product.salePrice}

                            oldPrice={product.price}

                        />

                    ))}

                </div>

            </section>


            {/* ELEGANCE BANNER */}

            <section className="elegance-banner">


                <img
                    src={elegance}
                    alt="Elegance in every bottle"
                />


                <div className="elegance-content">

                    <h2>
                        Elegance in Every Bottle
                    </h2>

                    <p>

                        Discover timeless fragrances crafted

                        <br />

                        to leave a lasting impression.

                    </p>


                    <button>
                        Shop Now
                    </button>

                </div>

            </section>


            <Footer />

        </div>

    );

};


export default Home;