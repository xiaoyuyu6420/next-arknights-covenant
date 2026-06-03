'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DIM_ORDER, VECTOR_VALUE, type PersonalityType, type SpecialType } from '@/lib/quiz-data'
import { ParticleCanvas } from './ParticleCanvas'
import { ConfettiEffect } from './ConfettiEffect'
import { SimilarityRing } from './SimilarityRing'
import { MemeCarousel } from './MemeCarousel'
import type { UIText } from '@/i18n/types'

// ==========================================
// Types
// ==========================================
type Screen = 'welcome' | 'test' | 'result'

interface GateOption { label: string; value: string; trigger?: string }
interface QuizQuestionBase {
  type: 'regular' | 'gate' | 'trigger'
  dim: string
  text: string
  options: Question['options'] | GateOption[]
}

interface QuizResult {
  type: PersonalityType | SpecialType
  similarity: number
  isSpecial: boolean
  userVector: string
  matchList?: (PersonalityType & { distance: number; similarity: number })[]
}

interface ApiQuizData {
  questions: { dim: string; text: string; options: { label: string; score: number }[] }[]
  gateQuestion: { text: string; options: { label: string; value: string }[] } | null
  triggerQuestion: { text: string; options: { label: string; value: string; trigger?: string }[] } | null
  types: PersonalityType[]
  specialTypes: SpecialType[]
}

function getOrCreateUserId(): string {
  try {
    let id = localStorage.getItem('wbti-user-id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('wbti-user-id', id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

const glassStyle = {
  background: 'rgba(10, 16, 30, 0.55)',
  backdropFilter: 'blur(48px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(48px) saturate(1.5)',
  border: '1px solid rgba(0, 221, 179, 0.12)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 12px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 0.5px rgba(0,221,179,0.06)',
}

// ==========================================
// Welcome Screen
// ==========================================
function WelcomeScreen({ onStart, text }: { onStart: () => void; text: UIText }) {
  return (
    <div className="flex w-full min-h-screen relative z-[2] items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[560px] flex items-stretch">
        <motion.div
          className="w-full rounded-3xl p-6 sm:p-9 flex flex-col relative overflow-hidden wbti-scanline wbti-grid-overlay"
          style={glassStyle}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.2)] to-transparent pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ background: 'linear-gradient(180deg, rgba(0,221,179,0.03) 0%, transparent 30%)' }} />
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(0,221,179,0.15)' }} />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(0,221,179,0.15)' }} />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(0,221,179,0.15)' }} />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(0,221,179,0.15)' }} />

          {/* Language Switch */}
          <motion.a
            href={text.langSwitchPath}
            className="absolute top-3.5 right-12 z-10 text-[0.55rem] tracking-[1.5px] px-2.5 py-0.5 rounded-full transition-all duration-200 hover:opacity-100 no-underline"
            style={{ fontFamily: 'var(--font-tech)', background: 'rgba(0,221,179,0.08)', border: '1px solid rgba(0,221,179,0.15)', color: 'var(--wbti-accent)', opacity: 0.7 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 }}
            whileHover={{ opacity: 1 }}
          >
            {text.langSwitchTarget}
          </motion.a>

          <div className="flex-1 flex flex-col justify-center text-left py-6 sm:py-8 px-0 relative z-[1]">
            <motion.div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.62rem] tracking-[2.5px] uppercase mb-6 sm:mb-7 w-fit font-medium"
              style={{ background: 'rgba(0,221,179,0.06)', border: '1px solid rgba(0,221,179,0.1)', color: 'var(--wbti-accent)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="w-[5px] h-[5px] rounded-full animate-pulse" style={{ background: 'var(--wbti-accent)', boxShadow: '0 0 8px var(--wbti-accent-glow)' }} />
              {text.sweepLabel}
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}>
              <MemeCarousel />
            </motion.div>

            <motion.h1
              className="text-[3rem] sm:text-[4.8rem] font-black tracking-[5px] sm:tracking-[10px] leading-none mb-2.5 wbti-glow-text"
              style={{ fontFamily: 'var(--font-tech)', background: 'linear-gradient(135deg, var(--wbti-accent) 0%, #00e8c0 40%, #00b8d4 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {text.title}
            </motion.h1>

            <motion.h2
              className="text-[0.95rem] sm:text-[1.05rem] tracking-wider mb-2 font-light"
              style={{ fontFamily: 'var(--font-main)', color: 'var(--wbti-text-2)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {text.subtitlePart1}<em className="not-italic" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--wbti-text)', fontWeight: 400 }}>{text.subtitleEm}</em>{text.subtitlePart2}
            </motion.h2>

            <motion.div
              className="flex items-center gap-4 mb-5 text-[0.62rem] tracking-wider"
              style={{ color: 'var(--wbti-text-3)', fontFamily: 'var(--font-tech)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {text.stats.map((s, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full" style={{ background: i === 0 ? 'var(--wbti-accent)' : i === 1 ? 'var(--wbti-warm)' : '#00b8d4' }} />
                  {s}
                </span>
              ))}
            </motion.div>

            <motion.button
              onClick={onStart}
              className="inline-flex items-center gap-3.5 px-7 sm:px-9 py-3.5 sm:py-[15px] rounded-full cursor-pointer border-none w-fit z-[1] uppercase font-bold tracking-[2.5px] text-[0.78rem] sm:text-[0.82rem] transition-all duration-300 self-center sm:self-auto"
              style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-bg)', background: 'linear-gradient(135deg, var(--wbti-accent) 0%, #00c9a7 50%, #00b8d4 100%)', backgroundSize: '200% 200%', animation: 'gradientShift 4s ease-in-out infinite', boxShadow: '0 4px 24px rgba(0,221,179,0.25), inset 0 1px 0 rgba(255,255,255,0.2)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,221,179,0.35), 0 2px 12px rgba(0,221,179,0.2), inset 0 1px 0 rgba(255,255,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,221,179,0.25), inset 0 1px 0 rgba(255,255,255,0.2)' }}
            >
              <span>{text.startBtn}</span>
              <span className="w-[26px] h-[26px] rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.12)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </motion.button>
          </div>

          <motion.div
            className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.06)] relative z-[1] hidden sm:flex sm:items-center sm:justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-[0.82rem] italic" style={{ color: 'var(--wbti-text-3)' }}>
              {text.footerQuotePart1}<em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--wbti-text)', fontWeight: 400 }}>{text.footerQuoteEm}</em>{text.footerQuotePart2}
            </p>
            <span className="text-[0.55rem] tracking-[1.5px]" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }}>{text.version}</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// ==========================================
// Test Screen
// ==========================================
function TestScreen({ currentQuestion, totalQuestions, question, onAnswer, companionEmoji, companionImg, text }: {
  currentQuestion: number; totalQuestions: number; question: QuizQuestionBase | null;
  onAnswer: (qIdx: number, value: number | string) => void; companionEmoji: string; companionImg: string; text: UIText
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)
  const [prevQ, setPrevQ] = useState(currentQuestion)
  if (currentQuestion !== prevQ) {
    setDirection(currentQuestion > prevQ ? 1 : -1)
    setSelectedIdx(null)
    setPrevQ(currentQuestion)
  }

  if (!question) return null

  const progress = (currentQuestion / totalQuestions) * 100
  const isGate = question.type === 'gate'
  const isTrigger = question.type === 'trigger'
  const handleSelect = (idx: number, value: number | string) => {
    if (selectedIdx !== null) return
    setSelectedIdx(idx)
    setTimeout(() => onAnswer(currentQuestion, value), 300)
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <div className="max-w-[580px] w-full p-4 sm:p-6 mx-auto flex flex-col justify-center min-h-screen">
      <div className="w-full h-[3px] rounded-full mb-5 overflow-visible relative" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          className="h-full rounded-full relative"
          style={{ background: 'linear-gradient(90deg, var(--wbti-accent-soft), var(--wbti-accent), #00e8c0)', boxShadow: '0 0 12px var(--wbti-accent-glow)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: 'var(--wbti-accent)', boxShadow: '0 0 10px var(--wbti-accent-glow), 0 0 20px var(--wbti-accent-glow)' }} />
        </motion.div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="text-[0.72rem] tracking-[3px] font-normal" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }}>
            <span style={{ color: 'var(--wbti-accent)', fontWeight: 700 }}>{currentQuestion + 1}</span> / {totalQuestions}
          </div>
        </div>
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
          style={{ border: '1.5px solid var(--wbti-border-accent)', background: 'rgba(0,221,179,0.04)', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
          key={companionImg || companionEmoji}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {companionImg ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={companionImg} alt="companion" className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-xl">{companionEmoji}</span>
          )}
        </motion.div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestion}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-7 sm:p-10 sm:px-8 wbti-scanline"
          style={glassStyle}
        >
          <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.25)] to-transparent pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,221,179,0.03) 0%, transparent 100%)' }} />

          {(isGate || isTrigger) && (
            <motion.div className="text-center mb-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <span className="text-[0.55rem] tracking-[2px] uppercase px-3 py-1 rounded-full" style={{
                background: isGate ? 'rgba(0,221,179,0.1)' : 'rgba(232,168,56,0.1)',
                border: isGate ? '1px solid rgba(0,221,179,0.2)' : '1px solid rgba(232,168,56,0.2)',
                color: isGate ? 'var(--wbti-accent)' : 'var(--wbti-warm)',
                fontFamily: 'var(--font-tech)',
              }}>
                {isGate ? text.gateLabel : text.triggerLabel}
              </span>
            </motion.div>
          )}

          <h2 className="text-[1rem] sm:text-[1.08rem] font-medium leading-[1.9] text-center mb-7 relative z-[1]" style={{ color: 'var(--wbti-text)' }}>
            {question.text}
          </h2>

          <div className="flex flex-col gap-2.5 relative z-[1]">
            {question.options.map((opt, i) => {
              const isRegularOpt = 'score' in opt
              const label = opt.label
              const isSelected = selectedIdx === i
              const letter = String.fromCharCode(65 + i)

              return (
                <motion.button
                  key={`${currentQuestion}-${i}`}
                  onClick={() => handleSelect(i, isRegularOpt ? (opt as { score: number }).score : (opt as GateOption).value)}
                  className={`relative flex items-center gap-3.5 py-3.5 sm:py-4 px-4 sm:px-5 rounded-xl cursor-pointer text-left transition-all duration-300 overflow-hidden ${isGate || isTrigger ? 'justify-center' : ''}`}
                  style={{
                    background: isSelected ? 'rgba(0,221,179,0.1)' : 'rgba(255,255,255,0.025)',
                    border: isSelected ? '1.5px solid var(--wbti-accent)' : '1.5px solid rgba(255,255,255,0.06)',
                    color: isSelected ? 'var(--wbti-text)' : 'var(--wbti-text-2)',
                    boxShadow: isSelected ? '0 0 20px rgba(0,221,179,0.1), inset 0 0 0 0.5px rgba(0,221,179,0.2)' : 'none',
                    fontFamily: 'var(--font-main)',
                    fontSize: '0.86rem',
                    lineHeight: 1.7,
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, scale: isSelected ? 0.98 : 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                  whileHover={!isSelected ? { scale: 1.01, backgroundColor: 'rgba(0,221,179,0.04)' } : {}}
                  whileTap={!isSelected ? { scale: 0.98 } : {}}
                >
                  {!isGate && !isTrigger && (
                    <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[0.58rem] font-bold transition-all duration-300 z-[1]" style={{ fontFamily: 'var(--font-tech)', border: isSelected ? '1.5px solid var(--wbti-accent)' : '1.5px solid rgba(255,255,255,0.1)', background: isSelected ? 'var(--wbti-accent)' : 'transparent', color: isSelected ? 'var(--wbti-bg)' : 'var(--wbti-text-3)', boxShadow: isSelected ? '0 0 12px rgba(0,221,179,0.3)' : 'none' }}>
                      {letter}
                    </span>
                  )}
                  <span className={`flex-1 z-[1] ${isGate || isTrigger ? 'text-center font-medium' : ''}`}>
                    {label}
                  </span>
                  {isSelected && (
                    <motion.span className="shrink-0 z-[1]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--wbti-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="text-center mt-4 text-[0.6rem] tracking-wider"
        style={{ color: 'var(--wbti-text-3)', fontFamily: 'var(--font-tech)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {!isGate && !isTrigger && text.keyboardHint}
      </motion.div>
    </div>
  )
}

// ==========================================
// Result Screen (TopMatches included)
// ==========================================
function TopMatches({ matchList, topCode, text }: { matchList: (PersonalityType & { distance: number; similarity: number })[]; topCode: string; text: UIText }) {
  const top3 = matchList?.slice(0, 3) ?? []
  if (top3.length === 0) return null

  return (
    <motion.div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl mb-6 relative z-[1] overflow-hidden" style={glassStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5 }}>
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.15)] to-transparent pointer-events-none" />
      <div className="text-center font-semibold tracking-[3px] text-[0.6rem] uppercase mb-5" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }}>
        {text.top3Title}
      </div>
      <div className="flex flex-col gap-3">
        {top3.map((match, i) => (
          <motion.div key={match.code} className="flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-200" style={{ background: match.code === topCode ? 'rgba(0,221,179,0.06)' : 'transparent', border: match.code === topCode ? '1px solid rgba(0,221,179,0.12)' : '1px solid transparent' }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}>
            <span className="text-[0.62rem] font-bold min-w-[18px]" style={{ fontFamily: 'var(--font-tech)', color: i === 0 ? 'var(--wbti-accent)' : 'var(--wbti-text-3)' }}>#{i + 1}</span>
            <span className="w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden">
              {'img' in match && match.img ? (/* eslint-disable-next-line @next/next/no-img-element */<img src={`/${(match as PersonalityType).img.replace(/^img\//, '')}`} alt="" className="w-6 h-6 object-contain" />) : (<span className="text-xl">{match.emoji}</span>)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[0.78rem] font-semibold truncate" style={{ color: match.code === topCode ? match.color : 'var(--wbti-text-2)' }}>{match.name}</span>
                <span className="text-[0.55rem] tracking-wider shrink-0" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }}>{match.code}</span>
              </div>
              <div className="mt-1.5 w-full h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${match.color}80, ${match.color})` }} initial={{ width: 0 }} animate={{ width: `${match.similarity}%` }} transition={{ delay: 1.6 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>
            <span className="text-[0.72rem] font-bold shrink-0" style={{ fontFamily: 'var(--font-tech)', color: match.color }}>{match.similarity}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ResultScreen({ result, onRetry, text, locale }: { result: QuizResult; onRetry: () => void; text: UIText; locale: string }) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(true)
  const top = result.type
  const vecLabels = result.userVector.split('-').join('').split('')

  useEffect(() => { const t = setTimeout(() => setShowConfetti(false), 5000); return () => clearTimeout(t) }, [])

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('wbti-history') || '[]')
      history.unshift({ type: top.code, name: top.name, emoji: top.emoji, similarity: result.similarity, vector: result.userVector, timestamp: Date.now() })
      if (history.length > 5) history.length = 5
      localStorage.setItem('wbti-history', JSON.stringify(history))
    } catch { /* localStorage not available */ }
  }, [top.code, top.name, top.emoji, result.similarity, result.userVector])

  const handleShare = useCallback(async () => {
    const shareTextContent = text.shareText(top.name, top.emoji, top.slogan, result.similarity)
    const url = location.href
    if (navigator.share) {
      try { await navigator.share({ title: 'WBTI', text: shareTextContent, url }) } catch { /* cancelled */ }
    } else if (navigator.clipboard) {
      try { await navigator.clipboard.writeText(shareTextContent + '\n' + url); setToastMsg(text.copiedToast) } catch { setToastMsg(text.copyFailToast) }
    }
  }, [top, result.similarity, text])

  useEffect(() => { if (toastMsg) { const t = setTimeout(() => setToastMsg(null), 2500); return () => clearTimeout(t) } }, [toastMsg])

  const groupName = ('group' in top && top.group) ? text.groupNames[top.group as keyof typeof text.groupNames] : null

  return (
    <div className="max-w-[540px] w-full p-4 sm:p-6 overflow-y-auto max-h-screen mx-auto pb-12 no-scrollbar">
      {showConfetti && <ConfettiEffect color={top.color} />}

      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="inline-flex items-center gap-1.5 px-[18px] py-1.5 rounded-full" style={{ background: 'var(--wbti-accent-dim)', border: '1px solid var(--wbti-border-accent)', fontFamily: 'var(--font-tech)', fontSize: '0.6rem', letterSpacing: '2.5px', color: 'var(--wbti-accent)' }}>
          <span className="w-1 h-1 rounded-full" style={{ background: 'var(--wbti-accent)', boxShadow: '0 0 6px var(--wbti-accent-glow)' }} />
          {text.reportLabel}
        </div>
      </motion.div>

      <motion.div className="relative overflow-hidden rounded-2xl sm:rounded-3xl text-center mb-6 wbti-scanline" style={{ ...glassStyle, padding: '36px 24px sm:44px 32px 36px' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}>
        <div className="absolute -inset-1/2 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${top.color}25 0%, transparent 55%)`, animation: 'cardGlowPulse 5s ease-in-out infinite' }} />
        <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.25)] to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 w-5 h-5 border-t border-l pointer-events-none" style={{ borderColor: `${top.color}25` }} />
        <div className="absolute top-4 right-4 w-5 h-5 border-t border-r pointer-events-none" style={{ borderColor: `${top.color}25` }} />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l pointer-events-none" style={{ borderColor: `${top.color}25` }} />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r pointer-events-none" style={{ borderColor: `${top.color}25` }} />

        <motion.div className="mx-auto mb-5" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}>
          <SimilarityRing similarity={result.similarity} color={top.color} text={text} />
        </motion.div>

        <motion.div className="relative z-[1] mb-1.5 font-black tracking-[4px] text-[1rem] sm:text-[1.1rem]" style={{ fontFamily: 'var(--font-tech)', color: top.color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>{top.code}</motion.div>
        <motion.div className="relative z-[1] mb-1 font-normal tracking-[1.5px] text-[0.55rem] opacity-40" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>{result.userVector}</motion.div>
        {groupName && (
          <motion.div className="relative z-[1] mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <span className="text-[0.5rem] tracking-[1.5px] px-2.5 py-0.5 rounded-full" style={{ background: `${top.color}10`, border: `1px solid ${top.color}20`, color: `${top.color}cc`, fontFamily: 'var(--font-tech)' }}>{groupName}</span>
          </motion.div>
        )}
        <motion.h2 className="relative z-[1] mb-4 font-black tracking-[2px] text-[1.5rem] sm:text-[1.8rem]" style={{ color: top.color }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>{top.name}</motion.h2>
        <motion.p className="relative z-[1] mb-6 leading-[2] text-[0.82rem] sm:text-[0.85rem] max-w-[400px] mx-auto" style={{ color: 'var(--wbti-text-2)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>{top.desc}</motion.p>
        <motion.p className="relative z-[1] italic text-[0.82rem] pt-5 border-t border-[rgba(255,255,255,0.06)] inline-block" style={{ color: 'var(--wbti-text-3)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>{top.slogan}</motion.p>
      </motion.div>

      {/* Dimension Display */}
      <motion.div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl mb-6 relative z-[1] overflow-hidden" style={glassStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.15)] to-transparent pointer-events-none" />
        <div className="text-center font-semibold tracking-[3px] text-[0.6rem] uppercase mb-6" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }}>{text.dimensionTitle}</div>
        {DIM_ORDER.reduce<{ id: string; dims: string[] }[]>((acc, d) => {
          const modelId = d[0]
          const last = acc[acc.length - 1]
          if (last && last.id === modelId) { last.dims.push(d) } else { acc.push({ id: modelId, dims: [d] }) }
          return acc
        }, []).map((model, modelIdx) => {
          const dimStart = modelIdx * 3
          return (
            <div key={model.id} className="mb-5 last:mb-0">
              <div className="text-[0.72rem] font-semibold tracking-[1.5px] mb-2.5 pl-0.5 opacity-70 flex items-center gap-2" style={{ color: 'var(--wbti-accent)' }}>
                {text.modelNames[model.id] || model.id}
                <span className="flex-1 h-px bg-gradient-to-r from-[var(--wbti-border-accent)] to-transparent" />
              </div>
              {model.dims.map((dimCode, dimIdx) => {
                const vecIdx = dimStart + dimIdx
                const val = vecLabels[vecIdx] === 'H' ? 2 : vecLabels[vecIdx] === 'M' ? 1 : 0
                const dimName = text.dimLabels[dimCode] || dimCode
                const level = text.dimLevels[val]
                const cls = val === 2 ? 'h' : val === 1 ? 'm' : 'l'
                const pct = val === 2 ? 100 : val === 1 ? 60 : 25
                return (
                  <motion.div key={dim} className="flex items-center gap-3 py-[7px] px-1 transition-all duration-200 hover:pl-2 rounded-md" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + (modelIdx * 3 + dimIdx) * 0.04, duration: 0.3 }}>
                    <span className="text-[0.72rem] sm:text-[0.74rem] min-w-[68px] sm:min-w-[76px] shrink-0 whitespace-nowrap" style={{ color: 'var(--wbti-text-2)' }}>{dimName}</span>
                    <div className="flex-1 h-1.5 rounded-sm overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <motion.div className="h-full rounded-sm" style={{ background: cls === 'h' ? 'linear-gradient(90deg, var(--wbti-accent-soft), var(--wbti-accent))' : cls === 'm' ? 'linear-gradient(90deg, rgba(232,168,56,0.6), var(--wbti-warm))' : 'rgba(74,84,106,0.4)', boxShadow: cls === 'h' ? '0 0 8px rgba(0,221,179,0.2)' : cls === 'm' ? '0 0 6px rgba(232,168,56,0.1)' : 'none' }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 1.2 + (modelIdx * 3 + dimIdx) * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                    </div>
                    <span className="text-[0.62rem] font-bold min-w-[22px] text-right tracking-wider" style={{ fontFamily: 'var(--font-tech)', color: cls === 'h' ? 'var(--wbti-accent)' : cls === 'm' ? 'var(--wbti-warm)' : 'var(--wbti-text-3)', textShadow: cls === 'h' ? '0 0 8px rgba(0,221,179,0.3)' : 'none' }}>{level}</span>
                  </motion.div>
                )
              })}
            </div>
          )
        })}
      </motion.div>

      {result.matchList && <TopMatches matchList={result.matchList} topCode={top.code} text={text} />}

      <motion.div className="flex flex-col sm:flex-row gap-3 justify-center mb-7" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.4 }}>
        <motion.button onClick={handleShare} className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-[0.8rem] font-semibold cursor-pointer transition-all duration-300 tracking-wide border border-transparent" style={{ background: 'linear-gradient(135deg, var(--wbti-accent) 0%, #00c9a7 50%, #00b8d4 100%)', backgroundSize: '200% 200%', color: 'var(--wbti-bg)', boxShadow: '0 4px 20px rgba(0,221,179,0.2), inset 0 1px 0 rgba(255,255,255,0.15)' }} whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,221,179,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }} onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,221,179,0.2), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
          {text.shareBtn}
        </motion.button>
        <motion.button onClick={onRetry} className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-[0.8rem] font-medium cursor-pointer transition-all duration-300 tracking-wide" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--wbti-border-accent)', color: 'var(--wbti-text-2)' }} whileHover={{ scale: 1.03, y: -3, borderColor: 'var(--wbti-accent)', color: 'var(--wbti-accent)' }} whileTap={{ scale: 0.97 }}>
          {text.retryBtn}
        </motion.button>
      </motion.div>

      {toastMsg && (
        <motion.div className="fixed bottom-10 left-1/2 -translate-x-1/2 py-3 px-7 rounded-full text-[0.82rem] z-[200] tracking-wide" style={{ background: 'rgba(10,14,24,0.92)', backdropFilter: 'blur(16px) saturate(1.3)', border: '1px solid rgba(0,221,179,0.15)', color: 'var(--wbti-text)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {toastMsg}
        </motion.div>
      )}
    </div>
  )
}

// ==========================================
// Main QuizApp Component
// ==========================================
export function QuizApp({ text, locale }: { text: UIText; locale: string }) {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestionBase[]>([])
  const [dimScores, setDimScores] = useState<Record<string, number>>(() => {
    const s: Record<string, number> = {}
    DIM_ORDER.forEach(d => { s[d] = 0 })
    return s
  })
  const [isTriggerGuide, setIsTriggerGuide] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [companionEmoji, setCompanionEmoji] = useState('')
  const [companionImg, setCompanionImg] = useState('')

  const [apiData, setApiData] = useState<ApiQuizData | null>(null)
  const apiDataRef = useRef<ApiQuizData | null>(null)
  const userIdRef = useRef<string>('')
  const questionsRef = useRef(questions)
  const dimScoresRef = useRef(dimScores)
  const currentQuestionRef = useRef(currentQuestion)
  const isTriggerGuideRef = useRef(isTriggerGuide)

  useEffect(() => { questionsRef.current = questions }, [questions])
  useEffect(() => { dimScoresRef.current = dimScores }, [dimScores])
  useEffect(() => { currentQuestionRef.current = currentQuestion }, [currentQuestion])
  useEffect(() => { isTriggerGuideRef.current = isTriggerGuide }, [isTriggerGuide])
  useEffect(() => { apiDataRef.current = apiData }, [apiData])

  useEffect(() => {
    fetch(`/api/quiz?locale=${locale}`)
      .then(r => r.json())
      .then((data: ApiQuizData) => { setApiData(data); apiDataRef.current = data })
      .catch(err => console.error('Failed to fetch quiz data:', err))
      .finally(() => setLoading(false))
    userIdRef.current = getOrCreateUserId()
  }, [locale])

  const companionPool = useMemo(() => apiData?.types.map(t => t.emoji) ?? [], [apiData])
  const companionImages = useMemo(() => [
    '/博士生气.png', '/博士紧张惊讶.png', '/博士疲惫睡着.png', '/彻底无语.png',
    '/彻底心动.png', '/流汗了.png', '/就这？.png', '/笑死.png', '/惊讶，啊？.png',
    '/双手合十对不起.png', '/爱了爱了.png', '/思考中.png', '/赞诶.png', '/遵命.png',
    '/好耶.png', '/酷酷的.png', '/大哭.png', '/满眼爱心.png', '/合作愉快.png',
    '/求安慰.png', '/气鼓鼓.png', '/眯眼软笑、脸颊鼓鼓，是温柔治愈.png',
  ], [])
  const randomEmoji = useCallback(() => companionPool[Math.floor(Math.random() * companionPool.length)], [companionPool])
  const randomCompanionImage = useCallback(() => companionImages[Math.floor(Math.random() * companionImages.length)], [companionImages])

  const buildQuestionList = useCallback(() => {
    const data = apiDataRef.current
    if (!data) return []
    const regular = [...data.questions]
    for (let i = regular.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[regular[i], regular[j]] = [regular[j], regular[i]]
    }
    const gatePos = 14 + Math.floor(Math.random() * 4)
    const gate: QuizQuestionBase = { type: 'gate', dim: '', text: data.gateQuestion?.text || '', options: data.gateQuestion?.options || [] }
    return [
      ...regular.slice(0, gatePos).map(q => ({ ...q, type: 'regular' as const })),
      gate,
      ...regular.slice(gatePos).map(q => ({ ...q, type: 'regular' as const })),
    ]
  }, [])

  const calculateResult = useCallback((scores: Record<string, number>, triggered: boolean): QuizResult => {
    const data = apiDataRef.current
    if (!data) return { type: { code: 'ERR', name: 'Error', group: '', emoji: '❌', color: '#FF0000', img: '', vector: '', desc: 'データ読み込み失敗', slogan: '' }, similarity: 0, isSpecial: true, userVector: '' }

    const userVec = DIM_ORDER.map(d => { const s = scores[d] || 0; return s <= 3 ? 0 : s >= 5 ? 2 : 1 })
    const vectorToCode = (vec: number[]) => vec.map(v => v === 0 ? 'L' : v === 1 ? 'M' : 'H').join('').match(/.{3}/g)!.join('-')
    const userVector = vectorToCode(userVec)

    if (triggered) {
      return { type: data.specialTypes.find(t => t.code === 'GLJL')!, similarity: 100, isSpecial: true, userVector }
    }

    const parseVectorStr = (str: string) => str.split('-').join('').split('').map(c => VECTOR_VALUE[c])
    const matchList = data.types.map(type => {
      const typeVec = parseVectorStr(type.vector)
      const distance = userVec.reduce((sum, v, i) => sum + Math.abs(v - typeVec[i]), 0)
      return { ...type, distance, similarity: Number(((1 - distance / 30) * 100).toFixed(1)) }
    })
    matchList.sort((a, b) => a.distance - b.distance || b.similarity - a.similarity)

    const best = matchList[0]
    if (best.similarity < 60) {
      return { type: data.specialTypes.find(t => t.code === 'MYLZ')!, similarity: best.similarity, isSpecial: true, userVector, matchList }
    }
    return { type: best, similarity: best.similarity, isSpecial: false, userVector, matchList }
  }, [])

  const handleStart = useCallback(() => {
    const newScores: Record<string, number> = {}
    DIM_ORDER.forEach(d => { newScores[d] = 0 })
    setDimScores(newScores); dimScoresRef.current = newScores
    setIsTriggerGuide(false); isTriggerGuideRef.current = false
    setCurrentQuestion(0); currentQuestionRef.current = 0
    const newQuestions = buildQuestionList()
    setQuestions(newQuestions); questionsRef.current = newQuestions
    setScreen('test')
    setCompanionEmoji(randomEmoji()); setCompanionImg(randomCompanionImage())
  }, [buildQuestionList, randomEmoji, randomCompanionImage])

  const handleAnswer = useCallback((qIdx: number, value: number | string) => {
    const currentQs = questionsRef.current
    const q = currentQs[qIdx]
    if (!q) return

    const newScores = { ...dimScoresRef.current }

    if (q.type === 'regular' && typeof value === 'number') {
      newScores[q.dim] = (newScores[q.dim] || 0) + value
      setDimScores(newScores); dimScoresRef.current = newScores
    } else if (q.type === 'gate' && typeof value === 'string') {
      if (value === 'guide') {
        const data = apiDataRef.current
        const trigger: QuizQuestionBase = { type: 'trigger', dim: '', text: data?.triggerQuestion?.text || '', options: data?.triggerQuestion?.options || [] }
        const newQuestions = [...currentQs]; newQuestions.splice(qIdx + 1, 0, trigger)
        setQuestions(newQuestions); questionsRef.current = newQuestions
      }
    } else if (q.type === 'trigger' && typeof value === 'string') {
      const data = apiDataRef.current
      const triggerOpt = data?.triggerQuestion?.options.find(o => o.value === value)
      if (triggerOpt && triggerOpt.trigger) { setIsTriggerGuide(true); isTriggerGuideRef.current = true }
    }

    const nextIdx = qIdx + 1
    const totalQs = questionsRef.current.length
    if (nextIdx < totalQs) {
      setCurrentQuestion(nextIdx); currentQuestionRef.current = nextIdx
      setCompanionEmoji(randomEmoji()); setCompanionImg(randomCompanionImage())
    } else {
      setCurrentQuestion(nextIdx); currentQuestionRef.current = nextIdx
      const res = calculateResult(dimScoresRef.current, isTriggerGuideRef.current)
      setResult(res)
      fetch('/api/results', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userIdRef.current, resultCode: res.type.code, resultName: res.type.name, similarity: res.similarity, userVector: res.userVector, isSpecial: res.isSpecial }),
      }).catch(() => {})
      setTimeout(() => setScreen('result'), 500)
    }
  }, [calculateResult, randomEmoji, randomCompanionImage])

  const handleRetry = useCallback(() => { setScreen('welcome'); setResult(null); setCurrentQuestion(0) }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (screen !== 'test') return
      const q = questions[currentQuestion]
      if (!q || q.type !== 'regular') return
      const keyIdx: Record<string, number> = { '1': 0, '2': 1, '3': 2, 'a': 0, 'b': 1, 'c': 2 }
      const idx = keyIdx[e.key.toLowerCase()]
      if (idx !== undefined && q.options[idx] && 'score' in q.options[idx]) {
        handleAnswer(currentQuestion, (q.options[idx] as { score: number }).score)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [screen, questions, currentQuestion, handleAnswer])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: 'var(--font-main)', background: 'var(--wbti-bg)', color: 'var(--wbti-text)' }}>
        <ParticleCanvas />
        <div className="relative z-[2] text-center">
          <div className="text-[0.8rem] tracking-[3px] animate-pulse" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)' }}>
            {text.loading}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: 'var(--font-main)', background: 'var(--wbti-bg)', color: 'var(--wbti-text)' }}>
      <ParticleCanvas />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0,221,179,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 90% 80%, rgba(0,100,180,0.03) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0,221,179,0.015) 0%, transparent 100%)' }} />
        <div className="absolute -inset-1/2 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(0,221,179,0.04) 0%, transparent 40%)', animation: 'ambientDrift 20s ease-in-out infinite' }} />
      </div>

      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <motion.div key="welcome" className="fixed inset-0 z-[1] overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <WelcomeScreen onStart={handleStart} text={text} />
          </motion.div>
        )}
        {screen === 'test' && (
          <motion.div key="test" className="fixed inset-0 z-[1] overflow-y-auto" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35 }}>
            <TestScreen currentQuestion={currentQuestion} totalQuestions={questions.length} question={questions[currentQuestion] || null} onAnswer={handleAnswer} companionEmoji={companionEmoji} companionImg={companionImg} text={text} />
          </motion.div>
        )}
        {screen === 'result' && result && (
          <motion.div key="result" className="fixed inset-0 z-[1] overflow-y-auto" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <ResultScreen result={result} onRetry={handleRetry} text={text} locale={locale} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
