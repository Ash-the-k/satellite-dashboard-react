import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5g6HZvSdXGpBWjo8gqSn2m9QpyYVWpw0",
  authDomain: "trinetra-sat-dashboard.firebaseapp.com",
  projectId: "trinetra-sat-dashboard",
  storageBucket: "trinetra-sat-dashboard.firebasestorage.app",
  messagingSenderId: "259792574926",
  appId: "1:259792574926:web:eb26efcd021db1e9cb739f",
  measurementId: "G-MC9C8FEGHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
