const express = require("express");
const router = express.Router();
const { registerUser,loginUser,logout} = require("../controllers/patientController")

router.get("/",function(req,res){
    res.send("Patient Page")
});

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/appointment",function(req,res){
    res.send("Patient Page")
});

router.post("/book",function(req,res){
    res.send("Patient Page")
});

router.post("/logout",logout);

module.exports = router;