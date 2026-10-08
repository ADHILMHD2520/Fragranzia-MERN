import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../../../Components/Admin/Sidebar/Sidebar";
import "./AddProduct.css";
import { useNavigate, useParams } from "react-router-dom";

import AdminService from "../../../services/AdminService";

const AddProduct = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const {
        addToProduct,
        updateProduct,
        getCategoryData,
        getProductData
    } = AdminService();

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        salePrice: "",
        stock: "",
        category: "",
        description: "",
        image: null
    });


    // =========================
    // FETCH CATEGORIES
    // =========================

    const fetchCategory = async () => {
        try {

            const data = await getCategoryData();

            console.log("Category response:", data);

            setCategories(data.categories || []);

        } catch (error) {

            console.error(
                "Error fetching Category:",
                error.response?.data?.message || error.message
            );

        }
    };


    // =========================
    // FETCH PRODUCT FOR EDIT
    // =========================

    const fetchProduct = async () => {
        try {

            const data = await getProductData();

            console.log("Product response:", data);

            const products = data.products || [];

            const product = products.find(
                (item) => item._id === id
            );

            if (!product) {
                console.error("Product not found");
                return;
            }

            setFormData({
                name: product.name || "",
                price: product.price || "",
                salePrice: product.salePrice || "",
                stock: product.stock || "",
                category: product.category?._id || product.category || "",
                description: product.description || "",
                image: null
            });

        } catch (error) {

            console.error(
                "Error fetching product:",
                error.response?.data?.message || error.message
            );

        }
    };


    // =========================
    // USE EFFECT
    // =========================

    useEffect(() => {

        fetchCategory();

        if (id) {
            fetchProduct();
        }

    }, [id]);


    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // =========================
    // HANDLE IMAGE
    // =========================

    const handleImageChange = (e) => {

        const selectedImage = e.target.files[0];

        setFormData({
            ...formData,
            image: selectedImage
        });
    };


    // =========================
    // SUBMIT PRODUCT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const productData = new FormData();

            productData.append("name", formData.name);
            productData.append(
                "description",
                formData.description
            );

            productData.append(
                "price",
                Number(formData.price)
            );

            productData.append(
                "salePrice",
                Number(formData.salePrice)
            );

            productData.append(
                "stock",
                Number(formData.stock)
            );

            productData.append(
                "category",
                formData.category
            );

            if (formData.image) {
                productData.append(
                    "image",
                    formData.image
                );
            }


            // =========================
            // UPDATE PRODUCT
            // =========================

            if (id) {

                const response = await updateProduct(
                    id,
                    productData
                );

                console.log("Product updated:", response);

                toast.success("Product updated successfully");

            }

            // =========================
            // ADD PRODUCT
            // =========================

            else {

                const response = await addToProduct(
                    productData
                );

                console.log("Product added:", response);

                toast.success("Product added successfully");
            }


            navigate("/admin/products");

        } catch (error) {

            console.error(
                "Error saving product:",
                error.response?.data?.message ||
                error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Error saving product"
            );
        }
    };


    return (
        <div className="admin-add-product-container">

            {/* <Sidebar /> */}

            <main className="add-product-page">

                <div className="add-product-header">

                    <h1>
                        {id ? "Edit Product" : "Add Product"}
                    </h1>

                    <p>
                        Add your product and necessary information from here
                    </p>

                </div>


                <form
                    className="add-product-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Product Title/Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Product Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                placeholder="Enter product price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="form-row three-columns">

                        <div className="form-group">

                            <label>
                                Sale Price
                            </label>

                            <input
                                type="number"
                                name="salePrice"
                                placeholder="Enter sale price"
                                value={formData.salePrice}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Product Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                placeholder="Enter stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map((category) => (

                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>


                    <div className="form-group description-group">

                        <label>
                            Product Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Enter product description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Product Image
                        </label>

                        <div className="image-upload-box">

                            <input
                                type="file"
                                name="image"
                                id="file-upload"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleImageChange}
                            />

                            <label
                                htmlFor="file-upload"
                                className="upload-label"
                            >

                                <p className="main-text">
                                    Click to upload or drag & drop
                                </p>

                                <p className="sub-text">
                                    JPEG, PNG, or WEBP only
                                </p>

                            </label>

                        </div>

                    </div>


                    <div className="form-buttons">

                        <button
                            type="button"
                            className="cancel-product-btn"
                            onClick={() =>
                                navigate("/admin/products")
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="add-product-submit-btn"
                        >
                            {id
                                ? "Update Product"
                                : "Add Product"
                            }
                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
};

export default AddProduct;