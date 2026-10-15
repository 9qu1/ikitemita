// アカウミガメ（北太平洋）: 日本の浜で うまれ、黒潮にのって太平洋を横断し、メキシコ沖で育ち、
//   数十年後に 生まれた浜へ戻って たまごを うむ。大人になれるのは 約1000匹に1匹（その厳しさをそのまま曲線にした）
//   たまごが うまれるのは6〜7月ごろ。だから「年齢ちょうど」の日が、毎年の産卵の季節になる
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

// はじめての産卵の年（メス）。29〜37歳のどれか1つ（グループで1つだけ選ぶ。だいたい同じ割合になるよう p を決めた）
const FIRST = [[29, 0.2], [31, 0.25], [33, 0.34], [35, 0.5], [37, 1]];
const firstNest = FIRST.flatMap(([a, p]) => [
  { at: [a * Y, a * Y + 2 * H], p, group: 'firstnest', need: ['f', 'home'], text: '夜の 浜に、何十年ぶりに 上がった', icon: 'house', big: 2, move: 'seashore', set: `n${a}` },
  { at: [a * Y + 3 * H, a * Y + 4 * H], need: `n${a}`, text: '砂を ほって、{n}この たまごを うんだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [100, 140] }, set: 'mom' },
  { at: [a * Y + 5 * H, a * Y + 7 * H], need: `n${a}`, text: '朝が 来る前に、しずかに 海へ もどった', icon: 'drop', move: 'ocean' },
  { at: [a * Y + 12 * D, a * Y + 16 * D], need: `n${a}`, text: '2週間後、また 浜に 上がって たまごを うんだ', icon: 'egg', mood: 'good', add: { eggs: [100, 140] } },
]);

// 2回目からの産卵の季節（2〜3年おき。1シーズンに3〜5回 うむので、まとめて数える）
//   エンジンは「窓の はじまり」の順に 処理するので、はじめての産卵より前に はじまる窓は 出ない（それでよい）
const LATER = [
  [33 * Y, 36 * Y, '2〜3年ぶりに 浜へ 帰って、{n}この たまごを うんだ'],
  [36 * Y, 40 * Y, 'また 生まれた 浜に 上がって、たまごを うんだ'],
  [40 * Y, 45 * Y, 'ことしも 何度か 浜に 上がって、たまごを うんだ'],
  [45 * Y, 52 * Y, '月の 明るい 夜、なれた 浜で たまごを うんだ'],
  [52 * Y, 62 * Y, '年を とっても、生まれた 浜で たまごを うんだ'],
];

export default {
  id: 'seaturtle',
  name: 'アカウミガメ',
  kind: 'animal',
  weight: 1,
  // 世界全体の数の調査はない。地中海だけで 約120万（子ガメを除く・DiMatteo ほか 2022）、
  // メキシコ沖の北太平洋の群れが 約4万3千（Seminoff ほか）、北西大西洋の おとなの メスが 約3万8千…から、世界で数百万と見積もった（目安）
  realCount: 3e6,
  refDays: 60 * Y,
  habitat: 'seashore',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 砂の中で、たまごとして うまれた', '{place}で、100こ以上の きょうだいと うまれた'],

  variants: [
    {
      id: 'np', label: 'アカウミガメ', w: 1, habitat: 'seashore',
      // 北太平洋の アカウミガメが たまごを うむのは 日本の浜だけ（NOAA）。屋久島の永田浜が 上陸数の3〜4割（環境省）
      places: [
        { text: '屋久島の 永田浜', lat: 30.4, lon: 130.43 },
        { text: '宮崎の 海岸', lat: 31.9, lon: 131.47 },
        { text: '鹿児島の 吹上浜', lat: 31.5, lon: 130.32 },
        { text: '和歌山の みなべの 千里の浜', lat: 33.74, lon: 135.31 },
        { text: '愛知の 渥美半島の 浜', lat: 34.6, lon: 137.2 },
        { text: '静岡の 御前崎の 浜', lat: 34.62, lon: 138.21 },
      ],
      // たまご→かえるまで（約55日）で 4割ほどが だめになる（高すぎる砂の温度・高波・砂から出られない）
      // 浜と 最初の夜の 海で 大きく へり、たまごから おとな（約30歳）まで のこるのは 0.0009〜0.0018（Heppell ほか）
      // ここでは たまごの 0.08%（うまれた 子ガメの 約1000匹に1匹強）が 30歳まで のこる
      survival: [[0, 1], [2 * W, 0.92], [40 * D, 0.8], [55 * D, 0.62], [58 * D, 0.55], [59 * D, 0.42], [61 * D, 0.32], [70 * D, 0.24], [4 * M, 0.13], [Y, 0.05], [3 * Y, 0.016], [10 * Y, 0.0035], [20 * Y, 0.0015], [30 * Y, 0.0008], [40 * Y, 0.0006], [55 * Y, 0.00035], [70 * Y, 0.00008], [80 * Y, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3 },
    { id: 'hatchling', name: '子ガメ', from: 55 * D, sprite: 'seaturtle', scale: 0.25, say: '砂の中で、たまごから かえった', icon: 'egg', big: 2 },
    { id: 'juvenile', name: '若いカメ', from: Y, sprite: 'seaturtle', scale: 0.45 },
    { id: 'subadult', name: '大きなカメ', from: 15 * Y, sprite: 'seaturtle', scale: 0.75, say: '体が ずっしりと 重くなり、こうらも 大きく なった', icon: 'star' },
    { id: 'adult', name: 'おとなのカメ', from: 30 * Y, sprite: 'seaturtle', scale: 1, say: 'りっぱな おとなの アカウミガメに なった', icon: 'star', big: 2 },
  ],

  stats: [
    { id: 'km', label: '泳いだ きょり', unit: 'km' },
    { id: 'eggs', label: 'うんだ たまご', unit: 'こ' },
  ],

  events: [
    // 砂の中の たまご（約55日）
    { at: [0, 2 * H], text: 'お母さんが 砂を かけて、そっと 海へ 帰っていった', icon: 'feather' },
    { at: [3 * D, 40 * D], text: '砂の中で、お日さまの あたたかさを 感じた', icon: 'sun' },
    { at: [20 * D, 40 * D], need: 'f', text: '砂が あたたかくて、メスに なることが 決まった', icon: 'sun' },
    { at: [20 * D, 40 * D], need: 'm', text: '砂が すこし すずしくて、オスに なることが 決まった', icon: 'sun' },
    { at: [10 * D, 50 * D], p: 0.3, text: '大雨が ふって、砂の中が ひんやりした', icon: 'rain', mood: 'hard' },
    { at: [10 * D, 50 * D], p: 0.3, text: '台風の 高波が、すぐ 近くまで 来た', icon: 'alert', mood: 'hard' },
    { at: [5 * D, 50 * D], p: 0.25, text: '見守りの 人が、巣の まわりに 囲いを 立ててくれた', icon: 'house', mood: 'good' },

    // 砂から出て、海へ
    { at: [55 * D, 58 * D], text: 'きょうだいと いっしょに、砂の中を 上へ ほりすすんだ', icon: 'sprout', big: 1 },
    { at: [55 * D, 58 * D], p: 0.2, text: '浜の 近くの 人が、夜の 明かりを 消してくれた', icon: 'star', mood: 'good' },
    { at: [58 * D, 58.5 * D], text: '夜の すずしい 時間に、砂から 顔を 出した', icon: 'look', big: 2 },
    { at: [58.5 * D, 59 * D], text: '海の 明るい ほうへ、全力で 走った', icon: 'star', big: 3, move: 'ocean', set: 'sea' },
    { at: [59 * D, 60 * D], need: 'sea', text: '波を くぐって、一日中 休まず 泳ぎつづけた', icon: 'drop', mood: 'good', big: 1, add: { km: [30, 60] } },
    { at: [59 * D, 62 * D], p: 0.3, need: 'sea', text: '大きな 魚の かげから、ひっしで にげた', icon: 'alert', mood: 'hard' },

    // 黒潮にのって 太平洋へ
    { at: [62 * D, 4 * M], p: 0.6, need: 'sea', text: '黒潮に のって、北へ 東へ 流されていった', icon: 'drop', add: { km: [500, 1500] } },
    { at: [2 * M, Y], p: 0.5, need: 'sea', text: 'ただよう 海そうの かげで、小さな エビを 食べた', icon: 'apple' },
    { at: [62 * D, 6 * M], p: 0.4, need: 'sea', text: '海面の 小さな クラゲを、ぱくっと 食べた', icon: 'apple', mood: 'good' },
    { at: [6 * M, 3 * Y], p: 0.3, need: 'sea', text: '台風の 大波に もまれて、遠くまで 流された', icon: 'rain', mood: 'hard' },
    { at: [3 * M, 3 * Y], p: 0.25, need: 'sea', text: 'ビニールぶくろを、クラゲと まちがえそうに なった', icon: 'alert', mood: 'hard' },
    { at: [Y, 6 * Y], p: 0.6, need: 'sea', text: '北太平洋の まんなかを、ゆっくり 東へ 旅した', icon: 'plane', big: 1, add: { km: [3000, 5000] } },
    { at: [Y, 10 * Y], repeat: [1, 2], need: 'sea', text: ['海面に 浮かんで、こうらを お日さまで あたためた', '流木の そばで、小さな 魚の 群れと ただよった'], icon: 'sun', mood: 'good' },
    { at: [2 * Y, 10 * Y], p: 0.3, need: 'sea', text: 'マンボウと ならんで、海面で ひなたぼっこした', icon: 'sun', mood: 'good' },

    // メキシコ沖で 育つ
    { at: [3 * Y, 12 * Y], p: 0.7, need: 'sea', text: '1万キロ 泳いで、メキシコの 沖に たどりついた', icon: 'plane', mood: 'good', big: 3, add: { km: [4000, 6000] }, set: 'mexico' },
    { at: [3 * Y, 20 * Y], repeat: [1, 2], need: 'mexico', text: ['メキシコの 沖で、赤い カニを おなかいっぱい 食べた', 'バハ・カリフォルニアの 海で、すくすく 育った'], icon: 'apple', mood: 'good' },
    { at: [5 * Y, 25 * Y], p: 0.3, need: 'mexico', text: '漁の あみに からまりかけて、なんとか ぬけだした', icon: 'alert', mood: 'hard' },
    { at: [5 * Y, 30 * Y], p: 0.25, need: 'sea', text: '大きな サメに 追われ、かたい こうらで 身を 守った', icon: 'alert', mood: 'hard' },
    { at: [12 * Y, 30 * Y], p: 0.3, need: 'sea', text: 'こうらに フジツボが ついて、すこし 重くなった', icon: 'look' },

    // 日本の 海へ 帰る
    { at: [10 * Y, 25 * Y], p: 0.85, need: 'mexico', text: '太平洋を 西へ、生まれた 日本の 海へ 引きかえした', icon: 'plane', big: 3, add: { km: [10000, 12000] }, set: 'back' },
    { at: [15 * Y, 30 * Y], p: 0.6, need: 'back', text: '日本の 近くの 海で、貝や カニを 食べて くらした', icon: 'apple', mood: 'good' },
    { at: [20 * Y, 60 * Y], p: 0.3, need: 'sea', text: '岩の かげで、何時間も 息を とめて 眠った', icon: 'sleep' },
    { at: [6 * Y, 60 * Y], p: 0.3, need: 'sea', text: 'イルカの 群れが、すぐ そばを 通りすぎた', icon: 'look' },

    // おとな: オスは 一生 陸に 上がらない。メスは 生まれた浜へ 帰って たまごを うむ
    { at: [25 * Y, 40 * Y], p: 0.75, need: 'm', text: '日本の 近くの 海で、メスに 会いに 行った', icon: 'heart', mood: 'good', big: 2 },
    { at: [27 * Y, 28.9 * Y], p: 0.9, need: ['f', 'sea'], text: '何十年も 前に 生まれた 浜の 近くへ、帰ってきた', icon: 'house', big: 3, set: 'home' },
    ...firstNest,
    ...LATER.map(([a, b, text]) => ({ at: [a, b], p: 0.75, need: 'mom', text, icon: 'egg', mood: 'good', big: 1, add: { eggs: [300, 560] } })),
    { at: [62 * Y, 80 * Y], p: 0.7, need: 'mom', text: 'これまでに {eggs}この たまごを 浜に のこした', icon: 'egg', mood: 'good', big: 2 },
    { at: [45 * Y, 80 * Y], p: 0.5, need: 'sea', text: 'こうらの 傷あとが、長い 旅の しるしに なった', icon: 'star' },
  ],

  deaths: [
    { at: [0, 55 * D], w: 3, text: ['砂の中で、たまごのまま 眠った', '暑すぎる 砂の中で、かえらずに 眠った'] },
    { at: [0, 55 * D], w: 2, text: '高波に 巣を さらわれて、たまごのまま いのちを 終えた' },
    { at: [55 * D, 58.5 * D], w: 3, need: '!sea', text: '砂の 中から 出られずに、しずかに 眠った' },
    { at: [58 * D, 59 * D], w: 3, need: '!sea', text: '海に たどりつく 前に、スナガニに つかまった' },
    { at: [58 * D, 59 * D], w: 2, need: '!sea', text: '浜で 鳥に 見つかって、いのちを 終えた' },
    { at: [58.5 * D, 2 * Y], w: 5, need: 'sea', text: ['海で 大きな 魚に 食べられて、ちいさな いのちを 終えた', '海鳥に 見つかって、ちいさな いのちを 終えた'] },
    { at: [3 * M, 10 * Y], w: 1, need: 'sea', text: 'ただよう プラスチックを のみこんで、眠った' },
    { at: [3 * M, 10 * Y], w: 1, need: 'sea', text: 'えさの すくない 海で、力つきて 眠った' },
    { at: [3 * Y, 40 * Y], w: 2, need: 'mexico', text: '漁の あみに かかって、いのちを 終えた' },
    { at: [5 * Y, 80 * Y], w: 2, need: 'sea', text: 'サメに おそわれて、いのちを 終えた' },
    { at: [30 * Y, 80 * Y], w: 5, need: 'sea', text: '長い 旅を 終えて、海の 底で しずかに 眠った' },
    { at: [40 * Y, 80 * Y], w: 3, need: 'mom', text: '生まれた 浜の 見える 海で、しずかに 眠った' },
  ],

  titles: [
    { need: 'mom', text: '生まれた 浜へ 帰ってきた 1000匹に 1匹の お母さん' },
    { need: 'back', text: '太平洋を 往復した 旅する カメ' },
    { need: ['mexico', '!back'], text: 'メキシコの 海まで 泳いだ アカウミガメ' },
    { need: 'm', long: 0.001, text: '一生 陸に 上がらなかった 海の 旅人' },
    { need: '!sea', maxAge: 55, text: '砂の中の、ちいさな たまごの いのち' },
    { need: '!sea', minAge: 55, text: '海を めざして はい出した 子ガメ' },
    { need: ['sea', '!mexico'], minAge: Y, text: '黒潮の 先の 大海原を 旅した 若いカメ' },
    { need: ['sea', '!mexico'], maxAge: Y, text: 'ほんの すこしだけ 海を 見た 子ガメ' },
  ],

  facts: [
    '北太平洋の アカウミガメが たまごを うむのは、日本の 浜だけです',
    '屋久島の 永田浜は、日本の アカウミガメの 上陸の 3〜4割を しめます',
    '1回に 100〜140こほどの たまごを うみ、1シーズンに 何回も うみます',
    'うまれた 子ガメのうち、大人に なれるのは 約1000匹に1匹 と言われています',
    '砂の 温度が 高いと メス、低いと オスが 多く うまれます',
    '日本で うまれた 子ガメは、太平洋を 横切って メキシコの 沖で 育ちます',
  ],

  sources: [
    'https://www.fisheries.noaa.gov/species/loggerhead-turtle (NOAA: 寿命70年以上・成熟約35歳・1回約100こ・3〜5回・2〜3年おき・温度で性別・北太平洋は日本だけで産卵)',
    'https://www.env.go.jp/park/yakushima/ywhcc/np/umigame.html (環境省 屋久島: 永田浜が上陸の30〜40%・親になるまで30年ほど)',
    'https://www.env.go.jp/nature/ramsar/conv/ramsarsitej/RamsarSites2022_Jp57.pdf (永田浜: 5〜8月・100〜140こ・2〜3か月でふ化)',
    'https://digitalcommons.usu.edu/envs_facpub/1399 (たまごから成熟までの生存 0.0009〜0.0018)',
    'https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/loggerhead-sea-turtle-2010-part1.html (COSEWIC 2010: 成熟16〜35歳・1回約112こ・ふ化7〜13週・寿命57年以上)',
    'https://seamap.env.duke.edu/dataset/126/html (Adelita: メキシコから日本へ 1万2千km以上・北太平洋の群れは日本うまれ)',
    'https://ccb.kglmeridian.com/view/journals/ccab/16/1/article-p106.xml (バハ・カリフォルニアの若いカメ・赤いカニを食べる・1万km)',
    'https://www.biodic.go.jp/moni1000/findings/reports/pdf/2023_seaturtles.pdf (モニタリングサイト1000: 2023年 上陸5,747回・産卵2,675回)',
    'https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2022.930412/text (地中海の アカウミガメ 約120万)',
  ],
};
