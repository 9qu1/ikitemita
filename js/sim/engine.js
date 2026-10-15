// 一生をつくる心臓部。種（seed）とうまれさきの設定から、決まった一生を1つ返す
//   どの種類（ひと・どうぶつ・むし）も同じ形のデータ（species/*.js）で動く。書き方は CONTENT.md
import { makeRng } from '../rng.js?v=1.0.0';
import { SPECIES, SPECIES_BY_ID } from './species/index.js?v=1.0.0';
import { spanText } from './format.js?v=1.0.0';

// データを変えて同じ種でも一生が変わるときは上げる（共有の URL に入る）
export const DATA_VERSION = 1;

export const KINDS = { human: 'ひと', animal: 'どうぶつ', bug: 'むし' };
export const FILTERS = [
  { id: 'all', label: 'おまかせ' },
  { id: 'human', label: 'ひと' },
  { id: 'animal', label: 'どうぶつ' },
  { id: 'bug', label: 'むし' },
  { id: 'real', label: 'ほんとうの数' },
];

// アイコンの名前（img/icons の絵と対になる）
export const ICONS = [
  'birth', 'heart', 'friends', 'apple', 'fish', 'house', 'school', 'work', 'rings', 'baby', 'plane', 'sun', 'rain', 'snow', 'bandage', 'alert',
  'sleep', 'music', 'star', 'gift', 'flower', 'sprout', 'egg', 'drop', 'phone', 'ball', 'coin', 'cake', 'box', 'look', 'feather', 'crown',
];

// 数え方（種類のファイルに counter があればそちら）
const COUNTER = { sparrow: '羽', owl: '羽', penguin: '羽', lion: '頭', elephant: '頭', whale: '頭', seaotter: '頭', sloth: '頭' };

// おまかせのときの出やすさ（ひと・どうぶつ・むしを同じくらいに）
const KIND_SHARE = [{ k: 'human', w: 1 }, { k: 'animal', w: 1 }, { k: 'bug', w: 1 }];

export function pickSpecies(rng, filter = 'all') {
  if (filter === 'real') return rng.weighted(SPECIES, (s) => s.realCount || 0);
  let kind = filter;
  if (!KINDS[kind]) kind = rng.weighted(KIND_SHARE).k;
  const pool = SPECIES.filter((s) => s.kind === kind);
  return rng.weighted(pool.length ? pool : SPECIES, (s) => s.weight ?? 1);
}

// ---- 生き残りの曲線 [[日, 生きている割合], ...]（最初は [0,1]、最後は割合0）----
export function survivalAt(curve, d) {
  if (d <= 0) return 1;
  for (let i = 0; i < curve.length - 1; i++) {
    const [d0, s0] = curve[i], [d1, s1] = curve[i + 1];
    if (d > d1) continue;
    const f = (d - d0) / (d1 - d0 || 1);
    if (s1 > 0 && s0 > 0) return s0 * Math.pow(s1 / s0, f);
    return s0 + (s1 - s0) * f;
  }
  return 0;
}

export function sampleSpan(curve, u) {
  for (let i = 0; i < curve.length - 1; i++) {
    const [d0, s0] = curve[i], [d1, s1] = curve[i + 1];
    if (!(u > s1 && u <= s0)) continue;
    if (s1 > 0) return d0 + (d1 - d0) * (Math.log(u / s0) / Math.log(s1 / s0));
    return d0 + (d1 - d0) * ((s0 - u) / s0);
  }
  return curve[curve.length - 1][0];
}

// ---- 種類ごとの準備（ひとは species/human.js が自分で持つ）----
function defaultSetup(sp, rng) {
  const v = rng.weighted(sp.variants);
  const tags = [...(sp.tags || []), ...(v.tags || []), `v-${v.id}`];
  let sex = null;
  if (sp.sexes) {
    sex = rng.weighted(Object.entries(sp.sexes).map(([k, w]) => ({ k, w }))).k;
    tags.push(sex);
  }
  const place = v.places ? rng.pick(v.places) : { text: v.label };
  const names = v.names || (sex && sp.names?.[sex]) || null;
  return {
    variant: v,
    tags,
    sex,
    sexLabel: sex ? (sp.sexLabels?.[sex] ?? (sex === 'm' ? 'オス' : 'メス')) : '',
    name: names ? rng.pick(names) : null,
    place,
    survival: (sex && (v.survivalSex?.[sex] || sp.survivalSex?.[sex])) || v.survival || sp.survival, // 性別で寿命がちがうときは survivalSex: { m, f }
    habitat: v.habitat || sp.habitat,
    fields: { ...(v.fields || {}) },
    events: v.events || [],
  };
}

const asArr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);

function fill(text, life, n) {
  return text.replace(/\{(\w+)\}/g, (all, k) => {
    if (k === 'n') return n == null ? '' : String(n);
    if (k === 'sp') return life.species.name;
    if (k === 'name') return life.name || life.species.name;
    if (k === 'place') return life.place.text;
    if (life.fields[k] != null) return String(life.fields[k]);
    if (life.stats?.[k] != null) return String(life.stats[k]);
    return all;
  });
}

// ---- 一生をつくる ----
//   filter: うまれさき（FILTERS の id）/ only: 種類を決め打ち（確かめ用）
export function makeLife(seed, filter = 'all', only = null) {
  const rng = makeRng(`ikitemita${DATA_VERSION}:${filter}:${seed}`);
  const sp = only ? SPECIES_BY_ID[only] : pickSpecies(rng, filter);
  const base = sp.setup ? sp.setup(rng) : defaultSetup(sp, rng);
  const span = Math.max(1 / 48, sampleSpan(base.survival, rng.next()));

  const life = {
    seed, filter, version: DATA_VERSION,
    species: { id: sp.id, name: sp.name, kind: sp.kind },
    counter: sp.counter || COUNTER[sp.id] || (sp.kind === 'human' ? '人' : '匹'), // 数え方（1000匹に1匹 など）
    variant: { id: base.variant.id, label: base.variant.label || sp.name },
    sex: base.sex, sexLabel: base.sexLabel || '',
    name: base.name,
    place: base.place,
    fields: base.fields || {},
    span,
    refDays: base.variant.refDays || sp.refDays,
    pct: survivalAt(base.survival, span), // 同じときにうまれた仲間のうち、この年まで生きた割合
    spriteSuffix: base.spriteSuffix || '',
    stages: sp.stages.map((s) => ({ ...s })),
    habitats: [{ from: 0, id: base.habitat }],
    looks: [],
    events: [],
    stats: {},
    statDefs: sp.stats || [],
  };

  // 年齢の決まったできごと（ひとの学校・結婚・子どもなど）は plan が足す
  const planned = sp.plan ? sp.plan(rng, life, base) : [];

  const tagAge = new Map();
  for (const t of base.tags || []) tagAge.set(t, -1);
  const groups = new Set();
  const out = [];

  const all = [...(sp.events || []), ...(base.events || []), ...planned];
  const tmpl = all.filter((t) => !t.after)
    .map((t, i) => ({ ...t, _i: i, _a0: t.age ?? asArr(t.at)[0] ?? 0 }))
    .sort((a, b) => a._a0 - b._a0 || a._i - b._i);
  // after: 'タグ' のできごとは、そのタグがついた年齢からの日数で at を書く（ふつうのできごとのあとで、書いた順に）
  const later = all.filter((t) => t.after);
  const resolveAfter = (t) => {
    if (!tagAge.has(t.after)) return null;
    const base0 = Math.max(0, tagAge.get(t.after));
    const [a, b] = asArr(t.at ?? 0);
    return { ...t, at: [base0 + (a ?? 0), base0 + (b ?? a ?? 0)], _a0: base0 + (a ?? 0), need: [...asArr(t.need)] };
  };

  const runOne = (t) => {
    if (t._a0 >= span) return;
    if (t.p != null && t.p < 1 && !rng.chance(t.p)) return;
    if (t.group && groups.has(t.group)) return;
    let minAge = t._a0;
    let ok = true;
    for (const need of asArr(t.need)) {
      if (need[0] === '!') { if (tagAge.has(need.slice(1))) ok = false; }
      else if (!tagAge.has(need)) ok = false;
      else minAge = Math.max(minAge, tagAge.get(need) + 1e-3);
    }
    if (!ok) return;
    const hi = t.age != null ? t.age : Math.min(asArr(t.at)[1] ?? t._a0, span);
    if (minAge > hi) return;
    const times = t.repeat ? rng.int(t.repeat[0], t.repeat[1]) : 1;
    let first = null;
    let n = null;
    const bag = Array.isArray(t.text) ? [...t.text] : null;
    for (let k = 0; k < times; k++) {
      const age = t.age != null ? Math.max(t.age, minAge) : rng.range(minAge, hi);
      if (age >= span) continue;
      if (t.add) {
        for (const [key, val] of Object.entries(t.add)) {
          const v = Array.isArray(val) ? rng.int(val[0], val[1]) : val;
          if (n == null) n = v;
          life.stats[key] = (life.stats[key] || 0) + v;
        }
      }
      if (t.silent) { if (first == null || age < first) first = age; n = null; continue; } // 数とタグだけ（文は出さない）
      let text = t.text;
      if (bag) { if (!bag.length) bag.push(...t.text); text = bag.splice(Math.floor(rng.next() * bag.length), 1)[0]; }
      out.push({ age, text: fill(text, life, n ?? t.n), icon: t.icon || 'sprout', mood: t.mood || '', big: t.big || 0, move: t.move || null });
      // look: { id, for: [最短, 最長] } … この日数だけ、すがたの絵を変える（乾眠の「たる」、若返りのポリプなど）
      if (t.look) life.looks.push({ from: age, to: age + rng.range(t.look.for[0], t.look.for[1]), id: t.look.id, scale: t.look.scale });
      if (first == null || age < first) first = age;
      n = null;
    }
    if (first == null) return;
    if (t.group) groups.add(t.group);
    for (const s of asArr(t.set)) if (!tagAge.has(s)) tagAge.set(s, first);
  };
  for (const t of tmpl) runOne(t);
  for (const t0 of later) { const t = resolveAfter(t0); if (t) runOne(t); }

  // うまれた・すがたが変わった
  out.push({ age: 0, text: fill(Array.isArray(sp.birth) ? rng.pick(sp.birth) : sp.birth || '{place}で うまれた', life), icon: 'birth', mood: 'good', big: 1, birth: true });
  for (const s of life.stages) {
    if (s.say && s.from > 0 && s.from < span) out.push({ age: s.from, text: fill(Array.isArray(s.say) ? rng.pick(s.say) : s.say, life), icon: s.icon || 'sprout', mood: '', big: s.big || 0 });
  }
  for (const s of life.stages) if (s.habitat && s.from < span) life.habitats.push({ from: s.from, id: s.habitat });

  // さいご
  const deaths = (sp.deaths || []).filter((d) => {
    const [a, b] = asArr(d.at);
    if (a != null && span < a) return false;
    if (b != null && span > b) return false;
    return asArr(d.need).every((need) => (need[0] === '!' ? !tagAge.has(need.slice(1)) : tagAge.has(need) && tagAge.get(need) < span));
  });
  const death = deaths.length ? rng.weighted(deaths) : { text: 'しずかに いのちを 終えた' };
  life.death = { age: span, text: fill(Array.isArray(death.text) ? rng.pick(death.text) : death.text, life), icon: 'feather' };

  out.sort((a, b) => a.age - b.age);
  life.events = out.filter((e) => e.age < span);
  for (const e of life.events) if (e.move) life.habitats.push({ from: e.age, id: e.move });
  life.habitats.sort((a, b) => a.from - b.from);
  life.tags = [...tagAge.keys()];

  // カードにのせる「見どころ」5つ
  const scored = life.events.filter((e) => !e.birth).map((e) => ({ e, s: e.big * 10 + (e.mood ? 2 : 0) + rng.next() * 3 }));
  scored.sort((a, b) => b.s - a.s);
  life.highlights = scored.slice(0, 5).map((x) => x.e).sort((a, b) => a.age - b.age);

  // いきざま（ひとことの肩書き）
  life.title = pickTitle(sp, life, tagAge, rng);
  life.fact = sp.facts?.length ? rng.pick(sp.facts) : '';
  life.spanText = spanText(span);
  return life;
}

function pickTitle(sp, life, tagAge, rng) {
  const ok = (t) => {
    if (t.need && !asArr(t.need).every((n) => (n[0] === '!' ? !tagAge.has(n.slice(1)) : tagAge.has(n)))) return false;
    if (t.minAge != null && life.span < t.minAge) return false;
    if (t.maxAge != null && life.span > t.maxAge) return false;
    if (t.stat && !Object.entries(t.stat).every(([k, v]) => (life.stats[k] || 0) >= v)) return false;
    if (t.long && life.pct > t.long) return false; // 仲間のうち上位 long の割合まで生きた
    if (t.short && life.pct < t.short) return false; // 仲間のうち short の割合より早く終わった
    return true;
  };
  const hit = (sp.titles || []).filter(ok);
  if (hit.length) return fill(rng.pick(hit).text, life);
  if (life.pct < 0.02) return `${sp.name}のなかでも 指おりの長生き`;
  if (life.pct < 0.15) return `長生きの${sp.name}`;
  if (life.pct > 0.95) return 'かけぬけた ちいさな いのち';
  return sp.kind === 'human' ? '世界に ひとりだけの、ふつうの 一生' : `どこにでもいる、たった1${life.counter}の ${sp.name}`;
}

// 年齢 d のときのすがた・すみか（窓の絵で使う）
export function stageAt(life, d) {
  let s = life.stages[0];
  for (const x of life.stages) if (x.from <= d) s = x;
  return s;
}
export function habitatAt(life, d) {
  let h = life.habitats[0].id;
  for (const x of life.habitats) if (x.from <= d) h = x.id;
  return h;
}
export function spriteAt(life, d) {
  const s = stageAt(life, d);
  for (let i = (life.looks?.length || 0) - 1; i >= 0; i--) {
    const k = life.looks[i];
    if (d >= k.from && d < k.to) return { id: k.id, scale: k.scale ?? s.scale ?? 1, stage: s };
  }
  return { id: s.sprite + (s.tone === false ? '' : life.spriteSuffix), scale: s.scale ?? 1, stage: s };
}
