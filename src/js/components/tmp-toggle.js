class FlexibleToggleHandler {
  constructor() {
    this.mobileBreakpoint = 768;
    this.toggleElements = [];
    this.isProcessing = false;
    this.processingTimeout = 300;
    this.init();
  }

  init() {
    document.body.addEventListener('click', (e) => {

      if (this.isProcessing) {
        e.preventDefault();
        return;
      }

      const toggleElement = e.target.closest('[data-tmp-toggle-element]');
      if (!toggleElement) return;
      
      const toggleContainer = toggleElement.closest('[data-tmp-toggle]');
      if (!toggleContainer) return;

      const name = toggleElement.getAttribute('data-name');
      const content = toggleContainer.querySelector(`[data-tmp-toggle-content][data-name="${name}"]`);
      if (!content) return;

      const isMobileOnly = toggleElement.getAttribute('data-mobile-only') === 'true';
      if (isMobileOnly && window.innerWidth >= this.mobileBreakpoint) return;

      this.isProcessing = true;

      const searchContainer = toggleContainer.closest('.is-searching');
      if (searchContainer) {
        this.handleSearchModeToggle(toggleElement, content, searchContainer);
      } else {
        const toggleGroup = toggleContainer.closest('[data-tmp-toggle-group]');
        if (toggleGroup) {
          console.log(7);
          this.handleGroupToggle(toggleElement, content, toggleGroup, toggleContainer);
        } else {
          console.log(5);
          this.handleToggle(toggleElement, content);
        }
      }

      setTimeout(() => {
        this.isProcessing = false;
      }, this.processingTimeout);
    });

    this.toggleElements = document.querySelectorAll('[data-tmp-toggle-element]');
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  }

  handleSearchModeToggle(toggleElement, content, searchContainer) {
    const isExpanded = toggleElement.getAttribute('aria-expanded') === 'true';

    if (!isExpanded) {
      const allToggleElements = searchContainer.querySelectorAll('[data-tmp-toggle-element]');
      allToggleElements.forEach(element => {
        if (element !== toggleElement) {
          const container = element.closest('[data-tmp-toggle]');
          const name = element.getAttribute('data-name');
          const elementContent = container.querySelector(`[data-tmp-toggle-content][data-name="${name}"]`);
          if (elementContent && element.getAttribute('aria-expanded') === 'true') {
            this.closeToggle(element, elementContent);
          }
        }
      });

      this.openToggle(toggleElement, content);
    } else {
      this.closeToggle(toggleElement, content);
    }
  }

  handleGroupToggle(toggleElement, content, toggleGroup, currentToggle) {
    const isExpanded = toggleElement.getAttribute('aria-expanded') === 'true';

    console.log(3);
    
    const siblingToggles = Array.from(toggleGroup.querySelectorAll('[data-tmp-toggle]'))
      .filter(toggle => {
        return toggle.parentElement === currentToggle.parentElement;
      });

    if (!isExpanded) {
      siblingToggles.forEach(toggle => {
        if (toggle !== currentToggle) {
          const siblingElement = toggle.querySelector('[data-tmp-toggle-element]');
          const siblingContent = toggle.querySelector('[data-tmp-toggle-content]');
          if (siblingElement && siblingContent && siblingElement.getAttribute('aria-expanded') === 'true') {
            this.closeToggle(siblingElement, siblingContent);
          }
        }
      });
      
      this.openToggle(toggleElement, content);
    } else {
      this.closeToggle(toggleElement, content);
    }
  }

  handleToggle(toggleElement, content) {
    const isExpanded = toggleElement.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      this.closeToggle(toggleElement, content);
    } else {
      this.openToggle(toggleElement, content);
    }
  }

  openToggle(toggleElement, content) {
    toggleElement.setAttribute('aria-expanded', 'true');
    toggleElement.closest('[data-tmp-toggle]').classList.add('on');
    window.Animation.slideDown(content);
  }

  closeToggle(toggleElement, content) {
    toggleElement.setAttribute('aria-expanded', 'false');
    toggleElement.closest('[data-tmp-toggle]').classList.remove('on');
    window.Animation.slideUp(content);
  }

  handleResize() {
    if (window.innerWidth >= this.mobileBreakpoint) {
      this.resetMobileOnlyToggles();
    }
  }

  resetMobileOnlyToggles() {
    this.toggleElements.forEach(toggleElement => {
      const isMobileOnly = toggleElement.getAttribute('data-mobile-only') === 'true';
      if (isMobileOnly) {
        const toggleContainer = toggleElement.closest('[data-tmp-toggle]');
        if (toggleContainer) {
          const name = toggleElement.getAttribute('data-name');
          const content = toggleContainer.querySelector(`[data-tmp-toggle-content][data-name="${name}"]`);
          if (content) {
            toggleElement.setAttribute('aria-expanded', 'false');
            toggleElement.classList.remove('on');
            window.Animation.resetStyle(content);
          }
        }
      }
    });
  }
}

new FlexibleToggleHandler();