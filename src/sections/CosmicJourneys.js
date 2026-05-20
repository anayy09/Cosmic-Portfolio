import React, { useRef, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
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
  margin-bottom: 0.5rem;
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.muted};
  max-width: 48ch;
  line-height: 1.65;
  margin-bottom: 2.5rem;
`;

const MapControls = styled(motion.div)`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const MapToggle = styled(motion.button)`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.4rem 0.875rem;
  border-radius: ${props => props.theme.radius.pill};
  border: 1px solid ${props => props.$active
    ? 'rgba(91, 141, 239, 0.35)'
    : 'rgba(91, 141, 239, 0.1)'};
  background: ${props => props.$active
    ? 'rgba(91, 141, 239, 0.1)'
    : 'transparent'};
  color: ${props => props.$active
    ? props.theme.colors.primary
    : props.theme.colors.subtle};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.28);
    color: ${props => props.theme.colors.muted};
  }
`;

const MapOuter = styled(motion.div)`
  position: relative;
  width: 100%;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background: rgba(6, 9, 16, 0.97);
  border-radius: ${props => props.theme.radius.lg};
  border: 1px solid rgba(91, 141, 239, 0.07);
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 360px;
    border-radius: ${props => props.theme.radius.md};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    height: 280px;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const MapChrome = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  pointer-events: none;
  z-index: 10;
`;

const MapStat = styled.div`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(91, 141, 239, 0.35);

  span {
    color: rgba(91, 141, 239, 0.65);
  }
`;

const Tooltip = styled.div`
  position: fixed;
  background: rgba(8, 12, 20, 0.96);
  color: ${props => props.theme.colors.light};
  padding: 0.7rem 0.875rem;
  border-radius: ${props => props.theme.radius.md};
  font-size: 0.825rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  white-space: nowrap;
  z-index: 9999;
  border: 1px solid rgba(91, 141, 239, 0.12);
  max-width: 240px;

  h4 {
    margin: 0 0 0.3rem 0;
    font-size: 0.875rem;
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 0.775rem;
    color: ${props => props.theme.colors.muted};
    white-space: normal;
    line-height: 1.5;
  }
`;

const CosmicJourneys = () => {
  const { visitedPlaces } = personalInfo;
  const theme = useTheme();

  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [currentMap, setCurrentMap] = useState('world');

  const worldMapConfig = {
    projectionConfig: { scale: 135, center: [0, 20] },
    zoomableGroup: { center: [0, 20], zoom: 1 },
    geoJson: MAP_JSON_PATH_WORLD,
    label: 'World Map',
  };

  const indiaMapConfig = {
    projectionConfig: { scale: 825, center: [82, 22.5] },
    zoomableGroup: { center: [82, 22.5], zoom: 1 },
    geoJson: MAP_JSON_PATH_INDIA,
    label: 'India Map',
  };

  const [activeMapConfig, setActiveMapConfig] = useState(worldMapConfig);
  const [mapView, setMapView] = useState({
    center: worldMapConfig.zoomableGroup.center,
    zoom: worldMapConfig.zoomableGroup.zoom,
  });

  useEffect(() => {
    setMapView({
      center: activeMapConfig.zoomableGroup.center,
      zoom: activeMapConfig.zoomableGroup.zoom,
    });
  }, [activeMapConfig]);

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  useEffect(() => {
    if (!tooltipContent) return;
    const handleMouseMove = (e) => {
      setTooltipPosition({ x: e.clientX + 15, y: e.clientY + 15 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [tooltipContent]);

  const handleMapMoveEnd = ({ coordinates, zoom }) => {
    setMapView({ center: coordinates, zoom });
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const mapVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] } },
  };

  const mapTransitionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  if (!visitedPlaces) {
    return (
      <CosmicJourneysSection id="journeys" ref={ref}>
        <Container>
          <SectionLabel>{'// nav.coordinates'}</SectionLabel>
          <SectionTitle>Exploration Log</SectionTitle>
        </Container>
      </CosmicJourneysSection>
    );
  }

  const displayedPlaces = currentMap === 'india'
    ? visitedPlaces.filter(place =>
        place.name.includes('India') ||
        (place.coordinates[0] > 68 && place.coordinates[0] < 98 &&
         place.coordinates[1] > 8 && place.coordinates[1] < 37)
      )
    : visitedPlaces;

  return (
    <CosmicJourneysSection id="journeys" ref={ref}>
      <Container>
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={controls}
        >
          <SectionLabel>{'// nav.coordinates'}</SectionLabel>
          <SectionTitle>Exploration Log</SectionTitle>
          <SectionSubtitle>
            Coordinates mapped across physical space — from Gainesville to Guangzhou.
          </SectionSubtitle>
        </motion.div>

        <MapOuter variants={mapVariants} initial="hidden" animate={controls}>
          <MapControls>
            <MapToggle
              $active={currentMap === 'world'}
              onClick={() => { setCurrentMap('world'); setActiveMapConfig(worldMapConfig); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              World
            </MapToggle>
            <MapToggle
              $active={currentMap === 'india'}
              onClick={() => { setCurrentMap('india'); setActiveMapConfig(indiaMapConfig); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              India
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
                style={{ width: '100%', height: '100%' }}
              >
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={activeMapConfig.projectionConfig}
                  aria-label={activeMapConfig.label}
                  width={800}
                  height={500}
                  style={{ width: '100%', height: '100%' }}
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
                          const isIndia = currentMap === 'world' && geo.properties && (
                            geo.properties.GU_A3 === 'IND' ||
                            geo.properties.ISO_A3 === 'IND' ||
                            geo.properties.ADM0_A3 === 'IND' ||
                            (typeof geo.properties.SOVEREIGNT === 'string' && geo.properties.SOVEREIGNT.toLowerCase() === 'india') ||
                            (typeof geo.properties.name === 'string' && geo.properties.name.toLowerCase() === 'india')
                          );

                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={isIndia ? 'rgba(58, 90, 143, 0.8)' : 'rgba(14, 22, 38, 0.95)'}
                              stroke={isIndia ? 'rgba(91, 141, 239, 0.25)' : 'rgba(91, 141, 239, 0.06)'}
                              strokeWidth={0.5}
                              style={{
                                default: { outline: 'none', transition: 'fill 0.2s ease' },
                                hover: {
                                  outline: 'none',
                                  fill: isIndia ? 'rgba(91, 141, 239, 0.55)' : 'rgba(20, 32, 55, 1)',
                                },
                                pressed: { outline: 'none' },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>

                    {displayedPlaces.map((place) => {
                      const currentZoom = mapView.zoom || 1;
                      const isHovered = hoveredMarker === place.id;
                      const dotR = Math.max(1.2, (isHovered ? 5.5 : 3.5) / currentZoom);
                      const ringR = Math.max(2, 9 / currentZoom);
                      const strokeW = Math.max(0.1, 0.5 / currentZoom);

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
                            animate={{ scale: isHovered ? 1.15 : 1 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            style={{ pointerEvents: 'auto' }}
                          >
                            <circle
                              cx={0} cy={0}
                              r={dotR}
                              fill={theme.colors.primary}
                              stroke="rgba(255,255,255,0.12)"
                              strokeWidth={strokeW}
                            />
                            {isHovered && (
                              <motion.circle
                                cx={0} cy={0}
                                r={ringR}
                                fill="none"
                                stroke={theme.colors.primary}
                                strokeWidth={Math.max(0.15, 0.8 / currentZoom)}
                                initial={{ opacity: 0.6, scale: 1 }}
                                animate={{ opacity: [0.6, 0.05, 0.6], scale: [1, 1.8, 1] }}
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

            <MapChrome>
              <MapStat><span>{displayedPlaces.length}</span> nodes mapped</MapStat>
              <MapStat>drag · scroll to navigate</MapStat>
            </MapChrome>
          </MapContainer>
        </MapOuter>
      </Container>

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
