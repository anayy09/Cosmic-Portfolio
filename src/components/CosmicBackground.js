// src/components/CosmicBackground.js
import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
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
const Stars = ({ count = 100 }) => {
  const mesh = useRef();
  const starTexture = useLoader(THREE.TextureLoader, '/star.png');
  
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
        map={starTexture}
        alphaTest={0.001}
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
  const starTexture = useLoader(THREE.TextureLoader, '/star.png');
  
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
        <sprite key={i} position={star.position} visible={star.active}>
          <spriteMaterial
            map={starTexture}
            transparent
            opacity={0.8}
            color="#ffffff"
          />
        </sprite>
      ))}
    </>
  );
};

// RealMoon component that shows the moon as it appears in the real sky
const RealMoon = () => {
  const moonRef = useRef();
  const { viewport } = useThree();
  const [moonPosition, setMoonPosition] = useState({ azimuth: 0, altitude: 0 });
  const [isDefaultMode, setIsDefaultMode] = useState(false);
  const moonTexture = useLoader(THREE.TextureLoader, '/moon.png', (loader) => {
    // Set texture loading priority and use image optimization
    loader.setCrossOrigin('anonymous');
    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      if (url.includes('moon.png')) {
        console.log(`Loading moon texture: ${Math.round((itemsLoaded / itemsTotal) * 100)}%`);
      }
    };
  });
  
  // For better performance with large texture
  useEffect(() => {
    if (moonTexture) {
      moonTexture.minFilter = THREE.LinearFilter;
      moonTexture.generateMipmaps = false;
      moonTexture.anisotropy = 1;
      
      // Resize the texture for better performance if needed
      const reducer = 4; // Reduce texture size for better performance
      if (moonTexture.image && (moonTexture.image.width > 2048 || moonTexture.image.height > 2048)) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = moonTexture.image.width / reducer;
        canvas.height = moonTexture.image.height / reducer;
        ctx.drawImage(moonTexture.image, 0, 0, canvas.width, canvas.height);
        
        // Create new texture from canvas
        const newTexture = new THREE.CanvasTexture(canvas);
        newTexture.needsUpdate = true;
        moonTexture.image = canvas;
        moonTexture.needsUpdate = true;
      }
    }
  }, [moonTexture]);

  // Calculate real moon position based on current date/time
  useEffect(() => {
    // Function to calculate the moon's position in the sky
    const calculateMoonPosition = () => {
      // Current date - March 29, 2025
      const now = new Date();
      
      // Calculate Julian date
      const getJulianDate = (date) => {
        const time = date.getTime();
        return (time / 86400000) + 2440587.5;
      };
      
      const julianDate = getJulianDate(now);
      
      // Calculate moon's celestial coordinates
      // These are simplified calculations for demonstration
      const daysSince2000 = julianDate - 2451545.0;
      
      // Mean longitude of the moon
      const L = 218.316 + 13.176396 * daysSince2000;
      // Mean anomaly of the moon
      const M = 134.963 + 13.064993 * daysSince2000;
      // Moon's longitude
      const moonLong = L + 6.289 * Math.sin((M * Math.PI) / 180);
      
      // Convert to horizontal coordinates (simplified)
      // Using observer's location (approximate for Northern Hemisphere)
      const latitude = 40.0; // Default latitude (can be made dynamic)
      const hourAngle = ((now.getHours() + now.getMinutes() / 60) * 15) - 180;
      
      // Calculate approximate altitude and azimuth
      const altitude = 40 * Math.sin((moonLong - hourAngle) * Math.PI / 180) * 
                      Math.sin(latitude * Math.PI / 180);
      const azimuth = 90 + 70 * Math.sin((hourAngle - moonLong) * Math.PI / 180);
      
      // Check if moon is below horizon (or very close to it)
      // If altitude is below 5 degrees, switch to default mode
      setIsDefaultMode(altitude < 5);
      
      return { altitude, azimuth };
    };

    // Initial calculation
    setMoonPosition(calculateMoonPosition());
    
    // Update position every minute
    const interval = setInterval(() => {
      setMoonPosition(calculateMoonPosition());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Default beautiful position for the moon when not visible in real sky
  const defaultMoonPosition = useMemo(() => {
    // Place the moon in upper right quadrant by default
    return new THREE.Vector3(
      viewport.width * 0.35, // X position - right side
      viewport.height * 0.35, // Y position - upper area
      -30 // Z position - behind stars
    );
  }, [viewport]);
  
  // Convert altitude and azimuth to 3D position
  const calculatedMoonPosition = useMemo(() => {
    // Convert from astronomical coordinates to scene position
    // Azimuth: 0-360 degrees (0/360=North, 90=East, 180=South, 270=West)
    // Altitude: -90 to 90 degrees (-90=below horizon, 0=horizon, 90=zenith)
    
    // Scale the position to fit nicely in the viewport
    const radius = 40; // Distance from center
    const x = radius * Math.sin((moonPosition.azimuth * Math.PI) / 180);
    
    // Always keep moon above horizon for visibility
    const altitudeFactor = Math.max(0.1, (moonPosition.altitude + 10) / 90);
    const y = 20 * altitudeFactor; // Vertical position
    
    const z = -radius * Math.cos((moonPosition.azimuth * Math.PI) / 180);
    
    return new THREE.Vector3(x, y, z);
  }, [moonPosition]);
  
  // Use default or calculated position based on visibility
  const moonWorldPosition = isDefaultMode ? defaultMoonPosition : calculatedMoonPosition;
  
  // Moon size and appearance
  const moonSize = isDefaultMode ? 12 : 10; // Slightly larger in default mode for better visibility
  
  // Animate the moon with subtle floating
  useFrame((state) => {
    if (moonRef.current) {
      const time = state.clock.getElapsedTime() * 0.03;
      
      // Position based on chosen mode with subtle movement
      moonRef.current.position.x = moonWorldPosition.x + Math.sin(time) * 0.2;
      moonRef.current.position.y = moonWorldPosition.y + Math.cos(time * 0.7) * 0.1;
      moonRef.current.position.z = moonWorldPosition.z;
      
      // Add gentle rotation in default mode for visual interest
      if (isDefaultMode) {
        moonRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
      } else {
        // Moon always faces camera in real sky mode
        moonRef.current.rotation.x = state.camera.rotation.x;
        moonRef.current.rotation.y = state.camera.rotation.y;
        moonRef.current.rotation.z = state.camera.rotation.z;
      }
    }
  });
  
  return (
    <group ref={moonRef} position={moonWorldPosition}>
      {/* The moon with texture */}
      <sprite scale={[moonSize, moonSize, 1]}>
        <spriteMaterial
          map={moonTexture}
          transparent={true}
          opacity={0.95}
          depthTest={true}
          depthWrite={false}
          fog={false}
          sizeAttenuation={true}
        />
      </sprite>
    
    </group>
  );
};

// Main cosmic scene
const CosmicScene = () => {
  return (
    <>
      <color attach="background" args={['#050714']} />
      <ambientLight intensity={0.1} />
      
      <Stars count={100} />
      <ShootingStars />
      <RealMoon />
      
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