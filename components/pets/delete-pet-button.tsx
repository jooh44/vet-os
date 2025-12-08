'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deletePet } from "@/app/lib/actions/pet-actions";
import { useRouter } from "next/navigation";

interface DeletePetButtonProps {
    petId: string;
    petName: string;
    redirectOnDelete?: string; // Optional URL to redirect after delete (e.g., back to list)
}

export function DeletePetButton({ petId, petName, redirectOnDelete = '/dashboard/patients' }: DeletePetButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deletePet(petId);
            if (result.success) {
                setOpen(false);
                if (redirectOnDelete) {
                    router.push(redirectOnDelete);
                }
            } else {
                alert('Erro ao excluir pet: ' + (result.message || 'Erro desconhecido'));
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Pet</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir <strong>{petName}</strong>?
                        <br />
                        Esta ação excluirá também todo o histórico médico e agendamentos deste pet.
                        <br />
                        <strong>Esta ação é irreversível.</strong>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
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
    );
}
