// 1〜100の窓をまとめて動かす（1枚の canvas に全部描く）
//   窓がぽんぽん開く演出 → 一生が進む → 全部おわったら onAllEnd
import { LifeView, drawStar, roundRect, FONT_B } from './world.js?v=1.0.2';
import { easeOutBack } from './globe.js?v=1.0.2';

export class Runner {
  constructor(canvas, lives, opts) {
    this.c = canvas;
    this.g = canvas.getContext('2d');
    this.views = lives.map((l, i) => new LifeView(l, {
      onEvent: (v, e) => opts.onEvent?.(v, e, i),
      onEnd: (v) => this.endOne(v, i),
    }));
    this.speed = opts.speed || 1;
    this.paused = false;
    this.opts = opts;
    this.focus = -1; // 大きく見ている窓
    this.openT0 = performance.now();
    this.alive = lives.length;
    this.done = false;
    this.last = performance.now();
    this.raf = 0;
    this.layout();
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(canvas);
    canvas.addEventListener('click', (e) => this.click(e));
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.dead = true;
  }

  endOne(v, i) {
    this.alive--;
    this.opts.onEndOne?.(v, i);
    if (this.alive <= 0 && !this.done) {
      this.done = true;
      setTimeout(() => this.opts.onAllEnd?.(), 900);
    }
  }

  skip() {
    for (const v of this.views) v.elapsed = Math.max(v.elapsed, v.dur);
  }

  layout() {
    const rect = this.c.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.dpr = dpr;
    this.W = rect.width; this.H = rect.height;
    this.c.width = Math.round(rect.width * dpr);
    this.c.height = Math.round(rect.height * dpr);
    const n = this.views.length;
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const gap = n >= 100 ? 2 : n >= 25 ? 4 : n > 1 ? 8 : 0;
    const bar = n === 1 ? 0 : n <= 9 ? 26 : n <= 25 ? 16 : 0;
    const pad = n === 1 ? 0 : 4;
    const tw = Math.floor(Math.min((this.W - pad * 2 - gap * (cols - 1)) / cols, (this.H - pad * 2 - gap * (rows - 1)) / rows - bar));
    const gw = cols * tw + gap * (cols - 1), gh = rows * (tw + bar) + gap * (rows - 1);
    const ox = (this.W - gw) / 2, oy = (this.H - gh) / 2;
    this.tile = tw; this.bar = bar;
    this.rects = this.views.map((_, i) => {
      const cx = i % cols, cy = Math.floor(i / cols);
      return { x: ox + cx * (tw + gap), y: oy + cy * (tw + bar + gap), w: tw, h: tw + bar };
    });
    // 開くときの最初の位置（中央ちかくに、OS の窓のようにずらして重なる）
    const rr = this.views.map((_, i) => {
      const k = i % 12;
      return { x: this.W / 2 - tw * 0.6 + (k - 6) * Math.min(18, this.W / 40) + ((i * 37) % 23) - 11, y: this.H / 2 - tw * 0.6 + (k - 6) * Math.min(14, this.H / 50) + ((i * 53) % 19) - 9 };
    });
    this.from = rr;
  }

  click(e) {
    const r = this.c.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const i = this.rects.findIndex((q) => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h);
    if (i >= 0) this.opts.onTap?.(i, this.views[i]);
  }

  loop(now) {
    if (this.dead) return;
    const dt = Math.min(100, now - this.last);
    this.last = now;
    const n = this.views.length;
    const openDur = n === 1 ? 500 : Math.min(1300, 450 + n * 8);
    const stagger = n === 1 ? 0 : Math.min(900 / n, 120);
    const opened = now - this.openT0;
    for (let i = 0; i < n; i++) {
      const v = this.views[i];
      const start = i * stagger + 250;
      if (opened < start + 200) continue; // 開ききる少し前から生きはじめる
      if (!this.paused) v.update(dt, this.speed, now);
      else v.update(0, 0, now);
    }
    this.draw(now, opened, stagger, openDur);
    this.opts.onFrame?.(this, now);
    this.raf = requestAnimationFrame(this.loop);
  }

  draw(now, opened, stagger) {
    const g = this.g, dpr = this.dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, this.W, this.H);
    const n = this.views.length;
    const bubbles = this.tile >= 240 ? 'full' : this.tile >= 30 ? 'icon' : 'none';
    for (let i = 0; i < n; i++) {
      const v = this.views[i];
      const R = this.rects[i];
      let t = (opened - i * stagger - 120) / 380;
      if (t <= 0) continue;
      t = Math.min(1, t);
      const e = easeOutBack(t);
      // 開く途中: 中央の重なった位置から、グリッドの位置へ
      const f = this.from[i];
      const x = n === 1 ? R.x : f.x + (R.x - f.x) * Math.min(1, t * 1.2);
      const y = n === 1 ? R.y : f.y + (R.y - f.y) * Math.min(1, t * 1.2);
      const s = 0.3 + 0.7 * e;
      g.save();
      g.translate(x + R.w / 2, y + R.h / 2);
      g.scale(s, s);
      g.translate(-R.w / 2, -R.h / 2);
      g.globalAlpha = Math.min(1, t * 2.5);
      this.drawWindow(g, v, { x: 0, y: 0, w: R.w, h: R.h }, now, bubbles, i);
      g.restore();
    }
  }

  drawWindow(g, v, R, now, bubbles, i) {
    const n = this.views.length;
    const rad = n >= 100 ? 4 : n >= 25 ? 8 : n > 1 ? 14 : 0;
    const bar = this.bar;
    // 枠と影
    const dense = n >= 25;
    if (n > 1 && !dense) {
      g.save();
      g.shadowColor = 'rgba(104,82,56,.16)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
      g.fillStyle = '#FFFCF5';
      roundRect(g, R.x, R.y, R.w, R.h, rad); g.fill();
      g.restore();
    } else if (dense) {
      // 窓が多いときは影なし（重いので）。下に1画素の線だけ
      g.fillStyle = 'rgba(104,82,56,.22)';
      g.fillRect(R.x + 1, R.y + R.h - 0.5, R.w - 2, 1.5);
    }
    g.save();
    if (dense) { g.beginPath(); g.rect(R.x, R.y, R.w, R.h); } else roundRect(g, R.x, R.y, R.w, R.h, rad);
    g.clip();
    const scene = { x: R.x, y: R.y + bar, w: R.w, h: R.w };
    v.draw(g, scene, { bubbles, now, dpr: this.dpr, topPad: n === 1 ? 78 : 6 }); // 1つのときは年齢の札の下から
    // 進みぐあいの細い帯
    if (n > 1) {
      const hh = n >= 100 ? 2 : 3;
      g.fillStyle = 'rgba(255,255,255,.7)';
      g.fillRect(scene.x, scene.y + scene.h - hh, scene.w, hh);
      g.fillStyle = v.ended ? '#FFD16B' : '#269FE8';
      g.fillRect(scene.x, scene.y + scene.h - hh, scene.w * v.progress, hh);
    }
    g.restore();
    // タイトルの帯（OS の窓ふう）
    if (bar) {
      g.save();
      roundRect(g, R.x, R.y, R.w, bar + rad, rad);
      g.clip();
      g.fillStyle = v.ended ? '#EDE6DA' : '#FFF9ED';
      g.fillRect(R.x, R.y, R.w, bar);
      g.fillStyle = '#EEDCC5';
      g.fillRect(R.x, R.y + bar - 1, R.w, 1);
      const fs = Math.max(9, Math.min(13, bar * 0.5));
      g.font = `700 ${fs}px ${FONT_B}`;
      g.textBaseline = 'middle';
      const left = R.x + 8;
      const clock = v.ended ? 'おしまい' : v.clock();
      const cw = g.measureText(clock).width;
      g.fillStyle = v.ended ? '#88786C' : '#249FDC';
      g.textAlign = 'right';
      g.fillText(clock, R.x + R.w - 6, R.y + bar / 2 + 1);
      g.textAlign = 'left';
      g.fillStyle = '#49382F';
      let label = v.label();
      const room = R.x + R.w - 10 - cw - left;
      while (label.length > 1 && g.measureText(label).width > room) label = label.slice(0, -1);
      if (room > fs) g.fillText(label === v.label() ? label : label.slice(0, -1) + '…', left, R.y + bar / 2 + 1);
      g.restore();
    }
    if (this.focus === i) {
      g.strokeStyle = '#FF8179'; g.lineWidth = 2;
      roundRect(g, R.x + 1, R.y + 1, R.w - 2, R.h - 2, rad); g.stroke();
    }
  }
}

export { drawStar };
