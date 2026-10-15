// アマガエル（ニホンアマガエル）（書き方は CONTENT.md）
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

export default {
  id: 'frog',
  name: 'アマガエル',
  kind: 'animal',
  weight: 1.2,
  // 数を数えた資料はない。日本の 田んぼは 約230万ha（230億m²）あり、まわりの 草むらも 合わせて
  // 100m²に 数匹 いるだけでも 10億匹ほど。朝鮮半島・中国東北部・ロシア極東の分も あるので 10億匹を 目安にした
  realCount: 1e9,
  refDays: 5 * Y, // 寿命は ふつう 数年・最長 6〜11年の推定（Kuzmin）。サハリン・国後島の調べでは 最長8歳
  habitat: 'village',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で、たまごとして うまれた', '{place}の 水の中で、たまごとして うまれた'],

  variants: [
    {
      id: 'paddy', label: 'アマガエル', w: 1, habitat: 'village',
      places: [
        { text: '新潟県の 田んぼ', lat: 37.9, lon: 139.05 },
        { text: '栃木県の 田んぼ', lat: 36.45, lon: 139.9 },
        { text: '滋賀県の 田んぼ', lat: 35.1, lon: 136.05 },
        { text: '北海道の 田んぼ', lat: 43.2, lon: 141.77 },
        { text: '韓国の 田んぼ', lat: 36.6, lon: 127.3 },
        { text: 'ロシアの 沿海地方の 湿地', lat: 43.4, lon: 132.0 },
      ],
      // たまご 約3日 → おたまじゃくし 約1か月 → 子ガエル（ホンダ「生きもの図鑑」）。1匹の メスが うむ たまごは 約300〜1500個。
      // おとなの 1年ごとの 生き残りは 0.55〜0.70（国後島・サハリン, Kidov ほか）。
      // 2歳で子どもを のこせるのは 約0.25%（400匹に1匹）で、たまごの数から 考えて 本当に近い
      survival: [[0, 1], [3 * D, 0.8], [W, 0.5], [2 * W, 0.25], [33 * D, 0.1], [6 * W, 0.06], [3 * M, 0.025], [6 * M, 0.012], [Y, 0.006], [2 * Y, 0.0025], [3 * Y, 0.0015], [4 * Y, 0.0009], [5 * Y, 0.00054], [6 * Y, 0.00032], [8 * Y, 0.00008], [10 * Y, 0.00001], [11 * Y, 0]],
    },
  ],

  // うまれるのは 田植えの ころ（5〜6月）と考えて、冬眠は 生後 5〜11か月ごろ
  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25, habitat: 'river' },
    { id: 'tadpole', name: 'おたまじゃくし', from: 3 * D, sprite: 'tadpole', scale: 0.4, say: 'たまごから、おたまじゃくしが かえった', icon: 'egg', big: 2 },
    { id: 'froglet', name: '子ガエル', from: 33 * D, sprite: 'frog', scale: 0.45, habitat: 'village', say: ['しっぽが きえて、小さな カエルに なった', '手と 足が そろって、田んぼの あぜに 上がった'], icon: 'star', big: 3 },
    { id: 'adult', name: 'おとなの カエル', from: Y, sprite: 'frog', scale: 1, say: 'からだが 大きくなり、おとなの カエルに なった', icon: 'star', big: 1 },
  ],

  stats: [
    { id: 'bugs', label: '食べた 虫', unit: '匹' },
    { id: 'songs', label: '鳴いた 夜', unit: '回' },
    { id: 'eggs', label: 'うんだ たまご', unit: '個' },
  ],

  events: [
    // たまご
    { at: [0, D], p: 0.8, text: 'ほそい ゼリーで、稲の 根もとに くっついた', icon: 'egg' },
    { at: [0, 3 * D], p: 0.6, text: 'あたたかい 田んぼの 水に、日の光が さしこんだ', icon: 'sun', mood: 'good' },
    { at: [D, 3 * D], p: 0.6, text: 'たまごの中で、ぴくぴく 動きはじめた', icon: 'look', big: 1 },

    // おたまじゃくし
    { at: [3 * D, 2 * W], p: 0.85, text: '水の中の 藻を、口で けずって 食べた', icon: 'apple', mood: 'good', big: 1 },
    { at: [4 * D, 30 * D], repeat: [1, 2], text: ['しっぽを ふって、田んぼの 中を 泳ぎまわった', 'きょうだいと いっしょに、日なたに あつまった'], icon: 'drop', mood: 'good' },
    { at: [4 * D, 30 * D], p: 0.45, text: 'ヤゴに ねらわれて、泥の 中へ にげこんだ', icon: 'alert', mood: 'hard' },
    { at: [5 * D, 30 * D], p: 0.3, text: 'サギの 長い くちばしが、すぐ そばに ささった', icon: 'alert', mood: 'hard' },
    { at: [W, 30 * D], p: 0.3, text: '田んぼの 水が へって、せまい 水たまりに あつまった', icon: 'drop', mood: 'hard' },
    { at: [2 * W, 4 * W], p: 0.7, text: 'うしろ足が、にょきっと 生えてきた', icon: 'sprout', big: 2 },
    { at: [24 * D, 32 * D], p: 0.7, text: '前足も 出てきて、しっぽが みじかく なっていった', icon: 'sprout', big: 1 },

    // 子ガエル（はじめての 夏と 秋）
    { at: [33 * D, 2 * M], p: 0.85, text: 'はじめて 小さな 虫を つかまえて 食べた', icon: 'apple', mood: 'good', big: 1, add: { bugs: 1 } },
    { at: [33 * D, 3 * M], p: 0.7, text: '足の 吸盤で、稲の 葉に ぴたっと くっついた', icon: 'star', mood: 'good', big: 1 },
    { at: [35 * D, 4 * M], p: 0.4, text: 'ヘビから 草むらに とびこんで にげた', icon: 'alert', mood: 'hard' },
    { at: [M, 4 * M], p: 0.6, text: '葉っぱの 上で、からだが きれいな 緑色に なった', icon: 'flower', mood: 'good', big: 1 },
    { at: [2 * M, 5 * M], p: 0.4, text: '木の 幹に とまったら、からだが 灰色に かわった', icon: 'look', big: 1 },
    { at: [40 * D, 5 * M], repeat: [1, 3], text: ['ハエを ぱくっと 食べた', 'クモを ぱくっと 食べた', '夜、自動販売機の 明かりに 来る 虫を 食べた'], icon: 'apple', mood: 'good', add: { bugs: [20, 120] } },
    { at: [2 * M, 5 * M], p: 0.35, text: '庭の 木に のぼって、高い 葉の 上で くらした', icon: 'house', move: 'forest' },
    { at: [2 * M, 5 * M], p: 0.3, text: 'こどもに つかまって、手の ひらに のせられた', icon: 'friends' },
    { at: [3.5 * M, 5 * M], p: 0.4, text: '秋の 田んぼで、稲かりの 音を 聞いた', icon: 'flower' },

    // 冬眠（1年め〜4年め）。冬の あいだに 終わった 一生は さいごの 文で わかる
    { at: [5 * M, 6 * M], text: '土の 中に もぐって、はじめての 冬眠に 入った', icon: 'sleep', big: 2, move: 'underground', set: 'w1' },
    { at: [9.5 * M, 11 * M], text: '春の あたたかさで、冬眠から 目を さました', icon: 'sun', mood: 'good', big: 2, move: 'village', set: 'u1' },
    { at: [17 * M, 18 * M], text: '落ち葉の 下の 土に もぐって、冬眠した', icon: 'sleep', move: 'underground', set: 'w2' },
    { at: [21.5 * M, 23 * M], text: '2回めの 冬を こして、また 春が きた', icon: 'sun', mood: 'good', big: 1, move: 'village', set: 'u2' },
    { at: [29 * M, 30 * M], text: 'ことしも 土の 中で、春を 待つことにした', icon: 'sleep', move: 'underground', set: 'w3' },
    { at: [33.5 * M, 35 * M], text: '3回めの 冬を のりこえて、田んぼに もどった', icon: 'sun', mood: 'good', big: 1, move: 'village', set: 'u3' },
    { at: [41 * M, 42 * M], text: 'なれた 土の 中で、また 冬眠した', icon: 'sleep', move: 'underground', set: 'w4' },
    { at: [45.5 * M, 47 * M], text: '4回めの 春。ことしも 元気に 目を さました', icon: 'sun', mood: 'good', big: 1, move: 'village', set: 'u4' },
    { at: [5 * Y, 10 * Y], p: 0.7, text: '何度も 冬を こえて、田んぼの 長老に なった', icon: 'crown', mood: 'good', big: 2 },

    // 2年めの 夏（オスは 1回めの 冬の あとから 子どもを のこす）
    { at: [11 * M, 17 * M], repeat: [1, 2], need: 'u1', text: ['田んぼの 上を とぶ 虫を、ぱくっと 食べた', '雨上がりの 夜、虫を たくさん 食べた'], icon: 'apple', mood: 'good', add: { bugs: [100, 400] } },
    { at: [11 * M, 13 * M], need: ['m', 'u1'], text: 'のどの ふくろを ふくらませて、はじめて 大きく 鳴いた', icon: 'music', mood: 'good', big: 2, add: { songs: 1 }, set: 'singer' },
    { at: [11 * M, 15 * M], need: 'singer', text: ['田んぼで、なかまと いっしょに ひと晩じゅう 鳴いた', 'あぜで、ゲッゲッゲッと 大合唱した'], icon: 'music', mood: 'good', add: { songs: [20, 60] } },
    { at: [12 * M, 15 * M], p: 0.75, need: 'singer', text: 'よびかけに こたえた メスと、田んぼで 子どもを のこした', icon: 'heart', mood: 'good', big: 3, set: 'parent' },
    { at: [11 * M, 15 * M], p: 0.3, need: 'singer', text: '鳴いている うちに、ほかの オスに 場所を とられた', icon: 'alert', mood: 'hard' },
    { at: [11 * M, 17 * M], p: 0.5, need: 'singer', text: '雨が ふりそうな 空に、ゲッゲッと 鳴いた', icon: 'rain', big: 1, add: { songs: 1 } },

    // 3年めの 夏（メスは 2回めの 冬の あとから たまごを うむ）
    { at: [23 * M, 29 * M], repeat: [1, 2], need: 'u2', text: '夜の 明かりの 下で、ガを 待ちぶせして 食べた', icon: 'apple', mood: 'good', add: { bugs: [100, 400] } },
    { at: [23 * M, 26 * M], p: 0.85, need: ['f', 'u2'], text: 'オスの 声に ひかれて、夜の 田んぼへ 向かった', icon: 'music', mood: 'good', big: 1, set: 'ready' },
    { at: [23 * M, 27 * M], need: 'ready', text: '稲の 根もとに、{n}個の たまごを 少しずつ うんだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [300, 1000] }, set: 'parent' },
    { at: [23 * M, 26 * M], need: ['singer', 'u2'], text: 'ことしも 田んぼの 合唱に、声を あわせた', icon: 'music', mood: 'good', big: 1, add: { songs: [20, 60] } },

    // 4年めの 夏
    { at: [35 * M, 39 * M], p: 0.7, need: ['f', 'parent', 'u3'], text: 'ことしも 田んぼに、{n}個の たまごを うんだ', icon: 'egg', mood: 'good', big: 2, add: { eggs: [300, 1000] } },
    { at: [35 * M, 38 * M], need: ['singer', 'u3'], text: '若い オスたちに まじって、ベテランの 声で 鳴いた', icon: 'music', mood: 'good', big: 1, add: { songs: [20, 60] } },
  ],

  deaths: [
    { at: [0, 3 * D], w: 4, text: ['たまごのまま、ちいさな いのちを 終えた', 'たまごのまま、水の中の 生きものに 食べられた'] },
    { at: [3 * D, 33 * D], w: 5, text: ['おたまじゃくしの まま、ヤゴに 食べられた', 'おたまじゃくしの まま、魚や 鳥に 食べられた'] },
    { at: [W, 33 * D], w: 1, text: '田んぼの 水が ひいて、カエルに なる 前に 眠った' },
    { at: [33 * D, 6 * M], w: 3, need: '!w1', text: ['ヘビに 見つかって、いのちを 終えた', 'サギに つかまって、いのちを 終えた'] },
    { at: [33 * D, 3 * M], w: 2, text: '夏の 暑さで からだが かわき、しずかに 眠った' },
    { at: [33 * D, 6 * M], w: 1, need: '!w1', text: '道路を わたるとき、車に ぶつかって いのちを 終えた' },
    { at: [5 * M, 11 * M], w: 10, need: ['w1', '!u1'], text: '冬眠した まま、春を 待たずに 眠った' },
    { at: [17 * M, 23 * M], w: 10, need: ['w2', '!u2'], text: '冬眠した まま、春を 待たずに 眠った' },
    { at: [29 * M, 35 * M], w: 10, need: ['w3', '!u3'], text: '冬眠した まま、春を 待たずに 眠った' },
    { at: [41 * M, 47 * M], w: 10, need: ['w4', '!u4'], text: '冬眠した まま、春を 待たずに 眠った' },
    { at: [9 * M, 11 * Y], w: 3, need: 'u1', text: ['ヘビに 見つかって、いのちを 終えた', 'サギに つかまって、いのちを 終えた'] },
    { at: [9 * M, 11 * Y], w: 1, need: 'u1', text: '道路を わたるとき、車に ぶつかって いのちを 終えた' },
    { at: [3 * Y, 11 * Y], w: 4, need: 'u1', text: ['田んぼの そばの 草むらで、しずかに 眠った', 'たくさんの 夏を こえて、しずかに いのちを 終えた'] },
  ],

  titles: [
    { stat: { eggs: 1000 }, text: '{eggs}個の たまごを のこした 田んぼの お母さん' },
    { need: ['m', 'parent'], text: '田んぼの 合唱を ひっぱった お父さん' },
    { long: 0.001, text: '何度も 冬を こえた 田んぼの 長老' },
    { need: ['f', 'parent'], text: '田んぼに たまごを のこした お母さん' },
    { need: 'u1', maxAge: 2 * Y, text: '冬を こえた 小さな アマガエル' },
    { minAge: 33 * D, need: '!w1', text: '田んぼの あぜで 夏を すごした 子ガエル' },
    { minAge: 3 * D, maxAge: 33 * D, text: '田んぼを 泳いだ ちいさな おたまじゃくし' },
    { maxAge: 3 * D, text: '田んぼの 水に ゆれた ちいさな たまご' },
  ],

  facts: [
    'アマガエルの たまごは 3日ほどで おたまじゃくしに なり、1か月ほどで カエルに なります',
    'まわりの 色や 温度・明るさに あわせて、緑から 灰色っぽい もように 体の色を かえます',
    '雨が 近づくと、子どもを のこす 季節で なくても 鳴くことが あり「雨鳴き」と よばれます',
    '指さきの 吸盤のおかげで、コンクリートの 水路も のぼれます',
    '皮ふから 弱い 毒を 出しているので、さわったあとは 手を あらいましょう',
    '寒い 地域では、土の 中などで 冬眠します',
  ],

  sources: [
    'https://www.honda.co.jp/outdoor/adventure/nihonamagaeru.html (ホンダ 生きもの図鑑・体長22〜45mm・産卵は4〜8月・3日で おたまじゃくし・約1か月で子ガエル)',
    'https://global.honda/jp/philanthropy/hondawoods/forest/library/053/ (Honda Woods・1回に 約10粒・合計 約300粒を 場所を かえて うむ)',
    'https://nazology.kusuguru.co.jp/zukan/ikimono/kaeru (雨鳴き・体色を かえる しくみ・皮ふの 毒・冬眠)',
    'https://zin.ru/journals/trudyzin/eng/publication.html?id=583 (Kidov ほか・サハリンと国後島の年齢: 最長8歳・おとなの 生き残り 0.55〜0.70・オスは 1回め、メスは 2回めの 冬の あとに おとな)',
    'https://amphibiaweb.org/species/832 (AmphibiaWeb・たまご 340〜1500個・寿命 ふつう 約6年・最長 6〜11年の推定)',
    'https://www.city.tsuchiura.lg.jp/data/doc/1220592293_doc_18.pdf (土浦市・吸盤があり コンクリート水路でも だいじょうぶ・乾田化の 影響を うけにくい)',
  ],
};
