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
import { updatePet } from '@/app/lib/actions/pet-actions';

interface EditPetDialogProps {
    pet: {
        id: string;
        name: string;
        species: string;
        breed: string | null;
        weight: number | null;
        birthDate: Date | null;
        notes: string | null;
        allergies: string | null;
    };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function EditPetDialog({ pet, open: externalOpen, onOpenChange: externalOnOpenChange, children }: EditPetDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const isControlled = externalOpen !== undefined;
    const open = isControlled ? externalOpen : internalOpen;
    const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        formData.append('id', pet.id);

        const res = await updatePet(formData);
        setLoading(false);

        if (res?.error) {
            alert(res.error);
        } else {
            setOpen(false);
        }
    }

    // Format date for input type="date"
    const birthDateStr = pet.birthDate
        ? new Date(pet.birthDate).toISOString().split('T')[0]
        : '';

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
            {/* If controlled and children passed (like a MenuItem), we might utilize it as a trigger too, but usually controlled implies state handling elsewhere. 
                However, for flexibility: */}
            {isControlled && children && (
                <DialogTrigger asChild>{children}</DialogTrigger>
            )}
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar Pet</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" name="name" defaultValue={pet.name} required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="species">Espécie</Label>
                            {/* Simple select or input for now. Schema is Enum but string works if matched. */}
                            <select
                                id="species"
                                name="species"
                                defaultValue={pet.species}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="DOG">Cachorro</option>
                                <option value="CAT">Gato</option>
                                <option value="BIRD">Ave</option>
                                <option value="OTHER">Outro</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="breed">Raça</Label>
                            <Input id="breed" name="breed" defaultValue={pet.breed || ''} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="weight">Peso (kg)</Label>
                            <Input id="weight" name="weight" step="0.1" type="number" defaultValue={pet.weight || ''} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Input id="birthDate" name="birthDate" type="date" defaultValue={birthDateStr} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="allergies">Alergias (separar por vírgula)</Label>
                        <Input id="allergies" name="allergies" defaultValue={pet.allergies || ''} placeholder="Ex: Frango, Dipirona" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea id="notes" name="notes" defaultValue={pet.notes || ''} />
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
