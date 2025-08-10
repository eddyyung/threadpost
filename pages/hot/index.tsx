'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import HotControl from '@/components/HotControl'
import ArticleCard from '@/components/ArticleCard'
import Pagination from '@/components/Pagination'
import { exportToExcel, exportToPDF } from '@/lib/exportClient'

type Article = {
  id: string
  title?: string
  excerpt?: string
  like_count?: number
  created_at?: string
  author?: { name?: string }
}

export default function HotPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [minLikes, setMinLikes] = useState(100)
  const [tag, setTag] = useState('')

  useEffect(() => {
    fetchPage(page, minLikes, tag)
  }, [page, minLikes, tag])

  async function fetchPage(p: number, minLikesVal: number, tagVal: string) {
    // build filter
    if (tagVal && tagVal.trim() !== '') {
      const tagResp = await supabase.from('tags').select('id').eq('name', tagVal).single()
      if (tagResp.error || !tagResp.data) {
        setArticles([])
        setTotal(0)
        await logSearch(minLikesVal, tagVal, 0)
        return
      }
      const tagId = tagResp.data.id
      const atResp = await supabase.from('article_tags').select('article_id').eq('tag_id', tagId)
      if (atResp.error) {
        console.error(atResp.error)
        setArticles([])
        setTotal(0)
        await logSearch(minLikesVal, tagVal, 0)
        return
      }
      const articleIds = atResp.data.map((r: any) => r.article_id)
      if (articleIds.length === 0) {
        setArticles([])
        setTotal(0)
        await logSearch(minLikesVal, tagVal, 0)
        return
      }
      const countResp = await supabase.from('articles').select('id', { count: 'exact', head: false }).in('id', articleIds).gte('like_count', minLikesVal)
      const totalCount = (countResp.count as number) || 0
      const offset = (p - 1) * pageSize
      const pageResp = await supabase.from('articles').select('id, title, excerpt, like_count, created_at, author_id').in('id', articleIds).gte('like_count', minLikesVal).order('like_count', { ascending: false }).range(offset, offset + pageSize - 1)
      if (pageResp.error) {
        console.error(pageResp.error)
        setArticles([])
        setTotal(0)
        await logSearch(minLikesVal, tagVal, 0)
        return
      }
      const authorIds = Array.from(new Set(pageResp.data.map((r: any) => r.author_id).filter(Boolean)))
      let authorsMap: Record<string, any> = {}
      if (authorIds.length > 0) {
        const authResp = await supabase.from('authors').select('id, name').in('id', authorIds)
        if (!authResp.error && authResp.data) {
          (authResp.data as any[]).forEach(a => { authorsMap[a.id] = a })
        }
      }
      const enriched = pageResp.data.map((r: any) => ({ ...r, author: authorsMap[r.author_id] || null }))
      setArticles(enriched)
      setTotal(totalCount)
      await logSearch(minLikesVal, tagVal, totalCount)
      return
    } else {
      const countResp = await supabase.from('articles').select('id', { count: 'exact', head: false }).gte('like_count', minLikesVal)
      const totalCount = (countResp.count as number) || 0
      const offset = (p - 1) * pageSize
      const pageResp = await supabase.from('articles').select('id, title, excerpt, like_count, created_at, author_id').gte('like_count', minLikesVal).order('like_count', { ascending: false }).range(offset, offset + pageSize - 1)
      if (pageResp.error) {
        console.error(pageResp.error)
        setArticles([])
        setTotal(0)
        await logSearch(minLikesVal, tagVal, 0)
        return
      }
      const authorIds = Array.from(new Set(pageResp.data.map((r: any) => r.author_id).filter(Boolean)))
      let authorsMap: Record<string, any> = {}
      if (authorIds.length > 0) {
        const authResp = await supabase.from('authors').select('id, name').in('id', authorIds)
        if (!authResp.error && authResp.data) {
          (authResp.data as any[]).forEach(a => { authorsMap[a.id] = a })
        }
      }
      const enriched = pageResp.data.map((r: any) => ({ ...r, author: authorsMap[r.author_id] || null }))
      setArticles(enriched)
      setTotal(totalCount)
      await logSearch(minLikesVal, tagVal, totalCount)
      return
    }
  }

  async function logSearch(minLikesVal: number, tagVal: string, resultCount: number) {
    try {
      await fetch('/api/log-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minLikes: minLikesVal, tag: tagVal, resultCount })
      })
    } catch (err) {
      console.error('Log search error', err)
    }
  }

  function onQuery(opts: { minLikes: number; tag?: string }) {
    setMinLikes(opts.minLikes)
    setTag(opts.tag || '')
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function handleExportExcel() {
    const rows = articles.map(a => ({
      title: a.title,
      author: a.author?.name,
      like_count: a.like_count,
      created_at: a.created_at
    }))
    exportToExcel('hot_articles.xlsx', rows)
  }

  function handleExportPDF() {
    const rows = articles.map(a => ({
      title: a.title,
      author: a.author?.name,
      like_count: a.like_count,
      created_at: a.created_at
    }))
    exportToPDF('hot_articles.pdf', rows)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">熱門文章</h1>

      <HotControl onQuery={onQuery} />

      <div className="flex gap-2 my-4">
        <button onClick={handleExportExcel} className="px-3 py-1 bg-green-600 text-white rounded">匯出 Excel</button>
        <button onClick={handleExportPDF} className="px-3 py-1 bg-red-600 text-white rounded">匯出 PDF</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map(a => <ArticleCard key={a.id} article={a} />)}
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      <div className="mt-3 text-sm text-gray-600">第 {page} 頁 / 共 {totalPages} 頁（共 {total} 筆）</div>
    </div>
  )
}
