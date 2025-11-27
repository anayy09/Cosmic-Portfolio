import React, { useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';

const ProjectsSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

const SectionHeader = styled.div`
  max-width: 1400px;
  margin: 0 auto 3rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const SectionTitleGroup = styled.div``;

const SectionLabel = styled(motion.span)`
  font-family: ${props => props.theme.fonts.code};
  color: ${props => props.theme.colors.primary};
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 4vw, 3rem);
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const ViewAllLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.muted};
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    svg {
      transform: translateX(4px);
    }
  }
`;

const BentoGrid = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: 1.25rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    gap: 1rem;
  }
`;

const getGridSpan = (index, isMobile) => {
  if (isMobile) return css`grid-column: span 1;`;
  
  // Bento layout pattern: featured (0), medium (1,2), small (3,4,5), medium (6,7), small (8)
  const patterns = [
    css`grid-column: span 8; grid-row: span 2;`, // Featured - large
    css`grid-column: span 4; grid-row: span 1;`, // Medium
    css`grid-column: span 4; grid-row: span 1;`, // Medium
    css`grid-column: span 4; grid-row: span 1;`, // Small
    css`grid-column: span 4; grid-row: span 1;`, // Small
    css`grid-column: span 4; grid-row: span 1;`, // Small
    css`grid-column: span 6; grid-row: span 1;`, // Wide
    css`grid-column: span 6; grid-row: span 1;`, // Wide
    css`grid-column: span 12; grid-row: span 1;`, // Full width
  ];
  
  return patterns[index % patterns.length];
};

const ProjectCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  ${props => getGridSpan(props.index, props.isMobile)}
  
  &:hover {
    border-color: rgba(91, 141, 239, 0.4);
    box-shadow: 0 20px 60px rgba(91, 141, 239, 0.15);
    transform: translateY(-4px);
  }
  
  ${props => props.isFeatured && css`
    background: linear-gradient(135deg, 
      ${props.theme.colors.surface} 0%, 
      rgba(91, 141, 239, 0.08) 100%
    );
  `}

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    border-radius: 16px;
  }
`;

const ProjectImage = styled.div`
  height: ${props => props.isFeatured ? '220px' : '140px'};
  background: linear-gradient(135deg, rgba(22, 30, 48, 0.8) 0%, rgba(15, 23, 41, 0.9) 100%);
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, ${props => props.theme.colors.surface});
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 120px;
  }
`;

const ProjectContent = styled.div`
  padding: ${props => props.isFeatured ? '1.5rem 2rem' : '1.25rem'};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1rem;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const ProjectTitle = styled.h3`
  font-size: ${props => props.isFeatured ? '1.5rem' : '1.1rem'};
  color: ${props => props.theme.colors.light};
  line-height: 1.3;
  margin: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.1rem;
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const ProjectLink = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.light};
  font-size: 0.9rem;
  transition: all 0.25s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.dark};
    transform: translateY(-2px);
  }
`;

const ProjectDescription = styled.p`
  font-size: ${props => props.isFeatured ? '0.95rem' : '0.85rem'};
  line-height: 1.65;
  color: ${props => props.theme.colors.muted};
  flex-grow: 1;
  margin: 0;
  
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.isFeatured ? 4 : 2};
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ProjectTag = styled.span`
  font-size: 0.7rem;
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  background: rgba(91, 141, 239, 0.1);
  color: ${props => props.theme.colors.primaryMuted};
  font-family: ${props => props.theme.fonts.code};
  border: 1px solid rgba(91, 141, 239, 0.15);
`;

const ProjectLanguage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.muted};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => {
      switch(props.language?.toLowerCase()) {
        case 'javascript': return '#F7DF1E';
        case 'typescript': return '#3178C6';
        case 'python': return '#3776AB';
        case 'java': return '#007396';
        case 'go': return '#00ADD8';
        default: return '#8E8E8E';
      }
    }};
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.35rem 0.85rem;
  background: ${props => props.theme.gradients.nebula};
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
`;

const Projects = ({ githubUsername = '' }) => {
  const customProjects = personalInfo.customProjects || [];
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const sortedProjects = [...customProjects].sort((a, b) => {
    if (a.sortOrder && b.sortOrder) return a.sortOrder - b.sortOrder;
    return 0; 
  });

  const projectsToShow = isMobile ? sortedProjects.slice(0, 4) : sortedProjects;

  const headerVariants = {
    hidden: { opacity: 0, y: -20 }, 
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, 
        delayChildren: 0.2 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 }, 
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100, 
        damping: 12 
      }
    }
  };
  
  return (
    <ProjectsSection id="projects" ref={ref}>
      <SectionHeader>
        <SectionTitleGroup>
          <SectionLabel
            variants={headerVariants}
            initial="hidden"
            animate={controls}
          >
            Portfolio
          </SectionLabel>
          <SectionTitle
            variants={headerVariants}
            initial="hidden"
            animate={controls}
          >
            Featured Projects
          </SectionTitle>
        </SectionTitleGroup>
        
        <ViewAllLink
          href={`https://github.com/${githubUsername}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          variants={headerVariants}
          initial="hidden"
          animate={controls}
        >
          View all projects <FaArrowRight />
        </ViewAllLink>
      </SectionHeader>
      
      {projectsToShow.length === 0 ? (
        <motion.p
          style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}
          variants={headerVariants}
          initial="hidden"
          animate={controls}
        >
          No projects to display at the moment. Check back soon!
        </motion.p>
      ) : (
        <BentoGrid
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {projectsToShow.map((project, index) => (
            <ProjectCard 
              key={project.id || project.name} 
              variants={itemVariants}
              index={index}
              isMobile={isMobile}
              isFeatured={index === 0}
            >
              {index === 0 && <FeaturedBadge>Featured</FeaturedBadge>}
              
              {project.imageUrl && (
                <ProjectImage 
                  imageUrl={project.imageUrl} 
                  isFeatured={index === 0}
                />
              )}
              
              <ProjectContent isFeatured={index === 0}>
                <ProjectHeader>
                  <ProjectTitle isFeatured={index === 0}>{project.name}</ProjectTitle>
                  <ProjectLinks>
                    {project.url && (
                      <ProjectLink 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`View source code for ${project.name}`}
                      >
                        <FaGithub />
                      </ProjectLink>
                    )}
                    {project.homepage && (
                      <ProjectLink 
                        href={project.homepage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`View live demo for ${project.name}`}
                      >
                        <FaExternalLinkAlt />
                      </ProjectLink>
                    )}
                  </ProjectLinks>
                </ProjectHeader>
                
                <ProjectDescription isFeatured={index === 0}>
                  {project.description}
                </ProjectDescription>
                
                <ProjectFooter>
                  {project.topics && project.topics.length > 0 && (
                    <ProjectTags>
                      {project.topics.slice(0, index === 0 ? 4 : 2).map((topic, i) => (
                        <ProjectTag key={i}>{topic}</ProjectTag>
                      ))}
                    </ProjectTags>
                  )}
                  
                  {project.language && (
                    <ProjectLanguage language={project.language}>
                      {project.language}
                    </ProjectLanguage>
                  )}
                </ProjectFooter>
              </ProjectContent>
            </ProjectCard>
          ))}
        </BentoGrid>
      )}
    </ProjectsSection>
  );
};

export default Projects;