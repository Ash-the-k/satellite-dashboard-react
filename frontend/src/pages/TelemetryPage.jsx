import { useEffect, useState } from 'react';
import { fetchTelemetry, fetchLogs } from '../services/api';
import styled from 'styled-components';
import MapComponent from '../components/MapComponent';
import TelemetryChart from '../components/TelemetryChart';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1800px;
  margin: 0 auto;
`;

const TelemetryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const TelemetryCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  margin-top: 0;
  color: ${({ theme }) => theme.primary};
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
`;

const CardUnit = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const TelemetryPage = () => {
  const [currentTelemetry, setCurrentTelemetry] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial historical data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsRes, telemetryRes] = await Promise.all([
          fetchLogs(),
          fetchTelemetry()
        ]);
        
        setHistoricalData(logsRes.data);
        setCurrentTelemetry(telemetryRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetchTelemetry();
        setCurrentTelemetry(response.data);
        setHistoricalData(prev => [{
          timestamp: new Date().toISOString(),
          ...response.data
        }, ...prev].slice(0, 100));
      } catch (error) {
        console.error('Error fetching telemetry:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <PageContainer>Loading...</PageContainer>;

  return (
    <PageContainer>
      <h2>Satellite Telemetry</h2>
      
      <TelemetryGrid>
        <TelemetryCard>
          <CardTitle>Temperature</CardTitle>
          <CardValue>
            {currentTelemetry?.temperature || '--'}
            <CardUnit>°C</CardUnit>
          </CardValue>
        </TelemetryCard>
        
        <TelemetryCard>
          <CardTitle>Pressure</CardTitle>
          <CardValue>
            {currentTelemetry?.pressure || '--'}
            <CardUnit>hPa</CardUnit>
          </CardValue>
        </TelemetryCard>
        
        <TelemetryCard>
          <CardTitle>Humidity</CardTitle>
          <CardValue>
            {currentTelemetry?.humidity || '--'}
            <CardUnit>%</CardUnit>
          </CardValue>
        </TelemetryCard>
        
        <TelemetryCard>
          <CardTitle>Location</CardTitle>
          <CardValue>
            {currentTelemetry?.location 
              ? `${currentTelemetry.location.lat.toFixed(4)}, ${currentTelemetry.location.lon.toFixed(4)}` 
              : '--'}
          </CardValue>
        </TelemetryCard>
      </TelemetryGrid>

      {currentTelemetry?.location && (
        <MapComponent 
          lat={currentTelemetry.location.lat} 
          lng={currentTelemetry.location.lon} 
        />
      )}

      <ChartsContainer>
        <TelemetryChart
          title="Temperature History"
          data={historicalData.map(item => ({
            x: new Date(item.timestamp),
            y: item.temperature
          }))}
          color="#ea580c"
          unit="°C"
        />
        <TelemetryChart
          title="Pressure History"
          data={historicalData.map(item => ({
            x: new Date(item.timestamp),
            y: item.pressure
          }))}
          color="#4f46e5"
          unit="hPa"
        />
        <TelemetryChart
          title="Humidity History"
          data={historicalData.map(item => ({
            x: new Date(item.timestamp),
            y: item.humidity
          }))}
          color="#10b981"
          unit="%"
        />
      </ChartsContainer>
    </PageContainer>
  );
};

export default TelemetryPage;