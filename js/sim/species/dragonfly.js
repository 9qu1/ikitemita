// アキアカネ（書き方は CONTENT.md・見本は cat.js）
//   秋（10月なかば）に 田んぼの どろへ うみおとされた たまごから始まる一生にしている。
//   たまごのまま冬をこし、春に 田んぼへ 水が入ると かえる（4月ごろ）→ ヤゴで 約2か月 → 6月に 羽化
//   → 暑さに弱く（30℃をこえると 生きにくい）夏は 標高の高い 山へ → 9月下旬に 赤くなって 田んぼへ もどり、
//   つながって たまごを うむ → 11月〜12月はじめに 一生を終える（Nakanishi ほか 2018・ja.wikipedia の写し）
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

export default {
  id: 'dragonfly',
  name: 'アキアカネ',
  kind: 'bug',
  weight: 1,
  // トンボのなかま（約6000種）全体の数の目安。世界の数を数えた資料は見つからないので、控えめに 1兆匹とした
  realCount: 1e12,
  refDays: 13 * M,
  habitat: 'village',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の どろの 中に、たまごとして うみおとされた', '{place}の 水たまりに、お母さんの しっぽから おちて うまれた'],

  variants: [
    {
      id: 'base', label: 'アキアカネ', w: 1, habitat: 'village',
      places: [
        { text: '石川県の 田んぼ', lat: 36.56, lon: 136.65 },
        { text: '富山県の 田んぼ', lat: 36.7, lon: 137.21 },
        { text: '兵庫県 たつの市の 田んぼ', lat: 34.86, lon: 134.55 },
        { text: '長野県の 山あいの 田んぼ', lat: 36.65, lon: 138.18 },
        { text: '秋田県の 田んぼ', lat: 39.72, lon: 140.1 },
        { text: '新潟県の 田んぼ', lat: 37.9, lon: 139.02 },
      ],
      // 生き残り:
      //   1匹のメスが うむ たまごは 2000こほど と言われる → 数が保たれるなら、産卵まで生きるのは 1000こに1こほど（0.1%）
      //   たまご: 冬のあいだ 田おこしや かんそうで へり、実験では ふ化率が 16〜42% の例もある（s13355-015-0332-0）→ ふ化できるのは 4割ほど
      //   ヤゴ: 田んぼの 天敵（ゲンゴロウの幼虫・タイコウチなど）・中干し・殺虫剤で 大半が いなくなり、羽化できるのは たまごの 1%ほど
      //   成虫: 羽化の失敗・鳥・夏の暑さ → 秋に 田んぼへ もどれるのは 0.2〜0.3%、12月はじめまでに みな 一生を終える
      survival: [[0, 1], [M, 0.9], [3 * M, 0.8], [5.5 * M, 0.65], [6 * M, 0.42], [6.5 * M, 0.14], [7.2 * M, 0.04], [8 * M, 0.012], [8.3 * M, 0.008], [9 * M, 0.0055], [11 * M, 0.0035], [12 * M, 0.002], [13 * M, 0.0007], [13.8 * M, 0.00012], [14.2 * M, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25, habitat: 'village' },
    { id: 'nymph', name: 'ヤゴ', from: 6 * M, sprite: 'nymph', scale: 0.4, habitat: 'river', say: '田んぼの 水の 中で、たまごから ヤゴが かえった', icon: 'egg', big: 2 },
    { id: 'nymph2', name: '大きな ヤゴ', from: 7 * M, sprite: 'nymph', scale: 0.6, say: '脱皮を くりかえして、羽の もとが ふくらんできた', icon: 'star' },
    { id: 'adult', name: 'わかい アキアカネ', from: 8 * M, sprite: 'dragonfly', scale: 0.85, habitat: 'village', say: '夜、背中が われて、すきとおった 羽を ひろげた', icon: 'star', big: 3 },
    { id: 'mountain', name: '山の アキアカネ', from: 8.5 * M, sprite: 'dragonfly', scale: 0.9, habitat: 'forest', say: '暑さを さけて、すずしい 山へ 飛んでいった', icon: 'plane', big: 2 },
    { id: 'red', name: '赤トンボ', from: 11.2 * M, sprite: 'dragonfly', scale: 1, habitat: 'village', say: '赤く そまった からだで、ふるさとの 田んぼへ もどった', icon: 'house', big: 3 },
  ],

  stats: [
    { id: 'meals', label: '食べた 虫', unit: '匹' },
    { id: 'eggs', label: 'うんだ たまご', unit: 'こ' },
  ],

  events: [
    // たまご（秋〜冬〜春）
    { at: [3 * D, 3 * W], p: 0.5, text: 'まだ 田んぼの 上を、お母さんたちが つながって 飛んでいた', icon: 'look' },
    { at: [W, M], p: 0.6, text: 'たまごの 中で、からだの もとが できはじめた', icon: 'egg' },
    { at: [W, 2 * M], p: 0.5, text: 'いねかりの すんだ 田んぼで、どろに しずんで ねむった', icon: 'sleep' },
    { at: [M, 2 * M], p: 0.5, text: '田んぼに 白い しもが おりた', icon: 'snow' },
    { at: [2 * M, 4.5 * M], p: 0.6, text: 'たまごのまま、田んぼの 土の 中で 冬を すごした', icon: 'snow' },
    { at: [2 * M, 4.5 * M], p: 0.3, text: '田んぼに 雪が つもって、土の 中は しんと していた', icon: 'snow' },
    { at: [3 * M, 5 * M], p: 0.35, text: 'カモの むれが おりてきて、どろを つついていった', icon: 'alert', mood: 'hard' },
    { at: [4 * M, 5.5 * M], p: 0.4, text: 'あぜ道に、ふきのとうが 顔を 出した', icon: 'sprout' },
    { at: [4.5 * M, 5.8 * M], p: 0.4, text: 'トラクターが 田んぼを たがやして、土ごと ひっくり返された', icon: 'alert', mood: 'hard' },
    { at: [5.5 * M, 6 * M], p: 0.8, text: '田んぼに 水が 入って、たまごの 中が 動きだした', icon: 'drop', big: 1 },
    { at: [5.5 * M, 6.5 * M], p: 0.4, text: 'カエルの なき声で、夜の 田んぼが にぎやかに なった', icon: 'music' },

    // ヤゴ（春の 田んぼ）
    { at: [6 * M, 6.5 * M], p: 0.7, text: 'ミジンコを つかまえて、はじめての ごはん', icon: 'apple', mood: 'good', add: { meals: 1 } },
    { at: [6.1 * M, 8 * M], repeat: [1, 2], text: ['のびる 口で、ボウフラを さっと つかまえた', 'ユスリカの 幼虫を {n}匹 つかまえた', 'どろの 中の イトミミズを 食べた', 'ミジンコの むれに しのびより、{n}匹 食べた'], icon: 'apple', mood: 'good', add: { meals: [5, 30] } },
    { at: [6.2 * M, 7 * M], p: 0.7, text: '脱皮を して、ひとまわり 大きくなった', icon: 'star' },
    { at: [6.3 * M, 7.8 * M], p: 0.35, text: 'ゲンゴロウの 幼虫に ねらわれて、どろに かくれた', icon: 'alert', mood: 'hard' },
    { at: [6.3 * M, 7.8 * M], p: 0.35, text: 'おしりから 水を ふきだして、ジェットのように にげた', icon: 'drop', mood: 'good' },
    { at: [6.5 * M, 7.9 * M], p: 0.35, text: '田植えの すんだ 苗の あいだを、のそのそ 歩いた', icon: 'sprout' },
    { at: [7 * M, 8 * M], p: 0.25, text: '田んぼの 水が へって、どろの くぼみに 集まった', icon: 'alert', mood: 'hard' },
    { at: [7.6 * M, 8 * M], p: 0.8, text: '夜、イネの くきを のぼって、羽化の じゅんびを した', icon: 'look', big: 1 },

    // わかい成虫（6月）
    { at: [8 * M, 8.1 * M], p: 0.7, text: '朝日の 中、はじめて 空へ 飛びたった', icon: 'plane', mood: 'good', big: 2 },
    { at: [8 * M, 8.45 * M], p: 0.5, text: 'なかまと 林の 木かげに 集まって、虫を 食べた', icon: 'friends', add: { meals: [10, 40] } },

    // 夏の 山
    { at: [8.6 * M, 11 * M], p: 0.9, text: ['山の 草原で、ハエや カを {n}匹 食べた', '高原の 風に のって、虫を {n}匹 つかまえた', 'すずしい 尾根の 上で、小さな 虫を {n}匹 食べた'], icon: 'apple', mood: 'good', add: { meals: [30, 120] } },
    { at: [8.6 * M, 11 * M], p: 0.3, text: '登山の 人の ぼうしに、ちょこんと とまった', icon: 'friends', mood: 'good' },
    { at: [8.6 * M, 11 * M], p: 0.3, text: '標高 2000mの 尾根で、なかまの 大群と 出会った', icon: 'friends', mood: 'good', big: 1 },
    { at: [8.6 * M, 11 * M], p: 0.3, text: 'ツバメに 追いかけられて、草むらに にげこんだ', icon: 'alert', mood: 'hard' },
    { at: [9 * M, 11 * M], p: 0.3, text: '夕立に あって、木の 葉の うらで 雨やどり', icon: 'rain', mood: 'hard' },
    { at: [9.5 * M, 11 * M], p: 0.45, text: '夏の あいだに、からだが ずっしり 重くなった', icon: 'star', mood: 'good' },
    { at: [10.5 * M, 11.2 * M], p: 0.5, text: '秋雨の あと、からだが だんだん 赤く そまってきた', icon: 'look', big: 1 },

    // 秋の 田んぼ
    { at: [11.2 * M, 13 * M], p: 0.35, text: 'かかしの ぼうしに とまって、夕やけを ながめた', icon: 'sun', mood: 'good' },
    { at: [11.2 * M, 12.5 * M], need: 'm', p: 0.7, text: 'メスを 見つけて、しっぽの 先で つかまえた', icon: 'heart', mood: 'good', big: 2, set: 'pair' },
    { at: [11.2 * M, 12.5 * M], need: 'f', p: 0.75, text: 'オスと つながって、田んぼの 上を ならんで 飛んだ', icon: 'heart', mood: 'good', big: 2, set: 'pair' },
    { at: [11.4 * M, 13 * M], need: ['f', 'pair'], p: 0.95, text: ['しっぽで 水たまりの どろを たたいて、{n}この たまごを うんだ', 'いねかりの すんだ 田んぼに、{n}この たまごを うんだ'], icon: 'egg', mood: 'good', big: 3, add: { eggs: [300, 800] }, set: 'laid' },
    { at: [11.5 * M, 13.5 * M], need: ['f', 'laid'], repeat: [0, 2], text: ['次の 日も、田んぼを めぐって {n}この たまごを うんだ', '晴れた 午前中、また {n}この たまごを うんだ', 'オスと つながったまま、{n}この たまごを うみおとした'], icon: 'egg', mood: 'good', big: 1, add: { eggs: [200, 600] } },
    { at: [11.4 * M, 13.5 * M], need: ['m', 'pair'], p: 0.8, text: 'メスと つながったまま、どろを たたく 産卵を 手つだった', icon: 'egg', mood: 'good', big: 2, set: 'laid' },
    { at: [11.5 * M, 13.5 * M], p: 0.25, text: 'カマキリの カマを、すんでのところで かわした', icon: 'alert', mood: 'hard' },
    { at: [12 * M, 14 * M], p: 0.4, text: '朝の 冷えこみで、日が あたるまで 動けなかった', icon: 'snow', mood: 'hard' },
    { at: [12.5 * M, 14 * M], p: 0.35, text: '羽の はしが、すこし やぶれてきた', icon: 'feather' },
    { at: [12.5 * M, 14 * M], p: 0.3, text: 'あたたかい かべに とまって、日なたぼっこをした', icon: 'sun', mood: 'good' },
  ],

  deaths: [
    { at: [0, 6 * M], w: 4, text: ['どろの 中で、たまごのまま しずかに 眠った', '冬の あいだに、たまごのまま いのちを 終えた', 'どろの 中の 小さな 虫に 食べられて、たまごのまま 終わった'] },
    { at: [4.5 * M, 6 * M], w: 2, text: '田おこしで 土の 奥に うもれて、たまごのまま 眠った' },
    { at: [5.5 * M, 6.2 * M], w: 2, text: 'たまごから かえることが できずに 眠った' },
    { at: [6 * M, 8 * M], w: 4, text: ['ゲンゴロウの 幼虫に つかまって、いのちを 終えた', 'カエルに 食べられて、いのちを 終えた', '大きな ヤゴに 食べられて、いのちを 終えた'] },
    { at: [6 * M, 8 * M], w: 1.5, text: '田んぼの 虫よけの くすりで、いのちを 終えた' },
    { at: [7 * M, 8.1 * M], w: 1, text: '田んぼの 水が ぬかれて、どろの 中で 眠った' },
    { at: [7.8 * M, 8.3 * M], w: 2, text: '羽化の とちゅうで、羽が のびきらずに 眠った' },
    { at: [8 * M, 14.2 * M], w: 2, text: ['ツバメに つかまって、いのちを 終えた', 'クモの 巣に かかって、いのちを 終えた'] },
    { at: [8.5 * M, 11.5 * M], w: 3, text: ['山の 夕立に うたれて、しずかに 眠った', '夏の 暑さを こしきれずに、しずかに 眠った'] },
    { at: [11.4 * M, 14.2 * M], w: 5, need: 'laid', text: 'たまごを のこして、秋の 田んぼで しずかに 眠った' },
    { at: [12.5 * M, 14.2 * M], w: 3, text: '初しもの 朝、つめたい 草の 上で 眠った' },
  ],

  titles: [
    { stat: { eggs: 1000 }, text: '{eggs}この たまごを のこした 赤トンボの 母' },
    { need: 'laid', text: '山から ふるさとへ 帰ってきた 赤トンボ' },
    { minAge: 11.2 * M, text: '山と 田んぼを 行き来した 旅の トンボ' },
    { minAge: 8.5 * M, maxAge: 11.2 * M, text: '夏の 山を 飛んだ アキアカネ' },
    { minAge: 8 * M, maxAge: 8.5 * M, text: '羽を ひろげて、6月の 空を 知った' },
    { minAge: 6 * M, maxAge: 8 * M, text: '田んぼの 水の 中を 知った ヤゴ' },
    { maxAge: 6 * M, text: '田んぼの 土の 中で 冬を すごした たまご' },
  ],

  facts: [
    'アキアカネは 暑さに 弱く、夏は 標高の 高い 山で すごし、秋に 平地の 田んぼへ もどってきます',
    'アキアカネの たまごは、いねかりの あとの 田んぼの 土の 中で 冬をこし、春に 水が 入ると かえります',
    '富山県では、アキアカネが 1993年から 2004年に 97% 減った という報告があります',
    '大きく 減った 原因として、1990年代から 田んぼで 使われはじめた 一部の 虫よけの くすりが うたがわれています',
    'ヤゴは、のびる 口を すばやく 出して、ミジンコや ボウフラを つかまえて 食べます',
  ],

  sources: [
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC6280840/ (Nakanishi ほか 2018: 生活史・富山県で1993〜2004年に97%減・フィプロニル/イミダクロプリドとの関係)',
    'https://link.springer.com/article/10.1007/s13355-015-0332-0 (たまごの休眠・水温ごとのふ化率 16〜42%)',
    'https://ja.wikid.org/%E3%82%A2%E3%82%AD%E3%82%A2%E3%82%AB%E3%83%8D (ja.wikipedia の写し: 羽化5月末〜6月下旬・最大3000mまで移動・12月上旬まで生存・卵期約半年)',
    'https://www.honda.co.jp/outdoor/adventure/akiakane.html (Honda 生きもの図鑑: 夏は高山へ・2000年ごろから急減・中干し)',
    'https://www.pref.fukui.lg.jp/doc/noushi/kikaku/hukyu_d/fil/h29_07_shidou.pdf (福井県: 育苗箱の殺虫剤とヤゴの羽化)',
    'https://www.cgr.mlit.go.jp/miyoshi/haizuka/wetland/pdf/haiduka085.pdf (国交省: 羽化のあと 気温20〜25℃の高地へ・30℃をこえると生存が難しい)',
    'https://www.suntory.co.jp/eco/forest/living-things/red-dragonfly/ (サントリー: メス1匹の卵は2000個程度。ページは直接開けず、検索結果の要約で確認・要確認)',
  ],
};
