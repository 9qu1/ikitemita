// うまれる場所を見せる、くるくる回る小さな地球儀（canvas・1画素ずつ球に貼る）
//   陸の形は data/land.json（Natural Earth 110m）。テクスチャは正距円筒図法で1回だけ描く
const TEX_W = 720, TEX_H = 360;
let tex = null;
let landPromise = null;

const COL = { sea: [120, 205, 226], sea2: [150, 220, 236], land: [185, 217, 120], landEdge: [120, 170, 96], ice: [246, 250, 250] };

function loadLand() {
  landPromise ||= fetch(new URL('../../data/land.json', import.meta.url)).then((r) => r.json()).catch(() => []);
  return landPromise;
}

async function texture() {
  if (tex) return tex;
  const rings = await loadLand();
  const c = document.createElement('canvas');
  c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, TEX_H);
  grd.addColorStop(0, `rgb(${COL.sea2})`); grd.addColorStop(0.5, `rgb(${COL.sea})`); grd.addColorStop(1, `rgb(${COL.sea2})`);
  g.fillStyle = grd; g.fillRect(0, 0, TEX_W, TEX_H);
  const X = (lon) => ((lon + 180) / 360) * TEX_W, Y = (lat) => ((90 - lat) / 180) * TEX_H;
  g.lineJoin = 'round';
  for (const pass of ['stroke', 'fill']) {
    for (const r of rings) {
      g.beginPath();
      let px = null;
      for (let i = 0; i < r.length; i += 2) {
        const x = X(r[i]), y = Y(r[i + 1]);
        if (px == null) g.moveTo(x, y);
        else if (Math.abs(x - px) > TEX_W / 2) { g.moveTo(x, y); } // 日付変更線をまたぐところは線を切る
        else g.lineTo(x, y);
        px = x;
      }
      g.closePath();
      if (pass === 'stroke') { g.strokeStyle = `rgb(${COL.landEdge})`; g.lineWidth = 3; g.stroke(); }
      else { g.fillStyle = `rgb(${COL.land})`; g.fill(); }
    }
  }
  // 南極（輪がうまく閉じないので帯で）
  g.fillStyle = `rgb(${COL.ice})`;
  g.fillRect(0, Y(-79), TEX_W, TEX_H - Y(-79));
  g.fillRect(0, 0, TEX_W, Y(82));
  tex = g.getImageData(0, 0, TEX_W, TEX_H).data;
  return tex;
}

export function preloadGlobe() { texture(); }

// 地球儀を描く: center = { lon, lat }（正面に来る場所）, pins = [{ lon, lat, color }]
export class Globe {
  constructor(canvas) {
    this.c = canvas;
    this.g = canvas.getContext('2d');
    this.ready = texture();
  }

  draw({ lon0, lat0, pins = [], pinT = 1 }) {
    const { c, g } = this;
    const W = c.width, Hh = c.height;
    const R = Math.min(W, Hh) * 0.42;
    const cx = W / 2, cy = Hh / 2;
    g.clearRect(0, 0, W, Hh);
    if (!tex) return;
    const img = g.createImageData(W, Hh);
    const d = img.data;
    const l0 = (lon0 * Math.PI) / 180, p0 = (lat0 * Math.PI) / 180;
    const sp0 = Math.sin(p0), cp0 = Math.cos(p0);
    const x0 = Math.max(0, Math.floor(cx - R)), x1 = Math.min(W, Math.ceil(cx + R));
    const y0 = Math.max(0, Math.floor(cy - R)), y1 = Math.min(Hh, Math.ceil(cy + R));
    for (let py = y0; py < y1; py++) {
      const y = (cy - py - 0.5) / R;
      for (let px = x0; px < x1; px++) {
        const x = (px + 0.5 - cx) / R;
        const r2 = x * x + y * y;
        if (r2 > 1) continue;
        const z = Math.sqrt(1 - r2);
        // 正射図法の逆変換（正面が lon0, lat0）
        const lat = Math.asin(z * sp0 + y * cp0);
        const lon = l0 + Math.atan2(x, z * cp0 - y * sp0);
        let u = ((lon / Math.PI + 1) / 2) % 1; if (u < 0) u += 1;
        const v = 0.5 - lat / Math.PI;
        const ti = ((Math.min(TEX_H - 1, (v * TEX_H) | 0) * TEX_W) + ((u * TEX_W) | 0)) * 4;
        // 左上から光（やわらかく）
        const light = 0.72 + 0.34 * Math.max(0, -0.45 * x + 0.55 * y + 0.7 * z);
        const edge = r2 > 0.94 ? 1 - (r2 - 0.94) * 4 : 1;
        const o = (py * W + px) * 4;
        d[o] = Math.min(255, tex[ti] * light);
        d[o + 1] = Math.min(255, tex[ti + 1] * light);
        d[o + 2] = Math.min(255, tex[ti + 2] * light);
        d[o + 3] = 255 * Math.max(0, Math.min(1, edge * 1.2));
      }
    }
    g.putImageData(img, 0, 0);
    // ふち・つや
    g.save();
    g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2);
    g.lineWidth = Math.max(2, R * 0.03); g.strokeStyle = 'rgba(255,255,255,.85)'; g.stroke();
    const shine = g.createRadialGradient(cx - R * 0.4, cy - R * 0.45, R * 0.05, cx - R * 0.35, cy - R * 0.4, R * 0.7);
    shine.addColorStop(0, 'rgba(255,255,255,.55)'); shine.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = shine; g.fill();
    g.restore();
    // ピン
    for (const p of pins) {
      const lat = (p.lat * Math.PI) / 180, lon = (p.lon * Math.PI) / 180 - l0;
      const cosc = sp0 * Math.sin(lat) + cp0 * Math.cos(lat) * Math.cos(lon);
      if (cosc < 0.05) continue;
      const x = cx + R * Math.cos(lat) * Math.sin(lon);
      const y = cy - R * (cp0 * Math.sin(lat) - sp0 * Math.cos(lat) * Math.cos(lon));
      const t = Math.max(0, Math.min(1, (pinT - (p.delay || 0)) / 0.35));
      if (t <= 0) continue;
      const drop = (1 - easeOutBack(t)) * R * 0.25;
      const s = (p.size || R * 0.07) * Math.min(1, t * 1.5);
      g.save();
      g.globalAlpha = Math.min(1, t * 2) * Math.min(1, cosc * 3);
      g.fillStyle = 'rgba(73,56,47,.25)';
      g.beginPath(); g.ellipse(x, y + s * 0.15, s * 0.45, s * 0.18, 0, 0, Math.PI * 2); g.fill();
      g.translate(x, y - drop);
      g.fillStyle = p.color || '#FF8179';
      g.beginPath();
      g.moveTo(0, 0);
      g.bezierCurveTo(-s * 0.7, -s * 0.9, -s * 0.55, -s * 1.7, 0, -s * 1.7);
      g.bezierCurveTo(s * 0.55, -s * 1.7, s * 0.7, -s * 0.9, 0, 0);
      g.fill();
      g.lineWidth = Math.max(1, s * 0.12); g.strokeStyle = '#fff'; g.stroke();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(0, -s * 1.15, s * 0.25, 0, Math.PI * 2); g.fill();
      g.restore();
    }
  }
}

export const easeOutBack = (t) => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
