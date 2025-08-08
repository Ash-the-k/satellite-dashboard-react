# Satellite Dashboard
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![Flask](https://img.shields.io/badge/Flask-2.x-black)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange)
![Three.js](https://img.shields.io/badge/Three.js-0.178.0-orange)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5.0-red)
![SQLite](https://img.shields.io/badge/SQLite-database-blue)

A full-stack web application for visualizing and monitoring satellite telemetry data with **Firebase Authentication** and **real-time user management**.

## Key Features

- **Secure Authentication**: Email/password login with Firebase Auth
- **User Management**: Role-based access control (user, admin, superadmin)
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **User Dashboard**: Personalized experience based on user role
- **Real-time Updates**: Live authentication state management
- **Dark/Light Theme**: Persistent theme preferences per user

## Project Structure

- **backend/**: Flask API for telemetry and gyro data
- **frontend/**: React dashboard with Firebase Auth integration
- **frontend/FIREBASE_SETUP.md**: Detailed Firebase setup guide

---

## Quick Start

### 1. Firebase Setup

**Required**: Set up Firebase Authentication and Firestore Database

1. Follow the detailed guide in [`frontend/FIREBASE_SETUP.md`](frontend/FIREBASE_SETUP.md)
2. Create a Firebase project and enable Authentication + Firestore
3. Configure your Firebase credentials

### 2. Environment Variables

#### Backend Setup
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
- `SERVER_BASE_URL`: (Optional) Base URL for simulators (defaults to localhost:5000)

#### Frontend Setup
Create `frontend/.env` with your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
npm install
```

### 4. Start the Application

#### Start Backend
```bash
cd backend
python app.py
```
- API available at `http://localhost:5000`

#### Start Frontend
```bash
cd frontend
npm start
```
- App available at `http://localhost:3000`

### 5. Data Simulation
If you don't have a real device, you can simulate data immediately from the backend folder (both scripts read `SERVER_BASE_URL` from env or `.env`):

- Arduino-style LoRa payloads → posts to `/data`:
  ```bash
  cd backend
  export SERVER_BASE_URL="http://localhost:5000"  # optional; defaults to localhost
  python ard.py
  ```

- Raspberry Pi/WiFi JSON payloads (temp/humidity/GPS) → posts to `/upload`:
  ```bash
  cd backend
  export SERVER_BASE_URL="http://localhost:5000"  # optional; defaults to localhost
  python rasp.py
  ```

Both scripts retry with a localhost fallback and print helpful logs.

---

## Authentication System

### Role-based Access: Current Scope
- Enforced on the client (React) via Firebase user `role` stored in Firestore
  - UI elements (e.g., `Users` nav) are hidden for non-superadmins
  - The `/users` route is only registered when `role === 'superadmin'`
- Backend endpoints currently do not enforce Firebase roles
  - Future work: Server-side authorization based on Firebase ID tokens and roles

### User Roles
- **User**: Basic access to dashboard and telemetry data
- **Admin**: User management (future server-side enforcement)
- **Superadmin**: Full access in the UI, including user management page

### First Time Setup
1. Start the application
2. Navigate to the login page
3. Click "Don't have an account? Sign up"
4. Create your first account
5. **Important**: Manually update the user role to "superadmin" in Firebase Console (Firestore `users/{uid}.role`)

### Authentication Flow
- Users must authenticate to access the dashboard
- Session persistence across browser refreshes
- Protected routes with redirect to login

---

## Backend API

### Data Endpoints
- `/data` — Accepts LoRa-style string payloads (e.g., pressure + gyro) from Arduino simulator (`ard.py`)
- `/upload` — Accepts JSON payloads (temperature, humidity, latitude, longitude) from Raspberry Pi simulator (`rasp.py`)
- `/api/telemetry` — Returns latest combined telemetry snapshot
- `/api/logs` — Returns recent logs (includes `source` field)
- `/api/gyro` — Returns latest gyro values

### Example: Send Telemetry Data (LoRa/Arduino)
```bash
curl -X POST http://localhost:5000/data \
  -H "Content-Type: application/json" \
  -d '{
    "data": "T:25.00C, P:1013.25hPa, AX:0.01, AY:-0.02, AZ:0.98, GX:12.34, GY:-56.78, GZ:90.12, MX:0.12, MY:-0.34, MZ:0.56"
  }'
```

### Example: Send Telemetry Data (Raspberry Pi/WiFi JSON)
```bash
curl -X POST http://localhost:5000/upload \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 24.5,
    "humidity": 58.2,
    "latitude": 12.975321,
    "longitude": 77.591234,
    "timestamp": "2025-08-07T14:15:22Z"
  }'
```

---

## Frontend Features

### Authentication Pages
- **Login Page**: Email/password authentication with sign-up option
- **Protected Dashboard**: Only accessible to authenticated users
- **User Profile**: Display user information and role

### Dashboard Components
- **Real-time Telemetry**: Live charts and data visualization
- **3D CubeSat Model**: Three.js visualization with live orientation
- **Interactive Map**: Leaflet map showing satellite location
- **Data Logs**: Historical telemetry data in table format
- **Theme Toggle**: Dark/light mode with persistent preferences

### User Management (Superadmin)
- View all registered users (Firestore `users` collection)
- Update user roles (writes to Firestore)
- Soft-delete users (marks document; does not remove Firebase Auth user)

---

## Simulating Telemetry Data

Use either simulator from `backend/`:

- `ard.py` (LoRa/Arduino-style string payload → `/data`)
  ```bash
  cd backend
  export SERVER_BASE_URL="http://localhost:5000"
  python ard.py
  ```

- `rasp.py` (Raspberry Pi/WiFi JSON payload → `/upload`)
  ```bash
  cd backend
  export SERVER_BASE_URL="http://localhost:5000"
  python rasp.py
  ```

Both scripts:
- Print target and fallback servers
- Retry with localhost fallback when needed
- Accept `.env` or environment variable configuration

---

## Development

### Key Technologies
- **Frontend**: React 19, Firebase Auth, Three.js, Chart.js, Leaflet
- **Backend**: Flask, SQLite, Python 3.10
- **Authentication**: Firebase Authentication + Firestore (client-side role gating)
- **Styling**: Styled Components with theme support

### File Structure
```
frontend/src/
├── components/     # Reusable UI components
├── context/        # React contexts (Auth, Theme)
├── pages/          # Page components
├── config/         # Configuration files
├── services/       # API services
└── styles/         # Global styles and themes
```

### Environment Variables
- `REACT_APP_FIREBASE_*`: Firebase configuration
- `REACT_APP_API_URL`: Backend API URL
- `NODE_ENV`: Environment mode
- `SERVER_BASE_URL` (backend sims): Base URL for `ard.py`/`rasp.py` (defaults to localhost)

---

## Troubleshooting

### Firebase Issues
- **Auth errors**: Check Firebase Console > Authentication > Sign-in methods
- **Firestore errors**: Verify security rules and database exists
- **CORS errors**: Check Firebase project settings and allowed domains

### Development Issues
- **Port conflicts**: Change ports in package.json or use different ports
- **Build errors**: Clear node_modules and reinstall dependencies
- **Auth state issues**: Use `clear-auth.js` script in browser console

### Common Commands
```bash
# Clear authentication data
node frontend/clear-auth.js

# Reset database
rm backend/telemetry.db

# Clear build cache
rm -rf frontend/build
```

---

## Screenshots

### Authentication
Secure login with Firebase Auth
![Login](frontend/public/images/login.png)

### Dashboard
Real-time telemetry with user authentication
![Dashboard](frontend/public/images/dashboard.png)

### 3D Visualization
Interactive CubeSat model with live data
![Orientation](frontend/public/images/orientation.png)

### Data Logs
Historical telemetry in organized table
![Logs](frontend/public/images/logs.png)

---

## Additional Resources

- [Firebase Setup Guide](frontend/FIREBASE_SETUP.md) - Detailed Firebase configuration
- [Firebase Documentation](https://firebase.google.com/docs) - Official Firebase docs
- [React Documentation](https://react.dev/) - React framework docs

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 