# 🛒 ShopKart — MERN E-Commerce Application

ShopKart is a full-stack **MERN e-commerce web application** developed as part of the ShopKart MERN Lab Project.

The application provides a complete shopping experience including **customer authentication, product browsing, wishlist management, shopping cart, checkout, Razorpay test-mode payments, order creation, order history, and order details**.

The project follows a client-server architecture with a React frontend and Node.js/Express backend connected to MongoDB.

---

## 📌 Project Overview

ShopKart allows customers to:

* Create an account
* Login and logout securely
* Browse products
* View product details
* Add products to wishlist
* Remove products from wishlist
* Add products to cart
* Update cart quantities
* Remove products from cart
* Proceed to checkout
* Enter and validate shipping information
* Review their order
* Make payments using Razorpay Test Mode
* Verify payments securely on the backend
* View order confirmation
* View all previous orders
* View individual order details

The project also implements backend-side price calculation and stock verification to prevent the client from manipulating the order total.

---

# ✨ Features

## 👤 Customer Authentication

* Customer registration
* Customer login
* Customer logout
* Protected customer profile
* Password hashing using bcrypt
* Authentication using JWT
* HTTP-only authentication cookie
* Protected routes and APIs

---

## 🛍️ Product Management

Customers can:

* View available products
* View individual product details
* Browse products through the backend API
* Search/filter products where supported
* Add products to cart
* Add products to wishlist

Product information is stored in MongoDB.

---

## ❤️ Wishlist

The wishlist functionality allows customers to:

* Add a product to wishlist
* View wishlist
* Remove a product from wishlist

Wishlist APIs are protected and require authentication.

---

## 🛒 Shopping Cart

Customers can:

* Add products to cart
* View cart
* Increase product quantity
* Decrease product quantity
* Update quantity
* Remove products
* Proceed to checkout

The cart is associated with the authenticated customer.

---

# 💳 Checkout & Payment

The checkout system implements the complete purchase flow.

### Checkout Flow

```text
Cart
  ↓
Checkout
  ↓
Shipping Address
  ↓
Order Review
  ↓
Backend Stock Verification
  ↓
Backend Total Calculation
  ↓
Create ShopKart Pending Order
  ↓
Create Razorpay Order
  ↓
Razorpay Checkout
  ↓
Payment
  ↓
Payment Signature Verification
  ↓
Order Confirmed
  ↓
Cart Cleared
  ↓
Order Success
  ↓
My Orders
```

---

## 💰 Razorpay Test Mode

The project uses **Razorpay Test Mode** for payment processing.

The Razorpay checkout script is loaded dynamically:

```text
https://checkout.razorpay.com/v1/checkout.js
```

Razorpay credentials are stored only on the backend.

The frontend never receives the Razorpay secret key.

---

## 🔐 Secure Payment Flow

The payment flow follows these steps:

### 1. Customer submits shipping address

The frontend sends only the shipping address to:

```http
POST /orders/create-payment-order
```

The frontend does **not** send the final order total.

---

### 2. Backend reads the cart

The backend retrieves the authenticated customer's cart.

---

### 3. Backend fetches latest product information

The backend gets the latest product documents from MongoDB.

This prevents the client from changing product prices.

---

### 4. Backend calculates the total

The server calculates:

```text
total = product price × quantity
```

for every cart item.

The final total is calculated on the server.

---

### 5. Backend verifies stock

Before creating the payment order, the backend checks whether sufficient stock is available.

If stock is insufficient, payment order creation is stopped.

---

### 6. ShopKart order is created

A pending order is created with:

```text
PENDING_PAYMENT
```

and:

```text
paymentStatus = PENDING
```

---

### 7. Razorpay order is created

The backend creates a Razorpay order using the server-side calculated amount.

Razorpay expects the amount in **paise**.

For example:

```text
₹500
```

becomes:

```text
50000 paise
```

---

### 8. Razorpay Checkout opens

The frontend receives the Razorpay order information and opens the Razorpay payment window.

---

### 9. Payment is completed

Razorpay returns:

```text
razorpay_order_id
razorpay_payment_id
razorpay_signature
```

---

### 10. Payment signature is verified

The frontend sends the payment information to:

```http
POST /orders/verify-payment
```

The backend verifies the Razorpay signature using:

```text
HMAC SHA256
```

and the Razorpay secret key.

---

### 11. Order is confirmed

Only after successful payment verification:

```text
paymentStatus = PAID
```

and the order status is updated.

---

### 12. Cart is cleared

The cart is cleared **only after successful payment verification**.

If payment fails or the Razorpay window is closed, the cart remains unchanged.

---

# 🧮 Server-Side Price Calculation

The project does not trust the total amount sent by the frontend.

For example, a malicious client could try to send:

```json
{
  "totalAmount": 1
}
```

even though the actual cart is worth:

```text
₹5000
```

The backend ignores the client total.

Instead, it calculates the amount using the latest product information stored in MongoDB.

This protects the application against client-side price manipulation.

---

# 📦 Order Management

Each order stores important information such as:

* Customer
* Products
* Quantity
* Product name snapshot
* Product price snapshot
* Product image snapshot
* Shipping address
* Total amount
* Payment status
* Order status
* Razorpay order ID
* Razorpay payment ID

---

## 📸 Product Snapshot

When an order is created, product information is copied into the order.

For example:

```text
Product Name
Product Price
Product Image
Quantity
```

This means the order keeps the original purchase information even if the product changes later.

For example:

```text
Product price today: ₹999
```

If the customer purchases it and the price later becomes:

```text
₹1299
```

the old order still shows:

```text
₹999
```

---

# 📊 Order Status

The application supports order statuses such as:

```text
PENDING_PAYMENT
PLACED
CONFIRMED
SHIPPED
DELIVERED
```

Payment status can include:

```text
PENDING
PAID
FAILED
```

---

# 📋 My Orders

Authenticated customers can access:

```text
/orders
```

The My Orders page displays:

* Order ID
* Order status
* Payment status
* Total amount
* Number of items
* Link to view order details

---

# 🔎 Order Details

Customers can open an individual order.

The order details page displays:

* Order ID
* Order status
* Payment status
* Shipping address
* Ordered products
* Quantity
* Product price
* Item total
* Final order total

---

# 🧑‍💻 Technology Stack

## Frontend

* React
* React Router
* Axios
* JavaScript
* CSS
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* cookie-parser
* CORS
* dotenv
* Razorpay

## Payment

* Razorpay Test Mode

---

# 📁 Project Structure

```text
ShopKart Mern LAB Project/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── customer.controller.js
│   │   ├── product.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── cart.controller.js
│   │   └── order.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── customer.model.js
│   │   ├── product.model.js
│   │   ├── wishlist.model.js
│   │   ├── cart.model.js
│   │   └── order.model.js
│   │
│   ├── routes/
│   │   ├── customer.routes.js
│   │   ├── product.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── cart.routes.js
│   │   └── order.routes.js
│   │
│   ├── utils/
│   │   └── razorpay.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   └── seedProducts.js
│
├── frontend/
│   └── vite-project/
│       │
│       ├── src/
│       │   ├── components/
│       │   │   ├── CheckoutForm.jsx
│       │   │   ├── OrderSummary.jsx
│       │   │   └── Navbar.jsx
│       │   │
│       │   ├── context/
│       │   │   └── CartContext.jsx
│       │   │
│       │   ├── pages/
│       │   │   ├── Cart.jsx
│       │   │   ├── Checkout.jsx
│       │   │   ├── MyOrders.jsx
│       │   │   ├── OrderDetails.jsx
│       │   │   └── OrderSuccess.jsx
│       │   │
│       │   ├── services/
│       │   │   ├── ProductApi.js
│       │   │   └── orderApi.js
│       │   │
│       │   ├── utils/
│       │   │   ├── loadRazorpay.js
│       │   │   └── validateShipping.js
│       │   │
│       │   └── styles/
│       │       └── checkout.css
│       │
│       └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

# 🔧 Backend Setup

## 1. Open the backend directory

```powershell
cd "C:\Users\hp\OneDrive\Attachments\Documents\ShopKart Mern LAB Project\backend"
```

---

## 2. Install dependencies

```powershell
npm install
```

---

## 3. Configure environment variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
```

### Important

Never commit `.env` to GitHub.

The project `.gitignore` already ignores:

```text
.env
**/.env
```

---

# ▶️ Start Backend

From the backend directory:

```powershell
npm run dev
```

or, depending on the package configuration:

```powershell
npm start
```

The backend runs on:

```text
http://localhost:5000
```

Expected output:

```text
DB connected
Server running on port 5000
```

---

# 🎨 Frontend Setup

Open another terminal.

Navigate to:

```powershell
cd "C:\Users\hp\OneDrive\Attachments\Documents\ShopKart Mern LAB Project\frontend\vite-project"
```

Install dependencies:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

---

# 🔗 Frontend-Backend Connection

The frontend communicates with the backend using Axios.

Backend base URL:

```text
http://localhost:5000
```

Axios is configured with:

```js
withCredentials: true
```

This allows authentication cookies to be sent with requests.

---

# 🌐 API Endpoints

## 👤 Customer APIs

### Register

```http
POST /customers/register
```

### Login

```http
POST /customers/login
```

### Get Profile

```http
GET /customers/me
```

### Logout

```http
POST /customers/logout
```

---

# 🛍️ Product APIs

### Get Products

```http
GET /products
```

### Get Product

```http
GET /products/:id
```

---

# ❤️ Wishlist APIs

### Get Wishlist

```http
GET /wishlist
```

### Add Product

```http
POST /wishlist/:productId
```

### Remove Product

```http
DELETE /wishlist/:productId
```

---

# 🛒 Cart APIs

### Get Cart

```http
GET /cart
```

### Add Product

```http
POST /cart/:productId
```

### Update Quantity

```http
PATCH /cart/:productId
```

Example request:

```json
{
  "quantity": 3
}
```

### Remove Product

```http
DELETE /cart/:productId
```

---

# 📦 Order APIs

## Create Payment Order

```http
POST /orders/create-payment-order
```

The frontend sends:

```json
{
  "shippingAddress": {
    "fullName": "Customer Name",
    "phone": "9876543210",
    "addressLine1": "123 Main Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001"
  }
}
```

The client does not send the final total.

---

## Verify Payment

```http
POST /orders/verify-payment
```

Example request:

```json
{
  "shopKartOrderId": "ORDER_ID",
  "razorpay_order_id": "RAZORPAY_ORDER_ID",
  "razorpay_payment_id": "RAZORPAY_PAYMENT_ID",
  "razorpay_signature": "RAZORPAY_SIGNATURE"
}
```

---

## Get My Orders

```http
GET /orders
```

Returns orders belonging to the authenticated customer.

---

## Get Order Details

```http
GET /orders/:id
```

The backend verifies that the requested order belongs to the authenticated customer.

---

# 🔐 Authentication & Authorization

Protected APIs use authentication middleware.

The middleware checks the authentication token stored in the cookie.

Protected resources include:

* Customer profile
* Wishlist
* Cart
* Checkout
* Orders
* Order details

Users cannot access another customer's order.

---

# 🛡️ Security Features

The project implements several security measures.

### Password Hashing

Passwords are hashed using:

```text
bcrypt
```

Passwords are never stored as plain text.

---

### JWT Authentication

JWT is used to identify authenticated customers.

---

### HTTP-Only Cookie

The authentication token is stored in an HTTP-only cookie.

This helps prevent JavaScript from directly accessing the token.

---

### Server-Side Price Calculation

The backend calculates the order amount instead of trusting the frontend.

---

### Server-Side Stock Verification

Stock is checked before creating the payment order.

---

### Razorpay Signature Verification

Payment confirmation is performed only after verifying the Razorpay signature.

---

### Ownership Verification

Customers can only view their own orders.

---

### Environment Variables

Sensitive values such as:

```text
MONGO_URI
JWT_SECRET
RAZORPAY_KEY_SECRET
```

are stored in environment variables.

---

# 📦 Shipping Validation

Checkout validates the following fields:

```text
Full Name
Phone
Address
City
State
Pincode
```

Phone number validation follows the expected Indian 10-digit format.

Example:

```text
9876543210
```

Pincode validation expects:

```text
6 digits
```

Example:

```text
560001
```

---

# 🧪 Payment Testing

The project uses Razorpay Test Mode.

Use Razorpay's test credentials and test payment methods when testing the application.

No real money should be transferred while using Test Mode.

---

# 🧪 Recommended Testing Flow

## Test 1 — Empty Cart

1. Login
2. Open Cart
3. Make sure cart is empty
4. Try accessing checkout

Expected:

```text
User should not be able to place an order with an empty cart.
```

---

## Test 2 — Successful Checkout

1. Login
2. Add product to cart
3. Open Cart
4. Click Checkout
5. Enter shipping details
6. Click Place Order & Pay
7. Razorpay checkout opens
8. Complete test payment
9. Payment is verified
10. Order is created
11. Cart is cleared
12. Order Success page appears

---

## Test 3 — Cart Before Payment

Before completing payment:

```text
Cart should still contain the products.
```

The cart must not be cleared simply because a Razorpay order was created.

---

## Test 4 — Payment Failure

If payment fails:

```text
Payment should be marked/handled as failed.
Cart should remain unchanged.
```

The customer should be able to try again.

---

## Test 5 — Fake Total

Try changing the total amount from the frontend.

Expected:

```text
Backend ignores the fake client total.
```

The actual total is calculated from MongoDB product prices.

---

## Test 6 — Insufficient Stock

Try purchasing more products than available stock.

Expected:

```text
Order/payment creation should fail.
```

---

## Test 7 — Orders

After successful payment:

```text
My Orders
    ↓
Order Details
```

should show the newly created order.

---

## Test 8 — Unauthorized Request

Call protected APIs without authentication.

Expected:

```text
401 Unauthorized
```

or the appropriate authentication error.

---

## Test 9 — Other User's Order

Try accessing another customer's order ID.

Expected:

```text
Access denied
```

The customer must only be able to access their own orders.

---

# 🧑‍💻 Application Flow

The overall application flow is:

```text
                ┌───────────────┐
                │     User      │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Register/Login│
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │    Products   │
                └───────┬───────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        ┌───────────┐       ┌───────────┐
        │ Wishlist  │       │   Cart    │
        └───────────┘       └─────┬─────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │  Checkout   │
                           └──────┬──────┘
                                  │
                                  ▼
                         ┌────────────────┐
                         │ Shipping Info  │
                         └───────┬────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │ Order Review   │
                         └───────┬────────┘
                                 │
                                 ▼
                       ┌───────────────────┐
                       │ Backend Validation│
                       └─────────┬─────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │    Razorpay    │
                         └───────┬────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │ Payment Verify │
                         └───────┬────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │  Order Placed  │
                         └───────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
             ┌─────────────┐          ┌─────────────┐
             │ Cart Cleared│          │ Order Saved │
             └─────────────┘          └──────┬──────┘
                                              │
                                              ▼
                                      ┌─────────────┐
                                      │ My Orders   │
                                      └──────┬──────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │Order Details│
                                      └─────────────┘
```

---

# 🗃️ Database

The application uses MongoDB with Mongoose.

Main entities include:

```text
Customer
Product
Wishlist
Cart
Order
```

The relationships are managed using MongoDB references and Mongoose.

---

# 🧩 Backend Architecture

The backend follows a basic MVC-style structure:

```text
Routes
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
```

Authentication is handled through middleware:

```text
Request
   ↓
Auth Middleware
   ↓
Controller
   ↓
Database
```

Utility functionality such as Razorpay initialization is kept inside:

```text
backend/utils/
```

---

# ⚛️ Frontend Architecture

The React application is organized into:

```text
Pages
Components
Context
Services
Utils
Styles
```

### Pages

Application screens such as:

```text
Cart
Checkout
My Orders
Order Details
Order Success
```

---

### Components

Reusable UI components such as:

```text
Navbar
CheckoutForm
OrderSummary
```

---

### Services

API communication is separated into service files.

For example:

```text
ProductApi.js
orderApi.js
```

Axios is used for communication with the backend.

---

### Context

Cart state is managed through:

```text
CartContext
```

---

### Utils

Utility functions include:

```text
loadRazorpay.js
validateShipping.js
```

---

# 🌍 CORS Configuration

The backend allows local frontend development origins such as:

```text
http://localhost:5173
http://localhost:5174
http://localhost:5175
```

Credentials are enabled so authentication cookies can be sent between frontend and backend.

---

# 📝 Environment Variables

Example backend environment configuration:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_test_key_id

RAZORPAY_KEY_SECRET=your_test_key_secret
```

### Never commit:

```text
.env
```

to GitHub.

---

# 🚫 Files Ignored by Git

The project `.gitignore` includes common files such as:

```text
node_modules/
.env
dist/
build/
*.log
.cache/
.vite/
.vscode/
.idea/
__pycache__/
*.pyc
```

This keeps unnecessary and sensitive files out of the repository.

---

# 🏃 Running the Complete Project

Two terminals are required.

## Terminal 1 — Backend

```powershell
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Terminal 2 — Frontend

```powershell
cd frontend/vite-project
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔄 Complete User Journey

A typical customer journey is:

```text
1. Register
        ↓
2. Login
        ↓
3. Browse Products
        ↓
4. Add Product to Wishlist
        ↓
5. Add Product to Cart
        ↓
6. Update Quantity
        ↓
7. Checkout
        ↓
8. Enter Shipping Address
        ↓
9. Review Order
        ↓
10. Backend Calculates Total
        ↓
11. Backend Checks Stock
        ↓
12. Razorpay Payment
        ↓
13. Verify Payment
        ↓
14. Create/Confirm Order
        ↓
15. Clear Cart
        ↓
16. Order Success
        ↓
17. My Orders
        ↓
18. Order Details
```

---

# 🧠 Important Implementation Decisions

## Why is the total calculated on the backend?

Because the frontend cannot be trusted.

The client can modify JavaScript requests and send a fake amount.

Therefore:

```text
Frontend → Shipping Address
Backend → Cart + Product Data → Final Total
```

---

## Why is the cart cleared only after payment verification?

If the cart were cleared before payment verification and the payment failed, the customer could lose their cart items.

Therefore:

```text
Payment Failed
    ↓
Cart Remains
```

and:

```text
Payment Verified
    ↓
Cart Cleared
```

---

## Why is the Razorpay secret stored in the backend?

The secret key must never be exposed to the browser.

The frontend receives only the public Razorpay key required for checkout.

---

## Why are product snapshots stored in orders?

Product information can change after purchase.

Order snapshots preserve the exact product information used at the time of purchase.

---

# 🎓 Lab 06 Implementation

The checkout and payment module covers:

```text
Cart
   ↓
Checkout
   ↓
Shipping
   ↓
Review
   ↓
Razorpay
   ↓
Payment Verification
   ↓
Order Creation
   ↓
Cart Clearing
   ↓
Confirmation
   ↓
My Orders
```

The implementation also handles:

* Empty cart
* Invalid shipping details
* Insufficient stock
* Payment failure
* Payment cancellation
* Server-side total calculation
* Razorpay signature verification
* Protected order APIs
* Order ownership
* Loading states
* API error handling

---

# 🐛 Error Handling

The application handles errors such as:

```text
Invalid login
Invalid registration
Duplicate email
Empty cart
Invalid shipping address
Insufficient stock
Payment failure
Payment verification failure
Unauthorized requests
Order not found
Database errors
Razorpay loading failure
```

Frontend API errors are converted into user-readable messages.

---

# 🚀 Future Improvements

Possible future improvements include:

* Admin dashboard
* Product creation/editing/deletion
* Admin order management
* Product categories
* Product search
* Product filtering
* Product reviews
* Ratings
* Coupon system
* Multiple payment methods
* Email order confirmation
* Order tracking
* Inventory management
* Delivery address management
* Responsive UI improvements
* Production deployment
* Cloud image storage

---

# 📚 Learning Outcomes

This project provides practical experience with:

* React
* React Router
* React Context
* Axios
* REST APIs
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* Cookies
* bcrypt
* Middleware
* CORS
* Environment variables
* MVC architecture
* Payment gateway integration
* Razorpay
* HMAC SHA256
* Server-side validation
* Stock management
* Order management
* Git and GitHub

---

# 🔑 Key Concepts Demonstrated

### Authentication

```text
JWT + HTTP-only Cookie
```

### Database

```text
MongoDB + Mongoose
```

### API

```text
REST API
```

### Frontend

```text
React + Vite
```

### Payment

```text
Razorpay Test Mode
```

### Security

```text
bcrypt
JWT
HTTP-only cookies
Server-side price calculation
Payment signature verification
Ownership checks
```

---

# 📌 Project Status

The ShopKart project currently includes:

* ✅ Customer Registration
* ✅ Customer Login
* ✅ Customer Logout
* ✅ Protected Customer Profile
* ✅ Product Listing
* ✅ Product Details
* ✅ Wishlist
* ✅ Shopping Cart
* ✅ Cart Quantity Management
* ✅ Checkout
* ✅ Shipping Validation
* ✅ Order Review
* ✅ Razorpay Test Mode
* ✅ Server-Side Price Calculation
* ✅ Stock Verification
* ✅ Payment Verification
* ✅ Cart Clearing After Successful Payment
* ✅ Order Creation
* ✅ Order Success Page
* ✅ My Orders
* ✅ Order Details
* ✅ Protected Order APIs
* ✅ Order Ownership Verification
* ✅ Error Handling
* ✅ Loading States
* ✅ Environment Variable Protection
* ✅ Git Configuration
* ✅ Project Documentation

---

# 👨‍💻 Author

**Angel Singh**

Computer Science Student

ShopKart MERN Lab Project

---

# 📄 Project Information

**Project:** ShopKart MERN E-Commerce Application

**Type:** Full-Stack Web Application

**Architecture:** Client–Server

**Frontend:** React + Vite

**Backend:** Node.js + Express

**Database:** MongoDB

**Payment Gateway:** Razorpay Test Mode

**Authentication:** JWT + HTTP-only Cookies

---

# ⭐ Final Project Flow

```text
React Frontend
      │
      ▼
Express REST API
      │
      ▼
Authentication Middleware
      │
      ▼
Controllers
      │
      ▼
Mongoose Models
      │
      ▼
MongoDB
```

For checkout:

```text
React Checkout
      │
      ▼
Shipping Address
      │
      ▼
Backend
      │
      ├── Fetch Cart
      ├── Fetch Latest Products
      ├── Calculate Total
      ├── Verify Stock
      ├── Create Pending Order
      │
      ▼
Razorpay
      │
      ▼
Payment
      │
      ▼
Backend Signature Verification
      │
      ├── Payment Verified
      │
      ▼
Order Confirmed
      │
      ├── Cart Cleared
      ├── Order Saved
      │
      ▼
Order Success
      │
      ▼
My Orders
      │
      ▼
Order Details
```

---

## 🎯 Conclusion

ShopKart demonstrates a complete MERN-based e-commerce workflow from **customer authentication and product browsing to cart management, checkout, secure Razorpay test payments, order creation, and order tracking**.

The project focuses on both frontend functionality and backend security, especially **server-side price calculation, stock verification, payment signature verification, protected APIs, and order ownership validation**.

This project was developed as a practical full-stack MERN application and demonstrates the complete lifecycle of an e-commerce purchase.
