const mongoose = require("mongoose");
const config = require('config');

const debug = require("debug")("development:mongoose");

const MONGODB_URI =
    config.get("MONGODB_URI") || "mongodb://localhost:27017";

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(`${MONGODB_URI}/appointment-web`, {
        });
        debug("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = connectDB;