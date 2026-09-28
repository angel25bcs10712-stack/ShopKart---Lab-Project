import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/:productId", addToCart);
router.get("/", getCart);
router.patch("/:productId", updateCartQuantity);
router.delete("/:productId", removeCartItem);

export default router;
