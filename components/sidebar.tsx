'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Dog,
    FileText,
    MessageSquare,
    Search,
    Settings,
    LogOut,
    Sparkles
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const mockLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
    { name: 'Pacientes', href: '/dashboard/patients', icon: Dog },
    { name: 'Tutores', href: '/dashboard/tutors', icon: Users },
    { name: 'Prontuários', href: '/dashboard/records', icon: FileText },
    { name: 'Consulta Inteligente', href: '/dashboard/consultation', icon: Sparkles },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col bg-card border-r border-border shadow-sm">
            <div className="flex h-20 items-center justify-center border-b border-border px-6">
                <h1 className="text-2xl font-bold text-primary">Vet.OS</h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-4">
                    {mockLinks.map((link) => {
                        const LinkIcon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary",
                                    (link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href))
                                        ? "bg-accent text-accent-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted"
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
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-primary"
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </button>
            </div>
        </div>
    );
}
