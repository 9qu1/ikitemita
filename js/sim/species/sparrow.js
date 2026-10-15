// スズメ（Passer montanus・日本の町や田んぼのスズメ）
//   たまごから はじまる。たまご100こ → 巣立ち 約50羽 → 次の年まで 約10羽 → 5年目まで 1〜2羽（三上修『スズメ』ほか）
import { H, D, W, M, Y } from '../units.js?v=1.0.3';

// 生き残りの曲線（町も田んぼも同じ）: 13日で ふ化・28日で 巣立ち
const SURVIVAL = [[0, 1], [13 * D, 0.75], [28 * D, 0.5], [2 * M, 0.3], [6 * M, 0.15], [Y, 0.1], [2 * Y, 0.055], [3 * Y, 0.03], [4 * Y, 0.018], [5 * Y, 0.011], [7 * Y, 0.004], [9 * Y, 0.0012], [11 * Y, 0.0002], [12 * Y, 0]];

export default {
  id: 'sparrow',
  name: 'スズメ',
  kind: 'animal',
  weight: 1,
  realCount: 2.5e8, // 世界のスズメ（この種類）の おとなは 1億9000万〜3億1000万羽（BirdLife）
  refDays: 5 * Y,
  habitat: 'town',
  birth: ['{place}の 巣で、たまごとして うまれた', '{place}の 巣に、たまごが ひとつ ふえた'],

  variants: [
    {
      id: 'town', label: '町のスズメ', w: 0.6, habitat: 'town', tags: ['town'],
      places: [
        { text: '東京の 家の 屋根の すきま', lat: 35.69, lon: 139.69 },
        { text: '大阪の 電柱の すきま', lat: 34.69, lon: 135.5 },
        { text: '北京の 古い 家の かべ', lat: 39.9, lon: 116.4 },
        { text: 'ソウルの ビルの すきま', lat: 37.57, lon: 126.98 },
        { text: 'ハノイの 家の のき下', lat: 21.03, lon: 105.85 },
        { text: '上海の 団地の かべ', lat: 31.23, lon: 121.47 },
      ],
      survival: SURVIVAL,
    },
    {
      id: 'village', label: '田んぼのスズメ', w: 0.4, habitat: 'village', tags: ['village'],
      places: [
        { text: '新潟の 田んぼのそばの 農家', lat: 37.9, lon: 139.02 },
        { text: '中国の 農村の 古い 家', lat: 34.3, lon: 108.9 },
        { text: 'ドイツの 農家の かべ', lat: 51.0, lon: 10.5 },
        { text: 'イギリスの 農場の 木の あな', lat: 52.6, lon: -1.1 },
        { text: '北海道の 牧場の 小屋', lat: 43.0, lon: 143.2 },
        { text: 'カザフスタンの 村', lat: 43.25, lon: 76.9 },
      ],
      survival: SURVIVAL,
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3 },
    { id: 'chick', name: 'ひな', from: 13 * D, sprite: 'sparrow', scale: 0.4, say: 'からを わって、はだかの ひなが かえった', icon: 'egg', big: 1 },
    { id: 'fledgling', name: '巣立ちびな', from: 28 * D, sprite: 'sparrow', scale: 0.7, say: '巣から 飛びだした（巣立ち）', icon: 'star', big: 3 },
    { id: 'adult', name: 'おとなのスズメ', from: 4 * M, sprite: 'sparrow', scale: 0.9, say: 'ほおの 黒い もようが、くっきり してきた', icon: 'feather' },
  ],

  stats: [
    { id: 'chicks', label: '巣立たせた ひな', unit: '羽' },
    { id: 'eggs', label: 'うんだ たまご', unit: 'こ' },
    { id: 'baths', label: '砂あび・水あび', unit: '回' },
  ],

  events: [
    // たまご
    { at: [D, 8 * D], p: 0.6, text: '親鳥の おなかの下で、ぽかぽか あたためられた', icon: 'sun', mood: 'good' },
    { at: [10 * D, 13 * D], p: 0.5, text: 'からの 中で、ちいさく 動きはじめた', icon: 'egg' },

    // ひな
    { at: [13 * D, 16 * D], text: '大きな 口を あけて、親鳥に 虫を ねだった', icon: 'apple', mood: 'good' },
    { at: [17 * D, 20 * D], text: 'はじめて 目が ひらいた', icon: 'look', big: 1 },
    { at: [18 * D, 24 * D], p: 0.8, text: 'うぶ毛の 下から、羽が ぴんと 生えてきた', icon: 'feather' },
    { at: [15 * D, 27 * D], p: 0.3, text: 'きょうだいと 押しあって、巣から 落ちかけた', icon: 'alert', mood: 'hard' },
    { at: [16 * D, 27 * D], p: 0.3, text: '巣の 外で カラスの 声が して、じっと 息を ひそめた', icon: 'alert', mood: 'hard' },

    // 巣立ちびな
    { at: [28 * D, 35 * D], p: 0.9, text: '電線に とまって、親鳥に えさを ねだった', icon: 'apple', mood: 'good' },
    { at: [29 * D, 40 * D], p: 0.7, text: 'はじめて 自分で、草の たねを ついばんだ', icon: 'sprout', big: 1 },
    { at: [30 * D, 45 * D], p: 0.4, text: '飛ぶ れんしゅうで、植えこみに つっこんだ', icon: 'ball' },
    { at: [35 * D, 3 * M], p: 0.6, text: '若い スズメの 群れに くわわった', icon: 'friends', mood: 'good', big: 1, set: 'flock' },
    { at: [M, 6 * M], p: 0.35, text: 'ネコが しのびよってきて、あわてて 飛びたった', icon: 'alert', mood: 'hard' },
    { at: [M, 10 * Y], repeat: [1, 3], text: ['水たまりで 水あびを した', 'かわいた 土で、砂あびを した', '小さな 池で、羽を ばたばた 洗った'], icon: 'drop', mood: 'good', add: { baths: [10, 60] } },

    // 町のスズメ
    { at: [M, 3 * Y], p: 0.5, need: 'town', text: '公園の ベンチの下で、パンくずを ひろった', icon: 'apple', mood: 'good' },
    { at: [2 * M, 4 * Y], p: 0.35, need: 'town', text: '駅前の 木に、何百羽もの なかまと とまって 夜を すごした', icon: 'sleep', big: 1 },
    { at: [2 * M, 4 * Y], p: 0.3, need: 'town', text: 'ガラスに うつった 自分に、首を かしげた', icon: 'look' },
    { at: [M, 3 * Y], p: 0.3, need: 'town', text: '店先に こぼれた お米を、なかまと ついばんだ', icon: 'apple', mood: 'good' },

    // 田んぼのスズメ
    { at: [2 * M, 6 * M], p: 0.6, need: 'village', text: 'みのった いねを ついばんで、農家の 人に 追いはらわれた', icon: 'alert' },
    { at: [2 * M, 6 * M], p: 0.4, need: 'village', text: 'かかしを こわごわ 見ていたが、すぐに なれた', icon: 'look' },
    { at: [M, 4 * Y], p: 0.4, need: 'village', text: '田んぼの 虫を つかまえて、おなかいっぱいに なった', icon: 'apple', mood: 'good' },
    { at: [2 * M, 4 * Y], p: 0.35, need: 'village', text: '竹やぶの ねぐらで、なかまと おしゃべりして ねむった', icon: 'sleep', mood: 'good' },

    // 季節
    { at: [5 * M, 9 * M], p: 0.7, text: '寒い 朝、羽を ふくらませて まんまるに なった（ふくらスズメ）', icon: 'snow' },
    { at: [5 * M, 10 * M], p: 0.4, text: '雪の日、ごはんが 見つからず おなかが すいた', icon: 'snow', mood: 'hard' },
    { at: [6 * M, 6 * Y], p: 0.3, text: 'モズに ねらわれて、やぶの 中へ にげこんだ', icon: 'alert', mood: 'hard' },
    { at: [6 * M, 6 * Y], p: 0.3, text: '庭の えさ台に、毎朝 かよった', icon: 'apple', mood: 'good' },
    { at: [2 * M, 8 * Y], p: 0.15, text: '鳥の 研究者に、足輪を つけてもらった', icon: 'gift', set: 'ringed' },

    // 子育て（うまれた次の春から）
    { at: [9 * M, 13 * M], p: 0.85, text: 'つがいの 相手を 見つけた', icon: 'heart', mood: 'good', big: 2, set: 'paired' },
    { at: [9 * M, 14 * M], need: 'paired', text: 'かれ草や 羽を 運んで、すきまに 巣を つくった', icon: 'box', big: 1, set: 'nest' },
    { at: [10 * M, 14 * M], need: 'nest', text: '{n}この たまごを、つがいで かわりばんこに あたためた', icon: 'egg', big: 2, add: { eggs: [4, 6] } },
    { at: [11 * M, 15 * M], p: 0.4, need: 'nest', text: 'ヘビが 巣に 近づき、つがいで さわいで 追いはらった', icon: 'alert', mood: 'hard' },
    { at: [11 * M, 15 * M], p: 0.25, need: 'nest', text: '大雨で、巣の たまごが だめに なった', icon: 'rain', mood: 'hard' },
    { at: [11 * M, 12 * Y], repeat: [1, 5], need: 'nest', text: ['ひなに 虫を 運びつづけ、{n}羽が 巣立った', '{n}羽の ひなが、ぶじに 巣立っていった'], icon: 'baby', mood: 'good', big: 3, add: { chicks: [1, 5] }, set: 'parent' },
    { at: [11 * M, 6 * Y], p: 0.35, need: 'nest', text: '朝から 夕方まで、ひなに 虫を 運びつづけた', icon: 'apple' },
    { at: [21 * M, 12 * Y], p: 0.4, need: 'nest', text: 'ことしも 同じ 巣あなで、子育てを した', icon: 'house', mood: 'good', add: { eggs: [4, 6] } },

    // 長生き
    { at: [3 * Y, 12 * Y], p: 0.6, text: '群れの 中で、いちばんの 古株に なった', icon: 'crown', big: 2 },
    { at: [4 * Y, 12 * Y], p: 0.6, text: '若い スズメたちに まじって、のんびり 日なたぼっこした', icon: 'sun', mood: 'good' },
  ],

  deaths: [
    { at: [0, 13 * D], w: 3, text: ['たまごの まま、ひなに なる前に いのちを 終えた', 'たまごが かえらないまま、いのちを 終えた'] },
    { at: [0, 13 * D], w: 1, text: 'ヘビに 巣を 見つけられ、たまごの まま いのちを 終えた' },
    { at: [13 * D, 28 * D], w: 3, text: ['巣から 落ちて、ちいさな いのちを 終えた', '雨つづきで 虫が とれず、巣の中で 眠った'] },
    { at: [13 * D, 28 * D], w: 1, text: 'カラスに 巣を 見つけられて、いのちを 終えた' },
    { at: [28 * D, 6 * M], w: 3, text: ['ネコに つかまって、いのちを 終えた', 'カラスに つかまって、いのちを 終えた'] },
    { at: [28 * D, 3 * M], w: 2, text: 'ひとり立ちの ころ、えさが とれずに いのちを 終えた' },
    { at: [4 * M, 12 * Y], w: 3, text: '冬の 寒さと 空腹で、いのちを 終えた' },
    { at: [4 * M, 12 * Y], w: 2, text: 'タカに つかまって、いのちを 終えた' },
    { at: [6 * M, 12 * Y], w: 1, text: 'まどガラスに ぶつかって、いのちを 終えた' },
    { at: [3 * Y, 15 * Y], w: 4, text: 'ねぐらの 木の上で、しずかに いのちを 終えた' },
  ],

  titles: [
    { stat: { chicks: 12 }, text: '{chicks}羽の ひなを 巣立たせた 子育て名人' },
    { need: 'ringed', long: 0.02, text: '足輪の 記録に のこる 長生きスズメ' },
    { long: 0.01, text: '町の 古株に なった スズメ' },
    { need: 'parent', text: 'すきまの 巣で 家族を 育てた スズメ' },
    { short: 0.75, maxAge: 13 * D, text: 'たまごの まま 春を すごした いのち' },
    { short: 0.5, minAge: 13 * D, text: '巣の中だけで 世界を 知った ひな' },
    { short: 0.15, long: 0.5, text: '巣立って 空を とんだ、たった1羽の スズメ' },
  ],

  facts: [
    'スズメの たまご 100こ のうち、巣立てるのは 約50羽、次の年まで 生きのこるのは 約10羽 と 言われています',
    '日本には 約1800万羽の スズメが いると 推定されています（2008年の 子育ての 季節の おとな）',
    'ヨーロッパでは、足輪の 調査で 10年いじょう 生きた スズメの 記録が あります',
    'スズメの ひなは、たまごから かえって 約2週間で 巣立ちます',
    '寒い日の スズメは、羽の あいだに 空気を ためて まるく なります。これを「ふくらスズメ」と よびます',
  ],

  sources: [
    'https://tenki.jp/suppl/usagida/2015/03/13/2291.html (三上修『スズメ』ほか: たまご100→巣立ち50→翌年10→5年目1〜2羽・1回に4〜6卵)',
    'https://www.bto.org/learn/about-birds/birdfacts/tree-sparrow (BTO: 1腹 平均5.05卵・抱卵12.8日・巣立ち15.9日・おとなの年生存率0.43・最長10年10か月)',
    'https://www.federcaccia.org/wp-content/uploads/EURING_longevity_list_20230901.pdf (EURING 長寿記録: Tree Sparrow 10年4か月 ドイツ ほか)',
    'https://cir.nii.ac.jp/crid/1390282680210887296 (三上修 2009 日本鳥学会誌 日本のスズメ 2008年の成鳥 約1800万羽)',
    'https://en.wikipedia.org/wiki/Eurasian_tree_sparrow (BirdLife: 世界の成鳥 1億9000万〜3億1000万羽)',
  ],
};
