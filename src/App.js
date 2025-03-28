import React from 'react';
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
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
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
        <Contact 
          email={personalInfo.email}
          linkedin={personalInfo.linkedin}
          github={personalInfo.github}
        />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;