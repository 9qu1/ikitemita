// アフリカゾウ（サバンナのゾウ）
//   メスは家族の群れで一生をすごし、オスは12〜15歳で家族をはなれる。寿命の曲線もちがうので、
//   sexes ではなく variant でオス・メスを分け、タグ 'm' / 'f' をつける
import { H, D, W, M, Y } from '../units.js?v=1.0.3';

const PLACES = [
  { text: 'ケニアの アンボセリ', lat: -2.65, lon: 37.26 },
  { text: 'ボツワナの チョベ川', lat: -17.8, lon: 25.15 },
  { text: 'タンザニアの タランギーレ', lat: -3.9, lon: 36.0 },
  { text: '南アフリカの クルーガー', lat: -24.0, lon: 31.5 },
  { text: 'ジンバブエの ワンゲ', lat: -18.6, lon: 26.5 },
  { text: 'ナミビアの エトーシャ', lat: -18.85, lon: 16.3 },
];

// メス（アンボセリの40年の調査 Lee ほか 2016）: 平均34年・中央値 約38年・40歳まで4割・50歳まで2割・60代まで1割・65歳で95%がいなくなる
const SURV_F = [[0, 1], [M, 0.95], [Y, 0.88], [5 * Y, 0.84], [10 * Y, 0.8], [20 * Y, 0.71], [30 * Y, 0.6], [37 * Y, 0.5], [40 * Y, 0.43], [45 * Y, 0.33], [50 * Y, 0.22], [60 * Y, 0.1], [65 * Y, 0.05], [75 * Y, 0]];
// オス: 年れいごとの数の減り方が メスの約2倍の速さ（30歳をすぎると オスどうしの争いで多く死ぬ）。60代まで生きるのは まれ
const SURV_M = [[0, 1], [M, 0.95], [Y, 0.87], [5 * Y, 0.8], [10 * Y, 0.74], [15 * Y, 0.66], [20 * Y, 0.57], [30 * Y, 0.42], [40 * Y, 0.26], [50 * Y, 0.12], [55 * Y, 0.065], [60 * Y, 0.025], [65 * Y, 0.006], [70 * Y, 0]];

export default {
  id: 'elephant',
  name: 'アフリカゾウ',
  kind: 'animal',
  weight: 1,
  realCount: 4.15e5, // アフリカのゾウ 約41万5000頭（IUCN アフリカゾウ現状報告 2016）
  refDays: 60 * Y,
  habitat: 'savanna',
  birth: ['{place}で、家族に かこまれて うまれた', '{place}で うまれた'],

  variants: [
    { id: 'f', label: 'メスのゾウ', w: 0.5, habitat: 'savanna', tags: ['f'], places: PLACES, survival: SURV_F, refDays: 62 * Y },
    { id: 'm', label: 'オスのゾウ', w: 0.5, habitat: 'savanna', tags: ['m'], places: PLACES, survival: SURV_M, refDays: 55 * Y },
  ],

  stages: [
    { id: 'calf', name: '子ゾウ', from: 0, sprite: 'elephant', scale: 0.45 },
    { id: 'young', name: '若いゾウ', from: 5 * Y, sprite: 'elephant', scale: 0.7 },
    { id: 'adult', name: 'おとなのゾウ', from: 15 * Y, sprite: 'elephant', scale: 1, say: 'りっぱな おとなの ゾウに なった', icon: 'star' },
    { id: 'elder', name: '年をとったゾウ', from: 50 * Y, sprite: 'elephant', scale: 1, say: 'しわが ふえ、歩みが ゆっくりに なった', icon: 'sleep' },
  ],

  stats: [
    { id: 'calves', label: '子ども', unit: '頭' },
    { id: 'water', label: '水場に かよった', unit: '回' },
  ],

  events: [
    // 子ゾウのころ
    { at: [0.5 * H, 2 * H], text: 'うまれて すぐ、ふらふらしながら 自分の 足で 立った', icon: 'star', big: 2 },
    { at: [2 * H, D], text: '母さんの 前足の あいだで、はじめて おっぱいを 飲んだ', icon: 'heart', mood: 'good', big: 1 },
    { at: [W, 2 * M], p: 0.8, text: '家族の おばさんや お姉さんが、かわるがわる 世話を してくれた', icon: 'friends', mood: 'good', big: 1 },
    { at: [M, 6 * M], p: 0.8, text: ['鼻が うまく 使えず、ぶらぶら ふりまわした', '自分の 鼻を ふんで、ころびそうに なった'], icon: 'ball', mood: 'good' },
    { at: [2 * M, Y], p: 0.7, text: 'はじめて どろあびを して、体じゅう 茶色に なった', icon: 'drop', mood: 'good' },
    { at: [4 * M, 2 * Y], p: 0.6, text: '母さんの まねをして、草を 鼻で まいて 口に 運んだ', icon: 'sprout' },
    { at: [Y, 5 * Y], p: 0.5, text: '川を わたるとき、母さんの 鼻に ささえてもらった', icon: 'drop', mood: 'good', big: 1 },
    { at: [Y, 12 * Y], p: 0.35, text: 'かんばつの 年、群れの リーダーに ついて 遠い 水場まで 歩いた', icon: 'sun', mood: 'hard', big: 1 },
    { at: [Y, 40 * Y], p: 0.25, text: 'ライオンの 群れが 近づき、家族で 子どもを 囲んで 守った', icon: 'alert', mood: 'hard', big: 1 },
    { at: [3 * Y, 6 * Y], p: 0.75, need: 'f', text: '弟か 妹が うまれて、お姉さんに なった', icon: 'baby', mood: 'good', big: 1 },
    { at: [3 * Y, 6 * Y], p: 0.75, need: 'm', text: '弟か 妹が うまれて、お兄さんに なった', icon: 'baby', mood: 'good', big: 1 },

    // 一生を通して
    { at: [6 * M, 70 * Y], repeat: [2, 4], text: ['水場で、鼻いっぱいに 水を すって 飲んだ', '川に 入って、鼻を 高く あげて 泳いだ', '水場で なかまと、水を かけあって あそんだ'], icon: 'drop', mood: 'good', add: { water: [300, 2000] } },
    { at: [Y, 70 * Y], repeat: [1, 3], text: ['土を 鼻で すくって、背中に かけた', '大きな 木の 葉を、鼻で 引きよせて 食べた', 'なかまと ならんで、夕方の サバンナを 歩いた', 'とても 低い 声で、遠くの なかまと 話しあった'], icon: 'sun', mood: 'good' },
    { at: [3 * Y, 60 * Y], p: 0.3, text: 'アカシアの 木を ゆすって、さやを 落として 食べた', icon: 'apple', mood: 'good' },
    { at: [2 * Y, 70 * Y], p: 0.3, text: '大雨の あと、のびた 若い 草を、たっぷり 食べた', icon: 'rain', mood: 'good' },
    { at: [2 * Y, 60 * Y], p: 0.35, text: 'なかまの 骨を 見つけて、鼻で そっと さわった', icon: 'feather', big: 2 },
    { at: [5 * Y, 50 * Y], p: 0.25, text: '畑の 作物を 食べに 行って、人に 追いはらわれた', icon: 'alert', mood: 'hard' },
    { at: [5 * Y, 70 * Y], p: 0.12, text: 'わなに 足が かかったが、人に たすけてもらった', icon: 'bandage', mood: 'hard', big: 2, set: 'rescued' },
    { at: [10 * Y, 70 * Y], p: 0.2, text: '研究者に 首輪を つけてもらい、旅の 道すじが 記録された', icon: 'look' },

    // メス
    { at: [3 * Y, 12 * Y], p: 0.6, need: 'f', text: '小さい いとこの 子守を、すすんで 引きうけた', icon: 'heart', mood: 'good' },
    { at: [10 * Y, 16 * Y], p: 0.95, need: 'f', text: 'おなかに 赤ちゃんが できた（うまれるのは 約22か月後）', icon: 'heart', big: 2, set: 'pregnant' },
    { at: [12 * Y, 18 * Y], need: 'pregnant', text: 'はじめての 子どもを うんだ', icon: 'baby', mood: 'good', big: 3, add: { calves: 1 }, set: 'mother' },
    { at: [17 * Y, 55 * Y], repeat: [1, 7], need: 'mother', text: ['また 子どもを うんだ', '家族に 見守られて、子どもを うんだ', '雨季の はじめに、子どもを うんだ'], icon: 'baby', mood: 'good', big: 2, add: { calves: 1 } },
    { at: [30 * Y, 60 * Y], p: 0.6, need: 'mother', text: 'むすめが 子どもを うみ、おばあさんに なった', icon: 'baby', mood: 'good', big: 2, set: 'grandma' },
    { at: [35 * Y, 65 * Y], p: 0.6, need: 'f', text: '家族の リーダー（家長）に なった', icon: 'crown', mood: 'good', big: 3, set: 'matriarch' },
    { at: [35 * Y, 70 * Y], p: 0.6, need: 'matriarch', text: '水場の 場所を おぼえていて、家族を 何十kmも 案内した', icon: 'plane', big: 2 },

    // オス
    { at: [8 * Y, 14 * Y], p: 0.6, need: 'm', text: '子ゾウたちと 力くらべを して、押しあいに 勝った', icon: 'ball', mood: 'good' },
    { at: [12 * Y, 17 * Y], need: 'm', text: 'うまれた 家族を はなれ、ひとり立ちした', icon: 'feather', big: 3, set: 'independent' },
    { at: [14 * Y, 25 * Y], p: 0.6, need: 'independent', text: '若い オスたちの グループに くわわった', icon: 'friends', mood: 'good', big: 1 },
    { at: [15 * Y, 40 * Y], p: 0.5, need: 'independent', text: '年上の オスの うしろを ついて歩き、水場の 道を おぼえた', icon: 'look' },
    { at: [25 * Y, 35 * Y], p: 0.8, need: 'independent', text: 'からだから においを 出し、気が 立つ 季節を はじめて むかえた', icon: 'alert', big: 2, set: 'musth' },
    { at: [30 * Y, 60 * Y], repeat: [1, 6], need: 'musth', text: ['どこかの 群れで、自分の 子どもが うまれた', '遠くの 家族の もとで、自分の 子どもが うまれた'], icon: 'baby', mood: 'good', big: 2, add: { calves: 1 }, set: 'father' },
    { at: [30 * Y, 55 * Y], p: 0.4, need: 'musth', text: 'ライバルの オスと、きばを ぶつけあって たたかった', icon: 'alert', mood: 'hard', big: 1 },
    { at: [40 * Y, 65 * Y], p: 0.6, need: 'm', text: 'きばが 長く のびて、若い オスたちに 一目 おかれた', icon: 'crown', big: 2 },

    // 年をとって
    { at: [50 * Y, 75 * Y], p: 0.6, text: '歯が すりへり、やわらかい 草の ある ぬまの そばで すごした', icon: 'sleep' },
  ],

  deaths: [
    { at: [0, Y], w: 3, text: 'かんばつで 母さんの おっぱいが 出ず、ちいさな いのちを 終えた' },
    { at: [0, 2 * Y], w: 1, text: 'ライオンに ねらわれて、ちいさな いのちを 終えた' },
    { at: [0, 3 * Y], w: 1, text: '病気に かかって、ちいさな いのちを 終えた' },
    { at: [2 * Y, 70 * Y], w: 1, text: 'ひどい かんばつの 年に、水と 草が 足りず いのちを 終えた' },
    { at: [10 * Y, 70 * Y], w: 0.5, text: '人の しかけた わなに かかって、いのちを 終えた' },
    { at: [15 * Y, 65 * Y], w: 2, need: 'musth', text: 'オスどうしの たたかいの きずで、いのちを 終えた' },
    { at: [13 * Y, 55 * Y], w: 1, need: 'mother', text: 'お産の あと 体が 弱り、家族に 見守られて 眠った' },
    { at: [3 * Y, 70 * Y], w: 2, text: ['病気に かかって、いのちを 終えた', '足の けがが もとで 弱り、いのちを 終えた'] },
    { at: [45 * Y, 80 * Y], w: 3, need: 'f', text: '家族に かこまれて、しずかに いのちを 終えた' },
    { at: [50 * Y, 80 * Y], w: 5, text: '最後の 歯が すりへり、ぬまの そばで しずかに 眠った' },
  ],

  titles: [
    { need: 'matriarch', text: '何十年も 家族を みちびいた 家長' },
    { need: 'f', stat: { calves: 6 }, text: '{calves}頭の 子を 育てた 大家族の 母' },
    { need: 'grandma', text: '孫の 顔を 見た おばあさんゾウ' },
    { need: 'mother', text: '家族に 見守られて 子を 育てた 母ゾウ' },
    { need: 'father', long: 0.15, text: 'きばの りっぱな サバンナの 長老' },
    { need: 'independent', text: 'ひとりで サバンナを 歩いた オスゾウ' },
    { need: ['!independent', '!mother'], short: 0.15, long: 0.9, text: '家族と サバンナを 歩いた 1頭の ゾウ' },
    { short: 0.9, text: '家族に 見守られて すこしだけ 生きた 子ゾウ' },
  ],

  facts: [
    'アフリカゾウが おなかに 赤ちゃんを やどす 期間は 約22か月で、ほにゅう類で いちばん 長いです',
    'ゾウの 家族は、年上の メス（家長）が リーダーに なって 群れを みちびきます',
    'ケニアの アンボセリの 調査では、メスの 10頭に1頭が 60代まで 生きました',
    'ゾウの おく歯は 一生に 6回 生えかわり、さいごの 歯が すりへると 食べるのが むずかしく なります',
    'アフリカの ゾウは 2016年に 約41万5000頭と 推定され、その前の 約10年で 11万頭いじょう へりました（IUCN）',
    'ゾウは 人には 聞こえないほど 低い 声で、遠くの なかまと やりとりを します',
  ],

  sources: [
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC4748003 (Lee ほか 2016 アンボセリのメス834頭: 平均34年・中央値37.9年・40歳まで40%・50歳20%・60代10%・初産13.9歳・出産間隔 約4〜5年・妊娠22か月)',
    'https://www.elephantvoices.org/a-long-life (ElephantVoices: 最長70年ほど・妊娠約660日・一生で最大12頭・オスの繁殖の盛りは40〜55歳)',
    'https://tsavotrust.org/why-do-male-elephants-leave-the-herd/ (オスは12〜15歳で家族をはなれる)',
    'https://bioone.org/journals/journal-of-east-african-natural-history/volume-112/issue-3/028.112.0301/Observations-on-Five-Savanna-Elephant-Clan-Age-Structures/10.2982/028.112.0301.short (オスの年れい層の減り方はメスの約2倍・30歳以降の争いでの死)',
    'https://savetheelephants.org/news/iucn-releases-latest-update-on-the-status-of-africa-s-elephants/ (IUCN 2016: 約41万5000頭・2007〜2015年で11万頭以上減少)',
  ],
};
