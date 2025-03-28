import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { csv } from 'd3-fetch';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

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

const WorldMap = ({ csvFilePath }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);
  
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
        setLoading(false);
      } catch (err) {
        console.error('Error loading locations:', err);
        setError('Failed to load location data');
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, [csvFilePath]);
  
  const handleMarkerClick = (location, event) => {
    // Get the position of the click relative to the map container
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setPopupPosition({ x, y });
      setSelectedLocation(location);
    }
  };
  
  const handleZoomIn = () => {
    if (zoom < 8) setZoom(zoom * 1.5);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(zoom / 1.5);
  };
  
  const handleReset = () => {
    setZoom(1);
    setCenter([0, 0]);
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
          <StyledComposableMap
            projectionConfig={{
              scale: 170,
            }}
          >
            <ZoomableGroup
              zoom={zoom}
              center={center}
              onMoveEnd={({ coordinates }) => setCenter(coordinates)}
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
                        },
                        hover: {
                          fill: "rgba(66, 133, 244, 0.2)",
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
              
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  coordinates={location.coordinates}
                  onClick={(event) => handleMarkerClick(location, event)}
                >
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 15
                    }}
                  >
                    <circle
                      r={5}
                      fill={location === selectedLocation ? "#FF1493" : "#4285F4"}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      opacity={0.8}
                    />
                    <circle
                      r={10}
                      fill={location === selectedLocation ? "#FF1493" : "#4285F4"}
                      opacity={0.3}
                    />
                    <motion.circle
                      r={15}
                      fill="transparent"
                      stroke={location === selectedLocation ? "#FF1493" : "#4285F4"}
                      strokeWidth={1}
                      opacity={0.5}
                      initial={{ r: 5 }}
                      animate={{ r: 15 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 2,
                      }}
                    />
                  </motion.g>
                </Marker>
              ))}
            </ZoomableGroup>
          </StyledComposableMap>
          
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