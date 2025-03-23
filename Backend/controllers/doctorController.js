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

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    //console.log("doctors:", doctors); // Debugging
    res.status(200).json(doctors);
  } catch (error) {
    //console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await doctorModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor deleted successfully", doctor });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
} 

const addManyDoctors = async (req, res) => {
  try {
    console.log("Received doctors data:", req.body);

    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Invalid input: Expected an array of doctors" });
    }

    // Loop through each doctor and insert or update
    const bulkOps = req.body.map(doc => ({
      updateOne: {
        filter: { email: doc.email }, // Find doctor by email
        update: { $set: doc }, // Update if exists, insert if not
        upsert: true, // Create a new document if email doesn't exist
      }
    }));

    const result = await doctorModel.bulkWrite(bulkOps);
    console.log("Doctors added/updated successfully:", result);
    res.status(201).json({ message: "Doctors added/updated successfully", result });
  } catch (error) {
    console.error("🔥 Error adding/updating doctors:", error);
    res.status(500).json({ error: "Failed to add/update doctors", details: error.message });
  }
};

const getDoctorData = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    //console.log("Doctor ID received:", id); 

    const doctor = await doctorModel.findOne({ _id: id }); 
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




module.exports = { loginDoctor, getAllDoctors, deleteDoctor, addManyDoctors, getDoctorData };