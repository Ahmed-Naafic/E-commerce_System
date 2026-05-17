const bcrypt = require("bcrypt");
const User = require("../models/user");
const LoginAudit = require("../../audit/models/LoginAudit");
const generateToken = require("../../../common/utils/generateToken");

const getRequestIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  req.ip ||
  "";

const auditLogin = async ({
  req,
  user = null,
  email = "",
  status,
  reason = "",
}) => {
  try {
    await LoginAudit.create({
      user: user?._id || null,
      email,
      status,
      reason,
      ipAddress: getRequestIp(req),
      userAgent: req.headers["user-agent"] || "",
    });
  } catch (error) {
    console.error("Login audit failed:", error.message);
  }
};

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
    const normalizedEmail = email?.trim().toLowerCase() || "";

    // validation
    if (!email || !password) {
      await auditLogin({
        req,
        email: normalizedEmail || "unknown",
        status: "failed",
        reason: "missing_fields",
      });

      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      await auditLogin({
        req,
        email: normalizedEmail,
        status: "failed",
        reason: "user_not_found",
      });

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // check if account locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      await auditLogin({
        req,
        user,
        email: normalizedEmail,
        status: "locked",
        reason: "account_locked",
      });

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
      let reason = "invalid_password";

      // lock account after 3 failed attempts
      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 3 * 60 * 1000;
        reason = "account_locked_after_failed_attempts";
      }

      await user.save();

      await auditLogin({
        req,
        user,
        email: normalizedEmail,
        status: "failed",
        reason,
      });

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // reset login attempts after successful login
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    await auditLogin({
      req,
      user,
      email: normalizedEmail,
      status: "success",
      reason: "login_success",
    });

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
