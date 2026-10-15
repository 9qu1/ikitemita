// カマキリ（オオカマキリ。書き方は CONTENT.md・見本は cat.js）
//   秋（10月なかば）に 卵のう（あわで かためた たまごの かたまり）へ うみつけられた たまごから始まる一生にしている。
//   卵のうで 冬をこし、春（4〜5月）に 200匹ほどが いっせいに かえる → 6〜7回 脱皮して 夏（7〜8月）に 成虫
//   → 秋に 卵のうを うみ、冬の前に 一生を終える（Honda 生きもの図鑑）。ここでは かえるのを 5月なかばにしている
import { H, D, W, M, Y } from '../units.js?v=1.0.3';

const HATCH = 7 * M; // 卵のうから かえる日（5月なかば）

export default {
  id: 'mantis',
  name: 'カマキリ',
  kind: 'bug',
  weight: 1,
  // カマキリのなかま（約2400種）全体の数の目安。世界の数を数えた資料はない。
  //   待ちぶせの 狩りをする虫で 数は多くないので、控えめに 1000億匹とした
  realCount: 1e11,
  refDays: 13 * M,
  habitat: 'garden',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で、あわの かたまりの 卵のうの 中に うまれた', '{place}で、200こほどの きょうだいと 卵のうの 中に うまれた'],

  variants: [
    {
      id: 'base', label: 'オオカマキリ', w: 1, habitat: 'garden',
      places: [
        { text: '日本の 野原の ススキの くき', lat: 35.66, lon: 139.48 },
        { text: '日本の 里山の 木の 枝', lat: 36.08, lon: 140.08 },
        { text: '日本の 公園の 植えこみ', lat: 34.97, lon: 136.92 },
        { text: '韓国の 野原', lat: 37.28, lon: 127.01 },
        { text: '中国の 畑の まわり', lat: 30.59, lon: 114.3 },
        { text: 'アメリカの 庭の しげみ', lat: 39.95, lon: -75.17 },
      ],
      // 生き残り:
      //   卵のうの たまご: 8割あまりが 幼虫として 出てくる（Hurd ほか: Tenodera sinensis）。鳥・寄生バチ・草かりで 少し へる
      //   幼虫: 200匹ほど かえっても、共食いや 天敵（アリ・クモ・トカゲなど）で ほとんどが いなくなり、
      //         成虫に なれるのは 2〜3匹（Honda 生きもの図鑑）→ 0.75 × 1.2% ≒ 0.9%
      //   成虫: 鳥（モズ）など。卵のうを うんで、12月はじめの 寒さまでに みな 一生を終える
      //   （メス1匹が 卵のう 1〜3こ・400こほどの たまご → 数が保たれるには 成虫の メスの 半分ほどが 卵のうを うめる 必要がある）
      survival: [[0, 1], [M, 0.95], [4 * M, 0.88], [HATCH - 3 * D, 0.8], [HATCH, 0.75], [HATCH + 3 * D, 0.45], [7.5 * M, 0.15], [8 * M, 0.06], [9 * M, 0.022], [10 * M, 0.0095], [11 * M, 0.0078], [12 * M, 0.0058], [13 * M, 0.0028], [13.8 * M, 0.0006], [14.3 * M, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: '卵のうの たまご', from: 0, sprite: 'ootheca', scale: 0.5 },
    { id: 'nymph', name: '幼虫', from: HATCH, sprite: 'mantis', scale: 0.3, say: '春の 朝、卵のうから きょうだいと いっせいに 出てきた', icon: 'egg', big: 3 },
    { id: 'nymph2', name: '大きな 幼虫', from: 8.3 * M, sprite: 'mantis', scale: 0.6, say: '脱皮を かさねて、カマも りっぱに なってきた', icon: 'star' },
    { id: 'adult', name: 'オオカマキリ', from: 10 * M, sprite: 'mantis', scale: 1, say: 'さいごの 脱皮で、羽の はえた 成虫に なった', icon: 'star', big: 3 },
  ],

  stats: [
    { id: 'catches', label: 'つかまえた 虫', unit: '匹' },
    { id: 'eggs', label: 'うんだ たまご', unit: 'こ' },
  ],

  events: [
    // 卵のうで 冬ごし（10月〜5月）
    { at: [2 * H, D], p: 0.7, text: 'あわの ような 卵のうが かわいて、かたい 家に なった', icon: 'house' },
    { at: [3 * W, 2 * M], p: 0.4, text: 'つめたい 北風に、枝ごと ゆられた', icon: 'snow' },
    { at: [2 * M, 4.5 * M], p: 0.45, text: '雪に うもれたが、卵のうの 中は へっちゃらだった', icon: 'snow', mood: 'good' },
    { at: [M, 5 * M], p: 0.3, text: '鳥が 卵のうを つついたが、かたくて あきらめた', icon: 'alert', mood: 'hard' },
    { at: [M, 6 * M], p: 0.25, text: '散歩の 子どもが 卵のうを 見つけて、そっと 見守った', icon: 'look', mood: 'good' },
    { at: [5 * M, 6.8 * M], p: 0.45, text: '春の あたたかさで、たまごの 中で からだが できてきた', icon: 'sun' },

    // かえってすぐ（5月）
    { at: [HATCH, HATCH + 0.3], p: 0.8, text: '糸で ぶらさがって うす皮を ぬぎ、カマキリの すがたに なった', icon: 'star', big: 1 },
    { at: [HATCH, HATCH + 3], p: 0.45, text: 'アリが 集まってきて、きょうだいが つれていかれた', icon: 'alert', mood: 'hard' },
    { at: [HATCH + 0.5, HATCH + 10], p: 0.6, text: 'きょうだいたちは、ちりぢりに 草むらへ 散っていった', icon: 'feather' },
    { at: [HATCH + 1, 7.6 * M], p: 0.45, text: 'おなかを すかせた きょうだいに、ねらわれた', icon: 'alert', mood: 'hard' },
    { at: [HATCH + 1, 7.6 * M], p: 0.5, text: 'うまれて はじめて、アブラムシを つかまえた', icon: 'apple', mood: 'good', big: 1, add: { catches: 1 } },

    // 幼虫（5月〜8月）
    { at: [7.3 * M, 10 * M], repeat: [2, 3], text: ['脱皮して、ひとまわり 大きくなった', 'さかさまに ぶらさがって、古い からを ぬいだ', '脱皮の あとの やわらかい からだで、じっと まった', '葉の うらで、また 脱皮した'], icon: 'star' },
    { at: [7.3 * M, 10 * M], repeat: [1, 3], text: ['カマを かまえて、ハエを {n}匹 つかまえた', 'まちぶせして、バッタの 子を {n}匹 つかまえた', '花に きた 虫を {n}匹 しとめた'], icon: 'apple', mood: 'good', add: { catches: [1, 6] } },
    { at: [7.3 * M, 9.5 * M], p: 0.35, text: 'クモの 巣に かかりそうに なって、あわてて にげた', icon: 'alert', mood: 'hard' },
    { at: [7.3 * M, 9.5 * M], p: 0.35, text: 'からだを ゆらゆら ゆらして、風に ゆれる 草の ふり', icon: 'look' },
    { at: [8 * M, 10 * M], p: 0.35, text: 'トカゲが 近づいて、草の かげに かくれた', icon: 'alert', mood: 'hard' },
    { at: [8 * M, 10 * M], p: 0.3, text: 'カマを ふりあげて、大きな 相手を おどかした', icon: 'alert' },

    // 成虫（8月〜11月）
    { at: [10 * M, 10.3 * M], p: 0.7, text: 'はじめて 羽を ひろげて、となりの 草むらまで 飛んだ', icon: 'plane', mood: 'good', big: 2 },
    { at: [10 * M, 13 * M], repeat: [1, 2], text: ['大きな トノサマバッタを つかまえた', 'セミを つかまえて、ごちそうに した', '花に きた チョウを まちぶせした'], icon: 'apple', mood: 'good', add: { catches: [1, 3] } },
    { at: [10 * M, 13 * M], p: 0.3, text: 'のぞきこんだ 人の 顔を、首を かしげて 見かえした', icon: 'look' },
    { at: [10.3 * M, 12 * M], need: 'm', p: 0.65, text: 'メスに 近づいて、うしろから そっと 飛びのった', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
    { at: [10.3 * M, 12 * M], need: 'f', p: 0.75, text: 'オスと 出会って、つがいに なった', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
    { at: [10.4 * M, 12 * M], need: ['f', 'mated'], p: 0.15, text: 'おなかが すいていて、オスを ごはんに してしまった', icon: 'apple', mood: 'hard', big: 1 },
    { at: [10.8 * M, 12.5 * M], need: ['f', 'mated'], p: 0.95, text: ['枝に あわを ぬって、{n}この たまごの 卵のうを つくった', 'ススキの くきに、{n}この たまごを うみつけた'], icon: 'egg', mood: 'good', big: 3, add: { eggs: [150, 300] }, set: 'laid' },
    { at: [11 * M, 13 * M], need: ['f', 'laid'], repeat: [0, 2], text: ['もう ひとつ、{n}この たまごの 卵のうを うんだ', '小枝を えらんで、{n}この たまごを うみつけた'], icon: 'egg', mood: 'good', big: 1, add: { eggs: [100, 250] } },
    { at: [11 * M, 13 * M], need: 'm', p: 0.35, text: 'ほかの メスを さがして、野原を 歩きまわった', icon: 'look' },
    { at: [10.5 * M, 13 * M], p: 0.08, text: 'おなかの 中に、ハリガネムシが すみついていた', icon: 'alert', mood: 'hard', set: 'worm' },
    { at: [12 * M, 14 * M], p: 0.45, text: '朝の 冷えこみで、カマが うまく 動かなくなった', icon: 'snow', mood: 'hard' },
    { at: [12 * M, 14 * M], p: 0.35, text: 'あたたかい 日なたの かべで、ひなたぼっこを した', icon: 'sun', mood: 'good' },
    { at: [12 * M, 14 * M], need: 'laid', p: 0.3, text: '卵のうを うみおえて、枝の 上で ひと休み', icon: 'heart' },
  ],

  deaths: [
    { at: [0, HATCH], w: 4, text: ['卵のうを 鳥に つつかれて、たまごのまま 眠った', '小さな ハチに 卵のうを ねらわれ、たまごのまま 終わった', '卵のうの ついた 草が かられて、たまごのまま 眠った'] },
    { at: [HATCH - 5 * D, HATCH + 1], w: 1, text: 'うまく 外へ 出られずに、卵のうの 出口で 眠った' },
    { at: [HATCH, 8 * M], w: 4, text: ['アリに つかまって、ちいさな いのちを 終えた', 'クモの 巣に かかって、ちいさな いのちを 終えた'] },
    { at: [HATCH, 8 * M], w: 2, text: 'おなかを すかせた きょうだいに 食べられて、いのちを 終えた' },
    { at: [HATCH, 10 * M], w: 2, text: ['トカゲに 食べられて、いのちを 終えた', 'カエルに 食べられて、いのちを 終えた'] },
    { at: [7.5 * M, 10.2 * M], w: 1, text: '脱皮に しっぱいして、しずかに 眠った' },
    { at: [10 * M, 14.3 * M], w: 4, text: ['モズに つかまって、いのちを 終えた', '大きな 鳥に 見つかって、いのちを 終えた', 'スズメバチに おそわれて、いのちを 終えた', '道路を 歩いて わたる とちゅうで、いのちを 終えた'] },
    { at: [10.4 * M, 13 * M], w: 2, need: ['m', 'mated'], text: 'メスの ごはんと なって、つぎの いのちに つながった' },
    { at: [10.5 * M, 14.3 * M], w: 30, need: 'worm', text: 'ハリガネムシに みちびかれて 水に 入り、いのちを 終えた' },
    { at: [12 * M, 14.3 * M], w: 5, need: 'laid', text: '卵のうを のこして、冬の 前に しずかに 眠った' },
    { at: [12 * M, 14.3 * M], w: 4, text: '初しもの 夜、草の 上で しずかに 眠った' },
  ],

  titles: [
    { stat: { eggs: 400 }, text: '{eggs}この たまごを 冬に たくした 母' },
    { need: 'laid', text: '卵のうに 春を たくした オオカマキリ' },
    { stat: { catches: 15 }, text: '{catches}匹を しとめた 草むらの ハンター' },
    { minAge: 10 * M, need: 'm', text: '秋の 野原を かけた オオカマキリ' },
    { minAge: 10 * M, need: 'f', text: 'カマを かまえて 秋を むかえた オオカマキリ' },
    { minAge: 8 * M, maxAge: 10 * M, text: '夏の 草むらで 脱皮を かさねた 幼虫' },
    { minAge: HATCH, maxAge: 8 * M, text: '200の きょうだいと 春を むかえた いのち' },
    { maxAge: HATCH, text: '卵のうの 中で 春を まった たまご' },
  ],

  facts: [
    'オオカマキリの 卵のうからは、春に 200匹ほどの 幼虫が いっせいに かえります',
    '野外では 共食いや 天敵のため、成虫に なれるのは 200匹の うち 2〜3匹 ほど と言われています',
    '卵のうの スポンジのような つくりは、中の たまごを 寒さや かんそう、しょうげきから まもります',
    'オオカマキリは 6〜7回 脱皮して、夏に 成虫に なります',
    '「卵のうの 高さで 雪の 量が わかる」と 言われますが、まちがいだ という 観察が あります',
    'メスが オスを 食べてしまう ことが ありますが、いつも そうなる わけでは ありません',
  ],

  sources: [
    'https://www.honda.co.jp/outdoor/adventure/ookamakiri.html (Honda 生きもの図鑑: 卵のうから200匹ほど・6〜7回脱皮・成虫になれるのは2〜3匹・成虫7月下旬〜10月)',
    'https://archive.org/download/biostor-56880/biostor-56880.pdf (Hurd ほか: Tenodera sinensis の卵の8割以上が幼虫として出てくる・かえってすぐの共食い)',
    'https://tadami-buna.jp/img/file131.pdf (只見町ブナセンター: 卵鞘に100以上の卵・雪の量を予測する言い伝えは間違い・雪に埋もれてもふ化)',
    'https://www.pref.tottori.lg.jp/item/780273.htm (鳥取県: 卵包の位置と雪の量はあまり関係ないという観察)',
    'https://en.wikipedia.org/wiki/Chinese_mantis (卵のうに最大300個・約1年の一生・寒くなると死ぬ・交尾時の共食い)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC3338837/ (Tenodera sinensis の性的共食いの研究)',
  ],
};
