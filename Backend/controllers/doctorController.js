const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const doctorModel = require("../models/doctor.model");
const reviewModel = require("../models/review.model");
const appointmnetModel = require("../models/appointment.model")


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
    console.error("Error fetching doctors:", error);
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

const getDoctorRaiting = async function(req,res) {
  try {
    const doctorId = req.params; 
    //console.log(doctorId)
    const result = await reviewModel.aggregate([
        { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } }, // Get only reviews for this doctor
        {
            $group: {
                _id: "$doctorId",
                averageRating: { $avg: "$rating" }, // Calculate average rating
                totalReviews: { $sum: 1 } // Count total reviews
            }
        }
    ]);

    //console.log(result)

    if (result.length > 0) {
        res.status(200).json({
            averageRating: result[0].averageRating.toFixed(1), // Round to 1 decimal place
            totalReviews: result[0].totalReviews
        });
    } else {
        res.status(200).json({ averageRating: "0", totalReviews: 0 }); // No reviews yet
    }
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return { averageRating: "0", totalReviews: 0 };
  }
}

const getAllDoctorRatings = async (req, res) => {
  try {
    const ratings = await reviewModel.aggregate([
      {
        $group: {
          _id: "$doctorId",
          averageRating: { $avg: "$rating" }, // Calculate average rating per doctor
          totalReviews: { $sum: 1 } // Count total reviews per doctor
        }
      }
    ]);

    //console.log("Aggregated Ratings:", ratings);

    res.json(ratings);
  } catch (error) {
    console.error("Error fetching doctor ratings:", error);
    res.status(500).json({ message: "Error fetching doctor ratings", error });
  }
};

const getAllAppointment = async function (req,res) {
  try {
    const appointmnets = await appointmnetModel.find();

    res.status(200).json(appointmnets)
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const getMyAppointment = async function (req, res) {
  try {
    const doctorId = req.user?.id; // Get doctorId from token
    //console.log("Doctor ID from JWT:", doctorId);

    const doctorAppointments = await appointmnetModel
      .find({ doctorId: doctorId })  // Query appointments for this doctor
      .populate("patientId doctorId"); // Populate references

    //console.log("Appointments found:", doctorAppointments);

    if (!doctorAppointments || doctorAppointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json(doctorAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllReview = async function(req,res){
  try {
    const allReviews = await reviewModel.find()
    //console.log(allReviews)
    if(allReviews){
      res.status(200).json(allReviews)
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const updateAppointment = async function(req,res){
  try {
    const { id } = req.params;
    const { status, reason, notes } = req.body; // New status from frontend

    // Validate status
    const validStatuses = ["Completed", "Cancelled", "Rescheduled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update the appointment
    const updatedAppointment = await appointmnetModel.findByIdAndUpdate(
      id,
      { status, reason, notes },
      { new: true } // Return updated document
    );

    //console.log(updateAppointment)

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment status updated", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getId = async function(req, res) {
  try {
    const doctorId = req.user?.id;

    //console.log(doctorId)

    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized: Id not found" });
    }

    res.status(200).json( doctorId );
  } catch (error) {  // Catch block now correctly accepts an error parameter
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async function(req,res){
  const { id } = req.params;
  const updateData = req.body; // Update data from the frontend (name, bio, etc.)

  try {
    const updatedDoctor = await doctorModel.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the schema before updating
    });

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ updatedProfile: updatedDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = `${req.file.filename}`;

    const doctor = await doctorModel.findByIdAndUpdate(
      req.params.id,
      { image: imageUrl },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Profile image updated", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};








module.exports = { loginDoctor, getAllDoctors, deleteDoctor, addManyDoctors, getDoctorData,getDoctorRaiting,getAllDoctorRatings,getAllAppointment,getMyAppointment,getAllReview,updateAppointment,getId,updateProfile,uploadImage };