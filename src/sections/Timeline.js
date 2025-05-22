import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';

const TimelineSection = styled.section`
  min-height: 100vh;
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem 2rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 4rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TimelineContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    background: ${props => props.theme.gradients.nebula};
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(66, 133, 244, 0.5);
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  padding: 1rem 0;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: ${props => props.position === 'left' ? 'flex-start' : 'flex-end'};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: flex-start;
    padding-left: 60px;
  }
`;

const TimelineContent = styled(motion.div)`
  width: 45%;
  padding: 1.5rem;
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(66, 133, 244, 0.3);
  box-shadow: ${props => props.theme.shadows.medium};
  position: relative;
  
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 20px rgba(66, 133, 244, 0.5);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    padding: 0.75rem;
  }
`;

const TimelineDot = styled(motion.div)`
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  left: 49%;
  top: 46%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0 0 10px ${props => props.theme.colors.primary};
  
  &::before {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${props => props.theme.colors.dark};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    left: 5%;
  }
`;

const TimelineDate = styled.div`
  position: absolute;
  top: -26px;
  ${props => props.position === 'left' ? 'right: 0;' : 'left: 0;'}
  font-family: ${props => props.theme.fonts.code};
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    left: 0;
    right: auto;
    font-size: 0.8rem; // Smaller font size for mobile
  }
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 0.5rem; // Smaller margin for mobile
  }
`;

const LogoContainer = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 32px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const TitleContainer = styled.div`
  flex-grow: 1;
`;

const TimelineTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 0.3rem 0;
  color: ${props => props.theme.colors.light};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1rem; // Smaller font size for mobile
  }
`;

const TimelineSubtitle = styled.h4`
  font-size: 1.1rem;
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.9rem; // Smaller font size for mobile
  }
`;

const TimelineDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.8rem;
    margin-bottom: 0;
  }
`;

const TimelineTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none; // Hide on mobile
  }
`;

const TimelineTag = styled.span`
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: rgba(66, 133, 244, 0.2);
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.code};
`;

const TimelineToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.dark : props.theme.colors.light};
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:first-child {
    border-radius: 5px 0 0 5px;
  }
  
  &:last-child {
    border-radius: 0 5px 5px 0;
  }
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : 'rgba(66, 133, 244, 0.1)'};
  }
`;

// Fallback logo component for when a logo URL is not provided
const FallbackLogo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.gradients.nebula};
  color: ${props => props.theme.colors.light};
  font-weight: 600;
  font-size: 1.2rem;
  
  &::after {
    content: '${props => props.initials || "?"}';
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1rem; // Smaller font size for mobile
  }
`;

// New component to handle logo display and fallback
const LogoDisplay = ({ logoUrl, organizationName, getInitials }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false); // Reset error state if logoUrl changes
  }, [logoUrl]);

  if (logoUrl && !hasError) {
    return (
      <img
        src={logoUrl}
        alt={`${organizationName} logo`}
        onError={() => setHasError(true)}
        // Styles for img are handled by LogoContainer's styled-component rules
      />
    );
  }
  return <FallbackLogo initials={getInitials(organizationName)} />;
};

const Timeline = ({ education, experience }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [timelineItems, setTimelineItems] = useState([]);
  const sectionControls = useAnimation(); // For the SectionTitle
  const ref = useRef(null);
  // Ensure useInView triggers every time, not just once, if section scrolls out and back in.
  const inView = useInView(ref, { once: false, threshold: 0.2 });

  // State to control the TimelineContainer's animation target
  const [containerAnimateState, setContainerAnimateState] = useState("hidden");

  useEffect(() => {
    if (inView) {
      sectionControls.start('visible');
      setContainerAnimateState("visible");
    } else {
      // If you want the title to hide when out of view too:
      // sectionControls.start('hidden');
      setContainerAnimateState("hidden");
    }
  }, [sectionControls, inView]);
  
  useEffect(() => {
    // Combine and sort education and experience by date
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

    // When activeTab changes, force re-animation of the container if it's in view.
    // The TimelineContainer will re-mount due to its key={activeTab} prop.
    // This sequence ensures its animate prop changes, triggering the animation.
    if (inView) {
      setContainerAnimateState("hidden"); // Set to hidden first
      requestAnimationFrame(() => { // Then set to visible in the next frame
        setContainerAnimateState("visible");
      });
    }
    // If not inView, containerAnimateState is already "hidden" from the other effect,
    // so the new instance will mount hidden and animate in when scrolled into view.
  }, [activeTab, education, experience, inView]); // inView dependency is important here
  
  // Get organization initials for fallback logo
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
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
        staggerChildren: 0.2
        // delayChildren: 0.3, // Removed for more instant re-animation
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
  
  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };
  
  return (
    <TimelineSection id="timeline" ref={ref}>
      <SectionTitle
        variants={titleVariants}
        initial="hidden"
        animate={sectionControls} // Use sectionControls for the title
      >
        Timeline
      </SectionTitle>
      
      <TimelineToggle>
        <ToggleButton 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All
        </ToggleButton>
        <ToggleButton 
          active={activeTab === 'education'} 
          onClick={() => setActiveTab('education')}
        >
          Education
        </ToggleButton>
        <ToggleButton 
          active={activeTab === 'experience'} 
          onClick={() => setActiveTab('experience')}
        >
          Experience
        </ToggleButton>
      </TimelineToggle>
      
      <TimelineContainer
        key={activeTab} // This key is crucial for re-mounting the container
        as={motion.div}
        variants={containerVariants}
        initial="hidden" // Always start hidden on mount/re-mount
        animate={containerAnimateState} // Animate to the current state value
      >
        {timelineItems.map((item, index) => (
          <TimelineItem 
            key={`${item.type}-${item.organization}-${item.title}`} // More stable key
            position={index % 2 === 0 ? 'right' : 'left'}
            variants={itemVariants}
          >
            <TimelineContent>
              <TimelineDate position={index % 2 === 0 ? 'right' : 'left'}>
                {item.startDate} - {item.endDate || 'Present'}
              </TimelineDate>
              
              <TimelineHeader>
                <LogoContainer>
                  <LogoDisplay
                    logoUrl={item.logoUrl}
                    organizationName={item.organization}
                    getInitials={getInitials}
                  />
                </LogoContainer>
                
                <TitleContainer>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineSubtitle>{item.organization}</TimelineSubtitle>
                </TitleContainer>
              </TimelineHeader>
              
              <TimelineDescription>{item.description}</TimelineDescription>
              
              {item.skills && (
                <TimelineTags>
                  {item.skills.map((skill, i) => (
                    <TimelineTag key={i}>{skill}</TimelineTag>
                  ))}
                </TimelineTags>
              )}
            </TimelineContent>
            <TimelineDot variants={dotVariants} />
          </TimelineItem>
        ))}
      </TimelineContainer>
    </TimelineSection>
  );
};

export default Timeline;