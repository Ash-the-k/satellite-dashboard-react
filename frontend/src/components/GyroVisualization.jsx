import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import SatelliteModel from './SatelliteModel';
import styled from 'styled-components';
import { useState } from 'react';

const VisualizationContainer = styled.div`
  width: 100%;
  height: 400px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  margin-top: 1rem;
`;

const GyroVisualization = ({ roll, pitch, yaw }) => {
  const [currentEuler, setCurrentEuler] = useState({ roll: 0, pitch: 0, yaw: 0 });

  return (
    <VisualizationContainer style={{ position: 'relative' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <SatelliteModel roll={roll} pitch={pitch} yaw={yaw} onUpdate={setCurrentEuler} />
        <axesHelper args={[2]} />
      </Canvas>
      {/* Overlay real-time orientation values */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        zIndex: 10
      }}>
        <div><strong>Real-Time Orientation</strong></div>
        <div>Roll: {currentEuler.roll.toFixed(2)}°</div>
        <div>Pitch: {currentEuler.pitch.toFixed(2)}°</div>
        <div>Yaw: {currentEuler.yaw.toFixed(2)}°</div>
      </div>
    </VisualizationContainer>
  );
};

export default GyroVisualization;