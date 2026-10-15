// カブトムシ（Trypoxylus dichotomus）: 野生／子どもに飼われる（家の飼育ケースで うまれる）
//   7〜8月に たまご → 10日ほどで かえる → 腐葉土の中の 幼虫で 冬をこす → 6月はじめに さなぎ（約1か月）
//   → 6月下旬〜7月中旬に 羽化（7日ほどで 地上へ）→ 成虫は ひと夏（山梨県森林総合研究所）
import { H, D, W, M, Y } from '../units.js?v=1.0.2';

export default {
  id: 'beetle',
  name: 'カブトムシ',
  kind: 'bug',
  weight: 1,
  // 甲虫全体なら 約50京匹（WSU の Gardner の推計: 昆虫 約1000京匹 × 甲虫 5%）。
  //   ただしこの窓の主役は カブトムシなので、甲虫全体の数を使うと「ほんとうの数」がほぼカブトムシだけになる。
  //   コガネムシのなかま（カブトムシをふくむ）の目安として、アリ（約2京匹）より1けた少ない 2000兆匹にしぼった（Claude 10/15）
  realCount: 2e15,
  refDays: 13 * M,
  habitat: 'underground',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で うまれた', '{place}で、小さな たまごとして うまれた'],

  variants: [
    {
      id: 'wild', label: '野生の カブトムシ', w: 0.8, habitat: 'underground',
      fields: { soil: 'ふかふかの 腐葉土' },
      places: [
        { text: '茨城の 雑木林の 腐葉土', lat: 36.08, lon: 140.11 },
        { text: '山梨の クヌギ林の 落ち葉の 山', lat: 35.78, lon: 138.42 },
        { text: '京都の 里山の たい肥', lat: 35.07, lon: 135.83 },
        { text: '韓国の 山あいの 畑の たい肥', lat: 36.6, lon: 127.9 },
        { text: '台湾の 山の 森の 落ち葉', lat: 24.15, lon: 120.95 },
      ],
      // メスが産む たまごは 20〜30こ（Honda 生きもの図鑑）。数が保たれているなら、おとなまで残るのは 1割ほどの計算。
      //   たまご・幼虫・さなぎの それぞれの割合は推計（この種の野外の生命表は見つからなかった）。
      // 成虫は ひと夏。タヌキ（夜）とカラス（朝）に よく食べられ、大きいオスほど ねらわれる（Kojima ほか 2014）。
      //   標識して放した メスが 約30日後に 見つかった記録も ある（内舩 2013）
      survival: [[0, 1], [11 * D, 0.82], [42 * D, 0.6], [4 * M, 0.46], [8 * M, 0.3], [320 * D, 0.19], [345 * D, 0.13], [352 * D, 0.11], [366 * D, 0.07], [380 * D, 0.04], [400 * D, 0.015], [425 * D, 0.004], [450 * D, 0]],
    },
    {
      id: 'kept', label: '子どもに 飼われた カブトムシ', w: 0.2, habitat: 'home', tags: ['kept'], refDays: 15 * M,
      names: ['カブ', 'クロ', 'ムサシ', 'コロ', 'ポン', 'ゴン', 'チビ', 'リク', 'ソラ', 'モモ'],
      fields: { soil: '昆虫マット' },
      places: [
        { text: '東京の マンションの 飼育ケース', lat: 35.66, lon: 139.7 },
        { text: '大阪の 家の 玄関の 飼育ケース', lat: 34.69, lon: 135.5 },
        { text: '名古屋の 小学校の 教室の ケース', lat: 35.18, lon: 136.91 },
        { text: '福岡の 家の 飼育ケース', lat: 33.59, lon: 130.4 },
        { text: '仙台の 家の ベランダの ケース', lat: 38.27, lon: 140.87 },
      ],
      // 飼育ケースの中は 天敵が いないぶん 生き残りやすい（割合は推計）。さなぎの へやを こわすと 羽化に しくじりやすい。
      //   飼育の 成虫は 2〜3か月 生きる（るるぶKids）
      survival: [[0, 1], [11 * D, 0.88], [42 * D, 0.78], [4 * M, 0.72], [8 * M, 0.66], [320 * D, 0.6], [345 * D, 0.5], [352 * D, 0.48], [380 * D, 0.44], [410 * D, 0.33], [430 * D, 0.2], [450 * D, 0.08], [470 * D, 0.02], [490 * D, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3 },
    { id: 'larva', name: '幼虫', from: 11 * D, sprite: 'grub', scale: 0.35, say: 'たまごから 小さな 幼虫が かえった', icon: 'egg', big: 1 },
    { id: 'larva3', name: '3れい幼虫', from: 42 * D, sprite: 'grub', scale: 0.75, say: '2回目の だっぴで、3れい幼虫に なった', icon: 'sprout' },
    { id: 'pupa', name: 'さなぎ', from: 320 * D, sprite: 'pupa', scale: 0.8, say: '土の中に へやを つくり、さなぎに なった', icon: 'sleep', big: 2 },
    { id: 'adult', name: 'カブトムシ', from: 345 * D, sprite: 'beetle', scale: 1, say: 'さなぎから、カブトムシの 成虫に なった', icon: 'star', big: 3 },
  ],

  stats: [
    { id: 'eggs', label: '産んだ たまご', unit: 'こ' },
    { id: 'wins', label: '勝った 勝負', unit: '回' },
    { id: 'sap', label: '樹液の 夜', unit: '回' },
    { id: 'jelly', label: '食べた ゼリー', unit: 'こ' },
  ],

  events: [
    // たまご・幼虫
    { at: [2 * D, 10 * D], p: 0.6, text: 'たまごが 土の 水を すって、まるく ふくらんだ', icon: 'egg' },
    { at: [11 * D, 40 * D], text: '{soil}を もりもり 食べた', icon: 'apple', mood: 'good' },
    { at: [20 * D, 26 * D], text: 'はじめての だっぴで、ひと回り 大きく なった', icon: 'sprout' },
    { at: [2 * M, 4 * M], text: '親指より 太い 幼虫に 育った', icon: 'sprout', mood: 'good', big: 1 },
    { at: [2 * M, 5 * M], p: 0.35, need: 'v-wild', text: 'すぐ 横を、モグラの トンネルが 通った', icon: 'alert', mood: 'hard' },
    { at: [3 * M, 8 * M], p: 0.3, need: 'v-wild', text: 'イノシシに 落ち葉の 山を ほりかえされた', icon: 'alert', mood: 'hard', big: 1 },
    { at: [3 * M, 9 * M], p: 0.3, need: 'v-wild', text: '落ち葉の 下で、ミミズと となりどうしに なった', icon: 'friends' },
    { at: [4 * M, 7 * M], need: 'v-wild', text: '寒い 冬は、土の 深くで じっと すごした', icon: 'snow' },
    { at: [4 * M, 7 * M], need: 'kept', text: '冬は、ケースの 中で じっと すごした', icon: 'snow' },
    { at: [3 * M, 9 * M], need: 'kept', p: 0.85, text: 'マットを かえてもらい、ふかふかの 家に なった', icon: 'house', mood: 'good' },
    { at: [3 * M, 9 * M], need: 'kept', p: 0.4, text: 'ケースの かべごしに、じっと のぞきこまれた', icon: 'look' },
    { at: [7.5 * M, 9.5 * M], text: '春に なり、また よく 食べるように なった', icon: 'sun', mood: 'good' },
    { at: [300 * D, 318 * D], p: 0.7, text: '体が 黄色っぽく なり、食べるのを やめた', icon: 'look' },

    // さなぎ
    { at: [322 * D, 343 * D], need: 'm', p: 0.8, text: 'さなぎの 頭に、りっぱな ツノの 形が できた', icon: 'star', mood: 'good', big: 1 },
    { at: [322 * D, 343 * D], need: 'kept', p: 0.35, text: '透明な ケースごしに、さなぎを 見守られた', icon: 'look', mood: 'good' },

    // 成虫
    { at: [346 * D, 351 * D], text: '体が かたまるまで、土の中で 待った', icon: 'sleep' },
    { at: [351 * D, 356 * D], need: 'v-wild', text: '夏の夜、土を おしのけて 地上に 出た', icon: 'star', mood: 'good', big: 2, set: 'out', move: 'forest' },
    { at: [351 * D, 356 * D], need: 'kept', text: 'マットから はい出して、家族を おどろかせた', icon: 'star', mood: 'good', big: 2, set: 'out' },
    { at: [352 * D, 362 * D], need: ['kept', 'out'], p: 0.9, text: '名前は「{name}」に なった', icon: 'heart', mood: 'good', big: 1 },
    // 虫とりの子に つかまる（つかまると、そのあとの 森の できごとは 出ない）
    { at: [352 * D, 400 * D], need: ['v-wild', 'out'], p: 0.15, text: '虫とりの 子どもに つかまり、虫かごに 入った', icon: 'house', big: 2, set: 'caught', move: 'home' },
    { at: [352 * D, 440 * D], need: ['v-wild', 'out', '!caught'], repeat: [2, 5], text: ['クヌギの 木で、あまい 樹液を 吸った', '夜の 森を、ブーンと 音を たてて 飛んだ', '樹液に 集まる 虫たちと、場所を 取りあった'], icon: 'apple', mood: 'good', add: { sap: 1 } },
    { at: [352 * D, 490 * D], need: ['kept', 'out'], repeat: [2, 5], text: ['昆虫ゼリーを ぺろぺろ なめた', 'ゼリーの カップに 頭を つっこんだ', 'とまり木に しがみついて、ひと休み'], icon: 'apple', mood: 'good', add: { jelly: [1, 3] } },
    { at: [353 * D, 440 * D], need: 'caught', p: 0.9, text: '子どもの 部屋の 虫かごで、ゼリーを もらった', icon: 'apple' },
    { at: [353 * D, 430 * D], need: ['m', 'v-wild', 'out', '!caught'], p: 0.7, text: 'ツノで ライバルを 投げとばした', icon: 'ball', mood: 'good', big: 2, add: { wins: [1, 3] }, set: 'champ' },
    { at: [353 * D, 430 * D], need: ['m', 'v-wild', 'out', '!caught'], p: 0.4, text: '大きな オスに 投げとばされ、木から 落ちた', icon: 'alert', mood: 'hard' },
    { at: [353 * D, 430 * D], need: ['v-wild', 'out', '!caught'], p: 0.35, text: 'タヌキの 足音に 気づき、木の 上へ にげた', icon: 'alert', mood: 'hard', big: 1 },
    { at: [353 * D, 430 * D], need: ['v-wild', 'out', '!caught'], p: 0.3, text: '明け方、カラスに 見つかりかけて 葉の 下に かくれた', icon: 'alert', mood: 'hard' },
    { at: [353 * D, 430 * D], need: ['v-wild', 'out', '!caught'], p: 0.3, text: '町の 明かりに ひかれて、遠くまで 飛んだ', icon: 'plane' },
    { at: [356 * D, 420 * D], need: ['f', 'out'], p: 0.75, text: 'オスと 出会い、結婚した', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
    { at: [358 * D, 480 * D], need: 'mated', repeat: [1, 3], text: '{soil}に もぐって、たまごを {n}こ 産んだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [6, 12] }, set: 'mother' },
    { at: [355 * D, 470 * D], need: ['m', 'kept', 'out'], p: 0.5, text: '学校に つれていかれ、クラスの 人気者に なった', icon: 'school', mood: 'good', big: 2 },
    { at: [355 * D, 470 * D], need: ['kept', 'out'], p: 0.35, text: '夜中に ガサゴソ 動いて、家族を 起こした', icon: 'alert' },
    { at: [355 * D, 470 * D], need: ['kept', 'out'], p: 0.25, text: 'ふたの すきまから にげだし、カーテンで 見つかった', icon: 'alert', big: 1 },
    { at: [365 * D, 480 * D], need: ['kept', 'out'], p: 0.5, text: '夏休みの 絵日記に、大きく かいてもらった', icon: 'star', mood: 'good', big: 1 },
    { at: [395 * D, 490 * D], need: 'out', p: 0.5, text: '足の 力が 弱って、よく ころぶように なった', icon: 'sleep', mood: 'hard' },
  ],

  deaths: [
    { at: [0, 15 * D], w: 3, text: ['たまごの まま、かびに つつまれて 眠った', 'たまごの うちに、アリに 見つかった'] },
    { at: [11 * D, 320 * D], need: 'v-wild', w: 3, text: ['モグラに 見つかって、いのちを 終えた', 'イノシシに ほり出されて、いのちを 終えた', '病気に かかって、土の中で 眠った', '鳥に ほり出されて、いのちを 終えた'] },
    { at: [11 * D, 320 * D], need: 'kept', w: 3, text: ['マットが かわいて、弱ってしまった', '病気に かかって、マットの中で 眠った'] },
    { at: [300 * D, 352 * D], w: 3, text: ['さなぎの へやが くずれて、羽化できなかった', 'さなぎから うまく ぬけだせずに 眠った'] },
    { at: [315 * D, 352 * D], need: 'kept', w: 1, text: 'ようすを 見ようと ほられ、さなぎの へやが こわれた' },
    { need: ['out', 'v-wild', '!caught'], w: 4, text: ['夜の 森で、タヌキに つかまって いのちを 終えた', '朝の 樹液で、カラスに つかまって いのちを 終えた'] },
    { need: ['out', 'v-wild', '!caught'], at: [366 * D, 460 * D], w: 3, text: '夏の 終わり、木の 根もとで しずかに 眠った' },
    { need: 'mother', w: 4, text: 'たまごを のこして、しずかに 眠った' },
    { need: ['out', 'kept'], w: 4, text: ['虫かごの 中で、家族に 見守られて 眠った', '夏休みの 終わりに、しずかに 眠った'] },
    { need: 'caught', w: 4, text: '子どもの 虫かごで、ひと夏を 終えた' },
  ],

  titles: [
    { need: 'mother', text: '{eggs}この たまごを のこした お母さん' },
    { need: 'champ', stat: { wins: 3 }, text: '樹液の 王さまと よばれた オス' },
    { need: ['kept', 'out'], text: '「{name}」と よばれた、夏の 人気者' },
    { need: 'caught', text: '森から 子どもの 家へ 来た カブトムシ' },
    { need: ['out', 'v-wild', '!caught'], long: 0.025, text: '夏を 生きぬいた 森の カブトムシ' },
    { need: '!out', minAge: 300 * D, text: 'あと 少しで 地上だった カブトムシ' },
    { minAge: 42 * D, maxAge: 300 * D, text: '土の中で 夏を 夢みた 幼虫' },
    { short: 0.9, text: '土の中で 終わった 小さな いのち' },
  ],

  facts: [
    'カブトムシの メスは、腐葉土などに 20〜30この たまごを 産みます',
    '幼虫は 3回 だっぴしながら、約10か月を 土の中で すごします',
    '野外の 成虫は ひと夏の いのち。飼育すると 2〜3か月 生きることも あります',
    '大きい オスほど、タヌキや カラスに 食べられやすい という 研究が あります（2014年）',
    'オスは ツノの 先を 相手の 体の 下に 入れて、投げとばします',
  ],

  sources: [
    'https://www.pref.yamanashi.jp/documents/60896/67426640007.pdf (山梨県森林総合研究所: 7〜8月に産卵・約10日でふ化・幼虫で越冬・6月はじめに蛹 約1か月・羽化は6月下旬〜7月中旬 ピーク7月上旬・羽化後7日ほどで活動・成虫は一夏)',
    'https://www.honda.co.jp/outdoor/adventure/kabutomushi.html (メスは20〜30卵・3回脱皮・6月ごろ蛹室・約3週間で成虫・角で投げ飛ばす)',
    'https://kids.rurubu.jp/article/63560/ (成虫の寿命 2〜3か月・蛹 約2週間〜1か月・幼虫 約8か月)',
    'https://doi.org/10.2108/zsj.31.109 (Kojima ほか 2014 タヌキとカラスによる捕食・オスと大きい個体ほど食べられる)',
    'https://www.museum.yokosuka.kanagawa.jp/wp/wp-content/uploads/2020/06/s60-7_Uchifune_2013.pdf (内舩 2013 標識再捕獲: 放した88匹のうち メス1匹が約30日後に見つかった)',
    'https://askdruniverse.wsu.edu/2023/03/16/7112/ (甲虫は約50京匹という推計: 昆虫1000京匹の5%)',
  ],
};
