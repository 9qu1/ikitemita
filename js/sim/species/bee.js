// ミツバチ（セイヨウミツバチ Apis mellifera）: 夏うまれの働きバチ・冬をこす働きバチ・オスバチ・女王バチ
//   すがたの切りかわる時期と名前が variant ごとにちがうので、variant に stages を持たせて plan で life.stages を差しかえる
//   （engine はいま種ごとの stages しか持たないため）。オスバチの「結婚して すぐ死ぬ」も plan で死ぬ直前に置く
import { H, D, W, M, Y } from '../units.js?v=1.0.3';

// 働きバチ 21日・女王 16日・オス 24日で おとなに（たまご 3日 → 幼虫 → ふたをされて さなぎ）
const WORKER_STAGES = [
  { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25 },
  { id: 'larva', name: '幼虫', from: 3 * D, sprite: 'grub', scale: 0.3, say: 'たまごから 小さな 幼虫が かえった', icon: 'egg', big: 1 },
  { id: 'pupa', name: 'さなぎ', from: 9 * D, sprite: 'pupa', scale: 0.45, say: '部屋に ろうの ふたを され、さなぎに なった', icon: 'sleep', big: 1 },
  { id: 'adult', name: '働きバチ', from: 21 * D, sprite: 'bee', scale: 0.85, say: 'ふたを かじって、働きバチとして 出てきた', icon: 'star', big: 3 },
];
const QUEEN_STAGES = [
  { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25 },
  { id: 'larva', name: '幼虫', from: 3 * D, sprite: 'grub', scale: 0.35, say: '大きな 女王の 部屋で、幼虫が かえった', icon: 'egg', big: 1 },
  { id: 'pupa', name: 'さなぎ', from: 8 * D, sprite: 'pupa', scale: 0.55, say: '女王の 部屋に ふたを され、さなぎに なった', icon: 'sleep', big: 1 },
  { id: 'adult', name: '女王バチ', from: 16 * D, sprite: 'bee', scale: 1.05, say: '部屋の ふたを 切りひらき、女王バチが 出てきた', icon: 'crown', big: 3 },
];
const DRONE_STAGES = [
  { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25 },
  { id: 'larva', name: '幼虫', from: 3 * D, sprite: 'grub', scale: 0.35, say: 'たまごから オスの 幼虫が かえった', icon: 'egg', big: 1 },
  { id: 'pupa', name: 'さなぎ', from: 10 * D, sprite: 'pupa', scale: 0.5, say: 'もりあがった ふたの 下で、さなぎに なった', icon: 'sleep', big: 1 },
  { id: 'adult', name: 'オスバチ', from: 24 * D, sprite: 'bee', scale: 0.95, say: '大きな 目の オスバチとして 出てきた', icon: 'star', big: 3 },
];

const PLACES = [
  { text: '長野の りんご畑の 巣箱', lat: 36.65, lon: 138.19 },
  { text: 'フランスの ラベンダー畑の 巣箱', lat: 43.84, lon: 5.98 },
  { text: 'アメリカの アーモンド畑の 巣箱', lat: 36.74, lon: -119.79 },
  { text: 'ニュージーランドの マヌカの 丘の 巣箱', lat: -38.14, lon: 176.25 },
  { text: 'エチオピアの 村の 木の 巣箱', lat: 9.03, lon: 38.74 },
  { text: 'ドイツの 町の 屋上の 巣箱', lat: 52.52, lon: 13.4 },
];
// 冬に 玉に なって 冬ごしするのは 冬の寒い所（エチオピアは 入れない）
const PLACES_COLD = PLACES.filter((p) => p.lat > 30 || p.lat < -30);

// 花の蜜集め（夏うまれは羽化から約3週間、冬をこすハチは春になってから）
const foragerEvents = (s) => [
  { at: [s, s + 4 * D], text: 'いよいよ、花の 蜜集めの 係に なった', icon: 'flower', mood: 'good', big: 2, set: 'forager' },
  { at: [s + D, s + 3 * M], need: 'forager', repeat: [2, 5], text: ['花から 花へ、蜜を 集めて まわった', '後ろ足に 花粉だんごを つけて 帰った', 'おなか いっぱいの 蜜を、巣へ 運んだ'], icon: 'flower', mood: 'good', add: { flowers: [200, 1200] } },
  { at: [s + D, s + 3 * M], need: 'forager', p: 0.6, repeat: [1, 4], text: ['8の字ダンスで、花の ありかを 教えた', 'おしりを ふる ダンスで、遠くの 花を 知らせた'], icon: 'music', mood: 'good', big: 2, add: { dances: 1 }, set: 'dancer' },
  { at: [s + D, s + 3 * M], need: 'forager', p: 0.5, text: '仲間の ダンスを 読んで、遠くの 花へ 飛んだ', icon: 'plane' },
  { at: [s + D, s + 3 * M], need: 'forager', p: 0.35, text: 'にわか雨に あい、葉の 下で 雨やどりした', icon: 'rain', mood: 'hard' },
  { at: [s + D, s + 3 * M], need: 'forager', p: 0.25, text: 'スズメバチに 追われ、巣に にげこんだ', icon: 'alert', mood: 'hard', big: 1 },
  { at: [s + D, s + 3 * M], need: 'forager', p: 0.3, text: '水場で 水を くんで、巣を ひやした', icon: 'drop' },
  { at: [s + 3 * D, s + 3 * M], need: 'forager', p: 0.25, text: '巣から 3キロも はなれた 花まで 飛んだ', icon: 'plane', big: 1 },
  { at: [s + 7 * D, s + 3 * M], need: 'forager', p: 0.45, text: '飛びつづけて、羽の ふちが すりきれた', icon: 'feather', mood: 'hard' },
];

export default {
  id: 'bee',
  name: 'ミツバチ',
  kind: 'bug',
  weight: 1,
  // 世界の巣箱 約1億0200万箱（FAOSTAT 2022）× 1群 2〜3万匹 ≒ 約2.5兆匹（野生の群れは数えていない）
  realCount: 2.5e12,
  refDays: 75 * D,
  habitat: 'garden',
  birth: ['{place}の 六角形の 部屋で うまれた', '{place}の 中で、小さな たまごとして うまれた'],

  variants: [
    {
      id: 'summer', label: '夏うまれの 働きバチ', w: 0.72, places: PLACES, stages: WORKER_STAGES, tags: ['worker'],
      // ふつうの群れでは 働きバチの子の 約85% が おとなに なる（Brodschneider ほか・HAL の論文の要約）。
      // 夏の働きバチは 羽化から 15〜38日ほど（たまごから数えて 5〜8週）。巣の中の時期は死ぬことが少なく、外回りになってから一気に減る
      survival: [[0, 1], [3 * D, 0.94], [9 * D, 0.87], [21 * D, 0.85], [28 * D, 0.84], [35 * D, 0.82], [42 * D, 0.78], [49 * D, 0.5], [56 * D, 0.26], [63 * D, 0.11], [72 * D, 0.03], [85 * D, 0.005], [100 * D, 0]],
      events: foragerEvents(40 * D),
    },
    {
      id: 'winter', label: '冬を こす 働きバチ', w: 0.15, places: PLACES_COLD, stages: WORKER_STAGES, tags: ['worker'], refDays: 8 * M,
      // 秋に うまれる「冬のハチ」は 4〜6か月（150〜200日ほど）生きる
      survival: [[0, 1], [3 * D, 0.94], [9 * D, 0.87], [21 * D, 0.85], [2 * M, 0.8], [3 * M, 0.74], [4 * M, 0.66], [5 * M, 0.58], [6 * M, 0.42], [7 * M, 0.22], [8 * M, 0.07], [9 * M, 0.012], [10 * M, 0]],
      events: foragerEvents(155 * D),
    },
    {
      // オスバチ: 夏の群れの 1割ほど。子の 約56% が おとなに なる
      id: 'drone', label: 'オスバチ', w: 0.1, places: PLACES, stages: DRONE_STAGES, refDays: 90 * D,
      survival: [[0, 1], [3 * D, 0.9], [10 * D, 0.7], [24 * D, 0.56], [35 * D, 0.5], [45 * D, 0.38], [55 * D, 0.22], [65 * D, 0.1], [80 * D, 0.025], [100 * D, 0.004], [120 * D, 0]],
    },
    {
      // 女王バチ: 本当は 1つの群れで 年に数匹〜十数匹しか育たない（働きバチ数万匹に対して 0.1% もない）。
      //   ここでは 3% と、ずっと出やすくしてある。子の 約53% が おとなに なり、その後 ライバルとの争いと結婚飛行がある。寿命は 2〜5年（最長7〜8年）
      id: 'queen', label: '女王バチ', w: 0.03, places: PLACES_COLD, stages: QUEEN_STAGES, refDays: 5 * Y,
      survival: [[0, 1], [3 * D, 0.85], [8 * D, 0.65], [16 * D, 0.5], [20 * D, 0.32], [30 * D, 0.26], [2 * M, 0.24], [Y, 0.19], [2 * Y, 0.13], [3 * Y, 0.08], [4 * Y, 0.045], [5 * Y, 0.02], [6 * Y, 0.007], [8 * Y, 0]],
    },
  ],

  stages: WORKER_STAGES,
  plan(rng, life, base) {
    if (base.variant.stages) life.stages = base.variant.stages.map((s) => ({ ...s }));
    // オスバチは 女王と 結婚すると その場で 死ぬ。結婚できる オスは ほんの 一部（ここでは 1割。本当は もっと 少ない）
    if (base.variant.id === 'drone' && life.span > 31 * D && rng.chance(0.1)) {
      return [{ age: life.span - 0.02, need: ['dca', '!evicted'], text: '女王バチと 出会い、空の上で 結婚した', icon: 'heart', mood: 'good', big: 3, set: 'mated' }];
    }
    return [];
  },

  stats: [
    { id: 'flowers', label: 'たずねた 花', unit: 'こ' },
    { id: 'dances', label: '8の字ダンス', unit: '回' },
    { id: 'eggs', label: '産んだ たまご', unit: 'こ' },
  ],

  events: [
    // 巣の 部屋の中の子ども
    { at: [D, 3 * D], p: 0.5, text: '六角形の 部屋の 底に、ちょこんと 立っていた', icon: 'house' },
    { at: [3 * D, 6 * D], need: '!v-queen', text: '育児係の お姉さんに、ゼリーを もらった', icon: 'apple', mood: 'good' },
    { at: [4 * D, 8 * D], p: 0.7, text: 'お姉さんたちが、何千回も のぞきに 来た', icon: 'look', big: 1 },
    { at: [3 * D, 7 * D], need: 'v-queen', text: '部屋いっぱいの ローヤルゼリーで 育った', icon: 'crown', mood: 'good', big: 2 },
    { at: [10 * D, 20 * D], need: '!v-queen', p: 0.6, text: 'ろうの ふたの 下で、大人の 体を つくった', icon: 'sleep' },

    // 働きバチ: 年齢で しごとが 変わる（掃除 → 子育て → 巣作り → 門番 → 蜜集め）
    { at: [21 * D, 23 * D], need: 'worker', text: '最初の しごとは、部屋の 掃除だった', icon: 'box', big: 1 },
    { at: [23 * D, 32 * D], need: 'worker', text: '育児係に なり、幼虫に ゼリーを あげた', icon: 'baby', mood: 'good', big: 2, set: 'nurse' },
    { at: [24 * D, 33 * D], need: 'nurse', p: 0.45, text: '女王さまの まわりで、お世話係を した', icon: 'crown', mood: 'good' },
    { at: [31 * D, 37 * D], need: 'worker', text: 'おなかから ろうを 出して、巣を つくった', icon: 'box', big: 1 },
    { at: [32 * D, 39 * D], need: 'worker', p: 0.5, text: '羽で 風を おくって、蜜を こく した', icon: 'drop' },
    { at: [33 * D, 40 * D], need: 'worker', p: 0.6, text: '巣の 前を くるくる 飛んで、場所を おぼえた', icon: 'sun' },
    { at: [37 * D, 42 * D], need: 'worker', p: 0.7, text: '巣の 入り口で、門番を つとめた', icon: 'look', set: 'guard' },
    { at: [38 * D, 43 * D], need: 'guard', p: 0.3, text: 'よその 巣の ハチを、においで 見やぶった', icon: 'alert' },

    // 冬を こす 働きバチ
    { at: [30 * D, 50 * D], need: 'v-winter', text: '花の 少ない 秋、体に 栄養を ためこんだ', icon: 'apple' },
    { at: [45 * D, 60 * D], need: 'v-winter', p: 0.5, text: 'オスバチたちが、巣から 追い出されるのを 見た', icon: 'feather' },
    { at: [55 * D, 80 * D], need: 'v-winter', text: '寒い 巣で、仲間と 体を よせあって 玉に なった', icon: 'snow', big: 2, set: 'cluster' },
    { at: [60 * D, 140 * D], need: 'cluster', repeat: [1, 3], text: ['羽の 筋肉を ふるわせて、巣を あたためた', '玉の 外側と 内側を、仲間と 交代した', '冬の 晴れ間に、外へ 出て ひと飛びした'], icon: 'snow' },
    { at: [150 * D, 158 * D], need: 'cluster', text: '春の 花が さき、巣が また にぎやかに なった', icon: 'flower', mood: 'good', big: 2 },
    { at: [150 * D, 230 * D], need: 'v-winter', p: 0.6, text: '春うまれの 妹たちに、しごとを ゆずった', icon: 'feather', big: 1 },

    // オスバチ
    { at: [24 * D, 32 * D], need: 'v-drone', text: '針も なく、働かずに 蜜を もらって くらした', icon: 'apple' },
    { at: [30 * D, 40 * D], need: 'v-drone', text: '晴れた 午後、オスの 集まる 空へ 飛んでいった', icon: 'plane', mood: 'good', big: 2, set: 'dca' },
    { at: [32 * D, 90 * D], need: 'dca', repeat: [1, 3], text: ['女王を さがして、空を 何度も 飛んだ', '夕方、くたくたに なって 巣に もどった'], icon: 'sun' },
    { at: [45 * D, 100 * D], need: 'v-drone', p: 0.3, text: '秋に なり、妹たちに 巣から 追い出された', icon: 'alert', mood: 'hard', big: 2, set: 'evicted' },

    // 女王バチ
    { at: [16 * D, 18 * D], need: 'v-queen', p: 0.5, text: 'ピーピーと 鳴いて、ほかの 女王に 合図した', icon: 'music', big: 1 },
    { at: [16 * D, 19 * D], need: 'v-queen', text: '生まれてすぐ、ライバルの 女王たちと 争った', icon: 'alert', mood: 'hard', big: 2 },
    { at: [20 * D, 26 * D], need: 'v-queen', text: '晴れた 日、結婚飛行に 飛びたった', icon: 'plane', mood: 'good', big: 3, set: 'flight' },
    { at: [21 * D, 28 * D], need: 'flight', text: '空の上で、10匹 以上の オスと 結婚した', icon: 'heart', mood: 'good', big: 2 },
    { at: [24 * D, 32 * D], need: 'flight', text: '巣に もどり、たまごを 産みはじめた', icon: 'egg', mood: 'good', big: 3, set: 'laying', add: { eggs: [500, 1500] } },
    { at: [M, 6 * Y], need: 'laying', repeat: [3, 9], text: ['一日に 1000こを こえる たまごを 産んだ', '花の 季節、巣の 家族が 5万匹に ふえた', 'ひと部屋ずつ のぞいて、たまごを 産んだ'], icon: 'egg', mood: 'good', add: { eggs: [10000, 40000] } },
    { at: [2 * M, 3 * Y], need: 'laying', p: 0.45, text: '巣が 手ぜまに なり、仲間と 新しい 家へ 旅立った', icon: 'box', big: 3, set: 'swarm' },
    { at: [4 * M, 6 * Y], need: 'laying', p: 0.8, text: '冬の 巣の まん中で、娘たちに あたためられた', icon: 'snow', mood: 'good' },
    { at: [Y, 6 * Y], need: 'laying', p: 0.5, text: '娘たちが、次の 女王を 育てはじめた', icon: 'crown', big: 1 },
  ],

  deaths: [
    { at: [0, 21 * D], w: 3, need: '!v-queen', text: ['育つ とちゅうで 弱り、そっと 片づけられた', 'たまごの まま、かえらずに 終わった'] },
    { at: [0, 17 * D], w: 3, need: 'v-queen', text: ['先に 生まれた 女王に、部屋ごと こわされた', '育つ とちゅうで、女王の 部屋が こわされた'] },
    { at: [16 * D, 22 * D], w: 4, need: 'v-queen', text: 'ライバルの 女王との 争いに やぶれた' },
    { need: ['flight', '!laying'], w: 4, text: '結婚飛行の とちゅう、鳥に つかまった' },
    { need: 'laying', w: 5, text: ['娘たちに 見守られて、しずかに 眠った', '新しい 女王に あとを たくして 眠った'] },
    { need: ['worker', '!forager'], at: [21 * D, 10 * M], w: 1, text: ['病気に なり、巣を はなれて しずかに 眠った', 'ダニに 弱らされて、しずかに 眠った'] },
    { need: ['cluster', '!forager'], w: 3, text: '冬の 玉の はしで、寒さに たえきれず 眠った' },
    { need: 'forager', w: 5, text: ['花から 帰る とちゅう、力つきて 眠った', 'クモの 巣に かかって、いのちを 終えた', 'スズメバチに つかまって、いのちを 終えた', '冷たい 雨に うたれ、巣に もどれなかった'] },
    { need: 'forager', at: [45 * D, 10 * M], w: 3, text: 'すりきれた 羽で、さいごの 蜜を 運んで 眠った' },
    { need: 'mated', w: 30, text: '結婚と ひきかえに、空で いのちを 終えた' },
    { need: ['evicted', '!mated'], w: 10, text: '巣に 入れてもらえず、秋の 夜に 眠った' },
    { need: ['dca', '!mated', '!evicted'], w: 3, text: ['オスの 集まる 空から、もどらなかった', '花の かげで、しずかに 眠った'] },
  ],

  titles: [
    { need: 'laying', stat: { eggs: 100000 }, text: '{eggs}この たまごを 産んだ 女王バチ' },
    { need: 'swarm', text: '仲間を つれて 旅立った 女王バチ' },
    { need: ['flight', '!laying'], text: '結婚飛行の 空に 消えた 女王バチ' },
    { need: 'mated', text: 'たった一度の 恋に すべてを かけた オスバチ' },
    { need: 'dancer', stat: { dances: 3 }, text: '8の字ダンスの 名人' },
    { need: 'forager', stat: { flowers: 3000 }, text: '{flowers}の 花を たずねた 働きバチ' },
    { need: ['cluster', 'forager'], text: '冬を こえて 春を つないだ 働きバチ' },
    { short: 0.9, text: '六角形の 部屋だけを 知った いのち' },
  ],

  facts: [
    '働きバチの 寿命は、夏は 1か月ほど。冬を こす ハチは 数か月 生きます',
    '働きバチは 年齢で しごとが 変わります（掃除 → 子育て → 巣作り → 門番 → 蜜集め）',
    '8の字ダンスが 花の 方向と きょりを 伝えることを 見つけた フリッシュは、1973年に ノーベル賞を うけました',
    '1匹の 働きバチが 一生で つくる はちみつは、小さじ 12分の1ほど と 言われています',
    '女王バチは ローヤルゼリーで 育ち、数年 生きて、一日に 1000こ 以上の たまごを 産むことも あります',
  ],

  sources: [
    'https://hal.archives-ouvertes.fr/hal-02265707 (ふつうの群れで 働きバチの子の約85%がおとなに・オス約56%・女王約53%。検索結果の要約で確認)',
    'https://projects.sare.org/media/pdf/T/h/e/The-life-cycle-of-honey-bees.pdf (働きバチ21日・オス24日で羽化)',
    'https://blythewoodbeecompany.com/blogs/news/honey-bee-lifespan (春夏の働きバチ5〜7週・秋うまれ4〜6か月・女王3〜5年 最長7年・オス数週〜4か月)',
    'https://gendai.media/articles/-/94395 (日齢で仕事が変わる: 羽化〜3日 掃除・4〜15日 子育て・15〜20日 巣作りと門番・約20日から外で蜜集め／寿命 約1か月・冬は半年ほど)',
    'https://www.nobelprize.org/prizes/medicine/1973/frisch/facts/ (フリッシュ 1973年 ノーベル生理学・医学賞)',
    'https://iowa.agclassroom.org/matrix/resource/220 (National Honey Board: 働きバチ1匹が一生でつくる蜜は小さじ1/12)',
    'https://managementjournal.usamv.ro/pdf/vol.24_3/Art73.pdf (FAOSTAT: 2022年の世界の巣箱 約1億0200万)',
  ],
};
