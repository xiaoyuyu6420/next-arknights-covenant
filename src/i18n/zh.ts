import type { UIText } from './types'

export const zh: UIText = {
  sweepLabel: 'S.W.E.E.P. 行为评估系统',
  title: 'WBTI',
  subtitlePart1: '卫戍协议 ',
  subtitleEm: '重度依赖',
  subtitlePart2: ' 测试',
  stats: ['25 人格类型', '15 维度分析', '30 题评估'],
  startBtn: '启动评估',
  footerQuotePart1: '"... ',
  footerQuoteEm: '也好',
  footerQuotePart2: '"',
  version: 'v1.0.0',

  gateLabel: '🔒 门控题',
  triggerLabel: '⚡ 触发题',
  keyboardHint: '按 A / B / C 快速作答',

  reportLabel: 'S.W.E.E.P. 评估报告',
  matchLabel: '匹配度',
  dimensionTitle: '十五维人格分析',
  dimLevels: ['高', '中', '低'],
  top3Title: 'TOP 3 匹配',
  shareBtn: '📤 分享结果',
  retryBtn: '🔄 重新测试',
  shareText: (name, emoji, slogan, similarity) =>
    `我在WBTI卫戍协议重度依赖测试中的结果是【${emoji} ${name}】${slogan}匹配度${similarity}%！快来测测你是哪种重度依赖？🛡️`,
  copiedToast: '已复制到剪贴板，快去分享吧！',
  copyFailToast: '请手动复制分享',

  loading: 'LOADING...',

  dimLabels: {
    A1: '沉迷·依赖度', A2: '沉迷·认真度', A3: '沉迷·探索度',
    S1: '社交·联机度', S2: '社交·带队度', S3: '社交·对抗度',
    T1: '策略·规划度', T2: '策略·赌徒度', T3: '策略·灵活度',
    E1: '情感·本命度', E2: '情感·消费度', E3: '情感·收集度',
    G1: '风格·创新度', G2: '风格·效率度', G3: '风格·叛逆度',
  },

  modelNames: {
    A: '沉迷模型', S: '社交模型', T: '策略模型', E: '情感模型', G: '风格模型',
  },

  groupNames: {
    gan: '【肝帝探索组】', yun: '【上分运营组】', gao: '【搞事社交组】',
    chu: '【厨力氪金组】', fan: '【叛逆整活组】', bai: '【摆烂摸鱼组】',
  },

  langSwitchLabel: '中',
  langSwitchTarget: '日',
  langSwitchPath: '/ja',
}
