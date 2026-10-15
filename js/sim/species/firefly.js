// ゲンジボタル（Luciola cruciata）: 西日本（2秒おきに光る）／東日本（4秒おきに光る）
//   6月ごろ 川ぞいの コケに たまご（500〜1000こ）→ 約20日〜1か月で かえり 川へ → 水の中で カワニナを 食べて 約10か月（6回 だっぴ）
//   → サクラの さくころの 雨の夜に 岸へ 上がり、土の中で 前蛹 約3週間・さなぎ 約1週間 → 5月中旬〜6月に 成虫。
//   成虫は 水だけ 飲んで 1〜2週間（野外で 1週間ほど）
import { H, D, W, M, Y } from '../units.js?v=1.0.1';

export default {
  id: 'firefly',
  name: 'ゲンジボタル',
  kind: 'bug',
  weight: 1,
  // ホタル全体（約2000〜2400種）の数の資料は見つからなかった（Xerces Society も「数のデータは ほとんどない」）。1兆匹を目安にした（推計・根拠はうすい）
  realCount: 1e12,
  refDays: 355 * D,
  habitat: 'river',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}の コケの 上で、小さな たまごとして うまれた', '{place}の 岸の コケで うまれた'],

  variants: [
    {
      id: 'west', label: '西日本の ゲンジボタル', w: 0.5, habitat: 'river', fields: { flash: '2秒' },
      places: [
        { text: '山口の 一の坂川', lat: 34.19, lon: 131.47 },
        { text: '滋賀の 守山の 小川', lat: 35.06, lon: 135.99 },
        { text: '熊本の 菊池の 川', lat: 32.98, lon: 130.82 },
        { text: '京都の 山あいの 川', lat: 35.12, lon: 135.68 },
      ],
      // メスは 500〜1000この たまごを 産む。数が保たれているなら、おとなに なれるのは 0.2〜0.4% ほどの計算。
      //   たまご・幼虫・上陸後の それぞれの割合は推計（野外の生命表は見つからなかった）。
      //   上陸する 終齢の幼虫を 放しても、成虫に なるのは 1割ほど という話も ある（検索結果の要約）
      survival: [[0, 1], [25 * D, 0.6], [40 * D, 0.3], [3 * M, 0.12], [6 * M, 0.05], [9 * M, 0.025], [300 * D, 0.017], [322 * D, 0.009], [338 * D, 0.0055], [343 * D, 0.0045], [348 * D, 0.003], [352 * D, 0.0018], [356 * D, 0.0008], [360 * D, 0.0003], [366 * D, 0]],
    },
    {
      id: 'east', label: '東日本の ゲンジボタル', w: 0.5, habitat: 'river', fields: { flash: '4秒' },
      places: [
        { text: '栃木の 里山の 小川', lat: 36.5, lon: 139.9 },
        { text: '福島の 山あいの 川', lat: 37.4, lon: 140.1 },
        { text: '神奈川の 谷戸の 小川', lat: 35.32, lon: 139.55 },
        { text: '岩手の 田んぼの 水路', lat: 39.7, lon: 141.15 },
      ],
      survival: [[0, 1], [25 * D, 0.6], [40 * D, 0.3], [3 * M, 0.12], [6 * M, 0.05], [9 * M, 0.025], [300 * D, 0.017], [322 * D, 0.009], [338 * D, 0.0055], [343 * D, 0.0045], [348 * D, 0.003], [352 * D, 0.0018], [356 * D, 0.0008], [360 * D, 0.0003], [366 * D, 0]],
    },
  ],

  stages: [
    { id: 'egg', name: 'たまご', from: 0, sprite: 'egg', scale: 0.25 },
    { id: 'larva', name: '幼虫', from: 25 * D, sprite: 'grub', scale: 0.3, say: 'たまごから かえり、川の 水へ ぽとりと 落ちた', icon: 'egg', big: 2 },
    { id: 'larva2', name: '大きな 幼虫', from: 6 * M, sprite: 'grub', scale: 0.55, say: 'だっぴを くりかえし、大きな 幼虫に なった', icon: 'sprout' },
    { id: 'landing', name: '上陸した 幼虫', from: 300 * D, sprite: 'grub', scale: 0.6, habitat: 'underground', say: '雨の 夜、ぼんやり 光りながら 岸に 上がった', icon: 'drop', big: 3 },
    { id: 'pupa', name: 'さなぎ', from: 322 * D, sprite: 'pupa', scale: 0.5, say: '土の 中の まるい へやで、さなぎに なった', icon: 'sleep', big: 1 },
    { id: 'adult', name: 'ゲンジボタル', from: 338 * D, sprite: 'firefly', scale: 1, habitat: 'river', say: 'さなぎから、ホタルの 成虫に なった', icon: 'star', big: 3 },
  ],

  stats: [
    { id: 'nights', label: '光った 夜', unit: '回' },
    { id: 'eggs', label: '産んだ たまご', unit: 'こ' },
    { id: 'molts', label: 'だっぴ', unit: '回' },
  ],

  events: [
    // たまご（ホタルは たまごも かすかに 光る）
    { at: [D, 20 * D], p: 0.5, text: 'コケの 上で、たまごが ほんのり 光った', icon: 'look', big: 1 },
    { at: [2 * D, 22 * D], text: 'しめった コケの 中で、かえる 日を 待った', icon: 'sleep' },
    { at: [D, 24 * D], p: 0.3, text: 'まわりの コケにも、きょうだいの たまごが いっぱい', icon: 'friends' },
    { at: [5 * D, 24 * D], p: 0.4, text: '川の しぶきで、コケが しめって たすかった', icon: 'drop', mood: 'good' },

    // 川の中の 幼虫
    { at: [26 * D, 40 * D], text: '自分より 小さな カワニナを 見つけて 食べた', icon: 'apple', mood: 'good', big: 1 },
    { at: [26 * D, 2 * M], p: 0.5, text: 'まだ 小さくて、川の 流れに 何度も ころがった', icon: 'drop', mood: 'hard' },
    { at: [32 * D, 45 * D], text: 'はじめての だっぴで、ひと回り 大きく なった', icon: 'sprout', add: { molts: 1 } },
    { at: [35 * D, 3 * M], p: 0.6, text: '流れの ゆるい 石の かげを、すみかに した', icon: 'house' },
    { at: [40 * D, 9 * M], repeat: [1, 2], text: ['石の すきまで、カワニナを さがした', 'カワニナに かみついて、しびれさせた', '川底の 石の 下で、じっと 休んだ'], icon: 'apple' },
    { at: [50 * D, 9 * M], repeat: [2, 3], text: 'だっぴして、ひと回り 大きく なった', icon: 'sprout', add: { molts: 1 } },
    { at: [2 * M, 5 * M], p: 0.4, text: '台風の 大水で、下流へ 流されかけた', icon: 'rain', mood: 'hard', big: 1 },
    { at: [M, 9 * M], p: 0.35, text: '魚に 見つかりそうに なり、石の 下へ もぐった', icon: 'alert', mood: 'hard' },
    { at: [3 * M, 9 * M], p: 0.3, text: 'カワニナの からの 中に、もぐりこんで 食べた', icon: 'apple', mood: 'good' },
    { at: [5 * M, 8 * M], text: '冷たい 冬の 川で、ゆっくり 育った', icon: 'snow' },
    { at: [7 * M, 9.5 * M], p: 0.4, text: 'おしりの 光る ところが、はっきり してきた', icon: 'look' },
    { at: [8 * M, 9.6 * M], p: 0.3, text: '春の 雨で 川が ふえ、石に しがみついた', icon: 'rain', mood: 'hard' },
    { at: [9.6 * M, 298 * D], p: 0.5, text: 'あたたかい 雨の 夜を、川の 中で 待った', icon: 'rain' },

    // 上陸・さなぎ
    { at: [301 * D, 312 * D], text: 'やわらかい 土に もぐり、まるい へやを つくった', icon: 'box' },
    { at: [303 * D, 320 * D], p: 0.4, text: 'ミミズや ゴミムシが、すぐ そばを 通った', icon: 'alert', mood: 'hard' },
    { at: [323 * D, 337 * D], p: 0.6, text: 'さなぎの まま、土の 中で ときどき 光った', icon: 'look' },

    // 成虫
    { at: [339 * D, 341 * D], text: '体が かたまるまで、土の へやで 待った', icon: 'sleep' },
    { at: [341 * D, 345 * D], text: '土から はい出し、はじめて 夜空を 飛んだ', icon: 'plane', mood: 'good', big: 3, set: 'flew' },
    { at: [342 * D, 366 * D], need: 'flew', repeat: [1, 3], text: ['{flash}おきに 光って、合図を 送った', '仲間と 光を そろえて、川べりを 飛んだ', '昼間は 草の 葉の かげで、じっと 休んだ'], icon: 'star', mood: 'good', add: { nights: 1 } },
    { at: [342 * D, 366 * D], need: 'flew', p: 0.6, text: '口に するのは、葉の 上の 水だけだった', icon: 'drop' },
    { at: [342 * D, 352 * D], need: ['m', 'flew'], text: '飛びながら、光の 返事を くれる メスを さがした', icon: 'look', set: 'search' },
    { at: [342 * D, 366 * D], need: ['m', 'flew'], p: 0.25, text: '仲間の オスたちと、いっせいに 光った', icon: 'star', mood: 'good' },
    { at: [342 * D, 366 * D], need: 'search', p: 0.6, text: '光の 返事を くれた メスと、結婚した', icon: 'heart', mood: 'good', big: 2, set: 'm-mated' },
    { at: [342 * D, 360 * D], need: ['f', 'flew'], p: 0.75, text: '草の 上で 光って、オスに 返事を した', icon: 'heart', mood: 'good', big: 2, set: 'mated' },
    { at: [344 * D, 366 * D], need: 'mated', text: '川ぞいの コケに、{n}この たまごを 産んだ', icon: 'egg', mood: 'good', big: 3, add: { eggs: [300, 900] }, set: 'mother' },
    { at: [342 * D, 366 * D], need: 'flew', p: 0.25, text: 'ホタル 見物の 人たちに、そっと 見守られた', icon: 'heart', mood: 'good', big: 1 },
    { at: [342 * D, 366 * D], need: 'flew', p: 0.3, text: '車の ライトが まぶしくて、光るのを やめた', icon: 'alert', mood: 'hard' },
    { at: [342 * D, 366 * D], need: 'flew', p: 0.25, text: '子どもの 手のひらに とまって、光ってみせた', icon: 'star', mood: 'good', big: 1 },
    { at: [342 * D, 366 * D], need: 'flew', p: 0.25, text: 'クモの 巣に かかりかけ、なんとか ぬけだした', icon: 'alert', mood: 'hard' },
    { at: [342 * D, 366 * D], need: 'flew', p: 0.2, text: '雨の 夜は、葉の うらで 光らずに すごした', icon: 'rain' },
  ],

  deaths: [
    { at: [0, 26 * D], w: 3, text: ['コケが かわいて、たまごの まま 終わった', 'たまごの まま、かびに つつまれて 眠った'] },
    { at: [25 * D, 3 * M], w: 3, text: ['大水に 流されて、いのちを 終えた', '食べられる 大きさの カワニナが 見つからず、力つきた', '魚に 見つかって、いのちを 終えた'] },
    { at: [2 * M, 300 * D], w: 3, text: ['冬の 大水で、川底ごと 流された', 'ヤゴに 見つかって、いのちを 終えた', 'ザリガニに 見つかって、いのちを 終えた', '冷たい 川で、しずかに 眠った'] },
    { at: [299 * D, 345 * D], need: '!flew', w: 3, text: ['土の 中で、羽化できずに 眠った', 'モグラに 見つかって、いのちを 終えた', '土が かわいて、さなぎの まま 眠った'] },
    { need: 'flew', w: 2, text: ['クモの 巣に かかって、いのちを 終えた', 'カエルに 見つかって、いのちを 終えた'] },
    { need: 'flew', w: 4, text: '光を 小さく して、草の 上で 眠った' },
    { need: 'mother', w: 5, text: 'たまごを のこし、しずかに 光を 消した' },
  ],

  titles: [
    { need: 'mother', text: '{eggs}この たまごを 川に たくした お母さん' },
    { need: 'm-mated', text: '光の 合図で 恋を みつけた ホタル' },
    { need: ['m', 'flew'], stat: { nights: 3 }, text: '夜の 川を かざった 光の 名手' },
    { need: 'flew', text: '何百に ひとつの 光に なった ホタル' },
    { need: '!flew', minAge: 300 * D, text: 'もう すこしで 夜空だった ホタル' },
    { minAge: 25 * D, maxAge: 300 * D, text: 'カワニナを 追いかけた 川の 子' },
    { short: 0.9, text: 'コケの 上の 小さな いのち' },
  ],

  facts: [
    'ゲンジボタルの 幼虫は 川で カワニナを 食べて、約10か月 そだちます',
    '光る 間隔は、東日本では 約4秒、西日本では 約2秒。長崎の 五島列島では 約1秒 という 報告も あります',
    '成虫は ほとんど 何も 食べず、水を 飲む くらい と 言われています。成虫で いられるのは 1〜2週間ほどです',
    'メスは 川ぞいの コケに 500〜1000この たまごを 産みます。ホタルは たまごも さなぎも 光ります',
    '幼虫は サクラが さくころの 雨の 夜に、光りながら 岸に 上がります',
    'えさが 足りず 上陸が 間に合わない 幼虫は、もう1年 水の中で すごすことも あります',
  ],

  sources: [
    'https://weathernews.jp/news/202605/080081/ (産卵数500〜1000・ふ化 約20日・脱皮 約6回・水中 約10か月・サクラのころの雨の夜に上陸・前蛹 約3週間・さなぎ 約1週間・成虫は野外で1週間ほど)',
    'https://weathernews.jp/news/202606/010221/ (明滅の間隔 東日本4秒・西日本と四国2秒・五島列島1秒／卵・幼虫・さなぎも光る)',
    'https://www2.city.fuji.shizuoka.jp/kankyomap/image/pdf/hotaru_rui/genjibotaru.pdf (富士市: 約3秒に1回・最大1000個の卵・約1か月でふ化・幼虫はカワニナだけを食べる・4月ごろ上陸)',
    'https://www.honda.co.jp/outdoor/adventure/genjibotaru.html (約1か月でふ化・川の中で冬をこす・カワニナを捕食・春に上陸して蛹)',
    'https://www.kensetsu.metro.tokyo.lg.jp/content/000044179.pdf (東京都建設局: 成虫の寿命は1、2週間・幼虫は川でカワニナなどを食べる・上陸が間に合わないと翌春まで水中で待ち、3年幼虫のものも)',
    'https://www.sunrefre.jp/staff/index.php/archives/3548 (成虫は水だけ飲んで約1週間・会社のブログなので弱い資料)',
    'https://www.env.go.jp/kids/water/hotaranger/effort/pdf/h30_4_d.pdf (高岡市立中田中学校: 成虫は2週間ほどで交尾・産卵して死ぬ)',
    'https://www.xerces.org/publications/scientific-reports/state-of-fireflies-of-united-states-and-canada (ホタルの数のデータは ほとんどない)',
  ],
};
