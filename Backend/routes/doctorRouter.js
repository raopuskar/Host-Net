const express = require("express");
const router = express.Router();
const doctorController = require('../controllers/doctorController')



router.get("/",function(req,res){
    res.send("Doctor Page")
});

router.post("/login",doctorController.loginDoctor);

router.get("/all",doctorController.getAllDoctors);

router.delete("/delect/:_id",doctorController.deleteDoctor);

router.get("/get-profile/:id",doctorController.getDoctorData);

//for bulk upload
//router.post('/addMany',doctorController.addManyDoctors);


router.get("/patients",function(req,res){
    res.send("Patient Page")
});

router.post("/update-availability",function(req,res){
    res.send("Patient Page")
});

module.exports = router;