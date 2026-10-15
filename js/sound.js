// 小さな効果音（波形から作る・外の音源は使わない）。初めは消音
import { load } from './store.js?v=1.0.2';
let ac = null;
const ctx = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { ac = null; } } return ac; };
const on = () => load().sound;

function tone(freq, dur, { type = 'sine', vol = 0.12, to = null, delay = 0 } = {}) {
  const a = ctx(); if (!a || !on()) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export const sfx = {
  unlock() { const a = ctx(); if (a && a.state === 'suspended') a.resume(); },
  tap() { tone(660, 0.07, { vol: 0.06 }); },
  pop(i = 0) { tone(520 + (i % 7) * 60, 0.09, { vol: 0.05, to: 900 }); },
  whoosh() {
    const a = ctx(); if (!a || !on()) return;
    const len = 0.9, buf = a.createBuffer(1, a.sampleRate * len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = a.createBufferSource(); s.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(300, a.currentTime); f.frequency.exponentialRampToValueAtTime(2400, a.currentTime + len);
    const g = a.createGain(); g.gain.setValueAtTime(0.0001, a.currentTime); g.gain.exponentialRampToValueAtTime(0.16, a.currentTime + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + len);
    s.connect(f).connect(g).connect(a.destination); s.start();
  },
  birth() { tone(784, 0.25, { vol: 0.08 }); tone(1046, 0.35, { vol: 0.07, delay: 0.12 }); },
  end() { tone(523, 0.6, { vol: 0.05, type: 'triangle' }); tone(392, 0.9, { vol: 0.04, type: 'triangle', delay: 0.15 }); },
};
