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
import { useState } from 'react';

export default function CreatePetForm({ tutorId }: { tutorId: string }) {
    const initialState = { message: null, errors: {} };
    const createPetWithId = createPet.bind(null, tutorId);
    // @ts-ignore
    const [state, dispatch] = useFormState(createPetWithId, initialState);
    const [species, setSpecies] = useState('');

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Novo Pet (v.Fix3)</CardTitle>
                <CardDescription>
                    Cadastre um novo paciente para este tutor.
                </CardDescription>
            </CardHeader>
            <form action={dispatch}>
                {/* Hidden input for species to ensure form submission works */}
                <input type="hidden" name="species" value={species} />

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
                            <select
                                id="species-select"
                                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={species}
                                onChange={(e) => setSpecies(e.target.value)}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="DOG">Cachorro</option>
                                <option value="CAT">Gato</option>
                                <option value="BIRD">Pássaro</option>
                                <option value="OTHER">Outro</option>
                            </select>
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
                            <Input id="birthDate" name="birthDate" type="text" placeholder="DD/MM/AAAA" />
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
