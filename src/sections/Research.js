import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiFileText, FiCpu } from 'react-icons/fi';

const domainFilters = ['All', 'Clinical AI', 'Systems', 'NLP'];

const domainAccent = {
  'Clinical AI': { color: '#0D9488', bg: 'rgba(13, 148, 136, 0.1)', border: 'rgba(13, 148, 136, 0.22)' },
  'Systems': { color: '#5B8DEF', bg: 'rgba(91, 141, 239, 0.1)', border: 'rgba(91, 141, 239, 0.2)' },
  'NLP': { color: '#7B68B6', bg: 'rgba(123, 104, 182, 0.1)', border: 'rgba(123, 104, 182, 0.2)' },
};

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
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2.25rem;
  max-width: 52ch;
`;

const FilterRow = styled(motion.div)`
  display: flex;
  gap: 0.35rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.4rem 0.875rem;
  border-radius: ${props => props.theme.radius.pill};
  border: 1px solid ${props => props.$active
    ? 'rgba(91, 141, 239, 0.4)'
    : 'rgba(91, 141, 239, 0.1)'};
  background: ${props => props.$active
    ? 'rgba(91, 141, 239, 0.12)'
    : 'transparent'};
  color: ${props => props.$active
    ? props.theme.colors.primary
    : props.theme.colors.muted};
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.3);
    color: ${props => props.theme.colors.light};
  }
`;

const SubSection = styled.div`
  margin-bottom: 3rem;
`;

const SubLabel = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;

  span {
    font-family: ${props => props.theme.fonts.code};
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${props => props.theme.colors.muted};
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(91, 141, 239, 0.1);
    max-width: 200px;
  }
`;

const PublicationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const PubCard = styled(motion.div)`
  padding: 1.25rem 1.5rem;
  background: rgba(14, 20, 32, 0.65);
  border: 1px solid rgba(91, 141, 239, 0.1);
  border-radius: ${props => props.theme.radius.lg};
  transition: border-color 0.22s ease, background 0.22s ease;
  cursor: default;
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  &:hover {
    border-color: rgba(91, 141, 239, 0.22);
    background: rgba(14, 20, 32, 0.8);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1rem 1.1rem;
    flex-direction: column;
  }
`;

const PubIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${props => props.theme.radius.md};
  background: rgba(91, 141, 239, 0.1);
  border: 1px solid rgba(91, 141, 239, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
  font-size: 0.9rem;
  margin-top: 1px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const PubBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const PubTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.01em;
  margin: 0 0 0.35rem 0;
  line-height: 1.45;
`;

const PubMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
`;

const PubJournal = styled.span`
  font-family: ${props => props.theme.fonts.main};
  font-size: 0.82rem;
  color: ${props => props.theme.colors.muted};
  font-style: italic;
`;

const PubYear = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.72rem;
  color: ${props => props.theme.colors.subtle};
  letter-spacing: 0.06em;
`;

const PubDesc = styled.p`
  font-size: 0.845rem;
  line-height: 1.65;
  color: ${props => props.theme.colors.muted};
  margin: 0.35rem 0 0.625rem 0;
  max-width: none;
`;

const PubFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const DomainBadge = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.18rem 0.55rem;
  border-radius: ${props => props.theme.radius.pill};
  background: ${props => domainAccent[props.$domain]?.bg || 'rgba(91, 141, 239, 0.1)'};
  color: ${props => domainAccent[props.$domain]?.color || '#5B8DEF'};
  border: 1px solid ${props => domainAccent[props.$domain]?.border || 'rgba(91, 141, 239, 0.2)'};
`;

const TypeBadge = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.18rem 0.55rem;
  border-radius: ${props => props.theme.radius.pill};
  background: rgba(201, 160, 220, 0.08);
  color: rgba(201, 160, 220, 0.75);
  border: 1px solid rgba(201, 160, 220, 0.14);
`;

const StatusBadge = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.18rem 0.55rem;
  border-radius: ${props => props.theme.radius.pill};
  background: ${props => props.$published
    ? 'rgba(72, 187, 120, 0.1)'
    : 'rgba(230, 180, 80, 0.1)'};
  color: ${props => props.$published ? '#48BB78' : '#E6B450'};
  border: 1px solid ${props => props.$published
    ? 'rgba(72, 187, 120, 0.2)'
    : 'rgba(230, 180, 80, 0.2)'};
`;

const PubLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: ${props => props.theme.colors.primary};
  margin-left: auto;
  transition: color 0.18s ease;

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const PatentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.875rem;

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const PatentCard = styled(motion.div)`
  padding: 1.25rem;
  background: rgba(14, 20, 32, 0.65);
  border: 1px solid rgba(91, 141, 239, 0.1);
  border-radius: ${props => props.theme.radius.lg};
  transition: border-color 0.22s ease, background 0.22s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.22);
    background: rgba(14, 20, 32, 0.8);
  }
`;

const PatentTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.01em;
  line-height: 1.45;
  margin: 0 0 0.75rem 0;
`;

const PatentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const PatentMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const PatentAppNo = styled.span`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.68rem;
  color: ${props => props.theme.colors.subtle};
  letter-spacing: 0.06em;
`;

const ORCIDLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: ${props => props.theme.colors.muted};
  border: 1px solid rgba(91, 141, 239, 0.15);
  padding: 0.4rem 0.875rem;
  border-radius: ${props => props.theme.radius.pill};
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.4);
    color: ${props => props.theme.colors.primary};
    background: rgba(91, 141, 239, 0.06);
  }
`;

const Research = ({ publications = [], patents = [], orcid }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const filteredPubs = activeFilter === 'All'
    ? publications
    : publications.filter(p => p.domain === activeFilter);

  const filteredPatents = activeFilter === 'All'
    ? patents
    : patents.filter(p => p.domain === activeFilter);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <Section id="research">
      <Container ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>{'// research.output'}</SectionLabel>
          <SectionTitle>Publications & Patents</SectionTitle>
          <SectionSubtitle>
            {publications.length} peer-reviewed papers across IEEE, Springer, and Journal of Carcinogenesis. {patents.length} Indian patents.
          </SectionSubtitle>

          <FilterRow>
            {domainFilters.map(filter => (
              <FilterButton
                key={filter}
                $active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </FilterButton>
            ))}
            {orcid && (
              <ORCIDLink
                href={`https://orcid.org/${orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -1 }}
                style={{ marginLeft: 'auto' }}
              >
                <span style={{ fontWeight: 700 }}>iD</span>
                ORCID
                <FiExternalLink size={10} />
              </ORCIDLink>
            )}
          </FilterRow>
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {(filteredPubs.length > 0) && (
              <SubSection>
                <SubLabel
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <FiFileText size={13} style={{ color: '#5B8DEF' }} />
                  <span>Publications</span>
                </SubLabel>

                <PublicationList>
                  {filteredPubs.map(pub => (
                    <PubCard
                      key={pub.id}
                      variants={itemVariants}
                      layout
                    >
                      <PubIcon>
                        <FiFileText />
                      </PubIcon>
                      <PubBody>
                        <PubTitle>{pub.title}</PubTitle>
                        <PubMeta>
                          <PubJournal>{pub.journal}</PubJournal>
                          <PubYear>{pub.year}</PubYear>
                        </PubMeta>
                        <PubDesc>{pub.description}</PubDesc>
                        <PubFooter>
                          {pub.domain && <DomainBadge $domain={pub.domain}>{pub.domain}</DomainBadge>}
                          <TypeBadge>{pub.type}</TypeBadge>
                          <StatusBadge $published={pub.status === 'Published'}>{pub.status}</StatusBadge>
                          {pub.url && (
                            <PubLink href={pub.url} target="_blank" rel="noopener noreferrer">
                              DOI <FiExternalLink size={10} />
                            </PubLink>
                          )}
                        </PubFooter>
                      </PubBody>
                    </PubCard>
                  ))}
                </PublicationList>
              </SubSection>
            )}

            {(filteredPatents.length > 0) && (
              <SubSection>
                <SubLabel
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <FiCpu size={13} style={{ color: '#0D9488' }} />
                  <span>Patents</span>
                </SubLabel>

                <PatentGrid>
                  {filteredPatents.map(patent => (
                    <PatentCard
                      key={patent.id}
                      variants={itemVariants}
                      layout
                    >
                      <PatentTitle>{patent.title}</PatentTitle>
                      <PatentMeta>
                        <PatentMetaRow>
                          {patent.domain && <DomainBadge $domain={patent.domain}>{patent.domain}</DomainBadge>}
                          <StatusBadge $published={patent.status === 'Published'}>{patent.status}</StatusBadge>
                        </PatentMetaRow>
                        <PatentAppNo>App. {patent.applicationNo} · {patent.country} · {patent.date}</PatentAppNo>
                      </PatentMeta>
                    </PatentCard>
                  ))}
                </PatentGrid>
              </SubSection>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </Section>
  );
};

export default Research;
