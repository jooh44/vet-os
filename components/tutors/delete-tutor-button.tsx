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
import { deleteTutor } from "@/app/lib/actions/tutor-actions";
import { useRouter } from "next/navigation";

interface DeleteTutorButtonProps {
    tutorId: string;
    tutorName: string; // User name
    petCount: number;
    redirectOnDelete?: string;
}

export function DeleteTutorButton({ tutorId, tutorName, petCount, redirectOnDelete = '/dashboard/tutors' }: DeleteTutorButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteTutor(tutorId);
            if (result.success) {
                setOpen(false);
                if (redirectOnDelete) {
                    router.push(redirectOnDelete);
                }
            } else {
                alert('Erro ao excluir tutor: ' + (result.message || 'Erro desconhecido'));
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
                    <DialogTitle>Excluir Tutor</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir <strong>{tutorName}</strong>?
                        <br />
                        Esta ação excluirá também <strong>todos os {petCount} pets</strong> deste tutor e seus históricos.
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
