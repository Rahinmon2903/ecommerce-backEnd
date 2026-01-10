import Order from "../Model/orderSchema.js";
import razorpay from "../Utils/razorpay.js";
import crypto from "crypto";


// CREATE PAYMENT ORDER
export const createPaymentOrder = async (req, res) => {
  try {
    // Destructure req.body
    const { orderId } = req.body;
   // Find order
    const order = await Order.findById(orderId);
  // 1 If order does not exist
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
   // 2 If order is already paid
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
  // Send response
    res.status(200).json({
      message: "Order created successfully",
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment=async(req,res)=>{
    try {
      // Destructure req.body
        const {razorpay_payment_id,razorpay_order_id,razorpay_signature,orderId}=req.body;
      // Verify payment
        const body = razorpay_order_id + "|" + razorpay_payment_id;
       
        const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
       // 1 If payment is not verified
        if(expectedSignature !== razorpay_signature ){
            return res.status(400).json({message:"invalid payment signature"});
        }
         //update order
        await Order.findByIdAndUpdate(orderId,{
            status:"paid",
            paymentId:razorpay_payment_id,
            signature:razorpay_signature,
            razorpayOrderId:razorpay_order_id
            

        })

        res.status(200).json({message:"Payment verified successfully"})

        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}




