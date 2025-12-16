'use client';

import { useFred } from './fred-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';

export function FredFloatingWidget() {
    const { isOpen, toggle, pageContext } = useFred();

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [queue, setQueue] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Queue Processor
    useEffect(() => {
        const processQueue = async () => {
            if (isProcessing || queue.length === 0) return;

            const currentMessageContent = queue[0];
            setIsProcessing(true);

            // Remove from queue immediately so we don't process it again
            setQueue(prev => prev.slice(1));

            const userMessage = { id: Date.now().toString(), role: 'user', content: currentMessageContent };
            // Note: We might have already added it to UI optimistically? 
            // Better strategy: Add to UI when user submits, push to a "pendingQueue" which is just strings?
            // Yes.

            // Actually, if we add to UI on submit, we need to make sure we don't duplicate.
            // Simplified: User submit -> Add User Msg to UI -> Add content to Queue.
            // Processor -> Take content -> Call API -> Add Assistant Msg to UI -> Stream.

            try {
                // Prepare context just in time? Or use current? Using current.

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // Send all previous messages + current
                        messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
                        context: pageContext
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Server error: ${response.status} ${errText}`);
                }
                if (!response.body) throw new Error("No response body");

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                // Create placeholder for assistant
                const assistantId = (Date.now() + 1).toString();
                setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });

                    setMessages(prev => {
                        const newMsgs = [...prev];
                        const lastMsgIndex = newMsgs.findIndex(m => m.id === assistantId);
                        if (lastMsgIndex !== -1) {
                            newMsgs[lastMsgIndex] = {
                                ...newMsgs[lastMsgIndex],
                                content: newMsgs[lastMsgIndex].content + chunk
                            };
                        }
                        return newMsgs;
                    });
                }

            } catch (error: any) {
                console.error("Chat processing error:", error);
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `⚠️ Erro: ${error.message || 'Falha na comunicação.'}`
                }]);
            } finally {
                setIsProcessing(false);
            }
        };

        processQueue();
    }, [queue, isProcessing, messages, pageContext]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const content = input;
        setInput('');

        // Optimistic update for User Message
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content }]);

        // Add to queue
        setQueue(prev => [...prev, content]);
    };

    // Hide on Chat Pages to avoid overlap
    const pathname = usePathname();
    if (pathname?.startsWith('/dashboard/chat')) return null;

    return (
        <div className="fixed bottom-24 right-6 md:bottom-6 z-50 flex flex-col items-end gap-2">
            {/* Chat Window */}
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out transform origin-bottom-right",
                    isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-95 opacity-0 translate-y-4 pointer-events-none hidden"
                )}
            >
                <Card className="w-[350px] md:w-[400px] h-[500px] shadow-2xl border-2 border-primary/10 flex flex-col">
                    <CardHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5 flex flex-col space-y-2">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary/20 p-1.5 rounded-lg">
                                    <span className="text-xl">🩺</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Fred Clinical Copilot</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8 text-black/50 hover:text-black">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Trust Badge / Context Indicator */}
                        {pageContext?.petName && (
                            <div className="bg-primary/10 border border-primary/20 rounded-md px-3 py-1.5 flex items-center gap-2 text-xs text-primary-700 animate-in fade-in slide-in-from-top-2">
                                <span className="text-lg">🐕</span>
                                <span className="font-medium">Contexto Ativo: <strong>{pageContext.petName}</strong></span>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            <div className="flex flex-col gap-3">
                                {messages.length === 0 && (
                                    <div className="text-center text-muted-foreground mt-20 text-sm p-4">
                                        <p>Olá! Sou o Fred.</p>
                                        <p>Como posso ajudar você hoje?</p>
                                    </div>
                                )}

                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={cn(
                                            "flex flex-col max-w-[85%]",
                                            m.role === 'user' ? "self-end items-end" : "self-start items-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "rounded-lg px-3 py-2 text-sm",
                                                m.role === 'user'
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-foreground"
                                            )}
                                        >
                                            {m.role === 'assistant' && !m.content ? (
                                                <span className="animate-pulse">...</span>
                                            ) : (
                                                m.content
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isProcessing && messages[messages.length - 1]?.role === 'user' && (
                                    <div className="self-start items-start max-w-[85%]">
                                        <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm">
                                            <span className="animate-pulse">...</span>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-4 pt-2">
                        <form
                            onSubmit={handleSubmit}
                            className="flex w-full gap-2"
                        >
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Pergunte ao Fred..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={!input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={toggle}
                size="lg"
                className={cn(
                    "rounded-full h-14 w-14 shadow-xl transition-transform hover:scale-105",
                    isOpen ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-primary"
                )}
            >
                <MessageCircle className={cn("h-6 w-6", isOpen && "hidden")} />
                <X className={cn("h-6 w-6", !isOpen && "hidden")} />
            </Button>
        </div>
    );
}
