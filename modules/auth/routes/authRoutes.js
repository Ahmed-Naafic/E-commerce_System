const express = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");
const {registerUser,loginUser, getMe, adminDashboard} = require ("../controllers/authController");
const roleMiddleware = require("../../../middlewares/roleMiddleware");
const router =express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me",authMiddleware,getMe)
router.get( "/admin",authMiddleware,roleMiddleware("admin"),adminDashboard);

module.exports = router ; 