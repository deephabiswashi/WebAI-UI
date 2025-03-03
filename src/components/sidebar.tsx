'use client'

import * as React from 'react'
import { Plus, Trash2, MessageSquare, Settings } from 'lucide-react'
import { useConversations } from '@/hooks/use-conversations'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { conversations, createConversation, deleteConversation, activeConversation, setActiveConversation } = useConversations()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-80 bg-gray-900/95 backdrop-blur-xl border-r border-white/10`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white/10">
          <button
            onClick={createConversation}
            className="glass-button w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="gradient-text font-semibold">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`sidebar-item ${
                activeConversation?.id === conversation.id ? 'sidebar-item-active' : ''
              }`}
              onClick={() => setActiveConversation(conversation)}
            >
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">
                  {conversation.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conversation.id)
                }}
                className="p-1 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button className="sidebar-item w-full">
            <Settings className="w-5 h-5 text-blue-500" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  )
} 