import Product from "../Model/productSchema.js";

//create
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
      seller: req.user._id
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        if(product.seller.toString() !== req.user._id.toString()){
           return res.status(403).json({message:"You are not authorized"})
        }
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
         res.status(200).json({message:"Product updated successfully", updated})
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

//delete

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        if(product.seller.toString() !== req.user._id.toString()){
           return res.status(403).json({message:"You are not authorized"})
        }
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Product deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("seller", "name")
        res.status(200).json({message:"All products", products})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//get by id

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller", "name")
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        res.status(200).json({message:"Product found", product})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}