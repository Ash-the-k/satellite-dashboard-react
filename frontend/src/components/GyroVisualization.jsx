import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import SatelliteModel from './SatelliteModel';
import styled from 'styled-components';

const VisualizationContainer = styled.div`
  width: 100%;
  height: 400px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  margin-top: 1rem;
`;

const GyroVisualization = ({ roll, pitch, yaw }) => {

  return (
    <VisualizationContainer>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <OrbitControls enableZoom={true} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <SatelliteModel roll={roll} pitch={pitch} yaw={yaw} />
        <axesHelper args={[2]} />
      </Canvas>
    </VisualizationContainer>
  );
};

export default GyroVisualization;