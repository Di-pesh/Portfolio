const portfolioData = {
  personal: {
    name: "Dipesh",
    titles: ["Full Stack Developer", "Software Engineer", "UI/UX Enthusiast", "Problem Solver"],
    bio: "I am a passionate Full Stack Developer focused on building beautiful, highly functional, and user-centric digital experiences. With a strong foundation in modern web technologies, I love turning complex problems into elegant, clean code.",
    subBio: "Specializing in crafting premium frontends and scalable backend systems, I strive to design websites that feel intuitive and alive.",
    profileImage: "", // Will be rendered as a custom stylized avatar if empty
    resumeUrl: "#",
    email: "dipesh@example.com",
    location: "Kathmandu, Nepal",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "mailto:dipesh@example.com"
    }
  },
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "HTML5 & CSS3", level: 90 },
        { name: "JavaScript (ES6+)", level: 85 },
        { name: "React.js", level: 80 },
        { name: "Tailwind CSS", level: 85 }
      ]
    },
    {
      category: "Backend & DB",
      items: [
        { name: "Node.js & Express", level: 75 },
        { name: "Python / Django", level: 70 },
        { name: "SQL (PostgreSQL)", level: 80 },
        { name: "MongoDB", level: 75 }
      ]
    },
    {
      category: "Tools & DevOps",
      items: [
        { name: "Git & GitHub", level: 85 },
        { name: "Docker", level: 65 },
        { name: "RESTful APIs", level: 85 },
        { name: "Figma (UI Design)", level: 70 }
      ]
    }
  ],
  projects: [
    {
      title: "Interactive Workspace Pro",
      description: "A collaborative project management dashboard featuring real-time updates, kanban boards, and advanced team analytics.",
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
      category: "Fullstack",
      image: "project1.jpg", // Fallback to dynamic placeholder in CSS/JS if not found
      demoUrl: "https://example.com/demo1",
      githubUrl: "https://github.com/example/project1"
    },
    {
      title: "Fintech Expense Tracker",
      description: "A secure and intuitive personal finance visualizer with dynamic monthly reports, category breakdown, and PDF export.",
      tags: ["JavaScript", "Chart.js", "CSS3", "LocalStorage"],
      category: "Frontend",
      image: "project2.jpg",
      demoUrl: "https://example.com/demo2",
      githubUrl: "https://github.com/example/project2"
    },
    {
      title: "AI Semantic Search Engine",
      description: "A Python-based query microservice implementing natural language embedding similarity search for large-scale documentation.",
      tags: ["Python", "FastAPI", "VectorDB", "OpenAI"],
      category: "Backend",
      image: "project3.jpg",
      demoUrl: "https://example.com/demo3",
      githubUrl: "https://github.com/example/project3"
    },
    {
      title: "Glassmorphic Design UI Kit",
      description: "A premium responsive CSS library with utility-focused components utilizing modern glassmorphism patterns, filters, and shadows.",
      tags: ["HTML5", "CSS3", "Sass", "Responsive"],
      category: "Frontend",
      image: "project4.jpg",
      demoUrl: "https://example.com/demo4",
      githubUrl: "https://github.com/example/project4"
    }
  ],
  experience: [
    {
      role: "Associate Software Engineer",
      company: "Innovate Tech Labs",
      period: "2024 - Present",
      description: [
        "Developing scalable React applications and custom APIs used by over 50,000 active users.",
        "Refactoring legacy codebase to modern functional React, improving overall load speed by 35%.",
        "Collaborating with UI/UX designers to translate Figma design tokens into clean, responsive CSS patterns."
      ]
    },
    {
      role: "Frontend Developer Intern",
      company: "WebCraft Solutions",
      period: "2023 - 2024",
      description: [
        "Built customized, responsive landing pages for enterprise clients using HTML, CSS, and vanilla Javascript.",
        "Ensured accessibility compliance (WCAG 2.1 AA) across all components.",
        "Integrated dynamic REST APIs for user registration and custom dashboards."
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Tribhuvan University",
      period: "2020 - 2024",
      description: "Specialized in Software Engineering and Database Systems. Graduated with honors."
    }
  ]
};

// Export to make it accessible to script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = portfolioData;
}
