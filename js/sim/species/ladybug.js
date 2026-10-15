// ナナホシテントウ（書き方は CONTENT.md・見本は cat.js）
//   春に うみつけられた たまご（4月〜5月）から始まる一生にしている。
//   たまご 約4日 → 幼虫 4齢で 2〜3週間 → さなぎ 約4〜5日 → 成虫（kotobank 日本大百科全書）
//   本州の成虫は 夏のあいだ 夏眠し、成虫のまま 冬をこして、春に たまごを うむ（京都府 テントウムシみわけ図鑑）
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

export default {
  id: 'ladybug',
  name: 'ナナホシテントウ',
  kind: 'bug',
  weight: 1,
  // テントウムシのなかま（約6000種）全体の数の目安。世界の数を数えた資料は見つからない。
  //   資料がないので推定: 陸地の ならした 密度を 1m²あたり 0.1匹 ほどと 見て（根拠なしの 仮の 値）、たまご・幼虫も ふくめ 控えめに 10兆匹とした
  realCount: 1e13,
  refDays: Y,
  habitat: 'garden',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 葉っぱの うらで、たまごとして うまれた', '{place}で、30こほどの きょうだいと ならんで うまれた'],

  variants: [
    {
      id: 'base', label: 'ナナホシテントウ', w: 1, habitat: 'garden',
      places: [
        { text: '日本の 公園の 花だん', lat: 35.68, lon: 139.76 },
        { text: '日本の 川原の 菜の花畑', lat: 35.01, lon: 135.77 },
        { text: '日本の 麦畑', lat: 36.08, lon: 140.11 },
        { text: 'イギリスの 庭', lat: 51.5, lon: -0.13 },
        { text: 'アメリカの アルファルファ畑', lat: 42.03, lon: -93.62 },
        { text: '中国の 麦畑', lat: 34.75, lon: 113.65 },
      ],
      // 生き残り（野外）:
      //   たまご: 共食い（先にかえった きょうだい）・アリ・育たない卵で 3割ほど へるとした
      //   幼虫: アルファルファ畑の調査で 1齢〜3齢の死亡が 90.8%（Obrycki ほか 1997）→ 0.7×0.092 ≒ 0.064
      //   4齢・さなぎ（寄生バチ）で さらに へり、成虫に なれるのは 3%ほど
      //   メスは 一生で 平均 約360この たまご → 数が保たれるなら 産卵まで生きるのは 0.5%ほど（2/360）
      //   越冬の生存は 5割前後（チェコで 48.4%・集団越冬の死亡は9%など）。冬をこした成虫は 春に たまごを うんで 1年あまりで終わる
      survival: [[0, 1], [2 * D, 0.85], [4 * D, 0.7], [7 * D, 0.3], [11 * D, 0.12], [14 * D, 0.064], [20 * D, 0.045], [25 * D, 0.033], [2 * M, 0.024], [5 * M, 0.016], [7 * M, 0.012], [10 * M, 0.006], [12 * M, 0.0025], [14 * M, 0.0006], [16 * M, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3 },
    { id: 'larva', name: '幼虫', from: 4 * D, sprite: 'grub', scale: 0.3, say: 'からを やぶって、ちいさな 幼虫が 出てきた', icon: 'egg', big: 2 },
    { id: 'larva4', name: '大きな 幼虫', from: 14 * D, sprite: 'grub', scale: 0.42, say: '黒い せなかに、オレンジの もようが 出てきた', icon: 'look' },
    { id: 'pupa', name: 'さなぎ', from: 20 * D, sprite: 'pupa', scale: 0.45, say: '葉の うらで、さなぎに なった', icon: 'sleep', big: 1 },
    { id: 'adult', name: 'ナナホシテントウ', from: 25 * D, sprite: 'ladybug', scale: 0.9, say: 'さなぎから 出て、ナナホシテントウに なった', icon: 'star', big: 3 },
  ],

  stats: [
    { id: 'aphids', label: '食べた アブラムシ', unit: '匹' },
    { id: 'eggs', label: 'うんだ たまご', unit: 'こ' },
    { id: 'friends', label: 'いっしょに 冬ごもりした なかま', unit: '匹' },
  ],

  events: [
    // たまご
    { at: [2 * H, D], text: ['きょうだいの たまごと ぴったり ならんでいた', '黄色い たまごの 列の、はしっこに いた'], icon: 'egg' },
    { at: [D, 3.5 * D], p: 0.4, text: 'アリが すぐ そばを 通りすぎていった', icon: 'alert', mood: 'hard' },
    { at: [2 * D, 3.8 * D], p: 0.5, text: 'たまごの 色が、黄色から 灰色に かわってきた', icon: 'look' },

    // 幼虫
    { at: [4 * D, 5 * D], p: 0.5, text: 'まだ かえらない たまごを 食べて、さいしょの 力を つけた', icon: 'egg', mood: 'hard' },
    { at: [5 * D, 8 * D], p: 0.9, text: 'はじめて アブラムシを つかまえた', icon: 'apple', mood: 'good', big: 1, add: { aphids: 1 } },
    { at: [6 * D, 9 * D], p: 0.9, text: 'はじめて 脱皮して、ひとまわり 大きくなった', icon: 'star', big: 1 },
    { at: [7 * D, 19 * D], repeat: [1, 3], text: ['アブラムシを {n}匹 たいらげた', 'くきを のぼって、{n}匹の アブラムシの むれを 見つけた', '葉の うらの アブラムシを {n}匹 食べた', 'おなかが ぱんぱんに なるまで、{n}匹 食べた'], icon: 'apple', mood: 'good', add: { aphids: [30, 120] } },
    { at: [7 * D, 18 * D], p: 0.4, text: 'アリに 追いはらわれた。アリは アブラムシの 用心棒だ', icon: 'alert', mood: 'hard' },
    { at: [8 * D, 18 * D], p: 0.35, text: 'アブラムシが いなくなって、葉から 葉へ 歩きまわった', icon: 'look', mood: 'hard' },
    { at: [9 * D, 19 * D], p: 0.3, text: 'クモの 糸を、ぎりぎりで よけた', icon: 'alert', mood: 'hard' },
    { at: [5 * D, 19 * D], p: 0.25, text: '大つぶの 雨に うたれて、葉の うらに しがみついた', icon: 'rain', mood: 'hard' },
    { at: [10 * D, 13 * D], p: 0.5, text: '2回めの 脱皮。あしが しっかり してきた', icon: 'star' },
    { at: [17 * D, 20 * D], p: 0.7, text: '葉の うらに おしりを くっつけて、じっと 動かなくなった', icon: 'sleep' },

    // さなぎ
    { at: [21 * D, 24 * D], p: 0.4, text: 'つつかれて、さなぎのまま ぴくっと 体を はねあげた', icon: 'alert' },

    // 成虫
    { at: [25 * D, 26 * D], p: 0.9, text: 'さいしょ 黄色かった せなかに、7つの 星が うかんできた', icon: 'star', mood: 'good', big: 2 },
    { at: [26 * D, 32 * D], p: 0.8, text: '草の てっぺんまで のぼって、はじめて 空へ 飛びたった', icon: 'plane', mood: 'good', big: 2 },
    { at: [27 * D, 12 * M], repeat: [1, 3], text: ['1日で アブラムシを {n}匹 食べた', 'バラの つぼみで、アブラムシを {n}匹 たいらげた', '麦の 穂で、アブラムシを {n}匹 見つけて 食べた'], icon: 'apple', mood: 'good', add: { aphids: [40, 100] } },
    { at: [M, 12 * M], p: 0.5, text: 'つつかれそうに なって、あしを ちぢめて 死んだふり', icon: 'alert', mood: 'hard', big: 1, set: 'playdead' },
    { at: [M, 12 * M], p: 0.35, text: 'あしから にがい 黄色い しるを 出して、鳥を あきらめさせた', icon: 'alert', mood: 'good' },
    { at: [M, 12 * M], p: 0.25, text: 'こどもの 指を のぼって、てっぺんから 飛んでいった', icon: 'friends', mood: 'good' },
    { at: [M, 12 * M], p: 0.2, text: 'ナミテントウと 同じ 葉で、はちあわせした', icon: 'look' },
    { at: [M, 12 * M], p: 0.15, text: '風に のって、となりの 畑まで 飛んでいった', icon: 'plane', move: 'village' },
    { at: [35 * D, 2 * M], need: 'f', p: 0.35, text: '{n}この たまごを、アブラムシの そばに うんだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [20, 40] }, set: 'mother' },
    { at: [35 * D, 2 * M], need: 'm', p: 0.35, text: 'メスを 見つけて、つがいに なった', icon: 'heart', mood: 'good', big: 2, set: 'paired' },
    { at: [2 * M, 3 * M], p: 0.85, text: '暑い 夏は、ススキの 株もとで じっと すごした（夏眠）', icon: 'sun', set: 'summer' },
    { at: [3 * M, 5 * M], need: 'summer', p: 0.3, text: '葉の うらで 夏眠中、夕立の しぶきが かかった', icon: 'rain' },
    { at: [5 * M, 6.5 * M], need: 'summer', p: 0.7, text: 'すずしくなって、また 葉の 上を 歩きはじめた', icon: 'sprout', mood: 'good' },
    { at: [6.5 * M, 7.5 * M], p: 0.92, text: ['草の 根もとで、なかま {n}匹と 冬ごもりを はじめた', '落ち葉の 下に、なかま {n}匹と 集まった'], icon: 'snow', big: 2, add: { friends: [5, 30] }, set: 'winter' },
    { at: [7.5 * M, 9.5 * M], need: 'winter', p: 0.4, text: 'あたたかい 日に、すこしだけ 外に 出て 日なたぼっこ', icon: 'sun', mood: 'good' },
    { at: [7.5 * M, 9.5 * M], need: 'winter', p: 0.35, text: 'しもが おりた 朝、なかまと からだを よせあった', icon: 'snow', mood: 'hard' },
    { at: [9.5 * M, 10.5 * M], need: 'winter', p: 0.9, text: '春が きて、冬ごもりから 目を さました', icon: 'sun', mood: 'good', big: 2, set: 'spring' },
    { at: [9.8 * M, 11 * M], need: 'spring', p: 0.7, text: '菜の花の アブラムシで、おなかいっぱいに なった', icon: 'flower', mood: 'good' },
    { at: [10 * M, 11 * M], need: ['spring', 'm'], p: 0.7, text: '春の 野原で メスと 出会い、つがいに なった', icon: 'heart', mood: 'good', big: 2, set: 'paired' },
    { at: [10 * M, 13 * M], need: ['spring', 'f'], repeat: [1, 2], text: ['{n}この たまごを、何日かに 分けて 葉の うらに うんだ', 'アブラムシの いる 葉を えらんで、{n}この たまごを うんだ'], icon: 'egg', mood: 'good', big: 3, add: { eggs: [60, 180] }, set: 'mother' },
    { at: [11 * M, 15 * M], need: 'mother', p: 0.5, text: 'うんだ たまごから かえった 幼虫たちが、葉の 上を 歩いていた', icon: 'baby', mood: 'good', big: 2 },
    { at: [12 * M, 15 * M], p: 0.5, text: 'せなかの 星の つやが、すこし うすくなってきた', icon: 'sleep' },
  ],

  deaths: [
    { at: [0, 4 * D], w: 4, text: ['アリに 見つかって、たまごのまま いのちを 終えた', '先に かえった きょうだいに 食べられて、いのちを 終えた', 'たまごの 中で 育たず、しずかに 眠った'] },
    { at: [4 * D, 20 * D], w: 3, text: ['アブラムシに ありつけず、ちいさな いのちを 終えた', 'クモに つかまって、ちいさな いのちを 終えた'] },
    { at: [4 * D, 20 * D], w: 2, text: ['大きな ナミテントウの 幼虫に 食べられて、いのちを 終えた', '大雨に ながされて、いのちを 終えた'] },
    { at: [20 * D, 25 * D], w: 3, text: ['小さな ハチに たまごを うみつけられ、さなぎのまま 眠った', 'さなぎのまま 鳥に 見つかって、いのちを 終えた'] },
    { at: [25 * D, 16 * M], w: 2, text: ['鳥に つかまって、いのちを 終えた', 'カマキリに つかまって、いのちを 終えた'] },
    { at: [25 * D, 16 * M], w: 0.5, text: '畑に まかれた くすりで、いのちを 終えた' },
    { at: [25 * D, 3 * M], w: 2, text: 'アブラムシの いない 草むらで、力つきて 眠った' },
    { at: [2 * M, 6 * M], w: 2, text: '夏の 暑さに たえきれず、しずかに 眠った' },
    { at: [6 * M, 10.5 * M], w: 4, need: 'winter', text: '冬の 寒さの 中、なかまに かこまれて 眠った' },
    { at: [6 * M, 10.5 * M], w: 2, need: '!winter', text: '冬ごもりの 場所を 見つけられず、寒さで 眠った' },
    { at: [10 * M, 16 * M], w: 5, need: 'mother', text: 'たまごを うみおえて、春の 日だまりで しずかに 眠った' },
    { at: [10 * M, 16 * M], w: 4, need: 'paired', text: 'つがいの あいてと 春を すごして、しずかに 眠った' },
  ],

  titles: [
    { stat: { eggs: 150 }, text: '{eggs}この たまごを のこした 春の 母' },
    { stat: { aphids: 400 }, text: 'アブラムシ {aphids}匹を 食べた 畑の 用心棒' },
    { need: 'spring', text: '冬を こえて、二度めの 春を 見た テントウムシ' },
    { need: 'playdead', minAge: 2 * M, text: '死んだふりで 生きのびた ナナホシテントウ' },
    { minAge: 25 * D, maxAge: 6 * M, text: '七つの 星を せおって、夏の 野を 飛んだ' },
    { maxAge: 4 * D, text: '葉っぱの うらで 夢を 見た、黄色い たまご' },
    { minAge: 4 * D, maxAge: 25 * D, text: 'アブラムシを 追いかけた ちいさな 幼虫' },
  ],

  facts: [
    'ナナホシテントウの メスは、一生で 平均 360こほどの たまごを うむ と言われています',
    '成虫は アブラムシを 1日に 数十〜100匹ほど 食べる と言われています',
    '畑の 調査では、幼虫の 1齢から 3齢までに 9割ほどが いなくなった という報告があります',
    '本州の ナナホシテントウは、暑い 夏は 夏眠して じっとすごし、成虫のまま 冬をこします',
    'さわると あしの つけねから 出す 黄色い しるは にがく、鳥に きらわれます',
    'テントウムシの 名前は、高い ところへ のぼって お天道さま（太陽）の ほうへ 飛ぶ ようすから と言われています',
  ],

  sources: [
    'https://kotobank.jp/word/%E3%81%AA%E3%81%AA%E3%81%BB%E3%81%97%E3%81%A6%E3%82%93%E3%81%A8%E3%81%86-3161967 (日本大百科全書: 卵塊20〜40個・約4日でふ化・幼虫2〜3週・さなぎ約4日・一生で平均約360個・成虫で越冬)',
    'https://www.pref.kyoto.jp/biodic/documents/tentoumusi1.pdf (きょうと生物多様性センター: ススキの株元などで越夏・越冬)',
    'https://scholars.uky.edu/en/publications/partial-life-table-analysis-for-larval-coleomegilla-maculata-dege/ (Obrycki ほか 1997: アルファルファ畑で1〜3齢の死亡90.8%)',
    'https://researchers.mq.edu.au/en/publications/overwintering-survival-in-the-seven-spot-ladybird-coccinella-sept/ (越冬中の生存: 集団越冬の死亡9%・採餌を止めた個体は72%)',
    'https://www.zin.ru/ANIMALIA/COLEOPTERA/addpages/Andrey_Ukrainsky_Library/References_files/Honek98.pdf (越冬の生存率 48.4% の調査・チェコ西部)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC7283328/ (テントウムシの反射出血: 成虫も幼虫も 脚から いやな成分の液を出し、天敵の攻撃を減らす)',
    'https://hugkum.sho.jp/153786 (成虫は1日にアブラムシ約100匹)',
    'https://link.springer.com/10.1186/s41938-023-00712-0 (幼虫期に600匹ほどのアブラムシ・成虫1日55〜78匹の測定例を含む文献群)',
  ],
};
