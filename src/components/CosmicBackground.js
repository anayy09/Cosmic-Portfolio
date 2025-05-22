// src/components/CosmicBackground.js
import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei'; // Added Stars from drei
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

// Optional: Component to make stars slightly twinkle or move (User's suggestion)
function AnimatedStars() {
  const starsRef = useRef();

  useFrame(({ clock }) => {
    if (starsRef.current) {
      // Subtle rotation for a dynamic feel
      starsRef.current.rotation.x = Math.sin(clock.getElapsedTime() / 20) / 10;
      starsRef.current.rotation.y = Math.cos(clock.getElapsedTime() / 20) / 10;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={100} // Radius of the sphere on which stars are generated
      depth={50} // Depth of the star sphere
      count={2500} // Number of stars
      factor={4} // Star size factor
      saturation={0} // Star color saturation (0 for white)
      fade // Stars disappear when they are too far away
      speed={1} // Animation speed (if applicable to the internal animation)
    />
  );
}

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

  // Fixed position for the moon
  const fixedMoonPosition = useMemo(() => {
    // Place the moon in upper right quadrant
    return new THREE.Vector3(
      viewport.width * 0.35, // X position - right side
      viewport.height * 0.35, // Y position - upper area
      -30 // Z position - behind stars
    );
  }, [viewport]);
  
  // Moon size and appearance (can be a fixed value now)
  const moonSize = 12; // Fixed moon size
  
  // Animate the moon with subtle floating
  useFrame((state) => {
    if (moonRef.current) {
      const time = state.clock.getElapsedTime() * 0.03;
      
      // Position based on fixed position with subtle movement
      moonRef.current.position.x = fixedMoonPosition.x + Math.sin(time) * 0.2;
      moonRef.current.position.y = fixedMoonPosition.y + Math.cos(time * 0.7) * 0.1;
      moonRef.current.position.z = fixedMoonPosition.z;
      
      // Add gentle rotation for visual interest (was previously in defaultMode)
      moonRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    }
  });
  
  return (
    <group ref={moonRef} position={fixedMoonPosition}>
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
      
      <AnimatedStars /> {/* Replaced custom Stars with AnimatedStars */}
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
        <Suspense fallback={null}> {/* Added Suspense */}
          <CosmicScene />
        </Suspense>
      </Canvas>
    </BackgroundContainer>
  );
};

export default CosmicBackground;