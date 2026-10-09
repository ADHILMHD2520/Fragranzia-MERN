const express = require("express");

const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
} = require("../controllers/AddressController");

const authMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAddresses);
router.post("/", authMiddleware, addAddress);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);
router.patch("/:id/primary", authMiddleware, setPrimaryAddress);

module.exports = router;
