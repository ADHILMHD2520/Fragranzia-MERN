import React, { useEffect, useState } from "react";
import axios from "axios";

import "./AllProducts.css";

import { Link } from "react-router-dom";

import Navbar from "../../../Components/User/Navbar/Navbar";
import Footer from "../../../Components/User/Footer/Footer";
import ProductCard from "../../../Components/User/ProductCard/ProductCard";


const AllProducts = () => {

    const [products, setProducts] = useState([]);


    // FETCH PRODUCTS FROM SERVER

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


    // GET PRODUCT IMAGE URL

    const getProductImage = (product) => {

        if (!product.images || !product.images[0]) {

            return null;

        }

        return `${product.images[0]}`;

    };


    return (

        <div className="all-products-container">


            <Navbar />


            {/* BLUE HEADER */}

            <div className="all-products-blue-header">

                <p>
                    ENJOY FREE SHIPPING ON ORDERS OVER ₹1,399
                </p>

            </div>


            <main className="all-products-page">


                {/* BREADCRUMB */}

                <div className="all-products-breadcrumb">

                    <Link to="/">
                        Home
                    </Link>

                    <span>
                        &gt;
                    </span>

                    <span>
                        Products
                    </span>

                </div>


                {/* PAGE TITLE + SORT */}

                <div className="all-products-header">


                    <div className="all-products-title">

                        <h1>
                            All Products
                        </h1>

                    </div>


                    <div className="all-products-sort">

                        <span>
                            Sort by:
                        </span>


                        <button>
                            Relevance
                        </button>


                        <button>
                            Newest First
                        </button>


                        <button>
                            Popularity
                        </button>


                        <button>
                            Price - Low to High
                        </button>


                        <button>
                            Price - High to Low
                        </button>


                        <button className="filter-button">
                            Filter
                        </button>

                    </div>

                </div>


                {/* PRODUCTS */}

                <div className="all-products-grid">


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


            </main>


            <Footer />


        </div>

    );

};


export default AllProducts;