import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (cb) => {
  unauthorizedHandler = cb;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof unauthorizedHandler === 'function') {
      try { unauthorizedHandler(); } catch (_) {}
    }
    return Promise.reject(error);
  }
);

export const fetchTelemetry = () => api.get('/telemetry');
export const fetchLogs = () => api.get('/logs');
export const fetchGyro = () => api.get('/gyro');
export const login = (username, password) => api.post('/login', { username, password });
export const logout = () => api.post('/logout');