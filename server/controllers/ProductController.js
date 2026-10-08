const Product = require("../models/Product");
const { cloudinary } = require("../Middleware/uploads");

// ==========================================
// UPLOAD IMAGE TO CLOUDINARY
// ==========================================
const uploadToCloudinary = (fileBuffer, folder = "products") => {
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        uploadStream.end(fileBuffer);
    });
};


// ==========================================
// CREATE PRODUCT
// ==========================================
const createProduct = async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            salePrice,
            stock,
            category
        } = req.body;


        let imageUrl = null;


        // Upload image to Cloudinary
        if (req.file) {

            const result = await uploadToCloudinary(
                req.file.buffer
            );

            imageUrl = result.secure_url;
            console.log("uploaded image url=====",imageUrl);
            
        }


        const product = await Product.create({

            name,
            description,
            price,
            salePrice,
            stock,
            category,

            images: imageUrl
                ? [imageUrl]
                : []

        });


        res.status(201).json({

            message: "Product created successfully",

            product

        });


    } catch (error) {

        console.error(
            "Create product error:",
            error
        );


        res.status(500).json({

            message: "Error creating product",

            error: error.message

        });

    }

};


// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getProducts = async (req, res) => {

    try {

        const products =
            await Product
                .find()
                .populate("category");


        res.status(200).json({

            products

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ==========================================
// EDIT PRODUCT
// ==========================================
const editProduct = async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            salePrice,
            stock,
            category
        } = req.body;


        const existingProduct =
            await Product.findById(
                req.params.id
            );


        if (!existingProduct) {

            return res.status(404).json({

                message: "Product not found"

            });

        }


        const updateData = {

            name,
            description,
            price,
            salePrice,
            stock,
            category

        };


        // Replace image only if a new image is uploaded
        if (req.file) {

            const result =
                await uploadToCloudinary(
                    req.file.buffer
                );


            updateData.images = [
                result.secure_url
            ];

        }


        const product =
            await Product.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true,
                    runValidators: true
                }

            );


        res.status(200).json({

            message: "Product updated successfully",

            product

        });


    } catch (error) {

        console.error(
            "Edit product error:",
            error
        );


        res.status(500).json({

            message: error.message

        });

    }

};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const getProduct = async (req, res) => {

    try {

        const product =
            await Product
                .findById(req.params.id)
                .populate("category");


        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }


        res.status(200).json({

            product

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {

    try {

        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }


        res.status(200).json({

            message: "Product deleted successfully"

        });


    } catch (error) {

        res.status(500).json({

            message: "Error deleting product",

            error: error.message

        });

    }

};


// ==========================================
// BLOCK / UNBLOCK PRODUCT
// ==========================================
const toggleProductStatus = async (req, res) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }


        product.isActive =
            !product.isActive;


        await product.save();


        res.status(200).json({

            message: product.isActive
                ? "Product unblocked successfully"
                : "Product blocked successfully",

            product

        });


    } catch (error) {

        res.status(500).json({

            message: "Error updating product status",

            error: error.message

        });

    }

};


module.exports = {

    getProducts,
    createProduct,
    editProduct,
    getProduct,
    deleteProduct,
    toggleProductStatus

};