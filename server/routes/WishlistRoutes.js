const express = require("express");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/WishlistController");

const authMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();


// Add product to wishlist
router.post("/add", authMiddleware, addToWishlist);


// Get wishlist
router.get("/", authMiddleware, getWishlist);


// Remove product from wishlist
router.delete("/remove", authMiddleware, removeFromWishlist);


module.exports = router;
