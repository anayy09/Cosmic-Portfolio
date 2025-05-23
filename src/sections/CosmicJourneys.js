import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { FaMapMarkerAlt } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';
import { useTheme } from 'styled-components';

const MAP_JSON_PATH = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const CosmicJourneysSection = styled.section`
  min-height: 100vh;
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const MapContainer = styled(motion.div)`
  width: 100%;
  max-width: 900px; // Max width for the map
  height: 500px; // Fixed height for the map container
  background: rgba(5, 7, 20, 0.5); // Darker, slightly transparent background for the map
  border-radius: 15px;
  border: 1px solid ${props => props.theme.colors.primary}50;
  box-shadow: ${props => props.theme.shadows.glow};
  overflow: hidden; // Important for rounded corners on the map
  margin-bottom: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 350px;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.darkBlue};
  color: ${props => props.theme.colors.light};
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  box-shadow: ${props => props.theme.shadows.medium};
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  border: 1px solid ${props => props.theme.colors.primary};
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    color: ${props => props.theme.colors.primary};
  }
  p {
    margin: 0;
    font-size: 0.8rem;
  }
`;

const CosmicJourneys = () => {
  const { visitedPlaces } = personalInfo;
  const theme = useTheme();

  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });

  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  useEffect(() => {
    if (tooltipContent) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [tooltipContent]);


  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  const mapVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } }
  };

  if (!visitedPlaces) {
    return (
      <CosmicJourneysSection id="journeys" ref={ref}>
        <SectionTitle variants={titleVariants} initial="hidden" animate={controls}>
          Cosmic Journeys
        </SectionTitle>
        <SectionSubtitle variants={titleVariants} initial="hidden" animate={controls}>
          Map data is currently unavailable.
        </SectionSubtitle>
      </CosmicJourneysSection>
    );
  }
  
  return (
    <CosmicJourneysSection id="journeys" ref={ref}>
      <SectionTitle variants={titleVariants} initial="hidden" animate={controls}>
        Cosmic Journeys
      </SectionTitle>
      <SectionSubtitle variants={titleVariants} initial="hidden" animate={controls}>
        Charting my explorations across the globe.
      </SectionSubtitle>

      <MapContainer variants={mapVariants} initial="hidden" animate={controls}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120, // Adjust scale to fit your preference
            center: [0, 20] // Center the map appropriately
          }}
          aria-label="World map showing visited places"
        >
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography={MAP_JSON_PATH}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={theme.colors.darkBlue}
                    stroke={theme.colors.primary}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: theme.colors.primary },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {visitedPlaces.map(({ id, name, coordinates, story, significance }) => (
              <Marker
                key={id}
                coordinates={coordinates}
                onMouseEnter={() => {
                  setTooltipContent({ name, story, significance });
                }}
                onMouseLeave={() => {
                  setTooltipContent(null);
                }}
              >
                <motion.g
                    whileHover={{ scale: 2.5 }} 
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <FaMapMarkerAlt color={theme.colors.accent} size="12px" style={{ transform: 'translateY(-50%)' }}/>
                    <circle r={3} fill={theme.colors.accent} stroke={theme.colors.light} strokeWidth={0.5} opacity="0.5" />
                </motion.g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </MapContainer>
       {tooltipContent && (
        <Tooltip style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
          <h4>{tooltipContent.name}</h4>
          {tooltipContent.significance && <p><em>{tooltipContent.significance}</em></p>}
          {tooltipContent.story && <p>{tooltipContent.story}</p>}
        </Tooltip>
      )}
    </CosmicJourneysSection>
  );
};

export default CosmicJourneys;