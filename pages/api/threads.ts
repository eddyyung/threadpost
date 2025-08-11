import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { getCache, setCache, allowedRate } from '@/lib/threadsCache'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query
  if (!username || Array.isArray(username)) return res.status(400).json({ error: 'username required' })
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  if (!allowedRate(String(ip))) {
    return res.status(429).json({ error: 'rate limited' })
  }

  const key = `threads:${username}`
  const cached = getCache(key)
  if (cached) return res.status(200).json({ ok: true, cached: true, data: cached })

  try {
    const url = `https://www.threads.net/@${username}`
    const r = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } , timeout: 8000 })
    const $ = cheerio.load(r.data)
    const scripts = $('script[type="application/ld+json"]')
    const posts: any[] = []
    scripts.each((i, s) => {
      const txt = $(s).html()
      if (!txt) return
      try {
        const j = JSON.parse(txt)
        if (Array.isArray(j)) {
          j.forEach(item => {
            if (item['@type'] === 'SocialMediaPosting') {
              posts.push({
                post_id: item.identifier || item.url,
                text: item.articleBody || item.text || '',
                author_name: item.author?.name || username,
                created_at: item.datePublished || null,
                url: item.url || null,
                raw: item
              })
            }
          })
        } else {
          if (j['@type'] === 'SocialMediaPosting') {
            posts.push({
              post_id: j.identifier || j.url,
              text: j.articleBody || j.text || '',
              author_name: j.author?.name || username,
              created_at: j.datePublished || null,
              url: j.url || null,
              raw: j
            })
          }
        }
      } catch (e) { }
    })

    setCache(key, posts)
    return res.status(200).json({ ok: true, cached: false, data: posts })
  } catch (err: any) {
    console.error('threads fetch error', err.message || err)
    return res.status(500).json({ ok: false, error: 'fetch failed' })
  }
}
