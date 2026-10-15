// イキテミタ: 画面の流れ（ホーム → スマホに吸いこまれる → 地球儀 → 窓がひらく → 一生 → まとめ）
import { VERSION, SPEEDS, COUNTS, SITE_URL, COUNTER_API, COUNT_ON } from './config.js?v=1.0.3';
import { makeLife, FILTERS, DATA_VERSION, KINDS } from './sim/engine.js?v=1.0.3';
import { spanText, ageText } from './sim/format.js?v=1.0.3';
import { newSeed } from './rng.js?v=1.0.3';
import { load, set, addHistory, save } from './store.js?v=1.0.3';
import { sfx } from './sound.js?v=1.0.3';
import { prCard } from './promo.js?v=1.0.3';
import { Globe, preloadGlobe, easeInOut } from './view/globe.js?v=1.0.3';
import { Runner } from './view/runner.js?v=1.0.3';
import { LifeView } from './view/world.js?v=1.0.3';
import { loadForLives, loadIcons, loadImg, IMG, loadMeta } from './view/assets.js?v=1.0.3';
import { ICONS } from './sim/engine.js?v=1.0.3';
import { lifeCard, summaryCard, canvasBlob, asName, rarityText } from './view/card.js?v=1.0.3';

const $ = (s) => document.querySelector(s);
const st = load();
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isPhone = () => /iPhone|iPod|Android.+Mobile|Windows Phone/i.test(navigator.userAgent);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let runner = null;
let session = null; // { seed, n, filter, lives }
let cardBlob = null;

// ---------- 画面の切りかえ ----------
function show(id) {
  for (const s of document.querySelectorAll('.screen')) s.classList.toggle('is-on', s.id === id);
  document.body.dataset.screen = id;
  window.scrollTo(0, 0);
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { t.hidden = true; }, 2200);
}

// ---------- ホーム ----------
function chips(box, items, cur, onPick, fmt = (x) => x) {
  box.replaceChildren(...items.map((it) => {
    const v = typeof it === 'object' ? it.id : it;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = typeof it === 'object' ? it.label : fmt(it);
    b.setAttribute('aria-pressed', String(v === cur));
    if (v === 'all') b.classList.add('chip-coral');
    b.addEventListener('click', () => {
      sfx.unlock(); sfx.tap();
      for (const x of box.children) x.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-pressed', 'true');
      onPick(v);
    });
    return b;
  }));
}

const FILTER_NOTE = {
  all: 'ひと・どうぶつ・むしが、だいたい同じくらいの割合で出ます',
  human: '世界の国の、ほんとうの出生数の割合で国が決まります',
  animal: 'ネコ・ゾウ・ペンギン・サケなど、いろいろな どうぶつ',
  bug: 'アリ・セミ・ホタル・クマムシなど、ちいさな いきもの',
  real: '地球にいる ほんとうの数の割合で選びます。ほとんど虫になります',
};

function renderHome() {
  chips($('#speedChips'), SPEEDS, st.speed, (v) => set('speed', v), (x) => `×${x}`);
  chips($('#countChips'), COUNTS, st.count, (v) => { set('count', v); hint(); }, (x) => (x === 1 ? '1つ' : String(x)));
  chips($('#filterChips'), FILTERS, st.filter, (v) => { set('filter', v); $('#filterNote').textContent = FILTER_NOTE[v]; hint(); });
  $('#filterNote').textContent = FILTER_NOTE[st.filter] || '';
  hint();
  renderHistory();
  loadCounter();
  $('#prHome').replaceChildren(prCard('home'));
  soundLabel();
}

function hint() {
  const n = st.count;
  $('#psHint').textContent = n === 1 ? 'どこかの だれかに うまれます' : `${n}の いのちに、いっせいに うまれます`;
}

function soundLabel() { $('#soundBtn').textContent = st.sound ? 'おと：あり' : 'おと：なし'; }

function renderHistory() {
  const box = $('#historyList');
  $('#totalCount').textContent = st.total ? `ぜんぶで ${st.total.toLocaleString('ja-JP')}回` : '';
  $('#historyPanel').hidden = !st.history.length;
  box.replaceChildren(...st.history.slice(0, 12).map((h) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hist';
    if (h.type === 'multi') {
      b.innerHTML = `<b>${h.n}回 いきてみた</b><small>${new Date(h.t).toLocaleDateString('ja-JP')}・${esc(h.top || '')}</small>`;
      b.addEventListener('click', () => openMulti(h.seed, h.n, h.f, true));
    } else {
      b.innerHTML = `<b>${esc(h.name)}として ${esc(h.span)}</b><small>${esc(h.place || '')}</small>`;
      b.addEventListener('click', () => openSingle(h.seed, h.f, true));
    }
    li.append(b);
    return li;
  }));
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- みんなの数（カウンター） ----------
let shown = null; // いま画面に出している数
async function loadCounter() {
  try {
    const r = await fetch(`${COUNTER_API}/api/stats`);
    if (!r.ok) throw new Error(r.status);
    showCounter(await r.json());
  } catch { $('#counter').hidden = true; }
}
function showCounter(s) {
  if (!s || typeof s.lives !== 'number') return;
  const box = $('#counter');
  box.hidden = false;
  const fmt = (x) => Math.round(x).toLocaleString('ja-JP');
  $('#cntSub').textContent = `${fmt(s.people)}人が ${fmt(s.presses)}回 押した・きょう ${fmt(s.today?.presses || 0)}回`;
  const from = shown ?? Math.max(0, s.lives - Math.min(s.lives, 300));
  const to = s.lives;
  shown = to;
  const el = $('#cntLives');
  if (reduce || from === to) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / 900);
    el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
// 「うまれる」を数える（本番だけ）。戻り値は通し番号つきの答え（失敗したら null）
function countBirth(n, f) {
  if (!COUNT_ON) return null;
  const first = !st.counted;
  set('counted', true);
  return fetch(`${COUNTER_API}/api/born`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: JSON.stringify({ n, f, first }), keepalive: true })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => { if (j?.ok) showCounter(j); return j?.ok ? j : null; })
    .catch(() => null);
}

// ---------- うまれる ----------
async function birth() {
  sfx.unlock();
  const n = st.count;
  const seed = new URLSearchParams(location.search).get('seed') || newSeed(); // ?seed= は確かめ用（同じ一生で撮る）
  const lives = makeLives(seed, n, st.filter);
  session = { seed, n, filter: st.filter, lives, serial: countBirth(n, st.filter) };
  const ready = loadForLives(lives);
  try { window.gtag?.('event', 'umareru', { n, f: st.filter }); } catch {}
  $('#birthBtn').disabled = true;
  await suckIn();
  await globeIntro(lives, ready);
  $('#birthBtn').disabled = false;
  startRun(lives);
}

function makeLives(seed, n, filter) {
  return n === 1 ? [makeLife(seed, filter)] : Array.from({ length: n }, (_, i) => makeLife(`${seed}-${i}`, filter));
}

// スマホの画面に吸いこまれる
async function suckIn() {
  sfx.whoosh();
  const home = $('#home');
  if (reduce) { home.classList.add('fade-out'); await sleep(250); return; }
  const phone = $('#phoneScreen').getBoundingClientRect();
  const vw = innerWidth, vh = innerHeight;
  const scale = Math.max(vw / phone.width, vh / phone.height) * 1.25;
  const cx = phone.left + phone.width / 2, cy = phone.top + phone.height / 2;
  const sky = $('#skyScene');
  // 吸いこまれる粒
  const box = $('#sparks');
  box.replaceChildren();
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('i');
    const a = Math.random() * Math.PI * 2, r = 120 + Math.random() * Math.max(vw, vh) * 0.6;
    s.style.left = `${cx + Math.cos(a) * r}px`;
    s.style.top = `${cy + Math.sin(a) * r}px`;
    s.style.setProperty('--dx', `${-Math.cos(a) * r}px`);
    s.style.setProperty('--dy', `${-Math.sin(a) * r}px`);
    s.style.animationDelay = `${Math.random() * 220}ms`;
    s.className = ['spk-a', 'spk-b', 'spk-c'][i % 3];
    box.append(s);
  }
  home.classList.add('sucking');
  const r = sky.getBoundingClientRect();
  sky.style.transformOrigin = `${cx - r.left}px ${cy - r.top}px`;
  sky.style.transform = `translate(${vw / 2 - cx}px, ${vh / 2 - cy}px) scale(${scale}) rotate(9deg)`;
  await sleep(850);
}

function resetHome() {
  const home = $('#home');
  home.classList.remove('sucking', 'fade-out');
  const sky = $('#skyScene');
  sky.style.transition = 'none';
  sky.style.transform = '';
  sky.offsetWidth; // eslint-disable-line no-unused-expressions
  sky.style.transition = '';
  $('#sparks').replaceChildren();
}

// 地球儀: どこにうまれるかを見せる
async function globeIntro(lives, ready) {
  const warp = $('#warp');
  warp.hidden = false;
  warp.classList.remove('out');
  requestAnimationFrame(() => warp.classList.add('on'));
  const cv = $('#globe');
  const size = Math.min(innerWidth * 0.82, innerHeight * 0.48, 420);
  const dpr = Math.min(1.25, devicePixelRatio || 1, 300 / size); // 1画素ずつ球に貼るので、内部の大きさは控えめに
  cv.style.width = cv.style.height = `${size}px`;
  cv.width = cv.height = Math.round(size * dpr);
  const globe = new Globe(cv);
  await globe.ready;
  const one = lives.length === 1 ? lives[0] : null;
  const target = one ? one.place : { lat: 20, lon: lives[0].place.lon ?? 0 };
  const pins = lives.filter((l) => l.place.lat != null).map((l, i) => ({ lat: l.place.lat, lon: l.place.lon, delay: lives.length === 1 ? 0 : (i / lives.length) * 0.9, size: lives.length > 9 ? size * dpr * 0.028 : size * dpr * 0.06, color: ['#FF8179', '#FFB35D', '#59B7E9', '#99CD84'][i % 4] }));
  $('#warpSub').textContent = one ? 'あなたが うまれるのは…' : `${lives.length}の いのちが うまれます`;
  $('#warpMain').textContent = '';
  $('#warpMain').classList.remove('show');
  let skip = false;
  const onTap = () => { skip = true; };
  warp.addEventListener('pointerdown', onTap, { once: true });
  const lon0 = target.lon + 220 + Math.random() * 120;
  const T = reduce ? 300 : 1500;
  const t0 = performance.now();
  await new Promise((res) => {
    const step = (now) => {
      const k = Math.min(1, (now - t0) / T);
      const e = easeInOut(k);
      const lon = lon0 + (target.lon - lon0) * e;
      const lat = 10 + ((target.lat ?? 20) * 0.6 - 10) * e;
      globe.draw({ lon0: lon, lat0: lat, pins, pinT: Math.max(0, (k - 0.6) / 0.4) * 1.35 });
      if (k < 1 && !skip) requestAnimationFrame(step); else { globe.draw({ lon0: target.lon, lat0: (target.lat ?? 20) * 0.6, pins, pinT: 2 }); res(); }
    };
    requestAnimationFrame(step);
  });
  sfx.birth();
  const main = $('#warpMain');
  if (one) {
    main.innerHTML = `<span class="wm-place">${esc(one.place.text)}で</span><span class="wm-who">${esc(asName(one))}${one.sexLabel ? `<small>（${esc(one.sexLabel)}）</small>` : ''}</span><span class="wm-tail">として うまれます</span>`;
  } else {
    const k = { human: 0, animal: 0, bug: 0 };
    for (const l of lives) k[l.species.kind]++;
    main.innerHTML = `<span class="wm-who">ひと ${k.human}・どうぶつ ${k.animal}・むし ${k.bug}</span><span class="wm-tail">いっせいに うまれます</span>`;
  }
  main.classList.add('show');
  await Promise.all([ready, sleep(skip || reduce ? 500 : 1500)]);
  warp.classList.add('out');
  setTimeout(() => { warp.hidden = true; warp.classList.remove('on', 'out'); resetHome(); }, 450);
}

// ---------- 一生を見る ----------
function startRun(lives) {
  show('run');
  const n = lives.length;
  document.body.dataset.count = String(n);
  const log = $('#log');
  log.replaceChildren();
  $('#logTitle').textContent = n === 1 ? 'この いのちの ものがたり' : 'いま 起きたこと';
  $('#runDone').hidden = true;
  $('#ageCap').hidden = n !== 1;
  renderRunSpeed();
  runner?.destroy();
  const cv = $('#world');
  let pops = 0;
  let lastRow = 0;
  runner = new Runner(cv, lives, {
    speed: st.speed,
    onEvent: (v, e, i) => {
      if (n === 1) addLogRow(log, v.life, e, true);
      else if ((e.big >= 2 || e.mood) && performance.now() - lastRow > 350) { lastRow = performance.now(); addLogRow(log, v.life, e, false, i); } // 100窓は速すぎるので間引く
      if (n === 1 && e.age > 0) sfx.pop(pops++);
    },
    onEndOne: (v) => {
      if (n === 1) { addLogRow(log, v.life, { ...v.life.death, mood: 'hard', icon: 'feather' }, true); sfx.end(); }
    },
    onAllEnd: () => {
      if (n === 1) { setTimeout(() => { if (runner?.views[0].life === lives[0]) finish(); }, 1400); }
      else { $('#runDone').hidden = false; sfx.end(); }
    },
    onTap: (i, v) => { if (n > 1) openFocus(v, i); },
    onFrame: (r) => {
      // 文字が変わったときだけ書きかえる（毎コマ書くと重い）
      if (n === 1) {
        const v = r.views[0];
        setHtml('#ageCap', v.ended ? '<b>おしまい</b>' : ageHtml(v.age));
        setHtml('#runStatus', `<b>${esc(asName(v.life))}</b><small>${esc(v.life.place.text)}</small>`);
      } else {
        setHtml('#runStatus', `<span class="rs-alive">いきてる <b>${r.alive}</b></span><span class="rs-all">/ ${n}</span>`);
      }
      if (focusView) drawFocus();
    },
  });
  if (n > 1 && !reduce) for (let i = 0; i < Math.min(n, 30); i++) setTimeout(() => sfx.pop(i), 250 + i * Math.min(30, 900 / n));
  $('#runPause').textContent = '⏸';
  $('#runPause').setAttribute('aria-label', '一時停止');
}

const htmlCache = new Map();
function setHtml(sel, html) {
  if (htmlCache.get(sel) === html) return;
  htmlCache.set(sel, html);
  $(sel).innerHTML = html;
}

function ageHtml(d) {
  const t = ageText(d);
  const m = t.match(/^(\d+)(.*)$/);
  return m ? `<b>${m[1]}</b><span>${m[2]}</span>` : `<span>${t}</span>`;
}

function addLogRow(box, life, e, single, idx) {
  const li = document.createElement('li');
  li.className = `log-row ${e.mood || ''}`;
  const ic = document.createElement('img');
  ic.src = `img/icons/${e.icon || 'sprout'}.webp`; ic.alt = ''; ic.width = 28; ic.height = 28;
  const age = document.createElement('span');
  age.className = 'log-age';
  age.textContent = ageText(e.age ?? life.span);
  const tx = document.createElement('span');
  tx.className = 'log-text';
  tx.textContent = single ? e.text : `${asName(life)}：${e.text}`;
  li.append(ic, age, tx);
  box.prepend(li);
  while (box.children.length > (single ? 200 : 40)) box.lastChild.remove();
}

function renderRunSpeed() {
  chips($('#runSpeed'), SPEEDS, st.speed, (v) => { set('speed', v); if (runner) runner.speed = v; }, (x) => `×${x}`);
}

// 100の窓のうち1つを大きく見る
let focusView = null, focusCv = null;
function openFocus(v, i) {
  focusView = v;
  runner.focus = i;
  const m = $('#focus');
  m.hidden = false;
  $('#focusTitle').innerHTML = `<b>${esc(asName(v.life))}</b><small>${esc(v.life.place.text)}</small>`;
  focusCv = $('#focusCanvas');
  $('#focusCard').hidden = true;
  $('#focusSave').hidden = true;
  focusCv.hidden = false;
  const log = $('#focusLog');
  log.replaceChildren();
  for (const e of v.life.events.slice(0, v.next)) addLogRow(log, v.life, e, true);
  const prev = v.onEvent;
  v.onEvent = (vv, e) => { prev?.(vv, e); if (focusView === vv) addLogRow(log, vv.life, e, true); };
  v._restore = () => { v.onEvent = prev; };
  drawFocus();
}
function drawFocus() {
  if (!focusView || !focusCv || focusCv.hidden) return;
  const r = focusCv.getBoundingClientRect();
  const dpr = Math.min(2, devicePixelRatio || 1);
  if (focusCv.width !== Math.round(r.width * dpr)) { focusCv.width = Math.round(r.width * dpr); focusCv.height = Math.round(r.height * dpr); }
  const g = focusCv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, r.width, r.height);
  focusView.draw(g, { x: 0, y: 0, w: r.width, h: r.height }, { bubbles: 'full', now: performance.now(), dpr, topPad: 62 });
  setHtml('#focusAge', focusView.ended ? '<b>おしまい</b>' : ageHtml(focusView.age));
}
function closeFocus() {
  $('#focus').hidden = true;
  focusView?._restore?.();
  focusView = null;
  if (runner) runner.focus = -1;
}

// ---------- まとめ ----------
async function finish() {
  const s = session;
  if (!s) return;
  runner?.destroy();
  runner = null;
  closeFocus();
  st.total = (st.total || 0) + s.n;
  if (s.n === 1) {
    const l = s.lives[0];
    if (!s.replay) addHistory({ type: 'single', seed: s.seed, f: s.filter, name: asName(l), span: spanText(l.span), place: l.place.text });
  } else if (!s.replay) {
    const by = new Map();
    for (const l of s.lives) by.set(l.species.name, (by.get(l.species.name) || 0) + 1);
    const top = [...by].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}×${v}`).join('・');
    addHistory({ type: 'multi', seed: s.seed, n: s.n, f: s.filter, top });
  }
  save();
  await showResult(s);
}

async function showResult(s) {
  show('result');
  const img = $('#resCard');
  img.removeAttribute('src');
  img.classList.add('loading');
  $('#saveBtn').disabled = true;
  cardBlob = null;
  const single = s.n === 1;
  const l = s.lives[0];
  // この一生の数（0のものは出さない）
  const stats = single ? l.statDefs.filter((d) => (l.stats[d.id] || 0) > 0) : [];
  $('#resStats').innerHTML = stats.map((d) => `<span><small>${esc(d.label)}</small><b>${Number(l.stats[d.id]).toLocaleString('ja-JP')}</b>${esc(d.unit || '')}</span>`).join('');
  $('#resStats').hidden = !stats.length;
  $('#resFact').innerHTML = single && l.fact ? `<b>まめちしき</b>${esc(l.fact)}` : '';
  $('#resFact').hidden = !(single && l.fact);
  $('#resDetailTitle').textContent = single ? 'ぜんぶの できごと' : `${s.n}の いのち（タップで カード）`;
  $('#resNote').hidden = !s.oldVersion;
  const list = $('#resList');
  list.replaceChildren();
  if (single) {
    for (const e of l.events) addLogRow(list, l, e, true);
    addLogRow(list, l, { ...l.death, mood: 'hard', icon: 'feather' }, true);
    list.append(...[...list.children].reverse());
    const r = document.createElement('li');
    r.className = 'log-row rarity';
    r.textContent = rarityText(l);
    list.append(r);
  } else {
    const sorted = s.lives.map((x, i) => ({ x, i })).sort((a, b) => b.x.span / b.x.refDays - a.x.span / a.x.refDays);
    for (const { x } of sorted) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'life-row';
      b.innerHTML = `<img src="img/sp/${x.stages[x.stages.length - 1].sprite + x.spriteSuffix}.webp" alt="" width="40" height="40"><span><b>${esc(asName(x))}</b><small>${esc(x.place.text)}・${esc(x.title)}</small></span><em>${esc(spanText(x.span))}</em>`;
      b.addEventListener('click', () => openCardModal(x));
      li.append(b);
      list.append(li);
    }
  }
  $('#prResult').replaceChildren(prCard('result'));
  // イキテミタで うまれた 何番目の いのちか（数えたときだけ）
  $('#resSerial').hidden = true;
  if (s.serial && !s.replay) {
    Promise.resolve(s.serial).then((j) => {
      if (!j || session !== s) return;
      const f = (x) => x.toLocaleString('ja-JP');
      $('#resSerial').innerHTML = j.from === j.to ? `イキテミタで うまれた <b>${f(j.to)}</b>番目の いのち` : `イキテミタで うまれた <b>${f(j.from)}</b>〜<b>${f(j.to)}</b>番目の いのち`;
      $('#resSerial').hidden = false;
    });
  }
  // 共有のリンク
  const url = shareUrl(s);
  const text = single ? `${asName(l)}として ${spanText(l.span)} いきてみた。` : `${s.n}回 いきてみた。`;
  armX($('#xShare'), `${text}\n#イキテミタ`, url);
  // 画像
  const c = single ? await lifeCard(l) : await summaryCard(s.lives);
  cardBlob = await canvasBlob(c);
  img.src = URL.createObjectURL(cardBlob);
  img.alt = single ? `${asName(l)}として ${spanText(l.span)} いきてみた` : `${s.n}回 いきてみた`;
  img.classList.remove('loading');
  $('#saveBtn').disabled = false;
}

function shareUrl(s) {
  const u = new URL(SITE_URL);
  if (s.n === 1) u.searchParams.set('l', s.seed);
  else { u.searchParams.set('m', s.seed); u.searchParams.set('n', String(s.n)); }
  if (s.filter !== 'all') u.searchParams.set('f', s.filter);
  u.searchParams.set('v', String(DATA_VERSION));
  return u.toString();
}

// X の共有: スクリプトで開かず、ふつうのリンクとして開かせる（iPhone でアプリに切りかわるように）
function armX(a, text, url) {
  const href = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  a.href = href;
  if (isPhone()) a.removeAttribute('target'); else { a.target = '_blank'; a.rel = 'noopener'; }
}

async function saveImage(blob, name) {
  if (!blob) return;
  const file = new File([blob], name, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] }) && isPhone()) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('画像を保存しました');
}

let modalBlob = null;
async function openCardModal(l) {
  const m = $('#focus');
  m.hidden = false;
  $('#focusTitle').innerHTML = `<b>${esc(asName(l))}</b><small>${esc(l.place.text)}</small>`;
  $('#focusCanvas').hidden = true;
  setHtml('#focusAge', '');
  const img = $('#focusCard');
  img.hidden = false; img.removeAttribute('src'); img.classList.add('loading');
  const log = $('#focusLog');
  log.replaceChildren();
  for (const e of l.events) addLogRow(log, l, e, true);
  addLogRow(log, l, { ...l.death, mood: 'hard', icon: 'feather' }, true);
  log.append(...[...log.children].reverse());
  $('#focusSave').hidden = false;
  modalBlob = null;
  const c = await lifeCard(l);
  modalBlob = await canvasBlob(c);
  img.src = URL.createObjectURL(modalBlob);
  img.classList.remove('loading');
}

// 共有された URL から開く（同じ種なら同じ一生）
async function openSingle(seed, filter = 'all', fromHistory = false, oldVersion = false) {
  const l = makeLife(seed, filter);
  session = { seed, n: 1, filter, lives: [l], replay: true, oldVersion };
  await showResult(session);
  if (!fromHistory) $('#againBtn').textContent = 'じぶんも うまれる';
}
async function openMulti(seed, n, filter = 'all', fromHistory = false, oldVersion = false) {
  const lives = makeLives(seed, n, filter);
  session = { seed, n, filter, lives, replay: true, oldVersion };
  await showResult(session);
  if (!fromHistory) $('#againBtn').textContent = 'じぶんも うまれる';
}

// ---------- ボタン ----------
function bind() {
  $('#birthBtn').addEventListener('click', birth);
  $('#soundBtn').addEventListener('click', () => { set('sound', !st.sound); soundLabel(); sfx.unlock(); sfx.tap(); });
  $('#runClose').addEventListener('click', () => { runner?.destroy(); runner = null; closeFocus(); show('home'); renderHome(); });
  $('#runPause').addEventListener('click', () => {
    if (!runner) return;
    runner.paused = !runner.paused;
    $('#runPause').textContent = runner.paused ? '▶' : '⏸';
    $('#runPause').setAttribute('aria-label', runner.paused ? 'つづける' : '一時停止');
  });
  $('#runSkip').addEventListener('click', () => runner?.skip());
  $('#runDone').addEventListener('click', finish);
  $('#saveBtn').addEventListener('click', () => {
    const s = session; if (!s) return;
    saveImage(cardBlob, s.n === 1 ? `ikitemita-${s.lives[0].species.id}-${s.seed}.png` : `ikitemita-${s.n}-${s.seed}.png`);
  });
  $('#againBtn').addEventListener('click', () => {
    $('#againBtn').textContent = 'もういちど';
    show('home'); renderHome();
    if (history.replaceState) history.replaceState(null, '', location.pathname);
    setTimeout(() => birth(), 150);
  });
  $('#homeBtn').addEventListener('click', () => { show('home'); renderHome(); if (history.replaceState) history.replaceState(null, '', location.pathname); });
  $('#replayBtn').addEventListener('click', () => { if (!session) return; const s = { ...session, replay: true, serial: null, lives: makeLives(session.seed, session.n, session.filter) }; session = s; startRun(s.lives); });
  $('#copyBtn').addEventListener('click', async () => {
    if (!session) return;
    try { await navigator.clipboard.writeText(shareUrl(session)); toast('リンクをコピーしました'); } catch { toast('コピーできませんでした'); }
  });
  $('#focusClose').addEventListener('click', closeFocus);
  $('#focus').addEventListener('click', (e) => { if (e.target.id === 'focus') closeFocus(); });
  $('#focusSave').addEventListener('click', () => saveImage(modalBlob, `ikitemita-card.png`));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFocus(); });
}

// ---------- はじめ ----------
async function init() {
  bind();
  renderHome();
  preloadGlobe();
  loadMeta();
  loadIcons(ICONS);
  const q = new URLSearchParams(location.search);
  const f = FILTERS.some((x) => x.id === q.get('f')) ? q.get('f') : 'all';
  const old = q.get('v') && q.get('v') !== String(DATA_VERSION);
  if (q.get('l')) { await openSingle(q.get('l').slice(0, 24), f, false, old); return; }
  if (q.get('m')) {
    const n = COUNTS.includes(Number(q.get('n'))) ? Number(q.get('n')) : 100;
    await openMulti(q.get('m').slice(0, 24), n, f, false, old);
    return;
  }
  show('home');
}

init();
