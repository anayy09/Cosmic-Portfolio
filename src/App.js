import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './config/theme';
import personalInfo from './config/personalInfo';
import CosmicBackground from './components/CosmicBackground';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import Timeline from './sections/Timeline';
import Projects from './sections/Projects';
import Blogs from './sections/Blogs';
import WorldMap from './sections/WorldMap';
import AmChartsWorldMap from './sections/AmChartsWorldMap';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import CosmicLoader from './components/CosmicLoader';

function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const finishLoading = () => {
    setLoading(false);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      
      {loading ? (
        <CosmicLoader finishLoading={finishLoading} />
      ) : (
        <>
          <CosmicBackground />
          <Navigation />
          <div className="App">
            <Hero 
              name={personalInfo.name}
              skills={personalInfo.skills}
              description={personalInfo.description}
              github={personalInfo.github}
              linkedin={personalInfo.linkedin}
              email={personalInfo.email}
              blog={personalInfo.blog}
            />
            <Timeline 
              education={personalInfo.education}
              experience={personalInfo.experience}
            />
            <Projects 
              githubUsername={personalInfo.apis.github.username}
              customProjects={personalInfo.customProjects}
            />
            <Blogs 
              hashnodeUsername={personalInfo.apis.hashnode.username}
            />
            <WorldMap 
              csvFilePath={process.env.PUBLIC_URL + "/locations.csv"}
            />
            {/* <AmChartsWorldMap 
              csvFilePath={process.env.PUBLIC_URL + "/locations.csv"}
            /> */}
            <Contact 
              email={personalInfo.email}
              linkedin={personalInfo.linkedin}
              github={personalInfo.github}
            />
            <Footer />
          </div>
        </>
      )}
    </ThemeProvider>
  );
}

export default App;