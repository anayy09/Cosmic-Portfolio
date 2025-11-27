import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const TimelineSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

const SectionHeader = styled.div`
  max-width: 1000px;
  margin: 0 auto 3rem;
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
  margin: 0 0 1.5rem 0;
`;

const TabsWrapper = styled(motion.div)`
  display: inline-flex;
  gap: 0.5rem;
  background: ${props => props.theme.colors.surface};
  padding: 0.35rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const TabButton = styled.button`
  padding: 0.6rem 1.25rem;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.dark : props.theme.colors.muted};
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? props.theme.colors.primary : 'rgba(91, 141, 239, 0.1)'};
    color: ${props => props.active ? props.theme.colors.dark : props.theme.colors.light};
  }
`;

const TimelineWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: auto 1fr;
  }
`;

/* Center spine */
const TimelineSpine = styled.div`
  position: relative;
  width: 5px;
  background: linear-gradient(
    180deg,
    ${props => props.theme.colors.primary}50 0%,
    ${props => props.theme.colors.secondary}50 100%
  );
  border-radius: 3px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 2px;
    margin: 0 1rem;
  }
`;

/* Timeline entries container */
const EntriesLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const EntriesRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding-left: 0;
  }
`;

/* Individual entry */
const TimelineEntry = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const EntryConnector = styled.div`
  position: absolute;
  width: 2rem;
  height: 2px;
  background: ${props => props.$type === 'experience' 
    ? 'rgba(91, 141, 239, 0.4)' 
    : 'rgba(139, 92, 246, 0.4)'};
  top: 1.5rem;
  ${props => props.$side === 'left' ? 'right: -2rem;' : 'left: -2rem;'}
  
  &::after {
    content: '';
    position: absolute;
    ${props => props.$side === 'left' ? 'right: -12px;' : 'left: -12px;'}
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${props => props.$active 
      ? (props.$type === 'experience' ? props.theme.colors.primary : props.theme.colors.secondary)
      : props.theme.colors.surface};
    border: 3px solid ${props => props.$active 
      ? (props.$type === 'experience' ? props.theme.colors.primary : props.theme.colors.secondary)
      : (props.$type === 'experience' ? 'rgba(91, 141, 239, 0.5)' : 'rgba(139, 92, 246, 0.5)')};
    transition: all 0.3s ease;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    left: -1rem;
    right: auto;
    width: 1rem;
    
    &::after {
      left: -6px;
      right: auto;
    }
  }
`;

const EntryCard = styled(motion.div)`
  background: ${props => props.$active 
    ? props.theme.colors.surface 
    : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.$active 
    ? (props.$type === 'experience' ? 'rgba(91, 141, 239, 0.4)' : 'rgba(139, 92, 246, 0.4)')
    : props.theme.colors.border};
  border-radius: 16px;
  padding: ${props => props.$active ? '1.25rem' : '1rem'};
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: ${props => props.$active ? 'blur(16px)' : 'none'};
  border-left: 3px solid ${props => props.$type === 'experience' 
    ? 'rgba(91, 141, 239, 0.6)' 
    : 'rgba(139, 92, 246, 0.6)'};
  
  &:hover {
    background: ${props => props.theme.colors.surface};
    border-color: ${props => props.$type === 'experience' 
      ? 'rgba(91, 141, 239, 0.3)' 
      : 'rgba(139, 92, 246, 0.3)'};
    border-left-color: ${props => props.$type === 'experience' 
      ? props.theme.colors.primary 
      : props.theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EntryIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$type === 'experience' 
    ? 'rgba(91, 141, 239, 0.15)' 
    : 'rgba(139, 92, 246, 0.15)'};
  border: 1px solid ${props => props.$type === 'experience' 
    ? 'rgba(91, 141, 239, 0.25)' 
    : 'rgba(139, 92, 246, 0.25)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    font-size: 1.2rem;
    color: ${props => props.$type === 'experience' 
      ? props.theme.colors.primary 
      : props.theme.colors.secondary};
  }
`;

const TypeLabel = styled.span`
  font-size: 0.65rem;
  font-family: ${props => props.theme.fonts.code};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: ${props => props.$type === 'experience' 
    ? 'rgba(91, 141, 239, 0.12)' 
    : 'rgba(139, 92, 246, 0.12)'};
  color: ${props => props.$type === 'experience' 
    ? props.theme.colors.primary 
    : props.theme.colors.secondary};
  margin-left: auto;
`;

const EntryMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const EntryTitle = styled.h3`
  font-size: ${props => props.$active ? '1.5rem' : '1.25rem'};
  color: ${props => props.theme.colors.light};
  margin: 0;
  font-weight: 600;
  white-space: ${props => props.$active ? 'normal' : 'nowrap'};
  overflow: ${props => props.$active ? 'visible' : 'hidden'};
  text-overflow: ellipsis;
  transition: all 0.3s ease;
`;

const EntryOrg = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.primaryMuted};
  margin: 0.15rem 0 0 0;
`;

const EntryDate = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 1rem;
  color: ${props => props.theme.colors.muted};
  white-space: nowrap;
`;

const EntryHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
`;

/* Expanded content */
const ExpandedContent = styled(motion.div)`
  overflow: hidden;
`;

const ExpandedInner = styled.div`
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 1rem;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const LogoContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const FallbackLogo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.gradients.nebulaSubtle};
  color: ${props => props.theme.colors.light};
  font-weight: 600;
  font-size: 1rem;
`;

const FullDate = styled.div`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.85rem;
  color: ${props => props.theme.colors.muted};
`;

const EntryDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.muted};
  margin: 0;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;
`;

const SkillTag = styled.span`
  font-size: 0.65rem;
  padding: 0.25rem 0.6rem;
  border-radius: 50px;
  background: rgba(91, 141, 239, 0.1);
  color: ${props => props.theme.colors.primaryMuted};
  font-family: ${props => props.theme.fonts.code};
  border: 1px solid rgba(91, 141, 239, 0.15);
`;

/* Mobile only - single column */
const MobileEntries = styled.div`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const LogoDisplay = ({ logoUrl, organizationName, getInitials }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [logoUrl]);

  if (logoUrl && !hasError) {
    return (
      <img
        src={logoUrl}
        alt={`${organizationName} logo`}
        onError={() => setHasError(true)}
      />
    );
  }
  return <FallbackLogo>{getInitials(organizationName)}</FallbackLogo>;
};

const Timeline = ({ education, experience }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [timelineItems, setTimelineItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const sectionControls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      sectionControls.start('visible');
    }
  }, [sectionControls, inView]);
  
  useEffect(() => {
    let items = [];
    
    if (activeTab === 'all' || activeTab === 'education') {
      items = [...items, ...education.map(item => ({ ...item, type: 'education' }))];
    }
    
    if (activeTab === 'all' || activeTab === 'experience') {
      items = [...items, ...experience.map(item => ({ ...item, type: 'experience' }))];
    }
    
    items.sort((a, b) => {
      const dateA = new Date(a.endDate || new Date());
      const dateB = new Date(b.endDate || new Date());
      return dateB - dateA;
    });
    
    setTimelineItems(items);
    setExpandedId(null);
  }, [activeTab, education, experience]);
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getShortDate = (startDate, endDate) => {
    const end = endDate || 'Present';
    const startYear = startDate?.split(' ').pop() || '';
    const endYear = end === 'Present' ? 'Now' : end.split(' ').pop();
    return `${startYear} - ${endYear}`;
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const wrapperVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const entryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  // Split items for left and right columns (desktop)
  const leftItems = timelineItems.filter((_, i) => i % 2 === 0);
  const rightItems = timelineItems.filter((_, i) => i % 2 === 1);

  const renderEntry = (item, side = 'right') => {
    const id = `${item.type}-${item.organization}-${item.title}`;
    const isExpanded = expandedId === id;
    
    return (
      <TimelineEntry key={id} variants={entryVariants}>
        <EntryConnector $side={side} $active={isExpanded} $type={item.type} />
        <EntryCard 
          $active={isExpanded}
          $type={item.type}
          onClick={() => toggleExpand(id)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <EntryHeader>
            <EntryIcon $type={item.type}>
              {item.type === 'experience' ? <FaBriefcase /> : <FaGraduationCap />}
            </EntryIcon>
            <EntryMeta>
              <EntryTitle $active={isExpanded}>{item.title}</EntryTitle>
              <EntryOrg>{item.organization}</EntryOrg>
            </EntryMeta>
            <EntryHeaderRight>
              <TypeLabel $type={item.type}>
                {item.type === 'experience' ? 'Work' : 'Study'}
              </TypeLabel>
              <EntryDate>{getShortDate(item.startDate, item.endDate)}</EntryDate>
            </EntryHeaderRight>
          </EntryHeader>
          
          <AnimatePresence>
            {isExpanded && (
              <ExpandedContent
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ExpandedInner>
                  <LogoRow>
                    <LogoContainer>
                      <LogoDisplay
                        logoUrl={item.logoUrl}
                        organizationName={item.organization}
                        getInitials={getInitials}
                      />
                    </LogoContainer>
                    <FullDate>{item.startDate} — {item.endDate || 'Present'}</FullDate>
                  </LogoRow>
                  
                  <EntryDescription>{item.description}</EntryDescription>
                  
                  {item.skills && item.skills.length > 0 && (
                    <SkillTags>
                      {item.skills.map((skill, i) => (
                        <SkillTag key={i}>{skill}</SkillTag>
                      ))}
                    </SkillTags>
                  )}
                </ExpandedInner>
              </ExpandedContent>
            )}
          </AnimatePresence>
        </EntryCard>
      </TimelineEntry>
    );
  };
  
  return (
    <TimelineSection id="timeline" ref={ref}>
      <SectionHeader>
        <SectionLabel variants={headerVariants} initial="hidden" animate={sectionControls}>
          Journey
        </SectionLabel>
        <SectionTitle variants={headerVariants} initial="hidden" animate={sectionControls}>
          Experience & Education
        </SectionTitle>
        
        <TabsWrapper variants={headerVariants} initial="hidden" animate={sectionControls}>
          <TabButton 
            active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            All
          </TabButton>
          <TabButton 
            active={activeTab === 'experience'} 
            onClick={() => setActiveTab('experience')}
          >
            Work
          </TabButton>
          <TabButton 
            active={activeTab === 'education'} 
            onClick={() => setActiveTab('education')}
          >
            Study
          </TabButton>
        </TabsWrapper>
      </SectionHeader>
      
      <AnimatePresence mode="wait">
        <TimelineWrapper 
          key={activeTab}
          variants={wrapperVariants} 
          initial="hidden" 
          animate="visible"
        >
          {/* Desktop: Alternating two-column layout */}
          <EntriesLeft>
            {leftItems.map(item => renderEntry(item, 'left'))}
          </EntriesLeft>
          
          <TimelineSpine />
          
          <EntriesRight>
            {/* Add spacer for first item offset */}
            <div style={{ height: '3rem' }} />
            {rightItems.map(item => renderEntry(item, 'right'))}
          </EntriesRight>
          
          {/* Mobile: Single column */}
          <MobileEntries>
            {timelineItems.map(item => renderEntry(item, 'right'))}
          </MobileEntries>
        </TimelineWrapper>
      </AnimatePresence>
    </TimelineSection>
  );
};

export default Timeline;