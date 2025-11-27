import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiZoomIn, FiZoomOut, FiMaximize } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CVContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.gradients.cosmic};
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.5rem;
  }
`;

const BackgroundEffects = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(91, 141, 239, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(123, 104, 182, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(201, 160, 220, 0.08) 0%, transparent 50%);
  }
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 10;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.light};
  text-decoration: none;
  padding: 0.65rem 1.25rem;
  border: 1px solid rgba(91, 141, 239, 0.25);
  border-radius: 6px;
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(91, 141, 239, 0.1);
    border-color: rgba(91, 141, 239, 0.4);
    transform: translateY(-2px);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.5rem 0.9rem;
    font-size: 0.85rem;
    justify-content: center;
  }
`;

const Title = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 600;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  letter-spacing: -0.02em;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.35rem;
    margin: 0;
  }
`;

const Controls = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.light};
  background: ${props => props.theme.colors.surface};
  border: 1px solid rgba(91, 141, 239, 0.25);
  padding: 0.65rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  
  &:hover {
    background: rgba(91, 141, 239, 0.1);
    border-color: rgba(91, 141, 239, 0.4);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.5rem 0.7rem;
    font-size: 0.85rem;
    gap: 0.3rem;
    
    .button-text {
      display: none;
    }
  }
`;

const ZoomLevel = styled.span`
  color: ${props => props.theme.colors.light};
  font-weight: 500;
  min-width: 50px;
  text-align: center;
`;

const PDFContainer = styled(motion.div)`
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.25rem;
    min-height: calc(100vh - 120px);
  }
`;

const PDFWrapper = styled.div`
  background: rgba(250, 250, 252, 0.97);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 
    ${props => props.theme.shadows.large},
    0 0 40px rgba(91, 141, 239, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(91, 141, 239, 0.1);
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  transform: scale(${props => props.zoom});
  transition: transform 0.3s ease;
  transform-origin: center center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.5rem;
    border-radius: 8px;
    margin: 0;
    width: 100%;
    box-shadow: 
      ${props => props.theme.shadows.medium},
      0 0 20px rgba(91, 141, 239, 0.08);
  }
`;

const PDFEmbed = styled.iframe`
  width: ${props => props.fullscreen ? '90vw' : '800px'};
  height: ${props => props.fullscreen ? '85vh' : '1000px'};
  border: none;
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadows.medium};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: ${props => props.fullscreen ? '95vw' : '100%'};
    height: ${props => props.fullscreen ? '80vh' : '600px'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100vw;
    height: 85vh;
    border-radius: 8px;
    min-height: 500px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.muted};
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 2px solid rgba(91, 141, 239, 0.2);
    border-top: 2px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CVViewer = () => {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const toggleFullscreen = () => {
    setFullscreen(prev => !prev);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <CVContainer>
      <BackgroundEffects />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header>
          <BackButton to="/" variants={itemVariants}>
            <FiArrowLeft />
            Back
          </BackButton>
          
          <Title variants={itemVariants}>
            Curriculum Vitae
          </Title>
          
          <Controls variants={itemVariants}>            
            <ControlButton onClick={toggleFullscreen}>
              <FiMaximize />
            </ControlButton>
          </Controls>
        </Header>
        
        <PDFContainer variants={itemVariants}>
          <PDFWrapper zoom={zoom}>
            {loading && (
              <LoadingSpinner>
                <div className="spinner"></div>
                <p>Loading CV...</p>
              </LoadingSpinner>
            )}
            <PDFEmbed
              src="/CV_Sinhal_Anay.pdf#toolbar=1&navpanes=0&scrollbar=1"
              title="Anay Sinhal - Curriculum Vitae"
              fullscreen={fullscreen}
              onLoad={() => setLoading(false)}
              style={{ display: loading ? 'none' : 'block' }}
            />
          </PDFWrapper>
        </PDFContainer>
      </motion.div>
    </CVContainer>
  );
};

export default CVViewer;
