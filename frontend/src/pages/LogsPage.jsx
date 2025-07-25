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
    source === 'arduino' ? theme.arduinoColor : theme.GPSColor};
`;


const NAValue = styled.span`
  color: ${({ theme }) => theme.naColor};
  font-style: italic;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const PageButton = styled.button`
  background: ${({ theme, active }) => (active ? theme.primary : theme.cardBg)};
  color: ${({ theme, active }) => (active ? 'white' : theme.text)};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageSizeSelect = styled.select`
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  font-size: 1rem;
`;

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);
  const [pageInput, setPageInput] = useState('');

  useEffect(() => {
    // Initial fetch
    fetchLogs()
      .then(response => setLogs(response.data))
      .catch(error => console.error('Error fetching logs:', error));

    // Polling interval
    const interval = setInterval(() => {
      fetchLogs()
        .then(response => setLogs(response.data))
        .catch(error => console.error('Error fetching logs:', error));
    }, 5000); // every 5 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // Pagination logic
  const totalLogs = logs.length;
  const totalPages = Math.ceil(totalLogs / logsPerPage);
  const startIdx = (currentPage - 1) * logsPerPage;
  const endIdx = startIdx + logsPerPage;
  const currentLogs = logs.slice(startIdx, endIdx);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setPageInput('');
  };

  const handlePageSizeChange = (e) => {
    setLogsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
    setPageInput('');
  };

  const handlePageInputChange = (e) => {
    const val = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(val)) {
      setPageInput(val);
    }
  };

  const handlePageInputGo = () => {
    const pageNum = Number(pageInput);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setPageInput('');
  };

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
        {source === 'arduino' ? 'Arduino' : 'GPS'}
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
            backgroundColor: theme.GPSColor
          }} />
          <span>GPS (Temp/Humidity/Location)</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Logs per page:</span>
          <PageSizeSelect value={logsPerPage} onChange={handlePageSizeChange} theme={theme}>
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </PageSizeSelect>
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
                {currentLogs.map(log => (
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
        <PaginationControls>
          <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} theme={theme}>&lt; Prev</PageButton>
          {/* Show page buttons for 1-5 and last page only */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
            <PageButton
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              active={currentPage === i + 1}
              theme={theme}
            >
              {i + 1}
            </PageButton>
          ))}
          {totalPages > 6 && <span style={{ color: theme.text }}>...</span>}
          {totalPages > 5 && (
            <PageButton
              key={totalPages}
              onClick={() => handlePageChange(totalPages)}
              active={currentPage === totalPages}
              theme={theme}
            >
              {totalPages}
            </PageButton>
          )}
          {/* Page input for jumping to a page if more than 5 pages */}
          {totalPages > 5 && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handlePageInputGo();
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <input
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                style={{ width: '2.5rem', borderRadius: 4, border: `1px solid ${theme.primary}`, padding: '0.2rem 0.4rem', color: theme.text, background: theme.cardBg }}
                placeholder="Go"
                maxLength={String(totalPages).length}
              />
              <PageButton type="submit" theme={theme} style={{ padding: '0.2rem 0.5rem', fontSize: '0.95em' }}>Go</PageButton>
            </form>
          )}
          <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} theme={theme}>Next &gt;</PageButton>
        </PaginationControls>
      </TableContainer>
    </PageContainer>
  );
};

export default LogsPage;