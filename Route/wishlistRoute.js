import express from "express";
import { authMiddleware, buyerOnly } from "../Middleware/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../Controller/wishlistController.js";

const router = express.Router();

router.post("/add", authMiddleware,buyerOnly, addToWishlist);
router.get("/", authMiddleware,buyerOnly, getWishlist);
router.delete("/remove/:productId", authMiddleware,buyerOnly, removeFromWishlist);

export default router;
