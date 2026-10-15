// タヌキ（日本のタヌキ・里山と町）
//   5〜6月に 4〜6匹うまれる。夫婦で子育て。秋に親とわかれて旅に出る（このときの交通事故が多い）
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

// 生き残りの曲線: ポーランドの調査（Kowalczyk ほか 2009）
//   うまれて3か月で 61%がいなくなる・1年目の死亡率 0.82・2年目からは 年に 58〜68%・98%が 3年以内・最長 7年
//   日本の野生の寿命も「長くて 6〜8年」（円山動物園）
const SURVIVAL = [[0, 1], [M, 0.72], [3 * M, 0.39], [6 * M, 0.28], [Y, 0.18], [18 * M, 0.11], [2 * Y, 0.075], [3 * Y, 0.028], [4 * Y, 0.012], [5 * Y, 0.005], [6 * Y, 0.002], [7 * Y, 0.0006], [8 * Y, 0]];

export default {
  id: 'tanuki',
  name: 'タヌキ',
  kind: 'animal',
  weight: 1,
  // 世界のタヌキのなかま（日本・中国・朝鮮半島・ヨーロッパに広がったもの）の数の推定はない。
  // フィンランドだけで秋に約32万頭（IUCN 2016）、日本では年に最大37万頭が交通事故にあう推定から、ごく大まかな目安
  realCount: 5e6,
  refDays: 6 * Y,
  habitat: 'village',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 巣あなで うまれた', '{place}の 巣あなで、きょうだいと いっしょに うまれた'],

  variants: [
    {
      id: 'sato', label: '里山のタヌキ', w: 0.65, habitat: 'village', tags: ['sato'],
      places: [
        { text: '長野の 里山', lat: 36.65, lon: 138.19 },
        { text: '京都の 山すその やぶ', lat: 35.03, lon: 135.8 },
        { text: '岩手の 雑木林', lat: 39.7, lon: 141.15 },
        { text: '徳島の 竹やぶ', lat: 34.07, lon: 134.55 },
        { text: '福岡の 田んぼの 近く', lat: 33.6, lon: 130.4 },
        { text: '北海道の 森', lat: 43.06, lon: 141.35 },
      ],
      survival: SURVIVAL,
    },
    {
      id: 'town', label: '町のタヌキ', w: 0.35, habitat: 'town', tags: ['town'],
      places: [
        { text: '東京の 皇居の 森', lat: 35.685, lon: 139.753 },
        { text: '東京の 住宅地の 空き家の 下', lat: 35.66, lon: 139.62 },
        { text: '神奈川の 古い お寺の 裏山', lat: 35.32, lon: 139.55 },
        { text: '大阪の 大きな 公園', lat: 34.68, lon: 135.53 },
        { text: '名古屋の 緑地', lat: 35.17, lon: 136.97 },
      ],
      survival: SURVIVAL,
    },
  ],

  stages: [
    { id: 'pup', name: '子ダヌキ', from: 0, sprite: 'tanuki', scale: 0.5 },
    { id: 'young', name: '若いタヌキ', from: 4 * M, sprite: 'tanuki', scale: 0.8 },
    { id: 'adult', name: 'おとなのタヌキ', from: Y, sprite: 'tanuki', scale: 1, say: 'りっぱな おとなの タヌキに なった', icon: 'star' },
  ],

  stats: [
    { id: 'pups', label: '子ども', unit: '匹' },
    { id: 'latrine', label: 'ためふん場に かよった', unit: '回' },
  ],

  events: [
    // 子ダヌキのころ（5〜8月）
    { at: [9 * D, 12 * D], text: 'はじめて 目が ひらいた', icon: 'look', big: 1 },
    { at: [3 * W, 5 * W], p: 0.85, text: '巣あなの 入り口から、はじめて そとを のぞいた', icon: 'look', big: 1 },
    { at: [3 * W, 2 * M], p: 0.85, text: '父さんが 巣あなの 前で、子どもたちを 見守ってくれた', icon: 'friends', mood: 'good', big: 1 },
    { at: [M, 2 * M], p: 0.7, text: 'きょうだいと 草むらで、とっくみあいを した', icon: 'ball', mood: 'good' },
    { at: [M, 3 * M], p: 0.5, text: '家族で、べつの 巣あなへ 引っこした', icon: 'box' },
    { at: [M, 4 * M], p: 0.35, text: 'カラスに 上から ねらわれて、巣あなに にげこんだ', icon: 'alert', mood: 'hard' },
    { at: [6 * W, 3 * M], p: 0.8, text: '母さんに ついて、ミミズを ほる れんしゅうを した', icon: 'apple' },
    { at: [2 * M, 4 * M], p: 0.6, text: '夏の 夜、カエルや 虫を 追いかけて あそんだ', icon: 'apple', mood: 'good' },
    { at: [2 * M, 5 * M], p: 0.6, text: '家族の「ためふん場」で、なかまの においを おぼえた', icon: 'look', big: 1 },

    // 秋のひとり立ち
    { at: [4 * M, 6 * M], p: 0.85, text: '秋、家族と わかれて、ひとりで 旅に 出た', icon: 'plane', big: 2, set: 'dispersed' },
    { at: [4 * M, 7 * M], p: 0.4, need: 'dispersed', text: '夜の 道路を わたるとき、車の ライトに 立ちすくんだ', icon: 'alert', mood: 'hard' },
    { at: [4 * M, 7 * M], p: 0.6, text: '落ちた かきの 実を、おなかいっぱい 食べた', icon: 'apple', mood: 'good' },
    { at: [4 * M, 7 * M], p: 0.85, text: '冬に そなえて、ころころに 太った', icon: 'apple', mood: 'good' },
    { at: [5 * M, 7 * M], p: 0.7, text: '冬毛で、もこもこに なった', icon: 'snow' },
    { at: [7 * M, 10 * M], p: 0.4, need: 'sato', text: '雪の 日は、巣あなで まるくなって すごした', icon: 'snow' },
    { at: [8 * M, 11 * M], p: 0.8, need: 'dispersed', text: '気に入った 場所を 見つけて、すみかに した', icon: 'house', set: 'settled' },
    { at: [9 * M, 11 * M], p: 0.75, need: 'settled', text: 'つがいの 相手と 出会った', icon: 'heart', mood: 'good', big: 2, set: 'paired' },

    // おとな
    { at: [11 * M, 7 * Y], repeat: [1, 5], need: ['f', 'paired'], text: ['{n}匹の 子ダヌキを うんだ', '巣あなの おくで、{n}匹の 子どもを うんだ'], icon: 'baby', mood: 'good', big: 3, add: { pups: [3, 7] }, set: 'parent' },
    { at: [11 * M, 7 * Y], repeat: [1, 5], need: ['m', 'paired'], text: ['父さんに なり、{n}匹の 子どもに えさを 運んだ', 'つがいの 相手が、{n}匹の 子どもを うんだ'], icon: 'baby', mood: 'good', big: 3, add: { pups: [3, 7] }, set: 'parent' },
    { at: [Y, 7 * Y], p: 0.5, need: 'parent', text: '子どもたちの ために、巣あなの 前で 見はりを した', icon: 'house', mood: 'good' },
    { at: [Y, 7 * Y], p: 0.5, need: 'paired', text: '夫婦で ならんで、夜の 道を 歩いた', icon: 'heart', mood: 'good' },
    { at: [5 * M, 8 * Y], repeat: [2, 4], text: ['ためふん場に 立ちよった', 'ためふん場で、近所の タヌキの においを かいだ', 'いつもの ためふん場に、においを のこした'], icon: 'look', add: { latrine: [30, 150] } },
    { at: [6 * M, 8 * Y], repeat: [1, 3], text: ['夜の 森で、ミミズを たくさん 見つけた', '落ちた ドングリや 木の実を、ひろって 食べた', '川べりで、ザリガニを つかまえた'], icon: 'apple', mood: 'good' },

    // 町のタヌキ
    { at: [4 * M, 7 * Y], p: 0.5, need: 'town', text: '人が ねしずまった 住宅地を、そっと 歩いた', icon: 'house' },
    { at: [4 * M, 7 * Y], p: 0.4, need: 'town', text: '公園の 植えこみの 中に、昼の ねぐらを 見つけた', icon: 'sleep' },
    { at: [4 * M, 7 * Y], p: 0.35, need: 'town', text: 'ゴミぶくろの においに つられたが、カラスに 先を こされた', icon: 'alert' },
    { at: [6 * M, 7 * Y], p: 0.3, need: 'town', text: '夜道で 人と 目が あい、しばらく 見つめあった', icon: 'look' },
    { at: [6 * M, 7 * Y], p: 0.25, need: 'town', text: '自動カメラに うつって、人の 調査の 記録に のこった', icon: 'look', big: 1 },

    // 里山のタヌキ
    { at: [4 * M, 7 * Y], p: 0.4, need: 'sato', text: '畑の トウモロコシを かじって、追いかけられた', icon: 'alert', mood: 'hard' },
    { at: [4 * M, 7 * Y], p: 0.3, need: 'sato', text: '小川を すいすい 泳いで わたった', icon: 'drop', mood: 'good' },
    { at: [4 * M, 7 * Y], p: 0.3, need: 'sato', text: '神社の えんの下を、昼の ねぐらに した', icon: 'sleep' },

    // みんな
    { at: [5 * M, 7 * Y], p: 0.25, text: 'イヌに 追われて、死んだ ふりで やりすごした', icon: 'alert', mood: 'hard', big: 1 },
    { at: [Y, 7 * Y], p: 0.25, text: '皮ふの 病気（かいせん）で、毛が ぬけて かゆかった', icon: 'bandage', mood: 'hard', set: 'mange' },
    { at: [Y, 7 * Y], p: 0.3, need: 'mange', text: '病気が なおり、毛が もとどおりに 生えた', icon: 'sprout', mood: 'good', set: 'cured' },
    { at: [Y, 2 * Y], p: 0.3, need: 'parent', text: '去年の 子どもが、近くに なわばりを もった', icon: 'friends', mood: 'good' },
    { at: [2 * Y, 8 * Y], p: 0.5, need: 'paired', text: '長い つきあいの つがいの 相手と、毛づくろいを しあった', icon: 'heart', mood: 'good', big: 1 },
    { at: [3 * Y, 8 * Y], p: 0.6, text: 'この あたりで いちばん 年上の タヌキに なった', icon: 'crown', big: 2 },
  ],

  deaths: [
    { at: [0, 3 * M], w: 3, text: ['巣あなの 中で、ちいさな いのちを 終えた', '病気に かかって、ちいさな いのちを 終えた'] },
    { at: [0, 4 * M], w: 0.6, text: 'キツネに 見つかって、いのちを 終えた' },
    { at: [4 * M, 9 * Y], w: 5, need: 'dispersed', text: '夜の 道路で 車に ぶつかって、いのちを 終えた' },
    { at: [5 * M, 2 * Y], w: 2, text: '冬の 寒さと 空腹で、いのちを 終えた' },
    { at: [6 * M, 9 * Y], w: 3, need: ['mange', '!cured'], text: '皮ふの 病気で 体が 弱り、しずかに 眠った' },
    { at: [4 * M, 9 * Y], w: 1, text: 'イヌに おそわれて、いのちを 終えた' },
    { at: [Y, 9 * Y], w: 1, text: '病気に かかって、いのちを 終えた' },
    { at: [3 * Y, 9 * Y], w: 4, text: '巣あなの おくで、しずかに 眠るように いのちを 終えた' },
  ],

  titles: [
    { need: 'f', stat: { pups: 12 }, text: '{pups}匹の 子を 育てた タヌキの 母さん' },
    { need: 'm', stat: { pups: 12 }, text: '{pups}匹の 子を 育てた 子ぼんのうな 父さん' },
    { need: 'town', long: 0.05, text: '町の 夜を 知りつくした 古ダヌキ' },
    { need: 'sato', long: 0.05, text: '里山の 主（ぬし）と よばれた タヌキ' },
    { stat: { latrine: 300 }, text: 'ためふん場に {latrine}回 かよった 情報通' },
    { short: 0.8, text: '巣あなの そばで 夏を すごした 子ダヌキ' },
  ],

  facts: [
    'タヌキは 何頭かで 同じ 場所に ふんを する「ためふん」を つくり、においで 情報を やりとりすると 考えられています',
    'タヌキは イヌの なかまで、オスも えさを 運ぶなど 夫婦で 子育てを します',
    '日本では 1年に 11万〜37万頭の タヌキが 交通事故に あうと 推定されています（1998年の 推定）',
    'ポーランドの 調査では、1年目を 生きのびた タヌキは 約5匹に1匹でした',
    '野生の タヌキの 寿命は、長くて 6〜8年ほどです',
    'イヌの なかまで 冬ごもりを するのは タヌキだけ と 言われています（寒い 地方の タヌキ）',
  ],

  sources: [
    'https://dx.doi.org/10.5735/086.046.0406 (Kowalczyk ほか 2009 ポーランドのタヌキの繁殖と死亡: 3か月で61%死亡・1年目の死亡率0.82・最長7年・出生時の平均余命0.8年)',
    'https://www.biology.ox.ac.uk/node/2440971 (Saeki & Macdonald 2004 日本のタヌキの交通事故 1998年に11万〜37万頭)',
    'https://www.city.sapporo.jp/zoo/b_f/b_06/db069.html (円山動物園 エゾタヌキ: 野生の寿命6〜8年・ため糞・冬ごもり前に1.5倍に太る)',
    'https://en.wikipedia.org/wiki/Japanese_raccoon_dog (1腹4〜6匹・妊娠9週・ほぼ一夫一妻・野生7〜8年)',
    'https://en.wikipedia.org/wiki/Common_raccoon_dog (イヌ科で冬ごもりをするのはタヌキだけ)',
  ],
};
