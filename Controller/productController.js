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
    /*
    req.files = [
  {
    fieldname: "images",
    originalname: "shoe.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",

    path: "https://res.cloudinary.com/demo/image/upload/v123/shoe.jpg",

    size: 183729,

    filename: "abc123.jpg"
  }
]
  we only getting the path and storing it in images array
  why array because we can also add more images
    */
    
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
/*
Okay, okay, now I get that in Postman we can able to send multiple
 data instead of what we chosen, right? So they can update, okay
 .In front-end, we have an access like we can able to select what
  we need to update, like name, description, that field only 
  updated because in UI, we only give that option. But in Postman
   and Hacker can able to change anything. So if the backend 
   doesn't know what is that, so in backend, we give request 
   from body, it can able to update anything. So the ID, anything
    can be changed.*/
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
        /* if we do realworld product do not use req.body because am hacken can acced and change the seller id etc use
        {
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock
  },
        */
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
      /* we are using populate so in front-end we can we additional info which is not in product schema
      {products.map((p) => (
  <div key={p._id}>
    <h3>{p.name}</h3>

    <p>Seller: {p.seller?.name}</p>
  </div>
))}
  */
        const products = await Product.find().populate("seller", "name")
        res.status(200).json({message:"All products", products})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//get by id

export const getProductById = async (req, res) => {
    try {
      //same concept i mentioned above
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

    //  Prevent duplicate reviews from the same user
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
 //we are using push because review is an array
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

//seller products
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
