# Radikal Profile Card (v7.3 — Cyber-Minimal)

**Author:** [Mohammad Shirvani (Radikal)](https://github.com/0xradikal)
**Demo:** [Profile Card View](https://github.com/0xRadikal/profile-card/blob/master/Demo.jpg)
**License:** MIT

---

## 🧩 Overview

The **Radikal Profile Card** is a cyber‑minimal personal portfolio card built with pure **HTML, CSS, and JavaScript**, designed to showcase a developer or Web3 researcher profile in an interactive, accessible, and high‑performance format.

It’s built to be:

* **Fast:** No frameworks, no dependencies.
* **Accessible:** WCAG‑compliant and keyboard‑navigable.
* **Modular:** Fully theme‑aware (light/dark) and extendable.
* **Interactive:** Includes a custom command‑line interface (CLI) for fun user interaction.

---

## ⚙️ Project Structure

```
profile-card/
│
├── index.html              # Main HTML file
├── profile-card.css        # Core styling (v7.3 — Cyber-Minimal)
├── index.js                # JS logic (theme toggle + CLI)
├── favicon.png             # Site icon
├── preview.png             # Social preview (for OpenGraph / Twitter)
├── Radikal-CV.pdf          # Resume (linked via CLI)
├── projects.html           # Projects list (optional)
└── README.md               # Documentation (this file)
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/0xradikal/profile-card.git
cd profile-card
```

### 2. Open in browser

You can open `index.html` directly, or use a local dev server for cleaner routing:

```bash
npx serve
```

Then open:

```
http://localhost:3000
```

---

## 🎨 Customization Guide

### 1. **Profile Data**

Edit the following section in `index.html`:

```html
<h1 class="name">Your Name <span class="aka">(Alias)</span></h1>
<p class="role mono">Your Role • Skills</p>
<p class="ens mono">ENS or Handle</p>
<p class="meta">📍 Location • Your Position or Education</p>
```

### 2. **Badges & Stats**

Badges (`<section class="badges">`) define your expertise.
Stats (`<section class="stats">`) highlight measurable achievements.

### 3. **Theme & Colors**

All colors are defined in the `:root` of `profile-card.css`.
You can adjust brand gradients, panel opacity, or shadow depth.

```css
:root {
  --brandA: #7c3aed;
  --brandB: #06b6d4;
  --brandC: color-mix(in oklab, #16a34a 80%, #000 20%);
}
```

### 4. **Avatar**

Replace the avatar image:

```html
<img class="avatar" src="https://github.com/YOUR_GITHUB.png" alt="Your photo" />
```

### 5. **CLI Commands**

Edit `index.js` → `files` map or add new commands inside the `handle()` switch.

```js
const files = new Map([
  ['resume',   '/profile-card/YourCV.pdf'],
  ['projects', '/profile-card/projects.html'],
]);
```

---

## 💻 CLI (Interactive Shell)

The embedded **Radikal CLI** lets users interact with your profile using typed commands.

### Available Commands

| Command        | Description                      |
| -------------- | -------------------------------- |
| `help` or `h`  | Show available commands          |
| `ls`           | List accessible files            |
| `cat resume`   | Open your resume (PDF)           |
| `cat projects` | Open project list                |
| `r` / `p`      | Shortcuts for resume / projects  |
| `whoami`       | Display profile summary          |
| `status`       | Show node/infrastructure metrics |
| `clear` / `c`  | Clear CLI output                 |

The terminal automatically stores command history (`localStorage`) and supports **arrow key navigation**.

---

## 🔊 Audio Feedback

Each keystroke and CLI event triggers a soft WebAudio tick for tactile feedback.

* Audio context initializes on the first user gesture.
* You can toggle sound with the **`mute`** button in the shell header.

To disable sound entirely, set:

```js
let muted = true;
```

---

## 🌗 Theme System

Theme switching is handled via the button in the top‑right corner.
It respects both **system preferences** and **manual user settings** stored in `localStorage`.

```js
const pref = localStorage.getItem('theme') || system;
document.documentElement.setAttribute('data-theme', pref);
```

---

## 📱 Responsive Design

The layout adapts from desktop (960px card) down to mobile (<480px):

* Two-column layout becomes vertical.
* Stats grid collapses to 1–2 columns.
* Buttons stack vertically.

All animations are **reduced** automatically when `prefers-reduced-motion` is enabled.

---

## 🧠 Accessibility (A11Y)

* Semantic HTML (`<header>`, `<section>`, `<footer>`)
* Screen-reader text via `.sr-only`
* ARIA labels and `aria-live` updates for CLI output
* Contrast‑safe colors under both themes

---

## 🧰 Browser Support

| Feature                        | Supported Browsers                 |
| ------------------------------ | ---------------------------------- |
| CSS color-mix / conic-gradient | Chrome 111+, Edge 111+, Safari 17+ |
| WebAudio API                   | All modern browsers                |
| LocalStorage / MatchMedia      | All modern browsers                |

Fallbacks are included for older Safari versions.

---

## 🧪 Developer Notes

* **No external dependencies.** All animations and effects are pure CSS or vanilla JS.
* **Performance:** Designed to stay <30KB gzip total (HTML+CSS+JS).
* **Security:** No inline scripts; safe for strict CSP setups.

---

## 🧩 Extending Functionality

You can extend the CLI to support new commands like `social`, `blog`, or `contact`:

```js
case 'social':
  printHTML(`X: <a href='https://x.com/yourhandle'>@yourhandle</a>`, 'ok');
  break;
```

Or add new UI sections to the HTML (e.g., achievements, timeline, portfolio grid).

---

## 🧠 Credits

Built and maintained by **[Mohammad Shirvani (Radikal)](https://github.com/0xradikal)**
Web3 Researcher & Security Engineer — DeFi • DAO • TON • NodeOps

---

## 📄 License

This project is licensed under the **MIT License** — free for personal and commercial use.

```text
MIT License
Copyright (c) 2025 Mohammad Shirvani (Radikal)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```
# کارت پروفایل Radikal (نسخه 7.3 — Cyber-Minimal)

**نویسنده:** [محمد شیروانی (Radikal)](https://github.com/0xradikal)
**دموی زنده:** [0xradikal.github.io/profile-card](https://0xradikal.github.io/profile-card/)
**مجوز:** MIT

---

## 🧩 معرفی

کارت پروفایل **Radikal** یک کارت شخصی سایبر-مینیمال برای معرفی حرفه‌ای ساخته شده با **HTML، CSS و JavaScript خالص** است. هدف از آن نمایش هویت دیجیتال، رزومه و مهارت‌های شما به شکلی مدرن، سریع و قابل تعامل است.

ویژگی‌های کلیدی:

* **سریع و سبک:** بدون فریم‌ورک و وابستگی خارجی.
* **دسترس‌پذیر:** سازگار با WCAG و پشتیبانی کامل از کیبورد و صفحه‌خوان.
* **قابل توسعه:** پشتیبانی از حالت روشن/تاریک، CLI داخلی و ساختار ماژولار.
* **امن و سازگار:** بدون اسکریپت درون‌خطی، مناسب برای CSP سخت‌گیرانه.

---

## ⚙️ ساختار پروژه

```
profile-card/
│
├── index.html              # فایل اصلی HTML
├── profile-card.css        # استایل اصلی (v7.3 — Cyber-Minimal)
├── index.js                # منطق JavaScript (تغییر تم + CLI)
├── favicon.png             # آیکون سایت
├── preview.png             # تصویر پیش‌نمایش برای شبکه‌های اجتماعی
├── Radikal-CV.pdf          # فایل رزومه (برای دستور cat resume)
├── projects.html           # صفحه پروژه‌ها (اختیاری)
└── README.md               # مستندات پروژه
```

---

## 🚀 شروع سریع

### ۱. کلون کردن ریپوزیتوری

```bash
git clone https://github.com/0xradikal/profile-card.git
cd profile-card
```

### ۲. اجرا در مرورگر

فایل `index.html` را مستقیماً باز کنید یا با یک سرور محلی اجرا کنید:

```bash
npx serve
```

سپس به آدرس زیر بروید:

```
http://localhost:3000
```

---

## 🎨 سفارشی‌سازی

### ۱. اطلاعات پروفایل

در بخش `<header>` فایل `index.html` ویرایش کنید:

```html
<h1 class="name">نام شما <span class="aka">(نام مستعار)</span></h1>
<p class="role mono">نقش یا تخصص شما • مهارت‌ها</p>
<p class="ens mono">آدرس ENS یا شناسه کاربری</p>
<p class="meta">📍 موقعیت مکانی • موقعیت تحصیلی یا شغلی</p>
```

### ۲. برچسب‌ها و آمار

در بخش `<section class="badges">` مهارت‌ها را وارد کنید و در `<section class="stats">` شاخص‌های عددی مثل اعضای کامیونیتی یا Uptime را تنظیم کنید.

### ۳. رنگ‌ها و تم

در `:root` فایل CSS رنگ‌های برند را تنظیم کنید:

```css
:root {
  --brandA: #7c3aed;
  --brandB: #06b6d4;
  --brandC: color-mix(in oklab, #16a34a 80%, #000 20%);
}
```

### ۴. آواتار

آدرس تصویر پروفایل را تغییر دهید:

```html
<img class="avatar" src="https://github.com/YOUR_GITHUB.png" alt="تصویر شما" />
```

### ۵. دستورات CLI

در فایل `index.js` قسمت `files` یا تابع `handle()` را ویرایش کنید تا مسیرهای شخصی خود را اضافه کنید:

```js
const files = new Map([
  ['resume',   '/profile-card/YourCV.pdf'],
  ['projects', '/profile-card/projects.html'],
]);
```

---

## 💻 ترمینال تعاملی (CLI)

ترمینال داخلی یا **Radikal CLI** امکان تعامل با پروفایل را از طریق دستورات متنی فراهم می‌کند.

### دستورات موجود

| دستور          | توضیح                        |
| -------------- | ---------------------------- |
| `help` یا `h`  | نمایش لیست دستورات           |
| `ls`           | فهرست فایل‌ها                |
| `cat resume`   | باز کردن رزومه PDF           |
| `cat projects` | باز کردن صفحه پروژه‌ها       |
| `r` / `p`      | میان‌بر رزومه / پروژه‌ها     |
| `whoami`       | نمایش اطلاعات کاربر          |
| `status`       | نمایش وضعیت نودها و پاداش‌ها |
| `clear` یا `c` | پاک‌کردن خروجی ترمینال       |

دستورات ذخیره می‌شوند و با کلیدهای جهت‌نما (↑↓) قابل مرورند.

---

## 🔊 صدای بازخورد

برای هر رویداد ورودی یا دستور، یک صدای کوتاه از طریق WebAudio پخش می‌شود.
می‌توانید صدا را از دکمه **mute** در بالای ترمینال خاموش کنید.

برای غیرفعال کردن کامل صدا:

```js
let muted = true;
```

---

## 🌗 سیستم تم

سیستم تم به‌صورت خودکار با حالت سیستم کاربر همگام است و انتخاب کاربر در `localStorage` ذخیره می‌شود.

```js
const pref = localStorage.getItem('theme') || system;
document.documentElement.setAttribute('data-theme', pref);
```

---

## 📱 واکنش‌گرایی

طراحی کارت از دسکتاپ (960px) تا موبایل (<480px) به‌صورت خودکار تنظیم می‌شود:

* ساختار دو ستونه به تک‌ستونه تبدیل می‌شود.
* شبکه آمار از ۴ ستون به ۲ یا ۱ ستون کاهش می‌یابد.
* دکمه‌ها در موبایل تمام عرض می‌شوند.

همچنین برای کاربران با `prefers-reduced-motion` انیمیشن‌ها کاهش می‌یابند.

---

## 🧠 دسترس‌پذیری

* استفاده از تگ‌های معنایی (`header`, `section`, `footer`)
* پشتیبانی از صفحه‌خوان با `.sr-only`
* تنظیمات ARIA برای وضعیت ترمینال
* رنگ‌های سازگار با WCAG AA در هر دو تم

---

## 🧰 پشتیبانی مرورگرها

| ویژگی                      | مرورگرهای پشتیبانی‌شده             |
| -------------------------- | ---------------------------------- |
| color-mix / conic-gradient | Chrome 111+, Edge 111+, Safari 17+ |
| WebAudio API               | تمامی مرورگرهای مدرن               |
| LocalStorage / MatchMedia  | تمامی مرورگرهای مدرن               |

برای Safari قدیمی fallback رنگ در نظر گرفته شده است.

---

## 🧩 نکات توسعه‌دهنده

* بدون هیچ وابستگی خارجی.
* طراحی‌شده برای حجم کمتر از ۳۰ کیلوبایت gzip.
* سازگار با Content Security Policy.

---

## 🔧 گسترش عملکرد

می‌توانید فرمان‌های جدید مثل `social` یا `contact` اضافه کنید:

```js
case 'social':
  printHTML(`X: <a href='https://x.com/yourhandle'>@yourhandle</a>`, 'ok');
  break;
```

یا بخش‌های جدید به HTML بیفزایید (مثل سوابق، تایم‌لاین یا نمونه‌کارها).

---

## 👨‍💻 سازنده

طراحی و توسعه توسط **[محمد شیروانی (Radikal)](https://github.com/0xradikal)**
پژوهشگر Web3 و مهندس امنیت — DeFi • DAO • TON • NodeOps

---

## 📄 مجوز

این پروژه تحت مجوز **MIT** آزاد است — برای استفاده شخصی و تجاری.

```text
MIT License
Copyright (c) 2025 Mohammad Shirvani (Radikal)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```
