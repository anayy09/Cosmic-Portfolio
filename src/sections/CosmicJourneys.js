import React, { useRef, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components'; // Combined useTheme import
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { FaMapMarkerAlt } from 'react-icons/fa';
import personalInfo from '../config/personalInfo';
import worldMapData from './topo.json';
import indiaMapData from './in.json';

const MAP_JSON_PATH_WORLD = worldMapData;
const MAP_JSON_PATH_INDIA = indiaMapData;

const CosmicJourneysSection = styled.section`
  padding: 6rem 2rem;
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
  position: relative; // Added to ensure buttons are positioned within this container
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

const ControlButton = styled(motion.button)` // Generic button for reuse
  position: absolute;
  background-color: ${props => props.theme.colors.nebula};
  color: ${props => props.theme.colors.light};
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem; // Unified font size
  z-index: 1000;
  box-shadow: ${props => props.theme.shadows.medium};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }

  // Added for Framer Motion
  variants={{
    hidden: { opacity: 0, y: 20 }, // Slide from bottom for ViewIndiaButton
    visible: { opacity: 1, y: 0 }
  }}
  initial="hidden"
  animate="visible"
  exit="hidden"
  transition={{ duration: 0.3 }}
`;

const BackButton = styled(ControlButton)` // Inherits from ControlButton
  top: 1rem;
  left: 1rem;
  // Override variants if needed for different animation
  variants={{
    hidden: { opacity: 0, x: -20 }, // Slide from left for BackButton
    visible: { opacity: 1, x: 0 }
  }}
`;

const ViewIndiaButton = styled(ControlButton)` // Inherits from ControlButton
  bottom: 1rem;
  right: 1rem;
  background-color: ${props => props.theme.colors.nebula}; // Different color for distinction

  &:hover {
    background-color: ${props => props.theme.colors.primary};
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
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const [currentMap, setCurrentMap] = useState('world'); // 'world' or 'india'

  const worldMapInitialConfig = {
    projectionConfig: { scale: 135, center: [0, 20] },
    zoomableGroup: { center: [1, 20], zoom: 1 },
    geoJson: MAP_JSON_PATH_WORLD,
    label: "World Map"
  };

  const indiaMapInitialConfig = {
    projectionConfig: { scale: 825, center: [82, 22.5] }, // Fine-tuned center and scale for India
    zoomableGroup: { center: [82, 22.5], zoom: 1 },
    geoJson: MAP_JSON_PATH_INDIA,
    label: "India Map"
  };

  const [activeMapConfig, setActiveMapConfig] = useState(worldMapInitialConfig);

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

  const containerVariants = { // Renamed from mapVariants for clarity
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } }
  };

  const mapTransitionVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
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

  const handleIndiaClick = () => {
    setCurrentMap('india');
    setActiveMapConfig(indiaMapInitialConfig);
  };

  const handleBackToWorldClick = () => {
    setCurrentMap('world');
    setActiveMapConfig(worldMapInitialConfig);
  };

  const displayedPlaces = currentMap === 'india'
  ? visitedPlaces.filter(place => place.name.includes("India") || (place.coordinates[0] > 68 && place.coordinates[0] < 98 && place.coordinates[1] > 8 && place.coordinates[1] < 37) ) // Basic check for India by name or coordinates
  : visitedPlaces;

  return (
    <CosmicJourneysSection id="journeys" ref={ref}>
      <SectionTitle variants={titleVariants} initial="hidden" animate={controls}>
        Cosmic Journeys
      </SectionTitle>
      <SectionSubtitle variants={titleVariants} initial="hidden" animate={controls}>
        {currentMap === 'world'
          ? "Charting my explorations across the globe. Use the button below to zoom into India."
          : "Detailing my journeys within India. Use the button to go back to the world map."}
      </SectionSubtitle>

      <MapContainer variants={containerVariants} initial="hidden" animate={controls}>
        <AnimatePresence mode="wait">
          {currentMap === 'india' && (
            <BackButton
              key="backButton" // Add key for AnimatePresence
              onClick={handleBackToWorldClick}
              aria-label="Back to World Map"
            >
              Back to World
            </BackButton>
          )}
          {currentMap === 'world' && (
            <ViewIndiaButton
              key="viewIndiaButton" // Add key for AnimatePresence
              onClick={handleIndiaClick}
              aria-label="View India Map"
            >
              View India Map
            </ViewIndiaButton>
          )}
          <motion.div
            key={currentMap} // Crucial for AnimatePresence to detect change
            variants={mapTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ width: '100%', height: '100%' }} // Ensure motion.div fills MapContainer
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={activeMapConfig.projectionConfig}
              aria-label={activeMapConfig.label}
              width={800} // Explicit width and height can help
              height={500} // Match aspect ratio of MapContainer or adjust
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup
                center={activeMapConfig.zoomableGroup.center}
                zoom={activeMapConfig.zoomableGroup.zoom}
              >
                <Geographies geography={activeMapConfig.geoJson}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      // Updated and more robust check for India geography
                      const isIndiaGeography = currentMap === 'world' && geo.properties && (
                        (typeof geo.properties.NAME === 'string' && geo.properties.NAME.toLowerCase() === 'india') ||
                        (typeof geo.properties.ADMIN === 'string' && geo.properties.ADMIN.toLowerCase() === 'india') ||
                        (typeof geo.properties.NAME_LONG === 'string' && geo.properties.NAME_LONG.toLowerCase() === 'india') ||
                        (typeof geo.properties.SOVEREIGNT === 'string' && geo.properties.SOVEREIGNT.toLowerCase() === 'india') ||
                        (typeof geo.properties.name === 'string' && geo.properties.name.toLowerCase() === 'india') || // Handles common lowercase 'name' property
                        geo.properties.GU_A3 === 'IND' ||    // Check for ISO 3166-1 alpha-3 code
                        geo.properties.ISO_A3 === 'IND' ||   // Alternative ISO_A3 property
                        geo.properties.ADM0_A3 === 'IND'   // Another common admin level 0 ISO code property
                      );

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={
                            isIndiaGeography
                              ? theme.colors.accent // Highlight India
                              : theme.colors.darkBlue
                          }
                          stroke={
                            isIndiaGeography
                              ? theme.colors.light // Brighter stroke for India
                              : theme.colors.primary
                          }
                          style={{
                            default: {
                              outline: 'none',
                              // cursor: isIndiaGeography ? 'pointer' : 'default', // Keep or remove based on preference
                              transition: 'fill 0.2s ease-in-out',
                            },
                            hover: {
                              outline: 'none',
                              fill: isIndiaGeography
                                ? theme.colors.accentHover // Brighter hover for India
                                : theme.colors.primary,
                            },
                            pressed: { outline: 'none', fill: theme.colors.accentHover },
                          }}
                          // onClick={isIndiaGeography ? handleIndiaClick : undefined} // Click on map geography is now secondary or can be removed
                        />
                      );
                    })
                  }
                </Geographies>
                {displayedPlaces.map((place) => (
                  <Marker
                    key={place.id}
                    coordinates={place.coordinates}
                    onMouseEnter={() => {
                      setTooltipContent({ name: place.name, story: place.story, significance: place.significance });
                      setHoveredMarker(place.id);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent(null);
                      setHoveredMarker(null);
                    }}
                  >
                    <motion.g
                      animate={{ scale: hoveredMarker === place.id ? 1.2 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{ pointerEvents: 'auto' }}
                    >
                      {/* Base dot at exact coordinate */}
                      <circle
                        cx={0} cy={0}
                        r={hoveredMarker === place.id ? 6 : 4}
                        fill={theme.colors.accent}
                        stroke={theme.colors.light}
                        strokeWidth={0.5}
                      />
                      {/* Pulsing ring on hover */}
                      {hoveredMarker === place.id && (
                        <motion.circle
                          cx={0} cy={0}
                          r={8}
                          fill="none"
                          stroke={theme.colors.accentHover}
                          strokeWidth={1}
                          initial={{ opacity: 0.5, scale: 1 }}
                          animate={{ opacity: [0.5, 0.1, 0.5], scale: [1, 2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.g>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </motion.div>
        </AnimatePresence>
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