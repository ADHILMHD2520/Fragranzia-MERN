const express = require("express");

const {
    createOrder,
    verifyPayment,
    paymentFailed,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateDeliveryStatus,
    updatePaymentStatus,
    cancelOrder,
    requestReturn,
    updateReturnStatus,
} = require("../controllers/OrderController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const adminMiddleware = require("../Middleware/AdminMiddleware");

const router = express.Router();


// =====================================================
// USER ORDER ROUTES
// =====================================================

// Create order
router.post(
    "/create",
    authMiddleware,
    createOrder
);

// Get logged-in user's orders
router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);


// =====================================================
// ADMIN ORDER ROUTES
// =====================================================

// Get all orders
router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

// Update delivery status
router.put(
    "/admin/delivery/:id",
    authMiddleware,
    adminMiddleware,
    updateDeliveryStatus
);

// Update payment status
router.put(
    "/admin/payment/:id",
    authMiddleware,
    adminMiddleware,
    updatePaymentStatus
);

// Update return status
router.put(
    "/admin/return/:id",
    authMiddleware,
    adminMiddleware,
    updateReturnStatus
);


// =====================================================
// USER ORDER ACTIONS
// =====================================================

// Get single order
router.get(
    "/:id",
    authMiddleware,
    getOrder
);

// Cancel order
router.put(
    "/cancel/:id",
    authMiddleware,
    cancelOrder
);

// Request return
router.post(
    "/return/:id",
    authMiddleware,
    requestReturn
);

// =====================================================
// PAYMENT ROUTES
// =====================================================

// Verify successful Razorpay payment
router.post(
    "/payment/verify-payment",
    authMiddleware,
    verifyPayment
);

// Handle failed/cancelled Razorpay payment
router.post(
    "/payment-failed",
    authMiddleware,
    paymentFailed
);


module.exports = router;