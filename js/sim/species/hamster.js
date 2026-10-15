// ハムスター（ペットの ゴールデンハムスター）
//   ペットのゴールデンハムスターの多くは、1930年にシリアのアレッポ近くで見つかった母子の子孫
import { H, D, W, M, Y } from '../units.js?v=1.0.3';

export default {
  id: 'hamster',
  name: 'ハムスター',
  kind: 'animal',
  weight: 1,
  realCount: 1e7, // 世界のペットのハムスターの統計はない。アメリカの家庭だけで約110万匹（AVMA 2017）からの、おおまかな目安
  refDays: 3 * Y,
  habitat: 'home',
  sexes: { m: 0.5, f: 0.5 },
  birth: ['{place}で うまれた', '{place}で、たくさんの きょうだいと うまれた'],

  variants: [
    {
      id: 'pet', label: 'ハムスター', w: 1, habitat: 'home', tags: ['pet'],
      names: ['きなこ', 'もち', 'ごま', 'くるみ', 'まめ', 'ぷりん', 'こむぎ', 'だいず', 'ひまわり', 'クッキー', 'ポテト', 'おこげ', 'あんこ', 'ちくわ'],
      places: [
        { text: '日本の ブリーダーの家', lat: 35.68, lon: 139.77 },
        { text: 'イギリスの ブリーダーの家', lat: 52.48, lon: -1.9 },
        { text: 'アメリカの 家', lat: 41.88, lon: -87.63 },
        { text: 'ドイツの 家', lat: 52.52, lon: 13.4 },
        { text: '台湾の ペットショップの うら', lat: 25.03, lon: 121.56 },
        { text: 'オランダの 家', lat: 52.37, lon: 4.9 },
      ],
      // イギリスの動物病院の記録（1万6千匹）: 亡くなった年齢の中央値 1.75歳・最長 3.65歳
      // 研究用のゴールデンハムスター: 中央値 19.5か月・最長 36か月
      // うまれてすぐ（授乳中）の死も入れる
      survival: [[0, 1], [W, 0.88], [3 * W, 0.84], [2 * M, 0.81], [6 * M, 0.77], [Y, 0.69], [18 * M, 0.55], [2 * Y, 0.36], [30 * M, 0.16], [3 * Y, 0.05], [42 * M, 0.008], [4 * Y, 0]],
    },
  ],

  stages: [
    { id: 'baby', name: '赤ちゃん', from: 0, sprite: 'hamster', scale: 0.4 },
    { id: 'young', name: '子ハムスター', from: 3 * W, sprite: 'hamster', scale: 0.7 },
    { id: 'adult', name: 'おとなのハムスター', from: 3 * M, sprite: 'hamster', scale: 1, say: 'りっぱな おとなの ハムスターに なった', icon: 'star' },
    { id: 'senior', name: 'シニアのハムスター', from: 20 * M, sprite: 'hamster', scale: 0.95, say: '毛の つやが、すこし うすく なってきた', icon: 'sleep' },
  ],

  stats: [
    { id: 'run', label: '回し車で 走った きょり', unit: 'km' },
    { id: 'seeds', label: 'ほおぶくろに つめた たね', unit: 'つぶ' },
    { id: 'pups', label: '赤ちゃん', unit: '匹' },
  ],

  events: [
    // 赤ちゃん
    { at: [5 * D, 8 * D], text: 'はだかんぼうの からだに、うすく 毛が 生えてきた', icon: 'sprout' },
    { at: [12 * D, 15 * D], text: 'はじめて 目が ひらいた', icon: 'look', big: 1 },
    { at: [10 * D, 18 * D], p: 0.5, text: '巣から よちよち 出て、母さんに くわえて もどされた', icon: 'box' },
    { at: [16 * D, 21 * D], text: '母さんの まねをして、はじめて かたい ごはんを かじった', icon: 'apple', big: 1 },
    { at: [3 * W, 5 * W], p: 0.8, text: 'きょうだいと 巣箱の中で、おだんごに なって ねた', icon: 'sleep', mood: 'good' },
    { at: [3 * W, 5 * W], p: 0.4, text: 'ちいさな 回し車に のって、ころんと ころがった', icon: 'ball', mood: 'good' },
    { at: [4 * W, 6 * W], p: 0.9, text: 'きょうだいと はなれて、ひとりぐらしを はじめた', icon: 'box' },

    // 新しい家で
    { at: [5 * W, 9 * W], p: 0.93, text: '新しい 家族の もとへ やってきた', icon: 'house', mood: 'good', big: 2, set: 'adopted' },
    { at: [5 * W, 9 * W], p: 0.9, need: 'adopted', text: '名前は「{name}」に なった', icon: 'heart', mood: 'good', big: 1 },
    { at: [6 * W, 3 * Y], repeat: [2, 4], need: 'adopted', text: ['ひまわりの たねを、ほおぶくろに {n}つぶ つめこんだ', 'ほおぶくろを ぱんぱんにして、巣箱へ 運んだ', '巣箱の すみに、ごはんを こっそり ためこんだ', 'ほおぶくろの たねを、巣箱の おくに しまいこんだ'], icon: 'apple', mood: 'good', add: { seeds: [8, 25] } },
    { at: [2 * M, 4 * Y], repeat: [3, 5], need: 'adopted', text: ['夜じゅう、回し車を 回しつづけた', '回し車の 音が、朝まで ひびいた', 'この 数か月で、回し車を {n}km 走った'], icon: 'ball', mood: 'good', add: { run: [300, 900] } },
    { at: [2 * M, 6 * M], p: 0.65, need: 'adopted', text: '家族の 手のひらに、はじめて 自分から のった', icon: 'heart', mood: 'good', big: 2 },
    { at: [2 * M, 30 * M], p: 0.45, need: 'adopted', text: '昼間は 巣箱で ぐっすり、夜に なると 起きだした', icon: 'sleep' },
    { at: [2 * M, 2 * Y], p: 0.4, need: 'adopted', text: 'ケージを ぬけだして、ソファの下で 見つかった', icon: 'alert', mood: 'hard', big: 1 },
    { at: [2 * M, 3 * Y], p: 0.3, need: 'adopted', text: 'ケージの 金あみを、夜中に ガジガジ かじった', icon: 'alert' },
    { at: [3 * M, 30 * M], p: 0.5, need: 'adopted', text: 'ゆかの チップを ほって、ひみつの トンネルを つくった', icon: 'box', mood: 'good' },
    { at: [3 * M, 2 * Y], p: 0.3, need: 'adopted', text: 'のびてくる 前歯を、かじり木で けずった', icon: 'sprout' },
    { at: [3 * M, 2 * Y], p: 0.3, need: 'adopted', text: 'へやの 中を 探検させてもらい、本だなの うらに もぐった', icon: 'look', mood: 'good' },
    { at: [3 * M, 2 * Y], p: 0.25, need: 'adopted', text: 'ほおぶくろの 中身を、家族の 手のひらに ぜんぶ 出した', icon: 'gift', mood: 'good' },
    { at: [3 * M, 2 * Y], p: 0.25, need: 'adopted', text: 'ケージの すみを、自分の トイレに きめた', icon: 'box' },
    { at: [3 * M, 3 * Y], p: 0.3, need: 'adopted', text: 'おやつの にぼしを、両手で もって かじった', icon: 'fish', mood: 'good' },
    { at: [4 * M, 30 * M], p: 0.3, need: 'adopted', text: 'さわられて おどろき、家族の 指を かんでしまった', icon: 'alert', mood: 'hard' },
    { at: [4 * M, 3 * Y], p: 0.3, need: 'adopted', text: '寒い日に 動かなくなり、家族が あわてて あたためた', icon: 'snow', mood: 'hard', big: 1 },
    { at: [6 * M, 3 * Y], p: 0.3, need: 'adopted', text: 'あおむけで ねていて、家族を びっくり させた', icon: 'sleep', mood: 'good' },
    { at: [3 * M, 18 * M], p: 0.12, need: ['adopted', 'f'], text: '{n}匹の 赤ちゃんを うんだ', icon: 'baby', mood: 'good', big: 3, add: { pups: [6, 12] }, set: 'mother' },
    { at: [6 * M, 30 * M], p: 0.3, need: 'adopted', text: 'おなかを こわして、病院に 連れていってもらった', icon: 'bandage', mood: 'hard' },
    { at: [Y, 3 * Y], p: 0.35, need: 'adopted', text: '家族の 子どもが、毎日 そうじと 水かえを してくれた', icon: 'heart', mood: 'good' },
    { at: [Y, 3 * Y], p: 0.25, need: 'adopted', text: '家族と いっしょに 引っこして、新しい へやに なれた', icon: 'box' },
    { at: [Y, 13 * M], p: 0.5, need: 'adopted', text: '1さいの 誕生日に、とくべつな おやつを もらった', icon: 'cake', mood: 'good', big: 1 },

    // シニア
    { at: [18 * M, 4 * Y], p: 0.6, need: 'adopted', text: '回し車より、巣箱で ねている 時間が 長く なった', icon: 'sleep' },
    { at: [20 * M, 4 * Y], p: 0.4, need: 'adopted', text: 'やわらかい ごはんを、家族が 小さく きざんでくれた', icon: 'apple', mood: 'good', big: 1 },
    { at: [2 * Y, 25 * M], p: 0.5, need: 'adopted', text: '2さいの 誕生日を、家族に 祝ってもらった', icon: 'cake', mood: 'good', big: 2 },
    { at: [3 * Y, 4 * Y], p: 0.6, need: 'adopted', text: '3さいを こえて、家族に「長生きだね」と ほめられた', icon: 'crown', mood: 'good', big: 2 },
  ],

  deaths: [
    { at: [0, 3 * W], w: 4, text: ['うまれつき からだが 弱くて、ちいさな いのちを 終えた', '母さんの おっぱいが 足りず、しずかに 眠った'] },
    { at: [3 * W, 4 * M], w: 3, text: 'おなかの 病気（ウェットテイル）で、いのちを 終えた' },
    { at: [3 * M, 4 * Y], w: 2, text: 'おなかの 病気で、家族に 見守られて 眠った' },
    { at: [3 * M, 3 * Y], w: 0.4, text: '寒い 夜に 体が 冷えて、いのちを 終えた' },
    { at: [Y, 4 * Y], w: 3, text: 'からだに できた しこりの 病気で、いのちを 終えた' },
    { at: [Y, 4 * Y], w: 1, text: '心臓が 弱って、巣箱の中で しずかに 眠った' },
    { at: [20 * M, 5 * Y], w: 5, text: 'お気に入りの 巣箱の中で、まるくなって 眠るように いのちを 終えた' },
  ],

  titles: [
    { stat: { run: 3000 }, text: '回し車で {run}km を 走りぬいた ハムスター' },
    { stat: { pups: 1 }, text: '{pups}匹の 赤ちゃんの 母に なった {name}' },
    { stat: { seeds: 80 }, text: 'ほおぶくろに {seeds}つぶを つめこんだ ためこみ名人' },
    { need: 'adopted', long: 0.1, text: 'みんなに 愛された 長生きの {name}' },
    { short: 0.85, text: '母さんの そばで ほんの すこし 生きた 赤ちゃん' },
  ],

  facts: [
    'ペットの ゴールデンハムスターの 多くは、1930年に シリアで 見つかった 母子の 子孫だと 言われています',
    'ゴールデンハムスターが おなかに 赤ちゃんを やどす 期間は 約16日で、ほにゅう類の 中でも とても 短いです',
    'イギリスの 調査では、ペットの ハムスターが 亡くなった 年れいの 中央値は 約1歳9か月でした',
    'ハムスターは 一晩で、回し車を 数km〜10km ほども 走ることが あります',
    '野生の ゴールデンハムスターは シリアや トルコの 畑の 地下に すんでいて、数が へっています',
    'ほおぶくろは かたの あたりまで のびて、たくさんの 食べものを いっぺんに 運べます',
  ],

  sources: [
    'https://en.wikipedia.org/wiki/Golden_hamster (妊娠約16日・1腹8〜10匹・1930年アレッポの母子・寿命2〜3年・ほおぶくろ)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC9796486/ (VetCompass 2022 イギリスのペットのハムスター1万6千匹・死亡年齢の中央値1.75歳・最長3.65歳)',
    'https://pubmed.ncbi.nlm.nih.gov/2257890/ (研究用ゴールデンハムスター オスの寿命の中央値19.5か月・最長36か月)',
    'https://www.msdvetmanual.com/exotic-and-laboratory-animals/rodents/hamsters (ハムスターの飼育と生物学・離乳は約3週)',
    'https://en.wikipedia.org/wiki/Hamster_wheel (一晩に9km ほど走ることがある)',
    'https://www.avma.org/resources-tools/reports-statistics/us-pet-ownership-statistics (AVMA アメリカの家庭のハムスター約110万匹)',
  ],
};
