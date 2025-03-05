const jwt = require("jsonwebtoken");
const patientModel = require("../models/patient.model")

module.exports = async function (req,res,next) {
    if(!req.cookies.token){    //agar uske pass token(cookie) nhi hai then wo pahle login karen
        req.flash("error","you need to login first");   //you can flash any msg and redirect to any page
        return res.redirect("/");
    }   


    try{
        let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY);   //token se value nikale 
        let user = await patientModel   //yaha pr user ko find kiya toh sara data chiye
            .findOne({email:decoded.email})   //toh sirf email chiye
            .select("-password");  //password nhi chiye esliye minus laga diye hai

            req.user = user;  //user mein upar wale user ka data put kr diye hai

            next(); //aagae usko bhej diya
    }catch(err){
    req.flash("error","something went wrong.");
    res.redirect("/")
    }
};