'use client'

import { useEffect, useState } from 'react'

interface TestRecord {
  id: number
  userId: string
  resultCode: string
  resultName: string
  similarity: number
  userVector: string
  isSpecial: boolean
  createdAt: string
}

export default function AdminResults() {
  const [records, setRecords] = useState<TestRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const totalPages = Math.ceil(total / 20)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/results?page=${page}&limit=20`)
      .then(r => r.json())
      .then(data => { setRecords(data.records); setTotal(data.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-tech)', color: 'var(--wbti-accent)', letterSpacing: '2px' }}>
        测试记录
        <span className="text-xs font-normal ml-3" style={{ color: '#5a6478' }}>共 {total} 条</span>
      </h1>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#5a6478' }}>Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#5a6478' }}>
                  <th className="text-left py-3 px-3 font-medium">ID</th>
                  <th className="text-left py-3 px-3 font-medium">用户</th>
                  <th className="text-left py-3 px-3 font-medium">结果</th>
                  <th className="text-left py-3 px-3 font-medium">匹配度</th>
                  <th className="text-left py-3 px-3 font-medium">向量</th>
                  <th className="text-left py-3 px-3 font-medium">时间</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                    <td className="py-2.5 px-3" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>{r.id}</td>
                    <td className="py-2.5 px-3 truncate max-w-[100px]" style={{ color: '#5a6478' }} title={r.userId}>
                      {r.userId.slice(0, 8)}...
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium" style={{ color: r.isSpecial ? 'var(--wbti-warm)' : '#e0e4ea' }}>
                        {r.resultName}
                      </span>
                      <span className="ml-1.5" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)' }}>{r.resultCode}</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold" style={{ color: 'var(--wbti-accent)', fontFamily: 'var(--font-tech)' }}>
                      {r.similarity}%
                    </td>
                    <td className="py-2.5 px-3" style={{ color: '#5a6478', fontFamily: 'var(--font-tech)', fontSize: '0.6rem' }}>
                      {r.userVector}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: '#5a6478' }}>
                      {new Date(r.createdAt).toLocaleString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#8892a4' }}
              >
                上一页
              </button>
              <span className="text-xs px-2" style={{ color: '#5a6478' }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#8892a4' }}
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
