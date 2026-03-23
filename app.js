/* app.js — SEOContent.ai Router, Dark Mode, Animations, Interactions */

(function () {
  'use strict';

  // ============ DOM REFERENCES ============
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.header__nav a, .mobile-nav a');
  const mobileNav = document.querySelector('.mobile-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileBackdrop = document.querySelector('.mobile-backdrop');
  const mobileCloseBtn = document.querySelector('.mobile-nav__close');

  // ============ HASH ROUTER ============

  function getPageFromHash() {
    const hash = window.location.hash.replace('#', '') || 'home';
    return hash;
  }

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
    } else {
      // fallback to home
      document.getElementById('page-home').classList.add('active');
      pageId = 'home';
    }

    // Update nav active states
    navLinks.forEach(link => {
      const linkHash = link.getAttribute('href').replace('#', '');
      if (linkHash === pageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close mobile menu
    closeMobileMenu();

    // Re-trigger counter animations if on home page
    if (pageId === 'home') {
      initCounters();
    }
  }

  window.addEventListener('hashchange', () => {
    showPage(getPageFromHash());
  });

  // Handle nav clicks for smooth routing
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    const pageId = hash.replace('#', '');

    // Check if it's a page navigation (not an in-page anchor)
    const validPages = ['home', 'features', 'pricing', 'how-it-works', 'use-cases', 'about', 'contact'];
    if (validPages.includes(pageId)) {
      e.preventDefault();
      window.location.hash = hash;
    }
  });

  // Initial page load
  showPage(getPageFromHash());

  // ============ DARK MODE TOGGLE ============
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      themeToggle.setAttribute('aria-label', 'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode');
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    } else {
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  // ============ MOBILE MENU (Drawer) ============
  function openMobileMenu() {
    if (mobileNav) mobileNav.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    document.body.classList.add('menu-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close button inside drawer
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // Close on backdrop click
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ============ HEADER SCROLL BEHAVIOR ============
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    // Show/hide header CTA on scroll
    const headerCTA = document.getElementById('header-cta');
    if (headerCTA) {
      headerCTA.style.display = currentScroll > 400 ? 'inline-flex' : 'none';
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ============ COUNTER ANIMATION ============
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter'), 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, observerOptions);

    counters.forEach(counter => {
      counter.textContent = '0';
      counterObserver.observe(counter);
    });
  }

  function animateCounter(el, target) {
    const duration = 800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Initialize counters on load
  initCounters();

  // ============ FAQ ACCORDION ============
  document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-item__question');
    if (!question) return;

    const item = question.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all FAQ items
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked item if it was closed
    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });

  // ============ CONTACT FORM ============
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    });
  }

  // ============ FALLBACK SCROLL ANIMATIONS (for browsers without scroll-driven) ============
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .reveal-up');
    
    if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) {
      // Browser supports native scroll-driven animations, CSS handles it
      return;
    }
    
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.clipPath = 'none';
          entry.target.classList.add('animated');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    fadeElements.forEach(el => {
      if (!el.classList.contains('animated')) {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        fadeObserver.observe(el);
      }
    });
  }

  initScrollAnimations();

  // Re-init when pages change
  const originalShowPage = showPage;
  // Observe mutations to handle page transitions
  const mutObserver = new MutationObserver(() => {
    setTimeout(initScrollAnimations, 100);
  });
  mutObserver.observe(document.getElementById('main-content'), { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

})();
