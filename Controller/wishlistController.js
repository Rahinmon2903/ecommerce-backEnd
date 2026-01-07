import User from "../Model/userSchema.js";

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(req.params.productId)) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );

    await user.save();

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist", "name price images");

    res.status(200).json({
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
