'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const models = [
  { id: 'financial-bert', name: 'Financial BERT' },
  { id: 'finbert', name: 'FinBERT' },
  { id: 'fin-gpt', name: 'FinGPT' },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [model, setModel] = useState(models[0].id)

  const handleSend = async () => {
    if (input.trim() === '') return

    const newMessages = [
      ...messages,
      { role: 'user', content: input } as Message
    ]
    setMessages(newMessages)
    setInput('')

    // Simulated API call
    const response = await simulateHuggingFaceInference(input, model)
    setMessages([...newMessages, { role: 'assistant', content: response } as Message])
  }

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.role === 'user' ? 'U' : 'A'}</AvatarFallback>
                </Avatar>
                <div className={`mx-2 p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Input
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Simulated Hugging Face Inference API call
async function simulateHuggingFaceInference(input: string, model: string): Promise<string> {
  // In a real application, you would make an API call to Hugging Face here
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate API delay
  return `This is a simulated response from the ${model} model for the input: "${input}"`
}

