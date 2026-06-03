'use client'

import { useEffect, useRef } from 'react'

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const COUNT = 80
    const particles: { x: number; y: number; sz: number; vx: number; vy: number; o: number; baseO: number; phase: number; speed: number }[] = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < COUNT; i++) {
      const baseO = Math.random() * 0.35 + 0.1
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        sz: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: baseO,
        baseO,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.006 + 0.002,
      })
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.shadowBlur = 0
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.phase += p.speed
        p.o = p.baseO * (0.5 + 0.5 * Math.sin(p.phase))
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10
        ctx.shadowBlur = p.sz * 4
        ctx.shadowColor = `rgba(0, 221, 179, ${p.o * 0.5})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 221, 179, ${p.o})`
        ctx.fill()
      }
      ctx.shadowBlur = 0
      ctx.shadowColor = 'transparent'
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 200) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 221, 179, ${0.06 * (1 - d / 200)})`
            ctx.lineWidth = 0.6
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

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
