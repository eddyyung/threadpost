'use client'
import React from 'react'

export default function Nav() {
  return (
    <header className="header p-4 text-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="font-bold text-lg">ThreadHot</div>
        <nav className="flex gap-3">
          <a href="/hot" className="px-3 py-1 bg-white/10 rounded">熱門</a>
          <a href="/admin/logs" className="px-3 py-1 bg-white/10 rounded">紀錄</a>
        </nav>
      </div>
    </header>
  )
}
