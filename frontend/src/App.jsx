import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, theme as baseTheme } from './styles/theme';
import Navbar from './components/Navbar';
import TelemetryPage from './pages/TelemetryPage';
import GyroPage from './pages/GyroPage';
import LogsPage from './pages/LogsPage';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './pages/UserManagementPage';
import styled from 'styled-components';
import { useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-top: 70px; // This accounts for the fixed navbar height
`;

function PrivateRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  const { token, user } = useAuth();
  
  // If no token, show login routes
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  
  // If token exists, show dashboard routes
  return (
    <AppContainer>
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<TelemetryPage />} />
          <Route path="/telemetry" element={<TelemetryPage />} />
          <Route path="/gyro" element={<GyroPage />} />
          <Route path="/logs" element={<LogsPage />} />
          {user?.role === 'superadmin' && (
            <Route path="/users" element={<UserManagementPage />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

function App() {
  const { isDark } = useTheme();
  const mergedTheme = { ...baseTheme, ...(isDark ? darkTheme : lightTheme) };
  return (
    <Router>
      <ThemeProvider theme={mergedTheme}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;