// pages/skills.js — renders skill cards + a bar chart. Data from content.js.
import '/profile-card/pages/theme.js';
import { content, currentLocale } from '/profile-card/data/content.js';

const skills = content[currentLocale()].skills;
const grid = document.getElementById('skillGrid');
const chart = document.getElementById('chart');

skills.forEach((s) => {
  const card = document.createElement('article');
  card.className = 'card-soft';
  const h3 = document.createElement('h3');
  h3.textContent = s.name;
  const prog = document.createElement('div');
  prog.className = 'progress';
  prog.setAttribute('aria-label', s.name);
  const bar = document.createElement('span');
  bar.className = 'progress__bar';
  bar.style.setProperty('--w', `${s.level * 100}%`);
  prog.appendChild(bar);
  const pct = document.createElement('p');
  pct.className = 'muted mono';
  pct.textContent = `${Math.round(s.level * 100)}%`;
  card.append(h3, prog, pct);
  grid?.appendChild(card);
});

skills.forEach((s) => {
  const bar = document.createElement('div');
  bar.className = 'chart__bar';
  bar.style.setProperty('--v', String(s.level));
  const fill = document.createElement('span');
  const label = document.createElement('label');
  label.textContent = s.name;
  bar.append(fill, label);
  chart?.appendChild(bar);
});
