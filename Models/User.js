const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
  },

  confirmPassword: {
    type: String,
  },

  role: {
    type: [String],
    enum: ["Service Provider", "Service Consumer", "Trainee", "Trainer"],
    default: [],
  },

  provider: {
    type: String,
    enum: ["google", "linkedin", "email"],
  },

  socialId: {
    type: String,
    unique: true,
  },
});

userSchema.methods.comparePassword = async function (userPassword) {
  try {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
