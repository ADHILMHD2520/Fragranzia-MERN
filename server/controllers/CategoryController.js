const Category = require("../models/Category");


// =========================
// CREATE CATEGORY
// =========================

const createCategory = async (req, res) => {

    try {

        const { name, description } = req.body;

        const category = await Category.create({
            name,
            description
        });

        res.status(201).json({

            message: "Category created successfully",

            category

        });

    } catch (error) {

        res.status(500).json({

            message: "Error creating category",

            error: error.message

        });

    }

};


// =========================
// GET ALL CATEGORIES
// =========================

const getCategories = async (req, res) => {

    try {

        const categories = await Category.find();

        res.status(200).json({

            categories

        });

    } catch (error) {

        res.status(500).json({

            message: "Error getting categories",

            error: error.message

        });

    }

};


// =========================
// GET SINGLE CATEGORY
// =========================

const getCategory = async (req, res) => {

    try {

        const category =
            await Category.findById(req.params.id);


        if (!category) {

            return res.status(404).json({

                message: "Category not found"

            });

        }


        res.status(200).json({

            category

        });

    } catch (error) {

        res.status(500).json({

            message: "Error getting category",

            error: error.message

        });

    }

};


// =========================
// UPDATE CATEGORY
// =========================

const updateCategory = async (req, res) => {

    try {

        const { name, description } = req.body;


        const category =
            await Category.findByIdAndUpdate(

                req.params.id,

                {
                    name,
                    description
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!category) {

            return res.status(404).json({

                message: "Category not found"

            });

        }


        res.status(200).json({

            message: "Category updated successfully",

            category

        });

    } catch (error) {

        res.status(500).json({

            message: "Error updating category",

            error: error.message

        });

    }

};


// =========================
// DELETE CATEGORY
// =========================

const deleteCategory = async (req, res) => {

    try {

        const category =
            await Category.findByIdAndDelete(
                req.params.id
            );


        if (!category) {

            return res.status(404).json({

                message: "Category not found"

            });

        }


        res.status(200).json({

            message: "Category deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: "Error deleting category",

            error: error.message

        });

    }

};


// =========================
// TOGGLE CATEGORY STATUS
// =========================

const toggleCategoryStatus = async (req, res) => {

    try {

        const category =
            await Category.findById(req.params.id);


        if (!category) {

            return res.status(404).json({

                message: "Category not found"

            });

        }


        // Toggle status
        category.isActive = !category.isActive;


        await category.save();


        res.status(200).json({

            message: category.isActive
                ? "Category unblocked successfully"
                : "Category blocked successfully",

            category

        });

    } catch (error) {

        console.error(
            "Toggle category status error:",
            error
        );


        res.status(500).json({

            message: "Error updating category status",

            error: error.message

        });

    }

};


// =========================
// EXPORT
// =========================

module.exports = {

    createCategory,

    getCategories,

    getCategory,

    updateCategory,

    deleteCategory,

    toggleCategoryStatus

};