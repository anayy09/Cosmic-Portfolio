const theme = {
  colors: {
    primary: '#5B8DEF',
    primaryMuted: '#3A5A8F',
    secondary: '#7B68B6',
    accent: '#C9A0DC',
    accentWarm: '#D4A574',
    accentTeal: '#0D9488',
    dark: '#0A0B0F',
    darkBlue: '#0E1520',
    nebulaDark: '#130B20',
    surface: 'rgba(14, 20, 32, 0.80)',
    surfaceAlt: 'rgba(20, 28, 44, 0.65)',
    surfaceDeep: 'rgba(8, 12, 20, 0.92)',
    border: 'rgba(91, 141, 239, 0.12)',
    borderBright: 'rgba(91, 141, 239, 0.30)',
    borderTeal: 'rgba(13, 148, 136, 0.25)',
    light: '#E8ECF4',
    muted: '#8892A6',
    subtle: '#4A5568',
    nebula: 'rgba(91, 141, 239, 0.08)',
    success: 'rgba(72, 187, 120, 0.25)',
    warning: 'rgba(230, 180, 80, 0.25)',
    error: 'rgba(220, 90, 90, 0.25)',
    info: 'rgba(91, 141, 239, 0.25)',
  },

  gradients: {
    cosmic: 'linear-gradient(135deg, #0A0B0F 0%, #0E1520 50%, #111B2E 100%)',
    nebula: 'linear-gradient(135deg, #5B8DEF 0%, #7B68B6 100%)',
    aurora: 'linear-gradient(135deg, #5B8DEF 0%, #C9A0DC 100%)',
    health: 'linear-gradient(135deg, #5B8DEF 0%, #0D9488 100%)',
    deep: 'linear-gradient(135deg, #130B20 0%, #0E1520 100%)',
    sundown: 'linear-gradient(135deg, #7B68B6 0%, #C9A0DC 50%, #D4A574 100%)',
    nebulaSubtle: 'linear-gradient(180deg, rgba(91, 141, 239, 0.06) 0%, rgba(123, 104, 182, 0.04) 50%, transparent 100%)',
    subtle: 'linear-gradient(180deg, rgba(91, 141, 239, 0.05) 0%, transparent 100%)',
  },

  fonts: {
    display: "'DM Serif Display', serif",
    main: "'Space Grotesk', sans-serif",
    heading: "'Space Grotesk', sans-serif",
    code: "'Fira Code', monospace",
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    tabletL: '900px',
    laptop: '1024px',
    desktop: '1200px',
    wide: '1440px',
  },

  transitions: {
    standard: '0.35s cubic-bezier(0.25, 1, 0.5, 1)',
    slow: '0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    fast: '0.2s ease-out',
  },

  easing: {
    outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
    outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    springSmooth: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.12)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.14)',
    large: '0 8px 32px rgba(0, 0, 0, 0.18)',
    card: '0 4px 24px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.15)',
    cardHover: '0 12px 48px rgba(0,0,0,0.32), 0 0 40px rgba(91,141,239,0.10)',
    glow: '0 0 24px rgba(91, 141, 239, 0.18)',
    glowTeal: '0 0 24px rgba(13, 148, 136, 0.22)',
    glowStrong: '0 0 60px rgba(91, 141, 239, 0.28)',
    glowMobile: '0 0 12px rgba(91, 141, 239, 0.1)',
    glowSubtle: '0 0 30px rgba(91, 141, 239, 0.08)',
    inner: 'inset 0 1px 0 rgba(255,255,255,0.06)',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    mdSm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    section: '8rem',
  },

  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '20px',
    xxl: '28px',
    pill: '9999px',
  },
};

export default theme;
