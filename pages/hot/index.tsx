'use client'
import React, { useEffect, useState } from 'react'
import HotControl from '@/components/HotControl'
import ArticleCard from '@/components/ArticleCard'
import Pagination from '@/components/Pagination'
import { supabase } from '@/lib/supabaseClient'

export default function HotPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(6)
  const [total, setTotal] = useState(0)
  const [minLikes, setMinLikes] = useState(100)
  const [tag, setTag] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => { fetchPage(page, minLikes, tag) }, [page, minLikes, tag])

  async function fetchPage(p:number, minLikesVal:number, tagVal:string) {
    if (username) {
      const r = await fetch(`/api/threads?username=${encodeURIComponent(username)}`)
      const json = await r.json()
      if (json.ok && json.data?.length) {
        await fetch('/api/save-posts', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, posts: json.data }) })
      }
    }

    let q = supabase.from('threads_posts').select('id, source_username, post_id, text, author_name, created_at, url', { count: 'exact' }).gte('created_at', '1900-01-01')
    const offset = (p-1)*pageSize
    const resp = await q.order('created_at', { ascending: false }).range(offset, offset + pageSize - 1)
    if (resp.error) { console.error(resp.error); setArticles([]); setTotal(0); return }
    setArticles(resp.data || [])
    setTotal(resp.count || 0)
    await fetch('/api/log-search', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ minLikes: minLikesVal, tag: tagVal, resultCount: resp.count || 0 }) })
  }

  function onQuery(opts: { minLikes:number; tag?:string }) {
    setMinLikes(opts.minLikes)
    setTag(opts.tag || '')
    setPage(1)
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-4 flex gap-2">
        <input placeholder="Threads username (optional)" value={username} onChange={e=>setUsername(e.target.value)} className="border p-2 rounded w-64" />
        <HotControl onQuery={onQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map(a => <ArticleCard key={a.id} article={a} />)}
      </div>

      <Pagination page={page} setPage={setPage} totalPages={Math.max(1, Math.ceil(total / pageSize))} />
      <div className="mt-3 text-sm text-gray-600">第 {page} 頁 / 共 {Math.max(1, Math.ceil(total / pageSize))} 頁（共 {total} 筆）</div>
    </div>
  )
}
