const express = require("express");
const authMiddleware = require ("../../../middlewares/authMiddleware");
const roleMiddleware = require ("../../../middlewares/roleMiddleware");
const { createCategory,getCategory, getSingleCategory ,updateCategory, deleteCategory} = require("../controllers/categoryController");
const router =express.Router();

router.post("/",authMiddleware,roleMiddleware("admin"), createCategory);
router.get("/",getCategory);
router.get("/:id",getSingleCategory);
router.put("/:id",authMiddleware, roleMiddleware("admin"), updateCategory);
router.delete("/:id",authMiddleware, roleMiddleware("admin"), deleteCategory);



module.exports = router;