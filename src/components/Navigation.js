import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  transform-origin: left;
  z-index: 200;
`;

const NavContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0.875rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: ${props => props.$scrolled ? 'blur(16px)' : 'none'};
  background: ${props => props.$scrolled
    ? 'rgba(10, 11, 15, 0.88)'
    : 'transparent'};
  transition: background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease;
  box-shadow: ${props => props.$scrolled
    ? '0 1px 0 rgba(91, 141, 239, 0.10)'
    : 'none'};
`;

const Logo = styled(motion.button)`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.95rem;
  font-weight: 400;
  color: ${props => props.theme.colors.light};
  background: transparent;
  border: none;
  cursor: pointer;
  letter-spacing: 0.04em;
  padding: 0;

  span {
    color: ${props => props.theme.colors.primary};
  }

  &:hover span {
    color: ${props => props.theme.colors.accent};
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.75rem;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  font-family: ${props => props.theme.fonts.main};
  color: ${props => props.$active ? props.theme.colors.light : props.theme.colors.muted};
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  letter-spacing: 0.01em;
  transition: color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 1px;
    background: ${props => props.theme.colors.primary};
    transition: width 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }

  &:hover {
    color: ${props => props.theme.colors.light};
  }

  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: 1px solid rgba(91, 141, 239, 0.2);
  color: ${props => props.theme.colors.light};
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  z-index: 110;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.5);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const HamLine = styled.span`
  display: block;
  width: 16px;
  height: 1px;
  background: ${props => props.theme.colors.light};
  transition: all 0.25s ease;
  transform-origin: center;

  &:first-child {
    transform: ${props => props.$open ? 'rotate(45deg) translate(4px, 4px)' : 'none'};
  }

  &:last-child {
    transform: ${props => props.$open ? 'rotate(-45deg) translate(4px, -4px)' : 'none'};
    opacity: ${props => props.$open ? 1 : 1};
  }

  &:nth-child(2) {
    opacity: ${props => props.$open ? 0 : 1};
    width: ${props => props.$open ? '0' : '16px'};
  }
`;

const MobileOverlay = styled(motion.div)`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(10, 11, 15, 0.6);
  z-index: 104;
  backdrop-filter: blur(4px);

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  width: 72%;
  max-width: 320px;
  height: 100vh;
  background: rgba(10, 11, 15, 0.98);
  backdrop-filter: blur(24px);
  padding: 5rem 2rem 2rem;
  z-index: 105;
  border-left: 1px solid rgba(91, 141, 239, 0.12);
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileNavLink = styled(motion.a)`
  font-family: ${props => props.theme.fonts.main};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.light};
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(91, 141, 239, 0.07);
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '//';
    font-family: ${props => props.theme.fonts.code};
    font-size: 0.7rem;
    color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.subtle};
    transition: color 0.2s ease;
  }

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const navItems = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Timeline', href: '#timeline', id: 'timeline' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'Skills', href: '#skills', id: 'skills' },
  { name: 'Research', href: '#research', id: 'research' },
  { name: 'Journeys', href: '#journeys', id: 'journeys' },
  { name: 'Contact', href: '#contact', id: 'contact' },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    setScrolled(scrollTop > 50);
    setScrollProgress(progress);

    const sections = navItems.map(item => item.id);
    let current = 'home';

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) current = id;
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <ProgressBar
        style={{ scaleX: scrollProgress }}
        initial={{ scaleX: 0 }}
      />

      <NavContainer
        $scrolled={scrolled}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Logo
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          anay<span>.codes</span>
        </Logo>

        <NavLinks>
          {navItems.map((item, i) => (
            <NavLink
              key={item.name}
              href={item.href}
              $active={activeSection === item.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (i + 1), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {item.name}
            </NavLink>
          ))}
        </NavLinks>

        <MobileMenuButton
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <HamLine $open={mobileMenuOpen} />
          <HamLine $open={mobileMenuOpen} />
          <HamLine $open={mobileMenuOpen} />
        </MobileMenuButton>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <MobileOverlay
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileMenu
                key="menu"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              >
                {navItems.map((item, i) => (
                  <MobileNavLink
                    key={item.name}
                    href={item.href}
                    $active={activeSection === item.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </MobileNavLink>
                ))}
              </MobileMenu>
            </>
          )}
        </AnimatePresence>
      </NavContainer>
    </>
  );
};

export default Navigation;
