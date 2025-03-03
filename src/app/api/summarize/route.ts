import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { conversationId } = await req.json()

    // Get conversation messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Format messages for summarization
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Call Ollama API for summarization
    const response = await fetch(process.env.OLLAMA_API_URL + '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        messages: [
          {
            role: 'system',
            content: 'Please provide a concise summary of the following conversation.',
          },
          {
            role: 'user',
            content: JSON.stringify(formattedMessages),
          },
        ],
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9,
          num_predict: 500,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get summary from Ollama')
    }

    const data = await response.json()

    // Update conversation with summary
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        summary: data.message.content,
      },
    })

    return NextResponse.json({ summary: data.message.content })
  } catch (error) {
    console.error('Error in summarize API:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
} 