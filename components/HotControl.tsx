'use client'
import React, { useState } from 'react'

type Props = { onQuery: (opts: { minLikes: number; tag?: string }) => void }

export default function HotControl({ onQuery }: Props) {
  const [minLikes, setMinLikes] = useState<number>(100)
  const [tag, setTag] = useState<string>('')

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex gap-2 items-center">
        <label>按讚數大於</label>
        <input type="number" value={minLikes} onChange={e => setMinLikes(Number(e.target.value))} className="border p-1 rounded w-24" />
        <label>標籤</label>
        <input value={tag} onChange={e => setTag(e.target.value)} className="border p-1 rounded" />
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => onQuery({ minLikes, tag })}>查詢</button>
      </div>
    </div>
  )
}
