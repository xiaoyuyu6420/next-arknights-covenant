export interface UIText {
  // Welcome Screen
  sweepLabel: string
  title: string
  subtitlePart1: string
  subtitleEm: string
  subtitlePart2: string
  stats: [string, string, string]
  startBtn: string
  footerQuotePart1: string
  footerQuoteEm: string
  footerQuotePart2: string
  version: string

  // Test Screen
  gateLabel: string
  triggerLabel: string
  keyboardHint: string

  // Result Screen
  reportLabel: string
  matchLabel: string
  dimensionTitle: string
  dimLevels: [string, string, string] // e.g. 高/中/低
  top3Title: string
  shareBtn: string
  retryBtn: string
  shareText: (name: string, emoji: string, slogan: string, similarity: number) => string
  copiedToast: string
  copyFailToast: string

  // Loading
  loading: string

  // Dimension labels (keyed by A1, A2, ... G3)
  dimLabels: Record<string, string>

  // Model names (keyed by A, S, T, E, G)
  modelNames: Record<string, string>

  // Group names (keyed by group id: gan, yun, gao, chu, fan, bai)
  groupNames: Record<string, string>

  // Language switch
  langSwitchLabel: string
  langSwitchTarget: string
  langSwitchPath: string
}
