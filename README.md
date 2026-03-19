# 🍽️ Restaurant Reservation & Management System

A full-stack web application for managing restaurant reservations, tables, menu, and orders.

Built with **Django (REST API)** and **React (Vite + Tailwind CSS)**.

---

## 📌 Features

### 👤 User Management

- Register and login with email
- JWT authentication
- Role-based access (customer, staff, admin)

### 📅 Reservations

- Create and manage table reservations
- Select table from visual layout (planned)
- Reservation statuses: pending, confirmed, cancelled, completed

### 🍔 Menu

- Browse menu by categories
- View item details (name, description, price, availability)
- Admin can manage menu items and categories

### 🧾 Orders

- Create orders linked to reservations
- Support for walk-in customers
- Multiple items per order
- Order status tracking

### 📊 Analytics (planned)

- Sales statistics
- Most popular dishes
- Daily / weekly reports

---

## 🏗️ Architecture

- Frontend: React + Tailwind CSS
- Backend: Django REST Framework
- Database: PostgreSQL

---

## 🛠️ Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- JWT Authentication
- PostgreSQL

### Frontend

- React (Vite)
- React Router
- Axios
- Tailwind CSS

---

## 📂 Project Structure

backend/
├── api/
├── backend/
├── manage.py
├── requirements.txt

frontend/
├── src/
├── public/
├── package.json
├── vite.config.js

---

## ⚙️ Setup Instructions

### Backend

cd backend
python -m venv .venv
.venv\Scripts\activate (Windows)

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

---

### Frontend

cd frontend
npm install
npm run dev

---

## 🔐 Environment Variables

Example (.env):

SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

---

## 🔒 Security

- JWT authentication
- Password hashing
- Role-based authorization
- Input validation
- CSRF & XSS protection

---

## 🚀 Deployment (planned)

- Frontend → Vercel
- Backend → Render / Railway
- Database → PostgreSQL

---

## 🎯 Goals

- Full-stack development
- REST API design
- Database modeling
- Authentication & security
- UI with Tailwind CSS

---

## 👤 Author

Jouni Seppänen

---

## 📄 License

Educational project
