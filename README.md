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
  - `/data` — **POST** endpoint to receive telemetry data (from Arduino/device or simulator)
  - `/api/telemetry` — Get latest telemetry data (for frontend)
  - `/api/logs` — Retrieve last 50 telemetry logs
  - `/api/gyro` — Get latest gyro data
  - `/api/login` — Admin login

---

## Sending Telemetry Data to the Backend

After starting the backend, you have two options for sending telemetry data:

### 1. Real Device (Arduino or similar)
- If you have an Arduino or other device sending data in the correct format to `http://<backend-ip>:5000/data`, the backend will automatically receive and store the data. No further action is needed.

### 2. Simulate Arduino Data (Python Simulator)
- If you do **not** have a real device, you can simulate data by running the provided Python script in a separate terminal:

   1. Open a new terminal and navigate to the backend directory:
      ```bash
      cd backend
      ```
   2. (Optional) Set the `SERVER_URL` environment variable if your backend is not running on the default URL:
      ```bash
      export SERVER_URL="http://localhost:5000/data"
      ```
      By default, the simulator sends data to `http://localhost:5000/data`.
   3. Run the simulator:
      ```bash
      python ard.py
      ```

- The simulator will continuously generate random telemetry data in the same format as the Arduino and POST it to the backend, which stores it in the database. The frontend will then display this data as if it were coming from a real device.

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

- The backend uses SQLite (`telemetry.db`) and stores all incoming telemetry data.
- The simulator (`backend/ard.py`) mimics Arduino by sending random data to the backend.
- The frontend is built with React, Three.js, Chart.js, and Leaflet.
- See `frontend/package.json` for all dependencies.

---

## License

MIT 