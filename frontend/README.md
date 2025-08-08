# Satellite Dashboard Frontend

A React-based dashboard for satellite telemetry and monitoring with Firebase authentication.

## Features

- 🔐 **Firebase Authentication** - Secure user authentication with email/password
- 🌙 **Dark/Light Theme** - Toggle between themes
- 📊 **Real-time Telemetry** - Live satellite data visualization
- 🎯 **Gyro Visualization** - 3D orientation tracking
- 📝 **Logs Management** - System logs and monitoring
- 👥 **User Management** - Role-based access control (Superadmin only)
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **React 19** - Modern React with hooks
- **Firebase** - Authentication and Firestore database
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project (see setup guide)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd satellite-dashboard-react/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Update `src/config/firebase.js` with your Firebase configuration

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Sign up for a new account or sign in

### No Device? Use the Built-in Simulators
If you don't have a real device, simulate data from the `backend/` directory:

- Arduino-style LoRa payloads → posts to `/data`:
  ```bash
  cd ../backend
  export SERVER_BASE_URL="http://localhost:5000"  # optional; defaults to localhost
  python ard.py
  ```

- Raspberry Pi/WiFi JSON payloads (temp/humidity/GPS) → posts to `/upload`:
  ```bash
  cd ../backend
  export SERVER_BASE_URL="http://localhost:5000"  # optional; defaults to localhost
  python rasp.py
  ```

Both scripts print helpful logs and retry with a localhost fallback.

## Firebase Configuration

The app uses Firebase for:
- **Authentication** - User sign in/sign up
- **Firestore** - User data and roles storage

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_URL=http://localhost:5000/api
```

## Role-based Access (Current Scope)

- Enforced on the client via Firestore `users/{uid}.role`
  - The `Users` navigation and `/users` route appear only when `role === 'superadmin'`
- Backend endpoints do not yet enforce Firebase roles
  - Future work: server-side authorization using Firebase ID tokens

## User Roles

- **User** - Basic access to telemetry and logs
- **Admin** - Reserved for future server-side enforcement
- **Superadmin** - Full access including user management

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
│   ├── firebase.js     # Firebase configuration
│   └── config.js       # App configuration
├── context/            # React context providers
│   ├── AuthContext.jsx # Firebase authentication
│   └── ThemeContext.jsx # Theme management
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── LoginPage.jsx   # Authentication page
│   ├── TelemetryPage.jsx # Main dashboard
│   ├── GyroPage.jsx    # Orientation visualization
│   ├── LogsPage.jsx    # System logs
│   └── UserManagementPage.jsx # User management
├── services/           # API services
│   └── api.js         # HTTP client configuration
└── styles/             # Global styles and themes
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Backend Integration

The frontend expects a backend API running on `http://localhost:5000` with these endpoints:

- `GET /api/telemetry` - Satellite telemetry data
- `GET /api/logs` - System logs
- `GET /api/gyro` - Gyroscope data
- `POST /data` - LoRa (Arduino-style) simulator ingestion
- `POST /upload` - Raspberry Pi/WiFi JSON simulator ingestion

## Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Other Platforms

The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check your Firebase configuration in `src/config/firebase.js`
   - Verify environment variables are set correctly

2. **Authentication errors**
   - Ensure Email/Password auth is enabled in Firebase Console
   - Check Firestore security rules

3. **API connection errors**
   - Verify backend server is running on `http://localhost:5000`
   - Check CORS settings on backend

4. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for missing dependencies

### Getting Help

- Check the [Firebase Setup Guide](./FIREBASE_SETUP.md)
- Review Firebase Console for authentication and database issues
- Check browser console for JavaScript errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
