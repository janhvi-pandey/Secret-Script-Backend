const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const userdetails = require("../middleware/userdetails");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const baseURL = "https://secret-script-io.vercel.app"|| "http://localhost:5005";
const key = process.env.SECRET_KEY;

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Middleware for validation error handling
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route: Register a new user
router.post(
  "/register",
  
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if email already exists
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res
          .status(400)
          .json({ alreadyexist: true, message: "Email already exists" });
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const defaultPhotoURL = `${baseURL}/images/default.png`;
      const usercreated = await User.create({
        name,
        email,
        password: hashedPassword,
        photoURL:defaultPhotoURL
      });

      const token = jwt.sign({ id: usercreated._id }, key, { expiresIn: "1d" });
      console.log(token)
      res.json({ user: usercreated, token, alreadyexist: false });
    } catch (error) {
      console.error("Error during registration:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route: Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userdata = await User.findOne({ email });
    if (!userdata) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, userdata.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (!userdata.photoURL) {
      userdata.photoURL = `${baseURL}/images/default.png`;  
    }
    // console.log(userdata);
    const token = jwt.sign({ id: userdata._id }, key, { expiresIn: "1d" });
  
    res.json({ user: userdata, token });
    
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route: Google Login
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, photoURL } = req.body;

    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      existingUser = await User.create({
        name,
        email,
        photoURL,
      });
    }
    // } else {
    //   // existingUser.photoURL = photoURL;
    //   await existingUser.save();
    // }

    const token = jwt.sign({ id: existingUser._id }, key, { expiresIn: "1d" });
    res.json({ success: true, token, user: existingUser });
  } catch (error) {
    console.error("Error during Google Login:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route: Get user profile
router.get("/userprofile", userdetails, async (req, res) => {
  try {
    const userdata = await User.findById(req.user.id);
    if (!userdata) {
      return res.status(404).json({ message: "User does not exist" });
    }
    res.json(userdata);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Route: Edit user profile
router.put(
  "/edit-profile",
  userdetails,  // Middleware to validate user token
  async (req, res) => {
    try {
      const { name, email, photoURL } = req.body;
console.log(req.body)
      const user = await User.findById(req.user.id);
      // console.log(user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (email && !isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Update user details
      user.name = name || user.name;
      user.email = email || user.email;
      if (photoURL) {
        user.photoURL = photoURL;  // Save the Cloudinary URL
      }

      await user.save();
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error editing profile:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route: Change password
router.post(
  "/changepassword",
  userdetails,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

    

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
