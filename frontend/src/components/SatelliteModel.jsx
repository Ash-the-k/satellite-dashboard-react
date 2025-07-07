import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const SatelliteModel = ({ roll, pitch, yaw, onUpdate }) => {
  const groupRef = useRef();
  const targetQuat = useRef(new THREE.Quaternion());

  useFrame(() => {
    if (groupRef.current) {
      // Convert degrees to radians
      const targetEuler = new THREE.Euler(
        THREE.MathUtils.degToRad(pitch),
        THREE.MathUtils.degToRad(yaw),
        THREE.MathUtils.degToRad(roll),
        'ZYX'
      );
      targetQuat.current.setFromEuler(targetEuler);
      // Slow down the interpolation for much slower, slow-motion animation
      groupRef.current.quaternion.slerp(targetQuat.current, 0.005);
      // Get current orientation in Euler angles (degrees)
      const current = new THREE.Euler().setFromQuaternion(groupRef.current.quaternion, 'ZYX');
      if (onUpdate) {
        onUpdate({
          roll: THREE.MathUtils.radToDeg(current.z),
          pitch: THREE.MathUtils.radToDeg(current.x),
          yaw: THREE.MathUtils.radToDeg(current.y)
        });
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cube body for clearer orientation */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshPhongMaterial color="#00bcd4" />
      </mesh>
      {/* Optionally, keep solar panels or remove for pure cube */}
      {/*
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.5]} />
        <meshPhongMaterial color="#1565c0" />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.5]} />
        <meshPhongMaterial color="#1565c0" />
      </mesh>
      */}
    </group>
  );
};

export default SatelliteModel;