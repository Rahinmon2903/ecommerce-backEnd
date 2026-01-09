
---

# 📘 Backend README (`backend/README.md`)

```md
# 🛒 E-Commerce Backend (Node.js + Express)

This is the **backend API** for a full-stack e-commerce platform.  
It handles authentication, products, cart, orders, payments, and image uploads.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image Uploads)
- Multer
- Razorpay (Payments)

---

## ✨ Features

- Buyer & Seller authentication
- Role-based access control
- Product CRUD (seller-only)
- Image uploads (Cloudinary)
- Cart & wishlist
- Orders & checkout
- Razorpay payment integration
- Reviews & ratings

---

## 📁 Project Structure

backend/
│
├── config/
│ ├── cloudinary.js
│ └── db.js
│
├── Controller/
│ ├── authController.js
│ ├── productController.js
│ ├── cartController.js
│ ├── orderController.js
│ └── paymentController.js
│
├── Middleware/
│ ├── authMiddleware.js
│ └── upload.js
│
├── Models/
│ ├── User.js
│ ├── Product.js
│ ├── Cart.js
│ └── Order.js
│
├── Routes/
│ ├── authRoutes.js
│ ├── productRoutes.js
│ ├── cartRoutes.js
│ ├── orderRoutes.js
│ └── paymentRoutes.js
│
├── server.js
└── .env

yaml
Copy code

---

## ⚙️ Environment Variables

Create a `.env` file in the **backend root**:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
▶️ Run Locally
bash
Copy code
# install dependencies
npm install

# start server
npm run dev
📡 API Highlights
Products
GET /api/products/getdata

GET /api/products/getById/:id

POST /api/products/create (seller only)

DELETE /api/products/delete/:id

Cart
GET /api/cart

POST /api/cart/add

DELETE /api/cart/remove/:productId

Orders
POST /api/orders/checkout

GET /api/orders/my-orders

GET /api/orders/seller-orders

Payments
POST /api/payment/create

POST /api/payment/verify

🌍 Deployment
Recommended platforms:

Render

Railway

VPS (Nginx + PM2)

⚠️ Remember to restart the service after updating environment variables.

🔐 Security Notes
JWT-based authentication

Role-based route protection

Secure image upload via Cloudinary

Razorpay signature verification

👨‍💻 Author
Built with ❤️ by Rahin Mon S

