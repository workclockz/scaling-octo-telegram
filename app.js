/* ============================================================
   LIQUIDVERCEL — roleplay casino engine
   No real money. Everything is simulated & stored locally.
   ============================================================ */
'use strict';

/* ---------- constants & storage ---------- */
const ADMIN_KEY = '55030';
const LS_KEYS = 'lr_keys';        // license key registry
const LS_SESSION = 'lr_session';  // active license session key
const LS_SETTINGS = 'lr_settings';// user settings (sound etc)
const START_BALANCE = 100;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const escapeHtml = str => String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

/* ---------- icon registry ---------- */
const ICONS = {
  'arrow-right': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  'arrow-left': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  'log-out': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
  'plus': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  'trash': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  'download': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  'volume': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
  'volume-x': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
  'check': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  'x': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  'info': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  'bomb': `<svg class="ic" viewBox="0 0 24 24" fill="url(#iconGrad)"><path d="M11.96 5.86c-3.83 0-6.95 3.1-6.95 6.95 0 3.82 3.12 6.94 6.95 6.94s6.94-3.12 6.94-6.94c0-3.85-3.1-6.95-6.94-6.95zm-3.07 9.88c-.6 0-1.1-.48-1.1-1.1s.48-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1zM18.8 4l2 1.34-2.88 4L16 8l2.8-4zm-4.7-2.07l-1 2.24L11 4l1-2 2 .93zM5.33 4l3 2.76-1.5 1.5L4 5.33 5.33 4z"/></svg>`,
  'dice': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5" fill="url(#iconGrad)"></circle><circle cx="15.5" cy="15.5" r="1.5" fill="url(#iconGrad)"></circle><circle cx="15.5" cy="8.5" r="1.5" fill="url(#iconGrad)"></circle><circle cx="8.5" cy="15.5" r="1.5" fill="url(#iconGrad)"></circle></svg>`,
  'plinko': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 22h20L12 2z"></path><circle cx="12" cy="16" r="2" fill="url(#iconGrad)"></circle></svg>`,
  'rocket': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15 3.3-3.3a16 16 0 0 0 6-10.6a16 16 0 0 0-10.6 6L7.4 10.4"></path><path d="m9 11 4 4"></path></svg>`,
  'coin': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12M8 10h8M8 14h8"></path></svg>`,
  'limbo': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  'wheel': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="2" x2="12" y2="9"></line><line x1="12" y1="15" x2="12" y2="22"></line><line x1="22" y1="12" x2="15" y2="12"></line><line x1="9" y1="12" x2="2" y2="12"></line><line x1="19.07" y1="4.93" x2="14.12" y2="9.88"></line><line x1="9.88" y1="14.12" x2="4.93" y2="19.07"></line><line x1="19.07" y1="19.07" x2="14.12" y2="14.12"></line><line x1="9.88" y1="9.88" x2="4.93" y2="4.93"></line></svg>`,
  'target': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  'diamond': `<svg class="ic" viewBox="0 0 24 24" fill="url(#iconWater)" stroke="url(#iconGrad)" stroke-width="1.5"><polygon points="12 2 22 8.5 12 22 2 8.5 12 2"></polygon></svg>`,
  'user': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  'key': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
  'gamepad': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>`,
  'wallet': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>`,
  'trophy': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="url(#iconGold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>`,
  'trending-up': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  'hash': `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>`
};
function injectIcons() {
  $$('.ic-slot, .gc-icon, .li-ic').forEach(el => {
    const k = el.dataset.ic;
    if (ICONS[k]) { el.innerHTML = ICONS[k]; el.removeAttribute('data-ic'); }
  });
}

/* ---------- audio ---------- */
let soundOn = loadSettings().sound !== false;
const ctxA = new (window.AudioContext || window.webkitAudioContext)();
function loadSettings() { try { return JSON.parse(localStorage.getItem(LS_SETTINGS)) || {}; } catch { return {}; } }
function saveSettings(s) { localStorage.setItem(LS_SETTINGS, JSON.stringify(s)); }

function playTone(freq, type, dur, vol) {
  if (!soundOn || ctxA.state === 'suspended') return;
  const osc = ctxA.createOscillator(); const gain = ctxA.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, ctxA.currentTime);
  gain.gain.setValueAtTime(vol, ctxA.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctxA.currentTime + dur);
  osc.connect(gain); gain.connect(ctxA.destination);
  osc.start(); osc.stop(ctxA.currentTime + dur);
}
const sfx = {
  click: () => playTone(600, 'sine', 0.1, 0.1),
  win: () => { playTone(440, 'sine', 0.2, 0.2); setTimeout(()=>playTone(554, 'sine', 0.3, 0.2), 100); setTimeout(()=>playTone(659, 'sine', 0.4, 0.2), 200); },
  lose: () => { playTone(300, 'sawtooth', 0.2, 0.2); setTimeout(()=>playTone(250, 'sawtooth', 0.4, 0.2), 150); },
  tick: () => playTone(800, 'triangle', 0.05, 0.05),
  coin: () => playTone(1200, 'sine', 0.1, 0.1),
  boom: () => playTone(100, 'square', 0.4, 0.3)
};

/* ---------- key registry helpers ---------- */
function loadKeys() { try { return JSON.parse(localStorage.getItem(LS_KEYS)) || {}; } catch { return {}; } }
function saveKeys(k) { localStorage.setItem(LS_KEYS, JSON.stringify(k)); }
function genKeyString() {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${seg()}-${seg()}-${seg()}`;
}

/* current player session */
let session = null;   // {key}
function currentKey() { return localStorage.getItem(LS_SESSION); }

/* ============================================================
   TOAST + EFFECTS
   ============================================================ */
function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  let ic = 'info';
  if(type==='ok') ic = 'check'; else if(type==='err') ic = 'x';
  t.innerHTML = `${ICONS[ic]} <span>${escapeHtml(msg)}</span>`;
  $('#toastWrap').appendChild(t);
  setTimeout(() => t.remove(), 2900);
}
function floatMoney(amount, x, y) {
  const el = document.createElement('div');
  el.className = 'float-money';
  el.style.left = x + 'px'; el.style.top = y + 'px';
  el.style.color = amount >= 0 ? '#34e29b' : '#ff5470';
  el.textContent = (amount >= 0 ? '+' : '') + fmt(amount);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
function spawnConfetti(n=50) {
  for(let i=0; i<n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = Math.random()*100 + 'vw';
    c.style.top = -20 + 'px';
    c.style.background = ['#7c3aed','#e0218a','#22d3ee','#34e29b','#f5b942'][rint(0,4)];
    c.style.animationDuration = (Math.random()*2 + 2) + 's';
    c.style.animationDelay = (Math.random()*0.5) + 's';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 4000);
  }
}

/* ripple on buttons */
document.addEventListener('click', e => {
  const b = e.target.closest('.ripple');
  if (!b) return;
  const r = document.createElement('span');
  r.className = 'rip';
  const rect = b.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - rect.left - size / 2) + 'px';
  r.style.top = (e.clientY - rect.top - size / 2) + 'px';
  b.appendChild(r);
  setTimeout(() => r.remove(), 600);
});

/* liquid fluid hover: tracks cursor inside elements with .liquid-hover */
document.addEventListener('mousemove', e => {
  const t = e.target.closest('.liquid-hover');
  if (!t) return;
  const rect = t.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  t.style.setProperty('--mx', `${(x / rect.width)*100}%`);
  t.style.setProperty('--my', `${(y / rect.height)*100}%`);
});

/* ============================================================
   FLUID CANVAS — drifting liquid particles
   ============================================================ */
(function fluid() {
  const cv = $('#fluidCanvas'); const ctx = cv.getContext('2d');
  let w, h, parts = [];
  const COLORS = ['#7c3aed', '#e0218a', '#22d3ee', '#2dd4bf', '#f5b942'];
  function resize() { w = cv.width = innerWidth; h = cv.height = innerHeight; }
  function init() {
    parts = [];
    const n = Math.min(48, Math.floor(innerWidth / 26));
    for (let i = 0; i < n; i++) parts.push({
      x: Math.random() * w, y: Math.random() * h,
      r: 30 + Math.random() * 90,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      c: COLORS[i % COLORS.length]
    });
  }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -120) p.x = w + 120; if (p.x > w + 120) p.x = -120;
      if (p.y < -120) p.y = h + 120; if (p.y > h + 120) p.y = -120;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, p.c + '55'); g.addColorStop(1, p.c + '00');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  addEventListener('resize', () => { resize(); init(); });
  resize(); init(); tick();
})();

/* ============================================================
   SCREEN ROUTER
   ============================================================ */
function show(screen) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $(screen).classList.add('active');
  window.scrollTo(0, 0);
}

/* ============================================================
   LOGIN
   ============================================================ */
$$('.tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.tab').forEach(t => t.classList.remove('active'));
  $$('.tab-panel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  $('#panel-' + tab.dataset.tab).classList.add('active');
}));

$('#keyLoginBtn').addEventListener('click', () => {
  const val = $('#keyInput').value.trim().toUpperCase();
  if (!val) return toast('Enter a license key', 'err');
  const keys = loadKeys();
  if (!keys[val]) return toast('Invalid license key', 'err');
  keys[val].lastLogin = Date.now();
  keys[val].used = true;
  saveKeys(keys);
  localStorage.setItem(LS_SESSION, val);
  sfx.click();
  enterCasino(val, true);
});
$('#keyInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#keyLoginBtn').click(); });

$('#adminLoginBtn').addEventListener('click', () => {
  if ($('#adminInput').value.trim() !== ADMIN_KEY) return toast('Wrong admin key', 'err');
  toast('Welcome, admin', 'ok');
  show('#adminScreen');
  renderKeys();
  consoleLine('Admin console ready. Type "help" for commands.', 'info');
});
$('#adminInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#adminLoginBtn').click(); });

$('#adminLogout').addEventListener('click', () => { show('#loginScreen'); });
$('#casinoLogout').addEventListener('click', () => {
  localStorage.removeItem(LS_SESSION); session = null; show('#loginScreen');
});

$('#soundToggle').addEventListener('click', () => {
  soundOn = !soundOn;
  saveSettings({ ...loadSettings(), sound: soundOn });
  if(soundOn) { ctxA.resume(); sfx.click(); }
  $('#soundToggle').innerHTML = soundOn ? ICONS['volume'] : ICONS['volume-x'];
});

/* ============================================================
   ADMIN — key management
   ============================================================ */
function createKey(balance, label, note) {
  const keys = loadKeys();
  let k; do { k = genKeyString(); } while (keys[k]);
  keys[k] = {
    balance: Math.max(0, Number(balance) || START_BALANCE),
    label: label || '', note: note || '',
    created: Date.now(), used: false, lastLogin: null,
    highScore: Math.max(0, Number(balance) || START_BALANCE),
    gamesPlayed: 0,
    seenIntro: false
  };
  saveKeys(keys);
  return k;
}

$('#genKeyBtn').addEventListener('click', () => {
  const k = createKey($('#genBalance').value, $('#genLabel').value.trim(), $('#genNote').value.trim());
  renderKeys();
  consoleLine(`Created key ${k} with ${fmt(loadKeys()[k].balance)}`, 'ok');
  toast('Key created: ' + k, 'ok');
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(k).catch(()=>{});
});

function renderKeys() {
  const keys = loadKeys();
  const body = $('#keysBody'); body.innerHTML = '';
  const entries = Object.entries(keys);
  $('#keyCount').textContent = entries.length + ' key' + (entries.length === 1 ? '' : 's');
  if (!entries.length) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-dim);padding:24px">No keys yet — generate one above.</td></tr>`;
    return;
  }
  for (const [k, d] of entries.sort((a, b) => b[1].created - a[1].created)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="key-mono">${k}</td>
      <td>${d.label ? escapeHtml(d.label) : '<span style="color:var(--text-dim)">—</span>'}</td>
      <td><b>${fmt(d.balance)}</b></td>
      <td><span class="status-dot status-${d.used ? 'used' : 'active'}">${d.used ? 'Used' : 'Active'}</span></td>
      <td style="color:var(--text-dim)">${new Date(d.created).toLocaleDateString()}</td>
      <td>
        <button class="mini-btn" data-act="copy" data-k="${k}">Copy</button>
        <button class="mini-btn" data-act="reset" data-k="${k}">Reset $</button>
        <button class="mini-btn del" data-act="del" data-k="${k}">Delete</button>
      </td>`;
    body.appendChild(tr);
  }
}

$('#keysBody').addEventListener('click', e => {
  const btn = e.target.closest('.mini-btn'); if (!btn) return;
  const k = btn.dataset.k, keys = loadKeys();
  if (btn.dataset.act === 'copy') { if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(k).catch(()=>{}); toast('Copied ' + k, 'ok'); }
  if (btn.dataset.act === 'reset') {
    const v = prompt('Set new balance for ' + k, '100');
    if (v !== null) { keys[k].balance = Math.max(0, Number(v) || 0); saveKeys(keys); renderKeys(); toast('Balance updated', 'ok'); }
  }
  if (btn.dataset.act === 'del') {
    if (confirm('Delete key ' + k + '?')) { delete keys[k]; saveKeys(keys); renderKeys(); toast('Key deleted', 'info'); }
  }
});

$('#wipeKeys').addEventListener('click', () => {
  if (confirm('Wipe ALL license keys? This cannot be undone.')) { saveKeys({}); renderKeys(); toast('All keys wiped', 'info'); }
});
$('#exportKeys').addEventListener('click', () => {
  const data = JSON.stringify(loadKeys(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'liquid_royale_keys.json'; a.click();
  toast('Exported keys', 'ok');
});

/* ============================================================
   ADMIN — command console
   ============================================================ */
function consoleLine(txt, cls = '') {
  const out = $('#consoleOut');
  const div = document.createElement('div');
  div.className = 'c-line ' + (cls ? 'c-' + cls : '');
  div.textContent = txt;
  out.appendChild(div); out.scrollTop = out.scrollHeight;
}
const COMMANDS = {
  help() {
    consoleLine('Available commands:', 'info');
    [
      'help                       — show this list',
      'create [balance] [label]   — generate a new key',
      'list                       — list all keys',
      'setbal <KEY> <amount>      — set a key\'s balance',
      'addbal <KEY> <amount>      — add to a key\'s balance',
      'find <KEY>                 — show one key\'s details',
      'delete <KEY>               — remove a key',
      'rename <KEY> <label>       — set a key label',
      'resetall <amount>          — set every key to amount',
      'wipe                       — delete all keys',
      'stats                      — registry summary',
      'clear                      — clear console',
    ].forEach(l => consoleLine('  ' + l));
  },
  create(args) {
    const bal = args[0] || 100;
    const label = args.slice(1).join(' ');
    const k = createKey(bal, label, '');
    consoleLine(`✔ Created ${k} (${fmt(loadKeys()[k].balance)})`, 'ok'); renderKeys();
  },
  list() {
    const keys = loadKeys(); const e = Object.entries(keys);
    if (!e.length) return consoleLine('No keys.', 'err');
    e.forEach(([k, d]) => consoleLine(`${k}  ${fmt(d.balance).padStart(10)}  ${d.label || ''}`));
  },
  setbal(a) {
    const keys = loadKeys(); const k = (a[0] || '').toUpperCase();
    if (!keys[k]) return consoleLine('No such key', 'err');
    keys[k].balance = Math.max(0, Number(a[1]) || 0); saveKeys(keys); renderKeys();
    consoleLine(`✔ ${k} balance = ${fmt(keys[k].balance)}`, 'ok');
    if (currentKey() === k) syncBalanceFromStore();
  },
  addbal(a) {
    const keys = loadKeys(); const k = (a[0] || '').toUpperCase();
    if (!keys[k]) return consoleLine('No such key', 'err');
    keys[k].balance = Math.max(0, keys[k].balance + (Number(a[1]) || 0)); saveKeys(keys); renderKeys();
    consoleLine(`✔ ${k} balance = ${fmt(keys[k].balance)}`, 'ok');
    if (currentKey() === k) syncBalanceFromStore();
  },
  find(a) {
    const keys = loadKeys(); const k = (a[0] || '').toUpperCase();
    if (!keys[k]) return consoleLine('No such key', 'err');
    const d = keys[k];
    consoleLine(JSON.stringify({ key: k, ...d, created: new Date(d.created).toLocaleString() }, null, 2), 'info');
  },
  delete(a) {
    const keys = loadKeys(); const k = (a[0] || '').toUpperCase();
    if (!keys[k]) return consoleLine('No such key', 'err');
    delete keys[k]; saveKeys(keys); renderKeys(); consoleLine('✔ Deleted ' + k, 'ok');
  },
  rename(a) {
    const keys = loadKeys(); const k = (a[0] || '').toUpperCase();
    if (!keys[k]) return consoleLine('No such key', 'err');
    keys[k].label = a.slice(1).join(' '); saveKeys(keys); renderKeys();
    consoleLine(`✔ ${k} label = "${keys[k].label}"`, 'ok');
  },
  resetall(a) {
    const keys = loadKeys(); const v = Math.max(0, Number(a[0]) || 100);
    Object.keys(keys).forEach(k => keys[k].balance = v); saveKeys(keys); renderKeys();
    consoleLine(`✔ All keys reset to ${fmt(v)}`, 'ok');
  },
  wipe() { saveKeys({}); renderKeys(); consoleLine('✔ All keys wiped', 'ok'); },
  stats() {
    const keys = loadKeys(); const e = Object.entries(keys);
    const total = e.reduce((s, [, d]) => s + d.balance, 0);
    consoleLine(`Keys: ${e.length} | Used: ${e.filter(([, d]) => d.used).length} | Total balance: ${fmt(total)}`, 'info');
  },
  clear() { $('#consoleOut').innerHTML = ''; },
};
$('#consoleIn').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const raw = e.target.value.trim(); if (!raw) return;
  consoleLine('› ' + raw);
  e.target.value = '';
  const [cmd, ...args] = raw.split(/\s+/);
  const fn = COMMANDS[cmd.toLowerCase()];
  if (fn) { try { fn(args); } catch (err) { consoleLine('Error: ' + err.message, 'err'); } }
  else consoleLine(`Unknown command: ${cmd}. Type "help".`, 'err');
});

/* ============================================================
   CASINO — balance + session
   ============================================================ */
let balance = 0;
function syncBalanceFromStore() {
  const keys = loadKeys(); const k = currentKey();
  if (keys[k]) { balance = keys[k].balance; renderBalance(); }
}
function trackGamePlayed() {
  const keys = loadKeys(); const k = currentKey();
  if (keys[k]) { keys[k].gamesPlayed = (keys[k].gamesPlayed || 0) + 1; saveKeys(keys); }
}
function persistBalance() {
  const keys = loadKeys(); const k = currentKey();
  if (keys[k]) {
    keys[k].balance = balance;
    if (balance > (keys[k].highScore || 0)) keys[k].highScore = balance;
    saveKeys(keys);
  }
}
function renderBalance() {
  const el = $('#balanceVal');
  el.textContent = fmt(balance);
  el.parentElement.classList.remove('bal-flash'); void el.offsetWidth;
  el.parentElement.classList.add('bal-flash');
}
function changeBalance(delta) {
  balance = Math.max(0, balance + delta);
  persistBalance(); renderBalance();
}

function enterCasino(key, fromLoginBtn) {
  session = { key };
  const keys = loadKeys();
  balance = keys[key].balance;
  const L = keys[key].label;
  $('#playerTag').innerHTML = (L ? ICONS['user'] + ' ' + escapeHtml(L) : ICONS['key'] + ' ' + escapeHtml(key));
  $('#soundToggle').innerHTML = soundOn ? ICONS['volume'] : ICONS['volume-x'];
  show('#casinoScreen');
  goHub();
  renderBalance();
  
  if (!keys[key].seenIntro) {
    keys[key].seenIntro = true;
    saveKeys(keys);
    $('#introBalance').textContent = fmt(keys[key].balance);
    showIntro();
    if (soundOn) ctxA.resume();
  }
}

function renderLeaderboard() {
  const keys = loadKeys();
  const entries = Object.entries(keys).filter(e => e[1].used).sort((a,b) => (b[1].highScore||0) - (a[1].highScore||0)).slice(0, 10);
  const lb = $('#leaderboard');
  if(!entries.length) { lb.innerHTML = ''; return; }
  let html = `<div class="lb-head">${ICONS['trophy']} Top High Scores</div>`;
  entries.forEach(([k,d], i) => {
    const isMe = k === currentKey();
    const cls = i===0 ? 'r1' : i===1 ? 'r2' : i===2 ? 'r3' : '';
    html += `<div class="lb-row ${isMe?'me':''}">
      <div class="lb-rank ${cls}">${i+1}</div>
      <div class="lb-name">${escapeHtml(d.label || k)} ${isMe?' (You)':''}</div>
      <div class="lb-score">${fmt(d.highScore||0)}</div>
    </div>`;
  });
  lb.innerHTML = html;
}

function renderStatsStrip() {
  const k = loadKeys()[currentKey()] || {};
  $('#statsStrip').innerHTML = `
    <div class="stat-box"><div class="sb-label">${ICONS['wallet']} Balance</div><div class="sb-val">${fmt(balance)}</div></div>
    <div class="stat-box"><div class="sb-label">${ICONS['trending-up']} High Score</div><div class="sb-val" style="color:var(--c-cyan)">${fmt(k.highScore||0)}</div></div>
    <div class="stat-box"><div class="sb-label">${ICONS['hash']} Games Played</div><div class="sb-val" style="color:var(--text-dim)">${k.gamesPlayed||0}</div></div>
  `;
}

/* intro / announcement modal */
function showIntro() { $('#introModal').classList.add('show'); spawnConfetti(80); }
$('#introClose').addEventListener('click', () => $('#introModal').classList.remove('show'));

/* hub navigation */
function goHub() {
  $('#gameHub').style.display = 'block';
  $('#gameStage').classList.remove('active');
  $('#gameMount').innerHTML = '';
  renderLeaderboard();
  renderStatsStrip();
}
$('#backToHub').addEventListener('click', goHub);
$$('.game-card').forEach(c => c.addEventListener('click', () => { sfx.click(); openGame(c.dataset.game); }));

function openGame(name) {
  $('#gameHub').style.display = 'none';
  $('#gameStage').classList.add('active');
  const mount = $('#gameMount'); mount.innerHTML = '';
  GAMES[name](mount);
}

/* shared bet-control builder */
function betControls(mount, { title, ic, sub, extra = '', actionLabel = 'Bet', onAction }) {
  mount.innerHTML = `
    <div class="game-shell">
      <div class="controls glass">
        <div class="game-title">${ICONS[ic]} ${title}</div>
        <div class="game-sub">${sub}</div>
        <label class="field-label">Bet amount</label>
        <div class="bet-row"><input id="betAmt" class="input liquid-input" type="number" value="1" min="0.01" step="0.5"></div>
        <div class="chip-btns">
          <button class="chip ripple" data-c="1">$1</button>
          <button class="chip ripple" data-c="5">$5</button>
          <button class="chip ripple" data-c="25">$25</button>
          <button class="chip ripple" data-c="half">&frac12;</button>
          <button class="chip ripple" data-c="max">Max</button>
        </div>
        ${extra}
        <button id="actionBtn" class="btn btn-green block liquid-hover ripple" style="margin-top:10px">${actionLabel}</button>
        <div class="stat-row"><span>Balance</span><b id="ctrlBal">${fmt(balance)}</b></div>
      </div>
      <div class="playfield glass" id="playfield"></div>
    </div>`;
  const betInput = $('#betAmt');
  $$('.chip', mount).forEach(ch => ch.addEventListener('click', () => {
    sfx.click();
    const c = ch.dataset.c;
    if (c === 'half') betInput.value = (balance / 2).toFixed(2);
    else if (c === 'max') betInput.value = balance.toFixed(2);
    else betInput.value = c;
  }));
  // DONT attach click directly if the game is going to override it (like Mines/Crash do)
  // Instead, expose the button so the game can bind its state machine
  const refresh = () => { const e = $('#ctrlBal'); if (e) e.textContent = fmt(balance); };
  return { betInput, refreshBal: refresh, action: $('#actionBtn') };
}
function getBet() { const b = Number($('#betAmt').value); return isNaN(b) ? 0 : b; }
function settle(amount, label) {
  changeBalance(amount);
  $('#ctrlBal') && ($('#ctrlBal').textContent = fmt(balance));
  if (amount >= 0) { sfx.win(); toast(`${label} +${fmt(amount)}`, 'ok'); }
  else { sfx.lose(); toast(`${label} ${fmt(amount)}`, 'err'); }
}

/* ============================================================
   GAMES
   ============================================================ */
const GAMES = {};

/* ---------- MINES ---------- */
GAMES.mines = function (mount) {
  let active = false, bet = 0, mineSet = new Set(), revealed = 0, mult = 1, mineCount = 3;
  const ui = betControls(mount, {
    title: 'Mines', ic: 'bomb', sub: 'Pick gems, avoid the bombs. Cash out anytime.',
    extra: `<label class="field-label">Mines</label>
            <div class="opt-row" id="mineOpts">
              <div class="opt sel" data-m="1">1</div><div class="opt" data-m="3">3</div>
              <div class="opt" data-m="5">5</div><div class="opt" data-m="10">10</div><div class="opt" data-m="24">24</div>
            </div>`
  });
  
  $$('#mineOpts .opt').forEach(o => o.addEventListener('click', () => {
    if(active) return;
    sfx.click();
    $$('#mineOpts .opt').forEach(x => x.classList.remove('sel')); o.classList.add('sel');
    mineCount = Number(o.dataset.m);
  }));

  const pf = $('#playfield');
  function setupBtn() {
    ui.action.textContent = 'Start game';
    ui.action.className = 'btn btn-green block liquid-hover ripple';
    ui.action.onclick = () => {
      sfx.click();
      bet = getBet();
      if (bet > 0 && bet <= balance) startRound(); else toast('Set a valid bet','err');
    };
  }
  setupBtn();
  
  function startRound() {
    changeBalance(-bet); ui.refreshBal(); trackGamePlayed();
    active = true; revealed = 0; mult = 1; mineSet = new Set();
    while (mineSet.size < mineCount) mineSet.add(rint(0, 24));
    ui.action.textContent = 'Cash out ' + fmt(0);
    ui.action.className = 'btn btn-gold block liquid-hover ripple';
    ui.action.onclick = cashOut;
    drawGrid();
  }
  function drawGrid(reveal = false) {
    pf.innerHTML = `<div class="game-title" style="margin-bottom:14px">Multiplier: <span class="win">${mult.toFixed(2)}&times;</span></div><div class="mines-grid"></div>`;
    const grid = $('.mines-grid', pf);
    for (let i = 0; i < 25; i++) {
      const cell = document.createElement('div');
      cell.className = 'mine-cell';
      cell.innerHTML = '<div class="water"></div>'; // liquid fill base
      if (reveal) {
        cell.classList.add('revealed');
        if (mineSet.has(i)) {
          cell.classList.add('bomb');
          cell.innerHTML += ICONS['bomb'];
          $('.water', cell).style.height = '100%';
        } else {
          cell.innerHTML += ICONS['diamond'];
          cell.classList.add('gem');
          $('.water', cell).style.height = '100%';
        }
      } else {
        cell.addEventListener('click', () => pick(i, cell));
      }
      grid.appendChild(cell);
    }
  }
  function pick(i, cell) {
    if (!active || cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');
    if (mineSet.has(i)) {
      sfx.boom();
      cell.classList.add('bomb'); cell.innerHTML += ICONS['bomb'];
      $('.water', cell).style.height = '100%';
      active = false;
      drawGrid(true);
      setupBtn();
      toast('Boom! Lost ' + fmt(bet), 'err');
      return;
    }
    sfx.coin();
    cell.classList.add('gem'); cell.innerHTML += ICONS['diamond'];
    $('.water', cell).style.height = '100%'; // trigger water fill
    revealed++;
    const safe = 25 - mineCount;
    mult = +(Math.pow(25 / (25 - mineCount), revealed) * 0.95).toFixed(2);
    $('.win', pf).textContent = mult.toFixed(2) + '&times;';
    ui.action.textContent = 'Cash out ' + fmt(bet * mult);
    if (revealed === safe) cashOut();
  }
  function cashOut() {
    if (!active) return;
    active = false;
    const win = bet * mult;
    settle(win, 'Mines cashout');
    drawGrid(true);
    setupBtn();
  }
  pf.innerHTML = `<div class="game-sub">Set your bet & mines, then press Start.</div>`;
};

/* ---------- DICE ---------- */
GAMES.dice = function (mount) {
  let target = 50, over = true;
  const ui = betControls(mount, {
    title: 'Dice', ic: 'dice', sub: 'Predict if the roll is over/under your number.',
    extra: `<label class="field-label">Roll <span id="overunder" style="color:var(--c-cyan);cursor:pointer;user-select:none">OVER &#9650;</span> <b id="targetLbl">50.00</b></label>
            <input id="targetRange" type="range" min="2" max="98" value="50" style="width:100%;margin:10px 0">
            <div class="stat-row"><span>Win chance</span><b id="winChance">50%</b></div>
            <div class="stat-row"><span>Payout</span><b id="payoutMult">1.98&times;</b></div>`
  });
  ui.action.textContent = 'Roll dice';
  ui.action.onclick = () => { sfx.click(); const b = getBet(); if(b>0 && b<=balance) roll(b); else toast('Invalid bet','err'); };
  
  const pf = $('#playfield');
  pf.innerHTML = `
    <div class="dice-track">
      <div class="dice-marker" id="diceMarker" style="left:50%">50</div>
      <div class="dice-result" id="diceResult" style="left:50%"></div>
    </div>
    <div class="payout-big" id="diceOut" style="font-size:30px;color:var(--text-dim)">Roll to play</div>
    <div class="recent" id="diceRec"></div>`;
  function recalc() {
    const chance = over ? (100 - target) : target;
    const m = +(0.99 * 100 / chance).toFixed(2);
    $('#winChance').textContent = chance.toFixed(0) + '%';
    $('#payoutMult').textContent = m + '&times;';
    $('#targetLbl').textContent = target.toFixed(2);
    $('#diceMarker').style.left = target + '%';
    $('#diceMarker').textContent = target;
    return m;
  }
  $('#targetRange').addEventListener('input', e => { target = +e.target.value; recalc(); });
  $('#overunder').addEventListener('click', () => {
    sfx.click(); over = !over; $('#overunder').innerHTML = over ? 'OVER &#9650;' : 'UNDER &#9660;'; recalc();
  });
  recalc();
  function roll(bet) {
    changeBalance(-bet); ui.refreshBal(); trackGamePlayed();
    const result = +(Math.random() * 100).toFixed(2);
    $('#diceResult').style.left = result + '%';
    const won = over ? result > target : result < target;
    const m = recalc();
    setTimeout(() => {
      const out = $('#diceOut');
      const rec = $('#diceRec');
      if (won) { const w = bet * m; settle(w, 'Dice win'); out.className = 'payout-big win'; out.textContent = result; rec.insertAdjacentHTML('afterbegin',`<div class="rchip w">${result}</div>`); }
      else { out.className = 'payout-big lose'; out.textContent = result; toast('Dice lost ' + fmt(bet), 'err'); rec.insertAdjacentHTML('afterbegin',`<div class="rchip l">${result}</div>`); }
      if(rec.children.length > 8) rec.lastChild.remove();
    }, 650);
  }
};

/* ---------- PLINKO ---------- */
GAMES.plinko = function (mount) {
  let risk = 'med', rows = 12;
  const ui = betControls(mount, {
    title: 'Plinko', ic: 'plinko', sub: 'Drop the ball through the pegs into a multiplier.',
    extra: `<label class="field-label">Risk level</label>
            <div class="opt-row" id="plRisk">
              <div class="opt" data-r="low">Low</div>
              <div class="opt sel" data-r="med">Med</div>
              <div class="opt" data-r="high">High</div>
            </div>`
  });
  $$('#plRisk .opt').forEach(o => o.addEventListener('click', () => { sfx.click(); $$('#plRisk .opt').forEach(x=>x.classList.remove('sel')); o.classList.add('sel'); risk=o.dataset.r; genPegs(); }));
  ui.action.textContent = 'Drop ball';
  ui.action.onclick = () => { sfx.click(); const b=getBet(); if(b>0 && b<=balance) drop(b); else toast('Invalid bet','err'); };
  
  const pf = $('#playfield');
  const W = 360, H = 400;
  pf.innerHTML = `<canvas id="plinkoCv" class="game-canvas" width="${W}" height="${H}"></canvas>
    <div class="recent" id="plRec"></div>`;
  const cv = $('#plinkoCv'), ctx = cv.getContext('2d');
  
  // Real physics approach: bodies with x,y,vx,vy
  const radius = 5;
  const pegRadius = 3;
  let pegs = [];
  let slots = []; // {x, w, mult, color}
  let balls = []; // active drops
  
  // Generate geometry
  function genPegs() {
    pegs = [];
    const topY = 40;
    const gapX = 26;
    const gapY = 24;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= r + 2; c++) {
        const count = r + 3;
        const x = W / 2 + (c - (count - 1) / 2) * gapX;
        pegs.push({ x, y: topY + r * gapY });
      }
    }
    // define mults based on risk
    let mults = [];
    if(risk==='low') mults = [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6];
    if(risk==='med') mults = [16, 9, 4, 2, 0.6, 0.4, 0.6, 2, 4, 9, 16];
    if(risk==='high') mults = [64, 24, 7, 2, 0.2, 0, 0.2, 2, 7, 24, 64];
    
    slots = [];
    const n = mults.length;
    const sw = W / n;
    const COLORS = ['#ff5470','#ff7a3d','#f5b942','#34e29b','#2dd4bf','#22d3ee','#7c3aed'];
    for(let i=0; i<n; i++) {
      const dist = Math.abs(i - Math.floor(n/2)); // distance from center
      const cIdx = Math.min(COLORS.length-1, dist);
      slots.push({ x: i*sw, w: sw, mult: mults[i], c: COLORS[cIdx] });
    }
  }
  genPegs();
  
  function drawEngine() {
    ctx.clearRect(0,0,W,H);
    // draw pegs
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    for(const p of pegs) { ctx.beginPath(); ctx.arc(p.x, p.y, pegRadius, 0, 7); ctx.fill(); }
    // draw slots
    for(const s of slots) {
      ctx.fillStyle = s.c + 'cc';
      ctx.fillRect(s.x + 2, H - 32, s.w - 4, 28);
      ctx.fillStyle = '#04121a'; ctx.font = 'bold 10px Inter'; ctx.textAlign = 'center';
      ctx.fillText(s.mult + '×', s.x + s.w/2, H - 14);
    }
    // draw balls
    for(const b of balls) {
      ctx.fillStyle = '#fff'; ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(b.x, b.y, radius, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    
    // physics step
    for(let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      b.vy += 0.2; // gravity
      b.x += b.vx; b.y += b.vy;
      
      // peg collisions
      for(const p of pegs) {
        const dx = b.x - p.x, dy = b.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const minDist = radius + pegRadius;
        if (dist < minDist) {
          sfx.tick();
          // resolve penetration
          const nx = dx/dist, ny = dy/dist;
          const pDep = minDist - dist;
          b.x += nx * pDep; b.y += ny * pDep;
          // bounce
          const dot = b.vx*nx + b.vy*ny;
          const bounce = 0.6; // bounciness
          b.vx -= (1 + bounce) * dot * nx;
          b.vy -= (1 + bounce) * dot * ny;
          // add random chaos to prevent stacking
          b.vx += (Math.random()-0.5)*0.8;
        }
      }
      // wall bounds
      if(b.x < radius) { b.x = radius; b.vx *= -0.5; }
      if(b.x > W-radius) { b.x = W-radius; b.vx *= -0.5; }
      
      // slot collision (bottom)
      if(b.y > H - 32) {
        let hitIdx = Math.floor(b.x / (W/slots.length));
        hitIdx = Math.max(0, Math.min(slots.length-1, hitIdx));
        finishBall(b, slots[hitIdx]);
        balls.splice(i, 1);
      }
    }
    if(balls.length > 0 || lastDraw) requestAnimationFrame(drawEngine);
  }
  let lastDraw = true; requestAnimationFrame(drawEngine);
  
  function finishBall(b, slot) {
    const win = b.bet * slot.mult;
    settle(win - 0, win >= b.bet ? 'Plinko' : 'Plinko');
    const rec = $('#plRec');
    rec.insertAdjacentHTML('afterbegin',`<div class="rchip ${win>=b.bet?'w':'l'}">${slot.mult}&times;</div>`);
    if(rec.children.length > 8) rec.lastChild.remove();
  }
  
  function drop(bet) {
    changeBalance(-bet); ui.refreshBal(); trackGamePlayed();
    balls.push({ x: W/2 + (Math.random()-0.5)*10, y: -10, vx: (Math.random()-0.5), vy: 0, bet });
    if(balls.length === 1) requestAnimationFrame(drawEngine);
  }
};

/* ---------- CRASH ---------- */
GAMES.crash = function (mount) {
  let inRound = false, cashed = false, bet = 0, crashAt = 0, mult = 1, raf;
  const ui = betControls(mount, {
    title: 'Crash', ic: 'rocket', sub: 'Cash out before the rocket crashes!'
  });
  
  function setupBtn() {
    ui.action.textContent = 'Launch';
    ui.action.className = 'btn btn-primary block liquid-hover ripple';
    ui.action.onclick = () => { sfx.click(); bet = getBet(); if (bet > 0 && bet <= balance) launch(); else toast('Set a valid bet', 'err'); };
  }
  setupBtn();
  
  const pf = $('#playfield');
  const W = 380, H = 300;
  pf.innerHTML = `<div class="crash-multi" id="crashMulti" style="color:var(--c-cyan)">1.00&times;</div>
    <canvas id="crashCv" class="game-canvas" width="${W}" height="${H}" style="position:relative;z-index:1"></canvas>
    <div class="recent" id="crashRec"></div>`;
  const cv = $('#crashCv'), ctx = cv.getContext('2d');
  
  function bg() {
    ctx.clearRect(0,0,W,H); ctx.strokeStyle='rgba(255,255,255,.07)';
    for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,i*H/6);ctx.lineTo(W,i*H/6);ctx.stroke();}
  }
  bg();
  
  function launch() {
    changeBalance(-bet); ui.refreshBal(); trackGamePlayed();
    inRound = true; cashed = false; mult = 1;
    $('#crashMulti').className = 'crash-multi'; $('#crashMulti').style.color = 'var(--c-cyan)';
    
    // crash point distribution (house edge ~3%)
    crashAt = +(Math.max(1, 0.99 / (1 - Math.random()) )).toFixed(2);
    if (Math.random() < 0.03) crashAt = 1.00; // instant crash chance
    
    ui.action.textContent = 'Cash out 1.00×';
    ui.action.className = 'btn btn-gold block liquid-hover ripple';
    ui.action.onclick = cashOut;
    
    const t0 = performance.now();
    const pts = [];
    function frame(t) {
      const dt = (t - t0) / 1000;
      mult = +(Math.pow(1.0718, dt * 8)).toFixed(2);
      const cm = $('#crashMulti');
      cm.innerHTML = mult.toFixed(2) + '&times;';
      // draw curve
      bg();
      pts.push({ x: Math.min(W, dt * 70), y: H - Math.min(H - 20, (mult - 1) * 55) });
      ctx.strokeStyle = '#34e29b'; ctx.lineWidth = 3; ctx.beginPath();
      pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
      const last = pts[pts.length - 1];
      // Draw rocket SVG on canvas
      const p = new Path2D("M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l3.3-3.3a16 16 0 0 0 6-10.6a16 16 0 0 0-10.6 6L7.4 10.4M9 11l4 4");
      ctx.save(); ctx.translate(last.x, last.y-14); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke(p); ctx.restore();
      
      if (mult >= crashAt) return crash();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }
  function cashOut() {
    if (!inRound || cashed) return;
    sfx.click();
    cashed = true; cancelAnimationFrame(raf); inRound = false;
    const win = bet * mult;
    settle(win, 'Crash @' + mult.toFixed(2) + '×');
    $('#crashMulti').className = 'crash-multi win shake-x'; $('#crashMulti').style.color = '';
    logRec(mult, true);
    setupBtn();
  }
  function crash() {
    cancelAnimationFrame(raf); inRound = false;
    $('#crashMulti').innerHTML = 'CRASHED<br><span style="font-size:24px">@' + crashAt.toFixed(2) + '&times;</span>';
    $('#crashMulti').className = 'crash-multi lose shake-x'; $('#crashMulti').style.color = '';
    ctx.fillStyle = 'rgba(255,84,112,.15)'; ctx.fillRect(0,0,W,H);
    if (!cashed) { toast('Crashed! Lost ' + fmt(bet), 'err'); logRec(crashAt, false); sfx.boom(); }
    setupBtn();
  }
  function logRec(m, won) {
    const rec = $('#crashRec');
    rec.insertAdjacentHTML('afterbegin',`<div class="rchip ${won?'w':'l'}">${m.toFixed(2)}&times;</div>`);
    if(rec.children.length > 8) rec.lastChild.remove();
  }
};

/* ---------- COIN FLIP ---------- */
GAMES.coinflip = function (mount) {
  let choice = 'h';
  const ui = betControls(mount, {
    title: 'Coin Flip', ic: 'coin', sub: 'Heads or tails — double or nothing.',
    extra: `<label class="field-label">Your pick</label>
      <div class="bet-row">
        <button class="chip liquid-hover" id="pickH" style="border-color:var(--c-gold)">Heads</button>
        <button class="chip liquid-hover" id="pickT">Tails</button>
      </div>
      <div class="stat-row"><span>Payout</span><b>1.98&times;</b></div>`
  });
  ui.action.textContent = 'Flip coin';
  ui.action.onclick = () => { sfx.click(); const b = getBet(); if(b>0 && b<=balance) flip(b); else toast('Invalid bet','err'); };
  
  $('#pickH').onclick = () => { sfx.click(); choice = 'h'; $('#pickH').style.borderColor = 'var(--c-gold)'; $('#pickT').style.borderColor = ''; };
  $('#pickT').onclick = () => { sfx.click(); choice = 't'; $('#pickT').style.borderColor = 'var(--c-cyan)'; $('#pickH').style.borderColor = ''; };
  const pf = $('#playfield');
  pf.innerHTML = `<div class="coin" id="coin">
      <div class="coin-face coin-h">${ICONS['user']}</div><div class="coin-face coin-t">${ICONS['target']}</div>
    </div><div class="payout-big" id="coinOut" style="font-size:24px;color:var(--text-dim);margin-top:24px">Pick & flip</div>`;
  let busy = false;
  function flip(bet) {
    if (busy) return; busy = true;
    changeBalance(-bet); ui.refreshBal(); trackGamePlayed();
    const res = Math.random() < 0.5 ? 'h' : 't';
    const coin = $('#coin');
    const spins = 5 + rint(0, 3);
    const end = res === 'h' ? 0 : 180;
    coin.style.transition = 'transform 1.5s cubic-bezier(.2,.8,.2,1)';
    coin.style.transform = `rotateY(${spins * 360 + end}deg)`;
    setTimeout(() => {
      const out = $('#coinOut');
      if (res === choice) { const w = bet * 1.98; settle(w, 'Coin win'); out.className = 'payout-big win'; out.innerHTML = (res === 'h' ? 'Heads' : 'Tails') + ' <span class="res-ic">' + ICONS['check'] + '</span>'; }
      else { out.className = 'payout-big lose'; out.innerHTML = (res === 'h' ? 'Heads' : 'Tails') + ' <span class="res-ic">' + ICONS['x'] + '</span>'; toast('Lost ' + fmt(bet), 'err'); }
      coin.style.transition = 'none';
      busy = false;
    }, 1550);
  }
};

/* ---------- LIMBO ---------- */
GAMES.limbo = function (mount) {
  let target = 2;
  const ui = betControls(mount, {
    title: 'Limbo', ic: 'limbo', sub: 'Set a target multiplier. Win if the result beats it.',
    extra: `<label class="field-label">Target multiplier</label>
      <input id="limboTarget" class="input liquid-input" type="number" value="2" min="1.01" step="0.1">
      <div class="stat-row"><span>Win chance</span><b id="limboChance">49.5%</b></div>`
  });
  ui.action.textContent = 'Play';
  ui.action.onclick = () => { sfx.click(); const b = getBet(); if(b>0 && b<=balance) play(b); else toast('Invalid bet','err'); };
  
  const pf = $('#playfield');
  pf.innerHTML = `<div class="payout-big" id="limboOut" style="color:var(--text-dim);font-size:64px">1.00&times;</div><div class="recent" id="limboRec"></div>`;
  function recalc() { target = Math.max(1.01, Number($('#limboTarget').value) || 2); $('#limboChance').textContent = (99 / target).toFixed(2) + '%'; }
  $('#limboTarget').addEventListener('input', recalc); recalc();
  
  let busy = false;
  function play(bet) {
    if(busy) return; busy=true;
    changeBalance(-bet); ui.refreshBal(); trackGamePlayed();
    const result = +(0.99 / (1 - Math.random())).toFixed(2);
    const out = $('#limboOut');
    let i = 1; const tick = setInterval(() => {
      i += Math.max(0.05, result / 18);
      out.innerHTML = Math.min(i, result).toFixed(2) + '&times;';
      if (i >= result) {
        clearInterval(tick);
        const rec = $('#limboRec');
        if (result >= target) { const w = bet * target; settle(w, 'Limbo win'); out.className = 'payout-big win'; rec.insertAdjacentHTML('afterbegin',`<div class="rchip w">${result.toFixed(2)}&times;</div>`); }
        else { out.className = 'payout-big lose'; toast('Limbo lost ' + fmt(bet), 'err'); rec.insertAdjacentHTML('afterbegin',`<div class="rchip l">${result.toFixed(2)}&times;</div>`); }
        if(rec.children.length > 8) rec.lastChild.remove();
        setTimeout(() => { out.className = 'payout-big'; busy=false; }, 500);
      }
    }, 40);
  }
};

/* ---------- WHEEL ---------- */
GAMES.wheel = function (mount) {
  const ui = betControls(mount, {
    title: 'Wheel', ic: 'wheel', sub: 'Spin the wheel of fortune.'
  });
  ui.action.textContent = 'Spin';
  ui.action.onclick = () => { sfx.click(); const b = getBet(); if(b>0 && b<=balance) spin(b); else toast('Invalid bet','err'); };
  
  const pf = $('#playfield');
  const segs = [
    { m: 0, c: '#3a2f5f' }, { m: 1.5, c: '#22d3ee' }, { m: 0, c: '#3a2f5f' }, { m: 2, c: '#34e29b' },
    { m: 0, c: '#3a2f5f' }, { m: 1.5, c: '#22d3ee' }, { m: 0, c: '#3a2f5f' }, { m: 3, c: '#f5b942' },
    { m: 0, c: '#3a2f5f' }, { m: 1.5, c: '#22d3ee' }, { m: 0, c: '#3a2f5f' }, { m: 2, c: '#34e29b' },
    { m: 0, c: '#3a2f5f' }, { m: 1.5, c: '#22d3ee' }, { m: 0, c: '#3a2f5f' }, { m: 5, c: '#e0218a' },
  ];
  pf.innerHTML = `<div class="wheel-wrap"><div class="wheel-pointer"></div>
    <canvas id="wheelCv" class="wheel-canvas" width="280" height="280"></canvas></div>
    <div class="payout-big" id="wheelOut" style="font-size:24px;color:var(--text-dim);margin-top:14px">Spin to play</div>`;
  const cv = $('#wheelCv'), ctx = cv.getContext('2d');
  const N = segs.length, R = 140, cx = 140, cy = 140;
  function draw() {
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath();
      ctx.fillStyle = segs[i].c; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate((a0 + a1) / 2); ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Inter'; ctx.textAlign = 'right';
      ctx.fillText(segs[i].m ? segs[i].m + '×' : 'X', R - 12, 4); ctx.restore();
    }
  }
  draw();
  let busy = false, rot = 0;
  function spin(bet) {
    if (busy) return; busy = true;
    changeBalance(-bet); ui.refreshBal(); trackGamePlayed();
    const idx = rint(0, N - 1);
    const segAngle = 360 / N;
    const final = 360 * 6 + (360 - (idx * segAngle + segAngle / 2));
    rot += final;
    cv.style.transform = `rotate(${rot}deg)`;
    setTimeout(() => {
      const m = segs[idx].m; const out = $('#wheelOut');
      if (m > 0) { const w = bet * m; settle(w, 'Wheel ' + m + '×'); out.className = 'payout-big win'; out.innerHTML = m + '&times; <span class="res-ic">' + ICONS['check'] + '</span>'; }
      else { out.className = 'payout-big lose'; out.innerHTML = '<span class="res-ic">' + ICONS['x'] + '</span> no win'; toast('Wheel lost ' + fmt(bet), 'err'); }
      busy = false;
    }, 4600);
  }
};

/* ---------- ROULETTE ---------- */
GAMES.roulette = function (mount) {
  const REDS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  let betType = 'red';
  const ui = betControls(mount, {
    title: 'Roulette', ic: 'target', sub: 'Bet on color, parity, or a dozen.'
  });
  ui.action.textContent = 'Spin';
  ui.action.onclick = () => { sfx.click(); const b = getBet(); if(b>0 && b<=balance) spin(b); else toast('Invalid bet','err'); };
  
  const pf = $('#playfield');
  pf.innerHTML = `
    <div class="payout-big" id="roulOut" style="font-size:48px;transition:.2s">&mdash;</div>
    <div class="roul-grid">
      <div class="roul-bet roul-red sel liquid-hover" data-t="red">Red 2&times;</div>
      <div class="roul-bet roul-black liquid-hover" data-t="black">Black 2&times;</div>
      <div class="roul-bet roul-green liquid-hover" data-t="green">0 (35&times;)</div>
      <div class="roul-bet liquid-hover" data-t="even">Even 2&times;</div>
      <div class="roul-bet liquid-hover" data-t="odd">Odd 2&times;</div>
      <div class="roul-bet liquid-hover" data-t="low">1-18 2&times;</div>
      <div class="roul-bet liquid-hover" data-t="high">19-36 2&times;</div>
      <div class="roul-bet liquid-hover" data-t="d1">1st 12 (3&times;)</div>
      <div class="roul-bet liquid-hover" data-t="d2">2nd 12 (3&times;)</div>
      <div class="roul-bet liquid-hover" data-t="d3">3rd 12 (3&times;)</div>
    </div>`;
  $$('.roul-bet', pf).forEach(b => b.addEventListener('click', () => {
    sfx.click(); $$('.roul-bet', pf).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); betType = b.dataset.t;
  }));
  function colorOf(n){ return n===0?'green':REDS.has(n)?'red':'black'; }
  let busy = false;
  function spin(bet) {
    if (busy) return; busy = true;
    changeBalance(-bet); ui.refreshBal(); trackGamePlayed();
    const out = $('#roulOut'); let spins = 0;
    out.style.transform = 'scale(1.2)';
    const iv = setInterval(() => {
      sfx.tick();
      const n = rint(0, 36); out.textContent = n; out.style.color = colorOf(n) === 'red' ? '#ff5470' : colorOf(n) === 'green' ? '#34e29b' : '#fff';
      if (++spins > 18) { clearInterval(iv); resolve(); }
    }, 70);
    function resolve() {
      const n = rint(0, 36), col = colorOf(n);
      out.style.transform = 'scale(1)';
      out.textContent = n; out.style.color = col === 'red' ? '#ff5470' : col === 'green' ? '#34e29b' : '#fff';
      let mult = 0;
      if (betType === 'red' && col === 'red') mult = 2;
      else if (betType === 'black' && col === 'black') mult = 2;
      else if (betType === 'green' && n === 0) mult = 35;
      else if (betType === 'even' && n !== 0 && n % 2 === 0) mult = 2;
      else if (betType === 'odd' && n % 2 === 1) mult = 2;
      else if (betType === 'low' && n >= 1 && n <= 18) mult = 2;
      else if (betType === 'high' && n >= 19 && n <= 36) mult = 2;
      else if (betType === 'd1' && n >= 1 && n <= 12) mult = 3;
      else if (betType === 'd2' && n >= 13 && n <= 24) mult = 3;
      else if (betType === 'd3' && n >= 25 && n <= 36) mult = 3;
      if (mult > 0) settle(bet * mult, `Roulette ${n}`);
      else toast(`Roulette ${n} — lost ${fmt(bet)}`, 'err');
      busy = false;
    }
  }
};

/* ============================================================
   BOOT
   ============================================================ */
(function boot() {
  injectIcons();
  show('#loginScreen');
  // auto-resume an active license session if balance key still exists
  const k = currentKey();
  if (k && loadKeys()[k]) {
    // Automatically sign in instead of just prefilling the input
    enterCasino(k, false);
  }
})();
