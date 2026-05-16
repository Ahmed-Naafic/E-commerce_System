const express = require("express");
const {createProduct, getProducts, getSingleProduct, updateProduct, deleteProduct} = require ( "../controllers/productController");
const authMiddleware = require ("../../../middlewares/authMiddleware");
const roleMiddleware = require ("../../../middlewares/roleMiddleware");
const router =express.Router();


router.post("/", authMiddleware,roleMiddleware("admin"),createProduct);
router.put("/:id", authMiddleware,roleMiddleware("admin"),updateProduct);
router.delete("/:id", authMiddleware,roleMiddleware("admin"),deleteProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);


module.exports = router ; 

