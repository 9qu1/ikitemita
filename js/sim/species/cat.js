// ネコ（見本: ほかの種類もこの形で書く。書き方は CONTENT.md）
import { H, D, W, M, Y } from '../units.js?v=1.0.1';

export default {
  id: 'cat',
  name: 'ネコ',
  kind: 'animal',
  weight: 1.2, // おまかせ（どうぶつの中）での出やすさ
  realCount: 6e8, // 世界にいる数の目安（ほんとうの数モード）
  refDays: 20 * Y, // この長さを生きると、窓の時計がいちばん長く回る
  habitat: 'home',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で うまれた', '{place}で、きょうだいと いっしょに うまれた'],

  variants: [
    {
      id: 'house', label: '飼いネコ', w: 0.55, habitat: 'home', tags: ['pet'],
      names: ['タマ', 'ミケ', 'ソラ', 'モモ', 'レオ', 'ムギ', 'キナコ', 'ルナ', 'コテツ', 'ハナ', 'ココ', 'チャチャ'],
      places: [
        { text: '日本の 町の家', lat: 35.7, lon: 139.7 },
        { text: 'アメリカの 郊外の家', lat: 39.8, lon: -86.2 },
        { text: 'ドイツの アパート', lat: 52.5, lon: 13.4 },
        { text: 'ブラジルの 家', lat: -23.5, lon: -46.6 },
        { text: 'ロシアの 家', lat: 55.8, lon: 37.6 },
        { text: '中国の マンション', lat: 31.2, lon: 121.5 },
      ],
      // 飼いネコ: 平均寿命 15〜16歳（ペットフード協会 2023）
      survival: [[0, 1], [2 * M, 0.97], [Y, 0.95], [5 * Y, 0.92], [10 * Y, 0.82], [13 * Y, 0.68], [15 * Y, 0.52], [17 * Y, 0.33], [19 * Y, 0.15], [21 * Y, 0.05], [24 * Y, 0.008], [27 * Y, 0]],
    },
    {
      id: 'stray', label: 'のらネコ', w: 0.45, habitat: 'town', tags: ['stray'],
      places: [
        { text: 'トルコの イスタンブールの 路地', lat: 41.0, lon: 28.97 },
        { text: 'イタリアの ローマの 遺跡のそば', lat: 41.9, lon: 12.5 },
        { text: '日本の 港町', lat: 34.4, lon: 133.2 },
        { text: 'ギリシャの 島の港', lat: 37.4, lon: 25.3 },
        { text: 'タイの 市場のうら', lat: 13.75, lon: 100.5 },
        { text: 'モロッコの 旧市街', lat: 34.0, lon: -5.0 },
      ],
      // 外で生まれた子ネコは、半年までに4匹に3匹がいなくなる（Nutter ほか 2004）
      survival: [[0, 1], [W, 0.85], [M, 0.7], [6 * M, 0.25], [Y, 0.2], [3 * Y, 0.12], [5 * Y, 0.06], [8 * Y, 0.02], [12 * Y, 0.003], [16 * Y, 0]],
    },
  ],

  stages: [
    { id: 'kitten', name: '子ネコ', from: 0, sprite: 'cat', scale: 0.6 },
    { id: 'adult', name: 'おとなのネコ', from: Y, sprite: 'cat', scale: 1, say: 'りっぱな おとなのネコに なった', icon: 'star' },
    { id: 'senior', name: 'シニアのネコ', from: 11 * Y, sprite: 'cat', scale: 0.95, say: 'ひげに 白いものが まじってきた', icon: 'sleep' },
  ],

  stats: [
    { id: 'naps', label: 'ひなたぼっこ', unit: '回' },
    { id: 'kittens', label: '子ネコ', unit: '匹' },
    { id: 'friends', label: 'ネコのともだち', unit: '匹' },
  ],

  events: [
    // 子ネコのころ
    { at: [8 * D, 12 * D], text: 'はじめて 目が ひらいた', icon: 'look', big: 1 },
    { at: [3 * W, 5 * W], text: 'よちよち 歩きで 巣のそとへ 出てみた', icon: 'sprout' },
    { at: [5 * W, 9 * W], p: 0.8, text: ['きょうだいと とっくみあいの けんか', 'しっぽを 追いかけて ぐるぐる 回った'], icon: 'ball', mood: 'good' },
    { at: [2 * M, 4 * M], p: 0.85, need: 'pet', text: '新しい家族の もとへ もらわれていった', icon: 'house', mood: 'good', big: 2, set: 'adopted' },
    { at: [2 * M, 3 * M], p: 0.9, need: 'adopted', text: '名前は「{name}」に なった', icon: 'heart', mood: 'good', big: 1 },
    { at: [3 * M, 6 * M], p: 0.7, need: 'pet', text: 'カーテンを よじのぼって しかられた', icon: 'alert' },
    { at: [M, 3 * M], p: 0.6, need: 'stray', text: 'やさしい人に ごはんを もらった', icon: 'fish', mood: 'good', big: 1 },
    { at: [2 * M, 5 * M], p: 0.5, need: 'stray', text: 'カラスに 追いかけられて、物かげに にげこんだ', icon: 'alert', mood: 'hard' },
    { at: [3 * M, 6 * M], p: 0.5, need: 'stray', text: '寒い夜、エンジンのそばで まるくなった', icon: 'snow', mood: 'hard' },

    // おとな
    { at: [6 * M, Y], p: 0.75, need: 'pet', text: '病院で 不妊・去勢の 手術を うけた', icon: 'bandage', set: 'fixed' },
    { at: [6 * M, 3 * Y], p: 0.35, need: 'stray', text: '地域の人に つかまって、耳さきを カットされた（さくらネコ）', icon: 'bandage', set: 'fixed' },
    { at: [6 * M, 20 * Y], repeat: [3, 8], text: ['日だまりで 昼寝をした', 'まどべで いちにち ひなたぼっこ', 'こたつの中で ねむった'], icon: 'sun', mood: 'good', add: { naps: [20, 300] } },
    { at: [6 * M, 8 * Y], p: 0.6, text: '近所のネコと ともだちに なった', icon: 'friends', mood: 'good', add: { friends: 1 } },
    { at: [Y, 10 * Y], p: 0.3, text: 'ライバルのネコと にらみあいで 3分 動かなかった', icon: 'alert' },
    { at: [10 * M, 8 * Y], repeat: [1, 3], need: ['f', '!fixed'], text: '{n}匹の 子ネコを うんだ', icon: 'baby', mood: 'good', big: 3, add: { kittens: [2, 6] }, set: 'mother' },
    { at: [Y, 6 * Y], p: 0.4, need: ['m', '!fixed'], text: 'なわばりを 広げに、遠くの町まで 出かけた', icon: 'plane' },
    { at: [Y, 15 * Y], p: 0.5, need: 'pet', text: '家族が 箱を買ったのに、中身より 箱が 気に入った', icon: 'box', mood: 'good' },
    { at: [Y, 15 * Y], p: 0.35, need: 'pet', text: '家族の赤ちゃんの そばで、そっと 見守った', icon: 'baby', mood: 'good', big: 2 },
    { at: [Y, 12 * Y], p: 0.3, need: 'pet', text: '家族と いっしょに 引っこした', icon: 'box' },
    { at: [Y, 10 * Y], p: 0.4, need: 'pet', text: 'ソファで つめとぎをして、家族が ため息をついた', icon: 'alert' },
    { at: [Y, 10 * Y], p: 0.35, need: 'stray', text: '魚屋さんの おこぼれを 毎朝 もらうのが 日課に なった', icon: 'fish', mood: 'good' },
    { at: [Y, 8 * Y], p: 0.25, need: 'stray', text: 'やさしい家族に ひろわれて、家ネコに なった', icon: 'house', mood: 'good', big: 3, set: 'rescued', move: 'home' },
    { at: [Y, 8 * Y], p: 0.25, need: 'stray', text: 'けんかで 耳に きずを つくった', icon: 'bandage', mood: 'hard' },
    { at: [2 * Y, 14 * Y], p: 0.3, text: 'おなかを こわして 病院に かよった', icon: 'bandage', mood: 'hard' },
    { at: [Y, 14 * Y], p: 0.4, text: 'ネズミを つかまえて、じまんげに 見せに きた', icon: 'star' },

    // シニア
    { at: [11 * Y, 25 * Y], p: 0.7, need: 'pet', text: '高いところに のぼるのを やめて、ひざの上が 定位置に なった', icon: 'heart', mood: 'good', big: 2 },
    { at: [12 * Y, 25 * Y], p: 0.4, text: 'ねている時間が、一日の ほとんどに なった', icon: 'sleep' },
    { at: [13 * Y, 25 * Y], p: 0.3, need: 'pet', text: '家族が「長生きしてね」と 誕生日を 祝ってくれた', icon: 'cake', mood: 'good', big: 2 },
  ],

  deaths: [
    { at: [0, 6 * M], w: 3, need: 'stray', text: ['寒さと おなかの空きで、ちいさな いのちを 終えた', '病気に かかって、ちいさな いのちを 終えた'] },
    { at: [0, 6 * M], w: 1, need: 'stray', text: 'カラスに ねらわれて、いのちを 終えた' },
    { at: [0, Y], w: 2, need: 'pet', text: 'うまれつき からだが 弱くて、しずかに 眠った' },
    { at: [3 * M, 12 * Y], w: 3, need: 'stray', text: '道路を わたるとき、車に ぶつかって いのちを 終えた' },
    { at: [Y, 12 * Y], w: 2, text: 'ネコの かかりやすい 病気で、いのちを 終えた' },
    { at: [8 * Y, 30 * Y], w: 3, text: '腎臓の 病気で、家族に 見守られて 眠った', need: 'pet' },
    { at: [12 * Y, 30 * Y], w: 5, text: '日だまりの中で、しずかに 眠るように いのちを 終えた' },
  ],

  titles: [
    { need: 'rescued', text: 'のらから 家ネコに なった 幸運のネコ' },
    { stat: { kittens: 10 }, text: '{kittens}匹の 母になった 大家族のネコ' },
    { need: 'pet', long: 0.1, text: 'みんなに 愛された 長生きの {name}' },
    { need: 'stray', long: 0.1, text: '路地の 主（ぬし）と よばれた ネコ' },
    { short: 0.9, need: 'stray', text: 'ほんの すこしだけ 世界を 見た 子ネコ' },
  ],

  facts: [
    'ネコは 1日に 12〜16時間ほど 眠ります',
    '日本の 飼いネコの 平均寿命は 約15〜16歳です（ペットフード協会の調査）',
    '外で うまれた 子ネコは、半年までに 4匹に3匹が いなくなる という調査があります',
    'ネコの「ゴロゴロ」は、うれしいときだけでなく 具合が悪いときにも 出ます',
  ],

  sources: [
    'https://petfood.or.jp/data/chart2023/ (全国犬猫飼育実態調査 2023・平均寿命)',
    'https://doi.org/10.2460/javma.2004.225.1399 (Nutter et al. 2004 野外の子ネコの生存)',
  ],
};
