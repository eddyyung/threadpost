type CacheEntry = { ts: number, data: any }
const cache = new Map<string, CacheEntry>()
const TTL = Number(process.env.THREADS_CACHE_TTL_SECONDS || 300)

export function getCache(key: string) {
  const e = cache.get(key)
  if (!e) return null
  if (Date.now() - e.ts > TTL * 1000) { cache.delete(key); return null }
  return e.data
}

export function setCache(key: string, data: any) {
  cache.set(key, { ts: Date.now(), data })
}

const rateMap = new Map<string, { ts: number, count: number }>();
const RATE_LIMIT = Number(process.env.THREADS_RATE_LIMIT_PER_MIN || 10);

export function allowedRate(ip: string) {
  const now = Math.floor(Date.now() / 60000) // minute
  const st = rateMap.get(ip)
  if (!st || st.ts !== now) {
    rateMap.set(ip, { ts: now, count: 1 })
    return true
  }
  if (st.count >= RATE_LIMIT) return false
  st.count++
  return true
}
