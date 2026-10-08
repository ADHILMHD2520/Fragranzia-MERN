require("dotenv").config();
// inorder to use .env file datas

const express = require("express");
const cors = require("cors");

const connectDb = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const registerLoginRoutes = require("./routes/RegisterLoginRoutes");
const cartRoutes = require("./routes/CartRoutes");
const wishlistRoutes = require("./routes/WishlistRoutes");
const addressRoutes = require("./routes/AddressRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");



const app = express();

const PORT = process.env.PORT || 5000; 


// connect to database
connectDb();

app.use(cors());

// use is a middleware
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/", registerLoginRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);



app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
