import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  MdOutlineSatelliteAlt,
  MdLock,
  MdPerson,
  MdLightMode,
  MdDarkMode,
  MdEmail,
  MdVisibility,
  MdVisibilityOff
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
  color: ${({ theme }) => theme.primary};
  opacity: 0.8;
  z-index: 2;
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

const PasswordInput = styled(Input)`
  padding-right: 3rem;
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

// Success
const SuccessMsg = styled.div`
  color: ${({ theme }) => theme.success || '#28a745'};
  text-align: center;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => (theme.success || '#28a745')}15;
  border: 1px solid ${({ theme }) => (theme.success || '#28a745')}30;
  border-radius: 0.5rem;
`;

// Password visibility toggle
const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  opacity: 0.8;
  z-index: 2;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

// Toggle button
const ToggleText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}99; // Muted text for better hierarchy
`;

// The clickable "link" part of the toggle text
const ToggleLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  cursor: pointer;
  font-size: inherit; // Inherits font-size from ToggleText
  margin-left: 0.5rem;
  padding: 0;
  transition: opacity 0.3s ease;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }
`;

// Component
const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    if (isSignUp && !displayName) {
      setError('Please enter a display name.');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isSignUp) {
        const result = await signUp(email, password, displayName);
        if (result.success) {
          setSuccess('Account created successfully! You can now sign in.');
          setIsSignUp(false);
          setEmail('');
          setPassword('');
          setDisplayName('');
        } else {
          setError(result.error);
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setDisplayName('');
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
          {success && <SuccessMsg theme={theme}>{success}</SuccessMsg>}

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <InputContainer>
                <InputIcon><MdPerson size={20} /></InputIcon>
                <Input 
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  autoFocus
                  disabled={loading}
                />
              </InputContainer>
            )}

            <InputContainer>
              <InputIcon><MdEmail size={20} /></InputIcon>
              <Input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus={!isSignUp}
                autoComplete="email"
                disabled={loading}
              />
            </InputContainer>

            <InputContainer>
              <InputIcon><MdLock size={20} /></InputIcon>
              <PasswordInput 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                disabled={loading}
              />
              <PasswordToggle 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                theme={theme}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </PasswordToggle>
            </InputContainer>

            <Button type="submit" disabled={loading}>
              {loading 
                ? (isSignUp ? 'Creating Account...' : 'Connecting to Satellite...') 
                : (isSignUp ? 'Create Account' : 'Launch Dashboard')
              }
            </Button>
          </form>

          <ToggleText theme={theme}>
            {isSignUp 
              ? 'Already have an account?' 
              : "Don't have an account?"
            }
            <ToggleLink onClick={toggleMode}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </ToggleLink>
          </ToggleText>
        </LoginBox>
      </Content>
    </Container>
  );
};

export default LoginPage;
