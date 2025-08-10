import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' })
  }

  try {
    const { userId, minLikes, tag, resultCount } = req.body

    const payload = {
      user_id: userId ?? null,
      query_min_likes: typeof minLikes === 'number' ? minLikes : Number(minLikes) || 0,
      query_tag: tag ?? null,
      result_count: typeof resultCount === 'number' ? resultCount : Number(resultCount) || 0
    }

    const { error } = await supabaseAdmin.from('search_logs').insert([payload])

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ ok: false, error: error.message })
    }

    return res.status(201).json({ ok: true })
  } catch (err: any) {
    console.error('API error:', err)
    return res.status(500).json({ ok: false, error: err.message || 'server error' })
  }
}
