'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  useEffect(()=>{ fetchLogs() }, [])
  async function fetchLogs() {
    const r = await supabase.from('search_logs').select('*').order('created_at', { ascending: false }).limit(100)
    if (!r.error) setLogs(r.data || [])
  }
  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-xl font-semibold mb-4">Search Logs</h1>
      <div className="space-y-2">
        {logs.map(l => (
          <div key={l.id} className="p-3 bg-white/90 dark:bg-slate-900 rounded shadow">
            <div className="text-sm">query_min_likes: {l.query_min_likes} tag: {l.query_tag}</div>
            <div className="text-xs text-gray-500">result_count: {l.result_count} at {l.created_at}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
