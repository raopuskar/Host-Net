const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const patientModel = require("../models/patient.model");
const appointmentModel = require("../models/appointment.model");
const reviewSchema = require("../models/review.model")

module.exports.registerUser = async function (req, res) {
  try {
    let { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    let user = await patientModel.findOne({ email });
    if (user)
      return res.status(401).json({ message: "You already have an account, please login" });

    // Hash password
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    let newUser = await patientModel.create({
      email,
      password: hash,
      name,
    });

    let token = generateToken(newUser);
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;

    let user = await patientModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email or password incorrect" });

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Email or password incorrect" });

    let token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports.logout = function (req, res) {
  try {
    // Make sure these options match how you originally set the cookie
    res.clearCookie("token", { 
      path: "/", 
      httpOnly: true, // Add this if your cookie is httpOnly
      secure: process.env.NODE_ENV === "production", // Add this if your cookie is secure
      sameSite: "strict" // Add appropriate SameSite policy
    });

    //Clear session cookie
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    
    console.log("Logout successful");

    return res.status(200).json({ message: "Logout successful" });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports.updateProfile = async function (req, res) {
  try {
    const { name, email, phoneNumber, password, address } = req.body;
    const image = req.file;
    const userId = req.user ? req.user.id : null;

    
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Find user
    const user = await patientModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    
    // if (image) {
    //   console.log("File uploaded to:", image.path); // Full file path
    //   console.log("Storing image path as:", user.image); // Path being stored in DB
    // }


    // Email check
    if (email && email !== user.email) {
      const existingUser = await patientModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use by another account" });
      }
      user.email = email;
    }
    
    // Password handling
    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    // Image handling - store only the path that browsers can access
    if (image) {
      // Store only the relative path for web access
      user.image = `images/uploads/${image.filename}`;
      
      // Log the full path for debugging
      //console.log("File uploaded to:", image.path);
      //console.log("Storing image path as:", user.image);
    }
    
    // Update other fields
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    
    // Save updated user
    await user.save();
    
    // Construct the full image URL to return to the client
    const imageUrl = user.image ? `${req.protocol}://${req.get('host')}/${user.image}` : null;

    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        image: imageUrl, // Return the full URL
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

module.exports.getProfile = async function (req, res) {
  try {
    const userId = req.user.id;
    const user = await patientModel.findById(userId).select("-password");
    //console.log("Fetching profile for user:", req.user); 

    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    // Create a user object with the full image URL
    // const userWithFullImageUrl = {
    //   ...user.toObject(),
    //   image: user.image ? `${req.protocol}://${req.get('host')}/${user.image}` : null
    // };
    

    return res.status(200).json({ 
      message: "Profile retrieved successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Error Getting profile",
      error: error.message,
    });
  } 
};


module.exports.getAppointments = async function(req, res) {
try {
  //console.log("Getting appointments for user:", req.user._id);
        
  const patientId = req.user._id; // Extract from token
  const appointments = await appointmentModel.find({ patientId }).populate("doctorId");

  if (!appointments.length) {
    return res.status(404).json({ message: "No appointments found" });
  }

  // res.send(200).json(appointments);

  
  res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};



module.exports.bookAppointment = async function (req, res) {
  try {
    const { doctorId, appointmentDate, timeslot } = req.body;
    const userId = req.user.id;

    // Check if user exists
    const user = await patientModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and save the appointment
    const newAppointment = await appointmentModel.create({
      patientId: userId,
      doctorId: doctorId,
      appointmentDate: appointmentDate,
      timeslot: timeslot,
      status: "pending",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error booking appointment",
      error: error.message,
    });
  }
};


module.exports.cancelAppointment = async function (req, res) {
  try {
    const appointmentId = req.params.id; // Get appointment ID from request params

    const updatedAppointment = await appointmentModel.findOneAndUpdate(
      { _id: appointmentId },
      { status: "cancelled" }, 
      { new: true } // Returns the updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment canceled successfully", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports.submitReview = async function(req, res) {
  try {
    const patientId = req.user.id; //id from middleware
    const { review, rating, doctorId, appointmentId } = req.body;
    
    // check if the appointment exists
    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      patientId: patientId,
      doctorId: doctorId
    });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // console.log(patientId)
    // console.log(review)
    // console.log(rating)
    // console.log(doctorId)
    // console.log(appointmentId)
    
    // Create new review
    const newReview = await reviewSchema.create({
      patientId: patientId,
      doctorId: doctorId,
      appointmentId: appointmentId,
      review: review,
      rating: rating
    });
    
    // Return success response
    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: newReview
    });
    
  } catch (error) {
    console.error("Submit review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message
    });
  }
};

module.exports.myReviews = async function (req, res) {
  try {
    const patientId = req.user.id; // ✅ Get patientId from middleware

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const reviews = await reviewSchema.find({ patientId }).populate("doctorId");
    //console.log("Fetched Reviews:", reviews);

    if (!reviews || reviews.length === 0) {
      console.log("No reviews found");
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json(reviews); //  Send response to frontend

  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports.completAppointment = async function(req,res){
  try {
    const appointmentId = req.params.id;

    // Find and update the appointment status
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "Completed" },
      { new: true }
    );
    //console.log(appointment)
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment marked as completed", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.getAllPatients = async function(req,res) {
  try {
    const allPatients = await patientModel.find();
    //console.log(allPatients)
    res.status(200).json(allPatients)  
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "error all patient fetching" });
  }

  
}