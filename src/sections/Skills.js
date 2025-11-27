import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiOpenjdk,
  SiJavascript,
  SiGo,
  SiTypescript,
  SiPhp,
  SiReact,
  SiNextdotjs,
  SiDjango,
  SiTensorflow,
  SiKeras,
  SiPytorch,
  SiHuggingface,
  SiMysql,
  SiGit,
  SiDocker,
  SiUnrealengine,
  SiBlender,
  SiZoho,
  SiFigma,
  SiWordpress
} from 'react-icons/si';
import personalInfo from '../config/personalInfo';

const SkillsSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

const SectionHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 4rem;
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

const SkillsContainer = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const SkillCategory = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: rgba(91, 141, 239, 0.3);
    box-shadow: 0 12px 40px rgba(91, 141, 239, 0.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.75rem;
    border-radius: 16px;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const CategoryIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.gradient || props.theme.gradients.nebulaSubtle};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.light};
  margin: 0;
  font-weight: 600;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
`;

const SkillItem = styled(motion.a)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid transparent;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(91, 141, 239, 0.08);
    border-color: rgba(91, 141, 239, 0.2);
    transform: translateY(-2px);
  }
`;

const SkillIcon = styled.div`
  font-size: 2.15rem;
  color: ${props => props.theme.colors.primaryMuted};
  transition: color 0.3s ease;
  
  ${SkillItem}:hover & {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.75rem;
  }
`;

const SkillName = styled.span`
  color: ${props => props.theme.colors.muted};
  font-size: 1rem;
  text-align: center;
  line-height: 1.2;
  transition: color 0.3s ease;
  
  ${SkillItem}:hover & {
    color: ${props => props.theme.colors.light};
  }
`;

const iconMap = {
  'C': SiC,
  'C++': SiCplusplus,
  'Python': SiPython,
  'Java': SiOpenjdk,
  'JavaScript': SiJavascript,
  'Golang': SiGo,
  'TypeScript': SiTypescript,
  'PHP': SiPhp,
  'React.js': SiReact,
  'Next.js': SiNextdotjs,
  'Django': SiDjango,
  'TensorFlow': SiTensorflow,
  'Keras': SiKeras,
  'PyTorch': SiPytorch,
  'Hugging Face': SiHuggingface,
  'MySQL': SiMysql,
  'Git': SiGit,
  'Docker': SiDocker,
  'Unreal Engine': SiUnrealengine,
  'Blender': SiBlender,
  'Zoho Creator': SiZoho,
  'Figma': SiFigma,
  'WordPress': SiWordpress,
};

// Categorize skills
const categorizeSkills = (techStack) => {
  const categories = {
    'Languages': ['C', 'C++', 'Python', 'Java', 'JavaScript', 'Golang', 'TypeScript', 'PHP'],
    'Frameworks & ML': ['React.js', 'Next.js', 'Django', 'TensorFlow', 'Keras', 'PyTorch', 'Hugging Face'],
    'Tools & Design': ['MySQL', 'Git', 'Docker', 'Unreal Engine', 'Blender', 'Zoho Creator', 'Figma', 'WordPress']
  };
  
  const categorized = {
    'Languages': { items: [], gradient: 'linear-gradient(135deg, #0D0D12 0%, #101624 50%, #1A2540 100%)' },
    'Frameworks & ML': { items: [], gradient: 'linear-gradient(135deg, #0D0D12 0%, #101624 50%, #1A2540 100%)' },
    'Tools & Design': { items: [], gradient: 'linear-gradient(135deg, #0D0D12 0%, #101624 50%, #1A2540 100%)' }
  };
  
  techStack.forEach(skill => {
    for (const [category, skills] of Object.entries(categories)) {
      if (skills.includes(skill.name)) {
        categorized[category].items.push(skill);
        break;
      }
    }
  });
  
  return categorized;
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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
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
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12
      }
    }
  };

  if (!techStack || techStack.length === 0) {
    return null;
  }

  const categorizedSkills = categorizeSkills(techStack);

  return (
    <SkillsSection id="skills" ref={ref}>
      <SectionHeader>
        <SectionLabel variants={headerVariants} initial="hidden" animate={controls}>
          Expertise
        </SectionLabel>
        <SectionTitle variants={headerVariants} initial="hidden" animate={controls}>
          Skills & Technologies
        </SectionTitle>
      </SectionHeader>
      
      <SkillsContainer variants={containerVariants} initial="hidden" animate={controls}>
        {Object.entries(categorizedSkills).map(([category, { items, gradient }]) => (
          <SkillCategory key={category} variants={categoryVariants}>
            <CategoryHeader>
              <CategoryIcon gradient={gradient}>
                {category === 'Languages' ? '{ }' : category === 'Frameworks & ML' ? '⚡' : '🔧'}
              </CategoryIcon>
              <CategoryTitle>{category}</CategoryTitle>
            </CategoryHeader>
            
            <SkillsGrid>
              {items.map(({ name, url }) => {
                const Icon = iconMap[name] || SiJavascript;
                return (
                  <SkillItem
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SkillIcon><Icon /></SkillIcon>
                    <SkillName>{name}</SkillName>
                  </SkillItem>
                );
              })}
            </SkillsGrid>
          </SkillCategory>
        ))}
      </SkillsContainer>
    </SkillsSection>
  );
};

export default Skills;
