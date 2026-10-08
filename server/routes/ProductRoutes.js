const express = require("express");

const {
    getProducts,
    createProduct,
    editProduct,
    getProduct,
    deleteProduct,
    toggleProductStatus
} = require("../controllers/ProductController");

const {upload} = require("../Middleware/uploads");


const router = express.Router();

router.get("/", getProducts);

// CREATE PRODUCT
// router.post("/", createProduct);
router.post("/", upload.single("image"), createProduct);        // for single image upload
// router.post("/", upload.array("images", 4), createProduct);     // for uploading images , maximum no.of images is 4

// edit Product
// router.put("/:id", editProduct);
router.put("/:id", upload.single("image"), editProduct);

// getting sinfle product
router.get("/:id", getProduct);

router.delete("/:id",deleteProduct);

router.put("/:id/status",toggleProductStatus);


module.exports = router;