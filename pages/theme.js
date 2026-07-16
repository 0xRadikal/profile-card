// pages/theme.js — shared theme bootstrap.
//
// Every standalone page previously inlined an identical `setTheme` IIFE that
// read the saved theme (or the system preference) and applied it to
// <html data-theme>. That duplication is consolidated here. Import for side
// effect at the top of each page module:  import '/profile-card/pages/theme.js'
(function () {
  const system = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const pref = localStorage.getItem('theme') || system;
  document.documentElement.setAttribute('data-theme', pref);
})();

// Optional interactive toggle: wires any #themeToggle button on the page.
export function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  const getPref = () =>
    localStorage.getItem('theme') ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    toggle.setAttribute('aria-pressed', String(t === 'light'));
  };
  applyTheme(getPref());
  toggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
    toggle.classList.add('pulse');
    setTimeout(() => toggle.classList.remove('pulse'), 260);
  });
}
