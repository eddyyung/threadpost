'use client'
import React from 'react'

export default function Pagination({ page, setPage, totalPages } : { page: number, setPage: (p:number)=>void, totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center gap-2 mt-6">
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">上一頁</button>
      <div className="flex gap-1">
        {pages.map(pn => (
          <button key={pn} onClick={() => setPage(pn)} className={`px-3 py-1 border rounded ${pn === page ? 'bg-blue-600 text-white' : ''}`}>{pn}</button>
        ))}
      </div>
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">下一頁</button>
    </div>
  )
}
