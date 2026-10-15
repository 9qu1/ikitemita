// アブラゼミ（Graptopsaltria nigrofuscata）
//   夏に 枯れ枝へ たまご → 枝の中で 冬をこし、次の年の 梅雨どき（産卵から 300〜350日）に かえる → 地面に落ちて 土の中へ
//   → 土の中で 3〜4年ほど（2〜5年）根の汁を吸う → 夏の夕方に 地上に出て 羽化 → 成虫は 数週間（最長32日の記録）
//   土の中の年数で すがたの切りかわりと生き残りの曲線が変わるので、年数ごとに variant を作り、plan で life.stages を差しかえる
import { H, D, W, M, Y } from '../units.js?v=1.0.1';

const HATCH = 320 * D; // 産卵から 300〜350日後の 梅雨どきに かえる
const emergeAt = (years) => (years + 1) * Y - 10 * D; // 土の中で years 回目の 夏の 夕方に 地上へ

// 生き残りの曲線: たまごは 枝ごと落ちたり 寄生バチに食べられたり、かえったばかりの幼虫は アリに たくさん食べられる（吉村ほか 2024）。
//   土の中では はじめの2年で ほとんどが いなくなる（北米の周期ゼミで 最初の2年に 98%: Karban 1984。アブラゼミの数字は見つからず、これに ならった推計）。
//   地上に出られるのは たまごの 1%ほど（年数が長いほど少ない）。羽化の夜にも 4分の1が うまくいかない。
//   成虫は 2〜3週間で 多くが いなくなり、長くて 1か月あまり（植松 2016: 最長32日）
function curve(years) {
  const E = emergeAt(years);
  const pts = [[0, 1], [5 * M, 0.86], [HATCH - 5 * D, 0.72], [HATCH + 10 * D, 0.3], [Y + 3 * M, 0.1]];
  let s = 0.035;
  for (let t = 2 * Y; t < E - 30 * D; t += Y) { pts.push([t, s]); s *= 0.55; }
  pts.push([E - D, s], [E + 0.5 * D, s * 0.75], [E + 7 * D, s * 0.6], [E + 14 * D, s * 0.4], [E + 21 * D, s * 0.2], [E + 30 * D, s * 0.05], [E + 40 * D, 0]);
  return pts;
}

function stages(years) {
  const E = emergeAt(years);
  return [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3, habitat: 'forest' },
    { id: 'nymph', name: '幼虫', from: HATCH, sprite: 'cicada_nymph', scale: 0.3, habitat: 'underground', say: 'たまごから かえり、地面へ ぽとりと 落ちた', icon: 'egg', big: 2 },
    { id: 'nymph2', name: '大きな 幼虫', from: E - Y, sprite: 'cicada_nymph', scale: 0.7, say: 'だっぴを かさね、大きな 幼虫に なった', icon: 'sprout' },
    { id: 'adult', name: 'アブラゼミ', from: E, sprite: 'cicada', scale: 1, habitat: 'forest', say: '背中が われて、白い 羽の セミが 出てきた', icon: 'star', big: 3 },
  ];
}

// 土の中 → 地上 → 成虫 のできごと（年数で時期がずれるので variant ごとに作る）
function lifeEvents(years) {
  const E = emergeAt(years);
  return [
    // 土の中
    { at: [HATCH + 2 * H, HATCH + 3 * D], text: '梅雨の 雨で やわらかい 土に、すぐ もぐった', icon: 'drop' },
    { at: [HATCH + 5 * D, HATCH + 2 * M], text: '木の 根っこを 見つけて、汁を 吸いはじめた', icon: 'apple', mood: 'good', big: 1 },
    { at: [HATCH + M, E - 2 * M], repeat: [2, 4], text: 'だっぴして、ひと回り 大きく なった', icon: 'sprout', add: { molts: 1 } },
    { at: [HATCH + 2 * M, E - M], p: 0.5, text: 'モグラが 近くを 通り、身を ちぢめた', icon: 'alert', mood: 'hard' },
    { at: [Y + M, E - 2 * M], p: 0.45, text: '地上の セミの 声が、土の中まで ひびいてきた', icon: 'music' },
    { at: [HATCH + 2 * M, E - M], p: 0.3, text: '大雨で 土が 水びたしに なり、じっと たえた', icon: 'rain', mood: 'hard' },
    { at: [Y + 3 * M, E - 2 * M], p: 0.35, text: '冬の 土の中で、ゆっくり 根の 汁を 吸った', icon: 'snow' },
    { at: [HATCH + M, E - M], p: 0.25, text: 'となりの 根っこで、ほかの 幼虫と はちあわせた', icon: 'friends' },
    { at: [HATCH + 3 * M, E - M], p: 0.3, text: '公園で 遊ぶ 子どもの 足音が ひびいてきた', icon: 'look' },
    { at: [HATCH + 3 * M, E - M], p: 0.2, text: '近くの 木が 切られ、べつの 根っこへ うつった', icon: 'box', mood: 'hard' },
    { at: [E - 25 * D, E - 2 * D], p: 0.8, text: '地面の すぐ 下まで、トンネルを ほり進めた', icon: 'look', big: 1 },
    // 地上へ・羽化（羽化は 夕方から 夜に はじまる）
    { at: [E - 3 * H, E - H], text: '夕方、地面の 穴から はい出して、木に のぼった', icon: 'look', mood: 'good', big: 2, set: 'emerged' },
    { at: [E + 6 * H, E + 12 * H], text: 'まっ白だった 羽が、朝には 茶色に なった', icon: 'sun', mood: 'good', big: 1 },
    { at: [E + 12 * H, E + D], text: 'はじめて 空へ 飛びたった', icon: 'plane', mood: 'good', big: 2, set: 'flew' },
    // 成虫
    { at: [E + D, E + 40 * D], need: ['m', 'flew'], repeat: [2, 5], text: ['午後の 森で、ジージリジリと 鳴いた', '仲間と いっしょに、森じゅうで 鳴いた', '夕方の 木の 上で、また 鳴いた'], icon: 'music', mood: 'good', add: { songs: [1, 3] } },
    { at: [E + D, E + 30 * D], need: ['m', 'flew'], p: 0.35, text: 'メスを よぶ 声くらべに、何度も いどんだ', icon: 'music' },
    { at: [E + D, E + 20 * D], need: ['m', 'flew'], p: 0.2, text: '電灯の 明かりの 下で、夜も 鳴いた', icon: 'music' },
    { at: [E + D, E + 40 * D], need: 'flew', repeat: [1, 3], text: ['サクラの 幹に 口を さして、汁を 吸った', 'ケヤキの 木で、ひと休みした'], icon: 'apple' },
    { at: [E + 3 * D, E + 25 * D], need: ['f', 'flew'], p: 0.7, text: '鳴き声に ひかれて、オスの もとへ 飛んだ', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
    { at: [E + 4 * D, E + 40 * D], need: 'mated', repeat: [1, 4], text: '枯れ枝に、たまごを 少しずつ 産みつけた', icon: 'egg', mood: 'good', big: 3, add: { eggs: [30, 80] }, set: 'mother' },
    { at: [E + D, E + 25 * D], need: 'flew', p: 0.3, text: '子どもの あみから、おしっこを かけて にげた', icon: 'alert', big: 1 },
    { at: [E + 2 * D, E + 30 * D], need: 'flew', p: 0.3, text: 'ヒヨドリに 追われたが、なんとか にげきった', icon: 'alert', mood: 'hard' },
    { at: [E + 2 * D, E + 30 * D], need: 'flew', p: 0.25, text: 'マンションの ベランダに 飛びこんだ', icon: 'plane' },
    { at: [E + 2 * D, E + 30 * D], need: 'flew', p: 0.25, text: 'クモの 巣に かかりかけ、羽で ふりはらった', icon: 'alert', mood: 'hard' },
    { at: [E + 8 * D, E + 12 * D], need: 'flew', text: '1週間を すぎても、元気に 飛んでいた', icon: 'star', mood: 'good', big: 2, set: 'week' },
    { at: [E + 12 * D, E + 40 * D], need: 'flew', p: 0.4, text: '夏の 終わりが 近づき、羽が すりきれてきた', icon: 'sleep' },
  ];
}

const PLACES = [
  { text: '東京の 公園の サクラの 枝', lat: 35.71, lon: 139.77 },
  { text: '大阪の 神社の ケヤキの 枝', lat: 34.69, lon: 135.52 },
  { text: '福岡の 小学校の サクラの 枝', lat: 33.59, lon: 130.4 },
  { text: '仙台の お寺の 木の 枝', lat: 38.27, lon: 140.87 },
  { text: '韓国 ソウルの 公園の 木', lat: 37.57, lon: 126.98 },
  { text: '中国 上海の 並木の 枝', lat: 31.23, lon: 121.47 },
];

// 土の中の年数: 3〜4年が多い（2年・5年は少なめ）
const variant = (years, w) => ({
  id: `y${years}`, label: 'アブラゼミ', w, habitat: 'forest', places: PLACES,
  stages: stages(years), survival: curve(years), events: lifeEvents(years), refDays: emergeAt(years) + 30 * D,
});

export default {
  id: 'cicada',
  name: 'アブラゼミ',
  kind: 'bug',
  weight: 1,
  // セミ全体（約3000種）の数の資料は見つからなかった。北米の周期ゼミは 1回の発生だけで 1兆匹規模と言われる（UConn・LiveScience）ので、
  //   世界のセミ全部で 10兆匹を目安にした（推計・根拠はうすい）
  realCount: 1e13,
  refDays: 4 * Y,
  habitat: 'forest',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 中で、小さな たまごとして うまれた', '{place}で うまれた'],

  variants: [variant(2, 0.15), variant(3, 0.45), variant(4, 0.3), variant(5, 0.1)],

  stages: stages(3),
  plan(rng, life, base) {
    if (base.variant.stages) life.stages = base.variant.stages.map((s) => ({ ...s }));
    return [];
  },

  stats: [
    { id: 'songs', label: '鳴いた 日', unit: '日' },
    { id: 'eggs', label: '産んだ たまご', unit: 'こ' },
    { id: 'molts', label: 'だっぴ', unit: '回' },
  ],

  events: [
    // たまご（枯れ枝の中）
    { at: [3 * D, 2 * M], p: 0.5, text: '枯れ枝の 中の たまごで、秋風に ゆられた', icon: 'sleep' },
    { at: [D, 3 * M], p: 0.3, text: '小さな ハチが、枝の まわりを 飛びまわった', icon: 'alert', mood: 'hard' },
    { at: [4 * M, 7 * M], text: '枯れ枝の 中で、たまごの まま 冬を こした', icon: 'snow', big: 1 },
    { at: [8 * M, 10 * M], p: 0.5, text: '春が きても、まだ 枝の 中で 待った', icon: 'sun' },
  ],

  deaths: [
    { at: [0, HATCH], w: 3, text: ['かえる 前に、枝ごと 地面に 落ちた', 'たまごの まま、小さな ハチに 食べられた', '枝の 中で、たまごの まま 眠った'] },
    { at: [HATCH - D, HATCH + 30 * D], w: 5, text: ['土に もぐる 前に、アリに 見つかった', 'かたい 地面に もぐれず、ひからびた'] },
    { at: [HATCH + 10 * D, 7 * Y], need: '!emerged', w: 4, text: ['土の中で 病気に かかって 眠った', 'モグラに 見つかって、いのちを 終えた', '根の 汁が 足りず、育ちきれなかった', '土の中で、しずかに 眠った'] },
    { need: ['emerged', '!flew'], w: 5, text: ['羽化の とちゅうで、うまく 羽が のびなかった', '羽化の 夜、アリに 見つかった', 'まだ やわらかい うちに、鳥に 見つかった'] },
    { need: 'flew', w: 3, text: ['カラスに つかまって、いのちを 終えた', 'クモの 巣に かかって、いのちを 終えた', 'カマキリに つかまって、いのちを 終えた'] },
    { need: 'flew', w: 3, text: '地面に あおむけで、しずかに 夏を 終えた' },
    { need: 'mother', w: 4, text: '枯れ枝に たまごを のこして、眠った' },
    { need: ['m', 'flew'], w: 2, text: 'さいごまで 鳴ききって、木から 落ちた' },
  ],

  titles: [
    { need: 'mother', text: '{eggs}この たまごを 枯れ枝に のこした 母' },
    { need: 'week', text: '「1週間」の うわさを こえて 生きた セミ' },
    { need: 'flew', text: '何年も 土の中で 待って、ひと夏を 生きた セミ' },
    { need: ['emerged', '!flew'], text: 'あと 少しで 空だった セミ' },
    { need: '!emerged', minAge: 2 * Y, text: '土の中で 夏を 夢みつづけた 幼虫' },
    { minAge: HATCH, maxAge: HATCH + 30 * D, text: '梅雨の 地面に 落ちた 小さな いのち' },
    { minAge: 4 * M, maxAge: HATCH, text: '冬の 枝の 中で 春を 待った たまご' },
    { short: 0.9, text: '枯れ枝の 中の 小さな いのち' },
  ],

  facts: [
    'アブラゼミの たまごは 枯れ枝の 中で 冬を こし、次の 年の 梅雨ごろに かえります',
    '幼虫は 土の中で 3〜4年ほど、木の 根の 汁を 吸って くらすと 言われています',
    '「セミの 成虫は 1週間」は 言いすぎかも。印を つけた 中学生の 調査で、アブラゼミが 32日 生きていた 記録が あります（2016年）',
    'かえったばかりの 幼虫や たまごは、アリに たくさん 食べられる ことが 観察されています（2024年）',
    '羽化は 夕方から 夜。出てきた ばかりの 羽は まっ白で、朝までに 茶色く なります',
  ],

  sources: [
    'https://hugkum.sho.jp/291313 (アブラゼミ: 卵で冬をこし梅雨どき6月ごろにふ化・幼虫3〜4年・羽化は夕暮れ後で約1時間・成虫は数週間 長くて1か月)',
    'https://hugkum.sho.jp/619623 (植松 2016: 863匹に印・アブラゼミ最長32日・ツクツクボウシ26日・クマゼミ15日)',
    'https://www.yodogawa-park.jp/cms/wp-content/uploads/2020/07/4b559c2ed1b970847ad74abc41544b87.pdf (淀川河川公園: 羽化は主に午後8時以降・最長32日)',
    'https://datadryad.org/dataset/doi:10.5061/dryad.fj6q57425 (Yoshimura ほか 2024 アリがアブラゼミの卵とかえったばかりの幼虫を食べる)',
    'https://lib.sugiyama-u.repo.nii.ac.jp/record/2711/files/n07Naito.pdf (アブラゼミは産卵の翌年の梅雨どき 300〜350日後にふ化する型・検索結果の要約で確認)',
    'https://en.wikipedia.org/wiki/Periodical_cicadas (周期ゼミの幼虫は最初の2年で98%が死ぬ: Karban 1984 Ecology 65:1656)',
    'https://cicadas.uconn.edu/faq (周期ゼミの数の推計は とても大まか・1エーカー100万匹をこえる例)',
  ],
};
