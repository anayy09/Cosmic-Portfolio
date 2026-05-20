import { createGlobalStyle } from 'styled-components';
import theme from '../config/theme';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Grotesk:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: ${theme.fonts.main};
    background-color: ${theme.colors.dark};
    color: ${theme.colors.light};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.75;
  }

  body::-webkit-scrollbar {
    width: 5px;
  }

  body::-webkit-scrollbar-track {
    background: ${theme.colors.dark};
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
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: ${theme.colors.light};
  }

  p {
    line-height: 1.75;
    color: ${theme.colors.light};
    max-width: 65ch;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.fast};

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

  img {
    max-width: 100%;
    display: block;
  }

  .container {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.xl};

    @media (max-width: ${theme.breakpoints.tablet}) {
      padding: 0 ${theme.spacing.lg};
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
      padding: 0 ${theme.spacing.md};
    }
  }

  .section {
    padding: 6rem 0;

    @media (max-width: ${theme.breakpoints.tablet}) {
      padding: 4rem 0;
    }
  }

  .section-label {
    font-family: ${theme.fonts.code};
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${theme.colors.primary};
    margin-bottom: 0.75rem;
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
    background: rgba(91, 141, 239, 0.35);
    color: ${theme.colors.light};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  svg.grain-filter {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }
`;

export default GlobalStyles;
