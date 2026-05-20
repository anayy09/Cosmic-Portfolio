import React, { useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';

const langColor = (lang) => {
  switch (lang?.toLowerCase()) {
    case 'typescript': return '#3178C6';
    case 'python': return '#3776AB';
    case 'javascript': return '#F7DF1E';
    case 'java': return '#007396';
    case 'go': return '#00ADD8';
    default: return '#6B7280';
  }
};

const domainStyles = {
  health: { bg: 'rgba(13, 148, 136, 0.1)', color: '#0D9488', border: 'rgba(13, 148, 136, 0.25)' },
  systems: { bg: 'rgba(91, 141, 239, 0.1)', color: '#5B8DEF', border: 'rgba(91, 141, 239, 0.22)' },
  nlp: { bg: 'rgba(123, 104, 182, 0.1)', color: '#7B68B6', border: 'rgba(123, 104, 182, 0.22)' },
};

const ProjectsSection = styled.section`
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.875rem;
    margin-bottom: 2rem;
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
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.02em;
  margin: 0;
`;

const ViewAllLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${props => props.theme.colors.muted};
  font-size: 0.85rem;
  font-family: ${props => props.theme.fonts.code};
  letter-spacing: 0.04em;
  transition: color 0.2s ease;
  white-space: nowrap;
  padding-bottom: 0.25rem;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    color: ${props => props.theme.colors.primary};
    svg { transform: translateX(3px); }
  }
`;

const getGridSpan = (index) => {
  const patterns = [
    css`grid-column: span 8; grid-row: span 2;`,
    css`grid-column: span 4; grid-row: span 1;`,
    css`grid-column: span 4; grid-row: span 1;`,
    css`grid-column: span 4; grid-row: span 1;`,
    css`grid-column: span 4; grid-row: span 1;`,
    css`grid-column: span 4; grid-row: span 1;`,
  ];
  return patterns[index] || css`grid-column: span 4; grid-row: span 1;`;
};

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(130px, auto);
  gap: 1.1rem;

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: auto;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    gap: 0.875rem;
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(14, 20, 32, 0.72);
  border-radius: ${props => props.theme.radius.lg};
  border: 1px solid rgba(91, 141, 239, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  ${props => getGridSpan(props.$index)}

  &:hover {
    border-color: ${props => props.$domain === 'health'
      ? 'rgba(13, 148, 136, 0.35)'
      : 'rgba(91, 141, 239, 0.32)'};
    box-shadow: ${props => props.$domain === 'health'
      ? '0 8px 32px rgba(13, 148, 136, 0.1)'
      : '0 8px 32px rgba(91, 141, 239, 0.1)'};
  }

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    grid-column: span 3 !important;
    grid-row: span 1 !important;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
`;

const FeaturedImageArea = styled.div`
  height: ${props => props.$featured ? '220px' : '0'};
  background: rgba(8, 12, 20, 0.6);
  background-image: url(${props => props.$img});
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(14, 20, 32, 0.95));
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: ${props => props.$featured ? '140px' : '0'};
  }
`;

const CardContent = styled.div`
  padding: ${props => props.$featured ? '1.1rem 1.4rem 1.25rem' : '1.1rem 1.2rem'};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: ${props => props.$featured ? '1.05rem' : '0.95rem'};
  font-weight: 600;
  color: ${props => props.theme.colors.light};
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.01em;
`;

const CardLinks = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
`;

const CardLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: ${props => props.theme.radius.sm};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${props => props.theme.colors.muted};
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: #fff;
    transform: translateY(-1px);
  }
`;

const ProjectDesc = styled.p`
  font-size: 0.855rem;
  line-height: 1.65;
  color: ${props => props.theme.colors.muted};
  flex: 1;
  margin: 0 0 0.875rem 0;
  max-width: none;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.$featured ? 3 : 2};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const DomainBadge = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: ${props => props.theme.radius.pill};
  background: ${props => domainStyles[props.$domain]?.bg || domainStyles.systems.bg};
  color: ${props => domainStyles[props.$domain]?.color || domainStyles.systems.color};
  border: 1px solid ${props => domainStyles[props.$domain]?.border || domainStyles.systems.border};
`;

const TopicTag = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.62rem;
  padding: 0.18rem 0.5rem;
  border-radius: ${props => props.theme.radius.pill};
  background: rgba(91, 141, 239, 0.07);
  color: ${props => props.theme.colors.primaryMuted};
  border: 1px solid rgba(91, 141, 239, 0.12);
`;

const LangDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.subtle};
  margin-left: auto;

  &::before {
    content: '';
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${props => langColor(props.$lang)};
  }
`;

const FeaturedLabel = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.22rem 0.6rem;
  border-radius: ${props => props.theme.radius.pill};
  background: rgba(91, 141, 239, 0.15);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(91, 141, 239, 0.25);
  z-index: 2;
`;

const Projects = ({ githubUsername = '', customProjects }) => {
  const projects = customProjects || personalInfo.customProjects || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const displayed = isMobile ? projects.slice(0, 4) : projects;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <ProjectsSection id="projects">
      <Container ref={ref}>
        <SectionHeader>
          <div>
            <SectionLabel
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              // work.built
            </SectionLabel>
            <SectionTitle
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              Featured Projects
            </SectionTitle>
          </div>

          <ViewAllLink
            href={`https://github.com/${githubUsername}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            All repos <FaArrowRight size={11} />
          </ViewAllLink>
        </SectionHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <BentoGrid>
            {displayed.map((project, i) => (
              <ProjectCard
                key={project.id}
                $index={i}
                $domain={project.domain}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 100, damping: 16 }}
              >
                {i === 0 && <FeaturedLabel>Featured</FeaturedLabel>}

                <FeaturedImageArea
                  $featured={i === 0}
                  $img={project.imageUrl}
                />

                <CardContent $featured={i === 0}>
                  <CardTopRow>
                    <ProjectTitle $featured={i === 0}>{project.name}</ProjectTitle>
                    <CardLinks>
                      {project.url && (
                        <CardLink
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          onClick={e => e.stopPropagation()}
                        >
                          <FaGithub />
                        </CardLink>
                      )}
                      {project.homepage && (
                        <CardLink
                          href={project.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live demo"
                          onClick={e => e.stopPropagation()}
                        >
                          <FaExternalLinkAlt />
                        </CardLink>
                      )}
                    </CardLinks>
                  </CardTopRow>

                  <ProjectDesc $featured={i === 0}>{project.description}</ProjectDesc>

                  <CardFooter>
                    {project.domain && (
                      <DomainBadge $domain={project.domain}>
                        {project.domain === 'health' ? 'Health AI' : project.domain === 'nlp' ? 'NLP' : 'Systems'}
                      </DomainBadge>
                    )}
                    {project.topics?.slice(0, 2).map(t => (
                      <TopicTag key={t}>{t}</TopicTag>
                    ))}
                    {project.language && (
                      <LangDot $lang={project.language}>{project.language}</LangDot>
                    )}
                  </CardFooter>
                </CardContent>
              </ProjectCard>
            ))}
          </BentoGrid>
        </motion.div>
      </Container>
    </ProjectsSection>
  );
};

export default Projects;
