import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// POST /cart/:productId
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: "Product is out of stock" });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!customer.cart) {
      customer.cart = [];
    }

    const itemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQuantity = customer.cart[itemIndex].quantity + 1;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Stock limit of ${product.stock} reached.`
        });
      }
      customer.cart[itemIndex].quantity = newQuantity;
    } else {
      customer.cart.push({ product: product._id, quantity: 1 });
    }

    await customer.save();
    await customer.populate({
      path: "cart.product",
      select: "name price category image stock"
    });

    const validCart = customer.cart.filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: validCart
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /cart
export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price category image stock"
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const validCart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      cart: validCart
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /cart/:productId
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    if (quantity === undefined || quantity === null || typeof quantity !== "number" || isNaN(quantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a valid number" });
    }

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    if (!Number.isInteger(quantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be an integer" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const itemIndex = (customer.cart || []).findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity exceeds available stock. Only ${product.stock} units available.`
      });
    }

    customer.cart[itemIndex].quantity = quantity;
    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price category image stock"
    });

    const validCart = customer.cart.filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: validCart
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /cart/:productId
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const initialLength = (customer.cart || []).length;
    customer.cart = (customer.cart || []).filter(
      (item) => item.product.toString() !== productId
    );

    if (customer.cart.length === initialLength) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price category image stock"
    });

    const validCart = customer.cart.filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: validCart
    });
  } catch (error) {
    console.error("Remove cart item error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
