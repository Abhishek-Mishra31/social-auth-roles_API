require("dotenv").config();
const mongoose = require("mongoose");
const dbServerUrl = process.env.MONGODB_URI;
const db = mongoose.connection;

mongoose.connect(dbServerUrl);

db.on("connected", () => {
  console.log("connected to database");
});

db.on("disconnected", () => {
  console.log("disconnected with database");
});

db.on("error", () => {
  console.log("error with database");
});

module.exports = db;
