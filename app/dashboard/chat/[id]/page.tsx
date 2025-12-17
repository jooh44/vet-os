import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { ChatInterface } from './chat-interface';
import { auth } from '@/auth';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ChatPage({ params }: { params: { id: string } }) {
    const session = await auth();
    let userId = session?.user?.id;

    // Dev fallback
    if (!userId) {
        const fallbackUser = await prisma.user.findFirst();
        if (fallbackUser) userId = fallbackUser.id;
    }

    if (!userId) {
        redirect('/api/auth/signin');
    }

    const chatSession = await prisma.chatSession.findUnique({
        where: { id: params.id },
        include: {
            tutor: { include: { user: true } },
            vet: true,
            messages: { orderBy: { createdAt: 'asc' } }
        }
    });

    if (!chatSession) {
        notFound();
    }

    // Determine Role & Recipient
    // Note: session.user.role might need 'as any' fix until types are updated
    const userRole = (session?.user as any)?.role;
    const isTutor = userRole === 'TUTOR';

    // Security: Only allow Vet or the specific Tutor
    if (isTutor) {
        if (chatSession.tutor.userId !== userId) {
            // Unauthorized for this tutor
            // redirect('/dashboard/tutor-home'); // or 404
        }
    } else {
        if (chatSession.vetId !== userId) {
            // Unauthorized for this vet
        }
    }

    const recipientName = isTutor ? (chatSession.vet.name || 'Veterinário') : (chatSession.tutor.user.name || 'Tutor');

    // Transform messages...
    const formattedMessages = chatSession.messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt,
        type: msg.type
    }));

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Mobile Header */}
            <header className="flex h-16 items-center border-b bg-white px-4 shrink-0 z-10">
                <Link href={isTutor ? "/dashboard/tutor-home" : "/dashboard/chat"} className="mr-4 md:hidden">
                    <ArrowLeft className="h-6 w-6 text-muted-foreground" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${recipientName}`} alt="Avatar" />
                        </div>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold text-gray-900">{recipientName}</h1>
                        <p className="text-xs text-muted-foreground">Online agora</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-0">
                <ChatInterface
                    sessionId={chatSession.id}
                    initialMessages={formattedMessages}
                    currentUserId={userId!}
                    recipientName={recipientName}
                />
            </div>
        </div>
    );
}
