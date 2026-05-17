const Cart = require("../../cart/models/cart.js");
const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {

    const {
      shippingAddress,
      paymentMethod,
    } = req.body;

    // find cart
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // prepare order items
    const orderItems = [];

    let totalPrice = 0;

    for (const item of cart.items) {

      const product = item.product;

      // stock validation
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message:
            `${product.name} out of stock`,
        });
      }

      // reduce stock
      product.stock -= item.quantity;

      await product.save();

      // snapshot data
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      totalPrice +=
        product.price * item.quantity;
    }

    // create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    // clear cart
    cart.items = [];

    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {createOrder, getMyOrders}