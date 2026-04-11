'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalTests: number
  uniqueUsers: number
  avgSimilarity: number
  typeDistribution: { code: string; name: string; count: number }[]
  dailyTrend: { date: string; count: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-20" style={{ color: '#5a6478' }}>Loading...</div>
  if (!stats) return <div className="text-center py-20 text-red-400">Failed to load stats</div>

  const maxCount = Math.max(...stats.typeDistribution.map(t => t.count), 1)

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)', letterSpacing: '2px' }}>
        DASHBOARD
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: '总测试数', value: stats.totalTests, color: 'var(--wbti-accent)' },
          { label: '独立用户', value: stats.uniqueUsers, color: '#00b8d4' },
          { label: '平均匹配度', value: `${stats.avgSimilarity}%`, color: 'var(--wbti-warm)' },
        ].map(card => (
          <div key={card.label} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs tracking-wider mb-2" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>{card.label}</div>
            <div className="text-2xl font-bold" style={{ color: card.color, fontFamily: 'var(--font-tech)' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Type distribution */}
      <div className="rounded-xl p-5 mb-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xs tracking-wider mb-4" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>类型分布</div>
        <div className="flex flex-col gap-2">
          {stats.typeDistribution.map(t => (
            <div key={t.code} className="flex items-center gap-3">
              <span className="text-xs min-w-[72px] shrink-0" style={{ color: '#8892a4', fontFamily: 'var(--font-tech)' }}>{t.code}</span>
              <span className="text-xs min-w-[60px] shrink-0" style={{ color: '#c0c6d0' }}>{t.name}</span>
              <div className="flex-1 h-4 rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="h-full rounded-sm" style={{ width: `${(t.count / maxCount) * 100}%`, background: 'linear-gradient(90deg, var(--wbti-accent-soft), var(--wbti-accent))', minWidth: t.count > 0 ? '2px' : '0' }} />
              </div>
              <span className="text-xs font-bold min-w-[28px] text-right" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)' }}>{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily trend */}
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xs tracking-wider mb-4" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>近30天趋势</div>
        {stats.dailyTrend.length === 0 ? (
          <div className="text-xs" style={{ color: '#5a6478' }}>暂无数据</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#5a6478' }}>
                  <th className="text-left py-1.5 px-2 font-medium">日期</th>
                  <th className="text-right py-1.5 px-2 font-medium">测试数</th>
                </tr>
              </thead>
              <tbody>
                {stats.dailyTrend.slice(-14).reverse().map(d => (
                  <tr key={d.date} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                    <td className="py-1.5 px-2" style={{ color: '#8892a4' }}>{d.date}</td>
                    <td className="py-1.5 px-2 text-right font-bold" style={{ color: 'var(--wbti-accent)', fontFamily: 'var(--font-tech)' }}>{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
