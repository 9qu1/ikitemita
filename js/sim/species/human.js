// ひと: 世界のどこかの国にうまれる。国の統計（出生数・寿命・乳児死亡・都市の割合・出生率など）から一生を組み立てる
//   国のデータは ../data/countries.js、できごとの文は ./human-events.js
import { M, Y } from '../units.js?v=1.0.2';
import { COUNTRIES, REGIONS } from '../data/countries.js?v=1.0.2';
import HE from './human-events.js?v=1.0.2';

// 事故などの「年齢によらない」死亡のしやすさ（所得の段階ごと）と、年をとるごとの増え方
const BG = { L: 0.0035, LM: 0.002, UM: 0.0012, H: 0.0004 };
const BETA = 0.09;
const MAX_AGE = 112;

const cache = new Map();

// 国と性別から、生き残りの曲線をつくる（乳児・5歳まで・おとなの死亡を、平均寿命に合うように調整）
export function lifeTable(c, sex) {
  const key = `${c.id}:${sex}`;
  if (cache.has(key)) return cache.get(key);
  const e0 = sex === 'f' ? c.e0f : c.e0m;
  const q0 = Math.min(0.3, (c.imr / 1000) * (sex === 'm' ? 1.1 : 0.9));
  const q14 = Math.min(0.3, (Math.max(0, c.u5 - c.imr) / (1000 - c.imr)) * (sex === 'm' ? 1.05 : 0.95));
  const lam = BG[c.inc] ?? 0.0015;
  const build = (alpha) => {
    const pts = [[0, 1], [28, 1 - 0.55 * q0], [Y, 1 - q0]];
    let s = 1 - q0;
    for (let a = 2; a <= 5; a++) { s *= Math.pow(1 - q14, 1 / 4); pts.push([a * Y, s]); }
    for (let a = 5; a < MAX_AGE; a++) {
      s *= Math.exp(-(lam + (alpha * Math.exp(BETA * a) * (Math.exp(BETA) - 1)) / BETA));
      if (s < 1e-5) break;
      pts.push([(a + 1) * Y, s]);
    }
    pts.push([pts[pts.length - 1][0] + Y, 0]);
    return pts;
  };
  const meanAge = (pts) => {
    let sum = 0;
    for (let i = 0; i < pts.length - 1; i++) sum += ((pts[i][1] + pts[i + 1][1]) / 2) * (pts[i + 1][0] - pts[i][0]);
    return sum / Y;
  };
  let lo = Math.log(1e-9), hi = Math.log(0.2);
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (meanAge(build(Math.exp(mid))) > e0) lo = mid; else hi = mid;
  }
  const pts = build(Math.exp((lo + hi) / 2));
  cache.set(key, pts);
  return pts;
}

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

export default {
  id: 'human',
  name: 'ひと',
  kind: 'human',
  weight: 1,
  realCount: 8.2e9,
  refDays: 95 * Y,
  habitat: 'town',
  birth: HE.birth,
  stages: [
    { id: 'baby', name: '赤ちゃん', from: 0, sprite: 'human_baby', scale: 0.75 },
    { id: 'child', name: 'こども', from: 3 * Y, sprite: 'human_child', scale: 0.9 },
    { id: 'adult', name: 'おとな', from: 18 * Y, sprite: 'human_adult', scale: 1, say: 'おとなに なった', icon: 'star' },
    { id: 'elder', name: 'おとしより', from: 65 * Y, sprite: 'human_elder', scale: 0.98 },
  ],
  stats: [
    { id: 'kids', label: '子ども', unit: '人' },
    { id: 'grandkids', label: '孫', unit: '人' },
    { id: 'friends', label: 'ともだち', unit: '人' },
    { id: 'moves', label: '引っこし', unit: '回' },
  ],
  events: HE.events,
  deaths: HE.deaths,
  titles: HE.titles,
  facts: HE.facts,
  sources: HE.sources,

  setup(rng) {
    const c = rng.weighted(COUNTRIES, 'births');
    const reg = REGIONS[c.region];
    const sex = rng.chance(0.512) ? 'm' : 'f';
    const urban = rng.chance(c.urban / 100);
    const tone = rng.weighted(Object.entries(c.tone || reg.tone).map(([k, w]) => ({ k, w }))).k; // 国ごとの上書きがあればそちら
    const city = urban ? rng.pick(c.cities) : null;
    const village = rng.pick(reg.village);
    const name = rng.pick(c.names[sex]);
    return {
      variant: { id: c.id, label: `${c.name}の ひと` },
      country: c,
      tags: [sex, `inc-${c.inc}`, `r-${c.region}`, `c-${c.id}`, urban ? 'urban' : 'rural', ...(c.tags || [])],
      sex,
      sexLabel: sex === 'm' ? '男の子' : '女の子',
      name,
      place: {
        text: urban ? `${c.name}の ${city}` : `${c.name}の ${village}`,
        country: c.name,
        lat: c.lat + rng.range(-2, 2),
        lon: c.lon + rng.range(-2, 2),
      },
      survival: lifeTable(c, sex),
      habitat: urban ? 'town' : 'village',
      spriteSuffix: `_${tone}`,
      fields: {
        country: c.name,
        city: city || rng.pick(c.cities),
        food: rng.pick(reg.food),
        sport: rng.pick(reg.sport),
        fest: rng.pick(reg.fest),
        sweet: rng.pick(reg.sweet || reg.food),
        animal: rng.pick(reg.animal || ['イヌ']),
      },
    };
  },

  // 学校・仕事・結婚・子ども・スマホ・引退など、国の数字で決まる節目
  plan(rng, life, base) {
    const c = base.country;
    const reg = REGIONS[c.region];
    const inc = c.inc;
    const sex = base.sex;
    const span = life.span;
    const ev = [];
    const at = (age, e) => { if (age < span) ev.push({ age, ...e }); };

    // 学校
    const pPrim = { L: 0.82, LM: 0.93, UM: 0.98, H: 0.995 }[inc];
    const pSec = { L: 0.45, LM: 0.72, UM: 0.88, H: 0.96 }[inc];
    const pHigh = { L: 0.55, LM: 0.7, UM: 0.85, H: 0.95 }[inc];
    let pUni = clamp(c.tertiary / 100 / (pPrim * pSec * pHigh), 0.02, 0.95);
    // 女の子だけ学校に行きにくい国（eduF: { sec, uni } は男女同じときに対する倍率）
    const ef = sex === 'f' && c.eduF ? c.eduF : null;
    const pSecX = pSec * (ef?.sec ?? 1);
    if (ef) pUni *= ef.uni ?? 1;
    let edu = 0;
    if (rng.chance(pPrim)) {
      edu = 1;
      at(rng.range(5.8, 6.6) * Y, { text: HE.school.primary, icon: 'school', mood: 'good', big: 2, set: 'edu1' });
      if (rng.chance(pSecX)) {
        edu = 2;
        at(rng.range(11.8, 12.6) * Y, { text: HE.school.middle, icon: 'school', set: 'edu2' });
        if (rng.chance(pHigh)) {
          edu = 3;
          at(rng.range(14.8, 15.6) * Y, { text: HE.school.high, icon: 'school', set: 'edu3' });
          if (rng.chance(pUni)) {
            edu = 4;
            at(rng.range(17.8, 19.5) * Y, { text: HE.school.uni, icon: 'school', mood: 'good', big: 2, set: 'edu4' });
            at(rng.range(21.8, 23.5) * Y, { text: HE.school.uniEnd, icon: 'star', mood: 'good', set: 'graduate' });
          }
        }
      }
    } else {
      at(rng.range(6.5, 9) * Y, { text: HE.school.none, icon: 'work', mood: 'hard', big: 1, set: 'noschool' });
    }

    // 町へ・外国へ
    let urban = base.tags.includes('urban');
    if (!urban && rng.chance({ L: 0.3, LM: 0.3, UM: 0.25, H: 0.12 }[inc])) {
      urban = true;
      at(rng.range(16, 30) * Y, { text: HE.migrate, icon: 'box', big: 2, set: 'migrant', move: 'town', add: { moves: 1 } });
    }
    if (rng.chance(c.abroad ?? 0.03)) at(rng.range(18, 40) * Y, { text: HE.abroad, icon: 'plane', mood: 'good', big: 3, set: 'abroad', add: { moves: 1 } });

    // 仕事
    const pWork = sex === 'f' ? (reg.femaleWork ?? 0.6) : 0.88;
    const startAge = [rng.range(10, 14), rng.range(13, 16), rng.range(15, 18), rng.range(18, 20), rng.range(22, 24.5)][edu];
    if (rng.chance(pWork)) {
      const jobs = HE.jobs.filter((j) => edu >= (j.edu || 0) && (!j.where || j.where === (urban ? 'urban' : 'rural')));
      // 学校を長く通った人ほど、学校の要る仕事につきやすい
      const fit = (j) => { const need = j.edu || 0; if (edu >= 4) return need >= 3 ? 4 : need >= 2 ? 1.2 : 0.3; if (edu === 3) return need >= 2 ? 2 : 0.8; return 1; };
      const job = rng.weighted(jobs, (j) => (j.w[inc] ?? 1) * (j.w2?.[c.region] ?? 1) * fit(j));
      life.fields.job = job.text;
      at(startAge * Y, { text: HE.workStart, icon: 'work', mood: 'good', big: 2, set: ['worker', `job-${job.id}`] });
      const ret = { H: [62, 68], UM: [58, 65], LM: [60, 70], L: [60, 72] }[inc];
      if (rng.chance(inc === 'H' || inc === 'UM' ? 0.9 : 0.5)) at(rng.range(ret[0], ret[1]) * Y, { text: HE.retire, icon: 'sun', mood: 'good', set: 'retired' });
    } else {
      at(Math.max(rng.range(17, 24), startAge + rng.range(0.3, 2)) * Y, { text: HE.homeWork, icon: 'house', set: 'homemaker' }); // 学校を終えてから
    }

    // 結婚と子ども
    const mar = reg.marriage;
    if (rng.chance(mar.p)) {
      const mAge = Math.max(18, rng.normal(sex === 'f' ? mar.f : mar.m, 3.5));
      at(mAge * Y, { text: HE.marry, icon: 'rings', mood: 'good', big: 3, set: 'married' });
      const nKids = Math.min(10, rng.poisson(Math.min(8, c.tfr / mar.p)));
      let a = mAge + rng.range(0.6, 3);
      const last = sex === 'f' ? 44 : 56;
      let k = 0;
      let firstKid = null;
      for (let i = 0; i < nKids && a < last && a < span / Y; i++) {
        k++;
        if (k === 1) firstKid = a;
        // 3人目からは、いちばん下の子だけ文にする（大家族で同じ文が並ばないように）
        const isLast = i === nKids - 1 || a + 1.5 >= last || a + 1.5 >= span / Y;
        const quiet = k >= 3 && !isLast;
        at(a * Y, { text: k === 1 ? HE.firstKid : HE.moreKid.replace('{k}', k), icon: 'baby', mood: 'good', big: k === 1 ? 3 : 1, set: 'parent', add: { kids: 1 }, silent: quiet });
        if (rng.chance(Math.min(0.4, c.u5 / 1000))) at((a + rng.range(0.1, 4.5)) * Y, { text: HE.childLoss, icon: 'feather', mood: 'hard', big: 2, set: 'lostchild' });
        a += rng.range(1.5, 4.5);
      }
      if (firstKid != null && rng.chance(0.85)) {
        const g = firstKid + rng.normal(mar.f, 3) + rng.range(0.5, 3);
        const grand = Math.max(1, Math.round(k * (c.tfr / 2) * rng.range(0.6, 1.4)));
        at(g * Y, { text: HE.grandkid, icon: 'baby', mood: 'good', big: 3, set: 'grandparent', add: { grandkids: grand } });
      }
    }

    // はじめてのスマホ
    if (rng.chance(clamp(c.internet / 100 + 0.2, 0.05, 0.98))) {
      const r = { H: [9, 13], UM: [11, 15], LM: [13, 19], L: [15, 26] }[inc];
      at(rng.range(r[0], r[1]) * Y, { text: HE.phone, icon: 'phone', mood: 'good', set: 'phone' });
    }
    return ev;
  },
};

// 確かめ用: 国ごとの平均寿命（曲線から計算した値）
export function checkE0() {
  return COUNTRIES.map((c) => {
    const f = (pts) => pts.reduce((s, p, i) => (i ? s + ((pts[i - 1][1] + p[1]) / 2) * (p[0] - pts[i - 1][0]) : 0), 0) / Y;
    return { id: c.id, e0m: c.e0m, fitM: +f(lifeTable(c, 'm')).toFixed(1), e0f: c.e0f, fitF: +f(lifeTable(c, 'f')).toFixed(1) };
  });
}
