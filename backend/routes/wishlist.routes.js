import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addProductToWishlist,
  getUserWishlist,
  removeProductFromWishlist
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/:productId", addProductToWishlist);
router.get("/", getUserWishlist);
router.delete("/:productId", removeProductFromWishlist);

export default router;
