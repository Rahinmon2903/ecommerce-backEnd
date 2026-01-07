import express from "express";
import { authMiddleware, buyerOnly, sellerOnly } from "../Middleware/authMiddleware.js";
import { getMyOrders, getSellerOrders, placeOrder, updateOrderStatus } from "../Controller/orderController.js";


const router = express.Router();

router.post("/checkout",authMiddleware,buyerOnly,placeOrder);
router.get("/my-orders",authMiddleware,buyerOnly,getMyOrders);
router.get("/seller-orders",authMiddleware,sellerOnly,getSellerOrders);
router.put(
  "/update-status/:id",
  authMiddleware,
  sellerOnly,
  updateOrderStatus
);

export default router;


