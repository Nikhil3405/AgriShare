# 🚜 AgriShare

> **A Full-Stack Agricultural Equipment Rental Marketplace**

AgriShare is a modern web platform that enables farmers to rent agricultural equipment directly from equipment owners. The platform streamlines the complete rental lifecycle—from equipment listing and booking to approvals, equipment handover, returns, reviews, and analytics—making farm equipment more accessible and reducing ownership costs.

---

## ✨ Features

### 👤 User Authentication

* JWT-based authentication
* Secure user registration and login
* Profile management
* Password update
* Role-based authorization for equipment owners and farmers

### 🚜 Equipment Management

* Create, update, and delete equipment listings
* Upload multiple equipment images
* Cloudinary image storage
* Equipment categories
* Equipment condition tracking
* Google Maps location picker
* Equipment availability management

### 📅 Booking System

* Equipment booking with date and time selection
* Booking approval and rejection
* Equipment handover workflow
* Return request and confirmation
* Automatic rental cost calculation
* Booking history

### ⭐ Reviews & Ratings

* Equipment reviews after completed rentals
* 5-star rating system
* Average rating calculation
* Review history

### 🔔 Notifications

* Booking request notifications
* Approval and rejection notifications
* Equipment return notifications
* Real-time notification center

### 📊 Dashboard & Analytics

* Owner dashboard
* Farmer dashboard
* Monthly earnings
* Monthly spending
* Active rentals
* Completed rentals
* Booking statistics

### 📍 Maps Integration

* Google Maps API integration
* Equipment location display
* Interactive location selection
* Address autocomplete

---

# 🛠 Tech Stack

## Frontend

* React.js
* React Router
* Tailwind CSS
* Axios
* React Google Maps API
* Lucide React

## Backend

* Django
* Django REST Framework
* JWT Authentication
* PostgreSQL
* Cloudinary

## Database

* PostgreSQL (Neon)

## Cloud & Deployment

* Cloudinary
* Render
* Vercel

---

# 📂 Project Structure

```
AgriShare/
│
├── backend/
│   ├── users/
│   ├── equipment/
│   ├── bookings/
│   ├── reviews/
│   ├── notifications/
│   ├── dashboard/
│   └── backend/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── assets/
│
└── README.md
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/yourusername/AgriShare.git
cd AgriShare
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
SECRET_KEY=your_secret_key

DATABASE_URL=your_neon_database_url

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Run migrations:

```bash
python manage.py migrate
```

Start the backend:

```bash
python manage.py runserver
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔄 Booking Workflow

```
Farmer
   │
   ▼
Browse Equipment
   │
   ▼
Create Booking Request
   │
   ▼
Owner Approves / Rejects
   │
   ▼
Equipment Handed Over
   │
   ▼
Equipment In Use
   │
   ▼
Farmer Requests Return
   │
   ▼
Owner Confirms Return
   │
   ▼
Booking Completed
   │
   ▼
Review & Rating
```

---

# 📸 Screenshots

> Add screenshots of:

* Home Page
* Equipment Listings
* Equipment Details
* Booking Page
* Owner Dashboard
* Farmer Dashboard
* Analytics
* Reviews
* Profile Page

---

# 🚀 Future Improvements

* Online payment integration
* AI-powered equipment recommendations
* Chat between farmers and owners
* Equipment availability calendar
* Rental agreements and invoices
* SMS and email notifications
* Mobile application
* Multi-language support

---

# 📚 Learning Outcomes

Through this project, I gained hands-on experience with:

* Full-stack web development
* REST API design
* JWT authentication and authorization
* PostgreSQL database design
* Cloud image storage using Cloudinary
* Google Maps API integration
* Role-based workflows
* Responsive UI development
* Production deployment using Render and Vercel

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Nikhil N Achar**

* GitHub: https://github.com/Nikhil3405
* LinkedIn: https://www.linkedin.com/in/nikhil-n-3a892a2b4
* Email: [nikhiln432005@gmail.com](mailto:nikhiln432005@gmail.com)

If you found this project useful, consider giving it a ⭐ on GitHub!
