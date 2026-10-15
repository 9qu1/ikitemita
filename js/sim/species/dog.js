// イヌ（飼いイヌと、村や町で自由にくらすイヌ）
//   世界のイヌは 7億〜9億頭。そのうち約4分の3が、家の外で自由にくらすイヌ（free-ranging dog）
//   ここでは 飼いイヌ 3割・村や町のイヌ 7割にした（ほんとうの割合に近い）
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

export default {
  id: 'dog',
  name: 'イヌ',
  kind: 'animal',
  weight: 1.2,
  realCount: 9e8, // 世界に 7億〜9億頭（Free-ranging dog の推定）
  refDays: 16 * Y,
  habitat: 'home',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で うまれた', '{place}で、きょうだいと いっしょに うまれた'],

  variants: [
    {
      id: 'house', label: '飼いイヌ', w: 0.3, habitat: 'home', tags: ['pet'],
      names: ['ポチ', 'ハチ', 'コロ', 'モモ', 'ソラ', 'マロン', 'チョコ', 'レオ', 'ココ', 'ムギ', 'リク', 'サクラ', 'コタロウ', 'ナナ'],
      places: [
        { text: '日本の 住宅地の家', lat: 35.6, lon: 139.6 },
        { text: 'アメリカの 郊外の家', lat: 39.96, lon: -83.0 },
        { text: 'イギリスの いなかの家', lat: 51.75, lon: -1.26 },
        { text: 'フランスの アパート', lat: 48.86, lon: 2.35 },
        { text: 'ブラジルの 家', lat: -23.55, lon: -46.63 },
        { text: 'オーストラリアの 家', lat: -33.87, lon: 151.21 },
      ],
      // 飼いイヌ: 日本の平均寿命 14.6歳（ペットフード協会 2023）・イギリスの中央値 12.5歳（2024 の50万頭の調査）
      // うまれてすぐの子イヌの死も少し入れる
      survival: [[0, 1], [W, 0.95], [2 * M, 0.93], [Y, 0.92], [3 * Y, 0.9], [6 * Y, 0.86], [8 * Y, 0.81], [10 * Y, 0.72], [12 * Y, 0.58], [13 * Y, 0.49], [14 * Y, 0.4], [15 * Y, 0.3], [16 * Y, 0.2], [17 * Y, 0.12], [18 * Y, 0.065], [20 * Y, 0.015], [22 * Y, 0.003], [25 * Y, 0]],
    },
    {
      id: 'free', label: '村や町のイヌ', w: 0.7, habitat: 'village', tags: ['free'], refDays: 9 * Y,
      places: [
        { text: 'インドの 町の 路地', lat: 22.57, lon: 88.36 },
        { text: 'タンザニアの 村', lat: -1.87, lon: 34.7 },
        { text: 'メキシコの 山の村', lat: 17.06, lon: -96.73 },
        { text: 'タイの お寺のそば', lat: 13.75, lon: 100.49 },
        { text: 'ネパールの 山の村', lat: 27.7, lon: 85.32 },
        { text: 'トルコの 港町の 通り', lat: 41.01, lon: 28.98 },
      ],
      // インドの5年の調査: 子イヌのうち 繁殖できる年齢（7か月）まで生きたのは 約19%（Paul ほか 2016）
      // おとなになってからは 1年に4匹に1匹ほどがいなくなる（村のイヌの平均寿命 1〜3.5年の調査が多い）
      survival: [[0, 1], [W, 0.88], [M, 0.62], [3 * M, 0.36], [7 * M, 0.21], [Y, 0.18], [2 * Y, 0.135], [3 * Y, 0.1], [5 * Y, 0.055], [7 * Y, 0.027], [9 * Y, 0.011], [11 * Y, 0.004], [13 * Y, 0.001], [15 * Y, 0]],
    },
  ],

  stages: [
    { id: 'puppy', name: '子イヌ', from: 0, sprite: 'dog', scale: 0.55 },
    { id: 'adult', name: 'おとなのイヌ', from: Y, sprite: 'dog', scale: 1, say: 'りっぱな おとなの イヌに なった', icon: 'star' },
    { id: 'senior', name: 'シニアのイヌ', from: 9 * Y, sprite: 'dog', scale: 0.95, say: '口の まわりの 毛が 白く なってきた', icon: 'sleep' },
  ],

  stats: [
    { id: 'walks', label: '散歩', unit: '回' },
    { id: 'pups', label: '子イヌ', unit: '匹' },
    { id: 'friends', label: 'イヌのともだち', unit: '匹' },
  ],

  events: [
    // 子イヌのころ（みんな）
    { at: [10 * D, 14 * D], text: 'はじめて 目が ひらいた', icon: 'look', big: 1 },
    { at: [2 * W, 3 * W], p: 0.8, text: '耳が 聞こえるように なり、物音に ぴくっとした', icon: 'music' },
    { at: [3 * W, 6 * W], p: 0.85, text: ['よちよち歩きで、きょうだいの しっぽを 追いかけた', 'きょうだいと 耳を かみあって あそんだ'], icon: 'ball', mood: 'good' },
    { at: [5 * W, 8 * W], p: 0.8, text: '母イヌの おっぱいを 卒業して、ごはんを 食べはじめた', icon: 'apple' },
    { at: [4 * M, 7 * M], p: 0.9, text: '子イヌの 歯が ぬけて、おとなの 歯に はえかわった', icon: 'sprout' },

    // 飼いイヌ
    { at: [2 * M, 3 * M], p: 0.9, need: 'pet', text: '新しい 家族の もとへ やってきた', icon: 'house', mood: 'good', big: 2, set: 'adopted' },
    { at: [2 * M, 3 * M], p: 0.9, need: 'adopted', text: '名前は「{name}」に なった', icon: 'heart', mood: 'good', big: 1 },
    { at: [2 * M, 4 * M], p: 0.85, need: 'pet', text: 'ワクチンの 注射で、ちょっとだけ ないた', icon: 'bandage' },
    { at: [3 * M, 5 * M], p: 0.85, need: 'pet', text: 'はじめての 散歩で、草の においを かぎまくった', icon: 'flower', mood: 'good', big: 1, set: 'walker' },
    { at: [3 * M, 7 * M], p: 0.6, need: 'pet', text: '家族の くつを かじって、しかられた', icon: 'alert' },
    { at: [3 * M, 8 * M], p: 0.7, need: 'pet', text: ['「おすわり」と「お手」を おぼえた', '「まて」が できて、ほめられた'], icon: 'star', mood: 'good' },
    { at: [6 * M, Y], p: 0.6, need: 'pet', text: '病院で 不妊・去勢の 手術を うけた', icon: 'bandage', set: 'fixed' },
    { at: [6 * M, 17 * Y], repeat: [3, 7], need: 'walker', text: ['朝の 散歩で、いつもの 電柱の においを かいだ', '雨の日の 散歩で、どろだらけに なった', '夕やけの 道を、家族と ゆっくり 歩いた', '落ち葉の 道を、はねるように 歩いた'], icon: 'sun', mood: 'good', add: { walks: [150, 600] } },
    { at: [6 * M, 6 * Y], p: 0.5, need: 'pet', text: 'ドッグランで、イヌの ともだちが できた', icon: 'friends', mood: 'good', add: { friends: 1 } },
    { at: [6 * M, 12 * Y], p: 0.4, need: 'pet', text: 'かみなりの 音に おどろいて、ソファの下に かくれた', icon: 'rain', mood: 'hard' },
    { at: [Y, 12 * Y], p: 0.35, need: 'pet', text: '家族の 子どもが 帰るのを、まどべで 待った', icon: 'school', mood: 'good', big: 2 },
    { at: [Y, 10 * Y], p: 0.35, need: 'pet', text: '海に 連れていってもらい、はじめて 波と あそんだ', icon: 'drop', mood: 'good', big: 1 },
    { at: [Y, 12 * Y], p: 0.4, need: 'pet', text: 'ごはんの 時間に なると、お皿の 前で しっぽを ふった', icon: 'apple', mood: 'good' },
    { at: [Y, 12 * Y], p: 0.2, need: 'pet', text: '散歩中に まいごに なり、近所の人に 見つけてもらった', icon: 'look', mood: 'hard', big: 1 },
    { at: [Y, 8 * Y], repeat: [1, 2], p: 0.5, need: ['pet', 'f', '!fixed'], text: '{n}匹の 子イヌを うんだ', icon: 'baby', mood: 'good', big: 3, add: { pups: [3, 8] }, set: 'mother' },
    { at: [9 * Y, 22 * Y], p: 0.6, need: 'pet', text: '散歩の 道のりが、すこし 短く なった', icon: 'sleep' },
    { at: [10 * Y, 22 * Y], p: 0.35, need: 'pet', text: '家族が「長生きしてね」と ケーキで 祝ってくれた', icon: 'cake', mood: 'good', big: 2 },
    { at: [11 * Y, 22 * Y], p: 0.4, need: 'pet', text: '耳が 遠くなり、ねている 時間が ふえた', icon: 'sleep' },

    // 村や町のイヌ
    { at: [0, D], p: 0.6, need: 'free', text: 'うまれたのは、母イヌが 見つけた 物かげの 巣だった', icon: 'box' },
    { at: [3 * W, 6 * W], p: 0.6, need: 'free', text: '近所の 人が、子イヌたちに ごはんを くれた', icon: 'apple', mood: 'good', big: 1 },
    { at: [M, 3 * M], p: 0.35, need: 'free', text: '大雨で 巣が 水びたしに なった', icon: 'rain', mood: 'hard' },
    { at: [M, 4 * M], p: 0.45, need: 'free', text: '車の 音に びっくりして、母イヌの うしろに かくれた', icon: 'alert', mood: 'hard' },
    { at: [3 * M, 6 * M], p: 0.6, need: 'free', text: '母イヌと はなれて、自分で ごはんを さがしはじめた', icon: 'apple', big: 1 },
    { at: [3 * M, 2 * Y], p: 0.45, need: 'free', text: '村の 人に、病気を ふせぐ 注射を 打ってもらった', icon: 'bandage', mood: 'good' },
    { at: [4 * M, 8 * Y], p: 0.5, need: 'free', text: '市場の うら手で、魚の あまりを もらうのが 日課に なった', icon: 'fish', mood: 'good' },
    { at: [6 * M, 8 * Y], p: 0.6, need: 'free', text: '{n}匹の なかまと 群れを つくった', icon: 'friends', mood: 'good', big: 1, add: { friends: [2, 6] }, set: 'pack' },
    { at: [6 * M, 8 * Y], p: 0.5, need: 'pack', text: 'となりの 群れと、なわばりを めぐって ほえあった', icon: 'alert', mood: 'hard' },
    { at: [6 * M, 10 * Y], p: 0.4, need: 'free', text: 'お寺の 日かげで、ゆっくり 昼寝を した', icon: 'sleep', mood: 'good' },
    { at: [6 * M, 10 * Y], p: 0.4, need: 'free', text: '知らない 人が 来ると、ほえて 村に 知らせた', icon: 'house', big: 1 },
    { at: [6 * M, 8 * Y], p: 0.35, need: 'free', text: '車の 少ない すきに 道路を わたる コツを おぼえた', icon: 'look' },
    { at: [7 * M, 8 * Y], repeat: [1, 4], need: ['free', 'f'], text: ['{n}匹の 子イヌを うんだ', '道ばたの 物かげで、{n}匹の 子イヌを うんだ'], icon: 'baby', mood: 'good', big: 3, add: { pups: [3, 7] }, set: 'mother' },
    { at: [Y, 8 * Y], p: 0.3, need: 'free', text: '暑い 日は、店の 前の つめたい ゆかで ねそべった', icon: 'sun', mood: 'good' },
    { at: [Y, 8 * Y], p: 0.3, need: 'free', text: 'けんかで 足を けがして、しばらく 引きずった', icon: 'bandage', mood: 'hard' },
    { at: [Y, 10 * Y], p: 0.25, need: 'free', text: '地域の 人たちに、首輪を つけてもらった', icon: 'gift', mood: 'good', big: 1 },
    { at: [Y, 8 * Y], p: 0.12, need: 'free', text: 'やさしい 家族に ひろわれて、飼いイヌに なった', icon: 'house', mood: 'good', big: 3, set: 'rescued', move: 'home' },
    { at: [6 * Y, 14 * Y], p: 0.4, need: 'pack', text: '若い イヌたちに、なわばりを ゆずった', icon: 'feather' },

    // みんな
    { at: [6 * M, 10 * Y], p: 0.4, text: ['土を ほって、大事な ものを うめた', '自分の しっぽを 追いかけて、ぐるぐる 回った'], icon: 'ball', mood: 'good' },
    { at: [Y, 12 * Y], p: 0.3, text: 'ネコと 目が あって、おたがいに 動けなくなった', icon: 'look' },
    { at: [2 * Y, 14 * Y], p: 0.3, text: 'おなかを こわして、何日か 元気が なかった', icon: 'bandage', mood: 'hard' },
  ],

  deaths: [
    { at: [0, 3 * M], w: 3, need: 'free', text: ['寒さと おなかの空きで、ちいさな いのちを 終えた', '病気に かかって、ちいさな いのちを 終えた'] },
    { at: [0, 7 * M], w: 2, need: 'free', text: '道路に 出てしまい、車に ぶつかって いのちを 終えた' },
    { at: [0, 2 * M], w: 2, need: 'pet', text: 'うまれつき からだが 弱くて、しずかに 眠った' },
    { at: [7 * M, 15 * Y], w: 3, need: ['free', '!rescued'], text: '道路を わたるとき、車に ぶつかって いのちを 終えた' },
    { at: [7 * M, 15 * Y], w: 3, need: ['free', '!rescued'], text: 'イヌの かかりやすい 重い 病気で、いのちを 終えた' },
    { at: [2 * M, 15 * Y], w: 1, need: ['free', '!rescued'], text: '野生の どうぶつに おそわれて、いのちを 終えた' },
    { at: [6 * Y, 30 * Y], w: 4, need: ['free', '!rescued'], text: 'なれた 道の 日だまりで、しずかに いのちを 終えた' },
    { at: [2 * M, 10 * Y], w: 1, need: 'pet', text: '急な 病気で、家族に 見守られて 眠った' },
    { at: [8 * Y, 30 * Y], w: 3, need: 'pet', text: '心臓の 病気で、家族に 見守られて 眠った' },
    { at: [8 * Y, 30 * Y], w: 3, need: 'pet', text: 'がんの 病気で、家族に だかれて 眠った' },
    { at: [Y, 30 * Y], w: 3, need: 'rescued', text: 'ひろってくれた 家族の そばで、しずかに 眠った' },
    { at: [12 * Y, 30 * Y], w: 5, need: 'pet', text: 'お気に入りの 毛布の上で、眠るように いのちを 終えた' },
  ],

  titles: [
    { need: 'rescued', text: '外の くらしから 家族の 一員に なった イヌ' },
    { stat: { pups: 15 }, text: '{pups}匹の 子イヌの 母に なった イヌ' },
    { need: ['free', 'mother'], text: '道ばたで 子どもたちを 育てた 母イヌ' },
    { need: 'pet', stat: { walks: 3000 }, text: '{walks}回の 散歩を 楽しんだ {name}' },
    { need: 'pet', long: 0.1, text: 'みんなに 愛された 長生きの {name}' },
    { need: 'free', long: 0.03, text: '町じゅうの 人に 知られた 長老イヌ' },
    { need: 'free', short: 0.6, text: 'ほんの すこしだけ 道ばたの 世界を 見た 子イヌ' },
  ],

  facts: [
    '世界の イヌは 7億〜9億頭ほどで、その 約4分の3は 家の外で 自由に くらしている と 言われています',
    'インドの 調査では、町で うまれた 子イヌのうち 子どもを うめる 年まで 生きたのは 約5匹に1匹でした',
    '日本の 飼いイヌの 平均寿命は 約14.6歳です（ペットフード協会の調査）',
    'イヌの 鼻の もようは 1匹ずつ ちがい、ひとの 指の もようのように 見分けに 使えます',
    'イヌは あせで 体を 冷やすのが にがてで、舌を 出して ハアハアすることで 熱を にがします',
  ],

  sources: [
    'https://petfood.or.jp/data/chart2023/ (全国犬猫飼育実態調査 2023・犬の平均寿命 14.62歳)',
    'https://www.ljmu.ac.uk/about-us/news/articles/2024/2/1/dog-longevity (イギリス 50万頭超・寿命の中央値 12.5歳 Scientific Reports 2024)',
    'https://doi.org/10.1038/srep19641 (Paul ほか 2016 インドの自由にくらす子イヌ・繁殖年齢まで約19%)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC5125679 (タンザニアの村のイヌ 2016・死亡時の平均25.8か月・1腹 平均4.9匹)',
    'https://en.wikipedia.org/wiki/Free-ranging_dog (世界のイヌ 7億〜9億頭・約75%が自由にくらす)',
  ],
};
