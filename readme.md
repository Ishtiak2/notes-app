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

## � Deployment

### Deploy to Production (Free!)

This app is ready to deploy using free hosting services:

**Recommended Stack:**
- **Backend + Database**: [Railway.app](https://railway.app) (Free $5/month credit)
- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (Free unlimited)

📘 **[Complete Deployment Guide](./DEPLOYMENT.md)** - Step-by-step instructions for:
- Railway (Backend) + Vercel (Frontend) ⭐ Recommended
- Render.com (Full-stack alternative)
- Netlify (Frontend alternative)
- Environment variable setup
- Database configuration
- Troubleshooting tips

**Quick Deploy:**
1. Push code to GitHub
2. Connect Railway to your repo → Deploy backend
3. Add MySQL database in Railway
4. Connect Vercel to your repo → Deploy frontend
5. Update environment variables
6. You're live! 🎉

## �🐛 Troubleshooting

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

**Ishtiak Rahman**
**(SWE-22, SUST)**
