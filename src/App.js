import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './config/theme';
import personalInfo from './config/personalInfo';
import CosmicBackground from './components/CosmicBackground';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import Skills from './sections/Skills';
import Timeline from './sections/Timeline';
import Projects from './sections/Projects';
import Blogs from './sections/Blogs';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import CosmicLoader from './components/CosmicLoader';
import Publications from './sections/Publications';
import Certifications from './sections/Certifications';
import CosmicJourneys from './sections/CosmicJourneys';
import CVViewer from './components/CVViewer';

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

  const HomePage = () => (
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
          cv={personalInfo.cv}
        />
        <Timeline
          education={personalInfo.education}
          experience={personalInfo.experience}
        />
        <Projects 
          githubUsername={personalInfo.apis.github.username}
          customProjects={personalInfo.customProjects}
        />
        <Skills />
        <Blogs 
          hashnodeUsername={personalInfo.apis.hashnode.username}
        />
        <Publications 
          publications={personalInfo.publications}
        />
        <Certifications 
          certifications={personalInfo.certifications}  
        />
        <CosmicJourneys />
        <Contact 
          email={personalInfo.email}
          linkedin={personalInfo.linkedin}
          github={personalInfo.github}
        />
        <Footer />
      </div>
    </>
  );
  
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        
        {loading ? (
          <CosmicLoader finishLoading={finishLoading} />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cv" element={<CVViewer />} />
          </Routes>
        )}
      </ThemeProvider>
    </Router>
  );
}

export default App;