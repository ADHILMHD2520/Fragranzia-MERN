const express = require("express");

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/CartController");

const authMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();


// Add product to cart
router.post("/add", authMiddleware, addToCart);


// Get cart
router.get("/", authMiddleware, getCart);

// update cart
router.put("/update", authMiddleware, updateCart);

// remove from cart
router.delete("/remove", authMiddleware, removeFromCart);

// cart clear
router.delete("/clear", authMiddleware, clearCart);


module.exports = router;