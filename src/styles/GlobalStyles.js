import { createGlobalStyle } from 'styled-components';
import theme from '../config/theme';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Yatra+One:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: ${theme.fonts.main};
    background-color: ${theme.colors.dark};
    color: ${theme.colors.light};
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
  
  body::-webkit-scrollbar {
    width: 8px;
  }
  
  body::-webkit-scrollbar-track {
    background: ${theme.colors.dark};
  }
  
  body::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.primary};
    border-radius: 20px;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 600;
    line-height: 1.2;
  }
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.standard};
    
    &:hover {
      color: ${theme.colors.accent};
    }
  }
  
  button {
    font-family: ${theme.fonts.main};
    cursor: pointer;
    border: none;
    outline: none;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
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
`;

export default GlobalStyles;