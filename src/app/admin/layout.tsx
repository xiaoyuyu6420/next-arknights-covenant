'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/results', label: '测试记录', icon: '📋' },
  { href: '/admin/questions', label: '题目管理', icon: '❓' },
  { href: '/admin/types', label: '人格管理', icon: '🎭' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'var(--font-main)', background: '#080b12', color: '#e0e4ea' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-56 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`} style={{ background: '#0c1018', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link href="/admin" className="text-sm font-bold tracking-wider" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)' }}>
            WBTI ADMIN
          </Link>
        </div>
        <nav className="p-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'text-white' : 'hover:bg-white/5'
                }`}
                style={{
                  background: isActive ? 'rgba(0,221,179,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--wbti-accent)' : '2px solid transparent',
                  color: isActive ? 'var(--wbti-accent)' : '#8892a4',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Link href="/" className="text-xs text-center block py-2 rounded-lg hover:bg-white/5" style={{ color: '#5a6478' }}>
            ← 返回前台
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-lg" style={{ color: '#8892a4' }}>☰</button>
          <span className="text-sm font-bold tracking-wider" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)' }}>WBTI ADMIN</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
