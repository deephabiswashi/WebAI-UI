'use client'

import * as React from 'react'
import { Message } from '@/hooks/use-conversations'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, User, Bot, Check, Image, FileText, Paperclip } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ChatMessagesProps {
  messages: Message[]
  streamingMessage?: string
}

export function ChatMessages({ messages, streamingMessage }: ChatMessagesProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy to clipboard')
    }
  }

  const renderAttachment = (attachment: any) => {
    const isImage = attachment.fileType.startsWith('image/')
    const icon = isImage ? Image : FileText

    return (
      <div
        key={attachment.id}
        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          {React.createElement(icon, { className: 'w-4 h-4 text-blue-500' })}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.filename}</p>
          <p className="text-xs text-gray-400">
            {(attachment.fileSize / 1024).toFixed(1)} KB
          </p>
        </div>
        <a
          href={attachment.filePath}
          download
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </a>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-500" />
            </div>
          )}
          <div
            className={`chat-bubble ${
              message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {message.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>

            {message.attachments?.length > 0 && (
              <div className="mb-4 space-y-2">
                {message.attachments.map(renderAttachment)}
              </div>
            )}

            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const id = `${message.id}-${match?.[1] || 'code'}`
                    return !inline && match ? (
                      <div className="relative group">
                        <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(String(children), id)}
                            className="p-2 rounded-lg bg-gray-800/50 
                                     hover:bg-gray-800 transition-all duration-200 
                                     opacity-0 group-hover:opacity-100"
                          >
                            {copiedId === id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          language={match[1]}
                          style={vscDarkPlus}
                          PreTag="div"
                          className="!mt-0 !mb-0 !bg-black/50 !rounded-xl !border !border-white/10"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="px-1.5 py-0.5 rounded-md bg-black/30 text-blue-400 text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {message.content || ''}
              </ReactMarkdown>
            </div>
          </div>
          {message.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </div>
          )}
        </div>
      ))}
      {streamingMessage && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-500" />
          </div>
          <div className="chat-bubble chat-bubble-assistant">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">Assistant</span>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="markdown-content">
              <ReactMarkdown>{streamingMessage}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
} 