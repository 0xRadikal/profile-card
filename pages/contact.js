// pages/contact.js — demo-only contact form handler (no backend).
// Honest UX: tells the user nothing is sent and points to real channels.
import '/profile-card/pages/theme.js';
import { currentLocale } from '/profile-card/data/content.js';

const COPY = {
  fa: {
    missing: 'همه فیلدها الزامی هستند',
    demoPrefix: 'این فرم نمایشی است و پیامی ارسال نمی‌شود. برای تماس واقعی: ',
    tg: 'تلگرام @Oxradikal',
    or: ' یا ',
  },
  en: {
    missing: 'All fields are required',
    demoPrefix: 'This is a demo form and nothing is sent. To reach me directly: ',
    tg: 'Telegram @Oxradikal',
    or: ' or ',
  },
};

const c = COPY[currentLocale()];
const form = document.getElementById('contactForm');
const hint = document.getElementById('formHint');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!hint) return;
  hint.textContent = '';
  const data = new FormData(form);
  const required = ['name', 'email', 'topic', 'message'];
  const missing = required.find((k) => !(data.get(k) || '').toString().trim());
  if (missing) {
    hint.textContent = c.missing;
    hint.style.color = '#f87171';
    return;
  }
  // Build the demo message with DOM APIs (no innerHTML) so CSP + safety hold.
  hint.textContent = c.demoPrefix;
  const tg = document.createElement('a');
  tg.href = 'https://t.me/Oxradikal';
  tg.target = '_blank';
  tg.rel = 'noopener';
  tg.textContent = c.tg;
  const mail = document.createElement('a');
  mail.href = 'mailto:radikal@example.com';
  mail.textContent = 'radikal@example.com';
  hint.append(tg, document.createTextNode(c.or), mail);
  hint.style.color = 'var(--text)';
  form.reset();
});
