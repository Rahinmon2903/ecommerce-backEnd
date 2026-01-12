import express from "express";
import { authMiddleware, buyerOnly, sellerOnly } from "../Middleware/authMiddleware.js";
import { addReview, createProduct, deleteProduct, getAllProducts, getProductById, getSellerProducts, updateProduct } from "../Controller/productController.js";
import upload from "../Middleware/upload.js";


const router = express.Router();

//seller routes


router.post("/create",authMiddleware,sellerOnly,upload.array("images", 5),createProduct );
router.put("/update/:id",authMiddleware,sellerOnly,updateProduct);
router.delete("/delete/:id",authMiddleware,sellerOnly,deleteProduct);

//public routes

router.get("/getdata",getAllProducts);
router.get("/getById/:id",getProductById);
router.get(
  "/seller",
  authMiddleware,
  sellerOnly,
  getSellerProducts
);

router.post(
  "/:id/review",
  authMiddleware,
  buyerOnly,
  addReview
);


export default router;
