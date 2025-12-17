'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, User, MessageCircle, Video, MoreVertical, FileText, Edit, XCircle, Sparkles } from "lucide-react";
import { format } from "date-fns";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cancelAppointment, startChatWithTutor } from '@/app/lib/actions/appointment-actions';
import { useState } from 'react';

// Define a type that matches what getDayAppointments returns
// For simplicity, we can trust the passed object structure or define interface
interface AppointmentProps {
    appointment: any; // Using any for speed, but ideally generated Prisma type
}

export function AppointmentCard({ appointment: apt }: AppointmentProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleChatClick = async () => {
        const tutorId = apt.pet?.tutor?.id;
        if (!tutorId) {
            alert('Tutor não encontrado');
            return;
        }

        setLoading(true);
        try {
            const result = await startChatWithTutor(tutorId);
            if (result.success && result.chatId) {
                router.push(`/dashboard/chat/${result.chatId}`);
            } else {
                alert(result.error || "Erro ao abrir chat");
            }
        } catch (e) {
            console.error(e);
            alert("Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

        setLoading(true);
        try {
            const result = await cancelAppointment(apt.id);
            if (result.success) {
                // Success - Realtime or Server Action revalidate will handle UI
            } else {
                alert(result.error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="group hover:shadow-md transition-all border-l-4 border-l-primary/60 hover:border-l-primary">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Time Box */}
                    <div className="flex flex-col items-center justify-center min-w-[3.5rem] py-1 px-2 bg-gray-100 rounded-lg text-gray-700 font-mono text-sm">
                        <span className="font-bold">{format(new Date(apt.date), 'HH:mm')}</span>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {apt.title}
                            {/* Status Badge */}
                            {apt.status === 'CONFIRMED' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Confirmado</span>}
                            {apt.status === 'SCHEDULED' && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Agendado</span>}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{apt.pet?.name} <span className="opacity-50">({apt.pet?.tutor?.user?.name || "Tutor"})</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0 justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                        onClick={handleChatClick}
                        disabled={loading}
                        title="Abrir Chat"
                    >
                        <MessageCircle className="h-4 w-4" />
                    </Button>

                    <Link href={`/dashboard/consultation?petId=${apt.petId}&petName=${encodeURIComponent(apt.pet?.name || '')}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm border-0">
                            <Sparkles className="h-3 w-3" />
                            Iniciar Consulta
                        </Button>
                    </Link>

                    {apt.meetUrl ? (
                        <Link href={apt.meetUrl} target="_blank">
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                <Video className="h-3 w-3" />
                                Entrar
                            </Button>
                        </Link>
                    ) : (
                        <Button size="sm" variant="outline" className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                            <Video className="h-3 w-3" />
                            Criar Sala
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>

                            <Link href={`/dashboard/records/${apt.id}`}>
                                <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" /> Ver Prontuário
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem onClick={() => alert("Funcionalidade em desenvolvimento.")}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleCancel}>
                                <XCircle className="mr-2 h-4 w-4" /> Cancelar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
