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
    padding: 3rem 1.5rem;
  }
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
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

const MapWrapper = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MapControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const MapToggle = styled(motion.button)`
  background: ${props => props.$active 
    ? 'rgba(91, 141, 239, 0.2)' 
    : props.theme.colors.surface};
  border: 1px solid ${props => props.$active 
    ? 'rgba(91, 141, 239, 0.4)' 
    : props.theme.colors.border};
  color: ${props => props.$active 
    ? props.theme.colors.primary 
    : props.theme.colors.muted};
  padding: 0.6rem 1.25rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
  
  &:hover {
    background: rgba(91, 141, 239, 0.15);
    border-color: rgba(91, 141, 239, 0.3);
  }
`;

const MapContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 450px;
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  backdrop-filter: blur(16px);
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 350px;
    border-radius: 16px;
  }
  
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const PlacesCount = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.muted};
  backdrop-filter: blur(8px);
  z-index: 10;
  
  span {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background: rgba(16, 22, 36, 0.95);
  color: ${props => props.theme.colors.light};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  white-space: nowrap;
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  max-width: 250px;
  
  h4 {
    margin: 0 0 0.35rem 0;
    font-size: 0.95rem;
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
  }
  
  p {
    margin: 0;
    font-size: 0.8rem;
    color: ${props => props.theme.colors.muted};
    white-space: normal;
    line-height: 1.4;
  }
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 0.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.muted};
`;

const LegendDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color || props.theme.colors.accent};
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
    zoomableGroup: { center: [0, 20], zoom: 1 }, // Corrected center for world map consistency
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

  // State for current map view (center and zoom)
  const [mapView, setMapView] = useState({
    center: activeMapConfig.zoomableGroup.center,
    zoom: activeMapConfig.zoomableGroup.zoom,
  });

  // Effect to reset mapView when activeMapConfig changes (e.g., switching maps)
  useEffect(() => {
    setMapView({
      center: activeMapConfig.zoomableGroup.center,
      zoom: activeMapConfig.zoomableGroup.zoom,
    });
  }, [activeMapConfig]);

  const handleMapMoveEnd = ({ coordinates, zoom }) => {
    setMapView({ center: coordinates, zoom });
  };

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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } }
  };

  const mapTransitionVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (!visitedPlaces) {
    return (
      <CosmicJourneysSection id="journeys" ref={ref}>
        <SectionHeader variants={headerVariants} initial="hidden" animate={controls}>
          <SectionTitle>Cosmic Journeys</SectionTitle>
          <SectionSubtitle>Map data is currently unavailable.</SectionSubtitle>
        </SectionHeader>
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
      <SectionHeader variants={headerVariants} initial="hidden" animate={controls}>
        <SectionTitle>Journeys</SectionTitle>
        <SectionSubtitle>
          Charting my explorations across the globe and within India.
        </SectionSubtitle>
      </SectionHeader>
      
      <MapWrapper variants={containerVariants} initial="hidden" animate={controls}>
        <MapControls>
          <MapToggle 
            $active={currentMap === 'world'} 
            onClick={handleBackToWorldClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🌍 World
          </MapToggle>
          <MapToggle 
            $active={currentMap === 'india'} 
            onClick={handleIndiaClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🇮🇳 India
          </MapToggle>
        </MapControls>
        
        <MapContainer>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMap}
              variants={mapTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ width: '100%', height: '100%' }}
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={activeMapConfig.projectionConfig}
                aria-label={activeMapConfig.label}
                width={800}
                height={450}
                style={{ width: "100%", height: "100%" }}
              >
                <ZoomableGroup
                  center={mapView.center}
                  zoom={mapView.zoom}
                  onMoveEnd={handleMapMoveEnd}
                  minZoom={0.5}
                  maxZoom={10}
                >
                  <Geographies geography={activeMapConfig.geoJson}>
                    {({ geographies }) =>
                      geographies.map(geo => {
                        const isIndiaGeography = currentMap === 'world' && geo.properties && (
                          (typeof geo.properties.NAME === 'string' && geo.properties.NAME.toLowerCase() === 'india') ||
                          (typeof geo.properties.ADMIN === 'string' && geo.properties.ADMIN.toLowerCase() === 'india') ||
                          (typeof geo.properties.NAME_LONG === 'string' && geo.properties.NAME_LONG.toLowerCase() === 'india') ||
                          (typeof geo.properties.SOVEREIGNT === 'string' && geo.properties.SOVEREIGNT.toLowerCase() === 'india') ||
                          (typeof geo.properties.name === 'string' && geo.properties.name.toLowerCase() === 'india') ||
                          geo.properties.GU_A3 === 'IND' ||
                          geo.properties.ISO_A3 === 'IND' ||
                          geo.properties.ADM0_A3 === 'IND'
                        );

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={
                              isIndiaGeography
                                ? theme.colors.accent
                                : theme.colors.darkBlue
                            }
                            stroke={
                              isIndiaGeography
                                ? theme.colors.light
                                : theme.colors.primary
                            }
                            style={{
                              default: {
                                outline: 'none',
                                transition: 'fill 0.2s ease-in-out',
                              },
                              hover: {
                                outline: 'none',
                                fill: isIndiaGeography
                                  ? theme.colors.accentHover
                                  : theme.colors.primary,
                              },
                              pressed: { outline: 'none', fill: theme.colors.accentHover },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                  {displayedPlaces.map((place) => {
                    const currentZoom = mapView.zoom || 1;
                    const baseDotRadius = hoveredMarker === place.id ? 6 : 4;
                    const basePulsingRadius = 8;
                    const baseStrokeWidth = 0.5;
                    const basePulsingStrokeWidth = 1;

                    const dynamicDotRadius = Math.max(1, baseDotRadius / currentZoom);
                    const dynamicPulsingRadius = Math.max(2, basePulsingRadius / currentZoom);
                    const dynamicStrokeWidth = Math.max(0.1, baseStrokeWidth / currentZoom);
                    const dynamicPulsingStrokeWidth = Math.max(0.2, basePulsingStrokeWidth / currentZoom);

                    return (
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
                          <circle
                            cx={0} cy={0}
                            r={dynamicDotRadius}
                            fill={theme.colors.accent}
                            stroke={theme.colors.light}
                            strokeWidth={dynamicStrokeWidth}
                          />
                          {hoveredMarker === place.id && (
                            <motion.circle
                              cx={0} cy={0}
                              r={dynamicPulsingRadius}
                              fill="none"
                              stroke={theme.colors.accentHover}
                              strokeWidth={dynamicPulsingStrokeWidth}
                              initial={{ opacity: 0.5, scale: 1 }}
                              animate={{ opacity: [0.5, 0.1, 0.5], scale: [1, 2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </motion.g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            </motion.div>
          </AnimatePresence>
          
          <PlacesCount>
            <span>{displayedPlaces.length}</span> places explored
          </PlacesCount>
        </MapContainer>
        
        <LegendContainer>
          <LegendItem>
            <LegendDot $color={theme.colors.accent} />
            Visited Location
          </LegendItem>
          <LegendItem>
            <LegendDot $color={theme.colors.primary} />
            Highlighted Region
          </LegendItem>
        </LegendContainer>
      </MapWrapper>
      
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