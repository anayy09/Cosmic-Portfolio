const personalInfo = {
  // Basic Information
  name: "Anay Sinhal",
  title: "Software & ML Developer",
  email: "sinhal.anay@ufl.edu",

  // Social Links
  github: "https://github.com/anayy09",
  linkedin: "https://linkedin.com/in/anaysinhal",
  blog: "https://anay09.hashnode.dev/",
  cv: "/cv",

  // About Me
  description: "A passionate software and ML developer specializing in creating exceptional digital experiences. Currently focused on building accessible, human-centered products with cutting-edge technologies.",

  // Skills for typing animation
  skills: [
    "CS Grad",
    "Software Developer",
    "ML Enthusiast",
    "Geography Nerd",
  ],

  // Technologies and tools for dedicated Skills section
  techStack: [
    { name: "C", url: "https://en.wikipedia.org/wiki/C_(programming_language)" },
    { name: "C++", url: "https://isocpp.org" },
    { name: "Python", url: "https://www.python.org" },
    { name: "Java", url: "https://www.java.com" },
    { name: "JavaScript", url: "https://developer.mozilla.org/docs/Web/JavaScript" },
    { name: "Golang", url: "https://go.dev" },
    { name: "TypeScript", url: "https://www.typescriptlang.org" },
    { name: "React.js", url: "https://react.dev" },
    { name: "Next.js", url: "https://nextjs.org" },
    { name: "Django", url: "https://www.djangoproject.com" },
    { name: "TensorFlow", url: "https://www.tensorflow.org" },
    { name: "Keras", url: "https://keras.io" },
    { name: "PyTorch", url: "https://pytorch.org" },
    // { name: "Hugging Face", url: "https://huggingface.co" },
    { name: "MySQL", url: "https://www.mysql.com" },
    { name: "Docker", url: "https://www.docker.com" },
    { name: "Unreal Engine", url: "https://www.unrealengine.com" },
    { name: "Blender", url: "https://www.blender.org" },
    { name: "Figma", url: "https://www.figma.com" },
  ],

  // Education
  education: [
    {
      title: "Master's in CS",
      organization: "University of Florida",
      logoUrl: "/logos/uf.png",
      description: "Final semester of Bachelor's transitioned into Master's.",
      startDate: "Jan 2025",
      endDate: "Dec 2026",
      skills: ["Adv Data Structures", "Networks", "Algorithms", "Distributed Systems", "Data Science"]
    },
    {
      title: "Semester Exchange",
      organization: "IIT Kanpur",
      logoUrl: "/logos/iitk.png",
      description: "Sixth Semester of Bachelor's.",
      startDate: "Jan 2024",
      endDate: "May 2024",
      skills: ["Big Data", "Brand Management", "Marketing"]
    },
    {
      title: "Semester Exchange",
      organization: "IIT Gandhinagar",
      logoUrl: "/logos/iitgn.png",
      description: "Third Semester of Bachelor's.",
      startDate: "Aug 2022",
      endDate: "Dec 2022",
      skills: ["Theory of Computation", "Data Structures", "Philosophy"]
    },
    {
      title: "Bachelor's in CS",
      organization: "JK Lakshmipat University",
      logoUrl: "/logos/jklu.png",
      description: "Bachelor's in Computer Science.",
      startDate: "Aug 2021",
      endDate: "May 2025",
      skills: ["Algorithms", "OS", "Machine Learning"]
    }
  ],

  // Experience
  experience: [
    {
      title: "Graduate Research Assistant",
      organization: "UF Intelligent Clinical Care Center (IC3)",
      logoUrl: "/logos/ic3.png",
      description: "Conducting research & development in health technologies.",
      startDate: "Sep 2025",
      endDate: "Dec 2026",
      location: "Onsite",
      skills: ["Data Analysis", "Full-Stack Development"]
    },
    {
      title: "Research Assistant",
      organization: "IIIT Delhi",
      logoUrl: "/logos/iiitd.png",
      description: "Optimized algorithms for medical image enhancement in SBI Lab.",
      startDate: "Sep 2024",
      endDate: "Oct 2024",
      location: "Onsite",
      skills: ["Signal Processing", "Biomedical Imaging"]
    },
    {
      title: "SDE Intern",
      organization: "GeeksforGeeks, Noida",
      logoUrl: "/logos/gfg.png",
      description: "Built and optimized interactive modules using Next.js and React.js.",
      startDate: "May 2024",
      endDate: "Sep 2024",
      location: "Onsite",
      skills: ["Next.js", "React.js", "PHP", "SEO Optimization"]
    },
    {
      title: "Research Intern",
      organization: "SVNIT, Surat",
      logoUrl: "/logos/svnit.png",
      description: "Enhanced depression detection model with contrastive learning.",
      startDate: "May 2024",
      endDate: "Jul 2024",
      location: "Hybrid",
      skills: ["Contrastive Learning", "Text Embeddings"]
    },
    {
      title: "Research Intern",
      organization: "IIT Jammu",
      logoUrl: "/logos/iitjmu.png",
      description: "Developed ML model for stress prediction using physiological data.",
      startDate: "Dec 2023",
      endDate: "Jan 2024",
      location: "Remote",
      skills: ["Machine Learning", "Random Forest", "Neural Networks"]
    },
    {
      title: "SDE Intern",
      organization: "Dexpert Systems, Pune",
      logoUrl: "/logos/dexpert.png",
      description: "Built ReactJS apps and integrated Zoho CRM with backend systems.",
      startDate: "Jun 2023",
      endDate: "Jul 2023",
      location: "Onsite",
      skills: ["ReactJS", "Zoho CRM", "Spring Boot", "Laravel"]
    }
  ],

  customProjects: [
    {
      id: "custom-1",
      name: "Navigator AI Console",
      description: "Next.js 14 + TypeScript web console unifying chat, embeddings, and Whisper STT across 12 LLM endpoints via LiteLLM gateway with ≤200ms median latency. PostgreSQL + Redis metering with NextAuth for quota management.",
      url: "https://github.com/anayy09/navigator-ai-console",
      homepage: "https://navigator-console.vercel.app/",
      language: "TypeScript",
      topics: ["nextjs", "llm"],
      isManual: true,
      imageUrl: "/projects/custom-1.png"
    },
    {
      id: "custom-2",
      name: "P2P File Sharing System",
      description: "Re-implemented BitTorrent protocol in Java 17 with novel Disaster Mode (fountain coding + super-peer election) sustaining >85% goodput on 40% loss testbed. Multi-threaded architecture 4× faster than baseline.",
      url: "https://github.com/anayy09/P2PFileSharing",
      homepage: "",
      language: "Java",
      topics: ["tcp", "networking"],
      isManual: true,
      imageUrl: "/projects/custom-2.png"
    },
    {
      id: "custom-3",
      name: "License Plate Management System",
      description: "Custom Red-Black Tree implementation for registering, searching, and range-querying 100k plates in O(log n). 99th-percentile lookup = 0.4ms with dual-fee revenue model and CLI.",
      url: "https://github.com/anayy09/License-Plate-Management-System",
      homepage: "",
      language: "Java",
      topics: ["data-structures", "algorithms"],
      isManual: true,
      imageUrl: "/projects/custom-3.png"
    },
    {
      id: "custom-4",
      name: "Local News Analytics",
      description: "End-to-end NLP pipeline (spaCy, BERTopic, BART) clustering ≥2k Seattle news items per day and flagging emergent events with F1 0.83. Flask + APScheduler dashboard with 6-hourly updates.",
      url: "https://github.com/anayy09/Local-News-Analytics",
      homepage: "",
      language: "Python",
      topics: ["nlp", "spacy", "bert"],
      isManual: true,
      imageUrl: "/projects/custom-4.png"
    },
    {
      id: "custom-5",
      name: "CampusCupid",
      description: "Led 4-dev team building full-stack dating platform with Go/Gin backend, PostgreSQL, React frontend. Secure JWT auth, swipe-matching, Cloudinary image storage. CI/CD on Render with Cypress E2E testing.",
      url: "https://github.com/anayy09/CampusCupid",
      homepage: "",
      language: "JavaScript",
      topics: ["react", "go"],
      isManual: true,
      imageUrl: "/projects/custom-5.png"
    },
    {
      id: "custom-6",
      name: "FinMate - Finance Manager",
      description: "Integrated Plaid API and ML (Random Forest prediction, Isolation Forest anomaly detection) in Django backend. React + Chakra UI dashboard with D3/Plotly visualizations and personalized budget alerts.",
      url: "https://github.com/anayy09/Finmate",
      homepage: "",
      language: "Python",
      topics: ["django", "ml", "plaid"],
      isManual: true,
      imageUrl: "/projects/custom-6.png"
    },
    {
      id: "custom-7",
      name: "Cosmic Portfolio",
      description: "Stunning, interactive personal portfolio website built with React, Three.js, and modern web technologies. Features immersive 3D cosmic background, GitHub/Hashnode API integration, interactive world map, and responsive design with smooth animations.",
      url: "https://github.com/anayy09/Cosmic-Portfolio",
      homepage: "https://anaysinhal.vercel.app/",
      language: "JavaScript",
      topics: ["threejs", "framer-motion"],
      isManual: true,
      imageUrl: "/projects/custom-7.png"
    },
    {
      id: "custom-8",
      name: "AuroraPDF - PDF Toolkit",
      description: "Comprehensive PDF manipulation tool built with React, TypeScript, and Bulma CSS. Features merge, split, compress, PDF-to-Word conversion, rotation, drag-and-drop interface, dark mode, and responsive design with real-time processing feedback.",
      url: "https://github.com/anayy09/PDF-Studio",
      homepage: "https://pdf-studio.vercel.app/",
      language: "TypeScript",
      topics: ["pdf-lib", "bulma"],
      isManual: true,
      imageUrl: "/projects/custom-8.png"
    },
    {
      id: "custom-9",
      name: "UniFlow - Campus App",
      description: "Comprehensive React Native app for university life management. Features schedule management, task tracking with priority levels, Pomodoro timer with subject tracking, progress analytics, dark/light theme, and modern UI with smooth animations.",
      url: "https://github.com/anayy09/UniFlow",
      homepage: "",
      language: "TypeScript",
      topics: ["react-native", "expo"],
      isManual: true,
      imageUrl: "/projects/custom-9.png"
    },

  ],

  publications: [
    {
      id: "pub-1",
      title: "Battery-Aware Super-Peer and Fountain Coding in Java P2P Systems",
      authors: [""],
      journal: "Discover Internet of Things, Springer Nature",
      year: "Nov 2025",
      description: "Enhances BitTorrent with battery-aware super-peer selection and fountain coding for improved resilience in disaster scenarios.",
      status: "Published",
      url: "https://doi.org/10.1007/s43926-025-00240-3"
    },
    {
      id: "pub-2",
      title: "Optimizing Diagnostic Accuracy in Healthcare by Using Deep Learning",
      authors: [""],
      journal: "2025 IEEE 4th World Conference on Applied Intelligence and Computing (AIC)",
      year: "Nov 2025",
      description: "Presents an AI-powered system integrating deep learning and NLP for enhanced disease detection and medical report analysis.",
      status: "Published",
      url: "https://doi.org/10.1109/AIC66080.2025.11211920"
    },
    {
      id: "pub-3",
      title: "LoRA-Tuned Segment Anything Model for Few-Shot Polyp Segmentation in Colonoscopy Images",
      authors: [""],
      journal: "Journal of Carcinogenesis",
      year: "Sep 2025",
      description: "Explores adapting SAM for polyp segmentation with minimal labeled samples, achieving high accuracy with few-shot learning.",
      status: "Published",
      url: "https://doi.org/10.64149/J.Carcinog.24.3.372-386"
    },
    {
      id: "pub-4",
      title: "Stress Monitoring in Healthcare: An Ensemble Machine Learning Framework Using Wearable Sensor Data",
      authors: [""],
      journal: "Fifth International Conference on Innovations in Computational Intelligence and Computer Vision (Springer)",
      year: "2025",
      description: "Introduces a multimodal dataset and ensemble ML framework for stress monitoring, improving predictive accuracy and class balance.",
      status: "Accepted",
      url: ""
    },
    {
      id: "pub-5",
      title: "Contrastive Learning and Large Language Models for Depression Detection from Social Media",
      authors: [""],
      journal: "2025 IEEE International Conference on Contemporary Computing and Communications",
      year: "2025",
      description: "Explores using contrastive learning with LLMs for depression detection on social media, demonstrating improved precision, recall, and F1-scores.",
      status: "Accepted",
      url: ""
    }
  ],

  patents: [
    {
      id: "patent-1",
      title: "A Method for Disaster-Resilient Digital File Dissemination via Fountain-Coded Broadcast with Super-Peer Election and Sparse Acknowledgement",
      applicationNo: "202511063465",
      country: "India",
      date: "Jul 2025",
      status: "Published"
    },
    {
      id: "patent-2",
      title: "A Stress Monitoring System Using Wearable Sensor Data Integrated with an Ensemble Machine-Learning Model",
      applicationNo: "202511044124",
      country: "India",
      date: "May 2025",
      status: "Published"
    }
  ],

  // Coordinates are [longitude, latitude]
  visitedPlaces: [
    {
      id: "place-1",
      name: "Jaipur, India", // Your current location
      coordinates: [75.7873, 26.9124],
      story: "Home base",
      significance: "Current Location"
    },
    {
      id: "place-2",
      name: "Bhopal, India",
      coordinates: [77.401989, 23.2584857],
      story: "Birthplace",
    },
    {
      id: "place-4",
      name: "Udaipur, India",
      coordinates: [73.6862571, 24.578721],
      significance: "City of Lakes",
    },
    {
      id: "place-5",
      name: "New Delhi, India",
      coordinates: [77.2090057, 28.6138954],
      story: "Internship at IIIT Delhi",
    },
    {
      id: "place-6",
      name: "Pune, India",
      coordinates: [73.8544541, 18.521428],
      story: "Internship at Dexpert Systems",
    },
    {
      id: "place-7",
      name: "Ahmedabad, India",
      coordinates: [72.5797068, 23.0216238],
      story: "Visited during exchange program at IIT Gandhinagar",
    },
    {
      id: "place-8",
      name: "Surat, India",
      coordinates: [72.8317058, 21.2094892],
      story: "Internship at SVNIT",
    },
    {
      id: "place-9",
      name: "Daman, India",
      coordinates: [72.833173, 20.4169701],
      story: "Family vacation",
    },
    {
      id: "place-10",
      name: "Mumbai, India",
      coordinates: [72.8692035, 19.054999],
      story: "Visited during internship at Dexpert Systems",
    },
    {
      id: "place-11",
      name: "Lonavala, India",
      coordinates: [73.4016729, 18.7548563],
      story: "Visited during internship at Dexpert Systems",
    },
    {
      id: "place-12",
      name: "Panaji, India",
      coordinates: [73.8282141, 15.4989946],
      story: "Family vacation",
    },
    {
      id: "place-14",
      name: "Munnar, India",
      coordinates: [77.0600915, 10.0869959],
      story: "Family vacation",
    },
    {
      id: "place-19",
      name: "Indore, India",
      coordinates: [75.8681996, 22.7203616],
      significance: "Relative's place",
    },
    {
      id: "place-22",
      name: "Gangtok, India",
      coordinates: [88.6122673, 27.329046],
      story: "Family vacation",
    },
    {
      id: "place-23",
      name: "Darjeeling, India",
      coordinates: [88.263176, 27.0377554],
      story: "Family vacation",
    },
    {
      id: "place-24",
      name: "Varanasi, India",
      coordinates: [83.0076292, 25.3356491],
      story: "Visited during semester exchange at IIT Kanpur",
    },
    {
      id: "place-25",
      name: "Ayodhya, India",
      coordinates: [82.2052321, 26.7990707],
      story: "Visited during semester exchange at IIT Kanpur",
    },
    {
      id: "place-26",
      name: "Kanpur, India",
      coordinates: [80.3217588, 26.4609135],
      story: "Semester exchange at IIT Kanpur",
    },
    {
      id: "place-29",
      name: "Noida, India",
      coordinates: [77.3271074, 28.5707841],
      story: "Internship at GeeksforGeeks",
    },
    {
      id: "place-31",
      name: "Chandigarh, India",
      coordinates: [76.7797143, 30.7334421],
      story: "School trip",
    },
    {
      id: "place-32",
      name: "Amritsar, India",
      coordinates: [74.8736788, 31.6343083],
      story: "School trip",
    },
    {
      id: "place-33",
      name: "Jammu, India",
      coordinates: [74.8580917, 32.7185614],
      story: "Internship at IIT Jammu",
    },
    {
      id: "place-34",
      name: "Srinagar, India",
      coordinates: [74.8204443, 34.0747444],
      story: "Family vacation",
    },
    {
      id: "place-37",
      name: "Shimla, India",
      coordinates: [77.1709729, 31.1041526],
      story: "Family vacation",
    },
    {
      id: "place-38",
      name: "Manali, India",
      coordinates: [77.1872926, 32.2454608],
      story: "College trip",
    },
    {
      id: "place-39",
      name: "Dalhousie, India",
      coordinates: [75.9797487, 32.5360472],
      story: "School trip",
    },
    {
      id: "place-41",
      name: "Rishikesh, India",
      coordinates: [78.2916193, 30.1086537],
      story: "College trip",
    },
    {
      id: "place-42",
      name: "Nainital, India",
      coordinates: [79.455569, 29.3917821],
      story: "Family vacation",
    },
    {
      id: "place-45",
      name: "Kuala Lumpur, Malaysia",
      coordinates: [101.6942371, 3.1516964],
      story: "Family vacation",
    },
    {
      id: "place-49",
      name: "Orlando, USA",
      coordinates: [-81.3790304, 28.5421109],
      story: "Visited during travel",
    },
    {
      id: "place-50",
      name: "Gainesville, USA",
      coordinates: [-82.3249846, 29.6519684],
      story: "University of Florida",
    },
    {
      id: "place-55",
      name: "Atlanta, USA",
      coordinates: [-84.3902644, 33.7489924],
      story: "Visited during travel",
    }
  ],

  // Certifications
  // certifications: [
  //   {
  //     id: "cert-1",
  //     name: "Advanced Deep Learning Specialization",
  //     issuingOrganization: "Cosmic University Online",
  //     logoUrl: "https://media.licdn.com/dms/image/C560BAQEEUHxMAR-Q6w/company-logo_200_200/company-logo_200_200/0/1671048448447/uflorida_logo?e=1748476800&v=beta&t=MZi8yCl8FDB46p1bAGYTBLbsKFiUEQFYtZ7Ascyjabo", // Replace with actual or placeholder
  //     date: "Dec 2023",
  //     credentialUrl: "https://example.com/link-to-credential-1",
  //     description: "Completed a rigorous program covering advanced neural network architectures and their applications in astrophysical data analysis."
  //   },
  //   {
  //     id: "cert-2",
  //     name: "Quantum Computing Fundamentals",
  //     issuingOrganization: "Institute of Galactic Tech",
  //     logoUrl: "https://media.licdn.com/dms/image/v2/C510BAQEhNteRFbyBdQ/company-logo_200_200/company-logo_200_200/0/1630585318049/indian_institute_of_technology_kanpur_logo?e=1748476800&v=beta&t=AO9ywbtnqOHJ4SWxW__d_c_NWKe76ySDE1zHx8zs2U0", // Replace with actual or placeholder
  //     date: "Jun 2024",
  //     credentialUrl: "https://example.com/link-to-credential-2",
  //     description: "Gained foundational knowledge in quantum algorithms and their potential to revolutionize computational science."
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