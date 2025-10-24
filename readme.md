# 📝 Modern Notes App

A full-featured, secure personal notes application with modern UI and comprehensive functionality.

## ✨ Features

### 🔐 **Authentication & Security**
- Secure user registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes and middleware
- Session management

### 📝 **Notes Management**
- Create, read, update, and delete notes
- Rich text editing with title and content
- Real-time CRUD operations
- Note persistence with MySQL database

### 🔍 **Advanced Search**
- Real-time search functionality
- Instant results with debouncing
- Search highlighting in results
- Search statistics display

### 👤 **User Profile Management**
- View and edit profile information
- Change password with verification
- Account deletion with confirmation
- User statistics (notes count, member since)

### 🎨 **Modern UI/UX**
- Glassmorphic design with smooth animations
- Responsive layout for all devices
- Interactive form elements with validation
- Password visibility toggles
- Smooth transitions and hover effects
- Font Awesome icons integration

### �️ **Technical Features**
- RESTful API architecture
- CORS enabled for cross-origin requests
- Comprehensive error handling
- Input validation (client-side and server-side)
- Clean, modular code structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm

### Installation & Setup

1. **Clone or download the project**
   ```bash
   cd notes-app
   ```

2. **One-command setup** (installs all dependencies):
   ```bash
   npm run setup
   ```

3. **Configure database** (update `backend/.env` if needed):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=notes_app
   JWT_SECRET=notes-app-secret-key-2025-production
   PORT=3000
   ```

4. **Create database**:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. **Start the application**:
   ```bash
   npm start
   ```

That's it! 🎉

## 🌐 Access Your App

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3000

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start both frontend and backend servers |
| `npm run dev` | Start in development mode with auto-reload |
| `npm run setup` | Install all dependencies |
| `npm run backend` | Start only the backend server |
| `npm run frontend` | Start only the frontend server |

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Glassmorphic design
- Responsive grid layout

### Backend
- Node.js & Express.js
- JWT authentication
- bcrypt password hashing
- MySQL database
- RESTful API design

## 📁 Project Structure

```
notes-app/
├── frontend/           # Frontend files
│   ├── index.html     # Landing page
│   ├── login.html     # Login page
│   ├── register.html  # Registration page
│   ├── dashboard.html # Main app dashboard
│   ├── css/
│   │   └── styles.css # Modern styling
│   └── js/
│       └── main.js    # Frontend logic
├── backend/           # Backend API
│   ├── server.js      # Express server
│   ├── db.js         # Database connection
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   └── middleware/   # Auth middleware
├── database/
│   └── schema.sql    # Database schema
└── package.json      # Root dependencies
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
The frontend uses vanilla JavaScript and automatically reloads when you make changes.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Database Connection Issues
1. Make sure MySQL is running
2. Check your `.env` file in the `backend/` directory
3. Verify database credentials
4. Run the schema.sql file to create the database

### Dependencies Issues
```bash
# Reinstall all dependencies
npm run setup
```

## 🌟 Features Showcase

- **Modern Authentication**: Glassmorphic login/register forms with validation
- **Password Toggle**: Show/hide password with eye icon
- **Animated UI**: Smooth transitions and floating background elements
- **Note Management**: Rich note cards with timestamps and actions
- **Responsive Design**: Perfect on all device sizes
- **Error Handling**: Graceful error messages and validation

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Notes (Protected)
- `GET /notes` - Get all user notes
- `GET /notes/:id` - Get specific note
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

## 👨‍💻 Author

Built with ❤️ for learning full-stack development

---

**Happy note-taking! 📝✨**
1. Project Title
Personal Notes App – A secure web application for creating, managing, and storing personal notes.

2. Introduction / Background
In today’s fast-paced digital environment, people need an easy and secure way to record and organize their thoughts, tasks, and reminders. While many commercial note-taking apps exist, building a simple Notes App is an excellent learning project for beginner web developers.
This project focuses on creating a personal, user-friendly platform where users can register, log in, and manage their personal notes securely. It will help the developer gain practical experience in full-stack web development using modern technologies like Node.js and MySQL.

3. Objective
Develop a user-friendly web application for storing and managing personal notes.


Implement user authentication (registration and login) to protect notes.


Enable CRUD operations (Create, Read, Update, Delete) for notes.


Store data securely using MySQL database.


Provide a simple and responsive interface for desktop and mobile users.



4. Features
User Features
Registration: Users can create a new account with username, email, and password.


Login: Users can securely log in to their account.


Add Notes: Users can create new notes with a title and content.


View Notes: Users can see a list of all their notes.


Edit Notes: Users can update existing notes.


Delete Notes: Users can remove notes they no longer need.


Logout: Users can safely log out of the system.


Optional/Admin Features
View all registered users and their notes (for learning or future admin panel).



5. Technology Stack
Front-end: HTML, CSS, JavaScript


Back-end: Node.js with Express.js for server-side logic


Database: MySQL (for storing users and notes)


Local Server / Environment: Node.js + npm, XAMPP/MAMP for MySQL


Optional Libraries:


bcrypt for password hashing


express-session for session management


dotenv for environment variables


mysql2 or sequelize for MySQL integration



6. Database Design
Users Table:
Column
Type
Notes
id
INT PK AI
Primary key, auto-increment
username
VARCHAR(50)
Unique
email
VARCHAR(100)
Unique
password
VARCHAR(255)
Hashed password
created_at
TIMESTAMP
Default: current timestamp

Notes Table:
Column
Type
Notes
id
INT PK AI
Primary key, auto-increment
user_id
INT
Foreign key → users(id)
title
VARCHAR(100)
Note title
content
TEXT
Note content
created_at
TIMESTAMP
Default: current timestamp
updated_at
TIMESTAMP
Updated automatically


7. User Interface (UI)
Dashboard: Displays a list of user’s notes.


Add/Edit/Delete Buttons: For managing notes easily.


Responsive Design: Optimized for desktop and mobile screens.


Minimal Animations: Smooth experience for actions like adding or deleting notes.



8. Benefits
Secure personal note-taking platform.


Hands-on learning of full-stack web development (Node.js + MySQL).


Foundation for advanced projects like to-do apps, collaborative note platforms, or task managers.


Experience in user authentication, database operations, and responsive front-end design.



9. Workflow / Features Implementation
Server Setup: Node.js + Express handles HTTP requests.


User Authentication: Registration and login using hashed passwords. Sessions manage logged-in users.


Notes Management: Users perform CRUD operations on notes stored in MySQL.


Front-end Interaction: HTML, CSS, JS communicates with back-end via forms or AJAX.



10. Timeline
Week
Task
1
Set up Node.js environment, install dependencies, create MySQL database
2
Build user registration and login system with password hashing
3
Implement notes CRUD functionality for each user
4
Design front-end UI with responsive layout and basic CSS
5
Test all features, fix bugs, and finalize project


This proposal provides a complete roadmap for your Node.js + MySQL Notes App project.






Step-by-Step Development Plan for Notes App

Step 1: Set Up Development Environment
Goal: Prepare your computer for Node.js and MySQL development.
Tasks:
Install Node.js (includes npm).


Download Node.js and install it.


Install MySQL (or use XAMPP/MAMP which includes MySQL).


Optional: Install phpMyAdmin for visual DB management.


Install a code editor like VS Code.


Test installations:


node -v
npm -v
mysql -u root -p


Step 2: Create Database Using schema.sql
Goal: Create the database and tables.
Tasks:
Save schema.sql in the database/ folder.


Run the SQL script in MySQL:


mysql -u root -p < database/schema.sql

Verify that the database notes_app and tables users and notes are created.



Step 3: Initialize Node.js Project (Backend Setup)
Goal: Set up the backend project structure.
Tasks:
Create notes-app/backend/ folder.


Initialize Node.js:


cd backend
npm init -y

Install required packages:


npm install express mysql2 bcrypt express-session dotenv body-parser

Create folder structure:


notes-app/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── notesController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
│
├── database/
│   └── schema.sql         # SQL script to create DB and tables
│
└── README.md




Step 4: Configure Database Connection
Goal: Connect Node.js backend to MySQL.
Tasks:
Create db.js in backend:


const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected to MySQL database!');
});

module.exports = connection;

Create .env file in backend:


DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=notes_app
SESSION_SECRET=yourSecretKey


Step 5: Create Registration & Login
Goal: Allow users to register and log in securely.
Tasks:
Registration Route (auth.js)


Accept username, email, password.


Hash password using bcrypt.


Save to MySQL users table.


Login Route (auth.js)


Accept email and password.


Compare with hashed password in DB.


Start session for logged-in user.



Step 6: Create Frontend Pages
Goal: Build the user interface.
Pages:
register.html → Registration form


login.html → Login form


dashboard.html → User dashboard to show notes


add-note.html → Form to add a note


edit-note.html → Form to edit a note


Tasks:
Create frontend/ folder and subfolders css/ and js/.


Style the pages with CSS and add interactivity with JS.



Step 7: Implement Notes CRUD
Goal: Allow logged-in users to manage their notes.
Tasks:
Create Note → Save new note to MySQL notes table.


Read Notes → Fetch all notes for the logged-in user.


Update Note → Edit a note and update DB.


Delete Note → Remove note from DB.


Protect all routes using session middleware.



Step 8: Test & Debug
Goal: Ensure everything works correctly.
Tasks:
Test user registration and login.


Test creating, editing, deleting, and viewing notes.


Verify session management.


Check responsive design on mobile and desktop.



Step 9: Optional Enhancements
“Remember Me” login


Password reset via email


Notes search and categorization


Rich-text editor for notes content


Export notes as PDF



