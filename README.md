# Satellite Dashboard

A full-stack web application for visualizing and monitoring satellite telemetry data.

## Project Structure

- **backend/**: Flask API for telemetry and gyro data
- **frontend/**: React dashboard for visualization

---

## Backend (Flask API)

### Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. (Optional) Create a virtual environment:
   ```bash
   python3 -m venv ../venv
   source ../venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the API

```bash
python app.py
```

- The API will be available at `http://localhost:5000`.
- Endpoints:
  - `/api/telemetry` — Get and log random telemetry data
  - `/api/logs` — Retrieve last 100 telemetry logs
  - `/api/gyro` — Get latest gyro data

---

## Frontend (React App)

### Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

```bash
npm start
```

- The app will be available at `http://localhost:3000`.
- The frontend expects the backend API to be running on port 5000.

---

## Development Notes

- The backend uses SQLite (`telemetry.db`) and generates sample gyro data (`gyro_data.csv`).
- The frontend is built with React, Three.js, Chart.js, and Leaflet.
- See `frontend/package.json` for all dependencies.

---

## License

MIT 