const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const userdetails = require("../middleware/userdetails");
const { imageUpload } = require("../services/Cloudinary");
const {upload}= require('../middleware/UploadImage');
const path = require("path");
const fs = require("fs");

// // Middleware for file upload (multer)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "tmp/uploads"); // Folder to store temporarily uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });
// const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Max file size: 5MB

// Route: Edit user profile
router.put(
  "/editprofile",
  userdetails, 
  

  upload.single("photoURL"),
  async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await User.findById(req.user.id);  // Find the user by token
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update name and email if provided
      user.name = name || user.name;
      user.email = email || user.email;

      // Update photoURL if a new photo was uploaded
      if (req.file) {
        // Upload image to Cloudinary
        const localPath =  path.resolve(req.file.path) ;
        const cloudinaryResult = await imageUpload(localPath);
        if (cloudinaryResult) {
          user.photoURL = cloudinaryResult.secure_url; // Save the Cloudinary URL in the database
        } else {
          return res.status(500).json({ message: "Failed to upload image" });
        }

        // Clean up the local file after uploading to Cloudinary
        fs.unlinkSync(localPath);
      }

      // Save updated user data in the database
      await user.save();
      res.json({ success: true, user });  // Return updated user data

    } catch (error) {
      console.error("Error editing profile:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
