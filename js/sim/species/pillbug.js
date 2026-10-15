// ダンゴムシ（オカダンゴムシ。書き方は CONTENT.md・見本は cat.js）
//   本当は 虫ではなく、エビ・カニと同じ 甲殻類（等脚目）のなかま。kind は 'bug' にしている。
//   5〜6月に お母さんの おなかの 袋（育房）へ うみおとされた たまごから始まる一生にしている。
//   たまごは 袋の中で 3〜4週間で かえり、3〜4日して 外へ出る（約4週）。子どもの あしは 12本で、脱皮すると 14本になる。
//   たまごから おとなまで 約1年・寿命は 2〜3年（戸田市 彩湖自然学習センター）、長いもので 4年ほど
import { H, D, W, M, Y } from '../units.js?v=1.0.2';

export default {
  id: 'pillbug',
  name: 'ダンゴムシ',
  kind: 'bug',
  weight: 1,
  // ダンゴムシ・ワラジムシのなかま（陸の等脚類・約3700種）全体の数の目安。世界の数を数えた資料はない。
  //   資料がないので推定: 草地などでは たくさん いるが（数字は未確認）、ならせば ずっと少ないので、控えめに 100兆匹とした
  realCount: 1e14,
  refDays: 3 * Y,
  habitat: 'garden',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で、お母さんの おなかの 袋の 中に うまれた', '{place}で、100こほどの きょうだいと いっしょに うまれた'],

  variants: [
    {
      id: 'base', label: 'オカダンゴムシ', w: 1, habitat: 'garden',
      places: [
        { text: '日本の 町の 庭の 植木ばちの 下', lat: 35.69, lon: 139.69 },
        { text: '日本の 公園の 落ち葉の 下', lat: 34.69, lon: 135.5 },
        { text: '日本の 学校の 花だん', lat: 35.86, lon: 139.65 },
        { text: 'イタリアの オリーブ畑', lat: 43.77, lon: 11.25 },
        { text: 'アメリカの カリフォルニアの 草原', lat: 37.87, lon: -122.27 },
        { text: 'イギリスの 庭の 石の 下', lat: 51.75, lon: -1.26 },
      ],
      // 生き残り:
      //   袋の中では お母さんに 守られて 9割ほどが 育つ。外へ 出た 子どもは かんそう・アリ・クモなどで 急に へる
      //   （新しく 出てきた 子どもの 死亡が いちばん多い・子どもの 生き残りは しめりけ しだい）
      //   1回に 100匹ほど うまれ（6〜300匹）、年に1〜2回 うむので、数が保たれるなら おとな（1年）に なれるのは 数%
      //   （イラクの 野外調査の 平均余命 6か月は 外に出た 子どもから 数えたもの と考え、たまごから 数える ここでは 短めにした）
      //   おとな（1年）になれるのは 4%ほど・2年で 1%・3年で 0.15%・4年すぎで みな終わる（寿命 2〜3年、長くて 4年ほど）
      survival: [[0, 1], [2 * W, 0.95], [4 * W, 0.88], [6 * W, 0.5], [2.5 * M, 0.28], [4 * M, 0.15], [6 * M, 0.09], [9 * M, 0.055], [Y, 0.04], [1.5 * Y, 0.022], [2 * Y, 0.011], [2.5 * Y, 0.0045], [3 * Y, 0.0015], [3.5 * Y, 0.0004], [4 * Y, 0.00008], [4.5 * Y, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.2 },
    { id: 'manca', name: '子ども', from: 4 * W, sprite: 'pillbug', scale: 0.3, say: 'お母さんの 袋から、外の 世界へ 出た', icon: 'egg', big: 2 },
    { id: 'young', name: 'わかい ダンゴムシ', from: 4 * M, sprite: 'pillbug', scale: 0.55 },
    { id: 'adult', name: 'おとなの ダンゴムシ', from: Y, sprite: 'pillbug', scale: 0.9, say: 'りっぱな おとなの ダンゴムシに なった', icon: 'star', big: 1 },
    { id: 'old', name: 'ベテランの ダンゴムシ', from: 2.5 * Y, sprite: 'pillbug', scale: 1 },
  ],

  stats: [
    { id: 'molts', label: '脱皮', unit: '回' },
    { id: 'young', label: '育てた 子ども', unit: '匹' },
  ],

  events: [
    // お母さんの 袋の中
    { at: [D, 3 * W], p: 0.6, text: 'お母さんの 袋の 中で、水に つつまれて 育った', icon: 'drop' },
    { at: [D, 3 * W], p: 0.4, text: 'お母さんが 丸くなって、袋ごと まもってくれた', icon: 'heart', mood: 'good' },
    { at: [3 * W, 26 * D], p: 0.85, text: '袋の 中で、たまごから かえった', icon: 'egg', big: 1 },

    // 子ども（はじめの 夏〜秋）
    { at: [4 * W, 5 * W], p: 0.7, text: 'からだは すきとおっていて、あしは まだ 12本だった', icon: 'look', big: 1 },
    { at: [5 * W, 7 * W], p: 0.8, text: 'はじめての 脱皮で、あしが 14本に なった', icon: 'star', big: 1, add: { molts: 1 } },
    { at: [6 * W, 4 * M], p: 0.4, text: '植木ばちの 下に、きょうだいと 集まって くらした', icon: 'house', mood: 'good' },
    { at: [2 * M, 4 * M], p: 0.85, text: 'うしろ半分を 先に ぬいで、数日後に 前半分を ぬいだ', icon: 'star', big: 1, add: { molts: 1 } },
    { at: [2 * M, 3.5 * Y], repeat: [2, 5], text: ['脱皮を {n}回 して、ひとまわり 大きくなった', 'ぬいだ 白い からを、のこさず 食べた'], icon: 'star', add: { molts: [1, 3] } },
    { at: [M, 3.5 * Y], repeat: [1, 3], text: ['しめった 落ち葉を むしゃむしゃ 食べた', '植木ばちの 下で、くさりかけの 葉を 食べた', 'ブロックべいを かじって、カルシウムを とった'], icon: 'apple', mood: 'good' },
    { at: [M, 3.5 * Y], p: 0.6, text: 'つつかれて、くるっと まんまるに なった', icon: 'ball', big: 1, set: 'ball' },
    { at: [M, 3.5 * Y], p: 0.4, text: '右に 曲がったら、次は 左に 曲がった', icon: 'look' },
    { at: [M, 3.5 * Y], p: 0.35, text: '子どもの 手のひらで 丸くなって、そっと 地面に もどされた', icon: 'friends', mood: 'good' },
    { at: [M, 3.5 * Y], p: 0.3, text: 'アリの 行列に 見つかって、丸くなって やりすごした', icon: 'alert', mood: 'hard' },
    { at: [M, 3.5 * Y], p: 0.25, text: 'ヒキガエルの 舌が、すぐ そばを かすめた', icon: 'alert', mood: 'hard' },
    { at: [M, 3.5 * Y], p: 0.25, text: '日照りで 土が かわいて、石の 下に もぐりこんだ', icon: 'sun', mood: 'hard' },
    { at: [M, 3.5 * Y], p: 0.3, text: '雨上がりの 夜、なかまと そろって 散歩に 出た', icon: 'rain', mood: 'good' },
    { at: [M, 3.5 * Y], p: 0.2, text: '丸くなれない いとこの ワラジムシと、同じ 石の 下に いた', icon: 'friends' },
    { at: [M, 3.5 * Y], p: 0.2, text: 'ころがって、坂を ころころ 落ちていった', icon: 'ball' },
    { at: [M, 2.5 * M], p: 0.2, text: '夏休みの 自由研究で、しばらく 虫かごで くらした', icon: 'house', mood: 'good', big: 1 },

    // 冬（うまれて 5〜9か月・17〜21か月・29〜33か月）
    { at: [5 * M, 9 * M], p: 0.85, text: ['寒くなって、土の 中で なかまと 丸くなった', '石の 下で、なかまと よりそって 冬を こした'], icon: 'snow', set: 'winter1' },
    { at: [9 * M, 11 * M], need: 'winter1', p: 0.7, text: '春の 日ざしで、土の 中から はいだした', icon: 'sun', mood: 'good' },
    { at: [17 * M, 21 * M], p: 0.7, text: '2回めの 冬も、石の 下で のりきった', icon: 'snow' },
    { at: [29 * M, 33 * M], p: 0.7, text: '3回めの 冬。まわりの なかまが すこし へった', icon: 'snow', mood: 'hard' },

    // おとな
    { at: [10 * M, 14 * M], need: 'f', p: 0.6, text: 'せなかに 黄色い 点々もようの ある メスに なった', icon: 'star' },
    { at: [10 * M, 14 * M], need: 'm', p: 0.6, text: 'つやつやの 黒い せなかの オスに なった', icon: 'star' },
    { at: [11 * M, 14 * M], need: 'm', p: 0.6, text: 'メスを 見つけて、そっと うしろから 近づいた', icon: 'heart', mood: 'good', big: 2 },
    { at: [11 * M, 13.5 * M], need: 'f', p: 0.75, text: 'おなかの 袋に、{n}この たまごを かかえた', icon: 'egg', mood: 'good', big: 3, add: { young: [50, 150] }, set: 'mother' },
    { at: [12 * M, 15 * M], need: 'mother', p: 0.9, text: '袋から、ちいさな 子どもたちが いっせいに 出てきた', icon: 'baby', mood: 'good', big: 3 },
    { at: [23 * M, 26 * M], need: 'mother', p: 0.6, text: '次の 春も、{n}この たまごを おなかで 育てた', icon: 'egg', mood: 'good', big: 2, add: { young: [50, 150] } },
    { at: [35 * M, 38 * M], need: 'mother', p: 0.4, text: '3回めの 春も、{n}匹の 子どもを 送りだした', icon: 'baby', mood: 'good', big: 2, add: { young: [30, 100] } },
    { at: [2 * Y, 4.5 * Y], p: 0.4, text: '動きが ゆっくりに なって、日かげで すごす 日が ふえた', icon: 'sleep' },
  ],

  deaths: [
    { at: [0, 4 * W], w: 2, text: ['お母さんの 袋の 中で、育ちきらずに 眠った', 'お母さんが 鳥に つかまって、袋の 中で いのちを 終えた'] },
    { at: [4 * W, Y], w: 3, text: ['アリに 見つかって、ちいさな いのちを 終えた', 'クモに つかまって、ちいさな いのちを 終えた'] },
    { at: [4 * W, 6 * M], w: 2, text: '土が かわいて、ちいさな からだが もたなかった' },
    { at: [4 * W, 4.5 * Y], w: 1, text: 'ヒキガエルに 食べられて、いのちを 終えた' },
    { at: [4 * W, 4.5 * Y], w: 1, text: '脱皮した ばかりの やわらかい ときに ねらわれ、いのちを 終えた' },
    { at: [5 * M, 4.5 * Y], w: 1, text: '冬の 寒さに たえきれず、土の 中で 眠った' },
    { at: [Y, 4.5 * Y], w: 2, text: ['鳥に 見つかって、いのちを 終えた', 'モグラに 見つかって、いのちを 終えた'] },
    { at: [2 * Y, 4.5 * Y], w: 5, text: '落ち葉の 下で、まるくなったまま しずかに 眠った' },
    { at: [Y, 4.5 * Y], w: 3, need: 'mother', text: '子どもたちを 送りだして、石の 下で 眠った' },
  ],

  titles: [
    { stat: { young: 100 }, text: '{young}匹の 子どもを 育てた お母さんダンゴムシ' },
    { stat: { molts: 10 }, text: '{molts}回 脱皮した 庭の ベテラン' },
    { need: 'ball', minAge: 2 * Y, text: '丸くなって 何度も ピンチを こえた ダンゴムシ' },
    { minAge: Y, maxAge: 2.5 * Y, text: '石の 下で 四季を めぐった 庭の おとな' },
    { minAge: 5.5 * M, maxAge: Y, text: '落ち葉の 下で 冬を 知った わかい ダンゴムシ' },
    { minAge: 4 * W, maxAge: 5.5 * M, text: '庭の すみっこを 歩いた ちいさな ダンゴムシ' },
    { maxAge: 4 * W, text: 'お母さんの 袋の 中だけを 知った いのち' },
    { long: 0.01, text: '庭いちばんの 長老ダンゴムシ' },
  ],

  facts: [
    'ダンゴムシは 虫では なく、エビや カニと 同じ 甲殻類の なかまです',
    'オカダンゴムシの メスは、おなかの 袋で たまごを 育て、かえった 子どもを 外へ 出します',
    '脱皮は、まず からだの うしろ半分、数日たって 前半分の 2回に わけて おこないます',
    'ダンゴムシは 右に 曲がると 次は 左、と 左右 交互に 曲がりやすい 性質が あります（交替性転向反応）',
    'うまれたての 子どもは あしが 12本で、脱皮すると 14本に なります',
    'オカダンゴムシは ヨーロッパの 地中海の あたりが ふるさとで、明治時代 以降に 日本へ 入ってきた と考えられています',
  ],

  sources: [
    'https://www.city.toda.saitama.jp/uploaded/attachment/23741.pdf (戸田市 彩湖自然学習センター: エビ・カニの仲間・卵から成虫まで1年・寿命2〜3年・後ろ半分→数日後に前半分の脱皮・ぬけがらを食べる・お腹の膜の中で卵)',
    'https://en.wikipedia.org/wiki/Armadillidium_vulgare (地中海原産・かえった子は袋に3〜4日とどまる・脱皮直後の2日は捕食されやすい・カリフォルニアの草原で最も多い無脊椎動物の一つ)',
    'https://animaldiversity.org/accounts/Armadillidium_vulgare (卵は3〜4週でかえり、子は3〜4日袋にとどまる・1回の子は6〜300匹 平均100)',
    'https://biokids.umich.edu/critters/Armadillidium_vulgare (成熟は約1年)',
    'https://bsj-ojs.uobaghdad.edu.iq/index.php/BSJ/article/view/2516 (イラクの野外個体群: 生命表で平均余命6か月・年3世代)',
    'https://www.city.kure.lg.jp/uploaded/attachment/38140.pdf (呉市 小学生の観察: 生まれたときは足12本・15日後から14本)',
    'https://www.pref.nara.jp/secure/256930/25_seisyou_poster_dangomusi.pdf (交替性転向反応)',
    'https://www.city.nagoya.jp/kenkofukushi/eisei/1015269/1034848/1015298/1034491/1015373.html (名古屋市衛生研究所: 地中海沿岸原産の外来種・明治以降に入ってきたと考えられている)',
    'https://www.moocota.com/dangomushi-lifespan/ (寿命3〜4年・明治時代以降に日本で発見・地中海原産)',
  ],
};
