# 🍽️ Restaurant Reservation & Management System

A full-stack restaurant management system built with modern web technologies.

The application allows customers to browse menus and make reservations, while staff and administrators manage tables, menu items, users, and orders through dedicated dashboards.

---

## 🚀 Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- React Router
- Axios
- i18next (EN / FI)

### Backend

- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication (SimpleJWT)

---

## ✨ Features

### 👤 Authentication

- User registration & login
- JWT authentication (access + refresh tokens)
- Role-based access (customer / staff / admin)

### 🍽️ Menu

- Browse menu items by category
- Multi-language support (EN / FI)
- Admin management for categories & items

### 📅 Reservations

- Create table reservations
- Automatic table filtering based on party size
- Time-slot availability validation

### 🪑 Tables

- Table management (admin)
- Seat-based filtering for reservations

### 📦 Orders

- Staff can create and manage orders
- Orders linked to reservations or tables
- Walk-in order support

### 🛠️ Dashboards

Admin dashboard

- Manage users, menu, tables
- View sales statistics

Staff dashboard

- Manage reservations
- Create and update orders

User dashboard

- View personal reservations and orders
- Manage profile

---

## 🧱 Project Structure

```
restaurant-app/
│
├── backend/
│ ├── api/
│ │ ├── locale/
│ │ ├── models/
│ │ ├── serializers/
│ │ ├── tests/
│ │ ├── views/
│ │ ├── permissions.py
│ │ └── urls.py
│ ├── config/
│ ├── .env.example
│ ├── manage.py
│ └── requirements.txt
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── features/
│ │ │ ├── auth/
│ │ │ ├── reservations/
│ │ │ ├── menu/
│ │ │ ├── admin/
│ │ │ ├── staff/
│ │ │ └── user/
│ │ ├── layouts/
│ │ ├── locales/
│ │ ├── pages/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── api.js
│ │ ├── App.jsx
│ │ ├── constants.js
│ │ ├── i18n.js
│ │ └── main.jsx
│ ├── tests/
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ ├── playwright.config.js
│ └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```
git clone https://github.com/joedelord/restaurant-app.git
cd restaurant-app
```

---

### 2. Backend setup

```
cd backend
python -m venv venv
source venv/bin/activate   # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

cp ../.env.example .env

```
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

DB_NAME=restaurant_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=your_jwt_secret

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Run migrations:

```
python manage.py migrate
python manage.py runserver
```

---

### 3. Frontend setup

```
cd frontend
npm install
npm run dev
```

Create `.env` file:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 🔐 API Overview

### Auth

- `POST /api/token/` → login
- `POST /api/token/refresh/` → refresh token
- `POST /api/users/login/`

### Users

- `POST /api/users/register/`
- `GET /api/users/me/`

### Menu

- `GET /api/categories/`
- `GET /api/menu-items/`

### Reservations

- `POST /api/reservations/`
- `GET /api/reservations/`
- `GET /api/reservations/availability/`

### Orders

- `POST /api/orders/create/`
- `GET /api/orders/`

### Tables

- `GET /api/tables/`

---

## 🧪 Testing

### Backend

Tests are organized per feature: `backend/api/tests/`.

Run all tests:

```
python manage.py test
```

### Frontend

Tests are organized per feature: `frontend/tests/`.

Run all tests:

```
npx playwright test
```

---

## 🌍 Internationalization

- Frontend: i18next (EN / FI)
- Backend: Django i18n (gettext)
- Language is controlled via Accept-Language header

---

## 🗺️ Roadmap

### ✅ Implemented

- JWT authentication
- Role-based access
- Reservation system with availability logic
- Admin / Staff / User dashboards
- Multi-language support

### 🚧 In Progress

- UI/UX refinements
- Admin sales dashboard improvements

### 🔮 Planned

- Analytics dashboard
- Visual table layout editor
- Email notifications
- Real-time updates (WebSockets)

---

## 💡 Future Improvements

- Component reusability
- Performance optimizations

---

## 👨‍💻 Author

Jouni Seppänen

GitHub: https://github.com/joedelord

---

## 📄 License

This project is for educational and portfolio purposes.

---
