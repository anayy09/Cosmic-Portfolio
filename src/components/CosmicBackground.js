import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styled from 'styled-components';

// Styled component for the canvas container
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
`;

// Stars field component
const Stars = ({ count = 5000 }) => {
  const mesh = useRef();
  const { viewport } = useThree();

  // Generate random stars
  const starPositions = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, [count]);

  // Animate stars
  useFrame(() => {
    mesh.current.rotation.x += 0.0001;
    mesh.current.rotation.y += 0.0001;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={count}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation={true}
        color="#FFFFFF"
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// Nebula component
const Nebula = () => {
  const mesh = useRef();
  
  useFrame(({ clock }) => {
    mesh.current.rotation.z = clock.getElapsedTime() * 0.05;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -10]}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial
        color="#4285F4"
        opacity={0.15}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Main cosmic scene
const CosmicScene = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Stars />
      <Nebula />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={true}
        rotateSpeed={0.05}
        autoRotate
        autoRotateSpeed={0.1}
      />
    </>
  );
};

// Main component
const CosmicBackground = () => {
  return (
    <BackgroundContainer>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <CosmicScene />
      </Canvas>
    </BackgroundContainer>
  );
};

export default CosmicBackground;