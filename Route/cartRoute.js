import express from "express";
import { authMiddleware, buyerOnly } from "../Middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart } from "../Controller/cartController.js";


const router = express.Router();

router.get("/",authMiddleware,buyerOnly,getCart);
router.post("/add",authMiddleware,buyerOnly,addToCart);
router.delete("/remove/:productId",authMiddleware,buyerOnly,removeFromCart);

export default router;
