import type { UIText } from './types'

export const ja: UIText = {
  sweepLabel: 'S.W.E.E.P. 行動評価システム',
  title: 'WBTI',
  subtitlePart1: '衛戍プロトコル ',
  subtitleEm: '依存度',
  subtitlePart2: ' テスト',
  stats: ['25 人格タイプ', '15 次元分析', '30 問評価'],
  startBtn: '評価開始',
  footerQuotePart1: '"... ',
  footerQuoteEm: 'でもいい',
  footerQuotePart2: '"',
  version: 'v1.0.0',

  gateLabel: '🔒 ゲート問題',
  triggerLabel: '⚡ トリガー問題',
  keyboardHint: 'A / B / C キーで素早く回答',

  reportLabel: 'S.W.E.E.P. 評価レポート',
  matchLabel: '一致度',
  dimensionTitle: '15次元人格分析',
  dimLevels: ['高', '中', '低'],
  top3Title: 'TOP 3 マッチ',
  shareBtn: '📤 結果をシェア',
  retryBtn: '🔄 もう一度診断',
  shareText: (name, emoji, slogan, similarity) =>
    `WBTI衛戍プロトコル依存度テストの結果は【${emoji} ${name}】${slogan}一致度${similarity}%！あなたはどのタイプ？🛡️`,
  copiedToast: 'クリップボードにコピーしました！',
  copyFailToast: '手動でコピーしてください',

  loading: 'ローディング...',

  dimLabels: {
    A1: '依存・中毒度', A2: '依存・真剣度', A3: '依存・探究度',
    S1: '社交・マルチ度', S2: '社交・リーダー度', S3: '社交・対抗度',
    T1: '戦略・計画度', T2: '戦略・ギャンブル度', T3: '戦略・柔軟度',
    E1: '感情・推し度', E2: '感情・課金度', E3: '感情・収集度',
    G1: 'スタイル・革新度', G2: 'スタイル・効率度', G3: 'スタイル・反骨度',
  },

  modelNames: {
    A: '依存モデル', S: 'ソーシャルモデル', T: '戦略モデル', E: '感情モデル', G: 'スタイルモデル',
  },

  groupNames: {
    gan: '【ガチ勢探索組】', yun: '【ランク上位組】', gao: '【イチャイチャ社交組】',
    chu: '【推し活課金組】', fan: '【逆張り整活組】', bai: '【サボり組】',
  },

  langSwitchLabel: '日',
  langSwitchTarget: '中',
  langSwitchPath: '/',
}
