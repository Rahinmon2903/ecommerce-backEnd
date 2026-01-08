import User from "../Model/userSchema.js";

export const addToWishlist = async (req, res) => {
  try {
    // Destructure req.body
    const { productId } = req.body;
   // Find cart
    const user = await User.findById(req.user._id);
   // 1 If user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicates
    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }
  // Add product to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    // Find wishlist in userSchema
    const user = await User.findById(req.user._id)
      .populate("wishlist");
  //
    res.status(200).json({
      wishlist: user?.wishlist || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    // Destructure req.body
    const { productId } = req.params;
  // Find user
    const user = await User.findById(req.user._id);
// 1 If user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
// Remove product from wishlist by its productId
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
  // Save user
    await user.save();

    res.status(200).json({
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
