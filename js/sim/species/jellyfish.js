// ベニクラゲ（書き方は CONTENT.md）
import { H, D, W, M, Y } from '../units.js?v=1.0.3';

export default {
  id: 'jellyfish',
  name: 'ベニクラゲ',
  kind: 'animal',
  weight: 1.2,
  // 数を数えた資料はない。北海道〜沖縄・地中海・タスマニアなど 世界の 沿岸に 広く すむ 小さな クラゲなので、
  // ポリプと クラゲを あわせて 10億ほどの目安（桁も たしかではない）
  realCount: 1e9,
  refDays: Y, // ふつうの クラゲの 一生は 数か月。1年 生きたら 若返りを くりかえした 長生き
  habitat: 'ocean',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で、ちいさな プラヌラとして うまれた', '{place}で、赤ちゃんの プラヌラとして うまれた'],

  variants: [
    {
      id: 'wild', label: 'ベニクラゲ', w: 0.96, habitat: 'ocean', tags: ['wild'],
      places: [
        { text: '和歌山県 白浜の 海', lat: 33.69, lon: 135.34 },
        { text: '沖縄の 海', lat: 26.2, lon: 127.65 },
        { text: '福島県の 海', lat: 37.05, lon: 141.05 },
        { text: '鹿児島の 海', lat: 31.5, lon: 130.6 },
        { text: 'イタリアの 地中海', lat: 40.4, lon: 18.3 },
        { text: 'オーストラリアの タスマニアの 海', lat: -42.9, lon: 147.4 },
      ],
      // 野生での 一生の長さを はかった 資料はない。プラヌラ・ポリプ・小さな クラゲの うちに ほとんどが 食べられる
      // （「他の クラゲに 食べられるなどして 減る」久保田 2011）。ふつうの クラゲの 季節は 数か月とみて、
      // それより 長い 一生は 若返りを くりかえしたもの、と考えて 細い しっぽを つけた
      survival: [[0, 1], [D, 0.6], [3 * D, 0.3], [W, 0.2], [M, 0.1], [6 * W, 0.05], [2 * M, 0.025], [3 * M, 0.012], [4 * M, 0.006], [6 * M, 0.003], [Y, 0.001], [2 * Y, 0.0002], [3 * Y, 0.00003], [5 * Y, 0]],
    },
    {
      // 研究所の 水そうで 育てられた なかま（本当は ほんの ひとにぎり。久保田さんの 研究を 見せるため 4% 出す）。
      // 1匹から 約2年で 10回 若返った 記録（Kubota 2011）に 合わせて、2年ほど 生きる 曲線にした
      id: 'lab', label: '研究所の ベニクラゲ', w: 0.04, habitat: 'ocean', tags: ['lab'],
      places: [{ text: '和歌山県 白浜の 研究所の 水そう', lat: 33.69, lon: 135.34 }],
      survival: [[0, 1], [3 * D, 0.7], [M, 0.55], [3 * M, 0.42], [6 * M, 0.32], [Y, 0.2], [2 * Y, 0.07], [3 * Y, 0.015], [5 * Y, 0]],
    },
  ],

  stages: [
    { id: 'planula', name: 'プラヌラ', from: 0, sprite: 'egg', scale: 0.2 },
    // ポリプの 絵が ないので、小さな クラゲの 絵で 代わりにしている
    { id: 'polyp', name: 'ポリプ', from: 3 * D, sprite: 'polyp', scale: 0.45, habitat: 'reef', say: '岩に くっついて、ちいさな ポリプに なった', icon: 'sprout', big: 2 },
    { id: 'medusa', name: 'クラゲ', from: M, sprite: 'jellyfish', scale: 0.8, habitat: 'ocean', say: 'クラゲの 芽が はなれて、小さな クラゲとして 泳ぎだした', icon: 'star', big: 3 },
  ],

  stats: [
    { id: 'rejuv', label: '若返り', unit: '回' },
    { id: 'buds', label: 'ポリプから 出した クラゲ', unit: '匹' },
  ],

  events: [
    // プラヌラ
    { at: [0, 3 * H], p: 0.85, text: 'からだは、ごまつぶより ずっと 小さかった', icon: 'look', big: 1 },
    { at: [H, D], p: 0.8, text: 'こまかい 毛を 動かして、くるくる 泳いだ', icon: 'drop' },
    { at: [3 * H, 2 * D], p: 0.6, need: 'wild', text: '潮の 流れに のって、海の中を ただよった', icon: 'drop', mood: 'good' },
    { at: [6 * H, 3 * D], p: 0.6, text: 'すみかに なる 岩を さがして、底へ しずんだ', icon: 'look', big: 1 },
    { at: [0, 3 * D], p: 0.35, need: 'wild', text: '小さな 魚の 口が、すぐ そばを かすめた', icon: 'alert', mood: 'hard' },
    { at: [2 * D, 3 * D], p: 0.6, need: 'wild', text: '小さな 岩を 見つけて、ぴたっと くっついた', icon: 'house', mood: 'good', big: 1 },
    { at: [2 * D, 3 * D], p: 0.6, need: 'lab', text: 'ガラスの お皿に、ぴたっと くっついた', icon: 'house', mood: 'good', big: 1 },

    // ポリプ
    { at: [3 * D, W], p: 0.6, text: 'ポリプの てっぺんに、しょくしゅが 生えそろった', icon: 'sprout', big: 1 },
    { at: [3 * D, 2 * W], p: 0.8, text: 'ポリプから、根っこの ような 管を のばした', icon: 'sprout' },
    { at: [W, M], p: 0.7, text: '枝わかれして、ポリプの なかまが ふえていった', icon: 'friends', mood: 'good', big: 1 },
    { at: [W, M], p: 0.5, text: 'しょくしゅを ひろげて、プランクトンを つかまえた', icon: 'apple', mood: 'good' },
    { at: [2 * W, M], p: 0.7, text: 'ポリプの 先に、クラゲの 芽が いくつも ふくらんだ', icon: 'egg', mood: 'good', big: 1, add: { buds: [3, 12] } },
    { at: [W, M], p: 0.3, need: 'wild', text: 'ウミウシが、ポリプを かじりに やってきた', icon: 'alert', mood: 'hard' },

    // クラゲ
    { at: [M, 6 * W], p: 0.8, text: 'かさを ひらいたり とじたりして、海を すすんだ', icon: 'drop' },
    { at: [M, 3 * M], p: 0.7, text: 'しょくしゅに ふれた 小さな プランクトンを 食べた', icon: 'apple', mood: 'good' },
    { at: [5 * W, 3 * M], p: 0.6, text: 'からだの まんなかが、あざやかな 赤に 色づいた', icon: 'star', mood: 'good', big: 1 },
    { at: [5 * W, 3 * M], p: 0.5, text: 'しょくしゅの 数が ふえて、すこし 大きくなった', icon: 'sprout' },
    { at: [6 * W, 4 * M], p: 0.4, need: 'wild', text: 'ほかの クラゲに 食べられそうになり、にげた', icon: 'alert', mood: 'hard' },
    { at: [M, 6 * M], p: 0.3, need: 'wild', text: '潮の 流れに のって、港の すみに 流れついた', icon: 'drop' },
    { at: [M, 2 * Y], repeat: [1, 2], need: 'wild', text: ['月の 明かりの 下、ゆらゆら ただよった', 'しずかな 海で、ふわふわ 浮かんでいた', '港の 明かりに てらされて、ゆっくり 泳いだ'], icon: 'drop', mood: 'good' },
    { at: [6 * W, 8 * W], p: 0.6, need: 'f', text: 'おとなの メスに なり、海に たまごを のこした', icon: 'egg', mood: 'good', big: 2, set: 'grown' },
    { at: [6 * W, 8 * W], p: 0.6, need: 'm', text: 'おとなの オスに なり、子どもを のこした', icon: 'heart', mood: 'good', big: 2, set: 'grown' },

    // 若返り（弱ったり 年を とったりすると、肉だんごの ような すがたから ポリプに もどる。20度ほどで 2〜3日）
    //   look で、しばらく ポリプの 絵に もどる（3〜25日）
    { at: [8 * W, 4 * M], p: 0.8, text: ['年を とって 弱り、ポリプに もどって また クラゲに なった', 'けがを して 丸くなり、ポリプから 若い クラゲに もどった', 'おなかが すいて 弱り、ポリプに もどって 若返った'], icon: 'star', mood: 'good', big: 3, add: { rejuv: 1, buds: [2, 10] }, look: { id: 'polyp', for: [3 * D, 25 * D], scale: 0.45 }, set: 'r1' },
    { at: [4 * M, 8 * M], p: 0.95, need: '!r1', text: '弱った からだを まるめて、ポリプから やりなおした', icon: 'star', mood: 'good', big: 3, add: { rejuv: 1, buds: [2, 10] }, look: { id: 'polyp', for: [3 * D, 25 * D], scale: 0.45 }, set: 'r1' },
    { at: [3 * M, 10 * M], p: 0.7, need: 'r1', text: '2回めの 若返り。また ポリプから やりなおした', icon: 'star', mood: 'good', big: 3, add: { rejuv: 1, buds: [2, 10] }, look: { id: 'polyp', for: [3 * D, 25 * D], scale: 0.45 }, set: 'r2' },
    { at: [5 * M, 15 * M], p: 0.7, need: 'r2', text: '3回めの 若返り。からだは また 赤ちゃんに もどった', icon: 'star', mood: 'good', big: 3, add: { rejuv: 1, buds: [2, 10] }, look: { id: 'polyp', for: [3 * D, 25 * D], scale: 0.45 }, set: 'r3' },
    { at: [7 * M, 3 * Y], repeat: [1, 7], need: 'r3', text: ['また 若返って、ポリプから やりなおした', 'またまた 肉だんごの すがたから 若返った', 'もう 何度めかの 若返りを した'], icon: 'star', mood: 'good', big: 2, add: { rejuv: 1, buds: [2, 10] }, look: { id: 'polyp', for: [3 * D, 25 * D], scale: 0.45 } },
    { at: [3 * M, 2 * Y], p: 0.5, need: 'r1', text: 'からだは 若いのに、うまれてから 何か月も たった', icon: 'sun', mood: 'good' },
    { at: [Y, 2 * Y], p: 0.8, text: 'うまれてから 1年。からだは 若いままだった', icon: 'cake', mood: 'good', big: 2 },
    { at: [2 * Y, 5 * Y], p: 0.8, text: '若返りを くりかえして、2年が たった', icon: 'cake', mood: 'good', big: 2 },

    // 研究所の 水そう
    { at: [W, 5 * Y], repeat: [2, 4], need: 'lab', text: ['研究者が スポイトで エサを くれた', '水そうの 海水を、新しく かえてもらった', 'けんび鏡で のぞかれて、写真を とられた'], icon: 'look', mood: 'good' },
    { at: [2 * M, 2 * Y], p: 0.7, need: ['lab', 'r1'], text: '若返りの ようすを、くわしく 記録された', icon: 'look', big: 1 },
    { at: [3 * M, 3 * Y], p: 0.5, need: ['lab', 'r2'], text: '若返りの 回数が、研究所で 話題に なった', icon: 'star', mood: 'good', big: 1 },
  ],

  deaths: [
    { at: [0, 3 * D], w: 5, need: 'wild', text: ['プラヌラの まま、小さな 魚に 食べられた', '岩に たどりつく 前に、ちいさな いのちを 終えた'] },
    { at: [3 * D, M], w: 4, need: 'wild', text: ['ポリプの まま、ウミウシに 食べられた', '岩の 上で、ポリプの まま 力つきた'] },
    { at: [M, 3 * Y], w: 5, need: 'wild', text: ['ほかの クラゲに 食べられて、いのちを 終えた', '小さな 魚に 食べられて、いのちを 終えた'] },
    { at: [M, 3 * Y], w: 1, need: 'wild', text: '嵐の 波に もまれて、いのちを 終えた' },
    { at: [6 * W, 8 * M], w: 4, need: ['wild', 'grown', '!r1'], text: 'たまごを のこし、ふつうの クラゲの ように とけて 消えた' },
    { at: [2 * M, 5 * Y], w: 3, need: ['wild', 'r1'], text: '若返りの とちゅうで、食べられて しまった' },
    { at: [6 * M, 5 * Y], w: 3, need: ['wild', 'r2'], text: '何度も 若返った すえに、とうとう 食べられた' },
    { at: [0, 5 * Y], w: 5, need: 'lab', text: '研究所の 水そうで、しずかに 動かなくなった' },
    { at: [2 * M, 5 * Y], w: 3, need: ['lab', 'r1'], text: '若返りが うまく いかず、しずかに 眠った' },
  ],

  titles: [
    { stat: { rejuv: 5 }, text: '{rejuv}回 若返った 不老不死の クラゲ' },
    { need: ['lab', 'r1'], text: '研究所で 何度も 生まれかわった ベニクラゲ' },
    { need: 'r1', text: '一度 赤ちゃんに もどった ふしぎな クラゲ' },
    { need: ['grown', '!r1'], text: 'クラゲの 季節を 一度きり 生きた ベニクラゲ' },
    { maxAge: 3 * D, text: '岩を めざした ちいさな プラヌラ' },
    { minAge: 3 * D, maxAge: M, text: '岩の 上で 育った ちいさな ポリプ' },
    { minAge: M, need: ['!r1', '!grown'], text: '海を ただよった 小さな クラゲ' },
  ],

  facts: [
    'ベニクラゲは、弱ったり 年を とったりすると ポリプに もどって 若返ることが できます',
    'そのため「不老不死の クラゲ」と よばれますが、ほかの クラゲなどに 食べられて 数は 減ります',
    '京都大学の 研究で、1匹から 若返りを 約2年で 10回 くりかえした 記録が あります',
    'からだは 3ミリほどで、大きくても 1センチくらいです',
    '若返りは、20度ほどの 海で 2〜3日ほどで 進むと されています',
    '日本の ベニクラゲは、すむ 地域によって 遺伝子の ちがう 何種類かに 分かれる ことが わかってきました',
  ],

  sources: [
    'https://www.kyoto-u.ac.jp/sites/default/files/inline-files/20110115-3f0e8349a8d83cd517d75ec7ee28aa57.pdf (京都大学 2011・久保田信・体長3mm〜1cm・若返りは20度ほどで2〜3日・地域で遺伝子が3種類・他のクラゲに食べられて減る)',
    'https://repository.kulib.kyoto-u.ac.jp/dspace/handle/2433/179209 (Kubota 2011 Biogeography 13・沖縄の1匹から 約2年で10回の若返り)',
    'https://pubmed.ncbi.nlm.nih.gov/27498796/ (Hasegawa ほか 2016・何度も若返る Turritopsis・14回の記録)',
    'https://scienceblog.com/t-three-millimetre-jellyfish-reverses-life-cycle-biologically-immortal/ (Piraino ほか 1996 の紹介・弱ったクラゲは 24〜72時間で ポリプに もどる・プラヌラ→ポリプ→クラゲ)',
  ],
};
