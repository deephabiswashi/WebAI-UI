'use client'

import * as React from 'react'
import { Conversation } from '@/hooks/use-conversations'
import { useConversations } from '@/hooks/use-conversations'
import { Settings } from 'lucide-react'

interface ChatSettingsProps {
  conversation: Conversation
}

export function ChatSettings({ conversation }: ChatSettingsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { updateConversationSettings } = useConversations()
  const [settings, setSettings] = React.useState(conversation.settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateConversationSettings(conversation.id, settings)
    setIsOpen(false)
  }

  return (
    <div className="border-t dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </div>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Model Name</label>
            <input
              type="text"
              value={settings?.modelName || ''}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, modelName: e.target.value }))
              }
              className="w-full p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Temperature ({settings?.temperature || 0.7})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings?.temperature || 0.7}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  temperature: parseFloat(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Max Tokens ({settings?.maxTokens || 2000})
            </label>
            <input
              type="range"
              min="1"
              max="32000"
              step="100"
              value={settings?.maxTokens || 2000}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  maxTokens: parseInt(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Top P ({settings?.topP || 1.0})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings?.topP || 1.0}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  topP: parseFloat(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">System Prompt</label>
            <textarea
              value={settings?.systemPrompt || ''}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  systemPrompt: e.target.value,
                }))
              }
              className="w-full p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Settings
          </button>
        </form>
      )}
    </div>
  )
} 