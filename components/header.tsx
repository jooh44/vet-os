import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUser, Bell } from 'lucide-react';

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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Perfil</DropdownMenuItem>
                    <DropdownMenuItem>Configurações</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Sair</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{session?.user?.name || session?.user?.email}</span>
                <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
            </div>
        </header>
    );
}
