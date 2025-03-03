'use client'

import * as React from 'react'
import { Message } from '@/hooks/use-conversations'
import { usePrisma } from '@/lib/prisma'
import { useConversations } from '@/hooks/use-conversations'
import { modelService } from '@/lib/model-service'
import { toast } from 'react-hot-toast'

export function useChat(conversationId?: string) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [streamingMessage, setStreamingMessage] = React.useState('')
  const prisma = usePrisma()
  const { activeConversation } = useConversations()

  React.useEffect(() => {
    if (conversationId) {
      loadMessages()
    }
  }, [conversationId])

  const loadMessages = async () => {
    try {
      const data = await prisma.message.findMany({
        where: {
          conversationId: conversationId!,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
      toast.error('Failed to load messages')
    }
  }

  const sendMessage = async (content: string, files?: File[]) => {
    if (!conversationId || !activeConversation) return

    setIsLoading(true)
    setStreamingMessage('')

    try {
      // Create user message
      const userMessage = await prisma.message.create({
        data: {
          content,
          role: 'user',
          conversationId,
        },
      })

      // Handle file uploads if any
      if (files && files.length > 0) {
        for (const file of files) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('conversationId', conversationId)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error('Failed to upload file')
          }

          await prisma.attachment.create({
            data: {
              filename: file.name,
              fileType: file.type,
              fileSize: file.size,
              filePath: `/uploads/${file.name}`,
              conversationId,
              messageId: userMessage.id,
            },
          })
        }
      }

      // Update messages state with user message
      setMessages((prev) => [...prev, userMessage])

      // Get AI response with streaming
      const assistantMessage = await prisma.message.create({
        data: {
          content: '',
          role: 'assistant',
          conversationId,
        },
      })

      try {
        const response = await modelService.chat(
          [...messages, userMessage],
          {
            modelName: activeConversation.settings?.modelName || 'llama2',
            temperature: activeConversation.settings?.temperature || 0.7,
            maxTokens: activeConversation.settings?.maxTokens || 2000,
            topP: activeConversation.settings?.topP || 1.0,
            systemPrompt: activeConversation.settings?.systemPrompt,
          },
          {
            onStart: () => {
              setStreamingMessage('')
              setMessages((prev) => [...prev, { ...assistantMessage, content: '' }])
            },
            onToken: (token) => {
              setStreamingMessage((prev) => prev + token)
            },
            onComplete: async (fullText) => {
              // Update the assistant message with the complete response
              await prisma.message.update({
                where: { id: assistantMessage.id },
                data: { content: fullText },
              })

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id ? { ...msg, content: fullText } : msg
                )
              )
              setStreamingMessage('')

              // Update conversation title if it's the first message
              if (messages.length === 0) {
                const title = await modelService.generateTitle(content)
                await prisma.conversation.update({
                  where: { id: conversationId },
                  data: { title },
                })
              }
            },
            onError: (error) => {
              console.error('Error getting AI response:', error)
              toast.error('Failed to get AI response')
            },
          }
        )
      } catch (error) {
        console.error('Error in chat:', error)
        toast.error('Failed to get AI response')
        
        // Delete the empty assistant message on error
        await prisma.message.delete({
          where: { id: assistantMessage.id },
        })
        
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id))
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    sendMessage,
    isLoading,
    streamingMessage,
  }
} 