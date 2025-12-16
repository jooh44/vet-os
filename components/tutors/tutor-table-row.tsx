'use client';

import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { MoreHorizontal, Pencil, Trash2, Link as LinkIcon, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getInviteLink } from "@/lib/portal-actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useTransition } from "react"
import { deleteTutor } from "@/app/lib/actions/tutor-actions"
import { EditTutorDialog } from "./edit-tutor-dialog"

interface TutorTableRowProps {
    tutor: {
        id: string
        userId: string
        cpf: string
        phone: string | null
        address: string | null
        user: {
            name: string | null
        }
        pets: {
            id: string
            name: string
        }[]
    }
}

export function TutorTableRow({ tutor }: TutorTableRowProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleRowClick = () => {
        router.push(`/dashboard/tutors/${tutor.userId}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        startTransition(async () => {
            const result = await deleteTutor(tutor.id);
            if (result.success) {
                setIsDeleteDialogOpen(false);
            } else {
                alert('Erro ao excluir tutor: ' + (result.message || 'Erro desconhecido'));
            }
        });
    };

    const handleInvite = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Keep menu open? or close?
        // Actually, preventing default on menu item might be tricky.
        // Let's just do the logic.

        try {
            const link = await getInviteLink(tutor.id);
            if (link) {
                await navigator.clipboard.writeText(link);
                alert("Link de convite copiado para a área de transferência!");
            } else {
                alert("Erro ao gerar link de convite.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao copiar link.");
        }
    };

    return (
        <>
            <TableRow
                onClick={handleRowClick}
                className="cursor-pointer hover:bg-muted/50 transition-colors group"
            >
                <TableCell>
                    <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tutor.user.name}`} />
                        <AvatarFallback>{tutor.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{tutor.user.name}</span>
                        <span className="text-xs text-muted-foreground md:hidden">{tutor.cpf}</span>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{tutor.cpf}</TableCell>
                <TableCell className="hidden md:table-cell">{tutor.phone || '-'}</TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {tutor.pets.map((pet) => (
                            <Badge key={pet.id} variant="secondary" className="text-xs">
                                {pet.name}
                            </Badge>
                        ))}
                        {tutor.pets.length === 0 && <span className="text-xs text-muted-foreground">Sem pets</span>}
                    </div>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/tutors/${tutor.userId}`)}>
                                Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleInvite}>
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Copiar Convite
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            {/* Edit Dialog */}
            <EditTutorDialog
                tutor={tutor}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Excluir Tutor</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir <strong>{tutor.user.name}</strong>?
                            <br />
                            Esta ação excluirá também <strong>todos os {tutor.pets.length} pets</strong> deste tutor e seus respectivos históricos.
                            <br />
                            <strong>Esta ação é irreversível.</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteDialogOpen(false);
                            }}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? 'Excluindo...' : 'Excluir'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
