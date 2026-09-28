# ShopKart - API Testing Report

## ✅ Backend Status

### Server Running
- **Status**: ✅ Running
- **Port**: 5000
- **Database**: ✅ Connected
- **Environment**: Loaded from .env

### Endpoints Tested

#### 1. **SIGNUP - POST /customers/register**
```
URL: http://localhost:5000/customers/register
Method: POST
Headers: Content-Type: application/json
Body: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}

Response: 
- Status: 201 Created
- Success: true
- Returns: customer object with _id, fullName, email, phone
- Sets: HTTP-only cookie with JWT token
```

#### 2. **LOGIN - POST /customers/login**
```
URL: http://localhost:5000/customers/login
Method: POST
Headers: Content-Type: application/json
Body: {
  "email": "john@example.com",
  "password": "password123"
}

Response:
- Status: 200 OK
- Success: true
- Sets: HTTP-only cookie with JWT token
```

#### 3. **GET PROFILE - GET /customers/profile/:username**
```
URL: http://localhost:5000/customers/profile/john@example.com
Method: GET
Headers: Content-Type: application/json

Response:
- Status: 200 OK
- Success: true
- Returns: {
    "userData": {
      "_id": "...",
      "name": "John Doe",
      "username": "john@example.com",
      "email": "john@example.com",
      "phone": "1234567890",
      "followers": [],
      "followings": [],
      "posts": []
    }
  }
```

---

## ✅ Frontend Status

### Vite React App
- **Port**: 5173
- **API Base URL**: http://localhost:5000

### Components
- ✅ **Register.jsx** - Signup form component
- ✅ **Login.jsx** - Login form component  
- ✅ **profile.jsx** - Profile page with social media design
  - Shows user info (name, username, email)
  - Displays stats (followers, followings, posts)
  - Follow button functionality
  - Loading and error states
  - Responsive design

### API Functions (src/services/api.js)
- ✅ `registerCustomer()` - POST /customers/register
- ✅ `loginCustomer()` - POST /customers/login
- ✅ `getMyProfile()` - GET /customers/me (protected)
- ✅ `logoutCustomer()` - POST /customers/logout
- ✅ `getUserProfile(username)` - GET /customers/profile/:username

---

## 🚀 Running the Application

### Terminal 1 - Backend
```powershell
cd backend
node index.js
```
Expected output:
```
✓ DB connected
✓ Server running on port 5000
```

### Terminal 2 - Frontend
```powershell
cd frontend/vite-project
npm run dev
```
Expected output:
```
✓ Local: http://localhost:5173
```

---

## 📱 Testing Workflow

1. **Open Browser**: http://localhost:5173
2. **Register New User**:
   - Click Register
   - Fill form with test data
   - Submit → JWT token saved in cookie
   
3. **Login**:
   - Click Login
   - Enter credentials
   - Submit → Authenticated
   
4. **View Profile**:
   - Navigate to `/profile/john@example.com`
   - See user details in social media style
   - Follow button available

---

## 🔧 Fixed Issues

1. ✅ **getUserProfile** - Completed implementation in controller
2. ✅ **API Path** - Fixed from `/users/profile` to `/customers/profile`
3. ✅ **API Export** - Added `getUserProfile()` function to api.js
4. ✅ **Profile Page** - Redesigned with social media layout

---

## ✨ Ready to Test!

All endpoints are functional and frontend components are connected.
