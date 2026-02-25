require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
};

module.exports = connectDB;
