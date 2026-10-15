// クマムシ（コケに すむ なかま。書き方は CONTENT.md・見本は cat.js）
//   体長 0.1〜1mm・8本あし。コケの 細胞に ストローのような 口を さして 汁を すう なかまを 主人公にしている。
//   かわくと「たる」の すがたで 眠り（乾眠）、水を 得ると また 動きだす。脱皮を くりかえして 育つ。
//   動いている 時間の 寿命は 数か月（Milnesium tardigradum で 約83日・Hengherr ほか 2008）。
//   このおもちゃでは 乾眠の あいだも 年齢（カレンダーの 時間）は 進むので、何度も 乾眠を はさんだ 個体は 何年も 生きる。
//   多くの コケの クマムシは メスだけで たまごを うむ（単為生殖）ので、性別は つけていない
import { H, D, W, M, Y } from '../units.js?v=1.0.1';

export default {
  id: 'tardigrade',
  name: 'クマムシ',
  kind: 'bug',
  weight: 1,
  // クマムシのなかま（約1500種）全体の数の目安。世界の数を数えた資料はない。
  //   コケ 1gに 数十〜数百匹（フィンランドの 湿原の 調査で 平均 84〜117匹/g）いることもあるが、
  //   土や 海にも すむ。わからないので 控えめに 1000兆匹とした
  realCount: 1e15,
  refDays: 2 * Y,
  habitat: 'forest',
  birth: ['{place}で、たまごとして うまれた', '{place}の しずくの 中で、たまごとして うまれた'],

  variants: [
    {
      id: 'base', label: 'クマムシ', w: 1, habitat: 'forest',
      places: [
        { text: '日本の 町の ブロックべいの コケ', lat: 35.69, lon: 139.69 },
        { text: '北海道 札幌の コケ', lat: 43.06, lon: 141.35 },
        { text: '日本の 森の 木の 幹の コケ', lat: 35.36, lon: 138.73 },
        { text: 'スウェーデンの 岩の コケ', lat: 56.66, lon: 16.36 },
        { text: 'ドイツの 屋根の コケ', lat: 48.78, lon: 9.18 },
        { text: 'イタリアの 古い 石がきの コケ', lat: 44.65, lon: 10.93 },
      ],
      // 生き残り（カレンダーの 時間）:
      //   たまご: かび・食べられる・かわき方が 急すぎるなどで 4割ほどが かえれない（ふ化まで 1〜2週）
      //   子ども〜おとな: ダニ・肉食の オニクマムシ・かびで 大半が いなくなる。動いている 寿命は 数か月なので、1年で 1.5%ほど
      //   乾眠を 何度も はさんだ 個体だけが 何年も 生きる（かわいた たまごで 9年・かわいて こおった おとなで 8年 の 記録があり、
      //   南極の −20℃で こおらせた コケでは 30.5年 の 記録がある・国立極地研究所 2016）。ここでは 10年で 終わりにしている
      survival: [[0, 1], [W, 0.8], [10 * D, 0.62], [3 * W, 0.42], [M, 0.3], [2 * M, 0.15], [4 * M, 0.07], [7 * M, 0.035], [Y, 0.015], [1.5 * Y, 0.006], [2 * Y, 0.0025], [3 * Y, 0.0008], [5 * Y, 0.0002], [8 * Y, 0.00003], [10 * Y, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.2 },
    { id: 'young', name: '子どもの クマムシ', from: 10 * D, sprite: 'tardigrade', scale: 0.45, say: 'たまごから、8本あしの 赤ちゃんが かえった', icon: 'egg', big: 2 },
    { id: 'adult', name: 'クマムシ', from: 5 * W, sprite: 'tardigrade', scale: 0.85, say: '脱皮を かさねて、おとなの クマムシに なった', icon: 'star', big: 1 },
    { id: 'old', name: 'ベテランの クマムシ', from: Y, sprite: 'tardigrade', scale: 1 },
  ],

  stats: [
    { id: 'tun', label: '乾眠', unit: '回' },
    { id: 'molts', label: '脱皮', unit: '回' },
    { id: 'eggs', label: 'うんだ たまご', unit: 'こ' },
  ],

  events: [
    // たまご
    { at: [H, 3 * D], p: 0.7, text: ['お母さんの ぬけがらの 中に、きょうだいと ならんでいた', 'コケの 葉の すきまに、ぽつんと ひとつ いた'], icon: 'egg' },
    { at: [D, 9 * D], p: 0.4, text: 'コケの しずくの 中で、たまごのまま ゆれていた', icon: 'drop' },
    { at: [4 * D, 9.5 * D], p: 0.3, text: 'たまごの からごしに、小さな つめの 形が 見えてきた', icon: 'look' },

    // 子ども〜おとな
    { at: [10 * D, 3 * W], p: 0.8, text: 'コケの 細胞に ストローのような 口を さして、汁を すった', icon: 'apple', mood: 'good', big: 1 },
    { at: [2 * W, 6 * M], repeat: [2, 3], text: ['脱皮して、ひとまわり 大きくなった', '古い 皮と いっしょに、つめも 新しく なった', '皮を ぬぐ あいだ、じっと 動かずに いた'], icon: 'star', add: { molts: 1 } },
    { at: [10 * D, 2 * Y], p: 0.45, text: '8本の あしの つめで、コケの 葉に しがみついた', icon: 'look' },
    { at: [2 * W, 2 * Y], p: 0.4, text: 'クマのように、のっそり のっそり 歩いた', icon: 'sprout', mood: 'good' },
    { at: [2 * W, 2 * Y], p: 0.3, text: '大きな ダニの かげが、すぐ 上を 横ぎった', icon: 'alert', mood: 'hard' },
    { at: [2 * W, 2 * Y], p: 0.3, text: '肉食の オニクマムシに、あやうく 食べられかけた', icon: 'alert', mood: 'hard' },
    { at: [2 * W, 2 * Y], p: 0.3, text: 'となりで ワムシが、口の まわりの 毛を くるくる 回していた', icon: 'friends' },
    { at: [3 * W, 3 * Y], p: 0.25, text: 'のびてきた かびの 糸から、あわてて はなれた', icon: 'alert', mood: 'hard' },
    { at: [10 * D, 3 * Y], p: 0.3, text: 'すきとおった おなかに、食べた コケの 緑が すけて 見えた', icon: 'look' },
    { at: [M, 3 * Y], p: 0.2, text: 'センチュウに 道を ふさがれて、ぐるりと まわり道した', icon: 'look' },
    { at: [2 * W, 3 * Y], p: 0.2, text: '日なたの コケが あつくなって、のそのそ 日かげへ うつった', icon: 'sun' },
    { at: [M, 3 * Y], p: 0.15, text: 'コケの 森で、べつの 種類の クマムシと すれちがった', icon: 'friends' },
    { at: [5 * W, 4 * M], p: 0.7, text: '脱皮の ときに、ぬいだ 皮の 中へ {n}この たまごを うんだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [3, 12] }, set: 'mother' },
    { at: [2 * M, 5 * Y], need: 'mother', repeat: [1, 3], text: ['また {n}この たまごを うんだ', 'ぬけがらの 中に、{n}この たまごを のこした'], icon: 'egg', mood: 'good', big: 1, add: { eggs: [2, 10] } },
    { at: [M, 5 * Y], p: 0.15, text: '学校の けんび鏡で のぞかれて、「かわいい」と 声が あがった', icon: 'look', mood: 'good', big: 1 },
    { at: [M, 5 * Y], p: 0.12, text: '鳥の 足に ついた コケごと、遠くへ はこばれた', icon: 'plane', big: 1 },

    // 乾眠（かわくたびに 眠り、ぬれると 目ざめる）
    { at: [3 * W, 3 * M], p: 0.85, text: 'コケが かわいて、からだを ちぢめ「たる」の すがたで 眠った', icon: 'sleep', big: 2, set: 'tun', add: { tun: 1 }, look: { id: 'tun', for: [3 * D, 20 * D] } },
    { at: [3 * W, 3 * M], need: 'tun', p: 0.9, text: '雨つぶが しみこんで、しばらくすると また 歩きだした', icon: 'drop', mood: 'good', big: 1 },
    { at: [2 * M, 10 * Y], need: 'tun', p: 0.25, text: 'ゆっくり かわく あいだに、からだの 中で 乾眠の じゅんびを した', icon: 'sleep' },
    { at: [2 * M, 10 * Y], need: 'tun', p: 0.25, text: '眠っている あいだ、からだの はたらきは ほとんど 止まっていた', icon: 'sleep' },
    { at: [2 * M, 10 * Y], need: 'tun', repeat: [1, 4], text: ['晴れの 日が つづき、また たるの すがたで 眠った', 'かわいた 風で、ふたたび 乾眠に 入った', '夏の 日ざしで コケが からからに なり、眠った'], icon: 'sleep', add: { tun: 1 }, look: { id: 'tun', for: [3 * D, 20 * D] } },
    { at: [2 * M, 10 * Y], need: 'tun', repeat: [1, 3], text: ['夕立で 目を さまして、コケの 中を 歩きまわった', '朝つゆを すって、また 動きだした', '雪どけの 水で、目が さめた'], icon: 'drop', mood: 'good' },
    { at: [M, 10 * Y], need: 'tun', p: 0.2, text: 'たるの すがたのまま、風に のって となりの 木へ', icon: 'plane' },
    { at: [2 * M, 10 * Y], p: 0.35, text: '冬の 夜、コケごと こおったが、とけて また 動いた', icon: 'snow', mood: 'good' },
    { at: [5 * M, 10 * Y], need: 'tun', p: 0.35, text: '雨の ない 季節、何か月も 乾眠したまま すごした', icon: 'sleep', big: 1, add: { tun: 1 }, look: { id: 'tun', for: [M, 4 * M] } },
    { at: [Y, 10 * Y], need: 'tun', p: 0.4, text: 'カレンダーでは 1年 たったが、からだは まだ わかかった', icon: 'look', mood: 'good' },
    { at: [2 * Y, 10 * Y], need: 'tun', p: 0.5, text: '1年いじょう 眠りつづけて、ある 雨の 日に 目を さました', icon: 'drop', mood: 'good', big: 2, add: { tun: 1 } },
    { at: [3 * Y, 10 * Y], need: 'tun', p: 0.6, text: 'となりの コケの なかまは、何代も 入れかわっていた', icon: 'feather' },
  ],

  deaths: [
    { at: [0, 10 * D], w: 3, text: ['かびに おおわれて、たまごのまま 眠った', 'コケが 急に かわいて、たまごのまま 眠った'] },
    { at: [0, 10 * D], w: 1, text: '小さな ダニに 食べられて、たまごのまま 終わった' },
    { at: [10 * D, 10 * Y], w: 3, text: ['肉食の オニクマムシに 食べられて、いのちを 終えた', 'ダニに 食べられて、いのちを 終えた'] },
    { at: [10 * D, 10 * Y], w: 2, text: 'あまりに 急に かわいて、たるに なれずに 眠った' },
    { at: [10 * D, 10 * Y], w: 1, text: 'かびの 糸に つつまれて、いのちを 終えた' },
    { at: [10 * D, 10 * Y], w: 1, text: '大雨で コケごと ながされて、いのちを 終えた' },
    { at: [M, 10 * Y], w: 3, need: 'tun', text: 'たるの すがたで 眠ったまま、もう 目を さまさなかった' },
    { at: [4 * M, 10 * Y], w: 4, text: 'コケの しずくの 中で、しずかに いのちを 終えた' },
  ],

  titles: [
    { stat: { tun: 5 }, text: '{tun}回の 乾眠を くぐりぬけた クマムシ' },
    { minAge: 2 * Y, text: '眠っては 目ざめて、何年も 生きた クマムシ' },
    { stat: { eggs: 20 }, text: '{eggs}この たまごを のこした コケの 母' },
    { need: 'tun', minAge: 2 * M, maxAge: 2 * Y, text: 'かわいては 眠り、雨で 目ざめた コケの 住人' },
    { minAge: 10 * D, maxAge: 2 * M, text: 'コケの 森を のっそり 歩いた 子どもの クマムシ' },
    { maxAge: 10 * D, text: 'コケの しずくで ねむった たまご' },
  ],

  facts: [
    'クマムシは かわくと「たる」の すがたに なって 眠り（乾眠）、水を 得ると また 動きだします',
    '乾眠した クマムシを 宇宙空間に 10日 さらした 実験では、日光の 紫外線を さえぎった ものの 7割近くが 生きかえりました（2007年）',
    '南極で 30年あまり こおっていた コケから、クマムシが 生きかえって たまごを うんだ という 報告があります',
    'クマムシは、人の 致死量の 1000倍ほどの 放射線（ガンマ線）を あびても 半分が 生きのびた という 実験があります',
    'ドイツの 実験では、乾眠している あいだ クマムシは 年を とらなかった という 結果が あります',
    'これまでに 1500種ほどの クマムシが 見つかっています',
  ],

  sources: [
    'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Research/Tiny_animals_survive_exposure_to_space (ESA: 2007年 FOTON-M3 の TARDIS 実験・宇宙の真空はほぼ問題なし・一部は強い紫外線にも耐えた)',
    'https://en.wikipedia.org/wiki/Tardigrades_in_space (TARDIS: 宇宙空間に10日・紫外線を防いだものは68%以上が30分以内に生きかえった・紫外線も浴びたものはほとんど生き残らず)',
    'https://www.nipr.ac.jp/english/news/20160217.html (国立極地研究所 2016: 1983年採集・−20℃で30.5年保存した南極のコケから2匹と卵1個が生きかえり繁殖・前の記録は乾燥した卵で9年)',
    'https://pubmed.ncbi.nlm.nih.gov/17178624/ (Horikawa ほか 2006: Milnesium tardigradum のガンマ線 LD50 は 水和で5000Gy・乾眠で4400Gy)',
    'https://zoolstud.sinica.edu.tw/Journals/60/60-74.pdf (クマムシの寿命の一覧: Milnesium tardigradum 約83日・Hengherr ほか 2008 で乾眠中は年をとらない)',
    'https://iris.unimore.it/bitstream/11380/1178608.20/10/Actual%20checklist%20of%20Tardigrada%2043rd%20edition%2005-07-24.pdf (Degma & Guidetti 2024: 1508種)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC11293882/ (フィンランドの湿原のコケ: 1gあたり平均84〜117匹)',
    'https://www.sbj.or.jp/wp-content/uploads/file/sbj/9304/9304_tokushu_2.pdf (日本生物工学会: ヨコヅナクマムシの単為生殖・乾眠の耐性)',
  ],
};
