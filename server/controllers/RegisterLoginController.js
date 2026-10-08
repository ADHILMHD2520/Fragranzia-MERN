const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      confirmPassword
    } = req.body;


    // =================================================
    // VALIDATE REQUIRED FIELDS
    // =================================================

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }


    // =================================================
    // NORMALIZE EMAIL
    // =================================================

    const normalizedEmail =
      email.trim().toLowerCase();


    // =================================================
    // CHECK PASSWORDS
    // =================================================

    if (password !== confirmPassword) {

      return res.status(400).json({
        message: "Passwords do not match"
      });

    }


    // =================================================
    // CHECK EXISTING USER
    // =================================================

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
        isActive: true
      });


    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }


    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // =================================================
    // CREATE USER
    // =================================================

    const user = await User.create({

      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword

    });


    // =================================================
    // REMOVE PASSWORD FROM RESPONSE
    // =================================================

    const userResponse =
      user.toObject();

    delete userResponse.password;


    // =================================================
    // SEND RESPONSE
    // =================================================

    res.status(201).json({

      message: "User created successfully",

      user: userResponse

    });


  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    res.status(500).json({

      message: "Error creating user",

      error: error.message

    });

  }

};


// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    // =================================================
    // VALIDATE FIELDS
    // =================================================

    if (!email || !password) {

      return res.status(400).json({

        message:
          "Email and password are required"

      });

    }


    // =================================================
    // NORMALIZE EMAIL
    // =================================================

    const normalizedEmail =
      email.trim().toLowerCase();


    // =================================================
    // FIND USER
    // =================================================

    const user =
      await User.findOne({
        email: normalizedEmail,
        isActive: true
      });


    if (!user) {

      return res.status(404).json({

        message: "User not found"

      });

    }


    // =================================================
    // CHECK ACCOUNT STATUS
    // =================================================

    if (!user.status || !user.isActive) {

      return res.status(403).json({

        message: "Your account is inactive"

      });

    }


    // =================================================
    // CHECK PASSWORD
    // =================================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(400).json({

        message: "Incorrect password"

      });

    }


    // =================================================
    // CREATE JWT
    // =================================================

    const token = jwt.sign(

      {
        id: user._id,
        email: user.email,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d"
      }

    );


    // =================================================
    // REMOVE PASSWORD FROM RESPONSE
    // =================================================

    const userResponse =
      user.toObject();

    delete userResponse.password;


    // =================================================
    // LOGIN SUCCESSFUL
    // =================================================

    res.status(200).json({

      message: "Login successful",

      user: userResponse,

      token

    });


  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({

      message: "Login error",

      error: error.message

    });

  }

};


// =====================================================
// GET CURRENT LOGGED-IN USER
// =====================================================

const getCurrentUser = async (req, res) => {

  try {

    // =================================================
    // GET USER ID FROM JWT
    // =================================================

    const userId = req.user.id;


    // =================================================
    // FIND USER
    // =================================================

    const user = await User
      .findById(userId)
      .select("-password");


    // =================================================
    // CHECK USER
    // =================================================

    if (!user) {

      return res.status(404).json({

        message: "User not found"

      });

    }


    // =================================================
    // SEND USER
    // =================================================

    res.status(200).json({

      message:
        "User profile fetched successfully",

      user

    });


  } catch (error) {

    console.error(
      "Get current user error:",
      error
    );

    res.status(500).json({

      message:
        "Error fetching user profile",

      error: error.message

    });

  }

};


// =====================================================
// UPDATE CURRENT LOGGED-IN USER
// =====================================================

const updateCurrentUser = async (req, res) => {

  try {

    // =================================================
    // GET USER ID FROM JWT
    // =================================================

    const userId = req.user.id;


    // =================================================
    // GET DATA
    // =================================================

    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender
    } = req.body;


    // =================================================
    // VALIDATE NAME
    // =================================================

    if (!name || name.trim() === "") {

      return res.status(400).json({

        message: "Name is required"

      });

    }


    // =================================================
    // VALIDATE EMAIL
    // =================================================

    if (!email || email.trim() === "") {

      return res.status(400).json({

        message: "Email is required"

      });

    }


    // =================================================
    // NORMALIZE EMAIL
    // =================================================

    const normalizedEmail =
      email.trim().toLowerCase();


    // =================================================
    // CHECK EMAIL
    // =================================================

    const existingUser =
      await User.findOne({

        email: normalizedEmail,


        _id: {
          $ne: userId
        }

      });


    if (existingUser) {

      return res.status(400).json({

        message:
          "This email is already being used by another user"

      });

    }


    // =================================================
    // CREATE UPDATE OBJECT
    // =================================================

    const updateData = {

      name: name.trim(),

      email: normalizedEmail

    };


    // =================================================
    // PHONE
    // =================================================

    if (
      phone &&
      phone.trim() !== ""
    ) {

      updateData.phone =
        phone.trim();

    } else {

      updateData.$unset = {

        ...(updateData.$unset || {}),

        phone: ""

      };

    }


    // =================================================
    // DATE OF BIRTH
    // =================================================

    if (dateOfBirth) {

      updateData.dateOfBirth =
        dateOfBirth;

    } else {

      updateData.$unset = {

        ...(updateData.$unset || {}),

        dateOfBirth: ""

      };

    }


    // =================================================
    // GENDER
    // =================================================

    if (gender) {

      updateData.gender =
        gender;

    } else {

      updateData.$unset = {

        ...(updateData.$unset || {}),

        gender: ""

      };

    }


    // =================================================
    // UPDATE DATABASE
    // =================================================

    const updatedUser = await User
      .findByIdAndUpdate(

        userId,

        updateData,

        {
          new: true,
          runValidators: true
        }

      )
      .select("-password");


    // =================================================
    // CHECK USER
    // =================================================

    if (!updatedUser) {

      return res.status(404).json({

        message: "User not found"

      });

    }


    // =================================================
    // SEND RESPONSE
    // =================================================

    res.status(200).json({

      message:
        "Profile updated successfully",

      user: updatedUser

    });


  } catch (error) {

    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({

      message:
        "Error updating user profile",

      error: error.message

    });

  }

};

// =====================================================
// ADMIN - GET ALL CUSTOMERS
// Excludes admin users
// =====================================================

const getAllCustomers = async (req, res) => {

  try {

    const customers = await User
      .find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Customers fetched successfully",
      customers
    });

  } catch (error) {

    console.error(
      "Get all customers error:",
      error
    );

    res.status(500).json({
      message: "Error fetching customers",
      error: error.message
    });

  }

};

// =====================================================
// ADMIN - TOGGLE CUSTOMER ACTIVE STATUS
// =====================================================

const toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findById(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    customer.isActive = !customer.isActive;

    await customer.save();

    res.status(200).json({
      message: customer.isActive
        ? "Customer unblocked successfully"
        : "Customer blocked successfully",

      customer
    });

  } catch (error) {
    console.error(
      "Toggle customer status error:",
      error
    );

    res.status(500).json({
      message: "Error updating customer status",
      error: error.message
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  registerUser,

  loginUser,

  getCurrentUser,

  updateCurrentUser,

  getAllCustomers,

  toggleCustomerStatus

};