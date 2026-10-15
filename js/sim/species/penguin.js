// コウテイペンギン: 真冬の南極で、お父さんが足の上でたまごを約2か月温める（そのあいだ何も食べない）
//   たまごが うまれるのは5月ごろ。だから「年齢ちょうど」の日が、毎年の子育ての季節（5月）になる
import { H, D, W, M, Y } from '../units.js?v=1.0.3';

// はじめての子育て（5歳の5月）。お父さんとお母さんで 動きがちがう
const B = 5 * Y;

// 2回目からの子育て（数年ずつの窓に分ける。ひなが巣立つのは2年に1羽ほど）
const LATER = [
  [6 * Y, 9 * Y, '2回目の 子育てで、ひなを 海へ 送りだした'],
  [9 * Y, 13 * Y, '新しい 相手と、また ひなを 育てあげた'],
  [13 * Y, 18 * Y, 'ふぶきの 冬を こえて、また ひなを 育てあげた'],
  [18 * Y, 25 * Y, 'なれた 足どりで、ことしも ひなを 育てあげた'],
  [25 * Y, 35 * Y, '群れの ベテランとして、ひなを 海へ 送りだした'],
];

export default {
  id: 'penguin',
  name: 'コウテイペンギン',
  kind: 'animal',
  weight: 1,
  realCount: 6e5, // おとなが 約59万5千羽（Fretwell ほか 2012・衛星写真での全数調査）
  refDays: 30 * Y,
  habitat: 'ice',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で、たまごとして うまれた', '{place}の 氷の上で、たまごとして うまれた'],

  variants: [
    {
      id: 'colony', label: 'コウテイペンギン', w: 1, habitat: 'ice',
      places: [
        { text: '南極 アデリーランドの 海氷', lat: -66.67, lon: 140.0 },
        { text: '南極 ロス海の ワシントン岬', lat: -74.65, lon: 165.4 },
        { text: '南極 ロス海の クールマン島', lat: -73.4, lon: 169.7 },
        { text: '南極 ウェッデル海の アトカ湾', lat: -70.6, lon: -8.1 },
        { text: '南極の スノーヒル島', lat: -64.5, lon: -57.4 },
        { text: '南極の アマンダ湾', lat: -69.27, lon: 76.83 },
      ],
      // たまご→巣立ち（約7か月）で 6割ほど。巣立ってから1年 生きのこるのは 年によって 8〜48%（Abadi ほか 2017）
      // かえった ひなのうち 1年 生きのこるのは 約19%・おとなの 年間生存率は 95.1%（Wikipedia が まとめた 研究）
      // 95%が つづくと「かえった ひなの 1%ほどが 50歳まで 生きうる」計算になる。ここでは 40歳から先を すこし けずっている
      survival: [[0, 1], [3 * W, 0.93], [50 * D, 0.88], [70 * D, 0.82], [3 * M, 0.75], [5 * M, 0.66], [220 * D, 0.58], [Y, 0.25], [1.6 * Y, 0.15], [3 * Y, 0.12], [5 * Y, 0.105], [10 * Y, 0.082], [20 * Y, 0.05], [30 * Y, 0.03], [40 * Y, 0.014], [45 * Y, 0.006], [50 * Y, 0.002], [55 * Y, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.35 },
    { id: 'chick', name: 'ひな', from: 68 * D, sprite: 'penguin_chick', scale: 0.45, say: 'お父さんの 足の上で、たまごから かえった', icon: 'egg', big: 2 },
    { id: 'creche', name: '大きな ひな', from: 115 * D, sprite: 'penguin_chick', scale: 0.7, say: 'ひなどうしで 集まる「クレイシ」に 入った', icon: 'friends', big: 1 },
    { id: 'young', name: '若いペンギン', from: 220 * D, sprite: 'penguin', scale: 0.8, habitat: 'ocean', say: 'おとなの 羽に 生えかわり、ひとりで 海へ 旅立った', icon: 'plane', big: 3 },
    { id: 'adult', name: 'おとなのペンギン', from: 4 * Y, sprite: 'penguin', scale: 1, habitat: 'ice', say: 'うまれた 氷の上の 群れに、はじめて 帰ってきた', icon: 'house', big: 2 },
    { id: 'elder', name: 'ベテランのペンギン', from: 25 * Y, sprite: 'penguin', scale: 0.95, say: '何十回も 冬を こえた、群れの ベテランに なった', icon: 'star' },
  ],

  stats: [
    { id: 'chicks', label: '巣立った ひな', unit: '羽' },
    { id: 'eggs', label: '温めた たまご', unit: 'こ' },
    { id: 'dives', label: 'もぐった 回数', unit: '回' },
  ],

  events: [
    // たまごのころ（5〜7月・真冬の南極）
    { at: [0, 2 * H], text: 'お母さんから お父さんの 足の上へ、そっと わたされた', icon: 'egg', big: 2 },
    { at: [3 * D, 3 * W], text: 'お父さんの おなかの 羽毛に つつまれて、あたたかかった', icon: 'heart', mood: 'good' },
    { at: [2 * W, 60 * D], p: 0.8, text: 'マイナス40度の ふぶきの中、お父さんたちが よりそった', icon: 'snow', mood: 'hard' },
    { at: [3 * W, 60 * D], p: 0.4, text: 'おしくらまんじゅうの まんなかで、ぬくぬく すごした', icon: 'friends', mood: 'good' },

    // ひなのころ（7〜12月）
    { at: [68 * D, 72 * D], p: 0.5, text: 'お父さんが のどから 出す ミルクを もらった', icon: 'drop', mood: 'good', big: 1 },
    { at: [72 * D, 80 * D], text: '海から 帰った お母さんと、はじめて 会った', icon: 'heart', mood: 'good', big: 2 },
    { at: [80 * D, 88 * D], text: 'やせた お父さんが、ごはんを 食べに 海へ 出かけた', icon: 'feather' },
    { at: [105 * D, 118 * D], text: 'はじめて 自分の 足で、氷の上に 立った', icon: 'sprout', big: 1 },
    { at: [85 * D, 200 * D], repeat: [1, 2], text: ['帰ってきた 親から、魚を たっぷり もらった', 'おなかが ふくれるまで、ごはんを もらった', '何千羽もの 中から、親の 声を ききわけた'], icon: 'fish', mood: 'good' },
    { at: [90 * D, 200 * D], p: 0.35, text: 'オオフルマカモメに ねらわれて、仲間の 中に かくれた', icon: 'alert', mood: 'hard' },
    { at: [100 * D, 200 * D], p: 0.3, text: '親の 帰りが おそくて、おなかを すかせて 待った', icon: 'rain', mood: 'hard' },
    { at: [150 * D, 215 * D], p: 0.5, text: 'ふわふわの 灰色の 毛が、ぬけはじめた', icon: 'feather' },

    // 海での 若いころ（巣立ちから4歳まで）
    { at: [220 * D, 230 * D], text: 'はじめて 海に とびこんで、泳ぎを おぼえた', icon: 'drop', big: 2 },
    { at: [230 * D, 3 * Y], p: 0.4, text: 'ヒョウアザラシの かげから、全力で にげた', icon: 'alert', mood: 'hard' },
    { at: [8 * M, 4 * Y], repeat: [1, 2], text: ['ナンキョクオキアミの 群れを 見つけて 食べた', '小さな 魚を 追いかけて、深く もぐった', 'イカを つかまえて、まるのみに した'], icon: 'fish', add: { dives: [300, 2000] } },
    { at: [Y, 4 * Y], p: 0.3, text: '同じ年に うまれた 若者たちと、海を 旅した', icon: 'friends', mood: 'good' },

    // はじめての 子育て（5歳の5月。おとなが 子育てを はじめるのは だいたい4〜6歳）
    { at: [B - 25 * D, B - 10 * D], p: 0.85, text: 'ラッパのような 声で 歌って、相手を さがした', icon: 'music', big: 1, set: 'court' },
    { at: [B - 10 * D, B - 2 * D], p: 0.9, need: 'court', text: '相手と 向かいあって、何度も おじぎを した', icon: 'heart', mood: 'good', big: 2, set: 'paired' },
    // お母さん
    { at: [B, B + 3 * D], need: ['f', 'paired'], text: 'はじめての たまごを うんで、お父さんに わたした', icon: 'egg', mood: 'good', big: 3, set: 'egg1', add: { eggs: 1 } },
    { at: [B + 3 * D, B + 10 * D], need: ['f', 'egg1'], text: 'えさを とりに、遠い 海まで 何十キロも 歩いた', icon: 'plane', move: 'ocean' },
    { at: [B + 62 * D, B + 72 * D], need: ['f', 'egg1'], text: 'おなかに 魚を たくわえて、群れへ 帰ってきた', icon: 'fish', mood: 'good', move: 'ice' },
    // お父さん
    { at: [B, B + 3 * D], need: ['m', 'paired'], text: 'たまごを 足の上に うけとった', icon: 'egg', mood: 'good', big: 3, set: 'egg1', add: { eggs: 1 } },
    { at: [B + 5 * D, B + 60 * D], need: ['m', 'egg1'], text: 'なにも 食べずに、2か月 たまごを 温めつづけた', icon: 'snow', mood: 'hard', big: 3 },
    { at: [B + 63 * D, B + 72 * D], need: ['m', 'egg1'], text: 'たまごが かえって、ひなが 足の上で 鳴いた', icon: 'baby', mood: 'good', big: 3 },
    { at: [B + 72 * D, B + 80 * D], need: ['m', 'egg1'], text: '体重が 半分 ちかく へって、やっと 海へ 向かった', icon: 'plane', mood: 'hard', move: 'ocean' },
    { at: [B + 100 * D, B + 115 * D], need: ['m', 'egg1'], text: 'たっぷり 食べて、ひなの もとへ 帰ってきた', icon: 'fish', mood: 'good', move: 'ice' },
    // ふたりで
    { at: [B + 80 * D, B + 200 * D], p: 0.4, need: 'egg1', text: 'ひなを なくして、しばらく 鳴きつづけた', icon: 'rain', mood: 'hard', set: 'lost' },
    { at: [B + 210 * D, B + 225 * D], need: ['egg1', '!lost'], text: 'ひなが おとなの 羽に なって、海へ 旅立っていった', icon: 'feather', mood: 'good', big: 2, add: { chicks: 1 }, set: 'raised' },

    // 2回目からの 子育て
    ...LATER.map(([a, b, text]) => ({ at: [a, b], p: 0.6, need: 'paired', text, icon: 'baby', mood: 'good', big: 1, add: { chicks: [1, 2], eggs: [2, 3] } })),

    // おとなの くらし
    { at: [5 * Y, 40 * Y], repeat: [1, 2], text: ['500メートル ちかくまで もぐって、魚を とった', '20分 ちかく 息を とめて、深い 海を 泳いだ', 'オキアミの 群れに とびこんで、おなかいっぱい 食べた'], icon: 'fish', add: { dives: [1000, 4000] } },
    { at: [5 * Y, 40 * Y], p: 0.4, text: '羽が ぜんぶ 生えかわるまで、1か月 じっと たえた', icon: 'feather', mood: 'hard' },
    { at: [6 * Y, 40 * Y], p: 0.35, text: 'シャチの 群れから、氷の上へ とびあがって にげた', icon: 'alert', mood: 'hard' },
    { at: [8 * Y, 40 * Y], p: 0.3, text: '海氷が 早く とけて、ひなを 育てられない 年が あった', icon: 'sun', mood: 'hard' },
    { at: [6 * Y, 30 * Y], p: 0.3, text: 'ことしは、新しい 相手と ペアに なった', icon: 'heart', mood: 'good' },
    { at: [25 * Y, 50 * Y], p: 0.4, text: '若い ペンギンたちの 歌声を、群れの はしで きいた', icon: 'music', mood: 'good' },
  ],

  deaths: [
    { at: [0, 68 * D], w: 3, text: 'ふぶきの中で たまごが こおり、かえらなかった' },
    { at: [0, 68 * D], w: 2, text: '足の上から 氷に ころがり、たまごのまま 眠った' },
    { at: [68 * D, 220 * D], w: 3, text: 'オオフルマカモメに つかまって、いのちを 終えた' },
    { at: [68 * D, 220 * D], w: 3, text: '親の 帰りを 待ちきれず、寒さの中で 眠った' },
    { at: [68 * D, 220 * D], w: 1, text: '海氷が 早く われて、ちいさな いのちを 終えた' },
    { at: [220 * D, 4 * Y], w: 3, text: 'はじめての 冬の海で、えさが とれずに 眠った' },
    { at: [220 * D, 55 * Y], w: 2, text: 'ヒョウアザラシに つかまって、いのちを 終えた' },
    { at: [Y, 55 * Y], w: 2, text: 'シャチに つかまって、いのちを 終えた' },
    { at: [5 * Y, 55 * Y], w: 1, need: ['m', 'egg1'], text: '長い 絶食のあと、海へ 向かう とちゅうで 眠った' },
    { at: [5 * Y, 55 * Y], w: 1.5, text: '海で 病気に かかって、しずかに 眠った' },
    { at: [15 * Y, 55 * Y], w: 5, text: '氷の上の 群れの そばで、しずかに 眠った' },
  ],

  titles: [
    { need: ['m', 'egg1'], text: 'なにも 食べずに たまごを 守りぬいた お父さん' },
    { need: ['f', 'egg1'], text: '何十キロも 歩いて ごはんを 運んだ お母さん' },
    { stat: { chicks: 6 }, text: '{chicks}羽の ひなを 海へ 送りだした 親' },
    { long: 0.02, text: '何十回もの 南極の 冬を こえた 長老' },
    { need: '!paired', minAge: 220, maxAge: 5 * Y, text: '氷の 海へ 旅立った 若い ペンギン' },
    { minAge: 220, maxAge: 2 * Y, text: 'はじめての 冬の 海を 泳いだ 若者' },
    { short: 0.9, text: '氷の上の、ちいさな たまごの いのち' },
  ],

  facts: [
    'お父さんは たまごを 足の上で 2か月あまり 温め、合わせて 4か月ほど 何も 食べません',
    '寒さを しのぐため、何千羽もの お父さんが 体を よせあいます（ハドル）',
    'コウテイペンギンは 564メートルまで もぐった 記録が あります',
    '巣立った ひなが 1年後まで 生きのこるのは、年によって 1割〜5割ほど という調査が あります',
    '世界に おとなが 約60万羽いる と 衛星写真から 見つもられています',
  ],

  sources: [
    'https://en.wikipedia.org/wiki/Emperor_penguin (寿命・おとなの年間生存率95.1%・ひなの1年生存19%・564m・絶食・天敵)',
    'https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/breeding-cycle/ (オーストラリア南極局: 子育ての時期・ふ化まで65〜75日)',
    'https://nora.nerc.ac.uk/id/eprint/17923 (Fretwell ほか 2012: 衛星写真による全数 約59万5千羽)',
    'https://hal.archives-ouvertes.fr/hal-03502431 (Abadi ほか 2017: 巣立ち後1年の生存率 0.08〜0.48)',
    'https://www.popsci.com/emperor-penguins-fast-snack/ (お父さんの絶食 約115日)',
    'https://web.stanford.edu/group/stanfordbirds/text/essays/Bird_Milk.html (お父さんの のどから出るミルク)',
  ],
};
