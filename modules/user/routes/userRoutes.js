const express = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");
const roleMiddleware = require("../../../middlewares/roleMiddleware");
const {
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
