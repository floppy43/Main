/**
 * XÇØDË Project Showcase Loader
 * Dynamically loads uploaded projects from localStorage or JSON
 */

class ProjectShowcase {
  constructor() {
    this.projects = [];
    this.filterCategory = 'all';
  }

  /**
   * Initialize and load projects
   */
  async init() {
    await this.loadProjects();
    this.renderProjects();
    this.initializeFilters();
  }

  /**
   * Load projects from localStorage or JSON file
   */
  async loadProjects() {
    // First, try to load from localStorage (from uploads)
    const localProjects = localStorage.getItem('xcode_projects');
    
    if (localProjects) {
      this.projects = JSON.parse(localProjects);
    } else {
      // Fallback to projects.json if available
      try {
        const response = await fetch('projects.json');
        if (response.ok) {
          const data = await response.json();
          this.projects = data.projects;
        }
      } catch (error) {
        console.log('No projects file found, waiting for uploads');
      }
    }

    // Filter only active projects
    this.projects = this.projects.filter(p => p.status === 'active');
  }

  /**
   * Render all projects or filtered projects
   */
  renderProjects(category = 'all') {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    this.filterCategory = category;

    // Filter projects
    let filteredProjects = this.projects;
    if (category !== 'all') {
      filteredProjects = this.projects.filter(p => p.category === category);
    }

    // Show/hide placeholder
    const placeholder = container.querySelector('[data-placeholder]');
    if (filteredProjects.length === 0) {
      if (placeholder) {
        placeholder.style.display = 'grid';
      }
      return;
    } else if (placeholder) {
      placeholder.style.display = 'none';
    }

    // Clear existing project cards (keep placeholder)
    const existingCards = container.querySelectorAll('.project-card');
    existingCards.forEach(card => card.remove());

    // Render each project
    filteredProjects.forEach(project => {
      const card = this.createProjectCard(project);
      container.appendChild(card);
    });

    // Trigger animation
    requestAnimationFrame(() => {
      const cards = container.querySelectorAll('.project-card');
      cards.forEach(card => {
        card.style.animation = 'fadeInUp 0.6s ease-out';
      });
    });
  }

  /**
   * Create a project card element
   */
  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);

    const gradients = {
      web: 'linear-gradient(135deg, #0066ff 0%, #003d99 100%)',
      mobile: 'linear-gradient(135deg, #ff6600 0%, #ffaa00 100%)',
      platform: 'linear-gradient(135deg, #d4a574 0%, #e8c4a0 100%)',
      client: 'linear-gradient(135deg, #6600cc 0%, #9933ff 100%)',
      saas: 'linear-gradient(135deg, #00cc99 0%, #00ffbb 100%)',
      tool: 'linear-gradient(135deg, #0099ff 0%, #00ccff 100%)',
      library: 'linear-gradient(135deg, #ff3333 0%, #ff6666 100%)',
      other: 'linear-gradient(135deg, #0033ff 0%, #00ccff 100%)'
    };

    const gradient = gradients[project.category] || gradients.other;

    card.innerHTML = `
      <div class="project-image" style="background: ${gradient};">
        <span class="project-icon">${project.icon || '🚀'}</span>
      </div>
      <div class="project-info">
        <div class="project-category">${this.getCategoryLabel(project.category)}</div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">
          ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
        </div>
        <div class="project-actions">
          ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="project-link">View Demo →</a>` : ''}
          ${project.downloadUrl ? `<a href="${project.downloadUrl}" target="_blank" class="project-link">Download ${project.price > 0 ? '($' + project.price + ')' : '(Free)'} →</a>` : ''}
          ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link">GitHub →</a>` : ''}
        </div>
      </div>
    `;

    return card;
  }

  /**
   * Get readable category label
   */
  getCategoryLabel(category) {
    const labels = {
      web: 'Web Application',
      mobile: 'Mobile App',
      platform: 'Platform & Tools',
      client: 'Client Work',
      saas: 'SaaS Product',
      tool: 'Development Tool',
      library: 'Library/Framework',
      other: 'Project'
    };
    return labels[category] || 'Project';
  }

  /**
   * Initialize filter buttons
   */
  initializeFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = btn.getAttribute('data-filter');
        
        // Update active button
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Render filtered projects
        this.renderProjects(category);
      });
    });
  }

  /**
   * Get project by ID
   */
  getProject(id) {
    return this.projects.find(p => p.id === id);
  }

  /**
   * Get projects by category
   */
  getProjectsByCategory(category) {
    return this.projects.filter(p => p.category === category);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalProjects: this.projects.length,
      totalDownloads: this.projects.reduce((sum, p) => sum + (p.downloads || 0), 0),
      categories: [...new Set(this.projects.map(p => p.category))].length,
      totalTechnologies: [...new Set(this.projects.flatMap(p => p.technologies))].length
    };
  }

  /**
   * Update stats display if available
   */
  updateStats() {
    const stats = this.getStats();
    const statsContainer = document.querySelector('.stats-grid');
    
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-card">
          <div class="stat-number">${stats.totalProjects}+</div>
          <div class="stat-label">Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.totalDownloads}+</div>
          <div class="stat-label">Downloads</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.categories}</div>
          <div class="stat-label">Categories</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.totalTechnologies}+</div>
          <div class="stat-label">Technologies</div>
        </div>
      `;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  const showcase = new ProjectShowcase();
  await showcase.init();
  showcase.updateStats();
});
