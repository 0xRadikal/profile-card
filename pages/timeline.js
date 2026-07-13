// pages/timeline.js — renders the career timeline. Data from content.js.
import '/profile-card/pages/theme.js';
import { content, currentLocale } from '/profile-card/data/content.js';

const items = content[currentLocale()].timeline;
const wrap = document.getElementById('timeline');

if (wrap) {
  wrap.textContent = '';
  items.forEach((i) => {
    const row = document.createElement('div');
    row.className = 'timeline__item';
    const year = document.createElement('strong');
    year.textContent = i.year;
    const title = document.createElement('span');
    title.textContent = i.title;
    const desc = document.createElement('div');
    desc.className = 'muted';
    desc.textContent = i.desc;
    row.append(year, document.createTextNode(' — '), title, desc);
    wrap.appendChild(row);
  });
}
