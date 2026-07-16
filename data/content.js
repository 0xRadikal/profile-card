// =============================================================================
// data/content.js — SINGLE SOURCE OF TRUTH for site content.
//
// Before this file, the same blog/skills/timeline data was hand-copied into
// index.js AND the inline <script> of every standalone page (fa + en). That
// guaranteed drift. Everything is now defined here once, keyed by locale where
// the standalone pages carry richer, translated copy.
//
// Consumers:
//   - index.js            -> CLI commands (uses the `en` short arrays)
//   - pages/blog.js       -> blog.html / en/blog.html
//   - pages/skills.js     -> skills.html / en/skills.html
//   - pages/timeline.js   -> timeline.html / en/timeline.html
//   - pages/gallery.js    -> gallery.html / en/gallery.html
//
// Loaded from both the site root and /en/ via the absolute /profile-card/
// path, matching the repo's absolute-path convention.
// =============================================================================

// ---- CLI short arrays (rendered by index.js commands) -----------------------
// These stay English/compact because the CLI output is language-neutral.
export const blogs = [
  { title: 'TON Validators & Playbooks', tag: 'Infra', date: '2025-03-01' },
  { title: 'DeFi Safety: Wallet Threat Model', tag: 'Security', date: '2025-02-10' },
  { title: 'DAO Ops: Governance Automation', tag: 'Research', date: '2025-01-12' },
];

export const skillset = [
  { name: 'Security Engineering', val: 92 },
  { name: 'Node Ops / SRE', val: 90 },
  { name: 'JavaScript / Front-end', val: 85 },
  { name: 'DeFi / Research', val: 88 },
];

export const socials = [
  { name: 'GitHub', url: 'https://github.com/0xradikal' },
  { name: 'X (Twitter)', url: 'https://x.com/0xradikal' },
  { name: 'Telegram', url: 'https://t.me/Oxradikal' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/0xradikal' },
];

export const milestones = [
  { year: '2021', text: 'Launched CryptoPIA community & research lab' },
  { year: '2022', text: 'Scaled multi-chain node fleet with 99.9% uptime' },
  { year: '2023', text: 'Shipped wallet forensics automation toolkit' },
  { year: '2024', text: 'Security reviews for DeFi/TON products' },
];

export const achievements = [
  { title: '99.9% Uptime', desc: 'Across validators & RPC nodes' },
  { title: '$20K+ Rewards', desc: 'Validator incentives across chains' },
  { title: '6.5K+ Members', desc: 'CryptoPIA research community' },
  { title: 'Bug Bounties', desc: 'Security reports for infra teams' },
];

// ---- Rich, locale-keyed content for the standalone section pages ------------
// `posts`, `skills`, `timeline` used to live inline in each HTML page, once
// per language. Now defined once, per locale.
export const content = {
  fa: {
    posts: [
      { title: 'TON Validators & Playbooks', tag: 'Infra', date: '2025-03-01', summary: 'مسیر راه‌اندازی و نگهداری ولیدیتورهای TON با اتوماسیون.' },
      { title: 'Wallet Threat Model', tag: 'Security', date: '2025-02-10', summary: 'چک‌لیست دفاعی و تشخیص فیشینگ در کیف پول‌ها.' },
      { title: 'Governance Automation', tag: 'Research', date: '2025-01-12', summary: 'ابزارهای خودکار برای رأی‌گیری و KPIهای DAO.' },
      { title: 'Node Ops Playbook', tag: 'Infra', date: '2024-12-02', summary: 'پایش، هشدار و تکرارپذیری در ناوگان نودها.' },
    ],
    skills: [
      { name: 'Security', level: 0.92 },
      { name: 'NodeOps', level: 0.9 },
      { name: 'JavaScript', level: 0.85 },
      { name: 'DevRel', level: 0.72 },
      { name: 'Research', level: 0.88 },
    ],
    timeline: [
      { year: '2021', title: 'CryptoPIA', desc: 'ایجاد کامیونیتی و اتاق فکر DeFi' },
      { year: '2022', title: 'NodeOps', desc: 'گسترش ناوگان ولیدیتورها و مانیتورینگ' },
      { year: '2023', title: 'Security Lab', desc: 'توسعه ابزار تحلیل تراکنش و ریسک' },
      { year: '2024', title: 'TON Research', desc: 'تمرکز بر تون و زیرساخت‌های مرتبط' },
    ],
    galleryAlt: 'نمونه کار',
    notFound: 'موردی یافت نشد.',
    readMore: 'بخوانید',
  },
  en: {
    posts: [
      { title: 'TON Validators & Playbooks', tag: 'Infra', date: '2025-03-01', summary: 'Bootstrapping and maintaining TON validators with automation.' },
      { title: 'Wallet Threat Model', tag: 'Security', date: '2025-02-10', summary: 'A defensive checklist and phishing detection for wallets.' },
      { title: 'Governance Automation', tag: 'Research', date: '2025-01-12', summary: 'Automated tooling for DAO voting and KPIs.' },
      { title: 'Node Ops Playbook', tag: 'Infra', date: '2024-12-02', summary: 'Monitoring, alerting and reproducibility across the node fleet.' },
    ],
    skills: [
      { name: 'Security', level: 0.92 },
      { name: 'NodeOps', level: 0.9 },
      { name: 'JavaScript', level: 0.85 },
      { name: 'DevRel', level: 0.72 },
      { name: 'Research', level: 0.88 },
    ],
    timeline: [
      { year: '2021', title: 'CryptoPIA', desc: 'Founded a DeFi community & think tank' },
      { year: '2022', title: 'NodeOps', desc: 'Scaled the validator fleet & monitoring' },
      { year: '2023', title: 'Security Lab', desc: 'Built transaction analysis & risk tooling' },
      { year: '2024', title: 'TON Research', desc: 'Focused on TON and related infrastructure' },
    ],
    galleryAlt: 'Sample work',
    notFound: 'No results found.',
    readMore: 'Read',
  },
};

// Shared, language-neutral asset list (image URLs) for the gallery.
export const galleryPics = [
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
];

// Detect the active locale from <html lang> (falls back to 'en').
export function currentLocale() {
  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  return lang.startsWith('fa') ? 'fa' : 'en';
}
