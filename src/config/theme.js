const theme = {
    colors: {
      primary: '#4285F4',       // Rich cosmic blue
      secondary: '#8A2BE2',     // Deep purple
      accent: '#FF1493',        // Bright pink for highlights
      dark: '#121212',          // Near black for backgrounds
      darkBlue: '#0A192F',      // Dark blue for depth
      light: '#F8F9FA',         // Light color for text
      nebula: 'rgba(66, 133, 244, 0.1)', // Transparent blue for overlays
    },
    gradients: {
      cosmic: 'linear-gradient(135deg, #121212 0%, #0A192F 50%, #4285F4 100%)',
      nebula: 'linear-gradient(to right, #4285F4, #8A2BE2)',
      aurora: 'linear-gradient(to right, #00C9FF, #92FE9D)',
    },
    fonts: {
      main: "'Space Grotesk', sans-serif",
      heading: "'Orbitron', sans-serif",
      code: "'Fira Code', monospace",
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1200px',
    },
    transitions: {
      standard: '0.3s ease',
      slow: '0.6s ease-in-out',
      fast: '0.15s ease',
    },
    shadows: {
      small: '0 2px 10px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 20px rgba(0, 0, 0, 0.15)',
      large: '0 10px 40px rgba(0, 0, 0, 0.2)',
      glow: '0 0 15px rgba(66, 133, 244, 0.5)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '2rem',
      xl: '4rem',
    }
  };
  
  export default theme;