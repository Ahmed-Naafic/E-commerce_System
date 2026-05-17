const express = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");
const roleMiddleware = require("../../../middlewares/roleMiddleware");
const {
  getLoginAudits,
  getMyLoginAudits,
} = require("../controllers/auditController");

const router = express.Router();

router.get(
  "/login/me",
  authMiddleware,
  getMyLoginAudits
);

router.get(
  "/login",
  authMiddleware,
  roleMiddleware("admin"),
  getLoginAudits
);

module.exports = router;
