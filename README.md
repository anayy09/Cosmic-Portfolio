# Cosmic Portfolio

**A dynamic and interactive personal portfolio website built with React, Three.js, and modern web technologies, showcasing software engineering and machine learning projects.**

## About

Cosmic Portfolio is a responsive, single-page application designed to present a comprehensive overview of Anay Sinhal's skills, projects, and experience in software development and machine learning. The portfolio features an engaging user experience with interactive 3D elements, real-time data fetching from external APIs, and a sleek, contemporary design.

## Features

* **Interactive 3D Cosmic Background**: Engaging and animated background leveraging Three.js and `@react-three/fiber` for a visually stunning experience.
* **Dynamic Content**:
  * **GitHub Projects**: Automatically fetches and displays project repositories from GitHub.
  * **Hashnode Blogs**: Integrates and showcases blog posts from Hashnode.
* **Typed Text Effect**: Professional and animated introduction text.
* **Comprehensive Sections**:
  * Hero section with a captivating introduction.
  * Detailed listings for Projects (GitHub and custom).
  * Integrated Blogs section.
  * Certifications and Publications.
  * Interactive Timeline for education and professional experience.
  * Contact section with EmailJS integration for direct messaging.
* **Theming**: Supports both Light and Dark themes for user preference.
* **Responsive Design**: Ensures optimal viewing and interaction across various devices and screen sizes.

## Tech Stack

The project is built using a modern technology stack:

* **Core**:
  * React 18
  * React Router DOM for navigation
* **Styling**:
  * Styled-components
  * Framer Motion for animations
* **3D Graphics**:
  * Three.js
  * `@react-three/fiber`
  * `@react-three/drei`
  * `@react-three/postprocessing`
* **Data Fetching & Handling**:
  * Axios
  * `d3-fetch`, `d3-scale`
  * `supercluster`, `use-supercluster` (for map-related features or data clustering)
* **Charting/Visualization**:
  * `@amcharts/amcharts5`, `@amcharts/amcharts5-fonts`, `@amcharts/amcharts5-geodata` (For advanced charting and geographical data visualization)
  * `react-simple-maps`
* **Utilities**:
  * EmailJS (`@emailjs/browser`) for the contact form.
  * `lottie-react` for Lottie animations.
  * `react-icons` for iconography.
* **Development & Testing**:
  * React Scripts (`react-scripts`)
  * Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)
  * ESLint for linting.

## Project Structure

The project follows a modular structure for better organization and maintainability:

```plaintext
cosmic-portfolio/
├── public/                   # Static assets (index.html, manifest.json, images, etc.)
│   ├── index.html
│   ├── manifest.json
│   ├── moon.png
│   ├── robots.txt
│   ├── projects/             # Custom project images
│   └── textures/             # Textures for 3D elements
├── src/
│   ├── App.css               # Main application styles
│   ├── App.js                # Root application component
│   ├── App.test.js           # Application tests
│   ├── index.css             # Global styles
│   ├── index.js              # Entry point of the React application
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── components/           # Reusable UI components (e.g., CosmicBackground, Footer)
│   ├── config/               # Configuration files (personalInfo.js, theme.js)
│   ├── hooks/                # Custom React Hooks (e.g., useGitHubProjects, useHashnodeBlogs)
│   ├── sections/             # Major page sections (e.g., Hero, Projects, Blogs, Contact)
│   │   ├── in.json           # Data for sections (potentially for amCharts)
│   │   └── topo.json         # TopoJSON data for maps (potentially for amCharts or react-simple-maps)
│   └── styles/               # Global and shared style definitions (e.g., GlobalStyles.js)
├── package.json              # Project metadata and dependencies
└── README.md                 # This file
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

* Node.js (v18.x recommended)
* npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/anayy09/cosmic-portfolio.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd cosmic-portfolio
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

   (or `yarn install` if you prefer yarn)

### Available Scripts

In the project directory, you can run the following scripts:

* **`npm start`**:
  Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits.

* **`npm run build`**:
  Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

Most personal information and content can be customized by editing the `src/config/personalInfo.js` file. This includes:

* Name, professional title, contact email, and social media links.
* Details for education, work experience, and skills.
* Content for custom projects and publications.

Theme settings (colors, fonts, etc.) can be adjusted in `src/config/theme.js` and `src/styles/GlobalStyles.js`.

**Email**: [sinhal.anay@ufl.edu](mailto:sinhal.anay@ufl.edu)