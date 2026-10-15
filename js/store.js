// ブラウザに残すもの（設定・これまでの一生）。読めない環境でも動くように、いつも try で包む
const KEY = 'ikitemita.v1';
const DEF = { speed: 2, count: 1, filter: 'all', sound: false, total: 0, history: [] };
let state = null;

export function load() {
  if (state) return state;
  try { state = { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { state = { ...DEF }; }
  if (!Array.isArray(state.history)) state.history = [];
  return state;
}
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
export function set(k, v) { load()[k] = v; save(); }
export function addHistory(item) {
  const s = load();
  s.history.unshift({ ...item, t: Date.now() });
  s.history = s.history.slice(0, 30);
  save();
}
