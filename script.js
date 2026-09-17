/* グラス国旗 — Meta Ray-Ban Display 用 国旗図鑑＆クイズ
   入力: タップ(Enter) と D-pad(矢印キー) のみ。Escape は PC 確認用の補助。 */
(function () {
  'use strict';

  var DEMO = /[?&]demo=1/.test(location.search);
  var seed = 20260917;
  function rnd() {
    if (!DEMO) return Math.random();
    seed = (seed * 1664525 + 1013904223) >>> 0; // デモ録画用: 乱数固定
    return seed / 4294967296;
  }
  function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* =====================================================================
     国旗データ
     描画は正規化座標 (x: 0..1 = 幅, y: 0..1 = 高さ)。半径は高さ基準。
     h: 横じま  v: 縦じま  r: 矩形  c: 円  s: 星  m: 三日月  x: 北欧十字
     p: 多角形  ln: 太線  uj: ユニオンジャック  sun: 太陽  ring: 法輪
     ===================================================================== */
  var W = '#ffffff', K = '#141414';
  var FLAGS = [
    // ---- アジア ----
    ['jp', '日本', 'Japan', '東京', 'アジア', 2 / 3, [['h', [W]], ['c', .5, .5, .3, '#bc002d']]],
    ['kr', '韓国', 'South Korea', 'ソウル', 'アジア', 2 / 3, [['h', [W]], ['kr']]],
    ['cn', '中国', 'China', '北京', 'アジア', 2 / 3, [['h', ['#de2910']], ['s', .167, .25, .15, '#ffde00'], ['s', .333, .1, .05, '#ffde00'], ['s', .4, .2, .05, '#ffde00'], ['s', .4, .35, .05, '#ffde00'], ['s', .333, .45, .05, '#ffde00']]],
    ['vn', 'ベトナム', 'Vietnam', 'ハノイ', 'アジア', 2 / 3, [['h', ['#da251d']], ['s', .5, .5, .3, '#ffff00']]],
    ['th', 'タイ', 'Thailand', 'バンコク', 'アジア', 2 / 3, [['h', ['#a51931', W, '#2d2a4a', W, '#a51931'], [1, 1, 2, 1, 1]]]],
    ['id', 'インドネシア', 'Indonesia', 'ジャカルタ', 'アジア', 2 / 3, [['h', ['#ce1126', W]]]],
    ['sg', 'シンガポール', 'Singapore', 'シンガポール', 'アジア', 2 / 3, [['h', ['#ef3340', W]], ['m', .19, .25, .16, W, .05, .11], ['ring5', .31, .25, .1, .03, W]]],
    ['my', 'マレーシア', 'Malaysia', 'クアラルンプール', 'アジア', 1 / 2, [['h', ['#cc0001', W, '#cc0001', W, '#cc0001', W, '#cc0001', W, '#cc0001', W, '#cc0001', W, '#cc0001', W]], ['r', 0, 0, .5, .571, '#010066'], ['m', .19, .285, .15, '#ffcc00', .04, .11], ['s', .36, .285, .12, '#ffcc00', 14]]],
    ['ph', 'フィリピン', 'Philippines', 'マニラ', 'アジア', 1 / 2, [['h', ['#0038a8', '#ce1126']], ['p', [[0, 0], [.433, .5], [0, 1]], W], ['sun', .15, .5, .075, '#fcd116', 8], ['s', .05, .08, .035, '#fcd116'], ['s', .05, .92, .035, '#fcd116'], ['s', .36, .5, .035, '#fcd116']]],
    ['in', 'インド', 'India', 'ニューデリー', 'アジア', 2 / 3, [['h', ['#ff9933', W, '#138808']], ['ring', .5, .5, .14, '#000080', 24]]],
    ['pk', 'パキスタン', 'Pakistan', 'イスラマバード', 'アジア', 2 / 3, [['h', ['#01411c']], ['r', 0, 0, .25, 1, W], ['m', .6, .5, .27, W, .07, .2], ['s', .77, .33, .1, W, 5, -.6]]],
    ['bd', 'バングラデシュ', 'Bangladesh', 'ダッカ', 'アジア', 3 / 5, [['h', ['#006a4e']], ['c', .45, .5, .3, '#f42a41']]],
    ['la', 'ラオス', 'Laos', 'ビエンチャン', 'アジア', 2 / 3, [['h', ['#ce1126', '#002868', '#ce1126'], [1, 2, 1]], ['c', .5, .5, .2, W]]],
    ['mv', 'モルディブ', 'Maldives', 'マレ', 'アジア', 2 / 3, [['h', ['#d21034']], ['r', .25, .25, .5, .5, '#007e3a'], ['m', .52, .5, .17, W, .05, .12]]],
    ['np', 'ネパール', 'Nepal', 'カトマンズ', 'アジア', 1.22, [['np']]],
    ['tr', 'トルコ', 'Turkey', 'アンカラ', 'アジア', 2 / 3, [['h', ['#e30a17']], ['m', .34, .5, .25, W, .07, .18], ['s', .62, .5, .09, W, 5, -.3]]],
    ['il', 'イスラエル', 'Israel', 'エルサレム', 'アジア', 8 / 11, [['h', [W]], ['r', 0, .125, 1, .156, '#0038b8'], ['r', 0, .719, 1, .156, '#0038b8'], ['sd', .5, .5, .24, '#0038b8', .035]]],
    ['ae', 'アラブ首長国連邦', 'UAE', 'アブダビ', 'アジア', 1 / 2, [['h', ['#00732f', W, K]], ['r', 0, 0, .25, 1, '#ff0000']]],
    ['kw', 'クウェート', 'Kuwait', 'クウェート', 'アジア', 1 / 2, [['h', ['#007a3d', W, '#ce1126']], ['p', [[0, 0], [.25, .25], [.25, .75], [0, 1]], K]]],
    ['qa', 'カタール', 'Qatar', 'ドーハ', 'アジア', 11 / 28, [['h', ['#8a1538']], ['zig', .24, .33, 9, W]]],
    ['bh', 'バーレーン', 'Bahrain', 'マナーマ', 'アジア', 3 / 5, [['h', ['#ce1126']], ['zig', .25, .4, 5, W]]],
    ['jo', 'ヨルダン', 'Jordan', 'アンマン', 'アジア', 1 / 2, [['h', [K, W, '#007a3d']], ['p', [[0, 0], [.5, .5], [0, 1]], '#ce1126'], ['s', .17, .5, .08, W, 7]]],
    ['ye', 'イエメン', 'Yemen', 'サヌア', 'アジア', 2 / 3, [['h', ['#ce1126', W, K]]]],
    ['am', 'アルメニア', 'Armenia', 'エレバン', 'アジア', 1 / 2, [['h', ['#d90012', '#0033a0', '#f2a800']]]],
    ['ge', 'ジョージア', 'Georgia', 'トビリシ', 'アジア', 2 / 3, [['h', [W]], ['x', .5, .2, '#ff0000'], ['plus', .2, .25, .1, '#ff0000'], ['plus', .8, .25, .1, '#ff0000'], ['plus', .2, .75, .1, '#ff0000'], ['plus', .8, .75, .1, '#ff0000']]],
    ['mm', 'ミャンマー', 'Myanmar', 'ネピドー', 'アジア', 2 / 3, [['h', ['#fecb00', '#34b233', '#ea2839']], ['s', .5, .5, .33, W]]],
    // ---- ヨーロッパ ----
    ['gb', 'イギリス', 'United Kingdom', 'ロンドン', 'ヨーロッパ', 1 / 2, [['uj', 0, 0, 1, 1]]],
    ['fr', 'フランス', 'France', 'パリ', 'ヨーロッパ', 2 / 3, [['v', ['#0055a4', W, '#ef4135']]]],
    ['de', 'ドイツ', 'Germany', 'ベルリン', 'ヨーロッパ', 3 / 5, [['h', [K, '#dd0000', '#ffce00']]]],
    ['it', 'イタリア', 'Italy', 'ローマ', 'ヨーロッパ', 2 / 3, [['v', ['#009246', W, '#ce2b37']]]],
    ['es', 'スペイン', 'Spain', 'マドリード', 'ヨーロッパ', 2 / 3, [['h', ['#aa151b', '#f1bf00', '#aa151b'], [1, 2, 1]]]],
    ['nl', 'オランダ', 'Netherlands', 'アムステルダム', 'ヨーロッパ', 2 / 3, [['h', ['#ae1c28', W, '#21468b']]]],
    ['lu', 'ルクセンブルク', 'Luxembourg', 'ルクセンブルク', 'ヨーロッパ', 3 / 5, [['h', ['#ed2939', W, '#00a1de']]]],
    ['be', 'ベルギー', 'Belgium', 'ブリュッセル', 'ヨーロッパ', 13 / 15, [['v', [K, '#fae042', '#ed2939']]]],
    ['ch', 'スイス', 'Switzerland', 'ベルン', 'ヨーロッパ', 1, [['h', ['#ff0000']], ['r', .4, .175, .2, .65, W], ['r', .175, .4, .65, .2, W]]],
    ['at', 'オーストリア', 'Austria', 'ウィーン', 'ヨーロッパ', 2 / 3, [['h', ['#ed2939', W, '#ed2939']]]],
    ['pl', 'ポーランド', 'Poland', 'ワルシャワ', 'ヨーロッパ', 5 / 8, [['h', [W, '#dc143c']]]],
    ['cz', 'チェコ', 'Czechia', 'プラハ', 'ヨーロッパ', 2 / 3, [['h', [W, '#d7141a']], ['p', [[0, 0], [.5, .5], [0, 1]], '#11457e']]],
    ['hu', 'ハンガリー', 'Hungary', 'ブダペスト', 'ヨーロッパ', 1 / 2, [['h', ['#ce2939', W, '#477050']]]],
    ['bg', 'ブルガリア', 'Bulgaria', 'ソフィア', 'ヨーロッパ', 3 / 5, [['h', [W, '#00966e', '#d62612']]]],
    ['ro', 'ルーマニア', 'Romania', 'ブカレスト', 'ヨーロッパ', 2 / 3, [['v', ['#002b7f', '#fcd116', '#ce1126']]]],
    ['ua', 'ウクライナ', 'Ukraine', 'キーウ', 'ヨーロッパ', 2 / 3, [['h', ['#0057b7', '#ffd700']]]],
    ['ru', 'ロシア', 'Russia', 'モスクワ', 'ヨーロッパ', 2 / 3, [['h', [W, '#0039a6', '#d52b1e']]]],
    ['ee', 'エストニア', 'Estonia', 'タリン', 'ヨーロッパ', 7 / 11, [['h', ['#0072ce', K, W]]]],
    ['lv', 'ラトビア', 'Latvia', 'リガ', 'ヨーロッパ', 1 / 2, [['h', ['#9e3039', W, '#9e3039'], [2, 1, 2]]]],
    ['lt', 'リトアニア', 'Lithuania', 'ビリニュス', 'ヨーロッパ', 3 / 5, [['h', ['#fdb913', '#006a44', '#c1272d']]]],
    ['se', 'スウェーデン', 'Sweden', 'ストックホルム', 'ヨーロッパ', 5 / 8, [['h', ['#006aa7']], ['x', .375, .2, '#fecc00']]],
    ['fi', 'フィンランド', 'Finland', 'ヘルシンキ', 'ヨーロッパ', 11 / 18, [['h', [W]], ['x', .389, .27, '#003580']]],
    ['dk', 'デンマーク', 'Denmark', 'コペンハーゲン', 'ヨーロッパ', 28 / 37, [['h', ['#c8102e']], ['x', .378, .143, W]]],
    ['no', 'ノルウェー', 'Norway', 'オスロ', 'ヨーロッパ', 8 / 11, [['h', ['#ba0c2f']], ['x', .409, .25, W], ['x', .409, .125, '#00205b']]],
    ['is', 'アイスランド', 'Iceland', 'レイキャビク', 'ヨーロッパ', 18 / 25, [['h', ['#02529c']], ['x', .4, .222, W], ['x', .4, .111, '#dc1e35']]],
    ['ie', 'アイルランド', 'Ireland', 'ダブリン', 'ヨーロッパ', 1 / 2, [['v', ['#169b62', W, '#ff883e']]]],
    ['gr', 'ギリシャ', 'Greece', 'アテネ', 'ヨーロッパ', 2 / 3, [['h', ['#0d5eaf', W, '#0d5eaf', W, '#0d5eaf', W, '#0d5eaf', W, '#0d5eaf']], ['r', 0, 0, .37, .556, '#0d5eaf'], ['r', .155, 0, .06, .556, W], ['r', 0, .245, .37, .066, W]]],
    // ---- アフリカ ----
    ['ng', 'ナイジェリア', 'Nigeria', 'アブジャ', 'アフリカ', 1 / 2, [['v', ['#008751', W, '#008751']]]],
    ['gh', 'ガーナ', 'Ghana', 'アクラ', 'アフリカ', 2 / 3, [['h', ['#ce1126', '#fcd116', '#006b3f']], ['s', .5, .5, .17, K]]],
    ['ci', 'コートジボワール', "Côte d'Ivoire", 'ヤムスクロ', 'アフリカ', 2 / 3, [['v', ['#ff8200', W, '#009a44']]]],
    ['ml', 'マリ', 'Mali', 'バマコ', 'アフリカ', 2 / 3, [['v', ['#14b53a', '#fcd116', '#ce1126']]]],
    ['gn', 'ギニア', 'Guinea', 'コナクリ', 'アフリカ', 2 / 3, [['v', ['#ce1126', '#fcd116', '#009460']]]],
    ['sn', 'セネガル', 'Senegal', 'ダカール', 'アフリカ', 2 / 3, [['v', ['#00853f', '#fdef42', '#e31b23']], ['s', .5, .5, .16, '#00853f']]],
    ['td', 'チャド', 'Chad', 'ンジャメナ', 'アフリカ', 2 / 3, [['v', ['#002664', '#fecb00', '#c60c30']]]],
    ['ne', 'ニジェール', 'Niger', 'ニアメ', 'アフリカ', 6 / 7, [['h', ['#e05206', W, '#0db02b']], ['c', .5, .5, .16, '#e05206']]],
    ['cm', 'カメルーン', 'Cameroon', 'ヤウンデ', 'アフリカ', 2 / 3, [['v', ['#007a5e', '#ce1126', '#fcd116']], ['s', .5, .5, .15, '#fcd116']]],
    ['ga', 'ガボン', 'Gabon', 'リーブルビル', 'アフリカ', 3 / 4, [['h', ['#009e60', '#fcd116', '#3a75c4']]]],
    ['sl', 'シエラレオネ', 'Sierra Leone', 'フリータウン', 'アフリカ', 2 / 3, [['h', ['#1eb53a', W, '#0072c6']]]],
    ['lr', 'リベリア', 'Liberia', 'モンロビア', 'アフリカ', 10 / 19, [['h', ['#bf0a30', W, '#bf0a30', W, '#bf0a30', W, '#bf0a30', W, '#bf0a30', W, '#bf0a30']], ['r', 0, 0, .4, .4545, '#002868'], ['s', .2, .227, .14, W]]],
    ['tg', 'トーゴ', 'Togo', 'ロメ', 'アフリカ', 3 / 5, [['h', ['#006a4e', '#ffce00', '#006a4e', '#ffce00', '#006a4e']], ['r', 0, 0, .4, .6, '#d21034'], ['s', .2, .3, .18, W]]],
    ['et', 'エチオピア', 'Ethiopia', 'アディスアベバ', 'アフリカ', 1 / 2, [['h', ['#078930', '#fcdd09', '#da121a']], ['c', .5, .5, .3, '#0f47af'], ['s', .5, .5, .2, '#fcdd09']]],
    ['so', 'ソマリア', 'Somalia', 'モガディシュ', 'アフリカ', 2 / 3, [['h', ['#4189dd']], ['s', .5, .5, .3, W]]],
    ['tn', 'チュニジア', 'Tunisia', 'チュニス', 'アフリカ', 2 / 3, [['h', ['#e70013']], ['c', .5, .5, .25, W], ['m', .5, .5, .19, '#e70013', .05, .14], ['s', .55, .5, .09, '#e70013', 5, -.3]]],
    ['dz', 'アルジェリア', 'Algeria', 'アルジェ', 'アフリカ', 2 / 3, [['v', ['#006233', W]], ['m', .5, .5, .25, '#d21034', .07, .18], ['s', .62, .5, .08, '#d21034', 5, -.3]]],
    ['bw', 'ボツワナ', 'Botswana', 'ハボローネ', 'アフリカ', 2 / 3, [['h', ['#75aadb', W, K, W, '#75aadb'], [9, 1, 4, 1, 9]]]],
    ['za', '南アフリカ', 'South Africa', 'プレトリア', 'アフリカ', 2 / 3, [['za']]],
    ['tz', 'タンザニア', 'Tanzania', 'ドドマ', 'アフリカ', 2 / 3, [['h', ['#1eb53a']], ['p', [[1, 0], [1, 1], [0, 1]], '#00a3dd'], ['ln', 0, 1, 1, 0, .33, '#fcd116'], ['ln', 0, 1, 1, 0, .2, K]]],
    ['sc', 'セーシェル', 'Seychelles', 'ビクトリア', 'アフリカ', 1 / 2, [['p', [[0, 0], [.333, 0], [0, 1]], '#003f87'], ['p', [[0, 1], [.333, 0], [.667, 0]], '#fcd856'], ['p', [[0, 1], [.667, 0], [1, 0], [1, .333]], '#d62828'], ['p', [[0, 1], [1, .333], [1, .667]], W], ['p', [[0, 1], [1, .667], [1, 1]], '#007a3d']]],
    // ---- 北米・中南米 ----
    ['us', 'アメリカ', 'United States', 'ワシントンD.C.', '北米・中南米', 10 / 19, [['h', ['#b22234', W, '#b22234', W, '#b22234', W, '#b22234', W, '#b22234', W, '#b22234', W, '#b22234']], ['r', 0, 0, .4, .538, '#3c3b6e'], ['usstars', 0, 0, .4, .538]]],
    ['ca', 'カナダ', 'Canada', 'オタワ', '北米・中南米', 1 / 2, [['v', ['#d80621', W, '#d80621'], [1, 2, 1]], ['leaf', .5, .5, .3, '#d80621']]],
    ['mx', 'メキシコ', 'Mexico', 'メキシコシティ', '北米・中南米', 4 / 7, [['v', ['#006847', W, '#ce1126']], ['c', .5, .5, .13, '#8a6d3b'], ['c', .5, .5, .09, '#5a4a2a']]],
    ['cu', 'キューバ', 'Cuba', 'ハバナ', '北米・中南米', 1 / 2, [['h', ['#002a8f', W, '#002a8f', W, '#002a8f']], ['p', [[0, 0], [.433, .5], [0, 1]], '#cf142b'], ['s', .144, .5, .15, W]]],
    ['jm', 'ジャマイカ', 'Jamaica', 'キングストン', '北米・中南米', 1 / 2, [['h', ['#009b3a']], ['p', [[0, 0], [.5, .5], [0, 1]], K], ['p', [[1, 0], [.5, .5], [1, 1]], K], ['ln', 0, 0, 1, 1, .17, '#fed100'], ['ln', 0, 1, 1, 0, .17, '#fed100']]],
    ['bs', 'バハマ', 'Bahamas', 'ナッソー', '北米・中南米', 1 / 2, [['h', ['#00abc9', '#fae042', '#00abc9']], ['p', [[0, 0], [.4, .5], [0, 1]], K]]],
    ['pa', 'パナマ', 'Panama', 'パナマシティ', '北米・中南米', 2 / 3, [['h', [W]], ['r', .5, 0, .5, .5, '#d21034'], ['r', 0, .5, .5, .5, '#005293'], ['s', .25, .25, .15, '#005293'], ['s', .75, .75, .15, '#d21034']]],
    ['cr', 'コスタリカ', 'Costa Rica', 'サンホセ', '北米・中南米', 3 / 5, [['h', ['#002b7f', W, '#ce1126', W, '#002b7f'], [1, 1, 2, 1, 1]]]],
    ['co', 'コロンビア', 'Colombia', 'ボゴタ', '北米・中南米', 2 / 3, [['h', ['#fcd116', '#003893', '#ce1126'], [2, 1, 1]]]],
    ['ve', 'ベネズエラ', 'Venezuela', 'カラカス', '北米・中南米', 2 / 3, [['h', ['#fcd116', '#00247d', '#cf142b']], ['arc', .5, .75, .3, 8, .035, W, 200, 340]]],
    ['pe', 'ペルー', 'Peru', 'リマ', '北米・中南米', 2 / 3, [['v', ['#d91023', W, '#d91023']]]],
    ['bo', 'ボリビア', 'Bolivia', 'ラパス', '北米・中南米', 15 / 22, [['h', ['#d52b1e', '#f9e300', '#007934']]]],
    ['br', 'ブラジル', 'Brazil', 'ブラジリア', '北米・中南米', 7 / 10, [['h', ['#009c3b']], ['p', [[.5, .085], [.915, .5], [.5, .915], [.085, .5]], '#ffdf00'], ['c', .5, .5, .35, '#002776'], ['band', .5, .5, .35, W]]],
    ['ar', 'アルゼンチン', 'Argentina', 'ブエノスアイレス', '北米・中南米', 5 / 8, [['h', ['#74acdf', W, '#74acdf']], ['sun', .5, .5, .11, '#f6b40e', 16]]],
    ['cl', 'チリ', 'Chile', 'サンティアゴ', '北米・中南米', 2 / 3, [['h', [W, '#d52b1e']], ['r', 0, 0, .333, .5, '#0039a6'], ['s', .167, .25, .12, W]]],
    // ---- オセアニア ----
    ['au', 'オーストラリア', 'Australia', 'キャンベラ', 'オセアニア', 1 / 2, [['h', ['#00008b']], ['uj', 0, 0, .5, .5], ['s', .25, .75, .1, W, 7], ['s', .75, .17, .05, W, 7], ['s', .625, .5, .05, W, 7], ['s', .75, .83, .05, W, 7], ['s', .875, .4, .05, W, 7], ['s', .8, .55, .03, W, 5]]],
    ['nz', 'ニュージーランド', 'New Zealand', 'ウェリントン', 'オセアニア', 1 / 2, [['h', ['#00247d']], ['uj', 0, 0, .5, .5], ['s', .75, .19, .065, W], ['s', .75, .19, .045, '#cc142b'], ['s', .625, .5, .065, W], ['s', .625, .5, .045, '#cc142b'], ['s', .875, .42, .065, W], ['s', .875, .42, .045, '#cc142b'], ['s', .75, .77, .075, W], ['s', .75, .77, .055, '#cc142b']]],
    ['pw', 'パラオ', 'Palau', 'ンゲルルムッド', 'オセアニア', 5 / 8, [['h', ['#4aadd6']], ['c', .45, .5, .3, '#ffde00']]],
  ];
  // 似ている国旗のグループ（そっくり国旗モード／クイズの選択肢に使う）
  var LOOKALIKE = [
    ['id', 'mc', 'pl', 'sg'], ['ro', 'td'], ['no', 'is'], ['ie', 'ci'], ['ml', 'gn', 'sn'], ['lu', 'nl', 'ru'],
    ['au', 'nz'], ['qa', 'bh'], ['th', 'cr'], ['lr', 'us'], ['tr', 'tn'], ['ne', 'in'], ['bd', 'pw', 'jp'],
    ['at', 'lv'], ['hu', 'bg'], ['mm', 'gh', 'bo', 'lt'], ['co', 've'], ['sl', 'ga'], ['cn', 'vn'], ['pe', 'ng'],
    ['cu', 'ph'], ['se', 'fi', 'dk', 'no', 'is'], ['jo', 'kw'], ['it', 'mx'], ['cz', 'ph'], ['cl', 'pa'], ['ye', 'ae'],
  ];
  // モナコは図鑑にも載せる
  FLAGS.push(['mc', 'モナコ', 'Monaco', 'モナコ', 'ヨーロッパ', 4 / 5, [['h', ['#ce1126', W]]]]);
  var REGIONS = ['アジア', 'ヨーロッパ', 'アフリカ', '北米・中南米', 'オセアニア'];
  var F = FLAGS.map(function (a) { return { id: a[0], ja: a[1], en: a[2], cap: a[3], region: a[4], ratio: a[5], ops: a[6] }; });
  // 図鑑の並び: 地域順
  F.sort(function (a, b) { return REGIONS.indexOf(a.region) - REGIONS.indexOf(b.region); });
  var BY_ID = {};
  F.forEach(function (f) { BY_ID[f.id] = f; });

  /* =====================================================================
     描画
     ===================================================================== */
  function starPath(ctx, cx, cy, r, n, rot) {
    n = n || 5;
    var inner = n === 5 ? 0.382 : n === 7 ? 0.45 : n === 14 ? 0.55 : 0.5;
    ctx.beginPath();
    for (var i = 0; i < n * 2; i++) {
      var a = -Math.PI / 2 + (rot || 0) + Math.PI * i / n;
      var rr = i % 2 === 0 ? r : r * inner;
      var x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  function unionJack(ctx, x, y, w, h) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = '#012169'; ctx.fillRect(x, y, w, h);
    ctx.lineCap = 'butt';
    // 白の斜め十字
    ctx.strokeStyle = W; ctx.lineWidth = h * 0.2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y + h); ctx.moveTo(x + w, y); ctx.lineTo(x, y + h); ctx.stroke();
    // 赤の斜め（片側にずらした細線）
    ctx.strokeStyle = '#c8102e'; ctx.lineWidth = h * 0.067;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.03); ctx.lineTo(x + w / 2, y + h / 2 + h * 0.03);
    ctx.moveTo(x + w / 2, y + h / 2 - h * 0.03); ctx.lineTo(x + w, y + h - h * 0.03);
    ctx.moveTo(x + w, y + h * 0.03); ctx.lineTo(x + w / 2, y + h / 2 + h * 0.03);
    ctx.moveTo(x + w / 2, y + h / 2 - h * 0.03); ctx.lineTo(x, y + h - h * 0.03);
    ctx.stroke();
    // 白十字 → 赤十字
    ctx.fillStyle = W;
    ctx.fillRect(x + w / 2 - h * 0.167, y, h * 0.333, h); ctx.fillRect(x, y + h / 2 - h * 0.167, w, h * 0.333);
    ctx.fillStyle = '#c8102e';
    ctx.fillRect(x + w / 2 - h * 0.1, y, h * 0.2, h); ctx.fillRect(x, y + h / 2 - h * 0.1, w, h * 0.2);
    ctx.restore();
  }
  function drawOps(ctx, ops, w, h) {
    ops.forEach(function (o) {
      var t = o[0], i, n;
      ctx.beginPath();
      if (t === 'h' || t === 'v') {
        var cols = o[1], ws = o[2] || cols.map(function () { return 1; });
        var tot = ws.reduce(function (a, b) { return a + b; }, 0), acc = 0;
        for (i = 0; i < cols.length; i++) {
          ctx.fillStyle = cols[i];
          if (t === 'h') ctx.fillRect(0, Math.round(h * acc / tot), w, Math.ceil(h * ws[i] / tot) + 1);
          else ctx.fillRect(Math.round(w * acc / tot), 0, Math.ceil(w * ws[i] / tot) + 1, h);
          acc += ws[i];
        }
      } else if (t === 'r') { ctx.fillStyle = o[5]; ctx.fillRect(o[1] * w, o[2] * h, o[3] * w, o[4] * h); }
      else if (t === 'c') { ctx.fillStyle = o[4]; ctx.arc(o[1] * w, o[2] * h, o[3] * h, 0, Math.PI * 2); ctx.fill(); }
      else if (t === 's') { ctx.fillStyle = o[4]; starPath(ctx, o[1] * w, o[2] * h, o[3] * h, o[5], o[6]); ctx.fill(); }
      else if (t === 'm') { // 三日月: 外円と内円を evenodd で塗る（背景を問わない）
        ctx.fillStyle = o[4];
        ctx.arc(o[1] * w, o[2] * h, o[3] * h, 0, Math.PI * 2);
        ctx.moveTo((o[1] + o[5]) * w + o[6] * h, o[2] * h);
        ctx.arc((o[1] + o[5]) * w, o[2] * h, o[6] * h, 0, Math.PI * 2);
        ctx.fill('evenodd');
      } else if (t === 'x') { // 北欧十字
        ctx.fillStyle = o[3]; var th = o[2] * h;
        ctx.fillRect(o[1] * w - th / 2, 0, th, h); ctx.fillRect(0, h / 2 - th / 2, w, th);
      } else if (t === 'plus') {
        ctx.fillStyle = o[4]; var s = o[3] * h, k = s * 0.3;
        ctx.fillRect(o[1] * w - k / 2, o[2] * h - s / 2, k, s); ctx.fillRect(o[1] * w - s / 2, o[2] * h - k / 2, s, k);
      } else if (t === 'p') {
        ctx.fillStyle = o[2];
        o[1].forEach(function (pt, j) { if (j === 0) ctx.moveTo(pt[0] * w, pt[1] * h); else ctx.lineTo(pt[0] * w, pt[1] * h); });
        ctx.closePath(); ctx.fill();
      } else if (t === 'ln') {
        ctx.strokeStyle = o[6]; ctx.lineWidth = o[5] * h; ctx.lineCap = 'butt';
        ctx.moveTo(o[1] * w, o[2] * h); ctx.lineTo(o[3] * w, o[4] * h); ctx.stroke();
      } else if (t === 'uj') { unionJack(ctx, o[1] * w, o[2] * h, o[3] * w, o[4] * h); }
      else if (t === 'sun') {
        var cx = o[1] * w, cy = o[2] * h, r = o[3] * h; n = o[5];
        ctx.fillStyle = o[4];
        for (i = 0; i < n; i++) {
          var a0 = Math.PI * 2 * i / n, a1 = a0 + Math.PI / n;
          ctx.beginPath(); ctx.moveTo(cx + Math.cos(a0) * r * 1.1, cy + Math.sin(a0) * r * 1.1);
          ctx.lineTo(cx + Math.cos((a0 + a1) / 2) * r * 2.1, cy + Math.sin((a0 + a1) / 2) * r * 2.1);
          ctx.lineTo(cx + Math.cos(a1) * r * 1.1, cy + Math.sin(a1) * r * 1.1); ctx.closePath(); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      } else if (t === 'ring') {
        ctx.strokeStyle = o[4]; ctx.lineWidth = o[3] * h * 0.14;
        ctx.arc(o[1] * w, o[2] * h, o[3] * h, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = o[3] * h * 0.06; ctx.beginPath();
        for (i = 0; i < o[5]; i++) { var an = Math.PI * 2 * i / o[5]; ctx.moveTo(o[1] * w, o[2] * h); ctx.lineTo(o[1] * w + Math.cos(an) * o[3] * h, o[2] * h + Math.sin(an) * o[3] * h); }
        ctx.stroke();
        ctx.beginPath(); ctx.fillStyle = o[4]; ctx.arc(o[1] * w, o[2] * h, o[3] * h * 0.2, 0, Math.PI * 2); ctx.fill();
      } else if (t === 'ring5') { // シンガポールの5つ星
        for (i = 0; i < 5; i++) { var aa = -Math.PI / 2 + Math.PI * 2 * i / 5; ctx.fillStyle = o[5]; starPath(ctx, o[1] * w + Math.cos(aa) * o[3] * h, o[2] * h + Math.sin(aa) * o[3] * h, o[4] * h); ctx.fill(); }
      } else if (t === 'sd') { // ダビデの星
        ctx.strokeStyle = o[4]; ctx.lineWidth = o[5] * h; ctx.lineJoin = 'miter';
        [0, Math.PI].forEach(function (rot) {
          ctx.beginPath();
          for (i = 0; i < 3; i++) { var ag = -Math.PI / 2 + rot + Math.PI * 2 * i / 3; var px = o[1] * w + Math.cos(ag) * o[3] * h, py = o[2] * h + Math.sin(ag) * o[3] * h; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
          ctx.closePath(); ctx.stroke();
        });
      } else if (t === 'zig') { // 鋸歯（カタール・バーレーン）
        ctx.fillStyle = o[4]; var xb = o[1] * w, xt = o[2] * w; n = o[3];
        ctx.moveTo(0, 0); ctx.lineTo(xb, 0);
        for (i = 0; i < n; i++) { ctx.lineTo(xt, h * (i + 0.5) / n); ctx.lineTo(xb, h * (i + 1) / n); }
        ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
      } else if (t === 'arc') { // 弧状に並ぶ星（ベネズエラ）
        for (i = 0; i < o[4]; i++) { var ad = (o[7] + (o[8] - o[7]) * i / (o[4] - 1)) * Math.PI / 180; ctx.fillStyle = o[6]; starPath(ctx, o[1] * w + Math.cos(ad) * o[3] * h * 1.5, o[2] * h + Math.sin(ad) * o[3] * h, o[5] * h); ctx.fill(); }
      } else if (t === 'band') { // ブラジルの白い帯
        ctx.save(); ctx.arc(o[1] * w, o[2] * h, o[3] * h, 0, Math.PI * 2); ctx.clip();
        ctx.strokeStyle = o[4]; ctx.lineWidth = o[3] * h * 0.18; ctx.beginPath();
        ctx.arc(o[1] * w, o[2] * h + o[3] * h * 2.3, o[3] * h * 2.4, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); ctx.restore();
      } else if (t === 'usstars') {
        ctx.fillStyle = W; var X = o[1] * w, Y = o[2] * h, CW = o[3] * w, CH = o[4] * h, rr = CH * 0.045, r2, c2;
        for (r2 = 0; r2 < 9; r2++) { var cnt = r2 % 2 === 0 ? 6 : 5; for (c2 = 0; c2 < cnt; c2++) { starPath(ctx, X + CW * ((r2 % 2 === 0 ? 1 : 2) + c2 * 2) / 12, Y + CH * (r2 + 1) / 10, rr); ctx.fill(); } }
      } else if (t === 'leaf') { // カナダのカエデ（簡略）
        var L = [[.5, 0], [.42, .15], [.32, .12], [.37, .35], [.3, .32], [.25, .22], [.2, .3], [.05, .28], [.1, .45], [.05, .5], [.3, .68], [.27, .75], [.47, .72], [.47, 1], [.53, 1], [.53, .72], [.73, .75], [.7, .68], [.95, .5], [.9, .45], [.95, .28], [.8, .3], [.75, .22], [.7, .32], [.63, .35], [.68, .12], [.58, .15]];
        var lr = o[3] * h; ctx.fillStyle = o[4];
        L.forEach(function (pt, j) { var px = o[1] * w + (pt[0] - .5) * lr * 2, py = o[2] * h + (pt[1] - .5) * lr * 2; if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); });
        ctx.closePath(); ctx.fill();
      } else if (t === 'kr') { // 太極と四卦
        var kx = w / 2, ky = h / 2, kr = h * 0.25;
        ctx.fillStyle = '#cd2e3a'; ctx.arc(kx, ky, kr, Math.PI * 1.15, Math.PI * 0.15); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = '#0047a0'; ctx.arc(kx, ky, kr, Math.PI * 0.15, Math.PI * 1.15); ctx.fill();
        var ox = Math.cos(Math.PI * 0.15) * kr / 2, oy = Math.sin(Math.PI * 0.15) * kr / 2;
        ctx.beginPath(); ctx.fillStyle = '#cd2e3a'; ctx.arc(kx - ox, ky - oy, kr / 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = '#0047a0'; ctx.arc(kx + ox, ky + oy, kr / 2, 0, Math.PI * 2); ctx.fill();
        // 四卦: [角度, 各バーが切れているか]
        var tri = [[Math.PI * 1.15, [0, 0, 0]], [Math.PI * 0.15, [1, 1, 1]], [Math.PI * 1.85, [1, 0, 1]], [Math.PI * 0.85, [0, 1, 0]]];
        ctx.fillStyle = K;
        tri.forEach(function (tg) {
          var d = kr * 1.55, cxx = kx + Math.cos(tg[0]) * d, cyy = ky + Math.sin(tg[0]) * d;
          ctx.save(); ctx.translate(cxx, cyy); ctx.rotate(tg[0] + Math.PI / 2);
          var bw = kr * 0.9, bh = kr * 0.14;
          for (i = 0; i < 3; i++) {
            var yy = (i - 1) * bh * 1.7 - bh / 2;
            if (tg[1][i]) { ctx.fillRect(-bw / 2, yy, bw * 0.44, bh); ctx.fillRect(bw * 0.06, yy, bw * 0.44, bh); }
            else ctx.fillRect(-bw / 2, yy, bw, bh);
          }
          ctx.restore();
        });
      } else if (t === 'np') { // ネパール（旗自体が四角くない）: 赤い二重三角を青でふちどる
        var P = [[0, 0], [0.75, 0.45], [0.3, 0.45], [0.95, 1], [0, 1]], mg = 0.04;
        ctx.fillStyle = '#dc143c'; ctx.strokeStyle = '#003893'; ctx.lineWidth = h * 0.055; ctx.lineJoin = 'miter'; ctx.miterLimit = 12;
        P.forEach(function (pt, j) { var px = (mg + pt[0] * (1 - 2 * mg)) * w, py = (mg + pt[1] * (1 - 2 * mg)) * h; if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); });
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.fillStyle = W; ctx.arc(0.28 * w, 0.73 * h, 0.095 * h, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = W; ctx.arc(0.28 * w, 0.31 * h, 0.075 * h, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = '#dc143c'; ctx.arc(0.28 * w, 0.255 * h, 0.075 * h, 0, Math.PI * 2); ctx.fill();
      } else if (t === 'za') { // 南アフリカのY字
        ctx.fillStyle = '#de3831'; ctx.fillRect(0, 0, w, h / 2); ctx.fillStyle = '#002395'; ctx.fillRect(0, h / 2, w, h / 2);
        ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
        ctx.strokeStyle = W; ctx.lineWidth = h * 0.33; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w * 0.37, h / 2); ctx.lineTo(w * 1.1, h / 2); ctx.moveTo(0, h); ctx.lineTo(w * 0.37, h / 2); ctx.stroke();
        ctx.strokeStyle = '#007a4d'; ctx.lineWidth = h * 0.2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w * 0.37, h / 2); ctx.lineTo(w * 1.1, h / 2); ctx.moveTo(0, h); ctx.lineTo(w * 0.37, h / 2); ctx.stroke();
        ctx.fillStyle = '#ffb612'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w * 0.3, h / 2); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
        ctx.fillStyle = K; ctx.beginPath(); ctx.moveTo(0, h * 0.13); ctx.lineTo(w * 0.22, h / 2); ctx.lineTo(0, h * 0.87); ctx.closePath(); ctx.fill();
      }
    });
  }
  // canvas いっぱいに国旗を描く（縦横比を保ち中央寄せ、背景は透明のまま）
  function drawFlag(canvas, f, maxW, maxH) {
    maxW = maxW || canvas.width; maxH = maxH || canvas.height;
    var ratio = f.ratio; // 高さ/幅
    var w = maxW, h = w * ratio;
    if (h > maxH) { h = maxH; w = h / ratio; }
    w = Math.round(w); h = Math.round(h);
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    if (f.id !== 'np') { ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, w, h); }
    drawOps(ctx, f.ops, w, h);
  }

  /* =====================================================================
     状態・DOM
     ===================================================================== */
  var $ = function (id) { return document.getElementById(id); };
  var screens = { title: $('title'), help: $('help'), book: $('book'), quiz: $('quiz'), look: $('look'), result: $('result') };
  var hudMode = $('hud-mode'), hudRight = $('hud-right'), hint = $('hint');
  var state = 'title', menuIdx = 0, bookIdx = 0;
  var game = null; // { mode:'quiz'|'look', qs:[], i:0, score:0, sel:0, answered:false }
  var resIdx = 0;
  var QN = 10;

  var KEY = 'glass-kokki-best';
  function loadBest() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function saveBest(b) { if (DEMO) return; try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) { /* ignore */ } }

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].classList.toggle('hidden', k !== name); });
    state = name;
  }
  function setHint(t, hot) { hint.textContent = t; hint.classList.toggle('hot', !!hot); }
  function setCur(list, idx) { list.forEach(function (el, i) { el.classList.toggle('cur', i === idx); }); }

  /* ---------- タイトル ---------- */
  var menuBtns = Array.prototype.slice.call(document.querySelectorAll('#title .rail-btn'));
  var logoFlags = ['jp', 'br', 'gb', 'kr', 'se', 'ca'], logoI = 0, logoTimer = null;
  function drawLogo() { var c = $('logo-flag'); drawFlag(c, BY_ID[logoFlags[logoI]], 150, 100); }
  function toTitle() {
    show('title');
    hudMode.textContent = '🏳️ グラス国旗'; hudRight.textContent = '';
    setHint('↑↓ でえらんで タップ');
    setCur(menuBtns, menuIdx);
    var b = loadBest();
    $('t-rec').textContent = 'ベスト　クイズ ' + (b.quiz != null ? b.quiz + '/' + QN : '－') + '　そっくり ' + (b.look != null ? b.look + '/' + QN : '－');
    drawLogo();
    clearInterval(logoTimer);
    logoTimer = setInterval(function () { if (state !== 'title') return; logoI = (logoI + 1) % logoFlags.length; drawLogo(); }, 1600);
  }

  /* ---------- ずかん ---------- */
  function renderBook() {
    var f = F[bookIdx];
    drawFlag($('book-canvas'), f, 460, 300);
    $('book-name').textContent = f.ja;
    $('book-en').textContent = f.en;
    $('book-cap').textContent = '首都 ' + f.cap;
    $('book-region').textContent = f.region;
    $('book-idx').textContent = (bookIdx + 1) + ' / ' + F.length;
    hudRight.textContent = f.region;
  }
  function toBook() {
    show('book');
    hudMode.textContent = '📖 ずかん';
    setHint('←→ つぎの国　↑↓ 地域　タップ＝メニューへ');
    renderBook();
  }
  function jumpRegion(dir) {
    var cur = F[bookIdx].region, ri = REGIONS.indexOf(cur);
    var next = REGIONS[(ri + dir + REGIONS.length) % REGIONS.length];
    for (var i = 0; i < F.length; i++) if (F[i].region === next) { bookIdx = i; break; }
  }

  /* ---------- クイズ生成 ---------- */
  function groupOf(id) {
    var out = [];
    LOOKALIKE.forEach(function (g) { if (g.indexOf(id) >= 0) g.forEach(function (x) { if (x !== id && out.indexOf(x) < 0 && BY_ID[x]) out.push(x); }); });
    return out;
  }
  function makeQuiz() {
    var pool = shuffle(F).slice(0, QN);
    return pool.map(function (f) {
      var choices = [f.id];
      var near = shuffle(groupOf(f.id));
      near.forEach(function (x) { if (choices.length < 4) choices.push(x); });
      var same = shuffle(F.filter(function (g) { return g.region === f.region && choices.indexOf(g.id) < 0; }));
      same.forEach(function (g) { if (choices.length < 4) choices.push(g.id); });
      var any = shuffle(F.filter(function (g) { return choices.indexOf(g.id) < 0; }));
      any.forEach(function (g) { if (choices.length < 4) choices.push(g.id); });
      return { ans: f.id, choices: shuffle(choices) };
    });
  }
  function makeLook() {
    var groups = shuffle(LOOKALIKE.filter(function (g) { return g.filter(function (x) { return BY_ID[x]; }).length >= 2; })).slice(0, QN);
    while (groups.length < QN) groups.push(pick(LOOKALIKE));
    return groups.map(function (g) {
      var two = shuffle(g.filter(function (x) { return BY_ID[x]; })).slice(0, 2);
      var ans = pick(two);
      return { ans: ans, choices: two };
    });
  }

  /* ---------- クイズ画面 ---------- */
  var qBtns = Array.prototype.slice.call(document.querySelectorAll('#q-grid .rail-btn'));
  function startGame(mode) {
    game = { mode: mode, qs: mode === 'quiz' ? makeQuiz() : makeLook(), i: 0, score: 0, sel: 0, answered: false };
    show(mode);
    hudMode.textContent = mode === 'quiz' ? '❓ 国旗クイズ' : '👀 そっくり国旗';
    renderQ();
  }
  function renderQ() {
    var q = game.qs[game.i];
    hudRight.textContent = (game.i + 1) + ' / ' + QN + '　⭐ ' + game.score;
    game.sel = 0; game.answered = false;
    if (game.mode === 'quiz') {
      drawFlag($('quiz-canvas'), BY_ID[q.ans], 420, 280);
      $('q-ask').textContent = 'この国旗はどこの国？';
      qBtns.forEach(function (b, i) { b.textContent = BY_ID[q.choices[i]].ja; b.className = 'rail-btn' + (i === 0 ? ' cur' : ''); });
      setHint('←→↑↓ でえらんで タップ');
    } else {
      $('l-ask').textContent = '『' + BY_ID[q.ans].ja + '』の国旗はどっち？';
      lCards.forEach(function (c, i) { drawFlag(c.querySelector('canvas'), BY_ID[q.choices[i]], 250, 170); c.className = 'l-card' + (i === 0 ? ' cur' : ''); c.querySelector('.l-lbl').textContent = i === 0 ? '◀' : '▶'; });
      var fb = $('l-fb'); fb.textContent = ''; fb.className = 'l-fb';
      setHint('←→ でえらんで タップ');
    }
  }
  var lCards = Array.prototype.slice.call(document.querySelectorAll('.l-card'));
  function answer() {
    var q = game.qs[game.i], chosen = q.choices[game.sel], ok = chosen === q.ans;
    game.answered = true;
    if (ok) game.score++;
    hudRight.textContent = (game.i + 1) + ' / ' + QN + '　⭐ ' + game.score;
    if (game.mode === 'quiz') {
      qBtns.forEach(function (b, i) {
        b.classList.remove('cur');
        if (q.choices[i] === q.ans) b.classList.add('ok');
        else if (i === game.sel) b.classList.add('ng');
      });
      $('q-ask').textContent = ok ? '⭕ せいかい！' : '❌ ざんねん… 正解は「' + BY_ID[q.ans].ja + '」';
    } else {
      lCards.forEach(function (c, i) {
        c.classList.remove('cur');
        if (q.choices[i] === q.ans) c.classList.add('ok'); else if (i === game.sel) c.classList.add('ng');
        c.querySelector('.l-lbl').textContent = BY_ID[q.choices[i]].ja;
      });
      var fb = $('l-fb'); fb.textContent = ok ? '⭕ せいかい！' : '❌ ざんねん…'; fb.className = 'l-fb ' + (ok ? 'ok' : 'ng');
    }
    setHint(game.i + 1 < QN ? 'タップで つぎの問題 ▶' : 'タップで けっかを見る ▶', true);
  }
  function nextQ() {
    game.i++;
    if (game.i >= QN) return toResult();
    renderQ();
  }

  /* ---------- 結果 ---------- */
  var resBtns = Array.prototype.slice.call(document.querySelectorAll('#result .rail-btn'));
  function toResult() {
    var b = loadBest(), key = game.mode, isBest = b[key] == null || game.score > b[key];
    if (isBest) { b[key] = game.score; saveBest(b); }
    $('r-title').textContent = game.score === QN ? '🏆 パーフェクト！' : game.score >= 7 ? '🎉 すごい！' : game.score >= 4 ? '👍 いいかんじ' : '📖 ずかんで復習しよう';
    $('r-score').textContent = game.score + ' / ' + QN;
    $('r-sub').textContent = (isBest ? '🆕 ベスト更新！　' : '') + 'ベスト ' + b[key] + ' / ' + QN;
    resIdx = 0; setCur(resBtns, 0);
    show('result');
    hudRight.textContent = '';
    setHint('↑↓ でえらんで タップ');
  }

  /* ---------- あそびかた ---------- */
  function toHelp() { show('help'); hudMode.textContent = '💡 あそびかた'; hudRight.textContent = ''; setHint('タップで とじる'); }

  /* =====================================================================
     入力
     ===================================================================== */
  function onKey(e) {
    var k = e.key;
    if (k === 'Escape') { // PC確認用の補助のみ
      if (state !== 'title') toTitle();
      e.preventDefault(); return;
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].indexOf(k) < 0) return;
    e.preventDefault();
    var tap = k === 'Enter' || k === ' ';
    if (state === 'title') {
      if (k === 'ArrowUp') menuIdx = (menuIdx + menuBtns.length - 1) % menuBtns.length;
      else if (k === 'ArrowDown') menuIdx = (menuIdx + 1) % menuBtns.length;
      else if (tap) { menuAct(menuIdx); return; }
      setCur(menuBtns, menuIdx);
    } else if (state === 'help') {
      if (tap) toTitle();
    } else if (state === 'book') {
      if (k === 'ArrowRight') bookIdx = (bookIdx + 1) % F.length;
      else if (k === 'ArrowLeft') bookIdx = (bookIdx + F.length - 1) % F.length;
      else if (k === 'ArrowDown') jumpRegion(1);
      else if (k === 'ArrowUp') jumpRegion(-1);
      else if (tap) { toTitle(); return; }
      renderBook();
    } else if (state === 'quiz') {
      if (game.answered) { if (tap) nextQ(); return; }
      if (tap) return answer();
      var r = game.sel >> 1, c = game.sel & 1;
      if (k === 'ArrowLeft' || k === 'ArrowRight') c ^= 1;
      else if (k === 'ArrowUp' || k === 'ArrowDown') r ^= 1;
      game.sel = r * 2 + c; setCur(qBtns, game.sel);
    } else if (state === 'look') {
      if (game.answered) { if (tap) nextQ(); return; }
      if (tap) return answer();
      if (k === 'ArrowLeft' || k === 'ArrowRight') { game.sel ^= 1; setCur(lCards, game.sel); }
    } else if (state === 'result') {
      if (k === 'ArrowUp' || k === 'ArrowDown') { resIdx ^= 1; setCur(resBtns, resIdx); }
      else if (tap) { if (resIdx === 0) startGame(game.mode); else toTitle(); }
    }
  }
  function menuAct(i) {
    if (i === 0) toBook(); else if (i === 1) startGame('quiz'); else if (i === 2) startGame('look'); else toHelp();
  }
  document.addEventListener('keydown', onKey);

  // PC確認用: クリックでも操作できるようにする（グラスではタップ＝Enter）
  menuBtns.forEach(function (b, i) { b.addEventListener('click', function () { menuIdx = i; menuAct(i); }); });
  qBtns.forEach(function (b, i) { b.addEventListener('click', function () { if (state !== 'quiz') return; if (game.answered) return nextQ(); game.sel = i; setCur(qBtns, i); answer(); }); });
  lCards.forEach(function (c, i) { c.addEventListener('click', function () { if (state !== 'look') return; if (game.answered) return nextQ(); game.sel = i; setCur(lCards, i); answer(); }); });
  resBtns.forEach(function (b, i) { b.addEventListener('click', function () { resIdx = i; onKey({ key: 'Enter', preventDefault: function () {} }); }); });
  screens.help.addEventListener('click', toTitle);
  screens.book.addEventListener('click', function (e) { if (e.clientX > 400) bookIdx = (bookIdx + 1) % F.length; else if (e.clientX < 200) bookIdx = (bookIdx + F.length - 1) % F.length; else return toTitle(); renderBook(); });

  toTitle();
})();
