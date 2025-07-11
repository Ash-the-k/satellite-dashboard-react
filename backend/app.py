from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime
import re
import os
from werkzeug.security import check_password_hash, generate_password_hash
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)
CORS(app)
DB = 'telemetry.db'

# Initialize database
def init_db():
    with sqlite3.connect(DB) as conn:
        c = conn.cursor()
        c.execute(
            "CREATE TABLE IF NOT EXISTS lora_telemetry ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT, "
            "timestamp TEXT, "
            "temperature REAL, "
            "pressure REAL, "
            "ax REAL, ay REAL, az REAL, "
            "gx REAL, gy REAL, gz REAL, "
            "mx REAL, my REAL, mz REAL)"
        )
        conn.commit()

# Endpoint to receive LoRa data
@app.route("/data", methods=['POST'])
def receive_lora_data():
    try:
        data = request.json.get('data')
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        parsed_data = parse_lora_data(data)
        if not parsed_data:
            return jsonify({"error": "Invalid data format"}), 400
        
        with sqlite3.connect(DB) as conn:
            c = conn.cursor()
            c.execute(
                "INSERT INTO lora_telemetry ("
                "timestamp, temperature, pressure, "
                "ax, ay, az, gx, gy, gz, mx, my, mz) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (datetime.now().isoformat(), 
                 parsed_data['temperature'], parsed_data['pressure'],
                 parsed_data['ax'], parsed_data['ay'], parsed_data['az'],
                 parsed_data['gx'], parsed_data['gy'], parsed_data['gz'],
                 parsed_data['mx'], parsed_data['my'], parsed_data['mz'])
            )
            conn.commit()
        
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def parse_lora_data(data_string):
    """Parse the LoRa data string into a dictionary"""
    try:
        pattern = r"T:([\d.]+)C, P:([\d.]+)hPa, AX:([\d.-]+), AY:([\d.-]+), AZ:([\d.-]+), GX:([\d.-]+), GY:([\d.-]+), GZ:([\d.-]+), MX:([\d.-]+), MY:([\d.-]+), MZ:([\d.-]+)"
        match = re.match(pattern, data_string)
        if not match:
            return None
            
        return {
            'temperature': float(match.group(1)),
            'pressure': float(match.group(2)),
            'ax': float(match.group(3)),
            'ay': float(match.group(4)),
            'az': float(match.group(5)),
            'gx': float(match.group(6)),
            'gy': float(match.group(7)),
            'gz': float(match.group(8)),
            'mx': float(match.group(9)),
            'my': float(match.group(10)),
            'mz': float(match.group(11))
        }
    except Exception:
        return None

# Set admin credentials from environment variables (with fallback for demo)
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin') 
ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH') 
if not ADMIN_PASSWORD_HASH:
    print("⚠️ Warning: Using default password hash! Configure ADMIN_PASSWORD_HASH in .env for production!")
ADMIN_PASSWORD_HASH = generate_password_hash('cubesat@csds')


# EXACTLY matches original /api/telemetry structure
@app.route("/api/telemetry")
def api_telemetry():
    with sqlite3.connect(DB) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT temperature, pressure, gx, gy, gz 
            FROM lora_telemetry 
            ORDER BY timestamp DESC 
            LIMIT 1
        """)
        row = c.fetchone()
        
        if row:
            telemetry = {
                "temperature": row[0],
                "pressure": row[1],
                "humidity": 0.0,  # Not in LoRa data
                "location": {
                    "lat": 0.0,    # Not in LoRa data
                    "lon": 0.0     # Not in LoRa data
                }
            }
            return jsonify(telemetry)
    
    # Fallback if no data (matches original structure)
    return jsonify({
        "temperature": 0.0,
        "pressure": 0.0,
        "humidity": 0.0,
        "location": {"lat": 0.0, "lon": 0.0}
    })

# EXACTLY matches original /api/logs structure
@app.route("/api/logs")
def api_logs():
    with sqlite3.connect(DB) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT 
                id, timestamp, temperature, pressure
            FROM lora_telemetry 
            ORDER BY timestamp DESC 
            LIMIT 50
        """)
        logs = c.fetchall()
    
    return jsonify([{
        "id": row[0],
        "timestamp": row[1],
        "temperature": row[2],
        "pressure": row[3],
        "humidity": 0.0,       # Keep for compatibility
        "latitude": 0.0,       # Keep for compatibility
        "longitude": 0.0       # Keep for compatibility
    } for row in logs])

# Gyro endpoint now uses gx,gy,gz from database
@app.route("/api/gyro")
def api_gyro():
    with sqlite3.connect(DB) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT gx, gy, gz 
            FROM lora_telemetry 
            ORDER BY timestamp DESC 
            LIMIT 1
        """)
        row = c.fetchone()
        
        if row:
            return jsonify({
                "roll": row[0],   # gx → roll (correct)
                "pitch": row[1],   # gy → pitch (correct)
                "yaw": row[2]      # gz → yaw (correct)
            })
    
    return jsonify({
        "roll": 0.0,
        "pitch": 0.0,
        "yaw": 0.0
    })

# Login endpoint remains unchanged
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username == ADMIN_USERNAME and check_password_hash(ADMIN_PASSWORD_HASH, password):
        return jsonify({"success": True, "token": "demo-token"})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

if __name__ == "__main__":
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)