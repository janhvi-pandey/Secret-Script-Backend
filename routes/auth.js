const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const userdetails = require("../middleware/userdetails");
const admin = require("firebase-admin");

const key = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(400)
        .json({ alreadyexist: true, message: "Email already exist" });
    }
    const usercreated = await User.create({
      name: name,
      email: email,
      password: password,
    });

    const token = jwt.sign({ id: usercreated._id }, key);
    res.json({ user: usercreated, token: token, alreadyexist: false });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userdata = await User.findOne({ email: email });

    if (userdata) {
      if (password === userdata.password) {
        const token = jwt.sign({ id: userdata._id }, key);
        return res.json({ user: userdata, alreadyexist: true, token: token });
      } else {
        return res.status(400).json({ alreadyexist: true, user: null });
      }
    }
    res
      .status(400)
      .json({ alreadyexist: false, meessage: "User does not exist" });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/google-login", async (req, res) => {
  try {
    // Extract user details from the frontend payload
    const { email, name, photoURL } = req.body;
    // console.log(req.body);
    // Check if user already exists in the database
    let existingUser = await User.findOne({ email });

    // If user does not exist, create a new one
    if (!existingUser) {
      existingUser = await User.create({
        name: name,
        email: email, // Optional: save the user's profile picture
      });
    }

    // Generate a JWT for the user
    const token = jwt.sign({ id: existingUser._id }, key, { expiresIn: "1d" });

    // Send success response with token and user data
    res.json({
      success: true,
      token: token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("Error during Google Login:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/userprofile", userdetails, async (req, res) => {
  try {
    const userdata = await User.findById(req.user.id);

    if (userdata) {
      return res.json(userdata);
    }
    res.status(400).json({ message: "User not exist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
