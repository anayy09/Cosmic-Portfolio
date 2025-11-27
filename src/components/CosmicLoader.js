import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Keyframe animations
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const orbitPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    opacity: 0.6;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

// Container for the loader
const LoaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0D0D12 0%, #101624 50%, #1A2540 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
`;

// Floating stars background
const StarsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle, rgba(232, 236, 244, 0.9) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${twinkle} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
`;

// Central cosmic orb
const OrbContainer = styled(motion.div)`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 4s ease-in-out infinite;
`;

const CosmicOrb = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(201, 160, 220, 0.4) 0%,
    rgba(123, 104, 182, 0.3) 40%,
    rgba(91, 141, 239, 0.2) 70%,
    transparent 100%
  );
  box-shadow: 
    0 0 40px rgba(91, 141, 239, 0.3),
    0 0 80px rgba(123, 104, 182, 0.2),
    inset 0 0 30px rgba(201, 160, 220, 0.1);
  animation: ${orbitPulse} 3s ease-in-out infinite;
`;

// Orbiting rings
const OrbitRing = styled(motion.div)`
  position: absolute;
  border: 1px solid rgba(91, 141, 239, ${props => props.opacity || 0.2});
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

// Small orbiting dot
const OrbitDot = styled(motion.div)`
  position: absolute;
  width: 6px;
  height: 6px;
  background: ${props => props.color || 'rgba(201, 160, 220, 0.8)'};
  border-radius: 50%;
  box-shadow: 0 0 10px ${props => props.color || 'rgba(201, 160, 220, 0.5)'};
`;

const LoadingText = styled(motion.div)`
  color: #E8ECF4;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  font-weight: 300;
  letter-spacing: 0.25em;
  text-transform: lowercase;
  opacity: 0.7;
  margin-top: 2.5rem;
`;

const ProgressContainer = styled(motion.div)`
  margin-top: 1.5rem;
  width: 120px;
  height: 2px;
  background: rgba(91, 141, 239, 0.1);
  overflow: hidden;
  position: relative;
  border-radius: 2px;
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(91, 141, 239, 0.6) 0%, 
    rgba(123, 104, 182, 0.7) 50%,
    rgba(201, 160, 220, 0.8) 100%
  );
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(91, 141, 239, 0.3);
`;

// Generate random stars
const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }));
};

const stars = generateStars(50);

const CosmicLoader = ({ finishLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + Math.random() * 4 + 1;

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            finishLoading();
          }, 400);
          return 100;
        }

        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [finishLoading]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <LoaderContainer key="loader" variants={containerVariants} exit="exit">
        {/* Background stars */}
        <StarsContainer>
          {stars.map(star => (
            <Star
              key={star.id}
              size={star.size}
              left={star.left}
              top={star.top}
              duration={star.duration}
              delay={star.delay}
            />
          ))}
        </StarsContainer>

        {/* Central cosmic orb with orbiting elements */}
        <OrbContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Orbiting rings */}
          <OrbitRing 
            size={90} 
            opacity={0.15}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <OrbitRing 
            size={110} 
            opacity={0.1}
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Orbiting dots */}
          <motion.div
            style={{ position: 'absolute', width: 90, height: 90 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <OrbitDot 
              color="rgba(91, 141, 239, 0.9)"
              style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
            />
          </motion.div>
          
          <motion.div
            style={{ position: 'absolute', width: 110, height: 110 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <OrbitDot 
              color="rgba(201, 160, 220, 0.9)"
              style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
            />
          </motion.div>

          {/* Central orb */}
          <CosmicOrb />
        </OrbContainer>

        {/* Text and progress */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <LoadingText>exploring the cosmos</LoadingText>

          <ProgressContainer>
            <ProgressBar
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
                transition: {
                  duration: 0.15,
                  ease: 'easeOut'
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
