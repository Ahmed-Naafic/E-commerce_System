const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateToken = require("../../../common/utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User has been created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // check if account locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message:
          "You attempted more than three times. Please try again after 5 minutes.",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    // invalid password
    if (!isMatch) {
      user.loginAttempts += 1;

      // lock account after 3 failed attempts
      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 5 * 60 * 1000;
      }

      await user.save();

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // reset login attempts after successful login
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    // generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const adminDashboard = async (req, res) => {
  res.status(200).json({
    message: "Welcome Admin",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  adminDashboard,
};