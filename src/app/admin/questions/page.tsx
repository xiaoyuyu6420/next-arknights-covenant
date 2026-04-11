'use client'

import { useEffect, useState, useCallback } from 'react'

interface Option {
  id: number
  label: string
  score: number | null
  value: string | null
  trigger: string | null
  order: number
}

interface Question {
  id: number
  type: string
  dim: string
  text: string
  order: number
  active: boolean
  options: Option[]
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [editOptions, setEditOptions] = useState<Option[]>([])

  const fetchQuestions = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/questions')
      .then(r => r.json())
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  const startEdit = (q: Question) => {
    setEditingId(q.id)
    setEditText(q.text)
    setEditOptions([...q.options])
  }

  const saveEdit = async (id: number) => {
    const q = questions.find(q => q.id === id)
    if (!q) return

    await fetch(`/api/admin/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: editText,
        dim: q.dim,
        active: q.active,
        options: editOptions.map(o => ({
          label: o.label,
          score: o.score,
          value: o.value,
          trigger: o.trigger,
        })),
      }),
    })

    setEditingId(null)
    fetchQuestions()
  }

  const deleteQuestion = async (id: number) => {
    if (!confirm('确定删除此题目？')) return
    await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
    fetchQuestions()
  }

  const toggleActive = async (q: Question) => {
    await fetch(`/api/admin/questions/${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !q.active }),
    })
    fetchQuestions()
  }

  const updateOption = (idx: number, field: keyof Option, value: string | number | null) => {
    const newOpts = [...editOptions]
    newOpts[idx] = { ...newOpts[idx], [field]: value }
    setEditOptions(newOpts)
  }

  // Group by dim
  const grouped: Record<string, Question[]> = {}
  for (const q of questions) {
    const key = q.type === 'regular' ? q.dim : q.type
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(q)
  }

  if (loading) return <div className="text-center py-20" style={{ color: '#5a6478' }}>Loading...</div>

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)', letterSpacing: '2px' }}>
        题目管理
        <span className="text-xs font-normal ml-3" style={{ color: '#5a6478' }}>共 {questions.length} 题</span>
      </h1>

      {Object.entries(grouped).map(([dim, qs]) => (
        <div key={dim} className="mb-6">
          <div className="text-xs font-semibold tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--wbti-accent)', fontFamily: 'var(--font-tech)' }}>
            {dim}
            <span className="flex-1 h-px" style={{ background: 'rgba(0,221,179,0.15)' }} />
          </div>

          <div className="flex flex-col gap-2">
            {qs.map(q => (
              <div
                key={q.id}
                className="rounded-xl p-4 transition-colors"
                style={{
                  background: editingId === q.id ? 'rgba(0,221,179,0.04)' : 'rgba(255,255,255,0.02)',
                  border: editingId === q.id ? '1px solid rgba(0,221,179,0.15)' : '1px solid rgba(255,255,255,0.06)',
                  opacity: q.active ? 1 : 0.5,
                }}
              >
                {editingId === q.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="w-full bg-transparent border rounded-lg p-2 text-sm mb-3 resize-none"
                      style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#e0e4ea', minHeight: '60px' }}
                    />
                    <div className="flex flex-col gap-2 mb-3">
                      {editOptions.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs min-w-[20px]" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>{String.fromCharCode(65 + i)}</span>
                          <input
                            type="text"
                            value={opt.label}
                            onChange={e => updateOption(i, 'label', e.target.value)}
                            className="flex-1 bg-transparent border rounded px-2 py-1 text-xs"
                            style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#c0c6d0' }}
                          />
                          {opt.score !== null && (
                            <input
                              type="number"
                              value={opt.score ?? ''}
                              onChange={e => updateOption(i, 'score', Number(e.target.value))}
                              className="w-14 bg-transparent border rounded px-2 py-1 text-xs text-center"
                              style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'var(--wbti-accent)', fontFamily: 'var(--font-tech)' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(q.id)}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: 'rgba(0,221,179,0.1)', color: 'var(--wbti-accent)', border: '1px solid rgba(0,221,179,0.2)' }}
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1.5 rounded-lg text-xs"
                        style={{ color: '#5a6478' }}
                      >
                        取消
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm leading-relaxed" style={{ color: '#c0c6d0' }}>{q.text}</p>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => toggleActive(q)} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: '#5a6478' }}>
                          {q.active ? '启用' : '禁用'}
                        </button>
                        <button onClick={() => startEdit(q)} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: '#5a6478' }}>
                          编辑
                        </button>
                        <button onClick={() => deleteQuestion(q.id)} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,0,0,0.05)', color: '#f87171' }}>
                          删除
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {q.options.map((opt, i) => (
                        <div key={opt.id} className="flex items-center gap-2 text-xs">
                          <span style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>{String.fromCharCode(65 + i)}</span>
                          <span style={{ color: '#8892a4' }}>{opt.label}</span>
                          {opt.score !== null && (
                            <span className="ml-auto" style={{ color: 'var(--wbti-accent)', fontFamily: 'var(--font-tech)' }}>{opt.score}分</span>
                          )}
                          {opt.value && (
                            <span className="ml-auto" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>{opt.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
