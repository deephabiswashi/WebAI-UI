'use client'

import * as React from 'react'
import { useConversations } from '@/hooks/use-conversations'
import { ChatInput } from './chat-input'
import { ChatMessages } from './chat-messages'
import { ChatSettings } from './chat-settings'
import { useChat } from '@/hooks/use-chat'
import { MessageSquare, Settings } from 'lucide-react'

export function ChatInterface() {
  const { activeConversation } = useConversations()
  const { messages, sendMessage, isLoading } = useChat(activeConversation?.id)
  const [showSettings, setShowSettings] = React.useState(false)

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="glass-card p-8 text-center max-w-md">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className="gradient-text text-2xl font-bold mb-2">Welcome to AI Chat</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select a conversation or create a new one to start chatting with the AI.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="glass-card p-4 mb-4 flex items-center justify-between">
        <div>
          <h2 className="gradient-text text-xl font-bold">{activeConversation.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(activeConversation.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="glass-button flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ChatMessages messages={messages} />
          </div>
          <div className="glass-card mt-4 p-4">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="gradient-text text-xl font-bold">Chat Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ChatSettings conversation={activeConversation} />
          </div>
        </div>
      )}
    </div>
  )
} 