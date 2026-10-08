const express = require("express");

const {

    createCategory,

    getCategories,

    getCategory,

    updateCategory,

    deleteCategory,

    toggleCategoryStatus

} = require("../controllers/CategoryController");


const router = express.Router();


// =========================
// CREATE CATEGORY
// =========================

router.post(
    "/",
    createCategory
);


// =========================
// GET ALL CATEGORIES
// =========================

router.get(
    "/",
    getCategories
);


// =========================
// GET SINGLE CATEGORY
// =========================

router.get(
    "/:id",
    getCategory
);


// =========================
// UPDATE CATEGORY
// =========================

router.put(
    "/:id",
    updateCategory
);


// =========================
// BLOCK / UNBLOCK CATEGORY
// =========================

router.put(
    "/:id/status",
    toggleCategoryStatus
);


// =========================
// DELETE CATEGORY
// =========================

router.delete(
    "/:id",
    deleteCategory
);


module.exports = router;