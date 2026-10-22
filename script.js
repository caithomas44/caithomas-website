/* caithomas.com - loaded with defer, so it runs after the HTML is parsed and never blocks rendering. */
(function () {
  'use strict';

  // Scroll reveal (content is visible without this; it only adds the fade-in)
  const reveals = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(el => el.classList.add('visible'));
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  if (('IntersectionObserver' in window) && !reduceMotion) reveals.forEach(el => observer.observe(el));
  // Safety net: once a second, show anything in or above the viewport that the observer has not reached.
  const sweep = setInterval(() => {
    let pending = 0;
    reveals.forEach(el => {
      if (el.classList.contains('visible')) return;
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible'); else pending++;
    });
    if (!pending) clearInterval(sweep);
  }, 1000);

  // Nav scroll border
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    reveals.forEach(el => { if (!el.classList.contains('visible') && el.getBoundingClientRect().bottom < 0) el.classList.add('visible'); });
  }, { passive: true });

  // Burger menu
  const burger = document.getElementById('burger');
  const overlay = document.getElementById('nav-overlay');

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Client ticker tabs
  document.querySelectorAll('.ticker-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ticker-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const group = tab.dataset.group;
      document.querySelectorAll('.ticker-tab').forEach(t => t.setAttribute('aria-pressed', t === tab ? 'true' : 'false'));
      document.getElementById('ticker-b2b').style.display = group === 'b2b' ? 'block' : 'none';
      document.getElementById('ticker-b2c').style.display = group === 'b2c' ? 'block' : 'none';
    });
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      overlay.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
})();

// DataLayer Click Tracking
(function() {
  window.dataLayer = window.dataLayer || [];

  // Track all button clicks
  document.addEventListener('click', function(e) {
    const button = e.target.closest('button, .btn-primary, .btn-ghost, .cookie-btn');

    if (button) {
      const buttonText = button.textContent.trim();
      const buttonClass = button.className;

      window.dataLayer.push({
        'event': 'button_click',
        'button_text': buttonText,
        'button_class': buttonClass,
        'button_type': button.tagName.toLowerCase(),
        'timestamp': new Date().toISOString()
      });
    }
  });

  // Track all external link clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');

    if (link && link.href) {
      const url = new URL(link.href, window.location.href);
      const isExternal = url.hostname !== window.location.hostname;

      if (isExternal) {
        // Extract site name from URL
        const siteName = url.hostname.replace('www.', '');
        const linkText = link.textContent.trim() || link.getAttribute('aria-label') || 'No text';

        window.dataLayer.push({
          'event': 'external_link_click',
          'link_url': link.href,
          'link_domain': url.hostname,
          'link_site_name': siteName,
          'link_text': linkText,
          'link_destination': url.pathname,
          'timestamp': new Date().toISOString()
        });
      } else {
        // Track internal navigation
        window.dataLayer.push({
          'event': 'internal_link_click',
          'link_url': link.href,
          'link_text': link.textContent.trim(),
          'link_section': link.getAttribute('href'),
          'timestamp': new Date().toISOString()
        });
      }
    }
  });

  // Track navigation link clicks specifically
  document.querySelectorAll('.nav-link, .nav-links a').forEach(function(navLink) {
    navLink.addEventListener('click', function(e) {
      window.dataLayer.push({
        'event': 'navigation_click',
        'nav_text': this.textContent.trim(),
        'nav_destination': this.getAttribute('href'),
        'timestamp': new Date().toISOString()
      });
    });
  });

  // Track CTA clicks
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(function(cta) {
    cta.addEventListener('click', function(e) {
      window.dataLayer.push({
        'event': 'cta_click',
        'cta_text': this.textContent.trim(),
        'cta_type': this.classList.contains('btn-primary') ? 'primary' : 'ghost',
        'cta_destination': this.href || 'no-link',
        'timestamp': new Date().toISOString()
      });
    });
  });

})();

// Cookie Consent Logic
(function() {
  const cookieBanner = document.getElementById('cookieConsent');
  const acceptBtn = document.getElementById('cookieAccept');
  const rejectBtn = document.getElementById('cookieReject');

  // Check if user has already consented
  const hasConsented = localStorage.getItem('cookieConsent');

  if (!hasConsented) {
    // Show banner on page load
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 500);
  }

  acceptBtn.addEventListener('click', function() {
    // Store consent
    localStorage.setItem('cookieConsent', 'accepted');

    // Fire GTM dataLayer event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'cookie_consent',
      'consent_status': 'accepted',
      'consent_timestamp': new Date().toISOString()
    });

    // Hide banner
    cookieBanner.classList.remove('show');
    setTimeout(() => {
      cookieBanner.style.display = 'none';
    }, 300);
  });

  rejectBtn.addEventListener('click', function() {
    // Go back / close page
    window.history.back();
  });
})();
