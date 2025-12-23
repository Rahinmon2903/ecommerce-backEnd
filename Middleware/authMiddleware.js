import jwt from "jsonwebtoken";
import User from "../Model/userSchema.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based middleware
export const sellerOnly = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Seller access only" });
  }
  next();
};

export const buyerOnly = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ message: "Buyer access only" });
  }
  next();
};
