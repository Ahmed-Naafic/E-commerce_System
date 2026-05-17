const express = require("express");

const {
  createOrder,getMyOrders
} = require("../controllers/orderController.js");

const authMiddleware = require("../../../middlewares/authMiddleware");

const router = express.Router();

router.post("/",authMiddleware,createOrder);
router.get("/my-orders",authMiddleware,getMyOrders);

module.exports = router;