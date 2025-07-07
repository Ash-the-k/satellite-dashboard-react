import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchTelemetry = () => api.get('/telemetry');
export const fetchLogs = () => api.get('/logs');
export const fetchGyro = () => api.get('/gyro');