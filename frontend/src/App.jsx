import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, theme as baseTheme } from './styles/theme';
import Navbar from './components/Navbar';
import TelemetryPage from './pages/TelemetryPage';
import GyroPage from './pages/GyroPage';
import LogsPage from './pages/LogsPage';
import styled from 'styled-components';
import { useTheme } from './context/ThemeContext';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
`;

function App() {
  const { isDark } = useTheme();
  const mergedTheme = { ...baseTheme, ...(isDark ? darkTheme : lightTheme) };

  return (
    <Router>
      <ThemeProvider theme={mergedTheme}>
        <AppContainer>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<TelemetryPage />} />
              <Route path="/telemetry" element={<TelemetryPage />} />
              <Route path="/gyro" element={<GyroPage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </ThemeProvider>
    </Router>
  );
}

export default App;