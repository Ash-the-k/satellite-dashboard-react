import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add Firebase auth token to requests
api.interceptors.request.use(async (config) => {
  // You can add Firebase auth token here if needed for backend requests
  // const token = await auth.currentUser?.getIdToken();
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle API errors here
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Data fetching functions for your satellite dashboard
export const fetchTelemetry = () => api.get('/telemetry');
export const fetchLogs = () => api.get('/logs');
export const fetchGyro = () => api.get('/gyro');