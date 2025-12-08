'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';
import { updateTutor } from '@/app/lib/actions/tutor-actions';

interface EditTutorDialogProps {
    tutor: {
        id: string;
        cpf: string;
        phone: string | null;
        address: string | null;
    };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function EditTutorDialog({ tutor, open: externalOpen, onOpenChange: externalOnOpenChange, children }: EditTutorDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const isControlled = externalOpen !== undefined;
    const open = isControlled ? externalOpen : internalOpen;
    const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        formData.append('id', tutor.id);

        const res = await updateTutor(formData);
        setLoading(false);

        if (res?.error) {
            alert(res.error);
        } else {
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    {children || (
                        <Button variant="outline" size="sm" className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Editar
                        </Button>
                    )}
                </DialogTrigger>
            )}
            {isControlled && children && (
                <DialogTrigger asChild>{children}</DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Tutor</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Telefone
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            defaultValue={tutor.phone || ''}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            Endereço
                        </Label>
                        <Input
                            id="address"
                            name="address"
                            defaultValue={tutor.address || ''}
                            className="col-span-3"
                        />
                    </div>
                    {/* CPF is usually unique/fixed, but let's allow edit if needed or just display */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cpf" className="text-right">
                            CPF
                        </Label>
                        <Input
                            id="cpf"
                            name="cpf"
                            defaultValue={tutor.cpf}
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
