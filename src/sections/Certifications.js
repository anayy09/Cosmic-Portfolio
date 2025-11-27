import React, { useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaExternalLinkAlt, FaAward, FaMedal } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';

const CertificationsSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionSubtitle = styled.p`
  max-width: 500px;
  margin: 0 auto;
  font-size: 1rem;
  color: ${props => props.theme.colors.muted};
  line-height: 1.6;
`;

const IssuerGroupsContainer = styled(motion.div)`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const IssuerGroup = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2rem;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

const IssuerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const IssuerLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  
  img {
    width: 75%;
    height: 75%;
    object-fit: contain;
  }
`;

const IssuerFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.gradients.nebula};
  color: ${props => props.theme.colors.light};
  font-weight: 600;
  font-size: 1.1rem;
`;

const IssuerInfo = styled.div`
  flex: 1;
`;

const IssuerName = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.light};
  margin-bottom: 0.25rem;
`;

const CertCount = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.muted};
`;

const BadgesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const BadgeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(91, 141, 239, 0.2);
    transform: translateX(4px);
  }
`;

const BadgeIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.theme.gradients.nebula};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.light};
  }
`;

const BadgeContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const BadgeName = styled.h4`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.light};
  margin-bottom: 0.35rem;
  font-weight: 500;
  line-height: 1.3;
`;

const BadgeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const BadgeDate = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.muted};
`;

const VerifyLink = styled.a`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.accent};
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
  
  svg {
    font-size: 0.65rem;
  }
`;

const Certifications = () => {
  const { certifications } = personalInfo;
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Group certifications by issuing organization
  const groupedCerts = useMemo(() => {
    if (!certifications || certifications.length === 0) return {};
    
    return certifications.reduce((groups, cert) => {
      const issuer = cert.issuingOrganization || 'Other';
      if (!groups[issuer]) {
        groups[issuer] = {
          name: issuer,
          logoUrl: cert.logoUrl,
          certs: []
        };
      }
      groups[issuer].certs.push(cert);
      return groups;
    }, {});
  }, [certifications]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(word => word[0])
      .filter(char => char && char.match(/[a-zA-Z0-9]/)) 
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  const headerVariants = {
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
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const groupVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  if (!certifications || certifications.length === 0) {
    return null; 
  }

  const issuerGroups = Object.values(groupedCerts);
  
  return (
    <CertificationsSection id="certifications" ref={ref}>
      <SectionHeader variants={headerVariants} initial="hidden" animate={controls}>
        <SectionTitle>Credentials & Achievements</SectionTitle>
        <SectionSubtitle>
          Validated expertise and recognitions across my learning journey.
        </SectionSubtitle>
      </SectionHeader>
      
      <IssuerGroupsContainer variants={containerVariants} initial="hidden" animate={controls}>
        {issuerGroups.map((group, groupIndex) => (
          <IssuerGroup key={group.name} variants={groupVariants}>
            <IssuerHeader>
              <IssuerLogo>
                {group.logoUrl ? (
                  <img src={group.logoUrl} alt={`${group.name} logo`} />
                ) : (
                  <IssuerFallback>{getInitials(group.name)}</IssuerFallback>
                )}
              </IssuerLogo>
              <IssuerInfo>
                <IssuerName>{group.name}</IssuerName>
                <CertCount>{group.certs.length} credential{group.certs.length > 1 ? 's' : ''}</CertCount>
              </IssuerInfo>
            </IssuerHeader>
            
            <BadgesGrid>
              {group.certs.map((cert, certIndex) => (
                <BadgeCard 
                  key={cert.id || cert.name} 
                  variants={badgeVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  transition={{ delay: groupIndex * 0.1 + certIndex * 0.05 }}
                >
                  <BadgeIcon>
                    {certIndex % 2 === 0 ? <FaAward /> : <FaMedal />}
                  </BadgeIcon>
                  <BadgeContent>
                    <BadgeName>{cert.name}</BadgeName>
                    <BadgeMeta>
                      <BadgeDate>{cert.date}</BadgeDate>
                      {cert.credentialUrl && (
                        <VerifyLink href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                          Verify <FaExternalLinkAlt />
                        </VerifyLink>
                      )}
                    </BadgeMeta>
                  </BadgeContent>
                </BadgeCard>
              ))}
            </BadgesGrid>
          </IssuerGroup>
        ))}
      </IssuerGroupsContainer>
    </CertificationsSection>
  );
};

export default Certifications;