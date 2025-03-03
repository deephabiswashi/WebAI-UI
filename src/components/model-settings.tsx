'use client'

import { Settings } from 'lucide-react'
import { useState } from 'react'
import { ConversationSettings } from '@/hooks/use-conversations'

interface ModelSettingsProps {
  settings: ConversationSettings
  onUpdate: (settings: Partial<ConversationSettings>) => void
}

export function ModelSettings({ settings, onUpdate }: ModelSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 p-4 glass-panel z-50">
          <h3 className="text-lg font-semibold mb-4">Model Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => onUpdate({ temperature: parseFloat(e.target.value) })}
                className="settings-slider"
              />
              <div className="text-sm text-gray-400 mt-1">
                {settings.temperature} - Higher values make output more random
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Max Tokens
              </label>
              <input
                type="range"
                min="100"
                max="4000"
                step="100"
                value={settings.maxTokens}
                onChange={(e) => onUpdate({ maxTokens: parseInt(e.target.value) })}
                className="settings-slider"
              />
              <div className="text-sm text-gray-400 mt-1">
                {settings.maxTokens} - Maximum length of the response
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Top P
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.topP}
                onChange={(e) => onUpdate({ topP: parseFloat(e.target.value) })}
                className="settings-slider"
              />
              <div className="text-sm text-gray-400 mt-1">
                {settings.topP} - Controls diversity of responses
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                System Prompt
              </label>
              <textarea
                value={settings.systemPrompt}
                onChange={(e) => onUpdate({ systemPrompt: e.target.value })}
                className="input-field h-24 resize-none"
                placeholder="Enter a system prompt to guide the model's behavior..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 