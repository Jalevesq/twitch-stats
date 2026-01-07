'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
    id: string
    content: string
    sender: 'user' | 'bot'
    timestamp: Date
}

export default function ChatBotPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = (content: string) => {
        if (!content.trim()) return

        const userMessage: Message = {
            id: crypto.randomUUID(),
            content: content.trim(),
            sender: 'user',
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')

        // TODO: Call your bot API here and use addBotMessage with the response
        // Example: simulateBotResponse(content)
    }

    const addBotMessage = (content: string) => {
        const botMessage: Message = {
            id: crypto.randomUUID(),
            content,
            sender: 'bot',
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
    }

    // Example: Simulate a bot response (replace with real API call)
    const simulateBotResponse = (userMessage: string) => {
        setTimeout(() => {
            addBotMessage(`You said: "${userMessage}". I'm a bot and this is a placeholder response!`)
        }, 1000)
    }

    const handleSend = () => {
        if (!input.trim()) return
        sendMessage(input)
        // Uncomment to test bot responses:
        // simulateBotResponse(input)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] relative">
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-[#0a0a0a]/70 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                <div className="text-center">
                    <span className="text-2xl font-display text-white">Coming Soon</span>
                    <p className="text-white/40 text-sm mt-2">ChatBot is under development</p>
                </div>
            </div>

            <h1 className="text-3xl font-display mb-6">ChatBot</h1>

            {/* Messages Area */}
            <div className="flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]/50 p-4 mb-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <p className="text-white/40 text-center mt-8">No messages yet. Start a conversation!</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-xl px-4 py-3 ${
                                        message.sender === 'user'
                                            ? 'bg-[#9146ff] text-white'
                                            : 'bg-white/10 text-white'
                                    }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p
                                        className={`text-xs mt-1 ${
                                            message.sender === 'user' ? 'text-white/60' : 'text-white/40'
                                        }`}
                                    >
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#9146ff]"
        />
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="px-6 py-3 bg-[#9146ff] hover:bg-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    )
}