import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { csv } from 'd3-fetch';
import { FaMapMarkerAlt, FaTimes, FaList, FaFilter, FaHome, FaInfoCircle } from 'react-icons/fa';
import useSupercluster from 'use-supercluster';
import { scaleLinear } from 'd3-scale';

const WorldMapSection = styled.section`
  min-height: 100vh;
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
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

const MapContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  height: 600px;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(66, 133, 244, 0.3);
  box-shadow: ${props => props.theme.shadows.medium};
  background: rgba(10, 25, 47, 0.5);
  backdrop-filter: blur(10px);
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 400px;
  }
`;

const StyledComposableMap = styled(ComposableMap)`
  width: 100%;
  height: 100%;
`;

const LocationPopup = styled(motion.div)`
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  transform: translate(-50%, -100%);
  background: rgba(10, 25, 47, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 1rem;
  width: 300px;
  border: 1px solid ${props => props.theme.colors.primary};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid ${props => props.theme.colors.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 250px;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PopupTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.light};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.light};
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const PopupDate = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
  font-family: ${props => props.theme.fonts.code};
`;

const PopupDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
`;

const PopupImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-top: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(66, 133, 244, 0.3);
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff6b6b;
  padding: 2rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
`;

const MapControls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MapButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(10, 25, 47, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.light};
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(66, 133, 244, 0.3);
    transform: translateY(-2px);
  }
`;

const TimelineFilter = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.medium};
  z-index: 5;
  max-width: 300px;
  width: 100%;
  transition: all 0.3s ease;
  transform-origin: top right;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: 250px;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.light};
  margin: 0;
`;

const YearSlider = styled.input`
  width: 100%;
  margin: 15px 0;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: rgba(66, 133, 244, 0.3);
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid white;
    
    &:hover {
      transform: scale(1.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid white;
    
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const YearDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.light};
  margin-bottom: 5px;
`;

const SelectedYear = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  display: block;
  margin: 5px 0;
  font-family: ${props => props.theme.fonts.code};
`;

const LocationsList = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.medium};
  z-index: 5;
  max-width: 300px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  transition: all 0.3s ease;
  transform-origin: top left;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: 250px;
    max-height: 300px;
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(10, 25, 47, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }
`;

const LocationItem = styled.div`
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  border: 1px solid transparent;
  
  &:hover, &.active {
    background: rgba(66, 133, 244, 0.2);
    border-color: ${props => props.theme.colors.primary};
  }
  
  h4 {
    margin: 0 0 5px;
    color: ${props => props.theme.colors.light};
    font-size: 1rem;
  }
  
  p {
    margin: 0;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    font-family: ${props => props.theme.fonts.code};
  }
`;

const MapControlButtons = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 5;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(10, 25, 47, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.light};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover, &.active {
    background: rgba(66, 133, 244, 0.5);
    transform: translateY(-2px);
  }
`;

const MapLegend = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.medium};
  z-index: 5;
  max-width: 200px;
  width: 100%;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.light};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LegendMarker = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 10px;
  background: ${props => props.color};
  border: 1px solid white;
`;

const ClusterMarker = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.theme.gradients.cosmic};
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const WorldMap = ({ csvFilePath }) => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);
  const [bounds, setBounds] = useState([-180, -90, 180, 90]);
  const [showFilter, setShowFilter] = useState(false);
  const [showList, setShowList] = useState(false);
  const [yearRange, setYearRange] = useState({ min: 2020, max: 2025 });
  const [selectedYear, setSelectedYear] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.2 });
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  useEffect(() => {
    // Load locations from CSV file
    const fetchLocations = async () => {
      try {
        // If no CSV file path is provided, use sample data
        if (!csvFilePath) {
          const sampleLocations = [
            { name: "New York", coordinates: [-74.0060, 40.7128], date: "June 2022", description: "Visited the Empire State Building and Central Park", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80" },
            { name: "Tokyo", coordinates: [139.6503, 35.6762], date: "March 2023", description: "Explored Shibuya and tried authentic ramen", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80" },
            { name: "Paris", coordinates: [2.3522, 48.8566], date: "September 2021", description: "Visited the Eiffel Tower and Louvre Museum", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" },
            { name: "Sydney", coordinates: [151.2093, -33.8688], date: "January 2023", description: "Enjoyed the beaches and Sydney Opera House", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80" },
            { name: "Cairo", coordinates: [31.2357, 30.0444], date: "November 2022", description: "Explored the pyramids and Egyptian Museum", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80" },
          ];
          setLocations(sampleLocations);
          setFilteredLocations(sampleLocations);
          extractYearRange(sampleLocations);
          setLoading(false);
          return;
        }
        
        // Otherwise load from the provided CSV file
        const data = await csv(csvFilePath);
        const formattedLocations = data.map(d => ({
          name: d.name,
          coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)],
          date: d.date,
          description: d.description,
          image: d.image || null
        }));
        
        setLocations(formattedLocations);
        setFilteredLocations(formattedLocations);
        extractYearRange(formattedLocations);
        setLoading(false);
      } catch (err) {
        console.error('Error loading locations:', err);
        setError('Failed to load location data');
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, [csvFilePath]);
  
  // Extract year range from locations
  const extractYearRange = (locs) => {
    const years = locs.map(loc => {
      const dateMatch = loc.date.match(/\b(20\d{2})\b/);
      return dateMatch ? parseInt(dateMatch[0]) : null;
    }).filter(Boolean);
    
    if (years.length > 0) {
      const min = Math.min(...years);
      const max = Math.max(...years);
      setYearRange({ min, max });
      setSelectedYear(max); // Default to most recent year
    }
  };
  
  // Filter locations by selected year
  useEffect(() => {
    if (selectedYear && locations.length > 0) {
      const filtered = locations.filter(loc => {
        const dateMatch = loc.date.match(/\b(20\d{2})\b/);
        const locYear = dateMatch ? parseInt(dateMatch[0]) : null;
        return locYear && locYear <= selectedYear;
      });
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [selectedYear, locations]);
  
  // Prepare points for clustering
  const points = useMemo(() => {
    return filteredLocations.map(location => ({
      type: "Feature",
      properties: { cluster: false, ...location },
      geometry: {
        type: "Point",
        coordinates: location.coordinates
      }
    }));
  }, [filteredLocations]);
  
  // Get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });
  
  const handleMarkerClick = (marker, event) => {
    // Get the position of the click relative to the map container
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setPopupPosition({ x, y });
      
      // If it's a cluster, zoom to its bounds
      if (marker.properties.cluster) {
        const clusterLeaves = supercluster.getLeaves(marker.id, Infinity);
        if (clusterLeaves.length === 1) {
          // If only one point in cluster, show its popup
          setSelectedLocation(clusterLeaves[0].properties);
        } else {
          // Otherwise, zoom to contain all points in cluster
          const clusterExpansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(marker.id),
            20
          );
          setZoom(clusterExpansionZoom);
          setCenter(marker.geometry.coordinates);
          setSelectedLocation(null);
        }
      } else {
        // It's a single point
        setSelectedLocation(marker.properties);
      }
    }
  };
  
  const handleLocationItemClick = (location) => {
    setCenter(location.coordinates);
    setZoom(6); // Zoom in closer to the location
    setSelectedLocation(location);
    if (window.innerWidth < 768) {
      setShowList(false); // Close list on mobile after selection
    }
  };
  
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };
  
  const handleZoomIn = () => {
    if (zoom < 20) setZoom(Math.min(zoom * 1.5, 20));
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(zoom / 1.5);
  };
  
  const handleReset = () => {
    setZoom(1);
    setCenter([0, 0]);
    setSelectedLocation(null);
  };
  
  const updateBounds = useCallback((width, height, projection) => {
    const bounds = [
      projection.invert([0, 0])[0],
      projection.invert([0, height])[1],
      projection.invert([width, 0])[0],
      projection.invert([width, height])[1]
    ];
    setBounds(bounds);
  }, []);
  
  // Marker size scale based on zoom level
  const getMarkerSize = (count) => {
    const baseSize = count === 1 ? 20 : 30;
    const sizeScale = scaleLinear()
      .domain([1, zoom > 3 ? 5 : 10])
      .range([baseSize, zoom > 3 ? 40 : 60])
      .clamp(true);
      
    return sizeScale(count);
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const mapVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };
  
  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };
  
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <WorldMapSection id="map" ref={ref}>
      <SectionTitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        Places I've Visited
      </SectionTitle>
      
      <SectionSubtitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        Explore the world map to see where my journey has taken me
      </SectionSubtitle>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>
          <h3>Error Loading Map</h3>
          <p>{error}</p>
        </ErrorMessage>
      ) : (
        <MapContainer
          variants={mapVariants}
          initial="hidden"
          animate={controls}
          ref={mapRef}
        >
          <MapControlButtons>
            <ControlButton 
              onClick={() => setShowList(!showList)}
              className={showList ? 'active' : ''}
              title="Show Locations List"
            >
              <FaList />
            </ControlButton>
            <ControlButton 
              onClick={() => setShowFilter(!showFilter)}
              className={showFilter ? 'active' : ''}
              title="Filter By Year"
            >
              <FaFilter />
            </ControlButton>
            <ControlButton 
              onClick={handleReset}
              title="Reset Map View"
            >
              <FaHome />
            </ControlButton>
            <ControlButton 
              onClick={() => setShowLegend(!showLegend)}
              className={showLegend ? 'active' : ''}
              title="Toggle Legend"
            >
              <FaInfoCircle />
            </ControlButton>
          </MapControlButtons>
          
          <AnimatePresence>
            {showFilter && (
              <TimelineFilter
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FilterHeader>
                  <FilterTitle>Timeline Filter</FilterTitle>
                  <CloseButton onClick={() => setShowFilter(false)}>
                    <FaTimes />
                  </CloseButton>
                </FilterHeader>
                
                <SelectedYear>{selectedYear}</SelectedYear>
                
                <YearSlider 
                  type="range"
                  min={yearRange.min}
                  max={yearRange.max}
                  value={selectedYear}
                  onChange={handleYearChange}
                />
                
                <YearDisplay>
                  <span>{yearRange.min}</span>
                  <span>{yearRange.max}</span>
                </YearDisplay>
              </TimelineFilter>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showList && (
              <LocationsList
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FilterHeader>
                  <FilterTitle>Locations ({filteredLocations.length})</FilterTitle>
                  <CloseButton onClick={() => setShowList(false)}>
                    <FaTimes />
                  </CloseButton>
                </FilterHeader>
                
                {filteredLocations.map((location, index) => (
                  <LocationItem 
                    key={index}
                    onClick={() => handleLocationItemClick(location)}
                    className={selectedLocation === location ? 'active' : ''}
                  >
                    <h4>{location.name}</h4>
                    <p>{location.date}</p>
                  </LocationItem>
                ))}
              </LocationsList>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showLegend && (
              <MapLegend
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FilterHeader>
                  <FilterTitle>Map Legend</FilterTitle>
                  <CloseButton onClick={() => setShowLegend(false)}>
                    <FaTimes />
                  </CloseButton>
                </FilterHeader>
                
                <LegendItem>
                  <LegendMarker color="#4285F4" />
                  <span>Location</span>
                </LegendItem>
                <LegendItem>
                  <LegendMarker color="#FF1493" />
                  <span>Selected Location</span>
                </LegendItem>
                <LegendItem>
                  <LegendMarker style={{ background: 'linear-gradient(45deg, #4285F4, #EA4335)' }} />
                  <span>Location Cluster</span>
                </LegendItem>
              </MapLegend>
            )}
          </AnimatePresence>
          
          <StyledComposableMap
            projectionConfig={{
              scale: 170,
            }}
            onResize={(width, height, projection) => updateBounds(width, height, projection)}
          >
            <ZoomableGroup
              zoom={zoom}
              center={center}
              onMoveEnd={({ coordinates, zoom: newZoom }) => {
                setCenter(coordinates);
                setZoom(newZoom);
              }}
              maxZoom={20}
            >
              <Geographies geography="/worldmap.json">
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="rgba(10, 25, 47, 0.8)"
                      stroke="rgba(66, 133, 244, 0.5)"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                          transition: "all 0.3s ease",
                        },
                        hover: {
                          fill: "rgba(66, 133, 244, 0.3)",
                          stroke: "rgba(66, 133, 244, 0.8)",
                          strokeWidth: 1,
                          outline: "none",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {clusters.map((cluster) => {
                // Check if it's a cluster
                const [longitude, latitude] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount } = cluster.properties;
                
                if (isCluster) {
                  return (
                    <Marker
                      key={`cluster-${cluster.id}`}
                      coordinates={[longitude, latitude]}
                      onClick={(event) => handleMarkerClick(cluster, event)}
                    >
                      <ClusterMarker
                        size={getMarkerSize(pointCount)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15
                        }}
                      >
                        {pointCount}
                      </ClusterMarker>
                    </Marker>
                  );
                }
                
                // It's a single point
                return (
                  <Marker
                    key={`location-${cluster.properties.name}`}
                    coordinates={[longitude, latitude]}
                    onClick={(event) => handleMarkerClick(cluster, event)}
                  >
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 15
                      }}
                    >
                      <circle
                        r={5 * (zoom > 3 ? 1 : zoom > 2 ? 1.5 : 2)}
                        fill={cluster.properties === selectedLocation ? "#FF1493" : "#4285F4"}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        opacity={0.8}
                      />
                      <circle
                        r={10 * (zoom > 3 ? 1 : zoom > 2 ? 1.5 : 2)}
                        fill={cluster.properties === selectedLocation ? "#FF1493" : "#4285F4"}
                        opacity={0.3}
                      />
                      <motion.circle
                        r={15 * (zoom > 3 ? 1 : zoom > 2 ? 1.5 : 2)}
                        fill="transparent"
                        stroke={cluster.properties === selectedLocation ? "#FF1493" : "#4285F4"}
                        strokeWidth={1}
                        opacity={0.5}
                        initial={{ r: 5 }}
                        animate={{ r: 15 * (zoom > 3 ? 1 : zoom > 2 ? 1.5 : 2) }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 2,
                        }}
                      />
                    </motion.g>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </StyledComposableMap>
          
          <AnimatePresence>
            {selectedLocation && (
              <LocationPopup
                x={popupPosition.x}
                y={popupPosition.y}
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <PopupHeader>
                  <PopupTitle>{selectedLocation.name}</PopupTitle>
                  <CloseButton onClick={() => setSelectedLocation(null)}>
                    <FaTimes />
                  </CloseButton>
                </PopupHeader>
                <PopupDate>{selectedLocation.date}</PopupDate>
                <PopupDescription>{selectedLocation.description}</PopupDescription>
                {selectedLocation.image && (
                  <PopupImage src={selectedLocation.image} alt={selectedLocation.name} />
                )}
              </LocationPopup>
            )}
          </AnimatePresence>
          
          <MapControls>
            <MapButton onClick={handleZoomIn}>+</MapButton>
            <MapButton onClick={handleZoomOut}>-</MapButton>
            <MapButton onClick={handleReset}>↺</MapButton>
          </MapControls>
        </MapContainer>
      )}
    </WorldMapSection>
  );
};

export default WorldMap;