const express = require("express");
const router = express.Router();
const doctorController = require('../controllers/doctorController')



router.get("/",function(req,res){
    res.send("Doctor Page")
});

router.post("/login",doctorController.loginDoctor);

router.get("/patients",function(req,res){
    res.send("Patient Page")
});

router.post("/update-availability",function(req,res){
    res.send("Patient Page")
});

module.exports = router;