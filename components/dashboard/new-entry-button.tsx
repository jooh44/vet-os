'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Plus, Stethoscope, Calendar, Dog, UserPlus } from "lucide-react"
import Link from 'next/link'

export function NewEntryButton({ className, size = "default", variant = "default" }: { className?: string, size?: "default" | "sm" | "lg" | "icon", variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className={className} size={size} variant={variant}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Entrada
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Ações Rápidas</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <Link href="/dashboard/consultation">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                        <Stethoscope className="h-4 w-4 text-green-600" />
                        <span>Nova Consulta</span>
                    </DropdownMenuItem>
                </Link>

                <Link href="/dashboard/agenda">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>Novo Agendamento</span>
                    </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <Link href="/dashboard/tutors">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                        <UserPlus className="h-4 w-4 text-orange-600" />
                        <span>Novo Tutor</span>
                    </DropdownMenuItem>
                </Link>

                <Link href="/dashboard/tutors">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                        <Dog className="h-4 w-4 text-orange-600" />
                        <span>Novo Paciente</span>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
