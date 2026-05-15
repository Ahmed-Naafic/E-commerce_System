const express = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");
const {registerUser,loginUser, getMe} = require ("../controllers/authController");
const router =express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me",authMiddleware,getMe)

module.exports = router ; 