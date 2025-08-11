import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })
  try {
    const { username, posts } = req.body
    if (!Array.isArray(posts)) return res.status(400).json({ error: 'posts array required' })
    const rows = posts.map((p: any) => ({
      source_username: username,
      post_id: p.post_id,
      text: p.text,
      author_name: p.author_name,
      created_at: p.created_at,
      url: p.url,
      raw: p.raw || null
    }))
    const { error } = await supabaseAdmin.from('threads_posts').insert(rows)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ok: true, inserted: rows.length })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
}
