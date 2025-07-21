import { useEffect, useState } from 'react';
import { fetchLogs } from '../services/api';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TableContainer = styled.div`
  margin-top: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ScrollableTableWrapper = styled.div`
  overflow-y: auto;
  flex: 1;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.primary} transparent;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;  // Changed from separate
  background-color: ${({ theme }) => theme.cardBg};

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  tr {
    transition: background-color 0.2s;
    
    &:nth-child(even) {
      background-color: ${({ theme }) => theme.cardBg};
    }
    
    &:nth-child(odd) {
      background-color: ${({ theme }) => theme.bg};
    }

    &:hover {
      background-color: ${({ theme }) => theme.primary}20;
    }
  }

  thead tr th:last-child {
    border-top-right-radius: ${({ theme }) => theme.radii.lg};
  }
`;

const SourceBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme, source }) => 
    theme.isDark 
      ? theme.bg  // Use dark background color for text in dark mode
      : 'white'}; // Keep white text in light mode
  background-color: ${({ source, theme }) => 
    source === 'arduino' ? theme.arduinoColor : theme.raspberryColor};
`;


const NAValue = styled.span`
  color: ${({ theme }) => theme.naColor};
  font-style: italic;
`;

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetchLogs()
      .then(response => setLogs(response.data))
      .catch(error => console.error('Error fetching logs:', error));
  }, []);

  const formatValue = (value, isCoordinate = false) => {
    if (value === "N/A") return <NAValue>N/A</NAValue>;
    if (typeof value === 'number') {
      if (value === 0 && !isCoordinate) return "0";
      return value.toFixed(isCoordinate ? 4 : value % 1 === 0 ? 0 : 2);
    }
    return value;
  };

  const renderSource = (source) => {
    return (
      <SourceBadge source={source}>
        {source === 'arduino' ? 'Arduino' : 'Raspberry'}
      </SourceBadge>
    );
  };

  return (
    <PageContainer>
      <h2 style={{ 
        color: theme.text,
        borderBottom: `2px solid ${theme.primary}`,
        paddingBottom: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        Telemetry Logs
      </h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        marginBottom: '1rem',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: theme.arduinoColor
          }} />
          <span>Arduino (IMU/Pressure)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: theme.raspberryColor
          }} />
          <span>Raspberry (Temp/Humidity/Location)</span>
        </div>
      </div>

      <TableContainer>
          <ScrollableTableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Timestamp</th>
                  <th>Source</th>
                  <th>Temp (°C)</th>
                  <th>Pressure (hPa)</th>
                  <th>Humidity (%)</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>GX</th>
                  <th>GY</th>
                  <th>GZ</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{renderSource(log.source)}</td>
                    <td>{formatValue(log.temperature)}</td>
                    <td>{formatValue(log.pressure)}</td>
                    <td>{formatValue(log.humidity)}</td>
                    <td>{formatValue(log.latitude, true)}</td>
                    <td>{formatValue(log.longitude, true)}</td>
                    <td>{formatValue(log.gx)}</td>
                    <td>{formatValue(log.gy)}</td>
                    <td>{formatValue(log.gz)}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
        </ScrollableTableWrapper>
      </TableContainer>
    </PageContainer>
  );
};

export default LogsPage;