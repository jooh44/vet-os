import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { redirect } from 'next/navigation';

export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userId = session?.user?.id;
    // Dev fallback
    if (!userId) {
        // ... (can keep fallback logic but clearer)
    }

    // ...

    const userRole = (session?.user as any)?.role;
    let chats: any[] = [];

    if (userRole === 'TUTOR') {
        const tutorProfile = await prisma.tutor.findFirst({ where: { userId: userId } });
        if (tutorProfile) {
            chats = await prisma.chatSession.findMany({
                where: { tutorId: tutorProfile.id },
                include: {
                    tutor: { include: { user: true } },
                    vet: true,
                    messages: { orderBy: { createdAt: 'desc' }, take: 1 }
                },
                orderBy: { updatedAt: 'desc' }
            });
        }
    } else {
        // Default to Vet view (also handles ADMIN/ATTENDANT potentially)
        chats = await prisma.chatSession.findMany({
            where: { vetId: userId },
            include: {
                tutor: { include: { user: true } },
                vet: true,
                messages: { orderBy: { createdAt: 'desc' }, take: 1 }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-9rem)] overflow-hidden rounded-lg border bg-white shadow-sm">
            {/* Sidebar - Hidden on mobile if detail is active? 
                Actually, the 'children' (Page) will render.
                We can just render Sidebar on desktop always, and on mobile only if root.
                But layout renders ONCE. 
                
                Strategy:
                - Desktop: Sidebar (w-1/3) | Children (w-2/3)
                - Mobile: Children only (if child matches /text). If root, show list.
                
                Actually, CSS Grid is best.
             */}

            <div className="hidden md:flex flex-col w-80 lg:w-96 border-r">
                <ChatSidebar chats={chats} currentUserId={userId!} className="h-full border-none" />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                {children}
            </div>
        </div>
    );
}
