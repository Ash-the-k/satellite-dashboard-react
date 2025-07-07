import { useEffect, useState } from 'react';
import { fetchGyro } from '../services/api';
import styled from 'styled-components';
import GyroVisualization from '../components/GyroVisualization';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;

const GyroValues = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const GyroValue = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 1rem;
  border-radius: 8px;
  min-width: 120px;
`;

const GyroPage = () => {
  const [gyroData, setGyroData] = useState({ roll: 0, pitch: 0, yaw: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGyro()
        .then(response => {
          if (response.data && !response.data.error) {
            setGyroData(response.data);
          }
        })
        .catch(error => console.error('Error fetching gyro data:', error));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer>
      <h2>Gyroscope Visualization</h2>
      <GyroValues>
        <GyroValue>
          <strong>Roll:</strong> {gyroData.roll.toFixed(2)}°
        </GyroValue>
        <GyroValue>
          <strong>Pitch:</strong> {gyroData.pitch.toFixed(2)}°
        </GyroValue>
        <GyroValue>
          <strong>Yaw:</strong> {gyroData.yaw.toFixed(2)}°
        </GyroValue>
      </GyroValues>
      <GyroVisualization 
        roll={gyroData.roll} 
        pitch={gyroData.pitch} 
        yaw={gyroData.yaw} 
      />
    </PageContainer>
  );
};

export default GyroPage;