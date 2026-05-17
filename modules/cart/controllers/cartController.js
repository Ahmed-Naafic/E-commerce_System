const Cart=require("../models/cart.js")
const Product = require("../../product/models/Product");

const addToCart = async (req, res) => {
  try {

    const { productId, quantity } = req.body;

    // validate product
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // find user cart
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // create cart if not exists
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // check existing item
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    // if item exists increase quantity
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      // add new item
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      populate: {
        path: "category",
        select: "name",
      },
    });

    // if no cart
    if (!cart) {
      return res.status(200).json({
        items: [],
        totalPrice: 0,
      });
    }

    // calculate total
    let totalPrice = 0;

    cart.items.forEach((item) => {
      totalPrice +=
        item.product.price * item.quantity;
    });

    res.status(200).json({
      cart,
      totalPrice,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const updateCartItem = async (req, res) => {
  try {

    const { quantity } = req.body;

    // validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    // find cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // find item
    const item = cart.items.find(
      (item) =>
        item.product.toString() ===
        req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    // update quantity
    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const removeCartItem = async (req, res) => {
  try {

    // find cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // filter out item
    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !==
        req.params.productId
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {addToCart, getCart, updateCartItem, removeCartItem};