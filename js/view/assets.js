// 絵の読みこみと、大きさごとの写し（毎コマ大きな絵を縮めると重いので、使う大きさの写しを作っておく）
const BASE = new URL('../../img/', import.meta.url);
const cache = new Map();

export function loadImg(path) {
  if (cache.has(path)) return cache.get(path);
  const p = new Promise((res) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = new URL(path, BASE).href;
  });
  cache.set(path, p);
  return p;
}

export const IMG = { hab: {}, sp: {}, icon: {}, meta: {} };

export const habPath = (id) => `hab/${id}.webp`;
export const spPath = (id) => `sp/${id}.webp`;
export const iconPath = (id) => `icons/${id}.webp`;

let metaP = null;
export function loadMeta() {
  metaP ||= fetch(new URL('sprites.json', BASE)).then((r) => r.json()).then((m) => (IMG.meta = m)).catch(() => (IMG.meta = {}));
  return metaP;
}

// 一生たちが使う絵を全部読む（読みおわるまで待てる）
export async function loadForLives(lives, { stagesAll = true } = {}) {
  const hab = new Set(), sp = new Set();
  for (const l of lives) {
    for (const h of l.habitats) hab.add(h.id);
    for (const s of l.stages) if (stagesAll || s.from === 0) sp.add(s.sprite + (l.spriteSuffix || ''));
    for (const k of l.looks || []) sp.add(k.id);
  }
  await Promise.all([
    loadMeta(),
    ...[...hab].map(async (id) => { IMG.hab[id] ||= await loadImg(habPath(id)); }),
    ...[...sp].map(async (id) => { IMG.sp[id] ||= await loadImg(spPath(id)); }),
  ]);
}

export async function loadIcons(names) {
  await Promise.all(names.map(async (n) => { IMG.icon[n] ||= await loadImg(iconPath(n)); }));
}

// 大きさごとの写し（キーは 絵・幅・高さ）
const scaled = new Map();
export function scaledCanvas(im, w, h, key) {
  if (!im) return null;
  w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
  const k = `${key}|${w}x${h}`;
  let c = scaled.get(k);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.imageSmoothingQuality = 'high';
  // 大きく縮めるときは半分ずつ（にじみを減らす）
  let src = im, sw = im.naturalWidth || im.width, sh = im.naturalHeight || im.height;
  while (sw / 2 > w * 1.5 && sh / 2 > h * 1.5) {
    const t = document.createElement('canvas');
    t.width = Math.round(sw / 2); t.height = Math.round(sh / 2);
    const tg = t.getContext('2d'); tg.imageSmoothingQuality = 'high';
    tg.drawImage(src, 0, 0, t.width, t.height);
    src = t; sw = t.width; sh = t.height;
  }
  g.drawImage(src, 0, 0, w, h);
  scaled.set(k, c);
  if (scaled.size > 900) scaled.delete(scaled.keys().next().value);
  return c;
}
