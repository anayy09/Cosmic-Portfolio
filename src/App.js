import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './config/theme';
import CosmicBackground from './components/CosmicBackground';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import Timeline from './sections/Timeline';
import Projects from './sections/Projects';

const personalInfo = {
  name: "Anay Sinhal",
  skills: [
    "Software Developer",
    "Machine Learning Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Python Expert",
    "JavaScript Enthusiast"
  ],
  description: "A passionate software and ML developer specializing in creating exceptional digital experiences. Currently focused on building accessible, human-centered products with cutting-edge technologies.",
  github: "https://github.com/anay09",
  linkedin: "https://linkedin.com/in/anaysinhal",
  email: "anaysinhal.edu@gmail.com",
  blog: "https://anay09.hashnode.dev/"
};

// Sample education data
const educationData = [
  {
    title: "Master of Science in Computer Science",
    organization: "Stanford University",
    description: "Specialized in Artificial Intelligence and Machine Learning. Thesis on 'Deep Reinforcement Learning for Autonomous Systems'.",
    startDate: "Sep 2019",
    endDate: "Jun 2021",
    skills: ["Machine Learning", "Deep Learning", "Python", "TensorFlow"]
  },
  {
    title: "Bachelor of Engineering in Computer Science",
    organization: "MIT",
    description: "Graduated with honors. Focus on software engineering and data structures.",
    startDate: "Sep 2015",
    endDate: "Jun 2019",
    skills: ["Algorithms", "Data Structures", "Java", "C++"]
  }
];

// Sample experience data
const experienceData = [
  {
    title: "Senior Software Engineer",
    organization: "Google",
    description: "Leading a team developing machine learning solutions for Google Cloud Platform. Implemented scalable ML pipelines and APIs.",
    startDate: "Jul 2021",
    endDate: null, // null means "Present"
    skills: ["Python", "TensorFlow", "Cloud Architecture", "Team Leadership"]
  },
  {
    title: "Machine Learning Engineer",
    organization: "Tesla",
    description: "Worked on computer vision algorithms for Tesla Autopilot. Improved object detection accuracy by 15%.",
    startDate: "Aug 2019",
    endDate: "Jun 2021",
    skills: ["Computer Vision", "PyTorch", "CUDA", "C++"]
  },
  {
    title: "Software Developer Intern",
    organization: "Microsoft",
    description: "Developed features for Microsoft Office 365. Implemented real-time collaboration tools.",
    startDate: "May 2018",
    endDate: "Aug 2018",
    skills: ["JavaScript", "React", "Azure", "WebSockets"]
  }
];

// Sample custom projects (in addition to GitHub projects)
const customProjects = [
  {
    id: "custom-1",
    name: "Neural Style Transfer App",
    description: "A web application that applies artistic styles to images using deep neural networks. Built with TensorFlow.js and React.",
    url: "https://github.com/yourusername/neural-style-transfer",
    homepage: "https://neural-style-demo.netlify.app",
    language: "JavaScript",
    topics: ["machine-learning", "tensorflow", "react", "computer-vision"],
    isManual: true
  }
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CosmicBackground />
      <Navigation />
      <div className="App">
        <Hero 
          name={personalInfo.name}
          skills={personalInfo.skills}
          description={personalInfo.description}
          github={personalInfo.github}
          linkedin={personalInfo.linkedin}
          email={personalInfo.email}
          blog={personalInfo.blog}
        />
        <Timeline 
          education={educationData}
          experience={experienceData}
        />
        <Projects 
          githubUsername="anayy09" // Replace with your actual GitHub username
          customProjects={customProjects}
        />
        {/* We'll add more sections in the next parts */}
      </div>
    </ThemeProvider>
  );
}

export default App;