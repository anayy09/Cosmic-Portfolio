import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

const Section = styled.section`
  padding: 6rem 0;
  position: relative;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 1.5rem;
  }
`;

const SectionLabel = styled(motion.p)`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.875rem;
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.02em;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const IntroCard = styled(motion.div)`
  grid-column: 1 / -1;
  padding: 0 0 0.25rem;
  border-left: none;

  p {
    font-size: clamp(1rem, 1.6vw, 1.125rem);
    line-height: 1.82;
    color: ${props => props.theme.colors.muted};
    max-width: 72ch;
    margin: 0;
  }
`;

const accentColors = {
  teal: {
    border: 'rgba(13, 148, 136, 0.2)',
    borderHover: 'rgba(13, 148, 136, 0.45)',
    label: '#0D9488',
    glow: 'rgba(13, 148, 136, 0.08)',
    glowHover: 'rgba(13, 148, 136, 0.14)',
  },
  blue: {
    border: 'rgba(91, 141, 239, 0.15)',
    borderHover: 'rgba(91, 141, 239, 0.4)',
    label: '#5B8DEF',
    glow: 'rgba(91, 141, 239, 0.06)',
    glowHover: 'rgba(91, 141, 239, 0.12)',
  },
  lavender: {
    border: 'rgba(123, 104, 182, 0.18)',
    borderHover: 'rgba(123, 104, 182, 0.42)',
    label: '#C9A0DC',
    glow: 'rgba(123, 104, 182, 0.06)',
    glowHover: 'rgba(123, 104, 182, 0.12)',
  },
};

const PillarCard = styled(motion.div)`
  padding: 1.75rem 2rem;
  background: rgba(14, 20, 32, 0.75);
  border-radius: ${props => props.theme.radius.lg};
  border: 1px solid ${props => accentColors[props.$accent]?.border || accentColors.blue.border};
  transition: border-color 0.25s ease, background 0.25s ease;
  cursor: default;

  &:hover {
    border-color: ${props => accentColors[props.$accent]?.borderHover || accentColors.blue.borderHover};
    background: ${props => accentColors[props.$accent]?.glowHover || accentColors.blue.glowHover};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

const PillarLabel = styled.p`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${props => accentColors[props.$accent]?.label || '#5B8DEF'};
  margin-bottom: 0.625rem;
`;

const PillarTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.05rem;
  font-weight: 600;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.01em;
  margin-bottom: 0.75rem;
`;

const PillarDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.muted};
  max-width: none;
`;

const About = ({ about }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (!about) return null;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <Section id="about" ref={ref}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <SectionLabel variants={itemVariants}>// about.me</SectionLabel>
          <SectionTitle variants={itemVariants}>Research Focus</SectionTitle>

          <IntroCard variants={itemVariants}>
            <p>{about.intro}</p>
          </IntroCard>

          <Grid style={{ marginTop: '1.75rem' }}>
            {about.pillars.map((pillar, i) => (
              <PillarCard
                key={pillar.id}
                $accent={pillar.accent}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 100, damping: 16 }}
              >
                <PillarLabel $accent={pillar.accent}>{pillar.label}</PillarLabel>
                <PillarTitle>{pillar.title}</PillarTitle>
                <PillarDescription>{pillar.description}</PillarDescription>
              </PillarCard>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Section>
  );
};

export default About;
