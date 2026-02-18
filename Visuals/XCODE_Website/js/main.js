/* ═══════════════════════════════════════════════════════════════════════════
   XÇØDË Main JavaScript
   Interactive elements, form handling, animations, and utilities
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  initMobileNav();
  initFormValidation();
  initSmoothScroll();
  initScrollAnimations();
  initProjectFilter(); // Add project filtering
});

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════ */

function initMobileNav() {
  // Check if we're on a mobile device
  const header = document.querySelector('header');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!header || !navMenu) return;

  // Add mobile toggle button if screen is narrow
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      // Mobile view
      if (!document.querySelector('.mobile-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-toggle';
        toggleBtn.textContent = '☰';
        toggleBtn.setAttribute('aria-label', 'Toggle navigation');
        
        const nav = document.querySelector('nav');
        nav.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', () => {
          navMenu.classList.toggle('active');
          toggleBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
      }
    } else {
      // Desktop view
      const toggleBtn = document.querySelector('.mobile-toggle');
      if (toggleBtn) {
        toggleBtn.remove();
      }
      navMenu.classList.remove('active');
    }
  };

  window.addEventListener('resize', handleResize);
  handleResize(); // Call once on load

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const toggleBtn = document.querySelector('.mobile-toggle');
      if (toggleBtn) {
        toggleBtn.textContent = '☰';
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM VALIDATION & SUBMISSION
   ═══════════════════════════════════════════════════════════════════════════ */

function initFormValidation() {
  const form = document.getElementById('joinForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate form
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ff6b6b';
        field.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
      } else {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      }
    });

    if (!isValid) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Email validation
    const email = form.querySelector('#email');
    if (!isValidEmail(email.value)) {
      isValid = false;
      email.style.borderColor = '#ff6b6b';
      email.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // URL validation
    const portfolio = form.querySelector('#portfolio');
    if (portfolio.value && !isValidURL(portfolio.value)) {
      isValid = false;
      portfolio.style.borderColor = '#ff6b6b';
      portfolio.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
      showNotification('Please enter a valid URL for your portfolio', 'error');
      return;
    }

    if (!isValid) return;

    // Collect form data
    const formData = new FormData(form);
    const data = {
      timestamp: new Date().toISOString(),
      ...Object.fromEntries(formData)
    };

    // Log form submission (in production, send to backend)
    console.log('Form submitted:', data);

    // Show success message
    showNotification('✓ Application submitted successfully! We\'ll review it within 2-3 weeks.', 'success');
    
    // Reset form
    form.reset();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      padding: 20px 40px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 1rem;
      z-index: 9999;
      animation: slideDown 0.4s ease-out;
      max-width: 500px;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    .notification-success {
      background: linear-gradient(135deg, #00c853 0%, #00a840 100%);
      color: white;
      box-shadow: 0 10px 40px rgba(0, 200, 83, 0.3);
    }

    .notification-error {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
      color: white;
      box-shadow: 0 10px 40px rgba(255, 107, 107, 0.3);
    }

    .notification-info {
      background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
      color: white;
      box-shadow: 0 0 30px rgba(0, 102, 255, 0.3);
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideDown 0.4s ease-out reverse';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SMOOTH SCROLLING
   ═══════════════════════════════════════════════════════════════════════════ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS (Fade-in on scroll)
   ═══════════════════════════════════════════════════════════════════════════ */

function initScrollAnimations() {
  // Add animation class to elements that should fade in on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all service cards, team cards, requirement items, and FAQ items
  document.querySelectorAll(
    '.service-card, .team-card, .requirement-item, .faq-item, .step-card'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT FILTERING (Productions Page)
   ═══════════════════════════════════════════════════════════════════════════ */

function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length === 0 || projectCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          // Trigger animation
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease-out';
          }, 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add active class to current nav link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href.endsWith(currentPage)) {
      link.style.color = 'var(--accent-blue)';
    }
  });
}

// Initialize active nav link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

/* ═══════════════════════════════════════════════════════════════════════════
   ADVANCED: Parallax scrolling effect (optional, commented out by default)
   ═══════════════════════════════════════════════════════════════════════════ */

/*
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(el => {
      const scrollPosition = window.pageYOffset;
      const speed = el.getAttribute('data-parallax') || 0.5;
      el.style.transform = `translateY(${scrollPosition * speed}px)`;
    });
  });
}

initParallax();
*/

/* ═══════════════════════════════════════════════════════════════════════════
   LOCAL STORAGE: Save form progress
   ═══════════════════════════════════════════════════════════════════════════ */

function initFormAutoSave() {
  const form = document.getElementById('joinForm');
  if (!form) return;

  // Load saved data
  form.querySelectorAll('input, textarea').forEach(field => {
    const savedValue = localStorage.getItem(`form_${field.id}`);
    if (savedValue) {
      field.value = savedValue;
    }

    // Save data on input
    field.addEventListener('input', () => {
      localStorage.setItem(`form_${field.id}`, field.value);
    });
  });

  // Clear saved data on successful submission
  form.addEventListener('submit', () => {
    form.querySelectorAll('input, textarea').forEach(field => {
      localStorage.removeItem(`form_${field.id}`);
    });
  });
}

document.addEventListener('DOMContentLoaded', initFormAutoSave);
