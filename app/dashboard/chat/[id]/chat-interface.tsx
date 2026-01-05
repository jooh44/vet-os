'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Image as ImageIcon, Mic } from 'lucide-react';
import { sendMessage, getLatestMessages } from '@/lib/chat-actions';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    type: string;
}

interface ChatInterfaceProps {
    sessionId: string;
    initialMessages: Message[];
    currentUserId: string;
    recipientName: string;
    recipientAvatar?: string;
}

export function ChatInterface({ sessionId, initialMessages, currentUserId, recipientName, recipientAvatar }: ChatInterfaceProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Polling fallback instead of direct Supabase Realtime
    useEffect(() => {
        setMessages(initialMessages);

        let isMounted = true;
        const pollMessages = async () => {
            if (!isMounted) return;

            try {
                // Fetch latest messages via Server Action
                const latest = await getLatestMessages(sessionId);
                if (latest && isMounted) {
                    setMessages(latest as any);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }

            // Poll every 5 seconds for a "near-realtime" feel without exposing keys
            if (isMounted) {
                setTimeout(pollMessages, 5000);
            }
        };

        pollMessages();

        return () => {
            isMounted = false;
        };
    }, [sessionId, initialMessages]);

    // Initial Scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header (Simulated if inside iframe, or rely on page header) */}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "flex max-w-[80%] items-end gap-2",
                                isMe ? "flex-row-reverse" : "flex-row"
                            )}>
                                {!isMe && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${recipientName}`} />
                                        <AvatarFallback>{recipientName[0]}</AvatarFallback>
                                    </Avatar>
                                )}

                                <div className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    isMe
                                        ? "bg-primary text-white rounded-br-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                )}>
                                    {msg.content}
                                    <div className={cn(
                                        "text-[10px] mt-1 text-right opacity-70",
                                        isMe ? "text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-border">
                <form
                    ref={formRef}
                    action={async (formData) => {
                        if (!inputValue.trim()) return;
                        await sendMessage(formData);
                        setInputValue('');
                    }}
                    className="flex items-center gap-2"
                >
                    <input type="hidden" name="sessionId" value={sessionId} />

                    <Button type="button" variant="ghost" size="icon" className="text-primary hover:text-primary hover:bg-primary/10 rounded-full">
                        <ImageIcon className="h-5 w-5" />
                    </Button>

                    <Input
                        name="content"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 rounded-full bg-slate-50 border-slate-200 focus:ring-primary h-12"
                        autoComplete="off"
                    />

                    {inputValue.trim() ? (
                        <Button type="submit" size="icon" className="rounded-full bg-primary h-12 w-12 hover:bg-primary/90 transition-all">
                            <Send className="h-5 w-5 text-white" />
                        </Button>
                    ) : (
                        <Button type="button" variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-primary/10">
                            <Mic className="h-5 w-5 text-primary" />
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
}
