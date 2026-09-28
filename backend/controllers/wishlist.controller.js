import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addProductToWishlist = async (req, res) => {
  try { 
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isAlreadySaved = customer.wishlist.some((id) => id.toString() === productId);

    if (isAlreadySaved) {
      return res.status(409).json({ success: false, message: "Product already in wishlist" });
    }

    customer.wishlist.push(product._id);
    await customer.save();

    return res.status(200).json({ success: true, message: "Product added to wishlist" });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "wishlist",
      select: "name price category image stock"
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist
    });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeProductFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const previousLength = customer.wishlist.length;
    customer.wishlist = customer.wishlist.filter((id) => id.toString() !== productId);

    if (customer.wishlist.length === previousLength) {
      return res.status(404).json({ success: false, message: "Product not found in wishlist" });
    }

    await customer.save();

    return res.status(200).json({ success: true, message: "Product removed from wishlist" });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
