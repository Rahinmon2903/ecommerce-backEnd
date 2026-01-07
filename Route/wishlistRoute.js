import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../Controller/wishlistController.js";

const router = express.Router();

router.post("/add", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getWishlist);
router.delete("/remove/:productId", authMiddleware, removeFromWishlist);

export default router;
