const express = require("express");
const router = express.Router();
const doctorController = require('../controllers/doctorController')
const doctorAuth = require("../middlewares/doctorMiddleware");

router.get("/",function(req,res){
    res.send("Doctor Page")
});

router.post("/login",doctorController.loginDoctor);

router.get("/all",doctorController.getAllDoctors);

router.delete("/delect/:_id",doctorController.deleteDoctor);

router.get("/get-profile/:id",doctorController.getDoctorData);

router.get("/get-rating/:id",doctorController.getDoctorRaiting)

router.get("/get-all-ratings", doctorController.getAllDoctorRatings);

router.get("/get-all-appointmnet",doctorController.getAllAppointment)

router.get("/get-my-appointment",doctorAuth,doctorController.getMyAppointment)

router.get("/get-all-reviews",doctorController.getAllReview)

router.patch("/update-appointment-status/:id",doctorAuth,doctorController.updateAppointment)

router.get('/get-id',doctorAuth,doctorController.getId);


//for bulk upload
//router.post('/addMany',doctorController.addManyDoctors);



module.exports = router;