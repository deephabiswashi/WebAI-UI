import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { message, conversationId, settings } = await req.json()

    // Get conversation history
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Format messages for the API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add system prompt if exists
    if (settings?.systemPrompt) {
      formattedMessages.unshift({
        role: 'system',
        content: settings.systemPrompt,
      })
    }

    // Add current message
    formattedMessages.push({
      role: 'user',
      content: message,
    })

    // Call Ollama API
    const response = await fetch(process.env.OLLAMA_API_URL + '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings?.modelName || 'llama2',
        messages: formattedMessages,
        stream: false,
        options: {
          temperature: settings?.temperature || 0.7,
          top_p: settings?.topP || 1.0,
          num_predict: settings?.maxTokens || 2000,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()

    return NextResponse.json({ message: data.message.content })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 