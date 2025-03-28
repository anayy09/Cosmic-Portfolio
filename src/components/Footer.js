import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowUp } from 'react-icons/fa';

const FooterContainer = styled.footer`
  padding: 3rem 2rem;
  background: rgba(10, 25, 47, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(66, 133, 244, 0.3);
  text-align: center;
  position: relative;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-bottom: 1rem;
  
  a {
    color: ${props => props.theme.colors.primary};
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.colors.accent};
    }
  }
`;

const FooterCredits = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    color: #ff6b6b;
  }
`;

const ScrollToTopButton = styled(motion.button)`
  position: absolute;
  right: 2rem;
  top: -1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.medium};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: 50%;
    transform: translateX(50%);
    
    &:hover {
      transform: translateX(50%) translateY(-5px);
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
        <FooterText>
          <a href="mailto:anaysinhal.edu@gmail.com">anaysinhal.edu@gmail.com</a>
        </FooterText>
        <FooterCredits>
          Built with <FaHeart /> using React and Three.js
        </FooterCredits>
      </FooterContent>
      
      <ScrollToTopButton
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowUp />
      </ScrollToTopButton>
    </FooterContainer>
  );
};

export default Footer;