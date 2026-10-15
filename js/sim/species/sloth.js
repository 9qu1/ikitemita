// ナマケモノ（ノドチャミユビナマケモノ Bradypus variegatus）
//   週に1回ほど木から下りてトイレ・毛に緑の藻（も）とガのなかま・1日に動くのは平均40mほど
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

// 生き残りの曲線: コスタリカの調査（Garcés-Restrepo ほか 2019）
//   0〜1歳の生存 0.68・1〜2歳 1.0・2〜3歳 0.72・おとな（3歳〜）は 年に 0.984 と とても高い
//   野生で何年生きるかは まだわかっていない（Sloth Conservation Foundation）。20歳をすぎてからの老いは目安で入れた
const SURVIVAL = [[0, 1], [M, 0.96], [6 * M, 0.82], [Y, 0.68], [2 * Y, 0.66], [3 * Y, 0.49], [10 * Y, 0.43], [20 * Y, 0.35], [25 * Y, 0.29], [30 * Y, 0.2], [35 * Y, 0.1], [40 * Y, 0.035], [45 * Y, 0.007], [50 * Y, 0]];

export default {
  id: 'sloth',
  name: 'ナマケモノ',
  kind: 'animal',
  weight: 1,
  // 世界の数は調べられていない（IUCN は「数は へっている」とだけ）。1ヘクタールに 0.6〜8.5頭という密度と、
  // 中南米の広い分布からの、ごく大まかな目安
  realCount: 1e7,
  refDays: 32 * Y,
  habitat: 'jungle',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 高い 木の上で うまれた', '{place}の 木の上で、母さんに しがみついて うまれた'],

  variants: [
    {
      id: 'wild', label: 'ナマケモノ', w: 1, habitat: 'jungle', tags: [],
      places: [
        { text: 'コスタリカの 熱帯雨林', lat: 10.43, lon: -84.0 },
        { text: 'コスタリカの カカオ畑', lat: 9.75, lon: -82.85 },
        { text: 'パナマの 森', lat: 9.15, lon: -79.85 },
        { text: 'コロンビアの アマゾン', lat: -4.2, lon: -69.94 },
        { text: 'ペルーの アマゾン', lat: -3.75, lon: -73.25 },
        { text: 'ブラジルの 海ぞいの 森', lat: -14.8, lon: -39.05 },
      ],
      survival: SURVIVAL,
    },
  ],

  stages: [
    { id: 'baby', name: '赤ちゃん', from: 0, sprite: 'sloth', scale: 0.4 },
    { id: 'young', name: '子どものナマケモノ', from: 6 * M, sprite: 'sloth', scale: 0.7 },
    { id: 'adult', name: 'おとなのナマケモノ', from: 3 * Y, sprite: 'sloth', scale: 1, say: 'おとなの ナマケモノに なった', icon: 'star' },
  ],

  stats: [
    { id: 'toilet', label: 'トイレで 木を おりた', unit: '回' },
    { id: 'babies', label: '子ども', unit: '頭' },
  ],

  events: [
    // 赤ちゃん（母さんの おなかの上）
    { at: [0, D], text: 'うまれて すぐ、母さんの おなかの 毛に しがみついた', icon: 'heart', mood: 'good', big: 1 },
    { at: [2 * W, 6 * W], p: 0.8, text: '母さんの 口もとの 葉っぱを、ぺろりと なめてみた', icon: 'sprout', mood: 'good' },
    { at: [M, 3 * M], p: 0.7, text: '母さんの おなかの 上で、雨の 音を 聞きながら ねむった', icon: 'rain', mood: 'good' },
    { at: [M, 4 * M], p: 0.6, text: '母さんと いっしょに、週に 1回の トイレに 下りた', icon: 'box' },
    { at: [M, 6 * M], p: 0.2, text: '母さんから すべり落ちかけて、母さんの うでで すくわれた', icon: 'alert', mood: 'hard' },
    { at: [2 * M, 5 * M], p: 0.6, text: 'はじめて 母さんから 手を はなし、ひとりで 枝に ぶらさがった', icon: 'star', big: 2 },

    // ひとり立ち
    { at: [5 * M, 10 * M], p: 0.9, text: '母さんが なわばりを ゆずって、べつの 場所へ うつっていった', icon: 'feather', big: 3, set: 'independent' },
    { at: [6 * M, 3 * Y], p: 0.6, need: 'independent', text: '母さんに 教わった 木の 葉だけを、えらんで 食べた', icon: 'sprout' },

    // ふだんの くらし
    { at: [6 * M, 45 * Y], repeat: [3, 6], text: ['週に 1回の トイレの ために、ゆっくり 木を おりた', '木の 根もとに くぼみを つくって、トイレを すませた', 'トイレを すませて、また 何時間も かけて 木に のぼった'], icon: 'box', add: { toilet: [40, 150] } },
    { at: [6 * M, 45 * Y], repeat: [2, 3], text: ['朝日の あたる 枝で、ひなたぼっこを して 体を あたためた', '1日で 動いたのは、木から 木へ 40mほど だった', 'ゆっくり ゆっくり、となりの 木へ うつった', '雨の 中、じっと 枝に ぶらさがって すごした'], icon: 'sun', mood: 'good' },
    { at: [Y, 40 * Y], p: 0.7, text: '毛に こけのような 緑の ものが 生えて、からだが 緑っぽく なった', icon: 'sprout', big: 2 },
    { at: [Y, 40 * Y], p: 0.45, text: '毛の 中に、小さな ガの なかまが すみついた', icon: 'friends' },
    { at: [6 * M, 40 * Y], p: 0.35, text: '空から オウギワシの かげが せまり、葉かげで じっとした', icon: 'alert', mood: 'hard', big: 1 },
    { at: [6 * M, 40 * Y], p: 0.3, text: '川に 落ちたけれど、すいすい 泳いで 岸に ついた', icon: 'drop', mood: 'good', big: 1 },
    { at: [6 * M, 40 * Y], p: 0.25, text: 'トイレに 下りた とき、地面で ジャガーの においを かいだ', icon: 'alert', mood: 'hard' },
    { at: [6 * M, 40 * Y], p: 0.3, text: '首を くるりと 回して、うしろの 葉っぱを 食べた', icon: 'sprout' },
    { at: [6 * M, 40 * Y], p: 0.3, text: 'セクロピアの 木の 若葉を、ゆっくり かみしめた', icon: 'sprout', mood: 'good' },
    { at: [6 * M, 40 * Y], p: 0.25, text: 'ホエザルの 群れが、すぐ 横の 枝を 通りすぎていった', icon: 'friends' },
    { at: [6 * M, 40 * Y], p: 0.2, text: '大雨の 夜、ぬれた 毛が 重くて ほとんど 動かなかった', icon: 'rain' },
    { at: [Y, 40 * Y], p: 0.2, text: '道路を ゆっくり わたっていて、人に 木まで 運んでもらった', icon: 'house', mood: 'good', big: 1 },
    { at: [Y, 40 * Y], p: 0.1, text: '電線から 落ち、手当てを うけて 森へ もどった', icon: 'bandage', mood: 'hard', big: 2, set: 'rescued' },

    // オス
    { at: [2 * Y, 4 * Y], p: 0.85, need: 'm', text: '背中に、オレンジ色の もようが あらわれた', icon: 'star', big: 2 },
    { at: [3 * Y, 40 * Y], p: 0.5, need: 'm', text: 'メスの 高い 鳴き声を 聞いて、ゆっくり 会いに 行った', icon: 'heart', mood: 'good', big: 1 },
    { at: [3 * Y, 40 * Y], p: 0.3, need: 'm', text: 'ほかの オスと 枝の 上で、ゆっくり おしあった', icon: 'alert' },
    { at: [4 * Y, 30 * Y], repeat: [1, 6], need: 'm', text: ['森の どこかで、自分の 子どもが うまれた', 'となりの 木で、自分の 子どもが うまれた'], icon: 'baby', mood: 'good', big: 2, add: { babies: 1 }, set: 'father' },

    // メス
    { at: [3 * Y, 5 * Y], p: 0.85, need: 'f', text: '高い 声で 鳴いて、オスを よんだ', icon: 'music', big: 1, set: 'calling' },
    { at: [3 * Y, 6 * Y], p: 0.97, need: ['f', 'calling'], text: 'はじめての 赤ちゃんを うんだ', icon: 'baby', mood: 'good', big: 3, add: { babies: 1 }, set: 'mother' },
    { at: [5 * Y, 25 * Y], repeat: [2, 8], need: 'mother', text: ['また 1頭の 赤ちゃんを うんだ', '木の 上で、赤ちゃんを うんだ', '雨の 季節に、赤ちゃんを うんだ'], icon: 'baby', mood: 'good', big: 2, add: { babies: 1 } },
    { at: [3 * Y, 40 * Y], p: 0.6, need: 'mother', text: '赤ちゃんを おなかに のせたまま、ゆっくり 葉を 食べた', icon: 'heart', mood: 'good' },
    { at: [4 * Y, 40 * Y], p: 0.5, need: 'mother', text: '大きく なった 子に、なわばりを ゆずって 引っこした', icon: 'feather', big: 2 },

    // 長生き
    { at: [20 * Y, 50 * Y], p: 0.6, text: '同じ 森で、何十年も ゆっくり くらしつづけた', icon: 'crown', big: 2 },
  ],

  deaths: [
    { at: [0, 6 * M], w: 3, text: ['母さんの おなかから 落ちてしまい、いのちを 終えた', 'ちいさい 体が 冷えて、いのちを 終えた'] },
    { at: [0, 3 * Y], w: 2, text: 'オウギワシに つかまって、いのちを 終えた' },
    { at: [6 * M, 3 * Y], w: 1, text: 'ひとり立ちの あと、食べられる 木が 見つからず いのちを 終えた' },
    { at: [6 * M, 50 * Y], w: 2, text: 'トイレに 下りた とき、ジャガーに 見つかって いのちを 終えた' },
    { at: [Y, 50 * Y], w: 1, text: '道路を わたる とちゅうで、車に ぶつかって いのちを 終えた' },
    { at: [Y, 50 * Y], w: 1, text: 'すみかの 森が 切られて、いのちを 終えた' },
    { at: [Y, 50 * Y], w: 1, text: '地面を 歩いていて、イヌに 見つかって いのちを 終えた' },
    { at: [3 * Y, 50 * Y], w: 1, text: '病気に かかって、いのちを 終えた' },
    { at: [20 * Y, 60 * Y], w: 5, text: 'お気に入りの 木に ぶらさがったまま、しずかに 眠った' },
  ],

  titles: [
    { need: 'mother', stat: { babies: 8 }, text: '{babies}頭の 子を 森に おくりだした 母さん' },
    { need: 'rescued', text: '人に 助けられて 森へ もどった ナマケモノ' },
    { stat: { toilet: 500 }, text: 'トイレに {toilet}回 木を おりた ナマケモノ' },
    { long: 0.1, text: '森で いちばん ゆっくり 長生きした ナマケモノ' },
    { need: '!rescued', short: 0.15, long: 0.8, text: '森の 木の上で くらした 1頭の ナマケモノ' },
    { short: 0.8, text: '母さんの おなかの上で 森を 見た 赤ちゃん' },
  ],

  facts: [
    'ナマケモノは、およそ 週に1回 木から 下りて、地面で うんちを します',
    'ノドチャミユビナマケモノが 1日に 動く きょりは、平均 40mほど です',
    'ナマケモノの 毛には、こけのように 見える 緑の 藻（も）や、ガの なかまが すんでいます',
    '野生の ナマケモノが 何年 生きるかは、まだ よく わかっていません（研究が つづいています）',
    'コスタリカの 調査では、おとなの ナマケモノは 1年に 約98%が 生きのこる と わかりました',
    'ミユビナマケモノの 首の 骨は 8〜9こで、多くの ほにゅう類（7こ）より 多いです',
  ],

  sources: [
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC6367172 (Garcés-Restrepo ほか 2019 コスタリカのミユビナマケモノ: おとなの年生存0.984・0〜1歳0.678・2〜3歳0.723・初めての繁殖3歳)',
    'https://xenarthrans.org/species/sloths/brown-throated-three-toed-sloth/ (IUCN 専門家グループ: 週1回地面でトイレ・1日平均40m・妊娠約6か月・100日以上おなかにしがみつく・密度0.6〜8.5頭/ha)',
    'https://www.slothconservation.org/ (Sloth Conservation Foundation: 野生の寿命はわかっていない)',
    'https://en.wikipedia.org/wiki/Three-toed_sloth (離乳のころ 母は行動圏を子にゆずって別の場所へ移る)',
    'https://kimuk.conare.ac.cr/Record/RIDE_036c8b1add582a3f14e372ce566c0cf7?lng=fi (コスタリカ: 5〜7か月ごろ 母は子を残して新しい場所へ広がる)',
    'https://animaldiversity.org/accounts/Bradypus_variegatus/ (ADW: オスだけ背中に模様・メスは鳴いてオスをよぶ)',
    'https://www.smithsonianmag.com/science-nature/what-drives-a-sloths-ritualistic-trek-to-poop-180949419/ (地面でのトイレと毛のガ・藻の関係)',
  ],
};
