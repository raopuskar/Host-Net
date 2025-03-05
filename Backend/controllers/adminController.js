const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin.model");
const doctorModel = require("../models/doctor.model");


//add doctors
const addDoctor = async(req,res)=> {
    try { 
        const { name, email, password, specialty, location, experience, about, fees, date } = req.body;
        
        if (!name || !email || !password || !specialty || !location || !experience || !about || !fees || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingDoctor = await doctorModel.findOne({ email });
        
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new doctorModel(
            {   name, 
                email, 
                password: hashedPassword, 
                specialty, 
                location, 
                experience, 
                about, 
                fees, 
                image : req.file.filename, 
                date });

        await newDoctor.save();

        res.status(201).json({ 
            message: "Doctor registered successfully",
            doctor: {
                name,
                email,
                specialty,
                location,
                experience,
                about,
                fees,
                image: req.file.filename,
                date
            }
        });


    }catch (error) {
        console.error("Error during doctor registration:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Check if JWT_SECRET_KEY is defined
        if (!process.env.JWT_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined in environment variables');
        }


        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: "admin" }, 
            process.env.JWT_KEY, 
            // {
            // expiresIn: "5h",  //For example, expires in 5 hours
            // }
        );
        res.status(200).json({ message: "Login successful", token });


    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin Register
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new adminModel({ name, email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully." });
    } catch (error) {
        console.error("Error during admin registration:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Export functions
module.exports = { loginAdmin, registerAdmin, addDoctor };
