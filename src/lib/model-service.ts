import { Message } from '@/hooks/use-conversations'

export interface ModelSettings {
  modelName: string
  temperature: number
  maxTokens: number
  topP: number
  systemPrompt?: string
}

export interface StreamCallbacks {
  onStart?: () => void
  onToken?: (token: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void
}

class ModelService {
  private apiEndpoint: string
  private defaultModel: string
  private defaultSystemPrompt: string

  constructor() {
    this.apiEndpoint = process.env.OLLAMA_API_URL || 'http://localhost:11434'
    this.defaultModel = process.env.DEFAULT_MODEL || 'llama2'
    this.defaultSystemPrompt = 'You are a helpful AI assistant. Respond concisely and accurately.'
  }

  async chat(
    messages: Message[],
    settings: ModelSettings,
    callbacks?: StreamCallbacks
  ) {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.modelName || this.defaultModel,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          stream: Boolean(callbacks),
          options: {
            temperature: settings.temperature || 0.7,
            top_p: settings.topP || 0.9,
            num_predict: settings.maxTokens || 2000,
            stop: ['</s>', '[/INST]'], // Llama 2 specific stop tokens
            system: settings.systemPrompt || this.defaultSystemPrompt,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Model API error: ${error}`)
      }

      if (callbacks) {
        callbacks.onStart?.()
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(Boolean)

            for (const line of lines) {
              try {
                const json = JSON.parse(line)
                if (json.response) {
                  callbacks.onToken?.(json.response)
                  fullText += json.response
                }
              } catch (e) {
                console.error('Error parsing streaming response:', e)
              }
            }
          }

          callbacks.onComplete?.(fullText)
          return fullText
        }
      } else {
        const data = await response.json()
        return data.message.content
      }
    } catch (error) {
      const e = error as Error
      callbacks?.onError?.(e)
      throw e
    }
  }

  async summarize(messages: Message[]) {
    try {
      const response = await this.chat(
        [
          {
            id: 'system',
            role: 'system',
            content: 'Please provide a concise summary of the following conversation.',
            createdAt: new Date(),
          },
          {
            id: 'user',
            role: 'user',
            content: JSON.stringify(messages),
            createdAt: new Date(),
          },
        ],
        {
          modelName: this.defaultModel,
          temperature: 0.3,
          maxTokens: 500,
          topP: 0.9,
        }
      )

      return response
    } catch (error) {
      console.error('Error summarizing conversation:', error)
      throw error
    }
  }

  async generateTitle(firstMessage: string) {
    try {
      const response = await this.chat(
        [
          {
            id: 'system',
            role: 'system',
            content: 'Generate a short, descriptive title (max 50 characters) for a conversation that starts with this message.',
            createdAt: new Date(),
          },
          {
            id: 'user',
            role: 'user',
            content: firstMessage,
            createdAt: new Date(),
          },
        ],
        {
          modelName: this.defaultModel,
          temperature: 0.7,
          maxTokens: 50,
          topP: 0.9,
        }
      )

      return response
    } catch (error) {
      console.error('Error generating title:', error)
      return firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '')
    }
  }
}

export const modelService = new ModelService() 