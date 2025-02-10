require("dotenv").config();
require("./Config/PassportConfig");
const express = require("express");
const app = express();
const db = require("./Db");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./Routes/Auth");

app.use("/auth", userRoutes);

app.get("/welcome", (req, res) => {
  res.send("Welcome to the server");
});

app.listen(port, () => {
  console.log(`listening on port number : ${port}`);
});
