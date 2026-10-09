require("dotenv").config();
// inorder to use .env file datas

const express = require("express");
const cors = require("cors");

const connectDb = require("./config/db");

const productRoutes = require("./routes/ProductRoutes");
const registerLoginRoutes = require("./routes/RegisterLoginRoutes");
const cartRoutes = require("./routes/CartRoutes");
const wishlistRoutes = require("./routes/WishlistRoutes");
const addressRoutes = require("./routes/AddressRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");



const app = express();

const PORT = process.env.PORT || 5000; 


// connect to database
connectDb();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];
// only allow these links can access the project



app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// use is a Middleware
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
