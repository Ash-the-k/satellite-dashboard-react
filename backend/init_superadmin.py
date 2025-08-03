#!/usr/bin/env python3
"""
Script to initialize the superadmin user with proper bcrypt hashing.
Run this script to set up the initial superadmin account.
"""

import bcrypt
import json
from datetime import datetime

def create_superadmin():
    """Create superadmin user with bcrypt hashed password"""
    
    # Default superadmin credentials
    username = "superadmin"
    password = "admin123"  # You should change this in production
    
    # Hash the password with bcrypt
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    # Create the users data structure
    users_data = {
        "users": {
            username: {
                "password_hash": password_hash,
                "role": "superadmin",
                "created_at": datetime.now().isoformat()
            }
        },
        "metadata": {
            "version": "1.0",
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        }
    }
    
    # Write to users.json
    with open('users.json', 'w') as f:
        json.dump(users_data, f, indent=2)
    
    print(f"✅ Superadmin created successfully!")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Role: superadmin")
    print("\n⚠️  IMPORTANT: Change the default password in production!")
    print("You can do this by logging in and using the user management interface.")

if __name__ == "__main__":
    create_superadmin() 