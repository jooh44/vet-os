'use client';

import { useFormState } from 'react-dom';
import { createPet } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreatePetForm({ tutorId }: { tutorId: string }) {
    const initialState = { message: null, errors: {} };
    const createPetWithId = createPet.bind(null, tutorId);
    // @ts-ignore
    const [state, dispatch] = useFormState(createPetWithId, initialState);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Novo Pet</CardTitle>
                <CardDescription>
                    Cadastre um novo paciente para este tutor.
                </CardDescription>
            </CardHeader>
            <form action={dispatch}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome do Pet</Label>
                        <Input id="name" name="name" placeholder="Ex: Rex" required />
                        {state.errors?.name && (
                            <p className="text-sm text-red-500">{state.errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="species">Espécie</Label>
                            <Select name="species" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DOG">Cachorro</SelectItem>
                                    <SelectItem value="CAT">Gato</SelectItem>
                                    <SelectItem value="BIRD">Pássaro</SelectItem>
                                    <SelectItem value="OTHER">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                            {state.errors?.species && (
                                <p className="text-sm text-red-500">{state.errors.species}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="breed">Raça</Label>
                            <Input id="breed" name="breed" placeholder="Ex: Golden Retriever" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="birthDate">Data de Nascimento</Label>
                            <Input id="birthDate" name="birthDate" type="date" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="weight">Peso (kg)</Label>
                            <Input id="weight" name="weight" type="number" step="0.1" placeholder="0.0" />
                            {state.errors?.weight && (
                                <p className="text-sm text-red-500">{state.errors.weight}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="photo">Foto do Pet</Label>
                        <Input id="photo" name="photo" type="file" accept="image/*" />
                    </div>

                    {state.message && (
                        <p className="text-sm text-red-500 mt-2">
                            {state.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href={`/dashboard/tutors`}>
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit">Cadastrar Pet</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
