import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
       
    },
    razorpayOrderId: {
        type: String,
       
    },
    signature: {
        type: String,
       
    },


    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }

},
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;