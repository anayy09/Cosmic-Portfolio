import { createGlobalStyle } from 'styled-components';
import theme from '../config/theme';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: ${theme.fonts.main};
    background-color: ${theme.colors.dark}CC; /* Adding translucency with alpha channel */
    color: ${theme.colors.light};
    overflow-x: hidden;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body::-webkit-scrollbar {
    width: 6px;
  }
  
  body::-webkit-scrollbar-track {
    background: ${theme.colors.dark}CC; /* Adding translucency */
  }
  
  body::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.primaryMuted};
    border-radius: 3px;
    
    &:hover {
      background-color: ${theme.colors.primary};
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.fast};
    
    &:hover {
      color: ${theme.colors.accent};
      opacity: 0.9;
    }
  }
  
  button {
    font-family: ${theme.fonts.main};
    cursor: pointer;
    border: none;
    outline: none;
  }
  
  p {
    line-height: 1.7;
    color: ${theme.colors.light};
  }
  
  .container {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};
    
    @media (max-width: ${theme.breakpoints.tablet}) {
      padding: 0 ${theme.spacing.md};
    }
  }
  
  .section {
    padding: ${theme.spacing.xl} 0;
  }
  
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  ::selection {
    background: ${theme.colors.primary};
    color: ${theme.colors.light};
  }
`;

export default GlobalStyles;