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
      detailedDescription: "A high-performance workspace designed for modern agile teams. This tool integrates WebSocket-based synchronized Kanban boards, custom project templates, drag-and-drop mechanics, and live member presence indicators. Behind the scenes, it utilizes advanced MongoDB aggregation pipelines to compile real-time sprint statistics.",
      features: [
        "Real-time synchronization via Socket.io",
        "Interactive Kanban Board with fluid drag & drop",
        "Detailed burndown charts & team sprint analytics",
        "Multi-tenant user authentication and RBAC"
      ],
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
      category: "Fullstack",
      image: "project1.jpg", // Fallback to dynamic placeholder in CSS/JS if not found
      demoUrl: "https://example.com/demo1",
      githubUrl: "https://github.com/example/project1"
    },
    {
      title: "Fintech Expense Tracker",
      description: "A secure and intuitive personal finance visualizer with dynamic monthly reports, category breakdown, and PDF export.",
      detailedDescription: "An offline-first personal financial manager built with vanilla web APIs. Users can categorize expenditures, establish monthly budgets, and visualize trends over time using interactive Chart.js graphs. Data is encrypted locally and can be exported as structured spreadsheets or PDFs.",
      features: [
        "Dynamic budget alerts & category spending limits",
        "Interactive SVG/Canvas data visual charts",
        "Encrypted local browser database storage",
        "Automated PDF and Excel receipt generation"
      ],
      tags: ["JavaScript", "Chart.js", "CSS3", "LocalStorage"],
      category: "Frontend",
      image: "project2.jpg",
      demoUrl: "https://example.com/demo2",
      githubUrl: "https://github.com/example/project2"
    },
    {
      title: "AI Semantic Search Engine",
      description: "A Python-based query microservice implementing natural language embedding similarity search for large-scale documentation.",
      detailedDescription: "A lightning-fast semantic search microservice that understands natural query intents. By generating high-dimensional vectors of markdown documents via OpenAI embeddings and storing them in Qdrant, it returns contextual matching snippets instead of exact keyword hits. The API is documented fully with OpenAPI / Swagger.",
      features: [
        "Natural language query intent interpretation",
        "Under-50ms vector query execution times",
        "Automated PDF/Markdown parser & embedding pipeline",
        "Interactive developer API sandbox documentation"
      ],
      tags: ["Python", "FastAPI", "VectorDB", "OpenAI"],
      category: "Backend",
      image: "project3.jpg",
      demoUrl: "https://example.com/demo3",
      githubUrl: "https://github.com/example/project3"
    },
    {
      title: "Glassmorphic Design UI Kit",
      description: "A premium responsive CSS library with utility-focused components utilizing modern glassmorphism patterns, filters, and shadows.",
      detailedDescription: "A beautiful, customizable design system engineered for micro-interactions and dark-mode aesthetics. By utilizing advanced CSS backdrop-filters, custom properties, and variable fonts, it provides components that adapt dynamically to any base color. It includes responsive grids, cards, menus, and form inputs.",
      features: [
        "High-fidelity backdrop filters & translucent aesthetics",
        "Fully themeable using CSS custom variables",
        "Zero-dependency layout widgets & responsive utilities",
        "Micro-interactive card hover states and loaders"
      ],
      tags: ["HTML5", "CSS3", "Sass", "Responsive"],
      category: "Frontend",
      image: "project4.jpg",
      demoUrl: "https://example.com/demo4",
      githubUrl: "https://github.com/example/project4"
    },
    {
      title: "Distributed Task Scheduler",
      description: "A highly resilient Go-based task scheduler with visual cluster node monitoring and real-time task log streaming.",
      detailedDescription: "A fault-tolerant distributed cron and task scheduler designed to manage high-throughput queues. It utilizes Raft consensus for state replication and streams execution logs dynamically via SSE (Server-Sent Events) to a dashboard built with responsive grid views.",
      features: [
        "Distributed consensus replication via Raft",
        "Dynamic task queues with visual node clustering",
        "Server-Sent Events (SSE) log streaming",
        "High availability clustering with automatic failover"
      ],
      tags: ["Go", "Raft", "SSE", "Docker"],
      category: "Backend",
      image: "project5.jpg",
      demoUrl: "https://example.com/demo5",
      githubUrl: "https://github.com/example/project5"
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
  ],
  testimonials: [
    {
      name: "Sarah Jenkins",
      role: "Product Manager",
      company: "Innovate Tech Labs",
      quote: "Dipesh is an incredibly detail-oriented engineer. He stepped in and accelerated our frontend refactoring, producing pixel-perfect pages that immediately boosted our site conversion. Highly recommended!",
      avatarLetter: "S"
    },
    {
      name: "Marcus Thorne",
      role: "Lead Designer",
      company: "WebCraft Solutions",
      quote: "Working with Dipesh was a fantastic experience. He has a rare ability to understand design systems deeply, translating complex Figma variables into clean, responsive CSS rules without any friction.",
      avatarLetter: "M"
    },
    {
      name: "Elena Rostova",
      role: "CTO",
      company: "Apex Ledger",
      quote: "Dipesh delivered our interactive kanban module on time and with zero bugs. His code structure is clean, easy to read, and his initiative to create detailed micro-interactions made the user interface shine.",
      avatarLetter: "E"
    }
  ]
};

// Export to make it accessible to script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = portfolioData;
}
