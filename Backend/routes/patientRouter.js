const express = require("express");
const router = express.Router();
const { 
    registerUser,
    loginUser,
    logout,
    updateProfile,
    getAppointments, 
    getProfile,
    bookAppointment,
    cancelAppointment,
    submitReview
} = require("../controllers/patientController")
const {patientMiddleware} = require("../middlewares/patientMiddleware");
const upload = require("../middlewares/multer");

router.get("/",function(req,res){
    res.send("Patient Page")
});

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get('/my-appointment',patientMiddleware,getAppointments)

router.get('/my-profile', patientMiddleware, getProfile);

router.post('/my-profile',patientMiddleware,upload.single('image'), updateProfile);

router.post("/book-appointment",patientMiddleware,bookAppointment);

router.delete("/cancel-appointment/:id",cancelAppointment);

router.post('/submit-review',patientMiddleware,submitReview)



//Checking 

// router.get("/my-profile", async (req, res) => {
//     try {
//         const user = await getProfile(req.user.id); // Example function
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
//         res.json({ success: true, userData: user });
//     } catch (error) {
//         console.error("Error fetching user:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });


// router.get("/my-profile", async (req, res) => {
//     const token = req.headers.authorization;
//     console.log("Received Token:", token);
//     // Fetch user data
// });

router.post("/logout",patientMiddleware,logout);


// routes/patientRouter.js
// router.get('/check-auth', (req, res) => {
//     console.log("Current cookies:", req.cookies);
//     res.json({
//         hasToken: !!req.cookies.token,
//         cookies: req.cookies
//     });
// });

module.exports = router;