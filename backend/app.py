from flask import Flask, jsonify
from flask_cors import CORS
import random
import sqlite3
import time
import csv
from datetime import datetime

app = Flask(__name__)
CORS(app)
DB = 'telemetry.db'

# Initialize database
def init_db():
    with sqlite3.connect(DB) as conn:
        c = conn.cursor()
        c.execute(
            "CREATE TABLE IF NOT EXISTS telemetry ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT, "
            "timestamp TEXT, "
            "temperature REAL, "
            "pressure REAL, "
            "humidity REAL, "
            "latitude REAL, "
            "longitude REAL)"
        )
        conn.commit()

# Generate sample gyro data file if it doesn't exist
def init_gyro_data():
    try:
        with open('gyro_data.csv', 'x') as f:
            writer = csv.writer(f)
            writer.writerow(['roll', 'pitch', 'yaw'])
            for _ in range(100):
                writer.writerow([
                    random.uniform(-180, 180),
                    random.uniform(-90, 90),
                    random.uniform(-180, 180)
                ])
    except FileExistsError:
        pass

# API Endpoints
@app.route("/api/telemetry")
def api_telemetry():
    telemetry = {
        "temperature": round(random.uniform(10, 60), 2),
        "pressure": round(random.uniform(900, 1100), 2),
        "humidity": round(random.uniform(10, 90), 2),
        "location": {
            "lat": round(random.uniform(-90, 90), 6),
            "lon": round(random.uniform(-180, 180), 6)
        }
    }

    with sqlite3.connect(DB) as conn:
        c = conn.cursor()
        c.execute(
            "INSERT INTO telemetry (timestamp, temperature, pressure, humidity, latitude, longitude) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (datetime.now().isoformat(), telemetry["temperature"], telemetry["pressure"], 
             telemetry["humidity"], telemetry["location"]["lat"], telemetry["location"]["lon"])
        )
        conn.commit()

    return jsonify(telemetry)

@app.route("/api/logs")
def api_logs():
    with sqlite3.connect(DB) as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM telemetry ORDER BY id DESC LIMIT 100")
        logs = c.fetchall()
    return jsonify([{
        "id": row[0],
        "timestamp": row[1],
        "temperature": row[2],
        "pressure": row[3],
        "humidity": row[4],
        "latitude": row[5],
        "longitude": row[6]
    } for row in logs])

@app.route("/api/gyro")
def api_gyro():
    try:
        with open('gyro_data.csv') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header
            last_row = None
            for row in reader:
                last_row = row
            if last_row:
                return jsonify({
                    "roll": float(last_row[0]),
                    "pitch": float(last_row[1]),
                    "yaw": float(last_row[2])
                })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"error": "No data"}), 404

if __name__ == "__main__":
    init_db()
    init_gyro_data()
    app.run(debug=True, port=5000)