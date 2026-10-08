const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {

        // =====================================================
        // BASIC USER INFORMATION
        // =====================================================

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please enter a valid email address"
            ]
        },

        password: {
            type: String
        },

        phone: {
            type: String,
            match: [
                /^\d{10}$/,
                "Phone number must be exactly 10 digits"
            ]
        },

        // =====================================================
        // PROFILE INFORMATION
        // =====================================================

        dateOfBirth: {
            type: Date
        },

        gender: {
            type: String,
            enum: [
                "Male",
                "Female",
                "Other"
            ]
        },

        // =====================================================
        // GOOGLE LOGIN
        // =====================================================

        googleId: {
            type: String,
            unique: true,
            sparse: true
        },

        loginMethod: {
            type: String,
            enum: [
                "local",
                "google"
            ],
            default: "local"
        },

        // =====================================================
        // USER IMAGE
        // =====================================================

        image: {
            type: String
        },

        // =====================================================
        // USER STATUS
        // =====================================================

        status: {
            type: Boolean,
            required: [true, "Status is required"],
            default: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        // =====================================================
        // ROLE
        // =====================================================

        role: {
            type: String,
            enum: [
                "admin",
                "user"
            ],
            default: "user"
        },

        // =====================================================
        // CART
        // =====================================================

        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        cart_total: {
            type: Number,
            default: 0
        },

        // =====================================================
        // WISHLIST
        // =====================================================

        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]
    },

    {
        timestamps: true
    }
);

module.exports = {
    User: mongoose.model("User", userSchema)
};