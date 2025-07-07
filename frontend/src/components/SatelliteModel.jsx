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
  {/* CubeSat body */}
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshStandardMaterial color="#607d8b" metalness={0.5} roughness={0.4} />
  </mesh>

  {/* Solar panels on sides */}
  <mesh position={[0.5, 0, 0]}>
    <boxGeometry args={[0.02, 0.5, 0.5]} />
    <meshStandardMaterial color="#0d47a1" metalness={0.4} roughness={0.2} />
  </mesh>
  <mesh position={[-0.5, 0, 0]}>
    <boxGeometry args={[0.02, 0.5, 0.5]} />
    <meshStandardMaterial color="#0d47a1" metalness={0.4} roughness={0.2} />
  </mesh>

  {/* Tiny antenna rods */}
  <mesh position={[0, 0, 0.3]}>
    <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
    <meshStandardMaterial color="#212121" />
  </mesh>
  <mesh position={[0, 0, -0.3]}>
    <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
    <meshStandardMaterial color="#212121" />
  </mesh>

  {/* Small camera / sensor lens */}
  <mesh position={[0, 0.25, 0]}>
    <sphereGeometry args={[0.025, 16, 16]} />
    <meshStandardMaterial color="#90caf9" emissive="#2196f3" emissiveIntensity={0.5} />
  </mesh>
</group>
  );
};

export default SatelliteModel;