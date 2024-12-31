const { v2 } = require("cloudinary");

const cloudinary = v2;
cloudinary.config({

  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const imageUpload = async (image) => {
  try {
    const response = await cloudinary.uploader.upload(image, {
      folder: "images",
      resource_type: "image",
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports={imageUpload};