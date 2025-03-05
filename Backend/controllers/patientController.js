const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const patientModel = require("../models/patient.model");

module.exports.registerUser = async function (req, res) {
  try {
    let { email, password, name } = req.body;

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
  res.cookie("token", "", { httpOnly: true });
  res.status(200).json({ message: "Logged out successfully" });
};
