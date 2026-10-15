// クロオオアリ（Camponotus japonicus）: 働きアリ・新しい女王アリ・オスアリ
//   すがたの切りかわる時期と名前が variant ごとにちがうので、variant に stages を持たせて plan で life.stages を差しかえる
//   （engine はいま種ごとの stages しか持たないため。variant.stages を engine が読むようになれば plan はいらない）
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

// 働きアリ: たまごから おとなまで 6〜10週間（formicamarket）。さなぎは まゆを つくる
const WORKER_STAGES = [
  { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3 },
  { id: 'larva', name: '幼虫', from: 18 * D, sprite: 'grub', scale: 0.35, say: 'たまごから 小さな 幼虫が かえった', icon: 'egg', big: 1 },
  { id: 'pupa', name: 'さなぎ', from: 38 * D, sprite: 'pupa', scale: 0.45, say: '糸を はいて まゆを つくり、さなぎに なった', icon: 'sleep', big: 1 },
  { id: 'worker', name: '働きアリ', from: 58 * D, sprite: 'ant', scale: 0.8, say: 'まゆを 仲間に やぶってもらい、働きアリに なった', icon: 'star', big: 3 },
];
// 羽アリ（新しい女王・オス）は夏から秋に育ち、羽のあるまま巣で冬をこして 5〜6月に結婚飛行へ
const QUEEN_STAGES = [
  { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3 },
  { id: 'larva', name: '幼虫', from: 18 * D, sprite: 'grub', scale: 0.4, say: 'たまごから 小さな 幼虫が かえった', icon: 'egg', big: 1 },
  { id: 'pupa', name: 'さなぎ', from: 45 * D, sprite: 'pupa', scale: 0.55, say: 'ひときわ 大きな まゆの 中で、さなぎに なった', icon: 'sleep', big: 1 },
  { id: 'alate', name: '羽のある 女王アリ', from: 70 * D, sprite: 'ant', scale: 1.05, say: '羽のある 新しい 女王アリに なった', icon: 'crown', big: 3 },
  { id: 'queen', name: '女王アリ', from: 10.5 * M, sprite: 'ant', scale: 1.1 },
];
const MALE_STAGES = [
  { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3 },
  { id: 'larva', name: '幼虫', from: 18 * D, sprite: 'grub', scale: 0.35, say: 'たまごから 小さな 幼虫が かえった', icon: 'egg', big: 1 },
  { id: 'pupa', name: 'さなぎ', from: 42 * D, sprite: 'pupa', scale: 0.45, say: 'まゆの 中で、さなぎに なった', icon: 'sleep', big: 1 },
  { id: 'alate', name: 'オスアリ', from: 65 * D, sprite: 'ant', scale: 0.75, say: '羽のある オスアリに なった', icon: 'star', big: 2 },
];

const PLACES = [
  { text: '東京の 公園の 地面の下', lat: 35.67, lon: 139.7 },
  { text: '京都の お寺の 庭の 土の中', lat: 35.03, lon: 135.72 },
  { text: '札幌の 草地の 土の中', lat: 43.06, lon: 141.35 },
  { text: '福岡の 畑の あぜ道の 下', lat: 33.59, lon: 130.4 },
  { text: '韓国 ソウルの 川ぞいの 土手', lat: 37.53, lon: 126.98 },
  { text: '中国 北京の 校庭の すみ', lat: 39.9, lon: 116.4 },
];

export default {
  id: 'ant',
  name: 'クロオオアリ',
  kind: 'bug',
  weight: 1,
  // アリ全体で 少なくとも 約2京匹（Schultheiss ほか 2022 PNAS。土の中のアリは数えていないので本当はもっと多い）
  realCount: 2e16,
  refDays: 2.5 * Y,
  habitat: 'underground',
  birth: ['{place}の 巣で、小さな たまごとして うまれた', '{place}の 巣の へやで うまれた'],

  variants: [
    {
      id: 'worker', label: '働きアリ', w: 0.89, habitat: 'underground', places: PLACES, stages: WORKER_STAGES,
      // 巣の子は世話されるが、えさが足りないと たまごや幼虫が仲間の栄養に回されることもある。
      //   たまご〜まゆで 約4割が育たない、は推計（この種の数字は見つからなかった）。
      // おとなの働きアリは 1〜3年（飼育・ナゾロジー/るるぶKids）。外回りになると死ぬ危険が上がる
      survival: [[0, 1], [18 * D, 0.8], [38 * D, 0.7], [58 * D, 0.64], [4 * M, 0.58], [8 * M, 0.48], [Y, 0.36], [1.5 * Y, 0.2], [2 * Y, 0.09], [2.5 * Y, 0.035], [3 * Y, 0.012], [4 * Y, 0.002], [5 * Y, 0]],
    },
    {
      // 新しい女王アリ: 本当は巣作りに成功するのは ごくわずか（99%が失敗する種もある）。
      //   ここでは女王として育つ割合（w）はおおよそのまま、結婚飛行のあと 約8% が巣作りに成功する＝本当より何倍も出やすくしてある
      id: 'queen', label: '新しい女王アリ', w: 0.04, habitat: 'underground', places: PLACES, stages: QUEEN_STAGES, refDays: 20 * Y,
      // 女王の寿命は 10〜20年（10年以上・最長30年という記録も）
      survival: [[0, 1], [18 * D, 0.82], [45 * D, 0.72], [70 * D, 0.66], [6 * M, 0.6], [10 * M, 0.55], [10.4 * M, 0.2], [11 * M, 0.09], [13 * M, 0.06], [1.6 * Y, 0.048], [2 * Y, 0.044], [5 * Y, 0.035], [10 * Y, 0.022], [15 * Y, 0.011], [20 * Y, 0.004], [25 * Y, 0.001], [30 * Y, 0]],
    },
    {
      // オスアリ: 結婚飛行の あと 巣には もどらず、数日〜数週間で 一生を 終える
      id: 'male', label: 'オスアリ', w: 0.07, habitat: 'underground', places: PLACES, stages: MALE_STAGES, refDays: 11 * M,
      survival: [[0, 1], [18 * D, 0.8], [42 * D, 0.7], [65 * D, 0.64], [6 * M, 0.58], [10 * M, 0.53], [10.3 * M, 0.25], [10.6 * M, 0.06], [11 * M, 0.01], [11.5 * M, 0]],
    },
  ],

  stages: WORKER_STAGES,
  plan(rng, life, base) {
    if (base.variant.stages) life.stages = base.variant.stages.map((s) => ({ ...s }));
    return [];
  },

  stats: [
    { id: 'food', label: '運んだ えさ', unit: 'こ' },
    { id: 'eggs', label: '産んだ たまご', unit: 'こ' },
    { id: 'family', label: '巣の 家族', unit: '匹' },
  ],

  events: [
    // 巣の中の子ども（みんな）
    { at: [2 * D, 16 * D], text: 'お姉さんアリに なめられ、いつも きれいに してもらった', icon: 'heart', mood: 'good' },
    { at: [19 * D, 36 * D], text: 'お姉さんアリから、口うつしで ごはんを もらった', icon: 'apple', mood: 'good', big: 1 },
    { at: [20 * D, 36 * D], p: 0.4, text: 'あたたかい へやへ、そっと うつしてもらった', icon: 'box' },
    { at: [22 * D, 37 * D], p: 0.35, text: 'えさが 少ない 日が つづき、おなかを すかせた', icon: 'alert', mood: 'hard' },
    { at: [40 * D, 56 * D], p: 0.7, text: 'まゆの 中で、じっと 体を つくりかえた', icon: 'sleep' },

    // 働きアリ: はじめは巣の中の世話 → 外回り
    { at: [58 * D, 70 * D], need: 'v-worker', text: '最初の しごとは、たまごと 幼虫の 世話だった', icon: 'baby', big: 1, set: 'nurse' },
    { at: [60 * D, 3 * M], need: 'nurse', p: 0.6, text: '女王アリの そばで、たまごを みがいた', icon: 'crown', mood: 'good' },
    { at: [60 * D, 4 * M], need: 'nurse', p: 0.6, text: '巣の ごみを、そとの すて場へ 運んだ', icon: 'box' },
    { at: [2 * M, 5 * M], need: 'nurse', p: 0.5, text: '新しい へやを ほる しごとに まわった', icon: 'box' },
    { at: [3 * M, 5.5 * M], need: 'nurse', p: 0.85, text: '巣の そとへ 出て、えさ集めの 係に なった', icon: 'look', mood: 'good', big: 2, set: 'forager', move: 'garden' },
    { at: [3 * M, 4 * Y], need: 'forager', repeat: [2, 6], text: ['えさを 見つけて、においの 道を のこした', '大きな 虫を 見つけ、仲間と 運んだ', 'アブラムシから、あまい みつを もらった', '花の みつを なめ、おなかに ためて 帰った'], icon: 'apple', mood: 'good', add: { food: [3, 40] } },
    { at: [3 * M, 3 * Y], need: 'forager', p: 0.4, text: 'クモに ねらわれたが、なんとか にげきった', icon: 'alert', mood: 'hard' },
    { at: [3 * M, 3 * Y], need: 'forager', p: 0.3, text: 'アリジゴクの 穴に すべりかけて、はい上がった', icon: 'alert', mood: 'hard', big: 1 },
    { at: [3 * M, 3 * Y], need: 'forager', p: 0.35, text: '夕立で 地面が 川のように なり、葉に しがみついた', icon: 'rain', mood: 'hard' },
    { at: [3 * M, 3 * Y], need: 'forager', p: 0.3, text: 'となりの 巣の アリと、にらみあいに なった', icon: 'alert' },
    { at: [3 * M, 3 * Y], need: 'forager', p: 0.3, text: '公園に 落ちた アメを 見つけて、大さわぎ', icon: 'gift', mood: 'good', big: 1 },
    { at: [6 * M, 3 * Y], need: 'forager', p: 0.25, text: '大きな 頭の 仲間と、巣の 入り口を 守った', icon: 'look' },

    // 季節（羽アリも 巣の中で 冬をこす）
    { at: [4.5 * M, 7 * M], text: '寒くなり、巣の おくで 仲間と 冬ごもりした', icon: 'snow', set: 'winter' },
    { at: [9 * M, 10 * M], need: 'winter', text: '春が きて、ふたたび 体が 動きだした', icon: 'sun', mood: 'good' },
    { at: [10 * M, 10.4 * M], need: 'v-worker', p: 0.6, text: '羽アリたちの 旅立ちを、巣の 入り口で 見送った', icon: 'feather', big: 1 },
    { at: [1.3 * Y, 1.7 * Y], need: 'v-worker', text: '2回目の 冬も、仲間と 寄りそって こした', icon: 'snow', mood: 'good', big: 1 },
    { at: [1.5 * Y, 5 * Y], need: 'forager', p: 0.5, text: '足が すりへっても、えさを 運びつづけた', icon: 'apple', big: 1 },
    { at: [2.3 * Y, 2.7 * Y], need: 'v-worker', text: '3回目の 冬を こえ、巣の 大ベテランに なった', icon: 'star', mood: 'good', big: 2, set: 'veteran' },

    // 新しい女王アリ
    { at: [72 * D, 4 * M], need: 'v-queen', text: '羽が あっても、春まで 巣の中で 待った', icon: 'sleep' },
    { at: [72 * D, 4 * M], need: 'v-queen', p: 0.6, text: '働きアリたちに、たっぷり ごはんを もらった', icon: 'apple', mood: 'good' },
    { at: [10 * M, 10.3 * M], need: 'v-queen', text: '雨上がりの 夕方、空へ 飛びたった', icon: 'plane', mood: 'good', big: 3, set: 'flew', move: 'garden' },
    { at: [10 * M, 10.4 * M], need: ['v-queen', 'flew'], p: 0.9, text: '空の上で、よその 巣の オスと 結婚した', icon: 'heart', mood: 'good', big: 2, set: 'q-mated' },
    { at: [10 * M, 10.5 * M], need: 'q-mated', text: '地面に おりて、自分で 羽を 落とした', icon: 'feather', big: 2, set: 'dealate' },
    { at: [10 * M, 10.6 * M], need: 'dealate', text: '土に 穴を ほって、入り口を ふさいだ', icon: 'box', big: 2, set: 'founding', move: 'underground' },
    { at: [10.1 * M, 10.8 * M], need: 'founding', text: 'ひとりきりの へやで、たまごを {n}こ 産んだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [8, 15] }, set: 'mother' },
    { at: [10.8 * M, 12 * M], need: 'mother', text: '何も 食べずに、ひとりで 幼虫を 育てた', icon: 'heart', mood: 'hard', big: 2 },
    { at: [12 * M, 13 * M], need: 'mother', text: '最初の 働きアリが {n}匹 うまれた', icon: 'baby', mood: 'good', big: 3, add: { family: [5, 12] }, set: 'colony' },
    { at: [13 * M, 1.5 * Y], need: 'colony', text: '小さな 家族と、はじめての 冬を こした', icon: 'snow', mood: 'good', big: 1 },
    { at: [1.6 * Y, 3 * Y], need: 'colony', text: '働きアリが {n}匹 ふえた', icon: 'friends', mood: 'good', big: 2, add: { family: [80, 150] } },
    { at: [2 * Y, 25 * Y], need: 'colony', repeat: [2, 8], text: ['今年も、たくさんの たまごを 産んだ', '巣が 広がり、新しい へやが ふえた', '春の 産卵が はじまり、巣が にぎやかに なった'], icon: 'egg', mood: 'good', add: { eggs: [300, 1500] } },
    { at: [3 * Y, 6 * Y], need: 'colony', text: '巣の 家族が 1000匹を こえた', icon: 'crown', mood: 'good', big: 2, add: { family: [800, 1100] } },
    { at: [4 * Y, 8 * Y], need: 'colony', p: 0.85, text: 'はじめて、自分の 子の 羽アリが 旅立った', icon: 'feather', mood: 'good', big: 3, set: 'grandma' },
    { at: [3 * Y, 25 * Y], need: 'colony', p: 0.4, text: '大雨で 巣に 水が 入り、みんなで 子を 運んだ', icon: 'rain', mood: 'hard', big: 1 },
    { at: [6 * Y, 25 * Y], need: 'colony', p: 0.6, text: '巣は、何千匹もの 大家族に なった', icon: 'friends', mood: 'good', big: 1, add: { family: [1000, 2000] } },
    { at: [10 * Y, 30 * Y], need: 'colony', p: 0.7, text: '10年が たっても、たまごを 産みつづけた', icon: 'crown', mood: 'good', big: 2 },

    // オスアリ
    { at: [66 * D, 4 * M], need: 'v-male', text: '巣の中では 働かず、ごはんを もらって すごした', icon: 'apple' },
    { at: [10 * M, 10.3 * M], need: 'v-male', text: '雨上がりの 夕方、仲間と いっせいに 舞い上がった', icon: 'plane', mood: 'good', big: 3, set: 'flew', move: 'garden' },
    { at: [10 * M, 10.34 * M], need: ['v-male', 'flew'], p: 0.3, text: '空の上で、よその 巣の 女王と 結婚した', icon: 'heart', mood: 'good', big: 3, set: 'm-mated' },
    { at: [10 * M, 10.34 * M], need: ['v-male', 'flew'], p: 0.4, text: 'ツバメが 飛びかう 空を、ひっしで 飛んだ', icon: 'alert', mood: 'hard' },
    { at: [10.35 * M, 10.6 * M], need: ['v-male', 'flew'], p: 0.6, text: '地面に おりたが、もう 巣には もどらなかった', icon: 'feather' },
  ],

  deaths: [
    { at: [0, 20 * D], w: 3, text: ['たまごの まま、かえらずに 終わった', 'たまごの うちに、かびに つつまれて 眠った'] },
    { at: [16 * D, 40 * D], w: 3, text: ['えさが 足りない 夏、仲間の 栄養に なった', '小さな 幼虫の まま、育ちきれずに 眠った'] },
    { at: [36 * D, 72 * D], w: 2, text: 'まゆの 中で、羽化できずに 眠った' },
    { at: [56 * D, 2 * Y], w: 1, need: '!forager', text: '巣の 中で 病気に なり、しずかに 眠った' },
    { at: [4.5 * M, 10 * M], w: 1, text: '冬の 寒さに たえきれず、巣の おくで 眠った' },
    { need: 'forager', w: 5, text: ['えさ集めの とちゅう、クモに つかまった', 'トカゲに 見つかって、いのちを 終えた', 'となりの 巣との 争いで、いのちを 終えた', '夕立に 流されて、巣に もどれなかった', '鳥に ついばまれて、いのちを 終えた'] },
    { need: 'forager', at: [1.2 * Y, 5 * Y], w: 4, text: '巣の 近くで 力つき、仲間に 運ばれていった' },
    { need: ['v-male', 'flew'], w: 5, text: ['結婚飛行の あと、草の かげで しずかに 眠った', 'ひと晩 空を 飛んで、つかれはてて 眠った'] },
    { need: ['v-male', 'flew'], w: 2, text: 'ツバメに つかまって、空で いのちを 終えた' },
    { need: ['v-queen', 'flew', '!founding'], w: 4, text: ['巣を つくる 場所が 見つからず、力つきた', 'トンボに つかまって、いのちを 終えた', 'アスファルトの 上で、行き場を なくした'] },
    { need: ['founding', '!colony'], w: 4, text: 'ひとりの へやで 力つき、しずかに 眠った' },
    { need: 'colony', w: 5, text: '働きアリたちに 囲まれて、しずかに 眠った' },
  ],

  titles: [
    { need: 'grandma', text: '子の 羽アリを 空へ 送りだした 女王アリ' },
    { need: 'colony', text: 'ひとりから 王国を はじめた 女王アリ' },
    { need: ['v-queen', 'flew', '!colony'], text: '空へ 夢を かけた 女王アリ' },
    { need: 'm-mated', text: 'たった一度の 空で、未来を つないだ オスアリ' },
    { need: ['v-male', 'flew'], text: '春の 空に 消えた オスアリ' },
    { need: 'forager', stat: { food: 100 }, text: '{food}こ えさを 運んだ はたらきもの' },
    { need: ['v-worker', '!forager'], minAge: 58 * D, text: '巣の 中を ささえた 働きアリ' },
    { short: 0.9, text: '巣の おくで うまれ、巣の おくで 終わった いのち' },
  ],

  facts: [
    '世界の アリは 少なくとも 2京匹（2の あとに 0が 16こ）いる という 推計が あります（2022年）',
    '働きアリは みんな メス。若いうちは 巣の 中で 子守りを し、年を とると 外で えさを 集めます',
    'クロオオアリの 女王は 10〜20年 生きると 言われ、そのあいだ たまごを 産みつづけます',
    '結婚飛行の あと 巣作りに 成功する 女王は ほんの わずか。99%が 失敗する 種も あると 言われています',
    'オスアリは 結婚飛行の あと、巣に もどらずに 一生を 終えます',
  ],

  sources: [
    'https://doi.org/10.1073/pnas.2201550119 (Schultheiss ほか 2022 世界のアリ 少なくとも約2京匹)',
    'https://nazology.kusuguru.co.jp/zukan/ikimono/ari (女王は最長30年ほど・オスは数週間・クロオオアリの結婚飛行5〜6月・年齢でしごとが巣の中→外へ)',
    'https://kids.rurubu.jp/article/87426/ (働きアリ1〜3年・女王10年以上・結婚飛行は5〜6月の夕方・外を歩くのは年上のアリ)',
    'https://formicamarket.com/hi/species/camponotus-japonicus (たまご→おとな6〜10週間・ひとりで巣を作る・1年目の働きアリ10〜20匹)',
    'https://www.antstore.net/shop/Camponotus-cf--japonicus.html (羽アリは巣で冬をこして翌年に飛ぶ)',
    'https://infoscience.epfl.ch/record/286557 (Camponotus の子守り→外回りの切りかわり)',
    'https://link.springer.com/article/10.1007/s42690-023-01060-0 (巣作りの失敗は種によって99%にもなる・検索結果の要約で確認)',
    'https://www.city.yokohama.lg.jp/kenko-iryo-fukushi/kenko-iryo/eiken/geppo/2011/1104.files/1104.pdf (クロオオアリ: 最初に約10個の卵・女王は10〜20年・オスは飛行後まもなく死ぬ。検索結果の要約で確認)',
  ],
};
