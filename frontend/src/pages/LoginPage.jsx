import { useState } from 'react';
import styled from 'styled-components';
import { login as loginApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg};
`;

const LoginBox = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  min-width: 320px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary || '#1565c0'};
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor || '#dee2e6'};
  border-radius: 8px;
  font-size: 1rem;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.primary || '#1565c0'};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.primaryHover || '#0d47a1'};
  }
`;

const ErrorMsg = styled.div`
  color: #d32f2f;
  margin-bottom: 1rem;
  text-align: center;
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginApi(username, password);
      if (res.data.success) {
        login(res.data.token);
        navigate('/');
      } else {
        setError(res.data.error || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Login</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </LoginBox>
    </Container>
  );
};

export default LoginPage; 