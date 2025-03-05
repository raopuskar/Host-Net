const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin.model");

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).send("Access denied. No token provided.");
        }

        // Remove 'Bearer ' from token string
        const tokenString = token.replace('Bearer ', '');

        // Log the processed token
        console.log("Processing token:", tokenString);

        // Verify token
        const decoded = jwt.verify(tokenString, process.env.JWT_KEY);

        // Log the decoded token
        console.log("Decoded token:", decoded);
        
        req.user = decoded;

        // Check if the user is an admin
        const admin = await adminModel.findById(req.user.id);
        if (!admin) {
            return res.status(403).send("Access denied. Admins only.");
        }

        next();  // Allow request to continue

    } catch (err) {
        res.status(400).send("Invalid token.");
    }
};

module.exports = adminAuth;
