const { User } = require("../models/User");
const Product = require("../models/Product");

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check if product is already in wishlist
    const alreadyExists = user.wishlist.some(
      (item) => item.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);

    await user.save();

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product to wishlist",
      error: error.message,
    });
  }
};


// Get logged-in user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
};


// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const exists = user.wishlist.some(
      (item) => item.toString() === productId
    );

    if (!exists) {
      return res.status(404).json({
        message: "Product not found in wishlist",
      });
    }

    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing product from wishlist",
      error: error.message,
    });
  }
};


module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};

