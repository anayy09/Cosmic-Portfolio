import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './config/theme';
import personalInfo from './config/personalInfo';
import CosmicBackground from './components/CosmicBackground';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Timeline from './sections/Timeline';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Research from './sections/Research';
import CosmicJourneys from './sections/CosmicJourneys';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import CosmicLoader from './components/CosmicLoader';
import CVViewer from './components/CVViewer';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);

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
          title={personalInfo.title}
          skills={personalInfo.skills}
          description={personalInfo.description}
          github={personalInfo.github}
          linkedin={personalInfo.linkedin}
          email={personalInfo.email}
          blog={personalInfo.blog}
          cv={personalInfo.cv}
          orcid={personalInfo.orcid}
        />
        <About about={personalInfo.about} />
        <Timeline
          education={personalInfo.education}
          experience={personalInfo.experience}
        />
        <Projects
          githubUsername={personalInfo.apis.github.username}
          customProjects={personalInfo.customProjects}
        />
        <Skills skillCategories={personalInfo.skillCategories} />
        <Research
          publications={personalInfo.publications}
          patents={personalInfo.patents}
          orcid={personalInfo.orcid}
        />
        <CosmicJourneys />
        <Contact
          email={personalInfo.email}
          linkedin={personalInfo.linkedin}
          github={personalInfo.github}
          orcid={personalInfo.orcid}
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
