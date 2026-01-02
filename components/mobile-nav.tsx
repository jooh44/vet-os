'use client';
import { cn } from '@/lib/utils';
import { Home, Users, Dog, Sparkles, Calculator, Pill, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
    const pathname = usePathname();

    const links = [
        { name: 'Início', href: '/dashboard', icon: Home },
        { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
        { name: 'Pacientes', href: '/dashboard/patients', icon: Dog },
        { name: 'Tutores', href: '/dashboard/tutors', icon: Users },
        { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
        { name: 'Consulta', href: '/dashboard/consultation', icon: Sparkles, highlight: true },
        // Placeholder links for tools that we are about to build
        //{ name: 'Tools', href: '/dashboard/tools', icon: Calculator },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {links.map((link) => {
                    const isActive = link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 text-[10px] font-medium transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground",
                                link.highlight && "text-primary font-bold"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-full transition-all",
                                link.highlight && "bg-primary/10 mb-1"
                            )}>
                                <Icon className={cn("h-6 w-6", link.highlight && "h-7 w-7")} />
                            </div>
                            {link.name}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
