const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/routes/authRoutes");
const productRoutes = require ("./modules/product/routes/productRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api is running");
});

app.use("/api/auth", authRoutes);
app.use ( "/api/products",productRoutes)

module.exports = app;