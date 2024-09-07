const mongoose = require("mongoose");
require("dotenv").config();

const mongouri = process.env.MONGO_URI;


const connectmongo = async () => {
  try {
    await mongoose.connect(mongouri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectmongo;
