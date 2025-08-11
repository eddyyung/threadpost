import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })
  try {
    const { userId, minLikes, tag, resultCount } = req.body
    const payload = {
      user_id: userId ?? null,
      query_min_likes: Number(minLikes) || 0,
      query_tag: tag ?? null,
      result_count: Number(resultCount) || 0
    }
    const { error } = await supabaseAdmin.from('search_logs').insert([payload])
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ok: true })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
}
