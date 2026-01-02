import Cart from "../Model/cartSchema.js";
import Order from "../Model/orderSchema.js";


//place order

export const placeOrder=async(req,res)=>{
    try {
        const cart=await Cart.findOne({userId:req.user._id}).populate("products.productId","price");

        if(!cart || cart.products.length === 0){
            return res.status(400).json({message:"Cart is empty"});

        }
         let totalAmount = 0;

        const productsOrdered=cart.products.map((item)=>{
        totalAmount += item.productId.price*item.quantity;
        return{
            productId:item.productId._id,
            quantity:item.quantity


        };
    });

    const createOrder=await Order.create({
        buyer:req.user._id,
         products:productsOrdered,
         totalAmount:totalAmount


    })

    cart.products=[];

    await cart.save();
    res.status(201).json({message:"Order placed successfully", createOrder})

        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

//get my orders

export const getMyOrders=async(req,res)=>{
    try {
        const orders =await Order.findOne({buyer:req.user._id}).populate("products.productId","name price");

        res.status(200).json({message:"Orders found", orders})
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}
   