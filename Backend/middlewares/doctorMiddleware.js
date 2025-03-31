const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctor.model");

const doctorAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).send("Access denied. No token provided.");
        }

        // Remove 'Bearer ' from token string
        const tokenString = token.replace('Bearer ', '');

        // Log the processed token
        //console.log("Processing token:", tokenString);

        // Verify token
        const decoded = jwt.verify(tokenString, process.env.JWT_KEY);

        // Log the decoded token
        //console.log("Decoded token:", decoded);
        
        req.user = decoded;

        // Check if the user is an admin
        const doctor = await doctorModel.findById(req.user.id);
        if (!doctor) {
            return res.status(403).send("Access denied. Admins only.");
        }
        //console.log("Doctor authenticated:", doctor._id);
        

        next();  // Allow request to continue

    } catch (err) {
        res.status(400).send("Invalid token.");
    }
};

module.exports = doctorAuth;
