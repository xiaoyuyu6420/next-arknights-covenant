'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MEME_IMAGES = [
  '/img-sy/笑死.png',
  '/img-sy/好耶.png',
  '/img-sy/大哭.png',
  '/img-sy/惊讶，啊？.png',
  '/img-sy/爱了爱了.png',
  '/img-sy/就这？.png',
  '/img-sy/思考中.png',
  '/img-sy/赞诶.png',
  '/img-sy/遵命.png',
  '/img-sy/酷酷的.png',
  '/img-sy/满眼爱心.png',
  '/img-sy/双手合十对不起.png',
  '/img-sy/合作愉快.png',
]

export function MemeCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % MEME_IMAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-[100px] h-[100px] mb-5 shrink-0">
      <div className="absolute inset-0 rounded-full z-0" style={{ background: 'radial-gradient(circle, rgba(0,221,179,0.08) 0%, rgba(6,8,12,0.9) 70%)' }} />
      <div className="absolute -inset-1 rounded-full z-0 pointer-events-none" style={{ border: '2px solid rgba(0,221,179,0.15)', boxShadow: '0 0 20px rgba(0,221,179,0.08)' }} />
      <motion.div
        className="absolute -inset-2 rounded-full pointer-events-none"
        style={{ border: '1px dashed rgba(0,221,179,0.1)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center z-[1] overflow-hidden"
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.3, rotate: 20 }}
          transition={{ duration: 0.35, type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MEME_IMAGES[currentIdx]}
            alt="meme"
            className="w-[80px] h-[80px] object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
