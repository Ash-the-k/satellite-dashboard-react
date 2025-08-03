import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { login as loginApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  MdOutlineSatelliteAlt,
  MdLock,
  MdPerson,
  MdLightMode,
  MdDarkMode
} from "react-icons/md";

// Animation
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

// Wrapper
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;

// Navbar
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.navbarBg};
  color: ${({ theme }) => theme.navbarText};
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 70px;
`;

// Navbar brand
const NavBrand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const NavSatelliteIcon = styled(MdOutlineSatelliteAlt)`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.primary};
  transition: transform 0.3s ease;
  &:hover { transform: rotate(15deg); }
`;

// Theme button
const ThemeButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.navbarText};
  border: 2px solid ${({ theme }) => theme.primary};
  border-radius: 20px;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  &:hover { background: ${({ theme }) => theme.primary}20; }
`;

// Main content
const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

// Login box
const LoginBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1.5rem;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid ${({ theme }) => theme.border};
  box-sizing: border-box;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 9px;
    background: linear-gradient(90deg, #534bd6, #3b82f6);
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    transform: translateY(-50%) scaleX(1.02);
    z-index: 1;
  }
`;



const SatelliteIcon = styled(MdOutlineSatelliteAlt)`
  font-size: 3rem;
  color: ${({ theme }) => theme.primary};
  margin: 0 auto 1.5rem;
  display: block;
  animation: ${float} 4s ease-in-out infinite;
`;

// Title
const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 2rem;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: ${({ theme }) => theme.primary};
    margin: 0.5rem auto 0;
    border-radius: 3px;
  }
`;

// Input field
const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text};
    opacity: 0.5;
  }
`;

// Button
const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #534bd6, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #3b82f6, #534bd6);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before { opacity: 1; }
  &:active { transform: scale(0.98); }
  &:disabled {
    background: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

// Error
const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.danger};
  text-align: center;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.danger}15;
  border: 1px solid ${({ theme }) => theme.danger}30;
  border-radius: 0.5rem;
`;

// Component
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

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
        login(res.data.token, {
          username: res.data.username,
          role: res.data.role
        });
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
    <Container theme={theme}>
      <NavContainer theme={theme}>
        <NavBrand>
          <NavSatelliteIcon theme={theme} />
          <span>Satellite Dashboard</span>
        </NavBrand>
        <ThemeButton onClick={toggleTheme} theme={theme}>
          {isDark ? <><MdLightMode size={18}/> Light</> : <><MdDarkMode size={18}/> Dark</>}
        </ThemeButton>
      </NavContainer>

      <Content>
        <LoginBox theme={theme}>
          <SatelliteIcon />
          <Title theme={theme}>Satellite Dashboard</Title>

          {error && <ErrorMsg theme={theme}>{error}</ErrorMsg>}

          <form onSubmit={handleSubmit}>
            <InputContainer>
              <InputIcon><MdPerson size={20} /></InputIcon>
              <Input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                autoComplete="username"
                disabled={loading}
              />
            </InputContainer>

            <InputContainer>
              <InputIcon><MdLock size={20} /></InputIcon>
              <Input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </InputContainer>

            <Button type="submit" disabled={loading}>
              {loading ? 'Connecting to Satellite...' : 'Launch Dashboard'}
            </Button>
          </form>
        </LoginBox>
      </Content>
    </Container>
  );
};

export default LoginPage;
