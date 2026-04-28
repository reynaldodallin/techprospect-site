/* TechProspect — app.js · Interactions, Scroll Reveals, FAQ, Counters */
(function () {
  'use strict';

  // ─── Smooth scroll for [data-nav] links ─────────────────────────────────
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMobileNav();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

  // ─── Mobile nav ──────────────────────────────────────────────────────────
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  const backdrop  = document.getElementById('mobile-backdrop');
  const closeBtn  = document.getElementById('mobile-close');

  function openMobileNav() {
    mobileNav?.removeAttribute('hidden');
    backdrop?.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    mobileNav?.setAttribute('hidden', '');
    backdrop?.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
  burger?.addEventListener('click', openMobileNav);
  closeBtn?.addEventListener('click', closeMobileNav);
  backdrop?.addEventListener('click', closeMobileNav);

  // ─── Scroll reveal ───────────────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));

  // ─── Header shrink on scroll ─────────────────────────────────────────────
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('header--scrolled', window.scrollY > 60);
  }, { passive: true });

  // ─── FAQ accordion ───────────────────────────────────────────────────────
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-item__a');
      const open   = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-item__q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.faq-item').querySelector('.faq-item__a').style.maxHeight = '0';
        b.closest('.faq-item').classList.remove('faq-item--open');
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        item.classList.add('faq-item--open');
      }
    });
  });

  // ─── Animated counters ───────────────────────────────────────────────────
  let countersStarted = false;
  const counters = document.querySelectorAll('[data-count]');

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(el => {
      const target  = parseInt(el.dataset.count, 10);
      const suffix  = el.dataset.suffix || '';
      const dur     = 1600;
      const start   = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = Math.round(ease * target);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    new IntersectionObserver(([e]) => { if (e.isIntersecting) startCounters(); }, { threshold: 0.3 })
      .observe(statsSection);
  }

  // ─── Current year ────────────────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

})();
