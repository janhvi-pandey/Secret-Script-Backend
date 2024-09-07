const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const jwt = require('jsonwebtoken');
const userdetails = require("../middleware/userdetails");

const key = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await user.findOne({ email: email });
    if (userExist) {
      return res
        .status(400)
        .json({ alreadyexist: true, message: "Email already exist" });
    }
    const usercreated = await user.create({
      name: name,
      email: email,
      password: password,
    });

    const token = jwt.sign({id: usercreated._id}, key);
    res.json({ user: usercreated, token: token, alreadyexist: false });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userdata = await user.findOne({ email: email });
    
    if (userdata) {
      if (password === userdata.password) {
        const token = jwt.sign({id: userdata._id}, key);
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

router.get("/userprofile", userdetails, async (req, res) => {
  try {
    const userdata = await user.findById(req.user.id);
    if (userdata) {
      return res.json(userdata);
    }
    res.status(400).json({ message: "User not exist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
