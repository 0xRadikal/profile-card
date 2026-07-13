// pages/blog.js — renders the blog listing with tag filter + text search.
// Data comes from data/content.js (single source of truth), keyed by locale.
import '/profile-card/pages/theme.js';
import { content, currentLocale } from '/profile-card/data/content.js';

const t = content[currentLocale()];
const posts = t.posts;

const wrap = document.getElementById('posts');
const search = document.getElementById('search');
const chips = Array.from(document.querySelectorAll('[data-tag]'));
let active = 'all';

function render() {
  const term = (search?.value || '').toLowerCase();
  wrap.textContent = '';
  const matched = posts.filter((p) => {
    const byTag = active === 'all' || p.tag === active;
    const byText = !term || p.title.toLowerCase().includes(term) || p.summary.toLowerCase().includes(term);
    return byTag && byText;
  });
  matched.forEach((p) => {
    // Build with DOM APIs + textContent — no innerHTML with data values.
    const el = document.createElement('article');
    el.className = 'card-soft';
    const pill = document.createElement('div');
    pill.className = 'pill';
    pill.textContent = p.tag;
    const h2 = document.createElement('h2');
    h2.textContent = p.title;
    const date = document.createElement('p');
    date.className = 'muted mono';
    date.textContent = p.date;
    const sum = document.createElement('p');
    sum.textContent = p.summary;
    const link = document.createElement('a');
    link.className = 'link';
    link.href = '#';
    link.textContent = t.readMore;
    el.append(pill, h2, date, sum, link);
    wrap.appendChild(el);
  });
  if (!wrap.children.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = t.notFound;
    wrap.appendChild(empty);
  }
}

chips.forEach((c) =>
  c.addEventListener('click', () => {
    active = c.dataset.tag;
    chips.forEach((x) => x.classList.remove('is-active'));
    c.classList.add('is-active');
    render();
  })
);
search?.addEventListener('input', render);
if (chips[0]) chips[0].classList.add('is-active');
render();
