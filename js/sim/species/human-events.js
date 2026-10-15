// ひとの一生のできごと（文の担当のファイル）。使われかたは human.js（setup と plan）、書き方は CONTENT.md
//
// ■ need の注意（engine は「at の始まり」が早い順にできごとを見ていく）
//   plan がつけるタグ（学校・仕事・結婚など）を need にするときは、at の始まりを
//   そのタグがつく年齢より後にする。早すぎると、そのできごとは一度も出ない。
//   plan がタグをつける年齢の目安:
//     edu1 5.8〜6.6 / noschool 6.5〜9 / edu2 〜12.6 / edu3 〜15.6 / edu4 〜19.5 / graduate 〜23.5
//     worker 10〜24.5（学校の長さで変わる）/ homemaker 17〜24 / migrant 16〜30 / abroad 18〜40
//     married 18〜（だいたい35まで）/ parent 19〜（だいたい40まで）/ grandparent 40〜70 / retired 58〜72 / phone 9〜26
//   「A か B」は need で書けないので、反対のタグを並べて書く（例: L か LM → ['!inc-UM', '!inc-H']）
//
// ■ 文の中で使える {name} {country} {city} {food} {sport} {fest} {sweet} {animal} {job}（job は worker のときだけ）
import { D, W, M, Y } from '../units.js?v=1.0.0';

const NOT_RICH = ['!inc-UM', '!inc-H']; // 所得が 低い か やや低い
const RICH = ['!inc-L', '!inc-LM']; // 所得が やや高い か 高い
const SNOWY = ['!r-SSA', '!r-SEA', '!r-SA', '!r-LA', '!r-MENA', '!r-OC']; // 冬に雪がつもりやすい地域（EU・NA・EA・CA）

export default {
  birth: [
    '{place}で うまれた',
    '{place}で、元気な 産声を あげた',
    '{place}で、みんなに 待たれて うまれた',
    '{place}で、家族の もとに うまれた',
  ],

  school: {
    primary: ['小学校に 入学した', '新しい ノートを 持って、小学校に 通いはじめた'],
    middle: ['中学校に 進んだ', '中学校に 入学した'],
    high: ['高校に 進んだ', '高校に 合格した'],
    uni: ['大学に 合格した', '大学に 進んだ'],
    uniEnd: ['大学を 卒業した', '大学の 卒業式で、家族と 写真を とった'],
    none: ['学校には 通えず、家の 仕事を 手伝った', '学校が 遠くて 通えず、家の 手伝いを した'],
  },

  migrate: ['仕事を さがして {city}へ 引っこした', '村を 出て、{city}で くらしはじめた', 'バスに ゆられて、{city}へ 出た'],
  abroad: ['海の 向こうの 国へ わたった', '仕事を 求めて、外国へ 旅立った', '飛行機に 乗って、遠い 国へ うつりすんだ'],
  workStart: ['{job}として 働きはじめた', '{job}として 働きはじめた', '{job}として、はじめての 一日を むかえた'],
  homeWork: ['家の ことを きりもりして、家族を ささえた', '家族の 毎日の くらしを、一手に ひきうけた'],
  retire: ['{job}の 仕事を 引退した', '{job}の 仕事に、区切りを つけた'],
  marry: ['好きな人と 結婚した', '家族や ともだちに 祝われて 結婚した', 'みんなに 祝福されて、結婚式を あげた'],
  firstKid: ['はじめての 子どもが うまれた', 'はじめての 子どもを だいて、泣いて 喜んだ'],
  moreKid: '{k}人目の 子どもが うまれた',
  childLoss: ['ちいさな 子どもを 病気で 亡くした', '幼い 子を 見送り、長い あいだ 泣いた'],
  grandkid: ['はじめての 孫が うまれた', 'はじめて 孫を だっこした'],
  phone: ['はじめて 自分の スマホを 持った', 'はじめての 携帯電話を 手に 入れた'],

  // 仕事。w は所得の段階ごとの重み、w2 は地域ごとの倍率
  //   農業の割合は世界銀行の目安（就業者のうち 低所得 約61%・やや低い 約40%・やや高い 約22%・高い 約3%）に近づけてある
  //   （村の人は 'rural'、町の人と町へ出た人は 'urban' の仕事からしか選ばないので、農家は2行に分けた。id は同じ）
  jobs: [
    { id: 'farm', text: '農家', where: 'rural', w: { L: 150, LM: 95, UM: 50, H: 9 } },
    { id: 'farm', text: '農家', where: 'urban', w: { L: 25, LM: 10, UM: 3, H: 0.1 } }, // 町にすみながら畑に通う人
    { id: 'herder', text: '羊飼い', where: 'rural', w: { L: 5, LM: 3, UM: 1.5, H: 0.3 }, w2: { MENA: 2.5, CA: 3, SSA: 1.5, OC: 2, SEA: 0.2, EA: 0.6, NA: 0.3, EU: 0.6 } },
    { id: 'fisher', text: '漁師', w: { L: 2, LM: 2, UM: 1.2, H: 0.3 }, w2: { SEA: 2.5, SA: 1.3, OC: 1.5, EA: 1.2, MENA: 0.6, EU: 0.6, NA: 0.5, CA: 0.2 } },
    { id: 'miner', text: '鉱山の 作業員', w: { L: 1, LM: 1, UM: 1, H: 0.3 }, w2: { SSA: 1.5, LA: 1.5, CA: 2, OC: 2, SA: 0.7, SEA: 0.8, EU: 0.5, MENA: 0.6 } },
    { id: 'vendor', text: '市場の 売り子', where: 'urban', w: { L: 14, LM: 10, UM: 4, H: 0.5 }, w2: { SSA: 1.5, SEA: 1.3, LA: 1.3 } },
    { id: 'shop', text: '雑貨屋の 店主', edu: 1, w: { L: 5, LM: 7, UM: 5, H: 2 } },
    { id: 'tailor', text: '仕立て屋', w: { L: 3, LM: 3, UM: 1.2, H: 0.3 } },
    { id: 'garment', text: '服の 工場の ミシン係', edu: 1, where: 'urban', w: { L: 1.5, LM: 5, UM: 2.5, H: 0.3 }, w2: { SA: 2, SEA: 1.5, EU: 0.5, NA: 0.3 } },
    { id: 'factory', text: '工場の 作業員', edu: 1, w: { L: 2, LM: 7, UM: 12, H: 6 }, w2: { EA: 1.6, SEA: 1.3 } },
    { id: 'builder', text: '建設現場の 作業員', w: { L: 4, LM: 7, UM: 6, H: 3 }, w2: { MENA: 1.3 } },
    { id: 'carpenter', text: '大工', w: { L: 2, LM: 2.5, UM: 2, H: 1.2 } },
    { id: 'moto', text: 'バイクタクシーの 運転手', where: 'urban', w: { L: 4, LM: 4, UM: 1, H: 0.05 }, w2: { SSA: 1.5, SEA: 1.8, SA: 1.2, EU: 0.1, NA: 0, EA: 0.4, OC: 0.2 } },
    { id: 'bus', text: 'バスの 運転手', edu: 2, w: { L: 1, LM: 1.5, UM: 2, H: 1.5 } },
    { id: 'truck', text: 'トラックの 運転手', edu: 1, w: { L: 1.2, LM: 2.5, UM: 3, H: 2.5 } },
    { id: 'mechanic', text: '車の 整備士', edu: 2, w: { L: 1, LM: 2, UM: 2, H: 1.5 } },
    { id: 'cook', text: '食堂の 料理人', w: { L: 2, LM: 3, UM: 3.5, H: 3 } },
    { id: 'baker', text: 'パン屋', edu: 1, w: { L: 0.5, LM: 1, UM: 1.5, H: 1.2 }, w2: { EU: 2, LA: 1.5, MENA: 1.5, CA: 1.5 } },
    { id: 'domestic', text: 'お手伝いさん', where: 'urban', w: { L: 3, LM: 3, UM: 2, H: 0.6 }, w2: { LA: 1.6, MENA: 1.4, SA: 1.2, SEA: 1.3 } },
    { id: 'cleaner', text: '清掃員', w: { L: 1, LM: 1.5, UM: 2.5, H: 3 } },
    { id: 'guard', text: '警備員', edu: 1, where: 'urban', w: { L: 0.8, LM: 2, UM: 2, H: 1.5 } },
    { id: 'hair', text: '美容師', edu: 2, w: { L: 0.8, LM: 1.5, UM: 2, H: 1.8 } },
    { id: 'repair', text: 'スマホの 修理屋', edu: 1, where: 'urban', w: { L: 1, LM: 1.5, UM: 0.6, H: 0.2 } },
    { id: 'clerk', text: 'スーパーの 店員', edu: 2, where: 'urban', w: { L: 0.3, LM: 1.5, UM: 5, H: 6 } },
    { id: 'delivery', text: '配達員', edu: 1, where: 'urban', w: { L: 0.2, LM: 1, UM: 3, H: 3 } },
    { id: 'care', text: '介護士', edu: 2, w: { L: 0, LM: 0.3, UM: 1.5, H: 4.5 } },
    { id: 'teacher', text: '小学校の 先生', edu: 3, w: { L: 1.5, LM: 2.5, UM: 3, H: 4 } },
    { id: 'nurse', text: '看護師', edu: 3, w: { L: 0.6, LM: 1.5, UM: 2.5, H: 4.5 } },
    { id: 'civil', text: '役所の 職員', edu: 3, w: { L: 0.8, LM: 1.5, UM: 2.5, H: 3.5 } },
    { id: 'police', text: '警察官', edu: 2, w: { L: 0.5, LM: 1, UM: 1.5, H: 1.5 } },
    { id: 'office', text: '会社員', edu: 3, where: 'urban', w: { L: 0.5, LM: 3, UM: 7, H: 12 } },
    { id: 'doctor', text: '医者', edu: 4, w: { L: 0.15, LM: 0.4, UM: 0.8, H: 1.2 } },
    { id: 'programmer', text: 'プログラマー', edu: 4, where: 'urban', w: { L: 0.1, LM: 0.8, UM: 1.5, H: 3 } },
    { id: 'researcher', text: '研究者', edu: 4, w: { L: 0.05, LM: 0.15, UM: 0.4, H: 0.8 } },
  ],

  events: [
    // ---- 赤ちゃん（0〜3さい）----
    { at: [D, 2 * W], p: 0.5, text: '名前は「{name}」に 決まった', icon: 'heart', mood: 'good' },
    //   笑った・歩いた・ことば は1つだけ（group）
    { at: [1.2 * M, 3 * M], p: 0.3, group: 'baby', text: ['はじめて にっこり 笑った', 'あやされて、声を 出して 笑った'], icon: 'heart', mood: 'good', big: 1 },
    { at: [2 * M, 15 * M], p: 0.15, text: 'はじめての 予防接種で 大泣きした', icon: 'bandage' },
    { at: [2 * M, 18 * M], p: 0.25, need: NOT_RICH, text: '布で せおわれて、どこへでも いっしょに 行った', icon: 'heart', mood: 'good' },
    { at: [10 * M, 16 * M], p: 0.6, group: 'baby', text: ['はじめて ひとりで 歩いた', 'よちよちと 3歩 歩いて、みんなが わいた'], icon: 'sprout', mood: 'good', big: 1 },
    { at: [10 * M, 20 * M], p: 0.7, group: 'baby', text: ['はじめての ことばは「ママ」だった', 'はじめての ことばは「パパ」だった', 'はじめての ことばは「まんま」だった'], icon: 'music', mood: 'good', big: 1 },
    { at: [2.5 * Y, 7 * Y], p: 0.25, text: ['おばあちゃんの ひざの上が お気に入りだった', 'おじいちゃんの 昔話を 何度も きいた', 'おじいちゃんに 星の 名前を 教わった'], icon: 'heart', mood: 'good' },
    { at: [1.5 * Y, 4 * Y], p: 0.3, need: 'm', text: 'きょうだいが うまれて、お兄ちゃんに なった', icon: 'baby', mood: 'good', big: 1 },
    { at: [1.5 * Y, 4 * Y], p: 0.3, need: 'f', text: 'きょうだいが うまれて、お姉ちゃんに なった', icon: 'baby', mood: 'good', big: 1 },
    { at: [1.5 * Y, 8 * Y], p: 0.25, text: ['ひどい 熱を 出したが、元気に なった', 'おたふくかぜで 1週間 寝こんだ'], icon: 'bandage', mood: 'hard' },

    // ---- こども（3〜12さい）----
    { at: [3 * Y, 6 * Y], p: 0.5, text: ['はじめての ともだちが できた', '近所の 子と 大の なかよしに なった'], icon: 'friends', mood: 'good', big: 1, add: { friends: [1, 3] } },
    { at: [5.5 * Y, 7.5 * Y], p: 0.25, text: '前歯が ぬけて、すきっ歯で 笑った', icon: 'star', mood: 'good' },
    { at: [6.7 * Y, 8.5 * Y], p: 0.3, need: 'edu1', text: '自分の 名前を 字で 書けるように なった', icon: 'school', mood: 'good', big: 1 },
    { at: [7 * Y, 12 * Y], p: 0.25, need: 'edu1', text: ['作文を 先生に ほめられた', 'テストで はじめて 満点を とった', '遠足で、はじめて 動物園に 行った'], icon: 'star', mood: 'good' },
    { at: [6 * Y, 13 * Y], p: 0.35, text: ['近所の 子たちと {sport}に 夢中に なった', '日が くれるまで、{sport}で 遊んだ'], icon: 'ball', mood: 'good', add: { friends: [1, 2] } },
    { at: [4 * Y, 12 * Y], p: 0.4, text: ['{fest}の 日、新しい 服を 着せてもらった', '{fest}で 夜おそくまで はしゃいだ'], icon: 'star', mood: 'good', big: 1 },
    { at: [5 * Y, 12 * Y], p: 0.3, text: '家の {animal}の 世話係に なった', icon: 'heart', mood: 'good' },
    { at: [5 * Y, 12 * Y], p: 0.2, text: '母の {food}が、世界で いちばん 好きだった', icon: 'apple', mood: 'good' },
    { at: [6 * Y, 13 * Y], p: 0.22, text: ['ともだちと 大げんかして、3日 口を きかなかった', '人ごみで 迷子に なって、大泣きした', '木から 落ちて、うでの 骨を 折った'], icon: 'alert', mood: 'hard' },
    { at: [3 * Y, 10 * Y], p: 0.35, need: SNOWY, text: 'つもった 雪で、雪だるまを 作った', icon: 'snow', mood: 'good' },
    //   所得が低い・やや低い国のくらし
    { at: [5 * Y, 13 * Y], p: 0.5, need: ['rural', ...NOT_RICH], text: ['毎朝 井戸まで 水くみに 行った', '水がめを 頭に のせて、水を 運んだ'], icon: 'drop' },
    { at: [4 * Y, 14 * Y], p: 0.25, need: NOT_RICH, text: '停電の 夜、ろうそくの そばで 昔話を きいた', icon: 'sleep', mood: 'good' },
    { at: [6 * Y, 12 * Y], p: 0.25, need: NOT_RICH, text: '弟や 妹の 子守りを まかされた', icon: 'baby' },
    { at: [6 * Y, 13 * Y], p: 0.3, need: 'rural', text: '家族と いっしょに、畑の 草とりを した', icon: 'sprout' },
    { at: [6 * Y, 13 * Y], p: 0.18, need: '!inc-H', text: '市場へ 野菜を 売りに 行くのに ついていった', icon: 'coin' },
    { at: [7 * Y, 14 * Y], p: 0.2, need: NOT_RICH, text: 'おさがりの 自転車で、どこまでも 走った', icon: 'star', mood: 'good' },
    { at: [Y, 12 * Y], p: 0.3, need: 'r-SSA', text: 'マラリアに かかったが、薬で 治った', icon: 'bandage', mood: 'hard' },
    //   所得がやや高い・高い国のくらし
    { at: [4 * Y, 10 * Y], p: 0.35, need: RICH, text: ['ピアノを 習いはじめた', 'スイミング教室に 通いはじめた', 'おどりの 教室に 通いはじめた'], icon: 'music', mood: 'good' },
    { at: [4.5 * Y, 8 * Y], p: 0.4, need: RICH, text: 'はじめて 補助輪なしで 自転車に 乗れた', icon: 'star', mood: 'good', big: 1 },
    //   学校に行けなかった子
    { at: [9.1 * Y, 15 * Y], p: 0.45, need: 'noschool', text: ['市場で 荷物を 運んで、家に お金を いれた', 'ヤギの 番を まかされ、一日じゅう 野原に いた'], icon: 'coin' },
    { at: [16 * Y, 50 * Y], p: 0.18, need: 'noschool', text: 'おとなに なってから、夜の 教室で 字を ならった', icon: 'school', mood: 'good', big: 2, set: 'literate' },

    // ---- 10代 ----
    { at: [12 * Y, 17 * Y], p: 0.4, group: 'craze', text: ['{sport}の チームで、毎日 練習した', 'ラジオから 流れる 歌に 夢中に なった', 'ともだちと ダンスの 練習に あけくれた', 'まんがを 描いて、ともだちに 見せた', 'ゲームに 夢中で、よく しかられた'], icon: 'music', mood: 'good', big: 1 },
    { at: [14 * Y, 19 * Y], p: 0.35, need: 'phone', text: 'スマホで 動画を 見すぎて、夜ふかしした', icon: 'phone' },
    { at: [13 * Y, 19 * Y], p: 0.45, text: ['はじめて 恋を した', '気になる 人の 前で、うまく 話せなかった', '{fest}の 夜、気になる 人と 目が あった'], icon: 'heart', mood: 'good', big: 1 },
    { at: [12 * Y, 17 * Y], p: 0.15, text: '親に 口ごたえして、大げんかを した', icon: 'alert', mood: 'hard' },
    { at: [13 * Y, 18 * Y], p: 0.3, need: 'edu2', text: ['大事な 試験に 合格した', '試験に 受かって、家族が 祝ってくれた'], icon: 'star', mood: 'good', big: 1 },
    { at: [13 * Y, 18 * Y], p: 0.15, need: 'edu2', text: '試験に 落ちて、くやしくて 泣いた', icon: 'alert', mood: 'hard' },
    { at: [16 * Y, 18.5 * Y], p: 0.25, need: 'edu3', text: '受験勉強で、毎晩 おそくまで 起きていた', icon: 'school', mood: 'hard' },
    { at: [15 * Y, 19 * Y], p: 0.25, need: RICH, text: 'はじめての アルバイトで、お金の 重みを 知った', icon: 'coin' },
    { at: [15 * Y, 15.9 * Y], p: 0.5, need: ['f', 'r-LA'], text: '15さいの お祝いで、ドレスを 着て おどった', icon: 'cake', mood: 'good', big: 1 },
    { at: [19.6 * Y, 22.5 * Y], p: 0.35, need: 'edu4', text: ['大学の 寮で、夜通し 語りあった', '大学で、一生の 友に 出会った'], icon: 'friends', mood: 'good', add: { friends: [1, 3] } },

    // ---- 仕事 ----
    //   はじめての給料（学校の長さで働きはじめる年がちがうので4つに分けた）
    { at: [16.1 * Y, 20 * Y], p: 0.35, need: ['worker', '!edu2'], text: 'はじめて かせいだ お金を、母の 手に わたした', icon: 'coin', mood: 'good', big: 1 },
    { at: [18.1 * Y, 22 * Y], p: 0.35, need: ['worker', 'edu2', '!edu3'], text: 'はじめての 給料で、家族に ごちそうを 買った', icon: 'coin', mood: 'good', big: 1 },
    { at: [20.1 * Y, 24 * Y], p: 0.35, need: ['worker', 'edu3', '!edu4'], text: 'はじめての 給料で、親に プレゼントを 買った', icon: 'gift', mood: 'good', big: 1 },
    { at: [24.6 * Y, 27 * Y], p: 0.35, need: ['worker', 'edu4'], text: 'はじめての 給料で、親を 食事に つれていった', icon: 'gift', mood: 'good', big: 1 },
    { at: [25 * Y, 60 * Y], p: 0.2, need: 'worker', text: ['仕事ぶりが みとめられ、まかされる ことが ふえた', '後輩に 仕事を 教える 立場に なった'], icon: 'star', mood: 'good', big: 1 },
    { at: [25 * Y, 60 * Y], p: 0.15, need: 'worker', text: '仕事で 大きな 失敗を して、落ちこんだ', icon: 'alert', mood: 'hard' },
    { at: [25 * Y, 55 * Y], p: 0.15, need: 'worker', text: '{job}の 仲間たちと、家族のように なった', icon: 'friends', mood: 'good', add: { friends: [2, 4] } },
    { at: [28 * Y, 55 * Y], p: 0.08, need: 'worker', text: 'お金を ためて、自分の 小さな 店を ひらいた', icon: 'house', mood: 'good', big: 2 },
    { at: [25 * Y, 60 * Y], p: 0.15, need: ['worker', '!inc-L'], text: '景気が 悪くなり、しばらく 仕事が なかった', icon: 'rain', mood: 'hard' },
    { at: [25 * Y, 60 * Y], p: 0.3, need: 'homemaker', text: ['家族の ために、毎日 {food}を 作った', '近所の 人たちと 助けあって くらした'], icon: 'apple', mood: 'good' },
    { at: [25 * Y, 60 * Y], p: 0.2, need: 'homemaker', text: '家で 手仕事を して、少しずつ お金を ためた', icon: 'coin' },
    //   仕事ごとの場面
    { at: [25 * Y, 70 * Y], p: 0.4, need: 'job-farm', text: ['畑が 大豊作で、村じゅうで 祝った', 'とれた 作物が 高く 売れて、家族で 喜んだ'], icon: 'sprout', mood: 'good', big: 2 },
    { at: [25 * Y, 70 * Y], p: 0.3, need: 'job-farm', text: ['雨が 降らず、作物が ほとんど とれなかった', '虫の 大群に、畑を 食べられた'], icon: 'sun', mood: 'hard', big: 1 },
    { at: [25 * Y, 65 * Y], p: 0.25, need: ['job-farm', ...NOT_RICH], text: 'お金を ためて、はじめて 牛を 1頭 買った', icon: 'coin', mood: 'good', big: 1 },
    { at: [25 * Y, 65 * Y], p: 0.6, need: 'job-fisher', text: ['大漁で、船が しずみそうなほど 魚が とれた', '見たことも ない 大きな 魚を つりあげた'], icon: 'fish', mood: 'good', big: 2 },
    { at: [25 * Y, 65 * Y], p: 0.4, need: 'job-fisher', text: 'あらしで、何日も 海に 出られなかった', icon: 'rain', mood: 'hard' },
    { at: [25 * Y, 65 * Y], p: 0.6, need: 'job-herder', text: '春に、子ヒツジが 10頭も うまれた', icon: 'baby', mood: 'good', big: 1 },
    { at: [25 * Y, 65 * Y], p: 0.5, need: 'job-vendor', text: '毎朝 来てくれる 常連さんが ふえた', icon: 'coin', mood: 'good', add: { friends: 1 } },
    { at: [25 * Y, 65 * Y], p: 0.5, need: 'job-shop', text: '店を ぬりかえて、新しい 看板を かけた', icon: 'house', mood: 'good' },
    { at: [25 * Y, 65 * Y], p: 0.5, need: 'job-tailor', text: '花嫁の 衣装を まかされ、ひと晩で 仕上げた', icon: 'star', mood: 'good', big: 1 },
    { at: [25 * Y, 60 * Y], p: 0.5, need: 'job-garment', text: 'ミシンの 速さで、工場で いちばんに なった', icon: 'star', mood: 'good' },
    { at: [25 * Y, 60 * Y], p: 0.5, need: 'job-factory', text: '工場の 機械の あつかいで、だれにも 負けなくなった', icon: 'work', mood: 'good' },
    { at: [25 * Y, 60 * Y], p: 0.5, need: 'job-builder', text: '建てるのを 手伝った ビルを、家族に 自慢した', icon: 'house', mood: 'good', big: 1 },
    { at: [25 * Y, 60 * Y], p: 0.4, need: 'job-carpenter', text: '自分の 家を、自分の 手で 建てた', icon: 'house', mood: 'good', big: 2 },
    { at: [25 * Y, 60 * Y], p: 0.5, need: 'job-moto', text: 'お客さんを 乗せて、町じゅうを 走りまわった', icon: 'plane' },
    { at: [35 * Y, 80 * Y], p: 0.6, need: 'job-teacher', text: '大きく なった 教え子が、会いに 来てくれた', icon: 'heart', mood: 'good', big: 2 },
    { at: [25 * Y, 60 * Y], p: 0.6, need: 'job-nurse', text: '夜勤の 病院で、赤ちゃんの 誕生に 立ちあった', icon: 'baby', mood: 'good', big: 1 },
    { at: [30 * Y, 65 * Y], p: 0.6, need: 'job-doctor', text: 'むずかしい 手術を、みごとに 成功させた', icon: 'star', mood: 'good', big: 2 },
    { at: [25 * Y, 55 * Y], p: 0.5, need: 'job-office', text: '大事な 会議で、はじめて 発表を まかされた', icon: 'work' },
    { at: [25 * Y, 55 * Y], p: 0.5, need: 'job-programmer', text: '作った アプリが、たくさんの 人に 使われた', icon: 'phone', mood: 'good', big: 2 },
    { at: [25 * Y, 60 * Y], p: 0.5, need: 'job-cook', text: '{food}を 目当てに、店に 行列が できた', icon: 'apple', mood: 'good', big: 1 },
    { at: [25 * Y, 60 * Y], p: 0.5, need: 'job-domestic', text: '働く 家の 子どもに、とても なつかれた', icon: 'heart', mood: 'good' },
    { at: [25 * Y, 60 * Y], p: 0.5, need: 'job-care', text: 'お年よりに「ありがとう」と 手を にぎられた', icon: 'heart', mood: 'good', big: 1 },

    // ---- おとな ----
    { at: [18 * Y, 70 * Y], p: 0.45, need: 'inc-H', text: ['飛行機で、はじめて 外国を 旅した', '友だちと、遠い 国を 旅して まわった'], icon: 'plane', mood: 'good', big: 1 },
    { at: [18 * Y, 70 * Y], p: 0.35, need: 'inc-UM', text: '家族で、海辺の 町へ 旅行した', icon: 'plane', mood: 'good' },
    { at: [15 * Y, 70 * Y], p: 0.3, need: NOT_RICH, text: 'バスに 半日 ゆられて、親せきの 結婚式へ 行った', icon: 'plane', mood: 'good' },
    { at: [20 * Y, 70 * Y], p: 0.2, need: ['!inc-L', '!inc-H'], text: 'はじめて 飛行機に 乗って、雲の 上を 見た', icon: 'plane', mood: 'good', big: 1 },
    { at: [22 * Y, 55 * Y], p: 0.25, text: ['もっと 広い 家に 引っこした', '家族が ふえて、大きな 家に うつった'], icon: 'box', add: { moves: 1 } },
    { at: [30 * Y, 60 * Y], p: 0.25, need: ['married', ...NOT_RICH], text: '家族で 力を あわせて、れんがの 家を 建てた', icon: 'house', mood: 'good', big: 2 },
    { at: [30 * Y, 55 * Y], p: 0.3, need: ['married', ...RICH], text: 'ローンを 組んで、自分たちの 家を 買った', icon: 'house', mood: 'good', big: 2 },
    { at: [25 * Y, 70 * Y], p: 0.3, group: 'hobby', text: ['週末の {sport}が、何よりの 楽しみに なった', '料理に こって、{food}が 得意に なった', '歌が 好きで、近所の 合唱団に 入った', '{sport}の 大一番を、近所の みんなで 応援した'], icon: 'music', mood: 'good', add: { friends: [1, 3] } },
    { at: [5 * Y, 70 * Y], p: 0.2, need: ['inc-L', 'rural'], text: '村に 電気が 来た日、みんなで 大喜びした', icon: 'star', mood: 'good', big: 2 },
    { at: [5 * Y, 40 * Y], p: 0.2, need: NOT_RICH, text: '家に はじめて テレビが 来て、近所の 人が 集まった', icon: 'star', mood: 'good' },
    { at: [10 * Y, 60 * Y], p: 0.15, need: ['rural', ...NOT_RICH], text: '村に 水道が ひかれて、水くみが 楽に なった', icon: 'drop', mood: 'good', big: 1 },
    { at: [26 * Y, 65 * Y], p: 0.35, need: ['phone', 'r-SSA'], text: '携帯電話で、お金を 送れるように なった', icon: 'phone', mood: 'good' },
    { at: [30 * Y, 85 * Y], p: 0.2, need: 'phone', text: '遠くに すむ 家族と、ビデオ通話で 話した', icon: 'phone', mood: 'good' },
    { at: [30 * Y, 80 * Y], p: 0.15, text: '病気で 入院したが、元気に なって 家に 帰った', icon: 'bandage', mood: 'hard' },
    { at: [40 * Y, 90 * Y], p: 0.15, text: '幼なじみと ひさしぶりに 会って、笑いころげた', icon: 'friends', mood: 'good' },
    //   結婚・子育て
    { at: [30 * Y, 70 * Y], p: 0.2, need: 'married', text: '夫婦げんかを したが、次の日 なかなおりした', icon: 'heart' },
    { at: [30 * Y, 48 * Y], p: 0.25, need: 'parent', text: ['子どもが 熱を 出して、ひと晩じゅう そばに いた', '子どもの 寝顔を 見て、つかれが ふきとんだ'], icon: 'baby' },
    { at: [32 * Y, 50 * Y], p: 0.25, need: 'parent', text: ['子どもと いっしょに、{fest}の 準備を した', '夜、子どもに 字を 教えた', '子どもが 学校で 一番に なり、近所に 自慢した'], icon: 'heart', mood: 'good' },
    { at: [45 * Y, 70 * Y], p: 0.2, need: 'parent', text: '子どもが 家を 出て、家が 急に 静かに なった', icon: 'house' },
    { at: [48 * Y, 75 * Y], p: 0.2, need: 'parent', text: '子どもの 結婚式で、こっそり 泣いた', icon: 'rings', mood: 'good', big: 1 },
    { at: [40 * Y, 90 * Y], p: 0.3, need: 'lostchild', text: '亡くした 子の ことを、毎年 その日に 思った', icon: 'feather' },
    //   町へ出た人・外国へ行った人
    { at: [30 * Y, 60 * Y], p: 0.4, need: 'migrant', text: '村の 家族に、毎月 お金を 送った', icon: 'coin' },
    { at: [30 * Y, 75 * Y], p: 0.35, need: 'migrant', text: 'ひさしぶりに 村へ 帰ると、みんなが 集まってきた', icon: 'house', mood: 'good', big: 1 },
    { at: [30 * Y, 80 * Y], p: 0.5, need: 'abroad', text: ['{country}の 料理が 恋しくて、自分で 作った', '外国の ことばで、夢を 見るように なった'], icon: 'apple' },
    { at: [35 * Y, 85 * Y], p: 0.35, need: 'abroad', text: '何年ぶりかに、{country}の 土を ふんだ', icon: 'plane', mood: 'good', big: 2 },
    //   地域ごとの天気・災害・くらし
    { at: [3 * Y, 85 * Y], p: 0.22, need: 'r-SA', text: 'モンスーンの 大雨で、家が 水に つかった', icon: 'rain', mood: 'hard', big: 1 },
    { at: [3 * Y, 85 * Y], p: 0.2, need: ['r-SSA', 'rural'], text: '雨の 降らない 年が つづき、井戸が かれかけた', icon: 'sun', mood: 'hard' },
    { at: [3 * Y, 85 * Y], p: 0.25, need: 'r-EA', text: '台風が 来て、まる一日 家に こもった', icon: 'rain' },
    { at: [4 * Y, 12 * Y], p: 0.5, need: 'r-EA', text: '新年に、親せきから お年玉を もらった', icon: 'gift', mood: 'good' },
    { at: [3 * Y, 95 * Y], p: 0.25, need: 'c-JP', text: '大きな 地震の あと、しばらく ひなん所で すごした', icon: 'alert', mood: 'hard', big: 1 },
    { at: [3 * Y, 85 * Y], p: 0.25, need: 'r-SEA', text: '台風で 屋根が とばされ、みんなで 直した', icon: 'rain', mood: 'hard', big: 1 },
    { at: [3 * Y, 85 * Y], p: 0.3, need: 'r-MENA', text: '砂あらしで、空が まっ黄色に なった', icon: 'alert' },
    { at: [5 * Y, 85 * Y], p: 0.25, need: 'r-MENA', text: 'あまりの 暑さに、昼間は 家で じっと していた', icon: 'sun' },
    { at: [10 * Y, 85 * Y], p: 0.25, need: 'r-EU', text: '記録的な 暑さの 夏を、なんとか のりきった', icon: 'sun', mood: 'hard' },
    { at: [4 * Y, 14 * Y], p: 0.35, need: ['r-EU', ...RICH], text: '夏休みに、家族で 海辺の 町で ひと月 すごした', icon: 'sun', mood: 'good' },
    { at: [5 * Y, 85 * Y], p: 0.25, need: 'r-NA', text: '大雪で、町じゅうが 3日 止まった', icon: 'snow', mood: 'hard' },
    { at: [4 * Y, 11 * Y], p: 0.5, need: 'r-NA', text: 'ハロウィンに、おばけの 仮装で 町を 歩いた', icon: 'star', mood: 'good' },
    { at: [3 * Y, 85 * Y], p: 0.15, need: 'r-LA', text: '大きな 地震で、家の かべに ひびが 入った', icon: 'alert', mood: 'hard' },
    { at: [3 * Y, 85 * Y], p: 0.25, need: 'r-OC', text: '山火事の けむりで、空が オレンジ色に なった', icon: 'sun', mood: 'hard' },
    { at: [5 * Y, 40 * Y], p: 0.35, need: 'r-CA', text: 'ウマに 乗って、広い 草原を かけた', icon: 'plane', mood: 'good' },
    //   親を見送る（所得の低い国ほど早い）
    { at: [15 * Y, 60 * Y], p: 0.35, need: NOT_RICH, text: '父を 見送った。大きな せなかを 思い出した', icon: 'feather', mood: 'hard', big: 2 },
    { at: [35 * Y, 75 * Y], p: 0.4, need: RICH, text: '父を 見送った。最後に「ありがとう」と 言えた', icon: 'feather', mood: 'hard', big: 2 },
    { at: [20 * Y, 65 * Y], p: 0.35, need: NOT_RICH, text: '母を 見送った。母の 歌を そっと 口ずさんだ', icon: 'feather', mood: 'hard', big: 2 },
    { at: [40 * Y, 80 * Y], p: 0.4, need: RICH, text: '母を 見送った。母の 味は、ずっと おぼえていた', icon: 'feather', mood: 'hard', big: 2 },
    { at: [55 * Y, 100 * Y], p: 0.35, need: 'married', text: '長年 つれそった 相手を 見送った', icon: 'feather', mood: 'hard', big: 2, set: 'widowed' },

    // ---- 老い ----
    { at: [55 * Y, 100 * Y], p: 0.4, need: 'grandparent', text: ['孫に、{sweet}を こっそり あげた', '孫を ひざに のせて、昔話を した', '孫に 同じ 話を して「それ 3回目」と 言われた'], icon: 'gift', mood: 'good', big: 1 },
    { at: [62 * Y, 100 * Y], p: 0.25, need: ['grandparent', 'phone'], text: '孫に、スマホの 使い方を 教わった', icon: 'phone', mood: 'good' },
    { at: [72 * Y, 110 * Y], p: 0.3, need: 'grandparent', text: 'ひ孫を はじめて だっこした', icon: 'baby', mood: 'good', big: 2 },
    { at: [60 * Y, 105 * Y], p: 0.4, need: 'widowed', text: '毎朝、連れあいの 写真に 話しかけた', icon: 'heart' },
    { at: [62 * Y, 100 * Y], p: 0.25, text: ['庭の 花の 世話が、毎朝の 楽しみに なった', '家の まわりで 野菜を 育てて すごした'], icon: 'flower', mood: 'good' },
    { at: [62 * Y, 95 * Y], p: 0.25, need: 'retired', text: ['朝の 公園で、同じ 顔ぶれと 体操を した', '毎日、好きな 本を 読んで すごした'], icon: 'sun', mood: 'good' },
    { at: [65 * Y, 100 * Y], p: 0.2, text: '若いころの 話を はじめると、止まらなくなった', icon: 'music' },
    { at: [65 * Y, 100 * Y], p: 0.3, need: ['rural', '!migrant', '!inc-H'], text: '村の 長老として、もめごとの 相談に のった', icon: 'crown', mood: 'good', big: 1 },
    { at: [70 * Y, 105 * Y], p: 0.25, text: ['杖を ついて、ゆっくり 散歩するのが 日課に なった', '耳が 遠くなり、家族が 大きな 声で 話すように なった'], icon: 'sun' },
    { at: [85 * Y, 112 * Y], p: 0.5, text: 'みんなに、長生きの ひけつを きかれた', icon: 'crown', mood: 'good', big: 2 },
    { at: [100 * Y, 101 * Y], p: 0.9, text: 'みんなが、100さいの 誕生日を 祝ってくれた', icon: 'cake', mood: 'good', big: 3 },
  ],

  // さいご。WHO の死因の推計（年齢・所得の段階ごと）に、おおまかに合わせた重み
  //   自死・戦争・紛争・犯罪による死は書かない（CONTENT.md の決まり）
  deaths: [
    // 赤ちゃん（新生児の死因は 早産・お産のときのむずかしさ・感染症・うまれつきの病気が多い）
    { at: [0, 2 * M], w: 4, text: ['予定より ずっと 早く うまれ、ちいさな いのちを 終えた', 'とても 小さく うまれて、家族に だかれて 眠った'] },
    { at: [0, 2 * M], w: 2.5, need: '!inc-H', text: 'お産が むずかしく、うまれて まもなく 眠った' },
    { at: [0, 3 * M], w: 2, need: '!inc-H', text: 'うまれて すぐ 感染症に かかり、いのちを 終えた' },
    { at: [0, 5 * Y], w: 2, text: ['うまれつき 心臓が 弱く、しずかに 眠った', 'うまれつきの 病気で、家族に 見守られて 眠った'] },
    // 5歳まで（肺炎・おなかの病気・マラリア）
    { at: [M, 5 * Y], w: 2, text: '肺炎に かかって、ちいさな いのちを 終えた' },
    { at: [M, 5 * Y], w: 2, need: NOT_RICH, text: 'おなかの 病気が 治らず、ちいさな いのちを 終えた' },
    { at: [M, 10 * Y], w: 2, need: ['r-SSA', '!inc-H'], text: 'マラリアに かかって、いのちを 終えた' },
    { at: [Y, 60 * Y], w: 1.5, need: NOT_RICH, text: '感染症に かかって、いのちを 終えた' },
    // こども・若いころ（水の事故・交通事故・重い病気）
    { at: [Y, 25 * Y], w: 1.2, text: '水の 事故で、いのちを 終えた' },
    { at: [Y, 30 * Y], w: 1, text: '重い 病気が 見つかり、家族に 見守られて 眠った' },
    { at: [3 * Y, 80 * Y], w: 1.5, text: ['道を わたる とき、車に ぶつかって いのちを 終えた', '交通事故で、とつぜん いのちを 終えた'] },
    { at: [15 * Y, 60 * Y], w: 1, need: '!inc-H', text: 'バイクの 事故で、いのちを 終えた' },
    // おとな
    { at: [15 * Y, 80 * Y], w: 1.5, need: NOT_RICH, text: '結核に かかって、いのちを 終えた' },
    { at: [15 * Y, 65 * Y], w: 1.5, need: 'r-SSA', text: 'HIVの 病気が すすんで、いのちを 終えた' },
    { at: [16 * Y, 46 * Y], w: 2, need: ['f', 'parent', ...NOT_RICH], text: '赤ちゃんを うんだ あと、いのちを 終えた' },
    { at: [30 * Y, 60 * Y], w: 2.5, text: 'がんが 見つかり、家族に 見守られて 眠った' },
    { at: [35 * Y, 60 * Y], w: 3, text: ['心臓の 病気で、とつぜん いのちを 終えた', '脳の 病気で たおれ、いのちを 終えた'] },
    { at: [45 * Y, 130 * Y], w: 1.5, text: ['糖尿病が すすんで、いのちを 終えた', '腎臓の 病気で、いのちを 終えた'] },
    // 老い（心臓の病気・脳卒中・肺の病気・がん・認知症が多い）
    { at: [60 * Y, 130 * Y], w: 6, text: '心臓の 病気で、家族に 見守られて 眠った' },
    { at: [60 * Y, 130 * Y], w: 4, text: '脳の 病気で、しずかに いのちを 終えた' },
    { at: [60 * Y, 130 * Y], w: 4, text: 'がんと 長く 向きあい、しずかに 眠った' },
    { at: [60 * Y, 130 * Y], w: 4, text: ['肺炎に かかって、しずかに いのちを 終えた', '肺の 病気が 重くなり、いのちを 終えた'] },
    { at: [72 * Y, 130 * Y], w: 2.5, need: '!inc-L', text: 'もの忘れの 病気が すすみ、しずかに 眠った' },
    { at: [80 * Y, 130 * Y], w: 5, text: ['老衰で、家族に 見守られて 眠った', '昼寝の あと、そのまま 目を さまさなかった'] },
    { at: [70 * Y, 130 * Y], w: 3, need: 'grandparent', text: '孫たちに かこまれて、しずかに 眠った' },
  ],

  titles: [
    { maxAge: W, text: 'ほんの 数日だけ、この 世界を 見た 赤ちゃん' },
    { minAge: W, maxAge: 5 * Y, text: 'みんなの 腕の中で すごした ちいさな いのち' },
    { minAge: 5 * Y, maxAge: 18 * Y, text: 'おとなに なる 日を 夢見ていた {country}の 子' },
    { minAge: 100 * Y, text: '100年を 生きぬいた {country}の 長老' },
    { minAge: 60 * Y, long: 0.05, text: '{country}でも 指おりの 長生き' },
    { need: 'f', stat: { grandkids: 10 }, text: '孫{grandkids}人に かこまれた おばあちゃん' },
    { need: 'm', stat: { grandkids: 10 }, text: '孫{grandkids}人に かこまれた おじいちゃん' },
    { stat: { kids: 6 }, text: '{kids}人の 子に めぐまれた 大家族の 柱' },
    { need: 'abroad', text: '海を こえて 生きた {country}うまれの ひと' },
    { need: 'migrant', text: '村から {city}へ 出て、道を ひらいた ひと' },
    { need: 'literate', text: 'おとなに なって 字を おぼえた がんばりや' },
    { need: 'job-farm', minAge: 50 * Y, text: '畑と ともに 生きた {country}の 農家' },
    { need: 'job-fisher', minAge: 45 * Y, text: '海と ともに 生きた 漁師' },
    { need: 'job-teacher', minAge: 50 * Y, text: 'たくさんの 子に 字を 教えた 先生' },
    { need: ['worker', 'retired'], minAge: 70 * Y, text: '{job}ひとすじに 生きた ひと' },
    { need: 'homemaker', minAge: 60 * Y, stat: { kids: 3 }, text: '家族の まんなかに、いつも いた ひと' },
    { need: ['grandparent', 'f'], minAge: 60 * Y, text: '孫たちに したわれた {country}の おばあちゃん' },
    { need: ['grandparent', 'm'], minAge: 60 * Y, text: '孫たちに したわれた {country}の おじいちゃん' },
  ],

  facts: [
    '世界では 1年に 約1億3000万人の 赤ちゃんが うまれています（国連の推計）',
    'いちばん 多く 赤ちゃんが うまれる 国は インドで、世界の 約6人に1人です（国連の推計）',
    '世界の 平均寿命は 約73歳です（2024年・国連の推計）',
    '世界では、女性の ほうが 男性より 平均で 約5年 長生きです（国連の推計）',
    '5歳に なる前に 亡くなる 子どもの 割合は、2000年から 約半分に へりました（国連の推計）',
    '世界には 約7000の ことばが あると いわれています',
    '世界の 約4人に3人が、インターネットを 使っています（2025年・ITU の推計）',
    '記録に のこる いちばんの 長生きは、フランスの ジャンヌ・カルマンさんの 122歳です',
    'うまれる 赤ちゃんは、女の子 100人に 対して 男の子が 約105人と、少し 男の子が 多いです',
    'いま 地球には、約82億人が くらしています（2024年・国連の推計）',
  ],

  sources: [
    'https://population.un.org/wpp/ (国連 World Population Prospects 2024: 出生数 約1.32億人・平均寿命 73.3歳・人口 82億人・男女差・国別の出生数)',
    'https://population.un.org/WPP/Publications/Files/WPP2024_Key-Messages.pdf (WPP2024 要点: 平均寿命 73.3歳)',
    'https://data.unicef.org/resources/levels-and-trends-in-child-mortality-2024/ (国連 IGME 2024: 5歳未満の死亡率は2000年から52%減・2023年は約480万人)',
    'https://www.ethnologue.com/insights/how-many-languages/ (Ethnologue: 生きている言語 約7,159)',
    'https://www.itu.int/pub/D-IND-ICT_MDD-2025-3 (ITU Facts and Figures 2025: 約60億人・74%がインターネットを利用)',
    'https://www.guinnessworldrecords.com/world-records/oldest-person (ジャンヌ・カルマン 122歳164日)',
    'https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-leading-causes-of-death (WHO 世界の死因の推計・所得の段階別)',
    'https://www.who.int/news-room/fact-sheets/detail/newborn-mortality (WHO 新生児の死因: 早産・お産の合併症・感染症・先天異常)',
    'https://www.who.int/news-room/fact-sheets/detail/malaria (WHO マラリア: 死亡の大半はアフリカの5歳未満)',
    'https://www.who.int/news-room/fact-sheets/detail/drowning (WHO 水の事故: 1〜24歳の主な死因の一つ)',
    'https://blogs.worldbank.org/en/opendata/incomes-rise-farm-employment-drops (世界銀行: 所得の段階別の農業就業の割合 61%/40%/22%/3%)',
    'https://ourworldindata.org/sex-ratio-at-birth (出生時の男女比: 多くの国で 女100に対し男 約105・WHO の「期待される比」)',
  ],
};
