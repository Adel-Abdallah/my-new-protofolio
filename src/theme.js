/**
 * Theme & Animation Controller
 * Modern Organic Portfolio
 */

(function () {
  // ==========================================================================
  // Theme Management
  // ==========================================================================

  function getSystemPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: theme } }));
    } catch (e) { }

    // Update all theme toggle buttons (including duplicates in mobile header)
    document.querySelectorAll('#theme-toggle, [id*="theme-toggle"]').forEach(function (btn) {
      const pressed = theme === 'dark';
      btn.setAttribute('aria-pressed', String(pressed));
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.innerHTML = theme === 'dark'
          ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
          : '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
      }
    });
  }

  // ==========================================================================
  // Scroll Animations (Intersection Observer)
  // ==========================================================================

  function initScrollAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const animatedElements = document.querySelectorAll('.section, .service-item, .client-item, .skill-category, .experience-item, .education-item, .project-card');

    // Add animation classes
    animatedElements.forEach(function (el, index) {
      if (!el.classList.contains('animate-on-scroll')) {
        el.classList.add('animate-on-scroll');
      }
      // Stagger animation for grid items
      if (el.classList.contains('service-item') ||
        el.classList.contains('client-item') ||
        el.classList.contains('skill-category') ||
        el.classList.contains('project-card')) {
        const staggerIndex = (index % 4) + 1;
        el.classList.add('stagger-' + staggerIndex);
      }
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================

  function initHeaderScrollEffect() {
    const headers = document.querySelectorAll('.portfolio-header');
    if (!headers.length) return;

    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      headers.forEach(function (header) {
        if (scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================================================
  // Smooth Scroll for Internal Links
  // ==========================================================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
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

  // ==========================================================================
  // Interactive Card Effects
  // ==========================================================================

  function initCardEffects() {
    const cards = document.querySelectorAll('.service-item, .experience-item, .skill-category, .education-item, .project-card, .client-item');

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        this.style.willChange = 'transform, box-shadow';
      });

      card.addEventListener('mouseleave', function () {
        this.style.willChange = 'auto';
      });
    });
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  function init() {
    // Theme initialization
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) { }
    const initial = saved === 'dark' || saved === 'light' ? saved : getSystemPref();
    applyTheme(initial);

    // Bind all theme toggles
    document.querySelectorAll('#theme-toggle, [id*="theme-toggle"]').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme') || initial;
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });

    // Keep in sync with OS changes
    const mm = window.matchMedia('(prefers-color-scheme: dark)');
    if (mm && typeof mm.addEventListener === 'function') {
      mm.addEventListener('change', function () {
        let hasExplicit = null;
        try { hasExplicit = localStorage.getItem('theme'); } catch (e) { }
        if (hasExplicit !== 'dark' && hasExplicit !== 'light') {
          applyTheme(getSystemPref());
        }
      });
    }

    // Initialize other features
    initScrollAnimations();
    initHeaderScrollEffect();
    initSmoothScroll();
    initCardEffects();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
