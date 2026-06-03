'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { UIText } from '@/i18n/types'

export function SimilarityRing({ similarity, color, text, size = 120 }: { similarity: number; color: string; text: UIText; size?: number }) {
  const radius = useMemo(() => (size - 12) / 2, [size])
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius])
  const strokeDashoffset = circumference - (similarity / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="4"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-black text-[1.4rem]"
          style={{ fontFamily: 'var(--font-tech)', color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, type: 'spring', stiffness: 200 }}
        >
          {similarity}%
        </motion.span>
        <span className="text-[0.5rem] tracking-[2px] uppercase" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-text-3)' }}>
          {text.matchLabel}
        </span>
      </div>
    </div>
  )
}
