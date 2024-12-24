'use client'

import * as React from 'react'
import { Plus, ChevronDown, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

const HF_API_TOKEN = process.env.NEXT_PUBLIC_HF_API_TOKEN

const models = [
  { id: 'meta-llama/Llama-3.2-1B-Instruct', name: 'LlamaFin-1B' },
  { id: 'meta-llama/Llama-3.2-3B-Instruct', name: 'LlamaFin-3B' },
  { id: 'meta-llama/Llama-3.1-70B', name: 'LlamaFin-70B' },
]

const examplePrompts = [
  {
    title: 'What are the advantages',
    subtitle: 'of using Next.js?'
  },
  {
    title: 'Write code that',
    subtitle: 'demonstrates dijkstra\'s algorithm'
  },
  {
    title: 'Help me write an essay',
    subtitle: 'about silicon valley'
  },
  {
    title: 'What is the weather',
    subtitle: 'in San Francisco?'
  }
]

const queryHuggingFace = async (userInput: string, modelId: string): Promise<string> => {
  if (!HF_API_TOKEN) {
    throw new Error('Hugging Face API token is not configured');
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: userInput,
          options: {
            wait_for_model: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const result = await response.json();
    if (!result[0] || !result[0].generated_text) {
      throw new Error('Unexpected response format from Hugging Face API');
    }
    return result[0].generated_text;
  } catch (error) {
    console.error('Error in queryHuggingFace:', error);
    throw error;
  }
};

export function Chat() {
  const [message, setMessage] = React.useState('')
  const [model, setModel] = React.useState(models[0].id)
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [error, setError] = React.useState<string | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    const newMessage = { role: 'user' as const, content: message }
    setMessages(prev => [...prev, newMessage])
    setMessage('')

    try {
      const response = await queryHuggingFace(message, model)
      const assistantMessage = { role: 'assistant' as const, content: response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Failed to get response from the model. Please try again.')
      if (err instanceof Error) {
        setError(`Error: ${err.message}`)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">FinSLM</h1>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4" aria-live="polite">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-2xl pt-24 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="h-12 w-12 rotate-180">
                  <div className="absolute h-0 w-0 border-l-[24px] border-r-[24px] border-t-[48px] border-l-transparent border-r-transparent border-t-primary" />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Plus className="h-6 w-6" />
                </div>
              </div>
            </div>
            <p className="mb-2 text-lg">
              This is an <b>open source</b> chatbot built with <b>Next.js</b>. It uses a <b>small language model</b> fine-tuned on <b>financial data</b> to provide solutions to the user's query.
            </p>
            <p className="text-muted-foreground">
              You can learn more about the AI SDK by visiting the <span className="underline">docs</span>.
            </p>

            {/* Example Prompts Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  className="rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted"
                  onClick={() => setMessage(prompt.title + ' ' + prompt.subtitle)}
                >
                  <p className="text-sm">{prompt.title}</p>
                  <p className="text-sm text-muted-foreground">{prompt.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {error && (
              <div className="text-center text-red-500">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} /> {/* This empty div is used as a reference for scrolling */}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
          <div className="relative flex items-center">
            <Textarea
              placeholder="Send a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[48px] w-full resize-none rounded-xl pr-24 pt-3"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading}
              className={cn(
                "absolute right-2 top-2 h-8 w-8 rounded-lg",
                !message.trim() && "opacity-50",
                message.trim() && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

