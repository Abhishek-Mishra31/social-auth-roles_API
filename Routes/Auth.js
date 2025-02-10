require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const nodemailer = require("nodemailer");
const passport = require("passport");
const { verifyToken } = require("../Utils/VerifyTokens");
const { generateToken } = require("../Middleware/JwtAuthentication");

const verficationEmail = async (req, res, userData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL}`,
      to: userData.email,
      subject: "Confirm Your Account",
      html: `
                <h3>Confirm Your Account</h3>
                <p>Hi ${userData.email},</p>
                <p>Thank you for registering on our website.</p>
                <p>Please click on the link below to verify your email address.</p>
                <p>Click <a href="https://yourdomain.com/verify-email?token="token">here</a> 
                to verify your email address and complete your registration.</p>
              `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "thank you! check your email for verfication.",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// this endpoint helps to register a user with email and password
router.post("/register", async (req, res) => {
  try {
    let success = false;
    let userData = new User(req.body);
    const existingUser = await User.findOne({ email: userData.email });
    if (
      !userData.email ||
      !userData.password ||
      !userData.confirmPassword ||
      !userData.role
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (userData.password !== userData.confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and Confirm Password should be same" });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists , try to login" });
    }

    let response = await userData.save();
    success = true;
    res.status(200).json({ msg: "User registered successfully" });
    await verficationEmail(req, res, userData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// this endpoint helps to register and login a user with google account
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// this endpoint helps to register and login a user with LinkedIn account
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    let { user, isNewUser } = req.user;
    if (isNewUser) {
      const response = new User(user);
      response.save();
      await verficationEmail(req, res, user);
    } else {
      const payload = {
        id: user.id,
      };
      const token = await generateToken(payload);
      res.status(200).json({ message: "Login successful", token });
    }
  }
);

// this endpoint helps to register and login a user with LinkedIn account
router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { session: true }),
  async (req, res) => {
    try {
      let { userData, isNewUser } = req.user;

      if (isNewUser) {
        const response = new User(userData);
        response.save();
        await verficationEmail(req, res, userData);
      } else {
        const payload = {
          id: userData.id,
        };
        const token = await generateToken(payload);
        res.status(200).json({ message: "Login successful", token });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

// this endpoint helps to login a user with email and password
router.post("/login", async (req, res) => {
  try {
    let userData = req.body;
    let success = false;
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "No account found with this email. Please register!" });
    }

    if (user) {
      const matchPassword = await user.comparePassword(userData.password);
      if (!matchPassword) {
        return res.status(400).json({ error: "Invalid Password" });
      }
    }

    const payload = {
      id: user.id,
    };

    const token = await generateToken(payload);
    success = true;
    res
      .status(200)
      .json({ msg: "Login successful", success: success, token: token });
  } catch (error) {
    res.status(500).json(error);
  }
});

// this endpoint helps to get all the roles available
router.get("/roles", async (req, res) => {
  try {
    const roles = await User.schema.path("role").caster.enumValues;
    res.status(200).json({ roles });
  } catch (error) {
    res.status(500).json(error);
  }
});

// this endpoint helps to assign a role to a user
router.post("/roles/assign", async (req, res) => {
  try {
    const { userId, roles } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    user.role = [...new Set([...user.role, ...roles])];
    await user.save();
    res.status(200).json({ msg: "Role assigned successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// this endpoint helps to login user with google account
router.post("/social-login", async (req, res) => {
  try {
    const { social_platform, auth_token } = req.body;

    if (!social_platform || !auth_token) {
      return res
        .status(400)
        .json({ error: "Missing details for social login!" });
    }

    let userData = await verifyToken(social_platform, auth_token);

    if (!userData) {
      return res.status(400).json({ error: "Invalid Token" });
    }

    const user = await User.findOneAndUpdate(
      { email: userData.email },
      {
        email: userData.email,
        name: userData.name,
        provider: social_platform,
        socialId: userData.id,
      },
      { new: true, upsert: true }
    );

    const payload = {
      id: user.id,
    };

    const token = await generateToken(payload);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error);
  }
});

module.exports = router;
