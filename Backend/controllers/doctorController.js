const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctor.model");

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credientials." });
    }

    if (!process.env.JWT_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_KEY
      // {
      // expiresIn: "5h",  //For example, expires in 5 hours
      // }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during doctor login:", error);
        res.status(500).json({ message: "Server error", error: error.message });

  }
};

module.exports = { loginDoctor }