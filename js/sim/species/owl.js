// フクロウ（日本のフクロウ Strix uralensis）
//   3〜4月に 2〜4こ たまごをうみ、あたためるのに約1か月・巣の中のひなの期間も約1か月。
//   ひなは まだ飛べないうちに巣を出て、枝の上で親からえさをもらう。秋に親のなわばりを出る
import { H, D, W, M, Y } from '../units.js?v=1.0.2';

// 生き残りの曲線（たまごから）: ふ化 約30日・巣立ち 約65日
//   1年目は 生きのびるのが 3割ほど、おとなは 年に 8割5分ほどが 生きのこる（モリフクロウ・フクロウの 足輪の 調査の 目安）
//   最長は 足輪の 記録で 23年10か月（フィンランド）
const SURVIVAL = [[0, 1], [32 * D, 0.82], [65 * D, 0.66], [4 * M, 0.55], [6 * M, 0.45], [Y, 0.3], [2 * Y, 0.23], [5 * Y, 0.14], [8 * Y, 0.09], [12 * Y, 0.045], [16 * Y, 0.016], [20 * Y, 0.004], [24 * Y, 0.0004], [25 * Y, 0]];

export default {
  id: 'owl',
  name: 'フクロウ',
  kind: 'animal',
  weight: 1,
  realCount: 1e6, // 世界のフクロウ（この種類）の おとなは 64万〜105万羽（BirdLife 2021）
  refDays: 18 * Y,
  habitat: 'forest',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 木の うろで、たまごとして うまれた', '{place}の 巣箱で、たまごとして うまれた'],

  variants: [
    {
      id: 'forest', label: 'フクロウ', w: 1, habitat: 'forest', tags: [],
      places: [
        { text: '奈良の 神社の 森', lat: 34.68, lon: 135.84 },
        { text: '長野の 里山の 森', lat: 36.23, lon: 137.97 },
        { text: '北海道の 森', lat: 43.0, lon: 141.4 },
        { text: '宮城の ブナの 森', lat: 38.27, lon: 140.6 },
        { text: '九州の 山あいの 森', lat: 32.8, lon: 131.1 },
        { text: '東京の 郊外の 雑木林', lat: 35.66, lon: 139.3 },
      ],
      survival: SURVIVAL,
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.35 },
    { id: 'chick', name: 'ひな', from: 30 * D, sprite: 'owl', scale: 0.45, say: 'からを わって、白い ふわふわの ひなが かえった', icon: 'egg', big: 1 },
    { id: 'fledgling', name: '巣立ちびな', from: 65 * D, sprite: 'owl', scale: 0.7, say: 'まだ 飛べないまま、巣から 枝へ 出た（巣立ち）', icon: 'star', big: 3 },
    { id: 'adult', name: 'おとなのフクロウ', from: Y, sprite: 'owl', scale: 1, say: '一人前の フクロウに なった', icon: 'feather' },
  ],

  stats: [
    { id: 'mice', label: 'つかまえた ネズミ', unit: '匹' },
    { id: 'chicks', label: '巣立たせた ひな', unit: '羽' },
  ],

  events: [
    // たまご
    { at: [2 * D, 25 * D], p: 0.6, text: '雪の ふる 夜も、母さんの おなかの下で あたためられた', icon: 'snow' },
    { at: [5 * D, 28 * D], p: 0.4, text: '父さんが 運んだ ネズミを、母さんが 巣で 受けとった', icon: 'apple' },
    { at: [27 * D, 30 * D], p: 0.6, text: 'からの 中から、ちいさな 声で ないた', icon: 'egg' },

    // ひな
    { at: [31 * D, 36 * D], text: '母さんが ネズミを 小さく ちぎって 食べさせてくれた', icon: 'apple', mood: 'good' },
    { at: [37 * D, 43 * D], text: 'はじめて 目が ひらいた', icon: 'look', big: 1 },
    { at: [40 * D, 60 * D], p: 0.5, text: 'きょうだいと えさを とりあって、大きな 声で ないた', icon: 'alert' },
    { at: [45 * D, 64 * D], p: 0.6, text: '巣の 入り口から、はじめて 森を のぞいた', icon: 'look' },

    // 巣立ちびな
    { at: [66 * D, 75 * D], p: 0.5, text: '枝から 落ちて、木の 幹を よじのぼって もどった', icon: 'alert', mood: 'hard', big: 1 },
    { at: [65 * D, 80 * D], p: 0.4, text: '近づいた 人を、母さんが はげしく 追いはらった', icon: 'alert' },
    { at: [75 * D, 4 * M], p: 0.85, text: 'はじめて 音を 立てずに、森の 中を 飛んだ', icon: 'feather', mood: 'good', big: 2 },
    { at: [3 * M, 5 * M], p: 0.85, text: '父さんに ならって、はじめて 自分で ネズミを つかまえた', icon: 'apple', mood: 'good', big: 2, add: { mice: 1 } },
    { at: [3 * M, 6 * M], p: 0.45, text: 'カラスの 群れに 見つかり、さわがれて 追いかけられた', icon: 'alert', mood: 'hard' },

    // ひとり立ち
    { at: [5 * M, 8 * M], p: 0.85, text: '秋、親の なわばりを はなれて ひとり立ちした', icon: 'plane', big: 2, set: 'dispersed' },
    { at: [5 * M, Y], p: 0.5, need: 'dispersed', text: '知らない 森を、すみかを さがして 何日も 飛んだ', icon: 'plane' },
    { at: [7 * M, 11 * M], p: 0.5, text: '雪の 下の ネズミの 足音を 聞きつけて、とびこんだ', icon: 'snow', big: 1, add: { mice: 1 } },
    { at: [6 * M, 3 * Y], p: 0.3, text: '大雪の 冬、えものが とれず おなかを すかせた', icon: 'snow', mood: 'hard' },
    { at: [6 * M, 24 * Y], repeat: [3, 6], text: ['夜の 森で、音もなく ネズミを つかまえた', 'まん月の 夜、枝の 上で じっと 耳を すませた', '昼間は 木の 葉かげで、目を 細くして ねむった', 'のみこんだ ネズミの 毛と 骨を、まとめて はきだした'], icon: 'look', add: { mice: [150, 500] } },
    { at: [6 * M, 20 * Y], p: 0.3, text: '首を くるりと 回して、うしろの 音を たしかめた', icon: 'look' },
    { at: [6 * M, 20 * Y], p: 0.3, text: 'カエルや 大きな 虫も、ごちそうに した', icon: 'apple', mood: 'good' },
    { at: [6 * M, 15 * Y], p: 0.2, text: '夜の 道を 低く 飛んで、車に ぶつかりかけた', icon: 'alert', mood: 'hard' },
    { at: [6 * M, 20 * Y], p: 0.25, text: 'お宮の 大きな スギの 木で、昼間を すごした', icon: 'sleep' },
    { at: [Y, 20 * Y], p: 0.15, text: '研究者に そっと 足輪を つけてもらった', icon: 'gift', set: 'ringed' },

    // つがいと子育て
    { at: [10 * M, 3 * Y], p: 0.8, need: 'dispersed', text: '大きな 木の ある 森に、自分の なわばりを もった', icon: 'house', big: 1, set: 'territory' },
    { at: [Y, 4 * Y], p: 0.8, need: 'territory', text: '冬の 夜、「ゴロスケ ホッホ」と なきかわして つがいに なった', icon: 'heart', mood: 'good', big: 2, set: 'paired' },
    { at: [Y, 20 * Y], p: 0.3, need: 'territory', text: '人が かけた 巣箱を 見つけて、すみかに した', icon: 'house', mood: 'good' },
    { at: [2 * Y, 20 * Y], p: 0.85, need: ['f', 'paired'], text: '1か月の あいだ、巣に こもって たまごを あたためた', icon: 'egg', big: 1 },
    { at: [2 * Y, 20 * Y], p: 0.85, need: ['m', 'paired'], text: '毎晩 ネズミを つかまえて、巣の 相手に とどけた', icon: 'apple', mood: 'good', big: 1 },
    { at: [2 * Y, 24 * Y], repeat: [1, 6], need: 'paired', text: ['{n}羽の ひなが、ぶじに 巣立った', 'つがいで 育てた {n}羽の ひなが、巣立っていった'], icon: 'baby', mood: 'good', big: 3, add: { chicks: [1, 3] }, set: 'parent' },
    { at: [2 * Y, 20 * Y], p: 0.4, need: 'paired', text: 'ネズミが 少ない 年で、ことしは 子育てを 休んだ', icon: 'rain', mood: 'hard' },
    { at: [2 * Y, 20 * Y], p: 0.35, need: 'parent', text: '巣に 近づいた テンを、つがいで 追いはらった', icon: 'alert' },
    { at: [3 * Y, 24 * Y], p: 0.5, need: 'paired', text: '毎年 同じ 相手と、同じ 森で 春を むかえた', icon: 'heart', mood: 'good', big: 1 },

    // 長生き
    { at: [10 * Y, 26 * Y], p: 0.6, text: '森で いちばんの 古株の フクロウに なった', icon: 'crown', big: 2 },
  ],

  deaths: [
    { at: [0, 32 * D], w: 3, text: ['たまごの まま、ひなに なる前に いのちを 終えた', 'たまごが ひえて、かえらないまま いのちを 終えた'] },
    { at: [0, 32 * D], w: 1, text: 'テンに 巣を 見つけられ、たまごの まま いのちを 終えた' },
    { at: [32 * D, 65 * D], w: 3, text: ['えさが 足りず、巣の 中で しずかに 眠った', 'きょうだいより 体が 小さく、巣の 中で いのちを 終えた'] },
    { at: [65 * D, 6 * M], w: 3, text: ['巣立って すぐ、地面で テンに つかまって いのちを 終えた', 'まだ うまく 飛べず、カラスに おそわれて いのちを 終えた'] },
    { at: [5 * M, 26 * Y], w: 3, text: '冬に えものが とれず、いのちを 終えた' },
    { at: [5 * M, 26 * Y], w: 2, text: '夜の 道路で 車に ぶつかって、いのちを 終えた' },
    { at: [Y, 26 * Y], w: 1, text: '病気に かかって、いのちを 終えた' },
    { at: [10 * Y, 30 * Y], w: 5, text: 'なれた 森の 大きな 木の上で、しずかに いのちを 終えた' },
  ],

  titles: [
    { stat: { chicks: 10 }, text: '{chicks}羽の ひなを 巣立たせた 森の 親鳥' },
    { stat: { mice: 3000 }, text: '{mice}匹の ネズミを とった 夜の かりの 名人' },
    { long: 0.03, text: '森の 主（ぬし）と よばれた フクロウ' },
    { need: 'paired', minAge: 8 * Y, text: '同じ 相手と 長く そいとげた フクロウ' },
    { short: 0.82, text: 'たまごの まま 春を むかえた いのち' },
    { short: 0.66, minAge: 32 * D, text: '巣の 中で 森の 音だけを 聞いた ひな' },
    { short: 0.45, long: 0.66, text: '巣立って 森を 知りはじめた 若い フクロウ' },
    { short: 0.15, long: 0.45, text: 'どこにでもいる、たった1羽の フクロウ' },
  ],

  facts: [
    'フクロウの つがいは 長く つづき、1年じゅう 同じ なわばりで くらすことが 多いです',
    'フクロウの 羽の ふちは ぎざぎざで、風の 音を 小さくして 静かに 飛べます',
    'フィンランドでは、足輪の 記録で 23年10か月 生きた フクロウが いました',
    'フクロウは 首を 左右に 約270度 回せると 言われています',
    '日本の フクロウは 3〜4月ごろ 2〜4この たまごを うみ、あたためるのにも ひなが 巣立つのにも それぞれ 約1か月 かかります',
    '食べた ネズミの 毛や 骨は、かたまり（ペリット）に して 口から はきだします',
  ],

  sources: [
    'https://mfri.repo.nii.ac.jp/record/158/files/MFR_No01_p17_p23.pdf (日本のフクロウ: 一腹2〜4卵・本州で3〜4月に産卵・抱卵と巣内育雛に各約1か月・樹洞やタカの古巣)',
    'https://www.pref.kyoto.jp/kankyo/rdb/bio/db/bird0087.html (京都府レッドデータブック: 夜にネズミを食べる・樹洞で営巣・メスが抱卵)',
    'https://www.federcaccia.org/wp-content/uploads/EURING_longevity_list_20230901.pdf (EURING 長寿記録: Ural Owl 23年10か月 フィンランド)',
    'https://datazone.birdlife.org/species/factsheet/ural-owl-strix-uralensis (BirdLife: 世界の成鳥 64万〜105万羽・ヨーロッパ8万〜13万つがい)',
    'https://bioone.org/journals/the-auk/volume-119/issue-2/0004-8038(2002)119[0544:RASIAV]2.0.CO;2 (Brommer ほか 2002 フクロウの繁殖と生存はネズミの数で変わる)',
  ],
};
