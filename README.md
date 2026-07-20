# FoodShare

Connecting surplus food from restaurants to people in need through delivery partners.

![FoodShare Banner](https://via.placeholder.com/1200x300?text=FoodShare+-+Food+Donation+Platform)

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [How to Use](#how-to-use)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)
- [License](#license)

---

## 🎯 Problem Statement

Every year, millions of tons of food are wasted globally while millions of people go hungry. In India alone:
- **40% of food is wasted** in the supply chain
- **195 million people** live in poverty
- Restaurants and cafes discard **tons of edible food daily**

**FoodShare** solves this critical problem by creating a bridge between food surplus and food insecurity.

---

## 💡 Solution Overview

FoodShare is a full-stack web platform that:

1. **Connects Donors** (Restaurants, Cafes, Event Organizers) who have leftover food
2. **Engages Delivery Partners** (Volunteers/Gig Workers) to collect and transport food
3. **Serves Recipients** (NGOs, Community Centers, Needy Individuals) who need food assistance

**The Flow:**
```
Restaurant posts leftover food 
    ↓
Delivery Partner claims & collects it
    ↓
Food delivered to NGO/People in need
    ↓
System tracks status & builds reputation
```

---

## ✨ Features

### Core Features ✅

#### 1. **User Authentication & Roles**
- Register and login for 3 user types: Donor, Delivery Partner, NGO
- JWT-based secure authentication
- Password hashing with bcrypt
- Profile management
- Role-based dashboards

#### 2. **Food Listing Management**
- Donors can post leftover food with:
  - Food type, quantity, description
  - Photo upload via API
  - Expiry time
  - Real-time status updates
- View all available food listings
- Search and filter by food type
- Sort by recent
- Edit and delete own listings

#### 3. **Claim & Delivery System**
- Delivery partners can claim available food
- Track claimed deliveries
- Mark deliveries as completed
- View delivery history
- Simple status workflow (available → claimed → delivered)

#### 4. **User Profiles & Ratings**
- View user information and statistics
- Track delivery history
- Rating system (1-5 stars)
- Donor reputation score
- User activity dashboard

#### 5. **Search & Discovery**
- Search food by type (rice, bread, sweets, proteins, etc.)
- Filter by donor
- Sort by newest listings
- Quick status visibility (available/claimed/delivered)
- Easy-to-use interface

#### 6. **Responsive Design**
- Clean, intuitive UI with Tailwind CSS
- Mobile-friendly interface
- Real-time status updates
- Error handling and loading states
- Smooth user experience

---

## 🛠 Tech Stack

### Frontend
```
React.js            - UI library
Tailwind CSS        - Styling
Axios               - HTTP client
React Router        - Navigation
LocalStorage        - Client-side storage
```

### Backend
```
Node.js             - Runtime
Express.js          - Framework
MongoDB             - Database
Mongoose            - ODM
JWT                 - Authentication
Bcryptjs            - Password hashing
CORS                - Cross-origin resource sharing
```

### Deployment
```
Frontend: Vercel / GitHub Pages
Backend: Render / Railway
Database: MongoDB Atlas
```

---

## 📁 Project Structure

```
foodshare-platform/
│
├── client/                          # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FoodListings.jsx
│   │   │   ├── CreateFood.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── server/                          # Backend (Node/Express)
│   ├── models/
│   │   ├── User.js
│   │   ├── FoodListing.js
│   │   └── Delivery.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── deliveryRoutes.js
│   │   └── userRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── deliveryController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── .env (local only)
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/foodshare-platform.git
cd foodshare-platform/server
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure MongoDB**
   - Use local MongoDB OR
   - Create account on MongoDB Atlas and get connection string

4. **Start the server**
```bash
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Navigate to client directory**
```bash
cd ../client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
# App runs on http://localhost:3000
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "9876543210",
  "role": "donor" | "partner" | "ngo"
}

Response: { token, user }
```

#### Login User
```
POST /api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: { token, user }
```

---

### Food Listing Endpoints

#### Create Food Listing
```
POST /api/food
Header: Authorization: Bearer <token>

Body:
{
  "foodType": "rice",
  "quantity": 50,
  "description": "Leftover biryani from event",
  "image": "image_url_from_api",
  "expiryTime": "2024-01-20T18:00:00Z"
}

Response: { _id, donorId, foodType, quantity, ... }
```

#### Get All Foods
```
GET /api/food

Response: [{ _id, donorId, foodType, quantity, status, ... }]
```

#### Get Single Food
```
GET /api/food/:id

Response: { _id, donorId, foodType, quantity, ... }
```

#### Update Food Listing
```
PUT /api/food/:id
Header: Authorization: Bearer <token>

Body: { foodType, quantity, description, image, ... }

Response: { updated food object }
```

#### Delete Food Listing
```
DELETE /api/food/:id
Header: Authorization: Bearer <token>

Response: { message: "Food listing deleted" }
```

#### Claim Food
```
PUT /api/food/:id/claim
Header: Authorization: Bearer <token>

Response: { _id, status: "claimed", claimedBy: partnerId }
```

---

### Delivery Endpoints

#### Create Delivery Request
```
POST /api/delivery
Header: Authorization: Bearer <token>

Body:
{
  "foodListingId": "food_id",
  "ngoId": "ngo_id"
}

Response: { _id, foodListingId, status: "pending", ... }
```

#### Get All Deliveries
```
GET /api/delivery
Header: Authorization: Bearer <token>

Response: [{ _id, foodListingId, status, ... }]
```

#### Mark Delivery as Completed
```
PUT /api/delivery/:id/complete
Header: Authorization: Bearer <token>

Response: { _id, status: "completed", completedAt }
```

#### Rate Delivery
```
PUT /api/delivery/:id/rate
Header: Authorization: Bearer <token>

Body:
{
  "rating": 5,
  "feedback": "Great service!"
}

Response: { _id, rating, feedback }
```

---

### User Endpoints

#### Get User Profile
```
GET /api/users/profile
Header: Authorization: Bearer <token>

Response: { _id, name, email, role, rating, totalDeliveries, ... }
```

#### Update User Profile
```
PUT /api/users/profile
Header: Authorization: Bearer <token>

Body: { name, phone, profileImage, ... }

Response: { updated user object }
```

#### Get User by ID
```
GET /api/users/:id

Response: { _id, name, email, role, rating, ... }
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: "donor" | "partner" | "ngo",
  profileImage: String (URL),
  rating: Number (0-5),
  totalDeliveries: Number,
  createdAt: Date
}
```

### FoodListing Model
```javascript
{
  _id: ObjectId,
  donorId: ObjectId (ref: User),
  foodType: String,
  quantity: Number,
  description: String,
  image: String (URL),
  status: "available" | "claimed" | "delivered",
  claimedBy: ObjectId (ref: User),
  expiryTime: Date,
  createdAt: Date
}
```

### Delivery Model
```javascript
{
  _id: ObjectId,
  foodListingId: ObjectId (ref: FoodListing),
  partnerId: ObjectId (ref: User),
  ngoId: ObjectId (ref: User),
  status: "pending" | "completed",
  rating: Number,
  feedback: String,
  createdAt: Date,
  completedAt: Date
}
```

---

## 📖 How to Use

### For Donors (Restaurants/Cafes)

1. **Register as Donor**
   - Go to Register page
   - Fill details and select "Donor" role

2. **Post Food Listing**
   - Click "Create Food"
   - Fill food details (type, quantity, expiry)
   - Upload photo
   - Click "Post"

3. **Track Donations**
   - View all your posted foods in Dashboard
   - See which ones are claimed
   - View ratings from delivery partners

### For Delivery Partners

1. **Register as Partner**
   - Go to Register page
   - Select "Delivery Partner" role

2. **Browse Available Food**
   - Go to "Food Listings"
   - See all available donations
   - Search by food type

3. **Claim & Deliver**
   - Click "Claim Food"
   - Collect food from donor
   - Deliver to NGO
   - Mark as "Completed"

4. **Build Reputation**
   - Get rated by donors/NGOs
   - Track delivery history
   - Improve profile rating

### For NGOs/Recipients

1. **Register as NGO**
   - Go to Register page
   - Select "NGO" role

2. **Receive Food**
   - Delivery partners bring claimed food
   - Accept delivery
   - Track received items

3. **Provide Feedback**
   - Rate delivery partners
   - Provide feedback on quality

---

## 📸 Screenshots

### Login Page
```
[Screenshot placeholder]
Clean login interface with role selection
```

### Food Listings Page
```
[Screenshot placeholder]
Grid view of available food with search/filter
```

### Create Food Form
```
[Screenshot placeholder]
Form to post new food listing
```

### User Profile
```
[Screenshot placeholder]
Profile stats, rating, delivery history
```

### Dashboard
```
[Screenshot placeholder]
Role-specific dashboard with quick actions
```

---

## 🚀 Future Enhancements

### Phase 2 Features
- [ ] Real-time location tracking (Socket.io)
- [ ] Advanced filtering and search
- [ ] Analytics dashboard for donors & partners
- [ ] Email notifications
- [ ] SMS alerts for urgent donations
- [ ] Gamification (badges, leaderboards)
- [ ] Mobile app (React Native)

### Phase 3 Features
- [ ] Payment integration for premium features
- [ ] Government partnerships
- [ ] Environmental impact tracking
- [ ] Community features (forums, groups)
- [ ] Multiple language support
- [ ] Advanced reporting for NGOs

---

## 🤝 Contributing

We welcome contributions! Here's how to contribute:

1. **Fork the repository**
```bash
git clone https://github.com/your-username/foodshare-platform.git
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Commit your changes**
```bash
git commit -m "Add your commit message"
```

4. **Push to the branch**
```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request**

---

## 👥 Contributors

- **Developed by**: [Your Name]
- **Project**: FoodShare - Full Stack MERN Application
- **Institution**: [Your College/School Name]

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For issues, questions, or suggestions:

- **Email**: your.email@example.com
- **GitHub Issues**: [Open an issue](https://github.com/your-username/foodshare-platform/issues)
- **LinkedIn**: [Your LinkedIn Profile]

---

## 🙏 Acknowledgments

- Thanks to all contributors and users of FoodShare
- Inspiration from social causes and food donation platforms
- Special thanks to educators and mentors

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **User Roles** | 3 (Donor, Partner, NGO) |
| **API Endpoints** | 15+ |
| **Database Models** | 3 |
| **Frontend Pages** | 6 |
| **Frontend Components** | 8+ |
| **Authentication** | JWT-based |
| **Tech Stack** | MERN |

---

## 🎯 Project Goals

✅ Reduce food waste  
✅ Combat hunger  
✅ Build community connections  
✅ Create transparent donation system  
✅ Empower delivery partners  
✅ Support NGOs & social organizations  

---

## 🌟 Key Highlights

- **Simple & Intuitive**: Easy to use for all user types
- **Secure**: JWT-based authentication with password hashing
- **Scalable**: Can handle multiple users and donations
- **Real-time Updates**: Instant status changes and notifications
- **Social Impact**: Direct contribution to reducing food waste
- **Open Source**: Community-driven development

---

**Made with ❤️ to reduce food waste and feed people in need.**

---

### Quick Links
- [GitHub Repository](#)
- [Live Demo](#)
- [Report Bug](#)
- [Request Feature](#)

---

**Last Updated**: January 2024  
**Version**: 1.0.0 (MVP)
