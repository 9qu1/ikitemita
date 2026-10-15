// カゲロウ（モンカゲロウなど。書き方は CONTENT.md・見本は cat.js）
//   5月ごろ 川に うみおとされた たまごから始まる一生にしている。
//   モンカゲロウは 1年に1世代: 7〜8月に 小さな幼虫が あらわれ、川底の 砂に もぐって 育ち、次の 5月ごろ 羽化する（Kuroda ほか 1984）
//   羽化すると まず 羽のある「亜成虫」になり、ふつう 1日ほどで もう一度 脱皮して 成虫になる。
//   成虫は 口が 退化していて 何も食べず、数時間〜数日で 一生を終える
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

const EM = 358; // 羽化（亜成虫になる）日。たまごから 約1年（窓の すがたは年齢で決まるので、みな同じ日にしている）

export default {
  id: 'mayfly',
  name: 'カゲロウ',
  kind: 'bug',
  weight: 1,
  // カゲロウのなかま（世界に約3000種）全体の数の目安。世界の数を数えた資料はない。
  //   アメリカ・エリー湖では 1回の羽化で 最大 約880億匹が レーダーで 数えられた（Stepanian ほか 2020）。
  //   川や湖の 幼虫を ふくめ、控えめに 100兆匹とした
  realCount: 1e14,
  refDays: Y,
  habitat: 'river',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 水面に、たまごとして おとされた', '{place}で、数千この きょうだいと いっしょに うまれた'],

  variants: [
    {
      id: 'base', label: 'カゲロウ', w: 1, habitat: 'river',
      places: [
        { text: '日本の 山あいの 川', lat: 35.79, lon: 139.2 },
        { text: '日本の 四万十川', lat: 33.21, lon: 132.94 },
        { text: '日本の 千曲川の 上流', lat: 36.25, lon: 138.45 },
        { text: '日本の 香川県の 谷川', lat: 34.2, lon: 133.95 },
        { text: '韓国の 山あいの 川', lat: 37.75, lon: 128.0 },
        { text: 'イギリスの 小川', lat: 51.1, lon: -1.5 },
      ],
      // 生き残り: カナダの 川の 調査で「亜成虫 1匹が 育つのに 平均 934この たまご」→ 羽化できるのは 約0.11%（Corkum ほか）
      //   たまご: 流される・食べられる・かびで 半分ほどが かえれない
      //   幼虫: 魚・カワゲラの幼虫・大水などで、夏〜秋の 小さいうちに 大半が いなくなる
      //   羽化の しゅんかんも 魚や 鳥に ねらわれ、亜成虫 → 成虫で さらに へる。成虫は 数日のうちに みな 一生を終える
      survival: [[0, 1], [W, 0.85], [5 * W, 0.5], [2 * M, 0.2], [3 * M, 0.08], [5 * M, 0.03], [8 * M, 0.008], [11 * M, 0.0025], [EM, 0.0011], [EM + 6 * H, 0.0008], [EM + D, 0.0006], [EM + 1.5 * D, 0.0003], [EM + 2.5 * D, 0.00006], [EM + 4 * D, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.2 },
    { id: 'nymph', name: '幼虫', from: 5 * W, sprite: 'nymph', scale: 0.3, say: 'たまごから、ちいさな 幼虫が かえった', icon: 'egg', big: 2 },
    { id: 'nymph2', name: '大きな 幼虫', from: 6 * M, sprite: 'nymph', scale: 0.5, say: 'せなかに、羽の もとが ふくらんできた', icon: 'star' },
    { id: 'subimago', name: '亜成虫', from: EM, sprite: 'mayfly', scale: 0.85, say: '水面で からを ぬいで、羽のある 亜成虫に なった', icon: 'star', big: 3 },
    { id: 'imago', name: 'カゲロウ', from: EM + D, sprite: 'mayfly', scale: 1, say: 'もう一度 脱皮して、すきとおった 羽の 成虫に なった', icon: 'star', big: 3 },
  ],

  stats: [
    { id: 'molts', label: '脱皮', unit: '回' },
    { id: 'eggs', label: 'うんだ たまご', unit: 'こ' },
  ],

  events: [
    // たまご
    { at: [H, 2 * D], text: ['水の 中を ゆらゆら しずんで、川底の 砂に ついた', '川底の 石に、ぺたりと くっついた'], icon: 'drop' },
    { at: [3 * D, 4 * W], p: 0.4, text: 'たまごの 中に、目の 点が 見えてきた', icon: 'look' },
    { at: [2 * D, 4 * W], p: 0.35, text: '大雨の にごり水で、たまごごと 川下へ ながされた', icon: 'rain', mood: 'hard' },
    { at: [D, 4 * W], p: 0.3, text: '小さな ヨコエビが、となりの たまごを かじっていった', icon: 'alert', mood: 'hard' },

    // 幼虫（夏〜秋〜冬〜春）
    { at: [5 * W, 3 * M], p: 0.8, text: '砂に トンネルを ほって、もぐって くらしはじめた', icon: 'box', big: 1 },
    { at: [6 * W, 11 * M], p: 0.6, text: 'おなかの えらを ぱたぱた 動かして、水を おくった', icon: 'drop' },
    { at: [6 * W, 11 * M], repeat: [1, 2], text: ['砂に まじった 落ち葉の かけらを 食べた', '川底の 小さな ごみを こして 食べた'], icon: 'apple' },
    { at: [2 * M, 11 * M], repeat: [2, 4], text: ['脱皮を {n}回 かさねて、ひとまわり 大きくなった', '{n}回 脱皮して、古い からを 砂に のこした'], icon: 'star', add: { molts: [2, 5] } },
    { at: [M, 3 * M], p: 0.35, text: 'すぐ 上を、水あそびの 子どもの 足が 通りすぎた', icon: 'sun' },
    { at: [2 * M, 10 * M], p: 0.4, text: '川魚の かげが 通りすぎて、砂に ふかく もぐった', icon: 'fish', mood: 'hard' },
    { at: [2 * M, 10 * M], p: 0.35, text: 'カワゲラの 幼虫に ねらわれて、トンネルに にげこんだ', icon: 'alert', mood: 'hard' },
    { at: [3 * M, 5 * M], p: 0.35, text: '台風の 大水で、トンネルごと 砂が ながされた', icon: 'rain', mood: 'hard' },
    { at: [3 * M, 9 * M], p: 0.25, text: 'となりの トンネルが、いつのまにか 空っぽに なっていた', icon: 'feather', mood: 'hard' },
    { at: [5 * M, 6.5 * M], p: 0.3, text: '落ち葉が たくさん ながれてきて、ごちそうが ふえた', icon: 'apple', mood: 'good' },
    { at: [6 * M, 9 * M], p: 0.5, text: '冬の 川は つめたく、砂の 中で じっと していた', icon: 'snow' },
    { at: [7 * M, 10 * M], p: 0.25, text: 'カワガラスが 川に もぐって、虫を さがしまわった', icon: 'alert', mood: 'hard' },
    { at: [8 * M, 11 * M], p: 0.2, text: '川の 生きもの しらべで すくわれて、そっと もどされた', icon: 'friends', mood: 'good' },
    { at: [9 * M, 11.5 * M], p: 0.35, text: '春の 雪どけ水で、川が にごった', icon: 'drop', mood: 'hard' },
    { at: [10 * M, 11.7 * M], p: 0.6, text: '羽の もとが 黒く なって、羽化の 日が 近づいた', icon: 'look', big: 1 },
    { at: [11.6 * M, EM - 0.05], p: 0.8, text: '夕方、砂から 出て、水面へ のぼっていった', icon: 'drop', big: 1 },

    // 亜成虫（羽化した日）
    { at: [EM, EM + 2 * H], p: 0.5, text: 'マスが 水面を ねらって、しぶきが あがった', icon: 'fish', mood: 'hard' },
    { at: [EM, EM + 3 * H], p: 0.85, text: 'くもった 羽で ふらふら 飛んで、川べりの 木に とまった', icon: 'plane', mood: 'good', big: 1 },
    { at: [EM + 2 * H, EM + 20 * H], p: 0.5, text: '葉の うらで、じっと 夜を あかした', icon: 'sleep' },
    { at: [EM + 3 * H, EM + 20 * H], p: 0.25, text: '橋の 街灯の あかりに、ひきよせられた', icon: 'look' },

    // 成虫（さいごの 数日）
    { at: [EM + D, EM + D + 3 * H], p: 0.7, text: '口は もう、食べるための 形では なかった', icon: 'look' },
    { at: [EM + D, EM + 2.5 * D], need: 'm', p: 0.8, text: '夕ぐれの 川の 上で、なかまと むれを つくって まった', icon: 'friends', mood: 'good', big: 2, set: 'swarm' },
    { at: [EM + D, EM + 2.5 * D], need: ['m', 'swarm'], p: 0.6, text: 'むれの 中で、メスと 出会った', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
    { at: [EM + D, EM + 2.5 * D], need: 'f', p: 0.8, text: 'オスたちの むれの 中へ、まっすぐ 飛びこんだ', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
    { at: [EM + D, EM + 3 * D], need: ['f', 'mated'], p: 0.85, text: '水面に おなかを つけて、{n}この たまごを うんだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [2000, 6000] }, set: 'laid' },
    { at: [EM + D, EM + 3 * D], p: 0.3, text: 'ツバメが、むれの 中を 横ぎっていった', icon: 'alert', mood: 'hard' },
    { at: [EM + D, EM + 3 * D], p: 0.3, text: '橋の 上の 人が「カゲロウの 季節だね」と 見上げた', icon: 'friends' },
  ],

  deaths: [
    { at: [0, 5 * W], w: 3, text: ['小さな 虫に 食べられて、たまごのまま 終わった', 'ながされて、たまごのまま しずかに 眠った'] },
    { at: [0, 5 * W], w: 0.7, text: 'かびに おおわれて、たまごのまま 眠った' },
    { at: [5 * W, EM], w: 3, text: ['川魚に 食べられて、いのちを 終えた', 'カワゲラの 幼虫に つかまって、いのちを 終えた'] },
    { at: [5 * W, EM], w: 1, text: '大水で 砂ごと ながされて、いのちを 終えた' },
    { at: [M, 4 * M], w: 0.3, text: '日照りで 川の 水が へり、砂の 中で 眠った' },
    { at: [EM - 3 * D, EM + 0.5], w: 3, text: ['水面に 出た ところで、マスの ごちそうに なった', '羽化の とちゅうで、からが ぬげずに 眠った'] },
    { at: [EM, EM + 4 * D], w: 2, text: 'ツバメに つかまって、いのちを 終えた' },
    { at: [EM, EM + 4 * D], w: 1, text: '街灯の 下で、朝まで 飛びつづけて 眠った' },
    { at: [EM + D, EM + 4 * D], w: 6, need: 'laid', text: ['たまごを うみおえて、水面に しずかに 横たわった', 'たまごを 川に たくして、ながれに のって 眠った'] },
    { at: [EM + D, EM + 4 * D], w: 5, need: 'm', text: 'むれで まいおえて、川べりの 草で しずかに 眠った' },
  ],

  titles: [
    { need: 'laid', text: '{eggs}この たまごを 川に のこした カゲロウ' },
    { need: 'swarm', text: '夕ぐれの むれで まった、一日だけの おとな' },
    { minAge: EM + D, text: '1年を 水の 中、さいごの 日を 空で すごした' },
    { minAge: EM, maxAge: EM + D, text: '亜成虫のまま 空を 見た カゲロウ' },
    { minAge: 5 * W, maxAge: EM, text: '川の 砂の 中を 知った 幼虫' },
    { maxAge: 5 * W, text: '川底の 砂で ねむった たまご' },
  ],

  facts: [
    'カゲロウは、羽が はえてから もう一度 脱皮する、いまの 虫では ただ ひとつの なかまです',
    '成虫の 口は 退化していて、何も 食べずに 数時間〜数日で 一生を 終えます',
    'カゲロウの なかまは 3億年ほど 前から いる、羽のある 虫の 中でも とても 古い なかまです',
    'カナダの 川の 調査では、亜成虫 1匹が 育つまでに 平均 900こあまりの たまごが 必要だった という報告があります',
    'アメリカの エリー湖では、いっせいに 羽化した カゲロウの 大群が 気象レーダーに うつった という研究があります',
    'アメリカの ある カゲロウの メスは、成虫に なってから 5分も 生きない と言われています',
  ],

  sources: [
    'https://kagawa-u.repo.nii.ac.jp/records/923 (Kuroda ほか 1984: モンカゲロウは1年1世代・7〜8月に加入・翌5月ごろ羽化・香川県 葛谷川)',
    'https://resolve.cambridge.org/core/journals/canadian-entomologist/article/abs/fecundity-of-mayflies-ephemeroptera-with-special-reference-to-mayflies-of-a-brownwater-stream-of-alberta-canada/34B5C2C845B89025E5966C2228073FED (カナダ・アルバータの川: 亜成虫1匹に平均934個の卵)',
    'https://www.newworldencyclopedia.org/entry/Mayflies (羽が使えるようになってから脱皮する唯一の昆虫・成虫は食べない・石炭紀からいる)',
    'https://www.nationalgeographic.com/history/article/110407-science-fossils-insects-bugs-mayflies-mayfly-flying (3億年前の カゲロウの祖先と考えられる化石)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC7022219 (Stepanian ほか 2020 PNAS: エリー湖の羽化を気象レーダーで観測・1回で最大約879億匹)',
    'https://entnemdept.ufl.edu/walker/ufbir/chapters/chapter_37.shtml (Dolania americana のメスは最後の脱皮から5分未満)',
    'https://honcierge.jp/articles/shelf_story/6779 (日本のカゲロウ約140種・世界約3000種・成虫の口は食べられない形)',
  ],
};
