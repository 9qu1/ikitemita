// ライオン（アフリカのサバンナと、インドのギルの森）
//   オスとメスで 一生が大きくちがう（オスは2〜4歳で群れを出て、メスの多くは一生同じ群れ）。
//   寿命の曲線もオスとメスでちがうので、sexes ではなく variant でオス・メスを分け、タグ 'm' / 'f' をつける
import { H, D, W, M, Y } from '../units.js?v=1.0.2';

const PLACES = [
  { text: 'タンザニアの セレンゲティ', lat: -2.33, lon: 34.83 },
  { text: 'ケニアの マサイマラ', lat: -1.5, lon: 35.15 },
  { text: '南アフリカの クルーガー', lat: -24.0, lon: 31.5 },
  { text: 'ボツワナの オカバンゴ', lat: -19.3, lon: 22.9 },
  { text: 'ナミビアの エトーシャ', lat: -18.85, lon: 16.3 },
  { text: 'インドの ギルの森', lat: 21.13, lon: 70.8 },
];

// 子ライオンが1歳まで生きのこるのは 34%（オカバンゴ・Kotze ほか 2021）〜40%（セレンゲティ）。
// 1〜4歳は 年に75%、おとなは 年に84%ほどが生きのこる（オカバンゴ）。
// メスは 19歳まで生きた記録（セレンゲティ）、オスは 12歳で「長生き」
const SURV_F = [[0, 1], [M, 0.82], [6 * M, 0.55], [Y, 0.42], [2 * Y, 0.33], [4 * Y, 0.26], [6 * Y, 0.22], [8 * Y, 0.19], [10 * Y, 0.155], [12 * Y, 0.11], [14 * Y, 0.06], [16 * Y, 0.025], [18 * Y, 0.006], [20 * Y, 0]];
const SURV_M = [[0, 1], [M, 0.82], [6 * M, 0.55], [Y, 0.42], [2 * Y, 0.33], [3 * Y, 0.27], [4 * Y, 0.21], [5 * Y, 0.17], [7 * Y, 0.115], [9 * Y, 0.07], [11 * Y, 0.033], [13 * Y, 0.012], [15 * Y, 0.003], [17 * Y, 0]];

export default {
  id: 'lion',
  name: 'ライオン',
  kind: 'animal',
  weight: 1.1,
  realCount: 2.37e4, // アフリカに 約2万3000頭・インドに 約670頭（IUCN 2023）
  refDays: 15 * Y,
  habitat: 'savanna',
  birth: ['{place}の しげみの 中で うまれた', '{place}で、きょうだいと いっしょに うまれた'],

  variants: [
    { id: 'f', label: 'メスのライオン', w: 0.5, habitat: 'savanna', tags: ['f'], places: PLACES, survival: SURV_F, refDays: 16 * Y },
    { id: 'm', label: 'オスのライオン', w: 0.5, habitat: 'savanna', tags: ['m'], places: PLACES, survival: SURV_M, refDays: 12 * Y },
  ],

  stages: [
    { id: 'cub', name: '子ライオン', from: 0, sprite: 'lion', scale: 0.5 },
    { id: 'young', name: '若いライオン', from: Y, sprite: 'lion', scale: 0.75 },
    { id: 'adult', name: 'おとなのライオン', from: 3 * Y, sprite: 'lion', scale: 1, say: 'りっぱな おとなの ライオンに なった', icon: 'star' },
  ],

  stats: [
    { id: 'cubs', label: '子ども', unit: '頭' },
    { id: 'hunts', label: 'かり', unit: '回' },
  ],

  events: [
    // 子ライオンのころ
    { at: [5 * D, 12 * D], text: 'はじめて 目が ひらいた', icon: 'look', big: 1 },
    { at: [2 * W, 4 * W], p: 0.8, text: 'しげみの 中で、母さんの 帰りを じっと 待った', icon: 'sleep' },
    { at: [3 * W, 6 * W], p: 0.5, text: '母さんに 首を くわえられて、べつの しげみへ 引っこした', icon: 'box' },
    { at: [6 * W, 9 * W], p: 0.9, text: 'はじめて 群れの なかまに 会った', icon: 'friends', mood: 'good', big: 2 },
    { at: [2 * M, 6 * M], p: 0.6, text: 'よその 母さんの おっぱいも、もらって 飲んだ', icon: 'heart', mood: 'good' },
    { at: [2 * M, 8 * M], p: 0.8, text: ['おとなの しっぽに とびついて あそんだ', 'いとこたちと とっくみあいを して ころげまわった'], icon: 'ball', mood: 'good' },
    { at: [3 * M, 7 * M], p: 0.7, text: 'おとなが しとめた えものを、はじめて かじった', icon: 'apple', big: 1 },
    { at: [4 * M, 2 * Y], p: 0.4, text: 'えものが 少ない 季節で、おなかを すかせた', icon: 'sun', mood: 'hard' },
    { at: [3 * M, 2 * Y], p: 0.3, text: 'ハイエナの 群れに 追われて、木の 根もとに かくれた', icon: 'alert', mood: 'hard' },
    { at: [6 * M, 2 * Y], p: 0.3, text: '群れに 新しい オスが やってきて、母さんたちが みんなを 守った', icon: 'alert', mood: 'hard', big: 1 },
    { at: [Y, 2 * Y], p: 0.7, text: 'おとなの かりに ついて行き、うしろで 見て おぼえた', icon: 'look', big: 1 },
    { at: [6 * M, 17 * Y], repeat: [2, 4], text: ['木かげで、1日の ほとんどを ねて すごした', 'なかまと 顔を すりよせて、あいさつした', '大きな 岩の 上で、夕日を ながめた', '雨季の 水たまりで、のどを うるおした'], icon: 'sun', mood: 'good' },

    // オス
    { at: [Y, 2 * Y], p: 0.85, need: 'm', text: '首の まわりに、たてがみが 生えはじめた', icon: 'star', big: 1 },
    { at: [2 * Y, 4 * Y], p: 0.9, need: 'm', text: '新しい オスたちに 追われて、うまれた 群れを 出た', icon: 'feather', mood: 'hard', big: 3, set: 'nomad' },
    { at: [2 * Y, 4 * Y], p: 0.75, need: 'nomad', text: '兄弟と 組んで、サバンナを さすらう 旅に 出た', icon: 'plane', big: 2 },
    { at: [2 * Y, 6 * Y], p: 0.5, need: 'nomad', text: 'よその なわばりに 入ってしまい、追いかけられた', icon: 'alert', mood: 'hard' },
    { at: [2 * Y, 6 * Y], p: 0.5, need: 'nomad', text: '自分たちだけで、はじめて 大きな えものを しとめた', icon: 'star', mood: 'good', big: 2, add: { hunts: 1 } },
    { at: [3 * Y, 12 * Y], repeat: [1, 3], need: 'nomad', text: ['兄弟と 力を あわせて、バッファローを しとめた', 'メスたちの しとめた えものを、まっさきに 食べた'], icon: 'star', add: { hunts: [5, 30] } },
    { at: [4 * Y, 8 * Y], p: 0.5, need: 'nomad', text: 'たてがみが 黒く、りっぱに なった', icon: 'crown', big: 1 },
    { at: [4 * Y, 8 * Y], p: 0.55, need: 'nomad', text: ['兄弟と 力を あわせて、群れの 主（ぬし）に なった', 'ひとつの 群れを まもる オスに なった'], icon: 'crown', mood: 'good', big: 3, set: 'pride_male' },
    { at: [4 * Y, 12 * Y], repeat: [1, 3], need: 'pride_male', text: ['群れで {n}頭の 子どもが うまれた', 'メスたちが、{n}頭の 子どもを うんだ'], icon: 'baby', mood: 'good', big: 3, add: { cubs: [2, 4] }, set: 'father' },
    { at: [4 * Y, 12 * Y], p: 0.8, need: 'pride_male', text: '夜あけの サバンナに、遠くまで ひびく 声で ほえた', icon: 'music', big: 1 },
    { at: [4 * Y, 12 * Y], p: 0.4, need: 'pride_male', text: 'なわばりに 入ってきた オスたちと、にらみあった', icon: 'alert', mood: 'hard' },
    { at: [6 * Y, 14 * Y], p: 0.6, need: 'pride_male', text: '若い オスたちに 群れを ゆずり、ひとりに なった', icon: 'feather', mood: 'hard', big: 2, set: 'ousted' },
    { at: [8 * Y, 17 * Y], p: 0.6, need: 'ousted', text: 'ひとり 木かげで、むかしの 群れの 声を 聞いた', icon: 'sleep' },

    // メス
    { at: [2 * Y, 4 * Y], p: 0.7, need: 'f', text: 'うまれた 群れに のこり、母さんたちと くらしつづけた', icon: 'friends', mood: 'good', big: 1, set: 'stayed' },
    { at: [2 * Y, 4 * Y], p: 0.8, need: ['f', '!stayed'], text: '群れを 出て、なかまの メスと 新しい くらしを はじめた', icon: 'plane', big: 2, set: 'left' },
    { at: [2 * Y, 17 * Y], repeat: [3, 6], need: 'f', text: ['なかまと 力を あわせて、シマウマを しとめた', '風下から しのびより、ヌーの 群れを ねらった', 'なかまと 三方から かこんで、えものを 追いこんだ', 'かりに しっぱいして、また 夜を 待った'], icon: 'star', add: { hunts: [10, 40] } },
    { at: [3 * Y, 5 * Y], p: 0.93, need: 'f', text: 'はじめて {n}頭の 子どもを うんだ', icon: 'baby', mood: 'good', big: 3, add: { cubs: [1, 4] }, set: 'mother' },
    { at: [5 * Y, 15 * Y], repeat: [1, 4], need: 'mother', text: ['しげみの 中で、{n}頭の 子どもを うんだ', 'また {n}頭の 子どもが うまれた'], icon: 'baby', mood: 'good', big: 2, add: { cubs: [1, 4] } },
    { at: [4 * Y, 15 * Y], p: 0.6, need: ['mother', 'stayed'], text: '群れの メスたちと、子どもを いっしょに 育てた', icon: 'heart', mood: 'good', big: 2 },
    { at: [4 * Y, 15 * Y], p: 0.35, need: 'mother', text: '子どもを 守って、ハイエナを 追いはらった', icon: 'alert', big: 1 },
    { at: [4 * Y, 15 * Y], p: 0.3, need: 'f', text: 'バッファローの 角に つかれて、足を けがした', icon: 'bandage', mood: 'hard' },
    { at: [8 * Y, 19 * Y], p: 0.5, need: 'f', text: '年上の メスとして、若い メスたちを 見守った', icon: 'crown', big: 2 },

    // みんな
    { at: [3 * Y, 15 * Y], p: 0.2, text: '村の 牛を ねらって、人に 追いはらわれた', icon: 'alert', mood: 'hard' },
    { at: [2 * Y, 15 * Y], p: 0.15, text: '木に のぼって、枝の 上で 昼寝を した', icon: 'sleep', mood: 'good' },
    { at: [6 * M, 15 * Y], p: 0.3, text: 'サファリカーの すぐ そばを、のんびり 通りすぎた', icon: 'look' },
  ],

  deaths: [
    { at: [0, 6 * M], w: 3, text: ['しげみで 待つ あいだに、ハイエナに 見つかり いのちを 終えた', 'おなかを すかせて、ちいさな いのちを 終えた'] },
    { at: [0, 2 * Y], w: 1.5, text: '群れの オスが 入れかわり、ちいさな いのちを 終えた' },
    { at: [6 * M, 2 * Y], w: 2, text: ['群れから はぐれて、ちいさな いのちを 終えた', 'えものが 少ない 季節に、ちいさな いのちを 終えた'] },
    { at: [0, 2 * Y], w: 1, text: '病気に かかって、ちいさな いのちを 終えた' },
    { at: [2 * Y, 8 * Y], w: 3, need: 'nomad', text: ['さすらいの 旅の とちゅうで、いのちを 終えた', 'よその オスたちとの あらそいで、いのちを 終えた'] },
    { at: [2 * Y, 20 * Y], w: 1, text: 'バッファローとの たたかいで、いのちを 終えた' },
    { at: [2 * Y, 20 * Y], w: 1, text: '人の しかけた わなに かかって、いのちを 終えた' },
    { at: [2 * Y, 20 * Y], w: 1, text: '病気に かかって、いのちを 終えた' },
    { at: [8 * Y, 20 * Y], w: 3, need: 'ousted', text: 'ひとりで えものが とれなくなり、しずかに 眠った' },
    { at: [10 * Y, 22 * Y], w: 4, need: 'f', text: '群れの なかまの そばで、しずかに いのちを 終えた' },
    { at: [10 * Y, 22 * Y], w: 2, text: '年をとって 歯が すりへり、しずかに 眠った' },
  ],

  titles: [
    { need: 'pride_male', stat: { cubs: 6 }, text: '{cubs}頭の 子の 父と なった 群れの 王' },
    { need: 'pride_male', text: '兄弟と 群れを 手に入れた オスライオン' },
    { need: 'mother', stat: { cubs: 8 }, text: '{cubs}頭の 子を うんだ 群れの 母' },
    { need: 'mother', text: 'なかまと 子を 育てた 母ライオン' },
    { need: 'f', long: 0.05, text: '群れいちばんの 長老の メス' },
    { need: ['nomad', '!pride_male'], text: 'サバンナを さすらった 旅の オス' },
    { need: ['!nomad', '!mother'], short: 0.15, long: 0.6, text: '群れの なかまと 育った 1頭の ライオン' },
    { short: 0.6, text: 'しげみの 中で 世界を 知った 子ライオン' },
  ],

  facts: [
    'ライオンの 子どもで、1歳まで 生きのこれるのは 3〜4割ほど です',
    'オスは 2〜4歳で うまれた 群れを 出ますが、メスの 多くは 一生 同じ 群れに のこります',
    'ライオンは、ネコの なかまでは めずらしく 群れで くらします',
    'ライオンの ほえ声は、8kmほど 先まで とどくと 言われています',
    'ライオンは 1日に 16〜20時間ほど 休んで すごします',
    '野生の ライオンは、アフリカに 約2万3000頭、インドに 約670頭と 推定されています（IUCN 2023）',
  ],

  sources: [
    'https://repository.up.ac.za/bitstream/2263/81285/1/Kotze_Demographic_2021.pdf (Kotze ほか 2021 オカバンゴ: 子の1年生存34%・1〜4歳75%・おとな84%)',
    'https://scholars.duke.edu/publication/794437 (Pusey & Packer 1987 オスはみな群れを出る・メスの約3分の1は4歳までに出る)',
    'https://theconversation.com/the-fast-furious-and-brutally-short-life-of-an-african-male-lion-211130 (オスは約3歳で独立・繁殖の盛りは5〜9歳・12歳で長生き・1年目の死因で多いのは子殺し)',
    'https://ewt.org.za/?p=27663 (IUCN 2023: アフリカに約2万3000頭・インドに約670頭)',
    'https://www.discovermagazine.com/planet-earth/the-fast-furious-and-brutally-short-life-of-an-african-male-lion (オス12歳・メス19歳まで)',
  ],
};
