import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';

const ProjectsSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem 2rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: clamp(1.8rem, 4vw, 3rem);
    margin-bottom: 0.8rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: 500px;
    margin: 0 auto 3rem;
    font-size: 1rem;
  }
`;

const ProjectsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    border-radius: 12px;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(66, 133, 244, 0.15);
    }
  }
`;

const ProjectImagePlaceholder = styled.div`
  display: block;
  height: 180px;
  background-color: rgba(255, 255, 255, 0.05);
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid rgba(66, 133, 244, 0.3);

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 100px;
  }
`;

const ProjectHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0.75rem 0.75rem;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.light};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.1rem;
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 0.8rem;
  }
`;

const ProjectLink = styled.a`
  color: ${props => props.theme.colors.light};
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateY(-3px);
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.1rem;
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const ProjectBody = styled.div`
  padding: 0 1rem 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 0.75rem 0.75rem;
  }
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  flex-grow: 1;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.8rem;
    line-height: 1.5;
  }
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
  font-size: 0.8rem;
  
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
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.7rem;
  margin-bottom: 1rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ProjectTag = styled.span`
  font-size: 0.7rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: rgba(66, 133, 244, 0.2);
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.code};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.75rem;
    padding: 0.25rem 0.7rem;
    border-radius: 15px;
  }
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
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin: 2.5rem auto 0;
    padding: 0.7rem 1.8rem;
    font-size: 0.9rem;
    max-width: 180px;
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const Projects = ({ githubUsername = '' }) => {
  const customProjects = personalInfo.customProjects || [];
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden'); // Optional: hide when out of view
    }
  }, [controls, inView]);
  
  // Use only custom projects
  const sortedProjects = [...customProjects].sort((a, b) => {
    if (a.sortOrder && b.sortOrder) return a.sortOrder - b.sortOrder;
    return 0; 
  });

  const titleVariants = {
    hidden: { opacity: 0, y: -30 }, 
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
        staggerChildren: 0.08, 
        delayChildren: 0.2 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 }, 
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120, 
        damping: 10 
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
        A collection of my personal projects.
      </SectionSubtitle>
      
      {sortedProjects.length === 0 ? (
        <SectionSubtitle 
            variants={titleVariants}
            initial="hidden"
            animate={controls}
        >
            No projects to display at the moment. Check back soon!
        </SectionSubtitle>
      ) : (
        <ProjectsContainer
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {sortedProjects.map(project => (
            <ProjectCard key={project.id || project.name} variants={itemVariants}>
              {project.imageUrl && <ProjectImagePlaceholder imageUrl={project.imageUrl} />}
              <ProjectHeader>
                <ProjectTitle>{project.name}</ProjectTitle>
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