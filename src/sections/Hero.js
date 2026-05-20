import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi';
import useCountUp from '../hooks/useCountUp';

const scanLine = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  8% { opacity: 0.45; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const blinkCursor = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(91, 141, 239, 0.32), transparent);
    animation: ${scanLine} 3.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    pointer-events: none;
    z-index: 2;
  }
`;

const CoordinateAnnotation = styled(motion.div)`
  position: absolute;
  top: 5.5rem;
  left: 2rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: rgba(91, 141, 239, 0.3);
  text-transform: uppercase;
  pointer-events: none;
  user-select: none;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const Container = styled.div`
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem 4.5rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 1.5rem 3.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 1.25rem 3rem;
  }
`;

const SectionLabel = styled(motion.p)`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(91, 141, 239, 0.55);
  margin-bottom: 0.875rem;
`;

const MetaRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
  flex-wrap: wrap;
  min-height: 1.5rem;
`;

const TitleText = styled.span`
  font-family: ${props => props.theme.fonts.main};
  font-size: clamp(0.8rem, 1.5vw, 0.9375rem);
  font-weight: 400;
  color: ${props => props.theme.colors.muted};
  letter-spacing: 0.01em;
`;

const MiddleDot = styled.span`
  color: rgba(91, 141, 239, 0.22);
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const TypedRole = styled.span`
  font-family: ${props => props.theme.fonts.main};
  font-size: clamp(0.8rem, 1.5vw, 0.9375rem);
  font-weight: 500;
  color: rgba(201, 160, 220, 0.75);
`;

const Cursor = styled.span`
  animation: ${blinkCursor} 1s step-end infinite;
  color: rgba(201, 160, 220, 0.38);
  margin-left: 1px;
`;

const MetaDivider = styled.span`
  width: 1px;
  height: 13px;
  background: rgba(91, 141, 239, 0.18);
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.tabletL}) {
    display: none;
  }
`;

const StatsInline = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-left: auto;

  @media (max-width: ${props => props.theme.breakpoints.tabletL}) {
    display: none;
  }
`;

const StatUnit = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.28rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: ${props => props.theme.colors.subtle};
  text-transform: uppercase;
`;

const StatNumInline = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${props => props.theme.colors.muted};
  letter-spacing: -0.02em;
`;

const NameWrapper = styled.div`
  overflow: hidden;
  margin-bottom: 0;
`;

const HeroName = styled(motion.h1)`
  font-family: 'Atomic Age', ${props => props.theme.fonts.display};
  font-size: clamp(4.5rem, 10vw, 8rem);
  font-weight: 400;
  color: ${props => props.theme.colors.light};
  line-height: 0.92;
  letter-spacing: -0.03em;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: clamp(3.5rem, 13vw, 5rem);
  }
`;

const HeroRule = styled(motion.div)`
  height: 1px;
  background: linear-gradient(90deg, rgba(91, 141, 239, 0.22), rgba(91, 141, 239, 0.05) 55%, transparent);
  margin: 1.5rem 0 1.75rem;
`;

const MobileStats = styled(motion.div)`
  display: none;

  @media (max-width: ${props => props.theme.breakpoints.tabletL}) {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
`;

const MobileStatUnit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const MobileStatNum = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 1.15rem;
  font-weight: 400;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.02em;

  sup {
    font-size: 0.68rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileStatLabel = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.56rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.subtle};
`;

const Description = styled(motion.p)`
  font-size: 0.9375rem;
  line-height: 1.78;
  color: ${props => props.theme.colors.muted};
  max-width: 52ch;
  margin-bottom: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.875rem;
    margin-bottom: 1.75rem;
  }
`;

const ActionRow = styled(motion.div)`
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
  align-items: center;
`;

const PrimaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.6rem 1.35rem;
  background: ${props => props.theme.colors.primary};
  color: #fff;
  font-family: ${props => props.theme.fonts.main};
  font-size: 0.84rem;
  font-weight: 600;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid transparent;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: #4a7fdf;
    color: #fff;
    box-shadow: 0 0 26px rgba(91, 141, 239, 0.32);
  }
`;

const SecondaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.6rem 1.35rem;
  background: transparent;
  color: ${props => props.theme.colors.muted};
  font-family: ${props => props.theme.fonts.main};
  font-size: 0.84rem;
  font-weight: 400;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.15);
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    border-color: rgba(91, 141, 239, 0.38);
    background: rgba(91, 141, 239, 0.05);
    color: ${props => props.theme.colors.light};
  }
`;

const ActionSeparator = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(91, 141, 239, 0.12);
  margin: 0 0.125rem;
  flex-shrink: 0;
`;

const IconLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.1);
  color: ${props => props.theme.colors.subtle};
  background: transparent;
  transition: all 0.2s ease;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.58rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.02em;

  &:hover {
    border-color: rgba(91, 141, 239, 0.35);
    color: ${props => props.theme.colors.primary};
    background: rgba(91, 141, 239, 0.05);
  }
`;

const typewriterWords = [
  'Clinical AI Researcher',
  'Systems Engineer',
  'Health Data Builder',
  'Frontend Craftsperson',
];

const Hero = ({ name, title, description, github, linkedin, email, cv }) => {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const word = typewriterWords[wordIndex];
    const speed = isDeleting ? 38 : 78;
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === word) {
        setTimeout(() => setIsDeleting(true), 1900);
        return;
      }
      if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setWordIndex(i => (i + 1) % typewriterWords.length);
        return;
      }
      setDisplayText(prev =>
        isDeleting ? prev.slice(0, -1) : word.slice(0, prev.length + 1)
      );
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayText, wordIndex, isDeleting]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const pub = useCountUp(7, 1200, statsVisible);
  const pat = useCountUp(3, 1200, statsVisible);
  const inst = useCountUp(6, 1200, statsVisible);
  const tech = useCountUp(30, 1200, statsVisible);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
  };

  const nameVariants = {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <HeroSection id="home">
      <CoordinateAnnotation
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
      >
        // 29.6516° N · 82.3248° W · UF IC3
      </CoordinateAnnotation>

      <Container>
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SectionLabel variants={itemVariants}>// mission.brief</SectionLabel>

          <MetaRow variants={itemVariants}>
            <TitleText>{title}</TitleText>
            <MiddleDot aria-hidden="true">·</MiddleDot>
            <TypedRole>
              {displayText}<Cursor aria-hidden="true">|</Cursor>
            </TypedRole>
            <MetaDivider />
            <StatsInline>
              <StatUnit><StatNumInline>{pub}</StatNumInline> pubs</StatUnit>
              <StatUnit><StatNumInline>{pat}</StatNumInline> pat</StatUnit>
              <StatUnit><StatNumInline>{inst}+</StatNumInline> inst</StatUnit>
              <StatUnit><StatNumInline>{tech}+</StatNumInline> tech</StatUnit>
            </StatsInline>
          </MetaRow>

          <NameWrapper>
            <HeroName variants={nameVariants}>{name}</HeroName>
          </NameWrapper>

          <HeroRule variants={itemVariants} />

          <MobileStats variants={itemVariants}>
            <MobileStatUnit>
              <MobileStatNum>{pub}</MobileStatNum>
              <MobileStatLabel>Publications</MobileStatLabel>
            </MobileStatUnit>
            <MobileStatUnit>
              <MobileStatNum>{pat}</MobileStatNum>
              <MobileStatLabel>Patents</MobileStatLabel>
            </MobileStatUnit>
            <MobileStatUnit>
              <MobileStatNum>{inst}<sup>+</sup></MobileStatNum>
              <MobileStatLabel>Institutions</MobileStatLabel>
            </MobileStatUnit>
            <MobileStatUnit>
              <MobileStatNum>{tech}<sup>+</sup></MobileStatNum>
              <MobileStatLabel>Technologies</MobileStatLabel>
            </MobileStatUnit>
          </MobileStats>

          <Description variants={itemVariants}>{description}</Description>

          <ActionRow variants={itemVariants}>
            <PrimaryButton
              href={cv}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiFileText size={13} />
              View CV
            </PrimaryButton>
            <SecondaryButton
              href={`mailto:${email}`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiMail size={13} />
              Get in touch
            </SecondaryButton>
            <ActionSeparator />
            <IconLink
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              aria-label="GitHub"
            >
              <FiGithub size={15} />
            </IconLink>
            <IconLink
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              aria-label="LinkedIn"
            >
              <FiLinkedin size={15} />
            </IconLink>
            <IconLink
              href="https://orcid.org/0009-0008-8328-2336"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              aria-label="ORCID"
            >
              iD
            </IconLink>
          </ActionRow>
        </motion.div>
      </Container>
    </HeroSection>
  );
};

export default Hero;
