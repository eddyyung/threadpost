'use client'
import React, { useState } from 'react'

export default function HotControl({ onQuery }: { onQuery: (opts: { minLikes: number; tag?: string }) => void }) {
  const [minLikes, setMinLikes] = useState<number>(100)
  const [tag, setTag] = useState('')

  return (
    <div className="bg-white/80 dark:bg-slate-800 p-4 rounded shadow">
      <div className="flex gap-2 items-center">
        <label className="text-sm">按讚數大於</label>
        <input type="number" value={minLikes} onChange={e => setMinLikes(Number(e.target.value))} className="border p-1 rounded w-28" />
        <label className="text-sm">標籤</label>
        <input value={tag} onChange={e => setTag(e.target.value)} className="border p-1 rounded" />
        <button onClick={() => onQuery({ minLikes, tag })} className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded">查詢</button>
      </div>
    </div>
  )
}
