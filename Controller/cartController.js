import Cart from "../Model/cartSchema.js";

// add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

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
        const cart = await Cart.findOne({userId: req.user._id}).populate("products.productId","name price images");

        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }

        res.status(200).json({message:"Cart found", cart})
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

//remove from cart

export const removeFromCart=async (req,res) => {
    try {
         const {productId}=req.params;

    const cart=await Cart.findOne({userId: req.user._id});

    if(!cart){
        return res.status(404).json({message:"Cart not found"})

    }
    cart.products=cart.products.filter((item) => item.productId.toString() !== productId);

    await cart.save();
    res.status(200).json({message:"Product removed from cart successfully", cart})
    
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }

   
}


