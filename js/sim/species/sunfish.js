// マンボウ（書き方は CONTENT.md）
import { H, D, W, M, Y } from '../units.js?v=1.0.1';

export default {
  id: 'sunfish',
  name: 'マンボウ',
  kind: 'animal',
  weight: 1.1,
  // 世界の数を数えた資料はない。北東大西洋 約30万km²で 夏 約1.3万匹（Breen ほか 2017）、
  // 西地中海では 100km²あたり 最大475匹（Grémillet ほか 2017）。温帯〜熱帯の 海の広さから、大きな個体で 500万匹ほどの目安
  realCount: 5e6,
  refDays: 15 * Y, // 野生の寿命は わかっていない。水族館の成長の記録から 3mで 約20歳と計算（Nakatsubo 2008）
  habitat: 'ocean',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で、たまごとして うまれた', '{place}で、ちいさな たまごとして うまれた'],

  variants: [
    {
      id: 'wild', label: 'マンボウ', w: 1, habitat: 'ocean',
      // どこで たまごを うむかは よく わかっていない。房総沖は 8〜9月に 産卵していると考えられる場所（Nakatsubo 2008）、
      // サルガッソー海と 地中海は 赤ちゃんが とれた 海（Schmidt 1921）
      places: [
        { text: '日本の 房総半島の 沖', lat: 34.9, lon: 140.3 },
        { text: '北大西洋の サルガッソー海', lat: 28.0, lon: -62.0 },
        { text: '地中海の 沖', lat: 38.5, lon: 5.0 },
      ],
      // 1匹の体に 数億個の たまご（Guinness・FishBase）→ 本当は おとなに なれるのは 何千万〜何億匹に1匹ほど。
      // それでは 窓に 大きな マンボウが ほぼ 出てこないので、1年まで 生きる割合を 約0.3%（330匹に1匹）に 大きく 多めにしてある。
      // おとなに なってからは 長生きで、3mの個体は 約20歳（Nakatsubo 2008 の成長の式）
      survival: [[0, 1], [D, 0.55], [4 * D, 0.2], [2 * W, 0.05], [M, 0.018], [3 * M, 0.008], [6 * M, 0.0048], [Y, 0.003], [3 * Y, 0.0018], [7 * Y, 0.001], [12 * Y, 0.0005], [20 * Y, 0.00012], [30 * Y, 0]],
    },
  ],

  // 成長は 水族館の記録の式（Nakatsubo 2008）で: 1歳 約40cm・3歳 約1.1m・7歳 約2m・20歳 約3m
  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25 },
    // ふ化までの 日数は よく わかっていない（フグの なかまの 浮く たまごの 目安で 4日）
    { id: 'larva', name: 'トゲトゲの 赤ちゃん', from: 4 * D, sprite: 'sunfish', scale: 0.25, say: 'たまごから、金平糖みたいな トゲトゲの 赤ちゃんが かえった', icon: 'egg', big: 2 },
    // トゲが なくなる 時期も 目安
    { id: 'young', name: '子ども', from: 3 * M, sprite: 'sunfish', scale: 0.45, say: 'トゲが なくなって、マンボウらしい 形に なった', icon: 'star', big: 2 },
    { id: 'big', name: 'わかもの', from: 3 * Y, sprite: 'sunfish', scale: 0.75, say: 'からだが 1メートルを こえた', icon: 'star', big: 1 },
    { id: 'adult', name: 'おとな', from: 7 * Y, sprite: 'sunfish', scale: 1, say: 'からだが 2メートルを こえる 大きさに なった', icon: 'crown', big: 2 },
  ],

  stats: [
    { id: 'bask', label: '海面での 日光浴', unit: '回' },
    { id: 'clean', label: 'そうじして もらった', unit: '回' },
  ],

  events: [
    // たまご
    { at: [0, 3 * H], p: 0.9, text: 'たまごは 海に ぷかぷか 浮かんで 流れた', icon: 'drop' },
    { at: [H, 12 * H], p: 0.8, text: 'まわりには、数えきれないほどの たまごが 浮かんでいた', icon: 'egg', big: 1 },
    { at: [3 * H, D], p: 0.6, text: ['朝日が さしこんで、海が 青く 光った', '月の 光が、ゆらゆら 海に とどいた'], icon: 'sun', mood: 'good' },
    { at: [6 * H, 2 * D], p: 0.7, text: 'たまごの中で、小さな からだが できはじめた', icon: 'look', big: 1 },
    { at: [D, 4 * D], p: 0.4, text: 'プランクトンを 食べる 魚の むれが 通りすぎた', icon: 'alert', mood: 'hard' },
    { at: [2 * D, 4 * D], p: 0.6, text: 'たまごの中で、ぴくっと からだを 動かした', icon: 'sprout', big: 1 },

    // トゲトゲの 赤ちゃん
    { at: [4 * D, 2 * W], p: 0.8, text: 'はじめて 小さな プランクトンを 食べた', icon: 'apple', mood: 'good', big: 1 },
    { at: [4 * D, 2 * M], p: 0.6, text: 'トゲトゲの からだで、波に ゆられて ただよった', icon: 'drop' },
    { at: [W, 2 * M], p: 0.4, text: 'マグロの むれに 出くわして、こわい 思いをした', icon: 'alert', mood: 'hard' },
    { at: [W, 2 * M], p: 0.3, text: '海鳥の くちばしから、ぎりぎり にげた', icon: 'alert', mood: 'hard' },
    { at: [2 * W, 3 * M], repeat: [1, 2], text: ['あたたかい 海流に のって、遠くへ 運ばれた', '夜の 海で、光る プランクトンに かこまれた', 'ほかの 魚の 赤ちゃんに まじって ただよった'], icon: 'drop' },
    { at: [M, 3 * M], p: 0.5, text: 'からだが 1センチを こえた', icon: 'sprout', big: 1 },

    // 子ども
    { at: [3 * M, 2 * Y], p: 0.7, text: 'クラゲを 見つけて、ちゅるっと 食べた', icon: 'apple', mood: 'good', big: 1 },
    { at: [6 * M, 3 * Y], p: 0.3, text: 'アシカに 見つかって、追いかけまわされた', icon: 'alert', mood: 'hard' },
    { at: [Y, 2 * Y], p: 0.9, text: '1年で、からだが 40センチほどに なった', icon: 'star', big: 1 },
    { at: [6 * M, 15 * Y], p: 0.3, text: 'ダイバーたちが、目を まるくして ついてきた', icon: 'look', mood: 'good' },

    // 海面で 日光浴・そうじ
    { at: [Y, 25 * Y], repeat: [2, 4], text: ['海面で 横になって、のんびり 日光浴', '深く もぐったあと、海面で 横になって あたたまった', '横だおしに ぷかぷか 浮いて、空を ながめた'], icon: 'sun', mood: 'good', add: { bask: [20, 150] } },
    { at: [Y, 25 * Y], p: 0.7, text: 'カモメが 来て、からだの 寄生虫を つついて とってくれた', icon: 'feather', mood: 'good', big: 2, add: { clean: 1 } },
    { at: [2 * Y, 25 * Y], p: 0.5, text: '海藻の 林の そばで、小魚に からだを そうじしてもらった', icon: 'friends', mood: 'good', big: 1, add: { clean: [1, 5] } },
    { at: [2 * Y, 25 * Y], p: 0.4, text: 'サンゴ礁の そうじ場に ならんで、順番を 待った', icon: 'look', mood: 'good', big: 1, add: { clean: 1 }, move: 'reef', set: 'atreef' },
    { at: [3 * Y, 25 * Y], p: 0.9, need: 'atreef', text: 'そうじが すんで、また ひろい 海へ もどった', icon: 'drop', move: 'ocean' },
    { at: [5 * Y, 25 * Y], p: 0.3, text: 'からだに、何十しゅるいもの 寄生虫が すみついていた', icon: 'bandage', mood: 'hard' },

    // ひろい 海での くらし
    { at: [Y, 25 * Y], p: 0.6, text: '200メートルの 深さまで もぐって、クダクラゲを 食べた', icon: 'apple', mood: 'good', big: 1 },
    { at: [2 * Y, 25 * Y], p: 0.3, text: 'まっくらな 深い 海まで、何百メートルも もぐった', icon: 'drop', big: 1 },
    { at: [Y, 20 * Y], p: 0.5, text: '夏、あたたかい 海流に のって 北の 海へ 旅をした', icon: 'plane' },
    { at: [Y, 15 * Y], p: 0.3, text: '海面から からだを 出して、大きく ジャンプした', icon: 'star', mood: 'good', big: 1 },
    { at: [2 * Y, 25 * Y], p: 0.35, text: 'せびれを 水面に 出して 泳いだら、サメと まちがえられた', icon: 'alert' },
    { at: [Y, 15 * Y], p: 0.3, text: '定置網に 入ったが、漁師さんが 海へ もどしてくれた', icon: 'heart', mood: 'good', big: 2 },
    { at: [Y, 15 * Y], p: 0.25, text: '海に ただよう ふくろを、クラゲと まちがえそうに なった', icon: 'alert', mood: 'hard' },
    { at: [2 * Y, 25 * Y], p: 0.3, text: 'シャチの むれが、すぐ 近くを 通りすぎた', icon: 'alert', mood: 'hard' },
    { at: [2 * Y, 25 * Y], p: 0.25, text: '大きな 船の 音に おどろいて、深く もぐった', icon: 'alert', mood: 'hard' },

    // おとな
    { at: [7 * Y, 25 * Y], p: 0.85, need: 'f', text: '夏の おわり、数えきれない たまごを 海に うんだ', icon: 'egg', mood: 'good', big: 3, set: 'parent' },
    { at: [7 * Y, 25 * Y], p: 0.8, need: 'm', text: 'たまごを うむ メスの そばで、子どもを のこした', icon: 'heart', mood: 'good', big: 3, set: 'parent' },
    { at: [9 * Y, 28 * Y], p: 0.5, need: 'parent', text: 'ことしの 夏も、たまごの 季節を むかえた', icon: 'egg', mood: 'good', big: 1 },
    { at: [15 * Y, 30 * Y], p: 0.5, need: 'f', text: 'からだが 3メートル ちかくまで 大きく なった', icon: 'crown', mood: 'good', big: 2 },
    { at: [12 * Y, 30 * Y], p: 0.5, text: 'ひろい 海を、もう 何年も 旅してきた', icon: 'plane', mood: 'good', big: 1 },
  ],

  deaths: [
    { at: [0, 4 * D], w: 5, text: ['たまごのまま、プランクトンを 食べる 魚に 食べられた', 'たまごのまま、海の中で ちいさな いのちを 終えた'] },
    { at: [4 * D, 3 * M], w: 6, text: ['食べものに 出会えず、海を ただよいながら 眠った', 'マグロに 食べられて、ちいさな いのちを 終えた'] },
    { at: [W, 6 * M], w: 1, text: '海鳥に つかまって、いのちを 終えた' },
    { at: [3 * M, 5 * Y], w: 2, text: 'アシカに 追いかけられて、いのちを 終えた' },
    { at: [Y, 30 * Y], w: 2, text: '大きな 網に かかって、いのちを 終えた' },
    { at: [2 * Y, 30 * Y], w: 2, text: 'シャチに 見つかって、いのちを 終えた' },
    { at: [Y, 30 * Y], w: 1, text: 'ふくろを クラゲと まちがえて 食べ、弱ってしまった' },
    { at: [Y, 30 * Y], w: 1, text: '船に ぶつかって、いのちを 終えた' },
    { at: [10 * Y, 40 * Y], w: 5, text: ['ひろい 海を ただよいながら、しずかに 眠った', '深い 海へ しずむように、しずかに いのちを 終えた'] },
  ],

  titles: [
    { need: ['f', 'parent'], text: '数えきれない たまごを うんだ 海の 母' },
    { need: ['m', 'parent'], text: '海の 果てまで 旅した 大きな お父さん' },
    { stat: { bask: 300 }, text: '海面で {bask}回 日光浴した のんびりや' },
    { minAge: Y, long: 0.0006, text: 'たくさんの きょうだいから 生き残った マンボウ' },
    { minAge: Y, maxAge: 7 * Y, text: 'ひろい 海を ゆうゆうと 泳いだ わかもの' },
    { maxAge: 4 * D, text: '海に 浮かんだ ちいさな たまご' },
    { minAge: 4 * D, maxAge: 3 * M, text: 'トゲトゲの からだで 海を ただよった いのち' },
    { minAge: 3 * M, maxAge: Y, text: 'マンボウの 形に なれた 小さな いのち' },
  ],

  facts: [
    'メス1匹の 体の中に、約3億個の たまごが あった という記録が あります（まだ おとなに なりきっていない 個体の 数です）',
    'うまれたての 赤ちゃんは 数ミリで、トゲトゲの 金平糖のような 形を しています',
    '海面で 横になるのは、深く もぐって 冷えた からだを あたためるため という研究が あります',
    '海面で 横になっているとき、カモメに 寄生虫を とってもらうことが あると 言われています',
    '野生での 寿命は よく わかっていません。水族館の 成長の 記録から、3メートルの マンボウは 20歳くらいと 計算されています',
  ],

  sources: [
    'https://www.fishbase.se/summary/1732 (FishBase・3億個の たまご・最大333cm・水深〜1515m・アシカに食べられる)',
    'https://www.guinnessworldrecords.com/world-records/69443-most-fertile-fish (ギネス・卵巣に 約3億個・1920年代の記録・種が はっきりしない)',
    'https://oceansunfish.org/NakatsuboDissertationsSum.pdf (Nakatsubo 2008・成長の式・3mで約20歳・2m超えに7年以上・関東の産卵は8月末〜9月末・多産の記録は未成熟の個体)',
    'https://www.sciencenews.org/blog/wild-things/lazy-sunfish-are-actually-active-predators (Nakamura ほか 2015・深く もぐって クダクラゲを食べ、海面で あたたまる)',
    'https://www.scubadiving.com/rare-sightings-mola-molas (海藻の林や サンゴ礁の そうじ場・カモメ・寄生虫 約40種)',
    'https://nazology.kusuguru.co.jp/archives/65098 (澤井悦郎「マンボウのひみつ」の紹介・3億個は 体の中の数で 全部 うまれるわけではない・日光浴の理由)',
    'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5435681/ (Breen ほか 2017・北東大西洋の数)',
    'https://www.nature.com/articles/107076a0 (Schmidt 1921・Dana 号で とれた 赤ちゃん)',
  ],
};
