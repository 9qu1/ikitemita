// サケ（シロザケ）: 川の じゃりで たまご → ちぎょ → 海へ（ベーリング海などで3〜5年）→ 生まれた川の においを たどって帰る → たまごを のこして一生を終える
//   たまごが うまれるのは秋（10〜11月）。だから「年齢ちょうど」の日が、帰ってくる秋になる
//   帰る年（3・4・5年め）と、うまれかた（川の じゃり／ふ化場）で variant を分けている
import { H, D, W, M, Y } from '../units.js?v=1.0.2';

// ---- 生き残りの曲線 ----
// 川の じゃりで うまれた たまご: 稚魚まで 12.6%（豊平川の調査）・稚魚から おとなまで 0.22〜0.86%（千歳川の野生魚）
const WILD_PRE = [[0, 1], [M, 0.6], [2 * M, 0.33], [4 * M, 0.126], [5 * M, 0.05], [7 * M, 0.012], [10 * M, 0.0035], [1.5 * Y, 0.0016], [2.5 * Y, 0.001]];
// ふ化場の たまご: 放流（春）まで 8〜9割が育つ・放流した稚魚から おとなまで 0.17〜1.29%（千歳川）。ここでは 約1.1%
const HATCH_PRE = [[0, 1], [M, 0.95], [2 * M, 0.9], [5.5 * M, 0.85], [6.5 * M, 0.3], [8 * M, 0.08], [10 * M, 0.035], [1.5 * Y, 0.02], [2.5 * Y, 0.013]];
// 2.5年から先は 年に75%ずつ。帰ってくる秋に: 沿岸の網やアザラシで4割、川で1.5割がへり、のこりは たまごを うんで 2週間ほどで一生を終える
const curve = (pre, R) => {
  const [t0, s0] = pre[pre.length - 1];
  const sA = s0 * Math.pow(0.75, (R - 4 * M - t0) / Y);
  const sB = sA * 0.97;
  const sC = sB * 0.6;
  const sD = sC * 0.85;
  return [...pre, [R - 4 * M, sA], [R - 0.8 * M, sB], [R - 0.25 * M, sC], [R - 0.1 * M, sD], [R + 0.5 * M, 0]];
};

// ---- 帰る年 R ごとの できごと（海の くらし・帰る旅・産卵）----
const homeEvents = (R) => [
  // 海での くらし（帰る旅の前まで）
  { at: [1.5 * Y, R - 4 * M], repeat: [1, 2], need: 'sea', text: ['夏は ベーリング海で、えさを たっぷり 食べた', '冬は アラスカ湾の あたりで すごした', '何千匹もの 仲間と、北の 海を めぐった'], icon: 'drop', add: { km: [1500, 3000] } },
  { at: [1.5 * Y, R - 4 * M], p: 0.3, need: 'sea', text: 'サメに 追われて、群れが ばらばらに なった', icon: 'alert', mood: 'hard' },
  { at: [1.5 * Y, R - 4 * M], p: 0.3, need: 'sea', text: 'えさの すくない 冬で、なかなか 太れなかった', icon: 'rain', mood: 'hard' },
  { at: [2 * Y, R - 4 * M], p: 0.25, need: 'sea', text: 'アザラシの 群れの そばを、そっと 通りぬけた', icon: 'look' },
  { at: [2 * Y, R - 4 * M], p: 0.2, need: 'sea', text: 'クジラが 口を あけて、すぐ そばを 通っていった', icon: 'look' },

  // ふるさとの 川へ 帰る旅（夏の おわり〜秋）
  { at: [R - 4 * M, R - 3 * M], need: 'sea', text: '夏の おわり、ふるさとの 川へ 向かって 泳ぎだした', icon: 'plane', big: 3, set: 'homing' },
  { at: [R - 2.5 * M, R - 0.8 * M], need: 'homing', text: '何千キロも 泳いで、ふるさとの 近くの 海に 着いた', icon: 'plane', big: 1, add: { km: [2000, 4000] } },
  { at: [R - 0.8 * M, R - 0.5 * M], p: 0.7, need: 'homing', text: '銀色の からだに、しまもようが うかんできた', icon: 'star' },
  { at: [R - 0.5 * M, R - 0.3 * M], need: 'homing', text: 'うまれた 川の においを 見つけた', icon: 'look', big: 3, set: 'smell' },
  { at: [R - 0.25 * M, R - 0.18 * M], need: 'smell', text: 'においを たどって、うまれた 川に 入った', icon: 'house', mood: 'good', big: 3, move: 'river', set: 'river' },
  { at: [R - 0.18 * M, R - 0.1 * M], p: 0.6, need: 'river', text: '流れに さからって、小さな 滝を とびこえた', icon: 'star', mood: 'good', big: 1 },
  { at: [R - 0.18 * M, R - 0.1 * M], p: 0.3, need: 'river', text: 'クマの 前足を、ぎりぎりで かわした', icon: 'alert', mood: 'hard' },

  // ふ化場の川に 帰ったサケは、わなで つかまって たまごを とられることが多い（下の産卵より先に書く）
  { at: [R - 0.1 * M, R - 0.05 * M], p: 0.6, need: ['river', 'hatch'], text: 'ふ化場の わなに 入り、次の いのちを 人に たくした', icon: 'egg', big: 3, set: 'gave' },
  // 川で 自然に たまごを うむ
  { at: [R - 0.1 * M, R + 0.3 * M], need: ['river', 'f', '!gave'], text: '尾びれで じゃりを ほって、{n}この たまごを うんだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [2500, 4000] }, set: 'spawned' },
  { at: [R - 0.1 * M, R + 0.3 * M], need: ['river', 'm', '!gave'], text: 'メスの となりで、たまごに いのちを ふきこんだ', icon: 'heart', mood: 'good', big: 3, set: 'spawned' },
  { at: [R - 0.05 * M, R + 0.4 * M], p: 0.7, need: ['spawned', 'f'], text: 'ぼろぼろの からだで、たまごの 上を 守りつづけた', icon: 'house', big: 2 },
  { at: [R - 0.05 * M, R + 0.4 * M], p: 0.5, need: ['spawned', 'm'], text: 'ほかの オスを 追いはらって、メスの そばに いた', icon: 'alert' },
];

// 帰ってくる年の わりあい: 4年めが68%・3年めが25%・5年めが7%（水産研究・教育機構 2022年の全国の河川）
const AGES = [[3, 0.25], [4, 0.66], [5, 0.09]];

const WILD_PLACES = [
  { text: '札幌の 豊平川（とよひらがわ）', lat: 43.03, lon: 141.37 },
  { text: '北海道 知床の ルシャ川', lat: 44.19, lon: 145.19 },
  { text: 'ロシアの アムール川', lat: 53.14, lon: 140.73 },
  { text: 'ロシアの サハリンの 川', lat: 47.0, lon: 142.7 },
];
const HATCH_PLACES = [
  { text: '北海道の 千歳川（ちとせがわ）の ふ化場', lat: 42.82, lon: 141.65 },
  { text: '北海道の 標津（しべつ）の ふ化場', lat: 43.66, lon: 145.13 },
  { text: '北海道の 斜里（しゃり）の ふ化場', lat: 43.91, lon: 144.67 },
  { text: '岩手の 宮古の ふ化場', lat: 39.64, lon: 141.95 },
  { text: '新潟の 三面川（みおもてがわ）の ふ化場', lat: 38.22, lon: 139.48 },
];

// たまごの数で数えると、ふ化場うまれは 全体の5%ほど（世界の シロザケの おとなの6割は ふ化場うまれだが、ふ化場の たまごは 生きのこりやすいため）。
// 日本の サケの話として ふ化場も 見せたいので、ここでは 15% に ふやしている
const variants = [
  ...AGES.map(([a, w]) => ({ id: `wild${a}`, label: 'シロザケ', w: 0.85 * w, habitat: 'river', tags: ['wild'], places: WILD_PLACES, survival: curve(WILD_PRE, a * Y), events: homeEvents(a * Y) })),
  ...AGES.map(([a, w]) => ({ id: `hatch${a}`, label: 'ふ化場うまれの シロザケ', w: 0.15 * w, habitat: 'river', tags: ['hatch'], places: HATCH_PLACES, survival: curve(HATCH_PRE, a * Y), events: homeEvents(a * Y) })),
];

export default {
  id: 'salmon',
  name: 'サケ',
  kind: 'animal',
  weight: 1,
  // 世界の シロザケの おとなは 毎年 約1億2千万匹が 帰り（うち ふ化場うまれ 6割・Ruggerone ほか 2010）、
  // ふ化場だけで 毎年 約30億匹の 稚魚が 放流される（NPAFC）。海の 若いサケも 合わせて 10億匹ほどと 見積もった（目安）
  realCount: 1e9,
  refDays: 5 * Y,
  habitat: 'river',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で、たまごとして うまれた', '{place}で、オレンジ色の たまごとして うまれた'],

  variants,

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'roe', scale: 0.35 },
    { id: 'alevin', name: '赤ちゃんサケ', from: 2 * M, sprite: 'salmon', scale: 0.2, say: 'たまごから かえり、おなかの 栄養で 育った', icon: 'egg', big: 2 },
    { id: 'fry', name: 'ちぎょ', from: 4 * M, sprite: 'salmon', scale: 0.3, say: 'ひれを うごかして、自由に 泳ぎはじめた', icon: 'sprout', big: 1 },
    { id: 'young', name: '若いサケ', from: Y, sprite: 'salmon', scale: 0.6 },
    { id: 'adult', name: 'おとなのサケ', from: 2.5 * Y, sprite: 'salmon', scale: 0.9, say: 'りっぱな おとなの サケに なった', icon: 'star' },
  ],

  stats: [
    { id: 'km', label: '泳いだ きょり', unit: 'km' },
    { id: 'eggs', label: 'うんだ たまご', unit: 'こ' },
  ],

  events: [
    // たまご（秋〜冬）
    { at: [0, 2 * H], need: 'wild', text: 'お母さんが 尾びれで じゃりを かけて、巣を とじた', icon: 'house' },
    { at: [0, 2 * H], need: 'hatch', text: '人の 手で、ふ化場の 水そうに うつされた', icon: 'house' },
    { at: [3 * D, 20 * D], need: 'wild', text: 'つめたい わき水が、じゃりの すきまを 流れていった', icon: 'drop' },
    { at: [3 * D, 20 * D], need: 'hatch', text: 'きれいな 水が、たまごの まわりを 流れつづけた', icon: 'drop' },
    { at: [25 * D, 40 * D], text: 'たまごの中に、黒い 目が 見えてきた', icon: 'look', big: 1 },
    { at: [40 * D, 58 * D], p: 0.8, text: 'たまごの中で、ときどき くるりと 動いた', icon: 'look' },
    { at: [10 * D, 55 * D], p: 0.3, need: 'wild', text: '大雨で 川が にごり、じゃりの すきまが うまりかけた', icon: 'rain', mood: 'hard' },
    { at: [20 * D, 55 * D], p: 0.25, need: 'wild', text: '川岸が こおるほど、寒い 夜が つづいた', icon: 'snow', mood: 'hard' },
    { at: [10 * D, 55 * D], p: 0.3, need: 'hatch', text: 'ふ化場の 人が、毎日 水の ようすを 見てくれた', icon: 'look', mood: 'good' },
    { at: [2 * M, 4 * M], p: 0.6, need: 'wild', text: 'じゃりの中で、おなかの 栄養の ふくろが 小さく なった', icon: 'sprout' },
    { at: [2 * M, 3.5 * M], p: 0.6, need: 'hatch', text: '水そうで、何万匹もの きょうだいと ならんだ', icon: 'friends' },
    { at: [4 * M, 5 * M], need: 'hatch', text: 'はじめて えさを もらって、ぱくぱく 食べた', icon: 'apple', mood: 'good' },

    // 春: 川を くだって 海へ
    { at: [4 * M, 4.6 * M], p: 0.7, need: 'wild', text: '春の 雪どけ水に のって、川を くだった', icon: 'drop', big: 1, add: { km: [5, 40] } },
    { at: [4 * M, 5 * M], p: 0.35, need: 'wild', text: 'サギの 長い くちばしから、石の かげへ にげた', icon: 'alert', mood: 'hard' },
    { at: [4.6 * M, 5 * M], need: 'wild', text: '水が しょっぱくなり、とうとう 海に 出た', icon: 'drop', big: 3, move: 'ocean', set: 'sea' },
    { at: [5.2 * M, 5.5 * M], need: 'hatch', text: '春、何万匹もの ちぎょと いっしょに 川へ 放された', icon: 'star', big: 2 },
    { at: [5.5 * M, 5.8 * M], need: 'hatch', text: '川を いっきに くだって、海に 出た', icon: 'drop', big: 3, move: 'ocean', set: 'sea', add: { km: [5, 40] } },

    // 海で 育つ（はじめの1年半）
    { at: [5 * M, 7 * M], p: 0.7, need: 'sea', text: '岸の 近くで、小さな プランクトンを 食べて 育った', icon: 'apple' },
    { at: [5 * M, 8 * M], p: 0.35, need: 'sea', text: '大きな 魚の 群れに 追われ、ひっしに にげた', icon: 'alert', mood: 'hard' },
    { at: [7 * M, 9 * M], p: 0.8, need: 'sea', text: '8センチほどに 育って、沖へ 出ていった', icon: 'plane', add: { km: [200, 500] } },
    { at: [8 * M, 11 * M], p: 0.7, need: 'sea', text: '夏の オホーツク海で、仲間と 群れて 泳いだ', icon: 'friends', mood: 'good', add: { km: [500, 1000] } },
    { at: [11 * M, 1.4 * Y], p: 0.6, need: 'sea', text: 'はじめての 冬を、北太平洋の 冷たい 海で こした', icon: 'snow' },
    { at: [1.5 * Y, 2 * Y], p: 0.8, need: 'sea', text: 'ベーリング海に 着いて、オキアミや クラゲを 食べた', icon: 'apple', mood: 'good', big: 1, add: { km: [2000, 3000] } },
  ],

  deaths: [
    { at: [0, 2 * M], w: 4, need: 'wild', text: ['じゃりの中で、たまごのまま 眠った', '川の 底で、かえることなく 眠った'] },
    { at: [2 * M, 5 * M], w: 3, need: ['wild', '!sea'], text: 'じゃりの中で、ちいさな いのちを 終えた' },
    { at: [4 * M, 5 * M], w: 2, need: ['wild', '!sea'], text: 'サギに つかまって、ちいさな いのちを 終えた' },
    { at: [0, 6 * M], w: 4, need: ['hatch', '!sea'], text: 'ふ化場の 水そうで、育たずに 眠った' },
    { at: [4.5 * M, 2 * Y], w: 5, need: ['sea', '!homing'], text: ['海で 大きな 魚に 食べられて、いのちを 終えた', '海鳥に つかまって、ちいさな いのちを 終えた'] },
    { at: [5 * M, 3 * Y], w: 2, need: ['sea', '!homing'], text: 'えさを 見つけられず、海で しずかに 眠った' },
    { at: [Y, 6 * Y], w: 3, need: ['sea', '!homing'], text: ['サメに つかまって、いのちを 終えた', 'アザラシに つかまって、いのちを 終えた'] },
    { at: [2.5 * Y, 6 * Y], w: 5, need: ['homing', '!river'], text: 'ふるさとの 手前で 漁の 網に 入り、人の 食卓へ いった' },
    { at: [2.5 * Y, 6 * Y], w: 3, need: ['river', '!spawned', '!gave'], text: 'クマに つかまって、いのちを 終えた' },
    { at: [2.5 * Y, 6 * Y], w: 2, need: ['river', '!spawned', '!gave'], text: '川を のぼる とちゅうで、力つきて 眠った' },
    { at: [2.5 * Y, 6 * Y], w: 20, need: 'spawned', text: ['たまごを のこして、川の 底で しずかに 眠った', 'ふるさとの 川で、一生を 終えた'] },
    { at: [2.5 * Y, 6 * Y], w: 20, need: 'gave', text: 'ふ化場で、次の いのちを のこして 一生を 終えた' },
  ],

  titles: [
    { need: ['spawned', 'f'], text: '{eggs}この たまごを のこした お母さんサケ' },
    { need: ['spawned', 'm'], text: 'ふるさとの 川で、いのちを つないだ オス' },
    { need: 'gave', text: 'ふ化場に いのちを たくした 帰りサケ' },
    { need: ['homing', '!spawned', '!gave'], text: 'ふるさとの 川を めざして 帰ってきた サケ' },
    { need: 'sea', maxAge: Y, text: '海の 広さを すこしだけ 知った ちぎょ' },
    { need: ['sea', '!homing'], minAge: Y, text: '北の 海を 何千キロも 旅した サケ' },
    { need: ['!sea', 'wild'], text: 'じゃりの中の、ちいさな いのち' },
    { need: ['!sea', 'hatch'], text: 'ふ化場の 水そうで うまれた いのち' },
  ],

  facts: [
    'メスの サケが うむ たまごは、1回で 約3000つぶです',
    'サケは うまれた 川の においを おぼえていて、それを たどって 帰る と 考えられています',
    '川で 自然に うまれた たまごが、ちぎょに なれるのは 約1割 という調査が あります（札幌の 豊平川）',
    'ちぎょのうち、おとなに なって 帰ってくるのは 1000匹に 2〜9匹ほど という調査が あります（千歳川）',
    '日本では 毎年 約13億匹の ちぎょが、ふ化場から 川へ 放されています',
    '帰ってくるのは 4年めが いちばん 多く、3年めや 5年めの サケも います',
  ],

  sources: [
    'https://www.miyagi.kopas.co.jp/JSFS/jsfs-english/E-PUB/80-6/80_946.html (日本水産学会誌 2014: 豊平川の 自然産卵の たまご→稚魚 12.6%)',
    'https://jsfs.jp/en/2014/03 (Fisheries Science 2014: 千歳川の 稚魚→おとな 野生0.22〜0.86%・ふ化場0.17〜1.29%)',
    'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12122101/ (日本の 稚魚放流 1983年 20億→2021年 13億)',
    'https://salmon.fra.affrc.go.jp/zousyoku/R04salmon/R4comment_1331_age.pdf (水産研究・教育機構: 帰ってきたサケの年齢 4年魚68%・3年魚25%・5年魚7%)',
    'https://www.pref.ibaraki.jp/nourinsuisan/naisuishi/gyogancho/documents/042_sake.pdf (茨城県: たまご 約3000粒・川のにおいで帰る)',
    'https://www.pref.ishikawa.lg.jp/suisanka/mituryou/sake/documents/sake_mametisiki.pdf (石川県: 沿岸で8cm・13℃で沖へ・放流1000匹のうち3〜4匹が帰る)',
    'https://bioone.org/journals/marine-and-coastal-fisheries/volume-2010/issue-2010/C09-054.1/Magnitude-and-Trends-in-Abundance-of-Hatchery-and-Wild-Pink/10.1577/C09-054.1.full (Ruggerone ほか 2010: シロザケの おとな 年7800万匹が ふ化場うまれ＝全体の62%)',
    'https://npafc.org/statistics (NPAFC: 放流 年約50億匹のうち 65%が シロザケ)',
  ],
};
