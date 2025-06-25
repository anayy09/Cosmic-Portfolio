# AGENT.md - Cosmic Portfolio Project Guide

## Project Overview

**Cosmic Portfolio** is a React-based personal portfolio website with a cosmic/space theme. It features interactive components, animations, and a dynamic map showing travel journeys. The project uses modern web technologies and follows responsive design principles.

## Tech Stack

### Core Technologies
- **React** 18.x - Frontend framework
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations and transitions
- **React Simple Maps** - Interactive world map visualization

### Key Dependencies
```json
{
  "react": "^18.x",
  "styled-components": "^5.x",
  "framer-motion": "^10.x",
  "react-simple-maps": "^3.x"
}
```

### Development Tools
- Create React App (CRA) setup
- ES6+ JavaScript
- CSS-in-JS with theme system
- Responsive design patterns

## Project Structure

```
Cosmic-Portfolio/
├── public/
│   ├── index.html              # Main HTML template
│   ├── manifest.json           # PWA manifest
│   ├── moon.png               # Favicon/logo
│   ├── robots.txt             # SEO robots file
│   ├── projects/              # Project screenshots
│   │   ├── custom-3.png
│   │   ├── custom-4.png
│   │   ├── custom-5.png
│   │   └── custom-6.png
│   └── textures/
│       └── 2k_moon.jpg        # Background texture
├── src/
│   ├── App.js                 # Main app component
│   ├── App.css                # Global app styles
│   ├── index.js               # React DOM entry point
│   ├── index.css              # Global CSS
│   ├── components/            # Reusable components
│   │   ├── CosmicBackground.js    # Animated background
│   │   ├── CosmicLoader.js        # Loading component
│   │   ├── Footer.js              # Site footer
│   │   ├── Navigation.js          # Navigation bar
│   │   ├── SocialLinks.js         # Social media links
│   │   └── TypedText.js           # Typing animation
│   ├── config/                # Configuration files
│   │   ├── personalInfo.js        # Personal data & content
│   │   └── theme.js               # Styled-components theme
│   ├── hooks/                 # Custom React hooks
│   │   ├── useGitHubProjects.js   # GitHub API integration
│   │   └── useHashnodeBlogs.js    # Hashnode blog integration
│   ├── sections/              # Page sections
│   │   ├── Blogs.js               # Blog posts section
│   │   ├── Certifications.js      # Certifications display
│   │   ├── Contact.js             # Contact form
│   │   ├── CosmicJourneys.js      # Interactive map
│   │   ├── Hero.js                # Hero/landing section
│   │   ├── Projects.js            # Projects showcase
│   │   ├── Publications.js        # Publications list
│   │   ├── Timeline.js            # Experience timeline
│   │   ├── in.json               # India map data
│   │   └── topo.json             # World map data
│   └── styles/
│       └── GlobalStyles.js        # Global styled-components
├── package.json               # Dependencies & scripts
├── README.md                  # Project documentation
└── AGENT.md                   # This file
```

## Key Components & Features

### 1. CosmicJourneys (Interactive Map)
- **File**: `src/sections/CosmicJourneys.js`
- **Purpose**: Interactive world map showing travel experiences
- **Features**:
  - Zoom-responsive markers that scale with map zoom level
  - Toggle between world and India views
  - Hover tooltips with location details
  - Smooth animations using Framer Motion
- **Data Source**: `personalInfo.visitedPlaces` array

### 2. Theme System
- **File**: `src/config/theme.js`
- **Purpose**: Centralized design system
- **Includes**:
  - Color palette (cosmic theme)
  - Typography scales
  - Breakpoints for responsive design
  - Gradients and shadows
  - Animation transitions

### 3. Personal Information Config
- **File**: `src/config/personalInfo.js`
- **Purpose**: Centralized content management
- **Contains**:
  - Personal details
  - Skills and technologies
  - Experience timeline
  - Project information
  - Travel destinations with coordinates
  - Social media links

### 4. Custom Hooks
- **useGitHubProjects**: Fetches GitHub repositories
- **useHashnodeBlogs**: Fetches blog posts from Hashnode

## Content Management

### Adding New Travel Locations
Edit `src/config/personalInfo.js`:
```javascript
visitedPlaces: [
  {
    id: 'unique-id',
    name: 'Location Name',
    coordinates: [longitude, latitude],
    story: 'Travel story or experience',
    significance: 'Why this place is important'
  }
]
```

### Updating Personal Information
All personal content is managed through `src/config/personalInfo.js`:
- Contact details
- Skills and technologies
- Experience timeline
- Project portfolios
- Certifications

### Theme Customization
Modify `src/config/theme.js` to change:
- Color schemes
- Typography
- Spacing
- Animation timings
- Responsive breakpoints

## Development Guidelines

### Code Style
- Use functional components with hooks
- Styled-components for all styling
- Framer Motion for animations
- ESLint and Prettier for code formatting

### Responsive Design
- Mobile-first approach
- Breakpoints defined in theme:
  - Mobile: 768px
  - Tablet: 1024px
  - Desktop: 1200px

### Animation Patterns
- Use Framer Motion variants for consistent animations
- Scroll-triggered animations with `useInView`
- Hover states for interactive elements
- Page transitions between sections

### Performance Considerations
- Lazy loading for images
- Optimized map rendering
- Memoized components where appropriate
- Efficient re-renders

## API Integrations

### GitHub Projects
- **Endpoint**: GitHub REST API
- **Hook**: `useGitHubProjects`
- **Data**: Repository information, stars, forks, languages

### Hashnode Blogs
- **Endpoint**: Hashnode GraphQL API
- **Hook**: `useHashnodeBlogs`
- **Data**: Blog posts, titles, dates, excerpts

## Build & Deployment

### Development
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Create production build
```

### Environment Variables
Create `.env` file for sensitive data:
```
REACT_APP_GITHUB_TOKEN=your_github_token
REACT_APP_HASHNODE_USERNAME=your_hashnode_username
```

### Production Build
- Optimized for performance
- Static asset optimization
- Service worker for PWA features

## Troubleshooting

### Common Issues

1. **Map not loading**: Check `topo.json` and `in.json` files exist
2. **API failures**: Verify GitHub/Hashnode tokens and usernames
3. **Styling issues**: Ensure theme provider wraps the app
4. **Animation glitches**: Check Framer Motion version compatibility

### Debug Tips
- Use React DevTools for component inspection
- Check browser console for errors
- Verify network requests in DevTools
- Test responsive design with device simulation

## Future Enhancements

### Planned Features
- Dark/light theme toggle
- Blog CMS integration
- Project filtering and search
- Enhanced map interactions
- Performance analytics
- SEO optimizations

### Technical Debt
- Migrate to TypeScript
- Implement unit tests
- Add accessibility improvements
- Optimize bundle size
- Add error boundaries

## Contributing

### Setup for New Developers
1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env` file with required tokens
4. Start development server: `npm start`
5. Review this AGENT.md file
6. Familiarize yourself with the codebase structure

### Code Review Checklist
- [ ] Responsive design tested
- [ ] Animations smooth and purposeful
- [ ] No console errors
- [ ] Theme system used consistently
- [ ] Performance impact considered
- [ ] Accessibility guidelines followed

## Contact & Support

For questions about this project structure or implementation details, refer to the main README.md or contact the project maintainer through the contact section of the portfolio.

---

*Last updated: June 2025*
*Project Version: 1.0*
*React Version: 18.x*
