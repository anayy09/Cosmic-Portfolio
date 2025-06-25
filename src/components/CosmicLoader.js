import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// Container for the loader
const LoaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #050714;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingText = styled(motion.div)`
  color: #fff;
  font-family: ${props => props.theme.fonts.main}; // Changed to main font
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 300;
  opacity: 0.8;
  margin-top: 2rem;
`;

const ProgressContainer = styled(motion.div)`
  margin-top: 1.5rem;
  width: 120px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
`;

// Gentle floating stars
const GentleStars = ({ count = 100 }) => {
  const points = React.useRef();

  // Generate random stars
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const distance = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Convert spherical to cartesian coordinates
      positions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = distance * Math.cos(phi);

      // Random sizes for the stars
      scales[i] = Math.random() * 0.5 + 0.1;
    }

    return { positions, scales };
  }, [count]);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particlePositions.scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation={true}
        alphaTest={0.001}
        depthWrite={false}
      />
    </points>
  );
};

// Moon globe component rendered with lunar texture
const Moon = () => {
    const mesh = React.useRef();
    const texture = useLoader(THREE.TextureLoader, '/textures/2k_moon.jpg');

    useFrame(({ clock }) => {
      if (mesh.current) {
        mesh.current.rotation.y = clock.getElapsedTime() * 0.1;
      }
    });

    return (
      <mesh ref={mesh}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={texture} metalness={0.1} roughness={0.8} />
      </mesh>
    );
  };
  

// Gentle star field
const StarField = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 5, 10]} intensity={0.6} />
      <Moon />
      <GentleStars count={150} />

      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          radius={0.6}
        />
      </EffectComposer>
    </>
  );
};

const CosmicLoader = ({ finishLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Faster loading progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + Math.random() * 5;

        if (newProgress >= 100) {
          clearInterval(interval);

          // Shorter delay after reaching 100%
          setTimeout(() => {
            finishLoading();
          }, 300);

          return 100;
        }

        return newProgress;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [finishLoading]);

  const containerVariants = {
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <LoaderContainer key="loader" variants={containerVariants} exit="exit">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 45 }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          <StarField />
        </Canvas>

        <motion.div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4, duration: 1 } }}
        >
          <LoadingText>welcome</LoadingText>

          <ProgressContainer>
            <ProgressBar
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
                transition: {
                  duration: 0.1,
                  ease: 'linear'
                }
              }}
            />
          </ProgressContainer>
        </motion.div>
      </LoaderContainer>
    </AnimatePresence>
  );
};

export default CosmicLoader;
