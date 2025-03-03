'use client'

import * as React from 'react'
import { Send, Paperclip, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = React.useState('')
  const [files, setFiles] = React.useState<File[]>([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles])
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() || files.length > 0) {
      onSend(message, files)
      setMessage('')
      setFiles([])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="glass-card flex items-center gap-2 px-3 py-2"
            >
              <Paperclip className="w-4 h-4 text-blue-500" />
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-red-500/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <div
          {...getRootProps()}
          className={`flex-1 input-field ${
            isDragActive ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || (!message.trim() && files.length === 0)}
          className="glass-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          <span>Send</span>
        </button>
      </div>
    </form>
  )
} 