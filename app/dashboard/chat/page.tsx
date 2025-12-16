import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { MessageSquare } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ChatRootPage() {
    const session = await auth();
    const user = session?.user;

    if (!user) return <div>Unauthorized</div>;

    // --- TUTOR LOGIC ---
    if ((user as any).role === 'TUTOR') {
        const tutor = await prisma.tutor.findFirst({ where: { userId: user.id } });
        if (!tutor) return <div>Perfil de tutor não encontrado.</div>;

        const chatSession = await prisma.chatSession.findFirst({
            where: { tutorId: tutor.id, status: 'OPEN' }
        });

        if (chatSession) {
            redirect(`/dashboard/chat/${chatSession.id}`);
        } else {
            return (
                <div className="flex h-full items-center justify-center flex-col gap-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground" />
                    <p>Você não tem nenhum chat ativo com seu veterinário.</p>
                </div>
            );
        }
    }

    // --- VET LOGIC ---
    // (Existing Logic)
    let vetId = user.id;
    // Dev fallback if needed, but assuming user.id is valid

    const chats = await prisma.chatSession.findMany({
        where: { vetId: vetId },
        include: {
            tutor: { include: { user: true } },
            messages: { orderBy: { createdAt: 'desc' }, take: 1 }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <>
            {/* Mobile View: Show List */}
            <div className="md:hidden h-full">
                <ChatSidebar chats={chats} className="border-none w-full" />
            </div>

            {/* Desktop View: Show Placeholder (Sidebar is in Layout) */}
            <div className="hidden md:flex flex-col items-center justify-center h-full text-muted-foreground bg-gray-50/50">
                <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <MessageSquare className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="font-semibold text-lg text-gray-700">Suas Conversas</h3>
                <p className="text-sm max-w-xs text-center mt-2">
                    Selecione um contato ao lado para iniciar o atendimento via Telemedicina.
                </p>
            </div>
        </>
    );
}
