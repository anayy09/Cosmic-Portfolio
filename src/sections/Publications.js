import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { FaLink, FaFilePdf, FaBookOpen, FaScroll, FaGraduationCap } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';

const PublicationsSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

const SectionHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  text-align: center;
`;

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

const TabsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2.5rem auto 3rem;
  max-width: 400px;
  background: ${props => props.theme.colors.surface};
  padding: 0.35rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.dark : props.theme.colors.muted};
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    font-size: 0.85rem;
  }
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? props.theme.colors.primary : 'rgba(91, 141, 239, 0.1)'};
    color: ${props => props.active ? props.theme.colors.dark : props.theme.colors.light};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

const ContentContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;

const PublicationsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const PublicationCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${props =>
    props.status === 'Published' ? 'linear-gradient(180deg, #2ed573 0%, #26de81 100%)' :
      props.status === 'Accepted' ? 'linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)' :
        'linear-gradient(180deg, #f093fb 0%, #f5576c 100%)'
  };
    opacity: 0.8;
  }
  
  &:hover {
    border-color: rgba(91, 141, 239, 0.35);
    box-shadow: 0 16px 50px rgba(91, 141, 239, 0.12);
    transform: translateY(-3px);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.25rem;
    border-radius: 14px;
  }
`;

const PublicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const PublicationTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.light};
  margin: 0;
  line-height: 1.4;
  font-weight: 600;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.95rem;
  }
`;

const PublicationLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const PublicationLink = styled.a`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.muted};
  font-size: 0.85rem;
  transition: all 0.25s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.dark};
  }
`;

const PublicationMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  // margin-bottom: 0.75rem;
`;

const PublicationJournal = styled.span`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.primaryMuted};
  font-weight: 500;
`;

const PublicationYear = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.colors.muted};
  font-family: ${props => props.theme.fonts.code};
`;

const PublicationStatus = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 50px;
  background: ${props =>
    props.status === 'Published' ? 'rgba(46, 213, 115, 0.15)' :
      props.status === 'Accepted' ? 'rgba(79, 172, 254, 0.15)' :
        'rgba(240, 147, 251, 0.15)'
  };
  color: ${props =>
    props.status === 'Published' ? '#2ed573' :
      props.status === 'Accepted' ? '#4facfe' :
        '#f093fb'
  };
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const PublicationDescription = styled.p`
  font-size: 0.85rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.muted};
  margin: 0;
  flex-grow: 1;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

// Patent specific styles
const PatentCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  
  &:hover {
    border-color: rgba(91, 141, 239, 0.35);
    box-shadow: 0 16px 50px rgba(91, 141, 239, 0.12);
    transform: translateY(-3px);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PatentIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0D0D12 0%, #101624 50%, #1A2540 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const PatentContent = styled.div`
  flex: 1;
`;

const PatentTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.light};
  margin: 0 0 0.75rem;
  line-height: 1.4;
  font-weight: 600;
`;

const PatentDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 1rem;
  
  color: ${props => props.theme.colors.muted};
`;

const PatentDetail = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  
  strong {
    color: ${props => props.theme.colors.light};
    font-weight: 500;
  }
`;

const PatentsGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${props => props.theme.colors.muted};
  
  svg {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }
`;

const Publications = () => {
  const { publications, patents } = personalInfo;
  const [activeTab, setActiveTab] = useState('publications');
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

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
        delayChildren: 0.1
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

  const hasPublications = publications && publications.length > 0;
  const hasPatents = patents && patents.length > 0;

  if (!hasPublications && !hasPatents) {
    return (
      <PublicationsSection id="publications" ref={ref}>
        <SectionHeader>
          <SectionLabel variants={headerVariants} initial="hidden" animate={controls}>
            Research
          </SectionLabel>
          <SectionTitle variants={headerVariants} initial="hidden" animate={controls}>
            Publications & Patents
          </SectionTitle>
        </SectionHeader>
        <EmptyState>
          <FaGraduationCap />
          <p>No publications or patents listed at the moment.</p>
        </EmptyState>
      </PublicationsSection>
    );
  }

  return (
    <PublicationsSection id="publications" ref={ref}>
      <SectionHeader>
        <SectionLabel variants={headerVariants} initial="hidden" animate={controls}>
          Research
        </SectionLabel>
        <SectionTitle variants={headerVariants} initial="hidden" animate={controls}>
          Publications & Patents
        </SectionTitle>
      </SectionHeader>

      <TabsContainer variants={headerVariants} initial="hidden" animate={controls}>
        <Tab
          active={activeTab === 'publications'}
          onClick={() => setActiveTab('publications')}
        >
          <FaBookOpen /> Publications {hasPublications && `(${publications.length})`}
        </Tab>
        <Tab
          active={activeTab === 'patents'}
          onClick={() => setActiveTab('patents')}
        >
          <FaScroll /> Patents {hasPatents && `(${patents.length})`}
        </Tab>
      </TabsContainer>

      <ContentContainer>
        <AnimatePresence mode="wait">
          {activeTab === 'publications' ? (
            <PublicationsGrid
              key="publications"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              {publications?.map(pub => (
                <PublicationCard key={pub.id || pub.title} variants={itemVariants} status={pub.status}>
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
                    </PublicationLinks>
                  </PublicationHeader>

                  <PublicationMeta style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '100%' }}>
                      <PublicationJournal>{pub.journal}</PublicationJournal>
                    </div>
                    <div style={{ width: '100%', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <PublicationYear>{pub.year}</PublicationYear>
                      <PublicationStatus status={pub.status}>{pub.status}</PublicationStatus>
                    </div>
                  </PublicationMeta>

                  {/* {pub.description && <PublicationDescription>{pub.description}</PublicationDescription>} */}
                </PublicationCard>
              ))}
            </PublicationsGrid>
          ) : (
            <PatentsGrid
              key="patents"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              {patents?.map(patent => (
                <PatentCard key={patent.id} variants={itemVariants}>
                  <PatentIcon>
                    <FaScroll />
                  </PatentIcon>
                  <PatentContent>
                    <PatentTitle>{patent.title}</PatentTitle>
                    <PatentDetails style={{ flexDirection: 'column', gap: '0.5rem' }}>
                      <PatentDetail style={{ display: 'flex', width: '100%' }}>
                        <strong>Application No:</strong> <span style={{ marginLeft: '0.4rem' }}>{patent.applicationNo}</span>
                      </PatentDetail>
                      <PatentDetail style={{ display: 'flex', width: '100%' }}>
                        <strong>Country:</strong> <span style={{ marginLeft: '0.4rem' }}>{patent.country}</span>
                      </PatentDetail>
                      <PatentDetail style={{ display: 'flex', width: '100%' }}>
                        <strong>Date:</strong> <span style={{ marginLeft: '0.4rem' }}>{patent.date}</span>
                      </PatentDetail>
                      {/* <PatentDetail style={{ display: 'flex', width: '100%', marginTop: '0.5rem' }}>
                        <PublicationStatus status={patent.status}>{patent.status}</PublicationStatus>
                      </PatentDetail> */}
                    </PatentDetails>
                  </PatentContent>
                </PatentCard>
              ))}
            </PatentsGrid>
          )}
        </AnimatePresence>
      </ContentContainer>
    </PublicationsSection>
  );
};

export default Publications;