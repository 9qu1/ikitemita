// 作者のほかのアプリの紹介（広告の会社は使わない）。結果とホームの下にだけ出す
export const PR_SITES = [
  { id: 'rikaido', name: 'リカイド', catch: '友達の理解度チェック', desc: '2択のじぶんクイズを作って友達にシェア。「本人ならどっち？」を予想して、正解数でランキング。', url: 'https://rikaido.me/' },
  { id: 'nakamido', name: 'ナカミド', catch: 'あなたの中身を、ちゃんと測る', desc: 'ひとりで答える診断、友達に答えてもらう診断、反応の速さのテスト。登録なしで無料。', url: 'https://nakamido.com/' },
  { id: 'tokumasu', name: 'トクマス', catch: '毎日3問のパズル', desc: 'ナンプレ・クロスワード・ノノグラムが毎日1問ずつ届く。解くとポイントが貯まる。', url: 'https://tokumasu.net/' },
  { id: 'amayadori', name: 'アマヤドリ', catch: '雨音とポモドーロで集中', desc: '雨・焚き火・タイピングの音を流しながら、ポモドーロタイマーで集中できる夜の部屋。', url: 'https://9qu1.com/amayadori/' },
  { id: 'dokomade', name: 'ドコマデ列車', catch: '放置で走る魔法の列車のRPG', desc: '放置しても走りつづける魔法の列車のドットRPG。どこまで行けるかを全国ランキングで競う。', url: 'https://9qu1.com/dokomade/' },
  { id: 'kunitori', name: 'クニトリ', catch: '寝ている間も国が広がる陣取り', desc: 'みんなでひとつの大陸を取り合う陣取りゲーム。5分ごとに国が自動で広がる。', url: 'https://9qu1.com/kunitori/' },
];

const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null) e.append(c);
  return e;
};

export function prHref(s, where) {
  const u = new URL(s.url);
  u.searchParams.set('utm_source', 'ikitemita');
  u.searchParams.set('utm_medium', 'pr');
  if (where) u.searchParams.set('utm_content', where);
  return u.toString();
}

let order = null, next = 0;
function pick() {
  if (!order || next >= order.length) {
    order = PR_SITES.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    next = 0;
  }
  return PR_SITES[order[next++]];
}

export function prCard(where) {
  const s = pick();
  return el('a', { class: 'pr-card', href: prHref(s, where), target: '_blank', rel: 'noopener' },
    el('span', { class: 'pr-label', text: '作者のほかのアプリ' }),
    el('span', { class: 'pr-row' },
      el('img', { src: `img/pr/${s.id}-icon.webp`, alt: '', width: 48, height: 48, loading: 'lazy' }),
      el('span', { class: 'pr-text' }, el('b', { text: `${s.name}｜${s.catch}` }), el('small', { text: s.desc })),
      el('em', { class: 'pr-go', text: 'みにいく' })));
}
