// まとめの画像（1080×1350）をつくる: 1つの一生のカード／たくさんの一生のまとめ
import { IMG, loadForLives, loadIcons, loadImg } from './assets.js?v=1.0.0';
import { areaFor } from './habitats.js?v=1.0.0';
import { moveOfSprite } from './world.js?v=1.0.0';
import { spriteAt, habitatAt, stageAt } from '../sim/engine.js?v=1.0.0';
import { ageText, spanText, oneIn, num } from '../sim/format.js?v=1.0.0';
import { roundRect, wrap, drawStar } from './world.js?v=1.0.0';

const W = 1080, H = 1350;
const C = { paper: '#FFF9ED', card: '#FFFCF5', inset: '#F8EEE2', ink: '#49382F', sub: '#756257', muted: '#95897F', coral: '#FF8179', blue: '#269FE8', gold: '#FFD16B', border: '#EEDCC5', good: '#FFE3DC', hard: '#DFEDF7' };
const F_T = '"M PLUS Rounded 1c"', F_B = '"Zen Maru Gothic"';
const font = (w, s, f = F_B) => `${w} ${s}px ${f}, "M PLUS Rounded 1c", system-ui, sans-serif`;
const SITE = '9qu1.com/ikitemita';

// 描く文字を先に読む（Google Fonts の日本語は文字ごとに分かれているので、文字を渡す）
async function loadGlyphs(text) {
  if (!document.fonts?.load) return;
  const t = text + '0123456789年か月日時間さいとして いきてみた';
  await Promise.all([
    document.fonts.load(font(800, 40, F_T), t), document.fonts.load(font(700, 40, F_T), t),
    document.fonts.load(font(700, 40, F_B), t), document.fonts.load(font(500, 40, F_B), t),
  ]).catch(() => {});
}

const kindCounter = (l) => l.counter || (l.species.kind === 'human' ? '人' : '匹');
export const asName = (l) => (l.species.kind === 'human' ? l.name : l.name ? `${l.variant.label}の ${l.name}` : l.variant.label);

export function rarityText(l) {
  const c = kindCounter(l);
  if (l.pct >= 0.5) return `なかまの ${Math.round(l.pct * 100)}%は、もっと 長く 生きた`;
  return `ここまで 生きたのは、なかまの ${oneIn(l.pct, c)}`;
}

function paperBg(g) {
  g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
  // やわらかい紙の地（点々）
  g.fillStyle = 'rgba(180,150,110,.05)';
  for (let i = 0; i < 900; i++) { const x = (i * 97.3) % W, y = (i * 61.7 * 1.3) % H; g.fillRect(x, y, 2, 2); }
  // ふちの花と葉
  const deco = [['flower', 26, 22, 64, -0.2], ['sprout', 92, 30, 44, 0.3], ['flower', W - 92, 20, 56, 0.25], ['sprout', W - 40, 76, 40, -0.4], ['flower', 30, H - 84, 52, 0.1], ['sprout', W - 76, H - 80, 48, 0.2]];
  for (const [ic, x, y, s, r] of deco) {
    const im = IMG.icon[ic]; if (!im) continue;
    g.save(); g.globalAlpha = 0.85; g.translate(x + s / 2, y + s / 2); g.rotate(r); g.drawImage(im, -s / 2, -s / 2, s, s); g.restore();
  }
}

function ribbon(g, text, y) {
  g.font = font(800, 34, F_T);
  const tw = g.measureText(text).width;
  const w = tw + 120, x = (W - w) / 2, h = 62;
  g.fillStyle = '#F6E3B8';
  g.beginPath(); g.moveTo(x - 26, y + 8); g.lineTo(x + 8, y + 8); g.lineTo(x + 8, y + h + 8); g.lineTo(x - 26, y + h + 8); g.lineTo(x - 10, y + h / 2 + 8); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(x + w + 26, y + 8); g.lineTo(x + w - 8, y + 8); g.lineTo(x + w - 8, y + h + 8); g.lineTo(x + w + 26, y + h + 8); g.lineTo(x + w + 10, y + h / 2 + 8); g.closePath(); g.fill();
  g.fillStyle = '#FBEFD2';
  roundRect(g, x, y, w, h, 14); g.fill();
  g.fillStyle = '#8A6A3E'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, W / 2, y + h / 2 + 2);
  g.textAlign = 'left';
}

// 箱庭＋生きもの（大きく）を、枠の中に切りぬいて描く
function scene(g, l, age, x, y, w, h, r, { big = 1, star = false, hero = false } = {}) {
  g.save();
  roundRect(g, x, y, w, h, r); g.clip();
  const hab = habitatAt(l, age);
  const im = IMG.hab[hab];
  const area = areaFor(hab, moveOfSprite(spriteAt(l, age).id));
  if (im) {
    // 箱庭の歩ける所が真ん中に来るように、正方形の絵を横長に切る
    const s = Math.max(w, h) * (w > h * 1.3 ? 1.08 : 1.02);
    const cy = area[1];
    const ix = x + w / 2 - s / 2, iy = Math.min(y, Math.max(y + h - s, y + h * 0.58 - cy * s));
    g.drawImage(im, ix, iy, s, s);
    var map = (nx, ny) => [ix + nx * s, iy + ny * s];
  } else {
    g.fillStyle = '#B9E6F7'; g.fillRect(x, y, w, h);
    var map = (nx, ny) => [x + nx * w, y + ny * h];
  }
  const spr = spriteAt(l, age);
  const sim = IMG.sp[spr.id];
  if (sim) {
    let hgt = hero ? Math.min(h * 0.8, h - 48) * Math.max(0.75, Math.min(1, spr.scale + 0.25)) : Math.min(h * 0.5, w * 0.42) * big * Math.max(0.6, spr.scale);
    let sw = (hgt * sim.naturalWidth) / sim.naturalHeight;
    if (sw > w * 0.6) { sw = w * 0.6; hgt = (sw * sim.naturalHeight) / sim.naturalWidth; } // 横長の生きもの（クジラなど）
    const meta = IMG.meta?.[spr.id];
    const ay = meta?.ay ?? 0.96;
    const [px, py0] = map(area[0], area[1] + area[3] * 0.4);
    // 頭が枠から出ないように、足もとを下げる（下にもはみ出さない）
    let py = hero ? y + h - 24 : Math.min(py0, y + h - 8);
    if (py - ay * hgt < y + 12) py = Math.min(y + h - 6, y + 12 + ay * hgt);
    if (hero) var pxHero = x + w / 2;
    g.fillStyle = 'rgba(73,56,47,.16)';
    const cx = hero ? pxHero : px;
    g.beginPath(); g.ellipse(cx, py, Math.min(sw * 0.45, hgt * 0.32), hgt * 0.07, 0, 0, Math.PI * 2); g.fill();
    g.drawImage(sim, cx - (meta?.ax ?? 0.5) * sw, py - ay * hgt, sw, hgt);
  }
  if (star) {
    g.fillStyle = 'rgba(102,104,94,.1)'; g.fillRect(x, y, w, h);
    const ss = Math.max(9, Math.min(22, w * 0.13));
    drawStar(g, x + w - ss - 4, y + ss + 4, ss);
  }
  g.restore();
}

function pill(g, x, y, text, { bg = C.inset, fg = C.sub, size = 26, padX = 18, h = 46, weight = 700 } = {}) {
  g.font = font(weight, size);
  const w = g.measureText(text).width + padX * 2;
  g.fillStyle = bg; roundRect(g, x, y, w, h, h / 2); g.fill();
  g.fillStyle = fg; g.textBaseline = 'middle'; g.fillText(text, x + padX, y + h / 2 + 1);
  return w;
}

function fitText(g, text, maxW, size, weight = 700, f = F_B, min = 18) {
  let s = size;
  g.font = font(weight, s, f);
  while (s > min && g.measureText(text).width > maxW) { s -= 1; g.font = font(weight, s, f); }
  return s;
}

function footer(g) {
  g.font = font(800, 26, F_T); g.textBaseline = 'middle';
  const logo = 'イキテミタ';
  const cols = ['#FF8580', '#FFB35D', '#59B7E9', '#99CD84', '#6EBDC5'];
  let x = 64;
  [...logo].forEach((ch, i) => { g.fillStyle = cols[i]; g.fillText(ch, x, H - 44); x += g.measureText(ch).width; });
  g.font = font(700, 22); g.fillStyle = C.muted; g.textAlign = 'right';
  g.fillText(SITE, W - 64, H - 43);
  g.textAlign = 'left';
}

// ---- 1つの一生のカード ----
//   スマホの幅（約360px）で読めるように、1080 の画像の上では本文 34〜40px にしている
export async function lifeCard(l) {
  await Promise.all([loadForLives([l]), loadIcons(['flower', 'sprout', 'feather', 'birth', ...l.highlights.map((e) => e.icon)])]);
  const texts = [asName(l), l.place.text, l.title, rarityText(l), l.death.text, spanText(l.span), l.sexLabel, l.variant.label, ...l.highlights.map((e) => e.text + ageText(e.age))].join('');
  await loadGlyphs(texts + 'いのちの まとめうまれさいご｜いきざま');
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  paperBg(g);
  ribbon(g, 'いのちの まとめ', 26);

  // だれとして
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  const who = `${asName(l)} として`;
  fitText(g, who, W - 160, 48, 800, F_T, 30);
  g.fillStyle = C.ink; g.fillText(who, W / 2, 150);
  // 長さ（数字は大きく）
  const st = spanText(l.span);
  const parts = st.match(/(\d+|\D+)/g);
  const big = 100, small = 50, tail = ' いきてみた';
  let tw = 0;
  for (const p of parts) { g.font = font(800, /\d/.test(p) ? big : small, F_T); tw += g.measureText(p).width; }
  g.font = font(800, 44, F_T); tw += g.measureText(tail).width;
  let x = W / 2 - tw / 2;
  g.textAlign = 'left';
  for (const p of parts) { g.font = font(800, /\d/.test(p) ? big : small, F_T); g.fillStyle = C.coral; g.fillText(p, x, 250); x += g.measureText(p).width; }
  g.font = font(800, 44, F_T); g.fillStyle = C.ink; g.fillText(tail, x, 250);

  // 箱庭（生きものが主役の大きさ）
  const sx = 56, sy = 278, sw = W - 112, sh = 340;
  g.save(); g.shadowColor = 'rgba(104,82,56,.18)'; g.shadowBlur = 18; g.shadowOffsetY = 6;
  g.fillStyle = '#fff'; roundRect(g, sx - 8, sy - 8, sw + 16, sh + 16, 42); g.fill(); g.restore();
  scene(g, l, Math.max(0, l.span * 0.92), sx, sy, sw, sh, 36, { hero: true });

  // いきざま（絵の下の帯）
  let y = 636;
  const tl = `いきざま｜${l.title}`;
  const ts = fitText(g, tl, sw - 56, 34, 700, F_B, 22);
  g.fillStyle = '#FBEFD2'; roundRect(g, sx, y, sw, 58, 29); g.fill();
  g.fillStyle = '#7A5A2E'; g.textBaseline = 'middle'; g.textAlign = 'center'; g.font = font(700, ts);
  g.fillText(tl, W / 2, y + 30);
  g.textAlign = 'left';

  // うまれた所・めずらしさ
  y = 712;
  const pin = IMG.icon.birth;
  if (pin) g.drawImage(pin, 58, y, 46, 46);
  const tag = l.sexLabel || '';
  g.font = font(700, 30);
  const tagW = tag ? g.measureText(tag).width + 40 : 0;
  const ps = fitText(g, `うまれ：${l.place.text}`, W - 190 - tagW, 38, 700, F_B, 26);
  g.fillStyle = C.ink; g.textBaseline = 'middle'; g.font = font(700, ps);
  g.fillText(`うまれ：${l.place.text}`, 114, y + 24);
  if (tag) pill(g, W - 56 - tagW, y + 1, tag, { size: 30, h: 46, padX: 20, bg: C.good, fg: '#C0574F' });
  y += 62;
  const rs = fitText(g, rarityText(l), W - 170, 32, 500, F_B, 24);
  g.font = font(500, rs); g.fillStyle = C.sub;
  g.fillText(rarityText(l), 114, y + 16);

  // 見どころ5つ＋さいご（文字が長いときは小さく、それでも入らなければ2行）
  const rows = [...l.highlights.slice(0, 5).map((e) => ({ e, end: false })), { e: { ...l.death, age: l.span, icon: 'feather', mood: 'end' }, end: true }];
  const TX = 262, TW = W - 56 - TX - 18;
  const lay = rows.map(({ e, end }) => {
    let fs = 38;
    g.font = font(700, fs);
    while (fs > 30 && g.measureText(e.text).width > TW) { fs -= 1; g.font = font(700, fs); }
    let lines = [e.text];
    if (g.measureText(e.text).width > TW) { fs = 30; g.font = font(700, fs); lines = wrap(g, e.text, TW, 2); }
    return { e, end, fs, lines, h: lines.length > 1 ? 92 : 64 };
  });
  const gap = 8, top = 830, bottom = 1262;
  while (lay.length > 3 && lay.reduce((a, r) => a + r.h + gap, -gap) > bottom - top) lay.splice(lay.length - 2, 1); // 入らなければ遅い見どころから減らす
  y = top;
  for (const r of lay) {
    const { e } = r;
    g.fillStyle = r.end ? '#EFEAF3' : e.mood === 'good' ? '#FFEDE7' : e.mood === 'hard' ? '#E8F2F9' : C.inset;
    roundRect(g, 56, y, W - 112, r.h, 20); g.fill();
    const ic = IMG.icon[e.icon];
    if (ic) g.drawImage(ic, 70, y + (r.h - 46) / 2, 46, 46);
    const at = ageText(e.age);
    const as = fitText(g, at, 130, 30, 700, F_B, 20);
    g.font = font(700, as); g.fillStyle = '#88786C'; g.textBaseline = 'middle';
    g.fillText(at, 126, y + r.h / 2 + 1);
    g.fillStyle = C.ink; g.font = font(700, r.fs);
    if (r.lines.length === 1) g.fillText(r.lines[0], TX, y + r.h / 2 + 1);
    else r.lines.forEach((ln, i) => g.fillText(ln, TX, y + 27 + i * 38));
    y += r.h + gap;
  }
  footer(g);
  return c;
}

// ---- たくさんの一生のまとめ ----
export async function summaryCard(lives) {
  await Promise.all([loadForLives(lives, { stagesAll: true }), loadIcons(['flower', 'sprout'])]);
  const n = lives.length;
  const by = new Map();
  for (const l of lives) by.set(l.species.name, (by.get(l.species.name) || 0) + 1);
  const top = [...by].sort((a, b) => b[1] - a[1]);
  const kinds = { human: 0, animal: 0, bug: 0 };
  for (const l of lives) kinds[l.species.kind]++;
  const longest = lives.reduce((a, b) => (b.span > a.span ? b : a));
  const shortest = lives.reduce((a, b) => (b.span < a.span ? b : a));
  const head = `${n}回 いきてみた`;
  const sub = `ひと ${kinds.human}・どうぶつ ${kinds.animal}・むし ${kinds.bug}`;
  // いちばん運がよかった＝同じときにうまれた仲間のうち、ここまで生きたのが いちばん少ない一生
  const lucky = lives.reduce((a, b) => (b.pct < a.pct ? b : a));
  const pills = [
    ['いちばん 長い', asName(longest), spanText(longest.span)],
    ['いちばん 短い', asName(shortest), spanText(shortest.span)],
    ['いちばん 運がいい', asName(lucky), oneIn(lucky.pct, kindCounter(lucky))],
  ];
  await loadGlyphs(head + sub + pills.flat().join('') + '匹人に1' + lives.map((l) => asName(l) + spanText(l.span)).join(''));
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  paperBg(g);
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = font(800, 72, F_T);
  const m = head.match(/^(\d+)(.*)$/);
  const w1 = g.measureText(m[1]).width; g.font = font(800, 54, F_T); const w2 = g.measureText(m[2]).width;
  let x = W / 2 - (w1 + w2) / 2;
  g.textAlign = 'left';
  g.font = font(800, 72, F_T); g.fillStyle = C.coral; g.fillText(m[1], x, 112);
  g.font = font(800, 54, F_T); g.fillStyle = C.ink; g.fillText(m[2], x + w1, 112);
  g.textAlign = 'center'; g.font = font(700, 28); g.fillStyle = C.sub; g.fillText(sub, W / 2, 160);
  g.textAlign = 'left';
  // 3つの数（見出し・名前・数の3行）
  const pw = (W - 112 - 24) / 3;
  pills.forEach(([k, name, v], i) => {
    const px = 56 + i * (pw + 12), py = 184;
    g.fillStyle = C.card; roundRect(g, px, py, pw, 150, 24); g.fill();
    g.strokeStyle = '#E7DCC9'; g.lineWidth = 2; roundRect(g, px, py, pw, 150, 24); g.stroke();
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    const ks = fitText(g, k, pw - 24, 28, 700, F_B, 20); g.font = font(700, ks); g.fillStyle = '#88786C'; g.fillText(k, px + pw / 2, py + 42);
    const ns = fitText(g, name, pw - 24, 34, 800, F_T, 20); g.font = font(800, ns, F_T); g.fillStyle = C.ink; g.fillText(name, px + pw / 2, py + 90);
    const vs = fitText(g, v, pw - 24, 34, 800, F_T, 20); g.font = font(800, vs, F_T); g.fillStyle = C.coral; g.fillText(v, px + pw / 2, py + 134);
    g.textAlign = 'left';
  });
  // グリッド
  const cols = Math.ceil(Math.sqrt(n));
  const gap = n >= 100 ? 8 : 14;
  const area = 916;
  const cell = (area - gap * (cols - 1)) / cols;
  const ox = (W - area) / 2, oy = 352;
  const label = n <= 25;
  lives.forEach((l, i) => {
    const cx = ox + (i % cols) * (cell + gap), cy = oy + Math.floor(i / cols) * (cell + gap);
    scene(g, l, l.span * 0.9, cx, cy, cell, cell, n >= 100 ? 8 : 18, { big: n >= 100 ? 1.6 : 1.2, star: true });
    if (label) {
      const fs = Math.max(16, Math.min(28, cell * 0.11));
      const lh = fs * 1.9;
      g.fillStyle = 'rgba(255,252,245,.92)'; roundRect(g, cx + 6, cy + cell - lh - 6, cell - 12, lh, lh / 2); g.fill();
      const t = `${asName(l)} ${spanText(l.span)}`;
      const s = fitText(g, t, cell - 28, fs, 700, F_B, 11);
      g.font = font(700, s); g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(t, cx + cell / 2, cy + cell - lh / 2 - 5);
      g.textAlign = 'left';
    }
  });
  footer(g);
  return c;
}

export function canvasBlob(c) {
  return new Promise((res) => c.toBlob((b) => res(b), 'image/png'));
}
