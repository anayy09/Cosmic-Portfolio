import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './config/theme';
import CosmicBackground from './components/CosmicBackground';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';

const personalInfo = {
  name: "Anay Sinhal",
  skills: [
    "Software Developer",
    "Machine Learning Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Python Expert",
    "JavaScript Enthusiast"
  ],
  description: "A passionate software and ML developer specializing in creating exceptional digital experiences. Currently focused on building accessible, human-centered products with cutting-edge technologies.",
  github: "https://github.com/anay09",
  linkedin: "https://linkedin.com/in/anaysinhal",
  email: "anaysinhal.edu@gmail.com",
  blog: "https://anay09.hashnode.dev/"
};

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
        {/* We'll add more sections in the next parts */}
      </div>
    </ThemeProvider>
  );
}

export default App;