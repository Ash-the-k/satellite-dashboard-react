# User Management System

This system replaces the previous .env-based authentication with a JSON-based user management system using bcrypt encryption.

## Features

- **JSON-based storage**: User credentials are stored in `users.json`
- **bcrypt encryption**: All passwords are securely hashed using bcrypt
- **Role-based access**: Support for user, admin, and superadmin roles
- **Superadmin interface**: Web-based user management for superadmins
- **Secure authentication**: Proper password verification and session management

## Initial Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize superadmin** (optional - runs automatically):
   ```bash
   python init_superadmin.py
   ```

3. **Start the backend**:
   ```bash
   python app.py
   ```

## Default Credentials

- **Username**: `superadmin`
- **Password**: `admin123`
- **Role**: `superadmin`

⚠️ **IMPORTANT**: Change the default password in production!

## User Roles

### Superadmin
- Can create, delete, and manage all users
- Has access to the user management interface
- Cannot be deleted
- Can change any user's password

### Admin
- Regular user with elevated privileges
- Can be created by superadmin

### User
- Standard user account
- Can be created by superadmin

## API Endpoints

### Authentication
- `POST /api/login` - User login

### User Management (Superadmin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `DELETE /api/users/<username>` - Delete user
- `PUT /api/users/<username>/password` - Update user password

## Frontend Features

### User Management Page
- Accessible only to superadmins at `/users`
- Create new users with different roles
- View all existing users
- Delete users (except superadmin)
- Change user passwords

### Navigation
- Superadmins see a "Users" link in the navbar
- Regular users don't see the user management option

## Security Features

1. **bcrypt Hashing**: All passwords are hashed with bcrypt using salt
2. **Role-based Access**: Different permissions based on user role
3. **Session Management**: Token-based authentication
4. **Input Validation**: Server-side validation for all inputs
5. **Error Handling**: Proper error messages without exposing sensitive data

## File Structure

```
backend/
├── app.py                 # Main Flask application
├── user_manager.py        # User management logic
├── users.json            # User credentials (auto-generated)
├── init_superadmin.py    # Superadmin initialization script
├── requirements.txt      # Python dependencies
└── README_USER_MANAGEMENT.md  # This file
```

## Usage Examples

### Creating a New User (via API)
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "admin_username": "superadmin",
    "admin_password": "admin123",
    "username": "newuser",
    "password": "password123",
    "role": "user"
  }'
```

### Getting All Users (via API)
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "admin123"
  }'
```

## Migration from .env

The system automatically migrates from the old .env-based authentication. The old environment variables are no longer used:

- `ADMIN_USERNAME` (deprecated)
- `ADMIN_PASSWORD_HASH` (deprecated)

## Troubleshooting

### Common Issues

1. **"Superadmin access required"**: Make sure you're logged in as superadmin
2. **"User already exists"**: Choose a different username
3. **"Cannot delete superadmin"**: The superadmin user is protected
4. **bcrypt import error**: Make sure bcrypt is installed (`pip install bcrypt`)

### Reset Superadmin Password

If you need to reset the superadmin password:

1. Delete `users.json`
2. Restart the application
3. The superadmin will be recreated with default credentials

## Production Considerations

1. **Change default password**: Use the user management interface to change the superadmin password
2. **Secure the users.json file**: Ensure proper file permissions
3. **Regular backups**: Backup the users.json file regularly
4. **HTTPS**: Use HTTPS in production for secure communication
5. **Rate limiting**: Consider implementing rate limiting for login attempts 