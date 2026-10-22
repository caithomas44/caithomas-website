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

// Consent, Google Tag Manager and click events.
// Nothing that sets tracking cookies loads until the visitor presses "Accept all".
(function () {
  'use strict';
  const GTM_ID = 'GTM-KKZ54J';
  const KEY = 'cookieConsent';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function readChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function saveChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  const consented = () => readChoice() === 'accepted';

  // Google Consent Mode: the defaults follow the stored choice, denied when there is none.
  const initial = consented() ? 'granted' : 'denied';
  gtag('consent', 'default', { ad_storage: initial, ad_user_data: initial, ad_personalization: initial, analytics_storage: initial });

  let gtmLoaded = false;
  function loadGTM() {
    if (gtmLoaded) return;
    gtmLoaded = true;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  // Remove first-party cookies the trackers set (Google Analytics, Meta, Clarity).
  function clearTrackingCookies() {
    const names = document.cookie.split(';').map(c => c.split('=')[0].trim())
      .filter(n => /^(_ga|_gid|_gat|_gcl_|_fbp|_fbc|_clck|_clsk|CLID|MUID|ANONCHK)/.test(n));
    const host = location.hostname;
    const domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    names.forEach(n => domains.forEach(d => {
      document.cookie = n + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
    }));
  }

  // Click events go to the dataLayer only when the visitor has accepted.
  function track(obj) {
    if (!consented()) return;
    obj.timestamp = new Date().toISOString();
    window.dataLayer.push(obj);
  }
  document.addEventListener('click', function (e) {
    const button = e.target.closest('button, .btn-primary, .btn-ghost');
    if (button && !button.classList.contains('cookie-btn')) {
      track({ event: 'button_click', button_text: button.textContent.trim(), button_class: button.className, button_type: button.tagName.toLowerCase() });
    }
    const link = e.target.closest('a');
    if (link && link.href) {
      const url = new URL(link.href, window.location.href);
      if (url.protocol === 'mailto:') {
        track({ event: 'email_click', link_text: 'email' });
      } else if (url.hostname !== window.location.hostname) {
        track({ event: 'external_link_click', link_url: link.href, link_domain: url.hostname, link_site_name: url.hostname.replace('www.', ''), link_text: link.textContent.trim() || link.getAttribute('aria-label') || 'No text', link_destination: url.pathname });
      } else {
        track({ event: 'internal_link_click', link_url: link.href, link_text: link.textContent.trim(), link_section: link.getAttribute('href') });
      }
    }
  });
  document.querySelectorAll('.nav-link, .nav-links a').forEach(function (navLink) {
    navLink.addEventListener('click', function () {
      track({ event: 'navigation_click', nav_text: this.textContent.trim(), nav_destination: this.getAttribute('href') });
    });
  });
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(function (cta) {
    cta.addEventListener('click', function () {
      track({ event: 'cta_click', cta_text: this.textContent.trim(), cta_type: this.classList.contains('btn-primary') ? 'primary' : 'ghost', cta_destination: this.href || 'no-link' });
    });
  });

  // The cookie notice
  const banner = document.getElementById('cookieConsent');
  const accept = document.getElementById('cookieAccept');
  const reject = document.getElementById('cookieReject');
  const settings = document.getElementById('cookieSettings');
  function showBanner() { banner.style.display = ''; banner.classList.add('show'); accept.focus({ preventScroll: true }); }
  function hideBanner() { banner.classList.remove('show'); setTimeout(() => { banner.style.display = 'none'; }, 300); }

  accept.addEventListener('click', function () {
    saveChoice('accepted');
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    loadGTM();
    window.dataLayer.push({ event: 'cookie_consent', consent_status: 'accepted', consent_timestamp: new Date().toISOString() });
    hideBanner();
  });
  reject.addEventListener('click', function () {
    const wasLoaded = gtmLoaded;
    saveChoice('rejected');
    gtag('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
    clearTrackingCookies();
    hideBanner();
    // Trackers already running in this page cannot be unloaded, so start the page afresh without them.
    if (wasLoaded) setTimeout(() => location.reload(), 350);
  });
  if (settings) settings.addEventListener('click', showBanner);

  const choice = readChoice();
  if (choice === 'accepted') loadGTM();
  else if (choice !== 'rejected') setTimeout(showBanner, 500);
})();

// Email address, put together in the browser so it is not in the page source for scrapers.
(function () {
  'use strict';
  const rev = s => s.split('').reverse().join('');
  document.querySelectorAll('.js-email').forEach(function (a) {
    const addr = rev(a.dataset.u) + '@' + rev(a.dataset.d);
    a.href = 'mailto:' + addr;
    a.textContent = addr;
  });
})();
