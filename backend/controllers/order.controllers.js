const Order = require("../models/order.model");
const Product = require("../models/product.model");

// Create Order

const createOrder = async(req, res) => {
    try {
        const {items, shippingAddress} = req.body;

        if(!items || items.length === 0){
            return res.status(400).json({message : "cart is empty"})
        }

    } 
  

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING",
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });

    catch (error) {

        console.log(error)
         res.status(400).json({message : "Invalid request"});

    }
};

  

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};