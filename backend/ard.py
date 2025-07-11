import requests
import random
import time
import os
from dotenv import load_dotenv

load_dotenv()
# Server configuration - MUST match your Arduino settings
SERVER_URL = os.getenv("SERVER_URL", "http://localhost:5000/data")  # Default fallback
HEADERS = {"Content-Type": "application/json"}  # Can stay as is (not sensitive)

def generate_sensor_data():
    """Generates data identical to your LoRa receiver's format"""
    return (
        f"T:{random.uniform(15.0, 35.0):.2f}C, "
        f"P:{random.uniform(900.0, 1100.0):.2f}hPa, "
        f"AX:{random.uniform(-1.0, 1.0):.2f}, "
        f"AY:{random.uniform(-1.0, 1.0):.2f}, "
        f"AZ:{random.uniform(-1.0, 1.0):.2f}, "
        f"GX:{random.uniform(-90, 90):.2f}, "
        f"GY:{random.uniform(-180, 180):.2f}, "
        f"GZ:{random.uniform(-180, 180):.2f}, "
        f"MX:{random.uniform(-0.5, 0.5):.2f}, "
        f"MY:{random.uniform(-0.5, 0.5):.2f}, "
        f"MZ:{random.uniform(-0.5, 0.5):.2f}"
    )

def send_to_server(data):
    """Identical HTTP POST handling as Arduino"""
    try:
        response = requests.post(
            SERVER_URL,
            json={"data": data},  # Same JSON structure
            headers=HEADERS,
            timeout=5
        )
        print(f"➡️ Data sent to server: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Failed to send data: {str(e)}")
        return False

def loop():
    """Replicates Arduino's loop() behavior"""
    while True:
        # Generate data instead of receiving from LoRa
        data = generate_sensor_data()
        print(f"Received: {data}")  # Same debug output
        
        # Attempt to send (no explicit WiFi check)
        send_to_server(data)
        
        time.sleep(1)  # Adjust interval as needed

if __name__ == "__main__":
    print("✅ Starting simulator (like LoRa Receiver Ready)")
    loop()