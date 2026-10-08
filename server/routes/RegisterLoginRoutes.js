const express = require("express");

const {
    registerUser,
    loginUser,
    getCurrentUser,
    updateCurrentUser,
    getAllCustomers,
    toggleCustomerStatus
} = require("../controllers/RegisterLoginController");

const authMiddleware =
    require("../middleware/AuthMiddleware");

const adminMiddleware =
    require("../middleware/AdminMiddleware");


const router = express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post(
    "/register",
    registerUser
);


// =====================================================
// LOGIN
// =====================================================

router.post(
    "/login",
    loginUser
);


// =====================================================
// GET CURRENT USER
// =====================================================

// GET /api/profile

router.get(
    "/profile",
    authMiddleware,
    getCurrentUser
);


// =====================================================
// UPDATE CURRENT USER
// =====================================================

// PUT /api/profile

router.put(
    "/profile",
    authMiddleware,
    updateCurrentUser
);


// =====================================================
// ADMIN - GET ALL CUSTOMERS
// =====================================================

// GET /api/admin/customers

router.get(
    "/admin/customers",
    authMiddleware,
    adminMiddleware,
    getAllCustomers
);

router.put(
  "/admin/customers/:id/status",
  toggleCustomerStatus
);



module.exports = router;