const theme = {
  colors: {
    // Softer, more elegant cosmic palette
    primary: '#5B8DEF',       // Muted sky blue
    primaryMuted: '#3A5A8F',  // Darker muted blue for subtle accents
    secondary: '#7B68B6',     // Soft lavender violet
    accent: '#C9A0DC',        // Gentle lilac (replaces hot pink)
    accentWarm: '#D4A574',    // Warm gold for highlights
    dark: '#0D0D12',          // Near-black with subtle warmth
    darkBlue: '#101624',      // Deep navy, less saturated
    surface: 'rgba(16, 22, 36, 0.75)',   // Glass card background
    surfaceAlt: 'rgba(22, 30, 48, 0.6)', // Lighter glass variant
    border: 'rgba(91, 141, 239, 0.15)',  // Subtle border color
    light: '#E8ECF4',         // Softer off-white
    muted: '#8892A6',         // Muted text color
    nebula: 'rgba(91, 141, 239, 0.08)',
    success: 'rgba(72, 187, 120, 0.25)',
    warning: 'rgba(230, 180, 80, 0.25)',
    error: 'rgba(220, 90, 90, 0.25)',
    info: 'rgba(91, 141, 239, 0.25)',
  },
  gradients: {
    cosmic: 'linear-gradient(135deg, #0D0D12 0%, #101624 50%, #1A2540 100%)',
    nebula: 'linear-gradient(135deg, #5B8DEF 0%, #7B68B6 100%)',
    aurora: 'linear-gradient(135deg, #5B8DEF 0%, #C9A0DC 100%)',
    subtle: 'linear-gradient(180deg, rgba(91, 141, 239, 0.05) 0%, transparent 100%)',
  },
  fonts: {
    main: "'Space Grotesk', sans-serif",
    heading: "'Space Grotesk', sans-serif",  // Unified for elegance
    code: "'Fira Code', monospace",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1200px',
  },
  transitions: {
    standard: '0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.12)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.14)',
    large: '0 8px 32px rgba(0, 0, 0, 0.18)',
    glow: '0 0 20px rgba(91, 141, 239, 0.15)',
    glowMobile: '0 0 12px rgba(91, 141, 239, 0.1)',
    glowSubtle: '0 0 30px rgba(91, 141, 239, 0.08)',
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