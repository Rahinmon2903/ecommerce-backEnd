import express from "express";
import { authMiddleware, sellerOnly } from "../Middleware/authMiddleware.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../Controller/productController.js";


const router = express.Router();

//seller routes


router.post("/create",authMiddleware,sellerOnly,createProduct );
router.put("/update/:id",authMiddleware,sellerOnly,updateProduct);
router.delete("/delete/:id",authMiddleware,sellerOnly,deleteProduct);

//public routes

router.get("/getdata",getAllProducts);
router.get("/getById/:id",getProductById);

export default router;
