'use client'

import { useEffect, useState, useCallback } from 'react'

interface PersonalityType {
  id: number
  code: string
  name: string
  group: string
  emoji: string
  color: string
  img: string
  vector: string
  desc: string
  slogan: string
}

interface SpecialType {
  id: number
  code: string
  name: string
  emoji: string
  color: string
  img: string
  trigger: string
  desc: string
  slogan: string
}

export default function AdminTypes() {
  const [types, setTypes] = useState<PersonalityType[]>([])
  const [specialTypes, setSpecialTypes] = useState<SpecialType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [editType, setEditType] = useState<'regular' | 'special'>('regular')
  const [editData, setEditData] = useState<Record<string, string>>({})

  const fetchData = useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/admin/types').then(r => r.json()),
      fetch('/api/admin/special-types').then(r => r.json()),
    ])
      .then(([t, st]) => { setTypes(t); setSpecialTypes(st) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const startEdit = (type: PersonalityType | SpecialType, kind: 'regular' | 'special') => {
    setEditingCode(type.code)
    setEditType(kind)
    setEditData({ ...type } as unknown as Record<string, string>)
  }

  const saveEdit = async () => {
    if (!editingCode) return
    const endpoint = editType === 'regular' ? `/api/admin/types/${editingCode}` : `/api/admin/special-types/${editingCode}`
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    setEditingCode(null)
    fetchData()
  }

  if (loading) return <div className="text-center py-20" style={{ color: '#5a6478' }}>Loading...</div>

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)', letterSpacing: '2px' }}>
        人格管理
      </h1>

      {/* Regular types */}
      <div className="text-xs font-semibold tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--wbti-accent)', fontFamily: 'var(--font-tech)' }}>
        常规人格类型 ({types.length})
        <span className="flex-1 h-px" style={{ background: 'rgba(0,221,179,0.15)' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {types.map(t => (
          <div
            key={t.code}
            className="rounded-xl p-4 transition-colors"
            style={{
              background: editingCode === t.code ? 'rgba(0,221,179,0.04)' : 'rgba(255,255,255,0.02)',
              border: editingCode === t.code ? `1px solid ${t.color}30` : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {editingCode === t.code ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-sm font-bold" style={{ color: t.color }}>{t.code}</span>
                  <span className="text-xs" style={{ color: '#5a6478' }}>{t.name}</span>
                </div>
                <label className="text-xs" style={{ color: '#5a6478' }}>名称</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="bg-transparent border rounded px-2 py-1 text-xs"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#e0e4ea' }}
                />
                <label className="text-xs" style={{ color: '#5a6478' }}>描述</label>
                <textarea
                  value={editData.desc || ''}
                  onChange={e => setEditData({ ...editData, desc: e.target.value })}
                  className="bg-transparent border rounded px-2 py-1 text-xs resize-none"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#c0c6d0', minHeight: '80px' }}
                />
                <label className="text-xs" style={{ color: '#5a6478' }}>标语</label>
                <input
                  type="text"
                  value={editData.slogan || ''}
                  onChange={e => setEditData({ ...editData, slogan: e.target.value })}
                  className="bg-transparent border rounded px-2 py-1 text-xs"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#e0e4ea' }}
                />
                <label className="text-xs" style={{ color: '#5a6478' }}>向量</label>
                <input
                  type="text"
                  value={editData.vector || ''}
                  onChange={e => setEditData({ ...editData, vector: e.target.value })}
                  className="bg-transparent border rounded px-2 py-1 text-xs"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'var(--wbti-accent)', fontFamily: 'var(--font-tech)' }}
                />
                <label className="text-xs" style={{ color: '#5a6478' }}>颜色</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editData.color || '#00ddb3'}
                    onChange={e => setEditData({ ...editData, color: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editData.color || ''}
                    onChange={e => setEditData({ ...editData, color: e.target.value })}
                    className="bg-transparent border rounded px-2 py-1 text-xs flex-1"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#e0e4ea', fontFamily: 'var(--font-tech)' }}
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(0,221,179,0.1)', color: 'var(--wbti-accent)', border: '1px solid rgba(0,221,179,0.2)' }}
                  >
                    保存
                  </button>
                  <button onClick={() => setEditingCode(null)} className="px-4 py-1.5 rounded-lg text-xs" style={{ color: '#5a6478' }}>
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-sm font-bold" style={{ color: t.color }}>{t.name}</span>
                  <span className="text-xs ml-auto" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>{t.code}</span>
                </div>
                <p className="text-xs leading-relaxed mb-2 line-clamp-3" style={{ color: '#8892a4' }}>
                  {t.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs italic" style={{ color: '#5a6478' }}>{t.slogan}</span>
                  <button
                    onClick={() => startEdit(t, 'regular')}
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#5a6478' }}
                  >
                    编辑
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Special types */}
      <div className="text-xs font-semibold tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--wbti-warm)', fontFamily: 'var(--font-tech)' }}>
        特殊人格类型 ({specialTypes.length})
        <span className="flex-1 h-px" style={{ background: 'rgba(232,168,56,0.15)' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {specialTypes.map(t => (
          <div
            key={t.code}
            className="rounded-xl p-4 transition-colors"
            style={{
              background: editingCode === t.code ? 'rgba(232,168,56,0.04)' : 'rgba(255,255,255,0.02)',
              border: editingCode === t.code ? `1px solid ${t.color}30` : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {editingCode === t.code ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-sm font-bold" style={{ color: t.color }}>{t.name}</span>
                </div>
                <label className="text-xs" style={{ color: '#5a6478' }}>名称</label>
                <input type="text" value={editData.name || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} className="bg-transparent border rounded px-2 py-1 text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#e0e4ea' }} />
                <label className="text-xs" style={{ color: '#5a6478' }}>描述</label>
                <textarea value={editData.desc || ''} onChange={e => setEditData({ ...editData, desc: e.target.value })} className="bg-transparent border rounded px-2 py-1 text-xs resize-none" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#c0c6d0', minHeight: '80px' }} />
                <label className="text-xs" style={{ color: '#5a6478' }}>标语</label>
                <input type="text" value={editData.slogan || ''} onChange={e => setEditData({ ...editData, slogan: e.target.value })} className="bg-transparent border rounded px-2 py-1 text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#e0e4ea' }} />
                <div className="flex gap-2 mt-1">
                  <button onClick={saveEdit} className="px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(232,168,56,0.1)', color: 'var(--wbti-warm)', border: '1px solid rgba(232,168,56,0.2)' }}>保存</button>
                  <button onClick={() => setEditingCode(null)} className="px-4 py-1.5 rounded-lg text-xs" style={{ color: '#5a6478' }}>取消</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-sm font-bold" style={{ color: t.color }}>{t.name}</span>
                  <span className="text-xs ml-auto" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>{t.code}</span>
                </div>
                <p className="text-xs leading-relaxed mb-2 line-clamp-3" style={{ color: '#8892a4' }}>{t.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs italic" style={{ color: '#5a6478' }}>{t.slogan}</span>
                  <button onClick={() => startEdit(t, 'special')} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: '#5a6478' }}>编辑</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
