/* =====================================================================
   NOUFAL CONSTRUCTIONS — interactions
   No dependencies. All behaviour is IntersectionObserver-driven.
   ===================================================================== */

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ---------- Header scrolled state (observer on hero, no scroll listener) ---------- */
const header = document.querySelector('.site-header');
const heroAnchor = document.getElementById('hero-anchor');
if (header && heroAnchor) {
  new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
  ).observe(heroAnchor);
}

/* ---------- Animated stat counters (ease-out-cubic) ---------- */
const statNums = document.querySelectorAll('.stat-num');
let counted = false;

function runCounters() {
  if (counted) return;
  counted = true;
  statNums.forEach(el => {
    const target = +el.dataset.count;
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}

const heroStats = document.getElementById('heroStats');
if (heroStats) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) runCounters();
  }, { threshold: 0.3 }).observe(heroStats);
}

/* ---------- Scroll reveal (one-shot) ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

if (revealEls.length && prefersMotion) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('revealed'));
}

/* ---------- Portfolio filter ---------- */
const filterBar = document.getElementById('filters');
const projects = Array.from(document.querySelectorAll('.project'));

if (filterBar) {
  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterBar.querySelectorAll('.filter-btn').forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });

    const filter = btn.dataset.filter;
    projects.forEach(p => {
      const show = filter === 'all' || p.dataset.category === filter;
      p.classList.toggle('is-hidden', !show);
    });
  });
}

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lbClose = document.getElementById('lbClose');
const lbFields = {
  img: document.getElementById('lbImg'),
  cat: document.getElementById('lbCat'),
  name: document.getElementById('lbName'),
  desc: document.getElementById('lbDesc'),
  loc: document.getElementById('lbLoc'),
  area: document.getElementById('lbArea'),
  year: document.getElementById('lbYear'),
  dur: document.getElementById('lbDur'),
};
let lastFocused = null;

function openLightbox(project) {
  const d = project.dataset;
  lbFields.img.src = d.img;
  lbFields.img.alt = d.name;
  lbFields.cat.textContent = d.cat;
  lbFields.name.textContent = d.name;
  lbFields.desc.textContent = d.desc;
  lbFields.loc.textContent = d.loc;
  lbFields.area.textContent = d.area;
  lbFields.year.textContent = d.year;
  lbFields.dur.textContent = d.dur;

  lastFocused = document.activeElement;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

if (lightbox) {
  projects.forEach(p => {
    p.setAttribute('tabindex', '0');
    p.setAttribute('role', 'button');
    p.addEventListener('click', () => openLightbox(p));
    p.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(p); }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* ---------- Contact form (demo handler) ----------
   Client-side only. Replace the success block with a real
   fetch('/api/enquiry', { method:'POST', body: new FormData(form) })
   to wire up a backend. */
const form = document.getElementById('quoteForm');
const note = document.getElementById('formNote');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!name) { alert('Please tell us your name.'); form.name.focus(); return; }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email so we can reach you.'); form.email.focus(); return;
    }

    // --- success (demo) ---
    note.hidden = false;
    form.reset();
    note.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
