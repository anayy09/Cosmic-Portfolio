import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import useGitHubProjects from '../hooks/useGitHubProjects';
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch } from 'react-icons/fa';

const ProjectsSection = styled.section`
  min-height: 100vh;
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ProjectsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(66, 133, 244, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(66, 133, 244, 0.2);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProjectHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.light};
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  color: ${props => props.theme.colors.light};
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateY(-3px);
  }
`;

const ProjectBody = styled.div`
  padding: 0 1.5rem 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const ProjectLanguage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => {
      switch(props.language?.toLowerCase()) {
        case 'javascript': return '#F7DF1E';
        case 'typescript': return '#3178C6';
        case 'python': return '#3776AB';
        case 'java': return '#007396';
        case 'c#': return '#239120';
        case 'html': return '#E34F26';
        case 'css': return '#1572B6';
        case 'ruby': return '#CC342D';
        case 'go': return '#00ADD8';
        case 'php': return '#777BB4';
        case 'swift': return '#FA7343';
        case 'kotlin': return '#7F52FF';
        case 'rust': return '#DEA584';
        default: return '#8E8E8E';
      }
    }};
  }
`;

const ProjectStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ProjectTag = styled.span`
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: rgba(66, 133, 244, 0.2);
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.code};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(66, 133, 244, 0.3);
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff6b6b;
  padding: 2rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
`;

const ViewAllButton = styled(motion.a)`
  display: block;
  margin: 3rem auto 0;
  padding: 0.8rem 2rem;
  background: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  max-width: 200px;
  
  &:hover {
    background: rgba(66, 133, 244, 0.1);
    color: ${props => props.theme.colors.primary};
    transform: translateY(-3px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Projects = ({ githubUsername, customProjects = [] }) => {
  const { projects, loading, error } = useGitHubProjects(githubUsername);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const allProjects = [...customProjects, ...projects];
  
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  return (
    <ProjectsSection id="projects" ref={ref}>
      <SectionTitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        Featured Projects
      </SectionTitle>
      
      <SectionSubtitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        A collection of my recent work and personal projects
      </SectionSubtitle>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>
          <h3>Error Loading Projects</h3>
          <p>{error}</p>
        </ErrorMessage>
      ) : (
        <ProjectsContainer
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {allProjects.map(project => (
            <ProjectCard key={project.id} variants={itemVariants}>
              <ProjectHeader>
                <ProjectTitle>{project.name}</ProjectTitle>
                <ProjectLinks>
                  {project.url && (
                    <ProjectLink 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="View source code on GitHub"
                    >
                      <FaGithub />
                    </ProjectLink>
                  )}
                  {project.homepage && (
                    <ProjectLink 
                      href={project.homepage} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="View live project"
                    >
                      <FaExternalLinkAlt />
                    </ProjectLink>
                  )}
                </ProjectLinks>
              </ProjectHeader>
              
              <ProjectBody>
                <ProjectDescription>
                  {project.description}
                </ProjectDescription>
                
                {project.topics && project.topics.length > 0 && (
                  <ProjectTags>
                    {project.topics.slice(0, 4).map((topic, i) => (
                      <ProjectTag key={i}>{topic}</ProjectTag>
                    ))}
                  </ProjectTags>
                )}
                
                <ProjectFooter>
                  {project.language && (
                    <ProjectLanguage language={project.language}>
                      {project.language}
                    </ProjectLanguage>
                  )}
                  
                  {!project.isManual && (
                    <ProjectStats>
                      {project.stars !== undefined && (
                        <ProjectStat>
                          <FaStar /> {project.stars}
                        </ProjectStat>
                      )}
                      {project.forks !== undefined && ( 
                        <ProjectStat>
                          <FaCodeBranch /> {project.forks}
                        </ProjectStat>
                      )}
                    </ProjectStats>
                  )}
                </ProjectFooter>
              </ProjectBody>
            </ProjectCard>
          ))}
        </ProjectsContainer>
      )}

      <ViewAllButton
        href={`https://github.com/${githubUsername}?tab=repositories`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View All Projects
      </ViewAllButton>
    </ProjectsSection>
  );
};

export default Projects;