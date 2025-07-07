import { useEffect, useState } from 'react';
import { fetchLogs } from '../services/api';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;

  th {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 10;
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
`;

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetchLogs()
      .then(response => setLogs(response.data))
      .catch(error => console.error('Error fetching logs:', error));
  }, []);

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
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Temp (°C)</th>
              <th>Pressure (hPa)</th>
              <th>Humidity (%)</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.temperature}</td>
                <td>{log.pressure}</td>
                <td>{log.humidity}</td>
                <td>{log.latitude.toFixed(4)}</td>
                <td>{log.longitude.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </PageContainer>
  );
};

export default LogsPage;