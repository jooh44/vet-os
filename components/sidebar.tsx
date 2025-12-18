'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Home,
    Users,
    Calendar,
    Dog,
    FileText,
    MessageSquare,
    Search,
    Settings,
    LogOut,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const vetLinks = [
    { name: 'Início', href: '/dashboard', icon: Home },
    { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
    { name: 'Pacientes', href: '/dashboard/patients', icon: Dog },
    { name: 'Tutores', href: '/dashboard/tutors', icon: Users },
    { name: 'Prontuários', href: '/dashboard/records', icon: FileText },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Consulta Inteligente', href: '/dashboard/consultation', icon: Sparkles },
];

const tutorLinks = [
    { name: 'Meus Pets', href: '/dashboard/tutor-home', icon: Dog },
    { name: 'Chat com Vet', href: '/dashboard/chat', icon: MessageSquare },
];

export default function Sidebar({ userRole }: { userRole?: string }) {
    const pathname = usePathname();

    const links = userRole === 'TUTOR' ? tutorLinks : vetLinks;

    return (
        <div className="flex h-full flex-col bg-card border-r border-border shadow-sm">
            <div className="flex h-20 items-center justify-center border-b border-border px-6 gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-3xl font-normal text-primary flex items-center gap-2">
                    Vet.OS <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tracking-wider">BETA v.Fix2</span>
                </h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-4">
                    {links.map((link) => {
                        const LinkIcon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                    (link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href))
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                                )}
                            >
                                <LinkIcon className="h-4 w-4" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t border-border p-4">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-primary"
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </button>
            </div>
        </div>
    );
}
