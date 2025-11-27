import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowUp } from 'react-icons/fa';

const FooterContainer = styled.footer`
  padding: 2.5rem 2rem;
  background: rgba(16, 22, 36, 0.6);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(91, 141, 239, 0.08);
  text-align: center;
  position: relative;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterText = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  
  a {
    color: ${props => props.theme.colors.primary};
    transition: color 0.25s ease;
    
    &:hover {
      color: ${props => props.theme.colors.accent};
    }
  }
`;

const FooterCredits = styled.p`
  color: rgba(136, 146, 166, 0.7);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  
  svg {
    color: ${props => props.theme.colors.accent};
    opacity: 0.8;
  }
`;

const ScrollToTopButton = styled(motion.button)`
  position: absolute;
  right: 2rem;
  top: -1.25rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.light};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(91, 141, 239, 0.15);
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.small};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  
  &:hover {
    transform: translateY(-3px);
    background: ${props => props.theme.colors.primaryMuted};
    box-shadow: ${props => props.theme.shadows.medium};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: 50%;
    transform: translateX(50%);
    
    &:hover {
      transform: translateX(50%) translateY(-3px);
    }
  }
`;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          © {currentYear} Anay Sinhal. All rights reserved.
        </FooterText>
        <FooterCredits>
          Built with <FaHeart /> using React and Three.js
        </FooterCredits>
      </FooterContent>
      
      <ScrollToTopButton
        onClick={scrollToTop}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowUp />
      </ScrollToTopButton>
    </FooterContainer>
  );
};

export default Footer;