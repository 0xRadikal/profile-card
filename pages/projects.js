// pages/projects.js — theme toggle, parallax HUD, and filter/search for the
// projects page. Extracted verbatim (behaviour-preserving) from the former
// inline scripts in projects.html.
import { initThemeToggle } from '/profile-card/pages/theme.js';

// Theme (bootstrap side-effect import applied the saved theme; this wires the
// interactive toggle button).
initThemeToggle();

// Parallax HUD.
const layers = document.querySelectorAll('.parallax');
let rafId = null;
const parallaxTo = (x, y) => {
  layers.forEach((el) => {
    const d = parseFloat(el.dataset.depth || '0.2');
    el.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`;
  });
};
window.addEventListener(
  'pointermove',
  (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const cx = innerWidth / 2;
      const cy = innerHeight / 2;
      parallaxTo((e.clientX - cx) / 40, (e.clientY - cy) / 40);
      rafId = null;
    });
  },
  { passive: true }
);

// Filters + search (debounced).
const items = Array.from(document.querySelectorAll('.proj'));
const chips = Array.from(document.querySelectorAll('[data-filter]'));
const q = document.getElementById('q');
let active = 'all';
let timer = null;

function apply() {
  const term = (q?.value || '').trim().toLowerCase();
  items.forEach((el) => {
    const tags = el.dataset.tags || '';
    const text = el.innerText.toLowerCase();
    const byTag = active === 'all' || tags.includes(active);
    const byText = !term || text.includes(term);
    el.style.display = byTag && byText ? '' : 'none';
  });
}
chips.forEach((ch) =>
  ch.addEventListener('click', () => {
    active = ch.dataset.filter;
    chips.forEach((x) => x.classList.remove('is-active'));
    ch.classList.add('is-active');
    apply();
  })
);
q?.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(apply, 160);
});
document.querySelector('[data-filter="all"]')?.classList.add('is-active');
apply();
