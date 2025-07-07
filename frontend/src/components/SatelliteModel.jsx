import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const SatelliteModel = ({ roll, pitch, yaw }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Convert degrees to radians and apply rotations
      groupRef.current.rotation.set(
        THREE.MathUtils.degToRad(pitch),
        THREE.MathUtils.degToRad(yaw),
        THREE.MathUtils.degToRad(roll),
        'ZYX'
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Satellite body */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
        <meshPhongMaterial color="#00bcd4" />
      </mesh>
      
      {/* Solar panels */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.5]} />
        <meshPhongMaterial color="#1565c0" />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.5]} />
        <meshPhongMaterial color="#1565c0" />
      </mesh>
    </group>
  );
};

export default SatelliteModel;