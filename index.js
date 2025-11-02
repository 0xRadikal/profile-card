
    (function(){
      const system = matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark';
      const pref = localStorage.getItem('theme') || system;
      document.documentElement.setAttribute('data-theme', pref);
    })();
  'use strict';

  // ===== Theme toggle =====
  const themeBtn = document.getElementById('themeToggle');
  function getCurrentTheme(){
    return document.documentElement.getAttribute('data-theme')
      || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }
  function setTheme(next){
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('theme', next); }catch(_){ }
    themeBtn?.setAttribute('aria-pressed', String(next === 'light'));
  }
  // sync aria-pressed on load
  themeBtn?.setAttribute('aria-pressed', String(getCurrentTheme() === 'light'));
  themeBtn?.addEventListener('click', ()=>{
    const cur  = getCurrentTheme();
    const next = (cur === 'light') ? 'dark' : 'light';
    setTheme(next);
  });

  // ===== Elements =====
  const outEl    = document.getElementById('output');
  const inEl     = document.getElementById('input');
  const helpBtn  = document.getElementById('helpBtn');
  const clearBtn = document.getElementById('clearBtn');
  const muteBtn  = document.getElementById('muteBtn');
  if(!outEl || !inEl){ console.warn('CLI elements not found. Abort init.'); }

  // ===== WebAudio click sounds =====
  let audioCtx = null;
  let muted = false; // default: sound ON
  function initAudio(){
    if(audioCtx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return;
    audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') { audioCtx.resume?.(); }
  }
  function tick(freq=220, dur=0.02, vol=0.03){
    if(muted || !audioCtx) return;
    const t0 = audioCtx.currentTime;
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol, t0);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(t0);
    setTimeout(()=>{
      try{ osc.stop(); }catch(_){ }
      try{ osc.disconnect(); }catch(_){ }
      try{ gain.disconnect(); }catch(_){ }
    }, dur*1000);
  }
  // Unlock audio on first user gesture
  window.addEventListener('pointerdown', initAudio, { once:true });
  window.addEventListener('click',       initAudio, { once:true });
  window.addEventListener('keydown',     initAudio, { once:true });

  // ===== Output helpers =====
  let autoScroll = true;
  const atBottom = () => outEl ? (outEl.scrollTop + outEl.clientHeight >= outEl.scrollHeight - 8) : true;
  outEl?.addEventListener('scroll', () => { autoScroll = atBottom(); });
  const maybeScrollEnd = () => { if(outEl && autoScroll) outEl.scrollTop = outEl.scrollHeight; };

  const PRUNE_MAX = 70;
  const prune = () => {
    if(!outEl) return;
    while (outEl.children.length > PRUNE_MAX) outEl.removeChild(outEl.firstElementChild);
  };

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

  // typewriter with slight jitter + abort support
  let typingAbort = false;
  async function typeLine(text, cls='info', baseDelay=14){
    if(!outEl) return;
    const d=document.createElement('div'); d.className=cls;
    outEl.appendChild(d); prune();
    for(let i=0;i<text.length;i++){
      if(typingAbort){ d.textContent = text; maybeScrollEnd(); return; }
      d.textContent += text[i];
      tick(220 + (i%3)*30, 0.005, 0.02);
      const jitter = (Math.random()*6)|0;
      await new Promise(r=>setTimeout(r, baseDelay + jitter));
    }
    maybeScrollEnd();
  }

  // --- history (persisted)
  const HISTORY_KEY = 'cli_history';
  const history = (()=>{ try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch(_) { return []; } })();
  let histIdx = history.length;
  const saveHistory = (cmd) => {
    history.push(cmd);
    if(history.length > 100) history.shift();
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch(_) {}
    histIdx = history.length;
  };

  // --- command set + aliases
  const files = new Map([
    ['resume',   '/profile-card/Radikal-CV.pdf'],
    ['projects', '/profile-card/projects.html'],
  ]);
  function helpTable(){
    return [
      'COMMAND       DESCRIPTION',
      'help (h)      list available commands',
      'ls            list available files',
      'cat <file>    view resume or projects',
      'r             open resume',
      'p             open projects',
      'whoami        profile info',
      'status        node ops summary',
      'clear (c)     clear screen'
    ].join('\n');
  }
  function aliasToCommand(cmd){
    if(cmd==='h' ) return 'help';
    if(cmd==='r' ) return 'cat resume';
    if(cmd==='p' ) return 'cat projects';
    if(cmd==='c' ) return 'clear';
    return cmd;
  }

  // ===== Single, correct handle() =====
  async function handle(raw){
    const _raw = (raw||'').trim();
    const cmd = aliasToCommand(_raw);
    if(!cmd) return;
    printText(`$ ${cmd}`, 'prompt');
    const [base, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');

    switch(base){
      case 'help':
        printHTML(`<pre class='tbl'>${helpTable()}</pre>`, 'ok');
        break;

      case 'ls':
        printText([...files.keys()].join('  '), 'ok');
        break;

      case 'cat': {
        const href = files.get(arg);
        if(href){
          const label = (arg === 'resume') ? 'Radikal-CV.pdf' : 'Projects';
          printHTML(`Opening ${arg}... <a href='${href}' target='_blank' rel='noopener noreferrer'>[${label}]</a>`, 'ok');
        } else {
          printText(`cat: ${arg||''}: No such file`, 'err');
        }
        break; }

      case 'whoami':
        printText('Mohammad Shirvani (Radikal) — Web3 Researcher • DeFi • Security Engineer', 'ok');
        printText('ENS: Radikal.eth | Shahrekord | Software Engineering @ TVU', 'info');
        break;

      case 'status':
        printHTML(`System: <span class='ok'>OK</span>\nNodes: <span class='num'>17 active</span>\nUptime: <span class='ok'>99.9%</span>\nRewards: <span class='num'>$20K+</span>`, 'ok');
        break;

      case 'clear':
        if(outEl) outEl.innerHTML='';
        break;

      default:
        printText(`command not found: ${base}`, 'err');
        break;
    }
  }

  // --- input handlers
  inEl?.addEventListener('focus', ()=>{
    if (matchMedia('(pointer:coarse)').matches) inEl.scrollIntoView({block:'nearest'});
  });
  outEl?.addEventListener('keydown', e=>{ if(e.key==='Escape') inEl?.focus(); });
  inEl?.addEventListener('keydown', e=>{
    if(e.key === 'Enter'){
      const cmd = inEl.value.trim();
      if(cmd){ saveHistory(cmd); }
      inEl.value = '';
      tick(420, 0.02, 0.04);
      handle(cmd);
    } else if(e.key === 'ArrowUp'){
      if(history.length && histIdx > 0){ histIdx--; inEl.value = history[histIdx]; setTimeout(()=>inEl.setSelectionRange(inEl.value.length, inEl.value.length)); }
      e.preventDefault();
    } else if(e.key === 'ArrowDown'){
      if(history.length && histIdx < history.length-1){ histIdx++; inEl.value = history[histIdx]; }
      else { histIdx = history.length; inEl.value=''; }
      e.preventDefault();
    } else {
      typingAbort = true; // cancel boot animation on typing
      tick(300, 0.004, 0.014);
    }
  });

  helpBtn?.addEventListener('click', ()=> handle('help'));
  clearBtn?.addEventListener('click', ()=> handle('clear'));
  muteBtn?.addEventListener('click', ()=>{
    muted = !muted;
    muteBtn.textContent = `mute: ${muted ? 'on' : 'off'}`;
    muteBtn.setAttribute('aria-pressed', String(muted));
  });

  // --- boot sequence (mobile-aware; abortable)
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
      'Radikal CLI v7.3 ready.',
      "Type 'help' to begin."
    ];
    typingAbort = false;
    for(const line of seq){
      await typeLine(line, 'info', isMobile ? 8 : 16);
      await new Promise(r=>setTimeout(r, 120));
      if(typingAbort) break;
    }
    inEl.disabled = false; inEl.focus();
  }
  boot();