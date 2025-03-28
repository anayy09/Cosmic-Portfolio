const personalInfo = {
    // Basic Information
    name: "Anay Sinhal",
    title: "Software & ML Developer",
    email: "sinhal.anay@ufl.edu",
    
    // Social Links
    github: "https://github.com/anayy09",
    linkedin: "https://linkedin.com/in/anaysinhal",
    blog: "https://anay09.hashnode.dev/",
    
    // About Me
    description: "A passionate software and ML developer specializing in creating exceptional digital experiences. Currently focused on building accessible, human-centered products with cutting-edge technologies.",
    
    // Skills for typing animation
    skills: [
      "Software Developer",
      "Machine Learning Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Python Expert",
      "JavaScript Enthusiast"
    ],
    
    // Education
    education: [
      {
        title: "Senior Certificate in CISE",
        organization: "University of Florida",
        description: "Final Semester of my Bachelor's degree.",
        startDate: "Jan 2025",
        endDate: "May 2025",
        skills: ["Adv Data Structures", "Software Engineering", "Computer Networks", "UX Design"]
      },
      {
        title: "Semester Exchange Program in CS",
        organization: "Indian Institute of Technology, Kanpur",
        description: "Sixth Semester of my Bachelor's degree.",
        startDate: "Jan 2024",
        endDate: "May 2024",
        skills: ["Big Data Visualization", "Brand Management", "Strategic Marketing"]
      },
      {
        title: "Semester Exchange Program in CS",
        organization: "Indian Institute of Technology, Gandhinagar",
        description: "Third Semester of my Bachelor's degree.",
        startDate: "Aug 2022",
        endDate: "Dec 2022",
        skills: ["Theory of Computation", "Data Structures", "Philosophy", "Ethical Leadership", "Graphic Design"]
      },
      {
        title: "Bachelor of Technology in CSE",
        organization: "JK Lakshmipat University",
        description: "Bachelor's degree in Computer Science and Engineering.",
        startDate: "Aug 2021",
        endDate: "May 2025",
        skills: ["Algorithms", "Operating Systems", "Machine Learning", "Web Development"]
      }
    ],
    
    // Experience
    experience: [
      {
      title: "Research Assistant",
      organization: "Indraprastha Institute of Information Technology, Delhi",
      description: "Conducted research in the Signal Processing and Biomedical Imaging (SBI) Lab, optimizing algorithms for medical image enhancement, improving diagnostic accuracy.",
      startDate: "Sep 2024",
      endDate: "Oct 2024",
      location: "Onsite",
      skills: ["Signal Processing", "Biomedical Imaging", "Algorithm Optimization"]
      },
      {
      title: "SDE Intern",
      organization: "GeeksforGeeks, Noida",
      description: "Engineered and optimized interactive modules for Articles, Videos, and Quizzes using Next.js, React.js, and PHP, increasing user engagement and improving SEO rankings.",
      startDate: "May 2024",
      endDate: "Sep 2024",
      location: "Onsite",
      skills: ["Next.js", "React.js", "PHP", "SEO Optimization"]
      },
      {
      title: "Research Intern",
      organization: "Sardar Vallabhbhai National Institute of Technology, Surat",
      description: "Optimized a Contrastive Learning-based depression detection model by refining text embeddings and classification techniques, achieving 12% higher accuracy and co-authoring research publications.",
      startDate: "May 2024",
      endDate: "Jul 2024",
      location: "Hybrid",
      skills: ["Contrastive Learning", "Text Embeddings", "Classification Techniques"]
      },
      {
      title: "Research Intern",
      organization: "Indian Institute of Technology (IIT), Jammu",
      description: "Developed machine learning model for stress prediction by analyzing 11.5M physiological data points, achieving high classification accuracy using Random Forest and Neural Networks.",
      startDate: "Dec 2023",
      endDate: "Jan 2024",
      location: "Remote",
      skills: ["Machine Learning", "Random Forest", "Neural Networks", "Data Analysis"]
      },
      {
      title: "SDE Intern",
      organization: "Dexpert Systems, Pune",
      description: "Developed ReactJS-based web applications and integrated Zoho CRM with Spring Boot & Laravel, streamlining customer management workflows and improving response time.",
      startDate: "Jun 2023",
      endDate: "Jul 2023",
      location: "Onsite",
      skills: ["ReactJS", "Zoho CRM", "Spring Boot", "Laravel"]
      }
    ],
    // // Custom Projects (in addition to GitHub projects)
    // customProjects: [
    //   {
    //     id: "custom-1",
    //     name: "Neural Style Transfer App",
    //     description: "A web application that applies artistic styles to images using deep neural networks. Built with TensorFlow.js and React.",
    //     url: "https://github.com/yourusername/neural-style-transfer",
    //     homepage: "https://neural-style-demo.netlify.app",
    //     language: "JavaScript",
    //     topics: ["machine-learning", "tensorflow", "react", "computer-vision"],
    //     isManual: true
    //   }
    // ],
    
    // API Configuration
    apis: {
      github: {
        username: "anayy09",
      },
      hashnode: {
        username: "anay09"
      },
      emailjs: {
        serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
        templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      }
    }
  };
  
  export default personalInfo;