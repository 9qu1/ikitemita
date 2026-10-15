// アゲハチョウ（ナミアゲハ Papilio xuthus）: 夏の世代／秋に さなぎに なって 冬をこす世代
//   ミカンや サンショウの 葉に たまご（約1週間）→ 幼虫（4回 だっぴして 5れい。1〜4れいは 鳥のふんに にる）
//   → さなぎ（夏は 10日〜2週間。秋の さなぎは そのまま 冬をこす）→ チョウ（2週間〜1か月）。年に 2〜5回 発生する
//   世代で すがたの切りかわる時期が ちがうので、variant に stages を持たせて plan で life.stages を差しかえる
import { H, D, W, M, Y } from '../units.js?v=1.0.1';

const SUMMER = { hatch: 5 * D, green: 17 * D, pupa: 25 * D, adult: 36 * D };
const AUTUMN = { hatch: 7 * D, green: 22 * D, pupa: 32 * D, adult: 219 * D }; // 9月の たまご → 10月に さなぎ → 4月に 羽化

const stages = (T, pupaSay, adultSay) => [
  { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25 },
  { id: 'young', name: '小さな 幼虫', from: T.hatch, sprite: 'caterpillar', scale: 0.35, say: 'たまごから かえり、まず からを 食べた', icon: 'egg', big: 1 },
  { id: 'green', name: '緑の 幼虫', from: T.green, sprite: 'caterpillar', scale: 0.8, say: '4回目の だっぴで、緑色の 幼虫に なった', icon: 'sprout', big: 2 },
  { id: 'pupa', name: 'さなぎ', from: T.pupa, sprite: 'pupa', scale: 0.7, say: pupaSay, icon: 'sleep', big: 2 },
  { id: 'adult', name: 'アゲハチョウ', from: T.adult, sprite: 'butterfly', scale: 1, say: adultSay, icon: 'star', big: 3 },
];

// 幼虫 → さなぎ → チョウ のできごと（世代で時期が ずれるので variant ごとに作る）
const lifeEvents = (T) => [
  // 小さな 幼虫（鳥の ふんに 化ける）
  { at: [T.hatch + D, T.hatch + 4 * D], text: '白と 黒の もようで、鳥の ふんに 化けた', icon: 'look', big: 1 },
  { at: [T.hatch + D, T.green - D], p: 0.6, group: 'leaf', text: 'ミカンの やわらかい 葉を 食べた', icon: 'apple', mood: 'good' },
  { at: [T.hatch + D, T.green - D], group: 'leaf', text: 'サンショウの 若い 葉を 食べた', icon: 'apple', mood: 'good' },
  { at: [T.hatch + 2 * D, T.green - D], p: 0.8, text: 'だっぴして、ひと回り 大きく なった', icon: 'sprout' },
  { at: [T.hatch + 2 * D, T.green], p: 0.5, text: '雨の 日は、葉の うらで じっと していた', icon: 'rain' },
  { at: [T.hatch + 2 * D, T.green], p: 0.4, text: 'すぐ そばを、クモが 通りすぎた', icon: 'alert', mood: 'hard' },
  // 緑の 幼虫
  { at: [T.green + D, T.pupa - 2 * D], p: 0.7, text: '頭から オレンジの つのを 出して、おどかした', icon: 'alert', big: 2 },
  { at: [T.green, T.pupa - D], text: '葉を 1日に 何枚も たいらげた', icon: 'apple', mood: 'good' },
  { at: [T.green, T.pupa - D], p: 0.45, text: 'アシナガバチが 近くを 飛び、じっと かたまった', icon: 'alert', mood: 'hard', big: 1 },
  { at: [T.green, T.pupa - D], p: 0.3, text: '庭の 人に 見つかったが、そっと しておいてもらえた', icon: 'heart', mood: 'good', big: 1 },
  { at: [T.green, T.pupa - D], p: 0.3, text: '目玉もようで、鳥を にらみかえした', icon: 'look' },
  { at: [T.pupa - 2 * D, T.pupa - 2 * H], text: '食べるのを やめ、さなぎに なる 場所を さがした', icon: 'look' },
  // さなぎ（まわりの 色に あわせて 緑か 茶色に なる）
  { at: [T.pupa + H, T.pupa + D], p: 0.5, group: 'pcolor', text: 'まわりに あわせて、緑の さなぎに なった', icon: 'sprout' },
  { at: [T.pupa + H, T.pupa + D], group: 'pcolor', text: 'まわりに あわせて、茶色の さなぎに なった', icon: 'sleep' },
  { at: [T.adult - 4 * D, T.adult - H], p: 0.6, text: 'さなぎの からに、羽の もようが すけてきた', icon: 'look' },
  // チョウ
  { at: [T.adult + 0.5 * H, T.adult + 2 * H], text: 'ぬれた 羽を ゆっくり のばして、かわかした', icon: 'sun' },
  { at: [T.adult + 2 * H, T.adult + D], text: 'はじめて 空へ、ひらひらと 飛びたった', icon: 'plane', mood: 'good', big: 3, set: 'flew' },
  { at: [T.adult + D, T.adult + 30 * D], need: 'flew', repeat: [2, 4], text: ['{flower}の 花で、蜜を 吸った', '{flower2}の 花に とまって、ひと休み'], icon: 'flower', mood: 'good', add: { flowers: [3, 20] } },
  { at: [T.adult + D, T.adult + 20 * D], need: ['m', 'flew'], p: 0.7, text: 'ほかの オスと、くるくる 追いかけっこを した', icon: 'ball' },
  { at: [T.adult + D, T.adult + 20 * D], need: ['m', 'flew'], p: 0.4, text: 'しめった 地面に おりて、水を 吸った', icon: 'drop' },
  { at: [T.adult + 0.5 * D, T.adult + 5 * D], need: ['f', 'flew'], p: 0.75, text: 'オスと 出会い、結婚した', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
  { at: [T.adult + 2 * D, T.adult + 30 * D], need: 'mated', repeat: [2, 4], text: '前足で 葉の 味を たしかめ、たまごを 産んだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [10, 40] }, set: 'mother' },
  { at: [T.adult + D, T.adult + 25 * D], need: 'flew', p: 0.3, text: '鳥に 羽を かじられたが、飛びつづけた', icon: 'alert', mood: 'hard' },
  { at: [T.adult + D, T.adult + 25 * D], need: 'flew', p: 0.3, text: 'クモの 巣を、すれすれで よけた', icon: 'alert', mood: 'hard' },
  { at: [T.adult + D, T.adult + 20 * D], need: 'flew', p: 0.25, text: '風に のって、となり町まで 飛んでいった', icon: 'plane' },
  { at: [T.adult + 8 * D, T.adult + 30 * D], need: 'flew', p: 0.5, text: '羽の りんぷんが はがれ、色が うすく なった', icon: 'sleep' },
];

const PLACES = [
  { text: '東京の 庭の ミカンの 木', lat: 35.65, lon: 139.65 },
  { text: '長崎の ミカン畑', lat: 32.9, lon: 129.96 },
  { text: '京都の 山の サンショウの 木', lat: 35.1, lon: 135.75 },
  { text: '韓国 済州島の ミカン畑', lat: 33.38, lon: 126.55 },
  { text: '台湾の 町の 庭', lat: 25.03, lon: 121.56 },
  { text: 'ハワイの 庭の レモンの 木', lat: 21.3, lon: -157.8 },
];
// 冬に さなぎで 休眠するのは 冬の寒い所（ハワイや台湾の平地の 冬ごしは 入れない）
const PLACES_COLD = [
  { text: '東京の 庭の ミカンの 木', lat: 35.65, lon: 139.65 },
  { text: '京都の 山の サンショウの 木', lat: 35.1, lon: 135.75 },
  { text: '札幌の 公園の キハダの 木', lat: 43.06, lon: 141.35 },
  { text: '韓国 ソウルの 庭の サンショウ', lat: 37.57, lon: 126.98 },
  { text: '中国 北京の 公園の 木', lat: 39.9, lon: 116.4 },
];

export default {
  id: 'butterfly',
  name: 'アゲハチョウ',
  kind: 'bug',
  weight: 1,
  // チョウのなかま（約1万9000種）の数の資料は見つからなかった。10兆匹を目安にした（推計・根拠はうすい）
  realCount: 1e13,
  refDays: 60 * D,
  habitat: 'garden',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 葉の うらで、小さな たまごとして うまれた', '{place}の 葉の 上で うまれた'],

  variants: [
    {
      id: 'summer', label: 'アゲハチョウ（夏の 世代）', w: 0.7, places: PLACES,
      stages: stages(SUMMER, '糸で 体を ささえて、さなぎに なった', 'さなぎから、アゲハチョウが 出てきた'),
      fields: { flower: 'ヒャクニチソウ', flower2: 'ランタナ' },
      // 長崎の ミカン畑の 生命表（椿 1973 第2世代）: たまご 1000 → かえる 680 → 3れい 395 → 4れい 359 → 5れい 49 → さなぎ 4 → チョウ 約4。
      //   大きな 幼虫の 9割ちかくが アシナガバチに 食べられる。第1世代は さなぎの 96% が 寄生バチで チョウは 0.2匹。
      //   ここでは チョウに なれるのを 1000に 5ほど（2つの世代の間）にした。チョウは 2週間〜1か月
      survival: [[0, 1], [5 * D, 0.7], [8 * D, 0.45], [11 * D, 0.4], [13 * D, 0.36], [17 * D, 0.06], [25 * D, 0.008], [36 * D, 0.005], [43 * D, 0.0035], [50 * D, 0.002], [57 * D, 0.0008], [66 * D, 0.0002], [75 * D, 0]],
      events: [
        ...lifeEvents(SUMMER),
        { at: [SUMMER.pupa + D, SUMMER.adult - D], p: 0.4, text: 'さなぎの まま、夏の 暑さに たえた', icon: 'sun', mood: 'hard' },
        { at: [SUMMER.adult + D, SUMMER.adult + 20 * D], need: 'flew', p: 0.4, text: '夏の 強い 日ざしの 中を、飛びまわった', icon: 'sun', mood: 'good' },
      ],
    },
    {
      id: 'autumn', label: 'アゲハチョウ（さなぎで 冬ごし）', w: 0.3, places: PLACES_COLD, refDays: 245 * D,
      stages: stages(AUTUMN, 'さなぎに なって、冬ごしの したくを した', '春、さなぎから 春型の アゲハが 出てきた'),
      fields: { flower: 'ツツジ', flower2: 'アザミ' },
      // 秋の さなぎは 半年ほど 冬をこす。そのあいだも 寄生バチや 鳥に ねらわれる（割合は推計）
      survival: [[0, 1], [7 * D, 0.7], [11 * D, 0.45], [15 * D, 0.4], [18 * D, 0.36], [22 * D, 0.06], [32 * D, 0.008], [2 * M, 0.006], [4 * M, 0.0045], [6 * M, 0.0035], [219 * D, 0.003], [226 * D, 0.002], [233 * D, 0.0012], [240 * D, 0.0005], [250 * D, 0.0001], [260 * D, 0]],
      events: [
        ...lifeEvents(AUTUMN),
        { at: [2 * M, 6 * M], text: '寒い 冬の 日も、さなぎの まま 春を 待った', icon: 'snow', big: 2 },
        { at: [AUTUMN.adult + D, AUTUMN.adult + 15 * D], need: 'flew', p: 0.5, text: '春型の 小さめの 羽で、まだ 寒い 空を 飛んだ', icon: 'plane', mood: 'good', big: 1 },
      ],
    },
  ],

  stages: stages(SUMMER, '糸で 体を ささえて、さなぎに なった', 'さなぎから、アゲハチョウが 出てきた'),
  plan(rng, life, base) {
    if (base.variant.stages) life.stages = base.variant.stages.map((s) => ({ ...s }));
    return [];
  },

  stats: [
    { id: 'flowers', label: 'たずねた 花', unit: 'こ' },
    { id: 'eggs', label: '産んだ たまご', unit: 'こ' },
  ],

  events: [
    // たまご（どちらの世代も 4日までは たまご）
    { at: [D, 4 * D], p: 0.6, text: '葉の うらで、たまごの 色が 黒っぽく なった', icon: 'look' },
    { at: [2 * H, 4 * D], p: 0.3, text: '小さな ハチが、たまごの 上を 歩きまわった', icon: 'alert', mood: 'hard' },
  ],

  deaths: [
    { at: [0, 7 * D], w: 3, text: ['たまごの まま、小さな ハチに 食べられた', '強い 風で、たまごごと 葉から 落ちた'] },
    { at: [5 * D, 24 * D], w: 3, text: ['クモに 見つかって、いのちを 終えた', 'カマキリに つかまって、いのちを 終えた', '大雨で、葉から 流されて しまった'] },
    { at: [13 * D, 32 * D], w: 6, text: 'アシナガバチに 見つかって、いのちを 終えた' },
    { at: [13 * D, 32 * D], w: 1, text: '鳥に 見つかって、いのちを 終えた' },
    { at: [24 * D, 8 * M], need: '!flew', w: 3, text: ['さなぎに ハチが たまごを 産み、羽化できなかった', 'さなぎの まま、しずかに 眠った'] },
    { at: [2 * M, 7.5 * M], need: '!flew', w: 2, text: '冬の さなぎの まま、鳥に 見つかった' },
    { need: 'flew', w: 3, text: ['鳥に つかまって、いのちを 終えた', 'クモの 巣に かかって、いのちを 終えた'] },
    { need: 'flew', w: 3, text: '花の そばで 羽を とじ、しずかに 眠った' },
    { need: 'mother', w: 4, text: 'たまごを のこして、しずかに 眠った' },
  ],

  titles: [
    { need: 'mother', text: '{eggs}この たまごを たくした お母さん' },
    { need: ['flew', 'v-autumn'], text: '冬を こえて、春の 空を 飛んだ アゲハ' },
    { need: 'flew', text: '何百に ひとつの 空を 飛んだ アゲハ' },
    { need: '!flew', minAge: 25 * D, text: 'さなぎの 中で 空を 夢みた アゲハ' },
    { need: '!flew', minAge: 17 * D, maxAge: 25 * D, text: '大きな 緑の 幼虫まで 育った アゲハ' },
    { need: '!flew', minAge: 5 * D, maxAge: 17 * D, text: '鳥の ふんに 化けて がんばった 幼虫' },
    { maxAge: 5 * D, text: 'かえる 日を 待った 小さな たまご' },
    { short: 0.9, text: '葉っぱの うらの 小さな いのち' },
  ],

  facts: [
    'アゲハの 幼虫は 4回目の だっぴまで、鳥の ふんに にた もようで 身を まもります',
    '長崎の ミカン畑の 調査（1973年）では、1000この たまごから チョウに なれたのは 1匹にも 満たない〜4匹ほどでした',
    '大きく なった 幼虫の 多くは、アシナガバチに 食べられる という 調査が あります',
    '秋に さなぎに なった アゲハは そのまま 冬を こし、春に 少し 小さめの「春型」の チョウに なります',
    'アゲハは 前足で 葉の 味を たしかめて、たまごを 産む 葉を えらびます',
  ],

  sources: [
    'https://www.jstage.jst.go.jp/article/seitai/23/5/23_KJ00001775661/_article/-char/ja (椿 1973 日本生態学会誌23:210-217 長崎県大村のナミアゲハ生命表。表1・表2を読んだ)',
    'https://www.honda.co.jp/outdoor/adventure/namiageha.html (年に2〜5回発生・1〜4齢は鳥のフン・蛹で越冬・春型は小さい)',
    'https://kids.rurubu.jp/article/87130/ (卵 約1週間・蛹 10日〜2週間・成虫 2週間〜1か月・羽が伸びるまで1時間前後)',
    'https://doi.org/10.1038/ncomms1548 (Ozaki ほか 2011 ナミアゲハは前脚の味の受容体で産卵する植物を見分ける)',
  ],
};
