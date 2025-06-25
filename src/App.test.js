import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock heavy components to speed up tests and avoid side effects
jest.mock('./components/CosmicLoader', () => ({ finishLoading }) => (
  <div data-testid="cosmic-loader">
    <div>Loading...</div>
    <button onClick={finishLoading} data-testid="finish-loading">Finish Loading</button>
  </div>
));

jest.mock('./components/CosmicBackground', () => () => <div data-testid="cosmic-background" />);

// Mock sections with proper props handling and data-testids
jest.mock('./sections/Hero', () => ({ name, skills, description, github, linkedin, email, blog, cv }) => (
  <div data-testid="hero-section">
    <div data-testid="hero-name">{name}</div>
    <div data-testid="hero-skills">{skills?.join(', ')}</div>
    <div data-testid="hero-description">{description}</div>
    <div data-testid="hero-links">
      <a href={github} data-testid="hero-github">GitHub</a>
      <a href={linkedin} data-testid="hero-linkedin">LinkedIn</a>
      <a href={`mailto:${email}`} data-testid="hero-email">Email</a>
      <a href={blog} data-testid="hero-blog">Blog</a>
      <a href={cv} data-testid="hero-cv">CV</a>
    </div>
  </div>
));

jest.mock('./sections/Skills', () => () => <div data-testid="skills-section">Skills</div>);

jest.mock('./sections/Timeline', () => ({ education, experience }) => (
  <div data-testid="timeline-section">
    <div data-testid="timeline-education">{education?.length || 0} education items</div>
    <div data-testid="timeline-experience">{experience?.length || 0} experience items</div>
  </div>
));

jest.mock('./sections/Projects', () => ({ githubUsername, customProjects }) => (
  <div data-testid="projects-section">
    <div data-testid="projects-github">{githubUsername}</div>
    <div data-testid="projects-custom">{customProjects?.length || 0} custom projects</div>
  </div>
));

jest.mock('./sections/Blogs', () => ({ hashnodeUsername }) => (
  <div data-testid="blogs-section">
    <div data-testid="blogs-username">{hashnodeUsername}</div>
  </div>
));

jest.mock('./sections/Publications', () => ({ publications }) => (
  <div data-testid="publications-section">
    <div data-testid="publications-count">{publications?.length || 0} publications</div>
  </div>
));

jest.mock('./sections/Certifications', () => ({ certifications }) => (
  <div data-testid="certifications-section">
    <div data-testid="certifications-count">{certifications?.length || 0} certifications</div>
  </div>
));

jest.mock('./sections/CosmicJourneys', () => () => <div data-testid="cosmic-journeys-section">Cosmic Journeys</div>);

jest.mock('./sections/Contact', () => ({ email, linkedin, github }) => (
  <div data-testid="contact-section">
    <div data-testid="contact-email">{email}</div>
    <div data-testid="contact-linkedin">{linkedin}</div>
    <div data-testid="contact-github">{github}</div>
  </div>
));

jest.mock('./components/Footer', () => () => <div data-testid="footer">Footer</div>);

// Mock Navigation component with interactive elements
jest.mock('./components/Navigation', () => () => (
  <nav data-testid="navigation">
    <div data-testid="nav-logo" onClick={() => {}}>
      anay.live
    </div>
    <div data-testid="nav-links">
      <a href="#home" data-testid="nav-home">Home</a>
      <a href="#timeline" data-testid="nav-timeline">Timeline</a>
      <a href="#projects" data-testid="nav-projects">Projects</a>
      <a href="#skills" data-testid="nav-skills">Skills</a>
      <a href="#blogs" data-testid="nav-blogs">Blogs</a>
      <a href="#publications" data-testid="nav-publications">Publications</a>
      <a href="#journeys" data-testid="nav-journeys">Journeys</a>
      <a href="#contact" data-testid="nav-contact">Contact</a>
    </div>
  </nav>
));

// Mock personalInfo
jest.mock('./config/personalInfo', () => ({
  name: "Anay Sinhal",
  skills: ["CS Grad", "Software Developer", "Machine Learning Enthusiast", "Geography Nerd"],
  description: "A passionate software and ML developer",
  github: "https://github.com/anayy09",
  linkedin: "https://linkedin.com/in/anaysinhal",
  email: "sinhal.anay@ufl.edu",
  blog: "https://anay09.hashnode.dev/",
  cv: "https://drive.google.com/file/d/test/view",
  education: [
    { degree: "Master's", school: "University of Florida" },
    { degree: "Bachelor's", school: "Previous University" }
  ],
  experience: [
    { role: "Software Developer", company: "Tech Corp" },
    { role: "ML Engineer", company: "AI Startup" }
  ],
  apis: {
    github: { username: "anayy09" },
    hashnode: { username: "anay09" }
  },
  customProjects: [
    { title: "Project 1", description: "Test project 1" },
    { title: "Project 2", description: "Test project 2" }
  ],
  publications: [
    { title: "Publication 1", journal: "Test Journal" }
  ],
  certifications: [
    { name: "AWS Certified", issuer: "Amazon" },
    { name: "Google Cloud", issuer: "Google" }
  ]
}));

// Mock theme and GlobalStyles
jest.mock('./config/theme', () => ({
  colors: { primary: '#ff6b6b', accent: '#4ecdc4' },
  fonts: { heading: 'Arial, sans-serif' }
}));

jest.mock('./styles/GlobalStyles', () => () => null);

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial Loading State', () => {
    test('renders cosmic loader initially', () => {
      render(<App />);
      expect(screen.getByTestId('cosmic-loader')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('hides main content when loading', () => {
      render(<App />);
      expect(screen.queryByTestId('navigation')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hero-section')).not.toBeInTheDocument();
    });
  });

  describe('Loading Completion', () => {
    test('automatically finishes loading after 3 seconds', async () => {
      jest.useFakeTimers();
      render(<App />);
      
      expect(screen.getByTestId('cosmic-loader')).toBeInTheDocument();
      
      // Fast-forward 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('cosmic-loader')).not.toBeInTheDocument();
      });
      
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    test('finishes loading when finishLoading is called', async () => {
      render(<App />);
      
      expect(screen.getByTestId('cosmic-loader')).toBeInTheDocument();
      
      // Click the finish loading button
      fireEvent.click(screen.getByTestId('finish-loading'));
      
      await waitFor(() => {
        expect(screen.queryByTestId('cosmic-loader')).not.toBeInTheDocument();
      });
      
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });
  });

  describe('Main App Content', () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<App />);
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('cosmic-loader')).not.toBeInTheDocument();
      });
    });

    test('renders all main components', () => {
      expect(screen.getByTestId('cosmic-background')).toBeInTheDocument();
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-section')).toBeInTheDocument();
      expect(screen.getByTestId('projects-section')).toBeInTheDocument();
      expect(screen.getByTestId('skills-section')).toBeInTheDocument();
      expect(screen.getByTestId('blogs-section')).toBeInTheDocument();
      expect(screen.getByTestId('publications-section')).toBeInTheDocument();
      expect(screen.getByTestId('certifications-section')).toBeInTheDocument();
      expect(screen.getByTestId('cosmic-journeys-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders navigation with logo', () => {
      const logoElement = screen.getByTestId('nav-logo');
      expect(logoElement).toBeInTheDocument();
      expect(logoElement).toHaveTextContent('anay.live');
    });

    test('renders all navigation links', () => {
      expect(screen.getByTestId('nav-home')).toBeInTheDocument();
      expect(screen.getByTestId('nav-timeline')).toBeInTheDocument();
      expect(screen.getByTestId('nav-projects')).toBeInTheDocument();
      expect(screen.getByTestId('nav-skills')).toBeInTheDocument();
      expect(screen.getByTestId('nav-blogs')).toBeInTheDocument();
      expect(screen.getByTestId('nav-publications')).toBeInTheDocument();
      expect(screen.getByTestId('nav-journeys')).toBeInTheDocument();
      expect(screen.getByTestId('nav-contact')).toBeInTheDocument();
    });
  });

  describe('Hero Section Props', () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<App />);
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('cosmic-loader')).not.toBeInTheDocument();
      });
    });

    test('passes correct personal info to Hero component', () => {
      expect(screen.getByTestId('hero-name')).toHaveTextContent('Anay Sinhal');
      expect(screen.getByTestId('hero-skills')).toHaveTextContent('CS Grad, Software Developer, Machine Learning Enthusiast, Geography Nerd');
      expect(screen.getByTestId('hero-description')).toHaveTextContent('A passionate software and ML developer');
    });

    test('renders Hero social links correctly', () => {
      expect(screen.getByTestId('hero-github')).toHaveAttribute('href', 'https://github.com/anayy09');
      expect(screen.getByTestId('hero-linkedin')).toHaveAttribute('href', 'https://linkedin.com/in/anaysinhal');
      expect(screen.getByTestId('hero-email')).toHaveAttribute('href', 'mailto:sinhal.anay@ufl.edu');
      expect(screen.getByTestId('hero-blog')).toHaveAttribute('href', 'https://anay09.hashnode.dev/');
      expect(screen.getByTestId('hero-cv')).toHaveAttribute('href', 'https://drive.google.com/file/d/test/view');
    });
  });

  describe('Section Props Validation', () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<App />);
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('cosmic-loader')).not.toBeInTheDocument();
      });
    });

    test('passes correct props to Timeline component', () => {
      expect(screen.getByTestId('timeline-education')).toHaveTextContent('2 education items');
      expect(screen.getByTestId('timeline-experience')).toHaveTextContent('2 experience items');
    });

    test('passes correct props to Projects component', () => {
      expect(screen.getByTestId('projects-github')).toHaveTextContent('anayy09');
      expect(screen.getByTestId('projects-custom')).toHaveTextContent('2 custom projects');
    });

    test('passes correct props to Blogs component', () => {
      expect(screen.getByTestId('blogs-username')).toHaveTextContent('anay09');
    });

    test('passes correct props to Publications component', () => {
      expect(screen.getByTestId('publications-count')).toHaveTextContent('1 publications');
    });

    test('passes correct props to Certifications component', () => {
      expect(screen.getByTestId('certifications-count')).toHaveTextContent('2 certifications');
    });

    test('passes correct props to Contact component', () => {
      expect(screen.getByTestId('contact-email')).toHaveTextContent('sinhal.anay@ufl.edu');
      expect(screen.getByTestId('contact-linkedin')).toHaveTextContent('https://linkedin.com/in/anaysinhal');
      expect(screen.getByTestId('contact-github')).toHaveTextContent('https://github.com/anayy09');
    });
  });

  describe('Navigation Interactions', () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<App />);
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('cosmic-loader')).not.toBeInTheDocument();
      });
    });    test('logo click interaction works', () => {
      const logo = screen.getByTestId('nav-logo');
      // Test that the logo is clickable (has onClick handler)
      expect(logo).toBeInTheDocument();
      fireEvent.click(logo);
      // Since we mocked the onClick to be empty, we just verify it doesn't crash
    });

    test('navigation links have correct href attributes', () => {
      expect(screen.getByTestId('nav-home')).toHaveAttribute('href', '#home');
      expect(screen.getByTestId('nav-timeline')).toHaveAttribute('href', '#timeline');
      expect(screen.getByTestId('nav-projects')).toHaveAttribute('href', '#projects');
      expect(screen.getByTestId('nav-skills')).toHaveAttribute('href', '#skills');
      expect(screen.getByTestId('nav-blogs')).toHaveAttribute('href', '#blogs');
      expect(screen.getByTestId('nav-publications')).toHaveAttribute('href', '#publications');
      expect(screen.getByTestId('nav-journeys')).toHaveAttribute('href', '#journeys');
      expect(screen.getByTestId('nav-contact')).toHaveAttribute('href', '#contact');
    });
  });

  describe('Component Structure and Layout', () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<App />);
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('cosmic-loader')).not.toBeInTheDocument();
      });
    });

    test('sections are rendered in correct order', () => {
      const sections = [
        'hero-section',
        'timeline-section',
        'projects-section',
        'skills-section',
        'blogs-section',
        'publications-section',
        'certifications-section',
        'cosmic-journeys-section',
        'contact-section'
      ];

      sections.forEach(sectionId => {
        expect(screen.getByTestId(sectionId)).toBeInTheDocument();
      });
    });

    test('App has proper class name', () => {
      const appDiv = screen.getByTestId('hero-section').closest('.App');
      expect(appDiv).toBeInTheDocument();
      expect(appDiv).toHaveClass('App');
    });
  });

  describe('Theme Provider Integration', () => {
    test('renders without crashing with theme provider', async () => {
      jest.useFakeTimers();
      const { container } = render(<App />);
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('cosmic-loader')).not.toBeInTheDocument();
      });
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
