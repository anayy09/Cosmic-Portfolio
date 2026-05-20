import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import {
  SiPython, SiGo, SiTypescript, SiJavascript, SiCplusplus,
  SiPostgresql, SiGnubash,
  SiPytorch, SiTensorflow, SiHuggingface, SiScikitlearn,
  SiFastapi, SiDjango, SiSpringboot, SiNodedotjs, SiReact, SiNextdotjs,
  SiMongodb, SiRedis, SiDocker, SiAmazonwebservices,
  SiLinux, SiGit, SiFigma,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { FiCloud } from 'react-icons/fi';

const iconMap = {
  SiPython: SiPython, SiGo: SiGo, SiTypescript: SiTypescript,
  SiJavascript: SiJavascript, SiCplusplus: SiCplusplus, SiPostgresql: SiPostgresql,
  SiGnubash: SiGnubash, FaJava: FaJava,
  SiPytorch: SiPytorch, SiTensorflow: SiTensorflow, SiHuggingface: SiHuggingface,
  SiScikitlearn: SiScikitlearn, SiFastapi: SiFastapi, SiDjango: SiDjango,
  SiSpringboot: SiSpringboot, SiNodedotjs: SiNodedotjs, SiReact: SiReact,
  SiNextdotjs: SiNextdotjs,
  SiMongodb: SiMongodb, SiRedis: SiRedis, SiDocker: SiDocker,
  SiMicrosoftazure: FiCloud, SiAmazonaws: SiAmazonwebservices,
  SiLinux: SiLinux, SiGit: SiGit, SiFigma: SiFigma,
};

const SkillsSection = styled.section`
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
  margin-bottom: 2.75rem;
`;

const PanelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: ${props => props.theme.breakpoints.tabletL}) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled(motion.div)`
  background: rgba(14, 20, 32, 0.72);
  border: 1px solid rgba(91, 141, 239, 0.1);
  border-radius: ${props => props.theme.radius.lg};
  padding: 1.75rem;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.2);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

const PanelLabel = styled.p`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const PanelTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.01em;
  margin-bottom: 1.25rem;
`;

const SkillsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkillRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid transparent;
  transition: background 0.18s ease, border-color 0.18s ease;
  cursor: default;

  &:hover {
    background: rgba(91, 141, 239, 0.06);
    border-color: rgba(91, 141, 239, 0.12);
  }
`;

const SkillIcon = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.muted};
  font-size: 1.05rem;
  flex-shrink: 0;
  transition: color 0.18s ease;

  ${SkillRow}:hover & {
    color: ${props => props.theme.colors.primary};
  }
`;

const SkillName = styled.span`
  font-family: ${props => props.theme.fonts.main};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.muted};
  transition: color 0.18s ease;

  ${SkillRow}:hover & {
    color: ${props => props.theme.colors.light};
  }
`;

const Skills = ({ skillCategories }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  const categories = skillCategories || [];

  return (
    <SkillsSection id="skills">
      <Container ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>// tech.stack</SectionLabel>
          <SectionTitle>Skills</SectionTitle>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <PanelsGrid>
            {categories.map((category) => (
              <Panel
                key={category.id}
                variants={panelVariants}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 100, damping: 16 }}
              >
                <PanelLabel>{category.label}</PanelLabel>
                <PanelTitle>{category.title}</PanelTitle>
                <SkillsGrid>
                  {category.skills.map((skill, i) => {
                    const Icon = iconMap[skill.icon];
                    return (
                      <SkillRow
                        key={skill.name}
                        variants={rowVariants}
                        custom={i}
                      >
                        <SkillIcon>
                          {Icon ? <Icon /> : null}
                        </SkillIcon>
                        <SkillName>{skill.name}</SkillName>
                      </SkillRow>
                    );
                  })}
                </SkillsGrid>
              </Panel>
            ))}
          </PanelsGrid>
        </motion.div>
      </Container>
    </SkillsSection>
  );
};

export default Skills;
