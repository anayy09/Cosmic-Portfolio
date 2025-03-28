// src/components/CosmicBackground.js
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import styled from 'styled-components';

// Styled component for the canvas container
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background: #050714; /* Very dark blue-black base */
`;

// Stars field component with different star sizes and brightness
const Stars = ({ count = 20 }) => {
  const mesh = useRef();
  
  // Generate random stars with varying sizes
  const [positions, sizes, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute stars in a sphere
      const radius = Math.random() * 100 + 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Vary star sizes - keep them small
      sizes[i] = Math.random() * 0.8 + 0.2;
      
      // Create different star colors (mostly white with hints of blue and yellow)
      const colorChoice = Math.random();
      if (colorChoice > 0.95) {
        // Blue-ish stars
        colors[i3] = 0.7 + Math.random() * 0.3; // R
        colors[i3 + 1] = 0.7 + Math.random() * 0.3; // G
        colors[i3 + 2] = 1.0; // B
      } else if (colorChoice > 0.9) {
        // Yellow-ish stars
        colors[i3] = 1.0; // R
        colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G
        colors[i3 + 2] = 0.6 + Math.random() * 0.2; // B
      } else {
        // White stars with slight variations
        const brightness = 0.8 + Math.random() * 0.2;
        colors[i3] = brightness; // R
        colors[i3 + 1] = brightness; // G
        colors[i3 + 2] = brightness + (Math.random() * 0.1); // B
      }
    }
    
    return [positions, sizes, colors];
  }, [count]);
  
  // Animate stars with very subtle rotation
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.02;
    mesh.current.rotation.x = Math.sin(time * 0.3) * 0.01;
    mesh.current.rotation.y = Math.cos(time * 0.2) * 0.01;
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
};

// Shooting stars component with tails
const ShootingStars = () => {
  // We'll create a small number of shooting stars with tails
  const count = 5;
  const shootingStars = useRef([]);
  const trailsGroup = useRef();
  
  // Initialize shooting stars
  useMemo(() => {
    shootingStars.current = Array.from({ length: count }, () => ({
      active: false,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        50 + Math.random() * 50,
        (Math.random() - 0.5) * 100
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        -1 - Math.random() * 1.5,
        (Math.random() - 0.5) * 0.5
      ),
      trail: [],
      trailLength: Math.floor(Math.random() * 10) + 15, // Length of the trail
      nextActivationTime: Math.random() * 10 // Random delay before activation
    }));
    return shootingStars.current;
  }, [count]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update each shooting star
    shootingStars.current.forEach((star, index) => {
      // Check if it's time to activate this star
      if (!star.active && time > star.nextActivationTime) {
        star.active = true;
        star.trail = [];
        
        // Reset position to top of screen with random x,z
        star.position.set(
          (Math.random() - 0.5) * 100,
          50 + Math.random() * 50,
          (Math.random() - 0.5) * 100
        );
        
        // Set new velocity
        star.velocity.set(
          (Math.random() - 0.5) * 0.5,
          -1 - Math.random() * 1.5,
          (Math.random() - 0.5) * 0.5
        );
      }
      
      // Update active stars
      if (star.active) {
        // Move the star
        star.position.add(star.velocity);
        
        // Add current position to trail
        star.trail.unshift({ ...star.position });
        
        // Limit trail length
        if (star.trail.length > star.trailLength) {
          star.trail.pop();
        }
        
        // Check if star is out of view
        if (star.position.y < -50) {
          star.active = false;
          star.nextActivationTime = time + 5 + Math.random() * 15; // Wait before reactivating
        }
      }
    });
    
    // Update the geometry for the trails
    if (trailsGroup.current) {
      // Remove old trails
      while (trailsGroup.current.children.length > 0) {
        trailsGroup.current.remove(trailsGroup.current.children[0]);
      }
      
      // Add new trails
      shootingStars.current.forEach((star, starIndex) => {
        if (star.active && star.trail.length > 1) {
          const points = [];
          
          // Create points for the trail
          star.trail.forEach((point, i) => {
            points.push(new THREE.Vector3(point.x, point.y, point.z));
          });
          
          // Create the line geometry
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          // Create gradient colors for the trail
          const colors = new Float32Array(points.length * 3);
          for (let i = 0; i < points.length; i++) {
            const i3 = i * 3;
            // Head of the trail is brighter
            const alpha = 1 - i / points.length;
            colors[i3] = 1;     // R
            colors[i3 + 1] = 1; // G
            colors[i3 + 2] = 1; // B
          }
          
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          
          // Create the line material
          const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
          });
          
          // Create the line and add it to the group
          const line = new THREE.Line(geometry, material);
          trailsGroup.current.add(line);
        }
      });
    }
  });
  
  return (
    <>
      <group ref={trailsGroup} />
      {shootingStars.current.map((star, i) => (
        <mesh key={i} position={star.position} visible={star.active}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </>
  );
};

// Main cosmic scene
const CosmicScene = () => {
  return (
    <>
      <color attach="background" args={['#050714']} />
      <ambientLight intensity={0.1} />
      
      <Stars count={20} />
      <ShootingStars />
      
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
};

// Main component
const CosmicBackground = () => {
  return (
    <BackgroundContainer>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]} // Responsive to device pixel ratio
      >
        <CosmicScene />
      </Canvas>
    </BackgroundContainer>
  );
};

export default CosmicBackground;