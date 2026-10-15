// カクレクマノミ（書き方は CONTENT.md）
import { H, D, W, M, Y } from '../units.js?v=1.0.0';

export default {
  id: 'clownfish',
  name: 'カクレクマノミ',
  kind: 'animal',
  weight: 1.1,
  // 世界の数を数えた資料はない。すみかの イソギンチャク3種が インド洋東部〜西太平洋の サンゴ礁に点々とあり、
  // 1つに 2〜6匹ほど → 数百万〜数千万匹の目安として 1000万匹にした
  realCount: 1e7,
  refDays: 10 * Y, // 野生の寿命は 6〜10年ほど（ADW・フロリダ自然史博物館）
  habitat: 'reef',
  birth: ['{place}で、たまごとして うまれた', '{place}の 岩の上で、たまごとして うまれた'],

  variants: [
    {
      id: 'wild', label: 'カクレクマノミ', w: 1, habitat: 'reef',
      places: [
        { text: '沖縄の 石垣島の サンゴ礁', lat: 24.4, lon: 124.2 },
        { text: 'フィリピンの ボホール島の 海', lat: 9.6, lon: 123.9 },
        { text: 'インドネシアの バリ島の 海', lat: -8.3, lon: 115.6 },
        { text: 'タイの アンダマン海の 島', lat: 8.65, lon: 97.65 },
        { text: 'マレーシアの ボルネオ島の 海', lat: 5.5, lon: 118.6 },
        { text: 'オーストラリア北西部の サンゴ礁', lat: -14.0, lon: 123.0 },
      ],
      // たまご 6〜8日 → 海を ただよう 8〜12日 → サンゴ礁に おりる（Florida Museum・ADW）。
      // サンゴ礁に おりた 子どもの 半分ほどは 1〜2日で 食べられる（Almany & Webster 2006）。
      // 本当は おとなに なれるのは 数千〜数万匹に1匹ほど（1回 100〜1000個を 年に何十回も うむので）。
      // イソギンチャクでの くらしを 見せるため、1年まで 生きる割合を 約0.8%（120匹に1匹）に 多めにしてある。
      // イソギンチャクに すみついた後は 長生きで、メスの 平均余命 30年という 推定もある（Buston & García 2007・近い なかまの A. percula）
      survival: [[0, 1], [3 * D, 0.9], [7 * D, 0.8], [8 * D, 0.45], [12 * D, 0.15], [17 * D, 0.05], [20 * D, 0.028], [2 * M, 0.017], [6 * M, 0.011], [Y, 0.008], [3 * Y, 0.0055], [6 * Y, 0.0035], [10 * Y, 0.0015], [15 * Y, 0.0004], [22 * Y, 0.00005], [30 * Y, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.3 },
    { id: 'larva', name: 'ただよう 赤ちゃん', from: 7 * D, sprite: 'clownfish', scale: 0.3, habitat: 'ocean', say: ['日が しずんだあと、たまごから かえった', '夜の 海で、たまごから かえった'], icon: 'egg', big: 2 },
    { id: 'young', name: '子ども', from: 17 * D, sprite: 'clownfish', scale: 0.5, habitat: 'reef', say: '海の 底に おりて、オレンジ色の すがたに なった', icon: 'star', big: 2 },
    { id: 'adult', name: 'おとな', from: Y, sprite: 'clownfish', scale: 1, say: 'おとなの 大きさに なった', icon: 'star', big: 1 },
  ],

  stats: [
    { id: 'guard', label: '見守った たまご', unit: '個' },
    { id: 'laid', label: 'うんだ たまご', unit: '個' },
    { id: 'chase', label: '追いはらった 魚', unit: '匹' },
  ],

  events: [
    // たまご（お父さんが 世話をする）
    { at: [0, 2 * D], p: 0.9, text: ['お父さんが ひれで 新しい水を 送ってくれた', 'お父さんが ひれで、そよそよ 水を 送ってくれた'], icon: 'drop', mood: 'good', big: 1 },
    { at: [D, 6 * D], p: 0.4, text: 'お父さんが、わるくなった となりの たまごを とりのぞいた', icon: 'alert' },
    { at: [2 * D, 6 * D], p: 0.6, text: 'たまごの中で、銀色の 目が 光りだした', icon: 'look', big: 1 },
    { at: [D, 6 * D], p: 0.3, text: '夜、クモヒトデが たまごに 近づいてきた', icon: 'alert', mood: 'hard' },
    { at: [D, 6 * D], p: 0.3, text: 'たまごを ねらう ベラを、お父さんが 追いはらった', icon: 'alert', mood: 'hard' },

    // 海を ただよう 赤ちゃん
    { at: [7 * D, 8 * D], p: 0.9, text: '光に ひかれて、海の 上のほうへ のぼった', icon: 'sun' },
    { at: [7 * D, 10 * D], p: 0.8, text: 'はじめて プランクトンを 食べた', icon: 'apple', mood: 'good', big: 1 },
    { at: [8 * D, 16 * D], repeat: [1, 2], text: ['潮に のって、遠くまで ただよった', '星空の下、波に ゆられて ただよった', 'ほかの 魚の 赤ちゃんと いっしょに 流された'], icon: 'drop' },
    { at: [8 * D, 16 * D], p: 0.4, text: '大きな 口の 魚に ねらわれて、あわてて にげた', icon: 'alert', mood: 'hard' },
    { at: [11 * D, 17 * D], p: 0.6, text: 'からだに 白い しまもようが うかんできた', icon: 'star', big: 1 },
    { at: [13 * D, 17 * D], p: 0.6, text: 'サンゴ礁の 音と においを たどって 泳いだ', icon: 'look', big: 1 },

    // イソギンチャクを さがす
    { at: [17 * D, 19 * D], text: ['ゆらゆら ゆれる イソギンチャクを 見つけた', 'すみかに なる イソギンチャクに たどりついた'], icon: 'house', mood: 'good', big: 3, set: 'home' },
    { at: [17 * D, 25 * D], need: 'home', text: 'しょくしゅに 少しずつ ふれて、さされない からだに なった', icon: 'drop', big: 2 },
    { at: [18 * D, 2 * M], p: 0.4, need: 'home', text: '先に すむ 大きな 魚に、なんども 追いはらわれた', icon: 'alert', mood: 'hard' },
    { at: [20 * D, 3 * M], p: 0.25, need: 'home', text: 'となりの イソギンチャクへ、思いきって 引っこした', icon: 'box' },
    { at: [M, 6 * M], p: 0.7, need: 'home', text: 'イソギンチャクの むれで、いちばん 小さな なかまに なった', icon: 'friends' },

    // イソギンチャクでの くらし
    { at: [M, 15 * Y], repeat: [1, 3], need: 'home', text: ['しょくしゅの あいだで ぐっすり 眠った', 'イソギンチャクの 食べのこしを もらった', 'イソギンチャクの まわりを ひらひら 泳いだ', 'イソギンチャクの ごみを つついて きれいにした'], icon: 'sleep', mood: 'good' },
    { at: [2 * M, 6 * Y], p: 0.5, need: 'home', text: 'しょくしゅを かじりにきた チョウチョウウオを 追いはらった', icon: 'alert', mood: 'good', add: { chase: [1, 3] } },
    { at: [3 * M, 10 * Y], p: 0.3, need: 'home', text: 'イソギンチャクの 下に すむ 小さな エビと なかよくなった', icon: 'friends', mood: 'good' },
    { at: [3 * M, 10 * Y], p: 0.35, need: 'home', text: 'ダイバーの カメラに、ぷいっと 向かっていった', icon: 'look' },
    { at: [6 * M, 2 * Y], p: 0.6, need: 'home', text: 'からだの オレンジ色が、こく あざやかに なった', icon: 'star', mood: 'good' },
    { at: [Y, 12 * Y], p: 0.25, need: 'home', text: '海の水が 熱くなり、イソギンチャクが 白く なった', icon: 'sun', mood: 'hard', big: 1, set: 'bleach' },
    { at: [Y, 13 * Y], p: 0.6, need: 'bleach', text: 'イソギンチャクの 色が もどって、ほっとした', icon: 'heart', mood: 'good', big: 1 },
    { at: [Y, 15 * Y], p: 0.3, need: 'home', text: '台風の 大波で、すみかが ぐらぐら ゆれた', icon: 'rain', mood: 'hard' },

    // オス（2番めに 大きくなると、子どもを のこせる オスになる）
    { at: [8 * M, 3 * Y], p: 0.8, need: 'home', text: 'むれで 2番めの 大きさになり、おとなの オスに なった', icon: 'star', big: 2, set: 'male' },
    { at: [10 * M, 4 * Y], need: 'male', text: 'パートナーが うんだ {n}個の たまごを、ひれで あおいで 守った', icon: 'egg', mood: 'good', big: 3, add: { guard: [200, 900] }, set: 'dad' },
    { at: [Y, 15 * Y], p: 0.85, need: 'dad', text: 'この1年で、{n}個の たまごの 世話をした', icon: 'egg', mood: 'good', big: 1, add: { guard: [4000, 12000] } },
    { at: [Y, 15 * Y], p: 0.6, need: 'dad', text: 'たまごが かえる夜、ひれで 水を 強く あおいで 手伝った', icon: 'drop', mood: 'good' },
    { at: [Y, 15 * Y], p: 0.6, need: 'dad', text: 'かえった 赤ちゃんたちが、夜の 海へ 旅立っていった', icon: 'baby', mood: 'good', big: 2 },
    { at: [3 * Y, 20 * Y], p: 0.5, need: 'dad', text: 'ことしも 何千個もの たまごを、だいじに 守った', icon: 'egg', mood: 'good', add: { guard: [4000, 12000] } },

    // メス（むれの メスが いなくなると、いちばん 大きな オスが メスに かわる）
    { at: [2 * Y, 15 * Y], p: 0.4, need: 'male', text: 'むれの メスが いなくなり、オスから メスに かわった', icon: 'crown', mood: 'good', big: 3, set: 'female' },
    { at: [2 * Y, 16 * Y], p: 0.9, need: 'female', text: '下から 育ってきた オスと、新しい ペアに なった', icon: 'heart', mood: 'good', big: 2, set: 'paired' },
    { at: [2 * Y, 18 * Y], p: 0.9, need: 'paired', text: 'この1年で、{n}個の たまごを 岩に うみつけた', icon: 'egg', mood: 'good', big: 3, add: { laid: [5000, 15000] } },
    { at: [4 * Y, 25 * Y], p: 0.6, need: 'female', text: 'むれで いちばん 大きな からだで、みんなを まとめた', icon: 'crown', mood: 'good', big: 1 },

    // 長生き
    { at: [6 * Y, 25 * Y], p: 0.6, need: 'home', text: 'イソギンチャクの いちばん 古い なかまに なった', icon: 'star', mood: 'good', big: 2 },
    { at: [10 * Y, 30 * Y], p: 0.5, need: 'home', text: '同じ イソギンチャクで、10年を こえて くらした', icon: 'house', mood: 'good', big: 2 },
  ],

  deaths: [
    { at: [0, 7 * D], w: 5, text: ['たまごのまま、夜の 魚に 食べられた', 'たまごのまま、ちいさな いのちを 終えた'] },
    { at: [7 * D, 17 * D], w: 6, text: ['ただよう うちに、大きな 魚に 食べられた', '食べものに 出会えず、海の上で しずかに 眠った', 'クラゲの しょくしゅに つかまって、いのちを 終えた'] },
    { at: [15 * D, 40 * D], w: 5, need: '!home', text: 'イソギンチャクを 見つける 前に、いのちを 終えた' },
    { at: [17 * D, 3 * M], w: 4, need: 'home', text: '岩場に おりて すぐ、待ちぶせの 魚に 食べられた' },
    { at: [M, 6 * Y], w: 2, need: ['home', '!male'], text: 'むれから 追い出されて、外の海で 魚に つかまった' },
    { at: [Y, 20 * Y], w: 2, need: 'bleach', text: 'すみかの イソギンチャクが 弱り、いっしょに 力つきた' },
    { at: [3 * M, 30 * Y], w: 1, need: 'home', text: '病気に かかって、イソギンチャクの 中で 眠った' },
    { at: [8 * Y, 30 * Y], w: 5, need: 'home', text: 'イソギンチャクに つつまれて、しずかに 眠った' },
    { at: [3 * Y, 30 * Y], w: 3, need: 'female', text: 'パートナーに 見守られて、しずかに いのちを 終えた' },
  ],

  titles: [
    { need: 'female', text: 'オスから メスに なった イソギンチャクの 女王' },
    { stat: { guard: 20000 }, text: '{guard}個の たまごを 守った お父さん' },
    { need: ['male', '!female'], text: 'イソギンチャクを 守りつづけた お父さん' },
    { need: 'home', long: 0.002, text: 'サンゴ礁の 長老に なった カクレクマノミ' },
    { need: ['home', '!male'], minAge: 2 * M, text: 'イソギンチャクで 育った 小さな なかま' },
    { maxAge: 7 * D, text: 'たまごの中で 海の音を 聞いた いのち' },
    { minAge: 7 * D, maxAge: 17 * D, text: '海を ただよった 小さな 旅人' },
    { need: 'home', maxAge: 2 * M, text: 'イソギンチャクに たどりついた 小さな いのち' },
  ],

  facts: [
    'カクレクマノミは みんな オスとして 育ち、むれで いちばん 大きな 1匹が メスに なります',
    'たまごの 世話は おもに お父さんの しごとで、6〜8日ほどで かえります',
    'かえった 赤ちゃんは 8〜12日ほど 海を ただよってから、すみかの イソギンチャクを さがします',
    'からだを つつむ ねばねばした 膜のおかげで、イソギンチャクに さされません',
    '野生での 寿命は 6〜10年ほど と されています',
    '近い なかまの クマノミでは、メスの 平均余命が 30年という 推定も あります',
  ],

  sources: [
    'https://animaldiversity.org/accounts/Amphiprion_ocellaris/ (ADW・分布・たまご100〜1000個・ふ化6〜8日・浮遊8〜12日・寿命6〜10年・性転換)',
    'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/amphiprion-ocellaris (フロリダ自然史博物館・すみかの イソギンチャク3種・粘液・オスの世話)',
    'https://sites.bu.edu/bustonlab/research/social-evolution/extraordinary-life-spans-of-clown-anemonefish/ (Buston & García 2007 A. percula メスの平均余命30年)',
    'https://researchonline.jcu.edu.au/1459/ (Almany & Webster 2006 サンゴ礁の魚は おりて1〜2日で 約56%が食べられる)',
  ],
};
