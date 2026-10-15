// 種（文字列）から決まった乱数を作る。同じ種なら同じ一生になる（共有の URL で同じ一生を見せるため）
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function sfc32(a, b, c, d) {
  return () => {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export function makeRng(seed) {
  const h = xmur3(String(seed));
  const next = sfc32(h(), h(), h(), h());
  for (let i = 0; i < 12; i++) next();
  const r = {
    next,
    range: (a, b) => a + (b - a) * next(),
    int: (a, b) => a + Math.floor(next() * (b - a + 1)),
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    // 重みつきで1つ選ぶ（w は関数かプロパティ名）
    weighted(arr, w = 'w') {
      const f = typeof w === 'function' ? w : (x) => (x[w] ?? 1);
      let sum = 0;
      for (const x of arr) sum += Math.max(0, f(x));
      let u = next() * sum;
      for (const x of arr) { u -= Math.max(0, f(x)); if (u < 0) return x; }
      return arr[arr.length - 1];
    },
    // ポアソン分布（子どもの数など）
    poisson(lam) {
      const L = Math.exp(-lam);
      let k = 0, p = 1;
      do { k++; p *= next(); } while (p > L && k < 50);
      return k - 1;
    },
    // ふつうの分布（平均 m・ばらつき s）
    normal(m, s) {
      const u = 1 - next(), v = next();
      return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
  };
  return r;
}

// 新しい種（英小文字と数字の8文字）
export function newSeed() {
  const abc = 'abcdefghijkmnpqrstuvwxyz23456789';
  const a = new Uint32Array(8);
  globalThis.crypto.getRandomValues(a);
  return Array.from(a, (x) => abc[x % abc.length]).join('');
}
