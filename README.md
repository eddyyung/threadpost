Hot Threads - Modern UI + Supabase + Threads Crawler (synchronous)
===============================================================

Quickstart:
1. Copy .env.example to .env.local and fill in Supabase keys.
2. Install:
   npm install
3. Run dev:
   npm run dev
4. Open http://localhost:3000/hot

Deploy:
- Push to GitHub and connect to Vercel. Add env vars in Vercel:
  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
