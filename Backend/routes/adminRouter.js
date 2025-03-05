const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminMiddleware");  // Middleware for admin authentication
const upload = require("../middlewares/multer");

router.get("/", (req, res) => {
    res.send("Doctor Page - Protected Route");
});

// Admin Registration 
router.post("/register", adminController.registerAdmin);

// Admin Login 
router.post("/login", adminController.loginAdmin);

//All doctor list
router.get('/admin',)

//Add Doctor
router.post("/add-doctor",adminAuth,upload.single('image'), adminController.addDoctor);  

// Protected Routes (Example Usage of Middleware)
router.get("/doctor", adminAuth, (req, res) => {
    res.send("Doctor Page - Protected Route");
});

router.get("/appointment", adminAuth, (req, res) => {
    res.send("Appointment Page - Protected Route");
});


module.exports = router;
