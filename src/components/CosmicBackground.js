import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import styled from 'styled-components';

const constellationsData = [
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
    lines: [[0, 1], [0, 3], [1, 2], [1, 4], [3, 5], [4, 5], [2, 3], [2, 4]]
  }
];

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background: #0A0B0F;
`;

function AnimatedStars() {
  const starsRef = useRef();

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.x = Math.sin(clock.getElapsedTime() / 70) / 22;
      starsRef.current.rotation.y = Math.cos(clock.getElapsedTime() / 70) / 22;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={130}
      depth={65}
      count={400}
      factor={5}
      saturation={0.12}
      fade
      speed={0.25}
    />
  );
}

const ShootingStars = () => {
  const count = 3;
  const shootingStars = useRef([]);
  const trailsGroup = useRef();

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
      trailLength: Math.floor(Math.random() * 8) + 10,
      nextActivationTime: 8 + Math.random() * 20,
    }));
    return shootingStars.current;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    shootingStars.current.forEach((star) => {
      if (!star.active && time > star.nextActivationTime) {
        star.active = true;
        star.trail = [];
        star.position.set(
          (Math.random() - 0.5) * 100,
          50 + Math.random() * 50,
          (Math.random() - 0.5) * 100
        );
        star.velocity.set(
          (Math.random() - 0.5) * 0.5,
          -1 - Math.random() * 1.5,
          (Math.random() - 0.5) * 0.5
        );
      }

      if (star.active) {
        star.position.add(star.velocity);
        star.trail.unshift({ ...star.position });
        if (star.trail.length > star.trailLength) star.trail.pop();

        if (star.position.y < -50) {
          star.active = false;
          star.nextActivationTime = time + 14 + Math.random() * 28;
        }
      }
    });

    if (trailsGroup.current) {
      while (trailsGroup.current.children.length > 0) {
        trailsGroup.current.remove(trailsGroup.current.children[0]);
      }

      shootingStars.current.forEach((star) => {
        if (star.active && star.trail.length > 1) {
          const points = star.trail.map(p => new THREE.Vector3(p.x, p.y, p.z));
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const colors = new Float32Array(points.length * 3);
          for (let i = 0; i < points.length; i++) {
            const fade = 1 - i / points.length;
            colors[i * 3] = fade;
            colors[i * 3 + 1] = fade;
            colors[i * 3 + 2] = fade;
          }
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
          });
          trailsGroup.current.add(new THREE.Line(geometry, material));
        }
      });
    }
  });

  return <group ref={trailsGroup} />;
};

const RealMoon = () => {
  const moonRef = useRef();
  const { viewport } = useThree();
  const moonTexture = useLoader(THREE.TextureLoader, '/moon.png');

  useEffect(() => {
    if (moonTexture) {
      moonTexture.minFilter = THREE.LinearFilter;
      moonTexture.generateMipmaps = false;
      moonTexture.anisotropy = 1;
    }
  }, [moonTexture]);

  const fixedMoonPosition = useMemo(() => new THREE.Vector3(
    viewport.width * 0.6,
    viewport.height * 0.05,
    -30
  ), [viewport]);

  const moonSize = 12;

  useFrame(({ clock }) => {
    if (moonRef.current) {
      const t = clock.getElapsedTime() * 0.03;
      moonRef.current.position.x = fixedMoonPosition.x + Math.sin(t) * 0.2;
      moonRef.current.position.y = fixedMoonPosition.y + Math.cos(t * 0.7) * 0.1;
      moonRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group ref={moonRef} position={fixedMoonPosition}>
      <sprite scale={[moonSize, moonSize, 1]}>
        <spriteMaterial
          map={moonTexture}
          transparent
          opacity={0.92}
          depthTest
          depthWrite={false}
          fog={false}
          sizeAttenuation
        />
      </sprite>
    </group>
  );
};

const Constellation = ({ data }) => {
  const { stars, lines, scale, position } = data;

  const starPoints = useMemo(() =>
    stars.map(star => new THREE.Vector3(...star.pos).multiplyScalar(scale)),
    [stars, scale]
  );

  const linePoints = useMemo(() => {
    const pts = [];
    lines.forEach(([s, e]) => { pts.push(starPoints[s]); pts.push(starPoints[e]); });
    return pts;
  }, [lines, starPoints]);

  const lineGeometry = useMemo(() =>
    new THREE.BufferGeometry().setFromPoints(linePoints), [linePoints]);

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
        <pointsMaterial attach="material" color="#c8d8f8" size={0.45} sizeAttenuation transparent opacity={0.65} />
      </points>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color="#8ab0ee" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
};

const Constellations = () => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
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

const CosmicScene = () => {
  return (
    <>
      <color attach="background" args={['#0A0B0F']} />
      <ambientLight intensity={0.06} />
      <AnimatedStars />
      <ShootingStars />
      <Constellations />
      <RealMoon />
      <EffectComposer>
        <Bloom
          intensity={0.22}
          luminanceThreshold={0.38}
          luminanceSmoothing={0.9}
        />
        <Vignette
          offset={0.3}
          darkness={0.55}
          eskil={false}
        />
      </EffectComposer>
    </>
  );
};

const CosmicBackground = () => {
  return (
    <BackgroundContainer>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <CosmicScene />
        </Suspense>
      </Canvas>
    </BackgroundContainer>
  );
};

export default CosmicBackground;
