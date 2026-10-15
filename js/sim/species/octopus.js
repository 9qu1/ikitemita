// マダコ（書き方は CONTENT.md）
import { H, D, W, M, Y } from '../units.js?v=1.0.1';

export default {
  id: 'octopus',
  name: 'マダコ',
  kind: 'animal',
  weight: 1.1,
  // 世界の数を数えた資料はない。日本〜朝鮮半島〜中国の 沿岸の マダコ（Octopus sinensis）で、
  // 漁で とられる数（日本だけで 年に 数百万〜1000万匹ほど）と、とられない分・子ダコを 足した 3億匹ほどの目安
  realCount: 3e8,
  refDays: 18 * M, // 寿命は 1〜1.5年（三重県）・1〜3年（神奈川県）
  habitat: 'reef',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の 岩あなで、たまごとして うまれた', '{place}で、たまごの ふさの 1つぶとして うまれた'],

  variants: [
    {
      id: 'wild', label: 'マダコ', w: 1, habitat: 'reef',
      places: [
        { text: '兵庫県 明石の 海', lat: 34.63, lon: 134.98 },
        { text: '愛知県 日間賀島の 海', lat: 34.70, lon: 137.00 },
        { text: '三重県 鳥羽の 海', lat: 34.48, lon: 136.85 },
        { text: '茨城県の 海', lat: 36.4, lon: 140.62 },
        { text: '熊本県 天草の 海', lat: 32.45, lon: 130.2 },
        { text: '韓国の 南の 海', lat: 34.83, lon: 128.43 },
      ],
      // たまごは 約1か月 お母さんが 守り、かえった 赤ちゃんは 約1か月 海を ただよってから 底に おりる（神奈川県）。
      // メスは 10〜15万個の たまごを うむ（三重県）ので、本当に おとなまで 生きるのは 5〜7万匹に1匹ほど。
      // 岩場での くらしと 子育てを 見せるため、1年まで 生きる割合を 約0.3%（330匹に1匹）に 多めにしてある
      survival: [[0, 1], [2 * W, 0.95], [M, 0.85], [33 * D, 0.4], [45 * D, 0.12], [2 * M, 0.035], [3 * M, 0.016], [6 * M, 0.008], [9 * M, 0.005], [Y, 0.003], [15 * M, 0.0012], [18 * M, 0.0004], [2 * Y, 0.00005], [30 * M, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25 },
    { id: 'paralarva', name: '赤ちゃんダコ', from: M, sprite: 'octopus', scale: 0.25, habitat: 'ocean', say: 'たまごから、すきとおった 赤ちゃんダコが かえった', icon: 'egg', big: 2 },
    { id: 'young', name: '子ダコ', from: 2 * M, sprite: 'octopus', scale: 0.5, habitat: 'reef', say: '海の 底に おりて、岩場で くらしはじめた', icon: 'house', big: 2 },
    { id: 'adult', name: 'おとなの タコ', from: 8 * M, sprite: 'octopus', scale: 1, say: 'りっぱな おとなの タコに なった', icon: 'star', big: 1 },
  ],

  stats: [
    { id: 'ink', label: 'すみを はいた', unit: '回' },
    { id: 'crab', label: 'つかまえた カニや エビ', unit: '匹' },
    { id: 'eggs', label: 'うんだ たまご', unit: '万個' },
  ],

  events: [
    // たまご（お母さんが 守る）
    { at: [0, 6 * H], p: 0.8, text: 'お母さんが、岩あなの 天井に たまごの ふさを つるした', icon: 'egg', big: 1 },
    { at: [D, 25 * D], repeat: [1, 2], text: ['お母さんが うでで、たまごを そっと なでた', 'お母さんが 水を ふきかけて、たまごを きれいにした', 'お母さんは なにも 食べずに、そばを はなれなかった'], icon: 'heart', mood: 'good' },
    { at: [3 * D, 28 * D], p: 0.35, text: 'たまごを ねらう 魚を、お母さんが 追いはらった', icon: 'alert', mood: 'hard' },
    { at: [2 * W, M], p: 0.7, text: 'たまごの中で、小さな 目と うでが 見えてきた', icon: 'look', big: 1 },

    // 海を ただよう 赤ちゃんダコ
    { at: [M, 31 * D], p: 0.8, text: 'お母さんの ひと吹きで、海へ 送り出された', icon: 'drop', big: 1 },
    { at: [M, 35 * D], p: 0.6, text: 'お母さんは、みんなが かえるのを 見とどけて 眠った', icon: 'feather', mood: 'hard', big: 2 },
    { at: [M, 2 * M], p: 0.8, text: 'プランクトンに まじって、ふわふわ ただよった', icon: 'drop' },
    { at: [32 * D, 2 * M], p: 0.7, text: 'カニの 赤ちゃんを つかまえて 食べた', icon: 'apple', mood: 'good', big: 1, add: { crab: 1 } },
    { at: [33 * D, 2 * M], p: 0.4, text: '魚に 見つかって、ちいさな すみを はいて にげた', icon: 'alert', mood: 'hard', big: 1, add: { ink: 1 } },
    { at: [35 * D, 2 * M], p: 0.5, text: '夜は 上へ、昼は 下へ。海の中を 行ったり来たり', icon: 'drop' },

    // 岩場の くらし
    { at: [2 * M, 4 * M], p: 0.85, text: 'ちょうどいい すきまを 見つけて、自分の 家にした', icon: 'house', mood: 'good', big: 2, set: 'den' },
    { at: [2 * M, 8 * M], p: 0.6, text: 'まわりの 岩と 同じ色に なって、じっと かくれた', icon: 'look', mood: 'good', big: 1 },
    { at: [2 * M, 10 * M], repeat: [1, 3], text: ['砂の 色に 化けて、魚の 目を ごまかした', '海藻に まぎれて、すがたを けした', 'はだを でこぼこにして、岩に なりきった'], icon: 'look', mood: 'good' },
    { at: [2 * M, 12 * M], p: 0.5, text: 'ウツボに ねらわれて、すみを はいて にげた', icon: 'alert', mood: 'hard', big: 1, add: { ink: 1 } },
    { at: [3 * M, 10 * M], repeat: [1, 2], text: ['カニを つかまえて、家に 持ちかえった', '夜の 岩場で、エビを つかまえて 食べた'], icon: 'apple', mood: 'good', add: { crab: [1, 4] } },
    { at: [3 * M, 10 * M], p: 0.4, text: '家の 入り口に、食べた 貝がらが たまっていった', icon: 'box' },
    { at: [3 * M, 10 * M], p: 0.35, text: '貝がらに 小さな あなを あけて、中身を 食べた', icon: 'apple' },
    { at: [3 * M, 10 * M], p: 0.3, text: 'イセエビを ねらって、そろりと 近づいた', icon: 'apple' },
    { at: [3 * M, 10 * M], p: 0.3, text: 'うでを 1本 なくしたが、また 生えてきた', icon: 'bandage', mood: 'good', big: 1 },
    { at: [4 * M, 10 * M], p: 0.35, text: 'からだより ずっと 小さな すきまを、するりと ぬけた', icon: 'star', big: 1 },
    { at: [4 * M, 10 * M], p: 0.25, text: '海に しずんでいた びんを 見つけて、家にした', icon: 'house', mood: 'good' },
    { at: [4 * M, 10 * M], p: 0.25, text: 'たこつぼに 入ったが、小さいので 海に もどされた', icon: 'heart', mood: 'good', big: 1 },
    { at: [5 * M, 10 * M], p: 0.35, text: 'ダイバーの 手に、そっと うでを のばしてみた', icon: 'friends', mood: 'good' },
    { at: [4 * M, 10 * M], p: 0.3, text: 'となりの タコと、すみかを めぐって にらみあった', icon: 'alert' },
    { at: [4 * M, 10 * M], p: 0.25, text: '台風の 大波で、家の 岩が ごろりと ころがった', icon: 'rain', mood: 'hard' },

    // まれに 水族館へ（びんの ふたを 開けるのは 水族館や 実験での 記録なので、ここで 見せる）
    { at: [4 * M, 10 * M], p: 0.05, text: '漁の あみに かかって、水族館に 運ばれた', icon: 'box', big: 2, set: 'aquarium' },
    { at: [4 * M, 2 * Y], p: 0.9, need: 'aquarium', text: 'ふたつきの びんの エビを、ふたを 回して 取り出した', icon: 'star', mood: 'good', big: 3, add: { crab: 1 } },
    { at: [4 * M, 2 * Y], p: 0.7, need: 'aquarium', text: '水そうの ふたの すきまから、ぬけだそうとした', icon: 'alert' },
    { at: [4 * M, 2 * Y], p: 0.6, need: 'aquarium', text: '世話を してくれる 人の 顔を、おぼえたようだった', icon: 'friends', mood: 'good', big: 1 },

    // おとな
    { at: [8 * M, 18 * M], p: 0.85, need: 'm', text: 'メスに 出会い、とくべつな うでを そっと のばした', icon: 'heart', mood: 'good', big: 3, set: 'mated' },
    { at: [10 * M, 2 * Y], p: 0.5, need: 'm', text: 'メスを さがして、夜の 海底を 歩きまわった', icon: 'look' },
    { at: [10 * M, 2 * Y], p: 0.4, need: 'm', text: 'となりの オスと、うでを ひろげて にらみあった', icon: 'alert' },
    { at: [9 * M, 2 * Y], p: 0.7, need: ['m', 'mated'], text: 'からだが 弱りはじめ、動きが ゆっくりに なった', icon: 'sleep', mood: 'hard' },
    { at: [9 * M, 18 * M], p: 0.85, need: 'f', text: 'オスと 出会って、からだの 中で たまごが 育った', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
    { at: [10 * M, 20 * M], p: 0.95, need: ['f', 'mated'], text: '岩あなに こもって、約{n}万個の たまごを うんだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [10, 28] }, set: 'brood' },
    { at: [10 * M, 2 * Y], need: 'brood', text: 'ほとんど なにも 食べずに、たまごを 守りつづけた', icon: 'heart', mood: 'hard', big: 2, set: 'brood2' },
    { at: [10 * M, 2 * Y], p: 0.8, need: 'brood', text: 'うでで たまごを なでて、新しい 水を 送りつづけた', icon: 'drop', mood: 'good' },
    { at: [11 * M, 2 * Y], p: 0.85, need: 'brood2', text: 'たまごが かえり、赤ちゃんたちが 海へ 旅立った', icon: 'baby', mood: 'good', big: 3, set: 'hatched' },
    { at: [Y, 30 * M], p: 0.5, need: '!brood', text: 'このあたりで いちばん 大きな タコに なった', icon: 'crown', mood: 'good', big: 1 },
  ],

  deaths: [
    { at: [0, M], w: 4, text: 'たまごのまま、ちいさな いのちを 終えた' },
    { at: [M, 2 * M], w: 6, text: ['ただよう うちに、魚に 食べられて いのちを 終えた', '海を ただよいながら、ちいさな いのちを 終えた', '食べものが 見つからず、しずかに 眠った'] },
    { at: [2 * M, 2 * Y], w: 3, need: '!aquarium', text: 'ウツボに 見つかって、いのちを 終えた' },
    { at: [2 * M, 2 * Y], w: 2, need: '!aquarium', text: '大きな 魚に つかまって、いのちを 終えた' },
    { at: [4 * M, 2 * Y], w: 2, need: '!aquarium', text: 'たこつぼごと 引きあげられ、海での くらしを 終えた' },
    { at: [8 * M, 3 * Y], w: 30, need: 'hatched', text: 'たまごが かえるのを 見とどけて、しずかに 眠った' },
    { at: [8 * M, 3 * Y], w: 30, need: ['brood', '!hatched'], text: 'たまごを 守りながら、しずかに いのちを 終えた' },
    { at: [8 * M, 3 * Y], w: 8, need: ['m', 'mated'], text: '子どもを のこして、しずかに いのちを 終えた' },
    { at: [Y, 3 * Y], w: 2, need: '!brood', text: '年を とって、岩あなで しずかに 眠った' },
    { at: [3 * M, 3 * Y], w: 12, need: 'aquarium', text: '水族館で、みんなに 見守られて 眠った' },
  ],

  titles: [
    { stat: { eggs: 10 }, text: '{eggs}万個の たまごを 守りぬいた お母さん' },
    { need: 'aquarium', text: 'びんの ふたも 開けた 水族館の 人気もの' },
    { need: ['m', 'mated'], text: '子どもを のこした 海の 知恵もの' },
    { need: ['den', '!mated'], long: 0.001, text: '岩場の 主（ぬし）に なった マダコ' },
    { need: 'den', maxAge: 8 * M, text: '岩場に 自分の 家を もった 子ダコ' },
    { maxAge: M, text: 'お母さんに 守られた たまご' },
    { minAge: M, maxAge: 2 * M, text: '海を ただよった すきとおった 赤ちゃん' },
  ],

  facts: [
    'マダコの メスは 10〜15万個ほどの たまごを うみます（三重県の 資料）',
    'お母さんダコは 約1か月 たまごを 守り、たまごが かえると 一生を 終えます',
    'マダコの 寿命は 1〜1.5年ほど と されています（三重県の 資料）',
    'タコは まわりに 合わせて、一瞬で からだの 色や もようを 変えられます',
    'タコは びんの ふたを ひねって 開けることが できます（水族館や 実験での 観察）',
    'タコの 心臓は 3つ あり、血は 青い 色を しています',
  ],

  sources: [
    'https://www.pref.kanagawa.jp/docs/mx7/cnt/f430693/zukan-madako.html (神奈川県・寿命1〜3年・産卵は春と夏・お母さんが約1か月守り ふ化後に死ぬ・約1か月浮遊して着底・たこつぼ)',
    'https://www.pref.mie.lg.jp/common/content/001010146.pdf (三重県 資源評価・10〜15万個・寿命1〜1.5年・400g未満は放流・北限は津軽海峡)',
    'https://www.pref.okayama.jp/uploaded/attachment/284316.pdf (岡山県・海藤花・1匹の合計 14〜28万粒・産卵期間29〜65日)',
    'https://en.wikipedia.org/wiki/Octopus_sinensis (マダコ Octopus sinensis・赤ちゃんダコの浮遊期)',
    'https://dx.doi.org/10.1007/s10452-020-09777-7 (Aquatic Ecology 2020・マダコの赤ちゃんは 生後15日ごろから 昼は下・夜は上へ 泳ぐ)',
  ],
};
