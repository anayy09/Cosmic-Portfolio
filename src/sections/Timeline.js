import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const TimelineSection = styled.section`
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
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.02em;
  margin-bottom: 2.25rem;
`;

const TabsWrapper = styled(motion.div)`
  display: inline-flex;
  gap: 0.25rem;
  background: rgba(14, 20, 32, 0.7);
  padding: 0.3rem;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.1);
  margin-bottom: 3rem;
`;

const TabButton = styled.button`
  padding: 0.5rem 1.1rem;
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? '#fff' : props.theme.colors.muted};
  border: none;
  border-radius: ${props => props.theme.radius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${props => props.theme.fonts.main};

  &:hover:not([disabled]) {
    background: ${props => props.$active ? props.theme.colors.primary : 'rgba(91, 141, 239, 0.1)'};
    color: ${props => props.$active ? '#fff' : props.theme.colors.light};
  }
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TimelineSpine = styled.div`
  width: 2px;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(91, 141, 239, 0.3) 10%,
    rgba(123, 104, 182, 0.25) 90%,
    transparent
  );
  border-radius: 2px;
  position: relative;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const EntriesLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 2.25rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const EntriesRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 2.25rem;
  padding-top: 3.5rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileEntries = styled.div`
  display: none;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
`;


const ConnectorLine = styled.div`
  position: absolute;
  height: 1px;
  background: ${props => props.$type === 'experience'
    ? 'rgba(91, 141, 239, 0.2)'
    : 'rgba(123, 104, 182, 0.2)'};
  width: 2.25rem;
  top: 1.55rem;
  ${props => props.$side === 'left' ? 'right: -2.25rem;' : 'left: -2.25rem;'}

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const TimelineEntry = styled(motion.div)`
  position: relative;
`;

const EntryCard = styled(motion.div)`
  background: ${props => props.$expanded
    ? 'rgba(14, 20, 32, 0.85)'
    : 'rgba(14, 20, 32, 0.5)'};
  border: 1px solid ${props => props.$expanded
    ? (props.$type === 'experience' ? 'rgba(91, 141, 239, 0.3)' : 'rgba(123, 104, 182, 0.3)')
    : 'rgba(91, 141, 239, 0.1)'};
  border-radius: ${props => props.theme.radius.lg};
  padding: 1.1rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease;

  &:hover {
    border-color: ${props => props.$type === 'experience'
      ? 'rgba(91, 141, 239, 0.28)'
      : 'rgba(123, 104, 182, 0.28)'};
    background: rgba(14, 20, 32, 0.75);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
`;

const EntryIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.$type === 'experience'
    ? 'rgba(91, 141, 239, 0.12)'
    : 'rgba(123, 104, 182, 0.12)'};
  border: 1px solid ${props => props.$type === 'experience'
    ? 'rgba(91, 141, 239, 0.2)'
    : 'rgba(123, 104, 182, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;

  svg {
    font-size: 1rem;
    color: ${props => props.$type === 'experience'
      ? props.theme.colors.primary
      : props.theme.colors.secondary};
  }
`;

const EntryMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const EntryTitle = styled.h3`
  font-size: 0.975rem;
  font-weight: 600;
  color: ${props => props.theme.colors.light};
  margin: 0 0 0.15rem 0;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${props => props.$expanded && `
    white-space: normal;
    overflow: visible;
  `}
`;

const EntryOrg = styled.p`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.theme.colors.primaryMuted};
  margin: 0;
`;

const EntryRightMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  flex-shrink: 0;
`;

const TypeBadge = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.18rem 0.5rem;
  border-radius: ${props => props.theme.radius.pill};
  background: ${props => props.$type === 'experience'
    ? 'rgba(91, 141, 239, 0.1)'
    : 'rgba(123, 104, 182, 0.1)'};
  color: ${props => props.$type === 'experience'
    ? props.theme.colors.primary
    : props.theme.colors.secondary};
`;

const EntryDate = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.72rem;
  color: ${props => props.theme.colors.subtle};
`;

const ExpandedContent = styled(motion.div)`
  overflow: hidden;
`;

const ExpandedInner = styled.div`
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid rgba(91, 141, 239, 0.08);
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.75rem;
`;

const LogoBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${props => props.theme.radius.md};
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const FallbackInitials = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(91, 141, 239, 0.08);
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.code};
  font-weight: 600;
  font-size: 0.8rem;
`;

const FullDate = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.78rem;
  color: ${props => props.theme.colors.muted};
`;

const AwardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  padding: 0.22rem 0.6rem;
  border-radius: ${props => props.theme.radius.pill};
  background: rgba(212, 165, 116, 0.1);
  color: ${props => props.theme.colors.accentWarm};
  border: 1px solid rgba(212, 165, 116, 0.2);
  margin-top: 0.35rem;
`;

const EntryDescription = styled.p`
  font-size: 0.875rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.muted};
  margin: 0;
  max-width: none;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.875rem;
`;

const SkillTag = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  padding: 0.22rem 0.6rem;
  border-radius: ${props => props.theme.radius.pill};
  background: rgba(91, 141, 239, 0.08);
  color: ${props => props.theme.colors.primaryMuted};
  border: 1px solid rgba(91, 141, 239, 0.12);
`;

const LogoDisplay = ({ logoUrl, organizationName, getInitials }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => { setHasError(false); }, [logoUrl]);

  if (logoUrl && !hasError) {
    return (
      <img
        src={logoUrl}
        alt={`${organizationName} logo`}
        onError={() => setHasError(true)}
      />
    );
  }
  return <FallbackInitials>{getInitials(organizationName)}</FallbackInitials>;
};

const Timeline = ({ education, experience }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [timelineItems, setTimelineItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    let items = [];
    if (activeTab === 'all' || activeTab === 'education') {
      items = [...items, ...education.map(item => ({ ...item, type: 'education' }))];
    }
    if (activeTab === 'all' || activeTab === 'experience') {
      items = [...items, ...experience.map(item => ({ ...item, type: 'experience' }))];
    }
    items.sort((a, b) => {
      const parse = (d) => {
        if (!d || d === 'Present') return new Date();
        const parts = d.split(' ');
        return parts.length === 2 ? new Date(`${parts[0]} 1, ${parts[1]}`) : new Date(d);
      };
      return parse(b.endDate) - parse(a.endDate);
    });
    setTimelineItems(items);
    setExpandedId(null);
  }, [activeTab, education, experience]);

  const getInitials = (name) =>
    name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  const getShortDate = (startDate, endDate) => {
    const startYear = startDate?.split(' ').pop() || '';
    const endYear = !endDate || endDate === 'Present' ? 'Now' : endDate.split(' ').pop();
    return `${startYear}–${endYear}`;
  };

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  };

  const entryVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  const leftItems = timelineItems.filter((_, i) => i % 2 === 0);
  const rightItems = timelineItems.filter((_, i) => i % 2 === 1);

  const renderEntry = (item) => {
    const id = `${item.type}-${item.organization}-${item.startDate}`;
    const isExpanded = expandedId === id;

    return (
      <TimelineEntry key={id} variants={entryVariants}>
        <ConnectorLine
          $type={item.type}
          $side={leftItems.includes(item) ? 'left' : 'right'}
        />
        <EntryCard
          $expanded={isExpanded}
          $type={item.type}
          onClick={() => toggleExpand(id)}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
        >
          <EntryHeader>
            <EntryIconBox $type={item.type}>
              {item.type === 'experience' ? <FaBriefcase /> : <FaGraduationCap />}
            </EntryIconBox>
            <EntryMeta>
              <EntryTitle $expanded={isExpanded}>{item.title}</EntryTitle>
              <EntryOrg>{item.organization}</EntryOrg>
            </EntryMeta>
            <EntryRightMeta>
              <TypeBadge $type={item.type}>
                {item.type === 'experience' ? 'Work' : 'Study'}
              </TypeBadge>
              <EntryDate>{getShortDate(item.startDate, item.endDate)}</EntryDate>
            </EntryRightMeta>
          </EntryHeader>

          <AnimatePresence>
            {isExpanded && (
              <ExpandedContent
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              >
                <ExpandedInner>
                  <LogoRow>
                    <LogoBox>
                      <LogoDisplay
                        logoUrl={item.logoUrl}
                        organizationName={item.organization}
                        getInitials={getInitials}
                      />
                    </LogoBox>
                    <div>
                      <FullDate>{item.startDate} — {item.endDate || 'Present'}</FullDate>
                      {item.award && (
                        <AwardBadge>★ {item.award}</AwardBadge>
                      )}
                    </div>
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
    <TimelineSection id="timeline">
      <Container ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>{'// journey.log'}</SectionLabel>
          <SectionTitle>Experience & Education</SectionTitle>
          <TabsWrapper>
            {['all', 'experience', 'education'].map(tab => (
              <TabButton
                key={tab}
                $active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? 'All' : tab === 'experience' ? 'Work' : 'Study'}
              </TabButton>
            ))}
          </TabsWrapper>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <TimelineGrid>
              <EntriesLeft>
                {leftItems.map(item => renderEntry(item))}
              </EntriesLeft>
              <TimelineSpine />
              <EntriesRight>
                {rightItems.map(item => renderEntry(item))}
              </EntriesRight>
              <MobileEntries>
                {timelineItems.map(item => renderEntry(item))}
              </MobileEntries>
            </TimelineGrid>
          </motion.div>
        </AnimatePresence>
      </Container>
    </TimelineSection>
  );
};

export default Timeline;
