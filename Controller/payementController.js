import Order from "../Model/orderSchema.js";
import razorpay from "../Utils/razorpay.js";

// CREATE PAYMENT ORDER
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${order._id}`
    });

    // Save Razorpay order ID in DB
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      message: "Order created successfully",
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


