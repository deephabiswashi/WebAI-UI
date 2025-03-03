import { WebSocketServer } from 'ws'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const wss = new WebSocketServer({ port: parseInt(process.env.WS_PORT || '3001') })

wss.on('connection', (ws) => {
  console.log('Client connected')

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString())
      
      switch (data.type) {
        case 'subscribe':
          // Subscribe to conversation updates
          const conversation = await prisma.conversation.findUnique({
            where: { id: data.conversationId },
            include: {
              messages: true,
              settings: true,
            },
          })
          
          if (conversation) {
            ws.send(JSON.stringify({
              type: 'conversation',
              data: conversation,
            }))
          }
          break

        case 'unsubscribe':
          // Unsubscribe from conversation updates
          break

        default:
          console.warn('Unknown message type:', data.type)
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error)
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Failed to process message',
      }))
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

export async function GET() {
  return NextResponse.json({ status: 'WebSocket server is running' })
} 