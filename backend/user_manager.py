import json
import bcrypt
import os
from datetime import datetime
from typing import Dict, Optional, Tuple

class UserManager:
    def __init__(self, credentials_file: str = "users.json"):
        self.credentials_file = credentials_file
        self.users = self._load_users()
    
    def _load_users(self) -> Dict:
        """Load users from JSON file"""
        if os.path.exists(self.credentials_file):
            try:
                with open(self.credentials_file, 'r') as f:
                    data = json.load(f)
                    return data.get('users', {})
            except (json.JSONDecodeError, FileNotFoundError):
                return {}
        return {}
    
    def _save_users(self):
        """Save users to JSON file"""
        data = {
            "users": self.users,
            "metadata": {
                "version": "1.0",
                "created_at": "2024-01-01T00:00:00Z",
                "last_updated": datetime.now().isoformat()
            }
        }
        with open(self.credentials_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def authenticate_user(self, username: str, password: str) -> Tuple[bool, Optional[str]]:
        """Authenticate user and return (success, role)"""
        if username not in self.users:
            return False, None
        
        user_data = self.users[username]
        if self.verify_password(password, user_data['password_hash']):
            return True, user_data.get('role', 'user')
        
        return False, None
    
    def create_user(self, username: str, password: str, role: str = "user") -> bool:
        """Create a new user (superadmin only)"""
        if username in self.users:
            return False
        
        password_hash = self.hash_password(password)
        self.users[username] = {
            "password_hash": password_hash,
            "role": role,
            "created_at": datetime.now().isoformat()
        }
        self._save_users()
        return True
    
    def delete_user(self, username: str) -> bool:
        """Delete a user (superadmin only)"""
        if username not in self.users or username == "superadmin":
            return False
        
        del self.users[username]
        self._save_users()
        return True
    
    def update_user_password(self, username: str, new_password: str) -> bool:
        """Update user password"""
        if username not in self.users:
            return False
        
        password_hash = self.hash_password(new_password)
        self.users[username]["password_hash"] = password_hash
        self.users[username]["updated_at"] = datetime.now().isoformat()
        self._save_users()
        return True
    
    def get_all_users(self) -> Dict:
        """Get all users (without password hashes)"""
        users_info = {}
        for username, user_data in self.users.items():
            users_info[username] = {
                "role": user_data.get("role", "user"),
                "created_at": user_data.get("created_at"),
                "updated_at": user_data.get("updated_at")
            }
        return users_info
    
    def user_exists(self, username: str) -> bool:
        """Check if user exists"""
        return username in self.users
    
    def is_superadmin(self, username: str) -> bool:
        """Check if user is superadmin"""
        if username not in self.users:
            return False
        return self.users[username].get("role") == "superadmin"

# Initialize with default superadmin password
def initialize_superadmin():
    """Initialize superadmin with default password 'admin123'"""
    user_manager = UserManager()
    if not user_manager.user_exists("superadmin"):
        # Create superadmin with proper bcrypt hash
        password_hash = user_manager.hash_password("admin123")
        user_manager.users["superadmin"] = {
            "password_hash": password_hash,
            "role": "superadmin",
            "created_at": datetime.now().isoformat()
        }
        user_manager._save_users()
        print("Superadmin created with username: superadmin, password: admin123")
    return user_manager 