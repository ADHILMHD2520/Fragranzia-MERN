const { Address } = require("../models/Address");

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id })
      .sort({ isPrimary: -1, createdAt: -1 });

    res.status(200).json({
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      city,
      state,
      landmark,
      pincode,
      alternativePhone,
    } = req.body;

    const addressCount = await Address.countDocuments({
      user: req.user.id,
    });

    const newAddress = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      address,
      city,
      state,
      landmark,
      pincode,
      alternativePhone: alternativePhone || "",
      isPrimary: addressCount === 0,
    });

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to add address",
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        $set: {
          fullName: req.body.fullName,
          phone: req.body.phone,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          landmark: req.body.landmark,
          pincode: req.body.pincode,
          alternativePhone: req.body.alternativePhone || "",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to update address",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const wasPrimary = address.isPrimary;
    await Address.deleteOne({ _id: address._id });

    if (wasPrimary) {
      const nextAddress = await Address.findOne({
        user: req.user.id,
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isPrimary = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting address",
      error: error.message,
    });
  }
};

const setPrimaryAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await Address.updateMany(
      { user: req.user.id },
      { $set: { isPrimary: false } }
    );

    address.isPrimary = true;
    await address.save();

    const addresses = await Address.find({
      user: req.user.id,
    }).sort({ isPrimary: -1, createdAt: -1 });

    res.status(200).json({
      message: "Primary address updated successfully",
      address,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error setting primary address",
      error: error.message,
    });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
};
