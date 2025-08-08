import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
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
  const { user: currentUser } = useAuth();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = [];
      
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (!userData.deleted) {
          usersList.push({
            id: doc.id,
            ...userData
          });
        }
      });
      
      setUsers(usersList);
      setMessage('Successfully loaded users!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Note: User creation is handled by the signUp function in AuthContext
      // This is just for demonstration - in a real app, you'd need admin SDK
      setMessage('User creation requires Firebase Admin SDK on the backend. Use the sign-up form instead.');
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (userId === currentUser?.uid) {
      setMessage('Cannot delete your own account');
      return;
    }
    
    try {
      setLoading(true);
      
      // Mark user as deleted in Firestore
      await updateDoc(doc(db, 'users', userId), {
        deleted: true,
        deletedAt: new Date().toISOString()
      });
      
      setMessage('User deleted successfully');
      fetchUsers();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setLoading(true);
      
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      
      setMessage('User role updated successfully');
      fetchUsers();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== 'superadmin') {
    return (
      <Container>
        <Title>Access Denied</Title>
        <Card>
          <p>You need superadmin privileges to access user management.</p>
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
        <h2>Manage Users</h2>
        <UsersList>
          {users.map((user) => (
            <UserCard key={user.id}>
              <UserInfo>
                <Username>{user.displayName || user.email}</Username>
                <UserRole>Email: {user.email}</UserRole>
                <UserRole>Role: {user.role}</UserRole>
                <UserRole>Created: {new Date(user.createdAt).toLocaleDateString()}</UserRole>
              </UserInfo>
              <ButtonGroup>
                <Select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  disabled={loading || user.id === currentUser.uid}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </Select>
                {user.id !== currentUser.uid && (
                  <Button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete user ${user.displayName || user.email}?`)) {
                        deleteUser(user.id);
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
    </Container>
  );
};

export default UserManagementPage; 