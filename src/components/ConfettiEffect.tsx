'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

export function ConfettiEffect({ color }: { color: string }) {
  const confettiPieces = useMemo(() => {
    const pieces = []
    const colors = [color, '#00ddb3', '#00e8c0', '#e8a838', '#00b8d4', '#ff6b9d']
    for (let i = 0; i < 40; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 2,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      })
    }
    return pieces
  }, [color])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {confettiPieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.left}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotation + 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}
