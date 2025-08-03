import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-align: center;
`;

const Card = styled.div`
  background: ${props => props.theme.cardBg};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.text};
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary ? props.theme.primary : props.theme.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const UsersList = styled.div`
  display: grid;
  gap: 1rem;
`;

const UserCard = styled.div`
  background: ${props => props.theme.cardBg};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: grid;
  gap: 0.25rem;
`;

const Username = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const UserRole = styled.span`
  color: ${props => props.theme.secondaryText};
  font-size: 0.9rem;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.success ? '#c3e6cb' : '#f5c6cb'};
`;

const UserManagementPage = () => {
  const { token } = useAuth();
  const theme = useTheme();
  const [users, setUsers] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form states
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    // Don't auto-fetch users - let user enter credentials first
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage('');
      const params = new URLSearchParams({
        username: adminCredentials.username,
        password: adminCredentials.password
      });
      
      const response = await fetch(`http://localhost:5000/api/users?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setIsAuthenticated(true);
        setMessage('Successfully loaded users!');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_username: adminCredentials.username,
          admin_password: adminCredentials.password,
          username: newUser.username,
          password: newUser.password,
          role: newUser.role
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setNewUser({ username: '', password: '', role: 'user' });
        fetchUsers();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (username) => {
    if (username === 'superadmin') {
      setMessage('Cannot delete superadmin user');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/users/${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminCredentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        fetchUsers();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (username, newPassword) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/users/${username}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: adminCredentials.username,
          password: adminCredentials.password,
          new_password: newPassword
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container>
        <Title>Access Denied</Title>
        <Card>
          <p>Please log in to access user management.</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Title>User Management</Title>
      
      {message && (
        <Message success={!message.includes('Error')}>
          {message}
        </Message>
      )}

      <Card>
        <h2>Admin Authentication</h2>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Label>Admin Username</Label>
            <Input
              type="text"
              value={adminCredentials.username}
              onChange={(e) => setAdminCredentials({
                ...adminCredentials,
                username: e.target.value
              })}
              placeholder="Enter admin username"
            />
          </FormGroup>
          <FormGroup>
            <Label>Admin Password</Label>
            <Input
              type="password"
              value={adminCredentials.password}
              onChange={(e) => setAdminCredentials({
                ...adminCredentials,
                password: e.target.value
              })}
              placeholder="Enter admin password"
            />
          </FormGroup>
          <Button onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Load Users'}
          </Button>
        </Form>
      </Card>

             {isAuthenticated && (
         <>
           <Card>
             <h2>Create New User</h2>
             <Form onSubmit={createUser}>
               <FormGroup>
                 <Label>Username</Label>
                 <Input
                   type="text"
                   value={newUser.username}
                   onChange={(e) => setNewUser({
                     ...newUser,
                     username: e.target.value
                   })}
                   placeholder="Enter username"
                   required
                 />
               </FormGroup>
               <FormGroup>
                 <Label>Password</Label>
                 <Input
                   type="password"
                   value={newUser.password}
                   onChange={(e) => setNewUser({
                     ...newUser,
                     password: e.target.value
                   })}
                   placeholder="Enter password"
                   required
                 />
               </FormGroup>
               <FormGroup>
                 <Label>Role</Label>
                 <Select
                   value={newUser.role}
                   onChange={(e) => setNewUser({
                     ...newUser,
                     role: e.target.value
                   })}
                 >
                   <option value="user">User</option>
                   <option value="admin">Admin</option>
                   <option value="superadmin">Superadmin</option>
                 </Select>
               </FormGroup>
               <Button type="submit" primary disabled={loading}>
                 {loading ? 'Creating...' : 'Create User'}
               </Button>
             </Form>
           </Card>

           <Card>
             <h2>Manage Users</h2>
             <UsersList>
               {Object.entries(users).map(([username, userData]) => (
                 <UserCard key={username}>
                   <UserInfo>
                     <Username>{username}</Username>
                     <UserRole>Role: {userData.role}</UserRole>
                     <UserRole>Created: {new Date(userData.created_at).toLocaleDateString()}</UserRole>
                   </UserInfo>
                   <ButtonGroup>
                     {username !== 'superadmin' && (
                       <Button
                         onClick={() => {
                           const newPassword = prompt(`Enter new password for ${username}:`);
                           if (newPassword) {
                             updatePassword(username, newPassword);
                           }
                         }}
                         disabled={loading}
                       >
                         Change Password
                       </Button>
                     )}
                     {username !== 'superadmin' && (
                       <Button
                         onClick={() => {
                           if (confirm(`Are you sure you want to delete user ${username}?`)) {
                             deleteUser(username);
                           }
                         }}
                         disabled={loading}
                       >
                         Delete
                       </Button>
                     )}
                   </ButtonGroup>
                 </UserCard>
               ))}
             </UsersList>
           </Card>
         </>
       )}
    </Container>
  );
};

export default UserManagementPage; 