import Product from "../Model/productSchema.js";


//create
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // 1️ Validate required fields
    if (!name || !price || !stock) {
      return res.status(400).json({
        message: "Name, price and stock are required",
      });
    }

    // 2️ Get image URLs from Cloudinary (via multer)
    const images = req.files?.map((file) => file.path) || [];

    // 3️ Create product
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,               //  Cloudinary URLs
      seller: req.user._id, //  seller reference
    });

    // 4️ Save
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


//update
export const updateProduct = async (req, res) => {
    try {
      // getting the inputs
        const product = await Product.findById(req.params.id)
       // checking if the product exists
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

       // checking if the user is authorized
        if(product.seller.toString() !== req.user._id.toString()){
           return res.status(403).json({message:"You are not authorized"})
        }

        // updating the product
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
      // getting product id
        const product = await Product.findById(req.params.id)

        // checking if the product exists
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        // checking if the user is authorized /because only the seller can delete the product
        if(product.seller.toString() !== req.user._id.toString()){
           return res.status(403).json({message:"You are not authorized"})
        }

        // deleting the product
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

export const addReview = async (req, res) => {
  try {
    // getting the inputs
    const { rating, comment } = req.body;
  // checking if the inputs are valid
    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

// getting the product
    const product = await Product.findById(req.params.id);
// checking if the product exists
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    //  Prevent duplicate reviews
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

// checking if the user has already reviewed the product
    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

// adding the review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
   
 // adding the review
    product.reviews.push(review);
    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      reviews: product.reviews,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
