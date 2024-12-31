const express = require("express");
const router = express.Router();
const {upload}= require('../middleware/UploadImage');
const {imageUpload } = require("../services/Cloudinary");
const fs = require("fs");
const path = require("path");

router.post("/upload", upload.single("image"),async(req, res)=>{
    try {
        const localPath = req.file ? path.resolve(req.file.path) : null;
        const result=await imageUpload(localPath);
        fs.unlinkSync(localPath);
        res.json(result);

        
    } catch (error) {
        console.log(error);

        
    }
})
module.exports = router;