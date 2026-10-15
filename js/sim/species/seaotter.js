// ラッコ: 海に浮かんでくらす。おなかの上で貝を石で割る・海そうを巻いて眠る・子はお母さんのおなかの上で育つ
import { H, D, W, M, Y } from '../units.js?v=1.0.3';

export default {
  id: 'seaotter',
  name: 'ラッコ',
  kind: 'animal',
  weight: 1,
  realCount: 1.1e5, // 世界で 約10万8千頭（IUCN レッドリスト・Doroff & Burdin）
  refDays: 16 * Y, // メスは 15〜20歳、オスは 10〜15歳まで 生きる（COSEWIC 2007）
  habitat: 'ocean',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で、お母さんの おなかの上に うまれた', '{place}の 波の上で うまれた'],

  variants: [
    {
      id: 'wild', label: 'ラッコ', w: 1, habitat: 'ocean',
      places: [
        { text: 'アラスカの プリンス・ウィリアム湾', lat: 60.7, lon: -147.0 },
        { text: 'アラスカの アリューシャン列島', lat: 51.9, lon: -176.6 },
        { text: 'ロシアの カムチャツカの 海', lat: 52.9, lon: 158.7 },
        { text: 'カナダの バンクーバー島の 海', lat: 49.9, lon: -127.3 },
        { text: 'カリフォルニアの モントレー湾', lat: 36.62, lon: -121.9 },
        // 北海道は いま数頭だけ（2018年から霧多布岬で子育てが確認）。ここでは ほかの場所と同じ出やすさにしている
        { text: '北海道の 霧多布（きりたっぷ）の 海', lat: 43.08, lon: 145.16 },
      ],
      // 離乳（約6か月）までに 死ぬのは カリフォルニアで約40%・アラスカで15〜25%（COSEWIC 2007）
      // おとなの 年間生存率は メス 89〜96%・オス 86〜91%（コディアック島, Monson ほか）
      // 性別で 曲線を分ける仕組みがないので、オスとメスを まぜた曲線にしている
      survival: [[0, 1], [W, 0.95], [M, 0.88], [3 * M, 0.8], [6 * M, 0.72], [Y, 0.6], [2 * Y, 0.52], [4 * Y, 0.45], [6 * Y, 0.39], [8 * Y, 0.32], [10 * Y, 0.24], [12 * Y, 0.15], [14 * Y, 0.08], [16 * Y, 0.035], [18 * Y, 0.012], [20 * Y, 0.003], [23 * Y, 0]],
    },
  ],

  stages: [
    { id: 'pup', name: '赤ちゃんラッコ', from: 0, sprite: 'seaotter', scale: 0.45 },
    { id: 'young', name: '若いラッコ', from: 6 * M, sprite: 'seaotter', scale: 0.75, say: 'お母さんから はなれて、ひとりで 生きはじめた', icon: 'feather', big: 2 },
    { id: 'adult', name: 'おとなのラッコ', from: 3 * Y, sprite: 'seaotter', scale: 1, say: 'りっぱな おとなの ラッコに なった', icon: 'star', big: 1 },
    { id: 'senior', name: '年をとったラッコ', from: 12 * Y, sprite: 'seaotter', scale: 0.95, say: '歯が すりへって、かたい 貝が にがてに なった', icon: 'sleep' },
  ],

  stats: [
    { id: 'shells', label: '割った 貝', unit: 'こ' },
    { id: 'pups', label: '子ども', unit: '頭' },
    { id: 'friends', label: 'いっしょに 浮かんだ 仲間', unit: '頭' },
  ],

  events: [
    // 赤ちゃんのころ（お母さんの おなかの上）
    { at: [0, 2 * D], text: 'お母さんに 毛を なめてもらって、ふわふわに なった', icon: 'heart', mood: 'good', big: 1 },
    { at: [D, 2 * W], text: 'ふわふわの 毛の おかげで、ぷかぷか 浮かんでいた', icon: 'drop' },
    { at: [3 * D, 4 * W], p: 0.8, text: 'お母さんが もぐるあいだ、海そうに くるまれて 待った', icon: 'look' },
    { at: [2 * W, 3 * M], p: 0.7, text: 'お母さんの おなかの上で、お乳を のんで 眠った', icon: 'sleep', mood: 'good' },
    { at: [M, 2 * M], text: 'はじめて 自分で 水に もぐってみた', icon: 'drop', big: 1 },
    { at: [M, 6 * M], p: 0.3, text: 'ワシが 空を まわっていて、お母さんに しがみついた', icon: 'alert', mood: 'hard' },
    { at: [2 * M, 5 * M], text: 'お母さんの まねをして、石で 貝を たたいてみた', icon: 'look', big: 1 },
    { at: [3 * M, 6 * M], p: 0.5, text: 'はじめて 自分で ウニを とってきた', icon: 'apple', mood: 'good' },

    // ひとりだちしてから
    { at: [6 * M, 20 * Y], repeat: [2, 4], text: ['おなかの上で、貝を 石で 割って 食べた', 'カニを つかまえて、おなかを テーブルに した', 'ウニを 両手で くるくる まわして 食べた', 'ムール貝を 何こも かかえて、海面に もどった', '石を おなかに のせて、貝を カンカン たたいた', '海の 底で、大きな 二枚貝を ほりだした'], icon: 'apple', mood: 'good', add: { shells: [300, 3000] } },
    { at: [6 * M, 3 * Y], p: 0.6, text: 'お気に入りの 石を 見つけて、わきの下に しまった', icon: 'look', mood: 'good', big: 1, set: 'stone' },
    { at: [Y, 15 * Y], p: 0.45, need: 'stone', text: 'お気に入りの 石を、何年も 使いつづけた', icon: 'star' },
    { at: [6 * M, 15 * Y], repeat: [1, 2], text: ['海そうを 体に 巻きつけて、流されないように 眠った', '波の上で あおむけに なって、ぐっすり 眠った'], icon: 'sleep', mood: 'good' },
    { at: [6 * M, 12 * Y], p: 0.55, text: '眠るとき、となりの ラッコと 手を つないだ', icon: 'friends', mood: 'good', big: 2, set: 'hands' },
    { at: [Y, 10 * Y], p: 0.5, text: '何十頭もの 仲間と、いかだのように 浮かんで 休んだ', icon: 'friends', mood: 'good', add: { friends: [10, 60] } },
    { at: [6 * M, 15 * Y], repeat: [1, 2], text: ['1時間 ちかく、ていねいに 毛づくろいを した', '体を くるくる まわして、毛に 空気を 入れた'], icon: 'drop' },
    { at: [Y, 12 * Y], p: 0.35, text: '冬の あらしの日、えさが とれずに おなかが すいた', icon: 'snow', mood: 'hard' },
    { at: [Y, 12 * Y], p: 0.3, text: '岩に 貝を 打ちつけて、じょうずに 割った', icon: 'star' },
    { at: [Y, 12 * Y], p: 0.3, text: '貝が へってきて、遠くまで えさを さがしに 行った', icon: 'plane', mood: 'hard' },
    { at: [Y, 14 * Y], p: 0.3, text: 'シャチの かげを 見て、海そうの 林へ にげこんだ', icon: 'alert', mood: 'hard' },
    { at: [Y, 14 * Y], p: 0.25, text: 'サメに 追われたが、ぎりぎりで にげきった', icon: 'alert', mood: 'hard' },
    { at: [2 * Y, 12 * Y], p: 0.3, text: 'ウニを たくさん 食べて、海そうの 林を 守った', icon: 'flower', mood: 'good', big: 1 },
    { at: [2 * Y, 14 * Y], p: 0.3, text: '岸から 双眼鏡で 見ている 人たちに 気づいた', icon: 'look' },
    { at: [2 * Y, 14 * Y], p: 0.25, text: '漁船の そばまで 泳いでいって、ふしぎそうに ながめた', icon: 'look' },
    { at: [Y, 10 * Y], p: 0.35, need: 'm', text: 'オスばかりの 群れで、のんびり くらした', icon: 'friends', add: { friends: [5, 30] } },
    { at: [4 * Y, 12 * Y], p: 0.45, need: 'm', text: 'なわばりを もって、メスが 来るのを 待った', icon: 'house' },

    // お母さんになる（ほぼ毎年1頭。ふたごは まれ）。くりかえしは2年ずつの窓に分け、子どもの数は1〜2頭ずつ足す
    { at: [3 * Y, 5 * Y], p: 0.85, need: 'f', text: 'はじめての 赤ちゃんを うんだ', icon: 'baby', mood: 'good', big: 3, add: { pups: 1 }, set: 'mother' },
    { at: [5 * Y, 7 * Y], p: 0.85, need: 'mother', text: ['また 赤ちゃんを うんだ', 'おなかの上に、新しい 赤ちゃんが やってきた'], icon: 'baby', mood: 'good', big: 1, add: { pups: [1, 2] } },
    { at: [7 * Y, 9 * Y], p: 0.85, need: 'mother', text: ['また 赤ちゃんを うんだ', '海の上で、また 赤ちゃんを うんだ'], icon: 'baby', mood: 'good', big: 1, add: { pups: [1, 2] } },
    { at: [9 * Y, 11 * Y], p: 0.8, need: 'mother', text: ['おなかの上に、新しい 赤ちゃんが やってきた', 'ことしも 赤ちゃんを うんだ'], icon: 'baby', mood: 'good', big: 1, add: { pups: [1, 2] } },
    { at: [11 * Y, 14 * Y], p: 0.7, need: 'mother', text: ['ことしも 赤ちゃんを うんだ', '年を とっても、また 赤ちゃんを うんだ'], icon: 'baby', mood: 'good', big: 1, add: { pups: [1, 2] } },
    { at: [3 * Y, 16 * Y], p: 0.8, need: 'mother', text: '赤ちゃんを おなかに のせたまま、貝を 割って 食べた', icon: 'heart', mood: 'good', big: 1 },
    { at: [3 * Y, 16 * Y], p: 0.5, need: 'mother', text: 'もぐる前に、赤ちゃんを 海そうで くるんだ', icon: 'heart' },
    { at: [3.5 * Y, 16 * Y], p: 0.6, need: 'mother', text: '育てた 子どもが、ひとりだちして 泳いでいった', icon: 'feather', big: 2 },
    { at: [4 * Y, 16 * Y], p: 0.3, need: 'mother', text: '赤ちゃんを 守れず、しばらく 海を ただよった', icon: 'rain', mood: 'hard' },

    // 年をとってから
    { at: [12 * Y, 22 * Y], p: 0.6, text: 'やわらかい えさを えらんで 食べるように なった', icon: 'apple' },
    { at: [13 * Y, 22 * Y], p: 0.4, text: '日なたの 波の上で、うとうとする 時間が ふえた', icon: 'sun', mood: 'good' },
    { at: [10 * Y, 22 * Y], p: 0.4, need: 'mother', text: '子どもたちの 育った 海で、のんびり すごした', icon: 'heart', mood: 'good', big: 2 },
  ],

  deaths: [
    { at: [0, 3 * M], w: 3, text: 'あらしの 夜に お母さんと はぐれて、ちいさな いのちを 終えた' },
    { at: [0, 6 * M], w: 2, text: 'ちいさな 体が 冷えて、しずかに 眠った' },
    { at: [0, Y], w: 1, text: 'ワシに つかまって、ちいさな いのちを 終えた' },
    { at: [6 * M, 3 * Y], w: 3, text: 'ひとりだちしたあと、えさを うまく とれずに 眠った' },
    { at: [6 * M, 18 * Y], w: 1, text: 'シャチに おそわれて、いのちを 終えた' },
    { at: [6 * M, 18 * Y], w: 1.5, text: 'サメに ねらわれて、いのちを 終えた' },
    { at: [Y, 18 * Y], w: 1.5, text: 'えさの たりない 冬を こせずに、しずかに 眠った' },
    { at: [Y, 25 * Y], w: 2, text: '病気に かかって、海の上で しずかに 眠った' },
    { at: [3 * Y, 18 * Y], w: 2, need: 'mother', text: '子育てで 体力を 使いはたして、しずかに 眠った' },
    { at: [10 * Y, 25 * Y], w: 4, text: '歯が すりへり、海そうの 林で しずかに 眠った' },
    { at: [12 * Y, 25 * Y], w: 4, text: '波に ゆられながら、眠るように いのちを 終えた' },
  ],

  titles: [
    { stat: { pups: 7 }, text: '{pups}頭の 赤ちゃんを 育てた 海の お母さん' },
    { need: 'hands', long: 0.4, text: '手を つないで 眠った なかよしの ラッコ' },
    { need: 'stone', long: 0.25, text: 'ひとつの 石を 大切に 使いつづけた ラッコ' },
    { stat: { shells: 10000 }, text: '{shells}この 貝を 割った 貝わりの 名人' },
    { need: 'm', long: 0.1, text: '海そうの 林の 主（ぬし）と よばれた オス' },
    { long: 0.03, text: '歯が すりへるまで 生きた 長生きの ラッコ' },
    { short: 0.9, text: 'お母さんの おなかの上で、すこしだけ 海を 見た' },
  ],

  facts: [
    'ラッコの 毛は 動物の中で いちばん 密で、1平方センチに 10万本を こえます',
    'ラッコは 1日に 体重の 4分の1ほどの えさを 食べます',
    'わきの下の 皮の たるみに、えさや 石を しまっておけます',
    '子どもは 6〜8か月ほど、お母さんの そばで 育ちます',
    '世界の ラッコは 約10万頭。北海道の 東の 海でも、野生の ラッコが 子育てを しています',
  ],

  sources: [
    'https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/sea-otter-2007/chapter-8.html (COSEWIC 2007: 寿命・離乳まで6〜8か月・離乳前の死亡率)',
    'https://pubs.usgs.gov/publication/70181825 (Monson ほか: コディアック島の 離乳前生存85%・おとなの年間生存率)',
    'https://otterspecialistgroup.org/Species/Enhydra_lutris.html (IUCN カワウソ専門家グループ: 世界で約10万8千頭)',
    'https://www.montereybayaquarium.org/animals/animals-a-to-z/sea-otter (モントレーベイ水族館: 毛の密度・体重の4分の1・わきの下のポケット・石で割る)',
    'https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2020.00582/pdf (カリフォルニアの死因: サメ・感染症・子育て末期の衰弱)',
    'https://www.discovermagazine.com/planet-earth/sea-otters-hold-hands-while-sleeping-and-they-even-cuddle (海そうを巻く・手をつなぐ)',
    'https://tabi-mag.jp/kiritappu-seaotter/ (北海道 浜中町 霧多布岬の 野生ラッコの子育て)',
  ],
};
