import express from "express";
import { authMiddleware, buyerOnly } from "../Middleware/authMiddleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../Controller/wishlistController.js";

const router = express.Router();

router.post("/:productId", authMiddleware, buyerOnly, addToWishlist);
router.delete("/:productId", authMiddleware, buyerOnly, removeFromWishlist);
router.get("/", authMiddleware, buyerOnly, getWishlist);

export default router;
