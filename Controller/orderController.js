import Cart from "../Model/cartSchema.js";
import Order from "../Model/orderSchema.js";


//place order

export const placeOrder = async (req, res) => {
  try {
    // Destructure req.body
    const { shippingAddress } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }
  // Find cart
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate("products.productId", "price");
     // 1 If cart does not exist
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
// 2️ If cart exists
    let totalAmount = 0;
// Check if all products are valid
    const validProducts = cart.products.filter(
      (item) => item.productId !== null
    );

    if (validProducts.length === 0) {
      return res.status(400).json({
        message: "All products were removed by seller",
      });
    }
  
    const productsOrdered = validProducts.map((item) => {
      totalAmount += item.productId.price * item.quantity;
      return {
        productId: item.productId._id,
        quantity: item.quantity,
      };
    });
// Create order
    const createOrder = await Order.create({
      buyer: req.user._id,
      products: productsOrdered,
      totalAmount,
      shippingAddress, 
    });

    // clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json({
      message: "Order created",
      createOrder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//get my orders

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id ,status: "paid" })
      .populate("products.productId", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//seller orders only

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "products.productId": { $exists: true }
    })
      .populate("products.productId", "name seller")
      .populate("buyer", "name email");

    const SellerOrders = orders.filter(order =>
      order.products.some(p =>
        p.productId &&   // ✅ prevents crash
        p.productId.seller.toString() === req.user._id.toString()
      )
    );

    res.status(200).json({
      message: "Orders found",
      SellerOrders
    });

  } catch (error) {
    console.error("Seller Orders Error:", error); // ✅ KEEP THIS
    res.status(500).json({ message: error.message });
  }
};

//update order
   export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id).populate(
      "products.productId",
      "seller"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    //  Ensure this seller owns at least one product in the order
    const isSellerOrder = order.products.some(
      (item) =>
        item.productId &&
        item.productId.seller.toString() === req.user._id.toString()
    );

    if (!isSellerOrder) {
      return res.status(403).json({
        message: "You are not authorized to update this order",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerStats = async (req, res) => {
  try {
    // Get seller ID
    const sellerId = req.user._id;

    // Get paid orders that contain this seller's products
    const orders = await Order.find({ status: "paid" })
      .populate("products.productId", "seller price")
      .sort({ createdAt: -1 });

    // Keep only orders where seller owns at least one product
    const sellerOrders = orders.filter((order) =>
      order.products.some(
        (item) =>
          item.productId &&
          item.productId.seller.toString() === sellerId.toString()
      )
    );
    // Calculate stats
    let totalRevenue = 0;
    let totalItemsSold = 0;
   // Loop through orders and finf total revenue and total items sold
    sellerOrders.forEach((order) => {
      order.products.forEach((item) => {
        if (
          item.productId &&
          item.productId.seller.toString() === sellerId.toString()
        ) {
          totalRevenue += item.productId.price * item.quantity;
          totalItemsSold += item.quantity;
        }
      });
    });

   // Return stats
    res.status(200).json({
      totalRevenue,
      totalOrders: sellerOrders.length,
      totalItemsSold,
      recentOrders: sellerOrders.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

