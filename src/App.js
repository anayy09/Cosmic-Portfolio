// src/App.js
import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './config/theme';

// We'll import our sections here later
// import Hero from './sections/Hero';
// import Timeline from './sections/Timeline';
// import Projects from './sections/Projects';
// import Blogs from './sections/Blogs';
// import WorldMap from './sections/WorldMap';
// import Contact from './sections/Contact';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div className="App">
        <h1>Cosmic Portfolio</h1>
        <p>We're setting up your futuristic portfolio. Stay tuned!</p>
        {/* We'll add our sections here later */}
        {/* <Hero />
        <Timeline />
        <Projects />
        <Blogs />
        <WorldMap />
        <Contact /> */}
      </div>
    </ThemeProvider>
  );
}

export default App;