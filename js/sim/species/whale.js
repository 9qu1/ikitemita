// ザトウクジラ: 冬は沖縄・ハワイなどの暖かい海で子育て、夏はアラスカなどの冷たい海で食べる。オスは歌う・泡の網で漁をする・長生き
import { H, D, W, M, Y } from '../units.js?v=1.0.1';

// 子クジラの1年めの生存は 約80〜88%・それより上は 年に約96〜98%（Barlow & Clapham 1997・北太平洋の共同研究 SPLASH ほか）
// 寿命は 80〜90年ほど（NOAA）。50歳から先は すこしずつ 減りを 早めている
const SURVIVAL = [[0, 1], [W, 0.97], [M, 0.94], [3 * M, 0.9], [6 * M, 0.86], [Y, 0.82], [3 * Y, 0.77], [10 * Y, 0.63], [20 * Y, 0.47], [30 * Y, 0.35], [40 * Y, 0.26], [50 * Y, 0.17], [60 * Y, 0.09], [70 * Y, 0.038], [80 * Y, 0.012], [90 * Y, 0.003], [100 * Y, 0]];

// 2回目からの出産（2〜3年おき）。数年ずつの窓に分け、子どもの数は1〜2頭ずつ足す
const LATER = [
  [12 * Y, 16 * Y, 'あたたかい 海で、2頭めの 赤ちゃんを うんだ'],
  [16 * Y, 21 * Y, '島かげの おだやかな 海で、また 赤ちゃんを うんだ'],
  [21 * Y, 27 * Y, '新しい 赤ちゃんを、水面へ そっと おしあげた'],
  [27 * Y, 34 * Y, 'なれた 子育てで、また 赤ちゃんを 育てた'],
  [34 * Y, 42 * Y, '年を 重ねても、また 赤ちゃんを うんだ'],
  [42 * Y, 52 * Y, 'ベテランの お母さんとして、また 赤ちゃんを 育てた'],
];

export default {
  id: 'whale',
  name: 'ザトウクジラ',
  kind: 'animal',
  weight: 1,
  realCount: 1.35e5, // 世界で 約13万5千頭・うち おとな 約8万4千頭（IUCN レッドリスト 2018）
  refDays: 70 * Y,
  habitat: 'ocean',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で うまれた', '冬の {place}で うまれた'],

  variants: [
    {
      // 西部北太平洋の群れ: 冬は 沖縄・小笠原・奄美、夏は ロシア（カムチャツカ・コマンドル諸島）などで食べる
      id: 'west', label: 'ザトウクジラ', w: 0.35, habitat: 'ocean',
      places: [
        { text: '沖縄の 慶良間（けらま）の 海', lat: 26.2, lon: 127.3 },
        { text: '小笠原の 海', lat: 27.08, lon: 142.2 },
        { text: '奄美大島の 海', lat: 28.35, lon: 129.5 },
      ],
      fields: { feed: 'カムチャツカの 海' },
      survival: SURVIVAL,
    },
    {
      // ハワイの群れ: 夏は アラスカで食べる
      id: 'hawaii', label: 'ザトウクジラ', w: 0.35, habitat: 'ocean',
      places: [
        { text: 'ハワイの マウイ島の 海', lat: 20.8, lon: -156.6 },
        { text: 'ハワイ島の 沖', lat: 19.9, lon: -156.1 },
      ],
      fields: { feed: 'アラスカの 海' },
      survival: SURVIVAL,
    },
    {
      // 南半球の群れ: 南の冬（6〜10月）に トンガ・オーストラリアで子育て、南の夏は 南極で食べる
      id: 'south', label: 'ザトウクジラ', w: 0.3, habitat: 'ocean',
      places: [
        { text: 'トンガの 海', lat: -18.65, lon: -173.98 },
        { text: 'オーストラリアの ハービー湾', lat: -25.2, lon: 152.9 },
      ],
      fields: { feed: '南極の 海' },
      survival: SURVIVAL,
    },
  ],

  stages: [
    { id: 'calf', name: '子クジラ', from: 0, sprite: 'whale', scale: 0.5 },
    { id: 'young', name: '若いクジラ', from: Y, sprite: 'whale', scale: 0.75, say: 'お母さんから はなれて、ひとりで 旅を はじめた', icon: 'feather', big: 2 },
    { id: 'adult', name: 'おとなのクジラ', from: 7 * Y, sprite: 'whale', scale: 1, say: 'りっぱな おとなの クジラに なった', icon: 'star', big: 1 },
    { id: 'elder', name: '長老のクジラ', from: 50 * Y, sprite: 'whale', scale: 1, say: '体じゅうに、長い 旅の 傷あとが ふえた', icon: 'star' },
  ],

  stats: [
    { id: 'calves', label: '子ども', unit: '頭' },
    { id: 'songs', label: 'うたった 歌', unit: '曲' },
    { id: 'friends', label: 'いっしょに 漁をした 仲間', unit: '頭' },
  ],

  events: [
    // 子クジラ（0〜1歳）
    { at: [0, H], text: 'お母さんに 水面へ おしあげられて、はじめて 息を した', icon: 'drop', big: 2 },
    { at: [D, 3 * W], text: 'お母さんの こい お乳を のんで、ぐんぐん 大きくなった', icon: 'drop', mood: 'good' },
    { at: [W, 2 * M], p: 0.7, text: 'お母さんの 胸びれの 下で、すやすや 眠った', icon: 'sleep', mood: 'good' },
    { at: [W, 2 * M], p: 0.5, text: 'お母さんの そばを、知らない オスが ついてきた', icon: 'look' },
    { at: [3 * W, 3 * M], p: 0.6, text: 'お母さんの まねをして、小さく ジャンプしてみた', icon: 'star', mood: 'good', big: 1 },
    { at: [M, 3 * M], text: '胸びれで 水面を ぱちゃぱちゃ たたいて あそんだ', icon: 'ball', mood: 'good' },
    { at: [2 * M, 4 * M], text: '{feed}を めざして、はじめての 長い 旅に 出た', icon: 'plane', big: 2 },
    { at: [2 * M, 6 * M], p: 0.35, text: 'シャチの 群れに ねらわれ、お母さんに 守られた', icon: 'alert', mood: 'hard' },
    { at: [4 * M, 7 * M], p: 0.6, text: '{feed}で、お母さんが えさを とる すがたを 見ていた', icon: 'look' },
    { at: [8 * M, Y], p: 0.6, text: '冬が 来て、生まれた {place}へ もどった', icon: 'sun' },

    // 若いころ
    { at: [Y, 6 * Y], p: 0.5, text: '同じくらいの 若い クジラと、ならんで 泳いだ', icon: 'friends', mood: 'good' },
    { at: [Y, 6 * Y], p: 0.6, text: 'はじめて 自分で オキアミの 群れを 見つけた', icon: 'apple', big: 1 },
    { at: [Y, 10 * Y], p: 0.4, text: 'えさの すくない 年で、おなかを すかせて 旅をした', icon: 'rain', mood: 'hard' },

    // 毎年の 旅と くらし
    { at: [Y, 80 * Y], repeat: [2, 3], text: ['夏の {feed}で、毎日 たっぷり 食べた', '冬の あたたかい 海へ、何千キロも 泳いだ', 'ひと月 ちかく、休まず 泳ぎつづけた', '冷たい 海で、オキアミの 群れを 追いかけた', '星空の 下、仲間と ならんで 南北を 旅した'], icon: 'plane' },
    { at: [Y, 60 * Y], repeat: [1, 2], text: ['大きく ジャンプして、海に しぶきを 上げた', '尾びれで 水面を たたいて、大きな 音を たてた'], icon: 'star', mood: 'good' },
    { at: [2 * Y, 50 * Y], p: 0.4, text: '大きく 口を あけて、小魚の 群れを ひとのみに した', icon: 'fish', mood: 'good' },
    { at: [2 * Y, 40 * Y], p: 0.5, text: '仲間と あわの あみを つくって、魚を 一気に 食べた', icon: 'fish', mood: 'good', big: 2, set: 'bubble', add: { friends: [3, 12] } },
    { at: [5 * Y, 50 * Y], p: 0.4, need: 'bubble', text: 'あわの あみの 名人として、仲間を 先導した', icon: 'crown', mood: 'good', big: 1, add: { friends: [3, 10] } },
    { at: [2 * Y, 60 * Y], p: 0.3, text: '船の 人たちが、尾びれの もようを 写真に とった', icon: 'look' },
    { at: [Y, 60 * Y], p: 0.3, text: 'イルカの 群れと、しばらく いっしょに 泳いだ', icon: 'friends', mood: 'good' },
    { at: [3 * Y, 60 * Y], p: 0.25, text: '漁の ロープが ひれに からまり、なんとか ほどけた', icon: 'alert', mood: 'hard' },
    { at: [3 * Y, 60 * Y], p: 0.2, text: '大きな 船の 音で、仲間の 声が きこえにくかった', icon: 'alert', mood: 'hard' },

    // オス: 歌う
    { at: [5 * Y, 60 * Y], repeat: [2, 3], need: 'm', text: ['あたたかい 海で、何時間も 歌を うたいつづけた', 'ことしの 流行の 歌を おぼえて うたった', '海の 底へ ひびく、ひくい 歌を うたった'], icon: 'music', big: 1, add: { songs: [20, 200] } },
    { at: [6 * Y, 50 * Y], p: 0.5, need: 'm', text: 'メスを めぐって、オスどうしで 体を ぶつけあった', icon: 'alert' },
    { at: [7 * Y, 40 * Y], p: 0.3, need: 'm', text: 'となりの 海から つたわった 新しい 歌を まねた', icon: 'music', mood: 'good' },

    // メス: 2〜3年に1頭 うむ（おとなに なるのは 4〜10歳・おなかの中に 約11か月）
    { at: [6 * Y, 12 * Y], p: 0.85, need: 'f', text: 'はじめての 赤ちゃんを うんだ', icon: 'baby', mood: 'good', big: 3, add: { calves: 1 }, set: 'mother' },
    ...LATER.map(([a, b, text]) => ({ at: [a, b], p: 0.8, need: 'mother', text, icon: 'baby', mood: 'good', big: 1, add: { calves: [1, 2] } })),
    { at: [7 * Y, 60 * Y], p: 0.6, need: 'mother', text: '子どもに、{feed}までの 道を 教えた', icon: 'plane', mood: 'good', big: 2 },
    { at: [7 * Y, 60 * Y], p: 0.4, need: 'mother', text: '子どもが ひとりだちして、別の 群れへ 泳いでいった', icon: 'feather' },
    { at: [8 * Y, 60 * Y], p: 0.3, need: 'mother', text: '子どもを シャチから 守るため、何時間も 立ちむかった', icon: 'alert', mood: 'hard' },

    // 年をとってから
    { at: [40 * Y, 100 * Y], p: 0.5, text: '体に ついた フジツボが、すっかり ふえた', icon: 'look' },
    { at: [50 * Y, 100 * Y], p: 0.4, text: '若い クジラたちが、あとを ついて 泳いできた', icon: 'friends', mood: 'good', big: 1 },
    { at: [60 * Y, 100 * Y], p: 0.4, text: '何十回目かの 旅で、なつかしい {place}に 帰った', icon: 'sun', mood: 'good', big: 2 },
  ],

  deaths: [
    { at: [0, Y], w: 3, text: 'シャチに おそわれて、ちいさな いのちを 終えた' },
    { at: [0, 3 * M], w: 2, text: 'うまれつき 体が 弱く、お母さんの そばで 眠った' },
    { at: [2 * M, Y], w: 2, text: '長い 旅に ついていけず、いのちを 終えた' },
    { at: [Y, 12 * Y], w: 2, text: 'えさの すくない 年に、体力が つきて 眠った' },
    { at: [Y, 100 * Y], w: 0.6, text: '漁の ロープに からまって、いのちを 終えた' },
    { at: [Y, 100 * Y], w: 0.6, text: '大きな 船に ぶつかって、いのちを 終えた' },
    { at: [Y, 10 * Y], w: 0.8, text: 'シャチの 群れに おそわれて、いのちを 終えた' },
    { at: [12 * Y, 100 * Y], w: 1.5, text: 'えさの とれない 夏が つづいて、しずかに 眠った' },
    { at: [5 * Y, 100 * Y], w: 2, text: '病気に かかって、海の 中で しずかに 眠った' },
    { at: [40 * Y, 100 * Y], w: 5, text: '長い 旅を 終えて、深い 海へ しずかに しずんでいった' },
    { at: [50 * Y, 100 * Y], w: 4, text: '{place}の 近くで、眠るように いのちを 終えた' },
  ],

  titles: [
    { need: 'm', stat: { songs: 300 }, text: '海に ひびく 歌を うたいつづけた 歌い手' },
    { stat: { calves: 8 }, text: '{calves}頭の 子どもを 育てた 大家族の お母さん' },
    { need: 'bubble', long: 0.35, text: 'あわの あみで 仲間と 漁をした 名人' },
    { long: 0.03, text: '何十回も 海を 往復した 長老の クジラ' },
    { minAge: 2 * M, maxAge: Y, text: 'はじめての 長い 旅を した 子クジラ' },
    { short: 0.9, text: 'お母さんの となりで、ほんの すこし 海を 見た' },
  ],

  facts: [
    'オスは 子育ての 海で 長い 歌を うたい、歌の 流行は 年ごとに 変わります',
    '尾びれの 白黒の もようは 1頭ずつ ちがい、見分けに 使われます',
    '胸びれは 体の 長さの 3分の1 ちかくも あります',
    'ザトウクジラの 寿命は 80〜90年ほど と 考えられています',
    '赤ちゃんは うまれたとき 4〜5メートル。世界に 約13万5千頭が います（2018年）',
  ],

  sources: [
    'https://www.fisheries.noaa.gov/species/humpback-whale (NOAA: 寿命80〜90年・成熟4〜10歳・妊娠11か月・2〜3年に1頭・赤ちゃん13〜16フィート・泡の網)',
    'https://digitalcommons.unl.edu/usdeptcommercepub/167 (Barlow & Clapham 1997: 子クジラ生存0.875・それ以上0.960)',
    'https://napier-repository.worktribe.com/output/275958/estimating-the-mortality-rate-of-humpback-whale-calves-in-the-central-north-pacific-ocean (北太平洋中部の 子クジラの死亡率)',
    'https://www.nps.gov/glba/learn/nature/upload/Whale_Fact_Sheet_updated_April2018_508.pdf (グレーシャーベイ国立公園: 北太平洋の 子クジラの1年生存 約80%)',
    'https://speciesstatus.sanbi.org/assessment/last-assessment/2125/ (IUCN 2018: 世界で約13万5千頭・おとな約8万4千頭)',
    'https://www.environment.nsw.gov.au/topics/animals-and-plants/native-animals/native-animal-facts/marine-mammals/whales/humpback-whale (胸びれは体長の約3分の1・尾びれのもようで見分ける)',
    'https://www.env.go.jp/nature/biodic/kaiyo-hozen/kaiiki/hyoso/408.html (環境省: 小笠原は 12〜5月に来遊する繁殖海域)',
    'https://ryukyushimpo.jp/news/entry-1189547.html (美ら島財団: ロシア・沖縄・フィリピン間の回遊)',
    'https://en.wikipedia.org/wiki/Whale_vocalization (歌は10〜20分・何時間もくりかえす・流行が変わる)',
  ],
};
