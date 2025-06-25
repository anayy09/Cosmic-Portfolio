import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  SiJavascript,
  SiPython,
  SiOpenjdk,
  SiReact,
  SiNodedotjs,
  SiGo,
  SiPostgresql,
  SiThreedotjs,
  SiTensorflow,
  SiDocker
} from 'react-icons/si';
import personalInfo from '../config/personalInfo';

const SkillsSection = styled.section`
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

const SkillsGrid = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 2rem;
  justify-items: center;
`;

const SkillCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const SkillIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
`;

const SkillName = styled.p`
  color: ${props => props.theme.colors.light};
  font-size: 0.9rem;
  text-align: center;
`;

const iconMap = {
  'JavaScript': SiJavascript,
  'Python': SiPython,
  'Java': SiOpenjdk,
  'React': SiReact,
  'Node.js': SiNodedotjs,
  'Go': SiGo,
  'PostgreSQL': SiPostgresql,
  'Three.js': SiThreedotjs,
  'TensorFlow': SiTensorflow,
  'Docker': SiDocker,
};

const Skills = () => {
  const { techStack } = personalInfo;
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 10
      }
    }
  };

  if (!techStack || techStack.length === 0) {
    return null;
  }

  return (
    <SkillsSection id="skills" ref={ref}>
      <SectionTitle variants={titleVariants} initial="hidden" animate={controls}>
        Skills
      </SectionTitle>
      <SectionSubtitle variants={titleVariants} initial="hidden" animate={controls}>
        Technologies and tools I frequently work with
      </SectionSubtitle>
      <SkillsGrid variants={containerVariants} initial="hidden" animate={controls}>
        {techStack.map((skill) => {
          const Icon = iconMap[skill] || SiJavascript;
          return (
            <SkillCard key={skill} variants={itemVariants}>
              <SkillIcon><Icon /></SkillIcon>
              <SkillName>{skill}</SkillName>
            </SkillCard>
          );
        })}
      </SkillsGrid>
    </SkillsSection>
  );
};

export default Skills;
