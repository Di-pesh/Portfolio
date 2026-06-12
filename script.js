// Immediately apply saved theme hue to prevent layout color flash
(function() {
  const savedHue = localStorage.getItem('selected-hue');
  if (savedHue) {
    document.documentElement.style.setProperty('--hue', savedHue);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC CONTENT INJECTION
  initPortfolioContent();
  initTestimonials();

  // 2. INTERACTIVE UI HANDLERS
  initNavigation();
  initThemeToggle();
  initScrollEffects();
  initTypingEffect();
  initProjectFiltering();
  initContactForm();
  initProjectModals();
  initScrollReveal();
  initSecretDashboard();
  initSkillHighlighting();
  initColorCustomizer();
});

/* ==================== DYNAMIC CONTENT INJECTION ==================== */
function initPortfolioContent() {
  if (typeof portfolioData === 'undefined') {
    console.error('portfolioData is not defined. Make sure data.js is loaded first.');
    return;
  }

  const { personal, skills, projects, experience, education } = portfolioData;

  // Personal Info
  document.title = `${personal.name} | Portfolio`;
  document.getElementById('home-title-name').textContent = personal.name;
  document.getElementById('nav-logo').innerHTML = `${personal.name.charAt(0)}<span>.</span>`;
  document.querySelector('.footer-logo').innerHTML = `${personal.name.charAt(0)}<span>.</span>`;
  document.getElementById('avatar-letter').textContent = personal.name.charAt(0);
  document.getElementById('home-desc').textContent = personal.subBio;
  document.getElementById('about-bio-detail').textContent = personal.bio;
  document.getElementById('about-sub-bio-detail').textContent = personal.subBio;
  document.getElementById('about-location').textContent = personal.location;
  document.getElementById('about-email').textContent = personal.email;
  document.getElementById('contact-card-email').textContent = personal.email;
  document.getElementById('contact-link-email').href = `mailto:${personal.email}`;
  document.getElementById('contact-card-location').textContent = personal.location;
  
  if (personal.resumeUrl) {
    document.getElementById('btn-resume').href = personal.resumeUrl;
  }

  // Profile Avatar Image handling
  if (personal.profileImage) {
    const avatarEl = document.getElementById('profile-avatar');
    avatarEl.innerHTML = `<img src="${personal.profileImage}" alt="${personal.name}" class="profile-img">`;
  }

  // Social Links
  const socialsContainer = document.getElementById('home-socials-container');
  const footerSocialsContainer = document.getElementById('footer-socials-container');
  socialsContainer.innerHTML = '';
  footerSocialsContainer.innerHTML = '';

  const socialIcons = {
    github: 'fa-brands fa-github',
    linkedin: 'fa-brands fa-linkedin-in',
    twitter: 'fa-brands fa-x-twitter',
    facebook: 'fa-brands fa-facebook-f',
    instagram: 'fa-brands fa-instagram',
    youtube: 'fa-brands fa-youtube',
    email: 'fa-solid fa-envelope'
  };

  Object.entries(personal.socials).forEach(([key, url]) => {
    if (!url || url === '#') return;
    
    const iconClass = socialIcons[key.toLowerCase()] || 'fa-solid fa-link';
    const cleanKey = key.charAt(0).toUpperCase() + key.slice(1);

    // Hero Socials
    const heroLink = document.createElement('a');
    heroLink.href = url;
    heroLink.target = '_blank';
    heroLink.className = 'home-social-link';
    heroLink.ariaLabel = cleanKey;
    heroLink.innerHTML = `<i class="${iconClass}"></i>`;
    socialsContainer.appendChild(heroLink);

    // Footer Socials
    const footerLink = document.createElement('a');
    footerLink.href = url;
    footerLink.target = '_blank';
    footerLink.className = 'footer-social-link';
    footerLink.ariaLabel = cleanKey;
    footerLink.innerHTML = `<i class="${iconClass}"></i>`;
    footerSocialsContainer.appendChild(footerLink);

    // Special bindings for contact cards
    if (key.toLowerCase() === 'linkedin') {
      document.getElementById('contact-link-linkedin').href = url;
    }
  });

  // Skills
  const skillsContainer = document.getElementById('skills-container-el');
  skillsContainer.innerHTML = '';

  const categoryIcons = {
    'Frontend': 'fa-solid fa-code',
    'Backend & DB': 'fa-solid fa-server',
    'Backend': 'fa-solid fa-server',
    'Database': 'fa-solid fa-database',
    'Tools & DevOps': 'fa-solid fa-screwdriver-wrench',
    'Design': 'fa-solid fa-compass-drafting'
  };

  skills.forEach(skillGroup => {
    const iconClass = categoryIcons[skillGroup.category] || 'fa-solid fa-layer-group';
    const card = document.createElement('div');
    card.className = 'skills-category-card';
    
    let itemsHtml = '';
    skillGroup.items.forEach(skill => {
      itemsHtml += `
        <div class="skill-data">
          <div class="skill-names">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-bar-percentage">${skill.level}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-percentage" data-level="${skill.level}"></div>
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <h3 class="skills-category-title">
        <i class="${iconClass}"></i> ${skillGroup.category}
      </h3>
      <div class="skills-list">
        ${itemsHtml}
      </div>
    `;
    skillsContainer.appendChild(card);
  });

  // Populate Skills on scroll (progressive reveal)
  const skillBars = document.querySelectorAll('.skill-percentage');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.getAttribute('data-level');
        bar.style.width = `${level}%`;
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });
  
  skillBars.forEach(bar => skillObserver.observe(bar));

  // Projects Grid & Filters
  const projectsGrid = document.getElementById('projects-grid');
  const filtersContainer = document.getElementById('projects-filters');
  projectsGrid.innerHTML = '';

  // Get unique categories for projects to build tabs
  const categories = ['all', ...new Set(projects.map(p => p.category.toLowerCase()))];
  
  // Re-build category filters
  filtersContainer.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat === 'all' ? 'active-filter' : ''}`;
    btn.setAttribute('data-filter', cat);
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    filtersContainer.appendChild(btn);
  });

  const projectCategoryIcons = {
    frontend: 'fa-solid fa-laptop-code',
    backend: 'fa-solid fa-server',
    fullstack: 'fa-solid fa-layer-group',
    mobile: 'fa-solid fa-mobile-screen-button',
    design: 'fa-solid fa-palette'
  };

  projects.forEach((proj, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', proj.category.toLowerCase());
    card.setAttribute('data-index', index);
    
    // Category icons & dynamic colors
    const categoryIcon = projectCategoryIcons[proj.category.toLowerCase()] || 'fa-solid fa-gears';

    card.innerHTML = `
      <div class="project-img-container">
        <!-- Overlay links -->
        <div class="project-img-overlay">
          <a href="${proj.githubUrl}" target="_blank" class="project-overlay-link" aria-label="GitHub Source">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="${proj.demoUrl}" target="_blank" class="project-overlay-link" aria-label="Live Demo">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
        <!-- Decorative abstract graphic fallback -->
        <div class="project-placeholder-visual">
          <i class="${categoryIcon}"></i>
          <span>${proj.category}</span>
        </div>
      </div>
      <div class="project-info">
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.description}</p>
        <div class="project-tags">
          ${proj.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  // Experience Timeline
  const expTimeline = document.getElementById('experience-timeline');
  expTimeline.innerHTML = '';
  
  experience.forEach(item => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    const descList = item.description.map(desc => `<li>${desc}</li>`).join('');

    timelineItem.innerHTML = `
      <div class="timeline-header">
        <h4 class="timeline-role">${item.role}</h4>
        <span class="timeline-org">${item.company}</span>
        <div><span class="timeline-period">${item.period}</span></div>
      </div>
      <div class="timeline-desc">
        <ul>${descList}</ul>
      </div>
    `;
    expTimeline.appendChild(timelineItem);
  });

  // Education Timeline
  const eduTimeline = document.getElementById('education-timeline');
  eduTimeline.innerHTML = '';
  
  education.forEach(item => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';

    timelineItem.innerHTML = `
      <div class="timeline-header">
        <h4 class="timeline-role">${item.degree}</h4>
        <span class="timeline-org">${item.institution}</span>
        <div><span class="timeline-period">${item.period}</span></div>
      </div>
      <div class="timeline-desc">
        <p>${item.description}</p>
      </div>
    `;
    eduTimeline.appendChild(timelineItem);
  });

  // Footer year update
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

/* ==================== INTERACTIVE UI NAVIGATION ==================== */
function initNavigation() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');

  // Open Menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  // Close Menu
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  // Auto-close Menu when menu items are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  });
}

/* ==================== THEME TOGGLE (DARK/LIGHT) ==================== */
function initThemeToggle() {
  const themeButton = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const darkTheme = 'dark-theme';
  const lightTheme = 'light-theme';
  const iconTheme = 'fa-sun'; // sun icon for light mode

  // Retrieve saved preference
  const selectedTheme = localStorage.getItem('selected-theme');
  
  // Set default state based on preference
  if (selectedTheme === 'light') {
    document.body.classList.remove(darkTheme);
    document.body.classList.add(lightTheme);
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.body.classList.add(darkTheme);
    document.body.classList.remove(lightTheme);
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }

  // Toggle button event
  themeButton.addEventListener('click', () => {
    if (document.body.classList.contains(lightTheme)) {
      document.body.classList.replace(lightTheme, darkTheme);
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('selected-theme', 'dark');
    } else {
      document.body.classList.replace(darkTheme, lightTheme);
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('selected-theme', 'light');
    }
  });
}

/* ==================== SCROLL EFFECTS & NAVBAR STICKY ==================== */
function initScrollEffects() {
  const header = document.getElementById('header');
  const scrollUp = document.getElementById('scroll-up');
  const progressBar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Page Scroll Progress Bar Width
    if (docHeight > 0) {
      const scrolled = (scrollY / docHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    }

    // Sticky Header Border + Background blur
    if (scrollY >= 50) {
      header.classList.add('scroll-header');
    } else {
      header.classList.remove('scroll-header');
    }

    // Back to top button visibility
    if (scrollY >= 560) {
      scrollUp.classList.add('show-scroll');
    } else {
      scrollUp.classList.remove('show-scroll');
    }

    // Navigation Active Link Highlighting on Scroll
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active-link');
        } else {
          navLink.classList.remove('active-link');
        }
      }
    });
  });
}

/* ==================== HERO TYPING EFFECTS ==================== */
function initTypingEffect() {
  const typingTextSpan = document.getElementById('typing-text');
  
  if (!typingTextSpan || typeof portfolioData === 'undefined') return;
  
  const words = portfolioData.personal.titles;
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingTextSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      typingTextSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Regular typing speed
    }

    // Word finished typing
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at full word
    } 
    // Word fully deleted
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Brief pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  // Bootstrap typing cycle
  setTimeout(type, 1000);
}

/* ==================== PROJECTS FILTERING ==================== */
function initProjectFiltering() {
  const filtersContainer = document.getElementById('projects-filters');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filtersContainer) return;

  filtersContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;

    // Toggle active filter button style
    document.querySelector('.active-filter').classList.remove('active-filter');
    e.target.classList.add('active-filter');

    const filterValue = e.target.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');

      if (filterValue === 'all' || cardCategory === filterValue) {
        card.style.display = 'flex';
        // Add soft scale animation
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// Add simple fade keyframes programmatically to keep CSS cleaner
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95) translateY(5px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(style);

/* ==================== CONTACT FORM HANDLER ==================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-message-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capture input values for the secret logs
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    const newMessage = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      name,
      email,
      subject,
      message
    };

    // Save to local storage
    const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    messages.unshift(newMessage);
    localStorage.setItem('portfolio_contact_messages', JSON.stringify(messages));

    // Visual loading state
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

    // Simulate sending email message (2 seconds delay)
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Reset contact details inputs
      form.reset();

      // Show Success Banner
      statusEl.className = 'form-message-status success';
      statusEl.textContent = 'Thank you! Your message has been sent successfully.';
      
      // Auto-hide success banner after 5 seconds
      setTimeout(() => {
        statusEl.className = 'form-message-status';
        statusEl.textContent = '';
      }, 5000);

    }, 2000);
  });
}

/* ==================== INTERACTIVE PROJECT DETAILS MODAL ==================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('project-modal-close');
  const modalBody = document.getElementById('project-modal-body');
  
  if (!modal || !closeBtn || !modalBody) return;

  // Add event listener delegation to the projects grid
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      // Find the card element
      const card = e.target.closest('.project-card');
      if (!card) return;

      // If clicked on an external link in the overlay, don't open the modal
      if (e.target.closest('.project-overlay-link')) return;

      const index = card.getAttribute('data-index');
      if (index === null || typeof portfolioData === 'undefined') return;

      const project = portfolioData.projects[index];
      if (!project) return;

      openProjectModal(project);
    });
  }

  // Close modal click triggers
  closeBtn.addEventListener('click', () => {
    closeProjectModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show-modal')) {
      closeProjectModal();
    }
  });

  function openProjectModal(project) {
    // Icons based on category
    const projectCategoryIcons = {
      frontend: 'fa-solid fa-laptop-code',
      backend: 'fa-solid fa-server',
      fullstack: 'fa-solid fa-layer-group',
      mobile: 'fa-solid fa-mobile-screen-button',
      design: 'fa-solid fa-palette'
    };
    const categoryIcon = projectCategoryIcons[project.category.toLowerCase()] || 'fa-solid fa-gears';

    // Populate content
    const featuresListHtml = (project.features || [])
      .map(feat => `<li><i class="fa-solid fa-circle-check"></i> <span>${feat}</span></li>`)
      .join('');

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <span class="modal-project-category">${project.category}</span>
        <h2 class="modal-project-title">${project.title}</h2>
      </div>
      
      <div class="modal-project-img-placeholder">
        <i class="${categoryIcon}"></i>
      </div>
      
      <p class="modal-project-description">${project.detailedDescription || project.description}</p>
      
      ${featuresListHtml ? `
        <h3 class="modal-project-section-title">Key Features</h3>
        <ul class="modal-project-features-list">
          ${featuresListHtml}
        </ul>
      ` : ''}
      
      <h3 class="modal-project-section-title">Technologies</h3>
      <div class="modal-project-tags">
        ${project.tags.map(tag => `<span class="modal-project-tag">${tag}</span>`).join('')}
      </div>
      
      <div class="modal-project-buttons">
        <a href="${project.demoUrl}" target="_blank" class="btn btn-primary">
          Live Demo <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary">
          View Code <i class="fa-brands fa-github"></i>
        </a>
      </div>
    `;

    // Accessibility
    modal.classList.add('show-modal');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock scroll
  }

  function closeProjectModal() {
    modal.classList.remove('show-modal');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scroll
  }
}

/* ==================== SCROLL REVEAL ANIMATIONS ==================== */
function initScrollReveal() {
  const sections = document.querySelectorAll('section.section');
  
  // Add base reveal class to all sections
  sections.forEach(sec => {
    sec.classList.add('reveal-section');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-reveal');
        // Unobserve after revealing to prevent repeating animation
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // animate slightly before they fully enter the viewport
  });

  sections.forEach(sec => {
    revealObserver.observe(sec);
  });
}

/* ==================== SECRET MESSAGE CONTROL CONSOLE ==================== */
function initSecretDashboard() {
  const dashboard = document.getElementById('dashboard-modal');
  const closeBtn = document.getElementById('dashboard-modal-close');
  const tableBody = document.getElementById('dashboard-table-body');
  const msgCountEl = document.getElementById('dashboard-message-count');
  const clearAllBtn = document.getElementById('dashboard-clear-all');
  
  // Secret trigger: clicking the footer logo 5 times
  const footerLogo = document.querySelector('.footer-logo');
  let clickCount = 0;
  let clickTimer = null;

  if (footerLogo) {
    footerLogo.style.cursor = 'pointer';
    footerLogo.addEventListener('click', (e) => {
      e.preventDefault();
      clickCount++;

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 3000); // Reset count if 3s passes without clicks

      if (clickCount >= 5) {
        clickCount = 0;
        openDashboard();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeDashboard();
    });
  }

  if (dashboard) {
    dashboard.addEventListener('click', (e) => {
      if (e.target === dashboard) {
        closeDashboard();
      }
    });
  }

  // Keyboard shortcut: Ctrl + Shift + L
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      openDashboard();
    }
    if (e.key === 'Escape' && dashboard && dashboard.classList.contains('show-modal')) {
      closeDashboard();
    }
  });

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all message logs?')) {
        localStorage.removeItem('portfolio_contact_messages');
        renderMessages();
      }
    });
  }

  // CLI Command prompt input handler
  const cliInput = document.getElementById('dashboard-cli-input');
  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const commandText = cliInput.value.trim();
        cliInput.value = '';
        if (commandText) {
          executeCliCommand(commandText);
        }
      }
    });
  }

  function executeCliCommand(cmd) {
    const args = cmd.split(' ');
    const mainCmd = args[0].toLowerCase();

    switch (mainCmd) {
      case '/help':
        alert(`Available administrative terminal commands:\n\n` +
              `/help - Displays this help manual.\n` +
              `/stats - Compiles statistical summary of the database.\n` +
              `/mock - Generates 3 mock logs for testing UI layouts.\n` +
              `/export - Downloads contact messages log as a JSON file.\n` +
              `/purge - Destroys all stored logs permanently.`);
        break;
        
      case '/stats':
        const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        if (messages.length === 0) {
          alert('Database stats: No messages logged yet.');
          break;
        }
        
        const senders = [...new Set(messages.map(m => m.name))].length;
        const subjects = [...new Set(messages.map(m => m.subject))].length;
        alert(`--- SYSTEM CONTROL STATS ---\n\n` +
              `Total Messages: ${messages.length}\n` +
              `Unique Senders: ${senders}\n` +
              `Unique Subjects: ${subjects}`);
        break;

      case '/mock':
        const mockMsgs = [
          {
            id: 1,
            date: new Date().toLocaleString(),
            name: "John Doe",
            email: "john.doe@google.com",
            subject: "Job Offer / Hiring opportunities",
            message: "Hello Dipesh, we loved your interactive workspace portfolio. We would love to schedule a follow-up screening interview for a Full Stack Developer position next Tuesday."
          },
          {
            id: 2,
            date: new Date(Date.now() - 3600000).toLocaleString(),
            name: "Jane Smith",
            email: "jane@shopify.com",
            subject: "Freelance Project Inquiry",
            message: "Hi Dipesh! I need a high-fidelity glassmorphic landing page styled with clean vanilla CSS. Your portfolios styling is perfect. Let me know your rates."
          },
          {
            id: 3,
            date: new Date(Date.now() - 7200000).toLocaleString(),
            name: "David Miller",
            email: "d.miller@gmail.com",
            subject: "Feedback on open source kit",
            message: "Hey Dipesh, your glassmorphic design system kit was extremely helpful for my side project. Keep up the excellent work!"
          }
        ];
        
        const currentMsgs = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        localStorage.setItem('portfolio_contact_messages', JSON.stringify([...mockMsgs, ...currentMsgs]));
        renderMessages();
        alert('Mock seed data injected successfully.');
        break;

      case '/export':
        const msgsToExport = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        if (msgsToExport.length === 0) {
          alert('Database empty: No messages to export.');
          break;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(msgsToExport, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `portfolio_contact_messages_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        alert('Messages exported as JSON.');
        break;
        
      case '/purge':
        if (confirm('Verify: Purge all local contact logs?')) {
          localStorage.removeItem('portfolio_contact_messages');
          renderMessages();
          alert('Database purged.');
        }
        break;
        
      default:
        alert(`Error: Command "${mainCmd}" not recognized.\nType /help to see all available commands.`);
    }
  }

  function openDashboard() {
    renderMessages();
    if (dashboard) {
      dashboard.classList.add('show-modal');
      dashboard.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDashboard() {
    if (dashboard) {
      dashboard.classList.remove('show-modal');
      dashboard.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function renderMessages() {
    if (!tableBody) return;
    
    const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    msgCountEl.textContent = `Total Messages: ${messages.length}`;
    tableBody.innerHTML = '';

    if (messages.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="dashboard-empty-state">
              <i class="fa-solid fa-folder-open"></i>
              <p>No messages recorded yet. Submit the contact form to generate logs!</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    messages.forEach((msg) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="dashboard-date">${msg.date}</span></td>
        <td><span class="dashboard-sender-name">${escapeHtml(msg.name)}</span></td>
        <td><a href="mailto:${escapeHtml(msg.email)}" style="color: var(--first-color); text-decoration: underline;">${escapeHtml(msg.email)}</a></td>
        <td><strong>${escapeHtml(msg.subject)}</strong></td>
        <td><div class="dashboard-msg-text" title="${escapeHtml(msg.message)}">${escapeHtml(msg.message)}</div></td>
        <td>
          <button class="btn-delete-msg" data-id="${msg.id}" aria-label="Delete message">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Add delete listeners
    tableBody.querySelectorAll('.btn-delete-msg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.getAttribute('data-id'));
        deleteMessage(id);
      });
    });
  }

  function deleteMessage(id) {
    let messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    messages = messages.filter(msg => msg.id !== id);
    localStorage.setItem('portfolio_contact_messages', JSON.stringify(messages));
    renderMessages();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

/* ==================== SKILL TAG MATCH HIGH-LIGHTING ==================== */
function initSkillHighlighting() {
  const skillsContainer = document.getElementById('skills-container-el');
  if (!skillsContainer) return;

  skillsContainer.addEventListener('click', (e) => {
    const skillData = e.target.closest('.skill-data');
    if (!skillData) return;

    const skillName = skillData.querySelector('.skill-name').textContent;
    const projectCards = document.querySelectorAll('.project-card');
    
    // Toggle active state on the clicked skill
    const wasActive = skillData.classList.contains('active-skill');
    
    // Deactivate all other skills
    document.querySelectorAll('.skill-data').forEach(el => {
      el.classList.remove('active-skill');
    });

    if (!wasActive) {
      skillData.classList.add('active-skill');
      
      // Highlight matching projects
      projectCards.forEach(card => {
        const title = card.querySelector('.project-title').textContent;
        // Find project object from portfolioData
        if (typeof portfolioData === 'undefined') return;
        const project = portfolioData.projects.find(p => p.title === title);
        if (project && matchSkillWithProject(skillName, project.tags, project.category)) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1.03)';
          card.style.borderColor = 'var(--first-color)';
          card.style.boxShadow = '0 10px 25px hsla(var(--hue), 75%, 60%, 0.15)';
        } else {
          card.style.opacity = '0.25';
          card.style.transform = 'scale(0.97)';
          card.style.borderColor = 'var(--border-color)';
          card.style.boxShadow = 'none';
        }
      });
    } else {
      // Reset all project cards styling
      projectCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.borderColor = '';
        card.style.boxShadow = '';
      });
    }
  });

  function matchSkillWithProject(skillName, projectTags, projectCategory) {
    const normSkill = skillName.toLowerCase().trim();
    
    // Direct or substring match on category
    if (projectCategory.toLowerCase().includes(normSkill) || normSkill.includes(projectCategory.toLowerCase())) {
      return true;
    }
    
    // Substring match on tags
    return projectTags.some(tag => {
      const normTag = tag.toLowerCase().trim();
      return normSkill.includes(normTag) || normTag.includes(normSkill);
    });
  }
}

/* ==================== TESTIMONIALS SLIDER CAROUSEL ==================== */
function initTestimonials() {
  if (typeof portfolioData === 'undefined' || !portfolioData.testimonials) return;

  const carousel = document.getElementById('testimonials-carousel');
  const indicatorsContainer = document.getElementById('testimonials-indicators');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (!carousel || !indicatorsContainer) return;

  // 1. Render Cards & Indicators
  carousel.innerHTML = '';
  indicatorsContainer.innerHTML = '';

  portfolioData.testimonials.forEach((test, index) => {
    // Card HTML
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div class="testimonial-avatar">${test.avatarLetter}</div>
      <p class="testimonial-quote">"${test.quote}"</p>
      <div class="testimonial-author-info">
        <span class="testimonial-name">${test.name}</span>
        <span class="testimonial-role">${test.role} @ ${test.company}</span>
      </div>
    `;
    carousel.appendChild(card);

    // Indicator Dot HTML
    const dot = document.createElement('span');
    dot.className = `testimonial-dot ${index === 0 ? 'active-dot' : ''}`;
    dot.setAttribute('data-slide', index);
    indicatorsContainer.appendChild(dot);
  });

  // 2. Slider Navigation Logic
  let currentSlide = 0;
  const totalSlides = portfolioData.testimonials.length;
  let autoSlideInterval = null;

  function goToSlide(slideIndex) {
    if (slideIndex < 0) {
      slideIndex = totalSlides - 1;
    } else if (slideIndex >= totalSlides) {
      slideIndex = 0;
    }
    
    currentSlide = slideIndex;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot
    document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active-dot');
      } else {
        dot.classList.remove('active-dot');
      }
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000); // Swipe every 6 seconds
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  // Hook event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAutoSlide(); // Reset timer
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAutoSlide(); // Reset timer
    });
  }

  indicatorsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('testimonial-dot')) {
      const slideIndex = parseInt(e.target.getAttribute('data-slide'));
      goToSlide(slideIndex);
      startAutoSlide(); // Reset timer
    }
  });

  // Pause autoslide on mouse hover
  const wrapper = document.querySelector('.testimonials-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoSlide);
    wrapper.addEventListener('mouseleave', startAutoSlide);
  }

  // Bootstrap autoslide
  startAutoSlide();
}

/* ==================== INTERACTIVE COLOR CUSTOMIZER ==================== */
function initColorCustomizer() {
  const toggleBtn = document.getElementById('customizer-toggle');
  const closeBtn = document.getElementById('customizer-close');
  const panel = document.getElementById('customizer-panel');
  const overlay = document.getElementById('customizer-overlay');
  const colorBtns = document.querySelectorAll('.color-option-btn');
  const modeBtn = document.getElementById('customizer-mode-toggle');
  const resetBtn = document.getElementById('customizer-reset-btn');

  // Load and apply saved hue immediately
  const savedHue = localStorage.getItem('selected-hue');
  const defaultHue = '250';
  
  if (savedHue) {
    document.documentElement.style.setProperty('--hue', savedHue);
    // Set active class on correct button
    colorBtns.forEach(btn => {
      if (btn.getAttribute('data-hue') === savedHue) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  } else {
    // Set default active button (250)
    colorBtns.forEach(btn => {
      if (btn.getAttribute('data-hue') === defaultHue) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  if (!toggleBtn || !panel || !closeBtn || !overlay) return;

  // Toggle Panel Open/Close
  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('show-customizer');
    overlay.classList.toggle('show-overlay');
    panel.setAttribute('aria-hidden', panel.classList.contains('show-customizer') ? 'false' : 'true');
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('show-customizer');
    overlay.classList.remove('show-overlay');
    panel.setAttribute('aria-hidden', 'true');
  });

  overlay.addEventListener('click', () => {
    panel.classList.remove('show-customizer');
    overlay.classList.remove('show-overlay');
    panel.setAttribute('aria-hidden', 'true');
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('show-customizer')) {
      panel.classList.remove('show-customizer');
      overlay.classList.remove('show-overlay');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  // Color Selection Handlers
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hue = btn.getAttribute('data-hue');
      
      // Update CSS Variable
      document.documentElement.style.setProperty('--hue', hue);
      
      // Persist choice
      localStorage.setItem('selected-hue', hue);
      
      // Update UI active state
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Synchronize Mode Toggle with header toggle button
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const mainThemeToggle = document.getElementById('theme-toggle');
      if (mainThemeToggle) {
        mainThemeToggle.click();
      }
    });
  }

  // Reset to default
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Revert CSS custom variable to default
      document.documentElement.style.setProperty('--hue', defaultHue);
      
      // Remove from localStorage
      localStorage.removeItem('selected-hue');
      
      // Reset active button state
      colorBtns.forEach(btn => {
        if (btn.getAttribute('data-hue') === defaultHue) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      
      // Close the panel
      panel.classList.remove('show-customizer');
      overlay.classList.remove('show-overlay');
      panel.setAttribute('aria-hidden', 'true');
    });
  }
}
