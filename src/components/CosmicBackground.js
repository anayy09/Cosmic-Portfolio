// src/components/CosmicBackground.js
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei'; // Added Stars from drei
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import styled from 'styled-components';

// Data for constellations
const constellationsData = [
  // Ursa Major (part of it)
  {
    name: 'Ursa Major',
    scale: 3,
    position: [-60, 50, -180],
    stars: [
      { pos: [1, 2, 0], size: 1.5 }, { pos: [3.5, 1.8, 0], size: 1.5 },
      { pos: [5, 1, 0], size: 1.5 }, { pos: [6.5, 1.5, 0], size: 1.5 },
      { pos: [9, 2.5, 0], size: 1.5 }, { pos: [8.5, 4.5, 0], size: 1.5 },
      { pos: [6, 4, 0], size: 1.5 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6]]
  },
  // Cassiopeia
  {
    name: 'Cassiopeia',
    scale: 3,
    position: [60, 30, -150],
    stars: [
      { pos: [0, 0, 0], size: 1.5 }, { pos: [2, 1.5, 0], size: 1.5 },
      { pos: [4, 0, 0], size: 1.5 }, { pos: [6, 1.5, 0], size: 1.5 },
      { pos: [8, 0, 0], size: 1.5 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
  },
  // Orion
  {
    name: 'Orion',
    scale: 4,
    position: [10, -40, -120],
    stars: [
      { pos: [0, 10, 0], size: 2.0 }, { pos: [2, 9.5, 0], size: 2.0 },
      { pos: [1, 8, 0], size: 1.5 }, { pos: [0.5, 6, 0], size: 1.5 },
      { pos: [1.5, 6, 0], size: 1.5 }, { pos: [1, 4, 0], size: 2.0 },
      { pos: [3, 4.5, 0], size: 2.0 }
    ],
    lines: [[0, 1], [0, 3], [1, 2], [1, 4], [3, 5], [4, 5], [2,3], [2,4]]
  }
];

// Styled component for the canvas container
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background: #0D0D12; /* Subtle warm-tinted deep black */
`;

// Gentle star field with slow rotation for calm cosmic ambiance
function AnimatedStars() {
  const starsRef = useRef();

  useFrame(({ clock }) => {
    if (starsRef.current) {
      // Very slow, subtle rotation for serene feel
      starsRef.current.rotation.x = Math.sin(clock.getElapsedTime() / 60) / 20;
      starsRef.current.rotation.y = Math.cos(clock.getElapsedTime() / 60) / 20;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={120} // Slightly larger sphere
      depth={60} // More depth for layering
      count={350} // Fewer stars for elegance
      factor={6} // Smaller, more refined stars
      saturation={0.1} // Slight color tint
      fade // Stars disappear when they are too far away
      speed={0.3} // Slower subtle animation
    />
  );
}

// Occasional shooting stars with gentle tails
const ShootingStars = () => {
  // Fewer shooting stars for subtlety
  const count = 3;
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
        (Math.random() - 0.5) * 0.3,
        -0.6 - Math.random() * 0.8,
        (Math.random() - 0.5) * 0.3
      ),
      trail: [],
      trailLength: Math.floor(Math.random() * 8) + 10, // Shorter, more refined trail
      nextActivationTime: Math.random() * 20 // Longer delay between stars
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
          star.nextActivationTime = time + 12 + Math.random() * 25; // Longer wait for subtlety
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
            const _alpha = 1 - i / points.length; // eslint-disable-line no-unused-vars
            colors[i3] = 1;     // R
            colors[i3 + 1] = 1; // G
            colors[i3 + 2] = 1; // B
          }
          
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          
          // Create the line material
          const material = new THREE.LineBasicMaterial({
            color: 0xe8ecf4,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
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

// A single constellation
const Constellation = ({ data }) => {
  const { stars, lines, scale, position } = data;

  const starPoints = useMemo(() => 
    stars.map(star => new THREE.Vector3(...star.pos).multiplyScalar(scale)),
    [stars, scale]
  );

  const linePoints = useMemo(() => {
    const points = [];
    lines.forEach(([start, end]) => {
      points.push(starPoints[start]);
      points.push(starPoints[end]);
    });
    return points;
  }, [lines, starPoints]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(linePoints), [linePoints]);

  return (
    <group position={position}>
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={starPoints.length}
            array={new Float32Array(starPoints.flatMap(p => p.toArray()))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          attach="material"
          color="#ffffff"
          size={0.5}
          sizeAttenuation
          transparent
          opacity={0.7}
        />
      </points>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          attach="material"
          color="#ffffff"
          transparent
          opacity={0.2}
        />
      </lineSegments>
    </group>
  );
};

// Group of all constellations with rotation
const Constellations = () => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Very slow constellation drift
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.003;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.002) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {constellationsData.map(constellation => (
        <Constellation key={constellation.name} data={constellation} />
      ))}
    </group>
  );
};

// Main cosmic scene
const CosmicScene = () => {
  return (
    <>
      <color attach="background" args={['#0D0D12']} />
      <ambientLight intensity={0.08} />
      
      <AnimatedStars />
      <ShootingStars />
      <Constellations />
      <RealMoon />
      
      <EffectComposer>
        <Bloom
          intensity={0.25}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.95}
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