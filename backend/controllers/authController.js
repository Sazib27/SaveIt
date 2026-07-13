const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields required"
      });

    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const user = await User.create({

      name,

      email,

      password: hashedPassword,

      verificationToken

    });

    const token =
      generateToken(user._id);

    res.status(201).json({

      success: true,

      message: "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium
      }

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });

    }

    user.lastLogin = new Date();

    await user.save();

    const token =
      generateToken(user._id);

    res.json({

      success: true,

      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin
      }

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.getProfile = async (req, res) => {

  try {

    const user =
      await User.findById(req.user._id)
        .select("-password");

    res.json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.updateProfile = async (req, res) => {

  try {

    const user =
      await User.findById(req.user._id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    user.name =
      req.body.name || user.name;

    user.bio =
      req.body.bio || user.bio;

    user.avatar =
      req.body.avatar || user.avatar;

    await user.save();

    res.json({

      success: true,

      message: "Profile updated",

      user

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword
    } = req.body;

    const user =
      await User.findById(req.user._id);

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Current password incorrect"
      });

    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    res.json({

      success: true,

      message:
        "Password reset token generated",

      resetToken

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.resetPassword = async (req, res) => {

  try {

    const {
      token,
      password
    } = req.body;

    const user =
      await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: {
          $gt: Date.now()
        }
      });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({

      success: true,

      message: "Password reset successful"

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.logout = async (req, res) => {

  res.json({
    success: true,
    message: "Logout successful"
  });

};