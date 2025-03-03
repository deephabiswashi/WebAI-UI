'use client'

import { useState, useEffect } from 'react'
import { usePrisma } from '@/lib/prisma'

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  settings?: ConversationSettings
  summary?: string
}

export interface Message {
  id: string
  content: string
  role: string
  createdAt: Date
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  filename: string
  fileType: string
  fileSize: number
  filePath: string
  createdAt: Date
}

export interface ConversationSettings {
  modelName: string
  temperature: number
  maxTokens: number
  topP: number
  systemPrompt?: string
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const prisma = usePrisma()

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const data = await prisma.conversation.findMany({
        include: {
          messages: true,
          settings: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
      setConversations(data)
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const createConversation = async () => {
    try {
      const newConversation = await prisma.conversation.create({
        data: {
          title: 'New Chat',
          settings: {
            create: {
              modelName: 'llama2',
              temperature: 0.7,
              maxTokens: 2000,
              topP: 1.0,
            },
          },
        },
        include: {
          messages: true,
          settings: true,
        },
      })
      setConversations((prev) => [newConversation, ...prev])
      setActiveConversation(newConversation)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const deleteConversation = async (id: string) => {
    try {
      await prisma.conversation.delete({
        where: { id },
      })
      setConversations((prev) => prev.filter((conv) => conv.id !== id))
      if (activeConversation?.id === id) {
        setActiveConversation(null)
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const updateConversationSettings = async (id: string, settings: Partial<ConversationSettings>) => {
    try {
      const updated = await prisma.conversation.update({
        where: { id },
        data: {
          settings: {
            update: settings,
          },
        },
        include: {
          messages: true,
          settings: true,
        },
      })
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? updated : conv))
      )
      if (activeConversation?.id === id) {
        setActiveConversation(updated)
      }
    } catch (error) {
      console.error('Error updating conversation settings:', error)
    }
  }

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    createConversation,
    deleteConversation,
    updateConversationSettings,
  }
} 