const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./modules/auth/routes/authRoutes");
const productRoutes = require ("./modules/product/routes/productRoutes");
const categoryRoute = require("./modules/category/routes/categoryRoutes.js");
const cartRoutes = require("./modules/cart/routes/cartRoutes.js");
const orderRoutes = require("./modules/order/routes/orderRoutes");
const auditRoutes = require("./modules/audit/routes/auditRoutes");
const userRoutes = require("./modules/user/routes/userRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.send("api is running");
});

app.use("/api/auth", authRoutes);
app.use ( "/api/products",productRoutes)
app.use ( "/api/categories",categoryRoute)
app.use ( "/api/cart",cartRoutes)
app.use ( "/api/orders",orderRoutes)
app.use ( "/api/audits",auditRoutes)
app.use ( "/api/users",userRoutes)

module.exports = app;
