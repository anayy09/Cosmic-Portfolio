import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaCertificate, FaLink } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';

const CertificationsSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem 2rem;
    min-height: auto;
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

const CertificationsContainer = styled(motion.div)`
  max-width: 1000px; // Slightly narrower for certifications
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); // Adjust minmax for card size
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CertificationCard = styled(motion.div)`
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(66, 133, 244, 0.3);
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start; // Align items to the start
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(66, 133, 244, 0.2);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const LogoContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px; // Square-ish logo
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 1rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  img {
    width: 80%; // Slightly smaller to fit well
    height: 80%;
    object-fit: contain;
  }
`;

const FallbackLogo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.gradients.nebulaAlpha || 'rgba(66, 133, 244, 0.2)'}; /* Ensure nebulaAlpha exists or provide fallback */
  color: ${props => props.theme.colors.light};
  font-weight: 500;
  font-size: 1.5rem; /* Larger for initials */
`;


const CardTitleContent = styled.div`
  flex-grow: 1;
`;

const CertificationName = styled.h3`
  font-size: 1.15rem;
  color: ${props => props.theme.colors.light};
  margin-bottom: 0.25rem;
`;

const IssuingOrg = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const CertificationDate = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const CertificationDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const CredentialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.accent};
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: auto; // Push to bottom
  
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.primary};
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

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(word => word[0])
      .filter(char => char && char.match(/[a-zA-Z0-9]/)) 
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
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
  
  if (!certifications || certifications.length === 0) {
    // Optionally, don't render the section at all if no data
    return null; 
  }
  
  return (
    <CertificationsSection id="certifications" ref={ref}>
      <SectionTitle variants={titleVariants} initial="hidden" animate={controls}>
        Credentials & Achievements
      </SectionTitle>
      <SectionSubtitle variants={titleVariants} initial="hidden" animate={controls}>
        Validated skills and recognitions in my journey of learning and growth.
      </SectionSubtitle>
      
      <CertificationsContainer variants={containerVariants} initial="hidden" animate={controls}>
        {certifications.map(cert => (
          <CertificationCard key={cert.id || cert.name} variants={itemVariants}>
            <CardHeader>
              <LogoContainer>
                {cert.logoUrl ? (
                  <img src={cert.logoUrl} alt={`${cert.issuingOrganization} logo`} />
                ) : (
                  <FallbackLogo>{getInitials(cert.issuingOrganization)}</FallbackLogo>
                )}
              </LogoContainer>
              <CardTitleContent>
                <CertificationName>{cert.name}</CertificationName>
                <IssuingOrg>{cert.issuingOrganization}</IssuingOrg>
                <CertificationDate>{cert.date}</CertificationDate>
              </CardTitleContent>
            </CardHeader>
            {cert.description && <CertificationDescription>{cert.description}</CertificationDescription>}
            {cert.credentialUrl && (
              <CredentialLink href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                <FaLink /> View Credential
              </CredentialLink>
            )}
          </CertificationCard>
        ))}
      </CertificationsContainer>
    </CertificationsSection>
  );
};

export default Certifications;