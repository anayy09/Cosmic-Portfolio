import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TypedText from '../components/TypedText';
import SocialLinks from '../components/SocialLinks';

const HeroContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 2rem;
  position: relative;
  overflow: hidden;
  
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
`;

const Greeting = styled(motion.p)`
  font-family: ${props => props.theme.fonts.code};
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Name = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props => props.theme.shadows.glow};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    text-shadow: ${props => props.theme.shadows.glowMobile};
  }
`;

const Title = styled(motion.h2)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 400;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.theme.colors.light};
  font-size: 0.9rem;
  
  svg {
    margin-top: 0.5rem;
    font-size: 1.5rem;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const Hero = ({ name, skills, description, github, linkedin, email, blog, cv }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <HeroContainer id="home">
      <ContentWrapper>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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
            cv={cv} // Pass cv prop
          />
        </motion.div>
      </ContentWrapper>
      
      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>Scroll Down</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default Hero;