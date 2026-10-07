import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from "../utils/razorpay.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";

const getUserId = (req) => req.user?._id ?? req.user?.id;

const validateShippingAddress = (addr) => {
  const errors = {};
  const a = addr && typeof addr === "object" ? addr : {};
  const clean = {};

  for (const field of [
    "fullName",
    "phone",
    "addressLine1",
    "city",
    "state",
    "pincode"
  ]) {
    clean[field] =
      typeof a[field] === "string"
        ? a[field].trim()
        : "";

    if (!clean[field]) {
      errors[field] = "This field is required.";
    }
  }

  const phone = clean.phone.replace(/[\s-]/g, "");

  if (
    !errors.phone &&
    !/^(\+91)?[6-9]\d{9}$/.test(phone)
  ) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  if (
    !errors.pincode &&
    !/^\d{6}$/.test(clean.pincode)
  ) {
    errors.pincode = "Pincode must contain 6 digits.";
  }

  return { errors, clean };
};


/*
POST /orders/create-payment-order
Creates ShopKart order + Razorpay order.
*/
export const createPaymentOrder = async (req, res) => {
  try {
    const userId = getUserId(req);

    const { errors, clean } =
      validateShippingAddress(req.body?.shippingAddress);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping address.",
        errors
      });
    }

    const customer = await Customer.findById(userId);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty."
      });
    }

    /*
    IMPORTANT:
    Never trust frontend prices or totals.
    Load latest products from database.
    */
    const productIds = customer.cart.map(
      (item) => item.product
    );

    const products = await Product.find({
      _id: { $in: productIds }
    });

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product
      ])
    );

    const items = [];
    let totalRupees = 0;

    for (const cartItem of customer.cart) {
      const product = productMap.get(
        String(cartItem.product)
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            "A product in your cart is no longer available."
        });
      }

      const quantity = Number(cartItem.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid quantity for ${product.name}.`
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message:
            `Insufficient stock for ${product.name}. Only ${product.stock} available.`
        });
      }

      totalRupees += product.price * quantity;

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      });
    }

    /*
    Create ShopKart order first.
    */
    const order = await Order.create({
      user: userId,
      items,
      shippingAddress: clean,
      totalAmount: totalRupees,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT"
    });

    let razorpayOrder;

    try {
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalRupees * 100),
        currency: "INR",
        receipt: order._id.toString()
      });
    } catch (error) {
      await Order.findByIdAndDelete(order._id);

      console.error(
        "Razorpay order creation failed:",
        error
      );

      return res.status(502).json({
        success: false,
        message:
          "Could not start payment. Please try again."
      });
    }

    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    return res.status(201).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error(
      "Create payment order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating order."
    });
  }
};


/*
POST /orders/verify-payment
Verify Razorpay signature.
*/
export const verifyPayment = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      shopKartOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body || {};

    if (
      !shopKartOrderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details."
      });
    }

    if (!mongoose.isValidObjectId(shopKartOrderId)) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    const order = await Order.findOne({
      _id: shopKartOrderId,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    /*
    Idempotent verification.
    */
    if (order.paymentStatus === "PAID") {
      await Customer.findByIdAndUpdate(
        userId,
        { $set: { cart: [] } }
      );

      return res.json({
        success: true,
        order
      });
    }

    /*
    Razorpay order ID must match our database.
    */
    if (
      !order.razorpayOrderId ||
      order.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature."
      });
    }

    /*
    Generate expected HMAC.
    */
    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${order.razorpayOrderId}|${razorpay_payment_id}`
        )
        .digest("hex");

    const expectedBuffer =
      Buffer.from(expectedSignature);

    const receivedBuffer =
      Buffer.from(String(razorpay_signature));

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      )
    ) {
      await Order.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: "FAILED"
        }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature."
      });
    }

    /*
    Final stock check before completing order.
    */
    for (const item of order.items) {
      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            `${item.name} is no longer available.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message:
            `Insufficient stock for ${item.name}.`
        });
      }
    }

    /*
    Reduce stock.
    */
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity
          }
        }
      );
    }

    /*
    Mark order as paid.
    */
    const finalOrder =
      await Order.findOneAndUpdate(
        {
          _id: order._id,
          user: userId,
          paymentStatus: {
            $ne: "PAID"
          }
        },
        {
          $set: {
            paymentStatus: "PAID",
            status: "PLACED",
            razorpayPaymentId:
              razorpay_payment_id
          }
        },
        {
          new: true
        }
      );

    /*
    IMPORTANT:
    Cart clears ONLY after verified payment.
    */
    await Customer.findByIdAndUpdate(
      userId,
      {
        $set: {
          cart: []
        }
      }
    );

    return res.json({
      success: true,
      order: finalOrder || order
    });

  } catch (error) {
    console.error(
      "Verify payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while verifying payment."
    });
  }
};


/*
GET /orders
*/
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: getUserId(req)
    }).sort({
      createdAt: -1
    });

    return res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Could not fetch orders."
    });
  }
};


/*
GET /orders/:id
*/
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: getUserId(req)
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    return res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Could not fetch order."
    });
  }
};
