# Firebase Setup Guide for Satellite Dashboard

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication and Firestore Database

## 2. Authentication Setup

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Optionally enable other providers (Google, GitHub, etc.)

## 3. Firestore Database Setup

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** for development
3. Select a location close to your users

## 4. Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Superadmins can read all user data
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin';
    }
    
    // Superadmins can update user roles
    match /users/{userId} {
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin';
    }
  }
}
```

## 5. Web App Configuration

1. In Firebase Console, go to **Project Settings** > **General**
2. Scroll down to **Your apps** section
3. Click **Add app** > **Web**
4. Register your app with a nickname
5. Copy the configuration object

## 6. Update Firebase Config

Replace the placeholder values in `src/config/firebase.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 7. Create First Superadmin

1. Start your React app: `npm start`
2. Go to the login page
3. Click "Don't have an account? Sign up"
4. Create an account with email and password
5. After signing up, manually update the user's role in Firestore:
   - Go to Firebase Console > Firestore Database
   - Find your user document
   - Change the `role` field from `"user"` to `"superadmin"`

## 8. Environment Variables (Optional)

For production, create a `.env` file in the frontend directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

Then update `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## 9. Testing

1. Start your React app: `npm start`
2. Try signing up with a new account
3. Try signing in with existing credentials
4. Test user management features (if you're a superadmin)

## 10. Production Deployment

When deploying to production:

1. Update Firestore security rules to be more restrictive
2. Set up proper authentication providers
3. Configure custom domains if needed
4. Set up Firebase Hosting for the frontend
5. Consider using Firebase Functions for backend logic

## Troubleshooting

- **Authentication errors**: Check if Email/Password auth is enabled
- **Firestore errors**: Verify security rules and database exists
- **CORS errors**: Check Firebase project settings and allowed domains
- **Permission errors**: Verify user roles and security rules
