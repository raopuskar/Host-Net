const jwt = require("jsonwebtoken");
const patientModel = require("../models/patient.model");

module.exports.patientMiddleware = async function (req, res, next) {
  try {
    //console.log("Cookies received: ", req.cookies.token);
    const token = req.cookies.token; //token ko cookies se nikal liya

    if (!token) {
      console.log("No token found in cookies"); //agar uske pass token(cookie) nhi hai then wo pahle login karen
      req.flash("error", "you need to login first"); //you can flash any msg and redirect to any page
      return res.redirect("/");
    }

    //console.log("Token found in cookies", req.cookies.token); //agar token mil gaya toh usko decode karen


    const decoded = jwt.verify(token, process.env.JWT_KEY); //token se value nikale

    const user = await patientModel //yaha pr user ko find kiya toh sara data chiye
      .findOne({ email: decoded.email }) //toh sirf email chiye
      .select("-password"); //password nhi chiye esliye minus laga diye hai


    // Check if user exists
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    //console.log("User found in database:", user);

    req.user = user; //user mein upar wale user ka data put kr diye hai

    next(); //aagae usko bhej diya
    
  } catch (err) {
    console.error("Middleware error:", err);
    req.flash("error", "Session expired. Please login again");
    return res.redirect("/");
  }
};
