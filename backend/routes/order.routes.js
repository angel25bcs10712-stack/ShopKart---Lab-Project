import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createPaymentOrder, verifyPayment, getMyOrders, getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

router.use(authMiddleware); // every order route requires a JWT

router.post("/create-payment-order", createPaymentOrder);
router.post("/verify-payment", verifyPayment);
router.get("/", getMyOrders);
router.get("/:id", getOrderById); // keep last so it never swallows the POST paths

export default router;