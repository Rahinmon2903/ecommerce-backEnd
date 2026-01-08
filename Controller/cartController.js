import Cart from "../Model/cartSchema.js";

// add to cart
export const addToCart = async (req, res) => {
  try {
    // Destructure req.body
    const { productId, quantity } = req.body;
  // Find cart
    let cart = await Cart.findOne({ userId: req.user._id });

    // 1 If cart does not exist
    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        products: [{ productId, quantity }]
      });
    } 
    // 2️ If cart exists
    else {
      const itemIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Product already in cart → increase quantity
        cart.products[itemIndex].quantity += quantity;
      } else {
        // New product → add to cart
        cart.products.push({ productId, quantity });
      }
   // Save cart
      await cart.save();
    }

    res.status(200).json({
      message: "Product added to cart successfully",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get cart

export const getCart=async(req,res)=>{
    try {
       // Find cart
        const cart = await Cart.findOne({userId: req.user._id}).populate("products.productId","name price images");
       // 1 If cart does not exist
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        // 2️ If cart exists
        res.status(200).json({message:"Cart found", cart})
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

//remove from cart

export const removeFromCart=async (req,res) => {
    try {
      // Destructure req.body
         const {productId}=req.params;
   // Find cart
    const cart=await Cart.findOne({userId: req.user._id});
   // 1 If cart does not exist
    if(!cart){
        return res.status(404).json({message:"Cart not found"})

    }
    // 2️ If cart exists
    cart.products=cart.products.filter((item) => item.productId.toString() !== productId);
  // Save cart
    await cart.save();
    res.status(200).json({message:"Product removed from cart successfully", cart})
    
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }

   
}


