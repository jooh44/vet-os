import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { UserNav } from './user-nav';

export default async function Header() {
    const session = await auth();

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6 lg:h-[60px]">
            <div className="w-full flex-1">
                <h2 className="text-lg font-semibold md:text-xl text-primary">
                    Visão Geral
                </h2>
            </div>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8 rounded-full">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <UserNav />
            <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{session?.user?.name || session?.user?.email}</span>
                <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
            </div>
        </header>
    );
}
