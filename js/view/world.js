// 1つの一生を、1つの窓（箱庭＋生きもの＋ふきだし）として描く
import { stageAt, habitatAt, spriteAt } from '../sim/engine.js?v=1.0.2';
import { clockText } from '../sim/format.js?v=1.0.2';
import { IMG, scaledCanvas } from './assets.js?v=1.0.2';
import { areaFor } from './habitats.js?v=1.0.2';
import { makeRng } from '../rng.js?v=1.0.2';

// ×1 のとき、物差しの長さ（refDays）を生きると何ミリ秒かかるか
export const BASE_MS = 120000;
export function lifeDuration(life) {
  const x = life.span / life.refDays;
  return BASE_MS * Math.max(0.15, Math.min(1.15, 0.15 + 0.85 * Math.sqrt(x)));
}

// 絵ごとの動き方と大きさ
const SPR = {
  human_baby: { size: 0.78 }, human_child: { size: 0.95 }, human_adult: { size: 1.1 }, human_elder: { size: 1.05 },
  cat: { size: 0.85 }, dog: { size: 0.95 }, hamster: { size: 0.62 }, sparrow: { move: 'hop', size: 0.62 }, tanuki: { size: 0.92 },
  owl: { move: 'hop', size: 0.9 }, lion: { size: 1.2 }, elephant: { size: 1.45 }, sloth: { move: 'slow', size: 1 },
  seaotter: { move: 'float', size: 1 }, penguin: { size: 0.98 }, seaturtle: { move: 'swim', size: 1 }, whale: { move: 'swim', size: 1.6 },
  salmon: { move: 'swim', size: 0.88 }, clownfish: { move: 'swim', size: 0.72 }, sunfish: { move: 'swim', size: 1.2 },
  octopus: { move: 'swim', size: 0.92 }, frog: { move: 'hop', size: 0.66 }, tadpole: { move: 'swim', size: 0.5 },
  jellyfish: { move: 'float', size: 0.9 }, egg: { move: 'still', size: 0.5 },
  ant: { size: 0.62 }, bee: { move: 'fly', size: 0.66 }, beetle: { size: 0.85 }, grub: { move: 'slow', size: 0.58 },
  pupa: { move: 'still', size: 0.6 }, cicada: { move: 'fly', size: 0.78 }, cicada_nymph: { move: 'slow', size: 0.68 },
  butterfly: { move: 'fly', size: 0.8 }, caterpillar: { move: 'slow', size: 0.6 }, firefly: { move: 'fly', size: 0.58 },
  ladybug: { size: 0.55 }, dragonfly: { move: 'fly', size: 0.85 }, nymph: { move: 'swim', size: 0.6 }, mayfly: { move: 'fly', size: 0.66 },
  pillbug: { size: 0.55 }, mantis: { size: 0.85 }, tardigrade: { move: 'slow', size: 0.6 },
  penguin_chick: { size: 0.85 }, roe: { move: 'still', size: 0.5 }, ootheca: { move: 'still', size: 0.55 }, tun: { move: 'still', size: 0.55 }, polyp: { move: 'still', size: 0.6 },
};
const sprInfo = (id) => SPR[id.replace(/_[abc]$/, '')] || { size: 1 };
const moveOf = (life, age) => sprInfo(spriteAt(life, age).id).move || 'walk';
const SPEED = { walk: 0.09, hop: 0.11, slow: 0.025, swim: 0.07, float: 0.03, fly: 0.12, still: 0 };

const MOOD_BG = { good: '#FFE3DC', hard: '#DFEDF7', '': '#FFF9ED' };
const FONT = '"Zen Maru Gothic", "M PLUS Rounded 1c", system-ui, sans-serif';
const FONT_B = '"M PLUS Rounded 1c", "Zen Maru Gothic", system-ui, sans-serif';

export class LifeView {
  constructor(life, opts = {}) {
    this.life = life;
    this.dur = lifeDuration(life);
    this.elapsed = 0; // ×1 に換算した経過ミリ秒
    this.age = 0;
    this.next = 0; // 次に起きるできごとの番号
    this.ended = false;
    this.endWall = 0;
    this.bubble = null; // { e, t }
    this.pop = null; // アイコンだけのふきだし
    this.onEvent = opts.onEvent || null;
    this.onEnd = opts.onEnd || null;
    this.rng = makeRng(`walk:${life.seed}`);
    const a = areaFor(habitatAt(life, 0), moveOf(life, 0));
    this.x = a[0] + this.rng.range(-0.5, 0.5) * a[2];
    this.y = a[1] + this.rng.range(-0.5, 0.5) * a[3];
    this.tx = this.x; this.ty = this.y;
    this.wait = this.rng.range(200, 900);
    this.face = this.rng.chance(0.5) ? 1 : -1;
    this.hop = 0;
    this.phase = this.rng.range(0, 6.28);
    this.habId = habitatAt(life, 0);
    this.prevHab = null; this.habFade = 1;
  }

  get progress() { return Math.min(1, this.elapsed / this.dur); }

  // dt: 実際の経過ミリ秒, speed: 倍速
  update(dt, speed, now) {
    if (!this.ended) {
      this.elapsed = Math.min(this.dur, this.elapsed + dt * speed);
      this.age = this.life.span * (this.elapsed / this.dur);
      const ev = this.life.events;
      let last = null;
      while (this.next < ev.length && ev[this.next].age <= this.age) {
        last = ev[this.next];
        this.onEvent?.(this, last);
        this.next++;
      }
      if (last) { this.bubble = { e: last, t: now }; this.pop = { icon: last.icon, mood: last.mood, t: now }; }
      if (this.elapsed >= this.dur) {
        this.ended = true;
        this.endWall = now;
        this.age = this.life.span;
        this.bubble = { e: { text: this.life.death.text, icon: 'feather', mood: 'hard', death: true }, t: now };
        this.pop = { icon: 'feather', mood: 'hard', t: now };
        this.onEnd?.(this);
      }
    }
    // すみかが変わったら、ゆっくり切りかえる
    const h = habitatAt(this.life, this.age);
    if (h !== this.habId) {
      this.prevHab = this.habId; this.habId = h; this.habFade = 0;
      const a = areaFor(h, moveOf(this.life, this.age));
      this.x = a[0]; this.y = a[1]; this.tx = this.x; this.ty = this.y;
    }
    if (this.habFade < 1) this.habFade = Math.min(1, this.habFade + dt / 600);
    if (this.ended) return;
    // 歩く（実際の時間で動く。倍速が上がると少しだけ速く）
    const spr = spriteAt(this.life, this.age);
    const move = sprInfo(spr.id).move || 'walk';
    const v = SPEED[move] * Math.min(3, 1 + Math.log10(Math.max(1, speed)) * 0.7);
    if (this.wait > 0) { this.wait -= dt; return; }
    const dx = this.tx - this.x, dy = this.ty - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.004 || v === 0) {
      const a = areaFor(this.habId, move);
      const ang = this.rng.range(0, Math.PI * 2), r = Math.sqrt(this.rng.next());
      this.tx = a[0] + Math.cos(ang) * r * a[2];
      this.ty = a[1] + Math.sin(ang) * r * a[3];
      this.wait = move === 'swim' || move === 'fly' || move === 'float' ? this.rng.range(0, 300) : this.rng.range(300, 1800);
      return;
    }
    const step = Math.min(dist, (v * dt) / 1000);
    this.x += (dx / dist) * step; this.y += (dy / dist) * step;
    if (Math.abs(dx) > 0.002) this.face = dx < 0 ? 1 : -1; // 絵は左向き
    if (move === 'hop') this.hop += dt / 140;
  }

  // r: { x, y, w, h }（窓の箱庭の部分）, mode: { bubbles: 'full'|'icon'|'none', now }
  draw(g, r, mode) {
    const { life } = this;
    const now = mode.now;
    const S = r.w;
    // 箱庭
    const drawHab = (id, alpha) => {
      const im = IMG.hab[id];
      if (!im) { g.fillStyle = '#B9E6F7'; g.fillRect(r.x, r.y, r.w, r.h); return; }
      const c = scaledCanvas(im, r.w * mode.dpr, r.h * mode.dpr, `hab:${id}`);
      g.globalAlpha = alpha;
      g.drawImage(c, r.x, r.y, r.w, r.h);
      g.globalAlpha = 1;
    };
    if (this.habFade < 1 && this.prevHab) drawHab(this.prevHab, 1);
    drawHab(this.habId, this.habFade < 1 ? this.habFade : 1);

    // 生きもの
    const spr = spriteAt(life, this.age);
    const info = sprInfo(spr.id);
    const move = info.move || 'walk';
    const im = IMG.sp[spr.id];
    const meta = IMG.meta?.[spr.id];
    const rel = relSize(S);
    let hgt = S * rel * info.size * spr.scale;
    const t = now / 1000 + this.phase;
    let bob = 0, rot = 0;
    if (move === 'walk' && this.wait <= 0) bob = Math.abs(Math.sin(t * 9)) * hgt * 0.04;
    if (move === 'hop') bob = Math.abs(Math.sin(this.hop)) * hgt * 0.18;
    if (move === 'swim' || move === 'float') bob = Math.sin(t * 2) * hgt * 0.05;
    if (move === 'fly') bob = hgt * 0.35 + Math.sin(t * 5) * hgt * 0.08;
    if (move === 'still') rot = Math.sin(t * 3) * 0.06;
    const px = r.x + this.x * r.w, py = r.y + this.y * r.h;
    if (this.ended) g.globalAlpha = 0.8;
    // 足もとの影
    if (move !== 'swim' && move !== 'float') {
      g.fillStyle = 'rgba(73,56,47,.18)';
      g.beginPath(); g.ellipse(px, py, hgt * 0.32, hgt * 0.09, 0, 0, Math.PI * 2); g.fill();
    }
    if (im) {
      const iw = im.naturalWidth, ih = im.naturalHeight;
      const w = (hgt * iw) / ih;
      const ax = meta?.ax ?? 0.5, ay = move === 'swim' || move === 'float' ? 0.6 : meta?.ay ?? 0.96;
      const c = scaledCanvas(im, w * mode.dpr, hgt * mode.dpr, `sp:${spr.id}`);
      g.save();
      g.translate(px, py - bob);
      if (rot) g.rotate(rot);
      g.scale(this.face, 1);
      g.drawImage(c, -ax * w, -ay * hgt, w, hgt);
      g.restore();
      // 女王アリ・女王バチは、おとなのすがたのときに小さな王冠
      const queen = (life.variant.id === 'queen' || life.tags?.includes('queen')) && (spr.id === 'ant' || spr.id === 'bee');
      if (queen && hgt > 10) drawCrown(g, px, py - bob - hgt * 0.95, Math.max(6, hgt * 0.32));
    } else {
      g.fillStyle = '#FFB35D';
      g.beginPath(); g.arc(px, py - hgt * 0.4 - bob, hgt * 0.35, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;

    // おわった窓
    if (this.ended) {
      // おわった窓は うすい幕だけ（生きものが見えるように）。星は右上に小さく
      const k = Math.min(1, (now - this.endWall) / 500);
      g.fillStyle = `rgba(102,104,94,${0.16 * k})`;
      g.fillRect(r.x, r.y, r.w, r.h);
      const ss = Math.max(5, Math.min(14, S * 0.16));
      drawStar(g, r.x + r.w - ss - 2, r.y + ss + 2, ss * (0.6 + 0.4 * k), k);
    }

    // ふきだし
    if (mode.bubbles === 'full' && this.bubble && now - this.bubble.t < (this.bubble.e.death ? 1e9 : 2600 + this.bubble.e.text.length * 60)) {
      drawBubble(g, r, this.bubble.e, px, py - hgt - bob, now - this.bubble.t, mode);
    } else if (mode.bubbles !== 'none' && this.pop && now - this.pop.t < 1100 && !this.ended) {
      const k = (now - this.pop.t) / 1100;
      const s = Math.max(8, Math.min(26, S * 0.22)) * (k < 0.15 ? k / 0.15 : 1);
      const ic = IMG.icon[this.pop.icon];
      const y = py - hgt - bob - s * 0.6 - k * s * 0.4;
      g.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1;
      g.fillStyle = MOOD_BG[this.pop.mood || ''];
      g.beginPath(); g.arc(px, y, s * 0.62, 0, Math.PI * 2); g.fill();
      if (ic) g.drawImage(scaledCanvas(ic, s * mode.dpr, s * mode.dpr, `ic:${this.pop.icon}`), px - s / 2, y - s / 2, s, s);
      g.globalAlpha = 1;
    }
  }

  label() {
    const l = this.life;
    return l.name && l.species.kind === 'human' ? l.name : l.variant.label;
  }
  clock() { return clockText(this.age); }
}

// 窓が小さいほど、生きものを大きめに（34px の窓でも形が分かるように）
function relSize(S) {
  const a = Math.log(40), b = Math.log(320);
  const k = Math.max(0, Math.min(1, (Math.log(Math.max(1, S)) - a) / (b - a)));
  return 0.62 + (0.24 - 0.62) * k;
}

export function drawStar(g, x, y, s, a = 1) {
  g.save();
  g.globalAlpha = a;
  g.translate(x, y);
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? s * 0.45 : s;
    const an = -Math.PI / 2 + (i * Math.PI) / 5;
    g.lineTo(Math.cos(an) * rr, Math.sin(an) * rr);
  }
  g.closePath();
  g.fillStyle = '#FFD16B';
  g.strokeStyle = '#fff';
  g.lineWidth = Math.max(1, s * 0.16);
  g.lineJoin = 'round';
  g.stroke(); g.fill();
  g.restore();
}

function drawCrown(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.fillStyle = '#FFD16B'; g.strokeStyle = '#B07A1E'; g.lineWidth = Math.max(1, s * 0.08);
  g.beginPath();
  g.moveTo(-s / 2, s * 0.3); g.lineTo(-s / 2, -s * 0.2); g.lineTo(-s / 4, s * 0.05); g.lineTo(0, -s * 0.35);
  g.lineTo(s / 4, s * 0.05); g.lineTo(s / 2, -s * 0.2); g.lineTo(s / 2, s * 0.3); g.closePath();
  g.fill(); g.stroke();
  g.restore();
}

// 文字を幅に合わせて折り返す（日本語は1文字ずつ・空白で切れやすく）
export function wrap(g, text, maxW, maxLines = 3) {
  const out = [];
  let line = '';
  const parts = text.split(/(\s+)/);
  for (const p of parts) {
    if (!p) continue;
    const tryLine = line + p;
    if (g.measureText(tryLine.trim()).width <= maxW) { line = tryLine; continue; }
    if (line.trim()) out.push(line.trim());
    line = p.trim();
    while (g.measureText(line).width > maxW) {
      let k = line.length;
      while (k > 1 && g.measureText(line.slice(0, k)).width > maxW) k--;
      out.push(line.slice(0, k));
      line = line.slice(k);
    }
  }
  if (line.trim()) out.push(line.trim());
  if (out.length > maxLines) { out.length = maxLines; out[maxLines - 1] = out[maxLines - 1].replace(/.$/, '…'); }
  return out;
}

function drawBubble(g, r, e, cx, cy, dt, mode) {
  const S = r.w;
  const fs = Math.max(11, Math.min(17, S * 0.045));
  g.font = `700 ${fs}px ${FONT}`;
  const pad = fs * 0.7;
  const icon = fs * 1.5;
  const maxW = Math.min(S * 0.78, fs * 16);
  const lines = wrap(g, e.text, maxW - icon - pad * 2.4, 3);
  const tw = Math.max(...lines.map((l) => g.measureText(l).width));
  const bw = tw + icon + pad * 2.6;
  const bh = Math.max(icon, lines.length * fs * 1.35) + pad * 1.4;
  let bx = Math.max(r.x + 6, Math.min(r.x + r.w - bw - 6, cx - bw / 2));
  const top = r.y + (mode.topPad || 6);
  let by = Math.max(top, cy - bh - fs * 1.2);
  if (by + bh > cy - 4 && cy - bh - 10 < top) by = top;
  const k = Math.min(1, dt / 180);
  g.save();
  g.globalAlpha = k;
  g.translate(bx + bw / 2, by + bh);
  g.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k);
  g.translate(-(bx + bw / 2), -(by + bh));
  g.shadowColor = 'rgba(104,82,56,.18)'; g.shadowBlur = 8; g.shadowOffsetY = 2;
  g.fillStyle = MOOD_BG[e.mood || ''] || MOOD_BG[''];
  roundRect(g, bx, by, bw, bh, Math.min(18, bh / 2));
  g.fill();
  g.shadowColor = 'transparent';
  // しっぽ
  const tx = Math.max(bx + 14, Math.min(bx + bw - 14, cx));
  g.beginPath(); g.moveTo(tx - 7, by + bh - 1); g.lineTo(tx + 7, by + bh - 1); g.lineTo(tx + 2, Math.min(cy - 2, by + bh + 10)); g.closePath(); g.fill();
  g.strokeStyle = '#EEDCC5'; g.lineWidth = 1.2;
  roundRect(g, bx, by, bw, bh, Math.min(18, bh / 2)); g.stroke();
  const ic = IMG.icon[e.icon];
  if (ic) g.drawImage(scaledCanvas(ic, icon * mode.dpr, icon * mode.dpr, `ic:${e.icon}`), bx + pad * 0.8, by + (bh - icon) / 2, icon, icon);
  g.fillStyle = '#49382F';
  g.textBaseline = 'middle';
  const ty0 = by + bh / 2 - ((lines.length - 1) * fs * 1.35) / 2;
  lines.forEach((l, i) => g.fillText(l, bx + pad * 1.4 + icon, ty0 + i * fs * 1.35));
  g.restore();
}

export function roundRect(g, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export { FONT, FONT_B, MOOD_BG };
export const moveOfSprite = (id) => sprInfo(id).move || 'walk';
