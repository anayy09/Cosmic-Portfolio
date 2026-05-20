import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.08); opacity: 0.8; }
`;

const LoaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0A0B0F 0%, #0E1520 60%, #130B20 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
`;

const StarsContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: radial-gradient(circle, rgba(232, 236, 244, 0.9) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${twinkle} ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
`;

const OrbWrapper = styled(motion.div)`
  position: relative;
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CoreOrb = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 32% 32%,
    rgba(201, 160, 220, 0.5) 0%,
    rgba(123, 104, 182, 0.35) 40%,
    rgba(91, 141, 239, 0.2) 70%,
    transparent 100%
  );
  box-shadow:
    0 0 32px rgba(91, 141, 239, 0.25),
    0 0 70px rgba(123, 104, 182, 0.15),
    inset 0 0 24px rgba(201, 160, 220, 0.12);
  animation: ${pulse} 3.2s ease-in-out infinite;
`;

const Ring = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(91, 141, 239, ${props => props.$opacity || 0.15});
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
`;

const Dot = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${props => props.$color};
  box-shadow: 0 0 8px ${props => props.$color};
  top: -2.5px;
  left: 50%;
  transform: translateX(-50%);
`;

const Label = styled(motion.div)`
  font-family: 'Fira Code', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: lowercase;
  color: rgba(136, 146, 166, 0.7);
  margin-top: 2.5rem;
`;

const ProgressTrack = styled(motion.div)`
  margin-top: 1.25rem;
  width: 110px;
  height: 1px;
  background: rgba(91, 141, 239, 0.1);
  border-radius: 1px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg,
    rgba(91, 141, 239, 0.7),
    rgba(123, 104, 182, 0.8),
    rgba(201, 160, 220, 0.9)
  );
  border-radius: 1px;
`;

const generateStars = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    $size: Math.random() * 2 + 0.5,
    $left: Math.random() * 100,
    $top: Math.random() * 100,
    $duration: Math.random() * 3 + 2.5,
    $delay: Math.random() * 4,
  }));

const stars = generateStars(55);

const CosmicLoader = ({ finishLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 3.5 + 1.2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(finishLoading, 450);
          return 100;
        }
        return next;
      });
    }, 55);

    return () => clearInterval(interval);
  }, [finishLoading]);

  return (
    <AnimatePresence mode="wait">
      <LoaderContainer
        key="loader"
        exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
      >
        <StarsContainer>
          {stars.map(star => (
            <Star
              key={star.id}
              $size={star.$size}
              $left={star.$left}
              $top={star.$top}
              $duration={star.$duration}
              $delay={star.$delay}
            />
          ))}
        </StarsContainer>

        <OrbWrapper
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Ring
            $size={92}
            $opacity={0.12}
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />
          <Ring
            $size={114}
            $opacity={0.08}
            animate={{ rotate: -360 }}
            transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            style={{ position: 'absolute', width: 92, height: 92 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          >
            <Dot $color="rgba(91, 141, 239, 0.9)" />
          </motion.div>
          <motion.div
            style={{ position: 'absolute', width: 114, height: 114 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          >
            <Dot $color="rgba(201, 160, 220, 0.85)" />
          </motion.div>
          <CoreOrb />
        </OrbWrapper>

        <motion.div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Label>{'// initializing observatory'}</Label>
          <ProgressTrack>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            />
          </ProgressTrack>
        </motion.div>
      </LoaderContainer>
    </AnimatePresence>
  );
};

export default CosmicLoader;
