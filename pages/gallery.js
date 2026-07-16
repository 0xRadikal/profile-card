// pages/gallery.js — renders the gallery grid + lightbox. Data from content.js.
import '/profile-card/pages/theme.js';
import { galleryPics, content, currentLocale } from '/profile-card/data/content.js';

const alt = content[currentLocale()].galleryAlt;
const grid = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const img = document.getElementById('lightboxImg');

galleryPics.forEach((src) => {
  const el = document.createElement('img');
  el.src = src;
  el.alt = alt;
  el.addEventListener('click', () => {
    if (img) img.src = src;
    lightbox?.classList.add('is-open');
  });
  grid?.appendChild(el);
});

lightbox?.addEventListener('click', () => lightbox.classList.remove('is-open'));
