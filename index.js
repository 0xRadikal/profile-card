(function(){
  const system = matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark';
  const pref = localStorage.getItem('theme') || system;
  document.documentElement.setAttribute('data-theme', pref);
})();
'use strict';

// ===== Helpers =====
const qs = (s)=>document.querySelector(s);
const debounce = (fn, wait=140)=>{ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); }; };
const outEl   = qs('#output');
const inEl    = qs('#input');
const helpBtn = qs('#helpBtn');
const clearBtn= qs('#clearBtn');
const muteBtn = qs('#muteBtn');
const suggestEl = qs('#suggestions');
const toastEl = qs('#toast');
const cardEl = qs('.card');
const starsEl = qs('#starsLive');
const commitEl = qs('#commitLive');
const snippetCode = qs('#snippetCode');
const copySnippetBtn = qs('#copySnippet');
const particleCanvas = qs('#particles');
const contactForm = qs('#contact form.card-form');

// ===== Theme =====
const themeBtn = qs('#themeToggle');
const THEME_KEY = 'theme';
const getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
const setTheme = (next) => {
  const val = next === 'auto' ? '' : next;
  if(val){
    document.documentElement.setAttribute('data-theme', val);
    localStorage.setItem(THEME_KEY, val);
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem(THEME_KEY);
  }
  themeBtn?.setAttribute('aria-pressed', String(getCurrentTheme() === 'light'));
  toast(`theme: ${next}`);
};
themeBtn?.setAttribute('aria-pressed', String(getCurrentTheme() === 'light'));
themeBtn?.addEventListener('click', ()=>{
  const cur = getCurrentTheme();
  const next = (cur === 'light') ? 'dark' : 'light';
  setTheme(next);
  themeBtn.classList.add('pulse');
  setTimeout(()=>themeBtn.classList.remove('pulse'), 260);
});

// ===== 3D tilt =====
if(cardEl){
  cardEl.addEventListener('pointermove', (e)=>{
    const rect = cardEl.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width/2)/rect.width;
    const dy = (e.clientY - rect.top - rect.height/2)/rect.height;
    cardEl.style.transform = `rotateY(${dx*6}deg) rotateX(${dy*-6}deg)`;
  });
  cardEl.addEventListener('pointerleave', ()=>{ cardEl.style.transform=''; });
}

// ===== Particles =====
if(particleCanvas){
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduced){
    const ctx = particleCanvas.getContext('2d');
    const particles = Array.from({length:80}, ()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*0.6,vy:(Math.random()-.5)*0.6,r:Math.random()*2+0.5}));
    const resize = ()=>{
      particleCanvas.width = innerWidth;
      particleCanvas.height = innerHeight;
    };
    resize();
    addEventListener('resize', resize, {passive:true});
    const render = ()=>{
      ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>particleCanvas.width) p.vx*=-1;
        if(p.y<0||p.y>particleCanvas.height) p.vy*=-1;
        ctx.beginPath(); ctx.fillStyle='rgba(124,58,237,0.35)';
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(render);
    }; render();
  }
}

// ===== Toast =====
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('is-visible');
  setTimeout(()=>toastEl.classList.remove('is-visible'), 1800);
}

// ===== Audio =====
let audioCtx = null; let muted = false;
function initAudio(){
  if(audioCtx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return;
  audioCtx = new Ctx();
  if(audioCtx.state === 'suspended') audioCtx.resume?.();
}
function tick(freq=220, dur=0.02, vol=0.03){
  if(muted || !audioCtx) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain= audioCtx.createGain();
  osc.type = 'square'; osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(vol, t0);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(t0);
  setTimeout(()=>{ osc.stop?.(); osc.disconnect?.(); gain.disconnect?.(); }, dur*1000);
}
['pointerdown','click','keydown'].forEach(evt=>window.addEventListener(evt, initAudio, {once:true}));

// ===== Output helpers =====
let autoScroll = true; let typingAbort = false;
const atBottom = () => outEl ? (outEl.scrollTop + outEl.clientHeight >= outEl.scrollHeight - 8) : true;
outEl?.addEventListener('scroll', ()=>{ autoScroll = atBottom(); });
const maybeScrollEnd = ()=>{ if(outEl && autoScroll) outEl.scrollTop = outEl.scrollHeight; };
const PRUNE_MAX = 90;
const prune = ()=>{ if(!outEl) return; while(outEl.children.length > PRUNE_MAX) outEl.removeChild(outEl.firstElementChild); };
function printHTML(html, cls='ok'){
  if(!outEl) return;
  const d=document.createElement('div'); d.className=cls; d.innerHTML=html;
  outEl.appendChild(d); prune(); maybeScrollEnd();
}
function printText(text, cls='info'){
  if(!outEl) return;
  const d=document.createElement('div'); d.className=cls; d.textContent=text;
  outEl.appendChild(d); prune(); maybeScrollEnd();
}
async function typeLine(text, cls='info', baseDelay=14){
  if(!outEl) return;
  const d=document.createElement('div'); d.className=cls;
  outEl.appendChild(d); prune();
  for(let i=0;i<text.length;i++){
    if(typingAbort){ d.textContent = text; maybeScrollEnd(); return; }
    d.textContent += text[i];
    tick(220 + (i%3)*30, 0.005, 0.02);
    const jitter = (Math.random()*6)|0;
    // eslint-disable-next-line no-await-in-loop
    await new Promise(r=>setTimeout(r, baseDelay + jitter));
  }
  maybeScrollEnd();
}

// ===== History =====
const HISTORY_KEY = 'cli_history';
const history = (()=>{ try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch(_) { return []; } })();
let histIdx = history.length;
const saveHistory = (cmd)=>{ history.push(cmd); if(history.length>120) history.shift(); try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }catch(_){}; histIdx = history.length; };

// ===== Data =====
const files = new Map([
  ['resume','/profile-card/Radikal-CV.pdf'],
  ['projects','/profile-card/#projects'],
  ['blog','/profile-card/#blog'],
  ['contact','/profile-card/#contact'],
  ['gallery','/profile-card/#gallery'],
  ['timeline','/profile-card/#timeline'],
  ['skills','/profile-card/#skills'],
]);

const blogs = [
  {title:'TON Validators & Playbooks', tag:'Infra', date:'2025-03-01'},
  {title:'DeFi Safety: Wallet Threat Model', tag:'Security', date:'2025-02-10'},
  {title:'DAO Ops: Governance Automation', tag:'Research', date:'2025-01-12'},
];
const skillset = [
  {name:'Security Engineering', val:92},
  {name:'Node Ops / SRE', val:90},
  {name:'JavaScript / Front-end', val:85},
  {name:'DeFi / Research', val:88},
];
const socials = [
  {name:'GitHub', url:'https://github.com/0xradikal'},
  {name:'X (Twitter)', url:'https://x.com/0xradikal'},
  {name:'Telegram', url:'https://t.me/Oxradikal'},
  {name:'LinkedIn', url:'https://www.linkedin.com/in/0xradikal'},
];
const milestones = [
  {year:'2021', text:'Launched CryptoPIA community & research lab'},
  {year:'2022', text:'Scaled multi-chain node fleet with 99.9% uptime'},
  {year:'2023', text:'Shipped wallet forensics automation toolkit'},
  {year:'2024', text:'Security reviews for DeFi/TON products'},
];
const achievements = [
  {title:'99.9% Uptime', desc:'Across validators & RPC nodes'},
  {title:'$20K+ Rewards', desc:'Validator incentives across chains'},
  {title:'6.5K+ Members', desc:'CryptoPIA research community'},
  {title:'Bug Bounties', desc:'Security reports for infra teams'},
];

const commands = new Map([
  ['help',        {desc:'list available commands',         fn: ()=>printHTML(`<pre class="tbl">${helpTable()}</pre>`,'ok')}],
  ['ls',          {desc:'list available files',            fn: ()=>printText([...files.keys()].join('  '),'ok')}],
  ['cat',         {desc:'view a file (cat resume)',        fn: (arg)=>{
    const href = files.get(arg);
    if(href){
      const label = arg.charAt(0).toUpperCase()+arg.slice(1);
      printHTML(`Opening ${arg}... <a href='${href}' target='_blank' rel='noopener noreferrer'>[${label}]</a>`,'ok');
    } else { printText(`cat: ${arg||''}: No such file`,'err'); }
  }}],
  ['whoami',      {desc:'profile info',                    fn: ()=>{
    printText('Mohammad Shirvani (Radikal) — Web3 Researcher • DeFi • Security Engineer','ok');
    printText('ENS: Radikal.eth | Shahrekord | Software Engineering @ TVU','info');
  }}],
  ['status',      {desc:'node ops summary',                fn: ()=>printHTML(`System: <span class='ok'>OK</span>\nNodes: <span class='num'>17 active</span>\nUptime: <span class='ok'>99.9%</span>\nRewards: <span class='num'>$20K+</span>`,'ok')}],
  ['blog',        {desc:'latest articles',                 fn: ()=>{
    const html = blogs.map(b=>`<div><strong>${b.title}</strong> <span class='num'>${b.tag}</span> <span class='muted'>${b.date}</span></div>`).join('');
    printHTML(html,'ok');
  }}],
  ['skills',      {desc:'show skills as progress',         fn: ()=>{
    const html = skillset.map(s=>`<div class='skill'><div class='flex'><strong>${s.name}</strong><span class='num'>${s.val}%</span></div><div class='progress' aria-label='${s.name}'><span class='progress__bar' style='--w:${s.val}%'></span></div></div>`).join('');
    printHTML(html,'ok');
  }}],
  ['social',      {desc:'social links',                    fn: ()=>{
    const html = socials.map(s=>`<a href='${s.url}' target='_blank' rel='noopener'>${s.name}</a>`).join(' • ');
    printHTML(html,'ok');
  }}],
  ['contact',     {desc:'inline contact form',             fn: ()=>{
    const id = `form-${Date.now()}`;
    printHTML(`<form class='card-form' id='${id}'><label>نام<input name='name' required minlength='2' /></label><label>ایمیل<input name='email' type='email' required /></label><label>پیام<textarea name='msg' rows='3' required minlength='10'></textarea></label><button class='btn btn--primary' type='submit'>send</button></form>`,'ok');
  }}],
  ['timeline',    {desc:'career timeline',                 fn: ()=>{
    const html = milestones.map(m=>`<div class='timeline__item'><strong>${m.year}</strong><div>${m.text}</div></div>`).join('');
    printHTML(`<div class='timeline'>${html}</div>`,'ok');
  }}],
  ['achievements',{desc:'badges and awards',               fn: ()=>{
    const html = achievements.map(a=>`<div class='stat'><div class='stat__num'>${a.title}</div><div class='stat__label'>${a.desc}</div></div>`).join('');
    printHTML(`<div class='achievements'>${html}</div>`,'ok');
  }}],
  ['fetch',       {desc:'fetch url (GitHub API)',          fn: (arg)=>fetchCommand(arg)}],
  ['theme',       {desc:'set theme dark|light|auto',       fn: (arg)=>{
    if(['dark','light','auto'].includes(arg)) setTheme(arg);
    else printText('Usage: theme dark|light|auto','err');
  }}],
  ['scroll',      {desc:'scroll to a section',             fn: (arg)=>scrollToSection(arg)}],
  ['easter-egg',  {desc:'hidden surprise',                 fn: ()=>{
    printHTML(`<pre class='tbl'>┌─ radikal ─┐\n│ stay curious │\n└───────────┘</pre>`,'ok');
    toast('010101-wow');
  }}],
  ['clear',       {desc:'clear screen',                    fn: ()=>{ if(outEl) outEl.innerHTML=''; }}],
]);

const aliases = new Map([
  ['h','help'], ['r','cat resume'], ['p','cat projects'], ['c','clear']
]);

function helpTable(){
  return Array.from(commands.entries()).map(([cmd,meta])=>`${cmd.padEnd(12)} ${meta.desc}`).join('\n');
}
function aliasToCommand(cmd){ return aliases.get(cmd) || cmd; }

// ===== Command runner =====
async function handle(raw){
  const _raw = (raw||'').trim();
  const cmd = aliasToCommand(_raw);
  if(!cmd) return;
  printText(`$ ${cmd}`,'prompt');
  const [base,...rest] = cmd.split(/\s+/);
  const arg = rest.join(' ');
  const meta = commands.get(base);
  if(meta){
    meta.fn(arg);
  } else {
    const suggestion = suggest(base);
    printText(`command not found: ${base}${suggestion ? `. did you mean ${suggestion}?` : ''}`,'err');
  }
}

// ===== Suggestion & autocomplete =====
const commandNames = Array.from(commands.keys());
function distance(a,b){
  const dp = Array.from({length:a.length+1}, ()=>Array(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++) dp[i][0]=i; for(let j=0;j<=b.length;j++) dp[0][j]=j;
  for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++) dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return dp[a.length][b.length];
}
function suggest(word){
  let best=null, score=3;
  for(const name of commandNames){
    const d=distance(word,name); if(d<score){ score=d; best=name; }
  }
  return best;
}
function showMatches(val){
  if(!suggestEl) return;
  if(!val){ suggestEl.textContent=''; return; }
  const matches = commandNames.filter(c=>c.startsWith(val));
  suggestEl.innerHTML = matches.length ? `suggestions: <strong>${matches.join('</strong>, <strong>')}</strong>` : '';
}
const debouncedSuggest = debounce(showMatches, 120);

function scrollToSection(target){
  const id = (target || '').replace('#','');
  if(!id){ printText('Usage: scroll projects', 'err'); return; }
  const el = document.getElementById(id);
  if(el){
    el.scrollIntoView({behavior:'smooth', block:'start'});
    toast(`jumped to #${id}`);
  } else {
    printText(`section not found: ${id}`,'err');
  }
}

// ===== Fetch command =====
async function fetchCommand(url){
  if(!url){ printText('Usage: fetch https://api.github.com/...','err'); return; }
  let parsed;
  try {
    parsed = new URL(url, location.href);
  } catch (_){
    printText('Invalid URL. Use https://example.com','err');
    return;
  }
  if(!['https:','http:'].includes(parsed.protocol)){
    printText('Only http(s) requests are allowed','err');
    return;
  }
  const sameOrigin = parsed.origin === location.origin;
  const allowlisted = ['api.github.com','github.com'].some(host=>parsed.hostname.endsWith(host));
  if(!sameOrigin && !allowlisted){
    printText('Cross-origin fetch blocked. Try GitHub APIs or same-origin paths.','err');
    return;
  }
  printHTML(`<div class='skeleton' style='height:18px'></div>`,'info');
  try{
    const res = await fetch(parsed.toString(), {headers:{'Accept':'application/json'}});
    if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    const pretty = JSON.stringify(json,null,2).slice(0,800);
    printHTML(`<pre class='tbl'>${pretty}</pre>`,'ok');
  }catch(err){
    printText(`fetch failed: ${err.message}`,'err');
  }
}

// ===== Live GitHub =====
async function hydrateGitHub(){
  if(!starsEl || !commitEl) return;
  try{
    const repoRes = await fetch('https://api.github.com/repos/0xradikal/profile-card');
    if(!repoRes.ok) throw new Error(repoRes.statusText);
    const data = await repoRes.json();
    starsEl.textContent = `${data.stargazers_count || 0}★`;
    commitEl.textContent = new Date(data.pushed_at).toLocaleDateString();
  }catch(_){ starsEl.textContent='offline'; commitEl.textContent='offline'; }
}
hydrateGitHub();

// ===== Snippet copy =====
copySnippetBtn?.addEventListener('click', async ()=>{
  try{ await navigator.clipboard.writeText(snippetCode?.textContent||''); toast('Snippet copied'); }
  catch(_){ toast('Copy blocked'); }
});

// ===== CLI input handlers =====
inEl?.addEventListener('focus', ()=>{ if(matchMedia('(pointer:coarse)').matches) inEl.scrollIntoView({block:'nearest'}); });
outEl?.addEventListener('keydown', e=>{ if(e.key==='Escape') inEl?.focus(); });
inEl?.addEventListener('input', (e)=>{ typingAbort = true; debouncedSuggest(e.target.value.trim()); });
inEl?.addEventListener('keydown', e=>{
  if(e.key === 'Enter'){
    const cmd = inEl.value.trim();
    if(cmd){ saveHistory(cmd); }
    inEl.value = '';
    typingAbort = true;
    tick(420,0.02,0.04);
    handle(cmd);
    showMatches('');
  } else if(e.key === 'ArrowUp'){
    if(history.length && histIdx>0){ histIdx--; inEl.value = history[histIdx]; setTimeout(()=>inEl.setSelectionRange(inEl.value.length,inEl.value.length)); }
    e.preventDefault();
  } else if(e.key === 'ArrowDown'){
    if(history.length && histIdx < history.length-1){ histIdx++; inEl.value = history[histIdx]; }
    else { histIdx = history.length; inEl.value=''; }
    e.preventDefault();
  } else if(e.key === 'Tab'){
    const val = inEl.value.trim();
    if(val){
      const match = commandNames.find(c=>c.startsWith(val));
      if(match){ inEl.value = match + (match==='cat'?' ':''); }
    }
    e.preventDefault();
  } else {
    typingAbort = true; tick(300,0.004,0.014);
  }
});

helpBtn?.addEventListener('click', ()=>handle('help'));
clearBtn?.addEventListener('click', ()=>handle('clear'));
muteBtn?.addEventListener('click', ()=>{ muted = !muted; muteBtn.textContent = `mute: ${muted ? 'on' : 'off'}`; muteBtn.setAttribute('aria-pressed', String(muted)); });

// ===== Delegated form handler =====
outEl?.addEventListener('submit', (e)=>{
  const form = e.target;
  if(!(form instanceof HTMLFormElement)) return;
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get('name')||'').toString().trim();
  const email= (data.get('email')||'').toString().trim();
  const msg  = (data.get('msg')||'').toString().trim();
  if(!name || !email || !msg){ toast('fill all fields'); return; }
  printText(`Contact sent: ${name} <${email}> — ${msg.slice(0,120)}`,'ok');
  toast('message queued');
  form.reset();
});

contactForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = (data.get('name')||'').toString();
  const email = (data.get('email')||'').toString();
  const msg = (data.get('msg')||'').toString();
  toast('پیام نمونه ثبت شد');
  printText(`Contact form: ${name} • ${email} • ${msg.slice(0,90)}`,'ok');
  contactForm.reset();
});

// ===== Boot sequence =====
async function boot(){
  if(!inEl) return;
  inEl.disabled = true;
  const isMobile = matchMedia('(pointer:coarse)').matches;
  const seq = [
    '> initializing system modules...',
    '> loading node metrics...',
    '> verifying RPC connections...',
    '> security daemon: OK',
    '> environment: stable',
    'Radikal CLI v8.0 ready.',
    "Type 'help' to begin.",
    "New: blog, skills, social, timeline, achievements, fetch, theme, scroll, easter-egg"
  ];
  typingAbort = false;
  for(const line of seq){
    await typeLine(line,'info', isMobile ? 8 : 14);
    await new Promise(r=>setTimeout(r,120));
    if(typingAbort) break;
  }
  inEl.disabled = false; inEl.focus();
}
boot();

// ===== Service worker =====
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/profile-card/sw.js').catch(()=>{});
  });
}
