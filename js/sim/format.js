// 年齢（日）を、読みやすい日本語にする
import { M, Y } from './units.js?v=1.0.0';

// 一生の長さ（カードの見出し）: 「14年3か月」「5か月」「12日」「6時間」
export function spanText(days) {
  if (days < 1) return `${Math.max(1, Math.round(days * 24))}時間`;
  if (days < 60) return `${Math.floor(days)}日`;
  if (days < 2 * Y) {
    const m = Math.floor(days / M);
    return `${m}か月`;
  }
  const y = Math.floor(days / Y);
  const m = Math.floor((days - y * Y) / M);
  return m ? `${y}年${m}か月` : `${y}年`;
}

// できごとの横の年齢（短く）: 「12さい」「3か月」「5日め」「2時間め」
export function ageText(days, kind) {
  if (days < 1) return days < 1 / 24 ? 'うまれてすぐ' : `${Math.floor(days * 24)}時間め`;
  if (days < 60) return `${Math.floor(days)}日め`;
  if (days < 2 * Y) return `${Math.floor(days / M)}か月`;
  return `${Math.floor(days / Y)}さい`;
}

// 窓のなかの時計（いまの年齢）: 人は「12さい」、短い命は「3日め」など
export function clockText(days) {
  return ageText(days);
}

// 人数・回数の数字（3桁ごとの区切り）
export const num = (n) => Math.round(n).toLocaleString('ja-JP');

// 「1000匹に1匹」のような言い方（p は 0〜1）
export function oneIn(p, counter = '匹') {
  if (p >= 0.5) return `${Math.round(p * 100)}%`;
  const n = 1 / Math.max(p, 1e-9);
  const r = n < 20 ? Math.round(n) : n < 200 ? Math.round(n / 5) * 5 : n < 2000 ? Math.round(n / 50) * 50 : Number(n.toPrecision(2));
  return `${num(r)}${counter}に1${counter}`;
}
