# 🛒 ShopKart — MERN E-Commerce Application

ShopKart is a full-stack e-commerce web application built using the **MERN stack**. It provides a complete shopping journey from customer authentication and product browsing to cart management, checkout, Razorpay test payments, and order history.

## 🚀 Features

* Customer Registration & Login
* JWT Authentication with HTTP-only Cookies
* Protected Routes
* Product Listing & Product Details
* Product Search & Filtering
* Wishlist Management
* Shopping Cart
* Quantity Increase / Decrease
* Stock Validation
* Checkout & Shipping Address
* Server-side Order Total Calculation
* Razorpay Test Mode Payment
* Razorpay Payment Signature Verification
* Automatic Cart Clearing After Successful Payment
* Order Confirmation
* My Orders
* Individual Order Details
* Protected Order APIs
* Loading, Validation & Error States

---

## 🧰 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Context API
* Vite
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Cookie Parser
* CORS

### Payment

* Razorpay Test Mode

---

## 📁 Project Structure

```text
ShopKart Mern LAB Project/
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │   └── razorpay.js
│   ├── .env.example
│   ├── index.js
│   └── seedProducts.js
│
├── frontend/
│   └── vite-project/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── styles/
│       │   └── utils/
│       ├── package.json
│       └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🔄 Application Flow

```text
Register / Login
       ↓
Browse Products
       ↓
Add to Wishlist
       ↓
Add to Cart
       ↓
Review Cart
       ↓
Checkout
       ↓
Enter Shipping Details
       ↓
Server-side Price & Stock Validation
       ↓
Create Pending Order
       ↓
Create Razorpay Order
       ↓
Razorpay Test Checkout
       ↓
Verify Payment Signature
       ↓
Mark Order as PAID
       ↓
Clear Cart
       ↓
Order Confirmation
       ↓
My Orders
```

---

## 💳 Razorpay Payment

ShopKart uses **Razorpay Test Mode** for payment processing.

The payment flow is handled securely on the server.

### Important security rules

* Razorpay Secret Key is stored only in the backend `.env`
* Frontend does not receive the secret key
* Order amount is calculated by the backend
* Client-provided total is not trusted
* Product prices are fetched from the database
* Stock is verified before payment
* Razorpay payment signature is verified on the server
* Cart is cleared only after successful payment verification

### Payment Flow

```text
Frontend
   ↓
POST /orders/create-payment-order
   ↓
Backend calculates total
   ↓
Backend checks stock
   ↓
ShopKart Pending Order
   ↓
Razorpay Order
   ↓
Razorpay Checkout
   ↓
Payment
   ↓
Frontend receives payment details
   ↓
POST /orders/verify-payment
   ↓
Server verifies signature
   ↓
Order marked PAID
   ↓
Cart cleared
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/angel25bcs10712-stack/Mern---End-Term-Project-Term-5.git
```

```bash
cd Mern---End-Term-Project-Term-5
```

---

## 🔧 Backend Setup

Open the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## 💻 Frontend Setup

Open another terminal:

```bash
cd frontend/vite-project
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 📡 API Endpoints

### Authentication

```text
POST /customers/register
POST /customers/login
GET  /customers/me
POST /customers/logout
```

### Products

```text
GET /products
GET /products/:id
```

### Wishlist

```text
POST   /wishlist/:productId
GET    /wishlist
DELETE /wishlist/:productId
```

### Cart

```text
POST   /cart/:productId
GET    /cart
PATCH  /cart/:productId
DELETE /cart/:productId
```

### Orders

```text
POST /orders/create-payment-order
POST /orders/verify-payment
GET  /orders
GET  /orders/:id
```

---

## 🛍️ Order Management

Each order stores a snapshot of important product information at the time of purchase, including:

* Product
* Product name
* Product price
* Product image
* Quantity
* Shipping address
* Total amount
* Payment status
* Order status
* Razorpay order ID
* Razorpay payment ID

This ensures that historical orders remain accurate even if the product changes later.

---

## 🧪 Payment Testing

### Successful Payment

```text
Payment Successful
        ↓
Signature Verified
        ↓
Order = PAID
        ↓
Cart Cleared
        ↓
Order Confirmation
```

### Failed Payment

```text
Payment Failed
        ↓
Error Displayed
        ↓
Cart Remains
```

### Invalid Signature

```text
Invalid Signature
        ↓
Payment Rejected
        ↓
Order Not Marked PAID
        ↓
Cart Not Cleared
```

---

## 🔐 Security

The application follows several security practices:

* Password hashing with bcrypt
* JWT authentication
* HTTP-only authentication cookies
* Protected routes
* User-specific order access
* Server-side price calculation
* Server-side stock validation
* Razorpay signature verification
* Secret credentials stored in environment variables

**Never commit `.env` files or Razorpay secret keys to GitHub.**

---

## 📌 Environment Variables

The real `.env` file should remain local.

Use the following structure:

```text
.env
    ↓
Contains real credentials
    ↓
Ignored by Git

.env.example
    ↓
Contains placeholder values
    ↓
Safe to commit
```

---

## 🎓 Lab Information

**Project:** ShopKart
**Lab:** Engineering Lab 06 — Checkout & Orders
**Type:** Full-Stack MERN E-Commerce Application
**Payment:** Razorpay Test Mode

---

## 👨‍💻 Author

**Angel Singh**

Computer Science Student

Built with:

```text
React + Node.js + Express + MongoDB + Razorpay
```

---

## ⭐ Project Journey

```text
Authentication
      ↓
Products
      ↓
Wishlist
      ↓
Shopping Cart
      ↓
Checkout
      ↓
Razorpay Payment
      ↓
Payment Verification
      ↓
Order Creation
      ↓
Order History
```

**ShopKart — Complete MERN E-Commerce Experience 🚀**
