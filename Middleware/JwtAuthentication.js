require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = async (userData) => {
  return jwt.sign(userData, process.env.SECRET_KEY , { expiresIn: "1h" });
};

module.exports = { generateToken };