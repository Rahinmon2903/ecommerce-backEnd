import express from "express";
import { authMiddleware, buyerOnly } from "../Middleware/authMiddleware.js";
import { createPaymentOrder, verifyPayment } from "../Controller/paymentController.js";


const router = express.Router();

// Create Razorpay order
router.post("/create",authMiddleware,buyerOnly,createPaymentOrder);

// Verify payment
router.post("/verify",authMiddleware,buyerOnly,verifyPayment);

export default router;
