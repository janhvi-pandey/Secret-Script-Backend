const mongoose = require('mongoose');

const connectmongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    console.log(process.env.MONGO_URI);
    
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectmongo;
