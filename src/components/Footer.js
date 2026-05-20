import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

const FooterContainer = styled.footer`
  padding: 2rem 2rem;
  background: rgba(10, 11, 15, 0.6);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(91, 141, 239, 0.07);
  position: relative;
`;

const FooterContent = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FooterCopy = styled.p`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: ${props => props.theme.colors.subtle};
  max-width: none;
  margin: 0;
`;

const FooterStack = styled.p`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: rgba(74, 85, 104, 0.7);
  max-width: none;
  margin: 0;

  span {
    color: rgba(91, 141, 239, 0.5);
  }
`;

const ScrollToTop = styled(motion.button)`
  width: 34px;
  height: 34px;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.15);
  background: transparent;
  color: ${props => props.theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: rgba(91, 141, 239, 0.4);
    color: ${props => props.theme.colors.primary};
    background: rgba(91, 141, 239, 0.06);
  }
`;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterLeft>
          <FooterCopy>© {year} Anay Sinhal</FooterCopy>
          <FooterStack>
            Built with <span>React</span> · <span>Three.js</span> · <span>Framer Motion</span>
          </FooterStack>
        </FooterLeft>

        <ScrollToTop
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
        >
          <FiArrowUp size={15} />
        </ScrollToTop>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
