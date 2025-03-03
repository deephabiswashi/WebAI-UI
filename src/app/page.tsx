'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/chat-interface'
import { Sidebar } from '@/components/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
        isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} />
      
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="glass-card m-4 flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="glass-button flex items-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="gradient-text font-semibold">Menu</span>
          </button>
          <div className="flex items-center gap-4">
            <h1 className="gradient-text text-2xl font-bold">AI Chat Interface</h1>
            <ThemeToggle />
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden p-4">
          <ChatInterface />
        </div>
      </main>
    </div>
  )
} 