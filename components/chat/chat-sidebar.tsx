'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useParams, usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

interface ChatSidebarProps {
    chats: any[];
    className?: string;
    currentUserId: string;
}

export function ChatSidebar({ chats, className, currentUserId }: ChatSidebarProps) {
    const params = useParams();
    const activeId = params?.id as string;
    const pathname = usePathname();

    // On mobile, if we are in a specific chat (activeId exists), we might hide the sidebar? 
    // Or we rely on the layout to switch views.
    // For now, let's assume this component just renders the list.

    return (
        <div className={cn("flex flex-col h-full bg-white border-r", className)}>

            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm py-10">
                        <p>Nenhuma conversa.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {chats.map((chat) => {
                            const lastMsg = chat.messages[0];
                            const isActive = activeId === chat.id;

                            const isVet = currentUserId === chat.vetId;
                            const recipientName = isVet ? chat.tutor.user.name : (chat.vet?.name || 'Veterinário');

                            return (
                                <Link
                                    key={chat.id}
                                    href={`/dashboard/chat/${chat.id}`}
                                    className={cn(
                                        "p-4 border-b border-gray-50 hover:bg-muted/50 transition-colors flex gap-3 items-start",
                                        isActive && "bg-primary/5 border-l-4 border-l-primary border-b-transparent"
                                    )}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${recipientName}`} />
                                        <AvatarFallback>{recipientName?.[0]}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={cn("font-medium text-sm truncate", isActive && "text-primary")}>
                                                {recipientName}
                                            </span>
                                            {lastMsg && (
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false, locale: ptBR })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {lastMsg ? (
                                                <span className={cn(isActive && "text-primary/70")}>
                                                    {lastMsg.senderId === currentUserId ? 'Você: ' : ''}
                                                    {lastMsg.type === 'IMAGE' ? '📷 Imagem' : lastMsg.type === 'AUDIO' ? '🎤 Áudio' : lastMsg.content}
                                                </span>
                                            ) : (
                                                <span className="italic opacity-70">Nova conversa</span>
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
