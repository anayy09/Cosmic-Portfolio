import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TypedText from '../components/TypedText';
import SocialLinks from '../components/SocialLinks';
import { FaGraduationCap, FaBriefcase, FaFileAlt, FaMapMarkerAlt } from 'react-icons/fa';

const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 2rem 4rem;
  position: relative;
  overflow: hidden;
`;

const HeroGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const LeftColumn = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    text-align: center;
  }
`;

const RightColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const Greeting = styled(motion.p)`
  font-family: ${props => props.theme.fonts.code};
  color: ${props => props.theme.colors.primary};
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Name = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  line-height: 1.1;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: clamp(2rem, 8vw, 2.75rem);
  }
`;

const Title = styled(motion.h2)`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 400;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.light};
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: center;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  max-width: 520px;
  margin-bottom: 2rem;
  line-height: 1.75;
  color: ${props => props.theme.colors.muted};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin: 0 auto 2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surfaceAlt};
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  
  &:hover {
    border-color: rgba(91, 141, 239, 0.35);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(91, 141, 239, 0.12);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.theme.gradients.subtle};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.light};
  font-size: 1.1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 20px;
    height: 20px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.light};
  line-height: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.35rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.muted};
  letter-spacing: 0.02em;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.75rem;
  }
`;

const CurrentStatus = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(46, 213, 115, 0.1);
  border: 1px solid rgba(46, 213, 115, 0.2);
  border-radius: 50px;
  width: fit-content;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin: 0 auto 1.5rem;
  }
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2ed573;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.9); }
  }
`;

const StatusText = styled.span`
  font-size: 0.8rem;
  color: #2ed573;
  font-weight: 500;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, ${props => props.theme.colors.primary}, transparent);
  animation: scrollPulse 2s ease-in-out infinite;
  
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
`;

const Hero = ({ name, skills, description, github, linkedin, email, blog, cv }) => {
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
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  };
  
  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: i => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.4 + (i * 0.1)
      }
    })
  };
  
  const stats = [
    { icon: <FaGraduationCap />, value: "MS", label: "CS @ University of Florida" },
    { icon: <FaBriefcase />, value: "6+", label: "Internships" },
    { icon: <FaFileAlt />, value: "7", label: "Publications & Patents" },
    { icon: <FaMapMarkerAlt />, value: "30+", label: "Places Visited" },
  ];
  
  return (
    <HeroContainer id="home">
      <HeroGrid>
        <LeftColumn>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <CurrentStatus variants={itemVariants}>
              <StatusDot />
              <StatusText>Open to Opportunities</StatusText>
            </CurrentStatus>
            
            <Greeting variants={itemVariants}>Hello, I'm</Greeting>
            <Name variants={itemVariants}>{name || "Your Name"}</Name>
            <Title variants={itemVariants}>
              I'm a <TypedText strings={skills || ["Software Developer", "ML Engineer"]} />
            </Title>
            <Description variants={itemVariants}>
              {description || "A passionate software developer specializing in creating exceptional digital experiences. Currently focused on building accessible, human-centered products."}
            </Description>
            
            <SocialLinks 
              github={github}
              linkedin={linkedin}
              email={email}
              blog={blog}
              cv={cv}
            />
          </motion.div>
        </LeftColumn>
        
        <RightColumn>
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <StatIcon>
                  {stat.icon}
                </StatIcon>
                <StatValue>{stat.value}</StatValue>
              </div>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </RightColumn>
      </HeroGrid>
      
      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <ScrollLine />
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default Hero;