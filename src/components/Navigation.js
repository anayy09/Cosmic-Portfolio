import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const NavContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  background: ${props => props.scrolled 
    ? 'rgba(10, 25, 47, 0.85)' 
    : 'transparent'};
  transition: background 0.3s ease;
  box-shadow: ${props => props.scrolled 
    ? '0 10px 30px -10px rgba(0, 0, 0, 0.3)' 
    : 'none'};
`;

const Logo = styled(motion.div)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  
  span {
    color: ${props => props.theme.colors.accent};
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  color: ${props => props.theme.colors.light};
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${props => props.theme.colors.primary};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.light};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 110;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  width: 75%;
  max-width: 400px;
  height: 100vh;
  background: ${props => props.theme.colors.darkBlue};
  padding: 6rem 2rem 2rem;
  z-index: 105;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

const MobileNavLink = styled(motion.a)`
  color: ${props => props.theme.colors.light};
  font-size: 1.5rem;
  font-weight: 500;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blogs', href: '#blogs' },
    { name: 'Map', href: '#map' },
    { name: 'Contact', href: '#contact' }
  ];
  
  return (
    <NavContainer
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <Logo
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        anay<span>.</span>live
      </Logo>
      
      <NavLinks>
        {navItems.map((item, i) => (
          <NavLink
            key={item.name}
            href={item.href}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.name}
          </NavLink>
        ))}
      </NavLinks>
      
      <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? '✕' : '☰'}
      </MobileMenuButton>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {navItems.map((item, i) => (
              <MobileNavLink
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </MobileNavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default Navigation;