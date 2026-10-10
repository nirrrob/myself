(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Launch intro: automatically enters after 3 seconds; button skips immediately.
  const launch = $('#launchScreen');
  const launchCount = $('#launchCount');
  const launchFootCount = $('#launchFootCount');
  const launchRing = $('#launchRing');
  const launchEnter = $('#launchEnter');
  let remaining = 3;
  let launched = false;
  let launchInterval;
  function enterPortfolio() {
    if (launched) return;
    launched = true;
    clearInterval(launchInterval);
    if (launch) launch.classList.add('is-exiting');
    document.body.classList.remove('is-loading');
    window.setTimeout(() => { if (launch) launch.remove(); }, 760);
    revealObserver?.takeRecords?.();
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }
  if (launch && launchEnter) {
    launchEnter.addEventListener('click', enterPortfolio);
    launchInterval = window.setInterval(() => {
      remaining -= 1;
      if (launchCount) launchCount.textContent = String(Math.max(remaining, 0));
      if (launchFootCount) launchFootCount.textContent = String(Math.max(remaining, 0));
      if (launchRing) launchRing.style.setProperty('--launch-progress', `${((3 - remaining) / 3) * 100}%`);
      if (remaining <= 0) enterPortfolio();
    }, 1000);
    launch.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') enterPortfolio(); });
  } else document.body.classList.remove('is-loading');

  // Slide-out menu works on desktop and mobile, including escape/backdrop/link close.
  const menuToggle = $('#menuToggle');
  const siteMenu = $('#siteMenu');
  const menuBackdrop = $('#menuBackdrop');
  const menuClose = $('#menuClose');
  function setMenu(open) {
    if (!menuToggle || !siteMenu || !menuBackdrop) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    siteMenu.setAttribute('aria-hidden', String(!open));
    siteMenu.classList.toggle('open', open);
    menuBackdrop.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (open && menuClose) menuClose.focus();
    if (!open && menuToggle) menuToggle.focus({ preventScroll: true });
  }
  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menuClose?.addEventListener('click', () => setMenu(false));
  menuBackdrop?.addEventListener('click', () => setMenu(false));
  $$('.menu-links a, .menu-socials a').forEach(link => link.addEventListener('click', () => {
    if (link.getAttribute('href')?.startsWith('#')) setMenu(false);
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && siteMenu?.classList.contains('open')) setMenu(false); });

  // Scroll reveal animations.
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }) : null;
  $$('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('visible'));

  // University journey countdown + local time.
  const targetDate = new Date('2029-06-30T23:59:59+06:00').getTime();
  const journeyStart = new Date('2025-09-01T00:00:00+06:00').getTime();
  const byId = id => document.getElementById(id);
  function updateCountdown() {
    const now = Date.now();
    let distance = Math.max(0, targetDate - now);
    const days = Math.floor(distance / 86400000); distance %= 86400000;
    const hours = Math.floor(distance / 3600000); distance %= 3600000;
    const minutes = Math.floor(distance / 60000); distance %= 60000;
    const seconds = Math.floor(distance / 1000);
    if (byId('days')) byId('days').textContent = String(days).padStart(3, '0');
    if (byId('hours')) byId('hours').textContent = String(hours).padStart(2, '0');
    if (byId('minutes')) byId('minutes').textContent = String(minutes).padStart(2, '0');
    if (byId('seconds')) byId('seconds').textContent = String(seconds).padStart(2, '0');
    const progress = Math.max(0, Math.min(100, ((now - journeyStart) / (targetDate - journeyStart)) * 100));
    if (byId('progressBar')) byId('progressBar').style.width = `${progress}%`;
    if (byId('progressPercent')) byId('progressPercent').textContent = `${progress.toFixed(1)}%`; 
    if (byId('localTime')) byId('localTime').textContent = new Intl.DateTimeFormat('en-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Dhaka' }).format(new Date());
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Current year and safe image fallback. Keep the supplied filename case-sensitive.
  if (byId('year')) byId('year').textContent = new Date().getFullYear();
  const profileImage = $('.avatar img');
  const fallback = $('.avatar-fallback');
  if (profileImage) {
    profileImage.addEventListener('error', () => {
      profileImage.style.display = 'none';
      if (fallback) fallback.style.display = 'grid';
    });
    profileImage.addEventListener('load', () => { if (fallback) fallback.style.display = 'none'; });
  }

  // If a real email is added once, all mail links can be updated from this constant.
  const emailAddress = '';
  if (emailAddress) $$('[data-email-link]').forEach(link => link.href = `mailto:${emailAddress}`);
})();
