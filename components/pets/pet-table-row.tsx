'use client';

import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { PawPrint, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
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
import { deletePet } from "@/app/lib/actions/pet-actions"
import { EditPetDialog } from "./edit-pet-dialog"

interface PetTableRowProps {
    pet: {
        id: string
        name: string
        species: string
        breed: string | null
        photoUrl: string | null
        weight: number | null;
        birthDate: Date | null;
        allergies: string | null;
        notes: string | null;
        tutorId: string
        tutor: {
            user: {
                name: string | null
            }
        }
    }
}

export function PetTableRow({ pet }: PetTableRowProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleRowClick = () => {
        router.push(`/dashboard/pets/${pet.id}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        startTransition(async () => {
            const result = await deletePet(pet.id);
            if (result.success) {
                setIsDeleteDialogOpen(false);
            } else {
                alert('Erro ao excluir pet: ' + (result.message || 'Erro desconhecido'));
            }
        });
    };

    return (
        <>
            <TableRow
                onClick={handleRowClick}
                className="cursor-pointer hover:bg-muted/50 transition-colors group"
            >
                <TableCell>
                    <Avatar>
                        {pet.photoUrl ? (
                            <AvatarImage src={pet.photoUrl} className="object-cover" />
                        ) : (
                            <AvatarFallback>
                                <PawPrint className="h-4 w-4 text-muted-foreground" />
                            </AvatarFallback>
                        )}
                    </Avatar>
                </TableCell>
                <TableCell className="font-medium">{pet.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{pet.species}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{pet.breed || '-'}</TableCell>
                <TableCell>
                    <div
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Link href={`/dashboard/tutors/${pet.tutorId}`} className="hover:underline">
                            {pet.tutor.user.name || 'Sem nome'}
                        </Link>
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
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/patients/${pet.id}`)}>
                                Ver Detalhes
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
            <EditPetDialog
                pet={pet}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Excluir Pet</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir <strong>{pet.name}</strong>?
                            <br />
                            Esta ação excluirá também todo o histórico médico e agendamentos deste pet.
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
