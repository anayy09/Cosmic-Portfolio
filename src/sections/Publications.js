import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaLink, FaFilePdf, FaBookOpen } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';

const PublicationsSection = styled.section`
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
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const PublicationsContainer = styled(motion.div)`
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

const PublicationCard = styled(motion.div)`
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

const PublicationHeader = styled.div`
  padding: 1rem 1.5rem 0.5rem; // Adjusted padding
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PublicationTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.light};
  margin-bottom: 0.25rem;
  line-height: 1.3;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const PublicationLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: 0.5rem; // Space from title
  flex-shrink: 0; // Prevent shrinking
`;

const PublicationLink = styled.a`
  color: ${props => props.theme.colors.light};
  font-size: 1.1rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const PublicationBody = styled.div`
  padding: 0 1.5rem 1.5rem; // Consistent padding
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PublicationAuthors = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  font-style: italic;
`;

const PublicationJournal = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.75rem;
`;

const PublicationDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  flex-grow: 1;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const PublicationDOI = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: ${props => props.theme.fonts.code};
  margin-right: 1rem; // Add some space between DOI and Status
`;

const PublicationStatus = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 5px;
  align-self: flex-start;
  padding: 0.25rem 0.5rem;
  color: ${props => props.theme.colors.light};
  background-color: ${props => 
    props.status === 'Published' ? props.theme.colors.success : 
    props.status === 'Peer Review' ? props.theme.colors.info :
    props.status === 'Presented' ? props.theme.colors.warning :
    props.status === 'Submitted' ? props.theme.colors.info : 
    props.theme.colors.secondaryMuted
  };
`;

const PublicationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; // Push to the bottom of the card
`;

const Publications = () => {
  const { publications } = personalInfo;
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      // controls.start('hidden');
    }
  }, [controls, inView]);
  
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
  
  if (!publications || publications.length === 0) {
    return (
      <PublicationsSection id="publications" ref={ref}>
        <SectionTitle variants={titleVariants} initial="hidden" animate={controls}>
          Publications
        </SectionTitle>
        <SectionSubtitle variants={titleVariants} initial="hidden" animate={controls}>
          No publications listed at the moment.
        </SectionSubtitle>
      </PublicationsSection>
    );
  }
  
  return (
    <PublicationsSection id="publications" ref={ref}>
      <SectionTitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        My Publications
      </SectionTitle>
      
      <SectionSubtitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        Exploring the frontiers of technology through published work.
      </SectionSubtitle>
      
      <PublicationsContainer
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {publications.map(pub => (
          <PublicationCard key={pub.id || pub.title} variants={itemVariants}>
            <PublicationHeader>
              <PublicationTitle>{pub.title}</PublicationTitle>
              <PublicationLinks>
                {pub.url && (
                  <PublicationLink 
                    href={pub.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`Read ${pub.title}`}
                  >
                    {pub.url.toLowerCase().includes('pdf') ? <FaFilePdf /> : <FaLink />}
                  </PublicationLink>
                )}
                 {pub.doi && (
                  <PublicationLink
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View DOI for ${pub.title}`}
                  >
                    <FaBookOpen />
                  </PublicationLink>
                )}
              </PublicationLinks>
            </PublicationHeader>
            
            <PublicationBody>
              <PublicationAuthors>{pub.authors.join(', ')} {pub.year}</PublicationAuthors>
              <PublicationJournal>{pub.journal}</PublicationJournal>
              {pub.description && <PublicationDescription>{pub.description}</PublicationDescription>}
              <PublicationMeta>
                {pub.doi && <PublicationDOI>DOI: {pub.doi}</PublicationDOI>}
                {pub.status && <PublicationStatus status={pub.status}>{pub.status}</PublicationStatus>}
              </PublicationMeta>
            </PublicationBody>
          </PublicationCard>
        ))}
      </PublicationsContainer>
    </PublicationsSection>
  );
};

export default Publications;