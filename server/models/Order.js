const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // =====================================================
        // USER
        // =====================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // =====================================================
        // ORDER ITEMS
        // =====================================================

        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        // =====================================================
        // SHIPPING
        // =====================================================

        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },

        // =====================================================
        // PAYMENT
        // =====================================================

        paymentMethod: {
            type: String,
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
            ],
            default: "Pending",
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        // =====================================================
        // DELIVERY STATUS
        // =====================================================

        deliveryStatus: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
                "Returned",
                "Failed Delivery",
            ],
            default: "Pending",
        },

        deliveredAt: {
            type: Date,
        },

        // =====================================================
        // CANCELLATION
        // =====================================================

        cancelledByCustomer: {
            type: Boolean,
            default: false,
        },

        cancelledAt: {
            type: Date,
        },

        // =====================================================
        // RETURN
        // =====================================================

        isReturned: {
            type: Boolean,
            default: false,
        },

        returnReason: {
            type: String,
            enum: [
                "Damaged Product",
                "Wrong Item Received",
                "Defective Product",
                "Item Not as Described",
                "Size/Color Mismatch",
                "Other",
            ],
        },

        returnStatus: {
            type: String,
            enum: [
                "Requested",
                "Approved",
                "Rejected",
                "Completed",
            ],
        },

        returnedAt: {
            type: Date,
        },

        // =====================================================
        // STOCK RESTORATION FLAGS
        // =====================================================

        stockRestoredOnCancel: {
            type: Boolean,
            default: false,
        },

        stockRestoredOnReturn: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = {
    Order: mongoose.model("Order", orderSchema),
};