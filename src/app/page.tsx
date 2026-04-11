'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { QUIZ_DATA, DIM_ORDER, VECTOR_VALUE, type Question, type PersonalityType, type SpecialType } from '@/lib/quiz-data'

// ==========================================
// Types
// ==========================================
type Screen = 'welcome' | 'test' | 'result'

interface QuizQuestion extends Question {
  type?: 'regular' | 'gate' | 'trigger'
  options: Question['options'] | { label: string; value: string; trigger?: string }[]
}

interface QuizResult {
  type: PersonalityType | SpecialType
  similarity: number
  isSpecial: boolean
  userVector: string
  matchList?: (PersonalityType & { distance: number; similarity: number })[]
}

// ==========================================
// Particle Canvas Component
// ==========================================
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const COUNT = 40
    const particles: { x: number; y: number; sz: number; vx: number; vy: number; o: number; baseO: number; phase: number; speed: number }[] = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        sz: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.2 + 0.05,
        baseO: 0,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.002,
      })
      particles[i].baseO = particles[i].o
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.phase += p.speed
        p.o = p.baseO * (0.5 + 0.5 * Math.sin(p.phase))
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 221, 179, ${p.o})`
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 221, 179, ${0.03 * (1 - d / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animationId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}

// ==========================================
// Meme Carousel Component
// ==========================================
function MemeCarousel() {
  const memeImgs = [
    '🎮', '👥', '🦽', '🎰', '💪', '🤡', '🛋️', '🐺',
    '🔒', '💹', '✨', '📖', '🏴', '⚔️', '🦥', '🛡️',
    '🚫', '🔍', '🥚', '🔄', '⚡', '📚', '🌟', '🃏', '😈'
  ]
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % memeImgs.length)
        setIsTransitioning(false)
      }, 250)
    }, 2500)
    return () => clearInterval(interval)
  }, [memeImgs.length])

  return (
    <div className="relative w-[100px] h-[100px] mb-5 shrink-0">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,221,179,0.06)_0%,rgba(6,8,12,0.9)_70%)] z-0" />
      <div className="absolute -inset-0.5 rounded-full border-[1.5px] border-[rgba(0,221,179,0.12)] z-0 pointer-events-none" />
      <div
        className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center z-[1] text-5xl transition-all duration-350 ${
          isTransitioning
            ? 'opacity-0 scale-110'
            : 'opacity-100 scale-100'
        }`}
        style={{ transitionTimingFunction: isTransitioning ? 'ease-in' : 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {memeImgs[currentIdx]}
      </div>
    </div>
  )
}

// ==========================================
// Welcome Screen
// ==========================================
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex w-full min-h-screen relative z-[2] items-center justify-center p-6">
      <div className="w-full max-w-[560px] flex items-stretch">
        <div
          className="w-full rounded-[var(--r-xl)] p-9 flex flex-col gap-0 relative overflow-hidden"
          style={{
            background: 'var(--wbti-surface-strong)',
            backdropFilter: 'blur(48px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(48px) saturate(1.4)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 12px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 0.5px rgba(255,255,255,0.04)',
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.15)] to-transparent pointer-events-none" />
          {/* Glass border overlay */}
          <div
            className="absolute inset-0 p-[0.5px] rounded-[var(--r-xl)] pointer-events-none"
            style={{
              background: 'var(--glass-border)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          <div className="flex-1 flex flex-col justify-center text-left py-8 px-0 relative z-[1]">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.62rem] tracking-[2.5px] uppercase mb-7 w-fit font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(8px) saturate(1.2)',
                color: 'var(--wbti-accent)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.06), inset 0 0 0 0.5px rgba(255,255,255,0.03)',
              }}
            >
              <span
                className="w-[5px] h-[5px] rounded-full animate-pulse"
                style={{
                  background: 'var(--wbti-accent)',
                  boxShadow: '0 0 8px var(--wbti-accent-glow)',
                }}
              />
              S.W.E.E.P. 行为评估系统
            </div>

            {/* Meme carousel */}
            <MemeCarousel />

            {/* Title */}
            <h1
              className="text-[4.8rem] font-black tracking-[10px] leading-none mb-2.5"
              style={{
                fontFamily: 'var(--font-tech)',
                background: 'linear-gradient(135deg, var(--wbti-accent) 0%, #00e8c0 40%, #00b8d4 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 0 40px rgba(0,221,179,0.12))',
              }}
            >
              WBTI
            </h1>

            {/* Subtitle */}
            <h2
              className="text-[1.05rem] tracking-wider mb-4 font-light"
              style={{
                fontFamily: 'var(--font-main)',
                color: 'var(--wbti-text-2)',
              }}
            >
              卫戍协议 <em className="not-italic" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--wbti-text)', fontWeight: 400 }}>重度依赖</em> 测试
            </h2>

            {/* CTA Button */}
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3.5 px-9 py-[15px] rounded-full cursor-pointer border-none mt-7 w-fit z-[1] uppercase font-bold tracking-[2.5px] text-[0.82rem] transition-all duration-300"
              style={{
                fontFamily: 'var(--font-tech)',
                color: 'var(--wbti-bg)',
                background: 'linear-gradient(135deg, var(--wbti-accent) 0%, #00c9a7 50%, #00b8d4 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 4s ease-in-out infinite',
                boxShadow: '0 4px 24px rgba(0,221,179,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,221,179,0.35), 0 2px 12px rgba(0,221,179,0.2), inset 0 1px 0 rgba(255,255,255,0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,221,179,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              <span>启动评估</span>
              <span
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center transition-transform duration-300"
                style={{ background: 'rgba(0,0,0,0.12)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-7 border-t border-[rgba(255,255,255,0.05)] relative z-[1]">
            <p className="text-[0.82rem] italic" style={{ color: 'var(--wbti-text-3)' }}>
              &quot;... <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--wbti-text)', fontWeight: 400 }}>也好</em>&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Test Screen
// ==========================================
function TestScreen({
  currentQuestion,
  totalQuestions,
  question,
  onAnswer,
  companionEmoji,
}: {
  currentQuestion: number
  totalQuestions: number
  question: QuizQuestion | null
  onAnswer: (value: number | string) => void
  companionEmoji: string
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [prevQuestion, setPrevQuestion] = useState(currentQuestion)

  // Reset selection when question changes (derived from props, not effect)
  const questionChanged = currentQuestion !== prevQuestion
  if (questionChanged) {
    setSelectedIdx(null)
    setPrevQuestion(currentQuestion)
  }

  const slideDirection = selectedIdx !== null ? 'out' : 'in'

  if (!question) return null

  const progress = (currentQuestion / totalQuestions) * 100
  const isGate = question.type === 'gate'
  const isTrigger = question.type === 'trigger'

  const handleSelect = (idx: number, value: number | string) => {
    if (selectedIdx !== null) return
    setSelectedIdx(idx)
    setTimeout(() => onAnswer(value), 300)
  }

  return (
    <div className="max-w-[580px] w-full p-6 mx-auto flex flex-col justify-center min-h-screen">
      {/* Progress Bar */}
      <div className="w-full h-[2px] rounded-full mb-4 overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full rounded-full transition-all duration-600 relative"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--wbti-accent-soft), var(--wbti-accent), #00e8c0)',
            boxShadow: '0 0 12px var(--wbti-accent-glow)',
            transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>

      {/* Question Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div
          className="text-center text-[0.72rem] tracking-[3px] font-normal"
          style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }}
        >
          <span style={{ color: 'var(--wbti-accent)', fontWeight: 700 }}>{currentQuestion + 1}</span> / {totalQuestions}
        </div>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-2xl shrink-0 transition-all duration-400"
          style={{
            border: '1.5px solid var(--wbti-border-accent)',
            background: 'rgba(255,255,255,0.02)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            opacity: companionEmoji ? 1 : 0,
            transform: companionEmoji ? 'scale(1)' : 'scale(0.7)',
            transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {companionEmoji}
        </div>
      </div>

      {/* Question Card */}
      <div
        className="relative overflow-hidden rounded-[var(--r-xl)] p-10 px-8 transition-all duration-400"
        style={{
          background: 'var(--wbti-surface-strong)',
          backdropFilter: 'blur(40px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.3)',
          border: '1px solid var(--wbti-border-accent)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 12px 48px rgba(0,0,0,0.15)',
          transform: slideDirection === 'out' ? 'translateX(-100%)' : 'translateX(0)',
          opacity: slideDirection === 'out' ? 0 : 1,
          transitionTimingFunction: slideDirection === 'out' ? 'ease-in' : 'cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.2)] to-transparent pointer-events-none" />
        {/* Inner glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,221,179,0.02)_0%,transparent_100%)] pointer-events-none" />

        {/* Question Text */}
        <h2
          className="text-[1.08rem] font-medium leading-[1.9] text-center mb-8 relative z-[1]"
          style={{ color: 'var(--wbti-text)' }}
        >
          {question.text}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-2.5 relative z-[1]">
          {question.options.map((opt, i) => {
            const isRegularOpt = 'score' in opt
            const label = opt.label
            const isSelected = selectedIdx === i
            const letterIdx = String.fromCharCode(65 + i) // A, B, C...

            return (
              <button
                key={i}
                onClick={() => handleSelect(i, isRegularOpt ? (opt as { score: number }).score : (opt as { value: string }).value)}
                className={`relative flex items-center gap-3.5 py-4 px-5 rounded-[var(--r-md)] cursor-pointer text-left transition-all duration-300 overflow-hidden ${
                  isGate || isTrigger ? 'justify-center' : ''
                }`}
                style={{
                  background: isSelected ? 'rgba(0,221,179,0.08)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid var(--wbti-accent)' : '1px solid var(--wbti-border)',
                  color: isSelected ? 'var(--wbti-text)' : 'var(--wbti-text-2)',
                  boxShadow: isSelected
                    ? '0 0 24px rgba(0,221,179,0.08), inset 0 0 0 0.5px rgba(0,221,179,0.15)'
                    : 'none',
                  fontFamily: 'var(--font-main)',
                  fontSize: '0.88rem',
                  lineHeight: 1.7,
                }}
              >
                {/* Hover glow layer */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,221,179,0.05)] to-[rgba(0,184,212,0.03)] opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}

                {/* Indicator circle */}
                {!isGate && !isTrigger && (
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[0.58rem] font-bold transition-all duration-300 z-[1]"
                    style={{
                      fontFamily: 'var(--font-tech)',
                      border: isSelected ? '1.5px solid var(--wbti-accent)' : '1.5px solid rgba(255,255,255,0.08)',
                      background: isSelected ? 'var(--wbti-accent)' : 'transparent',
                      color: isSelected ? 'var(--wbti-bg)' : 'var(--wbti-text-3)',
                      boxShadow: isSelected ? '0 0 12px rgba(0,221,179,0.3)' : 'none',
                    }}
                  >
                    {letterIdx}
                  </span>
                )}

                <span className={`flex-1 z-[1] ${isGate || isTrigger ? 'text-center font-medium' : ''}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Result Screen
// ==========================================
function ResultScreen({
  result,
  onRetry,
}: {
  result: QuizResult
  onRetry: () => void
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const top = result.type

  const handleShare = useCallback(async () => {
    const text = `我在WBTI卫戍协议重度依赖测试中的结果是【${top.emoji} ${top.name}】${top.slogan}匹配度${result.similarity}%！快来测测你是哪种重度依赖？🛡️`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'WBTI · 卫戍协议重度依赖测试', text, url: location.href })
      } catch { /* user cancelled */ }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text + '\n' + location.href)
        setToastMsg('已复制到剪贴板，快去分享吧！')
      } catch {
        setToastMsg('请手动复制分享')
      }
    }
  }, [top, result.similarity])

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [toastMsg])

  // Encode vector for dimension display
  const userVec = DIM_ORDER.map(d => {
    const scores: Record<string, number> = {}
    DIM_ORDER.forEach(dim => { scores[dim] = 0 })
    // We'll use the vector from result
    return 0
  })

  // Parse userVector string to array
  const vecLabels = result.userVector.split('-').join('').split('')

  return (
    <div className="max-w-[540px] w-full p-6 overflow-y-auto max-h-screen mx-auto" style={{ scrollbarWidth: 'thin' }}>
      {/* Header Badge */}
      <div className="text-center mb-6" style={{ animation: 'fadeUp 0.5s ease both' }}>
        <div
          className="inline-flex items-center gap-1.5 px-[18px] py-1.5 rounded-full"
          style={{
            background: 'var(--wbti-accent-dim)',
            border: '1px solid var(--wbti-border-accent)',
            fontFamily: 'var(--font-tech)',
            fontSize: '0.6rem',
            letterSpacing: '2.5px',
            color: 'var(--wbti-accent)',
          }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: 'var(--wbti-accent)', boxShadow: '0 0 6px var(--wbti-accent-glow)' }} />
          S.W.E.E.P. 评估报告
        </div>
      </div>

      {/* Result Card */}
      <div
        className="relative overflow-hidden rounded-[var(--r-xl)] text-center mb-6"
        style={{
          background: 'var(--wbti-surface-strong)',
          backdropFilter: 'blur(48px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(48px) saturate(1.4)',
          border: '1px solid var(--wbti-border-accent)',
          padding: '44px 32px 36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Glow */}
        <div
          className="absolute -inset-1/2 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${top.color}30 0%, transparent 55%)`,
            animation: 'cardGlowPulse 5s ease-in-out infinite',
          }}
        />
        {/* Top accent line */}
        <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.25)] to-transparent pointer-events-none" />

        {/* Emblem */}
        <div
          className="w-[88px] h-[88px] mx-auto mb-5 rounded-full flex items-center justify-center text-[44px] relative z-[1] overflow-hidden"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 0 40px rgba(0,221,179,0.06)',
            animation: 'emblemReveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          {top.emoji}
        </div>

        {/* Code */}
        <div
          className="relative z-[1] mb-1.5 font-black tracking-[4px] text-[1.1rem]"
          style={{ fontFamily: 'var(--font-tech)', color: top.color, animation: 'fadeUp 0.5s 0.15s ease both' }}
        >
          {top.code}
        </div>

        {/* Similarity */}
        <div
          className="relative z-[1] mb-1 font-semibold tracking-wider text-[0.78rem]"
          style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)', animation: 'fadeUp 0.5s 0.2s ease both' }}
        >
          匹配度 {result.similarity}%
        </div>

        {/* Vector */}
        <div
          className="relative z-[1] mb-4 font-normal tracking-[1.5px] text-[0.55rem] opacity-40"
          style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)', animation: 'fadeUp 0.5s 0.25s ease both' }}
        >
          {result.userVector}
        </div>

        {/* Name */}
        <h2
          className="relative z-[1] mb-4 font-black tracking-[2px] text-[1.8rem]"
          style={{ color: top.color, animation: 'fadeUp 0.5s 0.3s ease both' }}
        >
          {top.name}
        </h2>

        {/* Description */}
        <p
          className="relative z-[1] mb-6 leading-[2] text-[0.85rem] max-w-[400px] mx-auto"
          style={{ color: 'var(--wbti-text-2)', animation: 'fadeUp 0.5s 0.4s ease both' }}
        >
          {top.desc}
        </p>

        {/* Motto */}
        <p
          className="relative z-[1] italic text-[0.82rem] pt-5 border-t border-[rgba(255,255,255,0.05)] inline-block"
          style={{ color: 'var(--wbti-text-3)', animation: 'fadeUp 0.5s 0.5s ease both' }}
        >
          {top.slogan}
        </p>
      </div>

      {/* Dimension Display */}
      <div
        className="p-7 rounded-[var(--r-lg)] mb-6 relative z-[1] overflow-hidden"
        style={{
          background: 'var(--wbti-surface-strong)',
          backdropFilter: 'blur(48px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(48px) saturate(1.4)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 12px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 0.5px rgba(255,255,255,0.04)',
          animation: 'fadeUp 0.5s 0.6s ease both',
        }}
      >
        {/* Glass border overlay */}
        <div
          className="absolute inset-0 p-[0.5px] rounded-[var(--r-lg)] pointer-events-none"
          style={{
            background: 'var(--glass-border)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(0,221,179,0.15)] to-transparent pointer-events-none" />

        <div
          className="text-center font-semibold tracking-[3px] text-[0.6rem] uppercase mb-6"
          style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }}
        >
          十五维人格分析
        </div>

        {QUIZ_DATA.models.map((model, modelIdx) => {
          const dimStart = modelIdx * 3
          return (
            <div key={model.id} className="mb-5 last:mb-0">
              <div
                className="text-[0.72rem] font-semibold tracking-[1.5px] mb-2.5 pl-0.5 opacity-70 flex items-center gap-2"
                style={{ color: 'var(--wbti-accent)' }}
              >
                {model.name}
                <span className="flex-1 h-px bg-gradient-to-r from-[var(--wbti-border-accent)] to-transparent" />
              </div>
              {model.dimensions.map((dim, dimIdx) => {
                const vecIdx = dimStart + dimIdx
                const val = vecLabels[vecIdx] === 'H' ? 2 : vecLabels[vecIdx] === 'M' ? 1 : 0
                const dimName = dim.replace(/^[A-Z]\d\s/, '')
                const level = val === 2 ? '高' : val === 1 ? '中' : '低'
                const cls = val === 2 ? 'h' : val === 1 ? 'm' : 'l'
                const pct = val === 2 ? 100 : val === 1 ? 60 : 25

                return (
                  <div key={dim} className="flex items-center gap-3 py-[7px] px-1 transition-all duration-200 hover:pl-2">
                    <span
                      className="text-[0.74rem] min-w-[76px] shrink-0 whitespace-nowrap transition-colors duration-200"
                      style={{ color: 'var(--wbti-text-2)' }}
                    >
                      {dimName}
                    </span>
                    <div className="flex-1 h-1 rounded-sm overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div
                        className={`h-full rounded-sm dim-bar-fill-${cls} transition-all duration-1000`}
                        style={{
                          width: `${pct}%`,
                          background: cls === 'h'
                            ? 'linear-gradient(90deg, var(--wbti-accent-soft), var(--wbti-accent))'
                            : cls === 'm'
                            ? 'linear-gradient(90deg, rgba(232,168,56,0.6), var(--wbti-warm))'
                            : 'rgba(74,84,106,0.4)',
                          boxShadow: cls === 'h' ? '0 0 8px rgba(0,221,179,0.2)' : cls === 'm' ? '0 0 6px rgba(232,168,56,0.1)' : 'none',
                          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      />
                    </div>
                    <span
                      className={`text-[0.62rem] font-bold min-w-[22px] text-right tracking-wider dim-level-${cls}`}
                      style={{
                        fontFamily: 'var(--font-tech)',
                        color: cls === 'h' ? 'var(--wbti-accent)' : cls === 'm' ? 'var(--wbti-warm)' : 'var(--wbti-text-3)',
                        textShadow: cls === 'h' ? '0 0 8px rgba(0,221,179,0.3)' : 'none',
                      }}
                    >
                      {level}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div
        className="flex gap-3 justify-center mb-7"
        style={{ animation: 'fadeUp 0.5s 0.7s ease both' }}
      >
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 py-3 px-6 rounded-full text-[0.8rem] font-semibold cursor-pointer transition-all duration-300 tracking-wide border border-transparent"
          style={{
            background: 'linear-gradient(135deg, var(--wbti-accent) 0%, #00c9a7 50%, #00b8d4 100%)',
            backgroundSize: '200% 200%',
            color: 'var(--wbti-bg)',
            boxShadow: '0 4px 20px rgba(0,221,179,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,221,179,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,221,179,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          📤 分享结果
        </button>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 py-3 px-6 rounded-full text-[0.8rem] font-medium cursor-pointer transition-all duration-300 tracking-wide"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--wbti-border-accent)',
            color: 'var(--wbti-text-2)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--wbti-accent)'
            e.currentTarget.style.color = 'var(--wbti-accent)'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,221,179,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--wbti-border-accent)'
            e.currentTarget.style.color = 'var(--wbti-text-2)'
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          🔄 重新测试
        </button>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed bottom-10 left-1/2 -translate-x-1/2 py-3 px-7 rounded-full text-[0.82rem] z-[200] tracking-wide"
          style={{
            background: 'rgba(10,14,24,0.92)',
            backdropFilter: 'blur(16px) saturate(1.3)',
            border: '1px solid rgba(0,221,179,0.15)',
            color: 'var(--wbti-text)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  )
}

// ==========================================
// Main Page Component
// ==========================================
export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [dimScores, setDimScores] = useState<Record<string, number>>(() => {
    const scores: Record<string, number> = {}
    DIM_ORDER.forEach(d => { scores[d] = 0 })
    return scores
  })
  const [isTriggerGuide, setIsTriggerGuide] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [companionEmoji, setCompanionEmoji] = useState('')

  // Companion emoji pool
  const companionPool = QUIZ_DATA.types.map(t => t.emoji)

  // Build question list
  const buildQuestionList = useCallback(() => {
    const regular = [...QUIZ_DATA.questions]
    // Fisher-Yates shuffle
    for (let i = regular.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[regular[i], regular[j]] = [regular[j], regular[i]]
    }

    // Insert gate question at position 14-17
    const gatePos = 14 + Math.floor(Math.random() * 4)
    const gate: QuizQuestion = {
      type: 'gate',
      dim: '',
      text: QUIZ_DATA.gateQuestion.text,
      options: QUIZ_DATA.gateQuestion.options,
    }

    const built: QuizQuestion[] = [
      ...regular.slice(0, gatePos).map(q => ({ ...q, type: 'regular' as const })),
      gate,
      ...regular.slice(gatePos).map(q => ({ ...q, type: 'regular' as const })),
    ]

    return built
  }, [])

  // Calculate result
  const calculateResult = useCallback((scores: Record<string, number>, triggered: boolean): QuizResult => {
    // Encode vector
    const userVec = DIM_ORDER.map(d => {
      const s = scores[d] || 0
      if (s <= 3) return 0
      if (s >= 5) return 2
      return 1
    })

    const vectorToCode = (vec: number[]) => {
      const labels = vec.map(v => v === 0 ? 'L' : v === 1 ? 'M' : 'H')
      return labels.join('').match(/.{3}/g)!.join('-')
    }

    const userVector = vectorToCode(userVec)

    // Special trigger check
    if (triggered) {
      const gljl = QUIZ_DATA.specialTypes.find(t => t.code === 'GLJL')!
      return {
        type: gljl,
        similarity: 100,
        isSpecial: true,
        userVector,
      }
    }

    // Manhattan distance matching
    const parseVectorStr = (str: string) => {
      return str.split('-').join('').split('').map(c => VECTOR_VALUE[c])
    }

    const matchList = QUIZ_DATA.types.map(type => {
      const typeVec = parseVectorStr(type.vector)
      const distance = userVec.reduce((sum, v, i) => sum + Math.abs(v - typeVec[i]), 0)
      const similarity = Number(((1 - distance / 30) * 100).toFixed(1))
      return { ...type, distance, similarity }
    })

    matchList.sort((a, b) => a.distance - b.distance || b.similarity - a.similarity)

    const best = matchList[0]
    if (best.similarity < 60) {
      const mylz = QUIZ_DATA.specialTypes.find(t => t.code === 'MYLZ')!
      return {
        type: mylz,
        similarity: best.similarity,
        isSpecial: true,
        userVector,
        matchList,
      }
    }

    return {
      type: best,
      similarity: best.similarity,
      isSpecial: false,
      userVector,
      matchList,
    }
  }, [])

  // Start test
  const handleStart = useCallback(() => {
    const newScores: Record<string, number> = {}
    DIM_ORDER.forEach(d => { newScores[d] = 0 })
    setDimScores(newScores)
    setIsTriggerGuide(false)
    setCurrentQuestion(0)
    setQuestions(buildQuestionList())
    setScreen('test')
    setCompanionEmoji(companionPool[Math.floor(Math.random() * companionPool.length)])
  }, [buildQuestionList, companionPool])

  // Handle answer
  const handleAnswer = useCallback((value: number | string) => {
    const q = questions[currentQuestion]
    if (!q) return

    let newScores = { ...dimScores }

    if (q.type === 'regular' && typeof value === 'number') {
      newScores[q.dim] = (newScores[q.dim] || 0) + value
      setDimScores(newScores)
    } else if (q.type === 'gate' && typeof value === 'string') {
      if (value === 'guide') {
        // Insert trigger question
        const trigger: QuizQuestion = {
          type: 'trigger',
          dim: '',
          text: QUIZ_DATA.triggerQuestion.text,
          options: QUIZ_DATA.triggerQuestion.options,
        }
        const newQuestions = [...questions]
        newQuestions.splice(currentQuestion + 1, 0, trigger)
        setQuestions(newQuestions)
      }
    } else if (q.type === 'trigger' && typeof value === 'string') {
      // Check if the trigger option was selected
      const triggerOpt = QUIZ_DATA.triggerQuestion.options.find(o => o.value === value)
      if (triggerOpt && 'trigger' in triggerOpt && triggerOpt.trigger) {
        setIsTriggerGuide(true)
      }
    }

    // Move to next question
    const nextQ = currentQuestion + 1
    if (nextQ < questions.length + (q.type === 'gate' && value === 'guide' ? 1 : 0)) {
      // Check against actual questions array (which may have been updated)
      setTimeout(() => {
        setCurrentQuestion(prev => {
          const newPrev = prev + 1
          // Re-check with potentially updated questions
          // We need to get the latest questions
          return newPrev
        })
        setCompanionEmoji(companionPool[Math.floor(Math.random() * companionPool.length)])
      }, 350)
    }
  }, [questions, currentQuestion, dimScores, companionPool])

  // Check if test is complete - using ref to avoid setState in effect
  const testCompleteRef = useRef(false)
  useEffect(() => {
    if (screen !== 'test') return
    if (currentQuestion >= questions.length && questions.length > 0 && !testCompleteRef.current) {
      testCompleteRef.current = true
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        const res = calculateResult(dimScores, isTriggerGuide)
        setResult(res)
        setTimeout(() => setScreen('result'), 400)
      })
    }
  }, [currentQuestion, questions.length, screen, dimScores, isTriggerGuide, calculateResult])

  // Reset test complete ref when starting new test
  useEffect(() => {
    if (screen === 'welcome') {
      testCompleteRef.current = false
    }
  }, [screen])

  // Retry
  const handleRetry = useCallback(() => {
    setScreen('welcome')
    setResult(null)
  }, [])

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (screen !== 'test') return
      const q = questions[currentQuestion]
      if (!q || q.type !== 'regular') return

      const keyIdx: Record<string, number> = { '1': 0, '2': 1, '3': 2, 'a': 0, 'b': 1, 'c': 2 }
      const idx = keyIdx[e.key.toLowerCase()]
      if (idx !== undefined && q.options[idx] && 'score' in q.options[idx]) {
        handleAnswer((q.options[idx] as { score: number }).score)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [screen, questions, currentQuestion, handleAnswer])

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        fontFamily: 'var(--font-main)',
        background: 'var(--wbti-bg)',
        color: 'var(--wbti-text)',
      }}
    >
      {/* Particle Background */}
      <ParticleCanvas />

      {/* Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0,221,179,0.035) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 90% 80%, rgba(0,100,180,0.025) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0,221,179,0.01) 0%, transparent 100%)',
          }}
        />
        {/* Ambient drift */}
        <div
          className="absolute -inset-1/2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(0,221,179,0.03) 0%, transparent 40%)',
            animation: 'ambientDrift 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Screens */}
      <div
        className="fixed inset-0 z-[1] overflow-y-auto transition-all duration-600"
        style={{
          opacity: screen === 'welcome' ? 1 : 0,
          pointerEvents: screen === 'welcome' ? 'all' : 'none',
          transform: screen === 'welcome' ? 'translateY(0)' : 'translateY(-20px)',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <WelcomeScreen onStart={handleStart} />
      </div>

      <div
        className="fixed inset-0 z-[1] overflow-y-auto transition-all duration-600"
        style={{
          opacity: screen === 'test' ? 1 : 0,
          pointerEvents: screen === 'test' ? 'all' : 'none',
          transform: screen === 'test' ? 'translateY(0)' : 'translateY(16px)',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <TestScreen
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          question={questions[currentQuestion] || null}
          onAnswer={handleAnswer}
          companionEmoji={companionEmoji}
        />
      </div>

      <div
        className="fixed inset-0 z-[1] overflow-y-auto transition-all duration-600"
        style={{
          opacity: screen === 'result' ? 1 : 0,
          pointerEvents: screen === 'result' ? 'all' : 'none',
          transform: screen === 'result' ? 'translateY(0)' : 'translateY(16px)',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {result && <ResultScreen result={result} onRetry={handleRetry} />}
      </div>
    </div>
  )
}
